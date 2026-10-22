# C8 BottomSheet · 执行计划

## 目标

不传 `padding` 时，底部面板的内容区四边都有和对话框一样的默认内边距（主题没写时是间距刻度 4，也就是 16px），并把这份边距交给里面的区块，让单独的 Section、表格、分隔线能贴着这条边，而不是再缩一圈。`useSheetGestures.ts` 按职责拆开，降到 500 行以内，并从行数白名单里删掉。面板上面再开一层时，Escape 先关上面那一层。

## 工作环境

- 工作区：`/workspace`，分支 `sync/c8-bottom-sheet`，从最新 `swarm-tree`（`dd1967e7`，含 C7）切出。云端没有本机 worktree，文档站用空闲端口，用完关掉。
- 动手前已读：`SWARM.md`、`ROADMAP.md` 里 C8 那一行、C 阶段 6 条、「B4 留下的事」、`ledger/C8.md`、`nodes/C7/plan.md` 与 `impl-1.md`。
- 环境纪律：测试和构建前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 浏览器纪律：同一时刻只开一个文档站。截图放 `/opt/cursor/artifacts`，不进 git。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #6884 #6883 #6938 | 不传 `padding` 时，内容四周留出间距刻度 4。主题如果给 bottom-sheet 写了各边不同的内边距，按各边生效。传 `0` 则内容贴边。单独的 Section 会顶掉这层边距；表格和分隔线会伸到这条边，不会缩在里面。面板自己不继承外面容器的边距。 |
| #7225 | 面板里再打开气泡或菜单时，Escape 先关最上面那一层，不会把面板一起关掉。`required` 自己不关，但会吃掉按键，不让它漏到后面的层。输入法拼字中的 Escape 不关面板。非模态面板只有焦点在面板里时，Escape 才关它。 |
| #7388 | 用鼠标或手指关掉面板后，焦点回到触发器，但不亮出一圈焦点环。键盘关掉的仍会亮。 |
| #5335 | 面板上没有「禁止」指针。拖拽条仍是抓住的手型。 |
| #6301 | 内容溢出、面板成为 Tab 停靠点时，如果里面第一个就是普通按钮或链接，Tab 进来直接落到那个控件上。 |
| #7192 #7198 | 第二根手指是缩放，交给浏览器。已经开始的拖动会被取消，面板回到刚才的档位。 |
| #7168 | 手指下面如果还有一层自己能滚的盒子，而且那一层还没滚到头，拖动先滚那一层，不带动整块面板。 |
| B4 浮层根 | 面板根带 `astryx-layer`，组件通过 `scopedProvide` 带上 `layer.css`，文字不继承触发器所在位置的排版。 |

## 上游依据

- 台账条目：`ledger/C8.md` 全部 61 条。
- 上游源码：`packages/core/src/BottomSheet/BottomSheetPanel.tsx` 的内容区内边距、`BottomSheet.tsx` 与 `BottomSheetSwitcher.tsx` 的 `useLayerDismissal`、`BottomSheet.spec.md` 的默认边距、`BottomSheetPanel.test.tsx` 的 container padding。
- 上游测试：`BottomSheetPanel.test.tsx` 的 container padding、`BottomSheet.test.tsx` 的边距传递和 Escape。行为改写成 Vue 测试，不搬 Playwright 夹具。

查上游用 `git -C /tmp/astryx-upstream show v0.7.1:<路径>`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| StyleX 把 padding 降成 `--container-padding-*`，再让 padding 读这份变量 | 和 Card 一样：样式表写主题变量链，`data-padding` 覆盖成间距刻度，padding 读已发布的 `--container-padding-*` | 不传时四边是主题链，最后落到 `--astryx-spacing-4`；显式档位四边相同；子元素用同一份数字去抵消 |
| `useLayerDismissal` | 面板和切换器各自 `pushLayer`，点外面不关（遮罩点击仍由对话框自己处理） | Escape 只打最上面一层；非模态不抢页面上的 Escape |
| `focusForLastInput` | 关闭后走已有的 `focusForLastInput` | 指针关闭不画环，键盘关闭照常画 |
| 手势文件 1700 行 | 过渡等待、拖动计算、指针会话拆成三个模块，主文件只编排 | 拖动、停靠、关闭的结果不变 |

