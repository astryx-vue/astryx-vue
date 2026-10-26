<script setup lang="ts">
import type { OutlineItem, TableColumn } from '@astryx-vue/core'
import {
  Badge,
  Button,
  Card,
  Center,
  CodeBlock,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutPanel,
  Outline,
  pixel,
  Section,
  Selector,
  StackItem,
  Tab,
  TabList,
  Table,
  Text,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import type { Component } from 'vue'
import { defineComponent, h, ref } from 'vue'

/** 线性图标用内联 SVG 画出，不依赖外部图标字体。 */
function strokeIcon(path: string): Component {
  return defineComponent({
    render: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 1.5,
      'stroke-linecap': 'round',
      'aria-hidden': 'true',
      style: 'width:1em;height:1em',
    }, [h('path', { d: path })]),
  })
}

const PlusIcon = strokeIcon('M12 5v14M5 12h14')
const FullscreenIcon = strokeIcon('M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5')

interface GuidanceRow extends Record<string, unknown> {
  id: string
  type: 'do' | 'dont'
  text: string
}

interface Example {
  title: string
  description: string
  code: string
}

const OUTLINE_ITEMS: OutlineItem[] = [
  { id: 'usage', label: 'Usage', level: 2 },
  { id: 'best-practices', label: 'Best practices', level: 3 },
  { id: 'examples', label: 'Examples', level: 2 },
]

const OUTLINE_OPTIONS = OUTLINE_ITEMS.map(item => ({ value: item.id, label: item.label }))

const USAGE = 'Buttons provide visual cues for actions and events. These fundamental components allow users to commit actions and navigate a page flow. Use a Button when a user needs to submit a form, start a new task or action, or trigger a new UI element to appear on the page.'

const BEST_PRACTICES: GuidanceRow[] = [
  { id: 'do-1', type: 'do', text: 'Convey clear action hierarchy: Each surface should only have 1 primary button. A majority of buttons should be in default or flat style.' },
  { id: 'do-2', type: 'do', text: 'Promote clarity: Consider labels alongside icons where appropriate.' },
  { id: 'dont-1', type: 'dont', text: 'Overuse primary or special buttons: Overusing colored buttons will result in a page with less intentionality, create visual confusion and a lack of page hierarchy.' },
]

const EXAMPLES: Example[] = [
  {
    title: 'Semantics',
    description: 'We have four semantic buttons types: flat, default, primary, and destructive. Flat buttons are used to limit visual prominence, whereas primary emphasizes a single action. Use destructive for deletions that trigger dialog confirmations.',
    code: `<Button label="Flat" variant="ghost" />\n<Button label="Default" variant="secondary" />\n<Button label="Primary" variant="primary" />\n<Button label="Destructive" variant="destructive" />`,
  },
  {
    title: 'Default button with badge',
    description: 'Buttons can include a badge to highlight new or updated actions.',
    code: `<Button\n  label="Button"\n  variant="default"\n/>`,
  },
]

const GUIDANCE_COLUMNS: TableColumn<GuidanceRow>[] = [
  {
    key: 'type',
    header: 'Guidance',
    width: pixel(125),
    renderCell: row => h(Badge, { label: row.type === 'do' ? 'Do' : 'Dont', variant: row.type === 'do' ? 'success' : 'error' }),
  },
  {
    key: 'text',
    header: 'Practices',
    renderCell: row => h(Text, { type: 'body', textWrap: 'wrap' }, () => row.text),
  },
]

const isMobile = useMediaQuery('(max-width: 768px)')
const activeId = ref<string | undefined>(OUTLINE_ITEMS[0]?.id)
/** 每个示例卡片各自记住自己是看描述还是看代码。 */
const exampleTabs = ref<Record<number, string>>({})

function tabFor(index: number): string {
  return exampleTabs.value[index] ?? 'description'
}

function setTab(index: number, value: string): void {
  exampleTabs.value = { ...exampleTabs.value, [index]: value }
}

