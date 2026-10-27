// 节点台账里由人写的部分：勾选状态和条目下的备注（比如「- 结论：已采纳」）。
//
// 重新生成台账时，先从旧文件里读出这些内容，按「提交短哈希 + 节点」认回到新台账的同一条上。
// 新台账里已经没有的条目（比如改了归类规则，提交不再归这个节点），备注不丢，
// 集中放到文件末尾的 ORPHAN_HEADING 一节，由人决定怎么处理。
// `--check` 比较前用 stripAnnotations 去掉这些内容，只比较脚本生成的部分。

import { ENTRY_LABELS } from './render.mjs'

export const ORPHAN_HEADING = '## 已不在本节点的旧结论'
const ORPHAN_INTRO = '重新生成后，下面这些提交不再归这个节点。原来的勾选和备注保留在这里，处理完可以删掉这一节。'

const ENTRY = /^- \[([ xX])\] `([0-9a-f]+)` /
const GENERATED_ITEM = new RegExp(`^  - (?:${ENTRY_LABELS.join('|')})：`)

/** 是不是节点台账文件：`<节点ID>.md`，不含 `_summary.md`、`_unrelated.md` 和 README。 */
export function isNodeLedger(name) {
  return /^[A-Z]\d*[a-z]?\.md$/.test(name)
}

/**
 * 把一份台账切成条目块。每块是 { start, end, hash, checked }，end 不含。
 * 条目块从 `- [ ] \`hash\`` 那一行开始，到下一行不再缩进（或空行）为止。
 */
function entryBlocks(lines) {
  const blocks = []
  for (let i = 0; i < lines.length; i++) {
    const match = ENTRY.exec(lines[i])
    if (!match)
      continue
    let end = i + 1
    while (end < lines.length && /^\s+\S/.test(lines[end]))
      end++
    blocks.push({ start: i, end, hash: match[2], checked: match[1] !== ' ' })
    i = end - 1
  }
  return blocks
}

function orphanSectionStart(lines) {
  return lines.findIndex(line => line === ORPHAN_HEADING)
}

/**
 * 读出一份旧台账里人写的内容：短哈希 → { checked, notes, title }。
 * 只记有勾选或有备注的条目。orphan 一节里的条目也读，下次生成时还能认回去。
 */
export function readAnnotations(text) {
  const lines = text.split('\n')
  const result = new Map()
  for (const block of entryBlocks(lines)) {
    const notes = lines.slice(block.start + 1, block.end).filter(line => !GENERATED_ITEM.test(line))
    if (!block.checked && notes.length === 0)
      continue
    result.set(block.hash, { checked: block.checked, notes, title: lines[block.start].replace(ENTRY, '').trim() })
  }
  return result
}

/**
 * 把旧内容放回新生成的台账。
 * @returns {{ text: string, restored: number, orphans: string[] }} 新文本、认回去的条数、放进 orphan 一节的短哈希
 */
export function applyAnnotations(text, annotations) {
  if (annotations.size === 0)
    return { text, restored: 0, orphans: [] }
  const lines = text.split('\n')
  const out = []
  const used = new Set()
  let cursor = 0
  for (const block of entryBlocks(lines)) {
    out.push(...lines.slice(cursor, block.start))
    const note = annotations.get(block.hash)
    const head = lines[block.start]
    out.push(note?.checked ? head.replace('- [ ]', '- [x]') : head)
    out.push(...lines.slice(block.start + 1, block.end))
    if (note) {
      out.push(...note.notes)
      used.add(block.hash)
    }
    cursor = block.end
  }
  out.push(...lines.slice(cursor))
  const orphans = [...annotations.keys()].filter(hash => !used.has(hash))
  let next = out.join('\n')
  if (orphans.length > 0) {
    const section = [ORPHAN_HEADING, '', ORPHAN_INTRO, '']
    for (const hash of orphans) {
      const note = annotations.get(hash)
      section.push(`- [${note.checked ? 'x' : ' '}] \`${hash}\` ${note.title}`, ...note.notes)
    }
    next = `${next.trimEnd()}\n\n${section.join('\n')}\n`
  }
  return { text: next, restored: used.size, orphans }
}

/** 去掉勾选状态、备注和 orphan 一节，只留脚本生成的内容，供 `--check` 比较。 */
export function stripAnnotations(text) {
  const lines = text.split('\n')
  const orphanAt = orphanSectionStart(lines)
  const kept = orphanAt === -1 ? lines : lines.slice(0, orphanAt)
  const out = []
  let cursor = 0
  for (const block of entryBlocks(kept)) {
    out.push(...kept.slice(cursor, block.start))
    out.push(kept[block.start].replace(/^- \[x\]/i, '- [ ]'))
    out.push(...kept.slice(block.start + 1, block.end).filter(line => GENERATED_ITEM.test(line)))
    cursor = block.end
  }
  out.push(...kept.slice(cursor))
  const joined = out.join('\n')
  return orphanAt === -1 ? joined : `${joined.trimEnd()}\n`
}
