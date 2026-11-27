---
layout: component-docs
title: useSpeechRecognition
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useSpeechRecognitionTranscript } from '../../../../components/demos/use-speech-recognition'
</script>

## 使用方法

对浏览器语音识别 API 的无界面封装，并给出麦克风音量和频段。提供控件之前先看 `isSupported`：没有语音识别的浏览器会报告 `false`，也不会去听；这里不自带任何语音服务。服务端和水合服务端标记的那次渲染里 `isSupported` 是 `false`，挂载之后才变成 `true`，所以服务端和客户端画出的是同一棵树。

```ts
import { useSpeechRecognition } from '@astryx-vue/core/Chat'
```

```vue
<script setup lang="ts">
import { useSpeechRecognition } from '@astryx-vue/core/Chat'
import { ref } from 'vue'

const transcript = ref('')
const speech = useSpeechRecognition({
  onResult: (text) => { transcript.value += `${text} ` },
  onError: error => console.warn(error.error),
})
</script>

<template>
  <button v-if="speech.isSupported.value" type="button" @click="speech.toggle()">
    {{ speech.isListening.value ? '停止' : '开始' }}
  </button>
  <p>{{ transcript }}{{ speech.interimTranscript.value }}</p>
</template>
```

## 最佳实践

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">建议</Badge> | 只在 `isSupported` 为真时提供控件；或者让控件保留但禁用，并说明这个浏览器不能语音输入。 |
| <Badge variant="success">建议</Badge> | 处理 `onError`。麦克风权限被拒绝，只有它能告诉你。 |
| <Badge variant="error">避免</Badge> | 在这个 hook 旁边再去调用浏览器的 `SpeechRecognition`。想让文字进 `ChatComposerInput` 就用 `useChatDictation`。 |

## 示例

<DemoExample
  :demo="useSpeechRecognitionTranscript"
  description="一个不带界面的 useSpeechRecognition 控件。它显示浏览器能不能收听、还在识别中的词，以及 onResult 给出的每一句完整的话。"
  locale="zh"
  title="useSpeechRecognition —— 转写文本"
/>
