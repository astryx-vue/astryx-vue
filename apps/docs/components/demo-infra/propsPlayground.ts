import type { VNodeChild } from 'vue'
import type { DocsLocale } from './docs-i18n'
import { Avatar } from '@astryx-vue/core/Avatar'
import { Badge } from '@astryx-vue/core/Badge'
import { Banner } from '@astryx-vue/core/Banner'
import { Button } from '@astryx-vue/core/Button'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { Divider } from '@astryx-vue/core/Divider'
import { FieldStatus } from '@astryx-vue/core/FieldStatus'
import { Heading } from '@astryx-vue/core/Heading'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { Kbd } from '@astryx-vue/core/Kbd'
import { Link } from '@astryx-vue/core/Link'
import { Pagination } from '@astryx-vue/core/Pagination'
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { Skeleton } from '@astryx-vue/core/Skeleton'
import { Slider } from '@astryx-vue/core/Slider'
import { Spinner } from '@astryx-vue/core/Spinner'
import { StatusDot } from '@astryx-vue/core/StatusDot'
import { Switch } from '@astryx-vue/core/Switch'
import { Text } from '@astryx-vue/core/Text'
import { TextArea } from '@astryx-vue/core/TextArea'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ToggleButton } from '@astryx-vue/core/ToggleButton'
import { h } from 'vue'

export interface PlaygroundKnob {
  key: string
  attr: string
  label: { zh: string, en: string }
  kind: 'enum' | 'boolean' | 'string' | 'number'
  options?: readonly string[]
  /** Bind with `:` in the sample when the value is not a string attribute. */
  bind?: boolean
}

export interface PlaygroundSpec {
  tag: string
  knobs: readonly PlaygroundKnob[]
  initial: (locale: DocsLocale) => Record<string, unknown>
  render: (state: Record<string, unknown>, locale: DocsLocale) => VNodeChild
  sampleSlot?: (locale: DocsLocale) => string | null
}

function text(locale: DocsLocale, zh: string, en: string): string {
  return locale === 'en' ? en : zh
}

function set(state: Record<string, unknown>, key: string) {
  return (value: unknown) => {
    state[key] = value
  }
}

const badgeVariants = ['neutral', 'info', 'success', 'warning', 'error', 'blue', 'green', 'red', 'purple', 'teal'] as const
const buttonVariants = ['primary', 'secondary', 'ghost', 'destructive'] as const
const sizes = ['sm', 'md', 'lg'] as const

