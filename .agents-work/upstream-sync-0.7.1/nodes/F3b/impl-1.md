# F3b lab 展示类 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F3b`，分支 `sync/f3b-lab-display`。只在本地提交，没有推送。
- 提交（基于 `e351b14`）：
  - `a96137b` feat(lab): 新建 @astryx-vue/lab 包骨架，移植 Stat
  - `7ed57b2` feat(lab): 移植 CircularProgress
  - `8477228` feat(lab): 移植 InfoTip
  - `0c11830` feat(lab): 移植 SVGIcon
  - `8b22c74` feat(lab): 移植 LogStream
  - `f82de4e` docs(lab): F3b 台账 31 条逐条写结论

## 1. 做了什么

**步骤 1 包骨架。** 照 `packages/charts/` 抄：`package.json` 里 `private: true` + `"astryxVue": { "canaryOnly": true }`，版本 `0.0.0`，`exports` 有 `.`、`./lab.css`、`./styles/*.css`，peer 依赖 `@astryx-vue/core: workspace:^` 和 `vue: catalog:peer`；`tsdown.config.ts`、`tsconfig.json`、`src/css.d.ts` 同 charts。样式按组件一份放在 `styles/`，包根 `lab.css` 用 `@import` 汇总；每份 CSS 开头都声明层顺序，规则写在 `@layer astryx.components`；组件自己 `import '../../styles/<组件>.css'`。`src/index.ts` 按组件导出，类型跟着走。英文 README，顶部写明这是 canary 包、API 会变。

**步骤 2 Stat。** `label`、`delta`、`description`、`size` 四个 prop；`value` 既是字符串 prop，也可以用默认插槽放富内容（插槽优先）；`media` 用具名插槽。涨跌颜色跟方向走（up=positive、down=negative、flat=neutral），`delta.sentiment` 覆盖；方向还有一段只有读屏软件念的文字。根元素 `class="astryx-stat"` + `data-size`。

**步骤 3 CircularProgress。** 直径／线宽按 sm/md/lg（32/48/64，3/4/5）算，弧长用 `stroke-dashoffset`；不确定进度换成 `stroke-dasharray` / `stroke-dashoffset` 关键帧加整体旋转，`prefers-reduced-motion` 下时长翻倍。`role="progressbar"` 加 `aria-labelledby` / `aria-valuenow` / `aria-valuemin` / `aria-valuemax` / `aria-valuetext`，和上游逐字一样；非有限的 `value` / `max` 当 0 处理，不会把 `"NaN"` 漏到浅层 DOM。禁用时填充换禁用色、轨道退回中性轨道色，根元素保留原 `variant`。

**步骤 4 InfoTip。** core 的 `Tooltip` + `Icon`（`icon="info"`）组合，触发器是真按钮，`aria-label` 默认 `More information`。`touchTrigger="tap"`。`content` 字符串 prop，富内容走 `#content` 插槽。聚焦环用 `:focus-visible`。

**步骤 5 SVGIcon。** 每层按角色拆成填充组和描边组，四组 `<g>`；五个变体用 `data-variation` 上的层内变量实现，尺寸 `data-size` 带光学描边补偿，颜色 `data-color` 对应 core 的图标色。bold 变体里次层形状变成遮罩里的黑色挖洞（填充角色挖洞宽度是间隙值，描边角色是 `描边宽度 + 间隙 × 2`），次层整层不画。给了 `aria-label` / `aria-labelledby` 就 `role="img"`，否则 `aria-hidden="true"`；用户自己写的 `aria-hidden` / `role` 优先。同时移植 15 个示例图标、`roundCorners` / `addCurvature` / `adjustTension` / `applyPersonality` 四个路径变形、XIF 类型和示例。

