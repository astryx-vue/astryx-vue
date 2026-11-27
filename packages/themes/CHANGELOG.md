# @astryx-vue/themes

## 0.34.0

### Patch Changes

- [#637](https://github.com/astryx-vue/astryx-vue/pull/637) [`ec357d0`](https://github.com/astryx-vue/astryx-vue/commit/ec357d061efa91437a1ed9a852108164a92255f7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题与进度条对齐上游：
  - 主题字体随包安装：Butter、Chocolate、Gothic、Matcha、Stone、Y2K 不再从 Google Fonts 加载自己的字体，改用 `@fontsource` 包，页面从自己的源站取字体。
  - Stone 的 accent 进度条填充改取蓝色阶，Butter 和 Stone 的状态填充与标记取主题的状态色和对应的 on 色，Neutral、Butter、Stone 暗色下的中性和禁用填充取更亮的一档，所有启用的进度条填充在轨道上都够 3:1；其余主题的状态填充走核心的状态文字角色。
  - ProgressBar：状态填充读状态文字角色，neutral 和禁用的填充读次要文字角色（不再读在有些主题里就是暗色轨道本身的禁用文字色）；禁用的进度条轨道和填充降到半透明，强制颜色模式下用 GrayText 描一圈；填充里的标记（accent 除外）取表面色。
  - Stone、Matcha、Neutral、Chocolate、Y2K 的分类色卡片与灰底卡片上，次要文字（Y2K 深色下还有主文字和链接）退到够 4.5:1 的色阶；Y2K 深色下分类色卡片用深色墨水。
  - Chocolate 浅色下的分类文字色（青、绿、橙、粉、红、黄）取更深的色阶；Matcha 暗色下的灰底和浮层底色取主题的深灰中性色。
  - Butter 和 Stone 输入框的状态描边和图标用色阶中段（Butter 浅色下达到 3:1），Stone 随审定后的调色板更新。
  - Butter、Gothic、Y2K 的「自带填充文字色」规则只作用于斑马纹表格的行，普通表格的行保持周围的文字色。
  - Gothic 的强调文字和图标跟着媒体表面的强调色走，浅色表面上不再停在近白色。
  - `reset.css`：`html` 取 `--astryx-font-family-body`，页面里不在主题包装元素内的文字不再退回浏览器的衬线体；带 `list` 的输入框，下拉标记回到输入框中线。
  - 按压反馈：没有按压时收到没带指针 id 的触屏抬起事件，不再抛出「读 null 的 live」的错误。

## 0.33.4

No changes in this release.

## 0.33.3

No changes in this release.

## 0.33.2

No changes in this release.

## 0.33.1

No changes in this release.

## 0.33.0

No changes in this release.

## 0.32.1

No changes in this release.

## 0.32.0

No changes in this release.

## 0.31.0

### Patch Changes

- [#620](https://github.com/astryx-vue/astryx-vue/pull/620) [`a23cb50`](https://github.com/astryx-vue/astryx-vue/commit/a23cb50279f130df2b3ef4fb83cdaa5b9dfb3663) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题系统对齐上游：组件样式的每个样式键可写 `@light` 和 `@dark` 块，只在元素处于对应颜色模式时生效（主题强制的模式、system 主题下读者的偏好、最近一层 MediaTheme 表面）；主题里写的 `:active` 跟随触屏按压模型，手指下只在按压成立时才亮；值为 `undefined` 的组件样式、局部令牌和字体权重视为没写，根部 `localTokens: undefined` 会点名报错；用函数写的内边距（如 `clamp(...)`）按顶层空白拆开；抽屉可经 `drawer` 挂点设置内边距；`--radius-chat` 默认跟随容器圆角（各主题包不再钉死 28px，需要饱满圆角的主题自己写）；只写 `fallbacks` 没有 `family` 的字体角色不再生成字体列表；`Theme` 的 `theme` 传了不是 `defineTheme()` 产物的值时给出开发期提示并沿用外层主题；Chat 输入区的圆角和内边距改挂 `chat-composer` 目标；SyntaxTheme 缺 `theme` 时开发期点名报错；Neutral 暗色辅助文字色提亮到 #a8a8a8，压在半透明中性底色上也达到 4.5:1；样式过的 accent 链接悬停时保留容器或主题给的 `--link-hover-color`；提示卡片在量到底色前按主题给的底色选内容深浅；导出 `compactDefinition` 与 `DEFAULT_COMPACT_DEFINITION`（上游 [#6071](https://github.com/astryx-vue/astryx-vue/issues/6071) [#8301](https://github.com/astryx-vue/astryx-vue/issues/8301) [#9254](https://github.com/astryx-vue/astryx-vue/issues/9254) [#9761](https://github.com/astryx-vue/astryx-vue/issues/9761) [#10420](https://github.com/astryx-vue/astryx-vue/issues/10420) [#11347](https://github.com/astryx-vue/astryx-vue/issues/11347) [#11679](https://github.com/astryx-vue/astryx-vue/issues/11679) [#11759](https://github.com/astryx-vue/astryx-vue/issues/11759) [#11760](https://github.com/astryx-vue/astryx-vue/issues/11760) [#11786](https://github.com/astryx-vue/astryx-vue/issues/11786) [#11802](https://github.com/astryx-vue/astryx-vue/issues/11802) [#11973](https://github.com/astryx-vue/astryx-vue/issues/11973) [#12270](https://github.com/astryx-vue/astryx-vue/issues/12270) [#12794](https://github.com/astryx-vue/astryx-vue/issues/12794) [#11752](https://github.com/astryx-vue/astryx-vue/issues/11752)）

## 0.30.1

No changes in this release.

## 0.30.0

No changes in this release.

## 0.29.0

No changes in this release.

## 0.28.1

No changes in this release.

## 0.28.0

No changes in this release.

## 0.27.0

No changes in this release.

## 0.26.1

No changes in this release.

## 0.26.0

No changes in this release.

## 0.25.0

No changes in this release.

## 0.24.0

No changes in this release.

## 0.23.0

No changes in this release.

## 0.22.0

No changes in this release.

## 0.21.0

No changes in this release.

## 0.20.1

No changes in this release.

## 0.20.0

No changes in this release.

## 0.19.1

No changes in this release.

## 0.19.0

No changes in this release.

## 0.18.0

No changes in this release.

## 0.17.0

No changes in this release.

## 0.16.5

No changes in this release.

## 0.16.4

No changes in this release.

## 0.16.3

No changes in this release.

## 0.16.2

No changes in this release.

## 0.16.1

No changes in this release.

## 0.16.0

No changes in this release.

## 0.15.0

No changes in this release.

## 0.14.0

No changes in this release.

## 0.13.1

No changes in this release.

## 0.13.0

No changes in this release.

## 0.12.1

No changes in this release.

## 0.12.0

No changes in this release.

## 0.11.0

No changes in this release.

## 0.10.2

No changes in this release.

## 0.10.1

No changes in this release.

## 0.10.0

### Minor Changes

- [#529](https://github.com/astryx-vue/astryx-vue/pull/529) [`eaf8636`](https://github.com/astryx-vue/astryx-vue/commit/eaf8636c9905a09460b8e7c15f1b84710a3862ae) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 删掉各主题里只有一行占位注释的 `<主题>/field.css`。主题入口文件（如 `neutral.css`）不受影响；如果单独引入过 `@astryx-vue/themes/<主题>/field.css`，删掉这行引入即可，它本来就不含任何样式。

## 0.9.2

No changes in this release.

## 0.9.1

No changes in this release.

## 0.9.0

No changes in this release.

## 0.8.0

No changes in this release.

## 0.7.29

### Patch Changes

- [#517](https://github.com/astryx-vue/astryx-vue/pull/517) [`3d1eb56`](https://github.com/astryx-vue/astryx-vue/commit/3d1eb56dd9c087bad55a31afffa709929b896dd0) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 状态色按所在的底分成几种角色，组件各取其一：
  
  - `defineTheme` 做的主题只写了状态底色（或改了表面色、`--color-on-dark` / `--color-on-light`）时，会按主题自己的颜色算出没写的 `--color-on-<状态>`、`--color-text-<状态>`、`--color-on-<状态>-muted`，图标和边框角色跟着文字色走；Badge、StatusDot、输入框、图标等组件变量也在这个主题里跟着换。算出来的变量名记在 `theme.derivedTokens`。新增 `STATUS_COLOR_DEFAULTS`，和默认主题 CSS 里的状态色一致。
  - `Icon` 新增 `color="info"`。各主题里 `Icon` 的 success / warning / error 颜色、Stepper 的状态图标改用图标角色；默认主题下成功图标从 `#00490B` 变为 `#2F7D33`。
  - 输入框的状态边框改用边框角色，表单状态提示的文字改用浅底内容色；默认主题下浅色模式的警告边框从 `#FFCE2F` 变为 `[#836700](https://github.com/astryx-vue/astryx-vue/issues/836700)`。
  - 默认主题的 StatusDot 用实心状态底色，图标用对应的 on 角色；头像状态点的图标也用 on 角色。
  - 聊天输入框状态条的文字和图标改用浅底内容色；菜单里的危险操作、TextArea 和富文本编辑器超出字数的计数、未读分隔线标签、lab 里 Stat、CircularProgress、LogStream、SVGIcon 的状态色改用文字或图标角色。
  - 强制配色模式下，Badge、StatusDot、进度条填充、步骤条数字徽标、聊天输入框状态条、列表滑动的危险操作都补一圈边，形状不会消失。
  
  想保留某个组件原来的颜色，在主题里写上对应的角色即可，比如把 `--color-icon-success` 设成原来的值。

## 0.7.28

No changes in this release.

## 0.7.27

No changes in this release.

## 0.7.26

No changes in this release.

## 0.7.25

No changes in this release.

## 0.7.24

No changes in this release.

## 0.7.23

No changes in this release.

## 0.7.22

### Patch Changes

- [#490](https://github.com/astryx-vue/astryx-vue/pull/490) [`cfb4c25`](https://github.com/astryx-vue/astryx-vue/commit/cfb4c256039f483e4dd0860a2ac245114a20453d) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - InfoTip 按上游完整移植：悬停和键盘聚焦预览，点击、轻点、回车或空格钉住，Escape、再按一次、点到外面、滚动外面或焦点离开时关闭；按钮带 `aria-expanded` 和 `aria-controls`，钉住时读屏播报一次帮助文字，按下事件停在按钮上。`useTooltip` 新增 `show()` / `hide()`，Tooltip 的气泡抽成 `TooltipSurface` 与 InfoTip 共用。字段的 `labelTooltip` 改用 InfoTip，名称为 “About 标签”（中文为“关于标签”），隐藏标签时的信息按钮定位照上游。`InfoTipProps`、`InfoTipSize` 从 core 导出，`@astryx-vue/lab` 的 InfoTip 改为已弃用的 core 再导出。EmptyState 的图标容器回到上游的普通块级 div：Icon 按组件或 Iconify 名字画的图标和上游的 `<svg>` 一样是块级（`data-kind='graphic'`），内置图形仍是行内 flex 的 span 且不再带 `vertical-align: -0.125em`，去掉了加载圈的特例。主题补齐上游新增的 token：`--color-info`、`--color-info-muted`、`--color-on-info`，`--color-text-/icon-/border-` 的 info、success、warning、error，`--color-on-*-muted`，`--duration-exit`，`--ease-entrance`、`--ease-move`、`--ease-exit`，七个主题都按上游主题源码的值写入；Chat 的成功、失败颜色改读 `--astryx-color-text-success`、`--astryx-color-text-error` 与 `--astryx-color-icon-*`，去掉各主题 `chat.css` 里的 `--astryx-chat-success` / `--astryx-chat-error` 补丁（变量仍可覆盖）。

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

No changes in this release.

## 0.7.20

No changes in this release.

## 0.7.19

No changes in this release.

## 0.7.18

No changes in this release.

## 0.7.17

No changes in this release.

## 0.7.16

No changes in this release.

## 0.7.15

No changes in this release.

## 0.7.14

No changes in this release.

## 0.7.13

No changes in this release.

## 0.7.12

No changes in this release.

## 0.7.11

No changes in this release.

## 0.7.10

No changes in this release.

## 0.7.9

No changes in this release.

## 0.7.8

No changes in this release.

## 0.7.7

No changes in this release.

## 0.7.6

No changes in this release.

## 0.7.5

No changes in this release.

## 0.7.4

No changes in this release.

## 0.7.3

No changes in this release.

## 0.7.2

No changes in this release.

## 0.7.1

No changes in this release.

## 0.7.0

No changes in this release.

## 0.6.1

No changes in this release.

## 0.6.0

No changes in this release.

## 0.5.2

No changes in this release.

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

No changes in this release.

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

## 0.2.3

No changes in this release.

## 0.2.2

No changes in this release.

## 0.2.1

### Patch Changes

- [#48](https://github.com/astryx-vue/astryx-vue/pull/48) [`09833d1`](https://github.com/astryx-vue/astryx-vue/commit/09833d13706539b032a5d9be9b13a5fd90bcc686) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题入口通过 `fonts.css` 内置 Figtree，和 JetBrains Mono 一样随主题加载，使用方不用再单独引入正文字体。

- [#45](https://github.com/astryx-vue/astryx-vue/pull/45) [`0a1a584`](https://github.com/astryx-vue/astryx-vue/commit/0a1a5845983af52964eac0f4de7ff84c0fddef63) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 中性主题的卡片默认内边距改为间距 3（12px）。卡片里的布局面板内外边距都跟随这张卡片，侧栏文字不再被多出来的内边距挤出省略号。

## 0.2.0

### Minor Changes

- [#40](https://github.com/astryx-vue/astryx-vue/pull/40) [`244d4f2`](https://github.com/astryx-vue/astryx-vue/commit/244d4f28dd69849e28d88c9bfa3ce6f58f36a0a7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Add Theme / MediaTheme / SyntaxTheme, six new first-party themes, expanded docs examples, and the docs Playground.

### Patch Changes

- [#34](https://github.com/astryx-vue/astryx-vue/pull/34) [`94cf3dd`](https://github.com/astryx-vue/astryx-vue/commit/94cf3ddf39bc6b2b3e56323162cea8976aa4fa0e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 补齐 Butter、Chocolate、Gothic、Matcha、Stone、Y2K 六套主题，文档里的主题画廊可以切换预览。

- [#36](https://github.com/astryx-vue/astryx-vue/pull/36) [`7e72b05`](https://github.com/astryx-vue/astryx-vue/commit/7e72b05aff576e0d52cd568c8e58e75951f1c851) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 Theme、MediaTheme 和完整的 SyntaxTheme。主题子树会重新绑定文字、标题和按钮的颜色别名，避免主文字色停在 :root 上已经算好的值。

## 0.1.3

### Patch Changes

- [#29](https://github.com/astryx-vue/astryx-vue/pull/29) [`d4095c9`](https://github.com/astryx-vue/astryx-vue/commit/d4095c9485078893440c1bf3c7c6b6a70a714a71) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增布局组件 AppShell、Layout（含 LayoutHeader、LayoutContent、LayoutFooter、LayoutPanel）、Section、FormLayout、ScrollableArea、ResizeHandle、AspectRatio，以及 useAppShellMobile、useResizable、useScrollableArea、useScrollOverflow。

## 0.1.2

No changes in this release.

## 0.1.1

No changes in this release.

## 0.1.0

### Minor Changes

- [#13](https://github.com/astryx-vue/astryx-vue/pull/13) [`85aa073`](https://github.com/astryx-vue/astryx-vue/commit/85aa073fb5f855847b6951528e5743dc50bc99aa) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 首次发布。`@astryx-vue/core` 提供 Vue 3 组件，`@astryx-vue/themes` 提供 Neutral 主题。
