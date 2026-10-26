# D8 演练场同步 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D8`，分支 `sync/d8-playground`。只在本地提交，没有推送。
- 提交（基于 `7541956` swarm-tree）：
  - `a327f92` D8: 预览通道校验消息来源和本次装载的标记
  - `41395bd` D8: 挂载报错不再被 ok 覆盖，状态位区分构建失败

## 1. 做了什么

1. **预览通道加信任边界**。新增 `previewChannel.ts`：每次装载 iframe 生成一个 32 位随机标记（nonce），写进 iframe 地址的 `#` 里；iframe 里的文档从自己的地址读回标记，之后两边每条消息都带标记。父页面只收 `event.source === iframe.contentWindow` + origin 相同 + 标记相同的消息，iframe 只收 `event.source === window.parent` + origin 相同 + 标记相同的消息。标记对不上的一律丢弃（包括没有标记的伪造消息）。
2. **iframe 被换掉能恢复**。`usePreviewSync` 现在管 iframe 的地址和 key：一次装载期间第一次 `load` 是本次导航的文档，再来一次说明预览代码把文档换掉了（跳转或刷新），就把 iframe 换成一个新元素、换新标记、重新握手，并把当前代码和主题推过去。原来这种情况会静默失效。
3. **启动失败有提示**。三种失败都能显示：iframe 30 秒没回报 `ready`（显示「预览没能启动」）、编译报错、运行时报错。顺手修掉一个真 bug：挂载时渲染抛错，`errorHandler` 已经报了 error，但 `render()` 之后又补了一条 `ok` 把错误盖掉，用户看到的是空白预览。现在挂载期报错就不再补 `ok`。
4. **状态位改成三态**（构建中／构建完成／构建失败），点「刷新预览」现在真的换一个新 iframe（和说明文案「刷新会重置运行时状态」对上）。
5. **单元测试** `tests/playground-preview-channel.test.ts`（13 条）：标记生成、地址往返、伪造来源/别的 origin/别的标记/错消息类型/还没发标记这些情况全部返回 null。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `apps/docs/components/playground/previewChannel.ts` | 69 | 标记生成与读取、两侧消息的信任判定 |
| `apps/docs/components/playground/usePreviewSync.ts` | 185 | 父页面侧：装载代次、超时、去抖推送、收回报 |
| `apps/docs/components/playground/PlaygroundFrame.vue` | 201 | iframe 侧：读标记、回带标记的消息、挂载与报错 |
| `apps/docs/components/playground/protocol.ts` | 39 | 消息形状（两条都加了 `nonce`） |
| `apps/docs/components/playground/PlaygroundApp.vue` | 325 | iframe 用 composable 给的 src/key，状态位三态 |
| `apps/docs/components/playground/messages.ts` | 189 | 新增 `buildFailed`、`startupFailed` 两条文案（中英） |
| `apps/docs/styles/playground.css` | — | 状态位错误态圆点颜色 |
| `tests/playground-preview-channel.test.ts` | 106 | 通信校验单元测试 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| `8f7a21fb4` 校验发送方 | 窗口上只认带本次 nonce 的 hello，且必须来自当前 iframe 窗口；其余消息一律走 MessagePort | `acceptFrameMessage` / `acceptHostMessage`：origin + 对端窗口 + nonce 三项都对才收；没有端口，收下来的消息仍然带 nonce 校验 | 伪造来源的消息（别的窗口、别的 origin、没有当前 nonce）都进不来 |
| `4435b62d1` 不透明 origin | iframe 不给 `allow-same-origin`，用端口握手当信任锚 | 保留 `allow-same-origin`，用 nonce 当信任锚 | 见第 3 节：实测去掉 `allow-same-origin` 后模块脚本被 CORS 拦死，预览完全起不来；nonce 达到上游「只有父页面自己导航过去的文档能说话」这个效果 |
| `3799df9ad` 加固主题同步通道 | 主题消息也走在受信端口上 | 主题消息和代码消息走同一条通道、同一套校验 | 主题同步不再有单独的信任口子 |
| `82fb22c3c` 启动失败提示 | 文档启动 30 秒、编译器启动 30 秒各一个定时器；失败把状态标成 error，并给一个 Rebuild 按钮 | 一个 30 秒定时器（我们编译器和组件在同一个页面，只有一段启动）；失败显示错误条 + 状态位「构建失败」，工具栏的刷新按钮就是重建 | 三种失败（一直没 ready / 编译错 / 运行时错）用户都能看到字，不再空白 |
| `45a401a84` gigantic 同心 | `typeBase 18 / typeRatio 1.414 / spacing 8 / radius 8 / sizeMd 48` | `DENSITY_PRESETS` 的 gigantic：`typeSize 18 / augmented-fourth(1.414) / spacing 8 / elementSize 48 / radius 8` | 数值逐个相同 |
| `796bcc286` 去掉 accent 调色板展开 | 强调色不再派生一整条色阶 | 我们本来就只有单个 accent 变量 | 未展开 = 上游现状 |
| `d6fd8d45d` 预览里能画图 | 预览 scope 里补上 Recharts，未声明的模块打一条警告 | 图表由 `@astryx-vue/playground-charts` 提供，编译期就校验导出是否存在（缺导出直接报错） | 5 个 dashboard 模板实测都画出了线/柱/面积图形 |

