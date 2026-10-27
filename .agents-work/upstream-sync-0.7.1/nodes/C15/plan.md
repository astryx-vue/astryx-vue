# C15 反馈与状态 · 执行计划

## 目标

提示条不再按颜色自己宣布紧急程度：info、success、warning、error 只换颜色和图标，读屏角色由调用方显式写上。带详情的提示条默认仍然收起，关掉折叠才一直展开。关闭按钮的名字跟着界面语言走，叠在一起时能念出是哪一条。加载圈改成画笔在圆环上走，而不是整圈打转，并且直径、线宽、颜色、弧长都能被主题改。步骤条的连接线可以在指示点前面留出空隙，空隙不会穿进浮层里的另一个步骤条。进度条在不知道进度时不再报具体数值。状态点可以放一个图标，不放时仍然只是一个色点。

## 工作环境

- 工作区：当前云端仓库 `/workspace`，分支 `sync/c15-feedback`。从 `swarm-tree` 拉出。
- 动手前已读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md`
  - `HANDOFF.md`
  - `ROADMAP.md` 里 C15 那一行
  - 台账 `ledger/C15.md`（57 条）
  - `templates/plan.md`、`templates/verify.md`、`templates/impl-report.md`
- 上游源码：`/tmp/astryx-upstream`，标签 `v0.7.1`。
- 环境纪律：测试和检查命令前面加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；命令加 `timeout`。
- 浏览器：文档站整页截图放 `/opt/cursor/artifacts`，不进 git。不改 `layer/` 目录，不改 Toast 关闭栈。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| `57e63a6ba`、`dfdd77805` 在 v0.7.1 的最终形态 | 提示条根上默认没有 `role`，也没有 `aria-live`。`status` 只决定底色和图标。调用方自己写 `role="status"` 或 `role="alert"` 时才会成为实时区域。有默认插槽时仍然默认可折叠、一开始收起；`collapsible` 为 false 时详情一直在，没有展开按钮。 |
| `d7c163c1d`、`4d004cdb4`、`72e38c182` | 关闭按钮的无障碍名是「关闭 + 标题」，提示只写「关闭」。标题不是纯文本时，名字退回「关闭」，调用方应自己给 `dismissLabel`。展开、收起跟着当前语言。窄标题行里，末尾操作整行换到文字下面，长单词会折行，不把页面撑出横向滚动。关掉时焦点回到进来之前的控件。 |
| `917db9ef1`、`47a7ffbf3` | 主题可以分别改外框、彩色标题条、说明、图标、详情区。外框管阴影和圆角，标题条管状态底色。 |
| `a5f4b039e`、`b75ade05e`、`a0d21c18c`、`8c9576db0`、`ac5d38423`、`5da424d84`、`5ca036254` | 加载圈是静止的圆环，弧线沿圆周移动。缩小动效时放慢到 3 秒，不冻住。窄的弹性行不能把圆环压扁。主题改直径时，盒子和画出的圆环一起变。弧长比例、描边、轨道色都是公开变量。没写名字时，读屏念当前语言的「Loading」或「加载中」。带可见文字时不把同一句话念两遍。后出现的加载圈和先出现的保持同一相位。 |
| `0f4d45f88` | 状态点默认仍是纯色圆点。传入图标后，图标画在圆点里，颜色跟圆点的前景走，读屏仍然只念 `label`。 |
| `937f4f860`、`9c83d436c` | 进度刻度在 `progressbar` 外面，可以单独聚焦。不知道进度时，轨道不报 `aria-valuenow`、`aria-valuemin`、`aria-valuemax`、`aria-valuetext`。 |
| `680338c1b`、`a5333b264`、`63a0bcd74`、`3750c4606`、`684b56d19`、`33a14a205`、`8a9d85fdf`、`d990fb58d`、`8bb01b1f0` | 轨道上的步骤指示点两侧可以留空隙，空隙被夹在 0 和一步间距之间。水平步骤条的这个值写在外框上，列表继承它。浮层内容根把这个值还原，里面的步骤条不再接着外面的空隙。标签和说明有自己的主题挂载点，只有标签带禁用状态。窄容器里水平步骤条收成当前一步。可点步骤在触屏上走统一按压，鼠标仍用按下态，按下盖过悬停。禁用时指针是默认箭头，没有悬停底色。折叠后的上一步、下一步在到头时也是默认箭头。 |
| `ecaf7796b` 及步骤条后续提交 | 步骤条已经在 core 里，不在 lab。折叠、非线性和轨道指示点这些用法保持现有行为。 |
| `7b60efafa` | 复选框图形的盒子、对勾、横杠分别能被主题命中，尺寸写在标记自己身上。 |
| 台账里已经落地的部分 | 提示条关闭后焦点交还、空插槽不画出展开按钮、进度刻度按是否落在填充色上换色、骨架屏和空状态的现有布局，核对后标已采纳。 |
| 纯文档措辞、规范记录、CLI 提示、StyleX 构建失败、主题兼容层删除 | 不改变本节点组件的操作。主题兼容层交给 B1。CLI 交给 D4。StyleX 构建规则我们不用。这些标不适用。 |

## 上游依据

- 台账：`ledger/C15.md` 全部 57 条。
- 上游源码：`packages/core/src/Banner/Banner.tsx`、`Banner.spec.md`；`Spinner/Spinner.tsx`；`ProgressBar/ProgressBar.tsx`；`StatusDot/StatusDot.tsx`；`Stepper/Stepper.tsx`、`Step.tsx`、`Stepper.spec.md`；`Indicator/CheckboxIndicator.tsx`；`Layer/layerStructureReset.stylex.ts`（只对照，不改 `layer/` 目录）。
- 上游测试：`Banner.test.tsx` 的角色、关闭命名、折叠；`Spinner.test.tsx` 的无障碍名和弧线；`ProgressBar.test.tsx` 的不确定进度；`Stepper.test.tsx` 的 `--step-connector-gap`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `collapsible` 可以是布尔，也可以是 `{defaultIsOpen, isOpen, onOpenChange}` | 布尔 `collapsible`，加上 `defaultIsOpen` 和 `v-model:isOpen` | 三种用法都能做到：默认收起、一开始展开、父组件控制。不引入 React 的配置对象 |
| StyleX 的 `themeProps('banner-frame')` 等类名 | 同一套类名：`astryx-banner-frame`、`astryx-banner`、`astryx-banner-description`、`astryx-banner-icon`、`astryx-banner-content`，再配已有的 `data-*` | 主题选择器和上游同一套挂载点 |
| 公开变量 `--spinner-diameter` 等 | 组件读 `--astryx-spinner-diameter` 等。主题作者仍写 `--spinner-diameter`，主题编译会加上前缀 | 和按钮半径那套命名一致，主题改直径时圆环跟着变 |
| `useTranslator()` | `useAstryxMessages()` | 英文是 Dismiss / Expand / Collapse / Loading，简体中文是关闭 / 展开 / 收起 / 加载中 |
| 图标注册表里的 `info`、`close` | 继续用现有 `FieldIcon` 和语义图标，不新造注册表 | 形状和颜色仍按状态区分 |
| `usePressFeedback` | 复用 B3 的 `usePressFeedback({ hasOverlay: false })`，步骤按钮自己画按下色 | 鼠标按下仍有反馈，触屏走统一按压 |
| 浮层结构重置写在 Layer 的 StyleX 里 | 只在 `styles/layer.css` 已有的浮层根重置上加一条 `--astryx-step-connector-gap: initial`。不改 `layer/` 目录，不改 Toast | 浮层里的步骤条读到自己的 0 默认值，和上游的层边界一致 |

## 任务范围

- 要改：
  - `packages/core/src/Banner/` 与 `styles/banner.css`
  - `packages/core/src/Spinner/` 与 `styles/spinner.css`
  - `packages/core/src/Stepper/` 与 `styles/stepper.css`
  - `packages/core/src/ProgressBar/`
  - `packages/core/src/StatusDot/`
  - `packages/core/src/CheckboxIndicator/CheckboxIndicator.vue`（标记上补尺寸，方便主题命中）
  - `packages/core/styles/layer.css`（只加连接线空隙的还原，不动 `layer/` 目录）
  - `packages/core/styles/progress-bar.css`（不确定进度的动画时长）
  - 中英文文档：`apps/docs/docs/zh/components/banner/`、`en` 对应页，以及 spinner、progress-bar、status-dot、stepper 里和上述行为不一致的句子
  - 台账 `ledger/C15.md`
- 不碰：
  - `ROADMAP.md`、`SWARM.md`
  - `layer/` 目录
  - `Toast/`，包括 `ToastViewport.vue` 的关闭时长
  - 主题包的兼容层（B1）
  - 生成文件（只在导出有变化时跑 `pnpm sync`）

## 开发步骤

1. 写本计划和 `verify.md` 并提交。
2. Banner：去掉按状态推导的 role；按钮文案走语言包；主题类名落到外框和标题条；说明用次要文字色，图标用状态色。补测试。提交。
3. Spinner：弧线动画、相位对齐、公开变量、带标签时主题挂在外层、默认无障碍名走语言包。补测试。提交。
4. Stepper 连接线空隙、按压和禁用指针；ProgressBar 不确定进度不报数值；StatusDot 支持图标属性；复选框标记带尺寸。提交。
5. 改中英文文档里过时的读屏说明和默认文案。
6. 台账 57 条全部打勾并写结论。
7. 两种 `NODE_ENV` 下跑相关测试，再跑 typecheck、相关 lint、行数检查。截文档站整页。
8. 写 `impl-1.md`。推送并开 draft PR，base 是 `swarm-tree`。

## 自测要求

1. `timeout 180 env -u NODE_ENV pnpm vitest run --maxWorkers=2`，路径覆盖 Banner、Spinner、ProgressBar、StatusDot、Stepper、CheckboxIndicator。
2. `timeout 180 env NODE_ENV=production pnpm vitest run --maxWorkers=2` 跑同一组，用例数相同。
3. `timeout 180 env -u NODE_ENV pnpm typecheck`。
4. 相关 lint，以及 `timeout 60 node scripts/check-line-limit.mjs`、`timeout 60 node scripts/check-no-important.mjs`。
5. 文档站中文页整页截图：提示条、加载圈或步骤条，桌面和 390 宽，浅色和深色，至少 4 张，滚到有实质 Demo 的位置。
6. 新写和改到的源码文件不超过 500 行。

## 提交与回报

- 分支 `sync/c15-feedback`，提交信息用中文。分几次提交。
- 不改 `ROADMAP.md` 的节点状态。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/C15/impl-1.md`。
- 最终回复用中文，300 字以内，带 PR 链接。

## 验证操作要短小

每次只跑一组组件测试，命令前加 `timeout`。超时就拆出失败的文件，不原样重跑整组。脚本和截图放在 `/tmp/c15-*` 和 `/opt/cursor/artifacts`。
