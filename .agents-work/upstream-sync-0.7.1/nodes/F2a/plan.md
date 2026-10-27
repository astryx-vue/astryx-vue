# F2a charts 纯逻辑 · 执行计划

## 目标

新建 `@astryx-vue/charts` 包（private，以后只发 canary），先放进和框架无关的纯计算部分：格式化、配色、比例尺和布局、图例、提示框取值、颜色工具，以及 8 种 SVG 标记的 `resolve()`（算每个点的像素位置）。这一步用户还看不到图表组件（那是 F2b），但这些函数的输入输出要和上游 v0.7.1 一模一样，测试照上游搬。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F2a`，分支 `sync/f2a-charts`，槽位 2，端口 5172（本节点不需要浏览器）。只在这里改。
- 动手前先读：
  - `docs/adr/0001-new-packages.md` 第 3 节（尤其 3.3、3.4）、第 7.1、7.2、7.3 节。**范围以 ADR 3.4 为准。**
  - 台账：`.agents-work/upstream-sync-0.7.1/ledger/F2a.md`（11 条）。
  - 上游：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/charts/<路径>`。文件清单用 `git -C ... ls-tree -r --name-only v0.7.1 packages/charts`。
  - 我们现有的包怎么搭：`packages/cli/package.json`、`packages/cli/tsdown.config.ts`、`packages/cli/tsconfig.json`。
- 环境纪律：测试和构建命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。依赖有变化时跑 `pnpm install`，要设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`。

## 上游这条改动让用户看到或感受到了什么

纯逻辑节点，没有界面。效果体现在：同样的数据、同样的选项，交给我们的函数和交给上游的函数，算出来的结果（格式化字符串、颜色、像素坐标、图例项、提示框条目）完全一样。

| 上游 | 要有的效果 |
| --- | --- |
| `formatters.ts` | `compactNumber`、`currency`、`percent`、`shortDate`、`monthYear` 等输出和上游一致，按语言格式化 |
| `getChartColors.ts` | 从「取变量值」的函数算出类别、顺序、发散三套配色 |
| `layout.ts` | x/y 比例尺、y 轴范围、堆叠、分组，再调用各系列 `resolve()` |
| `legend.ts` `markColor.ts` `tooltip.ts` `utils.ts` | 图例项、标记颜色、提示框取值、`isBandScale`、`xPixel` |
| `marks/*.tsx` 的 resolve 部分 | bar、line、area、dot、band、candlestick、errorBar、referenceLine 的点位计算 |
| `2247368d3` `2b2113d7f` 等台账条目 | 看每条改了哪个纯逻辑函数，把行为搬过来 |

## 上游依据

- 源码：`packages/charts/src/{formatters,getChartColors,layout,legend,markColor,tooltip,utils,types,index}.ts`、`src/marks/*.tsx`（只取非渲染部分）、`packages/core/src/utils/color.ts`（170 行）。
- 测试：`src/formatters.test.ts`、`src/getChartColors.test.ts`、`src/marks/marks.test.tsx` 里不挂载组件的用例、`packages/core/src/utils/color.test.ts`。
- `package.json`：只依赖 `d3-scale`、`d3-shape`（ADR 说 `d3-array` 暂不装）。版本照上游 `packages/charts/package.json`，写进 `pnpm-workspace.yaml` 的 catalog（看仓库已有 catalog 分组的写法，挑合适的组或新加一个 `charts` 组），包里用 `catalog:` 引用。类型包 `@types/d3-scale`、`@types/d3-shape` 进 devDependencies。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| 标记对象有 `resolve()` 和 `render()`，`render` 返回 ReactNode | 本节点只做 `resolve()`。`types.ts` 里 `render` 的返回类型写成 Vue 的 `VNodeChild`（`import type { VNodeChild } from 'vue'`），F2b 再实现。`vue` 作为 peerDependency | 计算部分完全相同 |
| 标记工厂（`bar()`、`line()`）在 `.tsx` 里，同时含 resolve 和 render | 拆成 `src/marks/<name>.ts`，只导出工厂函数和 resolve 逻辑；工厂返回的对象先不带 `render`（类型上标为可选，F2b 补上）。如果拆不干净，在回报里说明 | 公开的工厂函数签名一致 |
| `getChartColors` 用 core 的 `parseHex`、`parseColor`、`formatHex`、`formatColor` | ADR 3.4：core 没有公开颜色工具，在 charts 包内放 `src/color.ts`，照上游 `core/src/utils/color.ts` 和它的测试移植 | 同样的输入同样的输出 |
| `getChartColors(theme, mode)` 依赖 `resolveThemeTokens` | 不做。只做 `getChartColorsFromResolver`（或上游等价的那个入口，接收一个取变量值的函数）。在回报里写一句没做的原因 | — |
| `formatters` 用 core i18n 的 `Locale` 类型 | 用 `string`（BCP 47 语言标签）或从 `@astryx-vue/core` 引类型，看我们 core 是否导出了合适的类型；charts 对 core 用 `peerDependencies: "workspace:^"` | 一致 |

## 任务范围

- 要改/新建：`packages/charts/`（`package.json`、`tsdown.config.ts`、`tsconfig.json`、`README.md`、`src/**`）、`pnpm-workspace.yaml`（catalog）、`pnpm-lock.yaml`（由 install 生成）、`scripts/check-package-boundaries.mjs`（见下）、台账 `ledger/F2a.md`。
- 不碰：`packages/core`、`packages/themes`（`--astryx-color-data-*` 变量已经在 `packages/themes/data.css` 里，只核对、不改；缺了就写进回报）、`apps/docs`、`release.yml`、`.changeset/config.json`（charts 不进 fixed 组）。
- 不做：任何 Vue 组件、任何 `render()`、4 个 WebGL 标记（`dotGL`、`dotGLInteractive`、`heatmapGL`、`streamGL`）和 `webgl.ts`、`useChartColors`（它读当前主题，归 F2b）。
- 公开导出：`src/index.ts` 只导出本节点做好的东西，结构照上游 `index.ts`，没做的项先不导出（不要导出空壳）。

## 开发步骤

1. 包骨架：`packages/charts/package.json`
   - `"name": "@astryx-vue/charts"`、`"private": true`、`"astryxVue": { "canaryOnly": true }`、`"type": "module"`、`"sideEffects": ["**/*.css"]`、`exports` 的 `.` 指向 `dist/index.js` 和 `dist/index.d.ts`。版本号先写 `0.0.0`。
   - `tsdown.config.ts` 照 cli 写，`platform: 'neutral'`，`dts: true`，d3 和 vue 不打进包。
   - `tsconfig.json` 照 cli 写。`README.md` 写两三句：是什么、只发 canary、现在只有纯逻辑。
   - `pnpm install` 后 `env -u NODE_ENV pnpm --filter @astryx-vue/charts build` 能出 dist。提交。
