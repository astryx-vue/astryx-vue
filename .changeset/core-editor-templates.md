---
'@astryx-vue/core': patch
---

对齐原版的若干细节：Toast 关闭按钮改用 ghost 小号 IconButton，卡片内分成正文和尾部两栏、高度不再被按钮撑高；SegmentedControl 图标槽跟分段尺寸走（sm 14px、md 16px、lg 18px）；TreeListItemData 新增 `endContent`，行尾可放行内操作；useContainerReveal 的 `isLayoutPreserved` 只淡入淡出、不再脱离文档流；Section 把自己的内边距也发布成 Layout 区域之间的内侧间距，里面的 LayoutFooter 顶部不再多 16px；Selector 新增 `placement`，下拉面板的尺寸类落在面板自己身上（ghost 触发器字重 500），固定在底部的工具栏可以朝上展开；DropdownMenu 勾选行和单选行不再跟菜单尺寸收紧内边距；CodeBlock 高亮行用主题的 accent-muted 底色，行文本包进内容 span。
