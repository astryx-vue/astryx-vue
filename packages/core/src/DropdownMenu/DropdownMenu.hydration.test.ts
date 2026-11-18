import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import DropdownMenu from './DropdownMenu.vue'

afterEach(() => {
  document.body.innerHTML = ''
  // Vue 水合 Teleport 时把目标里的游标记在目标元素上（`_lpa`），水合完不清。真实页面
  // 每个文档只水合一次；这里三次共用同一个 body，不清的话下一次会从上一次的旧节点找起。
  delete (document.body as { _lpa?: unknown })._lpa
})

async function renderThenHydrate(): Promise<unknown[]> {
  const Host = defineComponent({
    render: () => h(DropdownMenu, {
      button: { label: 'Actions' },
      presentation: 'bottom-sheet',
      items: [{ label: 'Edit' }],
    }),
  })
  // 和真实页面一样：传送到 body 的服务端 HTML 排在应用根节点前面。
  const context: { teleports?: Record<string, string> } = {}
  const html = await renderToString(createSSRApp(Host), context)
  document.body.innerHTML = `${context.teleports?.body ?? ''}<div id="app">${html}</div>`
  const container = document.getElementById('app')!

  const problems: unknown[] = []
  const app = createSSRApp(Host)
  app.config.warnHandler = message => problems.push(message)
  app.config.errorHandler = error => problems.push(error)
  app.mount(container)
  await nextTick()
  app.unmount()
  return problems
}

describe('dropdownMenu 底部面板水合', () => {
  it.each([1, 2, 3])('第 %i 次新服务端渲染和水合都没有可恢复错误', async () => {
    expect(await renderThenHydrate()).toEqual([])
  })
})
