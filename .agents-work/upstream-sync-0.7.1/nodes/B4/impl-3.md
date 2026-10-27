# B4 第 3 轮返工回报

分支 sync/b4-layer，工作区 astryx-vue-wt/B4。3 个提交，没有推送。

## 第 1 件：按子路径引入时文字重置生效

**做法**：`layer.css` 由浮层组件自己 import，不再只靠总的 `styles.css`。

- `layer/scopedProvide.ts` import 了 `layer.css`。所有浮层都经过 `LayerContentBoundary` 或 `resetLayerScopedContext`，所以 Popover、Tooltip、HoverCard、DropdownMenu、ContextMenu、Dialog、Toast、Lightbox、MobileNav、BottomSheet 都会带上。
- 没经过 scopedProvide 的三处直接 import：`Selector.vue`、`Chat/ChatTriggerMenu.vue`、`TabList/TabMenu.vue`。
- 守护测试 `layer/layerCss.test.ts`（11 条）：读 `layer.css` 里 `:where()` 列出的每个类名，找模板里用到它的 `.vue`，断言能沿 import 链走到 `layer.css`。把 Selector、TabMenu 的 import 拿掉后，测试会失败（验证过）。
- 构建产物：`dist/Chat-*.js`、`Selector-*.js`、`TabList-*.js`、`scopedProvide-*.js` 里都有 `import "../styles/layer.css"`。`styles/layer.css` 本身在 `files` 里，随包发布。

**浏览器复测**（`/tmp/r3-sub`，只按子路径引入，不引 `styles.css`；外层 `font-weight:700; uppercase; center; letter-spacing:4px; italic; 32px; red`）：

| 位置 | 计算样式（字重 / 字距 / 大小写 / 对齐 / 斜体 / 字号 / 颜色） |
| --- | --- |
| Popover 根与内容 | `400 / normal / none / start / normal / 14px / rgb(23,23,23)` |
| Dialog 根与内容 | 同上 |
| TabMenu 下拉 | 同上 |

控制台无报错。截图在 `nodes/B4/impl-3-shots/`：`shot-pop.png`、`shot-dlg.png`、`shot-tab-open.png`、`shot-tab-reopen.png`。

## 第 2 件：TabList、Stepper 的 context 在浮层边界截断

- `TabList/context.ts` 新增 `useTabListContext()`，`Stepper/context.ts` 新增 `useStepperContext()`。拿到 null 就 throw（文案同上游：must be used within TabList / Stepper）。两个 key 的类型改成 `T | null`。
- `Tab.vue`、`TabMenu.vue`、`Step.vue` 改用这两个函数，去掉所有 `context?.` 兜底。
- `scopedProvide.ts` 登记 `tabListContextKey`、`stepperContextKey`，重置值是 null。共 23 个。
- TabMenu 的下拉本来就在同一个组件里，`context` 在 setup 顶层读一次，下拉模板直接用这个值，不另外 inject。所以不用改结构。
- 测试 `layer/scopedProvide.tabStepper.test.ts`（6 条）：
  - 两个 key 已登记。
  - Popover 里没有本地 TabList / Stepper 时，Tab / Step 在 setup 抛上述错误。
  - Popover 里有本地 TabList / Stepper 时，读到的是本地的值（size、选中、progress、orientation）。
  - TabMenu 在 TabList 里：下拉的选中状态正确。
- 文档站实测（端口 5172，TabList 页「溢出菜单」）：点开下拉，三项；选 Billing，触发器变成 Billing 且带 `astryx-tab--selected`；再点开，Billing 为 `aria-checked=true`，其余 false。控制台没有和本改动相关的报错；有一条 vitepress 开发服务器动态导入 `index.md` 的 MIME 报错，是 `vitepress dev` 在页面加载过程中的模块热更新，不影响示例，也不在本次改动范围。截图 `docs-open.png`、`docs-reopen.png`。

## 对照表更新（接 impl-2.md 第 23、24 行）

| # | 上游 | 我们的 key | 新结论 |
| --- | --- | --- | --- |
| 23 | `Stepper/StepperContext` | `stepperContextKey` | **截断**，重置值 null。`Step` 走 `useStepperContext()`，没有本地 Stepper 就报错，和上游一致。 |
| 24 | `TabList/TabListContext` | `tabListContextKey` | **截断**，重置值 null。`Tab`、`TabMenu` 走 `useTabListContext()`。`TabMenu` 在顶层读，下拉内容用它读到的值。 |

截断总数 21 变 23。台账 #6457 已更新（`ledger/B4.md`，在工作区里提交）：23 个 context 清单、TabList / Stepper 改为截断、`layer.css` 由组件自己加载。

## 自查

- `pnpm check:packages`、`pnpm lint`、`pnpm typecheck`、`pnpm build`、`pnpm lint:pkg` 都通过。
- vitest `--maxWorkers=2`：不设 NODE_ENV 与 `NODE_ENV=production` 两种下都是 250 文件、3339 条，全部通过。
- 浏览器：每次只开 1 个，通过 browser-lock，用完已关；5172 端口已释放。

## 注意

- `Tab` 和 `Step` 现在在 TabList / Stepper 外面使用会直接报错（之前是静默用默认值）。这和上游一致，是行为变化。
- 行数检查脚本提示 `DropdownMenu.vue`、`TableData.vue` 白名单可以收紧，与本轮无关，没动。
