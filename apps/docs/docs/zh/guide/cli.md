---
title: 命令行
---

# 命令行

`@astryx-vue/cli` 用来在终端里查 astryx-vue 的组件文档和演练场页面，给人和 agent 用。二进制名字是 `astryx-vue`。它不是 Meta 的 `astryx`，也不提供 React 或 StyleX 的接口。

作为开发依赖安装：

```sh
pnpm add -D @astryx-vue/cli
```

包里声明了 `bin`，装完命令就在 `node_modules/.bin` 里，直接就能用：

```sh
pnpm exec astryx-vue component Button
npx astryx-vue search dialog --json
```

不安装、只想临时用时运行 `npx @astryx-vue/cli …`。scope 不能省：npm 上裸名 `astryx-vue` 不是这个包。

脚本别名是可选项，只有当 agent 的外壳没有把 `node_modules/.bin` 放进 `PATH` 时才需要：

```json
{
  "scripts": {
    "astryx-vue": "astryx-vue"
  }
}
```

```sh
npm run astryx-vue -- component Button
```

## 命令

`astryx-vue component --list` 列出文档里的组件。`astryx-vue component Button` 打印一个组件的用法、props、插槽、事件和示例。

`astryx-vue composable --list` 列出组合式函数，`astryx-vue composable useClipboard` 打印一个组合式函数的参数和返回值。Vue 里这类函数叫组合式函数（composable），所以命令、文案和文档里都不用 hook 这个词。`component useClipboard` 仍然能查到，并提示改用 `composable` 命令。

`astryx-vue docs` 列出指南和主题。`astryx-vue docs guide/dark-mode` 打印一篇正文，写成 `astryx-vue docs themes/tokens` 也可以。

`astryx-vue search dialog` 在组件、组合式函数、文档主题和页面模板里按相关度搜索。`--type` 可以限定为 `component`、`composable`、`doc` 或 `template`。`astryx-vue manifest --json` 说明命令、选项、响应类型、错误码和退出码。`astryx-vue init --features agents` 写入给 agent 看的上下文文件。

## 模板

`astryx-vue template --list` 列出 53 个演练场页面，按分类分组。目前所有模板都是页面；`--type block` 会给一句说明，不报错。

`astryx-vue template login-card` 打印一个模板的说明、用到的组件和源码。`--skeleton` 只打印布局骨架：组件标签加上 `gap`、`padding`、`columns` 这类布局属性，不含文字、事件处理函数和原生 HTML 包裹层。

`astryx-vue template login-card ./src/pages` 写出 `src/pages/LoginCard.vue`。以文件名结尾的路径就写那个文件。已存在的文件要加 `--overwrite`（或 `-f`）才覆盖，越出项目目录的路径会被拒绝。复制时会把演练场的演示图片地址换成一个内联的灰色占位图，并报告替换了多少处；它不复制资源文件，也不安装任何东西，只列出项目缺哪些包。

少数模板引用了用户项目装不上的东西，比如只存在于演练场的 `@astryx-vue/playground-charts` 别名。这些标为不可用：可以读，复制会被拒绝并说明原因。

## build

`astryx-vue build "<想法>"` 把一句话变成起点：最接近的页面模板、两个备选，以及要用的组件，每项都带下一步要跑的命令。组合式函数另列。

打分完全在本地、结果确定：对每个模板的 slug、标题、说明、关键词和组件做关键词匹配，越少见的词权重越高。没有网络请求，也没有模型。中文按字符二元组匹配，不需要空格分词。

不带想法运行时，`astryx-vue build` 打印工作流：先挑页面，再复制，最后写代码前逐个查组件。

## 参数

`--json` 在标准输出打印一份带类型的信封。`--dense` 把给人看的文本缩短；和 `--json` 一起用时忽略，信封仍是完整的。`--zh` 在文档有译文时输出简体中文。`--cwd` 是项目目录，`template` 和 `init` 只往这里面写。

模板的 `--json` 类型是 `template.list`、`template.show`、`template.skeleton`、`template.copy`；`build` 返回 `build.help` 和 `build.kit`。出错时信封里有错误码，例如 `ERR_UNKNOWN_TEMPLATE`、`ERR_TEMPLATE_NOT_READY`、`ERR_FILE_EXISTS`、`ERR_PATH_TRAVERSAL`。

## Agent 文件

项目里没有任何 agent 文件时，`init --features agents` 创建 `AGENTS.md`。不加 `--agent` 时会优先写项目已有的那个，顺序是 `AGENTS.md`、`CLAUDE.md`、`.cursorrules`、`.hermes.md`、`HERMES.md`。`--agent claude` 写 `CLAUDE.md`，`hermes` 写 `.hermes.md`（项目里已有 `HERMES.md` 时写它），`cursor` 和 `codex` 写 `AGENTS.md`，`all` 写所有已存在的已知文件。`--agent-docs-path <file>` 就写指定的那个文件。

命令只维护这两行标记之间的区块：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

每次运行都用新生成的文字替换这块。标记外面的文字保持不动。文件已经存在但没有这些标记时，把区块接到末尾。

区块里写的是三步工作流：用 `build` 挑页面，用 `template` 复制，写代码前用 `component`、`composable` 或 `docs` 查。它也说明怎么调用这个命令。

命令打印的句子来自这个文档站和演练场页面。文档或模板改过之后，要重新生成 CLI 包里的目录。维护者的步骤写在 `packages/cli` 的 README 里。

这一版不包括主题、升级、诊断和 MCP 命令。
