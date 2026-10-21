# B1 验收报告 · 第 2 轮

结论：**不通过（28/29，第 20 项不过）**。第 17 项按总控修订，用 17b 验。

不过的原因只有一条：文档里教用户覆盖适配 token 的那句话，对「class」这条路写得不准。用户只写一个或两个 class 放在 `@layer astryx.overrides` 里，实测覆盖不了。其余 28 项都过，包括第 18 项（上轮不过的 MediaTheme auto）和第 23 到 29 项（去掉 `!important`）。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B1`，分支 `sync/b1-theme`，提交 `82f5c30`。
- 第 2 轮新增的 6 个提交（`git log` 最上面 6 个）：`426a22e`（auto 重测）、`86e2156`（派生变量表）、`3d9c069`（文档）、`7c866dc`（台账）、`d53a07b`（lint 与 catalog）、`82f5c30`（去掉 `!important`）。第 1 轮最后一个提交是 `898f1b0`。
- `BASE = 49da91d9ec92b1b0c859314eec73e85cdab59982`（`git merge-base HEAD swarm-tree`）。
- 开始和结束时 `git status --short` 都是空，两次一致（`/tmp/verify-B1-r2/status-start.txt`、`status-end.txt`）。
- 临时文件放在 `/tmp/verify-B1-r2/`。测试页面（`vt*.md`）只放在 `/tmp` 下的临时 worktree 里，三个临时 worktree 已 `git worktree remove` 并 prune。
- 浏览器：只通过 `pnpm visual ... --out /tmp/verify-B1-r2/...` 或 `browser-lock.mjs run --purpose B1-verify-r2` 开启，同一时刻只开 1 个；文档站只用 5171 端口。结束后 5171 没有监听，我持有的锁已释放。`browser-lock status` 里还占着的是 B2，不是我。
- 上游官网偶尔超时，缺的组合已用 `--combos` 重跑补齐，最后 24 个组合齐全。
- 环境：B1 工作区的依赖这次是全的。临时 worktree 里的文档站要先 `pnpm --filter @astryx-vue/core build`，否则 `dist/Icon/plugin.js` 缺失，起不来。这是临时 worktree 的问题，和代码无关。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 默认外观没变（重验） | 过 | Button、Card、Dialog、TextInput、Table、Badge 共 6 个组件 × 4 种组合 = 24 张 `ours.png`，BASE 在 `/tmp/verify-B1-r2/vis-base`，B1 在 `/tmp/verify-B1-r2/vis-b1`。用 pixelmatch 阈值 0 比较（`/tmp/verify-B1-r2/pxall.mjs`）：24 张全是 0 像素差，尺寸一致（912×513 和 708×640）。亲眼看过 `vis-b1/Dialog/desktop-dark/side-by-side.png`：不是空白，背景近黑、对话框是深灰面。 |
| 2 | 间距跟着根字号变（重验） | 过 | 文档站 Button 页，`html` 字号 16px → 20px。B1：padding-inline 12px → 15px，gap 8px → 10px。BASE：12px 和 8px 都不变（`shots/browse-b1.json`、`browse-base.json` 的 `buttonPage16`、`buttonPage20`）。 |
| 3 | 间距取值和上游一致 | 过（沿用第 1 轮） | `git diff HEAD~6 --name-only -- packages/themes` 为 0 个文件，第 2 轮没有碰 themes 包。 |
| 4 | 数据 token 和上游一致 | 过（沿用第 1 轮） | 同上，themes 包第 2 轮 0 个文件改动。 |
| 5 | 旧兼容层真的删了（重验） | 过 | 临时测试 `oldnames.test.ts`：`progressbar`、`textarea`、`statusdot` 旧名匹配 0 个元素，新名匹配 1 个。两种 NODE_ENV 各 5 条全过。 |
| 6 | defineTheme 新能力（重验） | 过 | 临时测试 `accent.test.ts`，用上游 v0.7.1 原文的 `expandColorScale`，逐 token 比较，一致。`item6.test.ts`：局部 token（保留名字、引用环报错、共享名报错）、环境适配（媒体查询文本逐字等于上游期望 `(width >= 768px) and (width < 1280px) and (pointer: coarse) and (prefers-contrast: more) and (prefers-reduced-motion: reduce)`）、`extends`（继承 token、局部 token、组件规则、适配规则，子主题自己的值优先）、根 token 在前适配块在后、输出里没有 `!important`。两种 NODE_ENV 各 4 条全过。外观嵌套：上游 v0.7.1 没有（第 1 轮已核对），不用验。 |
| 7 | MediaTheme `mode="auto"`（重验） | 过 | 读 `useAutoMediaMode.ts`：缓存键是 `{backdrop, mode, tokens}`，另有 `watch([mode, tokens], measure, { flush: 'post' })`。浏览器里的结果见第 18 项。深底选 `dark`、浅底选 `off`，行为和第 1 轮一致。 |
| 8 | 深色模式 | 过（沿用第 1 轮，并重看一张） | 本轮新看 `vis-b1/Dialog/desktop-dark/side-by-side.png`：右侧（我们）背景近黑，对话框面深灰，标题和正文浅色，没有残留浅色块。 |
| 9 | 反向挑刺：spacing 与 px 混算 | 过（沿用第 1 轮） | 第 2 轮 17 个文件的 `git diff --stat` 里没有任何 `.css` 文件，样式表没动。 |
| 10 | 用户自定义主题兼容（重验） | 过 | 临时测试 `docs.test.ts`：中英文 `themes/extending` 的示例，在 HEAD 和 HEAD~4 的版本都能跑通（`ok=1 errors=[]`），两种 NODE_ENV 全过。 |
| 11 | SSR（重验） | 过 | `ssr-smoke.test.ts` 在 `env -u NODE_ENV` 和 `NODE_ENV=production` 下都是 212 条全过。另写临时 node 环境测试（`ssr28.test.ts`，`window`、`document` 都不存在）：`Theme` + `MediaTheme mode="auto"` 渲染 0 个警告，输出带 `data-astryx-media="dark"`。 |
| 12 | 台账 98 条打勾并有结论 | 过 | `- [x]` 98 条、`- [ ]` 0 条。第 1 轮抽样的 6 条本轮没有改动。 |
| 13 | 「交给 Cx」清单可用 | 过 | 见第 21 项。 |
| 14 | 主题文档 | 过 | 第 2 轮没动 `themes/scale`、`themes/tokens`，沿用第 1 轮。`themes/extending` 的改动见第 20 项。 |
| 15 | 两种 NODE_ENV 全量 vitest（重验） | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`：245 文件、3360 条通过。`NODE_ENV=production`：245 文件、3360 条通过，用例数相同（`/tmp/verify-B1-r2/vitest-unset.log`、`vitest-prod.log`）。 |
| 16 | 完整 `pnpm check`（重验） | 过 | 在同提交、`pnpm install --frozen-lockfile` 过的临时 worktree 里，`env -u NODE_ENV` 依次跑 `check:packages`（含 `check-line-limit`、`check-no-important`）、`lint`、`typecheck`、`vitest run --maxWorkers=2`、`build`（packages + docs）、`lint:pkg`。退出码全是 0（`/tmp/verify-B1-r2/check.log`）。 |
| 17b | 范围、行数、matcha 与 y2k（重验） | 过 | 行数：`check-line-limit` 通过；`Theme` 目录里最大的文件是 `adaptations.ts` 291 行。越界：第 2 轮的 17 个改动文件全在 `packages/core/src/Theme`、`apps/docs/docs/{zh,en}/themes/extending.md`、`catalog.json`、台账里，没有改组件的 theme target 接入、Neutral 调色板，themes 包 0 个文件。取值和上游一致沿用第 1 轮（themes 包第 2 轮没改）。渲染：BASE 和 B1 各起文档站，matcha 和 y2k 渲染 Button 和 Card，截图 16px 下两边只有 43 个通道不同（pixelmatch 15 个像素），位置 x 40–47、y 337–344，在 MediaTheme 深色条里那个 "x" 字，Button 和 Card 区域 0 差异。这和第 1 轮同一处、同一原因。matcha、y2k 的 spacing 在两边读回一致（`--astryx-spacing-4` 都是 `1.5rem`）。 |
| 18 | MediaTheme auto 跟着颜色模式重新测量 | 过 | 见下面的「第 18 项」。 |
| 19 | 派生变量表补齐 | 过 | 见下面的「第 19 项」。 |
| 20 | 文档补了一句说明（中英文） | **不过** | 中英文 `themes/extending.md` 都有这句。但这句话不准，见风险点 (3)。 |
| 21 | `d30591054` 写到具体 C 节点 | 过 | 台账该条现在写「交给 C16、C13、C15」：C16 管 `Heading.type` 合格、`Icon.size` 不合格；C13 管 `Pagination.variant`；C15 管 `Banner.container`。对照上游 `d30591054` 的 diff（`git show d30591054 -- docs`）：`Heading.type` 合格、`Icon.size` 不合格、`Pagination.variant` 与 `Banner.container` 是要关的敞口轴，一致。 |
| 22 | 第 1 轮通过项重验 | 过 | 1、6、7、11、15、16、17b 全部重验，见上。2、5、10 也重验了。没碰到的 3、4、9、14 沿用第 1 轮，证据是 `git diff HEAD~6 --stat`：17 个文件，没有 css，没有 themes 包。 |
| 23 | 没有 `!important` | 过 | `node scripts/check-no-important.mjs` 退出码 0。`grep -rn '!important' packages/core packages/themes`（含已构建的 `dist/`，排除 `node_modules`）：0 行，测试文件也是 0。 |
| 24 | `Theme.vue` 不再写 token 到 `:style` | 过 | 读 `Theme.vue`：`rootStyle` 只剩 `colorScheme`，用户的 `attrs.style` 排在最后。临时测试 `unit24.test.ts`：根元素 style 是 `color-scheme: light; color: red; --astryx-spacing-3: 99px; --user-x: 1;`，里面没有 `--astryx-color-accent`、`--brand-ink`；样式表文本里有 `--astryx-color-accent: #123456`。浏览器读回：`.pa`、`.no`、`.padwrap` 的 `style` 属性都只有 `color-scheme: light dark;`。用户给的内联值在窄屏（适配条件成立）下也保持 99px。两种 NODE_ENV 全过。 |
| 25 | 适配规则仍然生效 | 过 | Chromium，主题 `adapt`（`--astryx-spacing-3` 根值 12px，`width < md` 时写 6px）。视口 1000：12px；视口 600：6px，该 token 的 padding-inline 读回 6px。再测 `pointer: coarse`：触屏上下文里 `matchMedia('(pointer: coarse)').matches` 为 true，`coarse` 主题读回 6px；同一主题在非触屏的 1000 宽视口里是 12px。适配规则按层叠顺序盖过根 token，没有 `!important`。 |
| 26 | 用户能覆盖 | 过 | 不分层的普通规则可以，分层的有条件。见风险点 (3)。 |
| 27 | 多个 Theme 互不干扰 | 过 | 并列：`par-a`（11px）和 `par-b`（22px）读回 11px、22px，padding 跟着是 11px、22px。嵌套：外层 10px、内层 30px，外层内部在内层之后的元素仍是 10px；外层的组件规则（按钮圆角 0px）没有漏进内层，内层按钮读回 10px。同名：见风险点 (1)。`<html>` 上 `--astryx-spacing-3` 是 `0.75rem`（neutral 的 `:root` 值），主题 token 没有漏到 `<html>`。 |
| 28 | SSR 没有闪动 | 过 | `renderToString` 输出（`ssr28.test.ts`，没有 `window` 和 `document`）：根元素是 `<div class="astryx-theme" data-astryx-theme="ssr" data-astryx-color-mode="dark" style="color-scheme:dark;--astryx-spacing-3:99px;">`，里面第一个子节点就是 `<style data-astryx-theme-style>`，其中有 `:scope.astryx-theme {` 和 `--astryx-color-accent: #123456;`、`--brand-ink: #abcdef;`；适配块的 `@media (pointer: coarse)` 排在根块之后；全文没有 `!important`；根元素的 style 里没有任何 `--astryx-color-accent`、`--brand-ink`，只有 `color-scheme` 和用户传入的值。0 个警告。两种 NODE_ENV 全过。 |
| 29 | 默认外观不变 | 过 | 同第 1 项：Button、Dialog、Card 共 12 个组合，0 像素差。 |

