# C12 验收报告 · 第 3 轮

结论：通过（27/27）

- 工作区：`/workspace`，分支 `cursor/c12-list-tree-dffe`。验收开始时 tip 是 `2273079266f4ef8e1af052bbf000c62768c76792`。
- 比较基点：`BASE = 5691a8caf71ead19c6e142be702e78fec278caba`（`origin/swarm-tree`）。上一轮验收报告是 `cbd598bf`。
- 临时文件：`/tmp/verify-C12/generate-check-r3.txt`。本轮没有新截图。
- 只读检查：开始时工作区干净。结束时、写入本报告之前，工作区同样干净。本报告是这一轮唯一新增并提交的文件。
- 临时改动：无。没有改 `catalog.json`，也没有改业务源码。
- 浏览器：本轮没有开。相对 `cbd598bf` 只多了生成的 catalog，样式、Demo 和文档都没动，不重拍。

这一轮提交 `22730792` 相对 `cbd598bf` 只有 `packages/cli/src/generated/catalog.json`，40 行 diff，34 行新增、6 行删除。产品代码、测试、台账、中英文文档都和上一轮通过的 26 条保持一致。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 五个中文文档页，桌面/390 × 浅色/深色，整页并滚到实质 Demo。无对位 | 过 | 文档和样式相对 `cbd598bf` 没有改动。第 2 轮 20 张文档站整页图仍然有效：桌面有侧栏，390 宽有「菜单」。本轮不重拍。无对位。 |
| 2 | 触屏拖过半宽停开、鼠标拖不动、`commit`、行外收回、`javascript:` 不渲染链接 | 过 | `List`、`useItemSwipe.ts`、`Item.vue` 相对 `cbd598bf` 没有改动。上一轮两种 `NODE_ENV` 的 78 条仍覆盖这些行为。 |
| 3 | 树行名字、说明、行样式、根 `id`、`aria-label`、标题优先、`preventDefault` | 过 | `TreeList.vue` 和 `TreeListItem.vue` 相对 `cbd598bf` 没有改动。`aria-labelledby`、`aria-describedby`、`className`/`style` 仍在 `role="treeitem"` 上。 |
| 4 | Markdown 目录 id、同名后缀、围栏和引用、DOM 的 h1–h6 | 过 | `parseOutlineFromMarkdown.ts` 和它的测试相对 `cbd598bf` 没有改动。 |
| 5 | 溢出报告和禁用指针 `default` | 过 | `OverflowList.vue` 与 `overflow-list.css` 相对 `cbd598bf` 没有改动。禁用规则仍是 `cursor: default`，没有 `not-allowed`。 |
| 6 | 元数据透传位置、根上 `data-columns`、`word-break` | 过 | `MetadataList.vue`、`MetadataListItem.vue`、`metadata-list.css` 相对 `cbd598bf` 没有改动。 |
| 7 | ArrowLeft 收起；大纲单个 Tab 停靠点；Escape 收回 | 过 | 相关源码相对 `cbd598bf` 没有改动。第 2 轮在文档站点过树的展开按钮和大纲 Next。 |
| 8 | 树行名字来自标题；列表描述 id 能被 `useItemDescriptionId` 读到 | 过 | 相关源码和 `List.test.ts` 相对 `cbd598bf` 没有改动。 |
| 9 | 五个组件不在 SSR 已知失败名单；`docs:build` 通过 | 过 | `ssr-known-failures.json` 仍是 `{}`，本轮没有改文档。上一轮 `docs:build` 退出码 0。本轮不重跑。 |
| 10 | 空溢出列表、空 Markdown、超长侧标 | 过 | 相关源码相对 `cbd598bf` 没有改动。`minmax(0, 1fr)` 和 `word-break: break-word` 仍在。 |
| 11 | 不新增语义图标；滑动图标仍由调用方传入 | 过 | `git diff $BASE -- packages/core/src/Icon` 仍为空。本轮没有碰图标。 |
| 12 | 没有 `!important`；`overflow-list.css` 没有 `not-allowed` | 过 | 样式相对 `cbd598bf` 没有改动。上一轮 `check-no-important` 退出码 0。本轮不重跑。 |
| 13 | 台账 54 条都有结论；抽查已采纳；不适用理由站得住 | 过 | 重新数过：`- [x]` 54 条，已采纳 32，不适用 22，空结论 0。`c3f64eff9` 和 `17b2fcfed` 见第 24、25 项。 |
| 14 | 本轮行为都有 Vue 测试，两种 `NODE_ENV` 都通过 | 过 | 测试文件相对 `cbd598bf` 没有改动。上一轮两种环境都是 7 个文件、78 条。本轮没有新行为。 |
| 15 | 中英文文档和现有行为一致；中文示例能操作 | 过 | 中英文文档相对 `cbd598bf` 没有改动。树属性页仍写 `rel="noopener noreferrer"` 和「树没有根上的选中值」。 |
| 16 | 五个组件都不在 SSR 已知失败名单 | 过 | 同第 9 项。 |
| 17 | 五种页面、四种组合的文档站整页图，并且亲眼看过 | 过 | 第 2 轮 20 张都看过，来源是文档站整页。本轮没有视觉改动，不重拍。无对位。 |
| 18 | 新写和改到的源码不超过 500 行，没有改行数白名单 | 过 | 本轮没有改源码。`git diff $BASE -- scripts/guardrails/line-limit-allowlist.json` 为空。上一轮行数检查通过。 |
| 19 | 相关 vitest 在两种 `NODE_ENV` 下通过，用例数相同 | 过 | 测试和被测源码相对 `cbd598bf` 没有改动。上一轮 `env -u NODE_ENV` 与 `NODE_ENV=production` 都是 78 条。本轮不重跑。 |
| 20 | typecheck、eslint、行数、`!important`、`sync-exports --check` | 过 | 被检查的源码和导出相对 `cbd598bf` 没有改动。上一轮这些命令都是退出码 0。本轮不重跑。 |
| 21 | 改动范围；看板和白名单没动；catalog 的 generate:check 通过 | 过 | `pnpm --filter @astryx-vue/cli generate:check` 退出码 0，输出 `catalog is up to date (245 components, 31 topics, 53 templates)`，见 `/tmp/verify-C12/generate-check-r3.txt`。相对 `cbd598bf` 只改了 `catalog.json`，+34/−6，内容是大纲解析、元数据换行和透传、`overflowChange`、树的 `className`/`style` 和行名。`ROADMAP.md`、`SWARM.md`、`HANDOFF.md`、`PR128-BODY.md`、行数白名单不在 diff 里。 |
| 22 | 新增注释不是在讲修改历史 | 过 | `git diff cbd598bf` 的新增行按指定正则没有命中。catalog 里没有这类修改历史。 |
| 23 | 树行 `target="_blank"` 带 `noopener` 和 `noreferrer`；同页不带 `rel` | 过 | `TreeListItem.vue` 第 41–42 行仍是 `target === '_blank'` 时 `noopener noreferrer`，否则 `undefined`。`TreeList.test.ts` 第 183 行和第 192 行两条还在。文件相对 `cbd598bf` 没有改动。 |
| 24 | 台账 `17b2fcfed` 是不适用；选择是条目 `isSelected`；文档不说根上 `v-model` | 过 | 台账第 334 行仍是不适用，理由写明上游选择是条目 `isSelected`，树没有根上的选中值，不另造 `v-model`。`TreeList` 目录没有 `modelValue`、`defineModel`、`v-model`。`aria-selected` 仍绑定 `item.isSelected`。中文属性页第 64 行仍是这句。 |
| 25 | `c3f64eff9` 仍是已采纳，和现在的 `rel` 一致；54 条全勾，32/22 | 过 | 台账第 54 行结论仍是树行 `target="_blank"` 补 `noopener noreferrer`，和 `linkRel` 一致。计数同第 13 项。 |
| 26 | vitest 两种环境、typecheck、eslint、行数、`!important`、导出 | 过 | 这些输入相对 `cbd598bf` 没有改动。上一轮全部通过，用例数 78 对 78。本轮不重跑。catalog 不参与这些检查。 |
| 27 | diff 不含看板和白名单；catalog 是规定的那一次重生；新增行不是修改历史 | 过 | `git diff $BASE --stat` 现在包含 `catalog.json`，这是第 2 轮要求提交的那一次生成，+34/−6，`generate:check` 已通过。`ROADMAP.md`、`HANDOFF.md`、`PR128-BODY.md`、行数白名单仍不在 diff 里。`git diff cbd598bf` 的新增行没有修改历史用词。 |

## 看图

本轮不重拍。相对上一轮，样式、Demo 和文档都没有改。第 2 轮看过的 20 张仍是文档站整页，桌面有侧栏，390 宽有「菜单」。无对位。

## 对实现者偏离计划的判断

无。这一轮只按第 2 轮的修改要求重生了 `catalog.json`，没有改组件。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

无。
