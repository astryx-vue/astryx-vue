import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick } from 'vue'
import DropdownMenu from './DropdownMenu.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

async function renderThenHydrate(): Promise<unknown[]> {
  const Host = defineComponent({
    render: () => h(DropdownMenu, {
      button: { label: 'Actions' },
      presentation: 'bottom-sheet',
      items: [{ label: 'Edit' }],
    }),
  })
  const html = await renderToString(createSSRApp(Host))
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)

  const problems: unknown[] = []
  const app = createApp(Host)
  app.config.warnHandler = message => problems.push(message)
  app.config.errorHandler = error => problems.push(error)
  app.mount(container, true)
  await nextTick()
  app.unmount()
  return problems
}

describe('dropdownMenu 底部面板水合', () => {
  it.each([1, 2, 3])('第 %i 次新服务端渲染和水合都没有可恢复错误', async () => {
    expect(await renderThenHydrate()).toEqual([])
  })
})
