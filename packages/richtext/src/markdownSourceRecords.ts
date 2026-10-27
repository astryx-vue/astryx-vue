// 导入时记在节点和根上的「原文记录」：这一组顶层节点是从哪几个块来的、原字节是什么、
// 当时的规范 Markdown 指纹。所有记录都是 Lexical 的节点状态，随文档一起序列化。

import { createState } from 'lexical'
/** What a group of top-level nodes was imported from. */
export interface GroupRecord {
  /** The import and chunk this group came from; unique across documents. */
  readonly group: string;
  /** The rest is recorded on the group's first node only. */
  readonly size?: number;
  readonly content?: string;
  /** The bytes between this group and the next one. */
  readonly trailing?: string;
  /** A hash of the group's canonical Markdown at import. */
  readonly canonicalHash?: string;
  /** The line ending the group's source uses. */
  readonly lineEnding?: string;
  /**
   * The group right after this one in the source, recorded only when no
   * blank line separates them (a thematic break written under a block).
   */
  readonly next?: string;
}

/**
 * The serialized form of a group record: short keys, and defaults left out,
 * because every imported group carries one.
 */
export interface SerializedGroupRecord {
  g: string;
  n?: number;
  s?: string;
  t?: string;
  h?: string;
  e?: string;
  x?: string;
}

/** Facts about the whole imported document, kept on the root. */
export interface DocumentRecord {
  readonly importId: string;
  readonly byteOrderMark: boolean;
  /** The bytes before the first block, without the byte order mark. */
  readonly leading: string;
  /** The bytes after the last block. */
  readonly trailing: string;
  /** The document's first line ending, or LF when it has none. */
  readonly lineEnding: string;
}

function parseGroupRecord(value: unknown): GroupRecord | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const serialized = value as Partial<SerializedGroupRecord>;
  if (typeof serialized.g !== 'string') {
    return null;
  }
  if (typeof serialized.s !== 'string') {
    return {group: serialized.g};
  }
  return {
    group: serialized.g,
    size: typeof serialized.n === 'number' ? serialized.n : 1,
    content: serialized.s,
    trailing: typeof serialized.t === 'string' ? serialized.t : '\n\n',
    canonicalHash: typeof serialized.h === 'string' ? serialized.h : '',
    lineEnding: typeof serialized.e === 'string' ? serialized.e : '\n',
    ...(typeof serialized.x === 'string' ? {next: serialized.x} : {}),
  };
}

function unparseGroupRecord(
  record: GroupRecord | null,
): SerializedGroupRecord | null {
  if (record == null) {
    return null;
  }
  const serialized: SerializedGroupRecord = {g: record.group};
  if (record.content != null) {
    serialized.s = record.content;
    if (record.size !== 1) {
      serialized.n = record.size;
    }
    if (record.trailing !== '\n\n') {
      serialized.t = record.trailing;
    }
    serialized.h = record.canonicalHash;
    if (record.next != null) {
      serialized.x = record.next;
    }
    if (record.lineEnding !== '\n') {
      serialized.e = record.lineEnding;
    }
  }
  return serialized;
}

function isDocumentRecord(value: unknown): value is DocumentRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as {importId?: unknown}).importId === 'string'
  );
}

export const groupState = createState('astryxMd', {
  parse: parseGroupRecord,
  unparse: unparseGroupRecord,
});

export const documentState = createState('astryxMdDocument', {
  parse: (value: unknown): DocumentRecord | null =>
    isDocumentRecord(value) ? value : null,
});

let importCount = 0;

/** An id no other import in this or any other document shares. */
export function nextImportId(): string {
  importCount++;
  return `${Math.random().toString(36).slice(2, 8)}${importCount.toString(36)}`;
}

export const ENDS_WITH_BLANK_LINE = /\n[ \t]*\r?\n[ \t\r]*$/;
