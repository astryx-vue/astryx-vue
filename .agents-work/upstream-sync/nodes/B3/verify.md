# B3 交互底座 composables · 验收计划

你是验收者，只负责检查，不改代码。实现者的回报不能当作证据，每一条都要你自己重新验证。判断标准是**用户感受到的交互和上游一致**，代码结构不需要和上游一样。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B3`。BASE = `git merge-base HEAD swarm-tree`。
- 上游仓库只读：`/Users/shenqingchuan/workspace/astryx-upstream`，标签 `v0.7.1`。
- 所有测试和构建命令都加 `env -u NODE_ENV`。测试相关的检查项，要用两种 NODE_ENV 各跑一遍。vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多 2 个浏览器会话，你同一时刻只开 1 个。
  - 开浏览器必须走 `browser-lock.mjs run`。
  - 文档站用工作区登记的槽位端口，用完关掉。
- 临时文件放在 `/tmp/verify-B3/`。开始和结束时各跑一次 `git status`，两次结果要相同。

## 检查项

每一项只判「过」或「不过」，并附上证据。

### 一、交互效果

1. **按压模型（触屏）**：
   - 写一个 vitest 测试（放在 `/tmp` 里，或者临时文件，用完删掉），用新的按压控制器绑定一个元素。
   - 模拟粗指针（coarse pointer）下的 pointerdown，应该进入按压状态。
   - 指针移出元素以后，按压状态取消；这时 pointerup 不会触发点击。
   - 在元素内 pointerup，会触发一次点击。
   - pointercancel 取消按压状态。
   - 上游测试里的关键期望，从 `v0.7.1:packages/core/src/hooks/usePressFeedback*`、`menuPressGesture.test.ts`，或者 `utils` 下的 press 测试里挑 3 条，确认我们的测试覆盖了同样的情形。
2. **按压覆盖悬停**：同一个元素同时处于悬停和按压时，按压状态优先。看实现和测试确认。
3. **菜单按压和悬停**：
   - 对照上游 `useMenuPress.test.tsx`、`useMenuHover.test.tsx`、`menuPressGesture.test.ts`，挑 5 个关键场景，在我们的测试里找到对应的用例：
     - 按下就打开
     - 按住拖到某一项再松开，执行这一项
     - 悬停后点击，不会误关
     - 悬停过程中触发器被禁用，菜单保持关闭
     - 打开的菜单不阻止双指缩放
   - 只要缺一个，这一项就不过。
4. **焦点陷阱**：
   - 焦点从没进入过陷阱时，关闭陷阱不会去抢焦点。
   - Tab 只在焦点位于陷阱内部时才被拦下。
   - 用鼠标关闭后，焦点归还但不显示焦点环。
   - 每一条都要找到对应的测试，并在两种 NODE_ENV 下都通过。
5. **输入法**：`useHotkeys` 和按字母跳转在 `isComposing` 为 true，或者 keyCode 229 时不响应。写一个临时测试验证。
6. **滚动锁定**：`useScrollLock` 锁定时，会给滚动条留出宽度（`padding-right` 或 `scrollbar-gutter`，取决于具体实现），解锁后恢复原样。看测试，并在浏览器里实测一次：在一个有滚动条的页面打开 Dialog，比较打开前后 body 的宽度和内容位置，内容不能左右跳。
7. **平台判断**：仓库里只剩一套平台判断。用 grep 查 `navigator.platform`、`userAgentData` 等的使用位置，确认判断都走同一个出口。在 client hints 的 platform 为空字符串时，结果是「未知」。
8. **禁用状态**：看实现，确认底座在禁用时不暴露悬停状态。在浏览器里打开一个禁用的 Button，鼠标移上去，看计算样式里的 `cursor`，要和上游的约定一致：默认箭头，不是 `not-allowed`。如果这是组件样式层的事、被交给了 C 节点，要确认回报里有明确的交接。

### 二、不能变坏

9. E3 的三个交互契约测试照样通过，已知失败名单没有变长。用 `git diff $BASE -- packages/core/test-support` 和三个 `*.a11y.test.ts` 核对。
10. SSR 冒烟测试通过。看新增的模块级单例（交互模态、按压控制器），确认在没有 `document` 的环境下导入不会报错。可以在 node 里直接 import 对应模块试一下。
11. 签名变了的 composable，所有调用方都改过了，而且行为不变：
    - 用 grep 列出这些调用方。
    - 跑它们所在组件的测试。
    - 挑 2 个组件，用 `pnpm visual <C> --out /tmp/verify-B3/...` 和 BASE 对比 `ours.png`，像素差异要为 0。
12. 卸载时清理干净：挑 3 个注册了全局监听的 composable（比如按压控制器、滚动锁定、热键），在测试里挂载后卸载，确认 document 或 window 上的监听器都被移除。可以 spy `addEventListener` 和 `removeEventListener`，看次数是否对等。

### 三、交付

13. 台账 `ledger/B3.md` 里 62 条都打了勾，并写了结论。抽 6 条核对：
    - 2 条「已采纳」：能在代码里找到对应实现。
    - 2 条「交给 Cx」：确实属于组件层。
    - 2 条「交给 B4 或 B6」，或者「不适用」：理由成立。
14. 回报里「交给 Cx」的清单按 C 节点分组，每条都写了「怎样接入」，C 节点能照着做。抽 C6 和 C2 两组来读，判断是否真的能照着做。
15. 全量 vitest 在 `env -u NODE_ENV` 和 `NODE_ENV=production` 两种模式下都通过，用例数相同。
16. 完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 一步换成 `pnpm vitest run --maxWorkers=2`。
17. 新写或改动的源码文件都不超过 500 行，没有越界改动。用 `git diff $BASE --stat` 核对：组件只有「调用方最小修复」，没有改 Layer、BaseProps、utils。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/B3/verify-<N>.md`，格式参照 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。
