# C16 基础展示与动作 · 第 1 轮实现回报

- 工作区：云端 `/workspace`，分支 `sync/c16-display-actions`。基线是 `swarm-tree` 的 `1419a29`。本回报随台账一起提交，并推送到远程、对 `swarm-tree` 开 PR。
- 提交（基于 `1419a29`）：
  - `cc9dd7d` docs: 写下 C16 基础展示与动作的执行计划
  - `2921960` fix(core): 基础展示组件对齐上游 v0.7.1 的按压和导航
  - 台账和本回报是紧随其后的一次提交

## 1. 做了什么

1. 抽出 `packages/core/src/Link/safeUrl.ts`。`javascript:`、`vbscript:`、`data:text/html`（含冒号后的空白和控制字符）判为不安全。Button、Link、Token、Citation、可点头像在导航前使用。不安全的地址不进 `href`，也不交给自定义链接组件。
2. Button、Link、Token、缩略图打开按钮、可点的 AvatarGroupOverflow 接上 `usePressFeedback`。Button 和缩略图自己画按压（`hasOverlay: false`），Link、Token、溢出标记用默认按压层。粗指针不再用 `:active`。按压规则和悬停同一权重并写在后面。带标签的按钮 `min-width: 0`、`max-width: 100%`，纯图标按钮不收缩。按钮按尺寸 `provideIconSize`（sm、md 为 16px，lg 为 20px）。组内按钮不单独缩放。Token 禁用指针改为 `default`。
3. ButtonGroup 改用 `useListFocus` 的漫游 tabindex。方向键遇到更近的 `[role="group"]` 或 `[popover]` 就停。`useListFocus` 的 `orientation` 放宽成可读的响应式值，按钮组能跟着自己的方向走。Escape 不再被组吃掉。
4. 头像首字母按字素取字母、数字和表情，跳过标点。可点但没有可用名字、调用方也没给无障碍名称时，开发期警告。头像组用 `--astryx-avatar-group-overlap`，边距写在头像自己身上，组上补回起始边距。溢出标记带 `data-size`、`data-shape`。有可点头像时组内漫游焦点，并读出键盘提示。
5. 引用块去掉 `footer`，空字符串出处不渲染，长词 `overflow-wrap: break-word`。没有安全网址的引用是 `role="group"` 的 span。键盘徽章前景改成主文字色。轮播滚动区加上 `astryx-carousel-scroller`。
6. 补了按压标记、图标尺寸、危险协议、漫游 tabindex、行内 popover、首字母、溢出标记、引用角色、引用块结构这些测试。`pnpm sync` 跑过，生成文件没有变化。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Link/safeUrl.ts` | 79 | 判断导航地址安不安全 |
| `packages/core/src/Button/Button.vue` | 255 | 按压标记、图标尺寸、安全链接 |
| `packages/core/src/ButtonGroup/ButtonGroup.vue` | 90 | 漫游焦点的按钮组 |
| `packages/core/src/Link/Link.vue` | 193 | 按压层和安全链接 |
| `packages/core/src/Token/Token.vue` | 137 | 可点令牌的按压和安全链接 |
| `packages/core/src/Thumbnail/Thumbnail.vue` | 134 | 打开按钮的按压标记 |
| `packages/core/src/Avatar/Avatar.vue` | 293 | 首字母、警告、安全链接、组内标记 |
| `packages/core/src/Avatar/utils.ts` | 132 | 按字素取首字母 |
| `packages/core/src/AvatarGroup/AvatarGroup.vue` | 70 | 重叠变量和可点头像的漫游焦点 |
| `packages/core/src/AvatarGroup/AvatarGroupOverflow.vue` | 77 | 溢出标记的主题属性和按压 |
| `packages/core/src/Citation/Citation.vue` | 92 | 有网址才是链接，否则是命名的组 |
| `packages/core/src/Blockquote/Blockquote.vue` | 33 | 出处直接放在引用块里 |
| `packages/core/src/Carousel/Carousel.vue` | 188 | 滚动区的稳定类名 |
| `packages/core/src/composables/useListFocus.ts` | 434 | 方向可以跟着 props 变 |
| `packages/core/styles/button.css` | 349 | 缩小、按压盖过悬停 |
| `packages/core/styles/button-group.css` | 72 | 组内按钮不缩放 |
| `packages/core/styles/avatar-group.css` | 70 | 重叠边距和起始补偿 |
| `packages/core/styles/thumbnail.css` | 159 | 细指针才用 :active，按压走图片 |
| `packages/core/styles/token.css` | 179 | 禁用指针为 default |
| `packages/core/styles/kbd.css` | 30 | 主文字色 |
| `packages/core/styles/blockquote.css` | 20 | 长词折行 |

IconButton 包着 Button，按压和图标尺寸跟着按钮走，没有单独改文件。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 触屏按压 | `usePressFeedback`，粗指针不看 `:active`，按压盖过悬停 | 同一个 composable。按钮和缩略图读 `--_press-paint-image`，链接和令牌用 `astryx-pressable` | 控制器写的属性和淡出时长是 B3 的，组件只负责把标记挂到画按压的元素上 |
| 按钮缩小 | `minWidth: 0`、`maxWidth: 100%`，纯图标 `flexShrink: 0` | 写在 `.astryx-button` 和 `[data-icon-only]` | 窄行里带标签的按钮能省略，纯图标保持正方形 |
| 组内不缩放 | 在组里就不套 `pressable` 的 transform | 组选择器把 `:active` 和按压的 `transform` 收成 `none`，权重要高于按钮自己的规则 | 一组表面一起动，单个按钮不再缩一下 |
| 图标尺寸 | sm、md 对应图标 sm，lg 对应 md | `provideIconSize` | 按钮里的图标跟按钮尺寸走，自己写了 size 仍优先 |
| 危险协议 | `safeUrl` 拦住后再决定渲染 `<a>` 还是自定义组件 | 照这个判断。不安全时渲染没有 href 的 `<a>` | 浏览器不会执行脚本，路由组件也拿不到这段地址 |
| 按钮组漫游 | `useListFocus`，边界是 group 和 popover | 同一个 composable，选择器是 `button, a[href], [tabindex]` | 一组一个 Tab 停靠点。弹出层里的方向键不挪到下一个按钮 |
| 头像首字母 | 字素加字符类，跳过标点 | `Intl.Segmenter`，没有就退回码点 | `Northwind Workbench (automation)` 得到 NA，纯标点得到空 |
| 头像组重叠 | CSS 变量负边距，写在头像上 | `--astryx-avatar-group-overlap`，组上补起始边距 | 包了提示层的头像也会重叠 |
| 引用块 | 不用 footer，空 cite 不渲染 | `<cite>` 直接放在 `blockquote` 里 | 不会多出一个 contentinfo |
| 惰性引用 | 不安全或没有网址时 `role="group"` | 照上游 | 读屏能读到这组引用的名字，但不会当成脚注链接 |
| 键盘对比度 | 前景用 text-primary | `--astryx-color-text-primary` | 浅底上的字对比度够 AA |
| 轮播主题目标 | `carousel-scroller` | 类名 `astryx-carousel-scroller` | 主题能选中滚动区。原有的 data 属性还在 |

## 3. 和计划不一样的地方

- 计划没写 eslint 注释放哪。模板里的 `<!-- eslint-disable -->` 会被 Vue 3.5 留在 DOM 里，组件变成两个根，测试拿到的不是那个组。禁用改写在 `<script>` 顶部，不进 DOM。
- 按钮按压最初照「盖住底色」写成 `background-color: transparent`。上游的按压是叠在变体底色上的图片，透明会把实心按钮洗掉。实际只换 `background-image`。
- InputGroup 边缘在计划里就标成留给 C1，没有实现。

## 4. 台账处理

一共 78 条。已采纳 36 条，不适用 42 条。

不适用：

- StyleX 或主题编译，归 B1：`ea0483449`、`ca8f5292b`、`6e6b9b476`
- 图标注册表，归 B5：`4ec1f4ea6`、`00f1ed9da`、`630cf2725`
- 层重置，归 B4、B6：`4ec26d757`
- React 合并 ref：`fac29533c`、`540f19e62`、`7a9ff42ba`
- 被后一条取代的 not-allowed 指针：`e891c0dc8`（采用的是 `8a9d85fdf` 的 default）
- 每个 Text 自己观察尺寸，没有共享观察器：`d55751f88`
- Vue 没有上游那套裸 class：`1232b85af`
- ToggleButton 归 C2：`21756e8c7`、`82eeea2a7`
- NumberInput 图标槽归 C1、B5：`191834477`
- InputGroup 边缘归 C1：`96154f56d`
- ClickableCard 的夹具归 C14：`af44c3a66`
- 复选框夹具归别的节点：`43f4f7d09`
- Chromium 无障碍夹具不移植：`5967c0764`、`60fc2f233`、`491945a49`、`6613d8125`、`9f45321e2`
- 测试基建：`b0d1e922e`
- 只改文档或规范：`1ce0b4c7f`、`41950da6a`、`9378ba5ce`、`8e9d5a946`、`6909d0d9c`、`d334c4a19`、`20bae6c46`、`5c396656f`、`a32c01136`、`b09e3fd51`、`d93c5479f`、`f613dcb64`、`5632b93db`、`5c37ada64`、`17044ab1e`、`8bf4b5136`、`cb13c1eaa`

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `timeout 180 env -u NODE_ENV pnpm vitest run --maxWorkers=2` 加上计划里的路径 | 过 | 28 个文件、301 条用例，退出码 0 |
| 2 | 同一条命令，`NODE_ENV=production` | 过 | 28 个文件、301 条用例，退出码 0 |
| 3 | `timeout 300 env -u NODE_ENV pnpm check` | 过 | 退出码 0。包含包检查、lint、类型、全量测试、构建和 publint |
| 4 | 视觉对照 | 未做 | 计划交给验收。本轮用测试锁住按压标记、首字母、漫游 tabindex、危险协议、引用角色、引用块没有 footer |

`pnpm sync` 输出「已写好生成文件」，随后 `git status` 没有生成文件的改动。改过的源码文件都在 500 行以内，最长的是 `useListFocus.ts`（434 行）。

## 6. 拿不准的地方

- 没有在浏览器里对过按下、悬停和窄行省略。验收需要看真实像素。
- 按钮组的键盘边界是 `[role="group"], [popover]`，和上游一致。现在的下拉菜单是传送出去的，所以组外的菜单不会吃到组的方向键。如果以后菜单留在按钮里面又不带 popover，边界可能要加上 `[role="menu"]`。
- `useListFocus` 的 `orientation` 从固定字符串放宽成可读的值。原来传字符串的调用方行为不变。
