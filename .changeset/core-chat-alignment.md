---
'@astryx-vue/core': patch
---

对齐上游对话类组件的渲染：对话气泡最大宽度回到 `max(80%, 280px)`（窄列里可以超出列宽，和上游一致）；ChatToolCalls 的目标文字可收缩并显示省略号，分组箭头占 14px，单条调用的行不再撑破容器；ChatLayout 滚动按钮隐藏时同时 `visibility: hidden`，图标按 md 尺寸画满；ChatDictationButton 的麦克风图标跟随按钮尺寸；ChatComposerDrawer 的标签在 Layout 悬停时也变深；CodeBlock 标题不再截断、不换行；Markdown 的紧凑密度首尾块去掉外边距，列表恢复两侧 8px 的外扩宽度，表格宽度改为 100%（内容放不下时列内换行）；Text 新增 `size="xsm"`；neutral 主题的 `--astryx-chat-success` / `--astryx-chat-error` 改用 45 档颜色。