**步骤 6 LogStream。** 四列栅格按「有没有来源 / 有没有时间」生成 `data-cols`；带 `detail` 的行变成 `aria-expanded` 的展开按钮，详情面板在行下方（文字用 `entry.detail`，富内容用 `#detail` 插槽）。跟滚抽到 `useLogFollow`：`v-model:isFollowing` 受控／非受控都可，跟随状态下直接写 `scrollTop`，滚离底部取消跟随并回报，点「跳到最新」恢复。`role="log"` 的 `aria-live` 跟着跟随状态在 `polite` / `off` 之间切。终端变体始终深色，用固定近黑灰色。整行还用 `#entry` 插槽替换默认行（对应上游 `renderEntry`）。

**步骤 7 台账。** 31 条逐条写了结论，见第 4 节。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/lab/package.json` | 68 | 包声明：private + canaryOnly、exports、peer 依赖 |
| `packages/lab/tsdown.config.ts` | 36 | 构建：unplugin-vue，vue/core/css 不打进包 |
| `packages/lab/tsconfig.json` | 17 | 类型检查配置，`customConditions: ["source"]` |
| `packages/lab/README.md` | 33 | 英文说明：canary 包、安装、5 个组件一览 |
| `packages/lab/lab.css` | 6 | 汇总全部组件样式 |
| `packages/lab/src/css.d.ts` | 4 | CSS import 的类型声明 |
| `packages/lab/src/index.ts` | 65 | 包入口，按组件导出组件与类型 |
| `packages/lab/src/Stat/Stat.vue` | 48 | Stat 模板与涨跌情绪计算 |
| `packages/lab/src/Stat/types.ts` | 58 | Stat 类型与方向→情绪、方向→读屏文字、箭头路径 |
| `packages/lab/src/Stat/index.ts` | 2 | Stat 子入口 |
| `packages/lab/src/Stat/Stat.test.ts` | 119 | Stat 用例（含 SSR） |
| `packages/lab/styles/stat.css` | 101 | Stat 样式 |
| `packages/lab/src/CircularProgress/CircularProgress.vue` | 92 | 环形几何、dashoffset、不确定动画 |
| `packages/lab/src/CircularProgress/types.ts` | 75 | 尺寸表、变体、默认格式化函数 |
| `packages/lab/src/CircularProgress/index.ts` | 7 | 子入口 |
| `packages/lab/src/CircularProgress/CircularProgress.test.ts` | 243 | 环形用例（含 SSR） |
| `packages/lab/styles/circular-progress.css` | 174 | 环、轨道、变体色、两段关键帧 |
| `packages/lab/src/InfoTip/InfoTip.vue` | 29 | Tooltip + Icon 组合，tap 打开 |
| `packages/lab/src/InfoTip/types.ts` | 24 | InfoTip 类型 |
| `packages/lab/src/InfoTip/index.ts` | 2 | 子入口 |
| `packages/lab/src/InfoTip/InfoTip.test.ts` | 171 | 触发器 a11y、悬停/焦点/Escape/轻点（含 SSR） |
| `packages/lab/styles/info-tip.css` | 39 | 圆形按钮、悬停、禁用、聚焦环 |
| `packages/lab/src/SVGIcon/SVGIcon.vue` | 106 | 角色分组、遮罩、a11y 属性 |
| `packages/lab/src/SVGIcon/types.ts` | 67 | 图形、变体、尺寸、颜色、角色类型 |
| `packages/lab/src/SVGIcon/icons.ts` | 281 | 15 个示例图标 |
| `packages/lab/src/SVGIcon/types-xif.ts` | 179 | XIF 格式类型 |
| `packages/lab/src/SVGIcon/xif-examples.ts` | 189 | 8 个 XIF 示例图标 |
| `packages/lab/src/SVGIcon/pathTransforms/parse.ts` | 275 | 路径解析、几何工具、序列化 |
| `packages/lab/src/SVGIcon/pathTransforms/transforms.ts` | 342 | 圆角、曲率、张力、人格叠加 |
| `packages/lab/src/SVGIcon/pathTransforms/index.ts` | 3 | 变形工具子入口 |
| `packages/lab/src/SVGIcon/index.ts` | 37 | SVGIcon 子入口（组件、类型、图标、变形、XIF） |
| `packages/lab/src/SVGIcon/SVGIcon.test.ts` | 174 | 变体、遮罩、分组、a11y、SSR |
| `packages/lab/styles/svg-icon.css` | 204 | 变体层变量、尺寸补偿、颜色角色、四层样式 |
| `packages/lab/src/LogStream/LogStream.vue` | 92 | 滚动区、日志区 a11y、跳转到最新 |
| `packages/lab/src/LogStream/LogStreamRow.vue` | 52 | 单行栅格、展开按钮与详情 |
| `packages/lab/src/LogStream/useLogFollow.ts` | 75 | 跟滚、取消跟随、跳转到最新 |
| `packages/lab/src/LogStream/types.ts` | 55 | LogEntry / props / emits |
| `packages/lab/src/LogStream/index.ts` | 2 | 子入口 |
| `packages/lab/src/LogStream/LogStream.test.ts` | 211 | 行、展开、跟滚、aria-live、插槽、SSR |
| `packages/lab/styles/log-stream.css` | 271 | 行栅格、级别色、终端变体、详情、跳转按钮 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| StyleX `stylex.create` | 编译成原子类，样式在 JS 里 | 普通 CSS 放 `styles/<组件>.css`，组件自己 import | 声明出来的属性和值一一对应，算出来的样式一样 |
| `tokens.stylex.ts` / `variations.stylex.ts` | `defineVars` 生成带命名空间的 CSS 变量 | 直接写 `--astryx-*` 变量，值用 `var(--astryx-x, <Neutral 默认值>)` | 每套主题都能覆盖；没装主题时也能画对 |
| `themeProps('stat', {size})` | 输出 `class="astryx-stat"` + `data-size` | 模板上写死 `class="astryx-stat"` + `:data-size` | 主题选择器的锚点一样 |
| `themeProps('circular-progress-fill', {variant})` | 给 SVG 子元素加 `data-variant` | 同上，`data-variant` 落在 `<circle>` 上 | 上游测试里 `fill` 的 `data-variant='disabled'` 我们也满足 |
| `xstyle` | StyleX 样式对象 | 不提供，用 `class` / `style`（和 core 一致） | 布局自定义能力等价 |
| `mergeProps` | 合并 class/style/事件 | `useAttrs()` + `inheritAttrs: false`，class/style 单独合并、其余原样透传 | 用户写的属性都落到根元素 |
| render prop（`value`、`media`、`children`、`detail`、`renderEntry`） | ReactNode / 函数 | `value` 用 prop 或默认插槽；`media`、`detail`、`entry` 用作用域插槽 | 用户能做同样的自定义 |
| `useId()` | 生成 label / mask id | `useId()`（Vue 自带），SSR 和客户端一致 | id 唯一、可关联 |
| `style={{...strokeWidthOverride}}` | 把 `--icon-stroke-width` 内联到根 | 把 `--astryx-icon-stroke-width` 内联到根 | 内联优先于尺寸预设，覆盖效果一样 |
| LogStream 跟滚（`useEffect` + `scrollTop`） | 每次 `following`/行数变化直接写 `scrollTop` | `useLogFollow` 里 `watch([following, entryCount])` + `nextTick` 写 `scrollTop` | 行为一致：跟随就贴底、不跟随就不动 |
| `isFollowing` + `onFollowChange` | 受控／非受控 + 回调 | `v-model:isFollowing` + `followChange` 事件 | 上游能力都能表达；和 core `Collapsible` 的受控写法一致 |
| `@starting-style` 淡入 | StyleX 的条件样式 | CSS `@starting-style` 块 + `prefers-reduced-motion` 里压到 0.01ms | 追加的行淡入，减少动效时立刻出现 |
| `popover` API（Tooltip） | 浏览器原生 popover | core `Tooltip` 用 `v-show` + 绝对定位 | 外观和开关时机一致；差异见第 6 节 |

## 3. 和计划不一样的地方

1. **`value` / `children` 的落法。** 计划写「上游的 render prop 改成具名插槽」。`Stat` 的 `value` 既是最常用的一行字符串，也是可放富内容的位置，所以做成「`value` 字符串 prop + 默认插槽，插槽优先」；`CircularProgress` 的居中内容直接用默认插槽（带 `hasValueLabel` 的兜底文字）。这样 90% 的用法只写 prop 就够，需要富内容时再上插槽。
2. **LogStream 的受控方式。** 计划没指定。用 `v-model:isFollowing` + `followChange` 事件而不是照搬 `onFollowChange` 回调 prop，理由是和 core `Collapsible`（`v-model:isOpen` + `openChange`）保持一致；同时把上游的 `renderEntry` 落成 `#entry` 作用域插槽，`detail` 富内容落成 `#detail` 作用域插槽，纯文字仍走 `LogEntry.detail`。
3. **`xstyle` 一律不提供**，用 `class` / `style`，和 core 一致（计划里也是这么写的）。
4. **SVGIcon 的变体实现位置。** 上游把变体值写在每层的 `<g style>` 上，我们改成 `data-variation` 在根上设层内变量、`<g>` 用类名取值。视觉一样，但用户可以只覆盖 `--astryx-icon-*` 就改尺寸／间隙，不用碰 `<g>`。
5. **路径变形拆成两个文件**（`parse.ts` 275 行 / `transforms.ts` 342 行），因为上游单文件 612 行超过 500 行红线。
6. **临时 Vite 页放在 `.tmp-f3b/`**，用相对路径引 `../packages/lab/src/index` 和 `../packages/themes/neutral.css`（根 `node_modules` 里没有这两个 workspace 包的可解析入口），端口 5172，未提交。

