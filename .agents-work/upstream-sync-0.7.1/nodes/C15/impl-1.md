# C15 反馈与状态 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c15-feedback`。从 `swarm-tree`（`4a5b9a4`）拉出。
- 提交（基于 `4a5b9a4`）：
  - `840963e` docs(c15): 写下反馈与状态的执行计划和验收清单
  - `bd47e4e` feat(banner): 提示条不再按状态推导读屏角色
  - `fbeaf3a` feat(spinner): 加载圈改为弧线沿圆环移动
  - `2f60e37` feat(c15): 对齐步骤条空隙、进度条和状态点
  - `b3211ee` docs(c15): 更新反馈组件文档并勾完台账

## 1. 做了什么

1. 计划和验收清单已在 `840963e` 提交。
2. Banner：根节点改为 `astryx-banner-frame`，彩色条是 `astryx-banner`。不再按 `status` 推导 `role` 或 `aria-live`。关闭按钮的无障碍名用语言包的 `dismissTitled`，提示用短的「关闭」。展开、收起也走语言包。未知状态不铺底色、不放默认图标。标题是主要文字色，说明是次要文字色，图标用状态色。末尾操作在窄行换行（`flex-basis: 8rem`），长词可断行。
3. Spinner：轨道静止，弧线用 `stroke-dashoffset` 走动。`spinnerPhase.ts` 把后出现的圈对齐到文档时间原点。`spinnerGeometry.ts` 把两个私有长度登记成 `<length>`，主题写成 `0` 时不会把 `calc` 弄坏。公开变量在 `.astryx-spinner` 上。带文字时主题类和 `data-size` / `data-shade` 挂在外层。默认无障碍名是语言包的「加载中」。缩小动效时周期 3 秒，不冻住。
4. Stepper：水平根增加 `astryx-stepper-frame`，声明 `--astryx-step-connector-gap`，列表继承。连接线用空隙裁切，只在有指示点时生效。可点步骤用 `usePressFeedback({ hasOverlay: false })`。禁用导航的指针是 `default`。摘要内容 `aria-hidden`。`styles/layer.css` 在已有浮层根重置里把这个变量还原为 `initial`。没有改 `layer/` 目录。
5. ProgressBar：默认 `variant` 从 `neutral` 改为 `accent`。不确定进度不写 `aria-valuenow` / `min` / `max` / `valuetext`。非有限的 value、max 按 0。不确定动画 1.5 秒，从右到左有对应关键帧，缩小动效时 3 秒。
6. StatusDot：增加 `icon` 组件属性，插槽优先。不传图标时仍是色点。复选框的对勾和横杠带上 `data-size`。
7. 中英文文档改了提示条的读屏说明、进度条默认变体、加载圈默认名字、状态点的 `icon`。步骤条文档没有和这次行为冲突的句子，没有改。
8. 台账 57 条全部打勾并写了结论。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Banner/Banner.vue` | 150 | 提示条结构、折叠和关闭命名 |
| `packages/core/styles/banner.css` | 164 | 外框、状态底色、换行 |
| `packages/core/src/Spinner/Spinner.vue` | 134 | 圆环和标签 |
| `packages/core/src/Spinner/spinnerGeometry.ts` | 27 | 登记私有长度 |
| `packages/core/src/Spinner/spinnerPhase.ts` | 31 | 对齐动画相位 |
| `packages/core/styles/spinner.css` | 132 | 弧线动画和公开变量 |
| `packages/core/src/Stepper/Stepper.vue` | 161 | 外框类和摘要隐藏 |
| `packages/core/src/Stepper/Step.vue` | 142 | 按压、指示点和标签数据 |
| `packages/core/styles/stepper.css` | 398 | 空隙裁切和禁用指针 |
| `packages/core/styles/layer.css` | 72 | 浮层根还原连接线空隙 |
| `packages/core/src/ProgressBar/ProgressBar.vue` | 110 | 默认变体和不确定进度的无障碍属性 |
| `packages/core/styles/progress-bar.css` | 190 | 不确定动画时长 |
| `packages/core/src/StatusDot/StatusDot.vue` | 57 | 图标属性 |
| `packages/core/src/CheckboxIndicator/CheckboxIndicator.vue` | 43 | 对勾和横杠的尺寸轴 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 提示条不再从状态推导实时区域 | 根上默认没有 role | 同样不写 role，调用方传入才有 | 读屏不再把普通提示当成紧急通知 |
| 折叠 | 默认可折叠且一开始收起；`collapsible={false}` 一直展开 | 布尔 `collapsible`，默认 true；`defaultIsOpen` 和 `v-model:isOpen` | 默认收起，关掉折叠后详情一直在 |
| 关闭命名 | Dismiss {title} / 关闭“标题”，提示是短词 | `dismissTitled` 和短的 dismiss | 英文、简体中文和上游文案一致 |
| 主题挂载点 | frame、banner、icon、description、content | 同一套类名 | 主题能分别改外框和彩色条 |
| 加载圈 | 弧线 dashoffset，相位对齐，公开变量 | 手写 CSS 变量加两个 composable | 圆环不整圈打转，后出现的圈相位一致 |
| 进度条 | 默认 accent；不确定进度省略数值属性 | 同样 | 不确定时不播报一个假百分比 |
| 步骤条空隙 | 外框声明，浮层结构重置还原 | 外框变量加 `styles/layer.css` 的 `initial` | 浮层里的步骤条不继承外面的空隙 |
| 状态点图标 | `icon` 属性 | 属性加原有插槽，插槽优先 | 有图标时画在点里，没有时仍是色点 |

## 3. 和计划不一样的地方

台账标题把 `dfdd77805` 说成「内容默认可见」。v0.7.1 的源码和 spec 仍是默认可折叠、一开始收起。按源码实现，并在台账结论里写明。

相关测试拆成两组跑：Banner、Spinner、ProgressBar、StatusDot、Stepper 是 5 个文件、59 条；CheckboxIndicator 是 1 个文件、3 条。两种 `NODE_ENV` 加起来都是 6 个文件、62 条。

没有改步骤条文档。EmptyState、Skeleton 的源码没有用户可见差距，没有改组件。

## 4. 台账处理

`ledger/C15.md` 一共 57 条。已采纳 33 条。不适用 24 条：

- 主题兼容层、连写旧挂载点：交给 B1。
- `e891c0dc8` 把禁用指针改成 not-allowed，下一条又改回 default，按后一条。
- 文档站分类、属性预览站、StyleX 构建、CLI 提示、lab 测试钉：分别不属于本节点，或我们没有那套产物。
- 上游 spec、解剖记录、排印、破折号、弯引号、知识库契约、生命周期 spec、AST-017：不改变组件行为。骨架屏和空状态本轮没有新的用户可见差距。CheckIndicator 本来就只画勾。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV` 下相关 vitest | 过 | 5 个文件 59 条，另加 CheckboxIndicator 3 条。`--maxWorkers=2`，退出码 0 |
| 2 | `NODE_ENV=production` 同一范围 | 过 | 同样 62 条，退出码 0 |
| 3 | `env -u NODE_ENV pnpm typecheck` | 过 | 根 tsc、cli、core、docs 都完成，退出码 0 |
| 4 | 相关 eslint、行数、`!important` | 过 | eslint 退出码 0。`check-line-limit.mjs` 通过。`check-no-important.mjs` 退出码 0。改过的源码都在 500 行以内 |
| 5 | 文档站整页截图 | 过 | 中文 `/components/banner`、`/components/spinner`。桌面和 390，浅色和深色。滚到「可折叠」或「尺寸」。侧栏或「菜单」顶栏可见。上游对照是 astryx.atmeta.com 的 Examples |

