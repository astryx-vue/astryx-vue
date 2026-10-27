# C12 验收报告 · 第 2 轮

结论：不通过（26/27）

- 工作区：`/workspace`，分支 `cursor/c12-list-tree-dffe`。验收开始时 tip 是 `9b81ecd3adb79383ea3248b1a9867e33ce1cebf2`，与任务指定的 tip 一致。
- 比较基点：`BASE = 5691a8caf71ead19c6e142be702e78fec278caba`（`origin/swarm-tree`）。
- 临时文件和截图：`/tmp/verify-C12/`。截图另存 `/opt/cursor/artifacts/c12-verify-2/shots/`。全部自己重新生成，没有用实现者留下的产物。截图不入库。
- 只读检查：开始时 `git status` 是 `On branch cursor/c12-list-tree-dffe`，工作区干净。结束时、写入本报告之前，工作区同样干净。本报告是这一轮唯一新增并提交的文件。
- 临时改动：跑过一次 `pnpm --filter @astryx-vue/cli generate`，只为看 `catalog.json` 差在哪。看完立即 `git checkout -- packages/cli/src/generated/catalog.json`。已还原。没有改业务源码。
- 浏览器：`browser-lock.mjs` 槽位 `browser-1`，用途 `C12-verify2-shots`、`C12-verify2-interact`、`C12-verify2-tree`。文档站 `env -u NODE_ENV pnpm --filter @astryx-vue/docs dev --port 5191 --host 127.0.0.1`。测完已关，`127.0.0.1:5191` 不再应答，两把浏览器锁都空闲，没有残留浏览器进程。

