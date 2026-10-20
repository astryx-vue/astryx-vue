<script setup lang="ts">
import {
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutPanel,
  Link,
  Markdown,
  StackItem,
  pixel,
  proportional,
  Table,
  Text,
  TextInput,
  Toolbar,
  useTableSortable,
  useTableSortableState,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

interface RepoEntry extends Record<string, unknown> {
  id: string
  name: string
  kind: 'folder' | 'file'
  commitMessage: string
  committedAt: number
  depth: number
  hasChildren: boolean
  isExpanded: boolean
}

const NOW = Date.UTC(2026, 8, 9, 16, 0)

interface TreeNode {
  id: string
  name: string
  kind: 'folder' | 'file'
  commitMessage: string
  committedAt: number
  children?: TreeNode[]
}

const TREE: TreeNode[] = [
  {
    id: 'src',
    name: 'src',
    kind: 'folder',
    commitMessage: 'chore: move bootstrap behind a feature flag (#415)',
    committedAt: NOW - 86_400_000,
    children: [
      {
        id: 'src/components',
        name: 'components',
        kind: 'folder',
        commitMessage: 'fix: keep pointer capture through a drag (#417)',
        committedAt: NOW - 2 * 3_600_000,
        children: [
          { id: 'src/components/Canvas.tsx', name: 'Canvas.tsx', kind: 'file', commitMessage: 'fix: keep pointer capture through a drag (#417)', committedAt: NOW - 2 * 3_600_000 },
          { id: 'src/components/Toolbar.tsx', name: 'Toolbar.tsx', kind: 'file', commitMessage: 'refactor: derive tool state from the store (#396)', committedAt: NOW - 14 * 86_400_000 },
        ],
      },
      { id: 'src/main.ts', name: 'main.ts', kind: 'file', commitMessage: 'chore: move bootstrap behind a feature flag (#415)', committedAt: NOW - 86_400_000 },
    ],
  },
  {
    id: 'docs',
    name: 'docs',
    kind: 'folder',
    commitMessage: 'docs: add an index for the docs folder (#411)',
    committedAt: NOW - 3 * 86_400_000,
    children: [
      { id: 'docs/README.md', name: 'README.md', kind: 'file', commitMessage: 'docs: add an index for the docs folder (#411)', committedAt: NOW - 3 * 86_400_000 },
      { id: 'docs/getting-started.md', name: 'getting-started.md', kind: 'file', commitMessage: 'docs: add a first-plugin walkthrough (#369)', committedAt: NOW - 64 * 86_400_000 },
    ],
  },
  { id: 'README.md', name: 'README.md', kind: 'file', commitMessage: 'docs: rewrite the install section (#418)', committedAt: NOW - 30 * 60_000 },
  { id: 'package.json', name: 'package.json', kind: 'file', commitMessage: 'chore: bump vite to 6.2 (#416)', committedAt: NOW - 18 * 3_600_000 },
]

const README = `## canvas-editor

A small, embeddable vector canvas. Draw shapes, group them, and serialise the
result to JSON that round-trips without loss.

### Install

\`\`\`bash
npm install canvas-editor
\`\`\`
`

const relativeFormat = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

function commitAge(epochMs: number): string {
  const elapsed = NOW - epochMs
  const hour = 3_600_000
  if (elapsed < hour)
    return 'just now'
  if (elapsed < 24 * hour)
    return relativeFormat.format(-Math.floor(elapsed / hour), 'hour')
  return relativeFormat.format(-Math.floor(elapsed / (24 * hour)), 'day')
}

const expanded = ref<Set<string>>(new Set(['src', 'src/components']))
const query = ref('')
const selectedFolderId = ref<string | null>(null)

function flatten(nodes: TreeNode[], depth = 0, into: RepoEntry[] = []): RepoEntry[] {
  for (const node of nodes) {
    const hasChildren = Boolean(node.children?.length)
    const isExpanded = expanded.value.has(node.id)
    into.push({
      id: node.id,
      name: node.name,
      kind: node.kind,
      commitMessage: node.commitMessage,
      committedAt: node.committedAt,
      depth,
      hasChildren,
      isExpanded,
    })
    if (hasChildren && isExpanded)
      flatten(node.children!, depth + 1, into)
  }
  return into
}

function matches(node: TreeNode, needle: string): boolean {
  return node.name.toLowerCase().includes(needle) || node.commitMessage.toLowerCase().includes(needle)
}

function filterTree(nodes: TreeNode[], needle: string): TreeNode[] {
  if (!needle)
    return nodes
  const out: TreeNode[] = []
  for (const node of nodes) {
    const children = node.children ? filterTree(node.children, needle) : []
    if (matches(node, needle) || children.length) {
      out.push({ ...node, children: children.length ? children : node.children })
      if (children.length)
        expanded.value.add(node.id)
    }
  }
  return out
}

const visibleTree = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return needle ? filterTree(TREE, needle) : TREE
})

const rows = computed(() => flatten(visibleTree.value))

