import type { Practice } from '../../catalog-types.ts'
import { cleanMarkdown, stripFenced, tidy } from './text.ts'

/**
 * Picks short readable text out of a page: the one-line summary, the first
 * sentence or paragraph, and the paragraph that mentions a given phrase.
 */

export function paragraphContaining(markdown: string, needle: string): string {
  const cleaned = tidy(stripFenced(cleanMarkdown(markdown)))
  const paragraph = cleaned.split(/\n\s*\n/).map(part => part.replace(/\n/g, ' ').trim()).find(part => part.includes(needle))
  if (!paragraph)
    throw new Error(`docs page is missing a paragraph containing ${JSON.stringify(needle)}`)
  return paragraph
}

export function firstParagraph(prose: string): string {
  for (const part of prose.split(/\n\s*\n/)) {
    const text = part.trim()
    if (!text || text.startsWith('```') || text.startsWith('|') || text.startsWith('- ') || text.startsWith('* ') || text.startsWith('#'))
      continue
    return text.replace(/\n/g, ' ').trim()
  }
  return ''
}

export function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]*?[.。](?=\s|$)/)
  return (match ? match[0] : text).trim()
}

/**
 * The summary is the first usage paragraph without import boilerplate. Pages
 * whose usage is only boilerplate fall back to a best practice, then to the
 * first example description.
 */
export function pickSummary(usageText: string, practices: Practice[], markdown: string): string {
  const prose = stripFenced(usageText)
  for (const part of prose.split(/\n\s*\n/)) {
    const text = part.trim()
    if (!text || text.startsWith('```') || text.startsWith('|') || text.startsWith('- ') || text.startsWith('* ') || text.startsWith('#') || text.startsWith('<'))
      continue
    const kept = splitSentences(text.replace(/\n/g, ' ').trim()).filter(sentence => !isImportBoilerplate(sentence))
    if (kept.length > 0)
      return kept.join(' ')
  }
  const practice = practices.find(item => item.text.trim() && !isImportBoilerplate(item.text))
  if (practice)
    return practice.text.trim()
  const described = demoDescription(markdown)
  if (described)
    return described
  return firstParagraph(usageText)
}

function splitSentences(text: string): string[] {
  const sentences: string[] = []
  let start = 0
  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    if (char !== '.' && char !== '。')
      continue
    const next = text[index + 1]
    if (next !== undefined && !/\s/u.test(next))
      continue
    const sentence = text.slice(start, index + 1).trim()
    if (sentence)
      sentences.push(sentence)
    start = index + 1
  }
  const tail = text.slice(start).trim()
  if (tail)
    sentences.push(tail)
  return sentences
}

function isImportBoilerplate(sentence: string): boolean {
  const normalized = sentence.trim().replace(/[.。:：]+$/u, '').replace(/\s+/g, ' ')
  return [
    /^import the components? from (?:its|their) dedicated entry$/i,
    /^import `[^`]+`(?: and `[^`]+`)? from (?:its|their) dedicated entry$/i,
    /^structural styles are loaded automatically$/i,
    /^the component loads its structural styles$/i,
    /^structural styles load with the component$/i,
    /^import it from its own entry$/i,
    /^import the theme once at your app entry$/i,
    /^import the theme in your application entry$/i,
    /^import the theme once in the application entry$/i,
    /^component usage$/i,
    /^基本用法$/,
    /^从独立入口导入即可[，,]?\s*结构样式会随组件自动加载$/,
    /^组件从独立入口导入[，,]?\s*结构样式会随组件自动加载$/,
    /^结构样式会随组件自动加载$/,
  ].some(pattern => pattern.test(normalized))
}

function demoDescription(markdown: string): string {
  const key = 'description="'
  let cursor = 0
  while (cursor < markdown.length) {
    const start = markdown.indexOf('<DemoExample', cursor)
    if (start === -1)
      return ''
    const end = markdown.indexOf('>', start)
    if (end === -1)
      return ''
    const tag = markdown.slice(start, end)
    const valueStart = tag.indexOf(key)
    if (valueStart !== -1) {
      const from = valueStart + key.length
      const valueEnd = tag.indexOf('"', from)
      if (valueEnd !== -1)
        return tag.slice(from, valueEnd).trim()
    }
    cursor = end + 1
  }
  return ''
}
