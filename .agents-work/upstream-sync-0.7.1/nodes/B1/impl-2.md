# B1 主题系统与 token · 第 2 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B1`，分支 `sync/b1-theme`（已 rebase 到最新的 `swarm-tree`，依赖已重装）。只在本地提交，没有推送。
- 提交（基于 `ab8945c`，第 1 轮最后一个提交）：
  - `ee0ee34` fix(theme): MediaTheme 的 mode=auto 在颜色模式切换后重新测量
  - `c05e586` feat(theme): 派生变量表补上 chat、progress-bar-mark、dialog 和 bottom-sheet 的内边距
  - `6e4de53` docs(theme): 说明环境适配规则里的变量会盖过外层样式表和内联值（这句话在第 5 件里改掉了）
  - `5dc8bff` docs(ledger): 把可扩展轴安全回退那条台账写到具体 C 节点
  - `435cfef` chore: 补上 lint 要求的大括号，重新生成 cli 目录
  - `2e629da` refactor(theme)!: 根 token 写进主题样式表，去掉所有 !important（第 5 件，也是这轮最大的一处改动）

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

- `apps/docs/docs/zh/themes/extending.md` 和 `en/themes/extending.md`：在 `adaptations` 的列表末尾加一条，说明适配规则怎么被覆盖。
- 第 5 件把 `!important` 去掉以后，这句话也重写了，见下面第 5 件的「文档」。
- 顺手把「派生变量覆盖哪些组件」那句清单补全（加上 `bottom-sheet`、`chat`、`progress-bar-mark`），否则文档和第 2 件改完的表对不上。
- `catalog.json` 里存了文档正文，文档改完要重新生成，见 `435cfef`。

### 第 4 件：台账 `d30591054` 落到具体 C 节点

改了 `.agents-work/upstream-sync-0.7.1/ledger/B1.md` 里这一条。看上游提交的内容：它加了一条 INV14——一个属性轴只有「是视觉轴，且缺省值有一个不依赖当前主题的安全回退」时，才允许主题扩值；并在规范里点名 `Heading.type` 合格、`Icon.size` 不合格，以及 `Pagination.variant`、`Banner.container` 目前是敞口的结构轴、要关掉。

对照 `ROADMAP.md` 的节点分工，写成：

- **C16**：`Heading.type` 合格（`Heading.level` 提供回退），要补「无匹配规则时的回退」组件测试；`Icon.size` 不合格，保持关闭。
- **C13**：`Pagination.variant` 要关。
- **C15**：`Banner.container` 要关。
- 主题侧不需要改：`type:*` 这类键本来就能编译成 `[data-type]` 选择器，不认识的轴值不会在没有回退的情况下生效。

### 第 5 件：去掉 `!important`

改了 `themeCss.ts`（127 行）、`componentStyles.ts`（199 行）、`Theme.vue`（60 行）、`themeStyle.ts`（56 行）、`defineTheme.ts`，重写了相关测试，改了文档。细节见下面单独一节，因为它是这轮唯一改结构的一件事。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| packages/core/src/Theme/themeCss.ts | 127 | 拼出整张样式表：根 token、根组件规则、环境规则、媒体表面 |
| packages/core/src/Theme/componentStyles.ts | 199 | 挂点校验、选择器、声明块 |
| packages/core/src/Theme/themeStyle.ts | 56 | 组件别名桥接（表面用） |
| packages/core/src/Theme/Theme.vue | 60 | 主题外层元素，只留 `color-scheme` 和类名/属性 |
| packages/core/src/Theme/useAutoMediaMode.ts | 150 | 测量背景并选表面；缓存键含模式与 token |
| packages/core/src/Theme/derivedVars.ts | 190 | 派生变量表、容器内边距展开 |
| packages/core/src/Theme/Theme.test.ts | 161 | 主题挂载、嵌套、SSR、字号 |

## 2. 去掉 `!important`

### 上游怎么处理同名主题

- `Theme.tsx` 里注入样式表的 hook 是 `useThemeStyleInjection`。它维护一个模块级的 `Set`，键是 `astryx-theme-${theme.name}`：**同一个主题名的 CSS 在整篇文档里只注入一次**，后出现的同名 `Theme` 直接复用，连生成都不做。
- 生成的 CSS 用 `themeScopeStart(name)` = `[data-astryx-theme="<name>"]` 做 `@scope (...)` 的作用域起点，`to ([data-astryx-theme])` 作为边界；根 token 写成 `:scope { --token: value }` 放在 `@layer astryx-theme` 里。
- 所以上游**不支持「同名不同值」**：同名就是同一份 CSS，两份配置会共用先到的那一份。它靠的是主题名，不是实例。
- 每个 `Theme` 实例都往 `documentElement` 上同步 `data-astryx-theme`（以及 `data-theme`），`@scope` 才能照到 portal 出去的内容。

