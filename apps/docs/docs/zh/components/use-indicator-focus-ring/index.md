---
layout: component-docs
title: useIndicatorFocusRing
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

给「真输入框看不见、画面上的图形代替它」的控件画标准焦点环。复选框和单选框真正的 input 是透明的，焦点环只能画在旁边那个图形上。环画在指示器自己的元素上，只有这个元素自己的圆角能决定环的形状；而且只在 `:focus-visible` 时画，鼠标点一下不会亮。统一放在这里管，主题换掉指示器也不会出现「控件没有可见焦点」（WCAG 2.4.7）——不会因为主题漏了一个属性就整块没法用键盘。

```ts
import { useIndicatorFocusRing } from '@astryx-vue/core'
```

环由这个函数带上的 `styles/indicator-focus-ring.css` 画：函数给指示器加上 `data-astryx-focus-ring`，样式表用主题里的焦点色描边。模板里把 `focusProps.onFocus` 绑到 `@focusin`、`focusProps.onBlur` 绑到 `@focusout`，因为 DOM 里 `focus` 不冒泡。

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 被 ref 指向的元素只包指示器；连文案一起包会把整行都圈起来。 |
| <Badge variant="success">推荐</Badge> | `focusProps` 绑在「包着那个隐藏输入框」的元素上（`@focusin` / `@focusout`），不要绑在输入框自己身上。 |
| <Badge variant="error">不要</Badge> | 让主题里的指示器自己画焦点环；换一个不理这个属性的指示器，控件就没有可见焦点了。 |
