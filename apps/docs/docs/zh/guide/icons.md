---
title: 图标
---

# 图标

用 `Icon` 和一个 Iconify 名字来画图标。不需要为每个图形单独 import 组件。

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <Icon name="carbon:settings" />
</template>
```

`carbon:settings` 是 Carbon 集合里的 settings。这个集合注册之后，`carbon-settings` 是同一个名字。集合 id 本身带连字符时保留冒号，例如 `material-symbols:home`。

## 只打包写到的图标

`@astryx-vue/core` 不带任何集合。装你要用的那一套，再接上 Vite 插件：

```bash
pnpm add -D @iconify-json/carbon
```

```ts
import { astryxIcons } from '@astryx-vue/core/icons'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), astryxIcons()],
})
```

插件读取最近一份 `package.json` 里的 `@iconify-json/*`，扫描源码中的静态名字，每个图标生成一个模块。打进浏览器的只有这些图形，不是整份 JSON。Vite 的 root 如果没有 `package.json`（VitePress 的文档目录就是这样），插件会向上找。再加一套就是再装一个包：安装 `@iconify-json/lucide`，然后写 `name="lucide:settings"`。这件事不需要 UnoCSS。

如果只想让插件认其中几套，传入 `collections: ['carbon']`。

## 名字不在源码里

运行时拼出来的名字，插件看不到。在应用入口、任何图标渲染之前注册整套集合。这样做会把整套打进包：

```ts
import { addCollection } from '@astryx-vue/core/Icon'
import carbon from '@iconify-json/carbon/icons.json'

addCollection(carbon)
```

已经有某一枚的 Iconify 数据时，用 `addIcon('carbon:settings', data)` 注册这一枚。

## 槽位

不传 `size` 时，图标是 `1em`，颜色是 `currentColor`。Button 的 `icon` 和 `end` 槽、IconButton，以及输入框开头和结尾的槽已经定好盒子，图标会铺满它：

```vue
<Button label="设置">
  <template #icon>
    <Icon name="carbon:settings" />
  </template>
</Button>

<IconButton label="搜索">
  <Icon name="carbon:search" />
</IconButton>
```

装饰性图标对辅助技术隐藏。只有图标自己在传达含义时才设置 `label`。尺寸、颜色和放进按钮的例子在组件页。

## CSS 类名

`icon` 仍然接受 CSS 类名，导航和菜单上的 `iconClass` 也是。类名要在你的构建里真正生成，才会画出来。UnoCSS 是其中一种办法，文档站的一些旧示例还在用它。应用不必装 UnoCSS。

组件自己画的 `chevronDown`、`check` 这些字形不是通用图标集。产品里的图标用 `name`。
