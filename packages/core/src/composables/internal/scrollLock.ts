import type { Ref } from 'vue'
import type { ScrollbarGutterHold } from './scrollbarGutter.js'
import { onScopeDispose, watch } from 'vue'
import { holdScrollbarGutter } from './scrollbarGutter.js'

/**
 * 对应原版 Astryx 的 `hooks/useScrollLock`。
 *
 * 按引用计数锁住 body 滚动：里层关掉时，外层还开着就不会把页面放开。
 * 锁的时候藏掉 body 的滚动，同时给滚动条留住位置，页面不会左右跳一下。
 *
 * 原版用 `position: fixed` 把页面钉住，因为 iOS Safari 不认 `overscroll-behavior`。
 * 这边 Dialog、BottomSheet 一直用的是 `overflow: hidden`，这里沿用；
 * iOS 背景滚动由各自的浮层自己处理。
 */
let depth = 0
let saved: { overflow: string, gutter: ScrollbarGutterHold } | null = null

export function useScrollLock(isLocked: Ref<boolean>): void {
  let held = false

  function acquire(): void {
    if (held || typeof document === 'undefined')
      return
    if (depth === 0) {
      const body = document.body
      // 要在下面藏掉滚动条之前量。
      const gutter = holdScrollbarGutter(body)
      saved = { overflow: body.style.overflow, gutter }
      body.style.overflow = 'hidden'
      gutter.settle()
    }
    depth += 1
    held = true
  }

  function release(): void {
    if (!held)
      return
    held = false
    depth -= 1
    if (depth === 0 && saved != null) {
      if (typeof document !== 'undefined')
        document.body.style.overflow = saved.overflow
      saved.gutter.release()
      saved = null
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
  saved?.gutter.release()
  depth = 0
  saved = null
}
