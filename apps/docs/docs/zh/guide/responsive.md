---
title: 响应式布局
---

# 响应式布局

良好的响应式设计应当顺应内容，而不是生硬地等比压缩。在开始搭界面之前，先思考各个区块在屏幕变窄时应当如何演变：某些辅助区域可以留下来并适当收缩；某些可以暂时收进按需展开的抽屉浮层中；而某些不关键的次要内容则可以直接隐藏。当三栏内容并排太挤时，应果断把次要的一栏收起或折叠，绝不要把文字和按钮压得面目全非。

## 页面外壳（AppShell）断点设置

`AppShell` 的 `mobileNav.breakpoint` 决定了侧边导航栏（SideNav）在什么时候自动折叠进移动端抽屉里。默认的折叠断点是 `md`。

| 选项值 | 触发宽度 | 说明 |
| --- | --- | --- |
| `sm` | 640px | 仅在超小手机屏幕上折叠 |
| `md` | 768px | 平板及以下屏幕折叠（默认推荐） |
| `lg` | 1024px | 小屏笔记本或横屏平板以下折叠 |
| `xl` | 1280px | 普通桌面屏幕以下折叠 |
| `2xl` | 1536px | 大屏幕以下折叠 |
| `none` | 不收起 | 始终保持左侧栏常驻，不使用移动端抽屉 |

当视口宽度小于所设断点时，原本常驻的左侧栏会移出主版面，转由汉堡按钮和呼出的抽屉来接管。同属于一个外壳内的顶栏也会复用这只抽屉，避免重复生成弹层。如果传入 `:mobile-nav="false"`，则完全关闭移动端抽屉行为。

在 `AppShell` 内部的任何子组件里，你都可以随时调用 `useAppShellMobile()` 组合式函数，实时读取当前是否处于窄屏移动状态，以及抽屉是否正处于打开状态。

## 内容版心与布局（Layout）

`Layout` 负责把页面的布局结构清晰切分为：页眉（header）、起始侧（start）、主要内容（content）、结束侧（end）和页脚（footer）等插槽。

- **舒适阅读宽度**：通常一行正文文本在 40 到 60 个中文字符（或 60 到 80 个英文字符）时人眼读起来最不容易疲劳。`Layout` 提供了 `contentWidth` 属性（单位是像素），能方便地限制中间正文栏的宽度，同时保持上下的分隔线横向拉通铺满，无需在每个段落里层层包裹容器。
- **自适应侧面板**：放在结束插槽（end slot）里的 `LayoutPanel` 经常用来展示选中的条目详情。当屏幕变窄空间不够时，可以借助条件渲染在窄屏时隐藏它，改为需要时通过弹窗或底部抽屉查看。

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

在这个例子里：
1. 当屏幕宽于 1024px 时，呈现舒适的三栏结构：侧导航、正文、380px 的右侧面板；
2. 宽度小于 1024px 时，右侧面板优雅退场，腾出完整空间显示正文；需要看详情时可通过 [Dialog](/components/dialog) 或 [BottomSheet](/components/bottom-sheet) 调出；
3. 进一步变窄到 `md`（768px）以下时，侧导航自动收录到移动端抽屉里。

`useMediaQuery` 在组件 setup 初始化时就会同步计算一次状态，并在窗口缩放时平滑响应。

## 自动换行的网格布局（Grid）

`Grid` 组件的 `columns` 属性如果直接写成固定的数字，例如 `:columns="7"`，那么即便在屏幕极窄的手机上，它也依旧会死板地强行挤成 7 列（适合用来做固定星期的日历排版）。

如果你希望网格能根据容器宽度自动增减列数，可以传入 `{ minWidth, max }` 配置对象：
- `minWidth`：每列最小允许的宽度（像素）；
- `max`：最多允许排成多少列。

容器放不下更多列时会自动少一列，并把剩余卡片顺延换行；当缩窄到只剩一列时，卡片宽度会自动伸展填满整个容器。`gap` 属性设置的卡片间隙，也会被精准计算进列宽的容量判断中。

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

此外，你还可以通过 `repeat` 属性控制未填满时的排版策略：
- `repeat="fill"`（默认值）：保留空列占位，确保每一列的卡片都保持相同宽度。
- `repeat="fit"`：收起多余的空列，让已有的卡片均分并撑满整行空间。
