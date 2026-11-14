import type { CommentThreadData, CommentUser } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import CommentThread from './CommentThread.vue'
import { unsavedDraftOf } from './useCommentThreadDismissal.js'

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

const VIEWER: CommentUser = { id: 'avery', name: 'Avery Kim' }
const OTHER: CommentUser = { id: 'maya', name: 'Maya Chen' }

const THREAD: CommentThreadData = {
  id: 'margin',
  author: OTHER,
  body: 'Should this say three days?',
  createdAt: '2026-09-30T19:00:00Z',
  anchor: { quote: 'The final cohort completes rollout in two days.' },
  replies: [
    {
      id: 'margin-reply',
      author: VIEWER,
      body: 'Good catch, updating it.',
      createdAt: '2026-09-30T19:20:00Z',
    },
  ],
}

const originalMatches = HTMLElement.prototype.matches
const popoverOpenState = new WeakMap<HTMLElement, boolean>()

beforeAll(() => {
  HTMLElement.prototype.showPopover = function (this: HTMLElement) {
    popoverOpenState.set(this, true)
    const event = new Event('toggle')
    Object.defineProperty(event, 'newState', { value: 'open' })
    this.dispatchEvent(event)
  }
  HTMLElement.prototype.hidePopover = function (this: HTMLElement) {
    popoverOpenState.set(this, false)
    const event = new Event('toggle')
    Object.defineProperty(event, 'newState', { value: 'closed' })
    this.dispatchEvent(event)
  }
  Object.defineProperty(HTMLElement.prototype, 'matches', {
    configurable: true,
    writable: true,
    value(this: HTMLElement, selector: string): boolean {
      if (selector === ':popover-open')
        return popoverOpenState.get(this) ?? false
      return originalMatches.call(this, selector)
    },
  })
})

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

afterAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'matches', {
    configurable: true,
    writable: true,
    value: originalMatches,
  })
})

async function settle(): Promise<void> {
  await flushPromises()
  await nextTick()
  await new Promise<void>(resolve => setTimeout(resolve, 0))
}

function queryThreadToggle(): HTMLElement | null {
  return document.querySelector('button[aria-label="Thread by Maya Chen"]')
}

describe('commentThread', () => {
  it('renders one thread with its quoted passage, collapsed replies, and no rules', () => {
    const wrapper = mount(CommentThread, {
      props: { comment: THREAD, container: 'card' },
      attachTo: document.body,
    })
    const surface = document.querySelector('[data-thread-id="margin"]')
    expect(surface?.getAttribute('data-thread-surface')).toBe('section')
    expect(wrapper.text()).toContain('The final cohort completes rollout in two days.')
    expect(wrapper.text()).toContain('View 1 reply')
    expect(wrapper.text()).not.toContain('Good catch, updating it.')
  })

  it('opens on a press, showing its replies and reply composer', async () => {
    const onSelectedChange = vi.fn()
    const wrapper = mount(CommentThread, {
      props: {
        comment: THREAD,
        currentUser: VIEWER,
        onSubmit: vi.fn(),
        onSelectedChange,
      },
      attrs: { onSelectedChange },
      attachTo: document.body,
    })
    queryThreadToggle()?.click()
    await settle()
    expect(wrapper.emitted('selectedChange')?.[0]).toEqual([true])
    expect(wrapper.text()).toContain('Good catch, updating it.')
    expect(document.querySelector('[role="textbox"][aria-label="Reply to Maya Chen…"]')).toBeTruthy()
  })

  it('opens when the host selects it', async () => {
    const wrapper = mount(CommentThread, {
      props: {
        comment: THREAD,
        currentUser: VIEWER,
        onSubmit: vi.fn(),
        isSelected: false,
      },
      attachTo: document.body,
    })
    expect(wrapper.text()).not.toContain('Good catch, updating it.')
    await wrapper.setProps({ isSelected: true })
    await settle()
    expect(wrapper.text()).toContain('Good catch, updating it.')
  })

  it('opens a thread selected at mount without opening its composer or taking focus', async () => {
    mount(CommentThread, {
      props: {
        comment: THREAD,
        currentUser: VIEWER,
        onSubmit: vi.fn(),
        isSelected: true,
      },
      attachTo: document.body,
    })
    await settle()
    expect(document.body.textContent).toContain('Good catch, updating it.')
    expect(document.querySelector('[role="textbox"][aria-label="Reply to Maya Chen…"]')).toBeNull()
    expect(document.activeElement).toBe(document.body)
  })

  it('opens from the keyboard and keeps focus on the thread', async () => {
    const wrapper = mount(CommentThread, {
      props: {
        comment: THREAD,
        currentUser: VIEWER,
        onSubmit: vi.fn(),
      },
      attachTo: document.body,
    })
    const toggle = queryThreadToggle()
    expect(toggle).toBeTruthy()
    toggle!.focus()
    expect(document.activeElement).toBe(toggle)
    toggle!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 0 }))
    await settle()
    expect(wrapper.emitted('selectedChange')?.at(-1)).toEqual([true])
    expect(wrapper.text()).toContain('Good catch, updating it.')
    expect(document.activeElement).toBe(toggle)
  })

  it('forwards the reply draft lifecycle through a standalone thread', async () => {
    const onComposerDraftChange = vi.fn()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const renderComposer = (props: {
      value: string
      onChange: (value: string) => void
      onSubmit: (value: string) => void
      placeholder: string
    }) => h('section', { 'aria-label': 'Live reply' }, [
      h('button', { type: 'button', onClick: () => props.onChange('Live reply body') }, 'Set live draft'),
      h('button', { type: 'button', onClick: () => props.onSubmit(props.value) }, 'Submit live draft'),
    ])
    mount(CommentThread, {
      props: {
        comment: THREAD,
        currentUser: VIEWER,
        isSelected: true,
        onSubmit,
        onComposerDraftChange,
        renderComposer,
      },
      attachTo: document.body,
    })
    await settle()
    const article = document.querySelector('[data-comment-id="margin"]')
    article?.querySelector<HTMLElement>('[data-comment-action="reply"]')?.click()
    await settle()
    const context = { kind: 'reply' as const, parentCommentId: 'margin', repliedToCommentId: 'margin' }
    document.querySelector('button') && Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Set live draft')?.click()
    expect(onComposerDraftChange).toHaveBeenLastCalledWith('Live reply body', context)
    Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Submit live draft')?.click()
    await settle()
    expect(onSubmit).toHaveBeenCalledWith('Live reply body', 'margin')
    expect(onComposerDraftChange).toHaveBeenLastCalledWith('', context)
  })

  it('forwards root props', () => {
    mount(CommentThread, {
      props: { comment: THREAD },
      attrs: { 'data-testid': 'margin-thread' },
      attachTo: document.body,
    })
    const root = document.querySelector('[data-testid="margin-thread"]')
    expect(root?.className).toContain('astryx-comment-thread')
  })
})

