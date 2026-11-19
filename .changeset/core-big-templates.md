---
'@astryx-vue/core': patch
---

对齐原版的若干细节：Button 里带显式 `size` 的 Icon 保持自己的盒子；Tokenizer 默认按内容收缩、有标签时内边距为 3px；Avatar 首字母行高跟正文行高比例走；SideNavSection 标题和条目之间不再多 2px；ChatMessageBubble 的名字行沿用正文样式并按内容收窄靠边；AppShell 自动高度时页头钉在顶部；Selector 下拉列表（无搜索框）把选中项盖在触发器上，选项之间不留空隙；浮层 start 对齐右边放不下时翻成 end 对齐；MoreMenu 行高 md 为 32px；Dialog 里 DialogHeader 无分隔线时内容不再多 16px 顶部内边距。
