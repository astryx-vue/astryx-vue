# C2 勾选与开关 · 执行计划

## 目标

勾选列表、单选列表和滑块可以分别给外壳和本体加样式。复选列表、单选列表的标题和说明可以放链接等富内容，读屏仍念可见文字。滑块按 End 能到最大值，鼠标拖动不出现键盘焦点环，拖动时滑块有按压色。开关忙碌时用当前语言播报，不再为每个开关单独挂一块会时有时无的播报区。触屏按压时，复选框、单选、开关、分段控件和滑块的按压色跟手，不再靠落手就亮的 `:active`。

## 工作环境

- 工作区：当前仓库检出，分支 `sync/c2-checkable`，从 `swarm-tree` 的 `4a5b9a4` 切出。云端没有本机 worktree 路径。
- 动手前先读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md` 的「对齐上游的标准」「不用 `!important`」「跑检查时的环境」「发给用户的验收对照图」。
  - 台账 `.agents-work/upstream-sync-0.7.1/ledger/C2.md`。
  - B6 回报 `nodes/B6/impl-1.md` 第 7 节，以及 `packages/core/src/Field/fieldParts.ts`。
  - B3 的 `usePressFeedback`、`getInteractionModality`。
  - 上游 `v0.7.1`：CheckboxInput、CheckboxList、RadioList、Switch、Slider、SegmentedControl、ToggleButton 的实现和 `.spec.md`。
- 环境纪律：测试和构建命令前面加 `env -u NODE_ENV`。vitest 加 `--maxWorkers=2`。每条命令加 `timeout`。
- 浏览器纪律：文档站整页截图用 `browser-lock.mjs`。不改 `layer/`。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| FR10（#7339） | 复选列表、单选列表、滑块可以单独给字段外壳和本体加 class 和行内样式。`id`、`data-*`、`aria-*`、事件落在主语义控件上：复选列表的 group、单选列表的 radiogroup、单值滑块的滑块、区间滑块的 group。根上直接写的 `class` / `style` 仍留在今天的外壳上。 |
| 富文本标签（#5257、#6178、#6190） | 复选列表、单选列表的标题和说明可以放链接。点链接不切换选中。复选框的名字来自可见文字；说明通过 `aria-describedby` 关联。显式 `ariaLabel` 覆盖这个名字。 |
| 复选列表分组 | 选项包在 `role="group"` 里，组名是列表标签。点行内空白仍切换这一行。 |
| 滑块键盘与焦点环（#5463、#5511、#7461、#7484） | Home 到最小值，End 到最大值，即使步长网格够不着最大值。横向从右到左时，左方向键增大。鼠标拖动不画键盘焦点环；单独按 Shift 也不把环叫回来；方向键和 Shift+Tab 会画。 |
| 滑块按压与刻度 | 拖动期间只有正在拖的滑块有按压色。已填充区间里的刻度用填充色，外面的用轨道色。 |
| 触屏按压（#6383、#6380） | 粗指针下，复选框、单选、开关、分段控件先确认是按压再上色，滚动或挪开就取消。鼠标仍用 `:active`。 |
| 触屏热区（#4964、#4963、#5173、#5170） | sm 的复选、单选、开关，以及滑块轨道，触屏可点区域至少 24px，并且在从右到左时仍居中。 |
| 开关播报（#6114） | 变忙碌时读屏念当前语言的「加载中」。不给每个开关单独挂一块播报节点。 |
| 标签换肤目标（#5183） | 复选框标签带 `astryx-checkbox-label`，开关标签带 `astryx-switch-label`，主题可以单独改它们，同时仍保留 `astryx-field-label`。 |
| 禁用指针与悬停（#5335、#5247） | 禁用时指针是 `default`。禁用控件没有悬停色。 |
| 分段控件（#5035、#6643、#6815） | 标签单行省略。内容宽度不超过容器；只有图标时保持内容宽度。 |
| 开关隐藏标签（#5112） | 标签隐藏后，轨道和标签之间的空隙收掉。 |
| ToggleButton（#6037、#6356、#6463、#6943） | 已有高度、组内单独禁用、按压动作、调用方 class。本轮只核对。 |
| 可选/必填默认（#4791） | FieldLabel 已经认 FormLayout 的 `defaultOptionality`。本轮核对勾选和开关走的是同一条标签。 |
| 主题兼容层删除（#7302）、外观嵌套 token（#5963 后被 #6031 撤回） | 我们没有那层废弃兼容面，v0.7.1 也没有被撤回的嵌套 token。 |

## 上游依据

- 台账条目：`ledger/C2.md` 全部 62 条。
- 上游源码：`packages/core/src/CheckboxInput`、`CheckboxList`、`RadioList`、`Switch`、`Slider`、`SegmentedControl`、`ToggleButton`，以及对应 `.spec.md`。
- 上游测试：`CheckboxList.fr10.test.tsx`、`RadioList.fr10.test.tsx`、`Slider.fr10.test.tsx`，以及各组件测试里富文本名称、End 键、焦点环、按压、加载播报那几段。改写成 Vue 测试，不断言 React 结构或 StyleX。

查上游用 `/tmp/astryx-upstream` 的 `v0.7.1`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `containerClassName` 等，外加 `*Xstyle` | B6 的 `containerClass`、`containerStyle`、`controlClass`、`controlStyle` | 外壳和本体都能加 class 和行内样式。没有 StyleX |
| 根上的 `className` 丢掉并警告 | 根上的 `class` / `style` 留在今天的外壳 | 用户已定 |
| 富文本用 `ReactNode` | 标题、说明用插槽；纯文本仍用 `label` / `description` | 可见内容和读屏名字一致，链接可点且不切换 |
| `useAnnounce` 播报加载 | 已有的 `useAnnounce`，文案用 `switch.loading`，`loadingLabel` 可覆盖 | 播报区是文档级的，一直在，语言跟随当前语言 |
| StyleX 按压层 | `usePressFeedback({ hasOverlay: false })`，组件 CSS 读 `--_press-paint-image` | 粗指针和鼠标的按压节奏与底座一致 |
| 滑块焦点环用 `:focus-visible` 再按模态收窄 | 滑块上记 `data-keyboard-focus`，样式只在这个标记加 `:focus-visible` 时画环 | 鼠标拖动和单独按 Shift 不画环 |
| `themeProps('checkbox-label')` | FieldLabel 增加可选的目标 class | 标签同时有字段类和组件自己的类 |

图标不在本节点的新增范围内。已有指示器继续用现有图形。

## 任务范围

- 要改：
  - CheckboxList、RadioGroup / RadioList、Slider 接入样式分层，并补测试。
  - CheckboxList 增加 `role="group"` 作为本体。
  - CheckboxListItem、Radio 支持富文本标题和说明。
  - CheckboxInput、Switch 的标签加上自己的主题目标 class。
  - Switch 的忙碌播报改走 `useAnnounce`。
  - Slider 的 End/Home 不吸附步长、键盘焦点环、拖动按压色、本体上的方向和禁用标记。
  - 复选框、单选、开关、分段控件接入触屏按压；开关和单选补 24px 触屏热区。
  - 上述组件的中英文 props 文档，以及台账。
- 不碰：`ROADMAP.md`、`SWARM.md`、`layer/`、`verify.md`（写完本轮不再改）、选择器和菜单、生成文件（只许 `pnpm sync` 重写）。
- 范围不对时：先停下，写进回报，不自己扩大。

## 开发步骤

每做完一步，相关测试通过以后就提交一次。

1. 样式分层：三个组件 `inheritAttrs: false`，props 继承 `FieldPartStylingProps`。外壳接根上的 class/style 再加 `container*`。本体只接 `control*`。透传属性落到主语义控件。补测试。
2. 复选列表的 group、富文本标题和说明、单选富文本。点链接不切换。
3. 标签主题 class；开关加载播报。
4. 滑块端点、焦点环、按压色、控制目标上的方向和禁用。
5. 触屏按压和 24px 热区。
6. 中英文文档补上四个样式属性、富文本插槽和加载播报。
7. `pnpm sync`（只有公共导出变了才跑）。台账 62 条全部打勾并写结论。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2`，路径覆盖 CheckboxInput、CheckboxList、Radio、RadioList、Switch、Slider、SegmentedControl、ToggleButton、Field。
2. `NODE_ENV=production pnpm vitest run --maxWorkers=2`，同一组路径，用例数相同。
3. `env -u NODE_ENV pnpm typecheck`、相关 lint、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`。
4. 文档站中文页整页截图：复选列表、单选列表、开关、滑块、分段控件。桌面和 390px，浅色和深色，至少 4 张，滚到有实质 Demo 的位置。图放 `/opt/cursor/artifacts`，不入库。
5. 新写和改到的源码不超过 500 行。不用 `!important`。

## 提交与回报

- 在 `sync/c2-checkable` 上提交，提交信息用中文。可以分几次提交。
- 不要改 `ROADMAP.md` 的节点状态。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/C2/impl-1.md`。
- 最终回复用中文，300 字以内，带 PR 链接。PR 的 base 是 `swarm-tree`。

## 验证操作要短小

每次只跑一组相关测试，命令前加 `timeout`。超时就拆开重跑失败的那一个文件，不原样重跑整组。
