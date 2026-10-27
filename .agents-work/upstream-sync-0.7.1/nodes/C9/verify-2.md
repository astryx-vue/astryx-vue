# C9 验收报告 · 第 2 轮

结论：通过（28/28）

- 工作区：`/workspace`，分支 `sync/c9-markdown`，提交 `0acad3a`（报告提交后以该提交为验收对象，本文件另计）。
- 比较基点：`BASE = 202336faea5c49c27aa75f76811d0e82795accce`（`git merge-base HEAD origin/swarm-tree`）。
- 临时文件和截图：`/tmp/verify-C9/`。截图另存 `/opt/cursor/artifacts/c9-verify2/`。全部本轮重新生成，没有用实现者留下的产物。`impl-1.md` 未当作证据。
- 只读检查：开始时 `git status` 是 `nothing to commit, working tree clean`（`0acad3a`）。结束时同样干净。两次相同。
- 临时改动：`pnpm visual` 构建时改写了 `packages/cli/src/generated/catalog.json`。已用 `git checkout --` 还原，没有提交。除此之外无。
- 浏览器：`node scripts/swarm/browser-lock.mjs run --purpose C9-verify2` 与 `--purpose C9-verify2-anchor`，本地预览 `http://127.0.0.1:5199`；`pnpm visual Markdown --no-proxy` 使用文档站 `http://localhost:5172`。结束后 5172、5199 没有监听，没有残留 Chromium。

