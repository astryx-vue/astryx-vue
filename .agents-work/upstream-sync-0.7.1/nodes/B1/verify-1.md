# B1 验收报告 · 第 1 轮

结论：不通过（16/17）。第 7 项不过。第 17 项按总控修订，用 17b 验。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B1`，分支 `sync/b1-theme`，提交 `a9bb2e1`（实现者的 4 个提交是 `0317e5d`、`2468a32`、`ab2e5e8`、`a9bb2e1`）。
- 比较基点：`BASE = c9646287e9bdab02873bc5b945f305d1abe6c379`（`git merge-base HEAD swarm-tree` 的结果，等于 `HEAD~4`，也是 `c964628`）。
- 临时文件和截图：`/tmp/verify-B1/`。全部自己重新生成，没有用实现者留下的产物。
- 只读检查：开始和结束时 `git status --short` 都是空，两次相同。
- 临时改动：
  - 在 BASE 和 B1 的临时 worktree 里各放过一个 `docs/en/vt*.md` 试验页。已删除，两个 worktree 也已 `git worktree remove` 并 prune。
  - B1 工作区本身没有改动。
- 浏览器：
  - 全部通过 `pnpm visual ... --out /tmp/verify-B1/...` 或 `browser-lock.mjs run --purpose B1-verify` 开启，同一时刻只开 1 个。
  - 文档站只用 5171 端口，BASE 和 B1 依次起。
  - 结束后 5171 没有监听，没有残留浏览器进程，B1 持有的锁已释放。
- 环境说明：B1 工作区的 `node_modules` 里缺 `dom-accessibility-api`。这是 rebase 后没有重新 `pnpm install`，不是代码问题。
  - 在 B1 工作区直接跑全量 vitest，会有 4 个 a11y 测试文件因导入失败。
  - 所以第 11、15、16 项在一份同提交、`pnpm install --frozen-lockfile` 过的临时 worktree 里跑。
  - 视觉对照和单点验证仍用 B1 工作区。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 默认外观没变 | 过 | Button、Card、Dialog、TextInput、Table、Badge、Banner、Tooltip 共 8 个组件 × 4 种组合 = 32 张 `ours.png`。BASE 在 `/tmp/verify-B1/vis-base`，B1 在 `/tmp/verify-B1/vis-b1`，用 pixelmatch 阈值 0 比较。32 张全部是 0 像素差，尺寸一致（912×513 和 708×640）。上游偶尔超时，缺的组合已用 `--combos` 重跑补齐。 |
| 2 | 间距跟着根字号变 | 过 | 文档站 Button 页，`html` 字号 16px → 20px。B1：padding-inline 12px → 15px，gap 8px → 10px，正好 1.25 倍。BASE：12px 和 8px 都不变。 |
| 3 | 间距取值和上游一致 | 过 | 七套主题 `base.css` 的 15 个 `--astryx-spacing-*`，与上游 `v0.7.1` 的 `spacingDefaults` 逐个对照。neutral、butter、chocolate、gothic、stone 完全一致（`0rem`、`0.125rem`…`3rem`）。matcha、y2k 用各自的档位，见 17b。 |
| 4 | 数据 token 和上游一致 | 过 | 不是抽 5 个，是全部 56 个。从上游 `dataTokens.stylex.ts` 和我们的 `packages/themes/data.css` 各提取、排序后 `diff`：名字和浅色、深色取值完全一致。七份 `base.css` 里已经没有 `color-data`（计数全是 0）。七个主题入口都有 `@import './data.css'`。 |
| 5 | 旧兼容层真的删了 | 过 | 用旧名 `progressbar`、`textarea`、`statusdot`、`hovercard`、`codeblock`、`base-table` 等 12 个写主题：生成的选择器是 `.astryx-progressbar` 这类，页面上匹配 0 个元素。用新名 `progress-bar`、`text-area`、`status-dot`：匹配 1 个元素，生效。#7302 里被删的 `codeblock-copy-button`、`codeblock-header` 同样在我们组件里 grep 为 0。驼峰、大写开头、下划线、双短横名字：`defineTheme` 报错。有一个例外：`radio` 这个旧名在我们这边仍会命中 Radio 的 label（`.astryx-radio`，7 处），实现者已在第 6 节披露，交给 C2。 |
| 6 | defineTheme 新能力 | 过 | `accent` 元组：用上游 `expandColorScale.ts`（v0.7.1 原文）和我们的 `expandColorScale` 在 4 组输入上逐 token 比较，值完全一致。局部 token：名字原样保留，引用环报错，用共享 token 名报错。环境适配：媒体查询文本与上游测试期望逐字一致，例如 `(width >= 768px) and (width < 1280px) and (pointer: coarse) and (prefers-contrast: more) and (prefers-reduced-motion: reduce)`。`extends`：token、局部 token、组件样式、onDark 和环境规则都继承，子主题自己的值优先。外观嵌套：核对见下面「对偏离的判断」(4)，上游 0.7.1 没有这项，不用验。 |
| 7 | MediaTheme `mode="auto"` | **不过** | 读实现：它会测量背景（叠合半透明层、遇背景图不可测），再比较 `on-dark`、`on-light` 和环境文字色，这部分对。浅色页面里：深色底（rgb 10,19,23）选到 `dark`，浅色底（250,250,250）选 `off`（环境文字够清楚），渐变背景图按 `fallback` 走。**问题**：`Theme` 的 `mode` 在运行时切换后，已挂载的 auto 不会重新测量。证据（`/tmp/verify-B1/browse2.mjs`）：一、挂载时是浅色，两个面板是 `dark / off`；切到 dark 后仍是 `dark / off`，而深色下环境文字变成近白，浅色底 250 上看不清，应当变化；二、挂载时是深色，两个面板是 `off / light`；切到 light 后仍是 `off / light`，而新挂载的浅色页面应是 `dark / off`。上游 `useAutoMediaMode` 的缓存键同时包含背景色和 `tokens`，颜色模式一变就重测。我们的 `lastBackdrop` 只看背景色，监听也只看父元素的 `style`、`class`，mode 变化不会触发重测，就算触发了也会被缓存键拦住。用户看到的是：深色模式开关一拨，Toast、Tooltip 这类 auto 面板的文字颜色停在旧状态。BASE 上结果一样，所以不是 B1 新引入，但 B1 的目标就是按上游重写这套测量。 |
| 8 | 深色模式 | 过 | `/tmp/verify-B1/vis-b1/Dialog/desktop-dark/side-by-side.png`：右侧（我们）背景近黑，对话框面是深灰（约 #262626），标题和正文是浅色，边框是深灰描边，没有残留浅色块。Banner 浅色图也已看过。上游两边示例内容不同，这是已有差异，与 BASE 像素差为 0。 |
| 9 | 反向挑刺：spacing 与 px 混算 | 过 | 全仓库 54 处 `calc` 里 spacing 和 px 混算，逐处看过。典型：`table.css` 里 `calc((40px - min(var(--spacing-6), 40px)) / 2 - var(--spacing-N))`、`stepper.css` 里 `calc(var(--spacing-5)/2 - 2px)`、`chat.css` 里 `calc(16px + var(--spacing-1-5))`。和上游同类公式一致（上游 `useTableRowExpansion` 用 `calc(${40}px - min(spacing-6, 40px))/2 - spacing-N`）。20px 根字号下是按同一规律增长，结果合理，没有出现负宽或错位。另外：916 处 `var(--astryx-spacing-N, Npx)` 的 px 回退值只在没引入 themes 时用，默认和 themes 下不受影响。 |
| 10 | 用户自定义主题兼容 | 过 | 中英文 `themes/extending` 的 ts 示例（含 `localTokens`、`adaptations`、`color.accent` 元组）实际跑通。中文 vue 示例的 `defineTheme` 参数单独跑通（97 个 token）。BASE 的中文示例没有 `name`，会直接报错，B1 已改对。 |
| 11 | SSR | 过 | `ssr-smoke.test.ts` 在 `env -u NODE_ENV` 和 `NODE_ENV=production` 下都是 212 条全过。另写临时 node 环境测试：没有 `window`、`document` 时渲染 `Theme` + `MediaTheme mode="auto"` + `useTheme().token()`，0 个警告，输出带 `data-astryx-media="dark"`（走 fallback）。 |
| 12 | 台账 98 条打勾并有结论 | 过 | `- [x]` 98 条、`- [ ]` 0 条，每条都有「结论：」。统计：已采纳 38、不适用 20、交给其他节点 40。抽样 6 条：已采纳 `593996134`（夹具 `upstream-color-scale.json` 和测试存在）、`fba7b4009`（`useAutoMediaMode.ts` 存在）；交给 Cx `77dd6a746`（NumberInput 主题内边距，交给 C1）、`c6a8b21ae`（Toast 滑动关闭，主题侧只改了上游注册表测试，交给 C7）；不适用 `75325ef88`（React 的 use client）、`01fa43907`（Tailwind 桥接，扩展文档写明理由）。都站得住。 |
| 13 | 「交给 Cx」清单可直接使用 | 过 | 40 条里 27 条在回报第 6 节按 C 节点分组并带哈希。其余 13 条是 D4b、F1、F3c 或 CLI 文档类，回报写了「其余交给 D4b、F 节点」。只有 `d30591054`（可扩展轴需安全回退）写的是「各 C 节点」，没有具体节点，略模糊。 |
| 14 | 主题文档 | 过 | 中英文 `themes/scale`：写清 rem、16px 下 `--spacing-2` 是 8px、20px 根字号下 `--spacing-4` 是 20px、自定义 px 保持固定。`themes/tokens`：写明 `--astryx-` 前缀是和上游唯一有意不同的地方，`defineTheme()` 两种写法都认。`themes/extending`：写了挂点命名、旧名到新名对照、`localTokens`、`adaptations`、`extends`。 |
| 15 | 两种 NODE_ENV 全量 vitest | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`：238 文件、3243 条通过。`NODE_ENV=production`：238 文件、3243 条通过，用例数相同。在 `pnpm install` 过的同提交 worktree 里跑。 |
| 16 | 完整 `pnpm check` | 过 | 依次跑 `check:packages`、`lint`、`typecheck`、`vitest run --maxWorkers=2`、`build`、`lint:pkg`，退出码全是 0。 |
| 17b | 范围和行数，含 matcha 与 y2k | 过 | 行数：`check-line-limit` 通过；新增和改动的源码文件最大是 `adaptations.ts` 291 行（`index.ts` 本来就是生成文件，只加了 12 行导出）。越界：`git diff HEAD~4 --name-only` 只有 Theme 目录、themes 包、文档、台账、生成文件和少量测试；`Button.vue` 只去掉裸类名（计划内）；Neutral 和其余主题的 `base.css` 除 spacing 与 data 外没有别的改动。matcha：`--astryx-spacing-*` 与上游 `matchaTheme.ts`（`0.1875rem`…`4.5rem`）逐档一致。y2k：0.5–8 档与上游 `y2kTheme.ts` 一致；9–12 档上游没有写，用核心默认（`2.25rem`、`2.5rem`、`2.75rem`、`3rem`），我们也是这几个值。渲染：在 BASE 和 B1 各起文档站，用 matcha、y2k 渲染 Button 和 Card，16px 下两边截图只有 15 个像素不同，全在页面底部 MediaTheme 里那个 "x" 字（x 40–47，y 337–344），Button 和 Card 区域 0 差异。 |

