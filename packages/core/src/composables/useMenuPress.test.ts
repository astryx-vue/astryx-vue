import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'
import { resetMenuPress, useMenuPress } from './useMenuPress.js'

describe('useMenuPress', () => {
  it('is available from the public composables entry', () => {
    const Host = defineComponent({
      setup() {
        const menuRef = ref<HTMLElement | null>(null)
        const press = useMenuPress({
          menuRef,
          isEnabled: () => true,
          onDismiss: () => {},
        })
        return { menuRef, onPointerDown: press.onPointerDown }
      },
      template: '<div ref="menuRef" role="menu" @pointerdown="onPointerDown" />',
    })
    const wrapper = mount(Host)
    expect(typeof wrapper.vm.onPointerDown).toBe('function')
    resetMenuPress()
    wrapper.unmount()
  })
})
