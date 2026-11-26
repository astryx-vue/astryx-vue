---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

对齐上游 Typeahead、Tokenizer 的菜单和状态：新增 `menu` 属性（结果列表周围放信息的 `listbox` 角色，或会拿走焦点的 `dialog` 角色）、`menu` 插槽和 `open()`、`close()` 方法；搜索源的 `search` 第三个参数 `context.update(items)` 可以先显示本地匹配、再追加服务端结果；禁用的字段仍是 Tab 停点，列表残留时也不能再选；搜索忙碌时由输入框念一次「加载中」，防抖里的新输入不再带着上一个查询的「没有结果」；聚焦清单为空或加载失败时收起；选中后把清空的查询报给 `changeQuery`；编辑已选值时 `Escape` 先收起列表，值标签上按退格或删除会清掉值并念出来；搜索框请求触屏键盘的 Search 键且不自动纠正；`startIcon` 可以直接写语义图标名。
