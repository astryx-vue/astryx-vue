# Astryx Vue 调研与讨论记录

> 状态：组件已经全部落地，三个包都已发布到 npm。
> 更新日期：2026-10-18

## 追上游的工作区

每追一个上游版本，就单独开一个目录，名字是 `upstream-sync-<上游版本号>/`。目录里放这次的规程（`SWARM.md`）、任务树（`ROADMAP.md`）、各节点的计划和报告（`nodes/`）、上游提交台账（`ledger/`）和交接文档（`HANDOFF.md`）。追完一个版本，它的目录就不再改动，留作记录。下次追新版本时，新建一个目录，`SWARM.md` 和 `templates/` 可以从上一次的目录复制过来。

| 目录 / 文件 | 状态 | 说明 |
| --- | --- | --- |
| `upstream-sync-0.7.1.md` | 已完成 | 对齐 Facebook/Astryx v0.7.1 的全局技术总结与里程碑记录 |
| `upstream-sync-0.7.1/` | 已收口归档 | 本轮追上游执行期间的子代理过程记录（过程资产，合入 main 前清理） |

`scripts/swarm/` 里的工具默认读写当前在追的那个目录，路径写在 `status.mjs`、`upstream-ledger.mjs` 和 `visual-compare`、`a11y-scan` 的 `args.mjs` 里。换版本时，要把这些默认路径和 `.gitignore` 里的对应条目一起改掉。

## 持续同步上游

`package.json` 的 `upstream.syncedTo` 是已经完成代码对齐的上游标签，不是“已经看过”的标签。`scripts/upstream-sync.mjs` 从这个标签之后逐版本生成组件族 issue；同名 issue 已存在时只复用，不重复创建，也不覆盖人工勾选和备注。

```sh
node scripts/upstream-sync.mjs --upstream ../astryx-upstream --dry-run
node scripts/upstream-sync.mjs --upstream ../astryx-upstream --apply
```

GitHub 工作流每周一检查 `meta/astryx`，也可手动 dry-run。默认 `GITHUB_TOKEN` 只能创建 issue；要给组织路线图添加或更新卡片，仓库还需要 `PROJECTS_TOKEN`（具有该项目读写权限）。没有它时工作流仍会创建 issue，配置后重跑会补齐卡片。

## 写作方式

- 尽量用中文和大白话。
- 工具的正式名称会保留，但第一次出现时说明它是做什么的。
- 不用英文缩写代替解释，不用行业黑话包装简单事情。

## 已经定下来的事

- 这是一个非官方的社区项目，所有公开包放在 `@astryx-vue` 这个 npm 组织下。
- 使用 MIT 许可证，并保留原版 Astryx 和第三方内容的许可证说明。
- Vue、TypeScript 和所有工具依赖使用 npm 当前最新版。
- 使用 pnpm 和带名称的版本分组，例如 `catalog:vue`、`catalog:build`，不用空的 `catalog:`。
- 应用构建使用 Vite；组件构建使用 tsdown 和 unplugin-vue；测试使用 Vitest。
- 代码检查使用 ESLint 和 `@antfu/eslint-config`。
- 文档使用 VitePress，组件示例直接使用 Vue。
- `@astryx-vue/core` 等公开组件包，以及新建空白 Vue 项目安装它们之后，都不能出现 React 依赖。
- 样式先用 CSS 变量和 CSS 分层，不把 UnoCSS 或 StyleX 作为使用组件的前提。
- Vue 版本使用 Vue 自己习惯的 props、事件、插槽、`v-model` 和组合式函数，不照抄 React 写法。

- 图标用我们自己的方案，不照搬上游的 React 图标注册表：`Icon` 按 Iconify 名字画图标，`astryxIcons()` Vite 插件从 `@iconify-json/*` 按需打包，组件内部只用语义名（默认是 Lucide，没注册时退回内置图形），主题用 `defineTheme({ icons })` 覆盖。详细说明在 `apps/docs/docs/zh/guide/icons.md`。

- 组件库和主题里一处 `!important` 都不用。优先级靠 `@layer` 顺序和选择器解决，让使用者能在自己的样式表里覆盖。`pnpm check` 里的 `check-no-important.mjs` 会拦截。

## 对齐原版

目标是像素级对齐：除了用 Vue 而不是 React 实现，样式、布局、交互和文案都应和原版 `facebook/astryx` 一致。React 与 Vue 的差别只在实现层，不该让使用者看出两个库的样子不一样。

三份原版资料各有用途：

