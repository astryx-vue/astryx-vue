import type { CommentComposerRenderProps, CommentsProps, CommentThreadData, CommentUser } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Comments from './Comments.vue'

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
      ],
    },
  ]),
  bundledGroupLabelKey: () => undefined,
  resetBundledCategories: vi.fn(),
}))

enableAutoUnmount(afterEach)

const VIEWER: CommentUser = { id: 'avery', name: 'Avery Kim' }
const OTHER: CommentUser = { id: 'maya', name: 'Maya Chen' }
const AGENT: CommentUser = {
  id: 'release-bot',
  name: 'Release Assistant',
  kind: 'agent',
  avatarUrl: '/agent-logo.png',
}

const COMMENTS: readonly CommentThreadData[] = [
  {
    id: 'root-1',
    author: VIEWER,
    body: 'The final states are **ready** for review.',
    createdAt: '2026-09-30T19:00:00Z',
    isEdited: true,
    previousVersions: [
      {
        id: 'root-1-v1',
        body: 'Earlier wording',
        editedAt: '2026-09-30T18:00:00Z',
        author: VIEWER,
      },
    ],
    reactions: [
      {
        key: 'like',
        label: '👍',
        description: 'Like',
        count: 2,
        reactedByViewer: true,
        actors: [VIEWER, OTHER],
      },
    ],
    replies: [
      {
        id: 'reply-1',
        author: OTHER,
        body: 'A one-level reply',
        createdAt: '2026-09-30T19:10:00Z',
      },
    ],
  },
]

function TestComposer(props: CommentComposerRenderProps) {
  return h('section', {
    'aria-label': props.contextLabel ?? 'New comment',
    'data-placeholder': props.placeholder,
  }, [
    h('output', props.value),
    h('button', {
      type: 'button',
      onClick: () => props.onChange(
        props.context.kind === 'reply'
          ? `${props.value}Reply body`
          : props.context.kind === 'edit'
            ? 'Edited comment body'
            : 'New comment body',
      ),
    }, 'Set draft'),
    h('button', { type: 'button', onClick: () => props.onSubmit(props.value) }, 'Submit composer'),
    props.error != null ? h('p', { role: 'alert' }, props.error) : null,
    props.onCancel != null
      ? h('button', { type: 'button', onClick: () => props.onCancel?.() }, 'Cancel composer')
      : null,
  ])
}

const renderComposer = (props: CommentComposerRenderProps) => h(TestComposer, props)

function articleByAuthor(name: string): HTMLElement {
  const article = Array.from(document.querySelectorAll('article')).find(candidate =>
    candidate.querySelector(`[data-author-name="${name}"]`) != null,
  )
  if (article == null)
    throw new Error(`Article not found: ${name}`)
  return article
}

function threadSurface(threadId: string): HTMLElement {
  const surface = document.querySelector(`[data-thread-id="${threadId}"]`)
  if (!(surface instanceof HTMLElement))
    throw new Error(`Thread not found: ${threadId}`)
  return surface
}

function bannerByData(attribute: string): HTMLElement {
  const banner = document.querySelector<HTMLElement>(`[${attribute}]`)
  if (banner == null)
    throw new Error(`No Banner with ${attribute}`)
  return banner
}

async function settle(): Promise<void> {
  await flushPromises()
  await nextTick()
  await new Promise<void>(resolve => setTimeout(resolve, 0))
}

function mountPanel(props: CommentsProps) {
  const Host = defineComponent({
    setup: () => () => h('div', { style: 'height: 600px' }, [h(Comments, props)]),
  })
  return mount(Host, { attachTo: document.body })
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
      if (selector === ':modal')
        return this instanceof HTMLDialogElement && this.open
      return originalMatches.call(this, selector)
    },
  })
})

afterAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'matches', {
    configurable: true,
    writable: true,
    value: originalMatches,
  })
})

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

class IntersectionObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

const writeText = vi.fn()

