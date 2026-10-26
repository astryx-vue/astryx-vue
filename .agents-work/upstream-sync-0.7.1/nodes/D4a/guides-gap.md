# 原版 CLI 内置指南 vs 我们文档站

原版 `packages/cli/assets/docs/` 有 142 个文件，去掉中文版、精简版（dense）、草稿后是 124 篇。下面按「对我们的用户有没有用」分四类。

## A. 我们已经有，不用补（约 30 篇）

| 原版 | 我们对应的页面 |
| --- | --- |
| getting-started、tree/quick-start | guide/getting-started、installation |
| color、tree/tokens-color | themes/color |
| motion、tree/tokens-duration、tree/tokens-ease | themes/motion |
| spacing、shape、elevation、tree/tokens-spacing/radius/shadow/size/focus/border | themes/scale |
| tree/typography、tree/type-scale、tree/tokens-text-size/type-scale/typography/font-weight | themes/typography |
| tree/tokens、tree/tokens-usage、tree/tokens-and-setup | themes/tokens、css-variables |
| theme、use-a-theme、tree/themes、tree/use-a-theme-in-an-app | themes/index、各主题页 |
| author-a-theme、tree/define-the-theme、tree/extend-or-replace | themes/extending |
| icons | guide/icons |
| styling-overview、tree/styling、tree/styling-basics | guide/styling |
| tree/internationalization、tree/i18n-quick-start、tree/i18n-library-integration | guide/i18n |
| tree/responsive | guide/responsive |
| tree/links | guide/links |
| tree/templates、tree/page-template | guide/templates |
| tree/cli、tree/commands、tree/help | guide/cli |
| tree/upgrading、tree/migration | guide/migration（D7 刚写） |

## B. 我们没有，建议补进文档站（9 篇）

| 原版 | 讲什么 | 建议放哪 |
| --- | --- | --- |
| principles | 设计原则：什么时候用什么、几条硬规则 | 新页 guide/principles |
| working-with-ai | 怎么配置 Claude、Cursor、Codex、Copilot，让 AI 写出正确的组件代码 | 新页 guide/working-with-ai，和 `init` 输出的指引相互引用 |
| browser-support | 支持哪些浏览器、依赖哪些新特性（`light-dark()`、`@layer`、`:has()`）、要兼容老浏览器怎么办 | 新页 guide/browser-support |
| tree/layout、tree/layout-spacing | 页面区域怎么分、每块对齐一条内容线、间距和密度怎么调 | 并进 guide/responsive，或者新页 guide/layout |
| tree/headers-and-footers | 正文滚动时固定页眉和页脚，标题和提交按钮始终可见 | guide/patterns 加一节 |
| tree/side-panels | 选中一行后打开侧边详情面板，不跳页面 | guide/patterns 加一节 |
| tree/typography-best-practices | 字号、标题、展示字的该做与不该做 | themes/typography 加一节 |
| tree/i18n-rtl-and-testing | 从右往左排版、伪语言测试 | guide/i18n 加一节 |
| illustrations | 空状态、引导页插画的用法规范 | 可选，放进 EmptyState 组件页 |

## C. 换成 Vue 的说法再补（2 篇）

| 原版 | 讲什么 | 我们怎么写 |
| --- | --- | --- |
| tree/tailwind | Tailwind v4 怎么和系统 token、层顺序配合 | guide/styling 加「和 Tailwind / UnoCSS 一起用」 |
| tree/other-libraries | 和 Panda、Chakra、MUI、Emotion 等一起用 | 只挑 UnoCSS、Tailwind、普通 CSS Modules 写，React 专属的库不写 |

## D. 不适用，不补（约 80 篇）

- **写扩展包的整套指南**（tree/integrations、add-a-component、add-a-theme、add-a-topic、publishing、versioning、sections-and-placement、scaffold、ship、package-and-test 等约 40 篇）：配合原版的 `integration` / `discover` 命令，我们已经决定不做。
- **写模板、给模板打分的指南**（tree/write-good-templates、template-grading-rubric、grade-template-with-agent、template-assets、template-fonts 等约 20 篇）：给想往原版投稿模板的人看的，我们的模板由仓库自己维护。
- **StyleX、codemod、ShadCN 相关**（tree/css-and-stylex、codemods、component-migration、non-css-processing、shadcn-compatibility 等）：我们不用 StyleX，D6 暂缓，ShadCN 是 React 生态。
- **CLI 自身的排错、调试、配置**（tree/troubleshooting、debug-and-gap-reports、configuration、api 等）：针对原版命令行的报错信息，等 D4b 做完，我们按自己的命令行写一页 guide/cli 的「常见问题」即可。

## 建议

B、C 两类共 11 篇，大约是 6 个新页加 5 处小节。它们都是文档，不改代码，可以开一个文档节点（比如 D9「指南补齐」）交给 worker 写，我来审。