export const PROPS_PLAYGROUNDS: Record<string, PlaygroundSpec> = {
  'avatar': {
    tag: 'Avatar',
    knobs: [
      { key: 'name', attr: 'name', label: { zh: '姓名', en: 'Name' }, kind: 'string' },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: ['sm', 'md', 'lg', 'xl'] },
      { key: 'shape', attr: 'shape', label: { zh: '形状', en: 'Shape' }, kind: 'enum', options: ['circle', 'rounded', 'square'] },
    ],
    initial: locale => ({ name: text(locale, '林安', 'Ada Lovelace'), size: 'lg', shape: 'circle' }),
    render: state => h(Avatar, { name: String(state.name), size: state.size as 'lg', shape: state.shape as 'circle' }),
  },
  'badge': {
    tag: 'Badge',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'variant', attr: 'variant', label: { zh: '变体', en: 'Variant' }, kind: 'enum', options: badgeVariants },
    ],
    initial: locale => ({ label: text(locale, '已发布', 'Shipped'), variant: 'success' }),
    render: state => h(Badge, { label: String(state.label), variant: state.variant as 'success' }),
  },
  'banner': {
    tag: 'Banner',
    knobs: [
      { key: 'title', attr: 'title', label: { zh: '标题', en: 'Title' }, kind: 'string' },
      { key: 'description', attr: 'description', label: { zh: '说明', en: 'Description' }, kind: 'string' },
      { key: 'status', attr: 'status', label: { zh: '状态', en: 'Status' }, kind: 'enum', options: ['info', 'success', 'warning', 'error'] },
      { key: 'dismissable', attr: 'is-dismissable', label: { zh: '可关闭', en: 'Dismissable' }, kind: 'boolean' },
    ],
    initial: locale => ({
      title: text(locale, '维护将在今晚开始', 'Maintenance starts tonight'),
      description: text(locale, '预计持续两小时。', 'Expect about two hours.'),
      status: 'warning',
      dismissable: true,
    }),
    render: state => h(Banner, {
      title: String(state.title),
      description: String(state.description),
      status: state.status as 'warning',
      isDismissable: Boolean(state.dismissable),
    }),
  },
  'button': {
    tag: 'Button',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'variant', attr: 'variant', label: { zh: '变体', en: 'Variant' }, kind: 'enum', options: buttonVariants },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: sizes },
      { key: 'elevation', attr: 'elevation', label: { zh: '阴影', en: 'Elevation' }, kind: 'enum', options: ['none', 'low', 'med', 'high'] },
      { key: 'disabled', attr: 'is-disabled', label: { zh: '禁用', en: 'Disabled' }, kind: 'boolean' },
      { key: 'loading', attr: 'is-loading', label: { zh: '加载', en: 'Loading' }, kind: 'boolean' },
    ],
    initial: locale => ({
      label: text(locale, '保存更改', 'Save changes'),
      variant: 'primary',
      size: 'md',
      elevation: 'none',
      disabled: false,
      loading: false,
    }),
    render: state => h(Button, {
      label: String(state.label),
      variant: state.variant as 'primary',
      size: state.size as 'md',
      elevation: state.elevation as 'none',
      isDisabled: Boolean(state.disabled),
      isLoading: Boolean(state.loading),
    }),
  },
  'checkbox-input': {
    tag: 'CheckboxInput',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'checked', attr: 'model-value', label: { zh: '勾选', en: 'Checked' }, kind: 'boolean', bind: true },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: ['sm', 'md'] },
      { key: 'disabled', attr: 'is-disabled', label: { zh: '禁用', en: 'Disabled' }, kind: 'boolean' },
    ],
    initial: locale => ({ label: text(locale, '接收邮件', 'Email me'), checked: true, size: 'md', disabled: false }),
    render: state => h(CheckboxInput, {
      'label': String(state.label),
      'modelValue': Boolean(state.checked),
      'onUpdate:modelValue': set(state, 'checked'),
      'size': state.size as 'md',
      'isDisabled': Boolean(state.disabled),
    }),
  },
  'divider': {
    tag: 'Divider',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'variant', attr: 'variant', label: { zh: '强弱', en: 'Variant' }, kind: 'enum', options: ['subtle', 'strong'] },
      { key: 'orientation', attr: 'orientation', label: { zh: '方向', en: 'Orientation' }, kind: 'enum', options: ['horizontal', 'vertical'] },
    ],
    initial: locale => ({ label: text(locale, '或者', 'or'), variant: 'subtle', orientation: 'horizontal' }),
    render: state => h(Divider, {
      label: String(state.label),
      variant: state.variant as 'subtle',
      orientation: state.orientation as 'horizontal',
      style: state.orientation === 'vertical' ? { height: '72px' } : { width: '240px' },
    }),
  },
  'field-status': {
    tag: 'FieldStatus',
    knobs: [
      { key: 'message', attr: 'message', label: { zh: '说明', en: 'Message' }, kind: 'string' },
      { key: 'type', attr: 'type', label: { zh: '类型', en: 'Type' }, kind: 'enum', options: ['error', 'warning', 'success'] },
      { key: 'variant', attr: 'variant', label: { zh: '位置', en: 'Variant' }, kind: 'enum', options: ['attached', 'detached'] },
    ],
    initial: locale => ({
      message: text(locale, '邮箱格式不对', 'Enter a valid email'),
      type: 'error',
      variant: 'detached',
    }),
    render: state => h(FieldStatus, {
      message: String(state.message),
      type: state.type as 'error',
      variant: state.variant as 'detached',
    }),
  },
  'heading': {
    tag: 'Heading',
    knobs: [
      { key: 'text', attr: '', label: { zh: '文字', en: 'Text' }, kind: 'string' },
      { key: 'level', attr: 'level', label: { zh: '级别', en: 'Level' }, kind: 'enum', options: ['1', '2', '3', '4'], bind: true },
    ],
    initial: locale => ({ text: text(locale, '订单', 'Orders'), level: '2' }),
    sampleSlot: () => null,
    render: state => h(Heading, { level: Number(state.level) as 2 }, () => String(state.text)),
  },
  'icon-button': {
    tag: 'IconButton',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '无障碍名', en: 'Accessible name' }, kind: 'string' },
      { key: 'variant', attr: 'variant', label: { zh: '变体', en: 'Variant' }, kind: 'enum', options: buttonVariants },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: sizes },
      { key: 'disabled', attr: 'is-disabled', label: { zh: '禁用', en: 'Disabled' }, kind: 'boolean' },
      { key: 'loading', attr: 'is-loading', label: { zh: '加载', en: 'Loading' }, kind: 'boolean' },
    ],
    initial: locale => ({
      label: text(locale, '添加', 'Add'),
      variant: 'secondary',
      size: 'md',
      disabled: false,
      loading: false,
    }),
    sampleSlot: () => '<Icon name="carbon:add" />',
    render: state => h(IconButton, {
      label: String(state.label),
      variant: state.variant as 'secondary',
      size: state.size as 'md',
      isDisabled: Boolean(state.disabled),
      isLoading: Boolean(state.loading),
    }, () => h(Icon, { name: 'carbon:add' })),
  },
  'kbd': {
    tag: 'Kbd',
    knobs: [
      { key: 'keys', attr: 'keys', label: { zh: '按键', en: 'Keys' }, kind: 'string' },
    ],
    initial: () => ({ keys: 'mod+k' }),
    render: state => h(Kbd, { keys: String(state.keys) }),
  },
  'link': {
    tag: 'Link',
    knobs: [
      { key: 'text', attr: '', label: { zh: '文字', en: 'Text' }, kind: 'string' },
      { key: 'href', attr: 'href', label: { zh: '地址', en: 'Href' }, kind: 'string' },
      { key: 'color', attr: 'color', label: { zh: '颜色', en: 'Color' }, kind: 'enum', options: ['accent', 'primary', 'secondary', 'inherit'] },
      { key: 'underline', attr: 'has-underline', label: { zh: '下划线', en: 'Underline' }, kind: 'boolean' },
      { key: 'external', attr: 'is-external-link', label: { zh: '站外', en: 'External' }, kind: 'boolean' },
    ],
    initial: locale => ({
      text: text(locale, '查看文档', 'Read the docs'),
      href: '/guide/getting-started',
      color: 'accent',
      underline: false,
      external: false,
    }),
    sampleSlot: () => null,
    render: state => h(Link, {
      href: String(state.href),
      color: state.color as 'accent',
      hasUnderline: Boolean(state.underline),
      isExternalLink: Boolean(state.external),
    }, () => String(state.text)),
  },
  'pagination': {
    tag: 'Pagination',
    knobs: [
      { key: 'page', attr: 'page', label: { zh: '当前页', en: 'Page' }, kind: 'number', bind: true },
      { key: 'variant', attr: 'variant', label: { zh: '形态', en: 'Variant' }, kind: 'enum', options: ['pages', 'count', 'compact', 'dots', 'none'] },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: ['sm', 'md'] },
    ],
    initial: () => ({ page: 3, variant: 'pages', size: 'md' }),
    render: state => h(Pagination, {
      'key': `${state.page}-${state.variant}-${state.size}`,
      'page': Number(state.page),
      'onUpdate:page': set(state, 'page'),
      'total': 96,
      'pageSize': 10,
      'variant': state.variant as 'pages',
      'size': state.size as 'md',
    }),
  },
  'progress-bar': {
    tag: 'ProgressBar',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'value', attr: 'value', label: { zh: '数值', en: 'Value' }, kind: 'number', bind: true },
      { key: 'variant', attr: 'variant', label: { zh: '变体', en: 'Variant' }, kind: 'enum', options: ['accent', 'neutral', 'success', 'warning', 'error', 'info'] },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: sizes },
      { key: 'indeterminate', attr: 'is-indeterminate', label: { zh: '不确定', en: 'Indeterminate' }, kind: 'boolean' },
    ],
    initial: locale => ({
      label: text(locale, '上传', 'Uploading'),
      value: 42,
      variant: 'accent',
      size: 'md',
      indeterminate: false,
    }),
    render: state => h(ProgressBar, {
      label: String(state.label),
      value: Number(state.value),
      variant: state.variant as 'accent',
      size: state.size as 'md',
      isIndeterminate: Boolean(state.indeterminate),
      hasValueLabel: true,
      style: { width: '280px' },
    }),
  },
  'segmented-control': {
    tag: 'SegmentedControl',
    knobs: [
      { key: 'value', attr: 'model-value', label: { zh: '选中', en: 'Selected' }, kind: 'enum', options: ['day', 'week', 'month'], bind: true },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: sizes },
      { key: 'layout', attr: 'layout', label: { zh: '布局', en: 'Layout' }, kind: 'enum', options: ['hug', 'fill'] },
      { key: 'disabled', attr: 'is-disabled', label: { zh: '禁用', en: 'Disabled' }, kind: 'boolean' },
    ],
    initial: () => ({ value: 'week', size: 'md', layout: 'hug', disabled: false }),
    render: (state, locale) => h(SegmentedControl, {
      'modelValue': String(state.value),
      'onUpdate:modelValue': set(state, 'value'),
      'label': text(locale, '时间范围', 'Range'),
      'size': state.size as 'md',
      'layout': state.layout as 'hug',
      'isDisabled': Boolean(state.disabled),
      'style': state.layout === 'fill' ? { width: '320px' } : undefined,
    }, () => [
      h(SegmentedControlItem, { value: 'day', label: text(locale, '日', 'Day') }),
      h(SegmentedControlItem, { value: 'week', label: text(locale, '周', 'Week') }),
      h(SegmentedControlItem, { value: 'month', label: text(locale, '月', 'Month') }),
    ]),
  },
  'skeleton': {
    tag: 'Skeleton',
    knobs: [
      { key: 'width', attr: 'width', label: { zh: '宽度', en: 'Width' }, kind: 'number', bind: true },
      { key: 'height', attr: 'height', label: { zh: '高度', en: 'Height' }, kind: 'number', bind: true },
      { key: 'radius', attr: 'radius', label: { zh: '圆角', en: 'Radius' }, kind: 'enum', options: ['none', '1', '2', '3', '4', 'rounded'] },
    ],
    initial: () => ({ width: 220, height: 16, radius: '3' }),
    render: state => h(Skeleton, {
      width: Number(state.width),
      height: Number(state.height),
      radius: state.radius === 'rounded' || state.radius === 'none' ? state.radius : Number(state.radius) as 3,
    }),
  },
  'slider': {
    tag: 'Slider',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'value', attr: 'model-value', label: { zh: '数值', en: 'Value' }, kind: 'number', bind: true },
      { key: 'disabled', attr: 'is-disabled', label: { zh: '禁用', en: 'Disabled' }, kind: 'boolean' },
    ],
    initial: locale => ({ label: text(locale, '音量', 'Volume'), value: 40, disabled: false }),
    render: state => h(Slider, {
      'label': String(state.label),
      'modelValue': Number(state.value),
      'onUpdate:modelValue': set(state, 'value'),
      'isDisabled': Boolean(state.disabled),
      'style': { width: '280px' },
    }),
  },
  'spinner': {
    tag: 'Spinner',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: ['sm', 'md', 'lg', 'xl'] },
      { key: 'shade', attr: 'shade', label: { zh: '配色', en: 'Shade' }, kind: 'enum', options: ['default', 'subtle', 'inherit', 'onMedia'] },
    ],
    initial: locale => ({ label: text(locale, '正在加载', 'Loading'), size: 'lg', shade: 'default' }),
    render: state => h(Spinner, {
      label: String(state.label),
      size: state.size as 'lg',
      shade: state.shade as 'default',
    }),
  },
  'status-dot': {
    tag: 'StatusDot',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '名称', en: 'Label' }, kind: 'string' },
      { key: 'variant', attr: 'variant', label: { zh: '变体', en: 'Variant' }, kind: 'enum', options: ['neutral', 'info', 'success', 'warning', 'error'] },
      { key: 'pulsing', attr: 'is-pulsing', label: { zh: '闪动', en: 'Pulsing' }, kind: 'boolean' },
    ],
    initial: locale => ({ label: text(locale, '在线', 'Online'), variant: 'success', pulsing: false }),
    render: state => h(StatusDot, {
      label: String(state.label),
      variant: state.variant as 'success',
      isPulsing: Boolean(state.pulsing),
    }),
  },
  'switch': {
    tag: 'Switch',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'on', attr: 'model-value', label: { zh: '打开', en: 'On' }, kind: 'boolean', bind: true },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: sizes },
      { key: 'disabled', attr: 'is-disabled', label: { zh: '禁用', en: 'Disabled' }, kind: 'boolean' },
    ],
    initial: locale => ({ label: text(locale, '通知', 'Notifications'), on: true, size: 'md', disabled: false }),
    render: state => h(Switch, {
      'label': String(state.label),
      'modelValue': Boolean(state.on),
      'onUpdate:modelValue': set(state, 'on'),
      'size': state.size as 'md',
      'isDisabled': Boolean(state.disabled),
    }),
  },
  'text': {
    tag: 'Text',
    knobs: [
      { key: 'text', attr: '', label: { zh: '文字', en: 'Text' }, kind: 'string' },
      { key: 'type', attr: 'type', label: { zh: '类型', en: 'Type' }, kind: 'enum', options: ['body', 'large', 'label', 'supporting'] },
      { key: 'color', attr: 'color', label: { zh: '颜色', en: 'Color' }, kind: 'enum', options: ['primary', 'secondary', 'accent'] },
      { key: 'weight', attr: 'weight', label: { zh: '字重', en: 'Weight' }, kind: 'enum', options: ['regular', 'medium', 'semibold', 'bold'] },
    ],
    initial: locale => ({
      text: text(locale, '正文用来读，不是用来喊。', 'Body text is for reading.'),
      type: 'body',
      color: 'primary',
      weight: 'regular',
    }),
    sampleSlot: () => null,
    render: state => h(Text, {
      type: state.type as 'body',
      color: state.color as 'primary',
      weight: state.weight as 'regular',
    }, () => String(state.text)),
  },
  'text-area': {
    tag: 'TextArea',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'value', attr: 'model-value', label: { zh: '内容', en: 'Value' }, kind: 'string', bind: true },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: sizes },
      { key: 'disabled', attr: 'is-disabled', label: { zh: '禁用', en: 'Disabled' }, kind: 'boolean' },
    ],
    initial: locale => ({
      label: text(locale, '备注', 'Notes'),
      value: text(locale, '下午三点前回复。', 'Reply before 3pm.'),
      size: 'md',
      disabled: false,
    }),
    render: state => h(TextArea, {
      'label': String(state.label),
      'modelValue': String(state.value),
      'onUpdate:modelValue': set(state, 'value'),
      'size': state.size as 'md',
      'isDisabled': Boolean(state.disabled),
    }),
  },
  'text-input': {
    tag: 'TextInput',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'value', attr: 'model-value', label: { zh: '内容', en: 'Value' }, kind: 'string', bind: true },
      { key: 'placeholder', attr: 'placeholder', label: { zh: '占位', en: 'Placeholder' }, kind: 'string' },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: sizes },
      { key: 'disabled', attr: 'is-disabled', label: { zh: '禁用', en: 'Disabled' }, kind: 'boolean' },
    ],
    initial: locale => ({
      label: text(locale, '邮箱', 'Email'),
      value: '',
      placeholder: 'name@company.com',
      size: 'md',
      disabled: false,
    }),
    render: state => h(TextInput, {
      'label': String(state.label),
      'modelValue': String(state.value),
      'onUpdate:modelValue': set(state, 'value'),
      'placeholder': String(state.placeholder),
      'size': state.size as 'md',
      'isDisabled': Boolean(state.disabled),
    }),
  },
  'toggle-button': {
    tag: 'ToggleButton',
    knobs: [
      { key: 'label', attr: 'label', label: { zh: '文字', en: 'Label' }, kind: 'string' },
      { key: 'pressed', attr: 'is-pressed', label: { zh: '按下', en: 'Pressed' }, kind: 'boolean' },
      { key: 'size', attr: 'size', label: { zh: '尺寸', en: 'Size' }, kind: 'enum', options: sizes },
    ],
    initial: locale => ({ label: text(locale, '收藏', 'Favorite'), pressed: true, size: 'md' }),
    render: state => h(ToggleButton, {
      'label': String(state.label),
      'isPressed': Boolean(state.pressed),
      'onUpdate:isPressed': set(state, 'pressed'),
      'size': state.size as 'md',
    }),
  },
}

