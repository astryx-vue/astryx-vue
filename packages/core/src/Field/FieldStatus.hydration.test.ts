import { renderToString } from '@vue/server-renderer'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick } from 'vue'
import FieldStatus from './FieldStatus.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

async function hydrateStatus(): Promise<unknown[]> {
  const Host = defineComponent({
    render: () => h(FieldStatus, { type: 'error', message: 'Required' }),
  })
  const container = document.createElement('div')
  container.innerHTML = await renderToString(createSSRApp(Host))
  document.body.appendChild(container)
  const problems: unknown[] = []
  const app = createApp(Host)
  app.config.warnHandler = message => problems.push(message)
  app.config.errorHandler = error => problems.push(error)
  app.mount(container, true)
  await nextTick()
  expect(container.textContent).toContain('Required')
  app.unmount()
  return problems
}

describe('fieldStatus hydration', () => {
  it.each([1, 2, 3])('hydrates existing server markup without warnings on pass %i', async () => {
    expect(await hydrateStatus()).toEqual([])
  })
})
