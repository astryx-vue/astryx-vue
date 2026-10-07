import type { Plugin } from 'vite'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { createMarkdownRenderer } from 'vitepress'

export function demoSourcePlugin(): Plugin {
  let renderer: ReturnType<typeof createMarkdownRenderer> | undefined

  return {
    name: 'astryx-demo-source',
    enforce: 'pre',
    async load(id) {
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
