---
title: 响应式布局
---

# 响应式布局

先定每个区域在变窄时做什么，再写组件。一个区域可以留下来并变窄，可以收到按需打开的层里，也可以直接拿掉。三个区域挤在同一行、谁都放不开时，拿掉一个，不要把它们等比缩小。

## 外壳的断点

`AppShell` 的 `mobileNav.breakpoint` 决定侧栏什么时候收进抽屉。默认是 `md`。

| 值 | 宽度 |
| --- | --- |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |
| `none` | 不收起 |

窄于这个宽度时，侧栏离开页面，抽屉接管。同一只外壳里的顶栏用这只抽屉，不再自己打开另一只。`mobileNav` 设成 `false` 就关掉。外壳里面可以用 `useAppShellMobile()` 读到现在是不是窄屏，以及抽屉开没开。它从 `@astryx-vue/core` 引入。

## 内容区

`Layout` 把页眉、起始、内容、结束、页脚分成槽。`contentWidth` 限制正文这一列有多宽，分隔线仍然拉满。数字是像素。一行正文大约 40 到 60 个字符时最好读，列宽用这个属性卡住，而不是让每一节自己再包一层容器。

结束槽里的 `LayoutPanel` 用 `width` 占掉固定的一列。变窄以后这一列没有地方时，不要把它和侧栏一起留在页面上。

```vue
<script setup lang="ts">
import { useMediaQuery } from '@astryx-vue/core'
import { AppShell } from '@astryx-vue/core/AppShell'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'

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
        <p>订单</p>
      </LayoutContent>
      <template v-if="!isNarrow" #end>
        <LayoutPanel :width="380" has-divider>
          <p>详情</p>
        </LayoutPanel>
      </template>
    </Layout>
  </AppShell>
</template>
```

宽于 1024px 时是三列：侧栏、正文、380px 的侧面板。到了 1024px，侧面板离开这一行，需要时再用 [Dialog](/components/dialog) 或 [BottomSheet](/components/bottom-sheet) 打开。到了 `md`（768px），侧栏收进外壳的抽屉。`useMediaQuery` 在 setup 时就读一次当前是否匹配，之后跟着变。

## 会重排的列

`Grid` 的 `columns` 写成数字时，每一档宽度都是那么多列，不会自己减少。`:columns="7"` 在手机上仍是七列。要随宽度减少列数，写成 `{ minWidth, max }`。`minWidth` 是每一列至少多少像素，`max` 是最多几列。放不下 `minWidth` 时会少一列；窄到一列时，这一列可以缩到容器宽度。`gap` 占掉列与列之间的空间，算进能不能再放一列。

```vue
<Grid :columns="{ minWidth: 240, max: 4 }" :gap="3">
  <!-- 宽的时候四列，窄的时候减少 -->
</Grid>

<Grid :columns="7" :gap="1">
  <!-- 一周七天，每一档都是七列 -->
</Grid>
```

同一份列配置里，`repeat` 为 `fit` 时，排不满的空列会收掉，已有的列把这一行撑满。默认 `fill` 会留下那些空列，让每一列保持同样的宽度。
