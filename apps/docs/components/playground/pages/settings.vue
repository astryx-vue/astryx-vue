<script setup lang="ts">
import type { Component } from 'vue'
import type { SearchableItem } from '@astryx-vue/core'
import { defineComponent, h, ref } from 'vue'
import {
  Button,
  CheckboxInput,
  createStaticSource,
  Divider,
  Grid,
  Heading,
  HStack,
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
  VStack,
} from '@astryx-vue/core'

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

function iconComponent(className: string): Component {
  return defineComponent({
    render: () => h('span', { class: className, 'aria-hidden': 'true', style: 'width:1em;height:1em' }),
  })
}

const MagnifyingGlassIcon = iconComponent('i-heroicons-magnifying-glass')

const isNarrow = useMediaQuery('(max-width: 768px)')
const activeNav = ref('Profile')
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
        <HStack align="center">
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
            :is-selected="activeNav === item"
            @click="activeNav = item"
          />
        </List>
      </LayoutPanel>
    </template>
    <LayoutContent :padding="4">
      <VStack :gap="4">
        <VStack v-if="isNarrow" hAlign="center">
          <TabList v-model:value="activeNav">
            <Tab v-for="item in NAV_ITEMS" :key="item" :value="item" :label="item" />
          </TabList>
        </VStack>
        <Grid :columns="{ minWidth: 320 }" :gap="10">
          <VStack :gap="1">
            <Heading :level="3">
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
              <Button label="Save" variant="primary" />
            </HStack>
          </VStack>
        </Grid>
        <Divider />
        <Grid :columns="{ minWidth: 320 }" :gap="10">
          <VStack :gap="1">
            <Heading :level="3">
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
              <Button label="Save" variant="primary" />
            </HStack>
          </VStack>
        </Grid>
        <Divider />
        <Grid :columns="{ minWidth: 320 }" :gap="10">
          <VStack :gap="1">
            <Heading :level="3">
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
              <Button label="Save" variant="primary" />
            </HStack>
          </VStack>
        </Grid>
      </VStack>
    </LayoutContent>
  </Layout>
</template>
