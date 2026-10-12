---
layout: component-docs
title: 树形列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { treeListFileTree, treeListMailbox, treeListNavigation, treeListSettings, treeListVariants } from '../../../../components/demos/tree-list'
</script>

## 使用方法

`TreeList` 用数据画出一棵树。每一项有 `id` 和 `label`。`children` 是下一层。`isExpanded` 是初始展开状态。点分支会切换展开。带 `href` 的叶子是链接。带 `onClick` 的叶子是按钮。

`variant="lineGuides"` 画连接线。`noGuides` 只保留缩进。`density` 改变行的上下内边距：紧凑 4px，适中 8px，宽松 12px。

`icon` 和 `endIcon` 可以是 `Icon` 的字形名，也可以是以 `i-` 开头的 CSS 图标类。`badge` 是末尾的短计数。内容比图标复杂时，用 `start` 和 `end` 插槽替换这两处字符串。

键盘遵循树的常见习惯：上下移动，左右展开和折叠（从右到左的布局里左右对调），Home 和 End 跳到两端，Enter 和空格激活，继续打字会跳到匹配的标签。

```vue
<script setup lang="ts">
import { TreeList } from '@astryx-vue/core/TreeList'

const items = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [{ id: 'app', label: 'App.tsx', onClick: () => {} }],
  },
]
</script>

<template>
  <TreeList :items="items" />
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每一项给一个稳定的 `id`。焦点和展开都靠它跟踪。 |
| <Badge variant="success">推荐</Badge> | 层级深、只靠缩进不好认时用 `lineGuides`。 |
| <Badge variant="success">推荐</Badge> | 数量放进 `badge`，末尾的提示放进 `endIcon`，不要拼进标签。 |
| <Badge variant="error">避免</Badge> | 一行里又是链接又是按钮。一行只做一件事。 |
| <Badge variant="error">避免</Badge> | 很大的树默认全部展开。从读者当前所在的路径展开。 |

## 示例

<DemoExample
  :demo="treeListVariants"
  description="lineGuides 在父子之间画连接线。noGuides 只留缩进。密度是另一件事，只改行的内边距。"
  locale="zh"
  title="Tree List — 变体"
/>

<DemoExample
  :demo="treeListFileTree"
  description="文件树用文件夹和文档图标区分目录和文件。"
  locale="zh"
  title="TreeList — 带图标的文件树"
/>

<DemoExample
  :demo="treeListSettings"
  description="设置项可以点，文档那一行是链接。"
  locale="zh"
  title="TreeList — 可交互的设置"
/>

<DemoExample
  :demo="treeListMailbox"
  description="邮件文件夹，未读数量用徽标标出。"
  locale="zh"
  title="TreeList — 邮箱"
/>

<DemoExample
  :demo="treeListNavigation"
  description="导航树里，当前页那一项是选中状态。"
  locale="zh"
  title="TreeList — 导航"
/>
