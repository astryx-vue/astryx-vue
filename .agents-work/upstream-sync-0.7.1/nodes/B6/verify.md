# B6 公共 props 规则与样式分层 · 验收计划

你是验收者，只负责检查，不改代码。实现者的回报只能用来了解情况，不能当作证据。

**用户已经拍板，不要按上游判**：
- 根上直接写的 `class` / `style` 保持今天的落点，不丢弃，也不发警告。
- 新属性叫 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`。
- 不做 `*Xstyle`。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B6`。BASE 用 `git merge-base HEAD swarm-tree` 求出。
- 上游仓库只读：`/Users/shenqingchuan/workspace/astryx-upstream`，看 `v0.7.1`。
- 所有测试和构建命令都加 `env -u NODE_ENV`。测试项要在两种 NODE_ENV 下各跑一遍。vitest 一律加 `--maxWorkers=2`。
- 浏览器：整台机器同时最多 2 个会话，你同一时刻只开 1 个。只能通过 `browser-lock.mjs run` 打开浏览器，文档站用工作区的槽位端口。
- 临时文件放在 `/tmp/verify-B6/`。开始和结束时各跑一次 `git status`，两次结果要一致。

## 检查项

每项只能判「过」或「不过」，并附上证据。

### 一、样式分层机制

1. **工具是通用的**：确认有一个可复用的工具，类型和拆分属性的函数都在里面，而且 TextInput 用的就是它，不是自己另写一套。再看它有没有写死 TextInput 的特殊情况。如果有，判断换成另一个组件（比如 Selector）能不能直接用。
2. **TextInput 的 4 个新属性落点正确**：
   - 用 @vue/test-utils 写一个临时测试，放在 /tmp 或用完删掉。断言：`containerClass` / `containerStyle` 落在 Field 外壳上，`controlClass` / `controlStyle` 落在 `.astryx-text-input` 上，两组都不会出现在原生 input 上。
   - 在浏览器的文档站里再实测一次。
3. **永不改道**：在 InputGroup 里、横向标签的 FormLayout 里，分别放一个 TextInput。`container*` 不生效，也不会被挪到本体上；`control*` 仍然落在本体上。如果实现者说开发警告留给 C1，确认回报里写明了这一点。
4. **根 class/style 行为不变**：在 BASE 和 B6 上，`<TextInput class="x" style="color:red">` 落在同一个元素上。根 class 和 controlClass 同时传时，两个都生效。
5. **透传属性落在原生 input 上**：`data-testid`、`id`、`aria-label`、`@focus` 落在原生 input 上；`id` 和 label 的 `for` 仍然对得上。
6. **文档**：TextInput 文档页（中英文）有一节新写法说明，props 表里有这 4 个属性。

### 二、非表单组件透传（#7331）

7. Layout、MetadataList、NavHeadingMenuItem、TopNavMegaMenuItem 这 4 个组件，都要用测试或临时测试证明：`data-testid`、`id`、`aria-label`、`onClick` 落到了上游指定的元素上。对照 `git -C ../astryx-upstream show 43635fa9d` 里上游的测试，看落点是否一致。
8. **NavHeadingMenu**：某个菜单项的 click 里调用 `preventDefault` 之后，方向键还能继续移动焦点。和上游测试的场景对照。
9. **useAnnounce**：先发一条播报，紧接着立刻清空，下一帧播报区仍然是空的。

### 三、废弃 API

10. 上游 #6118 和 #7289 删掉的这些名字：`isImeKeyEvent` 的 hooks 导出、`isRtl` 选项、`minSizePx`、`maxSizePx`、`emptySearchResultsText`。
    - 你自己 grep 一遍：`packages/core/src`、`apps/docs`、`packages/cli`。
    - 结果必须是：要么全删了，要么从来没有过，并且台账里有证据。
    - 守护测试真的在守：在临时副本里把其中一个名字加回公共导出，测试要失败。

### 四、交接与交付

11. **交接清单准确**：抽查 5 个组件，至少包括 Selector、Typeahead、Slider、DateInput、CheckboxList。读我们的代码，核对清单里写的「今天的落点」和「主语义控件」是不是真的。和上游表不一致的地方，清单里要有标注。
12. 台账 36 条都打勾，并写了结论。规范文档类的条目可以写「不适用」，但要写出理由。
13. 两种 NODE_ENV 下全量 vitest 都通过；完整的 `env -u NODE_ENV pnpm check`（test 那一步换成 vitest `--maxWorkers=2`）通过。
14. **没有越界**：用 `git diff $BASE --stat` 核对，除了 TextInput，Field 类组件都没有被改。改动只涉及工具、TextInput、Field（如果需要接 class）、那 4 个非表单组件、NavHeadingMenu、useAnnounce、废弃 API 相关文件、文档和测试。
15. 源码单文件不超过 500 行，没有 `!important`。

## 结论

- 只要有一项不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/B6/verify-<N>.md`，格式按 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。
