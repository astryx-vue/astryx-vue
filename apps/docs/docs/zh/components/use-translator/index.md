---
layout: component-docs
title: useTranslator
outline: false
footer: false
---

## 使用方法

返回一个翻译函数，按当前语言、provider 给的覆盖和包内自带的英文兜底目录把消息键换成成品文案。在组件里调用；拿到的函数在这个组件的范围内哪里都能用。

```ts
import { useTranslator } from '@astryx-vue/core/locale'
```

键用的是原版的消息键，例如 `@astryx.pagination.next`。占位符的值按顺序传进去，按当前语言的规则拼，所以复数和千分位都跟着这门语言走。这个包里没有对应位置的键会原样返回，缺键能一眼看见，而不是变成一片空白。`t` 每次调用都重新读 provider，所以 provider 换语言之后同一个翻译函数照样能用。