## 看图

| 图 | 看到的内容 |
| --- | --- |
| `/tmp/verify-B1/vis-b1/Dialog/desktop-dark/side-by-side.png` | 左上游、右我们，深色模式。两边页面背景都是近黑，对话框面是深灰，文字是浅色。我们这边的对话框内容（Share project）和上游示例（Modal Title）不同，是已有的示例差异，不是 B1 引入。没有空白、骨架或报错覆盖层。 |
| `/tmp/verify-B1/vis-b1/Banner/desktop-light/side-by-side.png` | 浅色模式。上游示例有 4 条彩色 Banner，我们只有 1 条灰色 Banner，示例内容不同。与 BASE 像素差 0。 |
| `/tmp/verify-B1/vt-b1-16.png` | matcha（浅绿底，深绿主按钮，圆角胶囊）和 y2k（淡紫底，方角深色按钮）的 Button、Card 渲染正常。下面四条是 MediaTheme 测试条：深色底、浅色底、红蓝渐变、半透明叠白。 |
| `/tmp/verify-B1/crop.png` | 6 倍放大的差异区域。左 BASE，右 B1。差异只是 MediaTheme 里的 "x" 字：BASE 是深灰，B1 是白色（那一瞬间两边的测量结果不同）。 |

## 对实现者偏离计划的判断

