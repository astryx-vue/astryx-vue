---
title: 主题
outline: false
footer: false
---

Neutral 是目前提供的主题。页面和组件通过下面这行样式使用它：

```ts
import '@astryx-vue/themes/neutral.css'
```

`--astryx-font-family-code` 以 JetBrains Mono 开头，后面是 `ui-monospace`、`SFMono-Regular`、`Menlo`、`Consolas` 和 `monospace`。主题本身不下载这套字体。需要字形文件时再单独引入：

```ts
import '@astryx-vue/themes/fonts.css'
```

`fonts.css` 加载 JetBrains Mono 的 400、500、600、700，以及 400 斜体。`neutral.css` 不会把它带进来。这些字重和斜体对应 `font-synthesis: none`：缺了的字重或斜体，浏览器不会自己造。

语义变量写在 `packages/themes/neutral/base.css`。名字对应原版 `tokens.stylex.ts`，统一加上 `--astryx-` 前缀。浅色和深色放在同一个 `light-dark()` 里。取值优先用 Neutral 主题覆盖过的结果；Neutral 没有覆盖的，用原版默认值。

有几个同名变量仍写在组件自己的主题文件里，例如 `text.css` 的字号，以及 `--astryx-color-text-accent` 的蓝色。那些声明排在后面，会盖住这里的语义值，所以现有组件的外观不变。后面的主题改造会把重复声明收掉。

<TokenReference locale="zh" />
