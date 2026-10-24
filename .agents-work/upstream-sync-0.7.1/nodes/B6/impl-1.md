# B6 公共 props 规则与样式分层 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B6`，分支 `sync/b6-props`。只在本地提交，没有推送。
- 提交（基于 `473a490`）：
  - `62c3ed0` feat(Field): 新增样式分层工具，TextInput 接入 containerClass/controlClass
  - `ea42a91` feat(core): Layout、MetadataList、导航菜单项透传属性补测试，NavHeadingMenuItem 透传属性
  - `e572301` feat(NavMenu): NavHeadingMenu 透传属性，菜单项取消按键后方向键导航仍正常
  - `83ff58b` test(composables): 守护 0.6 已删除的废弃 API 不会回来
  - `db71551` docs(ledger): B6 台账 36 条全部写上结论

## 1. 做了什么

1. **样式分层工具**：新建 `Field/fieldParts.ts`，导出类型 `FieldPartStylingProps`（四个属性，各带 JSDoc）和函数 `useFieldPartStyling`。它把 TextInput 原来的 `controlledAttrs` / `inputAttrs()` 提炼成通用的。返回 `hasFieldBox`、`containerClass`、`containerStyle`、`controlClass()`、`controlStyle()`、`forwardedAttrs()`。`FieldPartStylingProps` 从 `Field/index.ts` 导出类型。
   - 没有外壳的判断：在 InputGroup 里（`inject(INPUT_GROUP_KEY)` 非空），或在 `horizontal-labels` 的 FormLayout 里（`useFormLayout().direction`）。这时 `container*` 不传给 Field，开发环境用 `useDevWarning` 警告一次，文案含 `no Field box renders`。这个警告我直接做了，不用留给 C1。
2. **TextInput 示范**：`Field` 加 `:class` / `:style` 接 `container*`（Field 根元素本来就会继承 class/style，不用加 prop）。`.astryx-text-input` 上用 `controlClass()` / `controlStyle()`，是根上直接写的 `class`/`style` 加 `controlClass`/`controlStyle`，两者都生效。文档页中英文都加了「给外壳和本体加样式」一节和 4 行 props，原生属性一节的说明也改了。`pnpm sync` 和 CLI catalog 已重新生成。
3. **非表单组件透传**：Layout、MetadataList、TopNavMegaMenuItem 我们原本就透传，补了测试。NavHeadingMenuItem 原来会把属性落在根上，但不会让 `role`、`aria-disabled` 优先，改成 `inheritAttrs:false` + `v-bind="$attrs"` 放在 class 之前，组件自己的 role 和 aria-disabled 优先（测试覆盖）。NavHeadingMenu 改成 `inheritAttrs:false`，用 `@keydown.capture` + 弱集合记录「捕获阶段就已取消」的按键，菜单项取消按键后方向键照常导航，在菜单上取消才停。useAnnounce 清空时取消排队写入，本来就有，补了多条排队和重置的测试。
4. **0.6 废弃 API**：见第 4 节，我们都没有这些 API，没有要删的代码。新增守护测试。
5. **台账**：36 条全部打勾并写结论。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `Field/fieldParts.ts` | 106 | 样式分层类型和 composable |
| `Field/fieldParts.test.ts` | 21 | 工具的单元测试 |
| `TextInput/TextInput.vue` | 167 | 示范接入 |
| `TextInput/TextInput.parts.test.ts` | 103 | 4 属性落点、根 class 不变、透传、InputGroup/FormLayout 警告 |
| `NavMenu/NavHeadingMenu.vue` | 139 | 透传 + 取消按键后导航 |
| `NavMenu/passThrough.test.ts` | 79 | 菜单和菜单项透传、键盘 |
| `TopNav/passThrough.test.ts` | 约 30 | TopNavMegaMenuItem 透传 |
| `composables/deprecatedApis.public.test.ts` | 约 60 | 废弃 API 守护 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| FR10 part 属性 | `containerXstyle/ClassName/Style`、`control*`，根上的 className/style 是类型错误并警告 | 只做 `containerClass/Style`、`controlClass/Style`，根 `class/style` 保持今天落点，不报错不警告（用户决定） | 外壳和本体的样式能力一致。唯一不同是根上直接写 class 在 Vue 里不被拒绝，这是用户已拍板的 |
| `useFieldInputStyling` | 返回 `hasFieldBox` 和要传给 Field 的 container | `useFieldPartStyling`，另外把 attrs 拆分也收进来 | 落点和警告条件相同 |
| #7331 透传 | 各组件 `{...restProps}` | Vue 的 attrs 透传 | 同一批属性落在同一元素上 |
| NavHeadingMenu 取消按键 | 捕获阶段记 WeakSet | 同样思路，用 Vue 的 `.capture` | 键盘行为相同 |
| useAnnounce | 取消排队帧 | 照上游，我们已有 | 相同 |
| #6118、#7289 | 删旧 API | 我们没有，加守护测试 | 公共 API 面相同 |

