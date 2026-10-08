import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick } from 'vue'
import { ensureDialogModalApi } from '../Dialog/testUtils.js'
import AlertDialog from './AlertDialog.vue'
import { ALERT_DIALOG_CONTEXT_KEY } from './context.js'
import { useImperativeAlertDialog } from './useImperativeAlertDialog.js'

enableAutoUnmount(afterEach)

beforeAll(ensureDialogModalApi)

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

interface MediaStub {
  setMatches: (matches: boolean) => void
}

/**
 * Replaces `matchMedia` with a query list the test can flip. AlertDialog reads
 * the query during setup and follows later changes, so a stub is the only way to
 * drive its narrow layout from a test.
 */
function stubMatchMedia(initial: boolean): MediaStub {
  let matches = initial
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mediaQueryList = {
    get matches() {
      return matches
    },
    media: '',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }
  vi.stubGlobal('matchMedia', vi.fn(() => mediaQueryList))

  return {
    setMatches(next: boolean) {
      matches = next
      for (const listener of listeners)
        listener({ matches: next } as MediaQueryListEvent)
    },
  }
}

const defaultProps = {
  isOpen: true,
  title: 'Delete item?',
  description: 'This action cannot be undone.',
  actionLabel: 'Delete',
}

function renderAlertDialog(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return mount(AlertDialog, {
    attachTo: document.body,
    props: { ...defaultProps, ...props },
    slots,
  })
}

function dialogEl(): HTMLDialogElement {
  return document.querySelector('dialog') as HTMLDialogElement
}

function actionButtons(wrapper: ReturnType<typeof renderAlertDialog>) {
  return wrapper.findAll('.astryx-alert-dialog__action')
}

function buttonLabels(wrapper: ReturnType<typeof renderAlertDialog>): (string | undefined)[] {
  return actionButtons(wrapper).map(button => button.text())
}

/** The action buttons in document order, for tests that drive a mounted host. */
function renderedActions(): HTMLButtonElement[] {
  return [...document.querySelectorAll<HTMLButtonElement>('.astryx-alert-dialog__action')]
}

