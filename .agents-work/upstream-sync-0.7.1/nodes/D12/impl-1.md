# D12 演练场模板逐个走查 · 第 1 批实现回报（未完成）

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D12`，分支 `sync/d12-playground-qa`，只在本地提交，没有推送。

## 1. 做了什么（用户点名的 3 条已修）
1. theme-showcase：补上 Inventory 工具栏（搜索框 + Filters + 列表/网格按钮）；Activity 每行补圆形图标；金额改用 `#endContent` 插槽（原 `#end` 在 Item 上不生效，金额不显示）。新增 4 个图标进 `templateIcons.ts`。
2. 图标：dashboard 的 Reload `icon=` 改为 `name=`；仓库里其余 `heroicons:`/`carbon:` 写法逐个看过，都是经过 `<Icon :name>` 渲染的，保持不动。`scripts/check-template-tokens.mjs` 加了 `<Icon icon="前缀:名字">` 检查（已用旧写法验证会报错）。生产构建里 Reload 按钮已渲染出 svg。
3. dashboard-scorecard：趋势图改为 ResizeObserver 量宽，撑满卡片；补 y 轴刻度、x 轴 W1/W4/W8/W12、横向网格、渐变面积、Prior 虚线、平滑曲线。

## 2. 没做完的
16 个模板的逐个走查没有做：dashboard-alert-rail、cohort-funnel、comparison、composition、progress、table、table-page、table-filter、table-grouped、table-collapsible、table-comparison、table-inbox、table-tree，以及 dashboard、theme-showcase 的深色对照。没有写 diff-<slug>.md，也没有原版/我们的拼图。
theme-showcase 还有已知差异未修：Filters 是普通按钮，没有 OverflowList + 三个 Selector；聊天区缺后两轮消息与 ChatComposer（core 没导出 ChatComposer 以外的……见下）；Item/表格在窄宽度下文字被挤压换行（原版截图宽度下需再核对）；scorecard 的 Current 数值 `1244k` 是否与原版一致未核对。

## 3. 自测
| 项 | 结果 |
| --- | --- |
| `pnpm check:templates` | 过（49 个落地，8 个 isReady=false 跳过） |
| eslint playground | 过 |
| check-template-tokens（含新检查） | 过 |
| vitest packages/cli tests | 已运行，未取到汇总行，需复核 |
| 对照图 | 仅 `/tmp/D12-shots/` 下我们这侧的浅色图（dashboard-scorecard、theme-showcase、dashboard），没有拼图 |

## 4. core 问题
无新发现。
