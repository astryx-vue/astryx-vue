# C1 基础输入 · 验收计划

你是验收者，只检查，不改业务源码。`impl-1.md` 只用来了解实现者做了什么，不能当成证据。每一条都要亲自重跑或亲眼看。

判断标准是效果：用户看到的样子、操作手感、读屏内容、公开 API 能做到的事。代码结构和上游不同不算问题。用户已定的差异（根上的 `class` / `style` 留在本体、不做 `*Xstyle`）按已定效果验收，不按上游「丢掉并警告」验收。

## 环境

- 工作区：当前检出，分支 `sync/c1-inputs`。`BASE` = `git merge-base HEAD origin/swarm-tree`。
- 只读：开始和结束各跑一次 `git status`，两次必须相同。临时文件放 `/tmp/verify-C1/`。不改业务源码。
- 测试和构建命令前面加 `env -u NODE_ENV`。和测试有关的项再跑一遍 `NODE_ENV=production`。两遍都要通过，用例数相同。vitest 加 `--maxWorkers=2`。
- 浏览器只能用 `pnpm visual <组件> --no-proxy --out ...`，或 `node scripts/swarm/browser-lock.mjs run --purpose C1-verify --max-run 180 -- <命令>`。一次只做一件事。看图用读图工具读 PNG。
- 截图只放 artifacts（`/opt/cursor/artifacts/c1-verify/`），报告里写路径。不放进 git，不要 `git add -f` 任何 png。

## 检查项

每一项只能判「过」或「不过」。

### 一、效果

1. 样式分层：给 TextInput、TextArea、NumberInput、FileInput 传 `containerClass` / `containerStyle`，应落在 Field 外壳，不落到本体和原生控件。`controlClass` / `controlStyle` 落在本体，不落到外壳和原生 input / textarea / 文件触发按钮。在 InputGroup 里、以及横向标签的 FormLayout 里，外壳样式不生效，开发环境警告一次；本体样式仍然生效。
2. 根上直接写的 `class` / `style` 仍落在原来的本体上，不丢弃，也不出现警告，并和 `controlClass` / `controlStyle` 一起生效。FileInput 上的 class 要落到文件框，不能被吞掉。
3. 清除按钮：中文环境下悬停或键盘聚焦，提示只有「清除」。读屏名称带字段名，例如「清除姓名」。英文对应「Clear」和「Clear Name」。提示和读屏名称不能混成同一句。
4. 隐藏标签：`isLabelHidden` 和模板里的 `is-label-hidden` 让标签带上 `data-hidden`，视觉上藏起来，文字仍留在 DOM 里给读屏。旧名 `labelHidden` / `label-hidden` 仍然能藏。PowerSearch 默认隐藏；只传 `isLabelHidden=false` 时要显示。
5. 数字：输入过程中不提交。离开输入框或按 Enter 才提交。`1,234`（en-US）提交为 1234。读不出来的整段回到上一个值，不会先提交前面的数字。超出最小、最大值时收到最近的边界。无效草稿有「数字无效」或英文 “Invalid number” 的提示。
6. 多行：计数按可见字符，一个 emoji 算一个。可以输入超过上限，计数标出超出，原生 textarea 上没有 `maxlength`。
7. 左右对照图至少 4 张，覆盖桌面浅色、桌面深色、390px 浅色、390px 深色。组件要含 TextInput（看得见的 Field 标签，以及隐藏标签）、TextArea、NumberInput。有余力再拍 FileInput 或 InputGroup。图里左边是原版 Astryx，右边是 astryx-vue。亲眼看过，写下是否对齐、差在哪。

### 二、反向挑刺

8. 只用键盘：数字框 Enter 提交有效数字；组字中的 Enter 不提交。清除按钮可聚焦，名称不是空的。
9. 读屏：清除按钮的可访问名带字段名；隐藏标签仍在文档里；无效数字有 `role="alert"`。
10. 服务端渲染：TextInput、TextArea、NumberInput、FileInput、Field、InputClearButton、FormLayout、InputGroup 不在 `ssr-known-failures.json` 里，SSR 冒烟能渲染。
11. 空数据和超长：空数字草稿在不能清除时回到原值，能清除时清空。超长多行只变红计数，不把布局撑破到无法阅读（对照图里看）。
12. 图标：上传用语义名 `upload`，步进用 `numberInput:stepperDown`。没有引入另一套图标注册表。
13. `node scripts/check-no-important.mjs` 通过。本节点改过的 CSS 里没有 `!important`。

### 三、C 节点通用

14. 台账 `ledger/C1.md` 每一条都是 `- [x]`，下面有「已采纳」或「不适用」及理由。抽查至少 3 条已采纳，确认代码里确实有；抽查不适用的理由是否站得住（别的节点、StyleX、用户已定不照做）。
15. 上游这轮行为有对应 Vue 测试。`env -u NODE_ENV` 和 `NODE_ENV=production` 下，同一组路径都通过，用例数相同。
16. 中英文文档写了四个样式属性、清除按钮提示和字段名、隐藏标签正名（旧名标成别名）。TextInput、TextArea、NumberInput 的示例能在文档页上渲染。本仓库的组件说明在 props 文档和 CLI catalog，不另有一份组件 `meta.ts`；演示用的 `meta.ts` 只登记示例标题，没有新示例就不必改。
17. 附带四种组合的对照图，并且读图工具看过。
18. 新写的源码不超过 500 行。已经在白名单上的 `PowerSearch.vue`、`MultiSelector.vue` 本轮只改隐藏标签，行数不得增加（拆分归 C4、C3）。`node scripts/check-line-limit.mjs` 通过。

### 四、整体

19. `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 全量通过；`NODE_ENV=production pnpm vitest run --maxWorkers=2` 全量通过；用例数相同。全量太长就先跑本节点相关文件，再跑全量；超时就拆开，不原样重跑整组。
20. `env -u NODE_ENV pnpm check` 通过。太长就分步：`check:packages`、`lint`、`typecheck`、测试、`build`、`lint:pkg`，每步记下退出码。
21. `git diff $BASE --stat` 里没有计划以外的业务改动。`node scripts/sync-exports.mjs --check` 通过。
22. 源码注释不写修改历史。`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 的命中若不是在讲这次怎么改的，不算不过。

## 结论

只要有一条不过，结论就是「不通过」。报告写到 `nodes/C1/verify-1.md`。最终回复用中文，200 字以内。

## 验证操作要短小

每次只测一件事。浏览器命令 `--max-run` 不超过 180 秒。其它命令加 `timeout`。超时先拆开。脚本和结果放在 `/tmp/verify-C1/`。
