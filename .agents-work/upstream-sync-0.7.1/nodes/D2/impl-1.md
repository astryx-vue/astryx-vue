# D2 其余 6 套主题适配 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D2`，分支 `sync/d2-themes`。只在本地提交，没有推送。
- 提交（基于 `e665a16`）：
  - `892d1f7` 核心(样式)：给主题开边框、圆角、内边距、字重的变量入口
  - `74f64d1` 主题(六套)：等宽字体栈对齐上游 0.7.1
  - `d7d8f0b` 主题(matcha)：圆角与区块内边距对齐上游 0.7.1
  - `ceaa6ff` 主题(chocolate)：次要按钮描边、卡片与区块内边距对齐上游 0.7.1
  - `1b3dd55` 核心(样式)：给按钮和徽章开基础描边的变量入口
  - `d2c2386` 主题(gothic)：状态条、分类卡片、圆角与区块内边距对齐上游 0.7.1（含 butter / chocolate / stone 的触屏字号阶梯）
  - `d5cd7d1` 主题(y2k)：按钮描边、徽章描边、状态条与分类卡片对齐上游 0.7.1
  - `f41e79b` 主题(stone)：次要按钮描边、进度条填充、输入状态色对齐上游 0.7.1
  - `469a28e` 主题(butter)：按钮内边距、徽章尺寸、状态色与顶部导航对齐上游 0.7.1
  - `be702c4` 测试(主题)：六套主题的语义色、圆角契约和关键组件值比对上游 0.7.1

## 1. 做了什么

1. **写比对脚本**（`D2/.tmp-d2/`，用完已删）：`extract-upstream.mjs` 把上游 6 个
   `<名>Theme.ts` 转译后跑一遍，套用上游的 `expandTypeScale` / `expandRadiusScale` /
   `expandMotionScale` 和 `resolveThemeValues` 的优先级，产出 `upstream.json`（token 表 +
   核心默认值 + 组件覆盖 + adaptations）；`compare-tokens.mjs` 用 `css.mjs` 解析我们的主题
   CSS，跟上游逐个 token 比浅深两档；`compare-components.mjs` 用 `index-css.mjs` 把我们的
   声明连选择器一起索引，再把上游每条组件覆盖映射到我们的变量或元素重指上比对。
2. **开工时的差距**（本次续做第一次跑）：token 层 10 处不一致（gothic 4、stone 2、y2k 4，
   全是代码块差异行）；组件层 270 处（butter 129、gothic 40、stone 60、y2k 41；chocolate 和
   matcha 当时已清）。脚本自身有 5 处映射缺口，先修脚本再改主题：卡片分类变的 token 名、
   次要触发器的边框色优先顺序、复合选择器（`:hover:not(...)`）的路径匹配、hex 大小写、
   `@media` 块被当成根声明。
3. **核心开口子**（两个提交，14 个核心样式文件，见下节）：主题要改按钮/徽章的描边、
   内边距、圆角、字重、次要按钮的悬停叠层时，原本只能靠主题层再写一条组件选择器；
   改成组件读一个带默认值的变量，主题只写变量。所有默认值和改动前一致。
4. **逐套主题落值**：一套主题一个提交。改动集中在 `base.css`（语义色、字号阶梯）和
   组件文件（button / badge / banner / card / code / input / progress-bar / switch /
   section / top-nav）。状态条和分类卡片在浅色底上要把共享的文字、色相 token 重指到
   对应色相的深色值，写在 `astryx.overrides` 层、作用域限定在组件元素上（和 D1 的
   neutral 一样），因为上游就是按元素重指 token，不是给组件新开变量。
5. **补触屏字号**：butter、chocolate、stone 有上游 adaptation，按 16px 基准和各自比例
   重算整条阶梯，只写跟桌面不同的 38 个值（`mobile-type.css`）。
