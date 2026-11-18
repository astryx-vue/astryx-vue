<script setup lang="ts">
import {
  AspectRatio,
  Button,
  Card,
  Center,
  Dialog,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Kbd,
  Layout,
  LayoutContent,
  ListItem,
  SegmentedControl,
  SegmentedControlItem,
  SelectableCard,
  Selector,
  SideNav,
  SideNavItem,
  SideNavSection,
  StackItem,
  Switch,
  Text,
  TextInput,
  Token,
  Tooltip,
  useMediaQuery,
  useImperativeAlertDialog,
  useToast,
  VStack,
} from '@astryx-vue/core'
import type { Component } from 'vue'
import { computed, defineComponent, h, ref, watch } from 'vue'

/** Below this the dialog swaps its rail for a strip of tabs. */
const NARROW_VIEWPORT = '(max-width: 640px)'

/** Floor for every control that sits in a row's right column. */
const CONTROL_WIDTH = 192

function noop() {}

type PanelId
  = | 'profile'
    | 'security'
    | 'billing'
    | 'appearance'
    | 'notifications'
    | 'shortcuts'
    | 'language'
    | 'privacy'
    | 'integrations'
    | 'developer'

interface PanelConfig {
  id: PanelId
  label: string
  description: string
  icon: string
}

/** Heroicons outline, one set, so every row icon carries the same stroke weight. */
const ICONS = {
  user: 'heroicons:user',
  userCircle: 'heroicons:user-circle',
  briefcase: 'heroicons:briefcase',
  tag: 'heroicons:tag',
  clock: 'heroicons:clock',
  signal: 'heroicons:signal',
  key: 'heroicons:key',
  lockClosed: 'heroicons:lock-closed',
  shieldCheck: 'heroicons:shield-check',
  fingerPrint: 'heroicons:finger-print',
  computerDesktop: 'heroicons:computer-desktop',
  devicePhone: 'heroicons:device-phone-mobile',
  cube: 'heroicons:cube',
  users: 'heroicons:users',
  envelope: 'heroicons:envelope',
  receiptPercent: 'heroicons:receipt-percent',
  creditCard: 'heroicons:credit-card',
  paintBrush: 'heroicons:paint-brush',
  swatch: 'heroicons:swatch',
  documentText: 'heroicons:document-text',
  bars3: 'heroicons:bars-3',
  handRaised: 'heroicons:hand-raised',
  atSymbol: 'heroicons:at-symbol',
  chatBubble: 'heroicons:chat-bubble-left-right',
  speakerWave: 'heroicons:speaker-wave',
  commandLine: 'heroicons:command-line',
  language: 'heroicons:language',
  mapPin: 'heroicons:map-pin',
  globeAlt: 'heroicons:globe-alt',
  calendarDays: 'heroicons:calendar-days',
  magnifyingGlass: 'heroicons:magnifying-glass',
  eye: 'heroicons:eye',
  sparkles: 'heroicons:sparkles',
  arrowDownTray: 'heroicons:arrow-down-tray',
  trash: 'heroicons:trash',
  folder: 'heroicons:folder',
  codeBracket: 'heroicons:code-bracket',
  link: 'heroicons:link',
  beaker: 'heroicons:beaker',
  documentMagnifyingGlass: 'heroicons:document-magnifying-glass',
  pencilSquare: 'heroicons:pencil-square',
  arrowDownOnSquare: 'heroicons:arrow-down-on-square',
  cog: 'heroicons:cog-6-tooth',
  arrowUturnLeft: 'heroicons:arrow-uturn-left',
  puzzlePiece: 'heroicons:puzzle-piece',
  bell: 'heroicons:bell',
  sun: 'heroicons:sun',
  moon: 'heroicons:moon',
} as const

const PANEL_GROUPS: { label: string, panels: PanelConfig[] }[] = [
  {
    label: 'Account',
    panels: [
      { id: 'profile', label: 'Profile', description: 'How you appear to everyone else in the workspace.', icon: ICONS.userCircle },
      { id: 'security', label: 'Login & security', description: 'Sign-in methods and the devices signed in right now.', icon: ICONS.lockClosed },
      { id: 'billing', label: 'Billing', description: 'Your plan, seats, and where invoices are sent.', icon: ICONS.creditCard },
    ],
  },
  {
    label: 'Workspace',
    panels: [
      { id: 'appearance', label: 'Appearance', description: 'Theme and density for this browser.', icon: ICONS.paintBrush },
      { id: 'notifications', label: 'Notifications', description: 'What reaches you, and where it arrives.', icon: ICONS.bell },
      { id: 'shortcuts', label: 'Keyboard shortcuts', description: 'Rebind or switch off any shortcut on this surface.', icon: ICONS.commandLine },
      { id: 'language', label: 'Language & region', description: 'Language, formats, and time zone.', icon: ICONS.globeAlt },
    ],
  },
  {
    label: 'Advanced',
    panels: [
      { id: 'privacy', label: 'Privacy', description: 'What you share, and what we keep.', icon: ICONS.shieldCheck },
      { id: 'integrations', label: 'Connected apps', description: 'Services with access to this workspace.', icon: ICONS.puzzlePiece },
      { id: 'developer', label: 'Developer', description: 'API access and pre-release features.', icon: ICONS.codeBracket },
    ],
  },
]

const PANELS = PANEL_GROUPS.flatMap(group => group.panels)

function panelConfig(id: PanelId) {
  return PANELS.find(panel => panel.id === id) ?? PANELS[0]
}

const settings = ref({
  displayName: 'Alex Johnson',
  jobTitle: 'Product designer',
  pronouns: 'they',
  showLocalTime: true,
  presence: 'available',
  twoFactor: true,
  billingEmail: 'billing@example.com',
  emailInvoices: true,
  theme: 'system',
  accent: 'blue',
  font: 'system',
  density: 'comfortable',
  reduceMotion: false,
  emailMentions: true,
  emailComments: false,
  weeklyDigest: true,
  desktopAlerts: true,
  notificationSounds: false,
  quietHours: 'none',
  language: 'en-US',
  region: 'US',
  timezone: 'PT',
  weekStart: 'sun',
  discoverable: true,
  readReceipts: true,
  activityStatus: false,
  personalization: true,
  apiAccess: false,
  webhookUrl: '',
  earlyAccess: false,
  verboseLogging: false,
})

