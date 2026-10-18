---
layout: component-docs
title: useTypeahead
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

给一组选项加上 APG 里的「打字跳转」：打出来的字符先攒在缓冲区里，停一会儿就清空；只要某一项的标签以这段字符开头，就把它的下标交给 `onMatch`。同一个字母一直按，会在匹配上的几项之间轮着走，而不是把条件收得更窄。它自己不动焦点，要跟你已有的焦点管理配合，通常就是 `useListFocus` 或 `useGridRovingFocus`。

`onKeyDown` 收的是原生 `KeyboardEvent`，吃掉一个可打印字符时返回 `true`。所以先让它看一眼事件，它返回 `false` 时再交给方向键。空格只有在缓冲区里已经有字的时候才算查询的一部分，所以空格照样能激活当前项。`reset()` 清掉还没超时的缓冲区，比如这组选项关掉的时候。

```ts
import { useTypeahead } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useTypeahead } from '@astryx-vue/core'
import { ref } from 'vue'

const items = ['苹果', '香蕉', '樱桃']
const activeIndex = ref(-1)

const { onKeyDown } = useTypeahead({
  getItemLabels: () => items,
  getCurrentIndex: () => activeIndex.value,
  onMatch: (index) => {
    activeIndex.value = index
  },
})

function handleArrows(event: KeyboardEvent): void {
  const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0
  if (step === 0)
    return
  event.preventDefault()
  activeIndex.value = (activeIndex.value + step + items.length) % items.length
}
</script>

<template>
  <ul role="listbox" tabindex="0" @keydown="(event) => { if (!onKeyDown(event)) handleArrows(event) }">
    <li
      v-for="(item, index) in items"
      :key="item"
      role="option"
      :aria-selected="index === activeIndex"
      tabindex="-1"
    >
      {{ item }}
    </li>
  </ul>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">Do</Badge> | `onMatch` 接到你已有的焦点管理上（比如 `useListFocus().focusItem`），不要自己挪焦点。 |
| <Badge variant="success">Do</Badge> | 让按键事件先过它，它返回 `false` 时再交给方向键。 |
| <Badge variant="success">Do</Badge> | 传 `getCurrentIndex`，同一个字母才是在匹配项之间走，而不是一直卡在第一项。 |
| <Badge variant="error">Don't</Badge> | 把它用在文本框上。字符本来就会进输入框，再来一套打字跳转只会跟输入的值打架。 |
