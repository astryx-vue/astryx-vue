# C15 反馈与状态 · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游 v0.7.1 一致，代码结构不同不算问题。

## 环境

- 工作区：实现分支 `sync/c15-feedback`。`BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。临时文件放 `/tmp/verify-C15/`。
- 测试环境：命令前加 `env -u NODE_ENV`，再跑一遍 `NODE_ENV=production`。vitest 加 `--maxWorkers=2`。每条命令加 `timeout`。
- 浏览器：文档站用完关掉。给用户的图必须是文档站整页，中文地址是 `/components/<slug>`，能看到侧栏或顶栏，并滚到有实质 Demo 的段落。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、效果和上游一致

1. 打开中文文档站 `/components/banner`，桌面浅色、桌面深色、390 宽浅色、390 宽深色各截一整页，滚到「可折叠」或「状态」示例。应看到：彩色标题条、状态图标、说明在标题下面；带详情的示例可以展开和收起；通栏示例没有圆角；浮动示例有阴影。四张图都能看到文档壳。
2. 打开 `/components/spinner`。圆环是一段弧在轨道上移动，整圈不跟着转。带文字的示例，文字在圆环下面。深色页上 `onMedia` 示例的圆环是浅色。再打开 `/components/stepper`，水平步骤能看到当前步高亮，轨道上的指示点示例里指示点嵌在线上。
3. 用组件测试或浏览器确认提示条：只写 `status="error"` 时根元素没有 `role`、没有 `aria-live`；加上 `role="alert"` 后根元素是 alert。有默认插槽且不写 `collapsible` 时，详情一开始不出现，点展开后出现。`collapsible` 为 false 时没有展开按钮，详情直接在。
4. 关闭按钮：英文界面无障碍名是 `Dismiss` 加空格加标题，例如 `Dismiss Saved`；提示文字是 `Dismiss`。简体中文界面名字是 `关闭“标题”`，提示是 `关闭`。显式 `dismissLabel` 同时作为名字和提示。
5. 关掉提示条时，焦点回到打开前聚焦的元素。父组件把展开中的详情收起、且焦点在详情里时，焦点回到展开按钮。
6. 加载圈不写 `label` 也不写 `aria-label` 时，英文念 `Loading`，简体中文念 `加载中`。写了字符串 `label` 且没写 `aria-label` 时，状态元素用 `aria-labelledby` 指向可见文字，没有重复的 `aria-label`。
7. 进度条 `isIndeterminate` 时，`role="progressbar"` 上没有 `aria-valuenow`、`aria-valuemin`、`aria-valuemax`、`aria-valuetext`。有刻度时，刻度不在这个 `progressbar` 元素里面，并且可以聚焦。
8. 状态点不传图标时只有色块，没有图标节点。传入图标或图标插槽后，图标在圆点里，`aria-hidden`，圆点的 `aria-label` 仍是 `label`。
9. 步骤条 `indicatorPosition="on-track"` 时，连接线段有 `clip-path`，并且用到 `--astryx-step-connector-gap`。水平步骤条外框声明该变量默认 `0px`，列表是 `inherit`。`styles/layer.css` 的浮层根把该变量设为 `initial`。可点步骤带 `data-astryx-pressable`。禁用的上一步、下一步按钮指针是 `default`，不是 `not-allowed`。

### 二、反向挑刺

10. 只用键盘：提示条的展开和关闭按钮能被 Tab 聚焦，Enter 或 Space 能触发。进度刻度能被 Tab 聚焦。步骤条可点步骤能被 Tab 聚焦并激活。
11. 无障碍：提示条图标是 `aria-hidden`。加载圈的 svg 是 `aria-hidden`。状态点是 `role="img"`。
12. 服务端渲染：`Banner`、`Spinner`、`ProgressBar`、`StatusDot`、`Stepper`、`EmptyState`、`Skeleton` 都不在 `ssr-known-failures.json` 里。Banner 在 `defaultIsOpen` 时，服务端 HTML 里能看到详情和 `aria-expanded="true"`。
13. 超长标题和空插槽：很长且没有空格的标题会折行（样式里有 `overflow-wrap: anywhere`）。默认插槽为空时不出现展开按钮。
14. 未知或未列出的边界：提示条 `status` 不是 info、success、warning、error 时，不套用 info 的底色，也不画默认状态图标。进度值不是有限数字时，按 0 处理，不出现 `NaN`。
15. 图标：提示条、状态点、步骤条用的是现有 `FieldIcon` 或语义图标，没有新的图标注册表。
16. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。本节点没有改 `layer/` 目录，没有改 `ToastViewport.vue`。

### 三、C 节点通用检查

17. 台账 `ledger/C15.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
18. 上游新增或改动的测试里，角色、关闭命名、折叠、加载圈无障碍名、不确定进度、连接线空隙，都有对应的 Vue 测试。两种 `NODE_ENV` 下都通过，用例数相同。
19. 中英文文档都改了过时的说法：提示条页不再写「warning 和 error 使用 role=alert」。打开 `/components/banner` 和 `/en/components/banner`，示例能展开、能关闭。
20. 本节点组件都不在 `packages/core/src/ssr-known-failures.json` 里。
21. 附带了至少 4 张文档站整页图，并且亲眼看过。报告里标明是文档站整页。夹具或 `pnpm visual` overview 不算这一条。
22. 改到的源码文件都不超过 500 行，`node scripts/check-line-limit.mjs` 通过。

### 四、整体

23. `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 覆盖本节点相关测试通过；`NODE_ENV=production` 再跑一遍，用例数相同。全量测试如果没跑完，要写明原因，不能把相关测试的通过说成全量通过。
24. `env -u NODE_ENV pnpm typecheck` 通过。相关文件的 lint 通过。
25. `git diff $BASE --stat` 里没有 `layer/` 目录和 Toast 关闭栈。生成文件若有变化，`node scripts/sync-exports.mjs --check` 通过。
26. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C15/verify-<N>.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果放在 `/tmp/verify-C15/`。
