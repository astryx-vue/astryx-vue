# A1 上游差异台账 · 验收计划

你是验收者，只检查，不改代码。实现者的回报（`impl-<N>.md`）可以拿来参考，看他做了什么，但**不能当成证据**。每一条检查都要你自己动手重新验证。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A1`（分支 `sync/a1-upstream-ledger`）。
- 上游仓库：`/Users/shenqingchuan/workspace/astryx-upstream`，只读。起点 `96f9917f`，终点 `v0.7.1`。
- 节点范围看 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/ROADMAP.md`。
- 访问 GitHub 前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`
- 跑测试时限制并发：`--maxWorkers=2`。
- 这个节点不需要开浏览器。
- 先运行 `git status`，记下当前状态。验收结束时再运行一次，两次结果必须相同，说明你没有留下任何改动。验收过程中生成的临时文件，放到 `/tmp/verify-A1/`。

## 检查项

每一项只能判定「过」或「不过」，并写下证据：命令和关键输出。

### 一、能跑，结果稳定

1. 运行 `node scripts/upstream-ledger.mjs --check`，退出码是 0。
2. 用 `--out /tmp/verify-A1/run1` 和 `--out /tmp/verify-A1/run2` 各生成一次，再用 `diff -r` 比较，两份完全一样。
3. 把 `/tmp/verify-A1/run1` 和仓库里提交的 `.agents-work/upstream-sync/ledger/` 用 `diff -r` 比较，完全一样。
4. 在产物里搜索时间戳一类的内容（比如今天的日期、`Generated at`），一个都没有。

### 二、一个提交都不能漏

5. 自己数一遍：用 `git -C <上游> rev-list --no-merges 96f9917f..v0.7.1 | sort -u` 得到全部提交号。再从所有台账文件（各节点文件加上 `_unrelated.md`）里提取出短哈希。全集里每个提交都至少出现一次。漏掉 1 个就判不过，并列出漏掉了哪些。
6. 反过来，台账里出现的每个哈希，都在这个范围之内，不能有范围外的提交混进来。
7. 故意制造一个规则没覆盖的文件，确认脚本会报错。做法：把上游仓库复制成一个临时克隆（`git clone --shared <上游> /tmp/verify-A1/up`），在里面新提交一个 `weird/unknown.txt`，然后用 `--upstream /tmp/verify-A1/up --to HEAD --out /tmp/verify-A1/x` 运行。脚本要报错，退出码不是 0，并且列出 `weird/unknown.txt`。

### 三、归类对不对

用下面这些上游提交做抽查。每一个都要出现在**期望的节点**里。出现在别处也没关系，但期望的那个节点必须有。

| 提交 | 期望出现的节点 | 期望标为破坏性 |
| --- | --- | --- |
| 5777977fe（#7341 selectors FR10） | C3 | 是 |
| 936b1f73a（#7336 inputs FR10） | C1 | 是 |
| 2e0dbb5b9（#7337 date inputs FR10） | C5 | 是 |
| a1a6a636f（#7302 移除主题兼容层） | B1 | 是 |
| b507cdef4（#6884 BottomSheet 默认内边距） | C8 | 是 |
| dfdd77805（#5255 Banner collapsible） | C15 | 是 |
| 7ec7d16d3（#7355 reset.css） | B2 | 是 |
| 6ecd41722（#7374 matcha/y2k rem） | D2 | 是 |
| 458ff35b1（#7137 删 layout 命令） | D4 | 是 |

8. 上表每一行都对：在期望的节点里，并且破坏性标记正确。
9. 再自己挑 3 个上游提交，要求不在上表里，每个提交只改了一个组件目录。用 `git show --stat` 看它改了哪些文件，按 ROADMAP 的范围判断它该归哪个节点，再核对台账。3 个都对才算过。
10. 找一个改了多个节点的提交（比如 #7341 同时改了 cli 的 codemod）。它在每个相关节点里都出现，并且写了「还涉及」。
11. 打开 `_unrelated.md`，随机抽 5 条，逐条判断它确实和 Vue 移植无关，而且写了原因。只要有 1 条其实和移植有关（比如改了某个组件的 `.spec.md`），就判不过。
12. 上游 `packages/core/src/` 下的每个组件目录，都能在某个节点的规则里找到对应关系。如果有一些只是被兜底规则接住的，必须列在 `_summary.md` 的「需要总控确认」里。

### 四、台账格式能用

13. 打开 `ledger/C3.md`，确认满足以下几点：
    - 有勾选框。
    - 破坏性改动单独成一节。
    - 每条都有完整的提交链接，而且链接格式正确：`https://github.com/facebook/astryx/commit/<40位哈希>`。随机挑 1 个链接，用 curl 访问，确认能打开。
    - 列出了 `.spec.md` 或 `.doc.mjs`（如果这个提交改过的话）。
    - 小节内按时间从旧到新排序。抽 3 条相邻的提交，用 `git log` 核对顺序。
14. `_summary.md` 的总表里，各节点的提交数之和，等于各台账文件里条目数之和。自己数一遍核对。
15. `ledger/README.md` 写清了三件事：怎么重新生成、怎么改规则、参数有哪些。

### 五、工程质量

16. 运行 `pnpm vitest run --maxWorkers=2 tests/upstream-ledger.test.ts`，全部通过。测试**没有**依赖真实的上游仓库：把 `ASTRYX_UPSTREAM_DIR` 指向一个不存在的路径再跑一次，测试仍然通过。
17. 测试覆盖了以下情况，对照测试代码逐条确认：
    - 跨节点的提交
    - 两种写法的破坏性改动（`!` 和 `BREAKING CHANGE`）
    - 无关提交
    - 规则没覆盖到的文件会报错
    - 两次运行结果一致
18. 运行 `pnpm check`，通过。
19. 新增的源码文件都不超过 500 行，用 `wc -l` 核对。
20. 根目录 `package.json` 没有新增依赖。
21. 规则表是单独的文件，每条 unrelated 规则都写了原因。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/A1/verify-<N>.md`。N 是总控告诉你的轮次。格式如下：

```markdown
# A1 验收报告 · 第 N 轮
结论：通过 / 不通过

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | ... | 过 | `命令` → 关键输出 |

## 不通过的项要怎么改
（只描述问题和期望，不替实现者写代码）
```

- 最终回复用中文，200 字以内：先写结论，再列出不通过的项。
