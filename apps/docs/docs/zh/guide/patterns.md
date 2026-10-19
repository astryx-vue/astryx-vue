---
title: 应用模式
---

<script setup lang="ts">
import { chatPatternConversation, chatPatternLanding } from '../../../components/demos/chat'
</script>

# 应用模式

对话按场景叠起来用。记录、气泡、推理、工具调用、引用和输入区各自是组件，页面决定它们怎么坐在一起。组件不连接模型。正文是插槽，长回复用 Markdown 排版，来源写成引用。

还没有记录的时候，页面中间是一句问候和一块输入区。模式可以切到写作、编程、研究或创作；敏感和深度会插进输入区里的标记。输入 @ 提及一个人，输入 / 选择一条命令。附件收在抽屉里，较长的粘贴也会收成标记。麦克风只在浏览器能识别语音时出现。选一个分类，建议会写进输入区。

已经有来回的时候，一列记录贴着底部的输入区。助手还在写时，发送换成停止，记录标成正在输出。推理先展开，工具调用从运行变成完成，回答里带上引用，生成的文档可以从卡片打开。整页演练场在宽屏上把文档放进可拖动的侧栏，窄于 768px 时改成全屏对话框。

下面两块可以直接操作。完整页面在演练场里：[AI 对话落地页](/playground/?template=ai-chat-landing)和 [AI 对话](/playground/?template=ai-chat)。零件的密度、未读分隔和元信息见 [对话](/components/chat)。

<DemoExample
  :demo="chatPatternLanding"
  description="问候、模式、提及、命令、附件和分类建议放在同一块输入区里。点一张建议卡，这句话会写进输入区并切到对应模式。"
  locale="zh"
  title="落地"
/>

<DemoExample
  :demo="chatPatternConversation"
  description="记录里同时有推理、工具调用、引用和文档卡片。发送之后，回复会按这个顺序长出来；生成过程中可以停止。点文档卡片会打开全屏对话框。"
  locale="zh"
  title="会话"
/>
