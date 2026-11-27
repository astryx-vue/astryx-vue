/**
 * @file clipWhileMoving.ts
 * @position TreeList 内部：自己带动效的树（触屏下没有传入句柄）在行滑动时把下沿裁住。
 *
 * 往上滑进更短的树的行只在树的范围里显示，不会盖到树后面的内容上。
 * 只裁下沿，且留出行焦点环的距离。
 */

const MOVING_CLIP = 'inset(-100vmax -100vmax calc(-1 * (var(--astryx-focus-outline-width, 2px) + var(--astryx-focus-outline-offset, 3px))) -100vmax)'

const generations = new WeakMap<HTMLElement, number>()

/** 树里有有限时长的动画在播时裁住树，直到它们全部结束。 */
export function clipWhileMoving(tree: HTMLElement): void {
  if (typeof tree.getAnimations !== 'function')
    return
  const moving = tree.getAnimations({ subtree: true }).filter(animation =>
    animation.playState === 'running'
    && Number.isFinite(animation.effect?.getComputedTiming().endTime ?? Infinity),
  )
  if (moving.length === 0)
    return
  const generation = (generations.get(tree) ?? 0) + 1
  generations.set(tree, generation)
  tree.style.setProperty('clip-path', MOVING_CLIP)
  void Promise.allSettled(moving.map(async animation => animation.finished)).then(() => {
    if (generations.get(tree) === generation) {
      generations.delete(tree)
      tree.style.removeProperty('clip-path')
    }
  })
}
