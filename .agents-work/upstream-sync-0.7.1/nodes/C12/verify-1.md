# C12 验收报告 · 第 1 轮

结论：不通过（21/22）

- 工作区：`/workspace`，分支 `cursor/c12-list-tree-dffe`。验收开始时 tip 是 `76ecdf61d4791546a0353ca624889758497f5b69`，与 `origin/cursor/c12-list-tree-dffe` 一致。
- 比较基点：`BASE = 5691a8caf71ead19c6e142be702e78fec278caba`（`origin/swarm-tree`）。
- 临时文件和截图：`/tmp/verify-C12/`，截图另存 `/opt/cursor/artifacts/c12-verify/`。全部自己重新生成，没有用实现者留下的产物。
- 只读检查：开始时 `git status` 是 `On branch cursor/c12-list-tree-dffe` / `nothing to commit, working tree clean`。结束时工作区同样干净，没有未提交的业务改动。本报告是这一轮唯一新增并提交的文件。
- 临时改动：曾把探测测试写到 `packages/core/src/c12-verify-probe.test.ts`，跑完立即删除。已还原。没有改业务源码，也没有改 `ROADMAP.md`、`HANDOFF.md`、`SWARM.md`、`PR128-BODY.md`、行数白名单、`catalog.json`。
- 浏览器：`browser-lock.mjs` 槽位 `browser-1`，用途 `C12-verify-*`。文档站 `env -u NODE_ENV pnpm --filter @astryx-vue/docs dev --port 5191 --host 127.0.0.1`。测完已关，`127.0.0.1:5191` 不再应答，没有残留浏览器进程。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 五个中文文档页，桌面/390 × 浅色/深色，整页并滚到实质 Demo。无对位 | 过 | 20 张视口图都看过。桌面 1440×900 能看见左侧组件栏和顶栏；390×844 顶栏有「菜单」。都停在「示例」里的第一个 Demo。见下方看图表。无对位，没有和上游拼图。 |
| 2 | 触屏拖过半宽停开、按钮可执行、鼠标拖不动、`commit` 只留最外侧并在拖过整行时执行、行外按下收回、`javascript:` 不渲染链接 | 过 | 停开阈值是操作面板宽度的一半。慢拖（时间戳 3000→3800）后 `--_item-swipe-travel=-72`，`data-swipe=resting`，按钮不在 `inert` 里，点击后 `onActivate` 调用 1 次；鼠标同样幅度仍是 `idle`。见 `/tmp/verify-C12/stamp2.log` 与 `stamp2-run.txt`（1 通过）。`commit` 只渲染 1 个「Delete」并执行它、Escape 收回、行外 `pointerdown` 收回、列表和树的 `javascript:` 都不出 `<a>`，见 `/tmp/verify-C12/probes.txt` 里其余 9 条。官方 `List.test.ts` 同组用例也在下面第 19 项的 76 条里通过。同一毫秒的合成事件会被算成甩动并直接执行，那是手势速度规则，不是停开失效。 |
| 3 | 树行名字来自标题、说明用 `aria-describedby`、行样式在 `treeitem` 上、根 `id` 在外层、`aria-label` 在树上、有标题时标题优先、根上 `preventDefault` 后方向键不移动 | 过 | `TreeListItem.vue` 把 `aria-labelledby` 指到标题元素，有说明才挂 `aria-describedby`，`className`/`style` 在 `role="treeitem"` 的 `li` 上。`TreeList.vue` 把 `id` 和 `data-*` 放在外层，`aria-label` 放在 `role="tree"`；有 `header` 时 `aria-labelledby` 指向标题，不用外面的 `aria-label`。根上先调调用方的 `onKeydown`，`defaultPrevented` 就返回。`TreeList.test.ts` 这些断言在第 19 项的 76 条里通过。 |
| 4 | Markdown 目录 id、同名后缀、围栏和引用、DOM 的 h1–h6 | 过 | 独立探测：`# Getting Started` → `{ id: 'getting-started', label: 'Getting Started', level: 1 }`；两个 `# Setup` → `setup`、`setup-1`；围栏里的 `# not a heading` 不进目录；`> # Quoted` 再加根上的 `# Quoted` 只得到 `quoted-1`。`useOutlineFromDOM` 读到 `a1,b2,c3,d4,e5,f6`，跳过没有 id 和没有文字的标题。见 `/tmp/verify-C12/probes.txt`。 |
| 5 | `visibleCount` 等于项数不发 `overflowChange`，收起后带原下标，同一组不重复，重新可见发空数组；禁用指针是 `default` | 过 | `OverflowList.vue` 在 `collapsedKey` 为空且还没报过时直接返回。`OverflowList.test.ts` 断言了 3→1→1→3 的调用次数和 `{ item, index }`。空列表不发，见探测。`overflow-list.css` 第 72 行是 `cursor: default`，文件里没有 `not-allowed`。 |
| 6 | 元数据并排时 `id` 在 `dt`，叠放时在外壳；根上透传仍在根上，`data-columns` 自己决定；侧标和值 `word-break: break-word` | 过 | `MetadataListItem.vue` 关闭继承。并排把 attrs 放在 `dt`，`label.position = top` 时放在 `.astryx-metadata-list__item`。`MetadataList.vue` 先展开 attrs，再写自己的 `data-columns`。探测里传入的 `data-columns="nope"` 仍是 `single`。`metadata-list.css` 有 `word-break: break-word` 和 `minmax(0, 1fr)`。 |
| 7 | ArrowLeft 收起父节点；大纲仍是单个 Tab 停靠点，Space 会导航；停开的行按 Escape 收回 | 过 | 焦点在已展开的 `src` 上派 `ArrowLeft` 后 `aria-expanded=false`，子行消失。大纲三个链接的 `tabindex` 是 `0,-1,-1`；对「Details」按 Space 后 `navigateStart` 是 `details`，`location.hash` 是 `#details`。停开后在行上派 Escape，200ms 后回到 `idle`。见 `/tmp/verify-C12/probes.txt`。文档站上点树的展开按钮，`aria-expanded` 从 `true` 变成 `false`。 |
| 8 | 树行名字来自标题元素；列表行有描述时描述有 id，`useItemDescriptionId` 能读到 | 过 | 树行 `aria-labelledby` 等于 `.astryx-tree-list__label` 的 id，展开按钮的 `aria-label` 不是标题。`List.test.ts` 把 `useItemDescriptionId()` 和 `.astryx-item__description` 的 id 对上；没有描述时是 `null`。这两条都在第 19 项的 76 条里。 |
| 9 | 五个组件不在 SSR 已知失败名单；`docs:build` 通过 | 过 | `packages/core/src/ssr-known-failures.json` 是 `{}`。`env -u NODE_ENV pnpm docs:build` 退出码 0，约 49 秒，`/tmp/verify-C12/docs-build.txt` 末尾是 `build complete in 48.96s`。 |
| 10 | 空溢出列表不报溢出；没有标题的 Markdown 是空数组；超长侧标靠 `word-break`，`minmax(0, 1fr)` 仍在 | 过 | 空 `OverflowList` 的 `overflowChange` 没有调用。`parseOutlineFromMarkdown('')` 和纯段落都是 `[]`。网格规则在 `metadata-list.css` 第 20 行和第 80 行。 |
| 11 | 不新增语义图标，不引入另一套注册表；滑动图标仍由调用方传入 | 过 | `git diff $BASE --stat -- packages/core/src/Icon` 为空。`Item.vue` 的滑动按钮用 `action.icon`，没有新的语义名。 |
| 12 | 没有 `!important`；`overflow-list.css` 没有 `not-allowed` | 过 | `node scripts/check-no-important.mjs` 退出码 0，`/tmp/verify-C12/no-important.txt`。`overflow-list.css` 搜不到 `not-allowed`，禁用规则是 `cursor: default`。 |
| 13 | 台账 54 条都有结论；抽查已采纳；全部不适用理由站得住 | 不过 | 54 条都是 `- [x]`，已采纳 33，不适用 21，没有空结论。不适用 21 条的理由站得住：StyleX 令牌和构建检查、React ref、规范正文和 Playwright 夹具不搬；嵌套列表标记和任务勾选在 Markdown 渲染里，`Markdown.test.ts` 已有对应断言。已采纳里，滑动、溢出报告、元数据透传、树行样式和行名、`word-break` 都对得上代码。但是 `c3f64eff9` 写「树行 `target="_blank"` 补 `noopener noreferrer`」，探测里树链接是 `<a href="https://example.com" target="_blank">`，`rel` 为 `null`。`17b2fcfed` 写选择经 `v-model` 持有，`TreeList` 没有 `v-model`，选择是条目上的 `isSelected`。 |
| 14 | 本轮行为都有 Vue 测试，两种 `NODE_ENV` 都通过 | 过 | 滑动停开、行外收回、树行名字、根上 `preventDefault`、大纲解析、溢出报告、元数据透传、危险链接都在对应 `*.test.ts` 里。第 19 项两种环境都是 7 个文件、76 条通过。没有要求搬 Playwright。 |
| 15 | 中英文文档和现有行为一致；中文示例能操作 | 过 | 中英文都写了树的 `className`/`style` 和行名、`overflowChange` 的收起规则、`parseOutlineFromMarkdown` / `useOutlineFromDOM`。文档站中文页点树的展开按钮能收起；大纲「Next」后当前节变成 Results；溢出「+4」打开 `role="menu"`；元数据「显示更多」变成「收起」，并出现 `Jan 15, 2026` 和 `Tier 1`。见 `/tmp/verify-C12/interact.txt`、`interact-meta2.txt`。 |
| 16 | `List`、`TreeList`、`Outline`、`OverflowList`、`MetadataList` 都不在 SSR 已知失败名单 | 过 | 同第 9 项，名单是空对象。 |
| 17 | 五种页面、四种组合的文档站整页图，并且亲眼看过 | 过 | 20 张都读过，来源都是文档站整页。无对位。路径见看图表。 |
| 18 | 新写和改到的源码不超过 500 行，没有改行数白名单 | 过 | `node scripts/check-line-limit.mjs` 输出「源码单文件行数检查通过（上限 500 行）」，退出码 0。`git diff $BASE --name-only` 里没有 `scripts/guardrails/line-limit-allowlist.json`。 |
| 19 | 相关 vitest 在两种 `NODE_ENV` 下通过，用例数相同 | 过 | 命令都是 `pnpm exec vitest run --maxWorkers=2`，路径为 List、TreeList、Outline、OverflowList、MetadataList。`env -u NODE_ENV`：7 个文件、76 条，退出码 0，`/tmp/verify-C12/vitest-unset.txt`。`NODE_ENV=production`：同样 7 个文件、76 条，退出码 0，`/tmp/verify-C12/vitest-prod.txt`。 |
| 20 | typecheck、eslint、行数、`!important`、`sync-exports --check` | 过 | `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck` 退出码 0。改过的 vue/ts 跑 `eslint --max-warnings 0` 退出码 0。行数和 `!important` 见第 12、18 项。`node scripts/sync-exports.mjs --check` 输出「生成结果和已提交文件一致」，退出码 0。 |
| 21 | diff 没有计划范围以外的文件；看板、白名单、catalog 没动 | 过 | `git diff $BASE --stat` 是 37 个文件，都在 List、TreeList、Outline、OverflowList、MetadataList、三份样式、中英文文档、台账和 `nodes/C12` 的计划/验收/回报里。`ROADMAP.md`、`SWARM.md`、`HANDOFF.md`、`catalog.json`、行数白名单的 diff 为空。 |
| 22 | 新增注释不是在讲修改历史 | 过 | `git diff $BASE` 按指定正则有命中，都在 `plan.md` 和 `verify.md`：「原来的下标」是原下标，不是「以前的实现」；「改成」出现在计划步骤里。源码注释没有这类修改历史。 |

