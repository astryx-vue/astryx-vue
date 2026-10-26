# D2 其余 6 套主题适配 · 执行计划

## 目标

Butter、Chocolate、Gothic、Matcha、Stone、Y2K 这 6 套主题，每个颜色、字号规则、组件覆盖都和上游 v0.7.1 的 `packages/themes/<名>/src/<名>Theme.ts` 一致。切到任意一套主题、任意浅深模式，组件都和原版长得一样，没有样式缺失。

D1 已经用同样的方法把 Neutral 做完了（PR #165），**照它的做法来**。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D2`，分支 `sync/d2-themes`，槽位 1，端口 5171。只在这里改。
- 动手前先读：
  - D1 的计划和回报：`.agents-work/upstream-sync-0.7.1/nodes/D1/plan.md`、`impl-1.md`。看它怎么写解析脚本、怎么比对、上游写法分别落到我们哪种写法：`localTokens` → `local-tokens.css`；`adaptations` → 单独的 `mobile-type.css`；组件覆盖 → 组件变量，或 `astryx.overrides` 层里按元素重指变量。
  - D1 的合入提交：`git show 7687b15 --stat`，再挑几个文件看 diff，特别是 `packages/themes/neutral/banner.css`、`button.css`、`local-tokens.css`、`mobile-type.css`，以及 `packages/core/styles/heading.css`（D1 补了按级别读行高和字重）。
  - 台账：`.agents-work/upstream-sync-0.7.1/ledger/D2.md`（15 条）。
  - 上游：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/themes/<名>/src/<名>Theme.ts`，以及同目录下的色板或配置文件（`git -C ... ls-tree -r --name-only v0.7.1 packages/themes/<名>`）。6 个主题文件共约 3500 行，butter 最大（973 行）。
  - 上游这一段对 6 套主题的全部改动：`git -C ../astryx-upstream log --oneline 96f9917f..v0.7.1 -- packages/themes/{butter,chocolate,gothic,matcha,stone,y2k}`（41 个提交）。
- 环境纪律：测试和构建命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。
- 浏览器：只能用 `node scripts/swarm/browser-lock.mjs run --purpose D2 --max-run 120 -- <命令>`，同一时刻只开 1 个。Playwright 脚本放在工作区内的 `.tmp-d2/`（用完删掉，不提交；放 /tmp 会找不到 playwright 包）。文档站 5171 端口，用完关掉。

## 要做的事

1. **写一个通用的比对脚本**（放 `.tmp-d2/`，不提交）。输入主题名，输出上游每个 token、每条组件覆盖的浅色值和深色值，和我们 `packages/themes/<名>/*.css` 里的值逐个对比，标出不一致的。D1 回报里讲了它的脚本思路，可以参考。先对 6 套主题各跑一次，把「改之前有多少处不一致」写进回报。
2. **逐套主题改**，一套主题提交一次：`base.css` 里的语义色、分类色、字号、圆角、阴影、动效；`local-tokens.css`（上游有 `localTokens` 才建）；移动端字号规则（上游有 `adaptations` 才建）；组件覆盖。改完再跑一遍比对脚本，目标是 0 处不一致。
3. **台账里这几条要专门确认**：
   - `83209502d`：butter、chocolate、gothic、stone 的 `--radius-none` 必须是 `0`。
   - `78982073e`：stone 的次要文字对比度提高。
   - `a84a895f7`：stone、y2k、gothic 的代码块 diff 行颜色。
   - `fe8cad01c`：次要样式的选择器触发器（Selector `variant="secondary"`）要和这套主题的次要按钮长得一样。
   - `6ecd41722`：matcha、y2k 的间距是 rem，B1 已经做了，这里只复核。
   - `87070314f`：语法高亮里标点的颜色。
   - `8527f921e`：触屏窄屏字号规则，每套主题按上游各自的 `adaptations` 写。
4. **测试**：参照 D1 新增的 neutral 色板测试（在 `packages/themes/` 下），给 6 套主题各写几条关键值断言：accent、text-primary、text-secondary、border、success、error，浅深各一个。期望值来自上游文件，不是来自我们改完的 CSS。最好写成一个按主题循环的测试文件（DRY）。
5. **台账 15 条**全部 `- [x]` 并写结论。新增 theme target 的那几条（Banner description、Stepper label、Slider control 等）：组件那边如果已经有对应挂点（C 阶段做过），写「已采纳：挂点在 <文件>」；主题要给这些挂点写值的，就写上。

## 不碰

- `packages/core` 的组件。如果发现某个组件没读主题写的变量，值写对了却显示不出来（D1 就遇到了 Heading），**先写进回报**。只有改动很小（几行 CSS，让组件读一个现成的变量）时才直接改，并在回报里单列。
- Neutral 主题（D1 已完成）。
- `ROADMAP.md`、`SWARM.md`。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/themes`，两种 `NODE_ENV` 下都通过，用例数相同。
2. `node scripts/check-no-important.mjs`、`node scripts/check-line-limit.mjs`、`node scripts/sync-exports.mjs --check`、`env -u NODE_ENV pnpm --filter @astryx-vue/cli generate:check` 都通过。
3. 比对脚本对 6 套主题的最终结果（每套多少个值、多少个一致），贴进回报。
4. 浏览器：`env -u NODE_ENV pnpm build:packages` 后起文档站，打开主题页 `/themes/<名>`（6 页），每页读 3 个变量的计算值，和比对表对上。截 stone 和 gothic 两页的整页图，放 `/tmp/D2-shots/`。

## 回报

- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D2/impl-1.md`，格式见 `templates/impl-report.md`。额外写两节：「和上游值不一致的地方」「组件没读主题变量的地方」。
- 分步提交，提交信息用中文，不要推送。最终回复用中文，300 字以内。
