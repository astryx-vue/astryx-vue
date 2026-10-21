# C3 选择器家族 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c3-selectors`，从 `swarm-tree` 的 `71671a9` 切出。已推送，没有合并。
- 提交（基于 `71671a9`）：
  - 本文件随代码一起提交。短哈希以 `git log -1 --oneline` 为准，标题是「C3 选择器家族：样式分层、次要触发器和选项操作」。

## 1. 做了什么

1. 写了 `nodes/C3/plan.md` 和 `verify.md`。
2. Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer 接上 `useFieldPartStyling`。根上的 `class` / `style` 不丢掉、不警告。ComplexSelector 的根 class 仍在外壳；其余以前丢掉的，现在和 `controlClass` 一起落在控件上。
3. Selector、MultiSelector、ComplexSelector 的 `variant` 增加 `secondary`。静止样式用次要按钮的背景、前景和中等字重，边框为 0。`ghost` 和 `input` 保持原有外观。Selector 的 `default` 仍是默认值，画出来是 `input`。`secondary` 和 `ghost` 上请求的 attached 状态收成独立说明。
4. 选项的 `action` 由调用方提供 VNode 或组件。只要声明过的选项里有非空 `action`，弹出层在这个组件的寿命里保持 `role="grid"`。每一行两个 `gridcell`，点操作不改选择、不关闭、不重新过滤。没有 `action` 时仍是列表。Typeahead 的空状态只在网格模式使用 `presentation`。
5. `Selector.vue`、`MultiSelector.vue` 拆到 500 行以内，并从行数白名单移出。弹出层根继续带着列表类，并加上 `astryx-layer`，组件自己引入 `layer.css`。ComplexSelector 禁用指针改为 `default`。
6. 中英文文档补了变体、样式分层、`action`、Typeahead 的 `startIcon`。Selector 文档有可点的次要样式和选项操作示例。
7. 台账 108 条全部打勾。`labelHidden` 和 `variant="default"` 留给 D7，写在下面第 6 节。
8. 演练场里写了 `is-label-hidden` 的模板都打开过。Settings 的「Search」标签是 1×1、绝对定位；标题一行。横排里的 Typeahead 在没传 `width` 时用 20rem，不再把旁边的标题挤窄。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Selector/Selector.vue` | 473 | 触发器、浮层根、样式分层 |
| `packages/core/src/Selector/SelectorPanel.vue` | 223 | 列表和网格两种选项 |
| `packages/core/src/Selector/useSelectorPopup.ts` | 90 | 弹出层键盘和网格状态 |
| `packages/core/src/MultiSelector/MultiSelector.vue` | 451 | 触发器、浮层根、自定义 trigger |
| `packages/core/src/MultiSelector/MultiSelectorPanel.vue` | 260 | 搜索框和选项 |
| `packages/core/src/MultiSelector/useMultiSelectorMenu.ts` | 340 | 查询、创建行、全选、键盘 |
| `packages/core/src/ComplexSelector/ComplexSelector.vue` | 312 | 外壳与内置按钮的样式分层 |
| `packages/core/src/Typeahead/BaseTypeahead.vue` | 406 | 控件、网格键盘、弹出层 |
| `packages/core/src/Typeahead/TypeaheadMenu.vue` | 177 | 列表和网格两种结果 |
| `packages/core/src/Tokenizer/Tokenizer.vue` | 497 | 样式分层和选项操作 |
| `packages/core/src/selectors/useOptionActionGrid.ts` | 100 | 操作列的方向键和激活 |
| `packages/core/styles/typeahead.css` | — | 横排里未指定宽度时用 20rem |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| FR10 | `container*` / `control*`，StyleX 的 `*Xstyle` 另算 | 只用 B6 的四个字段。没有 StyleX | 外壳和本体能分开加 class 和行内样式 |
| 根 class | 运行时丢掉并警告 | 保留。ComplexSelector 落在外壳，其余落在控件 | 用户已定：不丢掉、不警告 |
| 次要触发器 | `input` / `secondary` / `ghost` | 同样三个值。Selector 的 `default` 画成 `input` | 静止时无边框、中性填充、中等字重 |
| 选项操作 | `action` 为 React 节点，弹出层锁成 grid | `action` 为 VNode 或组件，宿主不包额外 DOM | 点操作不改选择；没有 action 时仍是 listbox |
| 隐藏标签 | `isLabelHidden` | 正名 `isLabelHidden`，旧名 `labelHidden` 暂时留着 | 演练场的 `is-label-hidden` 能藏起标签 |
| 浮层 | 弹出层在浮层里 | 浮层根加 `astryx-layer`，组件引入 `layer.css` | 浮层文字按 B4 的层叠规则着色 |

## 3. 和计划不一样的地方

Settings 标题折行不只是因为「Search」标签露出来。标签藏好以后仍是 1×1，标题还是两行，因为 Typeahead 默认 `width: 100%`，在横排里变成整行的 flex 基准，标题只剩大约 105px。横排里、并且没有传入 `width` 时，字段改为 20rem、不再伸长。竖排和显式 `width` 仍铺满或按传入值。1440 视口下标题盒 550×40，字段 320×32。

`shell-nav` 模板把搜索放在 `#top-nav`。AppShell 认的槽名是 `topNav`，这段搜索没有挂上，预览里数不到它的隐藏标签。这不是本轮选择器的回归，没有改 AppShell。

## 4. 台账处理

`ledger/C3.md` 共 108 条，全部打勾。已采纳 92 条，不适用 16 条。

不适用：

- 没有上游那套主题兼容面或 StyleX 源码构建：`a1a6a636f`、`47b288edb`、`1232b85af`、`41ab6db2a`、`12a6e8a83`。
- iOS 输入框 16px 字号下限，选择器没有这层地板：`20229b56b`。
- 测试基建，不改变选择器行为：`1581b0900`、`b0d1e922e`。
- 上游文档站、知识库或别的组件，选择器运行时没有对应改动：`046f6ea2b`、`85155353a`、`20bae6c46`、`17044ab1e`、`98dd9837f`、`8bf4b5136`、`7d4628128`、`a8d6bf291`。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`，路径覆盖 Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer、Token、layer、Field | 过 | 24 个文件，235 条 |
| 2 | `NODE_ENV=production` 同一组路径 | 过 | 24 个文件，235 条 |
| 3 | `pnpm typecheck`；改过的选择器文件 eslint `--max-warnings 0` | 过 | 退出码 0 |
| 4 | `node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check` | 过 | 行数白名单已去掉 Selector.vue 和 MultiSelector.vue。没有新增公开导出 |
| 5 | 演练场 33 个写了 `is-label-hidden` 的模板 | 过 | 隐藏标签高度都不超过 8px。Settings 标题 40px，等于一行行高。`settings-sidebar` 展开「Legal name」后标签隐藏。`shell-nav` 的顶栏搜索没有挂上，见第 3 节 |

## 6. 拿不准的地方

留给 D7 的迁移：

- `labelHidden` 是 `isLabelHidden` 的临时别名。默认不隐藏的组件，两个名字任一为真就隐藏。PowerSearch 默认隐藏：两个都传时听 `isLabelHidden`；只传旧名时听旧名；都没传则保持隐藏。
- Selector 的 `variant="default"` 是 `variant="input"` 的别名。公开类型里还留着 `default`，默认值也仍是 `default`，`data-variant` 和样式类用的是 `input`。

横排 Typeahead 的 20rem 是为了标题不折行。调用方如果希望它在横排里继续铺满，需要自己传 `width`。
