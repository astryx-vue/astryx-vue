/**
 * @file triggerActivation.ts
 * @input 触发器需要的状态读取函数、面板开关和调用方回调
 * @output 一对带禁用守卫的 click 与 keydown 处理函数
 * @position Selector 内置触发器的激活入口（spec:AST-085 FR2）
 */

import { consumeWhileDisabled } from '../utils/disabledInteraction.js'

export interface TriggerActivationOptions {
  isDisabled: () => boolean
  canActivate: () => boolean
  toggle: () => void
  emitClick: (event: MouseEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
}

export interface TriggerActivation {
  onClick: (event: MouseEvent) => void
  onKeyDown: (event: KeyboardEvent) => void
}

export function createTriggerActivation(options: TriggerActivationOptions): TriggerActivation {
  return {
    onClick(event: MouseEvent): void {
      if (consumeWhileDisabled(event, options.isDisabled()))
        return
      // 先透出点击再切换面板，preventDefault 不阻断打开。
      options.emitClick(event)
      if (options.canActivate())
        options.toggle()
    },
    onKeyDown(event: KeyboardEvent): void {
      if (consumeWhileDisabled(event, options.isDisabled()))
        return
      options.onKeyDown(event)
    },
  }
}
