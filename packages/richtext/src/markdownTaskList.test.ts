// Copyright (c) Meta Platforms, Inc. and affiliates.

import { parseMarkdown } from '@astryx-vue/core/Markdown/parser'
import { createHeadlessEditor } from '@lexical/headless'
import { $isListItemNode, registerList } from '@lexical/list'
import { registerRichText } from '@lexical/rich-text'
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  INSERT_PARAGRAPH_COMMAND,
} from 'lexical'
import { describe, expect, it } from 'vitest'
import { DEFAULT_NODES } from './editorNodes.js'
import {
  editorStateJSONToMarkdown,
  markdownToEditorStateJSON,
} from './markdownSerializers.js'
import { $setTaskState, registerTaskListEditing } from './markdownTaskList.js'

interface SerializedNode {
  readonly type: string
  readonly listType?: string
  readonly checked?: boolean
  readonly text?: string
  readonly $?: {
    readonly astryxTask?: boolean
    readonly astryxTaskChecked?: boolean
  }
  readonly children?: ReadonlyArray<SerializedNode>
}

/** Each list item's checked state in document order, as RichText imports it. */
function richTextTasks(markdown: string): Array<boolean | undefined> {
  const { root } = JSON.parse(markdownToEditorStateJSON(markdown)) as {
    root: SerializedNode
  }
  const states: Array<boolean | undefined> = []
  const visit = (node: SerializedNode, listType?: string) => {
    if (node.type === 'listitem') {
      const isWrapper
        = node.children?.length === 1 && node.children[0].type === 'list'
      if (!isWrapper) {
        states.push(
          listType === 'check'
            ? node.checked === true
            : node.$?.astryxTask === true
              ? node.$.astryxTaskChecked === true
              : undefined,
        )
      }
    }
    for (const child of node.children ?? []) {
      visit(child, node.type === 'list' ? node.listType : listType)
    }
  }
  visit(root)
  return states
}

/** Each list item's checked state in document order, as core Markdown parses it. */
function coreTasks(markdown: string): Array<boolean | undefined> {
  const states: Array<boolean | undefined> = []
  const visit = (nodes: ReadonlyArray<unknown>) => {
    for (const node of nodes as ReadonlyArray<{
      type: string
      children?: ReadonlyArray<unknown>
      items?: ReadonlyArray<{
        checked?: boolean
        children?: ReadonlyArray<unknown>
      }>
    }>) {
      if (node.type === 'list') {
        for (const item of node.items ?? []) {
          states.push(item.checked)
          visit(item.children ?? [])
        }
      }
      else if (Array.isArray(node.children)) {
        visit(node.children)
      }
    }
  }
  visit(parseMarkdown(markdown) as ReadonlyArray<unknown>)
  return states
}

function topLevelTypes(markdown: string): Array<string> {
  const { root } = JSON.parse(markdownToEditorStateJSON(markdown)) as {
    root: SerializedNode
  }
  return (root.children ?? []).map(node =>
    node.type === 'list' ? `list:${node.listType}` : node.type,
  )
}

function editAndExport(markdown: string, edit: () => void): string {
  const editor = createHeadlessEditor({
    namespace: 'astryx-task-list-test',
    nodes: [...DEFAULT_NODES],
    onError(error: Error) {
      throw error
    },
  })
  editor.setEditorState(
    editor.parseEditorState(markdownToEditorStateJSON(markdown)),
  )
  editor.update(edit, { discrete: true })
  return editorStateJSONToMarkdown(
    JSON.stringify(editor.getEditorState().toJSON()),
  )
}

