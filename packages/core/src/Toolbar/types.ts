import type { SpacingStep } from '../Stack/types.js'

export type ToolbarSize = 'sm' | 'md' | 'lg'
export type ToolbarOrientation = 'horizontal' | 'vertical'

export interface ToolbarProps {
  /** 工具栏的无障碍名称。 */
  label: string
  /** 高度档，也决定默认的块方向内边距。 @default 'md' */
  size?: ToolbarSize
  /** 每一组里各项的间距。 @default 1 */
  gap?: SpacingStep
  /** 方向键沿哪一根轴移动焦点。 @default 'horizontal' */
  orientation?: ToolbarOrientation
}

export interface ToolbarSlots {
  start?: () => unknown
  center?: () => unknown
  end?: () => unknown
}
