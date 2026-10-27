---
title: 图标
---

# 图标

在 astryx-vue 中，可以使用 `Icon` 组件配合标准 Iconify 图标标识渲染图标，无需为每个图标单独 `import` 组件文件。

```vue
<script setup lang="ts">
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <Icon name="carbon:settings" />
</template>
```

这里的 `carbon:settings` 表示 Carbon 图标集合中的 settings 图标。在图标集合注册后，也可以写为中划线形式 `carbon-settings`；若集合本身的 ID 包含中划线（如 `material-symbols`），则必须保留冒号分隔符，例如 `material-symbols:home`。

## 按需打包：只打包用到的图标

为避免引入冗余体积，`@astryx-vue/core` 核心包本身不内置全量图标库。只需安装所需的图标数据集，并配置 Vite 插件：

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

该插件会读取当前或上层目录 `package.json` 中的 `@iconify-json/*` 依赖，静态扫描 Vue 模板中声明的静态图标名称，并按需生成对应图标的虚拟模块。最终打包产物中仅包含实际引用的 SVG 图标数据。若 Vite 根目录未放置 `package.json`（例如 VitePress 文档位于子目录），插件会自动向上递归查找。

若需使用其它图标库（如 Lucide），安装对应包后即可直接引用：`pnpm add -D @iconify-json/lucide`，模板中直接书写 `name="lucide:settings"`。该流程基于标准构建管道，无需引入 UnoCSS。

若需限制插件的扫描范围，可通过参数指定：`collections: ['carbon']`。

## 动态生成的图标名称

若图标名称由 JavaScript 在运行时动态拼接生成（例如接口返回或变量计算），静态构建工具无法在编译期进行静态提取。

针对动态场景，可在应用初始化阶段提前注册整个图标集合（注意：此操作会将整套图标集合打包进产物）：

```ts
import { addCollection } from '@astryx-vue/core/Icon'
import carbon from '@iconify-json/carbon/icons.json'

// 注册整套图标集合
addCollection(carbon)
```

若仅需注册单个动态图标，可使用 `addIcon('carbon:settings', data)` 单独注册该图标数据。

## 插槽搭配与尺寸

默认情况下，未传递 `size` 属性时，图标字号继承当前文本字号（`1em`），颜色继承当前文本颜色（`currentColor`）。

多个组件为图标预留了专用插槽。例如 `Button` 的 `icon`（前缀）与 `end`（后缀）插槽、`IconButton` 纯图标按钮，以及表单输入组件的前后置插槽。这些插槽已内置规范的尺寸约束，放入的 `Icon` 会自动居中对齐：

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

> **无障碍提醒**：纯装饰性图标对屏幕阅读器默认隐藏。仅当图标独立承担信息传达职责（且周围无伴随文本）时，才需要显式设置 `label` 属性。

## 兼容 CSS 类名图标

若项目习惯使用基于 CSS 类名的图标方案（如 Tailwind 或 UnoCSS 的纯 CSS 图标），组件库的 `icon` 属性、导航与菜单上的 `iconClass` 属性依然完全兼容传入 CSS 类名。只要构建工具能生成对应的类名样式即可正常渲染。全新项目推荐优先使用上述静态 `name` 属性方案。

## 语义化图标（跟随主题配置切换）

组件库内部包含多处内置图标（例如下拉箭头的展开折叠、搜索框放大镜、对话框关闭按钮等）。这些图标使用语义名称（例如 search、close、check）进行抽象描述。

默认情况下，这些语义名称映射至 Lucide 图标集；若项目中未注册 Lucide，组件会自动降级渲染内置的简易基础矢量图形。

此外，语义图标支持在主题中统一定义。通过 `defineTheme({ icons })`，可以将内置语义名映射到指定的 Iconify 图标集：

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

如需在代码中读取当前生效的语义图标标识，可使用 `@astryx-vue/core/Icon` 导出的 `useSemanticIcon` 组合式函数。完整的语义名称列表与默认对应关系见图标组件的 API 文档。
