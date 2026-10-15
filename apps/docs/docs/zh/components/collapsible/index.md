---
layout: component-docs
title: 折叠面板
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { collapsibleControlled, collapsibleDividers, collapsibleFaq, collapsibleMultiple, collapsibleSingle } from '../../../../components/demos/collapsible'
</script>

## 使用方法

`Collapsible` 把一个内容区块收在触发器后面：触发器始终可见，点击后展开或收起下面的内容。它适合设置页、常见问题、订单详情这类需要让页面保持可扫读、又允许用户按需展开的地方。多个 `Collapsible` 放在一起就是一个手风琴列表，每一项各自管理自己的开关。

最简单的用法是给一个标签加上内容：

```vue
<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
</script>

<template>
  <Collapsible trigger="配送地址">
    <p>订单会在一个工作日内从仓库发出，物流单号在包裹揽收后发送。</p>
  </Collapsible>
</template>
```

默认是展开的。只希望用户在点击后才看到内容时传入 `:default-is-open="false"`。这种情况下组件自己管理开关状态：点击触发器切换内容，并通过 `openChange` 事件把新的状态告诉外部。

需要由外部决定展开状态时，用 `v-model:is-open` 把状态提升到父组件。此时组件的显示完全跟随绑定的值，点击只是向父组件发出更新请求：

```vue
<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Collapsible v-model:is-open="isOpen" trigger="发布说明">
    <p>4.2 版本新增了报告内评论，并移除了旧的导出队列。</p>
  </Collapsible>
</template>
```

触发器通常用 `trigger` 属性给出一个纯文本标签；标签里需要标题、图标或其他控件时，改用 `trigger` 插槽，插槽会完全替换属性。展开和收起都有真实的过渡动画，内容区域的高度、内边距和透明度一起变化；在系统开启「减少动态效果」时这些动画会立即完成，状态变化本身不受影响。

触发器和内容区域通过 `aria-expanded` 与 `aria-controls` 关联，屏幕阅读器可以从按钮直接跳到它控制的内容。收起时内容区仍是同一个元素（`aria-controls` 始终指向它），但被设为 `display: none`，因此不会被键盘或读屏软件访问到。

`chevronPosition` 决定指示箭头位于标签的哪一侧。默认的 `end` 跟在标签后面：收起时朝下，展开时朝上。设为 `start` 时箭头移到标签前面，收起时指向内容一侧（在从右向左的语言下会自动镜像），展开时转成朝下，也就是文件树里常见的那种写法。

`isDisabled` 会让触发器变暗、不再响应点击，同时带上 `aria-disabled` 并退出 Tab 顺序。注意它不会收起已经展开的内容，只是让用户无法再操作这一项。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 触发器写清展开后是什么内容。标签本身就是按钮的无障碍名称，含糊的“更多”或“详情”会让屏幕阅读器用户无法判断。 |
| <Badge variant="success">推荐</Badge> | 内容较长、用户只需偶尔查看时使用折叠。只有一两行文字时直接显示出来，不必让用户多点一次。 |
| <Badge variant="success">推荐</Badge> | 需要由业务状态决定展开与否时使用 `v-model:isOpen`，让父组件成为唯一的状态来源。 |
| <Badge variant="success">推荐</Badge> | 多层结构或列表中的行使用 `chevronPosition="start"`，箭头指向内容一侧，和文件树的习惯一致；独立的小节保持默认的 `end`。 |
| <Badge variant="success">推荐</Badge> | 触发器只放标题文字。需要操作按钮时考虑显式地放在内容区或独立的行里，避免误触。 |
| <Badge variant="error">避免</Badge> | 把关键或必读内容折起来。用户很可能不会点开，信息就丢失了。 |
| <Badge variant="error">避免</Badge> | 嵌套超过两层折叠。层级一深，内容就难以查找和导航。 |
| <Badge variant="error">避免</Badge> | 用折叠面板承载刚发生的结果或错误。这类消息应当直接显示，或改用提示条（Banner）。 |

## 示例

<DemoExample
  :demo="collapsibleControlled"
  description="由父级状态决定哪一节打开，因此不只是点击能切换：URL 参数、校验失败时跳到对应步骤，或这里的上一步 / 下一步。"
  locale="zh"
  title="受控"
/>

<DemoExample
  :demo="collapsibleFaq"
  description="用 hasDividers 做常见问题：行间细线和密度间距，不需要自定义 CSS。问题用正文半粗，读起来是一行行问题，而不是一叠标题。"
  locale="zh"
  title="常见问题"
/>

<DemoExample
  :demo="collapsibleMultiple"
  description="多节能同时打开，方便对照。每个 Card 里放一个 Collapsible，触发器保持 large 字号，因为它是这块表面的标题，不是列表里的一行。"
  locale="zh"
  title="多开"
/>

<DemoExample
  :demo="collapsibleSingle"
  description="一次只打开一节，让一块内容独占注意力。用 defaultValue 预先展开首次阅读者需要的那一节。"
  locale="zh"
  title="单开"
/>

<DemoExample
  :demo="collapsibleDividers"
  description="页面背景上的扁平列表，分隔线手动放置。适合卡片会显得太重的详情面板和侧栏。"
  locale="zh"
  title="带分隔线"
/>
