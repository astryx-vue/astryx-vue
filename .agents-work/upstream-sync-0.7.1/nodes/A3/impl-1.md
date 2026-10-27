# A3 工程护栏 · 第 1 轮实现回报

分支 `sync/a3-guardrails`，提交 `ac24abe`（只在本地，没有推送）。

## 1. 做了什么

新增：

| 文件 | 用途 |
| --- | --- |
| `scripts/check-line-limit.mjs` | 500 行检查。取文件列表（`listCandidateFiles`、`selectSourceFiles`）和判定（`evaluateLineLimit`）是分开的函数。支持 `--update`。 |
| `scripts/guardrails/line-limit.config.mjs` | 上限、扩展名、白名单路径、排除规则。每条排除规则都带 `reason`。 |
| `scripts/guardrails/line-limit-allowlist.json` | 白名单，26 条。 |
| `tests/check-line-limit.test.ts` | 13 条用例，用临时目录和假的文件列表。 |
| `packages/core/src/ssr-smoke.test.ts` | SSR 冒烟测试。 |
| `packages/core/src/ssr-smoke.fixtures.ts` | 最小可渲染参数表（props、插槽、`wrap` 父组件、`allowEmpty`）。 |
| `packages/core/src/ssr-known-failures.json` | 已知失败名单，现在是 `{}`。 |
| `packages/core/src/Resizable/ResizeHandle.test.ts` | Resizable 测试，37 条用例。 |

修改：根目录 `package.json`。`check:packages` 末尾加了 `&& node ./scripts/check-line-limit.mjs`。

组件源码没有改动，也没有新增类型导出。

## 2. 500 行检查

### 统计范围

`git ls-files --cached --others --exclude-standard` 列出的文件，扩展名是 `.ts .tsx .mts .js .mjs .cjs .vue`。行数口径和 `wc -l` 相同，也就是数换行符。

**和计划不同的地方**：计划只统计「git 跟踪的文件」。我把还没提交、但也没被 `.gitignore` 忽略的新文件一起算进去。这样新文件在提交之前就会被拦住，自测第 2 项「新建一个 501 行的文件」也能直接测出来。被 `.gitignore` 忽略的文件（`dist/`、`node_modules/` 等）仍然不统计。

### 排除规则（`line-limit.config.mjs`）

| 规则 | 理由 |
| --- | --- |
| `*.test.*`、`*.spec.*` | 测试文件 |
| `tests/` 目录 | 测试目录 |
| `packages/core/src/index.ts` | 由 `pnpm sync` 生成（`sync-exports.mjs` 的 `generatedFiles`） |
| `packages/core/src/composables/index.ts` | 同上 |
| `packages/core/src/locale/messages.ts` | 同上 |
| `packages/cli/src/generated/**` | 由 cli 的 `generate` 生成 |
| `dist/` | 构建产物 |
| `apps/docs/public/**` | 原样发布的静态资源 |

我核对过 `sync-exports.mjs` 的 `generatedFiles()`，它实际写出的文件有这些：上面 3 个 `.ts`、`packages/core/styles.css`、`packages/themes/*.css`，以及 `packages/core/package.json`（只改 `exports`）。CSS 和 JSON 本来就不统计。`.agents-work/README.md` 里还列了 `componentCatalog.ts` 和 `demos/registry.ts`，但 `pnpm sync` 并不写这两个文件，它们是手写的，靠 `import.meta.glob` 读 meta。所以我没有排除它们（两个文件分别是 62 行和 15 行）。

eslint `ignores` 里的条目，我逐条判断过：

- `apps/docs/components/playground/pages/**`：**不排除**。它们最早是脚本移植过来的，但之后提交 #41、#51、#71、#97、#111、#123 都手改过，现在是手写维护的源码。其中 4 个超标的进了白名单。
- `playgroundCharts.ts`（454 行）、`build-dashboard-cohort-funnel.mjs`（418 行）：**不排除**。都是手写文件，也没超标。
- `port-playground-page.py`：不是统计范围内的扩展名。
- `.agents-work/**`、`packages/core/locales/**`：里面没有 git 跟踪的源码文件，或者只有 JSON。

