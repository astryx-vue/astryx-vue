# C6 菜单家族 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c6-menus`。
- 提交（基于 swarm-tree `4a5b9a4`）：
  - `d962313` docs(C6): 写下菜单家族的执行计划和验收清单
  - `3085ff2` feat(C6): 菜单接上按压、悬停飞出和对话框 Tab
  - `646ab86` test(C6): 补菜单按压、顶层 Escape 和对话框 Tab
  - `d8e5148` docs(C6): 更新菜单文档、台账和第 1 轮回报

## 1. 做了什么

下拉菜单接上按压打开、悬停飞出、带页眉页脚时的对话框 Tab 循环，以及随语言变化的默认名字。`DropdownMenu.vue` 和 `types.ts` 都拆到 500 行以内，并从行数白名单里删掉。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/DropdownMenu/DropdownMenu.vue` | 493 | 触发器、按压、关闭栈、焦点归还 |
| `packages/core/src/DropdownMenu/DropdownMenuFrame.vue` | 156 | 底部动作条和弹出层的 DOM |
| `packages/core/src/DropdownMenu/DropdownMenuBranch.vue` | 17 | 在层边界里面重新提供菜单上下文 |
| `packages/core/src/DropdownMenu/rowTypes.ts` | 246 | 行、分组、子菜单的类型 |
| `packages/core/src/DropdownMenu/types.ts` | 314 | 菜单自身的类型，并再导出 rowTypes |
| `packages/core/src/DropdownMenu/useMenuRegions.ts` | 153 | 对话框里的 Tab 循环 |
| `packages/core/src/DropdownMenu/DropdownMenuSubMenu.vue` | 354 | 飞出层悬停、钻入、层内上下文 |
| `packages/core/src/ContextMenu/ContextMenu.vue` | 349 | 默认名随语言 |
| `packages/core/src/MoreMenu/MoreMenuPanel.vue` | 400 | 挂载点改为 teleportTarget，内容套层边界 |
| `packages/core/src/MoreMenu/MoreMenuSheet.vue` | 300 | 底部动作条同样走挂载点 |

鼠标在触发器上 `pointerdown` 就打开；拖进行再松开，执行那一行。手指要长按约 500 毫秒才打开。底部动作条仍走点击，因为面板在按下时可能还没挂上。禁用的触发器（`isDisabled` 或 `aria-disabled="true"`）不会打开。

带页眉或页脚时，弹出层是 `role="dialog"`、`aria-modal="true"`，触发器 `aria-haspopup="dialog"`。Tab 在页眉、菜单（一个停靠点）、页脚之间循环并绕回，菜单保持打开。没有这两块时，Tab 仍关闭菜单。

子菜单飞出层用 `useMenuHover`（150 毫秒打开、离开延时、安全三角）。只接鼠标事件，键盘仍由菜单自己的方向键处理，这样左方向键能关掉飞出层。钻入模式不悬停。上下文登记在 `LayerContentBoundary` 里面，避免被层边界清掉。

链接行 `draggable="false"`。按压模型松开时如果点的是原生 `<a>`，按 `href` 跳转；修饰键点击仍交给浏览器。指针关掉菜单后，触发器带 `data-astryx-focus-ring="off"`，之后键盘再聚焦会拿掉这个属性。

菜单放得下时 `touch-action: pinch-zoom`，`data-overflow="true"` 时是 `pan-y pinch-zoom`。快捷菜单不再用 `touch-action: none`。紧凑触控查询与快捷菜单、更多菜单对齐：`(max-width: 768px) and (pointer: coarse)`。

默认名字走语言包：英文 Menu / Context menu / More options，中文「菜单」/「快捷菜单」/「更多选项」。快捷菜单的输入法判断改用 `isImeKeyEvent`。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 按压打开并在松开的那一行执行 | `useMenuPress` | 触发器外层接同一套 composable | 鼠标按下即开，拖进行松开执行一次 |
| 飞出层安全三角 | `useMenuHover` | 同一套悬停，只绑定鼠标 | 延时、三角和点击保护一致；键盘不抢焦点 |
| 页眉页脚是对话框 | `role="dialog"`，Tab 循环 | `moveDialogTab` 绕页眉、菜单、页脚 | 到头不关闭，没有这两块时 Tab 仍关闭 |
| 默认名字 | 文案目录 | `useAstryxMessages` | 不传 label 时跟当前语言 |
| 捏合缩放 | `pinch-zoom` | 同一套 `touch-action` | 放得下的菜单不抢走捏合 |
| Escape 只关最上面一层 | 关闭栈 | 菜单层 `dismissOnEscape: true`，飞出层单独登记 | 第一次只关飞出层，第二次才关父菜单 |

## 3. 和计划不一样的地方

- 关闭栈的 `dismissOnEscape` 仍是布尔。菜单层用 `true`，也就是将来的 `'close'`。待修复线程合入后对齐。没有提前写 `'close' | 'block' | 'ignore'`，也没有改 `layer/`。成员关系仍用 `registerLayerScopedContext`，没有发明 `defineLayerScopedKey`。
- `useMenuHover` 自带的键盘处理没有绑到飞出层。绑上的话方向键会走两遍，左方向键也关不掉飞出层。悬停、延时和安全三角仍然用它。
- 底部动作条不启用按压模型。点击打开的路径还在。
- 面包屑里写死的 Menu 留给 C13，本轮没改。

## 4. 台账处理

`ledger/C6.md` 共 62 条，全部勾上。已采纳 54 条，不适用 8 条。

不适用：

- `a1a6a636f`：主题兼容层由 B1 拆除，菜单没有这套旧 API。
- `1afd1fcb4`：CLI 安装提示，不是菜单运行时。
- `12a6e8a83`：手写 CSS，没有 StyleX 改写简写。
- `540f19e62`：合并 ref 是 React 的问题。
- `581f8444e`：没有 StyleX theme target，箭头直接画在 Icon 上。
- `8bf4b5136`：上游知识库生成，仓库没有这套构建。
- `980187a16`：Playwright 菜单按钮夹具；同等键盘约定由 vitest 覆盖。
- `ba59d5c99`：Playwright 结果汇总，没有菜单运行时代码。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/DropdownMenu packages/core/src/ContextMenu packages/core/src/MoreMenu` | 过 | 6 个文件，147 条 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 仍是 147 条 |
| 3 | `env -u NODE_ENV pnpm typecheck` | 过 | 退出码 0 |
| 4 | eslint 菜单目录 `--max-warnings 0` | 过 | 退出码 0 |
| 5 | `node scripts/check-line-limit.mjs` | 过 | DropdownMenu.vue 493，types.ts 314，已移出白名单 |
| 6 | `node scripts/check-no-important.mjs` 与 `node scripts/sync-exports.mjs --check` | 过 | 退出码 0 |
| 7 | 文档站整页 | 过 | 见下方路径。上游 `https://astryx.atmeta.com/components/dropdown-menu` 返回 404，没有并排图 |

文档站整页（侧栏或顶栏可见，菜单展开），未进 git：

- `/opt/cursor/artifacts/c6-dropdown-desktop-light.png`
- `/opt/cursor/artifacts/c6-dropdown-desktop-dark.png`
- `/opt/cursor/artifacts/c6-dropdown-390-light.png`
- `/opt/cursor/artifacts/c6-dropdown-390-dark.png`
- `/opt/cursor/artifacts/c6-context-desktop-light.png`

## 6. 拿不准的地方

待修复线程合入后对齐：`dismissOnEscape` 从布尔改成 `'close' | 'block' | 'ignore'` 时，菜单层保持「关掉这一层」。成员关系如果改名成 `defineLayerScopedKey`，菜单这边改登记调用即可，提供的位置已经在层边界里面。

## 给 D7 的说明

默认无障碍名字改为跟着当前语言。以前不传 `label` 时，英文环境以外也会得到 `Menu`、`Context menu`、`More options`。现在中文是「菜单」「快捷菜单」「更多选项」。调用方如果依赖那三个英文字符串、又没有自己传 `label`，需要补上。

带页眉或页脚的下拉菜单，Tab 在对话框里循环，不再把菜单关掉。没有页眉页脚时，Tab 仍然关闭。
