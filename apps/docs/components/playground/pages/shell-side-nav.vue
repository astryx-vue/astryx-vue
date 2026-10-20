<script setup lang="ts">
import type { StatusDotVariant } from '@astryx-vue/core'
import { ref } from 'vue'
import {
  AppShell,
  Card,
  Divider,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutFooter,
  MoreMenu,
  NavIcon,
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
  StatusDot,
  VStack,
} from '@astryx-vue/core'

type Conversation = {
  label: string
  status: StatusDotVariant
  statusLabel: string
}

type Workspace = {
  name: string
  icon: string
  chats: Conversation[]
}

const WORKSPACES: Workspace[] = [
  {
    name: 'Personal',
    icon: 'i-heroicons-user',
    chats: [
      { label: 'Weekend trip planning', status: 'success', statusLabel: 'Active' },
      { label: 'Recipe ideas for the week', status: 'neutral', statusLabel: 'Idle' },
      { label: 'Book recommendations', status: 'warning', statusLabel: 'Needs review' },
      { label: 'Home workout plan', status: 'neutral', statusLabel: 'Idle' },
    ],
  },
  {
    name: 'Acme Corp',
    icon: 'i-heroicons-building-office-2',
    chats: [
      { label: 'Q3 roadmap draft', status: 'info', statusLabel: 'In progress' },
      { label: 'Customer onboarding flow', status: 'success', statusLabel: 'Active' },
      { label: 'Pricing strategy review', status: 'warning', statusLabel: 'Needs review' },
      { label: 'Standup summary', status: 'neutral', statusLabel: 'Idle' },
    ],
  },
  {
    name: 'Open Source',
    icon: 'i-heroicons-code-bracket',
    chats: [
      { label: 'StyleX migration notes', status: 'info', statusLabel: 'In progress' },
      { label: 'Skeleton loading states', status: 'success', statusLabel: 'Active' },
      { label: 'Accessibility audit', status: 'error', statusLabel: 'Blocked' },
      { label: 'Release notes v4.0', status: 'neutral', statusLabel: 'Idle' },
    ],
  },
]

const SELECTED_CHAT = 'StyleX migration notes'

const MESSAGES = [
  { role: 'assistant', width: '78%', height: 104 },
  { role: 'user', width: '48%', height: 48 },
  { role: 'assistant', width: '64%', height: 132 },
  { role: 'user', width: '38%', height: 40 },
]

const isHovered = ref(false)
const isMenuOpen = ref(false)

function conversationMenuOpen(open: boolean) {
  isMenuOpen.value = open
}
</script>

<template>
  <AppShell :content-padding="0">
    <template #side-nav>
      <SideNav collapsible>
        <template #header>
          <SideNavHeading heading="AI Assistant" heading-href="#">
            <template #icon>
              <NavIcon>
                <Icon icon="i-heroicons-sparkles" size="sm" />
              </NavIcon>
            </template>
          </SideNavHeading>
        </template>
        <template #footer>
          <SideNavSection title="Account" is-header-hidden>
            <SideNavItem label="Settings" href="#">
              <template #icon>
                <Icon icon="i-heroicons-cog-6-tooth" size="sm" />
              </template>
            </SideNavItem>
            <SideNavItem label="Sarah Chen" href="#">
              <template #icon>
                <Icon icon="i-heroicons-user-circle" size="sm" />
              </template>
            </SideNavItem>
          </SideNavSection>
        </template>
        <SideNavSection title="Menu" is-header-hidden>
          <SideNavItem label="New chat" href="#">
            <template #icon>
              <Icon icon="i-heroicons-plus" size="sm" />
            </template>
          </SideNavItem>
          <SideNavItem label="Search" href="#">
            <template #icon>
              <Icon icon="i-heroicons-magnifying-glass" size="sm" />
            </template>
          </SideNavItem>
          <SideNavItem label="Library" href="#">
            <template #icon>
              <Icon icon="i-heroicons-book-open" size="sm" />
            </template>
          </SideNavItem>
        </SideNavSection>
        <Divider />
        <SideNavSection title="Workspaces" is-header-hidden>
          <SideNavItem
            v-for="workspace in WORKSPACES"
            :key="workspace.name"
            :label="workspace.name"
            :collapsible="{ defaultIsCollapsed: false }"
          >
            <template #icon>
              <Icon :icon="workspace.icon" size="sm" />
            </template>
            <VStack :gap="0.5">
              <div
                v-for="chat in workspace.chats"
                :key="chat.label"
                @mouseenter="isHovered = true"
                @mouseleave="isHovered = false"
              >
                <SideNavItem
                  :label="chat.label"
                  href="#"
                  :is-selected="chat.label === SELECTED_CHAT"
                >
                  <template #end>
                    <MoreMenu
                      v-if="isHovered || isMenuOpen"
                      size="sm"
                      label="Conversation options"
                      @open-change="conversationMenuOpen"
                      :items="[
                        { label: 'Pin', onClick: () => {} },
                        { label: 'Rename', onClick: () => {} },
                        { label: 'Archive', onClick: () => {} },
                        { label: 'Delete', onClick: () => {} },
                      ]"
                    />
                    <StatusDot v-else :variant="chat.status" :label="chat.statusLabel" />
                  </template>
                </SideNavItem>
              </div>
            </VStack>
          </SideNavItem>
        </SideNavSection>
      </SideNav>
    </template>
    <Layout height="fill" :content-width="768">
      <LayoutContent :padding="6">
        <VStack :gap="5">
          <HStack
            v-for="(message, mi) in MESSAGES"
            :key="mi"
            :justify="message.role === 'assistant' ? 'start' : 'end'"
          >
            <Card
              variant="muted"
              :padding="0"
              :width="message.width"
              :height="message.height"
            />
          </HStack>
        </VStack>
      </LayoutContent>
      <template #footer>
        <LayoutFooter>
          <Card variant="muted" :padding="0" width="100%" :height="56" />
        </LayoutFooter>
      </template>
    </Layout>
  </AppShell>
</template>
