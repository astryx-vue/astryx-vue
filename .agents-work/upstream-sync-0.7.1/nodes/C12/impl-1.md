# C12 列表与树 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `cursor/c12-list-tree-dffe`。
- 提交（基于 swarm-tree `5691a8ca`）：
  - `fcee25e0` docs(C12): 写下列表与树的执行计划和验收清单
  - `1ed0b4a6` feat(C12): 补上列表滑动、树行名字、大纲解析和溢出报告
  - `cee2535a` docs(C12): 写完列表与树台账的 54 条结论
  - 本回报是随后那一次 docs 提交

## 1. 做了什么

按计划的开发步骤做完。

1. 已写 `plan.md` 和 `verify.md`。
2. 列表行：`javascript:` 这类地址不再渲染成链接。可交互且未禁用的行挂上已有的按压标记。滑动停开后，在行外按下指针，行收回。没有 `swipeActions` 时不渲染滑动层。
3. 树：行用标题的 id 命名，用说明描述。敲字符只匹配标题。单项的 `className` 和 `style` 落在 `role="treeitem"` 的那一行。`id` 和 `data-*` 在外层，`aria-label` 在 `role="tree"` 上；有可见标题时标题优先。调用方在根上 `preventDefault` 之后，方向键不再被树抢走。可点行按压。危险链接同样不渲染。禁用行没有悬停底。
4. 大纲：新增 `parseOutlineFromMarkdown`、`useOutlineFromMarkdown`、`useOutlineFromDOM`。id 和 Markdown 渲染同一套 slug。链接挂按压。`pnpm sync` 更新了总出口。
5. 溢出列表：`overflowChange` 在确实收起时发出 `{ item, index }[]`。一开始没收起不发。同一组不重复发。重新全部可见时发空数组。禁用指针是 `default`。
6. 元数据条目关闭属性继承。并排时透传落在 `dt`，上下叠放时落在包住标签和值的那一层。侧标和值允许在长单词处断开。
7. 台账 54 条都写了结论。中英文文档补了树的行样式和行名、溢出事件、大纲解析、元数据换行。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/List/Item.vue` | 438 | 危险链接不渲染，可点行挂按压标记 |
| `packages/core/src/List/useItemSwipe.ts` | 255 | 停开后，行外按下指针就收回 |
| `packages/core/src/TreeList/TreeList.vue` | 186 | 透传属性、标题优先、键盘取消 |
| `packages/core/src/TreeList/TreeListItem.vue` | 207 | 行名、行样式、按压、危险链接 |
| `packages/core/src/TreeList/useTreeFocus.ts` | 269 | 敲字符只看 `aria-labelledby` |
| `packages/core/src/Outline/parseOutlineFromMarkdown.ts` | 49 | 从 Markdown 抽出和正文锚点一致的目录 |
| `packages/core/src/Outline/useOutlineFromMarkdown.ts` | 13 | 正文一变，目录跟着变 |
| `packages/core/src/Outline/useOutlineFromDOM.ts` | 51 | 读容器里带 id 的 h1–h6 |
| `packages/core/src/OverflowList/OverflowList.vue` | 149 | 收起的那一组变了才发 `overflowChange` |
| `packages/core/src/MetadataList/MetadataListItem.vue` | 37 | 并排透传到 `dt`，叠放透传到外壳 |
| `packages/core/styles/overflow-list.css` | 79 | 禁用指针是 `default` |
| `packages/core/styles/metadata-list.css` | 108 | 侧标和值 `word-break: break-word` |
| `packages/core/styles/tree-list.css` | 229 | 禁用行不画悬停底 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| AST-057 / #6821 #7296 | 触屏滑动露出操作，鼠标拖不动；停开后点外面或 Escape 收回 | `useItemSwipe`。没有滑动操作就不渲染那一层，不拆异步包 | 拖过半宽停开；`commit` 滑出整行执行最外侧一个；点外面收回 |
| #7472 #5606 #5476 | 行名来自标题；`preventDefault` 取消导航；属性分到外层和树上 | `aria-labelledby` 指向标题；根上先调调用方的 `onKeydown` | 读屏只读标题；方向键可以被拦住 |
| #6238 | 单项 `xstyle` | 单项 `className` 和 `style` 落在行上 | 这一行能单独加类、单独着色 |
| #6911 #4765 #6382 | 目录 id 和标题锚点同一套 | `slugify` / `uniqueSlug`，嵌套标题占编号但不进目录 | 目录点下去能滚到渲染出来的那一节 |
| #5199 | `onOverflowChange` | `overflowChange` 事件 | 调用方拿到被收起的项和它在 `items` 里的下标；放得下时不叫 |
| #5335 #5247 | 禁用指针是默认，禁用行不悬停 | 溢出 chip 的 `cursor` 是 `default`；树行悬停排除禁用 | 禁用处没有禁止指针，也没有悬停底 |
| #6598 #5563 #7331 | 窄容器里侧标可换行；条目透传属性 | `word-break: break-word`；并排落在 `dt`，叠放落在外壳 | 长单词断开，值那一列仍能收缩 |

## 3. 和计划不一样的地方

无。滑动层没有再拆成异步分包：没有 `swipeActions` 时那一层不渲染，效果和「只有需要时才接上」相同。

## 4. 台账处理

一共 54 条。已采纳 33 条，不适用 21 条。

不适用：

- `ea0483449`、`6e6b9b476`：StyleX appearance 嵌套令牌，随后被撤回。本库用 CSS 变量。
- `310177296`、`0353bb2bb`：嵌套列表标记和混排任务勾选框由 Markdown 渲染（C9）负责，不经过 List。
- `41950da6a`、`255e810cf`、`12a6e8a83`、`ca8f5292b`：StyleX 变量守卫、主题轴增强、简写和构建检查。本库手写 CSS。
- `e891c0dc8`：禁用指针一度是禁止指针，随后被 #5335 收成默认指针。本库只保留默认指针。
- `540f19e62`：合并 ref 身份是 React 的问题。
- `1232b85af`：列表、树、大纲本来就用 `data-*`，没有裸的 prop 类名可删。
- `9ef3dab62`、`1e29ea2d4`、`89dbbf7c6`、`d93c5479f`、`0faf070d8`、`8bf4b5136`：不搬 `spec.md` 和 `doc.mjs`。
- `2873b9398`：不搬 Playwright 夹具。树的角色和键盘已有 Vue 测试。
- `8962994b0`、`e7aafdba8`、`18d2bcb24`：不搬 AST-057 规范正文。滑动行为在组件和中英文文档里。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 List、TreeList、Outline、OverflowList、MetadataList | 过 | 7 个文件、76 条用例 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 7 个文件、76 条用例 |
| 3 | core typecheck、改过源码的 eslint `--max-warnings 0`、行数、`!important`、导出 | 过 | `vue-tsc` 退出码 0；eslint 退出码 0；行数检查通过；`check-no-important` 退出码 0；`sync-exports --check` 一致 |
| 4 | `env -u NODE_ENV pnpm docs:build` | 过 | 先构建 core，随后 vitepress 渲染完成，约 52 秒。这五个组件不在 `ssr-known-failures.json` |
| 5 | 文档站整页 | 过 | 无对位。预览 `http://127.0.0.1:4173`，五个中文页滚到「示例」。测完已关服务 |
| 6 | 行数和指针 | 过 | 新写和改到的源码都不超过 500 行。没有改行数白名单，也没有改 `catalog.json`。`overflow-list.css` 里没有 `not-allowed` |

