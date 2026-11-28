#!/usr/bin/env node
/**
 * 文档站版面巡检：在几种视口宽度下打开组件总览和每个组件详情页，量出示例「实际画出来」的范围，
 * 找出溢出、贴边、偏离中心的总览卡片和详情页顶部展示区。
 *
 * 用法：先起文档站（pnpm -C apps/docs exec kawapress dev --port 5180），再运行
 *   node scripts/docs-layout-audit.mjs [--base http://localhost:5180] [--widths 1400,768,375]
 *                                      [--only cards|stages] [--slugs a,b,c] [--concurrency 4]
 * 有问题时逐条列出并以退出码 1 结束。
 */
import process from 'node:process'
import { parseArgs } from 'node:util'
import { chromium } from 'playwright'

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: 'http://localhost:5180' },
    widths: { type: 'string', default: '1400,768,375' },
    only: { type: 'string' },
    slugs: { type: 'string' },
    concurrency: { type: 'string', default: '4' },
  },
})

/** 偏离中心超过这么多像素算歪。 */
const CENTER_TOLERANCE = 8
/** 卡片内容离边缘至少留这么多像素。 */
const CARD_MIN_GUTTER = 8
const SETTLE_MS = 1200
const RECHECK_MS = 2500

/**
 * 在页面里运行：返回 root 内所有画出东西的元素（文字、底色、边框、阴影、图片、svg）合起来的外框，
 * 已裁掉滚动容器和 overflow 祖先挡住的部分。和 apps/docs 的 visibleBounds.ts 同一口径，
 * 这里独立实现一份，巡检不依赖被检查的代码。
 */
function measureInPage(rootSelector) {
  const HIDDEN = '.astryx-visually-hidden, [hidden]'
  const MEDIA = new Set(['svg', 'IMG', 'CANVAS', 'VIDEO', 'INPUT', 'TEXTAREA', 'IFRAME'])
  const paints = (el, s) => MEDIA.has(el.tagName)
    || s.backgroundColor !== 'rgba(0, 0, 0, 0)' || s.backgroundImage !== 'none' || s.boxShadow !== 'none'
    || (s.borderStyle !== 'none' && Number.parseFloat(s.borderWidth) > 0)
    || [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
  const union = (a, b) => (a == null || b == null) ? (a ?? b) : { l: Math.min(a.l, b.l), t: Math.min(a.t, b.t), r: Math.max(a.r, b.r), b: Math.max(a.b, b.b) }
  const clipTo = (box, clip) => clip == null ? box : { l: Math.max(box.l, clip.l), t: Math.max(box.t, clip.t), r: Math.min(box.r, clip.r), b: Math.min(box.b, clip.b) }
  // 透明、隐藏的子树整棵跳过；overflow 不可见的元素把子孙裁到自己的范围内。
  const walk = (el, clip) => {
    if (el.matches(HIDDEN))
      return null
    const s = getComputedStyle(el)
    if (s.display === 'none' || s.opacity === '0')
      return null
    const r = el.getBoundingClientRect()
    const own = { l: r.left, t: r.top, r: r.right, b: r.bottom }
    let box = null
    if (s.display !== 'contents' && s.visibility !== 'hidden' && paints(el, s)) {
      const c = clipTo(own, clip)
      if (c.r - c.l >= 1 && c.b - c.t >= 1)
        box = c
    }
    let childClip = clip
    if (s.overflowX !== 'visible' || s.overflowY !== 'visible') {
      const x = s.overflowX !== 'visible'
      const y = s.overflowY !== 'visible'
      childClip = clipTo({ l: x ? own.l : -Infinity, r: x ? own.r : Infinity, t: y ? own.t : -Infinity, b: y ? own.b : Infinity }, clip)
    }
    for (const child of el.children)
      box = union(box, walk(child, childClip))
    return box
  }
  const bounds = root => [...root.children].reduce((box, child) => union(box, walk(child, null)), null)
  return [...document.querySelectorAll(rootSelector)].map((root) => {
    const area = root.getBoundingClientRect()
    const box = bounds(root)
    const name = root.closest('.component-card')?.querySelector('.component-card__name')?.textContent ?? ''
    if (box == null)
      return { name, empty: true }
    return {
      name,
      left: box.l - area.left,
      right: area.right - box.r,
      top: box.t - area.top,
      bottom: area.bottom - box.b,
      scrollsX: root.scrollWidth > root.clientWidth + 1 && getComputedStyle(root).overflowX !== 'hidden',
    }
  })
}

function judge(m, minGutter) {
  if (m.empty)
    return 'empty'
  const problems = []
  // 能横向滚动的区域，内容本来就可以比它宽，横向只看纵向的边距。
  const edge = m.scrollsX ? Math.min(m.top, m.bottom) : Math.min(m.left, m.right, m.top, m.bottom)
  if (edge < -1)
    problems.push('overflow')
  else if (edge < minGutter)
    problems.push('tight')
  if (!m.scrollsX && Math.abs(m.left - m.right) > CENTER_TOLERANCE)
    problems.push(m.left > m.right ? 'leans-right' : 'leans-left')
  if (Math.abs(m.top - m.bottom) > CENTER_TOLERANCE)
    problems.push(m.top > m.bottom ? 'leans-down' : 'leans-up')
  return problems.join(',')
}

const round = m => ['left', 'right', 'top', 'bottom'].map(k => Math.round(m[k] ?? 0)).join('/')

/** 开发服务器按需编译，第一次打开某页可能很慢：只等 DOM 就绪，超时再试一次。 */
async function open(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  }
  catch {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  }
  await settle(page)
}

