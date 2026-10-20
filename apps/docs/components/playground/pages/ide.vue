<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core'
import {
  Button,
  CodeBlock,
  Heading,
  Layout,
  LayoutContent,
  LayoutPanel,
  List,
  ListItem,
  MetadataList,
  MetadataListItem,
  ResizeHandle,
  SegmentedControl,
  SegmentedControlItem,
  Stack,
  StackItem,
  Tab,
  TabList,
  Text,
  TextInput,
  TreeList,
  useMediaQuery,
  useResizable,
  VStack,
} from '@astryx-vue/core'
import { computed, ref } from 'vue'

const EDITOR_CODE = [
  'import {useState, useCallback} from \'react\';',
  'import {Button} from \'@astryxdesign/core/Button\';',
  'import {Text} from \'@astryxdesign/core/Text\';',
  '',
  'const containerStyle = { display: \'flex\', flexDirection: \'column\', gap: 8, padding: 16 };',
  'const counterStyle = { fontSize: 48, fontWeight: 700, fontVariantNumeric: \'tabular-nums\' };',
  '',
  'export default function Counter() {',
  '  const [count, setCount] = useState(0);',
  '  const increment = useCallback(() => setCount(prev => prev + 1), []);',
  '  const reset = useCallback(() => setCount(0), []);',
  '  return (',
  '    <div style={containerStyle}>',
  '      <Text type="label">Counter</Text>',
  '      <span style={counterStyle}>{count}</span>',
  '      <Button label="Increment" onClick={increment} />',
  '      <Button label="Reset" variant="secondary" onClick={reset} />',
  '    </div>',
  '  );',
  '}',
].join('\n')

const TERMINAL_OUTPUT = `$ yarn dev
yarn run v1.22.22
$ next dev
   ▲ Next.js 15.5.15
   - Local:   http://localhost:3000

 ✓ Ready in 2.4s
 ○ Compiling /counter ...
 ✓ Compiled /counter in 1.2s (847 modules)
 GET /counter 200 in 1340ms

$ `

const PROPERTIES = [
  { label: 'Type', value: 'React Component' },
  { label: 'Language', value: 'TypeScript' },
  { label: 'Lines', value: '42' },
  { label: 'Size', value: '1.2 KB' },
  { label: 'Last modified', value: '2 hours ago' },
  { label: 'Imports', value: '4 modules' },
  { label: 'Exports', value: '1 default' },
  { label: 'Hooks', value: 'useState, useCallback' },
]

const HISTORY_ITEMS = [
  { label: 'Opened Counter.tsx', time: '2 min ago' },
  { label: 'Opened Layout.tsx', time: '6 min ago' },
  { label: 'Viewed tokens.ts', time: '11 min ago' },
]

const activeFile = ref('Counter.tsx')
const activeTermTab = ref('terminal')
const activePropertiesTab = ref('properties')
const searchQuery = ref('')

const startPanel = useResizable({
  defaultSize: 256,
  minSize: 160,
  maxSize: 400,
  collapsible: true,
  collapsedSize: 50,
})

const endPanel = useResizable({
  defaultSize: 320,
  minSize: 180,
  maxSize: 500,
  collapsible: true,
  collapsedSize: 50,
})

const bottomPanel = useResizable({
  defaultSize: 300,
  minSize: 80,
  maxSize: Infinity,
  direction: 'vertical',
  collapsible: true,
  collapsedSize: 40,
})

const isMobile = useMediaQuery('(max-width: 768px)')

function buildFileTree(onFileClick: (name: string) => void): TreeListItemData[] {
  const file = (id: string): TreeListItemData => ({
    id,
    label: id,
    icon: 'i-heroicons-document',
    onClick: () => onFileClick(id),
  })
  return [
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
            file('Counter.tsx'),
            file('Header.tsx'),
            file('Layout.tsx'),
          ],
        },
        {
          id: 'pages',
          label: 'pages',
          icon: 'i-heroicons-folder',
          isExpanded: true,
          children: [file('index.tsx'), file('about.tsx')],
        },
        {
          id: 'styles',
          label: 'styles',
          icon: 'i-heroicons-folder',
          isExpanded: true,
          children: [file('tokens.ts'), file('theme.ts')],
        },
      ],
    },
    file('package.json'),
    file('tsconfig.json'),
    file('next.config.mjs'),
  ]
}

const fileTree = computed(() => buildFileTree((name) => {
  activeFile.value = name
}))
</script>

