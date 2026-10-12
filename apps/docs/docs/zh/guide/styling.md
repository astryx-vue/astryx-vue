---
title: 主题与样式
---

# 主题与样式

一个应用最少引入两样东西：主题，以及组件的结构样式。

```ts
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
```

`Button` 的入口会带上 `button` 的结构样式。主题入口带上 Neutral 的变量，包括按钮用到的 `--astryx-button-*`。缺了主题，组件仍有结构，但没有这套颜色和度量。缺了结构样式，变量没有对应的规则可用。

不想逐个组件带样式时，在入口加一次：

```ts
import '@astryx-vue/core/styles.css'
import '@astryx-vue/themes/neutral.css'
```

`styles.css` 汇总 `packages/core/styles/` 里的结构样式，包含共享动画 `motion.css`。`neutral.css` 汇总 `packages/themes/neutral/` 里的主题文件，并引入 JetBrains Mono。

层的顺序是：

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

应用自己的覆盖放在 `astryx.overrides`。未分层的全局 CSS 会压过这些层，所以不要用一条未分层的 `button { }` 去打所有按钮，除非你确实要盖住组件。

这套样式不要求 UnoCSS。文档站用 UnoCSS 只为了给示例里的 `i-carbon-*` 类提供图标，那是图标方案，不是组件样式的依赖。见 [图标](/guide/icons)。

变量名、`light-dark()` 和主题目前的边界，写在 [CSS 变量](/themes/css-variables) 和 [Neutral](/themes/neutral)。
