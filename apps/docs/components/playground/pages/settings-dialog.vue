<script setup lang="ts">
import type { Component } from 'vue'
import { computed, defineComponent, h, ref, watch } from 'vue'
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
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'

/** Below this the dialog swaps its rail for a strip of tabs. */
const NARROW_VIEWPORT = '(max-width: 640px)'

/** Floor for every control that sits in a row's right column. */
const CONTROL_WIDTH = 192

const noop = () => {}

type PanelId =
  | 'profile'
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
  user: 'i-heroicons-user',
  userCircle: 'i-heroicons-user-circle',
  briefcase: 'i-heroicons-briefcase',
  tag: 'i-heroicons-tag',
  clock: 'i-heroicons-clock',
  signal: 'i-heroicons-signal',
  key: 'i-heroicons-key',
  lockClosed: 'i-heroicons-lock-closed',
  shieldCheck: 'i-heroicons-shield-check',
  fingerPrint: 'i-heroicons-finger-print',
  computerDesktop: 'i-heroicons-computer-desktop',
  devicePhone: 'i-heroicons-device-phone-mobile',
  cube: 'i-heroicons-cube',
  users: 'i-heroicons-users',
  envelope: 'i-heroicons-envelope',
  receiptPercent: 'i-heroicons-receipt-percent',
  creditCard: 'i-heroicons-credit-card',
  paintBrush: 'i-heroicons-paint-brush',
  swatch: 'i-heroicons-swatch',
  documentText: 'i-heroicons-document-text',
  bars3: 'i-heroicons-bars-3',
  handRaised: 'i-heroicons-hand-raised',
  atSymbol: 'i-heroicons-at-symbol',
  chatBubble: 'i-heroicons-chat-bubble-left-right',
  speakerWave: 'i-heroicons-speaker-wave',
  commandLine: 'i-heroicons-command-line',
  language: 'i-heroicons-language',
  mapPin: 'i-heroicons-map-pin',
  globeAlt: 'i-heroicons-globe-alt',
  calendarDays: 'i-heroicons-calendar-days',
  magnifyingGlass: 'i-heroicons-magnifying-glass',
  eye: 'i-heroicons-eye',
  sparkles: 'i-heroicons-sparkles',
  arrowDownTray: 'i-heroicons-arrow-down-tray',
  trash: 'i-heroicons-trash',
  folder: 'i-heroicons-folder',
  codeBracket: 'i-heroicons-code-bracket',
  link: 'i-heroicons-link',
  beaker: 'i-heroicons-beaker',
  documentMagnifyingGlass: 'i-heroicons-document-magnifying-glass',
  pencilSquare: 'i-heroicons-pencil-square',
  arrowDownOnSquare: 'i-heroicons-arrow-down-on-square',
  cog: 'i-heroicons-cog-6-tooth',
  puzzlePiece: 'i-heroicons-puzzle-piece',
  bell: 'i-heroicons-bell',
  sun: 'i-heroicons-sun',
  moon: 'i-heroicons-moon',
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

const SHORTCUTS = [
  { id: 'search', label: 'Search everything', keys: 'mod+k', icon: ICONS.magnifyingGlass },
  { id: 'new', label: 'New item', keys: 'mod+n', icon: ICONS.pencilSquare },
  { id: 'save', label: 'Save', keys: 'mod+s', icon: ICONS.arrowDownOnSquare },
  { id: 'settings', label: 'Open settings', keys: 'mod+,', icon: ICONS.cog },
]

const shortcutEnabled = ref<Record<string, boolean>>({
  search: true,
  new: true,
  save: true,
  settings: true,
})

function iconComponent(className: string): Component {
  return defineComponent({
    render: () => h('span', { class: className, 'aria-hidden': 'true', style: 'width:1em;height:1em' }),
  })
}

const SearchIcon = iconComponent(ICONS.magnifyingGlass)
</script>

