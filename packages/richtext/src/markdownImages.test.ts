import type { TextNode } from 'lexical'
import { createHeadlessEditor } from '@lexical/headless'
import { $createLinkNode } from '@lexical/link'
import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  CONTROLLED_TEXT_INSERTION_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { afterEach, describe, expect, it } from 'vitest'
import { createRichTextEditor } from './editor/createEditor.js'
import { DEFAULT_NODES } from './editorNodes.js'
import { $isImageSource } from './markdownImages.js'
import { editorStateJSONToMarkdown, markdownToEditorStateJSON } from './markdownSerializers.js'

// 图片 Markdown 是富文本没法画成结构的源码：旁边的编辑不能改它，自己段落里的编辑也要保住它的每个字符，
// 别的客户端读到的才仍然是图片。

function editAndExport(markdown: string, edit: () => void): string {
  const editor = createHeadlessEditor({
    namespace: 'astryx-markdown-images-test',
    nodes: [...DEFAULT_NODES],
    onError(error: Error) {
      throw error
    },
  })
  editor.setEditorState(editor.parseEditorState(markdownToEditorStateJSON(markdown)))
  editor.update(edit, { discrete: true })
  return editorStateJSONToMarkdown(JSON.stringify(editor.getEditorState().toJSON()))
}

/** 在第一个含有 `needle` 的块末尾追加文字。 */
function $appendToBlockContaining(needle: string, text: string): void {
  const block = $getRoot().getChildren().find(candidate => candidate.getTextContent().includes(needle))
  if (!$isElementNode(block))
    throw new Error(`no block contains ${needle}`)
  block.append($createTextNode(text))
}

/** 装着图片源码 `image` 的文字节点。 */
function $imageText(image: string): TextNode {
  const node = $getRoot().getAllTextNodes().find(candidate => candidate.getTextContent() === image)
  if (node == null)
    throw new Error(`no text holds ${image}`)
  return node
}

const IMAGES = {
  named: '![A chart](https://example.com/chart.png)',
  emptyAlt: '![](https://example.com/chart.png)',
  titled: '![A chart](https://example.com/chart.png "Weekly chart")',
  quotedTitle: '![A (chart)](https://example.com/chart.png "Weekly \\"chart\\" (draft)")',
  angleDestination: '![A chart](<https://example.com/my chart.png> \'Weekly\')',
}

