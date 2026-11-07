# @astryx-vue/lab

## 0.5.1

### Patch Changes

- [#453](https://github.com/astryx-vue/astryx-vue/pull/453) [`6d4641e`](https://github.com/astryx-vue/astryx-vue/commit/6d4641ec4b35370d51c51d654ee4aee071801c30) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - lab 增加 ChatEmojiPicker 和 ChatReactionBar。core 把 `@astryx.emojiPicker.*`、`@astryx.comments.*`、`@astryx.commentComposer.*` 接进文案树，`useTranslator` 可以按这些键取句子。
- Updated dependencies [[`6d4641e`](https://github.com/astryx-vue/astryx-vue/commit/6d4641ec4b35370d51c51d654ee4aee071801c30)]:
  - @astryx-vue/core@0.7.14

## 0.5.0

### Minor Changes

- [#452](https://github.com/astryx-vue/astryx-vue/pull/452) [`9f1f68a`](https://github.com/astryx-vue/astryx-vue/commit/9f1f68a28296b709479407fbca2c1a229e01491e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 CodeEditor：受控代码输入、行号、只读、占位、语法高亮、Tab 缩进与 Escape 后离开；不引入 Monaco。

### Patch Changes

- Updated dependencies [[`9f1f68a`](https://github.com/astryx-vue/astryx-vue/commit/9f1f68a28296b709479407fbca2c1a229e01491e)]:
  - @astryx-vue/core@0.7.13

## 0.4.0

### Minor Changes

- [#451](https://github.com/astryx-vue/astryx-vue/pull/451) [`ca5a8ea`](https://github.com/astryx-vue/astryx-vue/commit/ca5a8eaf3eb9f2dc966d89995697bd3d2feda936) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 Tour、TourStep 与 useTour：按声明顺序运行引导步骤，支持目标高亮、可选遮罩、前后导航、步骤计数和带原因的关闭。复用 Popover，不修改目标元素。

### Patch Changes

- Updated dependencies [[`ca5a8ea`](https://github.com/astryx-vue/astryx-vue/commit/ca5a8eaf3eb9f2dc966d89995697bd3d2feda936)]:
  - @astryx-vue/core@0.7.12

## 0.3.1

### Patch Changes

- [#449](https://github.com/astryx-vue/astryx-vue/pull/449) [`16c66e9`](https://github.com/astryx-vue/astryx-vue/commit/16c66e9953e062a3b762dc0febfc7fc5b1f5bcca) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - MobileTokenizer 的禁用触发器与达到数量上限的选项行保留键盘焦点，使用 aria-disabled 并阻止激活；强制颜色模式保留 GrayText 禁用外观。
- Updated dependencies [[`d3a9e5f`](https://github.com/astryx-vue/astryx-vue/commit/d3a9e5f8d58d3c2f1f5302860650e3500fd75796)]:
  - @astryx-vue/core@0.7.11

## 0.3.0

### Minor Changes

- [#445](https://github.com/astryx-vue/astryx-vue/pull/445) [`ee49d4b`](https://github.com/astryx-vue/astryx-vue/commit/ee49d4b65a5734fee9aabfa053dc836858a0d695) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - DiffViewer 新增 `changeIndicator="classic|bars|none"` 与 `hasChangeBackground`。可切换经典加减号、实线/虚线条或无可见标记；行底色可关闭，行号、行内高亮和 Added/Removed 读屏标签仍保留。未换行的分栏固定左右各半，两侧代码同步横向滚动，行号和变化标记保持可见；统一视图的行号与标记使用 sticky 定位。

### Patch Changes

- Updated dependencies [[`8a86866`](https://github.com/astryx-vue/astryx-vue/commit/8a86866bd08cf332afb296e3099b6714c562c8ed)]:
  - @astryx-vue/core@0.7.9

## 0.2.1

### Patch Changes

- Updated dependencies [[`dacf1fe`](https://github.com/astryx-vue/astryx-vue/commit/dacf1fe1fe16bd653cf15b78798e16819a292b29)]:
  - @astryx-vue/core@0.7.0

## 0.2.0

### Minor Changes

- [#414](https://github.com/astryx-vue/astryx-vue/pull/414) [`cf3112c`](https://github.com/astryx-vue/astryx-vue/commit/cf3112c678e1df8115f2d975b1ee04f1b03323fb) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Add the DiffViewer component with unified and split views, basic changed rows, and word/character inline highlighting. Add `parseUnifiedDiff` and `createDiffFile` to build its file model from patch text or two versions of a text.

### Patch Changes

- Updated dependencies [[`88e2214`](https://github.com/astryx-vue/astryx-vue/commit/88e22141ad5d24ce3f6db2aefe082a9df44a5359), [`c4f2aa5`](https://github.com/astryx-vue/astryx-vue/commit/c4f2aa52b3834549263b8a98e7787ef6a54262c3), [`004f655`](https://github.com/astryx-vue/astryx-vue/commit/004f655f04fcae2194eb694c9a6b61b19adaff0a), [`22e9a74`](https://github.com/astryx-vue/astryx-vue/commit/22e9a74dcc1bcc38bea4bb8499212afbddf7bbd1), [`9685f9a`](https://github.com/astryx-vue/astryx-vue/commit/9685f9a39d4b01c73f59237f1cff0326bd60864e), [`6d366de`](https://github.com/astryx-vue/astryx-vue/commit/6d366de2fac28a02a75315f0b7283a5eed100ca1), [`78d5669`](https://github.com/astryx-vue/astryx-vue/commit/78d56695cc7ee13c01d3347e4b7dd5ce24665c7a), [`2a9b503`](https://github.com/astryx-vue/astryx-vue/commit/2a9b50310e32eb840caac6afe1fbaba65a810f8c), [`346ff39`](https://github.com/astryx-vue/astryx-vue/commit/346ff392db97126214613c6b5608a173b79240a8), [`a74832f`](https://github.com/astryx-vue/astryx-vue/commit/a74832fee24df16e017324f5fb80e8eff76c9baa), [`7ba5cb9`](https://github.com/astryx-vue/astryx-vue/commit/7ba5cb9a0de1d4e824baf235ec23524f4c11be7b)]:
  - @astryx-vue/core@0.6.0

## 0.1.1

### Patch Changes

- [#274](https://github.com/astryx-vue/astryx-vue/pull/274) [`99712ad`](https://github.com/astryx-vue/astryx-vue/commit/99712adffbc714e518c921a11cc6a984b615a69d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 通过 CI 的 Trusted Publisher 发布 lab 的 canary，避免这条发布配置过期。

## 0.1.0

### Minor Changes

- [#263](https://github.com/astryx-vue/astryx-vue/pull/263) [`3d2465e`](https://github.com/astryx-vue/astryx-vue/commit/3d2465e9a025cba8598dd5d1a925fc05e82d3e3c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 首次通过 canary 标签发布 Lab 组件包，包含 ListInput、MobileTokenizer、TransferList、CircularProgress、InfoTip、LogStream、Stat 和 SVGIcon，并提供中英文文档与交互示例。