## 4. 台账处理

共 31 条：**已采纳 7 条，不适用 24 条**。逐条结论写在 `.agents-work/upstream-sync-0.7.1/ledger/F3b.md`，每条下面一行「结论：」。

已采纳：

- `5d8ece19c` InfoTip 轻点打开 → `touchTrigger="tap"`，含轻点开、再点关两条用例。
- `47d5160dc` 统一关闭栈 → InfoTip 不再自己拦 Escape，交给 core `Tooltip`。**部分满足**：core 目前把 hover 层登记成 `dismissOnPointerOutside: false`，点气泡外面不关，上游是关的（见第 6 节）。
- `d990fb58d` 禁用元素没有悬停态 → `:hover:where(:not(:disabled, [aria-disabled='true']))`。
- `e891c0dc8` / `8a9d85fdf` 禁用光标 → 直接落到最终形态 `cursor: default`（InfoTip 触发器、LogStream 展开行和跳转按钮）。
- `56f796623` CircularProgress 不确定进度的 dash 归一化 → 关键帧取值照搬（2%/300% → 175%/-68% → 2%/-302%）。
- `1581b0900` SVGIcon 纳入 UI vitest 项目 → 测试跟着 `packages/**/*.test.ts` 跑。

不适用的 25 条，全是不属于本节点的范围：

