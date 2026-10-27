import type { Component } from 'vue'
import { h } from 'vue'

/**
 * 加号。语义图标表里没有 `add`，所以自己画一个，
 * 仍然交给 core `Icon` 渲染，尺寸和颜色走同一条管线。
 */
export const PlusIcon: Component = () => h(
  'svg',
  { 'viewBox': '0 0 24 24', 'fill': 'none', 'stroke': 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  [h('path', { d: 'M5 12h14' }), h('path', { d: 'M12 5v14' })],
)

/** 拖动手柄。语义图标表里没有 `grip`，同样自己画。 */
export const GripVerticalIcon: Component = () => h(
  'svg',
  { 'viewBox': '0 0 24 24', 'fill': 'none', 'stroke': 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  [5, 12, 19].flatMap(cy => [9, 15].map(cx => h('circle', { cx, cy, r: 1 }))),
)
