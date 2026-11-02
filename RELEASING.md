# 发布

`@astryx-vue/core` 和 `@astryx-vue/themes` 一起发版。版本号由 Changesets 固定成同一组，从 `0.0.0` 做 minor 就是 `0.1.0`。

`@astryx-vue/cli` 不在这个 fixed 组里，单独走自己的 changeset。它在仓库里从 `0.0.0` 起，第一次 minor 会变成 `0.1.0`。

`0.1.0` 由仓库所有者在自己的电脑上发布。之后的版本走 `.github/workflows/release.yml`。

## 流水线做什么

推到 `main`，或者在 `main` 上手动运行 Release workflow 时：

1. `pnpm install --frozen-lockfile`
2. `pnpm check`。这里面包含 publint 和 `@arethetypeswrong/cli`
3. 工作目录里还有 changeset 时，打开或更新标题为 `Version Packages` 的 PR。这个 PR 由 `pnpm version-packages` 生成：`changeset version` 改版本号，`pnpm install --lockfile-only` 更新 lockfile，最后重新生成 CLI 的 `catalog.json`。catalog 里记着每个包的版本号，不重新生成就会和 `package.json` 对不上，`generate:check` 会把发版卡住
4. 没有未消费的 changeset 时，`pnpm release` 会检查待发布包、构建，再执行 `changeset publish`。Lab 单独发版时显式使用 canary；Lab 和稳定包不能混在同一批发布。pnpm 11 自己实现了 publish，会把 `catalog:` 和 `workspace:` 改成具体版本
5. 已经在 npm 上的版本会跳过，不会再次上传
6. 为每个包打 git tag，并创建 GitHub Release。随后把对应的 npm 版本页链接补进 Release 说明
7. `npm view` 核对刚发布的版本、`repository` 字段；仓库是 public 时还核对 provenance
8. npm 发布成功后，把同一版本发到 GitHub Packages。仓库变量 `PUBLISH_GITHUB_PACKAGES` 为 `false` 时跳过这一步
9. changesets 真正把包发出去之后（`published` 为 `true`），另一个 job 把 `main` 合并回 `dev`，补上 Version Packages 那次提交。没有冲突就直接推送；推送被分支保护拒绝，或者有冲突，就打开或更新标题为 `chore: sync main into dev` 的 PR（`main` → `dev`）。已经有同名的开放 PR 时不另开，只更新说明。直接推送成功后，这个 PR 会关掉。这一步不依赖 GitHub Packages，失败不会撤回已经发出的版本

pull request 上只跑 `pnpm check` 和 `pnpm release:dry-run`，不会上传。

同一次 `main` 发布不会并行，也不会把已经开始的发布取消掉。过期的 pull request 检查可以被新的一次取消。

## 一次性准备

不要为第一次发布配置 `NPM_TOKEN`。包还没在 npm 上出现过时，不能先配 Trusted Publisher，这个设置挂在已经存在的包上。`0.1.0` 由仓库所有者在自己的电脑上发布，npm 会要 2FA 一次性密码。

1. 合并这份准备 PR。workflow 会打开标题为 `Version Packages` 的 PR，把两个包的版本改成 `0.1.0`，这时还不会上传。先不要合并那个 PR。
2. 在自己的电脑上检出 `Version Packages` PR 的分支，然后登录 npm。登录时会要 2FA 一次性密码。

   ```sh
   npm login
   ```

3. 安装依赖并构建：

   ```sh
   pnpm install && pnpm build:packages
   ```

4. 在仓库根目录一次发布两个包。pnpm 会提示当前不在 main 分支，选 Yes 继续；需要时会要 2FA 一次性密码，也可以用 `--otp=<code>` 直接带上。

   ```sh
   pnpm -r publish --access public
   ```

5. 合并 `Version Packages` PR。`0.1.0` 已经在 npm 上，`changeset publish` 会说没有要发的包；workflow 的 “Backfill tags and GitHub Releases” 步骤会发现 npm 上有这个版本但远端没有 tag，于是在当前 commit 上补 tag 和 GitHub Release，再补 npm 链接，并把同一版本发到 GitHub Packages。
6. 等到真正要发下一个版本时，再在每个包的 npmjs.com 设置里添加 Trusted Publisher：
   - 来源：GitHub Actions
   - Organization or user：`astryx-vue`
   - Repository：`astryx-vue`
   - Workflow filename：`release.yml`
   - Allowed actions：勾上允许 `npm publish`。2026-09-03 之后新建的配置默认只允许 `npm stage publish`，而本 workflow 是直接发布
   
   新建的配置必须在 2 天内完成第一次成功发布，否则过期，只能删掉重建。所以不要提前配，配好后尽快合并带 changeset 的改动发版。
