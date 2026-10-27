# D13 主题编辑器补面板 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D13`，分支 `sync/d13-theme-panels`。只在本地提交，没有推送。
- 提交（基于 `934a742`）：
  - `351558c` Components 面板的变量表与覆盖映射
  - `bdc4d0c` 主题状态加 token/组件变量/自定义覆盖，接入分享、导出和预览
  - `f7e7f14` Components 与 Advanced 面板、接线、样式、单测
  - `6f4106f` 面板显示 Neutral 原始写法，图标和默认值对齐原版
  - `1e6439a` 分类图标加入 uno safelist

## 1. 做了什么

- `ThemeState` 新增三个字段：`tokens`（Advanced 手改的 token）、`componentTokens`（Components 的组件变量）、`customOverrides`（自定义覆盖）。
- 预览：`previewCss` 里追加用 core `defineTheme` 编译的组件覆盖样式表；手改 token 并入 `themeVariables`，优先于生成值。
- 导出：CSS 末尾带组件覆盖规则；JSON 多一个 `components` 字段。
- 分享/刷新：`sanitizeTheme` 清洗三个新字段（只收 `--astryx-` 变量、已登记的组件变量、合法组件名和属性；拒绝 `; { } < > \`），分享链接和刷新后都能恢复。
- 联动：改基础面板的颜色或某条刻度，会清掉对应的手改 token，避免被旧值盖住。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| PlaygroundThemeComponents.vue | 167 | Components 面板 |
| PlaygroundThemeRawTokens.vue | 63 | Advanced 面板（分类切换） |
| PlaygroundTokenRow.vue | 69 | Advanced 的一行 |
| themeTokensComponents.ts | 171 | 组件变量表、映射、组件名 |
| themeTokensRaw.ts | 119 | token 分类与行预览换算 |
| themeOverrides.ts | 165 | 增删改、清洗、合成覆盖、编译 CSS |
| themeTokenColor.ts | 65 | 颜色行读写 |
| themeShownTokens.ts | 61 | 面板显示值 |
| themeDefaults.ts | 7 | 从 neutral/base.css 读默认值 |
| tests/playground-theme-panels.test.ts | — | 新增 14 条用例 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 面板布局、控件、文案 | Astryx React 组件 | 同名 Vue 组件（Selector/TextInput/ToggleButtonGroup 等） | 截图对照一致 |
| 组件变量→覆盖 | `COMPONENT_VAR_TO_OVERRIDE` | 同一张表，输入框圆角改写到 `text-input`/`text-area`/`selector-field` 的 `borderRadius` | 我们 core 的输入框外框类名是这几个 |
| 默认值 | core 导出 `*Defaults` | 解析 neutral/base.css | core 没导出该表，见第 6 节 |

## 3. 和计划不一样的地方

- 默认值不从 core 读（core 没有 `colorDefaults` 等导出），改读 neutral/base.css。
- 浅色圆角选项显示 `0.625rem` 这类原始写法，和原版一致；动过刻度后显示 px。

## 4. 台账处理

无。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `vitest run --maxWorkers=2 tests` | 过 | 23 个文件、441 条用例 |
| 2 | eslint（排除 .tmp-d13）、vue-tsc | 过 | 退出码 0 |
| 3 | 行数检查、`!important` 检查 | 过 | 全部通过 |
| 4 | `docs:build` + `vitepress preview --port 5172` 浏览器探测 | 过 | 卡片圆角改 None：预览样式含 `.astryx-card{border-radius:var(--astryx-radius-none)}`；Advanced 改主色深色值为 #ff0000，预览变量同步；刷新后地址栏带 `pg=`，选择器仍显示 None |
| 5 | 视觉对照 | 过 | `/tmp/D13-visual/`：`ours-{components,advanced}-{light,dark}.png`、`upstream-{components,advanced}-{light,dark}.png` |

## 6. 拿不准的地方

- core 缺：没有导出 `colorDefaults`、`spacingDefaults` 等 token 默认值表，建议后续补。
- 字体行预览用的 `Aa` 等细节未逐行和原版比对；原版是英文面板，我们面板文字也只用英文。
- 导出的 CSS 里组件覆盖是 `@scope` 规则，使用者需把它加载在 neutral 主题根下。
