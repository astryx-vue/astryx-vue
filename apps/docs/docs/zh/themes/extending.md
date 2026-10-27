---
title: 扩展与自定义主题
---

# 扩展与自定义主题

`@astryx-vue/themes` 开箱自带了 7 套预设主题：Neutral（中性默认）、Butter（黄油暖金）、Chocolate（巧克力暖棕）、Gothic（哥特深邃）、Matcha（抹茶淡绿）、Stone（石板岩）与 Y2K（复古千禧）。

每一套主题均为预编译的标准 CSS 文件（例如 `butter.css`）。包内不包含复杂的运行时状态管理逻辑，加载性能高且对打包工具透明。

## 场景一：覆盖个别变量（常用推荐）

若仅需微调特定颜色或将全局圆角尺寸调大，直接在项目样式中覆盖对应的 CSS 变量即可。

**推荐做法**：将自定义样式写在 `@layer astryx.overrides` 级联层内，既可覆盖默认主题变量，又不会破坏组件的基础结构样式：

```css
/* 确保这段样式在引入 @astryx-vue/themes/neutral.css 之后加载 */
@layer astryx.overrides {
  :root {
    /* 把主文本色调深一点 */
    --astryx-color-text-primary: light-dark(#1a1a1a, #f5f5f5);
    /* 把全站组件的基础圆角改成 8px */
    --astryx-radius-element: 0.5rem;
  }
}
```

## 场景二：在页面局部区域套用计算主题

如果不是全站修改，而是希望某个特定的弹窗、侧边栏或卡片拥有一套独立生成的品牌色，可以使用 Vue 组件 [`Theme`](/components/theme)，搭配 `defineTheme()` 工具函数。`color`、`typography`、`radius`、`motion` 这几项只要给几个数，就能算出一整套变量：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'

const brand = defineTheme({
  name: 'brand',
  // 一个颜色；也可以写 [浅色种子, 深色种子]，深浅两套各自从自己的种子算
  color: { accent: ['#0064E0', '#48CAE4'] },
  typography: { scale: { base: 14, ratio: 1.2 } },
  radius: { base: 4, multiplier: 1.5 },
})
</script>

<template>
  <!-- 外部维持默认主题 -->
  <Button label="默认风格按钮" />

  <!-- 局部子树应用新主题 -->
  <Theme :theme="brand">
    <Button variant="primary" label="品牌风格按钮" />
  </Theme>
</template>
```

`Theme` 会把这组 CSS 变量写到子树的根节点上，并且会重新绑定文字、按钮等别名，防止它们停留在外层已经算好的颜色上。

### 覆盖主题的变量

`Theme` 会将生成的变量注入至外层容器的内联 `<style>` 标签中。该规则的选择器为 `:scope.astryx-theme`，特异度相当于两个 class，且该 `<style>` 位于文档后方。若业务覆盖写在 `@layer astryx.overrides` 内且仅使用单一 class 选择器，可能因层叠特异度不足而无法生效。可选以下处理方式：

- 将覆盖规则写在未放置进 `@layer` 的普通样式中。未分层样式优先级天然高于分层样式，可直接覆盖。
- 若必须写在 `@layer astryx.overrides` 中，可在外层容器增加特异度（如 `.wrapper.wrapper.wrapper`），或在 `Theme` 外层包裹带 id 的元素并使用 `#brand .wrapper` 进行选择。`Theme` 不会把 `id` 写到它的外层元素上，所以单写 `#id` 是选不中的。

通过内嵌 `style` 属性直接声明的内联样式同样具有最高特异度。

主题名要唯一。两个 `name` 相同的 `Theme` 共用一份样式。如果它们的值不一样，后渲染的那个会对两边都生效。不同的主题请起不同的名字。

## 场景三：针对单个组件定制样式

### 使用 `components` 定制组件部位样式

`components` 对象的每个键代表换肤挂点（theme target），命名规范为 `组件名-部位`，统一为小写短横线连字符格式，例如 `button`、`card-header`、`radio-indicator`、`progress-bar-fill`。各挂点对应元素上的固定 `astryx-*` 类名。

挂点配置的键用于匹配状态条件：

- `base`：组件部位的基础默认样式。
- `variant:primary`：`variant` 等于 `primary` 的时候，对应元素上的 `[data-variant="primary"]`。
- `checked` 等状态词：匹配元素上的 `[data-checked="checked"]` 属性。
- 使用 `+` 可组合多个状态条件，需同时满足时方可生效。

```ts
const brand = defineTheme({
  name: 'brand',
  components: {
    'button': { 'variant:primary': { borderRadius: '999px' } },
    'card-header': { base: { color: 'var(--brand-ink)' } },
  },
})
```

细节说明：

- `:hover` 伪类仅对可交互控件生效，禁用状态下的按钮不会在悬浮时触发样式改变。
- 在 `card`、`dialog`、`bottom-sheet`、`dropdown-menu`、`context-menu`、`segmented-control` 等组件中，修改 `borderRadius` 或 `padding` 会联动更新内部关联部位（如卡片标题栏圆角）。`chat` 的 `borderRadius` 与 `padding` 会作用于输入区域，`progress-bar-mark` 的 `width` 与 `height` 会同步至刻度指示线。

### 弃用的旧版挂点命名

