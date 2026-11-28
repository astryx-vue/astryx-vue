---
layout: component-docs
title: Tab
outline: false
footer: false
---

<script setup lang="ts">
import { tabSelectedIcon } from '../../../../components/demos/tab'
</script>

## Usage

Individual tab item that renders as a button or an anchor link, with selected-state styling and optional icons.

A `Tab` reads the selection and the size from the surrounding `TabList`, so it always renders inside one. The default slot is the label. `icon` shows while the tab is not selected and `selectedIcon` while it is; `endContent` follows the label for a badge or a status dot. With `href` the tab renders as a link, unless the strip is a `role="tablist"` and the tab points at its panel with `panelId` instead.

```vue
<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('inbox')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="inbox">
      Inbox
    </Tab>
    <Tab value="sent">
      Sent
    </Tab>
  </TabList>
</template>
```

To explain a tab, anchor a `Tooltip` on the tab element and render it after the `TabList`. The tab is one button, so `endContent` stays decorative: the info icon here is not a second control.

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { Tooltip } from '@astryx-vue/core/Tooltip'
import { computed, ref } from 'vue'

const value = ref('general')
const generalTab = ref<InstanceType<typeof Tab> | null>(null)
const generalEl = computed(() => (generalTab.value?.$el as HTMLElement | undefined) ?? null)
</script>

<template>
  <TabList v-model:value="value" role="tablist" aria-label="Settings">
    <Tab ref="generalTab" value="general" panel-id="panel-general">
      General
      <template #endContent>
        <Icon icon="info" size="sm" />
      </template>
    </Tab>
    <Tab value="advanced" panel-id="panel-advanced">
      Advanced
    </Tab>
  </TabList>
  <Tooltip content="Name, language, and time zone for this workspace." :anchor="generalEl" />
</template>
```

### Underline the whole tab in one strip

The selected tab's underline stops at the tab's inline padding. An editor-style strip can run it edge to edge by restyling the `tab-indicator` target in a nested `Theme`. Only that strip changes; every other `TabList` keeps the app theme's underline. `insetInline` is not a guaranteed property of the target, so treat this override as best effort across releases.

```vue
<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'
import { ref } from 'vue'

const fullWidthIndicator = defineTheme({
  name: 'full-width-tab-indicator',
  components: { 'tab-indicator': { base: { insetInline: '0' } } },
})
const value = ref('app')
</script>

<template>
  <Theme :theme="fullWidthIndicator">
    <TabList v-model:value="value" aria-label="Open files" size="sm" has-divider>
      <Tab value="app">
        App.vue
      </Tab>
      <Tab value="styles">
        styles.css
      </Tab>
    </TabList>
  </Theme>
</template>
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="tabSelectedIcon" title="Selected Icon" description="A tab that changes its icon when selected." locale="en" />
