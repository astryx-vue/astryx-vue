# 蜂群工具

这里放给任务树总控和子代理用的小工具：

- `visual-compare.mjs`：视觉对照。把上游官网和我们文档站上同一个组件页截图，左右拼在一起，再给一个像素差异分数。
- `playground-diff.mjs`：演练场模板对照。同一个模板在原版和本地各开一次，比文字元素和图标的位置、尺寸、字号、字重、颜色。
- `a11y-scan.mjs`：可访问性扫描。对每个组件页的示例区跑 axe，浅色深色各一遍，和已知问题名单对照。
- `browser-lock.mjs`：浏览器锁。整台电脑同时最多开 2 个浏览器，谁要开浏览器都得先拿锁。
- `status.mjs`：进度看板。检查、查询、修改 `ROADMAP.md` 里的节点状态。
- `worktree.mjs`：节点工作区。建、列、删、rebase，以及「复核加合入」。

后两个的用法见本文末尾，它们在规程里的位置见 `.agents-work/upstream-sync-0.7.1/SWARM.md`。

## 视觉对照

### 一句话用法

```sh
pnpm visual Button --out /tmp/<节点>-visual
```

> **验收者请一定加 `--out /tmp/...`。** 不加时产物写进当前工作区的 `.agents-work/upstream-sync-0.7.1/visual/`。这个目录虽然被 `.gitignore` 忽略了，但会占工作区的磁盘，删工作区前还得记着清理。

它会做这几件事：

0. 先检查两边的组件页存不存在：我们这边看 `apps/docs/docs/en/components/<slug>/index.md` 在不在，上游发一次 HTTP 请求看是不是 404。任何一边不存在就立刻报错退出，不起服务、不拿锁、不开浏览器。上游暂时连不上时只打印提示，照常往下走。
1. 在本工作区的槽位端口（`worktree.mjs new` 分配的 5170 + 槽位号；没登记槽位就是 5172）起我们的文档站（`packages/*/dist` 不在就先跑 `pnpm build:packages`）。
2. 排队拿浏览器锁，只开 1 个 Chromium。
3. 四种组合按顺序截图：`desktop-light`、`desktop-dark`、`mobile-light`、`mobile-dark`。
4. 每种组合拼一张「左上游、右我们」的对照图，算分，写报告。
5. 关浏览器、关文档站、还锁。正常结束、出错、按 Ctrl+C 都一样。

### 参数

```
pnpm visual <组件> [--section overview|all]
                  [--combos desktop-light,desktop-dark,mobile-light,mobile-dark]
                  [--ours <url>] [--upstream <url>] [--out <dir>] [--port <n>] [--no-serve]
                  [--proxy <url>] [--no-proxy] [--lock-timeout <分钟>]
```

| 参数 | 说明 |
| --- | --- |
| `<组件>` | 上游英文名（`Button`、`DropdownMenu`、`useClipboard`）或我们的 slug（`dropdown-menu`）都行。 |
| `--section overview` | 默认。只截组件标题和标签页下面那块大的预览区。 |
| `--section all` | 两边整页长图。只拼图，不算分：两边页面结构不同，整页分数没有意义。 |
| `--combos` | 只跑其中几种组合，逗号分隔。 |
| `--ours <url>` | 我们站点的地址，只写到域名，例如 `http://localhost:5173`。给了就不起服务。 |
| `--upstream <url>` | 上游地址，默认 `https://astryx.atmeta.com`。 |
| `--out <dir>` | 输出目录，默认 `.agents-work/upstream-sync-0.7.1/visual/`（已加进 `.gitignore`）。验收时请用 `--out /tmp/...`，别让产物落进工作区。 |
| `--port <n>` | 自己起文档站用的端口。默认取本工作区在 `worktree.mjs` 里登记的槽位端口，没登记就用 5172。 |
| `--no-serve` | 假设端口上已经有本工作区的文档站在跑，不自己起。 |
| `--proxy <url>` | 访问上游用的代理。默认取 `https_proxy` 环境变量，没有就用 `http://127.0.0.1:7890`。只有上游走代理，本地文档站直连。 |
| `--no-proxy` | 访问上游不走代理。 |
| `--lock-timeout` | 等浏览器锁最多等几分钟，默认 30。 |

### 四种组合

