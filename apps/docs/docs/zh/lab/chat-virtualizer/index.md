---
title: ChatVirtualizer
---

# ChatVirtualizer

给很长的聊天记录用的虚拟列表：只把视口附近的几行真正渲染出来，其余用空白占位。停在最底下时，新消息来了会跟着往下走；往上翻以后，新消息、往上加载历史、上面某一行变高，都不会把正在读的那一行挤走。

<script setup lang="ts">
import { labChatVirtualizer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labChatVirtualizer" description="两千条消息只渲染看得见的几十行。在底部时点发送会跟着走；往上翻再加载更早的消息，读的那一行不动。" locale="zh" title="基本用法" /></ClientOnly>

这个组件属于 `@astryx-vue/lab`，只通过 `canary` 标签发布，接口以后还可能改。

## 导入

```ts
import { ChatVirtualizer } from '@astryx-vue/lab'
```

## 两种用法

- **自带滚动容器**：不传 `scrollElement`。组件自己渲染一个滚动的 `div`，你给它定高度和 `overflow-y: auto`。这个容器能用键盘聚焦，无障碍名默认是「消息」，可以用 `label` 改。
- **挂到已有的滚动容器上**：把那个元素传给 `scrollElement`，组件只渲染行，滚动的是你的容器。传整页的 `document.documentElement` 也行，这时组件会按视口来量位置，旋转屏幕时也保持顶上那一行不动。元素还没准备好时传 `null`，组件先什么都不渲染。

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `data` | `T[]` | 必填 | 从旧到新排列的消息。往前加旧消息、往后加新消息都行。 |
| `getRowKey` | `(item: T, index: number) => string \| number` | 必填 | 每条消息的稳定身份，用来记住位置和尺寸。 |
| `estimatedItemSize` | `number` | `120` | 还没量过的行先按这个高度估算。 |
| `getItemType` | `(item: T, index: number) => string` | — | 给行分类，同一类的行共用量出来的平均高度，估算更准。 |
| `scrollElement` | `HTMLElement \| null` | — | 挂载模式下的滚动容器。不传就用自带的容器。 |
| `endThreshold` | `number` | `24` | 离底部多近算「在底部」，在底部才跟随新消息。单位像素。 |
| `overscanTop` | `number` | `1600` | 视口上方额外渲染多少像素的行。 |
| `overscanBottom` | `number` | `600` | 视口下方额外渲染多少像素的行。 |
| `label` | `string` | 文案键 `@astryx.chatVirtualizer.label` | 自带滚动容器的无障碍名。 |

`class`、`style` 等其余属性落在自带的滚动容器上；挂载模式下落在内容块上。

## 插槽

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `{ item: T, index: number }` | 渲染一行。 |

## 实例方法

通过模板 `ref` 拿到组件实例后调用。

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `scrollToDistanceFromBottomPx` | `px = 0` | 滚到离底部 `px` 像素的位置；传 `0` 就是回到底部，重新开始跟随。 |
| `anchorToKey` | `key, viewportOffset = 0` | 让 `key` 这一行的顶边停在离视口顶 `viewportOffset` 像素的地方。找不到这一行时回到底部。 |

## 行为说明

- 拿着键盘焦点的那一行，就算被滚出了渲染范围也会留着，焦点不会丢。
- 往上翻、窗口刚挂上一批历史行时，内容块会短暂带上 `aria-busy="true"`，免得读屏软件把它们当成新消息念出来；底部来的新消息不受影响。
- 手指在触屏上滚动时，组件不改滚动位置，等手指松开再把位置对齐。
- 组件会关掉滚动容器上浏览器自带的滚动锚定，卸载时还原。
