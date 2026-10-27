# D15 core 状态图标改实心 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D15`，分支 `sync/d15-solid-status-icons`。只在本地提交，没有推送。
- 提交（基于 `9660d44`）：
  - core：状态图标和 stop 改成上游的实心路径
  - test：实心状态图标断言

## 1. 做了什么

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/styles/icon.css` | 约 290 | success/error/warning/info 换成上游实心路径（带 evenodd）；stop 改成实心圆角方块；删掉重复的第二个 success 规则 |
| `packages/core/src/Icon/solid-status-icons.test.ts` | 约 45 | 断言每个路径与上游 v0.7.1 `defaultIcons.tsx` 一致、fill 为 black、带 fill-rule/clip-rule、无 stroke |

上游用 `solidSvgProps` 的有：success、error、warning、info、moreHorizontal（圆点，本来就是实心）、stop。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 状态图标实心 | `defaultIcons.tsx` 兜底图标，fill=currentColor | icon.css mask，fill=black，路径原样 | mask 按 currentcolor 上色 |
| semantic.ts 映射 | 各主题 `icons.tsx` 用 lucide 的 CheckCircle/AlertTriangle 等描边图标 | 不改，保持 lucide id | 照上游：主题有图标集用 lucide，没有才用实心兜底 |

## 3. 和计划不一样的地方

**计划的前提不成立。** 上游实心图标只是"没有主题图标集时的兜底"。官网用 neutral 主题，所有主题（butter、chocolate、gothic、matcha、neutral、stone、y2k）都把 success/warning 等注册成 lucide 描边图标。所以官网 Banner 上的图标就是描边。

我们的 Banner、FieldStatus 等不走 `<Icon>`，用的是 `Field/FieldIcon.vue` 里自带的 16px 描边 SVG，不受本次修改影响。Toast 没有状态图标（`Toast.vue` 里没有 icon）。

所以 D12 里"三角形和原版不一样"的差异不在 icon.css。Banner 对照图里两边都是描边，形状一致。这一点需要总控确认：是否还有别的差异（比如线宽、尺寸），而不是实心。

## 4. 台账处理

无。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/Icon` | 过 | 6 个文件、49 条用例 |
| 2 | `NODE_ENV=production` 同上 | 过 | 用例数相同 |
| 3 | `pnpm exec eslint . --max-warnings 0` | 过 | 临时脚本删除后重跑通过 |
| 4 | `env -u NODE_ENV pnpm check:packages` | 过 | 退出码 0 |
| 5 | 视觉对照 | 部分 | 见下 |

对照图（文档站整页，浅色、深色各一张）：
- `/tmp/D15-visual/banner/{ours,upstream}-{light,dark}.png`
- `/tmp/D15-visual/toast/{ours,upstream}-{light,dark}.png`
- `/tmp/D15-visual/field-status/{ours,upstream}-{light,dark}.png`
- 截图脚本：`/tmp/D15-visual/shot.mjs`

只仔细看了 Banner 浅色的"可关闭"示例（裁图放大）：两边图标都是描边，形状一致。深色、Toast、FieldStatus 的图只生成了，没有逐张细看。

## 6. 拿不准的地方

- 这次改动只影响"没有注册 lucide 图标集时 `<Icon icon="warning">` 的兜底外观"，不改变 Banner 等的可见效果。要不要保留，由总控定。
- 未来如果有人给 `<Icon>` 直接传这些语义名且没注册图标集，会看到实心图标（和上游兜底一致）。
