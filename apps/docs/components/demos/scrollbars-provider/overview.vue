<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'
import { ScrollableArea } from '@astryx-vue/core/ScrollableArea'
import { ScrollbarsProvider } from '@astryx-vue/core/Scrollbars'
import { Switch } from '@astryx-vue/core/Switch'
import { Text } from '@astryx-vue/core/Text'
import { shallowRef } from 'vue'

const on = shallowRef(true)

const notes = Array.from({ length: 24 }, (_, index) => `Release note ${index + 1}`)

const code = [
  'const message = "This line is long enough that it has to scroll sideways, so the horizontal scrollbar shows up under the code.";',
  'const another = "Hover the code block, or scroll it, and the thin bar appears without taking any width from the content.";',
  'export { message, another };',
].join('\n')
</script>

<template>
  <div class="scrollbars-provider-preview">
    <Switch v-model="on" label="Custom scrollbars" />
    <ScrollbarsProvider :enabled="on">
      <div class="scrollbars-provider-preview__panes">
        <ScrollableArea label="Release notes" :height="200" :padding="3">
          <div v-for="note in notes" :key="note" class="scrollbars-provider-preview__row">
            <Text type="body">
              {{ note }}
            </Text>
          </div>
        </ScrollableArea>
        <CodeBlock :code="code" language="typescript" title="long-lines.ts" />
      </div>
    </ScrollbarsProvider>
  </div>
</template>
