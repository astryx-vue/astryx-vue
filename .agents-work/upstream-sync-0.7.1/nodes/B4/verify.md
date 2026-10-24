# B4 浮层运行时 Layer · 验收计划

你是验收者，只检查，不改代码。实现者的回报不能当证据，每一条都要你自己重新验证。判断标准是**用户感受到的浮层行为和上游一致**，代码结构不要求一样。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B4`。BASE = `git merge-base HEAD swarm-tree`。
- 上游仓库只读：`/Users/shenqingchuan/workspace/astryx-upstream`，标签 `v0.7.1`。
- 所有测试和构建命令都加 `env -u NODE_ENV`。测试类的检查项要在两种 NODE_ENV 下各跑一遍。vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多 2 个浏览器会话，你同一时刻只开 1 个。
  - 开浏览器只能通过 `browser-lock.mjs run` 或者 `pnpm visual`。
  - 文档站用这个工作区登记的槽位端口，用完关掉。
- 访问外网前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`。上游官网偶尔会超时，重跑一次即可。
- 临时文件放在 `/tmp/verify-B4/`。开始和结束时各跑一次 `git status`，两次结果要相同。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、浮层行为（在浏览器里亲手验证）

自己写 Playwright 脚本，在 B4 的文档站上操作。需要「Dialog 里套菜单」这类组合时，可以用 `page.evaluate` 搭，也可以在 `/tmp` 里起一个临时的 Vite 页面挂组件。

1. **Escape 只关最上面一层**：在 Dialog 里打开一个菜单（Selector 或 DropdownMenu）。
   - 按第一次 Escape：菜单关掉，Dialog 还在。
   - 按第二次 Escape：Dialog 关掉。
   - 再在 BASE 上做一遍同样的操作，记下 BASE 的表现，用来说明 B4 带来了什么变化（BASE 也可能本来就对）。
2. **点外面只关栈顶**：Dialog 里开着菜单时，点 Dialog 内部、菜单外面的位置。只有菜单关掉，Dialog 不关。
3. **触发器不和自己打架**：Popover 打开以后点它的触发器。
   - Popover 关掉，而且之后的 300ms 内一直保持关闭（每 50ms 检查一次）。
   - 再点一次触发器，Popover 打开。
4. **视口内边距**：视口设成 390×844，打开一个靠近屏幕右边的浮层（Popover 或 Tooltip 都可以）。用 `getBoundingClientRect` 测量浮层右边到视口右边的距离，要大于等于内边距的值。内边距的值从实现里读出来，并且要和上游 AST-059 的约定一致。
5. **浮层不继承外部文字样式**：在一个 `font-weight:700; font-size:32px; color:red; letter-spacing:4px` 的容器里打开 Popover。Popover 内容的计算样式，不能沿用这几个值。对照上游 `layerTextReset.stylex.ts` 列出的属性，逐个检查。
6. **Dialog 内的浮层挂在 Dialog 里**：在 Dialog 里打开浮层，用 DOM 检查浮层元素是不是 Dialog 元素的后代（或者落在 Dialog 的 top layer 里），并且能接收点击，不会被模态遮罩挡住。
7. **Toast 在 Dialog 之上**：打开 Dialog 以后触发一个 Toast，Toast 能看到，也能点到它的关闭按钮。如果这一条被交给了 C7，就确认回报里写了交接，并且 BASE 上的表现没有变得更差。

### 二、逻辑和测试

8. 关闭栈的测试覆盖了计划里的 6 个场景，外加 3 条上游的不变量。逐条找到对应的测试名称。
9. 反向检查：临时把「Escape 只交给栈顶」改成「交给所有层」，相关测试要失败。做完还原。
10. 关闭栈只在栈不为空时才挂 document 监听：用 spy 验证，栈清空以后监听器被移除。
11. 并发 show/hide（#6941）有测试，而且测试真的模拟了「上一个还没显示完，下一个就要显示」。
12. `useTouchTrigger` 有测试，在没有悬停能力的指针下，点一下就能打开。

### 三、不能变坏

13. 所有调用 `useDismiss` 的组件，测试在两种 NODE_ENV 下都通过。挑 Selector 和 ContextMenu，用 `pnpm visual` 和 BASE 对比 `ours.png`，像素差异为 0；如果不为 0，要能解释清楚原因（只能是浮层文字重置造成的）。
14. E3 交互契约、SSR 冒烟测试通过；名单没有变长。
15. 关闭栈和挂载点在服务端渲染时不碰 `document`：在 node 环境里 import 相关模块，不报错。

