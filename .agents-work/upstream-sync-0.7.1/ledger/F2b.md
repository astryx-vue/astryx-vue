# F2b 图表展示组件 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 8 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [ ] `ea0483449` feat(theme): add appearance nesting tokens (#5963)
  - 文件：packages/charts/src/ChartTooltip.test.tsx、packages/charts/src/ChartTooltip.tsx
  - 测试：packages/charts/src/ChartTooltip.test.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F3a、F3b、F3c、F3d
  - 链接：https://github.com/facebook/astryx/commit/ea0483449dcbdd69aed43aa0d4ba9d6f57f54447

### fix

- [ ] `2247368d3` fix(charts): harden Chart contract (#6247)
  - 文件：packages/charts/src/Chart.test.tsx、packages/charts/src/Chart.tsx、packages/charts/src/ChartLegend.test.tsx、packages/charts/src/ChartLegend.tsx
  - 测试：packages/charts/src/Chart.test.tsx、packages/charts/src/ChartLegend.test.tsx
  - 还涉及：B5、F2a、F2c
  - 链接：https://github.com/facebook/astryx/commit/2247368d3a63dfb5e7a73cc9d32821f6d65d5186

### test

- [ ] `1581b0900` test: route charts/vega into the ui vitest project and cover the untested viz packages and hooks (#4295) (#4377)
  - 文件：packages/charts/src/Chart.test.tsx、packages/charts/src/ChartAxis.test.tsx、packages/charts/src/ChartGrid.test.tsx、packages/charts/src/ChartLegend.test.tsx、packages/charts/src/ChartSwatch.test.tsx、packages/charts/src/ChartTooltip.test.tsx、packages/charts/src/marks/marks.test.tsx
  - 测试：packages/charts/src/Chart.test.tsx、packages/charts/src/ChartAxis.test.tsx、packages/charts/src/ChartGrid.test.tsx、packages/charts/src/ChartLegend.test.tsx、packages/charts/src/ChartSwatch.test.tsx、packages/charts/src/ChartTooltip.test.tsx、packages/charts/src/marks/marks.test.tsx
  - 还涉及：B3、B5、C1、C3、C4、C5、C7、C10、C11、C14、F2a、F3b、F3d、F5
  - 链接：https://github.com/facebook/astryx/commit/1581b0900091ece263b18bb1dcb431841b1cbdcb

### docs

- [ ] `a4b265566` docs(charts): document ChartGrid audit surface (#6347)
  - 文件：packages/charts/src/ChartGrid.test.tsx、packages/charts/src/ChartGrid.tsx
  - 测试：packages/charts/src/ChartGrid.test.tsx
  - 还涉及：F2a、F2c
  - 链接：https://github.com/facebook/astryx/commit/a4b265566e16e16962c1e1d21d485c95e6c639ac
- [ ] `b09d120ab` docs(charts): document ChartSwatch audit surface (#6388)
  - 文件：packages/charts/src/ChartSwatch.tsx
  - 还涉及：F2a、F2c
  - 链接：https://github.com/facebook/astryx/commit/b09d120ab04530dc0f03b5e0a594751ad8595369

### 其它

- [ ] `6e6b9b476` revert(theme): restore local stacking contracts (#6031)
  - 文件：packages/charts/src/ChartTooltip.test.tsx、packages/charts/src/ChartTooltip.tsx
  - 测试：packages/charts/src/ChartTooltip.test.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F3a、F3b、F3c、F3d
  - 链接：https://github.com/facebook/astryx/commit/6e6b9b476713156899fc8bd2107f3f3ee2d26a90
- [ ] `2b2113d7f` [Component Audit] ChartAxis: preserve complete truncated labels (#6346)
  - 文件：packages/charts/src/ChartAxis.test.tsx、packages/charts/src/ChartAxis.tsx
  - 测试：packages/charts/src/ChartAxis.test.tsx
  - 还涉及：F2a、F2c
  - 链接：https://github.com/facebook/astryx/commit/2b2113d7f95a066a2e21a4b0a27acb819d103601
- [ ] `cb7a565c3` [Component Audit] ChartTooltip: keep hover details above modal surfaces (#6394)
  - 文件：packages/charts/src/ChartTooltip.test.tsx、packages/charts/src/ChartTooltip.tsx
  - 测试：packages/charts/src/ChartTooltip.test.tsx
  - 还涉及：F2a、F2c
  - 链接：https://github.com/facebook/astryx/commit/cb7a565c327b77dead30910912ebddcc1d8abf09
