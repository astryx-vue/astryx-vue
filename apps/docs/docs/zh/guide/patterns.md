---
title: 应用模式
---

<script setup lang="ts">
import { chatPatternConversation, chatPatternLanding } from '../../../components/demos/chat'
</script>

# 应用模式

现代应用（尤其是 AI 产品）通常由许多部件紧密配合而成。在 astryx-vue 中，消息气泡、推理过程、工具调用（Tool Calls）、参考引用以及底部输入框等，都是一个个高内聚的独立组件，你可以根据具体场景自由组合，决定它们如何在页面上协同工作。

组件库本身专注做好前端界面与交互，不绑定任何特定的大语言模型或后端。组件的内容通过插槽自由注入，较长的文本可以直接用 Markdown 组件排版，信息来源则用引用组件标记。

## 场景一：初始落地页（无聊天记录时）

在用户还没有开始对话时，页面中间通常呈现欢迎问候语和一块功能丰富的输入区：
- 支持切换模式，比如写作、编程、深度研究或艺术创作；
- 包含安全性或思考深度的条件胶囊标记；
- 输入 `@` 可以提及人物或知识库，输入 `/` 可以呼出快捷命令；
- 支持在抽屉中添加附件，粘贴超长文本时会自动折叠为精巧的小卡片；
- 仅在浏览器支持语音录入时才露出麦克风按钮；
- 点击下方推荐的分类卡片，示例提示词会自动填入输入框。

## 场景二：对话进行中（有聊天往来时）

当对话开始后，上方是一条条自适应滚动的历史消息，底部紧跟输入区：
- 当 AI 正在生成回复时，发送按钮会自动切换为「停止生成」，当前消息状态标记为输出中；
- 思考推理过程可以先折叠或展开呈现；
- 工具调用状态会自动从「正在运行」平滑过渡到「调用完成」；
- 回答中包含的数字小角标可以直接对应到文章引用来源；
- 生成的长篇文档能够收录为卡片，点击即可在侧栏或全屏弹窗中精读。

在宽屏桌面端，整套演练场支持把参考文档放入右侧可拖拽调整宽度的侧面板中；当屏幕宽度变窄（小于 768px）时，会自动退化为全屏浮层。

## 交互演示

你可以直接在下方两套预设模式中上手试玩。完整的全屏页面可在演练场体验：[AI 对话落地页](/playground/?template=ai-chat-landing) 与 [AI 对话](/playground/?template=ai-chat)。关于各个子组件的排版密度与属性细节，可参阅 [对话组件](/components/chat)。

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

一块内容很长的区域，页眉一滚就看不见，提交按钮一滚就找不到，人就得来回滚。`Layout` 的 `height` 默认是 `fill`：它撑满容器，只有正文在中间滚动，页眉和页脚留在原地。

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

几点：

- `padding` 只写在 `Layout` 上，页眉、正文、页脚共用同一个左右内边距，文字对齐同一条竖线。
- `defaultHasDividers` 一次给页眉和页脚都画线，不用两个区域各写一个 `hasDivider`。
- 页眉里放的是标题加一个主操作，用 `LayoutHeader`。页眉里要放一排可交互的控件（筛选、排序、批量操作），改用 `Toolbar`，它按工具栏的无障碍规则处理方向键。
- 页脚只放必须一直够得着的动作：保存、提交、下一步。次要动作留在正文里。

验证方法：把正文滚到底。页眉和页脚没动，分隔线还是通到两边，页眉标题和正文第一行的左边缘仍然对齐。

## 侧边详情面板

主从结构里，选中一行就跳走一个页面，人回来还得重新找位置。更好的做法是右边开一块固定宽度的面板，列表留着不动。

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

- 面板宽度建议在 340 到 420 之间。`width` 写数字按像素。
- `hasDivider` 画出朝内容的那条边，两边不要都画线。
- `isScrollable` 让长详情自己滚，列表不受影响。
- 没选中任何行时放一个 `EmptyState`。空着会让面板塌成一条缝，选中时页面又突然变宽。

要让用户自己拖宽度，把 `useResizable` 拖到面板和 `ResizeHandle` 上：

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

结束边的面板要把 `isReversed` 打开，往左拖才是变宽。分隔条本身要 `has-divider`，面板则关掉 `hasDivider`，一条边上只留一条线。

窄屏时不要硬挤。宽度不够就让面板退场，改用 `Dialog` 或 `BottomSheet` 展示详情，具体做法见 [响应式布局](/guide/responsive)。
