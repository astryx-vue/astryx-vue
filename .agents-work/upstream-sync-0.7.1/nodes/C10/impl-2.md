# C10 Chat 对话 · 第 2 轮实现回报

独立验收 #147 第 4 条不通过，这一轮补上。没有合入，没有改 ROADMAP，没有写 verify-2。

## 根因

提及列表画出来的顺序和搜索结果的原始顺序不是同一份。`groupSearchItems` 把有分组的人放在前面，没分组的放在最后。文档站示例的原始顺序是 Ada、María、Lin、Grace，屏幕上却是 Lin、Grace、Ada、María。

方向键和高亮（`data-highlighted`、`aria-selected`、`aria-activedescendant`）用的是屏幕上的序号。回车和 Tab 却用 `state.items[highlightedIndex]` 去原始数组里取人。屏幕第 1 行是 Lin，回车插入的却是原始第 1 条 Ada。高亮移到 Grace（屏幕序号 1）时，旧逻辑插入的是原始第 2 条 María，同样不是当前高亮的人。验收记录里写成插进了 Ada。鼠标点某一行没有这个问题，因为点击直接把那一行的对象交出去。

发送按钮这边，上游 `canSend` 是「去掉首尾空白后还有字，并且输入区没有被停用」。附件抽屉不参与这个判断。Vue 侧本来就是这套条件，空草稿时按钮也有 `disabled`。可是停用样式只把实心强调色的透明度降到 0.5，空草稿时看起来仍是一颗可点的黑钮。这一轮让停用中的发送按钮改用中性浅底和次要文字色，写上可发送内容后才回到实心强调色。停止按钮不带 `disabled`，不受这条影响。

## 改了什么

1. `flattenSearchItems` 跟菜单用同一套分组顺序。回车和 Tab 插入这个顺序里的当前高亮项。
2. 补了测试：没分组时高亮第二项再回车，插入的是第二项；分组示例里方向键把高亮移到 Grace Hopper，`aria-activedescendant` 指向的那一行就是她，回车插入 `@grace`。
3. 空字符串、只有空白、以及只有附件时，发送按钮保持 `disabled`，点击不会提交。写上字之后可以点，点击会提交。
4. 文档站 `/components/chat` 的外壳和提及说明写了这两处手感。示例本身用的就是 `ChatComposer`，没有另写一颗永远可点的按钮。

`impl-1.md` 的提交列表里补上了本来就存在的 `f557072`，没有改那一轮的结论。

## 验证

两条命令都是 5 个文件、79 条（这一轮新增 4 条，两种 `NODE_ENV` 数量相同）：

```bash
env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Chat packages/core/src/composables/useChatNewMessages.test.ts packages/core/src/composables/useChatStreamScroll.test.ts
NODE_ENV=production pnpm vitest run --maxWorkers=2 packages/core/src/Chat packages/core/src/composables/useChatNewMessages.test.ts packages/core/src/composables/useChatStreamScroll.test.ts
```

`eslint`（改过的 Chat 文件）、`check-line-limit`、`check-no-important` 通过。没有跑完整的 `pnpm check`。没有用 `--update` 收紧行数白名单。

文档站这次没有跑起来：`apps/docs` 要 `@astryx-vue/core` 的构建产物 `dist/Icon/plugin.js`，当前工作区没有这份产物。发送按钮两种状态是用组件自己的 CSS 在无头 Chrome 里对过计算样式的。

## 和 swarm-tree 的关系

没有 rebase。`git merge-tree` 对 `origin/swarm-tree` 仍然冲突，冲突在 `scripts/guardrails/line-limit-allowlist.json`：本分支删掉了 `Chat/types.ts` 那一行，`swarm-tree` 上这份白名单也改过（HoverCard、PowerSearch、Table 的行数，并且还留着 `Chat/types.ts`）。业务代码这次没有和上游打架。要不要 rebase 由总控决定。
