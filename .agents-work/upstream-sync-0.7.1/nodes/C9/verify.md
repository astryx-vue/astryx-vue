# C9 Markdown 与代码 · 验收计划

你是验收者，只检查，不改代码。`impl-1.md` 只说明实现者做了什么，每一条都要重新验证。

判断标准是效果和公开接口，不是源码和上游逐行相同。

## 环境

- 工作区：`/workspace`，分支 `sync/c9-markdown`。`BASE` 指 `git merge-base HEAD origin/swarm-tree`。
- 开始和结束各跑一次 `git status`，两次结果必须相同。临时文件放在 `/tmp/verify-C9/`。
- 测试相关检查项跑两遍：`env -u NODE_ENV` 和 `NODE_ENV=production`。vitest 加 `--maxWorkers=2`。两遍都要通过，用例数相同。
- 命令加 `timeout`。需要浏览器时只用 `pnpm visual` 或 `node scripts/swarm/browser-lock.mjs run --purpose C9-verify --`。

## 检查项

每一项只能判「过」或「不过」，并附上命令输出或你读到的内容。

### 一、效果和上游一致

1. 挂载 `Markdown`，内容为 `# Setup`。标题 id 是 `setup`，标题里的链接 `href` 是 `#setup`。
2. 内容为三层嵌套：`-` 里面 `1.` 里面再 `-`。三层的 `data-marker` 依次是 `disc`、`lower-alpha`、`square`。无序层有圆点和方块两种形状。
3. 内容为 `Fish &amp; chips &copy; 2026`。页面文字里能看到 `©`，并且 `&amp;` 显示成 `&`。围栏代码里的 `&copy;` 仍是原文。
4. 不传插件时，渲染结果没有 `data-source-line`。传入 `markdownSourceLinesPlugin` 后，标题、段落、列表项、代码块外层、表格外层、分隔线带有起始行和结束行。`em`、`tr`、`td` 没有这个属性。
5. 一段超过 80 个字符的围栏代码，代码元素带 `data-wrapped="true"`。
6. 围栏信息为 `diff-ts`，两行分别以 `+` 和 `-` 开头。行上有 `data-diff`，语言按 `ts` 着色，标题里能看出是 diff。

### 二、解析器与插件协议

7. 从 `@astryx-vue/core/Markdown/parser` 引入 `parseMarkdownAst`、`parseInlineAst`、`parseMarkdown`、`parseInline`、`decodeMarkdownCharacterReferences`、`parseMarkdownIncremental`、`createIncrementalState`。`decodeMarkdownCharacterReferences('&copy; &unknown;')` 等于 `© &unknown;`。`&#169;` 和 `&#xA9;` 也是 ©。`&#0;` 是 U+FFFD。没有分号的 `&copy` 保持原样。
8. `parseMarkdownAst('# Heading\n\nParagraph')` 的根是 `root`，子节点是 heading（depth 1）和 paragraph。`parseInlineAst('**bold**')` 的第一项是 `strong`。`parseMarkdown` 的第一项是 `{ type: 'heading', level: 1 }`。`parseInline('**bold**')` 的第一项是 `{ type: 'bold' }`。`parseMarkdownIncremental` 的结果和 `parseMarkdown` 深度相等。
9. `createMarkdownPlugin({ name, apiVersion: 1, transform })` 之后，`getMarkdownPluginCapabilities` 返回 `{ syntax: false, transform: true }`。随便传入一个普通对象会抛错。
10. `createMarkdownFrontmatter` 解析 `---\ntitle: Server proof\n---\n# Body` 后，后续 transform 能读到 `title === 'Server proof'`，渲染用的子节点只剩 heading。
11. 一个行内语法插件能在 `parseMarkdownAst('Hi @ada', { plugins })` 的树里得到 `type: 'extension'` 的节点，且 `source` 是 `@ada`。
12. `package.json` 的 `exports` 含有 `./Markdown/parser`、`./Markdown/plugins`、`./Markdown/plugin-renderer`，并且 `source` 指向的文件存在。这些入口文件没有 `use client`。

### 三、反向挑刺

13. 键盘：标题锚点是链接，可以聚焦。代码块复制按钮仍可用。
14. 读屏：标题锚点有 `aria-label`。任务列表项仍有完成或未完成的隐藏文字。
15. 服务端渲染：`ssr-known-failures.json` 里没有 Markdown、Code、CodeBlock。`parseMarkdownAst` 不访问 `document`。
16. 空字符串：`parseMarkdownAst('')` 不抛错，组件能挂载。
17. 图标：本节点不新增图标注册。写「不适用」并确认 diff 没有新的图标注册表。
18. `node scripts/check-no-important.mjs` 通过。样式里没有新增 `!important`。

### 四、C 节点通用检查

19. 台账 `ledger/C9.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：`。抽查至少 3 条「已采纳」，确认行为在代码或测试里。抽查全部「不适用」，理由要站得住。
20. 本轮新增的解析器、实体、行号、折行测试，两种 NODE_ENV 都通过，用例数相同。
21. 中英文 Markdown 文档写了锚点、多层列表记号、字符实体、行号插件、长行折行和 parser 子路径。打开两个 `index.md` 能看到这些句子。`meta.ts` 只有目录字段，标题仍是 Markdown。
22. Markdown、Code、CodeBlock 都不在 SSR 已知失败名单里。
23. 视觉对照：若 `pnpm visual Markdown` 能跑，看四种组合。若环境跑不了浏览器，读代码确认没有把锚点、列表记号和折行样式删掉，并在报告里写明「只能读代码确认」。
24. `node scripts/check-line-limit.mjs` 通过。`render.ts` 不在白名单里，且不超过 500 行。`tokenizer.ts` 里没有 TODO、FIXME。

### 五、整体

25. `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Markdown packages/core/src/Code` 通过。`NODE_ENV=production` 再跑一遍，用例数相同。
26. `env -u NODE_ENV pnpm exec eslint packages/core/src/Markdown packages/core/src/Code --max-warnings 0` 通过。类型检查至少覆盖新增文件，没有新增错误。
27. `git diff $BASE --stat` 里没有计划以外的业务组件。`node scripts/sync-exports.mjs --check` 通过。
28. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `nodes/C9/verify-1.md`。

## 验证操作要短小

每次只测一件事。超时不要原样重跑。脚本和结果放在 `/tmp/verify-C9/`。
