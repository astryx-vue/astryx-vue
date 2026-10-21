# B1 第 3 轮返工计划

第 2 轮验收结果是 28/29，只有第 20 项没过，问题出在文档措辞。详见 `nodes/B1/verify-2.md` 里「不通过的项要怎么改」这一节。

## 要改的地方

1. **第 20 项（必改）**：中英文 `apps/docs/docs/{en,zh}/themes/extending.md` 里说明「怎样覆盖适配 token」的那句话，要改成和实测结果一致：
   - 主题的 token 规则选择器是 `:scope.astryx-theme`，权重等于两个 class，而且主题的 `<style>` 排在后面。
   - 所以如果覆盖写在 `@layer astryx.overrides` 里，要用 id，或者至少 3 个 class 才能赢。
   - 更简单的办法是把覆盖写在不放进任何 `@layer` 的普通样式里，这样总能赢。上游也是这么设计的：用户样式不分层，所以压过所有 Astryx 层。
   - 改完后，把这句话也放到介绍根 token 的位置。
   - 中英文意思要一致。
   - 改完运行 `pnpm sync`，重新生成 `packages/cli/src/generated/catalog.json`。
2. **主题名要唯一（顺手做）**：在同一份文档里补一句。同名主题共用一份样式；同名但值不同时，后出现的 `Theme` 赢（上游是先出现的赢），所以不要给不同的主题起相同的名字。
3. **补一条测试（顺手做）**：给 `MediaTheme.test.ts` 加一条用例，专门守住「颜色模式变了就重新测量」：不经过重新渲染，只改 mode，断言测量结果更新了。验收的做法是：把 `watch([mode, tokens])` 删掉，这条测试必须失败。

## 自查

- 自己在文档站里写一个临时页面，实际验证第 1 项里的每一句话都成立：2 个 class 输，3 个 class 赢，id 赢，不分层赢。验证完删掉这个页面。
- 运行 `env -u NODE_ENV pnpm check`，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`。两种 NODE_ENV 下 vitest 都要通过。
- 回报写到 `nodes/B1/impl-3.md`。
