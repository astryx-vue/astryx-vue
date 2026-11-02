---
'@astryx-vue/core': patch
---

`ToggleButton` 先执行调用方的 click 处理函数，再决定是否切换：调用方取消这次点击，切换就不会发生。`adjustTime` 收到小数分钟时原样返回，不再产出 `"30.5"` 这种无法再解析的时间。
