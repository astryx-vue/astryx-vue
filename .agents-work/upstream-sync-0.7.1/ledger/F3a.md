# F3a 实验包：输入类组件 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 26 个提交 · 其中破坏性 4 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

- [ ] `936b1f73a` feat(inputs)!: FR10 prop targets for TextInput, TextArea, NumberInput, FileInput (#7336)
  - 文件：packages/lab/src/MobileTokenizer/MobileTokenizer.tsx、packages/lab/src/TransferList/TransferList.tsx
  - 还涉及：C1、D5、D7、D8
  - 链接：https://github.com/facebook/astryx/commit/936b1f73a039d4d4c6150c662b93f8d08beb3eed
- [ ] `5777977fe` feat(selectors)!: FR10 prop targets for Selector, MultiSelector, ComplexSelector (#7341)
  - 文件：packages/lab/src/TransferList/TransferList.doc.mjs、packages/lab/src/TransferList/TransferListSelector.test.tsx、packages/lab/src/TransferList/TransferListSelector.tsx
  - 规范文档：packages/lab/src/TransferList/TransferList.doc.mjs
  - 测试：packages/lab/src/TransferList/TransferListSelector.test.tsx
  - 还涉及：C1、C3、D5、D7、D8
  - 链接：https://github.com/facebook/astryx/commit/5777977fea4a8ebc29ea47621eaafb56140e6383
- [ ] `b507cdef4` feat(core)!: BottomSheet pads its content by default, like Dialog (#6884)
  - 文件：packages/lab/src/MobileTokenizer/MobileTokenizer.tsx
  - 还涉及：C5、C8、C14、D5、D6、D7
  - 链接：https://github.com/facebook/astryx/commit/b507cdef4dbfb1aebe54fa5a510989b68e9b75e9
- [ ] `f3a218198` fix(theme)!: spacing tokens follow the root font size (#7359)
  - 文件：packages/lab/src/ListInput/ListInput.test.tsx
  - 测试：packages/lab/src/ListInput/ListInput.test.tsx
  - 还涉及：B1、C11、D4、D7、D8
  - 链接：https://github.com/facebook/astryx/commit/f3a218198b7d8bbb03568bcb391939032756b16e

## 新功能 / 修复 / 其它

### feat

- [ ] `bc3423808` feat(lab): harden ListInput to the states its props already promise (#5200)
  - 文件：packages/lab/src/ListInput/ListInput.test.tsx、packages/lab/src/ListInput/ListInput.tsx
  - 测试：packages/lab/src/ListInput/ListInput.test.tsx
  - 还涉及：B5
  - 链接：https://github.com/facebook/astryx/commit/bc3423808023c0f3c0a851fc117eb746c8d7a4b6
- [ ] `95f5b3525` feat(lab): bring the TransferList primitive inside the audits (#5223)
  - 文件：packages/lab/src/TransferList/TransferList.doc.mjs、packages/lab/src/TransferList/TransferList.test.tsx、packages/lab/src/TransferList/TransferList.tsx
  - 规范文档：packages/lab/src/TransferList/TransferList.doc.mjs
  - 测试：packages/lab/src/TransferList/TransferList.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/95f5b3525b5c3a67c1f317da0e828730eed735ed
- [ ] `1fdecb1ae` feat(Selector): add selector-option-row theme target on the option row (#5179)
  - 文件：packages/lab/src/ListInput/ListInput.tsx
  - 还涉及：C3、C7、C8、F3c
  - 链接：https://github.com/facebook/astryx/commit/1fdecb1ae6c3e7015ecaf2022f7d63b35f042c74
- [ ] `ea0483449` feat(theme): add appearance nesting tokens (#5963)
  - 文件：packages/lab/src/reorderStyles.ts
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F2b、F3b、F3c、F3d
  - 链接：https://github.com/facebook/astryx/commit/ea0483449dcbdd69aed43aa0d4ba9d6f57f54447
- [ ] `e983e37f1` feat(lab): MobileTokenizer — touch Tokenizer prototype (#6640)
  - 文件：packages/lab/src/MobileTokenizer/MobileTokenizer.doc.mjs、packages/lab/src/MobileTokenizer/MobileTokenizer.test.tsx、packages/lab/src/MobileTokenizer/MobileTokenizer.tsx、packages/lab/src/MobileTokenizer/index.ts
  - 规范文档：packages/lab/src/MobileTokenizer/MobileTokenizer.doc.mjs
  - 测试：packages/lab/src/MobileTokenizer/MobileTokenizer.test.tsx
  - 还涉及：F3f
  - 链接：https://github.com/facebook/astryx/commit/e983e37f13ee24ff869cc424d5680680baf03b27

### fix

- [ ] `1e823c153` fix(ListInput): route all visible and AT-facing strings through i18n (#4967)
  - 文件：packages/lab/src/ListInput/ListInput.test.tsx、packages/lab/src/ListInput/ListInput.tsx
  - 测试：packages/lab/src/ListInput/ListInput.test.tsx
  - 还涉及：B5
  - 链接：https://github.com/facebook/astryx/commit/1e823c15344dc520443b74ba8ac726f4d4d213c7
- [ ] `9c489238b` fix(ListInput): remove invalid aria-required from role=group container (#4965)
  - 文件：packages/lab/src/ListInput/ListInput.test.tsx、packages/lab/src/ListInput/ListInput.tsx
  - 测试：packages/lab/src/ListInput/ListInput.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/9c489238b1d7ba66f1b4a29ed624f411b093f2aa
- [ ] `d990fb58d` fix(a11y): no hover state on disabled elements (#5247)
  - 文件：packages/lab/src/TransferList/TransferList.tsx
  - 还涉及：B1、B3、C1、C2、C3、C4、C5、C10、C11、C12、C13、C14、C15、C16、F3b、F3e
  - 链接：https://github.com/facebook/astryx/commit/d990fb58d902b2315d9809f1469cfc8c753c4889
- [ ] `e891c0dc8` fix(a11y): a disabled control answers the pointer with not-allowed (#5323)
  - 文件：packages/lab/src/reorderStyles.ts
  - 还涉及：B2、B3、C1、C2、C3、C4、C5、C6、C7、C8、C9、C10、C11、C12、C13、C14、C15、C16、F3b、F3e
  - 链接：https://github.com/facebook/astryx/commit/e891c0dc871628ab69fef5f44be04deeb3fe6c2f
- [ ] `8a9d85fdf` fix(a11y): one disabled cursor everywhere — default, not not-allowed (#5335)
  - 文件：packages/lab/src/reorderStyles.ts
  - 还涉及：B2、B3、C1、C2、C3、C4、C5、C6、C7、C8、C9、C10、C11、C12、C13、C14、C15、C16、F3b、F3e
  - 链接：https://github.com/facebook/astryx/commit/8a9d85fdf35e23788938b739e4d0d8443ad7d739
- [ ] `e3259c946` fix(TransferList): localize all strings and stop disabling on busy (#5457)
  - 文件：packages/lab/src/TransferList/TransferList.tsx、packages/lab/src/TransferList/TransferListSelector.test.tsx、packages/lab/src/TransferList/TransferListSelector.tsx
  - 测试：packages/lab/src/TransferList/TransferListSelector.test.tsx
  - 还涉及：B5
  - 链接：https://github.com/facebook/astryx/commit/e3259c94696e9730d11d4c97e0adca5af1b14cf3
- [ ] `6040af6c8` fix(TransferList): clear the three open audit BLOCKs (#5538)
  - 文件：packages/lab/src/TransferList/TransferList.test.tsx、packages/lab/src/TransferList/TransferList.tsx
  - 测试：packages/lab/src/TransferList/TransferList.test.tsx
  - 还涉及：B5
  - 链接：https://github.com/facebook/astryx/commit/6040af6c8859415790d91f1f166b71dd2334f2bf
- [ ] `046f6ea2b` fix(docs): rename input category to form controls (#5686)
  - 文件：packages/lab/src/ListInput/ListInput.doc.mjs、packages/lab/src/TransferList/TransferList.doc.mjs
  - 规范文档：packages/lab/src/ListInput/ListInput.doc.mjs、packages/lab/src/TransferList/TransferList.doc.mjs
  - 还涉及：C1、C2、C3、C4、C5、C15、D4、F1c、F3d
  - 链接：https://github.com/facebook/astryx/commit/046f6ea2baee04dc7eeefa17718f6556b4d533fa
- [ ] `1232b85af` fix(theme): remove bare prop and state classes (#6121)
  - 文件：packages/lab/src/ListInput/ListInput.test.tsx
  - 测试：packages/lab/src/ListInput/ListInput.test.tsx
  - 还涉及：B1、B7、C1、C2、C3、C5、C9、C10、C12、C14、C15、C16、D3、D4、D6
  - 链接：https://github.com/facebook/astryx/commit/1232b85afb484ca2be9d3928d2d47afde5ccf555
- [ ] `94bdc8e8b` fix: reset TransferListSelector drafts, Tour steps, and Lightbox zoom during render (#7351)
  - 文件：packages/lab/src/TransferList/TransferListSelector.test.tsx、packages/lab/src/TransferList/TransferListSelector.tsx
  - 测试：packages/lab/src/TransferList/TransferListSelector.test.tsx
  - 还涉及：C7、F3c
  - 链接：https://github.com/facebook/astryx/commit/94bdc8e8b128e28d3abad9e8c1fe2d0b509403e6

### docs

- [ ] `48088c611` docs(SideNav,BottomSheet): recast em dashes in prop descriptions (#5054)
  - 文件：packages/lab/src/TransferList/TransferList.doc.mjs
  - 规范文档：packages/lab/src/TransferList/TransferList.doc.mjs
  - 还涉及：C8、C13
  - 链接：https://github.com/facebook/astryx/commit/48088c61109bae1d30136dbe56d0c5dba55a5ea7
- [ ] `e60974e88` docs(ListInput): document the astryx-list-input theming target (#4966)
  - 文件：packages/lab/src/ListInput/ListInput.doc.mjs
  - 规范文档：packages/lab/src/ListInput/ListInput.doc.mjs
  - 链接：https://github.com/facebook/astryx/commit/e60974e8879f66487ebd305f0a91681e1f380382
- [ ] `e678380ed` docs(design): seed design convention records (#5802)
  - 文件：docs/design/ordered-collection-reordering.md
  - 还涉及：B1、B3、C10、C15、D5
  - 链接：https://github.com/facebook/astryx/commit/e678380edc76c8365f98e0c1e85893a8e7cd5c8d

### 其它

- [ ] `6e6b9b476` revert(theme): restore local stacking contracts (#6031)
  - 文件：packages/lab/src/reorderStyles.ts
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F2b、F3b、F3c、F3d
  - 链接：https://github.com/facebook/astryx/commit/6e6b9b476713156899fc8bd2107f3f3ee2d26a90
- [ ] `13fdb14a5` Polish MobileTokenizer touch flow (#6853)
  - 文件：packages/lab/src/MobileTokenizer/MobileTokenizer.doc.mjs、packages/lab/src/MobileTokenizer/MobileTokenizer.test.tsx、packages/lab/src/MobileTokenizer/MobileTokenizer.tsx
  - 规范文档：packages/lab/src/MobileTokenizer/MobileTokenizer.doc.mjs
  - 测试：packages/lab/src/MobileTokenizer/MobileTokenizer.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/13fdb14a5fb88dd6cd46cc21f345a6abbcdf4f3f
- [ ] `0fcce6513` Enable custom MobileTokenizer items (#6857)
  - 文件：packages/lab/src/MobileTokenizer/MobileTokenizer.doc.mjs、packages/lab/src/MobileTokenizer/MobileTokenizer.test.tsx、packages/lab/src/MobileTokenizer/MobileTokenizer.tsx
  - 规范文档：packages/lab/src/MobileTokenizer/MobileTokenizer.doc.mjs
  - 测试：packages/lab/src/MobileTokenizer/MobileTokenizer.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/0fcce6513fe34c479aa7e21a02f8af4540353505
- [ ] `4fc416b03` Prototype single-sheet MobileTokenizer flow (#6855)
  - 文件：packages/lab/src/MobileTokenizer/MobileTokenizer.doc.mjs、packages/lab/src/MobileTokenizer/MobileTokenizer.test.tsx、packages/lab/src/MobileTokenizer/MobileTokenizer.tsx
  - 规范文档：packages/lab/src/MobileTokenizer/MobileTokenizer.doc.mjs
  - 测试：packages/lab/src/MobileTokenizer/MobileTokenizer.test.tsx
  - 链接：https://github.com/facebook/astryx/commit/4fc416b0380600919682321d8c497ad884516079

## 结论（第 1 轮）

采纳 12 条，不适用 14 条。逐条结论：

- `936b1f73a` 已采纳：MobileTokenizer / TransferList 的无障碍名落在真控件上（面板 `role="group"` + 触发器 `aria-label`）。
- `5777977fe` 已采纳：TransferListSelector 的触发器/弹层语义不变，`data-testid` 仍落在触发器按钮上。
- `b507cdef4` 已采纳：MobileTokenizer 给 BottomSheet 显式传 `padding: 0`，自己排内容。
- `f3a218198` 不适用：spacing token 跟根字号，归 themes / B1。
- `bc3423808` 已采纳：ListInput 的 `aria-disabled` / `aria-busy` 分开，删除按钮走 `aria-disabled` 保留提示。
- `95f5b3525` 已采纳：TransferList 两栏是 `role="group"` + 语义列表，不是 listbox。
- `1fdecb1ae` 已采纳：选项行主题目标 `astryx-transfer-list-item` + `data-side` / `data-state`。
- `ea0483449` 不适用：appearance 嵌套 token，归 F1b。
- `e983e37f1` 已采纳：MobileTokenizer 单面板流程整条搬了。
- `1e823c153` 已采纳：ListInput 16 条键接进 upstreamMap。
- `9c489238b` 已采纳：组容器没有 `aria-required`，有对应用例。
- `d990fb58d` 已采纳：禁用元素没有悬停态（三个组件的 CSS 都是 `:hover:where(:not(:disabled,[aria-disabled='true']))`）。
- `e891c0dc8` 已采纳：禁用光标统一 `default`；core 部分归 B2/B3。
- `8a9d85fdf` 已采纳：同上，最终形态是 `cursor: default`。
- `e3259c946` 已采纳：TransferList 26 + 3 条键本地化；busy 只用 `aria-busy`，不禁用字段区。
- `6040af6c8` 已采纳：焦点转移、读屏播报、reorder-disabled 作为屏障。
- `046f6ea2b` 不适用：文档分类改名，归 F3f。
- `1232b85af` 不适用：去掉裸 prop/state 类，归 B1。
- `94bdc8e8b` 已采纳（改写）：React 渲染期重置草稿改成 Vue 同步 watcher，行为用例覆盖；Profiler 帧数断言标 todo。
- `48088c611` 不适用：SideNav/BottomSheet 文档措辞，归 C8/C13。
- `e60974e88` 不适用：ListInput 主题目标文档，归 F3f。
- `e678380ed` 不适用：设计约定文档，不动代码。
- `6e6b9b476` 不适用：局部层叠契约，归 B1。
- `13fdb14a5` 已采纳：MobileTokenizer 触屏流程打磨（等宽底栏、批量清空确认）。
- `0fcce6513` 已采纳：自定义条目（`hasCreate` 的 `Create "…"` 行 + 尾部 Add）。
- `4fc416b03` 已采纳：单面板 MobileTokenizer 流程。
