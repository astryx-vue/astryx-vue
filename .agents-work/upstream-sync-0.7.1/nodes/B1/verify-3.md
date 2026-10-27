# B1 验收报告 · 第 3 轮

结论：**不通过（30/32 过，第 20、30 项不过）**。

不过的原因只有一条：新文档写「在 `@layer astryx.overrides` 里……用 id（`#brand-wrapper`）」。实测这一句照字面做不到。`Theme` 不把 `id` 写到外层元素上，所以 `<Theme id="brand-wrapper">` 加 `#brand-wrapper { … }` 什么都匹配不到。`#id` 写在祖先元素上单独用也没用。只有「祖先 id + class」（`#w .cls`）才赢，而文档没有这样写。其余各句（2 个 class 输、3 个 class 赢、不分层赢、`style` 属性赢、同名后渲染的赢）与实测一致。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B1`，分支 `sync/b1-theme`，HEAD `d6174a8`。第 3 轮两个提交：`79e5997`、`d6174a8`。
- 开始和结束时 `git status --short` 都是空（`/tmp/verify-B1-r3/status-start.txt`、`status-end.txt`，`diff` 结果相同）。
- 临时页面 `apps/docs/docs/en/vt-r3.md` 已删除。5171 没有监听。我持有的浏览器锁已释放（`browser-lock status` 里现在占着的是 B2）。
- 浏览器只通过 `browser-lock.mjs run --purpose B1-verify-r3` 开启，同一时刻只开 1 个，端口只用 5171。
- 为了起文档站，先在 B1 工作区跑了 `pnpm --filter @astryx-vue/core build`。产物目录 `dist` 被 git 忽略，不影响 `git status`。
- 脚本在 `/tmp/verify-B1-r3/`：`run.mjs`、`run2.mjs`、`check.log`。

## 第 3 轮改动范围（`git diff HEAD~2 --stat`）

```
 apps/docs/docs/en/themes/extending.md      | 13 +++++++-
 apps/docs/docs/zh/themes/extending.md      | 13 +++++++-
 packages/cli/src/generated/catalog.json    |  6 ++--
 packages/core/src/Theme/MediaTheme.test.ts | 48 ++++++++++++++++++++++++++++++
 4 files changed, 76 insertions(+), 4 deletions(-)
```

没有源码（`.vue`、`.ts` 非测试）、没有 css、没有 themes 包、没有台账改动。`useAutoMediaMode.ts` 的 `git diff HEAD~2 --stat` 为空。`catalog.json` 是文档的生成物。

## 逐项结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 默认外观没变 | 过（沿用第 2 轮） | 上面的 diff stat：第 3 轮没碰源码和样式。第 2 轮 24 张 `ours.png` 与 BASE 0 像素差。 |
| 2 | 间距跟着根字号变 | 过（沿用第 2 轮） | 同上，没碰源码和样式。 |
| 3 | 间距取值和上游一致 | 过（沿用第 2 轮） | 同上，themes 包 0 个文件改动。 |
| 4 | 数据 token 和上游一致 | 过（沿用第 2 轮） | 同上。 |
| 5 | 旧兼容层真的删了 | 过（沿用第 2 轮） | 同上，没碰 `defineTheme` 和样式。 |
| 6 | defineTheme 新能力 | 过（沿用第 2 轮） | 同上，`defineTheme.ts`、`themeCss.ts` 等 0 改动。 |
| 7 | MediaTheme `mode="auto"` | 过（沿用第 2 轮，并重测） | `useAutoMediaMode.ts` 0 改动。第 3 轮只加了一条测试，第 32 项已验。 |
| 8 | 深色模式 | 过（沿用第 2 轮） | 同上。 |
| 9 | spacing 与 px 混算 | 过（沿用第 2 轮） | 同上，无 css 改动。 |
| 10 | 用户自定义主题兼容 | 过（沿用第 2 轮） | 第 3 轮对 `extending.md` 只增加说明文字（见下方原文对照），没有改动任何代码示例。 |
| 11 | SSR | 过 | 全量 vitest 含 `ssr-smoke.test.ts`，两种 NODE_ENV 都过（见第 15 项）。`Theme.vue`、`MediaTheme.vue` 0 改动。 |
| 12 | 台账 98 条打勾 | 过（沿用第 2 轮） | 台账 0 改动。 |
| 13 | 「交给 Cx」清单可用 | 过（沿用第 2 轮） | 同上。 |
| 14 | 主题文档（间距 rem、旧名删除、新能力、前缀差异） | 过（沿用第 2 轮） | 第 3 轮只在 `extending.md` 加了一小节，`scale.md`、`tokens.md` 0 改动。 |
| 15 | 两种 NODE_ENV 全量 vitest | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`：247 文件、3388 条通过。`env NODE_ENV=production`：247 文件、3388 条通过，用例数相同。比第 2 轮多 2 个文件的差别不在本轮改动里（实现者回报也是 247/3388）；本轮新增的是 `MediaTheme.test.ts` 的 1 条。 |
| 16 | 完整 `pnpm check` | 过 | `env -u NODE_ENV` 依次跑 `check:packages`、`lint`、`typecheck`、`build`、`lint:pkg`，退出码 0（`/tmp/verify-B1-r3/check.log`）；test 一步用第 15 项的 `vitest run --maxWorkers=2` 代替。 |
| 17 | 范围、行数 | 过 | 本轮只改 4 个文件，没有组件接入、Neutral 调色板、themes 包。`check-line-limit` 在 `check:packages` 里通过。`MediaTheme.test.ts` 174 行（测试文件也不超限）。 |
| 17b | matcha、y2k | 过（沿用第 2 轮） | themes 包 0 改动。 |
| 18 | auto 跟着颜色模式重测 | 过（沿用第 2 轮） | 源码 0 改动。 |
| 19 | 派生变量表 | 过（沿用第 2 轮） | 源码 0 改动。 |
| 20 | 文档说明与实测一致 | **不过** | 见第 30 项。 |
| 21 | `d30591054` 写到 C 节点 | 过（沿用第 2 轮） | 台账 0 改动。 |
| 22 | 第 1 轮通过项重验 | 过 | 上面各项。 |
| 23 | 没有 `!important` | 过 | `check-no-important.mjs` 在 `check:packages` 里通过；第 3 轮没碰 css 和 ts 源码。 |
| 24 | `Theme.vue` 不写 token 到 `:style` | 过 | 读了 `Theme.vue`：`rootStyle` 只有 `colorScheme`，`attrs.style` 排在最后。第 30 项里 `style="--astryx-spacing-3: 99px"` 在宽、窄视口都读回 99px。 |
| 25 | 适配规则仍然生效 | 过 | 第 30 项的 `none`（没有覆盖）：宽 1000 读回 12px，窄 600（`width < md`）读回 6px。 |
| 26 | 用户能覆盖 | 过 | 不分层规则在宽、窄两种情况下都读回 46px。 |
| 27 | 多个 Theme 互不干扰 | 过（沿用第 2 轮） | 源码 0 改动。 |
| 28 | SSR 没有闪动 | 过（沿用第 2 轮，并随全量 vitest） | 源码 0 改动。 |
| 29 | 默认外观不变 | 过（沿用第 2 轮） | 同第 1 项。 |
| 30 | 文档说法和实测一致 | **不过** | 见下面「第 30 项」。 |
| 31 | 主题名要唯一，如实说明谁赢 | 过 | 见下面「第 31 项」。 |
| 32 | 测试真的守住了行为 | 过 | 见下面「第 32 项」。 |

