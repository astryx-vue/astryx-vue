# F3d 实验包：图表与编辑器 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 9 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [ ] `ea0483449` feat(theme): add appearance nesting tokens (#5963)
  - 文件：packages/lab/src/Chart/ChartZoom.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F2b、F3a、F3b、F3c
  - 链接：https://github.com/facebook/astryx/commit/ea0483449dcbdd69aed43aa0d4ba9d6f57f54447
- [ ] `ea5705c0f` feat(docsite): surface canary-only components (#5583)
  - 文件：packages/lab/src/Chart/ChartArea.doc.mjs、packages/lab/src/Chart/ChartBar.doc.mjs、packages/lab/src/Chart/ChartCandlestick.doc.mjs、packages/lab/src/Chart/ChartDot.doc.mjs、packages/lab/src/Chart/ChartDotGL.doc.mjs、packages/lab/src/Chart/ChartDotGLInteractive.doc.mjs、packages/lab/src/Chart/ChartHeatmapGL.doc.mjs、packages/lab/src/Chart/ChartLine.doc.mjs 等 19 个
  - 规范文档：packages/lab/src/Chart/ChartArea.doc.mjs、packages/lab/src/Chart/ChartBar.doc.mjs、packages/lab/src/Chart/ChartCandlestick.doc.mjs、packages/lab/src/Chart/ChartDot.doc.mjs、packages/lab/src/Chart/ChartDotGL.doc.mjs、packages/lab/src/Chart/ChartDotGLInteractive.doc.mjs、packages/lab/src/Chart/ChartHeatmapGL.doc.mjs、packages/lab/src/Chart/ChartLine.doc.mjs、packages/lab/src/Chart/ChartStreamGL.doc.mjs、packages/lab/src/ThreeD/3DBar.doc.mjs、packages/lab/src/ThreeD/3DChart.doc.mjs、packages/lab/src/ThreeD/3DScatter.doc.mjs、packages/lab/src/ThreeD/3DScatterGL.doc.mjs、packages/lab/src/ThreeD/3DSurface.doc.mjs、packages/lab/src/ThreeD/ThreeDBar.doc.mjs、packages/lab/src/ThreeD/ThreeDChart.doc.mjs、packages/lab/src/ThreeD/ThreeDScatter.doc.mjs、packages/lab/src/ThreeD/ThreeDScatterGL.doc.mjs、packages/lab/src/ThreeD/ThreeDSurface.doc.mjs
  - 还涉及：D5、F1a、F1c、F2a、F2c、F3e、F3f、F5
  - 链接：https://github.com/facebook/astryx/commit/ea5705c0f9566bb7d4f61f28e47073a4895d66b8
- [ ] `0788e9b93` feat(lab): parseUnifiedDiff reads a patch into the DiffViewer file model (#7568)
  - 文件：packages/lab/src/DiffViewer/diffTypes.ts、packages/lab/src/DiffViewer/index.ts、packages/lab/src/DiffViewer/parseUnifiedDiff.test.ts、packages/lab/src/DiffViewer/parseUnifiedDiff.ts
  - 测试：packages/lab/src/DiffViewer/parseUnifiedDiff.test.ts
  - 还涉及：F3f
  - 链接：https://github.com/facebook/astryx/commit/0788e9b9319f0ad29d666c2df737d99249116d53

### fix

- [ ] `ea9983363` fix(lab): add tab stops to scrollable regions (#4691)
  - 文件：packages/lab/src/CodeEditor/CodeEditor.test.tsx、packages/lab/src/CodeEditor/CodeEditor.tsx
  - 测试：packages/lab/src/CodeEditor/CodeEditor.test.tsx
  - 还涉及：F3b
  - 链接：https://github.com/facebook/astryx/commit/ea9983363399c1b86ade1cca405107dfb1c479dd
- [ ] `2458b03b3` fix(i18n): harden date locale handling (#5303)
  - 文件：packages/lab/src/Chart/formatters.test.ts、packages/lab/src/Chart/formatters.ts
  - 测试：packages/lab/src/Chart/formatters.test.ts
  - 还涉及：B7、C4、C5、F2a、F3b
  - 链接：https://github.com/facebook/astryx/commit/2458b03b35a45512b996b0c2c764d9530a36a052
- [ ] `046f6ea2b` fix(docs): rename input category to form controls (#5686)
  - 文件：packages/lab/src/CodeEditor/CodeEditor.doc.mjs
  - 规范文档：packages/lab/src/CodeEditor/CodeEditor.doc.mjs
  - 还涉及：C1、C2、C3、C4、C5、C15、D4、F1c、F3a
  - 链接：https://github.com/facebook/astryx/commit/046f6ea2baee04dc7eeefa17718f6556b4d533fa

### refactor

- [ ] `d6da8e43f` refactor(charts): consume public data variables (#6833)
  - 文件：packages/lab/src/Chart/ChartCandlestick.test.tsx、packages/lab/src/Chart/ChartCandlestick.tsx
  - 测试：packages/lab/src/Chart/ChartCandlestick.test.tsx
  - 还涉及：B1、F6
  - 链接：https://github.com/facebook/astryx/commit/d6da8e43ff2a9d959e33c55e487a8cd73977aa1d

### test

- [ ] `1581b0900` test: route charts/vega into the ui vitest project and cover the untested viz packages and hooks (#4295) (#4377)
  - 文件：packages/lab/src/Chart/Chart.test.tsx、packages/lab/src/Chart/ChartArea.test.tsx、packages/lab/src/Chart/ChartAxis.test.tsx、packages/lab/src/Chart/ChartBar.test.tsx、packages/lab/src/Chart/ChartBrush.test.tsx、packages/lab/src/Chart/ChartCandlestick.test.tsx、packages/lab/src/Chart/ChartDot.test.tsx、packages/lab/src/Chart/ChartDotGL.test.tsx 等 36 个
  - 测试：packages/lab/src/Chart/Chart.test.tsx、packages/lab/src/Chart/ChartArea.test.tsx、packages/lab/src/Chart/ChartAxis.test.tsx、packages/lab/src/Chart/ChartBar.test.tsx、packages/lab/src/Chart/ChartBrush.test.tsx、packages/lab/src/Chart/ChartCandlestick.test.tsx、packages/lab/src/Chart/ChartDot.test.tsx、packages/lab/src/Chart/ChartDotGL.test.tsx 等 36 个
  - 还涉及：B3、B5、C1、C3、C4、C5、C7、C10、C11、C14、F2a、F2b、F3b、F5
  - 链接：https://github.com/facebook/astryx/commit/1581b0900091ece263b18bb1dcb431841b1cbdcb

### 其它

- [ ] `6e6b9b476` revert(theme): restore local stacking contracts (#6031)
  - 文件：packages/lab/src/Chart/ChartZoom.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F2b、F3a、F3b、F3c
  - 链接：https://github.com/facebook/astryx/commit/6e6b9b476713156899fc8bd2107f3f3ee2d26a90