## 看图

对照图结论：无对位。下面每张都是文档站整页的视口图，不是夹具，也不是 `pnpm visual` 的 overview。桌面 1440×900，窄屏 390×844。浅色是白底，深色是深色底。没有报错层，没有只剩标题的空白。桌面能看见左侧组件栏（总览、应用外壳、宽高比等）和顶栏；窄屏顶栏有「菜单」和「返回顶部」。内容都滚到「示例」。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/tmp/verify-C12/shots/list-desktop-light.png` | 文档站整页，无对位。`http://127.0.0.1:5191/components/list` | 浅色。侧栏在。示例「基本」是 Notifications / Privacy / Security，下面还有项目符号。 |
| `/tmp/verify-C12/shots/list-desktop-dark.png` | 同上，深色 | 同一段示例，深色底。侧栏在。 |
| `/tmp/verify-C12/shots/list-mobile-light.png` | 同上，390 宽，浅色 | 顶栏有「菜单」。示例「基本」三行都在。 |
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

同一路径也复制到了 `/opt/cursor/artifacts/c12-verify/`。截图不入库。

## 对实现者偏离计划的判断

回报里写「和计划不一样的地方：无」。滑动层没有再拆异步包，没有 `swipeActions` 时那一层不渲染。这和计划里「只有需要时才接上」的效果一致，合理。

