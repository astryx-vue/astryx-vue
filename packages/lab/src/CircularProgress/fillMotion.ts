/**
 * @file fillMotion.ts
 * @output 确定进度圆弧的几何与动画关键帧：fillTurns、parseTime、easingOf、fillKeyframes
 * @position CircularProgress 内部使用
 *
 * 圆弧由两个半环和两个圆头拼出：右半环在进度前一半里从 0 转到 180°，
 * 左半环在后一半里从 180° 转到 360°；一个圆头固定在 12 点，另一个跟着进度转。
 * 它们都只动 transform 和 opacity，交给合成线程跑，主线程被脚本占住时圆弧照样在动。
 */

export interface FillTurns {
  right: number
  left: number
  cap: number
  rightShown: number
  leftShown: number
  caps: number
}

/**
 * 进度 `p`（0–1）对应的两个半环、跟随圆头的角度，以及哪些部件可见。
 * 停在自己那一半边缘的半环（0 时的右半环、过半之前的左半环）隐藏起来，
 * 免得抗锯齿的边在 6 点方向留一条细线。
 */
export function fillTurns(p: number): FillTurns {
  const turn = 360 * p
  return {
    right: Math.min(Math.max(turn, 0), 180),
    left: Math.min(Math.max(turn, 180), 360),
    cap: turn,
    rightShown: p > 0 ? 1 : 0,
    leftShown: p > 0.5 ? 1 : 0,
    caps: p > 0 ? 1 : 0,
  }
}

/** CSS 时间（`410ms`、`0.41s`，或列表里的第一项）换成毫秒。 */
export function parseTime(value: string): number {
  const first = value.split(',')[0]?.trim() ?? ''
  const amount = Number.parseFloat(first)
  if (!Number.isFinite(amount))
    return 0
  return first.endsWith('ms') ? amount : amount * 1000
}

/**
 * 主题的缓动曲线，写成时间（0–1）的函数。借一个脱离文档的动画让浏览器自己求值，
 * 所以任何 CSS 缓动都能用。只在有 Web Animations 的环境里调用。
 */
export function easingOf(easing: string): (t: number) => number {
  const effect = new KeyframeEffect(null, null, { duration: 1000, easing, fill: 'both' })
  const probe = new Animation(effect)
  return (t) => {
    probe.currentTime = t * 1000
    return effect.getComputedTiming().progress ?? t
  }
}

/** 四个转动部件各自的关键帧。 */
export interface FillKeyframes {
  right: Keyframe[]
  left: Keyframe[]
  cap: Keyframe[]
  start: Keyframe[]
}

/**
 * 从 `from` 到 `to`（都是 0–1 的进度）的关键帧：按主题缓动每帧采样一次，
 * 并在圆弧越过 6 点的那一刻多采一帧，让两个半环准时交接，左半环的显隐是一步跳变而不是渐隐。
 */
export function fillKeyframes(from: number, to: number, duration: number, ease: (t: number) => number): FillKeyframes {
  const count = Math.max(8, Math.ceil(duration / (1000 / 60)))
  const grid = Array.from({ length: count + 1 }, (_, i) => i / count)
  const at = (t: number): number => from + (to - from) * ease(t)
  const crossings: number[] = []
  for (let i = 0; i < count; i++) {
    const a = grid[i]!
    const b = grid[i + 1]!
    const fa = at(a) - 0.5
    const fb = at(b) - 0.5
    if (fa === 0) {
      crossings.push(a)
    }
    else if (fa * fb < 0) {
      let low = a
      let high = b
      for (let k = 0; k < 24; k++) {
        const mid = (low + high) / 2
        if ((at(low) - 0.5) * (at(mid) - 0.5) <= 0)
          high = mid
        else
          low = mid
      }
      crossings.push((low + high) / 2)
    }
  }
  const times = [...new Set([
    ...grid,
    ...crossings,
    ...crossings.map(c => c + 1e-4).filter(t => t < 1),
  ])].sort((x, y) => x - y)
  const frames = times.map(t => ({ t, ...fillTurns(t === 1 ? to : at(t)) }))
  // 正好落在一半的那帧，左半环按「要离开的那一侧」显示，两个方向都是一步跳变，
  // 收缩穿过 6 点时不会在前一帧就开始淡出。
  const onHalf = new Set(crossings)
  for (let i = 1; i < frames.length; i += 1) {
    if (onHalf.has(frames[i]!.t) || (frames[i]!.t === 1 && to === 0.5))
      frames[i]!.leftShown = frames[i - 1]!.leftShown
  }
  return {
    right: frames.map(f => ({ offset: f.t, transform: `rotate(${f.right}deg)`, opacity: f.rightShown })),
    left: frames.map(f => ({ offset: f.t, transform: `rotate(${f.left}deg)`, opacity: f.leftShown })),
    cap: frames.map(f => ({ offset: f.t, transform: `rotate(${f.cap}deg)`, opacity: f.caps })),
    start: frames.map(f => ({ offset: f.t, opacity: f.caps })),
  }
}

const pendingRotors = new Set<Element>()
let flushScheduled = false

function pinRotorsToTimelineOrigin(): void {
  flushScheduled = false
  const animations: Animation[] = []
  for (const rotor of pendingRotors)
    animations.push(...rotor.getAnimations())
  pendingRotors.clear()
  for (const animation of animations)
    animation.startTime = 0
}

/**
 * 把不确定圆环的旋转钉在文档时间线的 0 点，和加载圈（Spinner）同相位转，
 * 先后挂载的圆环也不会各转各的。同一帧里挂载的一起处理。
 */
export function syncRotationPhase(rotor: Element): () => void {
  if (typeof rotor.getAnimations !== 'function')
    return () => {}
  pendingRotors.add(rotor)
  if (!flushScheduled) {
    flushScheduled = true
    requestAnimationFrame(pinRotorsToTimelineOrigin)
  }
  return () => {
    pendingRotors.delete(rotor)
  }
}
