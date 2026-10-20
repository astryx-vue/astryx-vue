/**
 * 在浏览器里打开一个组件页，切到指定颜色模式，只对组件示例区跑 axe。
 *
 * 示例区：文档站里每个示例都由 `VueDemoHost.vue` 渲染成 `.astryx-demo`，包括顶部预览舞台
 * （`.component-detail__stage`，也就是视觉对照截的那块）和下面的每个示例。
 * 侧栏、导航、标题、说明和代码标签页都不在范围里。
 *
 * 规则：跑 axe 的全部规则，关掉和上游 `.github/scripts/accessibility-audit.js` 一样的 5 条页面级规则。
 */
import { AxeBuilder } from '@axe-core/playwright'
import { slimViolation } from './report.mjs'

export const DEMO_SELECTOR = '.astryx-demo'

/** 上游审计也关掉的页面级规则：示例只是页面片段，不负责这些。 */
export const DISABLED_RULES = ['html-has-lang', 'document-title', 'landmark-one-main', 'page-has-heading-one', 'region']

const FREEZE_CSS = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
const NAV_TIMEOUT_MS = 90_000
const READY_TIMEOUT_MS = 30_000

/** 文档站的深浅色由 localStorage 决定，页面脚本跑之前写好。 */
function setAppearance(scheme) {
  try {
    localStorage.setItem('vitepress-theme-appearance', scheme)
  }
  catch {}
}

/** 页面正文出来了，并且每个示例都已经渲染出内容。 */
function demosReady({ selector }) {
  if (document.querySelector('.NotFound'))
    return 'missing'
  if (!document.querySelector('.component-detail__body'))
    return false
  return [...document.querySelectorAll(selector)].every(demo => demo.childElementCount > 0 || (demo.textContent ?? '').trim() !== '')
}

async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: NAV_TIMEOUT_MS }).catch(() => {})
  await page.addStyleTag({ content: FREEZE_CSS })
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  try {
    await page.mouse.move(-1, -1)
  }
  catch {}
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
}

/**
 * 扫一个组件页的一种颜色模式。
 * @param {import('playwright').BrowserContext} context 已经设好 colorScheme 的上下文
 * @returns {Promise<{ slug: string, scheme: string, demos: number, violations: object[], error?: string }>} 这一页的结果
 */
export async function scanPage(context, { slug, url, scheme }) {
  const page = await context.newPage()
  try {
    await page.addInitScript(setAppearance, scheme)
    const response = await page.goto(url, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS })
    if (response && response.status() >= 400)
      throw new Error(`页面返回 HTTP ${response.status()}`)
    const ready = await page.waitForFunction(demosReady, { selector: DEMO_SELECTOR }, { timeout: READY_TIMEOUT_MS, polling: 200 })
      .then(handle => handle.jsonValue())
    if (ready === 'missing')
      throw new Error('页面不存在')
    await settle(page)
    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    if (dark !== (scheme === 'dark'))
      throw new Error(`页面没有切到 ${scheme}（html.dark=${dark}）`)
    const demos = await page.locator(DEMO_SELECTOR).count()
    if (demos === 0)
      return { slug, scheme, demos, violations: [] }
    const results = await new AxeBuilder({ page }).include(DEMO_SELECTOR).disableRules(DISABLED_RULES).analyze()
    const violations = results.violations.map(violation => slimViolation(violation)).sort((a, b) => (a.id < b.id ? -1 : 1))
    return { slug, scheme, demos, violations }
  }
  catch (error) {
    return { slug, scheme, demos: 0, violations: [], error: error.message.split('\n')[0] }
  }
  finally {
    await page.close().catch(() => {})
  }
}