上游自 0.7.0 版本起移除了旧版组件键名，本项目已同步对齐。驼峰式命名（如 `buttonIcon`）或大写开头（如 `Card`）会在编译阶段直接报错；无连字符的拼接旧名（如 `progressbar`）虽不报错但已无法匹配任何样式规则。请对照下表更新为新命名：

| 已删除 | 请改用 |
| --- | --- |
| `base-table` | `table` |
| `checkbox` | `checkbox-indicator` |
| `codeblock`、`codeblock-copy-button`、`codeblock-header`、`codeblock-title` | `code-block`、`code-block-copy-button`、`code-block-header`、`code-block-title` |
| `date-input-clear-icon`、`date-range-input-clear-icon`、`multi-selector-clear-icon`、`selector-clear-icon` | `input-clear-icon` |
| `hovercard` | `hover-card` |
| `navicon` | `nav-icon` |
| `popover-surface` | `popover` |
| `progressbar`、`progressbar-fill`、`progressbar-mark`、`progressbar-track` | `progress-bar`、`progress-bar-fill`、`progress-bar-mark`、`progress-bar-track` |
| `radio`、`radio-dot` | `radio-indicator`、`radio-indicator-dot` |
| `statusdot` | `status-dot` |
| `textarea` | `text-area` |

组件不再生成 `.primary`、`.sm` 等裸样式类名。若已有业务 CSS 中使用了 `.astryx-button.primary`，需修改为属性选择器语法 `.astryx-button[data-variant="primary"]`。

### 直接覆盖组件专用变量

如果你只想覆盖单个组件的颜色，也可以直接改它的专属变量。例如 `packages/themes/neutral/button.css` 里，按钮背景对应的是 `--astryx-button-primary-background`：

```css
@layer astryx.overrides {
  .special-container {
    --astryx-button-primary-background: light-dark(#4338ca, #6366f1);
  }
}
```

## 进阶：主题自己的变量、环境适配和继承

### 主题局部变量 `localTokens`

有些值只有你这一套主题用得上，比如品牌的墨水色。把它放进 `localTokens`，键就是完整的 CSS 变量名，原样保存，不会加前缀：

```ts
defineTheme({
  name: 'brand',
  localTokens: { '--brand-ink': ['#0A2540', '#E6F0FF'] },
  components: { 'card-header': { base: { color: 'var(--brand-ink)' } } },
})
```

不能拿共享的名字（比如 `--color-accent`）来当局部变量，因为组件已经在读它了。继承这套主题的子主题会一起继承局部变量，也可以改它们的值。局部变量之间不能互相引用成一个圈，否则会报错。

### 按环境调整 `adaptations`

有时候只想在某些环境下换一组值，比如「手机这类触屏、而且屏幕比较窄的时候，正文字号放大一点」。`adaptations.rules` 是一串按顺序排好的规则，每条写成 `{ when, value }`：

```ts
defineTheme({
  name: 'brand',
  typography: { scale: { base: 14, ratio: 1.2 } },
  adaptations: {
    rules: [{
      when: { pointer: 'coarse', width: { below: 'lg' } },
      value: { typography: { scale: { base: 16, ratio: 1.1736 } } },
    }],
  },
})
```

- `when` 可以写屏幕宽度范围（用断点名：`sm` 640、`md` 768、`lg` 1024、`xl` 1280、`2xl` 1536，单位都是 CSS 像素，可以用 `widthBreakpoints` 改）、`pointer`（`coarse` 粗指针，也就是手指；`fine` 细指针，也就是鼠标）、`contrast`（对比度偏好）、`motion`（是否减弱动效）。同一条 `when` 里写的条件要全部满足。
- `value` 能写的东西和主题本身一样。只写了一半的字号阶梯、圆角或动效，缺的部分会从主题自己的设置里补上。
- 规则按顺序在主题之后生效，同时满足好几条时，后面的赢。
- 这些规则只通过 CSS 生效，`useTheme().token()` 读到的始终是主题本身的值。
- 规则里的变量排在根 token 后面，选择器和根 token 一样，所以条件成立时按层叠顺序盖过根值，没有用 `!important`。想覆盖它，请看下面的「覆盖主题的变量」。

### 继承 `extends`

`extends` 会把另一套主题算好的东西全部带过来：变量、局部变量、组件样式、`onDark` 和 `onLight`、环境规则、图标和指示器。新主题自己写的值优先。继承来的环境规则会按新主题的字号阶梯重新算一遍。

### 写错的值会被丢掉

如果某个值会提前结束这条 CSS 声明，比如 `red; } body { display: none`，它会被丢掉，控制台里会有一条警告，主题里其他的值照常生效。看起来奇怪但其实合法的 CSS，比如引号里的分号、data URL，会原样保留。

## 注意事项

1. **不需要另外准备深浅两套样式表：** 因为变量本身采用 `light-dark()` 机制，覆盖时也推荐同时写下浅色和深色两个取值。
2. **多主题隔离：** 预设主题除了 Neutral 会同时挂在 `:root` 上，其他 6 套都是通过属性选择器 `[data-astryx-theme='...']` 局部隔离的，多主题并存时互不干扰。关于明暗切换的完整细节，请参阅 [深色模式配置](/guide/dark-mode)。
3. **Tailwind：** 本包不提供 Tailwind 桥接文件。样式本身就是普通的 CSS 变量和 `@layer`，Tailwind 或 UnoCSS 项目可以直接写 `bg-[var(--astryx-color-background-surface)]`，或者在自己的主题配置里做映射。
