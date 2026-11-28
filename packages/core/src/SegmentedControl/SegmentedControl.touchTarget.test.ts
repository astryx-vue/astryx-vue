import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import SegmentedControl from './SegmentedControl.vue'
import SegmentedControlItem from './SegmentedControlItem.vue'

describe('segmentedControl 触控热区', () => {
  it('可用的分段带热区类，禁用的没有', () => {
    const wrapper = mount(SegmentedControl, {
      props: { label: 'View', modelValue: 'a' },
      slots: {
        default: () => [
          h(SegmentedControlItem, { value: 'a', label: 'A' }),
          h(SegmentedControlItem, { value: 'b', label: 'B', isDisabled: true }),
        ],
      },
    })
    const [first, second] = wrapper.findAll('.astryx-segmented-control-item')
    expect(first!.classes()).toContain('astryx-touch-hit-area')
    expect(second!.classes()).not.toContain('astryx-touch-hit-area')
  })
})
