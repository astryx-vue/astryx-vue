# @astryx-vue/core

## 0.16.0

### Minor Changes

- [#550](https://github.com/astryx-vue/astryx-vue/pull/550) [`d27092a`](https://github.com/astryx-vue/astryx-vue/commit/d27092a9f35a07901650fe9100b60dbdadbf86f4) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 读屏播报：同一帧里播报的多条消息按顺序连在一起念，一模一样的重复只念一次，空消息连同还没念的一起清掉；`useAnnounce` 新增 `hasReplace` 选项，让每次按键都重说一遍的状态（MultiSelector、CommandPalette 的搜索状态）只念最新一条；Selector、MultiSelector 的结果播报会收回还没念出去的「加载中」，TextInput、TextArea 的加载圈改为装饰、忙碌由输入框自己念一次；原生模态对话框打开时，播报写进那个对话框自己的区域；EmptyState 的根不再是 live 区域，页面加载后才出现或文字之后变了才播报一次。复制：`useClipboard` 新增 `isFailed`、`announceFailure`、`onError`，CodeBlock 新增 `copyFailedLabel` 和 `copyError` 事件，复制失败时按钮变叉并用 assertive 播报，Timestamp、评论链接和富文本代码块同样；`useOverflow` 新增 `gapToken`、`renderedGap`、`inlineBounds`。其余：可滚动的 LayoutContent、LayoutPanel、StackItem 溢出时是有名字的 group，AppShell 的 `fill` 主区域溢出时成为键盘停靠点；锁滚动在触屏上取消没人接的单指拖动并关掉页面回弹；TreeList 收起时焦点回到行；Selector、MultiSelector 键盘移到的高亮选项画焦点环；强制配色下聚焦的菜单行可见；`useImageMode` 在区域数值变化时重新采样；Calendar 今天在接管服务端 HTML 之后才读，服务端和浏览器不同日期也不再对不上；`useMediaQuery` 每条查询只挂一个监听。

### Patch Changes

- [#548](https://github.com/astryx-vue/astryx-vue/pull/548) [`9f4cd31`](https://github.com/astryx-vue/astryx-vue/commit/9f4cd3181d8e390437b3f23b766525e3395d0c22) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 焦点陷阱（Dialog、Popover、BottomSheet、MobileNav 和 `useFocusTrap`）按 Tab 更像浏览器：同名单选组只算一站，关着的 `<dialog>` 里的控件不算，嵌套时最里层接 Tab，Ctrl/Meta+Tab 留给浏览器，自己处理 Tab 的控件不被抢焦点，传送进 iframe 也能用；Popover 打开时焦点按文档顺序落在第一个可用控件上，跳过 `aria-disabled` 的；菜单里被指针点亮的行不再画键盘焦点环，shadow root 里的菜单也能按松手位置选行，手指松开选中一行后只取消它自己的 touchend，不会在慢页面上让迟到的 click 点中新出现的行；NavMenu、NavHeadingMenu 和 TabMenu 的选项支持按住滑过再松开选中；ContextMenu 和菜单触发器的长按按触摸事件自己的时钟计时，页面忙时晚到的触摸不会丢长按；子菜单关掉后不会被过期的悬停计时重新打开；`useEntryAnimation` 接管服务端 HTML 时不再对不上；复制在不允许异步剪贴板的框架里改用浏览器的复制命令。Calendar 按住 Shift 用 PageUp/PageDown 按年翻；SegmentedControl 禁用时仍保留选中分段的 Tab 停靠点，禁用原因同时描述每个分段；滚动区只靠盒子几何更新两头位置，祖先拖动 transform 时不再每帧重新测量；OverflowList 按主题实际排出的间距折叠，Toolbar 首部直接放 OverflowList 时会折叠给尾部让位。

## 0.15.0

### Minor Changes

- [#547](https://github.com/astryx-vue/astryx-vue/pull/547) [`b17b492`](https://github.com/astryx-vue/astryx-vue/commit/b17b4922330c59dec2eb8973615848aa1b22e63f) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `useTableRowsVirtualization` 和 `useTableColumnsVirtualization`：数据很多的表格只渲染看得见的行和列，滚动手感不变；开启后单元格默认单行截断，行版本会让表格填满父元素的高度并在里面滚动。

### Patch Changes

- [#549](https://github.com/astryx-vue/astryx-vue/pull/549) [`0dab467`](https://github.com/astryx-vue/astryx-vue/commit/0dab467a81ac4130ac5f33511c69c9fa0b3b30e7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Card 里贴到上下边缘的 Table，那一侧的角跟着卡片变圆，焦点环和底色不再在角上被裁掉。

## 0.14.0

### Minor Changes

- [#546](https://github.com/astryx-vue/astryx-vue/pull/546) [`2f825cd`](https://github.com/astryx-vue/astryx-vue/commit/2f825cdf9c5c41cd4de6ab097ab28ee6665ad65e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 日期字段对齐上游：DateInput 忙碌时不再画成禁用的样子，禁用的字段聚焦时照样有焦点环（强制颜色下也看得见），转圈不出声、进入忙碌只播报一次（DateRangeInput 同样）；弹出日历只在打开时挂载，按在输入框、清除按钮或标签上不再关上，焦点离开字段时关上，清除后日历保持打开；没打字时 Enter 照常提交表单；底部面板翻到范围尽头时焦点交给另一个箭头，手指下的月份年份滚轮带着已选日期走，服务端渲染不读今天，第一行落在抓手条下面，禁用时重置不起作用；滚轮的方向键走到头不再绕回，并支持 Page 键；西班牙语、法语、俄语等语言的日历月份标题首字母大写；粗指针下日期和时间字段的焦点样子不再渐变。日期输入打的文字被拒时（读不成日期、半截日期、日历上没有的日子、超出范围或被规则排除）会留在框里并说明原因；新增 `entryErrorBehavior`（`complete` 或 `blur-or-enter`）、`entryErrorChange` 事件，FormLayout 新增 `defaultEntryErrorBehavior`，DateInput 和 DateTimeInput 都支持；日历在对话框里被点遮罩关掉时，这一下只关日历，对话框留着。

## 0.13.1

### Patch Changes

- [#545](https://github.com/astryx-vue/astryx-vue/pull/545) [`2ef57bb`](https://github.com/astryx-vue/astryx-vue/commit/2ef57bb652b19c3c320c339f641b9489afe18b1c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - useKeyboardHint 的方向键提示默认不再自己消失，按 Escape 只关提示；Tooltip 内容比触发器四周的空地都高时不再盖住触发器；手指轻点聊天输入框里的粘贴文本令牌只打开预览，不再弹出键盘；独立的模态 BottomSheet 打开时，toast 显示在它上面并能点到。

- [#545](https://github.com/astryx-vue/astryx-vue/pull/545) [`403286d`](https://github.com/astryx-vue/astryx-vue/commit/403286d491fec9a147fac31250e2a06f4963bbc1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 触屏上 Tooltip、HoverCard 要等手指真的轻点才打开，滑动页面不再误开或误关 Popover 和选择列表，轻点禁用控件能看到禁用原因；Dialog 只有按下和松手都在遮罩上才关闭，按遮罩先关掉里面的弹出框时对话框留着；浮层在 iframe 里也能用 Escape 和 Tab。

## 0.13.0

### Minor Changes

- [#543](https://github.com/astryx-vue/astryx-vue/pull/543) [`fe992ac`](https://github.com/astryx-vue/astryx-vue/commit/fe992ac67b9b112c3685be0b249ab42dfbb670fc) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - ComplexSelector 新增 `disabledMessage`（悬停、聚焦、点按触发器时弹出禁用原因，自定义触发器也能用），状态图标顶替箭头显示，`tooltip` 状态的说明收在能聚焦的图标按钮里，调用方的 `aria-label` / `aria-labelledby` 会给内置触发器命名，弹层在禁用前就开着时里面的提交不再改值，弹层内容的高度上限会扣掉 LayerProvider 为底栏留的空隙。

- [#544](https://github.com/astryx-vue/astryx-vue/pull/544) [`d2849f1`](https://github.com/astryx-vue/astryx-vue/commit/d2849f15a3059c03dab71271bc64e5811fd766ec) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Tokenizer 和 Typeahead 新增 `statusVariant`（框内状态图标，`tooltip` 时是能聚焦的图标按钮）并暴露 `aria-invalid`、调用方的 `aria-labelledby` 接在字段标签后面，搜索结果数会念出全部匹配条数，Tokenizer 全部清除会播报一次、禁用时不再向表单交值、聚焦展开的清单里选一项后焦点和清单保留且下一项高亮、有标签时光标落在最后一个标签后面；MultiSelector 和 Selector 的忙碌图标不再对读屏暴露并只播报一次「加载中」，MultiSelector 的 `aria-labelledby` 接在字段标签后面、带搜索时必填标记挪到搜索框、自制触发器带 `aria-disabled` 且禁用时不再执行调用方的处理；选项列表打开时不再高亮禁用项、按字母跳转忽略重音、键盘滚动让行从静止的鼠标下冒出来时不抢高亮；强制颜色下可聚焦的禁用字段焦点边框取 Highlight，触屏上输入框焦点外观不再淡入。

## 0.12.1

### Patch Changes

- [#541](https://github.com/astryx-vue/astryx-vue/pull/541) [`a059c14`](https://github.com/astryx-vue/astryx-vue/commit/a059c14bcde7d82367b5bf2f82e6e2b6d81d4b39) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Lightbox 修了一批看图时的问题：从右往左的页面里方向键朝按钮那一侧翻页；第一项还没到就打开的灯箱等它到了再打开；NaN 或小数下标显示最近的一项；`0` 回到适应大小；换页播报在打开的灯箱里也听得到；Tab 不再跑出灯箱；关闭或被移除时焦点回到打开者；关着时视频不自动播放，关闭时停下正在播的视频；单张照片的图注也坐在图注底色上；点照片旁边的空白会关闭；高度按手机实际露出的视口算，Safari 工具栏不再盖住图注。

- [#542](https://github.com/astryx-vue/astryx-vue/pull/542) [`d74f8eb`](https://github.com/astryx-vue/astryx-vue/commit/d74f8eb77d168e27efbad72a49268dff795d3de5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 浮层与提示的一批修正：Tooltip 在焦点到达时才判断它算不算触发焦点（漫游 tabindex 成员、可聚焦的包裹层都能用键盘打开，鼠标按下后脚本挪来的焦点不再打开提示），`isOpen` 为 false 时本该打开的焦点只发出 `openChange(true)`，禁用时收起已打开的提示；Popover 的高度跟随动态视口并避开刘海和主屏指示条，屏幕键盘弹出时锚定浮层落在键盘上方；触摸在浮层外按下后拖动不再关掉浮层；Dialog 与 Drawer 的遮罩不再模糊；InfoTip 在粗指针下的点击区域随邻居间距伸缩，补了「指标释义」和「权限说明」两个示例；LayoutContent 也带上 `data-container`，主题可以把对话框、卡片的正文和页眉页脚分开设计；新增 useLightbox 文档页。

- [#541](https://github.com/astryx-vue/astryx-vue/pull/541) [`32ea195`](https://github.com/astryx-vue/astryx-vue/commit/32ea1954e3beea4936962d24d555582c8a859b9b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Popover 和 Dialog 的焦点更稳：打开时焦点落在第一个可用的 Tab 停靠点（跳过 aria-disabled 控件，onShow 里自己放好的焦点不再被挪走）；关闭时只把困在里面的焦点送回打开者，打开者不在了就找它附近的停靠点，不再掉到 body，也不再抢走你在关闭回调里放好的焦点。关着的 Popover 不再带 dialog 角色和名称，关着的触发器不再写 aria-controls，aria-disabled 的触发器不会打开浮层。

## 0.12.0

### Minor Changes

- [#540](https://github.com/astryx-vue/astryx-vue/pull/540) [`083cd85`](https://github.com/astryx-vue/astryx-vue/commit/083cd85c3e72ee76353719f81598895b13707072) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Table 新增 `useTableInfiniteScroll`：按批加载扁平数据，表格下方有「加载更多」按钮，表格末尾滚进视口时自动加载下一批，失败后暂停自动加载、按钮仍可重试；第一批加载中时表格不显示默认空状态。`TablePlugin` 新增 `loadingState` 钩子，导出 `TableLoadingState` 类型。同时补充 `useTableSortable`（不会重排行、`useTableSortableState` 参数说明）、`useTableFiltering`、`TableSelectionToolbar` 和 Table 的文档。

### Patch Changes

- [#539](https://github.com/astryx-vue/astryx-vue/pull/539) [`b74909f`](https://github.com/astryx-vue/astryx-vue/commit/b74909fc6e89b8cf365eb9ce41cda4178c69cc99) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Table 对齐上游一批无障碍和外观修正：列宽把手按列头可见文字命名、不再混进列头名字，并念出实际列宽和合理的范围；树形表格改用披露模式（行上不再带 `aria-level`、`aria-expanded`，展开按钮用 `aria-controls` 指向子行）；行展开和树形插件新增 `getRowLabel`，按钮名字可以带上行名；`useTableRowIndex` 的 `data` 改为可选；数据模式的列标题跟着 `textOverflow` 折行，窄列里标题先省略、排序和筛选按钮留在格子里；手写行列的表格放不下时横向滚动，不再把单词压成一个字母宽；固定列自己画行分隔线；行带上 `table-row` 主题目标的 `parity`、`striped`、`selected` 状态；滚动区和树形按钮画共用的焦点环，手机上横向能滚时藏着内容的一侧会淡出；Invalid Date 显示为空格子，排序时当缺失值。

## 0.11.0

### Minor Changes

- [#536](https://github.com/astryx-vue/astryx-vue/pull/536) [`bf97b13`](https://github.com/astryx-vue/astryx-vue/commit/bf97b13f85a406f7e637a8f5b4977546504e28aa) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 实验包新增 CircleCheckIndicator（iOS 的多选圆圈，在主题里映射到 `checkbox` 后所有复选框都画成圆圈，鼠标、触控笔按下时按压色立刻画在圆圈上）和 DialogHeroHeader（标题上方铺满媒体、关闭按钮浮在媒体上的对话框页头）；core 公开 `useDialogContext`，让自己画对话框页头的组件读到标题约定。

## 0.10.2

### Patch Changes

- [#534](https://github.com/astryx-vue/astryx-vue/pull/534) [`dc8015d`](https://github.com/astryx-vue/astryx-vue/commit/dc8015d7a86410799e01769fc2ee0aa4554dabbf) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - FileInput 一次挑了几个不合格的文件时，状态提示按当前语言列出每个文件和原因，不再只说第一个；InternationalizationProvider 漏写 `locale` 时，开发环境直接报错并给出改法。

## 0.10.1

### Patch Changes

- [#533](https://github.com/astryx-vue/astryx-vue/pull/533) [`e869ec3`](https://github.com/astryx-vue/astryx-vue/commit/e869ec3cb4f87419d5f78ddcbf9d5fa1fda63f75) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 语言目录对齐到上游 v0.7.17：键盘按键名、文件大小、字段说明按钮、InfoTip、滑块、Tokenizer 溢出数等文案都能随加载的目录翻译；SideNav、TopNav 标题旁的菜单按钮名带上标题；Table 的排序按钮改用列标题命名，多列排序时用描述读出优先级；文件大小改为 KB、MB 保留一位小数。

## 0.10.0

No changes in this release.

## 0.9.2

### Patch Changes

- [#531](https://github.com/astryx-vue/astryx-vue/pull/531) [`c4f306d`](https://github.com/astryx-vue/astryx-vue/commit/c4f306d4de9b02036f7fc7aae1e9188cd833f535) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 敲字母跳转（菜单、Selector、TreeList 等）不再区分重音和带横线的字母：敲 `a` 能跳到「Ánh」，敲 `d` 能跳到「Đào」；Windows 上用 AltGr 敲出的字母也能跳转。

## 0.9.1

### Patch Changes

- [#523](https://github.com/astryx-vue/astryx-vue/pull/523) [`bd3e926`](https://github.com/astryx-vue/astryx-vue/commit/bd3e92607249ed99ec025c868c6e33690fb2af24) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `useClipboard`、`useTypeahead` 的类型说明注释改为只描述现状。

## 0.9.0

### Minor Changes

- [#520](https://github.com/astryx-vue/astryx-vue/pull/520) [`40d7a78`](https://github.com/astryx-vue/astryx-vue/commit/40d7a782e6a420ce21a3d9d2d8fe1dc6b2fd0162) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 公开 `useComponentMessages` 和各组件的内置文案（如 `tableMessages`、`codeBlockMessages`），自己的组件可以只取用到的几组文案。富文本编辑器改用它，打包时不再带上全部组件的文案。

## 0.8.0

### Minor Changes

- [#518](https://github.com/astryx-vue/astryx-vue/pull/518) [`76d1bb6`](https://github.com/astryx-vue/astryx-vue/commit/76d1bb68afc03cd54a727b22e8932ec8217862cb) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Carousel` 的 `hasSnap` 现在也接受新的 `useSnapPaging()` 返回值，在原生吸附的停点上像 iOS 那样翻页：用手指或触控板横扫时，轻扫一下翻一屏，传 `{ pages: 'item' }` 时翻一项，再快也最多翻一页；翻到一半能用手指接住，最后总停在某一项的起始边。鼠标滚轮和鼠标拖动仍是原生滚动，系统要求减少动态效果时直接跳到目标页。
  
  - 边缘按钮、方向键、Shift 加滚轮和 `scrollNext`、`scrollPrev`、`scrollTo` 都经由同一套翻页来挪，`scrollTo` 落在这一项的吸附停点上（考虑 scroll-padding）。
  - 翻页按住这一行期间，边缘按钮和渐隐跟着这一行显示的位置变，与这一行同一帧变化。
  - 离末端不到半步的停点并入最后一页，原生吸附也跳过那一项，所以每种滚动方式都停在这一行真正的尽头。

## 0.7.29

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

## 0.7.28

### Patch Changes

- [#515](https://github.com/astryx-vue/astryx-vue/pull/515) [`2bd41f7`](https://github.com/astryx-vue/astryx-vue/commit/2bd41f7c964b4b7bc0e31c7594b4703a34ed2189) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 每个组件只带自己的内置文案：只用到 Button、Spinner、Token 这类组件的应用，打包时不再把所有组件的英文和中文文案一起打进去。显示的文字、`InternationalizationProvider` 的用法和 `useAstryxMessages`、`useTranslator` 等公开接口都不变。

## 0.7.27

### Patch Changes

- [#514](https://github.com/astryx-vue/astryx-vue/pull/514) [`cd143dc`](https://github.com/astryx-vue/astryx-vue/commit/cd143dcc55229632183f74c32ae913016782dc07) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 跟进上游的另一组零散修复：
  
  - `Theme` 里没有自己设行高的文字取主题的正文行高（`--text-body-leading`），不再落回 reset 的 1.5；设了文字角色字号的部位（表格单元格和表头、日历、分页小尺寸、Tab、空状态紧凑模式、代码块 sm、Slider 数值、多选和搜索菜单的分组标题等）一并设上这个角色的行高。默认主题下 14px 的正文行高从 21px 变为 20px。想保留旧行高，可以在自己的容器上设 `line-height`，或在主题里设对应角色的 leading token。
  - `astryx-vue search` 认得别的组件库对组件的叫法（`ScrollArea`、`side sheet`、`toggle group`、`circular progress` 等）和常见图标名（`cog`、`lightning bolt` 会找到 `Icon`）；动词只折叠进行时，`listed` 不再当成 `List`。
  - 付款表单和结账向导模板在窄屏首帧（脚本还没量出宽度时）把订单摘要换到表单下面，不再把表单挤窄；`dashboard-scorecard` 和 `dashboard-progress` 模板的整块页面区域不再套卡片。

## 0.7.26

### Patch Changes

- [#513](https://github.com/astryx-vue/astryx-vue/pull/513) [`cc73651`](https://github.com/astryx-vue/astryx-vue/commit/cc73651813d0dc905150a67a8d4377f8f5f882d8) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 图标 SVG 给 id 加前缀时，不再误改 `data-id`、`data-href` 这类名字相近的属性。

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

## 0.7.25

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

## 0.7.24

### Patch Changes

- [#496](https://github.com/astryx-vue/astryx-vue/pull/496) [`6a92b59`](https://github.com/astryx-vue/astryx-vue/commit/6a92b59f5baf06d67147403a5b2ea28f6edffbe9) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Button 跟进上游 [#7906](https://github.com/astryx-vue/astryx-vue/issues/7906)（spec:AST-085）：禁用的按钮不再渲染原生 `disabled`。
  
  - Button、IconButton、ToggleButton 禁用时一律标记 `aria-disabled="true"`，留在 Tab 顺序里；聚焦时被禁用也不会把焦点丢到 body。鼠标、Enter、Space 和 `clickAction` / `click` 照样被拦住，其他按键仍传给调用方。
  - 真正禁用的 submit 按钮不带 `name`，提交时不会带上它的值。
  - ButtonGroup、Toolbar 的成员全部禁用时仍保留一个 Tab 停靠点（`useListFocus` 新增 `hasDisabledTabStop` 选项）。
  - Carousel 隐藏的翻页按钮所在容器加上 `inert`，不会成为 Tab 停靠点。
  - lab 的 ListInput 禁用或加载中时，重排手柄虽然能聚焦，方向键和拖拽都不再重排。
  
  测试里断言 Button 带 `disabled` 属性的，改成断言 `aria-disabled="true"`。
  
  CLI 内置的组件文档跟着更新了 Button、IconButton、ToggleButton、ButtonGroup 的禁用说明。

## 0.7.23

### Patch Changes

- [#494](https://github.com/astryx-vue/astryx-vue/pull/494) [`1d5a19c`](https://github.com/astryx-vue/astryx-vue/commit/1d5a19c11fec40d598457896067445b64a344720) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Button 跟进上游 v0.7.2–v0.7.17 的几处修复：
  
  - 提示文字和按钮的可访问名称相同时，不再把提示挂成 `aria-describedby`，读屏器不会把同一句话读两遍（上游 [#9681](https://github.com/astryx-vue/astryx-vue/issues/9681)）。
  - 按钮的内容容器改成真实的弹性盒子，不再用 `display: contents`，macOS 15 之前的 Safari 里 VoiceOver 能读出带标签按钮的名称；布局不变（上游 [#10256](https://github.com/astryx-vue/astryx-vue/issues/10256)）。
  - 服务端渲染时，用 `aria-disabled` 的 submit / reset 按钮在挂载前先渲染成普通按钮，hydration 之前点它不会提交或重置表单（上游 [#11107](https://github.com/astryx-vue/astryx-vue/issues/11107)）。
  - 强制配色模式下 ghost 按钮不再加边框（上游 [#7677](https://github.com/astryx-vue/astryx-vue/issues/7677) 的一部分）。

## 0.7.22

### Patch Changes

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`20c48f1`](https://github.com/astryx-vue/astryx-vue/commit/20c48f17c0b62e80c233ca7d67e0b63e25b073f5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐原版的若干细节：Button 里带显式 `size` 的 Icon 保持自己的盒子；Tokenizer 默认按内容收缩、有标签时内边距为 3px；Avatar 首字母行高跟正文行高比例走；SideNavSection 标题和条目之间不再多 2px；ChatMessageBubble 的名字行沿用正文样式并按内容收窄靠边；AppShell 自动高度时页头钉在顶部；Selector 下拉列表（无搜索框）把选中项盖在触发器上，选项之间不留空隙；浮层 start 对齐右边放不下时翻成 end 对齐；MoreMenu 行高 md 为 32px；Dialog 里 DialogHeader 无分隔线时内容不再多 16px 顶部内边距。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`5b9dce9`](https://github.com/astryx-vue/astryx-vue/commit/5b9dce93dd38ed2363e396eb120712edb176f005) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游对话类组件的渲染：对话气泡最大宽度回到 `max(80%, 280px)`（窄列里可以超出列宽，和上游一致）；ChatToolCalls 的目标文字可收缩并显示省略号，分组箭头占 14px，单条调用的行不再撑破容器；ChatLayout 滚动按钮隐藏时同时 `visibility: hidden`，图标按 md 尺寸画满；ChatDictationButton 的麦克风图标跟随按钮尺寸；ChatComposerDrawer 的标签在 Layout 悬停时也变深；CodeBlock 标题不再截断、不换行；Markdown 的紧凑密度首尾块去掉外边距，列表恢复两侧 8px 的外扩宽度，表格宽度改为 100%（内容放不下时列内换行）；Text 新增 `size="xsm"`；neutral 主题的 `--astryx-chat-success` / `--astryx-chat-error` 改用 45 档颜色。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`2a38dd0`](https://github.com/astryx-vue/astryx-vue/commit/2a38dd02da165ade1427f88e839596f29a075699) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游 containerReveal：补上粗指针（触摸）下内容始终可见、仅 `hover: hover` 且未禁用时才响应悬停、悬停停留延迟、焦点进入立即显示、`forceState` 的 active / inactive 变体、减少动效下的延迟、保留布局与反向（conceal）变体，以及 `forceVisibility` 的 hidden 在元素自身获得焦点时露出。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`fe5496f`](https://github.com/astryx-vue/astryx-vue/commit/fe5496f0425150f91799da27d1ad1b585e07aaf9) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐原版的若干细节：Toast 关闭按钮改用 ghost 小号 IconButton，卡片内分成正文和尾部两栏、高度不再被按钮撑高；SegmentedControl 图标槽跟分段尺寸走（sm 14px、md 16px、lg 18px）；TreeListItemData 新增 `endContent`，行尾可放行内操作；useContainerReveal 的 `isLayoutPreserved` 只淡入淡出、不再脱离文档流；Section 把自己的内边距也发布成 Layout 区域之间的内侧间距，里面的 LayoutFooter 顶部不再多 16px；Selector 新增 `placement`，下拉面板的尺寸类落在面板自己身上（ghost 触发器字重 500），固定在底部的工具栏可以朝上展开；DropdownMenu 勾选行和单选行不再跟菜单尺寸收紧内边距；CodeBlock 高亮行用主题的 accent-muted 底色，行文本包进内容 span。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`cfb4c25`](https://github.com/astryx-vue/astryx-vue/commit/cfb4c256039f483e4dd0860a2ac245114a20453d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - InfoTip 按上游完整移植：悬停和键盘聚焦预览，点击、轻点、回车或空格钉住，Escape、再按一次、点到外面、滚动外面或焦点离开时关闭；按钮带 `aria-expanded` 和 `aria-controls`，钉住时读屏播报一次帮助文字，按下事件停在按钮上。`useTooltip` 新增 `show()` / `hide()`，Tooltip 的气泡抽成 `TooltipSurface` 与 InfoTip 共用。字段的 `labelTooltip` 改用 InfoTip，名称为 “About 标签”（中文为“关于标签”），隐藏标签时的信息按钮定位照上游。`InfoTipProps`、`InfoTipSize` 从 core 导出，`@astryx-vue/lab` 的 InfoTip 改为已弃用的 core 再导出。EmptyState 的图标容器回到上游的普通块级 div：Icon 按组件或 Iconify 名字画的图标和上游的 `<svg>` 一样是块级（`data-kind='graphic'`），内置图形仍是行内 flex 的 span 且不再带 `vertical-align: -0.125em`，去掉了加载圈的特例。主题补齐上游新增的 token：`--color-info`、`--color-info-muted`、`--color-on-info`，`--color-text-/icon-/border-` 的 info、success、warning、error，`--color-on-*-muted`，`--duration-exit`，`--ease-entrance`、`--ease-move`、`--ease-exit`，七个主题都按上游主题源码的值写入；Chat 的成功、失败颜色改读 `--astryx-color-text-success`、`--astryx-color-text-error` 与 `--astryx-color-icon-*`，去掉各主题 `chat.css` 里的 `--astryx-chat-success` / `--astryx-chat-error` 补丁（变量仍可覆盖）。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游渲染：CodeBlock 标题改用独立的 `--astryx-code-block-title-foreground`（默认 [#525252](https://github.com/astryx-vue/astryx-vue/issues/525252)）；Avatar 的首字母改由 `::before` 生成内容绘制（文字放在 `data-initials` 上，不再是文本节点）；`isLabelHidden` 的隐藏标签组改为 `display: contents`，标签与描述各自按 sr-only（inset 0、clip rect）定位；行内 Dialog 不再是定位祖先，Selector 根节点去掉多余的 `position: relative`，SideNav 顶部区域改为 sticky，Switch 隐藏标签不再撑最小高度。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`5b9dce9`](https://github.com/astryx-vue/astryx-vue/commit/5b9dce93dd38ed2363e396eb120712edb176f005) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 继续对齐原版的交互状态：Popover 的关闭按钮默认文字走本地化词条（英文 "Close popover"）；EmptyState 的图标容器按原版改为块级居中，不再被图标的基线偏移撑高；竖向轨道模式的 Stepper（`indicator-position="on-track"`）把指示点画在轨道列里，和连接线同一列；Step 的指示点和标签的状态样式只认自己的进度和状态，嵌套的步骤条不再吃到外层步骤的样式；Step 标签行撑满一行，结尾内容靠右。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`09a2429`](https://github.com/astryx-vue/astryx-vue/commit/09a2429529e3f7e71efc0e2241e9df54780221a1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐原版的交互状态：Switch 支持 `labelPosition` 和 `labelSpacing`（标签在开关之前、两端分开）；TextArea 的状态消息默认贴在输入框下方（`attached`），消息文字直接放在状态框里；Switch 标签不再撑出 24px 最小高度；TabMenu 的下拉紧贴触发器、宽度随内容；DropdownMenu 条目的上下内边距按原版取 4/6/8px；Button 末尾图标显式指定的尺寸不再被按钮尺寸覆盖；Kbd 在 Neutral 主题下文字用主色。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`6378227`](https://github.com/astryx-vue/astryx-vue/commit/6378227b35868057dd6b0503da763d241319e0ea) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐原版的几处细节：`SideNav` 内置的折叠按钮改放在底部行、与 `footerIcons` 同一行（折叠后列方向反排），底部图标行和 `SideNavItem` 的 `actions` 槽都通过 `SizeContext` 统一成 `sm`；带 tooltip 的幽灵按钮不再参与 `Toolbar` 末端的边缘补偿，和原版里按钮后面紧跟 popover 层的行为一致；`PowerSearch` 的结果数、`endContent` 与清除按钮合成一组，距字段内缘 8px、间距 8px，结果数排在 `endContent` 之前。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游的导航与文本域布局：TopNav / SideNav 标题带 `NavIcon` 时去掉起始内边距，标志贴齐左边；SideNav 滚动区不再有子项间距、没有顶部或底部区域时补成 8px，底部区域改为 sticky，隐藏的分区标题随底部区域定位；可折叠 SideNavItem 的无障碍标签改用 `hidden`，不再产生可见文字节点；SideNavSection 隐藏标题时不再继承 flex 居中；TextArea 的 `rows` 默认 3，高度由行数决定，去掉最小高度并把上下内边距收成 4px（`lg` 为 8px）。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`f63ed1e`](https://github.com/astryx-vue/astryx-vue/commit/f63ed1e87583564a278f4d43fc54fe7e6c09dfc4) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复回归并对齐原版：SideNavItem 的动作区在行内缩进，EmptyState 里的加载圈按行内元素排版，新增 InfoTip（悬停或聚焦时显示帮助文字的信息按钮）。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`5b9dce9`](https://github.com/astryx-vue/astryx-vue/commit/5b9dce93dd38ed2363e396eb120712edb176f005) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `SizeContext`（`SizeProvider`、`useSize`、`provideSize`、`ElementSize`，同时提供 `@astryx-vue/core/SizeContext` 子路径），对齐原版的尺寸级联：容器把默认尺寸往下传，子组件显式写了 `size` 就以自己的为准。`Toolbar`、`ButtonGroup`、`InputGroup` 会向下提供尺寸；`Button`、`MoreMenu`（含菜单行密度）、`TextInput`、`TextArea`、`Selector`、`MultiSelector`、`NumberInput`、`DateInput`、`DateRangeInput`、`DateTimeInput`、`TimeInput`、`SegmentedControl`、`TabList`、`PowerSearch`、`Tokenizer` 读取它。同时对齐原版的浮层视口空隙：空隙只留在远离锚点、可能越界的那一侧，start 对齐的菜单可以和靠近视口边的触发器同起点，不再被推到 16px。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`41cea82`](https://github.com/astryx-vue/astryx-vue/commit/41cea82675601a1396e4ed5c402421f96c92a36d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 Stack、Center、Section、ScrollableArea 没传尺寸属性时会抹掉使用方 `style` 里的 width / maxWidth / height / minHeight；Slider 控件高度改成和原版一样的 20px，只在触屏（粗指针）时撑到 24px。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐一批小的位置偏差：DialogHeader 监听 `openChange` 时渲染关闭按钮；TextArea 接受原版写法 `maxLength`，计数区行高和底部留白对齐；RadioList 描述不再多出 2px 间距；NumberInput 步进列宽 16px；Table 排序图标缩到 xsm 并随表头居中，筛选按钮的名称改为「筛选 + 列标题」；TopNav 下拉触发器间距 8px、箭头 1em；FileInput 拖放区图标用 md；TreeList 展开箭头去掉多余外边距；SideNavItem 行内展开箭头为 24px 宽盒子。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐原版的 Stepper、CheckboxList 和 Dialog 渲染：横向轨道模式把连接线和指示点画进控件内，整块步骤是一个点击目标；「Optional」拆成 `•` 与文字两个节点；步骤标签单行省略，未开始步骤的标签用次要色，数字指示点文字直接放在徽标里，禁用步骤的指示点用禁用色；分离模式下指示点和标签放进同一行容器、控件左右内边距固定为 8px，竖向步骤间距为 4px；传了 `onStepClick` 时禁用步骤也保留按钮（`aria-disabled`），插槽为空时不渲染内容区。紧凑密度的 CheckboxListItem 用可见标签命名复选框。Dialog 内层向 Layout 公布内边距，使 Layout 撑到对话框边缘、各区域自带内边距；放在 Layout 页头槽里的 DialogHeader 自带页头内边距。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`20c48f1`](https://github.com/astryx-vue/astryx-vue/commit/20c48f17c0b62e80c233ca7d67e0b63e25b073f5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐原版的表格与相关组件细节：带右键菜单的单元格（可展开行）左右内边距各多 1px，最后一格再叠一份边距；表格分组标题的标签和空格分成两个文本节点。`MultiSelector` 清除按钮改用 `InputClearButton`（20px 的幽灵图标按钮），`MultiSelector`、`Selector`、`ComplexSelector` 的触发框改成固定高度（sm 28 / md 32 / lg 36）和 8px / 12px 的内边距。`Link` 的外链图标换成语义图标 `externalLink`。`Markdown` 的代码块按最长行收缩并以 `contentWidth` 为下限、居中时块自己居中，引用块始终贴左且文字用次要色、首尾子块不再带外边距，列表在居中时按外扩 8px 的宽度居中。`CodeBlock` 的收缩下限可用 `--astryx-code-block-min-width` 调整。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐上游 origin/main 的几处渲染差异：
  
  - `NumberInput` 标签隐藏时也渲染 Field：保留读屏用的隐藏 `<label>`，`width` 也能落到外层。
  - `ChatMessageBubble` 按内容收窄，去掉 280px 的最小宽度，例如「Where's my order?」宽 148px，发出的消息靠右。
  - `Selector` 新增 `startIcon`，画在触发器最前面，设了它就不再画选中项自己的图标；触发器外壳的间距改为 8px；选项 `icon` 可以直接传 VNode，按它自己的尺寸画，不再套 16px 的盒子。
  - `Text` 支持 `type="inherit"`：字号、行高、字重和颜色都跟随父元素。
  - `Collapsible` 的文字触发行裁掉行高留白，箭头盒子改为 17px（`--text-large-size`），高度和上游一致；自定义的高内容照常撑高触发行。
  - `Table` 只有作为容器的直接首个或末个子元素时，才在上下方向贴到容器边缘，同上游 [#12068](https://github.com/astryx-vue/astryx-vue/issues/12068)。
  - `TreeList` 的条目支持 `startContent`。
  - `TextArea` 计数器改成「164/2,000」的格式。
  - `Token` 默认颜色的文字改用 `--color-text-primary`。
  - `Text` 的每种 `type` 都写明默认字重（同上游 defaultWeightByTypeStyles），不再继承父元素的字重。之前放在粗体容器里的 supporting 文字会跟着变粗、宽出约 2.8%。
  - display 型 `Heading` 的字重跟随自己的层级（h1 是 600），字号和行高仍取 display 档，和上游实际渲染一致。
  - `Link` 新增 `type`（默认 `body`），决定字号、行高和字重，用法同 Text；嵌在文字里的链接用 `type="inherit"`。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`b9c31f8`](https://github.com/astryx-vue/astryx-vue/commit/b9c31f8af30e04abb0c5f280a8af552f0932deff) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Theme` 里没写字号、只继承字号的文字改用主题的正文字号（`--astryx-text-body-size`，默认 14px），不再是浏览器的 16px，同上游 dda98593dc。Card、Stack 里的纯文本和 `Text type="inherit"` 都随主题字号走。

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

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`93a2bd6`](https://github.com/astryx-vue/astryx-vue/commit/93a2bd610b7da4be7f8a9bdaf60a998ff3dc87ef) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题补齐上游剩下的规则。Butter、Gothic、Y2K 新增 `own-fill.css`，对应上游的 `OWN_FILL_RULES`：卡片、浮层、菜单、输入框、分段控件选中项、条纹表格行等自带填充的部件，把主题自己的主文字、次要文字和强调色重新设一遍，放进分类色卡片时不再继承卡片的深色文字；Butter、Y2K 的 `selected-text.css` 补上分类色卡片里（含嵌套一层）选中行、树节点、数字角标的次要文字色。Button 的 destructive 变体在没有主题时回到上游的实心填充（`--astryx-color-error` 配 `--astryx-color-on-error`），焦点环也改用 `--astryx-color-error`；各主题自己的 destructive 取值不变。字体大小接入上游的动态字号：新增 `dynamicType`、`textSizeSync` 和 UIKit 字号表，七个主题的 `--astryx-font-size-*` 与 `mobile-type.css` 写成 `calc(自身大小 * var(--_dynamic-type-*, 1))` 并以下一档为上限，Butter、Stone、Y2K 的 `--astryx-text-supporting-size` 为 `0.75rem` 乘 Footnote 的比例；根 `Theme` 挂载时读取 iOS 的文字大小（或 `env(preferred-text-scale)`）给整页设置比例，运行时 `defineTheme` 生成的样式表同样按此写字号。默认字号下计算值不变。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`6d652d0`](https://github.com/astryx-vue/astryx-vue/commit/6d652d0daa9a479fc3c3d2a647133b50b25d07a8) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 聊天发送按钮停用时和原版一致：保留主色，只按按钮的停用样式降到 50% 不透明度，不再改成灰底。Neutral 里带 `:root` 前缀的选中文字和分段控件规则不再作用到嵌在其他主题里的元素，同一页面加载多套主题时每套主题和单独加载时渲染一致；Butter 顶部导航的未选中项和选中项颜色改回原版的两档蓝。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`996f0de`](https://github.com/astryx-vue/astryx-vue/commit/996f0debe329d945925dfb633b9e05cc45b6a7fa) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题页的展示区和原版逐项对齐：Button、Field 标签、TopNav 条目、RadioList 的字号与行高改读主题的文字 token（label / body / large），不再写死 14px 和 1.4286，所以 stone、gothic、matcha、y2k、butter 下按钮是 16px 或各自的字号；Selector 的触发器改用 `size-element-*` 尺寸 token 和上游同款的行高公式，MultiSelector 控件的字号行高改用 label token；各主题根元素不再设行高，行高继承宿主页面，和原版一致；gothic、y2k、butter 的「自带底色区域文字色」规则改挂到 `.astryx-selector-field` / `.astryx-multi-selector-control`（带 `data-variant='input'` 的那一层），标签不再被误染成浅色。

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`ea63146`](https://github.com/astryx-vue/astryx-vue/commit/ea6314652240068183179c7edbfdfa1917830857) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题 token 按上游重新逐项对齐：把上游七套主题源码连同调色板引用打包，用上游的 `deriveStatusRoleTokens` 生成，再逐个核对 211 个 token 的亮、暗两档，修掉 `--color-success` / `--color-error` / `--color-warning` 的旧值（如 neutral 的 `[#198100](https://github.com/astryx-vue/astryx-vue/issues/198100)`、`#64af4c`）、`--color-accent-muted`、`--color-skeleton`、各主题的状态 muted 与文字色、色板上的 `--color-*-green/red/yellow` 等。Neutral 不再保留上游已经去掉的主题本地状态 token（只留已弃用的 `--astryx-theme-neutral-color-status-fill-accent`），Badge、StatusDot、Avatar、ProgressBar 的状态色直接读 `--astryx-color-info/success/warning/error`，破坏性按钮用 `--astryx-color-error-muted` 和 `--astryx-color-on-error-muted`；Chocolate、Matcha 的破坏性按钮和 info 徽章、Butter 的状态徽章与破坏性按钮、中性徽章也照上游改了。
  
  Banner 照上游按状态取 `--astryx-color-<status>-muted` 和 `--astryx-color-on-<status>-muted`：标题、说明和状态图标继承这个前景色，终端内容回到普通文字色，只有内置的展开、关闭按钮跟随状态前景。Gothic、Butter、Stone、Y2K 主题改为在 `.astryx-banner[data-status]` 上重指这两个 token（与上游 `status:*` 覆盖一致），Neutral、Chocolate、Matcha 不再覆盖。`--astryx-banner-*-background/foreground` 仍可作为覆盖。
  
  动效 token 接入组件：`--astryx-duration-exit`、`--astryx-ease-exit` 用于触屏按压释放（淡出时长也由控制器抬手时读取，默认 175ms）、Switch、ClickableCard、SelectableCard、Thumbnail、列表行和树列表行的释放过渡，以及 BottomSheet 的指针退出曲线；`--astryx-ease-entrance` 用于 Dialog 与 Popover 的进入（Popover 时长改为 `--astryx-duration-medium-min`）；`--astryx-ease-move` 用于树列表和表格的展开箭头。
  
  PowerSearch、Selector、Tokenizer 抽出纯函数和组合式函数（`menuStyle`、`selectorStatus`、`useSelectedOverlay`、`inputAttrs`），行为不变，回到单文件 500 行以内。
  
  同一批里还对齐了：代码块的语法色（comment、operator、punctuation、diff 标记等）和代码块背景、高亮底色（高亮改读 `--astryx-color-accent-muted`），Neutral 选中行底色与聚焦环改读 `--astryx-color-accent-muted`、`--astryx-color-accent`，步骤条未开始的数字底改读 `--astryx-color-background-muted`；Neutral、Butter、Y2K 选中行、树节点、单选项、文件拖放区、角标的次要文字按上游退一档（新增各主题的 `selected-text.css`）；演练场主题编辑器生成的深色文字改为 `[#111111](https://github.com/astryx-vue/astryx-vue/issues/111111)`；`@astryx-vue/lab` 的样式入口去掉已不存在的 `info-tip.css`。

## 0.7.21

### Patch Changes

- [#487](https://github.com/astryx-vue/astryx-vue/pull/487) [`09406e4`](https://github.com/astryx-vue/astryx-vue/commit/09406e4bd9394300ebe5ddb06a60443a40916b51) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - CodeBlock 服务端渲染后 hydration 不再出现差异。之前 CodeBlock 在 setup 里检测浏览器是否支持 CSS Custom Highlight API：服务端只能用 span 着色，Chromium 一进来就选 Highlight API，两边渲染出的行结构不同。现在挂载前一律用 span，挂载后再换成浏览器支持的方式。

- [#487](https://github.com/astryx-vue/astryx-vue/pull/487) [`7cc9752`](https://github.com/astryx-vue/astryx-vue/commit/7cc97528ab7160b7c7b0664b365a78ce407237f5) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 内联展开的 MoreMenu 不再打乱页面上其他弹层的 hydration。内联菜单之前用 `<Teleport disabled>` 包住子菜单的 Teleport。Vue 3.5 水合这种嵌套时会让子菜单占走外层在 body 里留的空位，之后每个传送到 body 的弹层（Tooltip、Popover、聊天输入框的建议列表等）都会对上前一个弹层的服务端 HTML。内联菜单现在直接原地渲染，不再经过 Teleport。

- [#487](https://github.com/astryx-vue/astryx-vue/pull/487) [`0178b04`](https://github.com/astryx-vue/astryx-vue/commit/0178b0495d010c81d4877af48763e4cb8532baeb) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `useSpeechRecognition` 和 `useChatDictation` 在组件里改为挂载后才检测浏览器是否支持语音识别，组件外仍立即检测。之前 setup 里就读 `webkitSpeechRecognition`：服务端为 false，Chromium 为 true，默认在不支持时隐藏的 ChatDictationButton 因此只在客户端出现，后面组件的 `useId()` 全部错位。

- [#487](https://github.com/astryx-vue/astryx-vue/pull/487) [`10044cd`](https://github.com/astryx-vue/astryx-vue/commit/10044cd7550c3e5234483490b017c33bf59efd29) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `useTheme` 和 `useSyntaxTheme` 挂载前不再读读者的页面：主题没有指定 light 或 dark 时 `mode` 先按 light 解析，`useTheme().token()` 也先不读文档上的计算样式，挂载后再跟随页面（`data-astryx-color-mode`、`dark` 类、系统偏好、页面定义的 CSS 变量）。服务端看不到这些，之前深色页面或定义了 token 的页面在 hydration 时文字和颜色都会对不上。

- [#487](https://github.com/astryx-vue/astryx-vue/pull/487) [`900f0ed`](https://github.com/astryx-vue/astryx-vue/commit/900f0edeb7f06989850b955267249dfff5f3c5b3) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - VisuallyHidden 渲染成 `input` 这类空元素时不再挂载插槽。服务端不会给空元素输出子节点，客户端却多出一个空插槽，SelectableCard 里的隐藏复选框因此 hydration 失败。

## 0.7.20

### Patch Changes

- [#477](https://github.com/astryx-vue/astryx-vue/pull/477) [`ceb6ae3`](https://github.com/astryx-vue/astryx-vue/commit/ceb6ae3cd75452218e7978d7232feed3b817090f) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Align Markdown and List number markers by their trailing edge without letting wide counters wrap or push text. Keep the Selector and MultiSelector focus border and inset paint visible when a disabled field receives keyboard focus.

## 0.7.19

### Patch Changes

- [#476](https://github.com/astryx-vue/astryx-vue/pull/476) [`1f1209a`](https://github.com/astryx-vue/astryx-vue/commit/1f1209a3255b5d83226ef24d8f6d25645aeaa833) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Keep nested SideNav and TreeList rows full width while moving indentation inside the row, including activation from the indent area. Mirror Drawer entry motion under `:dir(rtl)`, including a direction set directly on the drawer.

## 0.7.18

### Patch Changes

- [#475](https://github.com/astryx-vue/astryx-vue/pull/475) [`021bcb4`](https://github.com/astryx-vue/astryx-vue/commit/021bcb467162f0175e3aae49f14a504cb64631ee) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Keep Field's horizontal-label layout marker authoritative while preserving caller attributes and styles. Omit EmptyState icon, description, and action wrappers when their values or slots are empty, so no blank layout gaps remain.

## 0.7.17

### Patch Changes

- [#474](https://github.com/astryx-vue/astryx-vue/pull/474) [`dbad081`](https://github.com/astryx-vue/astryx-vue/commit/dbad081f09ced3c3a80089070b3980acb2c41e87) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Update Text and Heading truncation tooltips when content changes without a resize, and bind anchors-on-self Tooltips to the real slot root. Forward caller attributes, class, style, and events to the DropdownMenuRadioGroup root while preserving its role and fallback label.

## 0.7.16

### Patch Changes

- [#473](https://github.com/astryx-vue/astryx-vue/pull/473) [`878937f`](https://github.com/astryx-vue/astryx-vue/commit/878937fba15a968ae4d2115f9871190c2854b3d0) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Focus conditionally mounted Dialog headers after the dialog opens and restore focus to the saved opener on close. Keep MobileNav mounted and focus-contained through its 300 ms exit animation, while reduced-motion users still close immediately.

## 0.7.15

### Patch Changes

- [#471](https://github.com/astryx-vue/astryx-vue/pull/471) [`9a83bc0`](https://github.com/astryx-vue/astryx-vue/commit/9a83bc0b6d239985f52ad4737f76eb10d634307d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 CodeBlock 被指定高度时滚动区域不跟着撑满的问题：横向、纵向滚动条现在贴着容器底边，而不是停在内容最后一行下面。

## 0.7.14

### Patch Changes

- [#453](https://github.com/astryx-vue/astryx-vue/pull/453) [`6d4641e`](https://github.com/astryx-vue/astryx-vue/commit/6d4641ec4b35370d51c51d654ee4aee071801c30) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - lab 增加 ChatEmojiPicker 和 ChatReactionBar。core 把 `@astryx.emojiPicker.*`、`@astryx.comments.*`、`@astryx.commentComposer.*` 接进文案树，`useTranslator` 可以按这些键取句子。

## 0.7.13

### Patch Changes

- [#452](https://github.com/astryx-vue/astryx-vue/pull/452) [`9f1f68a`](https://github.com/astryx-vue/astryx-vue/commit/9f1f68a28296b709479407fbca2c1a229e01491e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Code 高亮范围支持单文本节点的行内绘制，供 contenteditable 编辑器复用；保留文本内容并支持清理旧范围。

## 0.7.12

### Patch Changes

- [#451](https://github.com/astryx-vue/astryx-vue/pull/451) [`ca5a8ea`](https://github.com/astryx-vue/astryx-vue/commit/ca5a8eaf3eb9f2dc966d89995697bd3d2feda936) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 Popover 挂载时受控打开、外部锚点定位与滚动监听的初始化；hasLightDismiss 不再意外关闭 Escape。

## 0.7.11

### Patch Changes

- [#449](https://github.com/astryx-vue/astryx-vue/pull/449) [`d3a9e5f`](https://github.com/astryx-vue/astryx-vue/commit/d3a9e5f8d58d3c2f1f5302860650e3500fd75796) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - GridSpan 的单列使用 minmax(0, 1fr)，长 Token 或其他宽内容不再把内部列撑出网格单元。

## 0.7.10

### Patch Changes

- [#448](https://github.com/astryx-vue/astryx-vue/pull/448) [`49efa1f`](https://github.com/astryx-vue/astryx-vue/commit/49efa1f4b1f033a46de76eaf2004be7669bf11fe) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 让 DateRangeInput 和 DateTimeInput 在禁用或忙碌时保留键盘焦点与焦点环，同时阻止打开、编辑和调用方点击回调；不可用的日期范围预设也保持可聚焦。Carousel 边缘按钮用完滚动方向后，把焦点交给滚动区域，不跳到另一端。ComplexSelector 禁用后不再显示 ghost/secondary hover，并保留禁用透明度与指针。

## 0.7.9

### Patch Changes

- [#445](https://github.com/astryx-vue/astryx-vue/pull/445) [`8a86866`](https://github.com/astryx-vue/astryx-vue/commit/8a86866bd08cf332afb296e3099b6714c562c8ed) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 Selector 选项在窄列表中不能收缩的问题。选项允许 `min-width: 0`，长标签可以按现有省略样式收缩，不再把弹出层撑出窄容器。

## 0.7.8

### Patch Changes

- [#444](https://github.com/astryx-vue/astryx-vue/pull/444) [`63cfdac`](https://github.com/astryx-vue/astryx-vue/commit/63cfdac4324597396e1be4f7029e9a73282a235b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Markdown 在内容及其渲染输入没有变化时复用已生成的子树，不再因容器对齐等无关变化重新解析。链接回调等输入变化仍会生成对应的新输出。

- [#444](https://github.com/astryx-vue/astryx-vue/pull/444) [`09d2796`](https://github.com/astryx-vue/astryx-vue/commit/09d2796d233d2ca7a82aadf1b476d31739b3c0c6) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Token 的删除按钮在可见 X 四周外扩 4px 作为指针热区，扩大点击范围但不覆盖旁边的值；LTR 和 RTL 都适用。

## 0.7.7

### Patch Changes

- [#443](https://github.com/astryx-vue/astryx-vue/pull/443) [`4351a2b`](https://github.com/astryx-vue/astryx-vue/commit/4351a2baf8a5f81a93744994d3621ba40eedef3d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 恢复 CommandPaletteInput 的可见键盘焦点。键盘进入时显示统一焦点环，指针聚焦时不额外显示；调用方的 focus、blur 回调继续执行。

## 0.7.6

### Patch Changes

- [#442](https://github.com/astryx-vue/astryx-vue/pull/442) [`b3a63e7`](https://github.com/astryx-vue/astryx-vue/commit/b3a63e769e1be385051ee892b1f3c73d27702684) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - ChatTypingIndicator 不再自带 live region。独立使用时，名称标签通过共享 polite 通道播报，并在标签变化时去重；清空后再次出现会重新播报。位于 Chat log 或其他 live 容器内时交给外层容器，避免重复朗读。

## 0.7.5

### Patch Changes

- [#440](https://github.com/astryx-vue/astryx-vue/pull/440) [`9e510f3`](https://github.com/astryx-vue/astryx-vue/commit/9e510f3a8608c8f24656de70aa7545dbd31225b1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - DropdownMenu 的 BottomSheet 改为按需加载，普通 popover 不再静态携带这部分实现。SSR 和水合首帧跳过尚未加载的面板；键盘打开早于下载完成时，面板到达后仍会聚焦第一行。

## 0.7.4

### Patch Changes

- [#439](https://github.com/astryx-vue/astryx-vue/pull/439) [`30ae6eb`](https://github.com/astryx-vue/astryx-vue/commit/30ae6eba1f83f87b6120081a6d668fa71e50a575) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 Chat 状态播报。ChatSystemMessage 不再重复声明 live role，交给外层 ChatMessageList 的 log。ChatComposer 的可见状态条不再兼任 live region，错误与警告改经共享 announce 通道分别进行 assertive 和 polite 播报；相同状态不重复，清除后可再次播报。

## 0.7.3

### Patch Changes

- [#438](https://github.com/astryx-vue/astryx-vue/pull/438) [`59d5124`](https://github.com/astryx-vue/astryx-vue/commit/59d5124182f376013d12bc8ee6667acc02b58a61) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复复合控件的禁用焦点。TreeList 的展开按钮、动作按钮和链接改用 `aria-disabled`，保留焦点且阻止行为。Pagination 圆点补齐 roving tabindex、方向键换页和禁用焦点；当前圆点保留唯一 Tab 停靠点。两类控件都显示统一的键盘焦点环。

## 0.7.2

### Patch Changes

- [#437](https://github.com/astryx-vue/astryx-vue/pull/437) [`99c6e58`](https://github.com/astryx-vue/astryx-vue/commit/99c6e58da250ce44e7306d12b62bce18e5186256) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 TopNav 在窄屏遇到长标题时右侧操作区被压缩的问题。标题继续省略，末端内容和菜单按钮保持完整并留在视口内。

## 0.7.1

### Patch Changes

- [#435](https://github.com/astryx-vue/astryx-vue/pull/435) [`d54c4a1`](https://github.com/astryx-vue/astryx-vue/commit/d54c4a1e3f9bd97697e3ec4ce93c0db7cbc07668) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复浮层交互：指针一步移入 Tooltip 时保持显示，禁用后取消尚未执行的显示；根菜单关闭时收好子菜单、上报关闭状态，并阻止旧的悬停定时器重新打开它。

## 0.7.0

### Minor Changes

- [#433](https://github.com/astryx-vue/astryx-vue/pull/433) [`dacf1fe`](https://github.com/astryx-vue/astryx-vue/commit/dacf1fe1fe16bd653cf15b78798e16819a292b29) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `Drawer` 与 `DrawerHeader`：贴边的模态面板，复用对话框的焦点陷阱、焦点归还、滚动锁和 `purpose` 关闭规则。`DropdownMenuSubMenu` 支持 `header` / `footer`：有头尾时子菜单面板变成以行为名的模态对话框，Tab 在头部、行、尾部之间循环。

## 0.6.1

### Patch Changes

- [#419](https://github.com/astryx-vue/astryx-vue/pull/419) [`f0edcfe`](https://github.com/astryx-vue/astryx-vue/commit/f0edcfec10c33ae019c076a7d05b87665cbcf347) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `CheckboxInput` 和 `Switch` 禁用时不再用原生 `disabled`，改用可聚焦的 `aria-disabled`：键盘仍能停到控件上，读屏能读到名称和禁用原因，但值不会改变。禁用期间控件同时脱离所在表单，既不会提交，也不会用 `required` 拦住提交。原生复选框的"不确定"状态在禁用点击后保持不变。

- [#420](https://github.com/astryx-vue/astryx-vue/pull/420) [`fb0dacd`](https://github.com/astryx-vue/astryx-vue/commit/fb0dacdda76aa603025210406e12e4c9b41907f7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `createMarkdownFrontmatter` 交给 `parse` 的是普通对象，所以 `parse: fields => fields` 这种原样返回能被当作合法元数据；此前记录没有原型，校验不过，页面会退回成正文并继续显示 frontmatter。叫 `__proto__` 的字段仍是普通字段，不会碰原型。

## 0.6.0

### Minor Changes

- [#415](https://github.com/astryx-vue/astryx-vue/pull/415) [`004f655`](https://github.com/astryx-vue/astryx-vue/commit/004f655f04fcae2194eb694c9a6b61b19adaff0a) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Item` 新增 `align="first-line"`：`startContent` 和 `endContent` 改为相对标签第一行居中，而不是相对整块多行内容居中。标签换行时，状态点、单选按钮、时间戳这类小标记能继续贴着第一行；插槽比第一行高时把文字压下去。默认值仍是 `center`，`center` 和 `start` 的对齐不变。

- [#415](https://github.com/astryx-vue/astryx-vue/pull/415) [`9685f9a`](https://github.com/astryx-vue/astryx-vue/commit/9685f9a39d4b01c73f59237f1cff0326bd60864e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `List` 新增 `edge`，统一决定每行文字、分隔线以及悬停和选中背景相对列表边缘与外围容器的位置。默认 `padded` 保持现有表现；`flush` 去掉行的左右内边距，让静态行的文字、分隔线和背景都落在列表上方标题的竖线上；`outset` 把文字放在这条线上，并让分隔线和背景伸进容器的内边距；`bleed` 让文字落在容器的内边距线上，分隔线和背景铺到容器边缘、四角为直角，像 Card 里的表格行。`outset` 和 `bleed` 读取最近的、共享内边距的容器（Card、Section、BottomSheet、带内边距的 ScrollableArea，或 Layout 区域）；没有这样的容器时和 `padded` 一样。`ListEdge` 类型一并导出。
  
  原来的 `edgeCompensation="inline"` 保留为 `edge="outset"` 的弃用别名，几何位置相同；两个都设置时以 `edge` 为准，并在开发期警告一次。

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`6d366de`](https://github.com/astryx-vue/astryx-vue/commit/6d366de2fac28a02a75315f0b7283a5eed100ca1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Pagination` 的 `compact` 形态可以按需显示首页和末页按钮：传 `hasFirstLast` 后，总数已知就在上一页 / 下一页外侧成对出现；不传仍然是原来的「第几页 / 共几页」。`input` 形态的默认显示不变，其他形态仍然忽略这个属性。

### Patch Changes

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`88e2214`](https://github.com/astryx-vue/astryx-vue/commit/88e22141ad5d24ce3f6db2aefe082a9df44a5359) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Button` 在忙碌只因 `isLoading` 或不可中断的 `clickAction` 未完成时改用 `aria-disabled`，不再设置原生 `disabled`：按钮保持键盘焦点，但点击、Enter/Space 以及冒泡到祖先的点击都会被拦住；`href` 版本忙碌时也保持 `<a>`，不会换成禁用按钮。真正的 `isDisabled`（包括同时忙碌）仍用原生 `disabled`。
  
  首次渲染就处于 loading 的 `Button` 先以空内容挂载 live region，下一帧再写入 loading 文案，避免读屏器跳过与文字同时出现的 live region。

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`c4f2aa5`](https://github.com/astryx-vue/astryx-vue/commit/c4f2aa52b3834549263b8a98e7787ef6a54262c3) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修正导出的 `getWeekNumber`（`plainDateGetWeekNumber`）的 ISO 周数计算：改为和上游 e63f97283 一样在 UTC 锚点上算，而不是拿本地时间的 `Date` 做减法。在夏令时于新年之后才结束的时区（悉尼、奥克兰、圣地亚哥），一周的周四与 1 月 1 日之间的本地毫秒差会带上一小时偏移，遇到 1 月 1 日是星期五的年份（如 2021、2027）就会把整周向上取整：2021 年 4 月的 ISO 第 14 周会算成第 15 周。现在该函数在任何时区都返回同一个周数。

- [#415](https://github.com/astryx-vue/astryx-vue/pull/415) [`22e9a74`](https://github.com/astryx-vue/astryx-vue/commit/22e9a74dcc1bcc38bea4bb8499212afbddf7bbd1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Link`、`Token` 和 `ClickableCard` 禁用时改用 `aria-disabled`，不再用原生 `disabled` 或 `tabIndex=-1`：控件保留 Tab 停留点，读屏仍能读到它的名称和不可用状态；点击、Enter/Space 以及冒泡到祖先的点击都会被拦住，不会触发回调或导航。禁用链接继续不带 `href`，并显式暴露链接角色。

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`78d5669`](https://github.com/astryx-vue/astryx-vue/commit/78d56695cc7ee13c01d3347e4b7dd5ce24665c7a) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Switch` 现在把调用方传入的 `aria-labelledby` 直接作为开关控件的可访问名称，不再和组件自己的标签 id 拼在一起；`aria-describedby` 继续排在本组件自己的说明、状态和禁用原因之前。两个引用都只落在开关控件上，不落在字段外壳上。

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`2a9b503`](https://github.com/astryx-vue/astryx-vue/commit/2a9b50310e32eb840caac6afe1fbaba65a810f8c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修正 Markdown 与富文本的表格边框：每个单元格四条边都画线，不再只有行与行之间的分隔线；表格外沿由表格自身的边框闭合，和格线折叠成一条 1px 的线，不会在边缘叠成双线。两个界面用同一套 `--astryx-color-border` 行线和列线，最后一行、最后一列不重复画线，所以同一张表在 Markdown 阅读状态和富文本里的格子边界一致。

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`346ff39`](https://github.com/astryx-vue/astryx-vue/commit/346ff392db97126214613c6b5608a173b79240a8) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Timestamp` 服务端渲染时不再读取当前时间。绝对格式（`date`、`date_long`、`date_weekday`、`date_time`、`time`、`system_*`、`unix_seconds`）从头到尾不读时钟，服务端渲染、静态预渲染和客户端写出同一段 HTML；`relative`、`relative_short` 和 `auto` 只在客户端读时钟：服务端渲染和 hydration 那一趟输出带时区标签的 UTC 完整日期时间，挂载后换成格式的正常输出，所以服务端和客户端标记始终一致，时区不同的服务器和浏览器也不会 hydration 失败。仅客户端渲染的结果不变。没有 API 变更。

- [#416](https://github.com/astryx-vue/astryx-vue/pull/416) [`a74832f`](https://github.com/astryx-vue/astryx-vue/commit/a74832fee24df16e017324f5fb80e8eff76c9baa) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `ToggleButton` 先执行调用方的 click 处理函数，再决定是否切换：调用方取消这次点击，切换就不会发生。`adjustTime` 收到小数分钟时原样返回，不再产出 `"30.5"` 这种无法再解析的时间。

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`7ba5cb9`](https://github.com/astryx-vue/astryx-vue/commit/7ba5cb9a0de1d4e824baf235ec23524f4c11be7b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - [fix] `Typeahead`、`Tokenizer`、`PowerSearch`：搜索源被替换时清掉旧请求留下的 loading 状态，避免忙碌指示一直转圈。

## 0.5.2

### Patch Changes

- [#272](https://github.com/astryx-vue/astryx-vue/pull/272) [`748f379`](https://github.com/astryx-vue/astryx-vue/commit/748f37980c93fbc5d2f90a07d8a488e34a4fcecd) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修正和上游不一致的几处展示：信息横幅的图标跟随横幅文字颜色，日历网格按弹层宽度流动，步骤序号使用中性强调色。进度条只在向前走一步时从起点线性长满。

## 0.5.1

No changes in this release.

## 0.5.0

### Minor Changes

- **新包 `@astryx-vue/richtext`：富文本编辑器首发。**
  
  - `RichTextEditor`：基于 Lexical 的所见即所得编辑器。标题、列表、引用、链接、代码块、表格、分割线；撤销重做；输入 `# `、`- ` 变成标题和列表；按 Escape 再按 Tab 离开编辑器。只读和禁用是两种状态，读屏软件读得出区别。
  - `RichTextEditorToolbar`：块格式、行内格式、链接对话框（Cmd/Ctrl+K）。图标可以被主题用 `richtext:*` 键换掉。
  - `RichTextView`：只读视图，是文档内容而不是表单控件。内容读不出来时不会带崩页面，改走 `errorFallback` 插槽。
  - 任务项勾选框、代码块标题栏与复制按钮、代码语法高亮、表格列宽、自动链接插件 `RichTextEditorAutoLinkPlugin`。
  - Markdown 原样往返：`markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown`。没改过的块原样导出，只有改动过的块用规范写法。从 `@astryx-vue/richtext/markdown` 引入，服务端可用。
  - Markdown 插件节点：`createRichTextExtension` 加 `markdownExtensions`，节点按 core 的 `Markdown` 一样渲染，当成一个整体编辑。
  - Lexical（`lexical` 和 `@lexical/*`，锁在 0.52）是可选依赖，使用者自己安装。
  
  **core 和 themes 同步升到 0.5.0**（三个包共用一条版本线）：
  
  - 按钮字重、`Text` 的默认颜色（次要文字不再被压成主色）。
  - 表格：内边距、列宽计算、选择列宽度、分组头高度。表格数据模式的列宽现在按声明的比例分配。
  - `Toolbar` 外面套了 `Section`，`variant` 新增 `section`。
  - `StatusDot` 补上 `accent`；`Button` 接上 `icon` 属性；`OverflowList` 按真实的溢出内容测量；`Table` 的 `column.header` 可以传函数。
  - Markdown：标题间距按源文档的标题深度取；`parseInlineAst` 现在能读出放在原文开头的插件语法，起点偏移不再出现 -1。

## 0.4.1

### Patch Changes

- [#225](https://github.com/astryx-vue/astryx-vue/pull/225) [`d6329a1`](https://github.com/astryx-vue/astryx-vue/commit/d6329a1f5be7d544e3b363f0b211acf32124efce) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 这一版修的都是细节，原来的用法不用改。
  
  - 状态图标画得和原版一样了。Banner、输入框的状态提示、信息提示、步骤条、字数超限的计数前面都会显示成功、警告、错误、信息图标，现在这些图标和别处一样从图标表里取：配了图标表（比如 lucide）就画描边的，没配就用 core 自带的实心图形。之前这几处是各自画的描边线条，看着比原版细。
  - `Table` 的行高和原版一样了。表格单元格不再比原版高出一截。
  - Markdown 里不安全的链接地址（`javascript:`、`vbscript:`、`data:text/html`）在解析的时候就整段当成纯文字，里面的行内代码也不再生成。这类链接不会再出现「点了没反应」的样子。
  - 四个空格缩进的内容不再被当成代码块或标题。`    # 标题` 现在是一行普通文字，缩进也原样留着，和原版一致。
  - `parseInline` 和 `parseInlineAst` 只解析行内内容了。传整篇文档给它们只会当一行读，要解析整篇请用 `parseMarkdown`。
  - 插件语法能把整段连标记一起吃掉：`{{see **this**, [that](url), and - this}}` 现在是一个节点，中间不会剩下半截粗体或链接。
  - 被反斜杠转义的 `@` 不再触发插件语法：`\@{ada} then @{ada}.` 只有一个节点。
  - 链接文字、图片说明里写的插件语法不生成节点，和原版一样按纯文字读。
  - 只有勾选框、没有内容的任务项（`- [x] `）会保持勾选状态。
  - `createMarkdownPlugin` 可以写显式泛型了，比如 `createMarkdownPlugin<'mentions', MentionNode>(…)`。这样 `toText` 和 `render` 里的 `node.data` 会收窄到具体类型，不用再写 `as`。
  - `ComplexSelector` 的弹层现在可以调：新增 `popupWidth` 指定弹层宽度，`contentClass` 和 `contentStyle` 给弹层里放内容的那个容器加类名和样式，比如 `contentStyle={{ padding: 0 }}` 能让内容贴到弹层边缘。内边距默认也从外壳移到内容容器上，外观没有变化。
  
  `@astryx-vue/themes` 的样式内容和 0.4.0 一样，只是它和 core 共用同一条版本线，所以跟着一起升到 0.4.1。

## 0.4.0

### Minor Changes

- [#182](https://github.com/astryx-vue/astryx-vue/pull/182) [`0c737f4`](https://github.com/astryx-vue/astryx-vue/commit/0c737f4d278e4f863bf3c702487e2953a21c5a46) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐 Astryx v0.7.1（上一版对齐 0.4.1）。组件、主题和文档站都按原版 0.7.1 逐个核对过，效果和原版一致。
  
  **升级前先看 [升级指南](https://astryx-vue.pages.dev/guide/migration)。** 这一版有破坏性改动，多数项目只需要改三处：
  
  1. `labelHidden` 换成 `isLabelHidden`（旧名还能用，会在之后的版本删掉）。
  2. `useDismiss` 的 `enableEscape` 换成 `dismissOnEscape`。
  3. 自定义主题里的旧挂点名换成带连字符的新名字，比如 `progressbar` 改成 `progress-bar`。
  
  另外几处行为变了，升级指南里都写了新旧写法：
  
  - `@astryx-vue/core/reset.css` 现在是一份完整的全局 reset。只是为了定层级顺序才引入它的，可以直接删掉。
  - `--astryx-spacing-*` 从 px 改成 rem。根字号是默认的 16px 时看起来完全一样。
  - 组件不再输出 `primary`、`sm` 这类裸类名，改用 `data-*` 属性。
  - Selector 的 `variant="default"` 改名 `variant="input"`。
  
  主要新增：
  
  - 输入、选择器、日期类组件新增 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`，可以分别给外框和控件加样式。根上直接写的 `class`、`style` 落点不变。
  - 浮层运行时对齐原版：共享关闭栈，Escape 只关最上面一层；视口内边距；Dialog 里也能挂浮层。
  - 新组件和能力：BottomSheet、PowerSearch、CommandPalette，Markdown 与代码块的子路径导出，Table 的分组、树、固定列、列宽拖动和行级扩展点（插件能拿到整行元素、挂行事件）。
  - `@astryx-vue/themes` 的 Butter、Chocolate、Gothic、Matcha、Stone、Y2K、Neutral 七套主题，取值和原版 0.7.1 逐个比对一致。
  
  修复：
  
  - 嵌套的 Stack 不再继承外层的内边距和间距。
  - Table 列头的筛选按钮和标题、排序箭头排在同一行。
  - Selector 选项的 `icon` 可以是语义图标名、CSS 类、组件或渲染函数。
  - 竖向 Stepper 的步骤内容排在标签下面。

## 0.3.0

### Minor Changes

- [#124](https://github.com/astryx-vue/astryx-vue/pull/124) [`64f55ac`](https://github.com/astryx-vue/astryx-vue/commit/64f55ac66dc2d54a2e681bec8967b06dc66d4dc9) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `@astryx-vue/core/Scrollbars`：`ScrollbarsProvider` 和 `useScrollbars`。在应用外层套上 `ScrollbarsProvider`，组件里的滚动区域会换成 OverlayScrollbars 画的覆盖式滚动条。外观用 `--astryx-scrollbar-*` 变量调整。不套 Provider 时组件行为不变，OverlayScrollbars 的 JS 和 CSS 也不会打进包。`ScrollableArea` 新增 `scrollbars` 属性，设为 `false` 时这块区域保留原生滚动条。原版 Astryx 没有这个能力。

### Patch Changes

- [#119](https://github.com/astryx-vue/astryx-vue/pull/119) [`7df1c8c`](https://github.com/astryx-vue/astryx-vue/commit/7df1c8c6491010de8b8668e92d58ea0bf6232971) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 轮播在渲染时读取默认插槽，不再触发 Vue 的 `Slot "default" invoked outside of the render function` 警告。用渲染函数或 JSX 写轮播时，父组件重新渲染后传下的新卡片会立刻显示，之前会停在旧的一批。卡片的数量或内容变化后，滚动范围会重新测量。页面上的 DOM 结构和卡片自身的状态都没有变化。

- [#123](https://github.com/astryx-vue/astryx-vue/pull/123) [`6181330`](https://github.com/astryx-vue/astryx-vue/commit/6181330956d6ac8b18186177cf9b5aec938330e2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `Text` 的 `as` 现在接受 `h1`–`h6`。模板页面里 `Text as="h1"` 这类写法本来就渲染出真正的标题元素，只是类型没列出来；现在类型对上了。字号仍由 `type` 决定，要标题字号请用 `Heading`。

## 0.2.6

### Patch Changes

- [#111](https://github.com/astryx-vue/astryx-vue/pull/111) [`3016d4e`](https://github.com/astryx-vue/astryx-vue/commit/3016d4edff4583ad2817a49a381af11962b9a0d1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对话触发菜单会显示条目自带的说明，提及和命令不必再手写一行。从按钮插入触发字符时，菜单也会打开。没有单独设置时，较长的粘贴会收成标记。对话框标题可以加底部分隔线，全屏文档能把操作和正文分开。听写按钮直接接收 useChatDictation 返回的响应式状态。流式文本在内容被整段替换时从头显示，同一段继续变长时仍接着往下走。

## 0.2.5

### Patch Changes

- [#82](https://github.com/astryx-vue/astryx-vue/pull/82) [`8a6b048`](https://github.com/astryx-vue/astryx-vue/commit/8a6b048fa94aa76c7547a1758e1a4d514550f0f2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 重新发布 npm 上的包说明。上一版只发了 `@astryx-vue/cli`，`@astryx-vue/core` 和 `@astryx-vue/themes` 在 npm 上仍是旧 README。这次把已经写好的安装步骤、子路径引入、主题 CSS 变量和内置 Figtree 的说明随包发出。

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
