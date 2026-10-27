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

组合式函数可写 `useClipboard` 或 `use-clipboard`。`component useClipboard` 也能查到，并多印一行指向 `composable` 命令。`component --list` 只列组件。`search --type` 接受 `component`、`composable`、`doc`、`template`；组合式函数命中的结果是 `domain: "composable"`，`command` 指向 `composable <Name>`。命中名字的结果排在只命中正文的结果前面。每条结果都标出来自哪个包；分数相同时按领域（组件、组合式函数、文档、模板）再按名字排序，跑两次顺序不会变。

`docs` 接受主题 id、把 `theme/` 换成 `themes/` 的写法，或能唯一匹配某个主题的裸名，例如 `dark-mode`。`--json` 返回 `docs.list` 或 `docs.detail`，`docs.detail` 里有整页 `body`。`--depth 2` 只留 `#` 和 `##`，更深的标题连同它下面的正文一起省掉，长页面因此读得下去；JSON 里的 `headings` 只列还在正文里的标题，`depth` 说明调用方要的是第几层。

## 主题

`theme` 列出内置的 7 套主题，每套带文档页自己的那句说明。`theme <名字>` 输出接入四步：引哪个样式表、`data-astryx-theme` 写什么、怎么换主题或同时用两套、改完怎么验证。这些文字来自主题自己的文档页和主题索引页，命令不写任何文件。

slug 和显示名都能用，`theme butter` 和 `theme Butter` 是同一个请求。`--json` 返回 `theme.list` 或 `theme.detail`，`theme.detail` 里带整页 `body`，供想要长文的助手读。

## 升级

`upgrade` 读项目 `package.json` 里 `@astryx-vue/core` 的版本，和这个 CLI 生成时对应的版本比，不联网。

- 比 CLI 旧：打印升级指南的每一节（变了什么、以前怎么写、现在怎么写、怎么改），再在项目自己的源码里找出指南里被替换掉的旧名字，列出文件和行号。主题挂点名只认对象键（`progressbar: {`），因为同一个词也是 HTML 标签；属性和选项名按单词认，camelCase 和 kebab-case 都算。
- 已经一样：说明不用升级，并给出更新日志链接。
- 没装，或版本写法读不出来：说明情况，并按项目包管理器给出安装命令（读不出包管理器就列全部写法）。

这两份内容都来自 `apps/docs/docs/{en,zh}/guide/migration.md`：小节就是页面的 `###` 小节，旧名字来自小节标题和页面里 `Removed | Use instead` 表格。

## 体检

`doctor` 报告五项检查，不改任何文件：

| 检查 | 什么时候失败或提醒 |
| --- | --- |
| `core-version` | 没装 `@astryx-vue/core`（失败）；版本写法读不出来，或比 CLI 的 catalog 旧/新（提醒） |
| `themes-installed` | 没有依赖 `@astryx-vue/themes`（失败） |
| `vue-version` | 没装 `vue`（失败）或低于 3.5.0（提醒） |
| `theme-stylesheet` | 没找到任何 `@astryx-vue/themes/*.css` 引入（失败），或文件名不是内置主题（提醒） |
| `theme-attribute` | 没找到 `data-astryx-theme`（提醒；Neutral 不写也能用） |

全部通过或只有提醒时退出码是 `0`，有失败时是 `1`，文本照样打印；`--json` 返回 `doctor.report`。只读项目目录里的源码，跳过 `node_modules`、构建产物和隐藏目录。

## 模板

`template --list` 列出全部 57 个演练场页面。目前 `--type` 只有 `page` 一种；`--type block` 会给一句说明，不报错。

每个模板都有一句手写说明和中英两套关键词，放在 `src/generate/template-meta/`，每类模板一个文件。组件清单从页面里 `@astryx-vue/core` 的 import 自动提取，不会和源码脱节。每条记录还带 `dependencies`：这个页面 import 了哪些 npm 包。可复制的模板只会有 `vue` 和 `@astryx-vue/core`，可复制模板若多引一个包，生成 catalog 时直接报错。所以 `template --list`、`template <slug>` 和它们的 `--json` 都能直接说清落地要装什么。

有些页面引用了用户项目装不上的包：5 个用 `@astryx-vue/playground-charts`（只存在于文档站演练场的路径别名）。这些标为 `isReady: false` 并写明原因。判断标准是页面真正执行的导入：只要非相对导入都是 `vue` 或 `@astryx-vue/core` 就算可复制；页面里展示的示例代码文本（例如 `@astryxdesign/core`）属于页面内容，不算导入。`--list` 和 `template <slug>` 照样能看，复制会被拒绝，报 `ERR_TEMPLATE_NOT_READY`。

`template <slug> <path>` 只写一个文件：

- 以文件名结尾的路径，或本身就指向一个文件的路径，就写这个文件；
- 其余都当作目录，写入 `<PascalCaseSlug>.vue`；
- 已存在的文件要加 `--overwrite`（或 `-f`）才覆盖，否则报 `ERR_FILE_EXISTS`；
- 越出项目目录的路径报 `ERR_PATH_TRAVERSAL`。

