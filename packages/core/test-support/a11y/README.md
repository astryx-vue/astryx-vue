# 可访问性交互契约

这里放组件的「交互契约」测试工具。只给本仓库的测试用：不在 `src/` 里，不会被 tsdown 打包，`package.json` 的 `files` 也不含它。

思路照搬上游 `internal/a11y-spec`（见上游 `docs/specs/AST-020`、`AST-021`）：**一个交互模式只写一次契约，组件去绑定它。**

## 为什么要契约

拿开关举例。所有开关都欠用户同一组东西：读屏软件把它报成 switch、它有名字、开关状态对外暴露且和画面一致、鼠标和键盘都能来回切换、切换时焦点不乱跳。每个组件各写一遍，理解会慢慢走样。

所以把要求写成数据（`patterns/switch.ts`），组件只声明「我有哪些状态、每个状态应该是什么样」（facts），契约去问实际暴露出来的是不是这样。

## 文件

```
a11y/
├── checklist.ts      每个契约必须逐条回答的 29 个维度（WCAG 2.2 A/AA + APG + 强制配色等）
├── contract.ts       期望、模式契约，以及把关的 definePattern
├── harness.ts        证据层和运行环境接口
├── check.ts          运行器：一个契约 × 一个组件的一个状态 → 每条期望的结果
├── report.ts         计数、门槛、失败说明
├── expect.ts         给组件测试用的断言入口
├── vue.ts            describeBinding：Vue 组件绑定的公共写法
├── known-failures.ts 已知失败名单（组件现在做不到的条目）
├── harness/happy-dom.ts   vitest 里的快速通道
├── fixtures.ts / self-test.ts   契约自测的夹具类型和公共驱动
└── patterns/
    ├── button.ts、checkbox.ts、switch.ts       三个契约
    ├── *.fixtures.ts                           每个契约的合格/违规夹具
    ├── shared.ts、exemptions.ts                三个契约共用的期望实现和清单豁免
    └── contracts.test.ts                       契约自测
```

组件绑定放在组件旁边：`src/Button/Button.a11y.test.ts`、`src/CheckboxInput/Checkbox.a11y.test.ts`、`src/Switch/Switch.a11y.test.ts`。

## 证据层

每条期望说明自己的主张属于哪一层，还要读哪些层。环境声明自己看得见哪些层，看不见的就报 `unrun`，绝不报通过。

| 层 | 含义 | happy-dom 通道 |
| --- | --- | --- |
| `dom` | 属性的原始写法、id 引用 | 直接看 |
| `computed-dom` | 用 dom-accessibility-api 按 W3C 规则从 DOM 推算角色、名称、描述、状态 | 直接看 |
| `accessibility-tree` | 浏览器真正算出的可访问性树 | 用 `computed-dom` 近似，结果标「近似」 |
| `real-browser` | 真实焦点、按键激活、指针按下滑开、布局可见性 | 看不见，报 `unrun` |

和上游的区别：上游的 jsdom 通道把可访问性树整层报成 unrun，只跑 DOM 层。我们多加了 `computed-dom` 近似层，这样「Switch 的 role 被改坏」「说明文字没挂上」这类问题在 `pnpm check` 里就能抓到。推算和浏览器的结果有出入的地方（比如 Chromium 对必填但没勾的复选框报 invalid），在 `harness/happy-dom.ts` 里按 HTML-AAM 补齐；剩下的出入等浏览器通道接上后由真实可访问性树复核。

## 结果状态

| 状态 | 含义 | 会让测试失败吗 |
| --- | --- | --- |
| `pass` | 观察到了 | 否 |
| `fail` | 没观察到 | `required` 的会 |
| `known-failure` | 名单里一字不差的已知失败 | 否 |
| `unexpected-pass` | 名单里的条目现在通过了，该删了 | 会 |
| `not-applicable` | 这个状态用不上这条 | 否 |
| `unrun` | 环境看不见需要的层 | 否 |

## 绑定一个组件

```ts
describeBinding({
  spec: SWITCH_PATTERN,
  binding: 'Switch',
  role: 'switch',
  states: [
    { id: 'off', summary: '默认', facts: { checked: false, operable: true, /* ... */ }, render: () => controlled(Switch, 'modelValue', false, { label: 'Notify' }) },
  ],
  knownFailures: A11Y_KNOWN_FAILURES,
})
```

`facts` 写的是「应该是什么样」，照上游绑定的声明来写。组件做不到时不要改 facts 去迁就，而是让契约失败，再把失败记进 `known-failures.ts`，写清楚用户会碰到什么、由哪个节点来修。

## 以后怎么接浏览器通道

接口已经留好：`Harness.observes` 加上 `accessibility-tree` 和 `real-browser`，实现 `click`、`abortedPress`、`press`、`resetFocus`、`Subject.computed`、`visibleLabelText`、`isFocused`、`focus` 即可。建议做法：

1. 新建 `harness/chromium.ts`，用 Playwright 打开一个只渲染单个组件状态的页面（可以用 Vite 起一个小的测试页，复用 `vue.ts` 里的状态清单），`computed()` 读 CDP 的 `Accessibility.getPartialAXTree`，按键和指针用 Playwright 的 `keyboard`、`mouse`。
2. 加一个 `*.chromium.spec.ts` 入口，复用同样的 `states` 和契约，`harness` 换成 Chromium。走 `scripts/swarm/browser-lock.mjs` 拿锁，不接进 `pnpm check`。
3. 已知失败按 `harness` 字段区分，Chromium 通道的记录写 `harness: 'chromium'`。
