# A2 视觉对照工具 · 验收报告（第 1 轮）

## 结论：通过

24 项全部通过，没有阻断项。有 4 条改进建议，不影响通过，见末尾。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A2`，分支 `sync/a2-visual-compare`，提交 `8bc28a0`。
- 比较基点：`git diff 552af3f`。
- 所有产物在 `/tmp/verify-A2/`，全部自己重新生成，没有使用实现者留下的 `visual/` 目录。
- 开始和结束时的 `git status` 一致：都是 clean（`status-start.txt` 与 `status-end.txt` diff 为空）。
- Chrome 进程基线 11 个（含 pid 53886）。全部测试结束后，进程列表和基线完全相同。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | Button、Dialog、Selector 三个都成功退出 | 过 | `pnpm visual X --out /tmp/verify-A2/out`，三次 exit=0（`run-*.log`） |
| 2 | 4 个组合目录，每个有三张图，每组件有 report.json 和 report.md | 过 | `find /tmp/verify-A2/out` 列出 3×4 目录，每个都有 upstream/ours/side-by-side（另有 diff.png），每组件有 report.json 和 report.md |
| 3 | 左上游、右我们，同一个组件的预览区 | 过 | 见下面「看图」，6 张 + 2 张补充 |
| 4 | 顶部标签 | 过 | 每张图顶部灰条有 `UPSTREAM <combo>` / `OURS <combo>` |
| 5 | dark 两边深色，light 两边浅色 | 过 | 所有 dark 图两边都是深灰底，所有 light 图两边都是浅灰底 |
| 6 | mobile 对应 390px 视口，desktop 更宽 | 过 | report.json 里 mobile 视口 390×844、deviceScaleFactor 2，desktop 1440×900。`--section all` 的整页图宽 780（=390×2）。overview 的预览区宽 684/708（=342/354 CSS 像素，是视口减去页边距），desktop 为 912，明显更宽 |
| 7 | 无骨架、无空白、字体已加载 | 过 | 8 张图里组件都已完整渲染，字体都是同一款几何无衬线体（不是后备字体），没有转圈占位 |
| 8 | report.json 有每组合分数、两图尺寸、两边 URL；URL 返回 200 | 过 | report.json 含 `urls`、`combos[].score/upstream/ours/sizeDelta`。上游 `https://astryx.atmeta.com/components/Button` 与 `/DropdownMenu` curl 为 200。我们的 `http://localhost:5172/en/components/dropdown-menu`（带或不带末尾斜杠）在服务运行时 curl 为 200 |
| 9 | 分数复算在 1 个百分点内；自比为 0 | 过 | 自写脚本 `/tmp/verify-A2/recompute.mjs`（独立实现补白、内容框、并集分母，并另用裁切子图再跑一遍 pixelmatch），结果见下表。自比 0 / 0 |
| 10 | report.md 相对路径、写了阈值含义 | 过 | 图片写成 `desktop-light/side-by-side.png`；写了「低于 2% 基本一致、2%~10% 看图、高于 10% 明显不同，以看图为准」 |
| 11 | 占满两个槽时打印「排队」并等待，释放后自动完成 | 过 | 两个 `run ... sleep 60` 占住 browser-1/2。`pnpm visual Button` 持续打印「排队中」，期间 `pgrep` 总数仍为 11（没有开浏览器）。sleep 结束后自动跑完 4 个组合，exit=0。文档站此时已在 5172 监听，排队期间不影响 |
| 12 | 锁目录位置、owner.json、结束后删除 | 过 | 目录是 `/Users/shenqingchuan/workspace/astryx-vue/.git/swarm-locks/`。owner.json 含 pid、cwd、purpose、startedAt。所有进程结束后目录为空 |
| 13 | SIGINT 后锁释放、5172 无监听、无残留 | 过 | 运行约 15 秒时：锁 browser-1、`chrome-headless-shell` 4 个进程、端口 5172 有监听。对 node 进程发 `kill -INT`：退出码 130，日志「收到 SIGINT，正在清理」。3 秒后：锁为空、5172 无监听、headless 为 0、Chrome 进程列表与基线一致 |
| 14 | 失效锁回收 | 过 | 手建 browser-1/2，owner.json 写了不存在的 pid。`browser-lock.mjs run` 打印「已拿到 browser-1」并执行成功。已清理 |
| 15 | 同一时刻只有一个浏览器进程树 | 过 | 运行中总数 15 = 基线 11 + 4，4 个都是 chrome-headless-shell（一棵树）。DropdownMenu 双组合运行中也是 15（只多 4 个） |
| 16 | `--help` / 无参数有用法 | 过 | `pnpm visual --help` 打印完整中文用法，exit 0；不带参数打印「需要且只需要一个组件名，收到 0 个」加用法 |
| 17 | 组件名映射 | 过 | DropdownMenu 的 report.json：上游 `https://astryx.atmeta.com/components/DropdownMenu`，我们 `http://localhost:5172/en/components/dropdown-menu`。两边都截到图（内容区 6.18%） |
| 18 | 不存在的组件名：中文报错、非 0、无残留 | 过 | `pnpm visual NotAThing`：「失败：upstream 页面返回 HTTP 404：…」，exit=1。之后锁为空、5172 无监听、Chrome 无新增。见建议 3 |
| 19 | README 覆盖用法、参数、输出、分数、锁 | 过 | `scripts/swarm/README.md` 177 行，含「一句话用法」「参数」「输出」「分数怎么理解」「浏览器锁 / 命令行」，都有。见建议 4 |
| 20 | 单测通过且不开浏览器 | 过 | `pnpm vitest run --maxWorkers=2 tests/visual-compare.test.ts`：29 passed。测试文件只 import pngjs 和 `scripts/swarm/*` 的纯函数，没有 playwright 的 launch。运行期间 `pgrep chrome-headless` 一直为 0 |
| 21 | `pnpm check` | 过 | 按要求拆开：check:packages、lint、typecheck 均 exit 0；`pnpm vitest run --maxWorkers=2` 全量 exit 0；build exit 0；lint:pkg exit 0 |
| 22 | catalog 有名字；没有下载新浏览器 | 过 | `pnpm-workspace.yaml` 新增 `catalogs.visual`，package.json 里都是 `catalog:visual`。`~/Library/Caches/ms-playwright/` 里没有新增目录，1243 的创建时间是 Oct 18，早于本次验收 |
| 23 | 源码文件不超过 500 行；.gitignore | 过 | 新增 .mjs 最大 262 行（image.mjs），共 9 个文件都小于 500。`.gitignore` 含 `.agents-work/upstream-sync-0.7.1/visual/` |
| 24 | 没改组件和文档站源码 | 过 | `git diff 552af3f --stat` 共 15 个文件，全在 `scripts/`、`tests/`、根配置、lock 里。`-- apps packages` 范围改动为 0 |