describe('image Markdown through edits', () => {
  for (const [name, image] of Object.entries(IMAGES)) {
    it(`keeps a ${name} image on its own line when the next paragraph changes`, () => {
      expect(editAndExport(`${image}\n\nEdit me\n`, () => $appendToBlockContaining('Edit me', ' now')))
        .toBe(`${image}\n\nEdit me now\n`)
    })

    it(`keeps a ${name} image inline when the paragraph beside it changes`, () => {
      expect(editAndExport(`Before ${image} after\n\nEdit me\n`, () => $appendToBlockContaining('Edit me', ' now')))
        .toBe(`Before ${image} after\n\nEdit me now\n`)
    })

    it(`keeps every character of a ${name} image when its own paragraph changes`, () => {
      expect(editAndExport(`Before ${image} after\n`, () => $appendToBlockContaining('after', ' now')))
        .toBe(`Before ${image} after now\n`)
    })

    it(`keeps every character of a ${name} image on its own line when text is added after it`, () => {
      expect(editAndExport(`${image}\n`, () => $appendToBlockContaining('chart', ' caption')))
        .toBe(`${image} caption\n`)
    })
  }

  it.each([
    ['full', '![A chart][chart]'],
    ['collapsed', '![chart][]'],
    ['shortcut', '![chart]'],
  ])('keeps a %s reference image as written when its paragraph changes', (_form, image) => {
    const source = `Before ${image} after\n\n[chart]: https://example.com/chart.png\n`
    expect(editAndExport(source, () => $appendToBlockContaining('Before', ' now')))
      .toBe(`Before ${image} after now\n\n[chart]: https://example.com/chart.png\n`)
  })

  it('keeps an image inside a link, and the link around it, through an edit', () => {
    const badge = '[![Build](https://example.com/badge.svg)](https://example.com/ci)'
    expect(editAndExport(`${badge} status\n`, () => $appendToBlockContaining('status', ' now')))
      .toBe(`${badge} status now\n`)
  })

  it('imports an image as one source token that is marked as an image', () => {
    const editor = createHeadlessEditor({
      nodes: [...DEFAULT_NODES],
      onError(error: Error) {
        throw error
      },
    })
    editor.setEditorState(editor.parseEditorState(markdownToEditorStateJSON(`Before ${IMAGES.named} after\n`)))
    editor.getEditorState().read(() => {
      const node = $imageText(IMAGES.named)
      expect(node.getMode()).toBe('token')
      expect($isImageSource(node)).toBe(true)
      expect($isImageSource($getRoot().getAllTextNodes().find(text => text.getTextContent().startsWith('Before'))!)).toBe(false)
    })
  })

  it('does not turn a literal "!" before a link into an image, nor a "(" after an image into its destination', () => {
    const exclaim = editAndExport('Look\n', () => {
      const paragraph = $getRoot().getFirstChild()
      if (!$isElementNode(paragraph))
        return
      paragraph.clear()
      const link = $createLinkNode('https://example.com/')
      link.append($createTextNode('site'))
      paragraph.append($createTextNode('wow!'), link)
    })
    expect(exclaim).toBe('wow\\![site](https://example.com/)\n')

    const reference = '![chart]'
    const paren = editAndExport(`${reference}\n\n[chart]: https://example.com/chart.png\n`, () => {
      $imageText(reference).insertAfter($createTextNode('(not a destination)'))
    })
    expect(paren).toBe(`${reference}\\(not a destination)\n\n[chart]: https://example.com/chart.png\n`)
  })

  it('writes a shortcut reference image in its collapsed form before a link', () => {
    const result = editAndExport('![chart] [site](https://example.com/)\n\n[chart]: https://example.com/chart.png\n', () => {
      const text = $getRoot().getAllTextNodes().find(node => node.getTextContent() === ' ')
      text?.remove()
    })
    expect(result).toContain('![chart][][site](https://example.com/)')
  })
})

describe('the caret stays out of an image source', () => {
  const live: Array<{ dispose: () => void }> = []

  afterEach(() => {
    for (const editor of live.splice(0))
      editor.dispose()
  })

  function setup(): ReturnType<typeof createRichTextEditor> {
    const editor = createRichTextEditor({ initialState: markdownToEditorStateJSON(`Before ${IMAGES.named} after\n`) })
    live.push(editor)
    return editor
  }

  function caretIn(editor: ReturnType<typeof createRichTextEditor>, offset: number): void {
    editor.update(() => {
      $imageText(IMAGES.named).select(offset, offset)
    }, { discrete: true })
  }

  function caret(editor: ReturnType<typeof createRichTextEditor>): { key: string, offset: number } {
    return editor.getEditorState().read(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection))
        throw new Error('no range selection')
      return { key: selection.anchor.key, offset: selection.anchor.offset }
    })
  }

  it('moves a caret inside the source to the nearer edge on a selection change', () => {
    const editor = setup()
    caretIn(editor, 5)
    editor.update(() => {
      editor.dispatchCommand(SELECTION_CHANGE_COMMAND, undefined)
    }, { discrete: true })
    const { offset } = caret(editor)
    expect(offset).toBe(0)
  })

  it('moves the caret out before a typed character reaches the source', () => {
    const editor = setup()
    caretIn(editor, IMAGES.named.length - 3)
    editor.update(() => {
      editor.dispatchCommand(CONTROLLED_TEXT_INSERTION_COMMAND, 'x')
    }, { discrete: true })
    // 光标先移到图片源码后面，所以输入的字落在它后面，图片本身一个字符都没少。
    editor.getEditorState().read(() => {
      expect($getRoot().getTextContent()).toBe(`Before ${IMAGES.named}x after`)
      expect($getRoot().getAllTextNodes().some(node => $isTextNode(node) && node.getTextContent() === IMAGES.named)).toBe(true)
    })
  })
})