没有跑整库 `pnpm check`。相关 vitest、core typecheck、改过文件的 eslint、行数、导出和文档站构建都过了。

截图（不入库）。无对位。桌面 1440×900 能看见顶栏和左侧组件侧栏。390×844 顶栏有「菜单」。都滚到「示例」里的第一个 Demo。

| 图 | 看到的内容 |
| --- | --- |
| `/opt/cursor/artifacts/c12-list-tree/list-desktop-light.png` | 浅色。侧栏在，示例「基本」是 Notifications / Privacy / Security。 |
| `/opt/cursor/artifacts/c12-list-tree/list-desktop-dark.png` | 同一页，深色。 |
| `/opt/cursor/artifacts/c12-list-tree/list-mobile-light.png` | 390 宽，浅色。顶上有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/list-mobile-dark.png` | 390 宽，深色。顶上仍有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/tree-list-desktop-light.png` | 浅色。示例是带图标的文件树，`src` 下面有 `App.tsx`。 |
| `/opt/cursor/artifacts/c12-list-tree/tree-list-desktop-dark.png` | 同一页，深色。 |
| `/opt/cursor/artifacts/c12-list-tree/tree-list-mobile-light.png` | 390 宽，浅色，有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/tree-list-mobile-dark.png` | 390 宽，深色，有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/outline-desktop-light.png` | 浅色。示例「受控」列出 Summary、Details、Results。 |
| `/opt/cursor/artifacts/c12-list-tree/outline-desktop-dark.png` | 同一页，深色。 |
| `/opt/cursor/artifacts/c12-list-tree/outline-mobile-light.png` | 390 宽，浅色，有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/outline-mobile-dark.png` | 390 宽，深色，有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/overflow-list-desktop-light.png` | 浅色。示例「限量工具栏」是 Save、Edit 和 `+4`。 |
| `/opt/cursor/artifacts/c12-list-tree/overflow-list-desktop-dark.png` | 同一页，深色。 |
| `/opt/cursor/artifacts/c12-list-tree/overflow-list-mobile-light.png` | 390 宽，浅色，有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/overflow-list-mobile-dark.png` | 390 宽，深色，有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/metadata-list-desktop-light.png` | 浅色。示例是 Name / Status / Owner 三行。 |
| `/opt/cursor/artifacts/c12-list-tree/metadata-list-desktop-dark.png` | 同一页，深色。 |
| `/opt/cursor/artifacts/c12-list-tree/metadata-list-mobile-light.png` | 390 宽，浅色，有「菜单」。 |
| `/opt/cursor/artifacts/c12-list-tree/metadata-list-mobile-dark.png` | 390 宽，深色，有「菜单」。 |

## 6. 拿不准的地方

树的 `start` / `end` 插槽在类型和文档里有，`TreeList.vue` 没有把它们画出来。这是原有缺口，本轮台账没有对应的用户可见行为，所以没有补。
