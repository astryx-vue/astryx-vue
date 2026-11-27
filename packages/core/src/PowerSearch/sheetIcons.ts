import type { FunctionalComponent } from 'vue'
import { h } from 'vue'

/** 「添加筛选条件」按钮和一点就加的字段行末尾的加号。内置图形里没有加号。 */
export const PlusGlyph: FunctionalComponent = () => h('svg', {
  'viewBox': '0 0 24 24',
  'width': '1em',
  'height': '1em',
  'fill': 'none',
  'stroke': 'currentColor',
  'stroke-width': 2,
  'stroke-linecap': 'round',
  'aria-hidden': 'true',
}, [h('path', { d: 'M12 5v14M5 12h14' })])
