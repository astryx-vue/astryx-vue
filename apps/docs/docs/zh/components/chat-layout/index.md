---
layout: component-docs
title: 对话布局
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatLayoutPanelView } from '../../../../components/demos/chat-layout'
</script>

## 使用方法

`ChatLayout` 是整页对话的外壳。消息按普通文档流从上往下排，输入区用一层毛玻璃压在底部。`density` 控制疏密，默认是 `balanced`。把 `ChatMessageList` 和 `ChatComposer` 套进来，就得到一个带自动滚动和「滚到底」按钮的完整对话界面。

```ts
import { ChatLayout } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 默认插槽放 `ChatMessageList`，`composer` 插槽放 `ChatComposer`，这样就是一套完整的对话界面。 |
| <Badge variant="success">推荐</Badge> | 给 `empty` 插槽一点内容，新对话才不至于是一块白屏。 |
| <Badge variant="success">推荐</Badge> | 对话嵌在由外层负责滚动的页面里时，用 `scrollRef` 指定那个滚动元素。 |
| <Badge variant="error">避免</Badge> | 给布局写死高度。让它用 `flex: 1` 填满外层就好。 |
| <Badge variant="error">避免</Badge> | 在同一个滚动容器里放多个 `ChatLayout`。每个都认为自己独占滚动。 |

## 示例

常见的用法、变化和状态。

<DemoExample
  :demo="chatLayoutPanelView"
  description="窄栏里的侧边对话，容器一窄就自动变成紧凑密度。侧栏、抽屉、嵌在页面里的小对话窗，横向空间紧张时用它。"
  locale="zh"
  title="ChatLayout — 面板"
/>
