# B2 reset 与基础样式 · 验收计划

你是验收者，只负责检查，不改任何代码。实现者的回报只能用来了解情况，不能当作证据，每一条都要你自己重新验证。

判断标准有两条：
1. 引入 reset 以后，页面的默认样式要和上游 reset 的效果一样。
2. 组件的外观不能变差。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B2`。BASE = `git merge-base HEAD swarm-tree`。
- 上游仓库只读：`/Users/shenqingchuan/workspace/astryx-upstream`，标签 `v0.7.1`。
- 所有测试和构建命令都加 `env -u NODE_ENV`。测试相关的检查项要在两种 NODE_ENV 下各跑一遍。vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多 2 个浏览器会话，你同一时刻只开 1 个。
  - 开浏览器只能通过 `pnpm visual` 或者 `browser-lock.mjs run`。
  - 文档站用工作区登记的槽位端口，用完关掉。
- 访问外网前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`。上游官网偶尔会超时，遇到了就重跑。
- 临时文件放在 `/tmp/verify-B2/`。开始和结束时各跑一次 `git status`，两次结果要相同。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、reset 本身

1. **规则和上游一致**：把 `packages/core/reset.css` 里的规则，和上游 `v0.7.1:packages/core/src/reset.css` 逐条对照。层名、注释措辞可以不同，选择器和声明必须一致。
   - 每一处不同都要有理由。
   - 写一个脚本，把两边的「选择器 → 声明」解析出来再比较。比较时去掉注释，并把上游的层名换成我们的。
2. **层级**：全部规则都在 `@layer astryx.reset { … }` 里面。文件开头声明的层级顺序，和组件样式第一行一模一样。
3. **没有 `!important`**：`node scripts/check-no-important.mjs` 通过。
4. **零优先级**：在浏览器里测试两种情况，用户写的普通样式都能覆盖 reset：
   - 页面上写一条 `button { cursor: crosshair }`，不放进任何层，确认生效。
   - 再写一条放进某个用户自己的层里，也要能覆盖。

### 二、上游这几条改动的效果（在浏览器里测）

5. **#7355**：放一个 `<input type="search">` 和一个带 placeholder 的 input。
   - 搜索框不显示浏览器自带的清除按钮。用 Chromium 读 `::-webkit-search-cancel-button` 的计算样式，结果是 `appearance:none` 或 `display:none`，以上游写法为准。
   - placeholder 的 opacity 是 1。
6. **#5335**：禁用的 `<button disabled>` 和禁用的 Button 组件，`cursor` 都是 `default`。
7. **#6085**：
   - 非 iOS 环境（普通 Chromium）下，输入框不会被强制设为 16px。
   - 用上游判断 iOS 的条件，模拟一次 iOS 环境，确认会兜底到 16px。条件可能是 `@supports`，也可能是别的，以上游写法为准。
   - 如果浏览器里模拟不了，就读 CSS 确认条件和上游一样，并在报告里写明「只能通过读代码确认」。
8. **#7520**：放一段 `hidden="until-found"` 的文字，用 `window.find()` 或者 Playwright 的页内查找去搜它，内容会变成可见。再放一段普通的 `hidden` 文字，确认它仍然被隐藏。
9. **#7585**：故意把 reset 放在组件样式**后面**引入，组件的样式仍然赢过 reset。这能证明层级顺序是 reset 自己注册的，和引入顺序无关。

### 三、组件外观没有变差

10. 自己建一个 BASE 的 worktree，放在 `/tmp/verify-B2/base`。然后对下面 12 个组件，在 BASE 和 B2 上分别跑 `pnpm visual`，依次跑，不要并行：Button、TextInput、TextArea、Selector、CheckboxInput、Switch、Card、Dialog、Table、List、Heading、Collapsible。
    - 比较两边的 `ours.png`。
    - 每一处差异都要归类：
      - 「更接近上游」：拿同一组的 `upstream.png` 证明。
      - 「变差」：这条直接判不过。
      - 「无关」。
    - 实现者回报里也有一份归类，把它和你的归类对照。不一致的地方单独列出来。
11. 文档站正文的排版没有被 reset 弄乱。截首页和一个指南页（比如 `/guide/installation`），看段落间距、列表圆点、代码块是否正常，并和 BASE 对比。
12. 演练场挑两个模板，`settings`、`dashboard`，确认没有因为 reset 变差。和 BASE 对比。

### 四、交付

13. 安装指南（中英文）准确描述了 reset 的作用和局部使用的方法。原来那句「并不是一份修改页面全局标签的激进重置表」已经删掉。
14. 回报里有一节给 D7 用的迁移说明：引入了 reset 的用户会看到什么变化，以及怎么退回去。
15. 台账 7 条都打了勾，并写了结论。
16. 两种 NODE_ENV 下全量 vitest 都通过。完整执行 `env -u NODE_ENV pnpm check`（test 那一步换成 vitest，加 `--maxWorkers=2`），也要通过。
17. 没有越界改动：用 `git diff $BASE --stat` 核对。只改了 reset、文档站引入 reset 的地方、文档、测试，以及回报里列出的「因为 reset 才改的」组件样式。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/B2/verify-<N>.md`，格式照 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。
18. **没有搬过来的两段，效果仍然一样**：实现者没有把上游 reset 里 AspectRatio（`data-astryx-aspect-ratio-override`）和 `[data-astryx-media]` 这两段搬进 reset.css，理由是我们在组件样式里已经实现了。请找到我们对应的组件样式，在浏览器里实测。AspectRatio 的 cover 和 contain 两种模式下，里面的 img、video 填充方式要和上游官网一致；带 `data-astryx-media` 的媒体元素也要和上游一致。第 1 项比对规则时，这两段不算差异，但前提是这一项通过。
19. **Button 的禁用指针**：实现者改了 `button.css`，把禁用状态的 `not-allowed` 改成了 `default`。这是因为 Button 自己的样式会盖掉 reset 的规则，不改就看不到 reset 的效果。请确认上游 v0.7.1 的 Button 禁用时也是 `default`，并在浏览器里实测：禁用的 Button 上，指针确实是 `default`。
