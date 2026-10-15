---
layout: component-docs
title: 代码块
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { codeBlockConfig, codeBlockDiff, codeBlockHighlighted, codeBlockScrollable, codeBlockSnippet, codeBlockTerminal } from '../../../../components/demos/code-block'
</script>

## 使用方法

`CodeBlock` 展示一段只读代码。从 `@astryx-vue/core/Code` 引入，和行内的 `Code` 在一起。`code` 字符串既是读者看到的内容，也是复制按钮写下的内容。

`language` 选择分词器。`title` 在顶栏写上文件名。`hasLineNumbers` 画出行号槽。`highlightLines` 接收从 1 开始的行号，给这些行铺一层底色。`maxHeight` 限制正文高度，超出后纵向滚动。`hasCopyButton` 在有顶栏时放在顶栏里，没有顶栏时浮在右上角。

`isDiff` 按 unified diff 给整行上色。行首 `+` 是新增，`-` 是删除，`@@` 是差异头。`---` 后面带空格、下一行是带空格的 `+++`、再下一行是 `@@` 时，前两行也是文件头。符号单独占一列，其余文本仍按 `language` 高亮。复制下去的还是原来的整段，符号也在里面。顶栏和视口名称会写成 `diff`，有语言时写成 `typescript diff` 这种。高亮行会盖住差异底色，不和它叠在一起。颜色用 `--astryx-code-syntax-added`、`--astryx-code-syntax-removed`、`--astryx-code-syntax-diff-header`，标记用对应的 `added-marker` 和 `removed-marker`，和其它语法色是同一套名字。

`SyntaxTheme` 给内部的代码块写入语法颜色变量。包里带的深色预设是 `githubDark`。浅色页面上的命令要读起来像终端时，用它包住 bash 代码块。`defineSyntaxTheme` 用同一组 token 名字再做一个预设。

```vue
<script setup lang="ts">
import { CodeBlock, githubDark, SyntaxTheme } from '@astryx-vue/core/Code'

const commands = `$ astryx init --features agents`
</script>

<template>
  <SyntaxTheme :theme="githubDark">
    <CodeBlock :code="commands" language="bash" has-copy-button width="100%" />
  </SyntaxTheme>
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | `language` 和这段代码一致。代码来自某个文件时加上 `title`。 |
| <Badge variant="success">推荐</Badge> | 一行命令不要行号。读者需要指出某一行时再打开行号。 |
| <Badge variant="success">推荐</Badge> | 教程里刚改过的几行用 `highlightLines` 标出来。已经是 diff 文本时用 `isDiff`，不要再给整行涂一层颜色。 |
| <Badge variant="success">推荐</Badge> | 命令要看起来像终端时，用 `SyntaxTheme` 套上 `githubDark`。 |
| <Badge variant="error">避免</Badge> | 用一次性 CSS 涂一个深色盒子。预设会把 token 颜色和边框一起换掉。 |
| <Badge variant="error">避免</Badge> | 把一整段说明文字放进代码块。 |


<ComponentAnatomy />

## 示例


<DemoExample
  :demo="codeBlockSnippet"
  description="短命令，带复制按钮，没有行号。适合安装说明，或读者会直接粘贴的一行命令。"
  locale="zh"
  title="Code — 片段"
/>

<DemoExample
  :demo="codeBlockHighlighted"
  description="高亮几行 TypeScript，把注意力引到关键段落。教程和变更说明里用 highlightLines 标出新增或重要的代码。"
  locale="zh"
  title="Code — 高亮"
/>

<DemoExample
  :demo="codeBlockDiff"
  description="同一段 TypeScript 按 diff 显示。新增和删除整行着色，符号后面的代码仍按 tsx 高亮。文件头和 @@ 行保持安静。"
  locale="zh"
  title="Code — 差异"
/>

<DemoExample
  :demo="codeBlockConfig"
  description="带标题栏和行号的 JSON 配置。title 在顶栏写上文件名，读者知道这段代码属于哪个文件。"
  locale="zh"
  title="Code — 配置"
/>

<DemoExample
  :demo="codeBlockScrollable"
  description="用最大高度限制长代码块，超出后纵向滚动。展示大文件时用 maxHeight，避免代码块占满整页。"
  locale="zh"
  title="Code — 可滚动"
/>

<DemoExample
  :demo="codeBlockTerminal"
  description="深色终端风格的命令块：用 SyntaxTheme 的 GitHub Dark 预设包住 bash 代码块，打开复制按钮，不显示行号。浅色页面上的 shell 会话或命令输出用这个。"
  locale="zh"
  title="Code — 终端"
/>
