# C2 验收报告 · 第 1 轮

结论：通过（20/20）

E3 交给本节点的 radio-group、toggle-button、slider 三套 happy-dom 契约没有写。按 `verify.md` 第 12 条和 `ledger/C2.md` 的写法，这件事单独标成「未完成 / 非本节点阻塞」，不把本轮打成不通过。理由见文末。

- 工作区：`/workspace`，分支 `sync/c2-checkable`，被验收的提交 `fd05990`。
- 比较基点：`BASE = 4a5b9a4227675ee7ca1f56caa17788d5e30adead`（`git merge-base HEAD origin/swarm-tree`）。
- 临时文件和截图：`/tmp/verify-C2/`，给总控的图在 `/opt/cursor/artifacts/c2-verify-1/`。全部这次重新生成，没有用实现者留下的图。
- 只读检查：开始时 `git status` 是干净的。探针测试用完已删。结束时工作区也是干净的。两次相同。
- 临时改动：曾把 `packages/core/src/CheckboxList/verify-probe.test.ts` 放进去跑 4 条探针，跑完已删除。已还原。
- 浏览器：`browser-lock.mjs` 的 browser-1。文档站 `http://127.0.0.1:5173`。结束后端口没有监听，没有残留浏览器进程，两把浏览器锁都空闲。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 文档站整页：至少 4 个页面，桌面浅色、桌面深色、390 浅色、390 深色；禁用指针是普通箭头；刻度颜色跟填充和轨道 | 过 | 图见「看图」。禁用复选框、禁用开关、禁用分段的计算样式都是 `cursor: default`，可用复选框是 `pointer`（`/tmp/verify-C2/interact.json`）。滑块值在 3 时，刻度 0 为 `data-filled`、背景 `rgb(38, 38, 38)`，和填充色相同；25 及以上没有 `data-filled`，背景 `rgb(229, 229, 229)`，和轨道色相同（`/tmp/verify-C2/followup.json`）。 |
| 2 | 滑块方向键、Home、End；从右到左时左键增大；分段超长省略且不撑出容器 | 过 | 文档站滑块：Home 为 0，End 为 100，再按左为 99。步长够不着最大值的情况在 `Slider.parts.test.ts`：min 0、max 100、step 3，End 为 100，左键为 96。从右到左时左键增大在 `Slider.test.ts`「mirrors horizontal pointer and arrow movement in RTL」，该文件在下面的 186 条里通过。分段标签临时改成超长并限制宽度后，`text-overflow: ellipsis`、`white-space: nowrap`，标签滚动宽度 224、可见宽度 60，控件宽 160，没有超过父级 560。 |
| 3 | 读屏：group 名字、富文本名字和说明、加载播报、标签 class | 过 | 文档站复选列表第一个 group 的名字是列表标签 “Notification preferences”。`CheckboxList.parts.test.ts` 证明富文本标题成为复选框名字，说明挂在 `aria-describedby`。开关内部 `[role="status"]` 数量为 0。`Switch.test.ts` 在默认语言播报 Loading，`zh-CN` 播报「加载中」。探针里传入 `loadingLabel="请稍候"` 时，文档级 `[data-astryx-live-region="polite"]` 的文字是「请稍候」。这个播报节点自己带 `role="status"`，它是文档级播报区，不在开关内部。标签 class：复选框同时有 `astryx-field-label` 和 `astryx-checkbox-label`，开关测试断言同时有 `astryx-switch-label`。 |
| 4 | 只用键盘能操作；拖滑块不出现焦点环；单独按 Shift 不把环叫回来 | 过 | 文档站：空格把复选框从勾选改成未勾选；方向键把单选改到 `sms`；空格把开关从开改到关；方向键把分段选到 Activity。滑块方向键之后 `data-keyboard-focus="true"`，鼠标在轨道上按下再松开后该属性消失，再单独按 Shift 仍然没有。 |
| 5 | 富文本链接可聚焦且不改选中；ariaLabel 覆盖名字；空说明不加 aria-describedby | 过 | `CheckboxList.parts.test.ts`、`RadioList.parts.test.ts` 点链接后没有 `update:modelValue`。`ariaLabel` 覆盖富文本名字的断言在复选列表测试里。探针：说明传空字符串时，复选框没有 `aria-describedby`。空列表仍有 group，页面不抛错。 |
| 6 | Slider 的 SSR 用例仍通过；这几个组件不在 SSR 已知失败名单 | 过 | `Slider.test.ts` 的 SSR 用例在 186 条里通过。`packages/core/src/ssr-known-failures.json` 是空对象，没有 Checkbox、Radio、Switch、SegmentedControl、ToggleButton、Slider。 |
| 7 | 超长分段省略；没有子项时 group 仍在 | 过 | 同第 2 条的省略测量，同第 5 条的空列表探针。 |
| 8 | container 只在外壳，control 只在本体；根上 class 留在外壳且不警告；横向标签里 container 不生效并警告一次；data-testid 落点正确 | 过 | `CheckboxList.parts.test.ts`、`RadioList.parts.test.ts`、`Slider.parts.test.ts` 都断言了这些落点，并且 `console.warn` 在根上 class 时没有被调用。横向标签下警告文案含 “no Field box renders”。`useDevWarning` 只在 `import.meta.env.DEV === true` 时警告，同一次挂载只警告一次。 |
| 9 | 不新增图标注册 | 过 | `git diff $BASE --name-only` 没有图标路径，也没有把上游图标组件翻译过来。 |
| 10 | 没有 `!important` | 过 | `env -u NODE_ENV node scripts/check-no-important.mjs` 退出码 0。 |
| 11 | 台账 62 条都勾上，结论齐全；抽查已采纳和不适用 | 过 | `- [x]` 62 条，没有未勾。结论 62 条：已采纳 46，不适用 16。实现者回报和 PR 写「不适用 13 条」，和台账不符，但不影响台账本身。抽查已采纳：`da6f47086` 的四个样式属性有测试；`75b5af294` 的两个标签 class 有测试和 `FieldLabel` 的 `targetClass`；Home/End 不吸附有 `Slider.parts.test.ts`。不适用的理由都站得住，见下一节。三套 happy-dom 契约的「留到下一轮」不单独否决本条，见文末。 |
| 12 | 上游行为有对应 Vue 测试，两种 NODE_ENV 都通过 | 过 | 样式分层、富文本、End/Home、焦点环、RTL、加载播报都在组件测试里，不依赖把 Chromium 契约逐份搬过来。两种环境都是 17 个文件、186 条。三套模式文件没写，见文末，不把本条打成不过。 |
| 13 | 中英文 props 写了四个样式属性和富文本插槽；中英文复选列表能操作 | 过 | `checkbox-list`、`radio-list`、`slider` 的中英文 props 都有 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`。复选列表和单选列表都写了 `label`、`description` 插槽。英文页 `http://127.0.0.1:5173/en/components/checkbox-list` 标题是 “Checkbox List \| astryx-vue”，点击复选框后从勾选变成未勾选。中文页空格也能切换。 |
| 14 | 本节点组件不在 SSR 已知失败名单 | 过 | 同第 6 条，名单是 `{}`。 |
| 15 | 四种组合的文档站整页都亲眼看过 | 过 | 见「看图」。给用户的图都标了「文档站整页」和 URL。 |
| 16 | 改到的源码不超过 500 行；白名单文件没有变长 | 过 | `node scripts/check-line-limit.mjs` 退出码 0。改到的源码最长是 `styles/switch.css` 237 行。白名单提示里变短的是 DropdownMenu、PowerSearch、Table，不在本节点 diff 里，也没有变长。 |
| 17 | 相关 vitest 两种 NODE_ENV 都通过，用例数相同 | 过 | 路径是 CheckboxInput、CheckboxList、Radio、RadioList、Switch、Slider、SegmentedControl、ToggleButton、Field。`env -u NODE_ENV` 与 `NODE_ENV=production` 都是 17 个文件、186 条，退出码 0，都加了 `--maxWorkers=2`。`vitest.config.ts` 会把 `NODE_ENV` 改成 `test`，所以生产前缀没有真正切到 Vue 的生产运行时；两次用例数相同，符合本条字面要求。没有跑全仓库测试，不能把没跑的写成通过。 |
| 18 | typecheck 和相关 lint 通过 | 过 | `env -u NODE_ENV pnpm typecheck` 退出码 0。相关 Vue 和 TypeScript 的 eslint `--max-warnings 0` 退出码 0。 |
| 19 | diff 没有 layer、ROADMAP、SWARM；生成文件有变化时 sync 检查通过 | 过 | `git diff $BASE --name-only` 没有这些路径。没有公共导出或生成文件变化。`node scripts/sync-exports.mjs --check` 输出「生成结果和已提交文件一致」，退出码 0。 |
| 20 | 源码注释没有修改历史 | 过 | 全 diff 的那条正则命中 4 处，都在台账、回报和验收计划的正文里。`-- '*.vue' '*.ts' '*.css'` 再筛，没有命中。 |