## 3. 和计划不一样的地方

- 工具放在 `Field/fieldParts.ts`，不是 `composables/internal/partStyling.ts`。理由：它依赖 Field 的位置概念，类型要从 `Field` 入口导出，放在 Field 目录里和上游 `Field/fieldParts.ts` 对应，也不会被 `pnpm sync` 当成 composable 导出。
- 没有向上游那样加 `expectFieldInputProps` 类型检查工具和共用渲染测试套件。机制测试只在 TextInput 上写了。C 节点接入时如需共用，可以把 `TextInput.parts.test.ts` 抽成 `describeFieldParts`。我没有扩大范围去抽。
- 计划说「4 个非表单组件」逐个修，实际只有 NavHeadingMenuItem 和 NavHeadingMenu 要改代码，其余三个只补测试。

## 4. 台账处理

36 条全部打勾。已采纳 6 条：`3c50fccc8`、`43635fa9d`、`3045edad6`、`e5ad5c7b1`、`e3c1cfdd5`（部分）、`df7574947`（交接）。其余 30 条不适用，理由是上游内部规范文档、React 专用或 StyleX、归别的节点。逐条理由见 `ledger/B6.md`。

0.6 废弃 API 的 grep 证据（在 `packages/core/src packages/cli apps tests` 内，排除 node_modules 和 catalog.json）：

