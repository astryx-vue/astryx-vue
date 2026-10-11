---
layout: component-docs
title: Markdown
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { markdownBasic, markdownRich, markdownStreaming } from '../../../../components/demos/markdown'
</script>

## 使用方法

`Markdown` 把 Markdown 源码渲染成正文。标题、段落、强调、链接、行内代码、代码块、引用、列表、任务列表、表格、分隔线和图片都可以用。表格、删除线、任务列表和自动链接按 GFM 处理。

从独立入口导入，结构样式会随组件加载。主题在应用入口引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```

```vue
<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
</script>

<template>
  <Markdown content="## 标题\n\n一段 **说明**。" />
</template>
```

`content` 没传时，默认插槽里的文本会当作源码。插槽只读取文本，不接受已经渲染好的节点。

链接会去掉控制字符。`javascript:`、`vbscript:` 和 `data:text/html` 不会变成可点击的地址，只留下链接文字。图片另外拒绝所有 `data:` 地址。原始 HTML 不会执行，标签会按普通文字显示。

代码块交给已有的 `CodeBlock`，引用交给 `Blockquote`，标题交给 `Heading`，链接交给 `Link`。列表和表格用语义元素，因为现有的 `List` 和表格组件是界面控件，不是正文排版。

`components` 可以换掉某一类节点的渲染。自定义组件通过 props 拿到节点数据，有内容的节点还会收到默认插槽。

`isStreaming` 打开流式模式。内容只在末尾追加时，已经闭合的块保持原来的节点，只重新解析最后一个还没写完的块。新出现的文字用 `--astryx-duration-fast-max` 淡入。系统开启「减少动态效果」时不播放淡入。

`isStreaming` 不做逐字平滑。字符级揭示用 `useStreamingText`，再把返回的字符串交给 `content`。组件不会把这段字符串再平滑一次。模拟模型输出时，把累积的原文交给 `content`，并在输出结束前保持 `isStreaming` 即可。

这一版没有插件协议，也不渲染数学公式。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用它排模型回复、文档摘录和说明文字。 |
| <Badge variant="success">推荐</Badge> | 流式输出时只追加文本，结束时把 `isStreaming` 设回 `false`。 |
| <Badge variant="success">推荐</Badge> | 需要逐字揭示时，只调用一次 `useStreamingText`，把结果交给 `content`。`isStreaming` 负责分块解析和淡入，不会再平滑。 |
| <Badge variant="success">推荐</Badge> | 需要限制行宽时设置 `contentWidth`。不设置时正文跟容器一样宽。 |
| <Badge variant="error">避免</Badge> | 把用户提供的 HTML 塞进源码，指望它被执行。组件会把它当成文字。 |
| <Badge variant="error">避免</Badge> | 在 `isStreaming` 为 `true` 时整段替换已经显示的内容。缓存按「只追加」设计。 |

## 示例

目录卡片上的短示例。

<DemoExample
  :demo="markdownBasic"
  description="标题、段落、强调、行内代码、链接和列表。"
  locale="zh"
  title="基本正文"
/>

<DemoExample
  :demo="markdownRich"
  description="删除线、自动链接、引用、任务列表、表格、代码块和分隔线。"
  locale="zh"
  title="GFM"
/>

<DemoExample
  :demo="markdownStreaming"
  description="按下按钮后，原文按小段追加。已写完的标题保持不动，新文字淡入。"
  locale="zh"
  title="模拟流式输出"
/>
