# A2 视觉对照工具 · 执行计划

## 目标

做一个命令行工具。给它一个组件名，它会打开上游官网和我们文档站上同一个组件页面，按四种组合截图：桌面或 390px 窄屏，浅色或深色。
每种组合都拼成一张「左边上游、右边我们」的对照图，再给出一个像素差异分数。

以后每个组件节点的验收者，都要靠这个工具看「长得像不像」。所以它要稳定、好用、不吃内存。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A2`，分支 `sync/a2-visual-compare`。只在这里改代码。
- 访问外网（上游官网 `https://astryx.atmeta.com`、npm）前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`。浏览器访问上游官网也要走这个代理，用 Playwright 的 `proxy` 选项。
- 本机已有 Playwright 下载好的 Chromium：`~/Library/Caches/ms-playwright/chromium-1243`、`chromium_headless_shell-1243`。优先复用这些，不要重新下载浏览器。先确认这两个对应哪个 `playwright` 版本，再装匹配的版本。
- 上游源码在 `/Users/shenqingchuan/workspace/astryx-upstream`，只读，可以用来查上游文档页的结构（`apps/docsite/`）。
- 任务树：`/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/ROADMAP.md`；协作规程：同目录 `SWARM.md`。
- 跑测试时限制并发：`pnpm vitest run --maxWorkers=2 <文件>`。

## 资源限制（必须遵守）

- 整台电脑同时最多只能开 2 个浏览器会话，你自己同一时刻只开 **1 个** Chromium 进程。用完立刻关掉，异常退出时也要关（`try/finally`）。
- 四种组合在同一个浏览器进程里，按顺序用不同的 context 跑，不要并行开 4 个浏览器。
- 我们的文档站服务固定用端口 `5172`（你是 2 号槽位），用完关掉。

## 范围

要做：

1. `scripts/swarm/visual-compare.mjs`：主命令（可以拆成几个模块放在 `scripts/swarm/visual-compare/` 目录里）。
2. `scripts/swarm/browser-lock.mjs`：浏览器锁（规则见下文），对照工具必须通过它拿锁。
3. 根目录 `package.json` 新增 devDependency `playwright`（照 `pnpm-workspace.yaml` 的规矩加进合适的 catalog，比如新建 `catalog:testing` 或 `catalog:visual`，不能写空的 `catalog:`）。拼图和算差异如果要用 `pngjs`、`pixelmatch`，也按同样方式加。
4. 根目录 `package.json` 加脚本 `"visual": "node scripts/swarm/visual-compare.mjs"`。
5. 说明文档 `scripts/swarm/README.md`：怎么用、参数、输出在哪、分数怎么理解、常见问题。
6. 测试 `tests/visual-compare.test.ts`：只测纯逻辑，不开浏览器。要测的有：URL 生成、组件名映射、锁的获取和释放、差异分数计算（用两张小 PNG）、输出路径命名。

不做：

- 不改任何组件和文档站页面的源码。如果为了截图稳定，需要给我们的文档站加一个专门的标记（比如 `data-visual-root`），先在回报里说明，不要自己加。
- 不接 CI，那是 E4 的事。

## 命令设计

```
pnpm visual <组件> [--section overview|all] [--combos desktop-light,desktop-dark,mobile-light,mobile-dark]
                  [--ours <url>] [--upstream <url>] [--out <dir>] [--no-serve]
```

- `<组件>`：用组件的英文名，比如 `Button`、`DropdownMenu`。我们站点用 kebab-case 的 slug（`button`、`dropdown-menu`），上游用 `/components/Button`。映射逻辑要统一放在一处，并且有测试。
- 我们的站点地址：默认在 5172 端口自己起文档站开发服务（`pnpm --filter @astryx-vue/docs dev --port 5172`，开之前要先 `pnpm build:packages`，或者用 `source` 条件，去 `vitest.config.ts` 和文档站配置里看现在怎么做的），等页面能访问再截图，结束后关掉服务。传了 `--ours` 就直接用那个地址，不起服务。`--no-serve` 表示假设服务已经在跑。
- 上游地址默认 `https://astryx.atmeta.com/components/<Name>`。
- 我们站点的组件页在 `/components/<slug>/`（中文）和 `/en/components/<slug>/`。上游是英文页，所以对照时用我们的英文页 `/en/components/<slug>/`。

## 截什么

- `--section overview`（默认）：截页面顶部的组件预览区，也就是标题下面那块大的示例舞台，不截整页。两边的页面结构不一样，所以要分别找到两边对应的元素：
  - 上游：去 `astryx-upstream/apps/docsite` 里查组件页的结构，找出稳定的选择器。
  - 我们：去 `apps/docs/components/demo-infra/` 里查（`ComponentDocsShell.vue`、`StageFit.vue`、`DemoExample.vue` 等）。