function update<K extends keyof typeof settings.value>(key: K, value: (typeof settings.value)[K]) {
  settings.value = { ...settings.value, [key]: value }
}

/** `Selector` reports `string | number | null`; only a picked option reaches the state. */
function updateFromSelector<K extends keyof typeof settings.value>(key: K, value: string | number | null) {
  if (value == null)
    return
  update(key, String(value) as (typeof settings.value)[K])
}

// SegmentedControl 的 update:modelValue 事件参数在我们的类型里是 unknown，用可写
// computed 走 v-model，让 defineModel 那侧的 string 类型生效。
const density = computed({
  get: () => settings.value.density,
  set: (value: string) => update('density', value),
})

const weekStart = computed({
  get: () => settings.value.weekStart,
  set: (value: string) => update('weekStart', value),
})

const activePanel = ref<PanelId>('profile')
const titleId = 'settings-dialog-title'
const showToast = useToast()
const confirm = useImperativeAlertDialog()
const ConfirmHost = confirm.Host

/** 仅演示：真实页面在这里调用对应的操作。 */
function demo(body: string, uniqueID: string) {
  showToast({ body, uniqueID })
}

function confirmDeleteAccount() {
  confirm.show({
    title: 'Delete your account?',
    description: 'This demo won\'t delete anything. In your app, this would permanently delete your account and the workspace with it.',
    actionLabel: 'Delete account',
    onAction: () => {
      confirm.hide()
      demo('Demo: your account would be deleted here', 'delete-account')
    },
  })
}
const isNarrow = useMediaQuery(NARROW_VIEWPORT)
const searchQuery = ref('')
const searchActiveIndex = ref(0)

const SEARCHABLE_SETTINGS = [
  { title: 'Display name', description: 'The name shown on your posts and comments', panel: 'profile' as PanelId, icon: ICONS.userCircle },
  { title: 'Two-factor authentication', description: 'Require a second step when signing in', panel: 'security' as PanelId, icon: ICONS.key },
  { title: 'Active sessions', description: 'Devices currently signed in to this account', panel: 'security' as PanelId, icon: ICONS.computerDesktop },
  { title: 'Plan', description: 'Your current subscription and seat count', panel: 'billing' as PanelId, icon: ICONS.creditCard },
  { title: 'Color theme', description: 'Light, dark, or follow the system', panel: 'appearance' as PanelId, icon: ICONS.paintBrush },
  { title: 'Interface density', description: 'How much breathing room rows and lists get', panel: 'appearance' as PanelId, icon: ICONS.bars3 },
  { title: 'Email notifications', description: 'Mentions, comments, and the weekly digest', panel: 'notifications' as PanelId, icon: ICONS.envelope },
  { title: 'Quiet hours', description: 'Hold desktop notifications until the morning', panel: 'notifications' as PanelId, icon: ICONS.clock },
  { title: 'Keyboard shortcuts', description: 'Rebind a shortcut, or switch one off', panel: 'shortcuts' as PanelId, icon: ICONS.commandLine },
  { title: 'Time zone', description: 'Used for scheduling and timestamps', panel: 'language' as PanelId, icon: ICONS.globeAlt },
  { title: 'Read receipts', description: 'Let people see when you have read a message', panel: 'privacy' as PanelId, icon: ICONS.shieldCheck },
  { title: 'Export my data', description: 'Download everything this account holds', panel: 'privacy' as PanelId, icon: ICONS.arrowDownTray },
  { title: 'Connected apps', description: 'Calendar, storage, and chat integrations', panel: 'integrations' as PanelId, icon: ICONS.puzzlePiece },
  { title: 'API access', description: 'Personal access tokens and webhooks', panel: 'developer' as PanelId, icon: ICONS.codeBracket },
]

const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())
const isSearchActive = computed(() => normalizedSearch.value.length > 0)
const searchResults = computed(() => {
  if (!isSearchActive.value)
    return []
  const q = normalizedSearch.value
  return SEARCHABLE_SETTINGS.filter(setting =>
    setting.title.toLowerCase().includes(q)
    || setting.description.toLowerCase().includes(q)
    || panelConfig(setting.panel).label.toLowerCase().includes(q),
  )
})

watch(normalizedSearch, () => { searchActiveIndex.value = 0 })

function selectPanel(panel: PanelId) {
  activePanel.value = panel
  searchQuery.value = ''
}

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && searchQuery.value) {
    event.preventDefault()
    searchQuery.value = ''
    return
  }
  const results = searchResults.value
  if (!isSearchActive.value || results.length === 0)
    return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    searchActiveIndex.value = (searchActiveIndex.value + 1) % results.length
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    searchActiveIndex.value = (searchActiveIndex.value - 1 + results.length) % results.length
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    const hit = results[searchActiveIndex.value]
    if (hit)
      selectPanel(hit.panel)
  }
}

const THEME_CHOICES = [
  { value: 'light', label: 'Light', icon: ICONS.sun },
  { value: 'dark', label: 'Dark', icon: ICONS.moon },
  { value: 'system', label: 'System', icon: ICONS.computerDesktop },
]

const INTERFACE_FONTS = [
  { value: 'system', label: 'System', stack: 'system-ui, sans-serif' },
  { value: 'serif', label: 'Serif', stack: 'Georgia, serif' },
  { value: 'mono', label: 'Monospace', stack: 'ui-monospace, monospace' },
]

/** The chosen face as a token override, so every `Text` in the preview follows it. */
const fontPreviewStyle = computed(() => ({
  '--astryx-font-family-body': INTERFACE_FONTS.find(font => font.value === settings.value.font)?.stack ?? '',
}))

const PRONOUN_OPTIONS = [
  { value: 'none', label: 'Not specified' },
  { value: 'they', label: 'they/them' },
  { value: 'she', label: 'she/her' },
  { value: 'he', label: 'he/him' },
]

