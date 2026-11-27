import type { ElementNode, LexicalEditor, LexicalNode } from 'lexical'
import { $isListItemNode, $isListNode } from '@lexical/list'
import { mount } from '@vue/test-utils'
import { $createTextNode, $getRoot, $isElementNode } from 'lexical'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { markdownToEditorStateJSON } from '../../markdownSerializers.js'
import RichTextEditor from '../RichTextEditor.vue'

const HEBREW = 'שלום עולם'
const ENGLISH = 'Hello there'

const mounted: Array<{ unmount: () => void }> = []
function mountEditor(markdown: string) {
  const wrapper = mount(RichTextEditor, {
    props: { label: 'Notes', defaultValue: markdownToEditorStateJSON(markdown) },
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}
afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
  document.body.innerHTML = ''
})

const editorOf = (wrapper: ReturnType<typeof mountEditor>): LexicalEditor => (wrapper.vm as unknown as { getEditor: () => LexicalEditor }).getEditor()

async function settle(): Promise<void> {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 20))
  await nextTick()
}

/** 文档里每个元素节点的类型和写在它上面的方向，按文档顺序，嵌套的也在内。 */
function directions(editor: LexicalEditor): Array<[string, string | null]> {
  return editor.getEditorState().read(() => {
    const rows: Array<[string, string | null]> = []
    const visit = (node: LexicalNode): void => {
      if (!$isElementNode(node))
        return
      const holdsList = $isListItemNode(node) && node.getChildren().some($isListNode)
      rows.push([holdsList ? 'holder' : node.getType(), node.getDirection()])
      node.getChildren().forEach(visit)
    }
    $getRoot().getChildren().forEach(visit)
    return rows
  })
}

describe('blockDirectionPlugin', () => {
  it('writes each prose block\'s own direction, and nothing on a block with no strong character', async () => {
    const wrapper = mountEditor(`${HEBREW}\n\n${ENGLISH}\n\n12 / 34\n\n# ${HEBREW}`)
    await settle()
    expect(directions(editorOf(wrapper))).toEqual([
      ['paragraph', 'rtl'],
      ['paragraph', 'ltr'],
      ['paragraph', null],
      ['heading', 'rtl'],
    ])
  })

  it('settles every list item at any depth, and the holder of a nested list follows the item it hangs from', async () => {
    const wrapper = mountEditor(`- ${HEBREW}\n  - ${ENGLISH}\n- ${ENGLISH}`)
    await settle()
    expect(directions(editorOf(wrapper))).toEqual([
      ['list', null],
      ['listitem', 'rtl'],
      ['holder', 'rtl'],
      ['list', null],
      ['listitem', 'ltr'],
      ['listitem', 'ltr'],
    ])
  })

  it('leaves a table and its rows and cells without a direction, and settles the paragraphs inside the cells', async () => {
    const wrapper = mountEditor(`| a | b |\n| - | - |\n| ${HEBREW} | ${ENGLISH} |`)
    await settle()
    const rows = directions(editorOf(wrapper))
    for (const [type, direction] of rows) {
      if (['table', 'tablerow', 'tablecell'].includes(type))
        expect(direction).toBeNull()
    }
    expect(rows.filter(([type]) => type === 'paragraph').map(([, direction]) => direction)).toEqual(['ltr', 'ltr', 'rtl', 'ltr'])
  })

  it('rewrites the direction in the update that changes the text', async () => {
    const wrapper = mountEditor(ENGLISH)
    await settle()
    const editor = editorOf(wrapper)
    expect(directions(editor)).toEqual([['paragraph', 'ltr']])
    await new Promise<void>(resolve => editor.update(() => {
      $getRoot().getFirstChildOrThrow<ElementNode>().clear().append($createTextNode(HEBREW))
    }, { onUpdate: resolve }))
    expect(directions(editor)).toEqual([['paragraph', 'rtl']])
  })

  it('leaves a block with no strong text without a direction after its text is emptied', async () => {
    const wrapper = mountEditor(HEBREW)
    await settle()
    const editor = editorOf(wrapper)
    await new Promise<void>(resolve => editor.update(() => {
      $getRoot().getFirstChildOrThrow<ElementNode>().clear()
    }, { onUpdate: resolve }))
    expect(directions(editor)).toEqual([['paragraph', null]])
  })
})
