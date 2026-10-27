# G2 发布 CLI 0.4.0 · 准备回报

- 工作区 `/Users/shenqingchuan/workspace/astryx-vue-wt/G2`，分支 `release/cli-0.4.0-prep`，基于 `swarm-tree`（`4679af58`，与 `origin/main`、`origin/swarm-tree` 同一提交）。
- 计划与判断：`nodes/G2/plan.md`。

## 1. 改了什么

### 1.1 发版前的那个坑：CLI 会推荐装不到的包

`npm view` 实查（2026-10-27）：`core` 0.4.1、`themes` 0.4.1、`cli` 0.3.0 在 npm 上；`richtext`、`lab`、`charts` **全部 404**（`lab`、`charts` 连 canary 都没发过）。

改动前 `init` 的输出（真跑出来的）：

```
Install on demand (canary packages take the tag):

  pnpm add @astryx-vue/charts@canary
  pnpm add @astryx-vue/lab@canary
  pnpm add @astryx-vue/richtext
```

这三条今天都会 404，`AGENTS.md` 区块里也写着同样的包名。判断和做法写在 `plan.md` 第 1 步，简单说：

- `published` 的唯一真值取 `package.json` 的 `private`：npm 不收 private 包，发版脚本也只收非 private 的包，所以「能不能装」不需要另写一份名单，richtext 将来去掉 `private` 就自动变成可安装。
- `canary` 只回答「发布时带哪个 tag」，只有 `published` 为真时才写成 `@canary`；未发布就不产安装命令。
- 未发布的包**照旧列名字**（读者要知道它存在），但注明「还没发布到 npm」。
- `installablePackageNames()`（判断模板能不能复制）同步只收已发布的包。
- `doctor` 不用改，它只查 core / themes / vue；加测试钉住它不点名任何未发布的包。

改完的输出（打包后的二进制实跑，见第 3 节）：

```
Not on npm yet, so there is nothing to install:

  @astryx-vue/charts — when it ships it will be canary only, so it takes the `@canary` tag
  @astryx-vue/lab — when it ships it will be canary only, so it takes the `@canary` tag
  @astryx-vue/richtext — no version is on npm, and none is scheduled
```

`lab`、`charts` 的 `description` 从「Published to npm only under the canary dist-tag」改成「Ships only under the canary dist-tag」，不再暗示已经发过（原来那句子会和「还没发布」自相矛盾）。

### 1.2 顺手补的两处发布缺陷

- `astryx-vue --help` 是手写的命令清单，`theme`、`upgrade`、`doctor` 三个新命令不在上面，`init` 那行还写着必须带 `--features agents`。补上，并加测试：`COMMANDS` 里的每个命令都必须出现在这张屏上。
- `packages/cli` 没有 `LICENSE`（core、themes 都有），打出来的 tarball 里就没有许可证文件。补上同一份 MIT 文本，`npm pack` 现在带 7 个文件。

### 1.3 文件清单

| 文件 | 改动 |
| --- | --- |
| `packages/cli/src/generate/packages.ts` | 读 `private` 字段，`WorkspacePackage.published`；`installablePackageNames()` 只收已发布的包 |
| `packages/cli/src/catalog-types.ts` | `CatalogPackage.published` |
| `packages/cli/src/generate/build-catalog.ts` | 把 `published` 写进 catalog |
| `packages/cli/src/commands/init.ts` | `InitPackage.published`，`specifier` 可为 null，未发布包不给安装命令 |
| `packages/cli/src/format-init.ts` | 包列表写「还没发布」；「按需安装」只列能装的，未发布的单独一段写名字加原因 |
| `packages/cli/src/agents.ts` | `AGENTS.md` 区块：未发布包给名字 + 「还没发布到 npm，装不到」，不给 `@canary` 安装写法和安装命令 |
| `packages/cli/src/cli/help.ts` | `--help` 补 theme / upgrade / doctor，`init [--features agents]` |
| `packages/cli/src/generated/catalog.json` | 重新生成：`packages[].published` |
| `packages/lab/package.json`、`packages/charts/package.json` | description 改成「Ships only under the canary dist-tag」 |
| `packages/cli/LICENSE` | 新增（与 core 同一份 MIT） |
| `packages/cli/README.md`、`README.zh-CN.md`、`apps/docs/docs/{en,zh}/guide/cli.md` | 与上面的行为对齐 |
| `.changeset/cli-new-commands.md` | cli 的 minor changeset |

测试：`init.test.ts`（未发布包无安装命令、区块里点到它们的行必须带未发布说明）、`generate/packages.test.ts`（`published` 取值、可安装集合）、`doctor.test.ts`（不点名未发布包）、`cli.test.ts`（`--help` 覆盖全部命令）。

### 1.4 changeset

`.changeset/cli-new-commands.md` 只有 `"@astryx-vue/cli": minor`，正文按 `git log` 和 `packages/cli` 的真实 diff 写：四个新命令各一句（都只输出指引、不改文件；只有 `init` 维护 `AGENTS.md` 标记之间那一段）、`template` 输出带依赖、catalog 收多包且 `search` 标来源包、`docs --depth` 按标题层级截断，最后一段写未发布包不再给安装命令。

