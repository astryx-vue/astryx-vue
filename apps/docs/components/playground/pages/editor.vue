<script setup lang="ts">
import {
  Button,
  Card,
  Center,
  Dialog,
  EmptyState,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  List,
  ListItem,
  SegmentedControl,
  Section,
  SegmentedControlItem,
  Spinner,
  Table,
  Text,
  TextArea,
  TextInput,
  Toolbar,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import type { TableColumn } from '@astryx-vue/core'
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

interface Transaction {
  id: string
  name: string
  category: string
  date: string
  amount: string
  isPositive?: boolean
}

const BLOCK_META: Record<BlockType, { label: string, icon: string }> = {
  hero: { label: 'Hero', icon: 'i-heroicons-squares-2x2' },
  text: { label: 'Text', icon: 'i-heroicons-document-text' },
  image: { label: 'Image', icon: 'i-heroicons-photo' },
  button: { label: 'Button', icon: 'i-heroicons-cursor-arrow-rays' },
  cards: { label: 'Cards', icon: 'i-heroicons-view-columns' },
  features: { label: 'Features', icon: 'i-heroicons-sparkles' },
  cta: { label: 'CTA', icon: 'i-heroicons-megaphone' },
}

const VIEWPORT_MAX: Record<ViewportSize, number> = {
  desktop: 960,
  tablet: 768,
  phone: 375,
}

let nextId = 5
function uid(): string {
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
      description: "We're pulling in your latest transactions.\nThis usually takes a few seconds.",
      buttonLabel: 'Cancel',
    },
  },
  {
    id: '4',
    type: 'cta',
    label: 'Trust Notice',
    props: {
      heading: 'Adding devices from people you trust',
      description: "When you approve a request, you grant someone full access to your account. They'll be able to change reservations and send messages on your behalf.",
    },
  },
]

const isMobile = useMediaQuery('(max-width: 768px)')
const blocks = ref<Block[]>([...DEFAULT_BLOCKS])
const selectedId = ref<string | null>(blocks.value[0]?.id ?? null)
const pageTitle = ref('Account overview')
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
    renderCell: (item: Transaction) => h(HStack, { gap: 3, vAlign: 'center' }, () => [
      h(Icon, { icon: 'i-heroicons-sparkles', size: 'sm' }),
      h(VStack, { gap: 0 }, () => [
        h(Text, { type: 'label', weight: 'semibold' }, () => item.name),
        h(Text, { type: 'supporting', color: 'secondary' }, () => item.category),
      ]),
    ]),
  },
  {
    key: 'date',
    header: 'Date',
    renderCell: (item: Transaction) => h(Text, { type: 'body', color: 'secondary' }, () => item.date),
  },
  {
    key: 'amount',
    header: 'Amount',
    renderCell: (item: Transaction) => h(Text, { type: 'label', weight: 'semibold', hasTabularNumbers: true }, () => item.amount),
  },
]

function selectBlock(id: string): void {
  selectedId.value = id
}

function addBlock(type: BlockType): void {
  const block: Block = {
    id: uid(),
    type,
    label: BLOCK_META[type].label,
    props: type === 'text' ? { content: 'Enter your text here.' } : {},
  }
  blocks.value = [...blocks.value, block]
  selectedId.value = block.id
}

function updateBlockProp(key: string, value: unknown): void {
  if (!selectedBlock.value)
    return
  blocks.value = blocks.value.map((b) => {
    if (b.id !== selectedBlock.value!.id)
      return b
    return { ...b, props: { ...b.props, [key]: value } }
  })
}
</script>

