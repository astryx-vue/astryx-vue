---
'@astryx-vue/core': patch
---

`Switch` 现在把调用方传入的 `aria-labelledby` 直接作为开关控件的可访问名称，不再和组件自己的标签 id 拼在一起；`aria-describedby` 继续排在本组件自己的说明、状态和禁用原因之前。两个引用都只落在开关控件上，不落在字段外壳上。
