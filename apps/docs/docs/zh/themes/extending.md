---
title: 扩展主题
---

# 扩展主题

`@astryx-vue/themes` 的导出是 `neutral.css`、`fonts.css`，以及 `neutral/` 目录里的各份样式。包里没有第二个主题，也没有运行时的主题注册函数。原版文档里的 butter、chocolate 等主题不是这个包提供的。

要改外观，覆盖 CSS 变量。把覆盖放在 `astryx.overrides` 层，这样会压过 token 层，又不会打乱组件的结构样式：

```css
@layer astryx.overrides {
  :root {
    --astryx-color-text-primary: light-dark(#1a1a1a, #f5f5f5);
    --astryx-radius-element: 0.5rem;
  }
}
```

这条样式要排在 `@astryx-vue/themes/neutral.css` 之后。只想改一个子树时，可以把同一批变量写在那个子树上。Neutral 的变量选择器已经包含 `[data-astryx-theme='neutral']`，所以这个属性可以标在子树上；因为选择器里同时有 `:root`，引入主题之后，变量默认仍然是全局的。

某个组件要单独偏离时，覆盖它在 `packages/themes/neutral/<组件>.css` 里的变量，例如 `--astryx-button-primary-background`。名字以那份文件为准。

不建议复制一份 `neutral.css` 再改选择器来假装新主题。组件主题文件里的选择器写的是 `neutral`。在官方提供下一个主题入口之前，支持的扩展方式就是覆盖 `--astryx-*` 变量。

明暗不要另做一套色板文件。颜色已经在 `light-dark()` 里。切换方式见 [深色模式](/guide/dark-mode)。