function scrollToId(id: string): void {
  activeId.value = id
  const target = document.getElementById(id)
  if (target != null) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.pushState(null, '', `#${id}`)
  }
}

const noop = () => {}
</script>

<template>
  <Layout height="auto" :content-width="960">
    <template v-if="!isMobile" #end>
      <LayoutPanel :is-scrollable="false" label="On this page" role="complementary" class="outline-panel">
        <Outline v-model:active-id="activeId" :items="OUTLINE_ITEMS" />
      </LayoutPanel>
    </template>

    <LayoutContent :is-scrollable="false" :padding="8">
      <VStack :gap="8">
        <VStack :gap="2">
          <Text type="display-1">
            Button
          </Text>
          <Text type="supporting" color="secondary">
            March 30, 2026 · Updated 5:40 p.m. PST
          </Text>
          <Selector
            v-if="isMobile"
            label="On this page"
            is-label-hidden
            :options="OUTLINE_OPTIONS"
            :model-value="activeId"
            width="100%"
            @update:model-value="scrollToId($event as string)"
          />
        </VStack>

        <Card variant="muted" :padding="0">
          <Center :height="360">
            <Button label="Button" variant="secondary">
              <template #icon>
                <PlusIcon />
              </template>
              <template #end>
                <Badge label="New" variant="info" />
              </template>
            </Button>
          </Center>
        </Card>

        <VStack :gap="4">
          <Heading id="usage" :level="2">
            Usage
          </Heading>
          <Text type="large" weight="normal">
            {{ USAGE }}
          </Text>
          <Heading id="best-practices" :level="3">
            Best practices
          </Heading>
          <Table
            :data="BEST_PRACTICES"
            :columns="GUIDANCE_COLUMNS"
            id-key="id"
            dividers="none"
            density="spacious"
          />
        </VStack>

        <Divider />

        <VStack :gap="4">
          <Heading id="examples" :level="2">
            Examples
          </Heading>
          <Text type="large" weight="normal">
            Explore common configurations, variations, and states for this component.
          </Text>
        </VStack>

        <VStack :gap="8">
          <Card v-for="(example, i) in EXAMPLES" :key="i" :padding="0">
            <Section variant="transparent" :padding="3">
              <HStack :gap="3" align="center">
                <StackItem size="fill">
                  <Text type="body" weight="medium">
                    {{ example.title }}
                  </Text>
                </StackItem>
                <HStack :gap="1" align="center">
                  <Button label="Open in Craft" variant="ghost" size="sm">
                    <template #icon>
                      <Icon icon="externalLink" size="sm" />
                    </template>
                  </Button>
                  <Button label="Send to CLI" variant="ghost" size="sm" />
                  <IconButton label="Fullscreen" variant="ghost" size="sm">
                    <FullscreenIcon />
                  </IconButton>
                </HStack>
              </HStack>
            </Section>
            <Center :height="280">
              <HStack v-if="i === 0" :gap="3" align="center">
                <Button label="Flat" variant="ghost" />
                <Button label="Default" variant="secondary" />
                <Button label="Primary" variant="primary" />
                <Button label="Destructive" variant="destructive" />
              </HStack>
              <Button v-else label="Button" variant="secondary" />
            </Center>
            <Section variant="muted" :padding="3" :dividers="['top']">
              <VStack :gap="3">
                <TabList
                  class="tab-flush"
                  size="sm"
                  :model-value="tabFor(i)"
                  @update:model-value="setTab(i, $event)"
                >
                  <Tab value="description" label="Description" />
                  <Tab value="code" label="Code" />
                </TabList>
                <Text v-if="tabFor(i) === 'description'" type="body">
                  {{ example.description }}
                </Text>
                <CodeBlock
                  v-else
                  :code="example.code"
                  language="tsx"
                  width="100%"
                />
              </VStack>
            </Section>
          </Card>
        </VStack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.outline-panel {
  position: sticky;
  top: 24px;
  align-self: start;
  padding-block-start: 120px;
}
.tab-flush {
  margin-inline-start: -12px;
}
</style>
