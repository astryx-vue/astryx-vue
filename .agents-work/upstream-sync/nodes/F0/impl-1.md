# F0 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F0`，分支 `sync/f0-new-packages-adr`
- 提交：`27dc7e9 docs: 新增 ADR 0001，确定上游 5 个新包的移植方案`（未推送）
- 产物：
  - `docs/adr/0001-new-packages.md`（新建。仓库里原来没有 ADR 目录）
  - `.agents-work/upstream-sync/ledger/F0.md`：唯一一条 `fc89798e6` 已打勾，写明「已采纳：见 ADR 第 7.1 节」
- 没有改 ROADMAP.md、SWARM.md；没有在仓库里加依赖；没有写实现代码；没有开浏览器。

## 1. 每个包的结论

| 包 | 结论 |
| --- | --- |
| richtext | 做。用 Lexical 0.52 内核（框架无关部分），自己写一层很薄的 Vue 绑定，不用 `lexical-vue`。发正式版 `@astryx-vue/richtext`，加入 core 和 themes 的 fixed 版本组。见 ADR 第 2 节 |
| charts | 做。d3 负责计算，Vue 模板画 SVG，不用 ECharts。4 个 WebGL 标记延后。`@astryx-vue/charts` 只发 canary。见 ADR 第 3 节 |
| lab | 做。逐个用 Vue 重写；图表类复用 charts 的纯逻辑；ChatReasoning、ChatTypingIndicator、ChatUnreadDivider 已经在我们 core 里，不重复做。`@astryx-vue/lab` 只发 canary（`private: true` 加 canary job）。见 ADR 第 4 节 |
| vega | 先不做。上游自己只发 canary；在 Vue 里直接用 `vega-embed` 就够了；主题配置可以作为代码片段放进 charts 文档（可选）。见 ADR 第 5 节 |
| build | 不做。它只解决 StyleX 原子类在库和业务之间撞名的问题，PostCSS 部分也只处理 StyleX 产物；而且上游 AST-080 DEC-1 已经规定用户应该加载预构建样式表。见 ADR 第 6 节 |

## 2. 对 F 阶段节点的调整建议（由总控决定）

1. **F3d 拆成两个**：F3d 只保留图表类（Chart 组件组合写法、Brush/Zoom/Select、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分），依赖 F2b；新增 **F3d2 lab 代码类**（CodeEditor、DiffViewer），依赖 F0、C9，不用等 F2b。
2. **F3b 拆出 Schedule**：新增 **F3b2 lab 日程表**。Schedule 约 5700 行，比 F3b 其余 5 个加起来还多。依赖 F0、C5、C6、C7。
3. **F3e 缩小范围**：只做 ChatEmojiPicker、ChatReactionBar；另外 3 个已经在 core 里，只核对一下上游 lab 有没有新改动，有就转给 C10。
4. **新增 F2d charts WebGL**（可延后，建议先不开工）：charts 的 4 个 GL 标记，加上 lab 的 GL 系列和 `ThreeDScatterGL`。
5. **补依赖**：
   - F1b 加上 C1（Field 和 TextArea 外框）、C2（CheckboxInput）、C7（Dialog）、C14（Toolbar）。
   - F3a 加上 C8（BottomSheet）、C11（Table 列宽工具）、C12（List、Item）。
   - F1c、F2c、F3f 建议依赖 D4b，因为 CLI 目录要先能识别多个包。
6. **F5、F6 标为「不做」**。各自的台账（F5 4 条、F6 11 条）标「不适用」，理由引用 ADR 第 5、6 节。
7. **F4 Nuxt 模块**：只注册 core 和 themes，给新包留可选开关，不等新包。
8. **G3**：要新增 canary 发布 job；首发 canary 包时先占住 `latest`（npm 会把第一次发布的版本自动贴上 `latest`）。

## 3. 需要用户拍板的事项

1. **richtext 用 Lexical 还是 Tiptap。** 我推荐 Lexical，理由比较硬，但这是最大的一个决定，请用户确认。
   - Lexical 的好处：上游公开 API 本身就暴露了 Lexical 类型（`nodes`、`transformers`、`onChange(editorState)`），换内核后用户的自定义节点没法用；上游约 4600 行「Markdown 原样往返」逻辑和约 5800 行测试能直接移植；试验里只用自带转换器，12 个样例就有 10 个原样返回。
   - Lexical 的代价：Vue 绑定要自己写、自己维护；Lexical 还在 0.x。
   - Tiptap 的好处：有官方 Vue 3 绑定，社区大（周下载 107 万）。
   - Tiptap 的代价：12 个样例只有 6 个原样返回，「原样往返」要整套重写；上游测试基本不能复用；公开 API 类型和上游不同。
   - 体积两边差不多：gzip 后约 170 KB 对 157 KB。
2. **vega 是不是彻底不做**，还是在 charts 文档里加一小节「和 Vega-Lite 一起用」，提供主题配置片段。
3. **WebGL 部分（F2d）是不是确定延后**。

## 4. 拿不准的地方

- **C9 能不能提供上游那样的 Markdown 解析器和插件协议。** 上游 richtext 直接调用 `@astryxdesign/core/Markdown/parser` 的 `parseMarkdownAst`、`decodeMarkdownCharacterReferences`，以及 `Markdown/plugins` 的 `getMarkdownPluginCapabilities`。我们 core 现在是 `mdast-util-from-markdown` 加 `defineMarkdownPlugin`，协议不一样。如果 C9 不对齐，F1a 要先跳过 `markdownExtensions`。建议总控给 C9 的计划加一句提醒。
- **core 有没有颜色解析工具**（上游 `core/utils` 的 `parseHex`、`parseColor`、`formatHex`）。charts 的配色要用到。我没有深查。没有的话，F2a 在 charts 包内部自己实现。
- **sync-exports 推广成多包**，归第一个有组件的新包节点。这个改动不小，要看 E1 拆分后的结构。也可以考虑单独开一个小节点。
- **装饰节点（DecoratorNode）在 Vue 里怎么渲染**，我只想清楚了思路（mutation 监听加 Teleport，参考 `lexical-vue` 的 `LexicalDecoratedTeleports`），没有实际试。F1b 第一步应该先验证这一点。
- 层的命名：上游 AST-080 用 `reset, astryx-base, astryx-theme`，我们用 `astryx.reset … astryx.overrides`。ADR 里判定「效果等价，不改名」，依据是每个文件都自己声明层顺序、主题和组件的先后关系固定。如果总控认为要和上游层名一致，那是 B1、B2 的事。

## 5. 自测

- 上游路径：ADR 里引用的约 50 个上游文件，都用 `git cat-file -e v0.7.1:<路径>` 确认过存在；引用的 5 个提交号也确认存在。
- 外部版本和维护状态：都在 ADR 里写明了查询日期 2026-10-20 和来源（`npm view`、api.npmjs.org、`gh api`）。
- `env -u NODE_ENV pnpm exec eslint docs/adr/0001-new-packages.md --max-warnings 0`：通过。
- `env -u NODE_ENV pnpm lint`：通过，没有任何输出。
- `node scripts/check-line-limit.mjs`：通过。
- 试验：Lexical 在 Vue 里挂载、Markdown 往返、Lexical 和 Tiptap 的体积、d3 加 Vue 服务端渲染、ECharts 体积，都在 `/tmp/f0-spike/` 里做过，结果写在 ADR 附录 A、B。`node_modules` 和打包产物都已经删掉，目录只剩约 150 KB 的脚本。
