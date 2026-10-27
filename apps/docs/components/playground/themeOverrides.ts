/**
 * Advanced 和 Components 面板写进主题的那部分数据：
 * 清洗外来数据、增删改、把组件变量合成主题的 `components` 覆盖，以及编译成预览用的 CSS。
 */
import type { ComponentStyleMap } from '@astryx-vue/core/Theme'
import type { CustomOverride, ThemeState } from './themeTypes'
import { defineTheme } from '@astryx-vue/core/Theme'
import { ALL_COMPONENT_NAMES, COMPONENT_VAR_TO_OVERRIDE } from './themeTokensComponents'

const MAX_TOKENS = 300
const MAX_CUSTOM_OVERRIDES = 50
const MAX_VALUE_LENGTH = 400
const TOKEN_NAME = /^--astryx-[a-z0-9-]+$/
const OVERRIDE_PROPERTY = /^(?:[a-z][a-z0-9]*|--[\w-]+)$/i
const UNSAFE_VALUE = /[;{}<>\\]/

/** 会让一个值写成不止一条声明的字符一律拒绝。 */
export function isSafeValue(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= MAX_VALUE_LENGTH && !UNSAFE_VALUE.test(value)
}

/** 空字符串表示「回到默认」，直接删掉这个键。 */
function setOrDelete(map: Record<string, string>, name: string, value: string): void {
  if (value.trim() === '')
    delete map[name]
  else
    map[name] = value
}

export function setToken(theme: ThemeState, name: string, value: string): void {
  if (TOKEN_NAME.test(name) && (value.trim() === '' || isSafeValue(value)))
    setOrDelete(theme.tokens, name, value)
}

export function setComponentToken(theme: ThemeState, name: string, value: string): void {
  if (name in COMPONENT_VAR_TO_OVERRIDE && (value.trim() === '' || isSafeValue(value)))
    setOrDelete(theme.componentTokens, name, value)
}

/** 下一个自定义覆盖的 id，接在已有最大序号后面，避免重复。 */
function nextOverrideId(theme: ThemeState): string {
  const max = theme.customOverrides.reduce((top, item) => {
    const number = Number.parseInt(item.id.replace('custom-', ''), 10)
    return Number.isNaN(number) ? top : Math.max(top, number + 1)
  }, 0)
  return `custom-${max}`
}

export function addCustomOverride(theme: ThemeState, entry: Omit<CustomOverride, 'id'>): boolean {
  if (!isValidOverride(entry) || theme.customOverrides.length >= MAX_CUSTOM_OVERRIDES)
    return false
  theme.customOverrides = [...theme.customOverrides, { id: nextOverrideId(theme), ...entry }]
  return true
}

export function removeCustomOverride(theme: ThemeState, id: string): void {
  theme.customOverrides = theme.customOverrides.filter(item => item.id !== id)
}

export function updateCustomOverride(theme: ThemeState, id: string, value: string): void {
  if (!isSafeValue(value))
    return
  theme.customOverrides = theme.customOverrides.map(item => item.id === id ? { ...item, value } : item)
}

function isValidOverride(entry: Omit<CustomOverride, 'id'>): boolean {
  return (ALL_COMPONENT_NAMES as readonly string[]).includes(entry.component)
    && OVERRIDE_PROPERTY.test(entry.property)
    && isSafeValue(entry.value)
}

/** 调了某组阶梯，这一组里手改过的 token 就不再有意义，一并清掉。 */
const SCALE_TOKEN_PREFIXES: Record<string, readonly string[]> = {
  typeSize: ['--astryx-font-size-'],
  typeScale: ['--astryx-font-size-'],
  radius: ['--astryx-radius-'],
  spacing: ['--astryx-spacing-'],
  elementSize: ['--astryx-size-element-'],
  duration: ['--astryx-duration-'],
}

export function clearScaleTokens(theme: ThemeState, key: string): void {
  const prefixes = SCALE_TOKEN_PREFIXES[key]
  if (!prefixes)
    return
  for (const name of Object.keys(theme.tokens)) {
    if (prefixes.some(prefix => name.startsWith(prefix)))
      delete theme.tokens[name]
  }
}

/** 基础面板的颜色改了，同名的手改 token 让位。 */
export function clearToken(theme: ThemeState, name: string): void {
  delete theme.tokens[name]
}

/** 组件变量和自定义覆盖合成的 `components`。后者覆盖前者。 */
export function buildComponentStyles(theme: ThemeState): ComponentStyleMap {
  const components: ComponentStyleMap = {}
  const put = (component: string, property: string, value: string): void => {
    components[component] ??= {}
    components[component].base ??= {}
    components[component].base[property] = value
  }
  for (const [name, value] of Object.entries(theme.componentTokens)) {
    for (const target of COMPONENT_VAR_TO_OVERRIDE[name] ?? [])
      put(target.component, target.cssProperty, value)
  }
  for (const item of theme.customOverrides)
    put(item.component, item.property, item.value)
  return components
}

/**
 * 组件覆盖编译出的样式表，作用在带 `data-astryx-theme="neutral"` 的根元素下。
 * 没有覆盖或编译失败时返回空串。
 */
export function componentCss(theme: ThemeState): string {
  const components = buildComponentStyles(theme)
  if (Object.keys(components).length === 0)
    return ''
  try {
    return defineTheme({ name: 'neutral', components }).css ?? ''
  }
  catch {
    return ''
  }
}

/** 从分享链接等外部数据里取出合法的 token 表。 */
export function sanitizeTokenMap(value: unknown, allow: (name: string) => boolean): Record<string, string> {
  const result: Record<string, string> = {}
  if (!value || typeof value !== 'object')
    return result
  for (const [name, raw] of Object.entries(value).slice(0, MAX_TOKENS)) {
    if (allow(name) && isSafeValue(raw))
      result[name] = raw
  }
  return result
}

export function sanitizeTokens(value: unknown): Record<string, string> {
  return sanitizeTokenMap(value, name => TOKEN_NAME.test(name))
}

export function sanitizeComponentTokens(value: unknown): Record<string, string> {
  return sanitizeTokenMap(value, name => name in COMPONENT_VAR_TO_OVERRIDE)
}

export function sanitizeCustomOverrides(value: unknown): CustomOverride[] {
  if (!Array.isArray(value))
    return []
  const result: CustomOverride[] = []
  for (const item of value.slice(0, MAX_CUSTOM_OVERRIDES)) {
    if (!item || typeof item !== 'object')
      continue
    const { component, property, value: text } = item as Record<string, unknown>
    if (typeof component !== 'string' || typeof property !== 'string' || typeof text !== 'string')
      continue
    const entry = { component, property, value: text }
    if (isValidOverride(entry))
      result.push({ id: `custom-${result.length}`, ...entry })
  }
  return result
}
