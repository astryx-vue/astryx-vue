---
title: CSS 变量与样式分层
---

# CSS 变量与样式分层

astryx-vue 的主题与组件样式基于标准 CSS 规范构建（采用 CSS 变量与 `@layer` 级联层）。无需额外安装 UnoCSS、Tailwind CSS 或 StyleX 编译器，即可获得明确的样式特异性分层。

## 五个样式级联层（@layer）

为了保障自定义业务样式与组件内置样式层级清晰，在 `packages/themes/neutral/base.css` 顶部预先声明了五个级联层的顺序：

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

从左至右，层级优先级依次递增：

1. **`astryx.reset`（样式重置层）**：最底层的原生元素规范化样式。
2. **`astryx.tokens`（设计令牌层）**：定义通用的颜色、字号、圆角和间距等 CSS 变量。
3. **`astryx.base`（全局基础层）**：基础排版与全局基础规则。
4. **`astryx.components`（组件结构层）**：`@astryx-vue/core` 中所有组件的骨架、布局与默认样式。
5. **`astryx.overrides`（用户覆盖层）**：业务自定义样式放置区域。排在最右侧，优先级高于前序内置层。

**优先级规则**：声明在后方级联层中的规则自动覆盖前方级联层；而在任何 `@layer` 外部编写的未分层普通 CSS，优先级天然高于所有分层样式。

## 变量命名与双模配色

所有通用设计变量的命名直接对齐 Astryx 规范，并统一包含 `--astryx-` 前缀。

例如文本主色变量名为 `--astryx-color-text-primary`，其定义方式如下：

```css
--astryx-color-text-primary: light-dark(#171717, #fafafa);
```

`light-dark()` 函数依据当前元素的 `color-scheme` 属性自动在浅色（第一个参数）和深色（第二个参数）之间计算结果。Neutral 主题在 `:root` 和 `[data-astryx-theme='neutral']` 声明了 `color-scheme: light dark`，因此默认能够自动跟随操作系统或容器的明暗模式切换。强制指定模式的配置见 [深色模式配置指南](/guide/dark-mode)。

## 组件专用变量与全局语义变量

除全局 `--astryx-color-*` 这类语义变量外，部分组件拥有各自细分的组件级变量（例如按钮背景色 `--astryx-button-primary-background`）：

- **常规样式调整**：优先修改全局语义变量（如文字前景色、基础圆角），实现全站组件样式的统一更新。
- **特定组件定制**：仅在针对特定组件进行独立视觉调整时，再针对性覆盖组件级专用变量。

## 滚动条样式变量

包裹 [`ScrollbarsProvider`](/components/scrollbars-provider) 后，滚动条外观由以下变量控制。这些变量具备基于主题令牌的默认值：

| 变量 | 默认值 | 作用 |
| --- | --- | --- |
| `--astryx-scrollbar-size` | `10px` | 滚动条粗细 |
| `--astryx-scrollbar-thumb` | 次要文字色 45% | 滑块颜色 |
| `--astryx-scrollbar-thumb-hover` | 次要文字色 70% | 悬停和拖动时的滑块颜色 |
| `--astryx-scrollbar-track` | `transparent` | 轨道背景 |
| `--astryx-scrollbar-radius` | `9999px` | 轨道和滑块圆角 |

上述变量支持在任意父级元素上配置，作用域限制在其子树内部。完整说明与示例见 [组件页](/components/scrollbars-provider)。

## 样式引入方式

### 方式一：按需引入（推荐）

通过组件子路径（例如 `@astryx-vue/core/Button`）导入单个组件时，打包工具会自动按需引入该组件所需的结构样式。在应用根入口引入一次主题样式文件即可：

```ts
import '@astryx-vue/themes/neutral.css'
```

### 方式二：全量引入结构样式

若需一次性准备好所有组件的结构样式，可在入口处引入全量样式文件：

```ts
import '@astryx-vue/core/styles.css'
import '@astryx-vue/themes/neutral.css'
```

更多配置细节请参阅 [主题与样式使用指南](/guide/styling)。