describe('alert dialog', () => {
  it('renders a modal alertdialog named and described by its text', () => {
    const wrapper = renderAlertDialog()

    expect(dialogEl().getAttribute('role')).toBe('alertdialog')
    expect(dialogEl().getAttribute('aria-modal')).toBe('true')

    const labelledBy = dialogEl().getAttribute('aria-labelledby')
    const describedBy = dialogEl().getAttribute('aria-describedby')
    expect(document.getElementById(labelledBy!)?.textContent).toBe('Delete item?')
    expect(document.getElementById(describedBy!)?.textContent).toBe('This action cannot be undone.')
    expect(wrapper.find('.astryx-alert-dialog__title').exists()).toBe(true)
  })

  it('renders the title as a level-2 heading', () => {
    const wrapper = renderAlertDialog()

    const title = wrapper.find('.astryx-alert-dialog__title')
    expect(title.element.tagName).toBe('H2')
    expect(title.text()).toBe('Delete item?')
  })

  it('renders a ghost cancel next to a destructive confirm', () => {
    const wrapper = renderAlertDialog()
    const buttons = actionButtons(wrapper)

    expect(buttonLabels(wrapper)).toEqual(['Cancel', 'Delete'])
    expect(buttons[0].attributes('data-variant')).toBe('ghost')
    expect(buttons[1].attributes('data-variant')).toBe('destructive')
  })

  it('uses the given cancel label and action variant', () => {
    const wrapper = renderAlertDialog({ actionVariant: 'primary', cancelLabel: 'Never mind' })
    const buttons = actionButtons(wrapper)

    expect(buttonLabels(wrapper)).toEqual(['Never mind', 'Delete'])
    expect(buttons[1].attributes('data-variant')).toBe('primary')
  })

  it('asks the parent to close when the cancel action is used', async () => {
    const wrapper = renderAlertDialog()
    await actionButtons(wrapper)[0].trigger('click')

    expect(wrapper.emitted('openChange')).toEqual([[false]])
    expect(dialogEl().hasAttribute('open')).toBe(true)
  })

  it('runs the confirm action without closing the dialog', async () => {
    const wrapper = renderAlertDialog()
    await actionButtons(wrapper)[1].trigger('click')

    expect(wrapper.emitted('action')).toHaveLength(1)
    expect(wrapper.emitted('action')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(wrapper.emitted('openChange')).toBeUndefined()
    expect(dialogEl().hasAttribute('open')).toBe(true)
  })

  it('marks the confirm action busy while its work is in flight', () => {
    const wrapper = renderAlertDialog({ isActionLoading: true })
    const buttons = actionButtons(wrapper)

    expect(buttons[1].attributes('aria-busy')).toBe('true')
    expect(buttons[0].attributes('disabled')).toBeUndefined()
  })

  it('focuses the cancel action on open and marks it as the autofocus target', async () => {
    const wrapper = renderAlertDialog()
    await flushPromises()
    const buttons = actionButtons(wrapper)

    expect(buttons[0].attributes('data-autofocus')).toBe('')
    expect(buttons[1].attributes('data-autofocus')).toBeUndefined()
    expect(document.activeElement).toBe(buttons[0].element)
  })

  it('keeps the narrow layout on the cancel autofocus target', () => {
    stubMatchMedia(true)
    const wrapper = renderAlertDialog()
    const buttons = actionButtons(wrapper)

    expect(buttons[1].attributes('data-autofocus')).toBe('')
    expect(buttons[0].attributes('data-autofocus')).toBeUndefined()
  })

  it('treats Escape as cancel', () => {
    const wrapper = renderAlertDialog()
    const event = new Event('cancel', { cancelable: true })
    dialogEl().dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[false]])
    expect(wrapper.emitted('action')).toBeUndefined()
  })

  it('ignores a click on the backdrop', () => {
    const wrapper = renderAlertDialog()
    dialogEl().dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('returns focus to the trigger when it closes', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open'
    document.body.appendChild(trigger)
    trigger.focus()

    const wrapper = renderAlertDialog({ isOpen: false })
    await wrapper.setProps({ isOpen: true })
    expect(dialogEl().hasAttribute('open')).toBe(true)

    await wrapper.setProps({ isOpen: false })

    expect(dialogEl().hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('lays the actions out in a row, cancel first, above the breakpoint', () => {
    stubMatchMedia(false)
    const wrapper = renderAlertDialog()
    const actions = wrapper.find('.astryx-alert-dialog__actions')

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 640px)')
    expect(buttonLabels(wrapper)).toEqual(['Cancel', 'Delete'])
    expect(actions.attributes('data-direction')).toBe('horizontal')
    expect(actions.attributes('data-main-align')).toBe('end')
    expect(actions.attributes('data-wrap')).toBe('wrap')
  })

  it('stacks the destructive action above cancel on a narrow screen', () => {
    stubMatchMedia(true)
    const wrapper = renderAlertDialog()
    const actions = wrapper.find('.astryx-alert-dialog__actions')

    expect(buttonLabels(wrapper)).toEqual(['Delete', 'Cancel'])
    expect(actions.attributes('data-direction')).toBe('vertical')
    expect(actions.attributes('data-cross-align')).toBe('stretch')
    expect(actions.attributes('data-wrap')).toBe('nowrap')

    const [confirm, cancel] = actionButtons(wrapper)
    expect(confirm.element.compareDocumentPosition(cancel.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('reorders the actions when the screen crosses the breakpoint', async () => {
    const media = stubMatchMedia(false)
    const wrapper = renderAlertDialog()
    expect(buttonLabels(wrapper)).toEqual(['Cancel', 'Delete'])

    media.setMatches(true)
    await nextTick()

    expect(buttonLabels(wrapper)).toEqual(['Delete', 'Cancel'])
    expect(wrapper.find('.astryx-alert-dialog').attributes('data-layout')).toBe('stacked')
  })

  it('drives the narrow layout through a reactive context', async () => {
    const media = stubMatchMedia(false)
    const Probe = defineComponent({
      name: 'LayoutProbe',
      setup() {
        const context = inject(ALERT_DIALOG_CONTEXT_KEY)
        return () => h('span', { class: 'probe' }, context?.isSmallScreen.value ? 'stacked' : 'row')
      },
    })
    const wrapper = renderAlertDialog({}, { title: () => h(Probe) })

    expect(wrapper.find('.probe').text()).toBe('row')

    media.setMatches(true)
    await nextTick()

    expect(wrapper.find('.probe').text()).toBe('stacked')
  })

  it('passes the width through to the dialog', () => {
    renderAlertDialog({ width: 320 })
    expect(dialogEl().style.width).toBe('320px')

    document.body.innerHTML = ''
    renderAlertDialog({ width: '36rem' })
    expect(dialogEl().style.width).toBe('36rem')
  })

  it('forwards native attributes and the caller class to the dialog element', () => {
    renderAlertDialog({ 'class': 'my-dialog', 'data-testid': 'confirm-delete' })

    expect(dialogEl().classList.contains('astryx-alert-dialog')).toBe(true)
    expect(dialogEl().classList.contains('my-dialog')).toBe(true)
    expect(dialogEl().getAttribute('data-testid')).toBe('confirm-delete')
  })

  it('exposes the dialog element', () => {
    const wrapper = renderAlertDialog()

    expect(wrapper.vm.element?.tagName).toBe('DIALOG')
  })

  it('renders slot content in place of the props', () => {
    const wrapper = renderAlertDialog({}, {
      actions: () => h('a', { class: 'extra', href: '/help' }, 'Read the guide'),
      description: () => h('strong', 'Everything is removed.'),
      title: () => h('em', 'Delete the project?'),
    })

    expect(wrapper.find('.astryx-alert-dialog__title em').text()).toBe('Delete the project?')
    expect(wrapper.find('.astryx-alert-dialog__description strong').text()).toBe('Everything is removed.')
    expect(wrapper.find('.astryx-alert-dialog__actions .extra').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Delete item?')
  })

  describe('the inline preview path', () => {
    it('renders a named group without claiming modality', () => {
      const wrapper = renderAlertDialog({ isInline: true })

      expect(document.querySelector('dialog')).toBeNull()
      const group = wrapper.find('[role="group"]')
      expect(group.exists()).toBe(true)
      expect(group.attributes('aria-modal')).toBeUndefined()

      const labelledBy = group.attributes('aria-labelledby')
      const describedBy = group.attributes('aria-describedby')
      expect(document.getElementById(labelledBy!)?.textContent).toBe('Delete item?')
      expect(document.getElementById(describedBy!)?.textContent).toBe('This action cannot be undone.')
    })

    it('renders nothing while closed', () => {
      const wrapper = renderAlertDialog({ isInline: true, isOpen: false })

      expect(wrapper.find('.astryx-dialog--inline').exists()).toBe(false)
    })

    it('leaves focus and page scrolling alone', async () => {
      document.body.style.overflow = 'auto'
      const wrapper = renderAlertDialog({ isInline: true })
      await flushPromises()

      expect(document.body.style.overflow).toBe('auto')
      expect(document.activeElement).not.toBe(actionButtons(wrapper)[0].element)
    })
  })
})

describe('useImperativeAlertDialog', () => {
  function harness() {
    const alert = useImperativeAlertDialog()
    const Host = alert.Host
    const trigger = defineComponent({
      name: 'Harness',
      setup() {
        return { alert }
      },
      template: `
        <div>
          <button class="open" @click="alert.show({ title: 'Delete item?', description: 'Gone for good.', actionLabel: 'Delete' })">Open</button>
          <Host />
        </div>
      `,
      components: { Host },
    })
    return mount(trigger, { attachTo: document.body })
  }

  it('renders nothing until it is shown', () => {
    harness()

    expect(document.querySelector('dialog')).toBeNull()
  })

  it('shows the dialog with the given options', async () => {
    const wrapper = harness()
    await wrapper.find('.open').trigger('click')
    await flushPromises()

    expect(dialogEl().getAttribute('role')).toBe('alertdialog')
    expect(document.body.textContent).toContain('Delete item?')
    expect(document.body.textContent).toContain('Gone for good.')
  })

  it('closes on hide and on cancel, and can be shown again', async () => {
    const wrapper = harness()
    await wrapper.find('.open').trigger('click')
    await flushPromises()

    renderedActions()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()
    expect(dialogEl().hasAttribute('open')).toBe(false)

    await wrapper.find('.open').trigger('click')
    await flushPromises()
    expect(dialogEl().hasAttribute('open')).toBe(true)
  })

  it('leaves closing to the caller after the confirm action', async () => {
    const onAction = vi.fn()
    const alert = useImperativeAlertDialog()
    const Host = alert.Host
    const wrapper = mount(defineComponent({
      name: 'ActionHarness',
      setup() {
        return { alert, onAction }
      },
      template: `
        <div>
          <button class="open" @click="alert.show({ title: 'Revoke access?', description: 'Access ends now.', actionLabel: 'Revoke', onAction })">Open</button>
          <Host />
        </div>
      `,
      components: { Host },
    }), { attachTo: document.body })

    await wrapper.find('.open').trigger('click')
    await flushPromises()
    const confirm = renderedActions()[1]
    confirm.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(dialogEl().hasAttribute('open')).toBe(true)
  })

  it('reports the open state', async () => {
    const alert = useImperativeAlertDialog()
    expect(alert.isOpen.value).toBe(false)

    alert.show({ title: 'Delete item?', description: 'Gone for good.', actionLabel: 'Delete' })
    expect(alert.isOpen.value).toBe(true)

    alert.hide()
    expect(alert.isOpen.value).toBe(false)
  })
})
