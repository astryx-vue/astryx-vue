import { describe, expect, it } from 'vitest'
import { applyInlinePlugins, applyMarkdownPlugins } from './plugins.js'

describe('markdown plugins', () => {
  it('keeps the tree when nothing matches and lets the earlier plugin win an overlap', () => {
    const root = {
      type: 'root',
      children: [
        { type: 'paragraph', children: [{ type: 'text', value: 'Hello @ada' }] },
        { type: 'code', value: '@ada', lang: 'ts' },
      ],
    }
    const same = applyInlinePlugins(root, [{
      name: 'mention',
      pattern: /@zzz/g,
      replace: () => ({ type: 'text', value: 'nope' }),
    }])
    expect(same).toBe(root)

    const next = applyInlinePlugins(root, [
      {
        name: 'mention',
        pattern: /@ada/g,
        replace: () => ({ type: 'extension', plugin: 'mention', name: 'user', value: 'ada' }),
      },
      {
        name: 'later',
        pattern: /@ada/g,
        replace: () => ({ type: 'extension', plugin: 'later', name: 'user', value: 'nope' }),
      },
    ])
    const paragraph = next.children?.[0]
    expect(paragraph?.children?.map(node => node.type === 'text' ? node.value : node.plugin)).toEqual([
      'Hello ',
      'mention',
    ])
    expect(next.children?.[1]).toBe(root.children[1])
  })

  it('returns the same root when a transform reports and makes no replacement', () => {
    const root = { type: 'root', children: [{ type: 'text', value: 'Hi' }] }
    const warnings: string[] = []
    const warn = console.warn
    console.warn = (message?: unknown) => {
      warnings.push(String(message))
    }
    const next = applyMarkdownPlugins(root, [{
      name: 'quiet',
      transform(current, context) {
        context.report('skipped')
        return current
      },
    }])
    console.warn = warn
    expect(next).toBe(root)
    expect(warnings).toEqual(['[Astryx] Markdown plugin "quiet": skipped'])
  })
})
