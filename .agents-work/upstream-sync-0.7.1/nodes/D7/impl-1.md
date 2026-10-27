# D7 迁移指南与版本信息 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D7`，分支 `sync/d7-migration`。只在本地提交，没有推送。
- 提交（基于 `0dc6992`）：
  - `105ae29` docs(zh): 新增升级指南，逐条写清破坏性改动
  - `6953f15` docs: 升级指南出英文版，侧栏加「升级指南」入口，更新日志指过去
  - `8ca8b2d` docs: 示例不再写死 en，跟着站点语言走
  - `e016bcb` chore: 上游版本信息更新到 v0.7.1，重生 CLI 目录
  - `5a708b8` docs(ledger): D7 台账 28 条写结论
  - `cc7f5db` docs: 修正展开与收起的内置文案写法

## 1. 做了什么

1. **收素材**：读完计划里列的各节点「给 D7 的说明」（B1、B2、B4-fix、B5、B6、C1、C2、C3、C6、C7、C15）和 D7 台账 28 条，再逐条到代码里核对。核对后有两条结论和节点说明不一样（见第 3 节）。C4、C5、C8–C14、C16 的 impl 里搜「破坏 / 迁移 / 改名 / 删除 / 默认」，只有 C8 的 BottomSheet 边距一条相关，已单独核对。
2. **写中文升级指南**（334 行）：按「样式与主题 / 组件 API / 行为变化 / 文案与语言 / 不用改的地方」分组，共 13 条。每条统一四段：变了什么、以前怎么写、现在怎么写、怎么改。开篇三句话给最短路径，末尾一节列上游改了但 Vue 版没有的东西。
3. **写英文版**（334 行）并加入口：`sidebar.ts` 的「项目」组加「升级指南 / Upgrade guide」，`changelog.md` 中英文各加一句指向它。顺手把 `installation.md` 里过期的「已发布版本 0.1.0」改成 `0.3.0`（两个包现在都是 0.3.0）。
4. **清理写死的 locale**：38 处 `provideAstryxLocale('en')` 全部处理完，现在 `grep -rn "provideAstryxLocale('en')" apps/docs` 是 0 处。37 个 `components/demos/` 下的示例删掉调用行和不再用到的 import；`components/themes/ThemeStage.vue` 是主题页用的模板，主题页不在组件文档壳里，所以改成按站点语言自己提供（`relativePath.startsWith('en/') ? 'en' : 'zh-CN'`），并留了一行注释说明用途。
5. **版本信息**：根 `package.json` 的 `upstream.version` 改成 `0.7.1`，`upstream.commit` 改成 `44f7244dd518ca07f8cc9f238fad8c0495b2f44e`（`git rev-list -n1 v0.7.1`）。`grep -rn upstream apps/docs` 没有展示上游版本的地方，所以按计划在升级指南开头写了「这一版对齐 Astryx v0.7.1」。
6. **llms 与 catalog**：`env -u NODE_ENV pnpm docs:build` 通过，产物 `dist/llms.txt` 和 `dist/llms-zh.txt` 第 26 行出现升级指南，`dist/guide/migration.md`、`dist/en/guide/migration.md` 也生成了。llms 产物只写到 `dist/`（`.gitignore` 里 `**/dist/`），不进仓库，所以没有可提交的产物。示例删行后 `generate:check` 判定 `catalog.json` 过期，用 `pnpm --filter @astryx-vue/cli generate` 重生（245 组件、32 主题、53 模板，多出 `guide/migration` 这一条）。
7. **台账**：28 条全部打勾并写结论：已采纳 13 条，不适用 15 条。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `apps/docs/docs/zh/guide/migration.md` | 334 | 中文升级指南，13 条破坏性改动逐条对照 |
| `apps/docs/docs/en/guide/migration.md` | 334 | 英文升级指南，内容对应 |
| `apps/docs/.vitepress/sidebar.ts` | 81 | 「项目」组加升级指南入口 |
| `apps/docs/docs/{zh,en}/guide/changelog.md` | 20 / 20 | 各加一句指向升级指南 |
| `apps/docs/docs/{zh,en}/guide/installation.md` | 51 / 51 | 已发布版本改 0.3.0，链接升级指南 |
| `apps/docs/components/demos/**/overview.vue` 等 37 个 | — | 删掉写死的 `provideAstryxLocale('en')` 和不再用到的 import（共 -110 行） |
| `apps/docs/components/themes/ThemeStage.vue` | 457 | 按站点语言提供 locale，替换写死的 `'en'` |
| `package.json` | 72 | `upstream.version` / `upstream.commit` 更新到 v0.7.1 |
| `packages/cli/src/generated/catalog.json` | — | `generate` 重生（示例代码 + 新主题条目） |
| `.agents-work/upstream-sync-0.7.1/ledger/D7.md` | 198 | 28 条打勾并写结论 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 迁移指南 | 没有单独一份面向使用者的迁移文档，破坏性改动写在版本博文和 codemod 里 | 一份中英文升级指南，按影响面分组，每条四段对照 | 用户打开文档站就能查到「以前怎么写 / 现在怎么写」，不依赖读 React 版博文 |
| 自动化迁移 | `astryx upgrade` 跑 codemod 改 `*style`、`emptySearchResultsText`、Banner 折叠等 | 不提供 codemod，指南里给「怎么改」的手动步骤和搜索关键词 | 这些 API 在 Vue 版多数不存在或形状不同，codemod 改不了 Vue 单文件组件；能改的部分（改名、类名）指南给了一句话搜索替换 |
| 根 `class` / `style` 落点 | 丢掉并警告，提示改用 `control*` | 保持今天落点，不丢不警告（用户已拍板） | 外壳和本体都能加样式，只是入口不同。指南里写明了差异，用户不会以为自己在犯错 |
| 版本信息 | 发布博文标版本 | 根 `package.json` 的 `upstream` 字段做唯一事实来源，指南开头引一句 | 仓库里只有这一处记上游版本，改一处就够 |

