<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core'
import type { Component } from 'vue'
import {
  AspectRatio,
  Card,
  Center,
  defineTheme,
  Divider,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuDivider,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSubMenu,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
  List,
  ListItem,
  neutralTheme,
  NumberInput,
  Popover,
  ResizeHandle,
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Selector,
  Slider,
  StackItem,
  Text,
  TextArea,
  TextInput,
  Theme,
  Thumbnail,
  Toolbar,
  TreeList,
  useContainerReveal,
  useResizable,
  useToast,
  VisuallyHidden,
  VStack,
} from '@astryx-vue/core'
import { computed, defineComponent, h, ref } from 'vue'

// =============================================================================
// 主题：海报排版用的主题，和原版一样只包住画板和色相滑条。
// =============================================================================

const canvasEditorTheme = defineTheme({
  name: 'canvas-editor',
  typography: {
    heading: {
      family: 'Anton',
      fallbacks: 'Haettenschweiler, Impact, "Arial Narrow", sans-serif',
    },
  },
  tokens: {
    '--text-display-1-leading': '1.02',
    '--spacing-6': '56px',
    '--spacing-3': '24px',
  },
  components: {
    // 原版的 display-1 在这个主题里是 400：Anton 只有一个字重，这里不跟标题层级的半粗体走。
    'heading': { 'type:display-1': { textTransform: 'uppercase', fontWeight: '400' } },
    'text': { 'type:supporting': { textTransform: 'uppercase' } },
    'slider-track': {
      base: {
        backgroundImage: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
      },
    },
  },
})

// =============================================================================
// 数据
// =============================================================================

const FRAME = { width: 1080, height: 1920 }
const PHOTO_LAYER_SRC = '/template-assets/moody-scene-vertical-1.png'
const TAB_STRIP_RESERVE = 320

type LayerKind = 'text' | 'image'
type ThemeMode = 'light' | 'dark' | 'system'
type AlignX = 'start' | 'center' | 'end' | 'justify'
type AlignY = 'start' | 'center' | 'end'
type Decoration = 'none' | 'underline' | 'line-through'
type Transform = 'none' | 'capitalize' | 'uppercase' | 'lowercase'

interface Filters {
  blur: number
  brightness: number
  contrast: number
  grayscale: number
  hue: number
  invert: number
  opacity: number
  saturate: number
  sepia: number
}

interface Shadow {
  x: number
  y: number
  blur: number
  spread: number
  color: string
}

interface Layer {
  id: string
  name: string
  kind: LayerKind
  x: number
  y: number
  width: number
  height: number
  rotation: number
  paddingInline: number
  paddingBlock: number
  radius: number
  isLocked: boolean
  content: string
  border?: string
  fill?: string
  shadow?: Shadow
  family?: string
  weight?: string
  color?: string
  size?: number
  line?: number
  tracking?: number
  alignX?: AlignX
  alignY?: AlignY
  isItalic?: boolean
  decoration?: Decoration
  transform?: Transform
  textShadow?: Shadow
  stroke?: number
  fit?: string
  filters?: Filters
}

const NO_SHADOW: Shadow = { x: 0, y: 0, blur: 0, spread: 0, color: '#000000' }
const NO_FILTERS: Filters = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  hue: 0,
  invert: 0,
  opacity: 100,
  saturate: 100,
  sepia: 0,
}

const INITIAL_TABS = [
  { id: 'poster', name: 'Salzburg poster' },
  { id: 'brand', name: 'Brand sheet' },
  { id: 'draft', name: 'Untitled draft' },
]

const INITIAL_LAYERS: Layer[] = [
  {
    id: 'headline',
    name: 'Headline',
    kind: 'text',
    x: 56,
    y: 136,
    width: 968,
    height: 300,
    rotation: 0,
    paddingInline: 0,
    paddingBlock: 0,
    radius: 0,
    isLocked: false,
    content: 'A weekend in Salzburg',
    fill: '#111111',
    family: 'Anton',
    weight: 'Regular',
    color: '#111111',
    size: 112,
    line: 100,
    tracking: -2,
    alignX: 'start',
    alignY: 'start',
    isItalic: false,
    decoration: 'none',
    transform: 'uppercase',
    stroke: 0,
  },
  {
    id: 'dateline',
    name: 'Dateline',
    kind: 'text',
    x: 56,
    y: 56,
    width: 968,
    height: 56,
    rotation: 0,
    paddingInline: 0,
    paddingBlock: 0,
    radius: 0,
    isLocked: false,
    content: 'March 14–16 · Austria',
    family: 'Inter Tight',
    weight: 'Medium',
    color: '#111111',
    size: 26,
    line: 120,
    tracking: 32,
    alignX: 'center',
    alignY: 'start',
    isItalic: false,
    decoration: 'none',
    transform: 'uppercase',
    stroke: 0,
  },
  {
    id: 'photo',
    name: 'Photo',
    kind: 'image',
    x: 0,
    y: 0,
    width: 1080,
    height: 1920,
    rotation: 0,
    paddingInline: 0,
    paddingBlock: 0,
    radius: 0,
    isLocked: true,
    content: 'The Salzach river and old town rooftops at dusk',
    fit: 'Cover',
    filters: NO_FILTERS,
  },
]

const V_ALIGN = { start: 'start', center: 'center', end: 'end' } as const

/** Lucide 图标当组件用：输入框的起始图标位只收组件。 */
function lucide(name: string): Component {
  return () => h(Icon, { name: `lucide:${name}`, size: 'sm' })
}

/** 按 24px 网格画的字母，和 Lucide 图标在同一个位置互换。 */
function glyph(char: string): Component {
  return (props: Record<string, unknown>) => h('svg', { viewBox: '0 0 24 24', ...props }, [
    h('text', {
      'x': 12,
      'y': 12,
      'fill': 'currentColor',
      'font-size': char.length > 1 ? 13 : 17,
      'font-weight': 500,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
    }, char),
  ])
}

const GLYPH = { x: glyph('X'), y: glyph('Y'), width: glyph('W'), height: glyph('H') }

const EFFECT_PRESETS = [
  { label: 'Grain overlay', icon: 'lucide:aperture' },
  { label: 'Halftone', icon: 'lucide:grip' },
  { label: 'Duotone teal', icon: 'lucide:contrast' },
]

const ALIGN_X = [
  { value: 'start', label: 'Align left', icon: 'lucide:text-align-start' },
  { value: 'center', label: 'Align centre', icon: 'lucide:text-align-center' },
  { value: 'end', label: 'Align right', icon: 'lucide:text-align-end' },
  { value: 'justify', label: 'Justify', icon: 'lucide:text-align-justify' },
]
const ALIGN_Y = [
  { value: 'start', label: 'Align top', icon: 'lucide:arrow-up-to-line' },
  { value: 'center', label: 'Align middle', icon: 'lucide:fold-vertical' },
  { value: 'end', label: 'Align bottom', icon: 'lucide:arrow-down-to-line' },
]
const DECORATIONS = [
  { value: 'none', label: 'No decoration', icon: 'lucide:case-sensitive' },
  { value: 'underline', label: 'Underline', icon: 'lucide:underline' },
  { value: 'line-through', label: 'Strikethrough', icon: 'lucide:strikethrough' },
]
const TRANSFORMS = [
  { value: 'none', label: 'As typed', icon: 'lucide:minus' },
  { value: 'capitalize', label: 'Capitalise', icon: 'lucide:case-sensitive' },
  { value: 'uppercase', label: 'Uppercase', icon: 'lucide:case-upper' },
  { value: 'lowercase', label: 'Lowercase', icon: 'lucide:case-lower' },
]

