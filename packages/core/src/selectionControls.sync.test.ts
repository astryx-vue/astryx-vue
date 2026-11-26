import type { VueWrapper } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import CheckboxInput from './CheckboxInput/CheckboxInput.vue'
import CheckboxList from './CheckboxList/CheckboxList.vue'
import CheckboxListItem from './CheckboxList/CheckboxListItem.vue'
import FormLayout from './FormLayout/FormLayout.vue'
import RadioList from './Radio/RadioList.vue'
import RadioListItem from './RadioList/RadioListItem.vue'
import SegmentedControl from './SegmentedControl/SegmentedControl.vue'
import SegmentedControlItem from './SegmentedControl/SegmentedControlItem.vue'
import Slider from './Slider/Slider.vue'
import Switch from './Switch/Switch.vue'
import ToggleButton from './ToggleButton/ToggleButton.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('禁用的选择类控件不运行调用方的处理函数', () => {
  it('禁用的 Switch 不跑 onClick、onKeydown、onKeyup，聚焦和失焦照常', async () => {
    const onClick = vi.fn()
    const onKeydown = vi.fn()
    const onKeyup = vi.fn()
    const onFocus = vi.fn()
    const wrapper = mount(Switch, { attachTo: document.body, props: { label: 'A', modelValue: false, isDisabled: true }, attrs: { onClick, onKeydown, onKeyup, onFocus } })
    const input = wrapper.get('input')
    await input.trigger('click')
    await input.trigger('keydown', { key: ' ' })
    await input.trigger('keyup', { key: ' ' })
    await input.trigger('focus')
    expect([onClick, onKeydown, onKeyup].map(fn => fn.mock.calls.length)).toEqual([0, 0, 0])
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('启用的 Switch 照常运行调用方的处理函数', async () => {
    const onKeydown = vi.fn()
    const wrapper = mount(Switch, { attachTo: document.body, props: { label: 'A', modelValue: false }, attrs: { onKeydown } })
    await wrapper.get('input').trigger('keydown', { key: 'a' })
    expect(onKeydown).toHaveBeenCalledTimes(1)
  })

  it('禁用的 CheckboxInput 不跑 onClick、onKeydown', async () => {
    const onClick = vi.fn()
    const onKeydown = vi.fn()
    const wrapper = mount(CheckboxInput, { attachTo: document.body, props: { label: 'A', modelValue: false, isDisabled: true }, attrs: { onClick, onKeydown } })
    await wrapper.get('input').trigger('click')
    await wrapper.get('input').trigger('keydown', { key: ' ' })
    expect([onClick, onKeydown].map(fn => fn.mock.calls.length)).toEqual([0, 0])
  })

  it('禁用的 RadioListItem 不跑 onClick', async () => {
    const onClick = vi.fn()
    const wrapper = mount(RadioList, { props: { label: 'A', modelValue: 'a' }, slots: { default: () => [h(RadioListItem, { label: 'A', value: 'a', isDisabled: true, onClick })] } })
    await wrapper.get('label').trigger('click')
    await wrapper.get('input').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('禁用的 SegmentedControlItem 不跑 onClick，启用的先跑', async () => {
    const disabledClick = vi.fn()
    const enabledClick = vi.fn()
    const wrapper = mount(SegmentedControl, {
      props: { label: 'x', modelValue: 'a' },
      slots: { default: () => [h(SegmentedControlItem, { label: 'A', value: 'a', onClick: enabledClick }), h(SegmentedControlItem, { label: 'B', value: 'b', isDisabled: true, onClick: disabledClick })] },
    })
    const buttons = wrapper.findAll('button')
    await buttons[1]!.trigger('click')
    await buttons[0]!.trigger('click')
    expect(disabledClick).not.toHaveBeenCalled()
    expect(enabledClick).toHaveBeenCalledTimes(1)
  })

  it('禁用的 Slider 不跑调用方的指针和按键处理函数', async () => {
    const onPointerdown = vi.fn()
    const onKeydown = vi.fn()
    const wrapper = mount(Slider, { attachTo: document.body, props: { label: 'x', modelValue: 5, isDisabled: true }, attrs: { onPointerdown, onKeydown } })
    await wrapper.get('.astryx-slider-control').trigger('pointerdown', { button: 0, clientX: 5 })
    await wrapper.get('[role="slider"]').trigger('keydown', { key: 'ArrowRight' })
    expect(onPointerdown).not.toHaveBeenCalled()
    expect(onKeydown).not.toHaveBeenCalled()
  })

  it('禁用的范围 Slider 同样不跑组上的调用方处理函数', async () => {
    const onKeydown = vi.fn()
    const wrapper = mount(Slider, { attachTo: document.body, props: { label: 'x', modelValue: [1, 5], isDisabled: true }, attrs: { onKeydown } })
    await wrapper.get('[role="group"]').trigger('keydown', { key: 'ArrowRight' })
    expect(onKeydown).not.toHaveBeenCalled()
  })
})

describe('必填控件的无效状态跟着 status', () => {
  it('必填的 Switch 带原生 required，没有错误时 aria-invalid 是 false', () => {
    const wrapper = mount(Switch, { props: { label: 'A', modelValue: false, isRequired: true } })
    const input = wrapper.get('input')
    expect(input.element.required).toBe(true)
    expect(input.attributes('aria-invalid')).toBe('false')
    expect(input.attributes('aria-required')).toBe('true')
  })

  it('必填的 Switch 出错时 aria-invalid 是 true；isOptional 压过 isRequired', async () => {
    const wrapper = mount(Switch, { props: { label: 'A', modelValue: false, isRequired: true, status: { type: 'error', message: 'x' } } })
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    await wrapper.setProps({ isOptional: true, status: undefined })
    expect(wrapper.get('input').element.required).toBe(false)
  })

  it('formLayout 的默认必填只读成 aria-required，不写原生 required', () => {
    const wrapper = mount(FormLayout, { props: { defaultOptionality: 'required' }, slots: { default: () => h(Switch, { label: 'A', modelValue: false }) } })
    const input = wrapper.get('input')
    expect(input.attributes('aria-required')).toBe('true')
    expect(input.element.required).toBe(false)
  })

  it('必填的 CheckboxInput 没有错误时 aria-invalid 是 false', () => {
    const wrapper = mount(CheckboxInput, { props: { label: 'A', modelValue: false, isRequired: true } })
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('false')
  })

  it('必填的 RadioList：整组 aria-required，每个单选带 required，aria-invalid 跟 status', async () => {
    const wrapper = mount(RadioList, { props: { label: 'x', modelValue: 'a', isRequired: true }, slots: { default: () => [h(RadioListItem, { label: 'A', value: 'a' })] } })
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-required')).toBe('true')
    expect(wrapper.get('input').element.required).toBe(true)
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('false')
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-invalid')).toBeUndefined()
    await wrapper.setProps({ status: { type: 'error', message: 'x' } })
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-invalid')).toBe('true')
  })

  it('radioList 没标必填时单选没有 required 和 aria-invalid', () => {
    const wrapper = mount(RadioList, { props: { label: 'x', modelValue: 'a' }, slots: { default: () => [h(RadioListItem, { label: 'A', value: 'a' })] } })
    expect(wrapper.get('input').element.required).toBe(false)
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()
  })

  it('formLayout 的默认必填让 RadioList 整组 aria-required，单选不带原生 required', () => {
    const wrapper = mount(FormLayout, { props: { defaultOptionality: 'required' }, slots: { default: () => h(RadioList, { label: 'x', modelValue: 'a' }, { default: () => h(RadioListItem, { label: 'A', value: 'a' }) }) } })
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-required')).toBe('true')
    expect(wrapper.get('input').element.required).toBe(false)
  })

  it('formLayout 的默认必填让 Slider 的滑块带「必填」说明', () => {
    const wrapper = mount(FormLayout, { props: { defaultOptionality: 'required' }, slots: { default: () => h(Slider, { label: 'x', modelValue: 5 }) } })
    const described = wrapper.get('[role="slider"]').attributes('aria-describedby') ?? ''
    expect(described.split(' ').some(id => wrapper.find(`[id="${id}"]`).exists() && id.endsWith('-required'))).toBe(true)
  })
})

describe('组的禁用与错误状态', () => {
  it('禁用的 RadioList 和 CheckboxList，整组标 aria-disabled；启用时没有', async () => {
    const radios = mount(RadioList, { props: { label: 'x', modelValue: 'a', isDisabled: true }, slots: { default: () => [h(RadioListItem, { label: 'A', value: 'a' })] } })
    expect(radios.get('[role="radiogroup"]').attributes('aria-disabled')).toBe('true')
    await radios.setProps({ isDisabled: false })
    expect(radios.get('[role="radiogroup"]').attributes('aria-disabled')).toBeUndefined()
    const boxes = mount(CheckboxList, { props: { label: 'x', modelValue: [], isDisabled: true }, slots: { default: () => [h(CheckboxListItem, { label: 'A', value: 'a' })] } })
    expect(boxes.get('[role="group"]').attributes('aria-disabled')).toBe('true')
    await boxes.setProps({ isDisabled: false })
    expect(boxes.get('[role="group"]').attributes('aria-disabled')).toBeUndefined()
  })

  it('checkboxList 的错误状态让每个复选框 aria-invalid', async () => {
    const wrapper = mount(CheckboxList, { props: { label: 'x', modelValue: [] }, slots: { default: () => [h(CheckboxListItem, { label: 'A', value: 'a' }), h(CheckboxListItem, { label: 'B', value: 'b' })] } })
    expect(wrapper.findAll('input').map(input => input.attributes('aria-invalid'))).toEqual([undefined, undefined])
    await wrapper.setProps({ status: { type: 'error', message: 'bad' } })
    expect(wrapper.findAll('input').map(input => input.attributes('aria-invalid'))).toEqual(['true', 'true'])
  })
})

describe('toggleButton 的按下状态', () => {
  it('调用方的 aria-pressed 和 data-pressed 不覆盖真实状态', () => {
    const wrapper = mount(ToggleButton, { props: { label: 'A', isPressed: true }, attrs: { 'aria-pressed': 'false', 'data-pressed': 'false' } })
    const button = wrapper.get('button')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('data-pressed')).toBe('true')
  })
})

describe('列表项的 align', () => {
  it('checkboxListItem 把 align 交给行', () => {
    const wrapper = mount(CheckboxList, { props: { label: 'x', modelValue: [] }, slots: { default: () => [h(CheckboxListItem, { label: 'A', value: 'a', align: 'first-line' })] } })
    expect(wrapper.get('.astryx-item').attributes('data-align')).toBe('first-line')
  })

  it('radioListItem 的 align 写到行上，center 不写', () => {
    const wrapper = mount(RadioList, { props: { label: 'x', modelValue: 'a' }, slots: { default: () => [h(RadioListItem, { label: 'A', value: 'a', align: 'first-line' }), h(RadioListItem, { label: 'B', value: 'b' })] } })
    const rows = wrapper.findAll('.astryx-radio')
    expect(rows[0]!.attributes('data-align')).toBe('first-line')
    expect(rows[1]!.attributes('data-align')).toBeUndefined()
  })
})

describe('列表行里的复选框按压', () => {
  it('列表行里的复选框不单独当按压表面，单独的复选框照旧', async () => {
    const inList = mount(CheckboxList, { props: { label: 'x', modelValue: [] }, slots: { default: () => [h(CheckboxListItem, { label: 'A', value: 'a' })] } })
    await nextTick()
    expect(inList.get('.astryx-checkbox-row').attributes('data-astryx-pressable')).toBeUndefined()
    expect(inList.get('.astryx-item').attributes('data-astryx-pressable')).toBeDefined()
    const alone = mount(CheckboxInput, { props: { label: 'A', modelValue: false } })
    expect(alone.get('.astryx-checkbox-row').attributes('data-astryx-pressable')).toBeDefined()
  })
})

function sliderGeometry(wrapper: VueWrapper): HTMLElement {
  const track = wrapper.get('.astryx-slider-control').element as HTMLElement
  vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 220, top: 0, bottom: 20, width: 220, height: 20 } as DOMRect)
  return track
}

