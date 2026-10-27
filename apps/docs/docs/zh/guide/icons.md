---
title: 图标
---

# 图标

在 astryx-vue 中，你可以直接使用 `Icon` 组件配合标准的 Iconify 图标名称来展示图标，再也不需要为每一个小图形单独繁琐地 `import` 不同的组件文件。

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <Icon name="carbon:settings" />
</template>
```

这里的 `carbon:settings` 表示 Carbon 图标集合中的 settings 图标。在图标集合注册后，你也可以写成中划线形式 `carbon-settings`；若集合本身的 ID 带中划线（如 `material-symbols`），则必须保留冒号，例如 `material-symbols:home`。

## 按需打包：只打包用到的图标

为了不给你的项目增加体积，`@astryx-vue/core` 核心包自身不内置全量图标库。你只需安装自己喜欢的图标包，并配置一个 Vite 插件：

```bash
pnpm add -D @iconify-json/carbon
```

在 `vite.config.ts` 中配置插件：

```ts
import { astryxIcons } from '@astryx-vue/core/icons'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), astryxIcons()],
})
```

这个插件会读取离它最近的 `package.json` 中的 `@iconify-json/*` 依赖，静态扫描你的 Vue 模板中写到的静态图标名，并为用到的每个图标按需生成模块。最终打包进浏览器的，只有你实际用到的这几个 SVG 图标，而不是整套几万个图标的庞大文件。如果你的 Vite 根目录没有 `package.json`（比如 VitePress 文档站常设在子目录），插件会自动向上查找。

如果你还想用另一套图标（比如 Lucide），只需要再装一个包：`pnpm add -D @iconify-json/lucide`，然后在模板里直接写 `name="lucide:settings"` 即可。这完全基于标准构建，**不需要**引入 UnoCSS。

如果你只想让插件扫描指定的某几套图标集，可以传入过滤参数：`collections: ['carbon']`。

## 动态生成的图标名称

如果某个图标的名字是在 JavaScript 运行时动态拼接出来的（例如从后端接口返回，或者由变量组装而成），Vite 插件在静态构建阶段就无法提前发现它。

针对这种动态场景，你可以在应用初始化入口处，提前将整套图标集合注册进来（注意：这会把整套集合的数据打包进构建产物）：

```ts
import { addCollection } from '@astryx-vue/core/Icon'
import carbon from '@iconify-json/carbon/icons.json'

// 注册整套图标集合
addCollection(carbon)
```

如果你只想注册单独某一个动态图标的数据，可以使用 `addIcon('carbon:settings', data)` 单独注册这一枚。

## 插槽搭配与尺寸

默认情况下，不传 `size` 属性时，图标会自适应当前文本的行内大小（`1em`），颜色也会自动继承当前文本的颜色（`currentColor`）。

很多组件已经为图标预留了专用的插槽。例如 `Button` 的 `icon`（前缀）与 `end`（后缀）插槽、`IconButton` 纯图标按钮，以及各类输入框的前后插槽，这些位置都提前定好了大小盒子，放进去的 `Icon` 会自动对齐：

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

> **无障碍提醒**：纯装饰性的图标对读屏软件是默认隐藏的。只有当这个图标本身承担传达含义的职责（且旁边没有文字）时，才需要显式设置 `label` 属性。

## 兼容 CSS 类名图标

如果你的项目原本习惯使用 CSS 类名（例如 Tailwind、UnoCSS 的纯 CSS 图标），组件库的 `icon` 属性、导航与菜单上的 `iconClass` 属性依然完全兼容传入 CSS 类名。只要你的构建工具能够生成对应的类名样式，图形就能正常显示。不过，在全新项目中，我们最推荐使用上面提到的静态 `name` 方案。

## 语义化图标（跟随主题自由切换）

组件库内部有许多需要图标的场景（例如下拉箭头的展开折叠、搜索框的放大镜、对话框的关闭十字叉等）。我们并没有死板地把它们写死为某一种特定形状，而是使用「语义名」（例如 search、close、check）来进行逻辑描述。

默认情况下，这些语义名会自动对准 Lucide 图标集对应的图形；如果你的项目没有注册 Lucide，组件会降级绘制精简的内置基础矢量图形，不会显示成空白。

你也可以把整套语义图标绑定在主题配置中。通过 `defineTheme({ icons })`，你可以将语义名映射到任意你喜欢的 Iconify 图标集：

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'

// 创建一个使用 Carbon 图标的主题定制
const carbonTheme = defineTheme({
  name: 'withCarbon',
  icons: {
    search: 'carbon:search',
    close: 'carbon:close',
  },
})
</script>

<template>
  <Theme :theme="carbonTheme">
    <!-- 这里传入的是语义名 "search"，它会自动解析并渲染出 carbon:search -->
    <Icon icon="search" />
  </Theme>
</template>
```

如果你想在代码里读取当前生效的语义图标 ID，可以使用从 `@astryx-vue/core/Icon` 导出的 `useSemanticIcon` 组合式函数。完整的语义名称列表与默认对应关系，可查阅图标组件的 API 属性页。
