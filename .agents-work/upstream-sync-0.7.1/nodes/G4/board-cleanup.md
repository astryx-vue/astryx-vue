# 看板与 issue 对齐报告（G4）

日期：2026-10-27
事实来源：`.agents-work/upstream-sync-0.7.1/ROADMAP.md` 的「当前状态总表」+ `nodes/issues.json`
对象：`astryx-vue/astryx-vue` 的全部 issue，以及 GitHub Project 1「astryx-vue 路线图」
说明：本轮只改 issue / 看板，没有改代码，没有建 worktree。

## 一、整理前后计数

### 整理前（26 张卡，全部是 issue，没有 PR 卡）

| 状态 | 张数 | 卡片 |
| --- | --- | --- |
| Done | 9 | #185 #188 #193 #194 #207 #209 #211 #215 #219 |
| In Progress | 1 | #206 |
| Blocked | 6 | #186 #187 #189 #190 #200 #202 |
| Todo | 10 | #191 #192 #195 #196 #197 #198 #199 #201 #203 #204 |
| In Review | 0 | — |

issue 总数：26，全部开放（仓库里从来没有关闭过 issue）。

### 整理后（27 张卡 = 26 个 issue + PR #218）

| 状态 | 张数 | 卡片 |
| --- | --- | --- |
| Done | 10 | #185 #188 #193 #194 #204 #207 #209 #211 #215 #219 |
| In Progress | 2 | #206（D12）、#218（跟踪 PR） |
| Todo | 15 | #186 #187 #189 #190 #191 #192 #195 #196 #197 #198 #199 #200 #201 #202 #203 |
| Blocked | 0 | — |
| In Review | 0 | — |

issue 状态：开放 16 个（#186 #187 #189 #190 #191 #192 #195 #196 #197 #198 #199 #200 #201 #202 #203 #206），关闭 10 个。
PR #218 保持打开，只是被加进了看板。

## 二、做了什么

### 1. 关闭「ROADMAP 已 ✅ 但 issue 还开着」的 10 个（每个都先评论再关闭）

| issue | 节点 | 评论里引用的 PR | PR 实际状态 |
| --- | --- | --- | --- |
| #185 | D4b | #221 #222 | 均已合入 swarm-tree |
| #188 | F1a | #208 | 已合入 swarm-tree |
| #193 | F3a | #223 | 已合入 swarm-tree |
| #194 | F3b | #205 | 已合入 swarm-tree |
| #204 | D11 | #213 | 已合入 swarm-tree（第 1 批） |
| #207 | D13 | #212 | 已合入 swarm-tree |
| #209 | D14 | #217 | 已合入 swarm-tree |
| #211 | D15 | #214 | 已合入 swarm-tree |
| #215 | D16 | #216 | 已合入 swarm-tree |
| #219 | D17 | #220 | 已合入 swarm-tree |

PR 是否合入是用 `gh pr view` 逐个核对的，不是照抄 ROADMAP 的 PR 列。

### 2. 卡片状态改正（`scripts/swarm/project-status.mjs`）

| 节点 | issue | 原状态 | 新状态 | 依据 |
| --- | --- | --- | --- | --- |
| D5b | #186 | Blocked | Todo | ROADMAP 🔵 可开工 |
| G2 | #187 | Blocked | Todo | ROADMAP ⬜ 未开始 |
| F1b | #189 | Blocked | Todo | ROADMAP 🔵 可开工 |
| F1c | #190 | Blocked | Todo | ROADMAP ⬜ 未开始 |
| F3f | #200 | Blocked | Todo | ROADMAP ⬜ 未开始 |
| G3 | #202 | Blocked | Todo | ROADMAP ⬜ 未开始 |
| D11 | #204 | Todo | Done | ROADMAP ✅ 已完成 |

其余 19 张 issue 卡的状态本来就对，没有动。

关于 Blocked：看板的 Blocked 语义是「被外部原因卡住」，而 ROADMAP 里这 6 个节点只是「还没轮到 / 前置没做完」，属于排期，所以统一改成 Todo，Blocked 列清空。

### 3. 补齐缺失的标签

