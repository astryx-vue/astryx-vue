# D11 文档润色（第 1 批：中文指南与主题） · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D11`，分支 `sync/d11-docs-polish`。只在本地提交，没有推送。
- 提交（基于 `30b33e5`）：
  - `e85b5be` docs(guide): 润色介绍、快速开始与安装文档
  - `781657a` docs(guide): 润色样式与深色模式文档
  - `6c41359` docs(guide): 润色国际化与图标文档
  - `74252bb` docs(guide): 润色响应式、无障碍与页面布局文档
  - `c775832` docs(guide): 润色设计原则与应用模式文档
  - `2495094` docs(guide): 润色组合式函数与模板文档
  - `c372e81` docs(guide): 润色配合 AI 写代码文档
  - `ca819ab` docs(guide): 润色命令行与浏览器支持文档
  - `a49ad5e` docs(guide): 润色链接、贡献、升级与变更日志文档
  - `180fdf4` docs(themes): 润色主题概览、Neutral 与 Butter 文档
  - `44cd8d1` docs(themes): 润色 Chocolate、Gothic 与 Matcha 文档
  - `caae6a5` docs(themes): 润色 Stone、Y2K 与颜色文档
  - `3f0f95b` docs(themes): 润色排版与间距文档
  - `c549146` docs(themes): 润色动效、CSS 变量、令牌与扩展主题文档
  - `e9d7041` docs: 重新生成 catalog 并更新引文关键字

## 1. 做了什么

按照计划完成了全部 36 个中文指南与主题文档的文字润色，严格保证未改动 frontmatter、代码块、脚本/样式块、Vue 组件标签、行内代码、链接地址和容器。消除了生硬宣传腔与套话，确保说法直白、概念首提有简明说明、术语全局统一。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `apps/docs/docs/zh/guide/why.md` | 51 | 介绍：定位、实现逻辑与原版差异 |
| `apps/docs/docs/zh/guide/getting-started.md` | 52 | 快速开始与 AI Agent 纯文本访问说明 |
| `apps/docs/docs/zh/guide/installation.md` | 64 | 安装：包结构、样式重置与引入规范 |
| `apps/docs/docs/zh/guide/styling.md` | 107 | 主题与样式：样式级联层与 Tailwind/UnoCSS 搭配 |
| `apps/docs/docs/zh/guide/dark-mode.md` | 44 | 深色模式：基于 light-dark() 的明暗适配 |
| `apps/docs/docs/zh/guide/i18n.md` | 179 | 国际化：多语言加载、RTL 排版与伪本地化测试 |
| `apps/docs/docs/zh/guide/icons.md` | 134 | 图标：Iconify 按需构建、动态注册与语义图标 |
| `apps/docs/docs/zh/guide/responsive.md` | 108 | 响应式布局：断点规则、内容版心与自适应网格 |
| `apps/docs/docs/zh/guide/accessibility.md` | 50 | 无障碍：焦点环、屏幕阅读器支持与减少动效 |
| `apps/docs/docs/zh/guide/layout.md` | 148 | 页面布局：AppShell 与 Layout 的结构划分与对齐 |
| `apps/docs/docs/zh/guide/principles.md` | 61 | 设计原则：语义变量、受控组件与主题解耦 |
| `apps/docs/docs/zh/guide/patterns.md` | 176 | 应用模式：AI 对话流、固定页眉页脚与可调整侧面板 |
| `apps/docs/docs/zh/guide/composables.md` | 62 | 组合式函数：通用函数清单与组件绑定函数 |
| `apps/docs/docs/zh/guide/templates.md` | 19 | 模板：演练场页面模板清单与使用说明 |
| `apps/docs/docs/zh/guide/working-with-ai.md` | 125 | 配合 AI 写代码：CLI 检索与规范文件维护 |
| `apps/docs/docs/zh/guide/cli.md` | 92 | 命令行：CLI 工具核心命令、代码生成与参数 |
| `apps/docs/docs/zh/guide/browser-support.md` | 94 | 浏览器支持：现代 CSS 特性约束与底线版本 |
| `apps/docs/docs/zh/guide/links.md` | 67 | 链接与路由：as 属性支持与 Vue Router 接入 |
| `apps/docs/docs/zh/guide/contributing.md` | 69 | 贡献指南：开发规范、Changeset 与对照截图要求 |
| `apps/docs/docs/zh/guide/migration.md` | 275 | 升级指南：v0.7.1 破坏性变更与迁移方案 |
| `apps/docs/docs/zh/guide/changelog.md` | 18 | 更新日志：已发布版本变更指引 |
| `apps/docs/docs/zh/themes/index.md` | 46 | 主题概览：主题生态与画廊入口 |
| `apps/docs/docs/zh/themes/neutral.md` | 60 | Neutral 主题：默认中性灰阶、字体栈与深色模式 |
| `apps/docs/docs/zh/themes/butter.md` | 28 | Butter 主题：黄油暖金主题说明 |
| `apps/docs/docs/zh/themes/chocolate.md` | 28 | Chocolate 主题：巧克力暖棕主题说明 |
| `apps/docs/docs/zh/themes/gothic.md` | 30 | Gothic 主题：冷峻深色夜间主题说明 |
| `apps/docs/docs/zh/themes/matcha.md` | 28 | Matcha 主题：清新草木绿主题说明 |
| `apps/docs/docs/zh/themes/stone.md` | 28 | Stone 主题：原石板岩极简主题说明 |
| `apps/docs/docs/zh/themes/y2k.md` | 28 | Y2K 主题：千禧复古直角主题说明 |
| `apps/docs/docs/zh/themes/color.md` | 45 | 颜色：语义色、状态色与图表连续色阶 |
| `apps/docs/docs/zh/themes/typography.md` | 74 | 排版与字体：字体族、字重阶梯与文本尺寸规范 |
| `apps/docs/docs/zh/themes/scale.md` | 57 | 间距、圆角与阴影：rem 步进阶梯与投影系统 |
| `apps/docs/docs/zh/themes/motion.md` | 54 | 动画与过渡：时长阶梯、缓动曲线与减少动效 |
| `apps/docs/docs/zh/themes/css-variables.md` | 73 | CSS 变量与样式分层：五个 @layer 顺序与变量规范 |
| `apps/docs/docs/zh/themes/tokens.md` | 65 | 设计令牌：命名约定、编译机制与业务样式引用 |
| `apps/docs/docs/zh/themes/extending.md` | 186 | 扩展与自定义主题：局部计算主题、挂点定制与继承 |
| `packages/cli/src/generated/catalog.json` | 13180 | CLI catalog 快照（重新生成） |

