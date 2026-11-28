// 读写待同步清单（docs/upstream-sync/pending.md）：列出没勾的条目、按结果批量勾选、统计进度。
// 条目格式见 render.mjs：`- [ ] [\`<9 位哈希>\`](链接) 标题`，备注是条目下缩进两格的行。

const ITEM = /^- \[([ xX])\] \[`([0-9a-f]{9})`\]\([^)]*\) (.*)$/
const STATUSES = ['已移植', 'Vue 版已有', '不适用', '暂缓']

/** 把清单拆成行，并找出每个条目所在的组件族、行号和已有备注的范围。 */
export function parseChecklist(markdown) {
  const lines = markdown.split('\n')
  const entries = []
  let heading = ''
  let current = null
  lines.forEach((line, index) => {
    if (line.startsWith('## '))
      heading = line
    const match = ITEM.exec(line)
    if (match) {
      current = { heading, hash: match[2], subject: match[3], checked: match[1] !== ' ', line: index, end: index }
      entries.push(current)
    }
    else if (current && line.startsWith('  ') && line.trim()) {
      current.end = index
    }
    else {
      current = null
    }
  })
  return { lines, entries }
}

/** `## 标题（area:x）` 这一行是否属于给定标题的组件族。 */
export function headingMatches(heading, title) {
  return heading === `## ${title}` || heading.startsWith(`## ${title}（`)
}

/**
 * 解析结果文件：每行 `<哈希> | <结论> | <说明>`。结论以「已移植 / Vue 版已有 / 不适用 / 暂缓」开头，
 * 「已移植 #123」这样带 PR 号的写法原样保留。空行和 `#` 开头的行跳过。
 */
export function parseResults(text) {
  const results = []
  const problems = []
  for (const [index, raw] of text.split('\n').entries()) {
    const line = raw.trim()
    if (!line || line.startsWith('#'))
      continue
    const [hash = '', status = '', ...rest] = line.split('|').map(part => part.trim())
    const kind = STATUSES.find(name => status.startsWith(name))
    if (!/^[0-9a-f]{7,40}$/.test(hash) || !kind) {
      problems.push(`第 ${index + 1} 行看不懂：${line}`)
      continue
    }
    results.push({ hash: hash.slice(0, 9), status, kind, note: rest.join(' | ') })
  }
  return { results, problems }
}

function noteLine({ status, note }) {
  const pr = status.match(/#(\d+)/)
  const label = pr ? status.replace(/#\d+/, '').trim() : status
  const link = pr ? `[#${pr[1]}](https://github.com/astryx-vue/astryx-vue/pull/${pr[1]})。` : ''
  return `  - ${label}：${link}${note}`
}

/**
 * 把结果写回清单。默认处理这个哈希在所有组件族里没勾的条目；给了 `family` 只处理那个族。
 * 「暂缓」只加备注不打勾。已经勾过的条目不动。返回新清单和每条结果命中的条目数。
 */
export function applyResults(markdown, results, { family } = {}) {
  const { lines, entries } = parseChecklist(markdown)
  const inserts = new Map()
  const hits = new Map()
  for (const result of results) {
    const targets = entries.filter(entry => entry.hash === result.hash && !entry.checked
      && (!family || headingMatches(entry.heading, family)))
    hits.set(result.hash, (hits.get(result.hash) ?? 0) + targets.length)
    for (const entry of targets) {
      if (result.kind !== '暂缓') {
        lines[entry.line] = lines[entry.line].replace('- [ ]', '- [x]')
        entry.checked = true
      }
      inserts.set(entry.end, [...(inserts.get(entry.end) ?? []), noteLine(result)])
    }
  }
  const output = []
  lines.forEach((line, index) => {
    output.push(line)
    output.push(...(inserts.get(index) ?? []))
  })
  return { markdown: output.join('\n'), hits }
}

/** 每个组件族的进度：标题、已勾、没勾。 */
export function familyProgress(markdown) {
  const progress = new Map()
  for (const entry of parseChecklist(markdown).entries) {
    const item = progress.get(entry.heading) ?? { heading: entry.heading, done: 0, open: 0 }
    item[entry.checked ? 'done' : 'open'] += 1
    progress.set(entry.heading, item)
  }
  return [...progress.values()]
}
