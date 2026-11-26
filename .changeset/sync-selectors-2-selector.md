---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

对齐上游 Selector 系列的无障碍和交互：Selector 的触发器接上调用方的 `aria-labelledby`（带搜索时名字末尾带上所选的值），列表由字段标签命名，必填的带搜索 Selector 把 `aria-required` 放到搜索框上；选中后焦点回到触发器，列表开着时被禁用就不再改值，选项变了高亮跟着原来的选项走；AltGr 键入的字母也能按字母跳转；选项带 `highlighted`、`selected`、`disabled` 主题状态；幽灵和次要样式的触发器有键盘焦点环；缺少 `options` 时开发期报明确的错误；ComplexSelector 的忙碌图标对读屏隐藏并只念一次「加载中」。`useCombobox` 新增 `getFieldProps`、`getListboxProps`、`getOptionProps` 和 `getItemId`，给自己渲染的输入框接组合框。
