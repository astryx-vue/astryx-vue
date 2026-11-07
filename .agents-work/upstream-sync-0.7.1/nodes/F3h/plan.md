# F3h：CodeEditor 实施计划

## 范围

DiffViewer 基础与显示/滚动行为已完成。本节点剩余 CodeEditor；不实现 Monaco 集成，不把文档站编辑器作为 Lab 依赖。

## 组件边界

- `CodeEditor.vue`：受控 value、contenteditable 输入、行号、只读、占位、键盘行为与高亮生命周期。
- `keyboard.ts`：caret、插入、当前行反缩进等 DOM 编辑辅助。
- core `Code/highlightRanges.ts`：复用 tokenizer 与 Highlight API，提供单文本节点行内范围绘制。
- `styles/code-editor.css`：编辑器布局、焦点和语法高亮规则。

## 验收

- 输入与外部 value 同步；行号、只读、placeholder、maxHeight 正确。
- Tab 缩进，Shift+Tab 反缩进，Enter 保留缩进，括号自动闭合。
- Escape 后 Tab 离开编辑器，下一次回到编辑器后 Tab 恢复缩进；IME 组合不误提交。
- SSR 不访问浏览器 API；真实 Chromium 检查高亮、键盘、焦点、深浅主题与 axe。
- 主站示例与文档可构建；一个 PR，完成后关闭 #199 并一次发版。
