#!/usr/bin/env node
// 量一个演练场模板在原版和本地预览里的元素几何与样式，并逐项列出差异。
// 用法：node scripts/swarm/playground-measure.mjs <slug> <light|dark> <本地端口> [out.json]
// 必须用 browser-lock.mjs 包着跑。
import fs from 'node:fs'
import process from 'node:process'
import { chromium } from 'playwright'

const [slug, scheme = 'light', port = '5171', out] = process.argv.slice(2)
if (!slug) {
  console.error('用法：playground-measure.mjs <slug> <light|dark> <本地端口> [out.json]')
  process.exit(2)
}
const PROXY = { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' }

// 在预览 iframe 里执行：收集有文字、或是控件的元素。
function collect() {
  const rows = []
  const seen = new Set()
  const walk = (el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden')
      return
    const r = el.getBoundingClientRect()
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim()
    const isCtl = /^(INPUT|TEXTAREA|SELECT|BUTTON|SVG|IMG|HR)$/i.test(el.tagName) || el.getAttribute('role') === 'separator'
    if ((own || isCtl) && r.width > 0 && r.height > 0 && !seen.has(el)) {
      seen.add(el)
      const label = own || el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.tagName.toLowerCase()
      rows.push({
        k: `${el.tagName.toLowerCase()}:${label.slice(0, 40)}`,
        x: Math.round(r.x * 10) / 10,
        y: Math.round((r.y + scrollY) * 10) / 10,
        w: Math.round(r.width * 10) / 10,
        h: Math.round(r.height * 10) / 10,
        fs: cs.fontSize,
        fw: cs.fontWeight,
        c: cs.color,
        bg: cs.backgroundColor,
        br: cs.borderRadius,
        bd: cs.borderTopWidth === '0px' ? '0' : cs.borderTopWidth + ' ' + cs.borderTopColor,
      })
    }
    for (const child of el.children) walk(child)
  }
  walk(document.body)
  return { rows, docH: document.documentElement.scrollHeight }
}

async function grab(browser, url, local) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme })
  if (local)
    await context.addInitScript(m => localStorage.setItem('vitepress-theme-appearance', m), scheme)
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 })
  await page.getByText(/^Building/).waitFor({ state: 'detached', timeout: 60_000 }).catch(() => {})
  let target
  for (let i = 0; i < 70 && !target; i++) {
    for (const f of page.frames().filter(f => f !== page.mainFrame())) {
      const n = await f.evaluate(() => document.querySelectorAll('button, input, h1, h2, h3, a, p').length).catch(() => 0)
      if (n > 1) target = f
    }
    if (!target) await page.waitForTimeout(1000)
  }
  await page.waitForTimeout(2500)
  const data = await target.evaluate(collect)
  await context.close()
  return data
}

const browser = await chromium.launch({ proxy: PROXY })
const up = await grab(browser, `https://astryx.atmeta.com/playground?template=${slug}`, false)
const ours = await grab(browser, `http://127.0.0.1:${port}/playground/?template=${slug}`, true)
await browser.close()
if (out) fs.writeFileSync(out, JSON.stringify({ up, ours }, null, 1))

console.log(`页面高 原版 ${up.docH} / 我们 ${ours.docH}；元素 ${up.rows.length} / ${ours.rows.length}`)
const pool = [...ours.rows]
const fields = ['x', 'y', 'w', 'h', 'fs', 'fw', 'c', 'bg', 'br', 'bd']
for (const u of up.rows) {
  const i = pool.findIndex(o => o.k === u.k)
  if (i < 0) { console.log(`缺失  ${u.k}  @${u.x},${u.y} ${u.w}x${u.h}`); continue }
  const o = pool.splice(i, 1)[0]
  const diffs = fields.filter(f => typeof u[f] === 'number' ? Math.abs(u[f] - o[f]) > 1 : u[f] !== o[f])
    .map(f => `${f}:${u[f]}→${o[f]}`)
  if (diffs.length) console.log(`差异  ${u.k}  ${diffs.join('  ')}`)
}
for (const o of pool) console.log(`多出  ${o.k}  @${o.x},${o.y} ${o.w}x${o.h}`)