describe('commentThread dismissal', () => {
  interface FakeAnimation { cancel: ReturnType<typeof vi.fn>, addEventListener: ReturnType<typeof vi.fn> }
  let animate: ReturnType<typeof vi.fn>
  let animations: FakeAnimation[]

  beforeEach(() => {
    animations = []
    animate = vi.fn(() => {
      const animation: FakeAnimation = { cancel: vi.fn(), addEventListener: vi.fn() }
      animations.push(animation)
      return animation
    })
    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      writable: true,
      value: animate,
    })
  })

  afterEach(() => {
    delete (HTMLElement.prototype as Partial<HTMLElement>).animate
    vi.restoreAllMocks()
  })

  const PRESS = { button: 0, isPrimary: true, pointerId: 1 }

  function press(target: Element): { mouseDown: boolean, click: boolean } {
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, ...PRESS }))
    const mouseDown = target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }))
    target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, ...PRESS }))
    target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    const click = target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    return { mouseDown, click }
  }

  function draftComposer() {
    return (props: { value: string, onChange: (value: string) => void, placeholder: string }) =>
      h('textarea', {
        'aria-label': props.placeholder,
        'value': props.value,
        'onInput': (event: Event) => props.onChange((event.target as HTMLTextAreaElement).value),
      })
  }

  function renderThread(extra: Record<string, unknown> = {}) {
    const onDismiss = vi.fn()
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h('button', { type: 'button' }, 'Elsewhere'),
          h(CommentThread, {
            comment: THREAD,
            currentUser: VIEWER,
            isSelected: true,
            onSubmit: vi.fn(),
            onDismiss,
            renderComposer: draftComposer(),
            ...extra,
          }),
        ])
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    return { onDismiss, wrapper }
  }

  async function openReply(): Promise<HTMLTextAreaElement> {
    document.querySelector<HTMLElement>('[data-comment-id="margin"] [data-comment-action="reply"]')?.click()
    await settle()
    const textbox = document.querySelector<HTMLTextAreaElement>('textarea[aria-label="Reply to Maya Chen…"]')
    if (textbox == null)
      throw new Error('reply composer not found')
    return textbox
  }

  function typeDraft(textbox: HTMLTextAreaElement, text: string): void {
    textbox.value = text
    textbox.dispatchEvent(new Event('input', { bubbles: true }))
  }

  const UNSAVED = 'Unsaved draft. Dismiss again to discard it.'

  it('dismisses on an outside press when nothing is unsaved', async () => {
    const { onDismiss } = renderThread()
    await settle()
    const elsewhere = Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Elsewhere')!
    const { click } = press(elsewhere)
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(animate).not.toHaveBeenCalled()
    expect(click).toBe(true)
  })

  it('dismisses with an open reply that holds only whitespace', async () => {
    const { onDismiss } = renderThread()
    await settle()
    typeDraft(await openReply(), '   ')
    const elsewhere = Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Elsewhere')!
    press(elsewhere)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('shakes, refocuses, and announces on the first outside press over a draft, then dismisses on the second', async () => {
    const { onDismiss } = renderThread()
    await settle()
    const textbox = await openReply()
    typeDraft(textbox, 'Half a thought')
    await settle()
    const elsewhere = Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Elsewhere')!
    elsewhere.focus()
    const first = press(elsewhere)
    expect(onDismiss).not.toHaveBeenCalled()
    expect(animate).toHaveBeenCalledTimes(1)
    expect(textbox).toBe(document.activeElement)
    expect(announce).toHaveBeenCalledWith(UNSAVED, 'polite')
    expect(first.mouseDown).toBe(false)
    expect(first.click).toBe(false)
    press(elsewhere)
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(animate).toHaveBeenCalledTimes(1)
  })

  it('re-arms after the draft changes or the viewer presses inside', async () => {
    const { onDismiss } = renderThread()
    await settle()
    const textbox = await openReply()
    typeDraft(textbox, 'First')
    await settle()
    const elsewhere = Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Elsewhere')!
    press(elsewhere)
    typeDraft(textbox, 'First, then more')
    await settle()
    press(elsewhere)
    expect(onDismiss).not.toHaveBeenCalled()
    expect(animate).toHaveBeenCalledTimes(2)
    expect(animations[0]?.cancel).toHaveBeenCalled()
    press(textbox)
    press(elsewhere)
    expect(onDismiss).not.toHaveBeenCalled()
    expect(animate).toHaveBeenCalledTimes(3)
    press(elsewhere)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('ignores secondary buttons and touches that turn into a scroll', async () => {
    const { onDismiss } = renderThread()
    await settle()
    const elsewhere = Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Elsewhere')!
    elsewhere.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 2, isPrimary: true, pointerId: 1 }))
    elsewhere.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 2, isPrimary: true, pointerId: 1 }))
    elsewhere.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, ...PRESS }))
    elsewhere.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, ...PRESS }))
    elsewhere.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, ...PRESS }))
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('requests dismissal on an Escape no nested layer handled', async () => {
    const { onDismiss } = renderThread()
    await settle()
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('guards a draft on Escape and dismisses on the next one', async () => {
    const { onDismiss } = renderThread()
    await settle()
    const textbox = await openReply()
    typeDraft(textbox, 'Draft')
    await settle()
    textbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    expect(onDismiss).not.toHaveBeenCalled()
    expect(animate).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(textbox)
    expect(announce).toHaveBeenCalledWith(UNSAVED, 'polite')
    textbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not move under reduced motion but still refocuses and announces', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList)
    const { onDismiss } = renderThread()
    await settle()
    const textbox = await openReply()
    typeDraft(textbox, 'Draft')
    await settle()
    const elsewhere = Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Elsewhere')!
    press(elsewhere)
    expect(animate).not.toHaveBeenCalled()
    expect(onDismiss).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(textbox)
    expect(announce).toHaveBeenCalledWith(UNSAVED, 'polite')
  })

  it('adds no listeners and dismisses nothing without onDismiss', async () => {
    const addListener = vi.spyOn(document, 'addEventListener')
    const Host = defineComponent({
      setup() {
        return () => h('div', [
          h('button', { type: 'button' }, 'Elsewhere'),
          h(CommentThread, {
            comment: THREAD,
            currentUser: VIEWER,
            isSelected: true,
            onSubmit: vi.fn(),
            renderComposer: draftComposer(),
          }),
        ])
      },
    })
    mount(Host, { attachTo: document.body })
    await settle()
    const textbox = await openReply()
    typeDraft(textbox, 'Draft')
    const elsewhere = Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Elsewhere')!
    const { mouseDown, click } = press(elsewhere)
    textbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(animate).not.toHaveBeenCalled()
    expect(mouseDown).toBe(true)
    expect(click).toBe(true)
    expect(addListener.mock.calls.some(([type]) => type === 'pointercancel')).toBe(false)
  })

  it('derives an unsaved draft from typed replies and changed edits only', () => {
    const reply = { parentId: 'margin', comment: THREAD }
    expect(unsavedDraftOf({ replyTarget: null, replyDraft: '', editTarget: null })).toBeNull()
    expect(unsavedDraftOf({
      replyTarget: { ...reply, seed: '@Maya ' },
      replyDraft: '@Maya ',
      editTarget: null,
    })).toBeNull()
    expect(unsavedDraftOf({
      replyTarget: { ...reply, seed: '@Maya ' },
      replyDraft: '@Maya agreed',
      editTarget: null,
    })?.kind).toBe('reply')
    expect(unsavedDraftOf({
      replyTarget: null,
      replyDraft: '',
      editTarget: { comment: THREAD, value: `${THREAD.body} ` },
    })).toBeNull()
    expect(unsavedDraftOf({
      replyTarget: null,
      replyDraft: '',
      editTarget: { comment: THREAD, value: 'Edited body' },
    })?.kind).toBe('edit')
  })
})
