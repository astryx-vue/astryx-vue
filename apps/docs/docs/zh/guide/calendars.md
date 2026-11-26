---
title: 历法
---

# 历法

日期组件默认显示公历。应用可以换成波斯历、希伯来历、伊斯兰历、佛历、和历、农历等别的历法。不管显示哪种历法，**值始终是公历日期**：`v-model`、`min`、`max` 和事件拿到的都是公历的 `Date`，数据、服务端代码和现有的处理函数都不用改。

## 选一种历法

在 `InternationalizationProvider` 上设 `calendar`，整棵子树都按它显示：

```vue
<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { ref } from 'vue'

// 显示的是波斯历 1405 年阿班月，值仍然是公历 2026-10-30
const date = ref<Date | null>(new Date(2026, 9, 30))
</script>

<template>
  <InternationalizationProvider locale="fa-IR" calendar="persian">
    <Calendar v-model="date" />
  </InternationalizationProvider>
</template>
```

跟着 `calendar` 变的有：

- `Calendar`：格子按这个历法的月份排，标题、日子、读屏名字和翻月（包括 Page Up / Page Down、Shift + Page Up / Page Down）都按它走。
- `DateInput`、`DateTimeInput`、`DateRangeInput`：显示、打字和选择都按它走，见下面的[日期输入](#日期输入)。
- `Timestamp`：带日期的格式按它写；`system_*` 和 `unix_seconds` 在任何历法下都写公历 ISO 或纯数字。
- `PowerSearch`：绝对日期的条件值按它写。
- 实验室里的 `Schedule`：标题和日期按它写，格子仍按公历月和公历周排。

语言和历法互不影响：`locale="en" calendar="hebrew"` 用英文显示希伯来历。语言本身从不决定历法，`fa-IR` 不设 `calendar` 时显示的是波斯语的公历；语言标签里的 `-u-ca-` 扩展（例如 `th-TH-u-ca-buddhist`）也不会改变历法，要换历法就设 `calendar`。

`Calendar` 和三个日期输入也有自己的 `calendar` 属性，优先于 provider。同一屏要并排显示两种历法时用它。

在组件之外，`useLocale()` 返回的 `calendar` 是当前生效的历法。

## 日期输入

日期输入里的文字按历法写，例如 `Aban 8, 1405 AP`，也按历法读：

- 可以打月份名、数字，或者带纪元的年份，例如 `Aban 8, 1405`。失焦时提交对应的公历 `Date`。
- 历法里没有的日子（例如平年的 `Esfand 31`）会说明原因，不提交；超出 `min`、`max` 时，提示里的边界日期也按历法写。
- 非公历的空字段聚焦、又没有传 `placeholder` 时，占位符换成一个按历法写的示例日期，告诉用户该怎么打。
- 字段的历法和 provider 不同时（包括公历字段放在别的历法的应用里），读屏会念出这个字段用的是哪种历法。
- `format` 传函数或 `system_date` 时，文字仍是公历 ISO 日期。

系统日期控件只认公历，所以在非公历下：

- 不传 `presentation`、或者传 `adaptive-native` 时，粗指针上改用底部面板，细指针上照常弹出日历。
- 显式传 `native` 时同样换成 Astryx 的选择器，开发期警告一次。

弹出的日历和底部面板都按历法排月份；底部面板的月份滚轮用历法的月份名（希伯来历闰年有 13 个月），年份滚轮带纪元。`DateRangeInput` 的按钮文字和两个月的日历也按历法写，范围的值仍是公历 ISO 日期。

公历下这些都和以前一样：同样的文字、同样的读法、同样的系统控件。

## 支持的历法

| 历法 | 标识 |
| --- | --- |
| 公历 | `gregory`、`iso8601` |
| 佛历 | `buddhist` |
| 民国纪年 | `roc` |
| 和历 | `japanese` |
| 波斯历 | `persian` |
| 印度国定历 | `indian` |
| 希伯来历 | `hebrew` |
| 伊斯兰历 | `islamic-umalqura`、`islamic-civil`、`islamic-tbla` |
| 农历 | `chinese` |
| 朝鲜历 | `dangi` |
| 科普特历 | `coptic` |
| 埃塞俄比亚历 | `ethiopic`、`ethioaa` |

别的标识（例如 `islamic`）显示公历，开发期警告一次。

月份的长度、闰月和年份都从浏览器自带的 `Intl` 读，不需要额外的库，也不需要 polyfill。运行环境的 `Intl` 显示不了某种历法时，组件显示公历，开发期警告一次。

## 服务端渲染

组件在渲染时就确定历法和月份，服务端和浏览器读的是各自的 `Intl`。两边的 ICU 数据一致时（Node.js 默认带完整的 ICU），渲染出的标记相同。

农历和朝鲜历这类阴阳历的月份从新月的天文计算得来，不同版本的 ICU 偶尔会在某个月从哪天开始上有一天的差别。服务端和浏览器差了这一天时，那个月在浏览器里会重新渲染。需要两边逐字一致时，让服务端用和目标浏览器相近版本的 ICU。

## 周数

`Calendar` 的 `hasWeekNumbers` 在任何历法下都显示 ISO 8601 周数。