| 组合 | 视口 | 颜色 |
| --- | --- | --- |
| desktop-light | 1440×900 | 浅色 |
| desktop-dark | 1440×900 | 深色 |
| mobile-light | 390×844，2 倍像素，触屏 | 浅色 |
| mobile-dark | 同上 | 深色 |

窄屏截图是 2 倍像素，所以窄屏图片的像素尺寸是 CSS 尺寸的两倍。

### 输出

```
<out>/<Component>/<combo>/upstream.png       上游截图
<out>/<Component>/<combo>/ours.png           我们的截图
<out>/<Component>/<combo>/side-by-side.png   左上游、右我们，中间 16px 灰条，顶部标签
<out>/<Component>/<combo>/diff.png           pixelmatch 差异图，红色是不同的像素（仅 overview）
<out>/<Component>/report.json                每种组合的分数、尺寸、两边 URL、时间、工具版本
<out>/<Component>/report.md                  人读的摘要，图片用相对路径
```

`<Component>` 是上游英文名，比如 `DropdownMenu`。

某个组合失败（比如上游页面没有预览区）不会中断其他组合。失败原因写在报告里，命令最后返回非 0。

### 截的是哪一块

| 站点 | 选择器 | 说明 |
| --- | --- | --- |
| 上游 | `[data-astryx-theme="neutral"]:first-child > .astryx-card:only-child`，并且卡片的第一个子元素带内联的 `aspect-ratio` 或 `min-height` 样式 | 组件详情页 Overview 顶部的预览卡片：`ComponentPreviewTheme`（嵌套的 neutral 主题）里那张 muted `Card`。下面的示例区也有同样的包裹层，所以要求包裹层是父元素的第一个子元素、卡片是包裹层唯一的子元素；第一个子元素就是展示舞台，靠它的内联样式和别的卡片区分开。 |
| 我们 | `.component-detail__stage` | `ComponentDocsShell.vue` 里的预览舞台。 |

截图用「整页截图再按元素位置裁切」的方式，不用元素截图，免得吸顶导航盖住预览区顶部。

截图前会做这些事：

- 注入 CSS，关掉所有动画、过渡和输入光标。
- 等 `document.fonts.ready`，等网络空闲，鼠标移出页面，滚回顶部。
- 等预览区里的展示内容真的加载出来。上游的展示是懒加载的，加载前只有一个转圈。

### 深浅色怎么切

| 站点 | 怎么切 | 怎么验证 |
| --- | --- | --- |
| 上游 | 只看系统偏好。浏览器上下文设 `colorScheme`，页面就跟着变，`<html>` 上会出现 `data-theme="light/dark"`。 | `data-theme` 等于期望值，且预览区背景亮度对得上。 |
| 我们 | VitePress 读 `localStorage['vitepress-theme-appearance']`。截图前用 init script 写好，同时也设 `colorScheme`。 | `<html>` 有没有 `dark` 类与期望一致，且预览区背景亮度对得上。 |

背景亮度用 sRGB 相对亮度算，低于 0.18 算深色。两项检查有一项不对，这个组合就报错，不会默默截一张颜色错的图。

### 分数怎么理解

分数是「不同像素的百分比」，用 pixelmatch 数，单像素容差 0.1（pixelmatch 默认值，抗锯齿像素不算差异）。报告里有两个分数，区别只在分母：

- **内容区分数**（结论按它给）：分母是两边组件内容所在矩形的并集。
  - 内容矩形就是「和背景色不一样的像素」的外接框。四个圆角切掉的区域不看（按半径 32 像素算，也就是 2 倍图上 16 CSS 像素的圆角，再往里让 2 像素躲开抗锯齿）。四条边的中段照常算，所以窄屏上贴边的组件内容不会被漏掉。
  - 背景色取预览区向内缩 4 像素那一圈里最常见的颜色。
  - 这样大片空白背景不会把差异冲淡。比如 Button 桌面端：按钮的样式一样，但文案不同（上游 Primary/Secondary/Ghost/Destructive，我们 Save/Cancel/Delete），整图分数只有 1.5%，内容区分数却有 60% 左右。
- **整图分数**：分母是对齐后的整张画布。

报告里还会写出两边各自的组件内容尺寸（比如 Selector 上游 300×52，我们 126×76）。很多时候它比分数更直接。

尺寸对齐规则：**不缩放**，两张图都补到「宽取两者最大、高取两者最大」。原图水平居中、贴顶，补出来的地方填洋红色（`#ff00ff`）。补白区域几乎一定和对面不同，所以尺寸差主要推高整图分数。尺寸差本身也会单独写进报告，因为预览区高度不同就是一个重要信号。

