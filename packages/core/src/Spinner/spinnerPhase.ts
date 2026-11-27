const pending = new Set<Element>()
let scheduled = false

function pinPendingRings(): void {
  scheduled = false
  const animations: Animation[] = []
  for (const rotor of pending) {
    if (typeof rotor.getAnimations === 'function')
      animations.push(...rotor.getAnimations())
  }
  pending.clear()
  for (const animation of animations)
    animation.startTime = 0
}

/**
 * 把转子的动画起点钉在文档时间线的 0。
 * 后出现的加载圈因此和先出现的停在同一相位，而不是各自从挂载的那一帧开始。
 */
export function bindSpinnerPhase(rotor: Element): () => void {
  if (typeof rotor.getAnimations !== 'function')
    return () => {}
  pending.add(rotor)
  if (!scheduled) {
    scheduled = true
    requestAnimationFrame(pinPendingRings)
  }
  return () => {
    pending.delete(rotor)
  }
}
