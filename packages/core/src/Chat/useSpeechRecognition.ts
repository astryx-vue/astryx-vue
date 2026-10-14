import type { ComputedRef } from 'vue'
import type { VolumeAnalyser } from './volumeAnalyser.js'
import { computed, onScopeDispose, ref, shallowRef } from 'vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/index.js'
import { createVolumeAnalyser, getSharedAudioContext } from './volumeAnalyser.js'

export interface SpeechRecognitionError {
  error: string
  message?: string
}

export interface UseSpeechRecognitionOptions {
  /** BCP-47 language tag. Defaults to the active Astryx locale. */
  lang?: string
  /** Keep listening until stop is called. @default true */
  continuous?: boolean
  /** Report partial transcripts. @default true */
  interimResults?: boolean
  /** Shared audio context. A lazy singleton is used when omitted. */
  audioContext?: AudioContext
  /** Rewrite a transcript before it is reported. Runs before dictation's caps lock. */
  transformTranscript?: (text: string) => string
  onTranscript?: (transcript: string, isFinal: boolean) => void
  onResult?: (transcript: string) => void
  onError?: (error: SpeechRecognitionError) => void
  onStart?: () => void
  onEnd?: () => void
  /** Called on each animation frame while the microphone is open. */
  onVolumeSample?: (volume: number) => void
  /**
   * Open one microphone analyser for volume and frequency bands.
   * Dictation listens through `onVolumeSample` and does not open a second microphone.
   * @default true
   */
  trackVolume?: boolean
}

export interface UseSpeechRecognitionReturn {
  isSupported: ComputedRef<boolean>
  isListening: ComputedRef<boolean>
  isSpeaking: ComputedRef<boolean>
  volume: ComputedRef<number>
  bands: ComputedRef<number[]>
  rawBands: ComputedRef<number[]>
  interimTranscript: ComputedRef<string>
  start: () => void
  stop: () => void
  abort: () => void
  toggle: () => void
}

interface SpeechResult {
  isFinal: boolean
  0: { transcript: string }
}

interface SpeechResultEvent {
  resultIndex: number
  results: ArrayLike<SpeechResult>
}

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onstart: (() => void) | null
  onend: (() => void) | null
  onresult: ((event: SpeechResultEvent) => void) | null
  onspeechstart: (() => void) | null
  onspeechend: (() => void) | null
  onerror: ((event: SpeechRecognitionError) => void) | null
  onnomatch: (() => void) | null
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

const SILENT_BANDS = [0, 0, 0, 0, 0]

function speechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined')
    return null
  const host = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null
}

/**
 * Browser speech recognition plus a microphone level.
 * No speech service is bundled: unsupported browsers report `isSupported` false.
 */
export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const locale = useAstryxLocale()
  const messages = useAstryxMessages()
  const continuous = options.continuous ?? true
  const interimResults = options.interimResults ?? true
  const trackVolume = options.trackVolume ?? true

  const isSupported = computed(() => speechRecognitionCtor() != null)
  const isListening = ref(false)
  const isSpeaking = ref(false)
  const volume = ref(0)
  const bands = shallowRef<number[]>([...SILENT_BANDS])
  const rawBands = shallowRef<number[]>([...SILENT_BANDS])
  const interimTranscript = ref('')

  let recognition: SpeechRecognitionLike | null = null
  let analyser: VolumeAnalyser | null = null
  let frame = 0

  const callbacks = {
    onTranscript: options.onTranscript,
    onResult: options.onResult,
    onError: options.onError,
    onStart: options.onStart,
    onEnd: options.onEnd,
    onVolumeSample: options.onVolumeSample,
    transformTranscript: options.transformTranscript,
  }

  function stopVolume(): void {
    cancelAnimationFrame(frame)
    volume.value = 0
    bands.value = [...SILENT_BANDS]
    rawBands.value = [...SILENT_BANDS]
    analyser?.cleanup()
    analyser = null
  }

  function pollVolume(): void {
    const current = analyser
    if (current) {
      const level = current.getVolume()
      volume.value = level
      bands.value = current.getBands(5)
      rawBands.value = current.getRawBands(5)
      callbacks.onVolumeSample?.(level)
    }
    frame = requestAnimationFrame(pollVolume)
  }

  function getContext(): AudioContext {
    return options.audioContext ?? getSharedAudioContext()
  }

  function start(): void {
    const Ctor = speechRecognitionCtor()
    if (!Ctor)
      return
    recognition?.abort()
    const next = new Ctor()
    next.lang = options.lang ?? locale.value
    next.continuous = continuous
    next.interimResults = interimResults

    next.onstart = () => {
      isListening.value = true
      callbacks.onStart?.()
      if (!trackVolume)
        return
      void createVolumeAnalyser(getContext).then((created) => {
        if (!created || recognition !== next)
          return
        analyser = created
        pollVolume()
      })
    }

    next.onend = () => {
      isListening.value = false
      isSpeaking.value = false
      interimTranscript.value = ''
      stopVolume()
      callbacks.onEnd?.()
    }

    next.onspeechstart = () => {
      isSpeaking.value = true
    }
    next.onspeechend = () => {
      isSpeaking.value = false
    }

    next.onresult = (event) => {
      let interim = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        if (!result)
          continue
        let transcript = result[0].transcript
        if (callbacks.transformTranscript)
          transcript = callbacks.transformTranscript(transcript)
        if (result.isFinal) {
          callbacks.onResult?.(transcript)
          callbacks.onTranscript?.(transcript, true)
          interimTranscript.value = ''
        }
        else {
          interim += transcript
        }
      }
      if (interim) {
        interimTranscript.value = interim
        callbacks.onTranscript?.(interim, false)
      }
    }

    next.onerror = (event) => {
      callbacks.onError?.(event)
    }

    next.onnomatch = () => {
      callbacks.onError?.({
        error: 'no-speech',
        message: messages.value.chat.noSpeechDetected,
      })
    }

    recognition = next
    next.start()
  }

  function stop(): void {
    recognition?.stop()
  }

  function abort(): void {
    recognition?.abort()
    stopVolume()
  }

  function toggle(): void {
    if (isListening.value)
      stop()
    else
      start()
  }

  onScopeDispose(() => {
    recognition?.abort()
    recognition = null
    stopVolume()
  })

  return {
    isSupported,
    isListening: computed(() => isListening.value),
    isSpeaking: computed(() => isSpeaking.value),
    volume: computed(() => volume.value),
    bands: computed(() => bands.value),
    rawBands: computed(() => rawBands.value),
    interimTranscript: computed(() => interimTranscript.value),
    start,
    stop,
    abort,
    toggle,
  }
}