### 白名单（26 条，按路径排序）

```json
{
  "apps/docs/components/home/HomeStage.vue": 600,
  "apps/docs/components/playground/PlaygroundApp.vue": 545,
  "apps/docs/components/playground/PlaygroundThemeEditor.vue": 522,
  "apps/docs/components/playground/pages/ai-chat.vue": 842,
  "apps/docs/components/playground/pages/detail-page.vue": 532,
  "apps/docs/components/playground/pages/kanban-board.vue": 584,
  "apps/docs/components/playground/pages/settings-dialog.vue": 789,
  "apps/docs/components/playground/pages/settings-sidebar.vue": 585,
  "apps/docs/components/playground/templateManifest.ts": 509,
  "apps/docs/components/playground/theme.ts": 591,
  "apps/docs/components/theme-tokens/TokenReference.vue": 553,
  "apps/docs/scripts/llms-txt.ts": 567,
  "packages/cli/src/cli.ts": 623,
  "packages/cli/src/generate/markdown.ts": 608,
  "packages/cli/src/generate/template-meta.ts": 553,
  "packages/core/src/BottomSheet/useSheetGestures.ts": 620,
  "packages/core/src/Chat/types.ts": 565,
  "packages/core/src/DropdownMenu/DropdownMenu.vue": 517,
  "packages/core/src/DropdownMenu/types.ts": 532,
  "packages/core/src/HoverCard/useHoverCard.ts": 592,
  "packages/core/src/Markdown/render.ts": 599,
  "packages/core/src/MultiSelector/MultiSelector.vue": 763,
  "packages/core/src/PowerSearch/PowerSearch.vue": 707,
  "packages/core/src/Selector/Selector.vue": 584,
  "packages/core/src/Table/TableData.vue": 598,
  "scripts/sync-exports.mjs": 673
}
```

### 判定规则

- 文件不在白名单里，又超过 500 行：报错。
- 白名单里的文件变大了：报错。
- 白名单里的文件变小了，但还超过 500 行：只给提示，建议运行 `--update`。
- 白名单里的文件降到 500 行以内：报错，提示删掉这一条。
- 白名单里的文件不存在了，或者已经被排除规则排除：报错，提示删掉这一条。
- `--update` 只做两件事：把变小的数字改小，删掉过期的条目。它不会新增条目，也不会把数字改大。这一点有测试覆盖。

## 3. SSR 冒烟测试

### 统计

- 总入口导出的组件：**203 个名字，对应 197 个不重复的组件**。有 6 个名字是别名，比如 `ContextMenuRadioItem` 和 `BreadcrumbMenuRadioItem` 其实都是 `DropdownMenuRadioItem`。每个名字各跑一条用例。
- 通过：**203 / 203**。
- 已知失败名单：**0 条**，文件内容是 `{}`。
- 另外有 3 条名单和参数表的自检，以及 6 条检查本身的自检。自检用 5 个故意出错的探针组件，分别是：读 `window`、读 `document`、读 `navigator`、触发 Vue 警告、输出为空，确认每一个都会被判失败。还有一条确认渲染结束后 `navigator` 会被放回去。

### 第一次全量跑的结果，以及为什么名单是空的

第一次用空 props 跑全部组件时，有 23 个抛错，76 个有 Vue 警告，6 个输出为空。我逐个查过，原因都在参数表上，组件本身没有问题：

- 缺必填 prop。比如 `Kbd` 缺 `keys`，`TreeList` 缺 `items`，`CodeBlock` 缺 `code`。`Theme`、`SyntaxTheme` 缺 `theme`。几个 Typeahead/Tokenizer 类组件缺 `searchSource`。
- 缺父组件。`DropdownMenuRadioItem` 要放在 `RadioGroup` 里，`Tab`、`TabMenu` 要放在 `TabList` 里，`Step` 要放在 `Stepper` 里。
- 缺插槽或内容。`LayerProvider`、`ScrollbarsProvider`、`CollapsibleGroup` 只渲染插槽；`ChatMessageMetadata` 没有内容时 `v-if` 掉；`SideNavCollapseButton` 不在 SideNav 里、也没开 `isCollapsed` 时会隐藏。
- `ToastViewport` 的内容通过 Teleport 渲染。现在 Teleport 输出也算作组件输出。

