---
title: 应用模式
---

<script setup lang="ts">
import { chatPatternConversation, chatPatternLanding } from '../../../components/demos/chat'
</script>

# 应用模式

在复杂应用（尤其是 AI 产品）中，页面通常由多个协同组件组成。在 astryx-vue 中，消息气泡、推理过程、工具调用（Tool Calls）、引用标记及底部输入框等均为独立的模块化组件，可按需组合使用。

组件库专注于前端交互与界面呈现，不绑定具体的大语言模型与后端接口。内容可通过插槽传入，长文本支持配合 Markdown 组件排版，信息来源可通过引用组件标注。

## 场景一：初始落地页（无聊天记录时）

在会话尚未开始时，页面通常包含问候引导及多功能输入区：
- 支持切换模式，例如写作、编程、深度研究或艺术创作；
- 包含安全性或推理深度的条件胶囊标记；
- 输入 `@` 可唤起人物或知识库提及菜单，输入 `/` 可触发快捷命令列表；
- 支持在抽屉中添加附件，超长文本粘贴时自动收纳为卡片预览；
- 浏览器支持语音录入时显示麦克风录音按钮；
- 点击下方推荐的提示词卡片，建议内容自动填充至输入框。

## 场景二：对话进行中（有聊天往来时）

会话开始后，顶部为独立滚动的历史消息列表，底部固定为输入区域：
- 模型生成内容期间，发送按钮自动切换为「停止生成」，当前消息状态显示为输出中；
- 思考推理过程支持折叠与展开切换；
- 工具调用状态从「正在运行」过渡为「调用完成」；
- 回答中的数字引用角标可对应至底层引用来源；
- 生成的长篇内容可展示为文档卡片，点击支持在侧面板或弹窗中展开。

在宽屏桌面端，支持将参考文档放置于右侧可拖拽调整宽度的侧面板中；视口宽度小于 768px 时，自动转换为全屏浮层呈现。

## 交互演示

可直接在下方两套预设模式中体验交互。全屏完整效果请见演练场：[AI 对话落地页](/playground/?template=ai-chat-landing) 与 [AI 对话](/playground/?template=ai-chat)。子组件的属性说明见 [对话组件](/components/chat)。

<DemoExample
  :demo="chatPatternLanding"
  description="包含问候语、模式切换、提及、命令、附件抽屉与分类建议卡片。点击建议卡片，会自动将建议文本填入输入框并切入对应模式。"
  locale="zh"
  title="落地页模式"
/>

<DemoExample
  :demo="chatPatternConversation"
  description="消息流中集成了深度推理、工具调用、引用角标以及生成的文档卡片。生成过程中支持随时点击停止，点击文档卡片可在弹窗中查看。"
  locale="zh"
  title="会话模式"
/>

## 固定页眉与页脚

当正文内容较长时，若页眉和提交按钮随页面滚动移出视口，会增加回滚查找的操作成本。`Layout` 的 `height` 默认取值为 `fill`：撑满父容器高度，主体正文在中间独立滚动，页眉与页脚保持固定。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'

const rows = [/* 很长的列表 */]
</script>

<template>
  <Layout :padding="4" default-has-dividers>
    <template #header>
      <LayoutHeader>订单</LayoutHeader>
    </template>

    <LayoutContent>
      <OrderRow v-for="row in rows" :key="row.id" v-bind="row" />
    </LayoutContent>

    <template #footer>
      <LayoutFooter>
        <Button label="保存" />
        <Button label="取消" variant="secondary" />
      </LayoutFooter>
    </template>
  </Layout>
</template>
```

使用要点：

- `padding` 统一在 `Layout` 上声明，页眉、正文、页脚共享相同的左右内边距基准，保证文本垂直对齐。
- `defaultHasDividers` 可统一为页眉和页脚开启上下分割线，无需单独声明 `hasDivider`。
- 页眉若包含标题及单一操作，使用 `LayoutHeader`；若需要放置筛选、排序等多个交互控件，应使用 `Toolbar`，该组件符合工具栏标准的键盘导航规范。
- 页脚建议仅保留保存、提交等关键核心动作，次要操作置于正文区域内。

验证方式：将正文滚动至底部，观察页眉与页脚是否保持固定，分割线是否贯穿全宽，以及标题与正文左边界是否对齐。

## 侧边详情面板

在主从详情结构中，点击单行条目直接跳转新页面会打断上下文浏览。推荐在主体列表右侧开启固定宽度的侧面板展示详情，保持列表位置不变。

```vue
<script setup lang="ts">
import { EmptyState } from '@astryx-vue/core/EmptyState'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { ref } from 'vue'

const selected = ref<Order | null>(null)
</script>

<template>
  <Layout>
    <LayoutContent>
      <OrderRow
        v-for="row in rows"
        :key="row.id"
        v-bind="row"
        @select="selected = row"
      />
    </LayoutContent>

    <template #end>
      <LayoutPanel :width="380" has-divider is-scrollable label="订单详情">
        <OrderDetail v-if="selected" :order="selected" />
        <EmptyState
          v-else
          is-compact
          title="还没有选择订单"
          description="在左边点一行，这里会显示它的详情。"
        />
      </LayoutPanel>
    </template>
  </Layout>
</template>
```

- 面板宽度建议设置在 340px 至 420px 之间，`width` 属性传入像素数值。
- `hasDivider` 绘制面向正文区域的单侧分割线，避免多重画线。
- `isScrollable` 使长详情内容在面板内独立滚动，不影响外部列表。
- 未选中条目时展示 `EmptyState`，避免面板折叠坍塌。

若需支持用户手动拖拽调整面板宽度，可配合 `useResizable` 与 `ResizeHandle`：

```vue
<script setup lang="ts">
import { useResizable } from '@astryx-vue/core'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { ResizeHandle } from '@astryx-vue/core/Resizable'

const detail = useResizable({
  defaultSize: 380,
  minSize: 320,
  maxSize: 560,
})
</script>

<template>
  <Layout>
    <LayoutContent>正文</LayoutContent>

    <template #end>
      <ResizeHandle
        direction="horizontal"
        is-reversed
        has-divider
        :resizable="detail.props"
        label="调整详情面板宽度"
      />
      <LayoutPanel :width="detail.size" :has-divider="false" is-scrollable label="详情">
        详情内容
      </LayoutPanel>
    </template>
  </Layout>
</template>
```

结束侧（end）面板需开启 `isReversed`，向左拖拽为增加宽度。分隔条本身要 `has-divider`，面板则关掉 `hasDivider`，一条边上只留一条线。

在窄屏视口下应避免多栏挤压，建议隐藏侧面板并改用 `Dialog` 或 `BottomSheet` 呈现详情，详见 [响应式布局](/guide/responsive)。