const FILTERS: { key: keyof Filters, label: string, max: number, unit: string }[] = [
  { key: 'blur', label: 'Blur', max: 20, unit: 'px' },
  { key: 'brightness', label: 'Brightness', max: 200, unit: '%' },
  { key: 'contrast', label: 'Contrast', max: 200, unit: '%' },
  { key: 'grayscale', label: 'Grayscale', max: 100, unit: '%' },
  { key: 'hue', label: 'Hue', max: 360, unit: 'deg' },
  { key: 'invert', label: 'Invert', max: 100, unit: '%' },
  { key: 'opacity', label: 'Opacity', max: 100, unit: '%' },
  { key: 'saturate', label: 'Saturate', max: 200, unit: '%' },
  { key: 'sepia', label: 'Sepia', max: 100, unit: '%' },
]

const ZOOM_OPTIONS = [
  { value: '0.25', label: '25%' },
  { value: '0.4', label: '40%' },
  { value: '0.6', label: '60%' },
  { value: '1', label: '100%' },
]
const FONT_OPTIONS = ['Anton', 'Archivo Black', 'Bebas Neue', 'Inter Tight']
const WEIGHT_OPTIONS = ['Regular', 'Medium', 'Semibold', 'Bold']
const FIT_OPTIONS = ['Cover', 'Contain', 'Fill']
const INSERT_ITEMS = [
  { label: 'Frame', icon: 'lucide:frame' },
  { label: 'Group', icon: 'lucide:group' },
  { label: 'Text', icon: 'lucide:type' },
  { label: 'Image', icon: 'lucide:image' },
]
const EXPORT_FORMATS = ['PNG · 1080 × 1920', 'JPG · 1080 × 1920', 'PDF · print ready']
const EXPORT_MENU = EXPORT_FORMATS.map(label => ({ label }))

// =============================================================================
// 颜色：选色器按 HSV 想，存的是十六进制。
// =============================================================================

interface Hsv { h: number, s: number, v: number }

function hsvToHex({ h, s, v }: Hsv): string {
  const channel = (n: number) => {
    const k = (n + h / 60) % 6
    const value = (v / 100) * (1 - (s / 100) * Math.max(0, Math.min(k, 4 - k, 1)))
    return Math.round(value * 255).toString(16).padStart(2, '0')
  }
  return `#${channel(5)}${channel(3)}${channel(1)}`
}

function hexToHsv(hex: string): Hsv {
  const parsed = /^#?([\da-f]{6})$/i.exec(hex.trim())
  if (!parsed)
    return { h: 0, s: 0, v: 0 }
  const int = Number.parseInt(parsed[1], 16)
  const r = ((int >> 16) & 255) / 255
  const g = ((int >> 8) & 255) / 255
  const b = (int & 255) / 255
  const max = Math.max(r, g, b)
  const span = max - Math.min(r, g, b)
  let hue = 0
  if (span !== 0) {
    if (max === r)
      hue = ((g - b) / span) % 6
    else if (max === g)
      hue = (b - r) / span + 2
    else
      hue = (r - g) / span + 4
  }
  return {
    h: (Math.round(hue * 60) + 360) % 360,
    s: max === 0 ? 0 : Math.round((span / max) * 100),
    v: Math.round(max * 100),
  }
}

function filterCss(filters: Filters): string {
  const parts = [
    ['blur', filters.blur, 0, 'px'],
    ['brightness', filters.brightness, 100, '%'],
    ['contrast', filters.contrast, 100, '%'],
    ['grayscale', filters.grayscale, 0, '%'],
    ['hue-rotate', filters.hue, 0, 'deg'],
    ['invert', filters.invert, 0, '%'],
    ['opacity', filters.opacity, 100, '%'],
    ['saturate', filters.saturate, 100, '%'],
    ['sepia', filters.sepia, 0, '%'],
  ] as const
  const active = parts
    .filter(([, value, neutral]) => value !== neutral)
    .map(([name, value, , unit]) => `${name}(${value}${unit})`)
  return active.length > 0 ? active.join(' ') : 'none'
}

