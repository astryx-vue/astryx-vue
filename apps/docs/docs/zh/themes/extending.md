---
title: 扩展主题
---

# 扩展主题

`@astryx-vue/themes` 提供 Neutral、Butter、Chocolate、Gothic、Matcha、Stone 和 Y2K。每一套都是类似 `butter.css` 的入口，加上该主题目录里的样式。包里没有运行时的主题注册函数。

要改外观，覆盖 CSS 变量。把覆盖放在 `astryx.overrides` 层，这样会压过 token 层，又不会打乱组件的结构样式：

```css
@layer astryx.overrides {
  :root {
    --astryx-color-text-primary: light-dark(#1a1a1a, #f5f5f5);
    --astryx-radius-element: 0.5rem;
  }
}
```

这条样式要排在主题样式之后，例如 `@astryx-vue/themes/neutral.css`。只想在 Vue 里改一个子树时，用 [`Theme`](/components/theme) 包住它，并传入 `defineTheme()` 的结果。它会把变量写到这棵子树上，并重新绑定文字、标题和按钮的别名，避免这些别名停在 `:root` 上已经算好的颜色。

要从一个强调色、一组字号比例、圆角或时长生成整份 token，用 `defineTheme()` 的 `color`、`typography`、`radius` 和 `motion`。现成的七套主题仍然是手写 CSS。

每套主题都选择 `[data-astryx-theme='…']`。Neutral 同时还选择 `:root`，所以引入 `neutral.css` 之后变量是全局的。其余主题只挂在这个属性上。

某个组件要单独偏离时，覆盖它在该主题组件文件里的变量，例如 `packages/themes/neutral/button.css` 里的 `--astryx-button-primary-background`。名字以那份文件为准。

扩展方式是覆盖 `--astryx-*` 变量。包里的主题已经按各自的属性做了这件事。

明暗不要另做一套色板文件。颜色已经在 `light-dark()` 里。切换方式见 [深色模式](/guide/dark-mode)。
