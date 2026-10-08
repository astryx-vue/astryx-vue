---
layout: component-docs
title: 标签列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tabListBasic, tabListDivider, tabListSizes } from '../../../../components/demos/tab-list'
</script>

## 使用方法

`TabList` 把一组 `Tab` 组织成标签页，让用户在同一区域内切换相关内容，常用于设置页、详情页的分区浏览。从独立入口导入组件后，通过 `v-model:value` 控制当前选中项：

```vue
<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('overview')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="overview">
      总览
    </Tab>
    <Tab value="props">
      属性
    </Tab>
    <Tab value="examples">
      示例
    </Tab>
  </TabList>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 组件自带 `role="tablist"`、`role="tab"` 与 `aria-selected` 语义，配合方向键导航，无需额外补齐无障碍属性。 |
| <Badge variant="success">推荐</Badge> | 为每个 `Tab` 提供唯一的 `value`：它是选中状态的标识，也是键盘导航定位标签的依据。 |
| <Badge variant="success">推荐</Badge> | 需要暂时不可用的标签时设置 `disabled`，键盘导航会自动跳过，用户也不会误点。 |
| <Badge variant="error">避免</Badge> | 避免在单个 TabList 中放入过多标签：标签过多会增加查找成本，超出容器时应考虑滚动或重新组织内容。 |
| <Badge variant="error">避免</Badge> | 避免用 TabList 承担页面级导航：标签页适合切换同页内容，跨页面跳转应使用链接或面包屑。 |

## 示例

<DemoExample
  :demo="tabListBasic"
  description="最基础的用法：点击标签即切换选中项，v-model:value 会同步更新。"
  locale="zh"
  title="基础用法"
/>

<DemoExample
  :demo="tabListSizes"
  description="标签提供 sm、md、lg 三种尺寸，根据所在页面的层次和信息密度选择即可。"
  locale="zh"
  title="尺寸"
/>

<DemoExample
  :demo="tabListDivider"
  description="开启 has-divider 后，标签列表底部会显示一条分隔线，让标签区与下方内容的分层更清晰。"
  locale="zh"
  title="带分隔线"
/>
