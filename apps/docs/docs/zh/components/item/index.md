---
layout: component-docs
title: 条目
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { itemBasic, itemDocumentTabs, itemMetadata, itemStartContent } from '../../../../components/demos/item'
</script>

## 使用方法

整个组件库里通用的「一行东西」：前面放内容、中间放名字和说明、后面再放内容。下拉菜单、选择器、联系人列表、通知、文件浏览、动态流，凡是要一行一行排的，都从它开始。

```ts
import { Item } from '@astryx-vue/core/List'
```

别的看起来像一行的东西都是拿它拼的。[列表项](/components/list-item) 在外面加了列表元素和行首标记；菜单、选择器、下拉结果各自补上父级要求的角色。这一行自己除了文字和插槽什么都不画，长什么样由外面那层面板决定。

<ComponentAnatomy />

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 常见排版用带名字的插槽（`startContent`、`label`、`description`、`endContent`），八成的场景这样写就够了。 |
| <Badge variant="success">推荐</Badge> | 菜单和密集列表用 `density="compact"`，普通行用 `"balanced"`，宽松布局用 `"spacious"`。 |
| <Badge variant="success">推荐</Badge> | 内容长短不固定时，用 `labelLines` 和 `descriptionLines` 控制在第几行截断。 |
| <Badge variant="success">推荐</Badge> | 前面或后面的内容比一行字更高时，用 `align="start"` 让它顶部对齐。 |
| <Badge variant="success">推荐</Badge> | 横滑出来的操作要在行里再留一个入口（菜单，或者 `endContent` 里的按钮）。横滑只是给手指的快捷方式，只能滑出来的操作，键盘和鼠标用户永远够不着。 |
| <Badge variant="error">避免</Badge> | 不要在可点的 `Item` 里再套按钮或链接。焦点和点击目标会变得难猜。 |
| <Badge variant="error">避免</Badge> | 不要拿 `Item` 做页面之间的跳转。那种场景用导航组件。 |
| <Badge variant="error">避免</Badge> | 不要把已读未读、收件箱之类的业务逻辑直接塞进来。包一层薄薄的组件（类似 PreviewItem）更好。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="itemBasic" title="基础" description="一行名字、一行说明，末尾放个时间。适合简单、只需要对齐和间距一致的场景。" locale="zh" />

<DemoExample :demo="itemDocumentTabs" title="文档标签" description="单行、可以横向滚动的文档切换条：紧凑的选中行、前面的文件图标、悬停立刻出现且位置预留好的关闭按钮、稳定的分隔线，以及放在滚动区外面的新建按钮。适合编辑器标签、工作区标签、打开的文档、文件、画布和面板。" locale="zh" />

<DemoExample :demo="itemMetadata" title="带旁注" description="末尾对齐放状态和徽章。数量、状态、时间这些次要信息都放 endContent 插槽。" locale="zh" />

<DemoExample :demo="itemStartContent" title="带前缀" description="前面带头像和图标。前面的东西要小，这样这一行才紧凑、好扫。" locale="zh" />
