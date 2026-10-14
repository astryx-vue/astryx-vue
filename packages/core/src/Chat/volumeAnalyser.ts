export interface VolumeAnalyser {
  getVolume: () => number
  getBands: (count: number) => number[]
  getRawBands: (count: number) => number[]
  cleanup: () => void
}

const VOICE_SPLITS = [3, 6, 11, 18]
const CALIBRATION_FRAMES = 60

let sharedAudio: AudioContext | null = null

export function getSharedAudioContext(): AudioContext {
  if (!sharedAudio || sharedAudio.state === 'closed')
    sharedAudio = new AudioContext()
  if (sharedAudio.state === 'suspended')
    void sharedAudio.resume()
  return sharedAudio
}

export async function createVolumeAnalyser(getContext: () => AudioContext): Promise<VolumeAnalyser | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioContext = getContext()
    const source = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.5
    source.connect(analyser)

    const data = new Uint8Array(analyser.frequencyBinCount)
    const noiseFloor = new Float32Array(analyser.frequencyBinCount)
    let samples = 0

    function calibrate(): void {
      analyser.getByteFrequencyData(data)
      samples += 1
      for (let index = 0; index < data.length; index += 1) {
        const value = (data[index] ?? 0) / 255
        if (value > (noiseFloor[index] ?? 0))
          noiseFloor[index] = value
      }
    }

    function cleanBin(index: number): number {
      const raw = (data[index] ?? 0) / 255
      if (samples < CALIBRATION_FRAMES)
        return 0
      return Math.max(0, raw - (noiseFloor[index] ?? 0) * 1.1)
    }

    function splitsFor(count: number): number[] {
      const voice = [...VOICE_SPLITS, data.length]
      return count <= voice.length ? voice.slice(0, count) : voice
    }

    function bandsFrom(count: number, read: (index: number) => number): number[] {
      const bands: number[] = []
      const splits = splitsFor(count)
      let start = 1
      for (const end of splits) {
        let sum = 0
        for (let index = start; index < end; index += 1)
          sum += read(index)
        bands.push(sum / (end - start))
        start = end
      }
      return bands
    }

    return {
      getVolume() {
        analyser.getByteFrequencyData(data)
        if (samples < CALIBRATION_FRAMES)
          calibrate()
        let sum = 0
        for (let index = 0; index < data.length; index += 1)
          sum += cleanBin(index)
        return sum / data.length
      },
      getBands(count) {
        analyser.getByteFrequencyData(data)
        if (samples < CALIBRATION_FRAMES)
          calibrate()
        return bandsFrom(count, cleanBin)
      },
      getRawBands(count) {
        analyser.getByteFrequencyData(data)
        return bandsFrom(count, index => (data[index] ?? 0) / 255)
      },
      cleanup() {
        source.disconnect()
        for (const track of stream.getTracks())
          track.stop()
      },
    }
  }
  catch {
    return null
  }
}

const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)

function playPlop(frequency: number, delay: number, getContext: () => AudioContext, volume = 0.25): void {
  try {
    const context = getContext()
    const now = context.currentTime
    const duration = frequency < 200 ? 0.18 : 0.06
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency * 1.3, now + delay)
    oscillator.frequency.exponentialRampToValueAtTime(frequency, now + delay + 0.01)
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.93, now + delay + duration)
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.setValueAtTime(volume, now + delay)
    gain.gain.exponentialRampToValueAtTime(volume * 0.2, now + delay + duration * 0.12)
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(now + delay)
    oscillator.stop(now + delay + duration)
  }
  catch {
    // Audio is optional feedback.
  }
}

export function playDictationStart(getContext: () => AudioContext): void {
  if (isIOS)
    return
  playPlop(392, 0, getContext)
  playPlop(523, 0.07, getContext)
}

export function playDictationStop(getContext: () => AudioContext): void {
  if (isIOS)
    return
  playPlop(523, 0, getContext)
  playPlop(392, 0.07, getContext)
}
