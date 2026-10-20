# E2 实现回报 · 第 1 轮

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E2`，分支 `sync/e2-split-docs`
- 提交：`387d8dc refactor: 按职责拆分文档站 6 个大文件，模板页和生成的清单不计入行数`（没有推送）
- 结论：11 个文件都已经从 500 行白名单里删掉。6 个文件按职责拆开，5 个模板页和 `templateManifest.ts` 改为不计入行数。32 张截图改前改后逐像素比较，差异都是 0。

## 1. 模板页和 templateManifest.ts 的处理

### 模板页（5 个 `playground/pages/*.vue`）：按计划首选方案，加排除规则，没有拆

理由：
- 演练场、CLI 的 `astryx-vue template <slug>` 和 `check:templates` 三处都把 `pages/<slug>.vue` 当成一个能直接用的单文件。拆成多个文件，复制给用户的就只有主文件，会缺东西。
- 上游 v0.7.1 的同名模板也都是单个 `page.tsx`，而且比我们的更长：ai-chat 763 行、settings-dialog 2603 行、settings-sidebar 834 行、kanban-board 753 行、detail-page 626 行。最长的 table-filter 有 4630 行。这说明上游也把模板当作一整页的示例。
- 排除规则是 `^apps/docs/components/playground/pages/[^/]+\.vue$`，覆盖整个目录。以后新加的模板页超过 500 行也不会被拦。我认为这是对的，因为这个目录里的文件都是示例资产。

我不建议拆成多文件模板，所以没有写多文件方案。

### templateManifest.ts：确认是生成物，加排除规则

验证方法：
1. 从 `astryx-upstream` 导出 v0.7.1 的 `packages/cli/assets/templates/pages`，放到 `/tmp/e2-up`。
2. 运行 `ASTRYX_UPSTREAM=/tmp/e2-up/packages/cli/assets/templates/pages node apps/docs/scripts/generate-template-manifest.mjs`。
3. 生成结果和仓库里的版本只差引号风格：脚本用 `JSON.stringify`，输出双引号。
4. 再跑一次 `eslint --fix`，`git diff` 为空，和仓库版本逐字节一致。
5. 最后还原了文件。

所以它就是生成物，只是生成以后还要用 eslint 修一下格式。排除理由写的是「由 apps/docs/scripts/generate-template-manifest.mjs 生成。」

## 2. 其余 6 个文件的拆法

原文件的路径、对外导出的名字和用法都没变，别处的 import 一处都没改。

### `playground/theme.ts`（591 行，拆成 7 个文件）

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `theme.ts` | 39 | 统一入口。重新导出下面各个文件对外公开的全部内容（类型和函数），清单和原来一样。 |
| `themeTypes.ts` | 64 | 数据形状：`ThemeState`、`ThemeColors`、各种选项的接口。 |
| `themeOptions.ts` | 64 | 固定选项：颜色字段和对应的 CSS 变量、字号比例、密度预设、字体。 |
| `themeState.ts` | 159 | 主题状态的生命周期：从 base.css 建默认主题、整体替换、比较、套用和识别密度预设、清洗分享链接里的数据。 |
| `themeColor.ts` | 109 | 颜色的读写和换算：十六进制规范化、读数格式、取色器合并、对比色。 |
| `themeScale.ts` | 155 | 字号、间距、控件高度、圆角、时长这几条阶梯：展开成 CSS 变量，生成说明文字。 |
| `themeExport.ts` | 110 | 输出：完整的 CSS 变量表、预览样式、导出的 CSS 和 JSON、Google Fonts 地址。 |

顺手合并了一处重复：圆角三档和控件高度三档的算法，原来在 `themeVariables` 和 `describeRadius`/`describeElementSize` 里各写了一遍。现在合并成 `themeScale.ts` 里的 `radiusScale()` 和 `elementSizes()`，算出来的数完全一样。`themeVariables` 输出的变量顺序也没变，导出的 CSS 和 JSON 前后逐字节相同，见第 4 节。

### `theme-tokens/TokenReference.vue`（553 行，拆成 3 个文件）

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `TokenReference.vue` | 333 | 只负责渲染。其中 script 约 40 行，其余是模板和 scoped 样式。 |
| `tokenReferenceCopy.ts` | 166 | 中英文文案：分区标题和说明、颜色分组名、单个 token 的备注。 |
| `tokenReferenceModel.ts` | 88 | 纯函数：按分区整理 token、给颜色分组、把颜色解析成浅色和深色两个值，以及动画示例的列表。 |

### `home/HomeStage.vue`（600 行，拆成 3 个文件）

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `HomeStage.vue` | 293 | 首页主舞台：logo、标题、按钮、安装命令和复制按钮、三条特性。全局 `<style>` 里给 VitePress 外壳换底色的规则留在这里。 |
| `HomeStageChat.vue` | 251 | 右侧自动播放的聊天演示。shiki 高亮颜色的全局样式和 `.home-chat*`、`.home-composer` 的 scoped 样式都跟着它走。 |
| `homeStageCopy.ts` | 87 | 中英文文案和聊天脚本。 |

样式处理：
- 原来 `.home-actions, .home-composer` 共用一段 flex 样式，现在拆到两个组件里各写一份，数值不变。
- `.home-chat` 在 960px 断点两侧的高度、减少动态效果时关掉动画的规则，都搬进了 `HomeStageChat.vue`。
- scoped 样式换了组件以后，作用范围是一样的：`.home-chat` 是 `ChatLayout` 的根元素，`.home-chat-code` 和 `.home-composer` 都是 HomeStageChat 自己模板里的元素。

### `playground/PlaygroundApp.vue`（545 行，拆成 5 个文件）

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `PlaygroundApp.vue` | 311 | 演练场外壳：左侧导航栏、编辑栏、预览栏、工具栏，以及复制、下载、格式化这几个动作。 |
| `usePreviewSync.ts` | 137 | 预览 iframe 的同步。代码、主题、重载一变，去抖以后发 `render` 或 `theme` 消息。它也接收 iframe 回报的就绪和报错，并定时把状态写回地址栏。 |
| `usePaneResize.ts` | 57 | 分隔条：拖动或按左右方向键调整编辑栏的宽度。 |
| `PlaygroundDialog.vue` | 114 | 共用的原生 `<dialog>`：确认框、分享、导出。`ask()` 返回用户选了继续还是取消，`openExport()` 打开导出框。 |
| `PlaygroundTemplateMenu.vue` | 78 | 「模板」下拉菜单。点菜单外面或按 Esc 会关闭。 |

演练场的样式全部在全局的 `styles/playground.css` 里，这两个 Vue 文件原来都没有 scoped 样式。所以拆成子组件以后，DOM 结构和类名完全一样，样式不受影响。

### `playground/PlaygroundThemeEditor.vue`（522 行，拆成 3 个文件）

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `PlaygroundThemeEditor.vue` | 243 | 编辑面板：标签页、颜色、密度预设、字体和字号比例，最后接上两组阶梯。 |
| `themeEditorModel.ts` | 215 | 面板的数据和纯函数：字体和比例的显示名、五条阶梯的档位和范围、数字框的显示和解析、预设小图标的形状。 |
| `PlaygroundThemeScale.vue` | 55 | 一条阶梯控件：标题和提示、四个档位按钮、数字输入框。原来这段模板在面板里复制了两份，现在合成一个组件。 |

## 3. 截图对比

脚本：`/tmp/e2-shots/shoot.mjs`，比较脚本：`/tmp/e2-shots/diff.mjs`。都没有提交。

截图条件：
- 视口 1440×900，浅色和深色各一套。
- 打开 `reducedMotion: 'reduce'`。这样首页聊天会直接停在播放完的完整状态，截图是稳定的。
- 截整页。

| 截图清单（浅色、深色各一张） | 像素差异 |
| --- | --- |
| 首页 `/`、`/en/` | 0 |
| 演练场 `/playground/` 默认页 | 0 |
| 演练场的 5 个模板：ai-chat、settings-dialog、kanban-board、detail-page、settings-sidebar（用 `?template=` 打开） | 0 |
| 主题编辑面板展开：`/playground/`、`/en/playground/` | 0 |
| 含 `TokenReference` 的主题页：`/themes/color`、`/themes/motion`、`/themes/scale`、`/themes/typography`、`/en/themes/color`、`/en/themes/typography` | 0 |

- 一共 32 张，像素差异全部是 0。pixelmatch 的 threshold 设成 0，也就是最严格的比法。
- 结果：`/tmp/e2-shots/diff-report.txt`
- 改前截图：`/tmp/e2-shots/before/`
- 改后截图：`/tmp/e2-shots/after/`

## 4. 交互抽查和各项检查

### 交互抽查

第一组由截图脚本里的交互部分完成。改前改后的结果 `interactions.json` 逐字节相同：
- 首页「复制安装命令」：按钮名从「复制安装命令」变成「已复制安装命令」，剪贴板里是 `pnpm add @astryx-vue/core @astryx-vue/themes`。
- 切换模板：选「看板」时弹出确认框，确认以后预览里出现 Sprint Board。
- 主题编辑器把 Accent 改成 `#ff0000`：预览 iframe 里的 `--astryx-color-accent` 从 `light-dark(#262626, #ebebeb)` 变成 `light-dark(#262626, #ff0000)`。
- 导出：下载的 `export.css` 和 `export.json` 改前改后逐字节相同。

第二组用 `/tmp/e2-shots/interact2.mjs`，改前（临时检出 HEAD~1）和改后各跑一次，结果完全一样：
- 模板菜单按 Esc 会关闭，点菜单外面也会关闭。
- 换模板时选「取消」，对话框关闭，模板不变。
- 分隔条按右方向键，编辑栏变宽 24px。
- 点密度预设以后按钮是按下状态，字号变成 12。之后手动改字号，预设的按下状态会取消。圆角显示 2。

### 命令检查

| 检查 | 结果 |
| --- | --- |
| `env -u NODE_ENV pnpm vitest run --maxWorkers=2` | 改前 2469 通过，改后 2469 通过，219 个测试文件 |
| `env -u NODE_ENV NODE_ENV=production pnpm vitest run --maxWorkers=2` | 2469 通过 |
| `env -u NODE_ENV pnpm check:templates` | 通过：48 个模板落地后 vue-tsc 通过，另有 5 个 isReady=false 的模板按规则跳过 |
| `env -u NODE_ENV pnpm --filter @astryx-vue/cli generate:check` | catalog is up to date（53 个模板） |
| 完整 check：`check:packages && lint && typecheck && vitest --maxWorkers=2 && build && lint:pkg` | 退出码 0 |
| `node scripts/check-line-limit.mjs` | 通过 |

## 5. 白名单和排除规则的变化

`scripts/guardrails/line-limit.config.mjs` 加了两条排除规则：
- `^apps/docs/components/playground/templateManifest\.ts$`，理由：由 generate-template-manifest.mjs 生成。
- `^apps/docs/components/playground/pages/[^/]+\.vue$`，理由：模板页是给用户的整页示例代码，会被原样复制，必须是单文件。上游同名模板也是单个 page.tsx。

`scripts/guardrails/line-limit-allowlist.json` 删掉了 11 条 `apps/docs/...`，用 `--update` 生成。剩下的 11 条都在 `packages/` 下，这次没有动。

## 6. 发现了但没修的问题

1. `PlaygroundApp.vue` 给 `PlaygroundThemeEditor` 传了 `@reset-theme="resetTheme"`，但编辑面板没有声明也不会触发这个事件，面板上也没有重置按钮。这个监听器会作为普通属性落到根 `div` 上，不报错，但「重置主题」这个功能从界面上点不到。保持原样。
2. 对话框里的 `share` 分支没有任何代码会打开它，只有 `export` 分支在用，实际是一段用不到的代码。为了不改行为，搬进 `PlaygroundDialog.vue` 时原样保留。
3. 主题编辑面板的「Components」「Advanced」两个标签页没有内容，点了以后面板是空的。这是原有表现。
4. `generate-template-manifest.mjs` 有两个问题：
   - 默认读 `/tmp/astryx-original/...`，这个路径现在不存在，必须手动设 `ASTRYX_UPSTREAM`。
   - 生成的结果是双引号，要再跑一次 `eslint --fix` 才和仓库一致。

   可以考虑以后让脚本输出单引号，或者在 package.json 里加一个 generate 命令。
5. `HomeStage.vue` 里 `useClipboard({ announce: text.value.copied })` 只在组件创建时读一次文案。现在每个页面的语言是固定的，所以没有问题。
