---
layout: component-docs
title: 语音输入按钮
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatDictationButtonBasic } from '../../../../components/demos/chat-dictation-button'
</script>

## 使用方法

`ChatDictationButton` 是对话输入区里那种「按一下开始说、再按一下停」的按钮。它跟 `useChatDictation` 配对使用：没在听的时候显示话筒图标，正在听的时候显示跳动的音量条。放在 `ChatComposer` 的 `sendActions` 插槽里。

```ts
import { ChatDictationButton } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把语音按钮放进 `ChatComposer` 的 `sendActions` 插槽，它就挨着发送按钮，正是用户找语音入口的位置。 |
| <Badge variant="success">推荐</Badge> | 把输入框的句柄传给 `useChatDictation`，用户说话时半截的话会以灰字出现在输入框里。 |
| <Badge variant="success">推荐</Badge> | 给 `useChatDictation` 打开 `hasSounds`，开始和结束录音时给一声提示音。按钮变化本来就很细微，有声音更好判断。 |
| <Badge variant="error">避免</Badge> | 把语音按钮拿到对话输入区外面单独用。它是为输入区发送按钮旁边那个位置设计的，不是通用的录音控件。 |
| <Badge variant="error">避免</Badge> | 忘了处理浏览器不支持的情况。浏览器没有 SpeechRecognition 时按钮会自己藏起来，但你的输入区本身也得在不支持时能用。 |

## 示例

常见的用法、变化和状态。

<DemoExample
  :demo="chatDictationButtonBasic"
  description="接上 useChatDictation、放在 ChatComposer 的 sendActions 插槽里的语音按钮。点话筒，说的话就转成文字进输入框。"
  locale="zh"
  title="ChatDictationButton — 基础"
/>
