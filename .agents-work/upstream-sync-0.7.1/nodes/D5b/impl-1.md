# D5b 页面模板接入 CLI · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D5b`，分支 `sync/d5b-cli-templates`，槽位 2，端口 5172。只在本地提交，没有推送。
- 提交（基于 `995185ab`）：
  - `fbd9ae45` feat(cli): 模板记录带上要装的包，命令输出说清只依赖 vue 和 core
  - `1ae50023` refactor(cli): 把「可复制模板只能依赖 vue 和 core」抽成可以单测的判断
- 计划：`nodes/D5b/plan.md`。这个节点的绝大部分能力在 D5a + D4b 已经落地（57 个模板进 catalog、`template` 的 list/show/skeleton/copy、`search --type template`），本轮补的是**「模板要装什么」这件事说清楚并锁住**。

## 1. 做了什么

1. **catalog 每条模板记录多一个 `dependencies`**（`catalog-types.ts` + `generate/build-templates.ts`）
   - 从模板源码的 `import` 里读，跳过相对路径和 `node:`，取包根名（`@astryx-vue/core/Button` → `@astryx-vue/core`），排序去重。
   - 复用原来的 `analyzeTemplateImports`：它本来就在解析同一批 import（组件名、外来包），现在多返回一个 `packages`，没有第二套正则。
2. **生成期锁住「可复制模板只用两个包」**（`generate/build-templates.ts`）
   - 新增 `TEMPLATE_RUNTIME_PACKAGES = ['@astryx-vue/core', 'vue']` 和 `unexpectedDependencies()`。
   - `isReady` 的模板如果依赖超出这两个包（比如引了 `@astryx-vue/lab`），生成 catalog 直接报错并点名模板和多余的包，提示「要么在 `template-meta.ts` 里标未就绪，要么去掉这个 import」。这样「复制下来就能跑」不是文档里的一句话，是生成期的断言。
3. **命令输出说清依赖**
   - `template --list` 页脚：`Every ready template runs on vue and @astryx-vue/core alone, so there is nothing else to install.`（中文：`可复制的模板只用 vue 和 @astryx-vue/core，不用再装别的包。`）
   - `template <slug>` / `--skeleton` / `--dense`：加一行 `Dependencies: vue, @astryx-vue/core (nothing else to install)`，未就绪的模板如实列出第三个包、不带括号后半句。
   - `template.list` / `template.show` / `template.skeleton` 的 JSON 每条都多一个 `dependencies` 数组。
   - `spec.ts` 里 `template` 的 summary 和 `--list` 说明跟着改。
