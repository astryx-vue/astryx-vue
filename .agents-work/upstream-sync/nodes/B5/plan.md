# B5 文案与图标 · 执行计划

## 目标

把**多语言文案**和**图标注册表**追到上游 v0.7.1。做完以后，用户能看到这些变化：

- **组件文案都能翻译**：上游把一批原来写死成英文的文字改成了走翻译目录。这些文字包括：读屏播报、校验提示、键盘提示、加载状态、空状态等等。用中文或其他语言时，这些地方也会显示成对应的语言，读屏软件也会念对应的语言。我们要把翻译这一侧的条目和机制补齐。
- **翻译词条齐全**：上游新增或修改的词条，我们的 `en` 和 `zh-CN` 都要有，并且和上游 `locales/*.json` 对应得上。
- **语言跟着全局走**：在日期输入框以外的地方，组件也会读取 `LocaleProvider`（我们叫 `InternationalizationProvider`）给的语言（上游 #5195）。另外，对外提供基于 provider 的 locale hook（上游 #5194）。
- **图标注册表**：完整的图标注册表必须包含 `upload`（上游 #7329、AST-032）。「上传」和「发送」这类语义图标，由组件自己声明（上游 #6153）。

下游有 28 个节点依赖这个节点。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B5`，分支 `sync/b5-i18n-icons`，已经建好。槽位和端口用 `node scripts/swarm/worktree.mjs ls` 查。
- 动手前先读：
  - `.agents-work/upstream-sync/SWARM.md`，特别是「对齐上游的标准」和「跑检查时的环境」这两节。
  - 台账 `.agents-work/upstream-sync/ledger/B5.md`，共 72 条，其中 1 条是破坏性改动。
  - `.agents-work/README.md` 里「新增一个组件」那一节，讲文案文件怎么放（`packages/core/src/locale/messages/<kebab>.ts`，同一个文件里写 `en` 和 `zh-CN`），以及 `pnpm sync` 会生成 `locale/messages.ts`。
- 我们现在的实现：
  - `packages/core/src/locale/`：translator、ICU、loadCatalog、`upstreamMap.ts`，加上 `messages/*.ts`。
  - `packages/core/locales/*.json`：从上游原样拉过来的 29 种语言目录。`SOURCE.json` 记录了拉取时的上游提交 `fbc03f7b`，这个提交比 v0.7.1 更新，这是项目约定的做法：locales 跟着上游最新走。
  - `packages/core/src/Icon/`：registry、semantic、glyphs。
- 上游：
  - `packages/core/src/i18n/`
  - `packages/core/locales/`
  - `packages/core/src/Icon/`
  - `docs/specs/AST-032`（upload 图标规范）
- 重新拉取 locales 用 `node scripts/vendor-astryx-locales.mjs [提交号]`。不带参数时拉的是上游 main 的最新提交，**这次就不带参数**，保持「跟着上游最新」。拉之前先设代理。
- 环境纪律：所有测试和构建命令前面都加 `env -u NODE_ENV`，vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多开 2 个浏览器会话。
  - 只能用 `node scripts/swarm/browser-lock.mjs run --purpose B5 -- <命令>` 或 `pnpm visual ... --out /tmp/B5-...` 开浏览器。
  - 文档站用你的槽位端口，用完关掉。

## 上游这些改动让用户看到或感受到了什么

先把台账 72 条逐条归类：

| 类别 | 代表条目 | 用户看到或感受到的变化 | B5 要做的 |
| --- | --- | --- | --- |
| 翻译机制 | #5194 provider hooks、#5195 provider locale、#4696 查找表、#5188 ICU 目录契约校验、#4925 i18n 目录检查进 CI、#6697 精简运行时目录、#6706 开发期热更新 | 切换语言后，所有组件都跟着切换 | 补齐机制。ICU 契约校验（检查每个词条的占位符和上游一致）要接进 `pnpm check` |
| 词条 | Crowdin 的翻译更新（多条）、各组件「把文字改成走翻译」的 fix（#4506、#4546、#4920、#5190、#6217、#6220、#6114、#7482、#7215 等） | 这些地方的文字能被翻译 | **词条这一侧**：在 `messages/*.ts` 里加上对应的 key，`en` 和 `zh-CN` 都要写，并且通过 `upstreamMap.ts` 对上上游的 key。**组件里把字符串换成 `t(...)` 的改动**属于对应的 C 节点，标「交给 Cx」，并写清楚 key 名 |
| 重新拉取 locales | — | 29 种语言用的都是上游最新的翻译 | 跑一次 vendor 脚本，更新 `SOURCE.json` |
| 图标 | #7329、#6153、#6971、#6612 FileInput 的上传图标、#5466 NumberInput 的步进图标槽、#5762 | 上传、发送这些图标有统一的语义名 | 注册表这一侧：`upload` 设为必需，补上语义图标的声明机制。各组件改用语义图标，属于对应的 C 节点 |
| 破坏性：#5243 DateInput 根据指针类型切换 | — | — | 交给 C5 |
| 纯组件功能（Stepper 提升、DateRange 范围限制、表格批量操作、Markdown 锚点等） | — | — | 这些条目被归到 B5，只是因为它们顺带改了 locales。只做其中「新增词条」的部分，组件功能本身标「交给 Cx」 |

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| React context 提供 locale，hook 负责读取 | 我们已经有 `InternationalizationProvider`、`useLocale`、`useTranslator`，沿用这套 | 组件拿到的语言和翻译结果一样 |
| 上游 key 直接从 JSON 目录查 | 我们用 `messages/*.ts` 写类型化的词条，再用 `upstreamMap.ts` 映射到上游 key，并读取 vendor 下来的 JSON 做多语言 | 同一个 key，在每种语言下显示的文字和上游一样 |

如果你发现现有机制和上游有**用户能感受到的**差别，比如某种语言回退的顺序不同、复数规则不同，就修正，并在回报里说明。

## 任务范围

要改：

- `packages/core/src/locale/**`
- `packages/core/locales/**`（通过 vendor 脚本更新）
- `packages/core/src/Icon/**`（注册表和语义这一侧）
- i18n 目录检查脚本（新建，接进 `check:packages`）
- 相关测试
- 文档站的 i18n 指南页，以及 Icon 文档里讲注册表的部分

不碰：

- 各组件把写死的字符串换成 `t()`，或者改用语义图标。这些属于 C 节点。
- **例外**：如果你改了 translator 或 Icon 的签名，导致现有组件编译失败或测试失败，就做最小改动修复，行为保持不变。
- B1 和 B3 正在同时改主题和 composables，你不要碰这些文件。
- 生成文件只能用 `pnpm sync` 重新生成。

## 开发步骤

1. **盘点**：把 72 条归类。对每条「把文字改成走翻译」的 fix，列出上游新增的 key，以及对应的组件，写进回报草稿。
2. **拉取 locales**：设好代理，运行 `node scripts/vendor-astryx-locales.mjs`。检查 diff：有哪些新 key，有哪些删掉的 key。
3. **词条**：
   - 每个新 key，在对应组件的 `messages/<kebab>.ts` 里加上 `en` 和 `zh-CN`。中文要写自然，不要机翻腔。
   - 在 `upstreamMap.ts` 里补上映射。
   - 被删掉的 key 要处理掉。
4. **机制**：
   - provider locale 在全局生效。
   - 补上 locale hooks。
   - 加 ICU 契约校验：每个 key 在所有语言里的占位符集合一致，`en` 和 `zh-CN` 要和上游 `en.json` 的占位符一致。
5. **图标**：注册表把 `upload` 设为必需，补上语义图标机制。
6. **检查脚本**：做一个 i18n 目录检查，接进 `pnpm check`。它要检查这几件事：
   - 每个 key 都有 `en` 和 `zh-CN`。
   - 映射里写到的上游 key 确实存在于 locales 里。
   - 占位符一致。
7. 运行 `pnpm sync`。
8. **台账**：72 条都改成 `- [x]` 并写上结论。「交给 Cx」的那些，要写上 key 名或者图标名。

## 自测要求

1. 两种 NODE_ENV 下，`pnpm vitest run --maxWorkers=2 packages/core/src/locale packages/core/src/Icon` 都全部通过。
2. 新的 i18n 检查能抓到问题：
   - 临时删掉某个 key 的 `zh-CN`，检查失败。
   - 临时把某个占位符改错，检查失败。
   - 都要还原。
3. SSR 冒烟测试通过。
4. 完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 一步换成 `pnpm vitest run --maxWorkers=2`。
5. 在浏览器里，用文档站把语言切到中文，打开 Spinner、Switch、NumberInput、Calendar 页面，确认能看到的文字和读屏文字（看 aria-label 和 live region）都是中文。这几个组件如果还没接上 `t()`（那是 C 节点的事），就记下当前状态，写进回报。
6. 新写和改动的源码文件，每个不超过 500 行。

## 提交与回报

- 在分支上提交，提交信息用中文，可以分几次提交，不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/B5/impl-1.md`，格式照 `templates/impl-report.md`。另外要写清楚：
  1. 台账归类结果。
  2. 新增和删除的 key 清单。
  3. 「交给 Cx」的清单：每条写清楚组件、要换成 `t()` 的文字和对应的 key，或者要改用的语义图标。按 C 节点分组。
  4. locales 新拉取的上游提交号。
- 最终回复用中文，300 字以内。