const columns: TableColumn<RepoEntry>[] = [
  {
    key: 'name',
    header: 'Name',
    width: proportional(2, { minWidth: 240 }),
    sortable: { compare: (a, b) => a.name.localeCompare(b.name) },
    renderCell: (entry) => {
      const indent = entry.depth * 20
      return h(HStack, { gap: 2, vAlign: 'center', style: { paddingInlineStart: `${indent}px` } }, () => [
        entry.hasChildren
          ? h(IconButton, {
            label: entry.isExpanded ? 'Collapse' : 'Expand',
            variant: 'ghost',
            size: 'sm',
            onClick: () => {
              const next = new Set(expanded.value)
              if (next.has(entry.id))
                next.delete(entry.id)
              else
                next.add(entry.id)
              expanded.value = next
            },
          }, () => h(Icon, { icon: entry.isExpanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right', size: 'sm' }))
          : h('span', { style: { width: '28px' } }),
        h(Icon, { icon: entry.kind === 'folder' ? 'i-heroicons-folder' : 'i-heroicons-document', size: 'sm', color: entry.kind === 'folder' ? 'accent' : 'secondary' }),
        entry.kind === 'folder'
          ? h(Link, { href: '#', onClick: (e: Event) => { e.preventDefault(); selectedFolderId.value = entry.id } }, () => entry.name)
          : h(Text, {}, () => entry.name),
      ])
    },
  },
  {
    key: 'message',
    header: 'Last commit message',
    width: proportional(3, { minWidth: 200 }),
    sortable: { compare: (a, b) => a.commitMessage.localeCompare(b.commitMessage) },
    renderCell: entry => h(Text, { color: 'secondary' }, () => entry.commitMessage),
  },
  {
    key: 'committed',
    header: 'Last commit date',
    width: pixel(160),
    align: 'end',
    sortable: { compare: (a, b) => a.committedAt - b.committedAt },
    renderCell: entry => h(Text, { color: 'secondary' }, () => commitAge(entry.committedAt)),
  },
]

const { sortedData, sortConfig } = useTableSortableState({ data: rows, columns })
const sortPlugin = useTableSortable<RepoEntry>(sortConfig)

const crumbs = computed(() => {
  const segments = selectedFolderId.value?.split('/') ?? []
  return [
    { label: 'canvas-editor', id: null as string | null },
    ...segments.map((segment, index) => ({
      label: segment,
      id: segments.slice(0, index + 1).join('/'),
    })),
  ]
})
</script>

<template>
  <Layout height="auto" :content-width="1440">
    <template #header>
      <Toolbar label="Repository" size="sm" :dividers="['bottom']">
        <template #startContent>
          <HStack :gap="2" align="center">
            <Heading :level="1" class="visually-hidden">
              canvas-editor
            </Heading>
            <Breadcrumbs label="Folder path">
              <BreadcrumbItem
                v-for="(crumb, index) in crumbs"
                :key="crumb.id ?? 'root'"
                :is-current="index === crumbs.length - 1"
                @click="index < crumbs.length - 1 ? selectedFolderId = crumb.id : undefined"
              >
                {{ crumb.label }}
              </BreadcrumbItem>
            </Breadcrumbs>
            <Badge label="Public" variant="neutral" />
          </HStack>
        </template>
        <template #endContent>
          <Button label="Star" size="sm">
            <template #endContent>
              <Badge label="12.6k" />
            </template>
          </Button>
        </template>
      </Toolbar>
    </template>

    <LayoutContent :padding="4">
      <VStack :gap="6">
        <HStack :gap="2" align="center" wrap="wrap">
          <Button label="main" variant="secondary" size="sm">
            <template #icon>
              <Icon icon="i-heroicons-code-bracket" size="sm" />
            </template>
          </Button>
          <StackItem size="fill">
            <TextInput v-model="query" label="Go to file" is-label-hidden placeholder="Go to file" has-clear />
          </StackItem>
          <Button label="Code" variant="primary" />
        </HStack>

        <Card v-if="rows.length" :padding="0">
          <Table
            :data="sortedData"
            :columns="columns"
            id-key="id"
            density="compact"
            dividers="none"
            is-striped
            text-overflow="truncate"
            :plugins="{ sort: sortPlugin }"
          />
        </Card>
        <EmptyState
          v-else
          title="No matching files"
          description="No file or folder in this project matches your search."
        >
          <template #actions>
            <Button label="Clear search" variant="secondary" @click="query = ''" />
          </template>
        </EmptyState>

        <Card :padding="6">
          <Markdown :heading-level-start="2" content-align="center">
            {{ README }}
          </Markdown>
        </Card>
      </VStack>
    </LayoutContent>

    <template #end>
      <LayoutPanel :width="296" :padding="4" role="complementary" label="About this repository">
        <VStack :gap="4">
          <Heading :level="3">
            About
          </Heading>
          <Text color="secondary">
            A small, embeddable vector canvas. Draw shapes, group them, and serialise the result to JSON that round-trips without loss.
          </Text>
          <Link href="#" is-external-link>
            canvas-editor.dev
          </Link>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