1. **环境适配规则写 token 时用 `!important`：合理，有边界，建议文档说明。**
   - 原因成立：我们的 `Theme` 把根 token 写成内联 `style`，样式表里的普通声明压不过内联，只能用 `!important`。
   - 实测（`/tmp/verify-B1/cascade.mjs`，Chromium，规则是 `@media (width < 640px)` 写 `--astryx-spacing-4: 12px !important`，作用在 `:scope.astryx-theme`）：
     - 视口 1000px（条件不满足）：对 Theme 外层元素，用户的普通样式规则、`:root` 规则都按原样生效。`!important` 不出现，没有副作用。
     - 视口 500px（条件满足）：同一个 Theme 外层元素上，用户写在样式表里的同名 token 全部被盖掉，包括普通声明、写在 `astryx.overrides` 层里的声明、写在未分层样式表里的 `!important`。写在 `:root` 上、给没有内联值的 Theme 外层元素继承的值也被盖掉。
     - 不受影响：Theme 内部子元素上自己写的 token（`#child` 的值保持）；用户给 Theme 的 `style` 属性写 `!important`（78px 保持）。
   - 失效场景总结：只在适配条件成立、且只对适配规则里写到的那几个 token、且只在 `Theme` 外层元素上，用户的样式表和普通内联 `style` 失效。
   - 和上游的差异：上游 Theme 的根 token 在样式表里，用户的内联 `style` 属性能压过适配规则；我们这边用户给 `Theme` 传的普通 `style` 里同名 token 会输给适配规则。这是我们有意保留的结构差异，但目前文档里没提 `!important`，用户想覆盖时会困惑。
   - 建议：在 `components/theme` 的文档里加一句说明。
