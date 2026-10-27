/**
 * 把 axe 的原始结果整理成 report.json 和 report.md。
 *
 * 计数口径：一条「违规」是某一页、某种颜色模式下的一条 axe 规则（不按节点数）。
 * 节点数单独记，方便看一条规则在页面上波及多少元素。
 */

export const IMPACTS = ['critical', 'serious', 'moderate', 'minor']

/** axe 的一条违规里我们要留下的字段。节点只留选择器和简短说明，避免报告过大。 */
export function slimViolation(violation, maxNodes = 5) {
  return {
    id: violation.id,
    impact: violation.impact ?? 'minor',
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodeCount: violation.nodes.length,
    nodes: violation.nodes.slice(0, maxNodes).map(node => ({
      target: node.target.map(part => (Array.isArray(part) ? part.join(' >>> ') : String(part))),
      summary: (node.failureSummary ?? '').split('\n').map(line => line.trim()).filter(Boolean).slice(0, 3).join(' '),
    })),
  }
}

function countBy(items, keyOf) {
  const counts = new Map()
  for (const item of items)
    counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1)
  return counts
}

function sortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
}

/**
 * 汇总。
 * @param {{ slug: string, scheme: string, violations: ReturnType<typeof slimViolation>[], error?: string }[]} pages 每页每种模式的结果
 */
export function summarizeScan(pages) {
  const ok = pages.filter(page => page.error == null)
  const flat = ok.flatMap(page => page.violations.map(v => ({ ...v, slug: page.slug, scheme: page.scheme })))
  const byImpact = Object.fromEntries(IMPACTS.map(impact => [impact, flat.filter(v => v.impact === impact).length]))
  const byRule = sortedEntries(countBy(flat, v => v.id)).map(([id, count]) => {
    const sample = flat.find(v => v.id === id)
    return { id, impact: sample.impact, help: sample.help, count, slugs: [...new Set(flat.filter(v => v.id === id).map(v => v.slug))].sort() }
  })
  const byComponent = sortedEntries(countBy(flat, v => v.slug)).map(([slug, count]) => ({
    slug,
    count,
    rules: [...new Set(flat.filter(v => v.slug === slug).map(v => v.id))].sort(),
  }))
  const lightKeys = new Set(flat.filter(v => v.scheme === 'light').map(v => `${v.slug} ${v.id}`))
  const darkOnly = [...new Set(flat.filter(v => v.scheme === 'dark').map(v => `${v.slug} ${v.id}`))].filter(key => !lightKeys.has(key)).sort()
  const darkKeys = new Set(flat.filter(v => v.scheme === 'dark').map(v => `${v.slug} ${v.id}`))
  const lightOnly = [...lightKeys].filter(key => !darkKeys.has(key)).sort()
  return {
    pages: new Set(pages.map(page => page.slug)).size,
    scans: pages.length,
    failedScans: pages.filter(page => page.error != null).map(page => ({ slug: page.slug, scheme: page.scheme, error: page.error })),
    violations: flat.length,
    nodes: flat.reduce((sum, v) => sum + v.nodeCount, 0),
    byScheme: Object.fromEntries(['light', 'dark'].map(scheme => [scheme, flat.filter(v => v.scheme === scheme).length])),
    byImpact,
    byRule,
    byComponent,
    darkOnly,
    lightOnly,
  }
}

export function buildReportJson(meta, pages, comparison) {
  return { ...meta, summary: summarizeScan(pages), comparison, pages }
}

function table(header, rows) {
  return [`| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`, ...rows.map(row => `| ${row.join(' | ')} |`)].join('\n')
}

export function buildReportMd(report) {
  const s = report.summary
  const lines = [
    '# 组件示例区可访问性扫描',
    '',
    `- 时间：${report.finishedAt}`,
    `- 站点：${report.origin}`,
    `- 范围：${s.pages} 个组件页 × ${report.schemes.join('、')}，共 ${s.scans} 次扫描，只扫 \`${report.include}\` 里的内容`,
    `- axe-core ${report.axeVersion}，规则标签：${report.tags.join(', ')}`,
    `- 违规：${s.violations} 条（页 × 模式 × 规则），涉及 ${s.nodes} 个节点；浅色 ${s.byScheme.light}，深色 ${s.byScheme.dark}`,
    `- 影响级别：${IMPACTS.map(impact => `${impact} ${s.byImpact[impact]}`).join('，')}`,
  ]
  if (s.failedScans.length > 0)
    lines.push(`- **扫描失败 ${s.failedScans.length} 次**：${s.failedScans.map(f => `${f.slug}/${f.scheme}`).join('、')}`)
  if (report.comparison) {
    const c = report.comparison
    lines.push(`- 名单对照：新出现 ${c.added.length}，已消失 ${c.resolved.length}，仍在 ${c.kept.length}`)
  }
  lines.push('', '## 按规则', '', table(['规则', '影响', '违规数', '组件数', '说明'], s.byRule.map(r => [`\`${r.id}\``, r.impact, r.count, r.slugs.length, r.help])))
  lines.push('', '## 深色模式独有', '', s.darkOnly.length === 0 ? '无。' : s.darkOnly.map(key => `- \`${key}\``).join('\n'))
  lines.push('', '## 浅色模式独有', '', s.lightOnly.length === 0 ? '无。' : s.lightOnly.map(key => `- \`${key}\``).join('\n'))
  lines.push('', '## 按组件', '', table(['组件', '违规数', '规则'], s.byComponent.map(c => [c.slug, c.count, c.rules.map(r => `\`${r}\``).join(' ')])))
  return `${lines.join('\n')}\n`
}
