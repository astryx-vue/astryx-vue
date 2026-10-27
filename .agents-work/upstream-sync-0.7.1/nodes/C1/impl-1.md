# C1 基础输入 · 第 1 轮实现回报

- 工作区：云端检出，没有本机 worktree 路径。分支 `sync/c1-inputs`，从 `swarm-tree` 的 `1419a29` 切出。
- 提交（基于 `1419a29`）：
  - `9c5534f` docs(C1): 写基础输入对齐 v0.7.1 的执行计划
  - `e3d1d82` feat(Field): 清除按钮的提示只说清除，读屏仍带字段名
  - `4b854fa` feat: TextArea、NumberInput、FileInput 接入 container/control 样式分层
  - `5d35550` feat: 隐藏标签的正名改为 isLabelHidden，旧名 labelHidden 仍可用
  - `8b1f8c5` feat(NumberInput): 分组数字在离开或回车时提交，超出范围再夹到边界
  - `3ba9c54` feat(TextArea): 按可见字符计数，接近和超出上限时再播报
  - `a67c728` feat(FileInput): 选中和清除都走 changeAction
  - `be594db` fix(FormLayout): 窄屏横向标签改回竖排时把控件拉满整行
  - `df7f8ab` docs(C1): 补样式分层、字数和数字提交的说明，并勾完台账
  - `347d844` chore: pnpm sync 导出 InputClearButton 和隐藏标签的解析
  - `ecf1f79` fix(Typeahead): 查询长度继续用抽出的可见字符计数
  - `15f0130` fix: 可见字符计数改放到 composables，避免和 Text 目录撞名
  - `17f28b6` chore: 按新的属性说明重新生成 CLI 目录
  - `effc93a` test: 服务端渲染清除按钮时补上必填的读屏名称

## 1. 做了什么

1. 清除按钮：新建 `InputClearButton.vue`。提示用 `@astryx.inputClearButton.tooltip`（Clear / 清除），`label` 仍是带字段名的读屏名称。TextInput、TextArea、NumberInput、FileInput 换上它。按钮加了 `position: relative`，粗指针 24px 热区继续用 `field.css` 里已有的 `::after`。
2. 样式分层：TextArea、NumberInput、FileInput 接上 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`。外壳和本体分开。直接写在组件上的 `class` / `style` 留在今天的本体，不丢、不警告。FileInput 以前把 class 吞掉了，现在落到文件框上。没有 Field 外壳时，container 样式不生效，开发环境警告一次。
3. 隐藏标签：正名 `isLabelHidden`，旧名 `labelHidden` 留着。Typeahead、Tokenizer、MultiSelector、Token 两个名字任一为真就藏。PowerSearch 默认隐藏，要分清「没传」和「传了 false」；两个都传时听正名。演练场的 `is-label-hidden` 现在能藏标签。
4. 数字：移植分组数字解析和整段提交。输入过程只留草稿，离开或 Enter 再提交。空草稿有清除按钮才清空，否则回到原值。超出范围收到最近的边界，输入过程中标成无效并播报。步进从草稿的读数走。步进图标用 `numberInput:stepperDown`。
5. 多行：按可见字符计数。接近 80% 用 polite 播报，超出用 assertive。超出时 `aria-invalid`。不再写原生 `maxlength`。
6. 文件：选中和清除调用 `changeAction`，失败发出 `actionError`。等待时按钮 `aria-busy` 并显示加载指示。
7. 表单布局：480px 以下的横向标签加上 `align-items: stretch`。数字框补上只对 iOS 生效的 16px 字号下限。
8. `pnpm sync` 导出 `InputClearButton`、`useResolvedLabelHidden`、`computeSteppedValue`、`countCharacters`。台账 82 条全部打勾。
9. 中英文文档补了四个样式属性、清除按钮提示，以及字数、数字提交、`changeAction`。

`labelHidden` 要写进 D7，再删。日期和选择器的清除按钮还没用 `InputClearButton`。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Field/InputClearButton.vue` | 42 | 提示和读屏名称分开的清除按钮 |
| `packages/core/src/composables/useResolvedLabelHidden.ts` | 40 | 正名和旧名怎么合成一个是否隐藏 |
| `packages/core/src/NumberInput/numberParser.ts` | 266 | 按语言读分组数字 |
| `packages/core/src/NumberInput/numberInputCommit.ts` | 75 | 离开时提交、清空或回到原值 |
| `packages/core/src/NumberInput/NumberInput.vue` | 438 | 草稿、夹范围、无效播报、步进 |
| `packages/core/src/TextArea/TextArea.vue` | 203 | 可见字符计数和播报 |
| `packages/core/src/FileInput/FileInput.vue` | 227 | 样式落点和 changeAction |
| `packages/core/src/PowerSearch/PowerSearch.vue` | 706 | 默认隐藏标签，文件比白名单短 1 行 |
| `packages/core/src/MultiSelector/MultiSelector.vue` | 763 | 只改了表达式，行数没变 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| FR10 | `container*` / `control*`，根上的 class 丢掉并警告，另有 `*Xstyle` | 四个样式属性。根上的 class/style 留在本体，不警告。不做 `*Xstyle` | 外壳和本体都能加样式。根上的写法是用户已定的 |
| FR11 | tooltip 是 Clear，label 带字段名 | 同一个翻译键和 label | 提示和读屏名字分开 |
| 隐藏标签 | 属性名 `isLabelHidden` | 正名加上旧名别名 | `is-label-hidden` 和 `label-hidden` 都能藏 |
| 数字提交 | 草稿到 blur/Enter 再决定；Intl 解析 | 同一套解析和决定 | 分组、夹范围、无效回退一致 |
| 多行字数 | 可见字符，80% 和超出播报，不写原生 maxlength | 同一阈值和播报 | 一个 emoji 算一个，可以输入超过上限 |
| FileInput changeAction | 选中和清除都调用 | 同样调用，失败再发 `actionError` | 选中和清除都会走上传动作 |
| FormLayout #7501 | 窄屏 `align-items: stretch` | 同一条 CSS | 控件拉满整行 |

