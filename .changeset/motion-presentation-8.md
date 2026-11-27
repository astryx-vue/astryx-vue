---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

Tokenizer 新增 `presentation` 属性（`'popover' | 'bottom-sheet' | 'adaptive'`），默认 `'adaptive'`：紧凑触屏上，字段变成一个显示标签的触发器，点开触屏底部弹层编辑。弹层里有搜索框、每条结果一行复选框，底部钉着「全部清除」和「保存」。勾选、新建、全部清除都只改一份草稿，按「保存」才提交一次（只触发一次 `change`）；草稿改过之后下滑、点遮罩或按 Escape 会先问要不要放弃，「全部清除」也会先确认。关上后焦点回到触发器；字段在弹层开着时被禁用会把弹层关上。桌面和非触屏设备照旧是行内输入框。

默认值变了：以前在手机上也是行内输入框，现在是底部弹层。想在所有设备上保留行内字段就传 `presentation="popover"`；PowerSearch 的列表值输入已经这样固定。底部弹层里 `item` 插槽、`hasClear`、`hasEntriesOnFocus`、`menuWidth`、`menu`、`overflow`、`hasAutoFocus` 没有地方生效，开发期会提示一次。
