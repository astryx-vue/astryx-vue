# A1 上游差异台账 · 执行计划

## 目标

做一个脚本，把上游从 0.4.1 到 v0.7.1 的 1693 个提交，分到任务树的各个节点名下。
做完以后，每个节点的实现者打开 `ledger/<节点ID>.md`，就能看到「这个节点要追的上游改动」清单，逐条打勾。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A1`，分支 `sync/a1-upstream-ledger`。只在这里改代码。
- 上游仓库已经克隆在 `/Users/shenqingchuan/workspace/astryx-upstream`（不完整克隆，按需从远端拉取文件内容）。只读，不要改它。
  - 起点 `96f9917f`（0.4.1），终点标签 `v0.7.1`（`44f7244d`）。
  - 访问 GitHub 前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`
- 任务树和节点说明：`/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/ROADMAP.md`。动手前先读一遍「各阶段任务细节说明」，尤其是 B、C、D、F 节点的范围。
- 跑测试时限制并发：`pnpm vitest run --maxWorkers=2 <文件>`。
- 不要开浏览器，这个节点用不到。

## 范围

要做：

1. `scripts/upstream-ledger.mjs`：生成台账的脚本。
2. `scripts/upstream-ledger/rules.mjs`：归类规则，也就是「上游哪个路径归哪个节点」的对照表，单独放一个文件，方便以后改。
3. `tests/upstream-ledger.test.ts`：测试。
4. 产物 `.agents-work/upstream-sync-0.7.1/ledger/`：每个节点一个 `<节点ID>.md`，另有 `_unrelated.md`（无关提交）、`_summary.md`（总表）。产物要提交进 git。
5. 在 `.agents-work/upstream-sync-0.7.1/ledger/README.md` 写清怎么用、怎么重新生成、怎么改规则。

不做：

- 不改 `ROADMAP.md` 和 `SWARM.md`。
- 不修改任何组件代码。
- 不往根目录 `package.json` 加依赖。只用 Node 自带模块，加上调用 `git` 命令。

## 归类规则

按「提交改到的文件路径」归类，不按提交标题猜。

1. 用 `git log --format=... --name-only <from>..<to>` 取得每个提交改了哪些文件。合并提交（merge）不算。
2. 每个文件按规则表映射到一个节点 ID，或者映射到 `unrelated`。
3. 一个提交改到的文件落在几个节点，这个提交就出现在几个节点的台账里，并标出「还涉及：B1、C3」。
4. 一个提交的所有文件都是 `unrelated`，它才进 `_unrelated.md`，并写明原因（规则表里每条 unrelated 规则都要带一句原因）。
5. **任何文件都不能落空**。规则表要有兜底；跑完以后如果有文件没被任何规则命中，脚本要报错退出，并列出这些文件。

规则表要覆盖到的映射（参考 ROADMAP 的节点范围，下面是起点，不完整的地方你要补齐）：

| 上游路径 | 节点 |
| --- | --- |
| `packages/core/src/<组件目录>/` | 按 ROADMAP 里 C1–C16 表格的「涵盖组件」映射。子组件（例如 `DropdownMenuItem`）跟着父目录走 |
| `packages/core/src/theme/` | B1 |
| `packages/core/src/reset*`、`inputFontFloor*` | B2 |
| `packages/core/src/hooks/` | B3 |
| `packages/core/src/Layer/`、`Overlay/` | B4 |
| `packages/core/src/i18n/`、`packages/core/locales/`、`packages/core/src/Icon/` | B5（Icon 注册表的改动归 B5；Icon 组件外观 C16 也会用到，标「还涉及 C16」即可，由你在规则里定一种一致的处理） |
| `packages/core/src/BaseProps.ts`、`naming*`、`InteractiveRoleContext/`、`SizeContext/` | B6 |
| `packages/core/src/utils/` | B7 |
| `packages/core/src/HStack/`、`VStack/`、`VisuallyHidden/` | C14 |
| `packages/themes/neutral/` | D1 |
| `packages/themes/<其它6套>/` | D2 |
| `packages/themes/probe/` | D3 |
| `packages/cli/` 下和模板有关的 | D5 |
| `packages/cli/` 下 codemod 有关的 | D6 |
| `packages/cli/` 其它 | D4 |
| `packages/richtext/` | F1a（`.tsx` 组件文件归 F1b） |
| `packages/charts/` | F2a（`.tsx` 组件文件归 F2b） |
| `packages/lab/src/<组件>/` | 按 ROADMAP 里 F3a–F3e 的组件列表映射 |
| `packages/vega/` | F5 |
| `packages/build/` | F6 |
| `apps/example-*`、`apps/storybook/`、`.husky/`、React 专属构建配置、StyleX 校验等 | unrelated，写明原因 |
| `apps/docsite/` | 先看内容再定：和组件文档有关的归对应组件节点或 D7，纯站点框架的归 unrelated |
| `.changeset/`、各包 `CHANGELOG.md` | unrelated（我们有自己的 changeset） |

