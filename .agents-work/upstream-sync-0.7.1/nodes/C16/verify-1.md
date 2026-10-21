# C16 验收报告 · 第 1 轮

结论：通过（15/15）

- 工作区：`/workspace`，分支 `sync/c16-display-actions`，被验代码提交 `f932db1`。
- 比较基点：`BASE = 1419a29`（本分支从这里切出。本地没有 `swarm-tree` 分支，`git merge-base` 对不上远程名，用分支第一笔提交的父提交）。
- 临时文件和截图：`/tmp/verify-C16/`。对照图在 `nodes/C16/evidence/1/`。这个目录被 `.gitignore` 忽略，6 张左右对照是用 `git add -f` 放进分支的。同一份也在 `/opt/cursor/artifacts/c16-evidence/`。没有用实现者留下的产物。
- 只读检查：开始时 `git status` 是干净的。结束时只多了本轮验收文件（`verify.md`、`verify-1.md`、`evidence/1/` 下 6 张图），提交后工作区应再次干净。没有改业务源码。
- 临时改动：无。
- 浏览器：文档站 `http://localhost:5172`，`NODE_ENV=development`。上游直连，不用代理（本机 `127.0.0.1:7890` 连不上，直连 `https://astryx.atmeta.com` 返回 200）。每条 `timeout 170 pnpm visual`，一次一个组件、一种组合。测完端口已关。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 触屏按压 | 过 | Button、Link、Token、Thumbnail 打开按钮、可点 AvatarGroupOverflow 都调用 `usePressFeedback`。粗指针的 `:active` 包在 `@media not all and (pointer: coarse)` 里（`button.css`、`thumbnail.css`、`pressable.css`）。按压规则和悬停同一权重、写在后面，Button 只换 `background-image`。禁用按钮选择器排除了 `:disabled` 和 `aria-disabled`；Link、Token 禁用时不挂按压层。`Button.test.ts` 断言 `data-astryx-pressable`，`Link.test.ts` 断言 `astryx-pressable` 类。两种 `NODE_ENV` 下 28 文件 / 301 条都过。 |
| 2 | 危险协议不进 href | 过 | `safeUrl.ts` 拦下 `javascript:`、`vbscript:`、`data:text/html`（含冒号后空白和控制字符）。`safeUrl.test.ts` 覆盖这些情况。Button、Link、Citation 的测试确认 `javascript:alert(1)` 没有 `href`，也不变成可点链接。Token、Avatar 导航前同样走 `isSafeUrl`，不安全时不把地址交给自定义链接组件。 |
| 3 | 带标签按钮能缩小 | 过 | `.astryx-button` 有 `min-width: 0`、`max-width: 100%`，标签 `text-overflow: ellipsis`。`[data-icon-only='true']` 是 `flex-shrink: 0`、`max-width: none`。见 `button.css`。 |
| 4 | 图标跟着按钮尺寸 | 过 | `Button.vue` 里 `provideIconSize`：大按钮是 `md`（1.25rem，20px），小和中是 `sm`（1rem，16px）。`button.css` 的图标槽同样是 16px / 大按钮 20px。`Button.test.ts` 断言没写尺寸的图标 `data-size="sm"`。图标自己的 `size` 在 `Icon.vue` 里优先于继承值。 |
| 5 | ButtonGroup 只有一个 Tab 停靠点 | 过 | `ButtonGroup.vue` 使用 `useListFocus({ hasRovingTabIndex: true })`，边界是 `[role="group"], [popover]`。`ButtonGroup.test.ts`：第一项 `tabindex="0"`、第二项 `-1`；方向键跳过禁用并绕回；焦点在行内 `popover` 里时右方向键不把焦点拽走。 |
| 6 | 首字母跳过标点 | 过 | `getInitials` 按字素取字母、数字、表情。`Avatar.test.ts`：`Northwind Workbench (automation)` 是 `NA`，`- Alice` 是 `A`，`A1 9` 是 `A9`，`🎉 Party` 是 `🎉P`。纯标点没有可用字符，源码返回空字符串，改画默认图标。 |
| 7 | 头像叠在一起 | 过 | 重叠边距写在 `.astryx-avatar--group-item` 上，组上用正的 `padding-inline-start` 补回第一张。提示层触发器是 `display: contents`，包一层仍然叠。溢出为负时测试得到 `+0`。溢出标记带 `data-size`、`data-shape`。对照图里能看到圆头像互相叠着，溢出是 `+5`。 |
| 8 | Blockquote 没有 footer | 过 | `Blockquote.test.ts`：有出处、空出处都找不到 `footer`；空字符串出处不渲染 `cite`。`blockquote.css` 有 `overflow-wrap: break-word`。 |
| 9 | Citation 没有安全网址时是组 | 过 | 没有网址，以及 `javascript:alert(1)`，都是 `span` 且 `role="group"`，没有 `<a>`。有 `https` 地址时是 `role="doc-noteref"` 的链接。见 `Citation.test.ts`。 |
| 10 | Kbd 用主文字色 | 过 | `kbd.css` 前景是 `var(--astryx-kbd-foreground, var(--astryx-color-text-primary, #171717))`，不再是次要文字色。`Kbd.test.ts` 里 `esc` 对应 Escape，`return` 对应 Enter。 |
| 11 | 没有 `!important` | 过 | `timeout 60 node scripts/check-no-important.mjs` 退出码 0。本节点改过的样式和组件里搜不到 `!important`。 |
| 12 | 台账已勾 | 过 | `ledger/C16.md` 78 条都是 `- [x]`，78 条都有结论。抽查已采纳：按压（`33a14a205`）、漫游 tabindex（`917cc106f`）、首字母（`7ada42ea8`）、键帽颜色（`8b0879da2`），都能在代码或测试里对上。`96154f56d` 标成不适用，理由是 InputGroup 贴边归 C1。按本轮约定，这不算失败。 |
| 13 | 相关测试和范围 | 过 | `env -u NODE_ENV` 与 `NODE_ENV=production` 都是 28 个文件、301 条，退出码 0。`git diff 1419a29...HEAD --stat` 只有计划里的组件、样式和测试。`node scripts/check-line-limit.mjs` 通过。改过的源码最长是 `useListFocus.ts`（434 行），没有超过 500 行。新增注释里没有「原来 / 改成 / 之前」这类修改历史。 |
| 14 | 浏览器短跑 | 过 | 文档站和上游都打开了，不是白屏。详见下面的看图。 |
| 15 | 对照截图 | 过 | 6 张左右对照，四种组合都有，三个组件都有。路径见下表。 |

