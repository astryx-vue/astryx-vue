/**
 * 全库唯一的平台判断：当前是不是 macOS / iOS。
 * `useHotkeys` 用它决定 `mod` 是 ⌘ 还是 Ctrl，`Kbd` 用它决定显示哪个符号，
 * 两边读的是同一个答案，显示的快捷键和真正生效的快捷键不会对不上。
 */

interface UserAgentData {
  platform?: unknown
}

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: UserAgentData
}

/** 平台判断的三种答案。`unknown` 表示这条信号说不出来，不等于「不是苹果」。 */
export type PlatformAnswer = 'apple' | 'other' | 'unknown'

/**
 * 只读 User-Agent Client Hints。
 *
 * 空字符串（改写过客户端标识的浏览器会给这个）和规范自己的哨兵值 `Unknown`
 * 都算「没回答」，不能当成「不是苹果」。
 */
export function readClientHintsPlatform(userAgentData: UserAgentData | null | undefined): PlatformAnswer {
  const raw = userAgentData?.platform
  const named = typeof raw === 'string' ? raw.trim() : ''
  if (named === '' || named.toLowerCase() === 'unknown')
    return 'unknown'
  return /mac/i.test(named) ? 'apple' : 'other'
}

/**
 * 当前是不是 Apple 平台。
 *
 * 先看 Client Hints；它说不出来时，退回 `navigator.platform`（已废弃但到处都有）。
 * 服务端没有 navigator，答 false。
 */
export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined')
    return false
  const hinted = readClientHintsPlatform((navigator as NavigatorWithUserAgentData).userAgentData)
  if (hinted !== 'unknown')
    return hinted === 'apple'
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform ?? '')
}
