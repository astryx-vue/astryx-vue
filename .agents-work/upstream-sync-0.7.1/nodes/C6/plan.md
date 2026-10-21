# C6 菜单家族 · 执行计划

## 目标

下拉菜单、快捷菜单和更多菜单用起来跟上上游 v0.7.1：鼠标按下就打开并可以拖进菜单松手执行；子菜单飞出时有安全三角；带页头或页脚的菜单是一个对话框，Tab 在里面循环；Escape 只关最上面那一层；菜单文案跟界面语言走。`DropdownMenu.vue` 和 `types.ts` 降到 500 行以内。

## 工作环境

- 工作区：`/workspace`，分支 `sync/c6-menus`，从 `swarm-tree` 切出。云端没有本机 worktree 槽位，文档站用空闲端口，用完关掉。
- 动手前已读：`SWARM.md`、`HANDOFF.md`、`ROADMAP.md` 里 C6 那一行、`ledger/C6.md`、`ledger/B4.md`、`nodes/B3/impl-1.md`、`nodes/B4/impl-1.md` 与 `impl-2.md`、`nodes/B5/impl-3.md` 里交给 C6 的段落。
- 环境纪律：测试和构建前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 浏览器纪律：同一时刻只开一个文档站。截图放 `/opt/cursor/artifacts`，不进 git。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #6681 #6826 #7241 #7160 #7197 | 鼠标在触发器上按下菜单就开，按住拖到某一行松开就执行那一行；手指按住约 500ms 才开，松在触发器上菜单保持打开。打开这次按压在落定前松手不执行任何行。指针选完把焦点还给触发器，不画焦点环。链接行不会被浏览器当成可拖拽链接。 |
| #6823 | 方向键在首尾循环，PageUp/PageDown 翻屏，打字只匹配行的标签。打开菜单的那个键如果连发，不会执行第一行。ArrowUp 打开时落在最后一行。 |
| #6824 #4936 | 鼠标滑向飞出子菜单时，走在安全三角里不会中途关掉；悬停刚打开就点一下是确认，不会马上关掉。 |
| #6682 #7304 | 手机粗指针上子菜单在原面板里逐级换内容，返回行带上父级名字。 |
| #6684 | 带标题的分组是 `DropdownMenuGroup`。 |
| #6835 #6836 #6837 #6839 | 要跳转的行是真正的链接；任意控件可以当触发器；`menuMaxHeight` 按像素抬高 300px 上限；快捷菜单触发器可以是行内 `span`。 |
| #7344 #7515 #7309 | 页头页脚在菜单外面。有页头或页脚时，这一层是模态对话框，Tab 在页头、菜单、页脚之间循环，不会把菜单关掉。页头里的输入框自己处理按键。 |
| #7201 | 菜单放得下时允许双指缩放（`pinch-zoom`）；内容超出时允许纵向滚动同时仍可缩放（`pan-y pinch-zoom`）。 |
| #7475 | 禁用的触发器用任何方式都打不开菜单。 |
| #6825 #7382 | 指针关掉菜单后焦点回到触发器，不画焦点环；之后用键盘再点到触发器，环会回来。 |
| #7167 #6457 | 快捷菜单里再开一层，Escape 只关最上面那层。菜单自己的关闭入口不会漏到嵌在里面的另一个浮层，外面的按钮组也不会把禁用传进菜单。 |
| B5 文案 | 没写名字时，菜单的无障碍名跟语言走：英文 Menu / Context menu / More options，中文 菜单 / 快捷菜单 / 更多选项。 |

## 上游依据

- 台账条目：`ledger/C6.md` 全部 62 条。
- 上游源码：`packages/core/src/DropdownMenu/`、`ContextMenu/`、`MoreMenu/`，优先 `.spec.md`。
- 上游测试：上述目录里的 `*.test.tsx` 与 `__tests__`。行为改写成 Vue 测试，不搬 Playwright 夹具。

查上游用 `git -C /tmp/astryx-upstream show v0.7.1:<路径>`。本环境已把 v0.7.1 克隆到 `/tmp/astryx-upstream`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `renderTrigger` render prop | 已有的 `trigger` 作用域插槽，把 `aria-*`、点击、按键整份交出去 | 调用方都能把菜单挂到任意控件上，菜单用控件的名字 |
| StyleX 的 `touch-action` | 手写 CSS，用 `data-overflow` 切换 | 放得下和超出时的手势与上游相同 |
| `useMenuHover` 自带列表焦点 | 悬停、安全三角、点击保护用 `useMenuHover`；方向键仍用菜单自己的焦点，因为飞出层还要管 ArrowLeft 和页头 Tab | 悬停手感一致，键盘不会一步走两行 |
| `dismissOnEscape: 'close'` | 当前栈的类型还是布尔。菜单层传 `true`，含义就是 `'close'` | Escape 仍然只关最上面一层。见下面「待对齐」 |
| 在 `scopedProvide.ts` 登记菜单 context | 不改 `layer/`。菜单模块自己调用现有的 `registerLayerScopedContext`，并在内容边界里面再 provide | 嵌进别的浮层时外层菜单的关闭入口被清掉，菜单自己的行仍能关掉本菜单 |

