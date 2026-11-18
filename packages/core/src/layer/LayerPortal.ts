import type { FunctionalComponent, TeleportProps } from 'vue'
import { h, Teleport } from 'vue'

export interface LayerPortalProps {
  /** 原地渲染，不传送。 */
  inline: boolean
  to: TeleportProps['to']
}

/**
 * 内联时原地渲染子树，否则传送到 `to`。
 *
 * 不用 `<Teleport :disabled>`：Vue 3.5 水合 disabled Teleport 时先水合原地的子树，
 * 子树里再传送到同一目标的 Teleport 会占走外层在目标里留下的空锚点块，外层随后又把
 * 目标的水合游标拨回原处。之后传送到同一目标的每一层都会对上前一层的服务端 HTML，
 * 整页 hydration 错位。不经过 Teleport 就不会在目标里留下这个空块。
 */
const LayerPortal: FunctionalComponent<LayerPortalProps> = (props, { slots }) => (
  props.inline
    ? slots.default?.()
    : h(Teleport, { to: props.to }, slots.default?.() ?? [])
)

LayerPortal.props = ['inline', 'to']
LayerPortal.displayName = 'LayerPortal'

export default LayerPortal