### 我选了哪种方案

**照上游：作用域按主题名，不引入实例 id。** 理由：

1. 需求原话是「上游有对应行为，就照上游做」。上游的行为就是按名去重，同名同值。
2. 实例 id（`useId()` + `data-astryx-theme-scope`）会和 `@scope ... to ([data-astryx-theme])` 的边界语义打架：边界要的是「嵌套主题就此停住」，而边界选择器只能按名写；一旦作用域改用实例 id，外层主题的组件规则就会漏进内层同名主题里，除非再维护一套 id 的父子关系。收益只是「同名不同值」，代价是把上游那套作用域模型拆掉。
3. 第 1 轮那个「同名两个 Theme 各用各的值」的能力，是内联写法的副产品，从来没有写进文档；上游也没有。

具体做法：

- 根 token（含组件别名、局部 token、语法配色）变成样式表里的**第一条**规则：`:scope.astryx-theme { … }`，位置在根组件规则之前。
- 环境适配的 token 写在后面同选择器的块里（`@media … { @scope … { :scope.astryx-theme { … } } }`），靠层叠顺序赢，不靠 `!important`。
- `Theme.vue` 的 `:style` 只剩 `color-scheme`，用户传进来的 `attrs.style` 照旧排在最后。
- token 选择器保留 `.astryx-theme`：`<html>` 也会带最外层主题名，`@scope` 会把它当成作用域起点。只写 `:scope` 的话，token 会写到 `<html>` 上，`Theme` 只包住页面一部分时会把其余部分一起染色。带 `.astryx-theme` 就只落在真正的主题外层元素上，组件规则照旧够得到 portal。
- `compileThemeCss` 多收一个 `syntax`，把语法配色也放进同一张表（原来它是内联的一部分）；`themeStyle.ts` 里那个 `themeStyle()` 函数随之删掉，只留 `bridgeComponentTokens` / `bridgeSurfaceTokens`。
- SSR：样式表一直是由 `ThemeStyle` 作为 `<style>` 渲染在 Theme 元素里的，本来就在 HTML 里，现在连根 token 也在里面，所以首屏就是对的，不会先闪一下默认色。`Theme.test.ts` 的 SSR 用例新加了断言：SSR 出来的 HTML 里同时有 `:scope.astryx-theme {` 和 `--astryx-color-accent: #123456;`。
- `grep -rn '!important' packages/core packages/themes`（除测试文件）现在是 0，连注释里的这个词都改掉了。

### 测试

- `adaptations.test.ts`：断言根 token 块和适配块用的是同一个选择器、根块在前、适配块在后、整张表里没有 `!important`。用例名从「beat the inline root values only while the condition matches」改成「win over the root token by source order, not by !important」。
- `localTokens.test.ts`：局部 token 的根值和适配值顺序也照这个改。
- `Theme.test.ts`：内联断言改成读 `<style>` 的文本；新增「外层元素上没有内联 `--astryx-*`」的断言。
- 真实层叠（happy-dom 不跑 `@scope` 也不跑媒体查询，只能测生成结果）用 Chromium 实测，见第 5 节。

### 文档

`apps/docs/docs/{zh,en}/themes/extending.md` 里那条改成：

> 规则里的变量排在根 token 后面，选择器和根 token 一样，所以条件成立时按层叠顺序盖过根值，没有用 `!important`。想覆盖它，就用更具体的选择器（比如带上外层元素的 id 或 class），或者把这行覆盖写在没放进 `@layer` 的样式里——不分层的样式总是赢过分层里的。

## 3. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #5299 auto 重测（缓存键） | `lastRef` 存 `{background, tokens}` | 缓存键存 `{backdrop, mode, tokens}` | 结果一致；多存 `mode` 只是多一道保险 |
| #5299 auto 重测（触发） | 无依赖数组，每次渲染后都测 | onUpdated + MutationObserver + `watch([mode, tokens])`（post） | 模式切换后一定测，不依赖「MediaTheme 恰好重渲染」 |
| 根 token 放哪 | `:scope { … }` 写在 `@layer astryx-theme` 的样式表里，不写内联 | `:scope.astryx-theme { … }` 写在 `@layer astryx.overrides` 的第一条 | 都在样式表里，用户的高优先级规则能压过 |
| 适配规则怎么赢 | 排在根块之后，同选择器，按源码顺序 | 同一写法，`@media` 里再 `@scope`，同样排在后面 | 层叠行为一致，且都没有 `!important` |
| 同名主题 | 按主题名去重，一份 CSS | 按主题名作用域；每个 `Theme` 各渲染一份，内容相同 | 同名同值；第 1 轮那个「同名不同值」的能力不再支持 |
| 派生变量表 | `*.doc.mjs` 的 `derived` 字段，`ProgressBar` 的 width/height 带 `replaces` | `DERIVED_VARS` 表，无 `replaces`，同时写属性和变量 | 样式表读的是变量，两条值相同，渲染一致 |
| `dialog` / `bottom-sheet` 内边距 | `{property: 'padding', expand: 'container'}` | 同一写法 | 输出变量名相同，内层读的也是这两个名字 |