const PRESENCE_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'away', label: 'Away' },
]

const ACCENT_OPTIONS = [
  { value: 'blue', label: 'Blue' },
  { value: 'teal', label: 'Teal' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
]

const QUIET_HOURS_OPTIONS = [
  { value: 'none', label: 'Off' },
  { value: 'evening', label: '18:00 – 09:00' },
  { value: 'night', label: '22:00 – 07:00' },
]

const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
]

const REGION_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'JP', label: 'Japan' },
]

const TIMEZONE_OPTIONS = [
  { value: 'PT', label: 'Pacific (GMT-08:00)' },
  { value: 'MT', label: 'Mountain (GMT-07:00)' },
  { value: 'CT', label: 'Central (GMT-06:00)' },
  { value: 'ET', label: 'Eastern (GMT-05:00)' },
  { value: 'UTC', label: 'UTC (GMT+00:00)' },
]

/** 演练场图标白名单里没有的 heroicons，按原版路径内联。 */
function strokeIcon(d: string): Component {
  return defineComponent({
    render: () => h('svg', {
      'viewBox': '0 0 24 24',
      'fill': 'none',
      'stroke': 'currentColor',
      'stroke-width': 1.5,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
      'style': 'width:100%;height:100%',
    }, [h('path', { d })]),
  })
}
const Bars3BottomLeftIcon = strokeIcon('M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12')
const QuestionMarkCircleIcon = strokeIcon('M9.879 7.519c1.172-1.025 3.071-1.025 4.243 0c1.171 1.025 1.171 2.687 0 3.712q-.308.268-.67.442c-.746.361-1.452.999-1.452 1.827v.75M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0m-9 5.25h.008v.008H12z')

interface Chord {
  mod?: boolean
  shift?: boolean
  alt?: boolean
  key: string
}

interface ShortcutDef {
  id: string
  label: string
  icon: string | Component
  binding: Chord
}

const SHORTCUTS: ShortcutDef[] = [
  { id: 'search', label: 'Search everything', icon: ICONS.magnifyingGlass, binding: { mod: true, key: 'k' } },
  { id: 'new', label: 'New item', icon: ICONS.pencilSquare, binding: { mod: true, key: 'n' } },
  { id: 'save', label: 'Save', icon: ICONS.arrowDownOnSquare, binding: { mod: true, key: 's' } },
  { id: 'settings', label: 'Open settings', icon: ICONS.cog, binding: { mod: true, key: ',' } },
  { id: 'sidebar', label: 'Toggle the sidebar', icon: Bars3BottomLeftIcon, binding: { mod: true, shift: true, key: 'b' } },
  { id: 'help', label: 'Shortcut cheat sheet', icon: QuestionMarkCircleIcon, binding: { shift: true, key: '?' } },
]

/** Kbd 自己不认识的 KeyboardEvent.key 名；「+」是 Kbd 的分隔符，必须转成 plus。 */
const KBD_KEY_NAMES: Record<string, string> = {
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  '+': 'plus',
  ' ': 'space',
}

/** 组合键写成 Kbd 的 keys 字符串，mod 原样交给 Kbd 去按平台解析。 */
function chordKeys(chord: Chord): string {
  const parts: string[] = []
  if (chord.mod)
    parts.push('mod')
  if (chord.shift)
    parts.push('shift')
  if (chord.alt)
    parts.push('alt')
  parts.push(KBD_KEY_NAMES[chord.key] ?? chord.key)
  return parts.join('+')
}

/** 组合键的文字说法，作为键帽背后的可访问名称。 */
function chordLabel(chord: Chord): string {
  const parts: string[] = []
  if (chord.mod)
    parts.push('Mod')
  if (chord.shift)
    parts.push('Shift')
  if (chord.alt)
    parts.push('Alt')
  parts.push(chord.key === ' ' ? 'Space' : chord.key.toUpperCase())
  return parts.join(' + ')
}

/** 放得下 ⌘⇧F 这样的组合键，录入时这一行不跳。 */
const RECORDER_WIDTH = 96

// 覆盖项用稀疏表存：有这个键就是自定义过，false 表示关掉
const shortcutOverrides = ref<Record<string, Chord | false>>({})
const recordingShortcut = ref<string | null>(null)
const hasShortcutOverrides = computed(() => Object.keys(shortcutOverrides.value).length > 0)

function resolveShortcut(def: ShortcutDef): Chord | false {
  return shortcutOverrides.value[def.id] ?? def.binding
}

function setShortcutOverride(id: string, value: Chord | false) {
  shortcutOverrides.value = { ...shortcutOverrides.value, [id]: value }
}

function clearShortcutOverride(id: string) {
  const next = { ...shortcutOverrides.value }
  Reflect.deleteProperty(next, id)
  shortcutOverrides.value = next
}

function toggleShortcut(def: ShortcutDef) {
  if (resolveShortcut(def) !== false)
    setShortcutOverride(def.id, false)
  else
    clearShortcutOverride(def.id)
}

/** 录入框吞掉每次按键，只报告组合键；Escape 取消，单独的修饰键继续等。 */
function onRecorderKeydown(def: ShortcutDef, event: KeyboardEvent) {
  event.preventDefault()
  event.stopPropagation()
  if (event.key === 'Escape') {
    recordingShortcut.value = null
    return
  }
  if (['Control', 'Meta', 'Alt', 'Shift'].includes(event.key))
    return
  setShortcutOverride(def.id, {
    mod: event.metaKey || event.ctrlKey,
    shift: event.shiftKey,
    alt: event.altKey,
    key: event.key,
  })
  recordingShortcut.value = null
}

const SearchIcon = defineComponent({
  render: () => h(Icon, { name: ICONS.magnifyingGlass }),
})
</script>