<template>
  <Center height="100dvh">
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
                  <Heading :level="4" :id="titleId">
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
                      <Icon :icon="result.icon" size="sm" color="secondary" />
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
                      <Icon :icon="panel.icon" size="sm" color="primary" />
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
                  <Text type="label" :id="titleId">
                    Settings
                  </Text>
                </StackItem>
                <IconButton label="Close" variant="ghost" size="sm" @click="noop">
                  <template #icon>
                    <Icon icon="close" size="sm" />
                  </template>
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
                    <Icon :icon="result.icon" size="sm" color="secondary" />
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
                    <Icon :icon="panel.icon" size="sm" />
                  </template>
                </Button>
              </HStack>
              <Divider />
            </VStack>

            <HStack v-else width="100%" justify="end" class="settings-close-anchor">
              <HStack class="settings-close-backing">
                <IconButton label="Close" variant="ghost" size="sm" @click="noop">
                  <template #icon>
                    <Icon icon="close" size="sm" />
                  </template>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.user" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.briefcase" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.tag" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.clock" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.signal" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.key" size="sm" color="secondary" /></span>
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
                          <Button label="Change" variant="secondary" size="sm" />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :icon="ICONS.shieldCheck" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.fingerPrint" size="sm" color="secondary" /></span>
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
                          <Button label="Add passkey" variant="secondary" size="sm" />
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.computerDesktop" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.devicePhone" size="sm" color="secondary" /></span>
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
                          <Button label="Sign out" variant="ghost" size="sm" />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :icon="ICONS.computerDesktop" size="sm" color="secondary" /></span>
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
                          <Button label="Sign out" variant="ghost" size="sm" />
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.cube" size="sm" color="secondary" /></span>
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
                          <Button label="Upgrade" variant="primary" size="sm" />
                        </div>
                      </div>
                      <Divider variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :icon="ICONS.users" size="sm" color="secondary" /></span>
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
                          <Button label="Manage seats" variant="secondary" size="sm" />
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.envelope" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.receiptPercent" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.creditCard" size="sm" color="secondary" /></span>
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
                          <Button label="Update" variant="secondary" size="sm" />
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.paintBrush" size="sm" color="secondary" /></span>
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
                                  <Icon :icon="choice.icon" size="sm" color="secondary" />
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.swatch" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.documentText" size="sm" color="secondary" /></span>
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
                          <div class="font-preview" :style="fontPreviewStyle">
                            <Text type="body">
                              The quick brown fox jumps over the lazy dog.
                            </Text>
                            <Text type="supporting" color="secondary">
                              Settings inherit this face wherever the theme allows.
                            </Text>
                          </div>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.bars3" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.handRaised" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.atSymbol" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.chatBubble" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.envelope" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.computerDesktop" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.speakerWave" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.clock" size="sm" color="secondary" /></span>
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
                    <template v-for="(shortcut, index) in SHORTCUTS" :key="shortcut.id">
                      <Divider v-if="index > 0" variant="subtle" role="presentation" />
                      <div class="settings-row" role="listitem">
                        <div class="settings-row-main">
                          <span class="settings-row-icon"><Icon :icon="shortcut.icon" size="sm" color="secondary" /></span>
                          <div class="settings-row-text">
                            <Text type="label">
                              {{ shortcut.label }}
                            </Text>
                          </div>
                        </div>
                        <div class="settings-row-control">
                          <HStack :gap="2" align="center">
                            <Button variant="ghost" size="sm" :label="shortcut.keys">
                              <Kbd :keys="shortcut.keys" />
                            </Button>
                            <Switch
                              :model-value="shortcutEnabled[shortcut.id]"
                              :label="`${shortcut.label} shortcut`"
                              is-label-hidden
                              size="sm"
                              @update:model-value="v => { shortcutEnabled[shortcut.id] = v }"
                            />
                          </HStack>
                        </div>
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
                        <span class="settings-row-icon"><Icon :icon="ICONS.language" size="sm" color="secondary" /></span>
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
                        <span class="settings-row-icon"><Icon :icon="ICONS.mapPin" size="sm" color="secondary" /></span>
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
                        <span class="settings-row-icon"><Icon :icon="ICONS.globeAlt" size="sm" color="secondary" /></span>
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
                        <span class="settings-row-icon"><Icon :icon="ICONS.calendarDays" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.magnifyingGlass" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.eye" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.signal" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.sparkles" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.arrowDownTray" size="sm" color="secondary" /></span>
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
                          <Button label="Request export" variant="secondary" size="sm" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </VStack>
              </VStack>

              <VStack v-else-if="activePanel === 'integrations'" :gap="1.5" class="settings-cards">
                <Text type="supporting" weight="semibold" color="secondary">
                  Connected apps
                </Text>
                <Card variant="muted" :padding="0" width="100%">
                  <div role="list">
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :icon="ICONS.calendarDays" size="sm" color="secondary" /></span>
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
                        <Button label="Disconnect" variant="ghost" size="sm" />
                      </div>
                    </div>
                    <Divider variant="subtle" role="presentation" />
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :icon="ICONS.folder" size="sm" color="secondary" /></span>
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
                        <Button label="Connect" variant="secondary" size="sm" />
                      </div>
                    </div>
                    <Divider variant="subtle" role="presentation" />
                    <div class="settings-row" role="listitem">
                      <div class="settings-row-main">
                        <span class="settings-row-icon"><Icon :icon="ICONS.chatBubble" size="sm" color="secondary" /></span>
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
                        <Button label="Connect" variant="secondary" size="sm" />
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.codeBracket" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.link" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.beaker" size="sm" color="secondary" /></span>
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
                          <span class="settings-row-icon"><Icon :icon="ICONS.documentMagnifyingGlass" size="sm" color="secondary" /></span>
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
/* 待 core 修复后去掉：小号 Selector 的内边距原版是 3px 12px，我们是 4px 8px。 */
.settings-row-control .astryx-selector.size-sm .astryx-selector-field {
  padding: 3px 12px;
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
  gap: var(--astryx-spacing-3);
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
.font-preview {
  display: flex;
  flex-direction: column;
  gap: var(--astryx-spacing-1);
  padding: var(--astryx-spacing-3);
  background-color: var(--astryx-color-background-surface);
  border-radius: var(--astryx-radius-element);
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
