# B1 主题系统与 token · 第 2 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B1`，分支 `sync/b1-theme`（已 rebase 到最新的 `swarm-tree`，依赖已重装）。只在本地提交，没有推送。
- 提交（基于 `ab8945c`，第 1 轮最后一个提交）：
  - `ee0ee34` fix(theme): MediaTheme 的 mode=auto 在颜色模式切换后重新测量
  - `c05e586` feat(theme): 派生变量表补上 chat、progress-bar-mark、dialog 和 bottom-sheet 的内边距
  - `6e4de53` docs(theme): 说明环境适配规则里的变量会盖过外层样式表和内联值
  - `5dc8bff` docs(ledger): 把可扩展轴安全回退那条台账写到具体 C 节点
  - `435cfef` chore: 补上 lint 要求的大括号，重新生成 cli 目录

## 1. 做了什么

### 第 1 件：MediaTheme `mode="auto"` 跟着颜色模式重新测量

改了 `packages/core/src/Theme/useAutoMediaMode.ts`（150 行），补了 `MediaTheme.test.ts` 的一条用例。

1. **缓存键**：原来只有一个 `lastBackdrop`（只看背景色的 `r,g,b`）。现在是一个 `MeasurementKey`：`backdrop` + 当前主题的 `mode` + `useTheme().tokens` 的引用。三者都没动，并且已经测到过结果，才跳过探针。
   - `tokens` 是 `computed`，每算一次给一个新对象；主题换了或者模式换了它都会重算，所以「切换主题」和「切换模式」都会让缓存失效。上游 `useAutoMediaMode` 的缓存键就是「背景色 + tokens 引用」，这一处和上游一致。
2. **触发条件**：新增 `watch([mode, tokens], measure, { flush: 'post' })`。用 `post` 是因为模式一变，`light-dark()` 的解析结果和 `color-scheme` 都要等新的行内样式落到 DOM 上才读得对；`post` 保证在 DOM 更新之后测。
   - 原来的三条触发保留不变：挂载时、组件每次 update、父元素 `style`/`class` 变化（MutationObserver）。
3. **顺带放宽了一处判断**（也是这次必须改的，见第 3 节第 1 条）：`resolveBackdrop` 里「有没有背景图」的判断从「等于 `none`」放宽成「`none`、`initial`、空字符串都算没有背景图」。浏览器里未设置时永远是 `none`，行为不变。
4. `mode` 从 `useTheme()` 拿（`MediaTheme` 已经在 `Theme` 的 provide 作用域里），没有再复制一份 `readColorMode` 的逻辑。

### 第 2 件：派生变量表补齐

改了 `packages/core/src/Theme/derivedVars.ts`（190 行），`defineTheme.test.ts` 加了一条用例。

`DERIVED_VARS` 加了三项，另外给 `dialog` 补了内边距：

| 挂点 | 属性 | 写到哪 |
| --- | --- | --- |
| `chat`（新增） | `borderRadius` | `--_chat-composer-radius` |
| `chat`（新增） | `padding` | `--_chat-composer-padding` |
| `progress-bar-mark`（新增） | `width` | `--_progressbar-mark-width` |
| `progress-bar-mark`（新增） | `height` | `--_progressbar-mark-height` |
| `dialog`（补） | `padding` | `expand: 'container'` → `--astryx-dialog-padding` |
| `bottom-sheet`（新增） | `padding` | `expand: 'container'` → `--astryx-bottom-sheet-padding` |

- 照现有 5 个组件的写法加，没有引入新机制。
- 上游 `progress-bar-mark` 的 width/height 带 `replaces: true`（只写变量、不写属性）。我们没有这个开关，会把 `width: 4px` 和 `--_progressbar-mark-width: 4px` 同时写出来。因为 `progress-bar.css` 里 `width: var(--_progressbar-mark-width, 2px)`，两条规则值相同，页面结果一样，所以没有为这一个开关改数据结构。
- 七套主题里没有任何一份写过 `dialog` 或 `bottom-sheet` 的 `padding`，所以这次改动不会改变现有主题的外观。

### 第 3 件：文档补一句

- `apps/docs/docs/zh/themes/extending.md`：在 `adaptations` 的列表末尾加一条：适配规则里的变量在条件成立时带着 `!important` 写进样式表，会盖过 `Theme` 外层元素上同名变量的样式表声明和普通内联值；想覆盖就写在子元素上，或者自己也用 `!important`。
- `apps/docs/docs/en/themes/extending.md`：同一句话的英文版。
- 顺手把「派生变量覆盖哪些组件」那句清单补全（加上 `bottom-sheet`、`chat`、`progress-bar-mark`），否则文档和第 2 件改完的表对不上。
- `catalog.json` 里存了文档正文，文档改完要重新生成，见 `435cfef`。