## 4. 和计划不一样的地方

1. **`resolveBackdrop` 的「没有背景图」判断放宽了**：原来是 `backgroundImage !== 'none'` 就判为不可测。测试环境（happy-dom）里未设置的 `backgroundImage` 读到的是 `initial` 而不是 `none`，于是所有 auto 测量在测试里都走 fallback，写不出「切换模式后值变了」的断言。现在 `none`、`initial`、空字符串都算没有背景图。浏览器里只会是 `none`，线上行为不变。这是本轮唯一一处「为了让行为可测而改产品代码」，改动 1 行，请验收者留意。
2. **缓存键里同时放了 `mode` 和 `tokens`**：计划只要求放颜色模式。多放 `tokens` 是为了让「换主题（模式不变）」也重测，和上游一致，成本是一次引用比较。
3. **`progress-bar-mark` 没有实现 `replaces`**：见第 1 节第 2 件，理由是不改数据结构的前提下结果相同。
4. **顺手改了文档里的派生变量清单**：计划只要求补一句，但清单原本列的是旧表里的 5 个组件。
5. **同名主题不再各用各的值**（第 5 件带来的行为变化）：这是照上游做的结果，写进上面第 2 节。如果验收者认为必须保留，就需要改成实例作用域，那时 `@scope` 的嵌套边界也要跟着换方案，属于新一轮的设计。
6. **多了一个 `chore` 提交**：`eslint` 要求多行 `if` 带大括号（`antfu/curly`），改完又发现 `catalog.json` 因为文档正文变了需要重新生成，两件都是机械修补，合在一个提交里。
7. **第 5 件是总控在本轮中途追加的**，优先级高于前面四件，但它排在最后提交，因为前面四件的测试都建立在旧写法上、能先跑通先落袋。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 单点测试 `pkgs/core/src/Theme` + `themes` | 过 | 12 个文件、178 条 |
| 2 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`（全量） | 过 | 245 个文件、3360 条 |
| 3 | `NODE_ENV=production pnpm vitest run --maxWorkers=2`（全量） | 过 | 245 个文件、3360 条，和上一条相同 |
| 4 | `env -u NODE_ENV pnpm check`（test 换成 vitest --maxWorkers=2） | 过 | `check:packages` 0（catalog 一致、行数检查通过）、`lint` 0、`typecheck` 0、`test` 0、`build` 0（packages + docs）、`lint:pkg` 0 |
| 5 | `grep -rn '!important' packages/core packages/themes`（除测试） | 过 | 0 处（含 `dist/`，重新 build 之后再查的） |
| 6 | 浏览器：MediaTheme auto 两个方向 | 过 | 见下 |
| 7 | 浏览器：派生变量真的到内层 | 过 | 见下 |
| 8 | 浏览器：层叠（适配 / 用户覆盖 / 嵌套 / 并列） | 过 | 见下 |
| 9 | 默认外观：Button、Card、Dialog 的前后像素差 | 过 | 12 个组合全部 0 px，见下 |
| 10 | 行数 | 过 | 改动的源码最大 199 行（`componentStyles.ts`），`check-line-limit` 通过 |

浏览器核验都用 `node scripts/swarm/browser-lock.mjs run --purpose B1-r2 -- …`，文档站只用 5171 端口，同一时刻只开 1 个；临时页面跑完已删除，`git status --short` 是空。

**MediaTheme auto**（验收者那份 `vt2.md`，深底 rgb(10,19,23) 和浅底 rgb(250,250,250) 各包一个 `mode="auto"`）：

| 步骤 | m-dark | m-light | Theme 的 colorScheme |
| --- | --- | --- | --- |
| 浅色挂载 | `dark` | `off` | light |
| 切到深色 | `off` | `light` | dark |
| 再切回浅色 | `dark` | `off` | light |
| 深色挂载（`?dark`） | `off` | `light` | dark |
| 切到浅色 | `dark` | `off` | light |
| 再切回深色 | `off` | `light` | dark |

`off` 表示 `data-astryx-media` 不存在。第 5 件改完后又跑了一遍，结果相同（token 从内联搬到样式表以后，测量读到的颜色没变）。

**派生变量**：临时页面用 `defineTheme({ components: { dialog: { base: { padding: '24px' } }, 'bottom-sheet': { base: { padding: '18px' } } } })`。读回：`--astryx-dialog-padding` = `24px`，`.astryx-dialog__inner` 的 `padding` = `24px`；`--astryx-bottom-sheet-padding` = `18px`，`.astryx-bottom-sheet__content` 的 `padding` = `18px`。

**层叠**（临时页面里 8 个面板，主题 `adapt-check` 的根值是 `--spacing-4: 16px`，适配规则在 `width < md` 时写 `12px`；窄屏用 400px，宽屏用 900px）：

| 面板 | 是什么 | 宽 900 | 窄 400 | 结论 |
| --- | --- | --- | --- | --- |
| `t1` | 只有主题 | 16px | 12px | 适配规则条件成立时盖过根 token，没有 `!important` |
| `t2` | 用户规则，3 个 class，写在 `astryx.overrides` 层里 | 20px | 20px | 提高优先级就能覆盖，即使适配条件成立 |
| `t7` | 用户规则，1 个 class，不放进 `@layer` | 21px | 21px | 不分层的样式天然赢过分层 |
| `t8` | 用户规则，1 个 class，写进 `astryx.overrides` 层 | 16px | 12px | 同层、优先级更低，输给主题——和文档写的一致 |
| `t3` / `t4` | 两个并列、不同名的 Theme | 11px / 22px | 11px / 22px | 各用各的值 |
| `t5` / `t6` | 外层 `outer`(10px) 套内层 `inner`(30px) | 10px / 30px | 10px / 30px | 内层在自己的子树里赢，外层不受影响 |
| `<html>` | 文档根 | `1rem` | `1rem` | 主题 token 没有漏到 `<html>`（值来自 neutral 的 `:root`） |

**默认外观**（`pnpm visual`，上游代理偶发失败时用 `--combos` 补拍）：

| 组件 | desktop-light | desktop-dark | mobile-light | mobile-dark |
| --- | --- | --- | --- | --- |
| Button | 0 px | 0 px | 0 px | 0 px |
| Card | 0 px | 0 px | 0 px | 0 px |
| Dialog | 0 px | 0 px | 0 px | 0 px |

改之前和改之后各跑一遍，输出在 `/tmp/B1-r2-before` 和 `/tmp/B1-r2-after`，用 pixelmatch 阈值 0 逐张比 `ours.png`，尺寸也相同（912×513 和 708×640）。

- 结束后 5171 没有监听；临时页面都删了。
- 另：机器上有一个 2 天前就在跑的 Chrome for Testing 进程（PID 53886，不是我起的，我也没动它）。我自己的浏览器会话都已关闭，锁已释放。

## 6. 拿不准的地方

1. **同名不同值不再支持**（第 2 节）。这是照上游做的，但确实比第 1 轮少了一点能力。如果验收者认为必须保留，需要改成实例作用域，同时重做 `@scope` 的嵌套边界，不是小改动。
2. **`resolveBackdrop` 那个放宽**是这轮唯一一处产品代码为可测性让步的地方。如果验收者认为不该动，可以回退，代价是 `MediaTheme` 的模式切换测试只能写成「函数被调用了」，写不出「值变了」。
3. **用户覆盖的代价**：主题的 token 规则选择器是 `:scope.astryx-theme`（两个类）。用户想把覆盖写在同一个 `@layer astryx.overrides` 里，需要更高的优先级（实测 3 个 class 就够）；不想管优先级就把覆盖写在不分层的 CSS 里。文档写的是这两条路。如果希望更容易覆盖，可以把它降成 `:where(:scope).astryx-theme`（一个类的权重），但那样又会让同层、同选择器的用户规则反过来赢过主题的根值——需要你们定。
4. **`progress-bar-mark` 的 `replaces` 语义**没实现，见第 4 节第 3 条。
5. **`chat` 挂点的实际效果**要等 C 节点接入：`chat.css` 把 `--_chat-composer-*` 写在输入区自己的规则里（带默认值），主题规则写在 `.astryx-chat` 上，最终谁赢取决于层叠。这次只按要求把表补齐，用 `registry.test.ts` 守住名字，没有在浏览器里验证 chat 的实际渲染。
6. 第 1 轮遗留、这轮没动的：`var(--astryx-spacing-N, Npx)` 的 px 回退值在没引入 themes 包时不跟随根字号；`radio` 旧名仍会命中 Radio 的 label；各 C 节点补齐 `data-*` 后要跟着补派生变量表和删修饰类选择器。
