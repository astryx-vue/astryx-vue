# @astryx-vue/core

## 0.2.4

### Patch Changes

- [#74](https://github.com/astryx-vue/astryx-vue/pull/74) [`2cbd6ee`](https://github.com/astryx-vue/astryx-vue/commit/2cbd6eef18532991508321c841b7fec7064a2933) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 代码块可以按 unified diff 给整行上色，符号后面的文本仍按原来的语言做语法高亮。主题补上新增、删除、差异头和标记色，名字沿用 `--astryx-code-syntax-*`。Markdown 可以挂文档插件和行内插件，裸链接可以单独打开，引用芯片可以改成序号。

- [#74](https://github.com/astryx-vue/astryx-vue/pull/74) [`2cbd6ee`](https://github.com/astryx-vue/astryx-vue/commit/2cbd6eef18532991508321c841b7fec7064a2933) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `defineTheme()` 可以从强调色、字号比例、圆角和时长生成 token，并按组件覆盖样式。主题补上了图表用的数据色，七套主题用同一组数值。

- [#74](https://github.com/astryx-vue/astryx-vue/pull/74) [`2cbd6ee`](https://github.com/astryx-vue/astryx-vue/commit/2cbd6eef18532991508321c841b7fec7064a2933) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 可以用原版 Astryx 的语言 JSON 加载中文和英文以外的语言。对不上的键会列出来，不会悄悄丢掉。另外补上按当前语言比较字符串的 `useCollator`。

- [#74](https://github.com/astryx-vue/astryx-vue/pull/74) [`2cbd6ee`](https://github.com/astryx-vue/astryx-vue/commit/2cbd6eef18532991508321c841b7fec7064a2933) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 顶栏标题补上标志、上下行和菜单。大菜单推荐卡可以带图片和行动链接。侧栏可以拖宽度。标题菜单、链接和头像可以换成自定义根组件。

- [#74](https://github.com/astryx-vue/astryx-vue/pull/74) [`2cbd6ee`](https://github.com/astryx-vue/astryx-vue/commit/2cbd6eef18532991508321c841b7fec7064a2933) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 分页补上首页和末页、两侧页码数量、一次跳多页、总数未知时的继续翻页、可输入页码，以及提交后的忙碌状态。进度条可以标刻度。列表行可以在触摸横滑后露出操作。标题补上读屏层级、换行、断词、对齐、删除线和截断提示，正文补上对齐和截断提示。公开 `useKeyboardHint`、`useImageMode`、`useContainerReveal` 和 `useMenuPress`。底部面板可以用切换器串起多步流程。补上不带字段外壳的 `BaseTypeahead`，以及默认的 `TypeaheadItem` 行。

## 0.2.3

### Patch Changes

- [#66](https://github.com/astryx-vue/astryx-vue/pull/66) [`4cda5b9`](https://github.com/astryx-vue/astryx-vue/commit/4cda5b9bd337e5c363f0c5eb6d9070fdd4e5cdf2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 日历补上周数、月外日期、可变行数、周起始、日期约束、范围跨度和命令式翻月。日期、区间和日期时间字段补上系统日期控件、加载、异步保存、标签提示，以及必填和选填。

- [#66](https://github.com/astryx-vue/astryx-vue/pull/66) [`4cda5b9`](https://github.com/astryx-vue/astryx-vue/commit/4cda5b9bd337e5c363f0c5eb6d9070fdd4e5cdf2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 指示器可以按名字整组替换，语义图标也可以随主题换成另一套 Iconify 图形。

- [#66](https://github.com/astryx-vue/astryx-vue/pull/66) [`4cda5b9`](https://github.com/astryx-vue/astryx-vue/commit/4cda5b9bd337e5c363f0c5eb6d9070fdd4e5cdf2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 下拉菜单、上下文菜单和面包屑补上勾选行、单选行，以及菜单的页眉、页脚和钻入式子菜单。

- [#66](https://github.com/astryx-vue/astryx-vue/pull/66) [`4cda5b9`](https://github.com/astryx-vue/astryx-vue/commit/4cda5b9bd337e5c363f0c5eb6d9070fdd4e5cdf2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 选择器补上只读、加载、必填和搜索未命中文案。校验图标画在字段里，工具栏警告留在图标上，并和两侧控件处在同一水平线。菜单选中标记跟在说明旁边。多选可以输入后创建并自定义关闭后的文字。输入组成为带标签和状态的字段。复选列表可以整组只读并说明禁用原因。

## 0.2.2

### Patch Changes

- [#58](https://github.com/astryx-vue/astryx-vue/pull/58) [`c25b7ad`](https://github.com/astryx-vue/astryx-vue/commit/c25b7adba7fd63bdc7523ff3eb75f1fcc7ff9656) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对话输入套件：ChatComposer、可插入标记的输入框、发送和停止、附件抽屉、语音听写，以及对应的组合式函数。

- [#59](https://github.com/astryx-vue/astryx-vue/pull/59) [`b2a0c14`](https://github.com/astryx-vue/astryx-vue/commit/b2a0c14eafc37650c71abefeb4e8ffd4c2657df2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增结构化搜索，表格可以分组、展开树和详情、固定列，并标出行状态与窗口中的行号。

## 0.2.1

### Patch Changes

- [#46](https://github.com/astryx-vue/astryx-vue/pull/46) [`02352d5`](https://github.com/astryx-vue/astryx-vue/commit/02352d571a1e5e9d550c801e8d32ff8f60676246) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - DateInput 补上说明文字、日期显示格式、带说明的校验状态，以及在底部面板里打开日历。

- [#43](https://github.com/astryx-vue/astryx-vue/pull/43) [`e6e34d6`](https://github.com/astryx-vue/astryx-vue/commit/e6e34d64e45e6048a9840011bf35e40942e3938e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 下拉菜单可以在紧凑触控界面改用底部弹层，并支持子菜单。

- [#43](https://github.com/astryx-vue/astryx-vue/pull/43) [`e6e34d6`](https://github.com/astryx-vue/astryx-vue/commit/e6e34d64e45e6048a9840011bf35e40942e3938e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 头像支持链接、按钮和姓名提示，状态点可以命名，头像组可以设置组标签。链接支持独立排版和提示。上下文菜单可以按指针菜单或底部动作条呈现。

- [#46](https://github.com/astryx-vue/astryx-vue/pull/46) [`02352d5`](https://github.com/astryx-vue/astryx-vue/commit/02352d571a1e5e9d550c801e8d32ff8f60676246) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Calendar 可以选一段日期并排两个月。NumberInput 补上说明、单位、清除和校验文案。TextArea 在设置了最大长度时显示字数。

- [#50](https://github.com/astryx-vue/astryx-vue/pull/50) [`9d7762b`](https://github.com/astryx-vue/astryx-vue/commit/9d7762bd77295159628af5dadef0e36588021a06) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Icon` 可以用 `name="carbon:settings"` 按 Iconify 的集合名画图标。配上 `astryxIcons()` 后，只会把源码里写到的图标从 `@iconify-json/*` 打进包里。

- [#45](https://github.com/astryx-vue/astryx-vue/pull/45) [`0a1a584`](https://github.com/astryx-vue/astryx-vue/commit/0a1a5845983af52964eac0f4de7ff84c0fddef63) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 中性主题的卡片默认内边距改为间距 3（12px）。卡片里的布局面板内外边距都跟随这张卡片，侧栏文字不再被多出来的内边距挤出省略号。

- [#45](https://github.com/astryx-vue/astryx-vue/pull/45) [`0a1a584`](https://github.com/astryx-vue/astryx-vue/commit/0a1a5845983af52964eac0f4de7ff84c0fddef63) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 面包屑项可以带上菜单，用来在同级页面之间切换。分页增加 dots、count、compact 变体和 sm 尺寸，并可以用 totalPages 表示总页数。

- [#51](https://github.com/astryx-vue/astryx-vue/pull/51) [`606f6d4`](https://github.com/astryx-vue/astryx-vue/commit/606f6d411521cb10ec2f463c40bb16874ce5de30) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 图标的外部 class 画在尺寸盒内部，避免 `width: 100%` 把同行文字挤成逐词换行。TabList 补上 `isFullBleed`，进度条可以只把标签留给读屏。Badge 接受 `label`，过长时省略号截断，字符串和数字会写进 `title`。

- [#44](https://github.com/astryx-vue/astryx-vue/pull/44) [`e690d12`](https://github.com/astryx-vue/astryx-vue/commit/e690d122ecd889418b35464e07b89a535cb562ef) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 进度条可以显示自定义数值，并支持 accent 颜色。

- [#46](https://github.com/astryx-vue/astryx-vue/pull/46) [`02352d5`](https://github.com/astryx-vue/astryx-vue/commit/02352d571a1e5e9d550c801e8d32ff8f60676246) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 选择器可以显示标签、说明和校验文案，支持分组、幽灵样式和底部弹层。选项可以是字符串，校验状态也可以写成 `{ type, message }`。

- [#44](https://github.com/astryx-vue/astryx-vue/pull/44) [`e690d12`](https://github.com/astryx-vue/astryx-vue/commit/e690d122ecd889418b35464e07b89a535cb562ef) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Toast 可以带尾部操作，并用 uniqueID 合并重复通知。Selector 和 DropdownMenu 可以在底部弹层里展开。

## 0.2.0

### Minor Changes

- [#40](https://github.com/astryx-vue/astryx-vue/pull/40) [`244d4f2`](https://github.com/astryx-vue/astryx-vue/commit/244d4f28dd69849e28d88c9bfa3ce6f58f36a0a7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Add Theme / MediaTheme / SyntaxTheme, six new first-party themes, expanded docs examples, and the docs Playground.

### Patch Changes

- [#32](https://github.com/astryx-vue/astryx-vue/pull/32) [`7a48eca`](https://github.com/astryx-vue/astryx-vue/commit/7a48eca533aab06b24ab3c89405cb60686450488) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 Carousel、Lightbox、Outline、Timer，并为 CodeBlock 补上 SyntaxTheme 与 githubDark 预设。

- [#37](https://github.com/astryx-vue/astryx-vue/pull/37) [`1a0cafe`](https://github.com/astryx-vue/astryx-vue/commit/1a0cafef379df57fb8131827426f86b73e3067ae) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 导航菜单的链接被路由提前拦住时，选中后仍然关闭。只有该项自己的点击处理调用了 preventDefault，菜单才会留下。

- [#36](https://github.com/astryx-vue/astryx-vue/pull/36) [`7e72b05`](https://github.com/astryx-vue/astryx-vue/commit/7e72b05aff576e0d52cd568c8e58e75951f1c851) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 Theme、MediaTheme 和完整的 SyntaxTheme。主题子树会重新绑定文字、标题和按钮的颜色别名，避免主文字色停在 :root 上已经算好的值。

## 0.1.3

### Patch Changes

- [#29](https://github.com/astryx-vue/astryx-vue/pull/29) [`d4095c9`](https://github.com/astryx-vue/astryx-vue/commit/d4095c9485078893440c1bf3c7c6b6a70a714a71) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增布局组件 AppShell、Layout（含 LayoutHeader、LayoutContent、LayoutFooter、LayoutPanel）、Section、FormLayout、ScrollableArea、ResizeHandle、AspectRatio，以及 useAppShellMobile、useResizable、useScrollableArea、useScrollOverflow。

## 0.1.2

### Patch Changes

- [#28](https://github.com/astryx-vue/astryx-vue/pull/28) [`6a6dce3`](https://github.com/astryx-vue/astryx-vue/commit/6a6dce3c41b1ba2721dd1e688a420cb65d05514a) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 补上 CommandPalette、Stepper、ClickableCard、SelectableCard、CollapsibleGroup、ComplexSelector 和 TabMenu，以及 useClickableContainer。Stepper 的 minimumStepWidth 默认 112，窄屏收成当前步和 Previous / Next。ComplexSelector 补上 alignment、renderTrigger、startIcon、variant 和 handleRef。

## 0.1.1

### Patch Changes

- [#17](https://github.com/astryx-vue/astryx-vue/pull/17) [`989edc7`](https://github.com/astryx-vue/astryx-vue/commit/989edc76810d91607714b803ef3142f7a450b2bc) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 ContextMenu 子菜单悬停后不关闭、同一层可以一直挂着多个子菜单的问题。开关时机与原版 `useMenuHover` 一致：悬停 150ms 打开，离开 200ms 关闭，斜向移入子菜单时走安全三角。移到同级项同样等这段关闭延迟，稳定后同一层只剩一个由悬停打开的子菜单。

- [#21](https://github.com/astryx-vue/astryx-vue/pull/21) [`0d822b8`](https://github.com/astryx-vue/astryx-vue/commit/0d822b897f084217188bd6f94ad6db55dcca92d1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增数据展示组件 Table、MetadataList、TreeList、Timestamp 和 Thumbnail。Table 覆盖列宽、排序、行选择、分页、列显示、列宽拖拽、行内和弹出过滤、密度、分隔线、斑马纹和空状态。过滤是组件自带的字段匹配，不依赖尚未移植的 PowerSearch。

- [#20](https://github.com/astryx-vue/astryx-vue/pull/20) [`43138ca`](https://github.com/astryx-vue/astryx-vue/commit/43138caf9d3a41d410c348fc0c917369cfa9ad69) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 补上文件输入、时间输入、日期时间输入、日期区间输入和复选列表。字段状态和单选列表按原版拆成独立入口，并补齐中英文文档。

- [#26](https://github.com/astryx-vue/astryx-vue/pull/26) [`f98c4ce`](https://github.com/astryx-vue/astryx-vue/commit/f98c4ce499ad020f02475a1ea22b0af5b856af03) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 日期区间的起止日期改用实心圆和对比字色，避免和区间底融在一起。输入框内部控件不再叠一层页面焦点环，焦点留在外框上。

- [#24](https://github.com/astryx-vue/astryx-vue/pull/24) [`cae99ae`](https://github.com/astryx-vue/astryx-vue/commit/cae99ae0605883798ca7f9ca8efdcdcda93efd9c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 TreeList 嵌套分支的悬停和选中底色，让它从引导线右侧留出间隙后开始，以及外部图标类没有尺寸导致文件树图标不显示。

## 0.1.0

### Minor Changes

- [#13](https://github.com/astryx-vue/astryx-vue/pull/13) [`85aa073`](https://github.com/astryx-vue/astryx-vue/commit/85aa073fb5f855847b6951528e5743dc50bc99aa) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 首次发布。`@astryx-vue/core` 提供 Vue 3 组件，`@astryx-vue/themes` 提供 Neutral 主题。
