<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref } from 'vue'
import {
  Badge,
  Button,
  Card,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutPanel,
  Link,
  List,
  ListItem,
  Selector,
  StackItem,
  Switch,
  Tab,
  TabList,
  Text,
  TextInput,
  Toolbar,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'

const fillViewport: CSSProperties = { minHeight: '100dvh' }
const iconBox: CSSProperties = {
  borderRadius: 'var(--astryx-radius-container)',
  backgroundColor: 'var(--astryx-color-background-surface)',
  flexShrink: 0,
}
const rowPadding: CSSProperties = { paddingBlock: 'var(--astryx-spacing-4)' }
const sideNavPadding: CSSProperties = {
  paddingBlock: 'var(--astryx-spacing-4)',
  paddingInline: 'var(--astryx-spacing-3)',
}
const sideNavHeading: CSSProperties = { marginInline: 'var(--astryx-spacing-4)' }

const NAV_ITEMS = [
  { label: 'Personal information', icon: 'i-heroicons-user' },
  { label: 'Login & security', icon: 'i-heroicons-lock-closed' },
  { label: 'Privacy', icon: 'i-heroicons-shield-check' },
  { label: 'Notifications', icon: 'i-heroicons-bell' },
  { label: 'Taxes', icon: 'i-heroicons-document-text' },
  { label: 'Payments', icon: 'i-heroicons-credit-card' },
  { label: 'Languages & currency', icon: 'i-heroicons-globe-alt' },
  { label: 'Travel for work', icon: 'i-heroicons-briefcase' },
]

const SECTION_TITLES: Record<string, string> = {
  'Personal information': 'Personal info',
  'Login & security': 'Login & security',
  Privacy: 'Privacy',
  'Languages & currency': 'Languages & currency',
}

interface InfoRow {
  label: string
  value: string
  action: string
}

const LOGIN_ROWS: InfoRow[] = [
  { label: 'Password', value: 'Not created', action: 'Create' },
]

const SOCIAL_ROWS: InfoRow[] = [
  { label: 'Google', value: 'Connected', action: 'Disconnect' },
]

const DEVICE_ROWS = [
  {
    label: 'OS X 10.15.7 · Chrome',
    badge: 'CURRENT SESSION',
    location: 'McKinney, Texas · March 30, 2026 at 19:31',
    action: undefined as string | undefined,
  },
  { label: 'Session', location: 'August 9, 2023 at 04:19', action: 'Log out', badge: undefined },
  {
    label: 'OS X 10.15.7 · unknown',
    location: 'Sunnyvale, California · April 14, 2023 at 17:47',
    action: 'Log out',
    badge: undefined,
  },
]

const LANGUAGES = [
  { label: 'English (Canada)', value: 'en-CA' },
  { label: 'English (US)', value: 'en-US' },
  { label: 'French', value: 'fr' },
  { label: 'Spanish', value: 'es' },
  { label: 'German', value: 'de' },
  { label: 'Japanese', value: 'ja' },
]

const CURRENCIES = [
  { label: 'Canadian dollar (CAD)', value: 'CAD' },
  { label: 'US dollar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'British pound (GBP)', value: 'GBP' },
  { label: 'Japanese yen (JPY)', value: 'JPY' },
]

const TIMEZONES = [
  { label: '(GMT-05:00) Eastern Time (US & Canada)', value: 'ET' },
  { label: '(GMT-06:00) Central Time (US & Canada)', value: 'CT' },
  { label: '(GMT-07:00) Mountain Time (US & Canada)', value: 'MT' },
  { label: '(GMT-08:00) Pacific Time (US & Canada)', value: 'PT' },
  { label: '(GMT+00:00) UTC', value: 'UTC' },
  { label: '(GMT+01:00) London', value: 'GMT+1' },
]

const isNarrow = useMediaQuery('(max-width: 768px)')
const mobileView = ref<'nav' | 'detail'>('nav')
const activeNav = ref('Personal information')
const activeTab = ref('login')
const readReceipts = ref(true)
const showCity = ref(true)
const showTripType = ref(true)
const showStayLength = ref(true)
const showServices = ref(true)
const aiFeatures = ref(true)
const expandedRow = ref<string | null>(null)
const language = ref('en-CA')
const currency = ref('CAD')
const timezone = ref('ET')
const legalName = ref('Alex Johnson')
const preferredName = ref('')
const email = ref('a***n@example.com')

function selectNav(label: string) {
  activeNav.value = label
  mobileView.value = 'detail'
}

function labelForOption(options: { label: string, value: string }[], value: string) {
  return options.find(o => o.value === value)?.label ?? value
}
</script>

<template>
  <Layout
    v-if="isNarrow && mobileView === 'nav'"
    height="fill"
    :style="fillViewport"
  >
    <LayoutContent :padding="2">
      <VStack :gap="4" :style="sideNavPadding">
        <Heading :level="2" :style="sideNavHeading">
          Account settings
        </Heading>
        <List density="spacious">
          <ListItem
            v-for="item in NAV_ITEMS"
            :key="item.label"
            :label="item.label"
            @click="selectNav(item.label)"
          >
            <template #startContent>
              <Icon :icon="item.icon" />
            </template>
            <template #endContent>
              <Icon icon="i-heroicons-chevron-right" size="sm" color="secondary" />
            </template>
          </ListItem>
        </List>
        <Divider />
        <List density="spacious">
          <ListItem label="Professional hosting tools" @click="() => {}">
            <template #startContent>
              <Icon icon="i-heroicons-wrench-screwdriver" />
            </template>
          </ListItem>
        </List>
      </VStack>
    </LayoutContent>
  </Layout>
  <Layout
    v-else
    height="fill"
    :content-width="1200"
    :style="fillViewport"
  >
    <template v-if="!isNarrow" #start>
      <LayoutPanel :has-divider="true" :padding="0">
        <VStack :gap="4" :style="sideNavPadding">
          <Heading :level="2" :style="sideNavHeading">
            Account settings
          </Heading>
          <List density="spacious">
            <ListItem
              v-for="item in NAV_ITEMS"
              :key="item.label"
              :label="item.label"
              :is-selected="activeNav === item.label"
              @click="selectNav(item.label)"
            >
              <template #startContent>
                <Icon :icon="item.icon" />
              </template>
            </ListItem>
          </List>
          <Divider />
          <List density="spacious">
            <ListItem label="Professional hosting tools" @click="() => {}">
              <template #startContent>
                <Icon icon="i-heroicons-wrench-screwdriver" />
              </template>
            </ListItem>
          </List>
        </VStack>
      </LayoutPanel>
    </template>
    <LayoutContent :padding="4">
      <VStack :gap="0">
        <Toolbar
          v-if="isNarrow"
          :label="`Back to Account settings — ${SECTION_TITLES[activeNav] ?? activeNav}`"
          :gap="2"
        >
          <template #start>
            <Button
              label="Back to Account settings"
              variant="ghost"
              size="sm"
              is-icon-only
              @click="mobileView = 'nav'"
            >
              <template #icon>
                <Icon icon="i-heroicons-arrow-left" size="sm" />
              </template>
            </Button>
            <Heading :level="2">
              {{ SECTION_TITLES[activeNav] ?? activeNav }}
            </Heading>
          </template>
        </Toolbar>

        <template v-if="activeNav === 'Login & security'">
          <VStack :gap="6">
            <Heading v-if="!isNarrow" :level="2">
              Login & security
            </Heading>
            <TabList role="tablist" v-model:value="activeTab" has-divider>
              <Tab value="login" label="Login" />
              <Tab value="shared" label="Shared access" />
            </TabList>
            <template v-if="activeTab === 'login'">
              <VStack :gap="8">
                <VStack :gap="0">
                  <Heading :level="3">
                    Login
                  </Heading>
                  <Divider />
                  <template v-for="row in LOGIN_ROWS" :key="row.label">
                    <HStack justify="between" align="start" :style="rowPadding">
                      <VStack :gap="0">
                        <Text type="body" weight="semibold" display="block">
                          {{ row.label }}
                        </Text>
                        <Text type="supporting" color="secondary" display="block">
                          {{ row.value }}
                        </Text>
                      </VStack>
                      <Link v-if="row.action" href="#">
                        {{ row.action }}
                      </Link>
                    </HStack>
                    <Divider />
                  </template>
                </VStack>
                <VStack :gap="0">
                  <Heading :level="3">
                    Social accounts
                  </Heading>
                  <Divider />
                  <template v-for="row in SOCIAL_ROWS" :key="row.label">
                    <HStack justify="between" align="start" :style="rowPadding">
                      <VStack :gap="0">
                        <Text type="body" weight="semibold" display="block">
                          {{ row.label }}
                        </Text>
                        <Text type="supporting" color="secondary" display="block">
                          {{ row.value }}
                        </Text>
                      </VStack>
                      <Link href="#">
                        {{ row.action }}
                      </Link>
                    </HStack>
                    <Divider />
                  </template>
                </VStack>
                <VStack :gap="0">
                  <Heading :level="3">
                    Device history
                  </Heading>
                  <Divider />
                  <HStack
                    v-for="(device, i) in DEVICE_ROWS"
                    :key="i"
                    :gap="3"
                    align="start"
                    :style="rowPadding"
                  >
                    <Icon icon="i-heroicons-computer-desktop" />
                    <StackItem size="fill">
                      <VStack :gap="0">
                        <HStack :gap="2" align="center">
                          <Text type="body" weight="semibold">
                            {{ device.label }}
                          </Text>
                          <Badge v-if="device.badge" :label="device.badge" />
                        </HStack>
                        <Text type="supporting" color="secondary" display="block">
                          {{ device.location }}
                        </Text>
                      </VStack>
                    </StackItem>
                    <Link v-if="device.action" href="#">
                      {{ device.action }}
                    </Link>
                  </HStack>
                  <Divider />
                </VStack>
              </VStack>
            </template>
            <template v-else>
              <VStack :gap="8">
                <VStack :gap="2">
                  <Heading :level="3">
                    Shared access
                  </Heading>
                  <Divider />
                  <Text type="body" color="secondary">
                    Review each request carefully before approving access. We'll email your employee or co-worker a 4-digit code that lets them log into your account with their trusted device.
                  </Text>
                </VStack>
                <Card variant="muted">
                  <HStack :gap="4" align="start">
                    <Center :width="48" :height="48" :style="iconBox">
                      <Icon icon="i-heroicons-lock-closed" />
                    </Center>
                    <VStack :gap="1">
                      <Text type="body" weight="bold">
                        Adding devices from people you trust
                      </Text>
                      <Text type="body" color="secondary">
                        When you approve a request, you grant someone full access to your account. They'll be able to change reservations and send messages on your behalf.
                      </Text>
                    </VStack>
                  </HStack>
                </Card>
              </VStack>
            </template>
          </VStack>
        </template>

        <template v-else-if="activeNav === 'Languages & currency'">
          <VStack :gap="6">
            <Heading v-if="!isNarrow" :level="2">
              Languages & currency
            </Heading>
            <VStack :gap="0">
              <template v-for="key in ['language', 'currency', 'timezone']" :key="key">
                <VStack v-if="expandedRow === key" :gap="4" :style="rowPadding">
                  <Text type="body" weight="semibold" display="block">
                    {{ key === 'language' ? 'Preferred language' : key === 'currency' ? 'Preferred currency' : 'Time zone' }}
                  </Text>
                  <Selector
                    v-if="key === 'language'"
                    v-model="language"
                    label="Language"
                    is-label-hidden
                    size="lg"
                    :options="LANGUAGES"
                  />
                  <Selector
                    v-else-if="key === 'currency'"
                    v-model="currency"
                    label="Currency"
                    is-label-hidden
                    size="lg"
                    :options="CURRENCIES"
                  />
                  <Selector
                    v-else
                    v-model="timezone"
                    label="Time zone"
                    is-label-hidden
                    size="lg"
                    :options="TIMEZONES"
                  />
                  <HStack :gap="2">
                    <Button label="Save" variant="primary" @click="expandedRow = null" />
                    <Button label="Cancel" variant="ghost" @click="expandedRow = null" />
                  </HStack>
                </VStack>
                <HStack v-else justify="between" align="start" :style="rowPadding">
                  <VStack :gap="0">
                    <Text type="body" weight="semibold" display="block">
                      {{ key === 'language' ? 'Preferred language' : key === 'currency' ? 'Preferred currency' : 'Time zone' }}
                    </Text>
                    <Text type="supporting" color="secondary" display="block">
                      {{ key === 'language' ? labelForOption(LANGUAGES, language) : key === 'currency' ? labelForOption(CURRENCIES, currency) : labelForOption(TIMEZONES, timezone) }}
                    </Text>
                  </VStack>
                  <Link href="#" @click.prevent="expandedRow = key">
                    Edit
                  </Link>
                </HStack>
                <Divider />
              </template>
            </VStack>
          </VStack>
        </template>

        <template v-else-if="activeNav === 'Personal information'">
          <VStack :gap="6">
            <Heading v-if="!isNarrow" :level="2">
              Personal info
            </Heading>
            <VStack :gap="0">
              <VStack v-if="expandedRow === 'legalName'" :gap="4" :style="rowPadding">
                <Text type="body" weight="semibold" display="block">
                  Legal name
                </Text>
                <TextInput v-model="legalName" label="Legal name" is-label-hidden />
                <HStack :gap="2">
                  <Button label="Save" variant="primary" @click="expandedRow = null" />
                  <Button label="Cancel" variant="ghost" @click="expandedRow = null" />
                </HStack>
              </VStack>
              <HStack v-else justify="between" align="start" :style="rowPadding">
                <VStack :gap="0">
                  <Text type="body" weight="semibold" display="block">
                    Legal name
                  </Text>
                  <Text type="supporting" color="secondary" display="block">
                    {{ legalName }}
                  </Text>
                </VStack>
                <Link href="#" @click.prevent="expandedRow = 'legalName'">
                  Edit
                </Link>
              </HStack>
              <Divider />
              <VStack v-if="expandedRow === 'preferredName'" :gap="4" :style="rowPadding">
                <Text type="body" weight="semibold" display="block">
                  Preferred first name
                </Text>
                <TextInput v-model="preferredName" label="Preferred first name" is-label-hidden />
                <HStack :gap="2">
                  <Button label="Save" variant="primary" @click="expandedRow = null" />
                  <Button label="Cancel" variant="ghost" @click="expandedRow = null" />
                </HStack>
              </VStack>
              <HStack v-else justify="between" align="start" :style="rowPadding">
                <VStack :gap="0">
                  <Text type="body" weight="semibold" display="block">
                    Preferred first name
                  </Text>
                  <Text type="supporting" color="secondary" display="block">
                    {{ preferredName || 'Not provided' }}
                  </Text>
                </VStack>
                <Link href="#" @click.prevent="expandedRow = 'preferredName'">
                  Edit
                </Link>
              </HStack>
              <Divider />
              <VStack v-if="expandedRow === 'email'" :gap="4" :style="rowPadding">
                <Text type="body" weight="semibold" display="block">
                  Email address
                </Text>
                <TextInput v-model="email" label="Email address" is-label-hidden />
                <HStack :gap="2">
                  <Button label="Save" variant="primary" @click="expandedRow = null" />
                  <Button label="Cancel" variant="ghost" @click="expandedRow = null" />
                </HStack>
              </VStack>
              <HStack v-else justify="between" align="start" :style="rowPadding">
                <VStack :gap="0">
                  <Text type="body" weight="semibold" display="block">
                    Email address
                  </Text>
                  <Text type="supporting" color="secondary" display="block">
                    {{ email }}
                  </Text>
                </VStack>
                <Link href="#" @click.prevent="expandedRow = 'email'">
                  Edit
                </Link>
              </HStack>
              <Divider />
            </VStack>
          </VStack>
        </template>

        <template v-else-if="activeNav === 'Privacy'">
          <VStack :gap="6">
            <Heading v-if="!isNarrow" :level="2">
              Privacy
            </Heading>
            <VStack :gap="8">
              <VStack :gap="0">
                <Heading :level="3">
                  Messages
                </Heading>
                <VStack :style="rowPadding">
                  <Switch
                    v-model="readReceipts"
                    label="Show people when I've read their messages."
                    label-position="start"
                    label-spacing="spread"
                  />
                </VStack>
                <HStack justify="between" align="center" :style="rowPadding">
                  <Text type="body" weight="semibold">
                    Blocked people
                  </Text>
                  <Link href="#">
                    View
                  </Link>
                </HStack>
                <Divider />
              </VStack>
              <VStack :gap="4">
                <Heading :level="3">
                  Reviews
                </Heading>
                <Switch
                  v-model="showCity"
                  label="Show my home city and country"
                  description="Ex: City and country"
                  label-position="start"
                  label-spacing="spread"
                />
                <Switch
                  v-model="showTripType"
                  label="Show my trip type"
                  description="Ex: Stayed with kids or pets"
                  label-position="start"
                  label-spacing="spread"
                />
                <Switch
                  v-model="showStayLength"
                  label="Show my length of stay"
                  description="Ex: A few nights, about a week, etc."
                  label-position="start"
                  label-spacing="spread"
                />
                <Switch
                  v-model="showServices"
                  label="Show my booked services"
                  description="Ex: Gourmet brunch or tasting menu"
                  label-position="start"
                  label-spacing="spread"
                />
                <Divider />
              </VStack>
              <VStack :gap="4">
                <Heading :level="3">
                  Data privacy
                </Heading>
                <Switch
                  v-model="aiFeatures"
                  label="Help improve AI-powered features"
                  description="When this is on, we use your data to develop and improve AI models."
                  label-position="start"
                  label-spacing="spread"
                />
              </VStack>
            </VStack>
          </VStack>
        </template>
      </VStack>
    </LayoutContent>
  </Layout>
</template>