- `--section all`：两边的整页长截图。只拼图，不算分数，因为两边页面结构不同，分数没有意义。
- 截图前要做到：等字体加载完（`document.fonts.ready`），关掉动画和过渡（注入 CSS：`*{animation:none!important;transition:none!important;caret-color:transparent!important}`），等网络空闲，鼠标移出页面。

## 四种组合

| 组合 | 视口 | 颜色 |
| --- | --- | --- |
| desktop-light | 1440×900 | 浅色 |
| desktop-dark | 1440×900 | 深色 |
| mobile-light | 390×844，`deviceScaleFactor` 2，`isMobile`，`hasTouch` | 浅色 |
| mobile-dark | 同上 | 深色 |

深浅色怎么切换：

- 设置 `colorScheme: 'dark'` 是基础，但不一定够。
- 我们的站点是 VitePress，它的深色模式由 `localStorage` 的 `vitepress-theme-appearance` 控制，还会给 `html` 加上 `dark` 类。
- 上游站点有自己的切换方式，要去源码里查清楚。

每种组合截完以后，要检查页面是否真的是对应的颜色模式。比如读背景色，判断是亮还是暗。不对就报错，不能默默截一张错的图。

## 输出

```
<out>/<Component>/<combo>/upstream.png
<out>/<Component>/<combo>/ours.png
<out>/<Component>/<combo>/side-by-side.png   左上游、右我们，中间留 16px 灰色分隔，顶部各写一行小标签
<out>/<Component>/report.json               每种组合的分数、两张图的尺寸、两边 URL、时间、工具版本
<out>/<Component>/report.md                 人能读的摘要，用相对路径引用图片
```

- `--out` 的默认值是 `.agents-work/upstream-sync/visual/`。把它加进 `.gitignore`。
- 差异分数：先把两张图缩放或者补白到同样尺寸（规则要写清楚），再用 pixelmatch 数出不同的像素，算出百分比。`report.md` 里给一个粗略的解释：低于多少算「基本一致」，高于多少「明显不同」。阈值先定一个保守值，写进 README。
- 尺寸差别本身也要报告出来，因为预览区高度不同就是一个重要信号。

## 浏览器锁

规则写在 `SWARM.md` 里：

- 锁目录：`$(git rev-parse --git-common-dir)/swarm-locks/`，里面有 `browser-1` 和 `browser-2` 两个槽。所有工作区共用这一份。
- 拿锁：用原子操作 `mkdir` 依次尝试 `browser-1`、`browser-2`。成功的那个，里面写一个 `owner.json`，记录 pid、工作区路径、开始时间、用途。
- 拿不到锁就每 5 秒重试一次，打印「排队中」。默认最多等 30 分钟，可以配置。
- 释放：进程正常退出、出错、收到 SIGINT 或 SIGTERM 时都要删掉锁目录。
- 死锁回收：锁里记录的 pid 已经不存在，或者锁已经持有超过 2 小时，就视为失效，可以收回。
- 导出两种用法：
  - 函数 `withBrowserLock(purpose, fn)`。
  - 命令行 `node scripts/swarm/browser-lock.mjs run --purpose <说明> -- <命令...>`：拿到锁后执行命令，命令结束后释放。验收者手动开浏览器时用这种方式。
- 锁的测试用临时目录，不要碰真的 git 公共目录。

## 自测清单

1. `pnpm visual Button`、`pnpm visual Dialog`、`pnpm visual Selector` 三个都跑通，四种组合各自生成三张图、`report.json` 和 `report.md`。
2. 你自己打开几张 `side-by-side.png` 看一下：左右确实是同一个组件，深色组合确实是深色，窄屏组合确实是窄屏。
3. 同时在两个终端跑同一个命令，再用 `browser-lock.mjs run` 占住一个槽，确认第三个会排队，前面的释放以后它能继续。
4. 跑的过程中按 Ctrl+C，确认锁被释放，5172 端口上的服务被关掉，没有残留的 Chromium 进程（`pgrep -fl Chromium`）。
5. `pnpm vitest run --maxWorkers=2 tests/visual-compare.test.ts` 通过。
6. `pnpm lint`、`pnpm typecheck` 通过。最后跑一次完整的 `pnpm check`。
7. 新写的源码文件每个都不超过 500 行。

## 提交与回报

- 在分支上提交，提交信息用中文。不要推送，不要开 PR。
- 写回报文件 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/A2/impl-1.md`（写在主仓库这个路径），内容包括：
  1. 做了什么，新增和修改了哪些文件，新增了哪些依赖和版本。
  2. 两边页面分别用什么选择器截预览区，为什么选它，深浅色分别怎么切换。
  3. 自测清单每一项的结果。三个组件、四种组合的分数，以及 `side-by-side.png` 的绝对路径。
  4. 拿不准的地方、做不到的地方。比如上游某个组件页没有预览区、或者需要我们文档站加标记的情况。
- 你的最终回复用中文，300 字以内。
