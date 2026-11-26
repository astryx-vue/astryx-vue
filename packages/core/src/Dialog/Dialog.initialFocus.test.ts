import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { h } from 'vue'
import Dialog from './Dialog.vue'
import { findInitialFocusTarget } from './initialFocus.js'
import { ensureDialogModalApi } from './testUtils.js'

enableAutoUnmount(afterEach)
beforeAll(ensureDialogModalApi)

afterEach(() => {
  document.body.innerHTML = ''
})

function renderDialog(children: () => unknown[]) {
  return mount(Dialog, {
    attachTo: document.body,
    props: { 'isOpen': true, 'aria-label': 'Review' },
    slots: { default: children as never },
  })
}

describe('dialog initial focus', () => {
  it('skips a hidden, inert or disabled request for the next eligible one', () => {
    renderDialog(() => [
      h('div', { hidden: true }, [h('button', { 'data-autofocus': '' }, 'Hidden')]),
      h('div', { inert: true }, [h('button', { 'data-autofocus': '' }, 'Inert')]),
      h('button', { 'data-autofocus': '', 'disabled': true }, 'Unavailable'),
      h('button', { 'data-autofocus': '' }, 'Continue'),
    ])

    expect(document.activeElement?.textContent).toBe('Continue')
  })

  it('takes the explicit request before the title\'s default request', () => {
    renderDialog(() => [
      h('div', { 'tabindex': -1, 'data-dialog-default-focus': '' }, 'Title'),
      h('button', { 'data-autofocus': '' }, 'Continue'),
    ])

    expect(document.activeElement?.textContent).toBe('Continue')
  })

  it('falls back to the title request when no explicit request is eligible', () => {
    renderDialog(() => [
      h('div', { 'tabindex': -1, 'data-dialog-default-focus': '' }, 'Title'),
      h('div', { hidden: true }, [h('button', { 'data-autofocus': '' }, 'Hidden')]),
    ])

    expect(document.activeElement?.textContent).toBe('Title')
  })

  it('leaves a request inside a nested dialog to that dialog', () => {
    const dialog = document.createElement('dialog')
    dialog.innerHTML = '<button data-autofocus>Outer</button><dialog><button data-autofocus>Nested</button></dialog>'
    document.body.append(dialog)

    expect(findInitialFocusTarget(dialog)?.textContent).toBe('Outer')

    dialog.querySelector('dialog')!.previousElementSibling!.remove()
    expect(findInitialFocusTarget(dialog)).toBeNull()
  })
})
