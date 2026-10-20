import type { HeadConfig, SiteConfig, TransformContext } from 'vitepress'
import { generateLlmsArtifacts, markdownPathFor } from '../scripts/llms-txt.ts'

/**
 * 在页面 `<head>` 里指向同内容的 Markdown 版，顺便声明 `llms.txt` 是这份文档的索引。
 * 地址由 `markdownPathFor` 算出来，和构建期写出的文件用同一套规则。
 */
export function llmsAlternateLinks({ pageData }: TransformContext): HeadConfig[] {
  if (pageData.relativePath === '404.md')
    return []
  return [
    ['link', { rel: 'alternate', type: 'text/markdown', href: `/${markdownPathFor(pageData.relativePath)}` }],
    ['link', { rel: 'describedby', href: '/llms.txt' }],
  ]
}

/** 页面渲染并写盘之后再补纯文本产物。 */
export async function writeLlmsArtifacts(siteConfig: SiteConfig): Promise<void> {
  const summary = await generateLlmsArtifacts({ docsDir: siteConfig.srcDir, outDir: siteConfig.outDir })

  siteConfig.logger.info(`llms: ${summary.pages} pages rendered to Markdown`)
  for (const name of ['llms.txt', 'llms-zh.txt', 'llms-full.txt', 'llms-full-zh.txt']) {
    const file = summary.files.find(item => item.name === name)
    if (file !== undefined)
      siteConfig.logger.info(`llms: ${name} ${(file.bytes / 1024).toFixed(1)} KB`)
  }
  if (summary.unresolvedDemos.length > 0)
    siteConfig.logger.warn(`llms: 这些演示没找到源码：${summary.unresolvedDemos.join(', ')}`)
}
