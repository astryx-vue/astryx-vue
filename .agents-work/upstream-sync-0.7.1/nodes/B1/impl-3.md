# B1 第 3 轮实现回报

工作区 `/Users/shenqingchuan/workspace/astryx-vue-wt/B1`，分支 `sync/b1-theme`，未推送。

## 提交

- `79e5997` 文档与新测试
- 随后一个小提交：修正新测试的类型与 lint 问题

## 做了什么

1. 第 20 项：中英文 `themes/extending.md` 新增小节「Overriding theme tokens / 覆盖主题的变量」，放在 Theme 介绍之后（根 token 的位置）。内容：主题规则选择器 `:scope.astryx-theme` 权重等于两个 class，`<style>` 排在后面；覆盖写在 `@layer astryx.overrides` 里要用 id 或至少 3 个 class；最简单的是写在不放进任何 `@layer` 的样式里；适配 token 同理，不论条件成不成立；Theme 的 `style` 属性里的值也能赢。适配列表末尾那句改成指向这一小节。中英文意思一致。已运行 `pnpm sync` 和 cli 的 generate，`catalog.json` 已更新。
2. 主题名要唯一：同一小节补了一段。同名主题共用一份样式；值不同时后渲染的赢。
3. `MediaTheme.test.ts` 新增「re-measures on a color mode switch even when nothing re-renders」。做法：只通过 matchMedia 的 change 事件（系统深浅色）和改祖先元素的 CSS 变量触发，不重新渲染任何组件。反向验证：删掉 `useAutoMediaMode.ts` 里的 `watch([mode, tokens], ...)`，这条测试失败（`expected 'dark' to be undefined`）；删完已还原。

## 自查（浏览器，5171，经 browser-lock，用完已关）

临时页面里 6 个 Theme，主题根值 `--astryx-spacing-3` 12px，窄屏适配成 6px。宽 1000 / 窄 600 读回：

- 分层 1 个 class：12px / 6px，输
- 分层 2 个 class（`.k.astryx-theme`）：12px / 6px，输
- 分层 3 个 class：44px / 44px，赢
- 分层 id + class：45px / 45px，赢（Theme 不透传 id，所以 id 放在外层 div 上）
- 不分层 1 个 class：46px / 46px，赢

与文档每一句一致。临时页面已删，5171 没有监听。

## 检查

- `env -u NODE_ENV pnpm check` 各步：check:packages、lint、typecheck 通过；vitest 换成 `pnpm vitest run --maxWorkers=2`：未设 NODE_ENV 和 `NODE_ENV=production` 都是 247 文件、3388 条全过；build、lint:pkg 通过。
- `git status` 为空。

## 没做的

没有动代码逻辑，没有改 ROADMAP.md、SWARM.md。