| 内容区分数 | 结论 |
| --- | --- |
| 低于 2% | 基本一致 |
| 2% 到 10% | 有差异，需要看图 |
| 高于 10% | 明显不同 |

这是一组保守的初始阈值，**最终以看图为准**。比如两边 demo 用了不同的文案（上游写 Primary，我们写 Save），哪怕样式完全一样，分数也会上去。

### 常见问题

**上游打不开、超时。** 先确认 Clash 在跑。工具默认用 `http://127.0.0.1:7890` 代理访问上游。

**页面一直 404，或者 VitePress 报 `__VP_HASH_MAP__ is not defined`。** 起服务的环境里有 `NODE_ENV=production`。工具自己起服务时会强制改成 `development`。如果是你手动起服务再配 `--no-serve`，要自己带上 `NODE_ENV=development`。

**`端口 517x 已被别的进程占用`。** 有别的东西占着端口。如果它就是本工作区的文档站，加 `--no-serve`。否则先关掉它。

**`端口 517x 上的文档站属于另一个工作区`。** 另一个工作区正在用这个端口跑对照。通常是两边都没登记槽位、都落到了 5172。用 `worktree.mjs adopt` 给本工作区登记槽位，或者用 `--port` 换一个端口。

**一直打印「排队中」。** 两个浏览器槽都被占了。用 `node scripts/swarm/browser-lock.mjs status` 看谁占着。持有进程已经不在、或者持有超过 2 小时的槽，会被自动回收。

**报「我们的文档站没有 xxx 这个组件页」或「上游没有 Xxx 这个组件页」。** 组件名拼错了，或者有一边确实没有这个页面。上游用 PascalCase（`DropdownMenu`），我们用 kebab-case slug（`dropdown-menu`），两种写法都能传。这一步在起服务之前就做了，不会占用浏览器锁。

**某个组件报「没有这个组件的预览区」。** 上游有一部分页面（多为 hook 和子组件）没有顶部预览。这种页面改用 `--section all` 看整页。

**文档站启动失败。** 看日志：`$TMPDIR/astryx-visual-serve-<端口>/server.log`。

### 文档站服务怎么共用

同一个端口上的文档站可以被多个 `pnpm visual` 进程共用。租约记在 `$TMPDIR/astryx-visual-serve-<端口>/`：

- 第一个进程启动服务。
- 后来的进程直接复用。
- 最后一个离开的进程把服务整组关掉。

只有同一个工作区的进程能共用。

## 可访问性扫描

### 一句话用法

```sh
pnpm a11y
```

它会做这几件事：

1. 从 `apps/docs/components/demos/*/meta.ts` 读出全部组件页（现在 245 个），不手写清单。
2. 在 5172 端口起文档站（和 `pnpm visual` 共用租约），排队拿浏览器锁，只开 1 个 Chromium。
3. 对每个 `/en/components/<slug>/` 页面，浅色、深色各开一次，等示例渲染完，只对示例区（`.astryx-demo`，也就是 `VueDemoHost` 渲染的每个示例，包括顶部预览舞台）跑 axe。侧栏、导航、标题、说明、代码都不扫。
4. 写 `report.json` 和 `report.md`，再和 `scripts/guardrails/a11y-known-issues.json` 对照。
5. 关浏览器、关文档站、还锁。

一次完整扫描大约 11 分钟。它要起服务、开浏览器，所以**不在 `pnpm check` 里**。

### axe 规则

跑 axe-core 的全部规则，关掉和上游 `.github/scripts/accessibility-audit.js` 一样的 5 条页面级规则：`html-has-lang`、`document-title`、`landmark-one-main`、`page-has-heading-one`、`region`。示例只是页面片段，不负责这些。

### 已知问题名单

`scripts/guardrails/a11y-known-issues.json` 按「组件 slug + 规则 id」记录现有违规，值写由哪个节点修、出现在哪些颜色模式。

| 情况 | 结果 |
| --- | --- |
| 扫出名单外的违规 | 失败，列出 `+ <slug> <rule>` |
| 名单里的条目这次没出现 | 失败，列出 `- <slug> <rule>`，提示删掉 |
| 名单和实际一致 | 通过 |
| 有页面扫描失败（超时、404） | 失败 |

