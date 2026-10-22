# C4 PowerSearch / CommandPalette · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c4-power-search`。从 `swarm-tree` 的 `dd1967e7` 切出。已推送，draft PR 的 base 是 `swarm-tree`。
- 提交（基于 `dd1967e7`）：
  - `410849d8` docs(C4): 写下 PowerSearch 与命令面板的执行计划和验收计划
  - `c634a2fb` feat(PowerSearch): 拆开大文件并接上 v0.7.1 的筛选行为
  - `708a0eae` feat(CommandPalette): 对齐键盘、指针和读屏
  - `63e06e67` docs: 补上结构化搜索和命令面板的行为说明
  - `d44e5e59` docs(C4): 给台账每条写下结论
  - 本回报另有一次提交

## 1. 做了什么

1. 写了 `plan.md` 和 `verify.md`。实现期间没有再改 `verify.md`。
2. 筛选的增删改、编辑器开关和键盘处理抽到 `usePowerSearchActions.ts`。分组标题和图标抽到 `menuPresentation.ts`。`PowerSearch.vue` 493 行，已从 `scripts/guardrails/line-limit-allowlist.json` 删除。菜单滚动和结果数量播报仍留在组件里。
3. `containerClass` / `containerStyle` 落在字段外壳，`controlClass` / `controlStyle` 和组件根上的 class、style 落在画边框的外框，`id` 和透传属性落在 input 上。空运算符在选择回调里用 `queueMicrotask` 保存一次；再选同一个不保存。点已有空条件只提交一次修改，不打开内置编辑器；`components.empty.editor` 或编辑器插槽仍会打开。编辑器定位默认留白 16，并读浮层的 inline 两侧和 block 留白。窄布局用编辑器自己的容器查询。条件值用 `truncateCharacters` 按字素截断。非法数字草稿的 Enter 不往上冒泡。
4. 命令项禁用指针是 `default`，悬停选择器排除 `data-disabled`。粗指针按下走 `usePressFeedback` 的 `data-astryx-press`，按下底色写在高亮和选中之后。鼠标划过不 `scrollIntoView`，方向键才滚。Home / End 留在输入框。Page Up / Page Down 跳到第一项或最后一项可用项。模态 Escape 不 `preventDefault`。单独的输入框是 `searchbox`，名字来自标签；单独的列表保留调用方 `id`。搜索图标是语义名 `search`。
5. 补了 Vue 测试，更新了中英文说明和属性页。台账 46 条都有结论。
6. 跑了下面的自测。`pnpm docs:build` 完成，页面渲染没有报错。文档站整页截图在 `/opt/cursor/artifacts`，无对位。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/PowerSearch/PowerSearch.vue` | 493 | 字段外壳、菜单和编辑器锚点 |
| `packages/core/src/PowerSearch/usePowerSearchActions.ts` | 375 | 条件增删改、编辑器会话、键盘 |
| `packages/core/src/PowerSearch/menuPresentation.ts` | 29 | 菜单分组标题和类型图标 |
| `packages/core/src/PowerSearch/PowerSearchValueField.vue` | 387 | 值控件，含非法数字的 Enter |
| `packages/core/src/PowerSearch/PowerSearchEditor.vue` | 209 | 字段、运算符和保存 |
| `packages/core/src/CommandPalette/CommandPalette.vue` | 268 | 键盘、高亮原因、Escape |
| `packages/core/src/CommandPalette/CommandPaletteInput.vue` | 173 | 搜索框角色和语义图标 |
| `packages/core/src/CommandPalette/CommandPaletteItem.vue` | 105 | 按压、悬停不滚动 |
| `packages/core/src/CommandPalette/CommandPaletteList.vue` | 39 | 单独使用时保留 id |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #7347 空运算符 | 选择回调里 `queueMicrotask` 保存一次；再点空标签只提交 | 编辑器同样在选择回调里保存；点标签走 `activate`，空运算符直接 `edit` | 条件只多一条，编辑器关掉，焦点回搜索框。自带空编辑器仍打开 |
| #7339 样式落点 | 根 class 转到 Tokenizer 的 container | `useFieldPartStyling`：外壳和外框分开，根 class 在外框 | 两边都能单独上样式，input 接到 id |
| #6919 浮层留白 | 编辑器最小宽度用 layer 的 maxInlineSize | 定位默认 16，CSS 用 `--astryx-layer-max-inline-size` | 窄窗口时编辑器让出两侧 16 |
| 字素截断 | `truncateCharacters`，省略号算进上限 | 同一个工具 | emoji 不被从中间切开 |
| 命令面板键盘和指针 | Home/End 不改高亮；禁用 `cursor: default`；悬停不滚动 | 同样的按键分支和样式顺序 | 手感和读屏角色一致 |
| 图标 | React 图标注册表 | 语义名 `search`、`close` | 主题用 `defineTheme({ icons })` 替换 |

## 3. 和计划不一样的地方

计划只写抽一个动作 composable。`PowerSearch.vue` 把菜单滚动和结果播报留回去之后又超过 500 行，所以分组标题和类型图标再放到 `menuPresentation.ts`。行为没有变。

禁用指针的测试读样式表文本，并检查 `data-disabled`。happy-dom 不算嵌套 CSS，`getComputedStyle` 拿不到 `cursor`。

## 4. 台账处理

一共 46 条。已采纳 37 条。不适用 9 条：

- `e891c0dc8`：后一条 #5335 把禁用指针改回 default，C 阶段共同要求也是 default。
- `540f19e62`：React 合并 ref 的身份抖动，Vue 模板 ref 没有这一层。
- `9ef3dab62`：上游 spec.md 里的主题缺口，本库没有那份文件。
- `6bac5b924`：上游文档站 preview 种子 props，本库用 Vue demo。
- `12a6e8a83`：StyleX 丢掉简写。本库是普通 CSS。
- `1bd7016ff`：搜索源被换掉时的 bootstrap 属于 Typeahead，C3 已做。
- `af5510c87`：搜索源在渲染期失效，同样是 Typeahead / C3。
- `1581b0900`：上游把测试分进不同 vitest 项目。本库只有一套配置。
- `8bf4b5136`：上游模块合同 spec，本库不维护那些文件。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 PowerSearch、CommandPalette、`inputFontFloor.test.ts`、`layerCss.test.ts` | 过 | 77 通过，0 失败 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 同样 77 通过，0 失败 |
| 3 | core typecheck、改过目录的 eslint `--max-warnings 0`、`check-line-limit`、`check-no-important`、`sync-exports.mjs --check` | 过 | 退出码都是 0。行数检查通过。导出和已提交文件一致 |
| 4 | 文档站整页，端口 4184，中文 `/components/power-search` 和 `/components/command-palette` | 过 | 无对位。桌面 1440 看见侧栏，390 看见「菜单」，滚到「字段和运算符」和「异步搜索」。图在 `/opt/cursor/artifacts/c4-*.png` |
| 5 | `env -u NODE_ENV pnpm docs:build` | 过 | `build complete in 51.85s`，rendering pages 成功 |
| 6 | catalog | 无 | 没有改组件清单。`sync-exports --check` 通过，没有跑 generate |

`PowerSearch` 和 `CommandPalette` 不在 `packages/core/src/ssr-known-failures.json` 里。

## 6. 拿不准的地方

模态命令面板的 Escape 交给对话框的 `cancel`。内嵌面板的测试仍会关掉。happy-dom 会不会发出原生 `cancel`，这次没有单独证。真浏览器里对话框会关。

计划对照表里写窄编辑器时字段上下排列，那是在说布局，不是在写修改历史。
