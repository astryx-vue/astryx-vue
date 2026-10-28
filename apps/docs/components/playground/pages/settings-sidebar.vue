<script setup lang="ts">
import type { CSSProperties } from 'vue'
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
import { reactive, ref } from 'vue'

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

// ── 数据 ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Personal information', icon: 'heroicons:user' },
  { label: 'Login & security', icon: 'heroicons:lock-closed' },
  { label: 'Privacy', icon: 'heroicons:shield-check' },
  { label: 'Notifications', icon: 'heroicons:bell' },
  { label: 'Taxes', icon: 'heroicons:document-text' },
  { label: 'Payments', icon: 'heroicons:credit-card' },
  { label: 'Languages & currency', icon: 'heroicons:globe-alt' },
  { label: 'Travel for work', icon: 'heroicons:briefcase' },
]

const SECTION_TITLES: Record<string, string> = {
  'Personal information': 'Personal info',
  'Login & security': 'Login & security',
  'Privacy': 'Privacy',
  'Languages & currency': 'Languages & currency',
}

const LOGIN_ROWS = [
  { label: 'Password', value: 'Not created', action: 'Create' },
]

const SOCIAL_ROWS = [
  { label: 'Google', value: 'Connected', action: 'Disconnect' },
]

const DEVICE_ROWS = [
  { label: 'OS X 10.15.7 · Chrome', badge: 'CURRENT SESSION', location: 'McKinney, Texas · March 30, 2026 at 19:31', action: undefined as string | undefined },
  { label: 'Session', badge: undefined as string | undefined, location: 'August 9, 2023 at 04:19', action: 'Log out' },
  { label: 'OS X 10.15.7 · unknown', badge: undefined as string | undefined, location: 'Sunnyvale, California · April 14, 2023 at 17:47', action: 'Log out' },
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

/** 每行一个字段；`isReadOnly` 的那一行只显示，不给编辑入口。 */
interface PersonalField {
  key: string
  label: string
  isReadOnly?: boolean
}

const PERSONAL_FIELDS: PersonalField[] = [
  { key: 'legalName', label: 'Legal name' },
  { key: 'preferredName', label: 'Preferred first name' },
  { key: 'email', label: 'Email address' },
  { key: 'phone', label: 'Phone number' },
  { key: 'identity', label: 'Identity verification', isReadOnly: true },
  { key: 'address', label: 'Residential address' },
  { key: 'mailingAddress', label: 'Mailing address' },
  { key: 'emergencyContact', label: 'Emergency contact' },
] as const

/** 值留空的字段显示占位文案，和原版一致。 */
const PERSONAL_PLACEHOLDERS: Record<string, string> = {
  preferredName: 'Not provided',
  address: 'Not provided',
  mailingAddress: 'Not provided',
}

const HELP_CARDS = [
  {
    icon: 'heroicons:lock-closed',
    title: 'Why isn\'t my info shown here?',
    body: 'We\'re hiding some account details to protect your identity.',
  },
  {
    icon: 'heroicons:pencil-square',
    title: 'Which details can be edited?',
    body: 'Contact info and personal details can be edited. If this info was used to verify your identity, you\'ll need to get verified again the next time you book—or to continue hosting.',
  },
  {
    icon: 'heroicons:share',
    title: 'What info is shared with others?',
    body: 'We only release contact information after a reservation is confirmed.',
  },
]

// ── 状态 ──────────────────────────────────────────────────────────────────────

const isNarrow = useMediaQuery('(max-width: 768px)')

const mobileView = ref<'nav' | 'detail'>('nav')
const activeNav = ref('Personal information')
const activeTab = ref('login')

const expandedRow = ref<string | null>(null)
const language = ref('en-CA')
const currency = ref('CAD')
const timezone = ref('ET')

const personal = reactive<Record<string, string>>({
  legalName: 'Alex Johnson',
  preferredName: '',
  email: 'a***n@example.com',
  phone: '+1 ***-***-0123',
  address: '',
  mailingAddress: '',
  emergencyContact: 'Provided',
})

const readReceipts = ref(true)
const searchEngines = ref(true)
const showCity = ref(true)
const showTripType = ref(true)
const showStayLength = ref(true)
const showServices = ref(true)
const aiFeatures = ref(true)

function selectNav(label: string) {
  activeNav.value = label
  mobileView.value = 'detail'
}

function labelForOption(options: { label: string, value: string }[], value: string) {
  return options.find(o => o.value === value)?.label ?? value
}

function personalValue(key: string) {
  const value = personal[key]
  return value || PERSONAL_PLACEHOLDERS[key] || value
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
              <Icon :name="item.icon" />
            </template>
            <template #endContent>
              <Icon name="heroicons:chevron-right" size="sm" color="secondary" />
            </template>
          </ListItem>
        </List>
        <Divider />
        <List density="spacious">
          <ListItem label="Professional hosting tools">
            <template #startContent>
              <Icon name="heroicons:wrench-screwdriver" />
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
                <Icon :name="item.icon" />
              </template>
            </ListItem>
          </List>
          <Divider />
          <List density="spacious">
            <ListItem label="Professional hosting tools">
              <template #startContent>
                <Icon name="heroicons:wrench-screwdriver" />
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
                <Icon name="heroicons:arrow-left" size="sm" />
              </template>
            </Button>
            <Heading :level="2">
              {{ SECTION_TITLES[activeNav] ?? activeNav }}
            </Heading>
          </template>
        </Toolbar>

        <VStack v-if="activeNav === 'Login & security'" :gap="6">
          <Heading v-if="!isNarrow" :level="2">
            Login & security
          </Heading>
          <TabList :value="activeTab" has-divider @update:value="activeTab = $event">
            <Tab value="login" label="Login" />
            <Tab value="shared" label="Shared access" />
          </TabList>

          <VStack v-if="activeTab === 'login'" :gap="8">
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
                  <Link v-if="row.action" size="md" href="#">
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
                  <Link size="md" href="#">
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
                <Icon name="heroicons:computer-desktop" />
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
                <Link v-if="device.action" size="md" href="#">
                  {{ device.action }}
                </Link>
              </HStack>
              <Divider />
            </VStack>

            <VStack :gap="0">
              <Heading :level="3">
                Account
              </Heading>
              <Divider />
              <HStack justify="between" align="start" :style="rowPadding">
                <VStack :gap="0">
                  <Text type="body" weight="semibold" display="block">
                    Deactivate your account
                  </Text>
                  <Text type="supporting" color="secondary" display="block">
                    This action cannot be undone
                  </Text>
                </VStack>
                <Link size="md" href="#">
                  Deactivate
                </Link>
              </HStack>
              <Divider />
            </VStack>
          </VStack>

          <VStack v-else :gap="8">
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
                  <Icon name="heroicons:lock-closed" />
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
        </VStack>

        <VStack v-else-if="activeNav === 'Languages & currency'" :gap="6">
          <Heading v-if="!isNarrow" :level="2">
            Languages & currency
          </Heading>
          <VStack :gap="0">
            <template
              v-for="row in [
                { key: 'language', label: 'Preferred language', options: LANGUAGES, current: language },
                { key: 'currency', label: 'Preferred currency', options: CURRENCIES, current: currency },
                { key: 'timezone', label: 'Time zone', options: TIMEZONES, current: timezone },
              ]" :key="row.key"
            >
              <VStack v-if="expandedRow === row.key" :gap="4" :style="rowPadding">
                <Text type="body" weight="semibold" display="block">
                  {{ row.label }}
                </Text>
                <Selector
                  v-if="row.key === 'language'"
                  v-model="language"
                  :label="row.label"
                  is-label-hidden
                  size="lg"
                  :options="row.options"
                />
                <Selector
                  v-else-if="row.key === 'currency'"
                  v-model="currency"
                  :label="row.label"
                  is-label-hidden
                  size="lg"
                  :options="row.options"
                />
                <Selector
                  v-else
                  v-model="timezone"
                  :label="row.label"
                  is-label-hidden
                  size="lg"
                  :options="row.options"
                />
                <HStack :gap="2">
                  <Button label="Save" variant="primary" @click="expandedRow = null" />
                  <Button label="Cancel" variant="ghost" @click="expandedRow = null" />
                </HStack>
              </VStack>
              <HStack v-else justify="between" align="start" :style="rowPadding">
                <VStack :gap="0">
                  <Text type="body" weight="semibold" display="block">
                    {{ row.label }}
                  </Text>
                  <Text type="supporting" color="secondary" display="block">
                    {{ labelForOption(row.options, row.current) }}
                  </Text>
                </VStack>
                <Link size="md" href="#" @click.prevent="expandedRow = row.key">
                  Edit
                </Link>
              </HStack>
              <Divider />
            </template>
          </VStack>
        </VStack>

        <VStack v-else-if="activeNav === 'Personal information'" :gap="6">
          <Heading v-if="!isNarrow" :level="2">
            Personal info
          </Heading>
          <VStack :gap="0">
            <template v-for="field in PERSONAL_FIELDS" :key="field.key">
              <VStack
                v-if="!field.isReadOnly && expandedRow === field.key"
                :gap="4"
                :style="rowPadding"
              >
                <Text type="body" weight="semibold" display="block">
                  {{ field.label }}
                </Text>
                <TextInput
                  v-model="personal[field.key]"
                  :label="field.label"
                  is-label-hidden
                />
                <HStack :gap="2">
                  <Button label="Save" variant="primary" @click="expandedRow = null" />
                  <Button label="Cancel" variant="ghost" @click="expandedRow = null" />
                </HStack>
              </VStack>
              <HStack v-else justify="between" align="start" :style="rowPadding">
                <VStack :gap="0">
                  <Text type="body" weight="semibold" display="block">
                    {{ field.label }}
                  </Text>
                  <Text type="supporting" color="secondary" display="block">
                    {{ field.isReadOnly ? 'Verified' : personalValue(field.key) }}
                  </Text>
                </VStack>
                <Link
                  v-if="!field.isReadOnly"
                  size="md"
                  href="#"
                  @click.prevent="expandedRow = field.key"
                >
                  Edit
                </Link>
              </HStack>
              <Divider />
            </template>
          </VStack>

          <Card :padding="4">
            <VStack :gap="4">
              <template v-for="(card, i) in HELP_CARDS" :key="card.title">
                <Divider v-if="i > 0" />
                <HStack :gap="3" align="start">
                  <Center :width="48" :height="48" :style="iconBox">
                    <Icon :name="card.icon" />
                  </Center>
                  <VStack :gap="0">
                    <Text type="body" weight="semibold" display="block">
                      {{ card.title }}
                    </Text>
                    <Text type="supporting" color="secondary" display="block">
                      {{ card.body }}
                    </Text>
                  </VStack>
                </HStack>
              </template>
            </VStack>
          </Card>
        </VStack>

        <VStack v-else-if="activeNav === 'Privacy'" :gap="6">
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
                <Link size="md" href="#">
                  View
                </Link>
              </HStack>
              <Divider />
            </VStack>

            <VStack :gap="0">
              <Heading :level="3">
                Listings
              </Heading>
              <VStack :style="rowPadding">
                <Switch
                  v-model="searchEngines"
                  label="Include my listing(s) in search engines"
                  description="Turning this on means search engines, like Google, will display your listing page(s) in search results."
                  label-position="start"
                  label-spacing="spread"
                />
              </VStack>
              <Divider />
            </VStack>

            <VStack :gap="4">
              <Heading :level="3">
                Reviews
              </Heading>
              <Text type="supporting" color="secondary">
                Choose what's shared when you write a review.
                <Link href="#" size="sm">
                  Learn more
                </Link>
              </Text>
              <VStack :gap="4">
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
              </VStack>
              <Divider />
            </VStack>

            <VStack :gap="4">
              <Heading :level="3">
                Data privacy
              </Heading>
              <Card>
                <HStack justify="between" align="center">
                  <Text type="body">
                    Request my personal data
                  </Text>
                  <Link size="md" href="#">
                    Request
                  </Link>
                </HStack>
              </Card>
              <Switch
                v-model="aiFeatures"
                label="Help improve AI-powered features"
                description="When this is on, we use your data to develop and improve AI models."
                label-position="start"
                label-spacing="spread"
              />
              <Card>
                <HStack justify="between" align="center">
                  <Text type="body">
                    Delete my account
                  </Text>
                  <Link size="md" href="#">
                    Delete
                  </Link>
                </HStack>
              </Card>
              <Card variant="muted">
                <HStack :gap="4" align="start">
                  <Center :width="48" :height="48" :style="iconBox">
                    <Icon name="heroicons:shield-check" />
                  </Center>
                  <VStack :gap="1">
                    <Text type="body" weight="bold">
                      Committed to privacy
                    </Text>
                    <Text type="supporting" color="secondary">
                      We're committed to keeping your data protected. See details in our
                      <Link href="#" size="sm">
                        Privacy Policy
                      </Link>.
                    </Text>
                  </VStack>
                </HStack>
              </Card>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>
