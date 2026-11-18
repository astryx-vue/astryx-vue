/**
 * 这些属性由组件自己算，不能让外面透传的值盖掉。
 * 其余的原生属性和事件监听（@keydown / @focus / @blur …）原样落到输入框上。
 */
const controlledAttrs = new Set([
  'id',
  'type',
  'role',
  'value',
  'class',
  'style',
  'disabled',
  'readonly',
  'autofocus',
  'placeholder',
  'tabindex',
  'autocomplete',
  'aria-describedby',
  'aria-expanded',
  'aria-controls',
  'aria-activedescendant',
  'aria-autocomplete',
  'aria-disabled',
  'aria-required',
])

/** 去掉组件自己控制的属性，剩下的落到输入框上。 */
export function pickInputAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)))
}
