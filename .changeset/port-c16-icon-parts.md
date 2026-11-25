---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

主题能直接改到组件内部画出来的部位，默认外观不变（跟进上游 #12081）。

- Kbd 每个按键徽章带 `kbd-key`，Typeahead 结果弹层带 `typeahead-popup`，BottomSheet 拖拽条带 `bottom-sheet-handle`，AlertDialog 标题和说明带 `alert-dialog-title`、`alert-dialog-description`。
- Calendar 的区间色带和悬停预览色带带 `calendar-range`、`calendar-range-preview`，色带首尾一天带 `start`、`end`。
- LayoutHeader、LayoutFooter 标出所在容器 `container`（`card`、`dialog`、`bottom-sheet`）；ToggleButton 在 ToggleButtonGroup 里带 `grouped`。
- accent 颜色的 Link 悬停时读 `--link-hover-color`。
- Table 的排序序号和 MetadataList 的「显示更多」改用 `--color-text-accent`，在深色背景上更易读。

CLI 内置的主题文档同步更新。