function rangeSlider(modelValue: [number, number], props: Record<string, unknown> = {}): VueWrapper {
  const wrapper: VueWrapper = mount(Slider, {
    attachTo: document.body,
    props: { 'label': 'Range', modelValue, 'onUpdate:modelValue': (value: unknown) => { void wrapper.setProps({ modelValue: value as [number, number] }) }, ...props },
  })
  sliderGeometry(wrapper)
  return wrapper
}

describe('slider 的 aria-labelledby 和重合的滑块', () => {
  it('范围 Slider 的组保留调用方的 aria-labelledby，排在自己的标签后面', () => {
    const wrapper = mount(Slider, { props: { label: 'x', modelValue: [1, 5] }, attrs: { 'aria-labelledby': 'outside' } })
    const labelled = wrapper.get('[role="group"]').attributes('aria-labelledby') ?? ''
    expect(labelled.split(' ').at(-1)).toBe('outside')
    expect(labelled.split(' ').length).toBe(2)
  })

  it('两个滑块重合时，按在滑块上不动，向左拖的是下面那个', async () => {
    const wrapper = rangeSlider([50, 50])
    const track = wrapper.get('.astryx-slider-control')
    await wrapper.findAll('[role="slider"]')[1]!.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 110 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await track.trigger('pointermove', { pointerId: 1, clientX: 70 })
    await track.trigger('pointerup', { pointerId: 1 })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[30, 50]])
  })

  it('两个滑块重合时，向右拖的是上面那个', async () => {
    const wrapper = rangeSlider([50, 50])
    const track = wrapper.get('.astryx-slider-control')
    await wrapper.findAll('[role="slider"]')[0]!.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 110 })
    await track.trigger('pointermove', { pointerId: 1, clientX: 150 })
    await track.trigger('pointerup', { pointerId: 1 })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[50, 70]])
  })

  it('重合滑块上的拖动越过另一个滑块时，另一个接手继续跟着指针', async () => {
    const wrapper = rangeSlider([50, 50])
    const track = wrapper.get('.astryx-slider-control')
    await wrapper.findAll('[role="slider"]')[1]!.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 110 })
    await track.trigger('pointermove', { pointerId: 1, clientX: 150 })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[50, 70]])
    await track.trigger('pointermove', { pointerId: 1, clientX: 70 })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[30, 50]])
    await track.trigger('pointerup', { pointerId: 1 })
  })

  it('按在重合滑块的刻度文字上，同样没有变化，由上面那个滑块扛着', async () => {
    const wrapper = rangeSlider([50, 50], { marks: [{ value: 50, label: 'Half' }] })
    const track = wrapper.get('.astryx-slider-control')
    await wrapper.get('.astryx-slider-mark-label').trigger('pointerdown', { button: 0, pointerId: 1, clientX: 110 })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(document.activeElement).toBe(wrapper.findAll('[role="slider"]')[1]!.element)
    await track.trigger('pointerup', { pointerId: 1 })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[50, 50]])
  })

  it('按在重合滑块旁边的轨道上，直接选那一侧的滑块', async () => {
    const wrapper = rangeSlider([50, 50])
    const track = wrapper.get('.astryx-slider-control')
    await track.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 210 })
    await track.trigger('pointerup', { pointerId: 1 })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[50, 100]])
    await wrapper.setProps({ modelValue: [50, 50] })
    await track.trigger('pointerdown', { button: 0, pointerId: 2, clientX: 10 })
    await track.trigger('pointerup', { pointerId: 2 })
    expect(wrapper.emitted('changeEnd')?.at(-1)).toEqual([[0, 50]])
  })

  it('拖动中只有被拖的滑块显示数值提示', async () => {
    const wrapper = rangeSlider([20, 80])
    const thumbs = wrapper.findAll('[role="slider"]')
    await thumbs[0]!.trigger('pointerenter')
    await thumbs[1]!.trigger('pointerenter')
    await thumbs[1]!.trigger('pointerdown', { button: 0, pointerId: 1, clientX: 180 })
    const tooltips = Array.from(document.querySelectorAll<HTMLElement>('[role="tooltip"]'))
    expect(tooltips.map(tooltip => tooltip.style.display !== 'none')).toEqual([false, true])
  })
})

