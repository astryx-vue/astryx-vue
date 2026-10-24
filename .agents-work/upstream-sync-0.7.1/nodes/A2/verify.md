# A2 视觉对照工具 · 验收计划

你是验收者，只检查，不改代码。实现者的回报（`impl-<N>.md`）只能用来了解他做了什么，不能当证据。每一条都要你自己动手重新验证。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A2`，分支 `sync/a2-visual-compare`。
- 访问外网前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`
- 跑测试时限制并发：`--maxWorkers=2`。
- **浏览器纪律**：整台电脑同时最多开 2 个浏览器会话。你只用工具本身来开浏览器，工具会自己拿锁。需要手动看图的时候，用读图工具直接读 PNG 文件，不要另开浏览器。
- 文档站服务用 5172 端口，用完要确认已经关掉。
- 开始前运行一次 `git status`，结束时再运行一次，两次结果必须相同。你的输出一律用 `--out /tmp/verify-A2/...`，不要写进仓库。

## 检查项

每一项只能判定「过」或「不过」，并附上证据。

### 一、三个组件都能跑通

1. 依次运行 `pnpm visual Button --out /tmp/verify-A2/out`、`Dialog`、`Selector`，三个都要成功退出。
2. 每个组件下面都有 4 个组合目录：`desktop-light`、`desktop-dark`、`mobile-light`、`mobile-dark`。每个目录里都有 `upstream.png`、`ours.png`、`side-by-side.png`。另外每个组件还有 `report.json` 和 `report.md`。

### 二、亲眼看图，这是最重要的一部分

至少看 6 张 `side-by-side.png`：三个组件都要覆盖，四种组合也都要覆盖。用读图工具打开，逐张确认：

3. 左边是上游，右边是我们。两边截的是**同一个组件**的预览区，不是整页，也不是导航栏或别的区域。
4. 图片顶部有标签，能看出哪边是哪边。
5. 标着 dark 的图，两边都确实是深色背景；标着 light 的，两边都是浅色。只要有一边颜色模式不对，就判不过。
6. 标着 mobile 的图，两边宽度都对应 390px 视口（在 2 倍像素密度下大约 780px 宽）。desktop 的图明显更宽。
7. 截图里没有加载中的骨架、没有空白、没有渲染到一半的内容，字体也已经加载好了（不是系统默认的后备字体）。

在报告里写清楚：看了哪几张图，每张看到了什么。

### 三、报告内容

8. `report.json` 里有这些内容：每种组合的差异分数、两张图的尺寸、两边的 URL。把这两个 URL 用 curl 访问，都能返回 200。
9. 分数合理：拿其中一组 `upstream.png` 和 `ours.png`，自己用 pixelmatch（工作区里已经装了）或者别的方法算一次差异百分比，和报告里的值相差不超过 1 个百分点。还要做一个对照：把同一张图和它自己比，分数应该是 0。
10. `report.md` 里图片用的是相对路径，并且写了分数阈值该怎么理解。

### 四、浏览器锁和资源回收

11. 手动占住两个槽：开两个后台进程，分别运行 `node scripts/swarm/browser-lock.mjs run --purpose verify-hold -- sleep 60`。然后再运行 `pnpm visual Button --out /tmp/verify-A2/q`，确认它打印「排队」并且在等待，而不是直接开浏览器。等那两个 sleep 结束，它应该自动继续往下跑并完成。（这个过程中，锁占着的时候不会真的开浏览器，不会超过上限。）
12. 锁目录在 `$(git rev-parse --git-common-dir)/swarm-locks/`。用 `ls` 确认锁里有 `owner.json`，内容包含 pid 和用途。进程结束后锁目录被删掉。
13. 运行 `pnpm visual Button --out /tmp/verify-A2/int`，大约 15 秒后发送 SIGINT（`kill -INT`）。之后确认三件事：锁已经释放；5172 端口没有进程在监听（`lsof -i :5172`）；没有这次留下的 Chromium 残留（`pgrep -fl "chrom"`，和开始前对比）。
14. 失效锁回收：手动建一个锁目录，里面的 `owner.json` 写一个不存在的 pid。工具应该能把它收回并继续运行。做完以后清理这个锁目录。
15. 整个过程中，用 `pgrep -fl chrom | wc -l` 抽查几次。这个工具同一时刻只开一个浏览器进程树。

### 五、命令行与文档

16. 运行 `pnpm visual --help`（或者不带参数直接运行），能看到用法说明。
17. 组件名映射正确：运行 `pnpm visual DropdownMenu --combos desktop-light --out /tmp/verify-A2/dd`，确认两边打开的 URL 都对。我们这边是 `/en/components/dropdown-menu/`，上游是 `/components/DropdownMenu`。
18. 传一个不存在的组件名，比如 `pnpm visual NotAThing`，要给出清楚的中文报错，退出码不为 0，而且不能留下锁或服务。
19. 读一遍 `scripts/swarm/README.md`，确认里面写清楚了用法、参数、输出位置、分数怎么理解、浏览器锁的手动用法。

### 六、工程质量

20. 运行 `pnpm vitest run --maxWorkers=2 tests/visual-compare.test.ts`，必须通过，而且测试里不会开浏览器。确认方法：看代码，再看跑测试时有没有 Chromium 进程出现。
21. 运行 `pnpm check`，必须通过。
22. 新增的依赖都放进了有名字的 catalog（不能是空的 `catalog:`），并且没有触发 Playwright 去下载新浏览器。
23. 新增的源码文件都不超过 500 行，`.gitignore` 里加上了 `.agents-work/upstream-sync-0.7.1/visual/`。
24. 没有改动任何组件源码和文档站页面源码。用 `git diff swarm-tree --stat` 核对。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/A2/verify-<N>.md`，格式和 A1 一样：先写结论，然后是一张逐条的表格（编号、检查项、结果、证据），最后写「不通过的项要怎么改」。看图那一节，要写明每张图的路径和你看到的内容。
- 最终回复用中文，200 字以内。