- 新建 `area:core` 标签（仓库原来只有 cli / richtext / charts / lab / nuxt / docs / release / sync，core 相关 issue 无处可打）。
- #209 D14、#211 D15、#215 D16 → 加 `area:core`（原来只有 `bug`）。
- #219 D17 → 加 `area:docs`（演练场属于文档站，原来只有 `bug`）。
- 其余 22 个 issue 的标签本来就对。

### 4. 补齐看板字段

#206 #207 #209 #211 #215 #219 这 6 张卡是后来手工建的，看板的 `Area`、`Node` 两个字段都是空的，已补：

| issue | Area | Node |
| --- | --- | --- |
| #206 D12 | 文档 | D12 |
| #207 D13 | 文档 | D13 |
| #209 D14 | core | D14 |
| #211 D15 | core | D15 |
| #215 D16 | core | D16 |
| #219 D17 | 文档 | D17 |

### 5. PR 入板

唯一还开着的 PR 是 #218（swarm-tree→dev 的跟踪 PR），原来不在看板里，已 `gh project item-add` 加进去并设为 In Progress。它没有设 Area / Node，因为它不是一个节点。#218 本身保持 draft、保持打开。

### 6. 「不做」的节点 D6 / F5 / F6

**仓库里从来没有为 D6、F5、F6 建过 issue，看板上也没有对应的卡**（`gh issue list --state all` 一共只有那 26 个 issue）。所以没有 issue 可以关闭、没有卡可以移出，本轮在这三个节点上什么也没改。

处理方式的建议（需要用户拍板，本轮没做）：
- 如果想让看板如实反映「这三个不做」，最轻的做法是在看板上加一张文本式卡片或直接以 ROADMAP 为准；ROADMAP 里三个节点的状态和理由都已经写清楚了（D6 见「当前状态总表」备注，F5/F6 见 ADR 0001 第 5、6 节）。
- 如果想留 issue 痕迹，就补三个 `⏭ 不移植` 型的 issue 并立刻关闭，评论引用 ROADMAP 的理由。这会在仓库里多出 3 个已关闭 issue，是否要这样的噪音由用户定。

## 三、发现但没处理的问题

1. **看板只覆盖了 D4b 之后这一批节点。** ROADMAP 总表有 90 多个节点，A1–E4、B1–E4、C1–C16、D1–D10、F0、G1 这些都已完成并且早就合进 swarm-tree，但它们既没有 issue 也没有卡片。要不要给历史节点补 issue 是个大决定（会产生 60+ 个已关闭 issue），本轮没做。
2. **ROADMAP 与事实有出入：D11 只做了第 1 批。** 表里标 ✅ 已完成，但 PR #213 只是「中文指南和主题页」第 1 批，验收结论也写着「组件页和英文页留后续批次」。我按 ROADMAP 关闭了 #204，并在评论里写明了只完成第 1 批。**组件页与英文页的润色目前没有任何节点、issue 或卡片承载，容易掉。**
3. **D12 的后两批没有载体。** 表里 D12 写着「分 3 批……后续批次另开节点」，但总表里没有后续节点编号，issue #206 正文也没提。第 1 批做完后需要总控建节点。
4. **Done 卡片不会自动归档。** Project 的 Archive 功能 `gh` 没有现成子命令（要自己发 GraphQL `archiveProjectV2Item` mutation），所以 10 张 Done 卡仍留在看板上。看板想保持干净的话可以后续归档。
5. **`nodes/issues.json` 与看板存在两套真值。** 脚本靠这个 json 找 issue，但它不含 A–C、E 等阶段的节点；新增节点时容易忘记 `--add` 登记（#206–#219 这 6 个就没有 Node/Area 字段，本轮才补上）。建议把这个 json 当成「看板节点台账」，补历史节点时一起补。
6. **重复 issue：一个都没有。** 26 个 issue 标题互不相同，节点编号也一一对应，没有发现重复项，所以没有需要「列出来但先不关」的对象。
7. **#218 的身份有点混。** 它是 swarm-tree→dev 的长期跟踪 PR，被放进看板后会和节点卡一起被当成待办。我按「In Progress」处理；如果更希望看板只放节点，把它移出即可。
8. **PR 里没有 `Closes #xxx` 的痕迹可查。** 那 10 个 issue 一直开着，是因为 PR 正文没有自动关闭关键字（issue 模板里要求写 `Closes #<本 issue>`）。建议后续节点的 PR 模板继续坚持这一条，避免再出现「代码合了、issue 还开着」。
