# A1 上游差异台账 · 实现回报（第 1 轮）

分支：`sync/a1-upstream-ledger`（工作区 `/Users/shenqingchuan/workspace/astryx-vue-wt/A1`），提交 `35cae0c feat: 新增上游差异台账脚本`。没有推送。

## 1. 做了什么

新增文件（没有修改已有文件）：

| 文件 | 行数 | 作用 |
| --- | ---: | --- |
| `scripts/upstream-ledger.mjs` | 149 | 命令行入口：参数解析、找上游目录、写入或 `--check` 比较、落空时报错 |
| `scripts/upstream-ledger/rules.mjs` | 406 | 归类规则：节点表、core 和 lab 目录对照表、AST 规范与知识库文档对照表、`RULES` 规则链、按 PR 追加（`COMMIT_PINS`）、破坏性追加（`BREAKING_NODES`） |
| `scripts/upstream-ledger/commits.mjs` | 154 | 调用 `git log` 读提交、解析、判断类型和破坏性、逐文件归类 |
| `scripts/upstream-ledger/render.mjs` | 211 | 渲染节点台账、`_unrelated.md`、`_summary.md` |
| `tests/upstream-ledger.test.ts` | 274 | 72 个测试用例 |
| `.agents-work/upstream-sync-0.7.1/ledger/*.md` | — | 48 份节点台账，加上 `_unrelated.md`、`_summary.md`、`README.md` |

只用 Node 自带模块，再加上调用 `git` 命令。没有加依赖。

## 2. 自测清单

1. 在真实上游上跑通，没有落空的文件。
   ```
   $ node scripts/upstream-ledger.mjs
   已生成 50 个台账文件到 .../A1/.agents-work/upstream-sync-0.7.1/ledger
   ```
   总表：1693 个非合并提交；1350 个归入至少一个节点；343 个整条无关；涉及 5686 个上游文件，全部有归属。
2. `node scripts/upstream-ledger.mjs --check` 输出「台账是最新的（50 个文件）。」，退出码 0。
3. 抽查：
   - #7341（`5777977fe`，破坏性）：在 C3 的「破坏性改动」一节，也出现在 C1、D5、D7、D8、F3a。
   - #7302（`a1a6a636f`，破坏性）：在 B1 的「破坏性改动」一节，也出现在 C1、C2、C3、C5、C6、C7、C9、C11、C13、C14、C15、D3、D4、D6、D7。
   - #7389（`b32d73f95`）：在 C9 的 feat 小节，同时标「还涉及：B1、D4」。它的标题不带 `!`，所以不算破坏性。
   - ROADMAP 点名的其它 PR：#7336 在 C1；#7339 在 C2 和 C3；#7337 和 #5243 在 C5；#7347 在 C4；#6884 在 C8；#5255 在 C15；#7355 在 B2；#7359 在 B1；#7374 在 D2；#7137 在 D4；#7329 在 B5；#6919 在 B4；#6383 在 B3；#7331、#6118、#7289 在 B6。
4. `pnpm vitest run --maxWorkers=2 tests/upstream-ledger.test.ts`：72 个通过。
5. `pnpm lint` 和 `pnpm typecheck` 都通过。`pnpm check` 的每一步按原顺序单独跑，都通过：
   - `check:packages`
   - `lint`
   - `typecheck`
   - 测试：`pnpm vitest run --maxWorkers=2`，2250 个通过
   - `build`
   - `lint:pkg`

   `pnpm check` 自带的 `vitest run` 不限制并发，所以测试这一步换成了带 `--maxWorkers=2` 的命令。没有跑 `pnpm check` 这一条命令本身。
6. 新源码文件最长的是 `rules.mjs`，406 行。所有新源码文件都不超过 500 行。

## 3. 总表与需要总控确认

### 各节点

