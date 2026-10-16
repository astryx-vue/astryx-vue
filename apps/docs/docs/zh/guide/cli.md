---
title: 命令行
---

# 命令行

`@astryx-vue/cli` 用来在终端里查 astryx-vue 的组件文档，给人和 agent 用。二进制名字是 `astryx-vue`。它不是 Meta 的 `astryx`，也不提供 React 或 StyleX 的接口。

作为开发依赖安装：

```sh
pnpm add -D @astryx-vue/cli
```

```sh
npm install -D @astryx-vue/cli
```

```sh
yarn add -D @astryx-vue/cli
```

建议在项目里加一个脚本，这样路径是固定的：

```json
{
  "scripts": {
    "astryx-vue": "node node_modules/@astryx-vue/cli/bin/astryx-vue.mjs"
  }
}
```

```sh
npm run astryx-vue -- component Button
```

## 命令

`astryx-vue component --list` 列出文档里的组件。`astryx-vue component Button` 打印一个组件的用法、props、插槽和事件。`astryx-vue search dialog` 在组件和指南里按相关度搜索。`astryx-vue manifest --json` 说明命令、选项、响应类型和退出码。`astryx-vue init --features agents` 写入给 agent 看的上下文文件。

## 参数

`--json` 在标准输出打印一份带类型的信封。`--dense` 把给人看的文本缩短；和 `--json` 一起用时忽略，信封仍是完整的。`--zh` 在文档有译文时输出简体中文。`--cwd` 是 `init` 写入的目录。

## Agent 文件

`init --features agents` 在文件不存在时创建 `AGENTS.md`。`--agent claude` 写 `CLAUDE.md`。`cursor` 和 `codex` 写 `AGENTS.md`。

命令只维护这两行标记之间的区块：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

每次运行都用新生成的文字替换这块。标记外面的文字保持不动。文件已经存在但没有这些标记时，把区块接到末尾。

命令打印的句子来自这个文档站。文档改过之后，要重新生成 CLI 包里的目录。维护者的步骤写在 `packages/cli` 的 README 里。

这一版不包括主题、模板、升级、诊断和 MCP 命令。
