# B4 验收报告 · 第 3 轮

结论：**不通过**。29 项里第 28 项不过，其余通过（第 27 项只记录）。

第 28 项不过的原因分两层：

1. 守护测试有洞。拿掉 `Selector.vue` 对 `layer.css` 的 import，测试仍然全绿（实现者回报说"验证过会失败"，我实测不成立）。
2. 更要紧的是，有 3 个浮层（MultiSelector、Typeahead、MoreMenu）在上游会得到文字重置，我们这边不管怎么引入都拿不到。它们既不走 `scopedProvide`，也没有直接 import `layer.css`，类名又不在 `layer.css` 的 `:where()` 列表里，所以守护测试看不到它们。另有 1 个 TimeInput 的选项浮层同样没有重置，但它在上游没有对应的浮层，只记录，不算在不过的依据里。

第 29 项通过。第 3 轮要求的两件事里，TabList、Stepper 截断做对了，子路径引入对了一部分（Popover、Dialog、TabMenu、Selector 生效，其余浮层没生效）。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B4`，分支 `sync/b4-layer`，HEAD `7c4d4c7`。第 3 轮提交是 `0b07652`、`c746a8a`、`7c4d4c7`。
- 临时文件、脚本、截图都在 `/tmp/verify-B4-r3/`，脚本和测试页都是我自己写的。
- 开始和结束时工作区 `git status` 都为空，两次一致。我临时放过 `layer/zz_*.test.ts` 和改过 4 个源文件做反证，全部已删除或 `git checkout` 还原。`dist/` 被 gitignore。
- 浏览器：每次都走 `browser-lock.mjs run --purpose B4-verify-r3` 或 `pnpm visual`，同一时刻只开 1 个，文档站只用 5172，用完已关，5172 无监听。机器上另有一个 3 天前启动的 Playwright Chromium（pid 53886，不是我起的，我没动）。
- 测试：vitest 加 `--maxWorkers=2`，测试和构建加 `env -u NODE_ENV`；unset、production、development 三种各跑一遍。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | Escape 只关最上面一层 | 过（重验） | 第 2 轮的 `check2.mjs` 原样重跑（390/1024 视口，DropdownMenu、Selector 各一遍）：第 1 次 Escape 只关菜单，第 2 次关 Dialog。全部 PASS，无报错。 |
| 2 | 点外面只关栈顶 | 过（重验） | 同上脚本，点 Dialog 内菜单外：菜单关，Dialog 还开着。 |
| 3 | 触发器不和自己打架 | 过（重验） | 关闭后每 50ms 采样 7 次全为关闭；再点一次打开。 |
| 4 | 视口内边距 | 过（重验） | 390 宽，260px 宽 Popover 右边距 24px，大于等于 16。 |
| 5 | 浮层不继承外部文字样式 | 过（重验） | 带总 `styles.css` 的页面上，Popover 内容为 `400 / 14px / 非红 / normal / none / start / normal`，行高、缩进、word-spacing、text-shadow、hyphens 都被重置。按子路径引入的情况见第 28 项。 |
| 6 | Dialog 内的浮层挂在 Dialog 里 | 过（重验） | 菜单是 `dialog` 的后代，`elementFromPoint` 命中菜单项。 |
| 7 | Toast 在 Dialog 之上 | 过（重验） | Toast 在 `dialog` 里、能点到、点关闭按钮后消失；关 Dialog 期间 Toast 一直在；退场中关 Dialog（0/40/80/120ms）和反复开关都无报错。 |
| 8 | 关闭栈测试覆盖 | 过（沿用第 2 轮） | `git diff 7b80d47 HEAD --stat -- packages/core/src/layer packages/core/src/composables packages/core/src/Dialog packages/core/src/Toast packages/core/src/Popover tests` 只列出 `layerCss.test.ts`、`scopedProvide.tabStepper.test.ts`、`scopedProvide.ts` 三个文件，`dismissStack.ts`、`useLayer.ts`、`useTouchTrigger.ts`、`mount.ts` 都没动。 |
| 9 | 反向检查 | 过（沿用第 2 轮） | 同第 8 项，`dismissStack.ts` 没动。 |
| 10 | 监听器只在栈非空时挂 | 过（沿用第 2 轮） | 同第 8 项。 |
| 11 | 并发 show/hide 有测试 | 过（沿用第 2 轮） | 同第 8 项，`useLayer.ts` 没动。 |
| 12 | `useTouchTrigger` 有测试 | 过（沿用第 2 轮） | 同第 8 项，`useTouchTrigger.ts` 没动。 |
| 13 | 视觉对比 Selector、ContextMenu | 过（重验） | `pnpm visual selector/context-menu --combos desktop-light,mobile-dark`，`ours.png` 与第 2 轮截图逐像素比（pixelmatch 阈值 0.1）：Selector desktop-light 912×513、mobile-dark 708×640，ContextMenu 同尺寸，差异像素全为 0。Selector desktop-light 对第 1 轮 BASE 截图也是 0。 |
| 14 | E3 交互契约、SSR 冒烟，名单没变长 | 过 | 在全量 vitest 里通过；`git diff 83a1665 HEAD --stat` 里没有 `known-failures.ts`、`ssr-known-failures.json`。 |
| 15 | 服务端渲染不碰 `document` | 过（重验） | `scopedProvide.ts` 新增了 css import，所以重测：`// @vitest-environment node` 下动态 import `scopedProvide`、Popover、TabList、Stepper、Dialog，再用 `renderToString` 渲染 TabList+TabMenu、Stepper+Step、Popover、Dialog，都不报错。unset 和 production 都过，临时测试已删。 |
| 16 | 台账 29 条全勾并写结论 | 过 | 工作区里的 `ledger/B4.md`：29 个 `[x]`，0 个 `[ ]`。#6457 的结论更新为 23 个 context，写了 TabList、Stepper 改为截断。（总控目录那份是原始未处理版，与第 2 轮一致。） |
| 17 | 「交给 Cx」清单 | 过（沿用第 2 轮） | `impl-2.md` 第 4 节没动。注意：本轮发现的 MultiSelector、Typeahead、MoreMenu 三个浮层的文字重置不在清单里，见第 28 项。 |
| 18 | 全量 vitest 与 `pnpm check` | 过（重验） | 三种 NODE_ENV 下都是 250 个文件、3339 条通过（第 2 轮是 248、3322，增加的是 2 个新测试文件）。`check:packages`、`lint`、`typecheck`、`lint:pkg` 退出码 0；`pnpm build`（含 `docs:build`）退出码 0。第 3 轮新增行没有 `!important`。 |
| 19 | 行数与越界 | 过 | `check:packages` 里的行数检查通过。`TabMenu.vue` 201 行，`Selector.vue` 584 行（白名单内，本轮只加 1 行，原文件已超 500）。`git diff 310dfa2 HEAD --stat` 里没有 Theme、`composables/internal`、locale、Icon。 |
| 20 | 超宽浮层两边都留内边距 | 过（沿用第 2 轮） | 第 3 轮没碰 `inlineSize.ts`、`position.ts` 和 Popover。证据同第 8 项。 |
| 21 | 文字重置覆盖所有浮层根 | 过（沿用第 2 轮，子路径情况见第 28 项） | 第 3 轮没改 `layer.css` 的选择器和各浮层根的类名，只增加了 import。 |
| 22 | 浮层内容不继承成员关系 context | 过（重验，并升级） | 第 22 项里的 TabList、Stepper 风险已由第 29 项解决。`scopedProvide.ts` 的登记现在是 23 个。其余 21 个未动。 |
| 23 | Toast 在 Dialog 打开时不跳 | 过（沿用第 2 轮） | `Toast`、`Dialog` 源码第 3 轮没动（第 8 项同一条 diff stat）。第 7 项的重验里 Toast 位置不变。 |
| 24 | 台账 #6919、#6457 与实际一致 | 过 | #6457 现在写 23 个 context，与 `scopedProvide.ts` 里 `registerLayerScopedContext` 的行数一致。但"文字重置覆盖…"那句话仍没说明 MultiSelector、Typeahead、MoreMenu 的浮层拿不到重置（见第 28 项）。 |
| 25 | 被第 3 轮碰到的 1–19 项重验 | 过 | 已重验 1–7、13、15、18、19；其余写了"沿用第 2 轮"并附 diff stat。 |
| 26 | 按子路径引入时文字重置生效 | 改由第 28 项验证 | |
| 27 | Toast 约 400ms 点不到的取舍 | 沿用第 2 轮记录，不影响结论 | 第 3 轮没改 Toast。 |
| 28 | （第 3 轮）按子路径引入时文字重置生效 | **不过** | 见下面「第 28 项展开」。 |
| 29 | （第 3 轮）TabList、Stepper 在浮层里截断 | 过 | 见下面「第 29 项展开」。 |

