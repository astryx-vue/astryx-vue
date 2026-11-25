/**
 * 吸附分页的数学部分：速度采样、按停点排出每一页、松手时选哪一页，以及把一行
 * 带到目标页的弹簧。都不碰 DOM，时间由调用方给。
 */

/** 时间来源和逐帧回调，测试里可以换成假时钟。 */
export interface FrameClock {
  readonly now: () => number
  readonly frame: (callback: () => void) => number
  readonly cancel: (handle: number) => void
}

export const browserClock: FrameClock = {
  now: () => performance.now(),
  frame: callback => requestAnimationFrame(() => callback()),
  cancel: handle => cancelAnimationFrame(handle),
}

/** 只看最近这么久的位置算速度。 */
const VELOCITY_WINDOW_MS = 100
/** 最后一次移动之后停了这么久，就当手指已经停住，速度为 0。 */
const STILL_AFTER_MS = 50

/** 记录拖动中的位置，算出松手时的速度（像素每秒，朝末端为正）。 */
export function createVelocitySampler(): {
  add: (time: number, position: number) => void
  reset: () => void
  velocity: (time: number) => number
  lastTime: () => number | null
} {
  let samples: { time: number, position: number }[] = []
  return {
    add(time, position) {
      samples.push({ time, position })
      samples = samples.filter(sample => time - sample.time <= VELOCITY_WINDOW_MS)
    },
    reset() {
      samples = []
    },
    velocity(time) {
      const last = samples[samples.length - 1]
      const first = samples[0]
      if (last == null || first == null || last === first || time - last.time > STILL_AFTER_MS)
        return 0
      const elapsed = last.time - first.time
      return elapsed > 0 ? (last.position - first.position) / elapsed * 1000 : 0
    },
    lastTime() {
      return samples[samples.length - 1]?.time ?? null
    },
  }
}

/** 下标列表里离 `to` 最近的那一个。 */
export function nearestIndex(stops: readonly number[], to: number): number {
  let best = 0
  for (let i = 1; i < stops.length; i++) {
    if (Math.abs(stops[i]! - to) < Math.abs(stops[best]! - to))
      best = i
  }
  return best
}

/**
 * 从第 `anchor` 个停点算起的「一屏一页」：每一页落在离上一页一屏远最近的停点上，
 * 并且至少往前走一个停点。
 */
export function viewPages(stops: readonly number[], anchor: number, width: number): number[] {
  const pages = [stops[anchor]!]
  for (let i = anchor; i < stops.length - 1;) {
    i = Math.max(nearestIndex(stops, stops[i]! + width), i + 1)
    pages.push(stops[i]!)
  }
  for (let i = anchor; i > 0;) {
    i = Math.min(nearestIndex(stops, stops[i]! - width), i - 1)
    pages.unshift(stops[i]!)
  }
  return pages
}

/** 速度超过这个值（像素每秒）就算轻扫，至少翻到运动方向上的下一页。 */
export const FLICK_VELOCITY = 300
/** 松手后按这个时长（秒）把速度投出去，再找离投点最近的一页。 */
const PROJECTION_SECONDS = 0.1

/**
 * 松手时停在哪一页：轻扫至少翻到运动方向上的下一页，慢慢松手就停在投点最近的一页。
 * 不论多快，离起手那一页（`anchor`）最多一页。返回页的下标。
 */
export function pickPage(pages: readonly number[], at: number, velocity: number, anchor: number): number {
  let index = nearestIndex(pages, at + velocity * PROJECTION_SECONDS)
  if (velocity >= FLICK_VELOCITY) {
    const ahead = pages.findIndex(page => page > at + 0.5)
    if (ahead !== -1)
      index = Math.max(index, ahead)
  }
  else if (velocity <= -FLICK_VELOCITY) {
    let behind = -1
    for (let i = pages.length - 1; i >= 0; i--) {
      if (pages[i]! < at - 0.5) {
        behind = i
        break
      }
    }
    if (behind !== -1)
      index = Math.min(index, behind)
  }
  return Math.min(Math.max(index, anchor - 1, 0), anchor + 1, pages.length - 1)
}

/** 弹簧的固有角频率：大约 0.4 秒走完一页，接近 UIKit 翻页的手感。 */
const SPRING_OMEGA = (2 * Math.PI) / 0.4
/** 轻扫很快时弹簧可以收得更紧，但不超过这个角频率。 */
const MAX_OMEGA = 60
const REST_DISTANCE = 0.5
const REST_VELOCITY = 20

/** 正在进行的弹簧。 */
export interface SpringMotion {
  readonly target: number
  /** 当前速度（像素每秒），换目标时接着用，动作不会突然停顿。 */
  readonly velocity: () => number
  readonly stop: () => void
}

/**
 * 用临界阻尼弹簧把位置从 `from` 带到 `to`，带着初速度 `velocity`（像素每秒）。
 * 每一帧调用 `onFrame`，停稳后最后一次给出 `to` 并调用 `onRest`。
 */
export function springTo(
  clock: FrameClock,
  from: number,
  to: number,
  velocity: number,
  onFrame: (position: number) => void,
  onRest: () => void,
): SpringMotion {
  const start = clock.now()
  const offset0 = from - to
  // 朝目标的初速度太快时，临界阻尼弹簧会冲过目标再弹回。这时把弹簧收紧到正好
  // 用这个速度起步、不越过目标，手指松开的速度也就原样接上。
  const toward = offset0 === 0 ? 0 : -velocity * Math.sign(offset0)
  const omega = Math.max(SPRING_OMEGA, Math.min(MAX_OMEGA, toward / Math.max(Math.abs(offset0), 1e-6)))
  let handle = 0
  let stopped = false

  function state(time: number): { offset: number, velocity: number } {
    const t = Math.max(0, time - start) / 1000
    const decay = Math.exp(-omega * t)
    const b = velocity + omega * offset0
    return {
      offset: (offset0 + b * t) * decay,
      velocity: (b - omega * (offset0 + b * t)) * decay,
    }
  }

  function tick(): void {
    if (stopped)
      return
    const now = state(clock.now())
    if (Math.abs(now.offset) < REST_DISTANCE && Math.abs(now.velocity) < REST_VELOCITY) {
      stopped = true
      onFrame(to)
      onRest()
      return
    }
    onFrame(to + now.offset)
    handle = clock.frame(tick)
  }

  handle = clock.frame(tick)
  return {
    target: to,
    velocity: () => stopped ? 0 : state(clock.now()).velocity,
    stop() {
      stopped = true
      clock.cancel(handle)
    },
  }
}
