# B1 主题系统与 token · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B1`，分支 `sync/b1-theme`。只在本地提交，没有推送。
- 提交（基于 `0eae1b6`，swarm-tree 之后又前进到 `c964628`，没有 rebase）：
  - `31cafcb` feat(themes)!: 间距 token 改成 rem，跟随根字号缩放
  - `868b6b3` feat(theme)!: 主题系统追平上游 0.7.1
  - `72acf63` docs(theme): 主题文档写清 rem 间距、共用数据配色、换肤挂点、局部 token、环境适配和已删除的旧名
  - `f359457` docs(ledger): B1 台账 98 条全部给出结论

## 1. 做了什么

按计划「开发步骤」逐条写。

1. **盘点**：台账 98 条已经逐条归类，结果见第 4 节。
2. **间距改 rem**：
   - 七套主题 `base.css` 里共享的 `--astryx-spacing-*` 全部换成 rem，取值照抄上游 `spacingDefaults`，例如 `0rem`、`0.125rem`……`3rem`。
   - matcha 和 y2k 本来就有自己的 rem 档位，只把剩下几档 px（`0`、y2k 的 9–12 档）换成等值 rem。像素值没有变，这不是 D2 的 #7374 改档位。
   - 组件样式里 spacing 和 px 混算的地方有 67 处，`var(--astryx-spacing-N, Npx)` 回退值有 916 处。spacing 已经定义的情况下，回退值不会生效，默认根字号下结果不变，所以没有改。
   - 文档站主题编辑器 `themeScale.ts` 改成输出 rem，和上游 #7359 说的「the docsite theme editor reads and builds rem spacing」一致。
3. **删除兼容层**：
   - 21 个旧挂点名在我们组件里本来就没有输出，grep 结果为 0。
   - `defineTheme` 只认 `<component-kebab>-<part>`。驼峰、大写开头、带下划线、带双短横的名字会直接报错。
   - Button 不再输出 `primary`、`sm` 这类裸类名，只保留 `data-variant`、`data-size`。全仓 CSS 都没有用到这些裸类名。
4. **数据 token**：
   - 56 个 `--astryx-color-data-*` 从七份主题 `base.css` 里移出，统一放进新文件 `packages/themes/data.css`，只在 `:root` 上声明一次。
   - 主题入口由 `pnpm sync` 生成 `@import './data.css'`，生成规则改在 `scripts/sync-exports/render-css.mjs`。
   - core 导出同一组值 `DATA_TOKEN_DEFAULTS`。`useTheme().token()` 在页面上读不到时，会回退到这组默认值。
5. **defineTheme 等 API**：
   - 新增 `localTokens`、`adaptations`，以及 `onDark` / `onLight` 的 `components`。
   - `extends` 能完整继承。
   - 加了声明边界：坏值丢弃并告警，其余照常。
   - 加了派生变量：主题改圆角或内边距时，跟着走的内部部位一起变。
   - 主题的 `:hover` 不作用在禁用控件上。
   - 主题写了层级或类型规则后，Heading / Text / Link 显式传的属性（字重、颜色、字号）仍然优先生效。
   - 主题样式表改用 `@scope (...) to ([data-astryx-theme])`，遇到嵌套主题就停。
   - MediaTheme auto 的测量方式按上游重写。
   - useTheme 的返回值保持稳定。