## 第 28 项展开

### 28a：要求的三个浮层，用构建后的 dist 实测，通过

方法：先 `env -u NODE_ENV pnpm --filter @astryx-vue/core build`。在 `/tmp/verify-B4-r3/sub` 起一个最小 Vite 页面，`node_modules/@astryx-vue/core` 软链到 `packages/core`（走 `exports` 指向的 `dist`），页面只按子路径引入组件，不引入 `styles.css`。外层 `body` 设 `font-weight:700; text-transform:uppercase; text-align:center; letter-spacing:4px; font-style:italic`。

| 浮层 | 只按子路径引入时的计算样式（字重 / 字距 / 大小写 / 对齐 / 斜体） |
| --- | --- |
| Popover 根 | `400 / normal / none / start / normal` |
| Dialog 根（`astryx-dialog astryx-layer`） | 同上 |
| TabMenu 下拉 | 同上 |
| Selector 列表 | 同上 |

页面无控制台报错。对比第 2 轮：同样的页面当时 Popover、Dialog 都是 `700 / 4px / uppercase / center / italic`。

dist 检查：

- `dist/scopedProvide-*.js`、`dist/Selector-*.js`、`dist/TabList-*.js`、`dist/Chat-*.js` 里都有 `import "../styles/layer.css"`。
- `Dialog-*.js` 的 import 链指向 `scopedProvide-*.js`。
- `packages/core/styles/layer.css` 存在，`package.json` 的 `files` 含 `styles`，会随包发布。

