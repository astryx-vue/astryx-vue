# B2 reset 与基础样式 · 执行计划

## 目标

把 `@astryx-vue/core/reset.css` 换成上游 v0.7.1 的完整全局 reset。现在我们的 `reset.css` 只有一行 `@layer astryx.reset;`，上游是一份 423 行的「preflight」，和 Tailwind Preflight、modern-normalize 是同一类东西。

用户决定按上游对齐，所以这是一个**破坏性改动**：已经引入 `reset.css` 的用户，页面上全局标签的默认样式会变。具体会变成这样：

- 所有元素 `box-sizing: border-box`。
- 去掉默认的外边距和内边距，列表去掉圆点。
- 图片和媒体元素变成块级，并且能自适应宽度。
- 表单控件继承字体。
- 带交互的元素显示手型指针；禁用的元素统一用默认指针，不用 `not-allowed`（上游 #5323、#5335）。
- `::before`、`::after`、`::placeholder` 和搜索框也一起重置（#7355）。
- 输入框最小 16px 字号，只在 iOS 上生效，防止 iOS 聚焦时自动放大（#6085）。
- `hidden="until-found"` 的内容仍然能被浏览器的页内查找搜到（#7520）。
- reset 自己注册层级顺序，加载顺序无论怎么排都成立（#7585）。

