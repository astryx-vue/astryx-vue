---
title: 排版与字体
---

# 排版与字体

字体分两套栈，都写在 Neutral 的语义 token 里。

`--astryx-font-family-body` 和 `--astryx-font-family-heading` 以 Figtree 开头，后面是 `-apple-system`、`BlinkMacSystemFont`、`Segoe UI`、`Roboto`、`Helvetica`、`Arial`、`sans-serif`。`--astryx-font-family-code` 以 JetBrains Mono 开头，后面是 `ui-monospace`、`SFMono-Regular`、`Menlo`、`Consolas`、`monospace`。

主题包只加载 JetBrains Mono，字重 400、500、600、700，以及 400 斜体。Figtree 不在 `@astryx-vue/themes` 里。文档站自己用 `@fontsource/figtree` 加载了 400、500、600、700 和部分斜体。应用里要出现 Figtree，需要自己引入字体文件；不引入时，字体会落到栈里后面的系统字体。

字重 token 是 `--astryx-font-weight-normal`（400）、`medium`（500）、`semibold`（600）、`bold`（700）。`--astryx-font-weight-regular` 指向 `normal`，组件已经在用这个名字。原版对应的变量名是 `normal`。

`Text` 和 `Heading` 的 `type` 对上 `--astryx-text-*` 这组尺寸、字重和行高，包括 `display-1` 到 `display-3`、标题 1 到 6，以及 body、large、label、code、supporting。显示字号的字重 token 是 400，靠尺寸而不是加粗拉开层次。

<TokenReference locale="zh" :sections="['font', 'type']" />