### 28b：守护测试的反证，有洞

在 B4 工作区里每次改一个文件，跑 `vitest run layerCss.test.ts`，然后 `git checkout` 还原。

| 拿掉什么 | 测试结果 |
| --- | --- |
| `scopedProvide.ts` 的 `layer.css` import | 8 条失败（`.astryx-layer`、`.astryx-popover`、`.astryx-tooltip` 等 + toast 视口） |
| `Dialog.vue` 对 `scopedProvide` 的 import | 失败（`.astryx-layer` 那条） |
| `Popover.vue` 对 `LayerContentBoundary` 的 import | 失败（`.astryx-popover` 那条） |
| `ToastViewport.vue` 对 `scopedProvide` 的 import | 失败（toast 视口那条） |
| `TabMenu.vue` 的 `layer.css` import | 失败（`.astryx-tab-menu-dropdown` 那条） |
| `ChatTriggerMenu.vue` 的 `layer.css` import | 失败（`.astryx-popover` 那条） |
| **`Selector.vue` 的 `layer.css` import** | **没有失败，11 条全过** |

`Selector.vue` 没拦住的原因：`Selector.vue` 还 import 了 `BottomSheet.vue`，沿 `BottomSheet` → `BottomSheetPanel` → `scopedProvide.ts` 这条链也能走到 `layer.css`，所以测试把它判为可达。但这是一条碰巧存在的链：它的列表浮层 `.astryx-selector-listbox` 本身并不在 `BottomSheetPanel` 里，哪天 `Selector` 不再用 `BottomSheet`，这条链就断了，测试也不会报。测试只检查'能不能走到'，不检查'是不是这个浮层自己直接依赖'。

`impl-3.md` 写的"把 Selector、TabMenu 的 import 拿掉后，测试会失败（验证过）"，Selector 这半句我没复现：拿掉后测试仍是 11 条全过。

### 28c：还有浮层拿不到文字重置，守护测试也看不到

把 `layer.css` 的重置规则当标准，我又在同一个最小页面里测了几个不走 `scopedProvide` 的浮层。它们的根类名不在 `layer.css` 的 `:where()` 列表里：