## 不通过的项要怎么改

第 13 条。

1. 树行链接。`packages/core/src/TreeList/TreeListItem.vue` 里，`href` 安全时会渲染 `<a target>`，但 `target="_blank"` 没有补 `rel="noopener noreferrer"`。列表行 `Item.vue` 已经补了，测试也有。树行要补上同样的 rel，并加一条 Vue 测试。台账 `c3f64eff9` 的结论要么改成和代码一致，要么等代码补上后再维持现在这句。
2. 树的选择。台账 `17b2fcfed` 写「选择仍由调用方经 `v-model` 持有」。现在没有 `v-model`，调用方是在条目上设 `isSelected`。这句改成和代码一致即可，不必为了这句话新造一个 `v-model`。

## 改进建议（不影响结论）

- 中英文树文档仍写 `start` / `end` 插槽会替换图标。`TreeList.vue` 和 `TreeListItem.vue` 没有渲染这两个插槽。这是原有缺口，本轮验收项没有单独要求它，所以不计入不过。
- 列表滑动的官方测试在事件 `timeStamp` 仍为 0 时不会计算速度，所以「停开」是在这个条件下通过的。真实慢拖会停开，同一毫秒里的大幅移动会按甩动执行最外侧。若要让测试守住慢拖，给指针事件拉开时间戳。