把这些补进参数表之后，全部通过，所以名单里没有组件需要记。`allowEmpty` 字段还保留着，但目前没有组件用到它。

### 检查怎么判失败

以下任何一条出现，都算失败：

- `renderToString` 抛错。
- `app.config.errorHandler` 收到错误。
- `app.config.warnHandler` 收到警告。
- 渲染期间有 `console.warn` 或 `console.error`。
- 去掉注释后输出为空，而且参数表里没写 `allowEmpty`。

渲染结束后会多等一轮宏任务，这样 setup 里起的异步错误也能收集到。

**和计划不同的地方**：计划说 node 环境里没有 `window`、`document`、`navigator`，碰到就会抛 ReferenceError。但本机是 Node 26，它自带全局的 `navigator` 和 `sessionStorage`，`localStorage` 也有访问器。所以渲染期间我会临时删掉这 3 个全局，渲染完再恢复。这样组件在服务端读 `navigator` 时也会被抓到。

### 名单机制自测

- 把 `Badge` 写进名单，测试报 `Expect test to fail`，说明组件修好后会提醒删掉。
- 把不存在的 `NotAComponent` 写进名单，测试报「已经不是公开组件，请删掉」。

## 4. Resizable 测试

`ResizeHandle.test.ts` 共 37 条用例，每条结束后都断言 `console.warn` 没有被调用。覆盖范围：

- **结构和读屏属性**：`role="separator"`、`aria-orientation`（horizontal 对应 vertical）、`aria-valuenow`、`aria-valuemin`、`aria-valuemax`、`aria-label`（包括默认文案 `Resize handle`）、`tabindex`。还有：没有区域时不输出 value 属性；没有上限时不输出 `aria-valuemax`；折叠时 `aria-valuenow` 不低于最小值，并输出 `aria-valuetext="Collapsed"`。`data-direction`、`data-position`、`data-divider`、`data-disabled`、`data-active`（聚焦时）、`data-resizing`、握把的 `data-hidden`、默认插槽替换握把、握把位置（center、auto、折叠后翻到另一侧）、attrs 透传都有测试。
- **键盘**：ArrowRight/Down 加 10，ArrowLeft/Up 减 10，Shift 时步长 50，Home 到最小值，End 到最大值。这些用真实的 `useResizable` 测，断言 `aria-valuenow` 的变化。另外还测了：`isReversed` 时方向反过来；每次按键都按开始、移动、结束的顺序调用；没有上限时 End 不动；可折叠区域按 Enter 折叠或展开；不可折叠时 Enter 不动；双击切换折叠。
- **指针拖动**：按下时调用 `setPointerCapture`，移动时在下一帧调用 `_onResizeMove`，抬起时调用 `_onResizeEnd`。拖动期间 body 的 cursor 和 userSelect 会改，结束后恢复。竖向手柄用 clientY 和 `row-resize`。另一个 pointerId 的移动会被忽略。`pointercancel` 和 `lostpointercapture` 会调用 cancel 而不是 end；正常结束后的 `lostpointercapture` 不会再报 cancel。`isReversed` 和 RTL 时位移取反。拖到一半卸载组件，body 样式会恢复。
- **禁用**：`tabindex=-1`、`aria-disabled`、`data-disabled`；键盘、Enter、双击、拖动都不起作用。

### 和上游 v0.7.1 比，我们还缺的行为（交给 C14，这次没有补实现）

