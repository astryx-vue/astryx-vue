# B7 验收报告 · 第 1 轮

结论：通过（25/25）

- 工作区：`/workspace`，分支 `sync/b7-utils`，提交 `a6e682a`（本报告提交前）。
- 比较基点：`BASE = 202336faea5c49c27aa75f76811d0e82795accce`（`git merge-base HEAD origin/swarm-tree`）。
- 临时文件和截图：`/tmp/verify-B7/`。探针和日志都是这次重新生成的，没有用实现者留下的产物。
- 只读检查：开始时 `git status` 是 `On branch sync/b7-utils`，`nothing to commit, working tree clean`。结束时工作区相对开始只多了本报告。产品源码没有改动。
- 临时改动：无。探针放在 `/tmp/verify-B7/`，没有改仓库里的源码。
- 浏览器：不适用。本节点没有界面，没有开浏览器，没有截图。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 时间解析和调整 | 过 | 探针 `behavior.test.ts` 打印：`2:30 p.m.` → `14:30`，`2pm` → `14:00`，`1430` → `14:30`，`12:00 AM` → `00:00`，`12:00 PM` → `12:00`。空串和 `25:00` 为 null。`adjustTime('23:30', 60)` 为 `00:30`。`-Infinity`、`Infinity`、`NaN` 都仍是 `10:00`。`timeParser.test.ts` 含在下面第 21 条的 327 条里。 |
| 2 | 日期解析 | 过 | 同一探针：`2026-01-25` → `{year:2026,month:1,day:25}`。`3/4/2026` 在 `en-US` 是 3 月 4 日，在 `es-ES` 是 4 月 3 日。`January 25` 的年是当前年 2026，月 1 日 25。单独的 `1`、空串、`2026-02-30`、`February 30, 2024` 都是 null。 |
| 3 | 纯日期、周序号、夏令时 | 过 | 公元 99 年 1 月 2 日 `plainDateToDate` 再 `plainDateFromDate`，`getFullYear()` 是 99，回来仍是 `{year:99,month:1,day:2}`。2026-01-31 加 1 个月是 2026-02-28。`plainDateGetWeekNumber(2026-01-01)` 是 1，`plainDateWeekFieldName('en-US')` 是 `week`。`plainDate.test.ts` 把周序号和这个字段名锁在测试里。圣地亚哥 2026-09-06 的午夜空档瞬间等于 `Date.UTC(2026, 8, 6, 4)`。哈瓦那 2026-11-01 00:30 取较早的一次，等于 `Date.UTC(2026, 10, 1, 4, 30)`。 |
| 4 | 可见字符 | 过 | 有 `Intl.Segmenter` 时，笑脸、国旗、家庭 emoji、`e` 加组合尖音各计 1。`truncateCharacters('abcdefghij', 5)` 是 `abcd…`，省略号算进上限。四个笑脸截到 3 个，结果是两个完整笑脸加省略号，没有半个代理对。去掉 `Intl.Segmenter` 后（`fallback.test.ts`）：两个笑脸仍计 2，国旗计 2，截断仍是两个完整笑脸加省略号。 |
| 5 | 安全地址 | 过 | `https`、相对路径、`mailto`、`data:image` 通过。`javascript:`、`vbscript:`、大小写变体、夹制表符的 `java\tscript:`、`data: text/html`（冒号后有空格）拒绝。路由对象的 `pathname`、`href`、`protocol` 走同一判断：危险 `pathname` / `protocol` 拒绝，安全 `href` 通过。 |
| 6 | 共享尺寸观察 | 过 | `resize.test.ts`：两个元素只构造了 1 个 `ResizeObserver`。同一元素上两个回调都会收到通知（`cb1,cb2`）。退订其中一个后，另一个还能收到（`only-b` 在，`only-a` 不在）。同一回调注册两次，退订函数调用两次也只卸掉一份，通知还在；再退订另一次才卸干净。分发过程中退订，还没调用的下一个回调仍然执行（`first,second`）。 |
| 7 | 事件链 | 过 | 探针把三个处理函数串起来，中间是 `undefined`。执行顺序是先 `a:false`，前一个调用 `preventDefault` 后，后一个仍然执行，并且看到 `b:true`。 |
| 8 | 输入 ARIA | 过 | 没有分组时 `ariaLabelledBy` 是 `undefined`，说明 id `input-help` 出现两次，拼完去重后是 `input-help`。有分组时标签是 `group-label input-label`，说明是 `group-help input-help`，分组的在自己的前面。 |
| 9 | 展现方式 | 过 | 显式 `text-input` 压过 `nativePicker: always`。日期组件的 `never` 是 `adaptive-bottom-sheet`，时间组件的 `never` 是 `text-input`。`adaptive-native` 在粗指针下是 `native`，细指针下是 `desktop`。`inputPresentation.test.ts` 覆盖同样的断言，含在第 21 条里。 |
| 10 | 分组 | 过 | 组名按第一次出现：Navigation，然后 Preferences，没组名的在最后。`ungroupedFirst: true` 时没组名的在最前。没有任何组名时返回一组 `heading: null`。`groupItems.test.ts` 同样通过。 |
| 11 | 输入法 | 过 | `isComposing === true`、`keyCode === 229`、`key === 'Process'` 都为真。普通 Enter（`keyCode` 13）为假。`Object.hasOwn` 在包入口、composables 入口、`utils/index.ts` 上都是 false。`deprecatedApis.public.test.ts` 也断言包入口和 composables 入口没有这个名字，含在第 21 条的 327 条里。 |
| 12 | 苹果平台 | 过 | `behavior.test.ts` 第二条通过：Client Hints 写 `macOS` 时，即使 `navigator.platform` 是 `Win32`，结果为真；写 `Windows` 时，即使平台是 `MacIntel`，结果为假。空串、空白、`Unknown` 再看 `navigator.platform`。把 `navigator` 设成 `undefined` 后返回 false。 |
| 13 | 样式键 | 过 | `base` 是空串。`variant:secondary` 是 `[data-variant="secondary"]`。`listStyle:ordered` 是 `[data-list-style="ordered"]`。`checked` 是 `[data-checked="checked"]`。值里的引号和反斜杠转成 `[data-variant="quote\22 slash\5c "]`。 |
| 14 | 键盘和读屏 | 过 | 没有新界面。第 7 条锁住键盘事件链：`preventDefault` 不会吃掉后面的处理函数。第 8 条锁住读屏 id 的拼接和去重。组件接上它们是 C 节点的事。 |
| 15 | 服务端渲染 | 过 | `timeParser.ts`、`dateParser.ts`、`plainDate.ts`、`dateTypes.ts` 里没有 `document` / `window` / `navigator`。`env -u NODE_ENV pnpm vitest run --maxWorkers=2 --environment node` 跑这四个测试文件：4 个文件、176 条，退出码 0。`NODE_ENV=production` 再跑一遍，仍是 4 个文件、176 条。对照用的节点探针打印 `document=undefined`。`isApplePlatform` 在 `navigator` 为 `undefined` 时返回 false，见第 12 条。没有 `ResizeObserver` 时，`observeResize` 仍同步回调一次：`RESIZE_MISSING_JSON {"missing":true,"calls":["x"]}`。 |
| 16 | 空数据和边界 | 过 | 空时间、空日期、单独数字、2 月 30 日都返回 null，没有抛错。空串截断得到空串。`max` 比省略号短时，`truncateCharacters('abcdef', 2, '...')` 得到 `...`。非有限分钟增量不改原值。`plainDateCreate(0, 1, 1)` 和 `plainDateCreate(2026, 2, 30)` 都抛 `RangeError`，这是约定。 |
| 17 | 现有行为没被换掉 | 过 | `useTimeValue.parseISOTime('14:30:05')` 仍是 `{hours:14, minutes:30, seconds:5}`。`TimeField.vue` 仍从 `useTimeValue` 引入，并用 `{hours, minutes, seconds}` 调 `formatISOTime`。日期、时间组件没有引用 `utils/timeParser`。包入口的 `DateRange` 仍从 `DateRangeInput/index.js` 导出；`utils/index.ts` 没有导出 `DateRange`。`root.isRenderable` 仍是函数。元素 vnode 为真；空注释、空白文本、只含注释的片段为假。`isRenderable.test.ts` 和 `useTimeValue.test.ts` 含在第 21 条里。 |
| 18 | 图标 | 过 | 不适用。这批函数没有图标。 |
| 19 | 没有 `!important` | 过 | `timeout 60 node scripts/check-no-important.mjs` 退出码 0，没有输出。`pnpm check:packages` 里的同一步也通过。 |
| 20 | 台账 | 过 | `ledger/B7.md` 有 26 条 `- [x]`，没有未勾选。已采纳 19 条，不适用 7 条，每条下面都有结论。抽查已采纳：`473252320` 的紧凑时间由第 1 条探针打过；`86a7f1752` 的可见字符由第 4 条打过；`d55751f88` 的互不影响订阅由第 6 条打过。7 条不适用都站得住：`e5e83effd`、`33a14a205` 是 StyleX，仓库里没有 `focusOutline.stylex.ts`，这次 diff 也没加样式表；`de42f11b5`、`176dfa624`、`17044ab1e`、`021f14182` 是上游规范文档，diff 里没有这些文档，钟点消歧已经在 `plainDateToInstant`（第 3 条）；`a078d7aaf` 不换浅检查，`utils/isRenderable.ts` 不存在，现有的仍看 VNode（第 17 条）。 |
| 21 | 上游测试和两种 NODE_ENV | 过 | `packages/core/src/utils/` 里有 `timeParser`、`dateParser`、`plainDate`、`dateTypes`、`characters`、`safeUrl`、`sharedResizeObserver`、`chainEventHandlers`、`inputAria`、`isApplePlatform`、`parseStyleKey`、`ime`，以及本节点自己的 `inputPresentation.test.ts`、`groupItems.test.ts`。同一组路径（utils 再加再导出和旧行为测试）跑两遍：`env -u NODE_ENV` 与 `NODE_ENV=production` 都是 `pnpm vitest run --maxWorkers=2`，都是 19 个文件、327 条，退出码 0。日志在 `/tmp/verify-B7/vitest-unset.log`、`vitest-prod.log`。 |
| 22 | 包检查和导出同步 | 过 | `timeout 180 env -u NODE_ENV pnpm check:packages` 退出码 0：边界通过，生成文件一致，catalog 245 个组件，行数通过，文案目录通过。`timeout 60 node scripts/sync-exports.mjs --check` 打印「生成结果和已提交文件一致。」，退出码 0。 |
| 23 | 行数 | 过 | `timeout 60 node scripts/check-line-limit.mjs` 退出码 0，打印「源码单文件行数检查通过（上限 500 行）」。新源码里最长的是 `plainDate.ts` 440 行、`timeParser.ts` 394 行。白名单提示指向 DropdownMenu、PowerSearch、TableData，不在本节点 diff 里。 |
| 24 | 改动范围 | 过 | `git diff 202336f --name-only` 里，产品代码只有 `packages/core/src/utils/`、`packages/core/src/index.ts`、`packages/core/package.json`，以及允许的再导出：`Link/safeUrl.ts`、`composables/internal/ime.ts`、`composables/internal/platform.ts`、`composables/countCharacters.ts`。没有日期、时间、日历、图表、日程表组件文件。`index.ts` 增加 87 行，都是从 `utils/index.js` 再导出。`package.json` 只增加 `./utils` 入口。这四个旧文件改成从 utils 再导出。 |
| 25 | 注释不写修改历史 | 过 | `git diff $BASE` 里，`原来|改成|之前|moved|extracted|split from` 的新增行只出现在 `plan.md` 和 `verify.md` 的计划说明里。`git diff $BASE -U2 -- '*.ts' '*.vue' '*.mjs'` 没有命中。源码注释没有讲这次怎么改的。 |

