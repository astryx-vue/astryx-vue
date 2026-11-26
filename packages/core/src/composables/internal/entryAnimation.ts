import { getCurrentInstance } from 'vue'

/** 入场动画的预设。名字说的是元素往哪个方向动。 */
export type EntryAnimationPreset = 'slideDown' | 'slideUp' | 'fadeIn' | 'scaleIn'

export interface UseEntryAnimationOptions {
  /**
   * 挂载时播放的动画。
   * @default 'slideDown'
   */
  preset?: EntryAnimationPreset
}

export interface UseEntryAnimationReturn {
  /**
   * 绑到元素的 `class` 上。首屏渲染出来的元素、服务端渲染时、以及接管服务端 HTML 时都是 `null`，
   * 也就是说这些元素不播放动画。
   */
  entryClass: string | null
}

/**
 * 预设对应的共享动画类。时长、缓动和「减少动态效果」的处理都在 `styles/motion.css` 里。
 * 类名里的 above 指元素从下方升上去，below 指从上方落下来。
 */
const ENTRY_ANIMATION_CLASSES: Record<EntryAnimationPreset, string> = {
  slideDown: 'astryx-motion-slide-in-below',
  slideUp: 'astryx-motion-slide-in-above',
  fadeIn: 'astryx-motion-fade-in',
  scaleIn: 'astryx-motion-scale-in',
}

let paintGeneration = 0
let hasPaintedPage = false
let isTrackingPaint = false

function trackFirstPaint(): void {
  if (isTrackingPaint || typeof window === 'undefined' || typeof requestAnimationFrame !== 'function')
    return
  isTrackingPaint = true
  const generation = paintGeneration
  // 一帧的回调跑在绘制之前，所以过两帧才算首屏画完。
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (generation === paintGeneration)
        hasPaintedPage = true
    })
  })
}

/** 首屏是否已经画过。服务端没有 window，永远返回 false。 */
export function isAfterFirstPaint(): boolean {
  trackFirstPaint()
  return hasPaintedPage
}

/** 只给测试用，把首屏状态退回没画过的样子。 */
export function resetEntryAnimationForTest(): void {
  paintGeneration += 1
  isTrackingPaint = false
  hasPaintedPage = false
}

/**
 * 对应原版 Astryx 的 `hooks/useEntryAnimation`。
 *
 * 元素挂载时播一次入场动画，但只对首屏画完之后才插进来的元素生效：
 * 首屏就渲染出来的元素不播放，免得整页一起动。
 *
 * 用法是把返回的 `entryClass` 绑到 `class` 上。动画时长和缓动取自主题的
 * motion token，「减少动态效果」打开时动画会直接落到结束状态。
 */
export function useEntryAnimation(options: UseEntryAnimationOptions = {}): UseEntryAnimationReturn {
  const preset = options.preset ?? 'slideDown'
  // 正在接管服务端 HTML 的组件，元素本来就在页面加载时出现，客户端必须渲染出和服务端一样的 class，
  // 不然浏览器在接管前已经画过一帧时会对不上。之后才挂载的元素照常播放。
  if (isHydrating())
    return { entryClass: null }
  return { entryClass: isAfterFirstPaint() ? ENTRY_ANIMATION_CLASSES[preset] : null }
}

/**
 * 当前组件是否在接管服务端渲染的 DOM。Vue 接管时先把已有的 DOM 节点交给组件的 vnode，
 * 再运行 setup；普通挂载时这里还是 null。不在组件里调用时返回 false。
 */
function isHydrating(): boolean {
  return getCurrentInstance()?.vnode.el != null
}

// 模块加载时就开始等首屏画完。页面一开始没有用到入场动画的元素时，
// 之后动态插进来的元素照样能播放。
trackFirstPaint()
