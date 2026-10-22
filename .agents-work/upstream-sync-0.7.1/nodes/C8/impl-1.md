# C8 BottomSheet · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c8-bottom-sheet`。云端没有本机 worktree。
- 提交（基于 swarm-tree `dd1967e7`）：
  - `1c38a58d` docs(C8): 写下底部面板的执行计划和验收清单
  - `b0d654c7` feat(C8): 底部面板默认留出内边距，并拆开拖动手势
  - `f6fc79e9` docs(C8): 写明底部面板默认内边距会交给里面的内容
  - `de1adab9` docs(C8): 写完底部面板台账的 61 条结论
  - 本回报是随后那一次 docs 提交

## 1. 做了什么

按计划的开发步骤做完。

1. 已写 `plan.md` 和 `verify.md`。
2. 内容区改成和 Card 一样的边距链。不传 `padding` 时不写 `data-padding`，四边读主题变量，最后落到 `--astryx-spacing-4`。传入档位时四边都用该档。padding 读已经发布的 `--container-padding-*`，并同时写出 layout padding。面板根仍是 `astryx-layer`。`scopedProvide.ts` 已经 import `layer.css`，面板 setup 里继续走这条路径，并补了 `provideLayerDepth()`。
3. `useSheetGestures.ts` 拆成过渡等待、拖动计算、指针会话三个模块。主文件 498 行，已从 `line-limit-allowlist.json` 删除。第二指取消拖动。手指下面的滚动盒子还没到头时，不把拖动交给面板。拖拽条 `touch-action` 改为 `pinch-zoom`。
4. 独立面板和切换器在打开时 `pushLayer`，点外面不由关闭栈处理。上面还有层时，对话框上的 Escape 不 `preventDefault`，留给最上层。非模态 Escape 登记为 `ignore`，只有事件打到对话框才关。指针关闭后的焦点归还走 `focusForLastInput`，不画环。面板 body 和 content 接上已有的 `attachScrollKeyboardDelegation`。
5. 台账 61 条都写了结论。中英文文档的内边距段已改，catalog 已重新生成。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/styles/bottom-sheet.css` | 363 | 默认边距链、发布 container / layout padding、拖拽条把缩放留给浏览器 |
| `packages/core/src/BottomSheet/BottomSheetPanel.vue` | 178 | `data-padding`、滚动键盘委托、嵌套深度 |
| `packages/core/src/BottomSheet/useSheetGestures.ts` | 498 | 只编排拖动、停靠和关闭 |
| `packages/core/src/BottomSheet/sheetTransition.ts` | 72 | 读过渡时间并等待结束 |
| `packages/core/src/BottomSheet/sheetDragMath.ts` | 117 | 磁吸、速度、关闭距离、嵌套滚动判断 |
| `packages/core/src/BottomSheet/sheetPointerSession.ts` | 71 | window 指针监听和取消拖动 |
| `packages/core/src/BottomSheet/useSheetLayerDismiss.ts` | 49 | 打开时登记关闭栈，返回 `isTop()` |
| `packages/core/src/BottomSheet/BottomSheet.vue` | 332 | Escape、取消事件、指针关闭不画环 |
| `packages/core/src/BottomSheet/BottomSheetSwitcher.vue` | 225 | 切换器自己登记关闭栈 |
| `packages/core/src/BottomSheet/BottomSheet.test.ts` | 532 | 边距、上层 Escape、非模态、焦点环、嵌套滚动、第二指 |
| `packages/core/src/BottomSheet/types.ts` | 127 | `padding` 注释改成发布给子内容 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #6884 #6883 #6938 | StyleX 把 padding 降成 `--container-padding-*`，内容区 padding 读这份变量 | 样式表写主题变量链，`data-padding` 覆盖成间距刻度 | 不传时四边最后是间距 4；显式档位四边相同；子元素用同一份数字抵消 |
| #7225 | `useLayerDismissal` | 面板和切换器各自 `pushLayer`，点外面不关 | Escape 只打最上面一层；非模态不抢页面上的 Escape |
| #7388 | `focusForLastInput` | 关闭后走已有的 `focusForLastInput` | 指针关闭不画环，键盘关闭照常画 |
| #7192 #7198 | 第二指取消拖动，`touch-action` 留给缩放 | 第二指 `cancelDrag`，拖拽条改为 `pinch-zoom` | 双指缩放不带动面板 |
| #7168 | 从事件目标走到内容区，中间滚动盒没到头就不拖面板 | `blockScrollEdges` | 嵌套滚动没到头时先滚里面 |
| B4 | 浮层根带 layer 类并引入 layer 样式 | 面板根已有 `astryx-layer`，经 `scopedProvide` 引入 `layer.css` | 面板不继承触发器所在位置的排版，容器边距在根上归零 |

## 3. 和计划不一样的地方

无。惯性投影按计划没有搬。

## 4. 台账处理

一共 61 条。已采纳 32 条，不适用 29 条。

不适用：

- `3c50fccc8`：本库没有发布过上游 0.6 要删除的旧 BottomSheet API。
- `1fdecb1ae`：选择器行挂点，归 C3。
- `ea0483449`、`6e6b9b476`：外观嵌套令牌随后被撤回，归 B1。
- `e891c0dc8`：禁用光标一度改成 not-allowed，随后被 #5335 改回 default。本库拖拽条是 grab，没有 not-allowed。
- `540f19e62`：合并 ref 是 React 的问题。
- `12a6e8a83`：本库手写 CSS，没有 StyleX 简写被改写的问题。
- `a83e568e3`：Vue 的 style 绑定每次拖动都会把 transform 写到元素上。
- `9613feb6d`：松手仍停在拖动方向里的最近档。速度超过 1.2 且距离超过 48px 的甩动会直接展开或关闭。上游惯性投影套到现有中速拖动上会改掉已经锁定的停靠距离。
- `59b333428`：遮罩一直是对话框的 backdrop，没有单独的 scrim 换肤挂点可删。
- `a9b5c3d2b`：上游测试读数修正，没有新的用户可见行为。对应行为已有 Vue 测试。
- `48088c611`、`aeb66f5a3`、`9e106a267`：上游文档标点或 lab 晋升说明，不改变行为。
- `005d9758b`、`425c803e7`、`9d8c69234`、`d19588c0b`、`f4984589e`、`8af0f8e02`：上游规范或容器边距架构文档。发布行为和默认边距已采纳，规范文件不搬。
- `fa93107ff`：AppShell 文档，归 C14。
- `176dfa624`、`8bf4b5136`、`2ca486d78`、`7d4628128`、`a8d6bf291`：上游审查、契约、滚动系统文档或规范草稿。
- `e508afce7`：本库这些文件没有对应的 lint 抑制注释。
- `191758193`：主要改 Popover。edge tint 本身已经在面板上。
- `98dd9837f`：主要改 DropdownMenu 的自适应说明，归 C6。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 BottomSheet、`registry.test.ts`、`layerCss.test.ts` | 过 | 5 个文件、91 条用例 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 5 个文件、91 条用例 |
| 3 | core typecheck、改过文件的 eslint `--max-warnings 0`、行数、`!important`、导出、catalog | 过 | `vue-tsc` 退出码 0；eslint 退出码 0；行数检查通过；`check-no-important` 退出码 0；`sync-exports --check` 一致；`generate:check` 通过 |
| 4 | `env -u NODE_ENV pnpm docs:build` | 过 | 先 `build:packages`，随后 vitepress 渲染完成，约 54 秒。`BottomSheet` 不在 `ssr-known-failures.json` |
| 5 | 文档站整页 | 过 | 无对位。预览 `http://127.0.0.1:4173/components/bottom-sheet`，滚到「高度」并打开 capped。测完已关服务 |
| 6 | 默认边距 | 过 | 不传 `padding` 时 `data-padding` 为空，内容区 computed padding 四边都是 16px，`--container-padding-inline-start` 和 `--layout-padding-outer-x` 都是 `1rem`。见 `/opt/cursor/artifacts/c8-bottom-sheet/evidence.json` |
| 7 | 行数和指针 | 过 | `useSheetGestures.ts` 498 行，白名单里已没有这个文件。样式里指针是 grab / grabbing，没有 `not-allowed`，也没有 `!important` |

