# D13 主题编辑器补面板 · 执行计划

## 背景

在演练场左侧点「主题」，会出现三个 tab：Base Styles、Components、Advanced。现在只有 Base Styles 能用，点开 Components 和 Advanced 是一片空白。

原因：`apps/docs/components/playground/PlaygroundThemeEditor.vue` 里只写了 `panel === 'base'` 这一块面板，另外两个 tab 只有按钮，没有对应的面板内容。

原版的做法（`apps/docsite/src/app/playground/themeEditor/`）：
- `ComponentTokensPanel.tsx`（284 行）：选一个组件，列出这个组件能改的变量，比如卡片圆角、按钮内边距，每个变量一行控件。还能加自定义覆盖。改动会写进主题的 `components` 覆盖里。
- `RawTokensPanel.tsx`（352 行）：用一组 ToggleButton 切换分类（颜色、间距、圆角、字体、字号、尺寸、阴影、时长、缓动），列出所有原始 token，带预览块和可编辑的值。
- 配套：`constants.ts`（481 行，`COMPONENT_VARS`、`COMPONENT_VAR_TO_OVERRIDE`、分类表）、`helpers.ts`（310 行）、`TokenRow.tsx`、`ColorSwatch.tsx`、`icons.tsx`。
- 总装：`ThemeEditor.tsx`。

## 目标

Components、Advanced 两个面板的样子和交互都要和原版一致：
- 改了值，预览立刻跟着变。
- 「导出」出来的主题代码里带上这些改动。
- 刷新页面或分享链接时，这些改动能恢复回来。

## 工作环境

- 读原版：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:apps/docsite/src/app/playground/themeEditor/<文件>`。`ThemeEditor.tsx` 是总装，要先看它怎么把三个面板的结果合成一个主题。
- 原版在线：`https://astryx.atmeta.com/playground`，点左侧「Theme」进去。访问要走代理，Playwright 要设 `proxy: { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' }`。
- 我们这边的相关文件：`PlaygroundThemeEditor.vue`、`theme.ts`、`themeState.ts`、`themeEditorModel.ts`、`themeExport.ts`、`share.ts`、`usePreviewSync.ts`，都在 `apps/docs/components/playground/` 下。先弄清楚 ThemeState 怎么流到预览 iframe、怎么导出、怎么存进分享链接，再往里面加字段。
- 只有 Vue 组件和样式这一层要自己写；控件直接用 core 的 `Selector`、`TextInput`、`ToggleButton`、`Button`、`Divider`、`Text`、`Heading`、`VStack`/`HStack`。token 的默认值从 core 的 theme 导出读，原版就是这么做的，不要手抄一份。
- 文件拆分：按面板拆成 `PlaygroundThemeComponents.vue`、`PlaygroundThemeRawTokens.vue`，常量和纯函数放进 `themeTokens*.ts`。每个文件都不能超过 500 行。

## 自测

1. 纯函数要有单元测试：变量和覆盖之间的映射、默认值读取、合进导出结果。
2. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 apps/docs` 通过。
3. eslint、行数检查、`!important` 检查都要通过。
4. 先跑 `docs:build`，再跑 `vitepress preview`。**不要用 `vitepress dev`**。然后在浏览器里检查：
   - 两个面板在浅色、深色下都和原版对照截图。
   - 在 Components 里改卡片圆角，在 Advanced 里改主色，预览马上跟着变，导出的代码里也包含这两处改动。
   - 刷新页面后，改动还在。
