/**
 * axe 已知问题名单 `scripts/guardrails/a11y-known-issues.json` 的判定。
 *
 * 名单按「组件 slug + 规则 id」记录现有违规，键写成 `<slug> <rule>`，值是一句说明：
 * 由哪个节点负责修、出现在哪些颜色模式。判定只看键，不看值。
 * 和 A3 的 SSR 名单、500 行白名单同一套规矩：
 * - 出现名单外的违规：失败，点名组件和规则；
 * - 名单里的某条这次没出现：失败，提示删掉它，名单只会越来越短；
 * - `--update` 只删已经消失的条目，绝不加新条目。
 *
 * 「消失」只在浅色和深色都扫了的时候判定（名单不分颜色模式），并且只看这次成功扫完的页面；
 * 用 `--only` 只扫一部分页面时，没扫到的页面不算消失。组件页已经不存在的条目也算消失。
 */

/** 违规集合的键。 */
export function issueKey(slug, rule) {
  return `${slug} ${rule}`
}

/**
 * 把扫描结果变成「键 → 出现在哪些颜色模式」。
 * @param {{ slug: string, scheme: string, violations: { id: string }[] }[]} pages 每页每种模式的结果
 * @returns {Map<string, Set<string>>} 违规键到颜色模式集合
 */
export function collectIssues(pages) {
  const issues = new Map()
  for (const page of pages) {
    for (const violation of page.violations) {
      const key = issueKey(page.slug, violation.id)
      if (!issues.has(key))
        issues.set(key, new Set())
      issues.get(key).add(page.scheme)
    }
  }
  return issues
}

/**
 * 对照名单。
 * @param {Map<string, Set<string>>} issues 这次扫出来的违规
 * @param {Record<string, string>} known 名单
 * @param {{ scannedSlugs: string[], allSlugs: string[], bothSchemes: boolean }} scope
 *   scannedSlugs 是浅色、深色都成功扫完的页；allSlugs 是站点上现有的全部组件页
 * @returns {{ added: string[], resolved: string[], kept: string[] }} 新出现、已消失、仍在的键
 */
export function compareWithKnown(issues, known, { scannedSlugs, allSlugs, bothSchemes }) {
  const scanned = new Set(scannedSlugs)
  const existing = new Set(allSlugs)
  const added = [...issues.keys()].filter(key => !(key in known)).sort()
  const kept = [...issues.keys()].filter(key => key in known).sort()
  const resolved = Object.keys(known)
    .filter(key => !issues.has(key))
    .filter((key) => {
      const slug = key.split(' ')[0]
      return !existing.has(slug) || (bothSchemes && scanned.has(slug))
    })
    .sort()
  return { added, resolved, kept }
}

/**
 * `--update`：只删已经消失的条目，返回新名单。不会加入新违规。
 * @param {Record<string, string>} known 现有名单
 * @param {string[]} resolved 已经消失的键
 * @returns {Record<string, string>} 收紧后的名单，键排好序
 */
export function tightenKnown(known, resolved) {
  const drop = new Set(resolved)
  return Object.fromEntries(Object.entries(known).filter(([key]) => !drop.has(key)).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
}

/**
 * 第一次建名单时用：把这次扫到的全部违规写成名单，说明里写上出现在哪些模式。
 * 只在名单文件还不存在时使用。
 */
export function seedKnown(issues) {
  return Object.fromEntries([...issues.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, schemes]) => [key, `基线：${[...schemes].sort().join('、')}`]))
}

/** 判定结果的文字说明，失败时打印。 */
export function describeComparison({ added, resolved }) {
  const lines = []
  if (added.length > 0) {
    lines.push(`出现了名单外的 ${added.length} 条可访问性问题（组件 规则）：`)
    lines.push(...added.map(key => `  + ${key}`))
    lines.push('请修好它们。确实要暂缓的，需要在评审里说明理由后手动加进名单。')
  }
  if (resolved.length > 0) {
    lines.push(`名单里有 ${resolved.length} 条已经不再出现，请删掉（可以跑 pnpm a11y --update）：`)
    lines.push(...resolved.map(key => `  - ${key}`))
  }
  return lines.join('\n')
}
