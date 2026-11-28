#!/usr/bin/env node
/**
 * lab 样式顺序巡检：lab 和 core 的样式在同一个 @layer 里，lab 覆盖 core 组件默认样式的规则
 * 如果优先级和 core 一样，就只能靠「写在后面」取胜，core 样式一旦后引入就会被悄悄盖掉。
 *
 * 做法：在文档站每个 lab 详情页上，把示例里所有元素的计算样式记三次——原样一次、把 lab 样式表
 * 挪到最后一次、挪回原位再一次。第一次和第三次相同、第二次不同的属性，就是靠引入顺序才生效
 * （或失效）的 lab 规则；三次比较能排除媒体加载、计时器这类自己会变的状态。
 *
 * 用法：先起文档站开发服务器（样式表要是 Vite 开发模式下按文件分开的 <style>），再运行
 *   node scripts/lab-cascade-audit.mjs [--base http://localhost:5180] [--slugs audio-player,tour]
 * 有冲突时逐条列出并以退出码 1 结束。
 */
import process from 'node:process'
import { parseArgs } from 'node:util'
import { chromium } from 'playwright'

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: 'http://localhost:5180' },
    slugs: { type: 'string' },
  },
})

const SETTLE_MS = 2000

/** 在页面里运行：比较 lab 样式表挪到最后前后的计算样式，返回只因顺序改变的属性。 */
async function auditInPage() {
  // 尺寸、位置一类属性是别的属性变化的连带结果，不单独报。
  const DERIVED = /^(?:--|transition|animation|width|height|inline-size|block-size|perspective-origin|transform-origin|right|left|top|bottom|inset-|min-inline|min-block|max-inline|max-block|padding-inline|padding-block|margin-(?:inline|block|left|right|top|bottom)|overflow-(?:inline|block)|border-(?:start|end))/
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  const freeze = document.createElement('style')
  freeze.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'
  document.head.append(freeze)
  await frame()

  const elements = [...document.querySelectorAll('.lab-demo, .lab-demo *')]
  const snapshot = () => elements.map((element) => {
    const style = getComputedStyle(element)
    const values = {}
    for (let index = 0; index < style.length; index++)
      values[style[index]] = style.getPropertyValue(style[index])
    return values
  })

  const sheets = [...document.querySelectorAll('style[data-vite-dev-id*="/packages/lab/"]')]
  const markers = sheets.map((sheet) => {
    const marker = document.createComment('lab-cascade-audit')
    sheet.before(marker)
    return marker
  })
  const before = snapshot()
  sheets.forEach(sheet => document.head.append(sheet))
  await frame()
  const moved = snapshot()
  sheets.forEach((sheet, index) => markers[index].replaceWith(sheet))
  await frame()
  const after = snapshot()
  freeze.remove()

  const found = new Set()
  elements.forEach((element, index) => {
    for (const property in moved[index]) {
      const original = before[index][property]
      if (DERIVED.test(property) || original !== after[index][property] || original === moved[index][property])
        continue
      const classes = (element.className.baseVal ?? element.className).toString().split(' ').filter(name => name.startsWith('astryx')).slice(0, 3).join('.')
      found.add(`${classes || element.tagName.toLowerCase()} | ${property}: ${original} → ${moved[index][property]}`)
    }
  })
  return { sheets: sheets.length, elements: elements.length, conflicts: [...found] }
}

async function labSlugs(page) {
  if (args.slugs)
    return args.slugs.split(',').map(slug => slug.trim()).filter(Boolean)
  await page.goto(`${args.base}/components`, { waitUntil: 'networkidle' })
  const hrefs = await page.$$eval('a[href^="/lab/"]', links => links.map(link => link.getAttribute('href')))
  return [...new Set(hrefs.map(href => href.replace(/^\/lab\/|\/$/g, '')).filter(Boolean))]
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, colorScheme: 'dark' })
let failures = 0
try {
  for (const slug of await labSlugs(page)) {
    await page.goto(`${args.base}/lab/${slug}/`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(SETTLE_MS)
    const result = await page.evaluate(auditInPage)
    if (result.sheets === 0) {
      console.error(`${slug}: 没找到按文件分开的 lab 样式表，要在开发服务器上运行。`)
      failures++
      continue
    }
    if (result.conflicts.length === 0)
      continue
    failures += result.conflicts.length
    console.log(`\n${slug}`)
    for (const conflict of result.conflicts)
      console.log(`  ${conflict}`)
  }
}
finally {
  await browser.close()
}

console.log(failures === 0 ? 'lab 样式不依赖引入顺序。' : `\n共 ${failures} 处依赖引入顺序。`)
process.exitCode = failures === 0 ? 0 : 1
