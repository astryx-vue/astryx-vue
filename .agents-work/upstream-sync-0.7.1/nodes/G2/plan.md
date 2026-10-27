# G2 发布 CLI 0.4.0 · 计划

工作区 `/Users/shenqingchuan/workspace/astryx-vue-wt/G2`，分支 `release/cli-0.4.0-prep`，基于 `swarm-tree`（= `origin/swarm-tree` = `origin/main` = `4679af58`）。

## 目标

`@astryx-vue/cli` 从 0.3.0 发到 **0.4.0**（minor）。core、themes 已发 0.4.1，richtext 暂时 private，lab、charts 是 canary-only 私有包。cli 不在 changesets 的 fixed 组里，独立升版本。

## 第 1 步：发版前要先排掉的坑（判断写在这里，再改）

### 现状（2026-10-27 用 `npm view` 查过）

| 包 | 仓库里 `private` | npm 上有吗 | 说明 |
| --- | --- | --- | --- |
| `@astryx-vue/core` | 否 | 0.4.1 latest | 正常 |
| `@astryx-vue/themes` | 否 | 0.4.1 latest | 正常 |
| `@astryx-vue/cli` | 否 | 0.3.0 latest | 本次发 0.4.0 |
| `@astryx-vue/richtext` | **是** | 404，没有 | 暂时不发布 |
| `@astryx-vue/lab` | **是** + `astryxVue.canaryOnly` | 404，没有 | 连 canary 都还没发过 |
| `@astryx-vue/charts` | **是** + `astryxVue.canaryOnly` | 404，没有 | 同上 |

### 问题

`catalog.packages` 收的是 `packages/` 下**所有**包，`init` 和 `AGENTS.md` 受管理区块把这五个包都当成「可以装」，于是实际打印出：

```
Install on demand (canary packages take the tag):

  pnpm add @astryx-vue/charts@canary
  pnpm add @astryx-vue/lab@canary
  pnpm add @astryx-vue/richtext
```

这三条今天全是 404。用户照着敲，装到的是「包不存在」。`AGENTS.md` 里也写着 `@astryx-vue/lab@canary`、`@astryx-vue/richtext`，AI 助手会拿它去装。

### 判断

1. **`private: true` 就是「现在装不到」的唯一真值。** npm 不允许发布 `private` 包，发版脚本 `scripts/list-public-packages.mjs` 也只收非 private 的包。所以「能不能 `pnpm add`」= `package.json` 的 `private !== true`，不用另写一份名单，也不用在 CLI 里硬编码三个包名。哪天 richtext 去掉 `private`，CLI 的输出自动跟着变。
2. **canary 标记留着，但不是「可安装」的同义词。** `canary` 只回答「发布时带哪个 dist-tag」。只有在 `published` 为真时，才写成 `@canary` 的安装写法；未发布时压根不产出安装命令，只写一句「尚未发布到 npm」。
3. **catalog 里不删这三个包。** `component`、`search` 的文档内容还在用它们的名字（虽然现在组件全部属于 core），删掉会让 catalog 少一块信息。做法是给 `catalog.packages` 每条加一个 `published` 字段，输出层再按它决定「写不写安装命令」。
4. **`installablePackageNames()`（判断模板「引用了一个项目装不了的包」）也改成只收已发布的包。** 同一个概念说两遍容易走岔：没发布的包，项目就是装不上。
5. **`doctor` 不用改**：它只查 core、themes、vue 和样式表/主题属性，不推荐任何未发布的包。加一条测试把这个结论钉住。

## 第 2 步：写 changeset

`.changeset/cli-new-commands.md`，只含 `"@astryx-vue/cli": minor`，正文只写用户能感受到的：

- 新增 `init`、`theme`、`upgrade`、`doctor`（各一句，强调只输出指引、不改项目文件；只有 `init` 会维护 `AGENTS.md` 里属于我们的那一段）。
- `template` 输出写明依赖。
- catalog 支持多个包，`search` 结果带所属包。
- `docs --depth` 按标题层级计数。

以 `git log` 和 `packages/cli` 的真实 diff 为准，不编造。

## 第 3 步：发版前的核对

- `pnpm release:dry-run`（会 publish --dry-run cli、core、themes）。
- `pnpm lint:pkg`（publint）。
- 核对 `packages/cli/package.json` 的 `files`、`bin`、`exports`、`engines`、`publishConfig`、`repository`。
- 临时目录里 `pnpm pack`，解压后用包里的入口实跑 `--help`、`theme`、`template --list`，确认不依赖仓库里的文件。输出贴进 `impl-1.md`。

## 第 4 步：全量检查

- `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 与 `NODE_ENV=production` 各一遍。
- `pnpm exec eslint . --max-warnings 0`。
- `pnpm check`（含 build、publint）。
- `pnpm --filter @astryx-vue/cli generate` 后 `git status` 干净。

## 纪律

- 分块 commit，只推 `release/cli-0.4.0-prep`（HTTPS + 代理），不开 PR、不合并、不改 ROADMAP。
- 回报写进 `nodes/G2/impl-1.md`。
