import type { LexicalEditor } from 'lexical'
import { $createCodeNode } from '@lexical/code'
import { $createTableCellNode, $createTableNode, $createTableRowNode } from '@lexical/table'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isParagraphNode,
  KEY_ARROW_DOWN_COMMAND,
} from 'lexical'
import { afterEach, describe, expect, it } from 'vitest'
import { createRichTextEditor } from './createEditor.js'

const editors: Array<ReturnType<typeof createRichTextEditor>> = []

afterEach(() => {
  for (const editor of editors.splice(0))
    editor.dispose()
})

function createEditor(): LexicalEditor {
  const editor = createRichTextEditor()
  editors.push(editor)
  return editor
}

function arrowDown(editor: LexicalEditor): boolean {
  return editor.dispatchCommand(KEY_ARROW_DOWN_COMMAND, new KeyboardEvent('keydown', {
    key: 'ArrowDown',
    bubbles: true,
    cancelable: true,
  }))
}

describe('block exit', () => {
  it('adds and selects a paragraph below a final code block on ArrowDown at its end', async () => {
    const editor = createEditor()
    await new Promise<void>(resolve => editor.update(() => {
      const text = $createTextNode('const ready = true')
      $getRoot().clear().append($createCodeNode('js').append(text))
      text.selectEnd()
    }, { onUpdate: resolve }))

    expect(arrowDown(editor)).toBe(true)
    await new Promise<void>(resolve => editor.update(() => {}, { onUpdate: resolve }))
    editor.getEditorState().read(() => {
      const children = $getRoot().getChildren()
      expect(children).toHaveLength(2)
      expect($isParagraphNode(children[1])).toBe(true)
      expect(children[1]?.getTextContent()).toBe('')
    })
  })

  it('adds and selects a paragraph below a final table on ArrowDown at its last cell end', async () => {
    const editor = createEditor()
    await new Promise<void>(resolve => editor.update(() => {
      const text = $createTextNode('ready')
      const cell = $createTableCellNode().append($createParagraphNode().append(text))
      $getRoot().clear().append($createTableNode().append($createTableRowNode().append(cell)))
      text.selectEnd()
    }, { onUpdate: resolve }))

    expect(arrowDown(editor)).toBe(true)
    await new Promise<void>(resolve => editor.update(() => {}, { onUpdate: resolve }))
    editor.getEditorState().read(() => {
      const children = $getRoot().getChildren()
      expect(children).toHaveLength(2)
      expect($isParagraphNode(children[1])).toBe(true)
      expect(children[1]?.getTextContent()).toBe('')
    })
  })

  it('inserts a paragraph between adjacent code and table blocks', async () => {
    const editor = createEditor()
    await new Promise<void>(resolve => editor.update(() => {
      const text = $createTextNode('const ready = true')
      const cell = $createTableCellNode().append($createParagraphNode().append($createTextNode('ready')))
      $getRoot().clear().append(
        $createCodeNode('js').append(text),
        $createTableNode().append($createTableRowNode().append(cell)),
      )
      text.selectEnd()
    }, { onUpdate: resolve }))

    expect(arrowDown(editor)).toBe(true)
    await new Promise<void>(resolve => editor.update(() => {}, { onUpdate: resolve }))
    editor.getEditorState().read(() => {
      const children = $getRoot().getChildren()
      expect(children).toHaveLength(3)
      expect($isParagraphNode(children[1])).toBe(true)
      expect(children[1]?.getTextContent()).toBe('')
    })
  })

  it('keeps native ArrowDown behavior when the caret is not at the block end', async () => {
    const editor = createEditor()
    await new Promise<void>(resolve => editor.update(() => {
      const text = $createTextNode('const ready = true')
      $getRoot().clear().append($createCodeNode('js').append(text))
      text.select(0, 0)
    }, { onUpdate: resolve }))

    expect(arrowDown(editor)).toBe(false)
    editor.getEditorState().read(() => {
      expect($getRoot().getChildren()).toHaveLength(1)
    })
  })
})
