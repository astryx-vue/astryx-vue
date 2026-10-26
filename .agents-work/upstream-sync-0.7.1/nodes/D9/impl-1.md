# D9 指南补齐 · 第 1 轮实现回报

工作区 `/Users/shenqingchuan/workspace/astryx-vue-wt/D9`，分支 `sync/d9-guides`，10 次提交，未推送。11 条全部落地，中英文各一份。

## 交付清单

| # | 原版 | 写在哪 | 状态 |
| --- | --- | --- | --- |
| 1 | principles | `guide/principles.md` 新页（zh/en） | 完 |
| 2 | working-with-ai | `guide/working-with-ai.md` 新页 | 完 |
| 3 | browser-support | `guide/browser-support.md` 新页 | 完 |
| 4 | tree/layout、layout-spacing | `guide/layout.md` 新页 | 完 |
| 5 | tree/headers-and-footers | `guide/patterns.md` 「固定页眉与页脚」 | 完 |
| 6 | tree/side-panels | `guide/patterns.md` 「侧边详情面板」 | 完 |
| 7 | tree/typography-best-practices | `themes/typography.md` 「该做与不该做」 | 完 |
| 8 | tree/i18n-rtl-and-testing | `guide/i18n.md` 「从右往左排版与伪语言测试」 | 完 |
| 9 | illustrations | `components/empty-state/index.md` 「插画与图标」 | 完 |
| 10 | tree/tailwind | `guide/styling.md` 「和 Tailwind / UnoCSS 一起用」 | 完 |
| 11 | tree/other-libraries | 并进第 10 条后半：「和 CSS Modules、手写 CSS 一起用」 | 完 |

4 个新页已加进 `apps/docs/.vitepress/sidebar.ts`，侧栏位置：设计原则在「开始」组第二项；配合 AI 写代码在「开始」组命令行之后；页面布局在「接入」组响应式布局之前；浏览器支持在「行为」组国际化之后。

提交粒度：每写完一页或一节提交一次（fe16c0c、f068306、dcb61ab、d87b6c9、5da9fd6、82d0992、bdc5180、f3eca99、c7bff75），最后一笔 826ce75 是重生成的 CLI catalog。

## 关键说法的代码依据

### 页面布局

- `Layout` 五个区域、`padding` 只作用于本层、`defaultHasDividers`、`contentWidth`、`height`：`packages/core/src/Layout/types.ts`。
- 「页眉/正文/页脚共用一条内容线」：`Layout.vue` 把 `padding` 写成 `--layout-padding-own-outer-x/y` 挂在 inner 上，`styles/layout.css:125-138` 各区域都读这两个变量，页眉和页脚只是可以各自覆盖。
- `height=fill` 时只有正文滚动：`LayoutContent` 的 `isScrollable` 默认 `true`（`Layout/types.ts`）。
- `AppShell` 插槽与 `contentPadding`/`mobileNav`：`packages/core/src/AppShell/types.ts`。
- `Stack` 的 `gap`/`padding`/`hAlign`/`vAlign`，`Grid` 的 `columns` 数字或 `{minWidth,max}`、`repeat`：`Stack/types.ts`、`Grid/types.ts`。
- 间距刻度 `2 = 0.5rem = 8px`：`themes/neutral/base.css:126` 与 `themes/scale.md`。

### 浏览器支持

先 grep `packages/core/styles`、`packages/themes` 确认用到，再写表：

- `light-dark()`：`themes/neutral/base.css` 80 处。底线由它决定。
- `@layer`：每个样式表第一行的五层声明，如 `styles/layout.css:1`。
- `:has()`、`color-mix()`、`@container`、`text-wrap: balance/pretty`、`:dir()`：`styles/*.css` 里均有实际规则（pagination.css、heading.css、text.css、slider.css 等）。
- `@property`：只有 `styles/pressable.css:24`，所以写成「缺了不崩」。
- Popover API：`Toast/ToastViewport.vue`（`popover="manual"` + `showPopover`）、`composables/internal/useMenuHover.ts`（`popovertarget`）。
- `<dialog>` + `showModal()`：`Dialog/Dialog.vue`、`BottomSheet/BottomSheet.vue`、`Lightbox/Lightbox.vue`。
- `@starting-style`：`styles/overlay.css:150`、`bottom-sheet.css`、`toast.css`。
- iOS 输入框最小字号：`styles/text-input.css:100-104`，`@media (pointer: coarse)` + `@supports (-webkit-touch-callout: none)`。
- 版本号来自 MDN / caniuse，正文注明出处并提示用 `CSS.supports` 自查。我们没有 anchor positioning（`grep anchor-name` 为空），所以没写原版那一条。