2. **主题选择器同时匹配 `[data-variant]` 和 `.astryx-<target>--variant-x`：合理。** 看了 `targetSelectors`：修饰类写成 `${root}--${axis}-${value}`，root 是 `.astryx-<target>`，所以输出是 `.astryx-button.astryx-button--variant-secondary` 这样的复合选择器，不是裸类名。值里有特殊字符时只用 `data-*` 一路。`expandTheme.test.ts` 也断言了这个形态。风险只是等 C 节点补齐 `data-*` 以后，这一路要删。
3. **派生变量表只登记 5 个组件：部分不合理，理由有一处不准确。**
   - 回报说「只登记我们样式表实际读取的」，但实际有遗漏：
     - `chat.css` 读 `--_chat-composer-radius` 和 `--_chat-composer-padding`（与上游同名），表里没有 `chat`。
     - `progress-bar.css` 读 `--_progressbar-mark-width` 和 `--_progressbar-mark-height`（与上游同名），表里没有 `progress-bar-mark`。
     - `dialog.css` 的内边距读 `--astryx-dialog-padding`，`bottom-sheet.css` 读 `--astryx-bottom-sheet-padding`。上游对 `dialog`、`bottom-sheet` 的 `padding` 做容器展开，我们表里 `dialog` 只登了圆角，没有 `bottom-sheet`。实测 `dialog: { base: { padding: '24px' } }` 输出 `.astryx-dialog { padding: 24px; }`，没有展开成 `--astryx-dialog-padding`。按样式表结构，内层 `.astryx-dialog__inner` 仍会再加 1rem，内容区会比上游多一圈（此条由输出和样式表推断，没有在浏览器里实测）。
   - 其余（avatar、banner、button、field、hover-card、number-input、popover 圆角、text-area、item、section、drawer）样式表目前没读对应变量，留给 C 节点合理。
   - 建议：把 chat、progress-bar-mark、dialog 的 padding、bottom-sheet 补进表，`registry.test.ts` 会保证名字没写错。
4. **外观嵌套 token（#5963）没做：合理，已核对。**
   - `git log 96f9917f..v0.7.1` 里有 `ea0483449 feat(theme): add appearance nesting tokens (#5963)` 和 `6e6b9b476 revert(theme): restore local stacking contracts (#6031)`。
   - #6031 的改动文件（`defineTheme.ts`、`index.ts`、`tokens.stylex.ts`、`tokens.test.ts`、`scripts/check-appearance-nesting.test.mjs` 等）正好是 #5963 加入的那一批，统计里 #6031 是 85 行删除对 #5963 的 582 行增加（含其他文件）。
   - `git grep appearance v0.7.1 -- packages/core/src/theme/` 只命中 `MediaTheme.doc.mjs` 里一句无关的文案，`tokens.stylex.ts`、`defineTheme.ts` 里没有。