function shadowCss(shadow: Shadow | undefined): string {
  return shadow ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color}` : 'none'
}

/** 选色器自己的状态：打开期间保留 HSV，因为十六进制在黑白处没有色相可拖。 */
const pickerHsv = ref<Record<string, Hsv>>({})
function hsvFor(key: string, value: string | undefined): Hsv {
  return pickerHsv.value[key] ?? hexToHsv(value ?? '#ffffff')
}
function setHsv(key: string, next: Hsv, apply: (hex: string) => void): void {
  pickerHsv.value = { ...pickerHsv.value, [key]: next }
  apply(hsvToHex(next))
}
function trackPlane(event: PointerEvent, key: string, value: string | undefined, apply: (hex: string) => void): void {
  const target = event.currentTarget as HTMLElement
  if (event.type === 'pointerdown')
    target.setPointerCapture(event.pointerId)
  else if (!target.hasPointerCapture(event.pointerId))
    return
  const box = target.getBoundingClientRect()
  const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width))
  const y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height))
  const current = hsvFor(key, value)
  setHsv(key, { ...current, s: Math.round(x * 100), v: Math.round(100 - y * 100) }, apply)
}
function nudgePlane(event: KeyboardEvent, key: string, value: string | undefined, apply: (hex: string) => void): void {
  const sign = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0
  if (sign === 0)
    return
  event.preventDefault()
  const horizontal = event.key === 'ArrowRight' || event.key === 'ArrowLeft'
  const clamp = (n: number) => Math.min(100, Math.max(0, n))
  const hsv = hsvFor(key, value)
  setHsv(key, { h: hsv.h, s: clamp(hsv.s + (horizontal ? sign * 2 : 0)), v: clamp(hsv.v + (horizontal ? 0 : sign * 2)) }, apply)
}

// =============================================================================
// 状态
// =============================================================================

const showToast = useToast()
// Demo only: replace these toasts with the calls that perform each action.
function demo(body: string, uniqueID: string): void {
  showToast({ body, uniqueID })
}

const layers = ref<Layer[]>(INITIAL_LAYERS)
const selectedID = ref('headline')
const panel = ref('layers')
const zoom = ref('0.4')
const imageName = ref('Image')
const fileRef = ref<HTMLInputElement | null>(null)
const chrome = ref({ left: true, right: true, toolbar: true })
const appearance = ref<ThemeMode>('system')
const tabs = ref([...INITIAL_TABS])
const activeTab = ref(INITIAL_TABS[0].id)
const layerReveal = useContainerReveal()
let untitledCount = 1

function closeTab(id: string): void {
  const index = tabs.value.findIndex(tab => tab.id === id)
  const next = tabs.value.filter(tab => tab.id !== id)
  if (id === activeTab.value) {
    const neighbour = next[index] ?? next[index - 1]
    activeTab.value = neighbour ? neighbour.id : ''
  }
  tabs.value = next
}

function addTab(): void {
  untitledCount += 1
  const tab = { id: `untitled-${untitledCount}`, name: `Untitled ${untitledCount}` }
  tabs.value = [...tabs.value, tab]
  activeTab.value = tab.id
}

const rail = useResizable({ defaultSize: 216, minSize: 176, maxSize: 320 })
const inspector = useResizable({ defaultSize: 288, minSize: 264, maxSize: 400 })

const selected = computed(() => layers.value.find(layer => layer.id === selectedID.value) ?? layers.value[0])
const scale = computed(() => Number(zoom.value))
const headline = computed(() => layers.value.filter(layer => layer.kind === 'text')[0])
const dateline = computed(() => layers.value.filter(layer => layer.kind === 'text')[1])
const photo = computed(() => layers.value.filter(layer => layer.kind === 'image')[0])

function updateSelected(patch: Partial<Layer>): void {
  layers.value = layers.value.map(layer => (layer.id === selectedID.value ? { ...layer, ...patch } : layer))
}

function num(next: number | null): number {
  return next ?? 0
}

function toggleLock(id: string): void {
  layers.value = layers.value.map(l => (l.id === id ? { ...l, isLocked: !l.isLocked } : l))
}

/** 图层树：文字和图片分两组，锁按钮悬停才出现，锁住的行一直显示。 */
const layerItems = computed<TreeListItemData[]>(() => {
  const row = (layer: Layer): TreeListItemData => ({
    id: layer.id,
    label: layer.name,
    isSelected: layer.id === selectedID.value,
    onClick: () => { selectedID.value = layer.id },
    ...layerReveal.containerProps(),
    startContent: () => h(Icon, { name: layer.kind === 'text' ? 'lucide:type' : 'lucide:image', size: 'sm', color: 'secondary' }),
    endContent: () => h(IconButton, {
      label: layer.isLocked ? `Unlock ${layer.name}` : `Lock ${layer.name}`,
      variant: 'ghost',
      size: 'sm',
      class: ['item-action', layerReveal.contentProps({ forceVisibility: layer.isLocked ? 'shown' : undefined, isLayoutPreserved: true }).class],
      onClick: () => toggleLock(layer.id),
    }, () => h(Icon, { name: layer.isLocked ? 'lucide:lock' : 'lucide:lock-open', size: 'sm' })),
  })
  const groups: { id: string, label: string, kind: LayerKind }[] = [
    { id: 'group-text', label: 'Text', kind: 'text' },
    { id: 'group-images', label: 'Images', kind: 'image' },
  ]
  return groups
    .map(group => ({
      id: group.id,
      label: group.label,
      isExpanded: true,
      startContent: () => h(Icon, { name: 'lucide:frame', size: 'sm', color: 'secondary' }),
      children: layers.value.filter(l => l.kind === group.kind).map(row),
    }))
    .filter(group => group.children.length > 0)
})

function tabRevealClass(isActive: boolean) {
  return ['item-action', layerReveal.contentProps({ forceVisibility: isActive ? 'shown' : undefined, isLayoutPreserved: true }).class]
}

function onFile(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file)
    imageName.value = file.name
}

/** 文字图层在画板上的排版：这些值属于图层，不是主题，所以逐项写在样式上。 */
function typeStyle(layer: Layer): Record<string, string | undefined> {
  const stroke = layer.stroke ?? 0
  const color = layer.color ?? '#111111'
  return {
    fontSize: `${layer.size ?? 0}px`,
    letterSpacing: `${(layer.tracking ?? 0) / 100}em`,
    lineHeight: `${layer.line ?? 100}%`,
    color,
    WebkitTextStrokeWidth: stroke > 0 ? `${stroke}px` : undefined,
    WebkitTextStrokeColor: stroke > 0 ? color : undefined,
    textShadow: shadowCss(layer.textShadow),
    textAlign: layer.alignX ?? 'start',
    textTransform: layer.transform ?? 'none',
    textDecorationLine: layer.decoration ?? 'none',
    fontStyle: layer.isItalic ? 'italic' : 'normal',
  }
}

// =============================================================================
// 面板里反复用到的小块：用渲染函数写，模板里按组件用。
// =============================================================================

/** 一行检查器：固定宽的标签列，后面是控件。每行的控件因此都从同一条竖线开始。 */
const InspectorRow = defineComponent({
  name: 'InspectorRow',
  props: {
    label: { type: String, required: true },
    hAlign: { type: String, default: undefined },
    labelWidth: { type: Number, default: 80 },
  },
  setup(props, { slots }) {
    return () => h(HStack, { gap: 2, align: 'center' }, () => [
      h(HStack, { width: props.labelWidth, class: 'label-column' }, () =>
        h(Text, { type: 'label', color: 'secondary', maxLines: 1 }, () => props.label)),
      h(StackItem, { size: 'fill' }, () =>
        h(HStack, { gap: 1, align: 'center', hAlign: props.hAlign as 'end' | undefined }, slots.default)),
    ])
  },
})

/** 检查器分组：标题、若干行、底部分隔线。 */
const InspectorSection = defineComponent({
  name: 'InspectorSection',
  props: { title: { type: String, required: true } },
  setup(props, { slots }) {
    return () => h(Section, { padding: 3, dividers: ['bottom'] }, () =>
      h(VStack, { gap: 3 }, () => [
        h(Text, { type: 'label', weight: 'semibold' }, () => props.title),
        slots.default?.(),
      ]))
  },
})

/** 在输入框里面写名字的数字框，比如 X 40。 */
const AxisInput = defineComponent({
  name: 'AxisInput',
  props: {
    icon: { type: [Object, Function], required: true },
    label: { type: String, required: true },
    value: { type: Number, required: true },
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () => h(StackItem, { size: 'fill' }, () => h(NumberInput, {
      'label': props.label,
      'isLabelHidden': true,
      'startIcon': props.icon as Component,
      'size': 'sm',
      'modelValue': props.value,
      'isWheelEnabled': false,
      'onUpdate:modelValue': (next: number | null) => emit('change', num(next)),
    }))
  },
})

/** 带步进按钮的数字行：字号、行高、字距是靠点着调出来的值。 */
const StepperRow = defineComponent({
  name: 'StepperRow',
  props: {
    label: { type: String, required: true },
    value: { type: Number, required: true },
  },
  emits: ['change'],
  setup(props, { emit }) {
    return () => h(InspectorRow, { label: props.label }, () => h(StackItem, { size: 'fill' }, () => h(NumberInput, {
      'label': props.label,
      'isLabelHidden': true,
      'size': 'sm',
      'hasNumberSteppers': true,
      'modelValue': props.value,
      'isWheelEnabled': false,
      'onUpdate:modelValue': (next: number | null) => emit('change', num(next)),
    })))
  },
})

/** 饱和度/明度平面、色相条和十六进制输入：同一个颜色的三种说法。 */
function colorPicker(key: string, value: string | undefined, apply: (hex: string) => void) {
  const hsv = hsvFor(key, value)
  return h('div', { class: 'plane-stack' }, [
    h('div', {
      'role': 'slider',
      'tabindex': 0,
      'aria-label': 'Saturation and brightness',
      'aria-valuetext': `${hsv.s}% saturation, ${hsv.v}% brightness`,
      'aria-valuenow': hsv.s,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'class': 'plane',
      'style': { backgroundColor: `hsl(${hsv.h} 100% 50%)` },
      'onKeydown': (event: KeyboardEvent) => nudgePlane(event, key, value, apply),
      'onPointerdown': (event: PointerEvent) => trackPlane(event, key, value, apply),
      'onPointermove': (event: PointerEvent) => trackPlane(event, key, value, apply),
    }, [
      h('span', {
        class: 'plane-thumb',
        style: { insetInlineStart: `${hsv.s}%`, insetBlockStart: `${100 - hsv.v}%`, backgroundColor: hsvToHex(hsv) },
      }),
    ]),
    h(Theme, { theme: canvasEditorTheme }, () => h(Slider, {
      'label': 'Hue',
      'isLabelHidden': true,
      'min': 0,
      'max': 360,
      'modelValue': hsv.h,
      'valueDisplay': 'none',
      'onUpdate:modelValue': (next: number | [number, number]) => setHsv(key, { ...hsv, h: Array.isArray(next) ? next[0] : next }, apply),
    })),
    h(TextInput, {
      'label': 'Hex',
      'isLabelHidden': true,
      'size': 'sm',
      'modelValue': value ?? '',
      'onUpdate:modelValue': (next: string) => {
        if (/^#?[\da-f]{6}$/i.test(next.trim())) {
          pickerHsv.value = { ...pickerHsv.value, [key]: hexToHsv(next) }
          apply(next.startsWith('#') ? next : `#${next}`)
        }
      },
    }),
  ])
}

