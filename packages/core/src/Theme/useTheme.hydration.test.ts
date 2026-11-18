import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { useTheme } from './useTheme.js'

afterEach(() => {
  document.documentElement.classList.remove('dark')
  document.documentElement.style.removeProperty('--astryx-color-accent')
  document.body.innerHTML = ''
})

describe('useTheme hydration', () => {
  it('renders the server mode and tokens while hydrating, then follows the page', async () => {
    const Host = defineComponent({
      setup() {
        const theme = useTheme()
        return () => h('span', `${theme.name.value} · ${theme.mode.value} · ${theme.token('--color-accent')}`)
      },
    })
    document.body.innerHTML = `<div id="app">${await renderToString(createSSRApp(Host))}</div>`
    expect(document.body.textContent).toBe('neutral · light · ')

    // 文档站在 hydration 之前就给 <html> 加上了 dark，页面样式也定义了 token。
    document.documentElement.classList.add('dark')
    document.documentElement.style.setProperty('--astryx-color-accent', '#3366ff')
    const problems: unknown[] = []
    const app = createSSRApp(Host)
    app.config.warnHandler = message => problems.push(message)
    app.config.errorHandler = error => problems.push(error)
    app.mount('#app')
    await nextTick()

    expect(problems).toEqual([])
    expect(document.body.textContent).toBe('neutral · dark · #3366ff')
    app.unmount()
  })
})