4. **文档**：`apps/docs/docs/{en,zh}/guide/cli.md` 的「53 个模板」改成 57（D5a 补到 57 后没跟着改），并写明可复制模板只依赖两个包；`packages/cli/README.md`、`README.zh-CN.md` 补 `dependencies` 字段和它的来路。
5. **重新生成 catalog**（`pnpm --filter @astryx-vue/cli generate`）：57 条模板记录都带上 `dependencies`。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/cli/src/catalog-types.ts` | 210 | `TemplateRecord` 加 `dependencies` 字段与注释 |
| `packages/cli/src/generate/build-templates.ts` | 168 | 读依赖、生成期断言、`unexpectedDependencies()` |
| `packages/cli/src/commands/template.ts` | 112 | 三个 JSON 响应带上 `dependencies` |
| `packages/cli/src/format.ts` | 425 | 列表页脚、详情/骨架/`--dense` 的依赖行 |
| `packages/cli/src/spec.ts` | 331 | `template` 的命令说明 |
| `packages/cli/src/templates.test.ts` | 404 | 依赖字段、列表页脚、详情行、JSON、中英 |
| `packages/cli/src/generate/build-catalog.test.ts` | 75 | `packages` 返回值与新判断的单测 |
| `packages/cli/src/generated/catalog.json` | 生成物 | 57 条模板多 `dependencies` |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 模板清单对外提供（`template.list`） | 每条带 `id`、`name`、`displayName`、`description`、`type`、`package`、`category`、`componentsUsed`、`isReady` | 每条带 `slug`（就是模板 id，也是命令参数）、`title`、`description`、`category`、`kind`、`package`、`componentsUsed`、`dependencies`、`isReady`、`command`、`docsUrl` | 上游的 `id`/`name` 在我们这里合成一个 `slug`（D4a 定的命令形态），读者照样能一眼认出并直接拿去跑命令 |
| 上游 `template.list` 讲来源包 | 带 `package` | 带 `package: @astryx-vue/cli`，模板由 CLI 自带 | 一样：读者知道不用额外装模板包 |
| 上游 `template.show` 讲缺什么包 | 复制成功后才在 receipt 里报 `missingPackages`（依赖项目 `package.json`） | 读的时候就说 `dependencies`（依赖清单本身），复制时仍然照旧报项目缺哪些包 | 上游是「写完后告诉你缺什么」，我们是「写之前就知道要什么」，信息不丢且更早 |
| 上游 `--cdn` 起始页 | 单独写一个免构建页 | 不做（D4a 定稿的 `template` 范围里没有 `--cdn`） | 不在本节点范围 |
| 上游 blocks 模板 | 57 页 + 数千 block | 只有 57 个 page 模板；`--type block` 给一句说明 | 我们没移植 block，行为上说清楚而不是报错 |

## 3. 和计划不一样的地方

1. **计划里写「`template --list` 的 JSON 带上依赖说明」，实际是小写字段名 `dependencies`**（数组），没有在 JSON 里塞一句话：机器读数组更稳，人也读得到文本页脚。
2. **计划里打算「生成期断言」只写在生成流程里，实际把它抽成了 `unexpectedDependencies()`**，因为不抽出来就没法单测（`buildTemplates` 要读整个真仓库的 57 个页面文件，构造夹具代价太大）。
3. **`template --dense` 也带了依赖行**（计划只写详情和骨架）。`--dense` 本来就是「短一点」，一行几十字节不影响它比完整输出更短。

## 4. 台账处理

`ledger/D5.md` 125 条里没有一条单独指向本节点的命令行行为（D5a 做完时把模板内容条目都处理了，纯命令行的部分已在 D4b 的台账处理里收口），本轮没有新增台账结论。

## 5. 自测结果

真实命令都在 `/tmp/d5b-demo`（`package.json` 只有 `@astryx-vue/core` 和 `vue`，有 `pnpm-lock.yaml`）里跑，用的是 `packages/cli/bin/astryx-vue.mjs`（先 `pnpm --filter @astryx-vue/cli build`）。

```
$ node bin/astryx-vue.mjs template --list | sed -n '1,8p'
Theme
  theme-showcase  Theme Showcase — A sampler page that shows tokens, colors, typography, inputs, and cards under the active theme.

AI Chat
  ai-chat  AI Chat Conversation — An AI conversation screen with a message transcript, streaming answers, tool calls, code blocks, and a composer.
  ai-chat-landing  AI Chat Landing — A landing page with a headline and a prompt box that starts an AI chat.

Content
...
$ node bin/astryx-vue.mjs template --list | tail -3

Every ready template runs on vue and @astryx-vue/core alone, so there is nothing else to install.
8 template(s) are marked not ready: they import a package a project cannot install, so they can be read but not copied. `astryx-vue template <slug>` says why.
```

```
$ node bin/astryx-vue.mjs template login | sed -n '1,12p'
# Basic Login

login  page  Login

A minimal centered sign-in form: email, password, and a submit button, and nothing else on the page.

Docs: https://astryx-vue.pages.dev/en/playground/?template=login
Status: ready to copy
Dependencies: vue, @astryx-vue/core (nothing else to install)