### 第 18 项

浏览器：用 `browse2.mjs` 的同一个页面 `vt2.md`，深底 `rgb(10,19,23)` 和浅底 `rgb(250,250,250)` 各包一个 `<MediaTheme mode="auto">`。输出格式是 `{m-dark, m-light, colorScheme}`，`off` 表示没有 `data-astryx-media`。

| 步骤 | m-dark | m-light | colorScheme |
| --- | --- | --- | --- |
| A：浅色挂载 | dark | off | light |
| A：切到深色 | off | light | dark |
| A：再切回浅色 | dark | off | light |
| B：深色挂载（`?dark`） | off | light | dark |
| B：切到浅色 | dark | off | light |
| B：再切回深色 | off | light | dark |

- 切换后的结果，和「直接在那个模式下挂载」的结果逐项相同。
- 单元测试：`MediaTheme.test.ts` 的「re-measures an auto surface when the theme color mode switches」在两种 NODE_ENV 下都通过（245 文件、3360 条里）。
- 反向检查，在临时 worktree 里改 `useAutoMediaMode.ts`，做完已还原，`git status` 为空：
  - 只去掉缓存键里的 `mode`：测试失败（`expected 'dark' to be undefined`）。
  - 去掉 `mode` 和 `tokens`：测试失败。
  - 两样都去掉，并且去掉 `watch([mode, tokens])`：测试失败。
  - 缓存键保持原样，只去掉 `watch`：**测试仍然通过**。意思是这条单元测试没有单独守住 `watch`，因为 `MediaTheme` 重渲染时 `onUpdated` 也会测。真实页面里的切换结果由上面的浏览器表格证明，这不影响本项的结论。

