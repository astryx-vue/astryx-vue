---
layout: component-docs
title: useClipboard
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

`useClipboard` 把「复制文本到剪贴板」这件常见的小事封装好了。它帮我们打理好了一整套细节：写入剪贴板、复制成功后在短暂时间内变成 `true` 的 `isCopied` 状态、自动恢复默认状态的倒计时定时器，以及读屏软件的无障碍朗读播报。

这样一来，我们在写复制按钮时就不必到处重复写 `setTimeout` 和重置逻辑。当用户连续多次点击复制时，它还会自动重新计算等待时间，确保「复制成功」的提示完整展示给用户看。代码组件 `CodeBlock` 右上角的复制按钮就是基于它构建的。

**什么时候用：**
- 需要在点击按钮或文字后把一段字符串（如兑换码、分享链接、代码片段）快速写进系统剪贴板时。

**什么时候不要用：**
- 如果是浏览器普通的表单全选复制，或者用户习惯性的划词右键复制，不需要特意使用这个组合式函数。

```ts
import { useClipboard } from '@astryx-vue/core'
```

同一个函数也可以通过 `useCopyToClipboard` 的别名导入，`@astryx-vue/core` 和 `@astryx-vue/core/Code` 都支持引用。导出的 `isCopied` 是 Vue 的 `ref` 对象，在模板里直接写名字即可自动解包。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 复制成功的提示（复制图标换成对勾、文字换成「已复制」）看返回的 `isCopied`，不要自己再存一份状态。 |
| <Badge variant="success">推荐</Badge> | 传一个本地化好的 `announce` 句子，让读屏念出来；只换按钮的 `aria-label` 经常不会被念。 |
| <Badge variant="success">推荐</Badge> | 常见的小图标复制按钮，用 ghost 的 `IconButton` 配一个「复制」的 Tooltip，`@click` 调 `copy()`；Tooltip 一直是「复制」，靠图标翻转表示已复制。 |
| <Badge variant="error">避免</Badge> | 在 hook 之外再维护一个 `copied` 变量；`isCopied` 已经反映这段提示窗口，并且会自己归位。 |
