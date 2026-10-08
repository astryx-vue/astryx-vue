/** 标准对话框按 `width` 与 `maxHeight` 定尺寸；全屏对话框占满视口。 */
export type DialogVariant = 'standard' | 'fullscreen'

/**
 * 控制关闭方式：
 * - `required`：必须响应，禁用 Escape 与点击遮罩关闭；
 * - `form`：允许 Escape，禁用点击遮罩关闭，避免误丢失输入；
 * - `info`：允许 Escape 与点击遮罩关闭。
 */
export type DialogPurpose = 'required' | 'form' | 'info'

/** 内边距步进，对应 `--astryx-spacing-*` 令牌。 */
export type DialogPadding = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10

/** 块方向偏移，始终可用。 */
export interface DialogBlockPosition {
  top?: number | string
  bottom?: number | string
}

/**
 * 对话框的静态位置。行内方向使用逻辑属性 `start` / `end`，RTL 下自动镜像。
 */
export interface DialogPosition extends DialogBlockPosition {
  start?: number | string
  end?: number | string
}

export interface DialogProps {
  /** 对话框是否打开。 */
  isOpen: boolean
  /** 以普通文档流渲染内容，不使用 `<dialog>`、遮罩与模态行为，仅用于文档预览。 */
  isInline?: boolean
  /** 首选宽度。数字为像素，字符串原样使用。全屏变体忽略此项。 */
  width?: number | string
  /** 最大高度。数字为像素，字符串原样使用。全屏变体忽略此项。 */
  maxHeight?: number | string
  /** 静态位置。未设置时居中。全屏变体忽略此项。 */
  position?: DialogPosition
  /** 对话框变体。 */
  variant?: DialogVariant
  /** 关闭方式。 */
  purpose?: DialogPurpose
  /** 内边距。未设置时使用主题默认值。 */
  padding?: DialogPadding
}

export interface DialogHeaderProps {
  /** 对话框标题。它会命名父级对话框，并在对话框打开时获得默认焦点。 */
  title: string
  /** 标题下方的副标题。为空字符串时不渲染。 */
  subtitle?: string
  /** 是否显示关闭按钮。点击时发出 `openChange(false)`。 */
  hasCloseButton?: boolean
  /** 关闭按钮的无障碍名称。 */
  closeButtonLabel?: string
}