复制时会把演练场的 `/template-assets/…` 图片地址换成一个内联的灰色占位图，并报告替换了多少处，这样文件不依赖文档站也能渲染。它不复制任何资源文件，也不安装任何东西：只列出项目 `package.json` 里没有的包，再按锁文件对应的包管理器给一条安装命令。

`--skeleton` 只输出组件标签和布局属性：`gap`、`padding`、`width`、`maxWidth`、`height`、`columns`、`axis`、`justify`、`align`、`density`、`variant`、`hasDivider`，以及 `rowGap`/`columnGap`/`contentPadding`/`minHeight`。文字、布局以外的绑定、事件处理函数和原生 HTML 包裹层都会丢掉，所以用 `<div>` 定位置的页面看起来会比实际更平。骨架是结构参考，不是能直接编译的文件。

## build

`build "<想法>"` 在本地给模板打分：对 slug、标题、说明、关键词和页面用到的组件做字段加权关键词匹配，越少见的词权重越高。没有网络，没有模型，同一句话每次结果一样。中文按字符二元组匹配，不需要空格分词。

- `TEMPLATE` 是最接近的页面，`OTHER TEMPLATES` 是接下来两个。不能复制的页面只有在明显更贴合时才排到前面，并标出原因。
- `COMPONENTS`（最多 6 个）和 `COMPOSABLES`（最多 4 个）用的是 `search` 那套排序，两个命令不会互相矛盾。想法里点到的部件不够时，用推荐页面自己用到的组件补齐，并标出来源。
- 命中太弱的直接丢掉，不凑数。完全没命中时不给模板，并说明这一点。
- 不带想法时 `build` 打印工作流：先找模板，再复制，最后写代码前逐个查组件。

## JSON 信封

成功响应是 `{ apiVersion: 1, type, data }`。`template`、`build`、`docs` 的响应带 `package`，说明记录来自哪个包（模板是 `@astryx-vue/cli`，文档页是 `@astryx-vue/docs`）。`template.list`、`template.show`、`template.skeleton` 的每条模板记录在 `components` 旁边带 `dependencies`。`component.detail` 和 `composable.detail` 带所属的包；`component.list` 和 `composable.list` 的每一条各自带 `package`，因为一个列表可能横跨多个包。

| 类型 | 命令 |
| --- | --- |
| `template.list`、`template.show`、`template.skeleton`、`template.copy` | `template` |
| `build.help`、`build.kit` | `build` |
| `component.list`、`component.detail` | `component` |
| `composable.list`、`composable.detail` | `composable` |
| `docs.list`、`docs.detail` | `docs` |
| `search` | `search` |
| `manifest` | `manifest` |
| `theme.list`、`theme.detail` | `theme` |
| `upgrade.report` | `upgrade` |
| `doctor.report` | `doctor` |
| `init.run` | `init` |
| `help`、`version` | `--help`、`--version`，或带 `--json` 不带参数 |

退出码：成功 `0`，命令跑了但没成功 `1`，用法错误 `2`。分支判断请用信封里的 `code`，不要匹配消息文本。

| 错误码 | 什么时候出现 |
| --- | --- |
| `ERR_UNKNOWN_TEMPLATE` | 没有模板匹配这个 slug。会附带最多 5 个相近的 slug。 |
| `ERR_TEMPLATE_NOT_READY` | 模板引用了项目装不上的包。 |
| `ERR_FILE_EXISTS` | 目标文件已存在，且没加 `--overwrite`。 |
| `ERR_PATH_TRAVERSAL` | 目标路径越出了项目目录。 |
| `ERR_INVALID_ARGUMENT` | 两个模式混用、取值不在选项内，或想法是空白串。 |
| `ERR_UNKNOWN_COMPONENT`、`ERR_UNKNOWN_COMPOSABLE`、`ERR_UNKNOWN_TOPIC` | 没有记录匹配这个名字。 |
| `ERR_UNKNOWN_AGENT` | `--agent` 不是 `cursor`、`claude`、`codex`、`hermes` 或 `all`。 |
| `ERR_UNKNOWN_FEATURE` | `--features` 写了 `agents` 以外的东西。 |

`manifest --json` 按命令携带同一份错误码列表，agent 不用读这张表。

## agent 区块

`init` 先打印接入说明（装哪些包、canary 的带 `@canary`、主题样式引哪一行、语言怎么提供、改完怎么验证），再写入这个受管理区块：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

文件不存在就创建。已经有标记时，每次只替换区块内容，其余文字保持不动。文件存在但没有标记时，把区块追加到末尾。第二次运行仍然重写区块，不会因为标记已存在就跳过；生成内容一致时字节不变。

区块开头列一遍 catalog 覆盖的包，能发 canary 的标出来并写 `@canary`。然后写三步工作流（用 `build` 挑页面，用 `template` 复制，写代码前用 `component`/`composable`/`docs` 查），加上查询命令清单和怎么运行这个命令。它不会把组件目录贴进来。

