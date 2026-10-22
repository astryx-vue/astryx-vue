# C12 列表与树 · 执行计划

## 目标

列表行在触屏上可以左右滑出操作，松手后停开或滑出执行；树的每一行只按标题被读屏读出，说明单独作为描述，调用方可以拦住方向键。大纲能从 Markdown 或页面标题里抽出和正文锚点一致的目录。放不下的溢出列表会把收起的那一组报出来。禁用的溢出项用默认指针。

## 工作环境

- 工作区：`/workspace`，分支 `cursor/c12-list-tree-dffe`，从最新 `swarm-tree`（`5691a8ca`）切出。
- 动手前已读：`SWARM.md`、`HANDOFF.md`、`ROADMAP.md` 里 C12 那一行、C 阶段 6 条、「B2 留下的禁用指针」、`ledger/C12.md`、`nodes/C8/plan.md`。
- 环境纪律：测试和构建前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 浏览器纪律：同一时刻只开一个文档站。截图放 `/opt/cursor/artifacts`，不进 git。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| AST-057 / #6821 #7296 | 手机上把一行往两侧拖，会露出事先声明的操作。鼠标拖不动。默认松手后停开，点操作才执行；`commit` 拖过阈值就滑出并执行最外侧那一个。点到行外面，或焦点在行里时按 Escape，停开的行收回去。拖完浏览器补发的点击不会再点到行本身。 |
| #4590 #6440 | `edgeCompensation="inline"` 时，每一行按左右各自的容器内边距往外让，最多让到行自己的内边距，标题不动。列表在行内方向用 `clip` 裁切，滑出的操作不会画出列表。 |
| #7472 #7460 #7498 | 树的一行只以标题为名，说明是描述。展开按钮、图标、末尾内容不进名字。敲字符跳转也只匹配标题。行上有 `aria-level`、`aria-posinset`、`aria-setsize`。 |
| #6238 #6406 | 树的单项可以带自己的 `class` 和 `style`，落在这一行上。 |
| #5476 #5606 | 树把 `id` 放在外层，把 `aria-label` 放在 `role="tree"` 上。有可见标题时，标题盖过外面传来的名字。调用方在根上 `preventDefault` 之后，方向键不再被树抢走。 |
| #6821 链接、#5524 | 行和树节点的 `href` 是真链接，`target="_blank"` 补上 `noopener noreferrer`。`javascript:` 这类地址不会变成链接。 |
| #6911 #6382 #4765 | `parseOutlineFromMarkdown` 抽出的 id 和 Markdown 渲染到标题上的 id 是同一套，目录点下去能滚到那一节。围栏代码里的假标题不算。引用里的标题占掉重复 id，但不进目录。 |
| #5199 | 溢出列表在确实收起了一些项之后，用 `overflowChange` 交出被收起的项和原来的下标。一开始就放得下时不叫。重新放得下时再交一次空数组。同一组不重复交。 |
| #5335 #5247 #5516 | 禁用的溢出项、树行、列表行是默认指针，没有禁止指针。禁用行没有悬停底色。可点的行、树行、目录链接走已有的触屏按压。 |
| #6598 #7331 #5563 | 元数据列表侧标在窄容器里可以换行，值那一列可以收缩。条目上的透传属性：并排时落在 `dt`，上下叠放时落在包住标签和值的那一层。列表根上的透传已经落在根上。 |
| #6420 #7027 #7045 | 分隔线不到最后一行。嵌套列表的不同标记、混排任务项的勾选框由 Markdown 渲染，不经过 `List`。 |

## 上游依据

