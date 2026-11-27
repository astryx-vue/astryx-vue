---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

CommandPalette：搜索开始时由输入框在对话框里念一次「加载中」，结果念出前先收回没念出去的那一次；第一次搜索还没落定时不再在敲了字的输入框下显示「输入以搜索」；搜索被拒绝按没有结果处理；列表项的 `data-highlighted`、`data-selected`、`data-disabled` 取值改为状态名，主题可以按 `highlighted`、`selected`、`disabled` 给 `command-palette-item` 挂样式；空状态里的长串会折行；输入框带手机键盘的 Search 键并关闭自动纠错，焦点环按输入框自己所在的 document 判断键盘还是指针。
