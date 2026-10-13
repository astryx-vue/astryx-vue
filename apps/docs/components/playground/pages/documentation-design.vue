<script setup lang="ts">
import type { OutlineItem } from '@astryx-vue/core'
import {
  Badge,
  Button,
  Card,
  CodeBlock,
  Dialog,
  DialogHeader,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutPanel,
  Outline,
  Section,
  Selector,
  Tab,
  TabList,
  Text,
  Token,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { ref } from 'vue'

const COMPONENT_OUTLINE_ITEMS: OutlineItem[] = [
  { id: 'usage', label: 'Usage', level: 2 },
  { id: 'best-practices', label: 'Best practices', level: 3 },
  { id: 'examples', label: 'Examples', level: 2 },
]

const isMobile = useMediaQuery('(max-width: 768px)')
const activeOutlineId = ref(COMPONENT_OUTLINE_ITEMS[0]?.id)
const activeTab = ref('overview')
const dialogOpen = ref(false)

const COMPONENT = {
  name: 'Button',
  category: 'Action',
  description: 'Buttons let people take action. They can be used in forms, dialogs, and toolbars, or as standalone links.',
}
</script>

<template>
  <Layout height="auto" :content-width="960">
    <template v-if="!isMobile" #end>
      <LayoutPanel :is-scrollable="false" label="On this page" role="complementary" class="outline-panel">
        <Outline v-model:active-id="activeOutlineId" :items="COMPONENT_OUTLINE_ITEMS" />
      </LayoutPanel>
    </template>

    <LayoutContent :padding="8">
      <VStack :gap="8">
        <VStack :gap="2">
          <HStack :gap="2" :v-align="'center'" wrap="wrap">
            <Badge :label="COMPONENT.category" variant="blue" />
            <Token label="Stable" />
          </HStack>
          <Heading :level="1">{{ COMPONENT.name }}</Heading>
          <Text type="large" color="secondary">{{ COMPONENT.description }}</Text>
          <Selector
            v-if="isMobile"
            v-model="activeOutlineId"
            label="On this page"
            is-label-hidden
            :options="COMPONENT_OUTLINE_ITEMS.map(i => ({ value: i.id, label: i.label }))"
          />
        </VStack>

        <TabList v-model:value="activeTab" class="tab-flush">
          <Tab value="overview" label="Overview" />
          <Tab value="api" label="API" />
          <Tab value="examples" label="Examples" />
        </TabList>

        <Card :padding="6">
          <VStack :gap="4" id="usage">
            <Heading :level="2">Usage</Heading>
            <CodeBlock language="tsx" :code="`import { Button } from '@astryxdesign/core/Button';\n\n<Button label=&quot;Save&quot; variant=&quot;primary&quot; />`" />
            <Text id="best-practices" type="body" color="secondary">
              Use a primary button for the main action on a page. Limit to one primary button per view when possible.
            </Text>
          </VStack>
        </Card>

        <Divider />

        <VStack id="examples" :gap="4">
          <Heading :level="2">Examples</Heading>
          <HStack :gap="2" :v-align="'center'">
            <Button label="Open Dialog" variant="primary" @click="dialogOpen = true" />
            <IconButton label="Open in new tab">
              <Icon icon="i-heroicons-arrow-top-right-on-square" size="sm" />
            </IconButton>
          </HStack>
          <Card variant="muted" :padding="8" class="preview-stage">
            <HStack :h-align="'center'">
              <Button label="Primary action" variant="primary" />
            </HStack>
          </Card>
        </VStack>
      </VStack>
    </LayoutContent>
  </Layout>

  <Dialog :is-open="dialogOpen" @open-change="dialogOpen = $event">
    <DialogHeader title="Example Dialog" @open-change="dialogOpen = $event" />
    <Section :padding="4">
      <Text type="body">Dialogs require user action or acknowledgment before continuing.</Text>
    </Section>
  </Dialog>
</template>

<style scoped>
.outline-panel {
  position: sticky;
  top: 24px;
  align-self: start;
  padding-block-start: 120px;
}
.tab-flush { margin-inline-start: -12px; }
.preview-stage { min-height: 160px; }
</style>
