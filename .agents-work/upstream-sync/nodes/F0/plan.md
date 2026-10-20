# F0 新包技术选型决策 · 执行计划

## 目标

上游除了 core、themes、cli 之外，还有 5 个包我们没有移植：richtext、charts、lab、vega、build。这个节点不写实现，只写一份**决策记录**（ADR），回答下面这些问题：

- 每个包做不做？
- 如果做，用什么技术方案？
- 发布在什么渠道？

F1 到 F6 这 15 个节点会照着这份决策去执行。所以决策必须有依据，不能拍脑袋。

**按项目规程，我们追求的是「用户看到的样子和用起来的手感」和上游一致，不要求代码 1:1 照抄。** 选型时优先选 Vue 生态里成熟、合适的方案。只要用户体验一致，不需要和上游用同一个底层库。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F0`，分支 `sync/f0-new-packages-adr`。只在这里提交。
- 上游仓库（只读）：`/Users/shenqingchuan/workspace/astryx-upstream`，标签 `v0.7.1`。用 `git show v0.7.1:<路径>` 读文件。
- 规程：`/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/SWARM.md`，重点看「对齐上游的标准」一节。
- 任务树：同目录下的 `ROADMAP.md`，看 F 阶段各节点的说明。
- 台账：同目录下的 `ledger/F*.md`，列出了上游这些包在 0.4.1 到 0.7.1 之间的提交。
- 访问外网（npm、GitHub、文档站）前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`
- 可以用网络搜索和 deepwiki、context7 一类的工具查资料。查到的版本号、维护状态、周下载量要写明来源和查询日期。
- **不要开浏览器**，不要装依赖到仓库里。如果需要试一个库能不能用，在 `/tmp/f0-spike/` 里单独建一个小项目试，不要碰仓库。

## 已知事实（总控已经查过）

| 上游包 | 版本 | 发布渠道 | 关键依赖 |
| --- | --- | --- | --- |
| `@astryxdesign/richtext` | 0.7.1 | 正式版 | Lexical 0.52 全家桶（`lexical`、`@lexical/react`、markdown、table、code、list、link 等，都是 peer），React |
| `@astryxdesign/charts` | 0.1.9 | 只发 canary | d3-array、d3-scale、d3-shape；源码里有 `webgl.ts` |
| `@astryxdesign/lab` | 0.1.9 | 只发 canary | d3 系列；19 个实验组件 |
| `@astryxdesign/vega` | 0.1.3 | 只发 canary | vega、vega-lite |
| `@astryxdesign/build` | 0.7.1 | 正式版 | babel、StyleX 插件、lightningcss、Vite 插件 |

我们这边：

- 样式用 CSS 变量和 CSS 层，不用 StyleX。
- 构建用 tsdown 加 unplugin-vue。
- 公开包不能出现 React 依赖，这条由 `scripts/check-package-boundaries.mjs` 检查。

## 要回答的问题

每个问题都要写：有哪几种选择、每种选择的好处和代价、推荐哪种、为什么。

### 1. richtext（富文本编辑器）

- 先读上游的 `packages/richtext/src/` 和 `RichTextEditor.doc.mjs`，弄清楚用户能用它做什么：
  - 有哪些格式
  - 有哪些插件：代码块、表格、任务列表、Markdown 快捷输入、自动识别链接等
  - 能导入导出 Markdown 吗
  - 有没有只读视图
- 候选方案至少包括下面三种：
  - Lexical 的核心（`lexical` 本身和框架无关）加上我们自己写的 Vue 绑定。顺便看一下社区有没有现成的 Lexical Vue 绑定，比如 `lexical-vue`，查它的维护情况。
  - Tiptap，也就是 ProseMirror 加官方的 Vue 3 绑定。
  - 其他值得考虑的方案。
- 对比时看这几点：
  - 能不能做到和上游一样的编辑体验：快捷键、Markdown 快捷输入、粘贴、撤销、表格操作手感。
  - Markdown 往返：导入后再导出，内容要一致。上游在这方面有大量测试，看 `markdown*.test.ts`。
  - 包体积。
  - 维护状态。
  - 和我们已有 `Markdown` 组件的关系：能不能共用解析逻辑？我们的 core 已经用了 `mdast-util-from-markdown`。
  - 迁移上游测试的成本：用 Lexical 的话，上游很多纯逻辑测试可以直接参考。
- 结论里要写清楚：F1a 的「纯逻辑」具体指哪些（和 UI 无关、可以先做的部分），F1b 要做哪些。

### 2. charts（图表）

