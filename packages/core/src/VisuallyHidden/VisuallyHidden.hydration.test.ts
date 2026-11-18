import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import VisuallyHidden from './VisuallyHidden.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('visuallyHidden hydration', () => {
  it('hydrates a void element such as a hidden checkbox without mismatches', async () => {
    const Host = defineComponent({
      render: () => h(VisuallyHidden, { 'as': 'input', 'type': 'checkbox', 'aria-label': 'Pro' }),
    })
    document.body.innerHTML = `<div id="app">${await renderToString(createSSRApp(Host))}</div>`

    const problems: unknown[] = []
    const app = createSSRApp(Host)
    app.config.warnHandler = message => problems.push(message)
    app.config.errorHandler = error => problems.push(error)
    app.mount('#app')
    await nextTick()

    expect(problems).toEqual([])
    expect(document.querySelector('input')?.childNodes).toHaveLength(0)
    app.unmount()
  })
})
