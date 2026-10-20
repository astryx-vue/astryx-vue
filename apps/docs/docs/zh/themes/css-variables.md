---
title: CSS 变量与样式分层
---

# CSS 变量与样式分层

astryx-vue 的所有主题和组件样式，完全基于现代 CSS 标准规范构建（采用 CSS 变量与 `@layer` 级联层）。这意味着你的项目不需要安装 UnoCSS、Tailwind CSS，也不需要安装 StyleX 编译器，就能原生获得清晰可控的样式优先级。

## 样式的五个层级（@layer）

为了防止自定义样式和组件内置样式“打架”，我们在 `packages/themes/neutral/base.css` 开头预先规定了五个样式的加载顺序：

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

从左到右，优先级依次由低到高递增：

1. **`astryx.reset`（重置层）：** 最底层的基准样式。
2. **`astryx.tokens`（设计令牌层）：** 定义通用的颜色、字号、圆角和间距等 CSS 变量。
3. **`astryx.base`（全局基础层）：** 网页的基础排版和通用样式规则。
4. **`astryx.components`（组件结构层）：** `@astryx-vue/core` 中所有组件的基础结构、布局与默认外观。
5. **`astryx.overrides`（用户覆盖层）：** 留给你在项目中写业务自定义样式的地方。排在最右侧，保证你写的样式能够稳稳压过前面所有默认样式。

**规则很直观：** 排在更靠后层级的样式，会自动覆盖排在前面的层级；而在 `@layer` 之外手写的未分层普通 CSS，优先级比所有分层样式都高。

## 变量命名与双模配色

所有通用设计变量的命名直接对应 Astryx 原始规范，并统一带上 `--astryx-` 前缀。

例如，文本主色的变量名就是 `--astryx-color-text-primary`。它的值定义如下：

```css
--astryx-color-text-primary: light-dark(#171717, #fafafa);
```

`light-dark()` 函数会根据当前元素的 `color-scheme` 属性自动在浅色（第一个值）和深色（第二个值）之间切换。Neutral 主题在 `:root` 和 `[data-astryx-theme='neutral']` 上声明了 `color-scheme: light dark`，因此默认能够自动跟随操作系统或文档站的明暗开关变化。如果需要强制某一侧，请参阅 [深色模式配置指南](/guide/dark-mode)。

## 组件专用变量 vs 全局语义变量

除了全局的 `--astryx-color-*` 这类语义变量，部分组件还拥有自己的细分变量（例如按钮的背景色 `--astryx-button-primary-background`）：

- **平时换外观：** 强烈建议优先修改全局语义变量（如改变文字主色、基础圆角），这样整个系统的所有组件都能整齐划一地改变。
- **个别组件特殊定制：** 只有当你只想让某个组件“特立独行”时，才去针对性地覆盖它自己的专用变量。

## 如何引入样式

### 方式一：按需引入（推荐）

当你从组件子路径（例如 `@astryx-vue/core/Button`）引入单个组件时，该组件所需的骨架样式会自动打包并加载进来。你只需要在应用根入口引入一次主题样式文件即可：

```ts
import '@astryx-vue/themes/neutral.css'
```

### 方式二：一次性引入全部组件结构样式

如果你希望一次性把所有组件的结构样式都准备好，可以显式引入全局包样式：

```ts
import '@astryx-vue/core/styles.css'
import '@astryx-vue/themes/neutral.css'
```

更多细节请查阅 [主题与样式使用指南](/guide/styling)。
