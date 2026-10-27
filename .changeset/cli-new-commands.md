---
"@astryx-vue/cli": minor
---

新增 `init`、`theme`、`upgrade`、`doctor` 四个命令，四个都只输出指引、不改项目文件；只有 `init` 会维护 `AGENTS.md`（或 `CLAUDE.md`、`.hermes.md`）里两个标记之间那一段属于我们的内容，标记之外的文字原样保留。

- `init`：打印接入说明——要装哪些包、主题样式引哪一行、语言怎么提供、改完怎么验证；安装命令按项目实际用的包管理器写（`packageManager` 字段 → 锁文件，都没有就列出四种写法），然后刷新 agent 文件里的受管理区块。
- `theme`：不带参数列出全部主题，每个一行说明；`theme <名字>` 输出这套主题的完整接入说明（引哪个样式表、`data-astryx-theme` 写什么、怎么换主题或局部并用、改完怎么验证）。
- `upgrade`：读项目里 `@astryx-vue/core` 的版本，比这个 CLI 认的版本旧，就逐条列出要做的改动（变了什么、以前怎么写、现在怎么写），再在项目源码里找出可能要改的文件和行号；已经是最新就说不用升级。只读，不联网。
- `doctor`：检查 core 装没装、版本对不对，themes 装没装，vue 是否 3.5 以上，主题样式表引了没有，`data-astryx-theme` 设了没有。只报告，有失败时退出码为 1。

catalog 现在收多个包，`search` 的每条结果和 `component --list` 都会标出这个组件来自哪个包。`docs <主题> --depth <n>` 按标题层级截断（`--depth 2` 保留 `#` 和 `##`，更深的整段连同正文一起去掉），代码块里的 `#` 不会被当成标题。`template` 的输出会写明每个模板要装哪些依赖：可复制的模板只用 `vue` 和 `@astryx-vue/core`，`--list` 页脚直接说明「不用再装别的包」，详情、`--skeleton` 和 `--json` 也各带一份依赖列表。

还没发布到 npm 的包（`richtext`、`lab`、`charts`）不会再被写成安装命令：`init` 和 `AGENTS.md` 区块里照样列名字，但会注明「还没发布到 npm」，不会给你一条 `pnpm add` 一个装不到的包的命令。
