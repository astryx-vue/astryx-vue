<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core'
import type { Component } from 'vue'
import {
  AppShell,
  Button,
  Card,
  CommandPalette,
  createStaticSource,
  Divider,
  DropdownMenu,
  DropdownMenuItem,
  HStack,
  Icon,
  IconButton,
  Kbd,
  Layout,
  LayoutContent,
  LayoutHeader,
  SideNav,
  Stack,
  TextInput,
  TopNav,
  TreeList,
  VStack,
} from '@astryx-vue/core'
import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'

const searchQuery = ref('')

function noop() {}

function iconComponent(className: string): Component {
  return defineComponent({
    render: () => h('span', { 'class': className, 'aria-hidden': 'true', 'style': 'width:1em;height:1em' }),
  })
}

const FILE_TREE: TreeListItemData[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'i-heroicons-folder',
    isExpanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'i-heroicons-folder',
        isExpanded: true,
        children: [
          { id: 'AppShell.tsx', label: 'AppShell.tsx', icon: 'i-heroicons-document', isSelected: true },
          { id: 'TopNav.tsx', label: 'TopNav.tsx', icon: 'i-heroicons-document' },
          { id: 'SideNav.tsx', label: 'SideNav.tsx', icon: 'i-heroicons-document' },
        ],
      },
      {
        id: 'hooks',
        label: 'hooks',
        icon: 'i-heroicons-folder',
        isExpanded: true,
        children: [
          { id: 'useTheme.ts', label: 'useTheme.ts', icon: 'i-heroicons-document' },
          { id: 'useResizable.ts', label: 'useResizable.ts', icon: 'i-heroicons-document' },
        ],
      },
      { id: 'index.tsx', label: 'index.tsx', icon: 'i-heroicons-document' },
      { id: 'App.tsx', label: 'App.tsx', icon: 'i-heroicons-document' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    icon: 'i-heroicons-folder',
    isExpanded: false,
    children: [
      { id: 'favicon.ico', label: 'favicon.ico', icon: 'i-heroicons-document' },
      { id: 'robots.txt', label: 'robots.txt', icon: 'i-heroicons-document' },
    ],
  },
  { id: 'package.json', label: 'package.json', icon: 'i-heroicons-document' },
  { id: 'tsconfig.json', label: 'tsconfig.json', icon: 'i-heroicons-document' },
  { id: 'README.md', label: 'README.md', icon: 'i-heroicons-document' },
]

type MenuEntry = [label: string, shortcut: string]

const MENU_WIDTH = 280

const MENUS: { label: string, groups: MenuEntry[][] }[] = [
  {
    label: 'File',
    groups: [
      [['New File', '⌘N'], ['New Window', '⇧⌘N']],
      [['Open...', '⌘O'], ['Save', '⌘S'], ['Save As...', '⇧⌘S']],
      [['Close Editor', '⌘W']],
    ],
  },
  {
    label: 'Edit',
    groups: [
      [['Undo', '⌘Z'], ['Redo', '⇧⌘Z']],
      [['Cut', '⌘X'], ['Copy', '⌘C'], ['Paste', '⌘V']],
      [['Find', '⌘F']],
    ],
  },
  {
    label: 'View',
    groups: [
      [['Command Palette', '⇧⌘P']],
      [['Explorer', '⇧⌘E'], ['Search', '⇧⌘F']],
      [['Toggle Terminal', '⌃`'], ['Zen Mode', '⌘K']],
    ],
  },
  {
    label: 'Window',
    groups: [
      [['Minimize', '⌘M'], ['Zoom', '']],
      [['Next Tab', '⌃⇥'], ['Previous Tab', '⌃⇧⇥']],
      [['Bring All to Front', '']],
    ],
  },
  {
    label: 'Help',
    groups: [
      [
        ['Documentation', ''],
        ['Release Notes', ''],
        ['Report Issue', ''],
        ['About', ''],
      ],
    ],
  },
]

