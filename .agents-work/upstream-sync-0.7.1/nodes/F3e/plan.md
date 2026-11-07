# F3e lab 对话 · 执行计划

## 目标

`@astryx-vue/lab` 提供 `ChatEmojiPicker` 和 `ChatReactionBar`。用法和原版 lab（v0.7.1）一致：弹出层里按短名过滤 8 列表情，方向键在格子间移动焦点；回应条显示表情和数量，自己的回应带 `aria-pressed`，监听添加事件才出现末尾按钮。

`@astryx.emojiPicker.*` 16 条、`@astryx.comments.*` 65 条、`@astryx.commentComposer.*` 11 条接到 core 文案树。评论组件还没做，这些键可以先用 `useTranslator` 取。

## API

| 组件 | 属性 | 事件 |
| --- | --- | --- |
| `ChatEmojiPicker` | `emojis`、`label`、`searchLabel`；默认插槽是带按钮的触发器 | `select(emoji)` |
| `ChatReactionBar` | `reactions`、`emojis`、`addLabel`、`label` | `toggle(emoji)`、`add(emoji)` |

另外导出 `DEFAULT_CHAT_EMOJIS`。`add` 没有监听时不渲染添加按钮。

禁用和 `aria-disabled` 只影响样式：没有悬停底或悬停边框，指针是 `default`。两个组件都没有 busy 属性，原版也没有。

## 文件

- `packages/lab/src/Chat/`：组件、类型、默认表情、过滤、测试
- `packages/lab/styles/chat-emoji-picker.css`、`chat-reaction-bar.css`
- `packages/core/src/locale/messages/emoji-picker.ts`、`comments.ts`、`comment-composer.ts`
- `packages/core/src/locale/upstream/comments.ts`
- 文档：`apps/docs/docs/{zh,en}/lab/chat-emoji-picker`、`chat-reaction-bar`

## 验收

1. 默认 16 个表情；短名和表情字符都能过滤；没有匹配时用 `@astryx.emojiPicker.noResults`。
2. 方向键左右移动一格，上下移动一行。
3. `select` / `toggle` / `add` 的参数是表情字符；选中后过滤词清空。
4. 有 `label` 的胶囊带提示；没有时无障碍名是 `1 reaction with …` / `N reactions with …`。
5. `zh-CN` 下搜索框、空结果、添加按钮和数量句子换成内置中文。
6. `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 覆盖本组件和 `loadCatalog`；`pnpm check:i18n-catalog` 通过。

## 不在这次里

评论整套组件（CommentComposer、CommentThread、Comments、CommentPin、独立 EmojiPicker）不在本节点。`ChatReasoning`、`ChatTypingIndicator`、`ChatUnreadDivider` 已在 core，差异记在 `c10-gaps.md`，这次不改它们。
