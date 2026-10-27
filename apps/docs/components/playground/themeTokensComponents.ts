/**
 * Components 面板的数据：每个组件能改哪些变量、每个变量可选的值，
 * 以及变量落到主题 `components` 覆盖里的哪个组件、哪个 CSS 属性。
 */

export interface ComponentVarOption {
  value: string
  label: string
  /** 带上 token 时，选项后面显示它当前的实际值。 */
  token?: string
}

export interface ComponentVar {
  name: string
  default: string
  description: string
  options: ComponentVarOption[]
}

export interface ComponentVarGroup {
  label: string
  vars: ComponentVar[]
}

export interface ComponentTarget {
  component: string
  cssProperty: string
}

const RADIUS_OPTIONS: ComponentVarOption[] = [
  { value: 'var(--radius-none)', token: '--astryx-radius-none', label: 'None' },
  { value: 'var(--radius-inner)', token: '--astryx-radius-inner', label: 'Inner' },
  { value: 'var(--radius-element)', token: '--astryx-radius-element', label: 'Element' },
  { value: 'var(--radius-container)', token: '--astryx-radius-container', label: 'Container' },
  { value: 'var(--radius-page)', token: '--astryx-radius-page', label: 'Page' },
  { value: 'var(--radius-full)', token: '--astryx-radius-full', label: 'Full' },
]

const SPACING_OPTIONS: ComponentVarOption[] = [
  { value: 'var(--spacing-0-5)', token: '--astryx-spacing-0-5', label: '0.5' },
  { value: 'var(--spacing-1)', token: '--astryx-spacing-1', label: '1' },
  { value: 'var(--spacing-2)', token: '--astryx-spacing-2', label: '2' },
  { value: 'var(--spacing-3)', token: '--astryx-spacing-3', label: '3' },
  { value: 'var(--spacing-4)', token: '--astryx-spacing-4', label: '4' },
  { value: 'var(--spacing-6)', token: '--astryx-spacing-6', label: '6' },
  { value: 'var(--spacing-8)', token: '--astryx-spacing-8', label: '8' },
]

function radiusVar(name: string, fallback: string, description = 'Border radius'): ComponentVar {
  return { name, default: `var(--radius-${fallback})`, description, options: RADIUS_OPTIONS }
}

function paddingVar(name: string, step: string, description = 'Padding'): ComponentVar {
  return { name, default: `var(--spacing-${step})`, description, options: SPACING_OPTIONS }
}

export const COMPONENT_VARS: Record<string, ComponentVarGroup> = {
  'button': { label: 'Button', vars: [radiusVar('--button-radius', 'element')] },
  'card': {
    label: 'Card',
    vars: [radiusVar('--card-radius', 'container'), paddingVar('--card-padding', '4')],
  },
  'field': { label: 'Field / Input', vars: [radiusVar('--input-radius', 'element')] },
  'banner': { label: 'Banner', vars: [radiusVar('--banner-radius', 'container')] },
  'segmented-control': {
    label: 'Segmented Control',
    vars: [radiusVar('--segmented-control-radius', 'element'), paddingVar('--segmented-control-padding', '0-5')],
  },
  'dialog': {
    label: 'Dialog',
    vars: [radiusVar('--dialog-radius', 'container'), paddingVar('--dialog-padding', '4')],
  },
  'dropdown-menu': {
    label: 'Dropdown Menu',
    vars: [radiusVar('--dropdown-radius', 'element'), paddingVar('--dropdown-padding', '1', 'Inner padding')],
  },
  'section': { label: 'Section', vars: [paddingVar('--section-padding', '4')] },
  'popover': { label: 'Popover', vars: [radiusVar('--popover-radius', 'element')] },
  'hovercard': { label: 'Hover Card', vars: [radiusVar('--hovercard-radius', 'container')] },
  'chat-composer': {
    label: 'Chat Composer',
    vars: [radiusVar('--composer-radius', 'page'), paddingVar('--composer-padding', '3')],
  },
}

/**
 * 变量对应的主题覆盖。输入框的圆角画在各自的外框上，
 * 所以写到 text-input、text-area、selector-field 的 borderRadius。
 * 聊天输入框用组件内部变量，圆角和内边距会连带影响内部元素。
 */
export const COMPONENT_VAR_TO_OVERRIDE: Record<string, ComponentTarget[]> = {
  '--button-radius': [{ component: 'button', cssProperty: 'borderRadius' }],
  '--card-radius': [{ component: 'card', cssProperty: 'borderRadius' }],
  '--card-padding': [{ component: 'card', cssProperty: 'padding' }],
  '--input-radius': [
    { component: 'text-input', cssProperty: 'borderRadius' },
    { component: 'text-area', cssProperty: 'borderRadius' },
    { component: 'selector-field', cssProperty: 'borderRadius' },
  ],
  '--banner-radius': [{ component: 'banner', cssProperty: 'borderRadius' }],
  '--segmented-control-radius': [{ component: 'segmented-control', cssProperty: 'borderRadius' }],
  '--segmented-control-padding': [{ component: 'segmented-control', cssProperty: 'padding' }],
  '--dialog-radius': [{ component: 'dialog', cssProperty: 'borderRadius' }],
  '--dialog-padding': [{ component: 'dialog', cssProperty: 'padding' }],
  '--dropdown-radius': [{ component: 'dropdown-menu', cssProperty: 'borderRadius' }],
  '--dropdown-padding': [{ component: 'dropdown-menu', cssProperty: 'padding' }],
  '--section-padding': [{ component: 'section', cssProperty: 'padding' }],
  '--popover-radius': [{ component: 'popover', cssProperty: 'borderRadius' }],
  '--hovercard-radius': [{ component: 'hover-card', cssProperty: 'borderRadius' }],
  '--composer-radius': [{ component: 'chat-composer', cssProperty: '--_chat-composer-radius' }],
  '--composer-padding': [{ component: 'chat-composer', cssProperty: '--_chat-composer-padding' }],
}

export const COMPONENT_VAR_NAMES = new Set(Object.keys(COMPONENT_VAR_TO_OVERRIDE))

/** 自定义覆盖里可选的组件。 */
export const ALL_COMPONENT_NAMES = [
  'alert-dialog',
  'app-shell',
  'avatar',
  'badge',
  'banner',
  'button',
  'calendar',
  'card',
  'chat-composer',
  'chat-message',
  'chat-message-bubble',
  'checkbox-indicator',
  'clickable-card',
  'code-block',
  'collapsible',
  'dialog',
  'divider',
  'dropdown-menu',
  'empty-state',
  'field',
  'heading',
  'hover-card',
  'icon',
  'link',
  'list',
  'markdown',
  'popover',
  'progress-bar',
  'radio-indicator',
  'section',
  'segmented-control',
  'selector',
  'side-nav',
  'skeleton',
  'slider',
  'spinner',
  'switch',
  'tab',
  'tab-list',
  'table',
  'text',
  'text-input',
  'text-area',
  'toast',
  'token',
  'tooltip',
  'top-nav',
] as const

/** 选项的显示名。带 token 且当前值已知时，写成「名称 — 实际值」。 */
export function resolveOptionLabel(option: ComponentVarOption, resolved: Record<string, string>): string {
  const value = option.token ? resolved[option.token] : undefined
  return value ? `${option.label} — ${value}` : option.label
}
