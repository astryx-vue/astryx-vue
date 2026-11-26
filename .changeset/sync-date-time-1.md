---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

日期字段对齐上游：DateInput 忙碌时不再画成禁用的样子，禁用的字段聚焦时照样有焦点环（强制颜色下也看得见），转圈不出声、进入忙碌只播报一次（DateRangeInput 同样）；弹出日历只在打开时挂载，按在输入框、清除按钮或标签上不再关上，焦点离开字段时关上，清除后日历保持打开；没打字时 Enter 照常提交表单；底部面板翻到范围尽头时焦点交给另一个箭头，手指下的月份年份滚轮带着已选日期走，服务端渲染不读今天，第一行落在抓手条下面，禁用时重置不起作用；滚轮的方向键走到头不再绕回，并支持 Page 键；西班牙语、法语、俄语等语言的日历月份标题首字母大写；粗指针下日期和时间字段的焦点样子不再渐变。日期输入打的文字被拒时（读不成日期、半截日期、日历上没有的日子、超出范围或被规则排除）会留在框里并说明原因；新增 `entryErrorBehavior`（`complete` 或 `blur-or-enter`）、`entryErrorChange` 事件，FormLayout 新增 `defaultEntryErrorBehavior`，DateInput 和 DateTimeInput 都支持；日历在对话框里被点遮罩关掉时，这一下只关日历，对话框留着。
