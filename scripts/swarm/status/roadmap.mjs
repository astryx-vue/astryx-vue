/**
 * 读懂 ROADMAP.md 里和节点状态有关的两块：
 *
 * - 「全局进度树状图」的 mermaid mindmap：每个节点一行 `<emoji> <ID> <名称>`，按「阶段 X」分组。
 * - 「当前状态总表」：每个节点一行，九列。
 *
 * 只认这两块，文件其它内容不解析，也不改。解析结果记下每个节点所在的行号，
 * 改写时只替换这些行（见 edit.mjs）。
 */
import { resolveState } from './states.mjs'

export const NODE_ID = /^[A-Z]\d+[a-z]?$/
export const TABLE_HEADING = '## 当前状态总表'
export const TABLE_COLUMNS = Object.freeze(['节点', '名称', '依赖', '状态', '轮次', '实现者', '验收者', '最近验收结论', 'PR'])
/** 总表列名 → 字段名。 */
export const COLUMN_FIELDS = Object.freeze(['id', 'name', 'deps', 'state', 'round', 'impl', 'verify', 'result', 'pr'])

const MINDMAP_NODE = /^(\s+)(\S+) ([A-Z]\d+[a-z]?) (.+)$/
const MINDMAP_PHASE = /^\s+阶段 ([A-Z]) (.+)$/
const MINDMAP_ROOT = /^\s+root\(\(.*\)\)$/

export class RoadmapParseError extends Error {}

/** 按没有转义的 `|` 切开一行表格，去掉首尾空列，每格去掉两侧空白。 */
export function splitRow(line) {
  const trimmed = line.trim()
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|'))
    return null
  return trimmed.slice(1, -1).split(/(?<!\\)\|/).map(cell => cell.trim())
}

/** 按总表现有的写法拼一行：有内容的格两边各一个空格，空格子写成 `| |`。 */
export function formatRow(cells) {
  return `|${cells.map(cell => (cell === '' ? ' ' : ` ${cell} `)).join('|')}|`
}

function findMindmap(lines) {
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].trim() === '```mermaid' && lines[i + 1].trim() === 'mindmap') {
      const end = lines.findIndex((line, j) => j > i + 1 && line.trim() === '```')
      if (end === -1)
        throw new RoadmapParseError(`第 ${i + 1} 行的 mindmap 代码块没有结束`)
      return { start: i + 2, end }
    }
  }
  throw new RoadmapParseError('找不到 mermaid mindmap 代码块')
}

function parseMindmap(lines) {
  const { start, end } = findMindmap(lines)
  const nodes = []
  const phases = []
  let phase = null
  for (let i = start; i < end; i++) {
    const line = lines[i]
    if (line.trim() === '' || MINDMAP_ROOT.test(line))
      continue
    const phaseMatch = MINDMAP_PHASE.exec(line)
    if (phaseMatch) {
      phase = { letter: phaseMatch[1], title: `阶段 ${phaseMatch[1]} ${phaseMatch[2]}`.trim() }
      phases.push(phase)
      continue
    }
    const nodeMatch = MINDMAP_NODE.exec(line)
    if (!nodeMatch || !phase)
      throw new RoadmapParseError(`第 ${i + 1} 行的 mindmap 内容看不懂：${line.trim()}`)
    const [, indent, emoji, id, name] = nodeMatch
    nodes.push({ id, emoji, name, line: i, phase: phase.letter, emojiStart: indent.length, emojiEnd: indent.length + emoji.length })
  }
  return { nodes, phases }
}

function parseTable(lines) {
  const heading = lines.findIndex(line => line.trim() === TABLE_HEADING)
  if (heading === -1)
    throw new RoadmapParseError(`找不到「${TABLE_HEADING}」`)
  const header = lines.findIndex((line, i) => i > heading && line.trim().startsWith('|'))
  const columns = header === -1 ? null : splitRow(lines[header])
  if (!columns || columns.join() !== TABLE_COLUMNS.join())
    throw new RoadmapParseError(`总表表头应该是 ${formatRow(TABLE_COLUMNS)}`)
  const rows = []
  for (let i = header + 2; i < lines.length && lines[i].trim().startsWith('|'); i++) {
    const cells = splitRow(lines[i])
    if (cells.length !== TABLE_COLUMNS.length)
      throw new RoadmapParseError(`第 ${i + 1} 行有 ${cells.length} 列，总表需要 ${TABLE_COLUMNS.length} 列`)
    const row = Object.fromEntries(COLUMN_FIELDS.map((field, index) => [field, cells[index]]))
    rows.push({ ...row, line: i, raw: lines[i] })
  }
  return { header, rows }
}

/**
 * 解析整份 ROADMAP。格式不对时抛 RoadmapParseError。
 * @returns {{ lines: string[], eol: string, mindmap: object[], phases: object[], table: object[] }} 解析结果
 */
export function parseRoadmap(text) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n'
  const lines = text.split(eol)
  const { nodes, phases } = parseMindmap(lines)
  const { rows } = parseTable(lines)
  return { lines, eol, mindmap: nodes, phases, table: rows }
}

/** 总表「状态」列的写法：`🔷 验收中`。emoji 和名字要对得上同一个状态。 */
export function parseStateCell(cell) {
  const [emoji, ...rest] = cell.split(' ')
  const byEmoji = resolveState(emoji)
  const byName = resolveState(rest.join(' '))
  if (!byEmoji || byEmoji !== byName)
    return undefined
  return byEmoji
}

export function formatStateCell(state) {
  return `${state.emoji} ${state.name}`
}

/**
 * 把依赖列展开成节点 ID 数组，保持写法顺序并去重。
 *
 * - `—` 或空：没有依赖。
 * - `C全部`：所有以 C 开头的节点。
 * - `F3a–F3e`、`C1-C5`：同一前缀下的字母或数字区间，`–` 和 `-` 都认。
 *
 * allIds 是总表里全部节点 ID（按表格顺序）。展开不出来或节点不存在的写法放进 unknown。
 */
export function expandDeps(raw, allIds) {
  const ids = []
  const unknown = []
  const known = new Set(allIds)
  const push = (id) => {
    if (!ids.includes(id))
      ids.push(id)
  }
  const tokens = raw.trim() === '—' ? [] : raw.split(/\s+/).filter(Boolean)
  for (const token of tokens) {
    const all = /^([A-Z])全部$/.exec(token)
    const letters = /^([A-Z]\d*)([a-z])[–-]\1([a-z])$/.exec(token)
    const numbers = /^([A-Z])(\d+)[–-]\1(\d+)$/.exec(token)
    let expanded
    if (all) {
      expanded = allIds.filter(id => id.startsWith(all[1]))
    }
    else if (letters) {
      expanded = []
      for (let code = letters[2].charCodeAt(0); code <= letters[3].charCodeAt(0); code++)
        expanded.push(`${letters[1]}${String.fromCharCode(code)}`)
    }
    else if (numbers) {
      expanded = []
      for (let n = Number(numbers[2]); n <= Number(numbers[3]); n++)
        expanded.push(`${numbers[1]}${n}`)
    }
    else {
      expanded = [token]
    }
    const missing = expanded.filter(id => !known.has(id))
    if (expanded.length === 0 || missing.length > 0) {
      unknown.push(missing.length > 0 && expanded.length > 1 ? `${token}（其中 ${missing.join('、')} 不存在）` : token)
      continue
    }
    expanded.forEach(push)
  }
  return { ids, unknown }
}
