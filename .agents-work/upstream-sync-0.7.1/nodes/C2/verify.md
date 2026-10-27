# C2 勾选与开关 · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：当前仓库检出，分支 `sync/c2-checkable`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-C2/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项**跑两遍**：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能这样开：`pnpm visual <组件> --out /tmp/verify-C2/visual`，或者 `node scripts/swarm/browser-lock.mjs run --purpose C2-verify -- <命令>`。拿不到锁就排队，不许私开。
  - 文档站端口用实现者回报里写的端口；没写就用 `5173`。同一时刻只开一个，用完关掉。
  - 看截图用读图工具直接读 PNG 文件。
  - **涉及界面时，给总控、再转给用户的主证据图必须来自文档站组件页整页。** 中文打开 `http://127.0.0.1:<端口>/components/<slug>`。图里要能看到文档壳，并滚到有实质 Demo 的段落。`pnpm visual` 只用于内部对像素。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

1. 文档站中文页整页，至少覆盖复选列表、单选列表、开关、滑块、分段控件中的 4 个页面，并同时有桌面浅色、桌面深色、390px 浅色、390px 深色。每张图都能看到侧栏或顶栏，并滚到有实质 Demo 的段落。禁用项的指针看起来是普通箭头。滑块刻度在已填充一侧跟填充色，未填充一侧跟轨道色。
2. 键盘：滑块方向键按步长移动；Home 到最小值；End 到最大值，即使最大值不在步长网格上（min 0、max 100、step 3，从 0 按 End 应变为 100）。横向从右到左时，左方向键增大、右方向键减小。分段控件标签过长时单行省略，控件不超过容器。
3. 读屏：复选列表外层是 group，名字是列表标签。富文本标题的可见文字是复选框的名字，说明挂在 `aria-describedby` 上。开关变忙碌时，文档级 polite 播报区出现当前语言的加载文案，组件内部没有单独的 `role="status"` 播报节点。复选框标签同时有 `astryx-field-label` 和 `astryx-checkbox-label`；开关标签同时有 `astryx-field-label` 和 `astryx-switch-label`。

### 二、反向挑刺

4. 键盘操作：只用键盘可以勾选复选框、选择单选项、拨动开关、移动滑块、切换分段控件。鼠标拖过滑块之后，焦点环不出现；再按方向键，环出现。单独按 Shift 不把环叫回来。
5. 无障碍读屏：富文本标题里的链接可以单独聚焦，点链接不改变勾选或选中。显式 `ariaLabel` 覆盖富文本标题带来的名字。空说明不加 `aria-describedby`。
6. 服务端渲染：Slider 已有的 SSR 用例仍通过。Checkbox、Radio、Switch、SegmentedControl、ToggleButton 不在 `ssr-known-failures.json` 里。
7. 超长文字、空数据：分段控件超长标签单行省略，不把控件撑出容器。复选列表没有子项时，group 仍在，页面不报错。
8. 样式分层：`containerClass` 只在外壳，`controlClass` 只在本体，两者不落到原生 input 或滑块拇指上。根上直接写的 class 仍在外壳，不警告。在横向标签的 FormLayout 里，`containerClass` 不生效，开发环境警告一次。`data-testid` 在复选列表的 group、单选列表的 radiogroup、单值滑块的滑块上。
9. 图标：本节点不新增图标注册。判「过」的条件是 diff 里没有新的图标注册表，也没有把上游图标组件翻译过来。
10. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。

### 三、C 节点通用检查

11. 台账 `ledger/C2.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
12. 上游新增或改动的行为测试，都有对应的 Vue 测试，两种 NODE_ENV 下都通过。Chromium 契约文件不必逐份移植，但同一条行为要在组件测试里能看到。
13. 中英文文档的 props 都写了 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`，以及复选列表、单选列表的富文本插槽。打开中文 `/components/checkbox-list` 和英文 `/en/components/checkbox-list`，示例能操作。
14. 本节点涉及的组件都不在 SSR 已知失败名单 `ssr-known-failures.json` 里。
15. 附带了四种组合的文档站整页对照图，并且你亲眼看过。报告里每张图标明是「文档站整页」。给用户的必须写文档站 URL。
16. 改到的源码文件都不超过 500 行：`node scripts/check-line-limit.mjs` 通过。白名单里的文件没有变长。

### 四、整体

17. `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 覆盖本节点相关目录全部通过；`NODE_ENV=production pnpm vitest run --maxWorkers=2` 同一组路径全部通过；用例数相同。全量测试如果环境跑不完，要写明只跑了哪些目录，不能把没跑的写成通过。
18. `env -u NODE_ENV pnpm typecheck` 通过。相关包的 lint 通过。
19. 改动范围：`git diff $BASE --stat` 里没有 `layer/`、`ROADMAP.md`、`SWARM.md`。生成文件若有变化，`node scripts/sync-exports.mjs --check` 通过。
20. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C2/verify-1.md`，格式见 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-C2/`。
