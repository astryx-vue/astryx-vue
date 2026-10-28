/**
 * 打开演练场的原版和本地预览，等到预览 iframe 真的渲染完再交出去。
 *
 * 原版的节奏：页面先出现编辑器骨架，预览 iframe 也先挂一个空壳，
 * 大约十几秒后才编译完、把 iframe 里的内容换掉。所以「渲染完了」不能只看
 * iframe 存在，要看主页面不再显示 Building、而且 iframe 里的文字元素连续两次
 * 采样一样多。
 */
import { chromium } from 'playwright'

export const VIEWPORT = { width: 1440, height: 900 }
/** 原版站点只能走代理；本地地址要绕过代理。 */
export const PROXY = { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' }
export const LOAD_TIMEOUT_MS = 90_000

/** 预览 iframe 的地址两边分别是 /playground/frame 和 /playground/preview。 */
export function previewFrame(page) {
  return page.frames().find(frame => frame !== page.mainFrame() && /\/playground\/(?:frame|preview)/.test(frame.url()))
}

/** 预览 iframe 里「有直系文字、又看得见」的元素个数，用来判断渲染到哪一步了。 */
export function COUNT_TEXT_ELEMENTS() {
  const TEXT_NODE = 3
  let texts = 0
  for (const el of document.body.querySelectorAll('*')) {
    if (['SCRIPT', 'STYLE', 'LINK', 'META'].includes(el.tagName) || el.closest('svg'))
      continue
    const hasText = [...el.childNodes].some(node => node.nodeType === TEXT_NODE && node.textContent.trim())
    if (!hasText)
      continue
    const style = getComputedStyle(el)
    if (style.display === 'none' || style.visibility === 'hidden')
      continue
    texts += 1
  }
  return { texts, elements: document.body.querySelectorAll('*').length }
}

/** 轮询到预览稳定为止，返回那个 iframe。超时就抛错，调用方据此退出。 */
export async function waitForStablePreview(page, { timeoutMs = LOAD_TIMEOUT_MS } = {}) {
  const deadline = Date.now() + timeoutMs
  let lastElements = -1
  let lastTexts = 0
  let frame = null
  while (Date.now() < deadline) {
    frame = previewFrame(page) ?? frame
    if (frame) {
      const info = await frame.evaluate(COUNT_TEXT_ELEMENTS).catch(() => null)
      if (info) {
        const building = await page.evaluate(() => document.body.textContent.includes('Building')).catch(() => true)
        if (!building && info.texts >= 3 && info.elements === lastElements && info.texts === lastTexts)
          return frame
        lastElements = info.elements
        lastTexts = info.texts
      }
    }
    await new Promise(resolve => setTimeout(resolve, 700))
  }
  if (!frame)
    throw new Error('没有找到预览 iframe')
  throw new Error(`等了 ${Math.round(timeoutMs / 1000)} 秒还没渲染完（最后看到 ${lastTexts} 个文字元素、${lastElements} 个元素）`)
}

/**
 * 打开一侧（原版或本地）。local 为真时把 Vitepress 的外观切到对应颜色模式，
 * 否则靠 colorScheme 让原版自己跟随。
 *
 * 原版站点偶尔会卡在加载上（网络或编译排队），所以打不开时再试一次，不要直接挂。
 */
export async function openSide(browser, url, { scheme, local, settleMs = 1200, attempts = 2 }) {
  const context = await browser.newContext({ viewport: VIEWPORT, colorScheme: scheme })
  if (local)
    await context.addInitScript(mode => localStorage.setItem('vitepress-theme-appearance', mode), scheme)
  const page = await context.newPage()
  let lastError = null
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: LOAD_TIMEOUT_MS })
      const frame = await waitForStablePreview(page)
      // 采到一半还在动的话位置会飘，给字体替换和入场动画一点时间。
      await page.waitForTimeout(settleMs)
      return { context, page, frame }
    }
    catch (error) {
      lastError = error
      if (attempt < attempts)
        await page.waitForTimeout(2000)
    }
  }
  await context.close()
  throw lastError
}

/** 起一个带代理的 Chromium。 */
export async function launchBrowser() {
  return chromium.launch({ proxy: PROXY })
}
