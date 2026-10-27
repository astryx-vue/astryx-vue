/**
 * 给组件测试用的入口：渲染一个组件状态，套上契约，必选期望失败或已知失败意外通过时让测试失败。
 *
 * 契约自测、报告和手动检查用更底层的 `checkAccessibilitySpec`，它只返回结果不断言。
 */
import type { BindingResult, CheckOptions } from './check'
import type { PatternContract } from './contract'
import { checkAccessibilitySpec } from './check'
import { createHappyDomHarness } from './harness/happy-dom'
import { blockingResults, formatFailures } from './report'

export interface ComponentStateOptions<Facts> extends Omit<CheckOptions<Facts>, 'spec' | 'mount' | 'unmount'> {
  readonly spec: PatternContract<Facts>
  /** 渲染要检查的组件状态。每条期望都会重新调用一次。 */
  readonly render: () => Promise<void> | void
  /** 找到带角色的那个主角元素。 */
  readonly subject: () => Element
  /** 两条期望之间清掉渲染结果。 */
  readonly cleanup: () => Promise<void> | void
}

/** 在 happy-dom 里检查一个组件状态，返回全部结果，不断言。 */
export function checkComponentState<Facts>(options: ComponentStateOptions<Facts>): Promise<BindingResult> {
  const { render, subject, cleanup, ...rest } = options
  return checkAccessibilitySpec({
    ...rest,
    mount: async () => {
      await render()
      return createHappyDomHarness(subject())
    },
    unmount: cleanup,
  })
}

/** 检查一个组件状态；有会拦截的结果就抛错，错误信息里写清楚是哪条期望、为什么。 */
export async function expectAccessibilitySpec<Facts>(options: ComponentStateOptions<Facts>): Promise<BindingResult> {
  const result = await checkComponentState(options)
  const failures = formatFailures(blockingResults([result]))
  if (failures !== '')
    throw new Error(`可访问性契约没通过：\n\n${failures}`)
  return result
}
