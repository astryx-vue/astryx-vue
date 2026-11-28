---
name: upstream-sync
description: 把 astryx-vue 跟进到上游 meta/astryx 的新版本。用在「追上游」「同步 v0.x.y」「处理 upstream-sync/pending 清单」「派代理移植一批上游提交」这类任务上。
---

# 追上游（upstream-sync）

astryx-vue 是 React 组件库 meta/astryx 的 Vue 3 移植。追上游的目标：**用户看到的样子、用起来的手感和上游一致**，代码不用照抄。动效（时长、曲线、弹簧、手势跟手、进退场）是上游的长处，要还原，见 `docs/adr/0002-motion-fidelity.md`。

## 一轮同步的全貌

1. **定目标版本，冻结**。看 `package.json` 的 `upstream.syncedTo`（起点）和上游最新稳定标签，选一个终点标签。一轮做完前终点不变；上游在这期间发的新版留给下一轮。
2. **生成清单**。GitHub 上手动跑 Upstream Sync 工作流（`apply: true`，`to` 填终点标签），它更新 `upstream-sync/pending` 分支上的 `docs/upstream-sync/pending.md` 和汇总 PR。本地查看：
   `git worktree add .claude/worktrees/pending upstream-sync/pending`
3. **自动分诊**。`node scripts/upstream-sync-checklist.mjs triage --checklist <pending.md> --write` 按 `scripts/upstream-sync/triage-rules.mjs` 把明显不适用的（React 渲染时机、StyleX、上游 CI 等）先勾掉。`status` 看每个组件族还剩多少。
4. **切任务**。`worklist --family <族> --out /tmp/tasks/<任务>.txt` 导出一族没勾的条目。一个任务 10～40 条为宜，太大就按版本段切成 -1、-2。
5. **派代理**（见下文）。每个代理一个 worktree、一个任务文件、一个结果文件。
6. **验收、合并、勾选**（见下文）。
7. **复判暂缓**。所有族做完后，把结果里「暂缓」的条目汇成一份，按缺的设施归类（例如「BottomSheet 打开顺序栈」「Drawer 非模态」），能做的再派一轮。剩下真正缺大块设施的，在清单里写清缺什么，留给专门的任务。
8. **收尾**。全部勾完后：在汇总 PR 里把 `package.json` 的 `upstream.syncedTo` 改成终点标签，合并汇总 PR；整理发版说明（changeset 汇总）。然后开始下一轮。

## 派代理

- 共用说明在本目录 `brief.md`，每轮开始前复制到 `/tmp/sync-brief.md`，把里面的 `<起点标签>`、`<终点标签>`、`<上游克隆路径>` 换成本轮的。代理的提示词只写：任务名、任务文件、结果文件、分支名、这批的特别注意事项、别的代理在动哪些文件。
- 代理读上游用终点标签：`git -C <上游克隆> show <终点标签>:<路径>`，单个提交 `git -C <上游克隆> show <hash>`。上游克隆是 partial clone，按需拉取。
- 模型分工：动效、手势、焦点、弹层定位这类难活用 Opus；文档、CLI、模板、主题文案这类用 Sonnet。
- 同时跑的代理别超过 4～5 个，且彼此不碰同一批文件（组件目录、`apps/docs/styles/global.css` 这类大共享文件要特别说明）。
- 代理不合并 PR、不动清单、不用 `git stash`（stash 栈所有 worktree 共用）。
- 代理有时说「等后台的构建跑完」就结束了这一轮，结果文件却没写。看到这种报告，用 SendMessage 让它把构建跑完、写完结果文件再报告。
- 代理因为额度用完（429、weekly limit）中途停下时，它做到一半的工作都还在：额度恢复后用 SendMessage 让它从停下的地方继续，别重新派。
- 代理卡住的迹象：结果文件迟迟不出现，且它的 worktree 里文件修改时间很久不变（`find <worktree> -newer <某文件> -not -path '*/node_modules/*' | head`）。这时用 SendMessage 问它进度，别重复派一个新的。

## 验收、合并、勾选