「没出现」只在浅色、深色都扫了的时候判定，并且只看这次扫过的页面；用 `--only` 扫一部分时，没扫到的页面不算消失。

`--update` 只删已经不再出现的条目，不会把新违规加进去。确实要暂缓的新问题，要在评审里说明理由后手动加。

### 参数

```
pnpm a11y [--only <slug,...>] [--schemes light,dark] [--update] [--init]
          [--out <dir>] [--ours <url>] [--no-serve] [--concurrency <n>] [--lock-timeout <分钟>]
```

| 参数 | 说明 |
| --- | --- |
| `--only` | 只扫这些组件页，逗号分隔的 slug。 |
| `--schemes` | 只扫某种颜色模式。只扫一种时不判定「消失」。 |
| `--update` | 删掉名单里已经不再出现的条目。 |
| `--init` | 名单文件不存在时，用这次结果建第一份名单。 |
| `--out` | 输出目录，默认 `.agents-work/upstream-sync-0.7.1/a11y/`（已加进 `.gitignore`）。 |
| `--ours` / `--no-serve` | 和 `pnpm visual` 一样。 |
| `--concurrency` | 同一个浏览器里同时开几个页面，默认 2。 |

### 输出

- `report.json`：每页每种模式的违规（规则 id、影响级别、节点选择器、失败说明，节点最多留 5 个），汇总，名单对照结果。
- `report.md`：按规则、按组件汇总，以及只在深色或只在浅色出现的问题。

计数口径：一条违规是「一页 × 一种颜色模式 × 一条规则」，节点数另算。

## 演练场模板对照

### 一句话用法

```sh
# 本地站点先构建再起 preview（vitepress dev 打开演练场会报 __VP_HASH_MAP__ is not defined）
env -u NODE_ENV pnpm docs:build
env -u NODE_ENV pnpm --filter @astryx-vue/docs preview --port 5181

# 另开一个终端，必须用 browser-lock 包着跑
node scripts/swarm/browser-lock.mjs run --purpose "演练场对比 table" --max-run 300 -- \
  node scripts/swarm/playground-diff.mjs table light 5181 --json /tmp/diff-table-light.json
```

一次跑一个模板、一种颜色，通常 25–50 秒（原版要先编译）。原版偶尔会卡在加载上，脚本会自己再试一次。

### 参数

```
node scripts/swarm/playground-diff.mjs <模板 slug> <light|dark> <本地端口> [--json 输出路径]
```

### 判什么

- 采集：预览 iframe 里有直系文字的元素（记文字、坐标、字号、字重、文字颜色、背景色），以及图标。
  坐标取文字自己的排版盒，并把每一层祖先的滚动还原到 0，所以滚动容器里看不见的元素也能直接比位置。
  滚动容器（表格体、聊天列表）会逐段滚过去重扫，虚拟列表里滚进来才存在的元素也采得到。
- 配对：按（归一化文字，同文字内文档顺序第 N 个）一一配对。文字和图标分开配对。
- 偏差：位置 x/y 差 > 1px、宽高差 > 1px、字号不同、字重不同、颜色某一通道差 > 4、背景色同上、缺失、多余。
  一个元素最多算 1 个偏差，按 位置 → 尺寸 → 字号 → 字重 → 文字颜色 → 背景色 的顺序只报第一处。
- 动态文本：配不上、又像时间戳/日期/相对时间的文字（`10:24`、`2025-01-15`、`3 minutes ago`）
  标成「疑似动态文本」，列在缺失/多余里但不计入偏差数。

### 怎么读结果

标准是**偏差 ≤ 3 个且没有正文缺失**：退出码 0 通过，1 不通过，2 用法错。

报告里三段：总数、按影响排序的偏差列表（每行「文字 / 哪个属性 / 原版值 / 我们的值」）、
按纵向每 100px 分段的偏差数（用来定位到页面的哪一屏）。`--json` 写完整结果，含每个元素在 DOM 里的 
`node` 描述，方便回页面里找。

### 采不到的东西

- 表单里的 placeholder、`<input>` 的 value（不是文本节点，两边都不采）。
- 图表画布：宽高超 64px 的 `<svg>` 当图表画布排掉；图表图例里的小色块（原版是 12px svg、
  我们是 `legend-swatch` 的小方框）也不采，因为两边用的技术不同，比位置只会误报。
- 屏幕外的辅助节点：绝对定位到页面左上角以外（比如 `top: -20000px`）的量字宽节点不采。