describe('选择类控件的样式', () => {
  const css = (name: string): string => readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), `../styles/${name}.css`), 'utf8')

  it('单选圈和开关拇指用 50% 画圆，不吃主题的胶囊半径', () => {
    expect(css('radio-indicator')).not.toContain('--astryx-radius-full')
    expect(css('radio-indicator')).toMatch(/border-radius: 50%/)
    expect(css('switch')).toMatch(/\.astryx-switch-thumb \{[^}]*border-radius: var\(--astryx-switch-thumb-radius, 50%\)/)
    expect(css('switch')).toMatch(/\.astryx-switch-track \{[^}]*border-radius: var\(--astryx-switch-track-radius, 999px\)/)
  })

  it('toggleButtonGroup 横排时换行，竖排不换', () => {
    const source = css('toggle-button')
    expect(source).toMatch(/\.astryx-toggle-button-group \{[^}]*flex-wrap: wrap/)
    expect(source).toMatch(/\.astryx-toggle-button-group\[data-orientation='vertical'\] \{[^}]*flex-wrap: nowrap/)
  })

  it('横向 Slider 给刻度文字留的高度跟着文字的行高走', () => {
    const source = css('slider')
    expect(source).toMatch(/data-mark-labels='true'\]\[data-orientation='horizontal'\] \.astryx-slider-row \{[^}]*padding-block-end: calc\(4px \+ var\(--astryx-text-supporting-size/)
    expect(source).not.toMatch(/margin-bottom: 24px/)
  })
})