beforeEach(() => {
  announce.mockClear()
  writeText.mockReset()
  writeText.mockResolvedValue(undefined)
  vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
  Object.defineProperty(globalThis.navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
  Element.prototype.scrollIntoView = () => {}
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute('open', '')
    },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute('open')
    },
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('comments rendering', () => {
  it('renders threads, Markdown bodies, reactions, and a collapsed reply', () => {
    mountPanel({ comments: COMMENTS, currentUser: VIEWER })
    expect(document.querySelector('[aria-label="Comments"]')).toBeTruthy()
    const article = articleByAuthor('Avery Kim')
    expect(article.querySelector('strong')?.textContent).toBe('ready')
    const like = Array.from(article.querySelectorAll('button')).find(button => button.getAttribute('aria-label')?.includes('Like: 2'))
    expect(like?.getAttribute('aria-pressed')).toBe('true')
    expect(document.body.textContent).toContain('View 1 reply')
    expect(document.body.textContent).not.toContain('A one-level reply')
  })

  it('renders the empty state when there is nothing to show', () => {
    mountPanel({ comments: [], currentUser: VIEWER, onSubmit: vi.fn() })
    expect(document.body.textContent).toContain('No comments yet')
    expect(document.body.textContent).toContain('Start the discussion with a comment.')
  })

  it('interleaves activity events with threads by time', () => {
    mountPanel({
      comments: [
        { id: 'early', author: OTHER, body: 'First', createdAt: '2026-09-30T19:00:00Z' },
        { id: 'late', author: VIEWER, body: 'Third', createdAt: '2026-09-30T19:20:00Z' },
      ],
      events: [
        { id: 'status', label: 'Status changed to Ready for review', createdAt: '2026-09-30T19:10:00Z' },
      ],
    })
    const order = Array.from(document.querySelectorAll('[data-thread-id], [data-comments-event-id]')).map(
      element => element.getAttribute('data-thread-id') ?? element.getAttribute('data-comments-event-id'),
    )
    expect(order).toEqual(['early', 'status', 'late'])
  })

  it('marks agents with a badge and shows a comment still being written as its progress', () => {
    mountPanel({
      comments: [
        {
          id: 'agent-root',
          author: AGENT,
          body: '',
          createdAt: '2026-09-30T19:00:00Z',
          progress: { label: 'Checking the rollout…', link: { label: 'Open session', href: '#session' } },
        },
      ],
      currentUser: VIEWER,
      onSubmit: vi.fn(),
      onReact: vi.fn(),
    })
    const article = articleByAuthor('Release Assistant')
    expect(article.textContent).toContain('Agent')
    const progressLabel = Array.from(article.querySelectorAll('*')).find(node => node.textContent === 'Checking the rollout…' && node.children.length === 0)
    expect(progressLabel?.getAttribute('role')).toBeNull()
    expect(article.querySelector('[role="status"]')).toBeNull()
    expect(article.querySelector('a[href="#session"]')?.textContent).toContain('Open session')
    expect(Array.from(article.querySelectorAll('button')).some(button => button.getAttribute('aria-label') === 'Reply' || button.textContent === 'Reply')).toBe(false)
  })

  it('uses divider-bounded Sections inside a card parent', () => {
    mountPanel({ comments: COMMENTS, container: 'card' })
    expect(threadSurface('root-1').getAttribute('data-thread-surface')).toBe('section')
  })

  it('renders embedded at content height, without the chat layout', () => {
    mount(Comments, {
      props: { comments: COMMENTS, container: 'card', layout: 'embedded', composerPosition: 'none' },
      attachTo: document.body,
    })
    const region = document.querySelector('[aria-label="Comments"]')
    expect(region?.getAttribute('data-layout')).toBe('embedded')
    expect(region?.querySelector('[role="log"]')).toBeNull()
  })

  it('shows the loading shape while loading', () => {
    mountPanel({ comments: [], isLoading: true, currentUser: VIEWER, onSubmit: vi.fn() })
    expect(document.body.textContent).toContain('Loading comments')
    expect(document.querySelector('[data-comments-loading="composer"]')).not.toBeNull()
    expect(document.querySelector('[data-comments-loading="threads"]')).not.toBeNull()
  })
})

describe('comments composer and threads', () => {
  it('reports a new-comment draft with its anchor and clears it after posting', async () => {
    const onComposerDraftChange = vi.fn()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const anchor = { quote: 'The rollout completes on Friday.' }
    mountPanel({
      comments: COMMENTS,
      currentUser: VIEWER,
      composerAnchor: anchor,
      onSubmit,
      onComposerDraftChange,
      renderComposer,
    })
    const composer = document.querySelector('[aria-label="New comment"]') as HTMLElement
    Array.from(composer.querySelectorAll('button')).find(button => button.textContent === 'Set draft')?.click()
    await settle()
    expect(onComposerDraftChange).toHaveBeenLastCalledWith('New comment body', { kind: 'comment', anchor })
    Array.from(composer.querySelectorAll('button')).find(button => button.textContent === 'Submit composer')?.click()
    await settle()
    expect(onComposerDraftChange).toHaveBeenLastCalledWith('', { kind: 'comment', anchor })
  })

  it('restores a failed draft without reporting a false clear', async () => {
    const onComposerDraftChange = vi.fn()
    mountPanel({
      comments: COMMENTS,
      currentUser: VIEWER,
      onSubmit: vi.fn().mockRejectedValue(new Error('offline')),
      onComposerDraftChange,
      renderComposer,
    })
    const composer = document.querySelector('[aria-label="New comment"]') as HTMLElement
    Array.from(composer.querySelectorAll('button')).find(button => button.textContent === 'Set draft')?.click()
    await settle()
    Array.from(composer.querySelectorAll('button')).find(button => button.textContent === 'Submit composer')?.click()
    await settle()
    expect(onComposerDraftChange).toHaveBeenLastCalledWith('New comment body', { kind: 'comment' })
    expect(onComposerDraftChange).not.toHaveBeenCalledWith('', { kind: 'comment' })
    expect(composer.querySelector('output')?.textContent).toBe('New comment body')
    expect(composer.querySelector('[role="alert"]')?.textContent).toBe('Your comment couldn\'t be posted.')
    expect(document.body.textContent).not.toContain('offline')
  })

  it('opens a pressed thread into its reply composer and shows its replies', async () => {
    mountPanel({ comments: COMMENTS, currentUser: VIEWER, onSubmit: vi.fn(), renderComposer })
    const toggle = document.querySelector('button[aria-label="Thread by Avery Kim"]') as HTMLButtonElement
    toggle.click()
    await settle()
    expect(threadSurface('root-1').getAttribute('data-selected')).toBe('true')
    expect(document.body.textContent).toContain('A one-level reply')
    const reply = document.querySelector('[aria-label="Replying to Avery Kim"]')
    expect(reply?.getAttribute('data-placeholder')).toBe('Reply to Avery Kim…')
  })

  it('keeps one thread selected at a time', async () => {
    mountPanel({
      comments: [
        { id: 'a', author: OTHER, body: 'First', createdAt: '2026-09-30T19:00:00Z' },
        { id: 'b', author: VIEWER, body: 'Second', createdAt: '2026-09-30T19:05:00Z' },
      ],
    })
    ;(document.querySelector('button[aria-label="Thread by Maya Chen"]') as HTMLButtonElement).click()
    await settle()
    expect(threadSurface('a').getAttribute('data-selected')).toBe('true')
    ;(document.querySelector('button[aria-label="Thread by Avery Kim"]') as HTMLButtonElement).click()
    await settle()
    expect(threadSurface('a').getAttribute('data-selected')).toBe('false')
    expect(threadSurface('b').getAttribute('data-selected')).toBe('true')
  })

  it('posts a new comment and clears the draft', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    mountPanel({ comments: COMMENTS, currentUser: VIEWER, onSubmit, renderComposer })
    const composer = document.querySelector('[aria-label="New comment"]') as HTMLElement
    Array.from(composer.querySelectorAll('button')).find(button => button.textContent === 'Set draft')?.click()
    await settle()
    Array.from(composer.querySelectorAll('button')).find(button => button.textContent === 'Submit composer')?.click()
    await settle()
    expect(onSubmit).toHaveBeenCalledWith('New comment body', undefined)
    expect(composer.querySelector('output')?.textContent).toBe('')
  })

  it('loads earlier comments, and offers Retry when that fails', async () => {
    const onLoadOlder = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined)
    mountPanel({ comments: COMMENTS, hasOlderComments: true, onLoadOlder })
    const loadButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent?.includes('Load earlier comments'))
    loadButton?.click()
    await settle()
    const banner = bannerByData('data-comments-older-error')
    expect(banner.getAttribute('role')).not.toBe('alert')
    expect(banner.textContent).toContain('Earlier comments couldn\'t load')
    const retry = Array.from(banner.querySelectorAll('button')).find(button => button.textContent?.includes('Retry'))
    retry?.click()
    await settle()
    expect(onLoadOlder).toHaveBeenCalledTimes(2)
    expect(Array.from(document.querySelectorAll('button')).some(button => button.textContent?.includes('Load earlier comments'))).toBe(true)
  })

  it('keeps focus on the earlier-comments control as it turns into Retry and back', async () => {
    const onLoadOlder = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined)
    mountPanel({ comments: COMMENTS, hasOlderComments: true, onLoadOlder })
    const loadButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent?.includes('Load earlier comments')) as HTMLButtonElement
    loadButton.focus()
    loadButton.click()
    await settle()
    const retry = document.querySelector('[data-comments-older-error] button') as HTMLButtonElement
    expect(document.activeElement).toBe(retry)
    retry.click()
    await settle()
    expect(onLoadOlder).toHaveBeenCalledTimes(2)
    const restored = Array.from(document.querySelectorAll('button')).find(button => button.textContent?.includes('Load earlier comments'))
    expect(document.activeElement).toBe(restored)
  })
})

