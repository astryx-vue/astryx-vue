# B4 第 3 轮返工计划

第 2 轮验收结果：第 26 项不过，其余都过。完整报告见 `nodes/B4/verify-2.md`，重点看「第 26 项展开」和「第 22 项展开」两节。

这一轮修两件事。第 1 件是验收不过的项，第 2 件是总控复核时补的项。

## 第 1 件（必修）：按子路径引入组件时，浮层的文字重置不生效

**现象**：README 推荐用户按子路径引入组件，比如 `import { Popover } from '@astryx-vue/core/Popover'`，这样不会加载总的 `styles.css`。可是浮层根元素用到的 `.astryx-layer` 和那串 `:where()` 选择器，都只写在 `styles/layer.css` 里，而 `layer.css` 只被 `styles.css` 引入。结果按子路径引入时，浮层里的文字会继承外层的粗体、大写、居中。验收用一个最小的 Vite 页面实测复现了这个问题，复现方法见 verify-2.md 的「第 26 项展开」。

**怎么修**：要保证只要用到了任何一个浮层组件，`layer.css` 就一定会被加载。

- 先看清楚浮层根元素是在哪里渲染出来的。可以 grep `layer/mount.ts`、`composables/useLayer.ts`，以及 layer.css 选择器里列出的那些组件。
- 然后选一个最稳妥的办法。可以在所有浮层都会经过的公共模块里写一次 `import '../../styles/layer.css'`，比如 `useLayer.ts` 或 `layer/mount.ts`；也可以在每个浮层根组件里各写一次（和组件 import 自己的样式是同一种写法）。
- **关键**：构建出来的 `packages/core/dist` 里也必须保留这个 import。改完以后运行 `env -u NODE_ENV pnpm --filter @astryx-vue/core build`，然后 grep dist，确认对应的产物里有 `layer.css` 的 import，并且 `layer.css` 文件本身也被复制进了 dist。
- 加一个守护测试：遍历 layer.css 选择器里列出的每一个类名，找出在模板里用到这个类的组件，断言它能沿着 import 链走到 `layer.css`（直接 import 它，或者 import 了那个公共模块）。这样以后新增浮层就不会漏掉。具体写法自己定，原则是简单可靠。
- 照验收的方法自己搭一个最小页面复测：页面里只用子路径引入，外层设置粗体、大写、居中、字距、斜体，Popover 和 Dialog 里的文字都不继承这些样式。要截图。

## 第 2 件（必修）：TabList 和 Stepper 的 context 也要在浮层边界截断

**现象**：上游的 `layerScopedContext.test.tsx` 第 309 行明确断言了：在浮层里面、本地又没有 TabList 时，`use(TabListContext)` 是 `null`；StepperContext 在第 390 行，同样是 `null`。我们这里没有截断。验收实测发现，放在 Popover 里的 `Tab` 读到了外面 TabList 的尺寸和选中值，还往外面那个 TabList 注册了自己；`Step` 也读到了外面 Stepper 的状态。

**怎么修**：

- 把 `Tab.vue`、`TabMenu.vue`、`Step.vue`（以及其他读取这两个 context 的组件，自己 grep 一下）的 `inject(key)` 改成 `inject(key, null)`。
- 拿到 `null` 时，照上游的做法给出明确的报错：上游的 `useTabListContext` 遇到 null 会 throw「must be used within TabList」。最好收进一个 `useTabListContext()` / `useStepperContext()` 辅助函数里。
- 然后在 `scopedProvide.ts` 里登记这两个 context。
- **小心 TabMenu**：TabMenu 的下拉内容本身就渲染在浮层里，它需要读外面 TabList 的值。上游的 TabMenu 在组件顶层（也就是浮层外面）读取 context，再把值往下传。我们也要这样做：在 TabMenu 的 setup 顶层读一次，下拉里面的内容不再自己 inject。改完以后，文档站 TabList 页面上带 TabMenu 的示例必须照常工作。要在浏览器里实测：点开下拉、选一项、选中状态同步正确。
- 写测试，照上游那两段测试的做法：
  - 浮层里没有本地 TabList / Stepper 时，读到的是 null；
  - 浮层里放了本地的 TabList / Stepper 时，读到的是本地的值；
  - TabMenu 在 TabList 里正常工作。
- 更新 impl-2.md 对照表里第 23、24 行的结论，把新的结论写进 impl-3.md，并同步更新台账 #6457 那一条。

## 自查

- 运行 `env -u NODE_ENV pnpm check`，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`，必须通过。两种 NODE_ENV 下 vitest 都要通过，用例数要一样。
- 回报写到 `nodes/B4/impl-3.md`。
