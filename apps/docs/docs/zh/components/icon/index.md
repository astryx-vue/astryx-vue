---
layout: component-docs
title: 图标
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { iconBasic, iconButton, iconPalette, iconSemantic, iconSizes, iconStatus } from '../../../../components/demos/icon'
</script>

## 使用方法

`Icon` 按名字画一个图标。名字来自 Iconify 的集合，不需要为每个图形单独 import 一个组件。

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <Icon name="carbon:settings" />
</template>
```

写法是 `集合:图标`，和 Iconify 的 id 相同。集合注册之后，`carbon-settings` 也指向 Carbon 的 settings。集合名本身带连字符时请保留冒号，例如 `material-symbols:home`，避免被拆错。

`@astryx-vue/core` 不打包这些图形。装你要用的集合，再用 Vite 插件只把源码里写到的图标打进去：

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

`astryxIcons()` 会读取项目依赖里的 `@iconify-json/*`。源码里的 `name="carbon:settings"` 会变成一个很小的模块，只注册这一枚图标，Carbon 的其余部分不会进包。再换一套也一样：安装 `@iconify-json/lucide`，然后写 `name="lucide:settings"`。不需要装 UnoCSS。

插件只能看到写在源码里的名字。名字要到运行时才拼出来时，自己注册整套集合，这一整套都会进包：

```ts
import { addCollection } from '@astryx-vue/core/Icon'
import carbon from '@iconify-json/carbon/icons.json'

addCollection(carbon)
```

在图标渲染之前调用，一般放在应用入口。`addIcon('carbon:settings', data)` 用来注册单独的一枚。

不传 `size` 时，图标是 `1em` 见方，颜色用 `currentColor`，跟周围的文字走。[Button](/components/button) 的 `icon` 和 `end` 槽、[IconButton](/components/icon-button)，以及输入框开头和结尾的槽，盒子尺寸已经定好。把 `Icon` 放进去，不要再设 `size`。

```vue
<Button label="设置">
  <template #icon>
    <Icon name="carbon:settings" />
  </template>
</Button>
```

装饰性图标默认 `aria-hidden`。只有图标自己承载含义、旁边又没有文字时，才设置 `label`。父级按钮或链接已经有名字时不要再设。

`icon` 仍然可以收一个 CSS 类名，或你自己的组件。导航上的 `iconClass` 也还是类名。这些用法同样不要求 UnoCSS。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 同一块界面里用同一套集合。线框和实心混在一行里，会显得没画完。 |
| <Badge variant="success">推荐</Badge> | 放进按钮或输入框的槽时不要再传 `size`。槽已经定好盒子，`1em` 会铺满它。 |
| <Badge variant="success">推荐</Badge> | 图标单独出现、旁边没有说明它是什么的文字时，设置 `label`。 |
| <Badge variant="success">推荐</Badge> | 只安装用到的集合。插件打包的是你写到的图标，不是整套。 |
| <Badge variant="error">避免</Badge> | 每个图标 import 一个组件。对外的用法是 `name`，查找交给插件。 |
| <Badge variant="error">避免</Badge> | 在已经有名字的按钮或链接里再给图标设 `label`。辅助技术会把名字读两遍。 |
| <Badge variant="error">避免</Badge> | 运行时拼接名字，却不调用 `addCollection` 或 `addIcon`。插件看不到这个名字，图标会是空的。 |

## 示例

<DemoExample
  :demo="iconBasic"
  description="上面是 md 尺寸的 carbon:search。下面两行没有设 size，settings 跟在正文和大号文字后面，字号变了，图标跟着变。"
  locale="zh"
  title="基础"
/>

<DemoExample
  :demo="iconSizes"
  description="以 16px 为根字号时，xsm 是 12px，sm 是 16px，md 是 20px，lg 是 24px。"
  locale="zh"
  title="尺寸"
/>

<DemoExample
  :demo="iconSemantic"
  description="语义色。primary、secondary、tertiary、disabled 跟着文字的层次走。accent、success、error、warning 本身带有含义。"
  locale="zh"
  title="语义色"
/>

<DemoExample
  :demo="iconPalette"
  description="用来分组的色板。这些颜色不表示状态。"
  locale="zh"
  title="色板"
/>

<DemoExample
  :demo="iconStatus"
  description="状态行同时有图标和文字。文字已经说明发生了什么，图标是装饰，不需要 label。"
  locale="zh"
  title="状态"
/>

<DemoExample
  :demo="iconButton"
  description="放在 Button 的前置槽和后置槽、IconButton，以及输入框的开头和结尾。都没有设 size，盒子由槽决定。"
  locale="zh"
  title="在按钮里"
/>

## 无障碍

- 不传 `label` 时，根元素是 `aria-hidden="true"`，里面的 SVG 也隐藏。
- `label` 非空时，根元素变为 `role="img"` 并带上 `aria-label`，同时去掉 `aria-hidden`。没有相邻文字的状态图标才需要它。
- 空字符串的 `label` 仍按装饰处理。
- 父级按钮或链接已经有名字时，不要再设 `label`。
- 图形使用 `currentColor`。只在元素上写死一个十六进制颜色，不会跟着主题走；要换色就用 `color`。
