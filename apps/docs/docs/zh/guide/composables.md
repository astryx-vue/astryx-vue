---
title: 组合式函数
---

# 组合式函数

组件库将常用的交互逻辑与无障碍底层能力封装为 Vue 3 组合式函数（Composable）。通用函数支持直接从包根统一导入：

```ts
import { useClipboard, useControllableState } from '@astryx-vue/core'
```

> **注意**：包内未设置 `@astryx-vue/core/composables` 子路径。在 `packages/core/src/composables/index.ts` 中导出的通用函数如下表所示，具体参数签名以 TypeScript 类型定义为准：

| 函数名称 | 主要用途 |
| --- | --- |
| `useControllableState` | 统一管理受控与非受控状态。常用于封装兼容 `v-model` 的自定义输入控件。 |
| `useAnnounce` | 触发屏幕阅读器读屏语音播报，帮助视障用户获取动态操作反馈。 |
| `useClipboard` | 将指定文本写入系统剪贴板，并在短时间内提供响应式的 `isCopied` 状态。 |
| `useHotkeys` | 注册页面全局快捷键。支持 `mod+k` 等直观写法，其中 `mod` 在 macOS 上对应 ⌘ 键。 |
| `useMediaQuery` | 响应式监听 CSS 媒体查询（Media Query），将其转化为响应式 Ref。 |
| `useDismiss` | 统一处理浮层的外部点击（Click Outside）与按下 Escape 键退出，内置撤销栈确保内层弹层优先响应。 |
| `useFocusTrap` | 在模态弹窗或抽屉容器内循环限制键盘 Tab 焦点，防止焦点跑出容器。 |
| `useRestoreFocus` | 弹窗打开时自动记住触发源，弹窗关闭后将焦点智能送回原来的按钮。 |
| `useScrollLock` | 带有引用计数的背景滚动锁定。即使打开多个嵌套弹窗，关闭时也能准确恢复页面滚动。 |
| `useListFocus` | 处理一维垂直或水平列表的键盘上下左右键导航，默认查找 `[role="menuitem"]` 元素。 |
| `useClickableContainer` | 让整块卡片区域都能点击，且点击卡片内部的按钮、输入框或超链接时，不会误触发外层容器的点击。 |
| `useGridRovingFocus` | 二维卡片网格的键盘方向键流转导航（Roving tabindex）。 |
| `useTypeahead` | 支持输入首字母在列表中快速定位匹配条目，不强行移动焦点，而是把匹配结果传递给 `onMatch` 回调。 |
| `useCombobox` | 封装可筛选、带联想搜索的下拉选择框状态与当前选中值。 |
| `useNumberField` | 封装支持最大值、最小值、步进（step）的数值微调输入逻辑。 |
| `useAsyncSource`、`createStaticSource` | 支持可取消的异步搜索数据源，以及本地纯前端静态数据集管理。 |
| `useOverflow`、`computeOverflow` | 当容器宽度不够时，智能计算哪些菜单项需要折叠收录到「更多」下拉菜单中。 |
| `useLongPress` | 移动端与桌面端的长按触发手势。若手指滑动超过阈值会自动取消长按。 |
| `useStreamingText` | 处理 AI 打字机流式输出的平滑文本呈现，支持自然停顿（`natural`）、快速（`fast`）与瞬间显示（`instant`）。 |
| `snapToGraphemeBoundary` | 将字符串截断偏移智能对齐到文字的「字素边界」（避免生硬切断 Emoji 或复合字符）。 |
| `useChatStreamScroll` | 智能跟随 AI 聊天对话流滚动。用户向上翻阅时保持原位，生成结束或位于底部时平滑吸底。 |
| `useChatNewMessages` | 当读者未贴合在对话流底部时，在页面上浮动提示有未读的新消息产生。 |
| `useKeyboardHint` | 当用户第一次通过键盘方向键切入一组控件时，在当前焦点项旁边短暂弹出操作提示气泡。 |
| `useImageMode` | 自动采样图片亮度，智能推断上层该使用深色还是浅色的前景文字；若采样失败则采用安全回退值。 |
| `useContainerReveal` | 仅在鼠标悬停或键盘聚焦到容器时，才优雅露出操作按钮，返回对应的样式类名。 |
| `useMenuPress` | 在菜单项按下后，吸收吞掉浏览器可能冗余触发的随后那次点击事件，防止误触。 |

> **别名提示**：`useClipboard` 拥有一个兼容旧版的名字 `useCopyToClipboard`，从包根或 `@astryx-vue/core/Code` 均可引入，底层完全等价。

## 组件关联的组合式函数

部分与特定组件深度绑定的函数，既可从对应组件的子路径导入，也可从包根导入：

| 函数名称 | 对应组件入口 |
| --- | --- |
| `useToast` | `@astryx-vue/core/Toast` |
| `useImperativeDialog` | `@astryx-vue/core/Dialog` |
| `useImperativeAlertDialog` | `@astryx-vue/core/AlertDialog` |
| `useOverlay` | `@astryx-vue/core/Overlay` |
| `useContextMenu`、`useContextMenuSize` | `@astryx-vue/core/ContextMenu` |
| `useDropdownMenuContext` | `@astryx-vue/core/DropdownMenu` |
| `useSideNavCollapse` | `@astryx-vue/core/SideNav` |
| `useListContext`、`useItemDescriptionId` | `@astryx-vue/core/List` |
| `useTheme`、`useMediaTheme` | `@astryx-vue/core/Theme` |
| `useIndicator` | `@astryx-vue/core/Indicator` |
| `useSemanticIcon` | `@astryx-vue/core/Icon` |
| `useSyntaxTheme` | `@astryx-vue/core/Code` |
| `useChatComposerContext`、`useChatComposerTokens`、`useChatPasteAsToken`、`useChatDictation`、`useSpeechRecognition` | `@astryx-vue/core/Chat` |

多语言与国际化相关的 `provideAstryxLocale` 和 `useAstryxMessages`，请参阅 [国际化](/guide/i18n)。
