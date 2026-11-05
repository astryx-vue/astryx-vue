---
'@astryx-vue/core': patch
---

修复复合控件的禁用焦点。TreeList 的展开按钮、动作按钮和链接改用 `aria-disabled`，保留焦点且阻止行为。Pagination 圆点补齐 roving tabindex、方向键换页和禁用焦点；当前圆点保留唯一 Tab 停靠点。两类控件都显示统一的键盘焦点环。