<template>
  <Layout class="page" height="fill">
    <template v-if="isMobile" #header>
      <LayoutPanel :has-divider="false" :padding="0" class="mobile-sidebar">
        <Section variant="transparent" :padding="4">
          <HStack :gap="3" v-align="center" h-align="between">
            <Heading :level="2">
              {{ pageTitle }}
            </Heading>
            <HStack :gap="2" v-align="center">
              <Button label="Edit" variant="ghost" is-icon-only @click="isCustomizeOpen = true">
                <template #icon>
                  <Icon icon="i-heroicons-adjustments-horizontal" size="sm" />
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
                        <Icon icon="i-heroicons-computer-desktop" size="sm" />
                      </template>
                    </SegmentedControlItem>
                    <SegmentedControlItem value="tablet" label="Tablet" is-label-hidden>
                      <template #icon>
                        <Icon icon="i-heroicons-device-tablet" size="sm" />
                      </template>
                    </SegmentedControlItem>
                    <SegmentedControlItem value="phone" label="Phone" is-label-hidden>
                      <template #icon>
                        <Icon icon="i-heroicons-device-phone-mobile" size="sm" />
                      </template>
                    </SegmentedControlItem>
                  </SegmentedControl>
                </template>
                <template #end>
                  <HStack :gap="2">
                    <Button label="Preview" variant="ghost" is-icon-only>
                      <template #icon>
                        <Icon icon="i-heroicons-eye" size="sm" />
                      </template>
                    </Button>
                    <Button label="Publish" variant="primary" />
                  </HStack>
                </template>
              </Toolbar>
            </VStack>
          </Section>

          <Section variant="transparent" :padding="4">
            <SegmentedControl v-model="sidebarTab" label="Sidebar" layout="fill" size="sm">
              <SegmentedControlItem value="blocks" label="Blocks" />
              <SegmentedControlItem value="properties" label="Properties" />
            </SegmentedControl>
            <template v-if="sidebarTab === 'blocks'">
              <List>
                <ListItem
                  v-for="(meta, type) in BLOCK_META"
                  :key="type"
                  :label="meta.label"
                  :on-click="() => addBlock(type as BlockType)"
                >
                  <template #startContent>
                    <Icon :icon="meta.icon" size="sm" />
                  </template>
                </ListItem>
              </List>
            </template>
            <template v-else-if="selectedBlock">
              <VStack :gap="3" class="properties-form">
                <TextInput
                  v-if="selectedBlock.type === 'text'"
                  :model-value="String(selectedBlock.props.heading ?? '')"
                  label="Heading"
                  @update:model-value="updateBlockProp('heading', $event)"
                />
                <TextArea
                  v-if="selectedBlock.type === 'text'"
                  :model-value="String(selectedBlock.props.description ?? '')"
                  label="Description"
                  @update:model-value="updateBlockProp('description', $event)"
                />
                <Text type="supporting" color="secondary">
                  Edit properties for {{ selectedBlock.label }}
                </Text>
              </VStack>
            </template>
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
            :padding="4"
            class="clickable"
            :class="{ 'selected-card': block.id === selectedId }"
            @click="selectBlock(block.id)"
          >
            <template v-if="block.type === 'features'">
              <VStack :gap="3">
                <Heading :level="3">
                  {{ block.props.heading }}
                </Heading>
                <Text color="secondary">
                  {{ block.props.description }}
                </Text>
                <Table
                  :data="(block.props.items as Transaction[]) ?? []"
                  :columns="transactionColumns"
                  id-key="id"
                  dividers="rows"
                />
              </VStack>
            </template>
            <template v-else-if="block.type === 'text'">
              <VStack :gap="3" h-align="center">
                <Spinner />
                <Heading :level="3">
                  {{ block.props.heading }}
                </Heading>
                <Text color="secondary">
                  {{ block.props.description }}
                </Text>
                <Button :label="String(block.props.buttonLabel ?? 'Cancel')" variant="secondary" />
              </VStack>
            </template>
            <template v-else-if="block.type === 'cta'">
              <HStack :gap="4" v-align="start">
                <Center class="icon-circle" :width="48" :height="48">
                  <Icon icon="i-heroicons-lock-closed" size="sm" />
                </Center>
                <VStack :gap="2">
                  <Heading :level="4">
                    {{ block.props.heading }}
                  </Heading>
                  <Text color="secondary">
                    {{ block.props.description }}
                  </Text>
                </VStack>
              </HStack>
            </template>
            <Text v-else>
              {{ block.label }}
            </Text>
          </Card>
        </template>
        <EmptyState
          v-else
          title="No blocks yet"
          description="Add blocks from the sidebar to start building your page"
        >
          <template #icon>
            <Icon icon="i-heroicons-plus-circle" />
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
          <HStack :gap="3" v-align="center" h-align="between">
            <Heading :level="3">
              Customize
            </Heading>
            <Button label="Close" variant="ghost" is-icon-only @click="isCustomizeOpen = false">
              <template #icon>
                <Icon icon="i-heroicons-x-mark" size="sm" />
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
  outline: 2px solid var(--color-border-blue);
  outline-offset: -2px;
}

.icon-circle {
  border-radius: 50%;
  background-color: var(--color-background-muted);
}

.properties-form {
  margin-top: var(--spacing-3);
}
</style>