## 2. package.json 核对

| 项 | 值 | 结论 |
| --- | --- | --- |
| `files` | `README.md`、`README.zh-CN.md`、`bin`、`dist` | 对，实打 7 个文件（含自动带上的 `LICENSE`、`package.json`） |
| `bin` | `{ "astryx-vue": "./bin/astryx-vue.mjs" }` | 对，`bin` 里只有这个 mjs，shebang 是 `#!/usr/bin/env node` |
| `exports` | `.` → `dist/index.{d.ts,js}`、`./package.json` | 对，catalog 已打进 `dist/index.js`，不需要额外导出 |
| `engines` | `node: ^22.18.0 \|\| ^24.11.0 \|\| >=26.0.0` | 与根 `package.json` 一致 |
| `publishConfig` | `{ "access": "public" }` | 与 core、themes 一致 |
| `repository` | `git+https://github.com/astryx-vue/astryx-vue.git` + `directory: packages/cli` | 对，大小写与 RELEASING.md 要求一致 |
| `version` | 仓库里仍是 `0.3.0` | 由 changesets 在 Version Packages 时升到 `0.4.0` |

`pnpm lint:pkg`（publint + attw）退出码 0，cli 那一段是：

```
== packages/cli ==
packed manifest: 没有 source，catalog:/workspace: 已改写
Running publint v0.3.25 for .../astryx-vue-cli-0.3.0.tgz...
Unpacking tarball...
Linting...
All good!

@astryx-vue/cli v0.3.0
(ignoring resolutions: 'node10', 'node16-cjs')
```

attw 里的 `node10` / `node16-cjs` 是仓库既有的忽略项（core、themes 也一样），不是这次引入的。

## 3. 打包后实跑（不依赖仓库里的文件）

做法：把 `packages/cli/package.json` 的版本临时改成 `0.4.0` → `pnpm --filter @astryx-vue/cli build` → `pnpm pack --pack-destination /tmp/g2-pack2` → 解压到 `/tmp/g2-pack2/package`，把版本改回 `0.3.0`。在一个只有 `package.json` + `pnpm-lock.yaml` + `src/main.ts` + `index.html` 的空项目里，用**包里的入口**跑。

```
$ tar tzf astryx-vue-cli-0.4.0.tgz
package/package.json
package/README.md
package/README.zh-CN.md
package/LICENSE
package/bin/astryx-vue.mjs
package/dist/index.js
package/dist/index.d.ts
```

```
$ node /tmp/g2-pack2/package/bin/astryx-vue.mjs --version
0.4.0

$ node /tmp/g2-pack2/package/bin/astryx-vue.mjs --help
astryx-vue — agent-friendly CLI for astryx-vue

This is @astryx-vue/cli. It is not Meta's astryx binary.

Commands:
  astryx-vue component --list
  astryx-vue component <Name>
  astryx-vue composable --list
  astryx-vue composable <Name>
  astryx-vue docs [topic] [--depth <n>]
  astryx-vue search <query> [--type template]
  astryx-vue template --list
  astryx-vue template <slug> [path]
  astryx-vue build "<idea>"
  astryx-vue manifest --json
  astryx-vue init [--features agents]
  astryx-vue theme [name]
  astryx-vue upgrade
  astryx-vue doctor

Global flags: --json  --dense  --zh  --cwd <dir>  --help  --version

Run `astryx-vue manifest --json` for commands, options, response types, and exit codes.
```

```
$ node .../bin/astryx-vue.mjs theme butter
# Butter

Golden surfaces, blue accents. Outfit for text, Sarina for display sizes.

Docs: https://astryx-vue.pages.dev/en/themes/butter

1. Load the theme once in the app entry

   import '@astryx-vue/themes/butter.css'
2. Put the theme on the element that should use it
   On `html` it covers the whole app; on a smaller element it covers only that subtree.

   <html data-astryx-theme="butter">
3. Switch themes, or run two side by side
   ...（原文来自主题索引页）
4. Check the result
   Run `astryx-vue doctor`: it reports whether a theme stylesheet is imported and whether a theme is set, and changes nothing.
```

```
$ node .../bin/astryx-vue.mjs template --list | head -4
Theme
  theme-showcase  Theme Showcase — A sampler page that shows tokens, colors, typography, inputs, and cards under the active theme.

AI Chat

$ node .../bin/astryx-vue.mjs template --list | tail -3

Every ready template runs on vue and @astryx-vue/core alone, so there is nothing else to install.
8 template(s) are marked not ready: they import a package a project cannot install, so they can be read but not copied. `astryx-vue template <slug>` says why.

$ node .../bin/astryx-vue.mjs template login | head -9
# Basic Login

login  page  Login

A minimal centered sign-in form: email, password, and a submit button, and nothing else on the page.

Docs: https://astryx-vue.pages.dev/en/playground/?template=login
Status: ready to copy
Dependencies: vue, @astryx-vue/core (nothing else to install)
```

