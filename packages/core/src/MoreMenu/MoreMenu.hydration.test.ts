import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, Teleport } from 'vue'
import MoreMenu from './MoreMenu.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

/** 文档站的结构：服务端传送到 body 的内容排在应用根节点前面。 */
async function renderThenHydrate(): Promise<{ problems: unknown[], next: string | null | undefined }> {
  const Host = defineComponent({
    render: () => h('div', [
      h(MoreMenu, {
        items: [{ label: 'Edit' }, { label: 'Move to', items: [{ label: 'Inbox' }] }],
        isInline: true,
        isMenuOpen: true,
        label: 'Project actions',
      }),
      // 内联菜单之后，任何传送到 body 的层都得对上自己的服务端 HTML。
      h(Teleport, { to: 'body' }, [h('p', { class: 'next-layer' }, 'next')]),
    ]),
  })
  const context: { teleports?: Record<string, string> } = {}
  const html = await renderToString(createSSRApp(Host), context)
  document.body.innerHTML = `${context.teleports?.body ?? ''}<div id="app">${html}</div>`

  const problems: unknown[] = []
  const app = createSSRApp(Host)
  app.config.warnHandler = message => problems.push(message)
  app.config.errorHandler = error => problems.push(error)
  app.mount('#app')
  await nextTick()
  const next = document.querySelector('.next-layer')?.textContent
  app.unmount()
  return { problems, next }
}

describe('moreMenu inline hydration', () => {
  it('keeps later body layers aligned with their server markup', async () => {
    const { problems, next } = await renderThenHydrate()

    expect(problems).toEqual([])
    expect(next).toBe('next')
  })
})