第 19 条是本轮重点。台账 `a4ed39905` 现写「当前实现始终是 `tabindex="0"`，本轮没有改 CodeBlock 的停靠规则」。代码与浏览器都是这样。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 挂载 `# Setup`，标题 id 为 `setup`，锚点 href 为 `#setup` | 过 | `/tmp/verify-C9/probe.test.ts` 第 1 条。两种 `NODE_ENV` 都过。浏览器聚焦后 `href="#setup"`。 |
| 2 | 三层 `-` / `1.` / `-` 的 `data-marker` 为 `disc`、`lower-alpha`、`square`，无序层有圆点和方块 | 过 | 探针第 2 条。页面上第一层圆点、第二层 `a.`、第三层方块。见 `ours-desktop-light.png`。 |
| 3 | `Fish &amp; chips &copy; 2026` 显示 `©` 和 `&`，围栏里的 `&copy;` 保持原文 | 过 | 探针第 3 条。页面文字是 `Fish & chips © 2026`，第一块代码是 `&copy;`。 |
| 4 | 不传插件没有 `data-source-line`；传入后块上有起止行，`em`、`tr`、`td` 没有 | 过 | 探针第 4 条。标题行号为 `1`。`em`、`tr`、`td` 没有该属性。 |
| 5 | 超过 80 个字符的围栏，代码元素 `data-wrapped="true"` | 过 | 探针第 5 条。浏览器里 `data-wrapped="true"`，`white-space: pre-wrap`。长行在块内折成多行。 |
| 6 | `diff-ts` 两行 `+` / `-`，行上有 `data-diff`，按 `ts` 着色，标题能看出 diff | 过 | 探针第 6 条。标题为 `ts diff`。行是 `removed`、`added`。`const` 有关键字色。删除行浅红、增加行浅绿。 |
| 7 | parser 子路径的实体解码 | 过 | 从 `publicParser.ts` 引入全部 7 个名字。`&copy; &unknown;` 为 `© &unknown;`。`&#169;`、`&#xA9;` 为 ©。`&#0;` 为 U+FFFD。`&copy` 保持原样。 |
| 8 | AST、旧块列表、增量结果形状一致 | 过 | 探针第 8 条。根是 `root`，子节点 heading depth 1 与 paragraph。`parseInlineAst` 第一项 `strong`。`parseMarkdown` 第一项 `{ type: 'heading', level: 1 }`。`parseInline` 第一项 `{ type: 'bold' }`。增量结果与全量深度相等。 |
| 9 | 插件能力与非法对象 | 过 | `createMarkdownPlugin({ name, apiVersion: 1, transform })` 后能力为 `{ syntax: false, transform: true }`。普通对象抛错。 |
| 10 | frontmatter 把标题交给后续 transform，渲染子节点只剩 heading | 过 | 探针第 10 条。`title === 'Server proof'`。子节点只剩 depth 1 的 heading。 |
| 11 | 行内语法插件得到 `extension`，`source` 为 `@ada` | 过 | 探针第 11 条。`parseMarkdownAst('Hi @ada', { plugins })` 找到 `{ type: 'extension', source: '@ada' }`。 |
| 12 | `package.json` 三个子路径，`source` 文件存在，且没有 `use client` | 过 | `./Markdown/parser` → `src/Markdown/parser/index.ts`；`./Markdown/plugins` → `plugin-protocol/index.ts`；`./Markdown/plugin-renderer` → `plugin-renderer/index.ts`。三个文件都在，开头都没有 `use client`。 |
| 13 | 标题锚点可聚焦，复制按钮仍可用 | 过 | 锚点是链接，`tabindex` 不是 `-1`。Tab 后 `document.activeElement` 类名为 `astryx-markdown__anchor`，opacity 为 `1`。点击第一块复制按钮后剪贴板为 `&copy;`。 |
| 14 | 锚点有 `aria-label`，任务项有完成或未完成的隐藏文字 | 过 | `aria-label` 为 `Link to Setup`。任务列表文本含 `Completed` 与 `Not completed`。 |
| 15 | SSR 名单没有这三项，`parseMarkdownAst` 不访问 `document` | 过 | `ssr-known-failures.json` 是 `{}`。删掉 `globalThis.document` 后 `parseMarkdownAst('# Hi')` 仍返回 `root`。 |
| 16 | 空字符串不抛错，组件能挂载 | 过 | `parseMarkdownAst('')` 的 children 为 `[]`。`content: ''` 能挂载。 |
| 17 | 不新增图标注册 | 过 | 不适用。`git diff 202336f --stat -- packages/core/src/Icon packages/themes` 无输出。 |
| 18 | `check-no-important` 通过，样式没有新增 `!important` | 过 | `timeout 60 node scripts/check-no-important.mjs` 退出码 0。相对 BASE 的新增行里，只有说明文字提到这个词，没有样式声明。 |
| 19 | 台账每条勾选并有结论；抽查已采纳；全部不适用理由站得住 | 过 | 见下文「第 19 条」。119 条都是 `- [x]`，各有一条「已采纳」或「不适用：」。已采纳 27，不适用 92。 |
| 20 | 新增解析器、实体、行号、折行测试，两种 NODE_ENV 用例数相同 | 过 | 目录套件 13 文件、95 条，两种环境相同。其中含 `characterReferences.test.ts`、`parserPublic.test.ts`、`Markdown.test.ts`。独立探针 15 条，两种环境也相同。 |
| 21 | 中英文文档写了这些句子；`meta.ts` 只有目录字段 | 过 | `apps/docs/docs/en/components/markdown/index.md` 与中文页都写了锚点、三层记号、实体、`data-wrapped`、`markdownSourceLinesPlugin`、`Markdown/parser`。`meta.ts` 只有 `slug`、`group`、`order`、`en`、`zh`、`demo`。`en` 与 `zh` 都是 `Markdown`。 |
| 22 | Markdown、Code、CodeBlock 不在 SSR 已知失败名单 | 过 | 名单是空对象，三个名字都不在里面。 |
| 23 | `pnpm visual Markdown` 四种组合 | 过 | 四种都跑完。内容区差异：桌面浅色 8.5%、桌面深色 9.04%、390 浅色 5.28%、390 深色 5.33%。看图后是概览示例文案不同（上游英文长示例，我们是较短中文示例），不是白屏或报错。锚点、记号、实体、折行、diff 在单独的预览对照图里。 |
| 24 | 行数检查通过；`render.ts` 不在白名单且不超过 500 行；`tokenizer.ts` 无 TODO、FIXME | 过 | `timeout 90 node scripts/check-line-limit.mjs` 退出码 0。`render.ts` 484 行，白名单里没有它。`tokenizer.ts` 无 TODO、FIXME。 |
| 25 | Markdown 与 Code 的 vitest，两种 NODE_ENV 用例数相同 | 过 | `env -u NODE_ENV` 与 `NODE_ENV=production` 都是 13 文件、95 条，`--maxWorkers=2`，退出码 0。 |
| 26 | eslint 无警告；新增文件类型检查无新错误 | 过 | `eslint packages/core/src/Markdown packages/core/src/Code --max-warnings 0` 退出码 0。`pnpm --filter @astryx-vue/core exec vue-tsc --noEmit -p tsconfig.json` 退出码 0。 |
| 27 | diff 没有计划外业务组件；`sync-exports --check` 通过 | 过 | 相对 BASE 的业务改动在 Markdown、文档、`package.json` 子路径、`src/index.ts`、行数白名单。ROADMAP 只把 C9 标成实现中。`timeout 90 node scripts/sync-exports.mjs --check` 输出「生成结果和已提交文件一致」，退出码 0。 |
| 28 | 注释里没有修改历史 | 过 | `git diff 202336f \| grep -nE "^\+.*(原来\|改成\|之前\|moved\|extracted\|split from)"` 命中 2 处，都不是源码注释。一处在 `impl-1.md` 说明组件入口仍返回语法树根。一处是 `verify.md` 引用本条命令本身。 |