### 第 9 项：分数复算

「脚本」是我自己的实现（独立算内容框与并集），「报告」是工具输出。

| 图 | 整图 脚本 / 报告 | 内容区 脚本 / 报告 |
| --- | --- | --- |
| Button desktop-light | 1.50 / 1.5 | 61.08 / 61.08 |
| Button mobile-dark | 59.19 / 59.19 | 36.24 / 36.24 |
| Dialog desktop-dark | 5.28 / 5.28 | 29.18 / 29.18 |
| Selector desktop-light | 0.26 / 0.26 | 5.36（用裁切子图法 5.37）/ 5.36 |
| Selector mobile-light | 52.21 / 52.21 | 29.09（裁切法 29.10）/ 29.09 |
| 自比：Button desktop-light 的 upstream 对自己 | 0 | 0 |
| 自比：Button mobile-dark 的 ours 对自己 | 0 | 0 |

内容区的并集框也和报告里的 `contentBox` 一致，例如 Button desktop-light 是 `{x:276,y:241,w:360,h:32}`，分母是 360×32=11520。

## 看图

每张图都是用读图工具直接打开的，路径在 `/tmp/verify-A2/out/` 下。

| 图 | 看到的内容 |
| --- | --- |
| `Button/desktop-dark/side-by-side.png`（1840×539） | 左标签 `UPSTREAM DESKTOP-DARK`，右 `OURS DESKTOP-DARK`。两边都是深灰底的预览区，中间一排按钮：左是 Primary/Secondary/Ghost/Destructive，右是 Save/Cancel/Delete。同一个 Button 组件，不是整页，也没有导航栏 |
| `Button/mobile-light/side-by-side.png`（1424×692） | 两边浅灰底。左边按钮行靠左贴边，Destructive 被右边裁掉一截，预览区高 160（320px 图）。右边 3 个按钮居中，预览区高 320（640px）。左图下半部分是白色补白（因为两张图高度不同，补出来的）。宽度合 390px 视口 |
| `Dialog/desktop-light/side-by-side.png` | 两边浅底。左边弹窗是「Modal Title」加关闭叉，右边是「Share project」加 Done 按钮。都是 Dialog 的预览，两边内容、宽度不同（这是真实差异，不是工具问题） |
| `Dialog/mobile-dark/side-by-side.png` | 两边深色。左边弹窗靠左溢出，右边的叉被裁；右边弹窗居中，完整可见。下方左图有白色补白 |
| `Selector/desktop-light/side-by-side.png` | 两边浅底，左边是一个「Fruit」标签加下拉框（宽 300），右边是两行「Fruit」加一个较窄的下拉框（我们这边多一行标签，这是组件差异） |
| `Selector/mobile-dark/side-by-side.png` | 两边深色。左边标签和下拉框靠左，宽；右边居中、窄，多一行「Fruit」。左图下方有白色补白 |
| `Button/mobile-dark/side-by-side.png`（补看） | 深色，布局和 mobile-light 一致，两边都是深色底 |
| `Dialog/desktop-dark/side-by-side.png`（补看） | 两边都是深灰底，弹窗在中央，字体清晰 |