### 配合 AI

全部对着 `packages/cli/src/agents.ts`、`packages/cli/src/spec.ts` 写：

- 受管理标记两行常量、检测顺序 `AGENT_DOC_CANDIDATES`、各 `--agent` 落到哪个文件、`ERR_PATH_TRAVERSAL`：`agents.ts` + `spec.ts` 的 init 段。
- 说明块四部分（项目是什么、三步工作流、怎么查、怎么运行加约定）与 `renderEnglish`/`renderChinese` 逐段对应；「约定」来自 `readConventions()` 抽取的四段（子路径、peer 依赖、包根、不要求 UnoCSS）。
- 命令和参数：`component`、`composable`、`docs`、`search`、`template`、`build`、`manifest`、`--json/--zh/--dense/--overwrite`。
- Copilot 走 `--agent-docs-path .github/copilot-instructions.md`，这条路只有 `--agent-docs-path` 支持，命令行没有 copilot 这个 agent 值。

### 设计原则

- 颜色只写 `var(--astryx-color-*)`：`themes/css-variables.md` 与 `themes/neutral/base.css` 的 `light-dark()` 写法。
- 表单受控：`TextInput.vue:30`、`CheckboxInput.vue:22` 用 `defineModel({ required: true })`。
- 导航 `as` 或 `LinkProvider`：`LinkProvider/types.ts`、`LinkProvider/index.ts`（`useLinkComponent`），`guide/links.md` 已写 `as` 用法。
- `Badge`/`StatusDot`/`Token` 的分工：三者的组件页「使用方法」原文。
- 分层顺序与 `astryx.overrides`：`guide/styling.md` 与 `styles/*.css:1`。

### 固定页眉页脚 / 侧边面板

- `LayoutHeader`/`LayoutFooter` 有 `hasDivider`、`padding`、`paddingBlockEnd`；`Layout` 有 `defaultHasDividers`：`Layout/types.ts`。
- 页眉要放一排控件时改用 `Toolbar`：`Toolbar/types.ts` 的 `label`（必填）与 `orientation`「方向键沿哪一根轴移动焦点」。
- 面板 `width`/`hasDivider`/`isScrollable`/`resizable`：`Layout/types.ts` 的 `LayoutPanelProps`。
- `ResizeHandle` 的 `direction`、`isReversed`、`hasDivider`、`resizable`、`label`：`Resizable/types.ts`；拖拽用法与 `useResizable({defaultSize,minSize,maxSize})`：`components/resize-handle/index.md`。
- 空状态兜底：`EmptyState` 的 `isCompact`、`title`、`description`（`EmptyState/types.ts`）。

### 排版该做不该做

- `Heading` 的 `level` 决定标签和默认字号，`type` 只覆盖字号档：`Heading/types.ts`、`Heading.vue`、`styles/heading.css:40-74`。
- 「`h4` 是 14px 加粗的眉题尺寸，比 `h5` 小」：`heading.css` 里 level-4 是 `0.875rem`/`700`，level-5 是 `1.125rem`/`600`。
- `textWrap`、`maxLines`、`hasTruncateTooltip` 默认 `true`（悬停出全文）：`Heading/types.ts`、`Heading.vue` 的 defaults。
- `supporting` 是 12px + 次要色，`body` 是 14px：`styles/text.css:32-52`。
- 顺手改掉一处旧错误：原文写 `Heading` 的 `type` 有 `headline-1` 到 `headline-6`，代码里不存在（`grep -r headline packages/core` 为空），zh/en 都改成「`level` 决定默认字号，`type` 覆盖」。

### RTL 与伪语言

