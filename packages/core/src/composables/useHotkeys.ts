import type { MaybeRefOrGetter } from 'vue'
import { onMounted, onScopeDispose, toValue } from 'vue'

/** 一条全局快捷键。 */
export interface Hotkey {
  /**
   * 组合键，例如 `mod+k`、`shift+/`、`escape`。
   * `mod` 在苹果平台是 Meta，其他平台是 Ctrl。
   * 没写 `shift` 时不检查 Shift，这样字母键不区分大小写。
   */
  keys: string
  /** 命中后调用。事件的默认行为会被阻止。 */
  onPress: (event: KeyboardEvent) => void
  /** 焦点在输入控件里时也触发。 @default false */
  allowInInputs?: boolean
  /** 暂时停用，不必卸掉监听。 */
  isDisabled?: boolean
}

const KEY_ALIASES: Record<string, string> = {
  down: 'arrowdown',
  esc: 'escape',
  left: 'arrowleft',
  plus: '+',
  return: 'enter',
  right: 'arrowright',
  space: ' ',
  up: 'arrowup',
}

function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined')
    return false
  const uaData = 'userAgentData' in navigator ? navigator.userAgentData : null
  if (uaData && typeof uaData === 'object' && 'platform' in uaData)
    return /mac/i.test((uaData as { platform: string }).platform ?? '')
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform ?? '')
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  if (target.isContentEditable)
    return true
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

function matchesCombo(keys: string, event: KeyboardEvent, isApple: boolean): boolean {
  const parts = keys.toLowerCase().split('+').map(part => part.trim()).filter(Boolean)
  if (parts.length === 0)
    return false

  const key = parts[parts.length - 1] ?? ''
  const mods = new Set(parts.slice(0, -1))
  const wantsMod = mods.has('mod')
  const wantsCtrl = mods.has('ctrl') || (wantsMod && !isApple)
  const wantsMeta = mods.has('meta') || (wantsMod && isApple)
  const wantsAlt = mods.has('alt')
  const wantsShift = mods.has('shift')

  if (event.ctrlKey !== wantsCtrl || event.metaKey !== wantsMeta || event.altKey !== wantsAlt)
    return false
  if (wantsShift && !event.shiftKey)
    return false

  const expected = KEY_ALIASES[key] ?? key
  return event.key.toLowerCase() === expected
}

/**
 * 在 window 上注册一组快捷键。传入 getter 或 computed 时，每次按键都读最新的一组。
 * 单字符快捷键容易误触，调用方需要提供关闭、改键，或只在组件聚焦时启用。
 */
export function useHotkeys(hotkeys: MaybeRefOrGetter<readonly Hotkey[]>): void {
  const isApple = isApplePlatform()

  function onKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented)
      return
    const typing = isTypingTarget(event.target)
    for (const hotkey of toValue(hotkeys)) {
      if (hotkey.isDisabled)
        continue
      if (typing && !hotkey.allowInInputs)
        continue
      if (!matchesCombo(hotkey.keys, event, isApple))
        continue
      event.preventDefault()
      hotkey.onPress(event)
      return
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onScopeDispose(() => {
    if (typeof window !== 'undefined')
      window.removeEventListener('keydown', onKeyDown)
  })
}
