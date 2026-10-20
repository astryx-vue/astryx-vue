---
layout: component-docs
title: 对话输入区
outline: false
footer: false
---

<script setup lang="ts">
import { chatComposerAttachments, chatComposerFlat, chatComposerFooterActions, chatComposerFullFeatured, chatComposerSimple, chatComposerStreaming, chatComposerValidation } from '../../../../components/demos/chat-composer'
</script>

## 使用方法

`ChatComposer` 是对话页面里写字发送的那一整块。它管草稿（你给 `v-model` 就归你管，不给它自己存）、默认带标签能力的输入框、发送和停止两颗按钮，另外还有抽屉、页眉、页脚、状态提示这几个可选位置。自己写的输入框和发送按钮也能接进来：通过 `useChatComposerContext()` 拿到同一份草稿、提交、禁用、停止和聚焦的约定。

```ts
import { ChatComposer } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## 示例

常见的用法、变化和状态。

<DemoExample
  :demo="chatComposerAttachments"
  description="抽屉里放可以逐个删掉的附件标签。用户能给这条消息带上文件或上下文时用它。"
  locale="zh"
  title="ChatComposer — 附件"
/>

<DemoExample
  :demo="chatComposerFlat"
  description="输入区默认是抬起的（elevation=&quot;low&quot;）。把 elevation 设成 &quot;none&quot; 就变平，这时它画一条边框，静止、悬停、聚焦的样子都跟文本输入框一致。"
  locale="zh"
  title="ChatComposer — 扁平样式"
/>

<DemoExample
  :demo="chatComposerFooterActions"
  description="页脚放模型选择和设置两个下拉菜单，发送按钮左边的位置放一个麦克风按钮。"
  locale="zh"
  title="ChatComposer — 页脚操作"
/>

<DemoExample
  :demo="chatComposerFullFeatured"
  description="所有插槽都放满：可折叠的附件抽屉、页眉操作、上下文进度条、页脚下拉菜单，以及麦克风按钮。展示输入区能配到的最全的样子。"
  locale="zh"
  title="ChatComposer — 完整配置"
/>

<DemoExample
  :demo="chatComposerSimple"
  description="最简的输入区：一个占位文字，加一个提交处理。往页面里塞一个输入框，用这个就够。"
  locale="zh"
  title="ChatComposer — 最简"
/>

<DemoExample
  :demo="chatComposerStreaming"
  description="带有流式状态和停止按钮的输入区。助手正在生成回答、用户可以中途取消时用它。"
  locale="zh"
  title="ChatComposer — 流式输出"
/>

<DemoExample
  :demo="chatComposerValidation"
  description="带错误和警告提示的输入区。提示可以放在输入区上面，也可以放在下面，用来告诉用户校验结果或系统状态。"
  locale="zh"
  title="ChatComposer — 校验提示"
/>