| 节点 | 名称 | 提交数 | 破坏性 | 涉及文件数 |
| --- | --- | ---: | ---: | ---: |
| A1 | 上游差异台账 | 0 | 0 | 0 |
| A2 | 视觉对照工具 | 0 | 0 | 0 |
| A3 | 工程质量护栏 | 0 | 0 | 0 |
| A4 | 蜂群基础设施 | 0 | 0 | 0 |
| [B1](../../ledger/B1.md) | 主题系统与设计变量 | 98 | 2 | 71 |
| [B2](../../ledger/B2.md) | 基础重置样式 | 7 | 1 | 6 |
| [B3](../../ledger/B3.md) | 交互逻辑常用函数 | 62 | 3 | 92 |
| [B4](../../ledger/B4.md) | 浮层图层运行时 | 29 | 0 | 35 |
| [B5](../../ledger/B5.md) | 界面文案与图标 | 72 | 1 | 68 |
| [B6](../../ledger/B6.md) | 属性规则与样式分层 | 36 | 3 | 72 |
| [B7](../../ledger/B7.md) | 常用工具函数 | 26 | 2 | 30 |
| [C1](../../ledger/C1.md) | 基础输入框 | 82 | 5 | 70 |
| [C2](../../ledger/C2.md) | 勾选与开关 | 62 | 2 | 63 |
| [C3](../../ledger/C3.md) | 选择器家族 | 108 | 4 | 70 |
| [C4](../../ledger/C4.md) | 快捷搜索与命令面板 | 46 | 2 | 44 |
| [C5](../../ledger/C5.md) | 日期与时间 | 73 | 4 | 81 |
| [C6](../../ledger/C6.md) | 菜单家族 | 62 | 1 | 51 |
| [C7](../../ledger/C7.md) | 弹出浮层家族 | 80 | 1 | 60 |
| [C8](../../ledger/C8.md) | 底部抽屉 | 61 | 2 | 41 |
| [C9](../../ledger/C9.md) | 文档排版与代码高亮 | 119 | 2 | 102 |
| [C10](../../ledger/C10.md) | 对话组件 | 63 | 1 | 86 |
| [C11](../../ledger/C11.md) | 数据表格 | 48 | 2 | 58 |
| [C12](../../ledger/C12.md) | 列表与树形结构 | 54 | 1 | 48 |
| [C13](../../ledger/C13.md) | 页面导航 | 67 | 3 | 77 |
| [C14](../../ledger/C14.md) | 布局与排版容器 | 107 | 4 | 113 |
| [C15](../../ledger/C15.md) | 状态反馈与加载 | 57 | 2 | 47 |
| [C16](../../ledger/C16.md) | 基础展示与动作按钮 | 78 | 0 | 95 |
| [D1](../../ledger/D1.md) | Neutral 主题底色 | 25 | 0 | 26 |
| [D2](../../ledger/D2.md) | 其余六套主题适配 | 15 | 1 | 58 |
| [D3](../../ledger/D3.md) | Probe 主题调研 | 14 | 1 | 6 |
| [D4](../../ledger/D4.md) | 命令行搜索与更新 | 313 | 7 | 783 |
| [D5](../../ledger/D5.md) | 命令行新增页面模板 | 125 | 7 | 350 |
| [D6](../../ledger/D6.md) | 样式分层自动迁移脚本 | 50 | 5 | 110 |
| [D7](../../ledger/D7.md) | 升级指南与版本说明 | 28 | 18 | 356 |
| [D8](../../ledger/D8.md) | 在线演练场同步更新 | 19 | 4 | 16 |
| E1 | 拆分脚本与命令行大文件 | 0 | 0 | 0 |
| E2 | 拆分文档站大文件 | 0 | 0 | 0 |
| [E3](../../ledger/E3.md) | 页面无障碍自动检查 | 37 | 0 | 120 |
| E4 | 自动对比页面外观 | 0 | 0 | 0 |
| [F0](../../ledger/F0.md) | 新包技术选型决策 | 1 | 0 | 1 |
| [F1a](../../ledger/F1a.md) | 富文本核心逻辑 | 70 | 0 | 58 |
| [F1b](../../ledger/F1b.md) | 富文本编辑器组件 | 41 | 0 | 23 |
| [F1c](../../ledger/F1c.md) | 富文本使用文档 | 20 | 0 | 4 |
| [F2a](../../ledger/F2a.md) | 图表纯计算逻辑 | 11 | 0 | 19 |
| [F2b](../../ledger/F2b.md) | 图表展示组件 | 8 | 0 | 13 |
| [F2c](../../ledger/F2c.md) | 图表使用文档 | 8 | 0 | 11 |
| [F3a](../../ledger/F3a.md) | 实验包：输入类组件 | 26 | 4 | 14 |
| [F3b](../../ledger/F3b.md) | 实验包：展示类组件 | 31 | 0 | 41 |
| [F3c](../../ledger/F3c.md) | 实验包：浮层与引导 | 16 | 0 | 29 |
| [F3d](../../ledger/F3d.md) | 实验包：图表与编辑器 | 9 | 0 | 66 |
| [F3e](../../ledger/F3e.md) | 实验包：对话类组件 | 6 | 0 | 14 |
| [F3f](../../ledger/F3f.md) | 实验包：使用文档 | 13 | 0 | 4 |
| F4 | Nuxt 模块 | 0 | 0 | 0 |
| [F5](../../ledger/F5.md) | vega 包 | 4 | 0 | 10 |
| [F6](../../ledger/F6.md) | build 构建插件 | 11 | 0 | 26 |
| [G1](../../ledger/G1.md) | 发布核心组件与主题包 | 28 | 0 | 3 |
| G2 | 发布命令行工具 | 0 | 0 | 0 |
| G3 | 发布全新扩展包 | 0 | 0 | 0 |
| G4 | 每周自动追踪上游更新 | 0 | 0 | 0 |
| [无关](../../ledger/_unrelated.md) | 全部文件无关的提交 | 343 | 0 | 1484 |

