# A3 工程护栏 · 第 2 轮实现回报（返工）

分支 `sync/a3-guardrails-r2`，提交 `9a1d2f2`。只在本地提交，没有推送。工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A3`。

## 1. 改了什么

只改了 `packages/core/src/Resizable/ResizeHandle.test.ts` 这一个文件（+47 / -38，现在 361 行）。`ResizeHandle.vue` 没有动，模板里的 eslint 注释也原样保留。

- 新增辅助函数 `separatorOf(wrapper)`，内容就是 `wrapper.get('[role="separator"]')`。函数注释写明了为什么需要它：开发模式下组件根节点是 Fragment。
- 原来直接对根节点调用 `attributes()`、`trigger()`、`classes()` 的地方，一共 14 条用例，全部改成先 `separatorOf(...)` 再调用。还有 RTL 用例里的 `wrapper.element`，现在改成 `separatorOf(wrapper).element`。
- `wrapper.get(...)`、`wrapper.find(...)`、`wrapper.unmount()` 本来就不依赖根节点，没有改。
- 用例的数量和内容都没有变，还是 37 条。

改之前先复现了一次：`env -u NODE_ENV pnpm vitest run packages/core/src/Resizable` 的结果是 14 失败、23 通过，和总控说的一样。

## 2. 两种模式下的数字

| 命令 | 测试文件 | 用例 |
| --- | --- | --- |
| `env -u NODE_ENV pnpm vitest run --maxWorkers=2`（全量） | 218 通过 | 2440 通过 |
| `NODE_ENV=production pnpm vitest run --maxWorkers=2`（全量） | 218 通过 | 2440 通过 |

只跑 A3 的 3 个文件（Resizable、`ssr-smoke.test.ts`、`tests/check-line-limit.test.ts`）：两种模式都是 3 个文件、262 条用例全部通过。

SSR 冒烟测试单独跑，用 JSON 报告统计：

| 模式 | 总数 | 通过 | 失败 | 跳过 | 组件用例（`ssr smoke`） | 自检（`ssr smoke harness`） |
| --- | --- | --- | --- | --- | --- | --- |
| 不设 NODE_ENV | 212 | 212 | 0 | 0 | 206 | 6 |
| NODE_ENV=production | 212 | 212 | 0 | 0 | 206 | 6 |

206 条组件用例是 203 个组件，加上 3 条名单和参数表的自检。没有哪个组件只在其中一种模式下失败。已知失败名单仍然是 `{}`。

## 3. SSR 冒烟测试为什么不受 NODE_ENV 影响

我查到的原因：`vitest.config.ts` 第一行就执行了 `process.env.NODE_ENV = 'test'`。所以不管外面怎么设，**测试进程里的 Vue 运行时都在开发模式**。我写了一次性的探针确认过：两种模式下 `process.env.NODE_ENV` 都是 `'test'`，故意漏掉必填 prop 时，`warnHandler` 都收到了 1 条警告。SSR 检查里「有 Vue 警告就算失败」这一条，在两种模式下都有效。探针用完已经删掉。

那 ResizeHandle 为什么还会因模式不同而结果不同？因为**模板是编译期处理的**，用哪一份编译器由外面的 NODE_ENV 决定：

- `@vitejs/plugin-vue` 在 import 时会加载 `@vue/compiler-sfc`，进而加载 `@vue/compiler-core`。compiler-core 的入口按**当时的** `process.env.NODE_ENV` 选择 `cjs.prod.js` 或 `cjs.js`。
- `vite.config.ts` 在 `vitest.config.ts` 改写 NODE_ENV 之前就 import 了插件，所以选哪个编译器由外部环境决定。实测：不设时加载 `compiler-core.cjs.js`，设成 production 时加载 `compiler-core.cjs.prod.js`。
- 生产版编译器默认删掉模板注释，开发版保留。探针组件 `<!-- c --><div>a</div>` 挂载后的 `html()`：不设时是 `<!-- probe comment -->...`，production 时是 `<div>a</div>`，而两次运行时都是 `NODE_ENV=test`。

结论：现在的情况是「运行时永远是开发模式，模板编译跟着外部环境变」。受这个差异影响的，只有根节点前带注释的组件，以及依赖根节点的测试。SSR 冒烟测试只看「抛错、警告、空输出」，而且 `isEmptyHtml` 会先去掉注释再判断，所以两种模式结果一样。

## 4. 完整检查（`env -u NODE_ENV`）

按 `pnpm check` 的顺序逐步跑，只把 `pnpm test` 换成了 `pnpm vitest run --maxWorkers=2`：

| 步骤 | 退出码 |
| --- | --- |
| `pnpm check:packages`（含「源码单文件行数检查通过」） | 0 |
| `pnpm lint` | 0 |
| `pnpm typecheck` | 0 |
| `pnpm vitest run --maxWorkers=2`（218 个文件、2440 条用例） | 0 |
| `pnpm build` | 0 |
| `pnpm lint:pkg` | 0 |

build 之后 `git status` 是干净的。

## 5. 以后怎么避免

1. **测试不要把组件根节点当成目标元素。** 用 `wrapper.get('[role=...]')`、`wrapper.get('.astryx-xxx')` 这类选择器拿到真正的元素，再读属性、发事件。只要组件模板的根节点前面有注释，或者根节点是 Fragment 或 Teleport，`wrapper.attributes()` 和 `wrapper.trigger()` 在开发模式下就会落空。
2. **测试相关的检查跑两遍**（SWARM.md 已经这样规定）：`env -u NODE_ENV` 一遍，`NODE_ENV=production` 一遍，两遍的用例数要相同。第 1 轮漏掉这个问题，就是因为只在带 production 的终端里跑过一次。
3. 建议（这次没有做，需要总控决定）：如果想让模板编译也不受外部环境影响，可以在 `vitest.config.ts` 里给 `vue()` 显式传 `template.compilerOptions.comments: true`，或者把 NODE_ENV 的改写挪到 import `vite.config.ts` 之前，比如放进单独的 setup 文件，或者由 `package.json` 的 test 脚本来设置。这样会改动全局测试配置，不在 A3 这轮的范围内，所以只记在这里。
