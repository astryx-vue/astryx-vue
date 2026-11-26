# @astryx-vue/cli

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
