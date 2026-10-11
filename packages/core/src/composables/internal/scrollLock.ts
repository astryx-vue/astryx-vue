import type { Ref } from 'vue'
import { onScopeDispose, watch } from 'vue'

/**
 * 对应原版 Astryx 的 `hooks/useScrollLock`。
 *
 * 原版用 `position: fixed` 把页面钉住，因为 iOS Safari 不吃 `overscroll-behavior`。
 * 这边 Dialog 和 BottomSheet 原来只保存并恢复 `document.body.style.overflow`。
 * 这个函数沿用那个约定，并加上锁定计数：里层关掉时，外层还开着就不会把页面放开。
 */
let depth = 0
let savedOverflow: string | null = null

export function useScrollLock(isLocked: Ref<boolean>): void {
  let held = false

  function acquire(): void {
    if (held || typeof document === 'undefined')
      return
    if (depth === 0) {
      savedOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    depth += 1
    held = true
  }

  function release(): void {
    if (!held)
      return
    held = false
    depth -= 1
    if (depth === 0) {
      if (typeof document !== 'undefined' && savedOverflow !== null)
        document.body.style.overflow = savedOverflow
      savedOverflow = null
    }
  }

  watch(isLocked, (locked) => {
    if (locked)
      acquire()
    else
      release()
  }, { flush: 'sync', immediate: true })

  onScopeDispose(release)
}

/** 测试用：清掉锁定计数。不从包入口导出。 */
export function resetScrollLockForTest(): void {
  depth = 0
  savedOverflow = null
}
