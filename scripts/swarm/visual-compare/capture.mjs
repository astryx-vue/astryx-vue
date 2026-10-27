/**
 * 在浏览器里打开一个页面，切到指定颜色模式，截预览区或整页。
 *
 * 两边站点的差别都收在 SITES 里：怎么切深浅色、怎么找预览区、怎么判断加载完。
 * 找到的预览区会被临时打上 ROOT_ATTR 标记（只在截图用的页面里，不改站点源码），后续定位都用它。
 */
import { backgroundColor, readPng } from './image.mjs'

export const ROOT_ATTR = 'data-visual-compare-root'
const ROOT_SELECTOR = `[${ROOT_ATTR}]`

const FREEZE_CSS = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'
const NAV_TIMEOUT_MS = 60_000
const READY_TIMEOUT_MS = 20_000

/**
 * 上游（Next.js）：深浅色只看系统偏好（prefers-color-scheme），切好后 html 上会有 data-theme。
 * 预览区是 Overview 第一个区块：ComponentPreviewTheme（data-astryx-theme="neutral" 的包裹层）里的 muted Card，
 * 卡片的第一个子元素是带内联 aspect-ratio 或 min-height 的展示舞台。下面的示例区也有同样的包裹层，
 * 所以要求包裹层是父元素的第一个子元素。展示内容懒加载，加载完以前舞台没有 overflow 内联样式。
 */
const UPSTREAM = {
  label: 'upstream',
  previewSelector: '[data-astryx-theme="neutral"]:first-child > .astryx-card:only-child',
  initScript: null,
  modeMarker: () => document.documentElement.getAttribute('data-theme'),
  previewReady: ({ selector, attr }) => {
    const card = [...document.querySelectorAll(selector)].find((el) => {
      const style = el.firstElementChild?.getAttribute('style') ?? ''
      return /aspect-ratio|min-height/.test(style)
    })
    if (!card) {
      // 预览卡片和 Usage 等 h2 在同一次渲染里出来；h2 已有却没有卡片，说明这个组件页没有顶部预览。
      return document.querySelector('h2') ? 'missing' : false
    }
    if (card.textContent?.includes('Preview not available'))
      return 'missing'
    if (card.firstElementChild.style.overflow === '')
      return false
    card.setAttribute(attr, '')
    return true
  },
}

/**
 * 我们（VitePress）：深浅色由 localStorage 的 vitepress-theme-appearance 决定，html 上挂 dark 类。
 * 预览区是 ComponentDocsShell 里的 .component-detail__stage。
 */
const OURS = {
  label: 'ours',
  previewSelector: '.component-detail__stage',
  initScript: (scheme) => {
    try {
      localStorage.setItem('vitepress-theme-appearance', scheme)
    }
    catch {}
  },
  modeMarker: () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'),
  previewReady: ({ selector, attr }) => {
    const stage = document.querySelector(selector)
    if (!stage) {
      if (document.querySelector('.NotFound'))
        return 'missing'
      return document.querySelector('.component-detail__body') ? 'missing' : false
    }
    if (stage.firstElementChild == null)
      return false
    stage.setAttribute(attr, '')
    return true
  },
}

export const SITES = Object.freeze({ upstream: UPSTREAM, ours: OURS })

/** sRGB 相对亮度，0 是黑，1 是白。 */
export function relativeLuminance([r, g, b]) {
  const linear = v => (v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

/** 背景亮度低于这个值算深色。中灰 #777 的亮度约 0.18。 */
export const DARK_LUMINANCE = 0.18

export function schemeFromLuminance(luminance) {
  return luminance < DARK_LUMINANCE ? 'dark' : 'light'
}

/**
 * 检查截图是否真的处于期望的颜色模式：页面标记要对，截图背景色（图片边缘一圈最常见的颜色）亮度也要对。
 * 用截图像素而不是 DOM 计算样式：上游 html/body 背景是透明的，真正的底色画在里层容器上。
 * @returns {{ ok: boolean, marker: string | null, background: number[], luminance: number }} 检查结果
 */
export function checkScheme(marker, png, expected) {
  const background = backgroundColor(png)
  const luminance = Math.round(relativeLuminance(background) * 1000) / 1000
  const ok = marker === expected && schemeFromLuminance(luminance) === expected
  return { ok, marker, background, luminance }
}

async function settle(page) {
  await page.addStyleTag({ content: FREEZE_CSS })
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  await page.waitForLoadState('networkidle', { timeout: NAV_TIMEOUT_MS }).catch(() => {})
  try {
    await page.mouse.move(-1, -1)
  }
  catch {}
  await page.evaluate(() => window.scrollTo(0, 0))
  // 两帧让冻结样式和滚动生效。
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))
}

/**
 * 打开页面并截图。
 * @param {import('playwright').BrowserContext} context
 * @param {{ site: 'upstream' | 'ours', url: string, scheme: 'light' | 'dark', section: 'overview' | 'all' }} options
 * @returns {Promise<{ buffer: Buffer, png: object, scheme: object, url: string }>} PNG 截图、解码后的图和颜色模式检查结果
 */
export async function capturePage(context, { site: siteKey, url, scheme, section }) {
  const site = SITES[siteKey]
  const page = await context.newPage()
  try {
    if (site.initScript)
      await page.addInitScript(site.initScript, scheme)
    const response = await page.goto(url, { waitUntil: 'load', timeout: NAV_TIMEOUT_MS })
    if (response && response.status() >= 400)
      throw new Error(`${site.label} 页面返回 HTTP ${response.status()}：${url}`)

    const selector = section === 'overview' ? ROOT_SELECTOR : null
    const ready = await page.waitForFunction(site.previewReady, { selector: site.previewSelector, attr: ROOT_ATTR }, { timeout: READY_TIMEOUT_MS, polling: 200 })
      .then(handle => handle.jsonValue())
      .catch(() => false)
    if (ready === 'missing' && section === 'overview')
      throw new Error(`${site.label} 页面没有这个组件的预览区：${url}`)
    if (!ready && section === 'overview')
      throw new Error(`${site.label} 页面 ${READY_TIMEOUT_MS / 1000} 秒内没出现预览区（${site.previewSelector}）：${url}`)

    await settle(page)
    const marker = await page.evaluate(site.modeMarker)

    let buffer
    if (selector) {
      // 用整页截图加裁切，而不是元素截图：元素截图会先滚动，吸顶导航可能盖住预览区顶部。
      const box = await page.evaluate((sel) => {
        const r = document.querySelector(sel).getBoundingClientRect()
        return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height }
      }, selector)
      if (box.width < 1 || box.height < 1)
        throw new Error(`${site.label} 预览区尺寸为 0（${selector}）：${url}`)
      buffer = await page.screenshot({ fullPage: true, clip: box, animations: 'disabled', caret: 'hide' })
    }
    else {
      buffer = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' })
    }
    const png = readPng(buffer)
    const schemeCheck = checkScheme(marker, png, scheme)
    if (!schemeCheck.ok) {
      throw new Error(`${site.label} 页面没有切到 ${scheme}：页面标记=${schemeCheck.marker}，`
        + `截图背景 rgb(${schemeCheck.background.join(',')}) 亮度 ${schemeCheck.luminance}（${url}）`)
    }
    return { buffer, png, scheme: schemeCheck, url }
  }
  finally {
    await page.close().catch(() => {})
  }
}