<template>
  <Layout height="fill">
    <LayoutContent :padding="0">
      <Layout height="fill">
        <template v-if="!isMobile" #start>
          <template v-if="!startPanel.isCollapsed">
            <LayoutPanel :width="startPanel.size" :has-divider="false" :padding="0">
              <VStack class="file-explorer" :gap="2">
                <TextInput
                  v-model="searchQuery"
                  label="Search files"
                  is-label-hidden
                  placeholder="Search"
                  size="md"
                />
                <TreeList :items="fileTree" density="compact" />
              </VStack>
            </LayoutPanel>
          </template>
          <ResizeHandle
            direction="horizontal"
            has-divider
            :is-always-visible="false"
            :resizable="startPanel.props"
            label="Resize file explorer"
          />
        </template>

        <LayoutContent :padding="0">
          <Layout height="fill">
            <LayoutContent :padding="0">
              <Stack direction="vertical" class="content-fill">
                <StackItem size="fill" class="editor-area">
                  <CodeBlock
                    :code="EDITOR_CODE"
                    language="typescript"
                    container="section"
                    :has-language-label="false"
                    :has-line-numbers="true"
                    :highlight-lines="[21]"
                    :has-copy-button="false"
                    size="sm"
                    class="editor-code"
                  />
                </StackItem>
                <ResizeHandle
                  direction="vertical"
                  has-divider
                  is-reversed
                  :is-always-visible="false"
                  :resizable="bottomPanel.props"
                  label="Resize terminal"
                />
                <Stack
                  v-if="!bottomPanel.isCollapsed"
                  direction="vertical"
                  :height="bottomPanel.size"
                  class="terminal-panel"
                >
                  <TabList role="tablist"
                    v-model:value="activeTermTab"
                    size="sm"
                    :has-divider="false"
                    class="tab-list-padding"
                  >
                    <Tab label="Terminal" value="terminal" />
                    <Tab label="Problems" value="problems" />
                    <Tab label="Output" value="output" />
                    <Tab label="Debug" value="debug" />
                  </TabList>
                  <StackItem size="fill" class="terminal-wrapper">
                    <CodeBlock
                      :code="TERMINAL_OUTPUT"
                      language="bash"
                      container="section"
                      :has-language-label="false"
                      :has-copy-button="false"
                      size="sm"
                      class="editor-code"
                    />
                  </StackItem>
                </Stack>
              </Stack>
            </LayoutContent>

            <template v-if="!isMobile" #end>
              <ResizeHandle
                direction="horizontal"
                has-divider
                is-reversed
                :is-always-visible="false"
                :resizable="endPanel.props"
                label="Resize properties panel"
              />
              <LayoutPanel
                v-if="!endPanel.isCollapsed"
                :width="endPanel.size"
                :has-divider="false"
                :padding="4"
              >
                <VStack class="properties-panel" :gap="3">
                  <SegmentedControl
                    v-model="activePropertiesTab"
                    label="Properties panel sections"
                    size="sm"
                    layout="fill"
                  >
                    <SegmentedControlItem label="Properties" value="properties" />
                    <SegmentedControlItem label="History" value="history" />
                  </SegmentedControl>
                  <template v-if="activePropertiesTab === 'properties'">
                    <VStack class="properties-content" :gap="3">
                      <VStack :gap="1">
                        <Heading :level="3" :max-lines="1">
                          {{ activeFile }}
                        </Heading>
                        <Text color="secondary" type="supporting" :max-lines="1">
                          src/components/{{ activeFile }}
                        </Text>
                      </VStack>
                      <MetadataList class="metadata-compact">
                        <MetadataListItem
                          v-for="prop in PROPERTIES"
                          :key="prop.label"
                          :label="prop.label"
                        >
                          {{ prop.value }}
                        </MetadataListItem>
                      </MetadataList>
                      <VStack class="property-actions" :gap="2">
                        <Button label="Format Document" size="sm" variant="secondary" />
                        <Button label="Go to Definition" size="sm" variant="secondary" />
                        <Button label="Find References" size="sm" variant="secondary" />
                      </VStack>
                    </VStack>
                  </template>
                  <VStack v-else :gap="1">
                    <List>
                      <ListItem
                        v-for="item in HISTORY_ITEMS"
                        :key="item.label"
                        :label="item.label"
                      >
                        <template #startContent>
                          <span class="history-timeline-dot" />
                        </template>
                        <template #endContent>
                          <Text type="supporting" color="secondary" :max-lines="1">
                            {{ item.time }}
                          </Text>
                        </template>
                      </ListItem>
                    </List>
                  </VStack>
                </VStack>
              </LayoutPanel>
            </template>
          </Layout>
        </LayoutContent>
      </Layout>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.content-fill {
  height: 100%;
}

.terminal-wrapper {
  min-height: 0;
  overflow: hidden;
  display: grid;
}

.tab-list-padding {
  padding-top: var(--spacing-2);
}

.metadata-compact {
  gap: var(--spacing-1) var(--spacing-3);
}

.history-timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-border-emphasized);
  margin-top: 6px;
  flex-shrink: 0;
}

.editor-area {
  overflow: auto;
  min-height: 0;
}

.file-explorer {
  padding: 16px;
  min-width: 0;
}

.properties-panel {
  height: 100%;
}

.properties-content {
  flex: 1;
  min-height: 0;
}

.property-actions {
  margin-top: auto;
}

.terminal-panel {
  flex-shrink: 0;
  overflow: hidden;
}

.editor-code {
  width: 100%;
  height: 100%;
  border-width: 0;
  border-radius: 0;
}
</style>