Components: Banner, Button, Card, Center, Heading, Icon, Text, TextInput, VStack
```

```
$ node bin/astryx-vue.mjs template login --zh | sed -n '7,9p'
状态：可复制
依赖：vue、@astryx-vue/core（不用再装别的包）
```

```
$ node bin/astryx-vue.mjs template dashboard-alert-rail | sed -n '7,9p'
Status: not copyable — It imports @astryx-vue/playground-charts, which exists only inside the docs playground and is not a published package.
Dependencies: vue, @astryx-vue/core, @astryx-vue/playground-charts
```

```
$ node bin/astryx-vue.mjs template login --skeleton | sed -n '5,6p'
Components: Banner, Button, Card, Center, Heading, Icon, Text, TextInput, VStack
Dependencies: vue, @astryx-vue/core (nothing else to install)
```

```
$ node bin/astryx-vue.mjs --json template login | head -c 700
{"apiVersion":1,"type":"template.show","package":"@astryx-vue/cli","data":{"slug":"login",...,"componentsUsed":["Banner","Button","Card","Center","Heading","Icon","Text","TextInput","VStack"],"dependencies":["@astryx-vue/core","vue"],"isReady":true,...
```

```
$ node bin/astryx-vue.mjs search login --type template
Results for "login" (4)

[template] login  @astryx-vue/cli
  A minimal centered sign-in form: email, password, and a submit button, and nothing else on the page.
  → astryx-vue template login
[template] login-card  @astryx-vue/cli
  A sign-in card with email, password, SSO buttons, and a sign-up link.
  → astryx-vue template login-card
[template] login-split  @astryx-vue/cli
  A split-screen login with the form on one side and brand imagery on the other.
  → astryx-vue template login-split
[template] login-sso  @astryx-vue/cli
  An SSO login with provider buttons, an email fallback, and a marketing side panel.
  → astryx-vue template login-sso
```

```
$ node bin/astryx-vue.mjs template login ./src/pages
Wrote src/pages/Login.vue
$ find . -type f | sort
./package.json
./pnpm-lock.yaml
./src/pages/Login.vue
```

只读检查：跑 `template --list`、`template login`、`search login --type template` 前后逐文件比字节数，
差异只有上面那次 copy 写出的 `Login.vue`。

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2`（全仓） | 过 | 379 个文件、5211 条通过、7 todo |
| 2 | `NODE_ENV=production pnpm exec vitest run --maxWorkers=2`（全仓） | 过 | 379 个文件、5211 条通过、7 todo，和上一条相同 |
| 3 | `pnpm exec eslint . --max-warnings 0` | 过 | 退出码 0，无输出 |
| 4 | `env -u NODE_ENV pnpm check:packages` | 过 | 包边界、路径大小写、`catalog is up to date (245 components, 36 topics, 57 templates)`、500 行、`!important`、模板变量、i18n 全过 |
| 5 | `pnpm --filter @astryx-vue/cli generate` 后工作区 | 过 | `git status --short` 空 |
| 6 | `env -u NODE_ENV pnpm check:templates`（验收标准「生成的模板能直接跑」） | 过 | `✓ 49 个模板落地后 vue-tsc --noEmit 通过`，跳过 8 个 `isReady=false`（5 个引 `@astryx-vue/playground-charts`，3 个原版标未完成） |
| 7 | 行数 | 过 | 改过的源码最大 `format.ts` 425 行、`templates.test.ts` 404 行，都在 500 行内 |

## 6. 拿不准的地方

1. **「catalog 收录模板的 id」字段名**：任务描述写的是 `id`，仓库里一直是 `slug`（也是命令参数、JSON 字段、README 和测试里用的名字）。我保留了 `slug`，没有再造一个恒等于它的 `id`（两份真值容易走岔）。如果确实要 `id`，建议上游命名对齐时一次性改，别在 JSON 里同时出现两个。
2. **生成期断言的口径**：`isReady` 的模板只要多引一个可安装包（比如 `@astryx-vue/lab`）就让 `generate` 失败。另一种做法是自动把它降级成 `isReady: false` 并写原因，但那样「为什么用户装了 lab 还是不让复制」会变得难解释。现在这条报错文案直接告诉维护者两条出路。
3. **`build` 的输出没有带依赖信息**。它只推荐模板和组件，下一步命令是 `template <slug>`，依赖会在那一步说。如果希望 `build` 一步就把「要装什么」讲完，加一行即可，但会让 `build` 的输出变长。
4. **`search` 的模板命中没有 `dependencies`**（其它字段都齐）。加的话要给 `SearchHit` 添一个只有模板才有的字段，类型上会变得不整齐，是否值得请总控定。
