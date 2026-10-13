export const PLAYGROUND_CHANNEL = 'astryx-vue-playground'

export type PlaygroundLocale = 'zh' | 'en'
export type PlaygroundColorMode = 'light' | 'dark'

export interface PlaygroundHostMessage {
  channel: typeof PLAYGROUND_CHANNEL
  type: 'render' | 'theme'
  css: string
  colorMode: PlaygroundColorMode
  fontHref: string | null
  locale: PlaygroundLocale
  code: string
  mountId: number
}

export interface PlaygroundFrameMessage {
  channel: typeof PLAYGROUND_CHANNEL
  type: 'ready' | 'error' | 'ok'
  message?: string
}

export function isHostMessage(value: unknown): value is PlaygroundHostMessage {
  if (!value || typeof value !== 'object')
    return false
  const message = value as Partial<PlaygroundHostMessage>
  return message.channel === PLAYGROUND_CHANNEL && (message.type === 'render' || message.type === 'theme')
}

export function isFrameMessage(value: unknown): value is PlaygroundFrameMessage {
  if (!value || typeof value !== 'object')
    return false
  const message = value as Partial<PlaygroundFrameMessage>
  return message.channel === PLAYGROUND_CHANNEL && (message.type === 'ready' || message.type === 'error' || message.type === 'ok')
}
