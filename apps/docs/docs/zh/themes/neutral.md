---
title: Neutral
---

# Neutral

Neutral 是 `@astryx-vue/themes` 目前提供的主题。页面和组件通过下面这行样式使用它：

```ts
import '@astryx-vue/themes/neutral.css'
```

这个入口会先加载 `fonts.css`，再按文件名引入 `neutral/` 目录里的每一份主题样式，其中包含 `base.css`。`fonts.css` 只装 JetBrains Mono 的 400、500、600、700，以及 400 斜体。这些字重和斜体对应 `font-synthesis: none`：缺了的字重或斜体，浏览器不会自己造。

`--astryx-font-family-code` 以 JetBrains Mono 开头，后面是 `ui-monospace`、`SFMono-Regular`、`Menlo`、`Consolas` 和 `monospace`。

语义变量写在 `packages/themes/neutral/base.css`。名字对应原版 `tokens.stylex.ts`，统一加上 `--astryx-` 前缀。浅色和深色放在同一个 `light-dark()` 里。取值优先用 Neutral 主题覆盖过的结果；Neutral 没有覆盖的，用原版默认值。

有两个值和原版 Neutral 故意保持不一致，避免已经发出去的组件改外观：

- `--astryx-radius-none` 保持 `0`。原版 Neutral 写成 `0.25rem`。方形头像和圆角为 none 的骨架屏用它表示直角。
- `--astryx-color-text-secondary` 的浅色值保持 `#525252`。原版 Neutral 用 `#737373`。输入框、选择器和辅助文字已经在用这个值。

变量挂在 `:root` 和 `[data-astryx-theme='neutral']` 上，并声明 `color-scheme: light dark`。明暗跟随元素的 `color-scheme`。要用其中一边，在祖先上设置 `data-astryx-color-mode="light"` 或 `"dark"`。说明见 [深色模式](/guide/dark-mode)。

有几个同名变量仍写在组件自己的主题文件里，例如 `text.css` 的字号，以及 `--astryx-color-text-accent` 的蓝色。那些声明排在后面，会盖住这里的语义值，所以现有组件的外观不变。后面的主题改造会把重复声明收掉。
