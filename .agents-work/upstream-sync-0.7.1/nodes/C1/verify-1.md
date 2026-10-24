# C1 验收报告 · 第 1 轮

结论：通过（22/22）

- 工作区：云端检出，分支 `sync/c1-inputs`，提交 `0aeaf61`（本报告提交前）。
- 比较基点：`BASE = 1419a29`（`git merge-base HEAD origin/swarm-tree`）。`origin/swarm-tree` 比这个基点多 1 个文档提交 `7dfb511`，没有和本分支冲突。
- 临时文件：`/tmp/verify-C1/`。截图在 `/opt/cursor/artifacts/c1-verify/`，自己用 `pnpm visual --no-proxy` 重新生成，没有用实现者的产物，也没有放进 git。
- 只读检查：开始时 `git status` 是干净的。结束时工作区只有这两份验收文档，业务源码没有改动。探针测试文件用完已删。
- 临时改动：无。探针写在 `/tmp` 时解析不到依赖，改放到 `packages/core/src/c1-verify-probe.test.ts` 跑完 4 条后立即删除，`git status` 里没有它。
- 浏览器：`pnpm visual` 自带浏览器锁，端口 5172。五次都正常退出。结束时 5172 没有监听，没有残留浏览器进程。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 样式分层 | 过 | `TextInput.parts.test.ts`、`TextArea.parts.test.ts`、`NumberInput.parts.test.ts`、`FileInput.parts.test.ts` 都在两组里通过。`container*` 在外壳，`control*` 在本体，不进原生控件。InputGroup 和横向 FormLayout 里外壳不生效并警告一次。 |
| 2 | 根上 class/style | 过 | TextInput 用例断言根上的 `root-a` 和行内样式留在 `.astryx-text-input`，和 `controlClass` 同时生效，`console.warn` 没被调用。FileInput 的 class 落在 `.astryx-file-input`。`fieldParts.ts` 的 `controlClass()` 是 `[attrs.class, props.controlClass]`，警告只针对没有外壳时的 `container*`。 |
| 3 | 清除按钮提示和读屏名 | 过 | `InputClearButton.test.ts`：中文 `aria-label` 是「清除姓名」，`[role="tooltip"]` 是「清除」；英文是 “Clear Name” / “Clear”。文案在 `locale/messages/input.ts`。 |
| 4 | 隐藏标签 | 过 | 探针：模板 `is-label-hidden` 和 `label-hidden` 都让 Typeahead 的 `.astryx-field-label-group` 带 `data-hidden="true"`，标签文字「Search」仍在 DOM。TextInput 的 `is-label-hidden` 同样藏起「Name」并留下文字。`useResolvedLabelHidden.test.ts` 覆盖默认隐藏时「没传」和「传了 false」。InputGroup 对照图里内层 Amount/URL 不显示，外壳 Price/Website 还在。 |
| 5 | 数字离开或回车才提交 | 过 | 现有用例：逐键不提交，blur 才提交；`1,234` blur 后是 1234；无效草稿 Enter 不提交，blur 回到 5，并有 “Invalid number”。探针：输入 `10` 时没有 `update:modelValue`，Enter 提交 10；`1,234` 在 `isComposing` 的 Enter 下不提交，普通 Enter 提交 1234。 |
| 6 | 多行按可见字符计数 | 过 | `TextArea.test.ts`：`👍👍` 在上限 2 时显示 `2 / 2`，没有 `data-over`。超限时 `data-over` 和 `aria-invalid` 为真，原生 textarea 没有 `maxlength`。计数来自 `countCharacters`（`Intl.Segmenter`）。 |
| 7 | 左右对照图 | 过 | 五张都看过，见「看图」。结构对齐。差在示例文案和文档预览区高度，不是控件坏了。 |
| 8 | 键盘 | 过 | 探针里有效数字按 Enter 提交，组字中的 Enter 不提交。清除按钮是带 `label` 的 IconButton，测试能读到名称。 |
| 9 | 读屏 | 过 | 清除按钮可访问名带字段名。隐藏标签用 `data-hidden` 做视觉隐藏，文字还在。无效数字有 `role="alert"`。 |
| 10 | 服务端渲染 | 过 | `ssr-known-failures.json` 是 `{}`。全量冒烟通过。夹具里有 TextInput、TextArea、FileInput、Field、FieldStatus、InputClearButton（`label: 'Clear Name'`）。NumberInput、FormLayout、InputGroup 走默认夹具，没有抛错。 |
| 11 | 空数据和超长 | 过 | 空草稿：不能清除就回到原值，能清除才清空（`NumberInput.test.ts`）。超长多行只把计数标红。窄屏图里文字没有撑出屏幕。 |
| 12 | 图标 | 过 | `semantic.ts` 里 `upload: 'lucide:upload'`。步进用 `numberInput:stepperDown`，画在 `glyphs.ts`，主题可用 `defineTheme({ icons })` 替换。没有另一套注册表。 |
| 13 | 没有 !important | 过 | `node scripts/check-no-important.mjs` 退出码 0。本轮 CSS diff 里没有 `!important`。 |
| 14 | 台账 | 过 | 82 条都是 `- [x]`，已采纳 32，不适用 50，没有缺理由。抽查已采纳：`936b1f73a` 的四套 parts 测试通过；`75e430144` 提示与读屏名分开；`86a7f1752` emoji 算一个。不适用抽查站得住：`a1a6a636f` 是主题兼容层归 B1；`da6f47086` 选择器样式分层归 C3；`2e0dbb5b9` 日期归 C5；`e5ad5c7b1` 禁止根上样式是用户已定不照做。 |
| 15 | 两种 NODE_ENV 的相关测试 | 过 | 同一组路径，`env -u NODE_ENV` 和 `NODE_ENV=production` 都是 21 个文件、513 条，退出码 0。日志在 `/tmp/verify-C1/vitest-dev.log`、`vitest-prod.log`。 |
| 16 | 中英文文档 | 过 | TextInput、TextArea、NumberInput、FileInput 的中英文 props 写了 `containerClass` / `containerStyle` / `controlClass` / `controlStyle`。清除按钮写明提示只说「清除」/ “Clear”，读屏名带字段名。Typeahead 写了 `isLabelHidden`，并注明 `labelHidden` 是旧名。`pnpm --filter @astryx-vue/cli generate:check` 通过。演示 `meta.ts` 只登记标题，这轮没有新示例，不必改。文档页能渲染，见对照图。 |
| 17 | 四种组合亲眼看过 | 过 | 桌面浅色、桌面深色、390 浅色、390 深色都有图，见下表。 |
| 18 | 行数 | 过 | `node scripts/check-line-limit.mjs` 退出码 0。新文件都短于 500 行。`PowerSearch.vue` 从 707 行收到 706 行，仍在白名单。`MultiSelector.vue` 仍是 763 行，和基线相同。拆分按计划留给 C4、C3。 |
| 19 | 全量测试 | 过 | 不设 `NODE_ENV`：270 个产品测试文件、3679 条通过。同一次命令还加载了写坏的 `/tmp` 探针（0 条，解析失败），不是产品失败。`NODE_ENV=production`：270 个文件、3679 条，退出码 0。两边用例数相同。 |
| 20 | 分步检查 | 过 | `check:packages` 0，`lint` 0，`typecheck` 0，全量测试 0，`build:packages` 0，`docs:build` 0（47.88 秒），`lint:pkg` 0。合起来就是 `pnpm check` 的各步。 |
| 21 | 改动范围和生成文件 | 过 | `git diff 1419a29 --stat` 是输入组件、隐藏标签、文档、台账、CLI catalog。`sync-exports.mjs --check` 退出码 0。没有改 `ROADMAP.md` 的状态。 |
| 22 | 注释不写修改历史 | 过 | diff 里「改成」「原来」「之前」落在台账、实现回报和「发生在 changeAction 之前」这句说明，不是源码里讲这次怎么改的。 |

