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
  useContainerReveal,
  useImperativeAlertDialog,
  useToast,
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
    icon: 'heroicons:user',
    chats: [
      { label: 'Weekend trip planning', status: 'success', statusLabel: 'Active' },
      { label: 'Recipe ideas for the week', status: 'neutral', statusLabel: 'Idle' },
      { label: 'Book recommendations', status: 'warning', statusLabel: 'Needs review' },
      { label: 'Home workout plan', status: 'neutral', statusLabel: 'Idle' },
    ],
  },
  {
    name: 'Acme Corp',
    icon: 'heroicons:building-office-2',
    chats: [
      { label: 'Q3 roadmap draft', status: 'accent', statusLabel: 'In progress' },
      { label: 'Customer onboarding flow', status: 'success', statusLabel: 'Active' },
      { label: 'Pricing strategy review', status: 'warning', statusLabel: 'Needs review' },
      { label: 'Standup summary', status: 'neutral', statusLabel: 'Idle' },
    ],
  },
  {
    name: 'Open Source',
    icon: 'heroicons:code-bracket',
    chats: [
      { label: 'StyleX migration notes', status: 'accent', statusLabel: 'In progress' },
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

/** 更多菜单一直挂着、留在 Tab 顺序里：悬停、行内任意处有焦点或粗指针时露出，菜单打开时钉住。 */
const menuOpenChat = ref<string | null>(null)
const reveal = useContainerReveal()

function conversationMenuOpen(label: string, open: boolean) {
  if (open)
    menuOpenChat.value = label
  else if (menuOpenChat.value === label)
    menuOpenChat.value = null
}

const showToast = useToast()
const confirm = useImperativeAlertDialog()
const ConfirmHost = confirm.Host

// 演示：换成真正处理这条会话的调用
function demoAction(label: string, verb: string) {
  showToast({ body: `Demo: ${label} would be ${verb} here`, uniqueID: `${verb}-${label}` })
}

function conversationMenuItems(label: string) {
  return [
    { label: 'Pin', onClick: () => demoAction(label, 'pinned') },
    { label: 'Rename', onClick: () => demoAction(label, 'renamed') },
    { label: 'Archive', onClick: () => demoAction(label, 'archived') },
    {
      label: 'Delete',
      onClick: () => confirm.show({
        title: `Delete ${label}?`,
        description: 'This demo won\'t delete anything.',
        actionLabel: 'Delete',
        onAction: () => {
          confirm.hide()
          demoAction(label, 'deleted')
        },
      }),
    },
  ]
}
</script>

<template>
  <AppShell :content-padding="0">
    <template #sideNav>
      <SideNav collapsible :resizable="{ defaultWidth: 300, minWidth: 220, maxWidth: 420 }">
        <template #header>
          <SideNavHeading heading="AI Assistant" heading-href="#">
            <template #icon>
              <NavIcon>
                <Icon name="heroicons:sparkles" size="sm" />
              </NavIcon>
            </template>
          </SideNavHeading>
        </template>
        <template #footer>
          <SideNavSection title="Account" is-header-hidden>
            <SideNavItem label="Settings" href="#">
              <template #icon>
                <Icon name="heroicons:cog-6-tooth" size="sm" />
              </template>
            </SideNavItem>
            <SideNavItem label="Sarah Chen" href="#">
              <template #icon>
                <Icon name="heroicons:user-circle" size="sm" />
              </template>
            </SideNavItem>
          </SideNavSection>
        </template>
        <SideNavSection title="Menu" is-header-hidden>
          <SideNavItem label="New chat" href="#">
            <template #icon>
              <Icon name="heroicons:plus" size="sm" />
            </template>
          </SideNavItem>
          <SideNavItem label="Search" href="#">
            <template #icon>
              <Icon name="heroicons:magnifying-glass" size="sm" />
            </template>
          </SideNavItem>
          <SideNavItem label="Library" href="#">
            <template #icon>
              <Icon name="heroicons:book-open" size="sm" />
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
              <Icon :name="workspace.icon" size="sm" />
            </template>
            <VStack :gap="0.5">
              <div
                v-for="chat in workspace.chats"
                :key="chat.label"
                v-bind="reveal.containerProps({ forceState: menuOpenChat === chat.label ? 'active' : undefined })"
              >
                <SideNavItem
                  :label="chat.label"
                  href="#"
                  :is-selected="chat.label === SELECTED_CHAT"
                >
                  <template #end>
                    <StatusDot :variant="chat.status" :label="chat.statusLabel" />
                  </template>
                  <template #actions>
                    <span v-bind="reveal.contentProps()">
                      <MoreMenu
                        size="sm"
                        label="Conversation options"
                        :items="conversationMenuItems(chat.label)"
                        @open-change="(open: boolean) => conversationMenuOpen(chat.label, open)"
                      />
                    </span>
                  </template>
                </SideNavItem>
              </div>
            </VStack>
          </SideNavItem>
        </SideNavSection>
      </SideNav>
      <ConfirmHost />
    </template>
    <Layout height="fill" :content-width="768">
      <LayoutContent :padding="6">
        <VStack :gap="5">
          <HStack
            v-for="(message, mi) in MESSAGES"
            :key="mi"
            :h-align="message.role === 'assistant' ? 'start' : 'end'"
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