涉及图标的地方继续用语义名（`chevronDown`、`chevronRight`、`chevronLeft`），不引入另一套注册表。

**待修复线程合入后对齐：** 关闭栈的 `dismissOnEscape` 将从布尔改成 `'close' | 'block' | 'ignore'`，成员关系 context 将改成 `defineLayerScopedKey`。这两处 API 当前仓库里还没有。菜单按「菜单层 = close」接入现有布尔 `true`，并用现有 `registerLayerScopedContext` 登记。修复线程合入后，把布尔改成 `'close'`，把登记改成新的 key 工厂。本轮测试锁定「Escape 只关最顶层菜单」。

## 任务范围

- 要改：
  - `packages/core/src/DropdownMenu/`（拆 `types.ts`、拆 `DropdownMenu.vue`、接按压、焦点环、对话框 Tab、子菜单悬停）
  - `packages/core/src/ContextMenu/`（默认文案、IME 判断、`touch-action`）
  - `packages/core/src/MoreMenu/`（默认文案、`Teleport` 目标、内容边界）
  - `packages/core/styles/dropdown-menu.css`、`context-menu.css`
  - `scripts/guardrails/line-limit-allowlist.json`（两个菜单文件降到 500 行后移出）
  - 中英文文档：下拉菜单的按压、对话框 Tab、安全三角；快捷菜单和更多菜单的默认文案说明
  - `ledger/C6.md` 逐条打勾
  - 本目录的 `impl-1.md`
- 不碰：
  - `layer/` 目录（修复线程在改）
  - `ROADMAP.md`、`SWARM.md`
  - 别的组件家族（面包屑、选择器、导航）。B5 提到的 `BreadcrumbItem` 属于 C13，这里不改
  - 生成文件，除非 `pnpm sync` 确实需要

## 开发步骤

1. 写本计划和 `verify.md` 并提交。
2. 把 `types.ts` 里行、分组、子菜单、勾选、单选的类型拆到 `rowTypes.ts`，从 `types.ts` 再导出。页脚注释改成「Tab 在对话框里循环」。
3. 抽出菜单浮层模板，让 `DropdownMenu.vue` 降到 500 行以内。内容组件放在 `LayerContentBoundary` 里面 provide 菜单 context，并在菜单模块登记这个 key。
4. 下拉菜单接入 `useMenuPress`：按下打开、拖进菜单、松手执行；禁用触发器不开；关闭时 `cancel`。指针关闭用 `useFocusReturnVisibility` 压住焦点环。链接行 `draggable="false"`。
5. 有页头或页脚时，外框是 `role="dialog"` `aria-modal="true"`，触发器 `aria-haspopup="dialog"`。Tab 在页头、菜单、页脚之间循环，单选组算一个停靠点。
6. 飞出子菜单改用 `useMenuHover`（悬停延时、安全三角、点击保护）。钻入模式不走悬停。
7. 菜单 CSS：放得下 `pinch-zoom`，超出 `pan-y pinch-zoom`。快捷菜单同样改。
8. 三个菜单的默认无障碍名改读文案表。快捷菜单键盘里的 `isComposing` 改成 `isImeKeyEvent`。更多菜单的 `to="body"` 改成挂载点，面板内容加边界。
9. 补测试：按下打开、禁用打不开、Escape 只关最顶层、对话框 Tab 循环、链接不可拖、焦点环、悬停延时、文案。两种 `NODE_ENV` 用例数相同。
10. 更新中英文文档。台账逐条写结论。跑 typecheck、相关 lint、行数检查。截文档站整页。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/DropdownMenu packages/core/src/ContextMenu packages/core/src/MoreMenu packages/core/src/layer/scopedProvide.test.ts`，全部通过。
2. `NODE_ENV=production pnpm vitest run --maxWorkers=2` 同上路径，用例数相同。
3. `env -u NODE_ENV pnpm typecheck`、`env -u NODE_ENV pnpm exec eslint` 覆盖改过的源码、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`。
4. 文档站中文 `/components/dropdown-menu`、`/components/context-menu`、`/components/more-menu`：桌面与 390px、浅色与深色，菜单展开。至少 4 到 5 张整页图，能看见侧栏或顶栏。放 `/opt/cursor/artifacts`。
5. 新写和改到的源码不超过 500 行。白名单里的 `DropdownMenu.vue`、`types.ts` 若已降到 500 行以内，从白名单删掉。

## 提交与回报

- 提交信息用中文。分几次提交。完成后推送 `sync/c6-menus`，开 draft PR，base 为 `swarm-tree`。
- 不改 `ROADMAP.md`、`SWARM.md`，不合并，不改 #128。
- 回报写 `nodes/C6/impl-1.md`。
- 最终回复用中文，300 字以内。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/c6-*`。