## 看图

五张都是左上游、右我们。没有空白页，没有报错层。

| 图 | 看到的内容 |
| --- | --- |
| `/opt/cursor/artifacts/c1-verify/TextInput/desktop-light/side-by-side.png`（912×513，内容差 9.83%） | 浅色。两边都是标签在上、输入框在下。上游是 “Name” 和占位符 “Enter your name”。我们是 “Name”、说明 “How we should address you.” 和预填 “Ada Lovelace”。差在示例文案，框的位置和浅色底一致。 |
| `/opt/cursor/artifacts/c1-verify/TextInput/desktop-dark/side-by-side.png`（912×513，内容差 10.08%） | 深色底，文字是浅色。结构和浅色那张一样，没有变成白底。 |
| `/opt/cursor/artifacts/c1-verify/TextArea/mobile-light/side-by-side.png`（上游 684×320，我们 708×640，内容差 35.45%） | 390 浅色。两边都有标签和多行框。上游标签是 “Description”，占位符 “Enter a description...”，框拉满预览区。我们是 “Bio”、说明和 “A short introduction.”，框在卡片中间，右下有拖动角。差在示例文案和文档预览区留白，窄屏没有把字挤出屏幕。 |
| `/opt/cursor/artifacts/c1-verify/NumberInput/mobile-dark/side-by-side.png`（上游 684×320，我们 708×640，内容差 23.79%） | 390 深色。两边都是 “Quantity”、“0 items” 和右侧上下步进。上游框拉满深色预览条，我们的框较窄、居中，四周是深色。步进都在，没有白底。高度差来自预览区，不是控件缺了一块。 |
| `/opt/cursor/artifacts/c1-verify/InputGroup/desktop-light/side-by-side.png`（912×513，内容差 4.06%） | 浅色。两边都有 “Price”（$ 和 0.00）和 “Website”（https://、example、.com）。内层 TextInput 的 Amount、URL 标签都没显示，外壳标签还在。边框深浅略有差别，布局对齐。 |

## 对实现者偏离计划的判断

合理。可见字符计数从 `src/text/` 改到 `composables/countCharacters.ts`，是为了躲开和 `src/Text/` 的大小写冲突，测试仍按可见字符计数。数字框补上只对 iOS 粗指针生效的 16px 下限，和文本框是同一条条件。PowerSearch 少了 1 行，没有越过白名单。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

示例文案和上游预览不一致，像素差主要来自这里，以及窄屏预览区我们更高。这不是这轮输入行为的问题。下次如果要像素对齐，先把 overview 示例的文案和宽度收成同一套。