<template>
  <Center role="main" height="100dvh">
    <Dialog
      is-open
      is-inline
      purpose="form"
      :width="1120"
      max-height="min(800px, calc(100dvh - 2rem))"
      :padding="0"
      class="settings-dialog-frame"
      :aria-labelledby="titleId"
      @open-change="noop"
    >
      <VStack class="settings-dialog-shell" :gap="0">
        <Layout>
          <template v-if="!isNarrow" #start>
            <SideNav aria-label="Settings sections" class="settings-side-nav">
              <template #header>
                <HStack :gap="2" align="center" :padding-inline="2" :min-height="32" width="100%">
                  <Heading :id="titleId" :level="4" :accessibility-level="1">
                    Settings
                  </Heading>
                </HStack>
              </template>
              <template #top>
                <TextInput
                  v-model="searchQuery"
                  label="Search settings"
                  is-label-hidden
                  placeholder="Search settings"
                  size="sm"
                  width="100%"
                  has-clear
                  :start-icon="SearchIcon"
                  @keydown="onSearchKeydown"
                />
              </template>
              <template v-if="isSearchActive">
                <VStack
                  v-if="searchResults.length === 0"
                  id="settings-search-results"
                  :gap="0.5"
                  :padding="2"
                >
                  <Text type="label">
                    No settings found
                  </Text>
                </VStack>
                <VStack v-else id="settings-search-results" :gap="0" is-scrollable>
                  <ListItem
                    v-for="(result, index) in searchResults"
                    :key="result.title"
                    :label="result.title"
                    :description="result.description"
                    :is-selected="index === searchActiveIndex"
                    @mouseenter="searchActiveIndex = index"
                    @click="selectPanel(result.panel)"
                  >
                    <template #startContent>
                      <Icon :name="result.icon" size="sm" color="secondary" />
                    </template>
                  </ListItem>
                </VStack>
              </template>
              <template v-else>
                <SideNavSection
                  v-for="group in PANEL_GROUPS"
                  :key="group.label"
                  :title="group.label"
                  class="settings-side-nav-section"
                >
                  <SideNavItem
                    v-for="panel in group.panels"
                    :key="panel.id"
                    :label="panel.label"
                    :is-selected="panel.id === activePanel"
                    @click="selectPanel(panel.id)"
                  >
                    <template #icon>
                      <Icon :name="panel.icon" size="sm" color="primary" />
                    </template>
                  </SideNavItem>
                </SideNavSection>
              </template>
            </SideNav>
          </template>

          <LayoutContent is-scrollable :padding="4">
            <VStack v-if="isNarrow" :gap="2" class="settings-narrow-header">
              <HStack :gap="2" align="center">
                <StackItem size="fill">
                  <Text :id="titleId" type="label" as="h1">
                    Settings
                  </Text>
                </StackItem>
                <IconButton label="Close" variant="ghost" size="sm" @click="noop">
                  <Icon name="heroicons:x-mark" size="sm" />
                </IconButton>
              </HStack>
              <TextInput
                v-model="searchQuery"
                label="Search settings"
                is-label-hidden
                placeholder="Search settings"
                size="sm"
                width="100%"
                has-clear
                :start-icon="SearchIcon"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="settings-search-results"
                :aria-expanded="isSearchActive && searchResults.length > 0"
                @keydown="onSearchKeydown"
              />
              <VStack
                v-if="isSearchActive && searchResults.length === 0"
                id="settings-search-results"
                :gap="0.5"
                :padding="2"
              >
                <Text type="label">
                  No settings found
                </Text>
                <Text type="supporting" color="secondary">
                  Try theme, notifications, or sessions.
                </Text>
              </VStack>
              <VStack
                v-else-if="isSearchActive"
                id="settings-search-results"
                as="ul"
                role="listbox"
                aria-label="Search results"
                :gap="0"
              >
                <ListItem
                  v-for="(result, index) in searchResults"
                  :key="result.title"
                  role="option"
                  :aria-selected="index === searchActiveIndex"
                  :label="result.title"
                  :description="result.description"
                  :is-selected="index === searchActiveIndex"
                  @mouseenter="searchActiveIndex = index"
                  @click="selectPanel(result.panel)"
                >
                  <template #startContent>
                    <Icon :name="result.icon" size="sm" color="secondary" />
                  </template>
                </ListItem>
              </VStack>
              <HStack
                v-else
                as="nav"
                aria-label="Settings sections"
                :gap="1"
                wrap="nowrap"
                is-scrollable
              >
                <Button
                  v-for="panel in PANELS"
                  :key="panel.id"
                  :label="panel.label"
                  :variant="panel.id === activePanel ? 'secondary' : 'ghost'"
                  size="sm"
                  @click="selectPanel(panel.id)"
                >
                  <template #icon>
                    <Icon :name="panel.icon" size="sm" />
                  </template>
                </Button>
              </HStack>
              <Divider />
            </VStack>

            <HStack v-else width="100%" justify="end" class="settings-close-anchor">
              <HStack class="settings-close-backing">
                <IconButton label="Close" variant="ghost" size="sm" @click="noop">
                  <Icon name="heroicons:x-mark" size="sm" />
                </IconButton>
              </HStack>
            </HStack>

            <VStack :gap="4" class="settings-panel">
              <HStack :gap="2" align="start">
                <StackItem size="fill">
                  <VStack :gap="0.5">
                    <Heading :level="2">
                      {{ panelConfig(activePanel).label }}
                    </Heading>
                    <Text type="supporting" color="secondary">
                      {{ panelConfig(activePanel).description }}
                    </Text>
                  </VStack>
                </StackItem>
                <VStack v-if="!isNarrow" aria-hidden="true" :width="32" />
              </HStack>

              <VStack v-if="activePanel === 'profile'" :gap="5" class="settings-cards">
                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Identity
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.user" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Display name
                            </Text>
                            <Text type="supporting" color="secondary">
                              Shown on your posts, comments, and mentions.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <TextInput
                            v-model="settings.displayName"
                            label="Display name"
                            is-label-hidden
                            size="sm"
                            :width="CONTROL_WIDTH"
                            @update:model-value="v => update('displayName', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.briefcase" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Job title
                            </Text>
                            <Text type="supporting" color="secondary">
                              Appears under your name on your profile card.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <TextInput
                            v-model="settings.jobTitle"
                            label="Job title"
                            is-label-hidden
                            size="sm"
                            :width="CONTROL_WIDTH"
                            @update:model-value="v => update('jobTitle', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.tag" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Pronouns
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Selector
                            :model-value="settings.pronouns"
                            label="Pronouns"
                            is-label-hidden
                            size="sm"
                            :width="CONTROL_WIDTH"
                            :options="PRONOUN_OPTIONS"
                            @update:model-value="v => updateFromSelector('pronouns', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>

                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Availability
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.clock" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Show my local time
                            </Text>
                            <Text type="supporting" color="secondary">
                              Helps people across time zones pick a sane hour.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.showLocalTime"
                            label="Show my local time"
                            is-label-hidden
                            @update:model-value="v => update('showLocalTime', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.signal" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Presence
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Selector
                            :model-value="settings.presence"
                            label="Presence"
                            is-label-hidden
                            size="sm"
                            :width="CONTROL_WIDTH"
                            :options="PRESENCE_OPTIONS"
                            @update:model-value="v => updateFromSelector('presence', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>
              </VStack>

              <VStack v-else-if="activePanel === 'security'" :gap="5" class="settings-cards">
                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Sign-in
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.key" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Password
                            </Text>
                            <Text type="supporting" color="secondary">
                              Last changed 4 months ago.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Change" variant="secondary" size="sm" @click="demo('Demo: changing the password would start here', 'change-password')" />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.shieldCheck" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <HStack :gap="1.5" align="center">
                              <Text type="label">
                                Two-factor authentication
                              </Text>
                              <Token label="Recommended" size="sm" color="green" />
                            </HStack>
                            <Text type="supporting" color="secondary">
                              Ask for a code from your authenticator app at sign-in.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.twoFactor"
                            label="Two-factor authentication"
                            is-label-hidden
                            @update:model-value="v => update('twoFactor', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.fingerPrint" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Passkeys
                            </Text>
                            <Text type="supporting" color="secondary">
                              No passkeys yet.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Add passkey" variant="secondary" size="sm" @click="demo('Demo: adding a passkey would start here', 'add-passkey')" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>

                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Active sessions
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.computerDesktop" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <HStack :gap="1.5" align="center">
                              <Text type="label">
                                MacBook Pro · Chrome
                              </Text>
                              <Token label="This device" size="sm" />
                            </HStack>
                            <Text type="supporting" color="secondary">
                              San Francisco, California · Active now
                            </Text>
                          </div>
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.devicePhone" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              iPhone 15 · Safari
                            </Text>
                            <Text type="supporting" color="secondary">
                              San Francisco, California · 2 hours ago
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Sign out" variant="ghost" size="sm" @click="demo('Demo: iPhone 15 · Safari would be signed out here', 'sign-out-iphone')" />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.computerDesktop" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Windows · Edge
                            </Text>
                            <Text type="supporting" color="secondary">
                              Austin, Texas · March 30 at 19:31
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Sign out" variant="ghost" size="sm" @click="demo('Demo: Windows · Edge would be signed out here', 'sign-out-windows')" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>
              </VStack>

              <VStack v-else-if="activePanel === 'billing'" :gap="5" class="settings-cards">
                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Plan
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.cube" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <HStack :gap="1.5" align="center">
                              <Text type="label">
                                Current plan
                              </Text>
                              <Token label="Team" size="sm" color="blue" />
                            </HStack>
                            <Text type="supporting" color="secondary">
                              $12 per seat, per month. Renews on April 1.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Upgrade" variant="primary" size="sm" @click="demo('Demo: the plan upgrade would start here', 'upgrade')" />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.users" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Seats
                            </Text>
                            <Text type="supporting" color="secondary">
                              18 of 25 seats in use.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Manage seats" variant="secondary" size="sm" @click="demo('Demo: seat management would open here', 'manage-seats')" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>

                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Invoices
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.envelope" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Billing email
                            </Text>
                            <Text type="supporting" color="secondary">
                              Where receipts and payment failures are sent.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <TextInput
                            v-model="settings.billingEmail"
                            label="Billing email"
                            is-label-hidden
                            type="email"
                            size="sm"
                            :width="CONTROL_WIDTH"
                            @update:model-value="v => update('billingEmail', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.receiptPercent" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Email invoices
                            </Text>
                            <Text type="supporting" color="secondary">
                              Send a PDF copy every time we charge the card.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.emailInvoices"
                            label="Email invoices"
                            is-label-hidden
                            @update:model-value="v => update('emailInvoices', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.creditCard" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Payment method
                            </Text>
                            <Text type="supporting" color="secondary">
                              Visa ending 4242 · Expires 09/28
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Update" variant="secondary" size="sm" @click="demo('Demo: updating the payment method would start here', 'update-payment')" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>
              </VStack>

              <VStack v-else-if="activePanel === 'appearance'" :gap="5" class="settings-cards">
                <VStack :gap="1.5">
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.paintBrush" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Color theme
                            </Text>
                            <Text type="supporting" color="secondary">
                              Applies to this browser only.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-detail">
                          <Grid role="radiogroup" aria-label="Color theme" :columns="{ minWidth: 96, max: 3 }" :gap="2" :max-width="480">
                            <SelectableCard
                              v-for="choice in THEME_CHOICES"
                              :key="choice.value"
                              :label="choice.label"
                              :is-selected="settings.theme === choice.value"
                              :padding="2"
                              @update:is-selected="(v: boolean) => { if (v) update('theme', choice.value) }"
                            >
                              <VStack :gap="1.5">
                                <AspectRatio :ratio="3 / 2">
                                  <div class="theme-swatch" :data-theme="choice.value" />
                                </AspectRatio>
                                <HStack :gap="1" align="center" justify="center">
                                  <Icon :name="choice.icon" size="sm" color="secondary" />
                                  <Text type="supporting" :weight="settings.theme === choice.value ? 'semibold' : undefined">
                                    {{ choice.label }}
                                  </Text>
                                </HStack>
                              </VStack>
                            </SelectableCard>
                          </Grid>
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.swatch" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Accent color
                            </Text>
                            <Text type="supporting" color="secondary">
                              Used for links, selection, and primary buttons.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Selector
                            :model-value="settings.accent"
                            label="Accent color"
                            is-label-hidden
                            size="sm"
                            :width="CONTROL_WIDTH"
                            :options="ACCENT_OPTIONS"
                            @update:model-value="v => updateFromSelector('accent', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>

                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Typography
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.documentText" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Interface font
                            </Text>
                            <Text type="supporting" color="secondary">
                              Menus, labels, and message text.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Selector
                            :model-value="settings.font"
                            label="Interface font"
                            is-label-hidden
                            size="sm"
                            :width="CONTROL_WIDTH"
                            :options="INTERFACE_FONTS.map(font => ({ value: font.value, label: font.label }))"
                            @update:model-value="v => updateFromSelector('font', v)"
                          />
                        </div>
                        <div class="settings-row-detail">
                          <Card :padding="3" width="100%">
                            <VStack :gap="1" :style="fontPreviewStyle">
                              <Text type="label">
                                Weekly digest
                              </Text>
                              <Text type="supporting" color="secondary">
                                Eight threads moved while you were away, and three are waiting on you.
                              </Text>
                            </VStack>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>

                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Layout
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.bars3" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Interface density
                            </Text>
                            <Text type="supporting" color="secondary">
                              How much breathing room rows and lists get.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <SegmentedControl
                            v-model="density"
                            label="Interface density"
                            size="sm"
                          >
                            <SegmentedControlItem value="comfortable" label="Comfortable" />
                            <SegmentedControlItem value="compact" label="Compact" />
                          </SegmentedControl>
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.handRaised" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Reduce motion
                            </Text>
                            <Text type="supporting" color="secondary">
                              Skip transitions and animated transforms.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.reduceMotion"
                            label="Reduce motion"
                            is-label-hidden
                            @update:model-value="v => update('reduceMotion', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>
              </VStack>

              <VStack v-else-if="activePanel === 'notifications'" :gap="5" class="settings-cards">
                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Email
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.atSymbol" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Mentions
                            </Text>
                            <Text type="supporting" color="secondary">
                              Someone types your name.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.emailMentions"
                            label="Email me about mentions"
                            is-label-hidden
                            @update:model-value="v => update('emailMentions', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.chatBubble" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Comments
                            </Text>
                            <Text type="supporting" color="secondary">
                              Replies on threads you are part of.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.emailComments"
                            label="Email me about comments"
                            is-label-hidden
                            @update:model-value="v => update('emailComments', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.envelope" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Weekly digest
                            </Text>
                            <Text type="supporting" color="secondary">
                              One summary every Monday morning.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.weeklyDigest"
                            label="Send the weekly digest"
                            is-label-hidden
                            @update:model-value="v => update('weeklyDigest', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>

                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Desktop
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.computerDesktop" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Desktop notifications
                            </Text>
                            <Text type="supporting" color="secondary">
                              Requires permission from your browser.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.desktopAlerts"
                            label="Desktop notifications"
                            is-label-hidden
                            @update:model-value="v => update('desktopAlerts', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.speakerWave" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Play a sound
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.notificationSounds"
                            label="Play a sound"
                            is-label-hidden
                            @update:model-value="v => update('notificationSounds', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.clock" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Quiet hours
                            </Text>
                            <Text type="supporting" color="secondary">
                              Hold notifications and deliver them in the morning.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Selector
                            :model-value="settings.quietHours"
                            label="Quiet hours"
                            is-label-hidden
                            size="sm"
                            :width="CONTROL_WIDTH"
                            :options="QUIET_HOURS_OPTIONS"
                            @update:model-value="v => updateFromSelector('quietHours', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>
              </VStack>

              <VStack v-else-if="activePanel === 'shortcuts'" :gap="1.5" class="settings-cards">
                <Text type="supporting" weight="semibold" color="secondary">
                  Shortcuts
                </Text>
                <Card variant="muted" :padding="0" width="100%">
                  <div role="list">
                    <template v-for="(def, index) in SHORTCUTS" :key="def.id">
                      <Divider v-if="index > 0" variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :icon="def.icon" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              {{ def.label }}
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <HStack :gap="2" align="center">
                            <IconButton
                              v-if="shortcutOverrides[def.id] != null && shortcutOverrides[def.id] !== false"
                              :label="`Reset ${def.label} to its default`"
                              variant="ghost"
                              size="sm"
                              @click="clearShortcutOverride(def.id)"
                            >
                              <Icon :name="ICONS.arrowUturnLeft" size="sm" />
                            </IconButton>
                            <TextInput
                              v-if="recordingShortcut === def.id"
                              label="Type a shortcut"
                              is-label-hidden
                              placeholder="Type it"
                              size="sm"
                              :width="RECORDER_WIDTH"
                              model-value=""
                              has-auto-focus
                              @keydown="onRecorderKeydown(def, $event)"
                              @focusout="recordingShortcut = null"
                            />
                            <!-- Kbd 作为子节点，label 保持文字：有子节点时 label 变成 aria-label -->
                            <Button
                              v-else
                              :label="resolveShortcut(def) !== false ? chordLabel(resolveShortcut(def) as Chord) : 'No shortcut'"
                              variant="ghost"
                              size="sm"
                              :is-disabled="resolveShortcut(def) === false"
                              :tooltip="resolveShortcut(def) !== false ? 'Click to change' : 'Switch it on to rebind it'"
                              @click="recordingShortcut = def.id"
                            >
                              <Kbd v-if="resolveShortcut(def) !== false" :keys="chordKeys(resolveShortcut(def) as Chord)" />
                            </Button>
                            <Tooltip :content="resolveShortcut(def) !== false ? 'Disable' : 'Enable'">
                              <Switch
                                :model-value="resolveShortcut(def) !== false"
                                :label="`${def.label} shortcut`"
                                is-label-hidden
                                size="sm"
                                @update:model-value="toggleShortcut(def)"
                              />
                            </Tooltip>
                          </HStack>
                        </div>
                      </div>
                    </template>
                    <template v-if="hasShortcutOverrides">
                      <Divider variant="subtle" role="presentation" />
                      <!-- 整组的操作单独占一行，跟其他行一样带分隔线 -->
                      <div class="settings-row" role="listitem">
                        <HStack>
                          <Button label="Reset all to defaults" variant="ghost" size="sm" @click="shortcutOverrides = {}">
                            <template #icon>
                              <Icon :name="ICONS.arrowUturnLeft" size="sm" />
                            </template>
                          </Button>
                        </HStack>
                      </div>
                    </template>
                  </div>
                </Card>
              </VStack>

              <VStack v-else-if="activePanel === 'language'" :gap="1.5" class="settings-cards">
                <Text type="supporting" weight="semibold" color="secondary">
                  Language & region
                </Text>
                <Card variant="muted" :padding="0" width="100%">
                  <div role="list">
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :name="ICONS.language" size="sm" color="secondary" /></span>
                        <div class="settings-row-text">
                          <Text type="label">
                            Language
                          </Text>
                          <Text type="supporting" color="secondary">
                            Used across menus, buttons, and email.
                          </Text>
                        </div>
                      </div>
                      <div class="settings-row-control">
                        <Selector
                          :model-value="settings.language"
                          label="Language"
                          is-label-hidden
                          size="sm"
                          :width="CONTROL_WIDTH"
                          :options="LANGUAGE_OPTIONS"
                          @update:model-value="v => updateFromSelector('language', v)"
                        />
                      </div>
                    </div>
                    <Divider variant="subtle" role="presentation" />
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :name="ICONS.mapPin" size="sm" color="secondary" /></span>
                        <div class="settings-row-text">
                          <Text type="label">
                            Region format
                          </Text>
                          <Text type="supporting" color="secondary">
                            Dates, numbers, and currency.
                          </Text>
                        </div>
                      </div>
                      <div class="settings-row-control">
                        <Selector
                          :model-value="settings.region"
                          label="Region format"
                          is-label-hidden
                          size="sm"
                          :width="CONTROL_WIDTH"
                          :options="REGION_OPTIONS"
                          @update:model-value="v => updateFromSelector('region', v)"
                        />
                      </div>
                    </div>
                    <Divider variant="subtle" role="presentation" />
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :name="ICONS.globeAlt" size="sm" color="secondary" /></span>
                        <div class="settings-row-text">
                          <Text type="label">
                            Time zone
                          </Text>
                          <Text type="supporting" color="secondary">
                            Used for scheduling and every timestamp you see.
                          </Text>
                        </div>
                      </div>
                      <div class="settings-row-control">
                        <Selector
                          :model-value="settings.timezone"
                          label="Time zone"
                          is-label-hidden
                          size="sm"
                          :width="CONTROL_WIDTH"
                          :options="TIMEZONE_OPTIONS"
                          @update:model-value="v => updateFromSelector('timezone', v)"
                        />
                      </div>
                    </div>
                    <Divider variant="subtle" role="presentation" />
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :name="ICONS.calendarDays" size="sm" color="secondary" /></span>
                        <div class="settings-row-text">
                          <Text type="label">
                            Start the week on
                          </Text>
                        </div>
                      </div>
                      <div class="settings-row-control">
                        <SegmentedControl
                          v-model="weekStart"
                          label="Start the week on"
                          size="sm"
                        >
                          <SegmentedControlItem value="sun" label="Sunday" />
                          <SegmentedControlItem value="mon" label="Monday" />
                        </SegmentedControl>
                      </div>
                    </div>
                  </div>
                </Card>
              </VStack>

              <VStack v-else-if="activePanel === 'privacy'" :gap="5" class="settings-cards">
                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Visibility
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.magnifyingGlass" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Discoverable by email
                            </Text>
                            <Text type="supporting" color="secondary">
                              Let people find your profile by searching your address.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.discoverable"
                            label="Discoverable by email"
                            is-label-hidden
                            @update:model-value="v => update('discoverable', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.eye" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Read receipts
                            </Text>
                            <Text type="supporting" color="secondary">
                              Show people when you have read their message.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.readReceipts"
                            label="Read receipts"
                            is-label-hidden
                            @update:model-value="v => update('readReceipts', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.signal" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Activity status
                            </Text>
                            <Text type="supporting" color="secondary">
                              Show a green dot while you are online.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.activityStatus"
                            label="Activity status"
                            is-label-hidden
                            @update:model-value="v => update('activityStatus', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>

                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Your data
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.sparkles" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Personalized suggestions
                            </Text>
                            <Text type="supporting" color="secondary">
                              Use your activity to rank what you see first.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.personalization"
                            label="Personalized suggestions"
                            is-label-hidden
                            @update:model-value="v => update('personalization', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.arrowDownTray" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Export my data
                            </Text>
                            <Text type="supporting" color="secondary">
                              We will email a download link within 24 hours.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Request export" variant="secondary" size="sm" @click="demo('Demo: a data export request would be sent here', 'request-export')" />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.trash" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Delete my account
                            </Text>
                            <Text type="supporting" color="secondary">
                              Permanent, and it takes the workspace with it.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Button label="Delete" variant="destructive" size="sm" @click="confirmDeleteAccount" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>
                <ConfirmHost />
              </VStack>

              <VStack v-else-if="activePanel === 'integrations'" :gap="1.5" class="settings-cards">
                <Text type="supporting" weight="semibold" color="secondary">
                  Connected apps
                </Text>
                <Card variant="muted" :padding="0" width="100%">
                  <div role="list">
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :name="ICONS.calendarDays" size="sm" color="secondary" /></span>
                        <div class="settings-row-text">
                          <Text type="label">
                            Calendar
                          </Text>
                          <Text type="supporting" color="secondary">
                            Connected as alex@example.com
                          </Text>
                        </div>
                      </div>
                      <div class="settings-row-control">
                        <Button label="Disconnect" variant="ghost" size="sm" @click="demo('Demo: Calendar would be disconnected here', 'disconnect-calendar')" />
                      </div>
                    </div>
                    <Divider variant="subtle" role="presentation" />
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :name="ICONS.folder" size="sm" color="secondary" /></span>
                        <div class="settings-row-text">
                          <Text type="label">
                            File storage
                          </Text>
                          <Text type="supporting" color="secondary">
                            Attach files straight from your drive.
                          </Text>
                        </div>
                      </div>
                      <div class="settings-row-control">
                        <Button label="Connect" variant="secondary" size="sm" @click="demo('Demo: File storage would be connected here', 'connect-file-storage')" />
                      </div>
                    </div>
                    <Divider variant="subtle" role="presentation" />
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :name="ICONS.chatBubble" size="sm" color="secondary" /></span>
                        <div class="settings-row-text">
                          <Text type="label">
                            Chat
                          </Text>
                          <Text type="supporting" color="secondary">
                            Post updates to a channel when work ships.
                          </Text>
                        </div>
                      </div>
                      <div class="settings-row-control">
                        <Button label="Connect" variant="secondary" size="sm" @click="demo('Demo: Chat would be connected here', 'connect-chat')" />
                      </div>
                    </div>
                  </div>
                </Card>
              </VStack>

              <VStack v-else :gap="5" class="settings-cards">
                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    API
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.codeBracket" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              API access
                            </Text>
                            <Text type="supporting" color="secondary">
                              Issue tokens that act on your behalf.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.apiAccess"
                            label="API access"
                            is-label-hidden
                            @update:model-value="v => update('apiAccess', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.link" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Webhook URL
                            </Text>
                            <Text type="supporting" color="secondary">
                              We POST an event here whenever something changes.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <TextInput
                            v-model="settings.webhookUrl"
                            label="Webhook URL"
                            is-label-hidden
                            size="sm"
                            :width="CONTROL_WIDTH"
                            placeholder="https://example.com/hooks"
                            :is-disabled="!settings.apiAccess"
                            @update:model-value="(v: string) => update('webhookUrl', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>

                <VStack :gap="1.5">
                  <Text type="supporting" weight="semibold" color="secondary">
                    Pre-release
                  </Text>
                  <Card variant="muted" :padding="0" width="100%">
                    <div role="list">
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.beaker" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <HStack :gap="1.5" align="center">
                              <Text type="label">
                                Early access features
                              </Text>
                              <Token label="Beta" size="sm" color="purple" />
                            </HStack>
                            <Text type="supporting" color="secondary">
                              Unfinished work, turned on for your account only.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.earlyAccess"
                            label="Early access features"
                            is-label-hidden
                            @update:model-value="v => update('earlyAccess', v)"
                          />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :name="ICONS.documentMagnifyingGlass" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              Verbose logging
                            </Text>
                            <Text type="supporting" color="secondary">
                              Write a detailed trace to the browser console.
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <Switch
                            :model-value="settings.verboseLogging"
                            label="Verbose logging"
                            is-label-hidden
                            @update:model-value="v => update('verboseLogging', v)"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>
              </VStack>
            </VStack>
          </LayoutContent>
        </Layout>
      </VStack>
    </Dialog>
  </Center>