截图都在 `/opt/cursor/artifacts`，没有进 git：

- `c15-banner-desktop-light.png`
- `c15-banner-desktop-dark.png`
- `c15-banner-mobile-light.png`
- `c15-banner-mobile-dark.png`
- `c15-spinner-desktop-dark.png`
- `c15-spinner-mobile-dark.png`
- `c15-banner-desktop-dark-vs-upstream.png`
- `c15-spinner-desktop-dark-vs-upstream.png`
- `upstream-banner-desktop-light.png`
- `upstream-banner-desktop-dark.png`
- `upstream-banner-mobile-light.png`
- `upstream-banner-mobile-dark.png`

没有跑完整的 `pnpm check`。全量 vitest 没有跑。

## 6. 拿不准的地方

提示条不再从 `status` 推导 `role`，现有页面如果靠这个做实时区域，需要自己写 `role`。进度条默认 `variant` 改成 `accent`，没写变体的进度条颜色会变。

`styles/layer.css` 加了一行变量还原。并行的 Escape 修复线程如果也改这个文件，会冲突。没有改 `packages/core/src/layer/`，也没有改 Toast 的关闭栈。

## 给 D7 的说明

提示条不再从 `status` 推导 `role` 或 `aria-live`。要实时区域必须自己写 `role="status"` 或 `role="alert"`。展开、收起、关闭跟着当前语言。关闭按钮的无障碍名是「关闭“标题”」（英文 `Dismiss {title}`），提示只写「关闭」。进度条默认 `variant` 从 `neutral` 改为 `accent`。调用方显式传入的 `role` 和文案覆盖仍然有效。
