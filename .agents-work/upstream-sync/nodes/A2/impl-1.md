# A2 视觉对照工具 · 实现回报（第 1 轮）

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A2`
- 分支：`sync/a2-visual-compare`
- 提交：`8bc28a0 feat(swarm): 新增视觉对照工具与浏览器锁`（未推送）

## 1. 做了什么

### 新增文件

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `scripts/swarm/visual-compare.mjs` | 213 | 主命令：编排起服务、拿锁、按组合顺序截图、拼图、算分、写报告，统一处理信号。 |
| `scripts/swarm/visual-compare/names.mjs` | 93 | 组件名 ↔ slug 映射、两边 URL、四种组合、输出路径。映射只在这里做。 |
| `scripts/swarm/visual-compare/args.mjs` | 64 | 命令行参数解析和用法说明。 |
| `scripts/swarm/visual-compare/capture.mjs` | 166 | 浏览器侧逻辑：两边站点的选择器、深浅色切换、加载就绪判断、截图、颜色模式校验。 |
| `scripts/swarm/visual-compare/image.mjs` | 262 | 纯 PNG 处理：补白对齐、背景色、内容框、pixelmatch 打分、左右拼图。 |
| `scripts/swarm/visual-compare/font.mjs` | 92 | 5×7 点阵字，给对照图顶部写标签，不依赖系统字体或 canvas。 |
| `scripts/swarm/visual-compare/report.mjs` | 92 | 生成 report.json、report.md。 |
| `scripts/swarm/visual-compare/serve.mjs` | 202 | 在 5172 端口起文档站，多进程按租约共用，最后一个使用者整组关掉。 |
| `scripts/swarm/browser-lock.mjs` | 231 | 浏览器锁：`withBrowserLock()`、`run` / `status` 命令行。 |
| `scripts/swarm/README.md` | - | 用法、参数、输出、分数解读、常见问题、锁的用法。 |
| `tests/visual-compare.test.ts` | - | 29 个纯逻辑测试，不开浏览器。 |

所有源码文件都不超过 500 行。

### 修改文件

- `package.json`：
  - 新增 devDependencies：`playwright`、`pixelmatch`、`pngjs`、`@types/pngjs`，全部写成 `catalog:visual`。
  - 新增脚本 `"visual": "node scripts/swarm/visual-compare.mjs"`。
- `pnpm-workspace.yaml`：新建 `catalog:visual`：
  - `playwright: 1.63.0`
  - `pixelmatch: 8.0.0`
  - `pngjs: 7.0.0`
  - `@types/pngjs: 6.0.5`
- `pnpm-lock.yaml`：随安装更新。
- `.gitignore`：加入 `.agents-work/upstream-sync/visual/`。

### 为什么是 playwright 1.63.0

本机另一个项目（`~/oss-dev/pi-web`）里装着 `playwright-core` 1.63.0，它的 `browsers.json` 写的 chromium revision 正好是 1243。装好以后，`chromium.executablePath()` 直接指向 `~/Library/Caches/ms-playwright/chromium-1243/...`，没有下载任何浏览器。安装时也设置了 `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`。

无头模式下，实际启动的是 `chromium_headless_shell-1243` 里的 `chrome-headless-shell`，同样是已有的那份。

## 2. 选择器与深浅色

### 预览区选择器

**上游**：`[data-astryx-theme="neutral"]:first-child > .astryx-card:only-child`，并且这张卡片的第一个子元素必须带内联的 `aspect-ratio` 或 `min-height` 样式。

- 来源：上游 `ComponentDetailClient.tsx` 的 `OverviewContent`。Overview 的第一个区块是 `<ComponentPreviewTheme><Card variant="muted" padding={0}><ShowcasePreview/></Card></ComponentPreviewTheme>`。`ComponentPreviewTheme` 会渲染一个带 `data-astryx-theme="neutral"` 的嵌套主题层。`ShowcasePreview` 的舞台在桌面端是内联 `aspect-ratio: 16/9`，在窄屏是 `min-height: 160`。
- 为什么要加这么多限制：下方示例区也有 neutral 包裹层，所以要求包裹层是 `:first-child`，并且舞台带内联样式。
- 为什么选它：上游用 StyleX，类名是哈希，不稳定。`data-astryx-theme` 和 `.astryx-card` 是组件库自己输出的稳定标记。
- 就绪判断：展示内容是懒加载的。加载前是一个转圈占位，舞台上没有 `overflow` 内联样式，出现 `overflow` 才算加载好。

**我们**：`.component-detail__stage`，也就是 `ComponentDocsShell.vue` 的预览舞台。就绪判断是舞台里出现了子元素。

找到预览区后，工具只在截图用的那个页面里，临时给它加一个 `data-visual-compare-root` 属性，后面定位都用这个属性。这不改站点源码，所以**我们的文档站不需要专门加标记**。

截图方式是整页截图，再按元素位置裁切。

### 深浅色怎么切

**上游**：

- 源码依据：`app/providers.tsx` 的模式初始为 `'system'`，在 effect 里跟随 `matchMedia('(prefers-color-scheme: dark)')`，页面上没有任何持久化开关。
- 所以只要给浏览器上下文设 `colorScheme`，页面就跟着变。
- 验证：`<html data-theme>` 等于期望值。

**我们**：

- 用 `addInitScript` 写入 `localStorage['vitepress-theme-appearance']`，同时设 `colorScheme`。
- 验证：`<html>` 有没有 `dark` 类与期望一致。

**两边共用的第二道校验**：截完图后读截图边缘一圈出现最多的颜色，算 sRGB 相对亮度，低于 0.18 算深色。页面标记和亮度有一项对不上，这个组合就报错。

第二道校验最早是读 DOM 计算样式，后来改成读截图像素。原因是上游的 html 和 body 背景都是透明的，用 DOM 读会读成白色，在 `--section all` 深色模式下误报过一次。

## 3. 自测结果

1. **三个组件、四种组合全部跑通。** `pnpm visual Button`、`Dialog`、`Selector` 都是 exit 0。每个组合生成 upstream.png、ours.png、side-by-side.png，外加 diff.png（计划外，便于定位差异）。每个组件有 report.json 和 report.md。

   分数表（内容区 / 整图）：

   | 组件 | desktop-light | desktop-dark | mobile-light | mobile-dark |
   | --- | --- | --- | --- | --- |
   | Button | 61.08% / 1.5% | 64.11% / 1.58% | 28.99% / 56.97% | 36.24% / 59.19% |
   | Dialog | 30.18% / 5.85% | 29.18% / 5.28% | 43.72% / 54.78% | 39.93% / 52.56% |
   | Selector | 5.36% / 0.26% | 5.46% / 0.27% | 29.09% / 52.21% | 29.19% / 52.2% |

   预览区尺寸：桌面端两边都是 912×513。窄屏上游 684×320，我们 708×640（2 倍像素，也就是 CSS 342×160 对 354×320）。

   对照图路径，`<C>` 是 Button、Dialog 或 Selector，`<combo>` 是四种组合之一：
   `/Users/shenqingchuan/workspace/astryx-vue-wt/A2/.agents-work/upstream-sync/visual/<C>/<combo>/side-by-side.png`

2. **人工看图。** 看了 Button 的 desktop-dark 和 mobile-light、Dialog 的 desktop-light 和 mobile-dark、Selector 的 desktop-light 和 mobile-dark，以及 Button 的 `--section all` desktop-dark：
   - 左右是同一个组件。
   - 深色组合确实是深色。
   - 窄屏组合确实是窄屏，标签放大到 2 倍。

   顺带看到的真实差异（不属于 A2，给后续节点参考）：
   - Button 的 demo 文案不同：上游 Primary/Secondary/Ghost/Destructive，我们 Save/Cancel/Delete。
   - Dialog 的内容和宽度不同。
   - Selector 我们这边宽度窄，还多显示了一行「Fruit」。
   - 窄屏预览区高度不同：上游 160，我们 320。上游窄屏预览区左对齐并且内容溢出。

3. **并发与排队。**
   - 用 `browser-lock.mjs run --purpose ... -- sleep 40` 占住 browser-1。同时跑两个 `visual-compare Selector`：第一个拿到 browser-2，第二个打印「排队中」，第一个结束后第二个接着跑完。
   - 第二个进程复用了第一个起的文档站，最后一个结束时端口关闭，两个槽都空闲。
   - 另外测了两个槽都被 `run` 占住时第三个排队的情况。

4. **Ctrl+C。** 截图进行中，对进程发 SIGINT：
   - 进程退出码 130。
   - `chrome-headless-shell` 进程数从 4 降到 0。
   - 5172 端口释放，锁槽清空。

   另外测了：排队时 SIGINT，锁和服务都清干净；`run` 子命令收到 SIGINT 或 SIGTERM，子进程被杀、锁被释放。

   说明：机器上一直有一个 pid 53886 的 `Google Chrome for Testing`（chromium-1243 有头版），我开始工作前就在，不是本工具留下的。

5. `pnpm vitest run --maxWorkers=2 tests/visual-compare.test.ts`：29 个测试全部通过。

6. **`pnpm check` 全部通过。** `pnpm lint`、`pnpm typecheck` 都通过。为遵守 `--maxWorkers=2` 的纪律，我把 `pnpm check` 拆开逐项跑：
   - `check:packages`
   - `lint`
   - `typecheck`
   - `vitest run --maxWorkers=2`：2207 个测试通过
   - `build`
   - `lint:pkg`

7. 所有新源码文件都不超过 500 行，最大的是 image.mjs，262 行。

## 4. 偏离计划和拿不准的地方

- **分数改成两个。** 计划只要一个像素差异百分比。实测发现预览区大部分是空白背景，整图百分比会被冲得很淡：Button 文案完全不同，整图分数却只有 1.5%，会被判成「基本一致」。所以增加了「内容区分数」：分母是两边组件内容外接框的并集，结论按它给。整图分数保留，它能反映尺寸差。阈值是 2% 和 10%，写在 README 和 report.md 里，属于保守的初始值，需要验收和后续节点按实际情况调整。
- **内容区分数对文案差异很敏感。** demo 文案不同时，就算样式一样，分数也会很高。README 里写明了「以看图为准」，同时报告里列出两边各自的组件内容尺寸，帮助判断。
- **增加了 diff.png。** 计划里没有，是额外输出。
- **新增参数 `--proxy`、`--no-proxy`、`--lock-timeout`。** 代理默认取 `https_proxy` 环境变量，没有就用 `http://127.0.0.1:7890`。只有上游走代理，本地文档站直连。
- **文档站必须先构建。** `apps/docs/.vitepress/config.ts` 在加载配置时 import `@astryx-vue/core/icons`，这一步不走 `source` 条件，走的是 dist。所以 dist 不存在时，工具会先自动跑 `pnpm build:packages`。
- **起服务时强制 `NODE_ENV=development`。** 当前环境带着 `NODE_ENV=production`，VitePress 开发服务会因此按生产模式找页面，所有页面 404，并报 `__VP_HASH_MAP__ is not defined`。手动起服务再配 `--no-serve` 的人要注意这一点，已写进 README 的常见问题。
- **文档站服务共用。** 计划只说「用完关掉」。为了让「两个终端同时跑」不冲突，做了按工作区区分的租约（`$TMPDIR/astryx-visual-serve-5172/`）。别的工作区占着 5172 时会报错，不会抢。
- **上游没有预览区的页面。** 比如 `useClipboard` 等 hook 页：overview 模式下这个组合报「没有这个组件的预览区」，命令返回非 0。整页模式（`--section all`）照常可用。
- **锁的失效判断。** 依赖 `owner.json`。如果一个进程刚 `mkdir` 完、还没写 `owner.json` 就崩了，这个槽不会被自动回收，要手动 `rmdir`。这种情况概率很低。
- **窄屏截图的选择器。** 窄屏截图依赖上游 `ShowcasePreview` 的内联 `min-height` 样式。上游改了这块结构，选择器就要跟着更新，失败时报错会写明用的是哪个选择器。
