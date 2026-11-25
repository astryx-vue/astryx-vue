# @astryx-vue/lab

## 0.6.2

### Patch Changes

- Updated dependencies [[`76d1bb6`](https://github.com/astryx-vue/astryx-vue/commit/76d1bb68afc03cd54a727b22e8932ec8217862cb)]:
  - @astryx-vue/core@0.8.0

## 0.6.1

### Patch Changes

- [#517](https://github.com/astryx-vue/astryx-vue/pull/517) [`3d1eb56`](https://github.com/astryx-vue/astryx-vue/commit/3d1eb56dd9c087bad55a31afffa709929b896dd0) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 状态色按所在的底分成几种角色，组件各取其一：
  
  - `defineTheme` 做的主题只写了状态底色（或改了表面色、`--color-on-dark` / `--color-on-light`）时，会按主题自己的颜色算出没写的 `--color-on-<状态>`、`--color-text-<状态>`、`--color-on-<状态>-muted`，图标和边框角色跟着文字色走；Badge、StatusDot、输入框、图标等组件变量也在这个主题里跟着换。算出来的变量名记在 `theme.derivedTokens`。新增 `STATUS_COLOR_DEFAULTS`，和默认主题 CSS 里的状态色一致。
  - `Icon` 新增 `color="info"`。各主题里 `Icon` 的 success / warning / error 颜色、Stepper 的状态图标改用图标角色；默认主题下成功图标从 `#00490B` 变为 `#2F7D33`。
  - 输入框的状态边框改用边框角色，表单状态提示的文字改用浅底内容色；默认主题下浅色模式的警告边框从 `#FFCE2F` 变为 `[#836700](https://github.com/astryx-vue/astryx-vue/issues/836700)`。
  - 默认主题的 StatusDot 用实心状态底色，图标用对应的 on 角色；头像状态点的图标也用 on 角色。
  - 聊天输入框状态条的文字和图标改用浅底内容色；菜单里的危险操作、TextArea 和富文本编辑器超出字数的计数、未读分隔线标签、lab 里 Stat、CircularProgress、LogStream、SVGIcon 的状态色改用文字或图标角色。
  - 强制配色模式下，Badge、StatusDot、进度条填充、步骤条数字徽标、聊天输入框状态条、列表滑动的危险操作都补一圈边，形状不会消失。
  
  想保留某个组件原来的颜色，在主题里写上对应的角色即可，比如把 `--color-icon-success` 设成原来的值。
- Updated dependencies [[`c7035a1`](https://github.com/astryx-vue/astryx-vue/commit/c7035a1463495c9fbafc4823bedb4c5e2d082aa2), [`3d1eb56`](https://github.com/astryx-vue/astryx-vue/commit/3d1eb56dd9c087bad55a31afffa709929b896dd0)]:
  - @astryx-vue/core@0.7.29

## 0.6.0

### Minor Changes

- [#511](https://github.com/astryx-vue/astryx-vue/pull/511) [`45613e7`](https://github.com/astryx-vue/astryx-vue/commit/45613e74ed0302b63bfb56e5e2172a4bafbf94bb) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 LineClamp：把任意内容（混合的行内内容、嵌套元素）截成固定行数，结尾带省略号，自己不加字体和颜色。截断时第一次悬停、轻点或键盘聚焦才挂提示，用提示显示全文，截断的根元素是 Tab 停靠点；被裁掉那几行里的链接等可聚焦元素会标成 `inert`，重新露出来时还原，不改写你自己的 `tabindex`、`aria-hidden` 和 `inert`。

### Patch Changes

- [#505](https://github.com/astryx-vue/astryx-vue/pull/505) [`6fc4715`](https://github.com/astryx-vue/astryx-vue/commit/6fc471578ecb89aa5cdd4c0c5c6751273bbb02cf) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Text、Heading 的截断测量和截断提示跟进上游。
  
  - 截断的 Text / Heading 不再随文字挂一个关着的提示层，等第一次悬停、轻点或键盘聚焦才挂；挂上后照常回应那次交互（悬停等延迟、轻点立刻打开）。之前每个截断元素都带着 `aria-describedby` 和一个隐藏的提示层，现在交互前都没有。
  - 截断测量改用全页共用的 ResizeObserver，第一次测量在浏览器排版之后进行，挂载一长串截断文字时不再逐个强制排版。
  - 新增从 `@astryx-vue/core/Text` 导出的 `useTruncation`，自己的组件也能「截断时才显示全文提示」。
  - 不截断的 Text / Heading 里，比一行还长的串（URL、ID）会换行，不再撑出横向滚动；用 `overflow-wrap: anywhere` 换行的内置容器（Banner、Toast、FieldStatus 等）里的文字跟着用 anywhere，浮层里回到 break-word。
  - Heading 没写 `level`、或不是 1–6 时按 2 级渲染并在开发时警告，不再渲染出无效的标签；调用方自己写的 `aria-level` 优先于 `accessibilityLevel`。
  - Tooltip 轻点触发器里的文本框时只让它获得焦点，不开也不关提示。
  - Button 的标签被行宽截短时，键盘聚焦就在提示里显示完整标签；表头单元格的标题被截短时，键盘聚焦到单元格里的排序按钮也一样。这两种提示不加描述，读屏只读一遍名称。
  
  CLI 内置的组件文档跟着更新了 Text、Heading、Button 的说明。
- Updated dependencies [[`cc73651`](https://github.com/astryx-vue/astryx-vue/commit/cc73651813d0dc905150a67a8d4377f8f5f882d8), [`90a7127`](https://github.com/astryx-vue/astryx-vue/commit/90a7127a47057e379ff9255cf00c7fe4cee09a79), [`45b95b5`](https://github.com/astryx-vue/astryx-vue/commit/45b95b5ffc4b0c6d3faf8bdf7de1b9f59cfa5f51), [`ce2bfa4`](https://github.com/astryx-vue/astryx-vue/commit/ce2bfa4602747acbafa5e91108be1b755003e041), [`ca023d0`](https://github.com/astryx-vue/astryx-vue/commit/ca023d06a64172f5a17a4f6fc0ecdf233c9b352f), [`d94de78`](https://github.com/astryx-vue/astryx-vue/commit/d94de78d16484142ef7642d410b060e59deec27c), [`6fc4715`](https://github.com/astryx-vue/astryx-vue/commit/6fc471578ecb89aa5cdd4c0c5c6751273bbb02cf), [`473ae5a`](https://github.com/astryx-vue/astryx-vue/commit/473ae5a6c8b9471ac1bcd267760058ad38c89338), [`4e7767f`](https://github.com/astryx-vue/astryx-vue/commit/4e7767f0707c19e4208b003e5f4e767ede363848)]:
  - @astryx-vue/core@0.7.26

## 0.5.4

### Patch Changes

- [#496](https://github.com/astryx-vue/astryx-vue/pull/496) [`6a92b59`](https://github.com/astryx-vue/astryx-vue/commit/6a92b59f5baf06d67147403a5b2ea28f6edffbe9) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Button 跟进上游 [#7906](https://github.com/astryx-vue/astryx-vue/issues/7906)（spec:AST-085）：禁用的按钮不再渲染原生 `disabled`。
  
  - Button、IconButton、ToggleButton 禁用时一律标记 `aria-disabled="true"`，留在 Tab 顺序里；聚焦时被禁用也不会把焦点丢到 body。鼠标、Enter、Space 和 `clickAction` / `click` 照样被拦住，其他按键仍传给调用方。
  - 真正禁用的 submit 按钮不带 `name`，提交时不会带上它的值。
  - ButtonGroup、Toolbar 的成员全部禁用时仍保留一个 Tab 停靠点（`useListFocus` 新增 `hasDisabledTabStop` 选项）。
  - Carousel 隐藏的翻页按钮所在容器加上 `inert`，不会成为 Tab 停靠点。
  - lab 的 ListInput 禁用或加载中时，重排手柄虽然能聚焦，方向键和拖拽都不再重排。
  
  测试里断言 Button 带 `disabled` 属性的，改成断言 `aria-disabled="true"`。
  
  CLI 内置的组件文档跟着更新了 Button、IconButton、ToggleButton、ButtonGroup 的禁用说明。
- Updated dependencies [[`6a92b59`](https://github.com/astryx-vue/astryx-vue/commit/6a92b59f5baf06d67147403a5b2ea28f6edffbe9)]:
  - @astryx-vue/core@0.7.24

## 0.5.3

### Patch Changes

- [#482](https://github.com/astryx-vue/astryx-vue/pull/482) [`aecd704`](https://github.com/astryx-vue/astryx-vue/commit/aecd704089321c545b029b9e1681e55c50055c92) Thanks [@wzc520pyfm](https://github.com/wzc520pyfm)! - lab 增加 CommentComposer：受控评论输入框，支持引用段落、图片上传/粘贴、表情选择和 Post。这是完整评论组件栈（[#478](https://github.com/astryx-vue/astryx-vue/issues/478)）的第二刀；表情按钮复用独立的 EmojiPicker。CommentThread、Comments、CommentPin 还不在这一刀里。

- [#485](https://github.com/astryx-vue/astryx-vue/pull/485) [`ebdcf16`](https://github.com/astryx-vue/astryx-vue/commit/ebdcf162d7ad05e7993280eeecb0eabc00da45b9) Thanks [@wzc520pyfm](https://github.com/wzc520pyfm)! - lab 增加 CommentPin：头像优先的批注锚点按钮，用于打开一条锚定线程或一组线程。这是完整评论组件栈（[#478](https://github.com/astryx-vue/astryx-vue/issues/478)）的第五刀，也是最后一刀，叠在 Comments、CommentThread、CommentComposer 与独立 EmojiPicker 之上。

- [#483](https://github.com/astryx-vue/astryx-vue/pull/483) [`c92d66d`](https://github.com/astryx-vue/astryx-vue/commit/c92d66d67ef0ba017766b3fe5fc205635a4eead6) Thanks [@wzc520pyfm](https://github.com/wzc520pyfm)! - lab 增加 CommentThread：单独呈现的评论线程，含首条评论、一级回复、表情回应、编辑历史和回复输入框。这是完整评论组件栈（[#478](https://github.com/astryx-vue/astryx-vue/issues/478)）的第三刀，叠在 CommentComposer 与独立 EmojiPicker 之上。Comments、CommentPin 还不在这一刀里。

- [#484](https://github.com/astryx-vue/astryx-vue/pull/484) [`8fa9ab6`](https://github.com/astryx-vue/astryx-vue/commit/8fa9ab6b753e3ff5fe61a91a630507a5ed50ddda) Thanks [@wzc520pyfm](https://github.com/wzc520pyfm)! - lab 增加 Comments：某一条目上的评论面板，含线程、一级回复、动态事件，以及发布新评论的输入框。这是完整评论组件栈（[#478](https://github.com/astryx-vue/astryx-vue/issues/478)）的第四刀，叠在 CommentThread、CommentComposer 与独立 EmojiPicker 之上。CommentPin 还不在这一刀里。

- [#481](https://github.com/astryx-vue/astryx-vue/pull/481) [`7374c7f`](https://github.com/astryx-vue/astryx-vue/commit/7374c7f9dc5aebf95d0ebcc655d51bc12d593e07) Thanks [@wzc520pyfm](https://github.com/wzc520pyfm)! - lab 增加独立的 EmojiPicker：按 CLDR 分组搜索并选择表情，可内嵌或放进弹出层。这是完整评论组件栈（[#478](https://github.com/astryx-vue/astryx-vue/issues/478)）的第一刀；现有 ChatEmojiPicker 仍用于聊天里的短固定表情集，没有改名复用。

## 0.5.2

### Patch Changes

- [#456](https://github.com/astryx-vue/astryx-vue/pull/456) [`59eca92`](https://github.com/astryx-vue/astryx-vue/commit/59eca925c5803d7257b0c379623774141277ace6) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 Tour 在服务端渲染时停止测量会访问 window 的问题；SSR 渲染已有回归测试。

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