### 需要总控确认

下面这些归属是台账脚本按就近原则自行决定的，ROADMAP 没有写明。改归属请编辑 `scripts/upstream-ledger/rules.mjs` 后重新生成。

- 根 README 的改动归 G1，由它在发布时更新我们的主说明（规则 `root-readme` → G1，1 个文件，例如 `README.md`）
- core 包 README 的改动归 G1（规则 `core-readme` → G1，1 个文件，例如 `packages/core/README.md`）
- Tailwind 主题桥（把 token 暴露给 Tailwind）归 B1，Vue 版是否提供由 B1 决定（规则 `core-tailwind-bridge` → B1，2 个文件，例如 `packages/core/src/tailwind-theme.css`、`packages/core/src/tailwind-theme.test.ts`）
- 跨组件的公共 API 契约测试（apiContractDrift 等）归 B6（规则 `core-tests-contract` → B6，3 个文件，例如 `packages/core/src/__tests__/apiContractDrift.test.tsx`、`packages/core/src/__tests__/complexComponentContract.test.tsx`、`packages/core/src/__tests__/structuralComponentContract.test.tsx`）
- 按压模型、交互模态、焦点归还虽在 utils/，但 ROADMAP 把它们划给 B3（规则 `core-utils-press` → B3，11 个文件，例如 `packages/core/src/utils/focusReturn.test.ts`、`packages/core/src/utils/focusReturn.ts`、`packages/core/src/utils/interactionModality.test.ts`）
- themeProps 生成 theme target 类名，归 B1 的换肤机制（规则 `core-utils-theme-props` → B1，2 个文件，例如 `packages/core/src/utils/themeProps.test.ts`、`packages/core/src/utils/themeProps.ts`）
- 代码高亮的语法主题同时属于主题系统（B1）和代码高亮（C9）（规则 `core-theme-syntax` → B1、C9，7 个文件，例如 `packages/core/src/theme/syntax/SyntaxTheme.tsx`、`packages/core/src/theme/syntax/defineSyntaxTheme.diff.test.ts`、`packages/core/src/theme/syntax/defineSyntaxTheme.ts`）
- Icon 目录统一归 B5（图标注册表），同时标 C16（Icon 组件外观）（规则 `core-icon` → B5、C16，11 个文件，例如 `packages/core/src/Icon/Icon.doc.mjs`、`packages/core/src/Icon/Icon.spec.md`、`packages/core/src/Icon/Icon.test.tsx`）
- CLI 内置的 Neutral 主题副本，跟主题包一起归 D1（规则 `cli-theme-copy-neutral` → D1，8 个文件，例如 `packages/cli/assets/templates/themes/neutral/icons.tsx`、`packages/cli/assets/templates/themes/neutral/neutralPaletteRefs.generated.ts`、`packages/cli/assets/templates/themes/neutral/neutralPalettes.generated.receipt.json`）
- CLI 内置的其余主题副本，跟主题包一起归 D2（规则 `cli-theme-copy-others` → D2，18 个文件，例如 `packages/cli/assets/templates/themes/butter/butterTheme.doc.mjs`、`packages/cli/assets/templates/themes/butter/butterTheme.ts`、`packages/cli/assets/templates/themes/butter/icons.tsx`）
- upgrade 命令负责执行 codemod，它的改动和 codemod 一起归 D6（规则 `cli-codemod` → D6，110 个文件，例如 `packages/cli/api/integration/integrationAddCodemod.doc.mjs`、`packages/cli/api/upgrade/_adapter.mjs`、`packages/cli/api/upgrade/list/list.mjs`）
- CLI 自带的指南文档（assets/docs，主题、token、样式等）也落在 D4；是否改由文档类节点承接请总控确认（规则 `cli-other` → D4，758 个文件，例如 `packages/cli/CONTRIBUTING.md`、`packages/cli/README.md`、`packages/cli/api/blog/_adapter.mjs`）
- lab 包级文件（入口、README、示例块、集成描述、包级测试）归 F3f（规则 `lab-package` → F3f，4 个文件，例如 `packages/lab/README.md`、`packages/lab/astryx.integration.mjs`、`packages/lab/src/__tests__/labApiContractDrift.test.tsx`）
- lab 内部共享的拖拽排序样式，就近归 F3a（ListInput、TransferList）（规则 `lab-reorder-styles` → F3a，1 个文件，例如 `packages/lab/src/reorderStyles.ts`）
- BottomSheet、Stepper 在 lab 孵化期的改动，归 core 对应节点 C8、C15（规则 `lab-promoted` → 查表，25 个文件，例如 `packages/lab/src/BottomSheet/BottomSheet.doc.mjs`、`packages/lab/src/BottomSheet/BottomSheet.test.tsx`、`packages/lab/src/BottomSheet/BottomSheet.tsx`）
- 上游版本发布博客，作为 D7 写升级指南的参考（规则 `docsite-release-posts` → D7，3 个文件，例如 `apps/docsite/src/content/blog/posts/astryx-v0-5-0.md`、`apps/docsite/src/content/blog/posts/astryx-v0-6-0.md`、`apps/docsite/src/content/blog/posts/astryx-v0-7-0.md`）
- 上游演练场（编辑器、预览、主题编辑器）归 D8（规则 `docsite-playground` → D8，16 个文件，例如 `apps/docsite/src/app/playground/PlaygroundClient.tsx`、`apps/docsite/src/app/playground/PreviewStage.tsx`、`apps/docsite/src/app/playground/monacoSetup.ts`）
- docs/specs 下的 AST 规范记录按记录标题就近归类，见 rules.mjs 的 SPEC_NODES（规则 `spec` → 查表，52 个文件，例如 `docs/specs/AST-001/spec.md`、`docs/specs/AST-002/spec.md`、`docs/specs/AST-003/spec.md`）
- docs/architecture、design、families 下的知识库文档按主题就近归类，见 rules.mjs 的 KNOWLEDGE_DOC_NODES（规则 `knowledge-doc` → 查表，34 个文件，例如 `docs/architecture/cli-surface.md`、`docs/architecture/component-size-cascade.md`、`docs/architecture/component-style-authoring.md`）
- 上游 APG 无障碍模式契约测试，归 E3 作为无障碍检查的参考（规则 `a11y-spec` → E3，117 个文件，例如 `internal/a11y-spec/README.md`、`internal/a11y-spec/package.json`、`internal/a11y-spec/src/check.test.ts`）

