import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { resetInteractionModalityForTest } from '../composables/internal/interactionModality.js'
import { resetDismissStackForTests } from '../layer/dismissStack.js'
import BottomSheet from './BottomSheet.vue'
import BottomSheetSwitcher from './BottomSheetSwitcher.vue'
import { resetBottomSheetStackForTests } from './stack/bottomSheetStack.js'

enableAutoUnmount(afterEach)

function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal === 'function' && typeof proto.show === 'function')
    return
  Object.defineProperty(proto, 'open', {
    configurable: true,
    get(this: HTMLDialogElement) {
      return this.hasAttribute('open')
    },
    set(this: HTMLDialogElement, value: boolean) {
      if (value)
        this.setAttribute('open', '')
      else
        this.removeAttribute('open')
    },
  })
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.show = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

beforeAll(ensureDialogModalApi)

afterEach(() => {
  document.body.innerHTML = ''
  delete (document.body as { _lpa?: unknown })._lpa
  resetDismissStackForTests()
  resetBottomSheetStackForTests()
  resetInteractionModalityForTest()
  vi.restoreAllMocks()
})

function opener(): HTMLButtonElement {
  const trigger = document.createElement('button')
  trigger.textContent = 'Open'
  document.body.appendChild(trigger)
  trigger.focus()
  return trigger
}

function renderSheet(props: Record<string, unknown>, content: () => unknown) {
  return mount(BottomSheet, {
    attachTo: document.body,
    props: { isOpen: false, label: 'Filters', ...props },
    slots: { default: content as () => never },
  })
}

describe('bottomSheet 打开时的焦点', () => {
  it('data-autofocus 的字段盖过原生对话框落在第一个控件上的焦点', async () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function (this: HTMLDialogElement) {
      this.setAttribute('open', '')
      this.querySelector<HTMLElement>('.first')?.focus()
    })
    const wrapper = renderSheet({}, () => h('div', [
      h('button', { class: 'first' }, 'First'),
      h('input', { 'class': 'field', 'data-autofocus': '', 'aria-label': 'Query' }),
    ]))
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    expect(showModal).toHaveBeenCalled()
    expect(document.activeElement).toBe(document.querySelector('.field'))
  })

  it('跳过 inert 的、被隐藏的和属于嵌套对话框的 data-autofocus 字段', async () => {
    const wrapper = renderSheet({}, () => h('div', [
      h('input', { 'class': 'inert', 'data-autofocus': '', 'inert': '' }),
      h('div', { inert: '' }, [h('input', { 'class': 'inside-inert', 'data-autofocus': '' })]),
      h('dialog', [h('input', { 'class': 'nested', 'data-autofocus': '' })]),
      h('input', { 'class': 'eligible', 'data-autofocus': '' }),
    ]))
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    expect(document.activeElement).toBe(document.querySelector('.eligible'))
  })

  it('没有可用的 data-autofocus 时模态抽屉把焦点放在面板上', async () => {
    const wrapper = renderSheet({}, () => h('div', [h('input', { 'data-autofocus': '', 'inert': '' })]))
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    expect(document.activeElement).toBe(document.querySelector('.astryx-bottom-sheet'))
  })
})

describe('bottomSheet 关闭时的焦点归还', () => {
  it('归还焦点不滚动页面', async () => {
    const trigger = opener()
    const focus = vi.spyOn(trigger, 'focus')
    const wrapper = renderSheet({}, () => h('p', 'Body'))
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    await wrapper.setProps({ isOpen: false })
    await flushPromises()

    expect(document.activeElement).toBe(trigger)
    expect(focus.mock.calls.at(-1)?.[0]).toMatchObject({ preventScroll: true })
  })

  it('finalFocusRef 也不滚动页面', async () => {
    opener()
    const target = document.createElement('button')
    document.body.appendChild(target)
    const focus = vi.spyOn(target, 'focus')
    const wrapper = renderSheet({ finalFocusRef: target }, () => h('p', 'Body'))
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    await wrapper.setProps({ isOpen: false })
    await flushPromises()

    expect(focus.mock.calls.at(-1)?.[0]).toMatchObject({ preventScroll: true })
  })

  it('打开着就被移除时，被困住的焦点回到打开者', async () => {
    const trigger = opener()
    const wrapper = renderSheet({}, () => h('p', 'Body'))
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    expect(document.activeElement).toBe(document.querySelector('.astryx-bottom-sheet'))

    wrapper.unmount()
    await flushPromises()

    expect(document.activeElement).toBe(trigger)
  })

  it('打开者也一起没了时，沿共用的候选链找落点，不落在 body 上', async () => {
    const section = document.createElement('section')
    const trigger = document.createElement('button')
    const neighbour = document.createElement('button')
    section.append(trigger, neighbour)
    document.body.appendChild(section)
    trigger.focus()
    const wrapper = renderSheet({}, () => h('p', 'Body'))
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    trigger.remove()
    wrapper.unmount()
    await flushPromises()

    expect(document.activeElement).toBe(neighbour)
  })

  it('移除之前焦点本来就在页面上别处时不去动它', async () => {
    opener()
    const wrapper = renderSheet({ hasScrim: false }, () => h('p', 'Body'))
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    const elsewhere = document.createElement('button')
    document.body.appendChild(elsewhere)
    elsewhere.focus()

    wrapper.unmount()
    await flushPromises()

    expect(document.activeElement).toBe(elsewhere)
  })
})

