<script setup lang="ts">
import {
  Avatar,
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  Divider,
  DropdownMenu,
  EmptyState,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutPanel,
  Link,
  Markdown,
  pixel,
  proportional,
  Section,
  StackItem,
  Tab,
  TabList,
  Table,
  Text,
  TextInput,
  Token,
  Toolbar,
  useTableSortable,
  useTableSortableState,
  useTableTreeState,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

type EntryKind = 'folder' | 'typescript' | 'json' | 'yaml' | 'markdown' | 'text'

interface RepoEntry extends Record<string, unknown> {
  /** 完整路径，同时当父级链接和行标识用。 */
  id: string
  name: string
  kind: EntryKind
  /** 文件夹本身为空，`withRollups` 会把下面最新的一次提交抄上来。 */
  commitMessage: string
  /** 文件夹为 0，`withRollups` 取子项里最新的那个。 */
  committedAt: number
  children?: RepoEntry[]
}

const ROOT_NAME = 'canvas-editor'

/** 固定时钟：所有时间是相对它的偏移，任何环境里都显示同一句话。 */
const NOW = Date.UTC(2026, 8, 9, 16, 0)

const minutesAgo = (count: number): number => NOW - count * 60_000
const hoursAgo = (count: number): number => NOW - count * 3_600_000
const daysAgo = (count: number): number => NOW - count * 86_400_000

function file(path: string, kind: EntryKind, commitMessage: string, committedAt: number): RepoEntry {
  return { id: path, name: path.slice(path.lastIndexOf('/') + 1), kind, commitMessage, committedAt }
}

function folder(path: string, children: RepoEntry[]): RepoEntry {
  return { id: path, name: path.slice(path.lastIndexOf('/') + 1), kind: 'folder', commitMessage: '', committedAt: 0, children }
}

/** 搜索框起始位置的放大镜，供 `TextInput` 的 `startIcon` 使用。 */
function SearchIcon() {
  return h(Icon, { name: 'heroicons:magnifying-glass', size: 'sm' })
}
const REPO_TREE: RepoEntry[] = [
  folder('.github', [
    folder('.github/workflows', [
      file(
        '.github/workflows/ci.yml',
        'yaml',
        'ci: cache the pnpm store between runs (#412)',
        hoursAgo(3),
      ),
      file(
        '.github/workflows/release.yml',
        'yaml',
        'ci: publish npm provenance on tagged releases (#398)',
        daysAgo(12),
      ),
    ]),
    file(
      '.github/PULL_REQUEST_TEMPLATE.md',
      'markdown',
      'docs: ask for a repro link in bug reports (#377)',
      daysAgo(61),
    ),
  ]),
  folder('docs', [
    folder('docs/architecture', [
      file(
        'docs/architecture/rendering.md',
        'markdown',
        'docs: explain the dirty-rect redraw path (#405)',
        daysAgo(5),
      ),
      file(
        'docs/architecture/state.md',
        'markdown',
        'docs: describe undo stack ownership (#390)',
        daysAgo(21),
      ),
    ]),
    // The one nested README. GitHub renders whichever README sits in the
    // folder you are looking at, so this folder gets a preview and the others
    // get none — which is the behaviour worth showing.
    file(
      'docs/README.md',
      'markdown',
      'docs: add an index for the docs folder (#411)',
      daysAgo(3),
    ),
    file(
      'docs/contributing.md',
      'markdown',
      'docs: document the release checklist (#402)',
      daysAgo(8),
    ),
    file(
      'docs/getting-started.md',
      'markdown',
      'docs: add a first-plugin walkthrough (#369)',
      daysAgo(64),
    ),
  ]),
  folder('src', [
    folder('src/components', [
      // Three levels deep, so the header trail can outgrow the bar and the
      // collapse menu has something to collapse.
      folder('src/components/canvas', [
        file(
          'src/components/canvas/Canvas.tsx',
          'typescript',
          'fix: keep pointer capture through a drag (#417)',
          hoursAgo(2),
        ),
        file(
          'src/components/canvas/layers.ts',
          'typescript',
          'feat: let a group be locked without hiding it (#413)',
          hoursAgo(9),
        ),
        file(
          'src/components/canvas/pointer.ts',
          'typescript',
          'fix: release capture when the window blurs (#417)',
          hoursAgo(2),
        ),
      ]),
      file(
        'src/components/Inspector.tsx',
        'typescript',
        'feat: group the transform fields into one panel (#409)',
        daysAgo(4),
      ),
      file(
        'src/components/Toolbar.tsx',
        'typescript',
        'refactor: derive tool state from the store (#396)',
        daysAgo(14),
      ),
    ]),
    folder('src/lib', [
      file(
        'src/lib/geometry.ts',
        'typescript',
        'perf: stop reallocating the bounds buffer (#414)',
        hoursAgo(20),
      ),
      file(
        'src/lib/serialize.ts',
        'typescript',
        'fix: round-trip empty groups without loss (#401)',
        daysAgo(9),
      ),
      file(
        'src/lib/shapes.ts',
        'typescript',
        'feat: add polygon and star primitives (#411)',
        daysAgo(3),
      ),
    ]),
    file(
      'src/main.ts',
      'typescript',
      'chore: move bootstrap behind a feature flag (#415)',
      daysAgo(1),
    ),
    file(
      'src/ui.tsx',
      'typescript',
      'fix: restore focus after the modal closes (#407)',
      daysAgo(6),
    ),
  ]),
  folder('tests', [
    file(
      'tests/geometry.test.ts',
      'typescript',
      'test: cover degenerate bounding boxes (#414)',
      hoursAgo(20),
    ),
    file(
      'tests/serialize.test.ts',
      'typescript',
      'test: add a fixture for nested groups (#401)',
      daysAgo(9),
    ),
  ]),
  file(
    '.gitignore',
    'text',
    'chore: ignore local coverage output (#380)',
    daysAgo(49),
  ),
  file(
    'LICENSE',
    'text',
    'chore: bump the copyright year (#352)',
    daysAgo(243),
  ),
  file(
    'README.md',
    'markdown',
    'docs: rewrite the install section (#418)',
    minutesAgo(30),
  ),
  file('package.json', 'json', 'chore: bump vite to 6.2 (#416)', hoursAgo(18)),
  file(
    'tsconfig.json',
    'json',
    'build: turn on verbatimModuleSyntax (#393)',
    daysAgo(35),
  ),
];

/**
 * Give every folder the newest commit beneath it — message and date together,
 * taken from the same child so the two columns never describe different
 * commits. Runs bottom-up, so a folder always agrees with what is inside it.

// ============= README + 搜索 + 折叠辅助 =============

/** 目录给每个文件取它下面最新的那次提交，两列才不会各说各的。 */
function withRollups(nodes: RepoEntry[]): RepoEntry[] {
  return nodes.map((node) => {
    if (!node.children || node.children.length === 0)
      return node
    const children = withRollups(node.children)
    const newest = children.reduce((latest, child) => (child.committedAt > latest.committedAt ? child : latest))
    return { ...node, children, commitMessage: newest.commitMessage, committedAt: newest.committedAt }
  })
}

const ROLLED_UP = withRollups(REPO_TREE)
const DEFAULT_EXPANDED = ['src']

/** 搜索命中的判定，行和计数共用一套，两边不会各算各的。 */
function isMatch(node: RepoEntry, needle: string): boolean {
  return node.name.toLowerCase().includes(needle) || node.commitMessage.toLowerCase().includes(needle)
}

function countMatches(nodes: RepoEntry[], needle: string): number {
  return nodes.reduce(
    (total, node) => total + (isMatch(node, needle) ? 1 : 0) + (node.children ? countMatches(node.children, needle) : 0),
    0,
  )
}

/** 留下命中的行和它们的祖先，祖先只是路径。 */
function pruneTree(nodes: RepoEntry[], needle: string): RepoEntry[] {
  const out: RepoEntry[] = []
  for (const node of nodes) {
    const children = node.children ? pruneTree(node.children, needle) : []
    if (isMatch(node, needle) || children.length > 0)
      out.push(children.length > 0 ? { ...node, children } : node)
  }
  return out
}

function collectIds(nodes: RepoEntry[], into: Set<string>): Set<string> {
  for (const node of nodes) {
    if (node.children?.length) {
      into.add(node.id)
      collectIds(node.children, into)
    }
  }
  return into
}

/** 时间用固定时钟倒推，保证每台机器上都是「2 小时前」。 */
const relativeFormat = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

const AGE_UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 86_400_000],
  ['month', 30 * 86_400_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

function commitAge(epochMs: number): string {
  const elapsed = NOW - epochMs
  for (const [unit, size] of AGE_UNITS) {
    if (elapsed >= size || unit === 'minute')
      return relativeFormat.format(-Math.floor(elapsed / size), unit)
  }
  return 'just now'
}

/** 当前目录里有 README 才显示预览，表格和预览卡不会互相矛盾。 */
function readmeFor(folderId: string | null): string | null {
  let entries = REPO_TREE
  if (folderId != null) {
    for (const segment of folderId.split('/')) {
      const next: RepoEntry | undefined = entries.find(entry => entry.name === segment && entry.kind === 'folder')
      if (next?.children == null)
        return null
      entries = next.children
    }
  }
  const hasReadme = entries.some(entry => entry.kind !== 'folder' && /^readme\.md$/i.test(entry.name))
  return hasReadme ? (READMES[folderId ?? ''] ?? null) : null
}

// ============= 右侧栏文案 =============

const REPO_DESCRIPTION
  = 'A small, embeddable vector canvas. Draw shapes, group them, and serialise the result to JSON that round-trips without loss.'

const TOPICS = ['canvas', 'vector-graphics', 'typescript', 'editor', 'svg', '2d-graphics', 'wasm']

const ABOUT_LINKS = [
  { label: 'Readme', icon: 'heroicons:book-open' },
  { label: 'MIT license', icon: 'heroicons:scale' },
  { label: 'Code of conduct', icon: 'heroicons:shield-check' },
  { label: 'Security policy', icon: 'heroicons:shield-check' },
  { label: 'Activity', icon: 'heroicons:chart-bar' },
]

const STAT_ACTION: Record<string, string> = {
  stars: 'Star',
  watching: 'Watch',
  forks: 'Fork',
}

const REPO_STATS = [
  { label: 'stars', value: '12.6k', icon: 'heroicons:star' },
  { label: 'watching', value: '97', icon: 'heroicons:eye' },
  { label: 'forks', value: '1.3k', icon: 'carbon:fork' },
]

const REF_COUNTS = [
  { label: '171 Branches', icon: 'carbon:branch' },
  { label: '56 Tags', icon: 'heroicons:tag' },
]

const CONTRIBUTORS = [
  'Ada Okafor',
  'Bo Lindqvist',
  'Cass Moreau',
  'Dev Raman',
  'Elif Aydın',
  'Finn Ashworth',
  'Gia Petrova',
  'Hana Sato',
  'Ines Duarte',
  'Jo Mbeki',
  'Kit Nakamura',
  'Lena Voss',
]

const TAB_PLACEHOLDER = {
  conduct: 'The Contributor Covenant, version 2.1, applies to this project.',
  license: 'MIT. Do what you like, keep the notice, expect no warranty.',
  security: 'Report vulnerabilities privately through a security advisory.',
}

// ============= 状态 =============

const query = ref('')
const selectedFolderId = ref<string | null>(null)
const manualExpandedIds = ref<ReadonlySet<string>>(new Set(DEFAULT_EXPANDED))
const readmeTab = ref('readme')

const needle = computed(() => query.value.trim().toLowerCase())
const isSearching = computed(() => needle.value.length > 0)

const data = computed(() => (isSearching.value ? withRollups(pruneTree(ROLLED_UP, needle.value)) : ROLLED_UP))
const expandedIds = computed(() =>
  isSearching.value ? collectIds(data.value, new Set<string>()) : manualExpandedIds.value,
)

const { sort, sortConfig } = useTableSortableState<RepoEntry>({ data: () => data.value })

const SIBLING_COMPARATORS: Record<string, (a: RepoEntry, b: RepoEntry) => number> = {
  name: (a, b) => Number(b.kind === 'folder') - Number(a.kind === 'folder') || a.name.localeCompare(b.name),
  message: (a, b) => a.commitMessage.localeCompare(b.commitMessage),
  committed: (a, b) => a.committedAt - b.committedAt,
}

/** 只排同一层的兄弟节点，文件夹的层级关系不会被排序打散。 */
function applySiblingSort(siblings: RepoEntry[]): RepoEntry[] {
  if (sort.value.length === 0)
    return siblings
  const list = [...siblings]
  for (const entry of [...sort.value].reverse()) {
    const compare = SIBLING_COMPARATORS[entry.sortKey]
    if (compare == null)
      continue
    const direction = entry.direction === 'descending' ? -1 : 1
    list.sort((a, b) => compare(a, b) * direction)
  }
  return list
}

const { visibleData, plugin: treePlugin } = useTableTreeState<RepoEntry>(() => ({
  data: data.value,
  idKey: 'id',
  childrenKey: 'children',
  expandedIds: expandedIds.value,
  onExpandedIdsChange: (ids) => {
    if (!isSearching.value)
      manualExpandedIds.value = ids
  },
  sortSiblings: applySiblingSort,
}))

const sortPlugin = useTableSortable<RepoEntry>(sortConfig)
const matchCount = computed(() => (isSearching.value ? countMatches(ROLLED_UP, needle.value) : 0))
const readme = computed(() => readmeFor(selectedFolderId.value))
const hasRepoTabs = computed(() => selectedFolderId.value == null)
const activeTab = computed(() => (hasRepoTabs.value ? readmeTab.value : 'readme'))

const crumbs = computed(() => {
  const segments = selectedFolderId.value?.split('/') ?? []
  return [
    { label: ROOT_NAME, id: null as string | null },
    ...segments.map((segment, index) => ({ label: segment, id: segments.slice(0, index + 1).join('/') })),
  ]
})

function selectFolder(id: string): void {
  selectedFolderId.value = id
  const next = new Set(manualExpandedIds.value)
  next.add(id)
  manualExpandedIds.value = next
}

const columns: TableColumn<RepoEntry>[] = [
  {
    key: 'name',
    header: 'Name',
    width: proportional(2, { minWidth: 240 }),
    sortable: true,
    renderCell: entry => h(HStack, { gap: 2, vAlign: 'center' }, () => [
      h(Icon, {
        name: entry.kind === 'folder' ? 'heroicons:folder' : 'heroicons:document',
        size: 'sm',
        color: entry.kind === 'folder' ? 'accent' : 'secondary',
      }),
      entry.kind === 'folder'
        ? h(Link, {
          href: '#',
          onClick: (event: Event) => {
            event.preventDefault()
            selectFolder(entry.id)
          },
        }, () => entry.name)
        : h(Link, { href: '#' }, () => entry.name),
    ]),
  },
  {
    key: 'message',
    header: 'Last commit message',
    width: proportional(3, { minWidth: 200 }),
    sortable: true,
    renderCell: entry => h(Text, { color: 'secondary', maxLines: 1 }, () => entry.commitMessage),
  },
  {
    key: 'committed',
    header: 'Last commit date',
    width: pixel(160),
    align: 'end',
    sortable: true,
    renderCell: entry => h(Text, { color: 'secondary' }, () => commitAge(entry.committedAt)),
  },
]

const branchItems = [
  { label: 'main', onClick: () => {} },
  { label: 'next', onClick: () => {} },
  { type: 'divider' as const },
  { label: 'View all branches', onClick: () => {} },
]

const addFileItems = [
  { label: 'Create new file', onClick: () => {} },
  { label: 'Upload files', onClick: () => {} },
]
const README = `## canvas-editor

A small, embeddable vector canvas. Draw shapes, group them, and serialise the
result to JSON that round-trips without loss.

### Install

\`\`\`bash
npm install canvas-editor
\`\`\`

### Usage

\`\`\`ts
const {Canvas} = await import('canvas-editor');

const canvas = new Canvas(document.querySelector('#root'));
canvas.add({kind: 'rect', x: 0, y: 0, width: 120, height: 80});
\`\`\`

### Status

| Area        | State    | Notes                                  |
| ----------- | -------- | -------------------------------------- |
| Rendering   | Stable   | Dirty-rect redraw, no full repaints    |
| Serialising | Stable   | Round-trips groups and nested shapes   |
| Plugins     | Beta     | API may change before 1.0              |

### Contributing

Read [the contributing guide](#) first. In short:

- One change per pull request, with a test that fails without it.
- Run \`npm test\` before pushing.
- Conventional commits — the changelog is generated from them.

> Issues tagged \`good first issue\` are a reasonable place to start.
`;

const DOCS_README = `## Documentation

How the canvas is put together, and how to work on it.

### Start here

- **getting-started.md** — install the package and draw your first shape.
- **contributing.md** — branch naming, the release checklist, how to get review.

### Architecture

The \`architecture/\` folder covers the parts that are hard to infer from the
source: how the dirty-rect redraw path decides what to repaint, and who owns
the undo stack.
`;

/*
 * Which folders have a README to show. Keyed by folder id, with the empty
 * string standing for the repo root.
 *
 * Whether a preview appears is decided by the tree, not by this map — a
 * folder shows one only if it actually contains a README file. This just
 * supplies the body for the folders that do, so the two cannot disagree
 * about which folders have one.
 */
const READMES: Record<string, string> = {
  '': README,
  docs: DOCS_README,
};
</script>

<template>
  <Layout height="auto" :content-width="1440">
    <template #header>
      <Toolbar label="Repository" size="sm" :dividers="['bottom']">
        <template #start>
          <HStack :gap="2" align="center">
            <Heading :level="1" class="repo-visually-hidden">
              {{ ROOT_NAME }}
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
        <template #end>
          <Button
            v-for="stat in REPO_STATS"
            :key="stat.label"
            size="sm"
            :label="STAT_ACTION[stat.label]"
          >
            <template #icon>
              <Icon :name="stat.icon" size="sm" />
            </template>
            <template #end>
              <Badge :label="stat.value" />
            </template>
          </Button>
        </template>
      </Toolbar>
    </template>

    <LayoutContent :padding="4">
      <EmptyState
        v-if="data.length === 0"
        title="No matching files"
        description="No file or folder in this project matches your search."
      >
        <template #actions>
          <Button label="Clear search" variant="secondary" @click="query = ''" />
        </template>
      </EmptyState>

      <VStack v-else :gap="6">
        <HStack :gap="2" align="center" wrap="wrap">
          <DropdownMenu has-chevron size="sm" :items="branchItems">
            <template #trigger="triggerProps">
              <Button v-bind="triggerProps" label="main" variant="secondary" size="sm">
                <template #icon>
                  <Icon name="carbon:branch" size="sm" />
                </template>
              </Button>
            </template>
          </DropdownMenu>
          <HStack :gap="1" align="center">
            <Button
              v-for="ref in REF_COUNTS"
              :key="ref.label"
              :label="ref.label"
              variant="ghost"
              size="sm"
            >
              <template #icon>
                <Icon :name="ref.icon" size="sm" />
              </template>
            </Button>
          </HStack>
          <StackItem size="fill">
            <HStack :gap="2" h-align="end" align="center">
              <Text v-if="isSearching && matchCount > 0" type="supporting" color="secondary">
                {{ matchCount }} {{ matchCount === 1 ? 'result' : 'results' }}
              </Text>
              <TextInput
                v-model="query"
                label="Go to file"
                is-label-hidden
                placeholder="Go to file"
                has-clear
                :start-icon="SearchIcon"
              />
              <DropdownMenu has-chevron size="sm" :items="addFileItems" :button="{ label: 'Add file', size: 'sm' }" />
              <Button label="Code" variant="primary" size="sm">
                <template #icon>
                  <Icon name="heroicons:code-bracket" size="sm" />
                </template>
              </Button>
            </HStack>
          </StackItem>
        </HStack>

        <Card :padding="0">
          <Table
            :data="visibleData"
            :columns="columns"
            id-key="id"
            density="compact"
            dividers="none"
            is-striped
            text-overflow="truncate"
            :plugins="{ tree: treePlugin, sort: sortPlugin }"
          />
        </Card>

        <Card v-if="readme != null" :padding="0">
          <Section variant="transparent" :padding="0" :padding-block-start="1">
            <TabList v-model:value="readmeTab" size="sm" has-divider>
              <Tab value="readme" label="Readme" />
              <template v-if="hasRepoTabs">
                <Tab value="conduct" label="Code of conduct" />
                <Tab value="license" label="MIT license" />
                <Tab value="security" label="Security" />
              </template>
            </TabList>
          </Section>
          <Section variant="transparent" :padding="6">
            <Markdown
              v-if="activeTab === 'readme'"
              :heading-level-start="2"
              content-align="center"
              :content="readme"
            />
            <Text v-else color="secondary">
              {{ TAB_PLACEHOLDER[activeTab as keyof typeof TAB_PLACEHOLDER] }}
            </Text>
          </Section>
        </Card>
      </VStack>
    </LayoutContent>

    <template #end>
      <LayoutPanel :width="296" :padding="4" :is-scrollable="false" role="complementary" label="About this repository">
        <VStack :gap="6">
          <VStack :gap="3">
            <Heading :level="3">
              About
            </Heading>
            <Text color="secondary">
              {{ REPO_DESCRIPTION }}
            </Text>
            <Link href="#" is-external-link>
              canvas-editor.dev
            </Link>
            <HStack :gap="1" wrap="wrap">
              <Token
                v-for="topic in TOPICS"
                :key="topic"
                size="sm"
                :label="topic"
                @click="() => {}"
              />
            </HStack>
            <VStack :gap="2">
              <HStack v-for="link in ABOUT_LINKS" :key="link.label" :gap="2" align="center">
                <Icon :name="link.icon" size="sm" color="secondary" />
                <Link href="#">
                  {{ link.label }}
                </Link>
              </HStack>
            </VStack>
            <VStack :gap="2">
              <HStack v-for="stat in REPO_STATS" :key="stat.label" :gap="2" align="center">
                <Icon :name="stat.icon" size="sm" color="secondary" />
                <Link href="#">
                  {{ stat.value }} {{ stat.label }}
                </Link>
              </HStack>
            </VStack>
          </VStack>

          <Divider />

          <VStack :gap="3">
            <Heading :level="3">
              Releases
            </Heading>
            <HStack :gap="2" align="center">
              <Icon name="heroicons:tag" size="sm" color="success" />
              <Text weight="bold">
                v2.4.0
              </Text>
              <Badge label="Latest" variant="success" />
            </HStack>
            <Text type="supporting" color="secondary">
              {{ commitAge(daysAgo(11)) }} · 36 releases
            </Text>
          </VStack>

          <Divider />

          <VStack :gap="3">
            <Heading :level="3">
              Contributors
            </Heading>
            <HStack :gap="1" wrap="wrap">
              <Avatar v-for="name in CONTRIBUTORS" :key="name" :name="name" :size="32" />
            </HStack>
            <Link href="#">
              + 61 contributors
            </Link>
          </VStack>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style>
.repo-visually-hidden {
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
