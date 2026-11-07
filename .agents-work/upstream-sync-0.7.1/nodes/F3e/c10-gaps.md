# F3e 留给 C10 的核对

对照原版 lab v0.7.1。这次没有改 core 里已有的三个组件。

## ChatTypingIndicator

原版 lab（`1544a7ade`）用 `role="status"` 把整句放在组件上，两个人及以上的名字用 `Intl.ListFormat` 拼接，句子来自 `@astryx.chatTypingIndicator.one`、`.many`、`.others`。

core 的 `ChatTypingIndicator.vue` 不设 `role` 和 `aria-live`，改走 `useAnnounce`；外层已经是 live region 时不再播报。两个人用内置的 `typingTwo`（“和”写死），三个人及以上用 `typingMany`。映射表里 `.many` 写到 `typingNames`、`.others` 写到 `typingOthers`，组件没有读这两个字段，所以换语言目录时，两人及三人以上的句子不会跟着目录走。

圆点、延迟（160ms / 320ms）和 `prefers-reduced-motion` 下停动画，两边一致。

## ChatUnreadDivider

core 已是 `role="separator"`、错误色横线和末尾标签。无障碍名走 `chat.unreadBelow`。原版 lab 把无障碍名写成英文模板 `` `${label} messages below` ``，默认标签是字面量 `New`。core 的简体默认标签是“新消息”，无障碍名也是中文句子。结构对齐，文案比 lab 更完整，不必为了贴 lab 改回去。

## ChatReasoning

折叠、流式闪烁、时长、单行预览、收起时 `inert`，两边都有。core 的触发器是真 `<button>`，原版 lab 是 `role="button"` 的 `div`。原版默认标题写死 `Thinking`，core 用 `chat.thinking`（简体是“思考中”）。

原版 a11y（`8a9d85fdf`）给标题在 `:disabled` / `[aria-disabled="true"]` 时把指针改成 `default`。core 的 `.astryx-chat-reasoning__header` 一直是 `cursor: pointer`，没有这条例外。
