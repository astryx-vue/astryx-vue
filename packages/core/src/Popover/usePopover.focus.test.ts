import type { UsePopoverOptions, UsePopoverReturn } from './usePopover.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { usePopover } from './usePopover.js'

afterEach(() => {
  document.body.innerHTML = ''
})

function button(label: string): HTMLButtonElement {
  const element = document.createElement('button')
  element.type = 'button'
  element.textContent = label
  return element
}

function setup(options: UsePopoverOptions = {}) {
  let popover: UsePopoverReturn | undefined
  const toolbar = document.createElement('div')
  const before = button('Before')
  const trigger = button('Open')
  const after = button('After')
  toolbar.append(before, trigger, after)
  document.body.append(toolbar)
  const surface = document.createElement('div')
  const first = button('First')
  const second = button('Second')
  surface.append(first, second)
  document.body.append(surface)
  mount(defineComponent({
    setup() {
      popover = usePopover(options)
      popover.contentRef.value = surface
      popover.triggerRef.value = trigger
      return () => h('div')
    },
  }))
  return { popover: popover!, toolbar, before, trigger, after, surface, first, second }
}

async function openFromTrigger(trigger: HTMLElement): Promise<void> {
  trigger.focus()
  trigger.click()
  await flushPromises()
}

describe('usePopover initial focus', () => {
  it('keeps focus that onShow moved to a control inside', async () => {
    let second: HTMLButtonElement | undefined
    const ctx = setup({
      onShow: () => {
        void nextTick(() => second?.focus())
      },
    })
    second = ctx.second

    await openFromTrigger(ctx.trigger)
    expect(document.activeElement).toBe(ctx.second)
  })
})

describe('usePopover focus return', () => {
  it('leaves focus where onHide put it', async () => {
    let target: HTMLButtonElement | undefined
    const ctx = setup({ onHide: () => target?.focus() })
    target = ctx.before

    await openFromTrigger(ctx.trigger)
    expect(document.activeElement).toBe(ctx.first)
    ctx.popover.hide()
    await flushPromises()
    expect(document.activeElement).toBe(ctx.before)
  })

  it('does not move focus that never entered the popover', async () => {
    const ctx = setup({ hasAutoFocus: false, isModal: false })
    await openFromTrigger(ctx.trigger)
    ctx.after.focus()
    ctx.popover.hide()
    await flushPromises()
    expect(document.activeElement).toBe(ctx.after)
  })

  it('goes to the tab stop that took the trigger\'s place when the trigger is gone', async () => {
    const ctx = setup()
    await openFromTrigger(ctx.trigger)
    expect(document.activeElement).toBe(ctx.first)

    ctx.trigger.remove()
    ctx.popover.hide()
    await flushPromises()
    expect(document.activeElement).toBe(ctx.after)
  })

  it('falls back to the main landmark, never the body, when nothing near the opener is left', async () => {
    const main = document.createElement('main')
    document.body.append(main)
    const ctx = setup()
    await openFromTrigger(ctx.trigger)

    ctx.toolbar.remove()
    ctx.popover.hide()
    await flushPromises()
    expect(document.activeElement).toBe(main)
    main.blur()
    expect(main.hasAttribute('tabindex')).toBe(false)
  })
})