## 看图

下面前 6 张和两张左右对照的右半边都是文档站整页。左右对照的左半边是上游文档站，用来对照控件，不是本仓库页面。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c2-verify-1/checkbox-list-desktop-light.png`（1280×900） | 文档站整页 | `http://127.0.0.1:5173/components/checkbox-list`。浅色。左侧栏和顶栏都在，滚到「全选」。Select all 是半选，Transaction history 已勾选。 |
| `/opt/cursor/artifacts/c2-verify-1/checkbox-list-desktop-dark.png`（1280×900） | 文档站整页 | 同一 URL。深色。侧栏和顶栏都在，滚到「只读、原因和加载」。只读的 CSV 仍勾选，禁用行变灰，加载行有转圈。 |
| `/opt/cursor/artifacts/c2-verify-1/radio-list-desktop-dark.png`（1280×900） | 文档站整页 | `http://127.0.0.1:5173/components/radio-list`。深色。侧栏和顶栏都在，滚到「价格方案」，下面还能看到「带说明」。 |
| `/opt/cursor/artifacts/c2-verify-1/switch-390-light.png`（390×844） | 文档站整页 | `http://127.0.0.1:5173/components/switch`。浅色窄屏。顶上有「菜单」和「返回顶部」，滚到「禁用」。Premium feature 是灰的关着，下面设置面板里 Dark mode 开着。 |
| `/opt/cursor/artifacts/c2-verify-1/slider-390-dark.png`（390×844） | 文档站整页 | `http://127.0.0.1:5173/components/slider`。深色窄屏。顶上有「菜单」，滚到「刻度」。拇指在中间，0 到 100 的刻度都在，下面是校验状态。 |
| `/opt/cursor/artifacts/c2-verify-1/segmented-control-desktop-light.png`（1280×900） | 文档站整页 | `http://127.0.0.1:5173/components/segmented-control`。浅色。侧栏和顶栏都在，滚到「禁用项」。Hourly 选中，Weekly 变灰。下面是撑满布局。 |
| `/opt/cursor/artifacts/c2-verify-1/switch-side-by-side-light.png`（2568×900） | 文档站整页，左为上游 | 左 `https://astryx.atmeta.com/components/Switch`，浅色，有上游侧栏和顶栏，Overview 里一个关着的 Enable notifications，页上写着 v0.7.1。右是本地 `http://127.0.0.1:5173/components/switch`，浅色，有侧栏和顶栏，滚到「设置面板」。两边都是胶囊开关，没有报错或空白。 |
| `/opt/cursor/artifacts/c2-verify-1/slider-side-by-side-light.png`（2568×900） | 文档站整页，左为上游 | 左 `https://astryx.atmeta.com/components/Slider`，浅色，有侧栏和顶栏，Volume 拇指在中间，左段比右段深。右是本地 `http://127.0.0.1:5173/components/slider`，浅色，有侧栏和顶栏，滚到「刻度」，0 到 100 的刻度和中间拇指都在，下面还有红、黄、绿的校验条。 |

