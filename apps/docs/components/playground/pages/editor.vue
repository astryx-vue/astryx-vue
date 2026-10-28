<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
  Button,
  Card,
  Center,
  Dialog,
  Divider,
  EmptyState,
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
  Section,
  SegmentedControl,
  SegmentedControlItem,
  Selector,
  Spinner,
  Tab,
  TabList,
  Table,
  Text,
  TextArea,
  TextInput,
  Toolbar,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

type BlockType = 'hero' | 'text' | 'image' | 'button' | 'cards' | 'features' | 'cta'
type ViewportSize = 'desktop' | 'tablet' | 'phone'
type SidebarTab = 'blocks' | 'properties'

interface Block {
  id: string
  type: BlockType
  label: string
  props: Record<string, unknown>
}

type Transaction = {
  id: string
  name: string
  category: string
  date: string
  amount: string
  isPositive?: boolean
}

const BLOCK_META: Record<BlockType, { label: string, icon: string }> = {
  hero: { label: 'Hero', icon: 'i-carbon-grid' },
  text: { label: 'Text', icon: 'i-carbon-document' },
  image: { label: 'Image', icon: 'i-carbon-image' },
  button: { label: 'Button', icon: 'i-carbon-cursor-1' },
  cards: { label: 'Cards', icon: 'i-carbon-column' },
  features: { label: 'Features', icon: 'i-carbon-star' },
  cta: { label: 'CTA', icon: 'i-carbon-megaphone' },
}

const CATEGORY_ICONS: Record<string, string> = {
  'Food & Drink': 'i-carbon-shopping-bag',
  'Groceries': 'i-carbon-shopping-cart',
  'Income': 'i-carbon-money',
  'Transport': 'i-carbon-chat',
  'Entertainment': 'i-carbon-play',
}

const VIEWPORT_MAX: Record<ViewportSize, number> = {
  desktop: 960,
  tablet: 768,
  phone: 375,
}

let nextId = 5
function uid() {
  return String(nextId++)
}

const DEFAULT_BLOCKS: Block[] = [
  {
    id: '2',
    type: 'features',
    label: 'Recent Transactions',
    props: {
      heading: 'Recent Transactions',
      description: 'Your latest account activity.',
      items: [
        { id: 't1', name: 'Blue Bottle Coffee', category: 'Food & Drink', date: 'Today, 10:24 AM', amount: '-$6.50' },
        { id: 't2', name: 'Whole Foods Market', category: 'Groceries', date: 'Yesterday', amount: '-$142.30' },
        { id: 't3', name: 'Stripe Payout', category: 'Income', date: 'Oct 12', amount: '+$4,200.00', isPositive: true },
        { id: 't4', name: 'Uber Technologies', category: 'Transport', date: 'Oct 11', amount: '-$24.10' },
        { id: 't5', name: 'Netflix Subscription', category: 'Entertainment', date: 'Oct 10', amount: '-$19.99' },
      ],
    },
  },
  {
    id: '3',
    type: 'text',
    label: 'Syncing State',
    props: {
      heading: 'Syncing your accounts',
      description: 'We\'re pulling in your latest transactions.\nThis usually takes a few seconds.',
      buttonLabel: 'Cancel',
    },
  },
  {
    id: '4',
    type: 'cta',
    label: 'Trust Notice',
    props: {
      heading: 'Adding devices from people you trust',
      description: 'When you approve a request, you grant someone full access to your account. They\'ll be able to change reservations and send messages on your behalf.',
    },
  },
]

/** 新增区块的初始属性，按类型给一份说得过去的默认值。 */
function defaultProps(type: BlockType): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return { heading: 'New Hero', subheading: 'Subtitle goes here', buttonLabel: 'Click Me', alignment: 'center' }
    case 'text':
      return { content: 'Enter your text here.' }
    case 'image':
      return {}
    case 'button':
      return { label: 'Button', variant: 'primary', size: 'md' }
    case 'cards':
      return {
        cards: [
          { title: 'Pricing', description: 'Flexible plans for every team size.' },
          { title: 'Support', description: 'Get help whenever you need it.' },
        ],
      }
    case 'features':
      return {
        heading: 'Activity',
        description: '',
        items: [{ id: 't1', name: 'New Item', category: 'General', date: 'Today', amount: '$0.00' }],
      }
    case 'cta':
      return { heading: 'Call to Action', description: 'Description text', primaryLabel: 'Primary', secondaryLabel: 'Secondary' }
  }
}

