---
'@astryx-vue/core': patch
---

ChatTypingIndicator 不再自带 live region。独立使用时，名称标签通过共享 polite 通道播报，并在标签变化时去重；清空后再次出现会重新播报。位于 Chat log 或其他 live 容器内时交给外层容器，避免重复朗读。