/** 打开选色器的小方块：和输入框一样高，空槽位画一道斜线。 */
const Swatch = defineComponent({
  name: 'Swatch',
  props: {
    label: { type: String, required: true },
    value: { type: String, default: undefined },
    hsvKey: { type: String, required: true },
  },
  emits: ['change'],
  setup(props, { emit, slots }) {
    return () => h(Popover, { label: props.label, placement: 'start', alignment: 'start', width: 248 }, {
      content: () => h(VStack, { gap: 3 }, () => [
        h(Text, { type: 'label', weight: 'semibold' }, () => props.label),
        colorPicker(props.hsvKey, props.value ?? '#ffffff', hex => emit('change', hex)),
        slots.default?.(),
      ]),
      default: () => h('button', {
        'type': 'button',
        'aria-label': `${props.label}${props.value ? `, ${props.value}` : ', not set'}`,
        'class': ['swatch', props.value != null && 'swatch-filled'],
        'style': props.value != null ? { backgroundColor: props.value } : undefined,
      }),
    })
  },
})

/** 一个可空的样式槽位：输入框、选色方块、清除按钮。 */
const StyleRow = defineComponent({
  name: 'StyleRow',
  props: {
    label: { type: String, required: true },
    name: { type: String, default: undefined },
    value: { type: String, default: undefined },
    hsvKey: { type: String, required: true },
  },
  emits: ['change', 'clear'],
  setup(props, { emit, slots }) {
    return () => {
      const name = props.name ?? props.label
      return h(InspectorRow, { label: props.label }, () => [
        h(StackItem, { size: 'fill' }, () => h(TextInput, {
          'label': name,
          'isLabelHidden': true,
          'size': 'sm',
          'modelValue': props.value ?? '',
          'placeholder': 'Add…',
          'onUpdate:modelValue': (next: string) => emit('change', next),
        })),
        h(Swatch, { label: name, value: props.value, hsvKey: props.hsvKey, onChange: (hex: string) => emit('change', hex) }, slots.default),
        h(IconButton, {
          label: `Clear ${name.toLowerCase()}`,
          tooltip: 'Clear',
          size: 'sm',
          variant: 'ghost',
          isDisabled: props.value === undefined,
          onClick: () => emit('clear'),
        }, () => h(Icon, { name: 'lucide:x', size: 'sm' })),
      ])
    }
  },
})

/** 阴影除颜色外的四个数：和颜色放在同一个气泡里，因为阴影是一件事。 */
const ShadowFields = defineComponent({
  name: 'ShadowFields',
  props: {
    name: { type: String, required: true },
    shadow: { type: Object, required: true },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const field = (key: 'x' | 'y' | 'blur' | 'spread', label: string) => h(InspectorRow, { label, labelWidth: 56 }, () =>
      h(StackItem, { size: 'fill' }, () => h(NumberInput, {
        'label': `${props.name} ${label.toLowerCase()}`,
        'isLabelHidden': true,
        'size': 'sm',
        'hasNumberSteppers': true,
        'modelValue': (props.shadow as Shadow)[key],
        'isWheelEnabled': false,
        'onUpdate:modelValue': (next: number | null) => emit('change', { ...(props.shadow as Shadow), [key]: num(next) }),
      })))
    return () => h(VStack, { gap: 2 }, () => [field('x', 'X'), field('y', 'Y'), field('blur', 'Blur'), field('spread', 'Spread')])
  },
})

/** 菜单快捷键：一整串暗色小字，贴着菜单右缘。 */
const Shortcut = defineComponent({
  name: 'Shortcut',
  setup(_, { slots }) {
    return () => h(Text, { type: 'supporting', color: 'secondary' }, slots.default)
  },
})
</script>

