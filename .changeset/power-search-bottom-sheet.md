---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

PowerSearch 新增 `presentation`（`'popover' | 'bottom-sheet' | 'adaptive'`，默认 `'adaptive'`）。紧凑触屏上字段默认变成触发器，点开底部弹层编辑条件：「筛选条件」列表里看、改、删，「添加筛选条件」里挑字段，值那一步用单选组选运算符，枚举和相对日期列成单选或复选的行，日期区间是行内的范围日历，多值列表用底部弹层的 Tokenizer。所有改动先记在草稿里，按「完成」才按顺序提交；草稿改过时关闭会先确认，字段在这期间变成只读或禁用时「完成」什么都不报。占位文字太长时以省略号收尾，弹层内容从抓手下面开始。想在所有设备上保留行内字段就传 `presentation="popover"`；底部弹层里 `menuWidth` 和 `overflow` 不生效，开发期会提示一次。

BottomSheet 和 BottomSheetSwitcher 像 Dialog 一样，在自己的 `<dialog>` 里留出浮层挂载点：弹层内容里按钮的提示等浮层挂到这里，不再插进内容区里由 Vue 管着的元素，列表换成空状态时也不会因为插入位置丢失而报错。