### 第 19 项

- `defineTheme({ components: { dialog: { base: { padding: '24px' } } } })` 生成的 CSS：`.astryx-dialog { --astryx-dialog-padding: 24px; }`，没有直接写 `padding`（临时测试 `dv.test.ts`，两种 NODE_ENV 过）。
- 其余 5 个也确认：`bottom-sheet.padding` → `--astryx-bottom-sheet-padding: 18px`；`chat.borderRadius` → `--_chat-composer-radius`；`chat.padding` → `--_chat-composer-padding`；`progress-bar-mark.width` → `--_progressbar-mark-width`；`.height` → `--_progressbar-mark-height`。chat 和 progress-bar-mark 同时也写了原属性（见风险点 (4)）。
- 浏览器，行内 Dialog，主题 `padtheme` 写 `dialog.padding = 24px`：`--astryx-dialog-padding` 读回 24px，`.astryx-dialog__inner` 的 `padding` 是 24px；内容区到对话框边框的距离 左 24、上 24、右 24，没有多出一圈。
- 模态 `<dialog>`（`open: true`）同样读回 24、24、24。
- 对照：不设 padding 的主题是 16、16、16。

## 风险点逐一判断

### (1) 同名主题共用一份 CSS

- 上游：`git show v0.7.1:packages/core/src/theme/Theme.tsx` 里 `useThemeStyleInjection` 有一个模块级 `const injectedThemes = new Set<string>()`，键是 `` `astryx-theme-${theme.name}` ``，第二个及以后的同名 `Theme` 直接 `return`，连生成 CSS 都不做。所以上游确实按名字去重，先到的那份生效。这一点和实现者的说法一致。
- 我们这边：实现者回报写「每个 `Theme` 各渲染一份，内容相同」。实测（临时页面 `vt8.md`，两个 `Theme` 都叫 `dup`，一个 `--spacing-3` 是 11px，一个是 22px）：两个都读回 **22px**。也就是我们没有去重，两份样式表都在，作用域选择器相同，所以**后出现的那份赢，应用到所有同名 Theme**。上游是先到的赢。
- 嵌套三层同名、值相同的情形（17px）三层读回都是 17px，正常。
- 判断：同名同值时和上游效果一样；同名不同值时两边都不支持，只是「谁赢」不同（我们后到的赢，上游先到的赢）。这不是第 2 轮计划要求的项，也没有写进文档，我不判不过。建议在 `themes/extending` 里加一句「主题名要唯一」。

