# B2 reset 与基础样式 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B2`，分支 `sync/b2-reset`。只在本地提交，没有推送。
- 提交（基于 `0e3b1cc`）：
  - `3798c70` feat(core): reset.css 换成完整的全局 reset,文档站引入,触屏字号兜底限定 iOS
  - `a48d4e6` fix(core): 禁用按钮的指针改为 default,安装指南改写 reset 说明
  - `4595baa` chore: 重新生成 CLI 目录
  - `e401497` test: reset 测试通过 lint
  - `a2a75bd` docs: B2 台账 7 条处理完

## 1. 做了什么

1. 改动前先拍基线：12 个组件各 4 种组合（桌面/窄屏 × 浅/深）加文档站首页、Button 页、安装页，存在 `/tmp/B2-before`。上游官网偶尔超时，补跑几次才凑齐 48 张。
2. 写 reset：`packages/core/reset.css` 换成上游全部规则。第一行是我们的层级顺序，规则都在 `@layer astryx.reset { }` 里，注释改成中文和我们的包名。
3. 文档站引入：`apps/docs/.vitepress/theme/index.ts` 全局引入 `@astryx-vue/core/reset.css`。
4. 测试：新增 `reset.test.ts`（14 条里的一部分）和 `inputFontFloor.test.ts`。
5. 组件样式：`command-palette.css`、`complex-selector.css` 补上 iOS 门槛；`button.css` 的禁用指针改成 `default`。
6. 文档：安装指南中英文改成真实说明。
7. `pnpm sync` 无新增产物；因文档变了，重新生成了 CLI 的 `catalog.json`。
8. 台账 7 条全部勾选并写了结论。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/reset.css` | 345 | 全局 reset |
| `packages/core/src/reset.test.ts` | 184 | 层级、零特异性、无 `!important`、禁用指针、伪元素、until-found |
| `packages/core/src/inputFontFloor.test.ts` | 61 | 16px 兜底必须同时在触屏和 iOS 条件里 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 整份 reset | `reset` 层 | `astryx.reset` 层，规则照抄 | 都是最前、优先级最低的层 |
| #7355 伪元素 | 伪元素写在 `:where()` 外 | 照上游 | 同上 |
| #5323/#5335 | 禁用用 `cursor: default` | 照上游；Button 也改为 `default` | 浏览器实测 Button 禁用指针为 `default` |
| #6085 | 触屏 + `@supports (-webkit-touch-callout)` | 我们 5 处兜底里 2 处缺门槛，已补 | 只有 iOS 才有 16px 兜底 |
| #7520 | `:not([hidden='until-found' i])` | 照上游 | 浏览器实测见第 5 节 |
| #7585 | 文件首行声明层级顺序 | 用我们的 5 层顺序 | 和每份样式表一致 |
| 占位文字颜色 | `--color-text-secondary` | `--astryx-color-text-secondary`，兜底值同中性主题 | 变量前缀不同，颜色相同 |
| AspectRatio 与 `[data-astryx-media]` 两段规则 | 在 reset 里 | 没放进 reset | 我们已把它们放在 `aspect-ratio.css`、`media-theme.css`，上游搬进 reset 只是文件归属不同 |

## 3. 和计划不一样的地方

- 计划说「上游 `reset.a11y.chromium.spec.ts` 等」要对应测试。我们仓库没有 Playwright spec 工程，改成静态源码测试加手动浏览器验证。
- 上游 reset 里的 AspectRatio 和 media 两段没搬进 reset.css（理由见上表）。因此 reset.css 是 345 行，不是 423 行。
- 计划只提了 12 个组件的基线。我另外发现 Button 自己写了 `cursor: not-allowed`，把重置层的 `default` 盖掉了，所以改了 `button.css`。这属于「因为 reset 才暴露的问题」，范围很小，但其他组件里还有 8 处 `not-allowed`，我没动，台账里它们归 C 系列节点。
- 步骤 4 的 `pnpm check` 里的 test 一步用 `--maxWorkers=2` 跑，是临时改 package.json 后还原，没有提交。

## 4. 台账处理

7 条：已采纳 6 条，不适用 1 条（#7590，上游 a11y 测试的工程改动）。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2` | 过 | 243 个文件，3264 条用例 |
| 2 | `NODE_ENV=production pnpm vitest run --maxWorkers=2` | 过 | 243 个文件，3264 条用例，相同 |
| 3 | `env -u NODE_ENV pnpm check` | 过 | 退出码 0，包含 `check-no-important` |
| 4 | 视觉对照，12 组件 × 4 组合 | 过 | `/tmp/B2-before` 和 `/tmp/B2-after` 逐像素比较：48 张完全相同 |
| 5 | 文档站整页截图 | 过 | 安装页前后字节相同；首页和 Button 页只差 10 行高度内的几十个像素，位置在 Button 页 y≈4024、首页 y≈810，是加载转圈动画，不是排版 |
| 6 | 禁用 Button 指针 | 过 | 浏览器测得 `default`（改之前是 `not-allowed`） |
| 7 | `hidden="until-found"` | 过 | 临时页面：until-found 元素 `display: block; content-visibility: hidden`，普通 hidden 元素 `display: none`；用文本片段链接 `#:~:text=hidden%20answer` 打开后，`hidden` 属性被浏览器去掉，内容展开 |
| 8 | 测试能抓到错误 | 过 | 临时还原 `command-palette.css`，`inputFontFloor.test.ts` 变红 |

