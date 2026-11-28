---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

DateInput 和 DateTimeInput 的底部面板里，月份改成可以左右连续划动，松手总停在整月上；点箭头翻月时，Safari 也会停在标题写的那个月。打开减少动效时箭头直接换月（触屏上是一次淡出淡入），不再滑动。键盘把焦点挪到别的月份时，面板跟着滚过去。
