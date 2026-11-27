import type { ElementNode, LexicalEditor, LexicalNode, TextNode } from 'lexical'
import { $isCodeNode } from '@lexical/code'
import { $isAutoLinkNode } from '@lexical/link'
import { $isListItemNode, $isListNode } from '@lexical/list'
import { $createTableNodeWithDimensions, $isTableCellNode, $isTableNode } from '@lexical/table'
import { mount } from '@vue/test-utils'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  DELETE_CHARACTER_COMMAND,
  KEY_TAB_COMMAND,
  PASTE_COMMAND,
  SELECT_ALL_COMMAND,
  SELECTION_INSERT_CLIPBOARD_NODES_COMMAND,
} from 'lexical'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { markdownToEditorStateJSON } from '../../markdownSerializers.js'
import { createRichTextEditor } from '../createEditor.js'
import RichTextEditor from '../RichTextEditor.vue'
import { RichTextEditorAutoLinkPlugin } from './RichTextEditorAutoLinkPlugin.js'

const roots: HTMLElement[] = []
const editors: Array<{ dispose: () => void }> = []
const mounted: Array<{ unmount: () => void }> = []

afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
  for (const instance of editors.splice(0))
    instance.dispose()
  for (const root of roots.splice(0))
    root.remove()
})

/** 建一个挂在页面上的编辑器，内容来自 Markdown。 */
function makeEditor(markdown: string, options: { hasMarkdownShortcuts?: boolean } = {}): LexicalEditor {
  const instance = createRichTextEditor({ initialState: markdownToEditorStateJSON(markdown), ...options })
  const root = document.createElement('div')
  root.contentEditable = 'true'
  document.body.append(root)
  instance.setRootElement(root)
  roots.push(root)
  editors.push(instance)
  return instance
}

function run(editor: LexicalEditor, fn: () => void): void {
  editor.update(fn, { discrete: true })
}

function textOf(editor: LexicalEditor, find: (node: LexicalNode) => boolean): string {
  return editor.getEditorState().read(() => {
    const node = $getRoot().getChildren().find(find)
    return node?.getTextContent() ?? ''
  })
}

function selectCodeBlock(editor: LexicalEditor, anchor: number | 'all', focus?: number): void {
  run(editor, () => {
    const code = $getRoot().getChildren().find($isCodeNode)!
    const textNode = code.getFirstDescendant<TextNode>()!
    if (anchor === 'all')
      textNode.select(0, textNode.getTextContentSize())
    else
      textNode.select(anchor, focus ?? anchor)
  })
}

function tab(editor: LexicalEditor, shiftKey = false): void {
  const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, cancelable: true })
  run(editor, () => {
    editor.dispatchCommand(KEY_TAB_COMMAND, event)
  })
}

function paste(editor: LexicalEditor, data: Record<string, string>): void {
  const event = new Event('paste', { cancelable: true }) as Event & { clipboardData: unknown }
  event.clipboardData = { getData: (type: string) => data[type] ?? '', types: Object.keys(data), files: [] }
  run(editor, () => {
    editor.dispatchCommand(PASTE_COMMAND, event as unknown as ClipboardEvent)
  })
}

describe('code block Tab', () => {
  it('indents the lines the selection touches by the indent the block uses', () => {
    const editor = makeEditor('```js\nif (a) {\n    b()\n}\n```\n')
    selectCodeBlock(editor, 'all')
    tab(editor)
    expect(textOf(editor, $isCodeNode)).toBe('    if (a) {\n        b()\n    }')
  })

  it('outdents with Shift+Tab', () => {
    const editor = makeEditor('```js\n  a\n  b\n```\n')
    selectCodeBlock(editor, 'all')
    tab(editor, true)
    expect(textOf(editor, $isCodeNode)).toBe('a\nb')
  })

  it('uses a tab character when the block is tab-indented', () => {
    const editor = makeEditor('```js\n\ta\nb\n```\n')
    selectCodeBlock(editor, 0, 0)
    tab(editor)
    expect(textOf(editor, $isCodeNode)).toBe('\t\ta\nb')
  })

  it('leaves Tab alone outside a code block', () => {
    const editor = makeEditor('plain\n')
    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
    let handled = false
    run(editor, () => {
      handled = editor.dispatchCommand(KEY_TAB_COMMAND, event)
    })
    expect(textOf(editor, () => true)).toBe('plain')
    // 列表缩进接管：这里只关心代码块的监听器没有把事件吃掉后又改了文字。
    expect(typeof handled).toBe('boolean')
  })
})

