<script setup lang="ts">
import type { Component } from 'vue'
import type { TreeListItemData } from '@astryx-vue/core'
import { defineComponent, h, ref } from 'vue'
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
  StackItem,
  TextInput,
  TopNav,
  TreeList,
  useHotkeys,
  useToast,
  VStack,
} from '@astryx-vue/core'

const searchQuery = ref('')

const noop = () => {}

function iconComponent(className: string): Component {
  return defineComponent({
    render: () => h('span', { class: className, 'aria-hidden': 'true', style: 'width:1em;height:1em' }),
  })
}

const folderIcon = () => h(Icon, { name: 'heroicons:folder', size: 'xsm' })
const fileIcon = () => h(Icon, { name: 'heroicons:document-text', size: 'xsm' })

const FILE_TREE: TreeListItemData[] = [
  {
    id: 'src',
    label: 'src',
    startContent: folderIcon,
    isExpanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        startContent: folderIcon,
        isExpanded: true,
        children: [
          { id: 'AppShell.tsx', label: 'AppShell.tsx', startContent: fileIcon, isSelected: true },
          { id: 'TopNav.tsx', label: 'TopNav.tsx', startContent: fileIcon },
          { id: 'SideNav.tsx', label: 'SideNav.tsx', startContent: fileIcon },
        ],
      },
      {
        id: 'hooks',
        label: 'hooks',
        startContent: folderIcon,
        isExpanded: true,
        children: [
          { id: 'useTheme.ts', label: 'useTheme.ts', startContent: fileIcon },
          { id: 'useResizable.ts', label: 'useResizable.ts', startContent: fileIcon },
        ],
      },
      { id: 'index.tsx', label: 'index.tsx', startContent: fileIcon },
      { id: 'App.tsx', label: 'App.tsx', startContent: fileIcon },
    ],
  },
  {
    id: 'public',
    label: 'public',
    startContent: folderIcon,
    isExpanded: false,
    children: [
      { id: 'favicon.ico', label: 'favicon.ico', startContent: fileIcon },
      { id: 'robots.txt', label: 'robots.txt', startContent: fileIcon },
    ],
  },
  { id: 'package.json', label: 'package.json', startContent: fileIcon },
  { id: 'tsconfig.json', label: 'tsconfig.json', startContent: fileIcon },
  { id: 'README.md', label: 'README.md', startContent: fileIcon },
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
  '38%', '62%', '54%', '0%', '46%', '70%', '58%', '34%', '0%', '50%', '66%', '42%', '60%', '28%',
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

const showToast = useToast()

// 两个平台的组合键都认，和这个页面一直以来的行为一致。
function openPalette() {
  isPaletteOpen.value = true
}
useHotkeys([
  { keys: 'meta+k', onPress: openPalette, allowInInputs: true },
  { keys: 'ctrl+k', onPress: openPalette, allowInInputs: true },
])
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
                <template v-if="shortcut" #endContent>
                  <Kbd :keys="shortcut" />
                </template>
              </DropdownMenuItem>
            </template>
          </DropdownMenu>
        </template>
        <template #end>
          <!-- 搜索框最宽 240px，窄屏顶栏放不下时跟着缩，别把菜单按钮挤出视口。 -->
          <StackItem size="fill" class="search-field" @click="isPaletteOpen = true">
            <TextInput
              v-model="searchQuery"
              label="Search files and commands"
              is-label-hidden
              size="sm"
              width="100%"
              :start-icon="iconComponent('i-heroicons-magnifying-glass')"
              placeholder="Search files and commands…"
            />
          </StackItem>
          <!-- 演示：换成真正执行操作的调用 -->
          <IconButton
            label="Run project"
            tooltip="Run"
            variant="ghost"
            @click="showToast({ body: 'Demo: the project would run here', uniqueID: 'run' })"
          >
            <Icon name="heroicons:play" size="sm" />
          </IconButton>
          <StackItem>
            <Button label="Share" variant="secondary" @click="showToast({ body: 'Demo: sharing would start here', uniqueID: 'share' })" />
          </StackItem>
        </template>
      </TopNav>
    </template>
    <template #sideNav>
      <SideNav :resizable="{ defaultWidth: 240, minWidth: 180, maxWidth: 400 }">
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

<style scoped>
.search-field {
  width: 240px;
}
</style>
