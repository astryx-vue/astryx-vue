# C14 布局与容器 · 验收报告 · 第 1 轮

结论：通过（28/28）

- 工作区：`/workspace`，分支 `sync/c14-layout`。验收提交见本文件所在提交。
- 比较基点：`BASE = 1419a29ff9e3afbd986234b1ed7dd5e6d09e49f4`（`git merge-base HEAD origin/swarm-tree`）。
- 临时文件：`/tmp/verify-C14/`。截图在 `/opt/cursor/artifacts/c14-verify/`，没有提交进 git。
- 只读检查：开始时 `git status` 是干净的。结束时只多了本目录的 `verify.md` 和 `verify-1.md`，提交后工作区恢复干净。
- 临时改动：无。探针测试 `c14-verify-probe.test.ts` 跑完已删除，没有进入提交。
- 浏览器：`browser-lock` 槽位用完即释放，结束时 browser-1、browser-2 都空闲。文档站曾在 `localhost:5172`（只监听 `::1`），截完已关掉，端口不再监听。

`pnpm visual ResizeHandle` 的 overview 模式失败：上游页没有工具所认的顶部预览区（选择器要求卡片内层带 `aspect-ratio` 或 `min-height`）。随后改用 browser-lock 里的短脚本，按示例区域截「左 Astryx / 右 astryx-vue」。一次只截一张，每条 `--max-run 90`。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 没配上限时的读屏最大值 | 过 | `ResizeHandle.test.ts`：窗口宽 1000、竖向高 700、不小于当前尺寸、折叠时不小于最小值、`renderToString` 不含 `aria-valuemax`、百分比容器内容盒 640。探针把左右 padding 20+10 后最大值是 610。没配上限时 End 仍停在 200。两种 NODE_ENV 都过。 |
| 2 | 方向不一致会警告 | 过 | 测试期望 `direction="horizontal" but its useResizable region is "vertical"`。手写 props 不带 `_direction` 时，全文件 `afterEach` 要求 `console.warn` 没被调用，整组通过。探针里同一实例来回改方向，警告只有 1 次。 |
| 3 | 折叠后再展开回到原尺寸 | 过 | 真实 hook：Enter 和双击展开后 `aria-valuenow` 回到 200。手写 stub 没有折叠登记，展开时 `_onResizeMove` 收到最小值 100。 |
| 4 | 折叠后只有变大方向键展开 | 过 | 折叠后 ArrowLeft 不调用移动；ArrowRight 展开。`minSize` 20、`collapsedSize` 50 时展开到 50。探针：RTL 下 ArrowRight 仍折叠，ArrowLeft 展开到 50；`isReversed` 同样是 ArrowLeft 才展开。 |
| 5 | 吸附点 | 过 | 方向键 200 到 300，Shift+左跳到 100。超出上界的 450 停在 400。反向布局左键变大。`useResizable` 初值 240 落到 200，`resize(220)` 也到 200，不再是 8px 内才吸。 |
| 6 | 使用者的按键处理 | 过 | `attrs.onKeydown` 被调用 1 次，同时 `_onResizeMove` 收到一步。禁用时键盘测试不调整。 |
| 7 | 从右往左的抓取区 | 过 | `resize-handle.css`：握把 `data-bias` 为 start/end/center。LTR 是 `- 6.5px`，`:is([dir='rtl'] ...)` 改成 `+ 6.5px`，选择器更具体，会盖住基础规则。测试读到这两处，并断言 `data-bias`。 |
| 8 | 工具栏中间槽 | 过 | `toolbar.css` 的 center 规则没有 `overflow`，有 `min-width: 0`。嵌套工具栏测试把方向键打在外层，焦点留在 Outer。对照图里中间槽的 Title 没有被裁掉。 |
| 9 | 禁用的可选卡片 | 过 | `SelectableCard.test.ts`：没有原生 `disabled`，`aria-disabled="true"`，`focus()` 落在隐藏勾选框上，Space 和 Enter 不发出 `change`。探针确认 `data-disabled="true"`。`clickable-card.css` 里该状态 `cursor: default`，悬停和按下的底色是透明。 |
| 10 | 分隔线数字 0 | 过 | `label: 0` 时文字是 `0`，`aria-labelledby` 指向该标签。空字符串不渲染标签。 |
| 11 | 可点卡片和折叠标题的按压 | 过 | `:active` 底色包在 `@media not all and (pointer: coarse)` 里。禁用可点卡片和折叠标题是 `cursor: default`，没有 `not-allowed`。相关测试通过。 |
| 12 | 卡片变体可扩充 | 过 | `CardVariantMap` 接口，`CardVariant = keyof CardVariantMap`。`packages/core/src/index.ts` 导出这个类型。现有变体名还在。 |
| 13 | 只用键盘 | 过 | 方向键、Shift、Home、End、Enter 都有断言。禁用时 `tabindex="-1"`、`aria-disabled="true"`，键盘和双击不起作用。 |
| 14 | 读屏角色 | 过 | `role="separator"`，横向手柄的 `aria-orientation` 是 `vertical`。折叠时 `aria-valuetext="Collapsed"`，当前值不低于最小值。禁用可选卡片仍在焦点顺序里。 |
| 15 | 服务端渲染 | 过 | `ssr-known-failures.json` 是空对象。`ssr-smoke.test.ts` 两种 NODE_ENV 都是 212 条通过。分隔条服务端 HTML 没有 `aria-valuemax`。 |
| 16 | 空标签和超界吸附 | 过 | 空标签不渲染。吸附点 450 在最大 400 之外时停在 400。 |
| 17 | 图标 | 过 | 不适用。折叠箭头仍是 `Icon` 的语义名 `chevronDown` / `chevronRight`。这次 diff 没有新的图标注册表。 |
| 18 | 没有 `!important` | 过 | `node scripts/check-no-important.mjs` 退出 0。`git diff $BASE` 新增行没有 `!important`。 |
| 19 | 台账 | 过 | 107 条都是 `- [x]`，结论 43 条已采纳、64 条不适用，没有缺结论。抽查 `f11eb6d09`、`490970c7a`、`c9dfc7a81`，对应测试和样式都在。不适用理由按主题归 B1、BottomSheet 归 C8、Chromium 套件归 E3、文档站预览不改组件操作。`Grid.vue` 里数字列是 `repeat(n, 1fr)`，对象形式才 `auto-fit`。仓库里没有 Drawer。 |
| 20 | 上游测试有 Vue 对应 | 过 | A3 差距 1 到 7 都有用户可见断言。两种 NODE_ENV：10 个文件、116 条，数字相同。差距 8 的浏览器套件不要求照搬；role、值和折叠文案在 `ResizeHandle.test.ts`。 |
| 21 | 文档 | 过 | 中英文 `resize-handle/index.md` 写了吸附点、没配上限时 End 不动、读屏最大值改报窗口或容器。`divider/props.md` 写了数字 0 会显示。这些文档里没有「8px 以内才吸附」。 |
| 22 | SSR 名单 | 过 | 同第 15 条。本节点组件不在名单里。 |
| 23 | 视觉对比图 | 过 | 5 张在 `/opt/cursor/artifacts/c14-verify/`，见下面「看图」。官方 overview 对照跑不起来，原因写在文首。图里分隔条示例两边一致。工具栏中间的 Title 都在，没有被裁切。 |
| 24 | 行数 | 过 | `useResizable.ts` 488 行。`node scripts/check-line-limit.mjs` 通过。测试文件和生成的 `index.ts` 按脚本规则不计入。 |
| 25 | 组件测试两遍 | 过 | `env -u NODE_ENV` 与 `NODE_ENV=production` 都是 10 个文件、116 条通过。路径覆盖 Resizable、useResizable、Toolbar、SelectableCard、ClickableCard、Collapsible、Divider、Card。 |
| 26 | 全量检查 | 过 | 拆开跑完，都是退出 0：`check:packages`、`lint`、`typecheck`、全量 vitest 263 个文件 3568 条、`build:packages`、`docs:build`、`lint:pkg`。 |
| 27 | 改动范围 | 过 | `git diff $BASE --stat` 只有布局组件、样式、测试、中英文文档、`catalog.json`、台账和本节点计划/回报。没有 ROADMAP。`sync-exports.mjs --check` 通过。 |
| 28 | 注释不讲修改历史 | 过 | diff 里命中「之前」的，是「折叠前的尺寸」和回报正文，不是在代码注释里记修改史。 |

