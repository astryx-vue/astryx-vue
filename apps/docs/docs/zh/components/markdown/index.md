---
layout: component-docs
title: Markdown
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import {
  markdownCited,
  markdownCompact,
  markdownNumbered,
  markdownPlugins,
  markdownRich,
  markdownTable,
} from '../../../../components/demos/markdown'
</script>

## 使用方法

`Markdown` 把 Markdown 源码渲染成正文。标题、段落、强调、链接、行内代码、代码块、引用、列表、任务列表、表格、分隔线和图片都可以用。表格、删除线和任务列表按 GFM 处理。尖括号里的网址和邮箱一直是链接。裸网址、`www.` 开头的主机名和裸邮箱，要等 `autolink` 设为 `gfm` 才变成链接。句末的标点留在链接外面。

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

`plugins` 挂在解析之后的语法树上。`transform` 拿到根节点，返回下一棵树；没有改动时把原来的根返回去，流式渲染才能继续复用已经稳定的块。`render` 画出 `type` 为 `extension`、并且 `plugin` 等于这个名字的节点。`inlinePlugins` 只在普通文本里做匹配，`pattern` 要带 `g`。列表里靠前的先匹配，同一位置重叠时前面的赢。行内代码和围栏代码不会被碰到。`replace` 返回替换进去的节点，返回 `null` 就跳过这次匹配。扩展节点如果带了 `name`，就由同名插件的 `render` 来画；返回一个普通的 `link` 节点时，走原来的链接渲染。

`defineMarkdownPlugin` 把插件对象原样返回，用来收窄类型。`isMarkdownExtensionNode` 用来确认一个节点是不是某个插件的扩展节点。

传入 `sources` 后，正文里的 `[id]` 和 `【id】` 会画成引用芯片。`citationStyle` 默认 `label`，芯片上是来源标题。设成 `number` 后变成带序号的小徽章，同一个 id 共用一个序号。

围栏信息是 `diff` 或 `diff-ts` 这种时，默认的代码块会打开差异层。换掉 `components.code` 时，语言字符串仍原样传进去。

`isStreaming` 打开流式模式。内容只在末尾追加时，已经闭合的块保持原来的节点，只重新解析最后一个还没写完的块。新出现的文字用 `--astryx-duration-fast-max` 淡入。系统开启「减少动态效果」时不播放淡入。

`isStreaming` 不做逐字平滑。字符级揭示用 `useStreamingText`，再把返回的字符串交给 `content`。组件不会把这段字符串再平滑一次。模拟模型输出时，把累积的原文交给 `content`，并在输出结束前保持 `isStreaming` 即可。

这一版不渲染数学公式。

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

示例和 [Astryx Markdown](https://astryx.atmeta.com/components/Markdown) 的 Examples 一一对应，顺序相同。总览卡片用英文短文，不带按钮或状态。

<DemoExample :demo="markdownCited" description="紧凑密度，标题从 h3 起。正文里的 [id] 变成引用来源芯片。" locale="zh" title="Markdown — Cited Content" />

<DemoExample :demo="markdownNumbered" description="同一批来源改用序号徽章。同一个 id 再次出现时，序号不变。" locale="zh" title="Markdown — 序号引用" />

<DemoExample :demo="markdownPlugins" description="块级插件把 Note 段画成提示，行内插件把 @名字 变成链接，autolink 打开裸网址。" locale="zh" title="Markdown — 插件" />

<DemoExample :demo="markdownCompact" description="紧凑密度，标题从 h3 起。包含代码块、列表和引用。" locale="zh" title="Markdown — Compact AI Response" />

<DemoExample :demo="markdownTable" description="列对齐按 GFM 标记。表头是次要色，只有行分隔线。" locale="zh" title="Markdown — Data Table" />

<DemoExample :demo="markdownRich" description="标题、强调、列表、链接、代码块和任务列表。" locale="zh" title="Markdown — Rich Content" />
