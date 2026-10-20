# B1 主题系统与 token · 执行计划

## 目标

把主题系统（token 和换肤机制）追到上游 v0.7.1。token 就是给颜色、间距、字号起的名字，组件和主题都靠这些名字对接。做完以后，用户能看到或者感受到这些变化：

- **间距跟着根字号走**：用户把浏览器默认字号调大，或者在页面上改了 `html { font-size }`，组件之间的间距会按同样的比例放大，和上游一样。现在我们的间距写死成 px，不会跟着变。
- **数据可视化的颜色变量**：`--astryx-color-data-*` 和上游的取值、命名、用法一致。charts 和组件会用到它们。
- **换肤挂点（theme target）**：主题作者能用和上游同样的「组件名-部位」命名，单独给组件的某个部位换样式。上游已经删掉的旧名字，我们也不再支持。
- **触屏和窄屏的字号阶梯**：在手机上，字号按上游的规则固定，不会忽大忽小。
- **主题能力**：`defineTheme`、`Theme`、`MediaTheme`、`useTheme` 这些对外 API，能做到上游 0.7.1 能做到的事，比如：
  - `accent` 可以传 `[浅色, 深色]` 两个值。
  - `MediaTheme` 的 `mode="auto"`。
  - 主题局部 token。
  - 有序的环境适配。
  - 外观嵌套 token。

