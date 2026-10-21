import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Button from '../Button/Button.vue'
import { buttonGroupContextKey } from '../Button/context.js'
import ButtonGroup from '../ButtonGroup/ButtonGroup.vue'
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue'
import Popover from '../Popover/Popover.vue'
import { registeredLayerScopedContexts, resetLayerScopedContext } from './scopedProvide.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

function popoverButton(): HTMLElement {
  const surface = document.querySelector('.astryx-popover')
  const button = surface?.querySelector('.astryx-button')
  expect(button).not.toBeNull()
  return button as HTMLElement
}

describe('resetLayerScopedContext', () => {
  it('登记表里有按钮组的 context', () => {
    expect(registeredLayerScopedContexts()).toContain(buttonGroupContextKey)
  })

  it('登记表里的每一项都是真的 key，不是未定义的导入', () => {
    const keys = registeredLayerScopedContexts()
    expect(keys.length).toBeGreaterThanOrEqual(20)
    for (const key of keys)
      expect(typeof key).toBe('symbol')
  })

  it('按钮组里的浮层，里面的按钮不继承尺寸', async () => {
    mount(defineComponent({
      components: { Button, ButtonGroup, Popover },
      template: `
        <ButtonGroup size="lg">
          <Popover label="Options" :is-open="true">
            <button type="button">Open</button>
            <template #content><Button label="Inner" /></template>
          </Popover>
        </ButtonGroup>
      `,
    }), { attachTo: document.body })
    await flushPromises()

    expect(popoverButton().dataset.size).toBe('md')
  })

  it('禁用的按钮组里的浮层，里面的按钮点得动', async () => {
    mount(defineComponent({
      components: { Button, ButtonGroup, Popover },
      template: `
        <ButtonGroup is-disabled>
          <Popover label="Options" :is-open="true">
            <button type="button">Open</button>
            <template #content><Button label="Inner" /></template>
          </Popover>
        </ButtonGroup>
      `,
    }), { attachTo: document.body })
    await flushPromises()

    const button = popoverButton()
    expect(button.hasAttribute('disabled')).toBe(false)
    expect(button.getAttribute('aria-disabled')).toBeNull()
  })

  it('菜单里的按钮也不继承外面组的尺寸，触发器照旧继承', async () => {
    mount(defineComponent({
      components: { Button, ButtonGroup, DropdownMenu },
      template: `
        <ButtonGroup size="lg">
          <DropdownMenu :button="{ label: 'Menu' }" :is-menu-open="true">
            <template #footer><Button label="Apply" /></template>
          </DropdownMenu>
        </ButtonGroup>
      `,
    }), { attachTo: document.body })
    await flushPromises()

    const trigger = document.querySelector('.astryx-dropdown-menu-trigger .astryx-button') as HTMLElement
    const footerButton = document.querySelector('.astryx-dropdown-menu-region .astryx-button') as HTMLElement
    expect(trigger.dataset.size).toBe('lg')
    expect(footerButton.dataset.size).toBe('md')
  })

  it('浮层里的内容根可以重复调用，不会报错', async () => {
    expect(() => resetLayerScopedContext()).not.toThrow()

    const wrapper = mount(defineComponent({
      setup() {
        resetLayerScopedContext()
        return () => h('div')
      },
    }))
    await nextTick()
    expect(wrapper.element).toBeInstanceOf(HTMLElement)
  })
})
