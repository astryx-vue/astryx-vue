/**
 * @file NavigationScreen.ts
 * @input 无
 * @output NavigationScreen：描述一屏的标记组件（标题、返回名、标题显示方式、内容和栏尾部内容）；
 *   readScreen：从 NavigationStack 的插槽输出里读出这一屏的描述
 * @position NavigationStack 的屏幕描述。它自己不渲染任何东西，由栈把标题放进栏、内容放进卡片。
 */

import type { PropType, SlotsType, VNode, VNodeChild } from 'vue'
import type { NavigationScreenProps, NavigationScreenSlots, NavigationTitleDisplayMode } from './types'
import { camelize, defineComponent, Fragment, isVNode } from 'vue'

/**
 * NavigationStack 里的一屏。它的 props 和插槽描述这一屏（标题、返回名、内容、栏尾部内容），
 * 布局由栈来做；单独放着时什么都不渲染。
 */
export const NavigationScreen = defineComponent({
  name: 'AstryxNavigationScreen',
  props: {
    title: { type: String, required: true },
    backTitle: { type: String, default: undefined },
    titleDisplayMode: { type: String as PropType<NavigationTitleDisplayMode>, default: 'inline' },
  },
  slots: Object as SlotsType<NavigationScreenSlots>,
  setup() {
    return () => null
  },
})

/** 栈读到的一屏：props，加上内容和栏尾部内容的渲染函数。 */
export interface ScreenDescriptor extends Required<Pick<NavigationScreenProps, 'title' | 'titleDisplayMode'>> {
  readonly backTitle: string | undefined
  readonly content: (() => VNodeChild) | undefined
  readonly endContent: (() => VNodeChild) | undefined
}

const EMPTY_SCREEN: ScreenDescriptor = {
  title: '',
  titleDisplayMode: 'inline',
  backTitle: undefined,
  content: undefined,
  endContent: undefined,
}

function findScreen(children: VNodeChild): VNode | null {
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = findScreen(child as VNodeChild)
      if (found != null)
        return found
    }
    return null
  }
  if (!isVNode(children))
    return null
  if (children.type === NavigationScreen)
    return children
  return children.type === Fragment ? findScreen(children.children as VNodeChild) : null
}

/**
 * 插槽输出里的第一个 NavigationScreen 的描述。模板里写的 `title-display-mode`、
 * `#end-content` 和驼峰写法都认。没有 NavigationScreen 时是一块没有标题的空屏。
 */
export function readScreen(children: VNodeChild): ScreenDescriptor {
  const vnode = findScreen(children)
  if (vnode == null)
    return EMPTY_SCREEN
  const props: Record<string, unknown> = {}
  for (const [name, value] of Object.entries(vnode.props ?? {}))
    props[camelize(name)] = value
  const slots: Record<string, (() => VNodeChild) | undefined> = {}
  if (vnode.children != null && typeof vnode.children === 'object' && !Array.isArray(vnode.children)) {
    for (const [name, value] of Object.entries(vnode.children)) {
      if (typeof value === 'function')
        slots[camelize(name)] = value as () => VNodeChild
    }
  }
  return {
    title: typeof props.title === 'string' ? props.title : '',
    backTitle: typeof props.backTitle === 'string' ? props.backTitle : undefined,
    titleDisplayMode: props.titleDisplayMode === 'large' ? 'large' : 'inline',
    content: slots.default,
    endContent: slots.endContent,
  }
}
