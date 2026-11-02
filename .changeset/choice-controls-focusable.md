---
'@astryx-vue/core': patch
---

`CheckboxInput` 和 `Switch` 禁用时不再用原生 `disabled`，改用可聚焦的 `aria-disabled`：键盘仍能停到控件上，读屏能读到名称和禁用原因，但值不会改变。禁用期间控件同时脱离所在表单，既不会提交，也不会用 `required` 拦住提交。原生复选框的"不确定"状态在禁用点击后保持不变。