1. **没有上限时，`aria-valuemax` 不会退回到窗口或容器的尺寸。** 上游会用窗口宽度（竖向时用高度）或容器尺寸代替；我们直接不输出这个属性。上游还有一条 SSR 加 hydration 不出错的测试，我们也没有。
2. **手柄和 hook 的方向不一致时不会警告。** 上游会 `console.warn('ResizeHandle: direction="horizontal" but its useResizable region is "vertical"...')`。
3. **重新展开折叠的面板时，不会恢复到折叠前的尺寸。** 上游按 Enter 或双击时恢复折叠前的尺寸；我们恢复到 `minSizePx`。
4. **折叠状态下按「变大」方向键，不会展开到「最小值加一步」或 collapsedSize。** 上游有这个行为，包括反向布局和 RTL 下的版本。我们只是把位移原样交给 `useResizable`。
5. **有吸附点时，方向键不会跳到相邻的吸附点**（Shift 时跳两个），也没有处理超出边界的吸附点。
6. **使用者自己绑定的 `@keydown` 不会被调用。** `forwardedAttrs` 过滤掉了 `onKeydown`，模板里也没有再调用它。我写了一次性的探针确认过：调用次数是 0。上游会同时运行使用者的 onKeyDown 和内置的键盘调整。这很可能是个 bug，没有写进测试。
7. **RTL 下抓取区的几何**：上游测试要求 6.5px 的居中偏移在 RTL 下翻转符号。我们的 `offsetStyle` 写死了 `- 6.5px`，没有测，也不确定 RTL 下是否正确。
8. 上游还有 a11y 浏览器测试（`__tests__/ResizeHandle.a11y.*`）、`shippedDirections.test.ts`、`utils.test.ts`，我们都没有对应的测试。

## 5. 自测清单

| # | 项目 | 结果 |
| --- | --- | --- |
| 1 | `node scripts/check-line-limit.mjs` 通过，白名单和实际一致 | 通过。白名单是用同一套规则生成的，`--update` 跑完没有改动。 |
| 2 | 新建 501 行的 `.ts` 会失败，删掉后通过 | 通过。报错内容是「有 501 行，超过上限 500 行……」，退出码 1。删掉后退出码 0。 |
| 3 | 给白名单里的文件加一行会失败，还原后通过 | 通过。`Selector.vue` 加到 585 行时报「比白名单记录的 584 行多了 1 行」，还原后通过。 |
| 4 | `ssr-smoke.test.ts` 通过 | 通过。203 个组件全部通过，名单 0 条。 |
| 5 | 从名单删掉一条会失败 | 名单是空的，没有条目可删。我改成反向验证：往名单里加 `Badge`，测试失败；加不存在的名字，测试也失败。 |
| 6 | `vitest run packages/core/src/Resizable` 通过，没有 Vue 警告 | 通过，37 条。 |
| 7 | 完整的 `pnpm check` | 拆成几步跑完，全部通过：`check:packages`（包括新的行数检查）、`lint`、`typecheck`、`vitest run --maxWorkers=2`（218 个文件、2440 条用例）、`build`、`lint:pkg`。为了遵守内存限制，`pnpm test` 改成了加 `--maxWorkers=2`，其它命令和 `pnpm check` 一样。 |
| 8 | 新写的源码文件都不超过 500 行 | 通过。脚本 171 行，配置 49 行，参数表 165 行。测试文件分别是 164、352、187 行。 |

## 6. 拿不准的地方

- **SSR 名单是空的**，后面的 C 节点就没有条目可以删了。这个检查能起的作用是防止退化：以后新加或修改的组件，在服务端读 `window`、`document`、`navigator`，或者有警告，都会被拦住。但 `renderToString` 不会运行 `onMounted`，也不会检查 hydration 是否一致，所以只在挂载后才访问浏览器对象的代码，这个检查查不出来。
- **参数表决定了测到哪些分支。** 比如 `Dialog`、`Lightbox`、`BottomSheet`、`AlertDialog`、`CommandPalette` 我都传了 `isOpen: true`，好让内容真的渲染出来。如果 C 节点改了组件的必填 props，需要同步改参数表。参数表里写了公开出口里不存在的名字时，测试会报错。
- **行数检查也会统计还没提交的新文件**，这一点和计划不同，理由见第 2 节。如果验收方坚持只统计已跟踪的文件，把 `listCandidateFiles` 里的 `--others --exclude-standard` 去掉就行。
- **playground 模板页没有被排除**，所以 4 个超标的模板页进了白名单。如果后面认为它们仍然算「生成物」，可以改成排除，并从白名单里删掉这 4 条。
- **`pnpm check` 没有原样跑一遍**，原因是内存限制，见自测第 7 项。
