/** 把驼峰属性名变成主题用的 data 属性名，例如 listStyle → data-list-style。 */
function themeDataAttributeName(prop: string): `data-${string}` {
  return `data-${prop.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`
}

/** 双引号 CSS 属性选择器里的值转义。 */
function escapeAttributeValue(value: string): string {
  let escaped = ''
  for (const char of value) {
    const codePoint = char.codePointAt(0) ?? 0
    if (
      char === '"'
      || char === '\\'
      || codePoint < 0x20
      || codePoint === 0x7F
    ) {
      escaped += `\\${(codePoint === 0 ? 0xFFFD : codePoint).toString(16)} `
    }
    else {
      escaped += char
    }
  }
  return escaped
}

/**
 * 把组件样式键编成 data 属性选择器后缀。
 *
 * `prop:value` 选择 `[data-prop="value"]`。裸状态选择 `[data-state="state"]`。
 * `+` 把多个条件接在同一个组件目标上。轴名留在选择器里，避免不同属性的相同值撞在一起。
 *
 * @example
 * parseStyleKey('base') // ''
 * parseStyleKey('variant:secondary') // '[data-variant="secondary"]'
 * parseStyleKey('checked+disabled') // '[data-checked="checked"][data-disabled="disabled"]'
 */
export function parseStyleKey(key: string): string {
  if (key === 'base')
    return ''

  return key
    .split('+')
    .map((part) => {
      const separator = part.indexOf(':')
      const prop = separator === -1 ? part : part.slice(0, separator)
      const value = separator === -1 ? part : part.slice(separator + 1)
      return `[${themeDataAttributeName(prop)}="${escapeAttributeValue(value)}"]`
    })
    .join('')
}
