<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import {
  Button,
  CheckboxInput,
  createStaticSource,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  List,
  ListItem,
  StackItem,
  Tab,
  TabList,
  Text,
  TextInput,
  Typeahead,
  useMediaQuery,
  useToast,
  VStack,
} from '@astryx-vue/core'
import { defineComponent, h, ref } from 'vue'

const NAV_ITEMS = ['Profile', 'Account', 'Members', 'Billing', 'Invoices', 'API']

const SETTINGS_ITEMS: SearchableItem[] = [
  { id: '1', label: 'Username' },
  { id: '2', label: 'First name' },
  { id: '3', label: 'Last name' },
  { id: '4', label: 'Email address' },
  { id: '5', label: 'Change password' },
  { id: '6', label: 'Data Export Access' },
  { id: '7', label: 'Allow Admin to Add Members' },
  { id: '8', label: 'Two-Factor Authentication' },
]

const settingsSearchSource = createStaticSource(SETTINGS_ITEMS)

const MagnifyingGlassIcon = defineComponent({
  render: () => h(Icon, { name: 'heroicons:magnifying-glass' }),
})

const showToast = useToast()
const isNarrow = useMediaQuery('(max-width: 768px)')
/** 这个页面只做了「Profile」一页，其余分类点了只给演示提示。 */
const CURRENT_NAV = 'Profile'

function openNav(item: string) {
  if (item === CURRENT_NAV)
    return
  showToast({ body: `Demo: ${item} settings would open here`, uniqueID: `nav-${item}` })
}
const username = ref('nicol43')
const firstName = ref('Stephanie')
const lastName = ref('Nicol')
const email = ref('stephanie_nicol@mail.com')
const currentPw = ref('password123')
const newPw = ref('password123')
const confirmPw = ref('password123')
const dataExport = ref(false)
const adminMembers = ref(false)
const twoFactor = ref(false)
const searchValue = ref<SearchableItem | null>(null)
</script>

<template>
  <Layout height="fill" :content-width="1440">
    <template #header>
      <LayoutHeader has-divider>
        <!-- 窄屏时搜索框换到标题下面，不把标题挤成细条。 -->
        <HStack align="center" wrap="wrap" :gap="2">
          <StackItem size="fill">
            <Heading :level="1">
              Settings
            </Heading>
          </StackItem>
          <Typeahead
            v-model="searchValue"
            label="Search"
            is-label-hidden
            placeholder="Search settings..."
            :search-source="settingsSearchSource"
            has-entries-on-focus
            :width="184"
            :start-icon="MagnifyingGlassIcon"
          />
        </HStack>
      </LayoutHeader>
    </template>
    <template v-if="!isNarrow" #start>
      <LayoutPanel :has-divider="false" :width="260" :padding="2">
        <List density="balanced">
          <ListItem
            v-for="item in NAV_ITEMS"
            :key="item"
            :label="item"
            :is-selected="item === CURRENT_NAV"
            :aria-current="item === CURRENT_NAV ? 'page' : undefined"
            @click="openNav(item)"
          />
        </List>
      </LayoutPanel>
    </template>
    <LayoutContent role="main" :padding="4">
      <VStack :gap="4">
        <VStack v-if="isNarrow" h-align="center">
          <TabList :value="CURRENT_NAV" @update:value="openNav">
            <Tab v-for="item in NAV_ITEMS" :key="item" :value="item" :label="item" />
          </TabList>
        </VStack>
        <Grid :columns="{ minWidth: 320, max: 3 }" :gap="10">
          <VStack :gap="1">
            <Heading :level="3" :accessibility-level="2">
              Basic information
            </Heading>
            <Text type="supporting" color="secondary">
              View and update your personal details and account information.
            </Text>
          </VStack>
          <VStack :gap="4">
            <TextInput v-model="username" label="Username" />
            <TextInput v-model="firstName" label="First name" />
            <TextInput v-model="lastName" label="Last name" />
            <TextInput v-model="email" label="Email address" />
            <HStack>
              <Button label="Save" variant="primary" @click="showToast({ body: 'Demo: your basic information would be saved here', uniqueID: 'save-basic' })" />
            </HStack>
          </VStack>
        </Grid>
        <Divider />
        <Grid :columns="{ minWidth: 320, max: 3 }" :gap="10">
          <VStack :gap="1">
            <Heading :level="3" :accessibility-level="2">
              Change password
            </Heading>
            <Text type="supporting" color="secondary">
              Update your password to keep your account secure.
            </Text>
          </VStack>
          <VStack :gap="4">
            <TextInput v-model="currentPw" label="Verify current password" type="password" />
            <TextInput v-model="newPw" label="New password" type="password" />
            <TextInput v-model="confirmPw" label="Confirm password" type="password" />
            <HStack>
              <Button label="Save" variant="primary" @click="showToast({ body: 'Demo: your new password would be saved here', uniqueID: 'save-password' })" />
            </HStack>
          </VStack>
        </Grid>
        <Divider />
        <Grid :columns="{ minWidth: 320, max: 3 }" :gap="10">
          <VStack :gap="1">
            <Heading :level="3" :accessibility-level="2">
              Advanced settings
            </Heading>
            <Text type="supporting" color="secondary">
              Configure detailed account preferences and security options.
            </Text>
          </VStack>
          <VStack :gap="5">
            <CheckboxInput
              v-model="dataExport"
              label="Data Export Access"
              description="Allow export of personal data and backups."
            />
            <CheckboxInput
              v-model="adminMembers"
              label="Allow Admin to Add Members"
              description="Admins can invite and manage members."
            />
            <CheckboxInput
              v-model="twoFactor"
              label="Enable Two-Factor Authentication"
              description="Require 2FA for added account security."
            />
            <HStack>
              <Button label="Save" variant="primary" @click="showToast({ body: 'Demo: your advanced settings would be saved here', uniqueID: 'save-advanced' })" />
            </HStack>
          </VStack>
        </Grid>
      </VStack>
    </LayoutContent>
  </Layout>
</template>