| 原版文件 | 用途 |
| --- | --- |
| `<X>.doc.mjs` | 机器可读契约：`name`、`category`、`props`、`playground`、`theming` |
| `<X>.spec.md` | 人读的详细规范：FR/AR 条款、验收检查、以及明确该被拒绝的做法 |
| `<X>.tsx` 与 `__tests__` | React 实现和测试，用来核对行为语义 |

改了组件、样式或交互，pull request 里要附对照图：左边原版，右边 astryx-vue，至少覆盖桌面与 390px 窄屏、浅色与深色四种组合。评审看这些图和实际效果，不逐行读代码。

`packages/core/locales/*.json` 跟随原版最新。重新拉取用 `node scripts/vendor-astryx-locales.mjs`，不带参数就是原版 `main` 的最新提交；需要复现某次抓取时把提交号当参数传进去。实际用到的提交号记在 `SOURCE.json`。

## 新增一个组件

只新建自己的目录，然后跑 `pnpm sync`。不要手改下面这些生成文件：

- `packages/core/src/index.ts`
- `packages/core/package.json` 里的 `exports`
- `packages/core/styles.css`
- `packages/themes/neutral.css`
- `packages/core/src/composables/index.ts`
- `packages/core/src/locale/messages.ts`
- `apps/docs/components/demo-infra/componentCatalog.ts`
- `apps/docs/components/demos/registry.ts`

要新建的目录和文件：

1. `packages/core/src/<Component>/`，里面要有 `index.ts`，用具名导出组件、类型和组合式函数。不要只写默认导出。注入键（名字以 `Key` 或 `_KEY` 结尾）留在子路径里，不会进总入口。`Icon` 没有 `index.ts`，所以不对外公开。
2. `packages/core/styles/<kebab>.css`，以及需要主题时的 `packages/themes/neutral/<kebab>.css`。
3. 文案放在 `packages/core/src/locale/messages/<kebab>.ts`。同一个文件里写 `en` 和 `zh-CN`，并导出 `export const <camel>Messages` 和 `export interface <Pascal>Messages`。没有文案就不要建这个文件。
4. 可复用的组合式函数放在 `packages/core/src/composables/useX.ts`。不要手改该目录的 `index.ts`。
5. 文档示例放在 `apps/docs/components/demos/<slug>/`，并新增 `meta.ts`。文档页放在 `docs/zh/components/<slug>/` 和 `docs/en/components/<slug>/`。侧边栏和组件总览都读这份 `meta.ts`，不要再手写一份导航。

   `group` 写原版 Astryx 文档的分类名，必须是下面其中一个（顺序也是侧边栏和总览的顺序，英文标题用这个原文，中文标题在 `apps/docs/components/demo-infra/groups.ts`）：

   `Action`、`Chat`、`Container`、`Content`、`Data Visualization`、`Feedback & Status`、`Form Controls`、`Indicator`、`Layout`、`Navigation`、`Overlay`、`Table & List`、`Utility`。

   分类以 facebook/astryx 里该组件 `.doc.mjs` 的 `category` 为准，和 `apps/docsite/src/app/(docs)/components/page.tsx` 的 `CATEGORIES` 同一套。原版没有的组件，归到最接近的这一组。

   `order` 是组内位置，从 0 起，同一组不能重复。组内顺序跟原版组件总览一致，也就是按英文显示名的字母序；原版没有的组件同样按英文名插进这个序列。新组件只改自己的 `meta.ts`，跑 `pnpm sync` 后会自动出现在对应分组里。

然后在仓库根目录运行 `pnpm sync`。`pnpm check` 里的 `sync --check` 会核对生成结果；不一致就先重新生成，不要手动合并这些文件。

`styles.css` 里原先没有汇总、由组件单文件自己引入的样式，以及 `composables/index.ts` 原先没有公开的 `useCalendar`、`usePagination`，生成脚本会继续留在外面，避免公开范围被悄悄改掉。新文件不在这份例外里，会自动收进汇总。

## 文档怎么维护

仓库里的工作文档只保留当前正确的结论，不写会和现状打架的内容。

结论被后来的迭代推翻时，直接改成新结论。需要留下时间沿革的，标明它属于哪个时间点或哪个版本，让读者一眼能分清"当时是这样"和"现在是这样"。

## 历史

第一轮（2026-10 上旬，已完成）：先从头跑通一遍"整理原版资料 → 写 Vue 组件 → 测试 → 打包 → 放进空白 Vue 项目试装 → 写文档展示"。

当时准备的包是 `@astryx-vue/core` 和 `@astryx-vue/themes`，第一轮组件只有 Stack、StackItem、HStack、VStack、Badge、Blockquote、Skeleton、VisuallyHidden，暂不发布到 npm。这一阶段已经过去，现在的组件范围和发布流程以上面的章节为准。
