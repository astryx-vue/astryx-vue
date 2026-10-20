# 蜂群工具

这里放给任务树子代理用的两个小工具：

- `visual-compare.mjs`：视觉对照。把上游官网和我们文档站上同一个组件页截图，左右拼在一起，再给一个像素差异分数。
- `browser-lock.mjs`：浏览器锁。整台电脑同时最多开 2 个浏览器，谁要开浏览器都得先拿锁。

## 视觉对照

### 一句话用法

```sh
pnpm visual Button
```

它会做这几件事：

1. 在 5172 端口起我们的文档站（`packages/*/dist` 不在就先跑 `pnpm build:packages`）。
2. 排队拿浏览器锁，只开 1 个 Chromium。
3. 四种组合按顺序截图：`desktop-light`、`desktop-dark`、`mobile-light`、`mobile-dark`。
4. 每种组合拼一张「左上游、右我们」的对照图，算分，写报告。
5. 关浏览器、关文档站、还锁。正常结束、出错、按 Ctrl+C 都一样。

### 参数

```
pnpm visual <组件> [--section overview|all]
                  [--combos desktop-light,desktop-dark,mobile-light,mobile-dark]
                  [--ours <url>] [--upstream <url>] [--out <dir>] [--no-serve]
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
| `--out <dir>` | 输出目录，默认 `.agents-work/upstream-sync/visual/`（已加进 `.gitignore`）。 |
| `--no-serve` | 假设 5172 端口上已经有本工作区的文档站在跑，不自己起。 |
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
| 上游 | `[data-astryx-theme="neutral"] > .astryx-card` | 组件详情页 Overview 顶部的预览卡片：`ComponentPreviewTheme`（嵌套的 neutral 主题）里那张 muted `Card`。 |
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
  - 内容矩形就是「和背景色不一样的像素」的外接框。离边缘 32 像素以内的像素不看，因为圆角和描边不算内容。
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

**`端口 5172 已被别的进程占用`。** 有别的东西占着端口。如果它就是本工作区的文档站，加 `--no-serve`。否则先关掉它。

**`端口 5172 上的文档站属于另一个工作区`。** 另一个工作区正在用 5172 跑对照。等它跑完，或者用 `--ours` 指向你自己起的服务。

**一直打印「排队中」。** 两个浏览器槽都被占了。用 `node scripts/swarm/browser-lock.mjs status` 看谁占着。持有进程已经不在、或者持有超过 2 小时的槽，会被自动回收。

**某个组件报「没有这个组件的预览区」。** 上游有一部分页面（多为 hook 和子组件）没有顶部预览。这种页面改用 `--section all` 看整页。

**文档站启动失败。** 看日志：`$TMPDIR/astryx-visual-serve-5172/server.log`。

### 文档站服务怎么共用

5172 端口上的文档站可以被多个 `pnpm visual` 进程共用。租约记在 `$TMPDIR/astryx-visual-serve-5172/`：

- 第一个进程启动服务。
- 后来的进程直接复用。
- 最后一个离开的进程把服务整组关掉。

只有同一个工作区的进程能共用。

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

# 指定最多等几分钟
node scripts/swarm/browser-lock.mjs run --purpose "..." --timeout 10 -- <命令...>

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