```
$ node .../bin/astryx-vue.mjs doctor
astryx-vue doctor — reports only, changes nothing

  ok   @astryx-vue/core 0.4.1 matches the version this CLI documents.
  ok   @astryx-vue/themes is installed (^0.4.1).
  ok   vue 3.5.0 satisfies 3.5.0 or newer.
  ok   A theme stylesheet is imported: @astryx-vue/themes/neutral.css.
  ok   A theme is set at index.html:1.

Everything checks out.
（退出码 0）
```

```
$ node .../bin/astryx-vue.mjs init | tail -10
5. Look things up before writing code
   ...

Not on npm yet, so there is nothing to install:

  @astryx-vue/charts — when it ships it will be canary only, so it takes the `@canary` tag
  @astryx-vue/lab — when it ships it will be canary only, so it takes the `@canary` tag
  @astryx-vue/richtext — no version is on npm, and none is scheduled

Managed block:
  Updated the managed block in AGENTS.md
```

`--zh` 同样跑通，「还没发布到 npm，现在装不到（只列名字）」那一段是中文。打包后跑 `init` 时项目里已经存在 `AGENTS.md`，输出是「已更新受管理区块于 AGENTS.md」，说明只替换标记之间的内容。

## 4. `pnpm release:dry-run`

`pnpm release:dry-run` 退出码 0，但 pnpm 11 说的是：

```
There are no new packages that should be published
```

原因：dry-run 会先查 registry，`cli@0.3.0`、`core@0.4.1`、`themes@0.4.1` 三个版本都已经在 npm 上，pnpm 认为没有新版本可发，于是没有打包。这是发版 PR 阶段的正常现象（版本号还没被 changesets 升上去）。

为了真的验证 0.4.0 的 tarball，本地把 cli 版本临时改成 `0.4.0` 再跑同一串命令：

```
$ pnpm --filter @astryx-vue/core --filter @astryx-vue/themes --filter @astryx-vue/cli publish --dry-run --no-git-checks
📦 @astryx-vue/cli@0.4.0 → https://registry.npmjs.org/
[WARN] Skip publishing @astryx-vue/cli@0.4.0 (dry run)
（退出码 0；core 0.4.1、themes 0.4.1 同样被判为已存在而跳过）
```

## 5. 全量检查

| # | 命令 | 结果 |
| --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` | 通过，380 个文件、5215 条通过、7 todo |
| 2 | `NODE_ENV=production pnpm exec vitest run --maxWorkers=2` | 通过，同样 380 个文件、5215 条通过、7 todo |
| 3 | `pnpm exec eslint . --max-warnings 0` | 通过，退出码 0 |
| 4 | `env -u NODE_ENV pnpm check:packages` | 通过（包边界、路径大小写、`catalog is up to date (245 components, 36 topics, 57 templates)`、500 行、`!important`、模板变量、i18n） |
| 5 | `env -u NODE_ENV pnpm check` | 通过，退出码 0（含 lint、typecheck、全量 test、`build`（含 `docs:build`）、`lint:pkg`） |
| 6 | `pnpm lint:pkg` | 通过，cli 段 `publint ... All good!` |
| 7 | `pnpm --filter @astryx-vue/cli generate` 之后 `git status` | 干净（catalog 已是最新） |

## 6. 提交

```
d742eff5 style(cli): 按 eslint 要求给 if 补大括号
22cd3df1 fix(cli): --help 列出全部命令，补上包里的 LICENSE
b54b1251 chore(release): 给 @astryx-vue/cli 加 0.4.0 的 changeset
dd75e0f4 fix(cli): 还没发布到 npm 的包不再给安装命令
```

分支 `release/cli-0.4.0-prep` 已推送。没有开 PR，没有合并，没动 ROADMAP。

## 7. 拿不准的地方

1. **`published` 取 `private` 字段，是我定的口径。** 好处是不用维护名单，richtext 去掉 `private` 就自动生效。反过来说：哪天有人把包改成 `private: true` 但仍手动 `npm publish`，CLI 会当成「还没发布」。按现在的发版流程（`scripts/list-public-packages.mjs` 只收非 private 的包）不会出现这种情况。
2. **`lab`、`charts` 的 description 改了。** 改的是仓库里 `package.json` 的 `description`，等它们真发布时 npm 页面会用这句。如果希望保留「Published to npm only under…」的原意，可以只在 CLI 输出层加注，撤回这两处改动。
3. **`theme butter` 第 1 步和第 2 步之间少一个空行**（`import '...butter.css'` 下面直接跟 `2. Put the theme…`），这是 D4b 留下的排版，不在本次范围，没动。
4. **`upgrade` 的「最新版」= 生成 catalog 时的 `packages/core` 版本，现在正好是 0.4.1**，与 npm 上一致，所以 D4b 回报里拿不准的第 1 点现在不会造成误判；但等到 core 再发一版，CLI 不重新生成 catalog 就会说旧。要不要改成读 registry，需要单独定。
