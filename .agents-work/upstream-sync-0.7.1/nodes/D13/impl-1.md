# D13 第 1 轮 · 进行中现状

- 已读：原版 ThemeEditor/ComponentTokensPanel/RawTokensPanel/constants/helpers/ColorSwatch/TokenRow/icons；我们这边 theme*.ts、share.ts、usePlayground、usePreviewSync、PlaygroundFrame、core 的 componentStyles/derivedVars/defineTheme。
- 关键发现：core 没有导出 colorDefaults 等默认值表；默认值改从 neutral/base.css 的 ?raw 解析（themeState 已有同样做法）。预览靠 iframe 里注入 CSS，组件覆盖用 core 的 defineTheme(...).css 编译。
- 拆分：themeTokensComponents.ts（已提交）→ themeTokensRaw.ts（分类表）→ themeOverrides.ts（覆盖合并/序列化/导出）→ ThemeState 加 tokens/componentTokens/customOverrides 字段，接 sanitize/share/export/preview → 两个面板 .vue → 样式 → 测试 → 截图。
- 暂无卡点。
