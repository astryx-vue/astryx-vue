import type { Ref } from 'vue'
import { nextTick, ref, watch } from 'vue'

/** 离底部多远以内算「还在跟随最新一行」。 */
const FOLLOW_THRESHOLD_PX = 24

export interface UseLogFollowOptions {
  /** 跟随状态，通常来自 `v-model:isFollowing`。 */
  following: Ref<boolean>
  /** 用户要求改变跟随时回报。 */
  onFollowChange: (next: boolean) => void
  /** 行数，变化时如果还在跟随就滚到最新一行。 */
  entryCount: () => number
}

export interface UseLogFollowReturn {
  scrollerRef: Ref<HTMLElement | null>
  isAtBottom: Ref<boolean>
  handleScroll: () => void
  jumpToLatest: () => void
}

/**
 * 日志跟滚：跟随最新一行、用户往回滚就取消跟随、点「跳到最新」再跟上。
 *
 * 跟随状态下直接写 `scrollTop`（不用平滑滚动），这样连续追加的行不会堆起
 * 互相打断的动画。取消跟随只在视口离开底部时发生，程序化滚动落到底部时
 * 不会触发，所以不需要「这是不是我自己滚的」这类保护。
 */
export function useLogFollow(options: UseLogFollowOptions): UseLogFollowReturn {
  const scrollerRef = ref<HTMLElement | null>(null)
  const isAtBottom = ref(true)

  function setFollowing(next: boolean): void {
    if (next === options.following.value)
      return
    options.following.value = next
    options.onFollowChange(next)
  }

  function pinToBottom(): void {
    const el = scrollerRef.value
    if (el == null)
      return
    el.scrollTop = el.scrollHeight
    isAtBottom.value = true
  }

  // 跟着最新一行时，行数一变就落到底部。
  watch([options.following, options.entryCount], ([isFollowing]) => {
    if (isFollowing)
      void nextTick(pinToBottom)
  })

  function handleScroll(): void {
    const el = scrollerRef.value
    if (el == null)
      return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    const atBottom = distanceFromBottom <= FOLLOW_THRESHOLD_PX
    isAtBottom.value = atBottom
    // 用户滚离了尾部就取消跟随。想再跟上是显式动作（点「跳到最新」），
    // 不会因为往回滚就自动恢复。
    if (options.following.value && !atBottom)
      setFollowing(false)
  }

  function jumpToLatest(): void {
    setFollowing(true)
    // 受控时父组件可能不改这个值，点了按钮就应该立刻落到最新一行。
    pinToBottom()
  }

  return { scrollerRef, isAtBottom, handleScroll, jumpToLatest }
}
