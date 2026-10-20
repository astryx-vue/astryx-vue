---
"@astryx-vue/cli": minor
---

新增 `template` 和 `build` 命令。`build "<想法>"` 用本地关键词打分给出最接近的页面模板、两个备选和要用的组件，中文按字符二元组匹配，不联网也不调模型；`template --list` / `template <slug>` / `--skeleton` 分别列出、查看和只看骨架，`template <slug> <path>` 把模板写进项目（`--overwrite` 或 `-f` 才覆盖），并把演练场的演示图片地址换成灰色占位图、列出项目缺的包，不自动安装、不复制资源。53 个模板里有 5 个引用了项目装不上的包，标为不可复制，能读不能拷。`search --type` 增加 `template`。`init` 增加 `--agent hermes`、`--agent all` 和 `--agent-docs-path`，不加 `--agent` 时优先复用项目已有的 agent 文件；注入的区块改成三步工作流（`build` 挑页面、`template` 复制、写代码前查 `component`/`composable`/`docs`）。文档改正了运行方式：装好后直接 `npx astryx-vue …` 或 `pnpm exec astryx-vue …`，临时用 `npx @astryx-vue/cli …`，脚本别名退为可选。
