import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'
import DropdownMenuSubMenu from './DropdownMenuSubMenu.vue'

const Host = defineComponent({
  components: { DropdownMenu, DropdownMenuItem, DropdownMenuSubMenu },
  template: `
    <DropdownMenu :button="{ label: 'Actions' }">
      <DropdownMenuSubMenu label="" presentation="drill-in" description="Pick a folder">
        <template #label><strong>Move <span aria-hidden="true">*</span>to</strong></template>
        <DropdownMenuSubMenu label="" presentation="drill-in">
          <template #label><em>Deeper</em></template>
          <DropdownMenuItem label="Leaf" />
        </DropdownMenuSubMenu>
      </DropdownMenuSubMenu>
    </DropdownMenu>
  `,
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('dropdownMenuSubMenu 节点标签', () => {
  it('展开的视图只用标签命名（不含说明），嵌套视图的返回行用这个标签的文字', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!.click()
    await flushPromises()

    const row = document.querySelector<HTMLElement>('.astryx-dropdown-menu [aria-haspopup="menu"]')!
    row.click()
    await flushPromises()

    const drills = [...document.querySelectorAll<HTMLElement>('.astryx-dropdown-menu-drill')]
    const view = drills[0]!
    const labelId = view.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    const labelElement = document.getElementById(labelId!)!
    expect(labelElement.textContent).not.toContain('Pick a folder')
    expect(view.hasAttribute('aria-label')).toBe(false)

    const inner = view.querySelector<HTMLElement>('[aria-haspopup="menu"]')!
    inner.click()
    await flushPromises()
    const nested = [...document.querySelectorAll<HTMLElement>('.astryx-dropdown-menu-drill')][1]!
    const back = nested.querySelector<HTMLElement>('[role="menuitem"]')!
    expect(back.textContent).toContain('Move to')
    expect(back.textContent).not.toContain('*')
    wrapper.unmount()
  })
})