<template>
  <!--
    外面这层 Theme 管外观模式，同时需要自己的底色：面板和工具栏是透明的，
    不然文字换了模式的颜色，背景却还是宿主页面的。Section 画出这个模式自己的背景。
  -->
  <Theme :theme="neutralTheme" :mode="appearance">
    <Section variant="section" :padding="0">
      <Layout height="fill" :padding="0">
        <template #header>
          <!--
            不是 Toolbar：工具栏是一组方向键走过的并列命令，文档标签放进去两头都不对。
            这是它所在 Layout 的页眉插槽，也就是 LayoutHeader 本来的用途。
          -->
          <LayoutHeader has-divider :padding="1" class="header-bar">
            <HStack :gap="0.5" align="center" h-align="between">
              <HStack :gap="0.5" align="center" class="header-lead">
                <DropdownMenu
                  :button="{ label: 'Menu', tooltip: 'Menu', variant: 'ghost', size: 'sm', isIconOnly: true, icon: lucide('menu') }"
                  :has-chevron="false"
                  :menu-width="280"
                >
                  <DropdownMenuSubMenu label="File">
                    <DropdownMenuItem label="New poster">
                      <template #endContent>
                        <Shortcut>⌘N</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem label="Open…">
                      <template #endContent>
                        <Shortcut>⌘O</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuDivider />
                    <DropdownMenuItem label="Save">
                      <template #endContent>
                        <Shortcut>⌘S</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem label="Save as…">
                      <template #endContent>
                        <Shortcut>⇧⌘S</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuSubMenu label="Export">
                      <DropdownMenuItem v-for="format in EXPORT_FORMATS" :key="format" :label="format" />
                    </DropdownMenuSubMenu>
                    <DropdownMenuDivider />
                    <DropdownMenuItem label="Close">
                      <template #endContent>
                        <Shortcut>⌘W</Shortcut>
                      </template>
                    </DropdownMenuItem>
                  </DropdownMenuSubMenu>

                  <DropdownMenuSubMenu label="Edit">
                    <DropdownMenuItem label="Undo">
                      <template #endContent>
                        <Shortcut>⌘Z</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem label="Redo">
                      <template #endContent>
                        <Shortcut>⇧⌘Z</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuDivider />
                    <DropdownMenuItem label="Cut">
                      <template #endContent>
                        <Shortcut>⌘X</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem label="Copy">
                      <template #endContent>
                        <Shortcut>⌘C</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem label="Paste">
                      <template #endContent>
                        <Shortcut>⌘V</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuDivider />
                    <DropdownMenuItem label="Duplicate">
                      <template #endContent>
                        <Shortcut>⌘D</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem :label="`Delete ${selected.name}`" variant="destructive">
                      <template #endContent>
                        <Shortcut>⌫</Shortcut>
                      </template>
                    </DropdownMenuItem>
                  </DropdownMenuSubMenu>

                  <DropdownMenuSubMenu label="View">
                    <DropdownMenuCheckboxItem v-model="chrome.left" label="Left panel">
                      <template #icon>
                        <Icon name="lucide:panel-left" size="sm" />
                      </template>
                      <template #endContent>
                        <Shortcut>⌘B</Shortcut>
                      </template>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem v-model="chrome.right" label="Right panel">
                      <template #icon>
                        <Icon name="lucide:panel-right" size="sm" />
                      </template>
                      <template #endContent>
                        <Shortcut>⇧⌘B</Shortcut>
                      </template>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem v-model="chrome.toolbar" label="Canvas tools">
                      <template #icon>
                        <Icon name="lucide:panel-bottom" size="sm" />
                      </template>
                      <template #endContent>
                        <Shortcut>⌘.</Shortcut>
                      </template>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuDivider />
                    <DropdownMenuSubMenu label="Zoom">
                      <DropdownMenuRadioGroup v-model="zoom" label="Zoom">
                        <DropdownMenuRadioItem
                          v-for="option in ZOOM_OPTIONS"
                          :key="option.value"
                          :value="option.value"
                          :label="option.label"
                        />
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubMenu>
                    <DropdownMenuSubMenu label="Appearance">
                      <DropdownMenuRadioGroup v-model="appearance" label="Appearance">
                        <DropdownMenuRadioItem value="light" label="Light" />
                        <DropdownMenuRadioItem value="dark" label="Dark" />
                        <DropdownMenuRadioItem value="system" label="System" />
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubMenu>
                  </DropdownMenuSubMenu>

                  <DropdownMenuSubMenu label="Object">
                    <DropdownMenuSubMenu label="Insert">
                      <DropdownMenuItem v-for="item in INSERT_ITEMS" :key="item.label" :label="item.label">
                        <template #icon>
                          <Icon :name="item.icon" size="sm" />
                        </template>
                      </DropdownMenuItem>
                    </DropdownMenuSubMenu>
                    <DropdownMenuDivider />
                    <DropdownMenuItem label="Bring forward">
                      <template #endContent>
                        <Shortcut>⌘]</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem label="Send backward">
                      <template #endContent>
                        <Shortcut>⌘[</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuDivider />
                    <DropdownMenuCheckboxItem
                      :model-value="selected.isLocked"
                      :label="`Lock ${selected.name}`"
                      @update:model-value="next => updateSelected({ isLocked: next })"
                    >
                      <template #icon>
                        <Icon :name="selected.isLocked ? 'lucide:lock' : 'lucide:lock-open'" size="sm" />
                      </template>
                      <template #endContent>
                        <Shortcut>⇧⌘L</Shortcut>
                      </template>
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuSubMenu>

                  <DropdownMenuDivider />

                  <DropdownMenuSubMenu label="Help">
                    <DropdownMenuItem label="Keyboard shortcuts">
                      <template #endContent>
                        <Shortcut>⌘/</Shortcut>
                      </template>
                    </DropdownMenuItem>
                    <DropdownMenuItem label="Documentation" />
                    <DropdownMenuDivider />
                    <DropdownMenuItem label="About this editor" />
                  </DropdownMenuSubMenu>
                </DropdownMenu>

                <HStack
                  role="group"
                  aria-label="Open documents"
                  :gap="0"
                  align="center"
                  :padding-inline="2"
                  :padding-block="1"
                  is-scrollable
                  :max-width="`calc(100cqw - ${TAB_STRIP_RESERVE}px)`"
                  class="tab-strip"
                >
                  <template v-for="(tab, index) in tabs" :key="tab.id">
                    <Divider
                      v-if="index > 0"
                      orientation="vertical"
                      class="tab-rule"
                      :class="{ 'tab-rule-hidden': tabs[index - 1].id === activeTab || tab.id === activeTab }"
                    />
                    <ListItem
                      :label="tab.name"
                      density="compact"
                      :is-selected="tab.id === activeTab"
                      :aria-current="tab.id === activeTab ? 'true' : undefined"
                      :on-click="() => { activeTab = tab.id }"
                      class="doc-tab"
                      :class="[layerReveal.containerProps().class, tab.id === activeTab ? 'doc-tab-selected' : 'doc-tab-hover']"
                    >
                      <template #startContent>
                        <Icon name="lucide:file" size="sm" :color="tab.id === activeTab ? 'primary' : 'secondary'" />
                      </template>
                      <template #endContent>
                        <IconButton
                          :label="`Close ${tab.name}`"
                          variant="ghost"
                          size="sm"
                          :class="tabRevealClass(tab.id === activeTab)"
                          @click="closeTab(tab.id)"
                        >
                          <Icon name="lucide:x" size="sm" />
                        </IconButton>
                      </template>
                    </ListItem>
                  </template>
                </HStack>
                <IconButton label="New document" tooltip="New document" variant="ghost" size="sm" @click="addTab">
                  <Icon name="lucide:plus" size="sm" color="secondary" />
                </IconButton>
              </HStack>
              <HStack :gap="3" align="center">
                <Text type="supporting" color="secondary">
                  Saved · 2 min ago
                </Text>
                <DropdownMenu
                  :button="{ label: 'Export', variant: 'ghost', size: 'sm', icon: lucide('download') }"
                  alignment="end"
                  :items="EXPORT_MENU"
                />
              </HStack>
            </HStack>
          </LayoutHeader>
        </template>

        <LayoutContent role="main" :padding="0">
          <VisuallyHidden as="h1">
            Canvas editor
          </VisuallyHidden>
          <Layout height="fill">
            <template v-if="chrome.left" #start>
              <LayoutPanel :resizable="rail.props" :width="rail.size" has-divider :padding="2" label="Layers and assets" class="folds-at-rail">
                <VStack :gap="3">
                  <SegmentedControl v-model="panel" label="Left panel" size="sm" layout="fill">
                    <SegmentedControlItem label="Layers" value="layers" />
                    <SegmentedControlItem label="Library" value="library" />
                  </SegmentedControl>
                  <TreeList v-if="panel === 'layers'" density="compact" :items="layerItems" />
                  <List v-else>
                    <ListItem v-for="preset in EFFECT_PRESETS" :key="preset.label" as="li" density="compact" :label="preset.label">
                      <template #startContent>
                        <Icon :name="preset.icon" size="sm" color="secondary" />
                      </template>
                    </ListItem>
                  </List>
                </VStack>
              </LayoutPanel>
              <ResizeHandle
                :resizable="rail.props"
                :is-always-visible="false"
                pill-placement="center"
                label="Resize layers panel"
                class="folds-at-rail"
              />
            </template>

            <LayoutContent :padding="0">
              <Section variant="muted" :padding="0" height="100%">
                <Layout height="fill" :padding="4">
                  <LayoutContent :padding="6">
                    <HStack width="max-content" height="max-content" min-height="100%" class="canvas-stage">
                      <Card
                        dir="ltr"
                        :padding="0"
                        elevation="med"
                        :width="FRAME.width * scale"
                        :height="FRAME.height * scale"
                        class="artboard-frame artboard-centered"
                      >
                        <Theme :theme="canvasEditorTheme" mode="light">
                          <AspectRatio :ratio="FRAME.width / FRAME.height" fit="cover" class="artboard" :style="{ width: `${FRAME.width}px`, transform: `scale(${scale})` }">
                            <img :src="PHOTO_LAYER_SRC" :alt="photo.content" :style="{ filter: filterCss(photo.filters ?? NO_FILTERS) }">
                            <VStack :padding="6" :gap="3" v-bind="{ vAlign: V_ALIGN[headline.alignY ?? 'start'] }" class="text-layers">
                              <Text type="supporting" display="block" :style="typeStyle(dateline)">
                                {{ dateline.content }}
                              </Text>
                              <Heading :level="2" type="display-1" text-wrap="balance" :style="typeStyle(headline)">
                                {{ headline.content }}
                              </Heading>
                            </VStack>
                          </AspectRatio>
                        </Theme>
                      </Card>
                    </HStack>
                  </LayoutContent>
                  <template v-if="chrome.toolbar" #footer>
                    <LayoutFooter>
                      <Center>
                        <Card :padding="1" elevation="high">
                          <Toolbar label="Canvas tools" size="sm">
                            <template #start>
                              <IconButton label="Undo" tooltip="Undo" variant="ghost" class="toolbar-control" @click="demo('Demo: the last change would be undone here', 'undo')">
                                <Icon name="lucide:undo-2" size="sm" />
                              </IconButton>
                              <IconButton label="Redo" tooltip="Redo" variant="ghost" class="toolbar-control" @click="demo('Demo: the change would be redone here', 'redo')">
                                <Icon name="lucide:redo-2" size="sm" />
                              </IconButton>
                              <Divider orientation="vertical" class="toolbar-rule" />
                              <IconButton label="Add frame" tooltip="Add frame" variant="ghost" class="toolbar-control" @click="demo('Demo: a new frame would be added here', 'add-frame')">
                                <Icon name="lucide:frame" size="sm" />
                              </IconButton>
                              <IconButton label="Add text" tooltip="Add text" variant="ghost" class="toolbar-control" @click="demo('Demo: a new text layer would be added here', 'add-text')">
                                <Icon name="lucide:type" size="sm" />
                              </IconButton>
                              <IconButton label="Add image" tooltip="Add image" variant="ghost" class="toolbar-control" @click="demo('Demo: an image picker would open here', 'add-image')">
                                <Icon name="lucide:image" size="sm" />
                              </IconButton>
                              <Divider orientation="vertical" class="toolbar-rule" />
                              <Selector
                                v-model="zoom"
                                label="Zoom"
                                is-label-hidden
                                variant="ghost"
                                :options="ZOOM_OPTIONS"
                                placement="above"
                                :width="92"
                                control-class="toolbar-control toolbar-trailing"
                              />
                            </template>
                          </Toolbar>
                        </Card>
                      </Center>
                    </LayoutFooter>
                  </template>
                </Layout>
              </Section>
            </LayoutContent>

            <template v-if="chrome.right" #end>
              <ResizeHandle
                :resizable="inspector.props"
                is-reversed
                :is-always-visible="false"
                pill-placement="center"
                label="Resize properties panel"
                class="folds-at-inspector"
              />
              <LayoutPanel
                :resizable="inspector.props"
                :width="inspector.size"
                has-divider
                :padding="0"
                is-scrollable
                :label="`${selected.name} properties`"
                class="folds-at-inspector"
              >
                <InspectorSection title="Layout">
                  <InspectorRow label="Padding">
                    <AxisInput :icon="lucide('panel-left-right-dashed')" label="Horizontal padding" :value="selected.paddingInline" @change="next => updateSelected({ paddingInline: next })" />
                    <AxisInput :icon="lucide('panel-top-bottom-dashed')" label="Vertical padding" :value="selected.paddingBlock" @change="next => updateSelected({ paddingBlock: next })" />
                    <IconButton label="Set padding per side" tooltip="Per side" size="sm" variant="ghost" @click="demo('Demo: padding fields for each side would open here', 'set-padding-per-side')">
                      <Icon name="lucide:square-square" size="sm" />
                    </IconButton>
                  </InspectorRow>
                </InspectorSection>

                <InspectorSection title="Layer">
                  <InspectorRow label="Position">
                    <AxisInput :icon="GLYPH.x" label="Horizontal position" :value="selected.x" @change="next => updateSelected({ x: next })" />
                    <AxisInput :icon="GLYPH.y" label="Vertical position" :value="selected.y" @change="next => updateSelected({ y: next })" />
                  </InspectorRow>
                  <InspectorRow label="Size">
                    <AxisInput :icon="GLYPH.width" label="Width" :value="selected.width" @change="next => updateSelected({ width: next })" />
                    <AxisInput :icon="GLYPH.height" label="Height" :value="selected.height" @change="next => updateSelected({ height: next })" />
                  </InspectorRow>
                </InspectorSection>

                <InspectorSection title="Styles">
                  <InspectorRow label="Radius">
                    <AxisInput :icon="lucide('scan')" label="Corner radius" :value="selected.radius" @change="next => updateSelected({ radius: next })" />
                    <IconButton label="Set radius per corner" tooltip="Per corner" size="sm" variant="ghost" @click="demo('Demo: radius fields for each corner would open here', 'set-radius-per-corner')">
                      <Icon name="lucide:square-round-corner" size="sm" />
                    </IconButton>
                  </InspectorRow>
                  <StyleRow
                    label="Border"
                    hsv-key="border"
                    :value="selected.border"
                    @change="next => updateSelected({ border: next })"
                    @clear="updateSelected({ border: undefined })"
                  />
                  <StyleRow
                    label="Shadow"
                    name="Box shadow"
                    hsv-key="shadow"
                    :value="selected.shadow?.color"
                    @change="next => updateSelected({ shadow: { ...(selected.shadow ?? NO_SHADOW), color: next } })"
                    @clear="updateSelected({ shadow: undefined })"
                  >
                    <ShadowFields name="Box shadow" :shadow="selected.shadow ?? NO_SHADOW" @change="next => updateSelected({ shadow: next })" />
                  </StyleRow>
                  <StyleRow
                    label="Fill"
                    hsv-key="fill"
                    :value="selected.fill"
                    @change="next => updateSelected({ fill: next })"
                    @clear="updateSelected({ fill: undefined })"
                  />
                </InspectorSection>

                <InspectorSection title="Transforms">
                  <InspectorRow label="Rotate">
                    <AxisInput :icon="lucide('triangle-right')" label="Rotation" :value="selected.rotation" @change="next => updateSelected({ rotation: next })" />
                    <IconButton label="Rotate counterclockwise" tooltip="−90°" size="sm" variant="ghost" @click="updateSelected({ rotation: (selected.rotation + 270) % 360 })">
                      <Icon name="lucide:rotate-ccw" size="sm" />
                    </IconButton>
                    <IconButton label="Rotate clockwise" tooltip="+90°" size="sm" variant="ghost" @click="updateSelected({ rotation: (selected.rotation + 90) % 360 })">
                      <Icon name="lucide:rotate-cw" size="sm" />
                    </IconButton>
                  </InspectorRow>
                  <InspectorRow label="Flip" h-align="end">
                    <IconButton label="Flip horizontally" tooltip="Flip horizontally" size="sm" variant="ghost" @click="demo('Demo: the layer would flip horizontally here', 'flip-horizontally')">
                      <Icon name="lucide:flip-horizontal-2" size="sm" />
                    </IconButton>
                    <IconButton label="Flip vertically" tooltip="Flip vertically" size="sm" variant="ghost" @click="demo('Demo: the layer would flip vertically here', 'flip-vertically')">
                      <Icon name="lucide:flip-vertical-2" size="sm" />
                    </IconButton>
                  </InspectorRow>
                </InspectorSection>

                <InspectorSection v-if="selected.kind === 'text'" title="Text">
                  <TextArea
                    label="Content"
                    is-label-hidden
                    size="sm"
                    :rows="2"
                    :model-value="selected.content"
                    @update:model-value="next => updateSelected({ content: next })"
                  />
                  <InspectorRow label="Font">
                    <StackItem size="fill">
                      <Selector label="Font family" is-label-hidden size="sm" :model-value="selected.family" :options="FONT_OPTIONS.map(value => ({ value, label: value }))" @update:model-value="next => updateSelected({ family: String(next) })" />
                    </StackItem>
                  </InspectorRow>
                  <InspectorRow label="Weight">
                    <StackItem size="fill">
                      <Selector label="Font weight" is-label-hidden size="sm" :model-value="selected.weight" :options="WEIGHT_OPTIONS.map(value => ({ value, label: value }))" @update:model-value="next => updateSelected({ weight: String(next) })" />
                    </StackItem>
                  </InspectorRow>
                  <InspectorRow label="Color">
                    <StackItem size="fill">
                      <TextInput label="Text colour" is-label-hidden size="sm" :model-value="selected.color ?? ''" @update:model-value="next => updateSelected({ color: next })" />
                    </StackItem>
                    <Swatch label="Text colour" hsv-key="text-colour" :value="selected.color" @change="next => updateSelected({ color: next })" />
                  </InspectorRow>
                  <StepperRow label="Size" :value="selected.size ?? 0" @change="next => updateSelected({ size: next })" />
                  <StepperRow label="Line" :value="selected.line ?? 100" @change="next => updateSelected({ line: next })" />
                  <StepperRow label="Spacing" :value="selected.tracking ?? 0" @change="next => updateSelected({ tracking: next })" />
                  <InspectorRow label="Align">
                    <StackItem size="fill">
                      <SegmentedControl label="Horizontal alignment" size="sm" layout="fill" :model-value="selected.alignX ?? 'start'" @change="next => updateSelected({ alignX: next as AlignX })">
                        <SegmentedControlItem v-for="option in ALIGN_X" :key="option.value" :value="option.value" :label="option.label" is-label-hidden>
                          <template #icon>
                            <Icon :name="option.icon" size="sm" />
                          </template>
                        </SegmentedControlItem>
                      </SegmentedControl>
                    </StackItem>
                  </InspectorRow>
                  <InspectorRow label="Align">
                    <StackItem size="fill">
                      <SegmentedControl label="Vertical alignment" size="sm" layout="fill" :model-value="selected.alignY ?? 'start'" @change="next => updateSelected({ alignY: next as AlignY })">
                        <SegmentedControlItem v-for="option in ALIGN_Y" :key="option.value" :value="option.value" :label="option.label" is-label-hidden>
                          <template #icon>
                            <Icon :name="option.icon" size="sm" />
                          </template>
                        </SegmentedControlItem>
                      </SegmentedControl>
                    </StackItem>
                  </InspectorRow>
                  <InspectorRow label="Style">
                    <StackItem size="fill">
                      <SegmentedControl label="Font style" size="sm" layout="fill" :model-value="selected.isItalic ? 'italic' : 'normal'" @change="next => updateSelected({ isItalic: next === 'italic' })">
                        <SegmentedControlItem value="normal" label="Regular" is-label-hidden>
                          <template #icon>
                            <Icon name="lucide:baseline" size="sm" />
                          </template>
                        </SegmentedControlItem>
                        <SegmentedControlItem value="italic" label="Italic" is-label-hidden>
                          <template #icon>
                            <Icon name="lucide:italic" size="sm" />
                          </template>
                        </SegmentedControlItem>
                      </SegmentedControl>
                    </StackItem>
                  </InspectorRow>
                  <InspectorRow label="Decoration">
                    <StackItem size="fill">
                      <SegmentedControl label="Text decoration" size="sm" layout="fill" :model-value="selected.decoration ?? 'none'" @change="next => updateSelected({ decoration: next as Decoration })">
                        <SegmentedControlItem v-for="option in DECORATIONS" :key="option.value" :value="option.value" :label="option.label" is-label-hidden>
                          <template #icon>
                            <Icon :name="option.icon" size="sm" />
                          </template>
                        </SegmentedControlItem>
                      </SegmentedControl>
                    </StackItem>
                  </InspectorRow>
                  <InspectorRow label="Transform">
                    <StackItem size="fill">
                      <SegmentedControl label="Text transform" size="sm" layout="fill" :model-value="selected.transform ?? 'none'" @change="next => updateSelected({ transform: next as Transform })">
                        <SegmentedControlItem v-for="option in TRANSFORMS" :key="option.value" :value="option.value" :label="option.label" is-label-hidden>
                          <template #icon>
                            <Icon :name="option.icon" size="sm" />
                          </template>
                        </SegmentedControlItem>
                      </SegmentedControl>
                    </StackItem>
                  </InspectorRow>
                  <StyleRow
                    label="Shadow"
                    name="Text shadow"
                    hsv-key="text-shadow"
                    :value="selected.textShadow?.color"
                    @change="next => updateSelected({ textShadow: { ...(selected.textShadow ?? NO_SHADOW), color: next } })"
                    @clear="updateSelected({ textShadow: undefined })"
                  >
                    <ShadowFields name="Text shadow" :shadow="selected.textShadow ?? NO_SHADOW" @change="next => updateSelected({ textShadow: next })" />
                  </StyleRow>
                  <InspectorRow label="Stroke">
                    <StackItem size="fill">
                      <NumberInput label="Text stroke" is-label-hidden size="sm" :model-value="selected.stroke ?? 0" :is-wheel-enabled="false" @update:model-value="next => updateSelected({ stroke: num(next) })" />
                    </StackItem>
                    <IconButton label="Clear stroke" tooltip="Clear" size="sm" variant="ghost" :is-disabled="!selected.stroke" @click="updateSelected({ stroke: 0 })">
                      <Icon name="lucide:x" size="sm" />
                    </IconButton>
                  </InspectorRow>
                </InspectorSection>

                <template v-else>
                  <InspectorSection title="Image">
                    <InspectorRow label="Edit">
                      <StackItem size="fill">
                        <TextInput label="Image source" is-label-hidden size="sm" :model-value="imageName" is-read-only />
                      </StackItem>
                      <input ref="fileRef" type="file" accept="image/*" hidden aria-label="Replace image file" @change="onFile">
                      <Thumbnail :src="PHOTO_LAYER_SRC" :alt="`Current image, ${imageName}`" label="Replace image" class="source-thumbnail" @click="fileRef?.click()" />
                    </InspectorRow>
                    <InspectorRow label="Fit">
                      <StackItem size="fill">
                        <Selector label="Image fit" is-label-hidden size="sm" :model-value="selected.fit ?? 'Cover'" :options="FIT_OPTIONS.map(value => ({ value, label: value }))" @update:model-value="next => updateSelected({ fit: String(next) })" />
                      </StackItem>
                    </InspectorRow>
                  </InspectorSection>
                  <InspectorSection title="Filters">
                    <InspectorRow v-for="filter in FILTERS" :key="filter.key" :label="filter.label">
                      <StackItem size="fill">
                        <Slider
                          :label="`${filter.label} slider`"
                          is-label-hidden
                          :min="0"
                          :max="filter.max"
                          :model-value="(selected.filters ?? NO_FILTERS)[filter.key]"
                          value-display="none"
                          @update:model-value="next => updateSelected({ filters: { ...(selected.filters ?? NO_FILTERS), [filter.key]: next } })"
                        />
                      </StackItem>
                      <NumberInput
                        :label="filter.label"
                        is-label-hidden
                        size="sm"
                        :min="0"
                        :max="filter.max"
                        :model-value="(selected.filters ?? NO_FILTERS)[filter.key]"
                        :is-wheel-enabled="false"
                        control-class="filter-value"
                        @update:model-value="next => updateSelected({ filters: { ...(selected.filters ?? NO_FILTERS), [filter.key]: num(next) } })"
                      />
                    </InspectorRow>
                  </InspectorSection>
                </template>
              </LayoutPanel>
            </template>
          </Layout>
        </LayoutContent>
      </Layout>
    </Section>
  </Theme>
</template>

<style>
/* 宽度不够时按宽度收起，不看 View 菜单的开关：开关记的是用户要什么，这里记的是有没有地方放。 */
@media (max-width: 1099.98px) {
  .folds-at-inspector.folds-at-inspector { display: none; }
}
@media (max-width: 839.98px) {
  .folds-at-rail.folds-at-rail { display: none; }
}

/* 标签条按页眉自己的宽度算上限（cqw），页眉不一定贴满窗口。 */
.header-bar {
  container-type: inline-size;
  container-name: editor-header;
}

.header-lead {
  min-width: 0;
}

.tab-strip {
  min-width: 0;
  flex-shrink: 1;
  scrollbar-width: none;
}

.tab-rule {
  height: 16px;
  align-self: center;
  flex-shrink: 0;
}

.tab-rule-hidden {
  visibility: hidden;
}

/* 标签比列表行读得更横：三条 8px 的通道会吃掉名字的六个字符，这里收紧。 */
.doc-tab {
  gap: var(--astryx-spacing-1-5, 6px);
  padding-inline-end: var(--astryx-spacing-1, 4px);
  flex-grow: 0;
  flex-shrink: 1;
  width: 164px;
  min-width: 96px;
}

.doc-tab-selected {
  background-color: var(--astryx-color-background-muted);
}

.doc-tab-hover {
  background-color: transparent;
}

.doc-tab-hover:hover {
  background-color: var(--astryx-color-background-muted);
}

/* 行内的操作按钮：28px 的按钮按 20px 排版，把一步内边距还给行。 */
.item-action {
  margin: calc(-1 * var(--astryx-spacing-1, 4px));
  color: var(--astryx-color-icon-secondary);
}

.item-action:hover {
  color: var(--astryx-color-icon-primary);
}

.item-action:disabled {
  color: var(--astryx-color-icon-disabled);
}

.label-column {
  flex-shrink: 0;
}

.swatch {
  width: var(--astryx-spacing-7, 28px);
  height: var(--astryx-spacing-7, 28px);
  flex-shrink: 0;
  padding: 0;
  border: 1px solid var(--astryx-color-border-emphasized);
  border-radius: var(--astryx-radius-element);
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 45%, var(--astryx-color-border-emphasized) 45% 55%, transparent 55%);
}

