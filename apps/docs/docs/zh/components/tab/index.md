---
layout: component-docs
title: 标签
outline: false
footer: false
---

<script setup lang="ts">
import { tabSelectedIcon } from '../../../../components/demos/tab'
</script>

## 使用方法

标签页里的一个标签。它渲染成按钮或者链接，选中时换一套样式，还能带图标。

`Tab` 的选中状态和尺寸都从外面的 `TabList` 读，所以要放在 `TabList` 里用。默认插槽是标签文字。没选中时显示 `icon`，选中时换成 `selectedIcon`；`endContent` 跟在文字后面，用来放徽标或状态点。写了 `href` 就渲染成链接；如果外层是 `role="tablist"`，那它就用 `panelId` 指向自己那块内容面板。

```vue
<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('inbox')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="inbox">
      收件箱
    </Tab>
    <Tab value="sent">
      已发送
    </Tab>
  </TabList>
</template>
```

要说明一个标签，把 `Tooltip` 锚定在标签元素上，并渲染在 `TabList` 之后。标签本身是一个按钮，所以 `endContent` 只放装饰：这里的信息图标不是第二个控件。

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

### 整个标签宽度的下划线

选中标签的下划线默认停在标签的左右内边距处。编辑器风格的标签条可以在嵌套的 `Theme` 里改 `tab-indicator` 部位，让它从标签的一边拉到另一边。只有这一条标签条会变，其他 `TabList` 仍用应用主题的下划线。`insetInline` 不是这个部位保证提供的属性，跨版本只能当尽力而为的覆盖。

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

## 示例

常见的用法和不同的状态。

<DemoExample :demo="tabSelectedIcon" title="选中换图标" description="选中之后图标会换一个的标签。" locale="zh" />
