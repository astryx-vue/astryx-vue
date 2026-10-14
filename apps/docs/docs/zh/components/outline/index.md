---
layout: component-docs
title: 大纲
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { outlineControlled, outlineDeepNesting, outlineDensity } from '../../../../components/demos/outline'
</script>

## 使用方法

`Outline` 是目录。每一项是 `{ id, label, level }`。`id` 对应页面上标题元素的 id。`level` 从 1 到 6。1 和 2 共用第一档缩进，3、4、以及 5–6 再逐档往里收。

不传 `activeId` 时，大纲跟着滚动走。传了 `scrollContainer` 就盯这个容器，否则找最近的可滚动祖先，再没有就用视口。当前项是顶部已经越过停留线的最后一个标题。滚到底时，最后一项为当前项。`offset` 把停留线和滚动落点一起下移，标题自己的 `scroll-margin-top` 仍然算在里面。

传入 `activeId` 后，滚动侦测关闭。`v-model:active-id` 把高亮留在你自己的状态里。点击开始滚动时发出 `navigateStart`。同一次导航结束时发出一次 `navigateEnd`：滚动停稳、读者中途打断，或超过 1.2 秒，都会结束。

`hasScrollOnClick` 默认打开。带修饰键的点击，或目标 id 在页面上不存在时，不接管浏览器自己的行为。激活一项会用 `history.pushState` 写入 hash。

```vue
<script setup lang="ts">
import { Outline } from '@astryx-vue/core/Outline'

const items = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'theming', label: 'Theming', level: 2 },
  { id: 'tokens', label: 'Tokens', level: 3 },
]
</script>

<template>
  <Outline :items="items" />
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每个 `id` 指向真实标题，`level` 和那个标题的级别一致。 |
| <Badge variant="success">推荐</Badge> | 页面有粘性顶栏时，把 `offset` 设成顶栏高度，当前项和滚动落点才对得上。 |
| <Badge variant="success">推荐</Badge> | 窄侧栏用 `density="compact"`，长文旁边用 `default`。 |
| <Badge variant="error">避免</Badge> | 传了 `activeId` 还指望内置滚动侦测继续改它。只要传入，侦测就关掉。 |
| <Badge variant="error">避免</Badge> | 再用额外标记自己缩进。级别已经决定缩进。 |

## 示例

<DemoExample :demo="outlineControlled" description="传入 activeId 后，内置的滚动侦测会停下来，高亮由你自己的逻辑决定。" locale="zh" title="受控" />

<DemoExample :demo="outlineDeepNesting" description="1 到 4 级标题逐级向内缩进，长文档里的小节仍然容易扫读。" locale="zh" title="深层嵌套" />

<DemoExample :demo="outlineDensity" description="compact 收紧每一项的内边距，适合密集侧栏。default 是文档里的常规间距。指示条会跟着每一项的高度走。" locale="zh" title="密度" />
