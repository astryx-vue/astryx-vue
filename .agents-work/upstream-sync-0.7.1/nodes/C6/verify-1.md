# C6 验收报告 · 第 1 轮

结论：通过（26/26）

- 工作区：`/workspace`，分支 `sync/c6-menus`，被验收的代码提交 `f662c71`。
- 比较基点：`BASE = 4a5b9a4227675ee7ca1f56caa17788d5e30adead`（`git merge-base HEAD origin/swarm-tree`；本地没有 `swarm-tree` 分支，用的是刚抓下来的 `origin/swarm-tree`）。
- 临时文件：`/tmp/verify-C6/`。截图在 `/opt/cursor/artifacts/`，没有进 git。材料都是这轮重新生成的，没有用实现者留下的图。
- 只读检查：开始时 `git status` 是干净的；写这份报告之前再跑一次，仍是干净的。两次相同。构建产物在被忽略的 `packages/core/dist/`，文档站缓存同样被忽略。
- 临时改动：无。没有改业务代码，没有改 `layer/`。
- 浏览器：`browser-lock` 的 `browser-1`。云端没有 swarm 槽位，文档站开在 `http://127.0.0.1:5173`。测完已停掉，该端口不再应答。没有残留的 vitepress 或浏览器进程。
- 上游文档：`https://astryx.atmeta.com/components/dropdown-menu` 返回 HTTP 404，所以没有左右对照。主证据是本库 VitePress 中文文档站整页。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 文档站整页，菜单展开 | 过 | 中文 `/components/dropdown-menu` 滚到「动作」并点开。桌面浅色、桌面深色、390 浅色、390 深色各一张，另加一张更多菜单。侧栏或顶栏都在，菜单展开。上游 404，没有并排图。见「看图」。 |
| 2 | 按压打开，松手执行；手指按下不立刻打开 | 过 | `DropdownMenu.test.ts`：`opens on pointerdown and activates the row the pointer releases on` 断言回调一次且菜单关闭；`keeps a touch press on the trigger from opening until the long press` 在 499ms 仍关闭，500ms 才打开。整组 147 条通过。 |
| 3 | ArrowUp 落在最后一行，方向键循环，连发不执行 | 过 | `opens on ArrowDown with the first row and on ArrowUp with the last`、`walks the rows ... wrapping`、`never activates on the auto-repeat of the key that opened the menu`。 |
| 4 | 悬停 150ms 飞出，指针在飞出层上保持打开；钻入时 Escape 只退一级 | 过 | `opens a flyout after the hover delay and keeps it while the pointer is over the flyout`（149ms 仍关，再 1ms 打开，离开后进入飞出层并再等 1000ms 仍开）。`pops one drill-in level on Escape and leaves the menu open`。 |
| 5 | 页眉页脚是对话框，Tab 循环；没有时 Tab 关闭 | 过 | `treats a menu with a header or footer as a dialog and wraps Tab inside it`：`role="dialog"`、`aria-modal="true"`、`aria-haspopup="dialog"`，从行 Tab 到页脚再 Tab 回页眉，菜单仍开，页眉里按 `b` 焦点留在输入框。`closes on Tab so the page keeps the tab order` 覆盖没有页眉页脚的情况。普通触发器 `aria-haspopup="menu"`（同文件开头那条）。 |
| 6 | 读屏角色和默认名随语言 | 过 | 菜单 `role="menu"`，行 `role="menuitem"`，分组 `role="group"`（`DropdownMenuFrame.vue`、`DropdownMenuItem.vue`、`DropdownMenuGroup.vue`）。链接行测试断言是 `<a href>` 且仍是 `menuitem`。文案：英文 Menu / Context menu / More options，中文「菜单」/「快捷菜单」/「更多选项」（`locale/messages/{dropdown,context,more}-menu.ts`）。`names the default trigger from the active locale` 以及快捷菜单、更多菜单测试断言了中文名。 |
| 7 | 只用键盘打开、执行、关闭 | 过 | ArrowDown 打开落第一行，ArrowUp 打开落最后一行；`runs the focused row with Enter and Space`；`closes on Escape and returns focus to the trigger`。 |
| 8 | Escape 只关最上面一层 | 过 | 命令：`env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/DropdownMenu/DropdownMenu.test.ts -t "closes only the top flyout on Escape"`。输出：`Test Files 1 passed`，`Tests 1 passed \| 47 skipped (48)`，退出码 0。见 `/tmp/verify-C6/item8-escape.txt`。第一次 Escape 后飞出层 `display:none`、父菜单仍开，第二次才关父菜单。 |
| 9 | 禁用触发器打不开 | 过 | `does not open from a disabled trigger`：`isDisabled` 以及自定义触发器 `aria-disabled="true"`，click、Enter、ArrowDown、pointerdown 后菜单都不显示。 |
| 10 | 指针关掉后焦点环关掉，键盘再聚焦会拿掉 | 过 | `suppresses the focus ring after a pointer pick and restores it for a keyboard focus`：焦点回到触发器且 `data-astryx-focus-ring="off"`，随后 Tab 再聚焦，该属性消失。 |
| 11 | 链接行不可拖，修饰键不调用 onClick | 过 | `renders a link row as one anchor ...`：`href="#docs"`、`draggable="false"`，`metaKey` 点击不调用 `onClick`。`does not mark an ordinary row as draggable`：普通行没有这个属性。`isModifiedClick` 认 meta/ctrl/shift/alt。 |
| 12 | 空菜单和超长标签留在视口内；高度上限跟着抬 | 过 | 390 宽文档站上，打开「动作」菜单后把一行改成 160 字并等 500ms：菜单 `right=374`（视口 390），`scrollWidth` 仍是 390。删光行后空面板 `right=151`，页面宽度不变。默认内联 `--_dropdown-menu-max-block` 实测为 `min(300px, calc(100dvh - 16px))`。`lifts the height cap...` 断言 `menuMaxHeight: 480` 时这条变量含 `480px`，源码写成 `min(480px, calc(100dvh - 16px))`。记录在 `/tmp/verify-C6/item12.json`。超长标签那张是内部核对，不是给用户的主图。 |
| 13 | 箭头仍是语义名，没有新图标注册表 | 过 | 菜单里是 `chevronDown` / `chevronRight` / `chevronLeft`。`git diff BASE` 没有动 `Icon/`。 |
| 14 | 不用 important；触摸手势 | 过 | `node scripts/check-no-important.mjs` 退出码 0。放得下面板 `touch-action: pinch-zoom`，`data-overflow="true"` 时 `pan-y pinch-zoom`（`dropdown-menu.css`、`context-menu.css`）。这两个文件里没有 `touch-action: none`。 |
| 15 | 台账每条有结论 | 过 | `ledger/C6.md`：`- [x]` 62 条，`- [ ]` 0 条，结论 62 条。已采纳 54，不适用 8，没有第三种。抽查已采纳：`0e1fbdbe0` 对上按压测试，`39f263645` 对上高度上限测试，`c3f64eff9` 对上链接行测试。8 条不适用分别是主题兼容层、React ref、StyleX、手写 CSS、CLI 提示、Playwright 夹具、Playwright 汇总、知识库生成，理由和提交说明对得上。 |
| 16 | 新增测试两种 NODE_ENV | 过 | 与第 21 条同一组：两种环境都是 6 个文件、147 条，退出码 0。 |
| 17 | 文档把 Tab 写成对话框内循环，默认名跟语言 | 过 | 中文 `dropdown-menu/index.md` 和英文同页都写：有页眉或页脚时 Tab 在对话框里绕回，菜单保持打开；没有时 Tab 仍关闭。快捷菜单、更多菜单的默认文案在对应语言页上分别是「快捷菜单」/ Context menu、「更多选项」/ More options。中文下拉菜单和更多菜单的示例都点开过。 |
| 18 | SSR 失败名单里没有这三个菜单 | 过 | `packages/core/src/ssr-known-failures.json` 是空对象 `{}`。 |
| 19 | 整页图亲眼看过并标明来源 | 过 | 下面五张主图都标了「文档站整页」。超长标签那张标「内部核对」。 |
| 20 | 两个文件不超过 500 行，且不在白名单 | 过 | `DropdownMenu.vue` 493 行，`types.ts` 314 行。白名单里没有 `DropdownMenu`。基准上这两个文件是 514 和 532 行，空白行当时就是 0，现在也是 0，不是靠删空行。行数降下来是因为拆出了 `DropdownMenuFrame.vue`（156）、`rowTypes.ts`（246）、`DropdownMenuBranch.vue`（17），白名单里原来的 517 / 532 两条已删。 |
| 21 | 菜单 vitest 两种环境 | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/DropdownMenu packages/core/src/ContextMenu packages/core/src/MoreMenu`：6 文件，147 通过。`NODE_ENV=production` 再跑：仍是 147。退出码都是 0。日志在 `/tmp/verify-C6/vitest-unset.txt`、`vitest-prod.txt`。 |
| 22 | typecheck 和 eslint | 过 | `env -u NODE_ENV pnpm typecheck` 退出码 0。`pnpm exec eslint --max-warnings 0` 覆盖三个菜单目录，退出码 0，无输出。 |
| 23 | 行数检查 | 过 | `node scripts/check-line-limit.mjs` 退出码 0，打印「源码单文件行数检查通过（上限 500 行）」。另外提示 PowerSearch、TableData 可以收紧白名单，那是原有文件，不是这轮引入的失败。 |
| 24 | diff 不碰层、路线图和规程；导出一致 | 过 | `git diff BASE --stat` 没有 `layer/`、`ROADMAP.md`、`SWARM.md`。`node scripts/sync-exports.mjs --check` 打印「生成结果和已提交文件一致」，退出码 0。 |
| 25 | 新增行不讲修改历史 | 过 | 全 diff 有 5 处命中，都在 `plan.md`、`impl-1.md`、`verify.md`，是计划、回报和本检查项自己的句子。`packages/`、`apps/`、`scripts/` 里没有命中。 |
| 26 | 关闭栈仍是布尔，用会关闭的那一档 | 过 | **依赖 #142 合入后跟进，本轮不因此判否。** `layer/dismissStack.ts` 里 `dismissOnEscape` 仍是 `boolean`。菜单经 `useDismiss` 登记，不传 `enableEscape` 时 `isEscapeEnabled()` 为真，也就是 `dismissOnEscape: true`。`git diff BASE -- packages` 没有 `'close' \| 'block' \| 'ignore'`。`impl-1.md` 写了「待修复线程合入后对齐」。#142 仍是打开的 draft，还没合入。 |

## 看图

上游同页是 404，所以没有左上游、右我们。下面前五张是文档站整页，地址是中文路由，没有 `/zh/`。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c6-verify-dropdown-desktop-light.png` | 文档站整页 | `http://127.0.0.1:5173/components/dropdown-menu`，1440×900，浅色。顶栏有「文档 / 组件 / 演练场 / 主题」，左侧是组件侧栏。滚到「示例 / 动作」，Actions 菜单展开，里面是 Edit、Duplicate、Move to folder、Archive、Delete。 |
| `/opt/cursor/artifacts/c6-verify-dropdown-desktop-dark.png` | 文档站整页 | 同一页，深色。`html` 带 `dark`，`color-scheme: dark`。侧栏宽 260，顶栏还在。同一组菜单展开，底是深色。 |
| `/opt/cursor/artifacts/c6-verify-dropdown-390-light.png` | 文档站整页 | 390×844，浅色。侧栏收到屏外。顶上是窄屏条：左边「菜单」，右边「返回顶部」。动作菜单展开，右缘 262，没有超出 390，页面 `scrollWidth` 仍是 390。 |
| `/opt/cursor/artifacts/c6-verify-dropdown-390-dark.png` | 文档站整页 | 390×844，深色。同样有窄屏顶栏，菜单展开，底色是深色。 |
| `/opt/cursor/artifacts/c6-verify-more-desktop-light.png` | 文档站整页 | `http://127.0.0.1:5173/components/more-menu`，1440×900，浅色。侧栏和顶栏都在。滚到「默认」，三点按钮打开的菜单是 Edit、Duplicate、Delete。 |
| `/opt/cursor/artifacts/c6-verify-long-label-390.png` | 内部核对 | 在已打开的菜单里把一行改成重复的「超长标签」，等定位稳定。菜单宽 320，右缘 374，仍在 390 视口内。这不是文档站原样，不作为给用户的主图。 |

## 对实现者偏离计划的判断

- 关闭栈仍用布尔 `dismissOnEscape: true`，没有提前写三档类型，也没有改 `layer/`。和 `verify.md` 第 26 条一致，合理。等 #142 合入后再把 `true` 换成 `'close'`。
- 飞出层没有绑 `useMenuHover` 自带的键盘处理。悬停延时和安全三角的测试是过的，左方向键仍能关飞出层。合理。
- 底部动作条不走按压模型。这轮验收清单没有要求动作条也按压打开。合理。
- 面包屑里写死的 Menu 留给 C13。本轮文档和菜单默认名已经随语言，合理。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

桌面整页上，展开的菜单压住了示例卡片下方的「描述」文字。这是浮层盖住后面的内容，菜单本身五行走全了。若以后要让对照图更好读，可以把触发按钮再往上放一点，让菜单落在预览区里面。
