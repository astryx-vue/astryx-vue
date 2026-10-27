# G3 首发新包 · 计划（片段）

G3 的完整范围见 ROADMAP：`@astryx-vue/richtext`、`@astryx-vue/charts`、`@astryx-vue/lab` 三个新包等各自的依赖节点做完后首发。

## 0.4.1 里的临时状态：richtext 先不发

0.4.1 只发 `@astryx-vue/core` 和 `@astryx-vue/themes`。richtext 这次不跟着发，因为它的编辑器组件（F1b）和文档（F1c）还没做完，现在发出去只有一个 Markdown 往返的纯逻辑包。

做法只有一行：`packages/richtext/package.json` 里写 `"private": true`。

为什么这样就够了：

- changesets 的 `privatePackages.version` 默认是 `false`，也就是说**带 `private: true` 的包不参与算版本**。`changeset status` / `changeset version` 会把它整个跳过，版本号停在 0.4.0，也不会给它写 CHANGELOG。
- `.changeset/config.json` 的 `fixed` 组里仍然保留 richtext。`matchFixedConstraint` 遇到被跳过的包会 `continue`，所以固定组“三个包同版本”的约束不会把 richtext 抬起来，core 和 themes 照常升到 0.4.1。
- 发布流水线（GitHub Packages 双发、publint、补 tag）都从 `scripts/list-public-packages.mjs` 拿包清单，这个脚本按 `private` 过滤，所以 richtext 不会被发出去。

要留意的两点：

- **别给 richtext 写 changeset。** 写了也不会生效（被静默跳过），changelog 也就丢了。它的改动等首发那版一起写。
- CLI 的 catalog 仍然会列出 `@astryx-vue/richtext`（catalog 按磁盘上的包算，不看 `private`），所以 `init` 生成的安装指引里会出现 `pnpm add @astryx-vue/richtext`。CLI 这版也还没发，等 G2 发 CLI 之前按 G3 的顺序处理。

## 之后怎样恢复发布 richtext

1. 先确认 F1b（编辑器组件）、F1c（文档）都已完成，`README` 里“编辑器还没做”的说明也改掉了。
2. 删掉 `packages/richtext/package.json` 里的 `"private": true`。`.changeset/config.json` 的 `fixed` 组不用动，richtext 一直在里面。
3. 写一条 richtext 的 changeset（类型按改动定）。因为它和 core、themes 在同一个 `fixed` 组，第一次发的时候会被拉到组里的最高版本，和其它两个包对齐；`oldVersion` 更高时 changesets 会直接用组里的版本号，不用手动改 `package.json`。
4. 跑 `pnpm exec changeset status` 确认三个包都在待发清单里，再跑 `node scripts/list-public-packages.mjs`，输出里应该重新出现 `richtext`。
5. 首发要走 npm 的 `latest`，不能用 canary：ADR 0001 把 richtext 定为正常公开包。发完按惯例核对 GitHub Release、GitHub Packages 和 main→dev 回同步。

如果恢复时想把“渠道”和“能不能发”分开管，也可以改走 `.changeset/config.json` 的 `ignore` 名单，但那样 `private` 就没了，`pnpm pack` / `npm publish` 少了最后一层保护，不推荐。
