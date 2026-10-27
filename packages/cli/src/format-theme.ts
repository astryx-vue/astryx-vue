import type { ThemeRecord } from './catalog-types.ts'
import type { ThemeStep } from './commands/theme.ts'
import { text } from './catalog.ts'
import { firstSentence } from './generate/markdown.ts'
import { BINARY } from './spec.ts'

/** `theme` prints: the list of themes, and the steps that load one. */

export function formatThemeList(themes: readonly ThemeRecord[], locale: 'en' | 'zh', dense: boolean): string {
  if (themes.length === 0)
    return locale === 'zh' ? '这个版本没有内置主题。\n' : 'This version ships no themes.\n'
  const lines = themes.map((theme) => {
    const head = `${theme.slug.padEnd(10)} ${text(theme.title, locale)}`
    if (dense)
      return `  ${head}`
    return `  ${head}  ${firstSentence(text(theme.summary, locale))}  → ${BINARY} theme ${theme.slug}`
  })
  const footer = locale === 'zh'
    ? `\n用 \`${BINARY} theme <名字>\` 看某一套主题怎么接入。\n`
    : `\nRun \`${BINARY} theme <name>\` for how to load one.\n`
  return `${[...lines, footer].join('\n')}`
}

export function formatThemeDetail(theme: ThemeRecord, locale: 'en' | 'zh', dense: boolean, steps: readonly ThemeStep[]): string {
  const head = [
    `# ${text(theme.title, locale)}`,
    '',
    dense ? text(theme.summary, locale) : `${text(theme.summary, locale)}\n\nDocs: ${text(theme.docsUrl, locale)}`,
  ]
  const body = steps.map((step, index) => {
    const lines = [`${index + 1}. ${step.title}`]
    if (step.text)
      lines.push(...step.text.split('\n').map(line => `   ${line}`))
    if (step.code)
      lines.push('', ...step.code.split('\n').map(line => `   ${line}`), '')
    return lines.join('\n').trimEnd()
  })
  return `${[...head, '', ...body].join('\n').trimEnd()}\n`
}