describe('code block Backspace', () => {
  it('turns a code block into a paragraph when pressed at its start', () => {
    const editor = makeEditor('para\n\n```js\nconst a = 1\n```\n')
    run(editor, () => {
      const code = $getRoot().getChildren().find($isCodeNode)!
      code.selectStart()
    })
    run(editor, () => {
      editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true)
    })
    editor.getEditorState().read(() => {
      const children = $getRoot().getChildren()
      expect(children.some($isCodeNode)).toBe(false)
      expect(children[1]!.getType()).toBe('paragraph')
      expect(children[1]!.getTextContent()).toBe('const a = 1')
    })
  })

  it('does nothing when the caret is not at the start', () => {
    const editor = makeEditor('```js\nconst a = 1\n```\n')
    selectCodeBlock(editor, 3)
    run(editor, () => {
      editor.dispatchCommand(DELETE_CHARACTER_COMMAND, true)
    })
    expect(editor.getEditorState().read(() => $getRoot().getChildren().some($isCodeNode))).toBe(true)
  })
})

describe('paste into a code block', () => {
  it('inserts rich clipboard content as plain text', () => {
    const editor = makeEditor('```js\nconst a = 1\n```\n')
    selectCodeBlock(editor, 'all')
    run(editor, () => {
      const selection = $getSelection()
      if ($isRangeSelection(selection))
        selection.focus.getNode().selectEnd()
    })
    paste(editor, { 'text/html': '<p><b>bold</b> and <a href="https://example.com">link</a></p>', 'text/plain': 'bold and link' })
    const code = textOf(editor, $isCodeNode)
    expect(code).toBe('const a = 1bold and link')
    expect(editor.getEditorState().read(() => $getRoot().getChildren().filter($isCodeNode).length)).toBe(1)
  })

  it('writes clipboard nodes without plain text as one line per block', () => {
    const editor = makeEditor('```js\nx\n```\n')
    run(editor, () => {
      const code = $getRoot().getChildren().find($isCodeNode)!
      code.selectEnd()
      const selection = $getSelection()!
      const one = $createParagraphNode().append($createTextNode('one'))
      const two = $createParagraphNode().append($createTextNode('two'))
      editor.dispatchCommand(SELECTION_INSERT_CLIPBOARD_NODES_COMMAND, { nodes: [one, two], selection })
    })
    expect(textOf(editor, $isCodeNode)).toBe('xone\ntwo')
  })
})

describe('select all scope', () => {
  it('selects the code block first, then the document', () => {
    const editor = makeEditor('before\n\n```js\nconst a = 1\n```\n')
    selectCodeBlock(editor, 2)
    run(editor, () => {
      editor.dispatchCommand(SELECT_ALL_COMMAND, new KeyboardEvent('keydown'))
    })
    const first = editor.getEditorState().read(() => $getSelection()!.getTextContent())
    expect(first).toBe('const a = 1')
    run(editor, () => {
      editor.dispatchCommand(SELECT_ALL_COMMAND, new KeyboardEvent('keydown'))
    })
    const second = editor.getEditorState().read(() => $getSelection()!.getTextContent())
    expect(second).toContain('before')
  })

  it('selects a table cell first', () => {
    const editor = makeEditor('before\n')
    run(editor, () => {
      const table = $createTableNodeWithDimensions(2, 2, false)
      $getRoot().append(table)
      const cell = table.getFirstDescendant()!
      cell.getParentOrThrow().selectStart()
    })
    editor.getEditorState().read(() => {
      expect($getRoot().getChildren().some($isTableNode)).toBe(true)
    })
    run(editor, () => {
      const cell = $getRoot().getChildren().find($isTableNode)!.getFirstDescendant()!
      const owner = cell.getParentOrThrow()
      owner.clear().append($createParagraphNode().append($createTextNode('cell one')))
      owner.selectEnd()
      editor.dispatchCommand(SELECT_ALL_COMMAND, new KeyboardEvent('keydown'))
    })
    const selected = editor.getEditorState().read(() => $getSelection()!.getTextContent())
    expect(selected).toContain('cell one')
    expect(selected).not.toContain('before')
  })
})

