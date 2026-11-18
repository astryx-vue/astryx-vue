---
'@astryx-vue/cli': patch
---

内置组件目录里 Timestamp 的 auto 与 relative 示例源码改为挂载后再取当前时间，服务端渲染时不读时钟。
