# B2 验收报告（第 1 轮）

**结论：通过。** 总控补了第 18 项发现的问题（提交「reset 里补上 AspectRatio fit 规则」），然后亲自复核。

这一轮分两段做：

- 第 1 段由 Sonnet 验收者完成，第 1–9、16、17、19 项是它测的。它后来写了一个包含 WebKit 的大探测脚本，卡了 52 分钟，被总控叫停。
- 第 2 段由总控完成：第 10–15、18 项，用的是每条命令都有时间上限的短小单项探测。脚本在 `/tmp/B2-orch/`。

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 规则和上游一致 | 过 | 验收者用 `/tmp/verify-B2/cmp.mjs` 逐条比对选择器和声明，有两处不同：① AspectRatio 和 `[data-astryx-media]` 这几条放在组件样式里，没放进 reset，按第 18 项处理；② placeholder 颜色用的变量名不同，颜色本身等价 |
| 2 | 层级 | 过 | 全部规则都在 `@layer astryx.reset` 里，第一行的层级声明和组件样式完全相同 |
| 3 | 没有 `!important` | 过 | `check-no-important.mjs` 退出码为 0 |
| 4 | 零优先级 | 过 | 不分层的 `cursor:crosshair` 生效，用户自己层里的 `cursor:help` 也生效 |
| 5 | #7355 | 过（部分只能读代码确认） | placeholder 的 opacity 是 1。Chromium 读不出 `::-webkit-search-cancel-button` 的计算样式，有没有 reset 读出来都一样，所以这一项只能靠读代码确认。`reset.test.ts` 断言了 `-webkit-appearance: none` 这条规则存在 |
| 6 | #5335 禁用指针 | 过 | `<button disabled>` 和 `aria-disabled` 的按钮，指针都是 `default` |
| 7 | #6085 iOS 16px | 过（iOS 只能读代码确认） | 在 Chromium 里模拟触屏，`@supports (-webkit-touch-callout)` 不成立，字号保持 14px。WebKit 模拟 iOS 时报协议错误，而且一直卡住，所以改为读代码：5 处兜底都带着 `@supports` 条件，`inputFontFloor.test.ts` 也守着这一点 |
| 8 | #7520 until-found | 过 | `until-found` 的内容保持 `content-visibility: hidden`，`window.find` 能找到，用文本片段链接打开时会展开；普通 `hidden` 仍然是 `display:none`。`reset.test.ts` 断言 `display:none` 的规则排除了 until-found |
| 9 | #7585 加载顺序 | 过 | reset 放在组件样式前面或后面，Button 的计算样式完全一样 |
| 10 | 组件外观没有变差 | 过 | 总控在 B2 的文档站上，比较「引入 reset」和「注释掉 reset」两种情况，每次都重启服务。6 个页面（安装指南，以及 button、text-input、card、table、aspect-ratio 组件页）全页截图的像素差都是 0。原因是 VitePress 自己的 `base.css` 已经去掉了标签的默认外边距、标题字号和列表样式，所以 reset 在文档站上看不出变化；单独探测 h2、p、ol 的计算样式，两种情况也完全一样。组件自身的变化只有 Button 禁用指针（第 19 项）和 AspectRatio（第 18 项） |
| 11 | 文档站正文排版 | 过 | 同第 10 项，安装指南页像素差为 0 |
| 12 | 演练场 | 过 | 演练场用的是同一套文档站样式，结论同第 10 项。演练场模板自己的问题记在 D5，和 reset 无关 |
| 13 | 安装指南 | 过 | 中英文都已改写，原来那句「不是激进重置表」已经删掉 |
| 14 | D7 迁移说明 | 过 | `impl-1.md` 有这一节 |
| 15 | 台账 | 过 | 7 条都已打勾：6 条采纳，#7590 不适用 |
| 16 | 测试与检查 | 过 | 两种 NODE_ENV 下都是 243 个文件、3264 条用例；check:packages、lint、typecheck、build、lint:pkg 都通过。总控合入时又跑了一遍完整检查 |
| 17 | 没有越界 | 过 | 改动只涉及 reset、文档站引入、安装指南、测试、CLI 目录，以及 button、command-palette、complex-selector 三份样式 |
| 18 | 没搬过来的两段 | 过（已修） | 验收者发现：reset 排在组件样式**后面**时，AspectRatio `fit=cover` 的图片高度是 300，正确值是 200。原因是 reset 里 `:where(img, video) { height: auto }` 和 aspect-ratio.css 里 fit 的规则同在 reset 层、特异性都是 0，后加载的那条赢了。修法：在 reset.css 里紧接着 `height:auto` 再写一遍这三条 fit 规则，和上游 reset 的顺序一样。修好后两种加载顺序都是 200（`/tmp/B2-orch/ar.mjs`）。新增的测试断言 fit 规则排在 `height:auto` 之后。`[data-astryx-media]` 的 `color-scheme` 实测和上游一致 |
| 19 | Button 禁用指针 | 过 | 上游 v0.7.1 的 Button 禁用时 `cursor` 是 `'default'`；我们实测也是 `default` |

## 留给后续的

- C 阶段共同要求：其他 7 个组件的 `cursor: not-allowed` 改成 `default`，已经写进 ROADMAP。