## 3. 和计划不一样的地方

可见字符计数先放在 `src/text/`，和已有的 `src/Text/` 在大小写上撞车，检查没过。改到 `composables/countCharacters.ts`，Typeahead 从那里再导出。

数字框原先没有 iOS 16px 字号下限。核对时补上了，和文本框同一条条件。

PowerSearch 为了不越过 707 行白名单，收成 706 行。MultiSelector 只改模板表达式，仍是 763 行。

## 4. 台账处理

一共 82 条。已采纳 32 条，不适用 50 条。不适用的是别的节点（主题、日期、选择器的样式分层、无障碍契约测试、富文本）、StyleX 靶点、上游文档流水线，以及用户已定不照做的「根上 class 必须丢掉」。逐条理由在 `ledger/C1.md`。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`，TextInput、TextArea、NumberInput、FileInput、Field、FormLayout、Typeahead、InputGroup，外加 Token、Tokenizer、字号下限和两个组合式函数 | 过 | 22 个文件，319 条 |
| 2 | `NODE_ENV=production` 同一组 | 过 | 22 个文件，319 条 |
| 3 | `pnpm check:packages` | 过 | 退出码 0。行数和 `!important` 都过 |
| 3 | `pnpm lint` | 过 | 退出码 0 |
| 3 | `pnpm typecheck` | 过 | 退出码 0 |
| 3 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 全量 | 先有 1 条失败 | 270 个文件里服务端渲染 `InputClearButton` 缺 `label`。补上夹具后该文件 213 条通过。全量当时是 3678 通过、1 失败 |
| 3 | `pnpm build` | 过 | 退出码 0 |
| 3 | `pnpm lint:pkg` | 过 | 退出码 0 |
| 4 | 视觉对照 | 无 | 计划写明本轮不新开浏览器。落点、提示、标签隐藏、数字提交由测试守住 |

## 6. 拿不准的地方

`labelHidden` 要进 D7 迁移说明，这一轮只保留别名，没有删。

日期输入和选择器的清除按钮还是原来的 IconButton，没有换成 `InputClearButton`。留给对应节点。

PowerSearch 默认隐藏。两个名字都传了的时候听 `isLabelHidden`。其余组件是任一为真就隐藏。
