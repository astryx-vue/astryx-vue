/**
 * @file createSwipe.ts
 * @input 每一侧声明的操作和收场方式
 * @output createSwipe：造出行的 `swipe` 属性要的 Swipe 值；createSwipeHost：一组操作对应的 host
 * @position 横滑操作的公开入口，也决定横滑服务哪些行。Item 读出值里的操作后交给
 *   SwipeActionsLayer 和 useSwipeAction 跑手势。由 createSwipe.test.ts 和 Item 的测试覆盖。
 */

import type { CreateSwipeOptions, ItemSwipeBehavior, Swipe, SwipeEntry, SwipeHost, SwipeRowFacts } from './swipeHost'
import { devWarn } from '../composables/useDevWarning'
import { makeSwipe } from './swipeHost'

/**
 * 内容模型允许可交互后代的 role，面板里的按钮才能放进行里。
 * 没有 role 的行也算；`option`、`menuitem*` 等不算。
 */
const SWIPE_ROLES = new Set(['listitem'])

/**
 * 横滑是否服务一行：行的 role 允许可交互后代（面板的按钮就是这种后代）。
 * 禁用的行、作为内部控件放大点击区的行不服务。
 */
function serves({ role, isDisabled, isDelegate }: SwipeRowFacts): boolean {
  return !isDisabled && !isDelegate && (role == null || SWIPE_ROLES.has(role))
}

/**
 * 一组操作和收场方式对应的 host：createSwipe 和行上已弃用的 `swipeActions` 共用它，
 * 所以两条路的规则和手感一致。
 */
export function createSwipeHost(
  leading: ReadonlyArray<SwipeEntry>,
  trailing: ReadonlyArray<SwipeEntry>,
  behavior: ItemSwipeBehavior,
): SwipeHost {
  const hasEntries = leading.length > 0 || trailing.length > 0
  return {
    leading,
    trailing,
    behavior,
    serves: facts => hasEntries && serves(facts),
  }
}

/**
 * 造一行的横滑操作：横向拖动在每一侧露出的动词（声明成数据），以及横滑怎么收场。
 * 把结果作为 `swipe` 传给 `Item` 或 `ListItem`。它是普通函数而不是组合式函数，纯且便宜：
 * 可以在模块顶层、组件外、服务端调用，导入和调用都不碰 DOM。每个操作的 `onActivate`
 * 收到操作的 `id` 和行的 `itemKey`，所以模块顶层一份定义就能服务所有行；处理函数要用
 * 组件状态时放进 `computed`。横滑不自带任何文案：它露出的每个名字都是调用方的 `label`。
 *
 * @example
 * ```ts
 * const mailSwipe = createSwipe({
 *   trailing: [
 *     { id: 'archive', label: '归档', onActivate: ({ itemKey }) => archive(itemKey) },
 *     { id: 'delete', label: '删除', onActivate: ({ itemKey }) => remove(itemKey), variant: 'destructive', hasRemoval: true },
 *   ],
 * })
 * ```
 * ```vue
 * <ListItem label="收件箱" :item-key="message.id" :swipe="mailSwipe" />
 * ```
 */
export function createSwipe<const Id extends string>(options: CreateSwipeOptions<Id>): Swipe<Id> {
  const leading = Object.freeze([...(options.leading ?? [])])
  const trailing = Object.freeze([...(options.trailing ?? [])])
  const behavior = options.swipeBehavior ?? 'reveal'
  if (behavior === 'commit' && (leading.length > 1 || trailing.length > 1)) {
    // commit 的一侧从不停开，全滑没有停开的行可以确认。
    devWarn(
      'createSwipe',
      '`swipeBehavior: \'commit\'` fires no entry on a side with two or more '
      + 'entries. Give a committing side one entry, or use `swipeBehavior: \'reveal\'`.',
    )
  }
  return makeSwipe<Id>(createSwipeHost(leading, trailing, behavior))
}