### 第 4 件：台账 `d30591054` 落到具体 C 节点

改了 `.agents-work/upstream-sync/ledger/B1.md` 里这一条。看上游提交的内容：它加了一条 INV14——一个属性轴只有「是视觉轴，且缺省值有一个不依赖当前主题的安全回退」时，才允许主题扩值；并在规范里点名 `Heading.type` 合格、`Icon.size` 不合格，以及 `Pagination.variant`、`Banner.container` 目前是敞口的结构轴、要关掉。

对照 `ROADMAP.md` 的节点分工，写成：

- **C16**：`Heading.type` 合格（`Heading.level` 提供回退），要补「无匹配规则时的回退」组件测试；`Icon.size` 不合格，保持关闭。
- **C13**：`Pagination.variant` 要关。
- **C15**：`Banner.container` 要关。
- 主题侧不需要改：`type:*` 这类键本来就能编译成 `[data-type]` 选择器，不认识的轴值不会在没有回退的情况下生效。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| packages/core/src/Theme/useAutoMediaMode.ts | 150 | 测量背景并选表面；缓存键含模式与 token |
| packages/core/src/Theme/derivedVars.ts | 190 | 派生变量表、容器内边距展开 |
| packages/core/src/Theme/MediaTheme.test.ts | 126 | 媒体表面行为，含模式切换重测 |
| packages/core/src/Theme/defineTheme.test.ts | 203 | defineTheme 输出，含派生变量展开 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #5299 auto 重测（缓存键） | `lastRef` 存 `{background, tokens}`，背景或 tokens 引用变了才重新测量 | 缓存键存 `{backdrop, mode, tokens}`，三者任一变化就重测 | 结果一致；多存了 `mode` 只是多一道保险 |
| #5299 auto 重测（触发） | 没有依赖数组，每次渲染后都测 | 保留 onUpdated + MutationObserver，另外加 `watch([mode, tokens])`（post） | 模式切换后一定测，不依赖「MediaTheme 恰好重渲染」 |
| 测量时机 | `useIsomorphicLayoutEffect`（DOM 更新后、绘制前） | `watch(..., { flush: 'post' })` 加 onUpdated，同样在 DOM 更新后 | 读到的都是新模式的行内样式 |
| 派生变量表 | `*.doc.mjs` 的 `derived` 字段，`ProgressBar` 的 width/height 带 `replaces: true` | `DERIVED_VARS` 表，没有 `replaces`，同时写属性和变量 | 样式表读的是变量，两条值相同，渲染一致 |
| `dialog` / `bottom-sheet` 内边距 | `{property: 'padding', expand: 'container'}` | 同一写法，输出 `--astryx-dialog-padding` / `--astryx-bottom-sheet-padding` | 输出变量名相同，内层读的也是这两个名字 |

## 3. 和计划不一样的地方

1. **`resolveBackdrop` 的「没有背景图」判断放宽了**：原来是 `backgroundImage !== 'none'` 就判为不可测。测试环境（happy-dom）里未设置的 `backgroundImage` 读到的是 `initial` 而不是 `none`，于是所有 auto 测量在测试里都走 fallback，写不出「切换模式后值变了」的断言。现在 `none`、`initial`、空字符串都算没有背景图。浏览器里只会是 `none`，所以线上行为不变；好处是自动测量这一路终于能在单测里被真正覆盖到。这是本轮唯一一处「为了让行为可测而改产品代码」，改动 1 行，请验收者留意。
2. **缓存键里同时放了 `mode` 和 `tokens`**：计划只要求放颜色模式。多放 `tokens` 是为了让「换主题（模式不变）」也重测，和上游一致，成本是一次引用比较。
3. **`progress-bar-mark` 没有实现 `replaces`**：见第 1 节第 2 件，理由是不改数据结构的前提下结果相同。
4. **顺手改了文档里的派生变量清单**：计划只要求补 `!important` 那一句，但清单原本列的是旧表里的 5 个组件，不改会和实际行为对不上。
5. **多了一个 `chore` 提交**：`eslint` 要求多行 `if` 带大括号（`antfu/curly`），改完又发现 `catalog.json` 因为文档正文变了需要重新生成，两件都是机械修补，合在一个提交里。

## 4. 台账处理