</template>

<style>
/* 待 core 修复后去掉：原版 Dialog 的最大宽度是 min(100%, 100dvw - 2 × 16px)，两侧各留 16px。 */
.settings-dialog-frame {
  max-width: min(100%, calc(100dvw - 2rem));
}
.settings-dialog-shell {
  height: min(800px, calc(100dvh - 2rem));
}
.settings-side-nav {
  flex-shrink: 0;
}
/* 待 core 修复后去掉：SideNav 的内容区在分组之间多了 4px 间距、底部内边距 4px（原版无间距、底部 8px）。 */
.settings-side-nav .astryx-side-nav__body {
  gap: 0;
  padding-block-end: var(--astryx-spacing-2);
}
/* 待 core 修复后去掉：Switch 的行是 inline-flex，外层多出行高基线空隙（28 对 24），开关被顶高 2px。 */
.settings-row-control .astryx-switch-row {
  display: flex;
}
.settings-side-nav-section {
  /* 待 core 修复后去掉 gap：SideNavSection 在标题和条目之间多了 2px 间距，原版没有。 */
  gap: 0;
  padding-block: var(--astryx-spacing-2);
}
.settings-close-anchor {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  height: 0;
}
.settings-close-backing {
  display: flex;
  background-color: var(--astryx-color-background-surface);
  border-radius: var(--astryx-radius-element);
}
.settings-narrow-header {
  padding-block-end: var(--astryx-spacing-3);
}
/* The column every row measures itself against: rows stack on the width the
   panel actually got, not on the viewport's. */