- 读上游的 `packages/charts/src/`，弄清楚：
  - 有哪些图表类型（marks）
  - 渲染方式：SVG、Canvas 还是 WebGL？`webgl.ts` 是用在什么场景？
  - 配置模型长什么样
- 候选方案：
  - 照上游思路，用 d3 做计算，渲染交给 Vue 的 SVG 模板（d3 本身和框架无关，可以直接用）。
  - 换用 ECharts 或别的现成图表库。
- 判断的标准是：画出来的图和交互（提示框、图例、坐标轴）能不能和上游一致。
- 还要说明 F2a 的纯逻辑包括哪些（格式化、配色、比例尺、布局计算），以及大数据量下的 WebGL 部分要不要做。

### 3. lab（实验组件）

上游有 19 个组件：Chart、Chat、ChatReasoning、CircularProgress、CodeEditor、DiffViewer、Drawer、InfoTip、ListInput、LogStream、MobileTokenizer、Radial、SVGIcon、Sankey、Schedule、Stat、ThreeD、Tour、TransferList。

- 逐个说明：
  - 它是干什么的。
  - 是不是已经被提升进 core 了（比如 BottomSheet、Stepper 以前在 lab）。
  - 依赖什么：CodeEditor 用的是什么编辑器？ThreeD 用的是什么？
  - 要不要做。
- 和 ROADMAP 里 F3a 到 F3e 的分组对照，如果分组不合理，就提出调整。
- 发布策略：我们要不要也只发 canary？npm 的 dist-tag 怎么设？包名叫什么，比如 `@astryx-vue/lab`？

### 4. vega

- 它是 vega 和 vega-lite 的 React 封装。判断我们是做一个 Vue 封装，还是标记为「不做」，并写明理由。

### 5. build

- 它是 StyleX 源码构建用的 babel、PostCSS、Vite 插件。我们不用 StyleX，所以先确认它对我们的用户有没有任何用处，比如它的 PostCSS 部分是不是有别的作用。然后给出结论：大概率是「不做」，但要有依据。

### 6. 公共问题

- **包结构**：新包放在 `packages/<name>`，样式和主题怎么跟 core、themes 配合？要读上游 `docs/specs/AST-080-package-stylesheets/spec.md`，台账 F0 里唯一的那条提交就是它。规定是「每个包带一份预构建的样式表，放在共享的 CSS 层里」，说明我们要怎样做到同样的效果。
- **版本**：新包的版本号是和 core 同步，还是独立。
- **对 `scripts/check-package-boundaries.mjs`、`sync-exports`、文档站、CLI catalog 的影响**：新包接进来要改哪些地方，列出清单就行，不用实现。
- **Nuxt 模块（F4）** 和这些新包的关系：要不要在 F4 里一起注册。

## 产物

1. **决策记录**：`docs/adr/0001-new-packages.md`。如果仓库里已经有别的 ADR 目录，就沿用它的格式。用中文写，大白话。结构如下：
   - 背景
   - 每个问题的选项对比表
   - 决策
   - 后果：要做的事、不做的事、风险
   - 给 F 阶段各节点的范围建议
2. **台账处理**：`.agents-work/upstream-sync/ledger/F0.md` 里的那一条，打勾，并写上「已采纳：见 ADR 第 X 节」。
3. **ROADMAP 调整建议**：如果你认为 F 阶段的节点要拆、要合、要删，或者依赖关系要改，**不要直接改 ROADMAP**，在回报里写成清单，由总控决定。
4. 如果在 `/tmp/f0-spike/` 里做过试验，在 ADR 的附录里写清楚：试了什么、结果怎样。

## 不做

- 不写任何包的实现代码，不在仓库里加依赖。
- 不改 ROADMAP.md、SWARM.md。

## 自测

- ADR 里每一个「推荐」都有依据：上游源码路径、外部资料链接，或者试验结果。
- 引用的上游路径都真实存在，用 `git show v0.7.1:<路径>` 确认过。
- 引用的外部库版本号和维护状态，都写明了查询日期。
- 跑 `env -u NODE_ENV pnpm lint`，确认 Markdown 的 lint 能通过（如果有）。
- 跑 `node scripts/check-line-limit.mjs`，确认能通过。

## 提交与回报

- 在分支上提交，提交信息用中文。不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/F0/impl-1.md`（主仓库路径），内容包括：
  1. 每个包的结论，每个一句话。
  2. 对 F 阶段节点的调整建议。
  3. 需要用户拍板的事项。比如「richtext 用 Lexical 还是 Tiptap」如果很难取舍，就把两边的利弊列清楚，交给用户决定。
  4. 拿不准的地方。
- 最终回复用中文，300 字以内。
