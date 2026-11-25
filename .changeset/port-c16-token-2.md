---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

Typeahead、PowerSearch、Tokenizer、Tooltip、HoverCard 跟进上游一组和 Token 相关的修复。

- Typeahead 有值时，值 Token 的按钮就是这个字段的 Tab 停点。它现在用字段标签加上值命名（例如「Fruit Apple」），说明和状态也和输入框一样读出来。BaseTypeahead 新增 `labelId`。
- PowerSearch 内置的条件标签按全部可见文字命名（「Status: is Open」），删除按钮是「Remove Status: is Open」；点它会打开编辑器时带 `aria-haspopup="dialog"` 和 `aria-expanded`，编辑器是同名的对话框。
- Tokenizer 和 PowerSearch 在触屏上用手指点标签的删除按钮、而输入框没有焦点时，删除后焦点留在原处，屏幕键盘不会弹起来；被删标签原本有焦点时仍交给输入框。
- 在打开的 Tooltip、HoverCard 里按下，不再激活包着触发元素的可点卡片、列表行、树形行或文件选择区；页面级的监听仍然收得到。

CLI 内置的组件文档跟着更新了 Typeahead、PowerSearch、Tokenizer、Tooltip、HoverCard 的说明。