## 浏览器锁

锁目录是 `$(git rev-parse --git-common-dir)/swarm-locks/`，里面有 `browser-1` 和 `browser-2` 两个槽，所有 worktree 共用这一份。

- **拿锁**：用 `mkdir` 依次尝试两个槽（`mkdir` 是原子操作，不会两个人同时成功）。拿到的槽里写 `owner.json`：pid、工作区路径、开始时间、用途。
- **排队**：两个槽都被占就每 5 秒重试一次，打印「排队中」。默认最多等 30 分钟。
- **释放**：正常结束、出错、收到 SIGINT 或 SIGTERM 都会删掉槽目录。只删自己的槽，不会误删别人的。
- **回收失效的锁**：持有进程已经不存在，或者持有超过 2 小时，就视为失效，下一个人会把它收回。

### 命令行

```sh
# 拿到锁后执行命令，命令结束后自动还锁。验收者手动开浏览器时用这个。
node scripts/swarm/browser-lock.mjs run --purpose "A3 验收看 Button" -- <命令...>

# --timeout：排队等锁最多等几分钟
# --max-run：拿到锁后命令最多跑几秒，默认 180。超时会结束整个进程组，退出码 124
node scripts/swarm/browser-lock.mjs run --purpose "..." --timeout 10 --max-run 120 -- <命令...>

# 看两个槽现在被谁占着
node scripts/swarm/browser-lock.mjs status
```

### 在代码里用

```js
import { withBrowserLock } from './scripts/swarm/browser-lock.mjs'

await withBrowserLock('我要截图', async (lock) => {
  // 这里开浏览器、用完关掉
})
```

可选参数：`root`（锁目录，测试时传临时目录）、`timeoutMs`、`retryMs`、`onSignal`（收到信号时先做的清理，比如关浏览器）、`handleSignals`（传 `false` 表示调用方自己处理信号）。

### 验收者手动开浏览器

任何不经过 `pnpm visual` 的浏览器（自己写的 Playwright 脚本、`npx playwright` 命令）都要套上锁：

```sh
node scripts/swarm/browser-lock.mjs run --purpose "<节点>-verify 看键盘交互" -- node /tmp/verify-<节点>/check.mjs
```

锁在命令结束时自动释放。脚本里只开 1 个浏览器，用完关掉。

**一个脚本只测一件事。** 不要把十几项检查塞进同一个大脚本：中间哪一步卡住，前面跑出来的结果就全丢了，也看不出到底卡在哪里。每个检查项单独写一个小脚本，结果写进 `/tmp/verify-<节点>/item<N>.json`。如果命令超过 `--max-run` 被强制结束，先把卡住的那一步拆出来单独跑，不要原样重跑。

## 进度看板：status.mjs

`ROADMAP.md` 是唯一的进度来源。节点状态在里面出现两次：「全局进度树状图」的 emoji，和「当前状态总表」的「状态」列。这个脚本让两处始终一致，并按依赖关系算出谁该开工。

```sh
node scripts/swarm/status.mjs check     # 检查一致性，有问题退出码 1
node scripts/swarm/status.mjs ready     # 该解锁的节点 + 等待派发的节点，按下游数量排序
node scripts/swarm/status.mjs show      # 按阶段打印现状
node scripts/swarm/status.mjs set C1 实现中 --round 1 --impl C1-impl
node scripts/swarm/status.mjs set C1 verifying --verify C1-verify
node scripts/swarm/status.mjs set C1 done --result "通过 18/18" --pr abc1234
```

- 状态可以写中文（`验收中`）、英文简写（`verifying`）、别名（`verify`）或 emoji（`🔷`）。`--help` 列出全部写法。
- `check` 检查：
  - 两边节点集合相同，没有重复。
  - 树状图 emoji 和总表状态一致。
  - 依赖都存在，没有环。「C全部」「F3a–F3e」这类简写会展开。
  - 「可开工」及之后的节点，依赖都已「已完成」或「不做」。
- `set` 只改两行：树状图里这个节点那一行的 emoji，和总表里这个节点那一行。文件其它字节都不动。
  - 节点变成「已完成」或「不做」时，依赖已经全部结束的「未开始」下游节点自动改成「可开工」，同样只改它们各自的两行。
  - 状态流转按 SWARM.md 的生命周期图检查，比如「实现中」不能直接跳到「已完成」。确实要跳就加 `--force`。
  - 依赖没完成的节点不能开工。
  - 写入前自检三遍：只有计划要改的行变了；重新解析后状态和字段对得上；`check` 没有多出新问题。任何一遍不过都不写。
  - `--dry-run` 只打印会改哪些行。