describe('task lists (spec:AST-061 FR5)', () => {
  it('reads exactly the task items core Markdown reads', () => {
    for (const markdown of [
      '- [ ] open\n- [x] done\n',
      '* [x] star\n',
      '+ [X] plus, uppercase\n',
      '- [ ] a\r\n- [X] b\r\n',
      '- [ ] parent\n    - [x] child\n',
      '- plain\n- [ ] task\n',
      '- [] empty brackets\n',
      '- [ ]no space\n',
      '- [y] other letter\n',
    ]) {
      expect(richTextTasks(markdown), JSON.stringify(markdown)).toEqual(
        coreTasks(markdown),
      )
    }
    // Uppercase X is checked.
    expect(richTextTasks('+ [X] plus\n')).toEqual([true])
    // Brackets with no bullet stay a paragraph.
    expect(topLevelTypes('[ ] not a task\n')).toEqual(['paragraph'])
    expect(topLevelTypes('[x] not a task\n')).toEqual(['paragraph'])
    // An empty pair of brackets is an ordinary bullet that shows them.
    expect(topLevelTypes('- [] text\n')).toEqual(['list:bullet'])
    expect(
      editorStateJSONToMarkdown(markdownToEditorStateJSON('- [] text\n')),
    ).toBe('- [] text\n')
  })

  it('keeps task and plain items written together in one list', () => {
    for (const markdown of [
      '- [ ] task\n- plain\n- [x] done\n',
      '- plain\n- [ ] task\n',
      '- [ ] task\r\n- plain\r\n',
      // Loose: blank lines between items still make one list.
      '- [ ] task\n\n- plain\n\n- [X] done\n',
    ]) {
      expect(topLevelTypes(markdown), JSON.stringify(markdown)).toEqual([
        'list:bullet',
      ])
      expect(richTextTasks(markdown), JSON.stringify(markdown)).toEqual(
        coreTasks(markdown),
      )
      expect(
        editorStateJSONToMarkdown(markdownToEditorStateJSON(markdown)),
        JSON.stringify(markdown),
      ).toBe(markdown)
    }
    // Nested: a plain child under a task, and a task child under a plain item.
    const nested
      = '- [ ] parent\n  - plain child\n- plain\n  - [x] task child\n'
    expect(richTextTasks(nested)).toEqual(coreTasks(nested))
    // Edited, the list writes each item as it is.
    const edited = editAndExport('- [ ] task\n- plain\n', () => {
      const plain = $getRoot()
        .getAllTextNodes()
        .find(node => node.getTextContent() === 'plain')
      plain?.setTextContent('plain!')
    })
    expect(edited).toBe('- [ ] task\n- plain!\n')
    expect(topLevelTypes(edited)).toEqual(['list:bullet'])
  })

  it('keeps untouched task lists exact and writes edited ones as GFM (spec:AST-062)', () => {
    for (const markdown of [
      '- [ ] Open task\n- [x] Completed task\n',
      '* [X] Upper\r\n+ [ ] Plus\r\n',
    ]) {
      expect(
        editorStateJSONToMarkdown(markdownToEditorStateJSON(markdown)),
      ).toBe(markdown)
    }
    const edited = editAndExport('- [ ] Open task\n- [X] Done\n', () => {
      const open = $getRoot()
        .getAllTextNodes()
        .find(node => node.getTextContent() === 'Open task')
      open?.setTextContent('Open task!')
    })
    expect(edited).toBe('- [ ] Open task!\n- [x] Done\n')
    expect(richTextTasks(edited)).toEqual([false, true])
    // A task turned plain, a plain item turned task, and back, in one list.
    const items = () =>
      $getRoot()
        .getAllTextNodes()
        .map(node => node.getParent())
        .filter($isListItemNode)
    const toPlain = editAndExport('- [ ] a\n- [x] b\n', () => {
      $setTaskState(items()[0], null)
    })
    expect(toPlain).toBe('- a\n- [x] b\n')
    expect(richTextTasks(toPlain)).toEqual([undefined, true])
    const toTask = editAndExport(toPlain, () => {
      $setTaskState(items()[0], 'unchecked')
      $setTaskState(items()[1], null)
    })
    expect(toTask).toBe('- [ ] a\n- b\n')
    expect(richTextTasks(toTask)).toEqual([false, undefined])
  })

  it('makes an unchecked task when Enter splits or ends a task, and a plain item after a plain one', () => {
    /**
     * Imports `markdown` into an editor with the editor's Enter handling,
     * puts the caret in the text `needle` (at its end, or at `offset`),
     * presses Enter `presses` times, types `typed`, and exports.
     */
    const enter = (
      markdown: string,
      needle: string,
      {
        offset,
        presses = 1,
        typed = '',
      }: { offset?: number, presses?: number, typed?: string } = {},
    ): string => {
      const editor = createHeadlessEditor({
        namespace: 'astryx-task-enter',
        nodes: [...DEFAULT_NODES],
        onError(error: Error) {
          throw error
        },
      })
      registerRichText(editor)
      registerList(editor)
      registerTaskListEditing(editor)
      editor.setEditorState(
        editor.parseEditorState(markdownToEditorStateJSON(markdown)),
      )
      editor.update(
        () => {
          const text = $getRoot()
            .getAllTextNodes()
            .find(node => node.getTextContent() === needle)
          const at = offset ?? needle.length
          text?.select(at, at)
          for (let press = 0; press < presses; press++) {
            editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined)
          }
          const selection = $getSelection()
          if (typed !== '' && $isRangeSelection(selection)) {
            selection.insertText(typed)
          }
        },
        { discrete: true },
      )
      return editorStateJSONToMarkdown(
        JSON.stringify(editor.getEditorState().toJSON()),
      )
    }
    // At the end of a checked or an unchecked task.
    expect(enter('- [x] done\n', 'done', { typed: 'new' })).toBe(
      '- [x] done\n- [ ] new\n',
    )
    expect(enter('- [ ] open\n', 'open', { typed: 'new' })).toBe(
      '- [ ] open\n- [ ] new\n',
    )
    // In the middle of a checked task: the text after the caret moves to an
    // unchecked task; the checked one keeps the rest.
    expect(enter('- [x] doneafter\n', 'doneafter', { offset: 4 })).toBe(
      '- [x] done\n- [ ] after\n',
    )
    // At the start of a checked task: the text keeps its state, and the new,
    // empty item before it is unchecked.
    expect(enter('- [x] done\n', 'done', { offset: 0 })).toBe(
      '- [ ] \n- [x] done\n',
    )
    // Between tasks, and nested.
    expect(enter('- [x] one\n- [x] two\n', 'one', { typed: 'new' })).toBe(
      '- [x] one\n- [ ] new\n- [x] two\n',
    )
    expect(
      enter('- [ ] parent\n  - [x] child\n', 'child', { typed: 'new' }),
    ).toBe('- [ ] parent\n  - [x] child\n  - [ ] new\n')
    // A plain item makes a plain item, beside tasks too.
    expect(enter('- [x] done\n- plain\n', 'plain', { typed: 'new' })).toBe(
      '- [x] done\n- plain\n- new\n',
    )
    // Enter in the new, empty task leaves the list, as for any list item.
    expect(enter('- [x] done\n', 'done', { presses: 2, typed: 'new' })).toBe(
      '- [x] done\n\nnew\n',
    )
    // Nothing looks at content: an empty checked task written in the source
    // stays checked.
    const emptyChecked = '- [x] \n- [ ] b\n'
    expect(richTextTasks(emptyChecked)).toEqual([true, false])
    expect(richTextTasks(emptyChecked)).toEqual(coreTasks(emptyChecked))
  })
})
