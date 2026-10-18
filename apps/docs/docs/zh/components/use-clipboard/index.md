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

复制到剪贴板这件事只写一遍：写入剪贴板、复制成功后短暂为真的 `isCopied`、它自己的重置定时器，以及可选的读屏播报。抽出来之后，每个复制入口都只是套一层的薄控件，不必各自再算一遍定时器和播报。连续复制会把倒计时重新算满，所以提示总是完整地显示一遍；定时器在作用域销毁时清掉。`CodeBlock` 自带的复制按钮就建在它上面；要做的复制入口不是普通图标按钮时（菜单项、带文字的按钮、点一下就复制的值），可以直接用它。

```ts
import { useClipboard } from '@astryx-vue/core'
```

同一个函数也以 `useCopyToClipboard` 的名字导出，`@astryx-vue/core` 和 `@astryx-vue/core/Code` 都能引。`isCopied` 是 `ref`，模板里会自动解包。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 复制成功的提示（复制图标换成对勾、文字换成「已复制」）看返回的 `isCopied`，不要自己再存一份状态。 |
| <Badge variant="success">推荐</Badge> | 传一个本地化好的 `announce` 句子，让读屏念出来；只换按钮的 `aria-label` 经常不会被念。 |
| <Badge variant="success">推荐</Badge> | 常见的小图标复制按钮，用 ghost 的 `IconButton` 配一个「复制」的 Tooltip，`@click` 调 `copy()`；Tooltip 一直是「复制」，靠图标翻转表示已复制。 |
| <Badge variant="error">避免</Badge> | 在 hook 之外再维护一个 `copied` 变量；`isCopied` 已经反映这段提示窗口，并且会自己归位。 |