第 2 轮产品改动相对第 1 轮验收 tip `da79c71b` 只有 8 个文件：树行、树测试、中英文树属性文档、台账，以及 `plan-r2.md`、`verify.md`、`impl-2.md`。List、Outline、OverflowList、MetadataList 和三份样式没有再改。实现者说这一轮不改视觉。总览页的 Demo 和样式确实没动；属性页文案有改。上一轮截图不在这台机器上，所以 20 张整页图全部重拍。无对位。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 五个中文文档页，桌面/390 × 浅色/深色，整页并滚到实质 Demo。无对位 | 过 | 20 张视口图都看过。桌面 1440×900 有左侧组件栏和顶栏，没有「菜单」按钮。390×844 顶栏有「菜单」和「返回顶部」。都停在「示例」里的第一个 Demo。见下方看图表。无对位。 |
| 2 | 触屏拖过半宽停开、按钮可执行、鼠标拖不动、`commit` 只留最外侧并在拖过整行时执行、行外按下收回、`javascript:` 不渲染链接 | 过 | 滑动相关源码相对 `da79c71b` 没有改动。`useItemSwipe.ts` 只在 `pointerType === 'touch'` 时开始拖；`commit` 越过整行后执行最外侧；文档 `pointerdown` 收回；Escape 收回。`Item.vue` 在 `commit` 时每侧只留最后一个操作。`TreeList.test.ts` 断言 `javascript:` 不渲染 `<a>`。这些用例都在第 26 项的 78 条里通过。 |
| 3 | 树行名字来自标题、说明用 `aria-describedby`、行样式在 `treeitem` 上、根 `id` 在外层、`aria-label` 在树上、有标题时标题优先、根上 `preventDefault` 后方向键不移动 | 过 | `TreeListItem.vue` 把 `aria-labelledby` 指到标题，有说明才挂 `aria-describedby`，`className`/`style` 在 `role="treeitem"` 的 `li` 上。`TreeList.vue` 把 `id` 和 `data-*` 放在外层，`aria-label` 放在 `role="tree"`；有 `header` 时 `aria-labelledby` 指向标题。根上先调调用方的 `onKeydown`，`defaultPrevented` 就返回。对应断言在第 26 项的 78 条里。这一轮给链接补 `rel`，没有改这些属性。 |
| 4 | Markdown 目录 id、同名后缀、围栏和引用、DOM 的 h1–h6 | 过 | `parseOutlineFromMarkdown.test.ts` 断言 `# Getting Started` 得到 `getting-started`，三个 `# Setup` 得到 `setup`、`setup-1`、`setup-2`，围栏里的 `# not a heading` 不进目录，引用后再出现的根标题是 `quoted-1`。该文件相对 `da79c71b` 没有改动，并在第 26 项通过。 |
| 5 | `visibleCount` 等于项数不发 `overflowChange`，收起后带原下标，同一组不重复，重新可见发空数组；禁用指针是 `default` | 过 | `OverflowList.vue` 在 `collapsedKey` 为空且还没报过时直接返回，否则发出 `{ item, index }`。`overflow-list.css` 第 72 行是 `cursor: default`，文件里没有 `not-allowed`。源码相对 `da79c71b` 没有改动，测试在第 26 项通过。 |
| 6 | 元数据并排时 `id` 在 `dt`，叠放时在外壳；根上透传仍在根上，`data-columns` 自己决定；侧标和值 `word-break: break-word` | 过 | `MetadataListItem.vue` 关闭继承。叠放时 attrs 在 `.astryx-metadata-list__item`，并排时在 `dt`。`MetadataList.vue` 先展开 attrs，再写自己的 `data-columns`。`metadata-list.css` 第 20 行是 `minmax(0, 1fr)`，第 80 行是 `word-break: break-word`。源码相对 `da79c71b` 没有改动。 |
| 7 | ArrowLeft 收起父节点；大纲仍是单个 Tab 停靠点，Space 会导航；停开的行按 Escape 收回 | 过 | 文档站点树的展开按钮，`aria-expanded` 从 `true` 变成 `false`，`[data-tree-id="app"]` 从 4 个变成 3 个（页面上还有别的 Demo 和舞台）。大纲四个链接的 `tabindex` 是 `0,-1,-1,-1`；点 Next 后当前节是 Results。Escape 收回仍在 `useItemSwipe.ts`，测试在第 26 项通过。见 `/tmp/verify-C12/interact.json`、`tree-collapse.txt`。 |
| 8 | 树行名字来自标题元素；列表行有描述时描述有 id，`useItemDescriptionId` 能读到 | 过 | 树行 `aria-labelledby` 仍指向 `.astryx-tree-list__label`。`List.test.ts` 把 `useItemDescriptionId()` 和描述元素的 id 对上。都在第 26 项的 78 条里。 |
| 9 | 五个组件不在 SSR 已知失败名单；`docs:build` 通过 | 过 | `packages/core/src/ssr-known-failures.json` 是 `{}`。`env -u NODE_ENV pnpm docs:build` 退出码 0，`/tmp/verify-C12/docs-build.txt` 末尾是 `build complete in 55.53s`。 |
| 10 | 空溢出列表不报溢出；没有标题的 Markdown 是空数组；超长侧标靠 `word-break`，`minmax(0, 1fr)` 仍在 | 过 | 溢出报告的空键短路仍在 `OverflowList.vue`。解析测试仍覆盖空输入和纯段落。网格规则见第 6 项。这些文件相对 `da79c71b` 没有改动，测试在第 26 项通过。 |
| 11 | 不新增语义图标，不引入另一套注册表；滑动图标仍由调用方传入 | 过 | `git diff $BASE --stat -- packages/core/src/Icon` 为空。`Item.vue` 的滑动按钮仍用 `action.icon`。 |
| 12 | 没有 `!important`；`overflow-list.css` 没有 `not-allowed` | 过 | `node scripts/check-no-important.mjs` 退出码 0，成功时没有输出，`/tmp/verify-C12/no-important.txt`。`overflow-list.css` 搜不到 `not-allowed`。 |
| 13 | 台账 54 条都有结论；抽查已采纳；全部不适用理由站得住 | 过 | 54 条都是 `- [x]`，已采纳 32，不适用 22，没有空结论。第 1 轮不过的两处已分开处理：`c3f64eff9` 仍是已采纳，树行现在确实补了 `noopener noreferrer`；`17b2fcfed` 改成不适用，理由和代码一致，详见第 24、25 项。其余不适用仍是 StyleX、React ref、不搬规范正文和 Playwright；嵌套列表标记和任务勾选不经过 List。已采纳抽查了滑动停开、溢出报告、`word-break`，都对得上当前代码。 |
| 14 | 本轮行为都有 Vue 测试，两种 `NODE_ENV` 都通过 | 过 | 第 1 轮那些行为的测试还在。第 2 轮新增的新窗口 `rel` 和同页不写 `rel` 在 `TreeList.test.ts`。第 26 项两种环境都是 7 个文件、78 条通过。没有要求搬 Playwright。 |
| 15 | 中英文文档和现有行为一致；中文示例能操作 | 过 | 中英文都写了树的 `className`/`style`、行名、`target="_blank"` 的 `rel`、条目 `isSelected`。溢出文档写了 `overflowChange`。大纲文档写了 `parseOutlineFromMarkdown` / `useOutlineFromDOM`。中文页能收起树、大纲 Next 切到 Results、溢出 `+4` 打开菜单、元数据「显示更多」变成「收起」。见 `/tmp/verify-C12/interact.json`。 |
| 16 | `List`、`TreeList`、`Outline`、`OverflowList`、`MetadataList` 都不在 SSR 已知失败名单 | 过 | 同第 9 项，名单是空对象。 |
| 17 | 五种页面、四种组合的文档站整页图，并且亲眼看过 | 过 | 20 张都读过，来源都是文档站整页。无对位。路径见看图表。这一轮重拍，因为上一轮图不在本机，而且树的属性文案有改。总览 Demo 的样子和第 1 轮记录一致。 |
| 18 | 新写和改到的源码不超过 500 行，没有改行数白名单 | 过 | `node scripts/check-line-limit.mjs` 输出「源码单文件行数检查通过（上限 500 行）」，退出码 0。`git diff $BASE -- scripts/guardrails/line-limit-allowlist.json` 为空。 |
| 19 | 相关 vitest 在两种 `NODE_ENV` 下通过，用例数相同 | 过 | 同第 26 项。`env -u NODE_ENV` 和 `NODE_ENV=production` 都是 7 个文件、78 条，退出码 0。第 1 轮是 76 条，这一轮多了树链接的两条。 |
| 20 | typecheck、eslint、行数、`!important`、`sync-exports --check` | 过 | `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck` 退出码 0。改过的 vue/ts 跑 `eslint --max-warnings 0` 退出码 0。行数和 `!important` 见第 12、18 项。`node scripts/sync-exports.mjs --check` 输出「生成结果和已提交文件一致」，退出码 0。 |
| 21 | diff 没有计划范围以外的文件；看板、白名单没动；catalog 不能让 generate:check 变红 | 不过 | `git diff $BASE --stat` 是 40 个文件，都在 List、TreeList、Outline、OverflowList、MetadataList、三份样式、中英文文档、台账和 `nodes/C12` 的计划/验收/回报里。`ROADMAP.md`、`SWARM.md`、`HANDOFF.md`、`PR128-BODY.md`、行数白名单不在 diff 里。`catalog.json` 也没有被改。但是 `pnpm --filter @astryx-vue/cli generate:check` 退出码 1，输出是 `packages/cli/src/generated/catalog.json is stale`。临时生成后的 diff 是 1 个文件、34 行新增、6 行删除，内容就是本节点写进文档的大纲解析、元数据换行和透传、`overflowChange`、树的 `className`/`style` 和行名。已还原。 |
| 22 | 新增注释不是在讲修改历史 | 过 | `git diff $BASE` 按指定正则的命中仍只在计划和验收文档里：「原来的下标」是原下标，「改成」出现在计划步骤和上一轮验收的修改说明里。源码注释没有这类修改历史。`git diff da79c71b` 的新增行没有命中。 |
| 23 | 树行 `target="_blank"` 的 `rel` 含 `noopener` 和 `noreferrer`；同页链接不带 `rel`；测试在两种 `NODE_ENV` 通过 | 过 | `TreeListItem.vue` 在 `target === '_blank'` 时把 `rel` 设为 `noopener noreferrer`，否则是 `undefined`，绑在安全 `href` 渲染出的链接上。`TreeList.test.ts` 有这两条：新窗口拆开排序后是 `noopener`、`noreferrer`；同页 `href="/docs"` 的 `rel` 和 `target` 都是 `undefined`。第 26 项 78 条里包含它们。 |
| 24 | 台账 `17b2fcfed` 标不适用；选择是条目 `isSelected`；文档不说根上 `v-model` | 过 | 台账结论是「不适用：上游选择就是条目上的 `isSelected`，树没有根上的选中值，也不强制只有一行选中。本库本来就是这个条目字段，效果相同，不另造 `v-model`。」上游 `17b2fcfed` 只改了 `TreeList.spec.md`。DEC-2 写调用方用 `isSelected` 标出至多一行，树不强制，也不声明 `aria-multiselectable`。上游 `TreeListProps` 没有 `selected`、`modelValue` 或 `onSelectionChange`。本库 `TreeListProps` 同样没有 `modelValue`，全目录搜不到 `defineModel`。`aria-selected` 和 `data-selected` 仍来自 `item.isSelected`。中英文 `tree-list/props.md` 写「树没有根上的选中值」。打开 `http://127.0.0.1:5191/components/tree-list/props`，页面有这句和 `rel="noopener noreferrer"`，正文没有 `v-model`。 |
| 25 | `c3f64eff9` 仍是已采纳，和现在的 `rel` 一致；54 条全是勾，32 已采纳，22 不适用 | 过 | 结论仍是「Item 和树行的 `href` 渲染成真实链接，`target="_blank"` 补 `noopener noreferrer`。」和 `TreeListItem.vue` 的 `linkRel` 一致。计数见第 13 项：54 条 `- [x]`，已采纳 32，不适用 22，没有空结论。 |
| 26 | 相关 vitest 两种 `NODE_ENV` 通过且用例数相同；typecheck、eslint、行数、`!important`、导出检查通过 | 过 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 List、TreeList、Outline、OverflowList、MetadataList：7 个文件、78 条，退出码 0，`/tmp/verify-C12/vitest-unset.txt`。`NODE_ENV=production` 同一命令：7 个文件、78 条，退出码 0，`/tmp/verify-C12/vitest-prod.txt`。typecheck、eslint、行数、`!important`、`sync-exports --check` 都是退出码 0，见第 20 项。 |
| 27 | diff 不含看板、白名单、`catalog.json`；自 `da79c71b` 起的新增行不是修改历史 | 过 | `git diff $BASE --stat` 不含 `ROADMAP.md`、`HANDOFF.md`、`PR128-BODY.md`、`scripts/guardrails/line-limit-allowlist.json`、`packages/cli/src/generated/catalog.json`。`git diff da79c71b` 用第 22 项的正则搜新增行，没有命中。catalog 过期记在第 21 条，不重复记在这里。 |

