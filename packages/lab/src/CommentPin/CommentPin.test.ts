import type { CommentPinParticipant } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import CommentPin from './CommentPin.vue'

enableAutoUnmount(afterEach)

const ADA: CommentPinParticipant = { id: 'ada', name: 'Ada Lovelace' }
const LIN: CommentPinParticipant = { id: 'lin', name: 'Lin Chen' }
const MIRA: CommentPinParticipant = { id: 'mira', name: 'Mira Patel' }
const NOAH: CommentPinParticipant = { id: 'noah', name: 'Noah Williams' }
const SAM: CommentPinParticipant = { id: 'sam', name: 'Sam Rivera' }

const originalMatches = HTMLElement.prototype.matches
const popoverOpenState = new WeakMap<HTMLElement, boolean>()

beforeEach(() => {
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

afterEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'matches', {
    configurable: true,
    writable: true,
    value: originalMatches,
  })
  document.body.innerHTML = ''
})

async function settle(): Promise<void> {
  await flushPromises()
  await nextTick()
  await new Promise<void>(resolve => setTimeout(resolve, 0))
}

function pinByName(name: string): HTMLElement {
  const pin = document.querySelector(`[aria-label="${name}"]`)
  if (!(pin instanceof HTMLElement))
    throw new Error(`Pin not found: ${name}`)
  return pin
}