6. **Tailwind 桥接**：不做，理由见第 6 节。
7. **文档**：中英文的 themes/scale、color、tokens、extending，以及 components/theme（index、props）、media-theme 都已更新。
8. **生成文件**：已跑 `pnpm sync` 和 cli 的 `generate`。
9. **台账**：98 条全部改成 `[x]`，每条写了结论。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| packages/themes/data.css | 84 | 56 个数据配色默认值，只写在 `:root` |
| packages/core/src/Theme/defineTheme.ts | 137 | 入口，把下面各模块串起来 |
| …/resolveThemeValues.ts | 115 | 生成轴展开、token 写成 CSS、组件表合并 |
| …/localTokens.ts | 182 | 局部 token 和引用环检测（强连通分量算法） |
| …/adaptationTypes.ts | 108 | 环境规则类型、断点常量 |
| …/adaptations.ts | 291 | 规则校验、媒体查询、规则解析、全环境组合查环 |
| …/themeAxes.ts | 78 | extends 之后实际生效的生成配置 |
| …/componentStyles.ts | 204 | 挂点校验、选择器、声明块 |
| …/derivedVars.ts | 178 | 派生变量表、容器内边距展开 |
| …/propGuards.ts | 104 | 让显式属性仍然优先的补回规则 |
| …/themeCss.ts | 111 | 拼出整张样式表：根、环境规则、媒体表面 |
| …/declarationBoundary.ts | 260 | 判断一个值是否会跳出单条声明 |
| …/dataTokens.ts | 68 | `DATA_TOKEN_DEFAULTS` |
| …/useTheme.ts / useAutoMediaMode.ts / contrast.ts | 80 / 121 / 98 | 稳定的返回值；按上游方式测量表面 |

所有源码文件都在 500 行以内，`check-line-limit` 通过。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #7359 间距 rem | StyleX `spacingDefaults` 改成 rem | CSS 变量改成 rem | 默认根字号下像素差为 0；根字号 20px 时按 1.25 倍放大 |
| #6834 数据默认值 | StyleX `dataVars` 自己持有默认值，主题输出不带 | `themes/data.css` 的 `:root` 声明一次，主题样式表不带 | 默认值只有一处；主题只写自己改的；嵌套主题不会被改回默认值 |
| #5844/#6285 局部 token | `localTokens` 原名保存，带所有者和继承链 | 同上，记录 `localTokenOwners` | 名字、继承、引用环报错都一致 |
| #5543 环境适配 | `generateAdaptationCSS` 输出 `@media` 加 `@scope` | 同样的媒体查询文本和顺序；token 写入加 `!important`（理由见第 3 节） | 媒体查询字符串逐字一致，后面满足的规则赢 |
| #5529 声明边界 | `declarationBoundary.ts` | 移植上游实现，上游 76 条用例原样通过 | 接受和拒绝的判断完全相同 |
| #5247 禁用 hover | `:where(:not(:disabled,[aria-disabled]))` | 同样写法 | 不增加优先级 |
| #6027 Heading 字重 | 在类型规则之后重新写出 weight 规则 | 同样的思路，还额外覆盖 Text 的 size/color 和 Link 的 color（上游的 generateColorOverrides / SizeOverrides） | 显式属性仍然优先 |
| #5299 MediaTheme auto | 叠合背景层，读 `on-dark` / `on-light` 和环境文字色 | 同样的算法；用 `onUpdated` 加 MutationObserver 重新测量 | 选哪一边的结果一致 |
| #5274 useTheme 稳定 | useMemo / useCallback | 每个组件只建一次，tokens 用 computed | 测试证明：无关的重渲染不会触发重算 |
| #4592 accent 元组 | `expandColorScale` | 原本已支持 | 用上游真实输出做夹具，3 组输入逐 token 一致 |
| 主题作用域 | `@scope (theme) to ([data-astryx-theme])` | 同样的写法 | 嵌套主题内部不会被外层主题的组件规则污染 |

## 3. 和计划不一样的地方

1. **`!important`**：
   - 我们的 `Theme` 把根 token 写成内联 style。这样同名的两个 `Theme` 也能各用各的值。
   - 环境规则写在样式表里，要压过内联 style 只能加 `!important`。只有媒体查询满足时才生效。
   - 上游根 token 也写在样式表里，所以不需要这样做。效果是一样的。
2. **组件 `--axis-value` 修饰类**：
   - 很多组件（Heading、Text、Link、Tab、Toast 等）还没有把属性反射成 `data-*`。
   - 所以主题选择器同时匹配 `[data-variant="x"]` 和 `.astryx-<target>--variant-x`。两种写法都限定在挂点上，不是裸类名。
   - 等各 C 节点补齐 `data-*` 以后，可以删掉修饰类这一路。