2. `src/color.ts` + `color.test.ts`（照上游 core 的 `utils/color.ts`）。提交。
3. `src/formatters.ts` + 测试。提交。
4. `src/types.ts`、`src/utils.ts`、`src/markColor.ts`、`src/legend.ts`、`src/tooltip.ts`。提交。
5. `src/getChartColors.ts` + 测试。提交。
6. `src/layout.ts`、`src/marks/*.ts`（8 种 SVG 标记的工厂和 resolve）、`src/marks/index.ts`，加 `marks.test.ts`（从上游 `marks.test.tsx` 里搬不挂载组件的用例）。提交。
7. `src/index.ts`。提交。
8. `scripts/check-package-boundaries.mjs`：现在公开包名单写死了 core、themes、cli。charts 是 private，检查脚本对 private 包的规则看一下会不会误报；如果需要，改成从 `scripts/list-public-packages.mjs` 拿名单（ADR 7.3 建议）。跑 `node scripts/check-package-boundaries.mjs` 通过。提交。
9. 台账 11 条都写结论。属于组件、文档、测试工程划分的，标「不适用：归 F2b/F2c」或给理由。提交。

每个源文件不超过 500 行。`layout.ts` 上游 372 行，搬过来如果超过就按职责拆（比如比例尺一个文件、堆叠一个文件）。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/charts`，全部通过。
2. `NODE_ENV=production` 同一命令，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/charts build` 成功，`dist/index.d.ts` 存在。
4. `env -u NODE_ENV pnpm typecheck`（根上的，看它是否覆盖新包；不覆盖就在包里加 `typecheck` 脚本 `vue-tsc --noEmit -p tsconfig.json` 或 `tsc --noEmit` 并跑通）。
5. `env -u NODE_ENV pnpm exec eslint --max-warnings 0 packages/charts`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/check-package-boundaries.mjs`、`node scripts/sync-exports.mjs --check`、`env -u NODE_ENV pnpm --filter @astryx-vue/cli generate:check` 都通过。
6. `env -u NODE_ENV pnpm lint:pkg`（如果它会扫到 charts 并报 private 包相关的错，看是否本来就该跳过；`list-public-packages.mjs` 会跳过 private 包）。
7. 核对 `packages/themes/data.css` 里 `--astryx-color-data-*` 的名字和上游 `getChartColors.ts` 读的变量名一一对上，在回报里列出对照。

## 提交与回报

- 分步提交，提交信息用中文。不要推送。不要改 `ROADMAP.md`。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/F2a/impl-1.md`，格式见 `templates/impl-report.md`。额外写明：上游测试搬了哪些、没搬哪些、为什么；给 F2b 的交接（render 怎么接、哪些类型留了口子）。
- 最终回复用中文，300 字以内。
