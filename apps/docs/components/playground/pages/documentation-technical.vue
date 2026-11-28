<script setup lang="ts">
import type { OutlineItem } from '@astryx-vue/core'
import {
  Button,
  Card,
  CodeBlock,
  Divider,
  DropdownMenu,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutPanel,
  List,
  ListItem,
  Outline,
  StackItem,
  Text,
  useClipboard,
  useMediaQuery,
  useToast,
  VStack,
} from '@astryx-vue/core'

const OUTLINE_ITEMS: OutlineItem[] = [
  { id: 'prerequisites', label: 'Prerequisites', level: 2 },
  { id: 'install-package', label: 'Install the package', level: 2 },
  { id: 'configure-theming', label: 'Configure theming', level: 2 },
  { id: 'next-steps', label: 'Next steps', level: 2 },
]

/** 两行样式导入。拆成数组再 join，避免这行被目录生成器当成真的 import。 */
const STYLE_IMPORT = ['import \'@astryxdesign/core/reset.css\';', 'import \'@astryxdesign/core/astryx.css\';'].join('\n')

/** 主题配置示例：装主题包、引样式、用 Theme 包住应用。 */
const THEME_CODE = [
  'import { Theme } from \'@astryxdesign/core/theme\';',
  'import { neutralTheme } from \'@astryxdesign/theme-neutral/built\';',
  'import \'@astryxdesign/theme-neutral/theme.css\';',
  '',
  'export default function App({ children }) {',
  '  return <Theme theme={neutralTheme}>{children}</Theme>;',
  '}',
].join('\n')

const { copy } = useClipboard()
const showToast = useToast()
const isMobile = useMediaQuery('(max-width: 768px)')

function copyPrompt() {
  void copy(
    'Help me get set up with Product Name. Based on my project, do the following: 1. Install @astryxdesign/core and import its precompiled reset.css and astryx.css once at the app entry point. 2. Wrap my app in Theme with a theme package such as @astryxdesign/theme-neutral. 3. Replace one existing component with an Astryx equivalent. After setup, suggest relevant next steps based on my project.',
  )
}

// 演示用：真实项目里换成打开对应工具的调用。
const OPEN_IN_ITEMS = [
  { label: 'Open in v0', onClick: () => showToast({ body: 'Demo: this would open the prompt in v0 here', uniqueID: 'open-v0' }) },
  { label: 'Open in Claude', onClick: () => showToast({ body: 'Demo: this would open the prompt in Claude here', uniqueID: 'open-claude' }) },
  { label: 'Open in ChatGPT', onClick: () => showToast({ body: 'Demo: this would open the prompt in ChatGPT here', uniqueID: 'open-chatgpt' }) },
  { label: 'Open in Cursor', onClick: () => showToast({ body: 'Demo: this would open the prompt in Cursor here', uniqueID: 'open-cursor' }) },
]
</script>

