import type { FieldStatusInput } from '../Field/types.js'
import type { SelectorProps } from './types.js'

/** 状态字符串、对象或没给，统一成一个类型名。 */
export function selectorStatusType(status: SelectorProps['status']): string {
  if (status == null || status === 'default')
    return 'default'
  if (typeof status === 'string')
    return status
  return status.type
}

/** 字段下方的状态消息：对象原样用，字符串状态配上 statusMessage。 */
export function selectorFieldStatus(status: SelectorProps['status'], statusMessage: string | undefined): FieldStatusInput | undefined {
  if (status && typeof status === 'object')
    return status
  const type = selectorStatusType(status)
  if (!statusMessage || type === 'default')
    return undefined
  return { type, message: statusMessage } as FieldStatusInput
}

/** 触发器里的状态图标：只有错误、警告、成功画，状态消息分离时也不画。 */
export function selectorStatusGlyph(type: string, placement: string): 'error' | 'warning' | 'success' | undefined {
  if ((type !== 'error' && type !== 'warning' && type !== 'success') || placement === 'detached')
    return undefined
  return type
}
