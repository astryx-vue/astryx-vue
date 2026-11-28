/**
 * 浮层进场从它落在的那一侧滑进来（上游 Layer/layerEntranceSide.ts）。
 *
 * 浮层摆好之后（翻到另一侧也算），按浮层和锚点两个盒子算出：往锚点方向退一步
 * 的方向、缩放的原点（浮层朝锚点那条边上、正对锚点中心的点）、两者之间的空隙。
 * 结果写成四个 CSS 自定义属性，各浮层样式表里的进场关键帧读它们；没写时关键帧
 * 退回按 placement 的方向。退的那一步不超过空隙，所以进场的任何一帧都不会盖到
 * 锚点；贴着或盖住锚点的浮层不移动，只缩放。
 */

/** 横向往锚点退一步：-1 向左、0、1 向右。 */
export const LAYER_ENTER_X_PROPERTY = '--_astryx-layer-enter-x'
/** 纵向往锚点退一步：-1 向上、0、1 向下。 */
export const LAYER_ENTER_Y_PROPERTY = '--_astryx-layer-enter-y'
/** 缩放原点，从浮层左上角量起的 px。 */
export const LAYER_ENTER_ORIGIN_PROPERTY = '--_astryx-layer-enter-origin'
/** 浮层和锚点之间的空隙：退的那一步最多这么长。 */
export const LAYER_ENTER_GAP_PROPERTY = '--_astryx-layer-enter-gap'

export interface EntranceBox {
  readonly left: number
  readonly top: number
  readonly width: number
  readonly height: number
}

export interface LayerEntranceSide {
  /** 进场的起点：每个轴上往锚点退的一步。 */
  readonly x: -1 | 0 | 1
  readonly y: -1 | 0 | 1
  /** 浮层和锚点相接的点，从浮层左上角量起的 px。 */
  readonly originX: number
  readonly originY: number
  /**
   * 步进那个轴上浮层和锚点之间的空隙，px。锚点是一个点（每边不超过 1px，比如
   * 右键菜单的指针位置）时为 `null`，这时退满一步。
   */
  readonly gap: number | null
}

const clamp = (value: number, max: number): number => Math.min(max, Math.max(0, value))

/**
 * `layer` 相对 `anchor` 落在哪一侧。两个中心在哪个轴上按各自半尺寸之和归一后
 * 离得更远，就算哪一侧，所以和锚点重叠几个像素的子菜单仍有一侧；盖住锚点中心的
 * 浮层（选中项对齐触发器的列表）没有侧，原地以锚点中心缩放。没有尺寸时返回 `null`。
 */
export function layerEntranceSide(layer: EntranceBox, anchor: EntranceBox): LayerEntranceSide | null {
  if (layer.width <= 0 || layer.height <= 0)
    return null
  const anchorX = anchor.left + anchor.width / 2
  const anchorY = anchor.top + anchor.height / 2
  const originX = clamp(anchorX - layer.left, layer.width)
  const originY = clamp(anchorY - layer.top, layer.height)
  const isPoint = anchor.width <= 1 && anchor.height <= 1
  const coversAnchor = originX > 0 && originX < layer.width && originY > 0 && originY < layer.height
  if (coversAnchor)
    return { x: 0, y: 0, originX, originY, gap: 0 }

  const apartX = (layer.left + layer.width / 2 - anchorX) / ((layer.width + anchor.width) / 2)
  const apartY = (layer.top + layer.height / 2 - anchorY) / ((layer.height + anchor.height) / 2)
  if (Math.abs(apartY) >= Math.abs(apartX)) {
    const below = apartY > 0
    const room = below ? layer.top - (anchor.top + anchor.height) : anchor.top - (layer.top + layer.height)
    return { x: 0, y: below ? -1 : 1, originX, originY: below ? 0 : layer.height, gap: isPoint ? null : Math.max(0, room) }
  }
  const right = apartX > 0
  const room = right ? layer.left - (anchor.left + anchor.width) : anchor.left - (layer.left + layer.width)
  return { x: right ? -1 : 1, y: 0, originX: right ? 0 : layer.width, originY, gap: isPoint ? null : Math.max(0, room) }
}

const px = (value: number): string => `${Math.round(value * 1000) / 1000}px`

/**
 * 把浮层落在的一侧交给它的进场。`null` 把四个属性都设成 `initial`：进场退回
 * placement 的方向，里面嵌套的浮层也不会继承到外层的值。
 */
export function writeLayerEntranceSide(layer: HTMLElement, side: LayerEntranceSide | null): void {
  layer.style.setProperty(LAYER_ENTER_X_PROPERTY, side == null ? 'initial' : String(side.x))
  layer.style.setProperty(LAYER_ENTER_Y_PROPERTY, side == null ? 'initial' : String(side.y))
  layer.style.setProperty(LAYER_ENTER_ORIGIN_PROPERTY, side == null ? 'initial' : `${px(side.originX)} ${px(side.originY)}`)
  // 向下取整，四舍五入不会让那一步越过锚点的边。
  const gap = side?.gap == null ? null : Math.floor(side.gap * 1000) / 1000
  layer.style.setProperty(LAYER_ENTER_GAP_PROPERTY, gap == null ? 'initial' : `${gap}px`)
}
