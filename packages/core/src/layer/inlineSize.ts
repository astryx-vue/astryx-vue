import type { LayerGutter } from './gutter.js'
import { LAYER_BASE_GUTTER } from './gutter.js'

/**
 * 浮层宽度上限用到的 CSS 变量。
 *
 * 浮层被 Teleport 到 body（或者 Dialog 里面），DOM 上已经离开了 LayerProvider，
 * 拿不到它的继承链，所以这个变量由 `LayerProvider` 写在根元素上，全局一份。
 */
export const LAYER_MAX_INLINE_SIZE_VAR = '--astryx-layer-max-inline-size'

/** 没有 `LayerProvider` 时的宽度上限：视口减去左右各一条基础空隙。 */
export const LAYER_MAX_INLINE_SIZE_FALLBACK = `calc(100vw - ${LAYER_BASE_GUTTER * 2}px)`

/** 读这个变量的完整写法，带默认值，直接在 CSS 和 `min()` 里用。 */
export const LAYER_MAX_INLINE_SIZE = `var(${LAYER_MAX_INLINE_SIZE_VAR}, ${LAYER_MAX_INLINE_SIZE_FALLBACK})`

/**
 * 浮层最宽能有多少：视口宽度减去左右两条空隙。
 *
 * 两条空隙都要减。只减一边的话，比视口还宽的浮层会贴着另一边，用户看到它顶到
 * 屏幕边缘（上游 AST-059 FR7）。
 */
export function layerMaxInlineSize(gutter: LayerGutter): string {
  return `calc(100vw - ${gutter.inlineStart}px - ${gutter.inlineEnd}px)`
}

/**
 * 把想要的宽度压到视口上限之内。
 *
 * 上限必须写进 `min()` 里：调用方如果用的是 `min-width`，`max-width` 压不住它
 * （CSS 里最小值优先于最大值）。
 */
export function clampInlineSize(value: string, maximum: string = LAYER_MAX_INLINE_SIZE): string {
  return `min(${value.trim()}, ${maximum})`
}

/**
 * 是不是 `auto`、`min-content` 这类关键字。它们不能当 `min()` 的参数，
 * 原样用，让浮层自己的宽度上限去压。
 */
const INTRINSIC_INLINE_SIZE = /^(?:auto|contain|fit-content|fit-content\(.*\)|inherit|initial|max-content|min-content|revert|revert-layer|stretch|unset)$/i

export function isIntrinsicInlineSize(value: string): boolean {
  return INTRINSIC_INLINE_SIZE.test(value.trim())
}

interface InlineSizeHold {
  token: object
  value: string
}

const holders: InlineSizeHold[] = []

function applyLayerMaxInlineSize(): void {
  if (typeof document === 'undefined')
    return
  const top = holders[holders.length - 1]
  const style = document.documentElement.style
  if (top == null)
    style.removeProperty(LAYER_MAX_INLINE_SIZE_VAR)
  else
    style.setProperty(LAYER_MAX_INLINE_SIZE_VAR, top.value)
}

/**
 * 根上的 LayerProvider 持有全局宽度上限。
 * 同时存在多个根时，后登记的那份写在 html 上；卸掉以后回到上一份。
 * 不是栈顶的那份只把新值记下来，等它重新成为栈顶再写出去。
 */
export function retainLayerMaxInlineSize(token: object, value: string): void {
  const existing = holders.find(hold => hold.token === token)
  if (existing != null)
    existing.value = value
  else
    holders.push({ token, value })
  applyLayerMaxInlineSize()
}

/** 这一份根 provider 卸掉了。最后一份卸掉时，变量从 html 上删掉。 */
export function releaseLayerMaxInlineSize(token: object): void {
  const index = holders.findIndex(hold => hold.token === token)
  if (index !== -1)
    holders.splice(index, 1)
  applyLayerMaxInlineSize()
}

/** 只给测试用：清掉持有者，并删掉 html 上的变量。 */
export function resetLayerMaxInlineSizeForTests(): void {
  holders.length = 0
  if (typeof document !== 'undefined')
    document.documentElement.style.removeProperty(LAYER_MAX_INLINE_SIZE_VAR)
}
