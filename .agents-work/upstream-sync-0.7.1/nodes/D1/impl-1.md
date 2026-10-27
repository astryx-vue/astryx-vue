# D1 Neutral 主题底色 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D1`，分支 `sync/d1-neutral`。只在本地提交，没有推送。
- 提交（基于 `0dc6992`）：
  - `74979e2` 主题(neutral)：语义色、圆角、阴影、字号阶梯对齐上游审定色板
  - `aa973f0` 主题(neutral)：新增主题私有的状态色与叠层 token
  - `0cb2444` 主题(neutral)：组件级配色改为引用语义 token，并落地上游组件覆盖
  - `cf9ef98` 文档(neutral)：说明对齐后的色板、字体加载方式与移动端字号规则
  - `47ebc3b` 测试(neutral)：断言上游色板、状态色、语法高亮与触屏字号
  - `391bf73` 测试(neutral)：拆开 light-dark 解析，避开回溯告警
  - `406a63d` 台账(D1)：25 条全部结案，标注已采纳与不适用理由
  - `d9ee3b7` 生成文件：catalog 随主题文档更新重新生成
  - `6f359de` 核心(reset)：占位符兜底色跟随中性主题新的辅助文本色

## 1. 做了什么

1. **对照表与取值脚本**：写了两个脚本（在 `/tmp/D1/`，不提交）：`extract.mjs` 从 `git show v0.7.1:packages/themes/neutral/src/neutralTheme.ts` 与 `neutralPaletteRefs.generated.ts` 解析出全部值（含 `expandTypeScale` 的移植，算出字号阶梯与行高），输出 `/tmp/D1/upstream.json`；`compare.mjs` / `compare-components.mjs` 解析我们的 CSS、顺着 `var()` 链求值，再和上游逐个比对。没有手抄任何色值。
2. **`base.css`**：90 个语义/分类色 token、`--radius-*`、`--shadow-*` 全部换成上游值；字号阶梯（12 个 `--font-size-*`、6 组 `--text-heading-*`、8 组 `--text-*`）按 `base 14 / ratio 1.2` 重算，h3/h4 字重改为 bold；代码字体栈改成上游的 `ui-monospace, 'SF Mono', …`。上游 neutral 不覆盖的三个 token（`--astryx-color-background-inverted`、`--astryx-color-background-error-inverted`、`--astryx-color-track`）保持核心默认值，并加了注释说明。文件头那两处「故意不跟上游」的说明已删除。
3. **`local-tokens.css`（新增）**：上游 10 个 `--astryx-theme-neutral-color-*` 主题私有 token，同名同值。
4. **组件**：上游 `components` 块逐项落到对应文件。badge/banner/button/card/progress-bar/status-dot/switch/segmented-control/section/stepper 都改成引用语义 token 或主题私有 token，不再各写一份十六进制。`skeleton.css` 只是重复声明 `--astryx-color-skeleton`，删掉后由 base.css 提供。
5. **语法高亮**：`code.css` 14 个角色核对为上游值（本来已一致），删掉重复的字号声明，内联代码底色改指 `--astryx-color-background-muted`，注释里记上色板名 `astryx-neutral`。
6. **触屏字号**：新增 `mobile-type.css`，`@media (width < 1024px) and (pointer: coarse)` 里重写 11 个字号 + 13 个行高（display-1 保持 42px 不写）。
7. **文档**：中英文 `themes/neutral.md` 去掉「两处微调」章节，改成「和原版一致」+ Figtree 加载方式（内置 fontsource，或改用 Google Fonts）+ 手机字号规则。
8. **测试**：更新 `base-tokens.test.ts` 的期望值；新增 `neutral-palette.test.ts`（色板、状态色、徽章前景、语法高亮、触屏断点）。
9. **台账**：25 条全部打勾并写结论。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/themes/neutral/base.css` | 260 | 90 个语义/分类色、圆角、阴影、字号阶梯、动效、字体栈 |
| `packages/themes/neutral/local-tokens.css` | 29 | 上游 10 个主题私有 token（状态填充色、叠层） |
| `packages/themes/neutral/mobile-type.css` | 42 | 粗指针 + 窄屏的字号阶梯改写 |
| `packages/themes/neutral/badge.css` | 39 | 14 个徽章变体指向语义/状态 token |
| `packages/themes/neutral/banner.css` | 63 | 四种色调底色 + 在 banner 元素上重指表面 token |
| `packages/themes/neutral/button.css` | 44 | 按钮变体 + 危险按钮红色叠层 |
| `packages/themes/neutral/segmented-control.css` | 42 | 内边距、尺寸高度、选中项阴影 |
| `packages/themes/neutral/stepper.css` | 16 | 步骤指示器的四种状态色 |
| `packages/themes/neutral/section.css` | 8 | 卡片/区块内边距 |
| `packages/themes/neutral/code.css` | 42 | 语法高亮与会话高亮底色 |
| `packages/themes/neutral-palette.test.ts` | 148 | 上游值断言（含 var() 链求值） |

其余 30 个 `neutral/*.css` 只做了「十六进制 → 语义 token」替换（如 `dialog.css`、`dropdown-menu.css`、`input.css`、`popover.css`）。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 审定色板（`75a4d1dee` 等） | `defineTheme({tokens: {'--color-x': [light, dark]}})` 编译出 CSS | `base.css` 里写 `--astryx-color-x: light-dark(light, dark)` | 每个变量两侧的最终色一致（脚本逐个比对，0 差异） |
| 色板引用（`neutralPaletteRefs`） | 写 `neutral.light[30]` 这类引用 | 写解析后的十六进制，文件头注释说明来源 | 值相同 |
| 主题私有 token（`localTokens`） | `--astryx-theme-neutral-*` | 同名同值放 `local-tokens.css` | 名字和值都相同 |
| 组件覆盖（`components`） | `badge['variant:info'].backgroundColor` 等 | 落到 `--astryx-badge-info-background` 等我们组件实际读的变量 | 组件画出来的颜色一致；上游的 `status:accent` 在我们这里叫 `info` |
| Banner 按状态换文字色 | 在 banner 作用域内改 `--color-text-primary` 等 | 在 `@layer astryx.overrides` 里按 `[data-status]` 重指 `--astryx-color-text-primary` 等 | 同为「在 banner 元素上换 token」，标题/描述/图标/按钮全部跟着变 |
| 危险按钮红色叠层 | `button['variant:destructive']` 改 `--color-overlay-hover/pressed` | 同样在 `astryx.overrides` 里按变体重指 `--astryx-button-hover-overlay/pressed` | 悬停、按下都变成红色半透明叠层 |
| 分段控件内边距（`95e7bfacb`） | 把内边距改成 `--spacing-1` | 加 `--astryx-segmented-control-padding: var(--astryx-spacing-1)` | 浏览器实测：内边距 4px、选中项 24px、整体仍 32px |
| 分段控件尺寸高度 | `calc(var(--size-element-md) - 8px)` | 同样三条规则，放在 `astryx.overrides` 层 | 因为核心把高度写死了，只能由主题补规则；实测 md 项 24px |
| 触屏字号（`8527f921e`） | `adaptations` 规则编译成 `@media (width < 1024px) and (pointer: coarse)` | `mobile-type.css` 里写同样的媒体查询 | 浏览器实测（390px + `hasTouch`）：正文 16px / 行高 24px，display-1 仍 42px |
| 语法高亮（`87070314f`、`4357d2815`） | `defineSyntaxTheme({name:'astryx-neutral', tokens})` | `code.css` 的 14 个 `--astryx-code-syntax-*` + 注释记名字 | 颜色相同；我们没有运行时语法主题名这个概念 |
| Figtree（`448585248`） | README 写 Google Fonts 加载片段 | 入口内置 `@fontsource/figtree`，文档再给一段 Google Fonts 备选 | 用户看到的是同一个字体；换字体方式写在文档里 |

## 3. 和计划不一样的地方

1. **触屏字号单独放 `mobile-type.css`**，没写在 `base.css`。原因：仓库的 token 解析器（`parseTokens.ts`）按行扫 `--astryx-`，同文件里出现两遍会让 `base-tokens.test.ts` 的「不得重复声明」用例失败；拆文件后 `base.css` 保持一变量一声明。
2. **上游 `components` 里那几条无法用变量表达**（Banner 按状态换文字色、危险按钮叠层、步骤指示器状态色、分段控件尺寸高度），我在主题 CSS 里加了 `@layer astryx.overrides` 的规则，按元素重指自定义属性。原因：我们核心组件直接读共享 token（`--astryx-color-text-primary` 等），上游是靠组件 theme target 在同一元素上换 token，本质是同一手法。没改 `packages/core`。
3. **多改了一个核心文件 `packages/core/reset.css`**（1 行）：占位符兜底 `light-dark(#525252,#a3a3a3)` → `light-dark(#474747,#9e9e9e)`。`packages/core/src/reset.test.ts` 断言这个兜底值必须等于中性主题的 `--astryx-color-text-secondary`，不改会红。不是组件样式，是重复字面量。
4. **组件主题文件顺手去掉重复字面量**（计划只要求改 `components` 块涉及的组件）。原因：像 `--astryx-dialog-foreground: #171717` 这种和 `--astryx-color-text-primary` 是同一个角色，留着就会在色板变化后和上游不一致（#171717 vs #000000）。改完 `git diff` 里每个文件只动 2–20 行。
5. **`skeleton.css` 删除**：它只是把 base.css 的 `--astryx-color-skeleton` 再写一遍（值还是旧的 `#ebebeb`），删掉后 F5 里由 base.css 提供。

## 4. 台账处理

25 条：已采纳 14 条，不适用 11 条。不适用逐条理由：

- `fda3f56a0`：上游 CLI 色板生成流水线，属 B1/D4，我们直接把值写进 CSS。
- `41ab6db2a`：上游为兼容 deprecated theme target 保留的别名，我们没有那套 target 机制。
- `00f1ed9da`：图标走我们自己的语义图标表，属 B5/C16。
- `e92e36ffb`、`2793acc3d`：色板引用生成脚本 / 生成规范，属 D4。
- `edc0cfc2c`、`885af34e7`、`17044ab1e`：上游主题规范文档与审阅人信息。
- `4d004cdb4`：Banner 交互与 320px 回流，属组件节点 C15。
- `34b4692a3`：上游 CLI 文档编译流水线。
- `71cf6cd06`：上游 CLI 的可选主题导入；我们的主题入口已内置 `fonts.css`。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/themes` | 过 | 3 个文件、27 条用例 |
| 2 | `env NODE_ENV=production pnpm exec vitest run --maxWorkers=2 packages/themes` | 过 | 同样 3 个文件、27 条用例 |
| 3 | `node scripts/check-no-important.mjs` / `check-line-limit.mjs` / `sync-exports.mjs --check` / `cli generate:check` | 过 | 退出码 0；`catalog is up to date (245 components, 31 topics, 53 templates)` |
| 4 | `env -u NODE_ENV pnpm build:packages` | 过 | `packages/core build: Done` |
| 5 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/Theme packages/core/src/reset.test.ts` | 过 | 11 个文件、172 条用例（reset 兜底值和主题新值已同步） |
| 6 | 和上游逐个比对（脚本） | 过 | `checked 192 values, 0 mismatch, 0 missing`；`component values: 57/57 match upstream` |
| 7 | 浏览器读实际算出的值 | 过 | 见下方表格 |
| 8 | 视觉对照 | 过 | `/tmp/D1-shots/*.png`（badge/banner/button/segmented-control，浅深两套 + 390px 手机） |

浏览器实测（`/tmp/D1-shots/`，文档站 5171，测完已关）：

| 页面 | 变量/元素 | 深或浅 | 实测 |
| --- | --- | --- | --- |
| `/themes/neutral` | `--astryx-color-text-secondary` | 浅 | `light-dark(#474747, #9e9e9e)`（和上游一致） |
| `/themes/neutral` | `--astryx-badge-error-background` | 浅 | `light-dark(#c9303a, #ff705d)` |
| `/themes/neutral` | 正文 `font-size` | 桌面 1280 | 14px |
| `/themes/neutral` | `font-size: var(--astryx-font-size-base)` | 390px + `hasTouch` | 16px，行高 24px；`display-1` 42px |
| `/components/segmented-control` | 轨道 padding / 选中项高 / 整体高 / 选中阴影 | 浅 | 4px / 24px / 32px / `none` |
| `/components/banner` | info 底色与文字 | 浅 / 深 | 浅色淡蓝底 + 蓝字；深色半透明蓝底 + 浅蓝字 |
| `/components/button` | 危险按钮 | 浅 | error-muted 粉底 + error 深红字 |

对比度抽查（脚本算）：徽章错误 5.29（浅）/ 6.95（深），徽章信息 4.57，徽章成功 5.02，徽章警告 12.70，语法标点 5.41，辅助文字 8.23 —— 全部 ≥ 4.5。

## 6. 拿不准的地方

1. **标题的行高与 h3 字重**：值已经写进 CSS（`--astryx-text-heading-N-leading`、`-weight`），但核心 `packages/core/styles/heading.css` 只按层级绑定字号，行高统一取 `--astryx-heading-leading: 1.25`，字重只有 h4 绑定 bold。所以 h3 渲染出来仍是 semibold、各层级行高不随上游分级。要修需要改核心 `heading.css`（读 `--astryx-text-heading-N-leading/weight`），超出本节点范围，请总控决定是否另开节点。
2. **文本组件的 display 行高**：核心 `text.css` 把 `line-height` 写死为 1.1 / 1.15 / 1.2，而上游是 1.2381 / 1.2571 / 1.3793。同样属于核心 CSS 限制。
3. 我在主题 CSS 里新增了 `@layer astryx.overrides` 的组件作用域规则（Banner / Button / 分段控件 / 步骤指示器）。如果验收认为「主题文件只放变量」是硬规矩，这四处需要改成核心读变量；但那样又必须改 `packages/core`。
4. `--astryx-text-lg-size` / `-xl-size` 是我们自己的 size 属性 token（上游没有），我按阶梯对齐成了 `1.0625rem` / `1.25rem`（原来是 `1rem` / `1.25rem`），Link 的 `size="lg"` 会大 1px。

## 7. 和上游值不一致的地方

除下面几条以外，全部一致（脚本核对：token 192/192、组件 57/57）。

- **标题各级行高**：CSS 里的值是上游值，但渲染时核心用统一的 `--astryx-heading-leading: 1.25`。
- **h1/h2/h3/h5/h6 字重**：上游 semibold（h3/h4 bold），核心只给 h4 绑定 bold，h3 实际仍是继承值。
- **Display 文本行高**：核心写死 1.1 / 1.15 / 1.2，未读 `--astryx-text-display-N-leading`。
- **`--astryx-radius-chat`（28px）、`--astryx-text-sm/md/lg/xl-size`、`--astryx-focus-outline-*`**：上游 neutral 没有这些 token，属于我们自己的扩展，保持原值（`lg/xl` 按阶梯对齐）。