- 本轮只动了 `d30591054` 一条，见第 1 节第 4 件。其余 97 条结论不变，仍然是 `- [x]`，98 条全有「结论：」。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 单点测试 `pkgs/core/src/Theme` + `themes` | 过 | 12 个文件、178 条（第 1 轮是 177 条，新增 1 条派生变量用例；模式切换那条也在里面） |
| 2 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`（全量） | 过 | 245 个文件、3360 条 |
| 3 | `NODE_ENV=production pnpm vitest run --maxWorkers=2`（全量） | 过 | 245 个文件、3360 条，和上一条相同 |
| 4 | `env -u NODE_ENV pnpm check`（test 换成 vitest --maxWorkers=2） | 过 | `check:packages` 0（含 catalog 一致、行数检查通过）、`lint` 0、`typecheck` 0、`test` 0、`build` 0、`lint:pkg` 0 |
| 5 | 浏览器：MediaTheme auto 两个方向 | 过 | 见下 |
| 6 | 浏览器：派生变量真的到内层 | 过 | 见下 |
| 7 | 行数 | 过 | 改动的源码最大 190 行（`derivedVars.ts`），`check-line-limit` 通过 |

浏览器结果（文档站 5171 端口，`node scripts/swarm/browser-lock.mjs run --purpose B1-r2 -- …`，同一时刻只开 1 个）：

- **MediaTheme auto**：页面是验收者那份 `vt2.md`（深底 rgb(10,19,23) 和浅底 rgb(250,250,250) 各包一个 `mode="auto"`），临时复制到 `apps/docs/docs/en/vt2.md`，跑完已删除，没有提交。

  | 步骤 | m-dark | m-light | Theme 的 colorScheme |
  | --- | --- | --- | --- |
  | 浅色挂载 | `dark` | `off` | light |
  | 切到深色 | `off` | `light` | dark |
  | 再切回浅色 | `dark` | `off` | light |
  | 深色挂载（`?dark`） | `off` | `light` | dark |
  | 切到浅色 | `dark` | `off` | light |
  | 再切回深色 | `off` | `light` | dark |

  中间两列的 `off` 表示 `data-astryx-media` 属性不存在（= 不需要媒体上下文），和直接用该模式挂载的结果完全一致。
- **派生变量**：临时页面 `apps/docs/docs/en/vt3.md`（已删除）用 `defineTheme({ components: { dialog: { base: { padding: '24px' } }, 'bottom-sheet': { base: { padding: '18px' } } } })`。读回：`--astryx-dialog-padding` = `24px`，`.astryx-dialog__inner` 的 `padding` = `24px`；`--astryx-bottom-sheet-padding` = `18px`，`.astryx-bottom-sheet__content` 的 `padding` = `18px`。第 1 轮验收里「没有在浏览器里实测」的那一条，这次实测过了。
- 结束后 5171 没有监听；临时页面都删了，`git status --short` 是空。
- 另：机器上有一个 2 天前就在跑的 Chrome for Testing 进程（PID 53886，不是我起的，我也没动它）。我自己的浏览器会话都已关闭，锁已释放。

## 6. 拿不准的地方

1. **第 3 节第 1 条那个放宽**是这轮唯一一处产品代码为可测性让步的地方。如果验收者认为不该动，可以把它回退，代价是 `MediaTheme` 的模式切换测试只能写成「函数被调用了」，写不出「值变了」。（回退以后新加的那条用例会失败，说明它确实在测东西。）
2. **`progress-bar-mark` 的 `replaces` 语义**没实现，见第 3 节第 3 条。如果以后有组件依赖「主题只改变量、不写属性」，需要在 `DerivedVarEntry` 上加一个字段，属于新的机制，不在这轮范围。
3. **`chat` 挂点的实际效果**要等 C 节点接入。我们的 `chat.css` 把 `--_chat-composer-radius` / `--_chat-composer-padding` 写在输入区自己的规则里（带默认值），主题规则写在 `.astryx-chat` 上。变量继承下来以后会不会被输入区自己的默认值挡住，取决于两边的层叠顺序；这次只按要求把表补齐、用 `registry.test.ts` 守住名字，没有在浏览器里验证 chat 的实际渲染。
4. 第 1 轮遗留、这轮没动的：`var(--astryx-spacing-N, Npx)` 的 px 回退值在没引入 themes 包时不跟随根字号；`radio` 旧名仍会命中 Radio 的 label；各 C 节点补齐 `data-*` 后要跟着补派生变量表和删修饰类选择器。
