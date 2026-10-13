import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Tab from './Tab.vue'
import TabList from './TabList.vue'
import TabMenu from './TabMenu.vue'

const Harness = defineComponent({
  components: { Tab, TabList, TabMenu },
  setup() {
    const value = ref('home')
    return { value }
  },
  template: `
    <TabList v-model:value="value">
      <Tab value="home">Home</Tab>
      <TabMenu
        label="More"
        :options="[
          { value: 'archive', label: 'Archive' },
          { value: 'settings', label: 'Settings' },
        ]"
      />
    </TabList>
  `,
})

describe('tab menu', () => {
  it('collects overflow tabs in a radio menu', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    const trigger = wrapper.get('[data-tab-menu]')
    expect(trigger.text()).toContain('More')
    expect(trigger.attributes('aria-haspopup')).toBe('menu')

    await trigger.trigger('click')
    await nextTick()
    const items = document.body.querySelectorAll('[role="menuitemradio"]')
    expect(items).toHaveLength(2)
    expect(items[0].getAttribute('aria-checked')).toBe('false')

    const settings = document.body.querySelectorAll('[role="menuitemradio"]')[1] as HTMLElement
    settings.click()
    await nextTick()
    expect(wrapper.vm.value).toBe('settings')
    expect(trigger.text()).toContain('Settings')
    expect(trigger.classes()).toContain('astryx-tab--selected')
    wrapper.unmount()
  })

  it('moves from a tab onto the menu without selecting it', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    await wrapper.get('[role="tab"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.vm.value).toBe('home')
    expect(document.activeElement).toBe(wrapper.get('[data-tab-menu]').element)
    wrapper.unmount()
  })
})
