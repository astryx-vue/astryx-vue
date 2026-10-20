import type { Component, VNode, VNodeChild } from 'vue'
import type { LightboxMedia } from './Lightbox/index.js'
import { defineComponent, h } from 'vue'
import { githubDark } from './Code/index.js'
import { createStaticSource } from './composables/index.js'
import { DropdownMenuRadioGroup } from './DropdownMenu/index.js'
import { createPowerSearchConfig } from './PowerSearch/index.js'
import { Step, Stepper } from './Stepper/index.js'
import { Tab, TabList } from './TabList/index.js'
import { neutralTheme } from './Theme/index.js'

// SSR 冒烟测试（ssr-smoke.test.ts）用的「最小可渲染参数」表。
// 键是 packages/core/src/index.ts 里的导出名。表里没写的组件用空 props 渲染。
// 同一个组件用不同名字导出时（例如 ContextMenuRadioItem 就是 DropdownMenuRadioItem），
// 每个名字都要有自己的条目，可以共用同一个对象。

export interface SsrFixture {
  /** 必填 props 和让组件画出内容所需的最少 props。 */
  props?: Record<string, unknown>
  /** 插槽。 */
  slots?: Record<string, () => VNodeChild>
  /** 组件必须放在某个父组件里时，用它包一层。child 是渲染被测组件的函数。 */
  wrap?: (child: () => VNode) => VNode
  /** 组件本来就不输出任何 HTML（例如纯 Provider）时写上原因，允许空输出。 */
  allowEmpty?: string
}

const searchSource = createStaticSource([
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
])

const { config: powerSearchConfig } = createPowerSearchConfig([
  { key: 'name', type: 'string', label: 'Name' },
] as const)

const media: LightboxMedia = { src: 'https://example.com/a.png', alt: 'A' }

const FakeLink: Component = defineComponent({
  name: 'FakeLink',
  setup(_, { slots }) {
    return () => h('a', slots.default?.())
  },
})

const text = (value: string) => () => value

const inStepper = (child: () => VNode): VNode => h(Stepper, { activeStep: 0 }, { default: child })
const inTabList = (child: () => VNode): VNode => h(TabList, { value: 'a' }, { default: child })
const inRadioGroup = (child: () => VNode): VNode => h(DropdownMenuRadioGroup, { label: 'Sort' }, { default: child })

const menuCheckboxItem: SsrFixture = { props: { modelValue: false, label: 'Show hidden' } }
const menuRadioGroup: SsrFixture = { props: { label: 'Sort' }, slots: { default: text('Options') } }
const menuRadioItem: SsrFixture = { props: { value: 'name', label: 'Name' }, wrap: inRadioGroup }
const fieldLabel = { label: 'Name' }
const checkIndicator: SsrFixture = { props: { state: 'checked' } }

