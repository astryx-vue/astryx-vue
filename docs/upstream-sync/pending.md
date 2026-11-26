<!-- 由 Upstream Sync 工作流生成。可以直接勾选、在条目下缩进两格写备注，下次生成会保留。 -->

# 上游待同步清单

上游范围：`v0.7.1..v0.7.17`，41 个组件族，5242 个提交。

逐条核实后再勾选：采纳的在条目下写上对应 PR；不适用的在条目下写明理由。Vue 版不机械照搬 React 实现。

## 基础展示与动作按钮（area:core）

### v0.7.2

- [x] [`efdc11077`](https://github.com/meta/astryx/commit/efdc11077) fix(Button): use aria-disabled instead of native disabled while busy-only (#4885)
  - Vue 版已有：忙碌但未禁用时用 aria-disabled（Button.vue isBusyOnlyDisabled）
- [x] [`374b53a9e`](https://github.com/meta/astryx/commit/374b53a9e) fix(Text): truncation tooltip follows changed content, not only resizes (#7611)
  - Vue 版已有：useTruncation 已用共享 MutationObserver 跟上内容变化
- [x] [`ab795478a`](https://github.com/meta/astryx/commit/ab795478a) docs(buttons): a caller onClick on a standalone ToggleButton runs first and can cancel the toggle (#7638)
  - Vue 版已有：ToggleButton 先发 click 再看 defaultPrevented，有测试；[#504](https://github.com/astryx-vue/astryx-vue/pull/504) 改正文档里的先后顺序
- [x] [`ba8046148`](https://github.com/meta/astryx/commit/ba8046148) docs(Avatar): list supported numeric sizes (#6283)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。Avatar、AvatarGroup 文档写明支持的数字尺寸和组尺寸覆盖规则
- [x] [`870a784be`](https://github.com/meta/astryx/commit/870a784be) fix(Text): skip truncation measurement when the truncation tooltip is off (#7697)
  - Vue 版已有：关掉提示时不测量，有测试
- [x] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
  - 已移植：[#514](https://github.com/astryx-vue/astryx-vue/pull/514)。CLI 搜索收录别家组件库叫法与常见图标名，动词只折叠进行时
- [x] [`38f84f662`](https://github.com/meta/astryx/commit/38f84f662) fix(AvatarGroupOverflow): expose static overflow role (#7736)
  - Vue 版已有：AvatarGroupOverflow 的 staticRole 默认 img，调用方 role 优先，已有测试
- [x] [`085e145df`](https://github.com/meta/astryx/commit/085e145df) fix(Token): keep remove target off adjacent text (#7728)
  - Vue 版已有：删除按钮 ::after 已是 inset: -4px，有测试锁住
- [x] [`5fb597d93`](https://github.com/meta/astryx/commit/5fb597d93) fix(core): build Unicode property regexes at runtime (#7767)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)。Unicode 属性正则改在运行时构造，有扫描测试守住

### v0.7.3

- [x] [`7b6691327`](https://github.com/meta/astryx/commit/7b6691327) spec(AST-085): disabled controls stay focusable (#7793)
  - 不适用：只是 AST-085 规范；已核对 Vue 的禁用卡片和复选框仍可聚焦
- [x] [`29ead9885`](https://github.com/meta/astryx/commit/29ead9885) fix(core): disabled links, tokens and cards stay focusable (#7842)
  - Vue 版已有：Link、ClickableCard 禁用时已用 aria-disabled 并保留 Tab 焦点；[#499](https://github.com/astryx-vue/astryx-vue/pull/499) 补了 ClickableCard 文档；Token 部分见 token 组
- [x] [`05bfcc507`](https://github.com/meta/astryx/commit/05bfcc507) spec(Carousel): edge focus moves to the scroll area (#7917)
  - 不适用：只加上游规范记录；用尽的按钮隐藏、不可 Tab、焦点交给滚动区，Vue 版已有
- [x] [`0fd4f9eb4`](https://github.com/meta/astryx/commit/0fd4f9eb4) fix(Button): mount the loading live region empty when a Button first renders loading (#7870)
  - Vue 版已有：live region 先空挂载、下一帧写入（Button.vue isLiveRegionReady，有测试）
- [x] [`3317fb2a0`](https://github.com/meta/astryx/commit/3317fb2a0) test(a11y): align disabled card and checkbox oracles with focus contract (#7921)
  - Vue 版已有：禁用卡片、复选框仍可聚焦；[#504](https://github.com/astryx-vue/astryx-vue/pull/504) 给 CheckboxList 补了测试

### v0.7.4

- [x] [`13df1cecf`](https://github.com/meta/astryx/commit/13df1cecf) fix(Carousel): a run-out edge button hands focus to the scroll area (#7926)
  - Vue 版已有：Carousel.vue 监听 canScrollStart/End，焦点交给滚动区且不滚动；文档旧说法在 [#498](https://github.com/astryx-vue/astryx-vue/pull/498) 改正
- [x] [`10b832e02`](https://github.com/meta/astryx/commit/10b832e02) fix(DropdownMenuSubMenu, Thumbnail, ChatMessageList): silence the busy Spinner and announce the busy start once (#7950)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。Thumbnail 上传转圈静音，每次开始播报一次；菜单与对话列表部分不属本族

### v0.7.5

- [x] [`ad2646109`](https://github.com/meta/astryx/commit/ad2646109) spec(AST-087): icon variants, theme sizes, and componentIcons state resolvers (#7847)
  - 不适用：上游 AST-087 规范文档，对应实现已逐条移植
- [x] [`10930261f`](https://github.com/meta/astryx/commit/10930261f) docs(Badge): mark label as required, as its props type is (#8008)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。文档补上 label（与默认插槽二选一）
- [x] [`a88f185a1`](https://github.com/meta/astryx/commit/a88f185a1) fix(core): a card's press overlay paints a finger's press (#8057)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。ClickableCard 按压规则排在悬停之后，按压期间不做颜色过渡
- [x] [`1eb6cce41`](https://github.com/meta/astryx/commit/1eb6cce41) docs(spec): Badge records its shipped contract as current (#8263)
  - 不适用：只改上游 Badge.spec.md
- [x] [`e52ef25f2`](https://github.com/meta/astryx/commit/e52ef25f2) [Component Audit] ComplexSelector: the trigger is a combobox field on both paths (#6991)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)。ComplexSelector 两种触发器都是 combobox
- [x] [`eb2a556f5`](https://github.com/meta/astryx/commit/eb2a556f5) docs(spec): Token records its shipped contract as current (#8295)
  - 不适用：只改上游 Token spec
- [x] [`52212530f`](https://github.com/meta/astryx/commit/52212530f) docs(spec): Button records its shipped contract as current (#8264)
  - 不适用：只改上游 Button.spec.md
- [x] [`37c057574`](https://github.com/meta/astryx/commit/37c057574) docs(spec): IconButton records its shipped contract as current (#8395)
  - 不适用：只改上游 IconButton.spec.md
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：上游 CI 自动发现浏览器无障碍用例的工作流改动
- [x] [`268f109a6`](https://github.com/meta/astryx/commit/268f109a6) docs(spec): ButtonGroup records its shipped contract as current (#8407)
  - 不适用：只改上游 ButtonGroup.spec.md
- [x] [`23de0923e`](https://github.com/meta/astryx/commit/23de0923e) spec(AST-094): touch presentations feel native by default (#8409)
  - 不适用：只改上游规范文档
- [x] [`b023d1c82`](https://github.com/meta/astryx/commit/b023d1c82) spec(AST-102): typography stays theme-owned, and a text size the person set wins (#8351)
  - 不适用：上游排版规范文档
- [x] [`6b46afaa9`](https://github.com/meta/astryx/commit/6b46afaa9) fix(InputGroup): propagate disabled state to inputs and addons (#8414)
  - 已移植：[#504](https://github.com/astryx-vue/astryx-vue/pull/504)。InputGroup 禁用传给输入框与附加件，嵌套组继承
- [x] [`2675ef169`](https://github.com/meta/astryx/commit/2675ef169) docs(spec): Avatar records its shipped contract as current (#8421)
  - 不适用：只改上游 Avatar spec
- [x] [`e9b3f3eda`](https://github.com/meta/astryx/commit/e9b3f3eda) fix(InputGroup): the group edge rules name members, not a universal selector (#8438)
  - Vue 版已有：InputGroup 由外层容器画边框，没有通配选择器的边缘规则
- [x] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
  - 已移植：[#517](https://github.com/astryx-vue/astryx-vue/pull/517)。core 新增默认状态色表（有防漂移测试），defineTheme 为自定义主题推导 on/text/on-muted 角色；组件改读正确的状态角色
- [x] [`f042c6ebd`](https://github.com/meta/astryx/commit/f042c6ebd) docs(spec): Link records its shipped contract as current (#8455)
  - 不适用：只改上游内部规范文档
- [x] [`21cab0e6f`](https://github.com/meta/astryx/commit/21cab0e6f) docs(spec): AvatarGroup records its shipped contract as current (#8450)
  - 不适用：只改上游 AvatarGroup spec
- [x] [`3c1e876b6`](https://github.com/meta/astryx/commit/3c1e876b6) docs(spec): Thumbnail records its shipped contract as current (#8503)
  - 不适用：只改上游 Thumbnail spec
- [x] [`0aec0eebf`](https://github.com/meta/astryx/commit/0aec0eebf) docs(spec): Blockquote records its shipped contract as current (#8539)
  - 不适用：只改上游 Blockquote spec
- [x] [`bb12cfbd6`](https://github.com/meta/astryx/commit/bb12cfbd6) fix(Thumbnail): Open and Remove stay mounted while they cannot act (#8542)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。Thumbnail 的 Open/Remove 不能操作时仍挂载，标 aria-disabled
- [x] [`eca08cd21`](https://github.com/meta/astryx/commit/eca08cd21) docs(spec): Heading records its shipped contract as current (#8651)
  - 不适用：上游 Heading 规范文档
- [x] [`a4ca90cc3`](https://github.com/meta/astryx/commit/a4ca90cc3) docs(spec): Text records its shipped contract as current (#8664)
  - 不适用：上游 Text 规范文档
- [x] [`c01521cf9`](https://github.com/meta/astryx/commit/c01521cf9) spec(AST-094, AST-057): gestures work on the web for every pointer (FR43) (#8646)
  - 不适用：只改上游规范与架构文档
- [x] [`ab0db1f73`](https://github.com/meta/astryx/commit/ab0db1f73) spec(AST-108): theme motion is three knobs — tempo, character, reducedMotion (#8613)
  - 不适用：上游 AST-108 motion 规范文档
- [x] [`c86dc620c`](https://github.com/meta/astryx/commit/c86dc620c) fix(i18n): catch formatter returns and localize helper text (#7849)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)。Kbd 键名、FileInput 大小单位、粘贴文本计数改读内置文案
- [x] [`05ead02aa`](https://github.com/meta/astryx/commit/05ead02aa) feat(Icon): a theme icon entry can be a function of the requested size (#8753)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。主题图标条目可写成 {size, variant} 的函数
- [x] [`db584bcb0`](https://github.com/meta/astryx/commit/db584bcb0) feat(Icon): a theme's width and height on an Icon size set its glyph dimension (#8759)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。主题 Icon 尺寸的宽高经派生变量决定字形尺寸
- [x] [`dae174730`](https://github.com/meta/astryx/commit/dae174730) feat(theme): a theme lists its icon variant names once (#8756)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。defineTheme({iconVariants})，变体名有类型推断
- [x] [`33645a2d2`](https://github.com/meta/astryx/commit/33645a2d2) feat(Icon): request a theme's alternate icon artwork with variant (#8758)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。Icon 新增 variant 属性
- [x] [`b39314411`](https://github.com/meta/astryx/commit/b39314411) spec(family): action groups — press, slide across, act on lift (AST-094 FR26–FR28) (#8622)
  - 不适用：只改上游规范与 families 文档；用户可见说明随 [#509](https://github.com/astryx-vue/astryx-vue/pull/509) 补进文档
- [x] [`820769dd7`](https://github.com/meta/astryx/commit/820769dd7) docs(action-groups): the nav menus adopt the menu press model (#8801)
  - 不适用：只改上游 families 与架构文档

### v0.7.6

- [x] [`13669e9ed`](https://github.com/meta/astryx/commit/13669e9ed) perf(Text): truncation measures once after the commit, in a microtask, not inside it (#9013)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。第一次测量放到渲染提交之后
- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：上游 Playwright 覆盖检查的分片方式
- [x] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
  - 不适用：React 版 esbuild 打包入口的问题
- [x] [`9e7c02cdd`](https://github.com/meta/astryx/commit/9e7c02cdd) fix(Avatar): in forced colors the initials take the color around them (#8819)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。强制配色下单独头像的首字母和默认图标用 currentColor
- [x] [`04e0e5225`](https://github.com/meta/astryx/commit/04e0e5225) fix(Badge): a badge grows with its text (#8236)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。有文字的 Badge 加 min-height: 1lh，随字号长高
- [x] [`fa3f76030`](https://github.com/meta/astryx/commit/fa3f76030) docs(spec): Kbd records its shipped contract as current (#9096)
  - 不适用：只改上游 Kbd.spec.md
- [x] [`26784d22e`](https://github.com/meta/astryx/commit/26784d22e) fix(Carousel): the scroll area is a named group, a tab stop only while it overflows (#8155)
  - 已移植：[#498](https://github.com/astryx-vue/astryx-vue/pull/498)。滚动区是命名 group，只在溢出时可 Tab，内容变化后重新测量
- [x] [`2782f9903`](https://github.com/meta/astryx/commit/2782f9903) fix(Link): maxLines truncates inside a line narrower than the link (#9059)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。maxLines 时 min-width: 0，max-width: 100% 移到根元素
- [x] [`a9c205da8`](https://github.com/meta/astryx/commit/a9c205da8) fix(Token): a disabled token exposes its state, and a disabled link token stays a focusable link (#9037)
  - 已移植：[#500](https://github.com/astryx-vue/astryx-vue/pull/500)。禁用 Token 带 data-disabled；禁用链接型 Token 仍是可聚焦的链接
- [x] [`8f9fce156`](https://github.com/meta/astryx/commit/8f9fce156) docs(spec): Citation records its shipped contract as current (#9132)
  - 不适用：只改上游 Citation.spec.md
- [x] [`b2e79c45d`](https://github.com/meta/astryx/commit/b2e79c45d) fix(Typeahead): the value token's button is named by the field label and the value (#9049)
  - 已移植：[#512](https://github.com/astryx-vue/astryx-vue/pull/512)。Typeahead 值 Token 按钮用「字段标签 + 值」命名
- [x] [`eca51a83c`](https://github.com/meta/astryx/commit/eca51a83c) fix(core): a caller's data-color no longer replaces Link's reflected data-color (#9157)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。根元素反射 data-color，调用方同名值盖不掉
- [x] [`7ef23f2c3`](https://github.com/meta/astryx/commit/7ef23f2c3) fix(core): ReactNode slots use isRenderable for 'renders nothing' (#9160)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)。hasSlotContent 判空；DropdownMenuGroup 标题插槽为空时不画
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游规范文档换目录
- [x] [`26ce561a4`](https://github.com/meta/astryx/commit/26ce561a4) fix(core): a Token with an href now calls a caller's onClick (#9205)
  - 已移植：[#500](https://github.com/astryx-vue/astryx-vue/pull/500)。带 href 的 Token 点链接时调用 click
- [x] [`d1e5cc4bb`](https://github.com/meta/astryx/commit/d1e5cc4bb) [Component Audit] Heading: outline levels and styling precedence are pinned, and every prop is documented (#9328)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。Heading 部分：调用方 aria-level 优先
- [x] [`350ee2eb9`](https://github.com/meta/astryx/commit/350ee2eb9) docs(spec): GridSpan and Heading verification maps name the checks that now cover them (#9349)
  - 不适用：上游验证映射文档
- [x] [`0fad9d216`](https://github.com/meta/astryx/commit/0fad9d216) test(rtl): RTL coverage for Blockquote, InputGroupText and Overlay (#9309)
  - 不适用：只改上游 RTL 审计清单与 spec
- [x] [`3d44c583a`](https://github.com/meta/astryx/commit/3d44c583a) fix(Tooltip, HoverCard): a press inside an open surface doesn't activate the card, row or field around it (#9252)
  - 已移植：[#512](https://github.com/astryx-vue/astryx-vue/pull/512)。Tooltip/HoverCard 气泡内按下不激活外层卡片、行、字段
- [x] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。不截断的 Text/Heading 里长串会换行，浮层根重置
- [x] [`e3bd3d547`](https://github.com/meta/astryx/commit/e3bd3d547) fix(ButtonGroup, InputGroup): the last-member rule is :nth-last-child(1 of S), not a sibling-relative :has() (#9394)
  - 已移植：[#504](https://github.com/astryx-vue/astryx-vue/pull/504)。ButtonGroup 末尾成员用 :nth-last-child(1 of S)
- [x] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
  - 已移植：[#515](https://github.com/astryx-vue/astryx-vue/pull/515)。组件只按自己的命名空间读内置文案，单独引入一个组件时不再带上全部组件的文案；显示文字和 provider API 不变，有打包测试守住
- [x] [`b5e716687`](https://github.com/meta/astryx/commit/b5e716687) refactor(Item, Token, ChatComposer): drop the per-site tooltip surface checks the layer boundary replaces (#9531)
  - 不适用：上游靠 React 合成事件在浮层根截停冒泡，Vue 按 DOM 冒泡仍需登记表

### v0.7.7

- [x] [`271bd70d3`](https://github.com/meta/astryx/commit/271bd70d3) fix(Link): a button Link lines up its wrapped text like an anchor Link (#9584)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。根元素 text-align: inherit，按钮形态换行与锚点对齐
- [x] [`322c0d6e6`](https://github.com/meta/astryx/commit/322c0d6e6) fix(Button, Tab, Tokenizer and more): slots follow isRenderable; no truthy-guard baseline (#9501)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)。Button、Tab、SegmentedControl、Breadcrumb、Avatar 的空插槽不画包裹元素
- [x] [`13acdeb7d`](https://github.com/meta/astryx/commit/13acdeb7d) fix(Token): a removable token cut by its width keeps its remove button at full size (#9621)
  - Vue 版已有：删除按钮已有 flex: none，宽度不够只截标签
- [x] [`e68774f5b`](https://github.com/meta/astryx/commit/e68774f5b) fix(PowerSearch): name a filter token by its visible text and expose its editor (#9687)
  - 已移植：[#512](https://github.com/astryx-vue/astryx-vue/pull/512)。PowerSearch 筛选标签按可见文字命名并暴露编辑器
- [x] [`bec12a3b2`](https://github.com/meta/astryx/commit/bec12a3b2) fix(Button): a tooltip that repeats the accessible name adds no description (#9681)
  - 已移植：[#494](https://github.com/astryx-vue/astryx-vue/pull/494)
- [x] [`3615956e2`](https://github.com/meta/astryx/commit/3615956e2) fix(gestures): pens and pointer-read fingers get the blur refusal and the pinch rule of the Touch Events path (#8309)
  - 不适用：上游 GestureHost 的 Touch/Pointer 通路规则，Vue 版无此宿主

### v0.7.8

- [x] [`d43f40785`](https://github.com/meta/astryx/commit/d43f40785) fix(AlertDialog): a press that slides between the actions runs the one it lifts on (#8083)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。AlertDialog 按住滑动，在松手的按钮上执行
- [x] [`9ee4282db`](https://github.com/meta/astryx/commit/9ee4282db) [Component Audit] Icon: labelled icons from icon libraries reach screen readers (#9738)
  - Vue 版已有：带 label 时 role=img 与 aria-label 落在外层
- [x] [`89255718a`](https://github.com/meta/astryx/commit/89255718a) [Component Audit] IconButton: every prop is documented, and square targets are proven in a browser (#9757)
  - Vue 版已有：IconButton 文档已列全部 props
- [x] [`cf8e4e04a`](https://github.com/meta/astryx/commit/cf8e4e04a) docs(specs): Icon and IconButton verification maps name their current tests and receipts (#9780)
  - 不适用：上游 verification map 文档
- [x] [`bb3838b6f`](https://github.com/meta/astryx/commit/bb3838b6f) fix(AlertDialog): a mouse press on the actions acts natively again (#9771)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。组只跟踪手指和笔，鼠标保持原生行为
- [x] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
  - 不适用：只给 React useEffect 加注释
- [x] [`a7e7d4516`](https://github.com/meta/astryx/commit/a7e7d4516) docs(Icon): the color doc type lists the palette; native keeps the semantic set (#9821)
  - Vue 版已有：IconColor 类型与文档已列完整调色板
- [x] [`3090f9833`](https://github.com/meta/astryx/commit/3090f9833) fix(Icon): ref reaches the rendered svg for every name (#9782)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。Icon 暴露 element 与 svg
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：上游 Playwright 浏览器上下文的网络隔离

### v0.7.9

- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：上游审计用例 --repeat-each 的证据目录
- [x] [`67ad50980`](https://github.com/meta/astryx/commit/67ad50980) fix(core): a finger press on a control inside a list row, TreeList row or Token shows no press on it (#9959)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。手指按在行、Token、卡片里的控件上时，外层容器不亮
- [x] [`3d225c35b`](https://github.com/meta/astryx/commit/3d225c35b) feat(core): under a finger a pressable highlights at touch-down outside scroll views (#9765)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。滚动视图外手指落下即高亮
- [x] [`504ee1863`](https://github.com/meta/astryx/commit/504ee1863) fix(theme): the stock theme's dark-mode accent is darker, so white button text meets 4.5:1 (#9818)
  - 已移植：[#506](https://github.com/astryx-vue/astryx-vue/pull/506)。accent 文字改用 text-accent；暗色 accent 默认值在主题包 CSS，不适用
- [x] [`7f8de290c`](https://github.com/meta/astryx/commit/7f8de290c) fix(core): a press's release fades on the theme's exit motion tokens (#9890)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。按主题退出动效淡出（已有），减少动态效果时最多 200ms
- [x] [`f384e62f5`](https://github.com/meta/astryx/commit/f384e62f5) docs(useIcon): add hook docs and a status row example block (#9900)
  - Vue 版已有：useSemanticIcon 已有文档，[#502](https://github.com/astryx-vue/astryx-vue/pull/502) 补了按 md 读取
- [x] [`7b831ae03`](https://github.com/meta/astryx/commit/7b831ae03) docs(useLinkComponent): add hook docs and an article card example block (#9901)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。LinkProvider 文档加 useLinkComponent 示例
- [x] [`98efdf183`](https://github.com/meta/astryx/commit/98efdf183) feat(Icon): a theme maps a component's own icon role by slot, starting with CodeBlock's copy button (#9828)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。defineTheme({componentIcons}) 与 ComponentIcon；CodeBlock 复制按钮走槽位
- [x] [`b779b269c`](https://github.com/meta/astryx/commit/b779b269c) spec(Carousel): opt-in snap paging through useSnapPaging (#9666)
  - 不适用：只有上游规范和架构文档
- [x] [`d7a7dd3bb`](https://github.com/meta/astryx/commit/d7a7dd3bb) feat(Timestamp): the hover card's copy button resolves its glyph through the timestamp-copy icon slot (#9830)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。Timestamp 复制按钮走 timestamp-copy 槽位
- [x] [`f85b20173`](https://github.com/meta/astryx/commit/f85b20173) feat(Table): the sort indicator resolves its glyph through the table-sort-indicator icon slot (#9831)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。Table 排序指示走 table-sort-indicator 槽位
- [x] [`c037450fc`](https://github.com/meta/astryx/commit/c037450fc) feat(Table): the row-expansion toggle resolves its glyph through the table-row-expand icon slot (#9834)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。Table 行展开走 table-row-expand 槽位
- [x] [`34feb1c48`](https://github.com/meta/astryx/commit/34feb1c48) test(Link): count a new tab when the page opens it, not after a 500 ms wait (#10157)
  - 不适用：上游 Playwright 测试调整
- [x] [`ddb8b3462`](https://github.com/meta/astryx/commit/ddb8b3462) feat(ButtonGroup): a finger's slide runs the button it lifts on (#8657)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。ButtonGroup 手指滑动在松手处执行
- [x] [`eaea67de3`](https://github.com/meta/astryx/commit/eaea67de3) fix(Link): a hovered label takes the root's hover color, matching its underline and icon (#10142)
  - Vue 版已有：标签是继承根元素颜色的 span，悬停颜色本就一致
- [x] [`5985abc13`](https://github.com/meta/astryx/commit/5985abc13) fix(core): no press scale or card color fade under reduced motion (#8326)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。减少动态效果时不缩放、卡片不做颜色过渡

### v0.7.10

- [x] [`e8ecde4ff`](https://github.com/meta/astryx/commit/e8ecde4ff) fix(core): a button's touch press release runs on the compositor (#9783)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。粗指针下按压画在 ::before 上，抬手淡出走合成层
- [x] [`f81f09df3`](https://github.com/meta/astryx/commit/f81f09df3) fix(CodeBlock, Carousel): the code viewport and the scroller draw the shared focus ring (#8875)
  - 已移植：[#498](https://github.com/astryx-vue/astryx-vue/pull/498)。焦点环画在根节点覆盖层上；CodeBlock 视口用共享焦点环
- [x] [`07f8de58c`](https://github.com/meta/astryx/commit/07f8de58c) feat(core): Carousel's hasSnap takes useSnapPaging(), iOS paging on native snap's stops (#8153)
  - 已移植：[#518](https://github.com/astryx-vue/astryx-vue/pull/518)。新增 useSnapPaging，Carousel 的 hasSnap 接受它：手指或触控板横扫按速度选页、一次最多一页
- [x] [`d88dff821`](https://github.com/meta/astryx/commit/d88dff821) docs(ButtonGroup): drop the rule that arrows skip disabled members (#10203)
  - 已移植：[#504](https://github.com/astryx-vue/astryx-vue/pull/504)。文档删掉“方向键跳过禁用成员”的承诺
- [x] [`6da9b3244`](https://github.com/meta/astryx/commit/6da9b3244) fix(core): render plain Link anchors inline so an ancestor Text clamp can truncate them (#6038)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。Text 提供截断上下文，锚点 Link 在会截断的 Text 里变为行内
- [x] [`af701d242`](https://github.com/meta/astryx/commit/af701d242) lint: add no-prevent-default-in-passive-react-handler (#10248)
  - 不适用：React 被动事件处理器的 lint 规则

### v0.7.11

- [x] [`5c71dee92`](https://github.com/meta/astryx/commit/5c71dee92) fix(Carousel): Shift and a wheel notch scroll the row once (#10246)
  - 已移植：[#498](https://github.com/astryx-vue/astryx-vue/pull/498)。一格滚轮只滚一次（Vue 版已有）；只在溢出时挂监听、监听不读布局
- [x] [`6d0940f22`](https://github.com/meta/astryx/commit/6d0940f22) [Component Audit] Kbd: key badges grow with larger text (#10267)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。Kbd 键帽 min-height: 1lh
- [x] [`28dda9399`](https://github.com/meta/astryx/commit/28dda9399) chore(Carousel): the wheel listener's comment says when it reads layout (#10281)
  - 已移植：[#498](https://github.com/astryx-vue/astryx-vue/pull/498)。注释措辞随上一条写入
- [x] [`20f7d2d3b`](https://github.com/meta/astryx/commit/20f7d2d3b) fix(core): Avatar initials paint in primary text on the neutral tint (#10205)
  - Vue 版已有：avatar.css 首字母颜色本就是 text-primary
- [x] [`c48bb2334`](https://github.com/meta/astryx/commit/c48bb2334) fix(core): a labelled Button keeps its name in macOS 14 WebKit (#10256)
  - 已移植：[#494](https://github.com/astryx-vue/astryx-vue/pull/494)
- [x] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)
  - 已移植：[#516](https://github.com/astryx-vue/astryx-vue/pull/516)。新增触控热区设施：粗指针下按钮热区向 44px 扩大，夹紧到与邻居间距的一半；ButtonGroup、ToggleButtonGroup 成员共用组热区

### v0.7.12

- [x] [`360701de7`](https://github.com/meta/astryx/commit/360701de7) fix(Text, Heading): the truncation tooltip mounts on the first hover, tap or focus (#10290)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。截断提示在第一次悬停、轻点或聚焦时才挂载
- [x] [`b1327c020`](https://github.com/meta/astryx/commit/b1327c020) test: watch before the action at 28 first-contact waits (#10286)
  - 不适用：上游 Playwright 测试
- [x] [`6cbcbf846`](https://github.com/meta/astryx/commit/6cbcbf846) fix(core): a press inside a scroll view highlights 150 ms after touch (#10260)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。滚动视图内 150ms 从触摸事件时间戳算起
- [x] [`72a355851`](https://github.com/meta/astryx/commit/72a355851) fix(Carousel): under snap paging, the edge buttons follow the held row (#10359)
  - 已移植：[#518](https://github.com/astryx-vue/astryx-vue/pull/518)。按住时边缘按钮、渐隐跟随被按住的行
- [x] [`c3cef9f67`](https://github.com/meta/astryx/commit/c3cef9f67) docs(records): Kbd, LayerProvider and theming-surface verification follow-ups (#10299)
  - 不适用：只改上游 spec 与架构记录
- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：上游 interaction-harness 测试脚手架
- [x] [`78df0c20b`](https://github.com/meta/astryx/commit/78df0c20b) fix(Carousel): under snap paging, scroll calls move through the paging (#10384)
  - 已移植：[#518](https://github.com/astryx-vue/astryx-vue/pull/518)。边缘按钮、方向键和 scroll 调用都走分页
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 已移植：[#496](https://github.com/astryx-vue/astryx-vue/pull/496)。Button 不再用原生 disabled；ButtonGroup、Toolbar 整组禁用保留一个 Tab 停靠点；Carousel 隐藏按钮 inert；lab ListInput 禁用时不重排
- [x] [`ed862ea90`](https://github.com/meta/astryx/commit/ed862ea90) test(Button): the press-release storyboard arms its hold first (#10479)
  - 不适用：上游 Playwright 测试
- [x] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
  - 不适用：React context 多副本问题
- [x] [`c8b4cba38`](https://github.com/meta/astryx/commit/c8b4cba38) test(Button, gestures): arm press holds and blocks before the gesture (#10521)
  - 不适用：上游 Playwright 测试
- [x] [`209e06765`](https://github.com/meta/astryx/commit/209e06765) fix(Carousel): an edge button changes in the frame the held row leaves (#10523)
  - 已移植：[#518](https://github.com/astryx-vue/astryx-vue/pull/518)。边缘按钮在行离开边缘的同一帧切换
- [x] [`62bc7a2fe`](https://github.com/meta/astryx/commit/62bc7a2fe) fix(core): a swizzled copy shares the animated-layout, code-language and snap-paging brands (#10576)
  - 不适用：Vue 版没有 animated-layout 句柄、代码语言品牌值和 snap paging
- [x] [`fac363ee8`](https://github.com/meta/astryx/commit/fac363ee8) fix(Kbd): ctrl, alt, shift and meta show text off Apple platforms (#10524)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。非 Apple 平台修饰键显示文字
- [x] [`9218a4598`](https://github.com/meta/astryx/commit/9218a4598) fix(SnapPaging): a stop within half a step of the end is the end page (#10591)
  - 已移植：[#518](https://github.com/astryx-vue/astryx-vue/pull/518)。离末端不到半步的停点并进最后一页
- [x] [`7bc8230f8`](https://github.com/meta/astryx/commit/7bc8230f8) fix(Button): a labelled button grows with its label (#10588)
  - Vue 版已有：button.css 的 height: max(尺寸, 1lh)，纯图标按钮固定高度
- [x] [`611382ee1`](https://github.com/meta/astryx/commit/611382ee1) feat(lab): add LineClamp — clamp arbitrary content to N lines (#4259)
  - 已移植：[#511](https://github.com/astryx-vue/astryx-vue/pull/511)。lab 新增 LineClamp
- [x] [`8e526d661`](https://github.com/meta/astryx/commit/8e526d661) fix(Kbd): meta shows ⌘ on Apple platforms (#10528)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。Apple 平台 meta 显示 ⌘
- [x] [`f75f0f2d3`](https://github.com/meta/astryx/commit/f75f0f2d3) feat(ToggleButtonGroup): a finger's slide toggles the one it lifts on (#8660)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。ToggleButtonGroup 只切换松手处的成员
- [x] [`544442239`](https://github.com/meta/astryx/commit/544442239) fix(Button): at the default text size a labelled button renders exactly as before (#10678)
  - Vue 版已有：同上，默认字号下渲染不变
- [x] [`8f8b3db65`](https://github.com/meta/astryx/commit/8f8b3db65) perf(Text): take a new text's first truncation measurement from the shared observer (#10668)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。第一次测量取自共享 ResizeObserver 的首次通知
- [x] [`c5cc8f4c4`](https://github.com/meta/astryx/commit/c5cc8f4c4) docs(useLinkify): add hook docs and a comment-thread example block (#9969)
  - 不适用：Vue 版没有 useLinkify
- [x] [`97e46f151`](https://github.com/meta/astryx/commit/97e46f151) test(Button): judge the release end on the page's clock (#10853)
  - 不适用：上游 Playwright 测试
- [x] [`bf13b026e`](https://github.com/meta/astryx/commit/bf13b026e) fix(Avatar): an interactive initials avatar passes Label in Name (#10816)
  - Vue 版已有：首字母由 ::before 生成内容画出并带空替代文字
- [x] [`00e031a31`](https://github.com/meta/astryx/commit/00e031a31) fix(Avatar): no public data-initials attribute; the initials come from a private StyleX dynamic style (#10944)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。去掉公开 data-initials，改用私有 CSS 变量

### v0.7.13

- [x] [`841b486ff`](https://github.com/meta/astryx/commit/841b486ff) [Component Audit] Link: a disabled link stays announced as disabled when a caller passes aria-disabled or role (#11030)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。禁用时 role/aria-disabled 由 Link 决定，保留调用方 tabindex；启用时调用方属性透传
- [x] [`1e214aaf9`](https://github.com/meta/astryx/commit/1e214aaf9) test(Link): honor Markdown's data URL policy in navigation coverage (#11066)
  - 不适用：上游 Playwright 导航测试调整
- [x] [`3d24c4e9f`](https://github.com/meta/astryx/commit/3d24c4e9f) test(Carousel): a flick read below the paging's speed fails by name (#10980)
  - 不适用：只改 snap paging 的 Playwright 测试

### v0.7.14

- [x] [`ba460c003`](https://github.com/meta/astryx/commit/ba460c003) test(Button): time a touch release from its animation's late start (#10975)
  - 不适用：上游 Playwright 测试
- [x] [`7c8a2e23b`](https://github.com/meta/astryx/commit/7c8a2e23b) docs(useTruncation): add hook docs and a live table cell truncation example block (#10555)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。公开导出 useTruncation 并补文档
- [x] [`f810d1ad6`](https://github.com/meta/astryx/commit/f810d1ad6) [Component Audit] LinkProvider: router setup docs name the to prop its component receives (#11065)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。LinkProvider 文档补插槽与优先级说明
- [x] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
  - 不适用：React Server Components 的 'use client' 指令
- [x] [`fc9fb8ccc`](https://github.com/meta/astryx/commit/fc9fb8ccc) fix(core): registered icons reach swizzled copies; icon and theme registries are one per React (AST-110 FR3) (#11096)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。图标注册表挂到 globalThis，多份副本共享
- [x] [`7eab4d5ab`](https://github.com/meta/astryx/commit/7eab4d5ab) docs(Link): a caller tabIndex keeps the enabled focus order (AST-085 FR1); name the disabled-focus gap (#11125)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。调用方 tabindex 保持启用时的焦点顺序，有测试
- [x] [`05da5aab6`](https://github.com/meta/astryx/commit/05da5aab6) fix(Button): a disabled submit or reset Button cannot act on its form before hydration (#11107)
  - 已移植：[#494](https://github.com/astryx-vue/astryx-vue/pull/494)，挂载前渲染成 type="button"
- [x] [`179767d1c`](https://github.com/meta/astryx/commit/179767d1c) docs(buttons): a disabled Button renders aria-disabled, never native disabled (#11147)
  - Vue 版已有：禁用 Button 只用 aria-disabled，行为与文档已在 [#496](https://github.com/astryx-vue/astryx-vue/pull/496) 落地
- [x] [`b9551ab78`](https://github.com/meta/astryx/commit/b9551ab78) docs(ButtonGroup): the Tab stop stays on a disabled member when every member is disabled (#11158)
  - 已移植：[#504](https://github.com/astryx-vue/astryx-vue/pull/504)。行为在 #496；#504 文档写明全组禁用时 Tab 停靠点留在一个禁用成员上
- [x] [`c2f12feab`](https://github.com/meta/astryx/commit/c2f12feab) fix(Carousel): the scroll buttons sit inside the scroller's focus ring (#10726)
  - 已移植：[#498](https://github.com/astryx-vue/astryx-vue/pull/498)。滚动按钮收进焦点环以内
- [x] [`db3e8334f`](https://github.com/meta/astryx/commit/db3e8334f) fix(core): InputGroupText, Badge and Token keep caller text in its written order under RTL (#10114)
  - 已移植：[#500](https://github.com/astryx-vue/astryx-vue/pull/500)。Token、Badge、InputGroupText 的文字在 RTL 下保持书写顺序
- [x] [`c6614a5e8`](https://github.com/meta/astryx/commit/c6614a5e8) ci: release-specs (changed) adds tagged specs, visited components and Lab-only pull requests, in shards (#11171)
  - 不适用：上游 release-specs CI 分片

### v0.7.15

- [x] [`ac1a569b2`](https://github.com/meta/astryx/commit/ac1a569b2) fix(Tokenizer): removing a token with a finger leaves the keyboard down (#8160)
  - 已移植：[#512](https://github.com/astryx-vue/astryx-vue/pull/512)。手指删除 token 时键盘不弹出
- [x] [`2e205e4d9`](https://github.com/meta/astryx/commit/2e205e4d9) fix(Link, richtext): linear-time email autolink matching (#11306)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。richtext 邮箱匹配改为线性时间；Vue 版没有 useLinkify
- [x] [`807dc2ead`](https://github.com/meta/astryx/commit/807dc2ead) refactor(core): name the nested press rule for every pointer it covers (#11304)
  - 不适用：上游只改名与挪样式，无行为变化
- [x] [`eec79323c`](https://github.com/meta/astryx/commit/eec79323c) fix(Text, Tooltip): on Android, the first tap on a button or link in truncated text opens its tooltip; a tap on a text field never does (#11213)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。只认 :focus-visible 焦点；轻点文本框不开关提示

### v0.7.16

- [x] [`9d2ce46c7`](https://github.com/meta/astryx/commit/9d2ce46c7) docs(core): playground defaults for eight components and sample items for four group playgrounds (#11351)
  - Vue 版已有：演练场初始值本就是真实示例
- [x] [`b300313cb`](https://github.com/meta/astryx/commit/b300313cb) feat(Lightbox): a gallery's caption sits in a two-line band (#9810)
  - 已移植：[#507](https://github.com/astryx-vue/astryx-vue/pull/507)。Lightbox 图集图注占两行区域，可展开收起；MediaTheme、拖拽淡出等依赖设施未跟
- [x] [`36ed7cc4b`](https://github.com/meta/astryx/commit/36ed7cc4b) fix(useContainerReveal): a touchscreen laptop used with a mouse reveals on hover (#11218)
  - Vue 版已有：useContainerReveal 用 (pointer: coarse)，已有测试
- [x] [`9bdbcb16f`](https://github.com/meta/astryx/commit/9bdbcb16f) fix(Button, Popover, Dialog): keep an edge in forced-colors mode (#7677)
  - 已移植：[#504](https://github.com/astryx-vue/astryx-vue/pull/504)。强制配色下危险按钮、按钮组接缝、Popover、菜单、Dialog 的边补齐

### v0.7.17

- [x] [`55e666665`](https://github.com/meta/astryx/commit/55e666665) fix(core): no press scale on a trigger whose own layer is open (#11062)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。Button 自身弹层打开时不缩放
- [x] [`b9ef39954`](https://github.com/meta/astryx/commit/b9ef39954) fix(Icon): keep malformed slot diagnostics from interrupting rendering (#11502)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。槽位值写错只在开发环境提示一次，不打断渲染
- [x] [`8439a1162`](https://github.com/meta/astryx/commit/8439a1162) fix(Icon): preserve the nearest theme for icon resolution (#11498)
  - Vue 版已有：inject 直接拿最近的主题对象
- [x] [`86bb9555a`](https://github.com/meta/astryx/commit/86bb9555a) fix(Link): in block and inline layout, a long unbroken label such as a bare URL wraps inside its line (#11558)
  - 已移植：[#499](https://github.com/astryx-vue/astryx-vue/pull/499)。根元素 max-width: 100%，长网址在行内换行
- [x] [`762a65d60`](https://github.com/meta/astryx/commit/762a65d60) perf(Layer): keep the tap recognizer apart from the touch trigger, so Text's first load drops 9.6 KB (#11599)
  - 不适用：React 包体拆分
- [x] [`30b12dd5a`](https://github.com/meta/astryx/commit/30b12dd5a) fix(Item, Token): a control inside a row with its own action, or a token's Remove, rings itself (#8869)
  - 已移植：[#500](https://github.com/astryx-vue/astryx-vue/pull/500)。Token 与 List Item 的焦点环只画一个
- [x] [`5b8aa79fc`](https://github.com/meta/astryx/commit/5b8aa79fc) fix(Badge): a badge is as wide as its label, and never stretches in a Grid cell or a VStack (#12053)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。Badge width: fit-content，不在 Grid/VStack 中拉伸
- [x] [`cb315c6ae`](https://github.com/meta/astryx/commit/cb315c6ae) docs(architecture): press feedback has one engine and three recipes (#12115)
  - 不适用：只改上游架构文档
- [x] [`08c8f842c`](https://github.com/meta/astryx/commit/08c8f842c) feat(core): a Button shows its full label in a tooltip when the label is cut short (#12169)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。Button 标签被截短时键盘聚焦显示完整标签
- [x] [`ab67aa1eb`](https://github.com/meta/astryx/commit/ab67aa1eb) feat(core): a table header cell shows its full heading in a tooltip on keyboard focus when the heading is cut short (#12175)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。表头标题被截短时聚焦显示完整标题
- [x] [`93047f8b2`](https://github.com/meta/astryx/commit/93047f8b2) perf(Text): a truncation measurement that finds the same result sets no state (#11911)
  - Vue 版已有：ref 写入相同值本就不触发更新
- [x] [`f7ebe6734`](https://github.com/meta/astryx/commit/f7ebe6734) fix(Thumbnail): focusing Open shows one ring, not two (#11613)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。聚焦 Open 时只由图片容器画一个焦点环
- [x] [`36f851df9`](https://github.com/meta/astryx/commit/36f851df9) fix(Citation): without a source, Citation names the prop and the fix in development (#12394)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。开发环境缺 source 时报错点名
- [x] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
  - 已移植：[#506](https://github.com/astryx-vue/astryx-vue/pull/506)。组件内部部位的主题挂点（kbd-key、typeahead-popup、calendar-range 等）
- [x] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)、[#514](https://github.com/astryx-vue/astryx-vue/pull/514)。选择器列表最小宽度、Chat 缺 prop 报错、派生变量 replaces、模板窄屏布局；CLI 命令部分不适用
- [x] [`daf5e2cb3`](https://github.com/meta/astryx/commit/daf5e2cb3) chore: land batch 3 (13 pull requests) (#12722)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。其中 Kbd 部分：开发环境 keys 非字符串时报错；其余为 CLI 与主题改动，不属本族
- [x] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
  - 已移植：[#510](https://github.com/astryx-vue/astryx-vue/pull/510)。core 六处：按钮里的中性 Badge、Toolbar 换行、指示器比例、Calendar subgrid、Grid minWidth、CodeBlock 缺 code 报错；charts 部分不属本族
- [x] [`8688c1885`](https://github.com/meta/astryx/commit/8688c1885) chore: land batch 6 (11 pull requests) (#12812)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。Heading 部分：level 缺失或越界按 2 级渲染并警告；其余子改动不属本族
- [x] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)、[#514](https://github.com/astryx-vue/astryx-vue/pull/514)。Pagination 首尾标记、文字角色行高；doctor 字体检查不适用
- [x] [`a633a8d33`](https://github.com/meta/astryx/commit/a633a8d33) fix(Citation): a label citation centres on the line it sits in (#12434)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。标签型引用在行内居中
- [x] [`d3e41c190`](https://github.com/meta/astryx/commit/d3e41c190) docs(Button): in link mode the ref receives the link element; pin today's ref type (#12371)
  - 已移植：[#504](https://github.com/astryx-vue/astryx-vue/pull/504)。文档写明链接模式下 element 是链接元素，有测试
- [x] [`b0cb2b12a`](https://github.com/meta/astryx/commit/b0cb2b12a) fix(AvatarGroupOverflow): a caller aria-label names the indicator (#12543)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。调用方非空 aria-label 命名溢出指示器
- [x] [`e71b2fb59`](https://github.com/meta/astryx/commit/e71b2fb59) fix(Token): a clickable token passes aria-pressed to its inner button (#12560)
  - 已移植：[#500](https://github.com/astryx-vue/astryx-vue/pull/500)。可点击 Token 的 aria-pressed 等落到内层按钮

## 底部抽屉（area:core）

### v0.7.2

- [x] [`7c206edbb`](https://github.com/meta/astryx/commit/7c206edbb) feat(List): one edge prop for padded, flush, outset, and bleed rows (#7592)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.3

- [x] [`0d5d64e97`](https://github.com/meta/astryx/commit/0d5d64e97) spec(core): each BottomSheetSwitcher step owns its native dialog (#7744)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`79f4fc70d`](https://github.com/meta/astryx/commit/79f4fc70d) fix(Dialog, BottomSheet): a dismissed file picker inside no longer closes them (#7851)
- [x] [`3133fb04b`](https://github.com/meta/astryx/commit/3133fb04b) docs(spec): promote component:BottomSheet and component:BottomSheetSwitcher to current (#7822)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.4

- [ ] [`36515dccd`](https://github.com/meta/astryx/commit/36515dccd) feat(core): BottomSheetSwitcher presents each sheet in its own native dialog (#7720)
- [x] [`0d2cb4b62`](https://github.com/meta/astryx/commit/0d2cb4b62) test(core): browser evidence for per-sheet switcher dialogs (#7757)
  - 不适用：上游组件规范文档、只改上游测试（自动初筛）

### v0.7.5

- [ ] [`7cb897b4e`](https://github.com/meta/astryx/commit/7cb897b4e) fix(BottomSheet): keep toasts visible and clickable above an open sheet (#7781)
- [x] [`c743ae000`](https://github.com/meta/astryx/commit/c743ae000) spec(design): under reduced motion, touch cross-fades and other pointers change at once (#8272)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`c899f0bb6`](https://github.com/meta/astryx/commit/c899f0bb6) spec(AST-099): one shared on-screen keyboard module (#8304)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`67dc45f66`](https://github.com/meta/astryx/commit/67dc45f66) spec: an open layer may render up to 5 more elements under touch, with no new anatomy (#8439)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`b88081d9f`](https://github.com/meta/astryx/commit/b88081d9f) spec(core): BottomSheet stacks by open order and replaces on a same-update switch; BottomSheetSwitcher is deprecated (#8010)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`2af4d305a`](https://github.com/meta/astryx/commit/2af4d305a) feat(Popover): presentation — a BottomSheet on a phone when asked, as iOS presents a popover (#8229)
- [ ] [`c22cbe2fd`](https://github.com/meta/astryx/commit/c22cbe2fd) fix(core): useAnnounce delivers inside the open Astryx modal that encloses its caller (#8009)
- [ ] [`2a162e1b6`](https://github.com/meta/astryx/commit/2a162e1b6) feat(core): BottomSheet stacks by open order, replaces on a same-update switch, and BottomSheetSwitcher is deprecated (#7648)
- [ ] [`54fbccb27`](https://github.com/meta/astryx/commit/54fbccb27) feat(core): Tokenizer touch sheet behind experimental.presentation (#7977)
- [x] [`7e8d78d17`](https://github.com/meta/astryx/commit/7e8d78d17) spec(BottomSheetSwitcher): no maintained surface uses the switcher once MobilePowerSearch is migrated (#8716)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`d27b54502`](https://github.com/meta/astryx/commit/d27b54502) test(BottomSheet): find a non-modal sheet as an open manual popover (#8647)
  - 不适用：只改上游测试（自动初筛）
- [x] [`248380ebd`](https://github.com/meta/astryx/commit/248380ebd) spec(Dialog): every modal presentation is a focus region through one module (DEC-2) (#8882)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`8e1e4405b`](https://github.com/meta/astryx/commit/8e1e4405b) fix(BottomSheet): a replaced sheet moves down to a shorter entering sheet again (#8920)
- [ ] [`c9066fe8b`](https://github.com/meta/astryx/commit/c9066fe8b) feat(tokens): add --ease-exit, the curve BottomSheet already closes on (#8004)

### v0.7.6

- [ ] [`d73908f67`](https://github.com/meta/astryx/commit/d73908f67) fix(core): a sheet hosting another sheet in its content leaves that sheet's gestures alone (#8820)
- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [x] [`48f3699cf`](https://github.com/meta/astryx/commit/48f3699cf) docs(spec): Layout records its shipped contract as current (#8822)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
- [x] [`efb6b3044`](https://github.com/meta/astryx/commit/efb6b3044) test(BottomSheet): check the handoff's scrim and focus with the handoff held (#9235)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`10bdc28f6`](https://github.com/meta/astryx/commit/10bdc28f6) fix(BottomSheet): a drag across the resting detent no longer flashes the sheet away from the finger (#9193)
- [ ] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
- [ ] [`0df41f123`](https://github.com/meta/astryx/commit/0df41f123) fix(MobileTokenizer): refine touch sheet editing flow (#8742)
- [ ] [`16b95934f`](https://github.com/meta/astryx/commit/16b95934f) fix(Dialog, Drawer, BottomSheet): an overlay open on the server renders closed until hydration (#9360)
- [x] [`a986306fa`](https://github.com/meta/astryx/commit/a986306fa) spec(container-padding): AppShell is a boundary owner (#9461)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`09a482eaf`](https://github.com/meta/astryx/commit/09a482eaf) fix(Layer): a press inside a layer stops at the layer root in the React tree (#9497)
- [ ] [`3684425d7`](https://github.com/meta/astryx/commit/3684425d7) chore(BottomSheet): source comments explain only non-obvious reasons (1 of 2) (#9523)
- [ ] [`c3566269f`](https://github.com/meta/astryx/commit/c3566269f) chore(BottomSheet): trim gesture and keyboard comments (#9524)

### v0.7.7

- [ ] [`fb2dd8019`](https://github.com/meta/astryx/commit/fb2dd8019) fix(BottomSheet): a sheet Suspense hid while closing finishes closing when shown again (#9620)
- [ ] [`15f97c44f`](https://github.com/meta/astryx/commit/15f97c44f) fix(BottomSheet): the open sheet's dialog places its panel with a flex row, not a grid (#8534)
- [ ] [`6cb8b4a97`](https://github.com/meta/astryx/commit/6cb8b4a97) fix(BottomSheet): a set-height sheet keeps its content padding in WebKit's scroll range (#8557)
- [ ] [`4e495ec5e`](https://github.com/meta/astryx/commit/4e495ec5e) fix(BottomSheet): a standalone sheet closing with focus inside stays out of inert while focus stays (#9635)

### v0.7.8

- [ ] [`ba5866a50`](https://github.com/meta/astryx/commit/ba5866a50) fix(core): a BottomSheet exit the engine retargets mid-flight keeps sliding off (#8349)
- [ ] [`199fa9bb0`](https://github.com/meta/astryx/commit/199fa9bb0) perf(BottomSheet): take the sheet's open height from the ResizeObserver, not a forced measure (#9747)
- [ ] [`fc681230d`](https://github.com/meta/astryx/commit/fc681230d) fix(BottomSheet): the grabber stays drawn while the sheet moves between detents on iOS (#9760)
- [x] [`2188aa9ff`](https://github.com/meta/astryx/commit/2188aa9ff) fix(useScrollLock): keep the page where it is while an overlay is open (#8098)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [x] [`7d37fb5cd`](https://github.com/meta/astryx/commit/7d37fb5cd) test(BottomSheet): the drag test waits for the sheet's own motion, not for fixed times (#9862)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ea33dafd5`](https://github.com/meta/astryx/commit/ea33dafd5) feat(docsite): label deprecated components from their doc (#9046)
- [ ] [`0588a1342`](https://github.com/meta/astryx/commit/0588a1342) feat(core): one on-screen keyboard module; a Tall BottomSheet reads it and rides Gboard's slides (#8559)

### v0.7.9

- [x] [`cb44b33c3`](https://github.com/meta/astryx/commit/cb44b33c3) spec(Dialog): the deprecated BottomSheetSwitcher's steps are the one exception to DEC-2 (#9054)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`7eee90594`](https://github.com/meta/astryx/commit/7eee90594) fix(Dialog, AlertDialog, CommandPalette, BottomSheet, Lightbox): Tab wraps inside the open modal through the shared focus-region module (#8883)
- [ ] [`63592ed62`](https://github.com/meta/astryx/commit/63592ed62) fix(core): a BottomSheet pulled past its top stretches on every pull, on the iOS rubber band (#8109)
- [ ] [`5db61cc9b`](https://github.com/meta/astryx/commit/5db61cc9b) fix(BottomSheet, Dialog): returning focus after an overlay closes no longer scrolls the page (#10022)
- [ ] [`5f81c3f39`](https://github.com/meta/astryx/commit/5f81c3f39) docs(BottomSheet): AST-094 names FR18's caller-sized exception; a comment names the pen (#10023)
- [ ] [`8fdf6be37`](https://github.com/meta/astryx/commit/8fdf6be37) fix(BottomSheet): a sheet removed while open returns focus where a close would (#10061)
- [x] [`0200dfe0f`](https://github.com/meta/astryx/commit/0200dfe0f) test(core): BottomSheet detents, proven with the interaction harness (#10055)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`dd5ca2957`](https://github.com/meta/astryx/commit/dd5ca2957) fix(BottomSheet, Tokenizer, PowerSearch): the scrim returns with a sheet whose swipe dismissal the owner refuses (#10141)
- [x] [`d6efbde0f`](https://github.com/meta/astryx/commit/d6efbde0f) test(BottomSheet): the settle proofs freeze the scene at the lift (#10098)
  - 不适用：只改上游测试（自动初筛）

### v0.7.10

- [ ] [`d9ea17921`](https://github.com/meta/astryx/commit/d9ea17921) fix(BottomSheet): a lone sheet focuses its data-autofocus field on open in every browser (#10156)
- [ ] [`b8ae86f94`](https://github.com/meta/astryx/commit/b8ae86f94) fix(core): a BottomSheet touch drag's close keeps its speed, and its scrim fades with it (#8105)

### v0.7.11

- [ ] [`6309b0b38`](https://github.com/meta/astryx/commit/6309b0b38) fix(core): a BottomSheet touch release takes UIKit's sheet values, and turning back cancels (#10234)
- [x] [`959c094e3`](https://github.com/meta/astryx/commit/959c094e3) test(BottomSheet): read the viewport height without a non-null assertion (#10310)
  - 不适用：只改上游测试（自动初筛）
- [x] [`21599169a`](https://github.com/meta/astryx/commit/21599169a) test(BottomSheet): the keyboard proofs hold the scene at the report (#10279)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3e8137f65`](https://github.com/meta/astryx/commit/3e8137f65) test(core): two busy-block proofs judge against the control (#10314)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e245db5fb`](https://github.com/meta/astryx/commit/e245db5fb) feat(core): the keyboard module's docked ride, the scroller's reveal and the tap route (#9776)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0ad1e8d5e`](https://github.com/meta/astryx/commit/0ad1e8d5e) fix(core): a Tall sheet reads focus inside an open shadow root (#10388)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8ba5bbcc3`](https://github.com/meta/astryx/commit/8ba5bbcc3) refactor(Layer): modals hand toasts back through a callback ref (#10351)

### v0.7.12

- [ ] [`3c1f7b217`](https://github.com/meta/astryx/commit/3c1f7b217) fix(BottomSheet): a render reads the stored viewport height (#10363)
- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0a656fe4e`](https://github.com/meta/astryx/commit/0a656fe4e) fix(BottomSheet): a drag reads its release from Core's tracker (#10463)
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [x] [`131b9c1ae`](https://github.com/meta/astryx/commit/131b9c1ae) test(BottomSheet): hold the native modal handoff as it starts (#10478)
  - 不适用：只改上游测试（自动初筛）
- [x] [`bd6df76da`](https://github.com/meta/astryx/commit/bd6df76da) fix(useFocusTrap): a modal's first and last Tab stops count a radio group once, as the browser does (#10304)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [x] [`64ca3b715`](https://github.com/meta/astryx/commit/64ca3b715) docs(specs): Layout and LayoutContent records match the closed slot and inset gaps (#10557)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d6ad12b61`](https://github.com/meta/astryx/commit/d6ad12b61) test(BottomSheet): judge a soft flick by the release the page read (#10661)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1ffc0dac9`](https://github.com/meta/astryx/commit/1ffc0dac9) fix(BottomSheet): resting content starts below the grab bar, whatever the padding (#8558)
- [x] [`17f6985ed`](https://github.com/meta/astryx/commit/17f6985ed) fix(Layout): a full-bleed Table or List row takes the rounded container corner it reaches (#10586)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`5baebb01d`](https://github.com/meta/astryx/commit/5baebb01d) test(BottomSheet): name the drag spec's list marker plainly (#10767)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7f45363bd`](https://github.com/meta/astryx/commit/7f45363bd) fix(BottomSheet): a sheet whose close is suspended takes the scrim (#10776)
- [x] [`a0f2a2da8`](https://github.com/meta/astryx/commit/a0f2a2da8) test(BottomSheet): timestamp the reduced-motion mouse close (#10756)
  - 不适用：只改上游测试（自动初筛）
- [x] [`cb0973b2c`](https://github.com/meta/astryx/commit/cb0973b2c) test(BottomSheet): name the failure when a mouse release does not ask the sheet to close (#10823)
  - 不适用：只改上游测试（自动初筛）
- [x] [`78ac0b132`](https://github.com/meta/astryx/commit/78ac0b132) docs(records): LayoutPanel publishes its applied inset; Lightbox's gaps for 0, announcements and Tab are closed (#10819)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b3d177f06`](https://github.com/meta/astryx/commit/b3d177f06) test(BottomSheet): a soft flick's play fails by name below half's speed (#10841)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9624a0b37`](https://github.com/meta/astryx/commit/9624a0b37) fix(BottomSheet): a reduced-motion swipe close fades out in place (#10925)

### v0.7.13

- [ ] [`7e1aab38b`](https://github.com/meta/astryx/commit/7e1aab38b) fix(BottomSheet): a slow swipe down on the sheet's content no longer rubber-bands the content under the finger on iOS (#10033)

### v0.7.14

- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [ ] [`39819bfc5`](https://github.com/meta/astryx/commit/39819bfc5) fix(BottomSheet): a swipe that starts slowly on the sheet's content moves the sheet (#11140)
- [ ] [`230d1b4b9`](https://github.com/meta/astryx/commit/230d1b4b9) fix(BottomSheet): a move of a touch drag no longer restyles the sheet's content (#11154)
- [ ] [`6d89442f6`](https://github.com/meta/astryx/commit/6d89442f6) fix(BottomSheet): a finger's pull on the sheet's content is one touch drag from its touch-down, so a short flick closes the sheet (#11145)
- [ ] [`c1a1ea82b`](https://github.com/meta/astryx/commit/c1a1ea82b) fix(core): a tap that wobbles at a scroll edge keeps its click (#10829)
- [x] [`c6614a5e8`](https://github.com/meta/astryx/commit/c6614a5e8) ci: release-specs (changed) adds tagged specs, visited components and Lab-only pull requests, in shards (#11171)
  - 不适用：只改上游测试（自动初筛）

### v0.7.15

- [x] [`548f26c7c`](https://github.com/meta/astryx/commit/548f26c7c) spec(BottomSheet): a changed sheet waits at a peek while the discard dialog asks (DEC-5) (#11095)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`20e7aec47`](https://github.com/meta/astryx/commit/20e7aec47) test(BottomSheet): a slow drag's long tasks come from a trace (#10971)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8caa06274`](https://github.com/meta/astryx/commit/8caa06274) fix(Table): call the latest onSortChange; read sort and snap-point values directly in render (#11349)

### v0.7.16

- [ ] [`1bb7828b9`](https://github.com/meta/astryx/commit/1bb7828b9) fix(BottomSheet): sync its return target at commit (#10918)
- [ ] [`5072eb6ff`](https://github.com/meta/astryx/commit/5072eb6ff) fix(BottomSheet): keep snap points and the reentry in state (#10873)
- [ ] [`248de60ab`](https://github.com/meta/astryx/commit/248de60ab) refactor(layer): a closing BottomSheet takes the shared input hold (#11447)
- [x] [`3b80f85be`](https://github.com/meta/astryx/commit/3b80f85be) test(BottomSheet): wait for the pinch story to render before the check (#11412)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`22213fd97`](https://github.com/meta/astryx/commit/22213fd97) fix(BottomSheet): a flick's close clears the scrim along the same spring (#11400)

### v0.7.17

- [x] [`fb91b761f`](https://github.com/meta/astryx/commit/fb91b761f) fix(Layer): a released kept-inside hold never makes its layer inert (#11684)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ce0feb506`](https://github.com/meta/astryx/commit/ce0feb506) fix(core): a Table bleeds to a block edge only as its container's direct first or last child (#12068)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`34e3d212f`](https://github.com/meta/astryx/commit/34e3d212f) fix(core): dialog text reads the theme, and toast text reaches AA on its card (#12095)
- [ ] [`d504f0094`](https://github.com/meta/astryx/commit/d504f0094) feat(TextInput, TextArea, NumberInput): fields stay above the keyboard (#9777)
- [ ] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
- [x] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)
- [ ] [`416b167cf`](https://github.com/meta/astryx/commit/416b167cf) fix(core): one focus return for Popover and DropdownMenu (popover presentation) and Dialog that never strands focus (AST-116 FR17–FR21, AR1) (#11121)
- [ ] [`e9baa35e2`](https://github.com/meta/astryx/commit/e9baa35e2) fix(BottomSheetSwitcher): a flow without its scrim, or a removed switcher, returns focus to its opener (#11982)
- [ ] [`6df984a76`](https://github.com/meta/astryx/commit/6df984a76) docs(BottomSheet): where focus lands on open in WebKit, and data-autofocus for a field (#12487)

## build 构建插件（area:core）

### v0.7.2

- [x] [`a19fceb47`](https://github.com/meta/astryx/commit/a19fceb47) fix(build): scan what each Astryx package publishes, so a linked workspace builds (#7775)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试（自动初筛）
- [x] [`1c29a4be2`](https://github.com/meta/astryx/commit/1c29a4be2) fix(build): keep the app's Babel config out of the PostCSS plugin's library pass (#7774)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试（自动初筛）
- [x] [`3f837b381`](https://github.com/meta/astryx/commit/3f837b381) fix(build): withAstryx keeps symlink resolution so pnpm's default layout builds (#7773)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试（自动初筛）

### v0.7.3

- [x] [`2c3ed9933`](https://github.com/meta/astryx/commit/2c3ed9933) test(build): give the PostCSS fixture's Astryx package a manifest (#7797)
  - 不适用：只改上游测试（自动初筛）

### v0.7.5

- [x] [`1f3559072`](https://github.com/meta/astryx/commit/1f3559072) fix(cli): stop requiring fallbacks for raw data-token uses in astryx upgrade (#7912)
  - 不适用：只改上游测试（自动初筛）

### v0.7.6

- [x] [`8d0a84712`](https://github.com/meta/astryx/commit/8d0a84712) fix(build): resolve defineConsts read across files in astryxStylex (#8075)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试（自动初筛）
- [x] [`abf156aec`](https://github.com/meta/astryx/commit/abf156aec) fix(packages): exclude tests and benchmarks from tarballs (#9153)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试（自动初筛）
- [x] [`13412a4df`](https://github.com/meta/astryx/commit/13412a4df) ci: each published package commits a generated public API report, with advisory API changes for the PR report (#9241)
  - 不适用：上游 API 报告（自动初筛）
- [x] [`168011f26`](https://github.com/meta/astryx/commit/168011f26) fix(CodeEditor): draw the border and gutter divider its styles declare (#9427)
  - 不适用：只改上游测试（自动初筛）
- [x] [`fcd705d36`](https://github.com/meta/astryx/commit/fcd705d36) docs(build): README notes that its Babel config conflicts with next/font (#9439)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）（自动初筛）

### v0.7.7

- [x] [`653624f84`](https://github.com/meta/astryx/commit/653624f84) feat(build): build Astryx from source under Turbopack (#7754)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试、上游 API 报告（自动初筛）
- [x] [`5f44b1c14`](https://github.com/meta/astryx/commit/5f44b1c14) refactor(build): build the prebuilt stylesheets through the source build's walk (#9673)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试（自动初筛）

### v0.7.12

- [x] [`c909db9ce`](https://github.com/meta/astryx/commit/c909db9ce) fix(build): a swizzled copy compiles in the library pass, below the theme (#10334)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试（自动初筛）
- [x] [`44b9aa57d`](https://github.com/meta/astryx/commit/44b9aa57d) fix(cli): swizzle marks its output folder so the copy compiles below the theme (#10483)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）（自动初筛）

### v0.7.14

- [x] [`9f3cbd90d`](https://github.com/meta/astryx/commit/9f3cbd90d) chore: remove the committed API reports; the API delta comes from the build (#10957)
  - 不适用：上游 API 报告（自动初筛）

### v0.7.17

- [x] [`e51ed92f6`](https://github.com/meta/astryx/commit/e51ed92f6) fix(Theme): a system Theme takes the page's color scheme, and Core's stylesheet sets the root to follow the reader (#12102)
  - 不适用：只改上游测试、build 包只服务 StyleX，不移植（ADR 0001）（自动初筛）
- [x] [`e8c6cc05e`](https://github.com/meta/astryx/commit/e8c6cc05e) fix(Theme): the page root follows the reader only through reset.css, so Core's stylesheet leaves a host's scheme alone (#12247)
  - 不适用：只改上游测试、build 包只服务 StyleX，不移植（ADR 0001）（自动初筛）
- [x] [`8554b67ed`](https://github.com/meta/astryx/commit/8554b67ed) chore: land batch 5 (7 pull requests) (#12818)
  - 不适用：build 包只服务 StyleX，不移植（ADR 0001）、只改上游测试（自动初筛）

## 对话组件（area:core）

### v0.7.2

- [x] [`a61db6f03`](https://github.com/meta/astryx/commit/a61db6f03) fix(RadioList): keep a caller aria-labelledby on the radiogroup (#5656)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`95e1674ce`](https://github.com/meta/astryx/commit/95e1674ce) fix(ChatLayout): release hidden scroll affordance focus (#7738)

### v0.7.3

- [ ] [`c1fcd07d7`](https://github.com/meta/astryx/commit/c1fcd07d7) fix(ChatComposer): announce the status through the shared channel, not a live region born with its text (#7894)
- [ ] [`0a4c894d5`](https://github.com/meta/astryx/commit/0a4c894d5) fix(ChatSystemMessage): leave notices inside a chat log to the log (#7869)

### v0.7.4

- [ ] [`51ad2f40d`](https://github.com/meta/astryx/commit/51ad2f40d) fix(ChatComposerInput): announce the trigger menu's loading text through the shared channel (#7900)
- [ ] [`10b832e02`](https://github.com/meta/astryx/commit/10b832e02) fix(DropdownMenuSubMenu, Thumbnail, ChatMessageList): silence the busy Spinner and announce the busy start once (#7950)

### v0.7.5

- [ ] [`5b9e43bd0`](https://github.com/meta/astryx/commit/5b9e43bd0) fix(ChatComposer): the status bar announces through the shared own-content module (#8363)
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [ ] [`0cbddeac0`](https://github.com/meta/astryx/commit/0cbddeac0) fix(ChatComposerInput): retain focus while disabled (#8431)
- [ ] [`c86dc620c`](https://github.com/meta/astryx/commit/c86dc620c) fix(i18n): catch formatter returns and localize helper text (#7849)
- [x] [`ac096a7e1`](https://github.com/meta/astryx/commit/ac096a7e1) test(ChatLayout): the hiding-affordance contract reads visibility as focus leaves (#9003)
  - 不适用：只改上游测试（自动初筛）

### v0.7.6

- [x] [`631ba02fe`](https://github.com/meta/astryx/commit/631ba02fe) docs(spec): ChatComposerTokenElement records its shipped contract as current (#9100)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`c69ce851d`](https://github.com/meta/astryx/commit/c69ce851d) docs(spec): ChatComposer records its shipped contract as current (#9108)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`ae29a6fef`](https://github.com/meta/astryx/commit/ae29a6fef) docs(spec): ChatDictationButton records its shipped contract as current (#9112)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`d29fa74e3`](https://github.com/meta/astryx/commit/d29fa74e3) docs(spec): ChatLayout records its shipped contract as current (#9118)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`aa138b993`](https://github.com/meta/astryx/commit/aa138b993) docs(spec): ChatLayoutScrollButton records its shipped contract as current (#9124)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`b295cd522`](https://github.com/meta/astryx/commit/b295cd522) docs(spec): ChatSendButton records its shipped contract as current (#9129)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`4b6854b50`](https://github.com/meta/astryx/commit/4b6854b50) docs(spec): ChatMessage records its shipped contract as current (#9131)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
- [ ] [`4f35412e2`](https://github.com/meta/astryx/commit/4f35412e2) fix(ChatComposerInput): a tap on a pasted-text token opens its preview without raising the keyboard (#9189)
- [ ] [`3e735de86`](https://github.com/meta/astryx/commit/3e735de86) fix(core A–M): slots use isRenderable; the remaining checks are allowed with a reason (#9204)
- [ ] [`891aa236c`](https://github.com/meta/astryx/commit/891aa236c) refactor(core): drop a dead private selector and collapse duplicate attribute spellings (INV23 step 4) (#9256)
- [ ] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
- [x] [`9b6d03e50`](https://github.com/meta/astryx/commit/9b6d03e50) docs(spec): ChatMessageBubble records its shipped contract as current (#9136)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1bf015937`](https://github.com/meta/astryx/commit/1bf015937) docs(spec): ChatMessageList records its shipped contract as current (#9270)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d4b2d764b`](https://github.com/meta/astryx/commit/d4b2d764b) docs(spec): ChatMessageMetadata records its shipped contract as current (#9293)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`be0b0d230`](https://github.com/meta/astryx/commit/be0b0d230) docs(spec): ChatSystemMessage records its shipped contract as current (#9318)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`940add5b6`](https://github.com/meta/astryx/commit/940add5b6) docs(spec): ChatTokenizedText records its shipped contract as current (#9326)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`974c3c870`](https://github.com/meta/astryx/commit/974c3c870) docs(spec): ChatToolCalls records its shipped contract as current (#9339)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9963c0e16`](https://github.com/meta/astryx/commit/9963c0e16) refactor(useTriggerMenu): announce Searching… through the shared busy path (#9154)
- [ ] [`42754d567`](https://github.com/meta/astryx/commit/42754d567) fix(ChatComposer): a click inside an open Tooltip or HoverCard doesn't focus the input (#9375)
- [x] [`e64b41bfc`](https://github.com/meta/astryx/commit/e64b41bfc) spec(TextInput, TextArea, search, ChatComposer): touch keyboard props and return-key defaults (#9424)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`644a601ac`](https://github.com/meta/astryx/commit/644a601ac) fix(ChatMessage): the avatar's name-row spacing is parent-relative, so WebKit stays linear (#9438)
- [ ] [`16fe5f199`](https://github.com/meta/astryx/commit/16fe5f199) fix(core): Table, Chat, CommandPalette and the date and time inputs carry only their own English (#9452)
- [x] [`41aa83233`](https://github.com/meta/astryx/commit/41aa83233) spec(layer-runtime): a click inside a layer stops at the layer root (#9398)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`8835deca3`](https://github.com/meta/astryx/commit/8835deca3) fix(ChatComposerInput): a press in the editor keeps the trigger menu open (#9503)
- [ ] [`beb03f8bd`](https://github.com/meta/astryx/commit/beb03f8bd) fix(DateInput): a press in the field's own input, clear button or label keeps the calendar open (#9433)
- [ ] [`b5e716687`](https://github.com/meta/astryx/commit/b5e716687) refactor(Item, Token, ChatComposer): drop the per-site tooltip surface checks the layer boundary replaces (#9531)

### v0.7.7

- [ ] [`65ad191d8`](https://github.com/meta/astryx/commit/65ad191d8) feat(ChatComposerInput): the touch keyboard's Return key says Send (#8167)
- [ ] [`d40b5b7a5`](https://github.com/meta/astryx/commit/d40b5b7a5) chore(ChatMessage): give the avatar offset variable a private literal name (#9602)
- [x] [`b11e000b5`](https://github.com/meta/astryx/commit/b11e000b5) fix(Selector): a row that scrolls under a still mouse does not take the keyboard's highlight (#9671)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [ ] [`41cce0b0a`](https://github.com/meta/astryx/commit/41cce0b0a) fix(core): a disabled Slider no longer runs a caller's handlers (#9729)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0d436a195`](https://github.com/meta/astryx/commit/0d436a195) fix(ChatMessageList, Tooltip, HoverCard): the chat log and text trigger spans draw the shared focus ring (#8876)
- [ ] [`df0e60e70`](https://github.com/meta/astryx/commit/df0e60e70) fix(Chat): latest-value refs are written at commit (#10162)
- [x] [`c706f1563`](https://github.com/meta/astryx/commit/c706f1563) test(ChatSendButton): expect no press scale under reduced motion (#10200)
  - 不适用：只改上游测试（自动初筛）

### v0.7.10

- [ ] [`e40adf9aa`](https://github.com/meta/astryx/commit/e40adf9aa) fix(ChatComposerInput): an imperative insertToken reports its value through onChange (#10167)

### v0.7.12

- [x] [`c9f603ae0`](https://github.com/meta/astryx/commit/c9f603ae0) fix(ChatLayout): the Panel View story's composer rests in its panel (#10447)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`6e0b60429`](https://github.com/meta/astryx/commit/6e0b60429) chore(core): one owner module turns scroll anchoring off (#10173)
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [x] [`80e880df0`](https://github.com/meta/astryx/commit/80e880df0) test(Chat): read aria-disabled in SendButton audit (#10512)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a3f795c57`](https://github.com/meta/astryx/commit/a3f795c57) test(ChatSendButton): the a11y audit checks a disabled send stays focusable (#10517)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`695653f5d`](https://github.com/meta/astryx/commit/695653f5d) feat(ChatLayout): the composer rides the software keyboard (#8176)
- [ ] [`619ffeb27`](https://github.com/meta/astryx/commit/619ffeb27) fix(core, richtext): no focus fade on text fields under a coarse pointer (#10611)
- [x] [`c08de542e`](https://github.com/meta/astryx/commit/c08de542e) test(ChatLayout): the rise proof keeps the caret out and names a starved start (#10489)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1b06024be`](https://github.com/meta/astryx/commit/1b06024be) fix(ChatLayout): the newest message rests above a fixed dock (#10676)
- [ ] [`db40c6b01`](https://github.com/meta/astryx/commit/db40c6b01) refactor(core): share per-instance warning dedupe and temporary focus targets (#10655)
- [ ] [`1e95e11ad`](https://github.com/meta/astryx/commit/1e95e11ad) fix(ChatComposerInput): anchor programmatic carets into trailing text nodes for IME composition (#6411) (#6423)
- [ ] [`d49271d81`](https://github.com/meta/astryx/commit/d49271d81) fix(ChatLayout): the scroll button follows a page that scrolls (#10779)
- [ ] [`e633aab2b`](https://github.com/meta/astryx/commit/e633aab2b) fix(Chat): scrollToMessage lands a message at the page's top (#10781)
- [x] [`daa239e98`](https://github.com/meta/astryx/commit/daa239e98) feat(lab): experimental ChatVirtualizer (#5461)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`cc154981d`](https://github.com/meta/astryx/commit/cc154981d) docs(ChatComposerInput): file FR18 verification under interaction and list the IME caret spec (#10811)
- [ ] [`b6b0c68ad`](https://github.com/meta/astryx/commit/b6b0c68ad) docs(ChatLayout): a reply gets one right edge with contentWidth="100%"; Markdown keeps its 680px measure (#6608)

### v0.7.13

- [x] [`dbabf352b`](https://github.com/meta/astryx/commit/dbabf352b) test(ChatLayout): hold Gboard's rides as they start (#10963)
  - 不适用：只改上游测试（自动初筛）

### v0.7.14

- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [ ] [`9600e3500`](https://github.com/meta/astryx/commit/9600e3500) refactor(core): useChatStreamScroll's page-scroller rules move to one owner module (#11160)
- [x] [`a3a6f1c85`](https://github.com/meta/astryx/commit/a3a6f1c85) fix(ChatVirtualizer): attach mode works on the page's own scroller (#10879)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c6614a5e8`](https://github.com/meta/astryx/commit/c6614a5e8) ci: release-specs (changed) adds tagged specs, visited components and Lab-only pull requests, in shards (#11171)
  - 不适用：只改上游测试（自动初筛）

### v0.7.15

- [x] [`3fed77b37`](https://github.com/meta/astryx/commit/3fed77b37) fix(ChatVirtualizer): a rotation keeps the row at the top of the view in place (#11219)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.16

- [ ] [`2d6c090c6`](https://github.com/meta/astryx/commit/2d6c090c6) fix(ChatComposerInput): an empty input keeps its line after a restyle (#11428)

### v0.7.17

- [ ] [`538e297e5`](https://github.com/meta/astryx/commit/538e297e5) docs(useChatDictation): add hook docs and a voice input example block (#11237)
- [ ] [`b31d8b327`](https://github.com/meta/astryx/commit/b31d8b327) docs(useSpeechRecognition): add hook docs and a transcript example block (#11238)
- [ ] [`27ba2010f`](https://github.com/meta/astryx/commit/27ba2010f) docs(useChatPasteAsToken): add hook docs and a long paste example block (#11239)
- [ ] [`d7680a644`](https://github.com/meta/astryx/commit/d7680a644) fix(core): useSpeechRecognition no longer causes a hydration mismatch (#12121)
- [ ] [`23638a7a7`](https://github.com/meta/astryx/commit/23638a7a7) fix(core): ChatToolCalls truncates its target inside a ChatMessage (#12424)
- [ ] [`8dbb75a28`](https://github.com/meta/astryx/commit/8dbb75a28) fix(ChatComposerDrawer): round the drawer with the composer corner (#12481)
- [ ] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
- [ ] [`3b21ca666`](https://github.com/meta/astryx/commit/3b21ca666) feat(theme): chat surfaces default to the container radius (#12794)
- [ ] [`8688c1885`](https://github.com/meta/astryx/commit/8688c1885) chore: land batch 6 (11 pull requests) (#12812)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`3344f149a`](https://github.com/meta/astryx/commit/3344f149a) fix(ChatComposerInput): the trigger menu's no-results message comes from the catalog (#12677)
- [ ] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)

## 样式分层自动迁移脚本（area:cli）

### v0.7.2

- [ ] [`7c206edbb`](https://github.com/meta/astryx/commit/7c206edbb) feat(List): one edge prop for padded, flush, outset, and bleed rows (#7592)
- [ ] [`e4bdd7026`](https://github.com/meta/astryx/commit/e4bdd7026) docs(cli): make the integration guides and Authoring Reference match the CLI (#7263)
- [ ] [`822261231`](https://github.com/meta/astryx/commit/822261231) fix(cli): upgrade no longer says "up to date" when the CLI is older than Core (#7491)
- [ ] [`40b21e570`](https://github.com/meta/astryx/commit/40b21e570) feat(cli): list passages two integration topics repeat word for word (#7735)
- [ ] [`a44ebd55a`](https://github.com/meta/astryx/commit/a44ebd55a) feat(cli): install once, run anywhere — every copy hands a project's run to the release its Core matches (#7649)
- [ ] [`14c0ec650`](https://github.com/meta/astryx/commit/14c0ec650) chore: version packages for v0.7.2 (#7798)

### v0.7.3

- [ ] [`863e167ba`](https://github.com/meta/astryx/commit/863e167ba) chore: merge v0.7.2 release outputs to main (#7807)
- [ ] [`b1e1936bb`](https://github.com/meta/astryx/commit/b1e1936bb) fix(core): provide dataVars defaults in prebuilt CSS (#7694)
- [ ] [`b74cf213e`](https://github.com/meta/astryx/commit/b74cf213e) fix(cli): init writes agent docs every agent reads, at the project root, never in the home folder (#7497)
- [ ] [`cb489ffbc`](https://github.com/meta/astryx/commit/cb489ffbc) fix(cli): find Core and configured integrations from any folder in a project (#7492)
- [ ] [`641d08e46`](https://github.com/meta/astryx/commit/641d08e46) docs(cli): give every doc a named home; authoring owns integration authoring (#7835)

### v0.7.4

- [ ] [`1a552f29b`](https://github.com/meta/astryx/commit/1a552f29b) [CLI] Doc syntax: {@command}, {@pm}, {@pm-only} tokens, and integration check --next (#7868)
- [ ] [`4fc0c4a48`](https://github.com/meta/astryx/commit/4fc0c4a48) feat(cli): experimental icon sets — icon definitions, `astryx experimental icon`, templates that use the installed set (#7759)

### v0.7.5

- [ ] [`1f3559072`](https://github.com/meta/astryx/commit/1f3559072) fix(cli): stop requiring fallbacks for raw data-token uses in astryx upgrade (#7912)
- [ ] [`3dd95a046`](https://github.com/meta/astryx/commit/3dd95a046) fix(cli): only migrate theme-shaped objects proven to be Astryx themes (#7980)
- [ ] [`9114234a7`](https://github.com/meta/astryx/commit/9114234a7) fix(cli): keep app classes on MetadataList out of data-columns selectors (#7982)
- [ ] [`384f1851b`](https://github.com/meta/astryx/commit/384f1851b) fix(cli): do not scan through symlinks into dependency or VCS trees (#7994)
- [ ] [`04434e7de`](https://github.com/meta/astryx/commit/04434e7de) fix(cli): add the upgrade receipt to the codemod failure error (#7993)
- [ ] [`339779097`](https://github.com/meta/astryx/commit/339779097) fix(cli): skip protected files that do not parse instead of failing upgrade (#7991)
- [ ] [`4f9bdd782`](https://github.com/meta/astryx/commit/4f9bdd782) fix(cli): layout.components codemod reads a const-bound default-exported config (#8250)
- [ ] [`e8ef708e7`](https://github.com/meta/astryx/commit/e8ef708e7) feat(cli): report manual migrations and regeneration apart from codemod failures (#7995)
- [ ] [`79a7a902b`](https://github.com/meta/astryx/commit/79a7a902b) feat(CodeBlock, cli): deprecate tokenizer in favour of a custom language value; astryx upgrade rewrites it (#8490)
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
- [ ] [`776dfd37e`](https://github.com/meta/astryx/commit/776dfd37e) chore: prepare v0.7.5 release outputs (#9079)

### v0.7.6

- [ ] [`3ec1c8beb`](https://github.com/meta/astryx/commit/3ec1c8beb) chore: merge v0.7.5 release outputs to main (#9086)

### v0.7.8

- [ ] [`dcf3d6f86`](https://github.com/meta/astryx/commit/dcf3d6f86) feat(Tokenizer): presentation is a stable prop, and adaptive is its default (#9796)
- [ ] [`b5ce149a8`](https://github.com/meta/astryx/commit/b5ce149a8) chore(Tokenizer): remove experimental.presentation; presentation is the only spelling (#9836)
- [ ] [`2b12c1522`](https://github.com/meta/astryx/commit/2b12c1522) chore: version packages for v0.7.8 (#9981)

### v0.7.9

- [x] [`4d84e2d1b`](https://github.com/meta/astryx/commit/4d84e2d1b) test(cli): render, codemod and doctor fixtures live in the OS temp directory (#9899)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`db17b8a96`](https://github.com/meta/astryx/commit/db17b8a96) chore: merge v0.7.8 release outputs to main (#9995)

### v0.7.12

- [x] [`3cd23eafb`](https://github.com/meta/astryx/commit/3cd23eafb) test(cli): node tests no longer time out under load (#10740)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4b6ad11c0`](https://github.com/meta/astryx/commit/4b6ad11c0) fix(cli): remove internal-format identifiers from comments and sample data (#10958)

### v0.7.15

- [ ] [`2cf170ac7`](https://github.com/meta/astryx/commit/2cf170ac7) perf(cli): skip codemods on files they cannot change (#11249)
- [ ] [`938558ab7`](https://github.com/meta/astryx/commit/938558ab7) perf(cli): skip the theme-alias codemod on files that name no removed target (#11265)
- [x] [`bc018a8be`](https://github.com/meta/astryx/commit/bc018a8be) test(cli): run the authoring migration's tsc check with node (#11261)
  - 不适用：只改上游测试（自动初筛）

### v0.7.16

- [ ] [`ee44fb041`](https://github.com/meta/astryx/commit/ee44fb041) Dry-run upgrade no longer points to an unwritten .astryx-conflict file (#11356)
- [ ] [`685728b42`](https://github.com/meta/astryx/commit/685728b42) perf(cli): load Babel, recast and jscodeshift on first use, not with the API (#11432)

### v0.7.17

- [ ] [`1addd72da`](https://github.com/meta/astryx/commit/1addd72da) feat(core): swipe actions come from createSwipe on the shared drag path (#8690)
- [ ] [`d48e1d66b`](https://github.com/meta/astryx/commit/d48e1d66b) feat(cli): upgrade --list prints one line per codemod under its version (#11661)
- [ ] [`949c5ce69`](https://github.com/meta/astryx/commit/949c5ce69) perf(cli): upgrade skips a codemod for a file whose escapes spell none of its words (#11653)
- [ ] [`6fe368b08`](https://github.com/meta/astryx/commit/6fe368b08) perf(cli): upgrade binds jscodeshift to each parser once per codemod (#11721)
- [ ] [`43445a643`](https://github.com/meta/astryx/commit/43445a643) fix(cli): the CLI orders names the same way on every machine (#11683)
- [ ] [`ca9fee580`](https://github.com/meta/astryx/commit/ca9fee580) fix(cli): upgrade reads each TypeScript file in its own grammar (#11863)
- [ ] [`c0b2a7887`](https://github.com/meta/astryx/commit/c0b2a7887) fix(cli): errors name a run that works (#11874)
- [ ] [`cf7e3d604`](https://github.com/meta/astryx/commit/cf7e3d604) fix(cli): a run that exits 1 after its output records the code it carries (#11865)
- [ ] [`dc58f1979`](https://github.com/meta/astryx/commit/dc58f1979) perf(cli): doctor's theme checks and the codemods' parser load postcss only when they read a stylesheet (#11925)
- [ ] [`c44a63778`](https://github.com/meta/astryx/commit/c44a63778) feat(cli): bases, first step — a run reads one base; steps it does not serve are hidden and refused (#11111)
- [ ] [`68609edee`](https://github.com/meta/astryx/commit/68609edee) fix(cli): bases — a non-Core base shows no Core in build, list envelopes, upgrade, and doctor (#11593)
- [ ] [`d6f6295da`](https://github.com/meta/astryx/commit/d6f6295da) perf(cli): keep each shipped doc's parse, and build doc schemas on first parse (#12166)
- [ ] [`2c80ffc20`](https://github.com/meta/astryx/commit/2c80ffc20) feat(cli): an installed icon-set package turns on the experimental icon features (one gate) (#12176)
- [ ] [`ee8a33a7c`](https://github.com/meta/astryx/commit/ee8a33a7c) feat(cli): the swipe codemod defines each swipe once (#11670)
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`3b21ca666`](https://github.com/meta/astryx/commit/3b21ca666) feat(theme): chat surfaces default to the container radius (#12794)
- [ ] [`d60793cbc`](https://github.com/meta/astryx/commit/d60793cbc) chore: land batch 18 (2 pull requests) (#12882)
- [ ] [`75649f57f`](https://github.com/meta/astryx/commit/75649f57f) chore: land batch 30 (4 pull requests) (#12901)
- [ ] [`2535488bf`](https://github.com/meta/astryx/commit/2535488bf) chore: land batch 50 (1 pull requests) (#12928)
- [ ] [`0b48882df`](https://github.com/meta/astryx/commit/0b48882df) chore: version packages for v0.7.17 (#13108)

## 命令行搜索与更新（area:cli）

### v0.7.2

- [x] [`05daead8a`](https://github.com/meta/astryx/commit/05daead8a) perf(cli): import Core only when a theme build needs it (#7493)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)
- [x] [`52c42390c`](https://github.com/meta/astryx/commit/52c42390c) fix(cli): exclude template-local helpers from extractComponents (#7641)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e3ba63175`](https://github.com/meta/astryx/commit/e3ba63175) docs: correct the MCP setup instructions in working-with-ai (#6216)
- [ ] [`2ec83d72a`](https://github.com/meta/astryx/commit/2ec83d72a) fix(cli): list and search VStack, HStack and Heading, whose docs live in their family's folder (#7625)
- [x] [`405bb94ca`](https://github.com/meta/astryx/commit/405bb94ca) fix(cli): theme build writes only inside the working directory (#7496)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`c9927832b`](https://github.com/meta/astryx/commit/c9927832b) spec(AST-039, cli-surface): integration docs are found by their documented names and checked in one command (#7658)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`58279bc7d`](https://github.com/meta/astryx/commit/58279bc7d) fix(cli): integration verify reads exports with the reader discovery uses (#7660)
  - 不适用：integration verify 是上游给第三方集成包作者用的打包检查，我们的 CLI 没有 integration 命令和集成包体系
- [ ] [`ebcc4044a`](https://github.com/meta/astryx/commit/ebcc4044a) feat(cli): a component doc can name a differently named export of the file beside it (#7659)
- [x] [`5814894e5`](https://github.com/meta/astryx/commit/5814894e5) spec(cli-surface): the integration doc checks govern from the CLI surface record (#7686)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`91cfb530b`](https://github.com/meta/astryx/commit/91cfb530b) feat(cli): integration family members are components under their own names (#7674)
- [x] [`cbb7fa3bb`](https://github.com/meta/astryx/commit/cbb7fa3bb) spec(cli-surface): the prop check does not ask docs for the props authors are told to skip (#7688)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1c6928388`](https://github.com/meta/astryx/commit/1c6928388) feat(cli): read a package's TypeScript project the way tsc reads it (#7681)
- [ ] [`4787e3fdf`](https://github.com/meta/astryx/commit/4787e3fdf) feat(cli): compare documented component props with the TypeScript source (#7663)
- [x] [`01eab6ae7`](https://github.com/meta/astryx/commit/01eab6ae7) feat(cli): doctor integration components compares documented props with the code (#7676)
  - 不适用：doctor integration components 对比集成包组件文档与代码的 props，属上游集成包作者工具，我们没有
- [ ] [`2b221e0e7`](https://github.com/meta/astryx/commit/2b221e0e7) fix(cli): doc links to a component, page, or block resolve (#7668)
- [x] [`f0e139e87`](https://github.com/meta/astryx/commit/f0e139e87) spec(AST-051): a package can link its docs site (#7703)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`dd769fe1d`](https://github.com/meta/astryx/commit/dd769fe1d) feat(cli): read two written TypeScript types as one when they differ only in how they are written (#7684)
- [ ] [`a3f5dbf1e`](https://github.com/meta/astryx/commit/a3f5dbf1e) feat(cli): the integration manifest accepts an optional docsiteUrl link (#7704)
- [ ] [`17e56d8ad`](https://github.com/meta/astryx/commit/17e56d8ad) feat(cli): check each authored doc against its published authoring type (#7664)
- [ ] [`e26723dcf`](https://github.com/meta/astryx/commit/e26723dcf) docs(cli): import each Core export from the path `astryx component` prints (#7623)
- [ ] [`d698109f9`](https://github.com/meta/astryx/commit/d698109f9) feat(cli): doctor integration components judges documented prop types against the code (#7667)
- [x] [`c2e0a594e`](https://github.com/meta/astryx/commit/c2e0a594e) feat(cli): doctor integration validate checks each doc against its published authoring type (#7673)
  - 不适用：doctor integration validate 按发布的作者类型校验集成包文档，我们没有集成包体系
- [ ] [`621784ff7`](https://github.com/meta/astryx/commit/621784ff7) feat(cli): integration check runs every source check for a package's build, with --strict (#7665)
- [x] [`f8f7cf1bd`](https://github.com/meta/astryx/commit/f8f7cf1bd) fix(cli): theme build --check compares outputs outside the working directory read-only (#7652)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`fdd384faa`](https://github.com/meta/astryx/commit/fdd384faa) spec(cli-surface): integration authoring guidance requires the strict check in every build (#7713)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`3acf18485`](https://github.com/meta/astryx/commit/3acf18485) fix(search): keep a guide first for a phrase it declares as a keyword (#7271)
- [ ] [`7462c4156`](https://github.com/meta/astryx/commit/7462c4156) docs(cli): every integration runs integration check --strict in its build (#7708)
- [ ] [`e4bdd7026`](https://github.com/meta/astryx/commit/e4bdd7026) docs(cli): make the integration guides and Authoring Reference match the CLI (#7263)
- [ ] [`a2f0c93df`](https://github.com/meta/astryx/commit/a2f0c93df) docs(cli): keep declared keywords to what each doc answers (#7714)
- [ ] [`2bb6c7447`](https://github.com/meta/astryx/commit/2bb6c7447) fix(cli): the setup reminder, the swizzle StyleX note, and a doctor line say only what is true (#7262)
- [x] [`f2b60a009`](https://github.com/meta/astryx/commit/f2b60a009) spec(cli-surface): the integration check reports only what the code contradicts (#7715)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`892421dd1`](https://github.com/meta/astryx/commit/892421dd1) spec(AST-031): a gap report also reaches the package it is about (#7722)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
- [ ] [`55d8dffda`](https://github.com/meta/astryx/commit/55d8dffda) feat(cli): on TypeScript 7, read types with its TypeScript 6 API package, and name the remedy (#7721)
- [ ] [`caf5673d4`](https://github.com/meta/astryx/commit/caf5673d4) fix(cli): search ranks longer partial-name matches above a shorter named entry (#7725)
- [ ] [`7ae39ea46`](https://github.com/meta/astryx/commit/7ae39ea46) docs(cli): say when a part-name match can outrank a named entry (#7726)
- [x] [`0da784d3c`](https://github.com/meta/astryx/commit/0da784d3c) docs(FieldLabel): expose complete label contract (#7727)
  - 不适用：只改上游测试（自动初筛）
- [x] [`22c592a7a`](https://github.com/meta/astryx/commit/22c592a7a) Audit DropdownMenuGroup (#7729)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5a96bf95b`](https://github.com/meta/astryx/commit/5a96bf95b) spec(AST-040): upgrade works on its project from any folder, and reports a CLI older than Core (#7543)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`820871fc0`](https://github.com/meta/astryx/commit/820871fc0) spec(cli-surface): agent docs reach every agent from the project's own files (#7539)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7c0f85086`](https://github.com/meta/astryx/commit/7c0f85086) docs(spec): discover lists the official packages first, from a list built into each release (AST-051) (#7494)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`6fddf4f25`](https://github.com/meta/astryx/commit/6fddf4f25) spec(cli-surface): INV35 binds from the first stable integration check; DEC-8 doc-quality findings fail --strict (#7743)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3fb02c30e`](https://github.com/meta/astryx/commit/3fb02c30e) spec(cli-surface, AST-031): the person filing a gap report chooses where it goes (#7749)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b0a6f6234`](https://github.com/meta/astryx/commit/b0a6f6234) spec(AST-081): global mode, so the CLI answers in any folder and a project's own release answers inside it (#7601)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`f1e22eed8`](https://github.com/meta/astryx/commit/f1e22eed8) fix(cli): integration check --strict prints each finding once (#7751)
- [ ] [`822261231`](https://github.com/meta/astryx/commit/822261231) fix(cli): upgrade no longer says "up to date" when the CLI is older than Core (#7491)
- [ ] [`6a3ff0fe1`](https://github.com/meta/astryx/commit/6a3ff0fe1) feat(cli): gap-report --to files a report where the person chose (#7724)
- [x] [`80d2f411c`](https://github.com/meta/astryx/commit/80d2f411c) [Spec] AST-050: a theme module may load its own styles (#7707)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9e97808d9`](https://github.com/meta/astryx/commit/9e97808d9) feat(cli): discover lists the official Astryx packages first, from a list built into each release (#7495)
- [x] [`b40ba52f3`](https://github.com/meta/astryx/commit/b40ba52f3) fix(cli): theme modules that load their own stylesheet pass verify, doctor, and component (#7490)
  - 不适用：自带样式表的主题模块通过 verify/doctor，属上游 theme build 的 TS 主题模块；我们的主题是现成 CSS
- [ ] [`40b21e570`](https://github.com/meta/astryx/commit/40b21e570) feat(cli): list passages two integration topics repeat word for word (#7735)
- [x] [`d21609796`](https://github.com/meta/astryx/commit/d21609796) spec(cli-surface): INV30, how a host's package set serves the CLI (#7412)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4a2f608f8`](https://github.com/meta/astryx/commit/4a2f608f8) feat(cli): padding phrases and low-density topics fail integration check --strict (DEC-8) (#7740)
- [x] [`acfd1ffe4`](https://github.com/meta/astryx/commit/acfd1ffe4) [feat] doctor: warn when a template source has no doc (#7768)
  - 不适用：给集成包作者的模板源码缺文档告警，我们的模板随 CLI 内置，没有第三方模板作者流程
- [ ] [`37d990deb`](https://github.com/meta/astryx/commit/37d990deb) fix(cli): integration checks catch more doc mistakes and stop flagging an overlay pattern Core uses (#7778)
- [x] [`cad9f7b4b`](https://github.com/meta/astryx/commit/cad9f7b4b) feat(cli): a written astryx docs <name> pointer to a doc that exists is a warning, with the {@link} to write instead (#7769)
  - 不适用：集成包文档里手写 astryx docs 指针改用 {@link} 的作者告警，我们的文档取自文档站 Markdown，没有这套作者语法
- [x] [`8e723b06c`](https://github.com/meta/astryx/commit/8e723b06c) feat(cli): resolve {@link} in component docs and topic descriptions (#7756)
  - 不适用：解析组件文档和主题描述里的 {@link} 语法；我们的 catalog 文本直接取自文档站 Markdown，链接本来就是 Markdown 链接
- [ ] [`a44ebd55a`](https://github.com/meta/astryx/commit/a44ebd55a) feat(cli): install once, run anywhere — every copy hands a project's run to the release its Core matches (#7649)
- [x] [`577a62e59`](https://github.com/meta/astryx/commit/577a62e59) [Component Audit] Grid: make responsive track behavior and evidence trustworthy (#7789)
  - 不适用：只改上游测试（自动初筛）

### v0.7.3

- [x] [`1d247e4cc`](https://github.com/meta/astryx/commit/1d247e4cc) fix(cli): integration checks catch pairing, root and package.json mistakes, and stop crashing on them (#7777)
  - 不适用：integration check 的配对、根目录、package.json 检查，我们没有集成包体系
- [ ] [`2e9add0c9`](https://github.com/meta/astryx/commit/2e9add0c9) feat(cli): host entry for a tool that carries the CLI (#7420)
- [x] [`d4ade4a04`](https://github.com/meta/astryx/commit/d4ade4a04) spec(knowledge): every current record is reachable from a path; records declare paths no other link reaches (#7794)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b3c7554ec`](https://github.com/meta/astryx/commit/b3c7554ec) fix(test-utils): decode this CLI's folder from its file URL, not its URI path (#7805)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b7e33f1d0`](https://github.com/meta/astryx/commit/b7e33f1d0) refactor(cli): build and search answer through one shared dispatcher/searcher pattern (#7752)
- [x] [`c08a49fa6`](https://github.com/meta/astryx/commit/c08a49fa6) fix(cli): integration check lists the pairing, root and package.json findings without failing --strict (#7810)
  - 不适用：integration check --strict 的判定调整，我们没有集成包体系
- [x] [`eff0b72ac`](https://github.com/meta/astryx/commit/eff0b72ac) feat(cli): integration check flags component names that do not resolve: a doc name its import does not export, and a block naming no component (#7783)
  - 不适用：integration check 检查集成包文档里的组件名能否解析，我们没有集成包体系
- [ ] [`b1e1936bb`](https://github.com/meta/astryx/commit/b1e1936bb) fix(core): provide dataVars defaults in prebuilt CSS (#7694)
- [ ] [`b74cf213e`](https://github.com/meta/astryx/commit/b74cf213e) fix(cli): init writes agent docs every agent reads, at the project root, never in the home folder (#7497)
- [ ] [`2583fe68e`](https://github.com/meta/astryx/commit/2583fe68e) docs(cli): add the is-my-code-good guide (#7259)
- [x] [`e9694dcf8`](https://github.com/meta/astryx/commit/e9694dcf8) fix(cli): integration check findings say plainly what is wrong and how to fix it (#7787)
  - 不适用：integration check 报错措辞，我们没有集成包体系
- [ ] [`cb489ffbc`](https://github.com/meta/astryx/commit/cb489ffbc) fix(cli): find Core and configured integrations from any folder in a project (#7492)
- [ ] [`cab6e9031`](https://github.com/meta/astryx/commit/cab6e9031) fix(cli): a Core-scoped lookup of a family member answers with that member (#7838)
- [x] [`968130fb0`](https://github.com/meta/astryx/commit/968130fb0) feat(cli): validate notes each Astryx command a topic writes with a package runner (#7746)
  - 不适用：validate 标出集成包文档里用包运行器写的命令，我们没有集成包体系
- [ ] [`f94e96229`](https://github.com/meta/astryx/commit/f94e96229) search: reuse the entry index while the catalog is unchanged (#7865)
- [ ] [`641d08e46`](https://github.com/meta/astryx/commit/641d08e46) docs(cli): give every doc a named home; authoring owns integration authoring (#7835)
- [ ] [`c5e01c026`](https://github.com/meta/astryx/commit/c5e01c026) fix(cli): make check:cli-structure enforce the command file layout (#6515)
- [ ] [`d6ee72b79`](https://github.com/meta/astryx/commit/d6ee72b79) feat(docsite): search panel runs the CLI's own search (#7830)
- [ ] [`0bf23bdbf`](https://github.com/meta/astryx/commit/0bf23bdbf) docs(cli): a Use integrations guide, so consumer queries find consumer docs first (#7153)
- [x] [`84c7b4f64`](https://github.com/meta/astryx/commit/84c7b4f64) feat(cli): integration check lists imports apps cannot use: undeclared exports subpaths, other packages, and template imports outside the root (#7779)
  - 不适用：integration check 列出应用用不了的导入，我们没有集成包体系
- [ ] [`ea6860674`](https://github.com/meta/astryx/commit/ea6860674) build: pick the kit's blocks from search's own block results (#7832)
- [x] [`425e78f57`](https://github.com/meta/astryx/commit/425e78f57) fix(cli): note when an installed integration needs another CLI release (#7148)
  - 不适用：已安装集成包要求另一版 CLI 时提示，我们没有集成包体系
- [ ] [`f8fad28c2`](https://github.com/meta/astryx/commit/f8fad28c2) search: a test guards the entry index cache against stale reuse (#7885)
- [x] [`1391928cf`](https://github.com/meta/astryx/commit/1391928cf) feat(cli): integration check lists imported names a module does not export, and templates with no default export (#7786)
  - 不适用：integration check 列出模块未导出的名字和缺默认导出的模板，我们没有集成包体系
- [x] [`8243c42a5`](https://github.com/meta/astryx/commit/8243c42a5) fix(cli,docsite): keep the docs site's search function small enough to deploy (#7896)
  - 不适用：上游文档站搜索函数体积和 integration check 的路径写法，我们都没有
- [x] [`82a877659`](https://github.com/meta/astryx/commit/82a877659) fix(cli): install advice in a non-Astryx folder names the project (#7850)
  - 不适用：上游每日提示、更新通知在非 Astryx 子目录里指向上层项目；我们没有这些提示，doctor 只读 --cwd 指定的目录
- [ ] [`be423330b`](https://github.com/meta/astryx/commit/be423330b) fix(cli): the global skill gives a concrete build workflow (#7893)
- [ ] [`296edaf9e`](https://github.com/meta/astryx/commit/296edaf9e) feat(cli): put the likely entry first in failed-lookup suggestions (#7876)
- [ ] [`6856cfa4e`](https://github.com/meta/astryx/commit/6856cfa4e) build: rank every block by what the request means, from its own docs (#7897)
- [ ] [`d421aed20`](https://github.com/meta/astryx/commit/d421aed20) build: refit the block picker on more varied example requests (#7904)
- [x] [`e0afabedb`](https://github.com/meta/astryx/commit/e0afabedb) test(cli): wait for a SIGKILLed package manager to disappear before asserting it is gone (#7905)
  - 不适用：只改上游测试（自动初筛）
- [x] [`04c746814`](https://github.com/meta/astryx/commit/04c746814) fix(cli): the global skill names the install step when astryx is not found (#7888)
  - 不适用：计算机级技能文本（init --user）找不到全局 astryx 时的安装提示，我们没有全局技能和全局安装模式
- [x] [`948e75d36`](https://github.com/meta/astryx/commit/948e75d36) [Component Audit] DropdownMenuItem: make action states reviewable (#7907)
  - 不适用：只改上游测试（自动初筛）
- [x] [`fba04ed6a`](https://github.com/meta/astryx/commit/fba04ed6a) search: find a template by its display name (#7895)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`2f47a4afe`](https://github.com/meta/astryx/commit/2f47a4afe) [Component Audit] DropdownMenuRadioGroup: let builders reach the group root (#7911)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`425f762d6`](https://github.com/meta/astryx/commit/425f762d6) build: a template the word weights do not list competes on its own words (#7901)

### v0.7.4

- [x] [`813c1d59e`](https://github.com/meta/astryx/commit/813c1d59e) Share theme palette reference generation (#7678)
  - 不适用：上游 theme palette generate 调色板生成器，我们的 CLI 没有这个命令
- [x] [`346e3595d`](https://github.com/meta/astryx/commit/346e3595d) [CLI] integration verify works on npm 8 for scoped packages (#7933)
  - 不适用：integration verify 在 npm 8 下处理 scoped 包，我们没有集成包体系
- [ ] [`33b8bfe66`](https://github.com/meta/astryx/commit/33b8bfe66) [CLI] Discover results name their source package and tolerate typos (#7147)
- [x] [`ad95f6100`](https://github.com/meta/astryx/commit/ad95f6100) [CLI] astryx doctor --built checks a built page or its source (#7886)
  - 不适用：doctor --built 扫描构建产物里的 Astryx 用法和 React 源码纯度，我们的 CLI 没有构建产物检查
- [x] [`1b56e001e`](https://github.com/meta/astryx/commit/1b56e001e) [CLI] doctor --built does not count type-only Astryx imports as use (#7945)
  - 不适用：doctor --built 不把仅类型导入算作使用，我们没有 --built
- [ ] [`faa934f8c`](https://github.com/meta/astryx/commit/faa934f8c) docs(ListInput): add a docsite showcase and three example blocks (#7953)
- [ ] [`20230c652`](https://github.com/meta/astryx/commit/20230c652) search: find a family member by its name spelled out (#7927)
- [ ] [`ac8260d33`](https://github.com/meta/astryx/commit/ac8260d33) feat(cli): integration docs replace or extend a CLI guide by its route, and place sections with before/after (#7936)
- [ ] [`4145101a4`](https://github.com/meta/astryx/commit/4145101a4) [CLI] Project agent docs check a build with doctor --built before delivering it (#7944)
- [ ] [`ccdb1b8b5`](https://github.com/meta/astryx/commit/ccdb1b8b5) docs: tidy six guide titles and fix two broken links (#7934)
- [ ] [`1a552f29b`](https://github.com/meta/astryx/commit/1a552f29b) [CLI] Doc syntax: {@command}, {@pm}, {@pm-only} tokens, and integration check --next (#7868)
- [ ] [`626f01ec7`](https://github.com/meta/astryx/commit/626f01ec7) search: a family word lists the family's first members (#7955)
- [x] [`78641f811`](https://github.com/meta/astryx/commit/78641f811) [CLI] Integration checks for component examples, showcases, template categories and packed assets (#7891)
  - 不适用：集成包的示例、展示、模板分类检查和 {@command}/{@pm} 文档语法，我们没有集成包体系和这套语法
- [ ] [`4fc0c4a48`](https://github.com/meta/astryx/commit/4fc0c4a48) feat(cli): experimental icon sets — icon definitions, `astryx experimental icon`, templates that use the installed set (#7759)
- [ ] [`1a3162220`](https://github.com/meta/astryx/commit/1a3162220) search: order tied results below the first by fit, not by name (#7959)
- [x] [`768c2f0f6`](https://github.com/meta/astryx/commit/768c2f0f6) [Component Audit] CommandPaletteItem: let themes style highlighted, selected, and disabled items (#7967)
  - 不适用：只改上游测试（自动初筛）
- [x] [`d648470ad`](https://github.com/meta/astryx/commit/d648470ad) [Component Audit] DateInput: busy fields stop looking disabled (#7968)
  - 不适用：只改上游测试（自动初筛）

### v0.7.5

- [ ] [`509557499`](https://github.com/meta/astryx/commit/509557499) fix(cli): finish MobilePowerSearch discovery integration (#7983)
- [ ] [`557ee8f46`](https://github.com/meta/astryx/commit/557ee8f46) fix(cli): read family members from the source condition so the official list does not depend on a build (#7996)
- [ ] [`6e4e335fa`](https://github.com/meta/astryx/commit/6e4e335fa) cli: suggest a component named inside a longer name (#7975)
- [ ] [`2a50a8064`](https://github.com/meta/astryx/commit/2a50a8064) feat(cli): experimental icon sets — authoring fixes from fresh-agent Heroicons and Lucide runs (#7964)
- [ ] [`7b32a9306`](https://github.com/meta/astryx/commit/7b32a9306) feat(cli): experimental `astryx experimental render` — a page to one self-contained HTML file, and back (#7958)
- [x] [`10930261f`](https://github.com/meta/astryx/commit/10930261f) docs(Badge): mark label as required, as its props type is (#8008)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`298a4ce17`](https://github.com/meta/astryx/commit/298a4ce17) fix(cli): stop not-found suggestions where the matches get weaker (#7999)
- [x] [`3921ae03b`](https://github.com/meta/astryx/commit/3921ae03b) test(cli): clear the shared linkSync mock so the EPERM publish tests pass in any order (#8011)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`fccd7713e`](https://github.com/meta/astryx/commit/fccd7713e) fix(cli): a long-running caller sees an edit to a doc file it already read (#7998)
- [x] [`6b350a2a3`](https://github.com/meta/astryx/commit/6b350a2a3) fix(cli): integration verify starts npm the way the rest of the CLI does (#8019)
  - 不适用：integration verify 启动 npm 的方式，我们没有集成包体系
- [x] [`a8ef89f26`](https://github.com/meta/astryx/commit/a8ef89f26) [Component Audit] DropdownMenuRadioItem: caller click and hover handlers now run on radio rows (#8191)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3dd95a046`](https://github.com/meta/astryx/commit/3dd95a046) fix(cli): only migrate theme-shaped objects proven to be Astryx themes (#7980)
- [ ] [`04434e7de`](https://github.com/meta/astryx/commit/04434e7de) fix(cli): add the upgrade receipt to the codemod failure error (#7993)
- [x] [`a8b78c5e5`](https://github.com/meta/astryx/commit/a8b78c5e5) [Component Audit] DropdownMenuSubMenu: docs match the shipped props and RTL flyout placement is measured (#8227)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e8ef708e7`](https://github.com/meta/astryx/commit/e8ef708e7) feat(cli): report manual migrations and regeneration apart from codemod failures (#7995)
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [x] [`9600039ee`](https://github.com/meta/astryx/commit/9600039ee) [Component Audit] CommandPaletteEmpty: keep long empty messages readable inside the palette (#8516)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a61449851`](https://github.com/meta/astryx/commit/a61449851) fix(cli): detect @stylexjs/unplugin as a StyleX compiler (#8564)
- [x] [`2a162e1b6`](https://github.com/meta/astryx/commit/2a162e1b6) feat(core): BottomSheet stacks by open order, replaces on a same-update switch, and BottomSheetSwitcher is deprecated (#7648)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1b8e9103f`](https://github.com/meta/astryx/commit/1b8e9103f) docs(theme): an extending theme's motion inherits field by field (#8748)
- [ ] [`05ead02aa`](https://github.com/meta/astryx/commit/05ead02aa) feat(Icon): a theme icon entry can be a function of the requested size (#8753)
- [ ] [`db584bcb0`](https://github.com/meta/astryx/commit/db584bcb0) feat(Icon): a theme's width and height on an Icon size set its glyph dimension (#8759)
- [ ] [`dae174730`](https://github.com/meta/astryx/commit/dae174730) feat(theme): a theme lists its icon variant names once (#8756)
- [ ] [`33645a2d2`](https://github.com/meta/astryx/commit/33645a2d2) feat(Icon): request a theme's alternate icon artwork with variant (#8758)
- [x] [`031a63980`](https://github.com/meta/astryx/commit/031a63980) fix(cli): theme build reports a theme module that fails to load instead of reading its text (#8767)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`f01c61d53`](https://github.com/meta/astryx/commit/f01c61d53) fix(cli): theme build names the Core that failed to load instead of building with the CLI's own (#8786)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`eb3e53943`](https://github.com/meta/astryx/commit/eb3e53943) feat(cli): built themes keep function icon entries and type their icon variants (#8785)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`6162917e8`](https://github.com/meta/astryx/commit/6162917e8) feat(useCombobox): a combobox over a text field the caller renders (#7732)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
- [ ] [`c9066fe8b`](https://github.com/meta/astryx/commit/c9066fe8b) feat(tokens): add --ease-exit, the curve BottomSheet already closes on (#8004)

### v0.7.6

- [x] [`ee1f56d07`](https://github.com/meta/astryx/commit/ee1f56d07) test(cli): PowerShell's cold start no longer times out the first commandInFolder test (#8530)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7f3531b4a`](https://github.com/meta/astryx/commit/7f3531b4a) test(cli): the import-hint test builds its fixture outside the source tree, where the docs-drift scan never finds it (#8915)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f47864693`](https://github.com/meta/astryx/commit/f47864693) test(cli): the public-import findings claim runs one whole check per case (#8923)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0ef60ddb6`](https://github.com/meta/astryx/commit/0ef60ddb6) feat(core): a theme's motion takes tempo and character (#8661)
- [x] [`f3daac4a4`](https://github.com/meta/astryx/commit/f3daac4a4) test(cli): G49's three claims each get their own case and budget (#9074)
  - 不适用：只改上游测试（自动初筛）
- [x] [`014f1ca7e`](https://github.com/meta/astryx/commit/014f1ca7e) test(cli): the doctor --built file-limit case builds its 20,001 files cheaply, within the default budget (#9076)
  - 不适用：只改上游测试（自动初筛）
- [x] [`340cc7c8c`](https://github.com/meta/astryx/commit/340cc7c8c) test(cli): integration fixtures carry their own TypeScript config, so a prop check reads the fixture, not the repository (#9075)
  - 不适用：只改上游测试（自动初筛）
- [x] [`abf156aec`](https://github.com/meta/astryx/commit/abf156aec) fix(packages): exclude tests and benchmarks from tarballs (#9153)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7cf597944`](https://github.com/meta/astryx/commit/7cf597944) spec(AST-110): a swizzled component builds on its own and behaves like the package (#9190)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c6594e60c`](https://github.com/meta/astryx/commit/c6594e60c) test(cli): the icons-specifier watch test stops restarting the rebuild it waits for (#9222)
  - 不适用：只改上游测试（自动初筛）
- [x] [`faf600717`](https://github.com/meta/astryx/commit/faf600717) test(cli): check the two-docs components report in two tests, one doctor run each (#9225)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9b7da999b`](https://github.com/meta/astryx/commit/9b7da999b) test(cli): the two-theme watch test waits for the watcher to be ready, not an 8 s file poll (#9239)
  - 不适用：只改上游测试（自动初筛）
- [x] [`13412a4df`](https://github.com/meta/astryx/commit/13412a4df) ci: each published package commits a generated public API report, with advisory API changes for the PR report (#9241)
  - 不适用：上游 API 报告（自动初筛）
- [ ] [`e1e704b45`](https://github.com/meta/astryx/commit/e1e704b45) docs(motion): under Reduce Motion, touch cross-fades and a mouse changes at once (#8615)
- [x] [`eae71cb89`](https://github.com/meta/astryx/commit/eae71cb89) test(cli): the components fields test prints its text from the JSON run's response, one doctor run (#9284)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9c1c14f1a`](https://github.com/meta/astryx/commit/9c1c14f1a) test: each command that prints the integration-issue nudge is its own test, so one slow spawn no longer spends the whole test's budget (#9322)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8c15f9975`](https://github.com/meta/astryx/commit/8c15f9975) [Component Audit] GridSpan: accessibility and RTL audits now reach spanned grid items (#9312)
  - 不适用：只改上游测试（自动初筛）
- [x] [`63ba726bf`](https://github.com/meta/astryx/commit/63ba726bf) test(cli): the redactor cost cases measure this process's CPU time, not wall time (#9340)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4acf418c3`](https://github.com/meta/astryx/commit/4acf418c3) test(cli): global-local's fresh-clone doctor case starts no update check (#9421)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`83f5da1f0`](https://github.com/meta/astryx/commit/83f5da1f0) perf(cli): read each included file as TypeScript once while it is unchanged (#9422)
- [ ] [`c117b0c7d`](https://github.com/meta/astryx/commit/c117b0c7d) perf(cli): share a running catalog gather between searches (#9460)
- [x] [`259a6699b`](https://github.com/meta/astryx/commit/259a6699b) test(cli): the door-conformance runs decode child output as UTF-8 across chunks (#9549)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`61e061cb5`](https://github.com/meta/astryx/commit/61e061cb5) feat: replace demo-content elements on every copy and every surface that hands out example source (#9430)

### v0.7.7

- [x] [`032c4a142`](https://github.com/meta/astryx/commit/032c4a142) chore(api): regenerate the core and CLI API reports (#9589)
  - 不适用：上游 API 报告（自动初筛）
- [x] [`723e04539`](https://github.com/meta/astryx/commit/723e04539) feat(Slider): every pointer drags a thumb by its travel, as UISlider does (#8190)
  - 不适用：只改上游测试（自动初筛）
- [x] [`637d2352c`](https://github.com/meta/astryx/commit/637d2352c) docs(useCombobox): add an assign-to field example block (#9576)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`449486fdc`](https://github.com/meta/astryx/commit/449486fdc) feat(core): promote InfoTip from Lab as the info preset over Tooltip's press toggle (#9238)
- [x] [`dfa7ae023`](https://github.com/meta/astryx/commit/dfa7ae023) test(cli): six CLI test files leave nothing in the system temp directory (#9468)
  - 不适用：只改上游测试（自动初筛）
- [x] [`df81eb489`](https://github.com/meta/astryx/commit/df81eb489) test(cli): G58 reads the project CLI's pid only once it is whole, and waits for it on the run, not a clock (#9552)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c7a5c239e`](https://github.com/meta/astryx/commit/c7a5c239e) test(cli): doctor-integration, validate-integration and check-failures fixtures check their own files (#9496)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4931743e4`](https://github.com/meta/astryx/commit/4931743e4) perf(cli): doc types and props checks reuse parsed files (TS 5.3+) (#9517)

### v0.7.8

- [x] [`c40d382f9`](https://github.com/meta/astryx/commit/c40d382f9) perf(cli): discovery reads its listings; CLI tests warm up once (#9722)
  - 不适用：上游 discovery 读清单的性能优化和测试预热，我们没有这套 discovery
- [x] [`871bc3d5e`](https://github.com/meta/astryx/commit/871bc3d5e) feat(core): createAnimator and useAnimator animate one element (#8653)
  - 不适用：只改上游测试（自动初筛）
- [x] [`58c5b8ab4`](https://github.com/meta/astryx/commit/58c5b8ab4) test(cli): global-local's heaviest tests are split by case (#9746)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`df92fb83c`](https://github.com/meta/astryx/commit/df92fb83c) fix(cli): sync:api-types emits into a temp directory of its own (#8412)
- [x] [`89255718a`](https://github.com/meta/astryx/commit/89255718a) [Component Audit] IconButton: every prop is documented, and square targets are proven in a browser (#9757)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9136e28c7`](https://github.com/meta/astryx/commit/9136e28c7) feat: a single-choice set of selectable cards is a radio group (lab SelectableCardGroup) (#8260)
- [x] [`ad978cdde`](https://github.com/meta/astryx/commit/ad978cdde) fix(docsite): the production registry waits for a release to export what an example imports (#9759)
  - 不适用：上游文档站 ShadCN 生产注册表，和我们无关
- [ ] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
- [x] [`6854bc974`](https://github.com/meta/astryx/commit/6854bc974) test(cli): the killed npm cases wait for the guard to act, not for a clock (#9519)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1404bf84e`](https://github.com/meta/astryx/commit/1404bf84e) docs(useFocusTrap): add a quick edit panel example block (#9513)
  - 不适用：只改上游测试（自动初筛）
- [x] [`626361d41`](https://github.com/meta/astryx/commit/626361d41) test(cli): experimental-isolation reads every docs topic in one process (#9806)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`36cde5e8c`](https://github.com/meta/astryx/commit/36cde5e8c) chore(cli): a gap-report handler's budget starts after its module loads (#9804)
- [x] [`5a373dfa0`](https://github.com/meta/astryx/commit/5a373dfa0) test(cli): integration-block-exports bundles its consumer outside the system temp directory (#9449)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`15a98a187`](https://github.com/meta/astryx/commit/15a98a187) fix(cli): a re-cased component name never resolves through a module (#8350)
- [x] [`55aaeda1e`](https://github.com/meta/astryx/commit/55aaeda1e) test(cli): the fresh-scaffold check reads its own TypeScript config, not the repository's (#9493)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a7e7d4516`](https://github.com/meta/astryx/commit/a7e7d4516) docs(Icon): the color doc type lists the palette; native keeps the semantic set (#9821)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b95497d2d`](https://github.com/meta/astryx/commit/b95497d2d) test: main is green again: Tokenizer's sheet-row test passes presentation, and the recorded module resolutions follow core (#9851)
  - 不适用：只改上游测试（自动初筛）
- [x] [`721bba9d6`](https://github.com/meta/astryx/commit/721bba9d6) docs(useHotkeys): add a search and help shortcuts example block (#9508)
  - 不适用：只改上游测试（自动初筛）
- [x] [`16a5397c9`](https://github.com/meta/astryx/commit/16a5397c9) feat(Calendar): weekday headers show abbreviated names where all seven fit in four characters (#9824)
  - 不适用：只改上游测试（自动初筛）
- [x] [`93484190b`](https://github.com/meta/astryx/commit/93484190b) test(cli): pack-check builds its ocean theme fixture once per file (#9813)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0d54fd3e7`](https://github.com/meta/astryx/commit/0d54fd3e7) fix(theme): add the --duration-exit token, defaulting to --duration-fast (#9798)
- [x] [`859df5f49`](https://github.com/meta/astryx/commit/859df5f49) test(cli): door-conformance removes each run's folder once it has read it (#9453)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1800b47b3`](https://github.com/meta/astryx/commit/1800b47b3) perf(cli): a run of astryx loads only the command it names (#9822)
- [x] [`ffd29c58b`](https://github.com/meta/astryx/commit/ffd29c58b) docs(useInputStatusIcon): add a minimal live example (#9714)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ea33dafd5`](https://github.com/meta/astryx/commit/ea33dafd5) feat(docsite): label deprecated components from their doc (#9046)
- [x] [`8c2262460`](https://github.com/meta/astryx/commit/8c2262460) docs(useTreeFocus): add a keyboard file tree example block (#9617)
  - 不适用：只改上游测试（自动初筛）
- [x] [`510f96d5f`](https://github.com/meta/astryx/commit/510f96d5f) test(cli): build.family's fixtures live in the OS temp directory, not in the CLI's source tree (#9875)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`442f2ddd4`](https://github.com/meta/astryx/commit/442f2ddd4) perf(cli): search parses a page template only when a term can match it (#9871)
- [x] [`3ae8349fe`](https://github.com/meta/astryx/commit/3ae8349fe) test(cli): theme build fixtures live in the OS temp directory, not inside packages/cli (#9892)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b31575d73`](https://github.com/meta/astryx/commit/b31575d73) test(cli): doctor --built's file-limit case reads a 50-file limit (#9897)
  - 不适用：doctor --built 文件上限的测试调整，我们没有 --built
- [ ] [`0588a1342`](https://github.com/meta/astryx/commit/0588a1342) feat(core): one on-screen keyboard module; a Tall BottomSheet reads it and rides Gboard's slides (#8559)

### v0.7.9

- [ ] [`d0a310646`](https://github.com/meta/astryx/commit/d0a310646) fix(cli): searchCore reuses the gathered candidates, as search does (#8512)
- [x] [`eecdef05e`](https://github.com/meta/astryx/commit/eecdef05e) test(cli): placed CLI copies share the packed templates and icons (#9931)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6a1b47efb`](https://github.com/meta/astryx/commit/6a1b47efb) test(cli): provider-ledger removes each seed's folder once it read it (#9896)
  - 不适用：只改上游测试（自动初筛）
- [x] [`df5aded8c`](https://github.com/meta/astryx/commit/df5aded8c) test(cli): global-local reuses placed CLI copies a test left unchanged (#9932)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c1ff98e02`](https://github.com/meta/astryx/commit/c1ff98e02) test(cli): the theme watch tests wait on the watcher's own output and exit, not a clock (#9784)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4d84e2d1b`](https://github.com/meta/astryx/commit/4d84e2d1b) test(cli): render, codemod and doctor fixtures live in the OS temp directory (#9899)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2c90cc494`](https://github.com/meta/astryx/commit/2c90cc494) perf(cli): gatherCandidates runs in its own listing-cache operation (#9943)
- [x] [`1181a20f9`](https://github.com/meta/astryx/commit/1181a20f9) test(cli): resolve-theme's icon-registry case links stone's dependencies (#9952)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9a4627b50`](https://github.com/meta/astryx/commit/9a4627b50) perf(cli): a standalone theme build loads Core's root only on import (#9941)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`4f5257f65`](https://github.com/meta/astryx/commit/4f5257f65) test(cli): the node project packs the CLI once for every suite (#9935)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`504ee1863`](https://github.com/meta/astryx/commit/504ee1863) fix(theme): the stock theme's dark-mode accent is darker, so white button text meets 4.5:1 (#9818)
- [ ] [`048476f1c`](https://github.com/meta/astryx/commit/048476f1c) fix(cli): a namespace section read loads the project once, not once per guide below it (#8504)
- [x] [`02c7228a8`](https://github.com/meta/astryx/commit/02c7228a8) perf(cli): a run loads the project and integration modules on use (#9855)
  - 不适用：上游按需加载 jscodeshift/zod 等重模块的启动优化；我们的 CLI 没有运行时依赖
- [ ] [`f8a309da0`](https://github.com/meta/astryx/commit/f8a309da0) test(cli): the main searcher's test checks the count contract per query (#9996)
- [ ] [`45f77d085`](https://github.com/meta/astryx/commit/45f77d085) fix(cli): a crashed run's release install is recognized by the Node it ran on, whatever its name (#8520)
- [ ] [`bb7702ce0`](https://github.com/meta/astryx/commit/bb7702ce0) perf(cli): findComponentReadme probes only folders that hold the name (#9904)
- [ ] [`9cba0a867`](https://github.com/meta/astryx/commit/9cba0a867) docs(i18n): a Calendars guide page for other calendar systems (#10017)
- [x] [`68507bbe5`](https://github.com/meta/astryx/commit/68507bbe5) fix(cli): theme build scans the icon import from the source it loaded (#8598)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`3139560ab`](https://github.com/meta/astryx/commit/3139560ab) test(cli): the node suites rebuild a Core build older than its sources (#8567)
- [ ] [`e2b522f83`](https://github.com/meta/astryx/commit/e2b522f83) perf(cli): a project with no integration skips its issue passes (#9965)
- [ ] [`086a500b3`](https://github.com/meta/astryx/commit/086a500b3) fix(cli): swizzle finds gh on PATH instead of running gh auth status (#8626)
- [x] [`46803c55c`](https://github.com/meta/astryx/commit/46803c55c) test(cli): the doctor golden's project installs Core's peers itself, so where the checkout lives cannot change the result (#10001)
  - 不适用：只改上游测试（自动初筛）
- [x] [`2f035fef4`](https://github.com/meta/astryx/commit/2f035fef4) test(cli): runCli builds only the commands its arguments need (#10010)
  - 不适用：只改上游测试（自动初筛）
- [x] [`53fa23739`](https://github.com/meta/astryx/commit/53fa23739) test(cli): version runs, -V and --json too, load no large CLI module (#10016)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`189a730ce`](https://github.com/meta/astryx/commit/189a730ce) feat(DateInput, DateTimeInput, DateRangeInput): type, pick and show dates in the active calendar (#9643, #9842)
- [ ] [`e657e2e6a`](https://github.com/meta/astryx/commit/e657e2e6a) perf(cli): issues() reads Core templates only for integration templates (#10008)
- [ ] [`f1f92c3cb`](https://github.com/meta/astryx/commit/f1f92c3cb) perf(cli): search computes a typo's distance only within its cap (#10030)
- [ ] [`6f3befa82`](https://github.com/meta/astryx/commit/6f3befa82) feat(lab): CircleCheckIndicator, the iOS multiple-selection circle (#9723)
- [x] [`66f5a07df`](https://github.com/meta/astryx/commit/66f5a07df) test(cli): debug-result-summary times each case on its own command (#9876)
  - 不适用：只改上游测试（自动初筛）
- [x] [`159aceb8e`](https://github.com/meta/astryx/commit/159aceb8e) test(cli): the docs-scan case reads the scan's walk, not every doc (#10060)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`35bbaee4f`](https://github.com/meta/astryx/commit/35bbaee4f) perf(cli): the manifest writer loads jscodeshift only to patch (#10051)
- [ ] [`0236bb8fc`](https://github.com/meta/astryx/commit/0236bb8fc) perf(cli): search works out a term's forms once per entry (#10036)
- [ ] [`5876379c7`](https://github.com/meta/astryx/commit/5876379c7) perf(cli): resolveImportPath reads Core's exports once per operation (#9886)
- [x] [`f384e62f5`](https://github.com/meta/astryx/commit/f384e62f5) docs(useIcon): add hook docs and a status row example block (#9900)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7d6481ef3`](https://github.com/meta/astryx/commit/7d6481ef3) feat(core): createPanGesture and usePanGesture report a drag as values (spec:AST-107 FR1, FR6) (#8655)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`87ed8d081`](https://github.com/meta/astryx/commit/87ed8d081) fix(cli): swizzle copies the private attribute owner modules a component imports (#10085)
- [x] [`7b831ae03`](https://github.com/meta/astryx/commit/7b831ae03) docs(useLinkComponent): add hook docs and an article card example block (#9901)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e423ffac5`](https://github.com/meta/astryx/commit/e423ffac5) test(cli): integration check's test warms its checks up once (#10074)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ceefccdfc`](https://github.com/meta/astryx/commit/ceefccdfc) feat(core): the animator's springs follow the theme's tempo (#8677)
- [ ] [`98efdf183`](https://github.com/meta/astryx/commit/98efdf183) feat(Icon): a theme maps a component's own icon role by slot, starting with CodeBlock's copy button (#9828)
- [x] [`7fb5cab36`](https://github.com/meta/astryx/commit/7fb5cab36) feat(cli): built themes keep componentIcons slot functions (#9829)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`5d7503bc2`](https://github.com/meta/astryx/commit/5d7503bc2) fix(theme): support CustomTextTypes module augmentation (#5013) (#5029)
  - 不适用：theme build 为 CustomTextTypes 的 TS 模块扩充生成类型，属 StyleX 主题构建，我们没有
- [x] [`c8a172b4b`](https://github.com/meta/astryx/commit/c8a172b4b) docs(useOverlay): add hook docs and a product quick view example block (#9908)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a4dd70eb1`](https://github.com/meta/astryx/commit/a4dd70eb1) docs(useCalendarDays): add hook docs and a month grid example block (#9905)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9e3d9f51c`](https://github.com/meta/astryx/commit/9e3d9f51c) perf(cli): doctor and family builds load an installed Core's root only when the load requires it (#8644)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`7b87e121f`](https://github.com/meta/astryx/commit/7b87e121f) docs(useInputContainer): add a search field wrapper example block (#9619)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5f8a80903`](https://github.com/meta/astryx/commit/5f8a80903) docs(useTableSortableState): add hook docs and a multi-sort orders example block (#9911)
  - 不适用：只改上游测试（自动初筛）
- [x] [`92947d98f`](https://github.com/meta/astryx/commit/92947d98f) test: three suites pass without the NODE_PATH pnpm's bin shim sets (#10088)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4e4cf84d2`](https://github.com/meta/astryx/commit/4e4cf84d2) feat(lab): NavigationStack, push/pop navigation that moves like UINavigationController (#9697)

### v0.7.10

- [x] [`e8ecde4ff`](https://github.com/meta/astryx/commit/e8ecde4ff) fix(core): a button's touch press release runs on the compositor (#9783)
  - 不适用：只改上游测试（自动初筛）
- [x] [`70597367f`](https://github.com/meta/astryx/commit/70597367f) fix(DropdownMenu, ContextMenu): Tab from any sub-menu level closes the whole menu (#8870)
  - 不适用：只改上游测试（自动初筛）
- [x] [`62f5ebc5e`](https://github.com/meta/astryx/commit/62f5ebc5e) docs(useMultiCombobox): add an issue labels example block (#9578)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a789c8cd7`](https://github.com/meta/astryx/commit/a789c8cd7) feat(core): createDragToSnapPoints and useDragToSnapPoints settle an element on snap points (#8658)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0cc540700`](https://github.com/meta/astryx/commit/0cc540700) feat(lab): PageControl, UIPageControl's indicators: a tap steps a page, a finger scrubs, every pointer pages (#9684)
- [x] [`128e2180f`](https://github.com/meta/astryx/commit/128e2180f) fix(cli): drop the CLI's unused theme, Lab and Charts peers, and check published @astryxdesign versions (#10232)
  - 不适用：只改上游测试（自动初筛）

### v0.7.11

- [ ] [`032679288`](https://github.com/meta/astryx/commit/032679288) docs(cli): upgrade every Astryx package together (#10241)
- [x] [`6f2f02f3b`](https://github.com/meta/astryx/commit/6f2f02f3b) test(cli): two agent-docs tests remove their links with unlinkSync (#10263)
  - 不适用：只改上游测试（自动初筛）
- [x] [`88e223205`](https://github.com/meta/astryx/commit/88e223205) docs(architecture): stage CLN-0029, the CLI's Core peer at its own release, for 0.8.0 (#10253)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f31026bf4`](https://github.com/meta/astryx/commit/f31026bf4) test(cli): remove packed-CLI fixtures once per run, not in file hooks (#10269)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`23081b997`](https://github.com/meta/astryx/commit/23081b997) perf(cli): list each folder once per read, and reuse it while unchanged (#10274)
- [x] [`3c7d1b2f3`](https://github.com/meta/astryx/commit/3c7d1b2f3) test(cli): search goldens and the readme probe read the catalog once (#10273)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`d34fe915a`](https://github.com/meta/astryx/commit/d34fe915a) perf(cli): the component matcher finds each doc once per operation (#10277)
- [x] [`047cc30e4`](https://github.com/meta/astryx/commit/047cc30e4) fix(cli): theme build's built-in value index does not depend on doc order (#10288)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`a477abd53`](https://github.com/meta/astryx/commit/a477abd53) test(cli): provider-ledger loads the code under test natively (#10311)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6b9f734dc`](https://github.com/meta/astryx/commit/6b9f734dc) test(cli): template show and icon pairs keep fixtures in the run folder (#10325)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9ee9c06ad`](https://github.com/meta/astryx/commit/9ee9c06ad) perf(cli): a hook read lists each folder once (#10324)
- [x] [`755206df2`](https://github.com/meta/astryx/commit/755206df2) test(cli): catalog-heavy tests load their code under test natively (#10328)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8f479887d`](https://github.com/meta/astryx/commit/8f479887d) fix(cli): links to a topic an integration replaces under the same name open the replacement (#10342)
- [x] [`64143c6f0`](https://github.com/meta/astryx/commit/64143c6f0) fix(cli): verify ignores the command a built theme module says built it (#10344)
  - 不适用：verify 忽略构建好的主题模块里记录的构建命令，属 theme build，我们没有
- [ ] [`556835044`](https://github.com/meta/astryx/commit/556835044) docs: the Authoring guides carry the keyword "authoring" (#10354)
- [ ] [`8b6b81060`](https://github.com/meta/astryx/commit/8b6b81060) fix(cli): swizzle leaves out browser test harnesses (#10230)
- [ ] [`44a0c628b`](https://github.com/meta/astryx/commit/44a0c628b) docs(cli): the custom themes guide names a local theme's files (#10347)
- [ ] [`dcafd9610`](https://github.com/meta/astryx/commit/dcafd9610) build: name the alternatives in the order the start is chosen from (#10357)
- [ ] [`1a348eefa`](https://github.com/meta/astryx/commit/1a348eefa) docs(cli): build --type lists every domain it accepts (#10361)
- [x] [`aaa33dfff`](https://github.com/meta/astryx/commit/aaa33dfff) test(cli): build's tree and the no-npm checks load their code natively (#10337)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`457c870a0`](https://github.com/meta/astryx/commit/457c870a0) build: refit the block picker's doc-side weights from source-written paraphrases (#10355)
- [ ] [`47949436a`](https://github.com/meta/astryx/commit/47949436a) fix(core): StatusDot status dots paint their icon role (#10204)
- [x] [`58f20adde`](https://github.com/meta/astryx/commit/58f20adde) test(cli): build's tree blocks dns/promises, tls, http2 and dgram too (#10399)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`658c896ec`](https://github.com/meta/astryx/commit/658c896ec) [fix] render: outside a project, take Astryx from the copy the CLI runs with (#10362)
- [x] [`0d62e692f`](https://github.com/meta/astryx/commit/0d62e692f) fix(cli): doctor counts themes an app wires itself (#10353)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。doctor 的主题检查也认 core 的 <Theme>（主题经变量传入也算）和脚本里的 dataset.astryxTheme，补测试和文档
- [x] [`a888b3d93`](https://github.com/meta/astryx/commit/a888b3d93) test(cli): provider-ledger loads through requireNatively (#10364)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b66434e90`](https://github.com/meta/astryx/commit/b66434e90) fix(cli): the setup reminder names the project's release and prints at most once a day (#10343)
- [x] [`fed78ba24`](https://github.com/meta/astryx/commit/fed78ba24) docs(Table): a block that puts row selection in each row's leading mark (#10395)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b3fb292b4`](https://github.com/meta/astryx/commit/b3fb292b4) fix(cli): build --type doc|theme points to search (#10401)
- [ ] [`8b16f6d4d`](https://github.com/meta/astryx/commit/8b16f6d4d) feat(cli): the export reader reports type-only exports on request, in one pass (#10365)
- [ ] [`8b836a3fc`](https://github.com/meta/astryx/commit/8b836a3fc) fix(cli): satisfy partial caret and hyphen semver ranges (#10184)

### v0.7.12

- [ ] [`05e3cb0e1`](https://github.com/meta/astryx/commit/05e3cb0e1) feat(cli): experimental icon sets — wrapping a large real icon library (#8013)
- [ ] [`b6c103808`](https://github.com/meta/astryx/commit/b6c103808) fix(cli): build keeps a leading variant when its family base matches only the family word (#10431)
- [ ] [`3df65bfa2`](https://github.com/meta/astryx/commit/3df65bfa2) Icon sets: reuse topLevel for module declarations; shorten the look-refresh comment (#10449)
- [x] [`c909db9ce`](https://github.com/meta/astryx/commit/c909db9ce) fix(build): a swizzled copy compiles in the library pass, below the theme (#10334)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3bbab18c8`](https://github.com/meta/astryx/commit/3bbab18c8) Align Theme Showcase with Astryx template conventions (#10404)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`79150bc7d`](https://github.com/meta/astryx/commit/79150bc7d) fix(cli): experimental icon sets — name the license notice a library without one needs; a refresh moves per-file icons to the library root (#10458)
- [ ] [`adb756608`](https://github.com/meta/astryx/commit/adb756608) fix(cli): the export reader follows an alias of an imported binding (#10471)
- [ ] [`3c69236c1`](https://github.com/meta/astryx/commit/3c69236c1) fix(cli): swizzle copies the module graph a component reaches (#10197)
- [ ] [`2fde70956`](https://github.com/meta/astryx/commit/2fde70956) fix(cli): list only component directories for swizzle (#10185)
- [ ] [`a646669ab`](https://github.com/meta/astryx/commit/a646669ab) docs(richtext): RichTextView, RichTextEditorToolbar and RichTextEditorAutoLinkPlugin get their own doc files (#10407)
- [x] [`99ab16da2`](https://github.com/meta/astryx/commit/99ab16da2) test(swizzle): cover destination symlinks (#10484)
  - 不适用：只改上游测试（自动初筛）
- [x] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`3231fc223`](https://github.com/meta/astryx/commit/3231fc223) fix(cli): swizzle reports the npm packages a copy imports (#10502)
- [ ] [`c18bc584c`](https://github.com/meta/astryx/commit/c18bc584c) feat(lab): TabBar, iOS 26's floating tab bar, with its selection lens and press tracking (#9700)
- [x] [`227855776`](https://github.com/meta/astryx/commit/227855776) [Component Audit] Layout: a region hidden with && lays out like an omitted one (#10500)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`695653f5d`](https://github.com/meta/astryx/commit/695653f5d) feat(ChatLayout): the composer rides the software keyboard (#8176)
- [ ] [`44b9aa57d`](https://github.com/meta/astryx/commit/44b9aa57d) fix(cli): swizzle marks its output folder so the copy compiles below the theme (#10483)
- [x] [`8091fbc64`](https://github.com/meta/astryx/commit/8091fbc64) docs(useCalendarNavigation): add hook docs and a month pager example block (#10154)
  - 不适用：只改上游测试（自动初筛）
- [x] [`62c7802e8`](https://github.com/meta/astryx/commit/62c7802e8) docs(useCalendarConstraints): add hook docs and a hotel booking range example block (#10151)
  - 不适用：只改上游测试（自动初筛）
- [x] [`2685b3f21`](https://github.com/meta/astryx/commit/2685b3f21) test(build): refresh login form block expectation after catalog growth (#10602)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3b90d333f`](https://github.com/meta/astryx/commit/3b90d333f) feat(cli): experimental exportSearchIndex() and rankSearchIndex() (#10375)
- [ ] [`c9c72973f`](https://github.com/meta/astryx/commit/c9c72973f) feat(cli): open a docs child named without its namespace (#10387)
- [ ] [`13ef762c0`](https://github.com/meta/astryx/commit/13ef762c0) feat(cli): name the docs below each namespace on the topic list with --depth (#10393)
- [ ] [`e0821c1c5`](https://github.com/meta/astryx/commit/e0821c1c5) [experimental] render: draw recharts charts (#10382)
- [ ] [`49e72367e`](https://github.com/meta/astryx/commit/49e72367e) fix(cli): experimental render — tsconfig paths by TypeScript's rules; name a stripped rendered file (#8012)
- [ ] [`72968acd8`](https://github.com/meta/astryx/commit/72968acd8) fix(cli): swizzle carries another Astryx package's internal modules, except exported StyleX modules (#10595)
- [x] [`f09230814`](https://github.com/meta/astryx/commit/f09230814) fix(core): a swizzled Outline type-checks against the package's Markdown plugins (#10641)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4082ba703`](https://github.com/meta/astryx/commit/4082ba703) test(build): the tree test reads the picker's ranking instead of a literal block list (#10615)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`611382ee1`](https://github.com/meta/astryx/commit/611382ee1) feat(lab): add LineClamp — clamp arbitrary content to N lines (#4259)
- [ ] [`848bbe7c7`](https://github.com/meta/astryx/commit/848bbe7c7) feat(lab): DialogHeroHeader (#10108)
- [x] [`df5f6926e`](https://github.com/meta/astryx/commit/df5f6926e) docs(useTableColumnSettingsState): add hook docs and a column visibility picker example block (#10652)
  - 不适用：只改上游测试（自动初筛）
- [x] [`15c678835`](https://github.com/meta/astryx/commit/15c678835) test(cli): the swizzle proof gates component and swizzle changes (AST-110 FR7) (#10651)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f9cd81f14`](https://github.com/meta/astryx/commit/f9cd81f14) feat(lab): DialogHeroHeader showcase, and astryx discover lists it (#10109)
- [x] [`9d753c5c2`](https://github.com/meta/astryx/commit/9d753c5c2) [Component Audit] LayoutFooter: spacing above the footer always follows its divider (#10674)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7bdeb06d7`](https://github.com/meta/astryx/commit/7bdeb06d7) fix(theme): text follows the reader's text size in Safari on iPhone, in every theme (#10416)
- [ ] [`a28d586eb`](https://github.com/meta/astryx/commit/a28d586eb) feat(core): createReorderable makes List rows reorderable (#8139)
- [x] [`44862e54e`](https://github.com/meta/astryx/commit/44862e54e) [Component Audit] LayoutHeader: spacing below the header always follows its divider (#10686)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`31ae99075`](https://github.com/meta/astryx/commit/31ae99075) fix(cli): template — a typo's near name comes first in the suggestions (#10712)
- [ ] [`7bd08bbe5`](https://github.com/meta/astryx/commit/7bd08bbe5) fix(theme): Android text follows the system font scale with no setup (#10727)
- [x] [`3cd23eafb`](https://github.com/meta/astryx/commit/3cd23eafb) test(cli): node tests no longer time out under load (#10740)
  - 不适用：上游 node 测试负载下超时的测试设施调整
- [ ] [`1a4a85dad`](https://github.com/meta/astryx/commit/1a4a85dad) fix(cli): importUserModule's fresh read sees an edited ES module .js (#10745)
- [x] [`c5cc8f4c4`](https://github.com/meta/astryx/commit/c5cc8f4c4) docs(useLinkify): add hook docs and a comment-thread example block (#9969)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`16436bee4`](https://github.com/meta/astryx/commit/16436bee4) fix(cli): a theme warning prints as one line without control characters (#10764)
- [ ] [`09b4ff94d`](https://github.com/meta/astryx/commit/09b4ff94d) fix(cli): the doc importers read an edited CommonJS doc again (#10760)
- [ ] [`3f1678204`](https://github.com/meta/astryx/commit/3f1678204) fix(cli): a .doc.ts topic loads through jiti, installed or linked, on every supported Node (#10763)
- [ ] [`3eeda1b1d`](https://github.com/meta/astryx/commit/3eeda1b1d) docs(tailwind): a recipe for an app that already uses Tailwind, and what a misplaced @layer line does (#10532)
- [x] [`d84658f7d`](https://github.com/meta/astryx/commit/d84658f7d) docs(usePowerSearchConfig): add hook docs and a filtered directory table example block (#10660)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`daa239e98`](https://github.com/meta/astryx/commit/daa239e98) feat(lab): experimental ChatVirtualizer (#5461)
- [ ] [`ec8a19e41`](https://github.com/meta/astryx/commit/ec8a19e41) fix(cli): experimental icon sets — accept a generated declaration file a formatter rewrote (#10898)
- [ ] [`c0327e060`](https://github.com/meta/astryx/commit/c0327e060) fix(cli): experimental icon sets — keep the library prefix on a name that starts with a digit (#10895)
- [ ] [`dc91a5b12`](https://github.com/meta/astryx/commit/dc91a5b12) fix(cli): experimental icon sets — add a look's variant from its own package, and skip pack exports (#10896)
- [x] [`971d57533`](https://github.com/meta/astryx/commit/971d57533) fix(theme-gothic): accent text and icons stay readable on a light media surface (#10852)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`90f8b7e74`](https://github.com/meta/astryx/commit/90f8b7e74) fix(cli): experimental icon sets — write the current package name after a package rename (#10897)
- [ ] [`dfd75a6ab`](https://github.com/meta/astryx/commit/dfd75a6ab) [fix] [experimental] render: a Node crash fails with a message, and Avatar pages render on Node builds that crash in Intl.Segmenter (#10915)
- [x] [`b75cbf56d`](https://github.com/meta/astryx/commit/b75cbf56d) feat(docsite): nest docs pages under a parent page in the sidebar (#9786)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`706fc0306`](https://github.com/meta/astryx/commit/706fc0306) test(cli): read Avatar initials from generated-content attribute (#10934)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3312a58cb`](https://github.com/meta/astryx/commit/3312a58cb) fix(cli): search — results that fit the whole query rank higher below the first result (#10926)
- [x] [`05ff3f5b3`](https://github.com/meta/astryx/commit/05ff3f5b3) test(core): a source check fails on module-scope cross-module identity outside a shared key (AST-110 FR3) (#10807)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`00e031a31`](https://github.com/meta/astryx/commit/00e031a31) fix(Avatar): no public data-initials attribute; the initials come from a private StyleX dynamic style (#10944)
  - 不适用：只改上游测试（自动初筛）
- [x] [`db705b961`](https://github.com/meta/astryx/commit/db705b961) feat(core): shared-realm helpers hold every kind of cross-module state (AST-110 FR3) (#10817)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a9265f169`](https://github.com/meta/astryx/commit/a9265f169) style(cli): format doctor.mjs and template.mjs with Prettier (#10988)
  - 不适用：上游 doctor.mjs/template.mjs 的 Prettier 格式化，无行为变化
- [ ] [`4b6ad11c0`](https://github.com/meta/astryx/commit/4b6ad11c0) fix(cli): remove internal-format identifiers from comments and sample data (#10958)

### v0.7.13

- [ ] [`0085c0f2b`](https://github.com/meta/astryx/commit/0085c0f2b) feat(lab): TabBar shows a More tab past five tabs (#10619)
- [ ] [`367229613`](https://github.com/meta/astryx/commit/367229613) feat(cli): experimental icon sets — one main set with backups, a local placeholder for missing icons, and a docs-site set choice (#10959)
- [x] [`653c03bf6`](https://github.com/meta/astryx/commit/653c03bf6) fix(core): a swizzled component and the package announce through one pair of live regions (AST-110 FR3) (#10996)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e6dec3bfc`](https://github.com/meta/astryx/commit/e6dec3bfc) spec(AST-110): the layer stack and modal outlet gap is closed (#11026)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a01a2b2f9`](https://github.com/meta/astryx/commit/a01a2b2f9) test(cli): a release re-check renders every swizzle copy in Chromium (AST-110 FR7) (#10698)
  - 不适用：只改上游测试（自动初筛）
- [x] [`43fa8be5a`](https://github.com/meta/astryx/commit/43fa8be5a) Merge branch 'm2' into m3 (#10625)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6af6700c8`](https://github.com/meta/astryx/commit/6af6700c8) docs(useDirection): add hook docs and a live sparkline example block (#10547)
  - 不适用：只改上游测试（自动初筛）
- [x] [`841b486ff`](https://github.com/meta/astryx/commit/841b486ff) [Component Audit] Link: a disabled link stays announced as disabled when a caller passes aria-disabled or role (#11030)
  - 不适用：只改上游测试（自动初筛）
- [x] [`57009119a`](https://github.com/meta/astryx/commit/57009119a) docs(InternationalizationProvider): add a calendar example (#10135)
  - 不适用：只改上游测试（自动初筛）

### v0.7.14

- [x] [`7c8a2e23b`](https://github.com/meta/astryx/commit/7c8a2e23b) docs(useTruncation): add hook docs and a live table cell truncation example block (#10555)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9b5fdf5b0`](https://github.com/meta/astryx/commit/9b5fdf5b0) perf(cli): reuse the theming-target scan while Core's docs are unchanged (#10981)
- [ ] [`3e59cc8ec`](https://github.com/meta/astryx/commit/3e59cc8ec) docs(cli): token tables say their values are Core's defaults (#11089)
- [ ] [`cfa1d6273`](https://github.com/meta/astryx/commit/cfa1d6273) feat(cli): experimental icon sets — show which template icon meanings a set does not map, and smoother set authoring (#11090)
- [ ] [`18af3dc36`](https://github.com/meta/astryx/commit/18af3dc36) feat(cli): `astryx experimental theme` — checked theme editing, plus experimental copies of the theme commands (#11101)
- [x] [`d08ce652e`](https://github.com/meta/astryx/commit/d08ce652e) test(cli): build Neutral before theme-edit fixtures (#11115)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a21f2ee3d`](https://github.com/meta/astryx/commit/a21f2ee3d) feat(cli): experimental theme: fix unknown flags, color checks and undo recovery; editor group, how, preview pages and a starter app (#11113)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`9d5f4c7b1`](https://github.com/meta/astryx/commit/9d5f4c7b1) spec(AST-111): calendars go by their CLDR names (#11102)
- [x] [`8e99c64fe`](https://github.com/meta/astryx/commit/8e99c64fe) feat(cli): experimental theme: check before writing, palette colors, cleaner output, shared tests and preview fixes (#11134)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`d25d532df`](https://github.com/meta/astryx/commit/d25d532df) test(cli): theme build doc reads no longer time out under load (#11119)
- [x] [`5311a8533`](https://github.com/meta/astryx/commit/5311a8533) test(cli): child scripts import their modules by file URL (#11063)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`441e079d2`](https://github.com/meta/astryx/commit/441e079d2) fix(cli): experimental icon sets — distinct template icon meanings, keep a wrapped library's icons, docs-site icon-set build fixes (#11142)
- [x] [`153482eb4`](https://github.com/meta/astryx/commit/153482eb4) feat(cli): experimental theme: colors without palette commands, fixes from a real theming round, and a fully themed preview (#11149)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`9a3f29608`](https://github.com/meta/astryx/commit/9a3f29608) fix(useKeyboardHint): the arrow-key hint stays until dismissed, and Escape closes it (#10564)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9f3cbd90d`](https://github.com/meta/astryx/commit/9f3cbd90d) chore: remove the committed API reports; the API delta comes from the build (#10957)
  - 不适用：上游 API 报告（自动初筛）
- [x] [`82ccaeca1`](https://github.com/meta/astryx/commit/82ccaeca1) experimental theme: background questions answer the background, open layers kept clear on the Overview page (#11159)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`ca84efcee`](https://github.com/meta/astryx/commit/ca84efcee) experimental theme: third theming round: closest pages added, exact dark accent, base colors named, plainer notes and answers, clickable samples (#11163)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`38255549e`](https://github.com/meta/astryx/commit/38255549e) feat(cli): experimental theme: fixes from the fourth theming round (#11165)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`8812f462c`](https://github.com/meta/astryx/commit/8812f462c) experimental theme: app pages by phrase, fills kept for their color words, real radius tokens, nearest passing dark fill, undo keys match JSON (#11168)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`7deca3313`](https://github.com/meta/astryx/commit/7deca3313) feat(lab): SVG icons that follow the surrounding font-weight (#7918)
- [x] [`be1ea5404`](https://github.com/meta/astryx/commit/be1ea5404) feat(cli): [experimental] theme editor: review fixes, and preview app without --overwrite (#11173)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`080ae26e2`](https://github.com/meta/astryx/commit/080ae26e2) fix(cli): search no longer matches an entry on a keyword that names another entry (#11162)
- [ ] [`93d5c08a3`](https://github.com/meta/astryx/commit/93d5c08a3) fix(cli): component <ExampleName> points at template and --blocks (#11153)
- [x] [`220da36be`](https://github.com/meta/astryx/commit/220da36be) test(cli): the editor's command-line test runs one CLI command per test (#11193)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4e38f940e`](https://github.com/meta/astryx/commit/4e38f940e) TEST: Add unit tests for theme-edit PNG reader, palette helpers and leaf wrappers (#11174)
  - 不适用：只改上游测试（自动初筛）
- [x] [`fdb9213ba`](https://github.com/meta/astryx/commit/fdb9213ba) feat(cli): experimental theme: data safety, names that build, checked settings and token values (#11180)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`9e7e53299`](https://github.com/meta/astryx/commit/9e7e53299) test(cli): the command-line editor tests run in order, and a failed new skips the rest by name (#11211)
  - 不适用：只改上游测试（自动初筛）
- [x] [`37f1da95c`](https://github.com/meta/astryx/commit/37f1da95c) feat(cli): experimental theme: preview safety, how answers that are safe and right, colors the generator's way (#11209)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`dd4952ab7`](https://github.com/meta/astryx/commit/dd4952ab7) perf(cli): read shipped templates' components from a stored list (#11190)
- [x] [`a2eebf415`](https://github.com/meta/astryx/commit/a2eebf415) feat(cli): experimental theme: settings that do what they say, and colors second pass (#11222)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`d73f2ba51`](https://github.com/meta/astryx/commit/d73f2ba51) perf(cli): keep compiled modules between runs in the user's own cache folder (#11217)
- [ ] [`a728ac04a`](https://github.com/meta/astryx/commit/a728ac04a) perf(cli): print root help from a stored command list (#11194)
- [x] [`3c8dab548`](https://github.com/meta/astryx/commit/3c8dab548) fix(cli): theme commands refuse overwrites they should not make, and report the right errors (#11210)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [ ] [`147891410`](https://github.com/meta/astryx/commit/147891410) perf(cli): read shipped docs from a store written at publish (#11191)
- [x] [`d303fa28b`](https://github.com/meta/astryx/commit/d303fa28b) fix(cli): template needs come from real imports, not comments or strings (#11224)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.15

- [x] [`40d9f87c1`](https://github.com/meta/astryx/commit/40d9f87c1) feat(cli): experimental theme: preview removes never touch project files; how reads lists, several colors and per-mode colors (#11229)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`4be764d7d`](https://github.com/meta/astryx/commit/4be764d7d) perf(cli): doctor reads its audit of the CLI's own authoring docs from a copy stored at publish (#11232)
  - 不适用：doctor 读发布时存好的 CLI 作者文档审计结果，我们没有作者文档审计
- [ ] [`b53712397`](https://github.com/meta/astryx/commit/b53712397) perf(cli): load jiti and the theme API on first use (#11242)
- [ ] [`937af65ef`](https://github.com/meta/astryx/commit/937af65ef) perf(cli): split, lowercase and pattern each search text once per run (#11243)
- [x] [`55b19ae2b`](https://github.com/meta/astryx/commit/55b19ae2b) feat(cli): experimental theme: colors third pass — undo keeps a hand-edited palette, one-mode focus colors, fonts (#11244)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`56c05cc48`](https://github.com/meta/astryx/commit/56c05cc48) test(cli): run the Core rebuild through cmd.exe on Windows (#11051)
- [ ] [`c68e54a04`](https://github.com/meta/astryx/commit/c68e54a04) perf(cli): store Core's docs too, and parse only the stored docs a read needs (#11240)
- [ ] [`94fc7f00a`](https://github.com/meta/astryx/commit/94fc7f00a) perf(cli): print the manifest from a copy stored at publish (#11233)
- [ ] [`7e7fbae0f`](https://github.com/meta/astryx/commit/7e7fbae0f) perf(cli): load @babel/parser on first use in contribution validation (#11256)
- [ ] [`94321e2e8`](https://github.com/meta/astryx/commit/94321e2e8) docs(i18n): show Calendars under Internationalization in the docsite sidebar (#11269)
- [x] [`0c8edac99`](https://github.com/meta/astryx/commit/0c8edac99) feat(cli): experimental theme: editor core third pass, preview route groups and crash recovery, how swaps, official accent tint (#11262)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`3d19fc8cc`](https://github.com/meta/astryx/commit/3d19fc8cc) perf(cli): keep search's gathered catalog between runs while its inputs are unchanged (#11251)
- [x] [`1710578c5`](https://github.com/meta/astryx/commit/1710578c5) test(cli): record startup imports on minimum Node (#11259)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`d038e8928`](https://github.com/meta/astryx/commit/d038e8928) fix(cli): preserve swizzle write failures on minimum Node (#11186)
- [x] [`7411da664`](https://github.com/meta/astryx/commit/7411da664) test(cli): keep pack-check injection fixture compatible with npm 10 (#11188)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ccb1e817b`](https://github.com/meta/astryx/commit/ccb1e817b) test(cli): remove packed gather cache fixtures with the run (#11319)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3406f7383`](https://github.com/meta/astryx/commit/3406f7383) test: pack the run's CLI tarball faster and record the new long Node test files' times (#11326)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ed609ac6f`](https://github.com/meta/astryx/commit/ed609ac6f) perf(cli): keep search's entry table beside its kept catalog (#11300)
- [ ] [`319528c5b`](https://github.com/meta/astryx/commit/319528c5b) fix(cli): a release-cache lock takeover checks it moved the lock it judged stale (#11313)
- [ ] [`523aae129`](https://github.com/meta/astryx/commit/523aae129) fix(cli): use a kept catalog only for the inputs it records (#11301)
- [x] [`1a5784e50`](https://github.com/meta/astryx/commit/1a5784e50) feat(cli): experimental theme: fourth and fifth passes (renewed lock, corners by what parts show, css-tree values, other-mode base values), how/preview follow-ups, faster theme-edit tests (#11303)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`b5b920726`](https://github.com/meta/astryx/commit/b5b920726) fix(cli): doctor says a run under Plug'n'Play keeps no catalogs (#11299)
  - 不适用：doctor 的搜索缓存行在 Plug'n'Play 下的说明，我们没有缓存目录
- [x] [`dfe6944ee`](https://github.com/meta/astryx/commit/dfe6944ee) fix(cli): theme build names the source for its outputs and bare names; eject forks into the project root; targets reads class selectors; typed text stays as typed (#11323)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [ ] [`4ae4d23ee`](https://github.com/meta/astryx/commit/4ae4d23ee) fix(cli): a run under Plug'n'Play reads no kept catalog (#11344)
- [ ] [`ea16e8df7`](https://github.com/meta/astryx/commit/ea16e8df7) perf(cli): check absent paths of a kept catalog without building errors (#11316)
- [ ] [`47f884afe`](https://github.com/meta/astryx/commit/47f884afe) perf(cli): keep build's block picker vectors beside the kept catalog (#11342)
- [x] [`318ab8029`](https://github.com/meta/astryx/commit/318ab8029) feat(cli): the integration file takes an optional logo; integration check notes what a listing needs (#11278)
  - 不适用：集成包文件的 logo 和上架检查，我们没有集成包体系
- [x] [`17ec53564`](https://github.com/meta/astryx/commit/17ec53564) test(cli): the packed kept-catalog test reads its own user config, not the run's shared one (#11357)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2605d994d`](https://github.com/meta/astryx/commit/2605d994d) fix(cli): keep jiti's transpiled code in the per-user cache folder (#11360)
- [x] [`08b751a6d`](https://github.com/meta/astryx/commit/08b751a6d) fix(cli): theme refusals name commands that work; missing packages name their install; build headers from the project root; --out warns when it replaces another source's output or lacks .css (#11346)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [x] [`c46c9c86f`](https://github.com/meta/astryx/commit/c46c9c86f) feat(cli): experimental theme: sixth to eighth passes, and lists derived from css-tree, Core docs and the stable font list (#11350)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`6ef8ba1d4`](https://github.com/meta/astryx/commit/6ef8ba1d4) perf(cli): keep each integration's contribution-check results between runs (#11367)
- [ ] [`231157756`](https://github.com/meta/astryx/commit/231157756) docs(cli): recommend publishing JavaScript files for what the CLI loads (#11364)
- [ ] [`746f03ba1`](https://github.com/meta/astryx/commit/746f03ba1) feat(cli): integration verify notes a TypeScript manifest (#11382)
- [x] [`082ac048b`](https://github.com/meta/astryx/commit/082ac048b) perf(cli): record no run for kept integration checks in a project with no integration (#11380)
  - 不适用：没有集成包时不记录集成检查缓存的性能优化，我们没有这套缓存
- [ ] [`930c90660`](https://github.com/meta/astryx/commit/930c90660) fix(cli): theme watch follows local imports, eject keeps the local themes folder readable, --check ignores line endings, refusals point at commands that run (#11375)

### v0.7.16

- [ ] [`cf95ae8f9`](https://github.com/meta/astryx/commit/cf95ae8f9) docs(next): keep a webpack Server Component from shipping every Core component (#11305)
- [x] [`82adf3dca`](https://github.com/meta/astryx/commit/82adf3dca) fix(cli): integration validate names unreachable metadata with forward slashes (#11084)
  - 不适用：integration validate 的 Windows 路径斜杠，我们没有集成包体系
- [ ] [`15209237d`](https://github.com/meta/astryx/commit/15209237d) perf(cli): keep the project's whole integration issue list between runs (#11384)
- [x] [`8b87622e7`](https://github.com/meta/astryx/commit/8b87622e7) fix(cli): theme template finds the project root, stale --check names its code, and --out warns before writing another theme's outputs into an editor folder (#11389)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [x] [`bef2f834a`](https://github.com/meta/astryx/commit/bef2f834a) fix(cli): experimental theme: undo, show, how, colors and preview fixes from the next chaos rounds (#11378)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`2fa328089`](https://github.com/meta/astryx/commit/2fa328089) perf(cli): keep doctor's file-only docs checks between runs (#11394)
  - 不适用：doctor 的文档检查结果跨运行缓存，我们的 doctor 没有这些检查也没有缓存
- [x] [`787369dbe`](https://github.com/meta/astryx/commit/787369dbe) fix(cli): theme --check lists every output the build writes, and eject warns inside a theme editor folder (#11410)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [x] [`67780ce71`](https://github.com/meta/astryx/commit/67780ce71) fix(cli): experimental theme: safer recovery, exact card sides, checked suggestions, a faster show and a stricter how, from the next chaos rounds (#11419)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`5d51aa55a`](https://github.com/meta/astryx/commit/5d51aa55a) feat(cli): examples take kind 'demo' | 'setup'; setup examples are code only (#11434)
- [ ] [`8514aaeea`](https://github.com/meta/astryx/commit/8514aaeea) fix(cli): a page that ends without an answer says why (#11398)
- [x] [`5fa178523`](https://github.com/meta/astryx/commit/5fa178523) test: a Node test worker resolves no package through pnpm's NODE_PATH (#11431)
  - 不适用：只改上游测试（自动初筛）
- [x] [`56680f6a7`](https://github.com/meta/astryx/commit/56680f6a7) fix(cli): themeBuild no longer takes the watch and private-var hand-off callbacks, and the dashboard page template typechecks with noUncheckedIndexedAccess (#11420)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`b90511145`](https://github.com/meta/astryx/commit/b90511145) experimental theme: rounds 17–18 (own source from the build, one padding model, app detection, preview placement) (#11440)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`77fef2371`](https://github.com/meta/astryx/commit/77fef2371) fix(cli): a kept gather depends on a variable's value only when it reads it (#11427)
- [ ] [`c1a208a96`](https://github.com/meta/astryx/commit/c1a208a96) fix(cli): theme commands print steps that work from a subfolder, warn of a replace only when it happens, and name an editor theme or a linked theme file (#11422)
- [x] [`ff6607bf1`](https://github.com/meta/astryx/commit/ff6607bf1) fix(cli): theme build prints its install import with forward slashes (#11288)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`723a112c3`](https://github.com/meta/astryx/commit/723a112c3) test: split the heaviest Node test files so the legs can spread them (#11436)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e155a0143`](https://github.com/meta/astryx/commit/e155a0143) fix(cli): no public API function takes an undocumented __-prefixed option (#11446)
  - Vue 版已有：我们导出的 runCli 等函数本来就没有未写进文档的 __ 前缀选项
- [x] [`390d85518`](https://github.com/meta/astryx/commit/390d85518) perf(cli): read each Core folder once when building theme previews (#11426)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`3f518471d`](https://github.com/meta/astryx/commit/3f518471d) experimental theme: rounds 19–20 (padding scopes, own file wins everywhere, values read as meant, user files kept, preview focus) (#11453)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`9b1e4893a`](https://github.com/meta/astryx/commit/9b1e4893a) perf(cli): keep template discovery's records between runs (#11393)
- [x] [`75e0dcd3c`](https://github.com/meta/astryx/commit/75e0dcd3c) test(cli): kept-cache stale tests assert the warm path hit (#11467)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7245e6a67`](https://github.com/meta/astryx/commit/7245e6a67) fix(cli): theme build's import lines are relative to src/ as they say (#11471)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`721dbf10f`](https://github.com/meta/astryx/commit/721dbf10f) fix(cli): a theme build refusal's suggested command keeps --check and --out (#11461)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`685728b42`](https://github.com/meta/astryx/commit/685728b42) perf(cli): load Babel, recast and jscodeshift on first use, not with the API (#11432)
- [ ] [`07c77c008`](https://github.com/meta/astryx/commit/07c77c008) fix(cli): a kept entry with no value, a failing decode or the wrong shape is a miss, and is stored over (#11474)
- [x] [`8e4cc9efa`](https://github.com/meta/astryx/commit/8e4cc9efa) feat(cli): doctor warns when an integration's Core range excludes the project's Core (#10350)
  - 不适用：集成包的 Core peer 范围不含项目 Core 时告警，我们没有集成包体系
- [ ] [`717762759`](https://github.com/meta/astryx/commit/717762759) perf(cli): keep each integration's discovered themes between runs (#11469)
- [x] [`3b855b3ef`](https://github.com/meta/astryx/commit/3b855b3ef) experimental theme: editor themes plug into theme add, one entry step for every value, one-mode themes, accent shade, wiring steps (#11468)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`3aa244b69`](https://github.com/meta/astryx/commit/3aa244b69) perf(cli): docs reads the kept integration checks (#11483)
  - 不适用：docs 读缓存的集成检查结果，我们没有集成包体系
- [ ] [`c03b37a27`](https://github.com/meta/astryx/commit/c03b37a27) fix(cli): a theme that sets a private variable is refused, not built with an error (#11475)
- [x] [`f628ba44b`](https://github.com/meta/astryx/commit/f628ba44b) fix(cli): the palette generator honors darkChromaTaper, so every official palette regenerates as committed (#11491)
  - 不适用：调色板生成器的 darkChromaTaper，我们没有 palette generate；官方主题配色由主题族处理
- [ ] [`9f9b803a2`](https://github.com/meta/astryx/commit/9f9b803a2) perf(cli): skip the project load before help and commands where no integration can load (#11495)
- [ ] [`2680926f9`](https://github.com/meta/astryx/commit/2680926f9) perf(cli): read shipped icon definitions and built-in theme descriptors from values stored at publish (#11496)
- [ ] [`7e8a67000`](https://github.com/meta/astryx/commit/7e8a67000) feat(cli): experimental icon sets — a project picks one look (outline or filled) for every icon (#11499)
- [ ] [`7e46208b6`](https://github.com/meta/astryx/commit/7e46208b6) perf(cli): find a component under a parent folder from one index of Core's folders (#11504)
- [x] [`cb9cf3b35`](https://github.com/meta/astryx/commit/cb9cf3b35) fix(cli): an installed dependency whose manifest cannot load for want of a package it requires is reported as its issue (#11486)
  - 不适用：集成包清单因缺依赖加载失败时归为该包问题，我们没有集成包体系
- [ ] [`6bf031ae9`](https://github.com/meta/astryx/commit/6bf031ae9) docs(cli): help and docs point at the experimental theme editor for making and changing a theme (#11500)
- [x] [`80295b973`](https://github.com/meta/astryx/commit/80295b973) fix(cli): doctor's theme stylesheet check skips files that only extend a theme (#11506)
  - 不适用：主题样式表检查跳过只 extend 主题的文件，属 theme add/build 生成的主题模块，我们没有
- [x] [`e7926fed6`](https://github.com/meta/astryx/commit/e7926fed6) fix(cli): a base theme counts as installed only when the project installs it (node_modules or Plug'n'Play) (#11444)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [x] [`c9271588d`](https://github.com/meta/astryx/commit/c9271588d) experimental theme: a URL per preview page and a see line, how keeps scope and exact amounts, spacing sizes stay apart, own padding wins (#11490)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`c279d3cca`](https://github.com/meta/astryx/commit/c279d3cca) test(cli): the malformed-entry cases share one primed kept folder and one set of fresh answers (#11511)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f5b5f9660`](https://github.com/meta/astryx/commit/f5b5f9660) docs(useOutlineFromDOM): add hook docs and an article example block (#11234)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f396dc1c6`](https://github.com/meta/astryx/commit/f396dc1c6) fix(cli): build starts whole-page ideas from a page template instead of the empty app shell (#11519)

### v0.7.17

- [x] [`963754b82`](https://github.com/meta/astryx/commit/963754b82) fix(cli): doctor's theme wiring check ignores generated and extend-only theme files (#11531)
  - 不适用：主题接线检查忽略生成的和只 extend 的主题文件，属 theme add/build 和主题编辑器，我们没有
- [ ] [`ba9f55887`](https://github.com/meta/astryx/commit/ba9f55887) docs(cli): build() description names the whole-page start (#11533)
- [x] [`403c7ec21`](https://github.com/meta/astryx/commit/403c7ec21) experimental theme: app copy around your files, one-mode colors, exact how amounts, input cleanup (#11527)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`0e77167e8`](https://github.com/meta/astryx/commit/0e77167e8) test: split the slowest Node test file, re-record the legs' times, and name a stuck shard before its job limit (#11534)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4da09b8d6`](https://github.com/meta/astryx/commit/4da09b8d6) docs(useSyntaxTheme): add hook docs and a keyword color example block (#11236)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2b85c722f`](https://github.com/meta/astryx/commit/2b85c722f) perf(cli): read the CLI's shipped docs' parses from the store written at publish (#11537)
- [ ] [`723bacb53`](https://github.com/meta/astryx/commit/723bacb53) fix(cli): build breaks exact ties with an unlisted pick by each template's own descriptor (#11550)
- [ ] [`8270715c6`](https://github.com/meta/astryx/commit/8270715c6) fix(cli): the render worker reads jiti's file names in the platform form (#11286)
- [x] [`538e297e5`](https://github.com/meta/astryx/commit/538e297e5) docs(useChatDictation): add hook docs and a voice input example block (#11237)
  - 不适用：只改上游测试（自动初筛）
- [x] [`497b48bf6`](https://github.com/meta/astryx/commit/497b48bf6) test(cli): linked fixtures link their packages with a junction on Windows (#11266)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8e39a4a42`](https://github.com/meta/astryx/commit/8e39a4a42) feat(cli): docs points to the command that reads a component, hook or template (#11553)
- [ ] [`dbb0e4021`](https://github.com/meta/astryx/commit/dbb0e4021) fix(cli): theme build and doctor leave generated files to the command that made them; local font imports; doctor names the theme (#11554)
- [x] [`cc149789f`](https://github.com/meta/astryx/commit/cc149789f) test(cli): theme build --watch tests wait for the edited color, not a count of rebuilds (#11555)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a7ce61d3b`](https://github.com/meta/astryx/commit/a7ce61d3b) experimental theme: exact how amounts and parts, app copy said behind everywhere, per-variant one-mode colors, input and preview follow-through (#11546)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`8b1adb093`](https://github.com/meta/astryx/commit/8b1adb093) test(cli): cover fresh gather fallback on minimum Node (#11520)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`96ea82334`](https://github.com/meta/astryx/commit/96ea82334) perf(cli): keep the component list between runs, like template discovery's records (#11577)
- [ ] [`12992482e`](https://github.com/meta/astryx/commit/12992482e) fix(cli): component names a family's referenced parts on one line (#11591)
- [ ] [`06b35a5c4`](https://github.com/meta/astryx/commit/06b35a5c4) feat(cli): search prints the first sentence of each description (#11585)
- [x] [`90abc74ea`](https://github.com/meta/astryx/commit/90abc74ea) perf(cli): keep doctor's theme-wiring scan between runs, like its docs checks (#11579)
  - 不适用：主题接线扫描跨运行缓存，我们没有缓存
- [ ] [`8a4d0fb71`](https://github.com/meta/astryx/commit/8a4d0fb71) feat(cli): template --list prints the first sentence of each description (#11601)
- [ ] [`21ab9a7eb`](https://github.com/meta/astryx/commit/21ab9a7eb) [experimental] render: a rendered file explains itself, and --reverse names edits made after the render (#11590)
- [ ] [`2f95a9af0`](https://github.com/meta/astryx/commit/2f95a9af0) fix(cli): theme add wires a light-only or dark-only theme with its mode (#11568)
- [ ] [`48a3d9de1`](https://github.com/meta/astryx/commit/48a3d9de1) feat(cli): component lists its props one per line (#11612)
- [ ] [`4beeb8a36`](https://github.com/meta/astryx/commit/4beeb8a36) feat(cli): best practices label each run of Do and Don't items once (#11615)
- [ ] [`a9d59a4db`](https://github.com/meta/astryx/commit/a9d59a4db) feat(cli): component and hook tables use a short header rule (#11607)
- [x] [`d55578a9c`](https://github.com/meta/astryx/commit/d55578a9c) experimental theme: measured how answers, state and one-mode settings, app copy on every compile, input labels, preview stops (#11595)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`6a2232fa7`](https://github.com/meta/astryx/commit/6a2232fa7) fix(cli): theme build, verify and doctor load a theme whose base module imports its own stylesheet (#11623)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`b49d9b030`](https://github.com/meta/astryx/commit/b49d9b030) fix(cli): experimental render reads a file's head as a browser does (#11633)
- [ ] [`fd9c37964`](https://github.com/meta/astryx/commit/fd9c37964) fix(cli): render says why a page's process ended without an answer, and names a failed send (#11543)
- [ ] [`558aa967b`](https://github.com/meta/astryx/commit/558aa967b) perf(cli): search lowercases each candidate once per run and scores a one-word query once (#11620)
- [ ] [`b9ca2a2a7`](https://github.com/meta/astryx/commit/b9ca2a2a7) feat(cli): component reads print each prop description's first sentence (#11634)
- [x] [`c18bfffab`](https://github.com/meta/astryx/commit/c18bfffab) fix(cli): theme editor undo refuses a themes file by name on Node 22.13; core-on-demand checks what Node 22.13 can show (#11581)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`7b3154197`](https://github.com/meta/astryx/commit/7b3154197) test(cli): theme-real-bases renders in the pinned Playwright Chromium, launched once, failing by name; the theme-family contract runs inside the job's limit (#11592)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1addd72da`](https://github.com/meta/astryx/commit/1addd72da) feat(core): swipe actions come from createSwipe on the shared drag path (#8690)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`da07e31c6`](https://github.com/meta/astryx/commit/da07e31c6) feat(cli): `astryx docs --list` lists every topic, the same as giving no topic (#11665)
- [ ] [`0955cfe0b`](https://github.com/meta/astryx/commit/0955cfe0b) fix(cli): experimental render --reverse finds the source in a minified file (#11664)
- [x] [`7672da046`](https://github.com/meta/astryx/commit/7672da046) [fix] richtext: no integration-issue warning in apps that install it (#11628)
  - 不适用：只改上游测试（自动初筛）
- [x] [`d48e1d66b`](https://github.com/meta/astryx/commit/d48e1d66b) feat(cli): upgrade --list prints one line per codemod under its version (#11661)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e42c90ba2`](https://github.com/meta/astryx/commit/e42c90ba2) test(cli): report each common command's module and file-read counts (#11671)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e364afc95`](https://github.com/meta/astryx/commit/e364afc95) test: the Node legs' split books idle swizzle-proof slices at their import, and records keep only Node-leg time (#11648)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3850b5429`](https://github.com/meta/astryx/commit/3850b5429) fix(cli): experimental render --reverse refuses a file cut short or left with conflict markers (#11689)
- [ ] [`6da757802`](https://github.com/meta/astryx/commit/6da757802) perf(cli): keep gathers and the compile cache from a machine's first run (#11668)
- [ ] [`c090065df`](https://github.com/meta/astryx/commit/c090065df) fix(cli): doctor prints each check on one line, every field kept (#11660)
- [ ] [`b5ffd9a0f`](https://github.com/meta/astryx/commit/b5ffd9a0f) fix(cli): experimental render --reverse names where a wrapped or long edited text sits (#11690)
- [ ] [`cb60a4fb8`](https://github.com/meta/astryx/commit/cb60a4fb8) perf(cli): keep component replacement between runs with the component list (#11688)
- [ ] [`c4df91cbb`](https://github.com/meta/astryx/commit/c4df91cbb) fix(cli): one template keyword means one concept, and build matches it as a phrase (#11685)
- [ ] [`6de4d2744`](https://github.com/meta/astryx/commit/6de4d2744) fix(cli): experimental render and --reverse write in one step (#11669)
- [ ] [`94415ba5d`](https://github.com/meta/astryx/commit/94415ba5d) perf(cli): theme build keeps transpiled theme sources in the per-user cache, which stays within its size limit (#11705)
- [ ] [`a1d6abc4b`](https://github.com/meta/astryx/commit/a1d6abc4b) fix(cli): build matches blocks by single docs words outside its vocabulary (#11696)
- [ ] [`1022a8d85`](https://github.com/meta/astryx/commit/1022a8d85) fix(cli): experimental render compiles Core's StyleX theme variables outside a project (#11673)
- [ ] [`6519401cd`](https://github.com/meta/astryx/commit/6519401cd) feat(cli): theming override examples fit on one line (#11637)
- [x] [`78296ca92`](https://github.com/meta/astryx/commit/78296ca92) perf(cli): doctor --built reads source files faster (#11722)
  - 不适用：doctor --built 读源码提速，我们没有 --built
- [ ] [`f95af0146`](https://github.com/meta/astryx/commit/f95af0146) fix(cli): experimental render --reverse reads a copy whose line ends changed as not edited (#11708)
- [ ] [`b569b9d06`](https://github.com/meta/astryx/commit/b569b9d06) fix(cli): experimental render outside a project carries the modules above the page's folder (#11700)
- [ ] [`9a957aa3d`](https://github.com/meta/astryx/commit/9a957aa3d) feat(cli): build picks which page to start from with its own word model (#11724)
- [x] [`ec072c7d9`](https://github.com/meta/astryx/commit/ec072c7d9) ci: the swizzle proof and the Node browser contracts run in their own required jobs; the Node legs split evenly (#11697)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`03a3c8f9f`](https://github.com/meta/astryx/commit/03a3c8f9f) fix(cli): experimental render says a file it cannot read cannot be read (ERR_READ_FAILED) (#11728)
- [ ] [`fd36ff22a`](https://github.com/meta/astryx/commit/fd36ff22a) perf(cli): a hosted run keeps its catalog, keyed on what the host passed (#11719)
- [x] [`78f7c7a70`](https://github.com/meta/astryx/commit/78f7c7a70) experimental theme: how measures every variant and mode, input reader without reset repairs, own-token checks, compile path guard, preview browser order (#11641)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`52ec26137`](https://github.com/meta/astryx/commit/52ec26137) fix(cli): experimental render reads path aliases from the tsconfig TypeScript reads for the page (#11695)
- [x] [`847c3f112`](https://github.com/meta/astryx/commit/847c3f112) fix(cli): remove page-template keywords that the template doesn't render (#11717)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`26c29f05c`](https://github.com/meta/astryx/commit/26c29f05c) fix(cli): a frame counts as start evidence only when it holds the page the idea names (#11709)
- [x] [`91ffe9fde`](https://github.com/meta/astryx/commit/91ffe9fde) test(cli): take every page template round trip, and every hostile copy of a rendered file, in CI (#11710)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b36275ed0`](https://github.com/meta/astryx/commit/b36275ed0) feat(core): TableRow exposes a selected theme state (#11729)
  - 不适用：本范围只有上游主题编辑器对 TableRow selected 状态的跟进；Core 部分由表格与主题族处理
- [ ] [`02b6996e7`](https://github.com/meta/astryx/commit/02b6996e7) perf(cli): store Core's component list and imports at publish, used while the installed Core is unchanged (#11617)
- [ ] [`8a095180b`](https://github.com/meta/astryx/commit/8a095180b) fix(cli): experimental render carries the .mts, .cts and .cjs modules a page imports (#11702)
- [ ] [`0a54c6f24`](https://github.com/meta/astryx/commit/0a54c6f24) fix(cli): build reads an "add" request that says where the piece goes as a change to the builder's page (#11713)
- [ ] [`82036d5a5`](https://github.com/meta/astryx/commit/82036d5a5) fix(cli): experimental render carries every image a carried file names (#11674)
- [x] [`74fbc7012`](https://github.com/meta/astryx/commit/74fbc7012) feat(cli): doctor lists component examples that cannot run on their own (#11711)
  - 不适用：integration validate 列出不能独立运行的组件示例，我们没有集成包体系
- [ ] [`8c8a2db5a`](https://github.com/meta/astryx/commit/8c8a2db5a) fix(cli): an unlisted ranker pick is weighed against the pick model's best page (#11745)
- [x] [`143e03fa6`](https://github.com/meta/astryx/commit/143e03fa6) docs(spec): AST-048 DEC-11, the page pick reads past weak ranker evidence (#11744)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`cfcba6407`](https://github.com/meta/astryx/commit/cfcba6407) fix(cli): experimental render --reverse plans again when another run creates its new folder first (#11727)
- [x] [`31bc5dcc6`](https://github.com/meta/astryx/commit/31bc5dcc6) perf(cli): doctor --built reads doctor's kept checks back (#11732)
  - 不适用：doctor --built 读回缓存，我们没有 --built 和缓存
- [ ] [`43445a643`](https://github.com/meta/astryx/commit/43445a643) fix(cli): the CLI orders names the same way on every machine (#11683)
- [ ] [`a72429535`](https://github.com/meta/astryx/commit/a72429535) fix(cli): experimental render gives relative ?raw imports the file's text and ?inline .css files their text, as Vite does (#11704)
- [ ] [`49bf06afb`](https://github.com/meta/astryx/commit/49bf06afb) feat(core): theme component overrides take @light and @dark blocks that apply in one color mode (#11679)
- [ ] [`d3160da37`](https://github.com/meta/astryx/commit/d3160da37) docs(cli): build's doc and comments say the pick model chooses a whole page's start (#11746)
- [ ] [`c441c235f`](https://github.com/meta/astryx/commit/c441c235f) fix(build): start from the family's frame template when the frame holds the page (#11741)
- [ ] [`8ddbd6d36`](https://github.com/meta/astryx/commit/8ddbd6d36) fix(cli): experimental render --reverse gives back an aliased page where the project has no alias for its imports (#11698)
- [ ] [`c29d0fab8`](https://github.com/meta/astryx/commit/c29d0fab8) fix(cli): experimental render --reverse names the JSON file that holds an edited run of text (#11730)
- [ ] [`49effe20e`](https://github.com/meta/astryx/commit/49effe20e) fix(cli): build keeps a component with its listed contents as one part (#11723)
- [ ] [`bec204354`](https://github.com/meta/astryx/commit/bec204354) fix(cli): experimental render leaves out a named image it cannot read, and says so (#11748)
- [ ] [`5e579fef4`](https://github.com/meta/astryx/commit/5e579fef4) fix(cli): experimental render and --reverse read ..x as a name, and the note names the page as its files list it (#11750)
- [ ] [`84d5272d1`](https://github.com/meta/astryx/commit/84d5272d1) fix(cli): experimental render carries page files whose names only look like configuration (#11703)
- [x] [`6acf36a82`](https://github.com/meta/astryx/commit/6acf36a82) experimental theme: follow-up fixes from the next edge-case round (#11738)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`e8200bb02`](https://github.com/meta/astryx/commit/e8200bb02) perf(cli): theme build loads jiti on first use (#11751)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`70327bfcb`](https://github.com/meta/astryx/commit/70327bfcb) fix(cli): build settles exact ranker ties by the family base, then by each template's own descriptor (#11657)
- [ ] [`3108201db`](https://github.com/meta/astryx/commit/3108201db) perf(cli): store search's catalog at publish, used where the project adds nothing and the CLI and Core are unchanged (#11755)
- [x] [`ab43756c9`](https://github.com/meta/astryx/commit/ab43756c9) experimental theme: fixes from the next edge-case round and blind theme-building runs (#11739)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`49a475fbd`](https://github.com/meta/astryx/commit/49a475fbd) test: split door-conformance, global-local and packed-gather-cache.records so the Node legs can spread them (#11699)
  - 不适用：只改上游测试（自动初筛）
- [x] [`decc98007`](https://github.com/meta/astryx/commit/decc98007) fix(core): a color-mode block follows the nearest media surface; a styled link keeps its hover tint (#11759)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`6ecaa8694`](https://github.com/meta/astryx/commit/6ecaa8694) perf(cli): a kept entry names the kept entries it builds on, and a run checks each kept entry once (#11736)
- [x] [`da3ca4a1b`](https://github.com/meta/astryx/commit/da3ca4a1b) spec(AST-110): authority matches its approval (current) (#11774)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`5e463b258`](https://github.com/meta/astryx/commit/5e463b258) experimental theme: fixes from a third edge-case round (#11747)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`6f1d7d17b`](https://github.com/meta/astryx/commit/6f1d7d17b) perf(cli): an exact codec hands the store the JSON text it checked (#11777)
- [x] [`5a570bc7c`](https://github.com/meta/astryx/commit/5a570bc7c) experimental theme: one-mode colors as mode blocks, and a fourth round of fixes (#11756)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`270f6800a`](https://github.com/meta/astryx/commit/270f6800a) experimental theme: a fifth round of edge-case fixes, and in-process tests (#11765)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`f672f0fbe`](https://github.com/meta/astryx/commit/f672f0fbe) test(cli): pin the exact codec's read-back over generated plain data (#11784)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f58e89300`](https://github.com/meta/astryx/commit/f58e89300) perf(cli): theme build reads Core's component docs once (#11781)
- [ ] [`dc9b62a32`](https://github.com/meta/astryx/commit/dc9b62a32) perf(cli): docs keeps the CLI's own docs tree between runs (#11775)
- [ ] [`b1c9af61f`](https://github.com/meta/astryx/commit/b1c9af61f) docs(cli): a guide to make a shareable page with experimental render (#11795)
- [x] [`3b6e79a98`](https://github.com/meta/astryx/commit/3b6e79a98) experimental theme: a sixth round of edge-case fixes (#11778)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`8423b3308`](https://github.com/meta/astryx/commit/8423b3308) fix(cli): experimental render warns when the page asks a media query in JavaScript (#11792)
- [x] [`f74441367`](https://github.com/meta/astryx/commit/f74441367) fix(cli): theme remove can remove the only added theme (#11783)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [ ] [`3ef7c410f`](https://github.com/meta/astryx/commit/3ef7c410f) docs(core): the typography note says how a heading's font list is built (#11786)
- [ ] [`082c2f5d9`](https://github.com/meta/astryx/commit/082c2f5d9) fix(cli): experimental render shows a container chart at its box's size at any reader width (#11791)
- [x] [`0dde4b607`](https://github.com/meta/astryx/commit/0dde4b607) test(cli): the watch tests write theme sources whole, and one case writes in place on purpose (#11666)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e461ffb3e`](https://github.com/meta/astryx/commit/e461ffb3e) fix(cli): name an integration's docs the way `astryx docs` opens them (#11801)
- [x] [`b31d8b327`](https://github.com/meta/astryx/commit/b31d8b327) docs(useSpeechRecognition): add hook docs and a transcript example block (#11238)
  - 不适用：只改上游测试（自动初筛）
- [x] [`cede81b40`](https://github.com/meta/astryx/commit/cede81b40) fix(cli): integration check and doctor resolve shipped relative imports the way a bundler does (#11803)
  - 不适用：integration check 像打包器那样解析集成包的相对导入，我们没有集成包体系
- [ ] [`e126007e2`](https://github.com/meta/astryx/commit/e126007e2) fix(build): a template kept off the gallery is never the app shell (#11808)
- [x] [`d79a41f6f`](https://github.com/meta/astryx/commit/d79a41f6f) fix(cli): doctor's newest-release check no longer claims every copy checks once a day (#11809)
  - 不适用：doctor 的最新版本检查措辞，我们的 CLI 不联网检查新版本
- [ ] [`f8e350ac8`](https://github.com/meta/astryx/commit/f8e350ac8) docs(cli): theme remove's exit codes say plainly when the default and the only theme can be removed (#11814)
- [ ] [`b18f5d6dd`](https://github.com/meta/astryx/commit/b18f5d6dd) fix(cli): template accepts an absolute path inside the project; outside, it names the command that works (#11793)
- [x] [`c87cb0c89`](https://github.com/meta/astryx/commit/c87cb0c89) experimental theme: a seventh round of fixes (how lists, one-mode shadows and borders, offline pictures) (#11779)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`d0556658d`](https://github.com/meta/astryx/commit/d0556658d) fix(cli): keep an integration's added section, and name it at the top (#11817)
- [x] [`e6f453ad7`](https://github.com/meta/astryx/commit/e6f453ad7) fix(cli): doctor integration in a package's own folder names integration check (#11821)
  - 不适用：doctor integration 在包自身目录下的提示，我们没有集成包体系
- [x] [`e6fbe9324`](https://github.com/meta/astryx/commit/e6fbe9324) experimental theme: an eighth round of fixes (one list grammar, state settings win, offline pictures, one-command docs row) (#11789)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`f594a7e3a`](https://github.com/meta/astryx/commit/f594a7e3a) feat(cli): discover names the sections an integration adds to another doc (#11825)
- [x] [`9ad5a1d2f`](https://github.com/meta/astryx/commit/9ad5a1d2f) [Component Audit] MoreMenu: docs list the controlled open prop and the inherited size, and tests guard both (#11742)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`67665751a`](https://github.com/meta/astryx/commit/67665751a) feat(cli): discover lists an installed integration's description (#11822)
- [ ] [`bac58372c`](https://github.com/meta/astryx/commit/bac58372c) feat(cli): one did-you-mean rule points every lookup to the command that has the name (#11707)
- [x] [`a2be521cf`](https://github.com/meta/astryx/commit/a2be521cf) perf(cli): integration check asks npm once what a package packs (#11829)
  - 不适用：integration check 只问一次 npm 打包清单，我们没有集成包体系
- [ ] [`d182a5b0f`](https://github.com/meta/astryx/commit/d182a5b0f) fix(cli): the block picker counts doc-fitted blocks as known (#11820)
- [ ] [`fe00cdcf7`](https://github.com/meta/astryx/commit/fe00cdcf7) fix(cli): build reads a template's name written joined or with two neighbouring letters swapped (#11818)
- [x] [`e4a11bb68`](https://github.com/meta/astryx/commit/e4a11bb68) fix(core): a radio's circle is drawn at 50%, not with the pill token (#11836)
  - 不适用：本范围只有上游主题编辑器对 Radio 圆形的跟进；Core 部分由选择控件族处理
- [ ] [`2ad0d3dcc`](https://github.com/meta/astryx/commit/2ad0d3dcc) fix(cli): search reads a PascalCase identifier that text only mentions as its words too (#11815)
- [x] [`376c5137d`](https://github.com/meta/astryx/commit/376c5137d) feat(cli): an integration declares the provider that wires its themes; theme list and doctor read it (#11799)
  - 不适用：集成包声明主题 provider，theme list/doctor 读取，我们没有集成包体系
- [x] [`5ac1267c4`](https://github.com/meta/astryx/commit/5ac1267c4) test(cli): global-local reads the CLI's own cache and state folders, so it passes on macOS (#11767)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c345076e1`](https://github.com/meta/astryx/commit/c345076e1) experimental theme: a ninth round of fixes (coherence across every part, overlays seen open, problems lead results) (#11804)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`a6716bc86`](https://github.com/meta/astryx/commit/a6716bc86) feat(cli): doctor's newest-release and kept-cache messages say the same facts in fewer words (#11849)
  - 不适用：doctor 最新版本和缓存行的措辞，我们不联网检查新版本也没有缓存
- [x] [`3387ab8f1`](https://github.com/meta/astryx/commit/3387ab8f1) fix(cli): theme list names the package each theme comes from and whether it is installed (#11843)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [ ] [`f5b7bacc6`](https://github.com/meta/astryx/commit/f5b7bacc6) fix(cli): decode UTF-8 paths in .gitattributes (#11773)
- [ ] [`17f7ffcc6`](https://github.com/meta/astryx/commit/17f7ffcc6) perf(cli): a kept entry checks what each probe returned, not the probed file's stamp (#11805)
- [ ] [`2cafda977`](https://github.com/meta/astryx/commit/2cafda977) feat(cli): a lookup miss points to the hook it nearly names (#11857)
- [x] [`ca9fee580`](https://github.com/meta/astryx/commit/ca9fee580) fix(cli): upgrade reads each TypeScript file in its own grammar (#11863)
  - 不适用：只改上游测试（自动初筛）
- [x] [`bd7d1b301`](https://github.com/meta/astryx/commit/bd7d1b301) test(cli): the no-session privacy test clears AGENT_SESSION_ID (#11872)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`28e795855`](https://github.com/meta/astryx/commit/28e795855) perf(cli): discover's list asks its sources while it reads the installed packages (#11869)
- [ ] [`f325da080`](https://github.com/meta/astryx/commit/f325da080) perf(cli): theme build keeps what it checks a theme against in Core's docs (#11798)
- [x] [`1f76a58a1`](https://github.com/meta/astryx/commit/1f76a58a1) feat(cli): theme add says the app may already get its theme from an installed package's provider (#11854)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [x] [`c1ef47d57`](https://github.com/meta/astryx/commit/c1ef47d57) test(cli): pin build's default app shell when a ready Shell variant exists (#11875)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`b317e8ae3`](https://github.com/meta/astryx/commit/b317e8ae3) perf(cli): a run takes each kept list of reads once (#11877)
- [ ] [`1b6eeb3f6`](https://github.com/meta/astryx/commit/1b6eeb3f6) fix(cli): template's refusal names a path the project builds and serves (#11858)
- [x] [`956e481b2`](https://github.com/meta/astryx/commit/956e481b2) perf(cli): a validation parses each source file once for its template walks (#11882)
  - 不适用：集成包校验时每个源文件只解析一次，我们没有集成包体系
- [ ] [`4fdc22f60`](https://github.com/meta/astryx/commit/4fdc22f60) fix(cli): component did-you-mean suggests installed integration components and near names typed with separators (#11861)
- [ ] [`c0b2a7887`](https://github.com/meta/astryx/commit/c0b2a7887) fix(cli): errors name a run that works (#11874)
- [x] [`b1441b749`](https://github.com/meta/astryx/commit/b1441b749) fix(cli): theme build writes a built module that loads in any bundler (#11870)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`af404fc5a`](https://github.com/meta/astryx/commit/af404fc5a) perf(cli): the template walks read each source file's judged nodes once (#11888)
  - 不适用：集成包模板遍历的性能优化，我们没有集成包体系
- [x] [`607936362`](https://github.com/meta/astryx/commit/607936362) perf(cli): doctor's docs checks are read back after an edit to the app (#11886)
  - 不适用：doctor 文档检查缓存在改应用后读回，我们没有缓存
- [ ] [`cf7e3d604`](https://github.com/meta/astryx/commit/cf7e3d604) fix(cli): a run that exits 1 after its output records the code it carries (#11865)
- [x] [`3137fe0df`](https://github.com/meta/astryx/commit/3137fe0df) fix(core): the active option of select, multi-select and typeahead lists carries a highlighted theme state (#11887)
  - 不适用：本范围只有上游主题编辑器对选项 highlighted 状态的跟进；Core 部分由选择器族处理
- [ ] [`c828a75dc`](https://github.com/meta/astryx/commit/c828a75dc) fix(cli): build names where its start goes in the project, so the command runs as printed (#11881)
- [ ] [`7f328d29c`](https://github.com/meta/astryx/commit/7f328d29c) fix(cli): build's page-or-shell call reads a refit word table, stored once, and keeps the shell for a page the idea shares no word with (#11901)
- [ ] [`4213897c7`](https://github.com/meta/astryx/commit/4213897c7) perf(cli): an integration package's check of itself keeps npm's list of the files it packs (#11903)
- [ ] [`9901f0b9a`](https://github.com/meta/astryx/commit/9901f0b9a) docs(cli): registry calls use the CLI's own bounded retry and timeout, not npm's settings (#11904)
- [x] [`305a7e35c`](https://github.com/meta/astryx/commit/305a7e35c) test: global-local rows that wait out npm retries run side by side (#11906)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`59f404dab`](https://github.com/meta/astryx/commit/59f404dab) perf(cli): component and the theme commands load postcss only when they read a stylesheet (#11908)
- [x] [`44eeff690`](https://github.com/meta/astryx/commit/44eeff690) experimental theme: tenth round of fixes (FINAL-36/37/38 hunts, coherence rounds 4–5) (#11841)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`27ba2010f`](https://github.com/meta/astryx/commit/27ba2010f) docs(useChatPasteAsToken): add hook docs and a long paste example block (#11239)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`27bb774ac`](https://github.com/meta/astryx/commit/27bb774ac) feat(cli): astryx template writes a scratch copy to a path in the system temp folder (#11915)
- [x] [`dc58f1979`](https://github.com/meta/astryx/commit/dc58f1979) perf(cli): doctor's theme checks and the codemods' parser load postcss only when they read a stylesheet (#11925)
  - 不适用：doctor 主题检查按需加载 postcss，我们的 CLI 没有运行时依赖
- [ ] [`d9ddeef9d`](https://github.com/meta/astryx/commit/d9ddeef9d) fix(cli): build names a not-ready page template only when the idea names it (#11923)
- [ ] [`e34ad599e`](https://github.com/meta/astryx/commit/e34ad599e) fix(cli): a component that declares the typed name stays ahead of another command's hint (#11934)
- [ ] [`f69c8798a`](https://github.com/meta/astryx/commit/f69c8798a) perf(cli): a run's debug record keeps its locale and time zone between runs on Linux (#11930)
- [ ] [`843181c6d`](https://github.com/meta/astryx/commit/843181c6d) fix(cli): build's start reads only ready page templates from search (#11940)
- [x] [`22a5c0329`](https://github.com/meta/astryx/commit/22a5c0329) experimental theme: eleventh round of fixes (FINAL-40/41 hunts, era and brand coherence) (#11937)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`994ad5009`](https://github.com/meta/astryx/commit/994ad5009) test: packed-gather-cache runs keep a warm compile cache per file (#11907)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`fe3dfd3e9`](https://github.com/meta/astryx/commit/fe3dfd3e9) feat(cli): build reports start.fit; theme preview add refuses a page build is unsure of (#11926)
- [x] [`06db887c0`](https://github.com/meta/astryx/commit/06db887c0) perf(cli): theme build keeps what its css-tree checks of a theme's keys find (#11961)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`88c4e0a8a`](https://github.com/meta/astryx/commit/88c4e0a8a) feat(templates): add a Welcome portal page template for an employee intranet home (not ready yet) (#11928)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ed1594c95`](https://github.com/meta/astryx/commit/ed1594c95) fix(cli): leave a compile cache Node already uses as it is (#11969)
- [x] [`6d517d850`](https://github.com/meta/astryx/commit/6d517d850) fix(cli): doctor reads an installed theme package's own source for its private variables check (#11977)
  - 不适用：doctor 的主题私有变量检查读主题包源码，属 TS 主题输入检查，我们的主题是现成 CSS
- [ ] [`5f2aed9ea`](https://github.com/meta/astryx/commit/5f2aed9ea) fix(cli): swizzle without Core says what it needs, outside a project and in one (#11979)
- [ ] [`03e7dda9e`](https://github.com/meta/astryx/commit/03e7dda9e) fix(cli): build drops the shared-word check on the page pick (#11971)
- [x] [`99c0bc696`](https://github.com/meta/astryx/commit/99c0bc696) fix(core): defineTheme refuses a plain-object base instead of merging its raw values (#11973)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ae1cab085`](https://github.com/meta/astryx/commit/ae1cab085) fix(cli): a not-ready page template no longer takes a search result place in build's kit (#11968)
- [x] [`4675361f5`](https://github.com/meta/astryx/commit/4675361f5) test(cli): the search golden counts the status page templates (#11993)
  - 不适用：只改上游测试（自动初筛）
- [x] [`2005ab380`](https://github.com/meta/astryx/commit/2005ab380) experimental theme: twelfth round of fixes (FINAL-43/44 hunts, review follow-ups) (#11965)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`95025f18c`](https://github.com/meta/astryx/commit/95025f18c) docs(cli): the shareable-page guide names the layouts that go wrong on a phone, and how to write each one (#11976)
- [ ] [`a62484bbc`](https://github.com/meta/astryx/commit/a62484bbc) fix(cli): docs finds a topic by its title, keywords, or a route typed with other separators (#11990)
- [ ] [`fb7e4afff`](https://github.com/meta/astryx/commit/fb7e4afff) fix(cli): in a Yarn Plug'n'Play project, a copy started outside the project's runtime hands the run to the project's own CLI (#11972)
- [x] [`0f4c0aa48`](https://github.com/meta/astryx/commit/0f4c0aa48) fix(cli): a fresh clone that lists the CLI is told to install its dependencies (#11986)
  - 不适用：刚 clone 的项目列了 CLI 时不再提示重新 add CLI；我们没有每日提示和 setup 提醒，doctor 也不检查 CLI 本身
- [x] [`dd94472a9`](https://github.com/meta/astryx/commit/dd94472a9) perf(cli): theme build keeps the JavaScript it compiles from a theme's local modules (#11954)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`5e5ddde56`](https://github.com/meta/astryx/commit/5e5ddde56) feat(cli): template results carry isReady, and text says (not ready) (#11931)
- [ ] [`f80af6354`](https://github.com/meta/astryx/commit/f80af6354) perf(cli): kept gathers leave the CLI's own files to its build id and folder (#11998)
- [x] [`92a19acbf`](https://github.com/meta/astryx/commit/92a19acbf) fix(cli): doctor tells a fresh clone to install its dependencies for a missing Core or theme package (#12038)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。package.json 写了 core/themes 但 node_modules 里没有时，doctor 判失败并让运行项目自己的安装（如 pnpm install），Plug'n'Play 下不判，补测试
- [ ] [`8e719d15d`](https://github.com/meta/astryx/commit/8e719d15d) fix(cli): build reads search without page templates that are not ready (#12031)
- [ ] [`118dcc589`](https://github.com/meta/astryx/commit/118dcc589) docs(cli): the computer-level skill starts a page with build (#12037)
- [ ] [`483f621a2`](https://github.com/meta/astryx/commit/483f621a2) [experimental] render: a compile error names the file and the line, and StyleX's unreadable import names the value and the module (#12070)
- [x] [`e849bf77a`](https://github.com/meta/astryx/commit/e849bf77a) fix(cli): doctor's theme font check reads the families a font service URL names (#12069)
  - 不适用：doctor 主题字体检查读字体服务 URL 的 family，我们没有字体检查（主题 CSS 自带 @fontsource 字体）
- [x] [`c8a9435fb`](https://github.com/meta/astryx/commit/c8a9435fb) fix(cli): doctor loads theme inputs with the project's Core when the CLI is installed for the computer (#12055)
  - 不适用：全局安装 CLI 时用项目 Core 加载主题输入，属 TS 主题输入检查和全局模式，我们没有
- [ ] [`31ca826cd`](https://github.com/meta/astryx/commit/31ca826cd) fix(cli): component lookups never open through a keyword; one keyword definition and guide (#12073)
- [x] [`c453f14e3`](https://github.com/meta/astryx/commit/c453f14e3) fix(cli): printed add and upgrade commands keep a project's exact pins (#12006)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。doctor 和 init 打印的安装命令在项目把 core 钉死版本时加 -E 精确保存；我们没有每日提示和升级通知
- [ ] [`33a2d4568`](https://github.com/meta/astryx/commit/33a2d4568) perf(cli): a run that keeps catalogs loads the CLI's own modules by path (#12066)
- [x] [`ba7490ad0`](https://github.com/meta/astryx/commit/ba7490ad0) experimental theme: thirteenth round of fixes (clause scope, family pictures, palette recipe v2) (#12011)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`c0b12795d`](https://github.com/meta/astryx/commit/c0b12795d) feat(templates): table and incident-console are ready; build hosts parts on a family base and starts shell variants only by their own words (#12003)
- [x] [`9427cc695`](https://github.com/meta/astryx/commit/9427cc695) revert(templates): remove six page templates that were never marked ready (#12016)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`35582f3a2`](https://github.com/meta/astryx/commit/35582f3a2) perf(search): order results with the word scores ranking already worked out (#12103)
- [x] [`9a47fff4c`](https://github.com/meta/astryx/commit/9a47fff4c) fix(cli): doctor's theme font check counts a family any imported font stylesheet loads (#12090)
  - 不适用：doctor 主题字体检查认任一导入的字体样式表，我们没有字体检查
- [ ] [`c44a63778`](https://github.com/meta/astryx/commit/c44a63778) feat(cli): bases, first step — a run reads one base; steps it does not serve are hidden and refused (#11111)
- [x] [`ca21c6d10`](https://github.com/meta/astryx/commit/ca21c6d10) docs(core): Dialog names its one nesting exception, an alert that confirms a destructive action (#12080)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`6cfda3fe2`](https://github.com/meta/astryx/commit/6cfda3fe2) feat(cli): experimental exportIconIndex() and rankIconIndex() (#12128)
- [ ] [`68609edee`](https://github.com/meta/astryx/commit/68609edee) fix(cli): bases — a non-Core base shows no Core in build, list envelopes, upgrade, and doctor (#11593)
- [ ] [`ed685e1d7`](https://github.com/meta/astryx/commit/ed685e1d7) docs(cli): the computer-level skill pins the CLI exactly when Core is pinned (#12164)
- [x] [`0c5b0f052`](https://github.com/meta/astryx/commit/0c5b0f052) fix(cli): integration check and verify handle very large icon libraries (#12145)
  - 不适用：integration check/verify 处理超大图标库，我们没有集成包体系
- [ ] [`93e504916`](https://github.com/meta/astryx/commit/93e504916) perf(cli): runs that load no project, hook aside, skip the base resolver; Core's base declaration loads no identity code (#12181)
- [x] [`dab5f97f2`](https://github.com/meta/astryx/commit/dab5f97f2) test(cli): ten editor entry and reader files share one project fixture (#12182)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`d6f6295da`](https://github.com/meta/astryx/commit/d6f6295da) perf(cli): keep each shipped doc's parse, and build doc schemas on first parse (#12166)
- [x] [`e7c7c0e9b`](https://github.com/meta/astryx/commit/e7c7c0e9b) fix(cli): theme add and doctor name a theme package's install at the Core release its peer needs (#12161)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。doctor 缺 themes 时按项目 core 的版本给出安装命令（两包一起发版）；theme add 部分我们没有
- [ ] [`ffd1fc0ee`](https://github.com/meta/astryx/commit/ffd1fc0ee) docs(cli): global problems explains the installing line outside a project too (#12198)
- [ ] [`e80124133`](https://github.com/meta/astryx/commit/e80124133) fix(cli): icon finder answers with no icon set and honors the chosen look (#12131)
- [x] [`13f3e70d1`](https://github.com/meta/astryx/commit/13f3e70d1) fix(cli): theme build no longer replaces a file it did not write beside the source (#12155)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`694962bab`](https://github.com/meta/astryx/commit/694962bab) fix(cli): record asynchronous reads of doc dependencies (#11850)
- [ ] [`ead908dc6`](https://github.com/meta/astryx/commit/ead908dc6) fix(cli): the project update notice upgrades every package released with Core (#12091)
- [x] [`d61c951d4`](https://github.com/meta/astryx/commit/d61c951d4) feat(cli): init says what it did to each agent-doc file (#12200)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。init 逐个文件说明新建、追加、更新或已是最新没有改动，最新时不重写文件，JSON 的 files[].action 增加 unchanged
- [ ] [`2fb7c5b76`](https://github.com/meta/astryx/commit/2fb7c5b76) fix(cli): component docs print their commands with the project's runner in text (#12212)
- [ ] [`f3e04a9e2`](https://github.com/meta/astryx/commit/f3e04a9e2) fix(cli): search lists a family's root ahead of its own part when the query asks for the whole thing (#12167)
- [x] [`27af5191c`](https://github.com/meta/astryx/commit/27af5191c) fix(cli): init next steps and the doctor theme hint use the project's install command (#12199)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。doctor 缺包时给出项目自己的包管理器的安装命令，init 安装步骤只列 package.json 还缺的包
- [ ] [`4d42236bc`](https://github.com/meta/astryx/commit/4d42236bc) feat(cli): experimental icon search answers phrases and export names (#12138)
- [ ] [`660f768ee`](https://github.com/meta/astryx/commit/660f768ee) fix(cli): `astryx docs <topic>` prints the topic whole (#12208)
- [x] [`35fbc1120`](https://github.com/meta/astryx/commit/35fbc1120) experimental theme: fourteenth round of fixes (neutral variants, readable role text, one-browser pictures) (#12097)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`7e7cfef95`](https://github.com/meta/astryx/commit/7e7cfef95) ci: the swizzle proof's scope does not count the Build package's tests as toolchain (#12234)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0fbecc659`](https://github.com/meta/astryx/commit/0fbecc659) docs(cli): init help keeps one short rule per option; the rare cases move to the docs page (#12207)
- [ ] [`e4a629aa6`](https://github.com/meta/astryx/commit/e4a629aa6) fix(cli): a bare icon subcommand finds icons for its name instead of failing (#12171)
- [ ] [`f39ed0207`](https://github.com/meta/astryx/commit/f39ed0207) fix(cli): template docs never print a raw {@command} or {@pm} token; build and search text show doc commands with the project's command (#12214)
- [x] [`1336611d3`](https://github.com/meta/astryx/commit/1336611d3) fix(cli): a manifest key the running CLI does not know is a note, not an integration issue (#12245)
  - 不适用：集成包清单里不认识的键改为备注，我们没有集成包体系
- [x] [`1aad951ef`](https://github.com/meta/astryx/commit/1aad951ef) test(cli): the kept-store search catalog case skips on a Node without module.registerHooks (#11835)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9f3edefa7`](https://github.com/meta/astryx/commit/9f3edefa7) fix(cli): init in an app that is already set up prints the build and search commands (#12201)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。agent 文件都已是最新时 init 只打印 build、search 和安装步骤在哪，JSON 增加 agentDocsStatus（missing/stale/current）
- [ ] [`2c80ffc20`](https://github.com/meta/astryx/commit/2c80ffc20) feat(cli): an installed icon-set package turns on the experimental icon features (one gate) (#12176)
- [ ] [`37f95b51a`](https://github.com/meta/astryx/commit/37f95b51a) feat(cli): astryx mcp serves every command as an MCP tool, and the docs site's MCP runs it (#11686)
- [x] [`c9fdaecf5`](https://github.com/meta/astryx/commit/c9fdaecf5) fix(themes): text meets WCAG AA by role on every official theme (#12093)
  - 不适用：本范围只有上游主题编辑器调色板的跟进；主题文字对比度由主题族处理
- [x] [`ffd1c8e71`](https://github.com/meta/astryx/commit/ffd1c8e71) test(cli): install real base themes only from a complete build, in the fixture's own scope (#12065)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4e495449c`](https://github.com/meta/astryx/commit/4e495449c) [experimental] render: --out takes an absolute path in any folder (#12248)
- [ ] [`fac84a38e`](https://github.com/meta/astryx/commit/fac84a38e) fix(cli): when matches of one domain tie for first place on the same words, the name with more query words leads; a whole-query or named-title match keeps first (#12246)
- [x] [`86b073364`](https://github.com/meta/astryx/commit/86b073364) feat(cli): doctor names icon imports that no longer match the app's icon sets (#12194)
  - 不适用：doctor 检查图标导入是否还匹配应用配置的图标集，我们没有图标集配置
- [x] [`7520383a7`](https://github.com/meta/astryx/commit/7520383a7) fix(cli): a theme load on an older supported Node is refused as on Node 24 (#12142)
  - 不适用：旧版 Node 上加载 TS 主题模块的拒绝提示，属 theme build 的模块加载，我们没有
- [ ] [`48dc5d7e3`](https://github.com/meta/astryx/commit/48dc5d7e3) [experimental] render: every file is the page as a live app, with the page's script always in it (#12039)
- [x] [`a9c3c85e7`](https://github.com/meta/astryx/commit/a9c3c85e7) fix(cli): doctor says when an app does not import Core's component styles (#12244)
  - Vue 版已有：我们的每个组件子路径自己引入结构样式（如 Button.vue 引 styles/button.css），没有需要单独引入而会漏掉的组件样式表；--built 部分我们没有
- [ ] [`4d3b636c1`](https://github.com/meta/astryx/commit/4d3b636c1) fix(cli): build's playbook names the exact theme wiring (#12289)
- [x] [`3e58ae0f8`](https://github.com/meta/astryx/commit/3e58ae0f8) fix(Theme): a theme's color-mode blocks under a system Theme that no Theme forces follow the page root's scheme (#12270)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`68510fe2b`](https://github.com/meta/astryx/commit/68510fe2b) fix(cli): an unknown command names the command meant for words from other command lines (#12249)
- [ ] [`1939759f5`](https://github.com/meta/astryx/commit/1939759f5) [feat] cli: discover matches word by word, names Core's match on a miss (#12219)
- [ ] [`3a1165f91`](https://github.com/meta/astryx/commit/3a1165f91) fix(cli): the named scaffold path is the file the copy writes (#12294)
- [ ] [`484f7afbd`](https://github.com/meta/astryx/commit/484f7afbd) feat(cli): the agent block says how to remove it (#12317)
- [ ] [`aef3b9891`](https://github.com/meta/astryx/commit/aef3b9891) [experimental] render: a page keeps working in a viewer that blocks storage or the clipboard (#12329)
- [ ] [`2a2f576db`](https://github.com/meta/astryx/commit/2a2f576db) [experimental] render: one refusal names every package the page needs (#12318)
- [ ] [`66a16258f`](https://github.com/meta/astryx/commit/66a16258f) fix(templates): page templates get main landmarks, one h1 and ordered outlines (#12160)
- [ ] [`f04fbf9f6`](https://github.com/meta/astryx/commit/f04fbf9f6) fix(cli): a failed release install waits only for the registry it failed with (#12347)
- [x] [`7649062b7`](https://github.com/meta/astryx/commit/7649062b7) spec(AST-110): the swizzle proof runs on main and fixes forward (FR7, DEC-3) (#12362)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b7f61b795`](https://github.com/meta/astryx/commit/b7f61b795) fix(cli): outside a project, a page takes the packages its host's set lists (#12057)
- [ ] [`3a4f5c0ed`](https://github.com/meta/astryx/commit/3a4f5c0ed) fix(cli): theme pictures wait for quiet and hold the page's script during the whole-page picture, so responsive charts are drawn (#12366)
- [ ] [`74cb4cabf`](https://github.com/meta/astryx/commit/74cb4cabf) [experimental] render: the script reads each imported image from the embedded source when it carries it, one copy fewer (#12273)
- [x] [`a6538f27a`](https://github.com/meta/astryx/commit/a6538f27a) feat(cli): an integration can say how its apps add a dependency (installGuidance) (#12218)
  - 不适用：集成包声明 installGuidance，我们没有集成包体系
- [ ] [`02f5df125`](https://github.com/meta/astryx/commit/02f5df125) [experimental] render: refuse a named import its module does not export (#12319)
- [x] [`03d2717aa`](https://github.com/meta/astryx/commit/03d2717aa) ci: the swizzle proof moves to main checks, and every release-check proves every target (#12449)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`5747fa25e`](https://github.com/meta/astryx/commit/5747fa25e) fix(cli): stored docs routes are the same however Node resolves module imports (#12532)
- [ ] [`01b75141f`](https://github.com/meta/astryx/commit/01b75141f) [experimental] render: a page whose script holds a long run of letters and digits renders in its usual time again (#12533)
- [ ] [`d5b841735`](https://github.com/meta/astryx/commit/d5b841735) fix(cli): a docs namespace page's own text yields to the doc beneath it that answers the same word (#12336)
- [ ] [`2f673895c`](https://github.com/meta/astryx/commit/2f673895c) cli: one file-identity rule for the in-process file caches (#12440)
- [ ] [`7cb595c9a`](https://github.com/meta/astryx/commit/7cb595c9a) [experimental] render: the missing-package refusal offers no install line that would install in the wrong place (#12429)
- [x] [`7658fcff5`](https://github.com/meta/astryx/commit/7658fcff5) fix(cli): theme build leaves the page's color scheme to the page (#12250)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`8b176db24`](https://github.com/meta/astryx/commit/8b176db24) perf(cli): a lookup miss reads the component matcher's Core inputs from a kept summary instead of every Core doc (#12538)
- [ ] [`23cfeb3c0`](https://github.com/meta/astryx/commit/23cfeb3c0) perf(cli): keep template discovery for component and template in projects with no integration (#12585)
- [x] [`7819d1d9a`](https://github.com/meta/astryx/commit/7819d1d9a) feat(cli): theme build names a page-rule setting of the theme that the browser does not show as written (#12400)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [x] [`f5bd0f8de`](https://github.com/meta/astryx/commit/f5bd0f8de) Component docs: playground.mobile for a phone-width render (AppShell's mobile layout) (#12477)
  - 不适用：本范围只有上游主题编辑器和预览对 playground.mobile 的跟进；文档部分由布局族处理
- [ ] [`286e4db56`](https://github.com/meta/astryx/commit/286e4db56) fix(cli): the transpile cache names copies for their source text and trims one subfolder per write, so it stays small and no run reads all of it (#12385)
- [ ] [`8d64c7628`](https://github.com/meta/astryx/commit/8d64c7628) [experimental] render: say when a file the page imports is not carried because its name reads as a tool's configuration (#12272)
- [x] [`238a0e59e`](https://github.com/meta/astryx/commit/238a0e59e) feat(cli): doctor warns about a local theme setting that does not show as written (#12408)
  - 不适用：本地主题设置被层叠覆盖的告警，来自 theme build 的检查，我们没有
- [x] [`6ff24e4e5`](https://github.com/meta/astryx/commit/6ff24e4e5) docs(Table, useToast): row open, selection, plugin, empty-state and toast-option answers (#12344)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b39bbaad5`](https://github.com/meta/astryx/commit/b39bbaad5) [experimental] render: the text answer names at most 10 files, then counts the rest (#12287)
- [ ] [`b2cf0a1ad`](https://github.com/meta/astryx/commit/b2cf0a1ad) feat(cli): search lists the installed icons that answer an icon ask (#12183)
- [x] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
  - 不适用：本范围只有上游主题编辑器的部位词表跟进；Core 主题挂点由各组件族处理
- [ ] [`39e859a30`](https://github.com/meta/astryx/commit/39e859a30) fix(cli): outside a project, template counts the integrations a host approves, as render serves them (#12370)
- [x] [`20e4d4841`](https://github.com/meta/astryx/commit/20e4d4841) test(cli): the swizzle proof renders ChatVirtualizer with rows, and a target with a required prop and no sample fails by name (#12586)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1a54235b4`](https://github.com/meta/astryx/commit/1a54235b4) fix(cli): the setup reminder prints first and says why to run init now (#12544)
- [ ] [`4a8df8bca`](https://github.com/meta/astryx/commit/4a8df8bca) fix(cli): template help names only what the base serves (#12419)
- [ ] [`4f0a13a60`](https://github.com/meta/astryx/commit/4f0a13a60) feat(cli): where icon features are on, the agent block sends agents to the icon finder (#12210)
- [x] [`d0d712165`](https://github.com/meta/astryx/commit/d0d712165) test(cli): the kept-value cases that read a value back skip on a Node without module hooks (#12353)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f63cf9f7f`](https://github.com/meta/astryx/commit/f63cf9f7f) feat(cli): component reads print a short answer by default (#12291)
- [x] [`21d736bb0`](https://github.com/meta/astryx/commit/21d736bb0) feat(cli): doctor's kept-cache row prints a short brief; --json keeps the whole message (#12607)
  - 不适用：doctor 缓存行的简短说明，我们没有缓存
- [x] [`f6d900c1c`](https://github.com/meta/astryx/commit/f6d900c1c) test(cli): make browser timeout cleanup independent of child startup (#12254)
  - 不适用：只改上游测试（自动初筛）
- [x] [`50275d955`](https://github.com/meta/astryx/commit/50275d955) fix(core): fields with a status keep their keyboard focus ring (and the theme editor follows) (#12139)
  - 不适用：本范围只有上游主题编辑器 how 问答的跟进；Core 焦点环由输入框族处理
- [x] [`2910a14da`](https://github.com/meta/astryx/commit/2910a14da) feat(cli): theme add installs a shared theme from a folder, a .tgz, or a URL in one command (#12436)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [ ] [`0f3ed13d4`](https://github.com/meta/astryx/commit/0f3ed13d4) feat(cli): search lists no icons for "with an icon" when the results answer a component (#12305)
- [ ] [`bbf643a03`](https://github.com/meta/astryx/commit/bbf643a03) [experimental] cli: experimental render is now experimental export (#12302)
- [ ] [`227a9deb6`](https://github.com/meta/astryx/commit/227a9deb6) fix(cli): search reads another entry's name as that entry's evidence (#12433)
- [x] [`03cc6348a`](https://github.com/meta/astryx/commit/03cc6348a) test(cli): load stored doc reference exports natively under contention (#12116)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`47faabe74`](https://github.com/meta/astryx/commit/47faabe74) [experimental] render: --reverse names every file the render records as not carried as missing (#12404)
- [x] [`b73bf7dcf`](https://github.com/meta/astryx/commit/b73bf7dcf) fix(cli): theme editor skips a part write that repeats Core's own token reference, says when a value matches, and names where misses are (#12480)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`02c02700f`](https://github.com/meta/astryx/commit/02c02700f) fix(templates): keyboard reach for the kanban board's info icons and the side-nav shell's conversation options (#12152)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`daeb59651`](https://github.com/meta/astryx/commit/daeb59651) [experimental] export: the walk of modules outside the carried folder follows TypeScript-style .js imports (#12627)
- [ ] [`e8aeeb126`](https://github.com/meta/astryx/commit/e8aeeb126) fix(cli): component reads of a hook print what it returns (#12462)
- [ ] [`3d190901d`](https://github.com/meta/astryx/commit/3d190901d) [experimental] export: the first paint asks for no focus; the script owns it (#12320)
- [ ] [`2d3d7c439`](https://github.com/meta/astryx/commit/2d3d7c439) docs(cli): help says what export is for: one HTML file from an Astryx page (#12463)
- [ ] [`432354a79`](https://github.com/meta/astryx/commit/432354a79) perf(cli): search loads its icon-section code only where icon features are on (#12615)
- [ ] [`2750bc058`](https://github.com/meta/astryx/commit/2750bc058) [experimental] cli: astryx experimental import turns an exported file back into its page (#12381)
- [ ] [`6ae843e75`](https://github.com/meta/astryx/commit/6ae843e75) docs(cli): the layout and tokens pages carry their core rules (#12209)
- [x] [`ea92bc042`](https://github.com/meta/astryx/commit/ea92bc042) fix(core): theme targets for Pagination's control row, cells and ellipsis (#12253)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`befd6aa13`](https://github.com/meta/astryx/commit/befd6aa13) [experimental] render: keep a theme's rules for the parts Core names while the page runs (#12397)
- [ ] [`af049a4e6`](https://github.com/meta/astryx/commit/af049a4e6) perf(cli): the icon finder works out each set's words once and each query's forms once per pass (#12187)
- [x] [`7567d47a9`](https://github.com/meta/astryx/commit/7567d47a9) feat(cli): theme add of a shared theme follows an integration's install guidance (#12621)
  - 不适用：上游 theme add/remove/list/eject/template 管理主题包和主题模块；我们的主题都在 @astryx-vue/themes 一个包里，引一个 CSS 即可，doctor 负责检查安装
- [ ] [`ce3eb6270`](https://github.com/meta/astryx/commit/ce3eb6270) [experimental] cli: discover lists icon packs before an app picks one (#12220)
- [x] [`b17c25f65`](https://github.com/meta/astryx/commit/b17c25f65) fix(cli): theme build reads a same-file base theme that extends names as the base, not as the theme (#12602)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`9e83b70b2`](https://github.com/meta/astryx/commit/9e83b70b2) [experimental] cli: a share word's suggestion says export is for a page built with Astryx (#12638)
- [x] [`dbfa703ca`](https://github.com/meta/astryx/commit/dbfa703ca) feat(cli): astryx init --to puts the Astryx skill where your agents read it (#12264)
  - 不适用：init --to 把技能写进 .agents/skills 等技能目录并记进 astryx.config；我们的 init 只维护项目 agent 文件里的受管理区块，没有技能目录和配置文件这套设施
- [ ] [`bbc0435e2`](https://github.com/meta/astryx/commit/bbc0435e2) feat(cli): name a template's components for one component read (#12389)
- [ ] [`49896f659`](https://github.com/meta/astryx/commit/49896f659) [experimental] export: a path from the site's root reads public/ only, and its images come back with --reverse (#12275)
- [ ] [`25ef4b4c5`](https://github.com/meta/astryx/commit/25ef4b4c5) fix(cli): a run that keeps many values trims the catalogs folder once, when it ends, not after each value (#12637)
- [x] [`b6f9f1c70`](https://github.com/meta/astryx/commit/b6f9f1c70) perf(cli): search, lookups, build, doctor, integration and theme list stop loading zlib; theme add loads it only to unpack an archive (#12630)
  - 不适用：theme list/add 按需加载 zlib，我们没有这些命令，CLI 也不解包归档
- [ ] [`09e321e12`](https://github.com/meta/astryx/commit/09e321e12) fix(cli): docs typo suggestions list the closest topic first (#12423)
- [x] [`3deff9de7`](https://github.com/meta/astryx/commit/3deff9de7) feat(core): theme seams for the spinner, tree disclosure, number steppers and close buttons (#12156)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9ed2e323d`](https://github.com/meta/astryx/commit/9ed2e323d) refactor(cli): share the docs [experimental] mark rule (#12446)
- [x] [`04d75e888`](https://github.com/meta/astryx/commit/04d75e888) fix(cli): init --user on a folder it cannot write says what to change (#12464)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。init 写不了文件时报 ERR_WRITE_FAILED 并写明文件、原因（如 EACCES）和该改什么；--user 部分我们没有
- [ ] [`e318f3b9f`](https://github.com/meta/astryx/commit/e318f3b9f) search: an item's exact name typed as one word leads (#12599)
- [ ] [`badc19e49`](https://github.com/meta/astryx/commit/badc19e49) fix(cli): experimental icon sets — a refresh removes every look of an icon the library no longer exports (#12682)
- [x] [`9faffea27`](https://github.com/meta/astryx/commit/9faffea27) test(cli): swizzle-proof targets with a required prop render with a sample (#12690)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`7213d7fb1`](https://github.com/meta/astryx/commit/7213d7fb1) docs(cli): export's data.files names the images read from public/ (#12667)
- [ ] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
- [x] [`daf5e2cb3`](https://github.com/meta/astryx/commit/daf5e2cb3) chore: land batch 3 (13 pull requests) (#12722)
  - 已移植：[#530](https://github.com/astryx-vue/astryx-vue/pull/530)。#12451 确认类选项说明命令从不提问并给出去掉它的命令、#12567 原则文档设置分组用 Section、#12524 README 写明先跑 init；#12540 慢管道 Vue 版已有（只设 exitCode 不调 process.exit）；其余为主题构建、doctor 构建产物扫描、图标搜索等我们没有的命令或由别族处理
- [x] [`23921d9cb`](https://github.com/meta/astryx/commit/23921d9cb) test(cli): the offline picture proof asserts no connection, not a wall clock (#12757)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3b21ca666`](https://github.com/meta/astryx/commit/3b21ca666) feat(theme): chat surfaces default to the container radius (#12794)
- [ ] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
- [x] [`8c52e3bba`](https://github.com/meta/astryx/commit/8c52e3bba) chore: land batch 7 (3 pull requests) (#12811)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8688c1885`](https://github.com/meta/astryx/commit/8688c1885) chore: land batch 6 (11 pull requests) (#12812)
- [x] [`9c2767b31`](https://github.com/meta/astryx/commit/9c2767b31) [Component Audit] MobileNav: the menu button keeps its link to the drawer when id is undefined, and docs list the label prop (#11621)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8554b67ed`](https://github.com/meta/astryx/commit/8554b67ed) chore: land batch 5 (7 pull requests) (#12818)
- [ ] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
- [ ] [`226afd33b`](https://github.com/meta/astryx/commit/226afd33b) chore: land batch 10 (3 pull requests) (#12844)
- [ ] [`910b80d5f`](https://github.com/meta/astryx/commit/910b80d5f) chore: land batch 9 (4 pull requests) (#12825)
- [ ] [`9e445ba0d`](https://github.com/meta/astryx/commit/9e445ba0d) chore: land batch 15 (5 pull requests) (#12859)
- [x] [`4c309698d`](https://github.com/meta/astryx/commit/4c309698d) chore: land batch 22 (2 pull requests) (#12877)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4f5390649`](https://github.com/meta/astryx/commit/4f5390649) chore: land batch 14 (2 pull requests) (#12874)
- [x] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
  - 不适用：本范围是 doctor 字体检查读主题 README 的字体链接，我们没有字体检查；Core 部分由别族处理
- [ ] [`a16f2e4a4`](https://github.com/meta/astryx/commit/a16f2e4a4) chore: land batch 13 (2 pull requests) (#12854)
- [ ] [`83424673c`](https://github.com/meta/astryx/commit/83424673c) chore: land batch 16 (6 pull requests) (#12881)
- [x] [`d60793cbc`](https://github.com/meta/astryx/commit/d60793cbc) chore: land batch 18 (2 pull requests) (#12882)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。#12780 init 的主题安装按项目 core 的版本；#12288 技能目录我们没有
- [x] [`783e47029`](https://github.com/meta/astryx/commit/783e47029) chore: land batch 17 (2 pull requests) (#12866)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [ ] [`e9b125444`](https://github.com/meta/astryx/commit/e9b125444) chore: land batch 24 (3 pull requests) (#12883)
- [ ] [`b871bc6d1`](https://github.com/meta/astryx/commit/b871bc6d1) chore: land batch 28 (2 pull requests) (#12892)
- [x] [`67a6a0694`](https://github.com/meta/astryx/commit/67a6a0694) chore: land batch 27 (1 pull requests) (#12899)
  - 不适用：只改上游测试（自动初筛）
- [x] [`dcdd9faca`](https://github.com/meta/astryx/commit/dcdd9faca) chore: land batch 33 (1 pull requests) (#12906)
  - 不适用：上游 theme build 把 StyleX defineTheme 的 TS 主题模块编译成 CSS/JS；我们的主题是现成 CSS，CLI 的 theme 只打印接入文档，没有构建步骤
- [ ] [`cb58ce756`](https://github.com/meta/astryx/commit/cb58ce756) chore: land batch 31 (1 pull requests) (#12902)
- [ ] [`0f67e76cb`](https://github.com/meta/astryx/commit/0f67e76cb) chore: land batch 35 (1 pull requests) (#12907)
- [ ] [`5825a9d56`](https://github.com/meta/astryx/commit/5825a9d56) chore: land batch 38 (2 pull requests) (#12912)
- [x] [`75649f57f`](https://github.com/meta/astryx/commit/75649f57f) chore: land batch 30 (4 pull requests) (#12901)
  - 不适用：init --once/--remove、技能目录和计算机级文本，我们没有这些设施
- [x] [`788018029`](https://github.com/meta/astryx/commit/788018029) chore: land batch 40 (4 pull requests) (#12914)
  - 不适用：本范围是主题编辑器色族和 render 命令的资源路径，我们都没有；模板部分由模板族处理
- [ ] [`a8001d84f`](https://github.com/meta/astryx/commit/a8001d84f) chore: land batch 44 (1 pull requests) (#12919)
- [ ] [`6c12793c1`](https://github.com/meta/astryx/commit/6c12793c1) chore: land batch 41 (1 pull requests) (#12916)
- [ ] [`2535488bf`](https://github.com/meta/astryx/commit/2535488bf) chore: land batch 50 (1 pull requests) (#12928)
- [x] [`8fdc1620b`](https://github.com/meta/astryx/commit/8fdc1620b) chore: land batch 62 (1 pull requests) (#12943)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`81458c4b1`](https://github.com/meta/astryx/commit/81458c4b1) chore: land batch 60 (4 pull requests) (#12939)
- [x] [`215925cc0`](https://github.com/meta/astryx/commit/215925cc0) chore: land batch 59 (8 pull requests) (#12938)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e2c4185da`](https://github.com/meta/astryx/commit/e2c4185da) test(cli): the packed gather cache tests expect what a Node without module hooks keeps (#12622)
  - 不适用：只改上游测试（自动初筛）
- [x] [`476d9063f`](https://github.com/meta/astryx/commit/476d9063f) chore: land batch 63 (3 pull requests) (#12945)
  - 不适用：本范围是主题编辑器圆角和按需读锁文件的优化；我们的 CLI 只判断锁文件是否存在、从不读内容；Table 和 Core 圆角由别族处理
- [x] [`82af9164d`](https://github.com/meta/astryx/commit/82af9164d) fix(ProgressBar, CircularProgress, themes): every enabled progress fill reaches 3:1 against its track (#12398)
  - 不适用：本范围只有上游主题编辑器的跟进；进度条对比度由主题与实验室族处理
- [ ] [`8c8a7e116`](https://github.com/meta/astryx/commit/8c8a7e116) chore: land batch 64 (1 pull requests) (#12948)
- [ ] [`e7bbc5bf7`](https://github.com/meta/astryx/commit/e7bbc5bf7) chore: land batch 65 (1 pull requests) (#12951)
- [x] [`6287f9d15`](https://github.com/meta/astryx/commit/6287f9d15) test(cli): the PATH-order browser case skips where a browser is installed before PATH (#12470)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
- [ ] [`e2b63aeb6`](https://github.com/meta/astryx/commit/e2b63aeb6) feat(lab): add VideoPlayer and AudioPlayer media players (#9832)
- [ ] [`08491e55c`](https://github.com/meta/astryx/commit/08491e55c) chore: land batch 77 (3 pull requests) (#12973)
- [ ] [`4e35a9856`](https://github.com/meta/astryx/commit/4e35a9856) spec(internationalization): a component takes a prop for each string callers reword; provider overrides are an app-wide escape hatch (#12675)
- [ ] [`ab9aaa5a2`](https://github.com/meta/astryx/commit/ab9aaa5a2) chore: land batch 70 (2 pull requests) (#12963)
- [x] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
  - 不适用：本范围是主题编辑器、实验性 icon 命令（我们没有）和路径安全；template 的 ~/ 修复由模板族处理，Core 浮层由浮层族处理
- [x] [`a19a5170b`](https://github.com/meta/astryx/commit/a19a5170b) chore: land batch 74 (1 pull requests) (#12968)
  - 已移植：[#538](https://github.com/astryx-vue/astryx-vue/pull/538)。doctor 新增 button-actions 检查：读 .vue 模板，标出没有动作、处理函数为空或链接无处可去且周围没有东西接管按下的 core Button/IconButton，补测试
- [ ] [`0bfa86c6c`](https://github.com/meta/astryx/commit/0bfa86c6c) chore: land batch 76 (2 pull requests) (#12972)
- [x] [`c1f52ff91`](https://github.com/meta/astryx/commit/c1f52ff91) perf(core): reading the locale or direction does not load the message parser (#12975)
  - 不适用：只改上游测试（自动初筛）
- [x] [`45678b463`](https://github.com/meta/astryx/commit/45678b463) test(cli): the swizzle proof renders Lab's MediaPlayer with its required label (#13001)
  - 不适用：只改上游测试（自动初筛）
- [x] [`59fd4151b`](https://github.com/meta/astryx/commit/59fd4151b) chore: land batch 82 (7 pull requests) (#12992)
  - 已移植：[#537](https://github.com/astryx-vue/astryx-vue/pull/537)。#12857 样式指南补上自己写样式时守住的几条（排版规则 Vue 版已有）；--built、prop drift 和测试调整不适用，Table 部分由表格族处理
- [ ] [`dacc31737`](https://github.com/meta/astryx/commit/dacc31737) chore: land batch 72 (9 pull requests) (#12965)
- [ ] [`d5fb59c68`](https://github.com/meta/astryx/commit/d5fb59c68) chore: land batch 86 (2 pull requests) (#13014)
- [ ] [`44bf7d463`](https://github.com/meta/astryx/commit/44bf7d463) chore: land batch 83 (5 pull requests) (#12993)
- [ ] [`2ea02fd50`](https://github.com/meta/astryx/commit/2ea02fd50) chore: land batch 78 (2 pull requests) (#12976)
- [ ] [`c0beed3e1`](https://github.com/meta/astryx/commit/c0beed3e1) chore: land batch 71 (3 pull requests) (#12964)
- [ ] [`9d23a5e6e`](https://github.com/meta/astryx/commit/9d23a5e6e) chore: land batch 87 (2 pull requests) (#13021)
- [x] [`c1c5cdf03`](https://github.com/meta/astryx/commit/c1c5cdf03) chore: land batch 89 (1 pull requests) (#13028)
  - 不适用：doctor 缓存 Core props 扫描，我们没有这项检查也没有缓存
- [x] [`5c4812389`](https://github.com/meta/astryx/commit/5c4812389) chore: land batch 88 (3 pull requests) (#13025)
  - 不适用：调色板生成器的新版配方提示、主题编辑器 padding、StyleX Vite 插件文档，均属我们没有的命令或 React/StyleX 生态
- [x] [`4b8732e42`](https://github.com/meta/astryx/commit/4b8732e42) test(cli): export tests wait for the values they read, not fixed delays (#13031)
  - 不适用：只改上游测试（自动初筛）
- [x] [`416b167cf`](https://github.com/meta/astryx/commit/416b167cf) fix(core): one focus return for Popover and DropdownMenu (popover presentation) and Dialog that never strands focus (AST-116 FR17–FR21, AR1) (#11121)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0b94167aa`](https://github.com/meta/astryx/commit/0b94167aa) chore: land batch 91 (1 pull requests) (#13034)
- [x] [`0cee4911d`](https://github.com/meta/astryx/commit/0cee4911d) chore: land batch 92 (1 pull requests) (#13037)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [ ] [`e1dfebf35`](https://github.com/meta/astryx/commit/e1dfebf35) chore: land batch 93 (1 pull requests) (#13041)
- [x] [`4493a3c48`](https://github.com/meta/astryx/commit/4493a3c48) spec(AST-112): keep the package's shape; move the rest to its owners (#13029)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2f23f1241`](https://github.com/meta/astryx/commit/2f23f1241) chore: land batch 95 (1 pull requests) (#13046)
  - 不适用：doctor 缓存按钮扫描结果，我们没有缓存目录
- [x] [`c1eeb636b`](https://github.com/meta/astryx/commit/c1eeb636b) chore: land batch 94 (2 pull requests) (#13045)
  - 不适用：本范围是 #13002 计算机级集成包的 doctor 提示，我们没有；#12710 模板越界拒绝的提示由模板族处理
- [ ] [`9fcdd567b`](https://github.com/meta/astryx/commit/9fcdd567b) chore: land batch 97 (1 pull requests) (#13055)
- [ ] [`630e44413`](https://github.com/meta/astryx/commit/630e44413) fix(cli): a stop signal during the release install stops the run (#13053)
- [x] [`f66c18409`](https://github.com/meta/astryx/commit/f66c18409) chore: land batch 96 (1 pull requests) (#13047)
  - 不适用：上游实验性主题编辑器（experimental theme editor）的改动，我们的 CLI 没有这个命令
- [x] [`bda1fbde9`](https://github.com/meta/astryx/commit/bda1fbde9) chore: land batch 100 (1 pull requests) (#13063)
  - 不适用：doctor integration validate 找计算机级集成包，我们没有集成包体系

## 命令行新增页面模板（area:cli）

### v0.7.2

- [ ] [`4eaefd464`](https://github.com/meta/astryx/commit/4eaefd464) fix(templates): label the table-filter view-options panel by its selected tab (#7591)
- [x] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)
  - Vue 版已有：Drawer 和 DrawerHeader 本来就在 core，Vue 的 lab 没有 Drawer；块示例对应 Vue 文档里已有的 drawer 页示例
- [ ] [`52c42390c`](https://github.com/meta/astryx/commit/52c42390c) fix(cli): exclude template-local helpers from extractComponents (#7641)
- [ ] [`17e56d8ad`](https://github.com/meta/astryx/commit/17e56d8ad) feat(cli): check each authored doc against its published authoring type (#7664)
- [ ] [`e26723dcf`](https://github.com/meta/astryx/commit/e26723dcf) docs(cli): import each Core export from the path `astryx component` prints (#7623)
- [ ] [`c2e0a594e`](https://github.com/meta/astryx/commit/c2e0a594e) feat(cli): doctor integration validate checks each doc against its published authoring type (#7673)
- [ ] [`e4bdd7026`](https://github.com/meta/astryx/commit/e4bdd7026) docs(cli): make the integration guides and Authoring Reference match the CLI (#7263)
- [ ] [`40b21e570`](https://github.com/meta/astryx/commit/40b21e570) feat(cli): list passages two integration topics repeat word for word (#7735)
- [ ] [`a44ebd55a`](https://github.com/meta/astryx/commit/a44ebd55a) feat(cli): install once, run anywhere — every copy hands a project's run to the release its Core matches (#7649)

### v0.7.3

- [ ] [`b7e33f1d0`](https://github.com/meta/astryx/commit/b7e33f1d0) refactor(cli): build and search answer through one shared dispatcher/searcher pattern (#7752)
- [ ] [`2583fe68e`](https://github.com/meta/astryx/commit/2583fe68e) docs(cli): add the is-my-code-good guide (#7259)
- [ ] [`e9694dcf8`](https://github.com/meta/astryx/commit/e9694dcf8) fix(cli): integration check findings say plainly what is wrong and how to fix it (#7787)
- [ ] [`cb489ffbc`](https://github.com/meta/astryx/commit/cb489ffbc) fix(cli): find Core and configured integrations from any folder in a project (#7492)
- [ ] [`641d08e46`](https://github.com/meta/astryx/commit/641d08e46) docs(cli): give every doc a named home; authoring owns integration authoring (#7835)
- [ ] [`296edaf9e`](https://github.com/meta/astryx/commit/296edaf9e) feat(cli): put the likely entry first in failed-lookup suggestions (#7876)
- [ ] [`fba04ed6a`](https://github.com/meta/astryx/commit/fba04ed6a) search: find a template by its display name (#7895)

### v0.7.4

- [x] [`36515dccd`](https://github.com/meta/astryx/commit/36515dccd) feat(core): BottomSheetSwitcher presents each sheet in its own native dialog (#7720)
  - Vue 版已有：BottomSheetSwitcher.vue 用原生 dialog 呈现每一页
- [ ] [`1a552f29b`](https://github.com/meta/astryx/commit/1a552f29b) [CLI] Doc syntax: {@command}, {@pm}, {@pm-only} tokens, and integration check --next (#7868)
- [ ] [`78641f811`](https://github.com/meta/astryx/commit/78641f811) [CLI] Integration checks for component examples, showcases, template categories and packed assets (#7891)
- [x] [`4fc0c4a48`](https://github.com/meta/astryx/commit/4fc0c4a48) feat(cli): experimental icon sets — icon definitions, `astryx experimental icon`, templates that use the installed set (#7759)
  - 不适用：上游实验性图标集（icon set 定义、experimental icon 命令、模板按图标集换图标），我们的 CLI 没有图标集配置，模板直接用 core 的 Icon
- [x] [`b33622e50`](https://github.com/meta/astryx/commit/b33622e50) docs: say what four block templates are for (#7963)
  - 不适用：只改上游块模板的说明文字；Vue 没有块模板，对应示例在文档页里各自带说明
- [x] [`768c2f0f6`](https://github.com/meta/astryx/commit/768c2f0f6) [Component Audit] CommandPaletteItem: let themes style highlighted, selected, and disabled items (#7967)
  - Vue 版已有：CommandPaletteItem.vue 已把高亮、选中、禁用反映成 data-highlighted、data-selected、data-disabled

### v0.7.5

- [x] [`51c62ca66`](https://github.com/meta/astryx/commit/51c62ca66) docs(cli): Tokenizer blocks and stories fit a phone-sized screen (#8002)
  - 不适用：上游 CLI 里 Tokenizer 块模板的手机宽度；Vue 文档示例在文档站预览框里自适应宽度
- [x] [`2a50a8064`](https://github.com/meta/astryx/commit/2a50a8064) feat(cli): experimental icon sets — authoring fixes from fresh-agent Heroicons and Lucide runs (#7964)
  - 不适用：上游实验性图标集（icon set 定义、experimental icon 命令、模板按图标集换图标），我们的 CLI 没有图标集配置，模板直接用 core 的 Icon
- [ ] [`298a4ce17`](https://github.com/meta/astryx/commit/298a4ce17) fix(cli): stop not-found suggestions where the matches get weaker (#7999)
- [x] [`ee98ff9a8`](https://github.com/meta/astryx/commit/ee98ff9a8) docs: TabList scrolls its overflow, and MobileNav is a drawer (#8100)
  - Vue 版已有：library.vue 里 MobileNav 的描述已经是滑出式导航抽屉
- [x] [`c19b5e326`](https://github.com/meta/astryx/commit/c19b5e326) fix(CodeBlock): the headerless Copy button never covers code (#8101)
  - 不适用：本族只涉及上游块模板说明，Vue 没有块模板；CodeBlock（core/src/Code）复制按钮的修复归富文本与代码高亮族
- [x] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
  - 已移植：[#554](https://github.com/astryx-vue/astryx-vue/pull/554)。表格对比、告警栏仪表盘页的状态文字改读 text 状态色；状态色角色本身见 #517
- [x] [`bb12cfbd6`](https://github.com/meta/astryx/commit/bb12cfbd6) fix(Thumbnail): Open and Remove stay mounted while they cannot act (#8542)
  - 已移植：[#503](https://github.com/astryx-vue/astryx-vue/pull/503)。按基础展示族结论：Thumbnail 的 Open/Remove 不能操作时仍挂载并标 aria-disabled
- [ ] [`2a162e1b6`](https://github.com/meta/astryx/commit/2a162e1b6) feat(core): BottomSheet stacks by open order, replaces on a same-update switch, and BottomSheetSwitcher is deprecated (#7648)
  - 暂缓：BottomSheet 按打开顺序叠放、同一次更新里切换替换：Vue 没有等价的打开顺序栈，Switcher 弃用说明待单独处理
- [ ] [`dbb2d527e`](https://github.com/meta/astryx/commit/dbb2d527e) fix(cli): the Tokenizer showcase block searches its tags (#8737)
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.6

- [x] [`3f19de5d3`](https://github.com/meta/astryx/commit/3f19de5d3) spec(template-authoring): motion and gesture examples swap docs-only showcase elements for generic ones when distributed (#9419)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e84fb851f`](https://github.com/meta/astryx/commit/e84fb851f) fix(cli): BottomSheet checklist examples toggle from the whole row (#9533)
  - Vue 版已有：bottom-sheet 示例的筛选清单用 CheckboxListItem，点整行就能切换
- [ ] [`61e061cb5`](https://github.com/meta/astryx/commit/61e061cb5) feat: replace demo-content elements on every copy and every surface that hands out example source (#9430)
- [x] [`a34b88669`](https://github.com/meta/astryx/commit/a34b88669) docs(useCollator): add a locale-aware name sort example block (#9510)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useCollator 页补按语言排姓名的示例
- [x] [`d34e843ea`](https://github.com/meta/astryx/commit/d34e843ea) docs(useToast): add a settings saved example block (#9512)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useToast 页补「设置已保存」示例
- [x] [`d219cdfc6`](https://github.com/meta/astryx/commit/d219cdfc6) docs(useTranslator): add a load-more footer example block (#9573)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useTranslator 页补加载更多页脚示例
- [x] [`1667ea833`](https://github.com/meta/astryx/commit/1667ea833) docs(core): add a usePressFeedback example on a pressable Card (#9431)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。usePressFeedback 页用可按的卡片做示例

### v0.7.7

- [x] [`e0548a647`](https://github.com/meta/astryx/commit/e0548a647) docs(useListFocus): add a recent files example block (#9577)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useListFocus 页补最近文件示例
- [x] [`637d2352c`](https://github.com/meta/astryx/commit/637d2352c) docs(useCombobox): add an assign-to field example block (#9576)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。新增 useCombobox 文档页和「指派给」字段示例
- [x] [`e0eac233d`](https://github.com/meta/astryx/commit/e0eac233d) docs(core): smaller, realistic playing-card demo for motion and gesture examples, with a usage hint (#9607)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。usePressFeedback 示例已是一张可按的卡片；扑克牌示例随 pan、animator 等 hook 暂缓
- [x] [`d5a3d00d0`](https://github.com/meta/astryx/commit/d5a3d00d0) docs(useOverflow): add an editor toolbar example block (#9689)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useOverflow 页补编辑器工具栏示例
- [x] [`559b0054f`](https://github.com/meta/astryx/commit/559b0054f) docs(useGridFocus): add a color swatch grid example block (#9574)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useGridFocus 页补色板网格示例
- [x] [`120847534`](https://github.com/meta/astryx/commit/120847534) docs(useOutlineFromMarkdown): add hook docs and a docs article example block (#9719)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。新增 useOutlineFromMarkdown 文档页和文档文章示例

### v0.7.8

- [ ] [`871bc3d5e`](https://github.com/meta/astryx/commit/871bc3d5e) feat(core): createAnimator and useAnimator animate one element (#8653)
  - 暂缓：createAnimator/useAnimator、createPanGesture/usePanGesture、createDragToSnapPoints 这批动效与手势 hook 在 Vue 版还没有（由交互族任务落地），示例块等它们落地后再补
- [x] [`dc90b5031`](https://github.com/meta/astryx/commit/dc90b5031) docs(useAnnounce): add a filter result count example block (#9509)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useAnnounce 页补筛选结果数播报示例
- [ ] [`dcf3d6f86`](https://github.com/meta/astryx/commit/dcf3d6f86) feat(Tokenizer): presentation is a stable prop, and adaptive is its default (#9796)
  - 暂缓：Tokenizer 的 presentation 属性和 adaptive 默认值依赖 Vue 版还没有的触屏弹层
- [x] [`1404bf84e`](https://github.com/meta/astryx/commit/1404bf84e) docs(useFocusTrap): add a quick edit panel example block (#9513)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useFocusTrap 页补快速编辑面板示例
- [x] [`96066d710`](https://github.com/meta/astryx/commit/96066d710) docs(useLocale): add an invoice summary example block (#9511)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useLocale 页补发票汇总示例
- [x] [`09ea8afb2`](https://github.com/meta/astryx/commit/09ea8afb2) docs(useKeyboardHint): call the hook directly in a star rating example (#9575)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useKeyboardHint 页直接调用 hook 做星级评分示例
- [x] [`ad27496be`](https://github.com/meta/astryx/commit/ad27496be) docs(useTypeahead): add a type-to-focus country list example block (#9614)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useTypeahead 页补按字母跳到国家的示例
- [x] [`4934ffcf9`](https://github.com/meta/astryx/commit/4934ffcf9) docs(useScrollableArea): add an activity log panel example block (#9618)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useScrollableArea 页补动态日志面板示例
- [x] [`ff5b5ac7e`](https://github.com/meta/astryx/commit/ff5b5ac7e) docs(useLightbox): add hook docs and a gallery grid example block (#9752)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。新增 useLightbox 文档页和图集网格示例
- [x] [`721bba9d6`](https://github.com/meta/astryx/commit/721bba9d6) docs(useHotkeys): add a search and help shortcuts example block (#9508)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useHotkeys 页补搜索与帮助快捷键示例
- [x] [`ffd29c58b`](https://github.com/meta/astryx/commit/ffd29c58b) docs(useInputStatusIcon): add a minimal live example (#9714)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useInputStatusIcon 页补优惠码示例
- [x] [`8c2262460`](https://github.com/meta/astryx/commit/8c2262460) docs(useTreeFocus): add a keyboard file tree example block (#9617)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useTreeFocus 页补键盘文件树示例
- [ ] [`442f2ddd4`](https://github.com/meta/astryx/commit/442f2ddd4) perf(cli): search parses a page template only when a term can match it (#9871)
- [x] [`1027ce206`](https://github.com/meta/astryx/commit/1027ce206) docs(useClipboard): add a share-link example block (#9507)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useClipboard 页补分享链接示例

### v0.7.9

- [x] [`f9ba0f03b`](https://github.com/meta/astryx/commit/f9ba0f03b) docs(useClickableContainer): add a clickable project card example block (#9596)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useClickableContainer 页补可点项目卡示例
- [x] [`c03a87c51`](https://github.com/meta/astryx/commit/c03a87c51) docs(useImageMode): add a photo caption example block (#9893)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useImageMode 页补照片说明示例
- [x] [`d9a3da5fe`](https://github.com/meta/astryx/commit/d9a3da5fe) [Component Audit] InfoTip: the docs page gets worked examples, and hover, focus, pin, and Escape are proven in a browser (#9940)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。InfoTip 页补指标释义、权限说明两个示例；浏览器验证属上游测试设施
- [x] [`380defeb5`](https://github.com/meta/astryx/commit/380defeb5) fix(PowerSearch): the docs examples fit a phone, and a long sheet-trigger placeholder ends in an ellipsis (#9898)
  - Vue 版已有：PowerSearch 的输入框用原生 placeholder，过长自带省略；Vue 示例没有写死宽度，也没有触屏 sheet 触发器
- [ ] [`da771b3e5`](https://github.com/meta/astryx/commit/da771b3e5) chore(Tokenizer): docs examples, blocks and templates follow the adaptive default (#9883)
  - 暂缓：Tokenizer 示例、块和模板跟 adaptive 默认值走，随 presentation 属性一起暂缓
- [x] [`b1f604c9f`](https://github.com/meta/astryx/commit/b1f604c9f) fix(OverflowList): a resize shows the new visible set in the same frame (height-changing folds stay one frame late) (#9926)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f384e62f5`](https://github.com/meta/astryx/commit/f384e62f5) docs(useIcon): add hook docs and a status row example block (#9900)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。Icon 页补直接调用 useIcon 的状态行示例
- [x] [`97b1bb01b`](https://github.com/meta/astryx/commit/97b1bb01b) test(cli): the templates check fails on an unloadable Core template doc (#10082)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7d6481ef3`](https://github.com/meta/astryx/commit/7d6481ef3) feat(core): createPanGesture and usePanGesture report a drag as values (spec:AST-107 FR1, FR6) (#8655)
  - 暂缓：createAnimator/useAnimator、createPanGesture/usePanGesture、createDragToSnapPoints 这批动效与手势 hook 在 Vue 版还没有（由交互族任务落地），示例块等它们落地后再补
- [x] [`7b831ae03`](https://github.com/meta/astryx/commit/7b831ae03) docs(useLinkComponent): add hook docs and an article card example block (#9901)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。LinkProvider 页补直接调用 useLinkComponent 的文章卡示例
- [x] [`9d1405aca`](https://github.com/meta/astryx/commit/9d1405aca) docs(useScrollOverflow): add a filter strip edge fade example block (#9616)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useScrollOverflow 页补筛选条边缘渐隐示例
- [x] [`b2659fea5`](https://github.com/meta/astryx/commit/b2659fea5) docs(hooks): add useMergedRefs AutoGrowTextArea example block (#9938)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useMergedRefs 页补自动增高文本框示例
- [ ] [`df15de7fc`](https://github.com/meta/astryx/commit/df15de7fc) docs(core): open the pan hook pages with a minimal draggable box (#9928)
  - 暂缓：createAnimator/useAnimator、createPanGesture/usePanGesture、createDragToSnapPoints 这批动效与手势 hook 在 Vue 版还没有（由交互族任务落地），示例块等它们落地后再补
- [x] [`c8a172b4b`](https://github.com/meta/astryx/commit/c8a172b4b) docs(useOverlay): add hook docs and a product quick view example block (#9908)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。Overlay 页补直接调用 useOverlay 的商品快速查看示例
- [x] [`a4dd70eb1`](https://github.com/meta/astryx/commit/a4dd70eb1) docs(useCalendarDays): add hook docs and a month grid example block (#9905)
  - 不适用：useCalendar 在 Vue 版不对外导出，没有公开的日历 hook 可写文档页
- [x] [`7b87e121f`](https://github.com/meta/astryx/commit/7b87e121f) docs(useInputContainer): add a search field wrapper example block (#9619)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useInputContainer 页补搜索框外壳示例
- [x] [`5f8a80903`](https://github.com/meta/astryx/commit/5f8a80903) docs(useTableSortableState): add hook docs and a multi-sort orders example block (#9911)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。新增 useTableSortableState 文档页和多列排序示例
- [x] [`b9e3dc27e`](https://github.com/meta/astryx/commit/b9e3dc27e) docs(useScrollLock): add a full-screen mobile menu example block (#9595)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useScrollLock 页补全屏移动菜单示例

### v0.7.10

- [x] [`e40adf9aa`](https://github.com/meta/astryx/commit/e40adf9aa) fix(ChatComposerInput): an imperative insertToken reports its value through onChange (#10167)
  - Vue 版已有：ChatComposerInput 的 insertToken 句柄插入成功后会 publish，onChange 能收到
- [x] [`62f5ebc5e`](https://github.com/meta/astryx/commit/62f5ebc5e) docs(useMultiCombobox): add an issue labels example block (#9578)
  - 不适用：Vue 版没有 useMultiCombobox，MultiSelector 内部直接用 useCombobox
- [ ] [`a789c8cd7`](https://github.com/meta/astryx/commit/a789c8cd7) feat(core): createDragToSnapPoints and useDragToSnapPoints settle an element on snap points (#8658)
  - 暂缓：createAnimator/useAnimator、createPanGesture/usePanGesture、createDragToSnapPoints 这批动效与手势 hook 在 Vue 版还没有（由交互族任务落地），示例块等它们落地后再补
- [x] [`07f8de58c`](https://github.com/meta/astryx/commit/07f8de58c) feat(core): Carousel's hasSnap takes useSnapPaging(), iOS paging on native snap's stops (#8153)
  - 已移植：[#518](https://github.com/astryx-vue/astryx-vue/pull/518)。按基础展示族结论：新增 useSnapPaging，Carousel 的 hasSnap 接受它

### v0.7.11

- [ ] [`23081b997`](https://github.com/meta/astryx/commit/23081b997) perf(cli): list each folder once per read, and reuse it while unchanged (#10274)
- [x] [`6b9f734dc`](https://github.com/meta/astryx/commit/6b9f734dc) test(cli): template show and icon pairs keep fixtures in the run folder (#10325)
  - 不适用：只改上游测试（自动初筛）
- [x] [`755206df2`](https://github.com/meta/astryx/commit/755206df2) test(cli): catalog-heavy tests load their code under test natively (#10328)
  - 不适用：只改上游测试（自动初筛）
- [x] [`fed78ba24`](https://github.com/meta/astryx/commit/fed78ba24) docs(Table): a block that puts row selection in each row's leading mark (#10395)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useTableSelectionState 页补头像位置勾选示例

### v0.7.12

- [x] [`3bbab18c8`](https://github.com/meta/astryx/commit/3bbab18c8) Align Theme Showcase with Astryx template conventions (#10404)
  - Vue 版已有：theme-showcase.vue 已按 Vue 模板约定写，每个区块用 core 组件和令牌
- [x] [`61e6c96bf`](https://github.com/meta/astryx/commit/61e6c96bf) refactor(templates): the file explorer scrolls its columns with Stack props, not custom CSS (#10421)
  - 已移植：[#554](https://github.com/astryx-vue/astryx-vue/pull/554)。文件浏览器的每一列和详情栏用 StackItem 自带滚动并按文件夹名命名，整行 HStack 横向滚动，箭头在从右往左时镜像
- [x] [`b4a4fa075`](https://github.com/meta/astryx/commit/b4a4fa075) refactor(templates): the grouped table template groups its rows with useTableGroupedRows (#10423)
  - Vue 版已有：table-grouped.vue 已用 useTableGroupedRows 分组
- [x] [`d81027191`](https://github.com/meta/astryx/commit/d81027191) feat(templates): add course-detail page template (#9753)
  - Vue 版已有：course-detail.vue 和 template-meta 里的 course-detail 已在
- [x] [`5e0f3d3cb`](https://github.com/meta/astryx/commit/5e0f3d3cb) feat(Table): plugins get an immutable row and render context; useTableRowIndex numbers from it (#10171)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。useTableRowIndex 的 data 可选，按渲染出的位置编号；只读上下文协议属 React 设施
- [x] [`8091fbc64`](https://github.com/meta/astryx/commit/8091fbc64) docs(useCalendarNavigation): add hook docs and a month pager example block (#10154)
  - 不适用：同上：Vue 版没有公开的月份导航 hook
- [x] [`62c7802e8`](https://github.com/meta/astryx/commit/62c7802e8) docs(useCalendarConstraints): add hook docs and a hotel booking range example block (#10151)
  - 不适用：同上：Vue 版没有公开的日历约束 hook，约束由 Calendar 组件的 min、max、dateConstraints 提供
- [ ] [`670aada7f`](https://github.com/meta/astryx/commit/670aada7f) docs(cli): the coupon code block's field shows its focus look at once (#10649)
- [x] [`7bc8230f8`](https://github.com/meta/astryx/commit/7bc8230f8) fix(Button): a labelled button grows with its label (#10588)
  - Vue 版已有：button.css 的 height 取尺寸与 1lh 的较大值，带文字的按钮随文字长高
- [x] [`1ffc0dac9`](https://github.com/meta/astryx/commit/1ffc0dac9) fix(BottomSheet): resting content starts below the grab bar, whatever the padding (#8558)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。面板静止内容从抓手条下面开始，不受内边距影响
- [x] [`df5f6926e`](https://github.com/meta/astryx/commit/df5f6926e) docs(useTableColumnSettingsState): add hook docs and a column visibility picker example block (#10652)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useTableColumnSettings 页补列显隐选择器示例
- [x] [`5b3e17bb2`](https://github.com/meta/astryx/commit/5b3e17bb2) feat(Table): window fixed-height flat tables through useTableRowsVirtualization (#8280)
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。新增 useTableRowsVirtualization，定高扁平行只挂载视口附近的行
- [ ] [`31ae99075`](https://github.com/meta/astryx/commit/31ae99075) fix(cli): template — a typo's near name comes first in the suggestions (#10712)
- [x] [`3cd23eafb`](https://github.com/meta/astryx/commit/3cd23eafb) test(cli): node tests no longer time out under load (#10740)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c44f02ec2`](https://github.com/meta/astryx/commit/c44f02ec2) docs(useStreamingText): make the example actually stream (#9975)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useStreamingText 示例改成真的在流式输出
- [x] [`1f9ac7198`](https://github.com/meta/astryx/commit/1f9ac7198) docs(useInteractiveRole): add a four-roles example block (#9972)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useInteractiveRole 页补四种角色示例
- [ ] [`c5cc8f4c4`](https://github.com/meta/astryx/commit/c5cc8f4c4) docs(useLinkify): add hook docs and a comment-thread example block (#9969)
  - 暂缓：Vue 版缺 useLinkify（上游 v0.7.1 前就有的 hook，一直没移植），先补 hook 才有文档可写
- [x] [`d84658f7d`](https://github.com/meta/astryx/commit/d84658f7d) docs(usePowerSearchConfig): add hook docs and a filtered directory table example block (#10660)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。新增 usePowerSearchConfig 文档页和过滤目录表示例
- [x] [`52356e690`](https://github.com/meta/astryx/commit/52356e690) feat(Table): useTableRowsVirtualization's viewportHeight becomes initialViewportHeight, which no longer sizes the Table (#10894)
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。配置改为 initialViewportHeight，表格高度由父元素决定
- [ ] [`a9265f169`](https://github.com/meta/astryx/commit/a9265f169) style(cli): format doctor.mjs and template.mjs with Prettier (#10988)
- [ ] [`4b6ad11c0`](https://github.com/meta/astryx/commit/4b6ad11c0) fix(cli): remove internal-format identifiers from comments and sample data (#10958)

### v0.7.13

- [x] [`367229613`](https://github.com/meta/astryx/commit/367229613) feat(cli): experimental icon sets — one main set with backups, a local placeholder for missing icons, and a docs-site set choice (#10959)
  - 不适用：上游实验性图标集（icon set 定义、experimental icon 命令、模板按图标集换图标），我们的 CLI 没有图标集配置，模板直接用 core 的 Icon
- [ ] [`43fa8be5a`](https://github.com/meta/astryx/commit/43fa8be5a) Merge branch 'm2' into m3 (#10625)
  - 暂缓：示例依赖 BaseTypeahead 的 menu（列表框与对话框角色切换），Vue 版 BaseTypeahead 没有这个配置
- [x] [`6af6700c8`](https://github.com/meta/astryx/commit/6af6700c8) docs(useDirection): add hook docs and a live sparkline example block (#10547)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useLocaleDirection 页补实时迷你折线示例（对应上游 useDirection）
- [ ] [`57009119a`](https://github.com/meta/astryx/commit/57009119a) docs(InternationalizationProvider): add a calendar example (#10135)
  - 暂缓：日历示例依赖 provider 的 calendar，Vue 版还没有日历系统设施

### v0.7.14

- [x] [`7c8a2e23b`](https://github.com/meta/astryx/commit/7c8a2e23b) docs(useTruncation): add hook docs and a live table cell truncation example block (#10555)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。新增 useTruncation 文档页和表格单元格截断示例
- [ ] [`cfa1d6273`](https://github.com/meta/astryx/commit/cfa1d6273) feat(cli): experimental icon sets — show which template icon meanings a set does not map, and smoother set authoring (#11090)
- [x] [`7882c6028`](https://github.com/meta/astryx/commit/7882c6028) docs(InternationalizationProvider): order the examples locale, RTL, overrides, calendar (#11094)
  - 已移植：[#534](https://github.com/astryx-vue/astryx-vue/pull/534)。provider 文档示例按载入语言目录、RTL、覆盖文案排序；日历示例随日历设施暂缓
- [x] [`15c9ab5e7`](https://github.com/meta/astryx/commit/15c9ab5e7) feat(cli): open a sign-in dialog from the theme showcase (#11130)
  - Vue 版已有：theme-showcase.vue 有 Sign in 按钮，打开真的对话框
- [x] [`fb823d928`](https://github.com/meta/astryx/commit/fb823d928) fix(cli): the theme showcase's Sign in dialog opens empty each time (#11139)
  - Vue 版已有：theme-showcase.vue 每次打开给表单换 key，重开后是空的
- [x] [`441e079d2`](https://github.com/meta/astryx/commit/441e079d2) fix(cli): experimental icon sets — distinct template icon meanings, keep a wrapped library's icons, docs-site icon-set build fixes (#11142)
  - 不适用：上游实验性图标集（icon set 定义、experimental icon 命令、模板按图标集换图标），我们的 CLI 没有图标集配置，模板直接用 core 的 Icon
- [x] [`0a368ec47`](https://github.com/meta/astryx/commit/0a368ec47) fix(cli): template placeholder images follow dark mode (#11150)
  - 已移植：[#554](https://github.com/astryx-vue/astryx-vue/pull/554)。复制出去的占位图改成低透明度灰，随深色模式变深；画廊页 key 改用 alt，首页箭头镜像
- [ ] [`dd4952ab7`](https://github.com/meta/astryx/commit/dd4952ab7) perf(cli): read shipped templates' components from a stored list (#11190)
- [x] [`a728ac04a`](https://github.com/meta/astryx/commit/a728ac04a) perf(cli): print root help from a stored command list (#11194)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`147891410`](https://github.com/meta/astryx/commit/147891410) perf(cli): read shipped docs from a store written at publish (#11191)
- [ ] [`d303fa28b`](https://github.com/meta/astryx/commit/d303fa28b) fix(cli): template needs come from real imports, not comments or strings (#11224)

### v0.7.15

- [ ] [`3d19fc8cc`](https://github.com/meta/astryx/commit/3d19fc8cc) perf(cli): keep search's gathered catalog between runs while its inputs are unchanged (#11251)
- [x] [`1c2cea6b6`](https://github.com/meta/astryx/commit/1c2cea6b6) docs(useThemeName): add hook docs and an active theme example block (#11235)
  - 已移植：[#553](https://github.com/astryx-vue/astryx-vue/pull/553)。useTheme 页补当前主题名示例
- [ ] [`d084760db`](https://github.com/meta/astryx/commit/d084760db) perf(docsite): serve template preview images through the image optimizer (#11320)
- [ ] [`a6e588a48`](https://github.com/meta/astryx/commit/a6e588a48) perf(cli): read which packages a shipped template imports from the copy stored at publish (#11315)
- [x] [`318ab8029`](https://github.com/meta/astryx/commit/318ab8029) feat(cli): the integration file takes an optional logo; integration check notes what a listing needs (#11278)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`08b751a6d`](https://github.com/meta/astryx/commit/08b751a6d) fix(cli): theme refusals name commands that work; missing packages name their install; build headers from the project root; --out warns when it replaces another source's output or lacks .css (#11346)

### v0.7.16

- [x] [`58b844d16`](https://github.com/meta/astryx/commit/58b844d16) feat(Table): Promise-based infinite loading with useTableInfiniteScroll (#10570)
  - 已移植：[#540](https://github.com/astryx-vue/astryx-vue/pull/540)。新增 useTableInfiniteScroll 并配加载更多示例
- [ ] [`10bae0687`](https://github.com/meta/astryx/commit/10bae0687) feat(Table): useTableColumnsVirtualization windows the unpinned columns (#11014)
- [ ] [`56680f6a7`](https://github.com/meta/astryx/commit/56680f6a7) fix(cli): themeBuild no longer takes the watch and private-var hand-off callbacks, and the dashboard page template typechecks with noUncheckedIndexedAccess (#11420)
- [x] [`723a112c3`](https://github.com/meta/astryx/commit/723a112c3) test: split the heaviest Node test files so the legs can spread them (#11436)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9b1e4893a`](https://github.com/meta/astryx/commit/9b1e4893a) perf(cli): keep template discovery's records between runs (#11393)
- [ ] [`685728b42`](https://github.com/meta/astryx/commit/685728b42) perf(cli): load Babel, recast and jscodeshift on first use, not with the API (#11432)
- [ ] [`07c77c008`](https://github.com/meta/astryx/commit/07c77c008) fix(cli): a kept entry with no value, a failing decode or the wrong shape is a miss, and is stored over (#11474)
- [ ] [`22cb7e405`](https://github.com/meta/astryx/commit/22cb7e405) fix(cli): the AI Chat template's artifact-card chevron mirrors in right-to-left (#11477)
- [ ] [`7e8a67000`](https://github.com/meta/astryx/commit/7e8a67000) feat(cli): experimental icon sets — a project picks one look (outline or filled) for every icon (#11499)
- [ ] [`c8ddb4ae3`](https://github.com/meta/astryx/commit/c8ddb4ae3) fix(cli): the AI Chat template's message scrollbar stays clear of the resize handle (#11473)
- [ ] [`f5b5f9660`](https://github.com/meta/astryx/commit/f5b5f9660) docs(useOutlineFromDOM): add hook docs and an article example block (#11234)

### v0.7.17

- [ ] [`4da09b8d6`](https://github.com/meta/astryx/commit/4da09b8d6) docs(useSyntaxTheme): add hook docs and a keyword color example block (#11236)
- [ ] [`6f0fbce2d`](https://github.com/meta/astryx/commit/6f0fbce2d) fix(cli): the IDE template's editor scrollbar stays clear of the properties panel handle (#11529)
- [ ] [`538e297e5`](https://github.com/meta/astryx/commit/538e297e5) docs(useChatDictation): add hook docs and a voice input example block (#11237)
- [ ] [`8e39a4a42`](https://github.com/meta/astryx/commit/8e39a4a42) feat(cli): docs points to the command that reads a component, hook or template (#11553)
- [ ] [`8a4d0fb71`](https://github.com/meta/astryx/commit/8a4d0fb71) feat(cli): template --list prints the first sentence of each description (#11601)
- [ ] [`c4df91cbb`](https://github.com/meta/astryx/commit/c4df91cbb) fix(cli): one template keyword means one concept, and build matches it as a phrase (#11685)
- [ ] [`44043bcce`](https://github.com/meta/astryx/commit/44043bcce) docs(templates): describe Content pages in their users' words (#11656)
- [ ] [`fd36ff22a`](https://github.com/meta/astryx/commit/fd36ff22a) perf(cli): a hosted run keeps its catalog, keyed on what the host passed (#11719)
- [ ] [`847c3f112`](https://github.com/meta/astryx/commit/847c3f112) fix(cli): remove page-template keywords that the template doesn't render (#11717)
- [x] [`91ffe9fde`](https://github.com/meta/astryx/commit/91ffe9fde) test(cli): take every page template round trip, and every hostile copy of a rendered file, in CI (#11710)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`43445a643`](https://github.com/meta/astryx/commit/43445a643) fix(cli): the CLI orders names the same way on every machine (#11683)
- [ ] [`eeb3d7c53`](https://github.com/meta/astryx/commit/eeb3d7c53) docs(cli): the useContainerReveal usage block says a coarse primary pointer, not touch (#11516)
- [ ] [`0135e032b`](https://github.com/meta/astryx/commit/0135e032b) docs(cli): AI Chat Landing keywords name its greeting, suggestions and composer (#11780)
- [ ] [`b31d8b327`](https://github.com/meta/astryx/commit/b31d8b327) docs(useSpeechRecognition): add hook docs and a transcript example block (#11238)
- [ ] [`e126007e2`](https://github.com/meta/astryx/commit/e126007e2) fix(build): a template kept off the gallery is never the app shell (#11808)
- [ ] [`b18f5d6dd`](https://github.com/meta/astryx/commit/b18f5d6dd) fix(cli): template accepts an absolute path inside the project; outside, it names the command that works (#11793)
- [ ] [`bac58372c`](https://github.com/meta/astryx/commit/bac58372c) feat(cli): one did-you-mean rule points every lookup to the command that has the name (#11707)
- [x] [`178cd8019`](https://github.com/meta/astryx/commit/178cd8019) perf(OverflowList): lists in one commit measure together after it, before paint (#10392)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`fc15988df`](https://github.com/meta/astryx/commit/fc15988df) fix(templates): dead action buttons confirm with a toast (#11842)
- [ ] [`db3f616ff`](https://github.com/meta/astryx/commit/db3f616ff) fix(templates): page templates fit a 390 px phone screen, with a check (#11838)
- [ ] [`b2c47d262`](https://github.com/meta/astryx/commit/b2c47d262) fix(templates): dead action buttons in eleven more page templates name their demo action (#11852)
- [ ] [`3e92ca00d`](https://github.com/meta/astryx/commit/3e92ca00d) fix(templates): dead menu items in the grouped table and kanban board respond (#11867)
- [ ] [`c1ef47d57`](https://github.com/meta/astryx/commit/c1ef47d57) test(cli): pin build's default app shell when a ready Shell variant exists (#11875)
- [ ] [`1b6eeb3f6`](https://github.com/meta/astryx/commit/1b6eeb3f6) fix(cli): template's refusal names a path the project builds and serves (#11858)
- [ ] [`dfaf71bae`](https://github.com/meta/astryx/commit/dfaf71bae) fix(templates): the technical docs template teaches the real setup (#11876)
- [ ] [`c0b2a7887`](https://github.com/meta/astryx/commit/c0b2a7887) fix(cli): errors name a run that works (#11874)
- [ ] [`c828a75dc`](https://github.com/meta/astryx/commit/c828a75dc) fix(cli): build names where its start goes in the project, so the command runs as printed (#11881)
- [ ] [`27ba2010f`](https://github.com/meta/astryx/commit/27ba2010f) docs(useChatPasteAsToken): add hook docs and a long paste example block (#11239)
- [ ] [`27bb774ac`](https://github.com/meta/astryx/commit/27bb774ac) feat(cli): astryx template writes a scratch copy to a path in the system temp folder (#11915)
- [ ] [`d389935c2`](https://github.com/meta/astryx/commit/d389935c2) docs(templates): the IDE template's description names its single read-only code pane (#11918)
- [ ] [`6919cd34a`](https://github.com/meta/astryx/commit/6919cd34a) fix(templates): the incident console works on a phone and its buttons act (#11924)
- [ ] [`a79b45451`](https://github.com/meta/astryx/commit/a79b45451) feat(templates): a run console page template (not ready yet) (#11952)
- [ ] [`af509ad91`](https://github.com/meta/astryx/commit/af509ad91) feat(cli): the table page template builds what its description promises (#11914)
- [ ] [`76869ae15`](https://github.com/meta/astryx/commit/76869ae15) fix(templates): the messaging shell works as an app: AppShell side navigation, live conversations and threads, phone access (#11919)
- [ ] [`f7e46c828`](https://github.com/meta/astryx/commit/f7e46c828) feat(templates): add a Review Workspace page template (not ready yet) (#11945)
- [ ] [`88c4e0a8a`](https://github.com/meta/astryx/commit/88c4e0a8a) feat(templates): add a Welcome portal page template for an employee intranet home (not ready yet) (#11928)
- [ ] [`5113c38bf`](https://github.com/meta/astryx/commit/5113c38bf) feat(templates): not-found, access-denied and error page templates (not yet ready) (#11944)
- [ ] [`1649f6888`](https://github.com/meta/astryx/commit/1649f6888) fix(templates): the technical docs template reads correctly with no script (#11974)
- [ ] [`2005ab380`](https://github.com/meta/astryx/commit/2005ab380) experimental theme: twelfth round of fixes (FINAL-43/44 hunts, review follow-ups) (#11965)
- [ ] [`aad0d3683`](https://github.com/meta/astryx/commit/aad0d3683) chore(templates): documentation-technical copies with Core's useClipboard (#12024)
- [ ] [`5e5ddde56`](https://github.com/meta/astryx/commit/5e5ddde56) feat(cli): template results carry isReady, and text says (not ready) (#11931)
- [ ] [`4ea41ce48`](https://github.com/meta/astryx/commit/4ea41ce48) chore(templates): editor sizes its sidebar with LayoutPanel's width prop (#12027)
- [ ] [`115f41873`](https://github.com/meta/astryx/commit/115f41873) chore(templates): shell-nav opens its command palette with Core's useHotkeys (#12026)
- [ ] [`ad7e7343a`](https://github.com/meta/astryx/commit/ad7e7343a) fix(templates): make the hero and gallery call-to-action buttons links (#12036)
- [ ] [`9407524f5`](https://github.com/meta/astryx/commit/9407524f5) fix(templates): give the dead controls in the ai-chat template a behavior (#12033)
- [ ] [`12b6045f7`](https://github.com/meta/astryx/commit/12b6045f7) fix(templates): five top and side nav examples get working links and actions (#12049)
- [ ] [`f58f3041f`](https://github.com/meta/astryx/commit/f58f3041f) fix(templates): order detail, work item detail and component docs read correctly with no script (#12012)
- [ ] [`312604ada`](https://github.com/meta/astryx/commit/312604ada) fix(templates): six chat example blocks' copy, feedback and composer buttons respond (#12045)
- [ ] [`b78ca36b1`](https://github.com/meta/astryx/commit/b78ca36b1) fix(templates): layout header and footer, card and empty state example buttons respond (#12047)
- [ ] [`9eab1432b`](https://github.com/meta/astryx/commit/9eab1432b) fix(templates): dashboard controls that did nothing show what they would do (#12040)
- [ ] [`10f9ef4fc`](https://github.com/meta/astryx/commit/10f9ef4fc) fix(templates): settings controls that did nothing show what they would do (#12042)
- [x] [`8e719d15d`](https://github.com/meta/astryx/commit/8e719d15d) fix(cli): build reads search without page templates that are not ready (#12031)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`047f1a95a`](https://github.com/meta/astryx/commit/047f1a95a) fix(templates): toolbar, selector, table, tab and popover example buttons respond (#12048)
- [ ] [`54bf5ed70`](https://github.com/meta/astryx/commit/54bf5ed70) fix(templates): give the dead controls in the tool templates a behavior (#12022)
- [ ] [`0c0a4c512`](https://github.com/meta/astryx/commit/0c0a4c512) fix(templates): CommandPaletteGroup basic, CommandPaletteList and DropdownMenuGroup showcase examples respond when picked (#12046)
- [ ] [`29ec3af53`](https://github.com/meta/astryx/commit/29ec3af53) fix(templates): form buttons that did nothing show what they would do (#12041)
- [ ] [`f3fce450a`](https://github.com/meta/astryx/commit/f3fce450a) fix(templates): two page templates no longer leave an empty column on wide screens (#12051)
- [ ] [`28f8e9c8c`](https://github.com/meta/astryx/commit/28f8e9c8c) fix(templates): give listed dead controls in the app shell templates a demo toast (#12030)
- [ ] [`3a5f600cb`](https://github.com/meta/astryx/commit/3a5f600cb) fix(templates): the technical docs next steps wrap on a narrow screen (#12063)
- [ ] [`a699e26e3`](https://github.com/meta/astryx/commit/a699e26e3) fix(templates): the payment form asks before removing a cart item (#12077)
- [ ] [`c0b12795d`](https://github.com/meta/astryx/commit/c0b12795d) feat(templates): table and incident-console are ready; build hosts parts on a family base and starts shell variants only by their own words (#12003)
- [ ] [`d95d6ad38`](https://github.com/meta/astryx/commit/d95d6ad38) fix(templates): text area, text input, switch, segmented control and tab list example blocks fit narrow columns (#12085)
- [ ] [`ce0feb506`](https://github.com/meta/astryx/commit/ce0feb506) fix(core): a Table bleeds to a block edge only as its container's direct first or last child (#12068)
- [ ] [`86fa8f0c7`](https://github.com/meta/astryx/commit/86fa8f0c7) fix(templates): the settings dialog asks before deleting the account (#12076)
- [ ] [`b21d033ea`](https://github.com/meta/astryx/commit/b21d033ea) fix(templates): card, center, collapsible, divider and blockquote example blocks fit narrow columns (#12083)
- [ ] [`05fea3739`](https://github.com/meta/astryx/commit/05fea3739) fix(templates): give the dead controls in the table templates a behavior, except deletes (#12020)
- [ ] [`55674f90c`](https://github.com/meta/astryx/commit/55674f90c) fix(templates): shell templates ask before deleting (#12089)
- [ ] [`e67bb66bb`](https://github.com/meta/astryx/commit/e67bb66bb) fix(templates): give the dead controls in the content templates a behavior (#12023)
- [ ] [`d57f21691`](https://github.com/meta/astryx/commit/d57f21691) fix(templates): layout and chat layout example blocks fit narrow columns (#12082)
- [ ] [`9427cc695`](https://github.com/meta/astryx/commit/9427cc695) revert(templates): remove six page templates that were never marked ready (#12016)
- [ ] [`88fe0ebd8`](https://github.com/meta/astryx/commit/88fe0ebd8) fix(templates): content templates ask before refunding or deleting (#12110)
- [ ] [`c7497cb34`](https://github.com/meta/astryx/commit/c7497cb34) fix(templates): the canvas artboard and the milestone timeline keep left-to-right in right-to-left pages (#12113)
- [ ] [`e83fd87dd`](https://github.com/meta/astryx/commit/e83fd87dd) fix(templates): demo frames and targets in example blocks use theme colors (#12135)
- [ ] [`c44a63778`](https://github.com/meta/astryx/commit/c44a63778) feat(cli): bases, first step — a run reads one base; steps it does not serve are hidden and refused (#11111)
- [ ] [`597701be7`](https://github.com/meta/astryx/commit/597701be7) fix(templates): example blocks hydrate cleanly and name repeated landmarks (#12126)
- [ ] [`5a3fd3948`](https://github.com/meta/astryx/commit/5a3fd3948) fix(templates): table templates get main landmarks, column names and heading levels (#12141)
- [ ] [`d6f6295da`](https://github.com/meta/astryx/commit/d6f6295da) perf(cli): keep each shipped doc's parse, and build doc schemas on first parse (#12166)
- [ ] [`e80124133`](https://github.com/meta/astryx/commit/e80124133) fix(cli): icon finder answers with no icon set and honors the chosen look (#12131)
- [ ] [`817efe895`](https://github.com/meta/astryx/commit/817efe895) fix(templates): dashboard templates get main landmarks, one h1 and an ordered outline (#12133)
- [ ] [`47be1465c`](https://github.com/meta/astryx/commit/47be1465c) fix(templates): table templates ask before deleting (#12109)
- [ ] [`d61c951d4`](https://github.com/meta/astryx/commit/d61c951d4) feat(cli): init says what it did to each agent-doc file (#12200)
- [ ] [`27af5191c`](https://github.com/meta/astryx/commit/27af5191c) fix(cli): init next steps and the doctor theme hint use the project's install command (#12199)
- [ ] [`35fbc1120`](https://github.com/meta/astryx/commit/35fbc1120) experimental theme: fourteenth round of fixes (neutral variants, readable role text, one-browser pictures) (#12097)
- [ ] [`f39ed0207`](https://github.com/meta/astryx/commit/f39ed0207) fix(cli): template docs never print a raw {@command} or {@pm} token; build and search text show doc commands with the project's command (#12214)
- [ ] [`2c80ffc20`](https://github.com/meta/astryx/commit/2c80ffc20) feat(cli): an installed icon-set package turns on the experimental icon features (one gate) (#12176)
- [ ] [`86b073364`](https://github.com/meta/astryx/commit/86b073364) feat(cli): doctor names icon imports that no longer match the app's icon sets (#12194)
- [ ] [`476a31534`](https://github.com/meta/astryx/commit/476a31534) fix(templates): demo actions show a toast instead of alert(), so they respond in frames that block dialogs (#12304)
- [ ] [`09d704517`](https://github.com/meta/astryx/commit/09d704517) fix(templates): the editor transactions table keeps names readable on a phone (#12315)
- [ ] [`3a1165f91`](https://github.com/meta/astryx/commit/3a1165f91) fix(cli): the named scaffold path is the file the copy writes (#12294)
- [ ] [`66a16258f`](https://github.com/meta/astryx/commit/66a16258f) fix(templates): page templates get main landmarks, one h1 and ordered outlines (#12160)
- [ ] [`b7f61b795`](https://github.com/meta/astryx/commit/b7f61b795) fix(cli): outside a project, a page takes the packages its host's set lists (#12057)
- [ ] [`be5d290db`](https://github.com/meta/astryx/commit/be5d290db) fix(cli): a kept template icon from a library subpath names the library the set wraps (#12412)
- [ ] [`a6538f27a`](https://github.com/meta/astryx/commit/a6538f27a) feat(cli): an integration can say how its apps add a dependency (installGuidance) (#12218)
- [ ] [`5cf5d6997`](https://github.com/meta/astryx/commit/5cf5d6997) fix(cli): dashboard templates draw trend lines as straight segments (#12413)
- [ ] [`7cb595c9a`](https://github.com/meta/astryx/commit/7cb595c9a) [experimental] render: the missing-package refusal offers no install line that would install in the wrong place (#12429)
- [ ] [`d06d2349f`](https://github.com/meta/astryx/commit/d06d2349f) fix(templates): page templates fit a 320 px phone without sideways scroll or cut text (#12444)
- [ ] [`39e859a30`](https://github.com/meta/astryx/commit/39e859a30) fix(cli): outside a project, template counts the integrations a host approves, as render serves them (#12370)
- [ ] [`4a8df8bca`](https://github.com/meta/astryx/commit/4a8df8bca) fix(cli): template help names only what the base serves (#12419)
- [ ] [`227a9deb6`](https://github.com/meta/astryx/commit/227a9deb6) fix(cli): search reads another entry's name as that entry's evidence (#12433)
- [ ] [`02c02700f`](https://github.com/meta/astryx/commit/02c02700f) fix(templates): keyboard reach for the kanban board's info icons and the side-nav shell's conversation options (#12152)
- [ ] [`bbc0435e2`](https://github.com/meta/astryx/commit/bbc0435e2) feat(cli): name a template's components for one component read (#12389)
- [ ] [`e434325ed`](https://github.com/meta/astryx/commit/e434325ed) fix(templates): toolbar, top nav, table and stepper example blocks fit narrow columns (#12084)
- [ ] [`d7c7e7014`](https://github.com/meta/astryx/commit/d7c7e7014) fix(TopNav): the phone bar keeps wide end content inside it, so the Shell Nav menu button stays in view (#12300)
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
- [ ] [`daf5e2cb3`](https://github.com/meta/astryx/commit/daf5e2cb3) chore: land batch 3 (13 pull requests) (#12722)
- [ ] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
- [ ] [`8688c1885`](https://github.com/meta/astryx/commit/8688c1885) chore: land batch 6 (11 pull requests) (#12812)
- [ ] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
- [ ] [`cf537d7aa`](https://github.com/meta/astryx/commit/cf537d7aa) chore: land batch 11 (3 pull requests) (#12848)
- [ ] [`4f5390649`](https://github.com/meta/astryx/commit/4f5390649) chore: land batch 14 (2 pull requests) (#12874)
- [ ] [`2ab167954`](https://github.com/meta/astryx/commit/2ab167954) chore: land batch 25 (2 pull requests) (#12879)
- [ ] [`83424673c`](https://github.com/meta/astryx/commit/83424673c) chore: land batch 16 (6 pull requests) (#12881)
- [ ] [`d60793cbc`](https://github.com/meta/astryx/commit/d60793cbc) chore: land batch 18 (2 pull requests) (#12882)
- [ ] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
- [ ] [`e9b125444`](https://github.com/meta/astryx/commit/e9b125444) chore: land batch 24 (3 pull requests) (#12883)
- [ ] [`788018029`](https://github.com/meta/astryx/commit/788018029) chore: land batch 40 (4 pull requests) (#12914)
- [ ] [`6c12793c1`](https://github.com/meta/astryx/commit/6c12793c1) chore: land batch 41 (1 pull requests) (#12916)
- [ ] [`215925cc0`](https://github.com/meta/astryx/commit/215925cc0) chore: land batch 59 (8 pull requests) (#12938)
- [ ] [`0c4cfbadd`](https://github.com/meta/astryx/commit/0c4cfbadd) chore: land batch 66 (1 pull requests) (#12952)
- [ ] [`d1b5532bb`](https://github.com/meta/astryx/commit/d1b5532bb) chore: land batch 75 (1 pull requests) (#12969)
- [ ] [`4e35a9856`](https://github.com/meta/astryx/commit/4e35a9856) spec(internationalization): a component takes a prop for each string callers reword; provider overrides are an app-wide escape hatch (#12675)
- [ ] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
- [ ] [`a19a5170b`](https://github.com/meta/astryx/commit/a19a5170b) chore: land batch 74 (1 pull requests) (#12968)
- [ ] [`0bfa86c6c`](https://github.com/meta/astryx/commit/0bfa86c6c) chore: land batch 76 (2 pull requests) (#12972)
- [ ] [`dacc31737`](https://github.com/meta/astryx/commit/dacc31737) chore: land batch 72 (9 pull requests) (#12965)
- [x] [`d5fb59c68`](https://github.com/meta/astryx/commit/d5fb59c68) chore: land batch 86 (2 pull requests) (#13014)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9d23a5e6e`](https://github.com/meta/astryx/commit/9d23a5e6e) chore: land batch 87 (2 pull requests) (#13021)
- [ ] [`5c4812389`](https://github.com/meta/astryx/commit/5c4812389) chore: land batch 88 (3 pull requests) (#13025)
- [ ] [`c1eeb636b`](https://github.com/meta/astryx/commit/c1eeb636b) chore: land batch 94 (2 pull requests) (#13045)

## 日期与时间（area:core）

### v0.7.2

- [x] [`a61db6f03`](https://github.com/meta/astryx/commit/a61db6f03) fix(RadioList): keep a caller aria-labelledby on the radiogroup (#5656)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)

### v0.7.3

- [x] [`7b6691327`](https://github.com/meta/astryx/commit/7b6691327) spec(AST-085): disabled controls stay focusable (#7793)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`677d96c8b`](https://github.com/meta/astryx/commit/677d96c8b) fix(core): adjustTime emits "14:30.5" for a fractional increment, on both the public util and TimeInput/DateTimeInput (#7823)
- [x] [`316e5ab54`](https://github.com/meta/astryx/commit/316e5ab54) fix(DateInput): disabled and busy fields stay focusable (#7843)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。忙碌和禁用的日期字段保持可聚焦，输入被挡住
- [ ] [`5af3293b1`](https://github.com/meta/astryx/commit/5af3293b1) fix(DateRangeInput): disabled and busy fields and disabled presets stay focusable (#7866)
- [ ] [`cde6233de`](https://github.com/meta/astryx/commit/cde6233de) fix(core): TreeList, Pagination dots and Calendar days use aria-disabled (#7887)
- [ ] [`ca48bb778`](https://github.com/meta/astryx/commit/ca48bb778) fix(Timestamp): never read the current time during a server render (#7883)
- [ ] [`e999ccdc9`](https://github.com/meta/astryx/commit/e999ccdc9) fix(DateTimeInput): disabled and busy fields stay focusable (#7889)
- [ ] [`6e266c28d`](https://github.com/meta/astryx/commit/6e266c28d) fix(TimeInput): disabled fields stay focusable (#7898)

### v0.7.4

- [x] [`a732e5c64`](https://github.com/meta/astryx/commit/a732e5c64) fix(DateInput, DateRangeInput): silence the busy Spinner and announce the busy start once (#7939)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。忙碌转圈不出声，进入忙碌只播报一次（DateRangeInput 同）
- [ ] [`ec8c3c9f7`](https://github.com/meta/astryx/commit/ec8c3c9f7) fix(DateTimeInput, TimeInput): silence the busy Spinner and announce the busy start once (#7942)
- [x] [`d648470ad`](https://github.com/meta/astryx/commit/d648470ad) [Component Audit] DateInput: busy fields stop looking disabled (#7968)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。忙碌的字段不再画成禁用的样子

### v0.7.5

- [x] [`1c38f0a98`](https://github.com/meta/astryx/commit/1c38f0a98) fix(Wheel): a two-finger pinch over a picker wheel zooms the page (#8130)
  - Vue 版已有：Vue 的滚轮是按钮列表，没有声明 pan-y，浏览器默认允许双指缩放
- [x] [`3719fcfa4`](https://github.com/meta/astryx/commit/3719fcfa4) test(DateInput): the wheel pinch-zoom spec opens its minute wheel at a fixed time (#8332)
  - 不适用：只改上游测试（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6b46afaa9`](https://github.com/meta/astryx/commit/6b46afaa9) fix(InputGroup): propagate disabled state to inputs and addons (#8414)
  - 已移植：[#504](https://github.com/astryx-vue/astryx-vue/pull/504)。InputGroup 禁用传给输入框与附加件，由基础展示族完成
- [x] [`e9b3f3eda`](https://github.com/meta/astryx/commit/e9b3f3eda) fix(InputGroup): the group edge rules name members, not a universal selector (#8438)
  - Vue 版已有：InputGroup 由外层容器画边框，没有通配选择器的边缘规则
- [x] [`c22cbe2fd`](https://github.com/meta/astryx/commit/c22cbe2fd) fix(core): useAnnounce delivers inside the open Astryx modal that encloses its caller (#8009)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b4b5faefd`](https://github.com/meta/astryx/commit/b4b5faefd) docs(spec): TimeInput records its shipped contract as current (#8541)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`25d029ead`](https://github.com/meta/astryx/commit/25d029ead) docs(spec): Timestamp records its shipped contract as current (#8673)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.6

- [x] [`a7ecf842f`](https://github.com/meta/astryx/commit/a7ecf842f) docs(spec): DateTimeInput records its shipped contract as current (#8878)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a2e2bcc15`](https://github.com/meta/astryx/commit/a2e2bcc15) docs(spec): Calendar records its shipped contract as current (#9058)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [ ] [`377ab27fa`](https://github.com/meta/astryx/commit/377ab27fa) fix(Timestamp): keep a caller's aria-label and tabIndex (#8726)
- [ ] [`16a749404`](https://github.com/meta/astryx/commit/16a749404) fix(DateInput, DateTimeInput): after a month arrow, Safari's calendar rests on the month the title names (#8513)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [x] [`d799afea8`](https://github.com/meta/astryx/commit/d799afea8) fix(DateInput, DateRangeInput, DateTimeInput): mount the calendar only while the popover is open (#8902)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。日历只在弹层打开时挂载（DateInput、DateRangeInput、DateTimeInput）
- [ ] [`faee47927`](https://github.com/meta/astryx/commit/faee47927) fix(TimeInput, DateTimeInput): time text follows the locale's hour cycle and day periods (#9022)
- [x] [`e770c8296`](https://github.com/meta/astryx/commit/e770c8296) fix(DateInput): block changes from disabled open pickers (#8813)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。禁用的字段在弹层开着时不再接受改动
- [ ] [`802da1a79`](https://github.com/meta/astryx/commit/802da1a79) fix(DateInput): a wheel commits at a mouse drag's release, not at every row it passes (#8483)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [x] [`32f9dc801`](https://github.com/meta/astryx/commit/32f9dc801) docs(spec): TimeInput's verification cites the format-hint test (#9103)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`d29a10977`](https://github.com/meta/astryx/commit/d29a10977) docs(spec): DateInput records its shipped contract as current (#9128)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`2936b07e8`](https://github.com/meta/astryx/commit/2936b07e8) fix(DateRangeInput): reject commits after disabling open picker (#9155)
- [ ] [`67e293e0e`](https://github.com/meta/astryx/commit/67e293e0e) perf(DateInput): the month scroller adds and removes its input listeners directly, with one shared options object (#9146)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [x] [`f50374f51`](https://github.com/meta/astryx/commit/f50374f51) test(DateInput, DateTimeInput): MonthScroller's proofs hold on a loaded machine (#9177)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8f345cba4`](https://github.com/meta/astryx/commit/8f345cba4) feat(FieldStatus): deprecate the tooltip variant; field controls keep statusVariant="tooltip" (#9196)
  - Vue 版已有：DateInput、DateRangeInput、TimeInput 的 statusVariant 都保留 tooltip
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游规范文档换目录
- [x] [`ad2e378cb`](https://github.com/meta/astryx/commit/ad2e378cb) fix(Calendar): a stand-alone month label starts with a capital where CLDR capitalizes one (#9371)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。独立的月份标题在需要大写的语言里首字母大写
- [x] [`2555233fe`](https://github.com/meta/astryx/commit/2555233fe) spec(DateInput): wheel and calendar rules for the touch sheet (#9402)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
- [x] [`ce052bf0a`](https://github.com/meta/astryx/commit/ce052bf0a) fix(Field): a focusable disabled field shows its focus under forced colors (#9410)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。可聚焦的禁用字段在强制颜色下显示焦点
- [ ] [`16fe5f199`](https://github.com/meta/astryx/commit/16fe5f199) fix(core): Table, Chat, CommandPalette and the date and time inputs carry only their own English (#9452)
- [ ] [`fc44bc3b7`](https://github.com/meta/astryx/commit/fc44bc3b7) fix(DateTimeInput): a press in the time input keeps the preset-time list open (#9459)
- [x] [`beb03f8bd`](https://github.com/meta/astryx/commit/beb03f8bd) fix(DateInput): a press in the field's own input, clear button or label keeps the calendar open (#9433)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。按在字段自己的输入框、清除按钮或标签上不再关掉日历

### v0.7.7

- [ ] [`aa8648760`](https://github.com/meta/astryx/commit/aa8648760) fix(DateInput, DateTimeInput): the month scroller's steps follow design:reduced-motion (#8496)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [ ] [`6658a4c8a`](https://github.com/meta/astryx/commit/6658a4c8a) fix(Wheel): a wheel that stops outside the bounds rests on the nearest value inside them (#8131)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [ ] [`546aaa0bc`](https://github.com/meta/astryx/commit/546aaa0bc) fix(DateRangeInput): presets stack above the calendar when they don't fit (#9588)
- [x] [`443c7f83e`](https://github.com/meta/astryx/commit/443c7f83e) fix(DateInput, DateTimeInput): Enter submits the form when nothing is typed (#9678)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。没有打字时 Enter 照常提交表单（DateInput、DateTimeInput）
- [x] [`b11e000b5`](https://github.com/meta/astryx/commit/b11e000b5) fix(Selector): a row that scrolls under a still mouse does not take the keyboard's highlight (#9671)
  - 不适用：只改上游测试（自动初筛）
- [x] [`867728fbb`](https://github.com/meta/astryx/commit/867728fbb) test(DateInput): the meridiem turn proof judges the frames a loaded page draws, not how many (#9730)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`273ec4356`](https://github.com/meta/astryx/commit/273ec4356) fix(DateInput): a Reduce Motion step lands under its cross-fade, on the fade's own timeline (#9734)
  - 暂缓：要还原上游动效，归动效与手势引擎任务

### v0.7.8

- [x] [`a3d7b46c7`](https://github.com/meta/astryx/commit/a3d7b46c7) fix(dateParser): in day-first locales, numeric text never takes the native month-first reading (#9726)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`984eab751`](https://github.com/meta/astryx/commit/984eab751) fix(Calendar): day and week numbers use the locale's digits (#9610)
- [x] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
  - 不适用：只给 React useEffect 加注释
- [ ] [`85afaa010`](https://github.com/meta/astryx/commit/85afaa010) fix(Calendar): Shift+Page Up and Shift+Page Down move by a year (#9609)
- [x] [`54cc2c2b0`](https://github.com/meta/astryx/commit/54cc2c2b0) docs(spec): Calendar weekday headers show abbreviated names where they fit (#9072)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`593f96f76`](https://github.com/meta/astryx/commit/593f96f76) feat(Wheel): UIPickerView's motion under a finger, with flat rows (#8159)
  - 暂缓：UIPickerView 的手指动效（惯性、弹簧、平行行）依赖 Vue 还没有的滚轮物理设施
- [ ] [`16a5397c9`](https://github.com/meta/astryx/commit/16a5397c9) feat(Calendar): weekday headers show abbreviated names where all seven fit in four characters (#9824)
- [ ] [`c8f08f967`](https://github.com/meta/astryx/commit/c8f08f967) fix(core): PowerSearch gives `isDateOnly: false` the time of day it names (#9702)
- [x] [`07ee4b5c4`](https://github.com/meta/astryx/commit/07ee4b5c4) docs(DateInput): FR14 says when a tapped row commits (#9838)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`42ccd7cfa`](https://github.com/meta/astryx/commit/42ccd7cfa) fix(DateInput): the scrolling picker column's rows keep AA contrast; the depth fade uses theme text colours (#9853)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`bd69bedcd`](https://github.com/meta/astryx/commit/bd69bedcd) test(DateInput): the wheel contrast proof imports the hermetic Playwright test (#9888)
  - 不适用：只改上游测试（自动初筛）
- [x] [`826d8933e`](https://github.com/meta/astryx/commit/826d8933e) chore(core): UIDatePicker's wheel rules, measured on iOS 26.2 (#8178)
  - 不适用：上游规范文档记录 iOS 滚轮测量，不涉及行为
- [x] [`f10bc9153`](https://github.com/meta/astryx/commit/f10bc9153) spec(AST-094): only a gesture's motion springs; other motion plays the theme's tokens (#9706)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`f5a315249`](https://github.com/meta/astryx/commit/f5a315249) fix(TimeInput, DateTimeInput): under a finger the AM/PM wheel follows the hour (#8179)

### v0.7.9

- [ ] [`72e85200b`](https://github.com/meta/astryx/commit/72e85200b) fix(DateInput): the touch column's edge fade stops at 70% opacity, so every row keeps AA contrast (#9878)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [x] [`d23d1fe43`](https://github.com/meta/astryx/commit/d23d1fe43) test(DateInput): the wheel activation proof waits on the sheet's own end, not on still frames before a deadline (#9942)
  - 不适用：只改上游测试（自动初筛）
- [x] [`504ee1863`](https://github.com/meta/astryx/commit/504ee1863) fix(theme): the stock theme's dark-mode accent is darker, so white button text meets 4.5:1 (#9818)
  - 已移植：[#506](https://github.com/astryx-vue/astryx-vue/pull/506)。accent 文字改用 text-accent，暗色 accent 默认值在主题包，由基础展示族完成
- [x] [`c5b2c54dd`](https://github.com/meta/astryx/commit/c5b2c54dd) spec(AST-111): date components use the calendar the application chooses (#9605)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`fe1cf0c6d`](https://github.com/meta/astryx/commit/fe1cf0c6d) feat(Calendar): show the months of the selected calendar system (#9622)
- [ ] [`aa7c50176`](https://github.com/meta/astryx/commit/aa7c50176) feat(Calendar): useCalendarDays and useCalendarNavigation take an optional calendar (#10007)
- [ ] [`edf7128e3`](https://github.com/meta/astryx/commit/edf7128e3) feat(Timestamp, PowerSearch): write dates in the provider's calendar (#9639)
- [ ] [`9cba0a867`](https://github.com/meta/astryx/commit/9cba0a867) docs(i18n): a Calendars guide page for other calendar systems (#10017)
- [ ] [`6e2e24293`](https://github.com/meta/astryx/commit/6e2e24293) feat(lab): Schedule writes dates in the provider's calendar (#9994)
- [ ] [`189a730ce`](https://github.com/meta/astryx/commit/189a730ce) feat(DateInput, DateTimeInput, DateRangeInput): type, pick and show dates in the active calendar (#9643, #9842)
  - 暂缓：按当前历法输入、选择和显示日期，依赖非公历日历系统，Vue 版还没有
- [x] [`a866c2ab0`](https://github.com/meta/astryx/commit/a866c2ab0) fix(Dialog, Drawer): a backdrop press that closes a popover inside closes only the popover (#9988)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。日历在对话框里被点遮罩关掉时只关日历，对话框留着，补测试
- [ ] [`c26fcd543`](https://github.com/meta/astryx/commit/c26fcd543) chore(lab): Lab's animator hook, over Core's internal touch entry (#9754)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [x] [`257573b22`](https://github.com/meta/astryx/commit/257573b22) docs(AST-094, AST-057): motion guidance; gesture springs; swipe-row returns (#9915)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3b8d81fd0`](https://github.com/meta/astryx/commit/3b8d81fd0) spec: record component icon slots in CodeBlock, Timestamp, and Table (#10045)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`d7a7dd3bb`](https://github.com/meta/astryx/commit/d7a7dd3bb) feat(Timestamp): the hover card's copy button resolves its glyph through the timestamp-copy icon slot (#9830)
- [ ] [`a4dd70eb1`](https://github.com/meta/astryx/commit/a4dd70eb1) docs(useCalendarDays): add hook docs and a month grid example block (#9905)
- [ ] [`17e36e748`](https://github.com/meta/astryx/commit/17e36e748) fix(DateTimeInput): a press's deferred-click watchers leave with the field (#10155)
- [ ] [`ab7facf1e`](https://github.com/meta/astryx/commit/ab7facf1e) fix(core): spring roles register themselves when they load (#10138)
  - 暂缓：要还原上游动效，归动效与手势引擎任务

### v0.7.10

- [ ] [`bfc4940ec`](https://github.com/meta/astryx/commit/bfc4940ec) fix(Calendar): navigate internally when only onFocusDateChange is set (#10180)
- [ ] [`e49ae7443`](https://github.com/meta/astryx/commit/e49ae7443) fix(Timestamp): the hover card keeps description-list structure (#9041)
- [x] [`f88d572ac`](https://github.com/meta/astryx/commit/f88d572ac) fix(DateInput, TimeInput, DateTimeInput): value accepts an explicit undefined (#10129)
  - Vue 版已有：属性可选，传 undefined 等同不传，Vue 没有 exactOptionalPropertyTypes 的限制

### v0.7.11

- [x] [`28c2e3fe5`](https://github.com/meta/astryx/commit/28c2e3fe5) test(core): six date and time cases pin each CLDR version's words (#10264)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a26f7c452`](https://github.com/meta/astryx/commit/a26f7c452) fix(Calendar, DateRangeInput): today is read after hydration, so a server in another zone no longer causes a mismatch (#10226)
- [x] [`089f7a078`](https://github.com/meta/astryx/commit/089f7a078) test: cut the jsdom style work that times out UI suites under load (#10285)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7efb4f7ad`](https://github.com/meta/astryx/commit/7efb4f7ad) feat(core): add timezoneID prop to Timestamp (#9789)
- [x] [`3e8137f65`](https://github.com/meta/astryx/commit/3e8137f65) test(core): two busy-block proofs judge against the control (#10314)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`85788840e`](https://github.com/meta/astryx/commit/85788840e) fix(DateInput): a wheel's turn from a tap, a key or the program plays the settle spring (#9924)
  - 暂缓：点按、按键或程序触发的滚轮弹簧回弹，依赖 Vue 还没有的滚轮物理设施

### v0.7.12

- [x] [`b1327c020`](https://github.com/meta/astryx/commit/b1327c020) test: watch before the action at 28 first-contact waits (#10286)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2b3551d36`](https://github.com/meta/astryx/commit/2b3551d36) fix(TimeInput): drop the typed draft when an arrow key steps the value (#10179)
- [x] [`065603204`](https://github.com/meta/astryx/commit/065603204) test(Wheel): hold the coast from its start, and catch it frozen (#10340)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：只改上游测试（自动初筛）
- [x] [`2bbaeada8`](https://github.com/meta/astryx/commit/2bbaeada8) fix(DateInput): a focused sheet month arrow that hides at the range end hands focus on first (#10231)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。面板月份箭头在范围尽头隐藏时先把焦点交给另一个箭头
- [x] [`24d845b42`](https://github.com/meta/astryx/commit/24d845b42) fix(core): a month past the end of its year constrains to the last month (#10461)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a4eca1690`](https://github.com/meta/astryx/commit/a4eca1690) fix(Popover): a dialog popover starts focus on an enabled tab stop (#10503)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8091fbc64`](https://github.com/meta/astryx/commit/8091fbc64) docs(useCalendarNavigation): add hook docs and a month pager example block (#10154)
- [x] [`9d5507609`](https://github.com/meta/astryx/commit/9d5507609) fix(DateInput, DateTimeInput): under a finger the month/year wheels move the date like UIDatePicker's (#8209)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。手指下月份年份滚轮带着已选日期走，像 UIDatePicker
- [ ] [`62c7802e8`](https://github.com/meta/astryx/commit/62c7802e8) docs(useCalendarConstraints): add hook docs and a hotel booking range example block (#10151)
- [ ] [`372f681ba`](https://github.com/meta/astryx/commit/372f681ba) fix(Calendar): day buttons grow with their numbers (#10596)
- [x] [`619ffeb27`](https://github.com/meta/astryx/commit/619ffeb27) fix(core, richtext): no focus fade on text fields under a coarse pointer (#10611)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。粗指针下文本字段不做焦点渐变
- [x] [`36c29737f`](https://github.com/meta/astryx/commit/36c29737f) fix(DateInput, DateTimeInput): the sheet's calendar waits for today, so hydration matches (#10400)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。面板日历等挂载后再读今天，水合一致
- [x] [`7bc8230f8`](https://github.com/meta/astryx/commit/7bc8230f8) fix(Button): a labelled button grows with its label (#10588)
  - Vue 版已有：button.css 的 height 取尺寸与 1lh 的较大值，带文字按钮随文字长高
- [x] [`1ffc0dac9`](https://github.com/meta/astryx/commit/1ffc0dac9) fix(BottomSheet): resting content starts below the grab bar, whatever the padding (#8558)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。面板静止内容从抓手条下面开始，不受内边距影响
- [x] [`544442239`](https://github.com/meta/astryx/commit/544442239) fix(Button): at the default text size a labelled button renders exactly as before (#10678)
  - Vue 版已有：同 button.css，默认字号下渲染不变
- [x] [`5490c7c50`](https://github.com/meta/astryx/commit/5490c7c50) test(interaction-harness): share settlesAt with waitForRest's deadline (#10606)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b207e607a`](https://github.com/meta/astryx/commit/b207e607a) fix(Timestamp): attach popup semantics to the focusable time (#6298)
- [x] [`9acc1b449`](https://github.com/meta/astryx/commit/9acc1b449) test(interaction-harness): no wheel re-takes; delete retakeOnWheelPacing (#10549)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`aa31eab11`](https://github.com/meta/astryx/commit/aa31eab11) fix(HoverCard): a labelled card puts aria-haspopup only on a trigger whose role supports it (#10733)
- [x] [`86809383e`](https://github.com/meta/astryx/commit/86809383e) test(Timer): complete hardening audit layers 1-2 (#6483) (#6609)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7cc934044`](https://github.com/meta/astryx/commit/7cc934044) fix(DateInput): a wheel's key step rests on the row it steps to (#10610)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。滚轮按键步进落在目标行（方向键走到头停住，支持 Page 键）
- [x] [`376a48331`](https://github.com/meta/astryx/commit/376a48331) test(Wheel): the busy-thread coast proof decodes each frame once (#10777)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e9ae49934`](https://github.com/meta/astryx/commit/e9ae49934) test(Wheel): the coast proof lifts at the pointerup, as the pan does (#10854)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`5b0eb0fb4`](https://github.com/meta/astryx/commit/5b0eb0fb4) fix(DateInput): a key that cannot scroll a wheel leaves its step running (#10924)
  - 暂缓：要还原上游动效，归动效与手势引擎任务

### v0.7.14

- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [x] [`9d5f4c7b1`](https://github.com/meta/astryx/commit/9d5f4c7b1) spec(AST-111): calendars go by their CLDR names (#11102)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`f27380ab3`](https://github.com/meta/astryx/commit/f27380ab3) feat(TimeInput): the minute wheel loops under a finger, as on iOS (#10953)
  - 暂缓：分钟滚轮在手指下循环，依赖 Vue 还没有的滚轮条带和物理设施

### v0.7.15

- [ ] [`fe22e4197`](https://github.com/meta/astryx/commit/fe22e4197) fix(DateTimeInput): keep native picker bookkeeping in state (#10861)
- [ ] [`804842e60`](https://github.com/meta/astryx/commit/804842e60) fix(Calendar): number each week row by the ISO week of its Thursday (#11271)
- [ ] [`0f4e2c3fb`](https://github.com/meta/astryx/commit/0f4e2c3fb) fix(Calendar): a two-month calendar keeps max's month in the last pane (#11202)
- [x] [`4b24212ad`](https://github.com/meta/astryx/commit/4b24212ad) fix(DateInput, DateTimeInput): plain wording for a date the calendar does not have (#11309)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。日历上没有的日子给出直白的措辞
- [x] [`4705e6763`](https://github.com/meta/astryx/commit/4705e6763) feat(DateInput, DateTimeInput): report typed rejections through onEntryErrorChange (#11311)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。新增 entryErrorChange 事件报告打字被拒（DateInput、DateTimeInput）
- [x] [`70f7b324e`](https://github.com/meta/astryx/commit/70f7b324e) fix(DateInput): keep typed and native field bookkeeping in state (#10877)
  - 不适用：打字与原生字段的记账从 ref 改为 state，是 React 内部重构
- [ ] [`edb2de912`](https://github.com/meta/astryx/commit/edb2de912) fix(Timestamp): a hover-card copy button shows and announces a failed copy (#10434)
- [x] [`1182a6495`](https://github.com/meta/astryx/commit/1182a6495) spec(AST-117): entryErrorBehavior for inputs that check their own entries (#11310)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`0e8cc4b44`](https://github.com/meta/astryx/commit/0e8cc4b44) spec(AST-118): rejected entry feedback for inputs that check their own entries (#11321)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.16

- [x] [`200e53a5f`](https://github.com/meta/astryx/commit/200e53a5f) fix(core): a time clamp with no whole minute inside the range keeps the bound (#10159)
  - 不适用：只改上游测试（自动初筛）
- [x] [`dd702d0d2`](https://github.com/meta/astryx/commit/dd702d0d2) fix(DateInput, DateTimeInput): keep rejected date entries and show why (#11407)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。被拒的日期文字留在框里并说明原因（DateInput、DateTimeInput）
- [x] [`fbbd03931`](https://github.com/meta/astryx/commit/fbbd03931) spec(AST-111): record the owner approval (#11439)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`30da0a57b`](https://github.com/meta/astryx/commit/30da0a57b) fix(NumberInput): keep a rejected number entry and show why (#11415)
  - 不适用：本范围只是 DateInput 抽出共用 hook 的内部重构，NumberInput 的被拒输入归输入框族
- [x] [`dcdfd7f43`](https://github.com/meta/astryx/commit/dcdfd7f43) fix(DateInput, DateTimeInput): a value passed at the revealing commit keeps the rejected date entry (#11470)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。揭示被拒输入那一刻传进来的值不顶掉被拒文字
- [ ] [`a32287bcb`](https://github.com/meta/astryx/commit/a32287bcb) fix(TimeInput, DateTimeInput): keep rejected time entries and show why (#11413)
- [x] [`130e5da2d`](https://github.com/meta/astryx/commit/130e5da2d) feat(DateInput, DateTimeInput, TimeInput, FormLayout): entryErrorBehavior and a form default (#11485)
  - 已移植：[#546](https://github.com/astryx-vue/astryx-vue/pull/546)。entryErrorBehavior 与 FormLayout 的 defaultEntryErrorBehavior（DateInput、DateTimeInput；TimeInput 随输入框族的时间被拒输入一起做）

### v0.7.17

- [ ] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
- [ ] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
- [x] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)。Pagination 首尾标记、文字角色行高由基础展示族完成，其余不适用
- [ ] [`83424673c`](https://github.com/meta/astryx/commit/83424673c) chore: land batch 16 (6 pull requests) (#12881)
- [ ] [`972102325`](https://github.com/meta/astryx/commit/972102325) fix(Timestamp): a relative name starts with the words it shows (#12222)
- [ ] [`230045ad2`](https://github.com/meta/astryx/commit/230045ad2) fix(DateInput): under Reduced Motion a wheel's mouse-drag release lands at once (#12522)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [ ] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)

## 状态反馈与加载（area:core）

### v0.7.2

- [ ] [`e2909cf48`](https://github.com/meta/astryx/commit/e2909cf48) [Component Audit] EmptyState: remove blank optional-slot gaps (#7654)
- [ ] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
- [ ] [`a44ebd55a`](https://github.com/meta/astryx/commit/a44ebd55a) feat(cli): install once, run anywhere — every copy hands a project's run to the release its Core matches (#7649)

### v0.7.3

- [x] [`31e06f44a`](https://github.com/meta/astryx/commit/31e06f44a) spec(AST-086): status announcements have one owner and use the shared channel (#7792)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.4

- [x] [`0c1a6e860`](https://github.com/meta/astryx/commit/0c1a6e860) test(a11y): add Progressbar contract and bind ProgressBar and CircularProgress (#7919)
  - 不适用：只改上游测试（自动初筛）

### v0.7.5

- [ ] [`bc40b8065`](https://github.com/meta/astryx/commit/bc40b8065) fix(Stepper): keep a clickable step's number and label apart in its text reading (#8016)
- [ ] [`4d6046896`](https://github.com/meta/astryx/commit/4d6046896) fix(Skeleton): the pulse keeps going in Safari while JavaScript runs (#8184)
- [x] [`4d9de87a1`](https://github.com/meta/astryx/commit/4d9de87a1) spec(theme): surface-specific status color roles (#8116)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`8b7491193`](https://github.com/meta/astryx/commit/8b7491193) fix(EmptyState): announce once when it appears after load, not as a live root (#8294)
- [x] [`5b9e43bd0`](https://github.com/meta/astryx/commit/5b9e43bd0) fix(ChatComposer): the status bar announces through the shared own-content module (#8363)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3462f994e`](https://github.com/meta/astryx/commit/3462f994e) docs(spec): StatusDot records its shipped contract as current (#8314)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`fe1f9099f`](https://github.com/meta/astryx/commit/fe1f9099f) docs(spec): Spinner records its shipped contract as current (#8397)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`d62a221b8`](https://github.com/meta/astryx/commit/d62a221b8) docs(spec): Skeleton records its shipped contract as current (#8405)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [x] [`1987ebd14`](https://github.com/meta/astryx/commit/1987ebd14) docs(spec): Stepper records its shipped contract as current (#8672)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`ab0db1f73`](https://github.com/meta/astryx/commit/ab0db1f73) spec(AST-108): theme motion is three knobs — tempo, character, reducedMotion (#8613)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`d6004fdc2`](https://github.com/meta/astryx/commit/d6004fdc2) fix(Banner): contain status foregrounds (#8772)
- [x] [`b39314411`](https://github.com/meta/astryx/commit/b39314411) spec(family): action groups — press, slide across, act on lift (AST-094 FR26–FR28) (#8622)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.6

- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [x] [`5b76cd5a3`](https://github.com/meta/astryx/commit/5b76cd5a3) docs(spec): Indicator records its shipped contract as current (#9081)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`0d67f0f6b`](https://github.com/meta/astryx/commit/0d67f0f6b) fix(ProgressBar): a determinate fill keeps moving while JavaScript runs (#8196)
- [ ] [`0ef60ddb6`](https://github.com/meta/astryx/commit/0ef60ddb6) feat(core): a theme's motion takes tempo and character (#8661)
- [ ] [`962dffeeb`](https://github.com/meta/astryx/commit/962dffeeb) fix(Stepper): a disabled step stays focusable and aria-disabled in a clickable Stepper (component:Step FR2) (#8867)
- [x] [`b68f90686`](https://github.com/meta/astryx/commit/b68f90686) docs(spec): EmptyState records its shipped contract as current (#9127)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`0d71e8d48`](https://github.com/meta/astryx/commit/0d71e8d48) docs(spec): ProgressBar records its shipped contract as current (#9135)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`1d8696ad9`](https://github.com/meta/astryx/commit/1d8696ad9) spec: Tooltip and HoverCard pin on press; InfoTip is the info preset (#9175)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`6b48c6851`](https://github.com/meta/astryx/commit/6b48c6851) fix(ProgressBar): name focusable target marks (#9276)
- [x] [`e7530dbb4`](https://github.com/meta/astryx/commit/e7530dbb4) test(rtl): RTL coverage for seven Core parts (Step, OverflowList, dialogs, MobileNav, menus) (#9332)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
- [x] [`7d493c12e`](https://github.com/meta/astryx/commit/7d493c12e) test(ProgressBar, CircularProgress): motion traces read screencast frames in the order they were presented (#9378)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a68e0e372`](https://github.com/meta/astryx/commit/a68e0e372) spec(Tooltip, HoverCard): rename pressTrigger to triggerBehavior ('adaptive' | 'hover' | 'toggle') (#9379)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1f6919c3f`](https://github.com/meta/astryx/commit/1f6919c3f) spec(ProgressBar): touch determinate timing and a Reduce Motion pulse (#9425)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
- [x] [`30c3fdf26`](https://github.com/meta/astryx/commit/30c3fdf26) test(ProgressBar, CircularProgress): motion traces measure what they claim on a loaded runner (#9413)
  - 不适用：只改上游测试（自动初筛）

### v0.7.7

- [ ] [`3b3052a69`](https://github.com/meta/astryx/commit/3b3052a69) feat(ProgressBar): UIProgressView's timing under a finger (#8225)
- [ ] [`80cba260f`](https://github.com/meta/astryx/commit/80cba260f) feat(ProgressBar): under reduced motion the indeterminate bar pulses in place (#8239)
- [x] [`1821fb3fa`](https://github.com/meta/astryx/commit/1821fb3fa) fix(Tooltip): remove the unreleased triggerBehavior prop before 0.7.7 (#9711)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bec12a3b2`](https://github.com/meta/astryx/commit/bec12a3b2) fix(Button): a tooltip that repeats the accessible name adds no description (#9681)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`fa3295a50`](https://github.com/meta/astryx/commit/fa3295a50) fix(Spinner): the ring keeps turning while JavaScript runs (#8177)
- [x] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [x] [`61cf773c2`](https://github.com/meta/astryx/commit/61cf773c2) refactor(InfoTip): build on useTooltip's show() and hide(); remove the internal toggle path (#9756)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`21c402677`](https://github.com/meta/astryx/commit/21c402677) refactor(Stepper): stop the width observer from the list's ref cleanup, not an Effect (#9858)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f10bc9153`](https://github.com/meta/astryx/commit/f10bc9153) spec(AST-094): only a gesture's motion springs; other motion plays the theme's tokens (#9706)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.9

- [ ] [`ed9b75b81`](https://github.com/meta/astryx/commit/ed9b75b81) fix(Spinner): a turning ring wakes the main thread once in 100 turns (#9936)
- [x] [`9bd11b363`](https://github.com/meta/astryx/commit/9bd11b363) feat(core): a checkbox's or radio option's hit area grows toward 44 px (#8241)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`de1be1fd9`](https://github.com/meta/astryx/commit/de1be1fd9) fix(CircularProgress): the indeterminate ring turns with Spinner's rotor (#8256)
- [x] [`7b71d71b4`](https://github.com/meta/astryx/commit/7b71d71b4) feat(List): a row's touch target grows toward 44 px where its neighbors leave room (#8085)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ceefccdfc`](https://github.com/meta/astryx/commit/ceefccdfc) feat(core): the animator's springs follow the theme's tempo (#8677)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1ef21f898`](https://github.com/meta/astryx/commit/1ef21f898) fix(Spinner): route standalone loading through the shared announcement channel (#7910)
- [x] [`e191eed02`](https://github.com/meta/astryx/commit/e191eed02) test(Spinner): wait for announcements before tracing rotor paints (#10195)
  - 不适用：只改上游测试（自动初筛）

### v0.7.10

- [x] [`add05168f`](https://github.com/meta/astryx/commit/add05168f) fix(core): a finger held on a control's box picks it, not the text (#10091)
  - 不适用：只改上游测试（自动初筛）
- [x] [`123bb90a3`](https://github.com/meta/astryx/commit/123bb90a3) test(Spinner): the paint trace waits for the announcement to end (#10214)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0a335a9be`](https://github.com/meta/astryx/commit/0a335a9be) docs(ProgressBar): target marks render outside the progressbar so their labels stay exposed (#10193)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f36e57c50`](https://github.com/meta/astryx/commit/f36e57c50) docs(spec): Skeleton radius is callsite geometry and is not reflected (#10221)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.11

- [ ] [`66b09526b`](https://github.com/meta/astryx/commit/66b09526b) fix(core): a swizzled copy type-checks without Node's types (#10252)
- [ ] [`f8640a4ea`](https://github.com/meta/astryx/commit/f8640a4ea) fix(Banner): role="alert" covers the urgent message only; bind the urgent alert states (#6779)
- [ ] [`47949436a`](https://github.com/meta/astryx/commit/47949436a) fix(core): StatusDot status dots paint their icon role (#10204)
- [x] [`91150ccc6`](https://github.com/meta/astryx/commit/91150ccc6) test(Banner): run the known-failure check as one part per alert state (#10412)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)
  - 不适用：只改上游测试（自动初筛）
- [x] [`28270c143`](https://github.com/meta/astryx/commit/28270c143) test(interaction-harness): an armed hold names the motion it judges (#10386)
  - 不适用：只改上游测试（自动初筛）

### v0.7.12

- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`859a6fdac`](https://github.com/meta/astryx/commit/859a6fdac) fix(core): a Step keeps its own aria-current over a caller's (#10640)
- [x] [`aefb30d0c`](https://github.com/meta/astryx/commit/aefb30d0c) fix(PowerSearch): the sheet's choice lists are standard RadioList and CheckboxList (#10608)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`8f365eb73`](https://github.com/meta/astryx/commit/8f365eb73) docs(Skeleton): radius 4 maps to the same container radius as 3 (#10750)

### v0.7.14

- [x] [`4236e8829`](https://github.com/meta/astryx/commit/4236e8829) test(ProgressBar): wait for the story's bar, not 5 s (#10976)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`038b0a7d7`](https://github.com/meta/astryx/commit/038b0a7d7) fix(core): layout motion, spinner rotors and gesture sync are one per page across swizzled copies (AST-110 FR3) (#11027)
- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)

### v0.7.15

- [x] [`55646b3b1`](https://github.com/meta/astryx/commit/55646b3b1) test(Indicator): one BoxHold long-press case per test (#10969)
  - 不适用：只改上游测试（自动初筛）
- [x] [`238c2757d`](https://github.com/meta/astryx/commit/238c2757d) test(Spinner): judge the turning ring against a busy control (#10977)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4b0268fca`](https://github.com/meta/astryx/commit/4b0268fca) fix(Stepper): reflect disabled on the step-indicator theming target (#8997) (#9192)

### v0.7.16

- [ ] [`9d2ce46c7`](https://github.com/meta/astryx/commit/9d2ce46c7) docs(core): playground defaults for eight components and sample items for four group playgrounds (#11351)

### v0.7.17

- [ ] [`e4a11bb68`](https://github.com/meta/astryx/commit/e4a11bb68) fix(core): a radio's circle is drawn at 50%, not with the pill token (#11836)
- [ ] [`da710f6ed`](https://github.com/meta/astryx/commit/da710f6ed) fix(Stepper): a disabled step in the compact layout says it is unavailable (#11632)
- [ ] [`417d9ef0e`](https://github.com/meta/astryx/commit/417d9ef0e) fix(core): a vertical Step with separated indicators keeps its content within the step (#12310)
- [ ] [`3deff9de7`](https://github.com/meta/astryx/commit/3deff9de7) feat(core): theme seams for the spinner, tree disclosure, number steppers and close buttons (#12156)
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
- [ ] [`910b80d5f`](https://github.com/meta/astryx/commit/910b80d5f) chore: land batch 9 (4 pull requests) (#12825)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
- [ ] [`82af9164d`](https://github.com/meta/astryx/commit/82af9164d) fix(ProgressBar, CircularProgress, themes): every enabled progress fill reaches 3:1 against its track (#12398)
- [ ] [`9d23a5e6e`](https://github.com/meta/astryx/commit/9d23a5e6e) chore: land batch 87 (2 pull requests) (#13021)

## 界面文案与图标（area:core）

### v0.7.2

- [x] [`10dbc9dde`](https://github.com/meta/astryx/commit/10dbc9dde) docs: define bidirectionality design intent (#6047)
  - Vue 版已有：上游新增的是内部双向文字设计记录；Vue 文档 i18n 指南的「Right-to-left」一节已讲 dir、逻辑属性、镜像与测试方法
- [x] [`2d9221308`](https://github.com/meta/astryx/commit/2d9221308) docs(core): define the internationalization contract (#6048)
  - 已移植：[#534](https://github.com/astryx-vue/astryx-vue/pull/534)。InternationalizationProvider 文档补上「Provider boundary」结构说明（不渲染 DOM，向下提供语言、文案、覆盖和方向）；上游契约文档与测试属内部规范
- [x] [`4f1b5c979`](https://github.com/meta/astryx/commit/4f1b5c979) docs: define RTL audit evidence policy (#6046)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`97a00379a`](https://github.com/meta/astryx/commit/97a00379a) feat(lab): DiffViewer — unified/split file diff for code review (#7536)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；DiffViewer 命名空间仍在 coverage.mjs 暂不接入名单
- [x] [`9fa22137e`](https://github.com/meta/astryx/commit/9fa22137e) feat(lab): add EmojiPicker (#7605)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；EmojiPicker 的键早已接进 upstreamMap
- [x] [`5c208f6a4`](https://github.com/meta/astryx/commit/5c208f6a4) feat(lab): add CommentComposer (#7606)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；CommentComposer 的键早已接进 upstreamMap
- [x] [`fc12a1803`](https://github.com/meta/astryx/commit/fc12a1803) feat(lab): add CommentThread (#7607)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；CommentThread 的键早已接进 upstreamMap
- [x] [`5c75a7550`](https://github.com/meta/astryx/commit/5c75a7550) feat(lab): add Comments (#7551)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；Comments 的键早已接进 upstreamMap
- [x] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
  - 已移植：[#514](https://github.com/astryx-vue/astryx-vue/pull/514)。按基础展示族结论：CLI 搜索收录别家叫法与常见图标名，Icon 文档关键词随之更新

### v0.7.3

- [x] [`31e06f44a`](https://github.com/meta/astryx/commit/31e06f44a) spec(AST-086): status announcements have one owner and use the shared channel (#7792)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7370328f6`](https://github.com/meta/astryx/commit/7370328f6) spec(AST-009): real-AT evidence never gates merge or release (#7915)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.4

- [x] [`2b60fa6fd`](https://github.com/meta/astryx/commit/2b60fa6fd) fix(inputs): silence the busy Spinner and announce the busy start once (TextInput, TextArea, Selector, MultiSelector) (#7920)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐（只改了 spinner.loading 等键的说明，英文不变）；输入框忙碌播报属输入框族
- [x] [`51ad2f40d`](https://github.com/meta/astryx/commit/51ad2f40d) fix(ChatComposerInput): announce the trigger menu's loading text through the shared channel (#7900)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。新键 chatTriggerMenu.searching 接入 chat.searching，ChatComposerInput 的搜索中文字可随目录翻译
- [x] [`9f3ab054c`](https://github.com/meta/astryx/commit/9f3ab054c) fix(ComplexSelector, Typeahead, Tokenizer): silence the busy Spinner and announce the busy start once (#7930)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐（只改了 typeahead.loading 的说明）；组件忙碌播报属选择器族
- [x] [`a732e5c64`](https://github.com/meta/astryx/commit/a732e5c64) fix(DateInput, DateRangeInput): silence the busy Spinner and announce the busy start once (#7939)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐（只改了键说明）；日期输入忙碌播报属日期族
- [x] [`4fc0c4a48`](https://github.com/meta/astryx/commit/4fc0c4a48) feat(cli): experimental icon sets — icon definitions, `astryx experimental icon`, templates that use the installed set (#7759)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.5

- [x] [`ad2646109`](https://github.com/meta/astryx/commit/ad2646109) spec(AST-087): icon variants, theme sizes, and componentIcons state resolvers (#7847)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`f2dafed1b`](https://github.com/meta/astryx/commit/f2dafed1b) spec(AST-086): announce a message when it appears after the page loads (#7961)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2a50a8064`](https://github.com/meta/astryx/commit/2a50a8064) feat(cli): experimental icon sets — authoring fixes from fresh-agent Heroicons and Lucide runs (#7964)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`34056d848`](https://github.com/meta/astryx/commit/34056d848) spec(AST-086): identical same-frame repeats are one message; no busy start after its outcome (#8102)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`fccda0f7a`](https://github.com/meta/astryx/commit/fccda0f7a) spec(AST-086): announcements inside a modal reach that modal, including useAnnounce (#8115)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`47c4cbf19`](https://github.com/meta/astryx/commit/47c4cbf19) spec(AST-086): FR13 announces content revealed outside React on the owner's next render (#8325)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
  - 已移植：[#517](https://github.com/astryx-vue/astryx-vue/pull/517)。按基础展示族结论：状态色角色与 Icon 改读正确角色
- [x] [`54fbccb27`](https://github.com/meta/astryx/commit/54fbccb27) feat(core): Tokenizer touch sheet behind experimental.presentation (#7977)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；Tokenizer 触屏弹层的新键在 Vue 版对应 lab MobileTokenizer，暂列 coverage.mjs 并写明缺口
- [x] [`0472c4e07`](https://github.com/meta/astryx/commit/0472c4e07) test(rtl): enforce native touch target dimensions and remove centering exemption
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`fb36bba9f`](https://github.com/meta/astryx/commit/fb36bba9f) New Crowdin updates (#7626)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。29 种语言目录随整体对齐到 v0.7.17 一并更新
- [x] [`c86dc620c`](https://github.com/meta/astryx/commit/c86dc620c) fix(i18n): catch formatter returns and localize helper text (#7849)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。Kbd 键名、文件大小、粘贴计数的键接进 upstreamMap；icu.ts 认得数字骨架，文件大小按上游写成不分组、一位小数（组件部分见 #508）
- [x] [`05ead02aa`](https://github.com/meta/astryx/commit/05ead02aa) feat(Icon): a theme icon entry can be a function of the requested size (#8753)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：主题图标条目可写成按尺寸取值的函数
- [x] [`db584bcb0`](https://github.com/meta/astryx/commit/db584bcb0) feat(Icon): a theme's width and height on an Icon size set its glyph dimension (#8759)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：主题 Icon 尺寸的宽高决定字形尺寸
- [x] [`dae174730`](https://github.com/meta/astryx/commit/dae174730) feat(theme): a theme lists its icon variant names once (#8756)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：defineTheme 的 iconVariants
- [x] [`33645a2d2`](https://github.com/meta/astryx/commit/33645a2d2) feat(Icon): request a theme's alternate icon artwork with variant (#8758)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：Icon 的 variant 属性
- [x] [`14fc58723`](https://github.com/meta/astryx/commit/14fc58723) ci: visual, accessibility and RTL run on main, not on pull request updates (#8877)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.6

- [x] [`6700c2492`](https://github.com/meta/astryx/commit/6700c2492) fix(Tokenizer): label the inline create row from the catalog (#9029)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。新键 tokenizer.create 接入 tokenizer.create，Tokenizer 创建行改读自己的目录键
- [x] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
  - 不适用：React 版 esbuild 单文件打包与懒加载入口的问题
- [x] [`6beb2e55a`](https://github.com/meta/astryx/commit/6beb2e55a) fix(MultiSelector): the default count trigger text comes from the catalog (#9020)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。新键 multiSelector.selectedCount 接入 MultiSelector 计数触发器文字
- [x] [`94a2a8ee5`](https://github.com/meta/astryx/commit/94a2a8ee5) spec(AST-086): a status is replaced by its owner's next status, not joined (#9070)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`64caf1dd0`](https://github.com/meta/astryx/commit/64caf1dd0) fix(TextArea): the character counter comes from one catalog message (#9025)
  - Vue 版已有：Vue 版 TextArea 计数在一处按当前语言数字格式写成「已输入/上限」；textArea.counter 没有要翻译的文字，在 coverage.mjs 写明
- [x] [`bb18c817a`](https://github.com/meta/astryx/commit/bb18c817a) fix(Table): a column-resize handle is named by a node header's visible text (#9057)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；列宽拖柄名的键交给 Table 同步任务接入，暂列 coverage.mjs
- [x] [`faee47927`](https://github.com/meta/astryx/commit/faee47927) fix(TimeInput, DateTimeInput): time text follows the locale's hour cycle and day periods (#9022)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐（时间提示键的说明更新）；时间按地区时制显示属日期族，上游架构文档属内部规范
- [x] [`ec128c411`](https://github.com/meta/astryx/commit/ec128c411) fix(Slider): range thumb names come from the catalog (#9023)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。新增内置 slider 文案并接入目录，Slider 的两端滑块名和必填提示不传时跟随当前语言，补测试
- [x] [`b4b978da2`](https://github.com/meta/astryx/commit/b4b978da2) fix(Comments): announce error banners and progress labels through the shared channel (#7902)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；Comments 错误横幅播报的新键暂列 coverage.mjs（组件行为不在本族清单）
- [x] [`c8e1804d8`](https://github.com/meta/astryx/commit/c8e1804d8) ci: drop off-PR and informational checks (#8894)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3b0a56a02`](https://github.com/meta/astryx/commit/3b0a56a02) fix(Tokenizer, PowerSearch): Clear all is announced, once, in each component's own words (#9038)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；Tokenizer、PowerSearch 全部清除播报的新键暂列 coverage.mjs（组件行为不在本族清单）
- [x] [`8ff38ab97`](https://github.com/meta/astryx/commit/8ff38ab97) fix(Table): sort buttons and the scroll region are named by what they belong to (#9047)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。Table 排序按钮改用列标题命名，方向看 aria-sort，多列排序用描述读优先级，序号对读屏隐藏；sortFor() 的 label 换成 description；滚动区本来就用 label 命名
- [x] [`5b5ae2d79`](https://github.com/meta/astryx/commit/5b5ae2d79) fix(FileInput): every rejected file is named in the status message (#9043)
  - 已移植：[#534](https://github.com/astryx-vue/astryx-vue/pull/534)。新增按当前语言连接列表的 useListFormatter，FileInput 一次列出所有被拒文件及原因，补测试
- [x] [`4cb7f27aa`](https://github.com/meta/astryx/commit/4cb7f27aa) ci: per-suite ci:run-visual, ci:run-a11y and ci:run-rtl labels replace ci:heavy-lanes (#9165)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e42836644`](https://github.com/meta/astryx/commit/e42836644) ci: main's release-check runs about once an hour, covering every merge (AST-030 FR12) (#9181)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`cd40b8b2e`](https://github.com/meta/astryx/commit/cd40b8b2e) architecture(internationalization): type-to-select ignores marks in every locale (INV17) (#9009)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`dae84a757`](https://github.com/meta/astryx/commit/dae84a757) tooling(knowledge): records route the claims of shared concerns a change touches (#9145)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`0df41f123`](https://github.com/meta/astryx/commit/0df41f123) fix(MobileTokenizer): refine touch sheet editing flow (#8742)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；触屏弹层编辑流程的新键暂列 coverage.mjs（Vue 版对应 lab MobileTokenizer）
- [x] [`6504e7066`](https://github.com/meta/astryx/commit/6504e7066) spec(internationalization): INV17 is implemented; record the shared fold and its tests (#9267)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1315e7816`](https://github.com/meta/astryx/commit/1315e7816) ci: a touched-components check runs visual, a11y and RTL for the components a pull request changes (#9178)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d51f57efa`](https://github.com/meta/astryx/commit/d51f57efa) fix(SideNavHeading, TopNavHeading): include headings in menu button names (#9329)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。SideNavHeading、TopNavHeading 菜单按钮名带上标题，TopNav 无标题时仍为「Open menu」；checker 支持 select 后两条键都接入，补测试
- [x] [`26a1b0989`](https://github.com/meta/astryx/commit/26a1b0989) fix(rtl-audit): D5 grades declared chart overlays as physical (DR5) (#9323)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c3cbf38b4`](https://github.com/meta/astryx/commit/c3cbf38b4) ci: main's release-check every three hours, plus one before each weekday cut (AST-030 FR24) (#9216)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c5fbecb8d`](https://github.com/meta/astryx/commit/c5fbecb8d) spec(i18n, Resizable, AST-103): factories take announcement and label options with a catalog default (#9395)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
  - 已移植：[#515](https://github.com/astryx-vue/astryx-vue/pull/515)。按基础展示族结论：组件只按命名空间读内置文案
- [x] [`16fe5f199`](https://github.com/meta/astryx/commit/16fe5f199) fix(core): Table, Chat, CommandPalette and the date and time inputs carry only their own English (#9452)
  - Vue 版已有：Vue 版每个组件只通过 useComponentMessages 读自己命名空间的内置文案（#515），Table、Chat、日期输入本来只带自己的英文
- [x] [`437f54847`](https://github.com/meta/astryx/commit/437f54847) fix(DiffViewer): a change too large to compare line by line is labeled and folded, not shown as a silent replace (#9462)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；DiffViewer 命名空间仍在 coverage.mjs 暂不接入名单
- [x] [`eb282ba70`](https://github.com/meta/astryx/commit/eb282ba70) spec(internationalization): name the type-to-select fold in owning code (#9546)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.7

- [x] [`449486fdc`](https://github.com/meta/astryx/commit/449486fdc) feat(core): promote InfoTip from Lab as the info preset over Tooltip's press toggle (#9238)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。新键 infoTip.label 接入 InfoTip 默认名
- [x] [`2c533501a`](https://github.com/meta/astryx/commit/2c533501a) fix(PowerSearch): Clear all keeps read-only filters (#9676)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；editableFiltersRemoved 暂列 coverage.mjs（PowerSearch 行为不在本族清单）

### v0.7.8

- [x] [`30160f5ce`](https://github.com/meta/astryx/commit/30160f5ce) feat(core): PowerSearch touch sheet flow behind experimental.presentation (#8001)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；PowerSearch 触屏弹层的键暂列 coverage.mjs，Vue 版还没有这个呈现方式
- [x] [`9ee4282db`](https://github.com/meta/astryx/commit/9ee4282db) [Component Audit] Icon: labelled icons from icon libraries reach screen readers (#9738)
  - Vue 版已有：按基础展示族结论：带 label 时 role=img 与 aria-label 落在外层
- [x] [`cf8e4e04a`](https://github.com/meta/astryx/commit/cf8e4e04a) docs(specs): Icon and IconButton verification maps name their current tests and receipts (#9780)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a7e7d4516`](https://github.com/meta/astryx/commit/a7e7d4516) docs(Icon): the color doc type lists the palette; native keeps the semantic set (#9821)
  - Vue 版已有：按基础展示族结论：IconColor 类型与文档已列完整调色板
- [x] [`16a5397c9`](https://github.com/meta/astryx/commit/16a5397c9) feat(Calendar): weekday headers show abbreviated names where all seven fit in four characters (#9824)
  - 不适用：上游仓库脚本（自动初筛）
- [x] [`3090f9833`](https://github.com/meta/astryx/commit/3090f9833) fix(Icon): ref reaches the rendered svg for every name (#9782)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：Icon 暴露 element 与 svg
- [x] [`31ab2c3ef`](https://github.com/meta/astryx/commit/31ab2c3ef) feat(Table): add row-specific expansion labels (#6776)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；按行名展开的键交给 Table 同步任务接入，暂列 coverage.mjs
- [x] [`cfd120e4c`](https://github.com/meta/astryx/commit/cfd120e4c) feat(Resizable): createResizable drives a plain handle element, with one separator derivation (#9718)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4b8567003`](https://github.com/meta/astryx/commit/4b8567003) feat(PowerSearch): the sheet presentation edits a draft that Done applies, and asks before discarding a changed one (#9895)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；PowerSearch 弹层草稿的键暂列 coverage.mjs

### v0.7.9

- [x] [`cb2a34a62`](https://github.com/meta/astryx/commit/cb2a34a62) fix(a11y): name a scrolling LayoutContent, LayoutPanel or StackItem (#9985)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；scrollRegion.label 暂列 coverage.mjs（布局组件行为不在本族清单）
- [ ] [`4e7823a56`](https://github.com/meta/astryx/commit/4e7823a56) feat(i18n): InternationalizationProvider takes a calendar and exposes the resolved calendar (#9791)
  - 暂缓：Vue 版没有日历系统设施：InternationalizationProvider 无 calendar，日期组件只按公历计算，需要 Temporal 或等价的历法换算
- [ ] [`fe1cf0c6d`](https://github.com/meta/astryx/commit/fe1cf0c6d) feat(Calendar): show the months of the selected calendar system (#9622)
  - 暂缓：依赖 provider 的 calendar 与非公历月份计算，Vue 版 Calendar 只支持公历
- [ ] [`aa7c50176`](https://github.com/meta/astryx/commit/aa7c50176) feat(Calendar): useCalendarDays and useCalendarNavigation take an optional calendar (#10007)
  - 暂缓：useCalendarSystem 依赖日历系统设施，Vue 版还没有
- [ ] [`edf7128e3`](https://github.com/meta/astryx/commit/edf7128e3) feat(Timestamp, PowerSearch): write dates in the provider's calendar (#9639)
  - 暂缓：Timestamp、PowerSearch 按 provider 日历写日期依赖日历系统设施
- [x] [`7be6b4644`](https://github.com/meta/astryx/commit/7be6b4644) feat(core): read typed dates in every calendar (#9792)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`6e2e24293`](https://github.com/meta/astryx/commit/6e2e24293) feat(lab): Schedule writes dates in the provider's calendar (#9994)
  - 暂缓：lab Schedule 按 provider 日历写日期依赖日历系统设施
- [ ] [`189a730ce`](https://github.com/meta/astryx/commit/189a730ce) feat(DateInput, DateTimeInput, DateRangeInput): type, pick and show dates in the active calendar (#9643, #9842)
  - 暂缓：日期输入按当前日历输入和显示依赖日历系统设施；en.json 部分已在 #533 对齐
- [x] [`f384e62f5`](https://github.com/meta/astryx/commit/f384e62f5) docs(useIcon): add hook docs and a status row example block (#9900)
  - Vue 版已有：按基础展示族结论：useSemanticIcon 已有文档
- [x] [`08313899e`](https://github.com/meta/astryx/commit/08313899e) test(scripts): the i18n watcher's signal test runs the forwarding runner alone (#10063)
  - 不适用：上游仓库脚本（自动初筛）
- [x] [`3b8d81fd0`](https://github.com/meta/astryx/commit/3b8d81fd0) spec: record component icon slots in CodeBlock, Timestamp, and Table (#10045)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`98efdf183`](https://github.com/meta/astryx/commit/98efdf183) feat(Icon): a theme maps a component's own icon role by slot, starting with CodeBlock's copy button (#9828)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：componentIcons 与 ComponentIcon
- [x] [`d7a7dd3bb`](https://github.com/meta/astryx/commit/d7a7dd3bb) feat(Timestamp): the hover card's copy button resolves its glyph through the timestamp-copy icon slot (#9830)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：Timestamp 复制按钮走 timestamp-copy 槽位
- [x] [`f85b20173`](https://github.com/meta/astryx/commit/f85b20173) feat(Table): the sort indicator resolves its glyph through the table-sort-indicator icon slot (#9831)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：Table 排序指示走 table-sort-indicator 槽位
- [x] [`c037450fc`](https://github.com/meta/astryx/commit/c037450fc) feat(Table): the row-expansion toggle resolves its glyph through the table-row-expand icon slot (#9834)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：Table 行展开走 table-row-expand 槽位
- [x] [`539326657`](https://github.com/meta/astryx/commit/539326657) chore(core): Core's internal touch entry names, for Lab, the screen-edge pan, spring solver, motion resolver, UIKit navigation springs and focus helpers (#9696)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；新键属于 lab 触屏组件，命名空间列入 coverage.mjs

### v0.7.10

- [x] [`711acc68b`](https://github.com/meta/astryx/commit/711acc68b) fix(FieldLabel): labelTooltip is an InfoTip button after the label, reachable by keyboard and screen readers (#6414)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。新键 field.labelTooltip 接入字段标签旁说明按钮的名字

### v0.7.11

- [x] [`5a323635e`](https://github.com/meta/astryx/commit/5a323635e) fix(core): CodeBlock says when a copy fails (#10272)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；codeBlock.copyFailed 暂列 coverage.mjs（CodeBlock 行为不在本族清单）
- [x] [`f8640a4ea`](https://github.com/meta/astryx/commit/f8640a4ea) fix(Banner): role="alert" covers the urgent message only; bind the urgent alert states (#6779)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.12

- [x] [`05e3cb0e1`](https://github.com/meta/astryx/commit/05e3cb0e1) feat(cli): experimental icon sets — wrapping a large real icon library (#8013)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`79150bc7d`](https://github.com/meta/astryx/commit/79150bc7d) fix(cli): experimental icon sets — name the license notice a library without one needs; a refresh moves per-file icons to the library root (#10458)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
  - 不适用：React context 多副本问题
- [x] [`a8195e032`](https://github.com/meta/astryx/commit/a8195e032) chore(core): Core's internal touch entry re-exports the action-group tracking hook, extended for Lab's TabBar, and a tab-bar string joins the catalog (#9699)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；tabBar 命名空间列入 coverage.mjs，lab TabBar 还没有 Vue 版
- [ ] [`b8cc3f41e`](https://github.com/meta/astryx/commit/b8cc3f41e) fix(Markdown): each prose block lays out in its own text's direction (#10293)
  - 暂缓：首强字符方向分类器只服务 Markdown 按块定方向，Vue 版 Markdown 还没有块方向功能，应随 Markdown 一起移植
- [x] [`fac363ee8`](https://github.com/meta/astryx/commit/fac363ee8) fix(Kbd): ctrl, alt, shift and meta show text off Apple platforms (#10524)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。Kbd 非 Apple 平台的 Alt、Shift、Win 键帽改读内置文案并接入目录，补测试（显示规则见 #503）
- [x] [`b47b33a43`](https://github.com/meta/astryx/commit/b47b33a43) fix(PowerSearch): a filter token's field, operator and value come from catalog messages (#10437)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；PowerSearch token 分段文案的键暂列 coverage.mjs
- [x] [`a28d586eb`](https://github.com/meta/astryx/commit/a28d586eb) feat(core): createReorderable makes List rows reorderable (#8139)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；List 拖拽排序的键暂列 coverage.mjs，Vue 版 List 还没有 createReorderable
- [x] [`6103d36e9`](https://github.com/meta/astryx/commit/6103d36e9) feat(lab): ListInput reorders through core's createReorderable (#8163)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；listInput.itemName 暂列 coverage.mjs，lab ListInput 尚未改用 createReorderable
- [x] [`a04d2e6bf`](https://github.com/meta/astryx/commit/a04d2e6bf) fix(Toast): the viewport is each toast's only announcement owner (#7871)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7f04a6c5a`](https://github.com/meta/astryx/commit/7f04a6c5a) fix(Table): an unbounded column's resize handle announces a range that holds its width (#10577)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；列宽读值的键交给 Table 同步任务接入，暂列 coverage.mjs
- [x] [`06ebae229`](https://github.com/meta/astryx/commit/06ebae229) fix(List): a drag follows a scroll around the list's scroll box (#10742)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；List 拖拽键暂列 coverage.mjs
- [x] [`daa239e98`](https://github.com/meta/astryx/commit/daa239e98) feat(lab): experimental ChatVirtualizer (#5461)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；chatVirtualizer 命名空间列入 coverage.mjs
- [x] [`d5b0bdaa1`](https://github.com/meta/astryx/commit/d5b0bdaa1) chore(core): re-export the scroll test and add the More tab's string (#10791)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；tabBar.more 随 tabBar 命名空间列入 coverage.mjs
- [x] [`c0327e060`](https://github.com/meta/astryx/commit/c0327e060) fix(cli): experimental icon sets — keep the library prefix on a name that starts with a digit (#10895)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`dc91a5b12`](https://github.com/meta/astryx/commit/dc91a5b12) fix(cli): experimental icon sets — add a look's variant from its own package, and skip pack exports (#10896)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.13

- [x] [`367229613`](https://github.com/meta/astryx/commit/367229613) feat(cli): experimental icon sets — one main set with backups, a local placeholder for missing icons, and a docs-site set choice (#10959)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`0a320be62`](https://github.com/meta/astryx/commit/0a320be62) Merge branch 'm3' into m4 (#10847)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐
- [x] [`6af6700c8`](https://github.com/meta/astryx/commit/6af6700c8) docs(useDirection): add hook docs and a live sparkline example block (#10547)
  - 已移植：[#534](https://github.com/astryx-vue/astryx-vue/pull/534)。新增 useLocaleDirection 文档页（中英），对应上游 useDirection 的用法、建议和返回值
- [ ] [`57009119a`](https://github.com/meta/astryx/commit/57009119a) docs(InternationalizationProvider): add a calendar example (#10135)
  - 暂缓：日历示例依赖 provider 的 calendar，Vue 版还没有日历系统设施

### v0.7.14

- [x] [`cfa1d6273`](https://github.com/meta/astryx/commit/cfa1d6273) feat(cli): experimental icon sets — show which template icon meanings a set does not map, and smoother set authoring (#11090)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7882c6028`](https://github.com/meta/astryx/commit/7882c6028) docs(InternationalizationProvider): order the examples locale, RTL, overrides, calendar (#11094)
  - 已移植：[#534](https://github.com/astryx-vue/astryx-vue/pull/534)。provider 文档示例按「载入语言目录、RTL、覆盖一条文案」排序并补齐前两个示例；日历示例随日历设施暂缓
- [x] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
  - 不适用：React Server Components 的 'use client' 指令
- [x] [`fc9fb8ccc`](https://github.com/meta/astryx/commit/fc9fb8ccc) fix(core): registered icons reach swizzled copies; icon and theme registries are one per React (AST-110 FR3) (#11096)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：图标注册表挂到 globalThis
- [x] [`441e079d2`](https://github.com/meta/astryx/commit/441e079d2) fix(cli): experimental icon sets — distinct template icon meanings, keep a wrapped library's icons, docs-site icon-set build fixes (#11142)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`db3e8334f`](https://github.com/meta/astryx/commit/db3e8334f) fix(core): InputGroupText, Badge and Token keep caller text in its written order under RTL (#10114)
  - 已移植：[#500](https://github.com/astryx-vue/astryx-vue/pull/500)。按基础展示族结论：Token、Badge、InputGroupText 在 RTL 下保持书写顺序

### v0.7.15

- [x] [`4b24212ad`](https://github.com/meta/astryx/commit/4b24212ad) fix(DateInput, DateTimeInput): plain wording for a date the calendar does not have (#11309)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；nonexistentDate 暂列 coverage.mjs（日期输入行为不在本族清单）
- [x] [`edb2de912`](https://github.com/meta/astryx/commit/edb2de912) fix(Timestamp): a hover-card copy button shows and announces a failed copy (#10434)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；timestamp.copyFailed 暂列 coverage.mjs
- [x] [`ca204372b`](https://github.com/meta/astryx/commit/ca204372b) chore(core): re-export UIKit's timing, add SearchField's cancel string (#10956)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；searchField 命名空间列入 coverage.mjs

### v0.7.16

- [x] [`a4fe0154f`](https://github.com/meta/astryx/commit/a4fe0154f) chore(core): the catalog gains the Comments copy-link failure message (#11376)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；comments.linkCopyFailed 暂列 coverage.mjs
- [x] [`58b844d16`](https://github.com/meta/astryx/commit/58b844d16) feat(Table): Promise-based infinite loading with useTableInfiniteScroll (#10570)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；table.loadMore 交给 Table 同步任务接入
- [x] [`dd702d0d2`](https://github.com/meta/astryx/commit/dd702d0d2) fix(DateInput, DateTimeInput): keep rejected date entries and show why (#11407)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；outOfRangeDate 等暂列 coverage.mjs
- [x] [`b300313cb`](https://github.com/meta/astryx/commit/b300313cb) feat(Lightbox): a gallery's caption sits in a two-line band (#9810)
  - 已移植：[#507](https://github.com/astryx-vue/astryx-vue/pull/507)。按基础展示族结论：Lightbox 图集图注占两行区域
- [x] [`8d372ddec`](https://github.com/meta/astryx/commit/8d372ddec) feat(core): English strings for the Lab media player (#11438)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；mediaPlayer 命名空间列入 coverage.mjs
- [x] [`30da0a57b`](https://github.com/meta/astryx/commit/30da0a57b) fix(NumberInput): keep a rejected number entry and show why (#11415)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐（numberInput.invalidNumber 说明更新）；保留被拒输入属输入框族
- [x] [`a32287bcb`](https://github.com/meta/astryx/commit/a32287bcb) fix(TimeInput, DateTimeInput): keep rejected time entries and show why (#11413)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐（timeInput.invalidTime 说明更新）；保留被拒输入属日期族
- [x] [`d6caddef6`](https://github.com/meta/astryx/commit/d6caddef6) fix(Lightbox): a single photo's caption sits on the caption's backing (#10284)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐（Lightbox 图注键说明更新）
- [x] [`b8904791a`](https://github.com/meta/astryx/commit/b8904791a) feat(RichTextEditor, RichTextEditorToolbar): replace the toolbar's link dialog with an anchored popover (#8717)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；urlPlaceholder 暂列 coverage.mjs，RichTextEditor 链接编辑仍是对话框
- [x] [`7e8a67000`](https://github.com/meta/astryx/commit/7e8a67000) feat(cli): experimental icon sets — a project picks one look (outline or filled) for every icon (#11499)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.17

- [x] [`b9ef39954`](https://github.com/meta/astryx/commit/b9ef39954) fix(Icon): keep malformed slot diagnostics from interrupting rendering (#11502)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。按基础展示族结论：槽位值写错只在开发环境提示一次
- [x] [`8439a1162`](https://github.com/meta/astryx/commit/8439a1162) fix(Icon): preserve the nearest theme for icon resolution (#11498)
  - Vue 版已有：按基础展示族结论：inject 直接拿最近的主题对象
- [x] [`16fe6a81a`](https://github.com/meta/astryx/commit/16fe6a81a) feat(core): catalog messages for the Lab media player's visible time readouts (#11649)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；mediaPlayer 命名空间列入 coverage.mjs
- [x] [`da710f6ed`](https://github.com/meta/astryx/commit/da710f6ed) fix(Stepper): a disabled step in the compact layout says it is unavailable (#11632)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；step.status.unavailable 暂列 coverage.mjs
- [x] [`a3406b55c`](https://github.com/meta/astryx/commit/a3406b55c) chore(scripts): the CLDR weekday generator stops with a clear error on a Node without full locale data (#11902)
  - 不适用：上游仓库脚本（自动初筛）
- [x] [`e80124133`](https://github.com/meta/astryx/commit/e80124133) fix(cli): icon finder answers with no icon set and honors the chosen look (#12131)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4d42236bc`](https://github.com/meta/astryx/commit/4d42236bc) feat(cli): experimental icon search answers phrases and export names (#12138)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2c80ffc20`](https://github.com/meta/astryx/commit/2c80ffc20) feat(cli): an installed icon-set package turns on the experimental icon features (one gate) (#12176)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`86b073364`](https://github.com/meta/astryx/commit/86b073364) feat(cli): doctor names icon imports that no longer match the app's icon sets (#12194)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`2ff1afc9f`](https://github.com/meta/astryx/commit/2ff1afc9f) fix(richtext): text reads the way it is written, in either document direction (#7723)
  - 暂缓：首强方向分类器的调整只服务 RichText 按块定方向，Vue 版 richtext 还没有块方向插件
- [x] [`b2cf0a1ad`](https://github.com/meta/astryx/commit/b2cf0a1ad) feat(cli): search lists the installed icons that answer an icon ask (#12183)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4f0a13a60`](https://github.com/meta/astryx/commit/4f0a13a60) feat(cli): where icon features are on, the agent block sends agents to the icon finder (#12210)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`0f3ed13d4`](https://github.com/meta/astryx/commit/0f3ed13d4) feat(cli): search lists no icons for "with an icon" when the results answer a component (#12305)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ce3eb6270`](https://github.com/meta/astryx/commit/ce3eb6270) [experimental] cli: discover lists icon packs before an app picks one (#12220)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
  - 已移植：[#510](https://github.com/astryx-vue/astryx-vue/pull/510)。按基础展示族结论：Icon 等六处
- [x] [`f672a82de`](https://github.com/meta/astryx/commit/f672a82de) chore(core): the internal touch entry exposes group press tracking to Lab (#11283)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐
- [x] [`83424673c`](https://github.com/meta/astryx/commit/83424673c) chore: land batch 16 (6 pull requests) (#12881)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`9dacfbd03`](https://github.com/meta/astryx/commit/9dacfbd03) fix(TextInput, TextArea): an error without a message gives assistive technology text (#12468)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；field.errorFallback 暂列 coverage.mjs（输入框行为不在本族清单）
- [x] [`972102325`](https://github.com/meta/astryx/commit/972102325) fix(Timestamp): a relative name starts with the words it shows (#12222)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；timestamp.relativeLabel 暂列 coverage.mjs
- [x] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
  - 已移植：[#534](https://github.com/astryx-vue/astryx-vue/pull/534)。InternationalizationProvider 缺 locale 时开发期抛错并给出改法，补测试；AST-084 规格改动属上游 CLI
- [x] [`3344f149a`](https://github.com/meta/astryx/commit/3344f149a) fix(ChatComposerInput): the trigger menu's no-results message comes from the catalog (#12677)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。新键 chatTriggerMenu.noResults 接入 chat.noResults
- [x] [`4e35a9856`](https://github.com/meta/astryx/commit/4e35a9856) spec(internationalization): a component takes a prop for each string callers reword; provider overrides are an app-wide escape hatch (#12675)
  - 已移植：[#534](https://github.com/astryx-vue/astryx-vue/pull/534)。provider 文档说明改一个组件的措辞用组件自己的属性，overrides 是全应用的兜底，覆盖示例改名为「Change one Astryx string across your app」
- [x] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c1f52ff91`](https://github.com/meta/astryx/commit/c1f52ff91) perf(core): reading the locale or direction does not load the message parser (#12975)
  - Vue 版已有：useLocale、useLocaleDirection 只读 provide 的语言和方向，不引入 ICU 解析器
- [x] [`dacc31737`](https://github.com/meta/astryx/commit/dacc31737) chore: land batch 72 (9 pull requests) (#12965)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；useListFormatter 的注释改动无对应行为
- [x] [`9d23a5e6e`](https://github.com/meta/astryx/commit/9d23a5e6e) chore: land batch 87 (2 pull requests) (#13021)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`66b2932af`](https://github.com/meta/astryx/commit/66b2932af) fix(Markdown): a heading copy link shows and announces a failed copy (#10424)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。en.json 已对齐；markdownHeadingLinks.copyFailed 暂列 coverage.mjs

## 工程质量与同步基础设施（area:sync）

### v0.7.2

- [x] [`198a7e3ff`](https://github.com/meta/astryx/commit/198a7e3ff) test(a11y): add Menu contract and bind the DropdownMenu pointer menu (#7636)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`29fc5f906`](https://github.com/meta/astryx/commit/29fc5f906) test(a11y): add Toolbar contract and bind Toolbar (#7731)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.3

- [x] [`54b15c623`](https://github.com/meta/astryx/commit/54b15c623) test(a11y): add hover and pointerAway to the accessibility harness (#7828)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`ca4f3b282`](https://github.com/meta/astryx/commit/ca4f3b282) test(a11y): add Tooltip contract and bind Tooltip (#7799)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`7370328f6`](https://github.com/meta/astryx/commit/7370328f6) spec(AST-009): real-AT evidence never gates merge or release (#7915)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.4

- [x] [`0c1a6e860`](https://github.com/meta/astryx/commit/0c1a6e860) test(a11y): add Progressbar contract and bind ProgressBar and CircularProgress (#7919)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.5

- [x] [`be8e7208c`](https://github.com/meta/astryx/commit/be8e7208c) test(a11y): add Table contract and bind Table (#7695)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`d695efb56`](https://github.com/meta/astryx/commit/d695efb56) fix(Switch): the focus ring follows the input through a sibling, not a :has() scan (#8415)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`46cbe74d9`](https://github.com/meta/astryx/commit/46cbe74d9) test(interaction): real touch input for browser interaction proofs (#8043)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`99ad3f6d9`](https://github.com/meta/astryx/commit/99ad3f6d9) test(interaction): curve oracles for animation proofs (#8462)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`52c1b24fb`](https://github.com/meta/astryx/commit/52c1b24fb) test: use placeholder URLs in fixtures (#8486)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`4444d70bd`](https://github.com/meta/astryx/commit/4444d70bd) test(interaction): curve sampling (#8044)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`42a30b47e`](https://github.com/meta/astryx/commit/42a30b47e) feat(interaction): animation-state waits for interaction proofs (#8505)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`d07518f92`](https://github.com/meta/astryx/commit/d07518f92) test(interaction): deterministic storyboards (#8348)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`056b591f0`](https://github.com/meta/astryx/commit/056b591f0) spec(AST-020): reversible toggles may complete after a slide-off (FR9, DEC-5) (#8556)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`6ecbf415d`](https://github.com/meta/astryx/commit/6ecbf415d) test(interaction): frame evidence (#8045)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：上游内部规范和架构文档、上游内部工具包（自动初筛）
- [x] [`acda0a187`](https://github.com/meta/astryx/commit/acda0a187) feat(interaction): Chromium rendering traces, the compositor presentation record and the long-task log (#8548)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.6

- [x] [`d48bca59b`](https://github.com/meta/astryx/commit/d48bca59b) test(interaction-harness): wheel and pen input drivers for every-pointer proofs (#8666)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`8bb30b553`](https://github.com/meta/astryx/commit/8bb30b553) test(interaction-harness): a busy-window proof can judge a component against a compositor-only control (#8906)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`cdb298854`](https://github.com/meta/astryx/commit/cdb298854) test(interaction-harness): the WebKit container lifts podman's process cap, which eight workers reached (#8912)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`2b49202d8`](https://github.com/meta/astryx/commit/2b49202d8) fix(interaction-harness): a WebKit wheel burst is timed by when the page received each step (#9099)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`e03042b58`](https://github.com/meta/astryx/commit/e03042b58) fix(interaction-harness): evidence reaches the report without a file copy inside the test (#9066)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`aeb0e7757`](https://github.com/meta/astryx/commit/aeb0e7757) fix(interaction-harness): a finished run is dated by its start at its finish, and the backward self-test checks dates to a millisecond (#8535)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`0c02f46d5`](https://github.com/meta/astryx/commit/0c02f46d5) test(interaction-harness): the compositor-record self-test holds up on a loaded runner (#9091)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`f2a818b5f`](https://github.com/meta/astryx/commit/f2a818b5f) test(interaction-harness): the held-end self-test runs its animations long enough for its holds to reach them (#9110)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`9a8f60dd7`](https://github.com/meta/astryx/commit/9a8f60dd7) test(interaction-harness): the later-hold self-test separates its runs' starts on a starved page (#9107)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`47dd87e3d`](https://github.com/meta/astryx/commit/47dd87e3d) fix(interaction-harness): a run held while its resume is pending keeps its place at any playback rate (#9109)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`0bd3b3799`](https://github.com/meta/astryx/commit/0bd3b3799) chore(sandbox): fixed real-Chromium perf scenes and a driver that measures them (#9194)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`60d02475b`](https://github.com/meta/astryx/commit/60d02475b) test(harness): the WebKit touch self-test checks what holds under load (#9185)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`57688d767`](https://github.com/meta/astryx/commit/57688d767) test(harness): a wheel gap is the page's only when the page widened it past the send spacing (#9215)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`3a2d3d97b`](https://github.com/meta/astryx/commit/3a2d3d97b) test(harness): busyWindowProof reads a slow tail inside a fast window locally (#9233)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`66c0d38dc`](https://github.com/meta/astryx/commit/66c0d38dc) test(harness): correct #9185's load numbers under LP_NUM_THREADS (#9244)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`efb6b3044`](https://github.com/meta/astryx/commit/efb6b3044) test(BottomSheet): check the handoff's scrim and focus with the handoff held (#9235)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`af268d369`](https://github.com/meta/astryx/commit/af268d369) test(harness): the animation recorder names a CSS run that starts and finishes between frames, and dates one the page cancels at its end (#9257)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`ad38e6d2f`](https://github.com/meta/astryx/commit/ad38e6d2f) test(interaction-harness): a hold the page arms itself takes a short animation on its first frame (#9230)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`64ed81235`](https://github.com/meta/astryx/commit/64ed81235) feat(interaction): cast filmstrips, rect sampling, a Storybook highlight default and the WebKit shader cache (#8549)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.7

- [x] [`0d1ddcd4e`](https://github.com/meta/astryx/commit/0d1ddcd4e) fix(harness): a main-thread block reports the span its own loop measured (#9652)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`14550c050`](https://github.com/meta/astryx/commit/14550c050) test(harness): a page freeze, so a proof can act at an instant of the scene's own time (#9698)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.8

- [x] [`a24f7e01b`](https://github.com/meta/astryx/commit/a24f7e01b) test(interaction-harness): openStory returns once Storybook has finished the story's render (#9772)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`547d90a59`](https://github.com/meta/astryx/commit/547d90a59) test(interaction-harness): a busy proof can bound its settle in the cast's own steps (#9545)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`9a74db415`](https://github.com/meta/astryx/commit/9a74db415) test(interaction-harness): a late block throws BusyWindowTooLateError (#9505)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`83e451075`](https://github.com/meta/astryx/commit/83e451075) test(interaction-harness): the transition-delay wait case checks the read the wait answered on (#9528)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`d0171bfc4`](https://github.com/meta/astryx/commit/d0171bfc4) test(interaction-harness): the frame-evidence trace judges one layout per frame the page drew (#9456)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`c239dafbd`](https://github.com/meta/astryx/commit/c239dafbd) test(interaction-harness): a busy-window control clock and a marker search in a region (#9872)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`b8f2a9fee`](https://github.com/meta/astryx/commit/b8f2a9fee) test(interaction-harness): two page-freeze cases wait for the frame (#9873)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`3b41e2c2e`](https://github.com/meta/astryx/commit/3b41e2c2e) test(interaction-harness): a traced long task carries its thread time (#9874)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`b35fe8380`](https://github.com/meta/astryx/commit/b35fe8380) test(interaction-harness): a paced touch play keeps its spacing after a stalled dispatch and reads the release the page read (#9725)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.9

- [x] [`8a74c58fe`](https://github.com/meta/astryx/commit/8a74c58fe) test(a11y-spec): a pointer's reach is counted in rendered frames (#9751)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`158bc21a6`](https://github.com/meta/astryx/commit/158bc21a6) test(interaction-harness): the page-freeze proof reads the page's clock (#9951)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`273031c7f`](https://github.com/meta/astryx/commit/273031c7f) fix(interaction): the animation recorder stands down while a trace runs (#8446)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`d0cf29a20`](https://github.com/meta/astryx/commit/d0cf29a20) test(interaction-harness): a trace waits out the recorder's last frame (#9962)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`2d8681789`](https://github.com/meta/astryx/commit/2d8681789) test(interaction): a fine-pointer page that really reads (pointer: fine) (#8345)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`ffa495bee`](https://github.com/meta/astryx/commit/ffa495bee) test(interaction-harness): a WebKit touch play that does not watch each step waits for each answer, so no gap reaches the page more than 2 ms short (#9956)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`07992bbac`](https://github.com/meta/astryx/commit/07992bbac) test(interaction-harness): a busy proof excuses a hold at the block's start only at the position the page set (#9467)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`67ca4f841`](https://github.com/meta/astryx/commit/67ca4f841) ci: run the WebKit interaction legs in Playwright's image, with no apt install (#10013)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`6fc2bfffa`](https://github.com/meta/astryx/commit/6fc2bfffa) test(interaction-harness): sampleCurve samples a ::before or ::after (#10052)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`828bc9b9a`](https://github.com/meta/astryx/commit/828bc9b9a) test(interaction-harness): a busy proof reads a held frame's run pace under any settle bound (#10044)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`f384e62f5`](https://github.com/meta/astryx/commit/f384e62f5) docs(useIcon): add hook docs and a status row example block (#9900)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`0200dfe0f`](https://github.com/meta/astryx/commit/0200dfe0f) test(core): BottomSheet detents, proven with the interaction harness (#10055)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`c33656a06`](https://github.com/meta/astryx/commit/c33656a06) test(motion): the busy spring proof reads every frame, with a second control half a leg ahead (#10099)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`c077bf308`](https://github.com/meta/astryx/commit/c077bf308) test(interaction-harness): judge rect sampling by the page's own frames (#10144)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.10

- [x] [`7e0e78eda`](https://github.com/meta/astryx/commit/7e0e78eda) test(interaction-harness): the frozen arm shows only pre-block steps (#10189)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`a0d34e740`](https://github.com/meta/astryx/commit/a0d34e740) test(interaction-harness): size the self-test's blocks from its cadence (#10209)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`fef4d91ea`](https://github.com/meta/astryx/commit/fef4d91ea) fix(interaction-harness): record a run the page cancels as ended (#10243)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.11

- [x] [`d98f4ea5f`](https://github.com/meta/astryx/commit/d98f4ea5f) test(harness): a pooled busy proof leaves out a starved run by name (#10318)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`b07a83228`](https://github.com/meta/astryx/commit/b07a83228) test(core): the glide keeps advancing through a blocked main thread (#10229)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`75a9c1776`](https://github.com/meta/astryx/commit/75a9c1776) chore(harness): trackBrightness reads a colour channel per frame (#10377)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`27aba94e8`](https://github.com/meta/astryx/commit/27aba94e8) test(core): the busy glide proof reads each glide on its own timeline (#10396)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`2b5c23c30`](https://github.com/meta/astryx/commit/2b5c23c30) test(interaction-harness): a page stall names the page's wall time (#10405)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`28270c143`](https://github.com/meta/astryx/commit/28270c143) test(interaction-harness): an armed hold names the motion it judges (#10386)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`f60ec600e`](https://github.com/meta/astryx/commit/f60ec600e) test(interaction-harness): a wheel page stall names its wall time (#10410)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.12

- [x] [`230199125`](https://github.com/meta/astryx/commit/230199125) test(interaction-harness): hold a lift until a time after the thaw (#10352)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`993e1fa1b`](https://github.com/meta/astryx/commit/993e1fa1b) test(interaction-harness): the WebKit container gets CI's CPU limits (#10336)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`fa40f7148`](https://github.com/meta/astryx/commit/fa40f7148) test(interaction-harness): the frame-evidence proof fits the compositor (#10451)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`2bf084d6f`](https://github.com/meta/astryx/commit/2bf084d6f) test(interaction-harness): a block can start on a pseudo-element (#10460)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`376dadba5`](https://github.com/meta/astryx/commit/376dadba5) test(interaction-harness): a marker read under a pixel (#10475)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`ca88398ad`](https://github.com/meta/astryx/commit/ca88398ad) test(interaction-harness): every WebKit touch play judges the release its page read (#10383)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`6706e0177`](https://github.com/meta/astryx/commit/6706e0177) test(interaction-harness): a proof starved of frames fails by name (#10456)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`8484dc4ff`](https://github.com/meta/astryx/commit/8484dc4ff) test(interaction-harness): a pool leaves out a run that began too late (#10464)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`07cc0fd5d`](https://github.com/meta/astryx/commit/07cc0fd5d) test(interaction-harness): a traced Paint names the node it painted (#10486)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`8e997b5da`](https://github.com/meta/astryx/commit/8e997b5da) test(interaction-harness): read a WebKit lift at its touchend (#10508)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`9ba054880`](https://github.com/meta/astryx/commit/9ba054880) test(interaction-harness): a starved waitForRest fails by name (#10505)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`ed2fd36d6`](https://github.com/meta/astryx/commit/ed2fd36d6) test(interaction-harness): judge an entrance from its first frame (#10572)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`7a1c0d648`](https://github.com/meta/astryx/commit/7a1c0d648) test(interaction-harness): a lift stall comes before a pacing error (#10530)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`10acb8c1c`](https://github.com/meta/astryx/commit/10acb8c1c) test(interaction-harness): a long task is the page's own work (#10510)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`b87846c1d`](https://github.com/meta/astryx/commit/b87846c1d) test(interaction-harness): judge a play at the component's thresholds (#10501)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`bb3a4b2ae`](https://github.com/meta/astryx/commit/bb3a4b2ae) test(interaction-harness): read a WebKit lift at its pointerup (#10585)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`cd215c780`](https://github.com/meta/astryx/commit/cd215c780) test(interaction-harness): cast self-tests wait for frames, not a time (#10546)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`d61a84acb`](https://github.com/meta/astryx/commit/d61a84acb) test(interaction-harness): hold a finger down through a page freeze (#10569)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`ac0046c53`](https://github.com/meta/astryx/commit/ac0046c53) test(interaction-harness): blockMainThread picks the animation it holds (#10541)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`f9981429b`](https://github.com/meta/astryx/commit/f9981429b) test(Layer): the entrance layout proof names the source of a layout (#10684)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`c590f9bba`](https://github.com/meta/astryx/commit/c590f9bba) test(interaction-harness): name a touch's wait apart from its listeners (#10589)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`5490c7c50`](https://github.com/meta/astryx/commit/5490c7c50) test(interaction-harness): share settlesAt with waitForRest's deadline (#10606)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`9acc1b449`](https://github.com/meta/astryx/commit/9acc1b449) test(interaction-harness): no wheel re-takes; delete retakeOnWheelPacing (#10549)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`53eb45131`](https://github.com/meta/astryx/commit/53eb45131) test(interaction-harness): wait for a cast frame presented after a time (#10558)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`c096afe1c`](https://github.com/meta/astryx/commit/c096afe1c) test(interaction-harness): a starved busy proof fails by name (#10565)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`833388f15`](https://github.com/meta/astryx/commit/833388f15) fix(interaction-harness): the recorder reads no run at its end in traces (#10730)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`ed586883d`](https://github.com/meta/astryx/commit/ed586883d) test(interaction-harness): name a wheel gap with no page frame across it (#10594)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`3e27971f3`](https://github.com/meta/astryx/commit/3e27971f3) test(interaction-harness): a busy proof stops where its curve falls back (#10766)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`5c336a54b`](https://github.com/meta/astryx/commit/5c336a54b) test(interaction-harness): a busy proof names a frame it cannot judge (#10765)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`fa30cff13`](https://github.com/meta/astryx/commit/fa30cff13) test(interaction-harness): mark touch listener starts before a story (#10633)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`738919b23`](https://github.com/meta/astryx/commit/738919b23) test(Lightbox): the busy page-settle pool fails by name when too slow (#10770)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`566106846`](https://github.com/meta/astryx/commit/566106846) test(interaction-harness): name a hold's gone scope and cancelled run (#10773)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`a1dabb30c`](https://github.com/meta/astryx/commit/a1dabb30c) fix(interaction-harness): WebKit busy proofs date frames on the controls (#10772)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`bd57e0a91`](https://github.com/meta/astryx/commit/bd57e0a91) test(interaction-harness): too little to judge is named starvation (#10788)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`86fcdd3f0`](https://github.com/meta/astryx/commit/86fcdd3f0) test(interaction-harness): a busy proof judges each predicted move (#10812)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`f36bd72b8`](https://github.com/meta/astryx/commit/f36bd72b8) test(a11y): Slider (Multi-Thumb) contract and range Slider binding (#10830)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`f124c2f3d`](https://github.com/meta/astryx/commit/f124c2f3d) test(interaction-harness): name a touch play the runner starved (#10551)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`eee8f1d8d`](https://github.com/meta/astryx/commit/eee8f1d8d) test(interaction-harness): a Chromium busy proof dates its frames (#10887)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`8e8bf91ba`](https://github.com/meta/astryx/commit/8e8bf91ba) test(interaction-harness): a late hand-off reads the caught start (#10888)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`e171d97c0`](https://github.com/meta/astryx/commit/e171d97c0) test(interaction-harness): a storyboard capture is taken once (#10579)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`3239571ce`](https://github.com/meta/astryx/commit/3239571ce) test(interaction-harness): a wheel burst splits at a gap of maxGapMs (#10782)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`f6d2c3168`](https://github.com/meta/astryx/commit/f6d2c3168) test(interaction-harness): name blockMainThread's gone during element (#10785)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`096f46067`](https://github.com/meta/astryx/commit/096f46067) test(interaction-harness): a late block names the run that already ended (#10790)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.13

- [x] [`81e8ce68a`](https://github.com/meta/astryx/commit/81e8ce68a) test(PageControl): a jog slowed by a stalled page fails by name (#10993)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`fd5cf0df9`](https://github.com/meta/astryx/commit/fd5cf0df9) test(interaction-harness): each trackMarkers color may have a region (#10808)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.14

- [x] [`456902770`](https://github.com/meta/astryx/commit/456902770) test(interaction-harness): waitForRest names a starved frame that moves (#10787)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`ce8663d8d`](https://github.com/meta/astryx/commit/ce8663d8d) test(interaction-harness): a block's window reads the time origin once (#11067)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`0b8549059`](https://github.com/meta/astryx/commit/0b8549059) test(interaction-harness): name a double tap the page read as two taps (#10916)
  - 不适用：上游内部工具包（自动初筛）
- [x] [`e01c68b9c`](https://github.com/meta/astryx/commit/e01c68b9c) feat(SegmentedControl): a drag that drifts off keeps choosing (#10978)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.15

- [x] [`b8335ba86`](https://github.com/meta/astryx/commit/b8335ba86) test(interaction-harness): a held tap's verdict reads the page's frames (#11302)
  - 不适用：上游内部工具包（自动初筛）

### v0.7.17

- [x] [`64806d0bd`](https://github.com/meta/astryx/commit/64806d0bd) test(Item): the swipe's busy proof judges a held release by its curve (#11735)
  - 不适用：上游内部工具包（自动初筛）

## 基础输入框（area:core）

### v0.7.2

- [ ] [`1c8993588`](https://github.com/meta/astryx/commit/1c8993588) [Component Audit] Field: preserve horizontal form semantics (#7655)
- [ ] [`0da784d3c`](https://github.com/meta/astryx/commit/0da784d3c) docs(FieldLabel): expose complete label contract (#7727)
- [ ] [`081cceaf6`](https://github.com/meta/astryx/commit/081cceaf6) fix(FormLayout): keep direction metadata authoritative (#7785)
- [ ] [`6c792d8f8`](https://github.com/meta/astryx/commit/6c792d8f8) [Component Audit] FormLayout: make layout behavior and theming evidence trustworthy (#7784)

### v0.7.3

- [x] [`7b6691327`](https://github.com/meta/astryx/commit/7b6691327) spec(AST-085): disabled controls stay focusable (#7793)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4b0b8f656`](https://github.com/meta/astryx/commit/4b0b8f656) fix(core): choice controls stay focusable when disabled (#7824)
- [x] [`31e06f44a`](https://github.com/meta/astryx/commit/31e06f44a) spec(AST-086): status announcements have one owner and use the shared channel (#7792)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`7370328f6`](https://github.com/meta/astryx/commit/7370328f6) spec(AST-009): real-AT evidence never gates merge or release (#7915)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`0a4c894d5`](https://github.com/meta/astryx/commit/0a4c894d5) fix(ChatSystemMessage): leave notices inside a chat log to the log (#7869)
  - 不适用：只改上游测试（自动初筛）

### v0.7.4

- [ ] [`2b60fa6fd`](https://github.com/meta/astryx/commit/2b60fa6fd) fix(inputs): silence the busy Spinner and announce the busy start once (TextInput, TextArea, Selector, MultiSelector) (#7920)
- [ ] [`88ec018ca`](https://github.com/meta/astryx/commit/88ec018ca) fix(FileInput): silence the busy Spinner and announce the busy start once (#7954)

### v0.7.5

- [ ] [`d4f09c26d`](https://github.com/meta/astryx/commit/d4f09c26d) fix(TextInput,TextArea): a disabled field stays in the tab order (#8018)
- [ ] [`92697387b`](https://github.com/meta/astryx/commit/92697387b) fix(NumberInput): a disabled field stays in the tab order (#8099)
- [ ] [`cd53c2dbf`](https://github.com/meta/astryx/commit/cd53c2dbf) fix(TextInput,NumberInput): tapping the clear button brings up the iOS keyboard (#8183)
- [ ] [`ad8af75ab`](https://github.com/meta/astryx/commit/ad8af75ab) fix(core): taps that start typing raise the touch keyboard (#8158)
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b023d1c82`](https://github.com/meta/astryx/commit/b023d1c82) spec(AST-102): typography stays theme-owned, and a text size the person set wins (#8351)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`6b46afaa9`](https://github.com/meta/astryx/commit/6b46afaa9) fix(InputGroup): propagate disabled state to inputs and addons (#8414)
- [ ] [`e9b3f3eda`](https://github.com/meta/astryx/commit/e9b3f3eda) fix(InputGroup): the group edge rules name members, not a universal selector (#8438)
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [x] [`dbcfc30f7`](https://github.com/meta/astryx/commit/dbcfc30f7) docs(spec): TextInput records its shipped contract as current (#8495)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`71601aa21`](https://github.com/meta/astryx/commit/71601aa21) docs(spec): NumberInput records its shipped contract as current (#8525)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`8a13f3d2e`](https://github.com/meta/astryx/commit/8a13f3d2e) docs(spec): Tokenizer records the experimental touch sheet presentation (DEC-3) (#7976)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b4b5faefd`](https://github.com/meta/astryx/commit/b4b5faefd) docs(spec): TimeInput records its shipped contract as current (#8541)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`54fbccb27`](https://github.com/meta/astryx/commit/54fbccb27) feat(core): Tokenizer touch sheet behind experimental.presentation (#7977)
- [ ] [`f30564c28`](https://github.com/meta/astryx/commit/f30564c28) fix(NumberInput): keep a caller aria-labelledby on the input (#8708)
- [x] [`b8fd8615d`](https://github.com/meta/astryx/commit/b8fd8615d) docs(spec): InputGroup records its shipped contract as current (#8668)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`8f6f0008f`](https://github.com/meta/astryx/commit/8f6f0008f) docs(spec): TextArea records its shipped contract as current (#8731)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`c86dc620c`](https://github.com/meta/astryx/commit/c86dc620c) fix(i18n): catch formatter returns and localize helper text (#7849)
- [x] [`d4de65a77`](https://github.com/meta/astryx/commit/d4de65a77) docs(spec): CheckboxList records its shipped contract as current (#8765)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`6906bebed`](https://github.com/meta/astryx/commit/6906bebed) docs(spec): RadioList records its shipped contract as current (#8773)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`abf8f465f`](https://github.com/meta/astryx/commit/abf8f465f) docs(spec): FormLayout records its shipped contract as current (#8806)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`aaf573b10`](https://github.com/meta/astryx/commit/aaf573b10) fix(FileInput): return focus to the trigger, not the aria-hidden native input, after a clear (#8799)
- [ ] [`a8374b5c5`](https://github.com/meta/astryx/commit/a8374b5c5) fix(TextInput): keep a caller aria-labelledby on the input (#8707)
- [x] [`75fa3c9ea`](https://github.com/meta/astryx/commit/75fa3c9ea) docs(spec): Field records its shipped contract as current (#8809)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.6

- [x] [`a7ecf842f`](https://github.com/meta/astryx/commit/a7ecf842f) docs(spec): DateTimeInput records its shipped contract as current (#8878)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`e4b225eb5`](https://github.com/meta/astryx/commit/e4b225eb5) fix(NumberInput): hide compact steppers on coarse pointers (#8015)
- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [ ] [`afcea1552`](https://github.com/meta/astryx/commit/afcea1552) fix(FileInput, Slider): convey required under FormLayout defaultOptionality (#9053)
- [ ] [`64caf1dd0`](https://github.com/meta/astryx/commit/64caf1dd0) fix(TextArea): the character counter comes from one catalog message (#9025)
- [ ] [`18be9cb58`](https://github.com/meta/astryx/commit/18be9cb58) fix(TextInput): keep the clear button in place when the field turns busy (#9027)
- [ ] [`75001c5b4`](https://github.com/meta/astryx/commit/75001c5b4) fix(TextArea, Typeahead, Tokenizer): keep the field's label with a caller aria-labelledby (#8862)
- [ ] [`faee47927`](https://github.com/meta/astryx/commit/faee47927) fix(TimeInput, DateTimeInput): time text follows the locale's hour cycle and day periods (#9022)
- [ ] [`d7ecbcb48`](https://github.com/meta/astryx/commit/d7ecbcb48) fix(NumberInput): keep Tab's select-all when formatValue swaps the text (#9033)
- [x] [`d29a10977`](https://github.com/meta/astryx/commit/d29a10977) docs(spec): DateInput records its shipped contract as current (#9128)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f52dbbefb`](https://github.com/meta/astryx/commit/f52dbbefb) fix(Typeahead, Tokenizer): the combobox exposes its required and invalid state (#9034)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`5b5ae2d79`](https://github.com/meta/astryx/commit/5b5ae2d79) fix(FileInput): every rejected file is named in the status message (#9043)
- [ ] [`941ad9648`](https://github.com/meta/astryx/commit/941ad9648) [Component Audit] FieldStatus: long validation messages wrap inside narrow fields (#9126)
- [ ] [`ccb1a52b1`](https://github.com/meta/astryx/commit/ccb1a52b1) [Component Audit] FileInput: a tooltip status stays reachable in dropzone and while uploading (#9134)
- [x] [`a58781354`](https://github.com/meta/astryx/commit/a58781354) docs(spec): MultiSelector records its shipped contract as current (#9133)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`cfbc66fb7`](https://github.com/meta/astryx/commit/cfbc66fb7) fix(FieldLabel): a tap on the label's info icon opens its help without activating the control (#9089)
- [ ] [`67613a7ea`](https://github.com/meta/astryx/commit/67613a7ea) refactor(NumberInput): re-select the editable text in the focus handler (#9150)
- [ ] [`c829c09ca`](https://github.com/meta/astryx/commit/c829c09ca) fix(FileInput): prevent file selection while busy (#9167)
- [x] [`11701a466`](https://github.com/meta/astryx/commit/11701a466) test(FileInput): the audit expects a loading trigger to be aria-disabled (#9210)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1d8696ad9`](https://github.com/meta/astryx/commit/1d8696ad9) spec: Tooltip and HoverCard pin on press; InfoTip is the info preset (#9175)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
- [ ] [`4f35412e2`](https://github.com/meta/astryx/commit/4f35412e2) fix(ChatComposerInput): a tap on a pasted-text token opens its preview without raising the keyboard (#9189)
- [ ] [`ac6ac2250`](https://github.com/meta/astryx/commit/ac6ac2250) fix(FileInput): a caller's aria props reach the trigger, not only the hidden input (#9031)
- [ ] [`8f345cba4`](https://github.com/meta/astryx/commit/8f345cba4) feat(FieldStatus): deprecate the tooltip variant; field controls keep statusVariant="tooltip" (#9196)
- [ ] [`0135af462`](https://github.com/meta/astryx/commit/0135af462) fix(core N–Z): slots use isRenderable; the remaining checks are allowed with a reason (#9206)
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`8a03d7514`](https://github.com/meta/astryx/commit/8a03d7514) chore(FileInput): format the source with the repository's Prettier settings (#9263)
- [ ] [`554e9bc14`](https://github.com/meta/astryx/commit/554e9bc14) docs(FileInput): dropzone mode does not offer attached status placement (#9258)
- [ ] [`1408785fd`](https://github.com/meta/astryx/commit/1408785fd) fix(Typeahead, Tokenizer): a disabled field keeps its tab stop (#9275)
- [x] [`0fad9d216`](https://github.com/meta/astryx/commit/0fad9d216) test(rtl): RTL coverage for Blockquote, InputGroupText and Overlay (#9309)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`75094f759`](https://github.com/meta/astryx/commit/75094f759) docs(spec): ComplexSelector records its shipped contract as current (#9345)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3d44c583a`](https://github.com/meta/astryx/commit/3d44c583a) fix(Tooltip, HoverCard): a press inside an open surface doesn't activate the card, row or field around it (#9252)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
- [ ] [`a8356288e`](https://github.com/meta/astryx/commit/a8356288e) fix(Field): export FieldStatusPlacement from the package entry (#9368)
- [ ] [`789197bba`](https://github.com/meta/astryx/commit/789197bba) fix(Field): a focused field shows its focus under forced colors (#9392)
- [ ] [`e3bd3d547`](https://github.com/meta/astryx/commit/e3bd3d547) fix(ButtonGroup, InputGroup): the last-member rule is :nth-last-child(1 of S), not a sibling-relative :has() (#9394)
- [x] [`e64b41bfc`](https://github.com/meta/astryx/commit/e64b41bfc) spec(TextInput, TextArea, search, ChatComposer): touch keyboard props and return-key defaults (#9424)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
- [ ] [`99b8ede25`](https://github.com/meta/astryx/commit/99b8ede25) fix(TextArea, TextInput): the start icon slot follows the shared presence check (#9443)
- [ ] [`ce052bf0a`](https://github.com/meta/astryx/commit/ce052bf0a) fix(Field): a focusable disabled field shows its focus under forced colors (#9410)
- [ ] [`ed4b4afc0`](https://github.com/meta/astryx/commit/ed4b4afc0) feat(TextInput,TextArea): tell a touch keyboard what the field holds (#8166)

### v0.7.7

- [ ] [`d0b6e0f77`](https://github.com/meta/astryx/commit/d0b6e0f77) feat(core): search fields ask a touch keyboard for its Search key and no autocorrection (#8157)
- [ ] [`4f452f927`](https://github.com/meta/astryx/commit/4f452f927) feat(Tokenizer): the touch sheet presentation is public behind experimental.presentation, and the sheet edits a draft that Save commits (#9708)

### v0.7.8

- [ ] [`30160f5ce`](https://github.com/meta/astryx/commit/30160f5ce) feat(core): PowerSearch touch sheet flow behind experimental.presentation (#8001)
- [ ] [`4b7546d3b`](https://github.com/meta/astryx/commit/4b7546d3b) fix(CheckboxInput, Switch): a form's required default no longer marks an unchecked box or off switch required (#9664)
- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [x] [`dcf3d6f86`](https://github.com/meta/astryx/commit/dcf3d6f86) feat(Tokenizer): presentation is a stable prop, and adaptive is its default (#9796)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`41cce0b0a`](https://github.com/meta/astryx/commit/41cce0b0a) fix(core): a disabled Slider no longer runs a caller's handlers (#9729)
- [x] [`65516e649`](https://github.com/meta/astryx/commit/65516e649) spec(AST-099): Core text inputs stay above the on-screen keyboard (#9750)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [x] [`e3d2b4599`](https://github.com/meta/astryx/commit/e3d2b4599) docs(AST-099, input-fields): FR3 and FR13 point at FR9's app-bar rule (#9863)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`0a039e7c9`](https://github.com/meta/astryx/commit/0a039e7c9) fix(FileInput): a busy or disabled dropzone refuses the drag with the no-drop cursor (#9946)
- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`cfd25ced9`](https://github.com/meta/astryx/commit/cfd25ced9) [Component Audit] InputGroup: docs match what status and focus do, and the joined row is proven in a browser (#9979)
- [x] [`6089ee62e`](https://github.com/meta/astryx/commit/6089ee62e) docs(InputGroup): the verification map and status paint match main (#10003)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`57aa93cb4`](https://github.com/meta/astryx/commit/57aa93cb4) feat(NumberInput): a held stepper repeats into the draft, commits once (#8205)
- [x] [`da771b3e5`](https://github.com/meta/astryx/commit/da771b3e5) chore(Tokenizer): docs examples, blocks and templates follow the adaptive default (#9883)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`35739da7e`](https://github.com/meta/astryx/commit/35739da7e) [Component Audit] InputGroupText: the docs example no longer reads the field name twice, and the cell is proven in a browser (#10071)
- [x] [`1ef21f898`](https://github.com/meta/astryx/commit/1ef21f898) fix(Spinner): route standalone loading through the shared announcement channel (#7910)
  - 不适用：只改上游测试（自动初筛）

### v0.7.10

- [ ] [`2d316a45f`](https://github.com/meta/astryx/commit/2d316a45f) docs(FieldStatus): a repeated failed submit is the form's occasion to announce (#10122)
- [ ] [`711acc68b`](https://github.com/meta/astryx/commit/711acc68b) fix(FieldLabel): labelTooltip is an InfoTip button after the label, reachable by keyboard and screen readers (#6414)

### v0.7.11

- [x] [`b3bbc3856`](https://github.com/meta/astryx/commit/b3bbc3856) fix(Selector): a searchable trigger's name carries the selected value (#10170)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`c57465add`](https://github.com/meta/astryx/commit/c57465add) docs(core): FormLayout says to wrap it in a native form (#10349)
- [x] [`ff939deda`](https://github.com/meta/astryx/commit/ff939deda) docs(InputGroupText): point verification at the tests that closed its gaps (#10103)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)

### v0.7.12

- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`619ffeb27`](https://github.com/meta/astryx/commit/619ffeb27) fix(core, richtext): no focus fade on text fields under a coarse pointer (#10611)
- [x] [`e6bb83cc9`](https://github.com/meta/astryx/commit/e6bb83cc9) test(core): judge the mouse focus fade from held reads, not frames (#10735)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a04d2e6bf`](https://github.com/meta/astryx/commit/a04d2e6bf) fix(Toast): the viewport is each toast's only announcement owner (#7871)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`bb0786673`](https://github.com/meta/astryx/commit/bb0786673) fix(TextInput): dispatch changeAction and update optimistic value on clear (#6425)
- [ ] [`1f9217f0c`](https://github.com/meta/astryx/commit/1f9217f0c) fix(Selector): a required search Selector puts aria-required where it is allowed (#10878)

### v0.7.14

- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [ ] [`afa75c2e8`](https://github.com/meta/astryx/commit/afa75c2e8) feat(core): make Tokenizer InputGroup-compatible (#4405)
- [ ] [`db3e8334f`](https://github.com/meta/astryx/commit/db3e8334f) fix(core): InputGroupText, Badge and Token keep caller text in its written order under RTL (#10114)
- [ ] [`1ab211682`](https://github.com/meta/astryx/commit/1ab211682) fix(FileInput): a dropzone shows its status below the drop area by default (#11195)

### v0.7.15

- [ ] [`38521acb9`](https://github.com/meta/astryx/commit/38521acb9) chore(core): remove the same-press leftovers: an unread dismissal field and stale comments (#11332)
- [x] [`1182a6495`](https://github.com/meta/astryx/commit/1182a6495) spec(AST-117): entryErrorBehavior for inputs that check their own entries (#11310)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`0e8cc4b44`](https://github.com/meta/astryx/commit/0e8cc4b44) spec(AST-118): rejected entry feedback for inputs that check their own entries (#11321)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.16

- [ ] [`df333a600`](https://github.com/meta/astryx/commit/df333a600) feat(TextArea): add native htmlMaxLength support (#11295)
- [x] [`cf0b1424c`](https://github.com/meta/astryx/commit/cf0b1424c) spec(AST-117, AST-118): record the owner approval (authority current, phase accepted) (#11414)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9d2ce46c7`](https://github.com/meta/astryx/commit/9d2ce46c7) docs(core): playground defaults for eight components and sample items for four group playgrounds (#11351)
- [ ] [`50beab961`](https://github.com/meta/astryx/commit/50beab961) fix(core): pass host data-* attributes to the component's own element (#11406)
- [x] [`dd702d0d2`](https://github.com/meta/astryx/commit/dd702d0d2) fix(DateInput, DateTimeInput): keep rejected date entries and show why (#11407)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`30da0a57b`](https://github.com/meta/astryx/commit/30da0a57b) fix(NumberInput): keep a rejected number entry and show why (#11415)
- [ ] [`dcdfd7f43`](https://github.com/meta/astryx/commit/dcdfd7f43) fix(DateInput, DateTimeInput): a value passed at the revealing commit keeps the rejected date entry (#11470)
- [ ] [`a32287bcb`](https://github.com/meta/astryx/commit/a32287bcb) fix(TimeInput, DateTimeInput): keep rejected time entries and show why (#11413)
- [ ] [`130e5da2d`](https://github.com/meta/astryx/commit/130e5da2d) feat(DateInput, DateTimeInput, TimeInput, FormLayout): entryErrorBehavior and a form default (#11485)
- [ ] [`8cf8ead59`](https://github.com/meta/astryx/commit/8cf8ead59) feat(NumberInput, Pagination): entryErrorBehavior on NumberInput (#11492)

### v0.7.17

- [ ] [`d504f0094`](https://github.com/meta/astryx/commit/d504f0094) feat(TextInput, TextArea, NumberInput): fields stay above the keyboard (#9777)
- [ ] [`50275d955`](https://github.com/meta/astryx/commit/50275d955) fix(core): fields with a status keep their keyboard focus ring (and the theme editor follows) (#12139)
- [ ] [`72f2d7caa`](https://github.com/meta/astryx/commit/72f2d7caa) docs: icon props take semantic names; Selector hasClear types; useTableSelectionState returns (#12583)
- [ ] [`3deff9de7`](https://github.com/meta/astryx/commit/3deff9de7) feat(core): theme seams for the spinner, tree disclosure, number steppers and close buttons (#12156)
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
- [ ] [`9dacfbd03`](https://github.com/meta/astryx/commit/9dacfbd03) fix(TextInput, TextArea): an error without a message gives assistive technology text (#12468)
- [x] [`7efbb4e57`](https://github.com/meta/astryx/commit/7efbb4e57) fix(Toast): a Toast rendered on its own holds no live role (#11960)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3492268f1`](https://github.com/meta/astryx/commit/3492268f1) fix(TextInput): the field grows with larger text instead of cutting its line (#12546)
- [ ] [`1f04ed3e3`](https://github.com/meta/astryx/commit/1f04ed3e3) fix(Tokenizer): a collapsed unfocusedLayer field keeps a tab stop on its placeholder (#12486)

## 交互逻辑常用函数（area:core）

### v0.7.2

- [x] [`b4b905b63`](https://github.com/meta/astryx/commit/b4b905b63) fix(FieldStatus): avoid hydration mismatch from entry animation (#7550)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。useEntryAnimation 接管服务端 HTML 时不加入场类，补水合测试
- [x] [`e40ce5a06`](https://github.com/meta/astryx/commit/e40ce5a06) fix(DropdownMenu): close submenu flyouts when the menu is light-dismissed (#6912)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。菜单被轻点关闭后，子菜单飞出层的过期悬停计时不再把它重新打开，补测试
- [x] [`b0a6f6234`](https://github.com/meta/astryx/commit/b0a6f6234) spec(AST-081): global mode, so the CLI answers in any folder and a project's own release answers inside it (#7601)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d21609796`](https://github.com/meta/astryx/commit/d21609796) spec(cli-surface): INV30, how a host's package set serves the CLI (#7412)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.3

- [x] [`7b6691327`](https://github.com/meta/astryx/commit/7b6691327) spec(AST-085): disabled controls stay focusable (#7793)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b7860bcbb`](https://github.com/meta/astryx/commit/b7860bcbb) feat(DropdownMenuSubMenu): header and footer around a sub-menu's rows (#7530)
  - Vue 版已有：DropdownMenuSubMenu 的 header 和 footer 已在（useMenuRegions）；上游 useMenuPress 的 surface 标记是为让根菜单旁边的对话框算嵌套菜单，Vue 的飞出层不参与按压滑动，没有对应
- [x] [`cde6233de`](https://github.com/meta/astryx/commit/cde6233de) fix(core): TreeList, Pagination dots and Calendar days use aria-disabled (#7887)
  - Vue 版已有：useGridRovingFocus 和 Calendar 的 roving 每次都把所有格子设为 -1 只留一个 0，aria-disabled 的日子不会占着 Tab 停靠点
- [x] [`82a877659`](https://github.com/meta/astryx/commit/82a877659) fix(cli): install advice in a non-Astryx folder names the project (#7850)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`be423330b`](https://github.com/meta/astryx/commit/be423330b) fix(cli): the global skill gives a concrete build workflow (#7893)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`04c746814`](https://github.com/meta/astryx/commit/04c746814) fix(cli): the global skill names the install step when astryx is not found (#7888)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.4

- [x] [`97dda3cb4`](https://github.com/meta/astryx/commit/97dda3cb4) fix(useMenuPress): hit-test in the menu's own shadow root (#7914)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。菜单按压读元素所在的 shadow root 来按松手位置找行，补测试
- [x] [`2b60fa6fd`](https://github.com/meta/astryx/commit/2b60fa6fd) fix(inputs): silence the busy Spinner and announce the busy start once (TextInput, TextArea, Selector, MultiSelector) (#7920)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。TextInput、TextArea 的加载圈改为装饰（aria-hidden），忙碌由输入框自己念一次，补测试；Selector、MultiSelector 同步已在 #544
- [x] [`f32572e75`](https://github.com/meta/astryx/commit/f32572e75) fix(useTypeahead): clear the pending buffer reset on unmount (#7938)
  - Vue 版已有：useTypeahead 用 onScopeDispose(reset) 清掉待重置计时
- [x] [`1a552f29b`](https://github.com/meta/astryx/commit/1a552f29b) [CLI] Doc syntax: {@command}, {@pm}, {@pm-only} tokens, and integration check --next (#7868)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.5

- [x] [`db7e94503`](https://github.com/meta/astryx/commit/db7e94503) fix(core): a search's busy start is never announced after its outcome (#8235)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。useBusyAnnouncement 返回 settle，结果要播报时收回还没念的「加载中」，Selector、MultiSelector 接上，补测试
- [x] [`d794476b6`](https://github.com/meta/astryx/commit/d794476b6) fix(useAnnounce): messages announced in the same frame are joined, an identical repeat once (#8244)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。useAnnounce 同一帧的消息按顺序连读，相同重复只念一次，空消息清掉排队的，补测试和文档
- [x] [`785e42ad9`](https://github.com/meta/astryx/commit/785e42ad9) fix(DropdownMenu): a row the pointer lights takes focus without :focus-visible (#8221)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。指针点亮的菜单行经 focusForLastInput 聚焦，不命中 :focus-visible，补测试
- [x] [`a88f185a1`](https://github.com/meta/astryx/commit/a88f185a1) fix(core): a card's press overlay paints a finger's press (#8057)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`c743ae000`](https://github.com/meta/astryx/commit/c743ae000) spec(design): under reduced motion, touch cross-fades and other pointers change at once (#8272)
- [x] [`8b7491193`](https://github.com/meta/astryx/commit/8b7491193) fix(EmptyState): announce once when it appears after load, not as a live root (#8294)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。EmptyState 根去掉 role=status，页面加载后才出现或文字变了才播报一次，补测试和文档
- [x] [`4b05772a2`](https://github.com/meta/astryx/commit/4b05772a2) fix(Popover): focus, Tab and Escape work in a second document (#7356)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。useFocusTrap 按容器所在文档挂监听、读焦点，#545 合并的图层运行时已带上；本批补嵌套区域和 iframe 内的用例
- [x] [`a4261e95a`](https://github.com/meta/astryx/commit/a4261e95a) refactor(core): a shared edge autoscroll timer, used by the menu press model (#8334)
  - Vue 版已有：边缘自动滚动已是 internal/menuPressAutoscroll，菜单按压模型共用
- [x] [`39690bf4c`](https://github.com/meta/astryx/commit/39690bf4c) spec(AST-100): one velocity tracker and one release filter for every gesture (#8312)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c899f0bb6`](https://github.com/meta/astryx/commit/c899f0bb6) spec(AST-099): one shared on-screen keyboard module (#8304)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`5b9e43bd0`](https://github.com/meta/astryx/commit/5b9e43bd0) fix(ChatComposer): the status bar announces through the shared own-content module (#8363)
  - Vue 版已有：ChatComposer 状态条的 watch 直接走共用 useAnnounce，没有额外的 live 根
- [x] [`3353ab581`](https://github.com/meta/astryx/commit/3353ab581) fix(useScrollableArea): a viewport is a tab stop from the first frame its content overflows (#8388)
  - Vue 版已有：useScrollableArea 的样式变化由 MutationObserver 触发微任务重量，Tab 停靠点在同一帧、绘制前出现
- [x] [`a56c06134`](https://github.com/meta/astryx/commit/a56c06134) fix(Tooltip): a tooltip taller than the room around its trigger opens clear of it (#8254)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e36c64f1f`](https://github.com/meta/astryx/commit/e36c64f1f) spec(interaction-modality): Lab keeps no copy of the release-velocity filter (#8413)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`23de0923e`](https://github.com/meta/astryx/commit/23de0923e) spec(AST-094): touch presentations feel native by default (#8409)
- [ ] [`cd3787bac`](https://github.com/meta/astryx/commit/cd3787bac) feat(core): one touch presentation resolver (#8062)
  - 暂缓：触屏呈现解析器（useAdaptivePresentation）：Vue 版没有 presentation 属性和 experimental.presentation 这套设施
- [ ] [`a3aa43ee3`](https://github.com/meta/astryx/commit/a3aa43ee3) design(reduced-motion): a coast after a throw behaves like native momentum under Reduce Motion (#8384)
- [x] [`caa1f04fe`](https://github.com/meta/astryx/commit/caa1f04fe) fix(ContextMenu): the long press that opens the menu no longer closes it (#7308)
  - 不适用：只改上游测试（自动初筛）
- [x] [`106a98cfb`](https://github.com/meta/astryx/commit/106a98cfb) spec(AST-099): the keyboard height comes from the visual viewport in every browser (#8385)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e36bd2e15`](https://github.com/meta/astryx/commit/e36bd2e15) spec(useMenuPress): a finger opens a sub-menu by lifting, and a handed-off finger is the opening press (DEC-8) (#8451)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4abbc5265`](https://github.com/meta/astryx/commit/4abbc5265) chore(core): the UIKit constants table for touch presentations (#8053)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [x] [`e1deabdfe`](https://github.com/meta/astryx/commit/e1deabdfe) spec(AST-094): a held finger does what the hold does, not a selection (FR41, DEC-9) (#8454)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`16770e300`](https://github.com/meta/astryx/commit/16770e300) perf(core): one export per UIKit gesture group (#8468)
  - 暂缓：依赖触屏手势与动画器基础设施（GestureArena、PressTracker、animator），Vue 版没有
- [ ] [`d8ffb8f09`](https://github.com/meta/astryx/commit/d8ffb8f09) feat(core): gesture recognizer core — UIKit's state machine and the arena (#8058)
- [ ] [`b58ca635e`](https://github.com/meta/astryx/commit/b58ca635e) chore(core): UIKit's spring, decay, rubber-band and projection math (#8054)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [ ] [`19a7a463c`](https://github.com/meta/astryx/commit/19a7a463c) feat(core): tap and long-press recognizers with UIKit's measured thresholds (#8059)
- [ ] [`cd4aca645`](https://github.com/meta/astryx/commit/cd4aca645) feat(core): pan gesture recognizer with UIKit's hysteresis and velocity (#8060)
- [x] [`822e36423`](https://github.com/meta/astryx/commit/822e36423) spec(AST-094): touch motion roles stay internal until the public set is decided (#8488)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`3ab7f32db`](https://github.com/meta/astryx/commit/3ab7f32db) docs(core): the scroll-to-top note says what Reduce Motion does with a tap-started decay (#8494)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`61480b5c2`](https://github.com/meta/astryx/commit/61480b5c2) chore(core): the touch motion tables register FR4's roles as internal motion roles (#8257)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [x] [`de3ba5e5c`](https://github.com/meta/astryx/commit/de3ba5e5c) spec(AST-094): a native scroll takes a touch after 10 px; touch-action never widens the author's (DEC-8) (#8453)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c355ceba8`](https://github.com/meta/astryx/commit/c355ceba8) spec(AST-094): FR15 exempts watchers from recognizer exclusivity (DEC-7) (#8517)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`30a4a2b35`](https://github.com/meta/astryx/commit/30a4a2b35) chore(core): a compositor animator for touch presentations (#8055)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`423aaab8f`](https://github.com/meta/astryx/commit/423aaab8f) spec(AST-105): animated layout; architecture(react-component-runtime): its mechanism (INV12) (#8463)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f09d08332`](https://github.com/meta/astryx/commit/f09d08332) spec(AST-090): exits ship off, and a theme turns them on for dialogs and layers (#8003)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c4a9ae08d`](https://github.com/meta/astryx/commit/c4a9ae08d) spec(AST-090): touch presentations keep their native exit (#8536)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b18ff86e5`](https://github.com/meta/astryx/commit/b18ff86e5) spec(AST-094): a screen-edge pan claims pan-x only in the edge band (FR18, DEC-13) (#8553)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bc56fd8af`](https://github.com/meta/astryx/commit/bc56fd8af) spec(AST-094): rows of a menu that cannot scroll highlight on touch-down (FR11, DEC-14) (#8555)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c22cbe2fd`](https://github.com/meta/astryx/commit/c22cbe2fd) fix(core): useAnnounce delivers inside the open Astryx modal that encloses its caller (#8009)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。原生模态对话框打开时，播报写进对话框自己的区域；useBusyAnnouncement 原有的对话框路径并入共用通道，补测试
- [ ] [`2c4f1728b`](https://github.com/meta/astryx/commit/2c4f1728b) chore(core): the animator plans Reduce Motion in its own module, shares a track per element and starts at the commit (#8056)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`7a530ccbf`](https://github.com/meta/astryx/commit/7a530ccbf) chore(core): the internal module for size-change glides (spec:AST-105, INV12) (#8482)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`a00afee50`](https://github.com/meta/astryx/commit/a00afee50) chore(core): the animator plays any closed-form curve (#8521)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`167a3de8f`](https://github.com/meta/astryx/commit/167a3de8f) feat(core): one tracker for a held finger across any group of targets (#8346)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。一根手指跨一组目标的跟踪已在 internal/actionGroupTracker
- [x] [`81eeb6afa`](https://github.com/meta/astryx/commit/81eeb6afa) fix(Popover): an open popover no longer pulls in a Tab pressed elsewhere on the page (#8611)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。useFocusTrap 只在焦点真的在容器里才拦 Tab，Vue 版本来就是这样，#541 的 Popover 用例已覆盖；本批补 SVG 等非 HTML 元素也算在里面
- [x] [`fd0345c01`](https://github.com/meta/astryx/commit/fd0345c01) spec(AST-094): a scroll-edge pan may hold the rubber band from the first move (FR19, D28) (#8628)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1d66a581f`](https://github.com/meta/astryx/commit/1d66a581f) design(reduced-motion): an in-place value change applies at once on any pointer (DR2) (#8645)
- [x] [`28560fd26`](https://github.com/meta/astryx/commit/28560fd26) spec(AST-105): animated layout swaps two elements in place (FR8) (#8602)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`056b591f0`](https://github.com/meta/astryx/commit/056b591f0) spec(AST-020): reversible toggles may complete after a slide-off (FR9, DEC-5) (#8556)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7deec4ea0`](https://github.com/meta/astryx/commit/7deec4ea0) architecture(interaction-modality): native scroll reports progress (INV12) (#8605)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`46353fc07`](https://github.com/meta/astryx/commit/46353fc07) spec(AST-094): the edge band's claim applies to an element no wider than the band (FR18) (#8631)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`9b478e53b`](https://github.com/meta/astryx/commit/9b478e53b) spec(DropdownMenu, AST-094): the menu grows out of its trigger under a finger (FR21); a phone menu stays beside its trigger (DEC-19) (#8515)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a63eb54f5`](https://github.com/meta/astryx/commit/a63eb54f5) refactor(core): one shared touch module that components import directly, reached by Lab through internal/touch (#8465)
- [x] [`2f492195c`](https://github.com/meta/astryx/commit/2f492195c) spec(AST-094): every touch presentation holds pointer input while it enters (FR35) (#8618)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b9b7d3704`](https://github.com/meta/astryx/commit/b9b7d3704) spec(Table): a drawn row divider keeps the row border (FR14); row expansion glides with animatedLayout (FR15) (#8652)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7526d11c7`](https://github.com/meta/astryx/commit/7526d11c7) spec(AST-094): the default look grows nothing for touch; 44 px hit areas never overlap a neighbor (FR42) (#8633)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`6aea9bda0`](https://github.com/meta/astryx/commit/6aea9bda0) refactor(motion): one release policy, resolveSnapPoint, on selectSnapPoint (#8663)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`a73f0304b`](https://github.com/meta/astryx/commit/a73f0304b) spec(Table, AST-105): tables with column lines do not glide yet (FR15) (#8679)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`c01521cf9`](https://github.com/meta/astryx/commit/c01521cf9) spec(AST-094, AST-057): gestures work on the web for every pointer (FR43) (#8646)
- [ ] [`54fbccb27`](https://github.com/meta/astryx/commit/54fbccb27) feat(core): Tokenizer touch sheet behind experimental.presentation (#7977)
  - 暂缓：Tokenizer 触屏弹层：依赖 presentation 属性和触屏呈现，Vue 版没有
- [ ] [`ab0db1f73`](https://github.com/meta/astryx/commit/ab0db1f73) spec(AST-108): theme motion is three knobs — tempo, character, reducedMotion (#8613)
- [x] [`3ffb64647`](https://github.com/meta/astryx/commit/3ffb64647) fix(Tokenizer): hold back the touch sheet presentation until its UX pass finishes (#8735)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a5cb073a8`](https://github.com/meta/astryx/commit/a5cb073a8) spec(AST-107): public gesture hooks — usePanGesture, useDragToSnapPoints, useAnimator (#8600)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`f8e0c9283`](https://github.com/meta/astryx/commit/f8e0c9283) feat(core): useAnimatedLayout, and Collapsible and TreeList glide the content after them (spec:AST-105) (#8568)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`dcdb3568f`](https://github.com/meta/astryx/commit/dcdb3568f) architecture(interaction-modality): hover intent is a hover-recognizer setting (INV11) (#8604)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`99445691a`](https://github.com/meta/astryx/commit/99445691a) docs(interaction-modality): INV11's hover recognizer is not implemented yet (#8761)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`640599c5a`](https://github.com/meta/astryx/commit/640599c5a) spec(ContextMenu, List): ContextMenu on the headless menu; ListItem row menus attach to the li (#8648)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`db165f86f`](https://github.com/meta/astryx/commit/db165f86f) spec(SideNav, AppShell): rail collapse by snap, clip and cross-fade (D38) (#8720)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`0418c4705`](https://github.com/meta/astryx/commit/0418c4705) feat(core): the animated-layout glide moves the siblings before a change too, and its walk stops near the visible part (#8634)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`8f42b3d26`](https://github.com/meta/astryx/commit/8f42b3d26) perf(core): a glide in a long list lays the page out once, not once per moving element (#8639)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`60178b837`](https://github.com/meta/astryx/commit/60178b837) feat(core): the animated-layout module's in-place swap (spec:AST-105 FR8) (#8734)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`f0c69828b`](https://github.com/meta/astryx/commit/f0c69828b) fix(core): an element whose transform leaves it in place still glides (#8780)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`b39314411`](https://github.com/meta/astryx/commit/b39314411) spec(family): action groups — press, slide across, act on lift (AST-094 FR26–FR28) (#8622)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b8c5e4aee`](https://github.com/meta/astryx/commit/b8c5e4aee) feat(core): SideNav's rail collapses by snap, clip and cross-fade; AppShell's content moves on its clock (#8723)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`58fa49dfe`](https://github.com/meta/astryx/commit/58fa49dfe) feat(core): Table rows glide when a row's panel opens or closes, and their dividers move with them (#8656)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`7bcb81cbe`](https://github.com/meta/astryx/commit/7bcb81cbe) feat(core): the nav, breadcrumb and tab menus track a held pointer across their items (#8791)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。NavMenu、NavHeadingMenu、TabMenu 接上菜单按压：按住滑过再松开选中，鼠标在外面松开关菜单，补测试
- [x] [`820769dd7`](https://github.com/meta/astryx/commit/820769dd7) docs(action-groups): the nav menus adopt the menu press model (#8801)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`72cd1b182`](https://github.com/meta/astryx/commit/72cd1b182) perf(useScrollableArea): a scroll updates the edges from geometry, without reading computed style (#8041)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。useScrollableArea 的滚动只靠盒子几何更新两头位置，不读计算样式，补测试
- [ ] [`0913354f0`](https://github.com/meta/astryx/commit/0913354f0) fix(core): a mouse or Space press on a touch-first device paints the pressed state (#8046)
- [x] [`c9694089f`](https://github.com/meta/astryx/commit/c9694089f) test(gestures): recorded pointer streams for the velocity tracker (AST-100 FR4) (#8481)
  - 不适用：只改上游测试（自动初筛）
- [x] [`32b916d75`](https://github.com/meta/astryx/commit/32b916d75) spec(AST-090): record exit motion as current, with layer exits in every supported browser (#8547)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.6

- [ ] [`cf71dcf07`](https://github.com/meta/astryx/commit/cf71dcf07) fix(Dialog): closing returns focus to the opener in a second document (#8381)
- [ ] [`57d951bd4`](https://github.com/meta/astryx/commit/57d951bd4) chore(core): the animator drives a pseudo-element (#8522)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`257380d6d`](https://github.com/meta/astryx/commit/257380d6d) fix(SideNavHeading, TopNavHeading): one arrow key moves one item in a NavHeadingMenu (#9019)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。useMenuHover 内容区的按键已被菜单自己处理时不再挪第二次焦点，补测试
- [x] [`560c6664a`](https://github.com/meta/astryx/commit/560c6664a) spec(AST-107): useAnimator takes the element's ref (FR3) (#9084)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bb46e3662`](https://github.com/meta/astryx/commit/bb46e3662) spec(AST-094): only a finger's first uncancelable move can hand it to the browser (FR20) (#8456)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`5654357e1`](https://github.com/meta/astryx/commit/5654357e1) feat(core): swipe, pinch and screen-edge pan recognizers (#8061)
- [ ] [`4cc972c3a`](https://github.com/meta/astryx/commit/4cc972c3a) chore(core): resolve a component's presentation so a caller's choice wins over touch defaults (#8298)
  - 暂缓：组件呈现解析让调用方的选择胜过触屏默认：依赖 presentation 设施，Vue 版没有
- [x] [`1db4108ac`](https://github.com/meta/astryx/commit/1db4108ac) test(core): one internal definition pins core's touch style keys (#8331)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`5cd7a15d4`](https://github.com/meta/astryx/commit/5cd7a15d4) feat(core): touch-action derivation, native scroll probe, haptics and the gesture host (#8071)
- [x] [`db5a9936f`](https://github.com/meta/astryx/commit/db5a9936f) fix(MultiSelector): a search status the next keystroke replaces is withdrawn, not joined (#8640)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。useAnnounce 新增 hasReplace，MultiSelector、CommandPalette 的搜索状态只念最新一条，补测试和文档
- [x] [`501372909`](https://github.com/meta/astryx/commit/501372909) test(useAnnounceRenderedText): the Tokenizer adopter loads the on-demand sheet module before its one-second wait (#8896)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0ef60ddb6`](https://github.com/meta/astryx/commit/0ef60ddb6) feat(core): a theme's motion takes tempo and character (#8661)
- [x] [`26784d22e`](https://github.com/meta/astryx/commit/26784d22e) fix(Carousel): the scroll area is a named group, a tab stop only while it overflows (#8155)
  - 已移植：[#498](https://github.com/astryx-vue/astryx-vue/pull/498)。滚动区是命名 group，只在溢出时可 Tab
- [x] [`00507ba07`](https://github.com/meta/astryx/commit/00507ba07) fix(AppShell): with fill height, keyboard users can scroll an overflowing main region (#8111)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。AppShell fill 时主区域溢出成为键盘停靠点，Tab 进来交给里面第一个链接或按钮，只有 Tab 聚焦才画环，补测试
- [ ] [`5dd4d2691`](https://github.com/meta/astryx/commit/5dd4d2691) feat(core): the internal touch foundation: press tracking and the animator (#8076)
  - 暂缓：依赖触屏手势与动画器基础设施（GestureArena、PressTracker、animator），Vue 版没有
- [ ] [`be4573764`](https://github.com/meta/astryx/commit/be4573764) docs(core): the gesture arena's and host's doc comments sit on their declarations (#9114)
- [ ] [`9d7cffe4f`](https://github.com/meta/astryx/commit/9d7cffe4f) docs(core): the role test's header and the motion README's files name the internal roles (#8502)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [x] [`37d88c036`](https://github.com/meta/astryx/commit/37d88c036) spec(AST-094): a cancelled moving touch stays with its recognizer (FR19) (#8978)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`932cfb963`](https://github.com/meta/astryx/commit/932cfb963) spec(interaction-modality): wrapper focus rings come from one shared owner module (#9183)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c39a5b160`](https://github.com/meta/astryx/commit/c39a5b160) spec: API reports cover declarations, custom properties, theme targets and public attributes; undeclared rows go to a human (#9199)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bea4846f0`](https://github.com/meta/astryx/commit/bea4846f0) spec(AST-094): a thumb that sets a value takes no wheel or trackpad scroll (FR43) (#8905)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7cea1526b`](https://github.com/meta/astryx/commit/7cea1526b) test(core): the wrapped-item glide case reads its motion in the change's own task (#9218)
  - 不适用：只改上游测试（自动初筛）
- [x] [`28291f347`](https://github.com/meta/astryx/commit/28291f347) test(core): the animator's retire case counts frames past the curve's end (#9219)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b028b77f6`](https://github.com/meta/astryx/commit/b028b77f6) spec(AST-094): FR43 releases at the lift with the fingers' last velocity; only a pinch ends after 100 ms (#9229)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1d8696ad9`](https://github.com/meta/astryx/commit/1d8696ad9) spec: Tooltip and HoverCard pin on press; InfoTip is the info preset (#9175)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`0fa02074f`](https://github.com/meta/astryx/commit/0fa02074f) spec(AST-105, Resizable, LayoutPanel, SideNav): one shared edge reveal; a resizable LayoutPanel slides on collapse and open; focus leaves a collapsing panel (#8783)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
- [x] [`df6d16fea`](https://github.com/meta/astryx/commit/df6d16fea) fix(SegmentedControl): the disabled reason describes each segment, and one Tab stop remains when no enabled segment is selected (#9176)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。SegmentedControl 无选中项时只留一个 Tab 停靠点，禁用原因描述每个分段，补测试和文档
- [ ] [`97b3711d6`](https://github.com/meta/astryx/commit/97b3711d6) fix(Tooltip, HoverCard): a disabled control's reason opens on a tap (#8207)
- [x] [`891aa236c`](https://github.com/meta/astryx/commit/891aa236c) refactor(core): drop a dead private selector and collapse duplicate attribute spellings (INV23 step 4) (#9256)
  - 不适用：上游内部重构：删私有选择器、合并重复属性写法，Vue 版没有对应代码
- [x] [`dae84a757`](https://github.com/meta/astryx/commit/dae84a757) tooling(knowledge): records route the claims of shared concerns a change touches (#9145)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`d29d841f4`](https://github.com/meta/astryx/commit/d29d841f4) fix(core): a retarget before Chromium reports a call's start continues from the screen (#9255)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`8f345cba4`](https://github.com/meta/astryx/commit/8f345cba4) feat(FieldStatus): deprecate the tooltip variant; field controls keep statusVariant="tooltip" (#9196)
  - 不适用：Vue 的 FieldStatus 只有 attached 和 detached，从来没有 tooltip 变体；字段控件的 statusVariant="tooltip" 已在 #544 保留
- [x] [`acfa52701`](https://github.com/meta/astryx/commit/acfa52701) fix(useTypeahead): type-to-select ignores accents (#8864)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。按字母跳转忽略重音、大小写、带斜杠字母，useTypeahead 和 useTreeFocus 共用 typeaheadMatch
- [ ] [`5909b939e`](https://github.com/meta/astryx/commit/5909b939e) feat(core): one shared edge reveal in the animated-layout module, which the SideNav rail moves onto (#8721)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`48f6a067f`](https://github.com/meta/astryx/commit/48f6a067f) [Component Audit] DropdownMenu: keep the focused row visible in forced colors (#7517)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。强制配色下聚焦的菜单行用 Highlight/HighlightText 涂出来；指针关闭后的焦点环处理 Vue 版已有
- [x] [`8b78da84a`](https://github.com/meta/astryx/commit/8b78da84a) test(core): the inline-end edge reveal's reversal proof reads both sides on the animation's own clock (#9298)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`372a0eae2`](https://github.com/meta/astryx/commit/372a0eae2) fix(SideNav): focus on a row the collapsed rail removes moves to the collapse toggle or the nearest rail row (#9249)
- [ ] [`70cef4580`](https://github.com/meta/astryx/commit/70cef4580) fix(core): the animator rechecks a finished animation's end in frame callbacks from a frame before it (#9285)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`432d9577d`](https://github.com/meta/astryx/commit/432d9577d) fix(SegmentedControl): a disabled control, or a disabled selected segment, keeps the Tab stop (#9314)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。选中的分段始终拿 Tab 停靠点（禁用也一样），整个控件禁用后仍可聚焦、不再关掉指针，补测试和文档
- [x] [`8c8f0dac6`](https://github.com/meta/astryx/commit/8c8f0dac6) fix(Collapsible): focus inside closing content moves to the trigger (#9250)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f5db72546`](https://github.com/meta/astryx/commit/f5db72546) refactor(ModalAnnounceProvider): watch presentation through the shared MutationObserver (#9151)
  - 不适用：上游用共享 MutationObserver 监听 provider 的呈现状态；Vue 在播报时直接查正开着的模态对话框，没有 provider 和观察器
- [x] [`dd6ac74ea`](https://github.com/meta/astryx/commit/dd6ac74ea) fix(useKeyboardHint): focus inside portaled children neither shows nor spends the arrow-key hint (#9362)
  - 不适用：上游是 React 把传送门里的焦点冒泡到容器；Vue 的 Teleport 内容在容器 DOM 之外，焦点不会冒到容器上
- [x] [`3d44c583a`](https://github.com/meta/astryx/commit/3d44c583a) fix(Tooltip, HoverCard): a press inside an open surface doesn't activate the card, row or field around it (#9252)
  - 已移植：[#512](https://github.com/astryx-vue/astryx-vue/pull/512)。Tooltip、HoverCard 气泡内按下不激活外层卡片、行、字段
- [x] [`356e9a8ab`](https://github.com/meta/astryx/commit/356e9a8ab) fix(TreeList): focus inside a collapsing branch moves to its row (#9251)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。TreeList 收起分支时，焦点在里面就先挪到这一行并拿 Tab 停靠点，补测试
- [ ] [`1ee5e4069`](https://github.com/meta/astryx/commit/1ee5e4069) fix(core): a glide retargeted by a second layout change starts where it is drawn (#9327)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`a68e0e372`](https://github.com/meta/astryx/commit/a68e0e372) spec(Tooltip, HoverCard): rename pressTrigger to triggerBehavior ('adaptive' | 'hover' | 'toggle') (#9379)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`134afc4b3`](https://github.com/meta/astryx/commit/134afc4b3) fix(core): one click guard for the menu press model and the gesture host (#8360)
- [x] [`16b95934f`](https://github.com/meta/astryx/commit/16b95934f) fix(Dialog, Drawer, BottomSheet): an overlay open on the server renders closed until hydration (#9360)
  - Vue 版已有：Dialog 在 onMounted 才 showModal，服务端渲染出来的是关着的；Drawer 就是 Dialog
- [ ] [`5a4e8fa84`](https://github.com/meta/astryx/commit/5a4e8fa84) fix(core): each animation's end recheck in the animator is its own (#9325)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`38398cd22`](https://github.com/meta/astryx/commit/38398cd22) refactor(core): useAttachment moves to hooks/, and useFingerScroll keeps its watch through it (#9414)
- [x] [`23c8cae98`](https://github.com/meta/astryx/commit/23c8cae98) spec(ContextMenu): touch-opened menus lift with a tint, grow from the finger, and use named springs (#9423)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`8d1864b67`](https://github.com/meta/astryx/commit/8d1864b67) chore(core): the touch motion tables register FR4's context-menu springs as roles (#9432)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [x] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
  - 已移植：[#515](https://github.com/astryx-vue/astryx-vue/pull/515)。组件只按自己的命名空间读内置文案
- [x] [`30e97b303`](https://github.com/meta/astryx/commit/30e97b303) chore(core): the generated motion role table lists every registered role and the record that names it (#9454)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`f8f615574`](https://github.com/meta/astryx/commit/f8f615574) chore(hooks): source comments explain only non-obvious reasons (2 of 2) (#9520)
  - 不适用：只改 hook 源码里的注释措辞
- [x] [`3be0fbcf6`](https://github.com/meta/astryx/commit/3be0fbcf6) chore(hooks): source comments explain only non-obvious reasons (1 of 2) (#9514)
  - 不适用：只改 hook 源码里的注释措辞
- [ ] [`2d6154dc5`](https://github.com/meta/astryx/commit/2d6154dc5) chore(utils): trim the remaining long utility comments (#9527)
- [ ] [`09a09fff3`](https://github.com/meta/astryx/commit/09a09fff3) chore(utils): source comments in ten utility files explain only non-obvious reasons (1 of 2) (#9522)
- [x] [`b5e716687`](https://github.com/meta/astryx/commit/b5e716687) refactor(Item, Token, ChatComposer): drop the per-site tooltip surface checks the layer boundary replaces (#9531)
  - 不适用：上游靠 React 合成事件在浮层根截停冒泡，Vue 按 DOM 冒泡仍需登记表
- [ ] [`9297ef4a4`](https://github.com/meta/astryx/commit/9297ef4a4) fix(core): type interactionOverlayStyles as StyleX styles so they fit xstyle (#9440)

### v0.7.7

- [ ] [`4a7a6f21e`](https://github.com/meta/astryx/commit/4a7a6f21e) fix(core): a retarget after a late first frame continues from the screen (#9401)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`5a455f5fd`](https://github.com/meta/astryx/commit/5a455f5fd) feat(core): a pan follows a trackpad where its owner allows it, never a mouse wheel; a pinch takes a ctrl-wheel (spec:AST-094 FR43) (#8676)
- [ ] [`723e04539`](https://github.com/meta/astryx/commit/723e04539) feat(Slider): every pointer drags a thumb by its travel, as UISlider does (#8190)
  - 暂缓：Slider 按行程拖动依赖 uikit slider 数值表和触屏手势设施
- [ ] [`240e8c54a`](https://github.com/meta/astryx/commit/240e8c54a) fix(core): a channel rebuilt after a late first frame carries on from the screen (#9637)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`d1118274b`](https://github.com/meta/astryx/commit/d1118274b) chore(core): UIKit's paging values and math, measured on iOS 26.2 (#8145)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [x] [`0d1ddcd4e`](https://github.com/meta/astryx/commit/0d1ddcd4e) fix(harness): a main-thread block reports the span its own loop measured (#9652)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3b3052a69`](https://github.com/meta/astryx/commit/3b3052a69) feat(ProgressBar): UIProgressView's timing under a finger (#8225)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [ ] [`5f3198edf`](https://github.com/meta/astryx/commit/5f3198edf) fix(gestures): a mouse or pen drag a gesture claims keeps the page's text selection (spec:AST-094 FR41) (#8665)
- [x] [`1d04d40fd`](https://github.com/meta/astryx/commit/1d04d40fd) feat(Tooltip): triggerBehavior="toggle" pins the tooltip on a press (#9232)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`80cba260f`](https://github.com/meta/astryx/commit/80cba260f) feat(ProgressBar): under reduced motion the indeterminate bar pulses in place (#8239)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [ ] [`1f47db9c8`](https://github.com/meta/astryx/commit/1f47db9c8) feat(Switch): the touch presentation, for every pointer (#9636)
- [x] [`e70d5dc7a`](https://github.com/meta/astryx/commit/e70d5dc7a) fix(Popover): initial focus lands within the opening tap, and focus set in onShow is kept (#9606)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。初始焦点在打开的那次点按内落下，onShow 里放好的焦点不被挪走
- [x] [`59d7d109d`](https://github.com/meta/astryx/commit/59d7d109d) test(useTypeahead): the five-provider INV17 sweep covers ø, ħ and ƀ (#9547)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`cad41e367`](https://github.com/meta/astryx/commit/cad41e367) fix(gestures): a trackpad wheel within 1.5 ms of the one before sets no speed (#9667)
- [x] [`f883c083d`](https://github.com/meta/astryx/commit/f883c083d) chore(core): a pager that pages like a UIKit paging scroll view (#8146)
  - Vue 版已有：翻页滚动行已是 internal/snapPagingAttach：手指和触控笔接管、弹簧停靠、触控板横扫
- [ ] [`959251144`](https://github.com/meta/astryx/commit/959251144) fix(gestures): a bunched trackpad wheel reads as the steps it merged (#9675)
- [x] [`e02c9552c`](https://github.com/meta/astryx/commit/e02c9552c) test(motion, SideNav): the rail proofs judge the frames a loaded page draws, not a frame rate (#9518)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4a8a76eeb`](https://github.com/meta/astryx/commit/4a8a76eeb) fix(core): the click guard takes a claimed touch's late mousedown and mouseup (#9677)
- [ ] [`95438ffaf`](https://github.com/meta/astryx/commit/95438ffaf) feat(SegmentedControl): the selection slides on every change and drags with any pointer (#9632)
  - 暂缓：SegmentedControl 的弹簧滑动和任意指针拖动依赖动效与手势设施（animator、segmented 弹簧角色）；useMediaQuery 缺 matchMedia 时返回默认值，Vue 版已有
- [x] [`f4edef899`](https://github.com/meta/astryx/commit/f4edef899) perf(Selector): memoize option rows, so an open or a highlight move re-renders only the rows it changes (#9598)
  - 不适用：上游给 Selector 选项行做 React memo，Vue 的更新按依赖追踪，不重渲染整列
- [ ] [`f9ac85f1f`](https://github.com/meta/astryx/commit/f9ac85f1f) fix(gestures): a stall's late wheel and the bunch after it share its interval (#9688)
- [x] [`1821fb3fa`](https://github.com/meta/astryx/commit/1821fb3fa) fix(Tooltip): remove the unreleased triggerBehavior prop before 0.7.7 (#9711)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`4f452f927`](https://github.com/meta/astryx/commit/4f452f927) feat(Tokenizer): the touch sheet presentation is public behind experimental.presentation, and the sheet edits a draft that Save commits (#9708)
  - 暂缓：Tokenizer 触屏弹层公开成 experimental.presentation：依赖触屏呈现设施，Vue 版没有
- [x] [`b11e000b5`](https://github.com/meta/astryx/commit/b11e000b5) fix(Selector): a row that scrolls under a still mouse does not take the keyboard's highlight (#9671)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。行只在鼠标真的移动时才拿走高亮
- [x] [`cec65f35f`](https://github.com/meta/astryx/commit/cec65f35f) fix(DropdownMenu): a late native click after a touch drill-in no longer picks a row (#8275)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。手指松开选中后用 touchend 取消让浏览器不再补发 click，之后没有按压对应的 click 照常放行，补测试
- [x] [`1790062c7`](https://github.com/meta/astryx/commit/1790062c7) test(gestures): the trackpad release proof judges the wheel gaps a loaded page delivers (#9732)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4e495ec5e`](https://github.com/meta/astryx/commit/4e495ec5e) fix(BottomSheet): a standalone sheet closing with focus inside stays out of inert while focus stays (#9635)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3615956e2`](https://github.com/meta/astryx/commit/3615956e2) fix(gestures): pens and pointer-read fingers get the blur refusal and the pinch rule of the Touch Events path (#8309)
- [ ] [`273ec4356`](https://github.com/meta/astryx/commit/273ec4356) fix(DateInput): a Reduce Motion step lands under its cross-fade, on the fade's own timeline (#9734)
  - 暂缓：DateInput 的减少动态效果步进依赖 reducedMotion 计划模块，Vue 版没有

### v0.7.8

- [ ] [`30160f5ce`](https://github.com/meta/astryx/commit/30160f5ce) feat(core): PowerSearch touch sheet flow behind experimental.presentation (#8001)
  - 暂缓：PowerSearch 触屏弹层流程：依赖触屏呈现设施，Vue 版没有
- [ ] [`49ac70d6b`](https://github.com/meta/astryx/commit/49ac70d6b) fix(motion): a call on a settle tail starts at the browser's commit (#9733)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`871bc3d5e`](https://github.com/meta/astryx/commit/871bc3d5e) feat(core): createAnimator and useAnimator animate one element (#8653)
- [x] [`d43f40785`](https://github.com/meta/astryx/commit/d43f40785) fix(AlertDialog): a press that slides between the actions runs the one it lifts on (#8083)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。AlertDialog 按住滑动，在松手的按钮上执行
- [ ] [`a81487737`](https://github.com/meta/astryx/commit/a81487737) feat(core): a first-party indicator can paint its own press (#9716)
- [x] [`acca58968`](https://github.com/meta/astryx/commit/acca58968) fix(core): a long press held through a busy main thread still reports, on the touch events' clock (#9455)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。useLongPress 按触摸事件自己的时间戳到期，页面忙时晚到的抬起不丢长按，计时器只等剩下的一段，补测试
- [ ] [`709a28641`](https://github.com/meta/astryx/commit/709a28641) fix(Lightbox): a viewer that unmounts while open returns focus to its opener (#9629)
- [ ] [`c19ca12b7`](https://github.com/meta/astryx/commit/c19ca12b7) chore(gestures): press tracking ships only its press clocks, and the README documents kind and createPressTracker (#9745)
- [ ] [`7585c6e42`](https://github.com/meta/astryx/commit/7585c6e42) feat(core): one progress module for the motion foundation (#9755)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`2188aa9ff`](https://github.com/meta/astryx/commit/2188aa9ff) fix(useScrollLock): keep the page where it is while an overlay is open (#8098)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。锁滚动在触屏上取消没人接的单指拖动、关掉页面回弹；页面本来就不钉成 position: fixed，补测试和文档
- [x] [`4b7546d3b`](https://github.com/meta/astryx/commit/4b7546d3b) fix(CheckboxInput, Switch): a form's required default no longer marks an unchecked box or off switch required (#9664)
  - Vue 版已有：CheckboxInput、Switch、CheckboxList 只由自己的 isRequired 决定 aria-required，不读 FormLayout 的必填默认
- [ ] [`2c925f794`](https://github.com/meta/astryx/commit/2c925f794) refactor(core): a theme's reduced-motion mark, internal until 'always' ships (#9761)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
- [ ] [`bb3838b6f`](https://github.com/meta/astryx/commit/bb3838b6f) fix(AlertDialog): a mouse press on the actions acts natively again (#9771)
- [x] [`aa4bd1d3d`](https://github.com/meta/astryx/commit/aa4bd1d3d) refactor(core): useLongPress runs its long press through a detector with no React (#9642)
  - 不适用：上游把长按从 React hook 抽成无 React 的检测器；Vue 的 useLongPress 本来就是纯函数加计时器
- [x] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
  - 不适用：只给 React useEffect 加注释
- [x] [`85afaa010`](https://github.com/meta/astryx/commit/85afaa010) fix(Calendar): Shift+Page Up and Shift+Page Down move by a year (#9609)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。Calendar 按住 Shift 用 PageUp/PageDown 按年翻（2 月 29 日落在 28 日、超出 min/max 不动、禁用目标落在当月第一个可选日），补测试和文档
- [x] [`dcf3d6f86`](https://github.com/meta/astryx/commit/dcf3d6f86) feat(Tokenizer): presentation is a stable prop, and adaptive is its default (#9796)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`593f96f76`](https://github.com/meta/astryx/commit/593f96f76) feat(Wheel): UIPickerView's motion under a finger, with flat rows (#8159)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [x] [`f50bc7400`](https://github.com/meta/astryx/commit/f50bc7400) feat(PowerSearch): presentation is a stable prop, and adaptive is its default (#9797)
  - 不适用：只改上游测试（自动初筛）
- [x] [`aaacae935`](https://github.com/meta/astryx/commit/aaacae935) refactor(useScrollLock): the page hold asks the native-scroll probe's edge test (#9812)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。锁滚动的拖动判断读滚动链上各元素是否还能往这个方向滚（含边缘），补测试
- [ ] [`73996f1b2`](https://github.com/meta/astryx/commit/73996f1b2) fix(core): a layout change made late in a long task plays its motion instead of skipping past it (#9274)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`61cf773c2`](https://github.com/meta/astryx/commit/61cf773c2) refactor(InfoTip): build on useTooltip's show() and hide(); remove the internal toggle path (#9756)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`946211065`](https://github.com/meta/astryx/commit/946211065) perf(core): an overlay's eager import no longer carries the lazy BottomSheet's padding (#8550)
- [x] [`65516e649`](https://github.com/meta/astryx/commit/65516e649) spec(AST-099): Core text inputs stay above the on-screen keyboard (#9750)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`787b6967b`](https://github.com/meta/astryx/commit/787b6967b) fix(AlertDialog): a released action fades on the theme's tempo, as other presses do (#8638)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。松开的按钮按主题的节奏淡出
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`826d8933e`](https://github.com/meta/astryx/commit/826d8933e) chore(core): UIDatePicker's wheel rules, measured on iOS 26.2 (#8178)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [x] [`c239dafbd`](https://github.com/meta/astryx/commit/c239dafbd) test(interaction-harness): a busy-window control clock and a marker search in a region (#9872)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f10bc9153`](https://github.com/meta/astryx/commit/f10bc9153) spec(AST-094): only a gesture's motion springs; other motion plays the theme's tokens (#9706)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b206f6399`](https://github.com/meta/astryx/commit/b206f6399) fix(core): a touch press's release lasts until its fade has played (#9758)
- [x] [`75cc95196`](https://github.com/meta/astryx/commit/75cc95196) test(PowerSearch): load the module graphs before the timed waits that do not test the load (#9866)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f60d2bb9a`](https://github.com/meta/astryx/commit/f60d2bb9a) test(motion): the busy proof times each frame by the control, not by its stamp (#9885)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b35fe8380`](https://github.com/meta/astryx/commit/b35fe8380) test(interaction-harness): a paced touch play keeps its spacing after a stalled dispatch and reads the release the page read (#9725)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7b87c5c1d`](https://github.com/meta/astryx/commit/7b87c5c1d) fix(gestures): a selection a claimed lift's own handlers make stays (#9848)
- [ ] [`0588a1342`](https://github.com/meta/astryx/commit/0588a1342) feat(core): one on-screen keyboard module; a Tall BottomSheet reads it and rides Gboard's slides (#8559)

### v0.7.9

- [x] [`e3d2b4599`](https://github.com/meta/astryx/commit/e3d2b4599) docs(AST-099, input-fields): FR3 and FR13 point at FR9's app-bar rule (#9863)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`8ddcfe11c`](https://github.com/meta/astryx/commit/8ddcfe11c) fix(core): a layout motion's copy carries on the CSS animations and transitions running in it (#9534)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`f59ffe155`](https://github.com/meta/astryx/commit/f59ffe155) fix(ClickableCard, SelectableCard): no touch pressed look for a finger press that starts on a control inside the card (#9801)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。手指按在卡片里的控件上，卡片不画触屏按压
- [x] [`fbb81c6cc`](https://github.com/meta/astryx/commit/fbb81c6cc) DropdownMenu: under a finger, the opening finger picks only after UIMenu's handoff (AST-094 FR29) (#8627)
  - Vue 版已有：菜单按压状态机有 MENU_PRESS_SETTLE_MS：打开菜单的那次按压没进过菜单、按得又短，松开什么都不执行
- [x] [`e968a7b86`](https://github.com/meta/astryx/commit/e968a7b86) test(gestures): the release cross-check pins the stillness interval (#9939)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`298bafbc1`](https://github.com/meta/astryx/commit/298bafbc1) fix(core): a list row's touch press release runs on the compositor (#9762)
- [ ] [`252b45bb1`](https://github.com/meta/astryx/commit/252b45bb1) feat(Layer): one input hold, first used by Dialog, Drawer and MobileNav (spec:AST-094 FR35) (#8342)
- [ ] [`6c3507a3b`](https://github.com/meta/astryx/commit/6c3507a3b) fix(gestures): keep a trackpad flick's late, coalesced wheels in the flick (spec:AST-094 FR43) (#9912)
- [x] [`a0c48b8d7`](https://github.com/meta/astryx/commit/a0c48b8d7) docs(AST-105, AST-108): glides and tap-to-expand play the theme's motion tokens (#9964)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [x] [`67ad50980`](https://github.com/meta/astryx/commit/67ad50980) fix(core): a finger press on a control inside a list row, TreeList row or Token shows no press on it (#9959)
  - 已移植：[#501](https://github.com/astryx-vue/astryx-vue/pull/501)。手指按在行、TreeList 行、Token 里的控件上，外层容器不亮
- [ ] [`3d225c35b`](https://github.com/meta/astryx/commit/3d225c35b) feat(core): under a finger a pressable highlights at touch-down outside scroll views (#9765)
- [x] [`b1b89aa0f`](https://github.com/meta/astryx/commit/b1b89aa0f) test(core): the copy test's entrances outlast any setup (#9991)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8b2883998`](https://github.com/meta/astryx/commit/8b2883998) chore(core): split long comment sentences in some menu press sources and tests (#9954)
  - 不适用：只拆分菜单按压源码和测试里的长注释
- [x] [`7eee90594`](https://github.com/meta/astryx/commit/7eee90594) fix(Dialog, AlertDialog, CommandPalette, BottomSheet, Lightbox): Tab wraps inside the open modal through the shared focus-region module (#8883)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。Tab 在打开的灯箱里循环，焦点区域模块已共用
- [ ] [`661f79147`](https://github.com/meta/astryx/commit/661f79147) chore(gestures): a pan's begin threshold can be read from each press (#9953)
- [x] [`9bd11b363`](https://github.com/meta/astryx/commit/9bd11b363) feat(core): a checkbox's or radio option's hit area grows toward 44 px (#8241)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`cb2a34a62`](https://github.com/meta/astryx/commit/cb2a34a62) fix(a11y): name a scrolling LayoutContent, LayoutPanel or StackItem (#9985)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。可滚动的 LayoutContent、LayoutPanel、StackItem 溢出时是有名字的 group，补测试和文档，scrollRegion.label 接入内置文案
- [x] [`b215c3e2f`](https://github.com/meta/astryx/commit/b215c3e2f) test(DropdownMenu): a footer stays reachable by Tab when the React root is the document (#9815)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7f8de290c`](https://github.com/meta/astryx/commit/7f8de290c) fix(core): a press's release fades on the theme's exit motion tokens (#9890)
- [ ] [`2ea8f6821`](https://github.com/meta/astryx/commit/2ea8f6821) chore(core): the motion and gesture internals that Lab's refresh pull reads (#9807)
- [x] [`63592ed62`](https://github.com/meta/astryx/commit/63592ed62) fix(core): a BottomSheet pulled past its top stretches on every pull, on the iOS rubber band (#8109)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2947be858`](https://github.com/meta/astryx/commit/2947be858) fix(Selector): the keyboard-active option draws the focus ring, so it reads at 3:1 against the list (#10024)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。Selector、MultiSelector 键盘移到的高亮选项画焦点环，指针移到的只有填充，补测试
- [ ] [`5db61cc9b`](https://github.com/meta/astryx/commit/5db61cc9b) fix(BottomSheet, Dialog): returning focus after an overlay closes no longer scrolls the page (#10022)
- [x] [`7b71d71b4`](https://github.com/meta/astryx/commit/7b71d71b4) feat(List): a row's touch target grows toward 44 px where its neighbors leave room (#8085)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。InfoTip 的触控热区朝 44px 长并在邻居间距一半处停住；List 行部分由 useTouchHitArea 共用
- [x] [`a6a9b9c50`](https://github.com/meta/astryx/commit/a6a9b9c50) fix(CheckboxListItem): a row answers a finger the same wherever it lands (#8212)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。useMediaQuery 每条查询只挂一个监听，补测试；转发点击的行里手指按被转发的控件照亮整行已在 #501
- [x] [`b1f604c9f`](https://github.com/meta/astryx/commit/b1f604c9f) fix(OverflowList): a resize shows the new visible set in the same frame (height-changing folds stay one frame late) (#9926)
  - 不适用：上游是 React 里 ResizeObserver 之后的 flushSync 时机；Vue 的响应式更新在绘制前完成，没有这一帧之差
- [x] [`5f81c3f39`](https://github.com/meta/astryx/commit/5f81c3f39) docs(BottomSheet): AST-094 names FR18's caller-sized exception; a comment names the pen (#10023)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f9281ef1c`](https://github.com/meta/astryx/commit/f9281ef1c) perf(OverflowList): only the multi-row form tracks rows and rowHeight (#8523)
  - 不适用：上游减少 React 单行形态的多余重渲染；Vue 的 rows 和 rowHeight 是 ref，不触发宿主重渲染
- [ ] [`8fdf6be37`](https://github.com/meta/astryx/commit/8fdf6be37) fix(BottomSheet): a sheet removed while open returns focus where a close would (#10061)
- [ ] [`c26fcd543`](https://github.com/meta/astryx/commit/c26fcd543) chore(lab): Lab's animator hook, over Core's internal touch entry (#9754)
  - 暂缓：Lab 的 animator hook 建在核心 createAnimator 上，Vue 版没有
- [x] [`257573b22`](https://github.com/meta/astryx/commit/257573b22) docs(AST-094, AST-057): motion guidance; gesture springs; swipe-row returns (#9915)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`7d6481ef3`](https://github.com/meta/astryx/commit/7d6481ef3) feat(core): createPanGesture and usePanGesture report a drag as values (spec:AST-107 FR1, FR6) (#8655)
- [x] [`0a1e6a080`](https://github.com/meta/astryx/commit/0a1e6a080) test(motion): the busy spring proof judges each frame's position, not its time (#10038)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1dce31829`](https://github.com/meta/astryx/commit/1dce31829) refactor(motion): core's shared theme-timing reader (#10068)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`87ed8d081`](https://github.com/meta/astryx/commit/87ed8d081) fix(cli): swizzle copies the private attribute owner modules a component imports (#10085)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`ecd652301`](https://github.com/meta/astryx/commit/ecd652301) fix(usePanGesture): write the onPan ref at commit (#10090)
- [ ] [`ceefccdfc`](https://github.com/meta/astryx/commit/ceefccdfc) feat(core): the animator's springs follow the theme's tempo (#8677)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`df15de7fc`](https://github.com/meta/astryx/commit/df15de7fc) docs(core): open the pan hook pages with a minimal draggable box (#9928)
- [ ] [`d6c1f340b`](https://github.com/meta/astryx/commit/d6c1f340b) docs(core): a "Motion & gestures" hook category for the motion hooks (#10076)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [x] [`b779b269c`](https://github.com/meta/astryx/commit/b779b269c) spec(Carousel): opt-in snap paging through useSnapPaging (#9666)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`5b54b834c`](https://github.com/meta/astryx/commit/5b54b834c) fix(DropdownMenu): on a phone or a tablet, a tap while the menu enters is ignored, as on iOS (#8458)
  - 暂缓：手机和平板上菜单进场时的点击被忽略：依赖进场输入遮挡，Vue 版没有
- [x] [`c33656a06`](https://github.com/meta/astryx/commit/c33656a06) test(motion): the busy spring proof reads every frame, with a second control half a leg ahead (#10099)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6180af62e`](https://github.com/meta/astryx/commit/6180af62e) test(core): the adopters' edge proofs read the module's clock (#10150)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ddb8b3462`](https://github.com/meta/astryx/commit/ddb8b3462) feat(ButtonGroup): a finger's slide runs the button it lifts on (#8657)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。ButtonGroup 手指滑动在松手处执行
- [ ] [`539326657`](https://github.com/meta/astryx/commit/539326657) chore(core): Core's internal touch entry names, for Lab, the screen-edge pan, spring solver, motion resolver, UIKit navigation springs and focus helpers (#9696)
- [x] [`841bcb8da`](https://github.com/meta/astryx/commit/841bcb8da) fix(Selector): a ghost or secondary trigger's clear and status buttons ring themselves, not the trigger too (#8874)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1ef21f898`](https://github.com/meta/astryx/commit/1ef21f898) fix(Spinner): route standalone loading through the shared announcement channel (#7910)
  - 暂缓：独立 Spinner 改为 progressbar 并统一经共用通道播报：需要逐个梳理把 Spinner 当装饰用的十几个组件（ComplexSelector、TimeField、TypeaheadMenu、CommandPaletteInput 等）并各自接忙碌播报；lab 的 Schedule 部分已在 #532
- [ ] [`ab7facf1e`](https://github.com/meta/astryx/commit/ab7facf1e) fix(core): spring roles register themselves when they load (#10138)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [ ] [`5985abc13`](https://github.com/meta/astryx/commit/5985abc13) fix(core): no press scale or card color fade under reduced motion (#8326)
- [x] [`e8957706b`](https://github.com/meta/astryx/commit/e8957706b) test(core): layout starts read back from the browser allow round-off (#10188)
  - 不适用：只改上游测试（自动初筛）

### v0.7.10

- [x] [`e9a5ca6e0`](https://github.com/meta/astryx/commit/e9a5ca6e0) fix(useImageMode): depend on region values, not object identity (#10183)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。useImageMode 按区域和阈值的数值重新采样，不按对象身份，补测试
- [x] [`e8ecde4ff`](https://github.com/meta/astryx/commit/e8ecde4ff) fix(core): a button's touch press release runs on the compositor (#9783)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`dc6dadbb7`](https://github.com/meta/astryx/commit/dc6dadbb7) fix(Toast): a quick flick dismisses a toast of any height (#8047)
- [ ] [`09a9bf337`](https://github.com/meta/astryx/commit/09a9bf337) feat(core): UIScrollView zoom constants and the zoom stage geometry (#8147)
  - 暂缓：依赖 UIKit 动效数值表与动效角色（motion/uikit），Vue 版没有这套设施
- [ ] [`add05168f`](https://github.com/meta/astryx/commit/add05168f) fix(core): a finger held on a control's box picks it, not the text (#10091)
- [ ] [`af2dcb686`](https://github.com/meta/astryx/commit/af2dcb686) fix(gestures): a pan on its own scroller takes a trackpad's scroll, as a finger's pan (spec:AST-094 FR43) (#10212)
- [ ] [`f5cf9a591`](https://github.com/meta/astryx/commit/f5cf9a591) feat(core): useFingerScroll tells its caller when a finger's scroll ends (#10172)
- [ ] [`a789c8cd7`](https://github.com/meta/astryx/commit/a789c8cd7) feat(core): createDragToSnapPoints and useDragToSnapPoints settle an element on snap points (#8658)
- [ ] [`a0fcc977c`](https://github.com/meta/astryx/commit/a0fcc977c) fix(SideNav): the collapse copy paints at the rail's own level, with no z-index escalation (#10145)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`f81f09df3`](https://github.com/meta/astryx/commit/f81f09df3) fix(CodeBlock, Carousel): the code viewport and the scroller draw the shared focus ring (#8875)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`07f8de58c`](https://github.com/meta/astryx/commit/07f8de58c) feat(core): Carousel's hasSnap takes useSnapPaging(), iOS paging on native snap's stops (#8153)
- [ ] [`306051090`](https://github.com/meta/astryx/commit/306051090) fix(core): gestures read another window's nodes and touches (#10224)
- [ ] [`0081c1165`](https://github.com/meta/astryx/commit/0081c1165) feat(lab): under a finger, NavigationStack's bar takes the iOS 26 look (#8396)
- [ ] [`8bd8c6146`](https://github.com/meta/astryx/commit/8bd8c6146) fix(core): layout glides play the theme's move curve, not a spring (#10236)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`0c168a374`](https://github.com/meta/astryx/commit/0c168a374) feat(Lightbox): touch zoom like the iOS Photos viewer (#8148)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b8ae86f94`](https://github.com/meta/astryx/commit/b8ae86f94) fix(core): a BottomSheet touch drag's close keeps its speed, and its scrim fades with it (#8105)
  - 暂缓：BottomSheet 触屏拖动关闭依赖弹簧、animator 和触屏呈现设施
- [ ] [`6750b6688`](https://github.com/meta/astryx/commit/6750b6688) chore(core): Lab's PageControl reaches the shared animator, the Reduce Motion cross-fade and the touch hit area through Core's internal touch entry (#9669)
- [ ] [`79cc4ac77`](https://github.com/meta/astryx/commit/79cc4ac77) fix(core): a gesture on a gliding element lands where it is drawn (#10239)
  - 暂缓：依赖触屏手势与动画器基础设施（GestureArena、PressTracker、animator），Vue 版没有

### v0.7.11

- [x] [`94c87afc4`](https://github.com/meta/astryx/commit/94c87afc4) test(core): the edge reveal proofs hold the reveal at fixed times (#10259)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a19128275`](https://github.com/meta/astryx/commit/a19128275) chore(core): the layer runtime's exit copy, for a touch presentation's close (#8186)
  - 暂缓：图层运行时的退出副本服务于触屏呈现的关闭动效，属于触屏呈现设施
- [ ] [`5e67f0874`](https://github.com/meta/astryx/commit/5e67f0874) feat(Popover): under a finger, it grows out of its trigger and shrinks back into it (#8187)
  - 暂缓：Popover 触屏从触发器长出来，属于触屏呈现设施
- [x] [`a26f7c452`](https://github.com/meta/astryx/commit/a26f7c452) fix(Calendar, DateRangeInput): today is read after hydration, so a server in another zone no longer causes a mismatch (#10226)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。Calendar 的今天在接管服务端 HTML 之后才读，服务端和浏览器不同日期也不再对不上，补水合测试
- [x] [`e348759a9`](https://github.com/meta/astryx/commit/e348759a9) fix(core): a presentation resolves with no matchMedia, as in a test DOM (#10275)
  - 不适用：presentation 在没有 matchMedia 时的解析，Vue 版没有 presentation
- [ ] [`3c63e6e18`](https://github.com/meta/astryx/commit/3c63e6e18) fix(core): the layout glide takes --duration-medium (#10261)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`6309b0b38`](https://github.com/meta/astryx/commit/6309b0b38) fix(core): a BottomSheet touch release takes UIKit's sheet values, and turning back cancels (#10234)
  - 暂缓：BottomSheet 触屏松手取 UIKit 数值，依赖 resolveSnapPoint 和触屏呈现设施
- [ ] [`74eb2160c`](https://github.com/meta/astryx/commit/74eb2160c) docs(layer-runtime, Popover): name settledBox's readers; fix comments (#10300)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`3bd5a4c1b`](https://github.com/meta/astryx/commit/3bd5a4c1b) fix(Layer): a still mouse presses through an entrance's input hold (#10303)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`5a323635e`](https://github.com/meta/astryx/commit/5a323635e) fix(core): CodeBlock says when a copy fails (#10272)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。CodeBlock 复制失败时按钮变叉、名字提示播报失败，新增 copyFailedLabel 和 copyError，补测试和文档
- [x] [`6d9b90127`](https://github.com/meta/astryx/commit/6d9b90127) test(core): the retarget proofs read both places on the change's clock (#10313)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0a2ab0526`](https://github.com/meta/astryx/commit/0a2ab0526) test(SnapPaging): the resting offset waits out a native smooth scroll (#10321)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`85788840e`](https://github.com/meta/astryx/commit/85788840e) fix(DateInput): a wheel's turn from a tap, a key or the program plays the settle spring (#9924)
- [x] [`9eee3c4c5`](https://github.com/meta/astryx/commit/9eee3c4c5) fix(core): a held finger stops a paging settle on a busy page too (#10330)
  - Vue 版已有：手指按在正在停靠的行上立即接住，没有等待延时，不存在忙页面把按住读成轻点的情况
- [ ] [`e245db5fb`](https://github.com/meta/astryx/commit/e245db5fb) feat(core): the keyboard module's docked ride, the scroller's reveal and the tap route (#9776)
- [x] [`dad210217`](https://github.com/meta/astryx/commit/dad210217) test(core): the pager's busy-block proof judges against a control (#10291)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b07a83228`](https://github.com/meta/astryx/commit/b07a83228) test(core): the glide keeps advancing through a blocked main thread (#10229)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`4c5a84866`](https://github.com/meta/astryx/commit/4c5a84866) spec(AST-094): the record governs the pager in hooks/usePager.ts (#10374)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`0ecd324bf`](https://github.com/meta/astryx/commit/0ecd324bf) fix(core): a block-edge reveal slides its parts on the glide's frames (#10296)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`2d91b990f`](https://github.com/meta/astryx/commit/2d91b990f) chore(core): the tap route reads the shared press slop (#10389)
- [x] [`27aba94e8`](https://github.com/meta/astryx/commit/27aba94e8) test(core): the busy glide proof reads each glide on its own timeline (#10396)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5a6ed906f`](https://github.com/meta/astryx/commit/5a6ed906f) chore(Layer): name the gap a still mouse leaves, exactly (#10317)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`0ad1e8d5e`](https://github.com/meta/astryx/commit/0ad1e8d5e) fix(core): a Tall sheet reads focus inside an open shadow root (#10388)
- [ ] [`ed0adf308`](https://github.com/meta/astryx/commit/ed0adf308) fix(core): a Reduce Motion landing waits for a held fade (#10378)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)
- [x] [`67cf2afad`](https://github.com/meta/astryx/commit/67cf2afad) test(core): the swipe hand-on case reads the offset in the page (#10372)
  - 不适用：只改上游测试（自动初筛）
- [x] [`28270c143`](https://github.com/meta/astryx/commit/28270c143) test(interaction-harness): an armed hold names the motion it judges (#10386)
  - 不适用：只改上游测试（自动初筛）
- [x] [`43d485d83`](https://github.com/meta/astryx/commit/43d485d83) a resize that cuts a pager settle short still ends it (#10419)
  - Vue 版已有：停靠不被 resize 打断，总是走到 finish 把行交还原生滚动

### v0.7.12

- [ ] [`6cbcbf846`](https://github.com/meta/astryx/commit/6cbcbf846) fix(core): a press inside a scroll view highlights 150 ms after touch (#10260)
- [x] [`480c30c83`](https://github.com/meta/astryx/commit/480c30c83) test(core): an edge press in a pager settle stops the scene to press (#10428)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`36929ac92`](https://github.com/meta/astryx/commit/36929ac92) feat(List): animate row inserts, removals and moves through the animatedLayout handle (#8106)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`95572ae80`](https://github.com/meta/astryx/commit/95572ae80) fix(Layer): a press that went down before an input hold lifts through the hold's shield (#10398)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`72a355851`](https://github.com/meta/astryx/commit/72a355851) fix(Carousel): under snap paging, the edge buttons follow the held row (#10359)
- [x] [`1b8ce8613`](https://github.com/meta/astryx/commit/1b8ce8613) test(SnapPaging): the mid-settle resize case resizes from the page (#10473)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`78df0c20b`](https://github.com/meta/astryx/commit/78df0c20b) fix(Carousel): under snap paging, scroll calls move through the paging (#10384)
- [ ] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
- [x] [`bd6df76da`](https://github.com/meta/astryx/commit/bd6df76da) fix(useFocusTrap): a modal's first and last Tab stops count a radio group once, as the browser does (#10304)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。焦点陷阱把同名单选组算一站，补测试
- [x] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
  - 不适用：React context 在两份模块之间不共享的问题
- [x] [`a262a0cc4`](https://github.com/meta/astryx/commit/a262a0cc4) test(SnapPaging): an edge press waits on a settle a drag starts (#10476)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`39d5abc76`](https://github.com/meta/astryx/commit/39d5abc76) fix(core): a rebase toward the new rest shifts the curve whole (#10369)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`8484dc4ff`](https://github.com/meta/astryx/commit/8484dc4ff) test(interaction-harness): a pool leaves out a run that began too late (#10464)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a8195e032`](https://github.com/meta/astryx/commit/a8195e032) chore(core): Core's internal touch entry re-exports the action-group tracking hook, extended for Lab's TabBar, and a tab-bar string joins the catalog (#9699)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。tabBar 命名空间列入 coverage.mjs，lab TabBar 还没有 Vue 版
- [x] [`a4eca1690`](https://github.com/meta/astryx/commit/a4eca1690) fix(Popover): a dialog popover starts focus on an enabled tab stop (#10503)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。dialog 型 Popover 的初始焦点落在第一个可用的 Tab 停靠点
- [ ] [`f9889f0f0`](https://github.com/meta/astryx/commit/f9889f0f0) a finger that lands on a paging settle never reaches its content (#10370)
- [x] [`256e16e20`](https://github.com/meta/astryx/commit/256e16e20) chore(core): split the long output sentence in the group tracking test (#10515)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1e268c32c`](https://github.com/meta/astryx/commit/1e268c32c) fix(SnapPaging): a held row's travel follows a resize (#10425)
- [x] [`c8b4cba38`](https://github.com/meta/astryx/commit/c8b4cba38) test(Button, gestures): arm press holds and blocks before the gesture (#10521)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ccb4a6dca`](https://github.com/meta/astryx/commit/ccb4a6dca) test(SnapPaging): a trackpad swipe reaches the page as one gesture (#10526)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e855791f0`](https://github.com/meta/astryx/commit/e855791f0) fix(core): a calc() duration token times the press release clock (#10069)
  - 已移植：[#557](https://github.com/astryx-vue/astryx-vue/pull/557)。触屏松手淡出的时长认 calc() 写法，补测试；核心的主题时序读取器本身随动效设施暂缓
- [ ] [`afcba3b79`](https://github.com/meta/astryx/commit/afcba3b79) fix(core): a Switch at rest holds no compositing layer (#10542)
  - 暂缓：修的是 animator 的合成层释放，Vue 版没有 animator；Switch 的 CSS 过渡没有常驻合成层
- [x] [`209e06765`](https://github.com/meta/astryx/commit/209e06765) fix(Carousel): an edge button changes in the frame the held row leaves (#10523)
  - 已移植：[#518](https://github.com/astryx-vue/astryx-vue/pull/518)。边缘按钮在行离开边缘的同一帧切换
- [x] [`6a8338b40`](https://github.com/meta/astryx/commit/6a8338b40) test(core): the edge rides judge their curves at fixed times (#10514)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`695653f5d`](https://github.com/meta/astryx/commit/695653f5d) feat(ChatLayout): the composer rides the software keyboard (#8176)
- [x] [`521cfb483`](https://github.com/meta/astryx/commit/521cfb483) test(core): read the cross-fade landing at its write; pace snap releases (#10548)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`62bc7a2fe`](https://github.com/meta/astryx/commit/62bc7a2fe) fix(core): a swizzled copy shares the animated-layout, code-language and snap-paging brands (#10576)
- [ ] [`9a690d52b`](https://github.com/meta/astryx/commit/9a690d52b) fix(core): a finger stops a pager's goTo move at the touch (#10545)
- [ ] [`33cf413d0`](https://github.com/meta/astryx/commit/33cf413d0) fix(NavigationStack): fade the veil for a late finger-scroll report (#10540)
- [x] [`9e86adb57`](https://github.com/meta/astryx/commit/9e86adb57) test(core): the edge rides count each phase on its own reads (#10578)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f543ec7b3`](https://github.com/meta/astryx/commit/f543ec7b3) fix(gestures): read a finger's lift on the clock its moves came on (#10583)
- [ ] [`7b8dc581a`](https://github.com/meta/astryx/commit/7b8dc581a) fix(core): the calls from rest that one frame commits start at one time (#10584)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`dd09d678d`](https://github.com/meta/astryx/commit/dd09d678d) fix(menus): the keys and type-ahead reach a disabled row, which stays inert (#10160)
  - 暂缓：菜单的方向键、Home/End、翻页键和跳转要能走到禁用行（行仍然不可操作）：DropdownMenu、子菜单、ContextMenu、MoreMenu、NavHeadingMenu 各自有一套键盘逻辑和禁用行的 tabindex，要逐套改并重写对应用例，需要单独一个 PR
- [ ] [`46d181337`](https://github.com/meta/astryx/commit/46d181337) feat(Resizable): a resizable LayoutPanel slides closed and open under every pointer (#9989)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`88ba27908`](https://github.com/meta/astryx/commit/88ba27908) feat(Lightbox): swipe between gallery photos like Photos (#8197)
  - 暂缓：Lightbox 滑动翻页依赖 paging 数值、usePager 和手势设施
- [ ] [`92784f658`](https://github.com/meta/astryx/commit/92784f658) fix(core): a swizzled copy shares the package's per-page touch state (#10599)
- [ ] [`9218a4598`](https://github.com/meta/astryx/commit/9218a4598) fix(SnapPaging): a stop within half a step of the end is the end page (#10591)
- [x] [`c73b9e4f2`](https://github.com/meta/astryx/commit/c73b9e4f2) test(SnapPaging): the split-end cases wait for the skip before acting (#10627)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`916a8e2fa`](https://github.com/meta/astryx/commit/916a8e2fa) feat(Resizable): a pull past a limit rubber-bands and only the lift closes (#10292)
- [x] [`e89bdc881`](https://github.com/meta/astryx/commit/e89bdc881) feat(TreeList): the expand moves as one under a finger (#8088)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`619ffeb27`](https://github.com/meta/astryx/commit/619ffeb27) fix(core, richtext): no focus fade on text fields under a coarse pointer (#10611)
- [x] [`b87846c1d`](https://github.com/meta/astryx/commit/b87846c1d) test(interaction-harness): judge a play at the component's thresholds (#10501)
  - 不适用：只改上游测试（自动初筛）
- [x] [`bb3a4b2ae`](https://github.com/meta/astryx/commit/bb3a4b2ae) test(interaction-harness): read a WebKit lift at its pointerup (#10585)
  - 不适用：只改上游测试（自动初筛）
- [x] [`74f1fb96f`](https://github.com/meta/astryx/commit/74f1fb96f) fix(theme): a themed :active follows the touch press model (#10420)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`4043d65e5`](https://github.com/meta/astryx/commit/4043d65e5) feat(Lightbox): drag a photo down to close, like Photos (#8215)
  - 暂缓：Lightbox 下拉关闭依赖 UIKit 缩放媒体数值和手势设施
- [x] [`3b8eb80d1`](https://github.com/meta/astryx/commit/3b8eb80d1) fix(RefreshControl): the end plays UIKit's curve over the duration token (#10582)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f75f0f2d3`](https://github.com/meta/astryx/commit/f75f0f2d3) feat(ToggleButtonGroup): a finger's slide toggles the one it lifts on (#8660)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。ToggleButtonGroup 只切换松手处的成员
- [ ] [`fb2437f61`](https://github.com/meta/astryx/commit/fb2437f61) fix(Lightbox): the drag to close plays at the theme's tempo (#10630)
  - 暂缓：Lightbox 下拉关闭按主题节奏播放，依赖动效角色注册和手势设施
- [x] [`db40c6b01`](https://github.com/meta/astryx/commit/db40c6b01) refactor(core): share per-instance warning dedupe and temporary focus targets (#10655)
  - 不适用：上游把 React StrictMode 下的每实例警告去重和临时焦点目标收进共用模块；Vue 的 useDevWarning 已集中，焦点归还已在 internal/focusReturn
- [x] [`0d7557304`](https://github.com/meta/astryx/commit/0d7557304) feat(Table): add the window controller and Table's shared-geometry runtime (#10657)
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。表格窗口控制器随行虚拟化设施一起在 #547 完成
- [ ] [`2d7a3bcb9`](https://github.com/meta/astryx/commit/2d7a3bcb9) perf(SnapPaging): a settle samples its curve once, not once per item (#10568)
- [ ] [`a60baf519`](https://github.com/meta/astryx/commit/a60baf519) fix(core): ignore a pointerup with no pointerId when no press is held (#10695)
- [ ] [`a28d586eb`](https://github.com/meta/astryx/commit/a28d586eb) feat(core): createReorderable makes List rows reorderable (#8139)
  - 暂缓：createReorderable 依赖 animatedLayout、animator 和 inertClone 这套动效设施
- [ ] [`3fb73b3d4`](https://github.com/meta/astryx/commit/3fb73b3d4) fix(core): a spring retarget committed late starts at its frame (#10607)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`36b8f6ebc`](https://github.com/meta/astryx/commit/36b8f6ebc) feat(lab): TransferList reorders through core's createReorderable (#8143)
- [ ] [`df4c958ec`](https://github.com/meta/astryx/commit/df4c958ec) perf(core): motions one callback starts read stylesheets in one pass (#10728)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`6103d36e9`](https://github.com/meta/astryx/commit/6103d36e9) feat(lab): ListInput reorders through core's createReorderable (#8163)
- [x] [`74cb73c9f`](https://github.com/meta/astryx/commit/74cb73c9f) fix(useScrollableArea): an ancestor's transform no longer measures the scroll area again on every frame of a drag (#10034)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。祖先只改 transform 不再让滚动区每帧重新测量，只有方向、书写模式、显示、可见性变了才重量，补测试
- [x] [`bb576ef8f`](https://github.com/meta/astryx/commit/bb576ef8f) test(core): reveal-paint reads one moment and names starvation (#10556)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b6509b179`](https://github.com/meta/astryx/commit/b6509b179) fix(Popover): the touch growth shows its content from its first frame (#10757)
  - 暂缓：Popover 触屏生长的首帧内容可见，属于触屏呈现设施
- [x] [`ff7e096ba`](https://github.com/meta/astryx/commit/ff7e096ba) fix(ScrollableArea): complete hardening audit (#6314)
  - Vue 版已有：useScrollableArea 已用 focusin/focusout 跟踪视口焦点、有尺寸为 0 就保留上次结果的保护、登记表按元素注销
- [x] [`a1dabb30c`](https://github.com/meta/astryx/commit/a1dabb30c) fix(interaction-harness): WebKit busy proofs date frames on the controls (#10772)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6caeec86c`](https://github.com/meta/astryx/commit/6caeec86c) fix(useClipboard): a failed copy is announced assertively (#10448)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。复制失败走 assertive 播报，补测试
- [x] [`117bc6ead`](https://github.com/meta/astryx/commit/117bc6ead) [Component Audit] Lightbox: screen readers hear the open viewer, and 0 resets the zoom (#10775)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6ad0656a3`](https://github.com/meta/astryx/commit/6ad0656a3) test(motion): a retarget behind a block fails by name when starved (#10784)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c28d28649`](https://github.com/meta/astryx/commit/c28d28649) test(usePager): judge the report two frames into the settle, not 20 ms (#10778)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`d5b0bdaa1`](https://github.com/meta/astryx/commit/d5b0bdaa1) chore(core): re-export the scroll test and add the More tab's string (#10791)
- [x] [`a257f8664`](https://github.com/meta/astryx/commit/a257f8664) spec(AST-094): evidence carries across a main merge that touches none of the PR's files, direct imports or shared motion and layer modules (DEC-31) (#10857)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9ea776e22`](https://github.com/meta/astryx/commit/9ea776e22) fix(motion): WebKit draws a glide's last frame at its place (#10663)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [ ] [`e909dbff0`](https://github.com/meta/astryx/commit/e909dbff0) fix(SnapPaging): the pager's held stops and span take each translate off (#10860)
- [x] [`a0e0536f3`](https://github.com/meta/astryx/commit/a0e0536f3) test(motion): a retarget's hand-off frame may show its held start (#10866)
  - 不适用：只改上游测试（自动初筛）
- [x] [`d53cec5c7`](https://github.com/meta/astryx/commit/d53cec5c7) docs(useClickableContainer): a pressable surface without Card chrome (#10880)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。useClickableContainer 文档补不带 Card 外观的可按表面做法（中英）
- [x] [`3239571ce`](https://github.com/meta/astryx/commit/3239571ce) test(interaction-harness): a wheel burst splits at a gap of maxGapMs (#10782)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1f9217f0c`](https://github.com/meta/astryx/commit/1f9217f0c) fix(Selector): a required search Selector puts aria-required where it is allowed (#10878)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。带搜索的 Selector、MultiSelector 触发器不再带 aria-required
- [ ] [`a1fda63c7`](https://github.com/meta/astryx/commit/a1fda63c7) fix(core): typing in a touch dialog's field no longer opens the trigger's tooltip on returned focus (#10639)
- [x] [`0840fcc47`](https://github.com/meta/astryx/commit/0840fcc47) fix(core): page scroll and selection locks are one per page across Core loads (AST-110 FR3) (#10822)
  - 不适用：上游是同一页面里多份 Core 加载时共用一把锁；Vue 版是单份模块，这套锁和触屏判断都在一份里
- [ ] [`0b39dd9e6`](https://github.com/meta/astryx/commit/0b39dd9e6) feat(BaseTypeahead, Typeahead): a menu config with listbox and dialog roles, and an open handle (#10544)
  - 暂缓：BaseTypeahead 与 Typeahead 的 menu 配置（listbox、dialog 角色和 open 句柄）是选择器族的新公开接口，Vue 版 Typeahead 不基于 usePopover，需随选择器族一并做

### v0.7.13

- [x] [`7e1aab38b`](https://github.com/meta/astryx/commit/7e1aab38b) fix(BottomSheet): a slow swipe down on the sheet's content no longer rubber-bands the content under the finger on iOS (#10033)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`653c03bf6`](https://github.com/meta/astryx/commit/653c03bf6) fix(core): a swizzled component and the package announce through one pair of live regions (AST-110 FR3) (#10996)
  - 不适用：上游是源码拷贝（swizzle）出来的组件和包共用一对播报区域；Vue 版没有源码拷贝
- [ ] [`cc5ff492c`](https://github.com/meta/astryx/commit/cc5ff492c) fix(core): the layer runtime is one per page across swizzled copies (AST-110 FR3) (#10998)
- [x] [`d82104d03`](https://github.com/meta/astryx/commit/d82104d03) test(animator): hold the spring curve's seek as soon as it runs (#10960)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`549a6252a`](https://github.com/meta/astryx/commit/549a6252a) fix(SnapPaging): a held stop reads its item's translate on both sides (#10992)
- [x] [`e68ec08f2`](https://github.com/meta/astryx/commit/e68ec08f2) test(motion): the busy glide's block waits a frame for the compositor (#10987)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a91c7658d`](https://github.com/meta/astryx/commit/a91c7658d) test(gestures): send a trackpad scroll as one paced wheel burst (#10989)
  - 不适用：只改上游测试（自动初筛）

### v0.7.14

- [ ] [`038b0a7d7`](https://github.com/meta/astryx/commit/038b0a7d7) fix(core): layout motion, spinner rotors and gesture sync are one per page across swizzled copies (AST-110 FR3) (#11027)
  - 暂缓：依赖尺寸变化滑动设施（animatedLayout，spec AST-105），Vue 版没有
- [x] [`b1566fdcf`](https://github.com/meta/astryx/commit/b1566fdcf) feat(agents): add a Claude Code and Codex marketplace that installs the Astryx skill (#10974)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`9f4ff7bbd`](https://github.com/meta/astryx/commit/9f4ff7bbd) test(TreeList): proofs read each motion as it starts, or name a starved page (#10994)
  - 不适用：只改上游测试（自动初筛）
- [x] [`256998959`](https://github.com/meta/astryx/commit/256998959) test(SnapPaging): edge-move touches land on the scene's clock (#11068)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`894a2a0b2`](https://github.com/meta/astryx/commit/894a2a0b2) fix(motion): a carried pending animation runs in step with its original (#10983)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`c7ba4dec1`](https://github.com/meta/astryx/commit/c7ba4dec1) spec(AST-094): the evidence-carry check lists motion/carryAnimations as a shared motion module (#11103)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`421678d14`](https://github.com/meta/astryx/commit/421678d14) fix(core): focus traps and the keyboard model are one per page across swizzled copies (AST-110 FR3) (#10831)
- [x] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
  - 不适用：React Server Components 的 use client 指令
- [ ] [`e01c68b9c`](https://github.com/meta/astryx/commit/e01c68b9c) feat(SegmentedControl): a drag that drifts off keeps choosing (#10978)
  - 暂缓：SegmentedControl 拖离后继续选择：Vue 的 SegmentedControl 还没有接上手指滑动选择（动作组跟踪），要先接上它才有单轴漂移规则可移植
- [ ] [`392750b20`](https://github.com/meta/astryx/commit/392750b20) refactor(core): the internal finger-scroll reader accepts a ref that names the document (#10883)
- [x] [`9a3f29608`](https://github.com/meta/astryx/commit/9a3f29608) fix(useKeyboardHint): the arrow-key hint stays until dismissed, and Escape closes it (#10564)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。useKeyboardHint 默认不再 3 秒后消失，Escape 只关提示
- [ ] [`04a0e6c11`](https://github.com/meta/astryx/commit/04a0e6c11) fix(core): toast ids are one sequence across swizzled copies (AST-110 FR3) (#11092)
- [x] [`ebb9ddecc`](https://github.com/meta/astryx/commit/ebb9ddecc) fix(ScrollableArea): a focus move inside the area adds no commit (#11135)
  - 不适用：上游是 React 里 setState 同值仍多渲染一次；Vue 的 ref 同值赋值不触发更新
- [ ] [`f27380ab3`](https://github.com/meta/astryx/commit/f27380ab3) feat(TimeInput): the minute wheel loops under a finger, as on iOS (#10953)
- [ ] [`c1a1ea82b`](https://github.com/meta/astryx/commit/c1a1ea82b) fix(core): a tap that wobbles at a scroll edge keeps its click (#10829)
- [x] [`d9d7b105f`](https://github.com/meta/astryx/commit/d9d7b105f) feat(DropdownMenu): a finger or a pen opens the menu as it presses (#8078)
  - Vue 版已有：菜单按压状态机里手指或笔按满长按时间在指针下面打开菜单、松开按落点选行
- [x] [`4245f384a`](https://github.com/meta/astryx/commit/4245f384a) fix(Popover): focus entry takes the first content control in document order (#11177)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。Popover 初始焦点按文档顺序取第一个可用控件，补测试

### v0.7.15

- [ ] [`f8f9ce98a`](https://github.com/meta/astryx/commit/f8f9ce98a) feat(SegmentedControl): under a finger, the selected surface lifts (#9724)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [ ] [`b8835b84f`](https://github.com/meta/astryx/commit/b8835b84f) fix(gestures): each document's gesture host reads that window's clock (#11155)
- [x] [`5770e5b19`](https://github.com/meta/astryx/commit/5770e5b19) fix(DropdownMenu): a cancelled touch clears the row a finger lit (#8508)
  - Vue 版已有：菜单按压状态机的 cancel 走 settle，清掉被点亮的行，不执行任何行
- [x] [`16d7f397a`](https://github.com/meta/astryx/commit/16d7f397a) fix(focus region): leave Ctrl+Tab and Meta+Tab to the page (#11247)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。Ctrl+Tab、Meta+Tab 留给浏览器，补测试
- [x] [`48eec7aa1`](https://github.com/meta/astryx/commit/48eec7aa1) fix(core): a swizzled AppShell's first Tab stop matches the package's around package scroll regions (AST-110 FR3) (#11225)
  - 不适用：上游是源码拷贝出来的 AppShell 和包共用滚动归属表；Vue 版没有源码拷贝
- [x] [`ac1a569b2`](https://github.com/meta/astryx/commit/ac1a569b2) fix(Tokenizer): removing a token with a finger leaves the keyboard down (#8160)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`fa1938483`](https://github.com/meta/astryx/commit/fa1938483) fix(useStreamingText): keep where the reveal restarts in state (#10862)
  - 不适用：上游是 React 丢弃渲染会弄脏 ref 里的状态；Vue 没有丢弃渲染
- [x] [`e7e9af2f8`](https://github.com/meta/astryx/commit/e7e9af2f8) feat(core): a mouse or pen press on a checkbox or a radio option paints at once and fades on release (#8696)
  - 已移植：[#536](https://github.com/astryx-vue/astryx-vue/pull/536)。鼠标或笔按在复选框、单选项上立即画按压并在松开时淡出
- [x] [`3d19fc8cc`](https://github.com/meta/astryx/commit/3d19fc8cc) perf(cli): keep search's gathered catalog between runs while its inputs are unchanged (#11251)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ad0c43a97`](https://github.com/meta/astryx/commit/ad0c43a97) docs(spec): AST-094 DEC-31 owner amendment, side-by-side re-checks after a device pass (#11172)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`548f26c7c`](https://github.com/meta/astryx/commit/548f26c7c) spec(BottomSheet): a changed sheet waits at a peek while the discard dialog asks (DEC-5) (#11095)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b5b920726`](https://github.com/meta/astryx/commit/b5b920726) fix(cli): doctor says a run under Plug'n'Play keeps no catalogs (#11299)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f980d1c6a`](https://github.com/meta/astryx/commit/f980d1c6a) fix(core): a resize during a pager's settle keeps where it was heading (#10592)
  - Vue 版已有：翻页停靠只记目标偏移量，不记页号，resize 后不会跑回前一页；停稳后交还原生吸附
- [x] [`2605d994d`](https://github.com/meta/astryx/commit/2605d994d) fix(cli): keep jiti's transpiled code in the per-user cache folder (#11360)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`807dc2ead`](https://github.com/meta/astryx/commit/807dc2ead) refactor(core): name the nested press rule for every pointer it covers (#11304)
  - 不适用：上游只改嵌套按压规则的命名并挪样式，没有行为变化
- [x] [`1740654b7`](https://github.com/meta/astryx/commit/1740654b7) feat(core): add the internal useCommittedRef hook for latest-value refs (#11352)
  - 不适用：React 里读最新值的内部 ref hook，Vue 的 ref 没有这个问题
- [x] [`6ef8ba1d4`](https://github.com/meta/astryx/commit/6ef8ba1d4) perf(cli): keep each integration's contribution-check results between runs (#11367)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`ca204372b`](https://github.com/meta/astryx/commit/ca204372b) chore(core): re-export UIKit's timing, add SearchField's cancel string (#10956)
- [ ] [`e5984b235`](https://github.com/meta/astryx/commit/e5984b235) fix(useMobileKeyboard): sync its option flags at commit (#10914)
- [ ] [`17fcb15da`](https://github.com/meta/astryx/commit/17fcb15da) feat(core): one shared context request from a long press, a right click and Shift+F10 (#8670)
- [ ] [`eec79323c`](https://github.com/meta/astryx/commit/eec79323c) fix(Text, Tooltip): on Android, the first tap on a button or link in truncated text opens its tooltip; a tap on a text field never does (#11213)
- [x] [`a65ea05e5`](https://github.com/meta/astryx/commit/a65ea05e5) fix(useMenuPress): sync its gesture refs at commit (#10901)
  - 不适用：React 里把手势 ref 在提交时同步；Vue 的手势状态是普通变量

### v0.7.16

- [ ] [`06b7e61f5`](https://github.com/meta/astryx/commit/06b7e61f5) feat(core): the shared drag path takes a component's own drag (#9720)
- [ ] [`badd6984b`](https://github.com/meta/astryx/commit/badd6984b) chore(core): the animator takes start: 'next-frame' in an input event (#9261)
  - 暂缓：依赖动画器（animator）与主题时序/节奏的动效基础设施，Vue 版没有
- [x] [`a4595efa9`](https://github.com/meta/astryx/commit/a4595efa9) fix(menu press): cancel only the lifted finger's touchend (#11164)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。只取消挑选那根手指的 touchend，别的手指和浏览器当作滚动的 touchend 不碰，补测试
- [x] [`2fa328089`](https://github.com/meta/astryx/commit/2fa328089) perf(cli): keep doctor's file-only docs checks between runs (#11394)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`2f2ccc79d`](https://github.com/meta/astryx/commit/2f2ccc79d) fix(lab): a TourStep points at any element and leaves the page usable (#11123)
- [x] [`f8afd0f33`](https://github.com/meta/astryx/commit/f8afd0f33) test(SnapPaging): the resize-mid-settle case starts at the row end (#11327)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9b1e4893a`](https://github.com/meta/astryx/commit/9b1e4893a) perf(cli): keep template discovery's records between runs (#11393)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`717762759`](https://github.com/meta/astryx/commit/717762759) perf(cli): keep each integration's discovered themes between runs (#11469)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3aa244b69`](https://github.com/meta/astryx/commit/3aa244b69) perf(cli): docs reads the kept integration checks (#11483)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`36ed7cc4b`](https://github.com/meta/astryx/commit/36ed7cc4b) fix(useContainerReveal): a touchscreen laptop used with a mouse reveals on hover (#11218)
  - Vue 版已有：useContainerReveal 用 (pointer: coarse) 判断，有测试
- [x] [`12a96e4eb`](https://github.com/meta/astryx/commit/12a96e4eb) fix(Toast): announce rendered message text (#11175)
  - Vue 版已有：Toast 卡片自带 role 和 aria-live 且在常驻的 aria-live 视口里渲染，读屏念的就是渲染出来的内容，没有从节点取文字的路径
- [ ] [`22213fd97`](https://github.com/meta/astryx/commit/22213fd97) fix(BottomSheet): a flick's close clears the scrim along the same spring (#11400)
  - 暂缓：BottomSheet 轻扫关闭的遮罩跟弹簧走，依赖 animator 和触屏呈现设施

### v0.7.17

- [x] [`8e39a4a42`](https://github.com/meta/astryx/commit/8e39a4a42) feat(cli): docs points to the command that reads a component, hook or template (#11553)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a05d31428`](https://github.com/meta/astryx/commit/a05d31428) spec(AST-094): DEC-31 keeps device evidence across a merge that only regenerates generated files (#11580)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`96ea82334`](https://github.com/meta/astryx/commit/96ea82334) perf(cli): keep the component list between runs, like template discovery's records (#11577)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`90abc74ea`](https://github.com/meta/astryx/commit/90abc74ea) perf(cli): keep doctor's theme-wiring scan between runs, like its docs checks (#11579)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bb105e57d`](https://github.com/meta/astryx/commit/bb105e57d) [fix] useHotkeys docs: register shifted punctuation as the produced character (#11622)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。useHotkeys 文档说明带 Shift 的标点按产生的字符登记（中英）
- [ ] [`1addd72da`](https://github.com/meta/astryx/commit/1addd72da) feat(core): swipe actions come from createSwipe on the shared drag path (#8690)
- [x] [`24d82491d`](https://github.com/meta/astryx/commit/24d82491d) spec(AST-094): DEC-31 states the owner's test-only and records-only carry (#11602)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`6da757802`](https://github.com/meta/astryx/commit/6da757802) perf(cli): keep gathers and the compile cache from a machine's first run (#11668)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`33819b3fc`](https://github.com/meta/astryx/commit/33819b3fc) spec(AST-094): DEC-31 names .changeset release notes beside knowledge records (#11692)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`cb60a4fb8`](https://github.com/meta/astryx/commit/cb60a4fb8) perf(cli): keep component replacement between runs with the component list (#11688)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`94415ba5d`](https://github.com/meta/astryx/commit/94415ba5d) perf(cli): theme build keeps transpiled theme sources in the per-user cache, which stays within its size limit (#11705)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`49a475fbd`](https://github.com/meta/astryx/commit/49a475fbd) test: split door-conformance, global-local and packed-gather-cache.records so the Node legs can spread them (#11699)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4800d992e`](https://github.com/meta/astryx/commit/4800d992e) feat(AlertDialog): touch motion on the theme's timing (#8373)
  - 暂缓：AlertDialog 触屏动效按主题时序，依赖主题时序读取器和触屏呈现设施
- [x] [`dc9b62a32`](https://github.com/meta/astryx/commit/dc9b62a32) perf(cli): docs keeps the CLI's own docs tree between runs (#11775)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`c3916438e`](https://github.com/meta/astryx/commit/c3916438e) chore(core): the swipe hook's and layer's prose moves to their JSDoc (#11677)
- [x] [`bac58372c`](https://github.com/meta/astryx/commit/bac58372c) feat(cli): one did-you-mean rule points every lookup to the command that has the name (#11707)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`178cd8019`](https://github.com/meta/astryx/commit/178cd8019) perf(OverflowList): lists in one commit measure together after it, before paint (#10392)
  - 不适用：上游是 React 提交后统一测量的性能调整
- [x] [`30b12dd5a`](https://github.com/meta/astryx/commit/30b12dd5a) fix(Item, Token): a control inside a row with its own action, or a token's Remove, rings itself (#8869)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c3d24e124`](https://github.com/meta/astryx/commit/c3d24e124) fix(Comments): a failed comment-link copy shows and announces itself (#10435)
  - 已移植：[#550](https://github.com/astryx-vue/astryx-vue/pull/550)。评论链接复制失败时按钮变叉、名字提示播报失败，补测试
- [x] [`64806d0bd`](https://github.com/meta/astryx/commit/64806d0bd) test(Item): the swipe's busy proof judges a held release by its curve (#11735)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f325da080`](https://github.com/meta/astryx/commit/f325da080) perf(cli): theme build keeps what it checks a theme against in Core's docs (#11798)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4fdc22f60`](https://github.com/meta/astryx/commit/4fdc22f60) fix(cli): component did-you-mean suggests installed integration components and near names typed with separators (#11861)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bf8555451`](https://github.com/meta/astryx/commit/bf8555451) fix(useFocusTrap): Tab stops inside a closed dialog the page displays (#11892)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。焦点陷阱不算页面不显示的关着的 dialog 里的控件，显示着的关着的 dialog 里的照算，补测试
- [x] [`4213897c7`](https://github.com/meta/astryx/commit/4213897c7) perf(cli): an integration package's check of itself keeps npm's list of the files it packs (#11903)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`27bb774ac`](https://github.com/meta/astryx/commit/27bb774ac) feat(cli): astryx template writes a scratch copy to a path in the system temp folder (#11915)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f69c8798a`](https://github.com/meta/astryx/commit/f69c8798a) perf(cli): a run's debug record keeps its locale and time zone between runs on Linux (#11930)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`06db887c0`](https://github.com/meta/astryx/commit/06db887c0) perf(cli): theme build keeps what its css-tree checks of a theme's keys find (#11961)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ed1594c95`](https://github.com/meta/astryx/commit/ed1594c95) fix(cli): leave a compile cache Node already uses as it is (#11969)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`fb7e4afff`](https://github.com/meta/astryx/commit/fb7e4afff) fix(cli): in a Yarn Plug'n'Play project, a copy started outside the project's runtime hands the run to the project's own CLI (#11972)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`0f4c0aa48`](https://github.com/meta/astryx/commit/0f4c0aa48) fix(cli): a fresh clone that lists the CLI is told to install its dependencies (#11986)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`dd94472a9`](https://github.com/meta/astryx/commit/dd94472a9) perf(cli): theme build keeps the JavaScript it compiles from a theme's local modules (#11954)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f80af6354`](https://github.com/meta/astryx/commit/f80af6354) perf(cli): kept gathers leave the CLI's own files to its build id and folder (#11998)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`118dcc589`](https://github.com/meta/astryx/commit/118dcc589) docs(cli): the computer-level skill starts a page with build (#12037)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`90edc6fa2`](https://github.com/meta/astryx/commit/90edc6fa2) fix(core): copy works in a frame that does not allow the async Clipboard API (#12035)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。复制在不允许异步剪贴板的框架里改用浏览器的复制命令，补测试和文档
- [x] [`c453f14e3`](https://github.com/meta/astryx/commit/c453f14e3) fix(cli): printed add and upgrade commands keep a project's exact pins (#12006)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`33a2d4568`](https://github.com/meta/astryx/commit/33a2d4568) perf(cli): a run that keeps catalogs loads the CLI's own modules by path (#12066)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`34e3d212f`](https://github.com/meta/astryx/commit/34e3d212f) fix(core): dialog text reads the theme, and toast text reaches AA on its card (#12095)
  - Vue 版已有：dialog.css 的文字色读 --astryx-dialog-foreground，各主题映射到主文字色；Toast 色由主题变量给出
- [x] [`c44a63778`](https://github.com/meta/astryx/commit/c44a63778) feat(cli): bases, first step — a run reads one base; steps it does not serve are hidden and refused (#11111)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d6f6295da`](https://github.com/meta/astryx/commit/d6f6295da) perf(cli): keep each shipped doc's parse, and build doc schemas on first parse (#12166)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ead908dc6`](https://github.com/meta/astryx/commit/ead908dc6) fix(cli): the project update notice upgrades every package released with Core (#12091)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`cb315c6ae`](https://github.com/meta/astryx/commit/cb315c6ae) docs(architecture): press feedback has one engine and three recipes (#12115)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`d504f0094`](https://github.com/meta/astryx/commit/d504f0094) feat(TextInput, TextArea, NumberInput): fields stay above the keyboard (#9777)
- [x] [`1939759f5`](https://github.com/meta/astryx/commit/1939759f5) [feat] cli: discover matches word by word, names Core's match on a miss (#12219)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`da1d07b4d`](https://github.com/meta/astryx/commit/da1d07b4d) test(SnapPaging): a held row's stops hold through a retarget (#10927)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f04fbf9f6`](https://github.com/meta/astryx/commit/f04fbf9f6) fix(cli): a failed release install waits only for the registry it failed with (#12347)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b7f61b795`](https://github.com/meta/astryx/commit/b7f61b795) fix(cli): outside a project, a page takes the packages its host's set lists (#12057)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a6538f27a`](https://github.com/meta/astryx/commit/a6538f27a) feat(cli): an integration can say how its apps add a dependency (installGuidance) (#12218)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`ee8a33a7c`](https://github.com/meta/astryx/commit/ee8a33a7c) feat(cli): the swipe codemod defines each swipe once (#11670)
- [x] [`8b176db24`](https://github.com/meta/astryx/commit/8b176db24) perf(cli): a lookup miss reads the component matcher's Core inputs from a kept summary instead of every Core doc (#12538)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`286e4db56`](https://github.com/meta/astryx/commit/286e4db56) fix(cli): the transpile cache names copies for their source text and trims one subfolder per write, so it stays small and no run reads all of it (#12385)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1a54235b4`](https://github.com/meta/astryx/commit/1a54235b4) fix(cli): the setup reminder prints first and says why to run init now (#12544)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`21d736bb0`](https://github.com/meta/astryx/commit/21d736bb0) feat(cli): doctor's kept-cache row prints a short brief; --json keeps the whole message (#12607)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`dbfa703ca`](https://github.com/meta/astryx/commit/dbfa703ca) feat(cli): astryx init --to puts the Astryx skill where your agents read it (#12264)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`20a222df6`](https://github.com/meta/astryx/commit/20a222df6) test(useAnnounce): load the DropdownMenu sheet's two chunks before the bottom-sheet case (#12678)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f939a6f90`](https://github.com/meta/astryx/commit/f939a6f90) fix(core): type-to-select takes a letter typed with AltGr (#12644)
  - Vue 版已有：useTypeahead 和 useTreeFocus 用 isShortcutChord 加 AltGraph 判断，AltGr 敲出的字母照样跳转
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [x] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`f672a82de`](https://github.com/meta/astryx/commit/f672a82de) chore(core): the internal touch entry exposes group press tracking to Lab (#11283)
- [x] [`9cd6c4482`](https://github.com/meta/astryx/commit/9cd6c4482) [Component Audit] OverflowList: items and the overflow indicator are no longer cut off in themes with a different spacing scale (#12401)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。OverflowList 按浏览器实际排出的间距折叠，换了间距阶梯的主题里项和指示器不再被截，补测试和文档
- [x] [`8554b67ed`](https://github.com/meta/astryx/commit/8554b67ed) chore: land batch 5 (7 pull requests) (#12818)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7ab188c90`](https://github.com/meta/astryx/commit/7ab188c90) docs(AST-094): DEC-31's verification row names the gesture arena and host (#12101)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
- [x] [`226afd33b`](https://github.com/meta/astryx/commit/226afd33b) chore: land batch 10 (3 pull requests) (#12844)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。带搜索的多选触发器不再带 aria-required
- [x] [`472896d35`](https://github.com/meta/astryx/commit/472896d35) fix(Toolbar, OverflowList): a start lane's own OverflowList folds beside the end lane (#12238)
  - 已移植：[#548](https://github.com/astryx-vue/astryx-vue/pull/548)。Toolbar 首部直接放 OverflowList 时占满尾部让出的宽度、折叠让位；全部放得下时不给指示器留位置，补测试
- [x] [`d60793cbc`](https://github.com/meta/astryx/commit/d60793cbc) chore: land batch 18 (2 pull requests) (#12882)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。粗指针设备上横向能滚时藏着内容的一侧淡出
- [x] [`e9b125444`](https://github.com/meta/astryx/commit/e9b125444) chore: land batch 24 (3 pull requests) (#12883)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`75649f57f`](https://github.com/meta/astryx/commit/75649f57f) chore: land batch 30 (4 pull requests) (#12901)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7efbb4e57`](https://github.com/meta/astryx/commit/7efbb4e57) fix(Toast): a Toast rendered on its own holds no live role (#11960)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`42190cea6`](https://github.com/meta/astryx/commit/42190cea6) fix(Tooltip): script focus after a pointer press opens no tooltip on a non-text trigger (#11782)
- [x] [`49473f0a2`](https://github.com/meta/astryx/commit/49473f0a2) chore: land batch 68 (1 pull requests) (#12958)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ab9aaa5a2`](https://github.com/meta/astryx/commit/ab9aaa5a2) chore: land batch 70 (2 pull requests) (#12963)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Tokenizer、Typeahead 新增 statusVariant，框内画状态图标
- [x] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。键盘视口与限高的部分
- [x] [`c1c5cdf03`](https://github.com/meta/astryx/commit/c1c5cdf03) chore: land batch 89 (1 pull requests) (#13028)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`416b167cf`](https://github.com/meta/astryx/commit/416b167cf) fix(core): one focus return for Popover and DropdownMenu (popover presentation) and Dialog that never strands focus (AST-116 FR17–FR21, AR1) (#11121)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。Popover 与 Dialog 共用一套焦点归还，焦点不会掉到 body
- [x] [`2f23f1241`](https://github.com/meta/astryx/commit/2f23f1241) chore: land batch 95 (1 pull requests) (#13046)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c1eeb636b`](https://github.com/meta/astryx/commit/c1eeb636b) chore: land batch 94 (2 pull requests) (#13045)
  - 不适用：上游内部规范和架构文档（自动初筛）

## 实验包：图表与编辑器（area:lab）

### v0.7.2

- [x] [`97a00379a`](https://github.com/meta/astryx/commit/97a00379a) feat(lab): DiffViewer — unified/split file diff for code review (#7536)
  - Vue 版已有：DiffViewer 已移植（packages/lab/src/DiffViewer），统一和分栏视图、批注、行号点击都有
- [x] [`280c48a82`](https://github.com/meta/astryx/commit/280c48a82) feat(lab): createDiffFile builds a DiffViewer file from two versions of a text (#7565)
  - Vue 版已有：createDiffFile 已有（packages/lab/src/DiffViewer/createDiffFile.ts）
- [x] [`a09889314`](https://github.com/meta/astryx/commit/a09889314) feat(lab): DiffViewer display options — change bars, inline highlight, row tint toggle, fixed split with synced scrolling (#7589)
  - Vue 版已有：changeIndicator、inlineHighlight、hasChangeBackground 和固定分栏同步滚动已有，有对应测试

### v0.7.5

- [ ] [`fabf5e699`](https://github.com/meta/astryx/commit/fabf5e699) feat(Markdown, RichText, DiffViewer): codeLanguages lists CodeBlock language values (#8489)
  - 暂缓：依赖 core CodeBlock 的语言值（CodeLanguage、createCodeLanguage，富文本族的 4adaeda93），Vue 版还没有

### v0.7.6

- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f7a8f7085`](https://github.com/meta/astryx/commit/f7a8f7085) fix(CodeEditor): code and its line numbers stay left-to-right in a right-to-left page (#9363)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。CodeEditor 的代码区 dir=ltr、占位提示 dir=auto，补测试
- [x] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
  - Vue 版已有：基础展示族已在 #505 移植：不截断的 Text 里长串会换行，LogStream 沿用
- [x] [`168011f26`](https://github.com/meta/astryx/commit/168011f26) fix(CodeEditor): draw the border and gutter divider its styles declare (#9427)
  - Vue 版已有：code-editor.css 本来就画 1px 边框和行号分隔线
- [x] [`437f54847`](https://github.com/meta/astryx/commit/437f54847) fix(DiffViewer): a change too large to compare line by line is labeled and folded, not shown as a silent replace (#9462)
  - 已移植：[#535](https://github.com/astryx-vue/astryx-vue/pull/535)。createDiffFile 给整块替换的片段标 isReplacedBlock，DiffViewer 带标签折叠并可展开，有批注时先展开，补测试

### v0.7.7

- [x] [`7261e2c2c`](https://github.com/meta/astryx/commit/7261e2c2c) fix(DiffViewer): line diffs for changes up to 10,000 lines in linear memory; files over 2,000 changed lines start folded (#9521)
  - 已移植：[#535](https://github.com/astryx-vue/astryx-vue/pull/535)。线性内存逐行比较最多 10,000 行改动，长文件按工作量降上限；其余改动超过 2,000 行的文件先折叠，补测试

### v0.7.8

- [x] [`0b39b51c2`](https://github.com/meta/astryx/commit/0b39b51c2) refactor(ChartZoom): take the reset domains from the first render, not an Effect (#9809)
  - 不适用：React 用 state 代替 Effect 记录初始范围的重构，没有行为变化
- [x] [`c1e6a5e78`](https://github.com/meta/astryx/commit/c1e6a5e78) refactor(Chart): observe the container width from its ref callback, not an Effect (#9867)
  - 不适用：React 用 ref 回调代替 Effect 监听容器宽度的重构，没有行为变化
- [x] [`1bbc52546`](https://github.com/meta/astryx/commit/1bbc52546) refactor(SankeyChart): observe the container width from its ref callback, not an Effect (#9903)
  - 不适用：React 用 ref 回调代替 Effect 监听容器宽度的重构，没有行为变化

### v0.7.9

- [x] [`edf7128e3`](https://github.com/meta/astryx/commit/edf7128e3) feat(Timestamp, PowerSearch): write dates in the provider's calendar (#9639)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。图表的 shortDate、monthYear 接受可选历法参数，默认格里高利历，补测试

### v0.7.10

- [x] [`5df77f48a`](https://github.com/meta/astryx/commit/5df77f48a) fix(lab): ChartZoom's wheel listener is native and non-passive (#10210)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。Vue 的 wheel 监听本来就不是 passive；补上只有横向分量的滚轮留给页面，补测试

### v0.7.12

- [x] [`da85f28ed`](https://github.com/meta/astryx/commit/da85f28ed) fix(RadialChart): honor interactive for touch input (#9741)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。RadialTooltip 的触摸只在 interactive 时生效，关掉时结束正在进行的触摸，鼠标悬停不受影响，补测试

### v0.7.17

- [x] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
  - Vue 版已有：上游删掉的是窄标记列把内边距清零的样式；Vue 版标记列在各种标记模式下本来就保留内边距
- [x] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
  - 不适用：上游内部规范和架构文档（自动初筛）

## 实验包：对话类组件（area:lab）

### v0.7.2

- [ ] [`9fa22137e`](https://github.com/meta/astryx/commit/9fa22137e) feat(lab): add EmojiPicker (#7605)
- [ ] [`428444239`](https://github.com/meta/astryx/commit/428444239) feat(lab): add CommentPin (#7614)
- [ ] [`5c208f6a4`](https://github.com/meta/astryx/commit/5c208f6a4) feat(lab): add CommentComposer (#7606)
- [ ] [`fc12a1803`](https://github.com/meta/astryx/commit/fc12a1803) feat(lab): add CommentThread (#7607)
- [ ] [`5c75a7550`](https://github.com/meta/astryx/commit/5c75a7550) feat(lab): add Comments (#7551)

### v0.7.3

- [ ] [`8a801f70a`](https://github.com/meta/astryx/commit/8a801f70a) fix(ChatTypingIndicator): announce through the shared channel, not a live region born with its text (#7867)
- [ ] [`79fd9740d`](https://github.com/meta/astryx/commit/79fd9740d) fix(lab): MobileTokenizer and CommentComposer stay focusable when disabled (#7903)
- [ ] [`02f5fe490`](https://github.com/meta/astryx/commit/02f5fe490) fix(lab): a busy comment editor's Cancel link stays in the tab order (#7909)

### v0.7.5

- [ ] [`c60f57133`](https://github.com/meta/astryx/commit/c60f57133) feat(CommentPin): sizes, equal padding, ellipsis overflow, unread dot, hidden resolved pins (#8023)
- [x] [`8b7491193`](https://github.com/meta/astryx/commit/8b7491193) fix(EmptyState): announce once when it appears after load, not as a live root (#8294)
  - 不适用：只改上游测试（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [ ] [`6a751f7b7`](https://github.com/meta/astryx/commit/6a751f7b7) fix(lab): announce EmojiPicker load failures (#7809)
- [ ] [`05ead02aa`](https://github.com/meta/astryx/commit/05ead02aa) feat(Icon): a theme icon entry can be a function of the requested size (#8753)

### v0.7.6

- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`5ef9ab630`](https://github.com/meta/astryx/commit/5ef9ab630) fix(lab): CommentPin stays focusable when disabled (#8816)
- [ ] [`b4b978da2`](https://github.com/meta/astryx/commit/b4b978da2) fix(Comments): announce error banners and progress labels through the shared channel (#7902)
- [ ] [`afcbd477f`](https://github.com/meta/astryx/commit/afcbd477f) fix(lab): CommentComposerBase reads the latest onActionPendingChange instead of re-running its cleanup when it changes (#9149)
- [ ] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)

### v0.7.8

- [ ] [`830f87528`](https://github.com/meta/astryx/commit/830f87528) refactor(Comments): the copy press owns the link-copied reset, through useClipboard, not an Effect (#9864)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [ ] [`1ef21f898`](https://github.com/meta/astryx/commit/1ef21f898) fix(Spinner): route standalone loading through the shared announcement channel (#7910)

### v0.7.12

- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`6a4bc478e`](https://github.com/meta/astryx/commit/6a4bc478e) fix(CommentComposer): a busy composer refuses pasted and dropped images (#10498)
- [ ] [`642cc2de1`](https://github.com/meta/astryx/commit/642cc2de1) fix(lab): write latest-value refs at commit, not during render (#10780)
- [ ] [`daa239e98`](https://github.com/meta/astryx/commit/daa239e98) feat(lab): experimental ChatVirtualizer (#5461)
- [ ] [`b5de1a82f`](https://github.com/meta/astryx/commit/b5de1a82f) refactor(lab): one-line ref effects in Comments and Schedule (#10805)
- [x] [`bf13b026e`](https://github.com/meta/astryx/commit/bf13b026e) fix(Avatar): an interactive initials avatar passes Label in Name (#10816)
  - 不适用：只改上游测试（自动初筛）
- [x] [`00e031a31`](https://github.com/meta/astryx/commit/00e031a31) fix(Avatar): no public data-initials attribute; the initials come from a private StyleX dynamic style (#10944)
  - 不适用：只改上游测试（自动初筛）

### v0.7.14

- [ ] [`a3a6f1c85`](https://github.com/meta/astryx/commit/a3a6f1c85) fix(ChatVirtualizer): attach mode works on the page's own scroller (#10879)

### v0.7.15

- [ ] [`3fed77b37`](https://github.com/meta/astryx/commit/3fed77b37) fix(ChatVirtualizer): a rotation keeps the row at the top of the view in place (#11219)
- [x] [`95127f655`](https://github.com/meta/astryx/commit/95127f655) test(ChatVirtualizer): a reply that arrives in history is read out once, and no history as the reader scrolls down (#11365)
  - 不适用：只改上游测试（自动初筛）

### v0.7.16

- [x] [`0c6eb68c6`](https://github.com/meta/astryx/commit/0c6eb68c6) test(ChatVirtualizer): wait for frames, not a fixed 40 ms (#11411)
  - 不适用：只改上游测试（自动初筛）

### v0.7.17

- [ ] [`c3d24e124`](https://github.com/meta/astryx/commit/c3d24e124) fix(Comments): a failed comment-link copy shows and announces itself (#10435)
- [ ] [`9d23a5e6e`](https://github.com/meta/astryx/commit/9d23a5e6e) chore: land batch 87 (2 pull requests) (#13021)

## 实验包：使用文档（area:lab）

### v0.7.2

- [ ] [`97a00379a`](https://github.com/meta/astryx/commit/97a00379a) feat(lab): DiffViewer — unified/split file diff for code review (#7536)
- [ ] [`280c48a82`](https://github.com/meta/astryx/commit/280c48a82) feat(lab): createDiffFile builds a DiffViewer file from two versions of a text (#7565)
- [ ] [`a09889314`](https://github.com/meta/astryx/commit/a09889314) feat(lab): DiffViewer display options — change bars, inline highlight, row tint toggle, fixed split with synced scrolling (#7589)
- [ ] [`9fa22137e`](https://github.com/meta/astryx/commit/9fa22137e) feat(lab): add EmojiPicker (#7605)
- [ ] [`428444239`](https://github.com/meta/astryx/commit/428444239) feat(lab): add CommentPin (#7614)
- [ ] [`5c208f6a4`](https://github.com/meta/astryx/commit/5c208f6a4) feat(lab): add CommentComposer (#7606)
- [ ] [`fc12a1803`](https://github.com/meta/astryx/commit/fc12a1803) feat(lab): add CommentThread (#7607)
- [ ] [`5c75a7550`](https://github.com/meta/astryx/commit/5c75a7550) feat(lab): add Comments (#7551)
- [ ] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)

### v0.7.4

- [ ] [`faa934f8c`](https://github.com/meta/astryx/commit/faa934f8c) docs(ListInput): add a docsite showcase and three example blocks (#7953)

### v0.7.5

- [ ] [`77d435192`](https://github.com/meta/astryx/commit/77d435192) feat(lab): MobilePowerSearch — touch PowerSearch prototype (#7402)
- [ ] [`c60f57133`](https://github.com/meta/astryx/commit/c60f57133) feat(CommentPin): sizes, equal padding, ellipsis overflow, unread dot, hidden resolved pins (#8023)
- [x] [`9effa5cb5`](https://github.com/meta/astryx/commit/9effa5cb5) fix(lab): a pinch that starts on a reorder grip zooms the page (#8126)
  - 不适用：只改上游测试（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)

### v0.7.6

- [ ] [`c8e1804d8`](https://github.com/meta/astryx/commit/c8e1804d8) ci: drop off-PR and informational checks (#8894)

### v0.7.8

- [ ] [`9136e28c7`](https://github.com/meta/astryx/commit/9136e28c7) feat: a single-choice set of selectable cards is a radio group (lab SelectableCardGroup) (#8260)
- [ ] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [ ] [`9d068fc89`](https://github.com/meta/astryx/commit/9d068fc89) feat(lab): useRefreshControl, UIKit's pull to refresh for an app's scroll container (#9865)
- [ ] [`38f1a1d40`](https://github.com/meta/astryx/commit/38f1a1d40) fix(docsite): a fluid Overview showcase keeps an inset from its card's edges (#10027)
- [ ] [`6f3befa82`](https://github.com/meta/astryx/commit/6f3befa82) feat(lab): CircleCheckIndicator, the iOS multiple-selection circle (#9723)
- [ ] [`4e4cf84d2`](https://github.com/meta/astryx/commit/4e4cf84d2) feat(lab): NavigationStack, push/pop navigation that moves like UINavigationController (#9697)

### v0.7.10

- [ ] [`cbda0753d`](https://github.com/meta/astryx/commit/cbda0753d) ci(release): publish canaries at most hourly from main's tip, plus an on-demand canary dispatch (#9659)
- [ ] [`0cc540700`](https://github.com/meta/astryx/commit/0cc540700) feat(lab): PageControl, UIPageControl's indicators: a tap steps a page, a finger scrubs, every pointer pages (#9684)

### v0.7.12

- [ ] [`c18bc584c`](https://github.com/meta/astryx/commit/c18bc584c) feat(lab): TabBar, iOS 26's floating tab bar, with its selection lens and press tracking (#9700)
- [ ] [`611382ee1`](https://github.com/meta/astryx/commit/611382ee1) feat(lab): add LineClamp — clamp arbitrary content to N lines (#4259)
- [ ] [`848bbe7c7`](https://github.com/meta/astryx/commit/848bbe7c7) feat(lab): DialogHeroHeader (#10108)
- [ ] [`f9cd81f14`](https://github.com/meta/astryx/commit/f9cd81f14) feat(lab): DialogHeroHeader showcase, and astryx discover lists it (#10109)
- [x] [`36b8f6ebc`](https://github.com/meta/astryx/commit/36b8f6ebc) feat(lab): TransferList reorders through core's createReorderable (#8143)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`6103d36e9`](https://github.com/meta/astryx/commit/6103d36e9) feat(lab): ListInput reorders through core's createReorderable (#8163)
- [x] [`4fbef8a6b`](https://github.com/meta/astryx/commit/4fbef8a6b) test(lab): the reorder-grip pinch spec runs for the grips it renders (#10736)
  - 不适用：只改上游测试（自动初筛）
- [x] [`349d3a8e6`](https://github.com/meta/astryx/commit/349d3a8e6) test(lab): the reorder-grip spec's scope no longer names a deleted file (#10864)
  - 不适用：只改上游测试（自动初筛）

### v0.7.13

- [ ] [`0085c0f2b`](https://github.com/meta/astryx/commit/0085c0f2b) feat(lab): TabBar shows a More tab past five tabs (#10619)

### v0.7.14

- [ ] [`7deca3313`](https://github.com/meta/astryx/commit/7deca3313) feat(lab): SVG icons that follow the surrounding font-weight (#7918)

### v0.7.17

- [x] [`e2b63aeb6`](https://github.com/meta/astryx/commit/e2b63aeb6) feat(lab): add VideoPlayer and AudioPlayer media players (#9832)
  - 已移植  #559：[#555](https://github.com/astryx-vue/astryx-vue/pull/555)。媒体状态和控件（MediaPlayer、Media* 控件、useMediaPlayer）在 #555，现成的 VideoPlayer 和 AudioPlayer（含系统媒体控制、字幕避让）在 #559

## 实验包：输入类组件（area:lab）

### v0.7.2

- [x] [`efdc11077`](https://github.com/meta/astryx/commit/efdc11077) fix(Button): use aria-disabled instead of native disabled while busy-only (#4885)
  - 不适用：只改上游测试（自动初筛）

### v0.7.3

- [x] [`1b3f66800`](https://github.com/meta/astryx/commit/1b3f66800) fix(ComplexSelector): a disabled trigger keeps its tab stop (#7845)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`79fd9740d`](https://github.com/meta/astryx/commit/79fd9740d) fix(lab): MobileTokenizer and CommentComposer stay focusable when disabled (#7903)

### v0.7.4

- [ ] [`31e54e473`](https://github.com/meta/astryx/commit/31e54e473) feat(ListInput): reveal row actions with their record and hang the grip beside the first field (#7949)
- [ ] [`faa934f8c`](https://github.com/meta/astryx/commit/faa934f8c) docs(ListInput): add a docsite showcase and three example blocks (#7953)

### v0.7.5

- [ ] [`77d435192`](https://github.com/meta/astryx/commit/77d435192) feat(lab): MobilePowerSearch — touch PowerSearch prototype (#7402)
- [x] [`509557499`](https://github.com/meta/astryx/commit/509557499) fix(cli): finish MobilePowerSearch discovery integration (#7983)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`100a7fe3b`](https://github.com/meta/astryx/commit/100a7fe3b) feat(lab): MobilePowerSearch edits list values through MobileTokenizer (#7979)
- [ ] [`ae842c82a`](https://github.com/meta/astryx/commit/ae842c82a) fix(lab): MobilePowerSearch's sticky sheet header stays above the rows scrolling under it (#8005)
- [ ] [`f0a5ceac7`](https://github.com/meta/astryx/commit/f0a5ceac7) fix(lab): MobilePowerSearch names its trigger by what it shows and announces inside its sheets (#8007)
- [ ] [`9effa5cb5`](https://github.com/meta/astryx/commit/9effa5cb5) fix(lab): a pinch that starts on a reorder grip zooms the page (#8126)
- [x] [`d794476b6`](https://github.com/meta/astryx/commit/d794476b6) fix(useAnnounce): messages announced in the same frame are joined, an identical repeat once (#8244)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e52ef25f2`](https://github.com/meta/astryx/commit/e52ef25f2) [Component Audit] ComplexSelector: the trigger is a combobox field on both paths (#6991)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0a9814aa7`](https://github.com/meta/astryx/commit/0a9814aa7) ci: typecheck lab, charts, rich text and Vega with their tests, like core (#8318)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8b7491193`](https://github.com/meta/astryx/commit/8b7491193) fix(EmptyState): announce once when it appears after load, not as a live root (#8294)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8ba53b45a`](https://github.com/meta/astryx/commit/8ba53b45a) spec(AST-103): createReorderable, one reorder behavior for every collection (#8461)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b1a18b116`](https://github.com/meta/astryx/commit/b1a18b116) spec(AST-103): itemKey and the reported key are a string or a number (#8592)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`2a162e1b6`](https://github.com/meta/astryx/commit/2a162e1b6) feat(core): BottomSheet stacks by open order, replaces on a same-update switch, and BottomSheetSwitcher is deprecated (#7648)
- [ ] [`a1a512d9e`](https://github.com/meta/astryx/commit/a1a512d9e) design(ordered-collection-reordering): current — insertion line, stable rows, commit on drop (AST-103 reorder mode) (#8625)
- [x] [`c01521cf9`](https://github.com/meta/astryx/commit/c01521cf9) spec(AST-094, AST-057): gestures work on the web for every pointer (FR43) (#8646)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2002602b7`](https://github.com/meta/astryx/commit/2002602b7) spec(AST-103): optional positions() for grid and fan drops, and attach() for plain elements (#8601)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b02fac607`](https://github.com/meta/astryx/commit/b02fac607) feat(lab): MobilePowerSearch's steps are standalone sheets that replace one another (#8476)
- [ ] [`9d1ef5a40`](https://github.com/meta/astryx/commit/9d1ef5a40) feat(lab): MobileTokenizer at parity with Core's sheet presentation (#8739)
- [ ] [`7681363c5`](https://github.com/meta/astryx/commit/7681363c5) feat(lab): MobilePowerSearch takes the Core sheet flow's behaviors (#8740)
- [ ] [`d9da59f6e`](https://github.com/meta/astryx/commit/d9da59f6e) fix(lab): MobileTokenizer reports the sheet's focus hand-back as the entry when the trigger never had focus (#8768)
- [ ] [`075fb3b94`](https://github.com/meta/astryx/commit/075fb3b94) fix(lab): MobilePowerSearch speaks a sheet's empty-result and unavailable messages only while that step is open (#8769)
- [ ] [`70ea85903`](https://github.com/meta/astryx/commit/70ea85903) fix(lab): MobileTokenizer's closed trigger is the inline Tokenizer field's box (#8818)
- [ ] [`0720bfaac`](https://github.com/meta/astryx/commit/0720bfaac) fix(MobilePowerSearch): refine touch filter flow (#8749)
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)

### v0.7.6

- [ ] [`8f345cba4`](https://github.com/meta/astryx/commit/8f345cba4) feat(FieldStatus): deprecate the tooltip variant; field controls keep statusVariant="tooltip" (#9196)
- [ ] [`0df41f123`](https://github.com/meta/astryx/commit/0df41f123) fix(MobileTokenizer): refine touch sheet editing flow (#8742)
- [x] [`c5fbecb8d`](https://github.com/meta/astryx/commit/c5fbecb8d) spec(i18n, Resizable, AST-103): factories take announcement and label options with a catalog default (#9395)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`dabf6a125`](https://github.com/meta/astryx/commit/dabf6a125) lint: no-border-shorthand reaches lab and charts; ChartTooltip's card draws its border in prebuilt CSS (#9442)
  - 不适用：只改上游测试（自动初筛）

### v0.7.7

- [x] [`ce667be4d`](https://github.com/meta/astryx/commit/ce667be4d) fix(Dialog, Drawer): a backdrop press dismisses only when it starts and ends on the backdrop (#9613)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4f452f927`](https://github.com/meta/astryx/commit/4f452f927) feat(Tokenizer): the touch sheet presentation is public behind experimental.presentation, and the sheet edits a draft that Save commits (#9708)
- [x] [`4e495ec5e`](https://github.com/meta/astryx/commit/4e495ec5e) fix(BottomSheet): a standalone sheet closing with focus inside stays out of inert while focus stays (#9635)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`9136e28c7`](https://github.com/meta/astryx/commit/9136e28c7) feat: a single-choice set of selectable cards is a radio group (lab SelectableCardGroup) (#8260)
- [ ] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [ ] [`c26fcd543`](https://github.com/meta/astryx/commit/c26fcd543) chore(lab): Lab's animator hook, over Core's internal touch entry (#9754)

### v0.7.10

- [ ] [`0081c1165`](https://github.com/meta/astryx/commit/0081c1165) feat(lab): under a finger, NavigationStack's bar takes the iOS 26 look (#8396)

### v0.7.11

- [ ] [`1ab067962`](https://github.com/meta/astryx/commit/1ab067962) fix(TransferListSelector): a disabled selector keeps its row controls and search focusable (#10192)

### v0.7.12

- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`5eb6b2137`](https://github.com/meta/astryx/commit/5eb6b2137) fix(lab): a swizzled ListInput type-checks without Node's types (#10574)
- [ ] [`33cf413d0`](https://github.com/meta/astryx/commit/33cf413d0) fix(NavigationStack): fade the veil for a late finger-scroll report (#10540)
- [x] [`a28d586eb`](https://github.com/meta/astryx/commit/a28d586eb) feat(core): createReorderable makes List rows reorderable (#8139)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`36b8f6ebc`](https://github.com/meta/astryx/commit/36b8f6ebc) feat(lab): TransferList reorders through core's createReorderable (#8143)
- [ ] [`6103d36e9`](https://github.com/meta/astryx/commit/6103d36e9) feat(lab): ListInput reorders through core's createReorderable (#8163)
- [x] [`f2a6332eb`](https://github.com/meta/astryx/commit/f2a6332eb) fix(List): a swizzled copy reads a package reorderable object (#10741)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`06ebae229`](https://github.com/meta/astryx/commit/06ebae229) fix(List): a drag follows a scroll around the list's scroll box (#10742)
- [ ] [`642cc2de1`](https://github.com/meta/astryx/commit/642cc2de1) fix(lab): write latest-value refs at commit, not during render (#10780)

### v0.7.17

- [ ] [`0ed056cd0`](https://github.com/meta/astryx/commit/0ed056cd0) docs(TransferListSelector): dense text names the control props (#11922)
- [x] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9d23a5e6e`](https://github.com/meta/astryx/commit/9d23a5e6e) chore: land batch 87 (2 pull requests) (#13021)

## 实验包：浮层与引导（area:lab）

### v0.7.2

- [x] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)
  - Vue 版已有：Drawer 和 DrawerHeader 已在 core（packages/core/src/Drawer），Vue 的 lab 从来没有 Drawer

### v0.7.5

- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：只改了 InfoTip 源码注释里的上游仓库链接；Vue 版 lab 的 InfoTip 只是转发 core 的弃用别名，没有这类链接

### v0.7.12

- [x] [`848bbe7c7`](https://github.com/meta/astryx/commit/848bbe7c7) feat(lab): DialogHeroHeader (#10108)
  - 已移植：[#536](https://github.com/astryx-vue/astryx-vue/pull/536)。lab 新增 DialogHeroHeader（媒体铺满、关闭按钮浮在媒体上、标题命名对话框并作默认焦点），core 公开 useDialogContext，中英文档和测试

### v0.7.14

- [x] [`c37b7d5dd`](https://github.com/meta/astryx/commit/c37b7d5dd) docs(spec): Tour record (#11216)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.15

- [x] [`59fced7bd`](https://github.com/meta/astryx/commit/59fced7bd) docs(spec): the Tour record is current (#11268)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.16

- [x] [`2f2ccc79d`](https://github.com/meta/astryx/commit/2f2ccc79d) fix(lab): a TourStep points at any element and leaves the page usable (#11123)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。TourStep 改成锚在高亮框上的非模态区域，可指向任何元素，按目标或页面不结束，Escape 报 escape，结束时还焦点，补测试

### v0.7.17

- [x] [`20c9b4b18`](https://github.com/meta/astryx/commit/20c9b4b18) docs(spec): AST-119 Tour steps as data (#11324)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`773107aad`](https://github.com/meta/astryx/commit/773107aad) spec(popover): isModal keeps its released meaning, and usePopover takes tabBehavior (AST-116) (#13015)
  - 不适用：上游内部规范和架构文档（自动初筛）

## 浮层图层运行时（area:core）

### v0.7.2

- [x] [`81b8df40f`](https://github.com/meta/astryx/commit/81b8df40f) fix(Layer): ship the dynamic-viewport cap and safe-area gutter, not only their fallbacks (#7622)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。动态视口上限和安全区空隙，#542 已移植（LayerProvider 空隙、popover 的 dvh 上限）
- [x] [`3f45fc2f6`](https://github.com/meta/astryx/commit/3f45fc2f6) fix: Omit the popover source when the trigger is not an HTML element (#7227)
  - 不适用：上游给 popover API 的 source 属性，Vue 浮层用 Teleport 加 JS 定位，没有这个属性
- [x] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)
  - Vue 版已有：Drawer 已在 core 里，Drawer 也登记在共享关闭栈；这条的运行时文档改动在 Vue 版没有对应

### v0.7.4

- [x] [`d32951564`](https://github.com/meta/astryx/commit/d32951564) spec(Overlay): OverlayRegion places content at a preset or fractional position over media (#7951)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.5

- [x] [`7cb897b4e`](https://github.com/meta/astryx/commit/7cb897b4e) fix(BottomSheet): keep toasts visible and clickable above an open sheet (#7781)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。独立的模态 BottomSheet 打开期间是 toast 的挂载点，toast 显示在它上面并可点击
- [x] [`1554dc626`](https://github.com/meta/astryx/commit/1554dc626) fix(Tooltip, HoverCard): a touch opens them only once it is a tap (#8165)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。触屏上 Tooltip、HoverCard 等手指真的轻点才开，滚动不开（tapRecognizer 加 useTouchTriggerInternal）
- [ ] [`216ad5788`](https://github.com/meta/astryx/commit/216ad5788) fix(Layer): under a finger with Reduce Motion, a layer fades in instead of appearing at once (#8322)
  - 暂缓：触屏呈现下减少动效改为淡入：依赖 Vue 版还没有的触屏呈现（从触发器长出、退场副本）
- [x] [`4b05772a2`](https://github.com/meta/astryx/commit/4b05772a2) fix(Popover): focus, Tab and Escape work in a second document (#7356)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。浮层关闭栈按 document 分开登记，iframe 或另一窗口里的 Escape 与点外面只管那个文档里的层
- [x] [`a56c06134`](https://github.com/meta/astryx/commit/a56c06134) fix(Tooltip): a tooltip taller than the room around its trigger opens clear of it (#8254)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。Tooltip 比四周空地都高时改放触发器旁边，再不行就限高滚动，不盖触发器（anchorClear）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`116f54be5`](https://github.com/meta/astryx/commit/116f54be5) fix(Tooltip): an open tooltip follows a trigger that moves on screen (#8364)
  - Vue 版已有：usePositionedLayer 打开期间轮询锚点几何，触发器移动后气泡跟着走
- [x] [`caa1f04fe`](https://github.com/meta/astryx/commit/caa1f04fe) fix(ContextMenu): the long press that opens the menu no longer closes it (#7308)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`66e257a4c`](https://github.com/meta/astryx/commit/66e257a4c) architecture(layer-runtime): one generic layer runtime, and one opt-in lift-from-trigger module (INV14, INV15) (#8448)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2af4d305a`](https://github.com/meta/astryx/commit/2af4d305a) feat(Popover): presentation — a BottomSheet on a phone when asked, as iOS presents a popover (#8229)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`87a9e776c`](https://github.com/meta/astryx/commit/87a9e776c) perf(useLayer): placing a context layer re-renders its slot, not its host (#8519)
  - 不适用：React 重渲染性能：Vue 的 ref 不会让宿主重渲染
- [ ] [`2a162e1b6`](https://github.com/meta/astryx/commit/2a162e1b6) feat(core): BottomSheet stacks by open order, replaces on a same-update switch, and BottomSheetSwitcher is deprecated (#7648)
  - 暂缓：BottomSheet 按打开顺序叠放、同一次更新里切换替换：Vue 的抽屉叠放用切换器管理，没有等价的打开顺序栈；Switcher 弃用说明待单独处理
- [x] [`6752d03da`](https://github.com/meta/astryx/commit/6752d03da) spec(AST-059): proposed — the software keyboard caps an anchored layer (FR9, FR10, DEC-6) (#8506)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2bae302a6`](https://github.com/meta/astryx/commit/2bae302a6) docs(spec): Layer records its shipped contract as current (#8815)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`249501fb0`](https://github.com/meta/astryx/commit/249501fb0) fix(Overlay, DropdownMenuGroup, MobileNavToggle): forward host attributes to the element each owns (#8755)
  - Vue 版已有：Overlay 把宿主属性透传到自己拥有的根元素
- [x] [`e9ac835eb`](https://github.com/meta/astryx/commit/e9ac835eb) perf(Layer): a closed layer reads its writing context when it first opens, not on mount (#9012)
  - 不适用：React 浮层首次打开才读写作上下文的性能优化，Vue 没有这个上下文读取

### v0.7.6

- [x] [`d6697625e`](https://github.com/meta/astryx/commit/d6697625e) fix(Layer): a show that a browser-run hide wakes waits for that hide (#8543)
  - Vue 版已有：useLayer 的 show 遇到正在关闭就排到这次关闭结束后再开（isHiding 加 pendingShow）
- [x] [`dfc83eedc`](https://github.com/meta/astryx/commit/dfc83eedc) fix(Layer): a layer that keeps its anchor clear reads an anchor move in the next frame, so the second frame is clear (#9123)
  - Vue 版已有：usePositionedLayer 每次滚动、尺寸变化和几何轮询都重新算位置，锚点移动会在下一次更新里纠正
- [x] [`cfbc66fb7`](https://github.com/meta/astryx/commit/cfbc66fb7) fix(FieldLabel): a tap on the label's info icon opens its help without activating the control (#9089)
  - Vue 版已有：InfoTip 在标签之外，点击里 stopPropagation 加 preventDefault，不会激活标签的控件
- [x] [`1d8696ad9`](https://github.com/meta/astryx/commit/1d8696ad9) spec: Tooltip and HoverCard pin on press; InfoTip is the info preset (#9175)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。每个组件只跟踪一次输入模态，读自己所在文档（useTouchTriggerInternal 里按触发器的 ownerDocument 跟踪）
- [x] [`4f35412e2`](https://github.com/meta/astryx/commit/4f35412e2) fix(ChatComposerInput): a tap on a pasted-text token opens its preview without raising the keyboard (#9189)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。粘贴文本令牌被手指或笔轻点时取消合成的鼠标按下，预览打开而输入框不拿焦点、键盘不弹出（createTapStop）
- [x] [`a03bffd8e`](https://github.com/meta/astryx/commit/a03bffd8e) feat(Typeahead): show local matches at once and append server results (spec:AST-092) (#7962)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`97b3711d6`](https://github.com/meta/astryx/commit/97b3711d6) fix(Tooltip, HoverCard): a disabled control's reason opens on a tap (#8207)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。轻点 aria-disabled 控件打开它的禁用原因（Tooltip、HoverCard）
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`eb6d2cc12`](https://github.com/meta/astryx/commit/eb6d2cc12) fix(ContextMenu): a context menu mounts its layer at its first open, so a large Table shows its rows in seconds in Safari (#9278)
  - 不适用：上游是 React 里菜单图层跟着大表格一起渲染的代价；Vue 的菜单面板和触发区是各自的节点，触发区内容不随菜单渲染
- [x] [`0fad9d216`](https://github.com/meta/astryx/commit/0fad9d216) test(rtl): RTL coverage for Blockquote, InputGroupText and Overlay (#9309)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3d44c583a`](https://github.com/meta/astryx/commit/3d44c583a) fix(Tooltip, HoverCard): a press inside an open surface doesn't activate the card, row or field around it (#9252)
  - 已移植：[#512](https://github.com/astryx-vue/astryx-vue/pull/512)。Tooltip、HoverCard 气泡内按下不激活外层卡片、行、字段
- [x] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。不截断的 Text、Heading 里长串换行，浮层根重置
- [x] [`a4226c9a2`](https://github.com/meta/astryx/commit/a4226c9a2) fix(Typeahead, Tokenizer): a press in the field's own input or buttons keeps the list open (#9367)
  - Vue 版已有：Typeahead、Tokenizer 的列表把整个字段当触发器，点字段自己的输入框和按钮不关列表
- [x] [`41aa83233`](https://github.com/meta/astryx/commit/41aa83233) spec(layer-runtime): a click inside a layer stops at the layer root (#9398)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`fc44bc3b7`](https://github.com/meta/astryx/commit/fc44bc3b7) fix(DateTimeInput): a press in the time input keeps the preset-time list open (#9459)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`09a482eaf`](https://github.com/meta/astryx/commit/09a482eaf) fix(Layer): a press inside a layer stops at the layer root in the React tree (#9497)
  - 不适用：上游靠 React 合成事件在浮层根截停冒泡，Vue 走 DOM 冒泡并由 layerSurfacePress 登记
- [x] [`8835deca3`](https://github.com/meta/astryx/commit/8835deca3) fix(ChatComposerInput): a press in the editor keeps the trigger menu open (#9503)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`beb03f8bd`](https://github.com/meta/astryx/commit/beb03f8bd) fix(DateInput): a press in the field's own input, clear button or label keeps the calendar open (#9433)
  - Vue 版已有：日期输入的弹层把整个字段当触发器，点在字段自己的输入框、清除钮、标签里时 dismissStack 不关弹层
- [x] [`b5e716687`](https://github.com/meta/astryx/commit/b5e716687) refactor(Item, Token, ChatComposer): drop the per-site tooltip surface checks the layer boundary replaces (#9531)
  - 不适用：上游靠 React 合成事件在浮层根截停冒泡，Vue 按 DOM 冒泡仍需登记表

### v0.7.7

- [x] [`c5c11496a`](https://github.com/meta/astryx/commit/c5c11496a) fix(Drawer): a modal drawer hosts the toast viewport, so its toasts can be pressed and reached (#9590)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`36f8ea10e`](https://github.com/meta/astryx/commit/36f8ea10e) feat(AppShell): keep the header's items and the content's end inside the device's safe area (#8150)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1d04d40fd`](https://github.com/meta/astryx/commit/1d04d40fd) feat(Tooltip): triggerBehavior="toggle" pins the tooltip on a press (#9232)
  - 不适用：triggerBehavior 属性后来在发布前就被删掉（见 1821fb3fa），净效果为零
- [x] [`9ae589b92`](https://github.com/meta/astryx/commit/9ae589b92) fix(Tooltip): Space on keyup and a press outside in another document, with triggerBehavior evidence (#9406)
  - 不适用：triggerBehavior 属性后来在发布前就被删掉，净效果为零
- [x] [`0f12096d3`](https://github.com/meta/astryx/commit/0f12096d3) fix(Drawer): a scrimless drawer announces its top-layer entry, so toasts stay above it (#9594)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ce667be4d`](https://github.com/meta/astryx/commit/ce667be4d) fix(Dialog, Drawer): a backdrop press dismisses only when it starts and ends on the backdrop (#9613)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。Dialog、Drawer 的遮罩按下和松手都在遮罩上才关（useBackdropPress）
- [x] [`1821fb3fa`](https://github.com/meta/astryx/commit/1821fb3fa) fix(Tooltip): remove the unreleased triggerBehavior prop before 0.7.7 (#9711)
  - 不适用：删除未发布的 triggerBehavior 属性，Vue 版从来没有加过
- [ ] [`e629e7dff`](https://github.com/meta/astryx/commit/e629e7dff) fix(Layer): the touch cross-fade uses the motion foundation's Reduce Motion values (#8355)
  - 暂缓：触屏淡入使用动效基础的减少动效值：依赖触屏呈现，Vue 版没有
- [x] [`4e495ec5e`](https://github.com/meta/astryx/commit/4e495ec5e) fix(BottomSheet): a standalone sheet closing with focus inside stays out of inert while focus stays (#9635)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.8

- [x] [`97191cf7f`](https://github.com/meta/astryx/commit/97191cf7f) feat(Tooltip): useTooltip returns show() and hide() for an app-built toggle trigger (#9727)
  - Vue 版已有：useTooltip 已返回 show() 和 hide()，保持打开直到 hide、Escape、点外面
- [x] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
  - 不适用：只给 React useEffect 加注释
- [x] [`61cf773c2`](https://github.com/meta/astryx/commit/61cf773c2) refactor(InfoTip): build on useTooltip's show() and hide(); remove the internal toggle path (#9756)
  - Vue 版已有：Vue 的 InfoTip 本来就建在 useTooltip 的 show/hide 上，没有内部切换路径
- [x] [`946211065`](https://github.com/meta/astryx/commit/946211065) perf(core): an overlay's eager import no longer carries the lazy BottomSheet's padding (#8550)
  - 不适用：React 打包体积：懒加载 BottomSheet 的内边距不跟随 Overlay 的急切导入
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`bb5650811`](https://github.com/meta/astryx/commit/bb5650811) fix(Tooltip, HoverCard): a pen held before it lifts no longer closes the layer it opened (#9819)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a343c796d`](https://github.com/meta/astryx/commit/a343c796d) docs(Overlay): say why the radius Effect stays, and pin when the radius is read (#9870)
  - Vue 版已有：Overlay 圆角取值时机的说明，Vue 版在挂载时读一次

### v0.7.9

- [ ] [`8ddcfe11c`](https://github.com/meta/astryx/commit/8ddcfe11c) fix(core): a layout motion's copy carries on the CSS animations and transitions running in it (#9534)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [ ] [`252b45bb1`](https://github.com/meta/astryx/commit/252b45bb1) feat(Layer): one input hold, first used by Dialog, Drawer and MobileNav (spec:AST-094 FR35) (#8342)
  - 暂缓：进场输入遮挡（Dialog、Drawer、MobileNav 进场时挡住点击）：依赖触屏呈现和进场运行时，Vue 版没有
- [x] [`5c91e81ee`](https://github.com/meta/astryx/commit/5c91e81ee) fix(Layer): a closed layer's trigger is no CSS anchor (#9963)
  - 不适用：上游关闭的浮层触发器不是 CSS 锚点，Vue 用 JS 定位，不设 anchor-name
- [x] [`a866c2ab0`](https://github.com/meta/astryx/commit/a866c2ab0) fix(Dialog, Drawer): a backdrop press that closes a popover inside closes only the popover (#9988)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。按遮罩关掉里面的弹出框时，对话框和抽屉留着（didOutsideDismissInGesture）
- [x] [`af7037b4a`](https://github.com/meta/astryx/commit/af7037b4a) perf(Layer): LayerProvider loads no Toast; Toast registers its viewport (#10012)
  - 不适用：React 打包拆分：LayerProvider 不加载 Toast
- [x] [`7e69f91dc`](https://github.com/meta/astryx/commit/7e69f91dc) fix(core): an anchored layer that would run under the software keyboard ends above it (#8208)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。锚定浮层避开软键盘：getLayerViewport 扣掉键盘占的那一截
- [ ] [`5b54b834c`](https://github.com/meta/astryx/commit/5b54b834c) fix(DropdownMenu): on a phone or a tablet, a tap while the menu enters is ignored, as on iOS (#8458)
  - 暂缓：手机和平板上菜单进场时的点击被忽略：依赖进场输入遮挡，Vue 版没有
- [x] [`c8a172b4b`](https://github.com/meta/astryx/commit/c8a172b4b) docs(useOverlay): add hook docs and a product quick view example block (#9908)
  - Vue 版已有：useOverlay 已有文档页（apps/docs 的 overlay 组件目录）
- [x] [`992e28c60`](https://github.com/meta/astryx/commit/992e28c60) docs(architecture): the layer runtime's keyboard cap in INV11 and INV12 (#10143)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`8d59e5d35`](https://github.com/meta/astryx/commit/8d59e5d35) docs(layer-runtime): toastHost owns the toast context and queue (#10166)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.10

- [x] [`306051090`](https://github.com/meta/astryx/commit/306051090) fix(core): gestures read another window's nodes and touches (#10224)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。手势读取其他窗口的节点和触摸：点按识别、关闭栈、触屏规则按元素自己的 document 工作
- [x] [`332cc3bef`](https://github.com/meta/astryx/commit/332cc3bef) chore(core): split two long comments in LayerProvider and ToastViewport (#10244)
  - 不适用：只拆分两段长注释
- [x] [`0d7a25130`](https://github.com/meta/astryx/commit/0d7a25130) perf(Layer): the observer that follows a Tooltip's trigger re-arms from its own report, with no layout read (#10235)
  - 不适用：React 里观察 Tooltip 触发器的性能调整，Vue 版用几何轮询
- [x] [`c09c370ca`](https://github.com/meta/astryx/commit/c09c370ca) docs(AST-059): anchored layers place with CSS during scroll; keep three event reads (#10255)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4ceed673b`](https://github.com/meta/astryx/commit/4ceed673b) docs(AST-059): anchored layers flip before moving beside (#10257)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.11

- [x] [`9a8d14d6d`](https://github.com/meta/astryx/commit/9a8d14d6d) fix(Layer): toasts leave a closing modal in the commit that closes it (#10251)
  - 不适用：React 提交时机：toast 随模态对话框关闭的同一次提交离开；Vue 的 modalOutlet 在 close 事件里撤销
- [ ] [`a19128275`](https://github.com/meta/astryx/commit/a19128275) chore(core): the layer runtime's exit copy, for a touch presentation's close (#8186)
  - 暂缓：触屏呈现关闭用的退场副本：Vue 的浮层关闭即卸载，没有退场副本设施
- [x] [`14b138763`](https://github.com/meta/astryx/commit/14b138763) docs(AST-059): anchored layers re-pick once after scrolling stops (#10289)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`445b2b7a8`](https://github.com/meta/astryx/commit/445b2b7a8) [Component Audit] LayerProvider: its docs reach editors and describe nested providers correctly (#10283)
  - Vue 版已有：LayerProvider 文档已写明嵌套的 LayerProvider 不会开第二个 toast 视口
- [ ] [`5e67f0874`](https://github.com/meta/astryx/commit/5e67f0874) feat(Popover): under a finger, it grows out of its trigger and shrinks back into it (#8187)
  - 暂缓：手指下 Popover 从触发器长出再缩回：依赖退场副本和触屏呈现，Vue 版没有
- [x] [`74eb2160c`](https://github.com/meta/astryx/commit/74eb2160c) docs(layer-runtime, Popover): name settledBox's readers; fix comments (#10300)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`3bd5a4c1b`](https://github.com/meta/astryx/commit/3bd5a4c1b) fix(Layer): a still mouse presses through an entrance's input hold (#10303)
  - 暂缓：静止鼠标穿过进场输入遮挡：依赖进场输入遮挡，Vue 版没有
- [x] [`a9c911421`](https://github.com/meta/astryx/commit/a9c911421) fix(core): Overlay, AppShell and MobileNav work with no matchMedia (#10327)
  - Vue 版已有：useOverlay 没有 matchMedia 的环境不抛错，已有测试
- [x] [`a5b485e92`](https://github.com/meta/astryx/commit/a5b485e92) fix(Layer, Selector): the overlay slides above the software keyboard and keeps its top (#10169)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。浮层在软键盘上方，位置由 getLayerViewport 扣键盘高度，顶部不动
- [ ] [`5a6ed906f`](https://github.com/meta/astryx/commit/5a6ed906f) chore(Layer): name the gap a still mouse leaves, exactly (#10317)
  - 暂缓：进场输入遮挡里静止鼠标留下空隙的说明：依赖进场输入遮挡
- [x] [`2816569ac`](https://github.com/meta/astryx/commit/2816569ac) perf(Layer): a closing layer reads its animations only when its closed state declares an exit (#10368)
  - 不适用：React 性能：关闭时只在有退场动画时才读动画
- [x] [`8ba5bbcc3`](https://github.com/meta/astryx/commit/8ba5bbcc3) refactor(Layer): modals hand toasts back through a callback ref (#10351)
  - 不适用：React 回调 ref 重构

### v0.7.12

- [x] [`360701de7`](https://github.com/meta/astryx/commit/360701de7) fix(Text, Heading): the truncation tooltip mounts on the first hover, tap or focus (#10290)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。截断提示在第一次悬停、轻点或聚焦时才挂载
- [ ] [`95572ae80`](https://github.com/meta/astryx/commit/95572ae80) fix(Layer): a press that went down before an input hold lifts through the hold's shield (#10398)
  - 暂缓：进场输入遮挡抬起穿过遮挡：依赖进场输入遮挡
- [x] [`c3cef9f67`](https://github.com/meta/astryx/commit/c3cef9f67) docs(records): Kbd, LayerProvider and theming-surface verification follow-ups (#10299)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`55acf21ba`](https://github.com/meta/astryx/commit/55acf21ba) perf(Layer): read an entering layer's box without writing styles (#10240)
  - 不适用：React 性能：读进场浮层的盒子不写样式
- [x] [`0d7498a70`](https://github.com/meta/astryx/commit/0d7498a70) fix(Layer): a scroll started after the keyboard caps a layer is not undone (#10457)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。键盘遮住后又开始的滚动不被撤销：位置每次从最新可视视口重算
- [x] [`cd748d0e9`](https://github.com/meta/astryx/commit/cd748d0e9) chore(Layer): the outside-press watch can close on a pan, follow chosen pointer types, and judge a press in a closed shadow root (#9814)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。点外面的关闭可以按平移关闭、区分指针类型：dismissOnOutsidePan 和按指针类型的手指等抬起
- [x] [`698487f45`](https://github.com/meta/astryx/commit/698487f45) perf(Layer): an anchored layer's own hide runs only its layout (#10346)
  - 不适用：React 性能：锚定浮层自己隐藏时只做布局
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [x] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
  - 不适用：React 里两份模块共用同一个 context 的问题
- [x] [`b7e55a4cd`](https://github.com/meta/astryx/commit/b7e55a4cd) test(perf): overlay-churn-settled lets each anchored entrance end, so its count does not follow the runner's speed (#10496)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3890d68ef`](https://github.com/meta/astryx/commit/3890d68ef) fix(Layer): a capped layer over its trigger keeps its top (#10497)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。被限高的浮层压在触发器上方时保持顶边：键盘视口里重新计算位置
- [x] [`a21cd3ca0`](https://github.com/meta/astryx/commit/a21cd3ca0) fix(Layer): a Tooltip re-picks its side once a scroll stops, never mid-scroll (#10439)
  - 不适用：上游 CSS 锚点定位的 position-try 在滚动中途不换边；Vue 用 JS 每次按几何算位置，没有这个问题
- [x] [`71ade25a1`](https://github.com/meta/astryx/commit/71ade25a1) test(Layer): the close-layout proof traces once the layer rests (#10527)
  - 不适用：只改上游测试（自动初筛）
- [x] [`def46d15d`](https://github.com/meta/astryx/commit/def46d15d) fix(Layer): a Tooltip scrolls by CSS, and nothing watches its trigger move (#10472)
  - 不适用：上游 Tooltip 改成靠 CSS 滚动、不再监听触发器移动；Vue 靠 JS 定位和轮询
- [x] [`9dca38629`](https://github.com/meta/astryx/commit/9dca38629) perf(Layer): anchored entrances play on the surface (#10561)
  - 不适用：React 性能：锚定进场动画放在表面上
- [x] [`1c8292c42`](https://github.com/meta/astryx/commit/1c8292c42) fix(Layer): keep decorator portals outside renderer-managed DOM (#7633)
  - 不适用：React 渲染器托管的 DOM 与装饰器门户
- [x] [`92784f658`](https://github.com/meta/astryx/commit/92784f658) fix(core): a swizzled copy shares the package's per-page touch state (#10599)
  - 不适用：上游复制出来的组件共享页面级触屏状态；Vue 没有拷贝源码的用法
- [ ] [`6422a1db4`](https://github.com/meta/astryx/commit/6422a1db4) refactor(Layer): one presentation hold keeps a layer's chosen presentation until its close settles (#8587)
  - 暂缓：呈现保持（浮层选定的呈现直到关闭结束才换）：依赖触屏呈现，Vue 版没有
- [x] [`59881c7cc`](https://github.com/meta/astryx/commit/59881c7cc) fix(HoverCard,Tooltip): wait for the trigger to have a layout box before showing (#5398)
  - Vue 版已有：Vue 的 usePositionedLayer 在锚点几何变化时重算，触发器还没布局出来时先放着，布局出来后 100 毫秒内纠正
- [x] [`28401fb14`](https://github.com/meta/astryx/commit/28401fb14) fix(Layer): a layer opened by a right click stays open when that press is released (#10128)
  - Vue 版已有：dismissStack 按下时定计划，这次按压里才登记的层不会被这次按压关掉，右键打开的菜单松手不关
- [x] [`f9981429b`](https://github.com/meta/astryx/commit/f9981429b) test(Layer): the entrance layout proof names the source of a layout (#10684)
  - 不适用：只改上游测试（自动初筛）
- [x] [`71450dd2c`](https://github.com/meta/astryx/commit/71450dd2c) fix(DropdownMenu): the press that opens the menu does not close it (#10689)
  - Vue 版已有：同上：打开菜单的那一次按压不会关掉它（bornPress）
- [x] [`b01b7ee1c`](https://github.com/meta/astryx/commit/b01b7ee1c) fix(HoverCard): Escape and focus work in the card's own document, such as an iframe (#9592)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。HoverCard 的 Escape 和焦点在卡片自己的文档（如 iframe）里也管用
- [x] [`41e0de2e0`](https://github.com/meta/astryx/commit/41e0de2e0) test(Layer): the late-registration cases load their modules once (#10759)
  - 不适用：只改上游测试（自动初筛）
- [x] [`49bc221f5`](https://github.com/meta/astryx/commit/49bc221f5) fix(Layer): a swizzled LayerProvider shows the package's toasts (#10800)
  - 不适用：上游复制出来的 LayerProvider 要显示包里的 toast；Vue 没有拷贝源码的用法
- [x] [`438a0ff88`](https://github.com/meta/astryx/commit/438a0ff88) docs(layer-runtime, HoverCard): a trigger inside SVG foreignObject cannot be a CSS anchor in Chromium (#10908)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a1fda63c7`](https://github.com/meta/astryx/commit/a1fda63c7) fix(core): typing in a touch dialog's field no longer opens the trigger's tooltip on returned focus (#10639)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。触屏对话框的输入框里打字，不再因焦点还给触发器而打开它的提示
- [x] [`db705b961`](https://github.com/meta/astryx/commit/db705b961) feat(core): shared-realm helpers hold every kind of cross-module state (AST-110 FR3) (#10817)
  - 不适用：只改上游测试（自动初筛）

### v0.7.13

- [x] [`cc5ff492c`](https://github.com/meta/astryx/commit/cc5ff492c) fix(core): the layer runtime is one per page across swizzled copies (AST-110 FR3) (#10998)
  - 不适用：上游复制出来的多份组件共用一个页面级运行时；Vue 没有拷贝源码的用法
- [x] [`392bcef5e`](https://github.com/meta/astryx/commit/392bcef5e) spec(layers): layers follow anchors through CSS only and never inherit a press transform (#11024)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4398069ad`](https://github.com/meta/astryx/commit/4398069ad) test(Layer): browser cases for INV22, a layer and its trigger's press scale (#11028)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）

### v0.7.14

- [ ] [`19eadab60`](https://github.com/meta/astryx/commit/19eadab60) feat(Layer): an entrance slides from the side its layer lands on (#10771)
  - 暂缓：进场从浮层所在的一侧滑入：依赖触屏呈现和进场运行时
- [x] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
  - 不适用：React Server Components 的 'use client' 指令
- [x] [`fc9fb8ccc`](https://github.com/meta/astryx/commit/fc9fb8ccc) fix(core): registered icons reach swizzled copies; icon and theme registries are one per React (AST-110 FR3) (#11096)
  - 不适用：只改上游测试（自动初筛）
- [x] [`09479d9c7`](https://github.com/meta/astryx/commit/09479d9c7) fix(Popover): a touch that pans is not an outside press, even without pointercancel (#11038)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。手指在外面平移不算点外面，哪怕没有 pointercancel
- [x] [`9a3f29608`](https://github.com/meta/astryx/commit/9a3f29608) fix(useKeyboardHint): the arrow-key hint stays until dismissed, and Escape closes it (#10564)
  - 已移植：[#545](https://github.com/astryx-vue/astryx-vue/pull/545)。useKeyboardHint 默认不再 3 秒后消失，Escape 只关提示
- [x] [`25b7f1407`](https://github.com/meta/astryx/commit/25b7f1407) docs(layer-runtime): name the two remaining INV7 outside-pan gaps (#11157)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.15

- [x] [`38521acb9`](https://github.com/meta/astryx/commit/38521acb9) chore(core): remove the same-press leftovers: an unread dismissal field and stale comments (#11332)
  - Vue 版已有：同一次按压的残留清理：Vue 的 dismissStack 没有那个未读字段
- [x] [`eec79323c`](https://github.com/meta/astryx/commit/eec79323c) fix(Text, Tooltip): on Android, the first tap on a button or link in truncated text opens its tooltip; a tap on a text field never does (#11213)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。只认 :focus-visible 焦点；轻点文本框不开提示

### v0.7.16

- [x] [`1dbbc7302`](https://github.com/meta/astryx/commit/1dbbc7302) fix(useLayer): read committed callbacks and open state (#10912)
  - 不适用：React 里读取已提交的回调和打开状态
- [ ] [`91cd63fb1`](https://github.com/meta/astryx/commit/91cd63fb1) fix(Layer): keep an entrance's first frame off its trigger (#11396)
  - 暂缓：进场第一帧离开触发器：依赖进场从所在一侧滑入，Vue 版没有
- [x] [`7197c5827`](https://github.com/meta/astryx/commit/7197c5827) architecture(layer-runtime): the runtime owns the one input hold (INV16) (#8595)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`0e8c9613b`](https://github.com/meta/astryx/commit/0e8c9613b) fix(Layer): keep a flush layer's entrance off its trigger (#11417)
  - 暂缓：贴边浮层进场离开触发器：依赖进场从所在一侧滑入，Vue 版没有
- [x] [`b300313cb`](https://github.com/meta/astryx/commit/b300313cb) feat(Lightbox): a gallery's caption sits in a two-line band (#9810)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`cfc431d7a`](https://github.com/meta/astryx/commit/cfc431d7a) fix(layer): a release does not dismiss the layer it opened (#11258)
  - Vue 版已有：松手不会关掉刚被它打开的层：dismissStack 的 bornPress 加按下时定计划
- [x] [`36f68b0da`](https://github.com/meta/astryx/commit/36f68b0da) fix(layer): a press on another trigger of an open layer opens it there (#11337)
  - Vue 版已有：按下已开浮层的另一个触发器：先关再开，由 dismissStack 只管栈顶自己的触发器
- [x] [`1d48cc5e9`](https://github.com/meta/astryx/commit/1d48cc5e9) fix(useTouchTrigger): sync its callback refs at commit (#10892)
  - 不适用：React 里 useTouchTrigger 的回调 ref 在提交时同步；Vue 没有这个问题
- [ ] [`e372e3979`](https://github.com/meta/astryx/commit/e372e3979) fix(Popover): touch growth starts where the popover meets its trigger (#10949)
  - 暂缓：手指下 Popover 的长出起点：依赖触屏呈现，Vue 版没有
- [ ] [`248de60ab`](https://github.com/meta/astryx/commit/248de60ab) refactor(layer): a closing BottomSheet takes the shared input hold (#11447)
  - 暂缓：关闭中的 BottomSheet 使用共享输入遮挡：依赖输入遮挡
- [x] [`961b472f5`](https://github.com/meta/astryx/commit/961b472f5) test(Layer): count an entrance's layouts over its whole frames (#11512)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8a50ab2e8`](https://github.com/meta/astryx/commit/8a50ab2e8) feat(core): an internal shared-context entry for Lab (#11448)
  - 不适用：只改上游测试（自动初筛）
- [x] [`06e810df8`](https://github.com/meta/astryx/commit/06e810df8) test(layer): a finger ContextMenu row that opens a Popover leaves it open (#11497)
  - 不适用：只改上游测试（自动初筛）

### v0.7.17

- [x] [`55e666665`](https://github.com/meta/astryx/commit/55e666665) fix(core): no press scale on a trigger whose own layer is open (#11062)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`4800d992e`](https://github.com/meta/astryx/commit/4800d992e) feat(AlertDialog): touch motion on the theme's timing (#8373)
  - 暂缓：AlertDialog 触屏动效：依赖触屏呈现，Vue 版没有
- [ ] [`fb91b761f`](https://github.com/meta/astryx/commit/fb91b761f) fix(Layer): a released kept-inside hold never makes its layer inert (#11684)
  - 暂缓：已释放的保持内遮挡不再让浮层 inert：依赖输入遮挡
- [x] [`762a65d60`](https://github.com/meta/astryx/commit/762a65d60) perf(Layer): keep the tap recognizer apart from the touch trigger, so Text's first load drops 9.6 KB (#11599)
  - 不适用：React 包体拆分
- [ ] [`8c8dd0539`](https://github.com/meta/astryx/commit/8c8dd0539) fix(Layer): an exit copy keeps the padding and colors of what it copies (#11796)
  - 暂缓：退场副本保留内边距和颜色：依赖退场副本，Vue 版没有
- [x] [`6115f1130`](https://github.com/meta/astryx/commit/6115f1130) fix(Layer): open on a trigger in a closed <dialog> that renders (#11864)
  - Vue 版已有：同 #5398：锚点在还没渲染的 dialog 里时几何为零，渲染出来后轮询纠正位置
- [x] [`bf8555451`](https://github.com/meta/astryx/commit/bf8555451) fix(useFocusTrap): Tab stops inside a closed dialog the page displays (#11892)
  - 不适用：Vue Dialog 靠 showModal 显示，关闭的 dialog 不在页面上显示，没有「关闭但在显示」的状态
- [x] [`5a24fc0cf`](https://github.com/meta/astryx/commit/5a24fc0cf) fix(DropdownMenu): a waiting open still takes focus and fires onClick (#11905)
  - 不适用：上游等待中的打开仍取焦点、触发 onClick：针对 React 的 popover 等待路径，Vue 的 show 不经过等待
- [x] [`1bcd5bc44`](https://github.com/meta/astryx/commit/1bcd5bc44) fix(Selector, MultiSelector): a pick, or a press on a container that is no Tab stop, returns focus to the trigger (#11851)
  - 已移植：[#543](https://github.com/astryx-vue/astryx-vue/pull/543)。Selector、MultiSelector 选完或点在不是 Tab 停靠点的容器上，焦点回触发器
- [x] [`120629d82`](https://github.com/meta/astryx/commit/120629d82) fix(DropdownMenu): a mouse press opens a menu in another document (#11938)
  - Vue 版已有：Vue 的关闭栈在每个有层的 document 上各挂一套监听，且按下即关，另一个文档里的鼠标按下打开菜单后松手不会关掉它
- [x] [`0c52d0454`](https://github.com/meta/astryx/commit/0c52d0454) docs(spec): AST-116 Popover anchoring, modality and layer focus return (draft) (#11112)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d9676b913`](https://github.com/meta/astryx/commit/d9676b913) perf(CheckboxInput): the disabled-message tooltip runs only while it can show (#12376)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。合并批次里键盘视口与限高的部分按 #542 已移植；退场副本相关部分见各自条目的暂缓
- [x] [`c1f52ff91`](https://github.com/meta/astryx/commit/c1f52ff91) perf(core): reading the locale or direction does not load the message parser (#12975)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0dad34541`](https://github.com/meta/astryx/commit/0dad34541) feat(usePopover): anchorRef names an anchor apart from the trigger (spec:AST-116 FR1–FR3, FR5, FR6) (#11117)
  - Vue 版已有：usePopover 的 anchorRef 已和 triggerRef 分开，定位用 anchorRef，缺省回退到触发器
- [x] [`416b167cf`](https://github.com/meta/astryx/commit/416b167cf) fix(core): one focus return for Popover and DropdownMenu (popover presentation) and Dialog that never strands focus (AST-116 FR17–FR21, AR1) (#11121)
  - 不适用：只改上游测试（自动初筛）

## 布局与排版容器（area:core）

### v0.7.2

- [ ] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)
- [ ] [`d3ec0b25c`](https://github.com/meta/astryx/commit/d3ec0b25c) fix(AspectRatio): fit fills the box on the documented Tailwind setups (#7521)
- [ ] [`c35e7ac4c`](https://github.com/meta/astryx/commit/c35e7ac4c) fix(GridSpan): keep long content such as a Tokenizer token in its column (#7528)
- [ ] [`3c9b4ef2f`](https://github.com/meta/astryx/commit/3c9b4ef2f) fix(AppShell): defer hiding the mobile nav Activity boundary until close finishes (#6319)
- [ ] [`e26723dcf`](https://github.com/meta/astryx/commit/e26723dcf) docs(cli): import each Core export from the path `astryx component` prints (#7623)
- [ ] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
- [ ] [`caf5673d4`](https://github.com/meta/astryx/commit/caf5673d4) fix(cli): search ranks longer partial-name matches above a shorter named entry (#7725)
- [x] [`29fc5f906`](https://github.com/meta/astryx/commit/29fc5f906) test(a11y): add Toolbar contract and bind Toolbar (#7731)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`72db6f922`](https://github.com/meta/astryx/commit/72db6f922) fix(Grid): keep theme metadata authoritative (#7788)
- [ ] [`577a62e59`](https://github.com/meta/astryx/commit/577a62e59) [Component Audit] Grid: make responsive track behavior and evidence trustworthy (#7789)

### v0.7.3

- [ ] [`29ead9885`](https://github.com/meta/astryx/commit/29ead9885) fix(core): disabled links, tokens and cards stay focusable (#7842)

### v0.7.5

- [ ] [`3001ed5be`](https://github.com/meta/astryx/commit/3001ed5be) fix(core): enforce VisuallyHidden's styling-free contract at runtime (#7826)
- [ ] [`a88f185a1`](https://github.com/meta/astryx/commit/a88f185a1) fix(core): a card's press overlay paints a finger's press (#8057)
- [x] [`c85932b82`](https://github.com/meta/astryx/commit/c85932b82) docs(spec): AppShell records its shipped contract as current (#8262)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`24ed36dce`](https://github.com/meta/astryx/commit/24ed36dce) fix(ScrollableArea): touch screens keep the platform's scroll indicator (#8372)
- [x] [`a56c06134`](https://github.com/meta/astryx/commit/a56c06134) fix(Tooltip): a tooltip taller than the room around its trigger opens clear of it (#8254)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`c4f6253e5`](https://github.com/meta/astryx/commit/c4f6253e5) docs(SelectableCard): stop recommending it for single-select groups (#8419)
- [ ] [`28317b054`](https://github.com/meta/astryx/commit/28317b054) fix(Layout): collapse header/footer padding with sibling markers, not :has() followed by * (#8417)
- [x] [`23de0923e`](https://github.com/meta/astryx/commit/23de0923e) spec(AST-094): touch presentations feel native by default (#8409)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a3bf5402b`](https://github.com/meta/astryx/commit/a3bf5402b) docs(spec): AspectRatio records its shipped contract as current (#8529)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`327dd846b`](https://github.com/meta/astryx/commit/327dd846b) docs(spec): Toolbar records its shipped contract as current (#8715)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`a955a9a54`](https://github.com/meta/astryx/commit/a955a9a54) docs(spec): VisuallyHidden records its shipped contract as current (#8712)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`16443d084`](https://github.com/meta/astryx/commit/16443d084) docs(spec): Divider records its shipped contract as current (#8743)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`f8e0c9283`](https://github.com/meta/astryx/commit/f8e0c9283) feat(core): useAnimatedLayout, and Collapsible and TreeList glide the content after them (spec:AST-105) (#8568)
- [x] [`db165f86f`](https://github.com/meta/astryx/commit/db165f86f) spec(SideNav, AppShell): rail collapse by snap, clip and cross-fade (D38) (#8720)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`daab0b6e2`](https://github.com/meta/astryx/commit/daab0b6e2) docs(spec): Card records its shipped contract as current (#8757)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`07030cb5f`](https://github.com/meta/astryx/commit/07030cb5f) docs(spec): ClickableCard records its shipped contract as current (#8775)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`7ec7e0ac7`](https://github.com/meta/astryx/commit/7ec7e0ac7) docs(spec): SelectableCard records its shipped contract as current (#8782)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`b39314411`](https://github.com/meta/astryx/commit/b39314411) spec(family): action groups — press, slide across, act on lift (AST-094 FR26–FR28) (#8622)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`b8c5e4aee`](https://github.com/meta/astryx/commit/b8c5e4aee) feat(core): SideNav's rail collapses by snap, clip and cross-fade; AppShell's content moves on its clock (#8723)
- [x] [`0ebde5a9d`](https://github.com/meta/astryx/commit/0ebde5a9d) docs(spec): Center records its shipped contract as current (#8788)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`7d23f0bb6`](https://github.com/meta/astryx/commit/7d23f0bb6) docs(SideNav, AppShell): the rail collapse motion is implemented (FR6, FR17) (#8790)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`37a16c092`](https://github.com/meta/astryx/commit/37a16c092) docs(spec): Stack records its shipped contract as current (#8793)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`34d2513d8`](https://github.com/meta/astryx/commit/34d2513d8) test(SideNav, AppShell): real-browser frame evidence for the rail collapse (#8792)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`2b0f9a19f`](https://github.com/meta/astryx/commit/2b0f9a19f) docs(spec): Grid records its shipped contract as current (#8800)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`3f4484887`](https://github.com/meta/astryx/commit/3f4484887) docs(spec): Section records its shipped contract as current (#8810)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.6

- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [x] [`961f6336e`](https://github.com/meta/astryx/commit/961f6336e) docs(spec): Collapsible records its shipped contract as current (#9062)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`9b695006a`](https://github.com/meta/astryx/commit/9b695006a) fix(useResizable): read the window size during render only, not again after each commit (#8857)
- [x] [`48f3699cf`](https://github.com/meta/astryx/commit/48f3699cf) docs(spec): Layout records its shipped contract as current (#8822)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`c5383172d`](https://github.com/meta/astryx/commit/c5383172d) spec(AST-025): a Tab-able scroll area is named by its owner (FR12) (#9088)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b9b2db588`](https://github.com/meta/astryx/commit/b9b2db588) fix(Toolbar): a link shares the row's single tab stop (#8921)
- [ ] [`726703b55`](https://github.com/meta/astryx/commit/726703b55) fix(core): keep disabled ClickableCard out of the router link (#8659)
- [ ] [`00507ba07`](https://github.com/meta/astryx/commit/00507ba07) fix(AppShell): with fill height, keyboard users can scroll an overflowing main region (#8111)
- [x] [`25339ebac`](https://github.com/meta/astryx/commit/25339ebac) docs(spec): Resizable records its shipped contract as current (#9105)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`94eb29bea`](https://github.com/meta/astryx/commit/94eb29bea) fix(useResizable): a drag saves its size once, when it ends, not on every move (#7782)
- [x] [`0fa02074f`](https://github.com/meta/astryx/commit/0fa02074f) spec(AST-105, Resizable, LayoutPanel, SideNav): one shared edge reveal; a resizable LayoutPanel slides on collapse and open; focus leaves a collapsing panel (#8783)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
- [ ] [`853d94a02`](https://github.com/meta/astryx/commit/853d94a02) refactor(AppShell): main's ref is the one owner of its overflow observation and keyboard delegation (#9262)
- [ ] [`00146a716`](https://github.com/meta/astryx/commit/00146a716) refactor(Resizable): the resize model's pure parts live in one non-React module (#9197)
- [ ] [`8c15f9975`](https://github.com/meta/astryx/commit/8c15f9975) [Component Audit] GridSpan: accessibility and RTL audits now reach spanned grid items (#9312)
- [ ] [`8c8f0dac6`](https://github.com/meta/astryx/commit/8c8f0dac6) fix(Collapsible): focus inside closing content moves to the trigger (#9250)
- [x] [`350ee2eb9`](https://github.com/meta/astryx/commit/350ee2eb9) docs(spec): GridSpan and Heading verification maps name the checks that now cover them (#9349)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3d44c583a`](https://github.com/meta/astryx/commit/3d44c583a) fix(Tooltip, HoverCard): a press inside an open surface doesn't activate the card, row or field around it (#9252)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f885b8b29`](https://github.com/meta/astryx/commit/f885b8b29) test(rtl): RTL coverage for Stack, StackItem, HStack, VStack and Grid (#9303)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`7c4e5fac0`](https://github.com/meta/astryx/commit/7c4e5fac0) docs(Grid): align and justify leave the browser default when unset (#9347)
- [x] [`4ee1f87eb`](https://github.com/meta/astryx/commit/4ee1f87eb) test(rtl): RTL coverage for LayoutContent, LayoutPanel and ResizeHandle (#9292)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f05874d4c`](https://github.com/meta/astryx/commit/f05874d4c) spec(AppShell): AppShell is a layout root and cancels inherited layout context (#9403)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c5fbecb8d`](https://github.com/meta/astryx/commit/c5fbecb8d) spec(i18n, Resizable, AST-103): factories take announcement and label options with a catalog default (#9395)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
- [ ] [`4f4795a61`](https://github.com/meta/astryx/commit/4f4795a61) fix(AppShell): AppShell is a layout root; nothing an ancestor Layout, Card or Section passes down reaches its regions (#9418)
- [x] [`41aa83233`](https://github.com/meta/astryx/commit/41aa83233) spec(layer-runtime): a click inside a layer stops at the layer root (#9398)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a986306fa`](https://github.com/meta/astryx/commit/a986306fa) spec(container-padding): AppShell is a boundary owner (#9461)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`09a482eaf`](https://github.com/meta/astryx/commit/09a482eaf) fix(Layer): a press inside a layer stops at the layer root in the React tree (#9497)
- [ ] [`f20625c02`](https://github.com/meta/astryx/commit/f20625c02) [Component Audit] HStack: alignment and right-to-left flow are now proven in a browser (#9540)
- [x] [`2227dcbf6`](https://github.com/meta/astryx/commit/2227dcbf6) spec(HoverCard, Stack): verification maps name the audit tests and browser evidence (#9582)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`c3cdc8e97`](https://github.com/meta/astryx/commit/c3cdc8e97) docs(Stack, VStack, StackItem): horizontal flow follows the writing direction, and the styling props and ref are documented (#9583)

### v0.7.7

- [ ] [`36f8ea10e`](https://github.com/meta/astryx/commit/36f8ea10e) feat(AppShell): keep the header's items and the content's end inside the device's safe area (#8150)
- [x] [`cae1f668c`](https://github.com/meta/astryx/commit/cae1f668c) test(Resizable): load the package root while the file is collected, not inside a timed test (#8471)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3e0934850`](https://github.com/meta/astryx/commit/3e0934850) test(AspectRatio): the fit-layer spec answers the story's remote photos locally (#9703)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`30bae0c89`](https://github.com/meta/astryx/commit/30bae0c89) refactor(Resizable): ResizeHandle's input moves into resizeGesture.ts (#9680)
- [ ] [`ab905553a`](https://github.com/meta/astryx/commit/ab905553a) fix(BreadcrumbItem): a crumb in the AppShell mobile drawer closes it (#9683)

### v0.7.8

- [ ] [`b377b211b`](https://github.com/meta/astryx/commit/b377b211b) fix(Resizable): the Grab zone stays on the Handle whatever pillPlacement says, and a short item keeps its own drag (#9529)
- [ ] [`9136e28c7`](https://github.com/meta/astryx/commit/9136e28c7) feat: a single-choice set of selectable cards is a radio group (lab SelectableCardGroup) (#8260)
- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [ ] [`f9a696545`](https://github.com/meta/astryx/commit/f9a696545) refactor(Resizable): one internal createResizable factory, which useResizable's configuration-object form and ResizeHandle's resizable path go through (#9297)
- [ ] [`73996f1b2`](https://github.com/meta/astryx/commit/73996f1b2) fix(core): a layout change made late in a long task plays its motion instead of skipping past it (#9274)
- [ ] [`946211065`](https://github.com/meta/astryx/commit/946211065) perf(core): an overlay's eager import no longer carries the lazy BottomSheet's padding (#8550)
- [ ] [`cfd120e4c`](https://github.com/meta/astryx/commit/cfd120e4c) feat(Resizable): createResizable drives a plain handle element, with one separator derivation (#9718)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [ ] [`f59ffe155`](https://github.com/meta/astryx/commit/f59ffe155) fix(ClickableCard, SelectableCard): no touch pressed look for a finger press that starts on a control inside the card (#9801)
- [x] [`a0c48b8d7`](https://github.com/meta/astryx/commit/a0c48b8d7) docs(AST-105, AST-108): glides and tap-to-expand play the theme's motion tokens (#9964)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [x] [`63a41bbdc`](https://github.com/meta/astryx/commit/63a41bbdc) spec(MobileNav): the drawer's links sit in a navigation landmark (DEC-1) (#9010)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`cb2a34a62`](https://github.com/meta/astryx/commit/cb2a34a62) fix(a11y): name a scrolling LayoutContent, LayoutPanel or StackItem (#9985)
- [x] [`b1e8e09c9`](https://github.com/meta/astryx/commit/b1e8e09c9) fix(a11y): give the scroll-region name stories focusable content (#10019)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1fec9fa77`](https://github.com/meta/astryx/commit/1fec9fa77) feat(Resizable): `resizable` takes useResizable's output on LayoutPanel, ResizeHandle and SideNav, and focus leaves a collapsing panel (#9300)
- [x] [`634b64991`](https://github.com/meta/astryx/commit/634b64991) test(core): the StyleX rule recorders load their components before any test, not inside a 30 s hook (#10014)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`267399819`](https://github.com/meta/astryx/commit/267399819) chore(Resizable): restore mocks after each resizable-slot case, plus two source cleanups (#10032)
- [ ] [`57e054031`](https://github.com/meta/astryx/commit/57e054031) fix(LayoutPanel): a panel at width 0 takes no space and shows none of its children (#9992)
- [ ] [`5985abc13`](https://github.com/meta/astryx/commit/5985abc13) fix(core): no press scale or card color fade under reduced motion (#8326)

### v0.7.10

- [ ] [`8bd8c6146`](https://github.com/meta/astryx/commit/8bd8c6146) fix(core): layout glides play the theme's move curve, not a spring (#10236)
- [ ] [`2151c883d`](https://github.com/meta/astryx/commit/2151c883d) fix(AppShell): a second shell on a page gets its own main id (#10199)

### v0.7.11

- [ ] [`a9c911421`](https://github.com/meta/astryx/commit/a9c911421) fix(core): Overlay, AppShell and MobileNav work with no matchMedia (#10327)
- [ ] [`1f88264ec`](https://github.com/meta/astryx/commit/1f88264ec) docs(core): Layout's fill height needs a container with a set height (#10348)
- [ ] [`0ecd324bf`](https://github.com/meta/astryx/commit/0ecd324bf) fix(core): a block-edge reveal slides its parts on the glide's frames (#10296)

### v0.7.12

- [ ] [`c942796a1`](https://github.com/meta/astryx/commit/c942796a1) docs(Section): center a Section with the inline-margin longhands in xstyle (#10207)
- [ ] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`227855776`](https://github.com/meta/astryx/commit/227855776) [Component Audit] Layout: a region hidden with && lays out like an omitted one (#10500)
- [ ] [`8591d75ed`](https://github.com/meta/astryx/commit/8591d75ed) [Component Audit] LayoutContent: full-bleed children and open edges line up with the Layout (#10516)
- [x] [`64ca3b715`](https://github.com/meta/astryx/commit/64ca3b715) docs(specs): Layout and LayoutContent records match the closed slot and inset gaps (#10557)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`46d181337`](https://github.com/meta/astryx/commit/46d181337) feat(Resizable): a resizable LayoutPanel slides closed and open under every pointer (#9989)
- [ ] [`916a8e2fa`](https://github.com/meta/astryx/commit/916a8e2fa) feat(Resizable): a pull past a limit rubber-bands and only the lift closes (#10292)
- [ ] [`0c0f9515f`](https://github.com/meta/astryx/commit/0c0f9515f) fix(Toolbar): the three-lane row wraps instead of letting lanes overlap at large text (#10563)
- [ ] [`1ffc0dac9`](https://github.com/meta/astryx/commit/1ffc0dac9) fix(BottomSheet): resting content starts below the grab bar, whatever the padding (#8558)
- [ ] [`7c3d28a62`](https://github.com/meta/astryx/commit/7c3d28a62) docs(Resizable): the close-on-lift docs name every pointer and the key step (#10635)
- [ ] [`db40c6b01`](https://github.com/meta/astryx/commit/db40c6b01) refactor(core): share per-instance warning dedupe and temporary focus targets (#10655)
- [ ] [`17f6985ed`](https://github.com/meta/astryx/commit/17f6985ed) fix(Layout): a full-bleed Table or List row takes the rounded container corner it reaches (#10586)
- [ ] [`9d753c5c2`](https://github.com/meta/astryx/commit/9d753c5c2) [Component Audit] LayoutFooter: spacing above the footer always follows its divider (#10674)
- [ ] [`44862e54e`](https://github.com/meta/astryx/commit/44862e54e) [Component Audit] LayoutHeader: spacing below the header always follows its divider (#10686)
- [x] [`c86484dc5`](https://github.com/meta/astryx/commit/c86484dc5) docs(specs): LayoutHeader and LayoutFooter records state that a caller data-divider never replaces the divider state (#10714)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`0191e1370`](https://github.com/meta/astryx/commit/0191e1370) fix(Layout): a Layout with no contentWidth caps no header or footer (#10715)
- [ ] [`3165c2fb3`](https://github.com/meta/astryx/commit/3165c2fb3) docs(Layout): containerCorners' header says the corner variables ship in the CSS (#10701)
- [ ] [`50d20be92`](https://github.com/meta/astryx/commit/50d20be92) docs(LayoutPanel): the JSDoc example wraps its Layout in a Card (#10716)
- [x] [`3e987d69c`](https://github.com/meta/astryx/commit/3e987d69c) test(Layout): regular tests for LayoutHeader and LayoutFooter edges and xstyle order (#10737)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7f04a6c5a`](https://github.com/meta/astryx/commit/7f04a6c5a) fix(Table): an unbounded column's resize handle announces a range that holds its width (#10577)
- [x] [`669270b3f`](https://github.com/meta/astryx/commit/669270b3f) docs(Layout): LayoutHeader and LayoutFooter verification maps name the regular edge and xstyle tests (#10751)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`ff7e096ba`](https://github.com/meta/astryx/commit/ff7e096ba) fix(ScrollableArea): complete hardening audit (#6314)
- [ ] [`fe174dd12`](https://github.com/meta/astryx/commit/fe174dd12) [Component Audit] LayoutPanel: full-bleed children reach the panel's outer edge (#10774)
- [x] [`78ac0b132`](https://github.com/meta/astryx/commit/78ac0b132) docs(records): LayoutPanel publishes its applied inset; Lightbox's gaps for 0, announcements and Tab are closed (#10819)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`d53cec5c7`](https://github.com/meta/astryx/commit/d53cec5c7) docs(useClickableContainer): a pressable surface without Card chrome (#10880)

### v0.7.14

- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [x] [`9a3f29608`](https://github.com/meta/astryx/commit/9a3f29608) fix(useKeyboardHint): the arrow-key hint stays until dismissed, and Escape closes it (#10564)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`e392855f9`](https://github.com/meta/astryx/commit/e392855f9) fix(core): a swizzled ResizeHandle and LayoutPanel find each other across copies (AST-110 FR3) (#11131)
- [ ] [`62093dfb5`](https://github.com/meta/astryx/commit/62093dfb5) docs(AppShell): name TopNav with label and SideNav with aria-label (#11151)
- [ ] [`34f7fd0b9`](https://github.com/meta/astryx/commit/34f7fd0b9) fix(core): one outermost AppShell keeps the main id across swizzled copies (AST-110 FR3) (#11208)
- [x] [`dc1103320`](https://github.com/meta/astryx/commit/dc1103320) test(SideNav): block the reversal only after a drawn collapse frame (#10984)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1cca49a92`](https://github.com/meta/astryx/commit/1cca49a92) test(AppShell): load the layout-root story once, not once per host (#10985)
  - 不适用：只改上游测试（自动初筛）

### v0.7.15

- [ ] [`426ba2361`](https://github.com/meta/astryx/commit/426ba2361) fix(Resizable): write the handle's refs at commit, not in render (#10803)

### v0.7.16

- [ ] [`869cfc51b`](https://github.com/meta/astryx/commit/869cfc51b) fix(AppShell): content that has not hydrated keeps its server HTML below the mobile breakpoint (#11441)
- [ ] [`2fec02259`](https://github.com/meta/astryx/commit/2fec02259) fix(SideNav, TopNav): a modified click on a drawer link leaves the mobile drawer open (#9390)

### v0.7.17

- [ ] [`ce0feb506`](https://github.com/meta/astryx/commit/ce0feb506) fix(core): a Table bleeds to a block edge only as its container's direct first or last child (#12068)
- [x] [`cb315c6ae`](https://github.com/meta/astryx/commit/cb315c6ae) docs(architecture): press feedback has one engine and three recipes (#12115)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`f5bd0f8de`](https://github.com/meta/astryx/commit/f5bd0f8de) Component docs: playground.mobile for a phone-width render (AppShell's mobile layout) (#12477)
- [ ] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
- [ ] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
- [ ] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
- [ ] [`b9f60ffba`](https://github.com/meta/astryx/commit/b9f60ffba) perf(Resizable): ResizeHandle reads the hook's channel from the resize model, not useResizable (#12050)
- [ ] [`472896d35`](https://github.com/meta/astryx/commit/472896d35) fix(Toolbar, OverflowList): a start lane's own OverflowList folds beside the end lane (#12238)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`a16f2e4a4`](https://github.com/meta/astryx/commit/a16f2e4a4) chore: land batch 13 (2 pull requests) (#12854)
- [ ] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [ ] [`904b58e64`](https://github.com/meta/astryx/commit/904b58e64) chore: land batch 29 (3 pull requests) (#12894)
- [ ] [`476d9063f`](https://github.com/meta/astryx/commit/476d9063f) chore: land batch 63 (3 pull requests) (#12945)
- [ ] [`8c5fa4736`](https://github.com/meta/astryx/commit/8c5fa4736) fix(Resizable): only the handle's own keys act; other modifier combinations pass through (#11995)

## 列表与树形结构（area:core）

### v0.7.2

- [ ] [`58d335331`](https://github.com/meta/astryx/commit/58d335331) docs(ListItem): document label as a ReactNode, matching its props type (#7609)
- [x] [`35b9e7603`](https://github.com/meta/astryx/commit/35b9e7603) spec(TreeList): record full-width nested rows (#7637)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`fe2c655c1`](https://github.com/meta/astryx/commit/fe2c655c1) spec(Item): align="first-line" centers start and end content on the label's first line (#7642)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`caec7cab6`](https://github.com/meta/astryx/commit/caec7cab6) feat(Item): align="first-line" centers start and end content on the label's first line (#7643)
- [ ] [`7c206edbb`](https://github.com/meta/astryx/commit/7c206edbb) feat(List): one edge prop for padded, flush, outset, and bleed rows (#7592)
- [ ] [`151434aac`](https://github.com/meta/astryx/commit/151434aac) fix(MetadataList): allow label width without explicit position (#6310)
- [ ] [`52c26fb74`](https://github.com/meta/astryx/commit/52c26fb74) fix(TreeList): keep nested rows full width and indent their content (#7602)
- [ ] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)

### v0.7.3

- [ ] [`cde6233de`](https://github.com/meta/astryx/commit/cde6233de) fix(core): TreeList, Pagination dots and Calendar days use aria-disabled (#7887)

### v0.7.5

- [ ] [`5b87452ee`](https://github.com/meta/astryx/commit/5b87452ee) fix(Item): swipe rows leave pinch-zoom to the browser (#8042)
- [ ] [`d8d8fdeff`](https://github.com/meta/astryx/commit/d8d8fdeff) docs(ListItem): isSelected sets aria-current, not aria-selected (#8090)
- [x] [`c743ae000`](https://github.com/meta/astryx/commit/c743ae000) spec(design): under reduced motion, touch cross-fades and other pointers change at once (#8272)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [x] [`8ba53b45a`](https://github.com/meta/astryx/commit/8ba53b45a) spec(AST-103): createReorderable, one reorder behavior for every collection (#8461)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`c01521cf9`](https://github.com/meta/astryx/commit/c01521cf9) spec(AST-094, AST-057): gestures work on the web for every pointer (FR43) (#8646)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`91399183e`](https://github.com/meta/astryx/commit/91399183e) spec(TreeList): an expanding group's own motion under a coarse pointer (FR8) (#8691)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`02c6cf34d`](https://github.com/meta/astryx/commit/02c6cf34d) spec(List): a touch row's press paint and the animated layout handle for row updates (FR11–FR12) (#8687)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`f8e0c9283`](https://github.com/meta/astryx/commit/f8e0c9283) feat(core): useAnimatedLayout, and Collapsible and TreeList glide the content after them (spec:AST-105) (#8568)
- [x] [`640599c5a`](https://github.com/meta/astryx/commit/640599c5a) spec(ContextMenu, List): ContextMenu on the headless menu; ListItem row menus attach to the li (#8648)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`84faa0d94`](https://github.com/meta/astryx/commit/84faa0d94) spec(List): a pressed row's dividers stay drawn (FR11, D41) (#8776)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`0f3d2f49d`](https://github.com/meta/astryx/commit/0f3d2f49d) spec(List): a row's start and end content animate with a handle (FR12, D40) (#8779)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`4c07cbb94`](https://github.com/meta/astryx/commit/4c07cbb94) test(TreeList): the tree-view coverage check runs as one serial part per state (#9004)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`76cd3b89e`](https://github.com/meta/astryx/commit/76cd3b89e) fix(List): keep numbered markers whole and sibling text aligned (#7650)
- [ ] [`1c1d0ea24`](https://github.com/meta/astryx/commit/1c1d0ea24) fix(core): align TreeList guides to chevrons (#8774)

### v0.7.6

- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [x] [`3d78469cf`](https://github.com/meta/astryx/commit/3d78469cf) docs(spec): List records its shipped contract as current (#9083)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`0de27fe66`](https://github.com/meta/astryx/commit/0de27fe66) docs(spec): MetadataList records its shipped contract as current (#9090)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`d7cd32c09`](https://github.com/meta/astryx/commit/d7cd32c09) fix(Item, TreeList): a disabled row's link has no destination (spec:AST-085 FR2) (#9056)
- [x] [`1010d4c61`](https://github.com/meta/astryx/commit/1010d4c61) docs(spec): OverflowList records its shipped contract as current (#9111)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`52cc5d117`](https://github.com/meta/astryx/commit/52cc5d117) docs(spec): Outline records its shipped contract as current (#9117)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`f73623d1b`](https://github.com/meta/astryx/commit/f73623d1b) fix(Outline): following a link moves focus to the chosen section (#9045)
- [x] [`b234968f1`](https://github.com/meta/astryx/commit/b234968f1) spec(AST-057): flick opens, tap closes, full swipe confirms (FR4/FR5/FR7) (#9156)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`30e724b45`](https://github.com/meta/astryx/commit/30e724b45) fix(core): a disabled Item swipe action stays focusable (#9211)
- [ ] [`3e735de86`](https://github.com/meta/astryx/commit/3e735de86) fix(core A–M): slots use isRenderable; the remaining checks are allowed with a reason (#9204)
- [ ] [`0135af462`](https://github.com/meta/astryx/commit/0135af462) fix(core N–Z): slots use isRenderable; the remaining checks are allowed with a reason (#9206)
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`acfa52701`](https://github.com/meta/astryx/commit/acfa52701) fix(useTypeahead): type-to-select ignores accents (#8864)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3d44c583a`](https://github.com/meta/astryx/commit/3d44c583a) fix(Tooltip, HoverCard): a press inside an open surface doesn't activate the card, row or field around it (#9252)
- [ ] [`356e9a8ab`](https://github.com/meta/astryx/commit/356e9a8ab) fix(TreeList): focus inside a collapsing branch moves to its row (#9251)
- [x] [`e7530dbb4`](https://github.com/meta/astryx/commit/e7530dbb4) test(rtl): RTL coverage for seven Core parts (Step, OverflowList, dialogs, MobileNav, menus) (#9332)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2406addf5`](https://github.com/meta/astryx/commit/2406addf5) test(rtl): RTL coverage for list, metadata, radio, selector and typeahead rows (#9308)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2224fa801`](https://github.com/meta/astryx/commit/2224fa801) test(rtl): OverflowList's D2 target pairs its first two items (#9384)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
- [x] [`054b23cdc`](https://github.com/meta/astryx/commit/054b23cdc) spec(AST-057, Item): configure swipe through swipe={createSwipe(…)} (#9387)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`9728cd78b`](https://github.com/meta/astryx/commit/9728cd78b) spec(react-component-runtime, TreeList, Table, CommandPalette): record empty slots rendering nothing (backfill) (#9388)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b5e716687`](https://github.com/meta/astryx/commit/b5e716687) refactor(Item, Token, ChatComposer): drop the per-site tooltip surface checks the layer boundary replaces (#9531)

### v0.7.7

- [x] [`b53bec615`](https://github.com/meta/astryx/commit/b53bec615) test: module loads are awaited, not raced against test clocks (#9447)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9911442c1`](https://github.com/meta/astryx/commit/9911442c1) fix(Outline): every link is in the normal Tab order (#9695)
- [ ] [`120847534`](https://github.com/meta/astryx/commit/120847534) docs(useOutlineFromMarkdown): add hook docs and a docs article example block (#9719)

### v0.7.8

- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f10bc9153`](https://github.com/meta/astryx/commit/f10bc9153) spec(AST-094): only a gesture's motion springs; other motion plays the theme's tokens (#9706)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.9

- [ ] [`f59ffe155`](https://github.com/meta/astryx/commit/f59ffe155) fix(ClickableCard, SelectableCard): no touch pressed look for a finger press that starts on a control inside the card (#9801)
- [ ] [`298bafbc1`](https://github.com/meta/astryx/commit/298bafbc1) fix(core): a list row's touch press release runs on the compositor (#9762)
- [ ] [`67ad50980`](https://github.com/meta/astryx/commit/67ad50980) fix(core): a finger press on a control inside a list row, TreeList row or Token shows no press on it (#9959)
- [x] [`3d225c35b`](https://github.com/meta/astryx/commit/3d225c35b) feat(core): under a finger a pressable highlights at touch-down outside scroll views (#9765)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`504ee1863`](https://github.com/meta/astryx/commit/504ee1863) fix(theme): the stock theme's dark-mode accent is darker, so white button text meets 4.5:1 (#9818)
- [x] [`7f8de290c`](https://github.com/meta/astryx/commit/7f8de290c) fix(core): a press's release fades on the theme's exit motion tokens (#9890)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`7b71d71b4`](https://github.com/meta/astryx/commit/7b71d71b4) feat(List): a row's touch target grows toward 44 px where its neighbors leave room (#8085)
- [x] [`b1f604c9f`](https://github.com/meta/astryx/commit/b1f604c9f) fix(OverflowList): a resize shows the new visible set in the same frame (height-changing folds stay one frame late) (#9926)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`10d297901`](https://github.com/meta/astryx/commit/10d297901) test(core): the WebKit row release video proof judges rest on the exit curve (#10011)
  - 不适用：只改上游测试（自动初筛）
- [x] [`922c0e85d`](https://github.com/meta/astryx/commit/922c0e85d) test(List): the press release curve proof holds the release in the page (#10047)
  - 不适用：只改上游测试（自动初筛）
- [x] [`784dc5ec4`](https://github.com/meta/astryx/commit/784dc5ec4) test(List): the busy release proof starts its block in the page (#10048)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f9281ef1c`](https://github.com/meta/astryx/commit/f9281ef1c) perf(OverflowList): only the multi-row form tracks rows and rowHeight (#8523)
- [x] [`257573b22`](https://github.com/meta/astryx/commit/257573b22) docs(AST-094, AST-057): motion guidance; gesture springs; swipe-row returns (#9915)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`3d018fb9d`](https://github.com/meta/astryx/commit/3d018fb9d) [Component Audit] Item: a theme can restyle highlighted, selected, and disabled rows (#10073)
- [ ] [`9e7567c48`](https://github.com/meta/astryx/commit/9e7567c48) fix(Item): a selected row shows hover and press over its fill; a highlighted row shows press (#10111)

### v0.7.10

- [x] [`e8ecde4ff`](https://github.com/meta/astryx/commit/e8ecde4ff) fix(core): a button's touch press release runs on the compositor (#9783)
  - 不适用：只改上游测试（自动初筛）

### v0.7.11

- [x] [`e7c0eb593`](https://github.com/meta/astryx/commit/e7c0eb593) docs(Item): name the row states the item theme target reflects (#10104)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`cdd64dfe4`](https://github.com/meta/astryx/commit/cdd64dfe4) docs(windowing): one shared private windowing module (spec only) (#10287)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`e245db5fb`](https://github.com/meta/astryx/commit/e245db5fb) feat(core): the keyboard module's docked ride, the scroller's reveal and the tap route (#9776)
- [ ] [`a6d2716de`](https://github.com/meta/astryx/commit/a6d2716de) fix(List): a highlighted row's dividers stay visible through its tint (#10280)
- [ ] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)
- [x] [`28270c143`](https://github.com/meta/astryx/commit/28270c143) test(interaction-harness): an armed hold names the motion it judges (#10386)
  - 不适用：只改上游测试（自动初筛）

### v0.7.12

- [x] [`d232fe10e`](https://github.com/meta/astryx/commit/d232fe10e) test(core): the swipe spring-back read stops the scene at the lift (#10432)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b1327c020`](https://github.com/meta/astryx/commit/b1327c020) test: watch before the action at 28 first-contact waits (#10286)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`36929ac92`](https://github.com/meta/astryx/commit/36929ac92) feat(List): animate row inserts, removals and moves through the animatedLayout handle (#8106)
- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9eb962686`](https://github.com/meta/astryx/commit/9eb962686) test(List): the row press holds are armed before the press (#10477)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`b8cc3f41e`](https://github.com/meta/astryx/commit/b8cc3f41e) fix(Markdown): each prose block lays out in its own text's direction (#10293)
- [ ] [`e89bdc881`](https://github.com/meta/astryx/commit/e89bdc881) feat(TreeList): the expand moves as one under a finger (#8088)
- [x] [`7045020ad`](https://github.com/meta/astryx/commit/7045020ad) docs(specs): Table row virtualization adopts the shared list-windowing module first (#10665)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`17f6985ed`](https://github.com/meta/astryx/commit/17f6985ed) fix(Layout): a full-bleed Table or List row takes the rounded container corner it reaches (#10586)
- [ ] [`a28d586eb`](https://github.com/meta/astryx/commit/a28d586eb) feat(core): createReorderable makes List rows reorderable (#8139)
- [ ] [`36b8f6ebc`](https://github.com/meta/astryx/commit/36b8f6ebc) feat(lab): TransferList reorders through core's createReorderable (#8143)
- [x] [`df4c958ec`](https://github.com/meta/astryx/commit/df4c958ec) perf(core): motions one callback starts read stylesheets in one pass (#10728)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`6103d36e9`](https://github.com/meta/astryx/commit/6103d36e9) feat(lab): ListInput reorders through core's createReorderable (#8163)
- [x] [`5f1e4dd68`](https://github.com/meta/astryx/commit/5f1e4dd68) test(List): proofs of the reorder's preview, glides, handle and ring (#10748)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f2a6332eb`](https://github.com/meta/astryx/commit/f2a6332eb) fix(List): a swizzled copy reads a package reorderable object (#10741)
- [ ] [`06ebae229`](https://github.com/meta/astryx/commit/06ebae229) fix(List): a drag follows a scroll around the list's scroll box (#10742)
- [x] [`f8a426486`](https://github.com/meta/astryx/commit/f8a426486) docs(List): FR11's divider rule holds for every pointer (#10769)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`42081ef30`](https://github.com/meta/astryx/commit/42081ef30) docs(windowing): restore the owner's approval lines and drop adoption order (#10795)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`9ea776e22`](https://github.com/meta/astryx/commit/9ea776e22) fix(motion): WebKit draws a glide's last frame at its place (#10663)
  - 不适用：只改上游测试（自动初筛）
- [x] [`35099e811`](https://github.com/meta/astryx/commit/35099e811) test(List): a reorder busy proof tells a starved run from a frozen row (#10825)
  - 不适用：只改上游测试（自动初筛）
- [x] [`fe675b64c`](https://github.com/meta/astryx/commit/fe675b64c) test(List): the release end is judged on the page's clock (#10889)
  - 不适用：只改上游测试（自动初筛）

### v0.7.13

- [x] [`05e655281`](https://github.com/meta/astryx/commit/05e655281) test(Item): wait for the swipe panel's commit, not only its module (#10933)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1ac0c2464`](https://github.com/meta/astryx/commit/1ac0c2464) refactor(core): one shared list-windowing engine, with Table as its first consumer (#10810)
- [x] [`6bf928d91`](https://github.com/meta/astryx/commit/6bf928d91) spec(AST-057): a flick reveals the actions; only a deliberate drag fires one (#11025)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.14

- [x] [`fa7672fd9`](https://github.com/meta/astryx/commit/fa7672fd9) test(List): the update proofs read an exit while it runs (#10973)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9f4ff7bbd`](https://github.com/meta/astryx/commit/9f4ff7bbd) test(TreeList): proofs read each motion as it starts, or name a starved page (#10994)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5eaeb400d`](https://github.com/meta/astryx/commit/5eaeb400d) docs(records): pull requests carry an API delta instead of a committed API report (#10950)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1ee6b3abb`](https://github.com/meta/astryx/commit/1ee6b3abb) test(List): the busy release fade is timed by its own clock (#11056)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [x] [`f26571e10`](https://github.com/meta/astryx/commit/f26571e10) spec(Table): column virtualization windows the unpinned columns (#11013)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`36bf4fc9d`](https://github.com/meta/astryx/commit/36bf4fc9d) refactor(reorder): the controller reads a collection's rows through a reader (#11199)
- [ ] [`93300ef29`](https://github.com/meta/astryx/commit/93300ef29) fix(core): a List and a swizzled ListItem share reported rows and kept presentation (AST-110 FR3) (#11214)

### v0.7.15

- [ ] [`2a74aebdc`](https://github.com/meta/astryx/commit/2a74aebdc) fix(Item): keep disabled actions keyboard-reachable (#11169)
- [x] [`e7e9af2f8`](https://github.com/meta/astryx/commit/e7e9af2f8) feat(core): a mouse or pen press on a checkbox or a radio option paints at once and fades on release (#8696)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`598b588a4`](https://github.com/meta/astryx/commit/598b588a4) test(TreeList): a band in a frame WebKit read late is named (#10920)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`558725695`](https://github.com/meta/astryx/commit/558725695) [Component Audit] List: docs name its optional header and where its ref lands (#11277)
- [ ] [`5398a993c`](https://github.com/meta/astryx/commit/5398a993c) fix(Item): a flick reveals swipe actions; only a deliberate drag fires (#11054)
- [ ] [`807dc2ead`](https://github.com/meta/astryx/commit/807dc2ead) refactor(core): name the nested press rule for every pointer it covers (#11304)
- [x] [`061b2fa8d`](https://github.com/meta/astryx/commit/061b2fa8d) test(List): the reorder busy proof decodes its cast once (#11075)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a90e05300`](https://github.com/meta/astryx/commit/a90e05300) fix(Outline): write the scroll spy's refs at commit, not in render (#10802)

### v0.7.16

- [ ] [`8677612c5`](https://github.com/meta/astryx/commit/8677612c5) [Component Audit] ListItem: slot docs say where content sits, and right-to-left chevrons point the right way (#11336)
- [ ] [`4d1cb828f`](https://github.com/meta/astryx/commit/4d1cb828f) fix(List): a reorder handle's name follows its row's place and label (#10815)
- [ ] [`10bae0687`](https://github.com/meta/astryx/commit/10bae0687) feat(Table): useTableColumnsVirtualization windows the unpinned columns (#11014)
- [ ] [`ef87167d0`](https://github.com/meta/astryx/commit/ef87167d0) feat(Table): column windowing retains the focused column and anchors the first visible column (#11018)
- [ ] [`f5b5f9660`](https://github.com/meta/astryx/commit/f5b5f9660) docs(useOutlineFromDOM): add hook docs and an article example block (#11234)
- [ ] [`251f9fa51`](https://github.com/meta/astryx/commit/251f9fa51) [Component Audit] MetadataList: docs say how labels are read, and tests guard the show more toggle (#11391)

### v0.7.17

- [ ] [`65ed0c017`](https://github.com/meta/astryx/commit/65ed0c017) [Component Audit] MetadataListItem: docs say where ref and styling props land, and tests guard them (#11538)
- [ ] [`1addd72da`](https://github.com/meta/astryx/commit/1addd72da) feat(core): swipe actions come from createSwipe on the shared drag path (#8690)
- [ ] [`178cd8019`](https://github.com/meta/astryx/commit/178cd8019) perf(OverflowList): lists in one commit measure together after it, before paint (#10392)
- [ ] [`30b12dd5a`](https://github.com/meta/astryx/commit/30b12dd5a) fix(Item, Token): a control inside a row with its own action, or a token's Remove, rings itself (#8869)
- [x] [`64806d0bd`](https://github.com/meta/astryx/commit/64806d0bd) test(Item): the swipe's busy proof judges a held release by its curve (#11735)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f7b77db68`](https://github.com/meta/astryx/commit/f7b77db68) spec(OverflowList): useOverflow's module record states when it measures and what it records (#11845)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`cb315c6ae`](https://github.com/meta/astryx/commit/cb315c6ae) docs(architecture): press feedback has one engine and three recipes (#12115)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2ff1afc9f`](https://github.com/meta/astryx/commit/2ff1afc9f) fix(richtext): text reads the way it is written, in either document direction (#7723)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ee8a33a7c`](https://github.com/meta/astryx/commit/ee8a33a7c) feat(cli): the swipe codemod defines each swipe once (#11670)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`56d3546d5`](https://github.com/meta/astryx/commit/56d3546d5) fix(core): a TreeList row with no action shows its keyboard focus ring (#12153)
- [ ] [`3deff9de7`](https://github.com/meta/astryx/commit/3deff9de7) feat(core): theme seams for the spinner, tree disclosure, number steppers and close buttons (#12156)
- [x] [`f939a6f90`](https://github.com/meta/astryx/commit/f939a6f90) fix(core): type-to-select takes a letter typed with AltGr (#12644)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`9cd6c4482`](https://github.com/meta/astryx/commit/9cd6c4482) [Component Audit] OverflowList: items and the overflow indicator are no longer cut off in themes with a different spacing scale (#12401)
- [x] [`8688c1885`](https://github.com/meta/astryx/commit/8688c1885) chore: land batch 6 (11 pull requests) (#12812)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
- [ ] [`cf537d7aa`](https://github.com/meta/astryx/commit/cf537d7aa) chore: land batch 11 (3 pull requests) (#12848)
- [ ] [`9e445ba0d`](https://github.com/meta/astryx/commit/9e445ba0d) chore: land batch 15 (5 pull requests) (#12859)
- [ ] [`472896d35`](https://github.com/meta/astryx/commit/472896d35) fix(Toolbar, OverflowList): a start lane's own OverflowList folds beside the end lane (#12238)
- [ ] [`83424673c`](https://github.com/meta/astryx/commit/83424673c) chore: land batch 16 (6 pull requests) (#12881)
- [x] [`361d09f31`](https://github.com/meta/astryx/commit/361d09f31) test(OverflowList): bound rest audit groups to one story (#12905)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
- [ ] [`842e95d82`](https://github.com/meta/astryx/commit/842e95d82) [Component Audit] Outline: under reduced motion, jumping to a heading no longer scrolls or slides (#12334)
- [ ] [`fc40575d9`](https://github.com/meta/astryx/commit/fc40575d9) fix(Table): a column-windowed scroll that keeps its columns renders the table once (#11826)
- [x] [`5f57d0326`](https://github.com/meta/astryx/commit/5f57d0326) docs(windowing): every virtualizer works in container and page scroll; Table windows inside its own scroll area (#10796)
  - 不适用：上游内部规范和架构文档（自动初筛）

## 文档排版与代码高亮（area:core）

### v0.7.2

- [ ] [`59c4ef79b`](https://github.com/meta/astryx/commit/59c4ef79b) fix(Markdown): give the frontmatter parser a plain fields record (#7620)
- [ ] [`962800ced`](https://github.com/meta/astryx/commit/962800ced) feat(Markdown): tables draw a line on every cell edge (#7576)
- [ ] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
- [ ] [`5fb597d93`](https://github.com/meta/astryx/commit/5fb597d93) fix(core): build Unicode property regexes at runtime (#7767)

### v0.7.3

- [x] [`b0981237c`](https://github.com/meta/astryx/commit/b0981237c) spec(Markdown): clarify per-list counter indentation (#7760)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a4e3f131a`](https://github.com/meta/astryx/commit/a4e3f131a) perf(Markdown): reuse the rendered document when a re-render changes nothing it reads (#7873)
- [ ] [`29f09ee06`](https://github.com/meta/astryx/commit/29f09ee06) perf(CodeBlock): insert ::highlight() rules before the commit's layout reads (#7875)
- [x] [`da1020b26`](https://github.com/meta/astryx/commit/da1020b26) test(markdown): alternate the range-scaling benchmark's two sides (#7916)
  - 不适用：只改上游测试（自动初筛）

### v0.7.5

- [x] [`524564aed`](https://github.com/meta/astryx/commit/524564aed) docs(spec): CodeBlock caller controls beside Copy (endContent); controls never cover code; one-line blocks are one row (#8112)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`c19b5e326`](https://github.com/meta/astryx/commit/c19b5e326) fix(CodeBlock): the headerless Copy button never covers code (#8101)
- [ ] [`01e47f5d0`](https://github.com/meta/astryx/commit/01e47f5d0) feat(CodeBlock): endContent places caller controls beside Copy (#8285)
- [x] [`39b598191`](https://github.com/meta/astryx/commit/39b598191) docs(spec): CodeBlock native language set by use, plus importable language modules under one provider (#8286)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`76d9634e3`](https://github.com/meta/astryx/commit/76d9634e3) test(Markdown): time FR23 windows on the main thread's CPU clock (#8278)
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6322d94db`](https://github.com/meta/astryx/commit/6322d94db) docs(spec): CodeBlock languages are per-language modules passed as the language; no provider (#8429)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`4adaeda93`](https://github.com/meta/astryx/commit/4adaeda93) feat(CodeBlock): built-in C, C++, SQL, Rust, Kotlin, Swift, Go; per-language values passed as language; createCodeLanguage (#8333)
- [ ] [`fabf5e699`](https://github.com/meta/astryx/commit/fabf5e699) feat(Markdown, RichText, DiffViewer): codeLanguages lists CodeBlock language values (#8489)
- [ ] [`79a7a902b`](https://github.com/meta/astryx/commit/79a7a902b) feat(CodeBlock, cli): deprecate tokenizer in favour of a custom language value; astryx upgrade rewrites it (#8490)
- [x] [`423ebd18d`](https://github.com/meta/astryx/commit/423ebd18d) docs(spec): Code records its shipped contract as current (#8573)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
- [ ] [`76cd3b89e`](https://github.com/meta/astryx/commit/76cd3b89e) fix(List): keep numbered markers whole and sibling text aligned (#7650)

### v0.7.6

- [x] [`d29fe0f64`](https://github.com/meta/astryx/commit/d29fe0f64) test(storybook): run the story-tree check where Storybook is built, and bring the tree back to its shape (#8509)
  - 不适用：只改上游测试（自动初筛）
- [x] [`71199c40f`](https://github.com/meta/astryx/commit/71199c40f) test(CodeBlock): the copy-clearance contract measures only after the story re-renders with its args (#9119)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3e735de86`](https://github.com/meta/astryx/commit/3e735de86) fix(core A–M): slots use isRenderable; the remaining checks are allowed with a reason (#9204)
- [ ] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
- [ ] [`c9f16ef38`](https://github.com/meta/astryx/commit/c9f16ef38) fix(CodeBlock): the collapsed disclosure chevron mirrors in RTL (#9294)
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)

### v0.7.7

- [x] [`bec12a3b2`](https://github.com/meta/astryx/commit/bec12a3b2) fix(Button): a tooltip that repeats the accessible name adds no description (#9681)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`a3dab7afd`](https://github.com/meta/astryx/commit/a3dab7afd) feat(codeblock): add startLineNumber prop for excerpts (#8854)
- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`2951a3ac3`](https://github.com/meta/astryx/commit/2951a3ac3) docs(CodeBlock): the record states startLineNumber's file coordinates (#9934)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.9

- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c1a7ff7f0`](https://github.com/meta/astryx/commit/c1a7ff7f0) test(Markdown): spin the FR23 clock check's worker for CPU time, not wall time (#9944)
  - 不适用：只改上游测试（自动初筛）
- [x] [`76298e415`](https://github.com/meta/astryx/commit/76298e415) test(vitest): run the FR23 benchmark alone in a later project group (#9948)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`bf743545e`](https://github.com/meta/astryx/commit/bf743545e) fix(Markdown): GFM autolink parses long text in linear time (#9990)
- [x] [`3b8d81fd0`](https://github.com/meta/astryx/commit/3b8d81fd0) spec: record component icon slots in CodeBlock, Timestamp, and Table (#10045)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`98efdf183`](https://github.com/meta/astryx/commit/98efdf183) feat(Icon): a theme maps a component's own icon role by slot, starting with CodeBlock's copy button (#9828)

### v0.7.10

- [ ] [`27211b797`](https://github.com/meta/astryx/commit/27211b797) fix(Code): reflect size on the code theme target (#10186)
- [ ] [`f81f09df3`](https://github.com/meta/astryx/commit/f81f09df3) fix(CodeBlock, Carousel): the code viewport and the scroller draw the shared focus ring (#8875)

### v0.7.11

- [ ] [`66b09526b`](https://github.com/meta/astryx/commit/66b09526b) fix(core): a swizzled copy type-checks without Node's types (#10252)
- [ ] [`5a323635e`](https://github.com/meta/astryx/commit/5a323635e) fix(core): CodeBlock says when a copy fails (#10272)
- [x] [`652f51e19`](https://github.com/meta/astryx/commit/652f51e19) spec(AST-061): a prose block reads the way its own text reads, on Markdown and RichText (#9860)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.12

- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`b8cc3f41e`](https://github.com/meta/astryx/commit/b8cc3f41e) fix(Markdown): each prose block lays out in its own text's direction (#10293)
- [ ] [`62bc7a2fe`](https://github.com/meta/astryx/commit/62bc7a2fe) fix(core): a swizzled copy shares the animated-layout, code-language and snap-paging brands (#10576)
- [ ] [`f09230814`](https://github.com/meta/astryx/commit/f09230814) fix(core): a swizzled Outline type-checks against the package's Markdown plugins (#10641)
- [x] [`1ff81c7a9`](https://github.com/meta/astryx/commit/1ff81c7a9) docs(richtext): in-place editing keeps the reading width, so the switch does not reflow (#10429)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`6caeec86c`](https://github.com/meta/astryx/commit/6caeec86c) fix(useClipboard): a failed copy is announced assertively (#10448)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`b6b0c68ad`](https://github.com/meta/astryx/commit/b6b0c68ad) docs(ChatLayout): a reply gets one right edge with contentWidth="100%"; Markdown keeps its 680px measure (#6608)
  - 不适用：只改上游测试（自动初筛）

### v0.7.13

- [ ] [`d130dffdc`](https://github.com/meta/astryx/commit/d130dffdc) fix(Markdown): the public parser drops every data: URL; <Markdown> renders data: links and images as source text (#11020)

### v0.7.14

- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [x] [`61b537db5`](https://github.com/meta/astryx/commit/61b537db5) docs(spec): RichText offers opt-in document affordances (AST-106) (#8576)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`64b8d1411`](https://github.com/meta/astryx/commit/64b8d1411) fix(core): a package fence plugin renders its node in a swizzled Markdown (AST-110 FR3) (#11167)

### v0.7.15

- [ ] [`6fcf17c3e`](https://github.com/meta/astryx/commit/6fcf17c3e) test(Markdown): pin why the streaming fade refs are harmless (#10939)

### v0.7.16

- [ ] [`aeefe4be3`](https://github.com/meta/astryx/commit/aeefe4be3) perf(core): Markdown checks required substrings in one pass (#11403)
- [ ] [`3913454f1`](https://github.com/meta/astryx/commit/3913454f1) test(Markdown): a discarded streamed render never shows its text (#10909)

### v0.7.17

- [ ] [`4da09b8d6`](https://github.com/meta/astryx/commit/4da09b8d6) docs(useSyntaxTheme): add hook docs and a keyword color example block (#11236)
- [ ] [`8d68f1b8a`](https://github.com/meta/astryx/commit/8d68f1b8a) [Component Audit] Markdown: docs say when an image shows its alt text and what renderers must sanitize (#11383)
- [ ] [`a2b5fe486`](https://github.com/meta/astryx/commit/a2b5fe486) fix(CodeBlock): the run-time highlight stylesheet sits in the astryx-base layer, so theme and app syntax colours win (#11691)
- [ ] [`cd3ed29d0`](https://github.com/meta/astryx/commit/cd3ed29d0) fix(CodeBlock): a long line, or code past maxHeight, scrolls before script runs and in a page that runs none (#11970)
- [ ] [`e51ed92f6`](https://github.com/meta/astryx/commit/e51ed92f6) fix(Theme): a system Theme takes the page's color scheme, and Core's stylesheet sets the root to follow the reader (#12102)
- [ ] [`0b4760560`](https://github.com/meta/astryx/commit/0b4760560) fix(core): CodeBlock and Code keep code in its own direction on right-to-left pages (#12130)
- [x] [`2ff1afc9f`](https://github.com/meta/astryx/commit/2ff1afc9f) fix(richtext): text reads the way it is written, in either document direction (#7723)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
- [ ] [`8688c1885`](https://github.com/meta/astryx/commit/8688c1885) chore: land batch 6 (11 pull requests) (#12812)
- [ ] [`9e445ba0d`](https://github.com/meta/astryx/commit/9e445ba0d) chore: land batch 15 (5 pull requests) (#12859)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
- [ ] [`31b52d0cb`](https://github.com/meta/astryx/commit/31b52d0cb) chore: land batch 34 (2 pull requests) (#12908)
- [ ] [`81458c4b1`](https://github.com/meta/astryx/commit/81458c4b1) chore: land batch 60 (4 pull requests) (#12939)
- [ ] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
- [ ] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)
- [x] [`d8ed55621`](https://github.com/meta/astryx/commit/d8ed55621) spec(AST-017): Charts may import Core's internal subpaths (#12779)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`66b2932af`](https://github.com/meta/astryx/commit/66b2932af) fix(Markdown): a heading copy link shows and announces a failed copy (#10424)

## 菜单家族（area:core）

### v0.7.2

- [ ] [`81b8df40f`](https://github.com/meta/astryx/commit/81b8df40f) fix(Layer): ship the dynamic-viewport cap and safe-area gutter, not only their fallbacks (#7622)
- [x] [`198a7e3ff`](https://github.com/meta/astryx/commit/198a7e3ff) test(a11y): add Menu contract and bind the DropdownMenu pointer menu (#7636)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9da2d0b39`](https://github.com/meta/astryx/commit/9da2d0b39) fix(DropdownMenuDivider): forward host attributes to the separator (#7645)
- [ ] [`e40ce5a06`](https://github.com/meta/astryx/commit/e40ce5a06) fix(DropdownMenu): close submenu flyouts when the menu is light-dismissed (#6912)
- [ ] [`9b8b7232f`](https://github.com/meta/astryx/commit/9b8b7232f) [Component Audit] ContextMenu: make pointer and touch evidence trustworthy (#7691)
- [x] [`6d4f178a2`](https://github.com/meta/astryx/commit/6d4f178a2) Audit DropdownMenuDivider evidence and contract (#7693)
  - 不适用：只改上游测试、上游组件规范文档（自动初筛）
- [ ] [`e868278e0`](https://github.com/meta/astryx/commit/e868278e0) fix(DropdownMenu): load the touch bottom sheet only when a menu shows it (#7709)
- [ ] [`22c592a7a`](https://github.com/meta/astryx/commit/22c592a7a) Audit DropdownMenuGroup (#7729)
- [x] [`25548b9e7`](https://github.com/meta/astryx/commit/25548b9e7) test(ContextMenu): resolve the lazy touch sheet once before the sheet cases (#7758)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a44ebd55a`](https://github.com/meta/astryx/commit/a44ebd55a) feat(cli): install once, run anywhere — every copy hands a project's run to the release its Core matches (#7649)
- [ ] [`684ca57bd`](https://github.com/meta/astryx/commit/684ca57bd) refactor(DropdownMenu): the header and footer Tab walk moves to a module of its own (#7737)
- [x] [`ecb046872`](https://github.com/meta/astryx/commit/ecb046872) test(ContextMenu): the nested bottom-sheet case waits for its first row (#7761)
  - 不适用：只改上游测试（自动初筛）

### v0.7.3

- [ ] [`b7860bcbb`](https://github.com/meta/astryx/commit/b7860bcbb) feat(DropdownMenuSubMenu): header and footer around a sub-menu's rows (#7530)
- [ ] [`948e75d36`](https://github.com/meta/astryx/commit/948e75d36) [Component Audit] DropdownMenuItem: make action states reviewable (#7907)
- [ ] [`2f47a4afe`](https://github.com/meta/astryx/commit/2f47a4afe) [Component Audit] DropdownMenuRadioGroup: let builders reach the group root (#7911)

### v0.7.4

- [ ] [`97dda3cb4`](https://github.com/meta/astryx/commit/97dda3cb4) fix(useMenuPress): hit-test in the menu's own shadow root (#7914)
- [ ] [`10b832e02`](https://github.com/meta/astryx/commit/10b832e02) fix(DropdownMenuSubMenu, Thumbnail, ChatMessageList): silence the busy Spinner and announce the busy start once (#7950)

### v0.7.5

- [ ] [`a8ef89f26`](https://github.com/meta/astryx/commit/a8ef89f26) [Component Audit] DropdownMenuRadioItem: caller click and hover handlers now run on radio rows (#8191)
- [ ] [`a8b78c5e5`](https://github.com/meta/astryx/commit/a8b78c5e5) [Component Audit] DropdownMenuSubMenu: docs match the shipped props and RTL flyout placement is measured (#8227)
- [ ] [`785e42ad9`](https://github.com/meta/astryx/commit/785e42ad9) fix(DropdownMenu): a row the pointer lights takes focus without :focus-visible (#8221)
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`23de0923e`](https://github.com/meta/astryx/commit/23de0923e) spec(AST-094): touch presentations feel native by default (#8409)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`cd3787bac`](https://github.com/meta/astryx/commit/cd3787bac) feat(core): one touch presentation resolver (#8062)
- [ ] [`caa1f04fe`](https://github.com/meta/astryx/commit/caa1f04fe) fix(ContextMenu): the long press that opens the menu no longer closes it (#7308)
- [x] [`e36bd2e15`](https://github.com/meta/astryx/commit/e36bd2e15) spec(useMenuPress): a finger opens a sub-menu by lifting, and a handed-off finger is the opening press (DEC-8) (#8451)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`f85473ed5`](https://github.com/meta/astryx/commit/f85473ed5) fix(DropdownMenu): the step-aside rule names the surface host, not a universal selector (#8411)
- [ ] [`7d4898956`](https://github.com/meta/astryx/commit/7d4898956) fix(DropdownMenu): a menu's sheet renders nothing at rest and drops two wrappers (#8392)
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [x] [`d484045d5`](https://github.com/meta/astryx/commit/d484045d5) test(DropdownMenu): the SSR test waits for the on-demand sheet before it ends (#8492)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c98456e21`](https://github.com/meta/astryx/commit/c98456e21) docs(spec): MoreMenu records its shipped contract as current (#8533)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`9b478e53b`](https://github.com/meta/astryx/commit/9b478e53b) spec(DropdownMenu, AST-094): the menu grows out of its trigger under a finger (FR21); a phone menu stays beside its trigger (DEC-19) (#8515)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`c01521cf9`](https://github.com/meta/astryx/commit/c01521cf9) spec(AST-094, AST-057): gestures work on the web for every pointer (FR43) (#8646)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`1013274f3`](https://github.com/meta/astryx/commit/1013274f3) test(DropdownMenu): the SSR test loads the menu and its sheet at collection (#8685)
  - 不适用：只改上游测试（自动初筛）
- [x] [`640599c5a`](https://github.com/meta/astryx/commit/640599c5a) spec(ContextMenu, List): ContextMenu on the headless menu; ListItem row menus attach to the li (#8648)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`7bcb81cbe`](https://github.com/meta/astryx/commit/7bcb81cbe) feat(core): the nav, breadcrumb and tab menus track a held pointer across their items (#8791)
- [ ] [`249501fb0`](https://github.com/meta/astryx/commit/249501fb0) fix(Overlay, DropdownMenuGroup, MobileNavToggle): forward host attributes to the element each owns (#8755)

### v0.7.6

- [ ] [`fd0aba82b`](https://github.com/meta/astryx/commit/fd0aba82b) fix(DropdownMenu): a failed sheet preload is handled and retried, never an unhandled rejection (#8478)
- [x] [`bb8291ba3`](https://github.com/meta/astryx/commit/bb8291ba3) test(DropdownMenu): the menu-button coverage check runs as one serial part per state (#9068)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [ ] [`1d462afd3`](https://github.com/meta/astryx/commit/1d462afd3) fix(DropdownMenu): a data item with nested items inside a section renders its submenu (#8858)
- [ ] [`13f3867ed`](https://github.com/meta/astryx/commit/13f3867ed) fix(core): DropdownMenu bottom-sheet trigger forwards the caller's ref (#8898)
- [ ] [`3a25c59c0`](https://github.com/meta/astryx/commit/3a25c59c0) refactor(DropdownMenu): a failed sheet preload is the preload's result, not an empty catch (#9069)
- [x] [`133fb8099`](https://github.com/meta/astryx/commit/133fb8099) docs(spec): DropdownMenu records its shipped contract as current (#9113)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`6b63e75d5`](https://github.com/meta/astryx/commit/6b63e75d5) docs(spec): ContextMenu records its shipped contract as current (#9125)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`8bc9ab9b2`](https://github.com/meta/astryx/commit/8bc9ab9b2) fix(usePopover): its trigger ref stays the same function across renders (#9130)
- [ ] [`7ef23f2c3`](https://github.com/meta/astryx/commit/7ef23f2c3) fix(core): ReactNode slots use isRenderable for 'renders nothing' (#9160)
- [ ] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`acfa52701`](https://github.com/meta/astryx/commit/acfa52701) fix(useTypeahead): type-to-select ignores accents (#8864)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`eb6d2cc12`](https://github.com/meta/astryx/commit/eb6d2cc12) fix(ContextMenu): a context menu mounts its layer at its first open, so a large Table shows its rows in seconds in Safari (#9278)
- [ ] [`48f6a067f`](https://github.com/meta/astryx/commit/48f6a067f) [Component Audit] DropdownMenu: keep the focused row visible in forced colors (#7517)
- [ ] [`372a0eae2`](https://github.com/meta/astryx/commit/372a0eae2) fix(SideNav): focus on a row the collapsed rail removes moves to the collapse toggle or the nearest rail row (#9249)
- [x] [`69fb25721`](https://github.com/meta/astryx/commit/69fb25721) test(rtl): RTL coverage for ContextMenu, TableHeaderCell, TableCell and TableSelectionToolbar (#9286)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e7530dbb4`](https://github.com/meta/astryx/commit/e7530dbb4) test(rtl): RTL coverage for seven Core parts (Step, OverflowList, dialogs, MobileNav, menus) (#9332)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`23c8cae98`](https://github.com/meta/astryx/commit/23c8cae98) spec(ContextMenu): touch-opened menus lift with a tint, grow from the finger, and use named springs (#9423)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`8d1864b67`](https://github.com/meta/astryx/commit/8d1864b67) chore(core): the touch motion tables register FR4's context-menu springs as roles (#9432)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)

### v0.7.7

- [ ] [`4d56e6b9b`](https://github.com/meta/astryx/commit/4d56e6b9b) perf(Selector): a long list has its scrolling touch-action before the first open (#9591)
- [ ] [`7d1179aa9`](https://github.com/meta/astryx/commit/7d1179aa9) fix(DropdownMenu): a bottom sheet opened from renderTrigger is named after the menu, not "Menu" (#9604)
- [x] [`b53bec615`](https://github.com/meta/astryx/commit/b53bec615) test: module loads are awaited, not raced against test clocks (#9447)
  - 不适用：只改上游测试（自动初筛）
- [x] [`941c69e0b`](https://github.com/meta/astryx/commit/941c69e0b) spec(DropdownMenu): open question on rich sheet headings for custom triggers (#9674)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`0f25a0f2f`](https://github.com/meta/astryx/commit/0f25a0f2f) test(DropdownMenu): catch an eager sheet import when it is requested, not by a timer (#8353)
  - 不适用：只改上游测试（自动初筛）
- [x] [`d40b519f7`](https://github.com/meta/astryx/commit/d40b519f7) test(DropdownMenuItem): the audit opens its menu and captures a row's highlight under load (#9495)
  - 不适用：只改上游测试（自动初筛）
- [x] [`cec65f35f`](https://github.com/meta/astryx/commit/cec65f35f) fix(DropdownMenu): a late native click after a touch drill-in no longer picks a row (#8275)
  - 不适用：只改上游测试（自动初筛）
- [x] [`381c0d272`](https://github.com/meta/astryx/commit/381c0d272) test(DropdownMenu): the keyboard-open proof waits for the sheet's rows, not for its own imports (#9735)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`acca58968`](https://github.com/meta/astryx/commit/acca58968) fix(core): a long press held through a busy main thread still reports, on the touch events' clock (#9455)
- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f10bc9153`](https://github.com/meta/astryx/commit/f10bc9153) spec(AST-094): only a gesture's motion springs; other motion plays the theme's tokens (#9706)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.9

- [ ] [`fbb81c6cc`](https://github.com/meta/astryx/commit/fbb81c6cc) DropdownMenu: under a finger, the opening finger picks only after UIMenu's handoff (AST-094 FR29) (#8627)
- [x] [`5083ead48`](https://github.com/meta/astryx/commit/5083ead48) fix(DropdownMenu): prevent stale trigger tooltips after selection (#9280)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [x] [`82d20c7b1`](https://github.com/meta/astryx/commit/82d20c7b1) docs(DropdownMenu): DEC-6 and the design relationships name the held finger's pressed paint (#9955)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`8b2883998`](https://github.com/meta/astryx/commit/8b2883998) chore(core): split long comment sentences in some menu press sources and tests (#9954)
- [x] [`b215c3e2f`](https://github.com/meta/astryx/commit/b215c3e2f) test(DropdownMenu): a footer stays reachable by Tab when the React root is the document (#9815)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5c91e81ee`](https://github.com/meta/astryx/commit/5c91e81ee) fix(Layer): a closed layer's trigger is no CSS anchor (#9963)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`5db61cc9b`](https://github.com/meta/astryx/commit/5db61cc9b) fix(BottomSheet, Dialog): returning focus after an overlay closes no longer scrolls the page (#10022)
- [ ] [`a866c2ab0`](https://github.com/meta/astryx/commit/a866c2ab0) fix(Dialog, Drawer): a backdrop press that closes a popover inside closes only the popover (#9988)
- [x] [`a96269ed3`](https://github.com/meta/astryx/commit/a96269ed3) spec(DropdownMenu): a disabled menu row is reached by the keyboard and stays inert (DEC-11) (#9008)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`257573b22`](https://github.com/meta/astryx/commit/257573b22) docs(AST-094, AST-057): motion guidance; gesture springs; swipe-row returns (#9915)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`7e69f91dc`](https://github.com/meta/astryx/commit/7e69f91dc) fix(core): an anchored layer that would run under the software keyboard ends above it (#8208)
- [ ] [`5b54b834c`](https://github.com/meta/astryx/commit/5b54b834c) fix(DropdownMenu): on a phone or a tablet, a tap while the menu enters is ignored, as on iOS (#8458)
- [ ] [`ddb8b3462`](https://github.com/meta/astryx/commit/ddb8b3462) feat(ButtonGroup): a finger's slide runs the button it lifts on (#8657)
- [x] [`8c5de42d4`](https://github.com/meta/astryx/commit/8c5de42d4) docs(DropdownMenu): FR22 notes the still-mouse shield gap (#10148)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.10

- [ ] [`70597367f`](https://github.com/meta/astryx/commit/70597367f) fix(DropdownMenu, ContextMenu): Tab from any sub-menu level closes the whole menu (#8870)

### v0.7.11

- [x] [`3bd5a4c1b`](https://github.com/meta/astryx/commit/3bd5a4c1b) fix(Layer): a still mouse presses through an entrance's input hold (#10303)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`68e8d6d43`](https://github.com/meta/astryx/commit/68e8d6d43) feat(DropdownMenuSubMenu): delay and hideDelay set the hover timing (#10298)
- [x] [`5a6ed906f`](https://github.com/meta/astryx/commit/5a6ed906f) chore(Layer): name the gap a still mouse leaves, exactly (#10317)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.12

- [ ] [`360701de7`](https://github.com/meta/astryx/commit/360701de7) fix(Text, Heading): the truncation tooltip mounts on the first hover, tap or focus (#10290)
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`bd6df76da`](https://github.com/meta/astryx/commit/bd6df76da) fix(useFocusTrap): a modal's first and last Tab stops count a radio group once, as the browser does (#10304)
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`9dca38629`](https://github.com/meta/astryx/commit/9dca38629) perf(Layer): anchored entrances play on the surface (#10561)
- [ ] [`dd09d678d`](https://github.com/meta/astryx/commit/dd09d678d) fix(menus): the keys and type-ahead reach a disabled row, which stays inert (#10160)
- [ ] [`73eb8cb64`](https://github.com/meta/astryx/commit/73eb8cb64) fix(DropdownMenu): a pointer open keeps the row a drag already lit (#10590)
- [x] [`7e8266361`](https://github.com/meta/astryx/commit/7e8266361) test(DropdownMenu): the lazy sheet case waits for its rows by frames (#10643)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c99ad4aa2`](https://github.com/meta/astryx/commit/c99ad4aa2) test(DropdownMenu): radio-item and sub-menu audits expect a disabled row in the roving order (#10622)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1ffc0dac9`](https://github.com/meta/astryx/commit/1ffc0dac9) fix(BottomSheet): resting content starts below the grab bar, whatever the padding (#8558)
- [ ] [`71450dd2c`](https://github.com/meta/astryx/commit/71450dd2c) fix(DropdownMenu): the press that opens the menu does not close it (#10689)
- [ ] [`2309691db`](https://github.com/meta/astryx/commit/2309691db) fix(DropdownMenu): a finger's hold-slide-lift no longer flashes the focus outline on the menu button (#10079)

### v0.7.14

- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [ ] [`09479d9c7`](https://github.com/meta/astryx/commit/09479d9c7) fix(Popover): a touch that pans is not an outside press, even without pointercancel (#11038)
- [ ] [`d9d7b105f`](https://github.com/meta/astryx/commit/d9d7b105f) feat(DropdownMenu): a finger or a pen opens the menu as it presses (#8078)

### v0.7.15

- [ ] [`5770e5b19`](https://github.com/meta/astryx/commit/5770e5b19) fix(DropdownMenu): a cancelled touch clears the row a finger lit (#8508)
- [x] [`92e660acb`](https://github.com/meta/astryx/commit/92e660acb) docs(spec): useMenuPress states its boundary with core's group tracker (#8572)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.16

- [ ] [`50beab961`](https://github.com/meta/astryx/commit/50beab961) fix(core): pass host data-* attributes to the component's own element (#11406)
- [ ] [`344916163`](https://github.com/meta/astryx/commit/344916163) fix(DropdownMenu): sync its show and hide refs at commit (#10905)
- [x] [`cfc431d7a`](https://github.com/meta/astryx/commit/cfc431d7a) fix(layer): a release does not dismiss the layer it opened (#11258)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9bdbcb16f`](https://github.com/meta/astryx/commit/9bdbcb16f) fix(Button, Popover, Dialog): keep an edge in forced-colors mode (#7677)

### v0.7.17

- [ ] [`8931e819c`](https://github.com/meta/astryx/commit/8931e819c) fix(Table, ContextMenu): a sortable column's resize line sits on its column edge (#11576)
- [ ] [`54f211658`](https://github.com/meta/astryx/commit/54f211658) feat(Pagination): page links through getPageHref (#11578)
- [ ] [`2566fd73a`](https://github.com/meta/astryx/commit/2566fd73a) perf(ContextMenu): load the touch sheet's action list only for the sheet presentation (#11616)
- [ ] [`9ad5a1d2f`](https://github.com/meta/astryx/commit/9ad5a1d2f) [Component Audit] MoreMenu: docs list the controlled open prop and the inherited size, and tests guard both (#11742)
- [x] [`e4a11bb68`](https://github.com/meta/astryx/commit/e4a11bb68) fix(core): a radio's circle is drawn at 50%, not with the pill token (#11836)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1d2d6299d`](https://github.com/meta/astryx/commit/1d2d6299d) fix(DropdownMenu): a sub-menu whose label is not a string names its view, its Back row and its sheet (#11594)
- [ ] [`5a24fc0cf`](https://github.com/meta/astryx/commit/5a24fc0cf) fix(DropdownMenu): a waiting open still takes focus and fires onClick (#11905)
- [ ] [`120629d82`](https://github.com/meta/astryx/commit/120629d82) fix(DropdownMenu): a mouse press opens a menu in another document (#11938)
- [x] [`816ae394e`](https://github.com/meta/astryx/commit/816ae394e) test(DropdownMenu): capture geometry after its frame samples settle (#12343)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`72f2d7caa`](https://github.com/meta/astryx/commit/72f2d7caa) docs: icon props take semantic names; Selector hasClear types; useTableSelectionState returns (#12583)
- [ ] [`25bedb999`](https://github.com/meta/astryx/commit/25bedb999) fix(DropdownMenu): a sheet opened before its code loads shows its rows with it (#12619)
- [x] [`0c52d0454`](https://github.com/meta/astryx/commit/0c52d0454) docs(spec): AST-116 Popover anchoring, modality and layer focus return (draft) (#11112)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9a199615b`](https://github.com/meta/astryx/commit/9a199615b) fix(DropdownMenu): a keyboard-opened sheet keeps focus where it is when its items change (#12573)
- [ ] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`476d9063f`](https://github.com/meta/astryx/commit/476d9063f) chore: land batch 63 (3 pull requests) (#12945)
- [x] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`416b167cf`](https://github.com/meta/astryx/commit/416b167cf) fix(core): one focus return for Popover and DropdownMenu (popover presentation) and Dialog that never strands focus (AST-116 FR17–FR21, AR1) (#11121)
- [ ] [`ddc5dd15d`](https://github.com/meta/astryx/commit/ddc5dd15d) fix(ContextMenu): a node-label sub-menu level names the bottom sheet (#11936)

## 页面导航（area:core）

### v0.7.2

- [ ] [`c68f5e8e5`](https://github.com/meta/astryx/commit/c68f5e8e5) feat(pagination): let the compact variant opt into first/last buttons (#7544)
- [ ] [`07f97c668`](https://github.com/meta/astryx/commit/07f97c668) feat(TabMenu): forward host attributes and DOM handlers to the trigger (#7295)
- [x] [`7c206edbb`](https://github.com/meta/astryx/commit/7c206edbb) feat(List): one edge prop for padded, flush, outset, and bleed rows (#7592)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`e40ce5a06`](https://github.com/meta/astryx/commit/e40ce5a06) fix(DropdownMenu): close submenu flyouts when the menu is light-dismissed (#6912)
- [x] [`6d4f178a2`](https://github.com/meta/astryx/commit/6d4f178a2) Audit DropdownMenuDivider evidence and contract (#7693)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`27c8c55f2`](https://github.com/meta/astryx/commit/27c8c55f2) feat(SideNav): keep nested items full width and indent their content (#7594)
- [ ] [`a7d26b7c9`](https://github.com/meta/astryx/commit/a7d26b7c9) fix(TopNav): stop clipping the focus ring inside expanded drawer sections (#7701)
- [ ] [`3c9b4ef2f`](https://github.com/meta/astryx/commit/3c9b4ef2f) fix(AppShell): defer hiding the mobile nav Activity boundary until close finishes (#6319)
- [x] [`020e1fefa`](https://github.com/meta/astryx/commit/020e1fefa) spec(SideNav): nested rows are full width with the indent inside the row (#7647)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`3c1d32d9a`](https://github.com/meta/astryx/commit/3c1d32d9a) fix(SideNavItem): keep a caller's className on the row element (#7772)
- [ ] [`6c54bddfb`](https://github.com/meta/astryx/commit/6c54bddfb) fix(TopNav): make collapsed drawer sections inert (#7699)

### v0.7.3

- [x] [`cbe384c14`](https://github.com/meta/astryx/commit/cbe384c14) fix(Tooltip): attach sibling-mode anchors rendered inside their own anchor (#7833)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8f392ecc7`](https://github.com/meta/astryx/commit/8f392ecc7) fix(TopNav): keep the menu toggle in view when a long heading meets a narrow screen (#7834)
- [ ] [`cde6233de`](https://github.com/meta/astryx/commit/cde6233de) fix(core): TreeList, Pagination dots and Calendar days use aria-disabled (#7887)

### v0.7.5

- [ ] [`f81b8bba4`](https://github.com/meta/astryx/commit/f81b8bba4) fix(SideNavHeading): render end content beside a whole-heading link (#8029)
- [x] [`92697387b`](https://github.com/meta/astryx/commit/92697387b) fix(NumberInput): a disabled field stays in the tab order (#8099)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ee98ff9a8`](https://github.com/meta/astryx/commit/ee98ff9a8) docs: TabList scrolls its overflow, and MobileNav is a drawer (#8100)
- [ ] [`785e42ad9`](https://github.com/meta/astryx/commit/785e42ad9) fix(DropdownMenu): a row the pointer lights takes focus without :focus-visible (#8221)
- [x] [`a6740a738`](https://github.com/meta/astryx/commit/a6740a738) fix(Popover): cancel the auto-focus frame when the popover closes first (#8276)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`d0c4bf26f`](https://github.com/meta/astryx/commit/d0c4bf26f) fix(MobileNav): the drawer is never wider than 85% of the viewport (#8063)
- [ ] [`4b05772a2`](https://github.com/meta/astryx/commit/4b05772a2) fix(Popover): focus, Tab and Escape work in a second document (#7356)
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`cdade71e6`](https://github.com/meta/astryx/commit/cdade71e6) docs(spec): TopNav and its sub-components record their shipped contracts as current (#8317)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`8c3f3bea0`](https://github.com/meta/astryx/commit/8c3f3bea0) docs(spec): SideNav records its shipped contract as current (#8434)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`daf66a66e`](https://github.com/meta/astryx/commit/daf66a66e) docs(spec): TopNavItem keeps a disabled item's tab stop under AST-085 (#8460)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`4d875c86e`](https://github.com/meta/astryx/commit/4d875c86e) docs(spec): MobileNav records its shipped contract as current (#8466)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`f1b4c0543`](https://github.com/meta/astryx/commit/f1b4c0543) docs(spec): NavIcon records its shipped contract as current (#8511)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`79fb52533`](https://github.com/meta/astryx/commit/79fb52533) docs(spec): NavMenu records its shipped contract as current (#8524)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`c22cbe2fd`](https://github.com/meta/astryx/commit/c22cbe2fd) fix(core): useAnnounce delivers inside the open Astryx modal that encloses its caller (#8009)
- [ ] [`fbbe89780`](https://github.com/meta/astryx/commit/fbbe89780) fix(TopNav): under reduced motion the mega-menu panel never rises (#8612)
- [x] [`ef6d25b71`](https://github.com/meta/astryx/commit/ef6d25b71) docs(spec): Breadcrumbs records its shipped contract as current (#8560)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`12e7190f6`](https://github.com/meta/astryx/commit/12e7190f6) fix(SideNavItem): the collapsed rail tooltip describes the item's control, not its row (#7502)
- [x] [`39ed04d76`](https://github.com/meta/astryx/commit/39ed04d76) docs(spec): TabList records its shipped contract as current (#8643)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`08e626f37`](https://github.com/meta/astryx/commit/08e626f37) fix(TabList): a hugging tab keeps its label's width, so a narrow strip scrolls (#8730)
- [ ] [`4c9a9d331`](https://github.com/meta/astryx/commit/4c9a9d331) fix(core): a disabled NavHeadingMenuItem link no longer navigates (#8667)
- [x] [`db165f86f`](https://github.com/meta/astryx/commit/db165f86f) spec(SideNav, AppShell): rail collapse by snap, clip and cross-fade (D38) (#8720)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`b8c5e4aee`](https://github.com/meta/astryx/commit/b8c5e4aee) feat(core): SideNav's rail collapses by snap, clip and cross-fade; AppShell's content moves on its clock (#8723)
- [x] [`7d23f0bb6`](https://github.com/meta/astryx/commit/7d23f0bb6) docs(SideNav, AppShell): the rail collapse motion is implemented (FR6, FR17) (#8790)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`34d2513d8`](https://github.com/meta/astryx/commit/34d2513d8) test(SideNav, AppShell): real-browser frame evidence for the rail collapse (#8792)
  - 不适用：上游组件规范文档、只改上游测试（自动初筛）
- [ ] [`7bcb81cbe`](https://github.com/meta/astryx/commit/7bcb81cbe) feat(core): the nav, breadcrumb and tab menus track a held pointer across their items (#8791)
- [ ] [`21436d9d8`](https://github.com/meta/astryx/commit/21436d9d8) fix(core): a mouse slide across NavHeadingMenu or TabMenu items selects no text (#8802)
- [ ] [`7824f29dc`](https://github.com/meta/astryx/commit/7824f29dc) fix(TopNav): a mouse slide across TopNavMenu's action items selects no text (#8807)
- [x] [`f3d85ed05`](https://github.com/meta/astryx/commit/f3d85ed05) test(Breadcrumbs): the hover-focus case waits for the open's first-row focus, so it no longer races it (#8824)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`249501fb0`](https://github.com/meta/astryx/commit/249501fb0) fix(Overlay, DropdownMenuGroup, MobileNavToggle): forward host attributes to the element each owns (#8755)

### v0.7.6

- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [x] [`257380d6d`](https://github.com/meta/astryx/commit/257380d6d) fix(SideNavHeading, TopNavHeading): one arrow key moves one item in a NavHeadingMenu (#9019)
  - 不适用：上游组件规范文档、只改上游测试（自动初筛）
- [ ] [`1a4158ea3`](https://github.com/meta/astryx/commit/1a4158ea3) fix(Drawer, MobileNav, Lightbox): a dismissed file picker inside no longer closes them (#8855)
- [ ] [`09382da26`](https://github.com/meta/astryx/commit/09382da26) fix(TabList): a press measures the selected tab in the next frame, not inside the press (#8856)
- [ ] [`cdc4dcbab`](https://github.com/meta/astryx/commit/cdc4dcbab) fix(MobileNav): the header row grows with taller header content (#8865)
- [x] [`1db4108ac`](https://github.com/meta/astryx/commit/1db4108ac) test(core): one internal definition pins core's touch style keys (#8331)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6751c2597`](https://github.com/meta/astryx/commit/6751c2597) test(TabList): TabMenu's arrow-key tests wait for the open's focus to land (#8493)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8a768dc3f`](https://github.com/meta/astryx/commit/8a768dc3f) test(SideNav): the rail's Reduce Motion cases read the motion by its own start and end (#8914)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e203bb226`](https://github.com/meta/astryx/commit/e203bb226) fix(core): TopNavMenu and TopNavMegaMenu forward ref to the drawer trigger (#8897)
- [ ] [`7958bd2b1`](https://github.com/meta/astryx/commit/7958bd2b1) fix(SideNavItem): a disabled item keeps its Tab stop (spec:AST-085 FR1) (#9102)
- [ ] [`d7cd32c09`](https://github.com/meta/astryx/commit/d7cd32c09) fix(Item, TreeList): a disabled row's link has no destination (spec:AST-085 FR2) (#9056)
- [x] [`d279d1e79`](https://github.com/meta/astryx/commit/d279d1e79) docs(spec): Pagination records its shipped contract as current (#9101)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`0fa02074f`](https://github.com/meta/astryx/commit/0fa02074f) spec(AST-105, Resizable, LayoutPanel, SideNav): one shared edge reveal; a resizable LayoutPanel slides on collapse and open; focus leaves a collapsing panel (#8783)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
- [ ] [`0135af462`](https://github.com/meta/astryx/commit/0135af462) fix(core N–Z): slots use isRenderable; the remaining checks are allowed with a reason (#9206)
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`5909b939e`](https://github.com/meta/astryx/commit/5909b939e) feat(core): one shared edge reveal in the animated-layout module, which the SideNav rail moves onto (#8721)
- [x] [`a9b974a46`](https://github.com/meta/astryx/commit/a9b974a46) test(SideNav): the rail proofs read the motion on its own clock, not on the frames and wall time a loaded page gets (#9289)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`372a0eae2`](https://github.com/meta/astryx/commit/372a0eae2) fix(SideNav): focus on a row the collapsed rail removes moves to the collapse toggle or the nearest rail row (#9249)
- [ ] [`8c8f0dac6`](https://github.com/meta/astryx/commit/8c8f0dac6) fix(Collapsible): focus inside closing content moves to the trigger (#9250)
- [ ] [`d51f57efa`](https://github.com/meta/astryx/commit/d51f57efa) fix(SideNavHeading, TopNavHeading): include headings in menu button names (#9329)
- [x] [`b793e5d1b`](https://github.com/meta/astryx/commit/b793e5d1b) test(rtl): RTL coverage for six TopNav parts (FeaturedCard bug left visible) (#9313)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`e736b92c8`](https://github.com/meta/astryx/commit/e736b92c8) fix(SideNav): a resizable rail keeps its nav and items mounted across a collapse (#9290)
- [ ] [`01015794a`](https://github.com/meta/astryx/commit/01015794a) fix(TopNav): the featured card's link arrow mirrors in RTL (#9317)
- [x] [`1a4c048bc`](https://github.com/meta/astryx/commit/1a4c048bc) test(rtl): RTL coverage for the SideNav parts (#9311)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e7530dbb4`](https://github.com/meta/astryx/commit/e7530dbb4) test(rtl): RTL coverage for seven Core parts (Step, OverflowList, dialogs, MobileNav, menus) (#9332)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`df7ad1bd5`](https://github.com/meta/astryx/commit/df7ad1bd5) test(rtl): RTL coverage for Tab, TabMenu, SegmentedControlItem and ToggleButtonGroup (#9330)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`daa87e136`](https://github.com/meta/astryx/commit/daa87e136) test(rtl): RTL coverage for TopNavMegaMenuFeaturedCard (#9380)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
- [ ] [`9444ac083`](https://github.com/meta/astryx/commit/9444ac083) fix(SideNav): slots follow the shared isRenderable presence check (#9498)
- [ ] [`09a482eaf`](https://github.com/meta/astryx/commit/09a482eaf) fix(Layer): a press inside a layer stops at the layer root in the React tree (#9497)
- [ ] [`27a1c48eb`](https://github.com/meta/astryx/commit/27a1c48eb) fix(TopNav): slots follow the shared isRenderable presence check (#9500)

### v0.7.7

- [ ] [`322c0d6e6`](https://github.com/meta/astryx/commit/322c0d6e6) fix(Button, Tab, Tokenizer and more): slots follow isRenderable; no truthy-guard baseline (#9501)
- [x] [`e02c9552c`](https://github.com/meta/astryx/commit/e02c9552c) test(motion, SideNav): the rail proofs judge the frames a loaded page draws, not a frame rate (#9518)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ab905553a`](https://github.com/meta/astryx/commit/ab905553a) fix(BreadcrumbItem): a crumb in the AppShell mobile drawer closes it (#9683)
- [ ] [`bf14580b0`](https://github.com/meta/astryx/commit/bf14580b0) feat(core): Dialog, Drawer and MobileNav drop the backdrop blur (#8120)
- [x] [`bec12a3b2`](https://github.com/meta/astryx/commit/bec12a3b2) fix(Button): a tooltip that repeats the accessible name adds no description (#9681)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`2188aa9ff`](https://github.com/meta/astryx/commit/2188aa9ff) fix(useScrollLock): keep the page where it is while an overlay is open (#8098)
- [x] [`7d768634e`](https://github.com/meta/astryx/commit/7d768634e) test(MobileNav): a native close of the drawer releases the page lock (#8119)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`73996f1b2`](https://github.com/meta/astryx/commit/73996f1b2) fix(core): a layout change made late in a long task plays its motion instead of skipping past it (#9274)
- [ ] [`946211065`](https://github.com/meta/astryx/commit/946211065) perf(core): an overlay's eager import no longer carries the lazy BottomSheet's padding (#8550)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [ ] [`8ddcfe11c`](https://github.com/meta/astryx/commit/8ddcfe11c) fix(core): a layout motion's copy carries on the CSS animations and transitions running in it (#9534)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [ ] [`252b45bb1`](https://github.com/meta/astryx/commit/252b45bb1) feat(Layer): one input hold, first used by Dialog, Drawer and MobileNav (spec:AST-094 FR35) (#8342)
- [x] [`a0c48b8d7`](https://github.com/meta/astryx/commit/a0c48b8d7) docs(AST-105, AST-108): glides and tap-to-expand play the theme's motion tokens (#9964)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`63a41bbdc`](https://github.com/meta/astryx/commit/63a41bbdc) spec(MobileNav): the drawer's links sit in a navigation landmark (DEC-1) (#9010)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`15a95e7d2`](https://github.com/meta/astryx/commit/15a95e7d2) fix(MobileNav): Tab wraps inside the open drawer through the shared focus-region module (#9999)
- [x] [`5c91e81ee`](https://github.com/meta/astryx/commit/5c91e81ee) fix(Layer): a closed layer's trigger is no CSS anchor (#9963)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1fec9fa77`](https://github.com/meta/astryx/commit/1fec9fa77) feat(Resizable): `resizable` takes useResizable's output on LayoutPanel, ResizeHandle and SideNav, and focus leaves a collapsing panel (#9300)
- [ ] [`aabfc163d`](https://github.com/meta/astryx/commit/aabfc163d) fix(core): a disabled Tab no longer runs a caller's handlers (#10035)
- [x] [`a96269ed3`](https://github.com/meta/astryx/commit/a96269ed3) spec(DropdownMenu): a disabled menu row is reached by the keyboard and stays inert (DEC-11) (#9008)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`267399819`](https://github.com/meta/astryx/commit/267399819) chore(Resizable): restore mocks after each resizable-slot case, plus two source cleanups (#10032)
- [x] [`9f84782a6`](https://github.com/meta/astryx/commit/9f84782a6) test(Breadcrumbs): wait for the menu's focus before the light dismiss (#10080)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1aeaf6e1e`](https://github.com/meta/astryx/commit/1aeaf6e1e) fix(core): disabled SideNavItem rows and collapsed leaves no longer run a caller's handlers (#10037)
- [ ] [`dedecd034`](https://github.com/meta/astryx/commit/dedecd034) fix(core): a disabled TopNavItem no longer runs a caller's handlers (#10039)
- [ ] [`7e69f91dc`](https://github.com/meta/astryx/commit/7e69f91dc) fix(core): an anchored layer that would run under the software keyboard ends above it (#8208)
- [x] [`b8ee12e34`](https://github.com/meta/astryx/commit/b8ee12e34) spec(SideNavHeading, TopNavHeading): record the heading in the menu button name (backfill) (#9385)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4789178a2`](https://github.com/meta/astryx/commit/4789178a2) fix(TabList): keep TabMenu arrow keys out of the tab strip (#7323)
- [ ] [`40ab0ecf6`](https://github.com/meta/astryx/commit/40ab0ecf6) fix(Pagination): the dots expose the radio group they already behave as (#8859)

### v0.7.10

- [ ] [`70597367f`](https://github.com/meta/astryx/commit/70597367f) fix(DropdownMenu, ContextMenu): Tab from any sub-menu level closes the whole menu (#8870)
- [x] [`a0fcc977c`](https://github.com/meta/astryx/commit/a0fcc977c) fix(SideNav): the collapse copy paints at the rail's own level, with no z-index escalation (#10145)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`d67a7848e`](https://github.com/meta/astryx/commit/d67a7848e) fix(MobileNav): the drawer's content region is a navigation landmark named like the dialog (#10130)
- [ ] [`8bd8c6146`](https://github.com/meta/astryx/commit/8bd8c6146) fix(core): layout glides play the theme's move curve, not a spring (#10236)

### v0.7.11

- [ ] [`66b09526b`](https://github.com/meta/astryx/commit/66b09526b) fix(core): a swizzled copy type-checks without Node's types (#10252)
- [x] [`ddedd4c58`](https://github.com/meta/astryx/commit/ddedd4c58) [Spec] motion DEC-1: every hover-to-display interaction is debounced (#7327)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a9c911421`](https://github.com/meta/astryx/commit/a9c911421) fix(core): Overlay, AppShell and MobileNav work with no matchMedia (#10327)

### v0.7.12

- [ ] [`79817bfeb`](https://github.com/meta/astryx/commit/79817bfeb) docs(SideNavCollapseButton): the collapsible prop lists every key of the config it takes (#10282)
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`c4455dd50`](https://github.com/meta/astryx/commit/c4455dd50) fix(Pagination): the row wraps instead of scrolling the page at large text (#10552)
- [ ] [`9dca38629`](https://github.com/meta/astryx/commit/9dca38629) perf(Layer): anchored entrances play on the surface (#10561)
- [ ] [`dd09d678d`](https://github.com/meta/astryx/commit/dd09d678d) fix(menus): the keys and type-ahead reach a disabled row, which stays inert (#10160)
- [ ] [`4deee89c6`](https://github.com/meta/astryx/commit/4deee89c6) fix(SideNav): expanded rows grow with a larger text size (#10550)
- [ ] [`19981aa37`](https://github.com/meta/astryx/commit/19981aa37) fix(TopNav): the bar wraps instead of letting regions overlap at large text (#10571)
- [ ] [`3918a54ad`](https://github.com/meta/astryx/commit/3918a54ad) fix(TabList): tabs grow with a larger text size instead of clipping their labels (#10534)
- [ ] [`a1b0cd9ad`](https://github.com/meta/astryx/commit/a1b0cd9ad) fix(Pagination): the ellipsis grows with a larger text size (#10567)
- [ ] [`6a02057ad`](https://github.com/meta/astryx/commit/6a02057ad) fix(core): a disabled TopNavItem keeps its tab stop (#9208)
- [ ] [`db40c6b01`](https://github.com/meta/astryx/commit/db40c6b01) refactor(core): share per-instance warning dedupe and temporary focus targets (#10655)
- [ ] [`aba928398`](https://github.com/meta/astryx/commit/aba928398) fix(TopNav): let the heading shrink so a long heading truncates inside its column (#9551)
- [ ] [`242d20d62`](https://github.com/meta/astryx/commit/242d20d62) docs(Tab): describe a tab with a Tooltip anchored on it (#10734)
- [ ] [`8abf7bdfd`](https://github.com/meta/astryx/commit/8abf7bdfd) fix(SideNav): render the footer row only when it holds the collapse button or footerIcons (#10721)
- [ ] [`09710569f`](https://github.com/meta/astryx/commit/09710569f) docs(Tab): underline the whole selected tab with a nested Theme (#10814)

### v0.7.13

- [x] [`d130dffdc`](https://github.com/meta/astryx/commit/d130dffdc) fix(Markdown): the public parser drops every data: URL; <Markdown> renders data: links and images as source text (#11020)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.14

- [x] [`894a2a0b2`](https://github.com/meta/astryx/commit/894a2a0b2) fix(motion): a carried pending animation runs in step with its original (#10983)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2e65a090b`](https://github.com/meta/astryx/commit/2e65a090b) fix(core): make onClick-only TopNav items keyboard accessible (#9334)
- [ ] [`77aa2b996`](https://github.com/meta/astryx/commit/77aa2b996) refactor(MobileNav): keep the closing dialog rendered through the layer runtime's presentation hold (#8590)
- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [ ] [`09479d9c7`](https://github.com/meta/astryx/commit/09479d9c7) fix(Popover): a touch that pans is not an outside press, even without pointercancel (#11038)
- [x] [`dc1103320`](https://github.com/meta/astryx/commit/dc1103320) test(SideNav): block the reversal only after a drawn collapse frame (#10984)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`c6614a5e8`](https://github.com/meta/astryx/commit/c6614a5e8) ci: release-specs (changed) adds tagged specs, visited components and Lab-only pull requests, in shards (#11171)
  - 不适用：只改上游测试（自动初筛）

### v0.7.16

- [ ] [`9d2ce46c7`](https://github.com/meta/astryx/commit/9d2ce46c7) docs(core): playground defaults for eight components and sample items for four group playgrounds (#11351)
- [ ] [`30da0a57b`](https://github.com/meta/astryx/commit/30da0a57b) fix(NumberInput): keep a rejected number entry and show why (#11415)
- [ ] [`dcdfd7f43`](https://github.com/meta/astryx/commit/dcdfd7f43) fix(DateInput, DateTimeInput): a value passed at the revealing commit keeps the rejected date entry (#11470)
- [x] [`2fec02259`](https://github.com/meta/astryx/commit/2fec02259) fix(SideNav, TopNav): a modified click on a drawer link leaves the mobile drawer open (#9390)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`8cf8ead59`](https://github.com/meta/astryx/commit/8cf8ead59) feat(NumberInput, Pagination): entryErrorBehavior on NumberInput (#11492)

### v0.7.17

- [ ] [`84a446b7e`](https://github.com/meta/astryx/commit/84a446b7e) fix(MobileNav): side="auto" resolves the drawer edge in RTL and on first open (#11227)
- [ ] [`9d19da96a`](https://github.com/meta/astryx/commit/9d19da96a) fix(TopNav): the phone bar keeps a plain-text heading on one line (#11647)
- [ ] [`54f211658`](https://github.com/meta/astryx/commit/54f211658) feat(Pagination): page links through getPageHref (#11578)
- [ ] [`ae1507195`](https://github.com/meta/astryx/commit/ae1507195) [Component Audit] MobileNavToggle: docs list every case where the menu button renders nothing, and tests guard it (#11737)
- [ ] [`34e3d212f`](https://github.com/meta/astryx/commit/34e3d212f) fix(core): dialog text reads the theme, and toast text reaches AA on its card (#12095)
- [ ] [`64260e60e`](https://github.com/meta/astryx/commit/64260e60e) fix(core): TopNavMenu and TopNavMegaMenu close on a keyboard or touch pick and return focus; items get hasCloseOnSelect (#12140)
- [ ] [`782b392ce`](https://github.com/meta/astryx/commit/782b392ce) fix(MobileNav): the painted drawer panel carries its own theme target (#12382)
- [ ] [`ea92bc042`](https://github.com/meta/astryx/commit/ea92bc042) fix(core): theme targets for Pagination's control row, cells and ellipsis (#12253)
- [ ] [`72f2d7caa`](https://github.com/meta/astryx/commit/72f2d7caa) docs: icon props take semantic names; Selector hasClear types; useTableSelectionState returns (#12583)
- [ ] [`2c7cc9451`](https://github.com/meta/astryx/commit/2c7cc9451) fix(Tab): a wrapped label stays centered in its tab, selected or not (#12593)
- [ ] [`d7c7e7014`](https://github.com/meta/astryx/commit/d7c7e7014) fix(TopNav): the phone bar keeps wide end content inside it, so the Shell Nav menu button stays in view (#12300)
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`8c52e3bba`](https://github.com/meta/astryx/commit/8c52e3bba) chore: land batch 7 (3 pull requests) (#12811)
- [ ] [`9c2767b31`](https://github.com/meta/astryx/commit/9c2767b31) [Component Audit] MobileNav: the menu button keeps its link to the drawer when id is undefined, and docs list the label prop (#11621)
- [x] [`4739b00f0`](https://github.com/meta/astryx/commit/4739b00f0) test(Pagination): the late-page focus test waits for the press's transition to end (#12824)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4388ac4d4`](https://github.com/meta/astryx/commit/4388ac4d4) [Component Audit] NavHeadingMenu: docs cover its items, their props, and the keys the menu follows (#11879)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`783e47029`](https://github.com/meta/astryx/commit/783e47029) chore: land batch 17 (2 pull requests) (#12866)
- [ ] [`904b58e64`](https://github.com/meta/astryx/commit/904b58e64) chore: land batch 29 (3 pull requests) (#12894)
- [ ] [`476d9063f`](https://github.com/meta/astryx/commit/476d9063f) chore: land batch 63 (3 pull requests) (#12945)
- [ ] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
- [ ] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
- [x] [`1eecb6108`](https://github.com/meta/astryx/commit/1eecb6108) test(TabList): the forward arrow focuses and reveals an overflowed tab (#12361)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`22ba912d7`](https://github.com/meta/astryx/commit/22ba912d7) fix(NavHeadingMenu): inside a nav heading's menu, the items belong to that one named menu (#12025)

## 弹出浮层家族（area:core）

### v0.7.2

- [x] [`f8533a7a5`](https://github.com/meta/astryx/commit/f8533a7a5) fix(Tooltip): drop a pending show when isEnabled turns false (#7612)
  - Vue 版已有：useTooltip 的 isEnabled 变 false 时丢掉排队中的显示，useTooltip.test 有用例
- [x] [`5c95d64e7`](https://github.com/meta/astryx/commit/5c95d64e7) fix(HoverCard): hide() and Escape on a hovered card no longer leave the next open stuck (#7617)
  - Vue 版已有：useHoverCard 的 hideNow 和 isOpen 监听都会清掉悬停在卡片上的标记
- [x] [`81b8df40f`](https://github.com/meta/astryx/commit/81b8df40f) fix(Layer): ship the dynamic-viewport cap and safe-area gutter, not only their fallbacks (#7622)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。Popover 内容高度上限改按动态视口减去带安全区的上下间距，旧的 vh 写法留作后备，补 CSS 用例
- [x] [`3f45fc2f6`](https://github.com/meta/astryx/commit/3f45fc2f6) fix: Omit the popover source when the trigger is not an HTML element (#7227)
  - 不适用：只改上游测试（自动初筛）
- [x] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)
  - Vue 版已有：Drawer、DrawerHeader 已在 packages/core 里
- [x] [`738e671ca`](https://github.com/meta/astryx/commit/738e671ca) [Component Audit] Drawer: keep self-directed RTL motion on the logical edge (#7634)
  - Vue 版已有：drawer.css 用 :dir(rtl) 镜像自身方向的滑入
- [x] [`b790a9e31`](https://github.com/meta/astryx/commit/b790a9e31) [Component Audit] DrawerHeader: keep numeric slot content inside its targets (#7635)
  - 不适用：React 节点里数字 0 被真值判断漏掉的问题；Vue 版副标题是字符串，插槽按是否传入判断
- [x] [`d150f7873`](https://github.com/meta/astryx/commit/d150f7873) fix(Dialog): capture the opener before descendant autofocus effects (#6607)
  - Vue 版已有：Dialog.vue 在打开时先记下打开者再聚焦（trackLayerFocus），标题的默认焦点在 showModal 之后才应用
- [x] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
  - 已移植：[#514](https://github.com/astryx-vue/astryx-vue/pull/514)。CLI 搜索收录别家组件库叫法与常见图标名（已有 PR）

### v0.7.3

- [x] [`7fbacfb4b`](https://github.com/meta/astryx/commit/7fbacfb4b) fix(Tooltip): keep the tooltip open when the pointer crosses onto it in one step (#7802)
  - Vue 版已有：指针一步从触发器移进气泡时保持显示（桥接延迟加 cancelHide），useTooltip.test 有用例
- [x] [`ca4f3b282`](https://github.com/meta/astryx/commit/ca4f3b282) test(a11y): add Tooltip contract and bind Tooltip (#7799)
  - 不适用：只改上游测试（自动初筛）
- [x] [`cbe384c14`](https://github.com/meta/astryx/commit/cbe384c14) fix(Tooltip): attach sibling-mode anchors rendered inside their own anchor (#7833)
  - Vue 版已有：Tooltip.vue 的 anchorsOnSelf 用 findAnchorElement 找到自身根，TooltipUpstream.test 有用例
- [x] [`29ead9885`](https://github.com/meta/astryx/commit/29ead9885) fix(core): disabled links, tokens and cards stay focusable (#7842)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。aria-disabled 的触发器保持可聚焦但不打开浮层；Link、ClickableCard、Token 禁用时保留焦点另有族已覆盖
- [x] [`79f4fc70d`](https://github.com/meta/astryx/commit/79f4fc70d) fix(Dialog, BottomSheet): a dismissed file picker inside no longer closes them (#7851)
  - Vue 版已有：Dialog.vue 与 BottomSheet.vue 的 onCancel 都只认发给 dialog 自己的 cancel，Dialog.test.ts 有覆盖

### v0.7.5

- [x] [`7cb897b4e`](https://github.com/meta/astryx/commit/7cb897b4e) fix(BottomSheet): keep toasts visible and clickable above an open sheet (#7781)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1554dc626`](https://github.com/meta/astryx/commit/1554dc626) fix(Tooltip, HoverCard): a touch opens them only once it is a tap (#8165)
  - 不适用：只改上游测试（自动初筛）
- [x] [`03e051aaa`](https://github.com/meta/astryx/commit/03e051aaa) fix(Lightbox): the gallery's arrow keys follow the writing direction (#8081)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。Lightbox 方向键随书写方向
- [x] [`a6740a738`](https://github.com/meta/astryx/commit/a6740a738) fix(Popover): cancel the auto-focus frame when the popover closes first (#8276)
  - Vue 版已有：usePopover 的 focusInitialTarget 在下一拍执行时检查 isOpen，先关闭就不再聚焦
- [ ] [`49ef07109`](https://github.com/meta/astryx/commit/49ef07109) fix(Dialog): with reduced motion on a touch screen the dialog fades in, 200 ms at most (#8327)
  - 暂缓：触屏上减弱动效时对话框 200ms 淡入属于触屏呈现（presentation），Vue 版没有，归触屏呈现基础设施任务
- [x] [`4b05772a2`](https://github.com/meta/astryx/commit/4b05772a2) fix(Popover): focus, Tab and Escape work in a second document (#7356)
  - 不适用：第二个 document（子窗口、画中画）里的焦点、Tab、Escape；Vue 版浮层都 Teleport 到宿主 document，库不渲染到别的 document
- [ ] [`a56c06134`](https://github.com/meta/astryx/commit/a56c06134) fix(Tooltip): a tooltip taller than the room around its trigger opens clear of it (#8254)
  - 暂缓：比触发器上下空间都高的提示改落到触发器侧边并在内部滚动，需要给浮层定位加「让开锚点」的第二套回退和几何观察，Vue 版定位没有
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`116f54be5`](https://github.com/meta/astryx/commit/116f54be5) fix(Tooltip): an open tooltip follows a trigger that moves on screen (#8364)
  - 不适用：只改上游测试（自动初筛）
- [x] [`23de0923e`](https://github.com/meta/astryx/commit/23de0923e) spec(AST-094): touch presentations feel native by default (#8409)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`17fead75b`](https://github.com/meta/astryx/commit/17fead75b) spec(Popover): presentation is popover, bottom-sheet, or adaptive, following the menus (#8440)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`2af4d305a`](https://github.com/meta/astryx/commit/2af4d305a) feat(Popover): presentation — a BottomSheet on a phone when asked, as iOS presents a popover (#8229)
  - 暂缓：Popover 的 presentation（手机上改以 BottomSheet 呈现）需要「呈现方式保持」设施和 Popover 内的 BottomSheet 接入，Vue 版都没有
- [x] [`4e6bc19fb`](https://github.com/meta/astryx/commit/4e6bc19fb) spec(Popover): a Popover is a focus region, modal or not (DEC-9) (#8608)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`c22cbe2fd`](https://github.com/meta/astryx/commit/c22cbe2fd) fix(core): useAnnounce delivers inside the open Astryx modal that encloses its caller (#8009)
  - Vue 版已有：composables/internal/announce.ts 在原生模态打开时把播报写进模态里的区域，toast 也会被搬进模态
- [ ] [`2a162e1b6`](https://github.com/meta/astryx/commit/2a162e1b6) feat(core): BottomSheet stacks by open order, replaces on a same-update switch, and BottomSheetSwitcher is deprecated (#7648)
  - 暂缓：BottomSheet 按打开顺序叠放、同次更新替换（含入场、对齐、淡出编排）和非模态 popover 托管，Vue 版没有叠放登记表和 sheet 转场编排，归动效与手势引擎任务
- [x] [`81eeb6afa`](https://github.com/meta/astryx/commit/81eeb6afa) fix(Popover): an open popover no longer pulls in a Tab pressed elsewhere on the page (#8611)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`54fbccb27`](https://github.com/meta/astryx/commit/54fbccb27) feat(core): Tokenizer touch sheet behind experimental.presentation (#7977)
  - 暂缓：Tokenizer 触屏 sheet 在 experimental.presentation 之后，属于触屏呈现基础设施
- [x] [`343fddd2c`](https://github.com/meta/astryx/commit/343fddd2c) fix(Lightbox): the viewer fits the visible viewport, so Safari's toolbar no longer covers its caption (#8732)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。Lightbox 高度按手机实际露出的视口算
- [x] [`1ffd3234b`](https://github.com/meta/astryx/commit/1ffd3234b) fix(Lightbox): a viewer opened before its first item arrives opens when it does (#8741)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。第一项晚到时灯箱等它到了再打开
- [x] [`dc5a8cff7`](https://github.com/meta/astryx/commit/dc5a8cff7) docs(spec): Tooltip records its shipped contract as current (#8738)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`105bbbe4f`](https://github.com/meta/astryx/commit/105bbbe4f) docs(spec): HoverCard records its shipped contract as current (#8789)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`a264f6326`](https://github.com/meta/astryx/commit/a264f6326) spec(AlertDialog): touch presentation, phone width, and action-group actions (FR6–FR9) (#8594)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`17eab316b`](https://github.com/meta/astryx/commit/17eab316b) docs(spec): Toast records its shipped contract as current (#8795)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`0af8ee10f`](https://github.com/meta/astryx/commit/0af8ee10f) fix(Toast): a toast dismissed with no row on screen leaves the stack (#8050)
  - 已移植：[#564](https://github.com/astryx-vue/astryx-vue/pull/564)。没有行可见的离场提示（超出可见上限）直接出栈，补测试
- [x] [`248380ebd`](https://github.com/meta/astryx/commit/248380ebd) spec(Dialog): every modal presentation is a focus region through one module (DEC-2) (#8882)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`274313294`](https://github.com/meta/astryx/commit/274313294) test(Dialog): the reduced-motion entrance contract reads a fade that ended before its listener ran (#8924)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9db435618`](https://github.com/meta/astryx/commit/9db435618) test(Tooltip): the fitting-tooltip wheel contract reads "still open" as the page starts to scroll (#8988)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8b4aed061`](https://github.com/meta/astryx/commit/8b4aed061) docs(spec): Toast narrows its lingering-row gap to the paths main still has (#8879)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.6

- [x] [`cf71dcf07`](https://github.com/meta/astryx/commit/cf71dcf07) fix(Dialog): closing returns focus to the opener in a second document (#8381)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。对话框的打开者和进场方向按所在文档的窗口算（第二个文档、iframe）（jsdom 里没有第二个文档，未补测试）
- [x] [`9ee74578d`](https://github.com/meta/astryx/commit/9ee74578d) docs(spec): Drawer records its shipped contract as current (#9050)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
  - 不适用：React 版 esbuild 单文件打包的导入路径问题
- [x] [`1a4158ea3`](https://github.com/meta/astryx/commit/1a4158ea3) fix(Drawer, MobileNav, Lightbox): a dismissed file picker inside no longer closes them (#8855)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。Lightbox 只认发给 dialog 自己的 cancel，补测试；Drawer 走 Dialog 已有
- [x] [`9a642cf32`](https://github.com/meta/astryx/commit/9a642cf32) test(Lightbox): the viewport spec skips only a cross-origin stylesheet (#9064)
  - 不适用：只改上游测试（自动初筛）
- [x] [`83df37770`](https://github.com/meta/astryx/commit/83df37770) fix(Toast): a leaving toast pushed past the cap leaves the stack (#8051)
  - 已移植：[#564](https://github.com/astryx-vue/astryx-vue/pull/564)。被新提示挤出可见上限的离场提示直接出栈，不再作为空行回来，补测试
- [x] [`bb18c817a`](https://github.com/meta/astryx/commit/bb18c817a) fix(Table): a column-resize handle is named by a node header's visible text (#9057)
  - 不适用：getNodeText 是 React 节点转文本的工具，Vue 版 toast 正文是字符串
- [x] [`743906fa9`](https://github.com/meta/astryx/commit/743906fa9) fix(Toast): each auto-hide pause condition holds the timer on its own (#9016)
  - 已移植：[#564](https://github.com/astryx-vue/astryx-vue/pull/564)。悬停、焦点、手势、窗口失焦各自按住计时，全部放开才继续，补测试
- [ ] [`e48299813`](https://github.com/meta/astryx/commit/e48299813) fix(Drawer): under a finger, the page beside a non-modal drawer scrolls (#8636)
  - 暂缓：非模态（无遮罩）Drawer 形态，Vue 的 Drawer 只有模态，需先做该形态
- [x] [`f233ad6b2`](https://github.com/meta/astryx/commit/f233ad6b2) fix(Popover): in a Picture-in-Picture window, it scrolls once its window is too short (#9098)
  - 不适用：画中画窗口里 Popover 随窗口变矮而滚动，依赖第二个 document，同 4b05772a2
- [x] [`cebf4a952`](https://github.com/meta/astryx/commit/cebf4a952) fix(Toast): focus entering by Tab or a click is remembered, so dismissing the last toast returns it (#9039)
  - 已移植：[#564](https://github.com/astryx-vue/astryx-vue/pull/564)。视口记住焦点从哪来，最后一张提示离场时还回去，补测试
- [x] [`8bc9ab9b2`](https://github.com/meta/astryx/commit/8bc9ab9b2) fix(usePopover): its trigger ref stays the same function across renders (#9130)
  - 不适用：React 回调 ref 跨渲染保持同一个函数的问题，Vue 的 ref 没有这个问题
- [x] [`adda63f8c`](https://github.com/meta/astryx/commit/adda63f8c) spec(Lightbox): make the record current, with touch gestures and their accessible alternatives (#9158)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`717c80096`](https://github.com/meta/astryx/commit/717c80096) spec(overlay-dismissal): trigger-anchored overlays work in iframes and PiP windows (FR8) (#9142)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1d8696ad9`](https://github.com/meta/astryx/commit/1d8696ad9) spec: Tooltip and HoverCard pin on press; InfoTip is the info preset (#9175)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
  - 不适用：React 每个组件只调用一次交互方式 hook 的整理；Vue 版交互方式由 trackInteractionModality 按文档统一跟踪
- [x] [`995036e69`](https://github.com/meta/astryx/commit/995036e69) fix(Toast): a Theme in fallback-viewport toast content stays nested and never rewrites <html> (#9253)
  - 不适用：React 回退根里的 ThemeNestingContext；Vue 版 toast 走模块级 store，由 ToastViewport 渲染，没有回退根
- [x] [`97b3711d6`](https://github.com/meta/astryx/commit/97b3711d6) fix(Tooltip, HoverCard): a disabled control's reason opens on a tap (#8207)
  - Vue 版已有：composables/internal/touchTriggerRules.ts 把 aria-disabled 控件当作不执行操作，轻点会打开原因；HoverCard 文档已写
- [x] [`891aa236c`](https://github.com/meta/astryx/commit/891aa236c) refactor(core): drop a dead private selector and collapse duplicate attribute spellings (INV23 step 4) (#9256)
  - 不适用：上游内部重构：删私有选择器、合并重复属性写法，Vue 版没有对应代码
- [x] [`dae84a757`](https://github.com/meta/astryx/commit/dae84a757) tooling(knowledge): records route the claims of shared concerns a change touches (#9145)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游把规范文档换目录，Vue 版没有这些规范文档
- [x] [`224a25f7b`](https://github.com/meta/astryx/commit/224a25f7b) docs(spec): AlertDialog records its shipped contract as current (#9305)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3d44c583a`](https://github.com/meta/astryx/commit/3d44c583a) fix(Tooltip, HoverCard): a press inside an open surface doesn't activate the card, row or field around it (#9252)
  - 已移植：[#512](https://github.com/astryx-vue/astryx-vue/pull/512)。气泡内按下不激活外层卡片、行、字段
- [x] [`e7530dbb4`](https://github.com/meta/astryx/commit/e7530dbb4) test(rtl): RTL coverage for seven Core parts (Step, OverflowList, dialogs, MobileNav, menus) (#9332)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。不截断的 Text/Heading 里长串会换行（基础展示与动作按钮族已做）
- [x] [`a68e0e372`](https://github.com/meta/astryx/commit/a68e0e372) spec(Tooltip, HoverCard): rename pressTrigger to triggerBehavior ('adaptive' | 'hover' | 'toggle') (#9379)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`cdab2e6eb`](https://github.com/meta/astryx/commit/cdab2e6eb) fix(Tooltip): under focusTrigger="auto", decide when focus arrives whether it opens the tooltip (#9366)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。focusTrigger 为 auto 时焦点到达才判断算不算，失焦据此收起；漫游 tabindex 成员和可聚焦包裹层可用，补用例和文档
- [x] [`16b95934f`](https://github.com/meta/astryx/commit/16b95934f) fix(Dialog, Drawer, BottomSheet): an overlay open on the server renders closed until hydration (#9360)
  - Vue 版已有：Dialog 在 onMounted 才 showModal，服务端渲染出来的是关着的；Drawer 就是 Dialog
- [x] [`4d6c4e926`](https://github.com/meta/astryx/commit/4d6c4e926) test(Tooltip): TooltipTallContentTracking waits for what it checks (#9396)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0de0e75d7`](https://github.com/meta/astryx/commit/0de0e75d7) spec(Tooltip, HoverCard): the touchTrigger codemod is available before the 0.8.0 removal (#9417)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
  - 已移植：[#515](https://github.com/astryx-vue/astryx-vue/pull/515)。组件只按自己的命名空间读内置文案
- [x] [`41aa83233`](https://github.com/meta/astryx/commit/41aa83233) spec(layer-runtime): a click inside a layer stops at the layer root (#9398)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`09a482eaf`](https://github.com/meta/astryx/commit/09a482eaf) fix(Layer): a press inside a layer stops at the layer root in the React tree (#9497)
  - 不适用：React 合成事件沿 React 树穿过 portal 冒泡；Vue 的事件按 DOM 冒泡，不存在这个问题
- [x] [`b5e716687`](https://github.com/meta/astryx/commit/b5e716687) refactor(Item, Token, ChatComposer): drop the per-site tooltip surface checks the layer boundary replaces (#9531)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f89fa3aa5`](https://github.com/meta/astryx/commit/f89fa3aa5) [Component Audit] HoverCard: open cards are now audited, and the styling props are documented (#9536)
  - 不适用：上游给卡片表面加 xstyle/className/style 并补可访问性审计；Vue 版没有 StyleX 样式入口，类名和样式落在包裹元素上
- [x] [`2227dcbf6`](https://github.com/meta/astryx/commit/2227dcbf6) spec(HoverCard, Stack): verification maps name the audit tests and browser evidence (#9582)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.7

- [x] [`c5c11496a`](https://github.com/meta/astryx/commit/c5c11496a) fix(Drawer): a modal drawer hosts the toast viewport, so its toasts can be pressed and reached (#9590)
  - Vue 版已有：Dialog 打开时登记 modalOutlet，ToastViewport 搬进最新的模态框，ToastViewport.modalOutlet.test 有用例；Drawer 就是 Dialog
- [x] [`d1118274b`](https://github.com/meta/astryx/commit/d1118274b) chore(core): UIKit's paging values and math, measured on iOS 26.2 (#8145)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1d04d40fd`](https://github.com/meta/astryx/commit/1d04d40fd) feat(Tooltip): triggerBehavior="toggle" pins the tooltip on a press (#9232)
  - 不适用：triggerBehavior 属性在 0.7.7 发布前就被 1821fb3fa 撤回，没有发布过，Vue 版也没有
- [x] [`9ae589b92`](https://github.com/meta/astryx/commit/9ae589b92) fix(Tooltip): Space on keyup and a press outside in another document, with triggerBehavior evidence (#9406)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`0f12096d3`](https://github.com/meta/astryx/commit/0f12096d3) fix(Drawer): a scrimless drawer announces its top-layer entry, so toasts stay above it (#9594)
  - 不适用：上游的无遮罩抽屉在 Vue 版不存在，Vue 的 Drawer 始终是模态 Dialog，toast 经 modalOutlet 留在它上面
- [x] [`e70d5dc7a`](https://github.com/meta/astryx/commit/e70d5dc7a) fix(Popover): initial focus lands within the opening tap, and focus set in onShow is kept (#9606)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。初始焦点在打开的那次点按内落下，onShow 里放好的焦点不被挪走
- [x] [`322c0d6e6`](https://github.com/meta/astryx/commit/322c0d6e6) fix(Button, Tab, Tokenizer and more): slots follow isRenderable; no truthy-guard baseline (#9501)
  - 已移植：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)。空插槽不画包裹元素
- [x] [`c0929c879`](https://github.com/meta/astryx/commit/c0929c879) fix(Dialog): a dialog that unmounts while open returns focus to its opener (#9627)
  - Vue 版已有：Dialog.vue 的 onBeforeUnmount 在微任务里把困住的焦点还给打开者，Dialog.focusReturn.test.ts 有覆盖
- [x] [`2de3888fe`](https://github.com/meta/astryx/commit/2de3888fe) fix(Toast): a toast raised while the window is in the background starts with its timer paused (#9615)
  - 已移植：[#564](https://github.com/astryx-vue/astryx-vue/pull/564)。窗口在后台时弹出的提示从暂停开始，窗口获得焦点再继续，补测试
- [x] [`449486fdc`](https://github.com/meta/astryx/commit/449486fdc) feat(core): promote InfoTip from Lab as the info preset over Tooltip's press toggle (#9238)
  - Vue 版已有：InfoTip 已是核心组件，建在 Tooltip 的按压钉住之上
- [x] [`ce667be4d`](https://github.com/meta/astryx/commit/ce667be4d) fix(Dialog, Drawer): a backdrop press dismisses only when it starts and ends on the backdrop (#9613)
  - Vue 版已有：layer/useBackdropPress.ts 要求按下和松手都在遮罩上才关，Dialog 和 Drawer 共用
- [ ] [`35f558e74`](https://github.com/meta/astryx/commit/35f558e74) fix(Drawer): a scrimless drawer's keyboard open lets its first control's tooltip show (#9685)
  - 暂缓：无遮罩 Drawer 的键盘打开，Vue 的 Drawer 只有模态，需先做非模态形态
- [x] [`1821fb3fa`](https://github.com/meta/astryx/commit/1821fb3fa) fix(Tooltip): remove the unreleased triggerBehavior prop before 0.7.7 (#9711)
  - 不适用：撤回未发布的 triggerBehavior 属性，Vue 版从没有这个属性；InfoTip 的按压钉住由 show 和 hide 实现
- [x] [`bf14580b0`](https://github.com/meta/astryx/commit/bf14580b0) feat(core): Dialog, Drawer and MobileNav drop the backdrop blur (#8120)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。Dialog 的遮罩去掉模糊，Drawer 和 MobileNav 本来就没有；补 CSS 用例
- [x] [`4e495ec5e`](https://github.com/meta/astryx/commit/4e495ec5e) fix(BottomSheet): a standalone sheet closing with focus inside stays out of inert while focus stays (#9635)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [x] [`ae97fa8fc`](https://github.com/meta/astryx/commit/ae97fa8fc) fix(HoverCard): a replaced trigger element is wired in place of the old one (#9593)
  - 已移植：[#566](https://github.com/astryx-vue/astryx-vue/pull/566)。触发元素被子组件悄悄换掉时重新接线，旧元素先放手，补测试
- [x] [`97191cf7f`](https://github.com/meta/astryx/commit/97191cf7f) feat(Tooltip): useTooltip returns show() and hide() for an app-built toggle trigger (#9727)
  - Vue 版已有：useTooltip 返回 show 和 hide，useTooltip.test 有用例
- [x] [`d43f40785`](https://github.com/meta/astryx/commit/d43f40785) fix(AlertDialog): a press that slides between the actions runs the one it lifts on (#8083)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。AlertDialog 按住滑动，在松手的按钮上执行（已有 PR）
- [x] [`eaa9968af`](https://github.com/meta/astryx/commit/eaa9968af) fix(Toast): an update through uniqueID keeps focus on the toast's controls (#9624)
  - 已移植：[#564](https://github.com/astryx-vue/astryx-vue/pull/564)。同一个 uniqueID 原地覆盖时卡片不换（焦点留在控件上），计时重新开始，补测试
- [x] [`709a28641`](https://github.com/meta/astryx/commit/709a28641) fix(Lightbox): a viewer that unmounts while open returns focus to its opener (#9629)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。灯箱卸载时焦点回到打开者
- [x] [`f88f5dc65`](https://github.com/meta/astryx/commit/f88f5dc65) fix(HoverCard): focusTrigger="auto" decides when focus arrives, through Tooltip's shared check (#9597)
  - 已移植：[#566](https://github.com/astryx-vue/astryx-vue/pull/566)。focusTrigger="auto" 在焦点到达时判断，复用 Tooltip 的 createFocusGate，补测试和文档
- [x] [`ba6401064`](https://github.com/meta/astryx/commit/ba6401064) fix(HoverCard): text written around an expression gets the focusable trigger and hover cue (#9603)
  - Vue 版已有：HoverCard.vue 的 resolveTrigger 把无元素子节点的文本（含表达式拼出的）当文本触发器，可聚焦并带虚线提示
- [x] [`2188aa9ff`](https://github.com/meta/astryx/commit/2188aa9ff) fix(useScrollLock): keep the page where it is while an overlay is open (#8098)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`bb3838b6f`](https://github.com/meta/astryx/commit/bb3838b6f) fix(AlertDialog): a mouse press on the actions acts natively again (#9771)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。鼠标按压保持原生行为（已有 PR）
- [x] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
  - 不适用：只给 React useEffect 加注释
- [x] [`ff5b5ac7e`](https://github.com/meta/astryx/commit/ff5b5ac7e) docs(useLightbox): add hook docs and a gallery grid example block (#9752)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。新增 useLightbox 文档页（中英、参数表）和图集网格示例，composable 目录加一项
- [x] [`61cf773c2`](https://github.com/meta/astryx/commit/61cf773c2) refactor(InfoTip): build on useTooltip's show() and hide(); remove the internal toggle path (#9756)
  - Vue 版已有：InfoTip.vue 建在 useTooltip 的 show 和 hide 上，InfoTip.test 的钉住用例覆盖
- [x] [`946211065`](https://github.com/meta/astryx/commit/946211065) perf(core): an overlay's eager import no longer carries the lazy BottomSheet's padding (#8550)
  - 不适用：上游为懒加载 BottomSheet 瘦身急切导入的 StyleX 内边距；Vue 版 Popover 和 Lightbox 不引入 BottomSheet
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`bb5650811`](https://github.com/meta/astryx/commit/bb5650811) fix(Tooltip, HoverCard): a pen held before it lifts no longer closes the layer it opened (#9819)
  - 已移植：[#566](https://github.com/astryx-vue/astryx-vue/pull/566)。笔落下时取消挂着的悬停打开，HoverCard 和 Tooltip 都改，补测试
- [x] [`f10bc9153`](https://github.com/meta/astryx/commit/f10bc9153) spec(AST-094): only a gesture's motion springs; other motion plays the theme's tokens (#9706)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`62b3e17de`](https://github.com/meta/astryx/commit/62b3e17de) docs(HoverCard): the tap rule covers a pen, as Tooltip's does (#9884)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7b87c5c1d`](https://github.com/meta/astryx/commit/7b87c5c1d) fix(gestures): a selection a claimed lift's own handlers make stays (#9848)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [x] [`5083ead48`](https://github.com/meta/astryx/commit/5083ead48) fix(DropdownMenu): prevent stale trigger tooltips after selection (#9280)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。isEnabled 变 false 时收起已打开的提示；重新启用时焦点已在触发器里且会打开提示就再打开，补用例
- [ ] [`252b45bb1`](https://github.com/meta/astryx/commit/252b45bb1) feat(Layer): one input hold, first used by Dialog, Drawer and MobileNav (spec:AST-094 FR35) (#8342)
  - 暂缓：触屏进场期间的输入遮挡（input hold）属于触屏呈现基础设施，Vue 版没有
- [x] [`d9a3da5fe`](https://github.com/meta/astryx/commit/d9a3da5fe) [Component Audit] InfoTip: the docs page gets worked examples, and hover, focus, pin, and Escape are proven in a browser (#9940)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。InfoTip 文档页补「指标释义」「权限说明」两个示例；浏览器验证属上游测试设施
- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [x] [`cb44b33c3`](https://github.com/meta/astryx/commit/cb44b33c3) spec(Dialog): the deprecated BottomSheetSwitcher's steps are the one exception to DEC-2 (#9054)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7eee90594`](https://github.com/meta/astryx/commit/7eee90594) fix(Dialog, AlertDialog, CommandPalette, BottomSheet, Lightbox): Tab wraps inside the open modal through the shared focus-region module (#8883)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。Tab 在打开的灯箱里循环
- [x] [`5c91e81ee`](https://github.com/meta/astryx/commit/5c91e81ee) fix(Layer): a closed layer's trigger is no CSS anchor (#9963)
  - 不适用：上游用 CSS anchor 定位，关着的触发器要撤掉 anchor-name；Vue 版用脚本算位置，没有 anchor-name
- [x] [`45a48651e`](https://github.com/meta/astryx/commit/45a48651e) docs(InfoTip): the record says InfoTip is released and names its browser audit (#10002)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`5db61cc9b`](https://github.com/meta/astryx/commit/5db61cc9b) fix(BottomSheet, Dialog): returning focus after an overlay closes no longer scrolls the page (#10022)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。归还焦点用 preventScroll，关闭浮层不再滚动页面，补测试
- [x] [`7b71d71b4`](https://github.com/meta/astryx/commit/7b71d71b4) feat(List): a row's touch target grows toward 44 px where its neighbors leave room (#8085)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。InfoTip 的按钮改用共用的触控热区，点击区域朝 44px 长并在邻居间距一半处停住，替换写死的 12px 外扩；List 部分归别的族
- [x] [`a866c2ab0`](https://github.com/meta/astryx/commit/a866c2ab0) fix(Dialog, Drawer): a backdrop press that closes a popover inside closes only the popover (#9988)
  - Vue 版已有：useBackdropPress 配合 dismissStack 的 didOutsideDismissInGesture：同一次按压已关掉框里的弹出框时，对话框留着
- [x] [`4776d409b`](https://github.com/meta/astryx/commit/4776d409b) test(InfoTip): the audit reads a hit area only where its layer draws one (#10050)
  - 不适用：只改上游测试（自动初筛）
- [x] [`257573b22`](https://github.com/meta/astryx/commit/257573b22) docs(AST-094, AST-057): motion guidance; gesture springs; swipe-row returns (#9915)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`7d6481ef3`](https://github.com/meta/astryx/commit/7d6481ef3) feat(core): createPanGesture and usePanGesture report a drag as values (spec:AST-107 FR1, FR6) (#8655)
  - 暂缓：createPanGesture/usePanGesture 是手势引擎的一部分，归动效与手势引擎任务
- [x] [`af7037b4a`](https://github.com/meta/astryx/commit/af7037b4a) perf(Layer): LayerProvider loads no Toast; Toast registers its viewport (#10012)
  - 不适用：React 包体拆分（LayerProvider 不加载 Toast）；Vue 版 toast 是模块级 store，没有这条依赖
- [x] [`7e69f91dc`](https://github.com/meta/astryx/commit/7e69f91dc) fix(core): an anchored layer that would run under the software keyboard ends above it (#8208)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。浮层定位的视口扣掉屏幕键盘盖住的部分，键盘弹出时锚定浮层落在键盘上方，补用例
- [x] [`813c58c02`](https://github.com/meta/astryx/commit/813c58c02) fix(Toast): a toast plays its entrance once (#10086)
  - Vue 版已有：行和卡片的进场靠 toast.css 的 @starting-style，卡片 key 固定只插入一次，视口搬家时 rehosting 类关掉过渡
- [x] [`ddb8b3462`](https://github.com/meta/astryx/commit/ddb8b3462) feat(ButtonGroup): a finger's slide runs the button it lifts on (#8657)
  - 已移植：[#509](https://github.com/astryx-vue/astryx-vue/pull/509)。ButtonGroup 手指滑动在松手处执行（已有 PR）
- [x] [`0d436a195`](https://github.com/meta/astryx/commit/0d436a195) fix(ChatMessageList, Tooltip, HoverCard): the chat log and text trigger spans draw the shared focus ring (#8876)
  - 已移植：[#566](https://github.com/astryx-vue/astryx-vue/pull/566)。HoverCard 和 Tooltip 的文本触发器画共用的焦点环；ChatMessageList 的日志焦点环不在本批范围

### v0.7.10

- [x] [`c9c4932b3`](https://github.com/meta/astryx/commit/c9c4932b3) fix(Dialog): when the first autofocus request is ineligible, the next eligible one takes initial focus (#10105)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。初始焦点请求不可用（hidden、inert、禁用）时顺延给下一个，明确请求优先于标题的默认请求，补测试
- [x] [`dc6dadbb7`](https://github.com/meta/astryx/commit/dc6dadbb7) fix(Toast): a quick flick dismisses a toast of any height (#8047)
  - 已移植：[#564](https://github.com/astryx-vue/astryx-vue/pull/564)。下沿让开底部安全区（触屏至少 34px），没有提示时视口不占盒子；快速甩动关闭由 useToastGesture 的速度判定已覆盖
- [ ] [`09a9bf337`](https://github.com/meta/astryx/commit/09a9bf337) feat(core): UIScrollView zoom constants and the zoom stage geometry (#8147)
  - 暂缓：UIScrollView 缩放常量与缩放舞台几何，是触摸缩放、翻页、下拉关闭手势设施的底座，Vue 版灯箱只有按钮、键盘和双击缩放
- [x] [`6d8e4c309`](https://github.com/meta/astryx/commit/6d8e4c309) fix(Toast): a moved toast's card starts no transition (#10223)
  - Vue 版已有：搬进或搬出模态时视口加 rehosting 类关掉卡片过渡并等动画时长（toast.css、ToastViewport.vue）
- [ ] [`0c168a374`](https://github.com/meta/astryx/commit/0c168a374) feat(Lightbox): touch zoom like the iOS Photos viewer (#8148)
  - 暂缓：触摸缩放像 iOS 照片，依赖 09a9bf337 的缩放舞台
- [x] [`332cc3bef`](https://github.com/meta/astryx/commit/332cc3bef) chore(core): split two long comments in LayerProvider and ToastViewport (#10244)
  - 不适用：只拆分 React 源码里的长注释

### v0.7.11

- [x] [`9a8d14d6d`](https://github.com/meta/astryx/commit/9a8d14d6d) fix(Layer): toasts leave a closing modal in the commit that closes it (#10251)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`5e67f0874`](https://github.com/meta/astryx/commit/5e67f0874) feat(Popover): under a finger, it grows out of its trigger and shrinks back into it (#8187)
  - 暂缓：触摸下从触发器长出来再缩回去的动效，需要 surface 几何、帧和动效模块，Vue 版没有
- [x] [`bef866ece`](https://github.com/meta/astryx/commit/bef866ece) test(Popover): browser proofs of the touch presentation's grow and shrink (#9823)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e348759a9`](https://github.com/meta/astryx/commit/e348759a9) fix(core): a presentation resolves with no matchMedia, as in a test DOM (#10275)
  - 不适用：presentation 在没有 matchMedia 时的解析，Vue 版没有 presentation
- [x] [`74eb2160c`](https://github.com/meta/astryx/commit/74eb2160c) docs(layer-runtime, Popover): name settledBox's readers; fix comments (#10300)
  - 不适用：只改 settledBox 读者的文档和注释，Vue 版没有这个模块
- [x] [`4cfcf7c36`](https://github.com/meta/astryx/commit/4cfcf7c36) test(Lightbox): the spring zoom's check reads the zoom on its own clock (#10301)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1c142dc26`](https://github.com/meta/astryx/commit/1c142dc26) test(Toast): the entrance cases hold on a busy runner (#10268)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3bd5a4c1b`](https://github.com/meta/astryx/commit/3bd5a4c1b) fix(Layer): a still mouse presses through an entrance's input hold (#10303)
  - 不适用：只改上游测试（自动初筛）
- [x] [`d853ba008`](https://github.com/meta/astryx/commit/d853ba008) test(Lightbox): the spring-zoom check catches a spring 5 % off (#10323)
  - 不适用：只改上游测试（自动初筛）
- [x] [`39f244171`](https://github.com/meta/astryx/commit/39f244171) test(Popover): the rendering proof waits for the content to settle (#10326)
  - 不适用：只改上游测试（自动初筛）
- [x] [`d0d1f30ab`](https://github.com/meta/astryx/commit/d0d1f30ab) test(Popover): hold each short motion as it starts (#10331)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6943968c8`](https://github.com/meta/astryx/commit/6943968c8) test(Popover): the blocked-main-thread proof holds a 1 s block (#10332)
  - 不适用：只改上游测试（自动初筛）
- [x] [`dff58aef3`](https://github.com/meta/astryx/commit/dff58aef3) test(Lightbox): touch proofs read the photo without holding the lift (#10406)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)
  - 已移植：[#516](https://github.com/astryx-vue/astryx-vue/pull/516)。粗指针下按钮热区朝 44px 扩大
- [x] [`84a22545d`](https://github.com/meta/astryx/commit/84a22545d) test(Lightbox): the busy double-tap zoom proof plays at tempo 5 (#10415)
  - 不适用：只改上游测试（自动初筛）
- [x] [`28270c143`](https://github.com/meta/astryx/commit/28270c143) test(interaction-harness): an armed hold names the motion it judges (#10386)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8ba5bbcc3`](https://github.com/meta/astryx/commit/8ba5bbcc3) refactor(Layer): modals hand toasts back through a callback ref (#10351)
  - 不适用：React 回调 ref 交接；Vue 版模态用 modalOutlet 的 attach/detach 把视口搬进去

### v0.7.12

- [x] [`360701de7`](https://github.com/meta/astryx/commit/360701de7) fix(Text, Heading): the truncation tooltip mounts on the first hover, tap or focus (#10290)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。截断提示在第一次悬停、轻点或聚焦时才挂载
- [x] [`8a26f3efa`](https://github.com/meta/astryx/commit/8a26f3efa) test(Popover): the Save-note tap waits for the capped surface at rest (#10444)
  - 不适用：只改上游测试（自动初筛）
- [x] [`125795011`](https://github.com/meta/astryx/commit/125795011) test(Lightbox): the Reduce Motion +/- proof freezes on the fade's dip (#10446)
  - 不适用：只改上游测试（自动初筛）
- [x] [`55acf21ba`](https://github.com/meta/astryx/commit/55acf21ba) perf(Layer): read an entering layer's box without writing styles (#10240)
  - 不适用：只改上游测试（自动初筛）
- [x] [`57809dacf`](https://github.com/meta/astryx/commit/57809dacf) fix(HoverCard): refuse focus-open while controlled closed (#10181)
  - 已移植：[#566](https://github.com/astryx-vue/astryx-vue/pull/566)。受控 isOpen 为 false 时焦点也不再打开卡片，补测试和文档
- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0d7498a70`](https://github.com/meta/astryx/commit/0d7498a70) fix(Layer): a scroll started after the keyboard caps a layer is not undone (#10457)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [x] [`bd6df76da`](https://github.com/meta/astryx/commit/bd6df76da) fix(useFocusTrap): a modal's first and last Tab stops count a radio group once, as the browser does (#10304)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8f4ddc13f`](https://github.com/meta/astryx/commit/8f4ddc13f) test(Lightbox): the zoom proofs arm their holds before the gesture (#10480)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ec945c9cf`](https://github.com/meta/astryx/commit/ec945c9cf) test(Lightbox): the Reduce Motion fades arm their holds first (#10481)
  - 不适用：只改上游测试（自动初筛）
- [x] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
  - 不适用：React context 在多份模块拷贝间共享
- [x] [`ecafbacc8`](https://github.com/meta/astryx/commit/ecafbacc8) fix(Popover): a closed popover carries no dialog role or name (#10487)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。关着的 Popover 不带 dialog 角色和名称
- [x] [`23a184764`](https://github.com/meta/astryx/commit/23a184764) test(Lightbox): the coasting-photo landing stops the scene to land (#10466)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3890d68ef`](https://github.com/meta/astryx/commit/3890d68ef) fix(Layer): a capped layer over its trigger keeps its top (#10497)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0d433063c`](https://github.com/meta/astryx/commit/0d433063c) test(Popover): the entrance proof arms its hold before the tap (#10504)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a4eca1690`](https://github.com/meta/astryx/commit/a4eca1690) fix(Popover): a dialog popover starts focus on an enabled tab stop (#10503)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。dialog 型 Popover 的初始焦点落在第一个可用的 Tab 停靠点
- [x] [`a21cd3ca0`](https://github.com/meta/astryx/commit/a21cd3ca0) fix(Layer): a Tooltip re-picks its side once a scroll stops, never mid-scroll (#10439)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4b252590b`](https://github.com/meta/astryx/commit/4b252590b) test(Lightbox): the pinch trace and the return film wait out their races (#10506)
  - 不适用：只改上游测试（自动初筛）
- [x] [`33bc644a8`](https://github.com/meta/astryx/commit/33bc644a8) test(Lightbox): the trackpad edge stop sends its stream as one burst (#10560)
  - 不适用：只改上游测试（自动初筛）
- [x] [`def46d15d`](https://github.com/meta/astryx/commit/def46d15d) fix(Layer): a Tooltip scrolls by CSS, and nothing watches its trigger move (#10472)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`9dca38629`](https://github.com/meta/astryx/commit/9dca38629) perf(Layer): anchored entrances play on the surface (#10561)
  - 暂缓：锚定浮层入场动画改在 surface 上播放，依赖 5e67f0874 的 surface 动效模块
- [x] [`1c8292c42`](https://github.com/meta/astryx/commit/1c8292c42) fix(Layer): keep decorator portals outside renderer-managed DOM (#7633)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`88ba27908`](https://github.com/meta/astryx/commit/88ba27908) feat(Lightbox): swipe between gallery photos like Photos (#8197)
  - 暂缓：横滑翻页像 iOS 照片，依赖 09a9bf337 的缩放舞台
- [x] [`7432d40a7`](https://github.com/meta/astryx/commit/7432d40a7) test(Lightbox): the Reduce Motion plus-minus proof freezes on the key (#10609)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6422a1db4`](https://github.com/meta/astryx/commit/6422a1db4) refactor(Layer): one presentation hold keeps a layer's chosen presentation until its close settles (#8587)
  - 不适用：上游内部重构：一个呈现方式保持贯穿关闭，Vue 版没有 presentation
- [x] [`31dc63fd5`](https://github.com/meta/astryx/commit/31dc63fd5) docs(Lightbox): record the out-of-range index and the paged-away video (#10617)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`e07291680`](https://github.com/meta/astryx/commit/e07291680) fix(Dialog): a header that mounts with the opening commit takes focus only after the dialog is modal (#10408)
  - Vue 版已有：Vue 的 DialogHeader 挂载时不抢焦点，标题的 data-dialog-default-focus 在 showModal 之后才被 Dialog 聚焦
- [x] [`67446552b`](https://github.com/meta/astryx/commit/67446552b) test(Lightbox): the busy zoom proof judges the photo's top edge (#10648)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7bc8230f8`](https://github.com/meta/astryx/commit/7bc8230f8) fix(Button): a labelled button grows with its label (#10588)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1ffc0dac9`](https://github.com/meta/astryx/commit/1ffc0dac9) fix(BottomSheet): resting content starts below the grab bar, whatever the padding (#8558)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f0ede8b0c`](https://github.com/meta/astryx/commit/f0ede8b0c) docs(spec): DialogHeader records the open endContentEdge mapping question (#10566)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4043d65e5`](https://github.com/meta/astryx/commit/4043d65e5) feat(Lightbox): drag a photo down to close, like Photos (#8215)
  - 暂缓：下拉关闭像 iOS 照片，依赖 09a9bf337 的缩放舞台
- [x] [`4d513699b`](https://github.com/meta/astryx/commit/4d513699b) docs(specs): Popover records that it has no viewport-rectangle anchor (#10491)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`fb2437f61`](https://github.com/meta/astryx/commit/fb2437f61) fix(Lightbox): the drag to close plays at the theme's tempo (#10630)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`544442239`](https://github.com/meta/astryx/commit/544442239) fix(Button): at the default text size a labelled button renders exactly as before (#10678)
  - 不适用：只改上游测试（自动初筛）
- [x] [`db40c6b01`](https://github.com/meta/astryx/commit/db40c6b01) refactor(core): share per-instance warning dedupe and temporary focus targets (#10655)
  - 不适用：React 内部共享的单实例警告去重与临时焦点目标
- [x] [`17f6985ed`](https://github.com/meta/astryx/commit/17f6985ed) fix(Layout): a full-bleed Table or List row takes the rounded container corner it reaches (#10586)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。对话框内容区发布圆角给贴边的表格和列表行，全屏对话框为直角，补测试
- [x] [`a28d586eb`](https://github.com/meta/astryx/commit/a28d586eb) feat(core): createReorderable makes List rows reorderable (#8139)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`48c480b60`](https://github.com/meta/astryx/commit/48c480b60) fix(Tooltip): a held-closed tooltip reports keyboard focus without opening (#10490)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。isOpen 为 false 时本该打开的焦点只发出 openChange(true) 并不显示，补用例和文档
- [x] [`4d3ec24c3`](https://github.com/meta/astryx/commit/4d3ec24c3) fix(Lightbox): a NaN or fractional index opens the nearest item (#10632)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。NaN 或小数下标取最近一项
- [x] [`b207e607a`](https://github.com/meta/astryx/commit/b207e607a) fix(Timestamp): attach popup semantics to the focusable time (#6298)
  - 不适用：Timestamp 的 React 实现与 mergeIds 抽出；Vue 版 mergeIds 早已在 hoverCardTrigger.ts
- [x] [`c096afe1c`](https://github.com/meta/astryx/commit/c096afe1c) test(interaction-harness): a starved busy proof fails by name (#10565)
  - 不适用：只改上游测试（自动初筛）
- [x] [`aa31eab11`](https://github.com/meta/astryx/commit/aa31eab11) fix(HoverCard): a labelled card puts aria-haspopup only on a trigger whose role supports it (#10733)
  - Vue 版已有：hoverCardTrigger.ts 的 supportsAriaExpanded 和触发器绑定只在支持该角色的触发器上写 aria-expanded
- [x] [`a04d2e6bf`](https://github.com/meta/astryx/commit/a04d2e6bf) fix(Toast): the viewport is each toast's only announcement owner (#7871)
  - Vue 版已有：视口里每张卡片自带 role=status/alert 并随正文变化播报，没有第二条播报通道，模态里视口被搬进对话框后仍在其中
- [ ] [`5a907b8ba`](https://github.com/meta/astryx/commit/5a907b8ba) perf(Popover): the touch growth plays on the surface (#10717)
  - 暂缓：触摸长出动效改在 surface 上播放，依赖 5e67f0874 的 surface 动效模块
- [ ] [`b1a6f16c6`](https://github.com/meta/astryx/commit/b1a6f16c6) fix(Drawer): a non-modal drawer that unmounts while open returns focus to its opener (#9672)
  - 暂缓：非模态 Drawer 卸载时的焦点归还，Vue 的 Drawer 只有模态，需先做非模态形态
- [x] [`b01b7ee1c`](https://github.com/meta/astryx/commit/b01b7ee1c) fix(HoverCard): Escape and focus work in the card's own document, such as an iframe (#9592)
  - Vue 版已有：layer/dismissStack.ts 按层所在文档登记监听，触摸关闭和焦点判断读触发器的 ownerDocument
- [x] [`9771949e0`](https://github.com/meta/astryx/commit/9771949e0) test(Lightbox): the dismissal's busy proof blocks as the fade starts (#10719)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b6509b179`](https://github.com/meta/astryx/commit/b6509b179) fix(Popover): the touch growth shows its content from its first frame (#10757)
  - 暂缓：触摸长出动效从第一帧就显示内容，依赖 5e67f0874 的 surface 动效模块
- [x] [`7fefc8a66`](https://github.com/meta/astryx/commit/7fefc8a66) fix(Dialog): capture the opener only on the closed-to-open edge (#5642)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。打开者取对话框所在文档里持有焦点的元素；只在关到开的那一下记录由 openDialog 的 dialog.open 守卫保证
- [x] [`14f038ca3`](https://github.com/meta/astryx/commit/14f038ca3) test(core): the Dialog barrel's cold import loads before the case (#10762)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f26d16d1b`](https://github.com/meta/astryx/commit/f26d16d1b) test(Lightbox): the slowed-settle self-test times three settles (#10749)
  - 不适用：只改上游测试（自动初筛）
- [x] [`553e65e5b`](https://github.com/meta/astryx/commit/553e65e5b) test(Lightbox): hold the Reduce Motion dismissal's fade as it starts (#10729)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b77be44be`](https://github.com/meta/astryx/commit/b77be44be) test(Lightbox): the cancel's busy proof blocks as the return starts (#10761)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5c336a54b`](https://github.com/meta/astryx/commit/5c336a54b) test(interaction-harness): a busy proof names a frame it cannot judge (#10765)
  - 不适用：只改上游测试（自动初筛）
- [x] [`738919b23`](https://github.com/meta/astryx/commit/738919b23) test(Lightbox): the busy page-settle pool fails by name when too slow (#10770)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5797bbf9e`](https://github.com/meta/astryx/commit/5797bbf9e) test: three busy proofs decode each cast once (#10786)
  - 不适用：只改上游测试（自动初筛）
- [x] [`117bc6ead`](https://github.com/meta/astryx/commit/117bc6ead) [Component Audit] Lightbox: screen readers hear the open viewer, and 0 resets the zoom (#10775)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。打开时读屏播报，0 回到适应大小
- [x] [`78ac0b132`](https://github.com/meta/astryx/commit/78ac0b132) docs(records): LayoutPanel publishes its applied inset; Lightbox's gaps for 0, announcements and Tab are closed (#10819)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`86fcdd3f0`](https://github.com/meta/astryx/commit/86fcdd3f0) test(interaction-harness): a busy proof judges each predicted move (#10812)
  - 不适用：只改上游测试（自动初筛）
- [x] [`168d9979b`](https://github.com/meta/astryx/commit/168d9979b) test(Lightbox): the slowed-settle calibration pools its three settles (#10855)
  - 不适用：只改上游测试（自动初筛）
- [x] [`00c1b374b`](https://github.com/meta/astryx/commit/00c1b374b) fix(Toast): useToast's fallback warning and SSR error name only LayerProvider (#10875)
  - 不适用：React 回退视口的警告和 SSR 报错文案；Vue 版没有回退视口
- [x] [`438a0ff88`](https://github.com/meta/astryx/commit/438a0ff88) docs(layer-runtime, HoverCard): a trigger inside SVG foreignObject cannot be a CSS anchor in Chromium (#10908)
  - 不适用：CSS 锚点在 SVG foreignObject 里失效；Vue 版浮层用 getBoundingClientRect 定位，不依赖 CSS 锚点
- [x] [`3c828cb09`](https://github.com/meta/astryx/commit/3c828cb09) test(Lightbox): a coast landing frozen late fails by name (#10844)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a1fda63c7`](https://github.com/meta/astryx/commit/a1fda63c7) fix(core): typing in a touch dialog's field no longer opens the trigger's tooltip on returned focus (#10639)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [ ] [`0b39dd9e6`](https://github.com/meta/astryx/commit/0b39dd9e6) feat(BaseTypeahead, Typeahead): a menu config with listbox and dialog roles, and an open handle (#10544)
  - 暂缓：BaseTypeahead 与 Typeahead 的 menu 配置（listbox、dialog 角色和 open/close 句柄）是选择器族的新公开接口，Vue 版 Typeahead 没有也不基于 usePopover，需在选择器族单独设计

### v0.7.13

- [x] [`dd17e043c`](https://github.com/meta/astryx/commit/dd17e043c) test(Lightbox): drag and paging proofs judge or fail by name under load (#10961)
  - 不适用：只改上游测试（自动初筛）
- [x] [`37657049d`](https://github.com/meta/astryx/commit/37657049d) test(ToastViewport): read the page entrance's start from its transition (#10967)
  - 不适用：只改上游测试（自动初筛）

### v0.7.14

- [x] [`0b8549059`](https://github.com/meta/astryx/commit/0b8549059) test(interaction-harness): name a double tap the page read as two taps (#10916)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8a8710cb3`](https://github.com/meta/astryx/commit/8a8710cb3) test: three Switch and Tooltip marker reads decode their frames once (#11074)
  - 不适用：只改上游测试（自动初筛）
- [x] [`19eadab60`](https://github.com/meta/astryx/commit/19eadab60) feat(Layer): an entrance slides from the side its layer lands on (#10771)
  - Vue 版已有：Popover.vue 的 data-placement 取翻转后的方位，popover.css 按它选入场方向，从落脚的那一侧滑入
- [x] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
  - 不适用：React Server Components 的 'use client' 指令
- [x] [`09479d9c7`](https://github.com/meta/astryx/commit/09479d9c7) fix(Popover): a touch that pans is not an outside press, even without pointercancel (#11038)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。触摸在层外按下后抬起才关，拖动超过平移距离或被取消就不关；鼠标和笔仍按下即关，补用例
- [x] [`9a3f29608`](https://github.com/meta/astryx/commit/9a3f29608) fix(useKeyboardHint): the arrow-key hint stays until dismissed, and Escape closes it (#10564)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`04a0e6c11`](https://github.com/meta/astryx/commit/04a0e6c11) fix(core): toast ids are one sequence across swizzled copies (AST-110 FR3) (#11092)
  - 不适用：多份拷贝（swizzle）共享 id 序列；Vue 版只有一份 store
- [x] [`4837d256c`](https://github.com/meta/astryx/commit/4837d256c) fix(core): toasts without a LayerProvider share one fallback stack across swizzled copies (AST-110 FR3) (#11161)
  - 不适用：多份拷贝（swizzle）共享回退栈；Vue 版没有回退栈
- [x] [`29f6996bf`](https://github.com/meta/astryx/commit/29f6996bf) fix(Lightbox): stop a playing video when the viewer closes (#10692)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。关闭时停播正在播的视频
- [x] [`4245f384a`](https://github.com/meta/astryx/commit/4245f384a) fix(Popover): focus entry takes the first content control in document order (#11177)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）

### v0.7.15

- [x] [`16d7f397a`](https://github.com/meta/astryx/commit/16d7f397a) fix(focus region): leave Ctrl+Tab and Meta+Tab to the page (#11247)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a8c985322`](https://github.com/meta/astryx/commit/a8c985322) fix(Drawer): keep the exit side in state, not a render-time ref (#10859)
  - 暂缓：Drawer 退场时保持滑出的一侧，Vue 的 Drawer 没有退场滑出（presence），归动效与手势引擎任务
- [x] [`38521acb9`](https://github.com/meta/astryx/commit/38521acb9) chore(core): remove the same-press leftovers: an unread dismissal field and stale comments (#11332)
  - 不适用：只改上游测试（自动初筛）
- [x] [`eec79323c`](https://github.com/meta/astryx/commit/eec79323c) fix(Text, Tooltip): on Android, the first tap on a button or link in truncated text opens its tooltip; a tap on a text field never does (#11213)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。只认 :focus-visible 焦点，轻点文本框不开关提示
- [x] [`98e3d9846`](https://github.com/meta/astryx/commit/98e3d9846) fix(ToastViewport): sync its committed list at commit (#10902)
  - 不适用：React 在 commit 时同步已提交列表的 ref；Vue 版直接读响应式 store

### v0.7.16

- [x] [`2f2ccc79d`](https://github.com/meta/astryx/commit/2f2ccc79d) fix(lab): a TourStep points at any element and leaves the page usable (#11123)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`50beab961`](https://github.com/meta/astryx/commit/50beab961) fix(core): pass host data-* attributes to the component's own element (#11406)
  - Vue 版已有：InfoTip 把 data-* 和 class 放到按钮上，InfoTip.test 有用例
- [x] [`b300313cb`](https://github.com/meta/astryx/commit/b300313cb) feat(Lightbox): a gallery's caption sits in a two-line band (#9810)
  - 已移植：[#507](https://github.com/astryx-vue/astryx-vue/pull/507)。图集图注占两行区域，可展开收起
- [x] [`cfc431d7a`](https://github.com/meta/astryx/commit/cfc431d7a) fix(layer): a release does not dismiss the layer it opened (#11258)
  - Vue 版已有：dismissStack 用按压编号，按下那一次登记的层不会被这次按压自己关掉；Vue 不靠原生 popover 的松手关闭
- [x] [`1d48cc5e9`](https://github.com/meta/astryx/commit/1d48cc5e9) fix(useTouchTrigger): sync its callback refs at commit (#10892)
  - 不适用：React 回调 ref 在提交时同步的问题，Vue 没有这类 ref 时序
- [ ] [`e372e3979`](https://github.com/meta/astryx/commit/e372e3979) fix(Popover): touch growth starts where the popover meets its trigger (#10949)
  - 暂缓：触摸长出动效从触发器与浮层交界处起步，依赖 5e67f0874 的 surface 动效模块
- [x] [`d6caddef6`](https://github.com/meta/astryx/commit/d6caddef6) fix(Lightbox): a single photo's caption sits on the caption's backing (#10284)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。单张照片的图注坐在图注底色上
- [x] [`1c0d390e4`](https://github.com/meta/astryx/commit/1c0d390e4) fix(Lightbox): a mouse click beside the shown photo closes the viewer (#11354)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。点照片旁边的空白关闭灯箱
- [x] [`12a96e4eb`](https://github.com/meta/astryx/commit/12a96e4eb) fix(Toast): announce rendered message text (#11175)
  - Vue 版已有：卡片的 live 区域读渲染后的 DOM 文字，正文是组件时同样会读到
- [x] [`9bdbcb16f`](https://github.com/meta/astryx/commit/9bdbcb16f) fix(Button, Popover, Dialog): keep an edge in forced-colors mode (#7677)
  - 已移植：[#504](https://github.com/astryx-vue/astryx-vue/pull/504)。强制配色下危险按钮、Popover、菜单、Dialog 的边补齐
- [x] [`fef050d2f`](https://github.com/meta/astryx/commit/fef050d2f) docs(Toast): narrow the announcement gap to a body with text of its own (#11523)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.17

- [x] [`670492d24`](https://github.com/meta/astryx/commit/670492d24) test(Lightbox): run the keyboard and viewport specs on Lightbox changes (#11524)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a5c21f021`](https://github.com/meta/astryx/commit/a5c21f021) docs(storybook): stories use bundled sample images, not a remote photo host (#11614)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`335a17298`](https://github.com/meta/astryx/commit/335a17298) fix(core): Toast picks its text side from the theme's surface before it measures (#11752)
  - 暂缓：Toast 测量前按主题 token 里的反色底预判文字深浅；Vue 有 parseColor 和 pickMediaMode 可做，归 theme-system 批次连同 8c52e3bba 一起做
- [ ] [`4800d992e`](https://github.com/meta/astryx/commit/4800d992e) feat(AlertDialog): touch motion on the theme's timing (#8373)
  - 暂缓：AlertDialog 触屏动效读主题时长，依赖触屏呈现（presentation）与进场动效基础设施
- [x] [`67379ec52`](https://github.com/meta/astryx/commit/67379ec52) fix(Popover): usePopover keeps its focus-return target when show() reruns (#11682)
  - Vue 版已有：usePopover 只在 isOpen 由关变开时记录焦点归还目标，show() 重复调用不会重记
- [x] [`5628141f5`](https://github.com/meta/astryx/commit/5628141f5) fix(Lightbox): a caption ending in a wide image no longer grows when the window widens (#11740)
  - 不适用：上游为「收起」按钮用浮动占位并反复度量，Vue 版图注是纯文本加独立按钮，不存在宽图结尾让图注越长越高的循环
- [x] [`cb2558efd`](https://github.com/meta/astryx/commit/cb2558efd) fix(core): Tooltip paints the theme's inverted surface, as Toast does (#11788)
  - Vue 版已有：tooltip.css 读 --astryx-tooltip-background 和 foreground，各主题包把它们设为反色面
- [x] [`5a24fc0cf`](https://github.com/meta/astryx/commit/5a24fc0cf) fix(DropdownMenu): a waiting open still takes focus and fires onClick (#11905)
  - 不适用：菜单行在松手时才显示的浮层仍要聚焦并触发 onClick；Vue 版没有延后到松手才显示的机制
- [x] [`ce0feb506`](https://github.com/meta/astryx/commit/ce0feb506) fix(core): a Table bleeds to a block edge only as its container's direct first or last child (#12068)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`34e3d212f`](https://github.com/meta/astryx/commit/34e3d212f) fix(core): dialog text reads the theme, and toast text reaches AA on its card (#12095)
  - Vue 版已有：dialog.css 的文字色读 --astryx-dialog-foreground，各主题映射到主文字色，Drawer 复用 Dialog；Toast 底色与文字色由主题变量给出
- [x] [`ca21c6d10`](https://github.com/meta/astryx/commit/ca21c6d10) docs(core): Dialog names its one nesting exception, an alert that confirms a destructive action (#12080)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。Dialog 文档（中英）写明嵌套的唯一例外是确认破坏性操作的 AlertDialog
- [x] [`120629d82`](https://github.com/meta/astryx/commit/120629d82) fix(DropdownMenu): a mouse press opens a menu in another document (#11938)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`08c8f842c`](https://github.com/meta/astryx/commit/08c8f842c) feat(core): a Button shows its full label in a tooltip when the label is cut short (#12169)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。Button 标签被截短时键盘聚焦显示完整标签
- [x] [`248e91d38`](https://github.com/meta/astryx/commit/248e91d38) test(AlertDialog): the busy-thread motion proof tells a slow alert from a frozen one (#11927)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a914dc097`](https://github.com/meta/astryx/commit/a914dc097) fix(Dialog, Drawer): the header row contains its title and controls (#12588)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。DialogHeader（含 DrawerHeader）的标题行罩得住标题和控件，补测试
- [x] [`6ff24e4e5`](https://github.com/meta/astryx/commit/6ff24e4e5) docs(Table, useToast): row open, selection, plugin, empty-state and toast-option answers (#12344)
  - Vue 版已有：apps/docs 的 use-toast 页面已列全部选项、默认值和 uniqueID 去重说明
- [x] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
  - 已移植：[#506](https://github.com/astryx-vue/astryx-vue/pull/506)。组件内部部位的主题挂点
- [x] [`eabfea653`](https://github.com/meta/astryx/commit/eabfea653) test(AlertDialog): the busy-main-thread proof reads the alert's own fade, which has no stationary point (#12523)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0ee09130b`](https://github.com/meta/astryx/commit/0ee09130b) fix(Lightbox): an open caption shrinks without a forced layout (#11539)
  - 不适用：同 5628141f5，Vue 版图注缩短不靠浮动占位的强制布局度量
- [x] [`3deff9de7`](https://github.com/meta/astryx/commit/3deff9de7) feat(core): theme seams for the spinner, tree disclosure, number steppers and close buttons (#12156)
  - Vue 版已有：Toast 关闭按钮带 .astryx-toast__close 类，图标 color=inherit 随卡片文字色
- [x] [`89a1613dc`](https://github.com/meta/astryx/commit/89a1613dc) fix(Dialog): an initial-focus request inside a closed nested dialog is that dialog's, not the opening one's (#11203)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。初始焦点请求属于离它最近的对话框，嵌套子对话框里的请求不算，补测试
- [x] [`0c52d0454`](https://github.com/meta/astryx/commit/0c52d0454) docs(spec): AST-116 Popover anchoring, modality and layer focus return (draft) (#11112)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`8c52e3bba`](https://github.com/meta/astryx/commit/8c52e3bba) chore: land batch 7 (3 pull requests) (#12811)
  - 暂缓：系统深色模式下 toast 首帧文字与底色同色（约 1.1:1），上游在主题规则里写出深色页的一侧；需要主题规则生成配合，归 theme-system 批次
- [x] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。批次里与本族相关的是 #12751：LayoutContent 也带 data-container，主题可把对话框正文与页眉页脚分开；Toast 属性文档 Vue 版已全；其余 PR 属 CLI 与别的组件
- [x] [`9e445ba0d`](https://github.com/meta/astryx/commit/9e445ba0d) chore: land batch 15 (5 pull requests) (#12859)
  - 不适用：文档说明 useToast 无需 provider、自动挂载回退视口，这是 React 的回退机制；Vue 版需要渲染一次 ToastViewport，文档已如此写
- [x] [`4c309698d`](https://github.com/meta/astryx/commit/4c309698d) chore: land batch 22 (2 pull requests) (#12877)
  - 不适用：React 回退视口里的 CallerTheme；Vue 版没有回退视口
- [x] [`5e0d52c7c`](https://github.com/meta/astryx/commit/5e0d52c7c) test(AlertDialog): the turn-back proof still closes mid-entrance under load (#12858)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7efbb4e57`](https://github.com/meta/astryx/commit/7efbb4e57) fix(Toast): a Toast rendered on its own holds no live role (#11960)
  - 已移植：[#564](https://github.com/astryx-vue/astryx-vue/pull/564)。单独渲染的 Toast 不带 live 角色，只有视口里的卡片是 live 区域，补测试
- [x] [`20c9b4b18`](https://github.com/meta/astryx/commit/20c9b4b18) docs(spec): AST-119 Tour steps as data (#11324)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`476d9063f`](https://github.com/meta/astryx/commit/476d9063f) chore: land batch 63 (3 pull requests) (#12945)
  - 已移植：[#565](https://github.com/astryx-vue/astryx-vue/pull/565)。对话框把圆角发布给贴边子元素（同 #17f6985ed）；上游的逐角主题变量体系 Vue 版没有，只做单一圆角
- [x] [`42190cea6`](https://github.com/meta/astryx/commit/42190cea6) fix(Tooltip): script focus after a pointer press opens no tooltip on a non-text trigger (#11782)
  - 已移植：[#542](https://github.com/astryx-vue/astryx-vue/pull/542)。鼠标按下之后脚本挪来的焦点，非文本触发器不开提示，文本框照常打开，补用例
- [x] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
  - Vue 版已有：批次里与本族相关的是 #12307 触发器越出视口时浮层留在屏内：position.ts 对部分越界的锚点照常夹紧，完全在视口外才跟随锚点；其余三个 PR 属 CLI 与主题
- [x] [`0dad34541`](https://github.com/meta/astryx/commit/0dad34541) feat(usePopover): anchorRef names an anchor apart from the trigger (spec:AST-116 FR1–FR3, FR5, FR6) (#11117)
  - Vue 版已有：usePopover 返回 anchorRef，Popover 的 anchor 属性与触发器分开，焦点归还也认它
- [x] [`416b167cf`](https://github.com/meta/astryx/commit/416b167cf) fix(core): one focus return for Popover and DropdownMenu (popover presentation) and Dialog that never strands focus (AST-116 FR17–FR21, AR1) (#11121)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。Popover 与 Dialog 共用一套焦点归还，焦点不会掉到 body
- [x] [`773107aad`](https://github.com/meta/astryx/commit/773107aad) spec(popover): isModal keeps its released meaning, and usePopover takes tabBehavior (AST-116) (#13015)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ecfdfc354`](https://github.com/meta/astryx/commit/ecfdfc354) fix(Popover): a closed trigger names no popup in aria-controls (#13035)
  - 已移植：[#541](https://github.com/astryx-vue/astryx-vue/pull/541)。关着的触发器不写 aria-controls
- [x] [`4fd75f4ba`](https://github.com/meta/astryx/commit/4fd75f4ba) fix(Dialog): a DialogHeader that mounts after the dialog opens names it (#11828)
  - Vue 版已有：DialogHeader 的标题挂载和卸载时通过 registerTitle 响应式地给对话框命名

## 发布与包说明（area:release）

### v0.7.2

- [x] [`2e0f31c65`](https://github.com/meta/astryx/commit/2e0f31c65) spec(AST-017): each non-component surface defines what breaks; AST-017 owns the release process (#7608)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d52db364d`](https://github.com/meta/astryx/commit/d52db364d) [Release] Exempt translations from Changeset coverage (#7644)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a44ebd55a`](https://github.com/meta/astryx/commit/a44ebd55a) feat(cli): install once, run anywhere — every copy hands a project's run to the release its Core matches (#7649)

### v0.7.5

- [x] [`55d19f33f`](https://github.com/meta/astryx/commit/55d19f33f) spec(AST-017): touch behavior is a default callers can override with presentation (#8273)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3a1e95ac8`](https://github.com/meta/astryx/commit/3a1e95ac8) spec(AST-017): touch work changes desktop behavior only for a defect or deliberate consistency (#8347)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ebfae1a3d`](https://github.com/meta/astryx/commit/ebfae1a3d) spec(architecture): components are built from minimal DOM (#8300)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7e855c0d6`](https://github.com/meta/astryx/commit/7e855c0d6) spec(AST-017): no file path or subpath makes an API experimental (#8357)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4334f30c5`](https://github.com/meta/astryx/commit/4334f30c5) spec(AST-017): the experimental name marking is a suffix (#8428)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`67dc45f66`](https://github.com/meta/astryx/commit/67dc45f66) spec: an open layer may render up to 5 more elements under touch, with no new anatomy (#8439)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [x] [`c115ceeea`](https://github.com/meta/astryx/commit/c115ceeea) architecture: touch behavior comes from shared internal modules; Core and Lab reach them through ./internal/* (INV13) (#8464)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)

### v0.7.6

- [x] [`e4b225eb5`](https://github.com/meta/astryx/commit/e4b225eb5) fix(NumberInput): hide compact steppers on coarse pointers (#8015)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.9

- [x] [`73a105d11`](https://github.com/meta/astryx/commit/73a105d11) docs(specs): canaries publish at most once an hour from main's tip, a frequency cap only, and on demand (AST-017 FR46, DEC-31) (#9660)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.12

- [ ] [`3bbab18c8`](https://github.com/meta/astryx/commit/3bbab18c8) Align Theme Showcase with Astryx template conventions (#10404)
- [x] [`72968acd8`](https://github.com/meta/astryx/commit/72968acd8) fix(cli): swizzle carries another Astryx package's internal modules, except exported StyleX modules (#10595)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`3eeda1b1d`](https://github.com/meta/astryx/commit/3eeda1b1d) docs(tailwind): a recipe for an app that already uses Tailwind, and what a misplaced @layer line does (#10532)
- [x] [`18f7f84f0`](https://github.com/meta/astryx/commit/18f7f84f0) fix(release): admit proven test repairs (#10850)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`73c1a4917`](https://github.com/meta/astryx/commit/73c1a4917) fix: bound the final v0.7.12 policy carry (#10923)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.16

- [ ] [`77c3d25d7`](https://github.com/meta/astryx/commit/77c3d25d7) docs(themes): fix theme README usage examples for Theme provider (#11016)
- [x] [`6bf031ae9`](https://github.com/meta/astryx/commit/6bf031ae9) docs(cli): help and docs point at the experimental theme editor for making and changing a theme (#11500)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.17

- [x] [`ab43756c9`](https://github.com/meta/astryx/commit/ab43756c9) experimental theme: fixes from the next edge-case round and blind theme-building runs (#11739)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c44a63778`](https://github.com/meta/astryx/commit/c44a63778) feat(cli): bases, first step — a run reads one base; steps it does not serve are hidden and refused (#11111)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2c80ffc20`](https://github.com/meta/astryx/commit/2c80ffc20) feat(cli): an installed icon-set package turns on the experimental icon features (one gate) (#12176)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4a8df8bca`](https://github.com/meta/astryx/commit/4a8df8bca) fix(cli): template help names only what the base serves (#12419)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bbf643a03`](https://github.com/meta/astryx/commit/bbf643a03) [experimental] cli: experimental render is now experimental export (#12302)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2750bc058`](https://github.com/meta/astryx/commit/2750bc058) [experimental] cli: astryx experimental import turns an exported file back into its page (#12381)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ce3eb6270`](https://github.com/meta/astryx/commit/ce3eb6270) [experimental] cli: discover lists icon packs before an app picks one (#12220)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`daf5e2cb3`](https://github.com/meta/astryx/commit/daf5e2cb3) chore: land batch 3 (13 pull requests) (#12722)
- [ ] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
- [x] [`a8001d84f`](https://github.com/meta/astryx/commit/a8001d84f) chore: land batch 44 (1 pull requests) (#12919)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`59fd4151b`](https://github.com/meta/astryx/commit/59fd4151b) chore: land batch 82 (7 pull requests) (#12992)
- [x] [`d8ed55621`](https://github.com/meta/astryx/commit/d8ed55621) spec(AST-017): Charts may import Core's internal subpaths (#12779)
  - 不适用：上游内部规范和架构文档（自动初筛）

## 升级指南与版本说明（area:docs）

### v0.7.2

- [x] [`c9f265949`](https://github.com/meta/astryx/commit/c9f265949) docs(spec): Core hydrates to the server markup; entry animation starts after hydration (#7621)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.5

- [x] [`23de0923e`](https://github.com/meta/astryx/commit/23de0923e) spec(AST-094): touch presentations feel native by default (#8409)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)

### v0.7.6

- [x] [`16b95934f`](https://github.com/meta/astryx/commit/16b95934f) fix(Dialog, Drawer, BottomSheet): an overlay open on the server renders closed until hydration (#9360)
  - 不适用：上游内部规范和架构文档（自动初筛）

## 基础重置样式（area:core）

### v0.7.2

- [ ] [`d3ec0b25c`](https://github.com/meta/astryx/commit/d3ec0b25c) fix(AspectRatio): fit fills the box on the documented Tailwind setups (#7521)
- [ ] [`1a2f1dc05`](https://github.com/meta/astryx/commit/1a2f1dc05) feat(core): the dropdown marker of a field with a list sits in its middle (#7526)

### v0.7.5

- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.17

- [ ] [`f6584cd42`](https://github.com/meta/astryx/commit/f6584cd42) fix(core): text in the page body no longer falls back to the browser's serif font (#11794)
- [x] [`dda98593d`](https://github.com/meta/astryx/commit/dda98593d) fix(core): the switch thumb stays round, and inherited text takes the theme's body size (#12236)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8688c1885`](https://github.com/meta/astryx/commit/8688c1885) chore: land batch 6 (11 pull requests) (#12812)
- [ ] [`6c12793c1`](https://github.com/meta/astryx/commit/6c12793c1) chore: land batch 41 (1 pull requests) (#12916)

## 富文本编辑器（area:richtext）

### v0.7.2

- [ ] [`bf9132726`](https://github.com/meta/astryx/commit/bf9132726) fix(richtext): document the four RichTextEditor props its doc file omitted (#7610)
- [x] [`ccf1a1cfc`](https://github.com/meta/astryx/commit/ccf1a1cfc) spec(AST-080): prebuilt stylesheets stay the default; a source build compiles the same way (#7624)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1279007eb`](https://github.com/meta/astryx/commit/1279007eb) test(richtext): give the playground an image plugin (#7579)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`962800ced`](https://github.com/meta/astryx/commit/962800ced) feat(Markdown): tables draw a line on every cell edge (#7576)

### v0.7.3

- [x] [`b1e1936bb`](https://github.com/meta/astryx/commit/b1e1936bb) fix(core): provide dataVars defaults in prebuilt CSS (#7694)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.5

- [x] [`f574bd001`](https://github.com/meta/astryx/commit/f574bd001) spec(AST-080): every PR reports component size; touch-only JS and CSS have a budget (#8271)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`c19b5e326`](https://github.com/meta/astryx/commit/c19b5e326) fix(CodeBlock): the headerless Copy button never covers code (#8101)
- [x] [`01e47f5d0`](https://github.com/meta/astryx/commit/01e47f5d0) feat(CodeBlock): endContent places caller controls beside Copy (#8285)
  - 不适用：只改上游测试（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b7ea471a8`](https://github.com/meta/astryx/commit/b7ea471a8) ci: match audit titles without case; scope the parity specs to Rich Text source (#8416)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [ ] [`fabf5e699`](https://github.com/meta/astryx/commit/fabf5e699) feat(Markdown, RichText, DiffViewer): codeLanguages lists CodeBlock language values (#8489)
- [x] [`c115ceeea`](https://github.com/meta/astryx/commit/c115ceeea) architecture: touch behavior comes from shared internal modules; Core and Lab reach them through ./internal/* (INV13) (#8464)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
- [x] [`76cd3b89e`](https://github.com/meta/astryx/commit/76cd3b89e) fix(List): keep numbered markers whole and sibling text aligned (#7650)
  - 不适用：只改上游测试（自动初筛）

### v0.7.6

- [x] [`7251c0424`](https://github.com/meta/astryx/commit/7251c0424) test(richtext): the code block header tests wait for the copy button's tooltip (#8569)
  - 不适用：只改上游测试（自动初筛）
- [x] [`13412a4df`](https://github.com/meta/astryx/commit/13412a4df) ci: each published package commits a generated public API report, with advisory API changes for the PR report (#9241)
  - 不适用：上游 API 报告（自动初筛）
- [ ] [`8f345cba4`](https://github.com/meta/astryx/commit/8f345cba4) feat(FieldStatus): deprecate the tooltip variant; field controls keep statusVariant="tooltip" (#9196)
- [ ] [`66d66876e`](https://github.com/meta/astryx/commit/66d66876e) fix(richtext): toolbar slots use isRenderable; the nullish-guard baseline is deleted (#9265)
- [x] [`cdc5ec0c7`](https://github.com/meta/astryx/commit/cdc5ec0c7) test(richtext): the table-selection mark contract runs one test per theme and mode (#9321)
  - 不适用：只改上游测试（自动初筛）
- [x] [`2ad112af2`](https://github.com/meta/astryx/commit/2ad112af2) chore(api-report): regenerate the core and richtext API reports (#9344)
  - 不适用：上游 API 报告（自动初筛）
- [x] [`0941aba9e`](https://github.com/meta/astryx/commit/0941aba9e) spec(AST-080): source builds under webpack and Turbopack for every styled package (#9405)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.7

- [ ] [`540e9dfdf`](https://github.com/meta/astryx/commit/540e9dfdf) perf(richtext): code highlighting re-tokenizes only the lines an edit changes (#8585)
- [x] [`653624f84`](https://github.com/meta/astryx/commit/653624f84) feat(build): build Astryx from source under Turbopack (#7754)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1c7150d78`](https://github.com/meta/astryx/commit/1c7150d78) fix(RichTextEditorToolbar): Insert link with nothing selected inserts the link at the caret (#9668)

### v0.7.8

- [ ] [`a3976f623`](https://github.com/meta/astryx/commit/a3976f623) feat(richtext): Cmd+A selects the code block or table cell first (#8584)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [ ] [`626845fcc`](https://github.com/meta/astryx/commit/626845fcc) fix(richtext): RichTextExtensionNode is constructible with no arguments (#9690)

### v0.7.11

- [ ] [`d75edc130`](https://github.com/meta/astryx/commit/d75edc130) fix(richtext): an image's Markdown comes back as written through an edit (#10356)
- [ ] [`c5c1f5275`](https://github.com/meta/astryx/commit/c5c1f5275) fix(richtext): turn a code block into a paragraph on Backspace at its start (#8581)

### v0.7.12

- [x] [`c909db9ce`](https://github.com/meta/astryx/commit/c909db9ce) fix(build): a swizzled copy compiles in the library pass, below the theme (#10334)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a646669ab`](https://github.com/meta/astryx/commit/a646669ab) docs(richtext): RichTextView, RichTextEditorToolbar and RichTextEditorAutoLinkPlugin get their own doc files (#10407)
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b8cc3f41e`](https://github.com/meta/astryx/commit/b8cc3f41e) fix(Markdown): each prose block lays out in its own text's direction (#10293)
- [x] [`44b9aa57d`](https://github.com/meta/astryx/commit/44b9aa57d) fix(cli): swizzle marks its output folder so the copy compiles below the theme (#10483)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1c8292c42`](https://github.com/meta/astryx/commit/1c8292c42) fix(Layer): keep decorator portals outside renderer-managed DOM (#7633)
- [ ] [`47cad7412`](https://github.com/meta/astryx/commit/47cad7412) fix(richtext): paste rich content into a code block as plain text (#8580)
- [ ] [`619ffeb27`](https://github.com/meta/astryx/commit/619ffeb27) fix(core, richtext): no focus fade on text fields under a coarse pointer (#10611)
- [ ] [`1ff81c7a9`](https://github.com/meta/astryx/commit/1ff81c7a9) docs(richtext): in-place editing keeps the reading width, so the switch does not reflow (#10429)
- [ ] [`590d90164`](https://github.com/meta/astryx/commit/590d90164) fix(richtext): the auto-link plugin never links text inside a code block (#10664)
- [x] [`4962d932d`](https://github.com/meta/astryx/commit/4962d932d) spec(AST-062): a rich paste into a code block lands as plain text (#10417)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`e25a6dc2a`](https://github.com/meta/astryx/commit/e25a6dc2a) fix(richtext): links in a disabled editor do not navigate and add no tab stop (#10679)
- [ ] [`8fa403c98`](https://github.com/meta/astryx/commit/8fa403c98) feat(richtext): indent and outdent code block lines with Tab (#8579)

### v0.7.14

- [x] [`9f3cbd90d`](https://github.com/meta/astryx/commit/9f3cbd90d) chore: remove the committed API reports; the API delta comes from the build (#10957)
  - 不适用：上游 API 报告（自动初筛）
- [x] [`61b537db5`](https://github.com/meta/astryx/commit/61b537db5) docs(spec): RichText offers opt-in document affordances (AST-106) (#8576)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`eeeb90389`](https://github.com/meta/astryx/commit/eeeb90389) docs(spec): AST-106 DEC-4, the caret opens the link popover (#11185)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.15

- [ ] [`2e205e4d9`](https://github.com/meta/astryx/commit/2e205e4d9) fix(Link, richtext): linear-time email autolink matching (#11306)
- [ ] [`6ab0c2ea1`](https://github.com/meta/astryx/commit/6ab0c2ea1) fix(richtext): a table delimiter row check in linear time (#11338)

### v0.7.16

- [ ] [`31aacff05`](https://github.com/meta/astryx/commit/31aacff05) fix(richtext): pasting into table cells no longer drops content (#8577)
- [ ] [`d08000e44`](https://github.com/meta/astryx/commit/d08000e44) fix(richtext): default a scheme-less dotted or localhost host with a port to https (#11042)
- [ ] [`b8904791a`](https://github.com/meta/astryx/commit/b8904791a) feat(RichTextEditor, RichTextEditorToolbar): replace the toolbar's link dialog with an anchored popover (#8717)

### v0.7.17

- [ ] [`5c44304f9`](https://github.com/meta/astryx/commit/5c44304f9) refactor(richtext): share the toolbar's link popover and format helpers (#11189)
- [ ] [`4e39f9c64`](https://github.com/meta/astryx/commit/4e39f9c64) feat(richtext): Markdown shortcuts typed at the start of a list item re-mark it (#8582)
- [ ] [`7672da046`](https://github.com/meta/astryx/commit/7672da046) [fix] richtext: no integration-issue warning in apps that install it (#11628)
- [ ] [`8d3e0107b`](https://github.com/meta/astryx/commit/8d3e0107b) fix(richtext): a line break typed at the end of a block no longer reloads as a literal backslash (#11758)
- [x] [`e51ed92f6`](https://github.com/meta/astryx/commit/e51ed92f6) fix(Theme): a system Theme takes the page's color scheme, and Core's stylesheet sets the root to follow the reader (#12102)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e8c6cc05e`](https://github.com/meta/astryx/commit/e8c6cc05e) fix(Theme): the page root follows the reader only through reset.css, so Core's stylesheet leaves a host's scheme alone (#12247)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`2ff1afc9f`](https://github.com/meta/astryx/commit/2ff1afc9f) fix(richtext): text reads the way it is written, in either document direction (#7723)
- [ ] [`676f276f2`](https://github.com/meta/astryx/commit/676f276f2) docs(richtext): the README says what server rendering outputs (#12531)
- [ ] [`81458c4b1`](https://github.com/meta/astryx/commit/81458c4b1) chore: land batch 60 (4 pull requests) (#12939)

## 快捷搜索与命令面板（area:core）

### v0.7.2

- [ ] [`855cc9562`](https://github.com/meta/astryx/commit/855cc9562) fix(PowerSearch): clear all filters with one press (#6417)
- [ ] [`f986eb6f0`](https://github.com/meta/astryx/commit/f986eb6f0) [Component Audit] CommandPaletteInput: restore visible keyboard focus (#7682)
- [x] [`4d200b246`](https://github.com/meta/astryx/commit/4d200b246) [Component Audit] CommandPaletteItem: verify option states across themes (#7683)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
- [ ] [`be9a4c5d9`](https://github.com/meta/astryx/commit/be9a4c5d9) fix(PowerSearch): forward disabled state to built-in value editors (#7734)
- [ ] [`5720ad59f`](https://github.com/meta/astryx/commit/5720ad59f) fix(PowerSearch): keep token presses from opening search suggestions (#7739)

### v0.7.3

- [x] [`b7e33f1d0`](https://github.com/meta/astryx/commit/b7e33f1d0) refactor(cli): build and search answer through one shared dispatcher/searcher pattern (#7752)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`29ead9885`](https://github.com/meta/astryx/commit/29ead9885) fix(core): disabled links, tokens and cards stay focusable (#7842)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ef184a721`](https://github.com/meta/astryx/commit/ef184a721) fix(Selector): a disabled Selector trigger keeps its tab stop (#7844)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ea6860674`](https://github.com/meta/astryx/commit/ea6860674) build: pick the kit's blocks from search's own block results (#7832)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`296edaf9e`](https://github.com/meta/astryx/commit/296edaf9e) feat(cli): put the likely entry first in failed-lookup suggestions (#7876)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`6856cfa4e`](https://github.com/meta/astryx/commit/6856cfa4e) build: rank every block by what the request means, from its own docs (#7897)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.4

- [ ] [`eccc6eee0`](https://github.com/meta/astryx/commit/eccc6eee0) fix(CommandPalette): announce each busy start from inside its dialog (#7956)
- [ ] [`768c2f0f6`](https://github.com/meta/astryx/commit/768c2f0f6) [Component Audit] CommandPaletteItem: let themes style highlighted, selected, and disabled items (#7967)

### v0.7.5

- [ ] [`db7e94503`](https://github.com/meta/astryx/commit/db7e94503) fix(core): a search's busy start is never announced after its outcome (#8235)
- [x] [`2597fa4fb`](https://github.com/meta/astryx/commit/2597fa4fb) fix(Typeahead): highlight follows pointer movement, not a resting pointer (#8247)
  - 不适用：只改上游测试（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9600039ee`](https://github.com/meta/astryx/commit/9600039ee) [Component Audit] CommandPaletteEmpty: keep long empty messages readable inside the palette (#8516)
- [x] [`de36681d7`](https://github.com/meta/astryx/commit/de36681d7) docs(spec): PowerSearch records the experimental touch sheet presentation (DEC-3) (#8000)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`cf17cf2d6`](https://github.com/meta/astryx/commit/cf17cf2d6) fix(core): PowerSearch does not announce its initial resultCount under StrictMode (#8650)
- [x] [`ad427c274`](https://github.com/meta/astryx/commit/ad427c274) spec(AST-092): a typeahead shows local matches first, then merges remote results for the same query (#7960)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f3e48f197`](https://github.com/meta/astryx/commit/f3e48f197) test(CommandPalette): the lookup-work test finds its options without a visibility check per option (#8725)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：只改上游测试（自动初筛）

### v0.7.6

- [ ] [`3b0a56a02`](https://github.com/meta/astryx/commit/3b0a56a02) fix(Tokenizer, PowerSearch): Clear all is announced, once, in each component's own words (#9038)
- [ ] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
- [ ] [`8f345cba4`](https://github.com/meta/astryx/commit/8f345cba4) feat(FieldStatus): deprecate the tooltip variant; field controls keep statusVariant="tooltip" (#9196)
- [ ] [`0135af462`](https://github.com/meta/astryx/commit/0135af462) fix(core N–Z): slots use isRenderable; the remaining checks are allowed with a reason (#9206)
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`1408785fd`](https://github.com/meta/astryx/commit/1408785fd) fix(Typeahead, Tokenizer): a disabled field keeps its tab stop (#9275)
  - 不适用：只改上游测试（自动初筛）
- [x] [`27ccfe043`](https://github.com/meta/astryx/commit/27ccfe043) docs(spec): CommandPalette records its shipped contract as current (#9306)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
- [x] [`e64b41bfc`](https://github.com/meta/astryx/commit/e64b41bfc) spec(TextInput, TextArea, search, ChatComposer): touch keyboard props and return-key defaults (#9424)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
- [ ] [`3dec8e7d9`](https://github.com/meta/astryx/commit/3dec8e7d9) fix(CommandPalette): no 'Type to search' over a query you've typed while the first search loads (#9420)
- [ ] [`16fe5f199`](https://github.com/meta/astryx/commit/16fe5f199) fix(core): Table, Chat, CommandPalette and the date and time inputs carry only their own English (#9452)
- [x] [`9728cd78b`](https://github.com/meta/astryx/commit/9728cd78b) spec(react-component-runtime, TreeList, Table, CommandPalette): record empty slots rendering nothing (backfill) (#9388)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.7

- [ ] [`d0b6e0f77`](https://github.com/meta/astryx/commit/d0b6e0f77) feat(core): search fields ask a touch keyboard for its Search key and no autocorrection (#8157)
- [ ] [`7f1bace3c`](https://github.com/meta/astryx/commit/7f1bace3c) fix(PowerSearch): Backspace removes no filter of a read-only field (#9648)
- [ ] [`2c533501a`](https://github.com/meta/astryx/commit/2c533501a) fix(PowerSearch): Clear all keeps read-only filters (#9676)
- [x] [`65b7ab69e`](https://github.com/meta/astryx/commit/65b7ab69e) docs(spec): PowerSearch's sheet presentation follows the Lab touch flow (DEC-3) (#9631)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4f452f927`](https://github.com/meta/astryx/commit/4f452f927) feat(Tokenizer): the touch sheet presentation is public behind experimental.presentation, and the sheet edits a draft that Save commits (#9708)
- [x] [`b11e000b5`](https://github.com/meta/astryx/commit/b11e000b5) fix(Selector): a row that scrolls under a still mouse does not take the keyboard's highlight (#9671)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e68774f5b`](https://github.com/meta/astryx/commit/e68774f5b) fix(PowerSearch): name a filter token by its visible text and expose its editor (#9687)

### v0.7.8

- [ ] [`30160f5ce`](https://github.com/meta/astryx/commit/30160f5ce) feat(core): PowerSearch touch sheet flow behind experimental.presentation (#8001)
- [x] [`fa3295a50`](https://github.com/meta/astryx/commit/fa3295a50) fix(Spinner): the ring keeps turning while JavaScript runs (#8177)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3f39a18bf`](https://github.com/meta/astryx/commit/3f39a18bf) fix(Typeahead): a source replacement that React discards no longer leaves the field busy (#9713)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
- [x] [`252751794`](https://github.com/meta/astryx/commit/252751794) docs(spec): PowerSearch reads a date-only value as one day in one zone (DEC-5, FR25) (#9803)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [ ] [`40c6e418c`](https://github.com/meta/astryx/commit/40c6e418c) fix(core): PowerSearch reads a date-only value as one day in one zone, and edits it there (#9655)
- [ ] [`dcf3d6f86`](https://github.com/meta/astryx/commit/dcf3d6f86) feat(Tokenizer): presentation is a stable prop, and adaptive is its default (#9796)
- [x] [`d46da3991`](https://github.com/meta/astryx/commit/d46da3991) test(PowerSearch): open one Tokenizer sheet before the sheet tests (#9817)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f50bc7400`](https://github.com/meta/astryx/commit/f50bc7400) feat(PowerSearch): presentation is a stable prop, and adaptive is its default (#9797)
- [x] [`15a98a187`](https://github.com/meta/astryx/commit/15a98a187) fix(cli): a re-cased component name never resolves through a module (#8350)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`c8f08f967`](https://github.com/meta/astryx/commit/c8f08f967) fix(core): PowerSearch gives `isDateOnly: false` the time of day it names (#9702)
- [ ] [`946211065`](https://github.com/meta/astryx/commit/946211065) perf(core): an overlay's eager import no longer carries the lazy BottomSheet's padding (#8550)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`4b8567003`](https://github.com/meta/astryx/commit/4b8567003) feat(PowerSearch): the sheet presentation edits a draft that Done applies, and asks before discarding a changed one (#9895)
- [ ] [`cc034edb7`](https://github.com/meta/astryx/commit/cc034edb7) fix(PowerSearch): Done on a field that became read-only while the sheet was open reports nothing (#9914)
- [x] [`75cc95196`](https://github.com/meta/astryx/commit/75cc95196) test(PowerSearch): load the module graphs before the timed waits that do not test the load (#9866)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3b44b43d9`](https://github.com/meta/astryx/commit/3b44b43d9) test(PowerSearch, Tokenizer): the sheet warm-ups load their modules before any test, not inside a 15 s wait (#9968)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7eee90594`](https://github.com/meta/astryx/commit/7eee90594) fix(Dialog, AlertDialog, CommandPalette, BottomSheet, Lightbox): Tab wraps inside the open modal through the shared focus-region module (#8883)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`380defeb5`](https://github.com/meta/astryx/commit/380defeb5) fix(PowerSearch): the docs examples fit a phone, and a long sheet-trigger placeholder ends in an ellipsis (#9898)
- [ ] [`edf7128e3`](https://github.com/meta/astryx/commit/edf7128e3) feat(Timestamp, PowerSearch): write dates in the provider's calendar (#9639)
- [ ] [`189a730ce`](https://github.com/meta/astryx/commit/189a730ce) feat(DateInput, DateTimeInput, DateRangeInput): type, pick and show dates in the active calendar (#9643, #9842)
- [x] [`8ee380b8a`](https://github.com/meta/astryx/commit/8ee380b8a) test(CommandPalette): match the current Spinner progressbar role (#10196)
  - 不适用：只改上游测试（自动初筛）

### v0.7.12

- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`9dca38629`](https://github.com/meta/astryx/commit/9dca38629) perf(Layer): anchored entrances play on the surface (#10561)
- [x] [`6422a1db4`](https://github.com/meta/astryx/commit/6422a1db4) refactor(Layer): one presentation hold keeps a layer's chosen presentation until its close settles (#8587)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b47b33a43`](https://github.com/meta/astryx/commit/b47b33a43) fix(PowerSearch): a filter token's field, operator and value come from catalog messages (#10437)
- [ ] [`619ffeb27`](https://github.com/meta/astryx/commit/619ffeb27) fix(core, richtext): no focus fade on text fields under a coarse pointer (#10611)
- [ ] [`1ffc0dac9`](https://github.com/meta/astryx/commit/1ffc0dac9) fix(BottomSheet): resting content starts below the grab bar, whatever the padding (#8558)
- [ ] [`824e71ea0`](https://github.com/meta/astryx/commit/824e71ea0) fix(CommandPalette): handle rejected search and bootstrap (#10675)
- [x] [`06db960c9`](https://github.com/meta/astryx/commit/06db960c9) docs(CommandPalette): a rejected search settles as an empty answer, never at an error boundary (#10682)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`aefb30d0c`](https://github.com/meta/astryx/commit/aefb30d0c) fix(PowerSearch): the sheet's choice lists are standard RadioList and CheckboxList (#10608)
- [ ] [`fece34c7d`](https://github.com/meta/astryx/commit/fece34c7d) fix(PowerSearch): a date range edits on an inline calendar in the sheet (#10618)
- [ ] [`d84658f7d`](https://github.com/meta/astryx/commit/d84658f7d) docs(usePowerSearchConfig): add hook docs and a filtered directory table example block (#10660)

### v0.7.14

- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [x] [`9d5f4c7b1`](https://github.com/meta/astryx/commit/9d5f4c7b1) spec(AST-111): calendars go by their CLDR names (#11102)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`41d0d0faf`](https://github.com/meta/astryx/commit/41d0d0faf) fix(Tokenizer): a pick from the focus list keeps focus and the list open (#11031)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7238fed14`](https://github.com/meta/astryx/commit/7238fed14) fix(CommandPalette): refresh results after source changes (#9679)
- [x] [`410f9b627`](https://github.com/meta/astryx/commit/410f9b627) fix(Typeahead): keep dismissed menus closed for late results (#8778)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.15

- [x] [`2a74aebdc`](https://github.com/meta/astryx/commit/2a74aebdc) fix(Item): keep disabled actions keyboard-reachable (#11169)
  - 不适用：只改上游测试（自动初筛）
- [x] [`548f26c7c`](https://github.com/meta/astryx/commit/548f26c7c) spec(BottomSheet): a changed sheet waits at a peek while the discard dialog asks (DEC-5) (#11095)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.16

- [ ] [`50beab961`](https://github.com/meta/astryx/commit/50beab961) fix(core): pass host data-* attributes to the component's own element (#11406)
- [ ] [`130e5da2d`](https://github.com/meta/astryx/commit/130e5da2d) feat(DateInput, DateTimeInput, TimeInput, FormLayout): entryErrorBehavior and a form default (#11485)

### v0.7.17

- [x] [`8e39a4a42`](https://github.com/meta/astryx/commit/8e39a4a42) feat(cli): docs points to the command that reads a component, hook or template (#11553)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`43445a643`](https://github.com/meta/astryx/commit/43445a643) fix(cli): the CLI orders names the same way on every machine (#11683)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bac58372c`](https://github.com/meta/astryx/commit/bac58372c) feat(cli): one did-you-mean rule points every lookup to the command that has the name (#11707)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2cafda977`](https://github.com/meta/astryx/commit/2cafda977) feat(cli): a lookup miss points to the hook it nearly names (#11857)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4fdc22f60`](https://github.com/meta/astryx/commit/4fdc22f60) fix(cli): component did-you-mean suggests installed integration components and near names typed with separators (#11861)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e34ad599e`](https://github.com/meta/astryx/commit/e34ad599e) fix(cli): a component that declares the typed name stays ahead of another command's hint (#11934)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`31ca826cd`](https://github.com/meta/astryx/commit/31ca826cd) fix(cli): component lookups never open through a keyword; one keyword definition and guide (#12073)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f3e04a9e2`](https://github.com/meta/astryx/commit/f3e04a9e2) fix(cli): search lists a family's root ahead of its own part when the query asks for the whole thing (#12167)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`fac84a38e`](https://github.com/meta/astryx/commit/fac84a38e) fix(cli): when matches of one domain tie for first place on the same words, the name with more query words leads; a whole-query or named-title match keeps first (#12246)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d087570b9`](https://github.com/meta/astryx/commit/d087570b9) spec(PowerSearch): an operator opts into value-only matches, suggesting complete filters from a typed value (#10009)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d5b841735`](https://github.com/meta/astryx/commit/d5b841735) fix(cli): a docs namespace page's own text yields to the doc beneath it that answers the same word (#12336)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b2cf0a1ad`](https://github.com/meta/astryx/commit/b2cf0a1ad) feat(cli): search lists the installed icons that answer an icon ask (#12183)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`227a9deb6`](https://github.com/meta/astryx/commit/227a9deb6) fix(cli): search reads another entry's name as that entry's evidence (#12433)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`72f2d7caa`](https://github.com/meta/astryx/commit/72f2d7caa) docs: icon props take semantic names; Selector hasClear types; useTableSelectionState returns (#12583)
- [x] [`e318f3b9f`](https://github.com/meta/astryx/commit/e318f3b9f) search: an item's exact name typed as one word leads (#12599)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
- [ ] [`ab9aaa5a2`](https://github.com/meta/astryx/commit/ab9aaa5a2) chore: land batch 70 (2 pull requests) (#12963)
- [ ] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)
- [x] [`e1dfebf35`](https://github.com/meta/astryx/commit/e1dfebf35) chore: land batch 93 (1 pull requests) (#13041)
  - 不适用：上游内部规范和架构文档（自动初筛）

## 勾选与开关（area:core）

### v0.7.2

- [ ] [`2fc0a0db7`](https://github.com/meta/astryx/commit/2fc0a0db7) fix(Switch): compose a caller aria-describedby onto the switch control (#7595)
- [ ] [`c5f72ea4d`](https://github.com/meta/astryx/commit/c5f72ea4d) fix(Switch): put a caller aria-labelledby on the switch control (#7615)
- [ ] [`caec7cab6`](https://github.com/meta/astryx/commit/caec7cab6) feat(Item): align="first-line" centers start and end content on the label's first line (#7643)
- [ ] [`c05e8d29e`](https://github.com/meta/astryx/commit/c05e8d29e) fix(CheckboxInput): preserve caller-provided IDs (#7242)
- [ ] [`a61db6f03`](https://github.com/meta/astryx/commit/a61db6f03) fix(RadioList): keep a caller aria-labelledby on the radiogroup (#5656)
- [ ] [`09492662b`](https://github.com/meta/astryx/commit/09492662b) fix(ToggleButton): a caller onClick runs first and no longer replaces the toggle request (#7656)
- [x] [`fbc03f7b7`](https://github.com/meta/astryx/commit/fbc03f7b7) spec(Slider): onChangeEnd reports the value the owner renders (#7639)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`493231799`](https://github.com/meta/astryx/commit/493231799) fix(cli): search finds compound names typed as words, other libraries' names, and verb forms (#7718)
- [ ] [`a32ce6b8a`](https://github.com/meta/astryx/commit/a32ce6b8a) fix(CheckboxList): keep a caller aria-labelledby on the group (#7717)

### v0.7.3

- [x] [`7b6691327`](https://github.com/meta/astryx/commit/7b6691327) spec(AST-085): disabled controls stay focusable (#7793)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`4b0b8f656`](https://github.com/meta/astryx/commit/4b0b8f656) fix(core): choice controls stay focusable when disabled (#7824)
- [ ] [`2d0692c7f`](https://github.com/meta/astryx/commit/2d0692c7f) fix(Switch): announce busy once per busy start (#7872)
- [x] [`3317fb2a0`](https://github.com/meta/astryx/commit/3317fb2a0) test(a11y): align disabled card and checkbox oracles with focus contract (#7921)
  - 不适用：只改上游测试（自动初筛）

### v0.7.4

- [ ] [`c9c991e3b`](https://github.com/meta/astryx/commit/c9c991e3b) fix(CheckboxInput): announce the busy start once (#7948)

### v0.7.5

- [ ] [`655b54364`](https://github.com/meta/astryx/commit/655b54364) fix(Slider): a drag belongs to the pointer that started it (#8152)
- [ ] [`bf806901b`](https://github.com/meta/astryx/commit/bf806901b) fix(Slider): hold the lost-capture document listener only during a drag (#8284)
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f57df1822`](https://github.com/meta/astryx/commit/f57df1822) fix(RadioList): the pressed circle reads the row's press through a custom property, not a :has() scan (#8424)
- [ ] [`d695efb56`](https://github.com/meta/astryx/commit/d695efb56) fix(Switch): the focus ring follows the input through a sibling, not a :has() scan (#8415)
- [x] [`d26cdf3b2`](https://github.com/meta/astryx/commit/d26cdf3b2) docs(spec): ToggleButton records its shipped contract as current (#8436)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`174b1f16c`](https://github.com/meta/astryx/commit/174b1f16c) docs(spec): CheckboxInput records its shipped contract as current (#8754)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`d4de65a77`](https://github.com/meta/astryx/commit/d4de65a77) docs(spec): CheckboxList records its shipped contract as current (#8765)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`6906bebed`](https://github.com/meta/astryx/commit/6906bebed) docs(spec): RadioList records its shipped contract as current (#8773)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`b39314411`](https://github.com/meta/astryx/commit/b39314411) spec(family): action groups — press, slide across, act on lift (AST-094 FR26–FR28) (#8622)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`0c9bc55fa`](https://github.com/meta/astryx/commit/0c9bc55fa) docs(spec): Switch records its shipped contract as current (#8787)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`f48ad2a0a`](https://github.com/meta/astryx/commit/f48ad2a0a) docs(spec): SegmentedControl records its shipped contract as current (#8794)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`664877943`](https://github.com/meta/astryx/commit/664877943) fix(Slider): keep a caller aria-labelledby on the thumb and range group (#8781)
- [ ] [`f3c78b28d`](https://github.com/meta/astryx/commit/f3c78b28d) fix(SegmentedControl): keep a caller aria-describedby on the radiogroup (#8784)

### v0.7.6

- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [ ] [`afcea1552`](https://github.com/meta/astryx/commit/afcea1552) fix(FileInput, Slider): convey required under FormLayout defaultOptionality (#9053)
- [ ] [`070d574db`](https://github.com/meta/astryx/commit/070d574db) fix(core): a disabled SegmentedControlItem no longer runs a caller's onClick (#8989)
- [ ] [`ec128c411`](https://github.com/meta/astryx/commit/ec128c411) fix(Slider): range thumb names come from the catalog (#9023)
- [ ] [`a3eaa6d3b`](https://github.com/meta/astryx/commit/a3eaa6d3b) fix(RadioList, Switch): required inputs take their invalid state from status (#9042)
- [ ] [`eecd9c1a5`](https://github.com/meta/astryx/commit/eecd9c1a5) fix(core): a disabled Switch no longer runs a caller's key handlers (#9122)
- [ ] [`35063398d`](https://github.com/meta/astryx/commit/35063398d) fix(ToggleButtonGroup): className, style and other host props reach the group element (#9040)
- [ ] [`18b5260b6`](https://github.com/meta/astryx/commit/18b5260b6) fix(core): a disabled RadioListItem no longer runs a caller's onClick (#9120)
- [ ] [`6a79bfb74`](https://github.com/meta/astryx/commit/6a79bfb74) fix(Slider): two coincident range thumbs can be dragged apart (#8151)
- [ ] [`dce0ccfd6`](https://github.com/meta/astryx/commit/dce0ccfd6) fix(Slider): a press on the mark label of coincident thumbs goes to the upper thumb, as a press on the thumbs does (#9184)
- [ ] [`53c8c4a78`](https://github.com/meta/astryx/commit/53c8c4a78) fix(CheckboxList): a disabled group's reason describes each checkbox (#9168)
- [ ] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
- [ ] [`701c3b2ba`](https://github.com/meta/astryx/commit/701c3b2ba) fix(RadioList): a disabled group's reason describes each radio (#9169)
- [ ] [`df6d16fea`](https://github.com/meta/astryx/commit/df6d16fea) fix(SegmentedControl): the disabled reason describes each segment, and one Tab stop remains when no enabled segment is selected (#9176)
- [x] [`2a905bb85`](https://github.com/meta/astryx/commit/2a905bb85) test(CheckboxList): the group-disabled item's binding fact expects the reason as its description (#9248)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a0464850d`](https://github.com/meta/astryx/commit/a0464850d) fix(core): ToggleButton keeps its reflected pressed state over a caller's (#9159)
- [ ] [`0135af462`](https://github.com/meta/astryx/commit/0135af462) fix(core N–Z): slots use isRenderable; the remaining checks are allowed with a reason (#9206)
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`432d9577d`](https://github.com/meta/astryx/commit/432d9577d) fix(SegmentedControl): a disabled control, or a disabled selected segment, keeps the Tab stop (#9314)
- [x] [`2406addf5`](https://github.com/meta/astryx/commit/2406addf5) test(rtl): RTL coverage for list, metadata, radio, selector and typeahead rows (#9308)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`df7ad1bd5`](https://github.com/meta/astryx/commit/df7ad1bd5) test(rtl): RTL coverage for Tab, TabMenu, SegmentedControlItem and ToggleButtonGroup (#9330)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`8a5524637`](https://github.com/meta/astryx/commit/8a5524637) spec(Slider): every pointer tracks from the grab point; a finger's release coasts (#9407)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)

### v0.7.7

- [ ] [`723e04539`](https://github.com/meta/astryx/commit/723e04539) feat(Slider): every pointer drags a thumb by its travel, as UISlider does (#8190)
- [ ] [`1f47db9c8`](https://github.com/meta/astryx/commit/1f47db9c8) feat(Switch): the touch presentation, for every pointer (#9636)
- [ ] [`322c0d6e6`](https://github.com/meta/astryx/commit/322c0d6e6) fix(Button, Tab, Tokenizer and more): slots follow isRenderable; no truthy-guard baseline (#9501)
- [ ] [`6690e3394`](https://github.com/meta/astryx/commit/6690e3394) fix(Switch): a mouse or pen press released away from the switch never toggles it (#9686)
- [ ] [`95438ffaf`](https://github.com/meta/astryx/commit/95438ffaf) feat(SegmentedControl): the selection slides on every change and drags with any pointer (#9632)
- [ ] [`c76b17b56`](https://github.com/meta/astryx/commit/c76b17b56) fix(CheckboxList): an error status makes every checkbox aria-invalid (#9634)
- [ ] [`26f5e5d8c`](https://github.com/meta/astryx/commit/26f5e5d8c) fix(CheckboxList, RadioList): a disabled list marks its group aria-disabled (#9633)
- [x] [`3615956e2`](https://github.com/meta/astryx/commit/3615956e2) fix(gestures): pens and pointer-read fingers get the blur refusal and the pinch rule of the Touch Events path (#8309)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`30160f5ce`](https://github.com/meta/astryx/commit/30160f5ce) feat(core): PowerSearch touch sheet flow behind experimental.presentation (#8001)
- [ ] [`871bc3d5e`](https://github.com/meta/astryx/commit/871bc3d5e) feat(core): createAnimator and useAnimator animate one element (#8653)
- [ ] [`a81487737`](https://github.com/meta/astryx/commit/a81487737) feat(core): a first-party indicator can paint its own press (#9716)
- [ ] [`4b7546d3b`](https://github.com/meta/astryx/commit/4b7546d3b) fix(CheckboxInput, Switch): a form's required default no longer marks an unchecked box or off switch required (#9664)
- [ ] [`cd1e42cec`](https://github.com/meta/astryx/commit/cd1e42cec) feat(CheckboxList): an optional checkbox group can say so with isOptional (#8770)
- [ ] [`41cce0b0a`](https://github.com/meta/astryx/commit/41cce0b0a) fix(core): a disabled Slider no longer runs a caller's handlers (#9729)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f10bc9153`](https://github.com/meta/astryx/commit/f10bc9153) spec(AST-094): only a gesture's motion springs; other motion plays the theme's tokens (#9706)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`6255d3022`](https://github.com/meta/astryx/commit/6255d3022) feat(CheckboxList): a required checkbox group needs one checked box (isRequired) (#9854)

### v0.7.9

- [ ] [`298bafbc1`](https://github.com/meta/astryx/commit/298bafbc1) fix(core): a list row's touch press release runs on the compositor (#9762)
- [ ] [`9bd11b363`](https://github.com/meta/astryx/commit/9bd11b363) feat(core): a checkbox's or radio option's hit area grows toward 44 px (#8241)
- [ ] [`7f8de290c`](https://github.com/meta/astryx/commit/7f8de290c) fix(core): a press's release fades on the theme's exit motion tokens (#9890)
- [ ] [`7b71d71b4`](https://github.com/meta/astryx/commit/7b71d71b4) feat(List): a row's touch target grows toward 44 px where its neighbors leave room (#8085)
- [ ] [`a6a9b9c50`](https://github.com/meta/astryx/commit/a6a9b9c50) fix(CheckboxListItem): a row answers a finger the same wherever it lands (#8212)
- [x] [`195fcfd93`](https://github.com/meta/astryx/commit/195fcfd93) test(Slider): the busy-main-thread coast proof runs in WebKit on the paced touch play (#9694)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5cb261b01`](https://github.com/meta/astryx/commit/5cb261b01) test(CheckboxList): a row adds no touch-query listener of its own (#10046)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`c26fcd543`](https://github.com/meta/astryx/commit/c26fcd543) chore(lab): Lab's animator hook, over Core's internal touch entry (#9754)
- [x] [`8286740d1`](https://github.com/meta/astryx/commit/8286740d1) test(SegmentedControl): hold the keyed and app-change slides at birth (#10070)
  - 不适用：只改上游测试（自动初筛）
- [x] [`257573b22`](https://github.com/meta/astryx/commit/257573b22) docs(AST-094, AST-057): motion guidance; gesture springs; swipe-row returns (#9915)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1dce31829`](https://github.com/meta/astryx/commit/1dce31829) refactor(motion): core's shared theme-timing reader (#10068)
- [ ] [`7aaf2a1b9`](https://github.com/meta/astryx/commit/7aaf2a1b9) fix(core): a disabled CheckboxInput no longer runs a caller's handlers (#10092)
- [ ] [`ceefccdfc`](https://github.com/meta/astryx/commit/ceefccdfc) feat(core): the animator's springs follow the theme's tempo (#8677)
- [x] [`db3451eee`](https://github.com/meta/astryx/commit/db3451eee) test(CheckboxList): the press-fade proof holds the release in its first frame (#10097)
  - 不适用：只改上游测试（自动初筛）
- [x] [`92947d98f`](https://github.com/meta/astryx/commit/92947d98f) test: three suites pass without the NODE_PATH pnpm's bin shim sets (#10088)
  - 不适用：只改上游测试（自动初筛）
- [x] [`40ab0ecf6`](https://github.com/meta/astryx/commit/40ab0ecf6) fix(Pagination): the dots expose the radio group they already behave as (#8859)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`de0bbc2ff`](https://github.com/meta/astryx/commit/de0bbc2ff) fix(CheckboxListItem): a checked row reflects selected on its row targets (#10146)
- [x] [`1ef21f898`](https://github.com/meta/astryx/commit/1ef21f898) fix(Spinner): route standalone loading through the shared announcement channel (#7910)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ab7facf1e`](https://github.com/meta/astryx/commit/ab7facf1e) fix(core): spring roles register themselves when they load (#10138)
- [x] [`097955952`](https://github.com/meta/astryx/commit/097955952) test(RadioList): the radio-group summary reads each state's result instead of checking every state again (#10206)
  - 不适用：只改上游测试（自动初筛）

### v0.7.10

- [ ] [`add05168f`](https://github.com/meta/astryx/commit/add05168f) fix(core): a finger held on a control's box picks it, not the text (#10091)
- [ ] [`2c66211e8`](https://github.com/meta/astryx/commit/2c66211e8) fix(SegmentedControl): a segment's touch target grows toward 44 px without growing its box (#10137)
- [x] [`8bd8c6146`](https://github.com/meta/astryx/commit/8bd8c6146) fix(core): layout glides play the theme's move curve, not a spring (#10236)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1bc28f349`](https://github.com/meta/astryx/commit/1bc28f349) fix(Slider): the value tooltip stays on its thumb through a drag (#10228)

### v0.7.11

- [x] [`a0c7e22de`](https://github.com/meta/astryx/commit/a0c7e22de) test(Switch): P14's catch lands at a fixed point of the travel (#10294)
  - 不适用：只改上游测试（自动初筛）
- [x] [`afeaf3226`](https://github.com/meta/astryx/commit/afeaf3226) test(Slider): read the lift in the page, not from onEvent (#10381)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)
- [x] [`28270c143`](https://github.com/meta/astryx/commit/28270c143) test(interaction-harness): an armed hold names the motion it judges (#10386)
  - 不适用：只改上游测试（自动初筛）

### v0.7.12

- [x] [`b1327c020`](https://github.com/meta/astryx/commit/b1327c020) test: watch before the action at 28 first-contact waits (#10286)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4f889dac6`](https://github.com/meta/astryx/commit/4f889dac6) test(Switch): hold the travel from its start (#10316)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6cc14bef9`](https://github.com/meta/astryx/commit/6cc14bef9) test(SegmentedControl): hold the slide from its start (#10338)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f1ad44ff0`](https://github.com/meta/astryx/commit/f1ad44ff0) test(core): the segmented slide's busy proof starts in time (#10315)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`39d5abc76`](https://github.com/meta/astryx/commit/39d5abc76) fix(core): a rebase toward the new rest shifts the curve whole (#10369)
- [x] [`3d12633e4`](https://github.com/meta/astryx/commit/3d12633e4) test(core): the Switch's late-frames catch reads the turn on every frame (#10518)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e1eca2070`](https://github.com/meta/astryx/commit/e1eca2070) test(SegmentedControl): a change mid-flight reads the tap's fade frozen (#10519)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`afcba3b79`](https://github.com/meta/astryx/commit/afcba3b79) fix(core): a Switch at rest holds no compositing layer (#10542)
- [x] [`81d480b80`](https://github.com/meta/astryx/commit/81d480b80) test(Slider): three touch proofs read the page's own frames (#10562)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f75f0f2d3`](https://github.com/meta/astryx/commit/f75f0f2d3) feat(ToggleButtonGroup): a finger's slide toggles the one it lifts on (#8660)
- [x] [`241712bfc`](https://github.com/meta/astryx/commit/241712bfc) test(core): the Switch's late-lift catch holds its lift with the harness (#10614)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`aefb30d0c`](https://github.com/meta/astryx/commit/aefb30d0c) fix(PowerSearch): the sheet's choice lists are standard RadioList and CheckboxList (#10608)
- [x] [`3fb73b3d4`](https://github.com/meta/astryx/commit/3fb73b3d4) fix(core): a spring retarget committed late starts at its frame (#10607)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0edaed861`](https://github.com/meta/astryx/commit/0edaed861) test(core): the Switch's busy-thread proofs judge against a control (#10511)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f3c7a0234`](https://github.com/meta/astryx/commit/f3c7a0234) test(core): the Switch's colour busy proof dates frames on the controls (#10758)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a1dabb30c`](https://github.com/meta/astryx/commit/a1dabb30c) fix(interaction-harness): WebKit busy proofs date frames on the controls (#10772)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1d1d9ad96`](https://github.com/meta/astryx/commit/1d1d9ad96) test(Slider): the busy proofs decode each cast once (#10783)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f36bd72b8`](https://github.com/meta/astryx/commit/f36bd72b8) test(a11y): Slider (Multi-Thumb) contract and range Slider binding (#10830)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`5f1c1161b`](https://github.com/meta/astryx/commit/5f1c1161b) docs(SegmentedControl): label contrast depends on the background under the translucent track (#10882)
- [x] [`0b5663f2b`](https://github.com/meta/astryx/commit/0b5663f2b) fix(theme-neutral): lift an unselected SegmentedControl label to 4.5:1 on the dark track (#10881)
  - 不适用：只改上游测试（自动初筛）

### v0.7.14

- [x] [`8a8710cb3`](https://github.com/meta/astryx/commit/8a8710cb3) test: three Switch and Tooltip marker reads decode their frames once (#11074)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [ ] [`e01c68b9c`](https://github.com/meta/astryx/commit/e01c68b9c) feat(SegmentedControl): a drag that drifts off keeps choosing (#10978)
- [x] [`179767d1c`](https://github.com/meta/astryx/commit/179767d1c) docs(buttons): a disabled Button renders aria-disabled, never native disabled (#11147)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`9a3f29608`](https://github.com/meta/astryx/commit/9a3f29608) fix(useKeyboardHint): the arrow-key hint stays until dismissed, and Escape closes it (#10564)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`9f3cbd90d`](https://github.com/meta/astryx/commit/9f3cbd90d) chore: remove the committed API reports; the API delta comes from the build (#10957)
  - 不适用：只改上游测试（自动初筛）

### v0.7.15

- [ ] [`f8f9ce98a`](https://github.com/meta/astryx/commit/f8f9ce98a) feat(SegmentedControl): under a finger, the selected surface lifts (#9724)
- [ ] [`e7e9af2f8`](https://github.com/meta/astryx/commit/e7e9af2f8) feat(core): a mouse or pen press on a checkbox or a radio option paints at once and fades on release (#8696)
- [ ] [`807dc2ead`](https://github.com/meta/astryx/commit/807dc2ead) refactor(core): name the nested press rule for every pointer it covers (#11304)

### v0.7.16

- [ ] [`73584cf84`](https://github.com/meta/astryx/commit/73584cf84) fix(Slider): sync its handler refs at commit (#10913)
- [ ] [`9d2ce46c7`](https://github.com/meta/astryx/commit/9d2ce46c7) docs(core): playground defaults for eight components and sample items for four group playgrounds (#11351)
- [x] [`0996af5e1`](https://github.com/meta/astryx/commit/0996af5e1) docs(CheckboxListItem): name the align prop that reaches the row (#11482)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`c78fa5ab4`](https://github.com/meta/astryx/commit/c78fa5ab4) fix(SegmentedControl): a click without layout keeps the clicked segment (#11487)

### v0.7.17

- [x] [`babdd8f15`](https://github.com/meta/astryx/commit/babdd8f15) test(Slider): the slow-release test runs on a fixed track length (#11547)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`f23df7df4`](https://github.com/meta/astryx/commit/f23df7df4) fix(CheckboxInput): a required box is not announced as invalid before an error (#11619)
- [ ] [`1ac15daf3`](https://github.com/meta/astryx/commit/1ac15daf3) fix(Slider): a horizontal slider keeps room for its mark labels (#11586)
- [ ] [`e4a11bb68`](https://github.com/meta/astryx/commit/e4a11bb68) fix(core): a radio's circle is drawn at 50%, not with the pill token (#11836)
- [ ] [`12f81bd6b`](https://github.com/meta/astryx/commit/12f81bd6b) fix(core): ToggleButtonGroup wraps instead of cutting its labels on a narrow screen (#12172)
- [ ] [`08c8f842c`](https://github.com/meta/astryx/commit/08c8f842c) feat(core): a Button shows its full label in a tooltip when the label is cut short (#12169)
- [ ] [`dda98593d`](https://github.com/meta/astryx/commit/dda98593d) fix(core): the switch thumb stays round, and inherited text takes the theme's body size (#12236)
- [ ] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
- [ ] [`72f2d7caa`](https://github.com/meta/astryx/commit/72f2d7caa) docs: icon props take semantic names; Selector hasClear types; useTableSelectionState returns (#12583)
- [x] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`5c887ba97`](https://github.com/meta/astryx/commit/5c887ba97) perf(Switch): measure the track at the first press, not at mount (#12700)
- [ ] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
- [ ] [`d9676b913`](https://github.com/meta/astryx/commit/d9676b913) perf(CheckboxInput): the disabled-message tooltip runs only while it can show (#12376)
- [ ] [`9dbdcb950`](https://github.com/meta/astryx/commit/9dbdcb950) fix(RadioList): Tab from any radio leaves the group (#11626)
- [ ] [`cf537d7aa`](https://github.com/meta/astryx/commit/cf537d7aa) chore: land batch 11 (3 pull requests) (#12848)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`83424673c`](https://github.com/meta/astryx/commit/83424673c) chore: land batch 16 (6 pull requests) (#12881)
- [ ] [`31b52d0cb`](https://github.com/meta/astryx/commit/31b52d0cb) chore: land batch 34 (2 pull requests) (#12908)
- [ ] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)
- [ ] [`3dbf8ca1f`](https://github.com/meta/astryx/commit/3dbf8ca1f) fix(SegmentedControl): a tap in a wrapped track selects the segment it lands on (#12358)
- [x] [`fbbcd2cea`](https://github.com/meta/astryx/commit/fbbcd2cea) test(Switch): detach the touch controllers each test attaches (#13017)
  - 不适用：只改上游测试（自动初筛）

## 选择器家族（area:core）

### v0.7.2

- [x] [`40c469bf0`](https://github.com/meta/astryx/commit/40c469bf0) docs(MultiSelector): hook docs for useMultiCombobox (#7597)
  - 不适用：Vue 版没有公开的 useMultiCombobox 钩子，多选面板的按键在内部模块里
- [x] [`b69b2df3f`](https://github.com/meta/astryx/commit/b69b2df3f) docs(MultiSelector): scope useMultiCombobox's opening notes; Home and End with search (#7604)
  - 不适用：同 40c469bf0，没有公开的 useMultiCombobox 钩子文档要写
- [ ] [`b06a09363`](https://github.com/meta/astryx/commit/b06a09363) fix(Typeahead): clear loading state when search source is replaced (#7457) (#7487)
- [ ] [`f16dc9f43`](https://github.com/meta/astryx/commit/f16dc9f43) docs(Selector): hook docs for useCombobox (#7596)
- [x] [`3aca324d4`](https://github.com/meta/astryx/commit/3aca324d4) fix(MultiSelector): the active action cell draws the standard focus ring (#7542)
  - Vue 版已有：操作格 is-active 用焦点令牌画轮廓，只有键盘进入操作列才会落在操作格上
- [x] [`db3a2e7fd`](https://github.com/meta/astryx/commit/db3a2e7fd) docs(spec): combobox over a caller-rendered field (AST-075) (#7353)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.3

- [ ] [`801c4bc74`](https://github.com/meta/astryx/commit/801c4bc74) fix(Typeahead): empty the input when cleared while editing the selected value (#7165)
- [ ] [`2c9a868ce`](https://github.com/meta/astryx/commit/2c9a868ce) fix(Selector): let options ellipsize a long label in a narrow list (#7803)
- [x] [`7b6691327`](https://github.com/meta/astryx/commit/7b6691327) spec(AST-085): disabled controls stay focusable (#7793)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`ef184a721`](https://github.com/meta/astryx/commit/ef184a721) fix(Selector): a disabled Selector trigger keeps its tab stop (#7844)
- [x] [`1b3f66800`](https://github.com/meta/astryx/commit/1b3f66800) fix(ComplexSelector): a disabled trigger keeps its tab stop (#7845)
  - Vue 版已有：ComplexSelector 禁用时触发器用 aria-disabled 不用原生 disabled，仍在 Tab 序里，指针和按键被拦下
- [x] [`b2c4f180a`](https://github.com/meta/astryx/commit/b2c4f180a) fix(MultiSelector): a disabled trigger keeps its tab stop (#7852)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。禁用触发器保留 Tab 停点本来就有，这次补上禁用时不渲染隐藏输入、不向表单交值，补测试
- [x] [`7370328f6`](https://github.com/meta/astryx/commit/7370328f6) spec(AST-009): real-AT evidence never gates merge or release (#7915)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.4

- [x] [`2b60fa6fd`](https://github.com/meta/astryx/commit/2b60fa6fd) fix(inputs): silence the busy Spinner and announce the busy start once (TextInput, TextArea, Selector, MultiSelector) (#7920)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Selector、MultiSelector 的忙碌图标对读屏隐藏，进入忙碌时只念一次「Loading」；输入框、文本域归输入框族
- [ ] [`9f3ab054c`](https://github.com/meta/astryx/commit/9f3ab054c) fix(ComplexSelector, Typeahead, Tokenizer): silence the busy Spinner and announce the busy start once (#7930)

### v0.7.5

- [x] [`d8e3b386a`](https://github.com/meta/astryx/commit/d8e3b386a) fix(Tokenizer): wrap tokens before the clear-all lane (#7375)
  - Vue 版已有：清除按钮和 end 插槽在外框的弹性行里，不是绝对定位的末端区，标签本来就在它们前面换行，没有标签压到按钮下面的问题
- [x] [`ee74c1822`](https://github.com/meta/astryx/commit/ee74c1822) fix(Tokenizer): place the caret after the last token (#7922)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。展开时标签直接排进外框弹性行，输入框跟在最后一个标签后面，空着失焦或只读时不占位
- [ ] [`db7e94503`](https://github.com/meta/astryx/commit/db7e94503) fix(core): a search's busy start is never announced after its outcome (#8235)
- [ ] [`ad8af75ab`](https://github.com/meta/astryx/commit/ad8af75ab) fix(core): taps that start typing raise the touch keyboard (#8158)
- [x] [`d794476b6`](https://github.com/meta/astryx/commit/d794476b6) fix(useAnnounce): messages announced in the same frame are joined, an identical repeat once (#8244)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2597fa4fb`](https://github.com/meta/astryx/commit/2597fa4fb) fix(Typeahead): highlight follows pointer movement, not a resting pointer (#8247)
- [x] [`e52ef25f2`](https://github.com/meta/astryx/commit/e52ef25f2) [Component Audit] ComplexSelector: the trigger is a combobox field on both paths (#6991)
  - Vue 版已有：两种触发器都是弹出对话框的 combobox，带 aria-required 和 aria-disabled（#508）
- [x] [`10ca8eaee`](https://github.com/meta/astryx/commit/10ca8eaee) spec(AST-012): compact is width below md or height below 500 on every platform (#8274)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`cc95dd0b8`](https://github.com/meta/astryx/commit/cc95dd0b8) fix(Tokenizer): block token changes while disabled (#8408)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。添加、移除、全部清除在禁用时本来就拦着，这次补上禁用字段不再渲染隐藏输入、不向表单交值，补测试
- [x] [`23de0923e`](https://github.com/meta/astryx/commit/23de0923e) spec(AST-094): touch presentations feel native by default (#8409)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`6b46afaa9`](https://github.com/meta/astryx/commit/6b46afaa9) fix(InputGroup): propagate disabled state to inputs and addons (#8414)
  - Vue 版已有：InputGroup 禁用传给输入框与附加件（#504）
- [x] [`cd3787bac`](https://github.com/meta/astryx/commit/cd3787bac) feat(core): one touch presentation resolver (#8062)
  - 不适用：只改上游测试（自动初筛）
- [x] [`64b473d24`](https://github.com/meta/astryx/commit/64b473d24) fix(ComplexSelector): block commits from disabled open popups (#8399)
  - 已移植：[#543](https://github.com/astryx-vue/astryx-vue/pull/543)。禁用后已打开的弹层里的提交不再改值、不跑 changeAction，补测试
- [x] [`e9b3f3eda`](https://github.com/meta/astryx/commit/e9b3f3eda) fix(InputGroup): the group edge rules name members, not a universal selector (#8438)
  - Vue 版已有：InputGroup 由外层容器画边框，没有通配选择器的边缘规则
- [x] [`76b76bb4d`](https://github.com/meta/astryx/commit/76b76bb4d) spec(AST-058): the option's action cell is a named anatomy part (#8477)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`04b0e64ac`](https://github.com/meta/astryx/commit/04b0e64ac) test(Tokenizer): the end-lane contract sizes the story, not the lane's reserved Spinner (#8435)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a81b3ad86`](https://github.com/meta/astryx/commit/a81b3ad86) fix(ComplexSelector): a caller's aria-label or aria-labelledby names the built-in trigger (#8540)
  - 已移植：[#543](https://github.com/astryx-vue/astryx-vue/pull/543)。调用方的 aria-label、aria-labelledby 给内置触发器命名，补测试
- [x] [`8a13f3d2e`](https://github.com/meta/astryx/commit/8a13f3d2e) docs(spec): Tokenizer records the experimental touch sheet presentation (DEC-3) (#7976)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`c01521cf9`](https://github.com/meta/astryx/commit/c01521cf9) spec(AST-094, AST-057): gestures work on the web for every pointer (FR43) (#8646)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`54fbccb27`](https://github.com/meta/astryx/commit/54fbccb27) feat(core): Tokenizer touch sheet behind experimental.presentation (#7977)
  - 暂缓：Vue 版 Tokenizer 没有 presentation 属性和底部弹层；触屏弹层只在 lab MobileTokenizer 里，需要并进 core Tokenizer 并做 adaptive 解析
- [ ] [`619e4a529`](https://github.com/meta/astryx/commit/619e4a529) fix(Selector): keep a caller aria-labelledby on the trigger (#8710)
- [x] [`e200d6f27`](https://github.com/meta/astryx/commit/e200d6f27) fix(MultiSelector): keep a caller aria-labelledby on the trigger (#8711)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。MultiSelector 触发器的 aria-labelledby 在字段标签（组内先是组标签）后面接调用方的 id，补测试
- [ ] [`3ffb64647`](https://github.com/meta/astryx/commit/3ffb64647) fix(Tokenizer): hold back the touch sheet presentation until its UX pass finishes (#8735)
  - 暂缓：属于 Tokenizer 触屏弹层的发布节奏调整，Vue 版没有该弹层，随 54fbccb27 一起做
- [x] [`ad19aecd5`](https://github.com/meta/astryx/commit/ad19aecd5) test(Tokenizer): the SSR test loads Tokenizer at collection and finishes each case's sheet load (#8760)
  - 不适用：只改上游测试（自动初筛）
- [x] [`19d0a580a`](https://github.com/meta/astryx/commit/19d0a580a) test(Tokenizer): the SSR test asserts no console error instead of muting it (#8766)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`6162917e8`](https://github.com/meta/astryx/commit/6162917e8) feat(useCombobox): a combobox over a text field the caller renders (#7732)
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`dc4b88eac`](https://github.com/meta/astryx/commit/dc4b88eac) test(MultiSelector): the create-row contract reads the live region's newest message (#8987)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a7a087446`](https://github.com/meta/astryx/commit/a7a087446) test(MultiSelector): the create-row contract reads what the live region exposed, not its live text (#9002)
  - 不适用：只改上游测试（自动初筛）
- [x] [`34364283a`](https://github.com/meta/astryx/commit/34364283a) spec(AST-109): Selector's hasClear={{clearValue}} lands clear on a caller-named value (#8632)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`ad76345bc`](https://github.com/meta/astryx/commit/ad76345bc) fix(Typeahead): keep empty feedback with its settled query (#8904)
- [ ] [`537d4db23`](https://github.com/meta/astryx/commit/537d4db23) fix(Selector): the sheet trigger names the active option only once it is rendered (#9028)

### v0.7.6

- [x] [`6700c2492`](https://github.com/meta/astryx/commit/6700c2492) fix(Tokenizer): label the inline create row from the catalog (#9029)
  - Vue 版已有：创建行文字走 messages.tokenizer.create，跟随当前语言
- [x] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
  - 不适用：React 版 esbuild 单文件打包下懒加载模块导入 Core 的问题
- [x] [`6beb2e55a`](https://github.com/meta/astryx/commit/6beb2e55a) fix(MultiSelector): the default count trigger text comes from the catalog (#9020)
  - Vue 版已有：计数文字走 multiSelector.selected 文案，语言目录的 selectedCount 已接入（#533）
- [x] [`040393bc4`](https://github.com/meta/astryx/commit/040393bc4) test(Selector, MultiSelector): load the lazy BottomSheet before the sheet tests (#9082)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0bdda320c`](https://github.com/meta/astryx/commit/0bdda320c) fix(Selector, MultiSelector): a light dismiss onto another field leaves focus there (#9018)
  - Vue 版已有：点外面关闭时不动焦点（useDismiss 不抢焦点），Escape 和选中后才回到触发器
- [x] [`94a2a8ee5`](https://github.com/meta/astryx/commit/94a2a8ee5) spec(AST-086): a status is replaced by its owner's next status, not joined (#9070)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`f77252d11`](https://github.com/meta/astryx/commit/f77252d11) test(Selector, MultiSelector): wait for the on-demand sheet module before the first open (#8642)
  - 不适用：只改上游测试（自动初筛）
- [x] [`75001c5b4`](https://github.com/meta/astryx/commit/75001c5b4) fix(TextArea, Typeahead, Tokenizer): keep the field's label with a caller aria-labelledby (#8862)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Tokenizer、Typeahead 把调用方的 aria-labelledby 接在字段标签后面，补测试
- [x] [`7a76092aa`](https://github.com/meta/astryx/commit/7a76092aa) test(ComplexSelector): cover trigger value and placeholder as content (#8499)
  - 不适用：只改上游测试（自动初筛）
- [x] [`db5a9936f`](https://github.com/meta/astryx/commit/db5a9936f) fix(MultiSelector): a search status the next keystroke replaces is withdrawn, not joined (#8640)
  - Vue 版已有：useAnnounce 是单一播报区，后一条会替换还没念的前一条，不会拼在一起
- [x] [`7544940f4`](https://github.com/meta/astryx/commit/7544940f4) fix(ComplexSelector): tooltip status placement keeps its message (#9026)
  - 已移植：[#543](https://github.com/astryx-vue/astryx-vue/pull/543)。tooltip 状态的说明收进能聚焦的状态图标按钮，点它不开弹层，触发器带 aria-describedby，补测试
- [ ] [`19ae6fc29`](https://github.com/meta/astryx/commit/19ae6fc29) fix(BaseTypeahead): a focusable-disabled field opens no list and picks nothing (spec:AST-085 FR2) (#9036)
- [x] [`3b0a56a02`](https://github.com/meta/astryx/commit/3b0a56a02) fix(Tokenizer, PowerSearch): Clear all is announced, once, in each component's own words (#9038)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Tokenizer 全部清除只念一次「All items removed」（新增 tokenizer.allRemoved 并接入语言目录）；PowerSearch 的部分在搜索族清单
- [x] [`f52dbbefb`](https://github.com/meta/astryx/commit/f52dbbefb) fix(Typeahead, Tokenizer): the combobox exposes its required and invalid state (#9034)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Tokenizer、Typeahead 在 error 状态暴露 aria-invalid，aria-required 本来就有，补测试
- [ ] [`b2e79c45d`](https://github.com/meta/astryx/commit/b2e79c45d) fix(Typeahead): the value token's button is named by the field label and the value (#9049)
- [x] [`a58781354`](https://github.com/meta/astryx/commit/a58781354) docs(spec): MultiSelector records its shipped contract as current (#9133)
  - 不适用：上游组件规范文档（自动初筛）
- [ ] [`b13f483f0`](https://github.com/meta/astryx/commit/b13f483f0) fix(Selector): block selection from disabled open popups (#9137)
- [x] [`4cdc3abf2`](https://github.com/meta/astryx/commit/4cdc3abf2) [Component Audit] ComplexSelector: tall popups keep their last rows clear of the app bar (#8551)
  - 已移植：[#543](https://github.com/astryx-vue/astryx-vue/pull/543)。弹层内容高度上限扣掉 LayerProvider 的 inset，最后几行不被底栏盖住；箭头减少动效下本来就不动画
- [x] [`5ef8ecf2c`](https://github.com/meta/astryx/commit/5ef8ecf2c) fix(MultiSelector): block changes from disabled open panels (#9152)
  - Vue 版已有：toggleValue、创建和键盘处理都先看 canActivate，禁用后已打开的面板不再改值；补了测试
- [ ] [`f89931310`](https://github.com/meta/astryx/commit/f89931310) fix(Typeahead, Tokenizer): ArrowDown on the closed field loads a replaced search source instead of showing its old list (#9166)
- [ ] [`b735ef052`](https://github.com/meta/astryx/commit/b735ef052) fix(Tokenizer): focus hand-offs live in the controls' callback refs and the confirmation's close handler (#9162)
  - 暂缓：焦点交接在 Tokenizer 触屏弹层的控件回调和确认弹窗里，Vue 版没有该弹层
- [x] [`b56b6d4fc`](https://github.com/meta/astryx/commit/b56b6d4fc) fix(core): one modality call per component, reading the component's own document (#9148)
  - 不适用：React 版让每个组件读自己所在文档的输入方式（iframe、画中画）；Vue 版的输入方式跟踪是单文档模块
- [ ] [`a03bffd8e`](https://github.com/meta/astryx/commit/a03bffd8e) feat(Typeahead): show local matches at once and append server results (spec:AST-092) (#7962)
- [x] [`c5c7deaf6`](https://github.com/meta/astryx/commit/c5c7deaf6) chore(MultiSelector): format the source with the repository's Prettier settings (#9247)
  - 不适用：按上游 Prettier 配置重排 React 源码
- [x] [`8f345cba4`](https://github.com/meta/astryx/commit/8f345cba4) feat(FieldStatus): deprecate the tooltip variant; field controls keep statusVariant="tooltip" (#9196)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Tokenizer、Typeahead 新增 statusVariant 并保留 tooltip；ComplexSelector 部分在 #543；FieldStatus 的 tooltip 弃用不适用
- [ ] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
- [x] [`acfa52701`](https://github.com/meta/astryx/commit/acfa52701) fix(useTypeahead): type-to-select ignores accents (#8864)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。按字母跳转忽略大小写、组合符号、带斜杠字母和土耳其语 i，带符号的字母先精确匹配；共用的 useCombobox，菜单和树的同类跳转归别族
- [x] [`dc4dd03b8`](https://github.com/meta/astryx/commit/dc4dd03b8) docs(spec): SelectorOption records its shipped contract as current (#9144)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1408785fd`](https://github.com/meta/astryx/commit/1408785fd) fix(Typeahead, Tokenizer): a disabled field keeps its tab stop (#9275)
- [x] [`e6bc6e3a1`](https://github.com/meta/astryx/commit/e6bc6e3a1) test(Typeahead): the disabled-field contract checks the native disabled attribute, not toBeDisabled (#9315)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e30ffbfbe`](https://github.com/meta/astryx/commit/e30ffbfbe) docs(spec): Typeahead, BaseTypeahead, and TypeaheadItem record their shipped contract as current (#9277)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`75094f759`](https://github.com/meta/astryx/commit/75094f759) docs(spec): ComplexSelector records its shipped contract as current (#9345)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2406addf5`](https://github.com/meta/astryx/commit/2406addf5) test(rtl): RTL coverage for list, metadata, radio, selector and typeahead rows (#9308)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`a4226c9a2`](https://github.com/meta/astryx/commit/a4226c9a2) fix(Typeahead, Tokenizer): a press in the field's own input or buttons keeps the list open (#9367)
- [x] [`99cc6dc85`](https://github.com/meta/astryx/commit/99cc6dc85) fix(core): many components carry only the English for their own strings (#9429)
  - Vue 版已有：组件只按自己的命名空间读内置文案（useComponentMessages），单独引入不带全部文案（#515）
- [x] [`ce052bf0a`](https://github.com/meta/astryx/commit/ce052bf0a) fix(Field): a focusable disabled field shows its focus under forced colors (#9410)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Selector、MultiSelector、Typeahead、Tokenizer 在强制颜色下聚焦边框取 Highlight，禁用但可聚焦的字段也一样
- [ ] [`346a3c330`](https://github.com/meta/astryx/commit/346a3c330) fix(Tokenizer): an open list reloads when the tokens change (#9416)
- [ ] [`beb03f8bd`](https://github.com/meta/astryx/commit/beb03f8bd) fix(DateInput): a press in the field's own input, clear button or label keeps the calendar open (#9433)

### v0.7.7

- [ ] [`4d56e6b9b`](https://github.com/meta/astryx/commit/4d56e6b9b) perf(Selector): a long list has its scrolling touch-action before the first open (#9591)
- [ ] [`6a591d932`](https://github.com/meta/astryx/commit/6a591d932) fix(Typeahead): an empty or failed focus list closes instead of staying open and empty (#9532)
- [ ] [`e4f5cad14`](https://github.com/meta/astryx/commit/e4f5cad14) fix(Selector): the open list honors Reduce Motion (#9611)
- [ ] [`d0b6e0f77`](https://github.com/meta/astryx/commit/d0b6e0f77) feat(core): search fields ask a touch keyboard for its Search key and no autocorrection (#8157)
- [x] [`98f48789d`](https://github.com/meta/astryx/commit/98f48789d) spec(Tokenizer): the sheet presentation edits a draft that Save commits (#9630)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`8d809ad01`](https://github.com/meta/astryx/commit/8d809ad01) fix(Typeahead): Escape in edit mode hides the list first, then restores the token and focuses it (#9608)
- [x] [`322c0d6e6`](https://github.com/meta/astryx/commit/322c0d6e6) fix(Button, Tab, Tokenizer and more): slots follow isRenderable; no truthy-guard baseline (#9501)
  - 不适用：React 里 0 这类假值插槽的判断；Vue 插槽按是否传入决定渲染，没有这个问题（Button 等见 #508）
- [x] [`7f1bace3c`](https://github.com/meta/astryx/commit/7f1bace3c) fix(PowerSearch): Backspace removes no filter of a read-only field (#9648)
  - Vue 版已有：Vue 的 PowerSearch 是独立实现，退格走 usePowerSearchActions 的 canRemove，只读字段和只读筛选都不会被退格删掉
- [ ] [`f4edef899`](https://github.com/meta/astryx/commit/f4edef899) perf(Selector): memoize option rows, so an open or a highlight move re-renders only the rows it changes (#9598)
- [x] [`2c533501a`](https://github.com/meta/astryx/commit/2c533501a) fix(PowerSearch): Clear all keeps read-only filters (#9676)
  - 不适用：Tokenizer 的可移除谓词只服务 PowerSearch，Vue 的 PowerSearch 不基于 Tokenizer；PowerSearch 全部清除保留只读筛选归搜索族清单（目前 usePowerSearchActions.clearAll 仍会清掉只读筛选）
- [ ] [`4f452f927`](https://github.com/meta/astryx/commit/4f452f927) feat(Tokenizer): the touch sheet presentation is public behind experimental.presentation, and the sheet edits a draft that Save commits (#9708)
- [x] [`b11e000b5`](https://github.com/meta/astryx/commit/b11e000b5) fix(Selector): a row that scrolls under a still mouse does not take the keyboard's highlight (#9671)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。MultiSelector、Typeahead 的行只在鼠标真的移动时才拿走高亮；Selector 悬停只是 CSS，CommandPalette 等归别族
- [x] [`4e495ec5e`](https://github.com/meta/astryx/commit/4e495ec5e) fix(BottomSheet): a standalone sheet closing with focus inside stays out of inert while focus stays (#9635)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`c6f44320f`](https://github.com/meta/astryx/commit/c6f44320f) fix(ComplexSelector): a light dismiss onto another control leaves focus there (#9740)
- [x] [`fa3295a50`](https://github.com/meta/astryx/commit/fa3295a50) fix(Spinner): the ring keeps turning while JavaScript runs (#8177)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`87d5159ae`](https://github.com/meta/astryx/commit/87d5159ae) docs(typeahead): clarify ignored TypeaheadItem group prop (#9744)
- [ ] [`3f39a18bf`](https://github.com/meta/astryx/commit/3f39a18bf) fix(Typeahead): a source replacement that React discards no longer leaves the field busy (#9713)
- [ ] [`e70850f04`](https://github.com/meta/astryx/commit/e70850f04) fix(Selector): the listbox is named by the field label in every presentation (#9737)
- [ ] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
- [ ] [`dcf3d6f86`](https://github.com/meta/astryx/commit/dcf3d6f86) feat(Tokenizer): presentation is a stable prop, and adaptive is its default (#9796)
  - 暂缓：Tokenizer 的 presentation 属性和 adaptive 默认值依赖 Vue 版还没有的 core 触屏弹层，见 54fbccb27
- [x] [`f50bc7400`](https://github.com/meta/astryx/commit/f50bc7400) feat(PowerSearch): presentation is a stable prop, and adaptive is its default (#9797)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a5e334b49`](https://github.com/meta/astryx/commit/a5e334b49) refactor(Tokenizer): check sheet rows for action during render, not in an Effect (#9808)
  - 暂缓：Tokenizer 触屏弹层内部的渲染期检查，Vue 版没有该弹层
- [ ] [`b5ce149a8`](https://github.com/meta/astryx/commit/b5ce149a8) chore(Tokenizer): remove experimental.presentation; presentation is the only spelling (#9836)
  - 暂缓：去掉 experimental.presentation、只留 presentation，依赖触屏弹层，见 54fbccb27
- [x] [`b95497d2d`](https://github.com/meta/astryx/commit/b95497d2d) test: main is green again: Tokenizer's sheet-row test passes presentation, and the recorded module resolutions follow core (#9851)
  - 不适用：只改上游测试（自动初筛）
- [x] [`41cce0b0a`](https://github.com/meta/astryx/commit/41cce0b0a) fix(core): a disabled Slider no longer runs a caller's handlers (#9729)
  - Vue 版已有：Selector、MultiSelector 禁用时用 consumeWhileDisabled 拦下点击和按键；Slider 归别族
- [x] [`946211065`](https://github.com/meta/astryx/commit/946211065) perf(core): an overlay's eager import no longer carries the lazy BottomSheet's padding (#8550)
  - 不适用：React 懒加载 BottomSheet 的引入体积问题
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b4f383dec`](https://github.com/meta/astryx/commit/b4f383dec) fix(Tokenizer): a confirmed Clear all in the sheet keeps focus on Clear all, not the search field (#9882)
  - 暂缓：触屏弹层里确认清除后的焦点，Vue 版没有该弹层

### v0.7.9

- [x] [`35985f2bd`](https://github.com/meta/astryx/commit/35985f2bd) test: each --repeat-each copy of an audit keeps its own evidence folder (#9515)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3b44b43d9`](https://github.com/meta/astryx/commit/3b44b43d9) test(PowerSearch, Tokenizer): the sheet warm-ups load their modules before any test, not inside a 15 s wait (#9968)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`12f63f5d0`](https://github.com/meta/astryx/commit/12f63f5d0) fix(Tokenizer): the sheet presentation renders endContent and renderToken (#9902)
  - 暂缓：触屏弹层渲染 endContent 和自定义标签，Vue 版没有该弹层
- [x] [`70d6b46e5`](https://github.com/meta/astryx/commit/70d6b46e5) test(Selector): the sheet's active-option test waits for the sheet itself, not for a clock (#9960)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2947be858`](https://github.com/meta/astryx/commit/2947be858) fix(Selector): the keyboard-active option draws the focus ring, so it reads at 3:1 against the list (#10024)
- [ ] [`a866c2ab0`](https://github.com/meta/astryx/commit/a866c2ab0) fix(Dialog, Drawer): a backdrop press that closes a popover inside closes only the popover (#9988)
- [ ] [`b988598bd`](https://github.com/meta/astryx/commit/b988598bd) fix(Selector): the option the mouse moves onto after keyboard input shows no focus ring (#10049)
- [ ] [`97873156b`](https://github.com/meta/astryx/commit/97873156b) fix(Typeahead, Tokenizer): picking a result reports the emptied query to onChangeQuery (#8929) (#9993)
- [x] [`7e69f91dc`](https://github.com/meta/astryx/commit/7e69f91dc) fix(core): an anchored layer that would run under the software keyboard ends above it (#8208)
  - Vue 版已有：浮层定位的视口扣掉屏幕键盘盖住的部分（layer/visibleViewport），选择器和 Typeahead 的列表都走它，别族 #542 已移植
- [x] [`d5dd0ec26`](https://github.com/meta/astryx/commit/d5dd0ec26) fix(MultiSelector): type-to-select cycles on a repeated letter and searches from the next option (#9961)
  - Vue 版已有：useCombobox.jumpToMatch 重复字母会循环，单个字母从下一项开始找；空格切换选项
- [x] [`95aa62dd1`](https://github.com/meta/astryx/commit/95aa62dd1) fix(ComplexSelector): attached status shows the status icon on the trigger row (#9731)
  - 已移植：[#543](https://github.com/astryx-vue/astryx-vue/pull/543)。attached 状态在触发器行用状态图标顶替箭头，补测试
- [ ] [`841bcb8da`](https://github.com/meta/astryx/commit/841bcb8da) fix(Selector): a ghost or secondary trigger's clear and status buttons ring themselves, not the trigger too (#8874)
- [ ] [`1ef21f898`](https://github.com/meta/astryx/commit/1ef21f898) fix(Spinner): route standalone loading through the shared announcement channel (#7910)

### v0.7.11

- [x] [`66b09526b`](https://github.com/meta/astryx/commit/66b09526b) fix(core): a swizzled copy type-checks without Node's types (#10252)
  - 不适用：拷贝（swizzle）出的 React 文件没有 Node 类型时的 process 声明，Vue 版没有这条链路
- [ ] [`b3bbc3856`](https://github.com/meta/astryx/commit/b3bbc3856) fix(Selector): a searchable trigger's name carries the selected value (#10170)
- [ ] [`a5b485e92`](https://github.com/meta/astryx/commit/a5b485e92) fix(Layer, Selector): the overlay slides above the software keyboard and keeps its top (#10169)

### v0.7.12

- [x] [`bd6df76da`](https://github.com/meta/astryx/commit/bd6df76da) fix(useFocusTrap): a modal's first and last Tab stops count a radio group once, as the browser does (#10304)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [x] [`ecafbacc8`](https://github.com/meta/astryx/commit/ecafbacc8) fix(Popover): a closed popover carries no dialog role or name (#10487)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`9dca38629`](https://github.com/meta/astryx/commit/9dca38629) perf(Layer): anchored entrances play on the surface (#10561)
- [x] [`6422a1db4`](https://github.com/meta/astryx/commit/6422a1db4) refactor(Layer): one presentation hold keeps a layer's chosen presentation until its close settles (#8587)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`462048e86`](https://github.com/meta/astryx/commit/462048e86) fix(Tokenizer): forward cancel to the search source (#8777)
  - Vue 版已有：搜索源直接交给 useAsyncSource，它新一次搜索前会调用源自己的 cancel
- [x] [`619ffeb27`](https://github.com/meta/astryx/commit/619ffeb27) fix(core, richtext): no focus fade on text fields under a coarse pointer (#10611)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Tokenizer、Typeahead 在粗指针下输入框焦点外观不再淡入；文本框、文本域归输入框族
- [ ] [`1ffc0dac9`](https://github.com/meta/astryx/commit/1ffc0dac9) fix(BottomSheet): resting content starts below the grab bar, whatever the padding (#8558)
  - 暂缓：只改 Tokenizer 触屏弹层里 BottomSheet 的内容起点，Vue 版没有该弹层
- [ ] [`d69b6aa8d`](https://github.com/meta/astryx/commit/d69b6aa8d) fix(Selector): a closed list opens on the selected option, never a disabled one (#8868)
- [ ] [`dd61bd53b`](https://github.com/meta/astryx/commit/dd61bd53b) fix(Selector, MultiSelector): a query change clears the highlight from the previous list (#8871)
- [ ] [`27378eb57`](https://github.com/meta/astryx/commit/27378eb57) fix(Selector): keep the selected-item overlay on screen at the bottom edge (#10697)
- [ ] [`15098bc9f`](https://github.com/meta/astryx/commit/15098bc9f) fix(Tokenizer): the bottom sheet cancels pending search work, as the inline field does (#10637)
  - 暂缓：触屏弹层取消搜索，Vue 版没有该弹层
- [ ] [`bb0786673`](https://github.com/meta/astryx/commit/bb0786673) fix(TextInput): dispatch changeAction and update optimistic value on clear (#6425)
- [x] [`2e6162c9a`](https://github.com/meta/astryx/commit/2e6162c9a) fix(MultiSelector): opening the closed list never highlights a disabled option (#10820)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。打开时落在第一个可用选项上，不再落在禁用项；带搜索时按压打开仍高亮第一项，与上游「不高亮」略有差别
- [ ] [`aeb654c33`](https://github.com/meta/astryx/commit/aeb654c33) fix(Selector): the highlight follows its option by value when the options change (#10818)
- [ ] [`630ae5efc`](https://github.com/meta/astryx/commit/630ae5efc) refactor(Selector): the presentation controller holds its choice through the layer runtime's presentation hold (#8591)
- [ ] [`1f9217f0c`](https://github.com/meta/astryx/commit/1f9217f0c) fix(Selector): a required search Selector puts aria-required where it is allowed (#10878)
- [ ] [`0b39dd9e6`](https://github.com/meta/astryx/commit/0b39dd9e6) feat(BaseTypeahead, Typeahead): a menu config with listbox and dialog roles, and an open handle (#10544)

### v0.7.13

- [ ] [`42e482c7c`](https://github.com/meta/astryx/commit/42e482c7c) feat(Tokenizer): forward BaseTypeahead's menu, onOpenChange and open handle (#10624)
- [x] [`43fa8be5a`](https://github.com/meta/astryx/commit/43fa8be5a) Merge branch 'm2' into m3 (#10625)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0a320be62`](https://github.com/meta/astryx/commit/0a320be62) Merge branch 'm3' into m4 (#10847)

### v0.7.14

- [x] [`f881bae4b`](https://github.com/meta/astryx/commit/f881bae4b) test(Tokenizer): capture busy layout before the search settles (#11034)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`19eadab60`](https://github.com/meta/astryx/commit/19eadab60) feat(Layer): an entrance slides from the side its layer lands on (#10771)
- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [x] [`41d0d0faf`](https://github.com/meta/astryx/commit/41d0d0faf) fix(Tokenizer): a pick from the focus list keeps focus and the list open (#11031)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。聚焦清单里选一项后焦点和清单保留、下一项高亮，没有可选项或到上限就收起；顺带让 hasEntriesOnFocus 聚焦时真的展开，补测试
- [ ] [`afa75c2e8`](https://github.com/meta/astryx/commit/afa75c2e8) feat(core): make Tokenizer InputGroup-compatible (#4405)
  - 暂缓：Vue 版 Tokenizer 不读 InputGroup 上下文：缺组内由组画标签状态、跟随组尺寸、单行滚动轨道、边缘渐隐和禁用时的 Tab 停点，需要单独设计
- [ ] [`410f9b627`](https://github.com/meta/astryx/commit/410f9b627) fix(Typeahead): keep dismissed menus closed for late results (#8778)
- [x] [`fa9e7f017`](https://github.com/meta/astryx/commit/fa9e7f017) feat(ComplexSelector): add disabledMessage (#5984)
  - 已移植：[#543](https://github.com/astryx-vue/astryx-vue/pull/543)。ComplexSelector 新增 disabledMessage，内置和自定义触发器都支持，补测试和文档

### v0.7.15

- [x] [`ac1a569b2`](https://github.com/meta/astryx/commit/ac1a569b2) fix(Tokenizer): removing a token with a finger leaves the keyboard down (#8160)
  - 已移植：[#512](https://github.com/astryx-vue/astryx-vue/pull/512)。手指删除 token 时键盘不弹出
- [x] [`548f26c7c`](https://github.com/meta/astryx/commit/548f26c7c) spec(BottomSheet): a changed sheet waits at a peek while the discard dialog asks (DEC-5) (#11095)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`451e0a656`](https://github.com/meta/astryx/commit/451e0a656) fix(Tokenizer): number searches and opens in state (#10886)
  - 暂缓：触屏弹层里搜索和打开的计数，Vue 版没有该弹层

### v0.7.16

- [ ] [`be9972106`](https://github.com/meta/astryx/commit/be9972106) fix(Selector): sync its presentation refs at commit (#10917)
- [ ] [`e372e3979`](https://github.com/meta/astryx/commit/e372e3979) fix(Popover): touch growth starts where the popover meets its trigger (#10949)
- [x] [`33b3f3c91`](https://github.com/meta/astryx/commit/33b3f3c91) test(Tokenizer): the strip fade spec waits for each scroll to arrive (#11421)
  - 不适用：只改上游测试（自动初筛）

### v0.7.17

- [x] [`55e666665`](https://github.com/meta/astryx/commit/55e666665) fix(core): no press scale on a trigger whose own layer is open (#11062)
  - Vue 版已有：选择器触发器没有按压缩放，Button 的部分见 #501
- [x] [`0a765b34c`](https://github.com/meta/astryx/commit/0a765b34c) fix(MultiSelector): guard disabled caller-rendered triggers (#11480)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。MultiSelector 的 trigger 插槽属性带 aria-disabled，禁用或只读时拦下同元素上调用方的点击和按键，补测试
- [ ] [`76642a0ad`](https://github.com/meta/astryx/commit/76642a0ad) fix(core): keep disabled selectors closed on default open (#11488)
- [x] [`520e96392`](https://github.com/meta/astryx/commit/520e96392) fix(Tokenizer): show the caret in a focused empty input with no width (#11507)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。聚焦的空输入框留出光标的宽度并把这点宽度还给这一行，字段没有余地时光标也画得出来
- [x] [`87d9aef29`](https://github.com/meta/astryx/commit/87d9aef29) test(Tokenizer): a focused empty input with no field width has room for its caret (#11715)
  - 不适用：只改上游测试（自动初筛）
- [x] [`dcaa2cdf7`](https://github.com/meta/astryx/commit/dcaa2cdf7) fix(Typeahead): the result count names every match, not only the rows shown (#11629)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Typeahead、Tokenizer 之前没有结果数播报，现在搜索落定后念匹配总数，包括超出 maxMenuItems 没画出来的
- [x] [`49227ce68`](https://github.com/meta/astryx/commit/49227ce68) test(Typeahead): the FR8 count test does not count the busy start (#11764)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3137fe0df`](https://github.com/meta/astryx/commit/3137fe0df) fix(core): the active option of select, multi-select and typeahead lists carries a highlighted theme state (#11887)
- [ ] [`1bcd5bc44`](https://github.com/meta/astryx/commit/1bcd5bc44) fix(Selector, MultiSelector): a pick, or a press on a container that is no Tab stop, returns focus to the trigger (#11851)
- [ ] [`13b89818d`](https://github.com/meta/astryx/commit/13b89818d) fix(Selector): the selected row stays on the trigger as the list grows (#10062)
- [x] [`d087570b9`](https://github.com/meta/astryx/commit/d087570b9) spec(PowerSearch): an operator opts into value-only matches, suggesting complete filters from a typed value (#10009)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`c3b7f32fb`](https://github.com/meta/astryx/commit/c3b7f32fb) fix(Selector): without options, Selector and MultiSelector name the prop and the fix in development (#12386)
- [ ] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
- [ ] [`72f2d7caa`](https://github.com/meta/astryx/commit/72f2d7caa) docs: icon props take semantic names; Selector hasClear types; useTableSelectionState returns (#12583)
- [ ] [`f939a6f90`](https://github.com/meta/astryx/commit/f939a6f90) fix(core): type-to-select takes a letter typed with AltGr (#12644)
- [x] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
  - Vue 版已有：选择器列表最小宽度走 clampInlineSize，被视口上限截住；批次里其余条目属别族
- [ ] [`e5df607d2`](https://github.com/meta/astryx/commit/e5df607d2) fix(Selector, MultiSelector): inside an open shadow root, a press on a container that is no Tab stop returns focus to the trigger (#12204)
- [x] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
  - Vue 版已有：ComplexSelector 的 props 表已列出 isLabelHidden、description、labelTooltip、isOptional、isRequired；其余 PR 属别族
- [x] [`226afd33b`](https://github.com/meta/astryx/commit/226afd33b) chore: land batch 10 (3 pull requests) (#12844)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。带搜索的 MultiSelector 触发器不再带 aria-required，必填放到打开后的搜索框上，补测试；批次里的 CLI 条目不在本范围
- [x] [`ddab5b7ce`](https://github.com/meta/astryx/commit/ddab5b7ce) test(Tokenizer): the group-scroll spec waits for the story's play function (#12017)
  - 不适用：只改上游测试（自动初筛）
- [x] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
  - Vue 版已有：选择器的选项、空状态、溢出计数已用文字角色的行高令牌；Pagination 首尾标记和 doctor 见 #508、#514
- [ ] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [x] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Tokenizer 的 modelValue 不是数组、TypeaheadItem 缺 item 时开发期报明确错误；ComplexSelector 缺默认插槽的提示在 #543
- [x] [`ab9aaa5a2`](https://github.com/meta/astryx/commit/ab9aaa5a2) chore: land batch 70 (2 pull requests) (#12963)
  - 已移植：[#544](https://github.com/astryx-vue/astryx-vue/pull/544)。Tokenizer、Typeahead 新增 statusVariant，框内画状态图标，tooltip 时是能聚焦的按钮；PowerSearch 的部分在搜索族清单
- [ ] [`8ecfe59a4`](https://github.com/meta/astryx/commit/8ecfe59a4) chore: land batch 61 (4 pull requests) (#12940)
- [x] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)
  - Vue 版已有：「+N more」走 tokenizer.more 文案并按语言分组数字
- [x] [`1f04ed3e3`](https://github.com/meta/astryx/commit/1f04ed3e3) fix(Tokenizer): a collapsed unfocusedLayer field keeps a tab stop on its placeholder (#12486)
  - Vue 版已有：收起时输入框仍在 Tab 序里，聚焦后展开；禁用且有说明时输入框只读加 aria-disabled，说明显示在提示里

## 数据表格（area:core）

### v0.7.2

- [x] [`bd72a5ffe`](https://github.com/meta/astryx/commit/bd72a5ffe) spec(Table): define row activation contract (#6894)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.3

- [x] [`568283fc4`](https://github.com/meta/astryx/commit/568283fc4) spec(Table): define infinite scroll contract (#6895)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`b6923c9c0`](https://github.com/meta/astryx/commit/b6923c9c0) spec(Table): define row virtualization contract (#6896)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`4b0b8f656`](https://github.com/meta/astryx/commit/4b0b8f656) fix(core): choice controls stay focusable when disabled (#7824)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7370328f6`](https://github.com/meta/astryx/commit/7370328f6) spec(AST-009): real-AT evidence never gates merge or release (#7915)
  - 不适用：上游组件规范文档（自动初筛）

### v0.7.5

- [x] [`be8e7208c`](https://github.com/meta/astryx/commit/be8e7208c) test(a11y): add Table contract and bind Table (#7695)
  - 不适用：上游组件规范文档、只改上游测试（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b9b7d3704`](https://github.com/meta/astryx/commit/b9b7d3704) spec(Table): a drawn row divider keeps the row border (FR14); row expansion glides with animatedLayout (FR15) (#8652)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`a73f0304b`](https://github.com/meta/astryx/commit/a73f0304b) spec(Table, AST-105): tables with column lines do not glide yet (FR15) (#8679)
  - 不适用：上游组件规范文档（自动初筛）
- [x] [`a7044525d`](https://github.com/meta/astryx/commit/a7044525d) fix(core): a pinned table column draws its own row dividers (#8654)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。固定列的 ::before 伸到边框区，用固定列底色盖住表格静态画的线，再按格子自己的边框样式和颜色画分隔线；读计算样式搬运应用自定义边框的部分没做
- [ ] [`58fa49dfe`](https://github.com/meta/astryx/commit/58fa49dfe) feat(core): Table rows glide when a row's panel opens or closes, and their dividers move with them (#8656)
  - 暂缓：行在展开面板开合时滑动依赖上游的 useAnimatedLayout 布局动画系统，Vue 版还没有
  - 暂缓：行展开时下方行滑动需要 Vue 版没有的 useAnimatedLayout 动画运行时（FLIP、分隔线替身、显露裁切），上游一个提交就 1500 多行
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：上游组件规范文档、只改上游测试（自动初筛）

### v0.7.6

- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [x] [`bb18c817a`](https://github.com/meta/astryx/commit/bb18c817a) fix(Table): a column-resize handle is named by a node header's visible text (#9057)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。列宽把手按列头可见文字命名，函数式列头读它渲染出的文字，读不到才用列 key，补测试
- [x] [`8ff38ab97`](https://github.com/meta/astryx/commit/8ff38ab97) fix(Table): sort buttons and the scroll region are named by what they belong to (#9047)
  - 已移植：[#533](https://github.com/astryx-vue/astryx-vue/pull/533)。由 i18n-icons 任务的 PR 一并移植
- [x] [`891aa236c`](https://github.com/meta/astryx/commit/891aa236c) refactor(core): drop a dead private selector and collapse duplicate attribute spellings (INV23 step 4) (#9256)
  - 不适用：只删上游内部无用的私有选择器、合并重复的属性写法，Vue 版没有对应代码
- [x] [`0135af462`](https://github.com/meta/astryx/commit/0135af462) fix(core N–Z): slots use isRenderable; the remaining checks are allowed with a reason (#9206)
  - 不适用：上游 React 插槽改用 isRenderable 判断并给 lint 例外写理由，Vue 模板没有这套检查
- [x] [`2babd6693`](https://github.com/meta/astryx/commit/2babd6693) perf(Table): a re-sort moves rows without re-rendering them in keyed tables with no row indexing or body-row plugin (#9234)
  - 不适用：React memo 下重排不重渲染行的优化；Vue 带 key 的 v-for 重排时本来就只移动 DOM
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`a62ce8592`](https://github.com/meta/astryx/commit/a62ce8592) docs(spec): TableRow and the Table sections record their shipped contract as current (#9143)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f77aaf206`](https://github.com/meta/astryx/commit/f77aaf206) docs(spec): TableCell, TableHeaderCell, and TableSelectionToolbar record their shipped contract as current (#9271)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`eb6d2cc12`](https://github.com/meta/astryx/commit/eb6d2cc12) fix(ContextMenu): a context menu mounts its layer at its first open, so a large Table shows its rows in seconds in Safari (#9278)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7e58a0792`](https://github.com/meta/astryx/commit/7e58a0792) spec(Table): the glide's tests back FR14 and FR15; a gliding divider's 1 px WebKit step at a pinned cell is a known gap (#9333)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`69fb25721`](https://github.com/meta/astryx/commit/69fb25721) test(rtl): RTL coverage for ContextMenu, TableHeaderCell, TableCell and TableSelectionToolbar (#9286)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`16fe5f199`](https://github.com/meta/astryx/commit/16fe5f199) fix(core): Table, Chat, CommandPalette and the date and time inputs carry only their own English (#9452)
  - Vue 版已有：Vue 版每个组件只通过 useComponentMessages 按命名空间读自己的内置文案，check:i18n-catalog 第 8 条已在检查
- [x] [`9728cd78b`](https://github.com/meta/astryx/commit/9728cd78b) spec(react-component-runtime, TreeList, Table, CommandPalette): record empty slots rendering nothing (backfill) (#9388)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.7

- [x] [`7c996518c`](https://github.com/meta/astryx/commit/7c996518c) test(Table): hold each row glide as it starts, not a frame later (#9581)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c1ba7f39e`](https://github.com/meta/astryx/commit/c1ba7f39e) spec(Table): complete approved flat-data v1 contracts
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.8

- [x] [`6246298b4`](https://github.com/meta/astryx/commit/6246298b4) fix(Table): a resize handle never adds to its column header's name (#9736)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。有拖动把手的列头用 aria-labelledby 指向标题块，把手的宽度值不再混进列头名字，补测试
- [x] [`acca58968`](https://github.com/meta/astryx/commit/acca58968) fix(core): a long press held through a busy main thread still reports, on the touch events' clock (#9455)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e70850f04`](https://github.com/meta/astryx/commit/e70850f04) fix(Selector): the listbox is named by the field label in every presentation (#9737)
  - 不适用：只改上游测试（自动初筛）
- [x] [`aa4bd1d3d`](https://github.com/meta/astryx/commit/aa4bd1d3d) refactor(core): useLongPress runs its long press through a detector with no React (#9642)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
  - 不适用：只给 React useEffect 加注释
- [x] [`dcf3d6f86`](https://github.com/meta/astryx/commit/dcf3d6f86) feat(Tokenizer): presentation is a stable prop, and adaptive is its default (#9796)
  - 不适用：Tokenizer 的 presentation 属性；Vue 版表格的多选筛选用 MultiSelector，不用 Tokenizer
- [x] [`246c51d46`](https://github.com/meta/astryx/commit/246c51d46) spec(Table): define row-specific expansion control names (#9859)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`31ab2c3ef`](https://github.com/meta/astryx/commit/31ab2c3ef) feat(Table): add row-specific expansion labels (#6776)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。useTableRowExpansion 和 useTableTreeData 新增 getRowLabel，按钮名字带上行名，空白时退回通用文案，补文案、文档和测试
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [x] [`504ee1863`](https://github.com/meta/astryx/commit/504ee1863) fix(theme): the stock theme's dark-mode accent is darker, so white button text meets 4.5:1 (#9818)
  - 已移植：[#506](https://github.com/astryx-vue/astryx-vue/pull/506)。排序优先级数字改用 text-accent（table.css 已是 --astryx-color-text-accent）；暗色 accent 默认值在主题包，不适用
- [x] [`8daca9307`](https://github.com/meta/astryx/commit/8daca9307) test(Table): time the render benchmarks in CPU, not elapsed time (#8472)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5c91e81ee`](https://github.com/meta/astryx/commit/5c91e81ee) fix(Layer): a closed layer's trigger is no CSS anchor (#9963)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ca2b80bc8`](https://github.com/meta/astryx/commit/ca2b80bc8) test(Table): the re-sort cases read 1,000 rows without the hidden check (#9970)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3b8d81fd0`](https://github.com/meta/astryx/commit/3b8d81fd0) spec: record component icon slots in CodeBlock, Timestamp, and Table (#10045)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`f85b20173`](https://github.com/meta/astryx/commit/f85b20173) feat(Table): the sort indicator resolves its glyph through the table-sort-indicator icon slot (#9831)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。Table 排序指示走 table-sort-indicator 图标槽位
- [x] [`c037450fc`](https://github.com/meta/astryx/commit/c037450fc) feat(Table): the row-expansion toggle resolves its glyph through the table-row-expand icon slot (#9834)
  - 已移植：[#502](https://github.com/astryx-vue/astryx-vue/pull/502)。Table 行展开走 table-row-expand 图标槽位
- [x] [`5f8a80903`](https://github.com/meta/astryx/commit/5f8a80903) docs(useTableSortableState): add hook docs and a multi-sort orders example block (#9911)
  - 已移植：[#540](https://github.com/astryx-vue/astryx-vue/pull/540)。useTableSortable 文档补 useTableSortableState 的参数、返回值、缺失值排序规则和多列排序示例

### v0.7.10

- [x] [`6fc74f94a`](https://github.com/meta/astryx/commit/6fc74f94a) fix(Table): the state hooks' latest-value refs are written at commit (#10176)
  - 不适用：React 在挂起的 transition 里丢弃渲染时 ref 写早了的问题；Vue 回调在点击时读最新配置
- [x] [`8bd8c6146`](https://github.com/meta/astryx/commit/8bd8c6146) fix(core): layout glides play the theme's move curve, not a spring (#10236)
  - 不适用：只改上游测试（自动初筛）

### v0.7.11

- [x] [`66b09526b`](https://github.com/meta/astryx/commit/66b09526b) fix(core): a swizzled copy type-checks without Node's types (#10252)
  - 不适用：拷贝（swizzle）出的 React 文件没有 Node 类型时的 process 声明，Vue 版没有这条链路
- [x] [`089f7a078`](https://github.com/meta/astryx/commit/089f7a078) test: cut the jsdom style work that times out UI suites under load (#10285)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0ecd324bf`](https://github.com/meta/astryx/commit/0ecd324bf) fix(core): a block-edge reveal slides its parts on the glide's frames (#10296)
  - 暂缓：块边缘揭示随布局动画滑动，依赖上游 useAnimatedLayout 动画系统，Vue 版还没有
  - 暂缓：依赖 58fa49dfe 的行滑动动画，前者暂缓所以一起暂缓
- [x] [`20ab99287`](https://github.com/meta/astryx/commit/20ab99287) test(Table): hold the row glide before reading chevron timing (#10329)
  - 不适用：只改上游测试（自动初筛）

### v0.7.12

- [x] [`4e6e67df6`](https://github.com/meta/astryx/commit/4e6e67df6) fix(core): make disabled Button focusable via aria-disabled per AST-085 (#7906)
  - 不适用：只改上游测试（自动初筛）
- [x] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
  - 不适用：React context 多副本问题
- [x] [`5e0f3d3cb`](https://github.com/meta/astryx/commit/5e0f3d3cb) feat(Table): plugins get an immutable row and render context; useTableRowIndex numbers from it (#10171)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。useTableRowIndex 的 data 改为可选，不传时按表格渲染出的位置编号；只读上下文的插件协议是 React memo 设施，不适用
- [x] [`2497956e3`](https://github.com/meta/astryx/commit/2497956e3) fix(Table): a muted row-expansion panel slides in with its content (#10403)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。弱化面板的底色从行挪到面板格子上，静止时外观不变
- [x] [`7cb107c5b`](https://github.com/meta/astryx/commit/7cb107c5b) fix(Table): the scroll wrapper and tree toggles draw the shared focus ring (#8873)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。滚动区和树形展开按钮画共用焦点环，滚动区的环收进框内让开 Card 边框，紧凑档树形按钮的环收进按钮
- [x] [`22b0599b4`](https://github.com/meta/astryx/commit/22b0599b4) fix(TableTree): rows carry no aria-expanded; the expander button does (#10538)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。树形表格的行不再带 aria-expanded，只在展开按钮上
- [x] [`34a73b63d`](https://github.com/meta/astryx/commit/34a73b63d) test(Table): the focus-ring case finds the tree expander by its own state (#10605)
  - 不适用：只改上游测试（自动初筛）
- [x] [`289e7cf22`](https://github.com/meta/astryx/commit/289e7cf22) docs(specs): windowed Table row-number columns fit their last logical position (#10666)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1378a95f8`](https://github.com/meta/astryx/commit/1378a95f8) perf(Table): build the row-index column once per plugin (#10654)
  - 不适用：React 下每次渲染新建行号列导致整表重渲染的优化；Vue 按响应式依赖更新，不按列对象身份 memo
- [x] [`df5f6926e`](https://github.com/meta/astryx/commit/df5f6926e) docs(useTableColumnSettingsState): add hook docs and a column visibility picker example block (#10652)
  - Vue 版已有：use-table-column-settings 文档已有 useTableColumnSettingsState 的参数、返回值和列显隐示例
- [x] [`17f6985ed`](https://github.com/meta/astryx/commit/17f6985ed) fix(Layout): a full-bleed Table or List row takes the rounded container corner it reaches (#10586)
  - 暂缓：需要 Card、Dialog 发布容器圆角（--_container-corner-*）的设施，属于布局族，Vue 版还没有；Table 一侧只是读取它
  - 已移植：[#549](https://github.com/astryx-vue/astryx-vue/pull/549)。Card 发布圆角变量，贴边的表格滚动区跟着卡片圆角；Dialog 里的表格本来不贴边，List 贴边圆角不在表格任务范围
- [x] [`d0ab3cb26`](https://github.com/meta/astryx/commit/d0ab3cb26) feat(core): add the shared list-windowing module and Table's capability hook (#10656)
  - 暂缓：共用的列表窗口化模块和 useTableRowsVirtualization，Vue 版没有行虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。共用列表窗口模块放在 composables/internal/listWindow，表格按插件声明判断能否窗口化
- [x] [`0d7557304`](https://github.com/meta/astryx/commit/0d7557304) feat(Table): add the window controller and Table's shared-geometry runtime (#10657)
  - 暂缓：窗口控制器和表格共享几何运行时，属于行虚拟化设施，Vue 版没有
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。窗口控制器和共用几何测量（滚动监听 + ResizeObserver）
- [x] [`5b3e17bb2`](https://github.com/meta/astryx/commit/5b3e17bb2) feat(Table): window fixed-height flat tables through useTableRowsVirtualization (#8280)
  - 暂缓：定高扁平表格的行窗口化，依赖还没有的虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。新增 useTableRowsVirtualization，定高扁平行只挂载视口附近的行，不满足条件时退回全部渲染
- [x] [`90ebe00a2`](https://github.com/meta/astryx/commit/90ebe00a2) feat(Table): window tables that use selection and row index (#10658)
  - 暂缓：选择列、行号列参与行窗口化，依赖还没有的虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。带多选和序号的表格也能窗口化；Vue 版序号列固定 48px，不需要按位数加宽
- [x] [`c5ad42fe0`](https://github.com/meta/astryx/commit/c5ad42fe0) fix(Table): a plugin's scroll-wrapper className reaches the scroll container (#10702)
  - 不适用：插件的 transformScrollWrapper className 合并问题；Vue 版插件没有改滚动容器 props 的接口
- [x] [`7f04a6c5a`](https://github.com/meta/astryx/commit/7f04a6c5a) fix(Table): an unbounded column's resize handle announces a range that holds its width (#10577)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。没有最大宽度的列，把手以窗口宽度作替代 aria-valuemax（不低于当前值），并用 aria-valuetext 念出像素数，补文案和测试
- [x] [`1785da1e7`](https://github.com/meta/astryx/commit/1785da1e7) fix(Table): a column resize handle announces the column's rendered width (#10593)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。把手的 aria-valuenow 读表头格实际渲染宽度（共用尺寸观察器），范围放宽到能装下当前值，补测试
- [x] [`da3dbdc8b`](https://github.com/meta/astryx/commit/da3dbdc8b) fix(Table): a swizzled Table honors the package's virtualization capability (#10798)
  - 不适用：swizzle 出的 Table 读包里的虚拟化能力，Vue 版没有 swizzle 也没有虚拟化
- [x] [`a0a09f9c2`](https://github.com/meta/astryx/commit/a0a09f9c2) docs(TableSelectionToolbar): a recipe for selecting every matching row across server pages (#10271)
  - 已移植：[#540](https://github.com/astryx-vue/astryx-vue/pull/540)。TableSelectionToolbar 文档补跨服务端分页「选中全部匹配行」的做法
- [x] [`6c5c460d7`](https://github.com/meta/astryx/commit/6c5c460d7) fix(Table): keep column settings' active keys in state (#10911)
  - 不适用：React 丢弃渲染后列设置配置残留的问题；Vue 插件每次从 getter 读最新配置
- [x] [`52356e690`](https://github.com/meta/astryx/commit/52356e690) feat(Table): useTableRowsVirtualization's viewportHeight becomes initialViewportHeight, which no longer sizes the Table (#10894)
  - 暂缓：useTableRowsVirtualization 的参数改名和表格高度规则，依赖还没有的虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。配置改为 initialViewportHeight，表格高度由父元素决定并在里面滚动

### v0.7.13

- [x] [`42f1a7615`](https://github.com/meta/astryx/commit/42f1a7615) test(Table): add Chromium accessibility and 1k/10k/100k release evidence for row windowing (#10659)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1ac0c2464`](https://github.com/meta/astryx/commit/1ac0c2464) refactor(core): one shared list-windowing engine, with Table as its first consumer (#10810)
  - 暂缓：共用列表窗口化引擎的重构，Vue 版没有虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。窗口引擎与表格解耦，表格作为第一个使用方
- [x] [`fcf92864d`](https://github.com/meta/astryx/commit/fcf92864d) test(Table): isolate the release timing proof and gate its timing on the release runner (#11055)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）

### v0.7.14

- [x] [`8f935dfd2`](https://github.com/meta/astryx/commit/8f935dfd2) spec(Table): windowing keeps going at a row height every mounted row shares (#10999)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`dcc88232c`](https://github.com/meta/astryx/commit/dcc88232c) fix(Table): windowing keeps going at a row height every mounted row shares (#11000)
  - 暂缓：窗口化在所有行同高时继续，依赖还没有的虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。所有挂载行一起变高时按量到的行高继续窗口化，行高不一时退回
- [x] [`f26571e10`](https://github.com/meta/astryx/commit/f26571e10) spec(Table): column virtualization windows the unpinned columns (#11013)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.15

- [x] [`f2293a53e`](https://github.com/meta/astryx/commit/f2293a53e) fix(Table): sort only when the data or the sort changes (#10942)
  - Vue 版已有：useTableSortableState 在 setup 里只建一次 collator，sortedData 是 computed，只在数据、排序或语言变化时重排
- [x] [`f89098368`](https://github.com/meta/astryx/commit/f89098368) fix(Table): key its column and plugin caches on identities (#10940)
  - 不适用：React 渲染期间写缓存被丢弃渲染污染的问题，Vue 用 computed 不存在
- [x] [`8caa06274`](https://github.com/meta/astryx/commit/8caa06274) fix(Table): call the latest onSortChange; read sort and snap-point values directly in render (#11349)
  - Vue 版已有：useTableSortable 点击时用 toValue(config) 读最新的 onSortChange 和排序状态

### v0.7.16

- [x] [`58b844d16`](https://github.com/meta/astryx/commit/58b844d16) feat(Table): Promise-based infinite loading with useTableInfiniteScroll (#10570)
  - 已移植：[#540](https://github.com/astryx-vue/astryx-vue/pull/540)。新增 useTableInfiniteScroll：共用请求锁、IntersectionObserver 自动加载、常驻「加载更多」按钮、失败暂停自动加载、首批加载时不显示默认空状态、加载完把焦点交给滚动区
- [x] [`10bae0687`](https://github.com/meta/astryx/commit/10bae0687) feat(Table): useTableColumnsVirtualization windows the unpinned columns (#11014)
  - 暂缓：列虚拟化 useTableColumnsVirtualization，依赖还没有的虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。新增 useTableColumnsVirtualization，只窗口化固定列之间的列
- [x] [`54dd64e1d`](https://github.com/meta/astryx/commit/54dd64e1d) fix(Table): useTableSortableState calls the committed onSortChange (#11433)
  - Vue 版已有：useTableSortableState 的 sortConfig.onSortChange 直接写当前的 sort ref，没有过期回调
- [x] [`ef87167d0`](https://github.com/meta/astryx/commit/ef87167d0) feat(Table): column windowing retains the focused column and anchors the first visible column (#11018)
  - 暂缓：列窗口化保留焦点列和锚定首列，依赖还没有的虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。列窗口保留有焦点的列，并锚定第一可见列
- [x] [`51bc1857b`](https://github.com/meta/astryx/commit/51bc1857b) feat(Table): rows and columns window together (#11019)
  - 暂缓：行列同时窗口化，依赖还没有的虚拟化设施
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。行列两个插件可以一起窗口化
- [x] [`130e5da2d`](https://github.com/meta/astryx/commit/130e5da2d) feat(DateInput, DateTimeInput, TimeInput, FormLayout): entryErrorBehavior and a form default (#11485)
  - Vue 版已有：Vue 版 DateInput 还没有 entryErrorBehavior，表格筛选里的日期输入一直是 complete 行为

### v0.7.17

- [x] [`e41a6d8e4`](https://github.com/meta/astryx/commit/e41a6d8e4) test(table): column windowing reads rows after the scroll area's frames, with boxes that move with the scroll (#11552)
  - 不适用：只改上游测试（自动初筛）
- [x] [`8931e819c`](https://github.com/meta/astryx/commit/8931e819c) fix(Table, ContextMenu): a sortable column's resize line sits on its column edge (#11576)
  - Vue 版已有：Vue 版表头没有定位的右键菜单包裹层，拖动把手直接相对 th 定位在列边上
- [x] [`b36275ed0`](https://github.com/meta/astryx/commit/b36275ed0) feat(core): TableRow exposes a selected theme state (#11729)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。被 useTableSelection 选中的行带 table-row 主题目标的 selected 状态，选中底色读 --color-accent-muted
- [x] [`bf845a523`](https://github.com/meta/astryx/commit/bf845a523) fix(Table): a column range change renders only the cells that enter (#11481)
  - 暂缓：列窗口范围变化只渲染新进入的格子，属于列虚拟化，Vue 版没有
  - 已移植：[#547](https://github.com/astryx-vue/astryx-vue/pull/547)。列范围变化时按列键复用已有格子，只渲染新进来的格子
- [x] [`851cc902e`](https://github.com/meta/astryx/commit/851cc902e) test(Table): column windowing follows a right-to-left scroll and keeps its anchor there (#11823)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ce0feb506`](https://github.com/meta/astryx/commit/ce0feb506) fix(core): a Table bleeds to a block edge only as its container's direct first or last child (#12068)
  - Vue 版已有：table.css 只对容器的直接首个、末个子元素抵消上下内边距（tableBleedCss.test.ts 已覆盖）
- [x] [`d3aa8079c`](https://github.com/meta/astryx/commit/d3aa8079c) fix(core): Table tree rows follow the disclosure pattern (#12127)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。树形表格按披露模式：行不带 aria-level，展开按钮展开时用 aria-controls 指向直接子行，补测试
- [x] [`ab67aa1eb`](https://github.com/meta/astryx/commit/ab67aa1eb) feat(core): a table header cell shows its full heading in a tooltip on keyboard focus when the heading is cut short (#12175)
  - 已移植：[#505](https://github.com/astryx-vue/astryx-vue/pull/505)。表头标题被截短时聚焦显示完整标题
- [x] [`37db386f8`](https://github.com/meta/astryx/commit/37db386f8) fix(table): a narrow header truncates its label so its sort and filter controls stay in the cell (#12312)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。表头标题包一层 label，窄列里先省略，排序箭头和筛选按钮留在格子里
- [x] [`771f5c51f`](https://github.com/meta/astryx/commit/771f5c51f) docs(useTableSortable): the plugin does not reorder rows; show how to sort data (#12493)
  - 已移植：[#540](https://github.com/astryx-vue/astryx-vue/pull/540)。useTableSortable 文档说明插件不重排行，给出自己排和用 useTableSortableState 两种写法
- [x] [`6ff24e4e5`](https://github.com/meta/astryx/commit/6ff24e4e5) docs(Table, useToast): row open, selection, plugin, empty-state and toast-option answers (#12344)
  - 已移植：[#540](https://github.com/astryx-vue/astryx-vue/pull/540)。Table 文档补「用格子里的链接或按钮打开行」、自定义插件能改什么、空状态建议；筛选文档说明插件不删行
- [x] [`72f2d7caa`](https://github.com/meta/astryx/commit/72f2d7caa) docs: icon props take semantic names; Selector hasClear types; useTableSelectionState returns (#12583)
  - Vue 版已有：use-table-selection-state 文档已有 selectionConfig、selectionState 各字段的返回值说明
- [x] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。滚动区内层内容盒加内联 overflow: visible，宿主给表格父元素写 overflow-x 时滚动区仍是唯一视口
- [x] [`8c52e3bba`](https://github.com/meta/astryx/commit/8c52e3bba) chore: land batch 7 (3 pull requests) (#12811)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9e445ba0d`](https://github.com/meta/astryx/commit/9e445ba0d) chore: land batch 15 (5 pull requests) (#12859)
  - 已移植：[#540](https://github.com/astryx-vue/astryx-vue/pull/540)。文档说明表格插件钩子要显式传行类型 T；其余几项属于 CLI 导出和 Markdown，不在本族
- [x] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
  - 已移植  #514：[#508](https://github.com/astryx-vue/astryx-vue/pull/508)。Pagination 首尾标记、文字角色行高；doctor 字体检查不适用
- [x] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。粗指针设备上横向能滚时藏着内容的一侧淡出，固定列所在一侧关掉淡出
- [x] [`904b58e64`](https://github.com/meta/astryx/commit/904b58e64) chore: land batch 29 (3 pull requests) (#12894)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。数据模式表体行带 table-row 主题目标的 parity，斑马纹表格的行带 striped，手写行列的行只带 striped；主题给行设的底色经 --table-row-overlay 带到固定列
- [x] [`b871bc6d1`](https://github.com/meta/astryx/commit/b871bc6d1) chore: land batch 28 (2 pull requests) (#12892)
  - Vue 版已有：Vue 版 TableSelectionToolbar 的 selection 可选，没有时回落到 count，不会在组件内部报 TypeError
- [x] [`31b52d0cb`](https://github.com/meta/astryx/commit/31b52d0cb) chore: land batch 34 (2 pull requests) (#12908)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。手写行列的表格放不下时横向滚动，列跟着内容走，不再把单词压到一个字母宽
- [x] [`476d9063f`](https://github.com/meta/astryx/commit/476d9063f) chore: land batch 63 (3 pull requests) (#12945)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。排序把 NaN 和 Invalid Date 当缺失值，Date 按时间排，不再抛错
- [x] [`08491e55c`](https://github.com/meta/astryx/commit/08491e55c) chore: land batch 77 (3 pull requests) (#12973)
  - 已移植  #540：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。数据模式列标题跟着 textOverflow 折行，截短提示只在 truncate 下出现；文档补长单词换行说明
- [x] [`59fd4151b`](https://github.com/meta/astryx/commit/59fd4151b) chore: land batch 82 (7 pull requests) (#12992)
  - 已移植：[#539](https://github.com/astryx-vue/astryx-vue/pull/539)。默认单元格把 Invalid Date 显示为空格子，树形列同样生效
- [x] [`fc40575d9`](https://github.com/meta/astryx/commit/fc40575d9) fix(Table): a column-windowed scroll that keeps its columns renders the table once (#11826)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7fcbf026e`](https://github.com/meta/astryx/commit/7fcbf026e) chore: land batch 98 (1 pull requests) (#13059)
  - 已移植：[#540](https://github.com/astryx-vue/astryx-vue/pull/540)。文档补比较函数规则（数组、对象没有排序文字，Date 按时间）和 Table 没有行点击属性

## 主题系统与设计变量（area:core）

### v0.7.2

- [ ] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)
- [x] [`7c206edbb`](https://github.com/meta/astryx/commit/7c206edbb) feat(List): one edge prop for padded, flush, outset, and bleed rows (#7592)
  - 不适用：只改上游测试（自动初筛）
- [x] [`52c26fb74`](https://github.com/meta/astryx/commit/52c26fb74) fix(TreeList): keep nested rows full width and indent their content (#7602)
  - 不适用：只改上游测试（自动初筛）

### v0.7.3

- [x] [`b1e1936bb`](https://github.com/meta/astryx/commit/b1e1936bb) fix(core): provide dataVars defaults in prebuilt CSS (#7694)
  - 不适用：上游内部规范和架构文档、上游仓库脚本（自动初筛）

### v0.7.5

- [x] [`ad2646109`](https://github.com/meta/astryx/commit/ad2646109) spec(AST-087): icon variants, theme sizes, and componentIcons state resolvers (#7847)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`1f3559072`](https://github.com/meta/astryx/commit/1f3559072) fix(cli): stop requiring fallbacks for raw data-token uses in astryx upgrade (#7912)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`443b80317`](https://github.com/meta/astryx/commit/443b80317) spec(theme-tokens): name colour tokens by one grammar (#8103)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）
- [x] [`4d9de87a1`](https://github.com/meta/astryx/commit/4d9de87a1) spec(theme): surface-specific status color roles (#8116)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a88f185a1`](https://github.com/meta/astryx/commit/a88f185a1) fix(core): a card's press overlay paints a finger's press (#8057)
  - 不适用：只改上游测试（自动初筛）
- [x] [`10ca8eaee`](https://github.com/meta/astryx/commit/10ca8eaee) spec(AST-012): compact is width below md or height below 500 on every platform (#8274)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`c743ae000`](https://github.com/meta/astryx/commit/c743ae000) spec(design): under reduced motion, touch cross-fades and other pointers change at once (#8272)
- [ ] [`2763bcc37`](https://github.com/meta/astryx/commit/2763bcc37) feat(theme): export the compact definition (AST-012 FR9) (#8301)
- [x] [`ebfae1a3d`](https://github.com/meta/astryx/commit/ebfae1a3d) spec(architecture): components are built from minimal DOM (#8300)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`28317b054`](https://github.com/meta/astryx/commit/28317b054) fix(Layout): collapse header/footer padding with sibling markers, not :has() followed by * (#8417)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b023d1c82`](https://github.com/meta/astryx/commit/b023d1c82) spec(AST-102): typography stays theme-owned, and a text size the person set wins (#8351)
- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [x] [`61480b5c2`](https://github.com/meta/astryx/commit/61480b5c2) chore(core): the touch motion tables register FR4's roles as internal motion roles (#8257)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2af4d305a`](https://github.com/meta/astryx/commit/2af4d305a) feat(Popover): presentation — a BottomSheet on a phone when asked, as iOS presents a popover (#8229)
- [ ] [`ab0db1f73`](https://github.com/meta/astryx/commit/ab0db1f73) spec(AST-108): theme motion is three knobs — tempo, character, reducedMotion (#8613)
- [x] [`a7044525d`](https://github.com/meta/astryx/commit/a7044525d) fix(core): a pinned table column draws its own row dividers (#8654)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1b8e9103f`](https://github.com/meta/astryx/commit/1b8e9103f) docs(theme): an extending theme's motion inherits field by field (#8748)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`05ead02aa`](https://github.com/meta/astryx/commit/05ead02aa) feat(Icon): a theme icon entry can be a function of the requested size (#8753)
- [ ] [`db584bcb0`](https://github.com/meta/astryx/commit/db584bcb0) feat(Icon): a theme's width and height on an Icon size set its glyph dimension (#8759)
- [ ] [`dae174730`](https://github.com/meta/astryx/commit/dae174730) feat(theme): a theme lists its icon variant names once (#8756)
- [ ] [`33645a2d2`](https://github.com/meta/astryx/commit/33645a2d2) feat(Icon): request a theme's alternate icon artwork with variant (#8758)
- [ ] [`eb3e53943`](https://github.com/meta/astryx/commit/eb3e53943) feat(cli): built themes keep function icon entries and type their icon variants (#8785)
- [x] [`58fa49dfe`](https://github.com/meta/astryx/commit/58fa49dfe) feat(core): Table rows glide when a row's panel opens or closes, and their dividers move with them (#8656)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
- [ ] [`c9066fe8b`](https://github.com/meta/astryx/commit/c9066fe8b) feat(tokens): add --ease-exit, the curve BottomSheet already closes on (#8004)

### v0.7.6

- [ ] [`f277e2580`](https://github.com/meta/astryx/commit/f277e2580) fix(core): a single esbuild bundle renders Core: lazily imported modules import Core directly, not through barrels (#9055)
- [x] [`0d67f0f6b`](https://github.com/meta/astryx/commit/0d67f0f6b) fix(ProgressBar): a determinate fill keeps moving while JavaScript runs (#8196)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`0ef60ddb6`](https://github.com/meta/astryx/commit/0ef60ddb6) feat(core): a theme's motion takes tempo and character (#8661)
- [ ] [`995036e69`](https://github.com/meta/astryx/commit/995036e69) fix(Toast): a Theme in fallback-viewport toast content stays nested and never rewrites <html> (#9253)
- [ ] [`6127f4d0d`](https://github.com/meta/astryx/commit/6127f4d0d) fix(useTheme): a mode outside light|dark|system resolves like system (#9254)
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4fdcebcc5`](https://github.com/meta/astryx/commit/4fdcebcc5) docs(spec): Theme, MediaTheme, and SyntaxTheme record their shipped contracts as current (#9350)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
  - 不适用：只改上游测试（自动初筛）
- [x] [`844f28bbc`](https://github.com/meta/astryx/commit/844f28bbc) spec(theme-application): record the typed mode and its system fallback (backfill) (#9386)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.7

- [x] [`d40b5b7a5`](https://github.com/meta/astryx/commit/d40b5b7a5) chore(ChatMessage): give the avatar offset variable a private literal name (#9602)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3b3052a69`](https://github.com/meta/astryx/commit/3b3052a69) feat(ProgressBar): UIProgressView's timing under a finger (#8225)
  - 不适用：只改上游测试（自动初筛）
- [x] [`80cba260f`](https://github.com/meta/astryx/commit/80cba260f) feat(ProgressBar): under reduced motion the indeterminate bar pulses in place (#8239)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [x] [`30160f5ce`](https://github.com/meta/astryx/commit/30160f5ce) feat(core): PowerSearch touch sheet flow behind experimental.presentation (#8001)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a81487737`](https://github.com/meta/astryx/commit/a81487737) feat(core): a first-party indicator can paint its own press (#9716)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2c925f794`](https://github.com/meta/astryx/commit/2c925f794) refactor(core): a theme's reduced-motion mark, internal until 'always' ships (#9761)
- [ ] [`9889a3438`](https://github.com/meta/astryx/commit/9889a3438) chore(core): name the system that 88 kept Effects sync (#9787)
- [ ] [`0d54fd3e7`](https://github.com/meta/astryx/commit/0d54fd3e7) fix(theme): add the --duration-exit token, defaulting to --duration-fast (#9798)
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [x] [`ed9b75b81`](https://github.com/meta/astryx/commit/ed9b75b81) fix(Spinner): a turning ring wakes the main thread once in 100 turns (#9936)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a0c48b8d7`](https://github.com/meta/astryx/commit/a0c48b8d7) docs(AST-105, AST-108): glides and tap-to-expand play the theme's motion tokens (#9964)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`504ee1863`](https://github.com/meta/astryx/commit/504ee1863) fix(theme): the stock theme's dark-mode accent is darker, so white button text meets 4.5:1 (#9818)
- [ ] [`7f8de290c`](https://github.com/meta/astryx/commit/7f8de290c) fix(core): a press's release fades on the theme's exit motion tokens (#9890)
- [x] [`de1be1fd9`](https://github.com/meta/astryx/commit/de1be1fd9) fix(CircularProgress): the indeterminate ring turns with Spinner's rotor (#8256)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7b71d71b4`](https://github.com/meta/astryx/commit/7b71d71b4) feat(List): a row's touch target grows toward 44 px where its neighbors leave room (#8085)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a6a9b9c50`](https://github.com/meta/astryx/commit/a6a9b9c50) fix(CheckboxListItem): a row answers a finger the same wherever it lands (#8212)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`ceefccdfc`](https://github.com/meta/astryx/commit/ceefccdfc) feat(core): the animator's springs follow the theme's tempo (#8677)
- [x] [`7e69f91dc`](https://github.com/meta/astryx/commit/7e69f91dc) fix(core): an anchored layer that would run under the software keyboard ends above it (#8208)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`98efdf183`](https://github.com/meta/astryx/commit/98efdf183) feat(Icon): a theme maps a component's own icon role by slot, starting with CodeBlock's copy button (#9828)
- [x] [`813c58c02`](https://github.com/meta/astryx/commit/813c58c02) fix(Toast): a toast plays its entrance once (#10086)
  - 不适用：只改上游测试（自动初筛）
- [x] [`83b99dd45`](https://github.com/meta/astryx/commit/83b99dd45) test(theme): fail when a prop that selects painted styles never reaches themeProps() (#10147)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`eaea67de3`](https://github.com/meta/astryx/commit/eaea67de3) fix(Link): a hovered label takes the root's hover color, matching its underline and icon (#10142)

### v0.7.10

- [x] [`27211b797`](https://github.com/meta/astryx/commit/27211b797) fix(Code): reflect size on the code theme target (#10186)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6d8e4c309`](https://github.com/meta/astryx/commit/6d8e4c309) fix(Toast): a moved toast's card starts no transition (#10223)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e773f026f`](https://github.com/meta/astryx/commit/e773f026f) test(theme): the painted-axis guard shares the themeProps() key reader and states what it counts (#10222)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f36e57c50`](https://github.com/meta/astryx/commit/f36e57c50) docs(spec): Skeleton radius is callsite geometry and is not reflected (#10221)
  - 不适用：只改上游测试（自动初筛）

### v0.7.11

- [ ] [`65d2e5268`](https://github.com/meta/astryx/commit/65d2e5268) fix(theme): chat-composer borderRadius and padding set the composer's derived vars (#10249)
- [ ] [`ddedd4c58`](https://github.com/meta/astryx/commit/ddedd4c58) [Spec] motion DEC-1: every hover-to-display interaction is debounced (#7327)
- [x] [`a5b485e92`](https://github.com/meta/astryx/commit/a5b485e92) fix(Layer, Selector): the overlay slides above the software keyboard and keeps its top (#10169)
  - 不适用：只改上游测试（自动初筛）
- [x] [`47949436a`](https://github.com/meta/astryx/commit/47949436a) fix(core): StatusDot status dots paint their icon role (#10204)
  - 不适用：上游仓库脚本（自动初筛）
- [x] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)
  - 不适用：只改上游测试（自动初筛）

### v0.7.12

- [x] [`c3cef9f67`](https://github.com/meta/astryx/commit/c3cef9f67) docs(records): Kbd, LayerProvider and theming-surface verification follow-ups (#10299)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`fa6174fa5`](https://github.com/meta/astryx/commit/fa6174fa5) fix(Theme): keep shared injected CSS until the last Theme instance unmounts (#10178)
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [x] [`732c33874`](https://github.com/meta/astryx/commit/732c33874) fix(themes): Butter, Stone and Y2K set supporting text in rem (#10320)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7bc8230f8`](https://github.com/meta/astryx/commit/7bc8230f8) fix(Button): a labelled button grows with its label (#10588)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`74f1fb96f`](https://github.com/meta/astryx/commit/74f1fb96f) fix(theme): a themed :active follows the touch press model (#10420)
- [x] [`17f6985ed`](https://github.com/meta/astryx/commit/17f6985ed) fix(Layout): a full-bleed Table or List row takes the rounded container corner it reaches (#10586)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7bdeb06d7`](https://github.com/meta/astryx/commit/7bdeb06d7) fix(theme): text follows the reader's text size in Safari on iPhone, in every theme (#10416)
- [x] [`05879b7e6`](https://github.com/meta/astryx/commit/05879b7e6) docs(AST-102): FR3 ties Android text size to the text-scale meta, verified on Chromium (#10531)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`7bd08bbe5`](https://github.com/meta/astryx/commit/7bd08bbe5) fix(theme): Android text follows the system font scale with no setup (#10727)
- [x] [`4d1c796ca`](https://github.com/meta/astryx/commit/4d1c796ca) docs(AST-102): Chrome on Android verifies FR3 without the text-scale meta on a hardware device (#10941)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`52356e690`](https://github.com/meta/astryx/commit/52356e690) feat(Table): useTableRowsVirtualization's viewportHeight becomes initialViewportHeight, which no longer sizes the Table (#10894)
  - 不适用：只改上游测试（自动初筛）

### v0.7.14

- [x] [`3e59cc8ec`](https://github.com/meta/astryx/commit/3e59cc8ec) docs(cli): token tables say their values are Core's defaults (#11089)
  - 不适用：上游仓库脚本（自动初筛）
- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [ ] [`fc9fb8ccc`](https://github.com/meta/astryx/commit/fc9fb8ccc) fix(core): registered icons reach swizzled copies; icon and theme registries are one per React (AST-110 FR3) (#11096)
- [x] [`b03b77d3d`](https://github.com/meta/astryx/commit/b03b77d3d) docs(theme): DefinedTheme.__componentIcons is public surface (#11170)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`230d1b4b9`](https://github.com/meta/astryx/commit/230d1b4b9) fix(BottomSheet): a move of a touch drag no longer restyles the sheet's content (#11154)
  - 不适用：只改上游测试（自动初筛）

### v0.7.15

- [ ] [`427931291`](https://github.com/meta/astryx/commit/427931291) docs(theme): DefinedTheme.__componentIcons is documented public API (#11192)
- [x] [`e7e9af2f8`](https://github.com/meta/astryx/commit/e7e9af2f8) feat(core): a mouse or pen press on a checkbox or a radio option paints at once and fades on release (#8696)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`1c2cea6b6`](https://github.com/meta/astryx/commit/1c2cea6b6) docs(useThemeName): add hook docs and an active theme example block (#11235)

### v0.7.16

- [ ] [`1afe2484b`](https://github.com/meta/astryx/commit/1afe2484b) fix(core): theme padding with functions builds as written (#11347)
- [ ] [`50beab961`](https://github.com/meta/astryx/commit/50beab961) fix(core): pass host data-* attributes to the component's own element (#11406)
- [x] [`22213fd97`](https://github.com/meta/astryx/commit/22213fd97) fix(BottomSheet): a flick's close clears the scrim along the same spring (#11400)
  - 不适用：上游内部规范和架构文档、只改上游测试（自动初筛）

### v0.7.17

- [ ] [`4da09b8d6`](https://github.com/meta/astryx/commit/4da09b8d6) docs(useSyntaxTheme): add hook docs and a keyword color example block (#11236)
- [x] [`7866b20c1`](https://github.com/meta/astryx/commit/7866b20c1) docs(architecture): form controls get a border role held at 3:1 (#11631)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`49bf06afb`](https://github.com/meta/astryx/commit/49bf06afb) feat(core): theme component overrides take @light and @dark blocks that apply in one color mode (#11679)
- [ ] [`decc98007`](https://github.com/meta/astryx/commit/decc98007) fix(core): a color-mode block follows the nearest media surface; a styled link keeps its hover tint (#11759)
- [ ] [`8b1460f93`](https://github.com/meta/astryx/commit/8b1460f93) fix(core): a theme value left undefined in a part or surface is not set (#11760)
- [x] [`f6584cd42`](https://github.com/meta/astryx/commit/f6584cd42) fix(core): text in the page body no longer falls back to the browser's serif font (#11794)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`3ef7c410f`](https://github.com/meta/astryx/commit/3ef7c410f) docs(core): the typography note says how a heading's font list is built (#11786)
- [ ] [`2df3446af`](https://github.com/meta/astryx/commit/2df3446af) fix(core): a local token left undefined is not set; root localTokens: undefined is refused by name (#11802)
- [ ] [`df854bc0c`](https://github.com/meta/astryx/commit/df854bc0c) fix(core): Theme's runtime injection hint names no package made up from the theme's name (#11862)
- [x] [`3137fe0df`](https://github.com/meta/astryx/commit/3137fe0df) fix(core): the active option of select, multi-select and typeahead lists carries a highlighted theme state (#11887)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`75ddfd4e8`](https://github.com/meta/astryx/commit/75ddfd4e8) fix(core): defineTheme names a token map that holds itself instead of overflowing the stack (#11939)
- [ ] [`99c0bc696`](https://github.com/meta/astryx/commit/99c0bc696) fix(core): defineTheme refuses a plain-object base instead of merging its raw values (#11973)
- [x] [`ce0feb506`](https://github.com/meta/astryx/commit/ce0feb506) fix(core): a Table bleeds to a block edge only as its container's direct first or last child (#12068)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`13f199859`](https://github.com/meta/astryx/commit/13f199859) fix(core): defineTheme names where a self-referencing token map is written (#12111)
- [ ] [`e51ed92f6`](https://github.com/meta/astryx/commit/e51ed92f6) fix(Theme): a system Theme takes the page's color scheme, and Core's stylesheet sets the root to follow the reader (#12102)
- [x] [`0b4760560`](https://github.com/meta/astryx/commit/0b4760560) fix(core): CodeBlock and Code keep code in its own direction on right-to-left pages (#12130)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e8c6cc05e`](https://github.com/meta/astryx/commit/e8c6cc05e) fix(Theme): the page root follows the reader only through reset.css, so Core's stylesheet leaves a host's scheme alone (#12247)
- [x] [`37db386f8`](https://github.com/meta/astryx/commit/37db386f8) fix(table): a narrow header truncates its label so its sort and filter controls stay in the cell (#12312)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`3e58ae0f8`](https://github.com/meta/astryx/commit/3e58ae0f8) fix(Theme): a theme's color-mode blocks under a system Theme that no Theme forces follow the page root's scheme (#12270)
- [ ] [`dda98593d`](https://github.com/meta/astryx/commit/dda98593d) fix(core): the switch thumb stays round, and inherited text takes the theme's body size (#12236)
- [x] [`7658fcff5`](https://github.com/meta/astryx/commit/7658fcff5) fix(cli): theme build leaves the page's color scheme to the page (#12250)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6ae843e75`](https://github.com/meta/astryx/commit/6ae843e75) docs(cli): the layout and tokens pages carry their core rules (#12209)
  - 不适用：上游仓库脚本（自动初筛）
- [ ] [`3deff9de7`](https://github.com/meta/astryx/commit/3deff9de7) feat(core): theme seams for the spinner, tree disclosure, number steppers and close buttons (#12156)
- [ ] [`fd16910a6`](https://github.com/meta/astryx/commit/fd16910a6) fix(core): a page that renders a Button or an Icon but no Theme does not load the theme-rule generator (#11255)
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`8bd67fe30`](https://github.com/meta/astryx/commit/8bd67fe30) chore: land batch 1 (12 pull requests) (#12713)
- [ ] [`3b21ca666`](https://github.com/meta/astryx/commit/3b21ca666) feat(theme): chat surfaces default to the container radius (#12794)
- [x] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8c52e3bba`](https://github.com/meta/astryx/commit/8c52e3bba) chore: land batch 7 (3 pull requests) (#12811)
- [ ] [`8688c1885`](https://github.com/meta/astryx/commit/8688c1885) chore: land batch 6 (11 pull requests) (#12812)
- [ ] [`9e19fa47e`](https://github.com/meta/astryx/commit/9e19fa47e) chore: land batch 8 (11 pull requests) (#12827)
- [ ] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
- [ ] [`4c309698d`](https://github.com/meta/astryx/commit/4c309698d) chore: land batch 22 (2 pull requests) (#12877)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
  - 暂缓：要还原上游动效，归动效与手势引擎任务
- [ ] [`904b58e64`](https://github.com/meta/astryx/commit/904b58e64) chore: land batch 29 (3 pull requests) (#12894)
- [ ] [`31b52d0cb`](https://github.com/meta/astryx/commit/31b52d0cb) chore: land batch 34 (2 pull requests) (#12908)
- [ ] [`0f67e76cb`](https://github.com/meta/astryx/commit/0f67e76cb) chore: land batch 35 (1 pull requests) (#12907)
- [ ] [`6c12793c1`](https://github.com/meta/astryx/commit/6c12793c1) chore: land batch 41 (1 pull requests) (#12916)
- [ ] [`476d9063f`](https://github.com/meta/astryx/commit/476d9063f) chore: land batch 63 (3 pull requests) (#12945)
- [ ] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
- [x] [`08491e55c`](https://github.com/meta/astryx/commit/08491e55c) chore: land batch 77 (3 pull requests) (#12973)
  - 不适用：只改上游测试（自动初筛）

## 主题包

### v0.7.2

- [ ] [`86e839219`](https://github.com/meta/astryx/commit/86e839219) feat(core): promote Drawer and DrawerHeader from Lab (#6071)

### v0.7.3

- [ ] [`06872b48b`](https://github.com/meta/astryx/commit/06872b48b) fix(themes): keep the secondary ComplexSelector hover off an aria-disabled trigger (#7846)

### v0.7.4

- [x] [`813c1d59e`](https://github.com/meta/astryx/commit/813c1d59e) Share theme palette reference generation (#7678)
  - 不适用：上游仓库脚本（自动初筛）
- [ ] [`e5c5a8738`](https://github.com/meta/astryx/commit/e5c5a8738) Adopt reviewed Stone palette (#7669)
- [ ] [`3f6ea7d78`](https://github.com/meta/astryx/commit/3f6ea7d78) Adopt reviewed Gothic palette (#7670)
- [ ] [`28b1cd457`](https://github.com/meta/astryx/commit/28b1cd457) Adopt reviewed Matcha palette (#7671)
- [ ] [`39f715386`](https://github.com/meta/astryx/commit/39f715386) Adopt reviewed Butter palette (#7672)
- [ ] [`3c4005ec2`](https://github.com/meta/astryx/commit/3c4005ec2) Adopt reviewed Y2K palette (#7675)

### v0.7.5

- [ ] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)

### v0.7.6

- [x] [`13412a4df`](https://github.com/meta/astryx/commit/13412a4df) ci: each published package commits a generated public API report, with advisory API changes for the PR report (#9241)
  - 不适用：上游 API 报告（自动初筛）

### v0.7.9

- [x] [`2defb18b6`](https://github.com/meta/astryx/commit/2defb18b6) chore(api): regenerate the API reports for CheckboxList isOptional, CodeBlock startLineNumber and --duration-exit (#9868)
  - 不适用：上游 API 报告（自动初筛）
- [ ] [`eb5e49661`](https://github.com/meta/astryx/commit/eb5e49661) fix(visual-gate): probe backgrounds keep their distance from the fixed probe text colour (#10125)
- [ ] [`7f296f17e`](https://github.com/meta/astryx/commit/7f296f17e) fix(theme-neutral): the selected fill is visible on every surface in both modes (#10093)

### v0.7.11

- [ ] [`028e6ca19`](https://github.com/meta/astryx/commit/028e6ca19) test(visual-gate): regenerate the probe theme from the current component docs (#10227)

### v0.7.12

- [ ] [`732c33874`](https://github.com/meta/astryx/commit/732c33874) fix(themes): Butter, Stone and Y2K set supporting text in rem (#10320)
- [ ] [`7bc8230f8`](https://github.com/meta/astryx/commit/7bc8230f8) fix(Button): a labelled button grows with its label (#10588)
- [ ] [`544442239`](https://github.com/meta/astryx/commit/544442239) fix(Button): at the default text size a labelled button renders exactly as before (#10678)
- [x] [`462c0e975`](https://github.com/meta/astryx/commit/462c0e975) chore(api-report): refresh butter and y2k reports for the press-marker selector (#10885)
  - 不适用：上游 API 报告（自动初筛）
- [ ] [`971d57533`](https://github.com/meta/astryx/commit/971d57533) fix(theme-gothic): accent text and icons stay readable on a light media surface (#10852)
- [ ] [`0b5663f2b`](https://github.com/meta/astryx/commit/0b5663f2b) fix(theme-neutral): lift an unselected SegmentedControl label to 4.5:1 on the dark track (#10881)
- [ ] [`5d0a07467`](https://github.com/meta/astryx/commit/5d0a07467) fix(themes): secondary text meets 4.5:1 in Matcha and Y2K light mode (#10932)

### v0.7.14

- [x] [`9f3cbd90d`](https://github.com/meta/astryx/commit/9f3cbd90d) chore: remove the committed API reports; the API delta comes from the build (#10957)
  - 不适用：上游 API 报告（自动初筛）

### v0.7.15

- [x] [`41724cd61`](https://github.com/meta/astryx/commit/41724cd61) REFACTOR: Share palette-ref wrapper boilerplate via defineThemePaletteRefs (#11280)
  - 不适用：上游仓库脚本（自动初筛）

### v0.7.16

- [ ] [`77c3d25d7`](https://github.com/meta/astryx/commit/77c3d25d7) docs(themes): fix theme README usage examples for Theme provider (#11016)
- [ ] [`f628ba44b`](https://github.com/meta/astryx/commit/f628ba44b) fix(cli): the palette generator honors darkChromaTaper, so every official palette regenerates as committed (#11491)

### v0.7.17

- [ ] [`b36275ed0`](https://github.com/meta/astryx/commit/b36275ed0) feat(core): TableRow exposes a selected theme state (#11729)
- [ ] [`3137fe0df`](https://github.com/meta/astryx/commit/3137fe0df) fix(core): the active option of select, multi-select and typeahead lists carries a highlighted theme state (#11887)
- [ ] [`ad1fb5089`](https://github.com/meta/astryx/commit/ad1fb5089) fix(themes): neutral and y2k skeletons show on their light page (#12014)
- [ ] [`34e3d212f`](https://github.com/meta/astryx/commit/34e3d212f) fix(core): dialog text reads the theme, and toast text reaches AA on its card (#12095)
- [ ] [`c9fdaecf5`](https://github.com/meta/astryx/commit/c9fdaecf5) fix(themes): text meets WCAG AA by role on every official theme (#12093)
- [ ] [`782b392ce`](https://github.com/meta/astryx/commit/782b392ce) fix(MobileNav): the painted drawer panel carries its own theme target (#12382)
- [ ] [`3b4c1993c`](https://github.com/meta/astryx/commit/3b4c1993c) fix(core): theme targets for parts that paint inside a component (#12081)
- [ ] [`ea92bc042`](https://github.com/meta/astryx/commit/ea92bc042) fix(core): theme targets for Pagination's control row, cells and ellipsis (#12253)
- [ ] [`3deff9de7`](https://github.com/meta/astryx/commit/3deff9de7) feat(core): theme seams for the spinner, tree disclosure, number steppers and close buttons (#12156)
- [ ] [`b22f53568`](https://github.com/meta/astryx/commit/b22f53568) chore(visual-gate): the generated probe theme merges cleanly when two branches add targets (#12647)
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`daf5e2cb3`](https://github.com/meta/astryx/commit/daf5e2cb3) chore: land batch 3 (13 pull requests) (#12722)
- [ ] [`3b21ca666`](https://github.com/meta/astryx/commit/3b21ca666) feat(theme): chat surfaces default to the container radius (#12794)
- [ ] [`910b80d5f`](https://github.com/meta/astryx/commit/910b80d5f) chore: land batch 9 (4 pull requests) (#12825)
- [ ] [`53615c1f4`](https://github.com/meta/astryx/commit/53615c1f4) chore: land batch 19 (3 pull requests) (#12875)
- [ ] [`783e47029`](https://github.com/meta/astryx/commit/783e47029) chore: land batch 17 (2 pull requests) (#12866)
- [ ] [`8efb25a85`](https://github.com/meta/astryx/commit/8efb25a85) chore: land batch 23 (4 pull requests) (#12885)
- [ ] [`904b58e64`](https://github.com/meta/astryx/commit/904b58e64) chore: land batch 29 (3 pull requests) (#12894)
- [x] [`0f67e76cb`](https://github.com/meta/astryx/commit/0f67e76cb) chore: land batch 35 (1 pull requests) (#12907)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`82af9164d`](https://github.com/meta/astryx/commit/82af9164d) fix(ProgressBar, CircularProgress, themes): every enabled progress fill reaches 3:1 against its track (#12398)
- [ ] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)

## 常用工具函数（area:core）

### v0.7.2

- [ ] [`374b53a9e`](https://github.com/meta/astryx/commit/374b53a9e) fix(Text): truncation tooltip follows changed content, not only resizes (#7611)
- [ ] [`3aca324d4`](https://github.com/meta/astryx/commit/3aca324d4) fix(MultiSelector): the active action cell draws the standard focus ring (#7542)
- [ ] [`e63f97283`](https://github.com/meta/astryx/commit/e63f97283) fix(Calendar): compute ISO week numbers without local DST offset leaking in (#6365)
- [x] [`5fb597d93`](https://github.com/meta/astryx/commit/5fb597d93) fix(core): build Unicode property regexes at runtime (#7767)
  - 不适用：只改上游测试（自动初筛）

### v0.7.3

- [x] [`d4ade4a04`](https://github.com/meta/astryx/commit/d4ade4a04) spec(knowledge): every current record is reachable from a path; records declare paths no other link reaches (#7794)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`677d96c8b`](https://github.com/meta/astryx/commit/677d96c8b) fix(core): adjustTime emits "14:30.5" for a fractional increment, on both the public util and TimeInput/DateTimeInput (#7823)
- [ ] [`29ead9885`](https://github.com/meta/astryx/commit/29ead9885) fix(core): disabled links, tokens and cards stay focusable (#7842)

### v0.7.5

- [x] [`a88f185a1`](https://github.com/meta/astryx/commit/a88f185a1) fix(core): a card's press overlay paints a finger's press (#8057)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a4261e95a`](https://github.com/meta/astryx/commit/a4261e95a) refactor(core): a shared edge autoscroll timer, used by the menu press model (#8334)
- [ ] [`cd3787bac`](https://github.com/meta/astryx/commit/cd3787bac) feat(core): one touch presentation resolver (#8062)
- [ ] [`844d734d0`](https://github.com/meta/astryx/commit/844d734d0) chore(core): a shared touch hit area that grows toward 44 px and stops at half the gap to each neighbour (#8635)

### v0.7.6

- [ ] [`4cc972c3a`](https://github.com/meta/astryx/commit/4cc972c3a) chore(core): resolve a component's presentation so a caller's choice wins over touch defaults (#8298)
- [ ] [`1db4108ac`](https://github.com/meta/astryx/commit/1db4108ac) test(core): one internal definition pins core's touch style keys (#8331)
- [ ] [`bb18c817a`](https://github.com/meta/astryx/commit/bb18c817a) fix(Table): a column-resize handle is named by a node header's visible text (#9057)
- [ ] [`faee47927`](https://github.com/meta/astryx/commit/faee47927) fix(TimeInput, DateTimeInput): time text follows the locale's hour cycle and day periods (#9022)
- [ ] [`ae7ac1864`](https://github.com/meta/astryx/commit/ae7ac1864) perf(core): plainDateFormat reuses one formatter per locale and options (#8335)
- [ ] [`5cd7a15d4`](https://github.com/meta/astryx/commit/5cd7a15d4) feat(core): touch-action derivation, native scroll probe, haptics and the gesture host (#8071)
- [ ] [`00507ba07`](https://github.com/meta/astryx/commit/00507ba07) fix(AppShell): with fill height, keyboard users can scroll an overflowing main region (#8111)
- [ ] [`5dd4d2691`](https://github.com/meta/astryx/commit/5dd4d2691) feat(core): the internal touch foundation: press tracking and the animator (#8076)
- [ ] [`7544940f4`](https://github.com/meta/astryx/commit/7544940f4) fix(ComplexSelector): tooltip status placement keeps its message (#9026)
- [ ] [`d7cd32c09`](https://github.com/meta/astryx/commit/d7cd32c09) fix(Item, TreeList): a disabled row's link has no destination (spec:AST-085 FR2) (#9056)
- [ ] [`0135af462`](https://github.com/meta/astryx/commit/0135af462) fix(core N–Z): slots use isRenderable; the remaining checks are allowed with a reason (#9206)
- [ ] [`acfa52701`](https://github.com/meta/astryx/commit/acfa52701) fix(useTypeahead): type-to-select ignores accents (#8864)
- [ ] [`372a0eae2`](https://github.com/meta/astryx/commit/372a0eae2) fix(SideNav): focus on a row the collapsed rail removes moves to the collapse toggle or the nearest rail row (#9249)
- [ ] [`8c8f0dac6`](https://github.com/meta/astryx/commit/8c8f0dac6) fix(Collapsible): focus inside closing content moves to the trigger (#9250)
- [ ] [`f5db72546`](https://github.com/meta/astryx/commit/f5db72546) refactor(ModalAnnounceProvider): watch presentation through the shared MutationObserver (#9151)
- [ ] [`134afc4b3`](https://github.com/meta/astryx/commit/134afc4b3) fix(core): one click guard for the menu press model and the gesture host (#8360)
- [ ] [`ad2e378cb`](https://github.com/meta/astryx/commit/ad2e378cb) fix(Calendar): a stand-alone month label starts with a capital where CLDR capitalizes one (#9371)
- [ ] [`2d6154dc5`](https://github.com/meta/astryx/commit/2d6154dc5) chore(utils): trim the remaining long utility comments (#9527)
- [ ] [`09a09fff3`](https://github.com/meta/astryx/commit/09a09fff3) chore(utils): source comments in ten utility files explain only non-obvious reasons (1 of 2) (#9522)

### v0.7.7

- [ ] [`5f3198edf`](https://github.com/meta/astryx/commit/5f3198edf) fix(gestures): a mouse or pen drag a gesture claims keeps the page's text selection (spec:AST-094 FR41) (#8665)
- [ ] [`4a8a76eeb`](https://github.com/meta/astryx/commit/4a8a76eeb) fix(core): the click guard takes a claimed touch's late mousedown and mouseup (#9677)
- [ ] [`95438ffaf`](https://github.com/meta/astryx/commit/95438ffaf) feat(SegmentedControl): the selection slides on every change and drags with any pointer (#9632)
- [ ] [`cec65f35f`](https://github.com/meta/astryx/commit/cec65f35f) fix(DropdownMenu): a late native click after a touch drill-in no longer picks a row (#8275)

### v0.7.8

- [ ] [`a3d7b46c7`](https://github.com/meta/astryx/commit/a3d7b46c7) fix(dateParser): in day-first locales, numeric text never takes the native month-first reading (#9726)
- [ ] [`f88f5dc65`](https://github.com/meta/astryx/commit/f88f5dc65) fix(HoverCard): focusTrigger="auto" decides when focus arrives, through Tooltip's shared check (#9597)
- [ ] [`984eab751`](https://github.com/meta/astryx/commit/984eab751) fix(Calendar): day and week numbers use the locale's digits (#9610)
- [ ] [`41cce0b0a`](https://github.com/meta/astryx/commit/41cce0b0a) fix(core): a disabled Slider no longer runs a caller's handlers (#9729)
- [ ] [`16a5397c9`](https://github.com/meta/astryx/commit/16a5397c9) feat(Calendar): weekday headers show abbreviated names where all seven fit in four characters (#9824)
- [ ] [`c8f08f967`](https://github.com/meta/astryx/commit/c8f08f967) fix(core): PowerSearch gives `isDateOnly: false` the time of day it names (#9702)
- [ ] [`946211065`](https://github.com/meta/astryx/commit/946211065) perf(core): an overlay's eager import no longer carries the lazy BottomSheet's padding (#8550)
- [ ] [`6255d3022`](https://github.com/meta/astryx/commit/6255d3022) feat(CheckboxList): a required checkbox group needs one checked box (isRequired) (#9854)
- [ ] [`7b87c5c1d`](https://github.com/meta/astryx/commit/7b87c5c1d) fix(gestures): a selection a claimed lift's own handlers make stays (#9848)
- [ ] [`f5a315249`](https://github.com/meta/astryx/commit/f5a315249) fix(TimeInput, DateTimeInput): under a finger the AM/PM wheel follows the hour (#8179)
- [ ] [`0588a1342`](https://github.com/meta/astryx/commit/0588a1342) feat(core): one on-screen keyboard module; a Tall BottomSheet reads it and rides Gboard's slides (#8559)

### v0.7.9

- [ ] [`5083ead48`](https://github.com/meta/astryx/commit/5083ead48) fix(DropdownMenu): prevent stale trigger tooltips after selection (#9280)
- [ ] [`298bafbc1`](https://github.com/meta/astryx/commit/298bafbc1) fix(core): a list row's touch press release runs on the compositor (#9762)
- [ ] [`252b45bb1`](https://github.com/meta/astryx/commit/252b45bb1) feat(Layer): one input hold, first used by Dialog, Drawer and MobileNav (spec:AST-094 FR35) (#8342)
- [ ] [`0f0592804`](https://github.com/meta/astryx/commit/0f0592804) fix(core): a control in an opening layer keeps its settled touch insets (#9957)
- [ ] [`2db57bd97`](https://github.com/meta/astryx/commit/2db57bd97) fix(core): the touch-inset pass resolves no style for unscaled controls (#9987)
- [ ] [`3d225c35b`](https://github.com/meta/astryx/commit/3d225c35b) feat(core): under a finger a pressable highlights at touch-down outside scroll views (#9765)
- [ ] [`9bd11b363`](https://github.com/meta/astryx/commit/9bd11b363) feat(core): a checkbox's or radio option's hit area grows toward 44 px (#8241)
- [ ] [`7f8de290c`](https://github.com/meta/astryx/commit/7f8de290c) fix(core): a press's release fades on the theme's exit motion tokens (#9890)
- [ ] [`4e7823a56`](https://github.com/meta/astryx/commit/4e7823a56) feat(i18n): InternationalizationProvider takes a calendar and exposes the resolved calendar (#9791)
- [ ] [`fe1cf0c6d`](https://github.com/meta/astryx/commit/fe1cf0c6d) feat(Calendar): show the months of the selected calendar system (#9622)
- [ ] [`aa7c50176`](https://github.com/meta/astryx/commit/aa7c50176) feat(Calendar): useCalendarDays and useCalendarNavigation take an optional calendar (#10007)
- [ ] [`edf7128e3`](https://github.com/meta/astryx/commit/edf7128e3) feat(Timestamp, PowerSearch): write dates in the provider's calendar (#9639)
- [ ] [`7be6b4644`](https://github.com/meta/astryx/commit/7be6b4644) feat(core): read typed dates in every calendar (#9792)
- [ ] [`6e2e24293`](https://github.com/meta/astryx/commit/6e2e24293) feat(lab): Schedule writes dates in the provider's calendar (#9994)
- [ ] [`52e65f3ef`](https://github.com/meta/astryx/commit/52e65f3ef) fix(utils): read back calendar text in Latvian, Amharic and Hindi (#9840)
- [ ] [`7b71d71b4`](https://github.com/meta/astryx/commit/7b71d71b4) feat(List): a row's touch target grows toward 44 px where its neighbors leave room (#8085)
- [ ] [`a6a9b9c50`](https://github.com/meta/astryx/commit/a6a9b9c50) fix(CheckboxListItem): a row answers a finger the same wherever it lands (#8212)
- [ ] [`189a730ce`](https://github.com/meta/astryx/commit/189a730ce) feat(DateInput, DateTimeInput, DateRangeInput): type, pick and show dates in the active calendar (#9643, #9842)
- [ ] [`ddb8b3462`](https://github.com/meta/astryx/commit/ddb8b3462) feat(ButtonGroup): a finger's slide runs the button it lifts on (#8657)

### v0.7.10

- [ ] [`add05168f`](https://github.com/meta/astryx/commit/add05168f) fix(core): a finger held on a control's box picks it, not the text (#10091)
- [ ] [`2c66211e8`](https://github.com/meta/astryx/commit/2c66211e8) fix(SegmentedControl): a segment's touch target grows toward 44 px without growing its box (#10137)
- [ ] [`306051090`](https://github.com/meta/astryx/commit/306051090) fix(core): gestures read another window's nodes and touches (#10224)
- [ ] [`b4fc6840c`](https://github.com/meta/astryx/commit/b4fc6840c) perf(core): a touch hit-area pass keeps the page's interactive elements until the DOM changes (#10242)

### v0.7.11

- [ ] [`66b09526b`](https://github.com/meta/astryx/commit/66b09526b) fix(core): a swizzled copy type-checks without Node's types (#10252)
- [x] [`28c2e3fe5`](https://github.com/meta/astryx/commit/28c2e3fe5) test(core): six date and time cases pin each CLDR version's words (#10264)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e348759a9`](https://github.com/meta/astryx/commit/e348759a9) fix(core): a presentation resolves with no matchMedia, as in a test DOM (#10275)
- [ ] [`3bd5a4c1b`](https://github.com/meta/astryx/commit/3bd5a4c1b) fix(Layer): a still mouse presses through an entrance's input hold (#10303)
- [ ] [`e245db5fb`](https://github.com/meta/astryx/commit/e245db5fb) feat(core): the keyboard module's docked ride, the scroller's reveal and the tap route (#9776)
- [ ] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)

### v0.7.12

- [ ] [`360701de7`](https://github.com/meta/astryx/commit/360701de7) fix(Text, Heading): the truncation tooltip mounts on the first hover, tap or focus (#10290)
- [ ] [`6cbcbf846`](https://github.com/meta/astryx/commit/6cbcbf846) fix(core): a press inside a scroll view highlights 150 ms after touch (#10260)
- [ ] [`95572ae80`](https://github.com/meta/astryx/commit/95572ae80) fix(Layer): a press that went down before an input hold lifts through the hold's shield (#10398)
- [ ] [`24d845b42`](https://github.com/meta/astryx/commit/24d845b42) fix(core): a month past the end of its year constrains to the last month (#10461)
- [ ] [`cd748d0e9`](https://github.com/meta/astryx/commit/cd748d0e9) chore(Layer): the outside-press watch can close on a pan, follow chosen pointer types, and judge a press in a closed shadow root (#9814)
- [ ] [`6e0b60429`](https://github.com/meta/astryx/commit/6e0b60429) chore(core): one owner module turns scroll anchoring off (#10173)
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [x] [`5eb6b2137`](https://github.com/meta/astryx/commit/5eb6b2137) fix(lab): a swizzled ListInput type-checks without Node's types (#10574)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`6718d7e8e`](https://github.com/meta/astryx/commit/6718d7e8e) fix(core): parseColor answers null for names the prototype chain supplies (#10468)
- [x] [`62bc7a2fe`](https://github.com/meta/astryx/commit/62bc7a2fe) fix(core): a swizzled copy shares the animated-layout, code-language and snap-paging brands (#10576)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`92784f658`](https://github.com/meta/astryx/commit/92784f658) fix(core): a swizzled copy shares the package's per-page touch state (#10599)
- [x] [`f09230814`](https://github.com/meta/astryx/commit/f09230814) fix(core): a swizzled Outline type-checks against the package's Markdown plugins (#10641)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`611382ee1`](https://github.com/meta/astryx/commit/611382ee1) feat(lab): add LineClamp — clamp arbitrary content to N lines (#4259)
- [ ] [`db40c6b01`](https://github.com/meta/astryx/commit/db40c6b01) refactor(core): share per-instance warning dedupe and temporary focus targets (#10655)
- [ ] [`d0ab3cb26`](https://github.com/meta/astryx/commit/d0ab3cb26) feat(core): add the shared list-windowing module and Table's capability hook (#10656)
- [ ] [`8f8b3db65`](https://github.com/meta/astryx/commit/8f8b3db65) perf(Text): take a new text's first truncation measurement from the shared observer (#10668)
- [ ] [`a28d586eb`](https://github.com/meta/astryx/commit/a28d586eb) feat(core): createReorderable makes List rows reorderable (#8139)
- [ ] [`7f04a6c5a`](https://github.com/meta/astryx/commit/7f04a6c5a) fix(Table): an unbounded column's resize handle announces a range that holds its width (#10577)
- [ ] [`bb0786673`](https://github.com/meta/astryx/commit/bb0786673) fix(TextInput): dispatch changeAction and update optimistic value on clear (#6425)
- [x] [`f2a6332eb`](https://github.com/meta/astryx/commit/f2a6332eb) fix(List): a swizzled copy reads a package reorderable object (#10741)
  - 不适用：只改上游测试（自动初筛）
- [x] [`da3dbdc8b`](https://github.com/meta/astryx/commit/da3dbdc8b) fix(Table): a swizzled Table honors the package's virtualization capability (#10798)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2e6162c9a`](https://github.com/meta/astryx/commit/2e6162c9a) fix(MultiSelector): opening the closed list never highlights a disabled option (#10820)
- [x] [`52356e690`](https://github.com/meta/astryx/commit/52356e690) feat(Table): useTableRowsVirtualization's viewportHeight becomes initialViewportHeight, which no longer sizes the Table (#10894)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`db705b961`](https://github.com/meta/astryx/commit/db705b961) feat(core): shared-realm helpers hold every kind of cross-module state (AST-110 FR3) (#10817)
- [ ] [`0840fcc47`](https://github.com/meta/astryx/commit/0840fcc47) fix(core): page scroll and selection locks are one per page across Core loads (AST-110 FR3) (#10822)

### v0.7.13

- [ ] [`1ac0c2464`](https://github.com/meta/astryx/commit/1ac0c2464) refactor(core): one shared list-windowing engine, with Table as its first consumer (#10810)
- [x] [`d130dffdc`](https://github.com/meta/astryx/commit/d130dffdc) fix(Markdown): the public parser drops every data: URL; <Markdown> renders data: links and images as source text (#11020)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.14

- [ ] [`8bc7850e0`](https://github.com/meta/astryx/commit/8bc7850e0) fix(core): createISOTimeString answers null unless the trimmed input is H:M or H:M:S with one- or two-digit fields (a seconds fraction is dropped) (#11023)
- [ ] [`fc9fb8ccc`](https://github.com/meta/astryx/commit/fc9fb8ccc) fix(core): registered icons reach swizzled copies; icon and theme registries are one per React (AST-110 FR3) (#11096)
- [ ] [`09479d9c7`](https://github.com/meta/astryx/commit/09479d9c7) fix(Popover): a touch that pans is not an outside press, even without pointercancel (#11038)
- [ ] [`08b74222f`](https://github.com/meta/astryx/commit/08b74222f) perf(core): hit areas read no layout during a scroll or a press at rest (#11083)
- [ ] [`db3e8334f`](https://github.com/meta/astryx/commit/db3e8334f) fix(core): InputGroupText, Badge and Token keep caller text in its written order under RTL (#10114)
- [ ] [`9600e3500`](https://github.com/meta/astryx/commit/9600e3500) refactor(core): useChatStreamScroll's page-scroller rules move to one owner module (#11160)

### v0.7.15

- [ ] [`b8835b84f`](https://github.com/meta/astryx/commit/b8835b84f) fix(gestures): each document's gesture host reads that window's clock (#11155)
- [ ] [`1740654b7`](https://github.com/meta/astryx/commit/1740654b7) feat(core): add the internal useCommittedRef hook for latest-value refs (#11352)

### v0.7.16

- [ ] [`200e53a5f`](https://github.com/meta/astryx/commit/200e53a5f) fix(core): a time clamp with no whole minute inside the range keeps the bound (#10159)
- [ ] [`a4595efa9`](https://github.com/meta/astryx/commit/a4595efa9) fix(menu press): cancel only the lifted finger's touchend (#11164)
- [ ] [`b300313cb`](https://github.com/meta/astryx/commit/b300313cb) feat(Lightbox): a gallery's caption sits in a two-line band (#9810)
- [ ] [`cfc431d7a`](https://github.com/meta/astryx/commit/cfc431d7a) fix(layer): a release does not dismiss the layer it opened (#11258)
- [ ] [`a32287bcb`](https://github.com/meta/astryx/commit/a32287bcb) fix(TimeInput, DateTimeInput): keep rejected time entries and show why (#11413)
- [ ] [`8a50ab2e8`](https://github.com/meta/astryx/commit/8a50ab2e8) feat(core): an internal shared-context entry for Lab (#11448)

### v0.7.17

- [ ] [`c3d24e124`](https://github.com/meta/astryx/commit/c3d24e124) fix(Comments): a failed comment-link copy shows and announces itself (#10435)
- [ ] [`1d2d6299d`](https://github.com/meta/astryx/commit/1d2d6299d) fix(DropdownMenu): a sub-menu whose label is not a string names its view, its Back row and its sheet (#11594)
- [ ] [`bf8555451`](https://github.com/meta/astryx/commit/bf8555451) fix(useFocusTrap): Tab stops inside a closed dialog the page displays (#11892)
- [ ] [`d504f0094`](https://github.com/meta/astryx/commit/d504f0094) feat(TextInput, TextArea, NumberInput): fields stay above the keyboard (#9777)
- [ ] [`c3b7f32fb`](https://github.com/meta/astryx/commit/c3b7f32fb) fix(Selector): without options, Selector and MultiSelector name the prop and the fix in development (#12386)
- [ ] [`56d3546d5`](https://github.com/meta/astryx/commit/56d3546d5) fix(core): a TreeList row with no action shows its keyboard focus ring (#12153)
- [ ] [`f939a6f90`](https://github.com/meta/astryx/commit/f939a6f90) fix(core): type-to-select takes a letter typed with AltGr (#12644)
- [x] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
- [ ] [`472896d35`](https://github.com/meta/astryx/commit/472896d35) fix(Toolbar, OverflowList): a start lane's own OverflowList folds beside the end lane (#12238)
- [x] [`904b58e64`](https://github.com/meta/astryx/commit/904b58e64) chore: land batch 29 (3 pull requests) (#12894)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1f48950f9`](https://github.com/meta/astryx/commit/1f48950f9) chore: land batch 67 (7 pull requests) (#12957)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`e7f5815c3`](https://github.com/meta/astryx/commit/e7f5815c3) fix(core): six components' fixed-English built-in text follows the locale; the hardcoded-string lint config has no exemption list and reports a stale entry (#12721)
- [ ] [`416b167cf`](https://github.com/meta/astryx/commit/416b167cf) fix(core): one focus return for Popover and DropdownMenu (popover presentation) and Dialog that never strands focus (AST-116 FR17–FR21, AR1) (#11121)

## 图表包（area:charts）

### v0.7.3

- [ ] [`b1e1936bb`](https://github.com/meta/astryx/commit/b1e1936bb) fix(core): provide dataVars defaults in prebuilt CSS (#7694)

### v0.7.4

- [ ] [`ccdb1b8b5`](https://github.com/meta/astryx/commit/ccdb1b8b5) docs: tidy six guide titles and fix two broken links (#7934)

### v0.7.5

- [ ] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)

### v0.7.6

- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [ ] [`dabf6a125`](https://github.com/meta/astryx/commit/dabf6a125) lint: no-border-shorthand reaches lab and charts; ChartTooltip's card draws its border in prebuilt CSS (#9442)

### v0.7.9

- [ ] [`edf7128e3`](https://github.com/meta/astryx/commit/edf7128e3) feat(Timestamp, PowerSearch): write dates in the provider's calendar (#9639)

### v0.7.10

- [ ] [`cbda0753d`](https://github.com/meta/astryx/commit/cbda0753d) ci(release): publish canaries at most hourly from main's tip, plus an on-demand canary dispatch (#9659)

### v0.7.12

- [ ] [`3fc5e0d70`](https://github.com/meta/astryx/commit/3fc5e0d70) fix(charts): ignore xDomain for categorical x (#10182)

### v0.7.14

- [ ] [`a8a4664d8`](https://github.com/meta/astryx/commit/a8a4664d8) fix(ChartTooltip): keep the card padding in the published stylesheet (#11114)

### v0.7.17

- [ ] [`a4b8609ec`](https://github.com/meta/astryx/commit/a4b8609ec) fix(charts): WebGL marks draw again after their effects re-run (#11816)
- [x] [`2614a653f`](https://github.com/meta/astryx/commit/2614a653f) spec(AST-115): one format type for chart values, x values, and axis ticks (#11124)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`8d375af8d`](https://github.com/meta/astryx/commit/8d375af8d) test(charts): pin the chart color API contract in unit tests (#12604)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a2edb5300`](https://github.com/meta/astryx/commit/a2edb5300) chore: land batch 2 (16 pull requests) (#12718)
- [ ] [`d6ac73ef3`](https://github.com/meta/astryx/commit/d6ac73ef3) chore: land batch 4 (12 pull requests) (#12738)
- [ ] [`124bc3904`](https://github.com/meta/astryx/commit/124bc3904) fix(charts): each area gradient's id is unique on the page (#12230)
- [ ] [`b168b50bd`](https://github.com/meta/astryx/commit/b168b50bd) chore: land batch 90 (1 pull requests) (#13032)
- [ ] [`3ce9e5531`](https://github.com/meta/astryx/commit/3ce9e5531) feat(charts): add ChartValueFormat and defer empty values in built-in formatters (#12777)

## 属性规则与样式分层（area:core）

### v0.7.3

- [x] [`d4ade4a04`](https://github.com/meta/astryx/commit/d4ade4a04) spec(knowledge): every current record is reachable from a path; records declare paths no other link reaches (#7794)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`7c96b5735`](https://github.com/meta/astryx/commit/7c96b5735) test(Selector, ComplexSelector): a focused trigger keeps focus when disabled, in a real engine (#7874)
  - 不适用：只改上游测试（自动初筛）
- [x] [`7370328f6`](https://github.com/meta/astryx/commit/7370328f6) spec(AST-009): real-AT evidence never gates merge or release (#7915)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.4

- [x] [`2b60fa6fd`](https://github.com/meta/astryx/commit/2b60fa6fd) fix(inputs): silence the busy Spinner and announce the busy start once (TextInput, TextArea, Selector, MultiSelector) (#7920)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9f3ab054c`](https://github.com/meta/astryx/commit/9f3ab054c) fix(ComplexSelector, Typeahead, Tokenizer): silence the busy Spinner and announce the busy start once (#7930)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a732e5c64`](https://github.com/meta/astryx/commit/a732e5c64) fix(DateInput, DateRangeInput): silence the busy Spinner and announce the busy start once (#7939)
  - 不适用：只改上游测试（自动初筛）
- [x] [`ec8c3c9f7`](https://github.com/meta/astryx/commit/ec8c3c9f7) fix(DateTimeInput, TimeInput): silence the busy Spinner and announce the busy start once (#7942)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c9c991e3b`](https://github.com/meta/astryx/commit/c9c991e3b) fix(CheckboxInput): announce the busy start once (#7948)
  - 不适用：只改上游测试（自动初筛）
- [x] [`10b832e02`](https://github.com/meta/astryx/commit/10b832e02) fix(DropdownMenuSubMenu, Thumbnail, ChatMessageList): silence the busy Spinner and announce the busy start once (#7950)
  - 不适用：只改上游测试（自动初筛）
- [x] [`88ec018ca`](https://github.com/meta/astryx/commit/88ec018ca) fix(FileInput): silence the busy Spinner and announce the busy start once (#7954)
  - 不适用：只改上游测试（自动初筛）
- [x] [`eccc6eee0`](https://github.com/meta/astryx/commit/eccc6eee0) fix(CommandPalette): announce each busy start from inside its dialog (#7956)
  - 不适用：只改上游测试（自动初筛）

### v0.7.5

- [x] [`db7e94503`](https://github.com/meta/astryx/commit/db7e94503) fix(core): a search's busy start is never announced after its outcome (#8235)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a88f185a1`](https://github.com/meta/astryx/commit/a88f185a1) fix(core): a card's press overlay paints a finger's press (#8057)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f574bd001`](https://github.com/meta/astryx/commit/f574bd001) spec(AST-080): every PR reports component size; touch-only JS and CSS have a budget (#8271)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`55d19f33f`](https://github.com/meta/astryx/commit/55d19f33f) spec(AST-017): touch behavior is a default callers can override with presentation (#8273)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`e52ef25f2`](https://github.com/meta/astryx/commit/e52ef25f2) [Component Audit] ComplexSelector: the trigger is a combobox field on both paths (#6991)
  - 不适用：只改上游测试（自动初筛）
- [x] [`10ca8eaee`](https://github.com/meta/astryx/commit/10ca8eaee) spec(AST-012): compact is width below md or height below 500 on every platform (#8274)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ebfae1a3d`](https://github.com/meta/astryx/commit/ebfae1a3d) spec(architecture): components are built from minimal DOM (#8300)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`67dc45f66`](https://github.com/meta/astryx/commit/67dc45f66) spec: an open layer may render up to 5 more elements under touch, with no new anatomy (#8439)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`66e257a4c`](https://github.com/meta/astryx/commit/66e257a4c) architecture(layer-runtime): one generic layer runtime, and one opt-in lift-from-trigger module (INV14, INV15) (#8448)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`5b691cda7`](https://github.com/meta/astryx/commit/5b691cda7) architecture(public-component-api): four API-shape principles (INV18–INV21) (#8459)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c115ceeea`](https://github.com/meta/astryx/commit/c115ceeea) architecture: touch behavior comes from shared internal modules; Core and Lab reach them through ./internal/* (INV13) (#8464)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c22cbe2fd`](https://github.com/meta/astryx/commit/c22cbe2fd) fix(core): useAnnounce delivers inside the open Astryx modal that encloses its caller (#8009)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a1a512d9e`](https://github.com/meta/astryx/commit/a1a512d9e) design(ordered-collection-reordering): current — insertion line, stable rows, commit on drop (AST-103 reorder mode) (#8625)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a5cb073a8`](https://github.com/meta/astryx/commit/a5cb073a8) spec(AST-107): public gesture hooks — usePanGesture, useDragToSnapPoints, useAnimator (#8600)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`db165f86f`](https://github.com/meta/astryx/commit/db165f86f) spec(SideNav, AppShell): rail collapse by snap, clip and cross-fade (D38) (#8720)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`db584bcb0`](https://github.com/meta/astryx/commit/db584bcb0) feat(Icon): a theme's width and height on an Icon size set its glyph dimension (#8759)
  - 不适用：只改上游测试（自动初筛）
- [x] [`0913354f0`](https://github.com/meta/astryx/commit/0913354f0) fix(core): a mouse or Space press on a touch-first device paints the pressed state (#8046)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.6

- [x] [`5dd4d2691`](https://github.com/meta/astryx/commit/5dd4d2691) feat(core): the internal touch foundation: press tracking and the animator (#8076)
  - 不适用：只改上游测试（自动初筛）
- [x] [`2c32c719d`](https://github.com/meta/astryx/commit/2c32c719d) spec(public-component-api): every interaction hook has a non-React path (INV22) (#9141)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d18fdaa66`](https://github.com/meta/astryx/commit/d18fdaa66) spec(public-component-api): each private data attribute has one owner module (INV23) (#9182)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`c39a5b160`](https://github.com/meta/astryx/commit/c39a5b160) spec: API reports cover declarations, custom properties, theme targets and public attributes; undeclared rows go to a human (#9199)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`4265bc407`](https://github.com/meta/astryx/commit/4265bc407) spec(public-component-api): INV23's gap note names the lint that now runs (#9237)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`df6d16fea`](https://github.com/meta/astryx/commit/df6d16fea) fix(SegmentedControl): the disabled reason describes each segment, and one Tab stop remains when no enabled segment is selected (#9176)
- [x] [`a46b203df`](https://github.com/meta/astryx/commit/a46b203df) ci(api-report): compare a pull request's API changes with its merge base's built surface (#9348)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`a7d0b3ff8`](https://github.com/meta/astryx/commit/a7d0b3ff8) spec(public-component-api): behavior props use one <thing>Behavior union with an adaptive default (#9383)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`134afc4b3`](https://github.com/meta/astryx/commit/134afc4b3) fix(core): one click guard for the menu press model and the gesture host (#8360)
- [x] [`c5fbecb8d`](https://github.com/meta/astryx/commit/c5fbecb8d) spec(i18n, Resizable, AST-103): factories take announcement and label options with a catalog default (#9395)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`054b23cdc`](https://github.com/meta/astryx/commit/054b23cdc) spec(AST-057, Item): configure swipe through swipe={createSwipe(…)} (#9387)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`09a482eaf`](https://github.com/meta/astryx/commit/09a482eaf) fix(Layer): a press inside a layer stops at the layer root in the React tree (#9497)
- [x] [`6e5791c29`](https://github.com/meta/astryx/commit/6e5791c29) test(core): check every public StyleX namespace fits its supported use (#9541)
  - 不适用：只改上游测试（自动初筛）

### v0.7.7

- [ ] [`1f47db9c8`](https://github.com/meta/astryx/commit/1f47db9c8) feat(Switch): the touch presentation, for every pointer (#9636)
- [x] [`322c0d6e6`](https://github.com/meta/astryx/commit/322c0d6e6) fix(Button, Tab, Tokenizer and more): slots follow isRenderable; no truthy-guard baseline (#9501)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`95438ffaf`](https://github.com/meta/astryx/commit/95438ffaf) feat(SegmentedControl): the selection slides on every change and drags with any pointer (#9632)
- [x] [`1821fb3fa`](https://github.com/meta/astryx/commit/1821fb3fa) fix(Tooltip): remove the unreleased triggerBehavior prop before 0.7.7 (#9711)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`bf14580b0`](https://github.com/meta/astryx/commit/bf14580b0) feat(core): Dialog, Drawer and MobileNav drop the backdrop blur (#8120)
  - 不适用：只改上游测试（自动初筛）

### v0.7.8

- [ ] [`d43f40785`](https://github.com/meta/astryx/commit/d43f40785) fix(AlertDialog): a press that slides between the actions runs the one it lifts on (#8083)
- [x] [`a81487737`](https://github.com/meta/astryx/commit/a81487737) feat(core): a first-party indicator can paint its own press (#9716)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`2c925f794`](https://github.com/meta/astryx/commit/2c925f794) refactor(core): a theme's reduced-motion mark, internal until 'always' ships (#9761)
- [x] [`e797650e5`](https://github.com/meta/astryx/commit/e797650e5) spec(public-component-api): public props use the system's existing vocabulary (#9749)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`19081d81a`](https://github.com/meta/astryx/commit/19081d81a) chore(lab): remove MobileTokenizer and MobilePowerSearch, whose flows Core ships behind experimental.presentation (#9790)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`bb3838b6f`](https://github.com/meta/astryx/commit/bb3838b6f) fix(AlertDialog): a mouse press on the actions acts natively again (#9771)
- [x] [`dcf3d6f86`](https://github.com/meta/astryx/commit/dcf3d6f86) feat(Tokenizer): presentation is a stable prop, and adaptive is its default (#9796)
  - 不适用：只改上游测试（自动初筛）
- [x] [`1b2bfe2bd`](https://github.com/meta/astryx/commit/1b2bfe2bd) test: the test runtime keeps every StyleX rule its dev runtime keys by an at-rule prelude (#8695)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [ ] [`fbb81c6cc`](https://github.com/meta/astryx/commit/fbb81c6cc) DropdownMenu: under a finger, the opening finger picks only after UIMenu's handoff (AST-094 FR29) (#8627)
- [ ] [`298bafbc1`](https://github.com/meta/astryx/commit/298bafbc1) fix(core): a list row's touch press release runs on the compositor (#9762)
- [x] [`3d225c35b`](https://github.com/meta/astryx/commit/3d225c35b) feat(core): under a finger a pressable highlights at touch-down outside scroll views (#9765)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`8b2883998`](https://github.com/meta/astryx/commit/8b2883998) chore(core): split long comment sentences in some menu press sources and tests (#9954)
- [x] [`a1a615186`](https://github.com/meta/astryx/commit/a1a615186) docs(public-component-api): interaction utilities have matching non-React equivalents; shipped APIs are grandfathered (#9973)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`7f8de290c`](https://github.com/meta/astryx/commit/7f8de290c) fix(core): a press's release fades on the theme's exit motion tokens (#9890)
- [x] [`edf7128e3`](https://github.com/meta/astryx/commit/edf7128e3) feat(Timestamp, PowerSearch): write dates in the provider's calendar (#9639)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7b71d71b4`](https://github.com/meta/astryx/commit/7b71d71b4) feat(List): a row's touch target grows toward 44 px where its neighbors leave room (#8085)
- [x] [`634b64991`](https://github.com/meta/astryx/commit/634b64991) test(core): the StyleX rule recorders load their components before any test, not inside a 30 s hook (#10014)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a6a9b9c50`](https://github.com/meta/astryx/commit/a6a9b9c50) fix(CheckboxListItem): a row answers a finger the same wherever it lands (#8212)
- [x] [`64b56eef9`](https://github.com/meta/astryx/commit/64b56eef9) docs(public-component-api): useMenuPress has no create twin by owner decision (#10053)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b779b269c`](https://github.com/meta/astryx/commit/b779b269c) spec(Carousel): opt-in snap paging through useSnapPaging (#9666)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`9e7567c48`](https://github.com/meta/astryx/commit/9e7567c48) fix(Item): a selected row shows hover and press over its fill; a highlighted row shows press (#10111)
- [ ] [`ddb8b3462`](https://github.com/meta/astryx/commit/ddb8b3462) feat(ButtonGroup): a finger's slide runs the button it lifts on (#8657)
- [ ] [`841bcb8da`](https://github.com/meta/astryx/commit/841bcb8da) fix(Selector): a ghost or secondary trigger's clear and status buttons ring themselves, not the trigger too (#8874)
- [x] [`4e963dff0`](https://github.com/meta/astryx/commit/4e963dff0) chore(gestures): a Storybook harness to check presented hit testing on a phone (#9400)
  - 不适用：只改上游测试（自动初筛）
- [x] [`5985abc13`](https://github.com/meta/astryx/commit/5985abc13) fix(core): no press scale or card color fade under reduced motion (#8326)
  - 不适用：只改上游测试（自动初筛）

### v0.7.10

- [ ] [`e8ecde4ff`](https://github.com/meta/astryx/commit/e8ecde4ff) fix(core): a button's touch press release runs on the compositor (#9783)
- [ ] [`add05168f`](https://github.com/meta/astryx/commit/add05168f) fix(core): a finger held on a control's box picks it, not the text (#10091)
- [ ] [`f81f09df3`](https://github.com/meta/astryx/commit/f81f09df3) fix(CodeBlock, Carousel): the code viewport and the scroller draw the shared focus ring (#8875)

### v0.7.11

- [x] [`5e623ea32`](https://github.com/meta/astryx/commit/5e623ea32) lint(no-raw-private-attribute): accept a plain-TS owner module in Core privateAttributes (#10220)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`2fbf3249f`](https://github.com/meta/astryx/commit/2fbf3249f) spec(AST-089): style the public ref element, otherwise the outermost root (#7931)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`5e67f0874`](https://github.com/meta/astryx/commit/5e67f0874) feat(Popover): under a finger, it grows out of its trigger and shrinks back into it (#8187)
- [x] [`089f7a078`](https://github.com/meta/astryx/commit/089f7a078) test: cut the jsdom style work that times out UI suites under load (#10285)
  - 不适用：只改上游测试（自动初筛）
- [x] [`a9c911421`](https://github.com/meta/astryx/commit/a9c911421) fix(core): Overlay, AppShell and MobileNav work with no matchMedia (#10327)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`a6d2716de`](https://github.com/meta/astryx/commit/a6d2716de) fix(List): a highlighted row's dividers stay visible through its tint (#10280)
- [x] [`e10347c4e`](https://github.com/meta/astryx/commit/e10347c4e) fix(Button): under a finger, a Button's target grows toward 44 px through the shared touch band (#10216)
  - 不适用：只改上游测试（自动初筛）

### v0.7.12

- [ ] [`36929ac92`](https://github.com/meta/astryx/commit/36929ac92) feat(List): animate row inserts, removals and moves through the animatedLayout handle (#8106)
- [ ] [`6e0b60429`](https://github.com/meta/astryx/commit/6e0b60429) chore(core): one owner module turns scroll anchoring off (#10173)
- [ ] [`422440a64`](https://github.com/meta/astryx/commit/422440a64) fix(core): two copies of Core's modules share one React context (#10233)
- [ ] [`1c8292c42`](https://github.com/meta/astryx/commit/1c8292c42) fix(Layer): keep decorator portals outside renderer-managed DOM (#7633)
- [x] [`72968acd8`](https://github.com/meta/astryx/commit/72968acd8) fix(cli): swizzle carries another Astryx package's internal modules, except exported StyleX modules (#10595)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b993255e2`](https://github.com/meta/astryx/commit/b993255e2) test(core): the menu drag pixel proof waits for the menu's entrance (#10638)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`74f1fb96f`](https://github.com/meta/astryx/commit/74f1fb96f) fix(theme): a themed :active follows the touch press model (#10420)
- [ ] [`7bdeb06d7`](https://github.com/meta/astryx/commit/7bdeb06d7) fix(theme): text follows the reader's text size in Safari on iPhone, in every theme (#10416)
- [ ] [`a28d586eb`](https://github.com/meta/astryx/commit/a28d586eb) feat(core): createReorderable makes List rows reorderable (#8139)
- [x] [`0f6f37e6f`](https://github.com/meta/astryx/commit/0f6f37e6f) docs(records): new data attributes outside data-astryx-* are public surface; prefer a private CSS variable (#10937)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.14

- [x] [`5eaeb400d`](https://github.com/meta/astryx/commit/5eaeb400d) docs(records): pull requests carry an API delta instead of a committed API report (#10950)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`108f354ae`](https://github.com/meta/astryx/commit/108f354ae) fix(core): drop 'use client' from the package root and the component barrels (#11106)
- [x] [`fe3c497fe`](https://github.com/meta/astryx/commit/fe3c497fe) spec(architecture): component import boundaries, held by a failing check (#11047)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`b62ca6b5c`](https://github.com/meta/astryx/commit/b62ca6b5c) ci: fail on a new static import across a component import boundary (#11048)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`db3e8334f`](https://github.com/meta/astryx/commit/db3e8334f) fix(core): InputGroupText, Badge and Token keep caller text in its written order under RTL (#10114)
  - 不适用：只改上游测试（自动初筛）

### v0.7.15

- [ ] [`ac1a569b2`](https://github.com/meta/astryx/commit/ac1a569b2) fix(Tokenizer): removing a token with a finger leaves the keyboard down (#8160)
- [ ] [`e7e9af2f8`](https://github.com/meta/astryx/commit/e7e9af2f8) feat(core): a mouse or pen press on a checkbox or a radio option paints at once and fades on release (#8696)
- [ ] [`807dc2ead`](https://github.com/meta/astryx/commit/807dc2ead) refactor(core): name the nested press rule for every pointer it covers (#11304)

### v0.7.16

- [x] [`50beab961`](https://github.com/meta/astryx/commit/50beab961) fix(core): pass host data-* attributes to the component's own element (#11406)
  - 不适用：只改上游测试（自动初筛）
- [x] [`fbbd03931`](https://github.com/meta/astryx/commit/fbbd03931) spec(AST-111): record the owner approval (#11439)
  - 不适用：上游内部规范和架构文档（自动初筛）

### v0.7.17

- [x] [`337ae5002`](https://github.com/meta/astryx/commit/337ae5002) docs(architecture): tooltip and hover-card code loads after first paint on every page (#11597)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`1addd72da`](https://github.com/meta/astryx/commit/1addd72da) feat(core): swipe actions come from createSwipe on the shared drag path (#8690)
- [x] [`39eb83866`](https://github.com/meta/astryx/commit/39eb83866) docs(architecture): unused optional features cost almost nothing, and large behavior code lives in a shared engine (#11650)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`4800d992e`](https://github.com/meta/astryx/commit/4800d992e) feat(AlertDialog): touch motion on the theme's timing (#8373)
- [x] [`935e25a3c`](https://github.com/meta/astryx/commit/935e25a3c) chore(import-boundaries): the check holds a "Must not reach" table for optional features (INV10) (#11676)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`762a65d60`](https://github.com/meta/astryx/commit/762a65d60) perf(Layer): keep the tap recognizer apart from the touch trigger, so Text's first load drops 9.6 KB (#11599)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ccf2a6452`](https://github.com/meta/astryx/commit/ccf2a6452) chore(scripts): one measurer for INV10's reference pages (pnpm size:pages) (#11731)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`30b12dd5a`](https://github.com/meta/astryx/commit/30b12dd5a) fix(Item, Token): a control inside a row with its own action, or a token's Remove, rings itself (#8869)
- [ ] [`3e58ae0f8`](https://github.com/meta/astryx/commit/3e58ae0f8) fix(Theme): a theme's color-mode blocks under a system Theme that no Theme forces follow the page root's scheme (#12270)
- [x] [`f7ebe6734`](https://github.com/meta/astryx/commit/f7ebe6734) fix(Thumbnail): focusing Open shows one ring, not two (#11613)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3deff9de7`](https://github.com/meta/astryx/commit/3deff9de7) feat(core): theme seams for the spinner, tree disclosure, number steppers and close buttons (#12156)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`8c52e3bba`](https://github.com/meta/astryx/commit/8c52e3bba) chore: land batch 7 (3 pull requests) (#12811)
- [ ] [`f672a82de`](https://github.com/meta/astryx/commit/f672a82de) chore(core): the internal touch entry exposes group press tracking to Lab (#11283)
- [ ] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
- [x] [`4e35a9856`](https://github.com/meta/astryx/commit/4e35a9856) spec(internationalization): a component takes a prop for each string callers reword; provider overrides are an app-wide escape hatch (#12675)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`ab9aaa5a2`](https://github.com/meta/astryx/commit/ab9aaa5a2) chore: land batch 70 (2 pull requests) (#12963)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`d8ed55621`](https://github.com/meta/astryx/commit/d8ed55621) spec(AST-017): Charts may import Core's internal subpaths (#12779)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [x] [`773107aad`](https://github.com/meta/astryx/commit/773107aad) spec(popover): isModal keeps its released meaning, and usePopover takes tabBehavior (AST-116) (#13015)
  - 不适用：上游内部规范和架构文档（自动初筛）

## 实验包：展示类组件（area:lab）

### v0.7.4

- [x] [`0c1a6e860`](https://github.com/meta/astryx/commit/0c1a6e860) test(a11y): add Progressbar contract and bind ProgressBar and CircularProgress (#7919)
  - 不适用：只改上游测试（自动初筛）

### v0.7.5

- [x] [`1554dc626`](https://github.com/meta/astryx/commit/1554dc626) fix(Tooltip, HoverCard): a touch opens them only once it is a tap (#8165)
  - 不适用：只改上游测试（自动初筛）
- [x] [`174300fcb`](https://github.com/meta/astryx/commit/174300fcb) ci: discover PR browser accessibility specs, so a new spec needs no workflow edit (#8367)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b298b37d1`](https://github.com/meta/astryx/commit/b298b37d1) feat(theme): add surface-specific status color roles (#7657)
  - Vue 版已有：lab 的 CircularProgress、LogStream、SVGIcon、Stat 已改读 text-*、icon-* 状态角色（#517 已对齐 core 状态色表），样式文件里就是这些变量
- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：只改了 InfoTip 源码注释里的上游仓库链接；Vue 版 lab 的 InfoTip 只是转发 core 的弃用别名，没有这类链接

### v0.7.6

- [x] [`9e07422c7`](https://github.com/meta/astryx/commit/9e07422c7) test(a11y): the coverage checks of 17 binding specs run as one serial part per state (#9071)
  - 不适用：只改上游测试（自动初筛）
- [x] [`4426e1520`](https://github.com/meta/astryx/commit/4426e1520) fix(CircularProgress): a value change keeps moving while JavaScript runs (#8232)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。CircularProgress 确定进度改成两个半环加两个圆头，用 Web Animations 在合成线程上按主题时长和缓动转动，打断时从当前位置接着转，补测试
- [x] [`332dab752`](https://github.com/meta/astryx/commit/332dab752) test(Schedule): the time-direction contract runs in the Schedule's zone on a pinned daylight-saving week (#9236)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c091cf102`](https://github.com/meta/astryx/commit/c091cf102) fix(storybook): Lab Schedule stories build their demo week from a fixed date in the Schedule's timezone (#9243)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e0a03766d`](https://github.com/meta/astryx/commit/e0a03766d) docs(knowledge): every component spec lives in docs/specs/components, one folder per component (#9007)
  - 不适用：上游内部规范和架构文档、上游组件规范文档（自动初筛）
- [x] [`389dc8448`](https://github.com/meta/astryx/commit/389dc8448) fix(Text, Heading): a long unbroken token wraps in text that is not truncated (#9351)
  - Vue 版已有：基础展示族已在 #505 移植：不截断的 Text 里长串会换行，LogStream 沿用
- [x] [`7d493c12e`](https://github.com/meta/astryx/commit/7d493c12e) test(ProgressBar, CircularProgress): motion traces read screencast frames in the order they were presented (#9378)
  - 不适用：只改上游测试（自动初筛）
- [x] [`30c3fdf26`](https://github.com/meta/astryx/commit/30c3fdf26) test(ProgressBar, CircularProgress): motion traces measure what they claim on a loaded runner (#9413)
  - 不适用：只改上游测试（自动初筛）

### v0.7.7

- [x] [`d6a35ea15`](https://github.com/meta/astryx/commit/d6a35ea15) test(Schedule): the popover's keyboard-scroll proof follows each press to its scrollend (#9665)
  - 不适用：只改上游测试（自动初筛）
- [x] [`449486fdc`](https://github.com/meta/astryx/commit/449486fdc) feat(core): promote InfoTip from Lab as the info preset over Tooltip's press toggle (#9238)
  - Vue 版已有：InfoTip 已在 core，lab 的 InfoTip/index.ts 只是带 @deprecated 的转发，测试覆盖

### v0.7.8

- [x] [`3372c22fe`](https://github.com/meta/astryx/commit/3372c22fe) test(CircularProgress): the tracing test judges a window it marks inside the change (#9450)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e390c3c43`](https://github.com/meta/astryx/commit/e390c3c43) test(browser): keep every Playwright browser context off remote hosts (#9811)
  - 不适用：只改上游测试（自动初筛）

### v0.7.9

- [ ] [`9d068fc89`](https://github.com/meta/astryx/commit/9d068fc89) feat(lab): useRefreshControl, UIKit's pull to refresh for an app's scroll container (#9865)
  - 暂缓：RefreshControl 依赖 core 还没有的手势识别器（GestureArena、PanGestureRecognizer）和 UIKit 动效引擎（createMotionEngine、rubberBand、scroll 弹簧）
- [x] [`de1be1fd9`](https://github.com/meta/astryx/commit/de1be1fd9) fix(CircularProgress): the indeterminate ring turns with Spinner's rotor (#8256)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。不确定圆环改为和加载圈一样的 135° 弧整体旋转，一次迭代 100 圈，相位钉在时间线 0 点，补测试
- [ ] [`6e2e24293`](https://github.com/meta/astryx/commit/6e2e24293) feat(lab): Schedule writes dates in the provider's calendar (#9994)
  - 暂缓：依赖 core 的日历系统（InternationalizationProvider 的 calendar 和历法解析，日期族的 189a730ce 等），Vue 版 core 还没有
- [x] [`6f3befa82`](https://github.com/meta/astryx/commit/6f3befa82) feat(lab): CircleCheckIndicator, the iOS multiple-selection circle (#9723)
  - 已移植：[#536](https://github.com/astryx-vue/astryx-vue/pull/536)。lab 新增 CircleCheckIndicator，可在主题里映射到 checkbox，中英文档和测试
- [ ] [`c26fcd543`](https://github.com/meta/astryx/commit/c26fcd543) chore(lab): Lab's animator hook, over Core's internal touch entry (#9754)
  - 暂缓：RefreshControl 的动画钩子和触摸入口，随 RefreshControl 一起暂缓（缺手势识别器和动效引擎）
- [x] [`1ef21f898`](https://github.com/meta/astryx/commit/1ef21f898) fix(Spinner): route standalone loading through the shared announcement channel (#7910)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。Schedule 不再自带 live 区域，加载开始改走 useAnnounce 播报，加载圈 aria-hidden，补测试
- [ ] [`4e4cf84d2`](https://github.com/meta/astryx/commit/4e4cf84d2) feat(lab): NavigationStack, push/pop navigation that moves like UINavigationController (#9697)
  - 暂缓：NavigationStack 的推入弹出动画和侧滑返回依赖 core 还没有的手势识别器和 UIKit 动效引擎

### v0.7.10

- [ ] [`75c3c48f5`](https://github.com/meta/astryx/commit/75c3c48f5) fix(lab): NavigationStack re-measures a screen when its title resizes (#10191)
  - 暂缓：NavigationStack 未移植（缺手势识别器和动效引擎）
- [ ] [`0081c1165`](https://github.com/meta/astryx/commit/0081c1165) feat(lab): under a finger, NavigationStack's bar takes the iOS 26 look (#8396)
  - 暂缓：NavigationStack 未移植；滚动边缘外观还依赖上游 lab 的 useScrollEdgeEffect 和动效引擎
- [ ] [`0cc540700`](https://github.com/meta/astryx/commit/0cc540700) feat(lab): PageControl, UIPageControl's indicators: a tap steps a page, a finger scrubs, every pointer pages (#9684)
  - 暂缓：PageControl 的点按翻页、手指拖动和滑动关键帧依赖 core 还没有的手势识别器和动效引擎

### v0.7.11

- [x] [`28270c143`](https://github.com/meta/astryx/commit/28270c143) test(interaction-harness): an armed hold names the motion it judges (#10386)
  - 不适用：只改上游测试（自动初筛）

### v0.7.12

- [x] [`b1327c020`](https://github.com/meta/astryx/commit/b1327c020) test: watch before the action at 28 first-contact waits (#10286)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3866383ff`](https://github.com/meta/astryx/commit/3866383ff) test(lab): the PageControl busy proof reads the slide on frames (#10433)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3f358e05c`](https://github.com/meta/astryx/commit/3f358e05c) test(lab): the indicator pin case reads its positions in the page (#10440)
  - 不适用：只改上游测试（自动初筛）
- [x] [`703e80a85`](https://github.com/meta/astryx/commit/703e80a85) test(lab): the PageControl jog proof checks its rate, not a median (#10450)
  - 不适用：只改上游测试（自动初筛）
- [x] [`77377ea2a`](https://github.com/meta/astryx/commit/77377ea2a) test(NavigationStack): read each screen right before its bar (#10455)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9b7ebc461`](https://github.com/meta/astryx/commit/9b7ebc461) test(interaction-harness): a hold sent from the test names the motion it judges (#10438)
  - 不适用：只改上游测试（自动初筛）
- [x] [`998f96a0e`](https://github.com/meta/astryx/commit/998f96a0e) test(NavigationStack): hold the push and the veil from their start (#10306)
  - 不适用：只改上游测试（自动初筛）
- [x] [`6706e0177`](https://github.com/meta/astryx/commit/6706e0177) test(interaction-harness): a proof starved of frames fails by name (#10456)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`c18bc584c`](https://github.com/meta/astryx/commit/c18bc584c) feat(lab): TabBar, iOS 26's floating tab bar, with its selection lens and press tracking (#9700)
  - 暂缓：TabBar 的选择镜片和按压跟踪依赖 core 还没有的手势识别器和动效引擎
- [x] [`d9292cb24`](https://github.com/meta/astryx/commit/d9292cb24) test(NavigationStack): block inside the push, name starved runs (#10509)
  - 不适用：只改上游测试（自动初筛）
- [x] [`c03e4cd76`](https://github.com/meta/astryx/commit/c03e4cd76) test(RefreshControl): send the trackpad pull as one wheel burst (#10520)
  - 不适用：只改上游测试（自动初筛）
- [x] [`e02ed1926`](https://github.com/meta/astryx/commit/e02ed1926) test(NavigationStack): starved gestures fail by name, or not at all (#10529)
  - 不适用：只改上游测试（自动初筛）
- [x] [`f41935445`](https://github.com/meta/astryx/commit/f41935445) test(PageControl): read the window's slide on the page's own clocks (#10543)
  - 不适用：只改上游测试（自动初筛）
- [x] [`33cf413d0`](https://github.com/meta/astryx/commit/33cf413d0) fix(NavigationStack): fade the veil for a late finger-scroll report (#10540)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`d9ffcf87a`](https://github.com/meta/astryx/commit/d9ffcf87a) fix(PageControl): the held look commits where the hold begins (#10553)
  - 暂缓：PageControl 未移植（缺手势识别器和动效引擎）
- [ ] [`de74088ce`](https://github.com/meta/astryx/commit/de74088ce) fix(lab): TabBar's lens jumps to the finger under Reduce Motion (#10581)
  - 暂缓：TabBar 未移植（缺手势识别器和动效引擎）
- [x] [`9dca38629`](https://github.com/meta/astryx/commit/9dca38629) perf(Layer): anchored entrances play on the surface (#10561)
  - 不适用：修的是 Chromium 对 CSS anchor 定位元素逐帧重排；Vue 的 Schedule 浮层用 JS 算坐标定位，入场动画本来就在唯一的浮层面上
- [ ] [`6c5e2e665`](https://github.com/meta/astryx/commit/6c5e2e665) feat(lab): a TabBar tab can be disabled (#10539)
  - 暂缓：TabBar 未移植（缺手势识别器和动效引擎）
- [x] [`bb3a4b2ae`](https://github.com/meta/astryx/commit/bb3a4b2ae) test(interaction-harness): read a WebKit lift at its pointerup (#10585)
  - 不适用：只改上游测试（自动初筛）
- [x] [`611382ee1`](https://github.com/meta/astryx/commit/611382ee1) feat(lab): add LineClamp — clamp arbitrary content to N lines (#4259)
  - Vue 版已有：基础展示族已在 #511 新增 LineClamp
- [ ] [`3b8eb80d1`](https://github.com/meta/astryx/commit/3b8eb80d1) fix(RefreshControl): the end plays UIKit's curve over the duration token (#10582)
  - 暂缓：RefreshControl 未移植（缺手势识别器和动效引擎）
- [ ] [`5d1bfbc97`](https://github.com/meta/astryx/commit/5d1bfbc97) fix(lab): TabBar's held lens shows the selected look under Reduce Motion (#10603)
  - 暂缓：TabBar 未移植（缺手势识别器和动效引擎）
- [ ] [`f66574d82`](https://github.com/meta/astryx/commit/f66574d82) fix(lab): TabBar's lifted look shows at once under Reduce Motion (#10612)
  - 暂缓：TabBar 未移植（缺手势识别器和动效引擎）
- [x] [`58e528570`](https://github.com/meta/astryx/commit/58e528570) test(NavigationStack): a programmatic pop reads its layers held (#10743)
  - 不适用：只改上游测试（自动初筛）
- [x] [`9f55320cc`](https://github.com/meta/astryx/commit/9f55320cc) test(NavigationStack): a push reads its bars held (#10746)
  - 不适用：只改上游测试（自动初筛）
- [x] [`94c14d6da`](https://github.com/meta/astryx/commit/94c14d6da) test(lab): date TabBar's tap-held frames from the first one (#10747)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`d7326d9e7`](https://github.com/meta/astryx/commit/d7326d9e7) test(PageControl): the slide's own keyframes approach without overshoot (#10601)
  - 暂缓：PageControl 未移植（缺手势识别器和动效引擎）
- [x] [`b863888c5`](https://github.com/meta/astryx/commit/b863888c5) test(lab): judge TabBar's Reduce Motion lift held or by named frames (#10768)
  - 不适用：只改上游测试（自动初筛）
- [x] [`642cc2de1`](https://github.com/meta/astryx/commit/642cc2de1) fix(lab): write latest-value refs at commit, not during render (#10780)
  - 不适用：React 的「在提交阶段写最新值 ref」规范，Vue 的 ref 没有渲染期写入的问题；RefreshControl 部分随它暂缓
- [x] [`5797bbf9e`](https://github.com/meta/astryx/commit/5797bbf9e) test: three busy proofs decode each cast once (#10786)
  - 不适用：只改上游测试（自动初筛）
- [x] [`b5de1a82f`](https://github.com/meta/astryx/commit/b5de1a82f) refactor(lab): one-line ref effects in Comments and Schedule (#10805)
  - 不适用：React 的 ref 回调写法重构，没有行为变化
- [x] [`f124c2f3d`](https://github.com/meta/astryx/commit/f124c2f3d) test(interaction-harness): name a touch play the runner starved (#10551)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3239571ce`](https://github.com/meta/astryx/commit/3239571ce) test(interaction-harness): a wheel burst splits at a gap of maxGapMs (#10782)
  - 不适用：只改上游测试（自动初筛）
- [x] [`3582c71f9`](https://github.com/meta/astryx/commit/3582c71f9) docs(specs): a draft TabBar record for More, disabled tabs and a label (#10929)
  - 不适用：上游内部规范和架构文档（自动初筛）
- [ ] [`b04c4143e`](https://github.com/meta/astryx/commit/b04c4143e) feat(lab): reselecting a TabBar tab scrolls its panel to the top (#9966)
  - 暂缓：TabBar 未移植（缺手势识别器和动效引擎）

### v0.7.13

- [ ] [`0085c0f2b`](https://github.com/meta/astryx/commit/0085c0f2b) feat(lab): TabBar shows a More tab past five tabs (#10619)
  - 暂缓：TabBar 和 TabBarMoreList 未移植（缺手势识别器和动效引擎）
- [x] [`81e8ce68a`](https://github.com/meta/astryx/commit/81e8ce68a) test(PageControl): a jog slowed by a stalled page fails by name (#10993)
  - 不适用：只改上游测试（自动初筛）
- [x] [`fb23e8db0`](https://github.com/meta/astryx/commit/fb23e8db0) test(NavigationStack): hold the return, name a starved fade (#10986)
  - 不适用：只改上游测试（自动初筛）

### v0.7.14

- [ ] [`7deca3313`](https://github.com/meta/astryx/commit/7deca3313) feat(lab): SVG icons that follow the surrounding font-weight (#7918)
  - 暂缓：WeightedSVGIcon 依赖上游的字重探测字体（generate-weight-probe-font.py 生成）和按字重生成图标数据的构建脚本，Vue 仓库还没有这套资产流水线
- [x] [`c1a1ea82b`](https://github.com/meta/astryx/commit/c1a1ea82b) fix(core): a tap that wobbles at a scroll edge keeps its click (#10829)
  - 不适用：只改上游测试（自动初筛）

### v0.7.15

- [x] [`e7e9af2f8`](https://github.com/meta/astryx/commit/e7e9af2f8) feat(core): a mouse or pen press on a checkbox or a radio option paints at once and fades on release (#8696)
  - 已移植：[#536](https://github.com/astryx-vue/astryx-vue/pull/536)。CircleCheckIndicator 的按压画在圆圈本身上：读 core 行的 --_press-paint-image（按下立刻画、松开渐隐），细指针下 :active 兜底
- [x] [`d49d9d5e0`](https://github.com/meta/astryx/commit/d49d9d5e0) test(lab): the PageControl busy proof pools three slides (#10935)
  - 不适用：只改上游测试（自动初筛）

### v0.7.16

- [x] [`36f68b0da`](https://github.com/meta/astryx/commit/36f68b0da) fix(layer): a press on another trigger of an open layer opens it there (#11337)
  - Vue 版已有：useSchedulePopover 的 pointerdown 捕获已经先关再开，按另一个触发器在那里打开；#532 补了月视图按压测试

### v0.7.17

- [x] [`ce3022d4c`](https://github.com/meta/astryx/commit/ce3022d4c) test(CircularProgress): hold motion before tracing its rendering window (#12118)
  - 不适用：只改上游测试（自动初筛）
- [ ] [`7b8af163a`](https://github.com/meta/astryx/commit/7b8af163a) fix(NavigationStack): a push keeps focus a person moved into the new screen (#12009)
  - 暂缓：NavigationStack 未移植（缺手势识别器和动效引擎）
- [ ] [`96687ea2f`](https://github.com/meta/astryx/commit/96687ea2f) fix(NavigationStack): a push or pop from rest starts when its task ends (#12010)
  - 暂缓：NavigationStack 未移植（缺手势识别器和动效引擎）
- [ ] [`4f2ebbd34`](https://github.com/meta/astryx/commit/4f2ebbd34) fix(NavigationStack): screen content stays under the bar (#12001)
  - 暂缓：NavigationStack 未移植（缺手势识别器和动效引擎）
- [x] [`a60f74251`](https://github.com/meta/astryx/commit/a60f74251) chore: land batch 12 (3 pull requests) (#12841)
  - 不适用：只改上游测试（自动初筛）
- [x] [`82af9164d`](https://github.com/meta/astryx/commit/82af9164d) fix(ProgressBar, CircularProgress, themes): every enabled progress fill reaches 3:1 against its track (#12398)
  - 已移植：[#532](https://github.com/astryx-vue/astryx-vue/pull/532)。CircularProgress 所有变体共用 background-muted 轨道，neutral 和 disabled 用次要文字色，禁用时整圈半透明
- [x] [`e2b63aeb6`](https://github.com/meta/astryx/commit/e2b63aeb6) feat(lab): add VideoPlayer and AudioPlayer media players (#9832)
  - 暂缓：VideoPlayer 和 AudioPlayer 体量大（约 5,000 行：媒体状态仓库、控件条、两套播放器），本轮没有排上
  - 已移植  #559：[#555](https://github.com/astryx-vue/astryx-vue/pull/555)。媒体状态和控件（MediaPlayer、Media* 控件、useMediaPlayer）在 #555，现成的 VideoPlayer 和 AudioPlayer（含系统媒体控制、字幕避让）在 #559
- [x] [`ee65f4f0a`](https://github.com/meta/astryx/commit/ee65f4f0a) fix(VideoPlayer): a small player gets a compact control bar, and the empty track shows on the bar (#13016)
  - 暂缓：MediaPlayer 未移植
  - 已移植：[#559](https://github.com/astryx-vue/astryx-vue/pull/559)。视频控件条在 360px 及以下变紧凑，控件条上时间轴空轨道用强调色 24%
- [x] [`5815d02bf`](https://github.com/meta/astryx/commit/5815d02bf) test(NavigationStack): a push after a heavy commit never skips into its curve (#12990)
  - 不适用：只改上游测试（自动初筛）

## vega 包（area:charts）

### v0.7.4

- [x] [`ad6782d2c`](https://github.com/meta/astryx/commit/ad6782d2c) fix(scripts): require npm 11.15 for trusted-publisher setup; document the new-package flow (#7957)
  - 不适用：vega 包暂不移植（ADR 0001）（自动初筛）

### v0.7.5

- [x] [`b84bf77fa`](https://github.com/meta/astryx/commit/b84bf77fa) chore: move project links to meta/astryx (#8827)
  - 不适用：vega 包暂不移植（ADR 0001）（自动初筛）

### v0.7.10

- [x] [`cbda0753d`](https://github.com/meta/astryx/commit/cbda0753d) ci(release): publish canaries at most hourly from main's tip, plus an on-demand canary dispatch (#9659)
  - 不适用：vega 包暂不移植（ADR 0001）（自动初筛）

### v0.7.14

- [x] [`ad7360e37`](https://github.com/meta/astryx/commit/ad7360e37) docs(vega): the README shows canary versions as 0.x.y-canary.g<sha> (#11137)
  - 不适用：vega 包暂不移植（ADR 0001）（自动初筛）

## 在线演练场同步更新（area:docs）

### v0.7.5

- [ ] [`43d9b88c3`](https://github.com/meta/astryx/commit/43d9b88c3) feat(docsite): offer internal docs after network reachability check (#6785)

### v0.7.6

- [ ] [`3b42f85e0`](https://github.com/meta/astryx/commit/3b42f85e0) feat(docsite): blog posts run tsx live blocks in the playground preview frame (#9436)
