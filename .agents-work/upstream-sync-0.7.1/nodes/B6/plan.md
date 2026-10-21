# B6 公共 props 规则与样式分层 · 执行计划

## 目标

这个节点做三件事，都是「组件对外接口的公共规则」：

1. **FR10 样式分层机制（只搭机制）**：给所有带 Field 的输入组件准备一套统一的工具，用来把两组新属性分别放到对的元素上：
   - `containerClass` / `containerStyle`：落到外壳，也就是 Field 那一层。
   - `controlClass` / `controlStyle`：落到输入框本体，也就是画边框和背景、里面装着图标和清除按钮的那个盒子。

   本节点只做工具、类型和测试，**每个组件的接入交给 C1、C2、C3、C5**。为了证明机制能用，本节点只接一个组件 TextInput 做示范。
2. **非表单组件透传属性**（上游 #7331）：Layout、MetadataList、NavHeadingMenuItem、TopNavMegaMenuItem 这 4 个组件，用户写在它们身上的 `id`、`data-*`、`aria-*`、事件监听等属性，要真正落到元素上，不能被吞掉。
3. **清理 0.6 废弃 API**（上游 #6118、#7289）：核对上游删掉的那几个旧 API。我们这边如果有，就删掉；没有，就在台账里写「不适用」，并附上 grep 证据。

## 用户已经拍板的决定（必须遵守）

上游 FR10 规定：直接写在 Field 类组件上的 `className` / `style` 是类型错误，运行时会被丢掉，并给出开发警告。**我们不照这一条做。** 在 Vue 里，任何组件都能直接写 `class` 和 `style`，这是 Vue 用户的直觉。

所以我们的规则是：

- 新增 `containerClass`、`containerStyle`、`controlClass`、`controlStyle` 四个属性。命名用 Vue 习惯的 `Class`，不用 React 的 `ClassName`。上游的 `*Xstyle` 是 StyleX 专用的，我们没有 StyleX，不做。
- **直接写的 `class` / `style` 仍然落在今天落的地方，行为不变，也不发警告。** 今天落在哪，就是上游 codemod 的迁移目标，见下表最后一列。
- 其他透传属性（`id`、`data-*`、`aria-*`、`hidden`、`inert`、`dir`、DOM 事件）要落到「主语义控件」上，也就是表格里「主语义控件」那一列。这一条本节点只写进工具和文档，具体接入由 C 节点做。

