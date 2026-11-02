# @astryx-vue/cli

## 0.4.2

### Patch Changes

- [#277](https://github.com/astryx-vue/astryx-vue/pull/277) [`f779be6`](https://github.com/astryx-vue/astryx-vue/commit/f779be63cd21778a9d6d66be8b2c2772c6614194) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 更新内置文档与页面模板目录，补充 Charts 和 Lab 内容，同步近期表单、Dialog Wizard 等模板修复及各包最新发布信息。

## 0.4.1

### Patch Changes

- 命令行的组件目录补上了富文本（`@astryx-vue/richtext`）的文档页，`init` 现在把它当作已发布的包列出，并给出安装命令。目录生成时会跳过页面顶部的提示块（`::: warning`），摘要取正文第一段。

## 0.4.0

### Minor Changes

- [#230](https://github.com/astryx-vue/astryx-vue/pull/230) [`00def81`](https://github.com/astryx-vue/astryx-vue/commit/00def81329ff0f4fbe0882d83f23c94a95bd999b) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `init`、`theme`、`upgrade`、`doctor` 四个命令，四个都只输出指引、不改项目文件；只有 `init` 会维护 `AGENTS.md`（或 `CLAUDE.md`、`.hermes.md`）里两个标记之间那一段属于我们的内容，标记之外的文字原样保留。
  
  - `init`：打印接入说明——要装哪些包、主题样式引哪一行、语言怎么提供、改完怎么验证；安装命令按项目实际用的包管理器写（`packageManager` 字段 → 锁文件，都没有就列出四种写法），然后刷新 agent 文件里的受管理区块。
  - `theme`：不带参数列出全部主题，每个一行说明；`theme <名字>` 输出这套主题的完整接入说明（引哪个样式表、`data-astryx-theme` 写什么、怎么换主题或局部并用、改完怎么验证）。
  - `upgrade`：读项目里 `@astryx-vue/core` 的版本，比这个 CLI 认的版本旧，就逐条列出要做的改动（变了什么、以前怎么写、现在怎么写），再在项目源码里找出可能要改的文件和行号；已经是最新就说不用升级。只读，不联网。
  - `doctor`：检查 core 装没装、版本对不对，themes 装没装，vue 是否 3.5 以上，主题样式表引了没有，`data-astryx-theme` 设了没有。只报告，有失败时退出码为 1。
  
  catalog 现在收多个包，`search` 的每条结果和 `component --list` 都会标出这个组件来自哪个包。`docs <主题> --depth <n>` 按标题层级截断（`--depth 2` 保留 `#` 和 `##`，更深的整段连同正文一起去掉），代码块里的 `#` 不会被当成标题。`template` 的输出会写明每个模板要装哪些依赖：可复制的模板只用 `vue` 和 `@astryx-vue/core`，`--list` 页脚直接说明「不用再装别的包」，详情、`--skeleton` 和 `--json` 也各带一份依赖列表。
  
  还没发布到 npm 的包（`richtext`、`lab`、`charts`）不会再被写成安装命令：`init` 和 `AGENTS.md` 区块里照样列名字，但会注明「还没发布到 npm」，不会给你一条 `pnpm add` 一个装不到的包的命令。

## 0.3.0

### Minor Changes

- [#120](https://github.com/astryx-vue/astryx-vue/pull/120) [`b203932`](https://github.com/astryx-vue/astryx-vue/commit/b203932ccd4bf48daf72d5c365a7eaf488499dfe) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `template` 和 `build` 命令。`build "<想法>"` 用本地关键词打分给出最接近的页面模板、两个备选和要用的组件，中文按字符二元组匹配，不联网也不调模型；`template --list` / `template <slug>` / `--skeleton` 分别列出、查看和只看骨架，`template <slug> <path>` 把模板写进项目（`--overwrite` 或 `-f` 才覆盖），并把演练场的演示图片地址换成灰色占位图、列出项目缺的包，不自动安装、不复制资源。53 个模板里有 5 个引用了项目装不上的包，标为不可复制，能读不能拷。`search --type` 增加 `template`。`init` 增加 `--agent hermes`、`--agent all` 和 `--agent-docs-path`，不加 `--agent` 时优先复用项目已有的 agent 文件；注入的区块改成三步工作流（`build` 挑页面、`template` 复制、写代码前查 `component`/`composable`/`docs`）。文档改正了运行方式：装好后直接 `npx astryx-vue …` 或 `pnpm exec astryx-vue …`，临时用 `npx @astryx-vue/cli …`，脚本别名退为可选。

### Patch Changes

- [#121](https://github.com/astryx-vue/astryx-vue/pull/121) [`4af177f`](https://github.com/astryx-vue/astryx-vue/commit/4af177f65ef47145f1de6736a76008d844be1772) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 安装包变小：catalog 里的示例代码只存一份（中英文共用同一份），命令输出和 `--json` 结构完全不变。

## 0.2.0

### Minor Changes

- [#115](https://github.com/astryx-vue/astryx-vue/pull/115) [`958c17b`](https://github.com/astryx-vue/astryx-vue/commit/958c17bd66db35b01a5d535943168789853bc128) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 `composable` 和 `docs` 命令。`composable --list` 和 `composable <Name>` 查组合式函数，详情带参数、返回值和示例；`component --list` 不再混进组合式函数，`component useClipboard` 仍能查到并提示改用新命令。`docs` 列出全部指南和主题，`docs <topic>` 打印正文，接受 `guide/dark-mode`、`themes/tokens` 或唯一的短名字。`search` 把组合式函数单列为 `composable` 域，`--type` 可选 `component`、`composable`、`doc`。未知名字返回 `ERR_UNKNOWN_COMPOSABLE` 或 `ERR_UNKNOWN_TOPIC`，并带上相近的名字。

### Patch Changes

- [#84](https://github.com/astryx-vue/astryx-vue/pull/84) [`f9df031`](https://github.com/astryx-vue/astryx-vue/commit/f9df031010746d5c0b349d269e0a42d40de8e3fe) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 组件说明跟文档站用同一份来源。目录补上示例源码，嵌套的 props、插槽和事件表也会收进来。`pnpm check` 在目录过期，或 core 的组件导出没有文档时失败。

## 0.1.0

### Minor Changes

- [#79](https://github.com/astryx-vue/astryx-vue/pull/79) [`c076bea`](https://github.com/astryx-vue/astryx-vue/commit/c076bea16198312e3a151d045842664f87eecd0e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Add `@astryx-vue/cli` (`astryx-vue`) for component docs, search, a capability manifest, and `init --features agents`. The command text is generated from the docs site, not a second copy.
  
  `init --features agents` rewrites the managed block on every run and leaves text outside the markers in place.