- 24 条是 Schedule 相关（`ea0483449` `a4787ffbd` `c3016f8f0` `b5e5e6832` `ea9983363` `6c8b15c01` `2458b03b3` `77a62df7e` `fdc76dc24` `195c46579` `aea0d3e03` `9eed5cb13` `5a877f46b` `9acf2845a` `cc018abe9` `2fadc27f7` `378d17022` `6e6b9b476` `4eb7ea268` `7b8bd1953` `5f6cd746f` `2c5034c5f` `3879a54dc` `9f978fa03` 中的 Schedule 部分）——Schedule 归 F3d，文档站页面归 F3f，appearance 嵌套变量归 themes（B1 / F1b）。
- 逐条理由见台账文件。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/lab` | 过 | 5 个文件、85 条用例 |
| 2 | `NODE_ENV=production pnpm exec vitest run --maxWorkers=2 packages/lab` | 过 | 同样 5 个文件、85 条用例，一条不差 |
| 3 | `pnpm --filter @astryx-vue/lab typecheck` | 过 | `vue-tsc --noEmit` 无输出 |
| 4 | `pnpm --filter @astryx-vue/lab build` | 过 | `dist/index.js` 46.38 kB（gzip 11.57）、`dist/index.d.ts` 20.16 kB |
| 5 | `pnpm exec eslint --max-warnings 0 packages/lab` | 过 | 无输出 |
| 6 | `node scripts/check-line-limit.mjs` | 过 | 「源码单文件行数检查通过（上限 500 行）」，最长源文件 `transforms.ts` 342 行 |
| 7 | `node scripts/check-no-important.mjs` | 过 | 退出码 0 |
| 8 | `node scripts/check-package-boundaries.mjs` | 过 | 「Package boundaries are valid.」 |
| 9 | `pnpm check:packages` | 过 | 边界、路径大小写、`sync --check`、cli `generate:check`、行数、`!important`、模板变量、i18n 目录全部通过 |
| 10 | 视觉对照 | 部分完成 | 截图在 `/tmp/F3b-shots/ours-light.png`、`ours-dark.png`，记录在 `/tmp/F3b-shots/report.md`。**上游官网没有这 5 个组件的页面**（全部 404），无法逐像素对照，改为按上游源码取值搬运 + 人工看截图 |

## 6. 拿不准的地方

1. **core `Tooltip` 点外面不关。** 上游 InfoTip 轻点打开后，点气泡外面会关；我们 core 的 hover 层是 `dismissOnPointerOutside: false`，点外面不关，只能靠再点一次触发器或 Escape。这是 core 浮层关闭栈（台账里 `47d5160dc`，还涉及 B4 / C7）的事，按纪律没碰 `packages/core`。需要 core 节点决定要不要把 `dismissOnPointerOutside` 打开（改了会影响 core 所有 Tooltip 的行为）。所以上游 `InfoTip.test.tsx` 里「closes on a tap outside」这条**没搬**，在测试文件里留了注释说明原因。
2. **上游官网没有 lab 组件页**（`/components/stat`、`/components/circular-progress`、`/components/info-tip`、`/components/svg-icon`、`/components/log-stream`、`/components/lab` 全是 404），所以「和原版 Demo 对照」这一项做不成截图对照。如果验收要求必须截图对照，需要另找上游 Storybook 或把上游仓库跑起来。
3. **需要放进 themes 的变量。** 这几个组件没有引入新的必须由主题提供的变量，全部复用 core 已有 token（`--astryx-color-text-secondary` / `-success` / `-error` / `-warning` / `-accent` / `-track` / `-border` / `-background-surface` / `-background-muted` / `-overlay-hover` / `-border-emphasized` / `-icon-*` / `-font-family-heading` / `-font-family-code` / `-font-size-*` / `-text-supporting-*` / `-font-weight-*` / `-spacing-*` / `-radius-*` / `-duration-*` / `-ease-*` / `-shadow-med` / `-border-width` / `-focus-outline-*`）。**注意**：`--astryx-color-accent` 在 Neutral 里是近黑／近白，所以默认 accent 的进度环是黑白而不是蓝色——和上游同一个 token，不是画错；如果以后想让 lab 的环更「彩色」，那是 themes 的决定。
   - SVGIcon 额外公开了一组「旋钮」变量，由组件自己定默认值、用户可选覆盖，不需要 themes 提供：`--astryx-icon-size`、`--astryx-icon-stroke-width`、`--astryx-icon-stroke-linecap`、`--astryx-icon-stroke-linejoin`、`--astryx-icon-inline-offset`、`--astryx-icon-block-offset`、`--astryx-icon-gap`、`--astryx-icon-gap-linejoin`。上游同样把它们当 icon 自己的 token，不属于主题。
4. **后续 lab 节点怎么加组件**（骨架说明）：
   1. `mkdir packages/lab/src/<组件>`，放 `<组件>.vue`（`defineOptions({ name: 'Astryx<组件>', inheritAttrs: false })`）、`types.ts`、`index.ts`（`export { default as <组件> } from './<组件>.vue'` + 类型）、`<组件>.test.ts`（含一条 `renderToString` 的 SSR 冒烟）。
   2. `packages/lab/styles/<组件>.css`：第一行 `@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;`，规则全写在 `@layer astryx.components` 里，变量一律 `var(--astryx-x, <上游 Neutral 默认值>)`，组件里 `import '../../styles/<组件>.css'`。
   3. `packages/lab/lab.css` 里加一行 `@import './styles/<组件>.css';`。
   4. `packages/lab/src/index.ts` 里按字母顺序加导出（`eslint --fix` 会帮忙排序）。
   5. 组件根元素挂稳定类名 `astryx-<组件>` 和 `data-<视觉属性>`，和上游 `themeProps` 的输出对齐，主题选择器才有锚点。
   6. 超过 500 行就按职责拆：像 LogStream 那样拆「行组件 + composable」，像 SVGIcon 那样拆 `pathTransforms/`。
   7. 文案：如果用到 core 的 `@astryx.*` 键，照 `packages/charts/src/messages.ts` 在包里放一份兜底；本节点这 5 个组件的文案全是固定英文（`trending up` / `Jump to latest ↓` / `Log stream` / `More information`），上游就是写死的普通字符串，不走文案表。
5. **测试搬了哪些、没搬哪些。**
   - **Stat**：14 条全搬（label/value、data-size、默认 md、delta 文字与读屏方向、方向→情绪三种、sentiment 覆盖、description、media、无 delta 时不画箭头、属性透传、富内容 value），另加一条 SSR。上游「ref 转发」用 `<Stat ref>` 之外没有 Vue 等价物，改成「attrs 落到根元素」。
   - **CircularProgress**：上游 24 条全搬（默认值、progressbar 而非 meter、缺省 value 为空环、隐藏／显式 label、aria-labelledby 关联、自定义 max、clamp、`aria-valuetext`、`hasValueLabel`、`formatValueLabel`、children 优先、居中内容、data-testid、5 个变体、3 个尺寸、几何、dashoffset、max=0、NaN value、NaN max、0 max 不出 NaN、禁用换色、禁用仍显示文字、不确定模式 6 条），另加「不确定进度用 dasharray 关键帧」和 SSR。
   - **InfoTip**：上游 12 条，搬了 11 条（默认名、自定义名、aria-describedby、Tab 可达、悬停、键盘焦点、Escape、Escape 后重新悬停再开、富内容、轻点开、再点关），**没搬「点外面关」**（原因见第 6 节第 1 条），另加 SSR。
   - **SVGIcon**：上游 12 条全搬（装饰性与 role="img"、aria-labelledby、显式 aria-hidden 优先、形状属性与 viewBox、三个 data 属性、角色分组、bold 遮罩挖洞、非 bold 保留次层、无可挖时不生成遮罩、strokeWidth 内联、自定义 viewBox 与属性透传），另加「15 个示例图标都能渲染」和 SSR。
   - **LogStream**：上游 13 条全搬（逐行文字与 data-level、日志区可访问名、时间列开关、展开／收起、跟随追加贴底、滚离底部取消跟随、贴底滚动不取消、跳转到最新、非受控状态、受控 aria-live 开合、跳转恢复 aria-live、renderEntry 替换行），另加「`#detail` 富内容插槽」、终端变体标记、SSR。
   - 上游用 `@testing-library/react` 的地方改成 `@vue/test-utils`（仓库统一用它），`getByText` 的口径用「元素自己的文字节点」还原，**期望值一个没改**。
