---
layout: component-docs
title: 工具栏
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { toolbarOverflow } from '../../../../components/demos/toolbar'
</script>

## 使用方法

`Toolbar` 是 `role="toolbar"`。`label` 必填。`start`、`center`、`end` 分成三组，方向键在组与组之间移动焦点，Home 和 End 跳到两端。焦点在输入框里时，方向键先留给输入框，直到光标顶到边界。

放不下的操作交给 `OverflowList`，多出来的项收进「更多」菜单。工具栏自己不测量宽度。

```vue
<script setup lang="ts">
import { Toolbar } from '@astryx-vue/core/Toolbar'
</script>

<template>
  <Toolbar label="格式">
    <template #start>
      <button type="button">
        加粗
      </button>
      <button type="button">
        斜体
      </button>
    </template>
  </Toolbar>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 给工具栏一个能说明用途的 <code>label</code>，例如「格式」。 |
| <Badge variant="success">推荐</Badge> | 项很多时把它们放进 <code>OverflowList</code>，不要让按钮换行挤出容器。 |
| <Badge variant="error">避免</Badge> | 不要在工具栏里再套一个工具栏。方向键会停在内层边界上。 |

## 示例

<DemoExample
  :demo="toolbarOverflow"
  description="格式操作放在一条窄工具栏里。放不下的项收进「更多」，方向键仍能在可见按钮之间移动。"
  locale="zh"
  title="溢出"
/>
