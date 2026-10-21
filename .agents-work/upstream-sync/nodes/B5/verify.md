# B5 文案与图标 · 验收计划

你是验收者，只检查，不改代码。实现者的回报不能当证据，每一条都要你自己重新验证。判断标准只看效果：用户看到的文字、读屏软件读出来的文字，都要和上游一致，而且能被翻译。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B5`。BASE = `git merge-base HEAD swarm-tree`。
- 上游仓库只读：`/Users/shenqingchuan/workspace/astryx-upstream`。
- 所有测试和构建命令都加 `env -u NODE_ENV`。测试相关的检查项要在两种 NODE_ENV 下各跑一遍。vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多 2 个浏览器会话，你同一时刻只开 1 个。
  - 开浏览器必须走 `browser-lock.mjs run`。
  - 文档站用工作区登记的槽位端口，用完关掉。
- 访问外网前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`
- 临时文件放在 `/tmp/verify-B5/`。开始和结束时各跑一次 `git status`，两次结果要相同。

## 检查项

每一项只判「过」或「不过」，并附上证据。

### 一、效果

1. **locales 是最新的**：`SOURCE.json` 里的提交号，是上游 main 在拉取时的最新提交。用 `git -C <上游> fetch` 之后，跑 `git log -1 origin/main` 核对。如果对不上，要说得出原因。拿 `packages/core/locales/en.json`、`de-DE.json`，和上游这个提交里的同名文件做 diff，必须一字不差。
2. **新 key 都补齐了**：从台账里挑 5 条「把文字改成走翻译」的上游 fix，比如 #6217 Spinner、#6220 ChatTypingIndicator、#7482 NumberInput、#4920 announce、#5190 Calendar。对每一条：
   - 找到上游新增的 key。
   - 确认我们这边的 `messages/*.ts` 里有对应的 `en` 和 `zh-CN`。
   - 确认 `upstreamMap.ts` 能对上。
   - 确认在 `de-DE` 下能取到上游的德语翻译：写一个临时测试，用 translator 取值。
3. **中文自然**：抽 10 条新增的 `zh-CN` 文案读一遍。不能有机翻腔，比如「您的输入是无效的」这种。术语要和仓库里已有的中文文案一致。把不合格的条目列出来。只要有 3 条或以上不合格，这一项就判不过。
4. **provider 的语言全局生效**：写一个临时测试，用 `InternationalizationProvider` 设成 `de-DE`，包住一个日期输入框以外的组件，比如 Spinner 或 Pagination（挑一个已经在用 translator 的），确认它取到的是德语文案。
5. **locale hooks**：上游 #5194 暴露出来的 hook，我们有对应的能力：读一下上游的导出名，再对照我们的导出。
6. **upload 图标是必需的**：传一个缺少 `upload` 的「完整注册表」，要报错或者给出类型错误，和上游 AST-032 的行为一致。传一个有 `upload` 的，正常工作。
7. **语义图标机制**：读实现，并对照上游 #6153，确认组件可以声明自己用哪个语义图标，用户可以在注册表里替换它。
8. **浏览器实测**：把文档站切到中文，打开 Spinner、Switch、NumberInput 和 Calendar 这几页，读出页面上的文字、`aria-label` 和 live region 的内容。
   - 已经接好翻译的组件，显示中文就算对。
   - 还没接好的（属于 C 节点的工作），在回报的「交给 Cx」清单里要能找到对应条目。
   - 截一张图，用读图工具看一下。

8b. **图标符合我们自己的方案**（规则见 `SWARM.md`「图标用我们自己的方案」）：
   - 图标相关的改动，都建在 Iconify 名字、语义表（`semantic.ts`）、内置图形（`glyphs.ts`）和 `defineTheme({ icons })` 这套方案上。
   - 没有新增别的图标注册机制，也没有把上游的图标 React 组件翻译过来。
   - 新增的语义名都有默认的 Lucide 图标；需要兜底的，都有内置图形。
   - 写一个临时测试：用 `defineTheme({ icons: { upload: 'carbon:upload' } })` 覆盖 `upload`，再覆盖一个带命名空间的组件图标，比如 `numberInput:stepperDown`，两个都能生效。

### 二、检查脚本有效

9. 新的 i18n 目录检查接进了 `pnpm check`，可以看 `package.json` 确认。然后做三个反向测试，每个测完都要还原：
   - 删掉某个 key 的 `zh-CN`：检查失败。
   - 把占位符 `{count}` 改成 `{n}`：检查失败。
   - 在 `upstreamMap` 里写一个不存在的上游 key：检查失败。
10. ICU 契约校验覆盖所有 29 种语言：随便挑一种，比如 `ja-JP`，临时删掉某个 key 的一个占位符，检查要失败。然后还原。

### 三、交付

11. 台账 `ledger/B5.md` 的 72 条都打了勾，也写了结论。抽 6 条核对：
    - 2 条「已采纳」：在代码里能找到对应实现。
    - 2 条「交给 Cx」：写了 key 名或图标名。
    - 2 条「不适用」：理由站得住。
12. 回报里的「交给 Cx」清单按 C 节点分组，写到 C 节点能照着做的程度。抽 C5、C15 两组读一遍，判断能不能直接照做。
13. 全量 vitest 在两种 NODE_ENV 下都通过，用例数相同。完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 一步换成 `pnpm vitest run --maxWorkers=2`。
14. 新增或改动的源码文件都不超过 500 行。用 `git diff $BASE --stat` 核对，不能有越界改动：组件只能是签名变化后的最小修复；Theme 和 composables 不能动。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/B5/verify-<N>.md`，格式照 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。

## 第 2 轮：总控对第 4a 项的裁定

第 1 轮第 4a 项判为不过。原因是实现者回报第 8 节写着「Pagination 的读屏名会变」，实际上没有变：Pagination 还在用旧字段，要接新字段属于 C13 的组件接入。

总控选择方案 A：
- B5 不改 `Pagination.vue`。
- 回报里与事实不符的说法要改正。
- C13 清单要写清「Pagination 的读屏名现在和上游不同」。

第 2 轮只检查下面几项：

17. `impl-2.md`（或者改正后的 `impl-1.md`）第 8 节，已经不再说 Pagination 的读屏名会变。第 8 节列出的「英文会变的组件」，每一个都要自己验证：挂载组件，或者看文案文件，确认这个组件的英文在 BASE 和 B5 之间**确实**不同。只要有一个组件没变却被写成会变，或者变了却没写进去，就判「不过」。
18. C13 清单里写明：Pagination 的读屏名现在是 "Previous" / "Page 3" / "Pagination"，上游是 "Go to previous page" / "Go to page 3" / "Page indicators"，要接 `previousPage`、`nextPage`、`goToPageNumber`、`pageIndicators`。
19. 第 2 轮只改了文档，没有改代码。用 `git diff HEAD~N --stat` 确认，N 是第 2 轮新增的提交数。第 1 轮其余 15 项沿用原结论。