- `InternationalizationProvider` 的 `dir` 属性、`getLocaleDirection`（先走 `Intl.Locale#getTextInfo`，再退回内置 RTL 语言清单）、`useLocaleDirection`：`InternationalizationProvider/types.ts`、`direction.ts`、`context.ts`。
- 「provider 不改 DOM 的 dir」：`types.ts` 的注释原话。
- 逻辑属性：`styles/*.css` 里 `padding-inline-*`、`margin-inline-*`、`inset-inline-*` 共数百处；`text-align: start` 39 处。
- 单独处理的 RTL 位置：`breadcrumbs.css:36`（斜杠 `scaleX(-1)`）、`tooltip.css:102`、`hover-card.css:168`、`slider.css:43`（`:dir(rtl)`）。
- 键盘与滚动读 DOM 的 dir：`Calendar/Calendar.vue:68`、`composables/internal/scrollGeometry.ts:37`。
- 伪语言用 `overrides`：`InternationalizationProvider/types.ts` 的 `ProviderOverrides`，示例键 `@astryx.table.noData` 存在于 `locale/upstream/data.ts`。

### 插画

- `icon` 插槽外层已 `aria-hidden="true"`、图片因此不需要 label：`EmptyState/types.ts` 的 `EmptyStateSlots` 注释，与现有页面正文一致。
- 尺寸建议（图标 20–24px、插画 120–200px、引导页到 240px）参考原版，并按我们的容器改写；`empty-state.css` 里 icon 容器只有 `flex-shrink: 0`、文字块最大 360px，所以尺寸必须由调用方给。
- `isCompact` 的实际效果（间距 8px、标题 14px、说明 12px、操作竖排）：`styles/empty-state.css:16-58`。

### Tailwind / UnoCSS / CSS Modules

- 五层顺序声明在每份样式表第一行；「层的位置由第一次出现决定」是 CSS 级联层的规则，所以示例给出应用入口那一行合并声明，并说明 `@layer` 语句允许写在 `@import` 之前。
- UnoCSS 默认输出不分层的普通规则：与 `guide/styling.md` 原有那句「未分层的全局 CSS 优先级天然高于所有 `@layer`」一致；`outputToCssLayers` 作为一种配置提到。
- `@theme inline` 按 Tailwind v4「主题值引用另一个变量时必须加 `inline`」的说明写，没有断言更细的机制。
- CSS Modules 穿透用 `:deep()` / `:global`，示例改的是 `LayoutPanel` 的 `.astryx-layout__panel`（该 class 在 `styles/layout.css` 里存在）。

## 验证记录

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| catalog 重生成 | `pnpm --filter @astryx-vue/cli generate` | 245 组件 / 36 topic（原 32 + 4）/ 53 模板 |
| catalog 一致 | `pnpm --filter @astryx-vue/cli generate:check` | 通过 |
| 构建 | `pnpm build:packages` | 通过 |
| 文档站构建 | `pnpm docs:build` | 通过，569 页 |
| 包检查 | `pnpm check:packages` | 通过（含行数上限、no-important、i18n catalog） |
| CLI 读新页 | `node packages/cli/bin/astryx-vue.mjs docs guide/working-with-ai` 与 `--zh` | 正常输出中英文正文，URL 为 `/guide/working-with-ai`、`/en/guide/working-with-ai` |
| 页面渲染 | `vitepress preview --port 5171` + Playwright | 18 个页面全部 200，h1 正常，代码块有内容，侧栏 21 条链接 |
| 站内链接 | 抓 18 页正文里的 53 条站内链接 | 无 404 |

预览用的 PID 已关，`.tmp-d9/` 已删。工作区干净，没有推送。

## 两点需要知道的现象

1. **组件页有 hydration 警告（既有问题）。** `/components/chat/`、`/components/layout/`、`/components/badge/`、`/components/resize-handle/` 这些我没有改过的页面同样打印 `Hydration completed but contains mismatches`，`/components/card/`、`/components/dialog/`、`/guide/why` 则是干净的。说明这跟演示组件有关，跟本次文档改动无关，这一轮没有动它。
2. **组件页本来就没有侧栏。** `/components/*/` 用的是 `layout: component-docs` + `footer: false`，HTML 里没有 `VPSidebar`，所以「侧栏能进」这条只对 4 个新指南页成立，已按指南页验证。

## 留给下一轮（如果还有）

- `guide/patterns.md` 与新的 `guide/layout.md` 有一点主题重叠（侧边面板、区域划分），目前靠互相链接分工：`layout` 讲骨架和间距，`patterns` 讲两种具体做法。若后续合并，建议保留 `guide/layout` 作为入口。
- 原版 `browser-support` 里 anchor positioning 那一档我们没写，因为代码里没用。以后若引入，需要同步改底线表格。
