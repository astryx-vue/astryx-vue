#!/usr/bin/env node
/**
 * 把 CI 视觉对照的结果（summary.json，内含各组件的 report.json）写成一条 PR 评论的 Markdown。
 *
 * buildVisualComment 是纯函数：不读文件、不碰网络，测试直接喂数据。
 * 命令行：node scripts/swarm/visual-comment.mjs --summary <summary.json> [--artifact-url <url>] [--run-url <url>] [--out <file>]
 *   没有要跑的组件时不会有 summary.json，改传 --plan <plan.json>，生成「没有改到组件」的短评论。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { COMBOS } from './visual-compare/names.mjs'

/** 隐藏标记。workflow 靠它找到这个 PR 上的旧评论并原地更新。 */
export const COMMENT_MARKER = '<!-- astryx-visual-compare -->'

const COMBO_NAMES = Object.keys(COMBOS)
const VERDICT_SHORT = Object.freeze({ same: '一致', review: '看图', different: '不同' })
const MAX_REASON_LENGTH = 300

// Playwright 的报错带终端颜色控制符，在评论里会变成乱码。
// eslint-disable-next-line no-control-regex
const ANSI_ESCAPE = /\u001B\[[0-9;]*m/g

/** 失败原因压成一行：去掉颜色控制符，合并空白，太长就截断。 */
export function oneLine(text) {
  const flat = String(text ?? '').replace(ANSI_ESCAPE, '').replace(/\s+/g, ' ').trim()
  return flat.length > MAX_REASON_LENGTH ? `${flat.slice(0, MAX_REASON_LENGTH)}…` : flat
}

function names(list) {
  return list.map(n => `\`${n}\``).join('、')
}

/** 预览区尺寸差换成 CSS 像素：窄屏截图是 2 倍像素，除回去才能和桌面端放在一起看。 */
function fmtDelta(entry) {
  const scale = entry.deviceScaleFactor || 1
  const w = Math.round(entry.sizeDelta.width / scale)
  const h = Math.round(entry.sizeDelta.height / scale)
  if (w === 0 && h === 0)
    return '尺寸相同'
  const sign = v => (v > 0 ? `+${v}` : String(v))
  return `宽 ${sign(w)}，高 ${sign(h)}`
}

function comboCell(entry) {
  if (!entry)
    return '-'
  if (!entry.ok)
    return '失败'
  const score = entry.score
    ? `${entry.score.contentDiffPercent}% ${VERDICT_SHORT[entry.score.verdict] ?? ''}`.trim()
    : '已截图'
  return `${score}<br>${fmtDelta(entry)}`
}

function scoreRow(result) {
  const byCombo = Object.fromEntries((result.report?.combos ?? []).map(c => [c.combo, c]))
  const cells = result.report
    ? COMBO_NAMES.map(combo => comboCell(byCombo[combo]))
    : COMBO_NAMES.map(() => '没跑成')
  return `| ${result.component} | ${cells.join(' | ')} |`
}

/**
 * @param {object} input
 * @param {{ components: string[], skipped: string[], broadFiles: string[], source?: string }} input.plan changed-components 的结果
 * @param {Array<{ component: string, status: 'ran' | 'preflight' | 'crashed', reason?: string, report?: object }>} input.results 每个组件的运行结果
 * @param {string} [input.artifactUrl] 对照图附件的下载地址
 * @param {string} [input.runUrl] 这次 workflow 运行的地址
 * @param {number} [input.retentionDays] 附件保留天数
 * @param {string[]} [input.representative] 代表组件名单，公共文件触发时写进说明
 * @returns {string} 评论 Markdown，第一行是 COMMENT_MARKER
 */
export function buildVisualComment({ plan, results, artifactUrl, runUrl, retentionDays = 14, representative = [] }) {
  const lines = [COMMENT_MARKER, '## 视觉对照：上游 vs 我们', '']

  if (plan.components.length === 0) {
    lines.push('这次的改动没有涉及有文档页的组件，没有跑视觉对照。')
    if (runUrl)
      lines.push('', `运行记录：${runUrl}`)
    return `${lines.join('\n')}\n`
  }

  lines.push(
    '这条评论只报告差异，**不会让 CI 变红**。',
    '',
    '- 分数是「内容区里不同像素的百分比」：低于 2% 基本一致，2% 到 10% 要看图，高于 10% 明显不同。最终以看图为准，两边 demo 文案不同也会拉高分数。',
    '- 分数下面是预览区的尺寸差：我们减上游，单位是 CSS 像素。',
    '',
    `| 组件 | ${COMBO_NAMES.join(' | ')} |`,
    `| --- | ${COMBO_NAMES.map(() => '---').join(' | ')} |`,
    ...results.map(scoreRow),
    '',
  )

  if (artifactUrl)
    lines.push(`对照图：[下载附件](${artifactUrl})（保留 ${retentionDays} 天，要登录 GitHub 才能下载）。每个组件一个目录，\`side-by-side.png\` 左边是上游，右边是我们。`)
  else
    lines.push('对照图附件没有上传成功，请到运行记录里看日志。')
  if (runUrl)
    lines.push('', `运行记录：${runUrl}`)
  lines.push('')

  const notRun = results.filter(r => !r.report)
  if (notRun.length > 0) {
    lines.push('### 没跑成的组件', '')
    for (const r of notRun) {
      const kind = r.status === 'crashed' ? '对照工具出错' : '跳过'
      lines.push(`- \`${r.component}\`（${kind}）：${oneLine(r.reason)}`)
    }
    lines.push('')
  }

  const failedCombos = results.flatMap(r => (r.report?.combos ?? []).filter(c => !c.ok).map(c => ({ component: r.component, ...c })))
  if (failedCombos.length > 0) {
    lines.push('### 截图失败的组合', '')
    for (const c of failedCombos)
      lines.push(`- \`${c.component}\` ${c.combo}：${oneLine(c.error)}`)
    lines.push('')
  }

  if (plan.skipped.length > 0) {
    lines.push(
      '### 这次没跑',
      '',
      `一次最多跑 ${plan.components.length} 个组件，下面这些这次没跑：${names(plan.skipped)}。`,
      '需要的话，在 Actions 页面手动运行「Visual Compare」，把组件名填进去。',
      '',
    )
  }

  if (plan.broadFiles.length > 0) {
    lines.push(
      '### 为什么跑了代表组件',
      '',
      `下面这些文件会影响很多组件，所以改跑一组代表组件${representative.length > 0 ? `（${names(representative)}）` : ''}：`,
      '',
      ...plan.broadFiles.map(f => `- \`${f}\``),
      '',
    )
  }

  return `${lines.join('\n')}\n`
}

function main() {
  const { values } = parseArgs({
    options: {
      'summary': { type: 'string' },
      'plan': { type: 'string' },
      'artifact-url': { type: 'string' },
      'run-url': { type: 'string' },
      'out': { type: 'string' },
    },
  })
  if (!values.summary && !values.plan)
    throw new Error('需要 --summary <summary.json> 或 --plan <plan.json>')
  const readJson = file => JSON.parse(readFileSync(resolve(file), 'utf8'))
  const summary = values.summary ? readJson(values.summary) : { plan: readJson(values.plan), results: [] }
  const markdown = buildVisualComment({
    plan: summary.plan,
    results: summary.results,
    representative: summary.representative,
    artifactUrl: values['artifact-url'] || undefined,
    runUrl: values['run-url'] || undefined,
  })
  if (values.out)
    writeFileSync(resolve(values.out), markdown)
  else
    process.stdout.write(markdown)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]))
  main()