## 第 30 项

### 实测

页面：临时 `apps/docs/docs/en/vt-r3.md`，主题 `vt-r3`，根值 `--astryx-spacing-3: 12px`，`width < md`（768px）时适配成 6px。`Theme` 的外层元素用 `class` 标记（`Theme` 只透传 `class` 和 `style`）。读回 `getComputedStyle(外层元素).getPropertyValue('--astryx-spacing-3')`。视口 1000 宽（适配条件不成立，`matchMedia('(width < 768px)')` 为 false）和 600 宽（条件成立，为 true）各测一遍。

| 覆盖写法 | 1000 宽（不成立） | 600 宽（成立） | 结果 |
| --- | --- | --- | --- |
| `@layer astryx.overrides` 里 1 个 class：`.c-l1` | 12px | 6px | 输 |
| `@layer astryx.overrides` 里 2 个 class：`.astryx-theme.c-l2` | 12px | 6px | 输 |
| `@layer astryx.overrides` 里 2 个 class，写在 body 里排在主题后面的 `<style>` | 12px | 6px | 输 |
| `@layer astryx.overrides` 里 3 个 class：`.c-l3.c-l3.c-l3` | 43px | 43px | 赢 |
| 同上 3 个 class，写在 body 里排在后面的 `<style>` | 63px | 63px | 赢 |
| `@layer astryx.overrides` 里 id 写在外层 div，Theme 是它的子元素，选择器 `#w4 .c-id`（id + class） | 44px | 44px | 赢 |
| 同上，选择器 `#w9 .c-idchild` | 49px | 49px | 赢 |
| `@layer astryx.overrides` 里只写 id，选择器 `#w7 { … }`，`#w7` 是 Theme 的父 div | 12px | 6px | **输** |
| `<Theme id="w8">` 加 `#w8 { … }` | 12px | 6px | **输**，且外层元素上根本没有 `id`（`e.id` 为空） |
| 不分层：`.c-un { … }` | 46px | 46px | 赢 |
| Theme 的 `style="--astryx-spacing-3: 99px"` | 99px | 99px | 赢 |
| 没有覆盖 | 12px | 6px | 主题自己的根值和适配值 |

（第一次跑用了 `#w5.c-id2`、`#w5` 之类的写法，也都是输；结果在 `run.mjs` 的输出里，同样的原因。）

### 原文对照（英文 `themes/extending.md`，「Overriding theme tokens」）

