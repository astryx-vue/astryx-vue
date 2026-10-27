# D4a 取舍记录（和用户边讨论边定）

## 已定

1. 2026-10-24：CLI 规模选 B「中等」。
   - 已有命令补细节：`search` 排序与来源包、`docs --depth`、`build` 选起始模板、`component`/`composable`/`template`/`manifest` 对齐。
   - 新增：`init`（完整初始化）、`upgrade`（D6 的 FR10 迁移暂缓，`upgrade` 先只输出升级指引）、`theme`（只输出指引，见第 6 条）、`doctor`（简单版）。
   - 不做：`gap-report`、`discover`、`integration`、`blog`。
   - 不做：`swizzle`（2026-10-26 用户确认）。定制靠 CSS 变量、`container*`/`control*` 和插槽。
2. 文档仍然只有一份来源：文档站的 Markdown。CLI 的 catalog 从文档站生成，不在 CLI 里另写一套指南。

3. 2026-10-26：`init` 不写「改用户文件」的工程代码。
   - 只做两件事：维护 `AGENTS.md`（或同类 AI 说明文件）里我们那一段；输出一份给 AI 助手的接入指引（装哪些包、在入口引哪些 CSS、怎么包 Provider、怎么验证），由 AI 助手按用户仓库的实际结构去改。
   - 指引里的安装命令要按探测到的包管理器写：看 `packageManager` 字段和锁文件（`pnpm-lock.yaml`、`yarn.lock`、`bun.lock(b)`、`package-lock.json`），都没有就列出 npm / pnpm / yarn / bun 四种写法。
   - 理由：用户仓库结构五花八门（monorepo、Nuxt、自定义入口），「在某个文件加一行」的代码很难写对，AI 助手读得懂仓库，更适合做这一步。
   - 推论：`upgrade`、`theme` 也优先走「输出指引」，再看哪些步骤值得自动化。

4. 2026-10-26：D6（FR10 自动改代码脚本）暂缓。根上写的 `class`/`style` 保持原落点，升级不改也不会坏；迁移说明已经写进 D7 升级指南。
5. 2026-10-26：D5 拆成 D5a（只改文档站里的模板：补前缀、修版式、补 4 个模板，现在就做）和 D5b（命令行生成模板的行为，等 D4b）。D8 跟在 D5a 后面。

6. 2026-10-26：`theme` 只输出指引，不拆子命令（用户指出：都是输出文字，没必要分「加」「切」）。
   - `astryx-vue theme`：列出全部主题，每个一行说明。
   - `astryx-vue theme <名字>`：一次性输出这套主题的完整接入说明：入口里引哪个 CSS；根元素的 `data-astryx-theme` 写什么；已经有别的主题时怎么换、怎么并存（局部用另一套主题）；改完怎么验证。
   - 命令本身不改用户文件。

7. 2026-10-27：`upgrade` 只输出升级指引（用户确认）。
   - `astryx-vue upgrade`：读用户项目里 `@astryx-vue/core` 的版本，和最新版比，输出从当前版本升上去要做的事：每条破坏性改动写「变了什么、以前怎么写、现在怎么写、怎么改」，内容取自文档站升级指南（catalog 里那一份，不另写）。
   - 附上用户项目里可能命中的地方：用 grep 规则找 `labelHidden`、`enableEscape`、旧主题挂点名这类关键词，列出文件和行号，让 AI 助手或用户自己改。只读不写。
   - 已经是最新版时，说一句「不用升级」并给出 changelog 链接。

## D4b 范围（D4a 定稿）

- 已有命令补细节：`search` 排序与来源包、`docs --depth`、`build` 选起始模板、`component`/`composable`/`template`/`manifest` 对齐；`cli.ts` 拆到 500 行内；删掉已在上游删除的 `layout` 命令组（如果有）。
- 新增 `init`（第 3 条）、`theme`（第 6 条）、`upgrade`（第 7 条）、`doctor`（简单版：检查依赖版本对得上、样式表引了没有、主题设了没有，只报告不修改）。
- catalog 支持多个包、每条结果标明来源包（ADR 0001 第 7.3 节），给 F1c、F2c、F3f 用。
- 不做：`swizzle`、`gap-report`、`discover`、`integration`、`blog`。

## 待讨论

- 原版 142 篇指南里，我们文档站还缺哪些主题，要补进文档站。
