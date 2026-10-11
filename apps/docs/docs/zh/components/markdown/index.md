---
layout: component-docs
title: Markdown
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import {
  markdownAlignCenter,
  markdownAlignStart,
  markdownAutolinks,
  markdownBlockquote,
  markdownCodeBlock,
  markdownCompact,
  markdownContentWidth,
  markdownContinuations,
  markdownDivider,
  markdownEmphasis,
  markdownHeadings,
  markdownImages,
  markdownInline,
  markdownInlineCode,
  markdownLinks,
  markdownNestedLists,
  markdownOrderedList,
  markdownShifted,
  markdownStreaming,
  markdownTable,
  markdownTableApi,
  markdownTableComparison,
  markdownTableEdges,
  markdownTableProse,
  markdownTableRelease,
  markdownTableShort320,
  markdownTableShort390,
  markdownTableShort528,
  markdownTableShort1024,
  markdownTableWide,
  markdownTaskList,
  markdownUnorderedList,
} from '../../../../components/demos/markdown'
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

每个功能、变体和阅读宽度单独成例，粒度对齐 Astryx 原版文档和 Storybook。总览卡片用英文短文，不带按钮或状态。

<DemoExample :demo="markdownHeadings" description="六级标题都用正文标题字号。井号只在悬停或键盘聚焦时出现。" locale="zh" title="标题" />

<DemoExample :demo="markdownEmphasis" description="粗体用 semibold，斜体和删除线各自独立。" locale="zh" title="强调" />

<DemoExample :demo="markdownLinks" description="链接带下划线，颜色用正文强调色，不是品牌蓝。" locale="zh" title="链接" />

<DemoExample :demo="markdownInlineCode" description="行内代码走现有的 Code。" locale="zh" title="行内代码" />

<DemoExample :demo="markdownCodeBlock" description="围栏代码块走 CodeBlock，宽度跟容器，不受 contentWidth 限制。" locale="zh" title="代码块" />

<DemoExample :demo="markdownBlockquote" description="引用沿用 Blockquote。" locale="zh" title="引用" />

<DemoExample :demo="markdownUnorderedList" description="实心圆点。嵌套后会换成空心圆和方点。" locale="zh" title="无序列表" />

<DemoExample :demo="markdownOrderedList" description="默认从 1 开始。源码里的起始数字会保留，包括 26 和 0。" locale="zh" title="有序列表" />

<DemoExample :demo="markdownNestedLists" description="每深一层换一种记号，无序和有序都按三层循环。混合列表按实际嵌套深度计数。" locale="zh" title="嵌套列表" />

<DemoExample :demo="markdownTaskList" description="只读复选框，不作为表单提交。" locale="zh" title="任务列表" />

<DemoExample :demo="markdownTable" description="左、中、右对齐标记各自生效。没有标记的列保持默认对齐。表头是次要色，只有行分隔线。" locale="zh" title="表格对齐" />

<DemoExample :demo="markdownTableShort320" description="六列短内容放进 320 像素阅读栏。列宽按内容设下限，短表不需要横向滚动。" locale="zh" title="窄表 320" />

<DemoExample :demo="markdownTableShort390" description="同一张六列表，阅读栏 390 像素。" locale="zh" title="窄表 390" />

<DemoExample :demo="markdownTableShort528" description="同一张六列表，阅读栏 528 像素。" locale="zh" title="窄表 528" />

<DemoExample :demo="markdownTableShort1024" description="同一张六列表，阅读栏 1024 像素。" locale="zh" title="窄表 1024" />

<DemoExample :demo="markdownTableProse" description="六列都是句子。列宽下限按最长单元格大约两行来估，避免一个词占一行。宽度 390。" locale="zh" title="散文列" />

<DemoExample :demo="markdownTableEdges" description="空单元格、超长不换行记号、链接和行内代码混在一格。宽度 390。" locale="zh" title="表格边界" />

<DemoExample :demo="markdownTableApi" description="方法列很短，路径保持完整。放不下时表格横向滚动。宽度 390。" locale="zh" title="接口表" />

<DemoExample :demo="markdownTableRelease" description="短列和一句说明放在一起，版本号不从中间断开。宽度 390。" locale="zh" title="发布状态" />

<DemoExample :demo="markdownTableComparison" description="表头比单元格长。表头换行，不截成省略号。宽度 390。" locale="zh" title="功能对比" />

<DemoExample :demo="markdownTableWide" description="长链接和长代码保持整段，表格自己滚动。宽度 390。" locale="zh" title="宽表格" />

<DemoExample :demo="markdownDivider" description="分隔线用边框色，上下留出标题级的间距。" locale="zh" title="分隔线" />

<DemoExample :demo="markdownImages" description="横图、竖图和宽图都限制在容器内，圆角用元素圆角。" locale="zh" title="图片" />

<DemoExample :demo="markdownAutolinks" description="网址、邮箱和尖括号自动链接按 GFM 处理。" locale="zh" title="自动链接" />

<DemoExample :demo="markdownInline" description="display 为 inline 时不产生块级盒子，可以嵌进一句正文。" locale="zh" title="行内显示" />

<DemoExample :demo="markdownCompact" description="density 为 compact 时收紧块间距。一级和二级标题仍比更深的标题松一点。" locale="zh" title="紧凑密度" />

<DemoExample :demo="markdownShifted" description="headingLevelStart 为 3 时，一个 # 渲染成 h3，再深也不超过 h6。" locale="zh" title="标题起点" />

<DemoExample :demo="markdownContentWidth" description="contentWidth 为 680 时，正文、标题、列表和引用限制行宽。代码块和表格仍用容器宽度。" locale="zh" title="行宽 680" />

<DemoExample :demo="markdownAlignStart" description="行宽 580，正文靠起始边。外框宽 900，用来看出代码块和表格更宽。" locale="zh" title="对齐到起始边" />

<DemoExample :demo="markdownAlignCenter" description="同样的行宽，正文在容器里居中。代码块和表格仍然铺满。" locale="zh" title="对齐到中间" />

<DemoExample :demo="markdownContinuations" description="引用、列表和任务项的下一行可以不重复标记，仍然属于同一个块。" locale="zh" title="续行" />

<DemoExample :demo="markdownStreaming" description="按下按钮后，原文按小段追加。已写完的标题保持不动，新文字淡入。这个按钮只出现在组件页。" locale="zh" title="模拟流式输出" />
