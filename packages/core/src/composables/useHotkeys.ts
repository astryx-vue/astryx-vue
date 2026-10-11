import type { MaybeRefOrGetter } from 'vue'
import { onMounted, onScopeDispose, toValue } from 'vue'
import { isApplePlatform } from '../Kbd/platform.js'

/**
 * 一条全局快捷键。
 *
 * `keys` 用 `+` 串起来，例如 `mod+k`、`shift+/`、`escape`。
 * `mod` 在 Apple 平台是 ⌘，其他平台是 Ctrl，和 Kbd 用同一套平台判断。
 * 没有写 `shift` 时，忽略 shift 状态，所以单个字母不区分大小写。
 * 字面量 `+` 写成 `plus`。
 */
export interface Hotkey {
  keys: string
  /** 命中后调用。事件会被 preventDefault。 */
  onPress: (event: KeyboardEvent) => void
  /**
   * 焦点在输入框、文本域、下拉框或可编辑区域时也触发。
   * @default false
   */
  allowInInputs?: boolean
  /** 暂时停用，不必卸掉监听。 */
  isDisabled?: boolean
}

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  space: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  return: 'enter',
  plus: '+',
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  if (target.isContentEditable)
    return true
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

function isImeKeyEvent(event: KeyboardEvent): boolean {
  return event.isComposing === true || event.key === 'Process' || event.keyCode === 229
}

function matchesCombo(keys: string, event: KeyboardEvent, isApple: boolean): boolean {
  const parts = keys
    .toLowerCase()
    .split('+')
    .map(part => part.trim())
    .filter(Boolean)
  if (parts.length === 0)
    return false

  const key = parts[parts.length - 1] ?? ''
  const mods = new Set(parts.slice(0, -1))
  const wantsMod = mods.has('mod')
  const wantsCtrl = mods.has('ctrl') || (wantsMod && !isApple)
  const wantsMeta = mods.has('meta') || (wantsMod && isApple)
  const wantsAlt = mods.has('alt')
  const wantsShift = mods.has('shift')

  if (event.ctrlKey !== wantsCtrl)
    return false
  if (event.metaKey !== wantsMeta)
    return false
  if (event.altKey !== wantsAlt)
    return false
  if (wantsShift && !event.shiftKey)
    return false

  const expected = KEY_ALIASES[key] ?? key
  return event.key.toLowerCase() === expected
}

/**
 * 对应原版 Astryx 的 `hooks/useHotkeys`。
 *
 * 一个实例只在 window 上挂一个 keydown。快捷键列表放在调用方，
 * 重新渲染不会反复订阅。已经 preventDefault 的事件、输入法组合中的事件会跳过。
 * 焦点在输入控件里时默认不触发，除非那一条写了 `allowInInputs`。
 *
 * 单个没有修饰键的字符（例如 `c`、`/`）很容易被语音输入误触。
 * 如果注册这种快捷键，调用方需要提供关闭、改键，或只在组件有焦点时生效。
 */
export function useHotkeys(hotkeys: MaybeRefOrGetter<readonly Hotkey[]>): void {
  let stop: (() => void) | null = null

  function start(): void {
    if (typeof window === 'undefined' || stop != null)
      return
    const isApple = isApplePlatform()

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented || isImeKeyEvent(event))
        return
      const isTyping = isTypingTarget(event.target)
      for (const hotkey of toValue(hotkeys)) {
        if (hotkey.isDisabled)
          continue
        if (isTyping && hotkey.allowInInputs !== true)
          continue
        if (matchesCombo(hotkey.keys, event, isApple)) {
          event.preventDefault()
          hotkey.onPress(event)
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    stop = () => {
      window.removeEventListener('keydown', handleKeyDown)
      stop = null
    }
  }

  onMounted(start)
  onScopeDispose(() => {
    stop?.()
  })
}
