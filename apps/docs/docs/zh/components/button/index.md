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

`Button`（按钮）用来触发界面里的各种操作，像保存资料、提交表单、删除项目都可以交给它。每个按钮都需要通过 `label` 清楚说明它要做什么，这个文字既会直接显示在按钮上，也会被读屏软件朗读出来。在没有传入默认插槽时，按钮会直接展示 `label` 的内容：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="保存更改" variant="primary" />
</template>
```

**什么时候用：**
- 用户点击后需要执行一个具体动作时（例如保存、发布、确认或删除）。

**什么时候不要用：**
- 如果只是为了跳转到另一个页面或外部网址，请直接使用普通的网页链接（`<a>` 标签），不要用按钮做纯跳转。
- 如果按钮只有图标、没有文字，请改用专用的 [IconButton](/components/icon-button)。
- 如果要把几个相关操作整齐并排拼成一组，请改用 [ButtonGroup](/components/button-group)。

按钮前后的图标通过插槽传入。`icon` 插槽位于文字前面，`end` 插槽位于文字后面，两者的尺寸已经内部规范好。直接放进一个 [Icon](/components/icon) 即可，不需要单独设置 `size`：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <Button label="上传文件">
    <template #icon>
      <Icon name="carbon:upload" />
    </template>
  </Button>
  <Button label="继续" variant="secondary">
    <template #end>
      <Icon name="carbon:chevron-right" />
    </template>
  </Button>
</template>
```

插槽里也可以直接使用 CSS 图标类名，前提是你的项目构建流程支持解析该类名。不必为了一个图标特意引入 UnoCSS。





<ComponentAnatomy />

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
