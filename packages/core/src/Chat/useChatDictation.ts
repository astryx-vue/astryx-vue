import type { Ref } from 'vue'
import type { ChatComposerInputHandle } from './types.js'
import type { UseSpeechRecognitionOptions, UseSpeechRecognitionReturn } from './useSpeechRecognition.js'
import { onScopeDispose, ref } from 'vue'
import { useSpeechRecognition } from './useSpeechRecognition.js'
import { getSharedAudioContext, playDictationStart, playDictationStop } from './volumeAnalyser.js'

export interface UseChatDictationOptions extends Omit<UseSpeechRecognitionOptions, 'trackVolume' | 'onVolumeSample'> {
  /** Play a short tone when listening starts and stops. @default false */
  hasSounds?: boolean
  /**
   * When set, interim words appear in the composer and a final phrase is inserted.
   * Omit it to receive transcripts only through the callbacks.
   */
  input?: Ref<ChatComposerInputHandle | null>
}

const CAPS_VOLUME = 0.15
const CAPS_SAMPLES = 10
const VOLUME_HISTORY = 30

function composerEditable(): HTMLElement | null {
  const active = document.activeElement
  if (active instanceof HTMLElement && active.getAttribute('contenteditable') === 'true')
    return active
  return document.querySelector<HTMLElement>(
    '.astryx-chat-composer-input [contenteditable="true"], [role="textbox"][contenteditable="true"]',
  )
}

function audioContextOf(explicit?: AudioContext): AudioContext {
  return explicit ?? getSharedAudioContext()
}

/**
 * Voice input for the composer.
 *
 * Uses the browser SpeechRecognition API. Sustained loud speech is written in
 * capitals. Pass `input` to drop interim text into ChatComposerInput.
 */
export function useChatDictation(options: UseChatDictationOptions = {}): UseSpeechRecognitionReturn {
  const history: number[] = []
  const interimSpan = ref<HTMLSpanElement | null>(null)
  const hasSounds = options.hasSounds ?? false

  function onVolumeSample(level: number): void {
    history.push(level)
    if (history.length > VOLUME_HISTORY)
      history.shift()
  }

  function transformTranscript(text: string): string {
    const rewritten = options.transformTranscript ? options.transformTranscript(text) : text
    const average = history.length > 0 ? history.reduce((sum, value) => sum + value, 0) / history.length : 0
    if (average >= CAPS_VOLUME && history.length >= CAPS_SAMPLES)
      return rewritten.toUpperCase()
    return rewritten
  }

  function removeInterim(): void {
    const span = interimSpan.value
    if (span?.isConnected)
      span.remove()
    interimSpan.value = null
  }

  function insertInterim(): HTMLSpanElement | null {
    const editable = composerEditable()
    if (!editable)
      return null
    const span = document.createElement('span')
    span.setAttribute('data-astryx-dictation-interim', '')
    span.contentEditable = 'false'
    span.className = 'astryx-chat-composer-input__interim'
    editable.append(span)
    interimSpan.value = span
    editable.dispatchEvent(new Event('input', { bubbles: true }))
    return span
  }

  const speech = useSpeechRecognition({
    lang: options.lang,
    continuous: options.continuous,
    interimResults: options.interimResults,
    audioContext: options.audioContext,
    onError: options.onError,
    transformTranscript,
    onVolumeSample,
    onTranscript: (transcript, isFinal) => {
      if (options.input) {
        if (isFinal) {
          removeInterim()
          const handle = options.input.value
          if (handle) {
            handle.focus()
            handle.insertText(`${transcript} `)
          }
          options.onResult?.(transcript)
          insertInterim()
        }
        else if (interimSpan.value) {
          interimSpan.value.textContent = transcript
        }
        else {
          const span = insertInterim()
          if (span)
            span.textContent = transcript
        }
      }
      options.onTranscript?.(transcript, isFinal)
    },
    onResult: options.input ? undefined : options.onResult,
    onStart: () => {
      if (hasSounds)
        playDictationStart(() => audioContextOf(options.audioContext))
      if (options.input)
        insertInterim()
      options.onStart?.()
    },
    onEnd: () => {
      if (hasSounds)
        playDictationStop(() => audioContextOf(options.audioContext))
      if (options.input) {
        removeInterim()
        composerEditable()?.dispatchEvent(new Event('input', { bubbles: true }))
      }
      history.length = 0
      options.onEnd?.()
    },
  })

  onScopeDispose(removeInterim)

  return speech
}
