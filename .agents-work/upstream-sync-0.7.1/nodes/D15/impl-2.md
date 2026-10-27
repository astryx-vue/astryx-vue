# D15 core 状态图标改实心 · 第 2 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D15`，分支 `sync/d15-solid-status-icons`。只在本地提交，没有推送。
- 提交（第 2 轮）：
  - `9ed4cf1` docs: 文档站注册 lucide 图标表，演练场预览框不注册
  - `b9a5e28` core: Banner、FieldStatus、FieldInfoTip、TextArea 计数、Step 的状态图标改走 Icon
  - `1ef5df1` docs: 图标插件不扫 core 的映射表，演练场预览框走实心兜底

## 1. 做了什么

1. **状态图标改走 `<Icon>`**。`Field/FieldIcon.vue` 里 success/error/warning/info 改成渲染 `<Icon :icon size color>`；`clear` 仍是自画描边 SVG。FieldStatus（detached）、FieldInfoTip、输入框上的状态图标、Banner 因此都走 `<Icon>`。
   - Banner：`size="md"`，颜色 info→accent，其余同状态名（照原版 Banner.tsx 618 行）。同步把 `banner.css` 里 `> *` 的 16px 限制改成 `> :not(.astryx-icon)`，让图标保持 md 20px。
   - FieldStatus / FieldInfoTip / 输入框：`size="sm"`、`color="inherit"`（照原版 FieldStatus.tsx 200 行）。
2. **其它按原版该走 `<Icon>` 的地方**：
   - TextArea 超出字数限制时，计数前加 `<Icon icon="warning" size="sm">`（原版 681 行）。
   - Step 的 warning/error/success 状态用 `<Icon>`，disabled 时 `color="disabled"`（原版 1187 行）。完成态、进行中的圆环保持自画（原版也是自画）。
   - FieldLabel 的 `labelIcon` 字符串本来就走 `<Icon>`，无需改。
3. **文档站注册 lucide 图标表**：
   - `apps/docs` 新装 `@iconify-json/lucide@1.2.147`（加入 `pnpm-workspace.yaml` 的 docs catalog）。
   - 新增 `apps/docs/components/docsIcons.ts`，点名 `semantic.ts` 里所有 lucide 图标，让图标插件打包。
   - `theme/index.ts` 在非演练场预览框的页面里 `import('../../components/docsIcons')`。
4. **演练场 iframe 不注册**：
   - 发现 core 的 `semantic.ts` 里写了 `'lucide:…'`，图标插件会扫到它并在所有页面注册。所以 `.vitepress/config.ts` 里包了一层 `docsIconPlugin()`，不扫 `Icon/semantic.*`。
   - 预览框页面（`/playground/frame`）不加载 `docsIcons`，所以没有图标表，走 core 实心兜底。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Field/FieldIcon.vue` | 23 | 状态走 Icon，clear 自画 |
| `packages/core/src/Icon/status-icons-through-icon.test.ts` | 约 45 | 无图标表时画实心兜底；有图标表时画 lucide；Banner 的尺寸和颜色；info tip；TextArea 超限警告 |
| `apps/docs/components/docsIcons.ts` | 42 | 文档站的 lucide 图标表 |
| 其它改动 | | Banner.vue、banner.css、TextArea.vue、text-area.css、StepMarker.vue、Step.vue、Field.test.ts、config.ts、theme/index.ts、package.json、pnpm-workspace.yaml、pnpm-lock.yaml |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 状态图标走 Icon | `<Icon icon="warning" size color>` | `FieldIcon` 内部转 `<Icon>` | 同样按主题图标表解析，没有就用实心兜底 |
| 文档站有图标表、演练场没有 | neutral 主题带 lucide；`/built` 只有 token | 文档站页面加载 `docsIcons`；预览框不加载 | 浏览器里读 DOM 确认，见下 |

## 3. 和计划不一样的地方

- 没有给每个组件直接写 `<Icon>`，而是改 `FieldIcon` 一处，让 Banner、FieldStatus、FieldInfoTip、各输入框共用（DRY）。输出的 DOM 都是 `<Icon>`。
- 图标插件加了一层包装，不扫 `Icon/semantic.*`。否则 core 构建产物里的 lucide 名字会让演练场预览框也注册图标表。

## 4. 台账处理

无。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV vitest run --maxWorkers=2 packages/core apps/docs` | 过 | 282 个文件、3752 条用例 |
| 2 | `NODE_ENV=production` 同上 | 过 | 用例数相同 |
| 3 | `pnpm exec eslint . --max-warnings 0` | 过 | 退出码 0 |
| 4 | `env -u NODE_ENV pnpm check:packages` | 过 | 退出码 0 |
| 5 | 文档站 DOM | 过 | `/components/banner`、`field-status`：`svg path fill=none stroke=currentColor`（lucide 描边），`.astryx-icon__glyph` 数量 0；`/components/toast` 没有状态图标 |
| 6 | 演练场 iframe DOM | 过 | 我们：`.astryx-icon__glyph.astryx-icon--warning`（无 svg，实心 mask）。原版：`svg fill=currentColor`，`path fill-rule=evenodd d=M10.29 3.86L2.07 19.05…`。两边都是同一个 core 实心路径 |
| 7 | 视觉对照 | 过 | 见下 |

对照图：
- 文档站组件页整页（浅色、深色各一张，`<slug>` 取 banner / toast / field-status）：`/tmp/D15-visual/<slug>/{ours,upstream}-{light,dark}.png`。我只放大看了 Banner 浅色的"可关闭"示例：两边都是 20px 的 lucide 描边图标，形状、颜色一致。
- 演练场 theme-showcase 黄色提示条（元素截图，浅色、深色各一张）：`/tmp/D15-visual/playground/{ours,upstream}-{light,dark}.png`。两边都是实心三角形，颜色和大小一致。
- 演练场 DOM 记录：`/tmp/D15-visual/playground/dom.json`。
- 截图和读 DOM 的脚本：`/tmp/D15-visual/{shot,pg,dom}.mjs`。
- 说明：演练场的对照图是裁出来的 Banner 元素，不是整页（整页只有代码编辑器加预览框，看不清图标）。这一点偏离了"整页截图"的要求。

## 6. 拿不准的地方

- 演练场页面本身（编辑器壳）仍会加载 `docsIcons`，因为只有 `/playground/frame` 被排除。壳里没有状态图标，不影响显示。
- 演练场里用户代码如果直接写 `<Icon icon="lucide:...">` 之类的名字，仍需自己 `addIcon`，没有变化。
- Toast 在 Vue 版里没有状态图标，原版 Toast 也没有，所以没改。
- 文档站的 `docsIcons` 要和 `semantic.ts` 手动保持同步。目前是从 `semantic.ts` 抽出来的静态列表，没有加自动检查。
