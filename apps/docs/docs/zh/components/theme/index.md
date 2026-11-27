---
layout: component-docs
title: 主题
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { themeApply, themeNested, themeSwitcher } from '../../../../components/demos/theme'
</script>

## 使用方法

`Theme` 本身就是主题提供者。它把 `defineTheme()` 返回的主题写到子树的 CSS 变量上，子组件用 `useTheme()` 读取。没有另外一个 Provider 组件。

token 名可以用原版的 `--color-accent`，也可以用这个包的 `--astryx-color-accent`。`[浅色, 深色]` 会写成 `light-dark()`。`mode` 默认是 `system`，也可以是 `light` 或 `dark`。`system` 的 Theme 取外面页面的明暗：先看页面根的 `color-scheme`，没有就看 `<meta name="color-scheme">`；根上两种都写了（`reset.css` 就这样写）时才看读者的系统设置。它自己不声明配色，所以宿主把页面画成深色时，里面也跟着是深色主题。被强制了浅色或深色的 `Theme` 包着时，里面的 `system` 又回到跟随读者。详见[深色模式](/guide/dark-mode)。最外层的 `Theme` 会把 `data-astryx-theme` 和 `data-astryx-color-mode` 同步到 `document.documentElement`，嵌套的不会。

主题对象上的 `syntax` 给这棵子树里的代码上色。更近的 `SyntaxTheme` 优先。从 `@astryx-vue/core/Theme` 引入。

```vue
<script setup lang="ts">
import { defineTheme, Theme } from '@astryx-vue/core/Theme'

const ocean = defineTheme({
  name: 'ocean',
  tokens: {
    '--color-accent': ['#0077B6', '#48CAE4'],
    '--color-background-surface': ['#F0F8FF', '#0A1628'],
    '--color-text-primary': ['#0A1317', '#FFFFFF'],
    '--radius-container': '16px',
  },
})
</script>

<template>
  <Theme :theme="ocean">
    <p>Ocean</p>
  </Theme>
</template>
```

`neutralTheme` 是不覆盖 token 的主题。颜色仍然来自 `@astryx-vue/themes/neutral.css`。七套现成主题也仍是手写 CSS，不会改成下面这套生成结果。

`Theme` 里没有自己设字号和行高的文字，取主题的正文字号和正文行高（`--text-body-leading`），所以 Card、Stack 里的普通文字会跟着主题变。想保留别的行高，就在自己的容器上设一个。

## 从几个数生成

`color`、`typography`、`radius`、`motion` 会算出一批 token，写进主题对象。同名的 `tokens` 优先。`var(--color-accent)` 这种引用会改成带 `--astryx-` 前缀的名字。

`color.accent` 是一个十六进制颜色，也可以写成 `[浅色, 深色]`。调色板按 HCT 来：色相和彩度取自种子色，明度走固定阶梯，再配成浅色和深色。不写 accent、只写 `neutralStyle` 时，强调色保持原样，只重算中性色。`--color-on-accent` 按种子色算好对比色；弱化色、文字强调色和图标强调色则引用 `--color-accent`，所以后面改强调色时它们会跟着走。

字号用 `typography.scale` 的 `base` 和 `ratio`，按 `base × ratio` 的步长取整。圆角用 `radius` 的 `base` 和 `multiplier`，`none` 和 `full` 不动。时长用 `motion` 的 `fast`、`medium`、`slow` 和 `ratio`。最小档是基准乘以 ratio，最大档是基准除以 ratio，再取整到 5 毫秒。`motion` 也可以只写 `tempo`（整体快慢，0.75 到 1.5）和 `character`（进场和移动曲线：`'crisp'`、`'standard'`、`'expressive'`），详见[动画与过渡](/guide/motion)。

`palette` 用几个种子色生成颜色。`@astryx-vue/core/palette` 里的 `themePalette()` 按 `accent`、`neutral`、`success`、`warning`、`danger`、`info` 这几个种子色（再加 `vibrancy`，0 到 100，和 `recipe`）生成一套调色板，再映射到颜色 token：表面、文字、边框、图标、强调色、四种状态色，以及各个底色上的内容色。它还会像 Neutral 那样，把强调色浅底、中性色轨道和彩色卡片上的次要文字提亮一档。显式的 `tokens` 和 `components` 仍然逐项优先。没写 `recipe` 时按 `astryx-oklch-v1` 生成；写 `astryx-oklch-v2` 则让浅色档跟着 vibrancy 走。写了 `neutral` 种子并钉住 recipe，升级后生成的色阶不变；不写 `neutral` 时，表面取默认色，按对比度挑出来的色阶会跟着安装的版本走。只有引入 `@astryx-vue/core/palette` 的应用才会带上生成器。给 `palette` 传别的东西（比如一个只有种子色的普通对象），`defineTheme()` 会直接报错。

```ts
import { themePalette } from '@astryx-vue/core/palette'

const acme = defineTheme({
  name: 'acme',
  palette: themePalette({ accent: '#5b3cc4', neutral: '#6b6b70', danger: '#d1242f', vibrancy: 50 }),
  // 显式的 token 仍然优先于调色板。
  tokens: { '--color-on-accent': ['#ffffff', '#000000'] },
})
```

`components` 按换肤挂点覆盖样式，挂点写成 `组件名-部位`，比如 `button`、`card-header`。`base` 作用在挂点本身，`variant:secondary` 作用在 `[data-variant="secondary"]` 上。`Theme` 把编译结果放进 `astryx.overrides` 层，只作用在自己的 `data-astryx-theme` 子树里，遇到嵌套的主题就停下。`localTokens`、`adaptations`、已删除的旧挂点名和 `extends` 的细节，见 [扩展与自定义主题](/guide/extending-themes)。语义图标表仍然是 `icons`，按名字换成 Iconify id。

```ts
const brand = defineTheme({
  name: 'brand',
  color: { accent: '#0064E0' },
  typography: { scale: { base: 14, ratio: 1.2 } },
  radius: { base: 4, multiplier: 1 },
  motion: { fast: 125, medium: 300, slow: 700, ratio: 0.75 },
})
```

只要 token、不要组件时，也可以直接调用 `expandColorScale`、`expandTypeScale`、`expandRadiusScale`、`expandMotionScale`。它们返回的还是不带前缀的名字，交给 `defineTheme()` 的 `tokens` 即可。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | token 名带上 `--`，例如 `--color-accent` 或 `--astryx-color-accent`。 |
| <Badge variant="success">推荐</Badge> | 明暗两套颜色不同时，写成 `[浅色, 深色]`。 |
| <Badge variant="success">推荐</Badge> | 某一块区域要换一套主题时，再嵌一层 `Theme`。 |
| <Badge variant="error">避免</Badge> | 用 `Theme` 去翻转一张图片上的文字。那是 `MediaTheme` 的事。 |

## 示例


<DemoExample
  :demo="themeApply"
  description="用 Theme 包住一块子树，这块区域里的组件都改用这套主题。"
  locale="zh"
  title="Theme — Apply Theme"
/>

<DemoExample
  :demo="themeNested"
  description="嵌套的 Theme 只改里面那一块，外面的主题保持不变。"
  locale="zh"
  title="Theme — Nested Theme"
/>

<DemoExample
  :demo="themeSwitcher"
  description="用状态切换传给 Theme 的主题对象，下面的外观跟着换。"
  locale="zh"
  title="Theme — Switch Themes"
/>