async function settle(page) {
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.evaluate(() => document.fonts?.ready)
  await page.waitForTimeout(SETTLE_MS)
}

async function auditCards(context, width, findings) {
  const page = await context.newPage()
  await open(page, `${args.base}/components`)
  // 卡片懒加载或在视口外时也要量：逐屏滚一遍，让每张卡片都完成适配。
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
      scrollTo(0, y)
      await new Promise(r => setTimeout(r, 120))
    }
  })
  await page.waitForTimeout(SETTLE_MS)
  const slugs = await page.$$eval('a.component-card__name', links => links.map(a => a.getAttribute('href')))
  for (const m of await page.evaluate(measureInPage, '.component-card__frame')) {
    const verdict = judge(m, CARD_MIN_GUTTER)
    if (verdict)
      findings.push(`${width}px 总览卡片「${m.name}」 ${verdict} (左/右/上/下 ${round(m)})`)
  }
  await page.close()
  return slugs.filter(href => href?.startsWith('/components/'))
}

async function auditStage(context, width, href, findings) {
  const page = await context.newPage()
  try {
    await open(page, `${args.base}${href}`)
    let bad = (await page.evaluate(measureInPage, '.component-detail__stage')).filter(m => judge(m, 0))
    // 机器忙时页面的适配可能还没跑完：有问题就等一会儿再量一次，两次都不对才算。
    if (bad.length > 0) {
      await page.waitForTimeout(RECHECK_MS)
      bad = (await page.evaluate(measureInPage, '.component-detail__stage')).filter(m => judge(m, 0))
    }
    for (const m of bad)
      findings.push(`${width}px 详情页 ${href} ${judge(m, 0)} (左/右/上/下 ${round(m)})`)
  }
  catch (error) {
    findings.push(`${width}px 详情页 ${href} 打不开：${error.message.split('\n')[0]}`)
  }
  finally {
    await page.close()
  }
}

async function main() {
  const widths = args.widths.split(',').map(Number)
  const browser = await chromium.launch()
  const findings = []
  try {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'dark' })
      const findingsBefore = findings.length
      let slugs = await auditCards(context, width, args.only === 'stages' ? [] : findings)
      if (args.slugs)
        slugs = args.slugs.split(',').map(s => `/components/${s}`)
      if (args.only !== 'cards') {
        const queue = [...slugs]
        const workers = Array.from({ length: Number(args.concurrency) }, async () => {
          for (let href = queue.shift(); href != null; href = queue.shift())
            await auditStage(context, width, href, findings)
        })
        await Promise.all(workers)
      }
      await context.close()
      console.log(`${width}px：查了 ${slugs.length} 个详情页，发现 ${findings.length - findingsBefore} 处问题`)
    }
  }
  finally {
    await browser.close()
  }
  for (const line of findings)
    console.log(line)
  process.exitCode = findings.length > 0 ? 1 : 0
}

await main()