| 命令 | 结果 |
| --- | --- |
| `grep -rn "isImeKeyEvent"` | 只在 `composables/internal/ime.ts` 和内部调用方，`composables/index.ts`、`src/index.ts` 没有。已由守护测试验证 |
| `grep -rnE "\bisRtl\b"` | 只有 MoreMenu、ButtonGroup、TreeList、SegmentedControl、scrollGeometry 里的局部函数或变量，useGridFocus / useListFocus 没有此选项，方向从 `getComputedStyle(...).direction` 读 |
| `grep -rnE "minSizePx\|maxSizePx"` | 只有 `_minSizePx` / `_maxSizePx`，是 `useResizable` 返回给 ResizeHandle 的内部字段，公共选项只有 `minSize` / `maxSize` |
| `grep -rn "emptySearchResultsText"` | 无结果。只有 `emptySearchText`（上游改名后的目标名） |

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2` | 过 | 252 个文件、3414 条用例 |
| 2 | `NODE_ENV=production pnpm vitest run --maxWorkers=2` | 过 | 252 个文件、3414 条，用例数相同 |
| 3 | `check:packages`、`lint`、`typecheck`、`build`、`lint:pkg`（都加 `env -u NODE_ENV`，test 换成上面的 vitest） | 过 | 每一步退出码 0 |
| 4 | 浏览器 | 过 | 5171 端口，`browser-lock run`，截图 `nodes/B6/evidence/1/text-input-parts.png`（红框外壳、蓝框本体）。DevTools 读出：`container-class` 在 `div.astryx-field`，`control-class` 和根 `class` 都在 `div.astryx-text-input`，`data-testid` 在 `input`，原生 input 上没有任何这三个 class。演示文件已还原，文档站已关，浏览器锁已还 |
| 5 | 文件行数、`!important` | 过 | 新增或改动的源码都在 170 行内；`check-no-important` 在 check:packages 里通过 |

## 6. 拿不准的地方

- `containerClass` 的类型用 `HTMLAttributes['class']`，Vue 把 `boolean | string | object | array` 联合里缺省值转成 `false`，所以 `isSet()` 把 `false` 当成没传，否则普通 TextInput 在 InputGroup 里也会警告。C 节点用工具时不用再处理。
- `Field` 的 `inheritAttrs` 是默认的，所以 `container*` 靠 `Field` 根元素继承 class/style。如果以后 Field 改成 `inheritAttrs:false`，要同步改。
- 和上游 FR10 不同：上游规定的 `ref` / `id` / 事件落在主语义控件上，我们 TextInput 一直如此；其他组件今天并不都这样，见下表。

## 7. 交给 C1/C2/C3/C5 的 FR10 接入清单

工具：`useFieldPartStyling({ component, props, attrs, reservedAttrs })`（`Field/fieldParts.ts`），类型 `FieldPartStylingProps`。用法：组件 `inheritAttrs:false`，props 类型继承 `FieldPartStylingProps`；`<Field :class="parts.containerClass.value" :style="parts.containerStyle.value">`；本体 `:class="parts.controlClass()" :style="parts.controlStyle()"`；主语义控件 `v-bind="parts.forwardedAttrs()"`。`reservedAttrs` 写组件自己管的名字（`id`、`aria-labelledby`、`aria-describedby` 等）。Field 外壳无需加 prop。

规则：直接写的 `class`/`style` 保持今天落点，不警告；`container*` 只落外壳、`control*` 只落本体、不改道；InputGroup 和 horizontal-labels 里 `container*` 不生效并警告（工具已做）；接入时保持各组件已有的处理函数顺序（`df7574947`）。

上游目标表（中文），加上我对我们每个组件的实测结果（实测方法：给组件传 `class`、`data-testid`、`id`，看各落在哪）：

| 组件 | 上游：直接写的 class/style 今天落在 | 主语义控件 | 我们今天：class 落在 | data-testid 落在 | id 落在 | 和上游一致吗 | 交给 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TextInput | 本体 | 原生 input | 本体 | input | input | 一致，已接入 | 已做 |
| TextArea | 本体 | 原生 textarea | 本体 | textarea | textarea | 一致 | C1 |
| NumberInput | 本体 | 原生 input | 本体 | input | input | 一致 | C1 |
| FileInput | 本体 | 原生 file input | 丢了（没落在任何元素） | 丢了 | 触发按钮 | **不一致**：class 和 data-testid 都被吞 | C1 |
| DateInput | 本体 | 日期输入 | 丢了 | 丢了 | input | **不一致** | C5 |
| DateRangeInput | 本体 | 范围触发按钮 | 丢了 | 丢了 | 触发按钮 | **不一致** | C5 |
| DateTimeInput | 本体 | 日期时间输入 | 外壳（Field） | 外壳 | 丢了 | **不一致**：落点是外壳，不是本体 | C5 |
| TimeInput | 本体 | 时间输入 | 外壳 | 外壳 | input | **不一致**：class 在外壳，id 在 input | C5 |
| Selector | 本体 | 触发按钮 | 丢了 | 丢了 | 丢了 | **不一致**，且没有 `id` 属性 | C3 |
| MultiSelector | 本体 | 触发按钮 | 丢了 | 丢了 | 丢了 | **不一致**，且没有 `id` 属性 | C3 |
| ComplexSelector | 本体 | 触发按钮 | 外壳 | 外壳 | 外壳 | **不一致**：全部落在外壳 | C3 |
| Typeahead | 外壳 | combobox input | 丢了 | input | 丢了 | **不一致**：class 被吞，data-testid 已在 input | C3 |
| Tokenizer | 外壳 | combobox input | 丢了 | input | 丢了 | **不一致**：同上 | C3 |
| CheckboxList | 外壳 | group 元素 | 外壳 | 外壳（根 `.astryx-field`） | 丢了 | class 一致；data-testid 应在 group 元素 | C2 |
| RadioList | 外壳 | radiogroup 元素 | 外壳 | 外壳 | 丢了 | class 一致；data-testid 应在 radiogroup | C2 |
| Slider | 外壳 | slider 控件 | 外壳 | 外壳 | 丢了 | class 一致；data-testid 应在 slider 控件 | C2 |

说明：「丢了」指挂载后在页面里找不到该属性。这些「不一致」的行是 C 节点要决定的，我没改这些组件。用户已拍板的规则是「直接写的 class/style 保持今天落点，不丢弃」，所以「丢了」的组件（FileInput、DateInput、DateRangeInput、Selector、MultiSelector、Typeahead、Tokenizer）如果今天确实被吞，接入时应该让它们落在上游目标表指定的部件，这是一次行为修正，不是破坏。请 C 节点确认后写进迁移说明。

## 8. 给 D7 迁移指南的说明

- 新增四个属性：`containerClass`、`containerStyle`、`controlClass`、`controlStyle`（只有 TextInput 已接入，其他组件随 C1/C2/C3/C5 陆续接入）。
- 和上游不同：我们不拒绝也不警告根上直接写的 `class` / `style`，所以不需要上游 `astryx upgrade` 里「把根 className 改成 control*」的那一步。用户想把样式明确放到外壳或本体，才改用新属性。
- 迁移指南里不要写 `*Xstyle`，我们没有。
- NavHeadingMenuItem、NavHeadingMenu 现在会透传 `id`、`aria-*`、`data-*`、事件监听，调用方原来写了这些属性但被忽略的，现在会生效。
- 0.6 废弃 API（`isImeKeyEvent` 从 hooks 导出、`isRtl`、`minSizePx`/`maxSizePx`、`emptySearchResultsText`）在 Vue 版本从没存在，迁移指南里只需写「不适用，Vue 版没有这些名字」。
