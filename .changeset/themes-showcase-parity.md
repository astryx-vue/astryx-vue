---
'@astryx-vue/core': patch
'@astryx-vue/themes': patch
---

主题页的展示区和原版逐项对齐：Button、Field 标签、TopNav 条目、RadioList 的字号与行高改读主题的文字 token（label / body / large），不再写死 14px 和 1.4286，所以 stone、gothic、matcha、y2k、butter 下按钮是 16px 或各自的字号；Selector 的触发器改用 `size-element-*` 尺寸 token 和上游同款的行高公式，MultiSelector 控件的字号行高改用 label token；各主题根元素不再设行高，行高继承宿主页面，和原版一致；gothic、y2k、butter 的「自带底色区域文字色」规则改挂到 `.astryx-selector-field` / `.astryx-multi-selector-control`（带 `data-variant='input'` 的那一层），标签不再被误染成浅色。
