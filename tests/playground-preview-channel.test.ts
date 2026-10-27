import { describe, expect, it } from 'vitest'
import {
  acceptFrameMessage,
  acceptHostMessage,
  createPreviewNonce,
  previewFrameSrc,
  readPreviewNonce,
} from '../apps/docs/components/playground/previewChannel'
import { PLAYGROUND_CHANNEL } from '../apps/docs/components/playground/protocol'

const ORIGIN = 'https://docs.example.com'
const NONCE = 'a'.repeat(32)
const frameWindow = { name: 'frame' } as unknown as MessageEventSource
const otherWindow = { name: 'other' } as unknown as MessageEventSource

function event(data: unknown, source: MessageEventSource | null, origin = ORIGIN) {
  return { data, origin, source }
}

const okMessage = { channel: PLAYGROUND_CHANNEL, type: 'ok' as const, nonce: NONCE }
const renderMessage = {
  channel: PLAYGROUND_CHANNEL,
  type: 'render' as const,
  nonce: NONCE,
  css: '',
  colorMode: 'light' as const,
  fontHref: null,
  locale: 'en' as const,
  code: '<template><p /></template>',
  mountId: 0,
}

describe('preview channel nonce', () => {
  it('creates a fresh 32-character hex nonce each time', () => {
    const first = createPreviewNonce()
    expect(first).toMatch(/^[0-9a-f]{32}$/)
    expect(first).not.toBe(createPreviewNonce())
  })

  it('round-trips the nonce through the frame src fragment', () => {
    const src = previewFrameSrc('/playground/frame', NONCE)
    expect(src).toBe(`/playground/frame#nonce=${NONCE}`)
    expect(readPreviewNonce(new URL(src, ORIGIN).hash)).toBe(NONCE)
  })

  it('returns null when the address carries no nonce', () => {
    expect(readPreviewNonce('')).toBeNull()
    expect(readPreviewNonce('#other=1')).toBeNull()
  })
})

describe('acceptFrameMessage', () => {
  const trust = { peer: frameWindow, origin: ORIGIN, nonce: NONCE }

  it('accepts a message from this frame window with the current nonce', () => {
    expect(acceptFrameMessage(event(okMessage, frameWindow), trust)).toEqual(okMessage)
  })

  it('ignores a message from another window', () => {
    expect(acceptFrameMessage(event(okMessage, otherWindow), trust)).toBeNull()
    expect(acceptFrameMessage(event(okMessage, null), trust)).toBeNull()
  })

  it('ignores a message from another origin', () => {
    expect(acceptFrameMessage(event(okMessage, frameWindow, 'https://evil.example'), trust)).toBeNull()
  })

  it('ignores a message without the current nonce', () => {
    expect(acceptFrameMessage(event({ ...okMessage, nonce: 'b'.repeat(32) }, frameWindow), trust)).toBeNull()
    expect(acceptFrameMessage(event({ channel: PLAYGROUND_CHANNEL, type: 'ok' }, frameWindow), trust)).toBeNull()
  })

  it('ignores anything that is not a frame message', () => {
    expect(acceptFrameMessage(event(renderMessage, frameWindow), trust)).toBeNull()
    expect(acceptFrameMessage(event({ channel: 'other', type: 'ok', nonce: NONCE }, frameWindow), trust)).toBeNull()
    expect(acceptFrameMessage(event('ok', frameWindow), trust)).toBeNull()
  })

  it('ignores every message before the frame has been issued a nonce', () => {
    expect(acceptFrameMessage(event(okMessage, frameWindow), { ...trust, nonce: null })).toBeNull()
  })
})

describe('acceptHostMessage', () => {
  const parentWindow = { name: 'parent' } as unknown as MessageEventSource
  const trust = { peer: parentWindow, origin: ORIGIN, nonce: NONCE }

  it('accepts a render message from this page parent', () => {
    expect(acceptHostMessage(event(renderMessage, parentWindow), trust)).toEqual(renderMessage)
  })

  it('ignores a message from another window, origin or nonce', () => {
    expect(acceptHostMessage(event(renderMessage, otherWindow), trust)).toBeNull()
    expect(acceptHostMessage(event(renderMessage, parentWindow, 'https://evil.example'), trust)).toBeNull()
    expect(acceptHostMessage(event({ ...renderMessage, nonce: 'c'.repeat(32) }, parentWindow), trust)).toBeNull()
  })

  it('ignores every message when the frame was opened without a nonce', () => {
    expect(acceptHostMessage(event(renderMessage, parentWindow), { ...trust, nonce: null })).toBeNull()
  })

  it('ignores frame messages and unknown payloads', () => {
    expect(acceptHostMessage(event(okMessage, parentWindow), trust)).toBeNull()
    expect(acceptHostMessage(event({ channel: PLAYGROUND_CHANNEL, type: 'run', nonce: NONCE }, parentWindow), trust)).toBeNull()
  })
})
