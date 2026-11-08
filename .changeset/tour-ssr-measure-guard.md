---
'@astryx-vue/lab': patch
---

修复 Tour 在服务端渲染时停止测量会访问 window 的问题；真实 node SSR 环境已有回归测试。