## 3. 和计划不一样的地方

1. **没有去掉 `sandbox` 里的 `allow-same-origin`**（计划要求先评估）。实测：把 `/playground/frame` 放进 `sandbox="allow-scripts allow-forms"` 的 iframe，文档 origin 变成 `null`，Vite 产出的模块脚本和字体全部被 CORS 拦掉（`Access to script at .../assets/app.CBVrgThp.js from origin 'null' has been blocked by CORS policy`），`#playground-mount` 根本没挂载。要真去掉，得让预览页改成不带 ES 模块的自包含入口，并给静态资源加 `Access-Control-Allow-Origin`，等于改造整个文档站的资源服务方式，超出本节点范围。所以按计划的备选做法：保留同源，用 nonce 补上「只认自己导航过去的那份文档」。
2. **多加了一个计划里没写的东西**：iframe 被预览代码换掉后自动换新 iframe。上游 `4435b62d1`/`82fb22c3c` 的 `onReplaced` 就是这个行为，不加的话 nonce 会在「文档被换掉」之后彻底失配，预览变成永久空白。
3. **状态位从两态改三态**。上游用 error 变体的状态徽标 + Rebuild；我们原来只有「构建中／构建完成」，错误条旁边写着「构建完成」自相矛盾，所以加了「构建失败」。
4. **修了挂载报错被 `ok` 覆盖的 bug**，这不是新增功能，是计划第 2 条「运行报错要能看到」的前提。

## 4. 台账处理

一共 19 条：**已采纳 6 条，已由别的节点覆盖 7 条，不适用 6 条。**

已采纳：`8f7a21fb4`、`4435b62d1`（部分：保留同源 + nonce）、`3799df9ad`、`82fb22c3c`、`45a401a84`（本来已一致）、`796bcc286`（本来就没展开）。

已由别的节点覆盖：`3c50fccc8`（B3/B6/C8 等）、`936b1f73a`（C1/D5/D7）、`5777977fe`（C1/C3/D5/D7）、`f3a218198`（B1/F3a，演练场间距变量本来输出 rem，跟着根字号走）、`58f954213`（C1/C4/C11）、`41ab6db2a`（B1/C1…）、`d6fd8d45d`（F2b，图表组件）。

不适用：

- `9fa8c668f` 预渲染模板画廊：我们的模板画廊是 VitePress 静态页（`TemplateIndex.vue`），构建时就是 HTML，没有客户端水合这一步。
- `16ae26d39` dashboard 模板预览（编辑器侧声明模块）：编辑器侧同下一条；模板预览侧已验证（5 个 dashboard 模板都画出图）。
- `24af75f8e` 给编辑器声明预览里所有模块：我们的 Monaco 用的是 `html` 语言且没有接 TS 服务，**编辑器根本不产出任何诊断**。实测：打开 `dashboard`/`table`/`ai-chat`/`theme-showcase`/`incident-console` 模板，`squiggly-error`/`squiggly-warning` 都是 0；往 `<script setup>` 里手打非法 TS（`const bad: = 1;`）也还是 0。所以「模板 import 报红线」这个现象在我们这里不存在，声明模块没有可对齐的行为。真要拿到上游那种「有类型提示但没有假报错」，得给 Monaco 装一套 Vue/组件库类型服务，属于新功能。
- `b6f9ee72a`、`76d2fbdf5` cookie 探测兼容：预览是同源文档，cookie/storage 本来就能用，不存在「隔离环境里 cookie 抛错」的前提；我们的 57 个模板也没有读 cookie 的代码。
- `33eb65c56` Vercel 沙箱修复验证：我们没有 Vercel 沙箱这个部署形态。

