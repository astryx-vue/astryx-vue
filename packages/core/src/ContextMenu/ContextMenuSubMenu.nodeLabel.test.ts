import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import ContextMenu from './ContextMenu.vue'
import ContextMenuItem from './ContextMenuItem.vue'
import ContextMenuSubMenu from './ContextMenuSubMenu.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

const Host = defineComponent({
  components: { ContextMenu, ContextMenuItem, ContextMenuSubMenu },
  template: `
    <ContextMenu label="Row actions">
      <button type="button">Target</button>
      <template #content>
        <ContextMenuSubMenu presentation="drill-in" description="Pick a folder">
          <template #label><strong>Move <span aria-hidden="true">*</span>to</strong></template>
          <ContextMenuSubMenu presentation="drill-in" label="Deeper">
            <ContextMenuItem label="Leaf" />
          </ContextMenuSubMenu>
        </ContextMenuSubMenu>
      </template>
    </ContextMenu>
  `,
})

function views(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('.astryx-context-menu--flyout')]
}

describe('contextMenuSubMenu 节点标签', () => {
  it('展开的视图用标签节点命名（不含说明），嵌套视图的返回行用这个标签的文字', async () => {
    mount(Host, { attachTo: document.body })
    const trigger = document.querySelector<HTMLElement>('.astryx-context-menu-trigger')!
    trigger.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, detail: 1 }))
    await flushPromises()

    document.querySelector<HTMLElement>('.astryx-context-menu [aria-haspopup="menu"]')!.click()
    await flushPromises()

    const view = views()[0]!
    const labelId = view.getAttribute('aria-labelledby')
    expect(labelId).toBeTruthy()
    expect(document.getElementById(labelId!)!.textContent).not.toContain('Pick a folder')
    expect(view.hasAttribute('aria-label')).toBe(false)

    view.querySelector<HTMLElement>('[aria-haspopup="menu"]')!.click()
    await flushPromises()

    const nested = views()[1]!
    const back = nested.querySelector<HTMLElement>('[role="menuitem"]')!
    expect(back.textContent).toContain('Move to')
    expect(back.textContent).not.toContain('*')
  })
})