<template>
  <Layout height="auto" :content-width="960">
    <template v-if="!isMobile" #end>
      <LayoutPanel
        :is-scrollable="false"
        label="On this page"
        role="complementary"
        class="outline-panel"
      >
        <Outline :items="OUTLINE_ITEMS" />
      </LayoutPanel>
    </template>

    <LayoutContent role="main" :is-scrollable="false" :padding="8">
      <VStack :gap="8">
        <VStack :gap="2">
          <Text as="h1" type="display-1">
            Getting started with Product Name
          </Text>
          <Text type="supporting" color="secondary">
            Last updated March 30, 2026
          </Text>
          <Outline v-if="isMobile" :items="OUTLINE_ITEMS" />
        </VStack>

        <Card>
          <VStack :gap="3">
            <HStack :gap="2" vAlign="center">
              <StackItem size="fill">
                <HStack wrap="wrap" :gap="2" vAlign="center">
                  <Icon name="heroicons:sparkles" size="sm" color="secondary" />
                  <Text type="body" weight="semibold">
                    AI Assistance
                  </Text>
                </HStack>
              </StackItem>
              <Button
                label="Copy prompt"
                variant="ghost"
                size="sm"
                @click="copyPrompt"
              >
                <template #icon>
                  <Icon name="heroicons:clipboard-document" />
                </template>
              </Button>
              <DropdownMenu
                :button="{ label: 'More options', variant: 'ghost', size: 'sm', isIconOnly: true }"
                :items="OPEN_IN_ITEMS"
              >
                <template #trigger="triggerProps">
                  <IconButton
                    v-bind="triggerProps"
                    label="More options"
                    variant="ghost"
                    size="sm"
                  >
                    <Icon name="heroicons:chevron-down" />
                  </IconButton>
                </template>
              </DropdownMenu>
            </HStack>
            <Text type="body" color="secondary">
              Help me get set up with Product Name. Based on my project, do
              the following: 1. Install @astryxdesign/core and import its
              precompiled reset.css and astryx.css once at the app entry
              point. 2. Wrap my app in Theme with a theme package such as
              @astryxdesign/theme-neutral. 3. Replace one existing component
              with an Astryx equivalent.
            </Text>
          </VStack>
        </Card>

        <VStack :gap="4">
          <Heading id="prerequisites" :level="2">
            Prerequisites
          </Heading>
          <List density="compact" list-style="disc">
            <!-- 原版用节点作 label：节点会在窄屏换行，字符串 label 会截成一行。 -->
            <ListItem><template #label>Node.js 18+</template></ListItem>
            <ListItem><template #label>React 19 or later</template></ListItem>
            <ListItem><template #label>A package manager (npm, yarn, or pnpm)</template></ListItem>
          </List>
        </VStack>

        <Divider />

        <VStack :gap="4">
          <Heading id="install-package" :level="2">
            Install the package
          </Heading>
          <Text type="body">
            Every project starts with installing the core package. This
            gives you access to all components, tokens, and utilities.
          </Text>
          <VStack :gap="2">
            <Text type="body" weight="bold">
              Step 1: Install the core package
            </Text>
            <CodeBlock code="npm install @astryxdesign/core" language="bash" width="100%" />
          </VStack>
          <VStack :gap="2">
            <Text type="body" weight="bold">
              Step 2: Import the precompiled styles
            </Text>
            <Text type="body" color="secondary">
              Astryx ships precompiled CSS, so there is no build plugin to
              configure. Import the reset and component stylesheets once at
              your app entry point.
            </Text>
            <CodeBlock
              :code="STYLE_IMPORT"
              language="tsx"
              width="100%"
            />
          </VStack>
          <VStack :gap="2">
            <Text type="body" weight="bold">
              Step 3: Import your first component
            </Text>
            <CodeBlock
              :code="`import { Button } from '@astryxdesign/core/Button';\n\nexport default function App() {\n  return <Button label=&quot;Hello Astryx&quot; variant=&quot;primary&quot; />;\n}`"
              language="tsx"
              width="100%"
            />
          </VStack>
        </VStack>

        <Divider />

        <VStack :gap="4">
          <Heading id="configure-theming" :level="2">
            Configure theming
          </Heading>
          <Text type="body">
            Astryx ships with a default theme that works out of the box. To
            customize colors, typography, and spacing, install a theme
            package, import its stylesheet, and wrap your app in Theme.
          </Text>
          <CodeBlock
            :code="THEME_CODE"
            language="tsx"
            width="100%"
          />
          <Text type="body" color="secondary">
            See the theming guide for the full list of customizable tokens.
          </Text>
        </VStack>

        <Divider />

        <VStack :gap="4">
          <Heading id="next-steps" :level="2">
            Next steps
          </Heading>
          <List density="compact" list-style="disc">
            <ListItem><template #label>Fundamental concepts — How theming, layout, and composition work</template></ListItem>
            <ListItem><template #label>Component API reference — Props, variants, and examples for every component</template></ListItem>
            <ListItem><template #label>Accessibility — Built-in a11y features and ARIA patterns</template></ListItem>
            <ListItem><template #label>CLI tools — Scaffold projects and manage templates</template></ListItem>
            <ListItem><template #label>Design tokens — Colors, spacing, typography, and sizing</template></ListItem>
          </List>
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
</style>
