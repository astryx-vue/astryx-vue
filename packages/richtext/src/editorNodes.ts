// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file editorNodes.ts
 * @input Imports the default Lexical node classes registered by the editor.
 * @output Exports DEFAULT_NODES — the base OSS node set.
 * @position Shared by RichTextEditor.tsx (editor config) and
 *   markdownSerializers.ts (headless conversion), so both register the same
 *   nodes and Markdown round-trips consistently.
 *
 * SYNC: When the default node set changes, both consumers pick it up here.
 */

import type { Klass, LexicalNode } from 'lexical'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HorizontalRuleNode } from '@lexical/extension'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { RichTextExtensionNode } from './markdownExtensionNode.js'

/**
 * The default OSS node set registered with the editor: headings, quotes,
 * lists, links, code, and tables. Extend via the `nodes` prop / option rather
 * than editing this list.
 */
export const DEFAULT_NODES: ReadonlyArray<Klass<LexicalNode>> = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  HorizontalRuleNode,
  // Markdown plugin nodes (spec:AST-064): registered everywhere so stored
  // state that holds them always loads.
  RichTextExtensionNode,
]