describe('paste a table into table cells', () => {
  function cellTexts(editor: LexicalEditor): string[][] {
    return editor.getEditorState().read(() => {
      const table = $getRoot().getChildren().find($isTableNode)!
      return table.getChildren().map(row => (row as unknown as { getChildren: () => LexicalNode[] }).getChildren().map(cell => cell.getTextContent()))
    })
  }

  it('writes a pasted table cell by cell and grows the table', () => {
    const editor = makeEditor('| a | b |\n| - | - |\n| c | d |\n')
    run(editor, () => {
      const table = $getRoot().getChildren().find($isTableNode)!
      const cell = table.getFirstDescendant()!.getParentOrThrow()
      cell.selectStart()
    })
    run(editor, () => {
      const pasted = $createTableNodeWithDimensions(3, 3, false)
      let n = 0
      for (const row of pasted.getChildren()) {
        for (const cell of (row as unknown as { getChildren: () => LexicalNode[] }).getChildren()) {
          if ($isTableCellNode(cell))
            cell.clear().append($createParagraphNode().append($createTextNode(`p${n++}`)))
        }
      }
      editor.dispatchCommand(SELECTION_INSERT_CLIPBOARD_NODES_COMMAND, { nodes: [pasted], selection: $getSelection()! })
    })
    const texts = cellTexts(editor)
    expect(texts).toHaveLength(3)
    expect(texts[0]).toEqual(['p0', 'p1', 'p2'])
    expect(texts[2]).toEqual(['p6', 'p7', 'p8'])
  })
})

describe('paste a table with other content into a cell', () => {
  it('puts each table in as text, since a cell holds no table', () => {
    const editor = makeEditor('| a | b |\n| - | - |\n| c | d |\n')
    run(editor, () => {
      $getRoot().getChildren().find($isTableNode)!.getFirstDescendant()!.getParentOrThrow().selectStart()
    })
    run(editor, () => {
      const intro = $createParagraphNode().append($createTextNode('intro'))
      const pasted = $createTableNodeWithDimensions(1, 2, false)
      const cells = pasted.getFirstChildOrThrow<ElementNode>().getChildren<ElementNode>()
      cells[0]!.clear().append($createParagraphNode().append($createTextNode('x')))
      cells[1]!.clear().append($createParagraphNode().append($createTextNode('y')))
      editor.dispatchCommand(SELECTION_INSERT_CLIPBOARD_NODES_COMMAND, { nodes: [intro, pasted], selection: $getSelection()! })
    })
    editor.getEditorState().read(() => {
      const tables = $getRoot().getAllTextNodes().length >= 0 ? $getRoot().getChildren().filter($isTableNode) : []
      expect(tables).toHaveLength(1)
      const nested = tables[0]!.getChildren().flatMap(row => (row as ElementNode).getChildren().flatMap(cell => (cell as ElementNode).getChildren().filter($isTableNode)))
      expect(nested).toHaveLength(0)
      expect(tables[0]!.getTextContent()).toContain('intro')
      expect(tables[0]!.getTextContent()).toContain('x\ty')
    })
  })
})

