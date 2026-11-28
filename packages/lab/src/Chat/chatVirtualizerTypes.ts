/**
 * ChatVirtualizer 的公开类型，和各模块共用的内部数据形状。
 */

/** 暴露出来的两个方法都是「声明」：说清要停在哪，列表自己收敛过去，不是一次性滚动。 */
export interface ChatVirtualizerExpose {
  /** 停在离底边 `px` 像素的位置。0 就是贴底跟随新消息。 */
  scrollToDistanceFromBottomPx: (px?: number) => void
  /**
   * 把某一行固定在视口里离顶边 `viewportOffset` 像素的位置（0 = 行顶贴着视口顶，
   * 「把刚发出的提问顶到最上面」就是这个用法）。上方的行再怎么变高，这一行都不动。
   * 位置会夹在可滚动范围内；`key` 必须在当前数据里，找不到就在下一轮回到贴底跟随。
   */
  anchorToKey: (key: string, viewportOffset?: number) => void
}

export interface ChatVirtualizerProps<T = unknown> {
  /** 行数据。整体替换数组，不要原地修改元素。 */
  data: readonly T[]
  /** 每行稳定的字符串身份（内部会用 String() 转一次）。不要用下标当身份。 */
  getRowKey: (item: T, index: number) => string | number
  /**
   * 还没量过的行按多高估算（px），或者一个函数。传函数时以函数为准，不再用量出来的平均值。
   * 宁小勿大：估小了内容只会往下长，位置仍然有效；估大了内容收缩时浏览器会把位置夹掉。
   * 函数请保持同一个引用，每次换新函数会让所有行重新估价。
   * @default 120
   */
  estimatedItemSize?: number | ((item: T, index: number) => number)
  /** 给行分类：量出来的高度按类型各算一个平均值。请保持同一个函数引用。 */
  getItemType?: (item: T, index: number) => string
  /**
   * 挂载模式：传调用方自己的滚动容器（不自带跟随逻辑的那种，例如页面主体或
   * `document.scrollingElement`），列表只渲染一块内容放进去。不传就渲染自己的滚动容器。
   * 元素还没拿到时传 `null`（不是 undefined）：null 表示挂载模式在等待。
   * 行间距要写在行里面（padding），不要用容器的 gap 或行的 margin。
   */
  scrollElement?: HTMLElement | null
  /**
   * 往下滚到离底边多少像素以内，重新开始跟随新消息。离开跟随看的是往上挪了多远。
   * @default 24
   */
  endThreshold?: number
  /** 视口上方多渲染多少像素的行。@default 1600 */
  overscanTop?: number
  /** 视口下方多渲染多少像素的行。@default 600 */
  overscanBottom?: number
  /** 只用于自带容器：滚动容器的无障碍名称。默认是翻译过的「Messages」。 */
  label?: string
}

export interface ChatVirtualizerSlots<T = unknown> {
  /** 每一行的内容。 */
  default?: (props: { item: T, index: number }) => unknown
}

/** 列表的参照系：贴着底边（离底多少像素），或者盯住一行。 */
export interface AnchorMode { kind: 'anchor', key: string, viewportOffset: number }
export type ScrollMode = { kind: 'end', distance: number } | AnchorMode

/** 挂载着的行区间（含两端）。`end < start` 表示一行都没挂。 */
export interface RowWindow { start: number, end: number }

/** 每行在内容里的起点，加上总高度和身份索引。 */
export interface RowGeometry {
  offsets: number[]
  total: number
  keys: string[]
  index: Map<string, number>
}

/** 一次读完的滚动位置和尺寸。 */
export interface ViewportRead {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
}

export function readViewport(el: HTMLElement): ViewportRead {
  return { scrollTop: el.scrollTop, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }
}
