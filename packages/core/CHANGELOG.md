# @astryx-vue/core

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
