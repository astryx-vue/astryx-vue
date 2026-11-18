import type { FunctionalComponent, VNode } from 'vue'
import type { IconColor } from '../Icon/types.js'
import type { SelectorOptionIcon } from './types.js'
import { h, isVNode } from 'vue'
import Icon from '../Icon/Icon.vue'

interface SelectorIconProps {
  icon: SelectorOptionIcon
  color?: IconColor
}

/**
 * 同上游 renderIconSlot：图标名、组件、渲染函数套进 sm 尺寸的 Icon 盒子；
 * 现成的 VNode（比如 `h(StatusDot)`、`h(Avatar, { size: 'xsm' })`）原样画，不再套 16px 的盒子。
 */
const SelectorIcon: FunctionalComponent<SelectorIconProps> = (props): VNode => {
  if (isVNode(props.icon))
    return props.icon
  // class 等透传属性由 Vue 自动落到返回的根节点上
  return h(Icon, { icon: props.icon, size: 'sm', color: props.color })
}
SelectorIcon.props = ['icon', 'color']

export default SelectorIcon
