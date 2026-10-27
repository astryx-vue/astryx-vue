#!/usr/bin/env node
// 截一张演练场模板的左右对照图：左边原版（astryx.atmeta.com），右边我们（本地 preview）。
// 用法：node scripts/swarm/playground-pair.mjs <slug> <light|dark> <本地端口> <输出 png> [滚到这段文字]
// 必须用 browser-lock.mjs 包着跑。本地站点要先 docs:build 再 `pnpm --filter @astryx-vue/docs preview --port <端口>`。
import process from 'node:process'
import { chromium } from 'playwright'

const [slug, scheme = 'light', port = '5171', out, scrollText] = process.argv.slice(2)
if (!slug || !out) {
  console.error('用法：playground-pair.mjs <slug> <light|dark> <本地端口> <输出 png> [滚到这段文字]')
  process.exit(2)
}

const VIEWPORT = { width: 1440, height: 900 }
const PROXY = { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' }

async function shoot(browser, url, local = false) {
  const context = await browser.newContext({ viewport: VIEWPORT, colorScheme: scheme })
  if (local)
    await context.addInitScript(mode => localStorage.setItem('vitepress-theme-appearance', mode), scheme)
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 })
  await page.getByText(/^Building/).waitFor({ state: 'detached', timeout: 60_000 }).catch(() => {})
  for (let attempt = 0; attempt < 40; attempt++) {
    const lengths = await Promise.all(page.frames()
      .filter(frame => frame !== page.mainFrame())
      .map(frame => frame.evaluate(() => (document.body?.textContent ?? '').trim().length).catch(() => 0)))
    if (Math.max(0, ...lengths) > 50)
      break
    await page.waitForTimeout(1000)
  }
  await page.waitForTimeout(2500)
  if (scrollText) {
    for (const frame of page.frames()) {
      const found = await frame.evaluate((text) => {
        const target = [...document.querySelectorAll('body *')]
          .find(element => element.childElementCount === 0 && element.textContent?.trim() === text)
        target?.scrollIntoView({ block: 'start' })
        return target != null
      }, scrollText).catch(() => false)
      if (found)
        break
    }
    await page.waitForTimeout(1200)
  }
  const shot = await page.screenshot()
  await context.close()
  return shot.toString('base64')
}

const browser = await chromium.launch({ proxy: PROXY })
const upstream = await shoot(browser, `https://astryx.atmeta.com/playground?template=${slug}`)
const ours = await shoot(browser, `http://127.0.0.1:${port}/playground/?template=${slug}`, true)

const page = await browser.newPage({ viewport: { width: 2900, height: 960 } })
await page.setContent(`<body style="margin:0;background:#888;font:14px sans-serif">
  <div style="display:flex;gap:20px;padding:10px">
    <div><div>原版 · ${slug} · ${scheme}</div><img style="width:1440px" src="data:image/png;base64,${upstream}"></div>
    <div><div>我们 · ${slug} · ${scheme}</div><img style="width:1440px" src="data:image/png;base64,${ours}"></div>
  </div></body>`)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
console.log('ok', out)
