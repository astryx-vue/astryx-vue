import type { NavLinkComponent } from '../NavItem/types.js'

/** 上一页和下一页之间显示什么。 */
export type PaginationVariant = 'pages' | 'count' | 'compact' | 'dots' | 'input' | 'none'

/** 控件尺寸。 */
export type PaginationSize = 'sm' | 'md'

export interface PaginationProps {
  /** 当前页码（1-based） */
  page?: number
  /** 每页条目数 */
  pageSize?: number
  /** 总条目数。和 `totalPages` 同时存在时以总条目数为准。 */
  total?: number
  /**
   * 总页数。没有总条目数时使用，例如圆点轮播。
   */
  totalPages?: number
  /**
   * 中间区域的形态。
   * `pages` 是页码，`count` 是「起–止 / 总数」，`compact` 是「第几页 / 共几页」
   * （首尾按钮默认不显示，可用 `hasFirstLast` 打开），`dots` 是圆点，
   * `input` 是可输入的页码，`none` 只留上一页和下一页。
   * @default 'pages'
   */
  variant?: PaginationVariant
  /**
   * `pages` 形态下，当前页两侧各留几个页码。不传时宽容器是 1，窄容器会再收一档。
   */
  siblingCount?: number
  /**
   * 上一页 / 下一页每次跳几页。越过边界时停在第一页或最后一页。
   * @default 1
   */
  step?: number
  /**
   * 总数还不知道时，后面是否还有内容。`total` 大于 0 时以总条目数为准，这个值不再生效。
   */
  hasMore?: boolean
  /**
   * `input` 形态里，输入框前面的名词。不传时用当前语言的「Page」或「页」。
   */
  pageLabel?: string
  /**
   * 是否在上一页 / 下一页外侧放跳到首尾的按钮。
   * `input` 形态默认显示（传 `false` 关闭）；`compact` 形态只在传 `true` 时显示；
   * 其他形态忽略这个属性。总页数未知（游标 / hasMore 分页）时两个按钮都不显示。
   * `null` 和缺省是同一件事。布尔属性缺省会被当成 false，所以这里用 null 表示没指定。
   * @default `input` 为 true，`compact` 为 false
   */
  hasFirstLast?: boolean | null
  /**
   * 返回某一页的地址。设置后，页码、上一页、下一页、首页和末页控件渲染成指向该地址的链接，
   * 页面可以在新标签页打开、可以复制地址，脚本加载前也能用。激活链接时仍会触发 `change`，
   * 用它更新状态或上报统计，不要在里面再导航，链接会自己导航。
   * 设置了 `pageSize`（或 `pageSizeOptions`）时，第二个参数是当前每页条数。
   * 圆点、页码输入框和每页条数选择器不是链接。选每页条数时，请在 `pageSizeChange` 里
   * 导航到新条数下第 1 页的地址。游标分页时，把前一页和后一页映射成游标的地址。
   * 地址遵循共享的导航规则，不安全的地址不会写进 `href`，那个控件的点击也不换页。
   */
  getPageHref?: (page: number, pageSize?: number) => string
  /** 给 `getPageHref` 生成的链接用的链接组件，例如路由链接。覆盖 `LinkProvider` 的默认值。 */
  as?: NavLinkComponent
  /**
   * 页码已经提交之后再跑的动作。控件会在它结束前标成忙碌，失败也不会把页码改回去。
   */
  changeAction?: (page: number) => void | Promise<void>
  /**
   * 控件高度。
   * @default 'md'
   */
  size?: PaginationSize
  /** 是否显示页面大小选择器 */
  showSizeChanger?: boolean
  /** 页面大小选项 */
  pageSizeOptions?: number[]
  /** 是否显示总数 */
  showTotal?: boolean
  /** 是否禁用（旧名字，和新名字 `isDisabled` 等价） */
  disabled?: boolean
  /** 是否禁用 */
  isDisabled?: boolean
  /** 导航区的无障碍名称。不传时用当前语言的「Pagination」或「分页」。 */
  label?: string
  /**
   * 总条目数，用来算总页数。和新版同名属性一致，优先于 `total` 和 `totalPages`。
   */
  totalItems?: number
  /** 上一页按钮文本 */
  prevLabel?: string
  /** 下一页按钮文本 */
  nextLabel?: string
  /** 每页文本 */
  pageSizeLabel?: string
}

export interface PaginationEmits {
  (event: 'update:page', value: number): void
  (event: 'update:pageSize', value: number): void
  /** 每页条目数变了，参数是新的页长。页码会同时回到第一页。 */
  (event: 'pageSizeChange', pageSize: number): void
  (event: 'change', page: number, pageSize: number): void
}

export interface PaginationSlots {
  /** 自定义总数显示 */
  total?: (props: { total: number, from: number, to: number }) => any
}
