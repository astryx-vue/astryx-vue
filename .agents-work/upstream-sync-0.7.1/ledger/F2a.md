# F2a 图表纯计算逻辑 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 11 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [x] `ea5705c0f` feat(docsite): surface canary-only components (#5583)
  - 文件：packages/charts/astryx.integration.mjs
  - 还涉及：D5、F1a、F1c、F2c、F3d、F3e、F3f、F5
  - 链接：https://github.com/facebook/astryx/commit/ea5705c0f9566bb7d4f61f28e47073a4895d66b8
  - 结论：不适用（本节点）：只改上游文档站的 canary 组件展示清单 `packages/charts/astryx.integration.mjs`，那是上游 docs 平台的集成描述文件，我们没有这个平台。图表文档归 F2c。

### fix

- [x] `f5841d14c` fix(i18n): use provider locale outside date inputs (#5195)
  - 文件：docs/CHARTV2_VERIFICATION_CHECKLIST.md、packages/charts/src/formatters.test.ts、packages/charts/src/formatters.ts
  - 测试：packages/charts/src/formatters.test.ts
  - 还涉及：B5、C4、C5、C10、C11
  - 链接：https://github.com/facebook/astryx/commit/f5841d14ce40841b3d48cdec0e45f3cabf48f9f8
  - 结论：已采纳：formatters 的每个函数都收 `locale` 参数，并按语言缓存一个 `Intl` 格式化器（`byLocale`），不再用宿主默认语言。`formatters.test.ts` 里「同一种数字在 en-US / de-DE 下不同」「缓存按语言分键」的用例照搬通过。
- [x] `2458b03b3` fix(i18n): harden date locale handling (#5303)
  - 文件：packages/charts/src/formatters.test.ts、packages/charts/src/formatters.ts
  - 测试：packages/charts/src/formatters.test.ts
  - 还涉及：B7、C4、C5、F3b、F3d
  - 链接：https://github.com/facebook/astryx/commit/2458b03b35a45512b996b0c2c764d9530a36a052
  - 结论：已采纳：日期格式化器固定 `calendar: 'gregory'`，避免 `fa-IR`（波斯历）、`th-TH`（佛历）换历法；只有年月日的字符串（`YYYY-MM-DD`）按本地零点构造，并拒绝 `2024-02-31` 这类越界日期。`formatters.test.ts` 里 fa-IR / th-TH 两条用例照搬通过。
- [x] `2247368d3` fix(charts): harden Chart contract (#6247)
  - 文件：packages/charts/src/Chart.spec.md、packages/charts/src/formatters.ts
  - 规范文档：packages/charts/src/Chart.spec.md
  - 还涉及：B5、F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/2247368d3a63dfb5e7a73cc9d32821f6d65d5186
  - 结论：部分采纳：formatters 那一半已采纳——非有限数（NaN、±Infinity）和读不出来的值原样返回，任何输入都不抛错；`formatters.test.ts` 的「passes through non-finite and unparseable values」用例照搬通过。另一半是 `packages/charts/src/Chart.spec.md`（规范文档），归 F2c。

### test

- [x] `1581b0900` test: route charts/vega into the ui vitest project and cover the untested viz packages and hooks (#4295) (#4377)
  - 文件：packages/charts/src/useChartColors.test.ts
  - 测试：packages/charts/src/useChartColors.test.ts
  - 还涉及：B3、B5、C1、C3、C4、C5、C7、C10、C11、C14、F2b、F3b、F3d、F5
  - 链接：https://github.com/facebook/astryx/commit/1581b0900091ece263b18bb1dcb431841b1cbdcb
  - 结论：部分采纳：测试工程那一半已适用——我们的 `vitest.config.ts` 用 `packages/**/*.test.ts` 收测试，charts 包不用额外接入。`useChartColors.test.ts` 测的是读当前主题的 hook，归 F2b。

### docs

- [x] `377296d72` docs(charts): colocate planning records (#5780)
  - 文件：docs/CHARTV2_PHASE1_PLAN.md、docs/CHARTV2_READINESS.md、docs/CHARTV2_STAGE1_DESIGN.md、docs/CHARTV2_VERIFICATION_CHECKLIST.md、packages/charts/docs/CHARTV2_PHASE1_PLAN.md、packages/charts/docs/CHARTV2_READINESS.md、packages/charts/docs/CHARTV2_STAGE1_DESIGN.md、packages/charts/docs/CHARTV2_VERIFICATION_CHECKLIST.md 等 9 个
  - 还涉及：F2c
  - 链接：https://github.com/facebook/astryx/commit/377296d7253bd0e36ab35a93d5f12a637eb55b70
  - 结论：不适用（本节点）：只把上游 docs 目录里的 4 份过时规划记录挪进 `packages/charts/docs/`，是文档整理，没有代码或行为变化。图表文档归 F2c。
- [x] `a4b265566` docs(charts): document ChartGrid audit surface (#6347)
  - 文件：packages/charts/src/ChartGrid.spec.md
  - 规范文档：packages/charts/src/ChartGrid.spec.md
  - 还涉及：F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/a4b265566e16e16962c1e1d21d485c95e6c639ac
  - 结论：不适用（本节点）：只新增 `ChartGrid.spec.md` 规范文档，ChartGrid 组件本身归 F2b，文档归 F2c。
- [x] `a90727569` docs(charts): document ChartLegend audit surface (#6379)
  - 文件：packages/charts/src/ChartLegend.spec.md
  - 规范文档：packages/charts/src/ChartLegend.spec.md
  - 还涉及：F2c
  - 链接：https://github.com/facebook/astryx/commit/a907275695d10bda1c70cec0230a9855dfa31edd
  - 结论：不适用（本节点）：只新增 `ChartLegend.spec.md` 规范文档。图例的计算逻辑（`deriveLegendItems`）已在本节点移植，组件和文档归 F2b / F2c。
- [x] `b09d120ab` docs(charts): document ChartSwatch audit surface (#6388)
  - 文件：packages/charts/src/ChartSwatch.spec.md
  - 规范文档：packages/charts/src/ChartSwatch.spec.md
  - 还涉及：F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/b09d120ab04530dc0f03b5e0a594751ad8595369
  - 结论：不适用（本节点）：只新增 `ChartSwatch.spec.md` 规范文档。色块组件和 `swatchVariantForType` 归 F2b。

### 其它

- [x] `2b2113d7f` [Component Audit] ChartAxis: preserve complete truncated labels (#6346)
  - 文件：packages/charts/src/ChartAxis.spec.md
  - 规范文档：packages/charts/src/ChartAxis.spec.md
  - 还涉及：F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/2b2113d7f95a066a2e21a4b0a27acb819d103601
  - 结论：不适用（本节点）：只新增 `ChartAxis.spec.md`（截断标签保留完整文案）。截断逻辑在 core 的 `truncateCharacters`（B7 `86a7f1752`），组件归 F2b，文档归 F2c。
- [x] `cb7a565c3` [Component Audit] ChartTooltip: keep hover details above modal surfaces (#6394)
  - 文件：packages/charts/src/ChartTooltip.spec.md
  - 规范文档：packages/charts/src/ChartTooltip.spec.md
  - 还涉及：F2b、F2c
  - 链接：https://github.com/facebook/astryx/commit/cb7a565c327b77dead30910912ebddcc1d8abf09
  - 结论：不适用（本节点）：只新增 `ChartTooltip.spec.md`（提示框要盖在模态层之上）。提示框取值 `deriveTooltipSeriesValues` 已在本节点移植，浮层与文档归 F2b / F2c。
