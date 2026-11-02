[English](./README.md) | 简体中文

# @astryx-vue/cli

面向 agent 的查询工具，服务 [astryx-vue](https://github.com/astryx-vue/astryx-vue)——Astryx 的非官方 Vue 3 实现。与 Meta 无关。

命令名是 `astryx-vue`。它不是 Meta 的 CLI，也不提供裸命令 `astryx`。

说明页：<https://astryx-vue.pages.dev/guide/cli>

```sh
pnpm add -D @astryx-vue/cli
```

## 怎么运行

包里声明了 `bin`，装完命令就在 `node_modules/.bin` 里，直接用：

```sh
npx astryx-vue component Button
pnpm exec astryx-vue search dialog --json
npx astryx-vue manifest --json
```

不安装、只想临时用，运行 `npx @astryx-vue/cli …`。scope 不能省：npm 上裸名 `astryx-vue` 不是这个包，在没装过的机器上 `npx astryx-vue` 会失败，而且这个名字将来也可能被别人占用。

脚本别名是可选项。只有当 agent 的外壳没有把 `node_modules/.bin` 放进 `PATH` 时才有用：

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

| 命令 | 输出 |
| --- | --- |
| `astryx-vue build "<想法>"` | 最接近的页面模板、两个备选，以及要用的组件 |
| `astryx-vue template --list` | 全部页面模板，按分类分组，标出项目装不上的那些 |
| `astryx-vue template <slug>` | 一个模板的说明、组件和源码 |
| `astryx-vue template <slug> --skeleton` | 只输出骨架：组件标签和布局属性 |
| `astryx-vue template <slug> <path>` | 把模板写到文件，或写到目录下的 `<Name>.vue` |
| `astryx-vue component --list` | 全部有文档的组件 |
| `astryx-vue component <Name>` | 一个组件的用法、props、插槽、事件、示例和备注 |
| `astryx-vue composable --list` | 全部有文档的组合式函数，即 `use*` 函数 |
| `astryx-vue composable <Name>` | 一个组合式函数的参数、返回值、用法和示例 |
| `astryx-vue docs` | 全部指南和主题 |
| `astryx-vue docs <topic>` | 一篇正文，例如 `docs guide/dark-mode` 或 `docs themes/tokens` |
| `astryx-vue docs <topic> --depth <n>` | 同一篇正文，只留到第 n 层标题 |
| `astryx-vue search <query>` | 排好序的组件、组合式函数、文档主题和模板 |
| `astryx-vue manifest --json` | 命令、选项、响应类型、错误码和退出码 |
| `astryx-vue theme` | 全部内置主题，一行一个 |
| `astryx-vue theme <名字>` | 一套主题的接入四步：样式、`data-astryx-theme`、切换与局部使用、验证 |
| `astryx-vue upgrade` | 把项目里的 `@astryx-vue/core` 升上来要做什么，以及旧名字还出现在哪 |
| `astryx-vue doctor` | 检查版本、主题样式有没有引、主题有没有设。只报告 |
| `astryx-vue init` | 给 AI 助手的接入说明，外加 agent 文件里的受管理区块 |

全局选项：

| 选项 | 作用 |
| --- | --- |
| `--json` | 在 stdout 输出类型化信封 `{ apiVersion, type, data }`。出错时是 `{ apiVersion, error, code, suggestions? }`，退出码非 0。 |
| `--dense` | 缩短给人看的文本。和 `--json` 一起时忽略，信封始终完整。 |
| `--zh` | 文档有中文版时用简体中文。 |
| `--cwd <dir>` | 项目目录，默认当前工作目录；`template` 和 `init` 只往这里面写，`upgrade` 和 `doctor` 只在这里读。 |


## 完整文档

命令的完整说明——JSON 信封、错误码、模板规则、`init` 区块规则、维护者步骤——都在文档站：<https://astryx-vue.pages.dev/guide/cli>。这份正文只在文档站维护，包里的 README 故意保持简短。

## 在代码里调用

```ts
import { assertResponse, runCli } from '@astryx-vue/cli'

const result = await runCli(['search', 'dialog', '--json'], { cwd: process.cwd() })
const found = assertResponse(result.stdout, 'search')
```

`runCli` 收的参数和命令行一致，返回 `{ exitCode, stdout, stderr }`。`assertResponse` 按你要的类型校验信封。

## 参与开发

文本从哪来、怎么重新生成目录、怎么在本仓库里直接跑这个命令，见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可

MIT。Astryx 版权归 Meta Platforms, Inc.。这个包是非官方实现，与 Meta 无关，也未获其背书。