- 台账条目：`ledger/C12.md` 全部 54 条。
- 上游源码：`packages/core/src/Item`、`List`、`TreeList`、`Outline`、`OverflowList`、`MetadataList` 在 v0.7.1 的公开 props 和测试名。查文件用 `git -C /tmp/astryx-upstream show v0.7.1:<路径>`。
- 上游测试：上述目录里的 `*.test.tsx` 与 `parseOutlineFromMarkdown.test.ts`。行为改写成 Vue 测试，不搬 Playwright 夹具。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `onOverflowChange(items)` | `overflowChange` 事件，参数是 `{ item, index }[]` | 调用方拿到同一批被收起的项和原来的下标 |
| `useOutlineFromMarkdown` | 同名组合式函数，参数可以是 ref | 正文一变，目录跟着变 |
| `useOutlineFromDOM(ref)` | 同名组合式函数，读 `Ref<HTMLElement \| null>` | 容器里的 h1–h6 增删改 id 时，目录更新 |
| StyleX `xstyle` | 行上的 `className` 和 `style` | 这一行能被单独着色、单独加类 |
| React `onKeyDown` 在根上 | 根上的 `onKeydown`，先交给调用方，`defaultPrevented` 就停 | 方向键可以被拦住，事件的 currentTarget 仍是外层 |
| 滑动层按需拆包 | 只有设置了 `swipeActions` 才渲染滑动层并接指针 | 没有滑动操作的行不长出那一层 |

涉及图标的地方继续用语义名。滑动操作的 `icon` 仍是调用方传入的组件，本节点不新增图标。

## 任务范围

- 要改：
  - `packages/core/src/List/`（危险链接、按压、点外部收回滑动）
  - `packages/core/src/TreeList/`（行名、行样式、透传、键盘取消、按压、危险链接）
  - `packages/core/src/Outline/`（解析、DOM 目录、按压）以及 `packages/core/src/index.ts`（由 `pnpm sync` 生成）
  - `packages/core/src/OverflowList/`、`packages/core/styles/overflow-list.css`
  - `packages/core/src/MetadataList/`、`packages/core/styles/metadata-list.css`
  - `packages/core/styles/tree-list.css`（禁用行不悬停）
  - 中英文文档里树、溢出列表、大纲的对应段落
  - `ledger/C12.md`
  - 本目录的 `verify.md`、`impl-1.md`
- 不碰：
  - `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`
  - Markdown 自己的列表标记和任务勾选（C9 已做）
  - `scripts/guardrails/line-limit-allowlist.json`、`packages/cli/src/generated/catalog.json`
  - 别的组件的按压和关闭栈

## 开发步骤

1. 写本计划和 `verify.md`。
2. 列表行：危险地址不渲染成链接；可交互且未禁用的行挂上已有按压；滑动停开后，点到行外就收回。
3. 树：行用标题的 id 命名、用说明描述；typeahead 只看这个名字；单项的 `className` / `style` 落在行上；根上透传 `id` 等属性，`aria-label` 落在树上，有标题时标题优先；调用方 `preventDefault` 后不再导航；可点行按压；危险链接同样不渲染。
4. 大纲：`parseOutlineFromMarkdown`、`useOutlineFromMarkdown`、`useOutlineFromDOM`，id 和 Markdown 标题同一套规则。链接挂按压。跑 `pnpm sync` 更新总出口。
5. 溢出列表：`overflowChange` 按「没收起就不叫、收起了才叫、放回去再交空数组」报告。禁用指针改成 `default`。
6. 元数据条目透传属性，侧标和值允许在长单词处断开。
7. 台账 54 条写结论。补中英文文档。跑相关 vitest 两种 `NODE_ENV`、typecheck、eslint、行数、`!important`、导出检查。截文档站整页。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 `packages/core/src/List`、`packages/core/src/TreeList`、`packages/core/src/Outline`、`packages/core/src/OverflowList`、`packages/core/src/MetadataList`，全部通过。
2. `NODE_ENV=production` 同一路径，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check`。改到文档站会渲染的组件，再跑 `env -u NODE_ENV pnpm docs:build`。
4. 文档站中文 `/components/list`、`/components/tree-list`、`/components/outline`、`/components/overflow-list`、`/components/metadata-list`：桌面与 390px、浅色与深色，整页，滚到有实质 Demo 的地方。无对位，不拼上游图。图放 `/opt/cursor/artifacts`，能看见侧栏或顶栏上的「菜单」。
5. 新写和改到的源码不超过 500 行。样式里没有 `!important`，溢出列表没有 `cursor: not-allowed`。

## 提交与回报

- 提交信息用中文。分几次提交。完成后推送 `cursor/c12-list-tree-dffe`，开 draft PR，base 为 `swarm-tree`，标题 `C12 列表与树`。
- 不改 `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`，不合并。
- 回报写 `nodes/C12/impl-1.md`。
- 最终回复用中文：摘要和 PR 链接。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/c12-*`。
