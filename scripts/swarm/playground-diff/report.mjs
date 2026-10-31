/**
 * 把对比结果渲染成人看的文本。纯函数，测试可以直接喂构造好的结果。
 */
import { attributeLabel, bandLabel } from './compare.mjs'

const MAX_LINES = 60

/** 一条偏差写一行：「文字」属性：原版值 → 我们的值。 */
export function formatDeviation(entry, index) {
  if (entry.kind === 'missing' || entry.kind === 'dynamic-missing')
    return `${index}. 「${entry.text}」缺失：原版有（${entry.upstream}），我们这边没有${entry.dynamic ? '（疑似动态文本）' : ''}`
  if (entry.kind === 'extra' || entry.kind === 'dynamic-extra')
    return `${index}. 「${entry.text}」多余：我们有（${entry.ours}），原版没有${entry.dynamic ? '（疑似动态文本）' : ''}`
  const axis = entry.attribute === 'position' || entry.attribute === 'size' ? ` ${entry.detail}` : ''
  return `${index}. 「${entry.text}」${attributeLabel(entry.attribute)}${axis}：原版 ${entry.upstream} → 我们 ${entry.ours}`
}

/** 纵向每 100px 一段的偏差分布，返回若干行。 */
export function formatBands(bands) {
  if (!bands.length)
    return ['  所有分段都没有偏差']
  return bands.map(band => `  ${bandLabel(band.start)}：${band.count}`)
}

/**
 * 渲染整份报告。
 * meta: { slug, scheme, port, upstreamUrl, ourUrl, maxDeviations }
 * result: compareSides 的返回值
 */
export function renderReport(meta, result) {
  const lines = []
  lines.push(`演练场对比：${meta.slug} · ${meta.scheme} · 本地端口 ${meta.port}`)
  lines.push(`  原版 ${meta.upstreamUrl}`)
  lines.push(`  我们 ${meta.ourUrl}`)
  lines.push(`配成 ${result.pairCount} 对元素；偏差 ${result.deviationCount} 个，其中缺失 ${result.missingCount}、多余 ${result.extraCount}`)
  if (result.dynamicMissingCount || result.dynamicExtraCount)
    lines.push(`  疑似动态文本（两边的数据本来就不同，不计入偏差）：缺失 ${result.dynamicMissingCount}、多余 ${result.dynamicExtraCount}`)
  lines.push('')
  if (!result.deviations.length) {
    lines.push('偏差列表：没有')
  }
  else {
    lines.push('偏差列表（按影响从大到小）：')
    const shown = result.deviations.slice(0, MAX_LINES)
    for (const [index, entry] of shown.entries())
      lines.push(`  ${formatDeviation(entry, index + 1)}`)
    if (result.deviations.length > shown.length)
      lines.push(`  ……还有 ${result.deviations.length - shown.length} 条，用 --json 看全量`)
  }
  lines.push('')
  lines.push('纵向分布（每 100px）：')
  lines.push(...formatBands(result.bands))
  lines.push('')
  const passed = result.deviationCount <= meta.maxDeviations && result.staticMissingCount === 0
  lines.push(passed
    ? `结论：通过（偏差 ${result.deviationCount} ≤ ${meta.maxDeviations}，无缺失）`
    : `结论：不通过（门槛：偏差 ≤ ${meta.maxDeviations} 且无缺失；现在偏差 ${result.deviationCount}，缺失 ${result.staticMissingCount}）`)
  return `${lines.join('\n')}\n`
}

/** 写进 --json 的完整结果，去掉只给报告排序用的字段。 */
export function buildJsonPayload(meta, result) {
  return {
    tool: 'playground-diff',
    slug: meta.slug,
    scheme: meta.scheme,
    port: meta.port,
    upstreamUrl: meta.upstreamUrl,
    ourUrl: meta.ourUrl,
    generatedAt: new Date().toISOString(),
    maxDeviations: meta.maxDeviations,
    pairCount: result.pairCount,
    deviationCount: result.deviationCount,
    missingCount: result.missingCount,
    extraCount: result.extraCount,
    staticMissingCount: result.staticMissingCount,
    dynamicMissingCount: result.dynamicMissingCount,
    dynamicExtraCount: result.dynamicExtraCount,
    passed: result.deviationCount <= meta.maxDeviations && result.staticMissingCount === 0,
    deviations: result.deviations.map(entry => ({
      kind: entry.kind,
      text: entry.text,
      node: entry.node ?? null,
      attribute: entry.attribute,
      upstream: entry.upstream,
      ours: entry.ours,
      difference: Math.round(entry.difference * 100) / 100,
      dynamic: Boolean(entry.dynamic),
      y: entry.y,
    })),
    bands: result.bands,
    collect: meta.collect ?? null,
  }
}