## 看图

对照图结论：无对位。下面每张都是文档站整页的视口图，不是夹具，也不是 `pnpm visual` 的 overview。桌面 1440×900，窄屏 390×844。浅色是白底，深色是深色底。没有报错层，没有只剩标题的空白。桌面能看见左侧组件栏（总览、应用外壳、宽高比）和顶栏；窄屏顶栏有「菜单」和「返回顶部」。内容都滚到「示例」。

第 2 轮没有改样式和 Demo。属性页文案有改，所以树的总览图重拍后，Demo 仍是原来的文件树。上一轮截图不在本机，20 张都是这一轮新拍的。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/tmp/verify-C12/shots/list-desktop-light.png` | 文档站整页，无对位。`http://127.0.0.1:5191/components/list` | 浅色。侧栏在。示例是 Notifications / Privacy / Security，下面还有项目符号。 |
| `/tmp/verify-C12/shots/list-desktop-dark.png` | 同上，深色 | 同一段示例，深色底。侧栏在。 |
| `/tmp/verify-C12/shots/list-mobile-light.png` | 同上，390 宽，浅色 | 顶栏有「菜单」。示例三行都在。 |
| `/tmp/verify-C12/shots/list-mobile-dark.png` | 同上，深色 | 顶栏仍有「菜单」，示例内容相同。 |
| `/tmp/verify-C12/shots/tree-list-desktop-light.png` | 文档站整页，无对位。`/components/tree-list` | 浅色。侧栏在。示例是带图标的文件树，`src` 下有 `App.tsx`。 |
| `/tmp/verify-C12/shots/tree-list-desktop-dark.png` | 同上，深色 | 同一棵树，深色。 |
| `/tmp/verify-C12/shots/tree-list-mobile-light.png` | 同上，390 宽，浅色 | 顶栏有「菜单」。文件树和设置树都在。 |
| `/tmp/verify-C12/shots/tree-list-mobile-dark.png` | 同上，深色 | 顶栏有「菜单」。 |
| `/tmp/verify-C12/shots/outline-desktop-light.png` | 文档站整页，无对位。`/components/outline` | 浅色。侧栏在。示例「受控」列出 Summary、Details、Results，当前是 Details。 |
| `/tmp/verify-C12/shots/outline-desktop-dark.png` | 同上，深色 | 同一段受控大纲。 |
| `/tmp/verify-C12/shots/outline-mobile-light.png` | 同上，390 宽，浅色 | 顶栏有「菜单」。Previous / Next 都在。 |
| `/tmp/verify-C12/shots/outline-mobile-dark.png` | 同上，深色 | 顶栏有「菜单」。 |
| `/tmp/verify-C12/shots/overflow-list-desktop-light.png` | 文档站整页，无对位。`/components/overflow-list` | 浅色。侧栏在。限量工具栏是 Save、Edit、`+4`。 |
| `/tmp/verify-C12/shots/overflow-list-desktop-dark.png` | 同上，深色 | 同一组工具栏。 |
| `/tmp/verify-C12/shots/overflow-list-mobile-light.png` | 同上，390 宽，浅色 | 顶栏有「菜单」。下面还有从开头折叠的 `+3 more`。 |
| `/tmp/verify-C12/shots/overflow-list-mobile-dark.png` | 同上，深色 | 顶栏有「菜单」。 |
| `/tmp/verify-C12/shots/metadata-list-desktop-light.png` | 文档站整页，无对位。`/components/metadata-list` | 浅色。侧栏在。基础示例是 Name / Status / Owner。 |
| `/tmp/verify-C12/shots/metadata-list-desktop-dark.png` | 同上，深色 | 同一组键值。 |
| `/tmp/verify-C12/shots/metadata-list-mobile-light.png` | 同上，390 宽，浅色 | 顶栏有「菜单」。可折叠示例有「显示更多」。 |
| `/tmp/verify-C12/shots/metadata-list-mobile-dark.png` | 同上，深色 | 顶栏有「菜单」。 |

同一路径也复制到了 `/opt/cursor/artifacts/c12-verify-2/shots/`。

## 对实现者偏离计划的判断

`impl-2.md` 写「和计划不一样的地方：无」。树行 `rel`、台账 `17b2fcfed`、中英文属性文案和计划一致。计划写了不改 `catalog.json`。文件确实没改，但文档已经变了，生成检查因此变红。这和「不碰 catalog」的计划字面一致，验收不能因此放过。

## 不通过的项要怎么改

第 21 条。

`pnpm --filter @astryx-vue/cli generate:check` 现在会失败。已提交的 `packages/cli/src/generated/catalog.json` 还没有本节点写进文档的这些内容：大纲从 Markdown 取目录、元数据的换行和条目透传、`overflowChange`、树行的 `className` / `style` 和行名。在仓库根目录执行 `pnpm --filter @astryx-vue/cli generate`，把生成出的 `catalog.json` 提交。提交后 `generate:check` 应退出码 0。不要改组件行为，也不要改行数白名单。

## 改进建议（不影响结论）

- 中英文树文档仍写 `start` / `end` 插槽会替换图标。`TreeList.vue` 和 `TreeListItem.vue` 没有渲染这两个插槽。这是原有缺口，本轮验收项没有单独要求它。