describe('commentPin', () => {
  it('renders one labelled button and one representative for a single thread', () => {
    mount(CommentPin, {
      props: { label: 'Open annotation from Ada', participants: [ADA] },
      attachTo: document.body,
    })
    const pin = pinByName('Open annotation from Ada')
    expect(pin.getAttribute('aria-pressed')).toBe('false')
    expect(document.querySelectorAll('.astryx-avatar')).toHaveLength(1)
    expect(pin.textContent?.includes('1')).toBe(false)
  })

  it('shows up to three distinct participants and the exact total for a group', () => {
    mount(CommentPin, {
      props: {
        label: 'Open 12 grouped annotations',
        participants: [ADA, ADA, LIN, MIRA],
        threadCount: 12,
      },
      attachTo: document.body,
    })
    expect(document.querySelectorAll('.astryx-avatar')).toHaveLength(3)
    expect(document.querySelector('.astryx-avatar-group-overflow')).toBeNull()
    expect(document.body.textContent).toContain('12')
    expect(pinByName('Open 12 grouped annotations').getAttribute('data-grouped')).toBe('grouped')
  })

  it('caps a group at three circles with an ellipsis overflow beyond three people', () => {
    mount(CommentPin, {
      props: {
        label: 'Open 6 grouped annotations from Ada, Lin, and 3 others',
        participants: [ADA, LIN, MIRA, NOAH, SAM],
        threadCount: 6,
      },
      attachTo: document.body,
    })
    expect(document.querySelectorAll('.astryx-avatar')).toHaveLength(2)
    const overflow = document.querySelector('.astryx-avatar-group-overflow')
    expect(overflow).not.toBeNull()
    expect(overflow?.querySelector('.astryx-icon, svg')).not.toBeNull()
    expect(overflow?.textContent?.trim()).toBe('')
    expect(overflow?.textContent).not.toContain('+')
    expect(overflow?.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(document.body.textContent).toContain('6')
  })

  it.each([
    [undefined, 'sm', '22px'],
    ['sm', 'sm', '22px'],
    ['md', 'md', '24px'],
    ['lg', 'lg', '28px'],
  ] as const)('size %s reflects %s and draws %s participant circles', (size, reflected, avatarPx) => {
    mount(CommentPin, {
      props: {
        label: 'Open 6 grouped annotations',
        participants: [ADA, LIN, MIRA, NOAH, SAM],
        threadCount: 6,
        ...(size == null ? {} : { size }),
      },
      attachTo: document.body,
    })
    const pin = pinByName('Open 6 grouped annotations')
    expect(pin.getAttribute('data-size')).toBe(reflected)
    const avatars = document.querySelectorAll('.astryx-avatar')
    expect(avatars).toHaveLength(2)
    for (const avatar of avatars)
      expect(avatar.getAttribute('style') ?? '').toContain(avatarPx)
  })

  it('sizes a single participant with the pin', () => {
    mount(CommentPin, {
      props: { label: 'Open annotation', participants: [ADA], size: 'lg' },
      attachTo: document.body,
    })
    expect(document.querySelector('.astryx-avatar')?.getAttribute('style') ?? '').toContain('28px')
  })

  it('marks unread threads with an accent dot after the total', () => {
    mount(CommentPin, {
      props: {
        label: 'Open 4 grouped annotations, 2 unread',
        participants: [ADA, LIN],
        threadCount: 4,
        unreadCount: 2,
      },
      attachTo: document.body,
    })
    const pin = pinByName('Open 4 grouped annotations, 2 unread')
    expect(pin.getAttribute('data-unread')).toBe('unread')
    const dot = document.querySelector('.astryx-status-dot')
    expect(dot?.getAttribute('data-variant')).toBe('accent')
    expect(dot?.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(pin.querySelector('.astryx-comment-pin__count')?.textContent).toBe('4')
    expect(pin.textContent).not.toContain('2')
    const total = pin.querySelector('.astryx-comment-pin__count')
    expect(dot && total && (dot.compareDocumentPosition(total) & Node.DOCUMENT_POSITION_PRECEDING)).toBeTruthy()
    expect(document.querySelectorAll('.astryx-avatar')).toHaveLength(2)
  })

  it('marks an unread single-thread pin with a dot and no number', () => {
    mount(CommentPin, {
      props: {
        label: 'Open unread annotation from Ada',
        participants: [ADA],
        unreadCount: 1,
      },
      attachTo: document.body,
    })
    const pin = pinByName('Open unread annotation from Ada')
    expect(pin.getAttribute('data-unread')).toBe('unread')
    expect(document.querySelector('.astryx-status-dot')).not.toBeNull()
    expect(pin.querySelector('.astryx-comment-pin__count')).toBeNull()
  })

  it('does not expose visible Avatar or count semantics separately from the button', () => {
    mount(CommentPin, {
      props: {
        label: 'Open 4 annotations from Ada and Lin',
        participants: [ADA, LIN],
        threadCount: 4,
      },
      attachTo: document.body,
    })
    expect(document.querySelectorAll('.astryx-comment-pin')).toHaveLength(1)
    const exposedImages = Array.from(document.querySelectorAll('[role="img"]')).filter(
      node => node.closest('[aria-hidden="true"]') == null,
    )
    expect(exposedImages).toHaveLength(0)
    expect(document.querySelector('.astryx-avatar')?.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(document.querySelector('.astryx-comment-pin__count')?.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('keeps a single marker to one representative even when more are supplied', () => {
    mount(CommentPin, {
      props: { label: 'Open annotation', participants: [ADA, LIN, MIRA] },
      attachTo: document.body,
    })
    expect(document.querySelectorAll('.astryx-avatar')).toHaveLength(1)
    expect(pinByName('Open annotation').hasAttribute('data-grouped')).toBe(false)
  })

  it('reflects selected, resolved, and disabled state on the owning target', () => {
    mount(CommentPin, {
      props: {
        label: 'Resolved selected annotation',
        participants: [ADA],
        isSelected: true,
        isResolved: true,
        isDisabled: true,
      },
      attachTo: document.body,
    })
    const marker = pinByName('Resolved selected annotation')
    expect(marker.getAttribute('aria-pressed')).toBe('true')
    expect(marker.hasAttribute('disabled')).toBe(false)
    expect(marker.getAttribute('aria-disabled')).toBe('true')
    expect(marker.getAttribute('data-selected')).toBe('selected')
    expect(marker.getAttribute('data-resolved')).toBe('resolved')
    expect(marker.getAttribute('data-disabled')).toBe('disabled')
  })

  it('renders nothing for a resolved pin unless it is selected', async () => {
    const wrapper = mount(CommentPin, {
      props: {
        label: 'Open resolved annotation from Ada',
        participants: [ADA],
        isResolved: true,
      },
      attachTo: document.body,
    })
    expect(document.querySelector('.astryx-comment-pin')).toBeNull()
    expect(document.querySelector('button')).toBeNull()
    await wrapper.setProps({ isSelected: true })
    await settle()
    const pin = pinByName('Open resolved annotation from Ada')
    expect(pin.getAttribute('data-resolved')).toBe('resolved')
    expect(pin.getAttribute('data-selected')).toBe('selected')
  })

  it('dims non-selected pins without disabling selection changes', async () => {
    const wrapper = mount(CommentPin, {
      props: {
        label: 'Open another annotation',
        participants: [LIN],
        isDimmed: true,
      },
      attachTo: document.body,
    })
    const pin = pinByName('Open another annotation')
    expect(pin.getAttribute('data-dimmed')).toBe('dimmed')
    expect(pin.hasAttribute('disabled')).toBe(false)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('calls the forwarded click handler when enabled', async () => {
    const wrapper = mount(CommentPin, {
      props: { label: 'Open annotation', participants: [ADA] },
      attachTo: document.body,
    })
    wrapper.find('button').trigger('click')
    await settle()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('exposes aria-disabled instead of the native attribute when disabled', () => {
    mount(CommentPin, {
      props: { label: 'Pending annotation', participants: [ADA], isDisabled: true },
      attachTo: document.body,
    })
    const pin = pinByName('Pending annotation')
    expect(pin.hasAttribute('disabled')).toBe(false)
    expect(pin.getAttribute('aria-disabled')).toBe('true')
  })

  it('keeps a disabled pin in the tab order (spec:AST-085 FR1)', () => {
    const Host = defineComponent({
      setup: () => () => h('div', [
        h(CommentPin, { label: 'Open annotation', participants: [ADA] }),
        h(CommentPin, { label: 'Pending annotation', participants: [LIN], isDisabled: true }),
        h(CommentPin, { label: 'Another annotation', participants: [MIRA] }),
      ]),
    })
    mount(Host, { attachTo: document.body })
    const pins = Array.from(document.querySelectorAll('.astryx-comment-pin')) as HTMLElement[]
    expect(pins).toHaveLength(3)
    expect(pins[1]?.getAttribute('aria-label')).toBe('Pending annotation')
    expect(pins[1]?.tabIndex).toBeGreaterThanOrEqual(0)
    expect(pins[1]?.hasAttribute('disabled')).toBe(false)
  })

  it('does not call the click handler when disabled', async () => {
    const wrapper = mount(CommentPin, {
      props: { label: 'Pending annotation', participants: [ADA], isDisabled: true },
      attachTo: document.body,
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('blocks Enter and Space on a disabled pin (spec:AST-085 FR2)', async () => {
    const wrapper = mount(CommentPin, {
      props: { label: 'Pending annotation', participants: [ADA], isDisabled: true },
      attachTo: document.body,
    })
    const nativeClicks = vi.fn()
    const pin = pinByName('Pending annotation')
    pin.addEventListener('click', nativeClicks)
    pin.focus()
    pin.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    pin.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }))
    await settle()
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(nativeClicks).not.toHaveBeenCalled()
    pin.removeEventListener('click', nativeClicks)
  })

  it('does not let a disabled pin activate a clickable ancestor (spec:AST-085 FR2)', async () => {
    const surfaceClick = vi.fn()
    const Host = defineComponent({
      setup: () => () => h('div', {
        'role': 'button',
        'aria-label': 'Annotation surface',
        'onClick': surfaceClick,
      }, [
        h(CommentPin, { label: 'Pending annotation', participants: [ADA], isDisabled: true }),
      ]),
    })
    mount(Host, { attachTo: document.body })
    pinByName('Pending annotation').click()
    await settle()
    expect(surfaceClick).not.toHaveBeenCalled()
  })

  it('keeps focus when the pin becomes disabled while focused (spec:AST-085 FR4)', async () => {
    const wrapper = mount(CommentPin, {
      props: { label: 'Open annotation', participants: [ADA] },
      attachTo: document.body,
    })
    const pin = pinByName('Open annotation')
    pin.focus()
    expect(document.activeElement).toBe(pin)
    await wrapper.setProps({ isDisabled: true })
    await settle()
    expect(document.activeElement).toBe(pin)
    expect(pin.getAttribute('aria-disabled')).toBe('true')
  })

  it('forwards the ref and neutral button props', () => {
    const wrapper = mount(CommentPin, {
      props: { label: 'Open annotation', participants: [ADA] },
      attrs: { 'data-cluster-id': 'cluster-1', 'aria-controls': 'thread-panel' },
      attachTo: document.body,
    })
    const pin = pinByName('Open annotation')
    expect(pin.tagName).toBe('BUTTON')
    expect(pin.getAttribute('type')).toBe('button')
    expect(pin.getAttribute('data-cluster-id')).toBe('cluster-1')
    expect(pin.getAttribute('aria-controls')).toBe('thread-panel')
    const exposed = (wrapper.vm as { element: HTMLElement | { value: HTMLElement | null } }).element
    expect(exposed instanceof HTMLElement ? exposed : exposed.value).toBe(pin)
  })

  it('combines the stable target with a caller class and style', () => {
    mount(CommentPin, {
      props: { label: 'Open annotation', participants: [ADA] },
      attrs: { class: 'host-position', style: 'inset-inline-start: 24px' },
      attachTo: document.body,
    })
    const marker = pinByName('Open annotation')
    expect(marker.className).toContain('astryx-comment-pin')
    expect(marker.className).toContain('host-position')
    expect(marker.getAttribute('style') ?? '').toContain('24px')
  })

  it('falls back to a single anonymous Avatar and warns for no representatives', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(CommentPin, {
      props: {
        label: 'Open annotation',
        participants: [] as unknown as [typeof ADA],
      },
      attachTo: document.body,
    })
    expect(document.querySelectorAll('.astryx-avatar')).toHaveLength(1)
    await settle()
    expect(warning.mock.calls.some(call => String(call[0]).includes('participants` should contain at least one'))).toBe(true)
    warning.mockRestore()
  })

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'falls back to a single-thread marker for invalid threadCount %s',
    async (threadCount) => {
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
      mount(CommentPin, {
        props: {
          label: 'Open annotation',
          participants: [ADA, LIN],
          threadCount,
        },
        attachTo: document.body,
      })
      expect(document.querySelectorAll('.astryx-avatar')).toHaveLength(1)
      expect(pinByName('Open annotation').hasAttribute('data-grouped')).toBe(false)
      await settle()
      expect(warning.mock.calls.some(call => String(call[0]).includes('threadCount` must be a finite positive integer'))).toBe(true)
      warning.mockRestore()
    },
  )

  it('shows its action label as a visual tooltip on hover', async () => {
    vi.useFakeTimers()
    try {
      mount(CommentPin, {
        props: { label: 'Open annotation from Ada', participants: [ADA] },
        attachTo: document.body,
      })
      const marker = pinByName('Open annotation from Ada')
      const tooltip = document.querySelector('[role="tooltip"]') as HTMLElement | null
      expect(tooltip).not.toBeNull()
      expect(tooltip?.textContent).toContain('Open annotation from Ada')
      expect(tooltip?.style.display).toBe('none')
      marker.dispatchEvent(new Event('mouseenter'))
      vi.advanceTimersByTime(200)
      await nextTick()
      expect(tooltip?.style.display).not.toBe('none')
    }
    finally {
      vi.useRealTimers()
    }
  })
})