没有看到整页空白、骨架屏或报错覆盖层。

## 对实现者偏离计划的判断

1. 根上直接写的 class 和 style 留在外壳，不丢弃、不警告。和上游「丢掉并警告」不同。可接受。`verify.md` 第 8 条要求的就是这个结果。PR https://github.com/astryx-vue/astryx-vue/pull/140 的「给 D7 的说明」写了同一句话。台账 `da6f47086` 的结论也写了。这和 B6 已经定下的做法一致。
2. 滑块测试从「End 之后按左到 99」改成 End 100、左键 96。可接受。`Slider.parts.test.ts` 就是这个结果，和上游先不吸附再按步长走一致。
3. 说明 id 拆出 `CheckboxListControl`，放进行内插槽再读。可接受。富文本说明的 `aria-describedby` 测试通过，原来的已知失败也删了，无障碍测试仍通过。
4. 开关补上状态说明。可接受。已知失败名单里这两条就是交给 C2 的，删掉之后 `Switch.a11y.test.ts` 仍在 186 条里通过。
5. 三套 happy-dom 契约没写。不算本轮偏离到不通过，见下节。

## E3 三套 happy-dom 契约

判定：未完成 / 非本节点阻塞。

`ledger/E3.md` 把 radio-group、toggle-button、slider 的 happy-dom 模式交给 C2。仓库里已有契约框架，以及 button、checkbox、switch 三个模式。`patterns/radio-group.ts`、`patterns/toggle-button.ts`、`patterns/slider.ts` 不存在。C2 台账把对应三条写成不适用，理由是 Chromium 套件不移植，模式文件还不存在，留到下一轮。PR 正文也写了这三套还没写。

`verify.md` 第 12 条写的是：Chromium 契约不必逐份移植，同一条行为要在组件测试里能看到。角色、名字、说明、End、方向键、焦点环、加载播报都在现有 vitest 里。第 11 条要求不适用的理由站得住：Chromium 不移植这一点站得住；「模式文件还不存在」只是工作还没做，不是外部做不了。但验收计划没有把「必须新写这三份模式文件」写成单独的通过条件，所以不因此把 20 条里的某一条打成不过，也不因此把本轮打成不通过。

下一轮若要补：在 `packages/core/test-support/a11y/patterns/` 增加这三个模式和夹具，给 RadioList、SegmentedControl、ToggleButton、Slider 写绑定测试。那不是本轮的返工条件。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

- PR 和回报写「不适用 13 条」。台账实际是 16 条不适用、46 条已采纳。数字应该改成和台账一致。
- 中英文开关 props 写了 `loadingLabel` 跟随语言，没有写标签上的 `astryx-switch-label`。复选框 props 写了对应的 class。行为测试是有的。
- `vitest.config.ts` 会把外部 `NODE_ENV` 改成 `test`。以后若要证明生产构建下的警告被摇掉，需要另开一种不改写 `NODE_ENV` 的跑法。本轮两次用例数相同，第 17 条仍过。
