---
"@astryx-vue/core": patch
---

`Text` 的 `as` 现在接受 `h1`–`h6`。模板页面里 `Text as="h1"` 这类写法本来就渲染出真正的标题元素，只是类型没列出来；现在类型对上了。字号仍由 `type` 决定，要标题字号请用 `Heading`。
