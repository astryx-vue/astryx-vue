# dashboard-composition 走查

对照图（按滚动分段，原版左、我们右）：`/tmp/D12-shots/scroll/dashboard-composition-light-final.png`；改前的旧图 `dashboard-composition-light.png`。深色没有重截。
原版 767 行，我们改前 457 行。页面总高：原版 2556，我们 2556。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| 页头 | My Portfolio + 「1 year」下拉 | 相同 | 一致 |
| KPI 卡顺序 | 两行两列：Total value / Dividend yield；Annual return / holdings | 四张按 Total value / Annual return / Dividend yield / holdings 平铺，换行后顺序不同 | 已修：两组各两张，和原版一样先分组再排列 |
| KPI 大数字字重 | 29px，**粗体 700** | 400（细） | 已修：模板里补 `font-weight: 700`。core 问题待写进回报：`.astryx-text--type-display-3` 的字重（300）规则特异性盖过 `.astryx-text--weight-bold`，所以 `type="display-3" weight="bold"` 的粗体永远不生效；原版同样写法是粗体 |
| 「View details」「View all」字号 | 14px（宽 48 高 20） | 16px（55×24） | 已修：用 `Text type=body` 包住 Link（Link 自己的 `size` 属性不生效，同 table-filter 里记的 core 问题） |
| Top Assets 行：代码（AAPL）字重 | 粗体 14px | 常规 | 已修：用 `label` 插槽放加粗 `Text` |
| **Portfolio Value 面积图逐项核对** | | | |
| 　撑满容器 | svg 836 × 340 | 836 × 340 | 一致 |
| 　y 轴刻度档数 | **4 档**：$200k / $240k / $280k / $320k | 3 档（$200k / $260k / $320k） | 已修：`PlaygroundAreaChart` 加 `yTicks`（默认仍是三档，不影响其它模板），传 `[200000, 240000, 280000, 320000]` |
| 　y 轴刻度位置 | 文字 y = 305 / 207 / 109 / 10，x 右对齐 25 | 位置按 3 档算 | 已修：内框 `{top 10, right 10, bottom 35, left 50}`，文字垂直居中。核对 305 / 207 / 108 / 10（第三档 108 对 109，差 1px 的舍入） |
| 　x 轴刻度位置 | Oct / Jan / Apr / Jul / Oct，y = 318，居中：x = 50 / 244 / 438 / 632 / 826 | 同 5 个标签 | 一致 |
| 　网格 | 4 条横线：y = 305 / 206.67 / 108.33 / 10，x 50 → 826 | 3 条 | 已修：4 条，坐标逐位一致 |
| 　线型 / 线宽 | `linear` 折线，1.5px | 折线，1.5px | 一致 |
| 　渐变填充 | 0.3 → 0.05 | 相同 | 一致 |
| 　图例 / 副标题 | 无图例；标题「Portfolio Value」+ 右侧 View details | 相同 | 一致 |
| Market Today 标题与「View more」 | 24px / 600 + 副标题；右侧次按钮 | 相同 | 一致 |
| **市场卡迷你折线逐项核对（8 张）** | | | |
| 　撑满容器 | svg 398 × 40 | 398 × 40，但 viewBox 100×40 + `preserveAspectRatio=none`，线被拉成粗斜线（图上明显偏粗） | 已修：`PlaygroundSparkline isMeasured`（量宽，不拉伸），上下各留 2px。第一条折线首点逐点一致：0,23.83 / 4.19,27.08 / 8.38,26.41 |
| 　线宽 / 线型 | 1.5px 折线，涨绿跌红 | 同 | 一致 |
| 　价格大数字 | 29px **700** | 400 | 已修（同 KPI 大数字） |
| Trending Stocks 表 | 表头 38；行高 41；10 行 | 相同 | 一致 |
| 　表内 24h Trend 迷你折线 | svg 119 × 24，线宽 1 | 119 × 24，被拉伸 | 已修：量宽，首点逐点一致：0,17.14 / 2.54,16.85 / 5.08,13.31 |
| 　涨跌 Badge | 绿 / 红底；Token 宽 45 | 宽 45 | 一致 |
| 深色模式 | 同浅色 | 未重截 | 结构与浅色同 |