const CODE_LINES = [
  '38%',
  '62%',
  '54%',
  '0%',
  '46%',
  '70%',
  '58%',
  '34%',
  '0%',
  '50%',
  '66%',
  '42%',
  '60%',
  '28%',
]

const EDITOR_TABS = ['AppShell.tsx', 'TopNav.tsx', 'theme.ts']

const COMMANDS = [
  { id: 'new-file', label: 'New File' },
  { id: 'open-file', label: 'Open File…' },
  { id: 'save-all', label: 'Save All' },
  { id: 'find-in-files', label: 'Find in Files' },
  { id: 'toggle-terminal', label: 'Toggle Terminal' },
  { id: 'go-to-symbol', label: 'Go to Symbol…' },
  { id: 'appshell', label: 'AppShell.tsx' },
  { id: 'topnav', label: 'TopNav.tsx' },
  { id: 'sidenav', label: 'SideNav.tsx' },
  { id: 'use-theme', label: 'useTheme.ts' },
  { id: 'theme', label: 'theme.ts' },
]

const isPaletteOpen = ref(false)
const searchSource = createStaticSource(COMMANDS)

function onKeyDown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isPaletteOpen.value = true
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <AppShell :content-padding="0">
    <template #topNav>
      <TopNav label="Astryx Studio menu bar">
        <template #start>
          <DropdownMenu
            v-for="menu in MENUS"
            :key="menu.label"
            :button="{ label: menu.label, variant: 'ghost', size: 'sm' }"
            :has-chevron="false"
            :menu-width="MENU_WIDTH"
          >
            <template v-for="(group, gi) in menu.groups" :key="gi">
              <Divider v-if="gi > 0" />
              <DropdownMenuItem
                v-for="[label, shortcut] in group"
                :key="label"
                :label="label"
                @click="noop"
              >
                <template v-if="shortcut" #end>
                  <Kbd :keys="shortcut" />
                </template>
              </DropdownMenuItem>
            </template>
          </DropdownMenu>
        </template>
        <template #end>
          <Stack @click="isPaletteOpen = true">
            <TextInput
              v-model="searchQuery"
              label="Search files and commands"
              is-label-hidden
              size="sm"
              :width="240"
              :start-icon="iconComponent('i-heroicons-magnifying-glass')"
              placeholder="Search files and commands…"
            />
          </Stack>
          <IconButton
            label="Run project"
            tooltip="Run"
            variant="ghost"
          >
            <template #icon>
              <Icon icon="i-heroicons-play" size="sm" />
            </template>
          </IconButton>
          <Button label="Share" variant="secondary" />
        </template>
      </TopNav>
    </template>
    <template #sideNav>
      <SideNav>
        <TreeList :items="FILE_TREE" density="compact" />
      </SideNav>
    </template>
    <Layout height="fill">
      <template #header>
        <LayoutHeader has-divider :padding="6">
          <HStack :gap="2">
            <Card
              v-for="tab in EDITOR_TABS"
              :key="tab"
              variant="muted"
              :padding="0"
              :width="132"
              :height="36"
            />
          </HStack>
        </LayoutHeader>
      </template>
      <LayoutContent :padding="6">
        <VStack :gap="2">
          <template v-for="(width, i) in CODE_LINES" :key="i">
            <Card
              v-if="width === '0%'"
              variant="muted"
              :padding="0"
              :width="1"
              :height="14"
            />
            <HStack v-else :gap="3" align="center">
              <Card variant="muted" :padding="0" :width="20" :height="14" />
              <Card variant="muted" :padding="0" :width="width" :height="14" />
            </HStack>
          </template>
        </VStack>
      </LayoutContent>
    </Layout>
    <CommandPalette
      :is-open="isPaletteOpen"
      :search-source="searchSource"
      label="Search files and commands"
      @open-change="isPaletteOpen = $event"
    />
  </AppShell>
</template>
