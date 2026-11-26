---
'@astryx-vue/core': patch
'@astryx-vue/charts': patch
---

日期与时间：日历按月格式化日期更快（同一语言和格式只建一次格式化器）；日优先的语言（如 en-GB）里 `12/01/2` 这类不完整的数字文字不再被当成月优先的日期；`createISOTimeString` 只认一位或两位数字的 `H:M`、`H:M:S`，`2:30 PM` 这类文字返回 null；没有整分钟落在范围内时，`clampTime` 保留边界本身而不是落到范围外；图表颜色解析遇到 `constructor`、`__proto__` 这类名字返回 null，不再得到 NaN 颜色。
