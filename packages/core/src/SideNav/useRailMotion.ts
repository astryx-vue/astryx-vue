/**
 * @file useRailMotion.ts
 * @input 侧栏是否收起、nav 与外层框架元素、AppShell 借来的 `sideNavShellKey`
 * @output 每次收起或展开都播一段轨道动效；`markOwnToggle` 标记「轨道自己的开关」
 * @position SideNav 内部，只管动效的接线（动效本身在 railMotion.ts）
 *
 * 收起、展开不管谁引起的（点击、受控 prop、快捷键、拖动缩放手柄），都在 DOM 变化之前量好旧轨道，
 * 变化之后、绘制之前播放。AppShell 里内容区通过它借来的句柄一起动；AppShell 之外，
 * SideNav 自己持有一个句柄。例外是初始状态：轨道第一次绘制之前、不是轨道自己的开关引起的变化，
 * 直接落到位置，不播动效。
 */
import type { RailMotion, RailSnapshot } from './railMotion.js'
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'
import { sideNavShellKey } from './context.js'
import { createRailLayout, playRail, snapshotRail } from './railMotion.js'

export interface RailMotionOptions {
  isCollapsed: () => boolean
  /** 可缩放的轨道，外层框架就是被移动的轨道；否则是 nav 自己。 */
  isResizable: () => boolean
  nav: () => HTMLElement | null
  frame: () => HTMLElement | null
}

/** 时间线每帧只有一个时间，同一帧里读两次相等。 */
function frameTimeOf(doc: Document | undefined): number | null {
  const time = doc?.timeline?.currentTime
  return time == null ? null : Number(time)
}

export function useRailMotion(options: RailMotionOptions): { markOwnToggle: () => void } {
  const shell = inject(sideNavShellKey, null)
  const ownRail = (): HTMLElement | null => options.isResizable() ? options.frame() : options.nav()
  const ownLayout = createRailLayout(ownRail)
  const railOf = (): HTMLElement | null => shell?.rail() ?? ownRail()
  const handleOf = (): typeof ownLayout => shell?.animatedLayout ?? ownLayout

  let snapshot: RailSnapshot | null = null
  let running: { rail: RailMotion, endContent: () => void } | null = null
  let isOwnToggle = false
  let mountFrame: number | null = null

  function endRunning(): void {
    running?.rail.end()
    running?.endContent()
    running = null
  }

  function measure(wasCollapsed: boolean): void {
    // 动效进行中又变化：从轨道此刻显示的样子开始。
    const shown = running?.rail.shown() ?? null
    endRunning()
    const own = isOwnToggle
    isOwnToggle = false
    const frame = frameTimeOf(options.nav()?.ownerDocument)
    if (!own && (frame == null || frame === mountFrame)) {
      snapshot = null
      shell?.landContent()
      return
    }
    snapshot = snapshotRail(railOf(), handleOf(), shown, wasCollapsed)
    // 收起时，旧轨道的副本盖在上面；拷不下来就和页面一起一步到位，在同一条时钟上，正在播的滑动也一并落地。
    if (snapshot != null && snapshot.swap == null && !wasCollapsed) {
      shell?.landContent()
      return
    }
    shell?.beforeRailChange()
  }

  function play(): void {
    const noted = snapshot
    snapshot = null
    if (noted == null)
      return
    // 内容先动：它的滑动先开始，轨道再骑上去。
    const endContent = shell?.afterRailChange() ?? (() => {})
    running = { rail: playRail(noted, railOf(), handleOf(), shell?.column() ?? null), endContent }
  }

  onMounted(() => {
    mountFrame = frameTimeOf(options.nav()?.ownerDocument)
  })
  watch(options.isCollapsed, (_value, wasCollapsed) => measure(wasCollapsed), { flush: 'pre' })
  watch(options.isCollapsed, play, { flush: 'post' })
  // 卸载时动效进行到一半：副本立刻拿掉。
  onBeforeUnmount(endRunning)

  function markOwnToggle(): void {
    isOwnToggle = true
  }
  return { markOwnToggle }
}
