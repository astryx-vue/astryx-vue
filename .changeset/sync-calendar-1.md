---
'@astryx-vue/core': minor
'@astryx-vue/lab': minor
'@astryx-vue/cli': patch
---

`InternationalizationProvider` 新增 `calendar`，可以选波斯历、希伯来历、伊斯兰历、佛历、和历、农历等历法：`Calendar` 按这个历法排月份、翻月和写日期（也可以用组件自己的 `calendar` 属性），`Timestamp`、`PowerSearch` 和实验室的 `Schedule` 按它写日期，`useLocale()` 返回当前的 `calendar`；值始终是公历日期，不设时仍是公历。`fa-IR`、`th-TH` 等默认历法不是公历的语言下，公历日历的标题和读屏名字不再混进别的历法。
