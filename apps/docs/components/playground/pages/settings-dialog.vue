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

const NARROW_VIEWPORT = '(max-width: 640px)'
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

const PANEL_GROUPS: { label: string, panels: PanelConfig[] }[] = [
  {
    label: 'Account',
    panels: [
      { id: 'profile', label: 'Profile', description: 'How you appear to everyone else in the workspace.', icon: 'i-heroicons-user-circle' },
      { id: 'security', label: 'Login & security', description: 'Sign-in methods and the devices signed in right now.', icon: 'i-heroicons-lock-closed' },
      { id: 'billing', label: 'Billing', description: 'Your plan, seats, and where invoices are sent.', icon: 'i-heroicons-credit-card' },
    ],
  },
  {
    label: 'Workspace',
    panels: [
      { id: 'appearance', label: 'Appearance', description: 'Theme and density for this browser.', icon: 'i-heroicons-paint-brush' },
      { id: 'notifications', label: 'Notifications', description: 'What reaches you, and where it arrives.', icon: 'i-heroicons-bell' },
      { id: 'shortcuts', label: 'Keyboard shortcuts', description: 'Rebind or switch off any shortcut on this surface.', icon: 'i-heroicons-command-line' },
      { id: 'language', label: 'Language & region', description: 'Language, formats, and time zone.', icon: 'i-heroicons-globe-alt' },
    ],
  },
  {
    label: 'Advanced',
    panels: [
      { id: 'privacy', label: 'Privacy', description: 'What you share, and what we keep.', icon: 'i-heroicons-shield-check' },
      { id: 'integrations', label: 'Connected apps', description: 'Services with access to this workspace.', icon: 'i-heroicons-puzzle-piece' },
      { id: 'developer', label: 'Developer', description: 'API access and pre-release features.', icon: 'i-heroicons-code-bracket' },
    ],
  },
]

const PANELS = PANEL_GROUPS.flatMap(g => g.panels)