## 看图

不适用。本节点没有界面，没有截图。

| 图 | 看到的内容 |
| --- | --- |
| 无 | 不适用 |

## 对实现者偏离计划的判断

合理。

- 没有建旁路 worktree。云端工作目录就是这个仓库。函数行为和测试不依赖旁路目录。
- `parseISOTime`、`formatISOTime`、`isTimeInRange` 以及 `{hour, minute, second}` 这套类型不从 `utils/index.ts` 导出。包入口和 TimeInput 仍用 `useTimeValue` 的 `{hours, minutes, seconds}`。第 17 条对过。
- `dateTypes.ts` 里的 `DateRange` 不从入口导出。包入口的 `DateRange` 仍来自日期范围组件。第 17 条对过。
- `parseStyleKey` 在 `@astryx-vue/core/utils`，不在包根。`scripts/sync-exports/render-index.mjs` 的 `isInjectionKey` 会滤掉以 `Key` 结尾的驼峰名字，`parseStyleKey` 碰上这条规则。选择器行为见第 13 条。
- `isImeKeyEvent`、`isApplePlatform` 不进公开入口。输入法这一条是验收要求（第 11 条）。苹果平台仍从 `composables/internal/platform.ts` 再导出，行为见第 12 条。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

行数检查会提示 DropdownMenu、PowerSearch、TableData 的白名单可以收紧。这三份文件不在本节点的 diff 里，不影响这次结论。
