# F3a 第 2 轮回报

## 改动（在 WIP 提交 70deb87d 之上，已提交未推送）
- core `ComplexSelector`：新增 `popupWidth`（数字按 px，字符串按 CSS 宽度），传给 Popover 的 `width`（两处 Popover 都传）。不传时和原来一样：跟触发器宽度、上限 320px。Popover 本身没改，它原来就支持「显式宽度只受视口上限约束」。
- lab `TransferListSelector`：把 `resolvedWidth`（默认 `min(41rem, calc(100vw - 32px))`）传给 `popup-width`。
- 测试：`ComplexSelector.parts.test.ts` 加一条，覆盖传与不传 `popupWidth`。

## 实测（Chromium，视口 1000×800）
- TransferListSelector 弹层宽 656px（41rem）。Selected / Available 两栏并排，各 328px，列表贴边、无内边距。
- 普通 ComplexSelector 弹层仍是 320px，外观不变。
- 截图：/tmp/verify-F3a/transfer-light.png、transfer-dark.png、complex-light.png、complex-dark.png
- 临时页面副本：/tmp/verify-F3a/tmp/.tmp-f3a（仓库里已删除，未提交）。
- 没有跑文档站 build/preview。core Demo 和演练场模板只用 ComplexSelector 默认路径，没有传 `popupWidth`，所以没有逐个看。

## 第 1 轮「拿不准」逐条结论
1. 弹层宽度入口：已解决（`popupWidth` + `contentStyle`）。
2. 内边距：已解决，内边距移到内容容器，lab 传 `padding: 0`，不再用负外边距。
3. ListInput 滚动锚定：不处理，保留差异和 3 条 `it.todo`。只影响在自身可滚动容器里连点 Add 的场景，建议后续单独做。
4. getFieldStatus tooltip：接受。读屏内容相同，只是 DOM 结构不同。
5. close 图标是 CSS 遮罩：接受，断言用 `.astryx-icon__glyph`。
6. happy-dom 焦点：接受，测试断言手柄节点没被重建，真实焦点靠浏览器验证。
7. staged 草稿用同步 watcher：接受，效果一致，React Profiler 断言保留 `it.todo`。
8. busy 态：接受，已照上游，只设 `aria-busy`。

## 验证
- vitest（core ComplexSelector + lab，NODE_ENV=development 和 test 各一遍）：164 通过，7 todo。
- `pnpm exec eslint . --max-warnings 0`：通过。
- `pnpm check:packages`：通过。
