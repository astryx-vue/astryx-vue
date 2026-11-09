import { createMarkdownRenderer } from 'vitepress'
import { describe, expect, it } from 'vitest'
import { vueLanguage } from './vueLanguage.ts'

async function renderVue(source: string): Promise<string> {
  const markdown = await createMarkdownRenderer(process.cwd(), { languages: vueLanguage })
  return markdown.renderAsync(`\`\`\`vue\n${source}\n\`\`\``)
}

function lineContaining(html: string, text: string): string {
  const line = html.split('<span class="line">').find(part => part.includes(text))
  if (!line)
    throw new Error(`Missing rendered line containing ${text}`)
  return line
}

describe('vue language registration', () => {
  it('highlights templates, components and directives inside a component wrapper', async () => {
    const html = await renderVue('<Chart :data="data">\n  <template #interactions>\n    <ChartZoom @change="value = $event" />\n  </template>\n</Chart>')
    expect(lineContaining(html, 'ChartZoom')).toContain('>ChartZoom</span>')
    expect(lineContaining(html, 'ChartZoom')).toContain('>change</span>')
    expect(lineContaining(html, 'ChartZoom')).not.toContain('&#x3C;ChartZoom @change="value = $event" /></span>')
    expect(lineContaining(html, '>data</span>')).toContain('>Chart</span>')
  })

  it('also analyzes nested templates inside lowercase HTML wrappers', async () => {
    const html = await renderVue('<section>\n  <template #default>\n    <Button label="Save" />\n  </template>\n</section>')
    expect(lineContaining(html, 'Button')).toContain('>Button</span>')
    expect(lineContaining(html, 'Button')).toContain('> label</span>')
  })

  it('keeps TypeScript highlighting in script setup blocks', async () => {
    const html = await renderVue('<script setup lang="ts">\nimport { ref } from "vue"\nconst count = ref(0)\n</script>\n<template>\n  <Button @click="count++" />\n</template>')
    expect(lineContaining(html, 'import')).toContain('>import</span>')
    expect(lineContaining(html, 'const')).toContain('>const</span>')
    expect(lineContaining(html, 'Button')).toContain('>++</span>')
  })
})
