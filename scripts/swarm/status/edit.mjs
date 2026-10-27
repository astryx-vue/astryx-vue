/**
 * 改写 ROADMAP 里一个节点的状态和总表字段。
 *
 * 只动两类行：mindmap 里这个节点那一行的 emoji，以及总表里这个节点那一行。
 * 节点变成「已完成」或「不做」后，依赖已经全部结束的「未开始」下游节点一并改成「可开工」，
 * 同样只动它们各自的两行。
 *
 * 写出前做三道自检，任何一道不过都抛错、不返回新文本：
 * 1. 新旧文本行数相同，变化的行恰好是计划要改的那些行；
 * 2. 重新解析新文本，目标节点的状态和字段和要求的一致；
 * 3. 新文本跑一遍 check，不能出现改之前没有的问题。
 */
import { buildGraph, checkRoadmap, depsResolved } from './model.mjs'
import { COLUMN_FIELDS, formatRow, formatStateCell, parseRoadmap } from './roadmap.mjs'
import { isAllowedTransition, isResolved, stateByEmoji, stateByKey } from './states.mjs'

/** set 可以改的总表字段：命令行选项名 → 字段名。 */
export const EDITABLE_FIELDS = Object.freeze({ round: 'round', impl: 'impl', verify: 'verify', result: 'result', pr: 'pr' })

export class StatusEditError extends Error {}

/** 表格单元格不能换行，`|` 要转义，否则会把一行切成更多列。 */
export function sanitizeCell(value) {
  const text = String(value).trim()
  if (/[\r\n]/.test(text))
    throw new StatusEditError(`单元格内容不能换行：${JSON.stringify(text)}`)
  return text.replace(/(?<!\\)\|/g, '\\|')
}

function rowCells(row, overrides) {
  return COLUMN_FIELDS.map(field => (field in overrides ? overrides[field] : row[field]))
}

function replaceEmoji(line, node, emoji) {
  return `${line.slice(0, node.emojiStart)}${emoji}${line.slice(node.emojiEnd)}`
}

/** 把一个节点改成 state，并覆盖 fields 里给出的总表字段。直接改 lines，返回改过的行号。 */
function applyNode(lines, node, state, fields) {
  const changed = []
  const mindLine = replaceEmoji(lines[node.mind.line], node.mind, state.emoji)
  if (mindLine !== lines[node.mind.line]) {
    lines[node.mind.line] = mindLine
    changed.push(node.mind.line)
  }
  const tableLine = formatRow(rowCells(node.row, { ...fields, state: formatStateCell(state) }))
  if (tableLine !== lines[node.row.line]) {
    lines[node.row.line] = tableLine
    changed.push(node.row.line)
  }
  return changed
}

function assertOnlyLinesChanged(before, after, expected) {
  if (before.length !== after.length)
    throw new StatusEditError(`自检失败：行数从 ${before.length} 变成了 ${after.length}`)
  const allowed = new Set(expected)
  for (let i = 0; i < before.length; i++) {
    if (before[i] !== after[i] && !allowed.has(i))
      throw new StatusEditError(`自检失败：第 ${i + 1} 行不该变却变了`)
  }
}

function assertNodeWritten(roadmap, id, state, fields) {
  const node = buildGraph(roadmap).get(id)
  if (node?.state !== state || !node.mind || stateByEmoji(node.mind.emoji) !== state)
    throw new StatusEditError(`自检失败：${id} 改写后读回来的状态不是 ${state.name}`)
  for (const [field, value] of Object.entries(fields)) {
    if (node.row[field] !== value)
      throw new StatusEditError(`自检失败：${id} 的 ${field} 读回来是「${node.row[field]}」，应该是「${value}」`)
  }
}

/**
 * 计算改写结果，不写盘。
 * @param {string} text ROADMAP 原文
 * @param {{ id: string, state: object, fields?: Record<string, string>, force?: boolean }} change
 *   state 来自 states.mjs；fields 的键是 EDITABLE_FIELDS 的值；force 跳过流转合规和新增问题检查
 * @returns {{ text: string, changedLines: number[], unlocked: string[], warnings: object[] }}
 *   新文本、变化的行号（从 0 开始）、被自动改成可开工的节点、改之前就存在的问题
 */
export function planSet(text, { id, state, fields = {}, force = false }) {
  const roadmap = parseRoadmap(text)
  const before = checkRoadmap(roadmap)
  const nodes = buildGraph(roadmap)
  const node = nodes.get(id)
  if (!node)
    throw new StatusEditError(`总表里没有节点 ${id}`)
  if (!node.mind)
    throw new StatusEditError(`进度树状图里没有节点 ${id}，先修好 ROADMAP 再改状态`)
  if (!node.state)
    throw new StatusEditError(`${id} 现在的状态「${node.row.state}」看不懂，先手动修好`)
  if (!force && !isAllowedTransition(node.state, state))
    throw new StatusEditError(`${id} 不能从「${node.state.name}」直接改成「${state.name}」，确实要改请加 --force`)
  if (!force && state.key !== 'not-started' && state.key !== 'skipped' && !depsResolved(node, nodes)) {
    const pending = node.deps.filter(dep => !isResolved(nodes.get(dep).state ?? stateByKey('not-started')))
    throw new StatusEditError(`${id} 的依赖 ${pending.join('、')} 还没完成，不能改成「${state.name}」`)
  }
  const cleanFields = Object.fromEntries(Object.entries(fields).map(([field, value]) => [field, sanitizeCell(value)]))

  const lines = [...roadmap.lines]
  const changedLines = applyNode(lines, node, state, cleanFields)
  const unlocked = []
  if (isResolved(state) && !isResolved(node.state)) {
    // 用改过的状态重新判断下游：目标节点此刻已经算结束。
    const next = new Map([...nodes].map(([key, value]) => [key, key === id ? { ...value, state } : value]))
    for (const other of next.values()) {
      if (other.state?.key === 'not-started' && other.deps.includes(id) && other.mind && depsResolved(other, next)) {
        changedLines.push(...applyNode(lines, other, stateByKey('ready'), {}))
        unlocked.push(other.id)
      }
    }
  }

  assertOnlyLinesChanged(roadmap.lines, lines, changedLines)
  const nextText = lines.join(roadmap.eol)
  const reparsed = parseRoadmap(nextText)
  assertNodeWritten(reparsed, id, state, cleanFields)
  for (const other of unlocked)
    assertNodeWritten(reparsed, other, stateByKey('ready'), {})
  const after = checkRoadmap(reparsed)
  const known = new Set(before.map(p => `${p.id}\u0000${p.message}`))
  const introduced = after.filter(p => !known.has(`${p.id}\u0000${p.message}`))
  if (introduced.length > 0 && !force)
    throw new StatusEditError(`改完以后 check 会多出这些问题，没有写入：\n${introduced.map(p => `  ${p.id}：${p.message}`).join('\n')}`)
  return { text: nextText, changedLines: [...new Set(changedLines)].sort((a, b) => a - b), unlocked, warnings: after }
}
