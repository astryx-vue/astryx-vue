const pending = new Set<SVGSVGElement>()
let scheduled = false

function pinPendingRings(): void {
  scheduled = false
  const animations: Animation[] = []
  for (const svg of pending) {
    if (typeof svg.getAnimations === 'function')
      animations.push(...svg.getAnimations({ subtree: true }))
  }
  pending.clear()
  for (const animation of animations)
    animation.startTime = 0
}

/**
 * 把这条弧的动画起点钉在文档时间线的 0。
 * 后出现的加载圈因此和先出现的停在同一相位，而不是各自从挂载的那一帧开始。
 */
export function bindSpinnerPhase(svg: SVGSVGElement): () => void {
  if (typeof svg.getAnimations !== 'function')
    return () => {}
  pending.add(svg)
  if (!scheduled) {
    scheduled = true
    requestAnimationFrame(pinPendingRings)
  }
  return () => {
    pending.delete(svg)
  }
}
