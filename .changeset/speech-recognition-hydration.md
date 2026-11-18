---
'@astryx-vue/core': patch
---

`useSpeechRecognition` 和 `useChatDictation` 在组件里改为挂载后才检测浏览器是否支持语音识别，组件外仍立即检测。之前 setup 里就读 `webkitSpeechRecognition`：服务端为 false，Chromium 为 true，默认在不支持时隐藏的 ChatDictationButton 因此只在客户端出现，后面组件的 `useId()` 全部错位。
