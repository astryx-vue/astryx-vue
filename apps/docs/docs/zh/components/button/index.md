---
layout: component-docs
title: 按钮
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { buttonEndSlot, buttonFloating, buttonIcon, buttonSizes, buttonVariants } from '../../../../components/demos/button'
</script>


## 使用方法

`Button` 用来触发界面中的各类操作，保存、删除、提交这些动作都可以交给它。每个按钮都必须通过 `label` 指定操作名称，它既是默认的可见文字，也是屏幕阅读器朗读的无障碍标签。没有默认插槽时，按钮直接显示 `label`：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="保存更改" variant="primary" />
</template>
```

- 需要把一组相关操作并排放在一起时，使用 [ButtonGroup](/components/button-group)。
- 操作只需要一个图标时，使用 [IconButton](/components/icon-button)。

astryx-vue 不自带图标，需要显示图标的按钮由你自己的图标方案提供图形。`icon` 插槽位于文字之前、放在一个已经定好尺寸的盒子里，`end` 插槽与之对称：

```vue
<template>
  <Button label="Upload file">
    <template #icon>
      <span class="i-carbon-upload" />
    </template>
  </Button>
  <Button label="Continue" variant="secondary">
    <template #end>
      <span class="i-carbon-chevron-right" />
    </template>
  </Button>
</template>
```

任何 CSS 图标类都可以：UnoCSS 的图标类、Tailwind 的工具类，或者你自己写的类；也可以放一个绘制 SVG 的组件。UnoCSS 的图标预设会铺满容器，而按钮已经为这个盒子定好了尺寸，所以不必再手动指定大小。




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把 primary 留给视图中最重要的那个操作，其余操作按强调程度依次使用 secondary 或 ghost，视觉层级会更清晰。 |
| <Badge variant="success">推荐</Badge> | 按钮文字直接描述将要发生的操作，例如 “Save changes”、“Delete account”、“Send invite”。避免使用 “OK” 或 “Click here” 这类看不出后果的模糊文字。 |
| <Badge variant="success">推荐</Badge> | 保存、提交等耗时操作应显示加载状态，让用户明确知道请求正在处理，而不是对着没反应的界面重复点击。 |
| <Badge variant="success">推荐</Badge> | 纯图标按钮也必须提供文字标签，屏幕阅读器依赖它来播报按钮用途；面向普通用户时，可以再用 tooltip 给出视觉提示。 |
| <Badge variant="success">推荐</Badge> | 需要独立的纯图标按钮时，从 `@astryx-vue/core/IconButton` 导入 IconButton。它是独立组件，不从 `@astryx-vue/core/Button` 导出。 |
| <Badge variant="error">避免</Badge> | 避免在同一视图中放置多个 primary 按钮，多个主按钮会互相争抢注意力，反而削弱视觉层级。 |
| <Badge variant="error">避免</Badge> | 避免让 destructive 按钮直接执行删除数据这类不可撤销的操作。应先提供确认步骤，给使用者一次反悔的机会。 |
| <Badge variant="error">避免</Badge> | 避免用按钮做纯粹的页面跳转：跳转请使用链接，按钮留给保存、删除、提交这类会改变状态的操作。 |

## 示例

<DemoExample
  :demo="buttonFloating"
  description="用 elevation=&quot;med&quot; 抬起的悬浮操作按钮。按钮需要浮在内容之上时使用 elevation。"
  locale="zh"
  title="悬浮"
/>

<DemoExample
  :demo="buttonSizes"
  description="小、中、大三种尺寸并排。紧凑界面用 small，多数情况用 medium，需要突出的行动号召用 large。"
  locale="zh"
  title="尺寸"
/>

<DemoExample
  :demo="buttonVariants"
  description="四种变体的默认、禁用和加载状态。primary 留给主操作，secondary 用于多数操作，ghost 表示低强调，destructive 表示危险操作。"
  locale="zh"
  title="变体"
/>

<DemoExample
  :demo="buttonEndSlot"
  description="按钮尾部放一个表示数量或状态的徽章。适合通知数、未读消息，或任何需要视觉提示的按钮。"
  locale="zh"
  title="尾部内容"
/>

<DemoExample
  :demo="buttonIcon"
  description="按钮前面放一个强化文案的图标。图标能让人更快认出操作时使用，例如新建用加号、删除用垃圾桶。"
  locale="zh"
  title="图标"
/>
