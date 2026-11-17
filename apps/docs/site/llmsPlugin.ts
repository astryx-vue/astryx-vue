import type { KawaPressPlugin } from 'kawapress'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { definePlugin } from 'kawapress'
import { generateLlmsArtifacts, markdownPathFor } from '../scripts/llms-txt.ts'

const DOCS_DIR = fileURLToPath(new URL('../docs', import.meta.url))

function info(message: string): void {
  process.stdout.write(`${message}\n`)
}

const SUMMARY_FILES = ['llms.txt', 'llms-zh.txt', 'llms-full.txt', 'llms-full-zh.txt']

/** KawaPress 给的源文件路径以 `/` 开头，llms 脚本里的路径相对 `srcDir`。 */
function relativeSourcePath(sourcePath: string): string {
  return sourcePath.replace(/^\//, '')
}

/**
 * astryx 自己的 llms 产物：组件页三个分页合成一篇，附上演示源码和组件目录。
 *
 * - 每页 `<head>` 指向同内容的 Markdown 版，并声明 `llms.txt` 是文档索引。
 * - 构建时写出每页的 `.md`，以及 `llms.txt`、`llms-zh.txt`、`llms-full.txt`、`llms-full-zh.txt`。
 *
 * 地址都由 `markdownPathFor` 算出来，链接和写出的文件不会走偏。
 */
export function llmsPlugin(): KawaPressPlugin {
  return definePlugin({
    name: 'astryx:llms',
    setup(api) {
      api.pageData((pageData, { sourcePath }) => {
        const path = relativeSourcePath(sourcePath)
        if (path === '404.md')
          return
        pageData.head = [
          ...pageData.head ?? [],
          ['link', { rel: 'alternate', type: 'text/markdown', href: `/${markdownPathFor(path)}` }],
          ['link', { rel: 'describedby', href: '/llms.txt' }],
        ]
      })

      api.buildArtifacts(async ({ pages, emitFile }) => {
        const summary = await generateLlmsArtifacts({
          docsDir: DOCS_DIR,
          pages: pages
            .map(page => ({ sourcePath: relativeSourcePath(page.sourcePath), routePath: page.routePath }))
            .filter(page => page.sourcePath !== '404.md'),
          write: emitFile,
        })

        info(`llms: ${summary.pages} pages rendered to Markdown`)
        for (const name of SUMMARY_FILES) {
          const file = summary.files.find(item => item.name === name)
          if (file !== undefined)
            info(`llms: ${name} ${(file.bytes / 1024).toFixed(1)} KB`)
        }
        if (summary.unresolvedDemos.length > 0)
          console.warn(`llms: 这些演示没找到源码：${summary.unresolvedDemos.join(', ')}`)
      })
    },
  })
}