7. 可选：在包设置里打开 “Require two-factor authentication and disallow tokens”（要求 2FA，并且不允许 token）。打开之后，CI 只能走 Trusted Publisher。

新包第一次发布时，npm 可能先放出一个占位版本 `0.0.0-stage`，真正的版本在扫描或审核通过后才出现。可以用 `npm stage list` 查看是否有待批准的包，用 `npm stage approve <id>` 带 2FA 批准。

`NPM_TOKEN` 只作为备用，不建议使用。如果暂时不能在自己的电脑上发，可以在仓库 Settings、Secrets and variables、Actions 里添加 secret `NPM_TOKEN`（automation granular access token，不要写进仓库）。pnpm 会先尝试 OIDC，换票失败才退回这个 token。配好 Trusted Publisher，并打开上面的 “disallow tokens” 之后，这个 secret 就不再有效。

`repository.url` 必须指向 `github.com/astryx-vue/astryx-vue`，大小写一致。`repository.directory` 分别是 `packages/core`、`packages/themes` 和 `packages/cli`。包的 `homepage` 仍是文档站 <https://astryx-vue.pages.dev>，`bugs` 指向这个仓库的 issues。

## 给一个新包做首发

新增一个公开包后，它的第一个版本要有人用自己的 npm 账号发一次。原因是 Trusted Publisher 挂在已经存在的包上，一个 npm 上还没有的包没法提前配。流水线遇到这种包会报 `E404 Not Found - PUT`，同一批里已经在 npm 上的包照常发布，不受影响。

1. 合并 `Version Packages` PR。Release workflow 会发布其他包，并对新包报 404。这是预期的。
2. 在仓库根目录运行（账号开了 2FA 就带上一次性密码）：

   ```sh
   scripts/publish-first-release.sh <包目录名> --otp=<一次性密码>
   ```

   脚本会检查这个版本不在 npm 上、登录、构建，再发布。
3. 到 npmjs.com 这个包的设置里添加 Trusted Publisher（见上面「一次性准备」第 6 步）。
4. 重新运行 `main` 上的 Release workflow（或者下一次合并触发它）。`Backfill tags and GitHub Releases` 会发现 npm 上有这个版本但远端没有 tag，补上 tag 和 GitHub Release。

### Lab 只发 canary

`@astryx-vue/lab` 的 `publishConfig.tag` 固定为 `canary`，首发脚本和 `scripts/release.mjs` 也会显式传 `--tag canary`。Changesets 仍负责版本号、changelog、git tag 和 GitHub Release，但 npm 上传不会写入 `latest`。安装时必须明确使用 `@astryx-vue/lab@canary`。Lab 的 changeset 要单独开一个 Version Packages PR。Changesets 的一次发布只能使用一个 dist-tag，所以不能把 Lab 和稳定包打进同一个 tag。Lab 这个版本还没出现在 npm 上时，`scripts/release.mjs` 会在这一轮把它标成 private，只发布稳定包，Lab 留到单独的 canary 发布。

第一次上传仍需按上面的新包流程由仓库所有者本机完成。合并 `Version Packages` PR 后运行 `scripts/publish-first-release.sh lab`，脚本会读取包里的 canary 配置；随后配置 Trusted Publisher 并重跑 Release workflow 补齐其余产物。

## provenance

provenance 会在 npm 包页上标出这个版本是在哪次 GitHub Actions 里构建并签名的，并链到对应 commit 和 workflow。

npm 的规则是：只有同时满足下面几条才会生成。

- 用 Trusted Publishing（OIDC）或显式打开 provenance 的 token 发布
- 源码仓库是 public
- 包本身是 public

私有仓库即使发布的是公开包，也不会有 provenance。`astryx-vue/astryx-vue` 当前是私有仓库，所以 workflow 在仓库可见性不是 `public` 时设置 `PNPM_CONFIG_PROVENANCE=false`，发布时不带 provenance。仓库改成 public 之后，同一次 workflow 会把它设为 `true`。已经发出去的版本补不了 provenance，只有之后的新版本会有。

pnpm 11 的 publish 不调用 npm CLI。workflow 仍会安装 npm `>= 11.5.1`，给 Trusted Publishing 的文档要求和发布后的 `npm view` 使用。

## npm 页面和 GitHub 侧边栏

两边不是自动打通的。

npm 这边：

- `package.json` 的 `repository` 让 npm 包页链到 GitHub 仓库和子目录。
- 仓库改为 public 并且发布带 provenance 之后，npm 包页会显示这次构建来自 GitHub Actions。
- README 里的 npm badge 链回包页。