`packages/core/src/` 下面的根文件（`index.ts`、`README.md`、`*.d.ts`、各种 `*.test.*`）也要逐个定好归属，不能落空。
上游有、ROADMAP 却没列出的组件目录，先归到最接近的节点，同时在 `_summary.md` 的「需要总控确认」一节里列出来。

## 每个节点台账的格式

```markdown
# C3 选择器家族 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 N 个提交 · 其中破坏性 M 个

## 破坏性改动

- [ ] `5777977fe` feat(selectors)!: FR10 prop targets for Selector, MultiSelector, ComplexSelector (#7341)
  - 文件：Selector/Selector.tsx、MultiSelector/MultiSelector.tsx …（超过 8 个时写「等 N 个」）
  - 规范文档：Selector/Selector.spec.md
  - 还涉及：B6、D6
  - 链接：https://github.com/facebook/astryx/commit/<完整哈希>

## 新功能 / 修复 / 其它
（按类型分小节：feat、fix、perf、refactor、test、docs、其它。小节内按提交时间从旧到新排序）
```

- 破坏性的判断：标题里类型后面带 `!`（例如 `feat(core)!:`），或者提交正文里出现 `BREAKING CHANGE`。
- 「规范文档」一行只列 `.spec.md` 和 `.doc.mjs` 文件，它们是对齐上游的主要依据。
- 勾选框留空，给后续节点的实现者用。

`_summary.md` 里放一张总表：节点、提交数、破坏性数、涉及的文件数；还有「需要总控确认」一节。

## 稳定性要求

- 同样的输入跑两次，产物要逐字节相同。排序规则写死，不依赖文件系统顺序，也不写生成时间。
- 起点和终点做成命令行参数，默认值是 `96f9917f` 和 `v0.7.1`。上游仓库路径也做成参数，默认 `../astryx-upstream`（相对于仓库根目录），也可以用环境变量 `ASTRYX_UPSTREAM_DIR` 指定。
- 运行方式：`node scripts/upstream-ledger.mjs [--from <rev>] [--to <rev>] [--upstream <dir>] [--out <dir>] [--check]`。`--check` 只比较不写入，产物不一致时退出码为 1。

## 测试要求

`tests/upstream-ledger.test.ts` 不依赖真实的上游仓库。在临时目录里用 `git init` 造一个小仓库，做几个提交，覆盖下面这些情况：

- 普通提交只归一个节点。
- 一个提交跨两个节点，两边都出现，并互相标出「还涉及」。
- 破坏性提交：`!` 和 `BREAKING CHANGE` 两种写法都能识别。
- 全部是无关文件的提交进 `_unrelated.md`。
- 有文件没被规则命中时报错。
- 跑两次产物相同。

另外，归类规则本身写几条单元测试，比如给定路径，断言它映射到哪个节点。

## 自测清单

1. `node scripts/upstream-ledger.mjs` 在真实上游上跑通，没有落空的文件。
2. 再跑一遍 `node scripts/upstream-ledger.mjs --check`，退出码是 0。
3. 抽查几个节点台账（比如 C3、C9、B1），确认上面列的上游破坏性提交（#7341、#7389、#7302 等）出现在正确位置。
4. `pnpm vitest run --maxWorkers=2 tests/upstream-ledger.test.ts` 通过。
5. `pnpm lint` 和 `pnpm typecheck` 通过。最后再跑一次完整的 `pnpm check`，它包含构建，会比较慢。
6. 新写的源码文件每个都不超过 500 行。

## 提交与回报

- 在分支上提交，提交信息用中文，例如 `feat: 新增上游差异台账脚本`。不要推送，不要开 PR。
- 写回报文件 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/A1/impl-1.md`（注意：写在主仓库这个路径，不写在工作区里），内容包括：
  1. 做了什么，新增和修改了哪些文件。
  2. 自测清单每一项的结果，附上关键命令的输出。
  3. `_summary.md` 里的总表，以及「需要总控确认」的内容。
  4. 你自己拿不准、或者故意没做的地方。
- 你的最终回复用中文，300 字以内，说明结果和回报文件位置。
