import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useIndicatorFocusRing } from './useIndicatorFocusRing.js'

function mountControl(isDisabled = ref(false)) {
  const containerRef = ref<HTMLElement | null>(null)
  let focusProps!: ReturnType<typeof useIndicatorFocusRing>['focusProps']

  const wrapper = mount(defineComponent({
    name: 'IndicatorHost',
    setup() {
      focusProps = useIndicatorFocusRing({ containerRef, isDisabled }).focusProps
      return () => h('div', { ref: containerRef, class: 'control', onFocusin: focusProps.onFocus, onFocusout: focusProps.onBlur }, [
        h('span', { class: 'indicator' }),
        h('input', { class: 'native', type: 'checkbox' }),
      ])
    },
  }), { attachTo: document.body })

  return { wrapper, containerRef, focusProps }
}

function ringOf(wrapper: ReturnType<typeof mountControl>['wrapper']) {
  return wrapper.get('.indicator').attributes('data-astryx-focus-ring')
}

describe('useIndicatorFocusRing', () => {
  it('marks the indicator child while the hidden input has focus', async () => {
    const { wrapper } = mountControl()
    expect(ringOf(wrapper)).toBeUndefined()

    ;(wrapper.get('.native').element as HTMLElement).focus()
    await wrapper.get('.native').trigger('focusin')
    expect(ringOf(wrapper)).toBe('')

    await wrapper.get('.native').trigger('focusout')
    expect(ringOf(wrapper)).toBeUndefined()
  })

  it('does nothing while the control is disabled', async () => {
    const { wrapper } = mountControl(ref(true))
    ;(wrapper.get('.native').element as HTMLElement).focus()
    await wrapper.get('.native').trigger('focusin')
    expect(ringOf(wrapper)).toBeUndefined()
  })

  it('skips the ring while disabled, then draws it again once enabled', async () => {
    const isDisabled = ref(true)
    const { wrapper } = mountControl(isDisabled)

    isDisabled.value = false
    ;(wrapper.get('.native').element as HTMLElement).focus()
    await wrapper.get('.native').trigger('focusin')
    expect(ringOf(wrapper)).toBe('')

    isDisabled.value = true
    await wrapper.get('.native').trigger('focusin')
    expect(ringOf(wrapper)).toBeUndefined()
  })

  it('drops the ring when focus moves to a control that is not visible', async () => {
    const { wrapper, focusProps } = mountControl()
    ;(wrapper.get('.native').element as HTMLElement).focus()
    await wrapper.get('.native').trigger('focusin')
    expect(ringOf(wrapper)).toBe('')

    focusProps.onFocus({ target: document.body } as unknown as FocusEvent)
    expect(ringOf(wrapper)).toBeUndefined()
  })
})