GitHub 这边：

- 仓库右侧 Packages 只列出 GitHub Packages（`npm.pkg.github.com`）里的包，不会列出发到 npmjs.org 的包。依据是 [Viewing packages](https://docs.github.com/en/packages/learn-github-packages/viewing-packages)。
- GitHub Packages 的 npm scope 必须等于用户名或组织名。依据是 [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)。
- 仓库已经转到组织 `astryx-vue`，地址是 <https://github.com/astryx-vue/astryx-vue>，目前仍是私有仓库。组织名和 npm scope `@astryx-vue` 一致，所以同一个版本可以再发到 GitHub Packages，并出现在仓库的 Packages 侧边栏。

| 做法 | 结果 |
| --- | --- |
| 只发 npmjs.org | npm 包页通过 `repository` 链到 GitHub。仓库公开后，provenance 再链到 Actions。GitHub Release 里有 npm 链接。Packages 侧边栏仍然是空的。 |
| npm 成功后再发到 GitHub Packages | 这是现在的默认。这次发布的包会出现在本仓库的 Packages 侧边栏。用的是 workflow 里的 `GITHUB_TOKEN`，权限是 `packages: write`。 |

`release.yml` 的 `github-packages` job 在 npm 发布成功后运行。要发哪些包由 `scripts/list-public-packages.mjs` 决定：`packages/` 下没有标 `private: true` 的包都会发，现在是 `cli`、`core`、`themes`。新增包不用改 workflow。它只上传 npmjs.org 上已经存在的同一版本；GitHub Packages 上已经有的版本会跳过。所以某个包漏发了，下一次 Release 运行会自动补上。这个 job 失败不会撤回 npm 上的包。要关掉双发，把仓库变量 `PUBLISH_GITHUB_PACKAGES` 设为 `false`。不设这个变量时会发。

## 日常发版

```sh
pnpm changeset
```

写上要进 changelog 的说明。`@astryx-vue/core` 和 `@astryx-vue/themes` 是 fixed 组，动一个版本，另一个会跟着动。`@astryx-vue/cli` 不在这组里，只在自己的 changeset 里升版本。然后把 changeset 和代码一起合并到 `main`。

CLI 的 npm 包内置生成的 catalog，所以文档、模板或 catalog 里的包版本信息变化时，也要给 CLI 补一个 patch changeset。版本号不需要和 core 一致，但新 catalog 只有发布新的 CLI 版本才能送到用户手里。PR 的 Release 检查会比较目标分支与当前分支：catalog 有变化时，必须带 CLI changeset；消费 changeset 后生成的 `Version Packages` PR 则以 CLI 版本号已经提升为准。

## 失败了怎么处理

先看是哪一步失败。已经上传到 npm 的版本不能用同一个版本号再传一次。

- `pnpm check` 或 dry-run 失败：还没发布。修完再跑。
- 认证失败，日志里有 `Skipped OIDC`：Trusted Publisher 没配好。按上面的一次性准备配好，再用 workflow_dispatch 重跑。`NPM_TOKEN` 只是不推荐的备用。不要改版本号，除非包其实已经发出去了。
- npm 已经收到包，但 workflow 在打 tag 或建 GitHub Release 时失败：不要再次 `pnpm publish`。在 `main` 上用 workflow_dispatch 重跑。`changeset publish` 发现该版本已在 registry 上会跳过上传，随后 `scripts/backfill-releases.mjs` 会补上缺的 tag 和 Release，`after-publish.mjs` 补 npm 链接。
- 只发出去一个包：重跑。已存在的版本跳过，缺的那个会继续发。
- provenance 在私有仓库上报错：确认 workflow 里 `PNPM_CONFIG_PROVENANCE` 为 `false`。不要手改已发布的 tarball。
- GitHub Packages 那一步失败：npm 上的包不受影响。看日志里的 `::error` 或 `pnpm publish` 输出。修好后用 workflow_dispatch 重跑。已经在 npm 和 GitHub Packages 上的版本都会跳过，缺的那个会补发。不想再发到 GitHub Packages 时，把仓库变量 `PUBLISH_GITHUB_PACKAGES` 设为 `false`。
- 同步 `main` 回 `dev` 没能直接推送：npm 上的包不受影响。推送被分支保护拒绝，或者合并有冲突时，会留下标题为 `chore: sync main into dev` 的 PR。这一步用的是 `GITHUB_TOKEN`，推送和开出来的 PR 不会再触发别的 workflow。

手动补发只作为上面这些步骤都对不上时的最后手段，并且不要复用已经成功的版本号。
