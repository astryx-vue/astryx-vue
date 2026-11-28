import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { resetDismissStackForTests } from '../layer/dismissStack.js'
import BottomSheet from './BottomSheet.vue'
import { getBottomSheetStackForTests, resetBottomSheetStackForTests } from './stack/bottomSheetStack.js'

/** 面板的过渡由测试手动走完：happy-dom 里过渡没有时长，交接会在同一拍里结束，看不到中间的样子。 */
const transitions = vi.hoisted(() => {
  const pending: Array<{ element: HTMLElement | null, property: string, complete: () => void }> = []
  return {
    pending,
    finish(element: Element | null, property: 'transform' | 'opacity'): void {
      const index = pending.findIndex(item => item.element === element && item.property === property)
      if (index < 0)
        throw new Error(`no pending ${property} transition`)
      const [item] = pending.splice(index, 1)
      item.complete()
    },
  }
})

vi.mock('./sheetTransition.js', () => ({
  waitForTransition: (element: HTMLElement | null, property: string, complete: () => void) => {
    const item = { element, property, complete }
    transitions.pending.push(item)
    return () => {
      const index = transitions.pending.indexOf(item)
      if (index >= 0)
        transitions.pending.splice(index, 1)
    }
  },
}))

enableAutoUnmount(afterEach)

function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal === 'function' && typeof proto.show === 'function')
    return
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
  transitions.pending.length = 0
  document.body.innerHTML = ''
  resetDismissStackForTests()
  resetBottomSheetStackForTests()
  vi.restoreAllMocks()
})

const dialogs = (): HTMLDialogElement[] => [...document.querySelectorAll<HTMLDialogElement>('dialog')]
const panelOf = (dialog: HTMLDialogElement): HTMLElement => dialog.querySelector<HTMLElement>('.astryx-bottom-sheet')!

/** 两张独立面板各管各的打开状态；第二张写在前面，打开顺序和树序反过来。 */
const TwoSheets = defineComponent({
  components: { BottomSheet },
  setup() {
    return { first: ref(false), second: ref(false) }
  },
  template: `
    <BottomSheet v-model:is-open="second" label="Second"><button type="button" class="in-second">Second</button></BottomSheet>
    <BottomSheet v-model:is-open="first" label="First"><button type="button" class="in-first">First</button></BottomSheet>
  `,
})

/** 一个状态值说明哪一步开着；每一步都是独立的 BottomSheet。 */
const Steps = defineComponent({
  components: { BottomSheet },
  setup() {
    const step = ref<'a' | 'b' | null>(null)
    return { step, close: (open: boolean) => {
      if (!open)
        step.value = null
    } }
  },
  template: `
    <button type="button" class="open" @click="step = 'a'">Open</button>
    <button type="button" class="outside" @click="step = 'b'">Outside</button>
    <BottomSheet :is-open="step === 'a'" label="A" @update:is-open="close">
      <button type="button" class="next" @click="step = 'b'">Next</button>
    </BottomSheet>
    <BottomSheet :is-open="step === 'b'" label="B" @update:is-open="close">
      <button type="button" class="back" @click="step = 'a'">Back</button>
    </BottomSheet>
  `,
})

async function openSteps() {
  const wrapper = mount(Steps, { attachTo: document.body })
  ;(wrapper.get('.open').element as HTMLElement).focus()
  await wrapper.get('.open').trigger('click')
  await flushPromises()
  const [a, b] = dialogs()
  transitions.finish(panelOf(a), 'transform')
  await flushPromises()
  return { wrapper, a, b }
}