## 第 19 条

`node /tmp/verify-C9/audit-ledger.mjs`：119 条，未勾选 0，结论缺失或重复 0，已采纳 27，不适用 92。

`a4ed39905` 的结论是：

> 不适用：上游要求只在溢出时成为 Tab 停靠点；当前实现始终是 `tabindex="0"`，本轮按计划没有改 CodeBlock 的停靠规则。

代码：`packages/core/src/Code/CodeBlockContent.vue` 第 170 行视口写死 `tabindex="0"`。全目录搜索没有按溢出改 `tabindex` 的分支。`CodeBlock.vue` 第 191 行的 `tabindex: 0` 只在标题可折叠时给标题控件。浏览器里短围栏所在视口的 `tabindex` 仍是 `0`（桌面浅色这块代码宽度 686、行宽 654，内容没有横向溢出）。结论和代码一致。

已采纳抽查（探针或源码，多于 3 条）：

| 提交 | 核对到的行为 |
| --- | --- |
| `d69321e72`、`6bd4a7578` | `# Setup` 的 id 与 href |
| `310177296` | 三层 `data-marker` 与圆点、方块 |
| `cb30e207e`、`e5d11eb49` | 实体解码与围栏保留原文 |
| `e8160da03`、`f77c6c385` | 行号插件；`em`、`tr`、`td` 不盖章 |
| `3235ec99a` | `data-wrapped="true"` |
| `b32d73f95` | `diff-ts` 的 `data-diff` 与 `ts diff` |
| `a540a6d8a` | frontmatter 的 `Server proof` |
| `19651c632` | `sanitizeMarkdownLinkUrl('data: text/html,hi')` 为 null |
| `bb0706256`、`54be197d0` | 原始 HTML 不执行，`javascript:` 不是链接 |
| `43a0839af` | 根节点透传 `data-probe` |
| `287212abc` | 单元格 style 含 `min-width` |
| `60a8f6d98` | `.astryx-markdown__cell` 的 padding 是 `--astryx-spacing-2`，回退值 `8px` |
| `fe342107a` | `parse.ts` 的 `settledEnd` 只重解未闭合后缀 |

不适用 92 条都读过。理由归类后与计划一致，没有把未实现的行为写成已经落地：

