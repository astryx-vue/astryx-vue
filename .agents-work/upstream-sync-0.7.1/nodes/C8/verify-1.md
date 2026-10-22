# C8 验收报告 · 第 1 轮

结论：通过（21/21）

- 工作区：`/workspace`，分支 `sync/c8-bottom-sheet`。验收时代码提交 `3a82f633`（`docs(C8): 写下底部面板第 1 轮实现回报`）。本报告是其后一次提交。
- 比较基点：本地没有名为 `swarm-tree` 的分支。已 `git fetch origin swarm-tree`，`origin/swarm-tree` 为 `dd1967e7`。`BASE = git merge-base HEAD origin/swarm-tree` = `dd1967e79bf25c3a139b928bf2bf72bd0798b61b`。
- 临时文件和截图：`/tmp/verify-C8/`、`/opt/cursor/artifacts/c8-verify-1/`。全部自己重新生成，没有用实现者留下的产物。
- 只读检查：开始时 `git status` 是 `On branch sync/c8-bottom-sheet` / `nothing to commit, working tree clean`。结束时在提交本报告之后同样是干净工作区。两次相同。
- 临时改动：无。构建产生的 `node_modules/` 和 `**/dist/` 被 gitignore，没有改业务代码。
- 浏览器：`node scripts/swarm/browser-lock.mjs run --purpose C8-verify`，拿到 `browser-1`。文档站 `vitepress preview --host 127.0.0.1 --port 4187`。结束后端口 4187 连接被拒绝，没有残留浏览器进程，两把浏览器锁都空闲。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 文档站中文四种组合都是整页，并打开有内容的面板 | 过 | 无对位。`http://127.0.0.1:4187/components/bottom-sheet` 滚到「高度」，点 `Open capped`。四张图都在视口里同时看到页面骨架和打开的面板。桌面 1440 侧栏可见且含「底部弹窗」；390 顶栏按钮「菜单」可见（`menuVisible: true`）。打开的对话框 `aria-label` 为 `capped height`，正文是 capped 那一段。面板顶在视口中部、底边贴住视口底（桌面 `panelTop` 342、`panelBottom` 948，视口高 900；手机 `panelTop` 320.7、`panelBottom` 892，视口高 844）。像素抽样：浅色图中线从面板处到最后一行是白色，深色图是 `rgb(38,38,38)`。拖拽条在面板顶部，正文左缘距内容盒 16px，没有贴死。 |
| 2 | 默认边距走已发布的容器变量；显式档位改间距；根上归零；切换器同样交到内容区 | 过 | `bottom-sheet.css` 内容区四边：`--container-padding-*` 指到 `--_sheet-pad-*`，回退链含 `--astryx-bottom-sheet-padding` 与 `--astryx-spacing-4`。`[data-padding]` 把四边改成 `--_sheet-padding-step`；`0` 对应 `--astryx-spacing-0`，`2` 对应 `--astryx-spacing-2`。打开的 capped 面板：`data-padding` 为空，四边 computed padding 都是 `16px`，内容区 `--container-padding-inline-start` 为 `1rem`，面板根（`astryx-layer`）为 `0px`。`layer.css` 在 `.astryx-layer` 写 `--container-padding-inline-start: 0px`。切换器测试 `passes an explicit padding step through to the shared sheet content` 断言内容区 `data-padding="2"`，两种 `NODE_ENV` 下都在通过的 91 条里。 |
| 3 | Escape 先关更晚的层；required 不关；拼字中的 Escape 不关；非模态页面上的 Escape 不关 | 过 | `BottomSheet.test.ts`：`lets a layer above the sheet take Escape first` 先调用上层 `onDismiss`，`openChange` 不发出，摘掉上层后再按一次才是 `[[false]]`。`blocks Escape and cancel for the required purpose` 里 Escape 和 cancel 都不发出 `openChange`。`purpose === 'required'` 时 `dismissOnEscape` 直接返回，`layerEscape` 为 `block`，没有「第二次才关」的计数。`keeps an IME composition cancel from dismissing the sheet` 用 `isComposing: true`。`ignores Escape outside a non-modal sheet`：点在 `document.body` 不关，点在对话框上才关。这些用例在 91 条里，两种 `NODE_ENV` 都过。 |
| 4 | 指针关闭还给触发器的 focus 带 `focusVisible: false`；键盘关闭不带这个限制 | 过 | `returns focus without a ring after a pointer close` 先派发 `pointerdown`，关闭后 `focus` 的参数是 `{ focusVisible: false }`。`focusForLastInput` 只在上一次是指针时带这个参数；默认模态是键盘，键盘时走 `element.focus(options)`。文档站上对 capped 面板按 Escape，退出动画后打开的对话框数量为 0。 |
| 5 | 读屏：带名字的 dialog；required 是 alertdialog；拖拽条隐藏；溢出时滚动区是带名字的 group | 过 | 文档站打开的 capped 面板没有 `role` 属性，Playwright 无障碍树是 `dialog "capped height"`。拖拽条 `aria-hidden="true"`。`uses alertdialog semantics for the required purpose` 断言 `role="alertdialog"`。视口压到 390×520 再打开「移动端键盘」：滚动区 `scrollHeight` 785、`clientHeight` 477，`role="group"`，`aria-label="Edit profile"`，`tabindex="0"`，无障碍树为 dialog 里面的 `group "Edit profile"`。不溢出的 capped 面板滚动区没有 `role`。 |
| 6 | 键盘 Escape 和溢出时的 Tab 停靠点仍在，委托用已有函数 | 过 | `BottomSheetPanel.vue` 从 `../composables/internal/scrollKeyboardDelegation.js` 引入 `attachScrollKeyboardDelegation`，挂在滚动区和内容盒上，没有另写一套。溢出时 `tabindex="0"`（见第 5 项）。Escape 仍关面板（第 3 项测试，以及文档站 `afterEscape: 0`）。 |
| 7 | 不在 SSR 失败名单里，文档站构建通过 | 过 | `packages/core/src/ssr-known-failures.json` 是 `{}`，没有 BottomSheet。干净环境第一次 `env -u NODE_ENV pnpm docs:build` 因缺少 core 的 dist 失败；先 `env -u NODE_ENV pnpm --filter @astryx-vue/core build`（退出码 0），再跑同一条 `docs:build`，退出码 0，`build complete in 55.32s`，页面渲染完成。产物里有 `apps/docs/.vitepress/dist/components/bottom-sheet.html`。 |
| 8 | 超长内容在面板内滚动；三种边距样式不破；高度档测试仍过 | 过 | 高度档用例 `renders the named, numeric, and custom height budgets` 在 91 条里通过。短视口下 tall 面板内部 `scrollHeight` 大于 `clientHeight`（第 5 项），页面视口没有被撑高。不传、`0`、`1.5`：样式里分别走主题链、`--astryx-spacing-0`、`--astryx-spacing-1-5`；测试把 `data-padding` 设成 `1.5`、`0` 再清掉，属性随之出现和消失。文档站默认打开的面板四边 16px。 |
| 9 | 第二指取消拖动且不吃掉缩放；没滚到头的盒子不把下拉交给面板 | 过 | `drops a drag when a second finger lands`：第二指落下后再把第一指拖过关闭距离，`openChange` 不发出。`does not drag the sheet while a nested scroller can still move`：嵌套盒子 `scrollTop` 20、还能滚时下拉，不发出 `snap` 也不关闭。拖拽条 `touch-action: pinch-zoom`，滚动区 `pan-y pinch-zoom`。`blockScrollEdges` 从事件目标走到滚动区。两条测试都在 91 条里，两种 `NODE_ENV` 都过。 |
| 10 | 不新增图标，不引入另一套注册表 | 过 | `git diff $BASE --name-only` 没有图标文件。`packages/core/src/BottomSheet` 下没有图标 import。 |
| 11 | 没有 `!important`；样式里没有 `not-allowed`；拖拽条是 grab | 过 | `node scripts/check-no-important.mjs` 退出码 0。`bottom-sheet.css` 搜 `not-allowed` 和 `!important` 没有命中。拖拽条 `cursor: grab`，按下是 `grabbing`。文档站 computed cursor 为 `grab`。 |
| 12 | 台账 61 条都勾完，并有结论；抽查采纳项和不适用理由 | 过 | 脚本统计：61 条都是 `- [x]`，都有结论；已采纳 32，不适用 29，格式都不缺理由。抽查已采纳：`b507cdef4` 默认边距（第 2 项实测 16px）、`516c4541c` 关闭栈（第 3 项）、`d6b5c7836` 指针关闭不画环（第 4 项），代码和测试都在。不适用 29 条的理由和本地代码对得上：没有旧的 BottomSheet 废弃别名；拖拽条不是 `not-allowed`；遮罩是 `dialog` 的 `::backdrop`，没有单独的 scrim 元素可删；停靠仍是拖动方向里的最近档（`resolveSettleOffset`），甩动门槛是速度 1.2、距离 48px（`FLICK_VELOCITY` / `FLICK_MIN_DISTANCE`），和台账写的一致；其余是选择器、主题撤回、React ref、StyleX、上游文档或规范草稿，标题和理由相符。惯性投影按计划不搬，见下方偏离判断。 |
| 13 | 本轮行为有 Vue 测试，两种 NODE_ENV 都过，条数相同 | 过 | 默认边距和发布、上层 Escape、非模态 Escape、指针 `focusVisible: false`、第二指、嵌套滚动，都在 `BottomSheet.test.ts` / `BottomSheetSwitcher.test.ts`。`env -u NODE_ENV` 与 `NODE_ENV=production` 各跑第 18 项那条 vitest：都是 5 个文件、91 条通过。 |
| 14 | 中英文内边距说明和现在的行为一致，中文示例能操作 | 过 | `apps/docs/docs/zh/components/bottom-sheet/index.md` 与英文对应段：不传时主题边距，没有主题时 `--spacing-4`（16px）；唯一子区块顶掉；表格和分隔线伸到这条边。样式上 Section / Table 用 `--container-padding-*` 做负外边距，全出血分隔线同样。中文页点 `Open capped` 能打开，点 `Close` 后打开的对话框数为 0，再打开后 Escape 也能关掉。 |
| 15 | BottomSheet 不在 SSR 已知失败名单 | 过 | 同第 7 项。`ssr-known-failures.json` 为 `{}`。 |
| 16 | 四种组合的文档站整页图，并且亲眼看过 | 过 | 四张都标成文档站整页，无对位。路径和看到的内容见下方「看图」。像素和 `getBoundingClientRect` 核对过面板贴底。 |
| 17 | `useSheetGestures.ts` 不超过 500 行，且不在行数白名单 | 过 | `wc -l`：`useSheetGestures.ts` 498，`sheetTransition.ts` 72（等过渡结束），`sheetDragMath.ts` 117（磁吸、速度、关闭距离、嵌套滚动），`sheetPointerSession.ts` 71（窗口指针监听）。`line-limit-allowlist.json` 里搜不到 `useSheetGestures` 或 `BottomSheet`。`node scripts/check-line-limit.mjs` 打印「源码单文件行数检查通过（上限 500 行）」，退出码 0。 |
| 18 | 指定 vitest 两种 NODE_ENV 都通过，用例数相同 | 过 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/BottomSheet packages/core/src/Theme/registry.test.ts packages/core/src/layer/layerCss.test.ts`：5 个文件、91 条通过。`NODE_ENV=production` 同一命令：5 个文件、91 条通过。 |
| 19 | typecheck、eslint、行数、`!important`、导出检查通过 | 过 | `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck` 退出码 0。对改过的 Vue/TS 跑 `eslint --max-warnings 0` 退出码 0。行数检查和 `check-no-important.mjs` 退出码 0。`node scripts/sync-exports.mjs --check` 打印「生成结果和已提交文件一致」，退出码 0。 |
| 20 | 改动都在计划范围内；三份总控文档没动 | 过 | `git diff $BASE --stat` 共 20 个文件：BottomSheet 源码和测试、`bottom-sheet.css`、行数白名单、中英文 `index.md`、`ledger/C8.md`、本节点 plan/verify/impl，以及 `packages/cli/src/generated/catalog.json`。`ROADMAP.md`、`SWARM.md`、`HANDOFF.md` 无差异。catalog 只改了底部弹窗用法段里的内边距说明；`pnpm --filter @astryx-vue/cli generate:check` 打印「catalog is up to date」，退出码 0，属于计划允许的生成文件。`types.ts` 只改了 `padding` 的注释，和中英文说明是同一句话。 |
| 21 | 注释里没有修改历史 | 过 | 全量 diff 里那条正则有 7 处命中，都在台账、计划、实现回报、验收计划的正文里（「改成」是任务描述或上游光标变迁，验收计划自身还包含这条正则）。`git diff $BASE -- '*.vue' '*.ts' '*.css' '*.js' '*.mjs'` 再跑同一条正则：没有命中。 |

## 看图

无对位，没有和上游拼图。四张都是文档站整页视口截图，页面为 `http://127.0.0.1:4187/components/bottom-sheet`。滚到示例标题「高度」，打开 capped 面板。浅色是 `color-scheme: light` 且 `html` 没有 `dark`；深色是 `html.dark`、`color-scheme: dark`。没有空白页、骨架屏或报错层。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c8-verify-1/desktop-light.png`（1440×900） | 文档站整页，无对位 | 顶栏有文档、组件、演练场、主题。左侧组件侧栏，「底部弹窗」为当前项。半透明遮罩下还能看见「推荐 / 避免」。白色面板从底部升起，顶上有拖拽条，标题 `capped height`，下面有分隔线和说明，再下面是 Close。正文没有贴死面板边缘。中线像素从面板直到最后一行是白色。 |
| `/opt/cursor/artifacts/c8-verify-1/desktop-dark.png`（1440×900） | 文档站整页，无对位 | 同一页、同一示例、面板同样开着。侧栏和顶栏仍在。面板是深灰 `rgb(38,38,38)`，贴住底边。 |
| `/opt/cursor/artifacts/c8-verify-1/mobile-light.png`（390×844） | 文档站整页，无对位 | 顶栏有「菜单」和「返回顶部」。侧栏收起。白色面板从底部升起，内容与桌面同一段 capped 示例。 |
| `/opt/cursor/artifacts/c8-verify-1/mobile-dark.png`（390×844） | 文档站整页，无对位 | 同一手机宽度、深色。顶栏仍有「菜单」。深灰面板贴底，内容与浅色手机图相同。 |

## 对实现者偏离计划的判断

实现者写「惯性投影按计划没有搬」，这一条合理。计划写明松手仍停在拖动方向里的最近档，不把上游 #7170 的惯性投影套上来。代码里 `resolveSettleOffset` 只在拖动方向的档位里取最近档；速度超过 1.2 且距离超过 48px 才直接展开或关闭。`dismisses on a slow pull past the shortest stop and snaps to a detent otherwise` 仍期望中速拖动停在可见高度 384、布局高度 432px，拉过最短档才关闭。该用例包含在通过的 91 条里。停靠行为仍符合验收计划，不因此判不过。

除此之外，实现回报里没有别的偏离。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

中英文属性页 `apps/docs/docs/zh/components/bottom-sheet/props.md` 和英文对应行，`padding` 仍是旧句子，只写了主题边距和唯一子区块会顶掉，没有写表格和分隔线会按发布的边距伸展。组件页正文和 `types.ts` 已经写了。属性表没有说反，所以本轮不因此判不过。
