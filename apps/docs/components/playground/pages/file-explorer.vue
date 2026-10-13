<script setup lang="ts">
import {
  Avatar,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  List,
  ListItem,
  MetadataList,
  MetadataListItem,
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Text,
  Toolbar,
  VStack,
} from '@astryx-vue/core'
import { computed, ref } from 'vue'

interface FileSystemItem {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileSystemItem[]
}

const FILESYSTEM: FileSystemItem[] = [
  {
    id: 'applications',
    name: 'Applications',
    type: 'folder',
    children: [
      {
        id: 'chrome-apps',
        name: 'Chrome Apps',
        type: 'folder',
        children: [
          { id: 'component-lab', name: 'Component Lab.app', type: 'file' },
          { id: 'google-chat', name: 'Google Chat.app', type: 'file' },
          { id: 'workchat', name: 'Workchat.app', type: 'file' },
        ],
      },
      { id: 'figma', name: 'Figma.app', type: 'file' },
      { id: 'safari', name: 'Safari.app', type: 'file' },
      { id: 'slack', name: 'Slack.app', type: 'file' },
      { id: 'terminal', name: 'Terminal.app', type: 'file' },
      { id: 'vscode', name: 'Visual Studio Code.app', type: 'file' },
      { id: 'xcode', name: 'Xcode.app', type: 'file' },
    ],
  },
  { id: 'debug-log', name: 'debug-storybook.log', type: 'file' },
  {
    id: 'desktop',
    name: 'Desktop',
    type: 'folder',
    children: [
      { id: 'screenshot1', name: 'Screenshot 2026-03-28.png', type: 'file' },
      { id: 'notes-txt', name: 'meeting-notes.txt', type: 'file' },
      {
        id: 'projects',
        name: 'Projects',
        type: 'folder',
        children: [
          { id: 'readme-proj', name: 'README.md', type: 'file' },
          {
            id: 'src-folder',
            name: 'src',
            type: 'folder',
            children: [
              { id: 'index-ts', name: 'index.ts', type: 'file' },
              { id: 'app-tsx', name: 'App.tsx', type: 'file' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    children: [
      { id: 'design-spec', name: 'design-spec.pdf', type: 'file' },
      { id: 'resume', name: 'resume.docx', type: 'file' },
      {
        id: 'work',
        name: 'Work',
        type: 'folder',
        children: [
          { id: 'q1-report', name: 'Q1-report.xlsx', type: 'file' },
          { id: 'presentation', name: 'team-presentation.pptx', type: 'file' },
        ],
      },
    ],
  },
  {
    id: 'downloads',
    name: 'Downloads',
    type: 'folder',
    children: [
      { id: 'archive', name: 'archive.zip', type: 'file' },
      { id: 'installer', name: 'installer.dmg', type: 'file' },
      { id: 'photo', name: 'photo-2026.jpg', type: 'file' },
    ],
  },
  { id: 'login-screenshot', name: 'login-02-screenshot.png', type: 'file' },
  {
    id: 'movies',
    name: 'Movies',
    type: 'folder',
    children: [{ id: 'recording', name: 'screen-recording.mov', type: 'file' }],
  },
  {
    id: 'music',
    name: 'Music',
    type: 'folder',
    children: [{ id: 'playlist', name: 'favorites.m3u', type: 'file' }],
  },
  {
    id: 'node-modules',
    name: 'node_modules',
    type: 'folder',
    children: [
      {
        id: 'react',
        name: 'react',
        type: 'folder',
        children: [{ id: 'react-index', name: 'index.js', type: 'file' }],
      },
      {
        id: 'react-dom',
        name: 'react-dom',
        type: 'folder',
        children: [{ id: 'react-dom-index', name: 'index.js', type: 'file' }],
      },
    ],
  },
  {
    id: 'pictures',
    name: 'Pictures',
    type: 'folder',
    children: [
      {
        id: 'vacation',
        name: 'vacation-2026',
        type: 'folder',
        children: [
          { id: 'img1', name: 'IMG_0001.jpg', type: 'file' },
          { id: 'img2', name: 'IMG_0002.jpg', type: 'file' },
          { id: 'img3', name: 'IMG_0003.jpg', type: 'file' },
        ],
      },
      {
        id: 'screenshots-folder',
        name: 'Screenshots',
        type: 'folder',
        children: [
          { id: 'ss1', name: 'Screen Shot 1.png', type: 'file' },
          { id: 'ss2', name: 'Screen Shot 2.png', type: 'file' },
        ],
      },
    ],
  },
  {
    id: 'public',
    name: 'Public',
    type: 'folder',
    children: [
      { id: 'drop-box', name: 'Drop Box', type: 'folder', children: [] },
    ],
  },
  {
    id: 'astryx',
    name: 'astryx',
    type: 'folder',
    children: [
      { id: 'astryx-readme', name: 'README.md', type: 'file' },
      { id: 'astryx-pkg', name: 'package.json', type: 'file' },
      {
        id: 'astryx-packages',
        name: 'packages',
        type: 'folder',
        children: [
          {
            id: 'astryx-core',
            name: 'core',
            type: 'folder',
            children: [
              {
                id: 'core-src',
                name: 'src',
                type: 'folder',
                children: [
                  { id: 'button-tsx', name: 'Button.tsx', type: 'file' },
                  { id: 'card-tsx', name: 'Card.tsx', type: 'file' },
                  { id: 'text-tsx', name: 'Text.tsx', type: 'file' },
                ],
              },
            ],
          },
          {
            id: 'astryx-cli',
            name: 'cli',
            type: 'folder',
            children: [{ id: 'cli-index', name: 'index.ts', type: 'file' }],
          },
        ],
      },
      {
        id: 'astryx-apps',
        name: 'apps',
        type: 'folder',
        children: [
          {
            id: 'storybook',
            name: 'storybook',
            type: 'folder',
            children: [
              {
                id: 'sb-config',
                name: '.storybook',
                type: 'folder',
                children: [],
              },
            ],
          },
          {
            id: 'sandbox-app',
            name: 'sandbox',
            type: 'folder',
            children: [
              {
                id: 'sandbox-src',
                name: 'src',
                type: 'folder',
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
]

const viewMode = ref('column')
const selectedPath = ref<string[]>(['applications', 'chrome-apps', 'component-lab'])

function findItem(items: FileSystemItem[], id: string): FileSystemItem | null {
  for (const item of items) {
    if (item.id === id)
      return item
    if (item.children) {
      const found = findItem(item.children, id)
      if (found)
        return found
    }
  }
  return null
}

function getFileExtension(name: string): string {
  const dot = name.lastIndexOf('.')
  return dot > 0 ? name.substring(dot + 1).toUpperCase() : 'File'
}

const columns = computed(() => {
  const cols: { items: FileSystemItem[], selectedId: string | null }[] = []
  cols.push({ items: FILESYSTEM, selectedId: selectedPath.value[0] ?? null })
  let currentItems: FileSystemItem[] = FILESYSTEM
  for (let i = 0; i < selectedPath.value.length; i++) {
    const selected = currentItems.find(item => item.id === selectedPath.value[i])
    if (selected?.children && selected.children.length > 0) {
      cols.push({
        items: selected.children,
        selectedId: selectedPath.value[i + 1] ?? null,
      })
      currentItems = selected.children
    }
    else {
      break
    }
  }
  return cols
})

const currentFolderName = computed(() => {
  if (selectedPath.value.length === 0)
    return 'Home'
  const lastId = selectedPath.value[selectedPath.value.length - 1]
  const item = findItem(FILESYSTEM, lastId)
  if (item?.type === 'folder')
    return item.name
  if (selectedPath.value.length >= 2) {
    const parent = findItem(FILESYSTEM, selectedPath.value[selectedPath.value.length - 2])
    return parent?.name ?? 'Home'
  }
  return 'Home'
})

const selectedFile = computed(() => {
  if (selectedPath.value.length === 0)
    return null
  const lastId = selectedPath.value[selectedPath.value.length - 1]
  const item = findItem(FILESYSTEM, lastId)
  return item?.type === 'file' ? item : null
})

function handleSelect(columnIndex: number, itemId: string): void {
  selectedPath.value = [...selectedPath.value.slice(0, columnIndex), itemId]
}

function goBack(): void {
  if (selectedPath.value.length > 0)
    selectedPath.value = selectedPath.value.slice(0, -1)
}
</script>

<template>
  <Layout class="page" height="fill">
    <template #header>
      <Toolbar label="File Explorer" size="sm" :dividers="['bottom']">
        <template #start>
          <IconButton
            variant="ghost"
            size="sm"
            label="Go back"
            :is-disabled="selectedPath.length === 0"
            @click="goBack"
          >
            <Icon icon="i-heroicons-chevron-left" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="Go forward" is-disabled>
            <Icon icon="i-heroicons-chevron-right" size="sm" />
          </IconButton>
          <Text type="label">
            {{ currentFolderName }}
          </Text>
        </template>
        <template #center>
          <SegmentedControl v-model="viewMode" label="View mode">
            <SegmentedControlItem value="grid" label="Grid" is-label-hidden>
              <template #icon>
                <Icon icon="i-heroicons-squares-2x2" size="sm" />
              </template>
            </SegmentedControlItem>
            <SegmentedControlItem value="list" label="List" is-label-hidden>
              <template #icon>
                <Icon icon="i-heroicons-bars-4" size="sm" />
              </template>
            </SegmentedControlItem>
            <SegmentedControlItem value="column" label="Column" is-label-hidden>
              <template #icon>
                <Icon icon="i-heroicons-view-columns" size="sm" />
              </template>
            </SegmentedControlItem>
            <SegmentedControlItem value="gallery" label="Gallery" is-label-hidden>
              <template #icon>
                <Icon icon="i-heroicons-table-cells" size="sm" />
              </template>
            </SegmentedControlItem>
          </SegmentedControl>
        </template>
        <template #end>
          <IconButton variant="ghost" size="sm" label="Group">
            <Icon icon="i-heroicons-adjustments-horizontal" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="Share">
            <Icon icon="i-heroicons-share" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="Tags">
            <Icon icon="i-heroicons-tag" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="More">
            <Icon icon="i-heroicons-ellipsis-horizontal" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="Search">
            <Icon icon="i-heroicons-magnifying-glass" size="sm" />
          </IconButton>
        </template>
      </Toolbar>
    </template>

    <LayoutContent :padding="0" :is-scrollable="false">
      <HStack class="column-row" height="100%">
        <Section
          v-for="(col, colIndex) in columns"
          :key="colIndex"
          :width="240"
          :padding="2"
          variant="transparent"
          :dividers="colIndex < columns.length - 1 || selectedFile != null ? ['end'] : undefined"
          class="scrollable fixed-column"
        >
          <List density="compact" :has-dividers="false">
            <ListItem
              v-for="item in col.items"
              :key="item.id"
              :label="item.name"
              :is-selected="col.selectedId === item.id"
              :on-click="() => handleSelect(colIndex, item.id)"
            >
              <template #startContent>
                <Icon
                  :icon="item.type === 'folder' ? 'i-heroicons-folder-solid' : 'i-heroicons-document'"
                  :color="item.type === 'folder' ? 'accent' : 'secondary'"
                  size="sm"
                />
              </template>
              <template
                v-if="item.type === 'folder' && item.children != null && item.children.length > 0"
                #endContent
              >
                <Icon icon="i-heroicons-chevron-right" size="xsm" color="secondary" />
              </template>
            </ListItem>
          </List>
        </Section>

        <Section
          v-if="selectedFile"
          :padding="6"
          variant="transparent"
          class="scrollable detail-column"
        >
          <VStack :gap="4" justify="center">
            <Avatar :name="selectedFile.name" :size="96" />
            <VStack :gap="1" justify="center">
              <Text type="label">
                {{ selectedFile.name }}
              </Text>
              <Text type="supporting">
                {{ getFileExtension(selectedFile.name) }} Document
              </Text>
            </VStack>
            <MetadataList title="Information">
              <MetadataListItem label="Created">
                March 28, 2026 at 2:15 PM
              </MetadataListItem>
              <MetadataListItem label="Modified">
                Yesterday, 10:27 PM
              </MetadataListItem>
              <MetadataListItem label="Kind">
                {{ getFileExtension(selectedFile.name) }} Document
              </MetadataListItem>
            </MetadataList>
          </VStack>
        </Section>
      </HStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.page {
  height: 100dvh;
}

.column-row {
  overflow-x: auto;
  overflow-y: hidden;
}

.scrollable {
  overflow-y: auto;
}

.fixed-column {
  flex-shrink: 0;
}

.detail-column {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 320px;
}
</style>
