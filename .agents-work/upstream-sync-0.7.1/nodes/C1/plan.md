# C1 基础输入 · 执行计划

## 目标

带 Field 的基础输入（文本、多行、数字、文件）可以分别给外壳和本体加样式。清除按钮悬停或键盘聚焦时，提示只说「清除」，读屏仍然读到「清除 + 字段名」。演练场 settings 等模板里写的 `is-label-hidden` 能把标签藏起来。数字框会认贴进来的分组数字，离开输入框时再提交，超出范围就收到最近的边界。多行文本按人眼看到的字符数计数。

## 工作环境

- 工作区：当前仓库检出，分支 `sync/c1-inputs`，从 `swarm-tree` 的 `1419a29` 切出。云端没有本机 worktree 路径，不假设 `/Users/.../astryx-vue-wt/C1`。
- 动手前先读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md` 的「对齐上游的标准」「不用 `!important`」「跑检查时的环境」。
  - 台账 `.agents-work/upstream-sync-0.7.1/ledger/C1.md`。
  - B6 回报 `nodes/B6/impl-1.md` 第 7 节，以及 `packages/core/src/Field/fieldParts.ts`、`TextInput/TextInput.vue`。
  - 上游 `v0.7.1`：`docs/families/input-fields.md` 的 FR10、FR11，以及 TextInput、TextArea、NumberInput、FileInput、Field、InputClearButton、FormLayout 的实现。
- 环境纪律：测试和构建命令前面加 `env -u NODE_ENV`。vitest 加 `--maxWorkers=2`。
- 浏览器纪律：本轮以组件测试核对落点和文案，不另开文档站。外观改动用现有 CSS 和测试守住，不新开浏览器会话。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| FR10（#7336） | 可以单独给字段外壳、输入框本体加 class 和行内样式。两组不会串到对方身上，也不会落到原生 input 上。在 InputGroup 里、以及横向标签的 FormLayout 里，外壳样式不生效，开发环境警告一次。 |
| 用户已定，和上游不同 | 直接写在组件上的 `class` / `style` 留在今天的落点，不丢掉，也不警告。不做 `*Xstyle`。FileInput 今天把 class 吞掉了，按 B6 交接，补到本体上。 |
| FR11（#7476、#6354） | 清除按钮的提示固定是「Clear」/「清除」。读屏读的名字仍然带字段名，例如「Clear Name」。 |
| 隐藏标签属性名 | 上游统一叫 `isLabelHidden`。我们 Typeahead、Tokenizer、MultiSelector、PowerSearch、Token 还叫 `labelHidden`，模板里的 `is-label-hidden` 不生效，Settings 标题被「Search」挤折行。 |
| NumberInput 解析和提交（#5450、#5546、#5152） | 贴上 `1,234` 能读成 1234。整段草稿在离开或按 Enter 时才提交。读不出来就回到上一个值，不会把前面几个数字先交上去。超出最小、最大值时收到最近的边界。无效草稿会播报「数字无效」。 |
| TextArea 字数（#4776） | 计数按可见字符，一个 emoji 算一个。接近上限和超出上限时读屏播报。可以输入超过上限，计数变红，不再靠原生 `maxlength` 截断。 |
| FileInput（#6427、#6612） | 选中和清除都会走 `changeAction`。上传图标继续用语义名 `upload`。 |
| FormLayout（#7501） | 横向标签在 480px 以下改回竖排时，控件拉满整行。 |
| 已经对齐、本轮只核对 | 可选/必填默认、自动完成、输入法 Enter、禁用指针 `default`、iOS 16px 字号、Field 可收缩和局部层叠、状态条圆角、清除按钮触屏 24px 热区。 |

## 上游依据

- 台账条目：`ledger/C1.md` 全部 82 条。
- 上游源码：`packages/core/src/TextInput`、`TextArea`、`NumberInput`（含 `numberParser.ts`、`numberInputCommit.ts`）、`FileInput`、`InputGroup`、`Field`（含 `InputClearButton.tsx`、`fieldParts.ts`）、`FieldStatus`、`FormLayout`，以及 `docs/families/input-fields.md`。
- 上游测试：各组件的 `*.fr10.test.tsx`、`InputClearButton.test.tsx`、`numberParser.test.ts`、`numberInputCommit.test.ts`。改写成 Vue 测试，不断言 React 结构。

查上游用本环境的 `/tmp/astryx-upstream`（`v0.7.1`）。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `containerClassName` / `controlClassName`，外加 StyleX 的 `*Xstyle` | 只用 B6 的 `containerClass`、`containerStyle`、`controlClass`、`controlStyle` | 外壳和本体都能加 class 和行内样式。没有 StyleX，不做 `*Xstyle` |
| 根上的 `className` / `style` 是类型错误，运行时丢掉并警告 | 根上的 `class` / `style` 保持今天的落点，不警告 | 用户已定。Vue 里直接写 class 是常态 |
| `useFieldInputStyling` | 已有的 `useFieldPartStyling` | 落点和「没有外壳就警告」已经在工具里 |
| InputClearButton 用 Button 的 `tooltip` 和 `label` | 新建 `InputClearButton.vue`，包一层 IconButton：`label` 是无障碍名，`tooltip` 用 `@astryx.inputClearButton.tooltip` | 提示和读屏名字分开，和 FR11 一致 |
| `isLabelHidden` | 正名 `isLabelHidden`，旧名 `labelHidden` 用别名。Vue 没传的布尔属性会变成 false，所以要看调用方到底写了哪个名字 | `is-label-hidden` 和 `label-hidden` 都能藏标签 |
| 数字解析用 Intl | 移植解析和提交策略，locale 用 `useAstryxLocale()` | 分组、小数点、夹范围的结果和上游一致 |

图标继续用语义名和 `defineTheme({ icons })`。步进按钮改用已有的 `numberInput:stepperDown`，不引入上游的图标注册表。

## 任务范围

- 要改：
  - `TextArea`、`NumberInput`、`FileInput` 接入样式分层。`TextInput` 已接入，只把清除按钮换成共用组件。
  - 新建 `Field/InputClearButton.vue`，C1 的四个输入用它。日期和选择器的清除按钮留给对应节点。
  - `Typeahead`、`Tokenizer`、`MultiSelector`、`PowerSearch`、`Token` 增加 `isLabelHidden`，保留 `labelHidden`。`MultiSelector.vue`、`PowerSearch.vue` 已在 500 行白名单上，只能改表达式，不能变长。
  - `NumberInput` 的解析、提交、无效播报、步进图标。
  - `TextArea` 的可见字符计数和播报。
  - `FileInput` 的 `changeAction`。
  - `form-layout.css` 窄屏 `align-items: stretch`。
  - 上述组件的中英文文档 props，以及台账。
- 不碰：`ROADMAP.md` 的状态表、`verify.md`、日期时间（C5）、选择器的 FR10 接入（C3，本轮只改隐藏标签的属性名）、生成文件（只许 `pnpm sync` 重写）。
- 范围不对时：先停下，写进回报，不自己扩大。

## 开发步骤

每做完一步，相关测试通过以后就提交一次。

1. 清除按钮：`InputClearButton` 提示用翻译键，无障碍名由调用方传入。TextInput、TextArea、NumberInput、FileInput 换上它。触屏 24px 热区继续用 `field.css` 里已有的 `::after`，给按钮补上 `position: relative`，让热区挂在按钮自己身上。
2. 样式分层：三个组件 `inheritAttrs: false`（已是），props 继承 `FieldPartStylingProps`。外壳接 `container*`，本体接 `control*` 加上根上的 `class` / `style`。`id`、`data-*`、`aria-*`、事件落到主语义控件（textarea、number 的 input、file 的触发按钮）。补测试。
3. 隐藏标签：`useResolvedLabelHidden`。默认是 false 的组件也可以用「新名或旧名任一为真」。PowerSearch 默认隐藏，必须区分「没传」和「传了 false」。文档把正名写上，旧名标成别名。补 Typeahead 测试：`is-label-hidden` 让标签带上 `data-hidden`。
4. 数字：移植 `parseLocaleNumber`、`resolveNumberInputCommit`。输入过程只留草稿；blur 和 Enter 再提交。空草稿在有清除按钮时清空，否则回到原值。无效时 `role="alert"` 播报。步进从草稿的读数走，图标用 `Icon`。
5. 多行：计数改用已有的可见字符计数。接近 80% 和超出时用 `useAnnounce` 播报，超出时 `aria-invalid`。不再把 `maxlength` 写进原生属性。
6. 文件：选中和清除调用 `changeAction`，失败时发出 `actionError`。
7. 表单布局：480px 以下的横向标签加上 `align-items: stretch`。
8. `pnpm sync`。台账 82 条全部打勾并写结论。
9. 中英文文档补上四个样式属性和清除按钮的说明。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2`，路径覆盖 TextInput、TextArea、NumberInput、FileInput、Field、FormLayout、Typeahead、InputGroup。
2. `NODE_ENV=production pnpm vitest run --maxWorkers=2`，同一组路径，用例数相同。
3. 尽量跑完整的 `env -u NODE_ENV pnpm check`。完整检查太长就分步跑，每步记退出码。
4. 本轮不新开浏览器。落点、提示文字、标签隐藏、数字提交都由测试守住。
5. 新写和改到的源码不超过 500 行。白名单里的文件不能变长。不用 `!important`。

## 提交与回报

- 在 `sync/c1-inputs` 上提交，提交信息用中文。可以分几次提交。
- 不要改 `ROADMAP.md` 的节点状态。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/C1/impl-1.md`，格式见 `templates/impl-report.md`。另外写明：`labelHidden` 要进 D7；日期和选择器的清除按钮还没用 `InputClearButton`。
- 最终回复用中文，300 字以内，带 PR 链接。PR 的 base 是 `swarm-tree`。

## 验证操作要短小

每次只跑一组相关测试，命令前加 `timeout`。超时就拆开重跑失败的那一个文件，不原样重跑整组。