.swatch-filled {
  background-image: none;
}

.plane-stack {
  display: grid;
  gap: var(--astryx-spacing-3, 12px);
}

.plane {
  position: relative;
  height: 160px;
  border-radius: var(--astryx-radius-inner);
  background-image: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent);
  cursor: crosshair;
  touch-action: none;
}

.plane-thumb {
  position: absolute;
  width: var(--astryx-spacing-3, 12px);
  height: var(--astryx-spacing-3, 12px);
  border: 2px solid #fff;
  border-radius: var(--astryx-radius-full);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 35%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.filter-value {
  flex-shrink: 0;
  width: 64px;
}

.source-thumbnail {
  width: var(--astryx-spacing-7, 28px);
}

/* 画板按 1080 宽排版一次，缩放只改绘制结果，类型和间距都按画板像素算。 */
.artboard {
  transform-origin: top left;
}

.text-layers {
  position: absolute;
  inset: 0;
}

.artboard-frame {
  overflow: clip;
}

.artboard-centered {
  margin: auto;
}

/* 画布两个方向都能平移：自动外边距居中，空间不够时归零，起点才滚得回去。 */
.canvas-stage {
  min-width: 100%;
}

/* 同心圆角：卡片一步内边距，里面的控件取卡片圆角减去这一步。 */
.toolbar-control {
  border-radius: calc(var(--astryx-radius-container) - var(--astryx-spacing-1, 4px));
}

.toolbar-trailing {
  margin-inline-end: var(--astryx-spacing-2, 8px);
}

.toolbar-rule {
  align-self: stretch;
  height: auto;
  margin-block: var(--astryx-spacing-1, 4px);
}
</style>
