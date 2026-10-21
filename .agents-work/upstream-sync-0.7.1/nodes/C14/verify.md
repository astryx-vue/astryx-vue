# C14 布局与容器 · 验收计划

你是验收者，只检查，不改业务源码。实现者的 `impl-1.md` 只用来了解他做了什么，不能当成证据。每一条都要亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事，要和上游 v0.7.1 一致。代码结构不同不算问题。

只要有一条判「不过」，总结论就是不通过。浏览器环境跑不起来时，对应项记「跳过」并写原因，跳过本身不构成不通过；若图已经生成、内容和下面的期望明显不一致，则判不过。

## 环境

- 工作区：`/workspace`，分支 `sync/c14-layout`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 本轮允许新增的只有 `nodes/C14/verify.md` 和 `nodes/C14/verify-1.md`。不改组件、测试、样式、台账。
  - 临时文件都放在 `/tmp/verify-C14/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项跑两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
  - 每条命令加 `timeout`。浏览器命令用 `node scripts/swarm/browser-lock.mjs run --purpose C14-verify --max-run 180 --`。超时不要原样重跑。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。只对改动最大的 Resizable、Toolbar 做短跑。
  - 命令：`pnpm visual <组件> --combos desktop-light --no-proxy --out /tmp/verify-C14/visual`，包在 browser-lock 里。四种组合只在第一张能出来时再补，不要把锁占满。
  - 看截图用读图工具直接读 PNG。跑不动就写「跳过」和原因。

## 检查项

每一项只能判「过」或「不过」（浏览器项可以「跳过」）。证据是命令输出，或测试里对用户可见结果的断言，外加你读过这些断言。不要拿实现回报当证据。

本节点要验收的用户终态（来自计划和 ROADMAP，不来自 impl）：

- 调整大小：Enter 和双击恢复折叠前的尺寸；折叠后只有「变大」方向键会展开；有吸附点时方向键在吸附点之间跳；没有配置上限时，读屏仍能读到一个最大值，但 End 不会乱跳；使用者自己写的按键处理会和内置按键一起触发；手柄方向和区域方向不一致时，开发环境打一条警告；从右往左排版时，抓取区仍盖在握把上。
- 工具栏中间槽不再裁切内容，方向键不进嵌套的另一个工具栏。
- 禁用的可选卡片仍能用键盘聚焦。
- 数字 `0` 作为分隔线标签会显示出来，并成为无障碍名称。
- A3 列出的 Resizable 8 处差距都要有用户能感知的对应结果。第 8 处的 Chromium 无障碍套件归 E3，本轮只要求同一批用户能感知的分隔条约定有测试；不要求照搬上游的 a11y 浏览器套件、`utils` 子路径导出测试、Storybook 方向扫描。

### 一、效果和上游一致

1. **没配上限时的读屏最大值。** 跑 `useResizable` / `ResizeHandle` 测试。应该看到：没写最大尺寸时，客户端挂载后分隔条仍有 `aria-valuemax`（没容器时用窗口宽，竖向用高；百分比上限在观察容器时用容器内容盒）。服务端渲染的 HTML 里没有 `aria-valuemax`。比当前尺寸还小的窗口，最大值不会被报得比最小值还低。配置了真正的最大值时 End 才跳到那里；没配置时 End 不动。
2. **方向不一致会警告。** 手柄 `direction` 和区域方向不一致时，开发环境警告一次，文案能看出两个方向。手写 props 没带方向时不警告。同一实例再触发不会连打第二次。
3. **折叠后再展开回到原尺寸。** 可折叠区域按 Enter 或双击，展开时回到折叠前的尺寸，不是最小值。没有登记折叠控制的手写 props，展开时仍收到最小值。
4. **折叠后的方向键。** 折叠后，只有让面板变大的方向键会展开，展开到「最小值加一步」和折叠阈值里较大的那个。变小的方向键不动。`isReversed` 和从右到左时，变大的方向跟着翻。
5. **吸附点。** 有吸附点时，方向键跳到相邻吸附点，Shift 跳两个。超出最小或最大的吸附点算作那个边界。拖动和初始值都停在最近的吸附点上，不再是「靠近 8px 才吸」。
6. **使用者的按键处理。** 写在 `ResizeHandle` 上的 `keydown` 会被调用，随后内置的键盘调整照常发生（尺寸仍按方向键变化）。禁用时内置调整不发生。
7. **从右往左的抓取区。** 握把不在正中时，抓取区跟握把走同一套偏移。样式里 6.5px 的居中修正在 `dir=rtl` 下改号，抓取区仍盖住握把。用测试或直接读样式断言，不要只看类名存在。
8. **工具栏中间槽。** 中间槽不再 `overflow: hidden`，因此焦点环和阴影不会被裁掉；仍可缩到比内容更窄（`min-width: 0`）。方向键只在本工具栏里移动焦点，不进入嵌套的另一个工具栏。
9. **禁用的可选卡片。** 禁用时仍可聚焦，用 `aria-disabled`，不用原生 `disabled`。Space 和 Enter 不切换选中。指针是 `default`，不是 `not-allowed`。禁用时没有悬停和按下的底色。
10. **分隔线数字 0。** 标签为数字 `0` 时，文字显示出来，并成为无障碍名称。空字符串不显示、也不占用名称。
11. **可点卡片和折叠标题的按压。** 可点卡片、可选卡片、折叠标题：粗指针不用 `:active` 底色，鼠标仍用 `:active`。禁用的可点卡片指针是 `default`。
12. **卡片变体可扩充。** `Card` 的变体类型是可扩充的映射，现有变体名仍能用。主题可以用模块扩充声明自己的变体名。这是公开 API，用类型或测试确认，不要求界面长得不一样。

### 二、反向挑刺

13. **只用键盘。** 分隔条在可聚焦时，方向键、Home、End、Enter 能完成调整和折叠，不依赖鼠标。禁用时 `tabindex` 为 `-1`，这些键不起作用。
14. **读屏角色。** 分隔条是 `role="separator"`，有方向、当前值、最小值；折叠时当前值不低于最小值，并有折叠文案。可选卡片禁用时读屏能读出禁用，而不是从 Tab 顺序里消失。
15. **服务端渲染。** 本节点组件（AppShell、Layout、Grid、Stack、Center、AspectRatio、Section、ScrollableArea、Resizable、Collapsible、Card、ClickableCard、SelectableCard、Toolbar、Divider）都不在 `packages/core/src/ssr-known-failures.json` 里。SSR 冒烟测试能渲染它们，输出里没有 Vue warn。
16. **空标签和超界。** 分隔线空标签不渲染标签节点。吸附点落在最小或最大之外时，停在对应边界，尺寸不会跑出区间。
17. **图标。** 本节点若改了折叠箭头或其它图标，必须用语义名和 `defineTheme({ icons })` 这套方案，不能新造注册表。没有改图标就写「不适用」，并附 grep 证据。
18. **没有 `!important`。** `node scripts/check-no-important.mjs` 通过。改过的样式文件里 `git diff $BASE` 不能新增 `!important`。

### 三、C 节点通用检查

19. **台账。** `ledger/C14.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用`。不能有未勾选项。抽查至少 3 条「已采纳」（必须含 Resizable 键盘或读屏、Toolbar 中间槽或 SelectableCard、Divider 数字 0 这三类里能对上的提交），对照测试或组件行为，确认确实做了。抽查全部「不适用」，理由要能对上「不是这个节点的组件或机制」（主题归 B1、BottomSheet 归 C8、Chromium 套件归 E3、文档站预览不改变组件操作）。理由对不上就不过。
20. **上游测试有 Vue 对应。** A3 的 8 处差距里，第 1 到第 7 处都有 Vue 测试断言用户可见结果，两种 `NODE_ENV` 下通过，用例数相同。第 8 处不要求照搬上游文件名，但分隔条的 role、值、折叠文案要有测试。
21. **文档。** 中英文里，分隔条键盘说明要写到吸附点，以及没配上限时读屏仍有最大值、End 不乱跳。不能再写「8px 以内才吸附」。分隔线文档要承认数字 `0` 是有效标签。打开对应 md，读到这些句子就算数；本轮不要求另开文档站点页面，除非视觉短跑已经把站拉起来。
22. **SSR 名单。** 同第 15 条的名单检查。名单里没有本节点组件。
23. **视觉对比图。** 对 Resizable、Toolbar 各做短跑。能出图就用读图工具看至少一张对照图：左边上游、右边我们，是同一组件的预览，没有报错覆盖层。四种组合（桌面/390px × 浅色/深色）在 180 秒内出不来，就记跳过和原因，不卡死。
24. **行数。** 改到的源码文件不超过 500 行。超过的必须已拆开，并从 `scripts/guardrails/line-limit-allowlist.json` 移出。`node scripts/check-line-limit.mjs` 通过。`useResizable.ts` 若仍接近上限，确认它没有超过 500。

### 四、整体

25. **组件测试两遍。** `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 与 `NODE_ENV=production pnpm vitest run --maxWorkers=2`，路径至少覆盖 Resizable、useResizable、Toolbar、SelectableCard、ClickableCard、Collapsible、Divider、Card。两遍通过，文件数和用例数相同。
26. **全量检查。** `env -u NODE_ENV pnpm check` 若能在一次有上限的运行里跑完，必须通过，其中测试一步若脚本不接受 `--maxWorkers`，按脚本原样跑并写明。超时就拆开：`check:packages`、`check-no-important`、`check-line-limit`、`sync-exports --check` 必须过；全量 vitest 或 build 超时则记「未跑完」并说明停在哪，不把超时当成通过。未跑完的全量检查记不过，除非失败原因明确是环境缺依赖且与本节点行为无关，并已用组件测试补上行为证据。
27. **改动范围。** `git diff $BASE --stat` 里，业务文件只涉及计划里的布局组件、它们的样式和测试、文档、CLI 生成目录、台账。没有 ROADMAP 状态改动，没有 BottomSheet、主题包、别的节点组件。`node scripts/sync-exports.mjs --check` 通过。
28. **注释不讲修改历史。** `git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或命中的都不是在讲这次修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C14/verify-1.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次只测一件事。浏览器默认 `--max-run 180`。其它命令加 `timeout`。脚本和结果放在 `/tmp/verify-C14/`。
