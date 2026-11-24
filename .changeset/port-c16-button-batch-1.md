---
'@astryx-vue/core': patch
---

Button 跟进上游 v0.7.2–v0.7.17 的几处修复：

- 提示文字和按钮的可访问名称相同时，不再把提示挂成 `aria-describedby`，读屏器不会把同一句话读两遍（上游 #9681）。
- 按钮的内容容器改成真实的弹性盒子，不再用 `display: contents`，macOS 15 之前的 Safari 里 VoiceOver 能读出带标签按钮的名称；布局不变（上游 #10256）。
- 服务端渲染时，用 `aria-disabled` 的 submit / reset 按钮在挂载前先渲染成普通按钮，hydration 之前点它不会提交或重置表单（上游 #11107）。
- 强制配色模式下 ghost 按钮不再加边框（上游 #7677 的一部分）。