const ALIGNMENTS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]
const VARIANTS = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Ghost', value: 'ghost' },
]
const SIZES = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
]

const isMobile = useMediaQuery('(max-width: 768px)')

const blocks = ref<Block[]>([...DEFAULT_BLOCKS])
const selectedId = ref<string | null>(null)
const pageTitle = ref('Page Editor')
const isEditingTitle = ref(false)
const viewport = ref<ViewportSize>('desktop')
const sidebarTab = ref<SidebarTab>('blocks')
const isCustomizeOpen = ref(false)

const selectedBlock = computed(() => blocks.value.find(b => b.id === selectedId.value) ?? null)

const canvasStyle = computed(() => ({
  maxWidth: `${VIEWPORT_MAX[viewport.value]}px`,
  width: '100%',
  marginInline: 'auto',
}))

const transactionColumns: TableColumn<Transaction>[] = [
  {
    key: 'name',
    header: 'Transaction',
    renderCell: item => h(HStack, { gap: 3, align: 'center' }, () => [
      h(Icon, { icon: CATEGORY_ICONS[item.category] ?? 'i-carbon-star' }),
      h(VStack, { gap: 0 }, () => [
        h(Text, { type: 'label', weight: 'semibold' }, () => item.name),
        h(Text, { type: 'supporting', color: 'secondary' }, () => item.category),
      ]),
    ]),
  },
  {
    key: 'date',
    header: 'Date',
    renderCell: item => h(Text, { type: 'body', color: 'secondary' }, () => item.date),
  },
  {
    key: 'amount',
    header: 'Amount',
    renderCell: item => h(Text, { type: 'label', weight: 'semibold', hasTabularNumbers: true }, () => item.amount),
  },
  {
    key: 'actions',
    header: '',
    renderCell: () => h(Button, { label: 'More', variant: 'ghost', size: 'sm', isIconOnly: true }, () => h(Icon, { icon: 'i-carbon-overflow-menu-horizontal', size: 'sm' })),
  },
]

function selectBlock(id: string) {
  selectedId.value = id
}

function addBlock(rawType: string) {
  const type = rawType as BlockType
  const block: Block = { id: uid(), type, label: BLOCK_META[type].label, props: defaultProps(type) }
  blocks.value = [...blocks.value, block]
  selectedId.value = block.id
}

function updateBlockProp(key: string, value: unknown) {
  if (!selectedBlock.value)
    return
  const target = selectedBlock.value.id
  blocks.value = blocks.value.map(b => (b.id === target ? { ...b, props: { ...b.props, [key]: value } } : b))
}

/** 在图层里上下移动一格，越界的调用直接忽略。 */
function moveBlock(id: string, delta: number) {
  const index = blocks.value.findIndex(b => b.id === id)
  const next = index + delta
  if (index < 0 || next < 0 || next >= blocks.value.length)
    return
  const copy = [...blocks.value]
  const [moved] = copy.splice(index, 1)
  copy.splice(next, 0, moved)
  blocks.value = copy
}

function setSidebarTab(value: string) {
  sidebarTab.value = value as SidebarTab
}

/** 区块属性里的列表按渲染需要取出来，模板里就不用写类型断言。 */
function itemsOf(block: Block) {
  return (block.props.items as Transaction[]) ?? []
}

function cardsOf(block: Block) {
  return (block.props.cards as { title: string, description: string }[]) ?? []
}

function buttonVariantOf(block: Block) {
  return (block.props.variant as 'primary' | 'secondary' | 'ghost') ?? 'primary'
}

function buttonSizeOf(block: Block) {
  return (block.props.size as 'sm' | 'md' | 'lg') ?? 'md'
}

function deleteBlock(id: string) {
  blocks.value = blocks.value.filter(b => b.id !== id)
  if (selectedId.value === id)
    selectedId.value = blocks.value[0]?.id ?? null
}
</script>