上游 v0.7.1 的目标表在 `docs/families/input-fields.md` 第 355–380 行，读法：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:docs/families/input-fields.md`。你要把这张表翻译成中文，放进回报，同时写进给 C 节点的交接清单：

| 组件 | 直接写的 class/style 今天落在 | 主语义控件 | 交给 |
| --- | --- | --- | --- |
| TextInput、TextArea、NumberInput、FileInput | 本体（control box） | 原生 input / textarea | C1 |
| DateInput、DateRangeInput、DateTimeInput、TimeInput | 本体 | 日期 / 时间输入或触发按钮 | C5 |
| Selector、MultiSelector、ComplexSelector | 本体 | 触发按钮 | C3 |
| Typeahead、Tokenizer | 外壳（Field） | combobox input | C3 |
| CheckboxList、RadioList、Slider | 外壳（Field） | group / radiogroup / slider | C2 |

写表之前，**先核实我们这边每个组件今天的 class/style 实际落在哪**：读每个组件的模板，找 `attrs.class`、`v-bind="attrs"`、`inheritAttrs`。如果我们和上游表不一样，就在表里标出来，交给对应的 C 节点决定。本节点不改这些组件。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B6`，分支 `sync/b6-props`，已经建好。槽位和端口用 `node scripts/swarm/worktree.mjs ls` 查。
- 先读这些：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md` 的「对齐上游的标准」「不用 `!important`」「跑检查时的环境」三节。
  - 台账 `.agents-work/upstream-sync-0.7.1/ledger/B6.md`，共 36 条。其中大部分是上游的规范文档提交（`docs:`、`spec(...)`），通常结论是「不适用：上游内部规范文档」，或者「已采纳到 xx」。每一条都要写结论。
  - 上游规范：`v0.7.1:docs/families/input-fields.md` 的 FR10（第 193–230 行），`v0.7.1:docs/specs/AST-071-styling-library-compat/spec.md`。
  - 上游的示范实现，看一个就够：`git -C ../astryx-upstream show v0.7.1:packages/core/src/TextInput/TextInput.tsx`，搜 `containerClassName` 和 `controlClassName`；还有 `TextInput.fr10.test.tsx`（如果存在）。
  - 我们的 TextInput：`packages/core/src/TextInput/TextInput.vue`。今天 `attrs.class` 和 `attrs.style` 落在 `.astryx-text-input` 这个盒子上，其余 attrs 落在原生 input 上。这已经接近 FR10 了。
- 环境纪律：所有测试和构建命令都加 `env -u NODE_ENV`；vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：整台机器同时最多 2 个浏览器会话。只能通过 `node scripts/swarm/browser-lock.mjs run --purpose B6 -- <命令>` 开浏览器。文档站用你的槽位端口，用完关掉。

## 开发步骤

每做完一步，测试通过就提交一次。

1. **样式分层工具**：新建 `packages/core/src/composables/internal/partStyling.ts`，或者放在你认为更合适的位置，在回报里说明原因。内容包括：
   - 一个类型 `FieldPartStylingProps`：

     ```ts
     containerClass?: HTMLAttributes['class']
     containerStyle?: StyleValue
     controlClass?: HTMLAttributes['class']
     controlStyle?: StyleValue
     ```

     每个属性都写 JSDoc，中英文都可以，说明它落到哪个元素上。
   - 一个小函数或 composable，用来把透传属性拆成两部分：一份给主语义控件，一份是 class/style 默认落点的那部分。TextInput 现在已经有 `controlledAttrs` 和 `inputAttrs()` 这套逻辑，把它**提炼成通用的**，其他组件以后可以直接复用，避免每个组件各写一遍（DRY）。
   - 规则：`containerClass` / `containerStyle` 只落在 Field 外壳上，`controlClass` / `controlStyle` 只落在本体上，**永远不会改道**（上游 FR10 第 5 条）。
   - 没有外壳的情况：在 InputGroup 里，以及横向标签的 FormLayout 里（Field 会把子元素直接排进表单的列里），`container*` 不生效，开发环境给一条警告。具体怎么判断「有没有外壳」，读我们的 `Field.vue`、`InputGroup`、`FormLayout` 来定。如果现在判断不了，就只做到「不生效」，警告留给 C1，并在回报里写明。
2. **示范接入 TextInput**：
   - 接上 `containerClass` / `containerStyle`，落到 Field 外壳上。读 `Field.vue`，看它的根元素能不能接 class/style；不能的话，加两个 prop 把它们传下去。
   - 接上 `controlClass` / `controlStyle`，落到 `.astryx-text-input` 上。
   - 根上直接写的 `class` / `style` 仍然落在 `.astryx-text-input`，和今天一样。controlClass 和根 class 同时出现时，两者都要生效。
   - 写测试，覆盖这几种情况：
     - 4 个新属性各落在对的元素上；
     - 根 class/style 行为不变；
     - `data-testid`、`id`、`aria-*`、`onFocus` 落在原生 input 上；
     - 在 InputGroup 里使用时，`container*` 不生效。
   - 在 TextInput 的文档页（中英文）加一小节「给外壳和本体加样式」，并补上 props 表。
3. **非表单组件透传**：读上游 #7331 的 diff：`git -C ../astryx-upstream show 43635fa9d`。对我们这边的 Layout、MetadataList、NavHeadingMenuItem、TopNavMegaMenuItem 各写一条测试：传 `data-testid`、`id`、`aria-label`、`onClick`，断言它们落在组件的根元素上；如果上游指定了别的元素，就以上游为准。测试不过就修。
   - 同一个提交里还有两件小事，也照做并写测试：
     - NavHeadingMenu 中，某个菜单项的事件处理函数调用了 `preventDefault` 之后，键盘导航仍然正常；
     - `useAnnounce` 清空播报区时，取消已经排进下一帧的写入。
4. **0.6 废弃 API**：上游 #6118 删掉了这些：
   - 从 hooks 总入口导出的 `isImeKeyEvent`（改到 utils 里）；
   - `useGridFocus` / `useListFocus` 的 `isRtl` 选项（方向改从容器读）；
   - `useResizable` 的 `minSizePx` / `maxSizePx`（统一成 `minSize` / `maxSize`）。

   #7289 删掉了 Typeahead、Tokenizer、ChatComposerInput 的 `emptySearchResultsText`。逐个 grep 我们的代码和文档：
   - 有就删，同时把文档、示例、测试一起改掉；
   - 没有就在台账里写「不适用：我们没有这个 API」，并附上 grep 命令和结果。

   最后照上游的 `deprecatedApis.public.test.ts` 写一条守护测试：断言这些名字不在公共导出里，也不在类型里（用 `@ts-expect-error`）。
5. **交接清单**：在回报里写一节「交给 C1/C2/C3/C5 的 FR10 接入清单」，内容是上面那张表，再加上每个组件今天的实际落点、它的主语义控件是哪个元素，以及要用的工具函数名。
6. 跑 `pnpm sync`。
7. **台账**：36 条全部打勾，并写上结论。

## 不碰的范围

- 除了 TextInput，不改任何 Field 类组件的接入。
- 不改主题、浮层、locale、reset。
- 生成文件只能通过 `pnpm sync` 生成。

## 自测要求

1. 两种 NODE_ENV 下，全量 vitest 都通过，用例数相同。
2. 完整跑一遍 `env -u NODE_ENV pnpm check`（其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`），要通过。
3. 在浏览器里给 TextInput 示例加上 `container-class`、`control-class`、`class`，截图证明各自落在对的元素上（DevTools 读 class 也可以）。
4. 新增或改动的源码文件不超过 500 行。不用 `!important`。

## 提交与回报

- 在分支上提交，提交信息用中文。不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/B6/impl-1.md`，格式按 `templates/impl-report.md`，另外加上「交接清单」和「给 D7 迁移指南的说明」两节。
- 最终回复用中文，300 字以内。
