---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

TimeInput 和 DateTimeInput 的时间文字跟随语言：没写 `hourFormat` 时按当前语言的时制（`en-GB`、`de-DE`、`zh-CN` 默认 24 小时），数字、分隔符和上下午的词也用语言自己的写法，打字时读得懂这些写法。时间那段被拒的输入现在留在框里并说明原因：没打完的时间不标，完整却超出 `min`/`max` 的时间立刻亮出来（`entryErrorBehavior="blur-or-enter"` 则等 Enter 或失焦），读不成时间的文字等 Enter 或失焦；Enter 不再被拦，外面的表单照常提交。TimeInput 新增 `entryErrorBehavior` 属性和 `entryErrorChange` 事件。忙碌时的转圈对读屏隐藏，字段自己只念一次「加载中」。Timer 的 elapsed 文字按当前语言写单位。