| 条数 | 理由 |
| --- | --- |
| 31 | 上游自研 parser，本轮继续用 micromark，不逐行搬解析器 |
| 23 | 上游规范或文档，没有单独的运行时行为 |
| 11 | 主题、光标或 StyleX，不属于本轮解析和代码块接口 |
| 7 | 上游性能或浏览器夹具，本仓库没有这套规格 |
| 4 | 可选辅助函数，不在必做接口里 |
| 其余各 1 | 数学公式、remark、richtext、soft breaks、输入组件 prop、高亮类名转义、Code / CodeBlock 审计、内部标识、行号偏移校验，以及上面的 `a4ed39905` |

## 看图

预览页是本轮临时 Vite 页（`/tmp/verify-C9/preview`），内容含标题、三层列表、实体、长行、`diff-ts` 和任务列表。左列是 https://astryx.atmeta.com/components/Markdown 的首屏，右列是这个预览。官方首屏是文档站外壳和概览卡，不是同一份夹具，所以左右文案不同。四种颜色都对：浅色底约 `rgb(241, 241, 241)`，深色底约 `rgb(27, 27, 27)`。没有白屏、骨架或报错层。

| 图 | 看到的内容 |
| --- | --- |
| `/opt/cursor/artifacts/c9-verify2/side-desktop-light.png` | 左：上游 Markdown 文档浅色首屏，有导航和 Markdown Demo。右：浅色预览。标题 Setup，`Fish & chips © 2026`，圆点 / `a.` / 方块，围栏 `&copy;`，长行在块内折行，`ts diff` 红绿两行，任务勾选。 |
| `/opt/cursor/artifacts/c9-verify2/side-desktop-dark.png` | 同样布局。两边都是深色。右侧 diff 行在深底上仍能分出增删。 |
| `/opt/cursor/artifacts/c9-verify2/side-mobile-light.png` | 宽 390。左是上游手机首屏。右是浅色预览，长行折成四行左右，方块和 diff 都在视口内。 |
| `/opt/cursor/artifacts/c9-verify2/side-mobile-dark.png` | 宽 390，深色。右侧结构与浅色相同，背景是深色。 |
| `/opt/cursor/artifacts/c9-verify2/anchor-hover-light.png` | 悬停并聚焦后的标题特写：`Setup #`。默认态锚点透明，这是样式如此，聚焦后 opacity 为 1。 |
| `/opt/cursor/artifacts/c9-verify2/ours-desktop-light.png` | 只看右侧预览的完整浅色桌面图，五类内容都在，下方有空白，没有报错。 |
| `/opt/cursor/artifacts/c9-verify2/ours-mobile-light.png` | 390 浅色完整预览。 |
| `/opt/cursor/artifacts/c9-verify2/visual-desktop-light.png` | `pnpm visual` 的概览对照。左上游英文 Markdown Demo，右我们较短的中文示例。卡片都渲染出来了。深色桌面、390 浅色、390 深色也看过，结构相同，只是颜色和文案宽度不同。原图在 `/tmp/verify-C9/shots/visual/Markdown/`。 |

## 对实现者偏离计划的判断

实现回报里有两处和计划用词不同，都合理：

- 协议放在 `plugin-protocol/`，包导出 `./Markdown/plugins` 指向那里。旁边已有 Vue 用的 `plugins.ts`，另建同名目录会撞车。公开入口名字是对的。
- 组件自己的 `parseMarkdown` 仍返回语法树根，旧块列表在 parser 子路径。文档写了这件事。现有组件和测试不用改调用方式，F1a 仍可从子路径拿到旧块列表。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

`pnpm visual` 构建文档时会把 `index.md` 写进 `packages/cli/src/generated/catalog.json`。当前提交里的这份生成文件还没有锚点、实体、折行和 parser 这几句。验收项只要求两个 `index.md`，所以不因此判不过。本轮已把工作区里的生成结果还原。
