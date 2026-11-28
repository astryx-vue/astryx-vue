/**
 * @file TabBarItem.ts
 * @input 无
 * @output TabBarItem：描述一个标签的标记组件；readItems、overflowItems 等读标签的小工具，
 *   TabBar 和 TabBarMoreList 共用
 * @position TabBar 的标签描述。它自己不渲染任何东西，由 TabBar 读它的 props 画出标签。
 */

import type { PropType, VNode, VNodeChild } from 'vue'
import type { TabBarIcon, TabBarItemProps } from './types'
import { camelize, defineComponent, Fragment, isVNode } from 'vue'
import { formatMessage } from './messages'

/** TabBar 的一个标签。它自己不渲染任何东西：TabBar 读它的 props 画出标签（必须是 TabBar 的直接子节点）。 */
export const TabBarItem = defineComponent({
  name: 'AstryxTabBarItem',
  props: {
    value: { type: String, required: true },
    label: { type: String, required: true },
    icon: { type: [String, Object, Function] as PropType<TabBarIcon>, default: undefined },
    selectedIcon: { type: [String, Object, Function] as PropType<TabBarIcon>, default: undefined },
    badge: { type: [String, Number], default: undefined },
    badgeLabel: { type: String, default: undefined },
    panelId: { type: String, default: undefined },
    disabled: { type: Boolean, default: false },
  },
  setup() {
    return () => null
  },
})

function collect(children: VNodeChild, found: VNode[]): void {
  if (Array.isArray(children)) {
    for (const child of children)
      collect(child as VNodeChild, found)
    return
  }
  if (!isVNode(children))
    return
  if (children.type === TabBarItem)
    found.push(children)
  else if (children.type === Fragment)
    collect(children.children as VNodeChild, found)
}

function isTruthyFlag(value: unknown): boolean {
  return value === true || value === '' || value === 'true'
}

/** 从默认插槽的输出里按顺序读出 TabBarItem 的 props；别的节点忽略。 */
export function readItems(children: VNodeChild): TabBarItemProps[] {
  const vnodes: VNode[] = []
  collect(children, vnodes)
  return vnodes.map((vnode) => {
    const raw: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(vnode.props ?? {}))
      raw[camelize(key)] = value
    return {
      value: String(raw.value),
      label: String(raw.label ?? ''),
      icon: raw.icon as TabBarIcon | undefined,
      selectedIcon: raw.selectedIcon as TabBarIcon | undefined,
      badge: raw.badge as string | number | undefined,
      badgeLabel: raw.badgeLabel as string | undefined,
      panelId: raw.panelId as string | undefined,
      disabled: isTruthyFlag(raw.disabled),
    }
  })
}

/** 标签超过这么多个时，栏里显示前四个和「更多」。 */
export const MAX_TABS = 5

/** 标签超过五个时第四个之后的那些：「更多」里放的标签。 */
export function overflowItems(items: readonly TabBarItemProps[]): TabBarItemProps[] {
  return items.length > MAX_TABS ? items.slice(MAX_TABS - 1) : []
}

export function isDisabledItem(item: TabBarItemProps | undefined): boolean {
  return item?.disabled === true
}

export function hasBadge(badge: string | number | undefined): boolean {
  return badge != null && badge !== ''
}

/** 带角标的项的无障碍名称：标签名和角标放进同一条文案，标签和「更多」里的行念法一样。没有角标时是 undefined。 */
export function badgedName(item: TabBarItemProps, template: string): string | undefined {
  return hasBadge(item.badge)
    ? formatMessage(template, { label: item.label, badge: item.badgeLabel ?? String(item.badge) })
    : undefined
}
