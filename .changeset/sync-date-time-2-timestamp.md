---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

Timestamp 新增 `timezoneID`，绝对格式按指定时区写文字，服务端和浏览器一致；`tooltipEntries` 里没写时区的行跟随它。写在 Timestamp 上的属性现在落到 `<time>` 上，调用方的 `aria-label` 和 `tabindex` 优先；相对读数的名字以屏幕上显示的词开头，后面接完整日期；实时刷新在时间或名字有它参与的控件拿着焦点时先等着；悬停卡片保持描述列表结构，复制按钮在各行的值里面，没有标签的行用时区全名命名；卡片的 `aria-controls` 写在能聚焦的 `<time>` 上。HoverCard 只在支持的角色上写 `aria-haspopup`，没有角色的触发器不再写。
