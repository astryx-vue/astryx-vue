# C15 反馈与状态 · 第 2 轮实现回报

- 工作区：`/workspace`，分支 `sync/c15-feedback`。在验收提交 `800616a` 之上返工。
- 提交（基于验收提交 `800616a`）：
  - `73d6b45` fix(banner): 空插槽不再出现展开按钮

## 1. 做了什么

验收第 13 条：`hasContent` 不再用 `!!slots.default`。每次渲染调用 `isRenderable(slots.default?.())`（`packages/core/src/Indicator/isRenderable.ts`）。插槽返回 `null`、`false`、`''`、`[]`，或模板里 `v-if="false"` 编译出的注释，都不算出内容：没有展开按钮，也不渲染 `.astryx-banner-content`。`collapsible` 为 false 时同样不留空详情区。真正有节点时才出现展开按钮，并且默认收起。

验收第 17 条：`ledger/C15.md` 里 `4d004cdb4` 的结论改成上述行为，仍标已采纳。第 1 轮把「空插槽没有展开按钮」写成已采纳，但当时只判断插槽函数在不在，和实测相反。

补了 `Banner.test.ts` 的 empty slots：四种空返回值、`collapsible: false` 时外框只剩标题条、`v-if="false"`、之后把 `v-if` 打开才出现展开按钮、空字符串说明不画出说明节点。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Banner/Banner.vue` | 154 | 用 isRenderable 判断默认插槽 |
| `packages/core/src/Banner/Banner.test.ts` | 204 | 锁住空插槽和 v-if |
| `.agents-work/upstream-sync-0.7.1/ledger/C15.md` | 台账 | 改正 `4d004cdb4` 的结论 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| `4d004cdb4` empty slots | `isRenderable(children)`：null、布尔、空字符串不算内容 | 复用本仓库的 `isRenderable`。它同样拒绝这些值，并拒绝空数组、注释和只含注释的片段 | 空插槽不出现展开按钮，也不画出详情区。`v-if="false"` 在 Vue 里是注释，同样被拒绝 |
| 有真实子节点 | 显示 Expand，详情默认不展开 | 照现有折叠：有节点才有展开按钮，一开始收起 | 和上游 empty slots 里「真实子节点仍有展开」一致 |
| `collapsible={false}` 且 children 为 false | 根上只有标题条，没有详情区 | 外框子节点只有一条，没有 `.astryx-banner-content` | 空内容不会留下一块卡片底 |

## 3. 和计划不一样的地方

没有把判断放进 `computed`。插槽函数的身份通常不变，缓存会在 `v-if` 从 false 变成 true 之后仍认为没有内容。所以在渲染时现算。

说明插槽和末尾插槽这次没有改判断方式。验收第 13 条只要求默认插槽。空字符串的 `description` 属性本来就不会画出说明节点，测试把它锁住了。

## 4. 台账处理

仍是 57 条。已采纳和不适用的条数没有变。只改了 `4d004cdb4` 的结论文字，使「空插槽没有展开按钮」和补完测试后的行为一致。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `timeout 90 env -u NODE_ENV pnpm exec vitest run --maxWorkers=2`，Banner、Spinner、ProgressBar、Stepper、StatusDot、CheckboxIndicator | 过 | 6 个文件、74 条，退出码 0 |
| 2 | 同一组，`NODE_ENV=production` | 过 | 6 个文件、74 条，退出码 0 |
| 3 | Banner 的 eslint | 过 | `eslint --max-warnings 0` 退出码 0 |
| 4 | 视觉对照 | 无 | 本轮不改变有内容时的外观。文档站「可折叠」示例本来就有真实详情 |

没有重跑 typecheck 和全量测试。改动限于提示条的插槽判断。

## 6. 拿不准的地方

无。

## 给 D7 的说明

无。第 1 轮已经写过的破坏性变化没有改：提示条仍不从 `status` 推导 `role`；进度条默认 `variant` 仍是 `accent`。
