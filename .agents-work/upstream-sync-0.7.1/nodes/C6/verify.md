# C6 菜单家族 · 验收计划

你是验收者，只检查，不改代码。`impl-1.md` 只用来了解做了什么，不能当成证据。判断标准是效果。

## 环境

- 工作区：`/workspace`，分支 `sync/c6-menus`。
- `BASE` 指 `git merge-base HEAD swarm-tree`。
- 开始和结束各跑一次 `git status`，两次结果必须相同。临时文件放 `/tmp/verify-C6/`。
- 测试前加 `env -u NODE_ENV`，再以 `NODE_ENV=production` 跑一遍，用例数相同。vitest 加 `--maxWorkers=2`。
- 文档站整页才是给用户的图。中文地址是 `/components/<slug>`。夹具页和 `pnpm visual` 的 overview 不能冒充。

## 检查项

每一项只能判「过」或「不过」。

### 一、效果和上游一致

1. 打开文档站中文 `/components/dropdown-menu`，滚到「动作」示例，点开菜单。桌面浅色、桌面深色、390px 浅色、390px 深色各一张整页图。图里要有侧栏或顶栏，菜单是展开的。再至少补一张快捷菜单或更多菜单的整页展开图。对照上游同组件时，左边上游、右边我们。图放 evidence 或 `/tmp`，报告里写明是文档站整页。
2. 下拉菜单：鼠标 `pointerdown` 在触发器上（还没等到 click）菜单打开；再把指针移进某一行松开，那一行的点击回调触发一次，菜单关闭。手指路径用测试里的长按模拟即可：按住触发器不会在 pointerdown 当下打开。
3. 打开菜单后按 ArrowUp，高亮在最后一行；方向键在首尾循环。打开用的 Enter 或空格如果 `repeat`，不执行第一行。
4. 子菜单：鼠标进入行，150ms 内飞出层不开，150ms 后开；指针离开后若还在飞出层上，层保持打开。`presentation="drill-in"` 时点击行在同一面板里换内容，出现返回，Escape 回到上一级而不是关掉整个菜单。
5. 带页头和页脚的菜单：外框是 `role="dialog"` 且 `aria-modal="true"`，触发器 `aria-haspopup="dialog"`。从最后一行 Tab 到页脚，再 Tab 回到页头，菜单仍开着。页头输入框里打字不会跳到某一行。没有页头页脚时，Tab 关掉菜单，触发器 `aria-haspopup="menu"`。
6. 读屏相关属性：菜单 `role="menu"`，行是 `menuitem`（链接行也是，并且是 `<a href>`）。分组是 `role="group"`。默认英文名是 Menu；包一层中文 locale 后，没写按钮文案时名字是「菜单」。快捷菜单默认名「快捷菜单」，更多菜单默认名「更多选项」。

### 二、反向挑刺

7. 只用键盘：ArrowDown 打开并落到第一行，ArrowUp 打开落到最后一行，Enter 执行，Escape 关闭并把焦点还给触发器。
8. 两个叠开的菜单（下拉菜单里打开飞出子菜单，或快捷菜单里再开一层）：按一次 Escape 只关上面那层，下面那层还在；再按一次才关下面那层。报告里写明这条测试的命令和输出。
9. 禁用的触发器：`isDisabled` 或 `aria-disabled="true"` 时，click、Enter、ArrowDown、pointerdown 都不打开菜单。
10. 指针点一行关掉菜单后，焦点在触发器上，触发器带 `data-astryx-focus-ring="off"`。接着用键盘 Tab 或方向键把焦点移回触发器时，这个属性去掉。
11. 链接行有 `href`，`draggable` 为 false；普通行没有 `draggable="false"`。修饰键点击不调用 `onClick`。
12. 空菜单、超长标签：菜单仍在视口内，不把页面撑破。`menuMaxHeight` 大于 300 时内联样式里的上限跟着变，同时不超过视口。
13. 图标：菜单里的箭头仍是语义名 `chevronDown` / `chevronRight` / `chevronLeft`，没有新的图标注册表。
14. `node scripts/check-no-important.mjs` 通过。菜单 CSS 里放得下的面板是 `touch-action: pinch-zoom`，`data-overflow="true"` 时是 `pan-y pinch-zoom`。快捷菜单不再使用 `touch-action: none`。

### 三、C 节点通用检查

15. `ledger/C6.md` 每一条都是 `- [x]`，下面有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条已采纳，确认代码或测试对得上；全部不适用都要有站得住的理由。
16. 本轮新增的 Vue 测试在两种 NODE_ENV 下都通过，用例数相同。
17. 中英文文档里，页头页脚的 Tab 写成在对话框里循环，不再写成「Tab 到头就关闭」。快捷菜单、更多菜单的默认文案说明和语言一致。打开中文文档页，示例能点开。
18. `ssr-known-failures.json` 里没有 DropdownMenu、ContextMenu、MoreMenu。
19. 第 1 条的整页图你亲眼看过，报告里每张标了「文档站整页」或「内部核对」。
20. `DropdownMenu.vue` 和 `packages/core/src/DropdownMenu/types.ts` 都不超过 500 行，并且不在 `scripts/guardrails/line-limit-allowlist.json` 里。

### 四、整体

21. `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/DropdownMenu packages/core/src/ContextMenu packages/core/src/MoreMenu` 通过；`NODE_ENV=production` 再跑一遍，用例数相同。
22. `env -u NODE_ENV pnpm typecheck` 通过。改过的源码 `eslint` 无警告。
23. `node scripts/check-line-limit.mjs` 通过。
24. `git diff $BASE --stat` 没有 `layer/`、`ROADMAP.md`、`SWARM.md`。`node scripts/sync-exports.mjs --check` 通过。
25. `git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或命中的都不是在讲修改历史。
26. 关闭栈若仍是布尔 `dismissOnEscape`，回报里写了「待修复线程合入后对齐」，菜单层使用的是会关闭的那一档（当前即 `true`）。没有提前发明 `'close' | 'block' | 'ignore'` 类型。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `nodes/C6/verify-<N>.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/verify-C6/`。