function flow(activeSheet: string | null, props: Record<string, unknown> = {}) {
  return defineComponent({
    components: { BottomSheet, BottomSheetSwitcher },
    setup() {
      const active = ref<string | null>(activeSheet)
      return { active, props }
    },
    template: `
      <BottomSheetSwitcher v-model:active-sheet="active" label="Checkout" v-bind="props">
        <BottomSheet sheet-id="details" label="Details"><button type="button" class="inside">Inside</button></BottomSheet>
      </BottomSheetSwitcher>
    `,
  })
}

describe('bottomSheetSwitcher 的焦点归还', () => {
  it.each([true, false])('关掉整段流程（hasScrim=%s）时焦点留在里面就回到打开者', async (hasScrim) => {
    const trigger = opener()
    const wrapper = mount(flow(null, { hasScrim }), { attachTo: document.body })
    ;(wrapper.vm as unknown as { active: string | null }).active = 'details'
    await flushPromises()
    document.querySelector<HTMLElement>('.inside')?.focus()
    expect(document.activeElement).toBe(document.querySelector('.inside'))

    ;(wrapper.vm as unknown as { active: string | null }).active = null
    await flushPromises()

    expect(document.activeElement).toBe(trigger)
  })

  it('整段流程被直接移除时焦点回到打开者', async () => {
    const trigger = opener()
    const wrapper = mount(flow(null), { attachTo: document.body })
    ;(wrapper.vm as unknown as { active: string | null }).active = 'details'
    await flushPromises()
    document.querySelector<HTMLElement>('.inside')?.focus()

    wrapper.unmount()
    await flushPromises()

    expect(document.activeElement).toBe(trigger)
  })

  it('流程里的 data-autofocus 字段在打开时拿到焦点', async () => {
    const Host = defineComponent({
      components: { BottomSheet, BottomSheetSwitcher },
      template: `
        <BottomSheetSwitcher active-sheet="details" label="Checkout">
          <BottomSheet sheet-id="details" label="Details">
            <button type="button" class="first">First</button>
            <input class="field" data-autofocus aria-label="Query">
          </BottomSheet>
        </BottomSheetSwitcher>
      `,
    })
    mount(Host, { attachTo: document.body })
    await flushPromises()

    expect(document.activeElement).toBe(document.querySelector('.field'))
  })
})

const OpenSheet = defineComponent({
  setup() {
    const isOpen = ref(true)
    return () => h('div', [
      h(BottomSheet, { 'isOpen': isOpen.value, 'onUpdate:isOpen': (value: unknown) => { isOpen.value = value as boolean }, 'label': 'Filters' }, () => h('p', 'Body')),
      h('button', { class: 'close', onClick: () => { isOpen.value = false } }, 'Close'),
    ])
  },
})

describe('bottomSheet 服务端渲染就开着', () => {
  it('服务端标记里的对话框不带 aria-modal', async () => {
    const html = await renderToString(createSSRApp(OpenSheet))
    expect(html).toContain('<dialog')
    expect(html).not.toContain('aria-modal')
  })

  it('水合后以静止状态打开，第一次关闭后恢复动效', async () => {
    const html = await renderToString(createSSRApp(OpenSheet))
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const problems: unknown[] = []
    const app = createSSRApp(OpenSheet)
    app.config.warnHandler = message => problems.push(message)
    app.mount(container)
    await nextTick()
    await flushPromises()
    expect(problems).toEqual([])

    const dialog = container.querySelector('dialog') as HTMLDialogElement
    expect(dialog.open).toBe(true)
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.hasAttribute('data-settled')).toBe(true)

    container.querySelector<HTMLButtonElement>('.close')?.click()
    await flushPromises()
    expect(dialog.hasAttribute('data-settled')).toBe(false)
    app.unmount()
  })

  it('客户端直接挂载的开着的抽屉照常播进场', async () => {
    const wrapper = mount(OpenSheet, { attachTo: document.body })
    await flushPromises()

    expect(document.querySelector('dialog')?.hasAttribute('data-settled')).toBe(false)
    wrapper.unmount()
  })

  it('开着的流程在服务端同样不带 aria-modal，水合后静止打开', async () => {
    const Host = defineComponent({
      components: { BottomSheet, BottomSheetSwitcher },
      template: `
        <BottomSheetSwitcher active-sheet="details" label="Checkout">
          <BottomSheet sheet-id="details" label="Details"><p>Body</p></BottomSheet>
        </BottomSheetSwitcher>
      `,
    })
    const html = await renderToString(createSSRApp(Host))
    expect(html).not.toContain('aria-modal')

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.append(container)
    const app = createSSRApp(Host)
    app.mount(container)
    await nextTick()
    await flushPromises()

    const dialog = container.querySelector('dialog') as HTMLDialogElement
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.hasAttribute('data-settled')).toBe(true)
    app.unmount()
  })
})