没有跑整库 `pnpm check`。相关 vitest、core typecheck、改过文件的 eslint、行数、导出、catalog 和文档站构建都过了。

截图（不入库）：

| 图 | 看到的内容 |
| --- | --- |
| `/opt/cursor/artifacts/c8-bottom-sheet/desktop-light.png` | 1440×900，浅色。顶栏有文档、组件、演练场、主题，左侧是组件侧栏，「底部弹窗」处于当前项。打开 capped 面板，顶部有拖拽条，标题和正文四周留有空隙。 |
| `/opt/cursor/artifacts/c8-bottom-sheet/desktop-dark.png` | 同一页面，深色。侧栏和顶栏仍在，面板是深色。 |
| `/opt/cursor/artifacts/c8-bottom-sheet/mobile-light.png` | 390×844，浅色。顶栏有「菜单」。面板从底部升起。 |
| `/opt/cursor/artifacts/c8-bottom-sheet/mobile-dark.png` | 390×844，深色。顶栏仍有「菜单」，面板为深色。 |

## 6. 拿不准的地方

惯性投影（#7170）没有搬。现有中速拖动如果按上游公式往前抛，会超过关闭线，把已经锁定的停靠距离改掉。验收时如果要和上游松手落点逐像素对齐，需要单独加一轮，并改测试里的停靠断言。