6. **写测试**：`packages/themes/theme-parity.test.ts` 一张表按主题循环，期望值直接抄上游。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/styles/button.css` | 375 | 按钮描边、内边距、次要变体悬停叠层读变量 |
| `packages/core/styles/badge.css` | 102 | 徽章高度、内边距、圆角、字重、描边读变量 |
| `packages/core/styles/{banner,card}.css` | 各 1–2 行改动 | 圆角、内边距读变量（`--astryx-section-padding` 和 `--astryx-card-padding` 之前就有读取点，本轮只是给主题写值） |
| `packages/core/styles/{bordered-control,number-input,date-input,text-input,text-area,selector,multi-selector,complex-selector,tokenizer,typeahead}.css` | 各 1–11 行改动 | 输入类组件的块级/行内内边距，次要触发器复用次要按钮的描边与悬停叠层 |
| `packages/themes/{butter,chocolate,gothic,matcha,stone,y2k}/base.css` | 各 247–250 | 语义色、分类色、字号与行高阶梯、圆角、阴影、动效（上游 token 全量） |
| `packages/themes/*/button.css` | 24–39 | 主要/次要/幽灵/危险四种按钮的底色、文字色、描边、内边距 |
| `packages/themes/*/badge.css` | 35–40 | 徽章状态色与分类色，y2k 的全圆角 + 1.5px 描边，butter 的 30px 高 |
| `packages/themes/*/banner.css` | 15–47 | 状态条底色，以及状态底上重指文字/色相 token |
| `packages/themes/*/card.css` | 24–104 | 卡片底色、阴影、内边距；gothic 十套分类变的文字重指、butter 十五套 |
| `packages/themes/*/code.css` | 39–40 | 语法高亮配色、代码块底，差异行与标记色 |
| `packages/themes/*/input.css` | 21–24 | 输入框描边、内边距、状态描边与状态提示底色/文字色 |
| `packages/themes/*/progress-bar.css` | 15–17 | 进度条轨道与各变体填充色 |
| `packages/themes/{butter,chocolate,stone}/mobile-type.css` | 各 55 | 触屏窄屏下的字号阶梯与行高 |
| `packages/themes/{butter,chocolate,gothic,matcha,stone,y2k}/section.css` | 7–8 | 区块内边距 |
| `packages/themes/{butter,y2k}/top-nav.css` | 35 / 22 | 顶部导航标题、未选中项、选中项的文字色与悬停按压底色 |
| `packages/themes/theme-parity.test.ts` | 196 | 六套主题的语义色、`radius-none` 契约、关键组件值、触屏阶梯 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| token 全量（174–189 个/套） | `tokens` + `typography` + `radius` + `motion` + `syntax` 经 `resolveThemeValues` 展开成 `--*` | 同一批 token 以 `--astryx-` 前缀写进 `base.css`，字号阶梯是上游 `expandTypeScale` 的输出 | 比对脚本把上游同样的展开跑一遍，逐个 token 比浅深两档，6 套各 0 处不一致 |
| `8527f921e` 触屏窄屏字号 | `adaptations`：粗指针且宽 < lg 时用 16px 基准重算阶梯 | `mobile-type.css` 的 `@media (width < 1024px) and (pointer: coarse)`，只写与桌面不同的 38 个值 | 上游也是绝对 rem 值重算，不是换基准；比对脚本里桌面值和移动值是两份，各自对得上 |
| `a84a895f7` 差异行 | gothic 用不透明深绿/深红保住浅色语法对比度；stone、y2k 用带透明度的淡色 + 单独标记色 | `code.css` 里 `--astryx-code-syntax-added/-removed/-added-marker/-removed-marker` 写上同样的浅深两档 | 值逐个相等 |
| `fe8cad01c` 次要触发器 | Selector、MultiSelector、ComplexSelector 的次要触发器复用同一份 `SECONDARY_*` 常量 | 核心样式里这三类触发器读 `--astryx-button-secondary-border-width/-style/-color/-hover-overlay`，主题只写这几条 | 触发器与次要按钮读同一组变量，天然一致，不需要各写一遍 |
| `y2k` 按钮/徽章描边 | `base` 上给 1px / 1.5px 描边，各变体再改描边色 | 新增 `--astryx-button-border-*`、`--astryx-button-<变体>-border-*`、`--astryx-badge-border-*`，y2k 只写变量 | 默认 0 / solid / transparent 等于改动前的 `border: 0`；变量层层回退，效果与上游一致 |
| `gothic` 幽灵按钮悬停 | `variant:ghost` 的 `:hover` 设 `var(--color-overlay-hover)` | 加了 `--astryx-button-ghost-hover-overlay`，值回退到按钮层，而 gothic 的按钮层本来就是 `--astryx-color-overlay-hover` | 两点同值，视觉无变化；变量留着给别的主题用 |
| 状态条 / 分类卡片文字 | 在状态或分类变体的作用域里重指 `--color-text-primary` 等 | `astryx.overrides` 层里 `[data-astryx-theme='x'] .astryx-banner[data-status='…']` 重指 `--astryx-color-text-*` | 都是「元素上重指 token 让子树读到」，作用域一样 |
| `73209502d` radius-none | 四套固定 `0px` | `base.css` 里写 `0px`，测试按主题断言（matcha 保持核心默认 `0`） | 值相等，且契约有测试兜住 |
| `6ecd41722` matcha/y2k 间距 | 间距阶梯改成 rem | 已经是 rem（0 / 0.375 / 0.75 / 1.125 …），只复核 | 值逐个相等 |

### 和上游值不一致的地方

无。最终比对：6 套主题 token 层 0 处不一致（butter 174、chocolate 171、gothic 175、
matcha 186、stone 175、y2k 189 个上游 token），组件层 424 条组件覆盖值全部一致（butter 165、
chocolate 15、gothic 75、matcha 4、stone 87、y2k 78）。

## 3. 和计划不一样的地方

1. **先修比对脚本，再改主题。** 计划把脚本当成量尺，但第一版脚本有 5 处映射缺口（会误报
   不一致）：卡片分类变的 token 名拼成 `--astryx-color-color-text-primary`、输入类次要
   触发器的边框色优先映射到 `--astryx-input-border`（应优先 `--astryx-button-secondary-border-color`）、
   复合选择器 `:hover:not(...)` 里的 `:hover` 没被识别成悬停态、hex 大小写被当成差异、
   `@media` 块里的声明被当成根声明（加 `mobile-type.css` 后会把桌面值全判错）。修完后
   才敢按脚本清零。
2. **触屏字号文件比 neutral 多几个值。** D1 的 neutral `mobile-type.css` 只写字号和行高；
   butter 桌面把 `--text-supporting-size` 固定成 12px，adaptation 里它变成 `var(--font-size-sm)`，
   所以 butter / stone 的 `mobile-type.css` 里还有一条 `--astryx-text-supporting-size`。
   文件是按「上游 adaptation 展开值 vs 桌面值取差」生成的，不是手抄。
3. **y2k 徽章圆角写死 `9999px`。** y2k 的 `--astryx-radius-full` 是 `0`，上游徽章却写死
   `9999px`，所以这里不能用圆角阶梯的变量，只能写字面值（测试里也这么断言）。
4. **状态条/分类卡片用元素重指，没有给组件开新变量。** 上游的做法就是在变体作用域里重指
   token，我们的组件本来就是读这些 token，所以对齐上游即可，不需要 C 阶段那种挂点。
5. **`packages/themes/base-tokens.test.ts` 改了一行断言。** 等宽字体栈对齐上游后（`'SF Mono'`
   那套），原来断言 `ui-monospace, SFMono-Regular` 的用例失效，改成断言上游的字体栈。

## 4. 台账处理

15 条：已采纳 10 条，不归本节点 2 条（neutral 的 Badge 相关，D1 已做），不适用 3 条。
逐条结论写在 `.agents-work/upstream-sync-0.7.1/ledger/D2.md`，全部 `- [x]`。
不适用的三条：

- `4ec1f4ea6`、`00f1ed9da`：本仓库没有主题图标注册表（`packages/themes/*/icons.tsx` 不存在）。
- `34b4692a3`：本仓库没有 `<主题>.doc.mjs` 主题描述文件。
- `71cf6cd06`：本仓库共用一份 `packages/themes/fonts.css`，不按主题拆字体入口；其余部分属 CLI。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/themes` | 过 | 4 个文件、52 条用例 |
| 2 | 同上，另一种 `NODE_ENV` | 过 | 4 个文件、52 条用例（用例数相同） |
| 3 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core packages/themes` | 过 | 284 个文件、3786 条用例 |
| 4 | `env -u NODE_ENV pnpm check:packages` | 过 | 包边界、路径大小写、`sync-exports --check`（「生成结果和已提交文件一致」）、`generate:check`（catalog up to date，245 组件 / 32 主题 / 53 模板）、行数检查、`check-no-important`、i18n 目录，全部通过 |
| 5 | `node scripts/check-no-important.mjs` | 过 | 6 套主题没有 `!important` |
| 6 | `node scripts/check-line-limit.mjs` | 过 | 最大单文件 375 行（`core/styles/button.css`），上限 500 |
| 7 | 比对脚本（token 层） | 0 处不一致 | butter 174 / chocolate 171 / gothic 175 / matcha 186 / stone 175 / y2k 189 个 token 逐个对浅深两档 |
| 8 | 比对脚本（组件层） | 0 处不一致 | 424 条组件覆盖值：butter 165、chocolate 15、gothic 75、matcha 4、stone 87、y2k 78 |
| 9 | 浏览器：6 个主题页各读 3 个变量 | 0 处不一致 | 5171 端口起文档站，Playwright 在 `[data-astryx-theme='x']` 上读 `--astryx-color-accent`、`--astryx-color-text-primary`、`--astryx-color-border` 的计算值，全部等于上游浅深两档；再从同一个宿主读一遍实际画出来的 `background-color` 作为旁证 |
| 10 | 截图 | 有 | `/tmp/D2-shots/stone.png`、`/tmp/D2-shots/gothic.png`（整页，深色模式），页面结构和主题预览区都正常渲染 |

自测附加说明：第 9 条读完即关掉 5171 端口（`lsof -ti:5171` 为空），`.tmp-d2/` 已删除，
没有留下未提交文件（`git status` 干净）。

## 6. 拿不准的地方

1. **主题自带的字体没有随主题加载。** `packages/themes/fonts.css` 目前只引 Figtree 和
   JetBrains Mono，而六套主题的正文/标题用的是 Outfit、Albert Sans、Fraunces、Sarina、
   Crimson Text、Montserrat、Manufacturing Consent 等。值写对了，但用户机器上大概率回退到
   fallback。这属于字体/打包节点（上游在 `71cf6cd06` 里给每套主题加了 `fonts.css`），
   建议单独排一条。
2. **gothic 的幽灵按钮悬停**没有独立的视觉差异（上游值恰好等于按钮层的悬停叠层）。变量
   已经开好，值没写，比对脚本按「回退到按钮层」判等。如果验收要求「主题文件里出现这个
   变量」，说一声我补上。
3. **状态条和分类卡片的元素级重指**依赖组件真的读 `--astryx-color-text-primary` 等 token。
   我按值核对过、也看了 stone 和 gothic 的整页图，但没有逐个组件（Banner 四种状态、卡片
   十五种分类变体）做截图对照。如果要更硬的证据，需要 C 阶段组件都到位后跑一轮视觉对照。
4. **六套主题共有 65 个核心样式不直接读取的 token**（如 `--astryx-banner-info-foreground`、
   `--astryx-avatar-status-dot-info-background`）。颜色类大多被主题内其它变量引用，属于正常；
   但 `--astryx-banner-*-foreground` 这一类目前没有读取点，Neutral 和 D1 也一样。要不要清理
   是存量问题，本轮没动，见最后一节。

## 给 core 加的变量入口

所有默认值都等于改动前组件里写死的值，所以 Neutral 和六套主题在改动前的观感不变。

（1）`892d1f7`：

| 变量 | 读取位置 | 为哪个主题的哪个上游值 | 默认值 / 改动前 |
| --- | --- | --- | --- |
| `--astryx-badge-height` | `badge.css` | butter `badge.base.height` = `30px` | `var(--astryx-spacing-5, 20px)`，与原来一致 |
| `--astryx-badge-padding-block` | `badge.css` | butter `badge.base.paddingBlock` = `0` | `0`，与原来一致 |
| `--astryx-badge-padding-inline` | `badge.css` | butter `badge.base.paddingInline` = `var(--spacing-3)` | `var(--astryx-spacing-2, 8px)`，与原来一致 |
| `--astryx-badge-radius` | `badge.css` | gothic `badge.base.borderRadius` = `var(--radius-element)`；y2k 字面 `9999px` | `var(--astryx-radius-full, 9999px)`，与原来一致 |
| `--astryx-badge-font-weight` | `badge.css` | gothic `badge.base.fontWeight` = `var(--font-weight-medium)` | `var(--astryx-font-weight-medium, 500)`，与原来一致 |
| `--astryx-button-padding-block` | `button.css` | butter `button.base.paddingBlock` = `var(--spacing-3)` | `var(--astryx-spacing-2, 8px)`，与原来一致 |
| `--astryx-button-padding-inline` | `button.css` | butter `button.base.paddingInline` = `var(--spacing-4)` | `var(--astryx-spacing-3, 12px)`，与原来一致 |
| `--astryx-button-secondary-border-width` | `button.css` | chocolate `1px`、stone `1.5px`、y2k `1px` | `0`；原来次要按钮无描边，一致 |
| `--astryx-button-secondary-border-style` | `button.css` | chocolate、stone、y2k 都是 `solid` | `solid`，一致 |
| `--astryx-button-secondary-border-color` | `button.css` | chocolate `var(--color-border-emphasized)`、stone 同上、y2k `var(--color-text-green)` | `transparent`，一致 |
| `--astryx-button-secondary-hover-overlay` | `button.css` | butter `light-dark(#225BFF14,#FDEE8C14)`、stone `var(--color-neutral)`、y2k `var(--color-border-green)` | 回退到 `--astryx-button-hover-overlay`（`#0000000d`），一致 |
| `--astryx-banner-radius` | `banner.css` | gothic `banner.base.borderRadius` = `var(--radius-element)` | `var(--astryx-radius-container, 12px)`，一致 |
| `--astryx-card-radius` | `card.css` | 六套的 `card.base.borderRadius`（gothic `radius-container`、y2k `0px`） | `var(--astryx-radius-container, 0.75rem)`，一致 |
| `--astryx-input-padding-block` | `bordered-control`、`number-input`、`date-input`、`multi-selector`、`selector`、`text-area`、`text-input`、`tokenizer`、`typeahead` | butter 各输入 `paddingBlock` = `var(--spacing-2)` | 每个组件保持各自原值（`spacing-1` / `spacing-2` / `0`），一致 |
| `--astryx-input-padding-inline` | 同上 | butter 各输入 `paddingInline` = `var(--spacing-3)` | 各组件保持各自原值（`spacing-2` / `spacing-3`），一致 |
| 次要触发器复用上面按钮的三条描边 + 悬停叠层 | `selector.css`、`multi-selector.css`、`complex-selector.css` | `fe8cad01c`：次要样式的选择器和次要按钮一致 | 原来写死「无描边 + 按钮层悬停叠层」，一致 |

（2）`1b3dd55`：

| 变量 | 读取位置 | 为哪个主题的哪个上游值 | 默认值 / 改动前 |
| --- | --- | --- | --- |
| `--astryx-button-border-width` | `button.css`（`.astryx-button`） | y2k `button.base.borderWidth` = `1px` | `0`；原来是 `border: 0`，一致 |
| `--astryx-button-border-style` | 同上 | y2k `borderStyle` = `solid` | `solid`，一致 |
| `--astryx-button-border-color` | 同上 | y2k `borderColor` = `var(--color-border)` | `transparent`，一致 |
| `--astryx-button-primary-border-width` / `-style` / `-color` | `button.css`（`variant:primary`） | y2k `primary.borderColor` = `transparent` | 逐级回退到按钮层（0 / solid / transparent），一致 |
| `--astryx-button-secondary-border-width` / `-style` / `-color` | `button.css`（`variant:secondary`） | 同上（chocolate / stone / y2k 的次要按钮） | 回退到按钮层，一致 |
| `--astryx-button-ghost-border-width` / `-style` / `-color` | `button.css`（`variant:ghost`） | y2k `ghost.borderColor` = `transparent` | 回退到按钮层，一致 |
| `--astryx-button-ghost-hover-overlay` | `button.css`（`variant:ghost`） | gothic `ghost.:hover.backgroundColor` = `var(--color-overlay-hover)` | 回退到按钮层悬停叠层，一致（该主题两者同值，观感不变） |
| `--astryx-button-destructive-border-width` / `-style` / `-color` | `button.css`（`variant:destructive`） | y2k `destructive` = `1px` / `solid` / `var(--color-text-red)` | 回退到按钮层，一致 |
| `--astryx-badge-border-width` / `-style` / `-color` | `badge.css` | y2k `badge.base` = `1.5px` / `solid` / `color-mix(in srgb, currentColor 30%, transparent)` | `0` / `solid` / `transparent`；原来徽章无描边，一致 |

## 组件没读主题变量的地方

无新增。检查过六个主题里所有 `astryx.overrides` 之外的值，核心都有对应读取点：
`--astryx-section-padding`（`section.css` 第 23 行）、`--astryx-card-padding`（`card.css` 第 19–22 行）、
`--astryx-banner-radius`（`banner.css` 第 9 行）、输入类内边距（各 `*-input.css` / `bordered-control.css`）都在读。
`--astryx-input-{success,warning,error}-background/-foreground` 由 `field.css` 第 169–171 行读取。

有一处**存量**问题（不属于本轮）：六套主题都声明了 65 个核心样式不直接读的 token
（例如 `--astryx-color-text-blue`、`--astryx-color-background-blue`、`--astryx-banner-info-foreground`）。
其中颜色类是被主题内其它变量引用（合法），但 `--astryx-banner-*-foreground` 这一类看起来
没有被任何样式读取，Neutral 和 D1 也是同样情况。要不要清理，等总控定。