接入说明里的安装命令跟着项目走：先看 `packageManager` 字段，再看 `pnpm-lock.yaml`、`yarn.lock`、`bun.lock(b)`、`package-lock.json`。两样都没有就把四种写法都列出来。`--features` 现在是可选的，写 `agents` 和不写一样，写别的仍然是 `ERR_UNKNOWN_FEATURE`。

写到哪里：

- 不加 `--agent`：项目里已经有的第一个 agent 文件，顺序是 `AGENTS.md`、`CLAUDE.md`、`.cursorrules`、`.hermes.md`、`HERMES.md`；都没有就写 `AGENTS.md`；
- `--agent cursor` 或 `--agent codex`：`AGENTS.md`；
- `--agent claude`：`CLAUDE.md`；
- `--agent hermes`：`.hermes.md`；项目里已有 `HERMES.md` 时写它；
- `--agent all`：已经存在的全部已知文件；一个都没有就写 `AGENTS.md`；
- `--agent-docs-path <file>`：就写这个文件，相对项目目录解析。缺的目录会自动创建，越出项目目录报 `ERR_PATH_TRAVERSAL`。

## 文本从哪来

CLI 不另存一份组件文档。`packages/cli/scripts/generate-catalog.mjs` 读：

- `apps/docs/components/demos/*/meta.ts`：名字、分组和顺序
- `apps/docs/docs/{en,zh}/components/<slug>/`：用法、props、插槽、事件和示例标题
- `apps/docs/components/demos/<slug>/*.vue`：那些页面指向的示例源码
- `apps/docs/components/demo-infra/reference/*.json`：anatomy 和无障碍信息
- `apps/docs/docs/{en,zh}/guide` 和 `themes`：搜索主题和正文，以及 `theme` 用的主题记录、`init` 用的安装命令和代码片段
- `apps/docs/docs/{en,zh}/guide/migration.md`：`upgrade` 打印的升级小节，和它去源码里找的旧名字
- `apps/docs/components/playground/pages/*.vue`：模板源码；`templateManifest.ts`：模板标题和分类
- 每个 `packages/*/package.json`：判断组件属于哪个包、版本和说明（`upgrade`/`doctor`/`init` 用）；页面里没写 import 时用它的 exports 推断

模板的说明和关键词是手写的，在 `packages/cli/src/generate/template-meta/`，每类模板一个文件，由 `template-meta.ts` 合并，属于源数据，不是生成物。

示例的标题和说明按语言各存一份，但示例代码两种语言只存一份：两个页面指向的是同一个 `.vue` 文件。以后要是一个页面改了代码、另一个没改，生成时直接报错并指出是哪个组件的第几个示例，不会让一种语言悄悄用上另一种的代码。取回某种语言的示例只走 `packages/cli/src/catalog.ts` 里的 `examplesFor()`。

结果提交在 `packages/cli/src/generated/catalog.json`。`pnpm --filter @astryx-vue/cli build` 会重新生成并打进 `dist`，也就是 npm 包实际运行的那份。文档或模板改过之后，重新生成并提交 diff：

```sh
pnpm --filter @astryx-vue/cli generate
```

`pnpm check` 会跑 `generate:check`。它会在这几种情况下失败：`catalog.json` 过期、某个包里有 PascalCase 导出没有任何组件文档引用、或者某个演练场页面在 `template-meta.ts` 里没有元数据。`./icons`、`./locale`、CSS 和包根不算组件导出。

`catalog.packages` 列出 catalog 覆盖的每个包（`core`、`themes`、`richtext`、`charts`、`lab`），带目录和「是否只发 canary」的标记。组件的 `package` 取「有它这个子路径导出的包」，没有就取「`src/` 里有它这个目录的包」。

`swizzle`、`discover`、`gap-report`、`integration`、`blog` 不在这个包里，也没有 MCP 服务。`theme`、`upgrade`、`doctor` 只输出指引和报告，都不改项目文件。

## 相关包

| 包 | 是什么 |
| --- | --- |
| `@astryx-vue/core` | 这个 CLI 记录的那些 Vue 组件 |
| `@astryx-vue/themes` | Neutral、Butter、Chocolate、Gothic、Matcha、Stone、Y2K |

## 在本仓库里试

```sh
pnpm --filter @astryx-vue/cli build
node packages/cli/bin/astryx-vue.mjs component Button
node packages/cli/bin/astryx-vue.mjs composable useClipboard
node packages/cli/bin/astryx-vue.mjs docs guide/dark-mode --dense
node packages/cli/bin/astryx-vue.mjs template --list
node packages/cli/bin/astryx-vue.mjs template login-card --skeleton
node packages/cli/bin/astryx-vue.mjs build "登录页"
node packages/cli/bin/astryx-vue.mjs search login --type template
node packages/cli/bin/astryx-vue.mjs manifest --json
```

## 许可

MIT。Astryx 版权归 Meta Platforms, Inc.。这个包是非官方实现，与 Meta 无关，也未获其背书。
