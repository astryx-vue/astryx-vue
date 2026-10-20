[English](./README.md) | 简体中文

# @astryx-vue/cli

给 [astryx-vue](https://github.com/astryx-vue/astryx-vue) 用的命令行。人和 agent 都可以用它查组件文档。这是 Astryx 的非官方 Vue 3 移植，与 Meta 没有隶属关系。

可执行文件名是 `astryx-vue`。这不是 Meta 的 CLI，也不提供裸命令 `astryx`。

说明：<https://astryx-vue.pages.dev/guide/cli>

```sh
pnpm add -D @astryx-vue/cli
```

## 脚本别名

建议在项目里加一个脚本，agent 就不用自己猜二进制路径：

```json
{
  "scripts": {
    "astryx-vue": "node node_modules/@astryx-vue/cli/bin/astryx-vue.mjs"
  }
}
```

```sh
npm run astryx-vue -- component Button
npm run astryx-vue -- composable useClipboard
npm run astryx-vue -- docs guide/dark-mode
npm run astryx-vue -- search dialog --json
npm run astryx-vue -- manifest --json
```

## 命令

| 命令 | 输出 |
| --- | --- |
| `astryx-vue component --list` | 列出文档里的全部组件 |
| `astryx-vue component <Name>` | 打印一个组件的用法、props、插槽、事件、示例和补充说明 |
| `astryx-vue composable --list` | 列出文档里的全部组合式函数 |
| `astryx-vue composable <Name>` | 打印一个组合式函数的参数、返回值、用法和示例 |
| `astryx-vue docs` | 列出全部指南和主题 |
| `astryx-vue docs <topic>` | 打印一篇正文，例如 `docs guide/dark-mode` 或 `docs themes/tokens` |
| `astryx-vue search <query>` | 按相关度搜索组件、组合式函数和文档主题 |
| `astryx-vue manifest --json` | 命令、选项、响应类型和退出码 |
| `astryx-vue init --features agents` | 创建或刷新 `AGENTS.md` 里的托管区块 |

全局参数：

| 参数 | 作用 |
| --- | --- |
| `--json` | 往 stdout 打类型化的包：`{ apiVersion, type, data }`。出错时是 `{ apiVersion, error, code, suggestions? }`，退出码非 0。 |
| `--dense` | 缩短给人看的文本。和 `--json` 一起用时忽略，JSON 始终是完整内容。 |
| `--zh` | 文档有简体中文时输出中文。 |
| `--cwd <dir>` | `init` 写入的目录。 |

组合式函数可以写 `useClipboard`，也可以写 `use-clipboard`。`component useClipboard` 仍然能查到，末尾会多一行提示，让你改用 `composable` 命令。`component --list` 只列组件。`search --type` 接受 `component`、`composable` 或 `doc`；组合式函数的结果 `domain` 是 `composable`，`command` 指向 `composable <Name>`。

`docs` 接受主题 id，也接受把 `theme/` 换成 `themes/` 的写法，或能唯一对上的短名字，例如 `dark-mode`。`--json` 返回 `docs.list` 或 `docs.detail`，`docs.detail` 里带正文 `body`。

`init` 可以用 `--agent cursor|claude|codex`。`cursor` 和 `codex` 写 `AGENTS.md`，`claude` 写 `CLAUDE.md`。不传时写 `AGENTS.md`。

退出码：`0` 成功，`1` 命令跑了但失败，`2` 用法不对。程序请判断 JSON 里的 `code`，不要依赖 `error` 的句子。

## Agent 区块

`init --features agents` 写入：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

文件不存在就创建。标记已经在，每次运行都只用新生成的内容替换标记中间的区块，外面的文字不动。文件在但没有标记，就把区块接到末尾。再跑一次仍然重写这块，不会因为标记已经存在就跳过。生成结果和原来一样时，文件字节不变。

区块里只说明怎么用 CLI 查组件，不会把整份组件目录贴进去。

## 文字从哪来

CLI 不另写一套组件说明。`packages/cli/scripts/generate-catalog.mjs` 读取：

- `apps/docs/components/demos/*/meta.ts`：名称、分组和顺序
- `apps/docs/docs/{en,zh}/components/<slug>/`：用法、props、插槽、事件和示例标题
- `apps/docs/components/demos/<slug>/*.vue`：页面对应的示例源码
- `apps/docs/components/demo-infra/reference/*.json`：结构和无障碍要求
- `apps/docs/docs/{en,zh}/guide` 与 `themes`：搜索用的主题，以及主题正文
- 页面里没有 import 时，再用 `packages/core/package.json` 的 exports

生成结果提交在 `packages/cli/src/generated/catalog.json`。`pnpm --filter @astryx-vue/cli build` 会重新生成，并打进 `dist`。发布出去的包跑的就是这份。文档改了之后重新生成并提交：

```sh
pnpm --filter @astryx-vue/cli generate
```

`pnpm check` 会跑 `generate:check`。`catalog.json` 过期会失败。`@astryx-vue/core` 里大写开头的导出没有被任何已文档化的组件 import，也会失败。`./icons`、`./locale`、CSS 和包根不算组件导出。

这个包不做 theme、template、upgrade、doctor、swizzle 和 MCP。

## 相关的包

| 包 | 是什么 |
| --- | --- |
| `@astryx-vue/core` | 这份 CLI 所说明的 Vue 组件 |
| `@astryx-vue/themes` | Neutral、Butter、Chocolate、Gothic、Matcha、Stone、Y2K |

## 在本仓库里试

```sh
pnpm --filter @astryx-vue/cli build
node packages/cli/bin/astryx-vue.mjs component Button
node packages/cli/bin/astryx-vue.mjs composable useClipboard
node packages/cli/bin/astryx-vue.mjs docs guide/dark-mode --dense
node packages/cli/bin/astryx-vue.mjs search installation --type doc
node packages/cli/bin/astryx-vue.mjs manifest --json
```

## 许可证

MIT。Astryx 的版权属于 Meta Platforms, Inc.。这个包是非官方移植，与 Meta 没有隶属或背书关系。
