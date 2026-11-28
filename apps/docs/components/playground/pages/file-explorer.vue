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
  StackItem,
  Text,
  Toolbar,
  useToast,
  VisuallyHidden,
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

const showToast = useToast()
// Demo only: 这一页只展示分栏视图，切换视图和工具栏动作都只弹提示。
function demo(body: string, uniqueID: string) {
  showToast({ body, uniqueID })
}
function onViewChange(view: string) {
  demo(`Demo: the ${view} view would show here`, `view-${view}`)
}
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
  const cols: { name: string, items: FileSystemItem[], selectedId: string | null }[] = []
  cols.push({ name: 'Home', items: FILESYSTEM, selectedId: selectedPath.value[0] ?? null })
  let currentItems: FileSystemItem[] = FILESYSTEM
  for (let i = 0; i < selectedPath.value.length; i++) {
    const selected = currentItems.find(item => item.id === selectedPath.value[i])
    if (selected?.children && selected.children.length > 0) {
      cols.push({
        name: selected.name,
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
            <Icon class="mirror-rtl" name="heroicons:chevron-left" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="Go forward" is-disabled>
            <Icon class="mirror-rtl" name="heroicons:chevron-right" size="sm" />
          </IconButton>
          <Text type="label">
            {{ currentFolderName }}
          </Text>
        </template>
        <template #center>
          <SegmentedControl model-value="column" label="View mode" @change="onViewChange">
            <SegmentedControlItem value="grid" label="Grid" is-label-hidden>
              <template #icon>
                <Icon name="heroicons:squares-2x2" size="sm" />
              </template>
            </SegmentedControlItem>
            <SegmentedControlItem value="list" label="List" is-label-hidden>
              <template #icon>
                <Icon name="heroicons:bars-4" size="sm" />
              </template>
            </SegmentedControlItem>
            <SegmentedControlItem value="column" label="Column" is-label-hidden>
              <template #icon>
                <Icon name="heroicons:view-columns" size="sm" />
              </template>
            </SegmentedControlItem>
            <SegmentedControlItem value="gallery" label="Gallery" is-label-hidden>
              <template #icon>
                <Icon name="heroicons:table-cells" size="sm" />
              </template>
            </SegmentedControlItem>
          </SegmentedControl>
        </template>
        <template #end>
          <IconButton variant="ghost" size="sm" label="Group" @click="demo('Demo: grouping options would open here', 'group')">
            <Icon name="heroicons:adjustments-horizontal" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="Share" @click="demo('Demo: sharing would start here', 'share')">
            <Icon name="heroicons:share" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="Tags" @click="demo('Demo: tags for the selection would open here', 'tags')">
            <Icon name="heroicons:tag" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="More" @click="demo('Demo: more actions would open here', 'more')">
            <Icon name="heroicons:ellipsis-horizontal" size="sm" />
          </IconButton>
          <IconButton variant="ghost" size="sm" label="Search" @click="demo('Demo: search in this folder would open here', 'search')">
            <Icon name="heroicons:magnifying-glass" size="sm" />
          </IconButton>
        </template>
      </Toolbar>
    </template>

    <LayoutContent role="main" :padding="0" :is-scrollable="false">
      <VisuallyHidden as="h1">
        Files
      </VisuallyHidden>
      <HStack height="100%" is-scrollable>
        <StackItem
          v-for="(col, colIndex) in columns"
          :key="colIndex"
          is-scrollable
          :aria-label="col.name"
          class="fixed-column"
        >
          <Section
            :width="240"
            :height="'100%'"
            :padding="2"
            variant="transparent"
            :dividers="colIndex < columns.length - 1 || selectedFile != null ? ['end'] : undefined"
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
                    :name="item.type === 'folder' ? 'heroicons:folder-solid' : 'heroicons:document'"
                    :color="item.type === 'folder' ? 'accent' : 'secondary'"
                    size="sm"
                  />
                </template>
                <template
                  v-if="item.type === 'folder' && item.children != null && item.children.length > 0"
                  #endContent
                >
                  <Icon class="mirror-rtl" name="heroicons:chevron-right" size="xsm" color="secondary" />
                </template>
              </ListItem>
            </List>
          </Section>
        </StackItem>

        <StackItem v-if="selectedFile" size="fill" is-scrollable aria-label="Details" class="detail-column">
          <Section :padding="6" variant="transparent">
            <VStack :gap="4" h-align="center">
              <Avatar :name="selectedFile.name" :size="96" />
              <VStack :gap="1" h-align="center">
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
        </StackItem>
      </HStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.page {
  height: 100dvh;
}

:global([dir='rtl'] .mirror-rtl) {
  transform: scaleX(-1);
}

.fixed-column {
  flex-shrink: 0;
}

/* 详情栏填满一行剩下的宽度，但不窄过 320px；再窄整行横向滚动。 */
.detail-column {
  flex-shrink: 0;
  flex-basis: 320px;
}
</style>