## 3. 和计划不一样的地方

1. **指南里不写「我们的节点号」**。计划要求每条后面标上游 PR 号和我们的节点号，但总控这一轮的文风要求是「不写内部过程和节点轮次」。我按后者办：只保留上游 PR 号（用户能拿去查上游），节点号全部写进本回报的「升级指南条目清单」和台账里。如果验收需要文档里带节点号，告诉我，我加回去。
2. **Banner 折叠那条不进指南**。B6/B1 的材料把 `dfdd77805` 当破坏性改动，但核对后发现我们的 Banner 在这次同步之前就是 `collapsible` + `defaultIsOpen` + `isOpen` 三个属性（`git show 71671a9^:packages/core/src/Banner/Banner.vue`），和上游把折叠轴收进一个 `collapsible` 对象表达同一件事，没有属性改名。台账里标「不适用」并写了证据。用户能感知到的只有展开/收起文案改成 `Expand` / `Collapse` 和中文「展开」「收起」，这一条并进了「文案与语言」那节。
3. **BottomSheet 边距那条也不进指南**。上游 `b507cdef4` 是「内容默认有内边距」，但我们 0.3 就已经是默认 `--astryx-spacing-4`（`git show 56fee62^:packages/core/src/styles/bottom-sheet.css:265`），C8 这次只是把单值拆成四边变量链并发布 `--container-padding-*`。用户可见结果不变，标「已采纳」，不进指南。
4. **`ThemeStage.vue` 不是简单删行**。计划说「删掉这一行就会跟着站点语言走」，但主题页（`/themes/neutral` 等）和主题总览都不经过 `ComponentDocsPage`，那里没有 locale provider。直接删会让主题展示模板退回英文默认。改成按 `useData().page.relativePath` 自己提供 locale，并在文件里留了一行注释说明原因。
5. **`installation.md` 的已发布版本从 `0.1.0` 改成 `0.3.0`**。计划没列这条，但它和「版本信息正确」直接相关，而且两个包的 `package.json` 都是 0.3.0。顺手加了升级指南的链接。没动 ROADMAP / SWARM / 组件源码 / 主题 CSS / CHANGELOG / changeset。
6. **`packages/cli/src/generated/catalog.json` 重生了**。计划里说「如果 `generate:check` 要求重生」才做，实际就是要求了：删掉示例里的 locale 行之后 catalog 里内嵌的示例代码过期。
7. **台账结论是「已采纳 13 / 不适用 15」**，和计划里「破坏性 18 条多半已采纳」的预期分布不一样，因为其中 3 条（DateInput 触屏、Banner、BottomSheet）的用户可见结果和改动前一样，属于等价实现。

## 4. 台账处理

28 条全部打勾写结论：**已采纳 13 条，不适用 15 条**。

不适用的 15 条逐条理由：