| 浮层 | 根类名 | 只按子路径引入时的计算样式 | 在页面里加上总 `styles.css` 后 | 上游 v0.7.1 |
| --- | --- | --- | --- | --- |
| MultiSelector 列表 | `.astryx-multi-selector-listbox` | `700 / 4px / uppercase / center / italic`（全部继承外层） | 同样继承，没有改善 | 用 `usePopover`（由 `useLayer` 渲染，套 `layerTextReset`），会重置 |
| Typeahead 列表 | `.astryx-typeahead-listbox` | 同上，全部继承 | 同上 | 用 `usePopover`，会重置 |
| TimeInput 选项 | `.astryx-time-input-options` | 同上，全部继承 | 同上 | **没有对应浮层**：`popover` 档位在上游退化成文本输入，所以只记录 |
| MoreMenu 面板 | `.astryx-more-menu__panel` | 同上，全部继承 | 同上 | 是 `DropdownMenu` 的封装，菜单走 `useLayer`，会重置 |

关键事实：这些浮层不只是"子路径引入时没有"，**加了总 `styles.css` 也没有**，因为它们的类名根本不在 `layer.css` 选择器里，也没有套 `.astryx-layer`，也没有走 `LayerContentBoundary`。我用静态 import 链分析（临时测试，已删）确认，下面这些文件到不了 `layer.css`：`TimeField.vue`、`BaseTypeahead.vue`、`Tokenizer.vue`、`MoreMenuPanel.vue`、`NavDisclosure.vue`、`TableRowMenu.vue`、`ButtonTooltip.vue`、`BottomSheetSwitcher.vue` 都到不了 `layer.css`（`MultiSelector` 到得了，是因为它 import 了 `BottomSheet`，但根类名没有被重置规则命中）。

另外 Tokenizer、NavDisclosure、PowerSearch 的列表浮层同属一类（`.astryx-typeahead-listbox`、`.astryx-nav-disclosure__panel`），没有逐个实测，按同样的类名判断也不在 `layer.css` 里。

这些不是第 3 轮引入的问题，但它们让第 28 项"守护测试要真的能拦住问题"的要求落空：守护测试只看 `layer.css` 选择器里已经列出的类名，类名不在列表里的浮层既不会被重置，也不会被测试发现。

### 对照上游

上游 v0.7.1 的 `layerTextReset` 用在两类地方：`useLayer` 的两个渲染器（所有走 `useLayer`/`usePopover` 的浮层自动带上）和 Dialog、Lightbox、MobileNav、BottomSheetPanel、ToastViewport 的内容根。我用 `git grep` 查了上游源码：

- Typeahead：`BaseTypeahead.tsx` 里 import 了 `usePopover`，会重置。
- MultiSelector：文件头写 `Uses ... usePopover`，并 import 了 `useKeepLayerOpenProps`，会重置。
- Tokenizer：`useLayer({mode: 'context'})`，会重置。这个我们没有实测，按类名判断同 Typeahead。
- MoreMenu：`MoreMenu.tsx` 是 `DropdownMenu` 的封装，菜单走 `useLayer`，会重置。
- TimeInput：上游的 `TimeInput.tsx` 没有 import 任何 Layer、Popover，`popover` 档位注释写"no distinct popover exists for TimeInput"。所以我们的 `.astryx-time-input-options` 在上游没有对应物，这一行我不把它算进不一致。

所以 MultiSelector、Typeahead、MoreMenu（以及按类名推断的 Tokenizer）这几个浮层，在上游会重置，我们这边不会：**用户能感受到的行为和上游不一致**。

这些浮层原本在 `impl-2.md` 第 4 节"交给 Cx"清单里被交给了 C3（Typeahead、MultiSelector、Tokenizer）、C6（MoreMenu）。但那份清单只写了"加边界"和"`to="body"` 改挂载点"，没有写"加文字重置"。所以这些节点即使照做，也不会补上文字重置。

### 怎么改（只给方向）

- 最小做法：把 `.astryx-multi-selector-listbox`、`.astryx-typeahead-listbox`、`.astryx-more-menu__panel`（以及 Tokenizer、PowerSearch 共用的 `.astryx-typeahead-listbox`）`layer.css` 的 `:where()` 列表，并让各自组件 import `layer.css`。
- 更稳的做法：浮层根统一加 `.astryx-layer` 类，并由守护测试检查"所有 `Teleport` 里的浮层根都带 `.astryx-layer` 或在 `layer.css` 名单里"，而不是只检查名单里已有的类名。
- 如果决定这些交给 C3、C6，就要在 `impl-3.md` 或台账里明确写出"文字重置"这一条，并写到能照着做的程度。