## 2. 和上游的对照

不适用（本节点为文档中文行文润色，非上游代码同步）。

## 3. 和计划不一样的地方

在运行 `pnpm --filter @astryx-vue/cli generate` 重新生成 CLI catalog 时，脚本对 `installation.md` 与 `styling.md` 中的特定引文（“子路径和包根”、“不要求 UnoCSS”）有精准包含匹配断言。修改时保留了对应包含关键字，确保 catalog 顺利生成且内容一致。

## 4. 台账处理

不适用。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `node guard.mjs swarm-tree` | 过 | `核对了 36 个改动过的文件，0 个不通过。` |
| 2 | `pnpm docs:build` | 过 | `build complete in 30.91s.`（生成 569 个页面 Markdown 与全量产物） |
| 3 | `eslint --max-warnings 0 apps/docs/docs/zh` | 过 | 退出码 0，0 warning, 0 error |
| 4 | `pnpm --filter @astryx-vue/cli generate` | 过 | `wrote .../catalog.json (245 components, 36 topics, 57 templates)` |

## 6. 术语对照表与统一定义

| 备选术语 / 常见叫法 | 最终统一定义 | 统一理由与使用规范 |
| --- | --- | --- |
| 设计令牌 / 设计变量 / token / 令牌 | 设计令牌（Token） / 令牌 | 概念首提使用「设计令牌（Token）」，后文直接使用「设计令牌」或「令牌」；专指 CSS 变量时使用「CSS 变量」 |
| 读屏 / 读屏软件 / 屏幕阅读器 / 读屏器 | 屏幕阅读器 | 行业通用标准称谓，准确无歧义 |
| 插槽 / slot | 插槽 | Vue 官方中文文档统一术语 |
| 属性 / prop / props | 属性（Props） / 属性 | 正文中统一为「属性」，代码引用保持 `props` |
| 组合式函数 / Composable / composables | 组合式函数（Composable） | Vue 3 官方规范译法，正文中统称「组合式函数」 |
| 无障碍 / a11y / 无障碍访问 | 无障碍（Accessibility） / 无障碍 | 首提「无障碍（Accessibility）」，后文直接使用「无障碍」 |
| 焦点环 / 焦点轮廓 / focus ring | 焦点环（Focus Ring） / 焦点环 | 描述交互焦点状态的视觉轮廓时统称「焦点环」 |
| 暗黑模式 / 深色模式 / 夜间模式 / 暗色模式 | 深色模式 | 与浅色模式对齐，符合中文界面规范标准叫法 |
| 浅色模式 / 明亮模式 / 亮色模式 | 浅色模式 | 与深色模式对齐 |
| 响应式 / 自适应 / 响应式布局 | 响应式布局 / 响应式 | 描述多端适配时统一称「响应式」或「响应式布局」 |
| 国际化 / 多语言 / i18n | 国际化（i18n） / 国际化 | 涉及语种切换、文案与排版方向时统称「国际化」 |