1. `dfdd77805` Banner `collapsible`：我们早就有等价的三个属性，没有改名（证据 `Banner/types.ts:17-19`）。
2. `d859ae984` agent 环境变量：`grep -rn process.env packages/cli/src` 无结果。
3. `458ff35b1` `astryx layout`：`packages/cli/src/spec.ts` 的命令清单里没有 layout 子命令。
4. `19da79e39` doctor：`spec.ts` 的命令清单里没有 doctor 子命令，也没有 `astryx.config` 加载流程。
5. `3045edad6` `emptySearchResultsText`：Vue 版类型里从来没有这个名字，`git log -S` 只命中守护测试。
6. `1afd1fcb4`：只改上游发布博文的文字。
7. `07f6c334b`：上游 v0.5.0 博文，我们不发版本博文，内容已并入指南。
8. `c55ef8e21`：上游内部规范 `AST-013`，不是面向使用者的文档。
9. `c203bf910`：同上，补规范里的浏览器证据。
10. `20df722b4`：上游 v0.6.0 博文。
11. `176dfa624`：上游评审基线流程。
12. `17044ab1e`：上游规范审批人名单。
13. `e7723cddf`：上游发版与版本兼容规范，我们的发版由 changeset 管。

另外两条 `0f41f7576` / `60f2ae9a2`（v0.7.0 博文草稿与正式版）按上面第 7 条的理由标不适用，理由写在台账里。13 条已采纳的在台账里逐条指了指南的哪一节，或者写明「无 API 变化，指南不单列」和证据位置。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 apps/docs tests packages/cli` | 过 | 27 个文件，504 条用例 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 27 个文件，504 条，用例数相同 |
| 3 | `pnpm exec eslint --max-warnings 0 apps/docs/components apps/docs/.vitepress` | 过 | 退出码 0 |
| 3 | `node scripts/check-line-limit.mjs` | 过 | 「源码单文件行数检查通过（上限 500 行）」 |
| 3 | `node scripts/sync-exports.mjs --check` | 过 | 「生成结果和已提交文件一致」 |
| 3 | `node scripts/check-no-important.mjs` | 过 | 退出码 0 |
| 3 | `pnpm --filter @astryx-vue/cli generate:check` | 过 | 「catalog is up to date (245 components, 32 topics, 53 templates)」 |
| 3 | `pnpm check:i18n-catalog` | 过 | 退出码 0 |
| 3 | `pnpm typecheck`（根，含 apps/docs 的 vue-tsc） | 过 | 退出码 0 |
| 3 | `pnpm --filter @astryx-vue/docs typecheck` | 过 | 退出码 0 |
| 4 | 视觉对照：改 `ThemeStage.vue` 前后有没有偏 | 未做 | 计划没要求；本轮只改 locale 来源，模板结构没动。需要的话我补一轮截图 |
| 5 | 构建 | 过 | `env -u NODE_ENV pnpm build:packages` 退出码 0；`env -u NODE_ENV pnpm docs:build` 31.01s，561 页，llms 四份产物都生成 |
| 6 | 浏览器（5173，用 browser-lock，一次一个会话） | 过 | `/guide/migration` 和 `/en/guide/migration` 都 200，h1 正确，代码块 17 个、高亮行 53 行，侧栏有入口；两页 h2 5 个、h3 14 个，右侧目录 5 条（和站内其他页一致，只列 h2）。组件页：typeahead 中文页有「清除」、英文页没有中文；token 和 thumbnail 中文页有「移除」、英文页没有；三页都没有 JS 报错。看完已 kill 5173 的进程 |
| 7 | `grep -rn "provideAstryxLocale('en')" apps/docs` | 过 | 0 处，不需要保留说明 |

## 6. 升级指南条目清单

| # | 条目标题 | 证据位置 | 来源 |
| --- | --- | --- | --- |
| 1 | `reset.css` 现在是完整的全局 reset | `packages/core/reset.css`；`apps/docs/.vitepress/theme/index.ts` | 上游 #7355 / B2 |
| 2 | 间距 token 从 px 改成 rem | `packages/themes/neutral/base.css:124`、`matcha/base.css:118`、`y2k/base.css:120`；`git show 3c5cd52^` 里是 `4px` | 上游 #7359 #7374 / D1、D2 |
| 3 | 自定义主题里的挂点名改名 | `packages/core/src/Theme/componentStyles.ts:35`（`assertTargetName` 抛错）；旧类名 `grep` 全无命中；`apps/docs/docs/zh/themes/extending.md:108` | 上游 #7302 / B1、D2 |
| 4 | 组件不再输出 `primary`、`sm` 这类裸类名 | `packages/core/styles/button.css` 里 `grep "\.astryx-button\.\(primary\|sm\)"` 无命中 | 上游 #6121 / B1 |
| 5 | `labelHidden` 改名 `isLabelHidden` | `packages/core/src/composables/useResolvedLabelHidden.ts:25` | C1、C3 |
| 6 | Selector `variant="default"` 改名 `input` | `packages/core/src/Selector/types.ts:37`（两个值都在） | C3 |
| 7 | 新增四个样式分层属性 | `packages/core/src/Field/fieldParts.ts:17`；17 个组件的 `types.ts` 引用它 | 上游 #7336 #7339 #7337 #7341 / C1、C2、C3、C5 |
| 8 | `useDismiss` 的 `enableEscape` 换成 `dismissOnEscape` | `packages/core/src/composables/useDismiss.ts:17` | 上游 #4881 / B4-fix |
| 9 | Tab、TabMenu 必须在 TabList 里，Step 必须在 Stepper 里 | `packages/core/src/TabList/context.ts:12`、`packages/core/src/Stepper/context.ts:28` | 上游 #6457 / B4-fix |
| 10 | `useAstryxLocale()` 可能返回带地区的标签 | `packages/core/src/locale/context.ts:15`；`locale.test.ts:12-13` | B5 |
| 11 | 导航菜单开始透传属性 | `packages/core/src/NavMenu/NavHeadingMenuItem.vue:51`、`NavHeadingMenu.vue:49-74` | 上游 #7331 / B6、C13 |
| 12 | 不传名字时，默认名字跟当前语言 | `locale/messages/{dropdown-menu,context-menu,more-menu,dialog,banner,switch}.ts` | 上游 #6125 #7289 / C2、C6、C7、C15 |
| 13 | 英文内置文案逐字对齐原版 | `locale/messages/{nav,selector,power-search,typeahead,tokenizer,date-input,pagination,stepper}.ts` 逐条核过 | B5 |
| 14 | 数字到一千以上加千分位 | 同上（Pagination、Selector、MultiSelector、Carousel、CommandPalette、Lightbox、Stepper 用同一个数字格式化） | B5 |
| 15 | 不用改的地方（CLI、0.6 废弃 API） | `packages/cli/src/spec.ts` 命令清单；`composables/deprecatedApis.public.test.ts` | 上游 #7137 #7130 #6118 #7289 / B6 |

## 7. 发现的说明和代码不一致

1. **B6 说「0.6 废弃 API 在 Vue 版本从没存在」，`deprecatedApis.public.test.ts` 的注释却写「已删除」**。核对结果支持 B6：`git log -S "emptySearchResultsText" -- packages/core/src` 只命中这个守护测试本身，类型文件里从来没有过。测试注释的措辞容易让人以为我们曾经有过，建议以后改成「保持不存在」。我没有改测试。
2. **B1 的旧名清单里 `date-input-clear-icon` 等 → `input-clear-icon`，但实际 DOM 上清除按钮的类名是 `astryx-input-clear-button`，图标是 `astryx-input-clear-icon`**（`packages/core/src/Field/InputClearButton.vue:31,40`）。挂点名（主题目靶点）对得上，文档 `themes/extending.md` 也是按挂点名写的，所以不影响用户，但如果有人按类名手写 CSS，会找错元素。
3. **B6 的「Banner 折叠改成 `collapsible`」在 Vue 版早就是这样**（`git show 71671a9^` 的默认值里已有 `collapsible: true, defaultIsOpen: false`）。这不是问题，只是材料把它当成了本轮的破坏性改动。
4. **B5 提到「36 个文档示例写死 `provideAstryxLocale('en')`」**，实际是 38 个（ROADMAP 里也写 36）。已全部清理。

## 8. 拿不准的地方

1. **指南里没写我们的节点号**，理由见第 3 节第 1 条。验收如果要，我加。
2. **`ThemeStage.vue` 的视觉结果这轮没有截图对照**。改动只是 locale 来源，模板结构没动，但主题页是发给用户看的页面，建议验收时顺手看一眼 `/themes/neutral` 中文页的内置文案是中文（比如 Banner 的「展开」）。
3. **右侧目录只列到 h2**，和站内其他页一致（`/themes/extending` 有 8 个 h3，目录也只列 5 个 h2）。如果期望列到 h3，那是全站配置，不在本轮范围。
4. **指南没有覆盖「上游 v0.7.0 博文里没进台账的破坏性改动」**。我是按台账 28 条逐条核的，没逐段读三篇博文。如果总控担心漏项，可以再派一轮专门对博文。
