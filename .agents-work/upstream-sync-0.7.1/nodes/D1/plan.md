# D1 Neutral 主题底色 · 执行计划

## 目标

Neutral 主题（`@astryx-vue/themes/neutral.css`）的每一个颜色值都和上游 v0.7.1 的 `neutralTheme.ts` 一样。用户切到浅色或深色时，背景、文字、边框、状态色、徽章、提示条、开关、分段控件、按钮、代码高亮看起来和原版一致；手机（粗指针、窄屏）上字号按上游规则放大。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D1`，分支 `sync/d1-neutral`，槽位 1，端口 5171。只在这里改。
- 动手前先读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md` 的「对齐上游的标准」「不用 `!important`」「跑检查时的环境」。
  - 台账：`.agents-work/upstream-sync-0.7.1/ledger/D1.md`（25 条）。
  - 上游主文件：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/themes/neutral/src/neutralTheme.ts`（477 行，唯一的真相来源），以及它引用的 `src/neutralPaletteRefs.generated.ts`（色板具体色值）。
  - 上游说明：`packages/themes/neutral/neutral.spec.md`、`README.md`。
  - 我们的现状：`packages/themes/neutral/base.css` 文件头注释写了两处「故意不跟上游」的值（`radius-none`、`color-text-secondary` 浅色）。
- 环境纪律：测试和构建命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。
- 浏览器：只能用 `node scripts/swarm/browser-lock.mjs run --purpose D1 --max-run 120 -- <命令>`，同一时刻只开 1 个。文档站用 5171 端口，用完关掉。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到的变化 |
| --- | --- |
| `75a4d1dee` `cde73c74d` `137708da9` `e92e36ffb` | 整套灰阶、文字、图标、边框、背景换成审定后的色板（`neutralPaletteRefs`） |
| `0ccad5b5e` | 深色模式下色板两端的彩度压低，深色里的彩色背景不再刺眼 |
| `546a2f751` `b2e6a1d6b` | 成功、警告、错误、强调这几种状态色换成审定值；危险按钮的悬停和按下用红色的半透明叠层 |
| `1abeec749` | 错误徽章上的文字对比度达到 AA |
| `87070314f` `4357d2815` | 代码高亮里的标点有自己的颜色，并达到 AA；语法主题名叫 `astryx-neutral` |
| `2083bb18a` | 提示条（Banner）几种色调在浅深模式下用对的底色和文字色 |
| `95e7bfacb` | 分段控件内边距更宽松 |
| `8527f921e` | 粗指针加窄屏（小于 lg 断点）时，正文字号基准从 14px 提到 16px，比例改成 1.1736，最大的展示字号不变 |
| `448585248` | Neutral 用 Figtree 字体，文档写明怎么加载 |

## 上游依据

- 台账 `ledger/D1.md` 全部 25 条。
- 源码：`packages/themes/neutral/src/neutralTheme.ts`（`tokens`、`localTokens`、`components`、`syntax`、`typography`、`adaptations`、`motion` 七块）、`neutralPaletteRefs.generated.ts`。
- 上游测试：`src/neutralTheme.test.ts`、`src/neutralPalettes.test.ts`（看它们断言了哪些值，改写成我们的 CSS 值断言）。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `defineTheme({ tokens: { '--color-x': [light, dark] } })` 编译出 CSS | 手写在 `packages/themes/neutral/*.css`，写成 `--astryx-color-x: light-dark(<light>, <dark>)` | 最终每个变量的浅色、深色值相同 |
| `neutralPaletteRefs` 这样的色板引用 | 直接写解析后的十六进制色值；在文件头或旁边注释里写一次「取自上游哪一档」即可，不要每行都写 | 值相同 |
| `localTokens`（`--astryx-theme-neutral-*`） | 照上游的变量名写进 `base.css`，组件级变量（`--astryx-badge-*` 等）引用它们 | 同名同值 |
| `components: { badge: { 'variant:info': {...} } }` | 写成对应组件变量（例如 `--astryx-badge-info-background`），放在 `neutral/<组件>.css`。先找出我们组件实际读哪个变量（`grep -n "var(--astryx-badge" packages/core/styles/badge.css`） | 组件画出来的颜色一样 |
| `adaptations` 的 `pointer: coarse` + 窄屏规则 | 在 `base.css` 写 `@media (pointer: coarse) and (max-width: <lg 断点减 0.02px>)`，重写字号变量。断点值去 `packages/core` 里找现成的 lg 定义，不要自己编 | 同样的设备上字号相同 |

## 任务范围

- 要改：`packages/themes/neutral/*.css`、`packages/themes/neutral.css`（只在需要新增文件时）、`packages/themes/*.test.ts` 里和 neutral 相关的断言、`apps/docs/docs/{zh,en}/themes/neutral.md`、台账 `ledger/D1.md`。
- 不碰：其余 6 套主题（属于 D2）；`packages/core` 的组件 CSS（如果发现组件没读某个上游变量、要改组件，**停下写进回报**，不要改）；`packages/cli`（`fda3f56a0` `71cf6cd06` `34b4692a3` 这类 CLI、编译器条目标「不适用」并写理由）；`ROADMAP.md`、`SWARM.md`。
- `base.css` 文件头写的两处保留值（`radius-none: 0`、`color-text-secondary` 浅色 `#525252`）：**改成跟上游一致**，D1 的验收标准是「与上游完全一致」。改完把这段注释删掉。如果改完发现某个组件明显坏了（比如方形头像变圆角），在回报里写清楚是哪个组件、为什么，并在那个组件对应的 `neutral/<组件>.css` 里用组件变量补回去，而不是保留全局值。

## 开发步骤

1. 先做一张对照表（放在 `/tmp/D1-map.md`，不提交）：上游 `tokens` 里的每一个变量 → 解析出的浅色、深色值 → 我们 `base.css` 里现在的值。写一个小脚本（`/tmp/D1-extract.mjs`）从上游两个文件解析出值，不要手抄。脚本可以用 node 直接 `import` 一个从 `git show` 导出到 `/tmp` 的 ts 文件（用 `node --experimental-strip-types`），或者用正则解析。
2. 按对照表改 `base.css`：全局语义色、文字、图标、边框、背景、状态色、分类色（`--color-background-red` 等 10 色 × 4 种）、阴影色、骨架屏色。提交一次。
3. 加 `localTokens` 那 10 个 `--astryx-theme-neutral-*` 变量。提交。
4. `components` 块：逐个组件（button、badge、banner、switch、card、section、segmented-control、segmented-control-item 等）把值写进对应 `neutral/<组件>.css`。上游组件名和我们的组件变量名不一致时，在回报里列出对应关系。提交。
5. 语法高亮：`syntax` 的 14 个角色写进 `neutral/code.css`（对照现有变量名）。提交。
6. 动效、字体、`adaptations` 的移动端字号规则，写进 `base.css`。提交。
7. 文档：`themes/neutral.md` 中英文补上 Figtree 加载方式（参考上游 `448585248` 改的 README），以及移动端字号规则一句话说明。提交。
8. 测试：在 `packages/themes/` 现有测试里（或新建 `neutral-palette.test.ts`）加断言：至少覆盖 accent、text-primary、text-secondary、border、success、error、warning、badge-error 前景、syntax punctuation 的浅深两个值，以及移动端媒体查询存在。期望值来自上游文件，不是来自我们自己改完的 CSS。
9. 台账 25 条全部 `- [x]`，下面写 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/themes`，全部通过。
2. `NODE_ENV=production` 同一命令，用例数相同。
3. `node scripts/check-no-important.mjs`、`node scripts/check-line-limit.mjs`、`node scripts/sync-exports.mjs --check`、`env -u NODE_ENV pnpm --filter @astryx-vue/cli generate:check` 都通过（catalog 若因文档改动要求重生，跑 `pnpm --filter @astryx-vue/cli generate`）。
4. `env -u NODE_ENV pnpm build:packages` 后起文档站 `pnpm --filter @astryx-vue/docs exec vitepress dev --port 5171 --host 127.0.0.1`，打开 `/themes/neutral`、`/components/badge`、`/components/banner`、`/components/button`，浅色和深色各看一眼（浅色要先 `localStorage.setItem('vitepress-theme-appearance','light')`）。截图放 `/tmp/D1-shots/`，不提交。看完关掉服务。
5. 用一个浏览器脚本读 3 到 5 个变量的计算值（例如 `getComputedStyle(document.documentElement).getPropertyValue('--astryx-color-text-secondary')`），和对照表比，结果写进回报。

## 提交与回报

- 分步提交，提交信息用中文。不要推送。不要改 `ROADMAP.md`。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D1/impl-1.md`，格式见 `templates/impl-report.md`。额外加一节「和上游值不一致的地方」：如果最后还有任何变量没跟上游，逐个列出原因。
- 最终回复用中文，300 字以内。
