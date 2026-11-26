---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

NumberInput 对齐上游：回车或失焦时，读不成数字、整数字段里的小数、`min` 大于 `max` 时的任何数不再被悄悄丢掉，而是留在框里，字段显示「Invalid number」并只念一次；打字过程中什么都不标。新增 `entryErrorChange` 事件（带 `kind`、`text`、`value`）和 `entryErrorBehavior`（数字框两个值时机相同，不读 FormLayout 默认值）。禁用的 NumberInput 仍留在 Tab 顺序里（`aria-disabled`、只读、不运行调用方处理函数），加减按钮用 `aria-disabled`；用鼠标或笔按住按钮会重复步进、松手只提交一次；触屏上加减按钮隐藏；有 `formatValue` 时 Tab 进来仍是全选；`startIcon` 可传语义图标名；步进按钮带 `astryx-number-input-stepper` 主题挂点和 `data-direction`；强制颜色下聚焦可见。Pagination 的页码框改用 NumberInput：超过最后一页收到最后一页，被拒的输入留在框里，说明显示在状态图标上，框会变宽装下图标。TimeInput、DateInput 与 NumberInput 共用同一份拒绝状态与汇报逻辑。 InputGroup 的状态说明显示在整组下面，整组边框不再随状态变色（和上游一致），主题可按 `data-status` 给这一行上样式。