export function propsPlaygroundFor(slug: string): PlaygroundSpec | null {
  return PROPS_PLAYGROUNDS[slug] ?? null
}

export function playgroundSample(spec: PlaygroundSpec, state: Record<string, unknown>, locale: DocsLocale): string {
  const lines: string[] = []
  for (const knob of spec.knobs) {
    if (knob.attr === '')
      continue
    const value = state[knob.key]
    if (knob.kind === 'boolean') {
      if (value)
        lines.push(knob.bind ? `  :${knob.attr}="true"` : `  ${knob.attr}`)
      continue
    }
    if (knob.kind === 'number' || knob.bind)
      lines.push(`  :${knob.attr}="${String(value)}"`)
    else
      lines.push(`  ${knob.attr}="${String(value).replaceAll('"', '&quot;')}"`)
  }
  const slot = spec.sampleSlot?.(locale)
  const textSlot = spec.knobs.find(knob => knob.attr === '')
  const inner = slot ?? (textSlot ? String(state[textSlot.key] ?? '') : null)
  if (inner == null)
    return lines.length === 0 ? `<${spec.tag} />` : `<${spec.tag}\n${lines.join('\n')}\n/>`
  const open = lines.length === 0 ? `<${spec.tag}>` : `<${spec.tag}\n${lines.join('\n')}\n>`
  return `${open}\n  ${inner}\n</${spec.tag}>`
}