3. **派生变量表**：只登记了我们样式表里实际读取的 5 个组件：card、context-menu、dialog、dropdown-menu、segmented-control。上游表里其它组件等对应 C 节点接入后再补。`registry.test.ts` 会防止名字写错。
4. **数据配色不放 core**：ADR 0001 规定主题变量放在 themes 包，所以 `data.css` 放在 themes。没有引入 `themes` 的用户可以用 core 导出的 `DATA_TOKEN_DEFAULTS`。
5. **触屏窄屏字号阶梯**：
   - B1 提供了机制（adaptations），并用上游 Neutral 的规则（base 16、ratio 1.1736）在测试里得到和上游相同的取值。
   - 但七套主题是手写 CSS，把这条 `@media` 写进主题属于 D1 / D2（台账 `8527f921e`）。
6. **外观嵌套 token（#5963）**：上游 #6031 已经回退，0.7.1 里没有，所以不做。

## 4. 台账处理

共 98 条：已采纳 38 条，不适用 20 条，交给其他节点 40 条。

按计划的 6 类归类如下（数量是条数，含 docs 和 spec）：

| 类别 | 条目 |
| --- | --- |
| 1 间距 rem | f3a218198、c700d4ca9 |
| 2 删兼容层 | a1a6a636f、1232b85af、41ab6db2a、f747a49f2、1654e3fcf、814553ef9、21875fc0e |
| 3 数据 token | 01fb22f93、6447c5ece、9a61177d8、4aec44c86、d6da8e43f、d3e09c58a、7d4628128 |
| 4 defineTheme | 593996134、7418f0e72、62bf723ed、ae9ccef67、356d2f935、45a9bf577、039a67ea5、a7ba3a09a、d990fb58d、9fdb3819f、ea0483449、6e6b9b476、78b309925、621c4017a、e6229f1fc、b333c3981、69de788f1 |
| 5 MediaTheme / useTheme | fba7b4009、89abbb3ed、ff6777ad2、e5e0d811a |
| 6 组件挂点（交给 Cx） | 见第 6 节清单 |

不适用的 20 条及理由：