.settings-panel {
  container-type: inline-size;
  container-name: settings-panel;
}
/* One row: name and explanation beside the control, the control's own width
   held open, and any extra content spanning the row underneath. */
.settings-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: var(--astryx-spacing-3);
  row-gap: var(--astryx-spacing-2);
  padding: var(--astryx-spacing-4);
}
.settings-row-main {
  display: flex;
  align-items: flex-start;
  gap: var(--astryx-spacing-2);
  min-width: 0;
}
/* The icon box aligns to the title's box; a hair of top padding makes it read
   level with the cap height beside it. */
.settings-row-icon {
  display: inline-flex;
  padding-block-start: var(--astryx-spacing-0-5);
}
.settings-row-text {
  display: flex;
  flex-direction: column;
  gap: var(--astryx-spacing-0-5);
  max-width: 420px;
}
.settings-row-control {
  display: flex;
  flex-shrink: 0;
}
.settings-row-detail {
  grid-column: 1 / -1;
}
@container settings-panel (max-width: 480px) {
  .settings-row {
    grid-template-columns: minmax(0, 1fr);
    align-items: stretch;
    gap: var(--astryx-spacing-2);
  }
  .settings-row-text {
    max-width: none;
  }
}
.theme-swatch {
  width: 100%;
  height: 100%;
  background: var(--astryx-color-background-muted);
  border-radius: var(--astryx-radius-element);
}
.theme-swatch[data-theme='dark'] {
  background: #1a1a1a;
}
.theme-swatch[data-theme='system'] {
  background: linear-gradient(90deg, var(--astryx-color-background-muted) 50%, #1a1a1a 50%);
}
</style>
