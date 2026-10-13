import { describe, expect, it } from 'vitest'
import * as Vue from 'vue'
import { compilePlaygroundSfc } from '../apps/docs/components/playground/compileSfc'
import * as Charts from '../apps/docs/components/playground/playgroundCharts'
import { playgroundTemplates } from '../apps/docs/components/playground/templates'
import * as Core from '../packages/core/src/index.ts'

const { createApp, h } = Vue

const modules = {
  vue: Vue as unknown as Record<string, unknown>,
  core: {
    Button: {
      name: 'StubButton',
      props: ['label'],
      setup(props: { label?: string }) {
        return () => h('button', props.label)
      },
    },
  },
  charts: {},
}

const templateCompileModules = {
  vue: Vue as unknown as Record<string, unknown>,
  core: Core as unknown as Record<string, unknown>,
  charts: Charts as unknown as Record<string, unknown>,
}

const shippedTemplates = playgroundTemplates('en')

describe('playground compiler', () => {
  it('mounts a script-setup SFC and scopes its CSS', () => {
    const compiled = compilePlaygroundSfc(`
      <script setup>
      import { ref } from 'vue'
      const name = ref('Ada')
      </script>
      <template><p class="page">{{ name }}</p></template>
      <style scoped>
      .page { color: red; }
      </style>
    `, modules, 'en')

    const host = document.createElement('div')
    const app = createApp(compiled.component)
    app.mount(host)
    expect(host.textContent).toContain('Ada')
    expect(host.querySelector('.page')?.getAttribute('data-v-playground')).not.toBeNull()
    expect(compiled.css).toContain('.page[data-v-playground]')
    app.unmount()
  })

  it('resolves named imports from @astryx-vue/core', () => {
    const compiled = compilePlaygroundSfc(`
      <script setup>
      import { Button } from '@astryx-vue/core/Button'
      </script>
      <template><Button label="Save" /></template>
    `, modules, 'zh')
    const host = document.createElement('div')
    const app = createApp(compiled.component)
    app.mount(host)
    expect(host.querySelector('button')?.textContent).toBe('Save')
    app.unmount()
  })

  it.each(shippedTemplates.map(template => [template.id, template] as const))(
    'compiles and mounts template %s',
    (id, template) => {
      const warnings: string[] = []
      const compiled = compilePlaygroundSfc(template.source, templateCompileModules, 'en')
      const host = document.createElement('div')
      const app = createApp(compiled.component)
      app.config.warnHandler = (msg) => {
        warnings.push(String(msg))
      }
      app.mount(host)
      expect(host.childElementCount).toBeGreaterThan(0)
      const propWarnings = warnings.filter(msg =>
        msg.includes('Invalid prop')
        || msg.includes('Missing required prop'),
      )
      expect(propWarnings, `${id} prop warnings`).toEqual([])
      app.unmount()
    },
    15_000,
  )

  it('rejects imports outside vue and the component package', () => {
    expect(() => compilePlaygroundSfc(`
      <script setup>
      import { ref } from 'react'
      </script>
      <template><p>{{ ref }}</p></template>
    `, modules, 'en')).toThrow(/react/)
  })
})
