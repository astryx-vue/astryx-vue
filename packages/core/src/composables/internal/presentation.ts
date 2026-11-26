/**
 * 组件 `presentation` 属性的解析（上游 utils/presentation.ts、
 * hooks/useAdaptivePresentation.ts、utils/touchPresentation.ts）。
 *
 * 调用方明确写了 `presentation` 时，永远以调用方为准：
 * - `'popover'`：任何设备上都是锚定浮层，也不打开触屏输入模式；
 * - `'bottom-sheet'`：任何设备上都是底部弹层，手指操作时打开触屏输入模式；
 * - `'adaptive'`：紧凑触屏（粗指针，并且视口窄于主题 `md` 或矮于 500px）上
 *   用底部弹层，其余用浮层；手指操作时打开触屏输入模式；
 * - 没写：`whenOmitted: 'popover'` 当成 `'popover'`；`whenOmitted: 'touch'`
 *   保持浮层，手指操作时打开触屏输入模式。
 *
 * 只看指针，不看平台。服务端渲染、接管服务端 HTML 时都按「不是触屏、不紧凑」
 * 算，挂载后再按真实窗口更新。窗口没有 `matchMedia`（测试用的 DOM）时一律
 * 当成不匹配，组件照常渲染默认的浮层。
 */
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { CompactDefinition } from '../../Theme/compactDefinition.js'
import { computed, getCurrentInstance, onMounted, onScopeDispose, shallowRef, toValue, watch } from 'vue'
import { useCompactDefinition } from '../../Theme/compactDefinition.js'
import { matchesMediaQuery, watchMediaQuery } from '../../utils/coarsePointer.js'
import { TOUCH_QUERY } from '../../utils/touchQueries.js'

export type AdaptivePresentation = 'popover' | 'bottom-sheet' | 'adaptive'
export type ResolvedAdaptivePresentation = Exclude<AdaptivePresentation, 'adaptive'>

/** 调用方没写 `presentation` 时组件怎么做。 */
export type PresentationDefault = 'popover' | 'touch'

export interface TouchPresentation {
  /** 主指针是粗指针（手指）。 */
  readonly isTouch: boolean
  /** 视口紧凑。 */
  readonly isCompact: boolean
}

export interface ResolvedPresentation {
  /** 要渲染的表面。 */
  readonly surface: ResolvedAdaptivePresentation
  /** 组件的触屏输入模式生效：手指操作，并且 `presentation` 没钉成 `'popover'`。 */
  readonly touchModes: boolean
}

export interface PresentationOptions {
  /** 没写 `presentation` 时的含义。默认 `'popover'`。 */
  readonly whenOmitted?: PresentationDefault
}

export interface ReadPresentationOptions extends PresentationOptions {
  /** 要读的窗口，默认全局窗口。 */
  readonly view?: Window | null
  /** 当前主题的紧凑定义（渲染时读 useCompactDefinition）。 */
  readonly compact: CompactDefinition
}

/** 由呈现请求和触屏状态得出结论，不读任何环境。 */
export function resolvePresentation(
  presentation: AdaptivePresentation | undefined,
  touch: TouchPresentation,
  whenOmitted: PresentationDefault = 'popover',
): ResolvedPresentation {
  const request = presentation ?? whenOmitted
  const surface = request === 'bottom-sheet' || (request === 'adaptive' && touch.isTouch && touch.isCompact)
    ? 'bottom-sheet'
    : 'popover'
  return { surface, touchModes: request !== 'popover' && touch.isTouch }
}

/** 此刻的触屏状态。没有窗口或窗口没有 `matchMedia` 时既不是触屏也不紧凑。 */
export function readTouchPresentation(view: Window | null | undefined, compact: CompactDefinition): TouchPresentation {
  return {
    isTouch: matchesMediaQuery(view, TOUCH_QUERY),
    isCompact: matchesMediaQuery(view, compact.query),
  }
}

/** 此刻的呈现结论，给只在某个时刻决定一次的场合用（菜单打开那一刻）。 */
export function readPresentation(
  presentation: AdaptivePresentation | undefined,
  { whenOmitted = 'popover', view, compact }: ReadPresentationOptions,
): ResolvedPresentation {
  const target = view === undefined ? (typeof window === 'undefined' ? null : window) : view
  return resolvePresentation(presentation, readTouchPresentation(target, compact), whenOmitted)
}

/**
 * 一条媒体查询是否匹配，只在 `query` 不为空时订阅。服务端和接管服务端 HTML
 * 时先答 false，挂载后再读真实窗口。
 */
function useMatchWhileRead(query: () => string | null): Ref<boolean> {
  const isHydrating = getCurrentInstance()?.vnode.el != null
  const initial = query()
  const matches = shallowRef(!isHydrating && initial != null && typeof window !== 'undefined' && matchesMediaQuery(window, initial))
  let stopQuery: (() => void) | null = null
  let stopWatch: (() => void) | null = null

  onMounted(() => {
    stopWatch = watch(query, (next) => {
      stopQuery?.()
      stopQuery = null
      if (next == null) {
        matches.value = false
        return
      }
      matches.value = matchesMediaQuery(window, next)
      stopQuery = watchMediaQuery(window, next, (value) => {
        matches.value = value
      })
    }, { immediate: true })
  })

  onScopeDispose(() => {
    stopWatch?.()
    stopQuery?.()
  })

  return matches
}

/**
 * 跟着指针和屏幕大小变化的呈现结论（比如平板接上了触控板）。只订阅请求用得到
 * 的查询：钉成 `'popover'` 的什么都不订阅，`'bottom-sheet'` 和没写时的
 * `'touch'` 默认只看指针，`'adaptive'` 看指针和紧凑尺寸。
 */
export function usePresentation(
  presentation: MaybeRefOrGetter<AdaptivePresentation | undefined>,
  { whenOmitted = 'popover' }: PresentationOptions = {},
): ComputedRef<ResolvedPresentation> {
  const compact = useCompactDefinition()
  const request = (): AdaptivePresentation | 'touch' => toValue(presentation) ?? whenOmitted
  const isTouch = useMatchWhileRead(() => (request() === 'popover' ? null : TOUCH_QUERY))
  const isCompact = useMatchWhileRead(() => (request() === 'adaptive' ? compact.value.query : null))
  return computed(() => resolvePresentation(
    toValue(presentation),
    { isTouch: isTouch.value, isCompact: isCompact.value },
    whenOmitted,
  ))
}

/**
 * 只解析浮层还是底部弹层。只有 `'adaptive'` 订阅媒体查询，读的是当前主题的
 * 「紧凑并且粗指针」查询。
 */
export function useAdaptivePresentation(
  presentation: MaybeRefOrGetter<AdaptivePresentation>,
): ComputedRef<ResolvedAdaptivePresentation> {
  const compact = useCompactDefinition()
  const isCompactTouch = useMatchWhileRead(() => (toValue(presentation) === 'adaptive' ? compact.value.coarsePointerQuery : null))
  return computed(() => {
    const request = toValue(presentation)
    if (request !== 'adaptive')
      return request
    return isCompactTouch.value ? 'bottom-sheet' : 'popover'
  })
}

/** 菜单打开那一刻是否是紧凑触屏（下级菜单是否改为原地进入），读当前主题的定义。 */
export function readCompactTouch(compact: CompactDefinition, view?: Window | null): boolean {
  const target = view === undefined ? (typeof window === 'undefined' ? null : window) : view
  return matchesMediaQuery(target, compact.coarsePointerQuery)
}
