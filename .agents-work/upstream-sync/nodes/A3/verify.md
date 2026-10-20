# A3 工程护栏 · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-<N>.md` 只用来了解他做了什么，不能当成证据。每一条都要你亲自重新验证。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A3`（分支 `sync/a3-guardrails`）。
- 跑测试时限制并发：`--maxWorkers=2`。
- 这个节点不需要开浏览器。
- 开始和结束时各跑一次 `git status`，两次结果必须相同。下面有些检查需要临时改文件。改完必须马上用 `git checkout -- <文件>` 或 `git clean` 还原，并在报告里写明「已还原」。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、500 行检查

1. `node scripts/check-line-limit.mjs` 退出码为 0。
2. **白名单要真实**：自己用 `git ls-files` 加 `wc -l` 统计一遍，并按配置文件里的排除规则过滤。结果有两个要求：
   - 超过 500 行的文件，和白名单里的条目完全一致。
   - 每个条目记录的行数，和真实行数相等。
   列出你的统计命令。
3. **排除规则要合理**：逐条读配置。每条排除规则都必须有注释说明理由。还要重点检查有没有排除过头：
   - 随机挑 3 个被排除的文件，确认它们确实是测试文件、生成文件或产物。
   - 确认 `packages/core/src/MultiSelector/MultiSelector.vue`、`packages/cli/src/cli.ts`、`scripts/sync-exports.mjs` 这几个大文件**没有**被排除掉，而是在白名单里。
   - 确认 `packages/core/src/index.ts`（这是生成文件）被排除了，并且理由写的是「生成文件」。
4. **新文件超标会被拦住**：新建 `packages/core/src/__verify_tmp.ts`，写 501 行，然后 `git add`。运行检查，结果要失败，报错信息是中文，并且点名这个文件和它的行数。删掉文件后再运行，检查通过。
5. **白名单里的文件变大会被拦住**：给白名单里任意一个文件末尾加一行注释，检查要失败。还原后通过。
6. **白名单里的文件降到 500 行以内要提示删除条目**：把白名单里某个文件临时截短到 400 行（先备份），检查要失败或者明确提示删掉这条。还原。
7. **`--update` 只能收紧**：
   - 先把白名单里某一条的数字临时改小一些（假装文件变大了），运行 `--update`。数字**不能**被改回去变大，检查仍然失败。
   - 再把某个文件截短，运行 `--update`。数字应该变小。
   - 全部还原。
8. `pnpm check:packages` 里确实调用了这个脚本。看 `package.json` 确认。

### 二、SSR 冒烟测试

9. `pnpm vitest run --maxWorkers=2 packages/core/src/ssr-smoke.test.ts` 通过，测试环境是 node。打开文件确认第一行有环境声明。
10. **组件列表是自动生成的**：读测试代码，确认组件来自 `index.ts` 的导出，没有手写一份清单。再用 vitest 的 `--reporter=verbose` 数一下用例数，和 `index.ts` 里导出的 Vue 组件数对一下。两边差几个，就要能说出差的是哪几个、为什么。
11. **已知失败名单会自我更新**：
    - 从 `ssr-known-failures.json` 里随便删掉一条，测试要失败（因为这个组件仍然渲染失败，却不在名单里了）。还原。
    - 往名单里加一个本来能通过的组件，比如 `Badge`，测试要失败（提示它其实已经好了）。还原。
    - 往名单里加一个不存在的名字，测试要失败。还原。
12. **名单里的每一条都要有道理**：至少抽查 3 条。做法是在 node 环境下自己写一个临时脚本，放到 `/tmp/verify-A3/`，或者直接读组件源码。确认失败原因确实来自组件本身，比如在 setup 里直接访问了 `window`，而不是参数表没写好。只要有 1 条其实是参数表的问题，这一项就不过。名单为空的话，这一项直接算过。
13. **能抓到问题**：临时找一个不在名单里的简单组件，在它的 setup 第一行加上 `window.innerWidth`，测试要失败。还原。
14. **能抓到 Vue 警告**：临时让某个组件在渲染时触发一次 Vue warn，比如传错类型的 prop，或者在参数表里改一个参数，测试要失败。还原。
15. 用 `allowEmpty` 放行的组件，每一个都写了理由，而且理由站得住。

### 三、Resizable 测试

16. `pnpm vitest run --maxWorkers=2 packages/core/src/Resizable` 通过，输出里没有 `[Vue warn]`。
17. 读 `ResizeHandle.vue`，列出它对外提供的行为：props、事件、键盘、指针、读屏属性。对照测试，下面几项都要覆盖到：
    - 读屏属性
    - 键盘调整
    - 指针拖动
    - 禁用状态（如果有）
18. **测试要有效**：临时改坏一个行为，比如把键盘的步长改错，或者删掉某个 aria 属性，相关测试要失败。还原。
19. `ResizeHandle.vue` 没有被改动。如果有改动，必须只是必要的导出，并且在 impl 报告里说明了。用 `git diff swarm-tree -- packages/core/src/Resizable/ResizeHandle.vue` 确认。

### 四、整体

20. `pnpm check` 通过。
21. `git diff swarm-tree --stat` 里，除了必要的导出以外，没有改动任何组件源码。
22. 新增的源码文件都不超过 500 行。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/A3/verify-<N>.md`。格式同 A1：先写结论，然后是一张逐条的表格，表头为「编号 | 检查项 | 结果 | 证据」，最后写「不通过的项要怎么改」。所有临时改动都要写明已经还原。
- 最终回复用中文，200 字以内。
