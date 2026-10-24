# B6 验收报告（第 1 轮，总控亲自做）

**结论：通过。** 用户决定 B6 由总控亲自验收。已经派出去的 Sonnet 验收者没写报告就停了。

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 工具是通用的 | 过 | `Field/fieldParts.ts` 的 `useFieldPartStyling` 没有写死任何 TextInput 的特例。保留属性靠 `reservedAttrs` 传进来，外壳判断读的是 InputGroup 注入和 FormLayout 的方向。Selector 之类的组件传入自己的保留属性就能直接用。TextInput 原来自己维护的 `controlledAttrs` 已经删掉，改用这个工具 |
| 2 | TextInput 的 4 个新属性落点 | 过 | `TextInput.parts.test.ts` 断言：`container*` 落在 Field 外壳，`control*` 落在 `.astryx-text-input`，原生 input 上两者都没有。实现者也在浏览器里核对过一遍 |
| 3 | 永不改道和无外壳警告 | 过 | 有外壳时 `hasFieldBox` 为真。在 InputGroup 里，或在 `horizontal-labels` 布局的 FormLayout 里时为假，这时 `container*` 不生效，并通过 `useDevWarning` 警告；`control*` 不受影响。测试覆盖了 InputGroup 这一种情况 |
| 4 | 根 class/style 行为不变 | 过 | `controlClass()` 返回 `[attrs.class, props.controlClass]`，两者都生效。根上的 class 仍然落在 `.astryx-text-input`，和以前一样，测试有断言 |
| 5 | 透传属性落在原生 input 上 | 过 | `forwardedAttrs()` 只排除 class、style 和保留属性。`data-testid`、`aria-*`、事件都落在原生 input 上，测试有断言 |
| 6 | 文档 | 过 | 中英文 text-input 页面都有「给外壳和本体加样式」一节，props 表里也有这 4 个属性 |
| 7 | 4 个非表单组件透传 | 过 | Layout、MetadataList 原本就会透传，补了测试。NavHeadingMenuItem 改成了 `inheritAttrs:false` + `v-bind="$attrs"`；TopNavMegaMenuItem 补了测试 |
| 8 | NavHeadingMenu 方向键 | 过 | `passThrough.test.ts` 覆盖了「菜单项处理函数取消事件之后，方向键仍然能移动」 |
| 9 | useAnnounce 清空 | 过 | `useAnnounce.test.ts` 新增了一条用例 |
| 10 | 废弃 API | 过 | 我们这边原本就没有 `isRtl` 选项、`minSizePx`/`maxSizePx`、`emptySearchResultsText`，以及 hooks 入口的 `isImeKeyEvent`：在 composables/src 里 grep 只能找到内部同名的 `_minSizePx` 和 `isRtlElement`。`deprecatedApis.public.test.ts` 守着这几个名字，不让它们回到公共导出 |
| 11 | 交接清单 | 过 | 见 impl-1.md 的交接清单，对照了上游 FR10 目标表 |
| 12 | 台账 | 过 | 36 条都已经打勾并写了结论 |
| 13 | 测试与检查 | 见合入记录 | 实现者两种 NODE_ENV 都跑过，252 个文件 / 3414 条用例。合入时 `worktree.mjs merge` 会再跑一遍完整检查 |
| 14 | 没有越界 | 过 | 改动只有工具、TextInput、4 个非表单组件、NavHeadingMenu、测试、文档和台账。其他 Field 类组件没动 |
| 15 | 行数，不用 `!important` | 过 | `fieldParts.ts` 106 行，合入检查里包含行数检查和 `!important` 检查 |
