---
'@astryx-vue/core': patch
---

对齐原版的表格与相关组件细节：带右键菜单的单元格（可展开行）左右内边距各多 1px，最后一格再叠一份边距；表格分组标题的标签和空格分成两个文本节点。`MultiSelector` 清除按钮改用 `InputClearButton`（20px 的幽灵图标按钮），`MultiSelector`、`Selector`、`ComplexSelector` 的触发框改成固定高度（sm 28 / md 32 / lg 36）和 8px / 12px 的内边距。`Link` 的外链图标换成语义图标 `externalLink`。`Markdown` 的代码块按最长行收缩并以 `contentWidth` 为下限、居中时块自己居中，引用块始终贴左且文字用次要色、首尾子块不再带外边距，列表在居中时按外扩 8px 的宽度居中。`CodeBlock` 的收缩下限可用 `--astryx-code-block-min-width` 调整。
