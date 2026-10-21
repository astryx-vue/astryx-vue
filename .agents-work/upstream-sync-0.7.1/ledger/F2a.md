# F2a 图表纯计算逻辑 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 11 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [ ] `ea5705c0f` feat(docsite): surface canary-only components (#5583)
  - 文件：packages/charts/astryx.integration.mjs
  - 还涉及：D5、F1a、F1c、F2c、F3d、F3e、F3f、F5
  - 链接：https://github.com/facebook/astryx/commit/ea5705c0f9566bb7d4f61f28e47073a4895d66b8

### fix

- [ ] `f5841d14c` fix(i18n): use provider locale outside date inputs (#5195)
  - 文件：docs/CHARTV2_VERIFICATION_CHECKLIST.md、packages/charts/src/formatters.test.ts、packages/charts/src/formatters.ts
  - 测试：packages/charts/src/formatters.test.ts
  - 还涉及：B5、C4、C5、C10、C11
  - 链接：https://github.com/facebook/astryx/commit/f5841d14ce40841b3d48cdec0e45f3cabf48f9f8
- [ ] `2458b03b3` fix(i18n): harden date locale handling (#5303)
  - 文件：packages/charts/src/formatters.test.ts、packages/charts/src/formatters.ts
  - 测试：packages/charts/src/formatters.test.ts
  - 还涉及：B7、C4、C5、F3b、F3d
  - 链接：https://github.com/facebook/astryx/commit/2458b03b35a45512b996b0c2c764d9530a36a052
- [ ] `2247368d3` fix(charts): harden Chart contract (#6247)
  - 文件：packages/charts/src/Chart.spec.md、packages/charts/src/formatters.ts
  - 规范文档：packages/charts/src/Chart.spec.md
  - 还涉及：B5、F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/2247368d3a63dfb5e7a73cc9d32821f6d65d5186

### test

- [ ] `1581b0900` test: route charts/vega into the ui vitest project and cover the untested viz packages and hooks (#4295) (#4377)
  - 文件：packages/charts/src/useChartColors.test.ts
  - 测试：packages/charts/src/useChartColors.test.ts
  - 还涉及：B3、B5、C1、C3、C4、C5、C7、C10、C11、C14、F2b、F3b、F3d、F5
  - 链接：https://github.com/facebook/astryx/commit/1581b0900091ece263b18bb1dcb431841b1cbdcb

### docs

- [ ] `377296d72` docs(charts): colocate planning records (#5780)
  - 文件：docs/CHARTV2_PHASE1_PLAN.md、docs/CHARTV2_READINESS.md、docs/CHARTV2_STAGE1_DESIGN.md、docs/CHARTV2_VERIFICATION_CHECKLIST.md、packages/charts/docs/CHARTV2_PHASE1_PLAN.md、packages/charts/docs/CHARTV2_READINESS.md、packages/charts/docs/CHARTV2_STAGE1_DESIGN.md、packages/charts/docs/CHARTV2_VERIFICATION_CHECKLIST.md 等 9 个
  - 还涉及：F2c
  - 链接：https://github.com/facebook/astryx/commit/377296d7253bd0e36ab35a93d5f12a637eb55b70
- [ ] `a4b265566` docs(charts): document ChartGrid audit surface (#6347)
  - 文件：packages/charts/src/ChartGrid.spec.md
  - 规范文档：packages/charts/src/ChartGrid.spec.md
  - 还涉及：F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/a4b265566e16e16962c1e1d21d485c95e6c639ac
- [ ] `a90727569` docs(charts): document ChartLegend audit surface (#6379)
  - 文件：packages/charts/src/ChartLegend.spec.md
  - 规范文档：packages/charts/src/ChartLegend.spec.md
  - 还涉及：F2c
  - 链接：https://github.com/facebook/astryx/commit/a907275695d10bda1c70cec0230a9855dfa31edd
- [ ] `b09d120ab` docs(charts): document ChartSwatch audit surface (#6388)
  - 文件：packages/charts/src/ChartSwatch.spec.md
  - 规范文档：packages/charts/src/ChartSwatch.spec.md
  - 还涉及：F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/b09d120ab04530dc0f03b5e0a594751ad8595369

### 其它

- [ ] `2b2113d7f` [Component Audit] ChartAxis: preserve complete truncated labels (#6346)
  - 文件：packages/charts/src/ChartAxis.spec.md
  - 规范文档：packages/charts/src/ChartAxis.spec.md
  - 还涉及：F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/2b2113d7f95a066a2e21a4b0a27acb819d103601
- [ ] `cb7a565c3` [Component Audit] ChartTooltip: keep hover details above modal surfaces (#6394)
  - 文件：packages/charts/src/ChartTooltip.spec.md
  - 规范文档：packages/charts/src/ChartTooltip.spec.md
  - 还涉及：F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/cb7a565c327b77dead30910912ebddcc1d8abf09
