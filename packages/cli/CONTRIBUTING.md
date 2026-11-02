# 维护 `@astryx-vue/cli`

这个文件只写给改这个包的人。使用说明在文档站的 `/guide/cli`，包里没有第二份。

## 文本从哪来

CLI 不另存一份组件文档。`scripts/generate-catalog.mjs` 读：

- `apps/docs/components/demos/*/meta.ts`：名字、分组和顺序
- `apps/docs/docs/{en,zh}/components/<slug>/`：用法、props、插槽、事件和示例标题
- `apps/docs/components/demos/<slug>/*.vue`：那些页面指向的示例源码
- `apps/docs/components/demo-infra/reference/*.json`：anatomy 和无障碍信息
- `apps/docs/docs/{en,zh}/guide` 和 `themes`：搜索主题和正文，以及 `theme` 用的主题记录、`init` 用的安装命令和代码片段
- `apps/docs/docs/{en,zh}/guide/migration.md`：`upgrade` 打印的升级小节，和它去源码里找的旧名字
- `apps/docs/components/playground/pages/*.vue`：模板源码；`templateManifest.ts`：模板标题和分类
- 每个 `packages/*/package.json`：判断组件属于哪个包、版本和说明

模板的说明和关键词是手写的，在 `packages/cli/src/generate/template-meta/`，每类模板一个文件，由 `template-meta.ts` 合并。它们属于源数据，不是生成物。

示例的标题和说明按语言各存一份，代码两种语言只存一份。两个页面指向同一个 `.vue` 文件；如果一个页面改了代码、另一个没改，生成时直接报错并指出是哪个组件的第几个示例。

结果提交在 `packages/cli/src/generated/catalog.json`。

## 改完文档或模板之后

```sh
pnpm --filter @astryx-vue/cli generate
```

`pnpm check` 会跑 `generate:check`。它在这些情况下失败：`catalog.json` 过期、某个包里有 PascalCase 导出没有任何组件文档引用、某个演练场页面在 `template-meta.ts` 里没有元数据。`./icons`、`./locale`、CSS 和包根不算组件导出。

只要 catalog 变了就要有 CLI 的 changeset，否则 npm 上的用户拿到的还是旧目录；`scripts/check-cli-catalog-release.mjs` 会在 PR 里拦住漏发。

## 在本仓库里直接跑

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

## 相关包

| 包 | 是什么 |
| --- | --- |
| `@astryx-vue/core` | 这个 CLI 记录的那些 Vue 组件 |
| `@astryx-vue/themes` | Neutral、Butter、Chocolate、Gothic、Matcha、Stone、Y2K |
