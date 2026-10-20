# 上游差异台账

这个目录记录「上游 astryx 在 `96f9917f`（0.4.1）到 `v0.7.1` 之间改了什么，每一条该由哪个任务树节点追」。
除了这份 README，目录里的文件都由脚本生成，不要手改。

## 文件

| 文件 | 内容 |
| --- | --- |
| `<节点ID>.md` | 这个节点要追的上游提交，每条一个勾选框。没有提交的节点不生成文件。 |
| `_unrelated.md` | 改到的文件全部和 Vue 移植无关的提交，每条写明原因。 |
| `_summary.md` | 总表（每个节点的提交数、破坏性数、文件数）、「需要总控确认」、按提交追加的归属、规则命中统计。 |

## 节点实现者怎么用

1. 打开 `ledger/<你的节点ID>.md`。先看「破坏性改动」，再按 feat、fix 等小节往下看。
2. 每条下面有：
   - **文件**：这个提交改到的、归你这个节点的文件。`packages/core/src/` 前缀省掉了。
   - **规范文档**：`.spec.md` 和 `.doc.mjs`，这是对齐上游的主要依据，先读它们。
   - **测试**：上游改动的测试，要改写成 Vue 测试。
   - **归入原因**：只有按提交追加的条目才有，说明为什么文件不在你名下也要你处理。
   - **还涉及**：同一个提交也出现在哪些节点的台账里。改动有交叉时，先和那些节点对齐，避免两边重复做或都没做。
   - **链接**：上游提交页面。
3. 处理完一条，把 `- [ ]` 改成 `- [x]`，并在条目下加一行 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。ROADMAP 要求每条都要有结论。
4. 打勾和结论写在你自己的节点分支上，和代码一起提交。

查上游文件内容时用上游仓库：

```sh
cd ../astryx-upstream
git show <提交号>                      # 看整个提交
git show v0.7.1:packages/core/src/Selector/Selector.spec.md   # 看 v0.7.1 时的文件
```

上游是不完整克隆，第一次读某个文件时会从 GitHub 拉取，需要先设代理：

```sh
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

## 重新生成

```sh
node scripts/upstream-ledger.mjs            # 生成并写入本目录
node scripts/upstream-ledger.mjs --check    # 只比较，不一致时退出码 1
```

参数：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `--from <rev>` | `96f9917f` | 起点，不包含它自己 |
| `--to <rev>` | `v0.7.1` | 终点，包含它自己 |
| `--upstream <dir>` | `../astryx-upstream` | 上游仓库目录，相对仓库根目录。也可以用环境变量 `ASTRYX_UPSTREAM_DIR`。在 git worktree 里跑时，还会找主工作区旁边的 `astryx-upstream` |
| `--out <dir>` | `.agents-work/upstream-sync/ledger` | 输出目录 |
| `--check` | 关 | 只比较不写入 |

退出码：0 成功；1 `--check` 发现不一致，或参数、版本号有误；2 有文件没被任何规则命中。

同样的输入跑两次，产物逐字节相同。排序规则写死在脚本里，不写生成时间。

注意：重新生成会覆盖节点文件里已经打的勾。各节点只在自己分支上打勾；要重新生成时，先在 `swarm-tree` 上生成，各节点再 rebase。

## 归类规则

规则在 `scripts/upstream-ledger/rules.mjs`。归类只看提交改到的文件路径，不看标题。

1. 每个文件从上往下匹配 `RULES`，第一条命中的规则决定它归哪些节点，或者判为无关（无关规则都带一句原因）。
2. 一个提交的文件落在几个节点，提交就出现在几个节点的台账里，并互相标「还涉及」。
3. 一个提交的文件全部无关，它才进 `_unrelated.md`。
4. 路径归类之后，再追加两种归属：
   - `COMMIT_PINS`：ROADMAP 点名由某节点处理、但没改到该节点路径的 PR（例如 B6 的 #7331）。
   - `BREAKING_NODES`：所有破坏性提交都追加到 D7，因为迁移指南要逐条覆盖它们。
5. 破坏性的判断：标题类型后面带 `!`，或者正文里有 `BREAKING CHANGE`。
6. 有文件没被任何规则命中，脚本报错并列出这些文件，不写产物。

### 怎么改规则

- **组件换节点**：改 `CORE_DIR_NODES`（core 组件目录）或 `LAB_DIR_NODES`（lab 组件目录）里的名单。
- **上游新增了目录，脚本报落空**：在 `RULES` 合适的位置加一条。比较具体的规则放在宽泛的规则前面。
- **判为无关**：用 `unrelated(id, pattern, 原因)`，原因要让人看懂为什么和 Vue 移植无关。
- **归属是你自己判断的、ROADMAP 没写明**：`to(id, pattern, nodes, review)` 的第四个参数写一句说明，它会出现在 `_summary.md` 的「需要总控确认」里。
- **规范记录和知识库文档**：改 `SPEC_NODES`、`SPEC_UNRELATED`、`KNOWLEDGE_DOC_NODES`、`KNOWLEDGE_DOC_UNRELATED`。
- **新增节点**：先在 `NODES` 里登记，`validateRules()` 会检查规则里用到的节点都登记过。

改完以后：

```sh
pnpm vitest run --maxWorkers=2 tests/upstream-ledger.test.ts
node scripts/upstream-ledger.mjs
git diff --stat .agents-work/upstream-sync/ledger   # 看看哪些台账变了
```