| 原文 | 实测 |
| --- | --- |
| 「`Theme` writes its tokens into a `<style>` that sits inside the wrapper element.」 | 一致。`querySelector('style')` 在外层元素里，内容以 `@layer astryx.overrides { @scope ([data-astryx-theme="vt-r3"]) to ([data-astryx-theme]) { :scope.astryx-theme { --astryx-spacing-3: 12px; …` 开头。 |
| 「The rule selector is `:scope.astryx-theme`, which weighs as much as two classes, and that `<style>` comes later in the document than your stylesheets.」 | 一致。2 个 class 输、3 个 class 赢，与权重 2 个 class、`<style>` 在后面相符。 |
| 「So a plain rule on the wrapper loses when it sits inside `@layer astryx.overrides` and names fewer than three classes.」 | 一致。1 个、2 个 class 都输。 |
| 「Put the override in CSS that is not inside any `@layer`. Unlayered styles beat every layered style, so this always wins.」 | 一致。46px，宽窄都赢。 |
| 「Inside `@layer astryx.overrides`, use an id (`#brand-wrapper`), or at least three classes (`.wrapper.wrapper.wrapper`).」 | **后半句一致，前半句不一致。** 3 个 class 赢。但「用 id（`#brand-wrapper`）」照字面做不到：`Theme` 不输出 `id`，所以 `#brand-wrapper { … }` 在 Theme 外层元素上匹配不到任何东西；写在祖先元素上单独用 id 也不行（`#w7`，输）。只有「祖先 id + class」的组合（`#w4 .c-id`）才赢，文档没有这样写。照文档写的用户，会得到一条不生效的规则。 |
| 「The same holds for adapted tokens, with or without a matching condition.」 | 一致。表中 1000 宽和 600 宽结果对应。 |
| 「A value passed in the wrapper's own `style` attribute also wins.」 | 一致。99px。 |

中文（`themes/extending.md`，「覆盖主题的变量」）逐句对应相同：「用 id（`#brand-wrapper`）」同样不准，其余各句一致。

上游 v0.7.1 的 `Theme.tsx` 外层 div 也没有 `id`、没有透传属性，所以这不是和上游行为不一致的问题，是文档说法对不上实测。

### 改法（供实现者参考，我没有改）

把这句改成与实测一致的话，例如：「`Theme` 不会把 `id` 写到外层元素上。在 `@layer astryx.overrides` 里，要么叠 3 个以上的 class（`.wrapper.wrapper.wrapper`），要么在外层再包一层带 id 的元素、再用 `#id .wrapper` 这样的写法（id 加一个 class）。」中英文都要改，并重新生成 `catalog.json`。

## 第 31 项

- 原文：「Theme names must be unique. Two `Theme` components with the same `name` share one set of rules. If their values differ, the one that renders later wins for both.」中文：「主题名要唯一。两个 `name` 相同的 `Theme` 共用一份样式。如果它们的值不一样，后渲染的那个会对两边都生效。」
- 实测：两个 `Theme`，`name` 都是 `dup-r3`，`--spacing-3` 分别是 11px 和 22px，先写 11px 的后写 22px 的。读回 `c-first` 22px、`c-second` 22px（宽 1000）。后渲染的赢，并且对两边都生效。
- 另一组：`dupA(11) dupB(22) dupB2(22) dupA2(11)`，四个都读回 11px，也就是最后渲染的那份（11px）赢，对四个元素都生效。
- 「共用一份样式」的说法：两份 `<style>` 都在文档里，作用域选择器相同，靠层叠顺序后到的赢，效果等同于共用一份。一致。
- 判过。

## 第 32 项

在工作区里直接改 `useAutoMediaMode.ts`，把第 147 行 `watch([mode, tokens], measure, { flush: 'post' })` 换成注释，跑完用 `git checkout --` 还原。

| 步骤 | `env -u NODE_ENV` | `NODE_ENV=production` |
| --- | --- | --- |
| 改动前，`MediaTheme.test.ts` | 10 条通过 | 10 条通过 |
| 删掉 `watch`，`MediaTheme.test.ts` | 9 通过、1 失败：`re-measures on a color mode switch even when nothing re-renders`，`AssertionError: expected 'dark' to be undefined` | 同样 9 通过、1 失败，同一个断言错误 |
| 还原后 | 10 条通过 | 10 条通过 |

- 第 2 轮指出「只去掉 `watch`，旧测试仍过」，这条新用例解决了这个问题：只通过 `matchMedia` 的 change 事件和祖先元素的 CSS 变量触发，不让任何组件重渲染，只有 `watch` 能触发重新测量。
- 还原后 `git status --short` 为空。判过。

## 对实现者回报的核对

- 回报说自查时「id + class：45px 赢（Theme 不透传 id，所以 id 放在外层 div 上）」。这个事实是对的，但文档里没有写出来，文档写的是「use an id (`#brand-wrapper`)」。这一处是回报与文档不一致的地方，也是本轮不通过的原因。
- 回报其余各点（2 个 class 输、3 个 class 赢、不分层赢、同名后渲染的赢、测试能守住 `watch`）我都自己复测过，一致。