我们没有组件用到 `hidden="until-found"`，所以第 7 项用了临时页面。

### 对比清单（改动前后每一处差异）

- 12 个组件 48 张图：没有差异。
- 文档站首页、Button 页：仅动画帧的几十个像素，归类「无关」。
- 安装页：无差异。
- 没有「更接近上游」或「变差」项。

### 文档站怎么引入 reset

选择全局引入。理由：VitePress 默认主题的样式没有放进任何 `@layer`，优先级高于 `astryx.reset` 层，所以 reset 动不了它的正文排版。实测安装页（有标题、列表、表格、代码块）引入前后截图逐字节相同，不需要把 reset 限制在示例区。

### 因为 reset 改了哪些组件样式

1. `button.css`：禁用时 `cursor: not-allowed` 改为 `default`，对齐上游。
2. `command-palette.css`、`complex-selector.css`：16px 兜底补上 `@supports (-webkit-touch-callout: none)`，对齐 #6085。

这两条不是「引入 reset 后外观变差」，是上游同批改动里和 reset 同一主题的内容。引入 reset 后，组件外观没有变差。

### 给 D7 迁移指南的说明

引入 `@astryx-vue/core/reset.css` 的用户会看到：

- 所有元素 `border-box`，边框默认 0 宽实线。
- 标题、段落、列表、`dl`、`pre` 等没有默认外边距，列表没有圆点，标题继承字号字重。
- 图片、视频、`svg` 等变成块级，`img`、`video` 自适应宽度。
- 表单控件继承字体和颜色，按钮没有浏览器外观；`textarea` 只能纵向拉伸。
- 链接继承颜色和下划线。
- 禁用元素指针是 `default`。
- `::before`、`::after`、占位文字、搜索框的清除按钮被重置；占位文字不再变淡。
- `html` 的 `color-scheme` 默认 `light dark`，可用 `data-theme="light|dark"` 控制。

怎么退回去：不再引入 `reset.css`。组件不依赖它，样式不变。因为所有规则都是零特异性，也可以保留文件，在自己的样式表里覆盖单条规则。之前只引入 `reset.css` 来声明层级顺序的用户，现在不需要它了，各份样式表自己声明层级顺序。

## 6. 拿不准的地方

- 其他组件仍有 8 处 `cursor: not-allowed`（command-palette、overflow-list、token、clickable-card、complex-selector、stepper、nav-menu，加上已改的 button），上游的单一规则是「禁用一律 default」。请总控确认 C 系列节点的计划里有这一项。
- `reset.css` 里 `color-scheme: light dark` 加 `data-theme` 的映射，上游文案提到 XDSTheme 会同步这个属性，我们的主题机制是否会写 `data-theme` 我没核实，这归 B1。
- 我的第一次基线里 `pnpm visual` 对上游官网有若干次超时，我用补跑拼满了 48 张。这些图本身没问题，但验收者重跑时也可能遇到超时。
