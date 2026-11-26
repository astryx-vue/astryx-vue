import type { VueWrapper } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import SegmentedControl from './SegmentedControl.vue'
import SegmentedControlItem from './SegmentedControlItem.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

const BOXES: Record<string, { left: number, top: number, width: number, height: number }> = {
  a: { left: 2, top: 2, width: 60, height: 32 },
  b: { left: 64, top: 2, width: 90, height: 32 },
}

/** 用分段自己的 data-value 回答布局：测试环境没有布局，这里替它量。 */
function mockLayout(): void {
  const measure = (property: 'left' | 'top' | 'width' | 'height') => function (this: HTMLElement): number {
    return BOXES[this.dataset.value ?? '']?.[property] ?? 0
  }
  vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(measure('left'))
  vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(measure('top'))
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(measure('width'))
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(measure('height'))
}

function renderControl(modelValue = 'a'): VueWrapper {
  const wrapper: VueWrapper = mount(SegmentedControl, {
    attachTo: document.body,
    props: { 'label': 'View', modelValue, 'onUpdate:modelValue': ((value: string) => { void wrapper.setProps({ modelValue: value }) }) as (...args: unknown[]) => void },
    slots: { default: () => [h(SegmentedControlItem, { label: 'A', value: 'a' }), h(SegmentedControlItem, { label: 'B', value: 'b' })] },
  })
  return wrapper
}

function selectionStyle(wrapper: VueWrapper): string[] {
  const style = (wrapper.get('.astryx-segmented-control').element as HTMLElement).style
  return ['--_selection-x', '--_selection-y', '--_selection-width', '--_selection-height'].map(name => style.getPropertyValue(name))
}

describe('segmentedControl 选中块', () => {
  it('没有布局时不画选中块，选中的分段自己画底色', () => {
    const wrapper = renderControl()
    expect(wrapper.find('.astryx-segmented-control__selection').exists()).toBe(false)
    expect(wrapper.get('.astryx-segmented-control').attributes('data-selection')).toBeUndefined()
  })

  it('量到布局后选中块落在选中的分段上，隐藏给读屏', async () => {
    mockLayout()
    const wrapper = renderControl()
    await nextTick()
    const surface = wrapper.get('.astryx-segmented-control__selection')
    expect(surface.attributes('aria-hidden')).toBe('true')
    expect(selectionStyle(wrapper)).toEqual(['2px', '2px', '60px', '32px'])
  })

  it('每次选中的分段变了，选中块都换到新分段的位置和大小', async () => {
    mockLayout()
    const wrapper = renderControl()
    await wrapper.findAll('button')[1]!.trigger('click')
    await nextTick()
    expect(selectionStyle(wrapper)).toEqual(['64px', '2px', '90px', '32px'])
    await wrapper.setProps({ modelValue: 'a' })
    expect(selectionStyle(wrapper)).toEqual(['2px', '2px', '60px', '32px'])
  })

  it('首屏先落位，下一帧起才带过渡', async () => {
    mockLayout()
    const wrapper = renderControl()
    await nextTick()
    expect(wrapper.get('.astryx-segmented-control').attributes('data-selection')).toBe('measured')
    await new Promise<void>(resolveFrame => requestAnimationFrame(() => resolveFrame()))
    await nextTick()
    expect(wrapper.get('.astryx-segmented-control').attributes('data-selection')).toBe('ready')
  })

  it('选中块的过渡读主题的时长和曲线，减少动态效果时没有过渡', () => {
    const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/segmented-control.css'), 'utf8')
    expect(css).toMatch(/\[data-selection='ready'\] > \.astryx-segmented-control__selection \{[^}]*transition-property: transform, width, height;[^}]*var\(--astryx-duration-fast-max[^}]*var\(--astryx-ease-move/)
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{[^@]*\[data-selection='ready'\] > \.astryx-segmented-control__selection \{[^}]*transition-duration: 0s/)
  })
})
