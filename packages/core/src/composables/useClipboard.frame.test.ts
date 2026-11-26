import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountComposable } from './testing/mountComposable.js'
import { resetLiveRegionsForTest } from './testing/resetLiveRegions.js'
import { useClipboard } from './useClipboard.js'

type PolicyDocument = Document & { permissionsPolicy?: unknown, execCommand: Document['execCommand'] }

/** 让 `document.execCommand('copy')` 像浏览器那样派发 copy 事件，返回写进去的文字。 */
function stubCopyCommand(): { copied: () => string | null, execCommand: ReturnType<typeof vi.fn> } {
  let copied: string | null = null
  const execCommand = vi.fn((command: string) => {
    if (command !== 'copy')
      return false
    const data = new Map<string, string>()
    const event = new Event('copy', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', { value: { setData: (type: string, value: string) => data.set(type, value) } })
    document.dispatchEvent(event)
    copied = data.get('text/plain') ?? null
    return true
  })
  Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand })
  return { copied: () => copied, execCommand }
}

function clipboard(writeText: (text: string) => Promise<void>): void {
  vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
}

describe('useClipboard 在不允许异步 Clipboard API 的框架里', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetLiveRegionsForTest()
    delete (document as Partial<PolicyDocument>).permissionsPolicy
  })

  it('copies with the copy command when the permissions policy refuses clipboard-write, without trying the async API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    clipboard(writeText)
    Object.defineProperty(document, 'permissionsPolicy', {
      configurable: true,
      value: { allowsFeature: (feature: string) => feature !== 'clipboard-write' },
    })
    const command = stubCopyCommand()
    const { result } = mountComposable(() => useClipboard())

    await expect(result.copy('const a = 1')).resolves.toBe(true)
    expect(writeText).not.toHaveBeenCalled()
    expect(command.copied()).toBe('const a = 1')
    expect(result.isCopied.value).toBe(true)
  })

  it('falls back to the copy command when the browser refuses the write', async () => {
    clipboard(vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError')))
    const command = stubCopyCommand()
    const { result } = mountComposable(() => useClipboard())

    await expect(result.copy('hello')).resolves.toBe(true)
    expect(command.copied()).toBe('hello')
  })

  it('reports a failure when neither path copies', async () => {
    clipboard(vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError')))
    Object.defineProperty(document, 'execCommand', { configurable: true, value: () => false })
    const { result } = mountComposable(() => useClipboard())

    await expect(result.copy('hello')).resolves.toBe(false)
    expect(result.isCopied.value).toBe(false)
  })
})
