/**
 * @file useMotionEngine.ts
 * @input core 的动效引擎（`@astryx-vue/core/internal/touch` 的 createMotionEngine）
 * @output useMotionEngine：一个稳定的动效引擎，和把它挂到元素上的模板 ref 函数
 * @position lab 组件内部用的动效引擎绑定，不从 lab 入口导出
 */

import type { MotionEngine, MotionEngineOptions } from '@astryx-vue/core/internal/touch'
import { createMotionEngine } from '@astryx-vue/core/internal/touch'
import { getCurrentScope, onScopeDispose } from 'vue'

export interface UseMotionEngine {
  /** 绑到被驱动元素的 `:ref` 上；函数本身不变。 */
  readonly ref: (element: unknown) => void
  /** 动效引擎，组件存活期间不变。 */
  readonly animator: MotionEngine
}

function asHTMLElement(value: unknown): HTMLElement | null {
  if (value == null || typeof value !== 'object')
    return null
  // 组件实例的 ref 拿它的根元素。
  const node = '$el' in value ? (value as { $el: unknown }).$el : value
  return node != null && typeof node === 'object' && (node as Node).nodeType === 1
    ? node as HTMLElement
    : null
}

/**
 * 一个通过模板 ref 挂到元素上的合成层动效引擎。引擎不改响应式状态，移动时组件
 * 不会重新渲染。元素卸载时引擎随之脱开：动画停下、值留着，重新挂上从这些值接着走。
 * `options` 只在创建时读一次。
 */
export function createMotionEngineRef(options?: MotionEngineOptions): UseMotionEngine {
  const animator = createMotionEngine(null, options)
  return {
    animator,
    ref: (element) => {
      const next = asHTMLElement(element)
      if (animator.element !== next)
        animator.attach(next)
    },
  }
}

/** 在组件里用：作用域结束时放开元素。 */
export function useMotionEngine(options?: MotionEngineOptions): UseMotionEngine {
  const engine = createMotionEngineRef(options)
  if (getCurrentScope() != null)
    onScopeDispose(() => engine.animator.attach(null))
  return engine
}
