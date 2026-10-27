# B4 验收报告（第 4 轮，总控亲自做）

**结论：通过。** 第 3 轮第 28 项没过，用户决定后面的修复和验收由总控自己完成，不再派子代理。

## 总控这一轮修了什么（提交「剩下的浮层根也套上文字重置……」）

1. 第 3 轮查出 4 个浮层拿不到文字重置：MultiSelector、Typeahead/Tokenizer、MoreMenu，外加 TimeInput。这次总控把所有 Teleport 出去的浮层都排查了一遍，把剩下的 10 个浮层根都加上了 `astryx-layer` 类，并让它们各自直接 import `layer.css`：BaseTypeahead、Tokenizer、PowerSearch、MultiSelector、MoreMenuPanel（只在 Teleport 出去时生效，内联时不生效）、MoreMenuSheet、NavDisclosure、TimeField、TableRowMenu、ButtonTooltip。
2. 守卫测试 `layer/layerCss.test.ts` 重写了。现在每个带 `<Teleport>` 的组件必须同时满足两条：
   - ① **自己**直接引入 `layer.css`，或者直接引入 `scopedProvide` / `LayerContentBoundary`。别的组件顺带引入的不算。
   - ② Teleport 出去的根元素，类名要能被重置规则命中。

   不算浮层根的 Teleport 有 4 个，单独列出来并写明了原因：Chat 输入框里自己的 span、TopNav 抽屉、两个子菜单的下钻面板。

## 检查项

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1–27 | 第 1–3 轮的检查项 | 过（沿用第 3 轮） | 第 3 轮 verify-3.md 除第 28 项以外都过了。本轮只改了 10 个浮层根的类名和 import，再加上测试 |
| 28a | 只按子路径引入时，文字重置生效 | 过 | 复用验收者的最小页面 `/tmp/verify-B4-r3/sub/run.mjs`，基于构建出来的 dist。外层设了粗体、大写、居中、字距、斜体。下面 8 个浮层里的文字都是 400 / normal / none / start / normal：Popover、Dialog、TabMenu、Selector、MultiSelector、Typeahead、TimeInput、MoreMenu。「只按子路径引入」和「引入完整 styles.css」两种方式结果相同，控制台没有报错 |
| 28b | 守卫测试真的拦得住 | 过 | 反证测试一：删掉 Selector 的 `layer.css` import，测试失败（以前它能借 BottomSheet 的引入蒙混过关）。反证测试二：删掉 BaseTypeahead 的 import，测试失败。反证测试三：去掉 MultiSelector 根元素上的 `astryx-layer`，「重置类名」那一条失败。三次都已还原 |
| 28c | 所有浮层都覆盖到了 | 过 | 守卫测试会遍历全部 23 个带 Teleport 的组件，没有手写的漏网名单 |
| 29 | TabList、Stepper 截断 | 过（第 3 轮已验） | 见 verify-3.md |
| 全量 | check、vitest | 见合入记录 | `worktree.mjs merge` 会跑完整检查 |

## 遗留事项

- `TabListContext` 和 `StepperContext` 在 B4 第 3 轮已经截断了。`DropdownMenuContext` 因为结构原因没有截断，已经交给 C6（见 impl-2.md）。
- Dialog 打开后约 0.5 秒内，Toast 点不到。这是为了让 Toast 不跳动而做的取舍，已经记进 C7 的交接清单。