### 按提交追加的归属

这些提交没有改到节点名下的路径，但 ROADMAP 点名由该节点处理。登记在 `rules.mjs` 的 `COMMIT_PINS` 和 `BREAKING_NODES`。

- B6：ROADMAP B6 点名：删除 0.6 标记废弃的 API（1 个提交）
- B6：ROADMAP B6 点名：删除 emptySearchResultsText（1 个提交）
- B6：ROADMAP B6 点名：非表单组件透传自定义属性（1 个提交）
- D7：ROADMAP D7：迁移指南要逐条覆盖每个破坏性改动（18 个提交）


## 4. 偏离计划和拿不准的地方

**偏离计划的地方**

- **按 PR 追加归属。** ROADMAP 把 #7331、#6118、#7289 点名给 B6。可这三个提交只改了具体组件、hooks、codemod 和 CLI 模板，按路径归类根本到不了 B6。所以我加了 `COMMIT_PINS`，按 PR 编号把它们追加到 B6。台账里这类条目会写「归入原因」。
- **破坏性提交全部追加到 D7。** ROADMAP 要求 D7 逐条写清每个破坏性改动，所以 18 个破坏性提交都进了 D7 的台账。
- **多了一行「测试」。** ROADMAP 的 A1 说明要求列出改了哪些测试文件，所以每条下面加了这一行。计划里的格式示例没有这一行。
- **上游目录参数多找一处。** 我是在 git worktree 里跑的，仓库根目录旁边没有 `astryx-upstream`。所以默认值 `../astryx-upstream` 找不到时，脚本还会去主工作区旁边找。
- **完整检查的测试步骤。** 上面第 2 节第 5 项已经说明：`pnpm check` 是分步跑的，测试这一步换成了 `--maxWorkers=2`。

