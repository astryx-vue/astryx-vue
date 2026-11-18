---
'@astryx-vue/core': patch
---

VisuallyHidden 渲染成 `input` 这类空元素时不再挂载插槽。服务端不会给空元素输出子节点，客户端却多出一个空插槽，SelectableCard 里的隐藏复选框因此 hydration 失败。