### (2) `resolveBackdrop` 放宽「没有背景图」

- 现在的判断是 `image !== 'none' && image !== 'initial' && image !== ''` 才算有背景图。
- 在 Chromium 里实测 `getComputedStyle(el).backgroundImage`（`/tmp/verify-B1-r2/r2.mjs`，`bgImage values`）：已挂载的元素，不设、`initial`、`unset`、`inherit`、`var(--不存在)`、`none`、`display: none`、`display: contents`、隐藏 iframe 里的元素，读到的**全是 `none`**；渐变读到 `linear-gradient(...)`，`url(...)` 读到 `url("...")`，仍然被当作有背景图。浏览器不会把计算值读成 `initial`。
- 唯一会读到空字符串的是**没挂到文档里的元素**（`detached`，背景图和背景色都是 `''`）。这种情况下旧代码因为 `'' !== 'none'` 直接返回 `null`；新代码继续往下，`backgroundColor` 也是 `''`，`parseColor('')` 为 `null`，最后同样返回 `null`。结果一样。
- 判断：在真实浏览器里不会改变行为。风险只在 Safari、Firefox 上我没有实测（只测了 Chromium），但标准规定计算值不会序列化成 `initial`。可以接受。

### (3) token 选择器权重和用户覆盖

选择器是 `:scope.astryx-theme`，权重是两个类。主题的样式表是 `<style>`，由 `Theme` 渲染在 body 里，所以位置在 `<head>` 里的用户样式表后面。

