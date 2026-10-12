import type { VNodeChild } from 'vue'

/** 容器外形。ellipse 按 ratio 裁成椭圆，1 比 1 时是正圆。 */
export type AspectRatioShape = 'rectangle' | 'ellipse'

/**
 * 子元素在比例框里的尺寸。
 * 不传时子元素自己负责尺寸。
 */
export type AspectRatioFit = 'cover' | 'contain' | 'center'

export interface AspectRatioProps {
  /**
   * 宽高比，宽除以高。16 比 9 写成 `16 / 9`。
   * 写在类上的 CSS 变量里，不写成行内 aspect-ratio，方便外部样式覆盖。
   */
  ratio: number
  /**
   * 容器外形。
   * @default 'rectangle'
   */
  shape?: AspectRatioShape
  /**
   * 子元素如何填满比例框。
   * cover 裁切，contain 留边，center 保持原始尺寸并居中。
   */
  fit?: AspectRatioFit
}

export interface AspectRatioSlots {
  /** 放进比例框的内容。fit 有值时只放一个子元素。 */
  default?: () => VNodeChild
}
