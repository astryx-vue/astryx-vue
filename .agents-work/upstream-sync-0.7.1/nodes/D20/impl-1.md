# D20 第 1 批实现回报（login 系列、settings 系列、contact-form、payment-form、checkout-wizard）

分支 `sync/d20-playground-batch-1`，工作区 `astryx-vue-wt/D20`。每个模板的差异清单见同目录 `diff-<slug>.md`。

## 一、每个模板修了几处、剩几处

| 模板 | 已修 | 剩余（都在 core，见第三节） |
| --- | --- | --- |
| login | 2（外壳高度、按钮字重） | 1（深色按钮字色） |
| login-card | 6（外壳、列宽、水平居中、图标 16、条款字号、字重） | 1 |
| login-split | 5（外壳、内层 Center 内边距、图标尺寸、链接字号、字重） | 1 |
| login-sso | 4（外壳背景、水平居中、字重、帮助链接行高） | 1 |
| settings | 3（选中项底色、搜索框宽度、字重） | 1 |
| settings-sidebar | 1（Edit 等链接字号，9 处） | 0 |
| settings-dialog | 6（外框宽度、标题位置、分组间距×2、选择器内边距、开关行高） | 0 |
| contact-form | 1（文本区 rows 与内边距） | 3（Token 行盒、Token 字色、Radio 文字行盒） |
| payment-form | 5（合计结构、文档撑高、数量框宽、链接字号、摘要触发行高） | 1（数量框步进按钮样式同 checkout） |
| checkout-wizard | 3（窄版判断、摘要卡两种形态、摘要触发行高） | 1（步进按钮宽度与颜色） |

量完以后 login-sso、settings、login 在浅色下元素逐个对上；其余剩的都是 core 差异。

## 二、共用根因与防线（比逐个改模板更重要）

1. **`VStack justify="center"` 其实是竖直主轴对齐**，不是水平居中。原版 `hAlign="center"` 被移植成 `justify`，内容全部贴左。影响 13 个文件 29 处，已全部改 `hAlign`。**防线**：`scripts/check-template-tokens.mjs` 新增检查，模板里 `<VStack ... justify=` 直接报错。
2. **整页 `Center` 的 `minHeight: '100%'` 写在 style 里被吃掉**。预览根是 `display: contents`，百分比高度没有参照，外壳高度塌成内容高度，卡片贴顶而不是居中。改成 `min-height="100%"` 属性（login-card/split/sso、form-two-column 四个模板）。
3. **文档站全局把每个 button/input 字重压成 400**，组件层的 500 被盖住，所有按钮比原版细。在 `apps/docs/styles/playground.css` 里让预览框的 button/input/textarea/select 还原字体字重（一处改，全部模板受益）。
4. **Link 没有 `type` 属性**，原版 `type="supporting"` 移植后落成普通 HTML 属性，链接变 16px。改 `size="sm"`/`"md"`，并在预览框补 supporting 行高。
5. **窄版判断必须按容器宽度，不是窗口宽度**（checkout-wizard），原版用 ResizeObserver。
6. 新增测量脚本 `scripts/swarm/playground-measure.mjs`：同一模板原版和本地各量一遍，逐元素列位置、尺寸、字号、字重、颜色、圆角、边框差异（带重试，拿不到页面会报错而不是出空表）。`playground-pair.mjs` 同步改成按控件数量判定页面已渲染、并加重试。

## 三、给总控的 core 问题清单

已先对照 `nodes/D12/impl-3.md` 第三节：1–13 里与本批相关的有第 13 条（Token `vertical-align`）、`ProgressBar`/`TextInput` 宽度（上一轮已报）。以下是**不在那份清单里的新条目**，模板里已写最小绕过，注释都标了"待 core 修复后去掉"：

1. **Dialog 内联模式标准尺寸缺最大宽度** `min(100%, 100dvw - 2 × 16px)`（我们是 `max-width: 100%`，窗口窄时对话框顶满宽）。绕过：`settings-dialog.vue` 的 `.settings-dialog-frame`。
2. **SideNavSection 标题和条目之间多 2px gap**；**SideNav 内容区分组间多 4px gap、底部内边距 4（原版 8）**。绕过：`settings-dialog.vue`。
3. **小号 Selector 内边距** 3px 12px 对我们 4px 8px。绕过：`settings-dialog.vue`。
4. **Switch 行 `inline-flex`** 导致外层行盒 28 高、开关下沉 2px（原版 24）。绕过：`settings-dialog.vue`。
5. **TextArea 外框自带 8px 内边距 + 80px 最小高度**，`rows` 不起作用；原版外框 0 内边距、文本区自己 4px 8px、高度由 rows 决定。绕过：`contact-form.vue`（`control-class`）。
6. **Layout 内容区（`.astryx-layout-content`）是滚动容器但不是 `position: relative`**，里面绝对定位的隐藏控件（单选/复选/开关的原生 input、读屏提示）落到预览根，撑高文档（payment-form 1509 对 806）。绕过：`playground.css`。建议 core 直接给内容区 `position: relative`。
7. **Collapsible 触发行高度 24，原版 17**（文字行高 25.5 溢出、触发行不撑高）。绕过：`playground.css`。
8. **Button 大号图标槽盖住显式 svg 宽高**（20 对 16）。绕过：模板里 svg 写行内 `width/height`。
9. **Link 缺 `type`（`body` / `supporting`）属性**，原版靠它同时设字号和行高。绕过：`size` + `playground.css` 补行高。
10. **neutral 主题的选中列表项底色是蓝色半透明**，原版是 accent-muted（浅色 241 灰、深色 38 灰）。绕过：`playground.css` 把 `--astryx-list-item-selected-background` 指到 accent-muted。
11. **整页 Center 里嵌套的 Center 继承了外层 padding**（login-split 的内层 Center 被带上 24px），原版 Center 内边距默认 0。绕过：模板写 `:padding="0"`。
12. **主色按钮深色前景色** 我们 rgb(23,23,23)、原版 rgb(17,17,17)（所有主按钮、深色）；**Token 前景色** 浅色 27 对 0、深色 212 对 255；**NumberInput 步进按钮** 宽 27 对 15、色 71 对 106。
13. **Token 与 Radio 文字行盒** 20 对 14/17（位置宽度一致，只差行盒），可与上一份清单第 13 条一并处理。
14. **全局 reset**：文档站 `body, button, input...{font-weight:400}` 本身不在 core，已在 playground.css 里还原，无需 core 处理。

## 四、没做 / 风险

- 本批 10 个模板里，settings-sidebar 的"展开编辑行"、settings-dialog 的搜索结果、checkout-wizard 的后三步、payment-form 的校验这些**交互态**没有逐项和原版对照，只对了首屏与静态区块。
- 第 12、13 条我没在原版页面逐一量过 token 值来源（只量了渲染结果），按"在 core"归类。
- 原版站点偶尔 45s 超时，脚本已加 3 次重试。
- 对照图在 `/tmp/D20-shots/`（机器重启会丢），共 20 张。

## 五、对照图

`/tmp/D20-shots/<slug>-<light|dark>.png`（原版左、我们右）：login、login-card、login-split、login-sso、settings、settings-sidebar、settings-dialog、contact-form、payment-form、checkout-wizard 各浅深两张；contact-form 另有滚动一张 `contact-form-light-b.png`。

## 六、自测

`pnpm check:templates` 通过（49 个）；`check-template-tokens` 通过（57 个）；`eslint . --max-warnings 0` 通过；`pnpm check:packages` 通过；vitest `packages/cli tests` 两种 NODE_ENV 均 39 文件 583 条通过。
