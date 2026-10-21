# B1 第 4 轮验收（只复查第 20、30 项）

结论：**通过**。第 20、30 项都过；改动范围对；`check:packages` 通过。其余 30 项沿用第 3 轮结论。

## 总表

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 20 | 文档说明与实测一致 | 过 | 见下面第 30 项。文档里每一种写法都与实测一致。 |
| 30 | 文档说法和实测一致 | 过 | 见下面两张表。12 种情形（6 种写法，宽 1000 与窄 600 各测一次）全部和文档一致。 |
| 范围 | 只碰 3 个文件 | 过 | `git show --stat HEAD`（`056c84f`）：`apps/docs/docs/en/themes/extending.md`、`apps/docs/docs/zh/themes/extending.md`、`packages/cli/src/generated/catalog.json`，共 4 行加、4 行减。 |
| catalog | catalog 带上新句子 | 过 | `catalog.json` 里 `#brand .wrapper` 出现 2 次（中、英各 1），`单写 \`#id\`` 1 次，`\`#id\` alone` 1 次；上一版的 `#brand-wrapper` 在新版本里是 0 次（上一提交里是 2 次）。 |
| check | `env -u NODE_ENV pnpm check:packages` | 过 | 退出码 0（日志 `/tmp/verify-B1-r4/check.log`）。`catalog is up to date`、行数检查通过、`check:i18n-catalog` 通过。 |
| 清理 | git status 前后一致 | 过 | 开始和结束时 `git status --short` 都是空。临时页面 `apps/docs/docs/en/vt-r4.md` 已删，5171 端口没有进程。 |
| 其他 30 项 | 沿用第 3 轮 | 沿用 | 本轮提交只改文档和 catalog，没碰源码、测试、themes 包。 |

## 第 30 项：实测

方法照第 3 轮：临时页面 `vt-r4`，主题名 `vt-r4`，根值 `--spacing-3: 12px`，`width < md`（768px）时适配成 6px。每个 `Theme` 用 `class` 标记。覆盖 CSS 用 `addStyleTag` 加到文档里。读回 `getComputedStyle(外层元素).getPropertyValue('--astryx-spacing-3')`。
视口 1000 宽（`matchMedia('(width < 768px)')` 为 false，条件不成立）与 600 宽（为 true，条件成立）各测一次。

| 写法 | 文档怎么说 | 1000 宽（不成立） | 600 宽（成立） | 结果 |
| --- | --- | --- | --- | --- |
| `@layer astryx.overrides` 里 1 个 class：`.c-l1` | 输 | 12px | 6px | 输，一致 |
| `@layer astryx.overrides` 里 2 个 class：`.astryx-theme.c-l2` | 输 | 12px | 6px | 输，一致 |
| 同上 2 个 class，另写在 body 里排在更后面的 `<style>` | 输（文档说「不到 3 个 class 就压不过」） | 12px | 6px | 输，一致 |
| `@layer astryx.overrides` 里 3 个 class：`.c-l3.c-l3.c-l3` | 赢 | 43px | 43px | 赢，一致 |
| `<div id="brand">` 里包 `<Theme class="wrapper">`，层内选择器 `#brand .wrapper` | 赢 | 44px | 44px | 赢，一致 |
| 层内只写 `#id`：`#brand-wrapper`（它是 Theme 的父 div） | 选不中 | 12px | 6px | 没选中，一致 |
| 层内只写 `#id`：`<Theme id="brand-wrapper2">` 加 `#brand-wrapper2` | 选不中 | 12px | 6px | 没选中，一致；外层元素的 `id` 为空，和「`Theme` 不会把 `id` 写到外层元素上」一致 |
| 不分层：`.c-un { … }` | 赢 | 46px | 46px | 赢，一致 |
| `Theme` 的 `style="--astryx-spacing-3: 99px"` | 赢 | 99px | 99px | 赢，一致 |
| 没有覆盖（对照） | 主题自己的值 | 12px | 6px | 根值和适配值都在 |

## 原文逐句对照

英文（`themes/extending.md`，「Overriding theme tokens」）：

| 原文 | 实测 | 结果 |
| --- | --- | --- |
| 「So a plain rule on the wrapper loses when it sits inside `@layer astryx.overrides` and names fewer than three classes.」 | 1 个、2 个 class 都输（1000 和 600 宽都是主题自己的值）。 | 一致 |
| 「Put the override in CSS that is not inside any `@layer`. Unlayered styles beat every layered style, so this always wins.」 | 46px，宽、窄都赢。 | 一致 |
| 「Inside `@layer astryx.overrides`, stack at least three classes on the wrapper (`.wrapper.wrapper.wrapper`)」 | 3 个 class 赢（43px，宽、窄）。 | 一致 |
| 「or wrap the `Theme` in your own element with an id and select through it (`#brand .wrapper`).」 | 44px，宽、窄都赢。 | 一致 |
| 「`Theme` does not put an `id` on its wrapper, so `#id` alone does not match it.」 | 外层元素 `id` 为空；`#brand-wrapper`、`#brand-wrapper2` 都没选中，读回主题自己的值。 | 一致 |
| 「The same holds for adapted tokens, with or without a matching condition.」 | 上表中 1000 宽（不成立）和 600 宽（成立）的结论相同。 | 一致 |
| 「A value passed in the wrapper's own `style` attribute also wins.」 | 99px，宽、窄都赢。 | 一致 |

中文（`themes/extending.md`，「覆盖主题的变量」，在页面里渲染出的文字也读过）：

| 原文 | 实测 | 结果 |
| --- | --- | --- |
| 「只用一个或两个 class 去选外层元素，是压不过它的。」 | 1 个、2 个 class 都输。 | 一致 |
| 「把覆盖写在没放进任何 `@layer` 的普通样式里……一定能赢。」 | 46px，宽、窄都赢。 | 一致 |
| 「在外层元素上叠至少 3 个 class（`.wrapper.wrapper.wrapper`）」 | 赢（43px）。 | 一致 |
| 「在 `Theme` 外面自己再包一个带 id 的元素，用 `#brand .wrapper` 这样的写法去选」 | 赢（44px）。 | 一致 |
| 「`Theme` 不会把 `id` 写到它的外层元素上，所以单写 `#id` 是选不中的。」 | 外层 `id` 为空；单写 `#id` 都没选中。 | 一致 |
| 「适配出来的变量也一样，不管条件有没有成立。直接写在外层元素 `style` 属性里的值同样会赢。」 | 宽、窄两种情况结论相同；99px 赢。 | 一致 |

## 说明

- 「`#brand .wrapper`」的测试里，`#brand` 是 `Theme` 外面自己包的 div，`.wrapper` 是 `Theme` 的外层元素上的 class，和文档写的结构一致。
- 浏览器只通过 `browser-lock.mjs run --purpose B1-verify-r4` 打开，拿到 `browser-1`，跑完已释放。脚本在 `/tmp/verify-B1-r4/run.mjs`。
