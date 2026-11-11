---
title: CommentPin
---

# CommentPin

头像优先的按钮：打开一条锚定的批注线程，或宿主定义的一组线程。单线程标记显示首位参与者；分组标记最多显示三个头像圆——超过三人时前两个加省略号——并显示线程总数。只要有未读线程，总数（或单线程的头像）后面就会出现一个强调色状态点。

这是 Meta Astryx 实验室 `CommentPin` 的 Vue 移植，对齐 v0.7.13。宿主负责分组、代表人选、坐标、碰撞处理，以及激活后打开的评论界面；图钉只负责按钮表面和受控的视觉状态。需要打开评论内容时可复用已有的 `Comments` / `CommentThread`。本组件不会改名或替换 `ChatEmojiPicker`。

<script setup lang="ts">
import { labCommentPin, labCommentPinSizes } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labCommentPin" description="与官方 Over content and in margin 故事对齐的放置画布：两个图钉。分组图钉默认在图片上选中；再次激活已选中的图钉会取消选中；选中其中一个时，另一个会变淡。" locale="zh" title="叠在内容上，以及页边距里" /></ClientOnly>

此组件位于 `@astryx-vue/lab`，仅通过 `canary` 标签发布。

## 导入

```ts
import { CommentPin } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 必填的无障碍操作名，也用作悬停/聚焦时的提示。当分组、未读或已解决会改变操作含义时，应写进标签，例如 “打开 Ada 和 Lin 的 4 条分组批注，其中 2 条未读”。 |
| `participants` | `readonly [CommentPinParticipant, ...CommentPinParticipant[]]` | — | 非空的参与者列表，首位是代表。单线程图钉渲染第一个；分组图钉按不重复的 `id` 组成最多三个圆的 `AvatarGroup`：不超过三人时全部显示，否则前两个加省略号溢出圆。请传入全部不重复的参与者，这样只有超过三人时才会出现省略号。每条记录包含 `id`、`name` 和可选的 `avatarSrc`。 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | 按元素尺寸档：`sm` 28px、`md` 32px、`lg` 36px，对应 22px、24px、28px 的头像圆。 |
| `threadCount` | `number` | `1` | 此标记代表的线程总数。大于 1 时使用分组样式并显示精确总数。非法值回退为 1。 |
| `unreadCount` | `number` | `0` | 其中有未读动态的线程数，会封顶到 `threadCount`。大于 0 时在图钉末尾显示强调色状态点，不会再显示第二个数字。非法值会被忽略。 |
| `isSelected` | `boolean` | `false` | 此图钉是否为当前选中的批注目标。 |
| `isDimmed` | `boolean` | `false` | 宿主中是否另有图钉被选中。会把此图钉变淡，但不禁用，以便切换选中项。 |
| `isResolved` | `boolean` | `false` | 此图钉代表的全部线程是否都已解决。已解决且未选中的图钉不渲染，这样已解决的讨论会离开画面，但读者正在打开的线程仍保留锚点。 |
| `isDisabled` | `boolean` | `false` | 是否不可激活。禁用的图钉仍可聚焦，使用 `aria-disabled="true"` 而不是原生 `disabled`，因此在聚焦时变为禁用不会丢失焦点。 |

`CommentPinParticipant` 为 `{ id: string, name: string, avatarSrc?: string }`。

## 事件

| 名称 | 载荷 | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 图钉被激活。禁用时不会触发，点击也不会冒泡到可点击的祖先。 |

## 放置

绝对定位时，把宿主锚点对准图钉逻辑上的「下-起始」角：气泡轮廓在这个角使用固定的 2px `border-end-start-radius`，另外三个角是图钉高度的一半。先定位，再 `translateY(-100%)`，让尖角落在锚点上。图钉本身不计算坐标，也不处理碰撞。

<ClientOnly><DemoExample :demo="labCommentPinSizes" description="三种元素尺寸下的单线程、分组、溢出、未读和选中分组标记。" locale="zh" title="尺寸" /></ClientOnly>

## 无障碍

按钮是唯一的可访问控件。头像、省略号、线程总数和未读点都放在 `aria-hidden` 轨道里。`aria-pressed` 反映选中状态。提示文案使用 `label`；图钉禁用或标签为空时不显示提示。