## 7. 疑似事实错误清单

核对 36 个文档，未发现阻断性事实错误。仅有一处需要提醒总控注意：
- `apps/docs/docs/zh/themes/neutral.md` 第 34 行：文中描述「直角定义 `--astryx-radius-none`：和上游一样是 `0px`」，但在 `apps/docs/docs/zh/themes/scale.md` 第 32 行又提到「纯直角（none）：在本库中保持严格的 `0px`（不采用原版 Neutral 将其设为 4px 的做法）」。此处两者对上游 Neutral 的原版默认值表述有轻微矛盾，本次按照规则仅修改行文，未改动任何事实结论。

## 8. 润色前后对比（精选 5 段）

### 对比 1：`apps/docs/docs/zh/guide/why.md`（介绍开头）

- **修改前**：
  > astryx-vue 是用 Vue 3 重新实现的开源组件库，它的设计灵感和视觉规范来自 Meta 的 Astryx 设计系统。原版文档在 https://astryx.atmeta.com，基于 React 19 和 StyleX 开发。本项目由开源社区独立维护，目标是让 Vue 开发者不用换技术栈，就能直接用上这套做工精细、现代好看的界面。
- **修改后**：
  > astryx-vue 是基于 Vue 3 实现的开源组件库，其视觉规范源自 Meta 的 Astryx 设计系统。原版文档位于 https://astryx.atmeta.com，基于 React 19 和 StyleX 构建。本项目由开源社区独立维护，旨在让 Vue 开发者无需切换技术栈，即可在日常项目中使用这套界面组件。

### 对比 2：`apps/docs/docs/zh/guide/accessibility.md`（无障碍开头）

- **修改前**：
  > 让所有人都能顺畅使用界面，是组件库的基础设计原则。无论是仅靠键盘操作的用户，还是依赖读屏软件（屏幕阅读器）视障朋友，都能获得良好、完整的体验。我们的组件与示例绝不会为了追求好看而盲目抹除焦点环，也不会为了极简而牺牲色彩对比度。
- **修改后**：
  > 保障所有人都能顺畅使用界面，是组件库的基础设计原则。无论是通过键盘操作，还是依赖屏幕阅读器等辅助设备，都能获得完整的交互体验。组件与示例不会抹除默认焦点环，也不会为了极简设计牺牲色彩对比度。

### 对比 3：`apps/docs/docs/zh/guide/responsive.md`（响应式理念）

- **修改前**：
  > 良好的响应式设计应当顺应内容，而不是生硬地等比压缩。在开始搭界面之前，先思考各个区块在屏幕变窄时应当如何演变：某些辅助区域可以留下来并适当收缩；某些可以暂时收进按需展开的抽屉浮层中；而某些不关键的次要内容则可以直接隐藏。当三栏内容并排太挤时，应果断把次要的一栏收起或折叠，绝不要把文字和按钮压得面目全非。
- **修改后**：
  > 合理的响应式设计应当根据屏幕尺寸调整信息层级，而不是等比压缩元素尺寸。在构建界面前，需规划各区域在窄屏下的呈现形式：辅助区域可以收窄或转入按需展开的抽屉浮层，次要内容可直接隐藏，避免由于空间挤压导致排版混乱。

### 对比 4：`apps/docs/docs/zh/themes/tokens.md`（设计令牌定义）

- **修改前**：
  > 做界面时，我们经常会遇到很多重复出现的设计决定：比如主色调选哪个蓝、按钮圆角是多大、卡片之间空开几像素、弹窗弹出来要花几毫秒。如果把这些具体数字硬编码写死在每个组件的 CSS 里，以后只要想改个圆角或换个主题色，就得翻遍整个项目的代码挨个修改，不仅费时而且特别容易改漏。
- **修改后**：
  > 在界面开发中，存在大量复用的设计决策：主色调色值、按钮圆角弧度、组件间距及动画时长等。若将具体数值硬编码在组件样式中，后续调整全局规范时需逐处修改，容易产生疏漏与规范分歧。

### 对比 5：`apps/docs/docs/zh/themes/motion.md`（动效原则）

- **修改前**：
  > 界面的动效就像演员走位时的节奏感：太快了显得生硬突兀，太慢了又让人觉得卡顿拖沓。astryx-vue 的动效体系沿袭了 Astryx 的标准规范，旨在提供干脆、克制且符合物理规律的交互体验。
- **修改后**：
  > 界面的交互动效需要兼顾即时反馈与视觉平滑度。astryx-vue 的动效规范遵循 Astryx 设计标准，提供克制且符合物理规律的过渡体验。

## 9. 拿不准的地方

无。所有自测项、核验脚本与构建均 100% 绿色通过。
