# D8 演练场同步 · 执行计划

## 目标

文档站演练场（`/playground/`）的预览部分在稳定性和安全性上和原版对齐，57 个模板都能无报错加载：

1. 预览 iframe 只接收自己页面发来的消息，不信任任何别的来源。
2. 预览启动失败时（编译报错、运行报错、iframe 一直没回 `ready`）用户能看到提示，不再是一片空白。
3. 用到图表的 5 个 dashboard 模板，在演练场里能正常渲染。
4. 57 个模板逐个用 `?template=<slug>` 打开，预览里没有控制台报错。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D8`，分支 `sync/d8-playground`。只在这里改。
- 我们的演练场：`apps/docs/components/playground/`。和预览通信相关的文件：`protocol.ts`（消息格式）、`usePreviewSync.ts`（编辑器端发消息）、`PlaygroundFrame.vue`（iframe 里收消息并挂载）、`PlaygroundApp.vue`（iframe 的 `sandbox` 属性大约在第 279 行）、`previewHost.ts`。
- 原版：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:apps/docsite/src/app/playground/<文件>`，先 `git ls-tree -r --name-only v0.7.1 apps/docsite/src/app/playground` 看全部文件。
- 台账：`.agents-work/upstream-sync-0.7.1/ledger/D8.md`，19 条。
- 环境纪律：命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。

## 台账怎么分

| 类别 | 条目 | 做法 |
| --- | --- | --- |
| 预览通信安全 | `8f7a21fb4` 校验消息发送方、`3799df9ad` 主题同步通道加固、`4435b62d1` 不透明 origin、`6726`/`6897` cookie 探测 | 读原版改动的意思，在我们的 `protocol.ts` / `usePreviewSync.ts` / `PlaygroundFrame.vue` 里做等价校验：父页面只收 `event.source === iframe.contentWindow` 的消息；iframe 只收 `event.source === window.parent` 的消息，`origin` 也要对得上。**要不要去掉 `sandbox` 里的 `allow-same-origin`**，先评估：我们的预览是同源页面，靠 Vite 打包的模块和 Monaco，去掉之后可能起不来。能去就去，去不了在回报里写清原因。|
| 启动失败提示 | `82fb22c3c` | iframe 在一定时间内（原版的值）没回 `ready`、或者回了 `error`，在预览区显示错误条。我们已有 `playground__error`，确认三种失败都能显示出来。 |
| 图表模板 | `16ae26d39`、`d6fd8d45d` | 确认 5 个 dashboard 模板在演练场里能画出图。 |
| 编辑器类型声明 | `24af75f8e` | 确认 Monaco 认得模板里 import 的全部模块，不报红线。 |
| 原版文档站专属 | `5940` 模板画廊预渲染、`6859` Vercel 沙箱、`4412` gigantic 预设、`6794` accent palette | 我们没有对应功能的，标「不适用」并写理由；有对应的就做。 |
| 已在别的节点做完 | `3c50fccc8`、`936b1f73a`、`5777977fe`、`f3a218198`、`41ab6db2a`、`58f954213` | 这些是 core 的改动，演练场只是跟着用。逐个确认演练场里对应模板正常，标「已由 X 节点覆盖」。 |

## 自测

1. 给通信校验写单元测试：伪造来源的消息不会触发渲染。
2. 57 个模板逐个用 `?template=<slug>` 打开，收集预览 iframe 里的 `console.error` 和 `pageerror`，写成一张表放进回报。**一个脚本只开一个浏览器**，所有模板在同一个 context 里依次打开，每个模板最多等 15 秒，超时记下来跳过。
3. `env -u NODE_ENV pnpm check:packages`、eslint、docs 的 typecheck、`docs:build` 通过。

## 不碰

`packages/core`、`packages/themes`、`packages/cli/src`、模板内容（`pages/*.vue`）。发现模板本身的问题写进回报。

## 回报

写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D8/impl-1.md`，格式见 `templates/impl-report.md`，19 条台账逐条写结论。
