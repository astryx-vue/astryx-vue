# @astryx-vue/cli

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
