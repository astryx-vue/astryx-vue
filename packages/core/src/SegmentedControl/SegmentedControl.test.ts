import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import type { SegmentedControlProps } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Icon from '../Icon/Icon.vue'
import SegmentedControl from './SegmentedControl.vue'
import SegmentedControlItem from './SegmentedControlItem.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

const SEGMENTS = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'members', label: 'Members' },
]

type ControlWrapper = VueWrapper<InstanceType<typeof SegmentedControl>>

function renderControl(
  initial = 'overview',
  props: Partial<Omit<SegmentedControlProps, 'modelValue' | 'label'>> = {},
  attrs: Record<string, unknown> = {},
  segments = SEGMENTS,
): ControlWrapper {
  const wrapper: ControlWrapper = mount(SegmentedControl, {
    attachTo: document.body,
    attrs,
    props: {
      'label': 'Workspace view',
      'modelValue': initial,
      'onUpdate:modelValue': (value: unknown) => {
        void wrapper.setProps({ modelValue: value as string })
      },
      ...props,
    },
    slots: {
      default: () => segments.map(segment => h(SegmentedControlItem, { label: segment.label, value: segment.value })),
    },
  })

  return wrapper
}

function segmentsOf(wrapper: ControlWrapper): DOMWrapper<HTMLButtonElement>[] {
  return wrapper.findAll<HTMLButtonElement>('[role="radio"]')
}

