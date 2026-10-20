/**
 * 生成 report.json 和 report.md。只拼数据，不读写文件。
 */
import { relative } from 'node:path'
import { PIXEL_THRESHOLD, SCORE_DIFFERENT, SCORE_SAME, VERDICT_TEXT } from './image.mjs'

/** 尺寸差：ours 减 upstream，单位是截图像素。 */
export function sizeDelta(upstream, ours) {
  return { width: ours.width - upstream.width, height: ours.height - upstream.height }
}

/**
 * @param {object} meta { component, slug, section, urls, startedAt, finishedAt, toolVersion, playwrightVersion }
 * @param {Array<object>} results 每个组合一项：{ combo, ok, error?, upstream?, ours?, score?, files? }
 */
export function buildReportJson(meta, results) {
  return {
    tool: { name: 'visual-compare', version: meta.toolVersion, playwright: meta.playwrightVersion },
    component: meta.component,
    slug: meta.slug,
    section: meta.section,
    urls: meta.urls,
    startedAt: meta.startedAt,
    finishedAt: meta.finishedAt,
    scoring: meta.section === 'overview'
      ? { pixelThreshold: PIXEL_THRESHOLD, samePercentBelow: SCORE_SAME, differentPercentAbove: SCORE_DIFFERENT }
      : null,
    combos: results,
  }
}

function fmtSize(size) {
  return `${size.width}×${size.height}`
}

function fmtDelta(delta) {
  const sign = v => (v > 0 ? `+${v}` : String(v))
  return delta.width === 0 && delta.height === 0 ? '相同' : `宽 ${sign(delta.width)}，高 ${sign(delta.height)}`
}

/** 人读的摘要，图片用相对 report.md 的路径。 */
export function buildReportMd(report, componentDir) {
  const lines = [
    `# ${report.component} 视觉对照`,
    '',
    `- 上游：${report.urls.upstream}`,
    `- 我们：${report.urls.ours}`,
    `- 截取范围：${report.section === 'overview' ? '预览区（overview）' : '整页（all，不算分）'}`,
    `- 时间：${report.startedAt}`,
    '',
  ]
  if (report.section === 'overview') {
    lines.push(
      '两个分数都是「不同像素的百分比」，只是分母不同：',
      '',
      '- 内容区：分母是两边组件内容所在矩形的并集，不受大片空白背景影响。结论按它给。',
      '- 整图：分母是补白对齐后的整张画布。尺寸不同时补白区域全部算差异，所以它也反映尺寸差。',
      '',
      `内容区低于 ${SCORE_SAME}% 算「基本一致」，${SCORE_SAME}%~${SCORE_DIFFERENT}% 要看图判断，高于 ${SCORE_DIFFERENT}% 算「明显不同」。`
      + '分数只是提示，最终以看图为准。',
      '',
      '「组件尺寸」是预览区里组件内容的外接框（上游 / 我们），窗屏组合是 2 倍像素。',
      '',
      '| 组合 | 内容区 | 整图 | 结论 | 上游预览区 | 我们预览区 | 预览区尺寸差 | 组件尺寸 |',
      '| --- | --- | --- | --- | --- | --- | --- | --- |',
    )
    for (const r of report.combos) {
      if (!r.ok) {
        lines.push(`| ${r.combo} | - | - | 失败 | - | - | - | - |`)
        continue
      }
      const box = b => (b ? fmtSize(b) : '空')
      const content = 'upstreamContentBox' in r.score ? `${box(r.score.upstreamContentBox)} / ${box(r.score.oursContentBox)}` : '-'
      lines.push(`| ${r.combo} | ${r.score.contentDiffPercent}% | ${r.score.diffPercent}% | ${VERDICT_TEXT[r.score.verdict]} | ${fmtSize(r.upstream)} | ${fmtSize(r.ours)} | ${fmtDelta(r.sizeDelta)} | ${content} |`)
    }
    lines.push('')
  }
  for (const r of report.combos) {
    lines.push(`## ${r.combo}`, '')
    if (!r.ok) {
      lines.push(`失败：${r.error}`, '')
      continue
    }
    if (report.section === 'all')
      lines.push(`上游 ${fmtSize(r.upstream)}，我们 ${fmtSize(r.ours)}（${fmtDelta(r.sizeDelta)}）`, '')
    const rel = file => relative(componentDir, file).split('\\').join('/')
    lines.push(`![${r.combo} 左上游 右我们](${rel(r.files.sideBySide)})`, '')
    if (r.files.diff)
      lines.push(`差异图：[diff.png](${rel(r.files.diff)})`, '')
  }
  return `${lines.join('\n')}\n`
}