5. **删掉 21 个旧挂点名、Button 不再输出 `.primary`、`.sm`：合理，已在全仓库核对。**
   - 旧挂点名：在 `packages/core/src` 和 `styles` 里 `astryx-<旧名>` 全是 0（`radio` 例外，见第 5 项）。`apps/docs`（含 playground）、`packages/themes` 的 CSS 里没有旧挂点名，也没有以旧名为键的 `components` 写法。
   - Button 裸类名：`packages/core/styles`、`packages/themes`、`apps/docs` 里没有 `.astryx-button.primary`、`.secondary`、`.ghost`、`.destructive`、`.sm`、`.md`、`.lg` 这类选择器，测试里也没有按这些类名取元素。`button.css` 和 `button-group.css` 用的是 `[data-variant]`、`[data-size]`。
   - 另有 `.astryx-heading--color-secondary` 这类带前缀的修饰类仍在，是第 2 项说的修饰类，不是裸类名。
6. **`ThemeStyle` 改写原始文本、保证不出现 `</style`：合理，实测通过。**
   - 临时测试 `/tmp/verify-B1/tests/xss.test.ts`，两种 NODE_ENV 各 12 条全过。恶意值覆盖：引号里的 `</style><script>…`、不引号的、大写 `</STYLE >`、混合大小写 `</sTyLe/>`、样式键里带 `</style>`、局部 token、环境适配里的 token 和组件值、`onDark` 里的组件值、拆开写的 `<` + `/style`。
   - 结果：`theme.css` 里没有原始 `</style`（会被写成 `<\/style`）；SSR 输出用 DOM 解析后，`<style>` 恰好 1 个、`<script>` 0 个、`<p>` 内容还在，`<style>` 的文本和 `theme.css` 完全相等；`&quot;` 不再出现，`@scope … to ([data-astryx-theme])` 保留。
   - 真浏览器（`evil.mjs`）：把含 `"</style><b id=pwn>X</b>"` 的值设成 `content`，`style.innerHTML = css` 后 `#pwn` 不存在，host 里只有 1 个 STYLE，`getComputedStyle(...).content` 读回 `"</style><b id=pwn>X</b>"`（字符串字面量里 `<\/` 读作 `</`），值没有丢。
   - 提醒：`ThemeStyle` 组件本身不转义（直接传 `a{}</style><script>1</script>` 会提前闭合），安全靠 `compileThemeCss` 的出口处理。目前 `ThemeStyle` 不是公开导出，只由 `Theme` 使用，所以可以接受。

## 不通过的项要怎么改

**第 7 项：`MediaTheme mode="auto"` 在 `Theme` 的 `mode` 切换后不重新测量。**

- 现象：`Theme` 的 `mode` 在运行时切换后，已挂载的 `mode="auto"` 面板保持旧结果。
- 复现：
  - 页面里放 `<Theme :theme="neutralTheme" :mode="mode">`，里面放两个面板：一个背景 `rgb(10,19,23)`，一个背景 `rgb(250,250,250)`，各包一个 `<MediaTheme mode="auto">`。
  - `mode='light'` 挂载，结果 `dark / off`。把 `mode` 切成 `'dark'`，结果仍是 `dark / off`。
  - 反过来，`mode='dark'` 刷新后挂载，结果 `off / light`；切到 `'light'` 仍是 `off / light`。
  - 脚本 `/tmp/verify-B1/browse2.mjs`，页面 `/tmp/verify-B1/vt2.md`（已从 worktree 删除，内容在这个目录里）。
- 期望：模式一变，重新测量，结果与该模式下新挂载的结果相同（浅色下是 `dark / off`，深色下是 `off / light`）。
- 方向（实现者自定）：把当前主题的颜色模式（或 `useTheme().mode`）纳入重测的触发条件，并把它加进 `lastBackdrop` 的缓存键。补一条测试，断言切换 mode 后 `data-astryx-media` 变化。

## 改进建议（不影响结论）

- 第 3 项的遗漏（chat、progress-bar-mark、dialog 与 bottom-sheet 的 padding）建议和第 7 项一起在第 2 轮补。
- 文档里补一句：适配规则里的 token 在条件成立时会盖过 `Theme` 外层元素上的样式表和普通内联值，想覆盖要写在子元素上或用 `!important`。
- 回报里「交给 Cx」的清单，把 `d30591054` 写到具体的 C 节点。
- B1 工作区需要重新 `pnpm install`，否则 4 个 a11y 测试文件会因缺 `dom-accessibility-api` 失败。
- 916 处 `var(--astryx-spacing-N, Npx)` 的 px 回退值，在没有引入 themes 包时不跟随根字号。`dialog.css` 已用 `1rem` 回退，其他是 `px`，风格不统一。可以让 C 节点接入时顺手统一。
