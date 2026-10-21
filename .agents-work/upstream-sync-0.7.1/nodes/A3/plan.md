# A3 工程护栏 · 执行计划

## 目标

加两道自动检查，接进 `pnpm check`，再补上一个缺失的测试：

1. **500 行检查**：新写的源码文件超过 500 行，`pnpm check` 就失败。现在已经超标的文件先放进白名单，白名单只能越变越短。
2. **SSR 冒烟测试**：SSR 就是服务端渲染。把每个公开组件在 Node 环境里用 `renderToString` 渲染一遍，确认不报错，也不访问 `window`、`document` 这些浏览器才有的东西。现在会失败的组件放进「已知失败名单」，这份名单也只能越变越短。
3. **补 `Resizable` 的测试**：它是 core 里唯一没有测试的组件。

后面的 C 节点，每做完一个组件家族，就要把对应的组件从这两份名单里删掉。所以名单要好改、报错要好懂。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A3`，分支 `sync/a3-guardrails`。只在这里改代码。
- 任务树：`/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/ROADMAP.md`。
- 上游源码（只读）：`/Users/shenqingchuan/workspace/astryx-upstream`。上游有一个 `packages/core/src/serverSafeComponents.test.ts`，SSR 冒烟测试可以参考它的思路（`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/core/src/serverSafeComponents.test.ts`）。上游的 Resizable 测试在 `v0.7.1:packages/core/src/Resizable/` 下面。
- 跑测试时限制并发：`pnpm vitest run --maxWorkers=2 <文件>`。
- 不要开浏览器，这个节点用不到。

## 一、500 行检查

### 规则

- 只统计物理行，也就是 `wc -l` 的口径。
- **统计范围**：仓库里 git 跟踪的 `.ts`、`.tsx`、`.mts`、`.js`、`.mjs`、`.cjs`、`.vue` 文件。
- **不统计**：
  - 测试文件：`*.test.*`、`*.spec.*`、`tests/` 目录。
  - 生成文件：`.agents-work/README.md` 里列出的那些，加上 `packages/cli/src/generated/**`，以及 `pnpm sync` 产出的其它文件。去 `scripts/sync-exports.mjs` 里查它到底写了哪些文件，不要凭印象写。
  - 构建产物：`dist/`。
  - 第三方或打包进来的资源：`apps/docs/public/**`。
  - 被 eslint `ignores` 忽略的生成脚本，逐条判断是不是生成物。
  - 文档（`.md`）和样式（`.css`）本来就不在统计范围里。
- 排除规则写在一个配置文件里，比如 `scripts/guardrails/line-limit.config.mjs`。每一条都要有一句注释，说明为什么排除。

### 白名单

- 文件：`scripts/guardrails/line-limit-allowlist.json`，格式是 `{ "<路径>": <现在的行数> }`，按路径排序。
- 检查逻辑：
  - 不在白名单、又超过 500 行的文件，报错。
  - 在白名单里的文件，现在的行数**比记录的多**，也报错。旧的大文件不能继续变大。
  - 在白名单里的文件，行数变少了，或者已经降到 500 行以内，提示「可以收紧白名单」。降到 500 行以内的，检查直接失败，并提示把它从白名单里删掉。这样白名单不会留下过期的条目。
  - 白名单里的文件已经不存在了，也报错，提示删掉这条。
- 提供 `--update` 参数，只用来**收紧**白名单：把变小的数字改小，把已经不超标的删掉。永远不会新增条目，也不会把数字改大。
- 报错信息用中文，写清楚是哪个文件、多少行、上限多少、该怎么做（拆分成职责单一的小模块）。

### 接入

- 脚本：`scripts/check-line-limit.mjs`。
- 根目录 `package.json` 的 `check:packages` 脚本末尾加上 `&& node ./scripts/check-line-limit.mjs`。
- 测试：`tests/check-line-limit.test.ts`。用临时目录和假的文件列表测，覆盖下面几种情况：
  - 新文件超标
  - 白名单文件变大
  - 白名单文件变小
  - 白名单文件降到 500 行以内
  - 白名单里的文件不存在
  - 排除规则生效
  - `--update` 只收紧不放宽

  为了方便测试，把「取文件列表」和「判定」拆成两个函数。

## 二、SSR 冒烟测试

### 做法

- 测试文件：`packages/core/src/ssr-smoke.test.ts`，第一行写 `// @vitest-environment node`。参考现有的 `packages/core/src/Scrollbars/ssr.test.ts`。
- **组件列表从公开出口自动来**：读 `packages/core/src/index.ts` 的导出，挑出 Vue 组件，也就是对象上有 `render` 或 `setup` 的那些。不要手写组件清单，否则以后新加的组件会被漏掉。
- 每个组件单独一条用例，用 `createSSRApp` 加 `renderToString` 渲染。
  - 很多组件有必填 props，或者必须放在某个父组件里面，比如 `TabList` 的子项、`DropdownMenuItem`。为这些组件准备一份「最小可渲染参数」表：`scripts/guardrails/ssr-fixtures.ts`，或者放在测试旁边。表里写清楚 props、插槽和需要包一层的父组件。
  - 能从上游 `serverSafeComponents.test.ts` 借鉴的就借鉴。
  - 表里没写的组件，就用空 props 渲染。
- **怎么算通过**：
  - `renderToString` 不抛错。
  - 渲染过程中没有访问 `window`、`document`、`navigator`。在 node 环境里，这些全局变量本来就不存在，访问了就会抛 ReferenceError，所以「不抛错」已经包含了这一条。
  - 输出不是空字符串。确实会渲染出空内容的组件（比如纯 Provider），在参数表里标 `allowEmpty: true`，并写一句原因。
  - 渲染时不能有 Vue 的 warn。用 `app.config.warnHandler` 收集警告，有就算失败。
- **已知失败名单**：`packages/core/src/ssr-known-failures.json`，格式是 `{ "<组件名>": "<失败原因一句话>" }`。
  - 名单里的组件用 `it.fails`（或者等价的写法）跑：**仍然失败才算通过**。哪天它被修好了，测试就会失败，提醒人把它从名单里删掉。这样名单只会越变越短。
  - 名单里写了、但公开出口里已经没有的组件，也要报错。
- 先把全部组件跑一遍，看看有多少失败。
  - 失败的原因如果是**参数表没写好**（缺必填 prop、缺父组件），就修参数表，不要放进名单。
  - 只有组件**自己**在服务端访问了浏览器对象、或者有真正的 bug，才放进名单。
  - **这个节点不修组件本身**。组件的问题交给后面的 C 节点处理。

## 三、Resizable 测试

- 现状：`packages/core/src/Resizable/` 里只有 `ResizeHandle.vue`、`types.ts`、`index.ts`，没有测试。
- 新建 `packages/core/src/Resizable/ResizeHandle.test.ts`。参考上游 v0.7.1 的 Resizable 测试，**只测我们这边已经有的行为**：读 `ResizeHandle.vue`，弄清楚它支持什么，再写测试。至少覆盖：
  - 渲染结构和读屏用的属性：role、`aria-orientation`、`aria-valuenow` 等，实际用了哪些就测哪些。
  - 键盘调整：方向键，以及 Home、End（如果支持）。
  - 指针拖动，测事件或者回调。
  - 禁用状态（如果支持）。
- 上游有、我们没有的行为，**不要补实现**，那是 C14 的事。把这些差别列在回报里。
- 测试时不能有 Vue warn。

## 不做

- 不修任何组件的源码。只有一个例外：写测试时发现必须导出某个类型，可以加导出。改了的话要在回报里说明。
- 不拆分任何大文件。拆分是 E1、E2 和各个 C 节点的事。

## 自测清单

1. `node scripts/check-line-limit.mjs` 在当前仓库里通过，白名单的内容跟真实情况一致。
2. 故意新建一个 501 行的 `.ts` 文件，检查失败。删掉以后又通过。
3. 故意往白名单里某个文件加一行，检查失败。还原以后又通过。
4. `pnpm vitest run --maxWorkers=2 packages/core/src/ssr-smoke.test.ts` 通过。在回报里写清楚：组件总数、通过几个、名单里有几个，以及每个名单条目的原因。
5. 从名单里随便删掉一个条目，测试失败。还原以后又通过。
6. `pnpm vitest run --maxWorkers=2 packages/core/src/Resizable` 通过，没有 Vue warn。
7. 跑一次完整的 `pnpm check`，必须通过。它包含构建，会比较慢。
8. 新写的源码文件，每个都不超过 500 行。测试文件不受这个限制，但也别太长。

## 提交与回报

- 在分支上提交，提交信息用中文。不要推送，不要开 PR。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/A3/impl-1.md`。注意是主仓库的这个路径，不是工作区。内容包括：
  1. 做了什么，新增和修改了哪些文件。
  2. 500 行检查的排除规则和理由，以及白名单的完整内容。
  3. SSR 冒烟测试的统计数字和已知失败名单，每条都附上原因。
  4. Resizable 测试覆盖了什么，和上游相比还差什么。
  5. 自测清单每一项的结果。
  6. 拿不准的地方。
- 最终回复用中文，300 字以内。
