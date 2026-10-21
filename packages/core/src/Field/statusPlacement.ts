export type StatusPlacement = 'attached' | 'detached' | 'tooltip'

/**
 * 次要和幽灵触发器把贴在控件下的状态说明挪开，避免把工具栏撑高。
 * tooltip 和已经写明的 detached 保持原样。
 */
export function fieldStatusPlacement(variant: string | undefined, statusVariant: StatusPlacement): StatusPlacement {
  const quiet = variant === 'ghost' || variant === 'secondary'
  return quiet && statusVariant === 'attached' ? 'detached' : statusVariant
}