## 看图

左是原版 Astryx，右是 astryx-vue。像素差来自文档预览装的例子不一样，以及窄屏舞台高度不一样。按钮的胶囊形、主色黑底白字、次色灰底、危险色粉红，深色下主按钮反成白底，两边一致。头像是重叠的圆，不是散开的。

| 图 | 看到的内容 |
| --- | --- |
| `nodes/C16/evidence/1/button-desktop-light.png` | 桌面浅色，912×513。左：Primary / Secondary / Ghost / Destructive。右：Save / Cancel / Delete，没有 Ghost。底色都是浅灰。内容区像素差 61.54%，整图 1.52%，差在文案和少一颗 Ghost，不在按钮形态。 |
| `nodes/C16/evidence/1/button-desktop-dark.png` | 桌面深色，912×513。两边都是深底。主按钮白底黑字，次按钮深灰，危险按钮暗赤。内容区差 65.01%，整图 1.61%，同样是例子不同。 |
| `nodes/C16/evidence/1/button-mobile-light.png` | 390px 浅色。左舞台 684×320，Destructive 被卡片右缘切掉。右舞台 708×640，三颗按钮完整落在中间。整图差 56.95%，主要是舞台高度。浅色正确。 |
| `nodes/C16/evidence/1/button-mobile-dark.png` | 390px 深色。左同样把 Destructive 切掉，右三颗完整。深色正确。整图差 59.2%，原因同上。 |
| `nodes/C16/evidence/1/button-group-desktop-light.png` | 桌面浅色按钮组。左是带图标的 Copy / Cut / Paste，旁边另有一颗黑色 Save。右是连在一起的 Copy / Cut / Paste，中间有分隔线，没有图标、也没有 Save。组的连体和分隔是齐的。内容区差 27.02%，整图 0.65%。 |
| `nodes/C16/evidence/1/avatar-group-desktop-light.png` | 桌面浅色头像组。左有两行（Team members、With overflow +2）。右一行：AT、BL、CD、NT 叠在一起，末尾 `+5`。圆和重叠方式一致。内容区差 3.32%，整图 0.29%。 |

## 对实现者偏离计划的判断

- eslint 禁用写在 `<script>` 顶部，不写在模板里：合理。模板注释会进 DOM，测试会拿错根节点。
- 按压只换 `background-image`，不把底色设成透明：合理。实心按钮的变体色还在，按压色叠在上面。
- InputGroup 贴边留给 C1：合理。台账写明了，用户也规定这不算本节点失败。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

- Token、Thumbnail 打开按钮、AvatarGroupOverflow 的按压标记，源码里有，测试没有单独断言。下次可以各补一条 `data-astryx-pressable`。
- 文档预览和上游不是同一套例子。Button 预览没有 Ghost，ButtonGroup 预览没有图标和分裂按钮，AvatarGroup 只有一行。像素差主要来自这里。
- 按钮图标槽上原有的 `max-width: 100%` 会把显式写得更大的图标限制在槽位里。没写尺寸的图标已经是 16px / 20px，和这条验收要求一致。