export const ssrFixtures: Record<string, SsrFixture> = {
  AlertDialog: { props: { isOpen: true, title: 'Delete?', description: 'This cannot be undone.', actionLabel: 'Delete' } },
  AspectRatio: { props: { ratio: 1 }, slots: { default: text('Box') } },
  AvatarGroupOverflow: { props: { count: 3 } },
  Banner: { props: { status: 'info', title: 'Heads up' } },
  BottomSheet: { props: { label: 'Sheet', isOpen: true }, slots: { default: text('Body') } },
  BreadcrumbMenuCheckboxItem: menuCheckboxItem,
  BreadcrumbMenuRadioGroup: menuRadioGroup,
  BreadcrumbMenuRadioItem: menuRadioItem,
  Button: { props: { label: 'Save' } },
  ButtonGroup: { props: { label: 'Actions' }, slots: { default: text('Buttons') } },
  ChatComposerTokenElement: { props: { token: { value: 'user:1', label: 'Ada' } } },
  ChatDictationButton: {
    props: { dictation: { isSupported: true, isListening: false, bands: [], volume: 0, toggle: () => {} } },
  },
  ChatLayoutScrollButton: { props: { isVisible: true } },
  ChatMessage: { props: { sender: 'user' }, slots: { default: text('Hello') } },
  ChatMessageMetadata: { props: { timestamp: '10:00' } },
  ChatToolCalls: { props: { calls: [{ name: 'search', status: 'complete' }] } },
  CheckboxIndicator: { props: { state: 'checked' } },
  CheckboxInput: { props: { ...fieldLabel, modelValue: false } },
  CheckboxList: { props: { label: 'Fruits' }, slots: { default: text('Items') } },
  CheckboxListItem: { props: { label: 'Apple' } },
  CheckIndicator: checkIndicator,
  Citation: { props: { source: { title: 'Source', url: 'https://example.com' }, number: 1 } },
  CollapsibleGroup: { slots: { default: text('Sections') } },
  ClickableCard: { props: { label: 'Open' }, slots: { default: text('Card') } },
  CodeBlock: { props: { code: 'const a = 1' } },
  CommandPalette: { props: { isOpen: true, searchSource } },
  CommandPaletteGroup: { props: { heading: 'Recent' }, slots: { default: text('Items') } },
  CommandPaletteItem: { props: { value: 'open' }, slots: { default: text('Open') } },
  ComplexSelector: { props: { label: 'Fruit', modelValue: 'apple', triggerLabel: 'Apple' } },
  ContextMenuCheckboxItem: menuCheckboxItem,
  ContextMenuRadioGroup: menuRadioGroup,
  ContextMenuRadioItem: menuRadioItem,
  DateRangeInput: { props: fieldLabel },
  DateTimeInput: { props: fieldLabel },
  Dialog: { props: { isOpen: true }, slots: { default: text('Body') } },
  DialogHeader: { props: { title: 'Title' } },
  DropdownMenuCheckboxItem: menuCheckboxItem,
  DropdownMenuRadioGroup: menuRadioGroup,
  DropdownMenuRadioItem: menuRadioItem,
  EmptyState: { props: { title: 'Nothing here' } },
  Field: { props: { label: 'Name', inputId: 'name' }, slots: { default: text('Input') } },
  FieldLabel: { props: { label: 'Name', inputId: 'name' } },
  FieldStatus: { props: { type: 'error', message: 'Required' } },
  FileInput: { props: fieldLabel },
  Heading: { props: { level: 2 }, slots: { default: text('Title') } },
  IconButton: { props: { label: 'Close', icon: 'close' } },
  InternationalizationProvider: { props: { locale: 'en' }, slots: { default: text('Content') } },
  Kbd: { props: { keys: 'mod+k' } },
  LayerProvider: { slots: { default: text('Content') } },
  Lightbox: { props: { isOpen: true, media } },
  LinkProvider: { props: { component: FakeLink }, slots: { default: text('Content') } },
  MetadataListItem: { props: { label: 'Owner' }, slots: { default: text('Ada') } },
  MoreMenu: { props: { items: [{ label: 'Edit' }] } },
  MultiSelector: { props: { label: 'Fruits', options: ['Apple', 'Banana'] } },
  NavItem: { props: { label: 'Home' } },
  NavMenuItem: { props: { label: 'Home' } },
  Outline: { props: { items: [{ id: 'intro', label: 'Intro', level: 2 }] } },
  OverflowList: { props: { items: [{ label: 'One' }, { label: 'Two' }] } },
  PowerSearch: { props: { config: powerSearchConfig } },
  Radio: { props: { value: 'a', label: 'A' } },
  RadioGroup: { props: { label: 'Choice', modelValue: 'a' }, slots: { default: text('Options') } },
  RadioIndicator: checkIndicator,
  RadioList: { props: { label: 'Choice', modelValue: 'a' }, slots: { default: text('Options') } },
  RadioListItem: { props: { value: 'a', label: 'A' } },
  ScrollableArea: { props: { label: 'List' }, slots: { default: text('Row') } },
  ScrollbarsProvider: { slots: { default: text('Content') } },
  SegmentedControl: { props: { label: 'View', modelValue: 'a' }, slots: { default: text('Items') } },
  SegmentedControlItem: { props: { value: 'a', label: 'A' } },
  SelectableCard: { props: { label: 'Plan', isSelected: false }, slots: { default: text('Card') } },
  Selector: { props: { label: 'Fruit', options: ['Apple', 'Banana'] } },
  SideNavCollapseButton: { props: { isCollapsed: false } },
  SideNavHeading: { props: { heading: 'Section' } },
  SideNavItem: { props: { label: 'Home' } },
  SideNavSection: { props: { title: 'Section' }, slots: { default: text('Items') } },
  Slider: { props: { label: 'Volume', modelValue: 50 } },
  StatusDot: { props: { label: 'Online' } },
  Step: { props: { step: 0, label: 'Cart' }, wrap: inStepper },
  Stepper: { props: { activeStep: 0 }, slots: { default: () => h(Step, { step: 0, label: 'Cart' }) } },
  Switch: { props: { label: 'Wi-Fi', modelValue: false } },
  SyntaxTheme: { props: { theme: githubDark }, slots: { default: text('Code') } },
  Tab: { props: { value: 'a' }, slots: { default: text('Tab A') }, wrap: inTabList },
  TabList: { props: { value: 'a' }, slots: { default: () => h(Tab, { value: 'a' }, () => 'Tab A') } },
  TabMenu: { props: { label: 'More', options: [{ value: 'b', label: 'Tab B' }] }, wrap: inTabList },
  TextArea: { props: { label: 'Notes', modelValue: '' } },
  TextInput: { props: { label: 'Name', modelValue: '' } },
  Theme: { props: { theme: neutralTheme }, slots: { default: text('Content') } },
  MediaTheme: { props: { mode: 'light' }, slots: { default: text('Content') } },
  TimeInput: { props: fieldLabel },
  Timestamp: { props: { value: '2024-01-01T00:00:00Z' } },
  Toast: { props: { body: 'Saved' } },
  ToggleButton: { props: { label: 'Bold' } },
  ToggleButtonGroup: { props: { label: 'Format' }, slots: { default: text('Buttons') } },
  Token: { props: { label: 'Tag' } },
  Tokenizer: { props: { label: 'Fruits', searchSource } },
  Toolbar: { props: { label: 'Tools' }, slots: { default: text('Buttons') } },
  TopNavItem: { props: { label: 'Home' } },
  TopNavMegaMenu: { props: { label: 'Products' }, slots: { default: text('Items') } },
  TopNavMegaMenuFeaturedCard: { props: { title: 'Featured' } },
  TopNavMegaMenuItem: { props: { title: 'Item' } },
  TopNavMenu: { props: { label: 'Products' }, slots: { default: text('Items') } },
  TreeList: { props: { items: [{ id: 'a', label: 'A' }] } },
  BaseTypeahead: { props: { searchSource, label: 'Fruit' } },
  Typeahead: { props: { searchSource, label: 'Fruit' } },
  TypeaheadItem: { props: { item: { id: 'apple', label: 'Apple' } } },
}
