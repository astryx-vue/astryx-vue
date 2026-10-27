---
title: 响应式布局
---

# 响应式布局

合理的响应式设计应当根据屏幕尺寸调整信息层级，而不是等比压缩元素尺寸。在构建界面前，需规划各区域在窄屏下的呈现形式：辅助区域可以收窄或转入按需展开的抽屉浮层，次要内容可直接隐藏，避免由于空间挤压导致排版混乱。

## 页面外壳（AppShell）断点配置

`AppShell` 的 `mobileNav.breakpoint` 决定侧边导航（SideNav）在何种视口宽度下自动折叠为移动端抽屉，默认断点为 `md`。

| 选项值 | 触发宽度 | 说明 |
| --- | --- | --- |
| `sm` | 640px | 仅在超小手机屏幕上折叠 |
| `md` | 768px | 平板及以下屏幕折叠（默认推荐） |
| `lg` | 1024px | 小屏笔记本或横屏平板以下折叠 |
| `xl` | 1280px | 普通桌面屏幕以下折叠 |
| `2xl` | 1536px | 大屏幕以下折叠 |
| `none` | 不收起 | 始终保持左侧栏常驻，不使用移动端抽屉 |

当视口宽度小于所设断点时，常驻侧边栏将收起，由导航触发按钮与弹出抽屉承载。同属于该外壳的顶栏会复用该抽屉，避免重复生成弹层。若传入 `:mobile-nav="false"`，则完全禁用移动端抽屉行为。

在 `AppShell` 内部的子组件中，可调用 `useAppShellMobile()` 组合式函数，读取当前是否处于移动端窄屏状态以及抽屉的打开状态。

## 内容版心与布局（Layout）

`Layout` 将页面结构划分为：页眉（header）、起始侧（start）、主要内容（content）、结束侧（end）和页脚（footer）等插槽。

- **行长约束**：文本过长会增加视线换行负担。`Layout` 提供了 `contentWidth` 属性（单位为像素），可直接约束主体正文区域的宽度，同时保持外层分隔线通栏延伸。
- **侧边面板自适应**：放置在结束插槽（end slot）中的 `LayoutPanel` 常用作条目详情面板。在窄屏下可通过条件渲染将其隐藏，改为通过弹窗或底部抽屉按需呈现。

```vue
<script setup lang="ts">
import { useMediaQuery } from '@astryx-vue/core'
import { AppShell } from '@astryx-vue/core/AppShell'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'

// 监听屏幕是否小于 1024px
const isNarrow = useMediaQuery('(max-width: 1024px)')
</script>

<template>
  <AppShell :mobile-nav="{ breakpoint: 'md' }">
    <template #sideNav>
      <SideNav>
        <SideNavItem href="/orders" label="订单" />
      </SideNav>
    </template>

    <Layout :content-width="720">
      <LayoutContent>
        <p>订单列表</p>
      </LayoutContent>

      <!-- 仅在宽屏展示右侧面板，窄屏时隐藏以保证阅读体验 -->
      <template v-if="!isNarrow" #end>
        <LayoutPanel :width="380" has-divider>
          <p>订单详情</p>
        </LayoutPanel>
      </template>
    </Layout>
  </AppShell>
</template>
```

在该示例中：
1. 视口宽于 1024px 时，展示三栏结构：侧边导航、正文内容区与 380px 右侧面板；
2. 宽度小于 1024px 时，右侧面板隐藏，正文独占内容区；详情内容可通过 [Dialog](/components/dialog) 或 [BottomSheet](/components/bottom-sheet) 打开；
3. 视口小于 `md`（768px）时，侧边导航自动折叠至移动端抽屉中。

`useMediaQuery` 在 setup 初始化阶段会计算初始匹配状态，并在视口缩放时触发响应式更新。

## 动态换行的网格布局（Grid）

`Grid` 组件的 `columns` 属性若传入固定数值（例如 `:columns="7"`），在窄屏下仍会严格按照该列数排列（适用于周日历等固定表格场景）。

若需网格根据容器可用宽度自动计算列数，可传入 `{ minWidth, max }` 配置对象：
- `minWidth`：单列最小允许宽度（单位为像素）；
- `max`：最大允许排列的列数。

当容器空间不足以容纳下一列时，组件会自动减少一列并将元素顺延换行；当缩减至单列时，卡片宽度自动铺满容器。`gap` 属性设置的间距也会参与列宽的计算。

```vue
<!-- 宽屏时最多 4 列，屏幕变窄时自动减少列数换行 -->
<Grid :columns="{ minWidth: 240, max: 4 }" :gap="3">
  <!-- 卡片内容 -->
</Grid>

<!-- 一周 7 天的日历视图，每一档宽度都保持固定的 7 列 -->
<Grid :columns="7" :gap="1">
  <!-- 日期内容 -->
</Grid>
```

此外，可通过 `repeat` 属性调整未填满整行时的排列策略：
- `repeat="fill"`（默认值）：保留空白列占位，保持各列卡片宽度一致。
- `repeat="fit"`：收缩未使用的空列，已有卡片等宽拉伸以填满当前行。