<template>
  <Layout class="page" height="fill">
    <template v-if="isMobile" #header>
      <LayoutPanel :has-divider="false" :padding="0" class="mobile-sidebar">
        <Section variant="transparent" :padding="4">
          <HStack :gap="3" align="center" justify="between">
            <Heading :level="2">
              {{ pageTitle }}
            </Heading>
            <HStack :gap="2" align="center">
              <Button label="Edit" variant="ghost" is-icon-only @click="isCustomizeOpen = true">
                <template #icon>
                  <Icon icon="i-carbon-settings-adjust" size="sm" />
                </template>
              </Button>
              <Button label="Publish" variant="primary" />
            </HStack>
          </HStack>
        </Section>
      </LayoutPanel>
    </template>

    <template v-if="!isMobile" #start>
      <LayoutPanel :has-divider="true" :padding="0" class="sidebar-panel">
        <VStack :gap="4">
          <Section variant="transparent" :padding="4">
            <VStack :gap="4">
              <TextInput
                v-if="isEditingTitle"
                v-model="pageTitle"
                label="Page title"
                is-label-hidden
                has-auto-focus
                @blur="isEditingTitle = false"
                @keydown.enter="isEditingTitle = false"
              />
              <Heading v-else :level="2" class="clickable" @click="isEditingTitle = true">
                {{ pageTitle }}
              </Heading>
              <Toolbar label="Viewport and actions">
                <template #start>
                  <SegmentedControl v-model="viewport" label="Viewport size">
                    <SegmentedControlItem value="desktop" label="Desktop" is-label-hidden>
                      <template #icon>
                        <Icon icon="i-carbon-laptop" size="sm" />
                      </template>
                    </SegmentedControlItem>
                    <SegmentedControlItem value="tablet" label="Tablet" is-label-hidden>
                      <template #icon>
                        <Icon icon="i-carbon-tablet" size="sm" />
                      </template>
                    </SegmentedControlItem>
                    <SegmentedControlItem value="phone" label="Phone" is-label-hidden>
                      <template #icon>
                        <Icon icon="i-carbon-mobile" size="sm" />
                      </template>
                    </SegmentedControlItem>
                  </SegmentedControl>
                </template>
                <template #end>
                  <HStack :gap="2">
                    <Button label="Preview" variant="ghost" is-icon-only>
                      <template #icon>
                        <Icon icon="i-carbon-view" size="sm" />
                      </template>
                    </Button>
                    <Button label="Publish" variant="primary" />
                  </HStack>
                </template>
              </Toolbar>
            </VStack>
          </Section>

          <VStack :gap="0">
            <TabList layout="fill" :value="sidebarTab" @update:value="setSidebarTab($event)">
              <Tab value="blocks" label="Blocks" />
              <Tab value="properties" label="Properties" />
            </TabList>
            <Divider />
          </VStack>

          <Section variant="transparent" :padding="4">
            <VStack v-if="sidebarTab === 'blocks'" :gap="4">
              <VStack :gap="1">
                <Heading :level="4">
                  Add Block
                </Heading>
                <List density="balanced">
                  <ListItem
                    v-for="(meta, type) in BLOCK_META"
                    :key="type"
                    :label="meta.label"
                    @click="addBlock(String(type))"
                  >
                    <template #startContent>
                      <Icon :icon="meta.icon" color="secondary" />
                    </template>
                  </ListItem>
                </List>
              </VStack>

              <VStack :gap="1">
                <Heading :level="4">
                  Layers
                </Heading>
                <List density="balanced">
                  <ListItem
                    v-for="block in blocks"
                    :key="block.id"
                    :label="block.label"
                    :is-selected="block.id === selectedId"
                    @click="selectBlock(block.id)"
                  >
                    <template #startContent>
                      <Icon :icon="BLOCK_META[block.type].icon" color="secondary" />
                    </template>
                    <template #endContent>
                      <HStack :gap="1">
                        <Button label="Move up" variant="ghost" size="sm" is-icon-only @click="moveBlock(block.id, -1)">
                          <template #icon>
                            <Icon icon="i-carbon-chevron-up" size="sm" />
                          </template>
                        </Button>
                        <Button label="Move down" variant="ghost" size="sm" is-icon-only @click="moveBlock(block.id, 1)">
                          <template #icon>
                            <Icon icon="i-carbon-chevron-down" size="sm" />
                          </template>
                        </Button>
                        <Button label="Delete" variant="ghost" size="sm" is-icon-only @click="deleteBlock(block.id)">
                          <template #icon>
                            <Icon icon="i-carbon-trash-can" size="sm" />
                          </template>
                        </Button>
                      </HStack>
                    </template>
                  </ListItem>
                </List>
              </VStack>
            </VStack>

            <template v-else-if="selectedBlock">
              <VStack :gap="4">
                <template v-if="selectedBlock.type === 'hero'">
                  <TextInput
                    :model-value="String(selectedBlock.props.heading ?? '')"
                    label="Heading"
                    @update:model-value="updateBlockProp('heading', $event)"
                  />
                  <TextArea
                    :model-value="String(selectedBlock.props.subheading ?? '')"
                    label="Subheading"
                    @update:model-value="updateBlockProp('subheading', $event)"
                  />
                  <TextInput
                    :model-value="String(selectedBlock.props.buttonLabel ?? '')"
                    label="Button Label"
                    @update:model-value="updateBlockProp('buttonLabel', $event)"
                  />
                  <Selector
                    :model-value="String(selectedBlock.props.alignment ?? 'center')"
                    label="Alignment"
                    :options="ALIGNMENTS"
                    @update:model-value="updateBlockProp('alignment', $event)"
                  />
                </template>
                <template v-else-if="selectedBlock.type === 'text'">
                  <TextInput
                    :model-value="String(selectedBlock.props.heading ?? '')"
                    label="Heading"
                    @update:model-value="updateBlockProp('heading', $event)"
                  />
                  <TextArea
                    :model-value="String(selectedBlock.props.description ?? '')"
                    label="Description"
                    @update:model-value="updateBlockProp('description', $event)"
                  />
                  <TextInput
                    :model-value="String(selectedBlock.props.buttonLabel ?? '')"
                    label="Button Label"
                    @update:model-value="updateBlockProp('buttonLabel', $event)"
                  />
                </template>
                <template v-else-if="selectedBlock.type === 'button'">
                  <TextInput
                    :model-value="String(selectedBlock.props.label ?? '')"
                    label="Label"
                    @update:model-value="updateBlockProp('label', $event)"
                  />
                  <Selector
                    :model-value="String(selectedBlock.props.variant ?? 'primary')"
                    label="Variant"
                    :options="VARIANTS"
                    @update:model-value="updateBlockProp('variant', $event)"
                  />
                  <Selector
                    :model-value="String(selectedBlock.props.size ?? 'md')"
                    label="Size"
                    :options="SIZES"
                    @update:model-value="updateBlockProp('size', $event)"
                  />
                </template>
                <template v-else-if="selectedBlock.type === 'features' || selectedBlock.type === 'cta'">
                  <TextInput
                    :model-value="String(selectedBlock.props.heading ?? '')"
                    label="Heading"
                    @update:model-value="updateBlockProp('heading', $event)"
                  />
                  <TextArea
                    :model-value="String(selectedBlock.props.description ?? '')"
                    label="Description"
                    @update:model-value="updateBlockProp('description', $event)"
                  />
                </template>
                <EmptyState v-else title="No configurable properties" is-compact />
              </VStack>
            </template>
            <EmptyState
              v-else
              title="No block selected"
              description="Select a block to edit its properties"
              is-compact
            />
          </Section>
        </VStack>
      </LayoutPanel>
    </template>

    <LayoutContent :padding="8">
      <VStack :gap="4" :style="canvasStyle">
        <template v-if="blocks.length > 0">
          <Card
            v-for="block in blocks"
            :key="block.id"
            class="clickable"
            :class="{ 'selected-card': block.id === selectedId }"
            :padding="block.type === 'image' ? 0 : 6"
            @click="selectBlock(block.id)"
          >
            <VStack v-if="block.type === 'hero'" :gap="4">
              <Heading :level="2">
                {{ String(block.props.heading || 'Hero Heading') }}
              </Heading>
              <Text type="supporting" color="secondary">
                {{ String(block.props.subheading || 'Subtitle text goes here') }}
              </Text>
              <Button v-if="block.props.buttonLabel" :label="String(block.props.buttonLabel)" />
            </VStack>

            <template v-else-if="block.type === 'text'">
              <EmptyState
                v-if="block.props.heading"
                :title="String(block.props.heading)"
                :description="String(block.props.description ?? '')"
              >
                <template #icon>
                  <Spinner />
                </template>
                <template v-if="block.props.buttonLabel" #actions>
                  <Button :label="String(block.props.buttonLabel)" variant="secondary" />
                </template>
              </EmptyState>
              <Text v-else type="body">
                {{ String(block.props.content || 'Text content goes here') }}
              </Text>
            </template>

            <EmptyState
              v-else-if="block.type === 'image'"
              title="Image Block"
              description="Drop an image or enter a URL"
              is-compact
            >
              <template #icon>
                <Icon icon="i-carbon-image" />
              </template>
            </EmptyState>

            <Center v-else-if="block.type === 'button'" :padding="4">
              <Button
                :label="String(block.props.label ?? 'Button')"
                :variant="buttonVariantOf(block)"
                :size="buttonSizeOf(block)"
              />
            </Center>

            <Grid v-else-if="block.type === 'cards'" :columns="2" :gap="4">
              <Card v-for="card in cardsOf(block)" :key="card.title" :padding="4">
                <VStack :gap="1">
                  <Text type="label" weight="semibold">
                    {{ card.title }}
                  </Text>
                  <Text type="supporting" color="secondary">
                    {{ card.description }}
                  </Text>
                </VStack>
              </Card>
            </Grid>

            <VStack v-else-if="block.type === 'features'" :gap="3">
              <HStack :gap="3" align="center" justify="between">
                <VStack :gap="1">
                  <Heading :level="3">
                    {{ block.props.heading }}
                  </Heading>
                  <Text type="supporting" color="secondary">
                    {{ block.props.description }}
                  </Text>
                </VStack>
                <Button label="View All" variant="secondary" size="sm" />
              </HStack>
              <Table
                :data="itemsOf(block)"
                :columns="transactionColumns"
                id-key="id"
                dividers="rows"
              />
            </VStack>

            <HStack v-else-if="block.type === 'cta'" :gap="4" align="start">
              <Center class="icon-circle" :width="48" :height="48">
                <Icon icon="i-carbon-locked" size="sm" />
              </Center>
              <VStack :gap="2">
                <Heading :level="4">
                  {{ block.props.heading }}
                </Heading>
                <Text type="supporting" color="secondary">
                  {{ block.props.description }}
                </Text>
              </VStack>
            </HStack>
          </Card>
        </template>
        <EmptyState
          v-else
          title="No blocks yet"
          description="Add blocks from the sidebar to start building your page"
        >
          <template #icon>
            <Icon icon="i-carbon-add-alt" />
          </template>
        </EmptyState>
      </VStack>
    </LayoutContent>
  </Layout>

  <Dialog
    :is-open="isMobile && isCustomizeOpen"
    variant="fullscreen"
    purpose="info"
    :padding="0"
    @update:is-open="isCustomizeOpen = $event"
  >
    <Layout height="fill">
      <template #header>
        <LayoutHeader has-divider>
          <HStack :gap="3" align="center" justify="between">
            <Heading :level="3">
              Customize
            </Heading>
            <Button label="Close" variant="ghost" is-icon-only @click="isCustomizeOpen = false">
              <template #icon>
                <Icon icon="i-carbon-close" size="sm" />
              </template>
            </Button>
          </HStack>
        </LayoutHeader>
      </template>
      <LayoutContent :padding="0">
        <Section :padding="4">
          <Text>
            Block library and properties
          </Text>
        </Section>
      </LayoutContent>
    </Layout>
  </Dialog>
</template>

<style scoped>
.page {
  height: 100dvh;
}

.sidebar-panel {
  width: 320px;
  flex-shrink: 0;
}

.mobile-sidebar {
  width: 100%;
}

.clickable {
  cursor: pointer;
}

.selected-card {
  outline: 2px solid var(--astryx-color-border-blue);
  outline-offset: -2px;
}

.icon-circle {
  border-radius: 50%;
  background-color: var(--astryx-color-background-muted);
}
</style>
