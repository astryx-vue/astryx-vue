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
  Selector,
  StackItem,
  Text,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { ref } from 'vue'

const OUTLINE_ITEMS: OutlineItem[] = [
  { id: 'prerequisites', label: 'Prerequisites', level: 2 },
  { id: 'install-package', label: 'Install the package', level: 2 },
  { id: 'configure-theming', label: 'Configure theming', level: 2 },
  { id: 'next-steps', label: 'Next steps', level: 2 },
]

const OUTLINE_OPTIONS = OUTLINE_ITEMS.map(item => ({
  value: item.id,
  label: item.label,
}))

/** 两行样式导入。拆成数组再 join，避免这行被目录生成器当成真的 import。 */
const STYLE_IMPORT = ['import \'@astryxdesign/core/reset.css\';', 'import \'@astryxdesign/core/astryx.css\';'].join('\n')

const activeId = ref<string | undefined>(OUTLINE_ITEMS[0]?.id)
const isMobile = useMediaQuery('(max-width: 768px)')

function scrollToId(id: string) {
  activeId.value = id
  const target = document.getElementById(id)
  if (target != null) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.pushState(null, '', `#${id}`)
  }
}

function copyPrompt() {
  void navigator.clipboard.writeText(
    'Help me get set up with Product Name. Based on my project, do the following: 1. Install @astryxdesign/core and the StyleX compiler. 2. Wrap my app in ThemeProvider. 3. Replace one existing component with an Astryx equivalent. After setup, suggest relevant next steps based on my project.',
  )
}
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
        <Outline v-model:active-id="activeId" :items="OUTLINE_ITEMS" />
      </LayoutPanel>
    </template>

    <LayoutContent :is-scrollable="false" :padding="8">
      <VStack :gap="8">
        <VStack :gap="2">
          <Text type="display-1">
            Getting started with Product Name
          </Text>
          <Text type="supporting" color="secondary">
            Last updated March 30, 2026
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

        <Card>
          <VStack :gap="3">
            <HStack :gap="2" :align="'center'">
              <StackItem size="fill">
                <HStack :gap="2" :align="'center'">
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
                :items="[
                  { label: 'Open in v0', onClick: () => {} },
                  { label: 'Open in Claude', onClick: () => {} },
                  { label: 'Open in ChatGPT', onClick: () => {} },
                  { label: 'Open in Cursor', onClick: () => {} },
                ]"
              >
                <template #trigger="triggerProps">
                  <IconButton
                    v-bind="triggerProps"
                    label="More options"
                    variant="ghost"
                    size="sm"
                  >
                    <Icon icon="chevronDown" />
                  </IconButton>
                </template>
              </DropdownMenu>
            </HStack>
            <Text type="body" color="secondary">
              Help me get set up with Product Name. Based on my project, do
              the following: 1. Install @astryxdesign/core and the StyleX
              compiler. 2. Wrap my app in ThemeProvider. 3. Replace one
              existing component with an Astryx equivalent.
            </Text>
          </VStack>
        </Card>

        <VStack :gap="4">
          <Heading id="prerequisites" :level="2">
            Prerequisites
          </Heading>
          <List density="compact" list-style="disc">
            <ListItem label="Node.js 18+" />
            <ListItem label="React 18 or 19" />
            <ListItem label="A package manager (npm, yarn, or pnpm)" />
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
            customize colors, typography, and spacing, wrap your app in a
            theme provider.
          </Text>
          <CodeBlock
            :code="`import { ThemeProvider } from '@astryxdesign/core/Theme';\n\nexport default function App({ children }) {\n  return (\n    <ThemeProvider theme=&quot;default&quot;>\n      {children}\n    </ThemeProvider>\n  );\n}`"
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
            <ListItem label="Fundamental concepts — How theming, layout, and composition work" />
            <ListItem label="Component API reference — Props, variants, and examples for every component" />
            <ListItem label="Accessibility — Built-in a11y features and ARIA patterns" />
            <ListItem label="CLI tools — Scaffold projects and manage templates" />
            <ListItem label="Design tokens — Colors, spacing, typography, and sizing" />
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