涉及图标的地方继续用语义名。本节点不新增图标。

**不搬的手感公式：** 松手停靠仍按拖动方向里的最近档。上游 #7170 用惯性把落点再往前抛，套到现有测试的那次拖动上会直接关掉面板。这一轮不改这条公式。

## 任务范围

- 要改：
  - `packages/core/styles/bottom-sheet.css`（默认边距链、发布 container / layout padding、拖拽条把缩放留给浏览器）
  - `packages/core/src/BottomSheet/BottomSheetPanel.vue`（`data-padding`、滚动键盘委托、嵌套深度）
  - `packages/core/src/BottomSheet/useSheetGestures.ts` 及拆出的 `sheetTransition.ts`、`sheetDragMath.ts`、`sheetPointerSession.ts`
  - `packages/core/src/BottomSheet/useSheetLayerDismiss.ts`，`BottomSheet.vue`、`BottomSheetSwitcher.vue`
  - `packages/core/src/BottomSheet/BottomSheet.test.ts`、`BottomSheetSwitcher.test.ts`
  - `scripts/guardrails/line-limit-allowlist.json`
  - 中英文文档里内边距那一段
  - `ledger/C8.md`
  - 本目录的 `verify.md`、`impl-1.md`
- 不碰：
  - `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`
  - 滚动锁的实现（C7 已定，继续用 overflow）
  - Dialog、菜单、选择器的关闭栈登记
  - 生成文件，除非 `pnpm sync` 或 catalog 检查要求

## 开发步骤

1. 写本计划和 `verify.md`。
2. 内容区改成 Card 那种边距链：不传 `padding` 时读主题变量，最后是间距 4；传入档位时四边用该档；同时发布 `--container-padding-*` 和 layout padding。面板根继续是 `astryx-layer`，容器边距在根上归零。
3. 把过渡等待、拖动计算、指针会话从 `useSheetGestures.ts` 拆出去。主文件降到 500 行以内，从白名单删除。第二指取消拖动。手指下的滚动盒子还没到头时，不把拖动交给面板。
4. 独立面板和切换器加入关闭栈。非模态的 Escape 仍只在事件打到对话框时关闭。指针关闭后的焦点归还不画环。溢出时接上已有的滚动键盘委托。
5. 台账 61 条写结论。更新中英文文档里内边距的说明。跑相关 vitest 两种 `NODE_ENV`、typecheck、eslint、行数、`!important`、导出检查。截文档站整页。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 `packages/core/src/BottomSheet`、`packages/core/src/Theme/registry.test.ts`、`packages/core/src/layer/layerCss.test.ts`，全部通过。
2. `NODE_ENV=production` 同一路径，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check`。改到渲染的话再跑 `env -u NODE_ENV pnpm docs:build`。
4. 文档站中文 `/components/bottom-sheet`：桌面与 390px、浅色与深色。打开一个有内容的面板。图放 `/opt/cursor/artifacts`，能看见侧栏或顶栏上的「菜单」。无对位，不拼上游图。
5. 新写和改到的源码不超过 500 行。`useSheetGestures.ts` 不在白名单里。样式里没有 `!important`，也没有 `cursor: not-allowed`。

## 提交与回报

- 提交信息用中文。分几次提交。完成后推送 `sync/c8-bottom-sheet`，开 draft PR，base 为 `swarm-tree`，标题 `C8 BottomSheet`。
- 不改 `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`，不合并。
- 回报写 `nodes/C8/impl-1.md`。
- 最终回复用中文：摘要和 PR 链接。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/c8-*`。