- 75325ef88：React 的 use client。
- 9a61177d8：上游输出结构的字段。
- 41ab6db2a、814553ef9：过渡期兼容和窗口，我们直接对齐删除后的状态。
- 01fa43907、6b72a508f：Tailwind 桥接。
- 7a0be9497：类型补字段，我们一直有这个变量。
- ed45a8fa2：上游测试的文件发现方式。
- b10c83922、d17b39e47、176dfa624、17044ab1e、a8d6bf291、039852fc0：上游流程或审批记录。
- e678380ed：设计记录，留给 C 节点参考。
- 83da2aeed、f8ac6b1da：只改文档里的弃用阶段。
- e5e0d811a：文案标点。
- f27f74937：richtext 内部清理。
- ea0483449：已被上游回退。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Theme packages/themes` | 过 | Theme 目录 156 条，themes 包 3 个文件；全量 233 个文件、2818 条 |
| 2 | `NODE_ENV=production pnpm vitest run --maxWorkers=2`（全量） | 过 | 233 个文件、2818 条，和第 1 条相同 |
| 3 | `env -u NODE_ENV pnpm check`（test 换成 vitest --maxWorkers=2） | 过 | check:packages=0、lint=0、typecheck=0、test=0、build=0、lint:pkg=0 |
| 4 | 默认外观不变 | 过 | `/tmp/B1-before` 和 `/tmp/B1-after`，Button、Card、Dialog、TextInput、Table 各 4 种组合，共 20 张 `ours.png`，pixelmatch 阈值 0，**差异全部为 0 像素**。before 有 7 张因上游超时补拍，补拍时代码没有改动 |
| 5 | 根字号跟随 | 过 | `/tmp/B1-browser/button-root-16px.png`、`button-root-20px.png`；`report.json`：根字号 16→20px 时，`--astryx-spacing-4` 16→20px，按钮内边距 12→15px，gap 8→10px，正好 1.25 倍 |
| 6 | 深色模式 | 过 | `/tmp/B1-browser/theme-dark.png`：Warm、Forest 两套主题在深色下正常；`color-dark.png`；数据色在深色下取到深色那一档（neutral 是 `rgb(140,147,155)`，等于 #8C939B；gray-5 等于 #333338） |
| 7 | 单文件行数 | 过 | 最大的是 adaptations.ts，291 行 |

- 浏览器：都经过 browser-lock 运行，同一时间只开 1 个。
- 文档站：用的 5171 端口，用完已经关闭。

## 6. 拿不准的地方

1. **删掉的旧名清单（给 D7）**：

   | 旧名 | 新名 |
   | --- | --- |
   | `base-table` | `table` |
   | `checkbox` | `checkbox-indicator` |
   | `codeblock` | `code-block` |
   | `codeblock-copy-button` | `code-block-copy-button` |
   | `codeblock-header` | `code-block-header` |
   | `codeblock-title` | `code-block-title` |
   | `date-input-clear-icon`、`date-range-input-clear-icon`、`multi-selector-clear-icon`、`selector-clear-icon` | `input-clear-icon` |
   | `hovercard` | `hover-card` |
   | `navicon` | `nav-icon` |
   | `popover-surface` | `popover` |
   | `progressbar` | `progress-bar` |
   | `progressbar-fill` | `progress-bar-fill` |
   | `progressbar-mark` | `progress-bar-mark` |
   | `progressbar-track` | `progress-bar-track` |
   | `radio` | `radio-indicator` |
   | `radio-dot` | `radio-indicator-dot` |
   | `statusdot` | `status-dot` |
   | `textarea` | `text-area` |

   另外有两处行为变化：
   - Button 不再输出 `.primary`、`.secondary`、`.ghost`、`.destructive`、`.sm`、`.md`、`.lg`，改用 `[data-variant]`、`[data-size]`。
   - `defineTheme` 遇到驼峰、大写开头、带下划线的挂点名会报错。
   - 注意：我们组件里有一个类名 `astryx-radio`（Radio 的 label）和上游已删除的旧名同名。主题写 `radio` 仍然能命中它。要不要改名，由 C2 决定。
2. **交给 Cx 的清单**：
   - C1：77dd6a746、a7347036c、82a416ae7、191834477
   - C6 / C12：d07687a1d
   - C7：c6a8b21ae、cddf57e5d、e1079ca56（Popover 圆角派生变量）
   - C8 / C14：031021b81
   - C9：b32d73f95、c825c8596、87070314f（同时涉及 D1 / D2）
   - C11：6e0d7a87b
   - C12：255e810cf
   - C14：408cef219、22a934ab3
   - C15：a5f4b039e、680338c1b、b75ade05e
   - C16：68384067d、b1fcbeedb、1ce0b4c7f、9378ba5ce
   - B3：33a14a205
   - B4：4aacbbedc、684b56d19
   - 其余交给 D4b、F 节点
   - 各 C 节点补齐 `data-*` 反射以后，派生变量表要跟着补登记，挂点改名也由各节点完成。
3. **有意保留的差异**：
   - 保留 `--astryx-` 前缀，因为现有用户的自定义主题已经在用这些名字。`defineTheme` 两种写法都接受。
   - 环境规则写入 token 时用 `!important`，见第 3 节。
   - 不提供 Tailwind 桥接：我们不依赖 Tailwind；变量本身就能直接写 `bg-[var(--astryx-…)]`；上游 #6797 也已经把桥接收窄成只引用。这个结论写进了扩展文档。
4. **`@scope` 的浏览器支持**：
   - 上游同样依赖 `@scope`，所以我们照做。
   - Firefox 较早的版本不支持 `@scope`，会整块忽略主题组件规则（token 不受影响，因为写在行内）。这和上游的支持范围一致（上游 AST-013 只承诺主流浏览器）。
5. **计划没写、但顺手修了的问题**：
   - zh 扩展文档里原来的示例缺 `name`，`radius` 也写错了，会直接抛错，已改正。
   - `ThemeStyle` 原来用文本子节点，服务端渲染时会把引号转义成 `&quot;`，选择器就失效了。现在改成写入原始文本，并保证内容里不会出现 `</style`。
6. **未 rebase**：swarm-tree 已经前进到 `c964628`，合入时由 `worktree.mjs merge` 处理。生成文件 `catalog.json`、`core/src/index.ts`、主题入口可能需要重新跑 sync。