### 四、交付

16. 台账 `ledger/B4.md` 里 29 条都打了勾，并写了结论。抽 5 条核对。
17. 回报里的「交给 Cx」清单，按 C 节点分好组，并且写到能照着做的程度。抽 C7 这一组读一遍。
18. 全量 vitest 在两种 NODE_ENV 下都通过，用例数相同。完整执行 `env -u NODE_ENV pnpm check`（其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`），通过。
19. 新写或改动的源码文件不超过 500 行。用 `git diff $BASE --stat` 核对，没有越界改动：
    - Dialog 只加了提供挂载点那一处。
    - 其它组件只做了 `useDismiss` 调用方的最小修复。
    - 没有改 Theme、composables/internal、locale、Icon。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/B4/verify-<N>.md`，格式照 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。

## 第 2 轮新增的检查项

第 1 轮发现了 5 个问题，见 `verify-1.md` 里的「不通过的项要怎么改」。第 2 轮逐条复测：

20. **超宽浮层两边都留内边距**：视口宽 390，打开 `<Popover :width="400">`，左右两边到视口边缘的距离都要不小于内边距。DropdownMenu 的 `menuWidth=400`、SubMenu 用同样的方法测。另外再测一种情况：`LayerProvider` 设了额外的 `inset`，结果也要正确。
21. **文字重置覆盖到所有浮层根**：外层容器设成粗体、大写、居中，然后分别打开 Dialog、Toast、Lightbox、MobileNav 抽屉、BottomSheet。它们内容的 `font-weight`、`text-transform`、`text-align` 都不能继承外层，要和上游 `layerTextReset` 的效果一致。
22. **浮层内容不继承「成员关系」类 context**：
    - 在 `ButtonGroup`（`isDisabled`，再试 `size=lg`）里放一个 Popover，Popover 里的 Button 不能继承禁用状态和尺寸。
    - 回报里要有一张对照表，把上游 `LayerContentBoundary` 截断的 context 和我们的 `provide` 键逐个列出来，每一个都写清楚「截断」或「不适用 + 理由」。从表里抽 2 个，用测试验证。
23. **Toast 在 Dialog 打开时不跳**：先显示一个 Toast，再打开 Dialog。每 50ms 记录一次 Toast 的 `getBoundingClientRect`，一共记 1 秒。位置变化要不超过 2px。然后反过来测：Dialog 开着时出现 Toast，再关掉 Dialog，Toast 同样不能跳。
24. 台账 #6919、#6457 的结论和实际情况一致。改进建议里提到的 `ButtonTooltip.vue`、`TableData.vue` 两处写死的 `to="body"` 要处理掉，或者在交接清单里写明交给哪个 C 节点。
25. 第 1 轮通过的 1 到 19 项中，被第 2 轮改动碰到的要重新验证，至少包括 1、2、5、6、7、13、18。
26. **按子路径单独引入时也要生效**：README 推荐用户按组件单独引入，比如 `import { Popover } from '@astryx-vue/core/Popover'`，这时不会引入总的 `styles.css`。用一个空白的 Vite 项目验证，可以参考 `scripts/check-templates.mjs` 的做法，也可以在 /tmp 里起一个最小页面：只按子路径引入 Popover 和 Dialog，外层设成粗体、大写、居中，打开这两个浮层后，里面的文字不能继承外层的这些样式。如果文字重置没有生效（因为 `layer.css` 没有被各组件引入），就判不过。
27. 实现者回报第 6 节第 1 条的取舍：打开 Dialog 以后，大约有 400ms Toast 是点不到的。请判断这样会不会让用户感到不对劲。和上游对比一下：上游是立刻把 Toast 搬过去，代价是位置会跳。哪一种更接近「用户感受和上游一致」？如实写进报告，这一条只记录，不影响结论。
28. **（第 3 轮）按子路径引入时文字重置生效**：重做第 26 项的最小页面复测，用构建后的 dist。另外 grep dist，确认 layer.css 的 import 还在，layer.css 文件本身也在。守护测试要真的能拦住问题：在临时副本里删掉某个浮层组件对 layer.css 的引用，守护测试必须失败。
29. **（第 3 轮）TabList 和 Stepper 在浮层里截断**：用第 2 轮报告「第 22 项展开」里的两个场景重测，Popover 里的 Tab 和 Step 不能再读到外面的状态。按上游的做法，没有本地 provider 时应该报出明确的错误。再在文档站 TabList 页面上实测 TabMenu 的下拉：点开、选择一项、选中状态同步，都要正常。