覆盖情况：三个组件都有；四种组合（desktop-light、desktop-dark、mobile-light、mobile-dark）都有。8 张图里，所有图的颜色模式都和标签一致，没有任何一边颜色错、位置错、加载中或字体后备的情况。

另外，用 `--section all --combos mobile-light` 跑了一次，整页图宽 780，确认窄屏视口宽确实是 390 CSS 像素。

## 对实现者偏离的判断

| 偏离 | 判断 |
| --- | --- |
| 1. 两个分数，用内容区下结论 | 合理，没有削弱。我复算了两个分数都对。理由：Button 桌面端整图只有 1.5%，会被判成「基本一致」，而内容区是 61%。两个分数都保留，也写明了分母。这反而让工具更有用 |
| 2. 多输出 diff.png | 合理，无害，也在 README 里写了 |
| 3. 新增 `--proxy`、`--no-proxy`、`--lock-timeout` | 合理。默认值（环境变量，再退到 7890）和用户的代理约定一致。只有上游走代理，本地文档站直连，这点我实测没问题 |
| 4. 文档站按租约共用 | 合理，实测：排队期间第二个进程复用了已有服务，最后一个退出后 5172 释放。每次测试后端口都是空的 |
| 5. 强制 `NODE_ENV=development` | 合理，是为了绕开环境里 production 造成的 404，README 的「常见问题」里写了 |

## 改进建议（不影响通过）

1. **窄屏内容框会漏掉贴边内容。** `image.mjs` 的 `CORNER_INSET = 32` 会忽略离边缘 32 像素内的像素。上游窄屏的按钮行是贴左边的（Primary 从 x=0 开始，右边 Destructive 被裁），所以报告里的上游内容框是 `x:32,w:620`，Primary 最左边那一截没算进去。结果是窄屏的内容区分数可能略偏低。建议只忽略四个圆角的区域，或者按圆角形状排除，不要整圈忽略。
2. **README 里的上游选择器和代码不一致。** README 写的是 `[data-astryx-theme="neutral"] > .astryx-card`，代码实际是 `[data-astryx-theme="neutral"]:first-child > .astryx-card:only-child`，还附加了「舞台带内联样式」的条件。README 应该同步。
3. **拼错组件名时太晚才报错。** `NotAThing` 要等文档站启动、拿锁、开浏览器、请求上游得到 404 之后才失败。建议先用 `curl`/`fetch` 检查上游页面（或先看我们的 slug 是否存在），不存在就直接报错，别浪费一次浏览器锁。
4. **README 里 `--out` 的默认位置在 worktree 内。** 这没问题，但各节点的验收者可能会忘了加 `--out`，导致产物落进各自工作区。建议在 README 里提醒验收时用 `--out /tmp/...`。

## 不通过的项要怎么改

无。
