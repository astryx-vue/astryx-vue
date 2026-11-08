export type ZoomToolbarPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

export interface ChartZoomProps {
  /** 每次滚轮刻度的缩放速度。@default 0.1 */
  zoomSpeed?: number
  /** 只缩放和平移 x 轴。 */
  xOnly?: boolean
  /** 只缩放和平移 y 轴。 */
  yOnly?: boolean
  /** 工具栏位置；false 表示隐藏。@default 'top-right' */
  toolbar?: false | ZoomToolbarPosition
}

export interface ChartZoomEmits {
  xDomainChange: [domain: [number, number]]
  yDomainChange: [domain: [number, number]]
}
