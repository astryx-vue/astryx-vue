import type { LexicalNode } from 'lexical'
import { createHeadlessEditor } from '@lexical/headless'
import { $createListItemNode, $createListNode } from '@lexical/list'
import { $createLineBreakNode, $createParagraphNode, $createTextNode, $getRoot } from 'lexical'
import { describe, expect, it } from 'vitest'
import { DEFAULT_NODES } from './editorNodes.js'
import { markdownToEditorStateJSON } from './markdownSerializers.js'
import { $exportMarkdownKeepingSource } from './markdownSource.js'
import { DEFAULT_TRANSFORMERS } from './markdownTable.js'

interface Json { type: string, text?: string, children?: Json[] }

function newEditor(): ReturnType<typeof createHeadlessEditor> {
  return createHeadlessEditor({
    nodes: [...DEFAULT_NODES],
    onError(error) {
      throw error
    },
  })
}

/** The Markdown of a document built in the editor by `build`. */
function exportBuilt(build: () => LexicalNode[]): string {
  const editor = newEditor()
  editor.update(() => {
    $getRoot().clear().append(...build())
  }, { discrete: true })
  return editor.getEditorState().read(() => $exportMarkdownKeepingSource([...DEFAULT_TRANSFORMERS]))
}

/** Each top-level block read back from `markdown`: its text, a break as ⏎. */
function readBack(markdown: string): string[] {
  const text = (node: Json): string =>
    node.type === 'linebreak' ? '⏎' : (node.text ?? (node.children ?? []).map(text).join(''))
  return (JSON.parse(markdownToEditorStateJSON(markdown)) as { root: Json }).root.children!.map(text)
}

/** A paragraph of `parts`: a string is text, `null` a typed line break. */
function $paragraph(...parts: Array<string | null>): ReturnType<typeof $createParagraphNode> {
  const paragraph = $createParagraphNode()
  for (const part of parts)
    paragraph.append(part === null ? $createLineBreakNode() : $createTextNode(part))
  return paragraph
}

const IMAGE = '![Diagram](https://example.com/diagram.png)'

describe('a typed line break at the end of its block', () => {
  it('reads back with no literal backslash before an image block', () => {
    const markdown = exportBuilt(() => [$paragraph('Notes', null), $paragraph(IMAGE)])
    expect(readBack(markdown)).toEqual(['Notes', IMAGE])
  })

  it('reads back with no literal backslash at the end of the document', () => {
    expect(readBack(exportBuilt(() => [$paragraph('Last line', null)]))).toEqual(['Last line'])
  })

  it('reads back with no literal backslash after two typed breaks', () => {
    const markdown = exportBuilt(() => [$paragraph('Notes', null, null), $paragraph('Next')])
    expect(readBack(markdown)).toEqual(['Notes', 'Next'])
  })

  it('reads back with no literal backslash at the end of a checklist item', () => {
    const markdown = exportBuilt(() => {
      const list = $createListNode('check')
      const item = $createListItemNode(false)
      item.append($createTextNode('Buy milk'), $createLineBreakNode())
      list.append(item)
      return [list, $paragraph(IMAGE)]
    })
    expect(readBack(markdown)).toEqual(['Buy milk', IMAGE])
  })

  it('exports the same Markdown again after it is read back', () => {
    const markdown = exportBuilt(() => [$paragraph('Notes', null), $paragraph(IMAGE)])
    const editor = newEditor()
    editor.setEditorState(editor.parseEditorState(markdownToEditorStateJSON(markdown)))
    const again = editor.getEditorState().read(() => $exportMarkdownKeepingSource([...DEFAULT_TRANSFORMERS]))
    expect(again).toBe(markdown)
  })
})

describe('a typed line break inside its block still round-trips', () => {
  it('reads back as a line break', () => {
    const markdown = exportBuilt(() => [$paragraph('one', null, 'two')])
    expect(markdown.trimEnd()).toBe('one\\\ntwo')
    expect(readBack(markdown)).toEqual(['one⏎two'])
  })

  it('drops a break that only a space follows, and keeps the space', () => {
    expect(readBack(exportBuilt(() => [$paragraph('one', null, ' ')]))).toEqual(['one '])
  })

  it('keeps an authored backslash at the end of a line as text', () => {
    expect(readBack(exportBuilt(() => [$paragraph('C:\\temp\\')]))).toEqual(['C:\\temp\\'])
  })
})