describe('list item shortcuts', () => {
  async function typeIntoFirstItem(editor: LexicalEditor, text: string): Promise<void> {
    for (const character of text) {
      run(editor, () => {
        const selection = $getSelection()
        if ($isRangeSelection(selection))
          selection.insertText(character)
      })
      // 更新监听器在提交之后才排队改写，等它落地。
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  it('turns a list item into a heading when "## " is typed at its start', async () => {
    const editor = makeEditor('- ')
    run(editor, () => {
      const item = $getRoot().getFirstDescendant()
      ;($isListItemNode(item) ? item : $getRoot().getFirstChild()!).selectStart()
    })
    await typeIntoFirstItem(editor, '## ')
    editor.getEditorState().read(() => {
      expect($getRoot().getFirstChild()!.getType()).toBe('heading')
    })
  })

  it('switches a bullet list to numbers when "1. " is typed', async () => {
    const editor = makeEditor('- one\n- two\n')
    run(editor, () => {
      const first = $getRoot().getFirstChild()
      if ($isListNode(first))
        first.getFirstChild()!.selectStart()
    })
    await typeIntoFirstItem(editor, '1. ')
    editor.getEditorState().read(() => {
      const list = $getRoot().getFirstChild()
      expect($isListNode(list) && list.getListType()).toBe('number')
    })
  })

  it('leaves the marker as typed when Markdown shortcuts are off', async () => {
    const editor = makeEditor('- one\n', { hasMarkdownShortcuts: false })
    run(editor, () => {
      const first = $getRoot().getFirstChild()
      if ($isListNode(first))
        first.getFirstChild()!.selectStart()
    })
    await typeIntoFirstItem(editor, '1. ')
    editor.getEditorState().read(() => {
      const list = $getRoot().getFirstChild()
      expect($isListNode(list) && list.getListType()).toBe('bullet')
    })
  })
})

function mountEditor(markdown: string, props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const wrapper = mount(RichTextEditor, {
    props: { label: 'Notes', defaultValue: markdownToEditorStateJSON(markdown), ...props },
    slots,
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}

describe('disabled editor links', () => {
  it('keeps links out of the tab order and stops them navigating', async () => {
    const wrapper = mountEditor('see [docs](https://example.com)\n', { isDisabled: true })
    await nextTick()
    const link = wrapper.get('[role="textbox"] a')
    expect(link.attributes('tabindex')).toBe('-1')
    expect(link.attributes('aria-disabled')).toBe('true')
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.element.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
  })

  it('restores the links when the editor is enabled again', async () => {
    const wrapper = mountEditor('see [docs](https://example.com)\n', { isDisabled: true })
    await nextTick()
    await wrapper.setProps({ isDisabled: false })
    const link = wrapper.get('[role="textbox"] a')
    expect(link.attributes('tabindex')).toBeUndefined()
    expect(link.attributes('aria-disabled')).toBeUndefined()
  })

  it('leaves links alone in an enabled editor', async () => {
    const wrapper = mountEditor('see [docs](https://example.com)\n')
    await nextTick()
    expect(wrapper.get('[role="textbox"] a').attributes('tabindex')).toBeUndefined()
  })
})

describe('auto link in code blocks', () => {
  function countAutoLinks(node: LexicalNode): number {
    if ($isAutoLinkNode(node))
      return 1
    return $isElementNode(node) ? node.getChildren().reduce((sum, child) => sum + countAutoLinks(child), 0) : 0
  }

  it('leaves a URL in an imported fence as code and still links ordinary text', async () => {
    const wrapper = mountEditor('```sh\ncurl https://example.com/api\n```\n\nSee https://example.com today.\n', {}, { default: () => h(RichTextEditorAutoLinkPlugin) })
    await nextTick()
    const editor = (wrapper.vm as unknown as { getEditor: () => LexicalEditor }).getEditor()
    await new Promise<void>(resolve => editor.update(() => {}, { onUpdate: resolve, discrete: true }))
    editor.getEditorState().read(() => {
      const code = $getRoot().getChildren().find($isCodeNode)!
      expect(countAutoLinks(code)).toBe(0)
      expect(countAutoLinks($getRoot())).toBe(1)
    })
  })
})