这个节点是整棵树下游最多的一个，41 个节点依赖它，所以要做稳。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B1`，分支 `sync/b1-theme`，已经建好。槽位和端口用 `node scripts/swarm/worktree.mjs ls` 查。
- 动手前先读：
  - `.agents-work/upstream-sync/SWARM.md`，特别是「对齐上游的标准：看效果，不看代码」和「跑检查时的环境」两节。
  - 台账：`.agents-work/upstream-sync/ledger/B1.md`，98 个提交，其中 2 个是破坏性改动。
  - ADR：`docs/adr/0001-new-packages.md` 里讲 AST-080 包样式表和 CSS 层的那一节。F0 节点还在返工，如果这个文件还不在 swarm-tree 上，就去 `/Users/shenqingchuan/workspace/astryx-vue-wt/F0/docs/adr/0001-new-packages.md` 读。
- 我们现在的主题实现：
  - `packages/core/src/Theme/`：defineTheme、Theme.vue、MediaTheme.vue、useTheme 等。
  - `packages/themes/neutral/base.css`：token 的默认值。
  - `packages/themes/*.css`：各套主题。
  - 文档站 `apps/docs/docs/{zh,en}/themes/`。
- 上游的主题实现：`packages/core/src/theme/`，重点看 `tokens.stylex.ts`、`dataTokens.stylex.ts`、`defineTheme.ts`、`generateThemeRules.ts`、`themeAdaptations.ts`、`localTokens.ts`、`MediaTheme.tsx`、`useTheme.ts`。另外还有 `docs/specs/` 和 `docs/architecture/` 里和 theme 有关的规范。
- 环境纪律：所有测试和构建命令前面加 `env -u NODE_ENV`，vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多开 2 个浏览器会话。
  - 只能用 `pnpm visual <组件> --out /tmp/B1-visual` 或者 `node scripts/swarm/browser-lock.mjs run --purpose B1 -- <命令>` 开浏览器。
  - 文档站用你的槽位端口，用完关掉。

## 上游这些改动让用户看到或感受到了什么

台账里 98 条大致分成 6 类。动手前，先把台账逐条归到下面这 6 类里：

| 类别 | 代表条目 | 用户看到或感受到的变化 |
| --- | --- | --- |
| 1. 间距改用 rem（破坏性） | #7359 `f3a218198`、#7373 spec | 改了根字号，间距跟着按比例变。默认 16px 根字号下，数值和原来完全一样（4px 的倍数） |
| 2. 删除旧主题兼容层（破坏性） | #7302 `a1a6a636f`、#6126、#6121、#5449、#6148 | 旧的连写 target 名（比如 `buttonicon`）和裸的 prop/state 类名不再生效，只认 `<component-kebab>-<part>` 这种写法 |
| 3. 数据 token | #6832、#5562、#5566、#6834、#6833 | 有 `--astryx-color-data-*` 一整套默认值。主题输出不再带数据默认值，默认值放在基础样式里 |
| 4. defineTheme 能力 | #4592 accent 元组、#5844/#5801 局部 token、#5543 环境适配、#5963 外观嵌套、#6285 去掉局部 token 前缀限制、#5067 `extends`、#5529 声明边界、#6710 | 主题作者能写出上游支持的那些主题配置，生成出来的 CSS 效果一致 |
| 5. MediaTheme 和 useTheme | #5299 `mode="auto"`、#5274 useTheme 返回值稳定、#6450 主题 body 字体落在主题根上 | 放在图片或视频上的内容，能自动判断用深色还是浅色表面；切换主题时没有多余的重新渲染 |
| 6. 组件级 theme target 和可主题化的轴 | Card variant、Spinner、Stepper、TreeList、Heading 自定义类型和字重、Avatar shape、Popover 圆角 | 主题能控制这些组件的对应部位。**只做主题系统这一侧的机制，各个组件接入属于对应的 C 节点**，台账里标成「交给 Cx」 |

另外几类条目的处理方式：

- `docs:`、`[Spec]`、`docs(spec)` 这类条目：读懂它们定下的规则，在实现里遵守。台账里标成「已采纳：体现在 xxx」，或者「不适用：纯上游流程或审批人记录」。
- Tailwind 桥接（#6479、#6797）：判断我们要不要提供。我们不强制依赖 Tailwind 或 UnoCSS。不做就写明理由。
- CLI 相关的（`astryx theme template`、调色板生成）：标成「交给 D4b」。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| StyleX `defineVars` 定义 token，编译期生成 CSS 变量 | 直接写 CSS 变量（`--astryx-*`），默认值放在 `packages/themes/neutral/base.css` 和 core 的基础样式里 | 用户最终拿到的就是 CSS 变量。名字和取值一致，效果就一致 |
| `defineTheme` 在 JS 里生成 StyleX 主题 | 保留我们现有的 `defineTheme`，它生成 CSS 文本或者 style 标签 | 对比生成出来的 CSS 变量名和取值，结果一致就行 |
| `--spacing-*` 是 StyleX 变量，值为 rem | `--astryx-spacing-*` 改成 rem，取值和上游一样 | 默认根字号下像素不变，改了根字号就按比例缩放 |
| `useTheme` 是 React hook | composable，返回 computed 或 readonly 的引用 | 「返回值稳定」在 Vue 里的意思是：引用不变、没有多余的响应式触发 |

**token 名字的前缀**：我们一直用 `--astryx-` 前缀，上游没有前缀，比如 `--spacing-2`。**保留我们的前缀**，因为改前缀会让所有用户的自定义主题失效。这个差异写进回报和文档。

## 任务范围

要改：

- `packages/core/src/Theme/**`
- `packages/themes/neutral/base.css`，以及 token 默认值所在的基础样式文件
- 必要时，`packages/themes/` 下各套主题里 token 的写法：只改 rem 换算和删掉的兼容名，主题本身的配色属于 D1、D2
- 主题文档：`apps/docs/docs/{zh,en}/themes/` 里讲 token、css-variables、extending 的那几页
- 相关测试

不碰：

- 各组件自己的 theme target 接入（属于 C 节点）
- Neutral 的调色板配色（属于 D1）
- 其他 6 套主题的配色（属于 D2）
- CLI（属于 D4b）
- 生成文件只能用 `pnpm sync` 重新生成

范围不对时，先停下，在回报里写清楚。

## 开发步骤

1. **先盘点**：把台账 98 条逐条归到上面的 6 类，再加上「交给 Cx、D 节点」和「不适用」，写在回报草稿里。
2. **间距改 rem**：
   - `--astryx-spacing-*` 全部改成 rem，取值照抄上游 `tokens.stylex.ts` 的 `spacingDefaults`。
   - 用 grep 找出组件样式里把 spacing 和 px 混算的地方，比如 `calc(var(--astryx-spacing-2) + 1px)`，确认在默认根字号下结果不变。
   - matcha 和 y2k 两套主题的间距改 rem 属于 D2（上游 #7374），这里不改。
3. **删除兼容层**：
   - 对照上游 #7302、#6121、#6126、#5449，找出我们还在支持的旧 target 名和裸类名，删掉。
   - 用 grep 确认组件和文档里已经没有用到它们的地方。
   - 写进回报，D7 的迁移指南要用。
4. **数据 token**：对照上游 `dataTokens.stylex.ts` 和 #6834，把 `--astryx-color-data-*` 的名字、取值、存放位置对齐。
5. **defineTheme 和相关 API**：逐项补齐第 4、5 类的能力。每补一项，先写测试：给定主题输入，断言生成的 CSS 变量和取值和上游一致（上游有对应测试的，改写过来）。
6. **Tailwind 桥接**：判断要不要做，结论写进回报。
7. **文档**：主题相关页面更新到新行为，中英文都要改。间距 rem 的变化要写清楚：默认情况下看起来没区别，改了根字号会跟着变。
8. 运行 `pnpm sync`。
9. **台账**：98 条每条都改成 `- [x]`，并写上结论：「已采纳」「交给 Cx / Dx：理由」或「不适用：理由」。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Theme packages/themes`，全部通过。
2. 用 `NODE_ENV=production` 再跑一遍同样的测试，用例数相同。
3. 完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`。
4. **默认外观不变**：间距改 rem 之后，默认根字号下组件外观不能变。在改之前先跑一遍 `pnpm visual Button`、`Card`、`Dialog`、`TextInput`、`Table`，输出到 `/tmp/B1-before`；改之后再跑一遍，输出到 `/tmp/B1-after`。逐张比较 `ours.png` 的像素差异，应该是 0，或者只有抗锯齿级别的差异。如果有不一样的地方，要解释清楚。
5. **根字号跟随**：在文档站里把 `html` 的 `font-size` 改成 20px，打开 Button 页，确认按钮内边距按 1.25 倍放大。截图写进回报。
6. **深色模式**：深色下数据颜色和主题切换正常，截一张图。
7. 新写和改动的源码文件，每个都不超过 500 行。

## 提交与回报

- 在分支上提交，提交信息用中文，可以分几次提交，不要推送。
- 回报写到 `.agents-work/upstream-sync/nodes/B1/impl-1.md`（主仓库路径 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/B1/impl-1.md`），格式照 `templates/impl-report.md`。另外要写清楚这几项：
  1. 台账 6 类的归类结果和数量。
  2. 删掉的旧 target 名和类名清单（D7 要用）。
  3. 「交给 Cx」的清单，按 C 节点分组。
  4. 和上游有意保留的差异，比如 `--astryx-` 前缀，以及理由。
  5. 前后像素对比结果，和根字号跟随的截图路径。
- 最终回复用中文，300 字以内。