## 5. 自测结果

文档站按 `env -u NODE_ENV pnpm build:packages && env -u NODE_ENV pnpm docs:build`，再 `vitepress preview --port 5172 --host 127.0.0.1` 起站点；浏览器命令全部走 `scripts/swarm/browser-lock.mjs run`，同一时刻只开 1 个浏览器。

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 tests/playground-preview-channel.test.ts` | 过 | 1 个文件、13 条用例 |
| 2 | `NODE_ENV=production pnpm vitest run --maxWorkers=2 tests/playground-preview-channel.test.ts` | 过 | 13 条，和上一条相同 |
| 3 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`（全仓） | 过 | 328 个文件、4510 条用例全过 |
| 4 | `env -u NODE_ENV pnpm check:packages` | 过 | 退出码 0（含单文件 500 行、模板变量前缀检查） |
| 5 | `env -u NODE_ENV npx eslint . --max-warnings 0` | 过 | 只报 `.tmp-d8/` 临时脚本（已删除）；删除后重跑退出码 0 |
| 6 | `env -u NODE_ENV pnpm typecheck` | 过 | 根、packages/*、apps/docs 全部 Done |
| 7 | `env -u NODE_ENV pnpm docs:build` | 过 | 退出码 0，`build complete in 41.37s` |
| 8 | 57 个模板逐个 `?template=<slug>` | 过 | 57/57 预览区有内容；除浏览器自带的 `An iframe which has both allow-scripts and allow-same-origin ...` 警告外，**预览 iframe 里 0 条 console error / pageerror / requestfailed** |
| 9 | 启动失败提示 | 过 | 拦住 `/playground/frame` 后 30 秒，错误条出现「预览没能启动。点刷新预览再试一次。」；`iframe src` 带 `#nonce=...` |
| 10 | 编译失败提示 | 过 | 编辑器写 `this is not a vue file` → 错误条 `At least one <template> or <script> is required in a single file component.` |
| 11 | 运行失败提示 | 过 | 编辑器写 `<template><p>{{ boom.value.x }}</p></template>` → 错误条 `Cannot read properties of undefined (reading 'value')`，状态位「构建失败」（修 bug 前这里是空白的） |
| 12 | 刷新预览 | 过 | 点刷新后 `iframe src` 的 nonce 变了、状态位重新从「构建中」到「构建完成」 |
| 13 | 图表模板 | 过 | `dashboard` 5 svg/5 path；`dashboard-alert-rail` 6 svg（polyline+text）；`dashboard-composition` 19 svg（含 linearGradient）；`dashboard-progress` 3 svg；`dashboard-cohort-funnel` 2 svg + rect；`table-collapsible` 1 sparkline |
| 14 | en 语言页 | 过 | `/en/playground/?template=dashboard` 预览区有内容，无 console error（`/zh/playground/` 404 是正常的，中文就在根路径 `/playground/`） |
| 15 | 不透明 origin 可行性 | 结论：不可行 | `sandbox="allow-scripts allow-forms"` 下 `self.origin === 'null'`，`assets/app.*.js` 等全部 `blocked by CORS policy`，`#playground-mount` 没挂载 |

## 6. 拿不准的地方

1. **`allow-same-origin` 还在**。控制台会有一条浏览器自带的安全警告，也无法防住「预览代码把 iframe 导航到本站另一个页面」那种同源替换（nonce 让这种替换说不上话、拿不到代码，但没法隔离 DOM/storage）。要彻底对齐上游，得让预览页变成不依赖 ES 模块 + 静态资源带 CORS 头的独立入口，建议单开一个节点做。
2. **编辑器完全没有 TS 诊断**（第 4 节 `24af75f8e`）。这是和上游差得最远的一块，用户现在既看不到假红线也拿不到补全。要不要补 Monaco 的 Vue 类型服务，需要用户拿主意。
3. **30 秒超时是照抄上游的**。我们只有一个启动阶段，实际耗时远小于 30 秒；如果觉得太慢，可以调到 10 秒，但没改，先和上游保持一致。
