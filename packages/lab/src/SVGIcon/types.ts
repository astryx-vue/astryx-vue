export type SVGIconVariation = 'linear' | 'bold' | 'twotone' | 'bulk' | 'broken'

export type SVGIconSize = 'xsm' | 'sm' | 'md' | 'lg'

export type SVGIconColor
  = | 'primary'
    | 'secondary'
    | 'disabled'
    | 'accent'
    | 'positive'
    | 'negative'
    | 'warning'
    | 'inherit'

/**
 * 一个图形元素在不同变体下的表现：
 * - `fill`：闭合形状。linear 里描边，bold 里填充。
 * - `stroke`：线条和细节。所有变体下都保持描边。
 */
export type IconShapeRole = 'fill' | 'stroke'

/** 图标一层里的一个图形元素。 */
export interface IconShape {
  /** SVG 元素类型。 */
  type: 'path' | 'circle' | 'rect' | 'line' | 'polyline' | 'polygon'
  /** 这个元素的 SVG 属性（d、cx、cy、r、points、x1、y1 等）。 */
  attrs: Record<string, string>
  /**
   * 这个元素在不同变体下的表现。
   * @default 'fill'
   */
  role?: IconShapeRole
}

/** 一个图标图形的定义。 */
export interface SVGIconDef {
  /** 显示名。 */
  name: string
  /** 视口尺寸。 @default '0 0 24 24' */
  viewBox?: string
  /** 主层图形（主体轮廓）。 */
  primary: IconShape[]
  /** 次层图形（细节）。 */
  secondary?: IconShape[]
}

export interface SVGIconProps {
  /** 图标定义，带路径数据。 */
  icon: SVGIconDef
  /**
   * 变体预设。
   * @default 'linear'
   */
  variation?: SVGIconVariation
  /**
   * 尺寸，带光学描边补偿：越小描边越粗。
   * @default 'md'
   */
  size?: SVGIconSize
  /**
   * 语义颜色。
   * @default 'primary'
   */
  color?: SVGIconColor
  /** 直接指定描边宽度，绕过光学补偿。 */
  strokeWidth?: number
}