**拿不准、请总控定的地方**

- **D4 很重。** 313 个提交，783 个文件。CLI 的 `assets/docs`（主题、token、样式、集成指南等文档）全部落在 D4。是否改归 D7，或者拆成新节点，请总控决定。
- **D5 和 D6 的切分靠路径关键词。** 路径里有 `template` 的归 D5；有 `codemod` 或 `upgrad` 的归 D6。所以 `integrationAddTemplate.doc.mjs` 这类集成文档也进了 D5。
- **一个提交改到很多 CLI 模板时，C 节点台账会跟着变长。** 例如 #6118 改了几十个模板页面，D5 就会出现它。这是按路径归类必然的结果。
- **docs/specs 和知识库文档是我按标题分的。** 例如 AST-017（版本兼容规范）归 G1；AST-080（包样式表分发）归 F0。表在 `SPEC_NODES` 和 `KNOWLEDGE_DOC_NODES` 里。
- **`apps/docsite` 只留下两块。** 演练场归 D8，版本发布博客归 D7，其余判为无关。上游文档站的 component-detail 渲染器（Anatomy、Theming 面板等）也判为无关，没有归给 E2 或 D8。
- **`internal/a11y-spec` 归 E3，一共 117 个文件。** 它是上游的 APG 无障碍契约测试，例如 Combobox 和 Menu Button 的绑定。也可以把它看成各 C 节点的测试素材。
- **A 系列、E1、E2、E4、F4、G2–G4 没有台账。** 上游没有路径能映射到这些节点。

**故意没做的地方**

- **重新生成会覆盖已经打的勾。** 我在 README 里写明了做法：先在 `swarm-tree` 上重新生成，各节点再 rebase。脚本没有做「保留勾选状态」的合并逻辑。
- **测试文件没有被任何 tsconfig 覆盖。** 根 `tsconfig.json` 只包含配置文件，所以测试文件不参与 `pnpm typecheck`。这和仓库里其它 `tests/*.test.ts` 一样。
