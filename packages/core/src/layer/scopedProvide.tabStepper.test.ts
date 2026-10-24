import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import Popover from '../Popover/Popover.vue'
import { stepperContextKey } from '../Stepper/context.js'
import Step from '../Stepper/Step.vue'
import Stepper from '../Stepper/Stepper.vue'
import { tabListContextKey } from '../TabList/context.js'
import Tab from '../TabList/Tab.vue'
import TabList from '../TabList/TabList.vue'
import TabMenu from '../TabList/TabMenu.vue'
import { registeredLayerScopedContexts } from './scopedProvide.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

const components = { Popover, Step, Stepper, Tab, TabList, TabMenu }

function mountTemplate(template: string): ReturnType<typeof mount> {
  return mount(defineComponent({ components, template }), { attachTo: document.body })
}

describe('tabList / Stepper 的 context 在浮层边界截断', () => {
  it('两个 context 都登记在截断表里', () => {
    expect(registeredLayerScopedContexts()).toContain(tabListContextKey)
    expect(registeredLayerScopedContexts()).toContain(stepperContextKey)
  })

  it('浮层里没有本地 TabList 时，Tab 读不到外面的 TabList 并报错', () => {
    expect(() => mountTemplate(`
      <TabList value="a">
        <Popover label="More" :is-open="true">
          <button type="button">Open</button>
          <template #content><Tab value="inner">Inner</Tab></template>
        </Popover>
      </TabList>
    `)).toThrow('useTabListContext must be used within TabList')
  })

  it('浮层里放了本地 TabList 时，Tab 读到的是本地的值', async () => {
    mountTemplate(`
      <TabList value="outer" size="lg">
        <Popover label="More" :is-open="true">
          <button type="button">Open</button>
          <template #content>
            <TabList value="inner" size="sm"><Tab value="inner">Inner</Tab></TabList>
          </template>
        </Popover>
      </TabList>
    `)
    await flushPromises()

    const tab = document.querySelector('.astryx-popover .astryx-tab') as HTMLElement
    expect(tab.classList.contains('astryx-tab--size-sm')).toBe(true)
    expect(tab.classList.contains('astryx-tab--size-lg')).toBe(false)
    expect(tab.classList.contains('astryx-tab--selected')).toBe(true)
  })

  it('浮层里没有本地 Stepper 时，Step 读不到外面的 Stepper 并报错', () => {
    expect(() => mountTemplate(`
      <Stepper :active-step="3">
        <Popover label="More" :is-open="true">
          <button type="button">Open</button>
          <template #content><Step :step="0" label="Inner" /></template>
        </Popover>
      </Stepper>
    `)).toThrow('useStepperContext must be used within Stepper')
  })

  it('浮层里放了本地 Stepper 时，Step 读到的是本地的状态', async () => {
    mountTemplate(`
      <Stepper :active-step="3" orientation="vertical">
        <Popover label="More" :is-open="true">
          <button type="button">Open</button>
          <template #content>
            <Stepper :active-step="0" orientation="horizontal"><Step :step="0" label="Inner" /></Stepper>
          </template>
        </Popover>
      </Stepper>
    `)
    await flushPromises()

    const step = document.querySelector('.astryx-popover .astryx-step') as HTMLElement
    expect(step.getAttribute('data-progress')).toBe('in-progress')
    expect(step.getAttribute('data-orientation')).toBe('horizontal')
  })

  it('tabMenu 在 TabList 里照常工作：下拉里读到外面 TabList 的选中值', async () => {
    mountTemplate(`
      <TabList value="settings" role="tablist">
        <Tab value="home">Home</Tab>
        <TabMenu label="More" :options="[{ value: 'archive', label: 'Archive' }, { value: 'settings', label: 'Settings' }]" />
      </TabList>
    `)
    await flushPromises()

    const trigger = document.querySelector('[data-tab-menu]') as HTMLElement
    expect(trigger.textContent).toContain('Settings')
    trigger.click()
    await flushPromises()

    const items = document.querySelectorAll('.astryx-tab-menu-dropdown [role="menuitemradio"]')
    expect(items).toHaveLength(2)
    expect(items[0]!.getAttribute('aria-checked')).toBe('false')
    expect(items[1]!.getAttribute('aria-checked')).toBe('true')
  })
})
