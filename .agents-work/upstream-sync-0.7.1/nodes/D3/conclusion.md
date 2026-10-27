# D3 Probe 主题调研 · 结论

结论：**不移植**。

上游 `packages/themes/probe/package.json` 写着 `"private": true`，描述是「Test fixture: a generated theme that styles every declared theming target, so the visual gate can prove each one still reaches the pixels. Never published.」README 第一句也是「A test fixture, not a theme anyone should use. Private; never published.」

它的用处：从全部换肤挂点自动生成一套刺眼的配色，每个挂点一个颜色，给上游 CI 的视觉门禁用，证明每个挂点都真的能改到像素。它不给用户用。

我们这边：

- 用户永远看不到它，移植过来对用户没有价值。
- 我们的视觉对照走 `pnpm visual` 和文档站整页截图，没有上游那套视觉基线 CI。
- 「每个挂点都能改到像素」这件事，以后如果要做，可以用 `defineTheme({ components })` 在测试里生成，不需要发布一个主题包。

台账 14 条都标「不适用」，理由逐条写在 `ledger/D3.md`。