function panelConfig(id: PanelId) {
  return PANELS.find(p => p.id === id) ?? PANELS[0]
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

// SegmentedControl 的 update:modelValue 事件参数在我们的类型里是 unknown，用可写
// computed 走 v-model，让 defineModel 那侧的 string 类型生效。
const density = computed({
  get: () => settings.value.density,
  set: (value: string) => update('density', value),
})

const activePanel = ref<PanelId>('profile')
const titleId = 'settings-dialog-title'
const isNarrow = useMediaQuery(NARROW_VIEWPORT)
const searchQuery = ref('')
const searchActiveIndex = ref(0)

const SEARCHABLE_SETTINGS = [
  { title: 'Display name', description: 'The name shown on your posts and comments', panel: 'profile' as PanelId, icon: 'i-heroicons-user-circle' },
  { title: 'Two-factor authentication', description: 'Require a second step when signing in', panel: 'security' as PanelId, icon: 'i-heroicons-key' },
  { title: 'Color theme', description: 'Light, dark, or follow the system', panel: 'appearance' as PanelId, icon: 'i-heroicons-paint-brush' },
  { title: 'Email notifications', description: 'Mentions, comments, and the weekly digest', panel: 'notifications' as PanelId, icon: 'i-heroicons-envelope' },
  { title: 'Keyboard shortcuts', description: 'Rebind a shortcut, or switch one off', panel: 'shortcuts' as PanelId, icon: 'i-heroicons-command-line' },
  { title: 'Time zone', description: 'Used for scheduling and timestamps', panel: 'language' as PanelId, icon: 'i-heroicons-globe-alt' },
  { title: 'Read receipts', description: 'Let people see when you have read a message', panel: 'privacy' as PanelId, icon: 'i-heroicons-shield-check' },
  { title: 'API access', description: 'Personal access tokens and webhooks', panel: 'developer' as PanelId, icon: 'i-heroicons-code-bracket' },
]

const normalizedSearch = computed(() => searchQuery.value.trim().toLowerCase())
const isSearchActive = computed(() => normalizedSearch.value.length > 0)
const searchResults = computed(() => {
  if (!isSearchActive.value)
    return []
  const q = normalizedSearch.value
  return SEARCHABLE_SETTINGS.filter(s =>
    s.title.toLowerCase().includes(q)
    || s.description.toLowerCase().includes(q)
    || panelConfig(s.panel).label.toLowerCase().includes(q),
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
  { value: 'light', label: 'Light', icon: 'i-heroicons-sun' },
  { value: 'dark', label: 'Dark', icon: 'i-heroicons-moon' },
  { value: 'system', label: 'System', icon: 'i-heroicons-computer-desktop' },
]

const SHORTCUTS = [
  { id: 'search', label: 'Search everything', keys: 'mod+k', icon: 'i-heroicons-magnifying-glass' },
  { id: 'new', label: 'New item', keys: 'mod+n', icon: 'i-heroicons-pencil-square' },
  { id: 'save', label: 'Save', keys: 'mod+s', icon: 'i-heroicons-arrow-down-on-square' },
  { id: 'settings', label: 'Open settings', keys: 'mod+,', icon: 'i-heroicons-cog-6-tooth' },
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

const SearchIcon = iconComponent('i-heroicons-magnifying-glass')
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
      :aria-labelledby="titleId"
      @open-change="noop"
    >
      <VStack class="settings-dialog-shell" :gap="0">
        <template v-if="isNarrow">
          <VStack :gap="0" height="100%">
            <HStack :gap="2" align="center" :padding-inline="3" :padding-block="3">
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
            <Divider />
            <VStack :padding-inline="3" :padding-block="2">
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
            </VStack>
            <VStack v-if="isSearchActive" :padding-inline="3" is-scrollable>
              <VStack
                v-if="searchResults.length === 0"
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
                v-else
                id="settings-search-results"
                as="ul"
                role="listbox"
                aria-label="Search results"
                :gap="0"
                is-scrollable
              >
                <ListItem
                  v-for="(setting, index) in searchResults"
                  :key="`${setting.panel}-${setting.title}`"
                  :id="`settings-search-result-${index}`"
                  role="option"
                  :aria-selected="index === searchActiveIndex"
                  :label="setting.title"
                  :description="`${panelConfig(setting.panel).label} · ${setting.description}`"
                  :is-selected="index === searchActiveIndex"
                  @mouseenter="searchActiveIndex = index"
                  @click="selectPanel(setting.panel)"
                >
                  <template #startContent>
                    <Icon :icon="setting.icon" size="sm" color="secondary" />
                  </template>
                  <template #endContent>
                    <Icon icon="i-heroicons-chevron-right" size="sm" color="secondary" />
                  </template>
                </ListItem>
              </VStack>
            </VStack>
            <template v-else>
              <HStack
                as="nav"
                aria-label="Settings sections"
                :gap="1"
                wrap="nowrap"
                is-scrollable
                :padding-inline="3"
                :padding-block="2"
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
              <VStack
                :gap="4"
                :padding="4"
                is-scrollable
                height="100%"
                class="settings-panel"
              >
                <VStack :gap="0.5">
                  <Heading :level="2">
                    {{ panelConfig(activePanel).label }}
                  </Heading>
                  <Text type="supporting" color="secondary">
                    {{ panelConfig(activePanel).description }}
                  </Text>
                </VStack>
                <VStack v-if="activePanel === 'profile'" :gap="5">
                  <Card variant="muted" :padding="0" width="100%">
                    <div class="settings-row">
                      <VStack :gap="0">
                        <Text type="label">
                          Display name
                        </Text>
                        <Text type="supporting" color="secondary">
                          Shown on your posts, comments, and mentions.
                        </Text>
                      </VStack>
                      <TextInput
                        v-model="settings.displayName"
                        label="Display name"
                        is-label-hidden
                        size="sm"
                        :width="CONTROL_WIDTH"
                        @update:model-value="v => update('displayName', v)"
                      />
                    </div>
                    <Divider variant="subtle" />
                    <div class="settings-row">
                      <VStack :gap="0">
                        <Text type="label">
                          Two-factor authentication
                        </Text>
                      </VStack>
                      <Switch
                        :model-value="settings.twoFactor"
                        label="Two-factor authentication"
                        is-label-hidden
                        @update:model-value="v => update('twoFactor', v)"
                      />
                    </div>
                  </Card>
                </VStack>
                <VStack v-else-if="activePanel === 'appearance'" :gap="5">
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
                  <div class="settings-row">
                    <Text type="label">
                      Interface density
                    </Text>
                    <SegmentedControl
                      v-model="density"
                      label="Interface density"
                      size="sm"
                    >
                      <SegmentedControlItem value="comfortable" label="Comfortable" />
                      <SegmentedControlItem value="compact" label="Compact" />
                    </SegmentedControl>
                  </div>
                </VStack>
                <VStack v-else-if="activePanel === 'shortcuts'" :gap="0">
                  <Card variant="muted" :padding="0" width="100%">
                    <div
                      v-for="shortcut in SHORTCUTS"
                      :key="shortcut.id"
                      class="settings-row"
                    >
                      <HStack :gap="2" align="start">
                        <Icon :icon="shortcut.icon" size="sm" color="secondary" />
                        <Text type="label">
                          {{ shortcut.label }}
                        </Text>
                      </HStack>
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
                  </Card>
                </VStack>
                <VStack v-else :gap="4">
                  <Text type="body" color="secondary">
                    Adjust preferences for {{ panelConfig(activePanel).label.toLowerCase() }}.
                  </Text>
                  <TextInput
                    v-if="activePanel === 'billing'"
                    v-model="settings.billingEmail"
                    label="Billing email"
                    type="email"
                    size="sm"
                    :width="CONTROL_WIDTH"
                    @update:model-value="v => update('billingEmail', v)"
                  />
                  <Switch
                    v-if="activePanel === 'notifications'"
                    :model-value="settings.emailMentions"
                    label="Email me about mentions"
                    @update:model-value="v => update('emailMentions', v)"
                  />
                  <Switch
                    v-if="activePanel === 'privacy'"
                    :model-value="settings.readReceipts"
                    label="Read receipts"
                    @update:model-value="v => update('readReceipts', v)"
                  />
                  <Switch
                    v-if="activePanel === 'developer'"
                    :model-value="settings.apiAccess"
                    label="API access"
                    @update:model-value="v => update('apiAccess', v)"
                  />
                </VStack>
              </VStack>
            </template>
          </VStack>
        </template>
        <Layout v-else>
          <template #start>
            <SideNav aria-label="Settings sections" class="settings-side-nav">
              <template #header>
                <HStack :gap="2" align="center" :padding-inline="2" :min-height="32">
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
                    v-for="(setting, index) in searchResults"
                    :key="setting.title"
                    :label="setting.title"
                    :description="setting.description"
                    :is-selected="index === searchActiveIndex"
                    @click="selectPanel(setting.panel)"
                  />
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
            <HStack width="100%" justify="end" class="settings-close-anchor">
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
                  <Heading :level="2">
                    {{ panelConfig(activePanel).label }}
                  </Heading>
                  <Text type="supporting" color="secondary">
                    {{ panelConfig(activePanel).description }}
                  </Text>
                </StackItem>
                <VStack aria-hidden="true" :width="32" />
              </HStack>
              <VStack v-if="activePanel === 'profile'" :gap="5">
                <Card variant="muted" :padding="0" width="100%">
                  <div class="settings-row">
                    <VStack :gap="0">
                      <Text type="label">
                        Display name
                      </Text>
                      <Text type="supporting" color="secondary">
                        Shown on your posts, comments, and mentions.
                      </Text>
                    </VStack>
                    <TextInput
                      v-model="settings.displayName"
                      label="Display name"
                      is-label-hidden
                      size="sm"
                      :width="CONTROL_WIDTH"
                      @update:model-value="v => update('displayName', v)"
                    />
                  </div>
                  <Divider variant="subtle" />
                  <div class="settings-row">
                    <VStack :gap="0">
                      <Text type="label">
                        Job title
                      </Text>
                    </VStack>
                    <TextInput
                      v-model="settings.jobTitle"
                      label="Job title"
                      is-label-hidden
                      size="sm"
                      :width="CONTROL_WIDTH"
                      @update:model-value="v => update('jobTitle', v)"
                    />
                  </div>
                </Card>
              </VStack>
              <VStack v-else-if="activePanel === 'security'" :gap="5">
                <Card variant="muted" :padding="0" width="100%">
                  <div class="settings-row">
                    <HStack :gap="1.5" align="center">
                      <Text type="label">
                        Two-factor authentication
                      </Text>
                      <Token label="Recommended" size="sm" color="green" />
                    </HStack>
                    <Switch
                      :model-value="settings.twoFactor"
                      label="Two-factor authentication"
                      is-label-hidden
                      @update:model-value="v => update('twoFactor', v)"
                    />
                  </div>
                  <Divider variant="subtle" />
                  <div class="settings-row">
                    <Text type="label">
                      Password
                    </Text>
                    <Button label="Change" variant="secondary" size="sm" />
                  </div>
                </Card>
              </VStack>
              <VStack v-else-if="activePanel === 'appearance'" :gap="5">
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
              </VStack>
              <VStack v-else-if="activePanel === 'shortcuts'" :gap="0">
                <Card variant="muted" :padding="0" width="100%">
                  <div
                    v-for="shortcut in SHORTCUTS"
                    :key="shortcut.id"
                    class="settings-row"
                  >
                    <Text type="label">
                      {{ shortcut.label }}
                    </Text>
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
                </Card>
              </VStack>
              <VStack v-else :gap="4">
                <Text type="body" color="secondary">
                  Settings for {{ panelConfig(activePanel).label }}.
                </Text>
                <Selector
                  v-if="activePanel === 'language'"
                  :model-value="settings.language"
                  label="Language"
                  size="sm"
                  :width="CONTROL_WIDTH"
                  :options="[
                    { value: 'en-US', label: 'English (US)' },
                    { value: 'fr', label: 'Français' },
                  ]"
                  @update:model-value="(v: string | number | null) => update('language', v == null ? settings.language : String(v))"
                />
                <Switch
                  v-if="activePanel === 'notifications'"
                  :model-value="settings.weeklyDigest"
                  label="Weekly digest"
                  @update:model-value="v => update('weeklyDigest', v)"
                />
                <Switch
                  v-if="activePanel === 'privacy'"
                  :model-value="settings.discoverable"
                  label="Discoverable by email"
                  @update:model-value="v => update('discoverable', v)"
                />
                <Button
                  v-if="activePanel === 'integrations'"
                  label="Connect calendar"
                  variant="secondary"
                  size="sm"
                />
              </VStack>
            </VStack>
          </LayoutContent>
        </Layout>
      </VStack>
    </Dialog>
  </Center>
</template>

<style>
.settings-dialog-shell {
  height: min(800px, calc(100dvh - 2rem));
}
.settings-side-nav {
  flex-shrink: 0;
}
.settings-side-nav-section {
  padding-block: var(--spacing-2);
}
.settings-close-anchor {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  height: 0;
}
.settings-close-backing {
  display: flex;
  background-color: var(--color-background-surface);
  border-radius: var(--radius-element);
}
.settings-panel {
  container-type: inline-size;
  container-name: settings-panel;
}
.settings-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
}
@container settings-panel (max-width: 480px) {
  .settings-row {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-2);
  }
}
.theme-swatch {
  width: 100%;
  height: 100%;
  background: var(--color-background-muted);
  border-radius: var(--radius-element);
}
.theme-swatch[data-theme='dark'] {
  background: #1a1a1a;
}
.theme-swatch[data-theme='system'] {
  background: linear-gradient(90deg, var(--color-background-muted) 50%, #1a1a1a 50%);
}
</style>