- 只操作当前工作区里的 `ROADMAP.md`。总控在主工作区里运行。要改别的副本用 `--file`。

## 节点工作区：worktree.mjs

```sh
node scripts/swarm/worktree.mjs new C1 inputs   # 建工作区、分配槽位、装依赖
node scripts/swarm/worktree.mjs ls              # 列出工作区、槽位、端口、分支、领先几个提交
node scripts/swarm/worktree.mjs rebase C1       # rebase 到最新的 swarm-tree
node scripts/swarm/worktree.mjs merge C1        # rebase → 完整检查 → 合入 → 删工作区
node scripts/swarm/worktree.mjs rm C1           # 只删不合
node scripts/swarm/worktree.mjs adopt E2 3      # 给手工建的旧工作区补登记槽位
```

- **new**：从 `swarm-tree` 切出 `sync/<小写节点ID>-<简短名>`，建到 `../astryx-vue-wt/<节点ID>`，执行 `pnpm install --frozen-lockfile`，打印路径、分支、槽位、端口。
  - 槽位登记在 `$(git rev-parse --git-common-dir)/swarm-slots/<槽位>.json`，端口是 5170 + 槽位号。`pnpm visual` 在这个工作区里会自动用这个端口。
  - 4 个槽位都被占了就报错。已经存在、但没有登记槽位的节点工作区也算占位。这时脚本不知道哪个号是空的，会要求先用 `adopt` 登记，或者用 `--slot` 指定。
  - 任何一步失败（比如装依赖失败）都会回滚：工作区、分支、槽位都不留。
- **rm**：删工作区、分支，释放槽位，顺手删掉这个工作区里已经退出的进程留下的浏览器锁。分支没合入 `swarm-tree`、或者工作区有没提交的改动时拒绝，加 `--force` 才删。
- **rebase**：工作区必须干净。
  - 冲突都能交给 `pnpm sync` 重新生成时自动处理，然后继续。两类文件的清单都取自 `scripts/sync-exports.mjs`：
    - 整份生成的文件（`generatedFiles`，比如 `packages/core/src/index.ts`）：取节点这一边的版本。
    - 部分字段生成的文件（`partlyGeneratedFiles`，目前只有 `packages/core/package.json`）：做 JSON 三方合并。
      - 归 sync 管的字段不比较：`publishConfig.exports`，以及 `exports` 里指向组件目录的 `./<组件>` 条目。
      - 其它字段（description、依赖、`publishConfig.access`、exports 里手写的 `.`、`./locale` 等）两边的改动都保留。
      - 两边把同一个字段改成不同的值，就算人工冲突，报出字段名。
      - 合并结果按两格缩进重新写出，和仓库现在的写法一致。
    - 之后在工作区跑一次 `pnpm sync` 重新生成。sync 改到生成范围以外的文件就停下。
  - 还有别的冲突，或者 package.json 不能自动合并，就放弃这次 rebase，分支回到原样，报出冲突文件和原因。需要人手动解决。
- **merge**：这就是总控「复核加合入」的那一步。
  1. 拿合并锁 `swarm-locks/merge`，同一时刻只有一个 merge。生成文件排队合入就靠它。
  2. rebase。
  3. 在工作区里按顺序跑：`pnpm check:packages`、`pnpm lint`、`pnpm typecheck`、`pnpm vitest run --maxWorkers=2`、`pnpm build`、`pnpm lint:pkg`。子进程环境里去掉了 `NODE_ENV`。
  4. 检查跑完后工作区必须仍然干净。
  5. `swarm-tree` fast-forward 到节点分支。主工作区检出的就是 `swarm-tree` 时，在主工作区里 `git merge --ff-only`，文件跟着更新。
  6. 删工作区、分支，释放槽位。加 `--keep` 保留工作区。
  - 任何一步失败都停下，不合入。
- 在主工作区或任何节点工作区里执行都行。`rm` 和不带 `--keep` 的 `merge` 不能在要删的那个工作区里执行，会一开始就拒绝，什么都不改。
- 最后一个槽位释放后，空的 `swarm-slots/` 目录也会删掉，下次 `new` 时重建。
