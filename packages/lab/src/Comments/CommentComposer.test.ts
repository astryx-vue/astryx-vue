import { provideAstryxLocale } from '@astryx-vue/core'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import CommentComposer from './CommentComposer.vue'
import CommentComposerBase from './CommentComposerBase.vue'

const announce = vi.hoisted(() => vi.fn())

vi.mock('@astryx-vue/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@astryx-vue/core')>()
  return {
    ...actual,
    useAnnounce: () => announce,
  }
})

vi.mock('../EmojiPicker/emojiData.js', () => ({
  loadBundledCategories: () => Promise.resolve([
    {
      name: 'Activities',
      emojis: [
        { emoji: '🎉', name: 'Party popper', keywords: ['celebration', 'tada'] },
        { emoji: '🎈', name: 'Balloon', keywords: ['celebration'] },
      ],
    },
  ]),
  bundledGroupLabelKey: () => undefined,
  resetBundledCategories: vi.fn(),
}))

enableAutoUnmount(afterEach)

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

beforeEach(() => {
  announce.mockClear()
  vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  Element.prototype.scrollIntoView = () => {}
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

function composerErrorBanner(): HTMLElement {
  const banner = document.querySelector<HTMLElement>('[data-composer-error="banner"]')
  if (banner == null)
    throw new Error('Composer error Banner not found')
  return banner
}

function namedButton(name: string | RegExp): HTMLElement {
  const matcher = name instanceof RegExp ? name : new RegExp(`^${name}$`, 'i')
  const found = [...document.querySelectorAll('button')].find((button) => {
    const label = button.getAttribute('aria-label') ?? button.textContent ?? ''
    return matcher.test(label.trim())
  })
  if (found == null)
    throw new Error(`Button not found: ${String(name)}`)
  return found
}

async function settle(): Promise<void> {
  await flushPromises()
  await nextTick()
}

describe('commentComposer', () => {
  it('posts the draft from Post, and never an empty one', async () => {
    const onSubmit = vi.fn()
    const wrapper = mount(CommentComposer, {
      attachTo: document.body,
      props: { value: '', onSubmit },
    })
    const post = namedButton(/send/i)
    expect(post.getAttribute('aria-disabled') === 'true' || post.hasAttribute('disabled')).toBe(true)
    await wrapper.setProps({ value: 'Looks good' })
    namedButton(/send/i).click()
    await settle()
    expect(onSubmit).toHaveBeenCalledWith('Looks good')
  })

  it('keeps Cancel in the tab order but inert while submitting (AST-085 FR1, FR2)', async () => {
    const onCancel = vi.fn()
    mount(CommentComposerBase, {
      attachTo: document.body,
      props: {
        value: 'Draft',
        placeholder: 'Edit comment',
        context: { kind: 'edit', commentId: 'c1' },
        contextLabel: 'Editing comment',
        highlightColor: 'yellow',
        triggers: [],
        agentCommands: [],
        hasEmojiPicker: false,
        isSubmitting: true,
        hasCancel: true,
        onCancel,
      },
    })
    const cancel = [...document.querySelectorAll('a, button')].find(el => el.textContent?.includes('Cancel'))
    if (cancel == null)
      throw new Error('Cancel not found')
    expect(cancel.getAttribute('aria-disabled')).toBe('true')
    expect(cancel.getAttribute('tabindex')).not.toBe('-1')
    ;(cancel as HTMLElement).focus()
    expect(document.activeElement).toBe(cancel)
    cancel.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    cancel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await settle()
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('shows the placeholder as the input’s name, and keeps Post focusable while submitting', async () => {
    const onSubmit = vi.fn()
    const wrapper = mount(CommentComposer, {
      attachTo: document.body,
      props: { value: 'Draft', isSubmitting: true, onSubmit },
    })
    const textbox = document.querySelector('[role="textbox"]')
    expect(textbox?.getAttribute('aria-label')).toBe('Write a comment…')
    const post = namedButton(/send/i)
    expect(post.hasAttribute('disabled')).toBe(false)
    post.click()
    await settle()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(wrapper.get('.astryx-comment-composer').attributes('aria-busy')).toBe('true')
    expect(namedButton('Add emoji').getAttribute('aria-disabled')).toBe('true')
  })

  it('appends a picked emoji to the draft', async () => {
    const Host = defineComponent({
      setup() {
        const value = ref('Ship it')
        return () => h('div', [
          h('output', { 'data-testid': 'draft' }, value.value),
          h(CommentComposer, {
            value: value.value,
            onChange: (next: string) => {
              value.value = next
            },
            onSubmit: () => {},
          }),
        ])
      },
    })
    mount(Host, { attachTo: document.body })
    namedButton('Add emoji').click()
    await settle()
    await flushPromises()
    const party = [...document.querySelectorAll('button')].filter(button =>
      (button.getAttribute('aria-label') ?? '') === 'Party popper',
    )
    expect(party.length).toBeGreaterThan(0)
    party[0]!.click()
    await settle()
    expect(document.querySelector('[data-testid="draft"]')?.textContent).toBe('Ship it 🎉')
  })

  it('ends the upload busy state when onActionPendingChange is a new function each render', async () => {
    let finishUpload: (images: { url: string, alt: string }[]) => void = () => {}
    const onUploadImages = vi.fn(() => new Promise<{ url: string, alt: string }[]>((resolve) => {
      finishUpload = resolve
    }))
    const Host = defineComponent({
      setup() {
        const draft = ref('See this')
        const pending = ref(false)
        return () => h('div', [
          h(CommentComposerBase, {
            value: draft.value,
            placeholder: 'Reply',
            context: { kind: 'comment' },
            highlightColor: 'yellow',
            triggers: [],
            agentCommands: [],
            hasEmojiPicker: false,
            isSubmitting: false,
            onUploadImages,
            onChange: (next: string) => {
              draft.value = next
            },
            onSubmit: () => {},
            onActionPendingChange: (isPending: boolean) => {
              pending.value = isPending
            },
          }),
          h('output', { 'data-testid': 'pending' }, String(pending.value)),
        ])
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement
    const file = new File(['png'], 'chart.png', { type: 'image/png' })
    Object.defineProperty(input, 'files', { configurable: true, value: [file] })
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await settle()
    expect(onUploadImages).toHaveBeenCalledWith([file])
    expect(document.querySelector('[data-testid="pending"]')?.textContent).toBe('true')

    finishUpload([{ url: 'https://example.com/a.png', alt: 'Chart' }])
    await settle()
    expect(document.querySelector('[data-testid="pending"]')?.textContent).toBe('false')
    expect(document.querySelector('[aria-busy="true"]')).toBeNull()
  })

  it('uploads attached images and appends them as Markdown', async () => {
    const onChange = vi.fn()
    const onUploadImages = vi.fn().mockResolvedValue([{ url: 'https://example.com/a b.png', alt: 'Chart' }])
    const wrapper = mount(CommentComposer, {
      attachTo: document.body,
      props: { value: 'See this', onChange, onSubmit: () => {}, onUploadImages },
    })
    expect(namedButton('Attach images')).toBeTruthy()
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement
    const file = new File(['png'], 'chart.png', { type: 'image/png' })
    Object.defineProperty(input, 'files', { configurable: true, value: [file] })
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await settle()
    expect(onUploadImages).toHaveBeenCalledWith([file])
    expect(onChange).toHaveBeenCalledWith('See this\n\n![Chart](https://example.com/a%20b.png)')
  })

  it('keeps the image picker free of native disabled and refuses files while busy (AST-085 FR1, FR2)', async () => {
    const onUploadImages = vi.fn()
    const wrapper = mount(CommentComposer, {
      attachTo: document.body,
      props: { value: 'Draft', onSubmit: () => {}, onUploadImages, isSubmitting: true },
    })
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement
    expect(input.hasAttribute('disabled')).toBe(false)
    const file = new File(['png'], 'chart.png', { type: 'image/png' })
    Object.defineProperty(input, 'files', { configurable: true, value: [file] })
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await settle()
    expect(onUploadImages).not.toHaveBeenCalled()
  })

  it('refuses images pasted or dropped into the input while a post is in flight (AST-085 FR2)', async () => {
    const onChange = vi.fn()
    const onUploadImages = vi.fn().mockResolvedValue([{ url: 'https://example.com/a.png', alt: 'Chart' }])
    mount(CommentComposer, {
      attachTo: document.body,
      props: { value: 'Draft', onChange, onSubmit: () => {}, onUploadImages, isSubmitting: true },
    })
    const textbox = document.querySelector('[role="textbox"]')
    if (!(textbox instanceof HTMLElement))
      throw new Error('textbox not found')
    const file = new File(['png'], 'chart.png', { type: 'image/png' })
    const clipboard = new DataTransfer()
    clipboard.items.add(file)
    textbox.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: clipboard }))
    const drop = new Event('drop', { bubbles: true, cancelable: true })
    Object.defineProperty(drop, 'dataTransfer', { value: { files: [file], types: ['Files'] } })
    textbox.dispatchEvent(drop)
    await settle()
    expect(onUploadImages).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('starts no second upload from a paste while an upload is pending', async () => {
    const onUploadImages = vi.fn(() => new Promise<{ url: string, alt: string }[]>(() => {}))
    mount(CommentComposer, {
      attachTo: document.body,
      props: { value: 'Draft', onSubmit: () => {}, onUploadImages },
    })
    const textbox = document.querySelector('[role="textbox"]')
    if (!(textbox instanceof HTMLElement))
      throw new Error('textbox not found')
    const file = new File(['png'], 'chart.png', { type: 'image/png' })
    const clipboard = new DataTransfer()
    clipboard.items.add(file)
    textbox.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: clipboard }))
    await settle()
    textbox.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: clipboard }))
    const drop = new Event('drop', { bubbles: true, cancelable: true })
    Object.defineProperty(drop, 'dataTransfer', { value: { files: [file], types: ['Files'] } })
    textbox.dispatchEvent(drop)
    await settle()
    expect(onUploadImages).toHaveBeenCalledTimes(1)
  })

  it('does not open the image chooser from the error banner while busy', async () => {
    const onUploadImages = vi.fn()
    const wrapper = mount(CommentComposer, {
      attachTo: document.body,
      props: { value: 'Draft', onSubmit: () => {}, onUploadImages },
    })
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement
    const openChooser = vi.spyOn(input, 'click').mockImplementation(() => {})
    const pdf = new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' })
    Object.defineProperty(input, 'files', { configurable: true, value: [pdf] })
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await settle()
    await wrapper.setProps({ isSubmitting: true })
    namedButton('Choose images').click()
    expect(openChooser).not.toHaveBeenCalled()

    await wrapper.setProps({ isSubmitting: false })
    namedButton('Choose images').click()
    expect(openChooser).toHaveBeenCalledTimes(1)
  })

  it('refuses files that are not images', async () => {
    const onUploadImages = vi.fn()
    const wrapper = mount(CommentComposer, {
      attachTo: document.body,
      props: { value: '', onSubmit: () => {}, onUploadImages },
    })
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement
    Object.defineProperty(input, 'files', { configurable: true, value: [new File(['%PDF'], 'doc.pdf', { type: 'application/pdf' })] })
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await settle()
    expect(onUploadImages).not.toHaveBeenCalled()
    const banner = composerErrorBanner()
    expect(banner.textContent).toContain('Only image files can be added')
    expect(banner.getAttribute('role')).toBeNull()
    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce).toHaveBeenCalledWith(
      expect.stringContaining('Only image files can be added'),
      'assertive',
    )
  })

  it('announces a second refusal with the same words again', async () => {
    const wrapper = mount(CommentComposer, {
      attachTo: document.body,
      props: { value: '', onSubmit: () => {}, onUploadImages: vi.fn() },
    })
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement
    for (const name of ['first.pdf', 'second.pdf']) {
      Object.defineProperty(input, 'files', { configurable: true, value: [new File(['%PDF'], name, { type: 'application/pdf' })] })
      input.dispatchEvent(new Event('change', { bubbles: true }))
      await settle()
    }
    expect(announce).toHaveBeenCalledTimes(2)
  })

  it('shows an error with Retry, and a quoted passage the viewer can remove', async () => {
    const onRetry = vi.fn()
    const onAnchorDismiss = vi.fn()
    mount(CommentComposer, {
      attachTo: document.body,
      props: {
        value: 'Draft',
        onSubmit: () => {},
        error: 'Your comment couldn\'t be posted.',
        onRetry,
        anchor: { quote: 'Guardrail alerts page within five minutes.' },
        onAnchorDismiss,
        highlightColor: 'green',
      },
    })
    const retry = [...composerErrorBanner().querySelectorAll('button')].find(button =>
      (button.getAttribute('aria-label') ?? button.textContent ?? '').includes('Retry'),
    )
    if (retry == null)
      throw new Error('Retry not found')
    retry.click()
    await settle()
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(
      document.querySelector('[data-composer-anchor="quote"] [data-quote-rule]')?.getAttribute('data-highlight-color'),
    ).toBe('green')
    namedButton('Remove quoted text').click()
    await settle()
    expect(onAnchorDismiss).toHaveBeenCalledTimes(1)
  })

  it('leaves the emoji button out when hasEmojiPicker is false, and adds controls', () => {
    mount(CommentComposer, {
      attachTo: document.body,
      props: { value: '', onSubmit: () => {}, hasEmojiPicker: false },
      slots: { controls: '<button type="button">Pin to moment</button>' },
    })
    expect([...document.querySelectorAll('button')].some(button =>
      (button.getAttribute('aria-label') ?? '') === 'Add emoji',
    )).toBe(false)
    expect([...document.querySelectorAll('button')].some(button => button.textContent?.includes('Pin to moment'))).toBe(true)
  })
})

describe('commentComposer locale', () => {
  it('uses zh-CN copy for the input name', () => {
    const Host = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(CommentComposer, { value: '' })
      },
    })
    mount(Host, { attachTo: document.body })
    expect(document.querySelector('[role="textbox"]')?.getAttribute('aria-label')).toBe('写一条评论…')
  })
})