describe('bottomSheet 按打开顺序叠放', () => {
  it('后打开的盖在先打开的上面，和写在模板里的先后无关', async () => {
    const wrapper = mount(TwoSheets, { attachTo: document.body })
    const [second, first] = dialogs()
    wrapper.vm.first = true
    await flushPromises()
    wrapper.vm.second = true
    await flushPromises()

    expect(getBottomSheetStackForTests().map(entry => entry.element)).toEqual([first, second])
    expect(second.getAttribute('data-sheet-stack')).toBe('top')
    expect(first.getAttribute('data-sheet-stack')).toBe('covered')
    expect(first.getAttribute('data-sheet-stack-depth')).toBe('1')
    expect(first.classList.contains('astryx-bottom-sheet-stack-receded-1')).toBe(true)
    expect(first.hasAttribute('inert')).toBe(true)
    expect(second.hasAttribute('inert')).toBe(false)
    // 一叠只有一层可见遮罩：最底下打开的那张拿着。
    expect(first.style.getPropertyValue('--_sheet-scrim-opacity')).toBe('1')
    expect(second.style.getPropertyValue('--_sheet-scrim-opacity')).toBe('0')
  })

  it('上面那张关掉后，下面那张回到最上面', async () => {
    const wrapper = mount(TwoSheets, { attachTo: document.body })
    const [second, first] = dialogs()
    wrapper.vm.first = true
    await flushPromises()
    wrapper.vm.second = true
    await flushPromises()
    wrapper.vm.second = false
    await flushPromises()
    transitions.finish(panelOf(second), 'transform')
    await flushPromises()

    expect(second.open).toBe(false)
    expect(first.hasAttribute('inert')).toBe(false)
    expect(first.hasAttribute('data-sheet-stack')).toBe(false)
    expect(first.classList.contains('astryx-bottom-sheet-stack-receded-1')).toBe(false)
  })
})

describe('bottomSheet 的替换交接', () => {
  it('在开着的那张里换到下一张时，上一张原地留着，新的进场走完后才淡出', async () => {
    const { wrapper, a, b } = await openSteps()

    await wrapper.get('.next').trigger('click')
    await flushPromises()

    expect(b.open).toBe(true)
    expect(a.open).toBe(true)
    expect(panelOf(a).dataset.state).toBe('retained')
    expect(panelOf(a).dataset.motion).toBe('covered')
    expect(a.getAttribute('data-sheet-stack')).toBe('replaced')
    expect(a.hasAttribute('inert')).toBe(true)
    expect(document.activeElement).toBe(panelOf(b))

    transitions.finish(panelOf(b), 'transform')
    await flushPromises()
    expect(panelOf(a).dataset.motion).toBe('fading')

    transitions.finish(panelOf(a), 'opacity')
    await flushPromises()
    expect(a.open).toBe(false)
    expect(panelOf(a).dataset.state).toBe('hidden')
    expect(b.style.getPropertyValue('--_sheet-scrim-opacity')).toBe('1')
  })

  it('被替换的那张比新的高时，同时往下移到新面板停下的顶边', async () => {
    const { wrapper, a, b } = await openSteps()
    vi.spyOn(panelOf(a), 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 0, y: 100, width: 390, height: 600 }))
    vi.spyOn(panelOf(b), 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 0, y: 340, width: 390, height: 360 }))

    await wrapper.get('.next').trigger('click')
    await flushPromises()

    expect(panelOf(a).dataset.motion).toBe('aligning')
    expect(panelOf(a).style.transform).toBe('translateY(240px)')

    // 两边都走完才淡出：新面板进场完了，被替换的还在对齐。
    transitions.finish(panelOf(b), 'transform')
    await flushPromises()
    expect(panelOf(a).dataset.motion).toBe('aligning')
    transitions.finish(panelOf(a), 'transform')
    await flushPromises()
    expect(panelOf(a).dataset.motion).toBe('fading')
  })

  it('从两张面板外面的控件同时关一张开一张，不算替换', async () => {
    const { wrapper, a, b } = await openSteps()

    await wrapper.get('.outside').trigger('click')
    await flushPromises()

    expect(b.open).toBe(true)
    expect(panelOf(a).dataset.state).toBe('exiting')
    expect(a.hasAttribute('data-sheet-stack')).toBe(true)
    expect(a.getAttribute('data-sheet-stack')).toBe('exiting')
  })

  it('替换之后关掉，焦点回到最初打开第一张的控件', async () => {
    const { wrapper, a, b } = await openSteps()
    const opener = wrapper.get('.open').element as HTMLElement
    await wrapper.get('.next').trigger('click')
    await flushPromises()
    transitions.finish(panelOf(b), 'transform')
    await flushPromises()
    transitions.finish(panelOf(a), 'opacity')
    await flushPromises()

    wrapper.vm.step = null
    await flushPromises()
    transitions.finish(panelOf(b), 'transform')
    await flushPromises()

    expect(b.open).toBe(false)
    expect(document.activeElement).toBe(opener)
  })
})