describe('segmented-control', () => {
  it('renders a radiogroup with one radio per segment', () => {
    const wrapper = renderControl()
    const group = wrapper.get('[role="radiogroup"]')

    expect(group.attributes('aria-label')).toBe('Workspace view')
    expect(group.classes()).toContain('astryx-segmented-control')

    const segments = segmentsOf(wrapper)
    expect(segments).toHaveLength(3)
    expect(segments.map(segment => segment.attributes('data-value'))).toEqual([
      'overview',
      'activity',
      'members',
    ])
    expect(segments.map(segment => segment.attributes('aria-checked'))).toEqual([
      'true',
      'false',
      'false',
    ])
    expect(segments[0]!.text()).toContain('Overview')
    expect(segments[0]!.attributes('type')).toBe('button')
  })

  it('selects a segment on click and updates v-model', async () => {
    const wrapper = renderControl()
    await segmentsOf(wrapper)[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['activity'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['activity'])
    expect(segmentsOf(wrapper)[1]!.attributes('aria-checked')).toBe('true')
  })

  it('does not select or emit when the already selected segment is clicked', async () => {
    const wrapper = renderControl()
    await segmentsOf(wrapper)[0]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
  })

  // Regression: the context every segment reads must hold live refs, not a
  // snapshot evaluated when the control provided it. A frozen snapshot leaves
  // the segments stuck on the selection, size, and disabled state they saw on
  // first render — the bug that once froze selection in TabList.
  it('keeps segments in step with the control when props change after mount', async () => {
    const wrapper = renderControl()

    await wrapper.setProps({ modelValue: 'members' })

    expect(segmentsOf(wrapper).map(segment => segment.attributes('aria-checked'))).toEqual([
      'false',
      'false',
      'true',
    ])
    expect(segmentsOf(wrapper).map(segment => segment.attributes('tabindex'))).toEqual([
      '-1',
      '-1',
      '0',
    ])

    await wrapper.setProps({ size: 'lg' })
    expect(segmentsOf(wrapper).map(segment => segment.attributes('data-size'))).toEqual([
      'lg',
      'lg',
      'lg',
    ])

    await wrapper.setProps({ isDisabled: true })
    expect(segmentsOf(wrapper).map(segment => segment.attributes('aria-disabled'))).toEqual([
      'true',
      'true',
      'true',
    ])
  })

  it('reflects size and layout, and forwards the remaining attributes', () => {
    const wrapper = renderControl(
      'overview',
      { layout: 'fill', size: 'sm' },
      { 'data-testid': 'view-switch', 'style': 'margin-top: 4px' },
      [],
    )

    const group = wrapper.get('[role="radiogroup"]')
    expect(group.attributes('data-size')).toBe('sm')
    expect(group.attributes('data-layout')).toBe('fill')
    expect(group.attributes('data-testid')).toBe('view-switch')
    expect(group.attributes('style')).toContain('margin-top: 4px')
  })

  it('keeps the computed role when a consumer passes one', () => {
    const wrapper = renderControl('overview', {}, { role: 'group' })
    expect(wrapper.get('[role="radiogroup"]').attributes('role')).toBe('radiogroup')
  })
})

describe('segmented-control roving tab stop', () => {
  it('makes only the selected segment tabbable', () => {
    const wrapper = renderControl('activity')
    expect(segmentsOf(wrapper).map(segment => segment.attributes('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
    ])
  })

  it('promotes the first enabled segment when the value matches none', () => {
    const wrapper = renderControl('missing')
    expect(segmentsOf(wrapper).map(segment => segment.attributes('tabindex'))).toEqual([
      '0',
      '-1',
      '-1',
    ])
  })

  it('moves the tab stop to the segment the consumer selects', async () => {
    const wrapper = renderControl()
    await segmentsOf(wrapper)[2]!.trigger('click')
    expect(segmentsOf(wrapper).map(segment => segment.attributes('tabindex'))).toEqual([
      '-1',
      '-1',
      '0',
    ])
  })
})

describe('segmented-control keyboard navigation', () => {
  async function press(wrapper: ControlWrapper, key: string) {
    await wrapper.get('[role="radiogroup"]').trigger('keydown', { key })
    await nextTick()
  }

  it('moves with ArrowRight and selects the segment it lands on', async () => {
    const wrapper = renderControl()
    segmentsOf(wrapper)[0]!.element.focus()

    await press(wrapper, 'ArrowRight')

    expect(document.activeElement).toBe(segmentsOf(wrapper)[1]!.element)
    expect(segmentsOf(wrapper)[1]!.attributes('aria-checked')).toBe('true')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['activity'])
  })

  it('moves with ArrowLeft and selects', async () => {
    const wrapper = renderControl('members')
    segmentsOf(wrapper)[2]!.element.focus()

    await press(wrapper, 'ArrowLeft')

    expect(document.activeElement).toBe(segmentsOf(wrapper)[1]!.element)
    expect(segmentsOf(wrapper)[1]!.attributes('aria-checked')).toBe('true')
  })

  it('wraps from the last segment to the first and back', async () => {
    const wrapper = renderControl('members')
    segmentsOf(wrapper)[2]!.element.focus()

    await press(wrapper, 'ArrowRight')
    expect(document.activeElement).toBe(segmentsOf(wrapper)[0]!.element)
    expect(segmentsOf(wrapper)[0]!.attributes('aria-checked')).toBe('true')

    await press(wrapper, 'ArrowLeft')
    expect(document.activeElement).toBe(segmentsOf(wrapper)[2]!.element)
  })

  it('moves to the first and last segment with Home and End', async () => {
    const wrapper = renderControl('activity')
    segmentsOf(wrapper)[1]!.element.focus()

    await press(wrapper, 'End')
    expect(document.activeElement).toBe(segmentsOf(wrapper)[2]!.element)

    await press(wrapper, 'Home')
    expect(document.activeElement).toBe(segmentsOf(wrapper)[0]!.element)
  })

  it('skips disabled segments', async () => {
    const wrapper = mount(SegmentedControl, {
      attachTo: document.body,
      props: { 'label': 'Workspace view', 'modelValue': 'overview', 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [
          h(SegmentedControlItem, { label: 'Overview', value: 'overview' }),
          h(SegmentedControlItem, { label: 'Activity', value: 'activity', isDisabled: true }),
          h(SegmentedControlItem, { label: 'Members', value: 'members' }),
        ],
      },
    })

    segmentsOf(wrapper)[0]!.element.focus()
    await wrapper.get('[role="radiogroup"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(document.activeElement).toBe(segmentsOf(wrapper)[2]!.element)
  })

  it('is a pure focus move when focus enters from outside the group', async () => {
    const wrapper = renderControl('missing')
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()

    segmentsOf(wrapper)[0]!.element.focus()
    await nextTick()

    expect(document.activeElement).toBe(segmentsOf(wrapper)[0]!.element)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('lets a consumer keydown listener opt out of navigation', async () => {
    const seen: string[] = []
    const wrapper = renderControl('overview', {}, {
      onKeydown: (event: KeyboardEvent) => {
        seen.push(event.key)
        event.preventDefault()
      },
    })
    segmentsOf(wrapper)[0]!.element.focus()

    await press(wrapper, 'ArrowRight')

    expect(seen).toEqual(['ArrowRight'])
    expect(document.activeElement).toBe(segmentsOf(wrapper)[0]!.element)
  })
})

describe('segmented-control disabled states', () => {
  it('blocks selection for the whole control', async () => {
    const wrapper = renderControl('overview', { isDisabled: true })
    const group = wrapper.get('[role="radiogroup"]')

    expect(group.attributes('aria-disabled')).toBe('true')
    expect(group.attributes('data-disabled')).toBe('true')

    await segmentsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('drops every segment from the tab order when the control is disabled', () => {
    const wrapper = renderControl('overview', { isDisabled: true })
    expect(segmentsOf(wrapper).map(segment => segment.attributes('tabindex'))).toEqual([
      '-1',
      '-1',
      '-1',
    ])
  })

  it('marks a single segment disabled and refuses to select it', async () => {
    const wrapper = mount(SegmentedControl, {
      attachTo: document.body,
      props: { 'label': 'Workspace view', 'modelValue': 'overview', 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [
          h(SegmentedControlItem, { label: 'Overview', value: 'overview' }),
          h(SegmentedControlItem, { label: 'Activity', value: 'activity', isDisabled: true }),
        ],
      },
    })

    const segment = segmentsOf(wrapper)[1]!
    expect(segment.attributes('aria-disabled')).toBe('true')
    expect(segment.attributes('tabindex')).toBe('-1')

    await segment.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('segmented-control disabled message', () => {
  it('shows the reason on keyboard focus and keeps it discoverable', async () => {
    const wrapper = renderControl('overview', { isDisabled: true, disabledMessage: 'Read-only workspace' })
    const group = wrapper.get('[role="radiogroup"]')

    expect(group.attributes('data-disabled-message')).toBe('true')
    const describedBy = group.attributes('aria-describedby')
    expect(describedBy).toBeTruthy()

    await nextTick()
    const tooltip = document.getElementById(describedBy!) as HTMLElement
    expect(tooltip.getAttribute('role')).toBe('tooltip')
    expect(tooltip.textContent).toBe('Read-only workspace')
    expect(tooltip.style.display).toBe('none')

    segmentsOf(wrapper)[0]!.element.focus()
    await nextTick()

    expect(tooltip.style.display).not.toBe('none')
  })

  it('keeps the selected segment in the tab order so the reason is reachable', () => {
    const wrapper = renderControl('activity', { isDisabled: true, disabledMessage: 'Read-only workspace' })
    expect(segmentsOf(wrapper).map(segment => segment.attributes('tabindex'))).toEqual([
      '-1',
      '0',
      '-1',
    ])
  })

  it('still blocks selection while the reason is shown', async () => {
    const wrapper = renderControl('overview', { isDisabled: true, disabledMessage: 'Read-only workspace' })
    await segmentsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('renders no tooltip when the control is enabled or has no reason', () => {
    const enabled = renderControl('overview', { disabledMessage: 'Read-only workspace' })
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    expect(enabled.get('[role="radiogroup"]').attributes('aria-describedby')).toBeUndefined()

    enabled.unmount()

    renderControl('overview', { isDisabled: true })
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })
})

describe('segmented-control item', () => {
  it('renders an icon before the label and passes the control size to it', () => {
    const wrapper = mount(SegmentedControl, {
      props: { 'label': 'View', 'modelValue': 'grid', 'onUpdate:modelValue': () => {}, 'size': 'lg' },
      slots: {
        default: () => [
          h(SegmentedControlItem, { label: 'Grid', value: 'grid' }, {
            icon: () => h(Icon, { icon: 'chevronRight' }),
          }),
        ],
      },
    })

    const icon = wrapper.get('.astryx-segmented-control-item__icon')
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.find('.astryx-icon').attributes('data-size')).toBe('md')
    expect(wrapper.get('.astryx-segmented-control-item__label').text()).toBe('Grid')
  })

  it('hides the label visually but keeps it as the accessible name', () => {
    const wrapper = mount(SegmentedControl, {
      props: { 'label': 'View', 'modelValue': 'grid', 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [
          h(SegmentedControlItem, { label: 'Grid', value: 'grid', isLabelHidden: true }, {
            icon: () => h(Icon, { icon: 'chevronRight' }),
          }),
        ],
      },
    })

    const segment = wrapper.get('[role="radio"]')
    expect(segment.attributes('aria-label')).toBe('Grid')
    expect(segment.attributes('data-icon-only')).toBe('true')
    expect(segment.find('.astryx-segmented-control-item__label').exists()).toBe(false)
  })

  it('lets a consumer click listener opt out of selection', async () => {
    const seen: string[] = []
    const wrapper = mount(SegmentedControl, {
      props: { 'label': 'View', 'modelValue': 'grid', 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [
          h(SegmentedControlItem, {
            label: 'Grid',
            onClick: (event: MouseEvent) => {
              seen.push('grid')
              event.preventDefault()
            },
            value: 'grid',
          }),
          h(SegmentedControlItem, { label: 'List', value: 'list' }),
        ],
      },
    })

    await segmentsOf(wrapper)[0]!.trigger('click')
    expect(seen).toEqual(['grid'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await segmentsOf(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['list'])
  })

  it('forwards extra attributes and merges the class', () => {
    const wrapper = mount(SegmentedControl, {
      props: { 'label': 'View', 'modelValue': 'grid', 'onUpdate:modelValue': () => {} },
      slots: {
        default: () => [
          h(SegmentedControlItem, { 'class': 'custom', 'data-testid': 'grid', 'label': 'Grid', 'value': 'grid' }),
        ],
      },
    })

    const segment = segmentsOf(wrapper)[0]!
    expect(segment.attributes('data-testid')).toBe('grid')
    expect(segment.classes()).toContain('custom')
    expect(segment.classes()).toContain('astryx-segmented-control-item')
  })

  it('renders standalone as an unselected radio', () => {
    const wrapper = mount(SegmentedControlItem, { props: { label: 'Grid', value: 'grid' } })
    expect(wrapper.attributes('aria-checked')).toBe('false')
    expect(wrapper.attributes('tabindex')).toBe('0')
  })
})

describe('segmented-control with a bound model', () => {
  it('follows the value ref it is bound to', async () => {
    const Host = defineComponent({
      components: { SegmentedControl, SegmentedControlItem },
      setup: () => ({ view: ref('overview') }),
      template: `
        <SegmentedControl v-model="view" label="Workspace view">
          <SegmentedControlItem label="Overview" value="overview" />
          <SegmentedControlItem label="Activity" value="activity" />
        </SegmentedControl>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })

    await wrapper.findAll('[role="radio"]')[1]!.trigger('click')

    expect(wrapper.vm.view).toBe('activity')
    expect(wrapper.findAll('[role="radio"]')[1]!.attributes('aria-checked')).toBe('true')
  })
})