我用 Chromium 实测（`r2.mjs`，一个主题的 `--astryx-spacing-3` 根值 12px，`width < md` 时适配成 6px；视口 1000 宽 / 600 窄；读回 `--astryx-spacing-3`）：

| 用户写法（作用在 Theme 外层元素上） | 宽 1000（条件不成立） | 窄 600（条件成立） | 结论 |
| --- | --- | --- | --- |
| 不分层，1 个 class：`.k-c1 { … 41px }` | 41px | 41px | **生效** |
| 不分层，写在 `#p-c7 .k-c7`（id + class） | 47px | 47px | 生效 |
| 分层 `@layer astryx.overrides`，1 个 class：`.k-c2 { … }` | 12px | 6px | **不生效**（输给主题） |
| 分层，2 个 class：`.astryx-theme.k-c3 { … }`（权重和主题相同） | 12px | 6px | **不生效**（同权重，主题的样式表在后面，主题赢） |
| 分层，3 个 class：`.k-c4.k-c4.k-c4` | 44px | 44px | 生效 |
| 分层，id + class：`#p-c5 .k-c5` | 45px | 45px | 生效 |
| 分层，1 个 class，写在 body 里排在主题后面的 `<style>`：`.k-c6` | 12px | 6px | 不生效（权重低） |
| 分层，3 个 class，写在 body 里排在后面的 `<style>`：`.k-c6b.k-c6b.k-c6b` | 48px | 48px | 生效 |
| 另一个具名的 `@layer user`（声明在后，层序更高），1 个 class | 52px | 52px | 生效（层序高于 `astryx.overrides`） |
| 写在 Theme 的**父元素**上（不是 Theme 自己） | 12px | 6px | 不生效（Theme 自己有声明，不继承父元素的值）。这是原本的行为，同上游 |
| 用户给 `Theme` 传内联 `style="--astryx-spacing-3: 99px"` | 99px | 99px | 生效，包括窄屏 |

- 第 26 项的要求是「用一条普通样式表规则覆盖，在条件成立时也能生效」。不分层的规则做到了，包括窄屏；用户传内联值也做到了。第 1 轮这两种都失败，现在都修好了。**第 26 项判过。**
- 但是，分层里写 1 到 2 个 class 的覆盖**不会**生效，这正是文档仓库里到处教用户的写法（`guide/styling.md`、`themes/css-variables.md`、`themes/tokens.md` 都说「覆盖写在 `@layer astryx.overrides` 里」）。对 `:root` 或 Theme 里面的元素这样写没问题，但对 Theme 外层元素自己，必须 id 或至少 3 个 class，或者不分层。
- 文档（中英文 `themes/extending.md`，适配那一条）的说法是：「用更具体的选择器（比如带上外层元素的 id 或 class），或者把这行覆盖写在没放进 `@layer` 的样式里——不分层的样式总是赢过分层里的」。
  - 不分层这一路：准确。
  - 「id」这一路：准确。
  - 「class」这一路：**不准确**。1 个 class 输，2 个 class（包括带上 `.astryx-theme`）因为权重相同、主题的样式表又在后面也输，要 3 个 class 才赢。用户照字面理解会写 `.my-wrapper { --x: … }`，在分层里不会生效。
  - 另外，这个问题在适配条件**不成立**时也存在（宽 1000 那一列，分层 1 到 2 个 class 一样输给根 token），文档把它只写在「适配」那一条下面，覆盖范围也偏窄。