1. 代理报告回来后，先看 PR 描述和结果文件：每条结论是否站得住（对照下面「常见误判」）。
2. 用本目录 `verify-merged.sh <分支> <vitest 路径…>` 在一个专用 worktree（`.claude/worktrees/verify-tmp`）里把分支和最新 main 合起来跑 check:packages、typecheck、lint 和相关测试。跑完把这个 worktree 切回 `origin/main`。
   - 满负载下个别测试会超时（例如 `calendarDateParser.roundtrip`、`useAnimatedLayout.server`、`useFingerScroll`、`swarm-worktree`），报的是 `Test timed out` 且单独重跑能过，就不算失败；断言失败（expected … received …）一定要查清。
   - 输出最后的 `regen:` 不为空，说明合起来以后 catalog.json 或 core 的 index.ts 要重新生成：让分支合 main、重新生成、推送后再验。
   - 几个 PR 都改了 catalog.json 时一个一个合：每合一个，下一个重新跑一遍 verify-merged.sh。可以写成一个后台循环，前一个全部干净才合并、再验下一个，出问题就停。
   - 公开 API 有没有变大：看 core、lab 的 index.ts 新增了哪些导出。上游只在内部用的东西，要按 `brief.md`「常见误判」里的 `unstable_` 约定处理。
3. 等 `mergeable_state` 不是 `unknown`，CI 全绿后 squash 合并：
   `gh api -X PUT repos/astryx-vue/astryx-vue/pulls/<N>/merge -f merge_method=squash`
   - 不要用 `gh pr edit`（Projects classic 报错）；改 PR 正文用 `gh api -X PATCH .../pulls/<N> -F body=@file`。
   - GitHub 偶尔回 405（还在算可合并性）：等几秒重试。
4. 勾选清单：
   `node scripts/upstream-sync-checklist.mjs tick --checklist .claude/worktrees/pending/docs/upstream-sync/pending.md --results /tmp/results/<任务>.txt`
   然后在 pending worktree 里提交、推送。
5. 清理代理的 worktree：`git -C <wt> checkout -q --detach origin/main && git worktree remove -f -f <wt>`。

## 常见误判（验收时重点看）

- **「Vue 版没有这个动画」不是「不适用」**。缺动效或手势设施的判「暂缓」，归动效与手势引擎任务；不缺的直接移植。
- 主题挂点（`defineTheme({ components })`、元素上的 `astryx-<target>` 类和 data-* 属性）Vue 有，上游新增 theme target 要移植。
- 触屏呈现（presentation、presentation hold）缺设施，判「暂缓」，不是「不适用」。
- 一个提交只做了一部分（内核做了、组件没接），判「暂缓」并写清剩什么，不能判「已移植」。代理写成「已移植」的，勾选前在结果文件里改成「暂缓」，剩下的部分并进下一批任务。
- 上游只改文档的提交，要检查中英两套 Vue 文档是否也该补。
- 上游改了组件名或把组件并入别的组件（例如 NavMenu → NavHeadingMenu），Vue 文档页的标题、对齐目标、示例归属要跟着改，公开 API 不要直接删（破坏性变更要单独决定）。

## 文档站的视觉检查（每批涉及 apps/docs 的 PR 都要做）

AI 改文档时最容易漏的是版面：总览卡片里的示例偏到一边、被截断、贴边；详情页顶部展示区内容不居中；窄屏下样式变形。

- 合并前起本地文档站，跑版面巡检：
  `node scripts/docs-layout-audit.mjs --base http://localhost:<端口> --widths 1400,768,375`
  它在三种宽度下量每张总览卡片和每个详情页展示区里「实际画出来」的范围，列出溢出、贴边、偏离中心的地方。有输出就修完再合。
  跑全部页面要几十分钟，放后台；只查几页用 `--slugs a,b --only stages`。机器很忙时页面适配可能还没跑完，脚本发现问题会等一会儿复查一次；仍有疑问就单独用 `--slugs` 重跑确认。
- 总览卡片由 `apps/docs/components/demo-infra/cardFit.ts` 自动缩放并按实际画出的范围居中；详情页展示区由 `stageCenter.ts` 居中。新示例不要再写死 `zoom`、固定宽度去「凑」居中，示例的外层盒子要贴合内容（`width: fit-content`），别比内容宽。
- 搜索框、顶栏这类 kawapress 提供的部件，样式问题先看是不是我们自己 `global.css` 的覆盖造成的（例如写死宽度），确认是 kawapress 本身的问题再去升级或反馈 kawapress。
- 改了列表、表格、代码块等正文样式，至少看一页组件页和一页指南页，确认两种页面容器（`.component-detail__body` 和 `.nagi-doc`）都生效。

## 多快好省

- 先跑自动分诊，再按族切任务；同族的提交一起做，避免同一个文件被几个代理来回改。
- 任务文件里带上别族已有的结论（`[某族名]` 缩进行），代理就不会重复移植。
- 验收只做两件事：读结论、跑 `verify-merged.sh`。不要重做代理的工作。
- 长命令放后台，靠完成通知继续，不要轮询。
- 每周一 Upstream Sync 工作流会自动 dry-run，看到上游出了新版就规划下一轮；一轮没做完不要换终点。