describe('comments resolved, inline, and host selection', () => {
  it('resolves an open thread and reopens a resolved one', async () => {
    const onResolveThread = vi.fn().mockResolvedValue(undefined)
    const onReopenThread = vi.fn().mockResolvedValue(undefined)
    mountPanel({
      comments: [
        { id: 'open', author: OTHER, body: 'Open thread', createdAt: '2026-09-30T19:00:00Z' },
        { id: 'done', author: OTHER, body: 'Resolved thread', createdAt: '2026-09-30T19:05:00Z', isResolved: true, resolvedBy: VIEWER },
      ],
      currentUser: VIEWER,
      onResolveThread,
      onReopenThread,
    })
    const resolve = Array.from(threadSurface('open').querySelectorAll('button')).find(button => button.textContent?.includes('Mark as resolved') || button.getAttribute('aria-label')?.includes('Mark as resolved'))
    resolve?.click()
    await settle()
    expect(onResolveThread).toHaveBeenCalledWith('open')
    expect(threadSurface('done').textContent).toContain('Resolved')
    const reopen = Array.from(threadSurface('done').querySelectorAll('button')).find(button => button.textContent?.includes('Reopen') || button.getAttribute('aria-label')?.includes('Reopen'))
    reopen?.click()
    await settle()
    expect(onReopenThread).toHaveBeenCalledWith('done')
  })

  it('quotes anchored passages and marks orphaned ones Outdated', () => {
    mountPanel({
      highlightColor: 'blue',
      comments: [
        { id: 'inline', author: OTHER, body: 'Should this say three days?', createdAt: '2026-09-30T19:00:00Z', anchor: { quote: 'The rollout completes in two days.' } },
        { id: 'orphaned', author: VIEWER, body: 'Typo.', createdAt: '2026-09-30T19:05:00Z', anchor: { quote: 'Teh query runs hourly.', status: 'orphaned' } },
      ],
    })
    expect(threadSurface('inline').querySelector('[data-quote-rule="highlight"]')?.getAttribute('data-highlight-color')).toBe('blue')
    expect(threadSurface('orphaned').textContent).toContain('Outdated')
    expect(threadSurface('orphaned').querySelector('[data-quote-rule="neutral"]')).not.toBeNull()
  })

  it('lets the host own selection for highlight sync', async () => {
    const selected = ref<string | null>(null)
    const Host = defineComponent({
      setup: () => () => h('div', { style: 'height: 600px' }, [
        h('button', { type: 'button', onClick: () => { selected.value = 'root-1' } }, 'Select from document'),
        h('output', { 'data-testid': 'selected' }, selected.value ?? 'none'),
        h(Comments, {
          comments: COMMENTS,
          currentUser: VIEWER,
          selectedThreadId: selected.value,
          onSubmit: vi.fn(),
          renderComposer,
          onSelectedThreadChange: (threadId: string | null) => { selected.value = threadId },
        }),
      ]),
    })
    mount(Host, { attachTo: document.body })
    Array.from(document.querySelectorAll('button')).find(button => button.textContent === 'Select from document')?.click()
    await settle()
    expect(threadSurface('root-1').getAttribute('data-selected')).toBe('true')
    expect(document.body.textContent).toContain('A one-level reply')
    ;(document.querySelector('button[aria-label="Thread by Avery Kim"]') as HTMLButtonElement).click()
    await settle()
    expect(document.querySelector('[data-testid="selected"]')?.textContent).toBe('none')
  })

  it('quotes the composer anchor and lets the viewer remove it', async () => {
    const onDismiss = vi.fn()
    mountPanel({
      comments: [],
      currentUser: VIEWER,
      onSubmit: vi.fn(),
      composerAnchor: { quote: 'Guardrail alerts page within five minutes.' },
      onComposerAnchorDismiss: onDismiss,
    })
    const quote = document.querySelector('[data-composer-anchor="quote"]')
    expect(quote?.textContent).toContain('Guardrail alerts page within five minutes.')
    const remove = Array.from(document.querySelectorAll('button')).find(button =>
      button.textContent?.includes('Remove quoted text') || button.getAttribute('aria-label')?.includes('Remove quoted text'),
    )
    remove?.click()
    await settle()
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})

describe('comments status announcements', () => {
  it('announces a load failure once, assertively, and the Banner has no live role', async () => {
    const wrapper = mount(Comments, {
      props: { comments: [], loadError: 'Server unreachable' },
      attachTo: document.body,
    })
    await settle()
    const liveBanners = Array.from(document.querySelectorAll('[role="alert"]')).filter(node => node.getAttribute('data-astryx-live-region') == null)
    expect(liveBanners).toHaveLength(0)
    expect(document.body.textContent).toContain('Server unreachable')
    expect(announce.mock.calls).toEqual([
      ['Comments couldn\'t load Server unreachable', 'assertive'],
    ])
    await wrapper.setProps({ comments: [], loadError: 'Server unreachable' })
    await settle()
    expect(announce).toHaveBeenCalledTimes(1)
  })
})
