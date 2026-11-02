---
"@astryx-vue/core": patch
---

`Timestamp` 服务端渲染时不再读取当前时间。绝对格式（`date`、`date_long`、`date_weekday`、`date_time`、`time`、`system_*`、`unix_seconds`）从头到尾不读时钟，服务端渲染、静态预渲染和客户端写出同一段 HTML；`relative`、`relative_short` 和 `auto` 只在客户端读时钟：服务端渲染和 hydration 那一趟输出带时区标签的 UTC 完整日期时间，挂载后换成格式的正常输出，所以服务端和客户端标记始终一致，时区不同的服务器和浏览器也不会 hydration 失败。仅客户端渲染的结果不变。没有 API 变更。
