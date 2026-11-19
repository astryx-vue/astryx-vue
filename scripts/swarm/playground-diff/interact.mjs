/**
 * 采集前在预览 iframe 里按步骤点击，两边点同样的东西，比对交互之后的画面
 * （切 tab、向导下一步、展开折叠、打开对话框）。
 */

const SETTLE_MS = 800
const CLICK_TIMEOUT_MS = 5000

/**
 * 两边同一个控件的角色不一定一样（原版有的 tab 是普通 button），所以按顺序退：
 * 指定角色 → button → 可见文字。取第一个能找到的。
 */
async function locate(frame, step) {
  const name = step.role ? step.name : step.text
  const candidates = [
    step.role && frame.getByRole(step.role, { name, exact: true }),
    frame.getByRole('button', { name, exact: true }),
    frame.getByText(name, { exact: true }),
  ].filter(Boolean)
  for (const locator of candidates) {
    if (await locator.count() > 0)
      return locator.first()
  }
  return candidates[0].first()
}

// eslint-disable-next-line unicorn/prefer-dom-node-text-content -- 只要渲染出来、看得见的文字
const PAGE_TEXT = () => document.body.innerText.replace(/\s+/g, ' ')

/**
 * 依次点击；某一步找不到就抛错，并说明是哪一边、哪一步。
 * 返回点完之后页面文字有没有变：没变说明这一步只是滚动或者没点中，比对结果和首屏一样，不能当新画面。
 */
export async function runClicks(frame, clicks, side) {
  if (!clicks.length)
    return false
  const before = await frame.evaluate(PAGE_TEXT)
  for (const step of clicks) {
    const label = step.role ? `${step.role}:${step.name}` : step.text
    try {
      await (await locate(frame, step)).click({ timeout: CLICK_TIMEOUT_MS })
    }
    catch (error) {
      throw new Error(`${side}点不到「${label}」：${error.message.split('\n')[0]}`)
    }
    await frame.page().waitForTimeout(SETTLE_MS)
  }
  return before !== await frame.evaluate(PAGE_TEXT)
}
