---
title: 组合式函数
---

# 组合式函数

组合式函数从包根引入：

```ts
import { useClipboard, useControllableState } from '@astryx-vue/core'
```

没有 `@astryx-vue/core/composables` 这个子路径。`packages/core/src/composables/index.ts` 里导出的函数如下。参数以类型定义为准。

| 函数 | 做什么 |
| --- | --- |
| `useControllableState` | 受控或自己管的 `v-model`。setup 时没传入值就一直自己管。 |
| `useAnnounce` | 向读屏播报。对应原版 `useAnnounce`。 |
| `useClipboard` | 写入剪贴板，并在一段时间内把 `isCopied` 设为 true。 |
| `useHotkeys` | 全局快捷键。`mod+k` 这种写法，`mod` 在 Apple 平台是 ⌘。 |
| `useMediaQuery` | 把一条 media query 收成 ref。setup 时就读一次。 |
| `useDismiss` | 浮层的点击外部和 Escape。Escape 走一层栈，最内层先处理。 |
| `useFocusTrap` | 在容器里循环 Tab。 |
| `useRestoreFocus` | 浮层打开时记住焦点，关闭时还回去。 |
| `useScrollLock` | 按引用计数锁住 `body` 滚动。 |
| `useListFocus` | 一维列表的方向键。默认选择器是 `[role="menuitem"]`。 |
| `useClickableContainer` | 让一整块区域可以点击，点到里面的按钮、链接或输入框时不触发外层。 |
| `useGridRovingFocus` | 网格的方向键。 |
| `useTypeahead` | 按字母在一组标签里循环匹配。它不移动焦点，匹配结果交给 `onMatch`。 |
| `useCombobox` | 可搜索的选项列表和当前值。 |
| `useNumberField` | 带最小、最大和步进的数字。 |
| `useAsyncSource`、`createStaticSource` | 可取消的搜索数据源，以及一份本地静态源。 |
| `useOverflow`、`computeOverflow` | 按宽度把多余项收进指示器。`computeOverflow` 是纯计算。 |
| `useLongPress` | 按住超过一段时间后触发，移动过头会取消。 |
| `useStreamingText` | 把已经到达的文本按 `natural`、`fast` 或 `instant` 露出来。 |
| `snapToGraphemeBoundary` | 把偏移对齐到字素边界，给流式文本用。 |
| `useChatStreamScroll` | 对话记录贴底或停住。减少动态效果时，弹簧滚动会改成直接跳。 |
| `useChatNewMessages` | 读者没贴在底部时，标出新长出来的消息。 |

`useClipboard` 还有一个旧名字 `useCopyToClipboard`，从 `@astryx-vue/core` 和 `@astryx-vue/core/Code` 都能引入，类型是同一套。

有些函数跟单个组件走，不在上面这张表里。它们从该组件的子路径引入，也从包根重新导出：

| 函数 | 入口 |
| --- | --- |
| `useToast` | `@astryx-vue/core/Toast` |
| `useImperativeDialog` | `@astryx-vue/core/Dialog` |
| `useImperativeAlertDialog` | `@astryx-vue/core/AlertDialog` |
| `useOverlay` | `@astryx-vue/core/Overlay` |
| `useContextMenu`、`useContextMenuSize` | `@astryx-vue/core/ContextMenu` |
| `useDropdownMenuContext` | `@astryx-vue/core/DropdownMenu` |
| `useSideNavCollapse` | `@astryx-vue/core/SideNav` |
| `useListContext`、`useItemDescriptionId` | `@astryx-vue/core/List` |

语言环境的 `provideAstryxLocale` 和 `useAstryxMessages` 见 [国际化](/guide/i18n)。
