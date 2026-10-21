# B4-fix 验收报告 · 第 2 轮返工

结论：通过（12/12）

- 工作区：`/workspace`，分支 `sync/b4-fix-layer-escape`。
- 受检代码：`0941c28`（`fix(layer): 嵌套浮层按深度决定 Escape 先关谁`）。实现回报 `446d780` 只作对照，不计入受检代码。本报告是之后另交的一笔。
- 比较基点：`BASE = 4a5b9a4227675ee7ca1f56caa17788d5e30adead`（`git merge-base HEAD origin/swarm-tree`）。本轮先 `git fetch origin swarm-tree`。
- 临时文件：`/tmp/verify-B4-fix/`。临时用例写在 `packages/core/src/layer/escapeOrder.repro.tmp.test.ts`，跑完即删，没有入库。
- 只读检查：开始时 `git status` 是 `On branch sync/b4-fix-layer-escape` / `nothing to commit, working tree clean`。删掉临时用例之后、写本报告之前再查，结果相同。`pnpm install --frozen-lockfile` 没有改锁文件。
- 浏览器：没有开。这条是行为节点，不要求文档站截图。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | Popover 打开后，聚焦里面带 Tooltip 的按钮，Escape 只关 Tooltip，Popover 仍开。同一个 Tooltip 关掉再聚焦打开，第二次 Escape 仍然只关 Tooltip | 过 | 临时用例两种环境都是 1 个文件、2 条，退出码 0。命令：`timeout 120 env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/layer/escapeOrder.repro.tmp.test.ts`，以及 `env NODE_ENV=production` 再跑同一条。用例先点 Popover 触发器（`hasAutoFocus: false`），再 `focus()` 内容里的按钮。happy-dom 里这个按钮 `matches(':focus-visible')` 为真，所以走的是 Tooltip 的 `focusin`。气泡显示且 `popoverSurface.contains(bubble)` 为假。第一次 Escape 后气泡隐藏、Popover 仍显示、`defaultPrevented` 为真。`blur()` 再 `focus()` 后气泡重新出现，第二次 Escape 仍只关气泡。 |
| 2 | HoverCard 走同一顺序：聚焦打开、Escape 只关卡片、关掉再聚焦打开仍然只关卡片 | 过 | 同一临时文件的第二条。卡片用 `.astryx-hover-card`，同样断言不在 Popover 的 DOM 里，两次 Escape 都只关卡片。 |
| 3 | PR 自带的新测试盖住「外层先开、内层后出现、一次 Escape 只关内层」，以及旧排位号不能把外层判赢 | 过 | `escapeOrder.test.ts` 的「popover 打开后再开里面的 Tooltip」和 HoverCard 那条：Tooltip / HoverCard 在 Popover 还关着时就已经挂上，随后才打开 Popover，再把提示打开。断言气泡不在 `.astryx-popover` 里面，一次 Escape 只关提示。打开方式是受控 `isOpen`，没有调用 `focus()`，也没有关掉再开第二次。排位号按 token 只发一次，组件关掉时不摘登记，再打开只是 `isPresent` 变真，号和深度都不变，所以这第一条已经是「更早的号 + 后开的 Popover」。`dismissStack.test.ts`「同一层再登记仍用旧排位，更深的深度仍然压过后开的外层」把同一 token 再 `pushLayer` 一次，深度仍然压过外层。临时用例补了聚焦和第二次打开，已删。 |
| 4 | 嵌套深度用 provide/inject 往下传，Teleport 不切断 | 过 | `layerDepth.ts`：`useLayerDepth` 是 `inject(layerDepthKey, 0)`，`provideLayerDepth` 提供当前值加 1。`LayerContentBoundary.vue` 在 `resetLayerScopedContext()` 之后调用 `provideLayerDepth()`，触发器不在这层里面。Popover、Tooltip、HoverCard 的气泡都在 `Teleport` 里，但深度是在组件 setup 里读的，跟的是组件树。若深度没传进去，Tooltip 排位更早、气泡又不在 Popover DOM 里，Escape 会关掉 Popover；第 1 条和第 3 条的组件测试都没有出现这个结果。 |
| 5 | `compareEntries` 先比深度，再比包含，最后比排位号 | 过 | `dismissStack.ts` 第 101–112 行：深度不等就返回深度差；深度相同才看 `contains`；都不包含才返回 `seq` 差。`seqFor` 对同一个 token 只发一次号。栈测试「更深的层在上面，哪怕它登记得更早，容器也不互相包含」和「包里层的那一层算在上面，哪怕它登记得更早」都在下面第 11 条的 516 条里。 |
| 6 | Tooltip 与 HoverCard 共用 `layer/useHoverLayerDismiss`，写法一致 | 过 | `useTooltip.ts` 第 227–238 行、`useHoverCard.ts` 第 379–383 行都调用 `useHoverLayerDismiss`，传入 `isPresent`、`getContainer`、`onDismiss`。登记项都是整段生命周期留在栈里、`dismissOnEscape: 'close'`、`dismissOnPointerOutside: false`，深度在 setup 时读一次。`HoverCard/escapeDismiss.ts` 已删除。Tooltip 源码没有 `document` 上的 `keydown`。HoverCard 仍有 `onModalityKeyDown`，只把最近输入记成键盘，不看 Escape，也不关闭；触摸 `pointerdown` 还在。 |
| 7 | 上一轮不回退：Escape 只有 `'close' \| 'block' \| 'ignore'`，只打最上面那一层 | 过 | `rg "enableEscape" packages/core/src` 无命中。`dismissOnEscape: true/false` 无命中。`handleKeyDown` 只取 `topPresentEntry()`：`'ignore'` 直接返回且不 `preventDefault`，`'block'` 先 `preventDefault` 再返回，`'close'` 才关这一层。`dismissStack.test.ts` 里「最上层是 block」「最上层是 ignore」「跳过不在屏幕上的层」仍在，并随第 11 条通过。Popover 假值仍是 `'block'`；TimeField、PowerSearch、ChatTriggerMenu、`useAnchoredListbox` 仍是 `'ignore'`；Selector、ContextMenuSubMenu 仍是 `'close'`。 |
| 8 | 上一轮不回退：成员 context 由组件自行登记，`scopedProvide.ts` 不引用组件，扫描测试还在 | 过 | `scopedProvide.ts` 只 import `vue` 和 `styles/layer.css`。`scopedProvide.membership.test.ts` 仍要求登记数至少 23，并断言该文件不 `from` 大写组件目录、不 `from` `context`。这个文件在 `packages/core/src/layer/`，包含在第 11 条里。本轮 diff（`0d02d5f..0941c28`）没有改 `scopedProvide.ts`。 |
| 9 | 上一轮不回退：宽度变量按持有者管理 | 过 | `inlineSize.ts` 仍用 `holders` 栈：`retainLayerMaxInlineSize` 压入，`releaseLayerMaxInlineSize` 摘掉后把当前栈顶写回，空了才 `removeProperty`。`LayerProvider.vue` 只有非嵌套根调用 `retainLayerMaxInlineSize`。`inlineSize.test.ts` 与 `LayerProvider.test.ts` 都在第 11 条的 40 个文件里。本轮 diff 没有改这两个实现文件。 |
| 10 | PR 描述写明 catalog 已修，CI 仍有 C9 留下的 Markdown 导出问题，本 PR 不修 | 过 | PR #142 正文写了：catalog 已经修好；Check and dry-run 仍会失败，因为 `packages/core` 的 `./Markdown/parser`、`./Markdown/plugins`、`./Markdown/plugin-renderer` 指向还没生成的 dist；这是 C9 #138 留下的；交给总控和 C9，本 PR 不修 Markdown 导出。`package.json` 里这三处 `import` 都指向 `./dist/Markdown/...`。工作区里 `packages/core/dist/Markdown/parser/index.js`、`plugins`、`plugin-renderer/index.js` 都不存在。本轮没有改 ROADMAP。 |
| 11 | 相关 vitest 在两种 `NODE_ENV` 下通过 | 过 | 路径：`layer/`、`composables/useDismiss.test.ts`、`composables/useLayer.test.ts`、Tooltip、HoverCard、Popover、DropdownMenu、ContextMenu、Dialog、Selector、PowerSearch、TimeInput、Chat、TabList、NavMenu、Typeahead、LayerProvider。`timeout 240 env -u NODE_ENV pnpm vitest run --maxWorkers=2` 与 `NODE_ENV=production` 各一遍：都是 40 个文件、516 条，退出码 0。`vitest.config.ts` 加载时会把 `NODE_ENV` 写成 `test`，所以两次实际是同一种模式；命令仍按要求各跑了一遍，数量相同。没有跑 `Button.a11y.test.ts`。本次 `pnpm install` 装上了 `dom-accessibility-api@0.7.1`。若别处因为缺这个包失败，与本 PR 无关。 |
| 12 | 行数检查与 `generate:check` 通过 | 过 | `timeout 60 node scripts/check-line-limit.mjs` 退出码 0：「源码单文件行数检查通过（上限 500 行）」。`useHoverCard.ts` 是 591 行，白名单也是 591。`timeout 120 pnpm --filter @astryx-vue/cli generate:check` 退出码 0：`catalog is up to date (245 components, 31 topics, 53 templates)`。 |

## 看图

无。本轮不要求文档站截图，没有打开文档站，也没有截图。

## 对实现的判断

排位号仍然按身份只发一次。同一个 Tooltip 关掉再打开不会换成新号，比较时深度在前，所以旧号不会让外面的 Popover 先关。这和评审里说的「只改成打开时才进栈不够，因为再开仍用旧排位号」是同一件事：号可以留着，深度必须压过它。

自带组件测试没有 `focus()`，也没有第二次 Escape。决定对错的顺序（提示先登记、Popover 后打开、气泡不在 Popover DOM 里）已经写在 `escapeOrder.test.ts` 里。聚焦和第二次打开由临时用例补过，结果与自带测试一致。

## 不通过的项要怎么改

无。
