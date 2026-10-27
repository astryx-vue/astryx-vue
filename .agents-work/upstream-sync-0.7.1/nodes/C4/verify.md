# C4 PowerSearch / CommandPalette · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：`/workspace`，分支 `sync/c4-power-search`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-C4/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项**跑两遍**：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能这样开：`node scripts/swarm/browser-lock.mjs run --purpose C4-verify -- <命令>`。拿不到锁就排队，不许私开。
  - 文档站用空闲端口（实现回报里写的那个；没有就自己选一个没人用的），同一时刻只开一个，用完关掉。
  - 看截图用读图工具直接读 PNG 文件。
  - **涉及界面时，给总控、再转给用户的主证据图必须来自文档站组件页整页。** 中文打开 `http://127.0.0.1:<端口>/components/power-search` 和 `/components/command-palette`。桌面图里要看见侧栏，390 宽时要看见顶栏上的「菜单」，并滚到有实质 Demo 的段落。本环境没有上游文档站对位页时，报告写「无对位」，发单侧整页。截图放 `/tmp/verify-C4/`，不要入库。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

1. 文档站整页四种组合（桌面 / 390px × 浅色 / 深色），结构化搜索和命令面板各一套。桌面看见侧栏，390 看见顶栏「菜单」，内容滚到「字段和运算符」或「异步搜索」这类有实质控件的 Demo。无上游对位就写「无对位」。
2. 结构化搜索：聚焦后能看到字段。选布尔字段，条件立刻出现一条，编辑器不留在页面上。再点这条空条件，编辑器仍然不出现，并且 `change` 只再来一次、类型是修改。把字符串字段的运算符改成空运算符，编辑器关掉，焦点回到搜索框，条件只增加一条。
3. 在编辑器里焦点放在「取消」上按 Enter，条件不增加。数字没填成合法值时按 Enter，条件不增加，编辑器还在。
4. `containerClass` 在字段外壳上，`controlClass` 和组件根上的 class 在画边框的外框上，两者都不在原生 input 上。传给组件的 `id` 在 input 上，并和标签的 `for` 一致。
5. 命令面板禁用项的指针是 `default`，悬停没有底色。鼠标划过一项时高亮移动，列表滚动位置不变；按方向键时当前项滚进可见区域。Home / End 不改变高亮。Page Down 跳到最后一项可用项。
6. 单独渲染的 `CommandPaletteInput` 角色是 `searchbox`，无障碍名字来自标签而不是占位文字。单独渲染的 `CommandPaletteList` 保留调用方写的 `id`。放在面板里时，有结果才是 `listbox`。
7. 读屏：命令项是 `option`，禁用时有 `aria-disabled`。搜索框在面板里是 `combobox`。页脚快捷键文字跟随文档语言（中文页不是 Navigate / Select / Close）。

### 二、反向挑刺

8. 只用键盘：从字段菜单选出一个要填值的条件，在编辑器里输入后用 Enter 保存，再用左右方向键和退格删掉。命令面板用上下方向键和 Enter 选中并关闭。
9. 服务端渲染：`pnpm docs:build` 能完成。`PowerSearch` 和 `CommandPalette` 不在 `ssr-known-failures.json`。
10. 超长文字：条件值里的一串 emoji 截断后仍是完整 emoji，末尾是省略号，总字符数不超过上限。没有字段时菜单给出空状态，不把布局撑破。
11. 调用方通过 `components.empty.editor` 换了空运算符编辑器时，点已有空条件会打开这个编辑器，而不是直接提交。
12. 图标：搜索和清除用语义名（`search`、`close`），没有另一套图标注册表。
13. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。

### 三、C 节点通用检查

14. 台账 `ledger/C4.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
15. 上游这条范围内新增的行为，都有对应的 Vue 测试，两种 `NODE_ENV` 下都通过，用例数相同。至少覆盖：空运算符只保存一次、点空条件只提交一次、非法数字 Enter 不保存、命令面板 Home 不移动高亮、禁用指针、列表单独使用时保留 id。
16. 中英文文档里，结构化搜索写了外壳 / 外框样式和空运算符的保存方式，命令面板写了 Home / End 留在输入框、Page Up / Page Down 移动高亮。打开中文 `/components/power-search` 和 `/components/command-palette`，示例能操作。
17. 本节点组件都不在 SSR 已知失败名单里。
18. 附带了四种组合的文档站整页图，并且你亲眼看过。报告里标明是「文档站整页」。无对位就不要硬拼。
19. `packages/core/src/PowerSearch/PowerSearch.vue` 不超过 500 行，并且不在 `scripts/guardrails/line-limit-allowlist.json` 里。`node scripts/check-line-limit.mjs` 通过。

### 四、整体

20. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/PowerSearch packages/core/src/CommandPalette packages/core/src/inputFontFloor.test.ts packages/core/src/layer/layerCss.test.ts` 通过；`NODE_ENV=production` 同一命令通过；用例数相同。
21. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check` 都通过。
22. 改动范围：`git diff $BASE --stat` 里没有计划范围以外的文件。
23. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C4/verify-<N>.md`，格式见 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-C4/`。
