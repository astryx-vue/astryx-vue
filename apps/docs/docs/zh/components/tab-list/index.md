---
layout: component-docs
title: 标签列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tabListActions, tabListBadges, tabListFill, tabListIcons, tabListOverflow, tabListStatus } from '../../../../components/demos/tab-list'
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


<ComponentAnatomy />

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
  :demo="tabListFill"
  description="layout 设为 fill 后，标签平分整行宽度，底下再加一条分隔线。"
  locale="zh"
  title="撑满宽度"
/>

<DemoExample
  :demo="tabListActions"
  description="标签靠左，筛选和新建按钮靠右。底部分隔线打开时，按钮尺寸跟标签一致。"
  locale="zh"
  title="带操作"
/>

<DemoExample
  :demo="tabListBadges"
  description="标签文字后面放徽标。需要马上处理的数量用 error，普通计数用 neutral。"
  locale="zh"
  title="带徽标"
/>

<DemoExample
  :demo="tabListIcons"
  description="标签文字前面放一个图标，用来区分页面。"
  locale="zh"
  title="带图标"
/>

<DemoExample
  :demo="tabListOverflow"
  description="放不下的标签收进 TabMenu。选中菜单里的一项后，它会成为当前标签。"
  locale="zh"
  title="溢出菜单"
/>

<DemoExample
  :demo="tabListStatus"
  description="标签文字后面放状态点，一眼看出环境是否正常。"
  locale="zh"
  title="带状态点"
/>
