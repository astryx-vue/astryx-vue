import type { Component } from 'vue'
import { Icon } from '@astryx-vue/core'
import { h } from 'vue'

/** 搜索框前面的放大镜。core 的 `TextInput.startIcon` 要的是组件，不是名字。 */
export const SearchIcon: Component = () => h(Icon, { icon: 'search' })

/** 空列表时用的项目符号图标，语义图标表里没有对应的名字。 */
export const ListBulletIcon: Component = () => h(
  'svg',
  { viewBox: '0 0 24 24', fill: 'none' },
  [
    h('path', {
      'd': 'M8.5 6h11M8.5 12h11M8.5 18h11',
      'stroke': 'currentColor',
      'stroke-width': '1.5',
      'stroke-linecap': 'round',
    }),
    ...[6, 12, 18].map(cy => h('circle', { cx: 4.5, cy, r: 1, fill: 'currentColor' })),
  ],
)
