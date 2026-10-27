import { describe, expect, it } from 'vitest'
import { buildVisualComment, COMMENT_MARKER, oneLine } from '../scripts/swarm/visual-comment.mjs'

function okCombo(combo: string, contentDiffPercent: number, verdict: string, sizeDelta = { width: 0, height: 0 }, deviceScaleFactor = 1) {
  return {
    combo,
    ok: true,
    deviceScaleFactor,
    sizeDelta,
    upstream: { width: 800, height: 400 },
    ours: { width: 800 + sizeDelta.width, height: 400 + sizeDelta.height },
    score: { contentDiffPercent, diffPercent: contentDiffPercent / 10, verdict },
  }
}

const buttonReport = {
  component: 'Button',
  combos: [
    okCombo('desktop-light', 1.2, 'same'),
    okCombo('desktop-dark', 5.5, 'review', { width: 0, height: -24 }),
    okCombo('mobile-light', 61.3, 'different', { width: 0, height: 48 }, 2),
    { combo: 'mobile-dark', ok: false, error: 'ours 页面没有切到 dark：\n页面标记=light' },
  ],
}

const plan = { components: ['Button', 'Badge', 'NoSuch'], skipped: [], broadFiles: [], source: 'files' }

function comment(overrides: Record<string, unknown> = {}) {
  return buildVisualComment({
    plan,
    results: [
      { component: 'Button', status: 'ran', report: buttonReport },
      { component: 'Badge', status: 'crashed', reason: '退出码 1，没有生成 report.json' },
      { component: 'NoSuch', status: 'preflight', reason: '上游没有这个页面（HTTP 404）：https://astryx.atmeta.com/components/NoSuch' },
    ],
    artifactUrl: 'https://github.com/o/r/actions/runs/1/artifacts/2',
    runUrl: 'https://github.com/o/r/actions/runs/1',
    ...overrides,
  })
}

describe('视觉对照评论', () => {
  it('第一行是隐藏标记', () => {
    expect(comment().split('\n')[0]).toBe(COMMENT_MARKER)
    expect(COMMENT_MARKER).toMatch(/^<!--.*-->$/)
  })

  it('分数表：每个组件一行，四种组合各一列，带分数、结论和 CSS 像素的尺寸差', () => {
    const md = comment()
    expect(md).toContain('| 组件 | desktop-light | desktop-dark | mobile-light | mobile-dark |')
    expect(md).toContain('| Button | 1.2% 一致<br>尺寸相同 | 5.5% 看图<br>宽 0，高 -24 | 61.3% 不同<br>宽 0，高 +24 | 失败 |')
    expect(md).toContain('| Badge | 没跑成 | 没跑成 | 没跑成 | 没跑成 |')
    expect(md).toContain('| NoSuch | 没跑成 | 没跑成 | 没跑成 | 没跑成 |')
    expect(md).toContain('不会让 CI 变红')
  })

  it('附件链接和运行记录', () => {
    const md = comment()
    expect(md).toContain('[下载附件](https://github.com/o/r/actions/runs/1/artifacts/2')
    expect(md).toContain('保留 14 天')
    expect(md).toContain('运行记录：https://github.com/o/r/actions/runs/1')
  })

  it('附件没传上去时说明原因', () => {
    const md = comment({ artifactUrl: undefined })
    expect(md).not.toContain('下载附件')
    expect(md).toContain('对照图附件没有上传成功')
  })

  it('列出没跑成的组件和截图失败的组合，原因压成一行', () => {
    const md = comment()
    expect(md).toContain('### 没跑成的组件')
    expect(md).toContain('- `Badge`（对照工具出错）：退出码 1，没有生成 report.json')
    expect(md).toContain('- `NoSuch`（跳过）：上游没有这个页面（HTTP 404）')
    expect(md).toContain('### 截图失败的组合')
    expect(md).toContain('- `Button` mobile-dark：ours 页面没有切到 dark： 页面标记=light')
  })

  it('失败原因里的终端颜色控制符会去掉', () => {
    expect(oneLine('page.goto: Timeout\nCall log:\n\u001B[2m  - navigating\u001B[22m\n')).toBe('page.goto: Timeout Call log: - navigating')
  })

  it('过长的失败原因会截断', () => {
    const long = 'x'.repeat(1000)
    const md = buildVisualComment({
      plan: { components: ['A'], skipped: [], broadFiles: [] },
      results: [{ component: 'A', status: 'crashed', reason: long }],
    })
    expect(md).toContain(`${'x'.repeat(300)}…`)
    expect(md).not.toContain('x'.repeat(301))
  })

  it('列出这次没跑的组件', () => {
    const md = comment({ plan: { ...plan, skipped: ['Link', 'Spinner'] } })
    expect(md).toContain('### 这次没跑')
    expect(md).toContain('`Link`、`Spinner`')
  })

  it('没有截断、没有失败时不出现对应小节', () => {
    const md = buildVisualComment({
      plan: { components: ['Button'], skipped: [], broadFiles: [] },
      results: [{ component: 'Button', status: 'ran', report: { combos: [okCombo('desktop-light', 0, 'same')] } }],
    })
    expect(md).not.toContain('### 没跑成的组件')
    expect(md).not.toContain('### 截图失败的组合')
    expect(md).not.toContain('### 这次没跑')
    expect(md).not.toContain('### 为什么跑了代表组件')
    expect(md).toContain('| Button | 0% 一致<br>尺寸相同 | - | - | - |')
  })

  it('公共文件触发时说明原因并列出代表组件', () => {
    const md = comment({
      plan: { ...plan, broadFiles: ['packages/themes/neutral.css'] },
      representative: ['Button', 'Table'],
    })
    expect(md).toContain('### 为什么跑了代表组件')
    expect(md).toContain('（`Button`、`Table`）')
    expect(md).toContain('- `packages/themes/neutral.css`')
  })

  it('整页模式没有分数时显示「已截图」', () => {
    const entry = { ...okCombo('desktop-light', 0, 'same'), score: undefined }
    const md = buildVisualComment({
      plan: { components: ['Button'], skipped: [], broadFiles: [] },
      results: [{ component: 'Button', status: 'ran', report: { combos: [entry] } }],
    })
    expect(md).toContain('| Button | 已截图<br>尺寸相同 |')
  })

  it('没有组件时只写一句话，仍带标记', () => {
    const md = buildVisualComment({ plan: { components: [], skipped: [], broadFiles: [] }, results: [] })
    expect(md.startsWith(`${COMMENT_MARKER}\n`)).toBe(true)
    expect(md).toContain('没有跑视觉对照')
    expect(md).not.toContain('| 组件 |')
  })
})
