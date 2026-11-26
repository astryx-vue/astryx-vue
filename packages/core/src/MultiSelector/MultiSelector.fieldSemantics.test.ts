import type { MultiSelectorTriggerProps } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import MultiSelector from './MultiSelector.vue'

const options = [
  { value: 'locked', label: 'Locked', disabled: true },
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
  { value: 'edit', label: 'Édit' },
]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

afterEach(() => {
  document.body.innerHTML = ''
  resetLiveRegionsForTest()
  vi.useRealTimers()
})

function mountSelector(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  return mount(MultiSelector, { attachTo: document.body, props: { label: 'Access', options, ...props }, attrs })
}

function textOfIds(ids: string | undefined): string {
  return (ids ?? '').split(/\s+/).filter(Boolean).map(id => document.getElementById(id)?.textContent?.trim() ?? '').join(' ')
}

describe('multi selector field semantics', () => {
  it('submits no value while disabled', () => {
    const enabled = mountSelector({ name: 'access', modelValue: ['read'] })
    expect(enabled.findAll('input[type="hidden"][name="access"]')).toHaveLength(1)
    const disabled = mountSelector({ name: 'access', modelValue: ['read'], disabled: true })
    expect(disabled.findAll('input[type="hidden"]')).toHaveLength(0)
  })

  it('names the trigger by the field label followed by a caller aria-labelledby', () => {
    const wrapper = mountSelector({}, { 'aria-labelledby': 'lunch' })
    const heading = document.createElement('h2')
    heading.id = 'lunch'
    heading.textContent = 'Lunch'
    document.body.append(heading)
    expect(textOfIds(wrapper.get('.astryx-multi-selector-trigger').attributes('aria-labelledby'))).toBe('Access Lunch')
    expect(mountSelector().get('.astryx-multi-selector-trigger').attributes('aria-labelledby')).toBeUndefined()
  })

  it('hides the busy Spinner and announces the busy start once', async () => {
    vi.useFakeTimers()
    const wrapper = mountSelector({ isLoading: true })
    await vi.advanceTimersByTimeAsync(50)
    expect(wrapper.get('.astryx-multi-selector-spinner').attributes('aria-hidden')).toBe('true')
    const live = (): string => document.querySelector('[data-astryx-live-region="polite"]')?.textContent ?? ''
    expect(live()).toBe('Loading')
    await vi.advanceTimersByTimeAsync(2500)
    await wrapper.setProps({ modelValue: ['read'] })
    await vi.advanceTimersByTimeAsync(50)
    expect(live()).toBe('')
  })

  it('opens on the first enabled option, never a disabled one', async () => {
    const wrapper = mountSelector()
    const trigger = wrapper.get('.astryx-multi-selector-trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const read = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent?.includes('Read'))
    expect(read?.classList.contains('is-active')).toBe(true)
    const locked = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent?.includes('Locked'))
    expect(locked?.classList.contains('is-active')).toBe(false)
  })

  it('type-to-select ignores accents', async () => {
    const wrapper = mountSelector()
    const trigger = wrapper.get('.astryx-multi-selector-trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'e' })
    await flush()
    const edit = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent?.includes('Édit'))
    expect(edit?.classList.contains('is-active')).toBe(true)
  })

  it('a hover that did not move the mouse does not take the keyboard highlight', async () => {
    const wrapper = mountSelector()
    await wrapper.get('.astryx-multi-selector-trigger').trigger('click')
    await flush()
    const rows = [...document.querySelectorAll<HTMLElement>('[role="option"]')]
    const [, read, write] = rows
    const move = (x: number): MouseEvent => new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: 10 })
    read!.dispatchEvent(move(5))
    read!.dispatchEvent(new MouseEvent('mouseenter', { clientX: 5, clientY: 10 }))
    await flush()
    expect(read!.classList.contains('is-active')).toBe(true)
    // 键盘滚动让另一行从静止的鼠标下冒出来：坐标没变，不抢高亮。
    write!.dispatchEvent(new MouseEvent('mouseenter', { clientX: 5, clientY: 10 }))
    await flush()
    expect(write!.classList.contains('is-active')).toBe(false)
    write!.dispatchEvent(new MouseEvent('mouseenter', { clientX: 9, clientY: 10 }))
    await flush()
    expect(write!.classList.contains('is-active')).toBe(true)
  })

  it('a caller-rendered trigger exposes the disabled state and runs no caller handler while disabled', async () => {
    const callerClick = vi.fn()
    const wrapper = mount(MultiSelector, {
      attachTo: document.body,
      props: { label: 'Access', options, disabled: true },
      slots: {
        trigger: (props: MultiSelectorTriggerProps) => h('button', { ...props, onClick: [props.onClick, callerClick] }, 'Pick'),
      },
    })
    const button = wrapper.get('button')
    expect(button.attributes('aria-disabled')).toBe('true')
    await button.trigger('click')
    expect(callerClick).not.toHaveBeenCalled()
    expect(button.attributes('aria-expanded')).toBe('false')
    await wrapper.setProps({ disabled: false })
    expect(button.attributes('aria-disabled')).toBeUndefined()
    await button.trigger('click')
    expect(callerClick).toHaveBeenCalledTimes(1)
  })

  it('blocks a toggle from a panel that was already open when the field became disabled', async () => {
    const wrapper = mountSelector({ modelValue: [] })
    const trigger = wrapper.get('.astryx-multi-selector-trigger')
    await trigger.trigger('click')
    await flush()
    await wrapper.setProps({ disabled: true })
    const read = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent?.includes('Read'))
    read?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await trigger.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('a required field marks its combobox, and with search marks the search box instead of the button', async () => {
    const plain = mountSelector({ required: true })
    expect(plain.get('.astryx-multi-selector-trigger').attributes('aria-required')).toBe('true')
    const searchable = mountSelector({ required: true, searchable: true })
    const trigger = searchable.get('.astryx-multi-selector-trigger')
    expect(trigger.attributes('aria-required')).toBeUndefined()
    await trigger.trigger('click')
    await flush()
    expect(document.querySelector('input[role="combobox"]')?.getAttribute('aria-required')).toBe('true')
  })
})
