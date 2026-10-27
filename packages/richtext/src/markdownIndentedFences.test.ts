// Copyright (c) Meta Platforms, Inc. and affiliates.

import { parseMarkdownAst } from '@astryx-vue/core/Markdown/parser'
import { describe, expect, it } from 'vitest'
import { markdownToEditorStateJSON } from './markdownSerializers.js'

interface Json { type: string, text?: string, value?: string, children?: Json[] }

/** The text of every code block the editor imports, in order. */
function richCode(markdown: string): string[] {
  const text = (node: Json): string =>
    node.type === 'linebreak'
      ? '\n'
      : (node.text ?? (node.children ?? []).map(text).join(''))
  return (JSON.parse(markdownToEditorStateJSON(markdown)) as { root: Json }).root.children!.filter(node => node.type === 'code').map(text)
}

/** The text of every code block core reads, in order. */
function coreCode(markdown: string): string[] {
  return (parseMarkdownAst(markdown).children as unknown as Json[])
    .filter(node => node.type === 'code')
    .map(node => node.value ?? '')
}

describe('an indented code fence reads as core reads it', () => {
  it.each([
    ['  ```js\n  x\n    y\n  ```', ['x\n  y']],
    [' ```\na\n ```', ['a']],
    ['   ~~~\n   b\n   ~~~', ['b']],
    ['```\ncode\n  ```\nafter', ['code']],
    ['Text\n ```\n code\n ```', ['code']],
  ])('imports %j with the code core reads', (markdown, expected) => {
    expect(richCode(markdown)).toEqual(expected)
    expect(coreCode(markdown)).toEqual(expected)
  })

  // TODO(core): 我们 core 的 Markdown 解析器和上游 v0.7.1 不一致（见 F1a 回报第 6 节）。
  // 上游 core 把四空格缩进的围栏连同缩进读成一行文字（行内代码），
  // 我们 core 读成 code 块，富文本这一边因此也建出了代码块。等 core 对齐后恢复断言：
  //   expect(richCode('    ```\n    x\n    ```')).toEqual([]);
  //   expect(coreCode('    ```\n    x\n    ```')).toEqual([]);
  it.todo('reads a fence indented four spaces as no fence, as core does')
})