## 第 29 项展开

### 29a：Popover 里的 Tab 和 Step，不再读到外面的状态

在最小页面里搭 verify-2 第 22 项的两个场景，用构建后的 dist：

| 场景 | 第 2 轮结果 | 第 3 轮结果 |
| --- | --- | --- |
| `TabList size=lg` 里放 Popover，Popover 内容里放 `Tab` | Tab 的 class 是 `astryx-tab--size-lg astryx-tab--selected`，读到了外面的状态 | 抛 `useTabListContext must be used within TabList. Wrap your Tab in <TabList>.`，Vue 警告 `Unhandled error during execution of setup function at <AstryxTab>` |
| `Stepper activeStep=3 vertical` 里放 Popover，Popover 内容里放 `Step` | Step 是 `data-progress="completed" data-orientation="vertical"` | 抛 `useStepperContext must be used within Stepper. Wrap your Step in <Stepper>.` |
| 对照：Popover 内容里自己放 `<TabList size="sm"><Tab/></TabList>` | | 正常：`astryx-tab--size-sm astryx-tab--selected`，无报错 |

报错文案和上游 `useTabListContext`、`useStepperContext` 一致。

一个值得知道的细节：Popover 的内容用 `v-show`，关着的时候也会渲染，所以这个错误是页面一挂载就抛的，不用等用户点开。这和上游"没有 provider 就报错"的做法一致。

### 29b：单元测试和反证

- `scopedProvide.tabStepper.test.ts` 6 条，三种 NODE_ENV 下都通过。
- 反证：去掉 `scopedProvide.ts` 里 `tabListContextKey`、`stepperContextKey` 两行登记，测试 3 条失败（登记检查、Tab 报错、Step 报错），还原后通过。

### 29c：文档站实测 TabMenu（端口 5172，vitepress dev）

在 `/en/components/tab-list/` 的"溢出菜单"示例上：

| 步骤 | 结果 |
| --- | --- |
| 初始 | 触发器 "More"，`aria-expanded=false`，选中 Home |
| 点触发器 | 下拉出现，三项 Analytics、Reports、Billing，都是 `aria-checked=false` |
| 选 Billing | 下拉关闭；触发器变 "Billing"；TabList 里选中项是 Billing |
| 再点触发器 | Billing 的 `aria-checked=true`，其余 false |
| 选 Reports | 触发器变 "Reports"，选中同步 |
| 点同一个 TabList 里的第一个 Tab | 选中回到 Home，触发器回到 "More" |
| 键盘：聚焦触发器，Enter 打开，ArrowDown，Enter | 选中 Reports，下拉关闭 |
| 打开后点页面外 | 下拉关闭 |

控制台无报错。

### 29d：所有 TabList、Stepper 文档页的控制台

逐页打开并滚动到底，收集 `console.error`、`pageerror` 和 Vue 警告：

| 页面（en 和 zh 各一遍） | Tab 数 | Step 数 | 报错 |
| --- | --- | --- | --- |
| tab-list | 20 | 0 | 无 |
| tab | 3 | 0 | 无 |
| tab-menu | 6 | 0 | 无 |
| stepper | 0 | 43 | 无 |
| step | 0 | 12 | 无 |

我另外静态检查了所有演示文件和 playground 页面：每个 `Tab`、`Step` 都在各自的 `TabList`、`Stepper` 之下（`login-sso.vue` 里的 `Step` 是 TypeScript 类型名，不是组件）。没有"Tab 或 Step 不放在 provider 下"的用法，所以新加的报错不会让文档示例崩溃。

## 第 27 项（只记录）

沿用第 2 轮的判断，第 3 轮没改 Toast，无新增。

## 其他观察（不影响结论）

- 文档站启动时没有遇到实现者回报里提到的 vitepress 动态导入 MIME 报错；我这边所有文档页控制台都是干净的。
- `Tab`、`Step` 现在在 TabList、Stepper 外面使用会直接报错，之前是静默用默认值。这和上游一致，是有意的行为变化。