- 因此第 20 项判不过。改法很小：把「id 或 class」改成「id，或者三个以上的 class」，并说明主题的 token 规则权重是两个 class；把这句话挪到「根 token 也一样」的位置，不要只挂在适配下面。这是文字修改，不需要动代码。
- 实现者说如果把选择器降成 `:where(:scope).astryx-theme` 会让用户更容易覆盖，但会让同层同选择器的用户规则反过来赢过适配规则。这个取舍交给总控决定，不属于验收范围。

### (4) progress-bar-mark 的 `replaces` 语义没有实现

- 上游（`derivedVarRegistry.ts` 第 83、84 行）对 `progressbar-mark` 的 width、height 带 `replaces: true`，只写变量、不写原属性。
- 我们的输出（`dv.test.ts`）：`.astryx-progress-bar-mark { width: 4px; --_progressbar-mark-width: 4px; }`，属性和变量同时写出，值相同。`progress-bar.css` 里 `.astryx-progress-bar-mark` 自己读 `width: var(--_progressbar-mark-width, 2px)`，两条声明值一样，页面上这根刻度线的尺寸不变。
- 判断：用户能看到的刻度线尺寸一样，不改结论。有两点我没有在浏览器里实测，写在这里：一是锚点 `.astryx-progress-bar-mark-anchor` 的 `margin-inline-start: calc(var(--_progressbar-mark-width, 2px) / -2)` 读的是父元素上的变量，而变量写在子元素（刻度线本身）上，所以锚点那一处可能一直用默认的 2px，主题改了宽度后居中位置会差 `(w-2)/2`，不确定上游同结构下是否一样；二是 chat 的实际渲染（实现者也说了没验）。这两点属于 C 节点接入时的事，不判不过。

## 不通过的项要怎么改

**第 20 项：文档里关于「覆盖适配 token」的那句话不准确。**

- 位置：`apps/docs/docs/en/themes/extending.md` 的 Adaptations 一段末尾，`apps/docs/docs/zh/themes/extending.md` 适配列表的最后一条（改完后重新生成 `packages/cli/src/generated/catalog.json`）。
- 现象：文中说「用更具体的选择器，比如带上外层元素的 id 或 class」。实测在 `@layer astryx.overrides` 里写 1 个或 2 个 class 的覆盖，不论适配条件成不成立，都输给主题的 `:scope.astryx-theme`（权重两个 class，主题的 `<style>` 在 body 里排在后面）。
- 期望：写成「用 id，或者至少 3 个 class；或者把覆盖写在没放进 `@layer` 的样式里」，并写明主题的 token 规则权重是两个 class。可以把这句话也放到根 token 的介绍处。中英文都要改。
- 复现：`/tmp/verify-B1-r2/r2.mjs`（需要 B1 的文档站，页面在 `/tmp/verify-B1-r2/b1copy/apps/docs/docs/en/vt4.md`，该临时 worktree 已删除；内容就是上面表格里的各行规则）。

## 改进建议（不影响结论）

- 在主题文档里写一句「主题名要唯一」，同名不同值时后出现的 `Theme` 的值会赢（上游是先出现的赢）。
- `MediaTheme.test.ts` 的那条用例没有单独守住 `watch([mode, tokens])`（只去掉 `watch` 测试仍过）。可以补一条不经过重渲染的用例。
- 其余沿用第 1 轮的建议：`var(--astryx-spacing-N, Npx)` 的 px 回退值没有跟随根字号，让 C 节点接入时顺手统一。
