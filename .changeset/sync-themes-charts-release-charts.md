---
'@astryx-vue/charts': minor
'@astryx-vue/cli': patch
---

图表对齐上游：
- `line()`、`area()`、`band()` 默认用直线段连点，要平滑曲线自己写 `curve: 'monotone'`。
- 新增 `ChartValueFormat` 类型；内置的 `compactNumber`、`percent`、`shortDate`、`monthYear` 和 `currency()` 的返回值都能直接赋给它，值是 `null` 或 `undefined` 时返回 `undefined`（不再写成「0」「0%」「$0」或「null」）；`currency()` 返回的函数还接受调用时给的语言，工厂里指定的语言优先。
- `ChartAxis` 的 `tickFormat` 可以返回 `null` 或 `undefined`，此时显示默认刻度文字；刻度抽稀后一定保留最后一个，距离前一个不足一个步长时顶替它。
- 带圆点的折线和散点图把线性 x 范围往里收圆点半径，首尾的圆点不再被绘图区裁掉一半。
- 分类 x 轴忽略 `xDomain`，柱子和其他标记不再因为线性比例尺放不下分类名而画不出来。
- 面积图的渐变 id 整页唯一，同一页上两张画同一个系列的图不再互相引用渐变。
