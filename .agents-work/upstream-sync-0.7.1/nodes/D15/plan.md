# D15 core 状态图标改实心 · 执行计划

## 背景

D12 验收时，总控拿 theme-showcase 的黄色提示条和原版对比，发现最前面的三角形不一样：原版是实心的，我们是空心描边。

原版 `packages/core/src/Icon/defaultIcons.tsx` 里，状态类图标都用 `solidSvgProps` 画（`fill: currentColor`），是 heroicons solid 那种实心风格。这样做的理由，原版注释写的是：小尺寸下颜色更醒目。我们 `packages/core/styles/icon.css` 里对应的内置图标，用的是 lucide 的空心描边。

## 要做的

1. 读原版 `defaultIcons.tsx`，找出所有用 `solidSvgProps` 的图标。已知的有 success、error、warning、info，第 117、128、139、150、193、281 行。逐个确认名字。
2. 把我们 `styles/icon.css` 里对应的 `.astryx-icon--<名字>` 的 `--astryx-icon-artwork`，换成原版的实心路径。注意：
   - 我们是用 mask 画图标的（`mask-image` 加 `currentcolor`），所以 SVG 要写 `fill='black'`。
   - 原版用了 `fillRule="evenodd" clipRule="evenodd"` 的，要原样带上 `fill-rule='evenodd' clip-rule='evenodd'`，不然镂空部分会被填满。
3. `semantic.ts` 里这些语义名默认对到 lucide 的空心图标，比如 `warning: 'lucide:triangle-alert'`。查一下原版在注册了图标集时怎么处理这些状态图标，照原版改。如果原版不映射到图标集，我们也不映射。
4. 找出哪些组件用了这些图标：Banner、Toast、FieldStatus、Alert 等，`grep -rn "icon=\"\(warning\|error\|success\|info\)\"\|'warning'\|'error'" packages/core/src`。确认它们换成实心之后尺寸和颜色都对。

## 完成标准

- 每个实心图标的 path 都和原版一致，有单元测试断言 CSS 里的 artwork 包含原版 path 的关键片段。
- 用文档站整页截图核对 Banner、Toast、FieldStatus 的组件页（`/components/<slug>`），浅色、深色各一张，和原版同一个 Demo 区块对照。
- core 测试在两种 NODE_ENV 下都通过；`eslint .`、`check:packages` 通过。

---

# 总控复核第 1 轮（2026-10-27）：结论与第 2 轮要求

worker 回报说「原版本来就是描边，这次改动没有视觉效果」。这句话**只对了一半**。总控用浏览器分别读了原版两处页面的真实 DOM：

| 场景 | 原版实际画出来的 | 原因 |
| --- | --- | --- |
| 文档站组件页（`/components/Banner`） | lucide 描边 | 文档站用完整的 neutral 主题，主题里注册了 lucide 图标表（`packages/themes/neutral/src/icons.tsx`） |
| 演练场模板（`/playground?template=theme-showcase`） | **heroicons 实心**：`fill="currentColor"`，带 `fill-rule="evenodd"`，path 是 `M10.29 3.86L2.07 19.05…` | 演练场用的是 `@astryxdesign/theme-neutral/built`，只有 token，**没有图标表**，所以落回 core 的 `defaultIcons.tsx` 实心兜底 |

所以：
- 用户看到的那处差异是真的。
- 它只出现在演练场里。
- 原因是我们的 Banner、FieldStatus、FieldInfoTip 根本不走 `<Icon>`。它们用的是 `Field/FieldIcon.vue` 自己画的描边 SVG，所以不管有没有注册图标表，都画成描边。

原版里 Banner、FieldStatus、FieldLabel、TextArea、Step 都是 `<Icon icon="warning|error|success|info">`。走 `<Icon>`，就会按当前主题的图标表解析：主题注册了图标表，画主题的；没注册，画 core 的实心兜底。

## 第 1 轮的改动保留

`icon.css` 的实心兜底和测试是对的，留着。

## 第 2 轮要做的

1. 把 Banner、FieldStatus、FieldInfoTip 里的状态图标，从 `FieldIcon` 改成 `<Icon :icon="status" size="…" :color="…">`。尺寸、颜色照原版 Banner.tsx 第 618 行一带、FieldStatus.tsx、FieldLabel.tsx 第 288 行。
   - 改完以后，主题注册了图标表时画主题的图标（文档站是 lucide 描边，和原版组件页一致）；没注册时画 core 实心兜底（和原版演练场一致）。
   - `FieldIcon` 还用在 clear 按钮等别的地方，那些不是状态图标，不要动。
2. 把仓库里其它照原版应该走 `<Icon icon="warning|…">` 的地方也查一遍，照原版改：TextArea 第 681 行、Step 第 1187 行一带。
3. 我们的文档站要和原版文档站一样，给 neutral 主题注册 lucide 图标表。
   - 先查 `semantic.ts` 的默认映射在文档站里是怎么生效的，`apps/docs` 有没有装 `@iconify-json/lucide`。
   - 演练场 iframe 要和原版演练场一样，不注册图标表，走实心兜底。
   - 两处都要在浏览器里读 DOM 确认。
4. 对照：
   - 文档站 Banner 页，和原版 `/components/Banner` 比：两边都应该是描边。
   - 演练场 theme-showcase 的黄色提示条，和原版演练场比：两边都应该是实心。
   - 浅色、深色各截一张。