**组件的外观不能因此变差。** 文档站、演练场里的组件要和改动前一样，或者更接近上游。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B2`，分支 `sync/b2-reset`，已经建好。槽位和端口用 `node scripts/swarm/worktree.mjs ls` 查。
- 动手前先读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md` 里这几节：「对齐上游的标准」「不用 `!important`」「跑检查时的环境」。
  - 台账 `.agents-work/upstream-sync-0.7.1/ledger/B2.md`，共 7 条。
  - 上游 reset：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/core/src/reset.css`，另外看同目录下的 `reset.test.ts`、`reset.until-found.test.ts`、`reset.a11y.chromium.spec.ts`、`inputFontFloor.test.ts`。
  - 上游文档站是怎么引入 reset 的：`v0.7.1:apps/docsite/src/app/globals.css` 第 3 行。
- 我们这边：
  - `packages/core/reset.css`，目前只有一行。
  - `packages/core/package.json` 里 `./reset.css` 的导出。
  - 各组件样式第一行都声明了 `@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;`
  - 安装指南 `apps/docs/docs/{zh,en}/guide/installation.md` 第 32–34 行附近，有对 reset 的说明。
- 环境纪律：所有测试和构建命令都加 `env -u NODE_ENV`，vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多开 2 个浏览器会话。
  - 只能用 `pnpm visual ... --out /tmp/B2-...`，或者 `node scripts/swarm/browser-lock.mjs run --purpose B2 -- <命令>`。
  - 文档站用你的槽位端口，用完关掉。

## 上游这些改动，用户看到了什么

| 台账条目 | 用户看到的变化 |
| --- | --- |
| 整份 reset 本身（0.4.1 时上游已有，我们一直没有） | 引入 reset 后，页面得到干净一致的起点。组件在各个浏览器里的默认样式一致 |
| #7355 `7ec7d16d3`（破坏性） | 伪元素、占位文字、搜索框也被重置。Firefox 的占位文字不再变淡，搜索框不再显示浏览器自带的清除按钮 |
| #5323 → #5335 | 禁用的控件统一用默认指针 |
| #6085 | 只在 iOS 上把输入框字号兜底到 16px，其他平台不受影响 |
| #7520 | `hidden="until-found"` 的折叠内容，可以用 Ctrl+F 搜到并自动展开 |
| #7585 | reset 和每份样式表都注册同一个层级顺序，引入顺序不再影响结果 |
| #7590 | 上游 a11y 测试的工程改动，和用户无关。标「不适用」 |

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| 层名 `reset, astryx-base, astryx-theme` | 我们已经有自己的层名体系：`astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides`。**沿用我们的层名**，把上游的规则放进 `@layer astryx.reset { … }` | 上游的 `reset` 层对应我们的 `astryx.reset` 层，都排在最前面、优先级最低。ADR 0001 第 7.1 节已经定过：效果等价，不改名 |
| reset 文件在 `src/reset.css`，通过构建复制出去 | 继续放在 `packages/core/reset.css`，在 package.json 里导出 | 用户写的 `import '@astryx-vue/core/reset.css'` 不变 |
| `:where()` 把优先级降到 0 | 照抄 | 一样 |

**不能用 `!important`**，上游的 reset 本来也没用。

## 任务范围

要改：

- `packages/core/reset.css`，换成完整的 reset
- 文档站：引入 reset，见步骤 3
- 安装指南里对 reset 的说明（中英文）
- 新增 reset 的测试
- 因为引入 reset，组件外观出了问题的地方，在**组件样式**里修。只修「因为 reset 才出的问题」，并逐个列在回报里

不碰：

- 主题、composables、locale、Icon、layer（其他节点负责）。
- 演练场模板（D5 负责）。
- 生成文件只能用 `pnpm sync` 生成。

## 开发步骤

每做完一步，相关测试通过后就提交一次。

1. **改动前先拍基线**（在没改任何东西之前做）：
   - 用 `pnpm visual` 对这 12 个组件各跑一遍，输出到 `/tmp/B2-before`：Button、TextInput、TextArea、Selector、CheckboxInput、Switch、Card、Dialog、Table、List、Heading、Collapsible。
   - 同时把文档站首页和一个组件页（比如 `/en/components/button/`）整页截图，存在同一个目录。
2. **写 reset**：
   - 把上游 `reset.css` 的规则搬进 `packages/core/reset.css`。
   - 文件第一行写我们的层级顺序声明（和组件样式第一行一样），然后把全部规则放进 `@layer astryx.reset { … }`。
   - 文件头注释改成我们的包名和用法。
   - 上游注释里提到 StyleX、`@astryxdesign` 的地方，改成我们的说法。
3. **文档站引入 reset**：上游的文档站自己引入了 reset。我们也在文档站主题入口（`apps/docs/.vitepress/theme/index.ts`，或者全局样式文件，用 grep 找）引入 `@astryx-vue/core/reset.css`。这样文档站展示的组件，和上游在同样的条件下对比。
   - **注意**：reset 可能影响 VitePress 默认主题自己的排版，比如正文段落的间距、列表的圆点。如果文档站的正文被弄乱了，可以把 reset 只作用在组件示例区里，比如 `.astryx-demo`、演练场的预览区。具体用哪种做法，在回报里说明。
4. **测试**：参照上游的测试，用 Vue 写：
   - `reset.test.ts`：文件能解析，规则都在 `@layer astryx.reset` 里，没有 `!important`。
   - until-found 的测试。
   - iOS 16px 字号兜底的测试：只在 iOS 条件下生效，看上游是用 `@supports (-webkit-touch-callout: none)` 还是别的条件。
5. **浏览器对比**：
   - 改完后，对第 1 步那 12 个组件再跑一遍 `pnpm visual`，输出到 `/tmp/B2-after`，逐张比较 `ours.png`。
   - 每一处差异都要归类，写进回报：
     - 「更接近上游」：用 side-by-side 图里的上游一侧证明。
     - 「变差」：在组件样式里修好，再跑一遍确认。
     - 「无关」：说明原因。
6. **文档**：把安装指南里「并不是一份修改页面全局标签的激进重置表」那句话，改成真实的说明：这是一份全局 reset，引入后会改变哪些默认样式，怎么只在局部使用。中英文都要改。
7. 跑 `pnpm sync`。
8. **台账**：7 条全部改成 `- [x]`，并写上结论。

## 自测要求

1. 两种 NODE_ENV 下，全量 vitest 都通过，用例数相同。
2. 完整执行 `env -u NODE_ENV pnpm check`（test 那一步换成 `pnpm vitest run --maxWorkers=2`），要通过。`check-no-important` 也要通过。
3. 浏览器手动验证三件事：
   - 文档站的组件示例和正文排版正常（截图）。
   - 在 Collapsible 或其他用到 `hidden="until-found"` 的组件页上，用浏览器查找搜它折叠起来的文字，能自动展开。如果我们没有组件用到它，就写一个临时页面测试。
   - 禁用的 Button 上，鼠标指针是 `default`。
4. 新写或改动的源码文件不超过 500 行（`reset.css` 是样式文件，不算在内）。

## 提交与回报

- 在分支上提交，提交信息用中文，不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/B2/impl-1.md`，格式按 `templates/impl-report.md`。另外写清楚：
  1. 文档站是怎么引入 reset 的（全局引入，还是只作用在示例区），为什么这样选。
  2. 改动前后的对比清单，每一处差异的归类。
  3. 因为 reset 改了哪些组件样式。
  4. 给 D7 迁移指南用的说明：引入 `reset.css` 的用户会看到什么变化，怎么退回去。
- 最终回复用中文，300 字以内。
