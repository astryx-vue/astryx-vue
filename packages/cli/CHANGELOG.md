# @astryx-vue/cli

## 0.7.1

### Patch Changes

- [#610](https://github.com/astryx-vue/astryx-vue/pull/610) [`ab1fac0`](https://github.com/astryx-vue/astryx-vue/commit/ab1fac025296f8cf7718c4fa9fd16b6bd30b1453) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - PowerSearch 的相对日期条件改成从一组固定选项里挑（1、3、7、14、30 天，1、2、4 周，1、3、6、12 个月，前后两个方向），选中就保存，不再给一个自由输入框；`isPastAllowed`、`isFutureAllowed` 设成 false 会去掉对应方向。新增 `powerSearchSheet` 文案命名空间（中英文），包含触屏底部弹层流程和相对日期选项的文字，原版对应的 `@astryx.powersearch.sheet.*` 翻译也接上了。

## 0.7.0

### Minor Changes

- [#617](https://github.com/astryx-vue/astryx-vue/pull/617) [`7efda4e`](https://github.com/astryx-vue/astryx-vue/commit/7efda4e0c265e33a46ec1aec6974119210136bf7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 查不到名字或命令写错时，文本输出会在报错下面给出 Did you mean / Run 建议；component 的 props 改成一行一个、Do 与 Don't 各标一次、表格分隔线缩短；新增 `init --remove-agents`，`upgrade` 会给出把同版发布的包一起升级的命令。

## 0.6.11

### Patch Changes

- [#616](https://github.com/astryx-vue/astryx-vue/pull/616) [`6348961`](https://github.com/astryx-vue/astryx-vue/commit/63489612a962d36776dc4bbf9904bf2b63d0f8a7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - BottomSheet 打开时第一个可用的 `data-autofocus` 字段在所有浏览器里都拿到焦点（盖过原生对话框落在面板或第一个控件上的焦点），关闭后归还焦点不再滚动页面；打开着就被移除的抽屉会把被困住的焦点送回打开者，BottomSheetSwitcher 关闭或被移除时也把焦点还给打开者（无遮罩的流程同样）；服务端渲染就开着的抽屉和流程在水合前不带 `aria-modal`，水合后直接以静止状态打开、不播进场动画（上游 [#10156](https://github.com/astryx-vue/astryx-vue/issues/10156) [#12487](https://github.com/astryx-vue/astryx-vue/issues/12487) [#10022](https://github.com/astryx-vue/astryx-vue/issues/10022) [#10061](https://github.com/astryx-vue/astryx-vue/issues/10061) [#11982](https://github.com/astryx-vue/astryx-vue/issues/11982) [#9360](https://github.com/astryx-vue/astryx-vue/issues/9360)）

- [#615](https://github.com/astryx-vue/astryx-vue/pull/615) [`51e74e9`](https://github.com/astryx-vue/astryx-vue/commit/51e74e9220406e2e36ff40eb3e13694abbbb9638) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - BottomSheet 的内容不管内边距多少，静止时都从抓手条下方开始（`padding` 为 0 也一样，选择面板里的日期、时间面板同步去掉自己补的那一段）；内容区在 WebKit 里也保留底部内边距，抓手条在 iOS 上换挡位时不再消失，退场动画被引擎中途改道时不再提前结束，面板里再开的底部弹层或对话框拖动时不会连带拖动外面那一层（上游 [#8558](https://github.com/astryx-vue/astryx-vue/issues/8558) [#8557](https://github.com/astryx-vue/astryx-vue/issues/8557) [#9760](https://github.com/astryx-vue/astryx-vue/issues/9760) [#8349](https://github.com/astryx-vue/astryx-vue/issues/8349) [#8820](https://github.com/astryx-vue/astryx-vue/issues/8820)）

## 0.6.10

### Patch Changes

- [#614](https://github.com/astryx-vue/astryx-vue/pull/614) [`75f5e10`](https://github.com/astryx-vue/astryx-vue/commit/75f5e101775bf2935adc0152b2085b8c6a2ab17a) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 查不到名字时，打错两个相邻字母（例如把 Badge 打成 Bagde）也能在建议里找到原来的名字；文档补了升级时一起升级所有包、Tailwind 的 `@layer` 写错位置的后果，以及自动链接插件的属性说明。

## 0.6.9

### Patch Changes

- [#613](https://github.com/astryx-vue/astryx-vue/pull/613) [`5901e2a`](https://github.com/astryx-vue/astryx-vue/commit/5901e2a9be45a965f0d7c77c3cd249826b965acb) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - build 能读懂拼得不太准的想法：模板名连写（kanbanboard）、拆开（log in）或相邻两个字母写反（dashbaord）都能找到对应页面

- [#611](https://github.com/astryx-vue/astryx-vue/pull/611) [`5d52498`](https://github.com/astryx-vue/astryx-vue/commit/5d52498bb80eb41ed2c29e73af37b91ca8483afa) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 列表与树：有序列表的编号共用一列，位数变了别的行的文字不动，编号右对齐、等宽；可点的行在手指下把触控范围朝相邻行的空隙长到 44px，链接行点内边距或热区也会跟着链接走；选中行悬停、按下时在底色上叠色；`bleed` 列表在圆角 Card、Dialog 的首尾取容器圆角；禁用的按钮行、链接行和横滑操作仍能用键盘聚焦但不会触发；横滑行把双指缩放留给浏览器；TreeList 引导线对齐箭头、手指操作下自己带展开收起的滑动、主题可用 `tree-disclosure` 指示图形换掉展开箭头；Outline 的链接都在正常 Tab 顺序里（不再是方向键漫游）、跟随链接后焦点移到目标标题、传入的 `aria-label` 优先、减弱动效时立即到达；MetadataList 的值只在单词比一行还长时才折断；新增 `useOutlineFromDOM` 文档页，补充 OverflowList、MetadataList、Outline 的使用建议。

## 0.6.8

### Patch Changes

- [#609](https://github.com/astryx-vue/astryx-vue/pull/609) [`d4feea8`](https://github.com/astryx-vue/astryx-vue/commit/d4feea8074958489c84b6c3399a717fde2efc1d7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `docs` 新增 `--list`，和不带主题时一样列出全部主题；主题名里的词用空格、短横线、斜杠或点隔开、顺序颠倒（如 `docs mode dark`）也能打开同一页；查不到时会建议名字或关键词里带这些词的页面。

## 0.6.7

### Patch Changes

- [#608](https://github.com/astryx-vue/astryx-vue/pull/608) [`1c998c8`](https://github.com/astryx-vue/astryx-vue/commit/1c998c8aa213acec397b2d923b1b8864195d1a91) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 命令行 search 在得分相同时让回答了更多查询词的条目排前面，复数的家族词（如 tabs）会列出它的各个部分，用 PascalCase 写的名字也能在文档正文里按词找到；查不到名字时会指向有这个名字的命令（docs、template、component、composable 互相提示），别的库的叫法不再直接打开组件而是作为第一条建议。

## 0.6.6

### Patch Changes

- [#607](https://github.com/astryx-vue/astryx-vue/pull/607) [`89336db`](https://github.com/astryx-vue/astryx-vue/commit/89336db6111042c8304e548fd913d55ada404b05) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - MoreMenu 的锚定菜单改用和 DropdownMenu 一样的 CSS 进场：从触发器那一侧滑进来，以菜单和触发器相接的那一点为原点放大，减少动态效果时手指下只淡入。在手机和平板上，顶层菜单还在进场时落下的点按和拖动会被忽略，和 iOS 一样：菜单照常打开、保持打开、焦点不动，下面的东西也不会有反应；飞出的子菜单不挡。键盘、辅助技术和鼠标不受影响。上游 MoreMenu 包着 DropdownMenu，本来就是这样，这里对齐。

- [#604](https://github.com/astryx-vue/astryx-vue/pull/604) [`8890c87`](https://github.com/astryx-vue/astryx-vue/commit/8890c87dff026c5e2d883fec12ee3db97335ad96) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Tokenizer 新增 `presentation` 属性（`'popover' | 'bottom-sheet' | 'adaptive'`），默认 `'adaptive'`：紧凑触屏上，字段变成一个显示标签的触发器，点开触屏底部弹层编辑。弹层里有搜索框、每条结果一行复选框，底部钉着「全部清除」和「保存」。勾选、新建、全部清除都只改一份草稿，按「保存」才提交一次（只触发一次 `change`）；草稿改过之后下滑、点遮罩或按 Escape 会先问要不要放弃，「全部清除」也会先确认。关上后焦点回到触发器；字段在弹层开着时被禁用会把弹层关上。桌面和非触屏设备照旧是行内输入框。
  
  默认值变了：以前在手机上也是行内输入框，现在是底部弹层。想在所有设备上保留行内字段就传 `presentation="popover"`；PowerSearch 的列表值输入已经这样固定。底部弹层里 `item` 插槽、`hasClear`、`hasEntriesOnFocus`、`menuWidth`、`menu`、`overflow`、`hasAutoFocus` 没有地方生效，开发期会提示一次。

- [#606](https://github.com/astryx-vue/astryx-vue/pull/606) [`5327d7b`](https://github.com/astryx-vue/astryx-vue/commit/5327d7b2eea029f9a0415e725de1c85fc2586aef) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Tokenizer 文档的「全部清除」和「溢出」示例说明跟上 `adaptive` 默认值：触屏上在底部弹层里用「全部清除」；溢出的收起模式只作用于行内字段。

## 0.6.5

### Patch Changes

- [#605](https://github.com/astryx-vue/astryx-vue/pull/605) [`15692e1`](https://github.com/astryx-vue/astryx-vue/commit/15692e198d58b8aee74f9d2f54aeaf7db50d4342) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - CommandPalette：搜索开始时由输入框在对话框里念一次「加载中」，结果念出前先收回没念出去的那一次；第一次搜索还没落定时不再在敲了字的输入框下显示「输入以搜索」；搜索被拒绝按没有结果处理；列表项的 `data-highlighted`、`data-selected`、`data-disabled` 取值改为状态名，主题可以按 `highlighted`、`selected`、`disabled` 给 `command-palette-item` 挂样式；空状态里的长串会折行；输入框带手机键盘的 Search 键并关闭自动纠错，焦点环按输入框自己所在的 document 判断键盘还是指针。

- [#603](https://github.com/astryx-vue/astryx-vue/pull/603) [`0accd29`](https://github.com/astryx-vue/astryx-vue/commit/0accd29fc042d6c314224c73863b5f7a07a1ffd2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - PowerSearch：「全部清除」只移除可编辑的条件、保留只读条件，并用自己的话念出结果；没写 `isDateOnly` 的绝对日期按 `timezoneID` 里的那一天读写（没设时区是 UTC 的那一天），`isDateOnly: false` 才带时刻；`statusVariant` 新增 `tooltip`；条件标签的文字由文案拼成，各语言可调换顺序；输入框带手机键盘的 Search 键并关闭自动纠错；缺 `config` 时报出点名的错误。

## 0.6.4

### Patch Changes

- [#602](https://github.com/astryx-vue/astryx-vue/pull/602) [`0253ff2`](https://github.com/astryx-vue/astryx-vue/commit/0253ff2970a2622d5dd50c3444fb208a59efd815) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - upgrade、init、doctor 在项目的任意子目录里运行，也会回到有 package.json 的项目根；项目的 core 比 CLI 新时，upgrade 说明是 CLI 太旧，不再说"已是最新"；扫描文件按固定顺序、不穿过符号链接。升级指南新增 List 的 `edgeCompensation="inline"` 改名 `edge="outset"`。

## 0.6.3

### Patch Changes

- [#598](https://github.com/astryx-vue/astryx-vue/pull/598) [`ec208da`](https://github.com/astryx-vue/astryx-vue/commit/ec208dae73420d8a2d053b238b5b6dde01c8c960) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 聊天输入对齐上游：ChatComposerInput 新增 `enterKeyHint`（默认 `send`，触屏键盘的回车键显示“发送”）；禁用后编辑区仍留在 Tab 顺序里、不丢焦点，打字、粘贴、拖入文件、命令式句柄和调用方回调都不再生效，触发菜单随之收起；点进编辑区不再把打开的触发菜单关掉，点击把光标挪出查询时菜单会跟着关；触发菜单的“Searching…”不再靠没有 live 角色的加载行，改走共用忙碌播报，每次搜索只念一次；ChatComposer 的状态条改由渲染文字播报，类型变化算新的一次，页面加载前已显示的状态保持安静，点在打开着的 Tooltip 或 HoverCard 里不再抢走输入框焦点；ChatMessageList 顶部加载的转圈静音，由列表播报一次；长文本粘贴成令牌只触发一次 `change`；输入法组字时光标落进文本节点，不再把第一个拼音字母直接上屏；ChatSystemMessage、ChatMessageList、ChatLayout 的空插槽判断改为看是否真的渲染出内容。

- [#600](https://github.com/astryx-vue/astryx-vue/pull/600) [`33cec03`](https://github.com/astryx-vue/astryx-vue/commit/33cec037092f04970b22a9265f365660f88c95a7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 聊天布局和样式对齐上游：ChatLayout 用外部 `scrollRef` 时，消息区底部留白加上固定输入区的高度，最新一条消息滚到底时落在输入区上面；`scrollRef` 是整页滚动者时，滚动按钮能正确出现、读者上滑会停止跟随、`scrollToMessage` 从视口顶部量起；跟随末尾期间关掉浏览器的滚动锚定，不再靠隐藏滚动条的属性。头像顶部偏移只看消息自己的内容，嵌套消息不再继承外层的偏移；消息列表的键盘焦点环画在列表盒子里面，用共享焦点环令牌；输入区页脚里调用方的操作换行、发送操作始终留在输入区内；抽屉的圆角跟着输入区自己的圆角；发送键在输入区里保持圆形；空的编辑区不会再塌成 0 高度；粗指针下输入区的聚焦外观立刻显示。新增 `useChatDictation`、`useSpeechRecognition`、`useChatPasteAsToken` 的文档页。

- [#593](https://github.com/astryx-vue/astryx-vue/pull/593) [`57250a9`](https://github.com/astryx-vue/astryx-vue/commit/57250a95eac0080bc86f795d96e5daf2b50dc0b0) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 文字输入框对齐上游：TextInput、TextArea、FileInput 禁用后仍留在 Tab 顺序里（`aria-disabled`、只读），除聚焦和失焦外不运行调用方的处理函数，键盘聚焦时画聚焦环；TextInput、TextArea 新增 `enterKeyHint`、`inputMode`、`autoCapitalize`、`hasAutoCorrect`（TextInput 另有 `hasSpellCheck`，类型新增 `search`、`tel`、`url`），`startIcon` 可传语义图标名；TextArea 新增 `htmlMaxLength`；只写 error 不写说明时给读屏一句兜底文字；点清除按钮在点按里聚焦（iOS 弹出键盘）；加载圈排在清除按钮里侧；放大字号时 TextInput 跟着长高；粗指针下聚焦外观立刻显示。FileInput 忙碌时不再接受新的选择，忙碌只播报一次，清除后焦点回触发按钮，调用方的 `aria-describedby` 接到触发按钮，表单默认必填也念出「必填」，提示气泡状态在拖放模式和上传中都保留，拖放区默认把状态放到下面。表单的默认必填不再让没勾的复选框和关着的开关变成必填。导出 `FieldStatusPlacement`、`EnterKeyHint`、`InputMode`、`AutoCapitalize` 类型。

- [#595](https://github.com/astryx-vue/astryx-vue/pull/595) [`500b7bb`](https://github.com/astryx-vue/astryx-vue/commit/500b7bb7ccab6c36627ae837180dbbe8f75b0f5c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - NumberInput 对齐上游：回车或失焦时，读不成数字、整数字段里的小数、`min` 大于 `max` 时的任何数不再被悄悄丢掉，而是留在框里，字段显示「Invalid number」并只念一次；打字过程中什么都不标。新增 `entryErrorChange` 事件（带 `kind`、`text`、`value`）和 `entryErrorBehavior`（数字框两个值时机相同，不读 FormLayout 默认值）。禁用的 NumberInput 仍留在 Tab 顺序里（`aria-disabled`、只读、不运行调用方处理函数），加减按钮用 `aria-disabled`；用鼠标或笔按住按钮会重复步进、松手只提交一次；触屏上加减按钮隐藏；有 `formatValue` 时 Tab 进来仍是全选；`startIcon` 可传语义图标名；步进按钮带 `astryx-number-input-stepper` 主题挂点和 `data-direction`；强制颜色下聚焦可见。Pagination 的页码框改用 NumberInput：超过最后一页收到最后一页，被拒的输入留在框里，说明显示在状态图标上，框会变宽装下图标。TimeInput、DateInput 与 NumberInput 共用同一份拒绝状态与汇报逻辑。 InputGroup 的状态说明显示在整组下面，整组边框不再随状态变色（和上游一致），主题可按 `data-status` 给这一行上样式。

- [#596](https://github.com/astryx-vue/astryx-vue/pull/596) [`d4a40a6`](https://github.com/astryx-vue/astryx-vue/commit/d4a40a6b1c2dc0bf5b3073f1786c2f2eb6a41a9c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Popover` 新增 `presentation` 属性：`'popover'`（默认，照旧锚在触发器旁）、`'bottom-sheet'`（放进模态底部弹层）和 `'adaptive'`（手机这类紧凑触屏上用底部弹层，其余用浮层）。底部弹层由 `label` 命名，没写时用触发器的文字；总能轻点外面或下滑关闭，Escape 跟着 `hasEscapeDismiss`；每次打开焦点落到第一个内容控件，界面在打开时选定、保持到关闭，并且只在可能用到时才加载。

- [#597](https://github.com/astryx-vue/astryx-vue/pull/597) [`c66168c`](https://github.com/astryx-vue/astryx-vue/commit/c66168c00e9f06435ae85cf4e170e7d178ca54bb) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 用手指打开的 Popover 像 iOS 一样从触发器里长出来：从浮层和触发器相接的那一点放大，第一帧就能看到内容，长出期间的点按会被忽略；关闭时缩回触发器。缩回播在浮层的一份静态副本上，副本保留浮层的内边距、边框和颜色。用鼠标打开时保持原来的滑入。

- [#599](https://github.com/astryx-vue/astryx-vue/pull/599) [`627d55a`](https://github.com/astryx-vue/astryx-vue/commit/627d55a2bd93c04b03009fbf92783f5de983d615) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 手指下打开的 AlertDialog 像 iOS 系统弹窗一样从 1.2 倍大小缩到原大，弹窗和遮罩一起淡入，按主题的对话框进场时序播放，进场结束前的点按会被忽略。关闭时先按退场时序淡出，淡出期间内容不接收输入和焦点，淡出播完才真正关闭；途中重新打开从当前的样子折返。用鼠标时保持原来的 CSS 进场和立即关闭。

- [#601](https://github.com/astryx-vue/astryx-vue/pull/601) [`ee32ea2`](https://github.com/astryx-vue/astryx-vue/commit/ee32ea2a72a6a69f76fee6b511bdea0c5ff29793) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - DropdownMenu 的进场换成锚定浮层共用的 CSS 进场：从触发器那一侧滑进来，以菜单和触发器相接的那一点为原点放大，减少动态效果时手指下只淡入。在手机和平板上，菜单还在进场时落下的点按和拖动会被忽略，和 iOS 一样：菜单照常打开、保持打开、焦点不动，下面的东西也不会有反应；打开菜单的那根手指照样能选中一行。键盘、辅助技术和鼠标不受影响。

## 0.6.2

### Patch Changes

- [#591](https://github.com/astryx-vue/astryx-vue/pull/591) [`996b581`](https://github.com/astryx-vue/astryx-vue/commit/996b58189e8e9764c33a6ea450b906f27563d521) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Selector` 和 `MultiSelector` 的 `presentation` 新增 `adaptive`；各组件的 `adaptive` 统一按主题的紧凑定义判断（粗略指针，并且视口宽度小于主题 `md` 断点、默认 768px，或高度小于 500px，所以横屏手机也会用底部弹层，正好 768px 宽的平板改用浮层），打开那一刻定下浮层还是底部弹层，开着时转屏不再中途换形态，退场播完才重新判断。

- [#592](https://github.com/astryx-vue/astryx-vue/pull/592) [`1cd234e`](https://github.com/astryx-vue/astryx-vue/commit/1cd234e37cf1b8adfbcb4bbb1fd8ed57e2953c9d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Popover、Tooltip、HoverCard、ContextMenu、Selector、MultiSelector、Typeahead 的浮层进场改为从实际落在的那一侧滑进来、以朝向触发器的边为原点放大，滑动不超过和触发器之间的空隙（翻面后不再先压到触发器上，盖住触发器的 Selector 列表原地放大）；开启减少动效时，这些浮层和 Dialog 在触屏上改为 200ms 原地淡入，用鼠标时直接出现。

- [#594](https://github.com/astryx-vue/astryx-vue/pull/594) [`9c99822`](https://github.com/astryx-vue/astryx-vue/commit/9c99822375b82404b48b2e93a01a5cbf666e78a5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主指针是手指时，Dialog、Drawer、MobileNav 进场动画播完之前不接手指和笔的点按（静止的鼠标照样能点，进场前按下的手指抬起时照常落到下面）；关闭中的 BottomSheet 不再一关就藏起仍有焦点的内容，改为只放行 Tab、焦点离开后才变成不可操作。

## 0.6.1

### Patch Changes

- [#589](https://github.com/astryx-vue/astryx-vue/pull/589) [`d700d0d`](https://github.com/astryx-vue/astryx-vue/commit/d700d0dc97ad83056d72fa10a8985e1964b16854) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 选择类控件对齐上游：禁用的开关、复选框、单选项、分段、滑块不再运行调用方的处理函数；必填的开关、复选框、单选项在出错前不会被读成无效；禁用或出错的复选框组、单选组把状态写到整组和每个复选框上；Slider 的两个重合滑块能拉开，范围滑块保留调用方的 aria-labelledby，拖动时只有被拖的滑块显示数值，刻度文字下方留够空间；复选框、单选项列表行新增 align，ToggleButton 保持真实按下状态，ToggleButtonGroup 窄屏换行，单选圈和开关拇指始终是圆的。

## 0.6.0

### Minor Changes

- [#587](https://github.com/astryx-vue/astryx-vue/pull/587) [`e54c2eb`](https://github.com/astryx-vue/astryx-vue/commit/e54c2ebe572c5fb88343175f9f0c67c56999d197) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 布局类组件一批对齐：AppShell 新增 `mobileNav.defaultIsMobile`（服务端直接渲染手机布局），读到窗口前侧栏和抬起背板的圆角在手机宽度先收起，宽度断点跟主题的宽度点走，第二个 AppShell 拿自己的主区域 id，AppShell 作为布局根不再吃外层 Layout、Card、Section 传下来的内边距、容器和分隔线默认值，页头和内容末尾避开设备安全区；Collapsible 收起时内容里的焦点移回触发按钮；LayoutPanel 和 ResizeHandle 的 `resizable` 可直接传 `useResizable()` 的返回值，区域收起时面板内焦点移到分隔条且面板 inert，宽度为 0 的面板不占位也不露出子元素；ResizeHandle 的抓取区始终居中在分隔条上，握把自己接管拖动，悬停才显示的握把能从抓取区够到，分隔条只处理方向键、Home、End、Enter，带 Alt、Ctrl、Meta 的组合放行；拖动中卸载时补写已拖到的尺寸；Layout 没设 `contentWidth` 时不再限制页头页脚宽度，页头页脚无分隔线时只收拢自己 Layout 的内容内边距，内容和侧面板发布的容器内边距与实际边距一致；Grid 的 `align`、`justify` 不设置时交给浏览器默认值；带中间区的 Toolbar 在大字号下换行而不重叠；ScrollableArea 触屏保留平台滚动指示条；AspectRatio 的 `fit` 子元素尺寸挪到 base 层，Tailwind 等后面的层能覆盖；SelectableCard 文档改为只推荐多选；CLI 搜索不再把「splitview」当作 useResizable 的别名。

### Patch Changes

- [#585](https://github.com/astryx-vue/astryx-vue/pull/585) [`b4c1246`](https://github.com/astryx-vue/astryx-vue/commit/b4c124601db95576e89bd372cb3a35f0f30bbe57) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `InternationalizationProvider` 新增 `calendar`，可以选波斯历、希伯来历、伊斯兰历、佛历、和历、农历等历法：`Calendar` 按这个历法排月份、翻月和写日期（也可以用组件自己的 `calendar` 属性），`Timestamp`、`PowerSearch` 和实验室的 `Schedule` 按它写日期，`useLocale()` 返回当前的 `calendar`；值始终是公历日期，不设时仍是公历。`fa-IR`、`th-TH` 等默认历法不是公历的语言下，公历日历的标题和读屏名字不再混进别的历法。

- [#586](https://github.com/astryx-vue/astryx-vue/pull/586) [`cb9b686`](https://github.com/astryx-vue/astryx-vue/commit/cb9b686abf974dc69c59b61072cc77aa4008cb75) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `DateInput`、`DateTimeInput`、`DateRangeInput` 新增 `calendar` 并跟随 provider 的历法：按这个历法显示、打字和选择日期，非公历的空字段聚焦时给出示例日期，系统日期控件在非公历下换成 Astryx 的选择器；值始终是公历日期，公历下的行为不变。

- [#588](https://github.com/astryx-vue/astryx-vue/pull/588) [`09ce82c`](https://github.com/astryx-vue/astryx-vue/commit/09ce82c05935e677b00f8c301e877ce7817fa930) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增公开组合式函数 `useCalendarDays`、`useCalendarNavigation`、`useCalendarConstraints`，可以自己拼月历：排月格子、翻月和判断日期能不能选，前两个可以传 `calendar` 按非公历历法排。

## 0.5.0

### Minor Changes

- [#584](https://github.com/astryx-vue/astryx-vue/pull/584) [`4659181`](https://github.com/astryx-vue/astryx-vue/commit/46591818f1f678ac81b6cf86a847cf8929008103) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Pagination 新增 `getPageHref` 和 `as`：页码、上一页、下一页、首页、末页渲染成指向各页地址的链接，可在新标签页打开、复制地址，带修饰键或在别处打开的点击不换页；圆点改成单选组（`radiogroup` 加 `radio`），控制行、每个单元格和省略号有 `pagination-list`、`pagination-item`、`pagination-ellipsis` 主题部位，省略号随更大的文字长高；TopNavMenu 的数据项和 TopNavMegaMenuItem 新增 `hasCloseOnSelect`，键盘、手指或触控笔选中项后菜单关闭并还焦点，鼠标或触控板选中不关闭；选中标签的下划线成为 `tab-indicator` 部位，顶栏手机条和抽屉里的行带 `mode` 状态；移动抽屉里的 SideNavItem、TopNavItem、TopNavMenu 项、TopNavMegaMenuItem、BreadcrumbItem 被激活后关掉抽屉；TopNav 抽屉里的分组展开收起带动画，收起时 inert，展开后不再切掉焦点环；顶栏放不下时换行，长标题先收缩，手机条上结束区和菜单按钮始终留在条内，纯文字标题收在一行；空插槽不再画出空壳；禁用的 TopNavItem 保留 Tab 停靠点且不运行调用方的处理函数；精选卡片链接的箭头在从右到左的文字里镜像；精选面板不再掉出视口底部，减少动态效果时触屏上淡入；标题弹出层里的菜单没写 `label` 时用标题当名字；TabList 的标签在下一帧才量选中位置，换行的标签在格里居中；菜单行滑过时不选中文字；导航行和标签随更大的文字尺寸长高；AppShell 在脚本读到窗口之前先在手机宽度藏起顶栏的起始和中间内容。

## 0.4.51

### Patch Changes

- [#583](https://github.com/astryx-vue/astryx-vue/pull/583) [`6e36420`](https://github.com/astryx-vue/astryx-vue/commit/6e36420c236439f2e81584d905501be1b63d79c3) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `usePanGesture` / `createPanGesture`：把元素上的拖动报成状态、位移和速度，手指走过 10pt 才认领，轻点和长按不会被当成拖动。新增 `useDragToSnapPoints` / `createDragToSnapPoints`：元素沿一条轴被拖动，松手后像 iOS 面板一样停到吸附点上，并提供不用拖动的 `settleTo`。`useSnapPaging` 的手指拖动和触控板横扫改由手势引擎识别，和其他手势统一仲裁；跟手从手指越过起拖距离的那一点算起。

## 0.4.50

### Patch Changes

- [#581](https://github.com/astryx-vue/astryx-vue/pull/581) [`04df208`](https://github.com/astryx-vue/astryx-vue/commit/04df2084111d41780ec2c58efd68a3d1e5ba1288) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - CheckboxList 新增 `isRequired` 的实际校验：一项都没勾时第一个可用的复选框带原生 required，浏览器拦住提交并把焦点移过去，重排后跟着新的第一项；禁用或只读的链接行（List 的 Item、TreeList）不再有 href 和 target，也不走路由链接组件，焦点在上面时被禁用，焦点会交给换出来的元素；TreeList 没有任何动作的普通行拿到键盘焦点时画出焦点环，子级行的焦点不再让上级行也画环；DropdownMenuSubMenu 的标签用插槽写成富内容时，展开的视图用标签命名，嵌套视图的返回行也按这个标签的文字写。

## 0.4.49

### Patch Changes

- [#578](https://github.com/astryx-vue/astryx-vue/pull/578) [`4c7b227`](https://github.com/astryx-vue/astryx-vue/commit/4c7b2277f9643201e9c37a39856941b821142dd4) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游导航组件：侧边导航收起、展开时旧轨道留一份副本、从行内结束边裁剪并淡入淡出，AppShell 里内容区跟着一起滑动，按主题的移动曲线播放，「减少动态效果」时按指针类型淡入淡出或直接切换；收起时焦点还在轨道丢掉的行上，会交给收起按钮或最近的保留行；下级行和顶层行等宽、内容缩进，下级组只在收起动画期间裁剪；禁用的侧栏项保留 Tab 停靠点（`aria-disabled`）且不运行你的处理函数；空插槽不再画包裹元素；整个标题是链接时末端内容放在链接旁边；`SideNav` 的 `resizable` 可直接传 `useResizable()` 的返回值，`NavItem` 新增 `isFocusableWhenDisabled`；MobileNav 抽屉最宽 85vw、头部随内容长高、内容区是导航地标、`side="auto"` 按文字方向和打开者位置选边、文件选择器的取消不再关掉抽屉，抽屉面板有了自己的主题挂点 `mobile-nav-drawer`（带 `side`）。

## 0.4.48

### Patch Changes

- [#576](https://github.com/astryx-vue/astryx-vue/pull/576) [`815ff06`](https://github.com/astryx-vue/astryx-vue/commit/815ff0633ed0c8ee086b63742a7d1f04a12f934b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - DateRangeInput：预设和一个月的日历并排放不下时（窄页面），预设叠到日历上面，弹层在层的高度内自己滚动，日历和翻月按钮不再被切掉；字段收起后的文字在服务端和水合那一趟一律写出年份，挂载后再省掉今年的年份，服务端在别的时区也不会水合不一致；字段锁定时弹层里的点击不再改动选择；值里放了 `Date` 对象时，开发期抛出点明 `modelValue` 和改法的错误。

## 0.4.47

### Patch Changes

- [#571](https://github.com/astryx-vue/astryx-vue/pull/571) [`dbc08b8`](https://github.com/astryx-vue/astryx-vue/commit/dbc08b8abccd4b06c24d1be3771a679801bea68f) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游 Calendar 的几处细节：日期数字和周数用当前语言的数字写法（如阿拉伯语、波斯语）；周起始日是周日或周六时，周数按每行周四所在的 ISO 周计，不再整体错一周；两个月并排时，选中日或今天落在 `max` 所在的月份，会让这个月显示在右边那一格；没有内置表头数据的语言，星期名改用 `Intl` 的缩写（七个都不超过四个字符时）或窄写法；日期按钮高度是下限，文字放大时按钮跟着长高；DateRangeInput 弹层里不可选的日子不再用原生 `disabled`，保持可聚焦并带 `aria-disabled`。

- [#575](https://github.com/astryx-vue/astryx-vue/pull/575) [`427fe3c`](https://github.com/astryx-vue/astryx-vue/commit/427fe3c616eca359f46cf20dbe13d6965e3e9d16) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - TimeInput 和 DateTimeInput 的时间文字跟随语言：没写 `hourFormat` 时按当前语言的时制（`en-GB`、`de-DE`、`zh-CN` 默认 24 小时），数字、分隔符和上下午的词也用语言自己的写法，打字时读得懂这些写法。时间那段被拒的输入现在留在框里并说明原因：没打完的时间不标，完整却超出 `min`/`max` 的时间立刻亮出来（`entryErrorBehavior="blur-or-enter"` 则等 Enter 或失焦），读不成时间的文字等 Enter 或失焦；Enter 不再被拦，外面的表单照常提交。TimeInput 新增 `entryErrorBehavior` 属性和 `entryErrorChange` 事件。忙碌时的转圈对读屏隐藏，字段自己只念一次「加载中」。Timer 的 elapsed 文字按当前语言写单位。

- [#573](https://github.com/astryx-vue/astryx-vue/pull/573) [`eca17f2`](https://github.com/astryx-vue/astryx-vue/commit/eca17f24b65bd2e4860f223d687f0b6c12a93b1b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Timestamp 新增 `timezoneID`，绝对格式按指定时区写文字，服务端和浏览器一致；`tooltipEntries` 里没写时区的行跟随它。写在 Timestamp 上的属性现在落到 `<time>` 上，调用方的 `aria-label` 和 `tabindex` 优先；相对读数的名字以屏幕上显示的词开头，后面接完整日期；实时刷新在时间或名字有它参与的控件拿着焦点时先等着；悬停卡片保持描述列表结构，复制按钮在各行的值里面，没有标签的行用时区全名命名；卡片的 `aria-controls` 写在能聚焦的 `<time>` 上。HoverCard 只在支持的角色上写 `aria-haspopup`，没有角色的触发器不再写。

## 0.4.46

### Patch Changes

- [#572](https://github.com/astryx-vue/astryx-vue/pull/572) [`3482ec8`](https://github.com/astryx-vue/astryx-vue/commit/3482ec86f1a322a9fea811d67d456166e0378986) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `useAnimatedLayout`：把它返回的句柄传给 `Collapsible`、`TreeList` 的 `animatedLayout`，展开收起时后面的内容会滑到新位置，而不是一下子跳过去。

- [#574](https://github.com/astryx-vue/astryx-vue/pull/574) [`8f246ae`](https://github.com/astryx-vue/astryx-vue/commit/8f246ae8499d5cd9b1ac56db6e9ee441a2a5fc9a) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `useTableRowExpansion` 新增 `animatedLayout` 配置：传入 `useAnimatedLayout` 的句柄后，详情面板开合时下面的行会滑到新位置，分隔线跟着走，箭头同步转动。

## 0.4.45

### Patch Changes

- [#568](https://github.com/astryx-vue/astryx-vue/pull/568) [`a9ae1a0`](https://github.com/astryx-vue/astryx-vue/commit/a9ae1a0767b1781ec2af2333b0fc50f07f218b56) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增主题 `motion.tempo` / `motion.character` 旋钮，以及公开的 `createAnimator`、`useAnimator` 弹簧动画器。

- [#569](https://github.com/astryx-vue/astryx-vue/pull/569) [`b272df5`](https://github.com/astryx-vue/astryx-vue/commit/b272df56af84a0ad60f9044a3c582221e7f4c52b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游 Selector 系列的无障碍和交互：Selector 的触发器接上调用方的 `aria-labelledby`（带搜索时名字末尾带上所选的值），列表由字段标签命名，必填的带搜索 Selector 把 `aria-required` 放到搜索框上；选中后焦点回到触发器，列表开着时被禁用就不再改值，选项变了高亮跟着原来的选项走；AltGr 键入的字母也能按字母跳转；选项带 `highlighted`、`selected`、`disabled` 主题状态；幽灵和次要样式的触发器有键盘焦点环；缺少 `options` 时开发期报明确的错误；ComplexSelector 的忙碌图标对读屏隐藏并只念一次「加载中」。`useCombobox` 新增 `getFieldProps`、`getListboxProps`、`getOptionProps` 和 `getItemId`，给自己渲染的输入框接组合框。

- [#570](https://github.com/astryx-vue/astryx-vue/pull/570) [`815fd22`](https://github.com/astryx-vue/astryx-vue/commit/815fd22cd455f3bf03ecfee74ee1d5260c925c4f) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游 Typeahead、Tokenizer 的菜单和状态：新增 `menu` 属性（结果列表周围放信息的 `listbox` 角色，或会拿走焦点的 `dialog` 角色）、`menu` 插槽和 `open()`、`close()` 方法；搜索源的 `search` 第三个参数 `context.update(items)` 可以先显示本地匹配、再追加服务端结果；禁用的字段仍是 Tab 停点，列表残留时也不能再选；搜索忙碌时由输入框念一次「加载中」，防抖里的新输入不再带着上一个查询的「没有结果」；聚焦清单为空或加载失败时收起；选中后把清空的查询报给 `changeQuery`；编辑已选值时 `Escape` 先收起列表，值标签上按退格或删除会清掉值并念出来；搜索框请求触屏键盘的 Search 键且不自动纠正；`startIcon` 可以直接写语义图标名。

## 0.4.44

### Patch Changes

- [#565](https://github.com/astryx-vue/astryx-vue/pull/565) [`30f0c5b`](https://github.com/astryx-vue/astryx-vue/commit/30f0c5b3819f8ddb1143669f75f9cc40193ffb98) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Dialog：初始焦点跳过藏在 hidden、inert 里和被禁用的请求，顺延给下一个，嵌套子对话框里的请求留给子对话框；第二个文档里的对话框按触发器所在窗口算进场方向。DialogHeader 的标题行罩得住标题和控件。Lightbox 里冒上来的 cancel（取消文件选择器）不再关闭它。文档补上 AlertDialog 是对话框嵌套的唯一例外。

- [#566](https://github.com/astryx-vue/astryx-vue/pull/566) [`8f755e5`](https://github.com/astryx-vue/astryx-vue/commit/8f755e542a881dc8042ed6d87501cd969fa6587d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - HoverCard 与 Tooltip：笔落下时取消挂着的悬停打开，不再在按下期间打开又被这一下轻点关掉；HoverCard 的 focusTrigger="auto" 在焦点到达时才判断（漫游 tabindex 的成员变成 Tab 停靠点后会打开），受控 isOpen 为 false 时焦点也不再打开卡片；触发元素被子组件悄悄换掉后会重新接线；文本触发器画共用的焦点环。

## 0.4.43

### Patch Changes

- [#554](https://github.com/astryx-vue/astryx-vue/pull/554) [`5541909`](https://github.com/astryx-vue/astryx-vue/commit/5541909871bb8fc91740c99747399b549e0bc4db) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 页面模板跟上游一批小修：文件浏览器的列用 Stack 自带的滚动、箭头在从右往左时镜像，状态文字改读 text 状态色，复制出去的占位图随深色模式变深。

- [#553](https://github.com/astryx-vue/astryx-vue/pull/553) [`7d9b459`](https://github.com/astryx-vue/astryx-vue/commit/7d9b459410ce9a3b6627a5a4a264c69ad9cb371d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 文档里 useCollator、useToast、useTranslator、usePressFeedback、useListFocus、useOverflow、useGridFocus、useAnnounce、useFocusTrap、useLocale、useKeyboardHint、useTypeahead、useScrollableArea 的页面各补了一个能直接上手的示例。

- [#553](https://github.com/astryx-vue/astryx-vue/pull/553) [`6f51865`](https://github.com/astryx-vue/astryx-vue/commit/6f51865c2b188accb54c1cb4037a240ed603fd35) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `astryx-vue composable` 能查到 useOutlineFromMarkdown、usePowerSearchConfig、useTruncation、useTableSortableState、useCombobox 五个 hook 的文档，Lightbox、Overlay、列设置、图标、LinkProvider、useTheme、国际化 Provider 的文档也各多了一个直接调用 hook 的示例。

- [#553](https://github.com/astryx-vue/astryx-vue/pull/553) [`d086b4c`](https://github.com/astryx-vue/astryx-vue/commit/d086b4c21778235098bc92c0b4221389011f6ebc) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - useHotkeys、useInputStatusIcon、useTreeFocus、useClipboard、useClickableContainer、useImageMode、useScrollOverflow、useMergedRefs、useInputContainer、useScrollLock、useInteractiveRole 的文档页新增可交互示例，useStreamingText 的示例改成真的分段流式输出。

## 0.4.42

### Patch Changes

- [#550](https://github.com/astryx-vue/astryx-vue/pull/550) [`d27092a`](https://github.com/astryx-vue/astryx-vue/commit/d27092a9f35a07901650fe9100b60dbdadbf86f4) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 读屏播报：同一帧里播报的多条消息按顺序连在一起念，一模一样的重复只念一次，空消息连同还没念的一起清掉；`useAnnounce` 新增 `hasReplace` 选项，让每次按键都重说一遍的状态（MultiSelector、CommandPalette 的搜索状态）只念最新一条；Selector、MultiSelector 的结果播报会收回还没念出去的「加载中」，TextInput、TextArea 的加载圈改为装饰、忙碌由输入框自己念一次；原生模态对话框打开时，播报写进那个对话框自己的区域；EmptyState 的根不再是 live 区域，页面加载后才出现或文字之后变了才播报一次。复制：`useClipboard` 新增 `isFailed`、`announceFailure`、`onError`，CodeBlock 新增 `copyFailedLabel` 和 `copyError` 事件，复制失败时按钮变叉并用 assertive 播报，Timestamp、评论链接和富文本代码块同样；`useOverflow` 新增 `gapToken`、`renderedGap`、`inlineBounds`。其余：可滚动的 LayoutContent、LayoutPanel、StackItem 溢出时是有名字的 group，AppShell 的 `fill` 主区域溢出时成为键盘停靠点；锁滚动在触屏上取消没人接的单指拖动并关掉页面回弹；TreeList 收起时焦点回到行；Selector、MultiSelector 键盘移到的高亮选项画焦点环；强制配色下聚焦的菜单行可见；`useImageMode` 在区域数值变化时重新采样；Calendar 今天在接管服务端 HTML 之后才读，服务端和浏览器不同日期也不再对不上；`useMediaQuery` 每条查询只挂一个监听。

- [#548](https://github.com/astryx-vue/astryx-vue/pull/548) [`9f4cd31`](https://github.com/astryx-vue/astryx-vue/commit/9f4cd3181d8e390437b3f23b766525e3395d0c22) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 焦点陷阱（Dialog、Popover、BottomSheet、MobileNav 和 `useFocusTrap`）按 Tab 更像浏览器：同名单选组只算一站，关着的 `<dialog>` 里的控件不算，嵌套时最里层接 Tab，Ctrl/Meta+Tab 留给浏览器，自己处理 Tab 的控件不被抢焦点，传送进 iframe 也能用；Popover 打开时焦点按文档顺序落在第一个可用控件上，跳过 `aria-disabled` 的；菜单里被指针点亮的行不再画键盘焦点环，shadow root 里的菜单也能按松手位置选行，手指松开选中一行后只取消它自己的 touchend，不会在慢页面上让迟到的 click 点中新出现的行；NavMenu、NavHeadingMenu 和 TabMenu 的选项支持按住滑过再松开选中；ContextMenu 和菜单触发器的长按按触摸事件自己的时钟计时，页面忙时晚到的触摸不会丢长按；子菜单关掉后不会被过期的悬停计时重新打开；`useEntryAnimation` 接管服务端 HTML 时不再对不上；复制在不允许异步剪贴板的框架里改用浏览器的复制命令。Calendar 按住 Shift 用 PageUp/PageDown 按年翻；SegmentedControl 禁用时仍保留选中分段的 Tab 停靠点，禁用原因同时描述每个分段；滚动区只靠盒子几何更新两头位置，祖先拖动 transform 时不再每帧重新测量；OverflowList 按主题实际排出的间距折叠，Toolbar 首部直接放 OverflowList 时会折叠给尾部让位。

## 0.4.41

### Patch Changes

- [#547](https://github.com/astryx-vue/astryx-vue/pull/547) [`b17b492`](https://github.com/astryx-vue/astryx-vue/commit/b17b4922330c59dec2eb8973615848aa1b22e63f) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `useTableRowsVirtualization` 和 `useTableColumnsVirtualization`：数据很多的表格只渲染看得见的行和列，滚动手感不变；开启后单元格默认单行截断，行版本会让表格填满父元素的高度并在里面滚动。

## 0.4.40

### Patch Changes

- [#546](https://github.com/astryx-vue/astryx-vue/pull/546) [`2f825cd`](https://github.com/astryx-vue/astryx-vue/commit/2f825cdf9c5c41cd4de6ab097ab28ee6665ad65e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 日期字段对齐上游：DateInput 忙碌时不再画成禁用的样子，禁用的字段聚焦时照样有焦点环（强制颜色下也看得见），转圈不出声、进入忙碌只播报一次（DateRangeInput 同样）；弹出日历只在打开时挂载，按在输入框、清除按钮或标签上不再关上，焦点离开字段时关上，清除后日历保持打开；没打字时 Enter 照常提交表单；底部面板翻到范围尽头时焦点交给另一个箭头，手指下的月份年份滚轮带着已选日期走，服务端渲染不读今天，第一行落在抓手条下面，禁用时重置不起作用；滚轮的方向键走到头不再绕回，并支持 Page 键；西班牙语、法语、俄语等语言的日历月份标题首字母大写；粗指针下日期和时间字段的焦点样子不再渐变。日期输入打的文字被拒时（读不成日期、半截日期、日历上没有的日子、超出范围或被规则排除）会留在框里并说明原因；新增 `entryErrorBehavior`（`complete` 或 `blur-or-enter`）、`entryErrorChange` 事件，FormLayout 新增 `defaultEntryErrorBehavior`，DateInput 和 DateTimeInput 都支持；日历在对话框里被点遮罩关掉时，这一下只关日历，对话框留着。

## 0.4.39

### Patch Changes

- [#545](https://github.com/astryx-vue/astryx-vue/pull/545) [`2ef57bb`](https://github.com/astryx-vue/astryx-vue/commit/2ef57bb652b19c3c320c339f641b9489afe18b1c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - useKeyboardHint 的方向键提示默认不再自己消失，按 Escape 只关提示；Tooltip 内容比触发器四周的空地都高时不再盖住触发器；手指轻点聊天输入框里的粘贴文本令牌只打开预览，不再弹出键盘；独立的模态 BottomSheet 打开时，toast 显示在它上面并能点到。

- [#545](https://github.com/astryx-vue/astryx-vue/pull/545) [`403286d`](https://github.com/astryx-vue/astryx-vue/commit/403286d491fec9a147fac31250e2a06f4963bbc1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 触屏上 Tooltip、HoverCard 要等手指真的轻点才打开，滑动页面不再误开或误关 Popover 和选择列表，轻点禁用控件能看到禁用原因；Dialog 只有按下和松手都在遮罩上才关闭，按遮罩先关掉里面的弹出框时对话框留着；浮层在 iframe 里也能用 Escape 和 Tab。

## 0.4.38

### Patch Changes

- [#543](https://github.com/astryx-vue/astryx-vue/pull/543) [`fe992ac`](https://github.com/astryx-vue/astryx-vue/commit/fe992ac67b9b112c3685be0b249ab42dfbb670fc) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - ComplexSelector 新增 `disabledMessage`（悬停、聚焦、点按触发器时弹出禁用原因，自定义触发器也能用），状态图标顶替箭头显示，`tooltip` 状态的说明收在能聚焦的图标按钮里，调用方的 `aria-label` / `aria-labelledby` 会给内置触发器命名，弹层在禁用前就开着时里面的提交不再改值，弹层内容的高度上限会扣掉 LayerProvider 为底栏留的空隙。

- [#544](https://github.com/astryx-vue/astryx-vue/pull/544) [`d2849f1`](https://github.com/astryx-vue/astryx-vue/commit/d2849f15a3059c03dab71271bc64e5811fd766ec) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Tokenizer 和 Typeahead 新增 `statusVariant`（框内状态图标，`tooltip` 时是能聚焦的图标按钮）并暴露 `aria-invalid`、调用方的 `aria-labelledby` 接在字段标签后面，搜索结果数会念出全部匹配条数，Tokenizer 全部清除会播报一次、禁用时不再向表单交值、聚焦展开的清单里选一项后焦点和清单保留且下一项高亮、有标签时光标落在最后一个标签后面；MultiSelector 和 Selector 的忙碌图标不再对读屏暴露并只播报一次「加载中」，MultiSelector 的 `aria-labelledby` 接在字段标签后面、带搜索时必填标记挪到搜索框、自制触发器带 `aria-disabled` 且禁用时不再执行调用方的处理；选项列表打开时不再高亮禁用项、按字母跳转忽略重音、键盘滚动让行从静止的鼠标下冒出来时不抢高亮；强制颜色下可聚焦的禁用字段焦点边框取 Highlight，触屏上输入框焦点外观不再淡入。

## 0.4.37

### Patch Changes

- [#541](https://github.com/astryx-vue/astryx-vue/pull/541) [`a059c14`](https://github.com/astryx-vue/astryx-vue/commit/a059c14bcde7d82367b5bf2f82e6e2b6d81d4b39) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Lightbox 修了一批看图时的问题：从右往左的页面里方向键朝按钮那一侧翻页；第一项还没到就打开的灯箱等它到了再打开；NaN 或小数下标显示最近的一项；`0` 回到适应大小；换页播报在打开的灯箱里也听得到；Tab 不再跑出灯箱；关闭或被移除时焦点回到打开者；关着时视频不自动播放，关闭时停下正在播的视频；单张照片的图注也坐在图注底色上；点照片旁边的空白会关闭；高度按手机实际露出的视口算，Safari 工具栏不再盖住图注。

- [#542](https://github.com/astryx-vue/astryx-vue/pull/542) [`d74f8eb`](https://github.com/astryx-vue/astryx-vue/commit/d74f8eb77d168e27efbad72a49268dff795d3de5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 浮层与提示的一批修正：Tooltip 在焦点到达时才判断它算不算触发焦点（漫游 tabindex 成员、可聚焦的包裹层都能用键盘打开，鼠标按下后脚本挪来的焦点不再打开提示），`isOpen` 为 false 时本该打开的焦点只发出 `openChange(true)`，禁用时收起已打开的提示；Popover 的高度跟随动态视口并避开刘海和主屏指示条，屏幕键盘弹出时锚定浮层落在键盘上方；触摸在浮层外按下后拖动不再关掉浮层；Dialog 与 Drawer 的遮罩不再模糊；InfoTip 在粗指针下的点击区域随邻居间距伸缩，补了「指标释义」和「权限说明」两个示例；LayoutContent 也带上 `data-container`，主题可以把对话框、卡片的正文和页眉页脚分开设计；新增 useLightbox 文档页。

- [#541](https://github.com/astryx-vue/astryx-vue/pull/541) [`32ea195`](https://github.com/astryx-vue/astryx-vue/commit/32ea1954e3beea4936962d24d555582c8a859b9b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Popover 和 Dialog 的焦点更稳：打开时焦点落在第一个可用的 Tab 停靠点（跳过 aria-disabled 控件，onShow 里自己放好的焦点不再被挪走）；关闭时只把困在里面的焦点送回打开者，打开者不在了就找它附近的停靠点，不再掉到 body，也不再抢走你在关闭回调里放好的焦点。关着的 Popover 不再带 dialog 角色和名称，关着的触发器不再写 aria-controls，aria-disabled 的触发器不会打开浮层。

## 0.4.36

### Patch Changes

- [#539](https://github.com/astryx-vue/astryx-vue/pull/539) [`b74909f`](https://github.com/astryx-vue/astryx-vue/commit/b74909fc6e89b8cf365eb9ce41cda4178c69cc99) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Table 对齐上游一批无障碍和外观修正：列宽把手按列头可见文字命名、不再混进列头名字，并念出实际列宽和合理的范围；树形表格改用披露模式（行上不再带 `aria-level`、`aria-expanded`，展开按钮用 `aria-controls` 指向子行）；行展开和树形插件新增 `getRowLabel`，按钮名字可以带上行名；`useTableRowIndex` 的 `data` 改为可选；数据模式的列标题跟着 `textOverflow` 折行，窄列里标题先省略、排序和筛选按钮留在格子里；手写行列的表格放不下时横向滚动，不再把单词压成一个字母宽；固定列自己画行分隔线；行带上 `table-row` 主题目标的 `parity`、`striped`、`selected` 状态；滚动区和树形按钮画共用的焦点环，手机上横向能滚时藏着内容的一侧会淡出；Invalid Date 显示为空格子，排序时当缺失值。

- [#540](https://github.com/astryx-vue/astryx-vue/pull/540) [`083cd85`](https://github.com/astryx-vue/astryx-vue/commit/083cd85c3e72ee76353719f81598895b13707072) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Table 新增 `useTableInfiniteScroll`：按批加载扁平数据，表格下方有「加载更多」按钮，表格末尾滚进视口时自动加载下一批，失败后暂停自动加载、按钮仍可重试；第一批加载中时表格不显示默认空状态。`TablePlugin` 新增 `loadingState` 钩子，导出 `TableLoadingState` 类型。同时补充 `useTableSortable`（不会重排行、`useTableSortableState` 参数说明）、`useTableFiltering`、`TableSelectionToolbar` 和 Table 的文档。

## 0.4.35

### Patch Changes

- [#538](https://github.com/astryx-vue/astryx-vue/pull/538) [`d7a5a96`](https://github.com/astryx-vue/astryx-vue/commit/d7a5a96bbebc8a0a5977bc6dbb8c45c5a260130d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `doctor` 新增 `button-actions` 检查：读项目自己 `.vue` 文件的模板，列出按下后什么都不做的 core `Button`、`IconButton`（没有 `@click`、`click-action`、`href` 或提交类型，处理函数是空的，或链接哪儿也不去），只在周围没有东西能接管按下时才判，只警告不让 doctor 失败。

## 0.4.34

### Patch Changes

- [#537](https://github.com/astryx-vue/astryx-vue/pull/537) [`8bf1fd3`](https://github.com/astryx-vue/astryx-vue/commit/8bf1fd38a39473cdf74c9d7848f50fd4bbe07dcd) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `doctor` 在包没装好时给出修复命令：用项目自己的包管理器，缺 themes 时按项目 core 的版本装（core 钉死版本时加 `-E`），刚 clone 还没装依赖时让你运行项目自己的安装；用 core 的 `<Theme>` 或 `dataset.astryxTheme` 设主题也算设好了。`init` 逐个文件说明做了什么，区块已是最新时不重写文件、只打印 `build` 和 `search`，安装步骤只列还缺的包，写不了文件时说明原因和该改什么；内置的样式指南补上自己写样式时要守的几条。

## 0.4.33

### Patch Changes

- [#532](https://github.com/astryx-vue/astryx-vue/pull/532) [`41a3277`](https://github.com/astryx-vue/astryx-vue/commit/41a32773b15cdbc36962d70c6bbb75c89394ac9e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 实验包：CircularProgress 改为合成线程上转动的圆弧，页面忙时进度变化也不会卡住，不确定状态和加载圈一样转，所有变体共用浅色轨道、禁用时整圈半透明；Tour 的说明框改成非模态区域，可以指向任何元素，按目标或页面不再结束引导，Escape 报告 `escape`，结束后把焦点还回去；CodeEditor 在从右到左的页面里代码保持从左到右；Schedule 的加载提示改走共享播报通道。

## 0.4.32

### Patch Changes

- [#534](https://github.com/astryx-vue/astryx-vue/pull/534) [`dc8015d`](https://github.com/astryx-vue/astryx-vue/commit/dc8015d7a86410799e01769fc2ee0aa4554dabbf) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - FileInput 一次挑了几个不合格的文件时，状态提示按当前语言列出每个文件和原因，不再只说第一个；InternationalizationProvider 漏写 `locale` 时，开发环境直接报错并给出改法。

## 0.4.31

### Patch Changes

- [#533](https://github.com/astryx-vue/astryx-vue/pull/533) [`e869ec3`](https://github.com/astryx-vue/astryx-vue/commit/e869ec3cb4f87419d5f78ddcbf9d5fa1fda63f75) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 语言目录对齐到上游 v0.7.17：键盘按键名、文件大小、字段说明按钮、InfoTip、滑块、Tokenizer 溢出数等文案都能随加载的目录翻译；SideNav、TopNav 标题旁的菜单按钮名带上标题；Table 的排序按钮改用列标题命名，多列排序时用描述读出优先级；文件大小改为 KB、MB 保留一位小数。

## 0.4.30

### Patch Changes

- [#531](https://github.com/astryx-vue/astryx-vue/pull/531) [`c4f306d`](https://github.com/astryx-vue/astryx-vue/commit/c4f306d4de9b02036f7fc7aae1e9188cd833f535) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 敲字母跳转（菜单、Selector、TreeList 等）不再区分重音和带横线的字母：敲 `a` 能跳到「Ánh」，敲 `d` 能跳到「Đào」；Windows 上用 AltGr 敲出的字母也能跳转。

## 0.4.29

### Patch Changes

- [#530](https://github.com/astryx-vue/astryx-vue/pull/530) [`dc2208c`](https://github.com/astryx-vue/astryx-vue/commit/dc2208ceb9f15876579a64cbb1082e82c8a2a088) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 传 `--yes`、`-y`、`--non-interactive` 这类确认选项时，CLI 会说明所有命令都不会提问，并直接给出去掉该选项后的同一条命令；内置的使用原则文档改为「设置分组用 `Section`，不用 `Card`」。

## 0.4.28

### Patch Changes

- [#520](https://github.com/astryx-vue/astryx-vue/pull/520) [`40d7a78`](https://github.com/astryx-vue/astryx-vue/commit/40d7a782e6a420ce21a3d9d2d8fe1dc6b2fd0162) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 公开 `useComponentMessages` 和各组件的内置文案（如 `tableMessages`、`codeBlockMessages`），自己的组件可以只取用到的几组文案。富文本编辑器改用它，打包时不再带上全部组件的文案。

## 0.4.27

### Patch Changes

- [#518](https://github.com/astryx-vue/astryx-vue/pull/518) [`76d1bb6`](https://github.com/astryx-vue/astryx-vue/commit/76d1bb68afc03cd54a727b22e8932ec8217862cb) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Carousel` 的 `hasSnap` 现在也接受新的 `useSnapPaging()` 返回值，在原生吸附的停点上像 iOS 那样翻页：用手指或触控板横扫时，轻扫一下翻一屏，传 `{ pages: 'item' }` 时翻一项，再快也最多翻一页；翻到一半能用手指接住，最后总停在某一项的起始边。鼠标滚轮和鼠标拖动仍是原生滚动，系统要求减少动态效果时直接跳到目标页。
  
  - 边缘按钮、方向键、Shift 加滚轮和 `scrollNext`、`scrollPrev`、`scrollTo` 都经由同一套翻页来挪，`scrollTo` 落在这一项的吸附停点上（考虑 scroll-padding）。
  - 翻页按住这一行期间，边缘按钮和渐隐跟着这一行显示的位置变，与这一行同一帧变化。
  - 离末端不到半步的停点并入最后一页，原生吸附也跳过那一项，所以每种滚动方式都停在这一行真正的尽头。

## 0.4.26

### Patch Changes

- [#519](https://github.com/astryx-vue/astryx-vue/pull/519) [`6e5953a`](https://github.com/astryx-vue/astryx-vue/commit/6e5953a3c3eed6c6d0d91f189f479bef95f47a97) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - CLI 内置文档里状态色说明的链接改为主题扩展页的实际网址。

## 0.4.25

### Patch Changes

- [#516](https://github.com/astryx-vue/astryx-vue/pull/516) [`c7035a1`](https://github.com/astryx-vue/astryx-vue/commit/c7035a1463495c9fbafc4823bedb4c5e2d082aa2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 在手机、平板这类以触屏为主的设备上，按钮能被手指点中的范围朝 44px 扩大，按钮自己的大小不变（同上游 e10347c4e）。
  
  - 扩大的部分停在到相邻可点控件一半距离的地方，点在两个控件中间总是算给离得近的那个；手指按下时还会再量一次，邻居刚挪近时这一下宁可不执行，也不点错。
  - 禁用或只是忙碌的按钮不扩大；能打断的忙碌按钮照常扩大。鼠标下没有任何变化。
  - ButtonGroup、ToggleButtonGroup 由组统一画这一圈：两端照成员朝 44px 扩大，按在这一圈里的触摸交给离得最近的成员，成员自己不再单独扩大。
  - 输入框的清除按钮保留输入框自己的那一小圈触控范围。
  
  CLI 内置的组件文档跟着更新了 Button、ButtonGroup、ToggleButtonGroup 的触控说明。

- [#517](https://github.com/astryx-vue/astryx-vue/pull/517) [`3d1eb56`](https://github.com/astryx-vue/astryx-vue/commit/3d1eb56dd9c087bad55a31afffa709929b896dd0) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 状态色按所在的底分成几种角色，组件各取其一：
  
  - `defineTheme` 做的主题只写了状态底色（或改了表面色、`--color-on-dark` / `--color-on-light`）时，会按主题自己的颜色算出没写的 `--color-on-<状态>`、`--color-text-<状态>`、`--color-on-<状态>-muted`，图标和边框角色跟着文字色走；Badge、StatusDot、输入框、图标等组件变量也在这个主题里跟着换。算出来的变量名记在 `theme.derivedTokens`。新增 `STATUS_COLOR_DEFAULTS`，和默认主题 CSS 里的状态色一致。
  - `Icon` 新增 `color="info"`。各主题里 `Icon` 的 success / warning / error 颜色、Stepper 的状态图标改用图标角色；默认主题下成功图标从 `#00490B` 变为 `#2F7D33`。
  - 输入框的状态边框改用边框角色，表单状态提示的文字改用浅底内容色；默认主题下浅色模式的警告边框从 `#FFCE2F` 变为 `[#836700](https://github.com/astryx-vue/astryx-vue/issues/836700)`。
  - 默认主题的 StatusDot 用实心状态底色，图标用对应的 on 角色；头像状态点的图标也用 on 角色。
  - 聊天输入框状态条的文字和图标改用浅底内容色；菜单里的危险操作、TextArea 和富文本编辑器超出字数的计数、未读分隔线标签、lab 里 Stat、CircularProgress、LogStream、SVGIcon 的状态色改用文字或图标角色。
  - 强制配色模式下，Badge、StatusDot、进度条填充、步骤条数字徽标、聊天输入框状态条、列表滑动的危险操作都补一圈边，形状不会消失。
  
  想保留某个组件原来的颜色，在主题里写上对应的角色即可，比如把 `--color-icon-success` 设成原来的值。

## 0.4.24

### Patch Changes

- [#515](https://github.com/astryx-vue/astryx-vue/pull/515) [`2bd41f7`](https://github.com/astryx-vue/astryx-vue/commit/2bd41f7c964b4b7bc0e31c7594b4703a34ed2189) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 每个组件只带自己的内置文案：只用到 Button、Spinner、Token 这类组件的应用，打包时不再把所有组件的英文和中文文案一起打进去。显示的文字、`InternationalizationProvider` 的用法和 `useAstryxMessages`、`useTranslator` 等公开接口都不变。

## 0.4.23

### Patch Changes

- [#514](https://github.com/astryx-vue/astryx-vue/pull/514) [`cd143dc`](https://github.com/astryx-vue/astryx-vue/commit/cd143dcc55229632183f74c32ae913016782dc07) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 跟进上游的另一组零散修复：
  
  - `Theme` 里没有自己设行高的文字取主题的正文行高（`--text-body-leading`），不再落回 reset 的 1.5；设了文字角色字号的部位（表格单元格和表头、日历、分页小尺寸、Tab、空状态紧凑模式、代码块 sm、Slider 数值、多选和搜索菜单的分组标题等）一并设上这个角色的行高。默认主题下 14px 的正文行高从 21px 变为 20px。想保留旧行高，可以在自己的容器上设 `line-height`，或在主题里设对应角色的 leading token。
  - `astryx-vue search` 认得别的组件库对组件的叫法（`ScrollArea`、`side sheet`、`toggle group`、`circular progress` 等）和常见图标名（`cog`、`lightning bolt` 会找到 `Icon`）；动词只折叠进行时，`listed` 不再当成 `List`。
  - 付款表单和结账向导模板在窄屏首帧（脚本还没量出宽度时）把订单摘要换到表单下面，不再把表单挤窄；`dashboard-scorecard` 和 `dashboard-progress` 模板的整块页面区域不再套卡片。

## 0.4.22

### Patch Changes

- [#510](https://github.com/astryx-vue/astryx-vue/pull/510) [`90a7127`](https://github.com/astryx-vue/astryx-vue/commit/90a7127a47057e379ff9255cf00c7fe4cee09a79) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主要按钮和危险按钮里的中性 Badge 改用按钮底色和文字反过来配色，对比度够了；只有首尾两段内容的 Toolbar 挤不下时，尾部换到下一行，不再把标题挤到折行；复选框的勾、横线和单选的圆点按框的比例画，主题改框大小时跟着缩放；Calendar 的星期名变大时撑宽所在列，不再挤进隔壁；Grid 的 `columns={ minWidth }` 在比 minWidth 还窄的容器里不再撑出横向滚动；开发环境下 CodeBlock 漏传 `code` 时报出点名属性、给出改法的错误。

- [#506](https://github.com/astryx-vue/astryx-vue/pull/506) [`45b95b5`](https://github.com/astryx-vue/astryx-vue/commit/45b95b5ffc4b0c6d3faf8bdf7de1b9f59cfa5f51) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题能直接改到组件内部画出来的部位，默认外观不变（跟进上游 [#12081](https://github.com/astryx-vue/astryx-vue/issues/12081)）。
  
  - Kbd 每个按键徽章带 `kbd-key`，Typeahead 结果弹层带 `typeahead-popup`，BottomSheet 拖拽条带 `bottom-sheet-handle`，AlertDialog 标题和说明带 `alert-dialog-title`、`alert-dialog-description`。
  - Calendar 的区间色带和悬停预览色带带 `calendar-range`、`calendar-range-preview`，色带首尾一天带 `start`、`end`。
  - LayoutHeader、LayoutFooter 标出所在容器 `container`（`card`、`dialog`、`bottom-sheet`）；ToggleButton 在 ToggleButtonGroup 里带 `grouped`。
  - accent 颜色的 Link 悬停时读 `--link-hover-color`。
  - Table 的排序序号和 MetadataList 的「显示更多」改用 `--color-text-accent`，在深色背景上更易读。
  
  CLI 内置的主题文档同步更新。

- [#507](https://github.com/astryx-vue/astryx-vue/pull/507) [`ce2bfa4`](https://github.com/astryx-vue/astryx-vue/commit/ce2bfa4602747acbafa5e91108be1b755003e041) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Lightbox 图集的图注放进照片下方一条两行高的区域：每一页的照片大小和位置都一样，翻页时不再忽大忽小；没有图注的页面也留着这块空间，只是不画底色。图注超过两行时末尾出现行内的「更多」，点开后整段图注盖在照片底部，「收起」或翻页会合上；从「更多」「收起」上翻页时焦点移到新一页的照片（不能缩放时移到关闭按钮）。整段图注始终是查看器的无障碍描述。
  
  CLI 内置的 Lightbox 文档跟着更新。

- [#508](https://github.com/astryx-vue/astryx-vue/pull/508) [`ca023d0`](https://github.com/astryx-vue/astryx-vue/commit/ca023d06a64172f5a17a4f6fc0ecdf233c9b352f) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 跟进上游的一组零散修复：
  
  - 头像首字母、Markdown 标题锚点、数字输入里用到的 Unicode 属性正则改在运行时构造，用 Babel 转译依赖的源码构建不会再报 `Unknown property`。
  - Button 的 `icon`、`end`，Tab 的 `icon`、`selectedIcon`、`endContent`，SegmentedControlItem 的 `icon`，BreadcrumbItem 的 `startIcon`，Avatar 的 `status`，DropdownMenuGroup 的 `title`：插槽只留下 `v-if` 的注释或空白时，不再画出空的包裹元素；Tab 选中时 `selectedIcon` 没内容就退回 `icon`；DropdownMenuGroup 用插槽写的标题也会命名这一组。
  - ComplexSelector 的触发器在内置和自定义两条路径上都是 `role="combobox"`，必填、禁用和忙碌状态都挂在它上面；自定义触发器拿到的绑定新增 `role`、`aria-required`，`aria-label` 让位给选择器自己的 `aria-label` 或 `aria-labelledby`。Button 保留调用方传入的 `aria-busy` 和 `aria-disabled`。
  - Kbd 的键帽缩写和读出来的键名、FileInput 校验提示里的大小单位、粘贴文本小块上的计数改用内置文案，跟着语言切换。`formatFileSize` 和 `pastedTextLabel` 新增可选的格式参数。
  - Selector、MultiSelector、ComplexSelector 的列表按触发器宽度定的最小宽度压在视口上限之内，触发器太宽时列表不再撑出屏幕。
  - 开发构建里，ChatToolCalls 缺 `calls`、ChatDictationButton 缺 `dictation` 时抛出点名的错误，说清楚该怎么传。
  - 主题在 `checkbox-input`、`switch` 目标上写的 `gap` 改的是控件和标签之间的距离，不再挤到状态消息上方。
  - Pagination 这一排控件的首尾带上 `data-first="first"`、`data-last="last"`，主题可以把控件连成一条并只给两头加圆角。

- [#509](https://github.com/astryx-vue/astryx-vue/pull/509) [`d94de78`](https://github.com/astryx-vue/astryx-vue/commit/d94de78d16484142ef7642d410b060e59deec27c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 在手机、平板这类以触屏为主的设备上，ButtonGroup、ToggleButtonGroup 和 AlertDialog 的按钮可以按住滑动：按下的那个立刻高亮，滑到别的按钮上高亮跟过去，松手时只执行手指下的那个，在组外松手什么都不执行。鼠标按下仍和原生按钮一样。菜单触发器和没有 `value` 的切换按钮保留自己的按压。
  
  CLI 内置的文档跟着更新了 ButtonGroup、ToggleButtonGroup、AlertDialog 的说明。

- [#505](https://github.com/astryx-vue/astryx-vue/pull/505) [`6fc4715`](https://github.com/astryx-vue/astryx-vue/commit/6fc471578ecb89aa5cdd4c0c5c6751273bbb02cf) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Text、Heading 的截断测量和截断提示跟进上游。
  
  - 截断的 Text / Heading 不再随文字挂一个关着的提示层，等第一次悬停、轻点或键盘聚焦才挂；挂上后照常回应那次交互（悬停等延迟、轻点立刻打开）。之前每个截断元素都带着 `aria-describedby` 和一个隐藏的提示层，现在交互前都没有。
  - 截断测量改用全页共用的 ResizeObserver，第一次测量在浏览器排版之后进行，挂载一长串截断文字时不再逐个强制排版。
  - 新增从 `@astryx-vue/core/Text` 导出的 `useTruncation`，自己的组件也能「截断时才显示全文提示」。
  - 不截断的 Text / Heading 里，比一行还长的串（URL、ID）会换行，不再撑出横向滚动；用 `overflow-wrap: anywhere` 换行的内置容器（Banner、Toast、FieldStatus 等）里的文字跟着用 anywhere，浮层里回到 break-word。
  - Heading 没写 `level`、或不是 1–6 时按 2 级渲染并在开发时警告，不再渲染出无效的标签；调用方自己写的 `aria-level` 优先于 `accessibilityLevel`。
  - Tooltip 轻点触发器里的文本框时只让它获得焦点，不开也不关提示。
  - Button 的标签被行宽截短时，键盘聚焦就在提示里显示完整标签；表头单元格的标题被截短时，键盘聚焦到单元格里的排序按钮也一样。这两种提示不加描述，读屏只读一遍名称。
  
  CLI 内置的组件文档跟着更新了 Text、Heading、Button 的说明。

- [#512](https://github.com/astryx-vue/astryx-vue/pull/512) [`473ae5a`](https://github.com/astryx-vue/astryx-vue/commit/473ae5a6c8b9471ac1bcd267760058ad38c89338) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Typeahead、PowerSearch、Tokenizer、Tooltip、HoverCard 跟进上游一组和 Token 相关的修复。
  
  - Typeahead 有值时，值 Token 的按钮就是这个字段的 Tab 停点。它现在用字段标签加上值命名（例如「Fruit Apple」），说明和状态也和输入框一样读出来。BaseTypeahead 新增 `labelId`。
  - PowerSearch 内置的条件标签按全部可见文字命名（「Status: is Open」），删除按钮是「Remove Status: is Open」；点它会打开编辑器时带 `aria-haspopup="dialog"` 和 `aria-expanded`，编辑器是同名的对话框。
  - Tokenizer 和 PowerSearch 在触屏上用手指点标签的删除按钮、而输入框没有焦点时，删除后焦点留在原处，屏幕键盘不会弹起来；被删标签原本有焦点时仍交给输入框。
  - 在打开的 Tooltip、HoverCard 里按下，不再激活包着触发元素的可点卡片、列表行、树形行或文件选择区；页面级的监听仍然收得到。
  
  CLI 内置的组件文档跟着更新了 Typeahead、PowerSearch、Tokenizer、Tooltip、HoverCard 的说明。

- [#500](https://github.com/astryx-vue/astryx-vue/pull/500) [`4e7767f`](https://github.com/astryx-vue/astryx-vue/commit/4e7767f0707c19e4208b003e5f4e767ede363848) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Token 跟进上游一组修复。
  
  - 禁用的 Token 在每种结构的根上都带 `data-disabled`，主题可以据此改样式。禁用的链接型 Token 仍是可聚焦的链接（`role="link"`、`aria-disabled="true"`、没有 `href`），Enter 和空格不再触发，其他按键照常交给调用方。
  - 带 `href` 的 Token 点击链接时也会调用 `@click` 监听；点删除按钮不会。
  - 可点击 Token 的 `aria-labelledby`、`aria-describedby`、`aria-haspopup`、`aria-expanded`、`aria-pressed` 落到里面的按钮上，筛选标签可以用 `aria-pressed` 表示按下。
  - 焦点环只画一个：Token 自己的按钮或链接获得焦点时整颗 Token 画环，删除按钮自己画环。List 的 Item 也只在自己的按钮或链接获得焦点时给整行画环，起止插槽里的控件自己画环。
  - 右到左页面上，Token 标签、Badge 标签和 InputGroupText 里没有右到左字母的纯文字保持书写顺序，`https://`、`+3`、`@alice` 不再被重排。
  
  CLI 内置的组件文档跟着更新了 Token、Badge、InputGroup 的说明。

## 0.4.21

### Patch Changes

- [#504](https://github.com/astryx-vue/astryx-vue/pull/504) [`eb86f99`](https://github.com/astryx-vue/astryx-vue/commit/eb86f99216430d1c736a63d7b84ab909491e379d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - InputGroup 禁用时，组内的输入框、选择器和按钮附加件都会跟着禁用，嵌套的内层组也一样；强制配色（Windows 高对比主题）下，ButtonGroup 的接缝不再叠成双线，Popover、下拉菜单、右键菜单和对话框保留一圈边；ButtonGroup 末尾成员在后面跟着弹出层时也照样圆角。按钮族文档补上独立 ToggleButton 的 click 先发出且可取消切换、链接模式下 element 是链接元素等说明。

- [#498](https://github.com/astryx-vue/astryx-vue/pull/498) [`10edf09`](https://github.com/astryx-vue/astryx-vue/commit/10edf09cbfac1686d29d08917a9e1782a7dcfb83) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Carousel 的滚动区成为和轮播同名的分组，只在内容溢出时才是 Tab 停靠点；卡片增删或尺寸变化后会重新判断是否溢出；Shift 加滚轮的监听只在溢出时挂上，且不再读取布局。滚动区的键盘焦点环改由轮播画在边缘渐隐之上，两侧滚动按钮收进焦点环以内；CodeBlock 的代码视口也画出共享焦点环，并向内收进被裁切的外框。

- [#503](https://github.com/astryx-vue/astryx-vue/pull/503) [`25e3e52`](https://github.com/astryx-vue/astryx-vue/commit/25e3e5212409f95de8841fa22f6de2ed01c5079d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 跟进上游几个展示类小组件的修复：
  
  - Avatar：首字母改由私有的行内自定义属性画出，不再暴露公开的 `data-initials` 属性；强制配色（Windows 高对比度）下，单独头像的首字母和默认图标跟随周围控件的颜色，组内头像保持不变。
  - AvatarGroupOverflow：调用方传入的非空 `aria-label` 会作为指示器的名字，空字符串时仍回退到「还有 N 个」。
  - Badge：有文字的徽章随字号变大而长高；宽度和文字一样，不会在 Grid 单元格或 VStack 里被拉满。
  - Kbd：非 Apple 平台和水合之前，`ctrl`、`alt`、`shift`、`meta` 显示为 `Ctrl`、`Alt`、`Shift`、`Win` 文字；Apple 平台上 `meta` 显示 ⌘；键帽随字号变大而长高；开发环境下 `keys` 不是字符串时抛出点名该属性的错误。
  - Thumbnail：禁用或加载中时，打开和移除按钮仍保持挂载、可聚焦并标记为已禁用，焦点不再掉到页面上；聚焦打开按钮只画一个焦点环；上传时的加载指示对读屏隐藏，改为每次开始加载时播报一次「加载中」。
  - Citation：开发环境下缺少 `source` 时抛出点名该属性的错误；带图标的标签引用在行内垂直居中。
  
  CLI 内置的组件文档跟着更新了上述说明。

- [#502](https://github.com/astryx-vue/astryx-vue/pull/502) [`12b3dd9`](https://github.com/astryx-vue/astryx-vue/commit/12b3dd9e586de415324f6288ad44e2985d25b281) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Icon 与主题图标跟进上游 AST-087 一组改动。
  
  - `defineTheme({ icons })` 的条目可以写成 `{ size, variant }` 的函数，`Icon` 按实际尺寸调用它；函数返回 `null` 就不画，不再退回默认图标。`theme.icons` 和 `useSemanticIcon` 按 `md` 读取。
  - 主题用 `iconVariants` 一次列出支持的变体名，`Icon` 新增 `variant` 属性来要另一种画法；主题没列的变体不会传给条目。
  - 新增 `defineTheme({ componentIcons })`，按槽位决定组件自己的图标：CodeBlock 复制（`code-block-copy`）、Timestamp 悬浮卡片复制（`timestamp-copy`）、Table 排序指示（`table-sort-indicator`）和行展开（`table-row-expand`）。写错的字段只在开发环境提示一次，不会打断渲染。
  - 主题在 `components.icon['size:sm']` 等尺寸上写的 `width`、`height` 现在连字形的字号一起改。
  - `Icon` 的模板 ref 暴露 `element` 和渲染出的 `svg`。
  - 同一页面里加载了多份本包时，注册的图标彼此可见。
  
  CLI 内置的 Icon 文档同步更新。

- [#499](https://github.com/astryx-vue/astryx-vue/pull/499) [`88aabd1`](https://github.com/astryx-vue/astryx-vue/commit/88aabd16b6545d9a1b9102fcfbc779fe9aba36c5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Link 跟进上游的一组修复。
  
  - 禁用的 Link 不会被调用方传的 `role` 或 `aria-disabled` 换掉禁用状态，读屏仍然读出「已禁用」；调用方传的 `tabindex` 照常生效。启用时，调用方的 `role`、`tabindex`、`aria-disabled`、`aria-label` 也都能落到根元素上。
  - 根元素带上 `data-color`，始终和 `color` 一致，调用方传的同名值不会盖掉它。
  - 放在设了 `maxLines` 的 Text 里的链接会并入文字的行里，外面的截断能从链接中间切开。
  - 没有断点的长标签（比如一串网址）在窄栏里换行，不再撑出容器；按钮形态的 Link 换行后和锚点一样跟随外面的对齐；设了 `maxLines` 的链接在弹性行里也能收窄并画出省略号。
  - RichTextEditor 自动识别邮箱时，匹配耗时和文字长度成正比，粘贴一长串哈希或 base64 不会让页面卡住。

- [#501](https://github.com/astryx-vue/astryx-vue/pull/501) [`283935c`](https://github.com/astryx-vue/astryx-vue/commit/283935ced65c9d03fb7929e6c128c8e0afcd0298) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 触屏按压反馈跟进上游，手感更接近系统控件。
  
  - 不在滚动区域里的可按控件，手指落下那一帧就亮；滚动区域里仍等 150 毫秒，而且从触摸本身算起，页面忙时也不会亮得更晚。
  - 手指按在列表行、TreeList 行、Token、可点卡片和可选卡片里的其他控件上（行尾按钮、Token 的删除按钮、卡片里的输入框）时，外面的容器不再一起亮。`usePressFeedback` 新增 `isContainer` 选项和 `pressActionProps` 返回值，自己写的容器也能用。
  - 开了「减少动态效果」时，按钮按下不再缩放，卡片和缩略图的悬停、按下颜色立即切换，按压淡出最多 200 毫秒。
  - 菜单、列表框这类触发器在自己的弹层开着时按下不缩放，弹层贴着静止的按钮。
  - 触屏设备上，按钮松手后的淡出画在按钮自己的 `::before` 上、在合成线程上播放，页面脚本再忙也能顺畅淡完。
  - 可点卡片在既有触屏又能悬停的设备上，手指按下时不再和悬停颜色叠成两层。
  
  CLI 内置的文档跟着更新了 usePressFeedback 和 Button 的说明。

## 0.4.20

### Patch Changes

- [#496](https://github.com/astryx-vue/astryx-vue/pull/496) [`6a92b59`](https://github.com/astryx-vue/astryx-vue/commit/6a92b59f5baf06d67147403a5b2ea28f6edffbe9) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Button 跟进上游 [#7906](https://github.com/astryx-vue/astryx-vue/issues/7906)（spec:AST-085）：禁用的按钮不再渲染原生 `disabled`。
  
  - Button、IconButton、ToggleButton 禁用时一律标记 `aria-disabled="true"`，留在 Tab 顺序里；聚焦时被禁用也不会把焦点丢到 body。鼠标、Enter、Space 和 `clickAction` / `click` 照样被拦住，其他按键仍传给调用方。
  - 真正禁用的 submit 按钮不带 `name`，提交时不会带上它的值。
  - ButtonGroup、Toolbar 的成员全部禁用时仍保留一个 Tab 停靠点（`useListFocus` 新增 `hasDisabledTabStop` 选项）。
  - Carousel 隐藏的翻页按钮所在容器加上 `inert`，不会成为 Tab 停靠点。
  - lab 的 ListInput 禁用或加载中时，重排手柄虽然能聚焦，方向键和拖拽都不再重排。
  
  测试里断言 Button 带 `disabled` 属性的，改成断言 `aria-disabled="true"`。
  
  CLI 内置的组件文档跟着更新了 Button、IconButton、ToggleButton、ButtonGroup 的禁用说明。

## 0.4.19

### Patch Changes

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题文档搬到文档侧栏后，`theme` 和 `docs` 命令给出的主题页链接改为 `/guide/theming`、`/guide/themes/<主题>` 和 `/guide/<基础主题>`；内置模板目录同步演练场模板的最新源码。

- [#491](https://github.com/astryx-vue/astryx-vue/pull/491) [`a02b3c5`](https://github.com/astryx-vue/astryx-vue/commit/a02b3c5080e714a55e89b71cd89dfe7f15db7571) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对照原版组件页顶部预览，修正组件和主题与原版不一致的地方：
  
  - Dialog 的最大宽度照原版改成「不超过容器，也不超过视口宽度减去两侧各 16px」，行内对话框同样适用，窄屏下不再溢出。
  - AlertDialog 不传 `width` 时，在手机上（粗指针且视口窄或矮）默认宽 320，和 iOS 系统弹窗一致，其他情况仍是 400。
  - Calendar 星期表头改用原版当前的 CLDR 写法（英语 Sun / Mon，法语 dim. / lun. 等），表头行高 36px，月份切换箭头用主文字色。
  - TabList 选中下划线两端缩到和 tab 左右内边距对齐，默认压在 tab 底边外 1px，颜色取 `--astryx-color-accent`；可滚动的标签条按同一个值往下留空，不会把下划线裁掉。
  - Switch 根节点改成竖排 flex，开关行下面不再多出 4px 行盒空隙。
  - Link 的 `isStandalone` 字号和行高改读 `--astryx-text-body-size` / `--astryx-text-body-leading`，原来读的两个变量不存在，会退到 16px。
  - Icon 用语义名字（如 `icon="search"`）解析到主题图标时，和内置图形一样是行内 flex，落在行框里，不再当作块级图形。
  - 字段标签（FieldLabel，Switch、CheckboxInput、各类输入框的标签都用它）照原版改成半粗、主文字色；说明文字和可选标记仍是次要文字色。原版的理由：Arial、Segoe UI 等字体没有 500 字重会退回常规体，半粗能保证标签总比说明重。
  - Avatar 首字母默认用主文字色；Neutral 主题同样改为 `--astryx-color-text-primary`。
  - Neutral 主题：Slider 未填充轨道改用 `--astryx-color-track`（原来和画布底色相同，看不见）；StatusDot 的成功、警告、错误点改用 `--astryx-color-icon-*`。
  - 组件目录（catalog）随文档演示源码更新。

## 0.4.18

### Patch Changes

- [#486](https://github.com/astryx-vue/astryx-vue/pull/486) [`aa9573f`](https://github.com/astryx-vue/astryx-vue/commit/aa9573fe071dcf0e81c7ec3f558917f89b566c7a) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 组件目录里 Token 和 Tokenizer 示例源码引用的文档站颜色变量改名：`--vp-c-text-2` 变为 `--docs-c-text-2`。文档站从 VitePress 迁到 KawaPress 后，站点自己的调色板不再沿用 VitePress 的变量前缀。

- [#487](https://github.com/astryx-vue/astryx-vue/pull/487) [`78e34af`](https://github.com/astryx-vue/astryx-vue/commit/78e34af5079be3a25c83046f9fb0989457ec1041) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 内置组件目录里 Timestamp 的 auto 与 relative 示例源码改为挂载后再取当前时间，服务端渲染时不读时钟。

## 0.4.17

### Patch Changes

- [#480](https://github.com/astryx-vue/astryx-vue/pull/480) [`f294bbf`](https://github.com/astryx-vue/astryx-vue/commit/f294bbf829474c149d1e2fa95372cd792cd9b6b5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Refresh the built-in documentation catalog after polishing the Chinese component guides from AlertDialog through ContextMenu without changing their examples or API tables.

## 0.4.16

### Patch Changes

- [#479](https://github.com/astryx-vue/astryx-vue/pull/479) [`0053802`](https://github.com/astryx-vue/astryx-vue/commit/005380208f8d23e5fecec68280599c4bfa77d940) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Refresh the built-in documentation catalog after correcting the reset stylesheet description and removing a stale hard-coded package version from the installation guides.

## 0.4.15

### Patch Changes

- [#472](https://github.com/astryx-vue/astryx-vue/pull/472) [`5e1c45f`](https://github.com/astryx-vue/astryx-vue/commit/5e1c45f8bd2f87618c03f3f1c5737eb4f2104d3a) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Improve search ranking for compound names, camelCase queries, and common word forms. Search now matches authored template display names, avoids unrelated partial-text results for underscored identifiers, and orders failed-lookup suggestions by name affinity before edit distance.

## 0.4.14

### Patch Changes

- [#471](https://github.com/astryx-vue/astryx-vue/pull/471) [`9a83bc0`](https://github.com/astryx-vue/astryx-vue/commit/9a83bc0b6d239985f52ad4737f76eb10d634307d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 同步演练场 IDE 示例的最新源码到 CLI 目录。

## 0.4.13

### Patch Changes

- [#469](https://github.com/astryx-vue/astryx-vue/pull/469) [`2e3ad0a`](https://github.com/astryx-vue/astryx-vue/commit/2e3ad0a24576ab674c600ba73ba10cccad538079) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 同步主站新增的 ThreeD SVG 图表 API 和示例资料。

## 0.4.12

### Patch Changes

- [#468](https://github.com/astryx-vue/astryx-vue/pull/468) [`7dad994`](https://github.com/astryx-vue/astryx-vue/commit/7dad994c3da3bc7eb72dfd9c5b9f290a9e97ead2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 同步主站新增的 Sankey 图表 API 和示例资料。

## 0.4.11

### Patch Changes

- [#465](https://github.com/astryx-vue/astryx-vue/pull/465) [`d0684ea`](https://github.com/astryx-vue/astryx-vue/commit/d0684ea9d8e32f1e6bf1c204b93c80132b7f0a55) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 更新 M4 示例的内置资料，改用自然的连续峰谷数据，不再展示人为尖峰。

## 0.4.10

### Patch Changes

- [#464](https://github.com/astryx-vue/astryx-vue/pull/464) [`1a3e7b0`](https://github.com/astryx-vue/astryx-vue/commit/1a3e7b088a071a78ee52708330261ca44e1fb794) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 更新主站内置资料，加入 Radial 雷达图、饼图/donut、扇区、提示框和中英文示例。

## 0.4.9

### Patch Changes

- [#463](https://github.com/astryx-vue/astryx-vue/pull/463) [`258c023`](https://github.com/astryx-vue/astryx-vue/commit/258c023a6e88934c0d87434c62e9023def979abf) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 更新主站内置资料，加入 `useChartRange` 流式数据范围说明和交互示例。

## 0.4.8

### Patch Changes

- [#462](https://github.com/astryx-vue/astryx-vue/pull/462) [`ed329c6`](https://github.com/astryx-vue/astryx-vue/commit/ed329c646331bed771edc22b858509f03c2452be) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 更新主站内置资料，加入 `m4Reduce` 大数据折线缩减说明和示例。

## 0.4.7

### Patch Changes

- [#459](https://github.com/astryx-vue/astryx-vue/pull/459) [`c52b154`](https://github.com/astryx-vue/astryx-vue/commit/c52b154a480506c596ead260af886e1bec130a63) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 同步主站 ChartZoom 文档到内置查询资料。

## 0.4.6

### Patch Changes

- [#458](https://github.com/astryx-vue/astryx-vue/pull/458) [`0f3f490`](https://github.com/astryx-vue/astryx-vue/commit/0f3f490a8fa77c7993e34081470c67bf3f94d4e0) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 同步主站 ChartSelect 文档到内置查询资料。

## 0.4.5

### Patch Changes

- [#454](https://github.com/astryx-vue/astryx-vue/pull/454) [`463244a`](https://github.com/astryx-vue/astryx-vue/commit/463244ae0a4eba3f00a6daae9f6f175a88d63706) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 更新内置资料，收录主站新增的 ChartBrush 框选文档与示例。

## 0.4.4

### Patch Changes

- [#433](https://github.com/astryx-vue/astryx-vue/pull/433) [`dacf1fe`](https://github.com/astryx-vue/astryx-vue/commit/dacf1fe1fe16bd653cf15b78798e16819a292b29) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 内置组件资料补上 `Drawer` 与 `DrawerHeader`。

## 0.4.3

### Patch Changes

- [#417](https://github.com/astryx-vue/astryx-vue/pull/417) [`7b180bb`](https://github.com/astryx-vue/astryx-vue/commit/7b180bbf1e2317ab54c67569666e9d9f9e972a36) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 包内 README 收紧为安装、示例、程序调用和链接，完整命令说明只在文档站维护；维护步骤移到 `CONTRIBUTING.md`。文档站补上 `runCli` 的程序调用示例。

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`2e8b52c`](https://github.com/astryx-vue/astryx-vue/commit/2e8b52c461b64ef3b7ef2ef5580448e59a0dbe84) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 同步核心组件的文档目录，加入 Pagination 紧凑形态的首尾按钮说明。

- [#415](https://github.com/astryx-vue/astryx-vue/pull/415) [`5629b63`](https://github.com/astryx-vue/astryx-vue/commit/5629b6318eb987e314954d357c4bcb108709b182) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 同步核心组件目录，加入 `Item` 的首行对齐和 `List` 的边缘口径说明。

## 0.4.2

### Patch Changes

- [#277](https://github.com/astryx-vue/astryx-vue/pull/277) [`f779be6`](https://github.com/astryx-vue/astryx-vue/commit/f779be63cd21778a9d6d66be8b2c2772c6614194) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 更新内置文档与页面模板目录，补充 Charts 和 Lab 内容，同步近期表单、Dialog Wizard 等模板修复及各包最新发布信息。

## 0.4.1

### Patch Changes

- 命令行的组件目录补上了富文本（`@astryx-vue/richtext`）的文档页，`init` 现在把它当作已发布的包列出，并给出安装命令。目录生成时会跳过页面顶部的提示块（`::: warning`），摘要取正文第一段。

## 0.4.0

### Minor Changes

- [#230](https://github.com/astryx-vue/astryx-vue/pull/230) [`00def81`](https://github.com/astryx-vue/astryx-vue/commit/00def81329ff0f4fbe0882d83f23c94a95bd999b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `init`、`theme`、`upgrade`、`doctor` 四个命令，四个都只输出指引、不改项目文件；只有 `init` 会维护 `AGENTS.md`（或 `CLAUDE.md`、`.hermes.md`）里两个标记之间那一段属于我们的内容，标记之外的文字原样保留。
  
  - `init`：打印接入说明——要装哪些包、主题样式引哪一行、语言怎么提供、改完怎么验证；安装命令按项目实际用的包管理器写（`packageManager` 字段 → 锁文件，都没有就列出四种写法），然后刷新 agent 文件里的受管理区块。
  - `theme`：不带参数列出全部主题，每个一行说明；`theme <名字>` 输出这套主题的完整接入说明（引哪个样式表、`data-astryx-theme` 写什么、怎么换主题或局部并用、改完怎么验证）。
  - `upgrade`：读项目里 `@astryx-vue/core` 的版本，比这个 CLI 认的版本旧，就逐条列出要做的改动（变了什么、以前怎么写、现在怎么写），再在项目源码里找出可能要改的文件和行号；已经是最新就说不用升级。只读，不联网。
  - `doctor`：检查 core 装没装、版本对不对，themes 装没装，vue 是否 3.5 以上，主题样式表引了没有，`data-astryx-theme` 设了没有。只报告，有失败时退出码为 1。
  
  catalog 现在收多个包，`search` 的每条结果和 `component --list` 都会标出这个组件来自哪个包。`docs <主题> --depth <n>` 按标题层级截断（`--depth 2` 保留 `#` 和 `##`，更深的整段连同正文一起去掉），代码块里的 `#` 不会被当成标题。`template` 的输出会写明每个模板要装哪些依赖：可复制的模板只用 `vue` 和 `@astryx-vue/core`，`--list` 页脚直接说明「不用再装别的包」，详情、`--skeleton` 和 `--json` 也各带一份依赖列表。
  
  还没发布到 npm 的包（`richtext`、`lab`、`charts`）不会再被写成安装命令：`init` 和 `AGENTS.md` 区块里照样列名字，但会注明「还没发布到 npm」，不会给你一条 `pnpm add` 一个装不到的包的命令。

## 0.3.0

### Minor Changes

- [#120](https://github.com/astryx-vue/astryx-vue/pull/120) [`b203932`](https://github.com/astryx-vue/astryx-vue/commit/b203932ccd4bf48daf72d5c365a7eaf488499dfe) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `template` 和 `build` 命令。`build "<想法>"` 用本地关键词打分给出最接近的页面模板、两个备选和要用的组件，中文按字符二元组匹配，不联网也不调模型；`template --list` / `template <slug>` / `--skeleton` 分别列出、查看和只看骨架，`template <slug> <path>` 把模板写进项目（`--overwrite` 或 `-f` 才覆盖），并把演练场的演示图片地址换成灰色占位图、列出项目缺的包，不自动安装、不复制资源。53 个模板里有 5 个引用了项目装不上的包，标为不可复制，能读不能拷。`search --type` 增加 `template`。`init` 增加 `--agent hermes`、`--agent all` 和 `--agent-docs-path`，不加 `--agent` 时优先复用项目已有的 agent 文件；注入的区块改成三步工作流（`build` 挑页面、`template` 复制、写代码前查 `component`/`composable`/`docs`）。文档改正了运行方式：装好后直接 `npx astryx-vue …` 或 `pnpm exec astryx-vue …`，临时用 `npx @astryx-vue/cli …`，脚本别名退为可选。

### Patch Changes

- [#121](https://github.com/astryx-vue/astryx-vue/pull/121) [`4af177f`](https://github.com/astryx-vue/astryx-vue/commit/4af177f65ef47145f1de6736a76008d844be1772) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 安装包变小：catalog 里的示例代码只存一份（中英文共用同一份），命令输出和 `--json` 结构完全不变。

## 0.2.0

### Minor Changes

- [#115](https://github.com/astryx-vue/astryx-vue/pull/115) [`958c17b`](https://github.com/astryx-vue/astryx-vue/commit/958c17bd66db35b01a5d535943168789853bc128) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `composable` 和 `docs` 命令。`composable --list` 和 `composable <Name>` 查组合式函数，详情带参数、返回值和示例；`component --list` 不再混进组合式函数，`component useClipboard` 仍能查到并提示改用新命令。`docs` 列出全部指南和主题，`docs <topic>` 打印正文，接受 `guide/dark-mode`、`themes/tokens` 或唯一的短名字。`search` 把组合式函数单列为 `composable` 域，`--type` 可选 `component`、`composable`、`doc`。未知名字返回 `ERR_UNKNOWN_COMPOSABLE` 或 `ERR_UNKNOWN_TOPIC`，并带上相近的名字。

### Patch Changes

- [#84](https://github.com/astryx-vue/astryx-vue/pull/84) [`f9df031`](https://github.com/astryx-vue/astryx-vue/commit/f9df031010746d5c0b349d269e0a42d40de8e3fe) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 组件说明跟文档站用同一份来源。目录补上示例源码，嵌套的 props、插槽和事件表也会收进来。`pnpm check` 在目录过期，或 core 的组件导出没有文档时失败。

## 0.1.0

### Minor Changes

- [#79](https://github.com/astryx-vue/astryx-vue/pull/79) [`c076bea`](https://github.com/astryx-vue/astryx-vue/commit/c076bea16198312e3a151d045842664f87eecd0e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Add `@astryx-vue/cli` (`astryx-vue`) for component docs, search, a capability manifest, and `init --features agents`. The command text is generated from the docs site, not a second copy.
  
  `init --features agents` rewrites the managed block on every run and leaves text outside the markers in place.
