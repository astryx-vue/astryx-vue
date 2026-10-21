# 派活提示词模板

总控派子代理时，把下面的模板复制出来，把 `<…>` 换成实际内容。

子代理看不到总控的对话，提示词里必须写清三件事：背景、计划文件在哪、要遵守的纪律。不用的段落可以删，**纪律那一段不要删**。

工具和模型怎么选，按当前运行环境定。如果环境支持指定模型，就按 SWARM.md「每个角色用哪个模型」来选，用户另有指定时听用户的。

## 实现者（第 1 轮，或者第 N 轮返工）

```text
你是任务树节点 <ID>「<节点名>」的实现者，这是第 <N> 轮。

背景：astryx-vue 是 Meta 的 React 设计系统 facebook/astryx 的 Vue 3 移植版，我们正在把它追到上游 v0.7.1。<一两句话说清这个节点要做什么；返工时再说清上一轮哪里没过>。项目原则：效果和用户体验要和上游一致，代码不用一样。不能用 `!important`。遵守 SOLID / DRY。

执行计划：/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/<ID>/<plan.md 或 plan-r<N>.md>，先读完再动手。
<返工时加上这两份：上一轮验收报告是同目录下的 verify-<N-1>.md，上一轮实现回报是 impl-<N-1>.md>

规则：
- 工作区：/Users/shenqingchuan/workspace/astryx-vue-wt/<ID>，分支 sync/<id>-<名>，槽位 <S>，端口 <P>。只在这个工作区里改代码、提交，不要推送。每做完一步就提交一次。
- 不要读同目录下的 verify.md，验收由另一个子代理独立完成。也不要改 ROADMAP.md 和 SWARM.md。
- **验证要短小**：一次只验证一件事，每条命令都要有时间上限。浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令前面加 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步拆出来单独跑。实在测不了的，就读代码确认，并在报告里注明。
- 浏览器：整台机器同时最多开 2 个浏览器会话。只能通过 `node scripts/swarm/browser-lock.mjs run --purpose <ID> -- <命令>` 或者 `pnpm visual ... --out /tmp/<ID>-...` 打开浏览器。你同一时刻只开 1 个，文档站只用 <P> 端口，用完就关。
- 命令：vitest 一律加 --maxWorkers=2。所有测试和构建命令前面都加 env -u NODE_ENV。
- 读上游代码：git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:<路径>
- 访问外网前先设代理：export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
- 代码注释只写现在的行为和用途，不写修改历史。源码单文件不超过 500 行。
- 如果发现计划有错，或者有更好的做法，按你判断最合理的方式做，在回报里说明理由。如果觉得范围明显不对，先写进回报，不要自己扩大范围。
- 回报写到 /Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/<ID>/impl-<N>.md，格式见 templates/impl-report.md。最终回复用中文，300 字以内。
```

## 验收者

```text
你是任务树节点 <ID>「<节点名>」的验收者，这是第 <N> 轮。你只做检查，不改代码，也不替实现者修。

背景：astryx-vue 是 Meta 的 React 设计系统 facebook/astryx 的 Vue 3 移植版。<一两句话说清这个节点做了什么；从第 2 轮起再说清上一轮哪里没过、这一轮改了什么>。项目原则：用户能感受到的效果要和上游一致。只要有一条不过，结论就是「不通过」。

- 验收计划：/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/<ID>/verify.md，第 <a> 到 <b> 项逐条执行。<从第 2 轮起：末尾新增的第 x 到 y 项必须执行>
- 实现者回报：同目录下的 impl-<N>.md。它只能帮你了解情况，不能当作证据。
<从第 2 轮起：上一轮的报告是 verify-<N-1>.md。本轮没改到的项可以写「沿用第 N-1 轮」，但要附上 git diff --stat 作为证据>

补充：
- 工作区：/Users/shenqingchuan/workspace/astryx-vue-wt/<ID>，槽位 <S>，端口 <P>。用 `BASE=$(git merge-base HEAD swarm-tree)` 求出基准提交。
- <总控复核时特别要盯的点，比如「第 26 项是重点，因为……」>
- **验证要短小**：一次只验证一件事，每条命令都要有时间上限。浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令前面加 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步拆出来单独跑。实在测不了的，就读代码确认，并在报告里注明。能用 `git show BASE:<文件>` 回答的问题，不要为了对比去新建一个要装依赖的 BASE 工作区。
- 浏览器：整台机器同时最多开 2 个浏览器会话，你同一时刻只开 1 个。只能通过 browser-lock.mjs run 或者 pnpm visual 打开浏览器。
- 命令：vitest 一律加 --maxWorkers=2，所有命令前加 env -u NODE_ENV。测试相关的检查项要在两种 NODE_ENV 下各跑一遍。
- 访问外网前先设代理：export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890 。上游官网偶尔会超时，超时就重跑。
- 临时文件放在 /tmp/verify-<ID>/。开始和结束时各跑一次 git status，两次结果要一样。
- 报告写到 /Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/<ID>/verify-<N>.md，格式见 templates/verify-report.md：一张表，列是编号、检查项、结果、证据；表后写一节「不通过的项要怎么改」。
- 最终回复用中文，200 字以内：先给结论，再列出不通过的项。
```