## 看图

每张都是左 Astryx、右 astryx-vue。官方 `pnpm visual` 没有生成这批图。

| 图 | 看到的内容 |
| --- | --- |
| `/opt/cursor/artifacts/c14-verify/resize-handle-desktop-light.png` | 桌面浅色。两边都是 200px 侧栏、浅灰底、右侧说明「snaps at 200px and 280px」、中间一条竖分隔。文案和结构对齐。没有报错层。 |
| `/opt/cursor/artifacts/c14-verify/resize-handle-desktop-dark.png` | 桌面深色。两边都是深底，分隔和 200px 文案还在。颜色模式对。 |
| `/opt/cursor/artifacts/c14-verify/resize-handle-mobile-light.png` | 390px 浅色。示例卡本身约 500px 宽，两边在窄屏里都被裁掉一截字，分隔条和两栏还在。这是示例宽度，不是分隔条逻辑坏了。 |
| `/opt/cursor/artifacts/c14-verify/toolbar-desktop-light.png` | 桌面浅色的概览工具栏。两边都是左返回、中间 Title、右主按钮。Title 没有被裁切。上游多一个 Discard，我们的示例只有 Save，这是示例内容不同。 |
| `/opt/cursor/artifacts/c14-verify/toolbar-mobile-dark.png` | 390px 深色。我们这边返回、Title、Save 都在深色条里。上游这条比屏宽，画面只落到左端和 Title，Discard 与 Save 在屏外。左图黑条下面的白是拼图补白：上游条高 32px，我们这条 68px，短的一边被补成一样高。 |

## 对实现者偏离计划的判断

- 折叠通道和持久化放在 `composables/internal/`：合理。放在 composables 根目录会被 `pnpm sync` 收进公共入口。
- 不用 `hydrate` 具名导出：合理。Vue 3.5 没有这个导出。`renderToString` 没有 `aria-valuemax`，客户端挂载后才有，契约还在。
- 测试用 `process.cwd()` 读 CSS：合理。只影响测试怎么找到文件。
- 改掉文档里的「8px 以内才吸附」，并更新 CLI catalog：合理。行为已经变成总是停在最近点，旧句子是错的。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

- 工具栏概览示例和上游不是同一组按钮：上游有 Discard，我们只有 Save。390px 下上游示例条比屏宽。若要让对照图更好看，把示例内容对齐，并让窄屏示例不要超出 390px。
- 静态图看不出「去掉 `overflow: hidden` 之后焦点环不被裁」。这件事靠样式断言和上面的 Title 不被裁来锁。
