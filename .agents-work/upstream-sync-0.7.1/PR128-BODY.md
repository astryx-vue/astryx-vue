## 背景

astryx-vue 正在追上游 [Astryx](https://github.com/facebook/astryx) v0.7.1。这个 Draft PR 的方向是 `swarm-tree` → `dev`：节点先合进 `swarm-tree`，任务树走完、迁移说明就绪后再进 `dev`。

图例：✅已完成 · 🟡实现中 · 🔷验收中 · 🔵可开工 · ⬜未开始

> 本描述由总控整篇覆盖。不要在标记块外再贴一份，也不要把旧表接在后面。

## 进度

```mermaid
mindmap
  root((追上游 v0.7.1))
    阶段 A 准备
      ✅ A1 台账
      ✅ A2 视觉对照
      ✅ A3 工程护栏
      ✅ A4 蜂群基建
    阶段 B 公共底座
      ✅ B1 主题与 token
      ✅ B2 reset
      ✅ B3 交互底座
      ✅ B4 浮层 Layer
      ✅ B4-fix 关闭顺序
      ✅ B5 文案与图标
      ✅ B6 公共 props
      ✅ B7 工具函数
    阶段 C 组件
      ✅ C1 基础输入
      ✅ C2 勾选与开关
      ✅ C3 选择器
      🟡 C4 搜索与命令面板 修 catalog
      🟡 C5 日期时间 返工
      ✅ C6 菜单
      ✅ C7 浮层家族
      ✅ C8 BottomSheet
      ✅ C9 Markdown 与代码
      ✅ C9-exports Markdown 导出
      ✅ C10 Chat
      🔵 C11 表格
      🔵 C12 列表与树
      🔵 C13 导航
      ✅ C14 布局与容器
      ✅ C15 反馈与状态
      ✅ C16 展示与动作
    阶段 D 汇总
      🔵 D1 Neutral 底色
      🔵 D4a CLI 取舍需签字
      ⬜ D2 至 D8 其余
    阶段 E 工程质量
      ✅ E1 E2 E3 E4
    阶段 F 新包
      ✅ F0 选型 ADR
      🔵 F1a richtext 纯逻辑
      🔵 F2a charts 纯逻辑
      🔵 F3b lab 展示类
      🔵 F3c lab 浮层与引导
      🔵 F3e lab 对话
      🔵 F3g lab 日程表
      🔵 F3h lab 代码类
      ⬜ F1b 与其余 F 节点
```

## 本轮已合入

| 节点 | PR | 说明 |
| --- | --- | --- |
| C8 BottomSheet | [#157](https://github.com/astryx-vue/astryx-vue/pull/157) | squash 合入 `swarm-tree`（`56fee620`）。验收通过 21/21。默认内边距交给内容区，拖动手势已拆开 |
| 子菜单 SSR、catalog 门禁、浮层 window | [#156](https://github.com/astryx-vue/astryx-vue/pull/156) | 不是总表节点。收掉 `HTMLElement is not defined`、当时过期的 catalog，以及 `window is not defined` |

## 当前并行

| 节点 | PR | 状态 |
| --- | --- | --- |
| C5 日期时间家族 | [#158](https://github.com/astryx-vue/astryx-vue/pull/158) | 返工。touch 路径的 change 没有触发，`isReadOnly` 漏锁 |
| C4 搜索与命令面板 | [#159](https://github.com/astryx-vue/astryx-vue/pull/159) | 修 catalog 与冲突，CI 还在修 |

可以开工、等待派发：C11、C12、C13、D1、F1a、F2a、F3b、F3c、F3e、F3g、F3h。C8 合入后 F3a 仍要等 C11、C12，保持未开始。D4a 仍要等用户签字，签字前不要派。
