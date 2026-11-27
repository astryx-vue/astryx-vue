---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

PowerSearch：「全部清除」只移除可编辑的条件、保留只读条件，并用自己的话念出结果；没写 `isDateOnly` 的绝对日期按 `timezoneID` 里的那一天读写（没设时区是 UTC 的那一天），`isDateOnly: false` 才带时刻；`statusVariant` 新增 `tooltip`；条件标签的文字由文案拼成，各语言可调换顺序；输入框带手机键盘的 Search 键并关闭自动纠错；缺 `config` 时报出点名的错误。
