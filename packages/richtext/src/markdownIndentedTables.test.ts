// Copyright (c) Meta Platforms, Inc. and affiliates.

import { parseMarkdownAst } from '@astryx-vue/core/Markdown/parser'
import { describe, expect, it } from 'vitest'
import { markdownToEditorStateJSON } from './markdownSerializers.js'

interface Json { type: string, text?: string, value?: string, children?: Json[] }

function textOf(node: Json): string {
  return node.text ?? node.value ?? (node.children ?? []).map(textOf).join('')
}

/** Each row's cell texts in the first table found. */
function rowsOf(nodes: ReadonlyArray<Json>, rowType: string): string[][] {
  const table = nodes.find(node => node.type === 'table')
  return (table?.children ?? [])
    .filter(row => row.type === rowType)
    .map(row => (row.children ?? []).map(textOf))
}

function richRows(markdown: string) {
  return rowsOf(
    (JSON.parse(markdownToEditorStateJSON(markdown)) as { root: Json }).root.children ?? [],
    'tablerow',
  )
}

function coreRows(markdown: string) {
  return rowsOf(parseMarkdownAst(markdown).children as unknown as Json[], 'tableRow')
}

describe('an indented table imports with its own columns, as core reads it', () => {
  it.each([
    '  | a | b |\n  | - | - |\n  | 1 | 2 |',
    '| a | b |\n| - | - |\n| 1 | 2 |',
  ])('imports %j as two columns', (markdown) => {
    const expected = [
      ['a', 'b'],
      ['1', '2'],
    ]
    expect(richRows(markdown)).toEqual(expected)
    expect(coreRows(markdown)).toEqual(expected)
  })

  it('imports a tab-indented table as two columns', () => {
    expect(richRows('\t| a | b |\n\t| - | - |\n\t| 1 | 2 |')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  // TODO(core): 我们 core 的 Markdown 解析器和上游 v0.7.1 不一致（见 F1a 回报第 6 节），
  // 这一条它把制表符缩进的表格读成 code 块，这里先只比富文本那一半。
  it.todo('imports a tab-indented table as core reads it')
})
