# C3 选择器家族 · 执行计划

## 目标

选择器的外壳和本体可以分开加样式。`Selector`、`MultiSelector`、`ComplexSelector` 的触发器都能选表单框、次要按钮、幽灵按钮三种样子，次要按钮和当前主题的次要按钮同一套静止外观。选项可以在旁边放一个操作，点它不会把这一项选上。演练场里写了 `is-label-hidden` 的模板，标签藏起来，标题不再被挤折行。

## 工作环境

- 工作区：当前仓库检出 `/workspace`，分支 `sync/c3-selectors`，从 `swarm-tree` 切出。云端没有本机 worktree 路径，不使用 `scripts/swarm/worktree.mjs`。
- 动手前先读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md` 的「对齐上游的标准」「不用 `!important`」「跑检查时的环境」「验证操作要短小」。
  - 台账 `.agents-work/upstream-sync-0.7.1/ledger/C3.md`。
  - ROADMAP 里 C3 那一行，以及「B4 留下的事」「C 阶段全体的共同要求」。
  - B6 的 `packages/core/src/Field/fieldParts.ts`，C1 已经接上的 `useResolvedLabelHidden`。
  - 上游 v0.7.1：`docs/specs/AST-079-selector-trigger-hierarchy/spec.md`、`docs/specs/AST-058-option-actions/spec.md`。
- 环境纪律：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多 2 个浏览器会话。
  - 用 `node scripts/swarm/browser-lock.mjs run --purpose <说明> -- <命令>` 开浏览器。
  - 文档站用空闲端口，用完关掉。不占用本机 worktree 槽位。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| FR10（#7341、#7339） | 可以单独给字段外壳、控件本体加 class 和行内样式。两组不会串到对方身上，也不会落到原生 input 或触发按钮上。在 InputGroup 里、以及横向标签的 FormLayout 里，外壳样式不生效，开发环境警告一次。 |
| 隐藏标签 | 演练场模板写 `is-label-hidden`。Typeahead、Tokenizer、MultiSelector 认这个名字，旧名 `labelHidden` 仍能藏。Settings 标题旁不再露出「Search」。 |
| 次要触发器（#7252、#7548，AST-079） | 三个选择器的 `variant` 都是 `input`、`secondary`、`ghost`。`secondary` 静止时和主题的次要按钮一样：默认主题下无边框、中性填充。`ghost` 和 `input` 保持原样。`secondary` 和 `ghost` 上请求的 attached 状态收成独立说明，不把工具栏撑高。 |
| hasCreate（#6829） | 多选在可搜索、且输入和任何标签都不相同时，第一行是「创建」。选中后变更里带上创建信息。加载时不出现这一行。 |
| trigger 插槽（#6827、#6689） | MultiSelector 和 ComplexSelector 可以用自己的控件挂面板。绑定铺到控件上，面板以它为锚点。 |
| 选项操作（#6828，AST-058） | 选项上的 `action` 是调用方自己画的控件。只要有一项带了它，弹出层从列表变成两列网格：点操作不会改选择，方向键能走到操作上，回车执行它。没有 `action` 时仍是列表。 |
| 禁用指针（#5335） | ComplexSelector 禁用时指针是 `default`。Token 已经是 `default`。 |
| 浮层文字（B4） | 选择器弹出层根带 `astryx-layer`，组件自己引入 `layer.css`。 |

## 上游依据

- 台账条目：`ledger/C3.md` 全部 108 条。效果已经存在的标已采纳；只改上游文档、测试脚手架或我们从未有过的表面的，标不适用并写理由。
- 上游源码：`packages/core/src/Selector`、`MultiSelector`、`ComplexSelector`、`Typeahead`、`Tokenizer`，以及 AST-079、AST-058。
- 上游测试：各组件的 `*.fr10.test.tsx` 用 Vue 测试覆盖同样的落点，不断言 React 结构。选项操作按 AST-058 的用户可见行为写测试。

查上游用 GitHub 上 `v0.7.1` 的规范原文。本环境没有 `/tmp/astryx-upstream`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `containerClassName` / `controlClassName`，外加 StyleX 的 `*Xstyle` | 只用 B6 的 `containerClass`、`containerStyle`、`controlClass`、`controlStyle` | 外壳和本体都能加 class 和行内样式。没有 StyleX |
| 根上的 `className` 在类型里是错误，运行时丢掉并警告 | 根上的 `class` / `style` 保留。以前被丢掉的，现在落到本体上，和文本框一样 | 用户已定：不丢掉、不警告。ComplexSelector 以前落在外壳，继续落在外壳 |
| `action?: ReactNode` | 选项上的 `action` 接受 `h()` 得到的 VNode 或组件。宿主只负责放进格子，不包一层额外的 DOM | 调用方自己画按钮，点它不改选择 |
| `renderTrigger` | 作用域插槽 `trigger`，ComplexSelector 同时保留 `renderTrigger` | 面板挂在调用方的控件上 |
| 触发器变体 `input` | `input` 是正名。Selector 以前的 `default` 留作别名，画出来和 `input` 一样 | 旧调用点不用改，新代码用 `input` |

图标继续用语义名和 `defineTheme({ icons })`。不引入上游的图标注册表。

## 任务范围

- 要改：
  - Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer、BaseTypeahead 的样式分层、次要变体、选项操作。
  - `fieldStatusPlacement`：`secondary` 和 `ghost` 把 attached 收成独立说明。
  - `complex-selector.css` 的禁用指针。
  - 拆出列表面板，让 `Selector.vue`、`MultiSelector.vue` 不超过 500 行，并从行数白名单移出。
  - 选择器弹出层根加上 `astryx-layer`。
  - 中英文文档的属性和可交互示例。
  - 台账 `ledger/C3.md` 的结论。
- 不碰：`ROADMAP.md` 的状态、别的节点的 `verify*.md`、PowerSearch（C4）、日期选择器（C5）、生成文件（本轮不新增公开导出，不跑会改写导出的 sync）。
- 范围不对时：先停下，写进回报，不自己扩大。

## 开发步骤

每做完一步，相关测试通过以后就提交一次。

1. 写本计划和验收计划。
2. 样式分层：五个组件接上 `useFieldPartStyling`。补落点测试。
3. 次要变体：三个选择器接受 `secondary`，静止样式对齐次要按钮。`default` 仍是 `input` 的别名。状态说明按变体改落点。
4. 选项操作：有 `action` 时弹出层变成两列网格。补键盘和点击测试。
5. 拆分 `Selector.vue`、`MultiSelector.vue`，移出白名单。弹出层根加 `astryx-layer`。ComplexSelector 禁用指针改为 `default`。
6. 中英文文档补上变体、样式分层和选项操作，示例可以点。
7. 台账 108 条全部打勾并写结论。回报写明留给 D7 的别名。
8. 浏览器打开所有写了 `is-label-hidden` 的演练场模板，确认标签隐藏、标题不折行。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2`，路径覆盖 Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer、Token、Field/statusPlacement、layer。
2. `NODE_ENV=production pnpm vitest run --maxWorkers=2`，同一组路径，用例数相同。
3. `env -u NODE_ENV pnpm typecheck`，以及改过文件的 eslint。
4. `node scripts/check-line-limit.mjs` 和 `node scripts/check-no-important.mjs`。
5. 浏览器打开演练场里所有使用 `is-label-hidden` 的模板。
6. 新写和改到的源码文件不超过 500 行。

## 提交与回报

- 在 `sync/c3-selectors` 上提交，提交信息用中文。可以分几次提交。推送后开向 `swarm-tree` 的 PR，不合并。
- 不要改 `ROADMAP.md` 的节点状态。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/C3/impl-1.md`，格式见 `templates/impl-report.md`。写明 `labelHidden` 和 Selector 的 `variant="default"` 要进 D7。
- 最终回复用中文，说明做了什么、自测结果、PR 链接、留给 D7 的点。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/c3-*`，保证可以重跑。
