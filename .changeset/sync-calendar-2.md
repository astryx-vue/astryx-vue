---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

`DateInput`、`DateTimeInput`、`DateRangeInput` 新增 `calendar` 并跟随 provider 的历法：按这个历法显示、打字和选择日期，非公历的空字段聚焦时给出示例日期，系统日期控件在非公历下换成 Astryx 的选择器；值始终是公历日期，公历下的行为不变。
