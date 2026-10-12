import type { Plugin } from 'vite'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { createMarkdownRenderer } from 'vitepress'

const VITE_HOME_CODE_ID = 'virtual:home-code-snippets'

export function demoSourcePlugin(): Plugin {
  let renderer: ReturnType<typeof createMarkdownRenderer> | undefined

  return {
    name: 'astryx-demo-source',
    enforce: 'pre',
    resolveId(id) {
      if (id === VITE_HOME_CODE_ID)
        return `\0${VITE_HOME_CODE_ID}`
    },
    async load(id) {
      if (id === `\0${VITE_HOME_CODE_ID}`) {
        renderer ??= createMarkdownRenderer(process.cwd(), { languages: ['vue', 'ts'] })
        const markdown = await renderer
        const zhCode = `<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
</script>

<template>
  <Button variant="primary" label="快速开始" />
</template>`

        const enCode = `<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
</script>

<template>
  <Button variant="primary" label="Quick start" />
</template>`

        const zhHtml = await markdown.renderAsync(`\`\`\`vue\n${zhCode}\n\`\`\``)
        const enHtml = await markdown.renderAsync(`\`\`\`vue\n${enCode}\n\`\`\``)

        return `export const homeCodeSnippets = ${JSON.stringify({
          zh: { code: zhCode, html: zhHtml },
          en: { code: enCode, html: enHtml },
        })}`
      }

      if (!id.endsWith('.vue?raw&highlighted'))
        return

      const filename = id.slice(0, id.indexOf('?'))
      this.addWatchFile(filename)
      const source = await readFile(filename, 'utf8')
      renderer ??= createMarkdownRenderer(process.cwd(), { languages: ['vue'] })
      const markdown = await renderer
      const fence = '`'.repeat(Math.max(3, ...Array.from(source.matchAll(/`+/g), match => match[0].length + 1)))
      const html = await markdown.renderAsync(`${fence}vue\n${source}\n${fence}`)
      return `export default ${JSON.stringify({ source, html })}`
    },
  }
}
