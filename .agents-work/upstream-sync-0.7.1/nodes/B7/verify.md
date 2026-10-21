# B7 工具函数 utils · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 这些函数没有界面。效果指：同样的输入得到同样的结果，读屏要用的 id 串、导航能不能过、尺寸订阅会不会互相拆掉。

## 环境

- 工作区：本仓库分支 `sync/b7-utils`。`BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。临时文件放在 `/tmp/verify-B7/`。
- 测试环境：
  - 命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项跑两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：本节点没有界面，不开浏览器。视觉对照写「不适用」。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出。

### 一、函数行为和上游一致

1. 时间：`parseTimeInput('2:30 p.m.')` 为 `14:30`，`parseTimeInput('2pm')` 为 `14:00`，`parseTimeInput('1430')` 为 `14:30`，`12:00 AM` 为 `00:00`，`12:00 PM` 为 `12:00`。非法时间返回 null。`adjustTime` 越过午夜会绕回，非有限的增量不改原值。
2. 日期解析：`2026-01-25` 得到 `{year:2026, month:1, day:25}`。`3/4/2026` 在 `en-US` 是 3 月 4 日，在 `es-ES` 是 4 月 3 日。`January 25` 用当前年。单独一个数字返回 null。2 月 30 日返回 null。
3. 纯日期：公元 99 年 1 月 2 日转成 `Date` 再转回来仍是 99 年，不是 1999。1 月 31 日加 1 个月落在 2 月最后一天。周序号和「周」这个字段名有测试锁住。夏令时把午夜跳过的那天，从空档后的第一刻开始；重复的钟点取较早的一次。
4. 可见字符：😀、国旗、家庭 emoji、带组合音标的字母各算 1。截断结果里的省略号算进上限，并且不会留下半个代理对。没有 `Intl.Segmenter` 时，emoji 代理对仍然完整，国旗会拆成两个区域指示符（这是上游写明的降级）。
5. 安全地址：`https`、相对路径、`mailto`、`data:image` 通过。`javascript:`、`vbscript:`、大小写和夹了控制字符的变体、`data: text/html`（冒号后有空格）拒绝。路由对象的 `pathname`、`href`、`protocol` 走同一条规则。
6. 共享尺寸观察：两个元素共用一个 `ResizeObserver`。同一个元素上两个回调都会收到通知。退订其中一个，另一个还能收到。同一个回调注册两次时，退订一次还留着，退订两次才真正卸下。分发过程中退订不会跳过还没调用的回调。
7. 事件链：处理函数按参数顺序都执行，中间夹着 `undefined` 会跳过。前一个调用了 `preventDefault`，后一个仍然执行，并且看得到 `defaultPrevented === true`。
8. 输入 ARIA：没有分组时不设 `ariaLabelledBy`，说明 id 拼成一串并去重。有分组时，分组标签在自己的标签前面，分组说明在自己的说明前面。
9. 展现方式：显式 `presentation` 压过 `nativePicker`。日期组件的 `never` 对应 `adaptive-bottom-sheet`，时间组件的 `never` 对应 `text-input`。粗指针下 `adaptive-native` 是 `native`，细指针下是 `desktop`。
10. 分组：有组名的条目按第一次出现的顺序成组，没组名的默认放在最后。`ungroupedFirst: true` 时没组名的放在最前。没有任何组名时，返回一组 `heading: null`。
11. 输入法：`isComposing === true`、`keyCode === 229`、`key === 'Process'` 都算拼字。普通 Enter 不算。这个函数不从包入口和 composables 入口导出。
12. 苹果平台：Client Hints 写了 `macOS` 就是苹果，写了 `Windows` 就不是，即使 `navigator.platform` 相反。空字符串、空白、`Unknown` 再看 `navigator.platform`。没有 `navigator` 时返回 false。
13. 样式键：`base` 是空串。`variant:secondary` 是 `[data-variant="secondary"]`。`listStyle:ordered` 是 `[data-list-style="ordered"]`。`checked` 是 `[data-checked="checked"]`。值里的引号和反斜杠按 CSS 转义。

### 二、反向挑刺

14. 键盘和无障碍读屏：没有新界面。第 7、8 条就是这两个函数对键盘事件和读屏 id 的约定。组件接上它们是 C 节点的事，本节点不要求打开页面。
15. 服务端渲染：这些函数里，日期和时间的纯计算不碰 DOM。`isApplePlatform` 在没有 `navigator` 时返回 false。`sharedResizeObserver` 在没有 `ResizeObserver` 时仍然同步回调一次。抽一个不依赖 DOM 的测试在 node 环境能跑即可；跑不了就读代码确认，并写明。
16. 空数据和边界：空字符串时间、空日期、空字符截断、年份小于 1、2 月 30 日、非有限的分钟增量、`max` 比省略号还短，都有断言，不能抛出意外异常（`plainDateCreate` 对非法日期抛 `RangeError` 是约定）。
17. 现有行为没被换掉：`TimeInput` 仍然从 `useTimeValue` 取 `{hours, minutes, seconds}`。包入口的 `DateRange` 仍然是日期范围组件那个类型，不是 `{start, end}` 的纯日期记录。`isRenderable` 仍然是 Indicator 里会看 VNode 的那个。
18. 图标：不适用。
19. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。

### 三、整体

20. 台账 `ledger/B7.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认函数或测试确实在。抽查全部「不适用」，理由要站得住。
21. 上游这些测试文件都有对应的 Vue 测试，两种 NODE_ENV 下都通过，用例数相同：`timeParser`、`dateParser`、`plainDate`、`dateTypes`、`characters`、`safeUrl`、`sharedResizeObserver`、`chainEventHandlers`、`inputAria`、`isApplePlatform`、`parseStyleKey`、`ime`。展现方式和分组没有上游测试文件，本节点自己的测试要覆盖第 9、10 条。
22. `env -u NODE_ENV pnpm check:packages` 通过。`node scripts/sync-exports.mjs --check` 通过。
23. 新写和改到的源码文件不超过 500 行：`node scripts/check-line-limit.mjs` 通过。
24. 改动范围：`git diff $BASE --stat` 里没有日期、时间、日历、图表、日程表组件的行为改动。允许的例外只有把已有工具改成从 `utils` 再导出：`Link/safeUrl.ts`、`composables/internal/ime.ts`、`composables/internal/platform.ts`、`composables/countCharacters.ts`，以及 `pnpm sync` 生成的入口。
25. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/B7/verify-1.md`，格式见 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：前面加 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-B7/`。本节点不开浏览器。
