---
layout: component-docs
title: 警告对话框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { alertDialogLoading } from '../../../../components/demos/alert-dialog'
</script>

## 使用方法

`AlertDialog`（警告对话框）只专心做一件事：在具有破坏性或无法撤回的操作（比如永久删除文件、清空数据、注销账户）真正执行前，跳出来跟用户再次确认。因为这些动作做完就没法反悔，所以必须郑重其事地停下来，向用户说清楚后果，再交由用户自己做决定。

**什么时候用：**
- 执行无法挽回或后果严重的破坏性操作前，需要用户郑重确认时。

**什么时候不要用：**
- 需要用户在弹窗里填写表单、编辑复杂内容时，请改用普通对话框 [Dialog](/components/dialog)。
- 普通的状态提醒或操作成功通知，请改用轻提示 [useToast](/components/use-toast)，不要频繁打断用户。

它实现了 WAI-ARIA 规范中的 Alert Dialog 模式。根元素带有 `role="alertdialog"`，标题通过 `aria-labelledby` 作为弹窗名称，后果描述通过 `aria-describedby` 连同标题一起被读屏工具念出。打开时焦点会自动落在最为安全的「取消」按钮上，关闭后再把焦点还给触发它的元素。为了防止误触，点击背景遮罩不会关闭它，按键盘上的 Escape 键则等同于点击取消。

```vue
<script setup lang="ts">
import { AlertDialog } from '@astryx-vue/core/AlertDialog'
import { Button } from '@astryx-vue/core/Button'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button label="删除项目" variant="destructive" @click="isOpen = true" />
  <AlertDialog
    :is-open="isOpen"
    title="要删除这个项目吗？"
    description="删除后无法恢复，项目下的部署与所有仪表盘都会一并移除。"
    action-label="删除项目"
    @action="isOpen = false"
    @open-change="isOpen = $event"
  />
</template>
```

打开状态完全由父组件掌握。按下「取消」或按 Escape 只会发出 `openChange(false)`，组件不会自己关闭；确认按钮同样只发出 `action` 事件，也不会关闭对话框。这是刻意留出的位置：异步操作需要时间，你可以在操作结束后再设置 `isOpen`。等待期间把 `isActionLoading` 设为 `true`，确认按钮会显示加载指示，对话框保持打开：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
const isActionLoading = ref(false)

async function revoke(): Promise<void> {
  isActionLoading.value = true
  await revokeAccess()
  isActionLoading.value = false
  isOpen.value = false
}
</script>

<template>
  <AlertDialog
    :is-action-loading="isActionLoading"
    :is-open="isOpen"
    action-label="撤销授权"
    description="该成员会立即失去所有共享文件夹和草稿的访问权限。"
    title="要撤销授权吗？"
    @action="revoke"
    @open-change="isOpen = $event"
  />
</template>
```

确认按钮默认使用 `destructive` 变体，因为对话框本身就是为确认破坏性操作而存在的。如果这次确认并不具有破坏性，例如「发布变更」，把 `actionVariant` 改成 `primary`，颜色就会和语义一致。

按钮的排列会随可用宽度变化。宽于 640px 时，操作区是一行，按「取消 → 确认」的顺序排列，标签过长时整行自动换行；640px 及以下时两个按钮都占满宽度，确认操作排在「取消」上方。无论哪种排列，初始焦点始终落在「取消」上，因为那是破坏性最小的选择；窄屏下的层级、DOM 顺序与 Tab 顺序保持一致，屏幕阅读器读到的顺序和眼睛看到的顺序不会打架。

`isInline` 用于文档预览：它以普通文档流渲染整个表面，不使用 `<dialog>`、遮罩与焦点限制。既然没有模态行为，它也不会声称自己是模态的，根元素的角色改为 `role="group"`。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 让确认按钮的标签说清会发生什么。「删除项目」比「确定」或「是」更能让人在按下之前判断后果。 |
| <Badge variant="success">推荐</Badge> | 在 `description` 里写清后果：删除后能否恢复、会影响哪些数据、是否通知他人。用户是在这里做出决定的。 |
| <Badge variant="success">推荐</Badge> | 保持「取消」是最不具破坏性的焦点目标。窄屏下确认操作在视觉和结构上都排在前面，但初始焦点仍然留在「取消」上。 |
| <Badge variant="success">推荐</Badge> | 异步操作期间使用 `isActionLoading` 撑住对话框，等工作真正结束后再关闭它。 |
| <Badge variant="success">推荐</Badge> | 只用来确认破坏性或不可逆的操作。普通的信息提示、表单填写改用量更轻的对话框。 |
| <Badge variant="error">避免</Badge> | 只靠颜色表达危险。红色按钮本身不说明会发生什么，标签才是。 |
| <Badge variant="error">避免</Badge> | 在 `action` 事件里立刻关闭对话框。这样一来加载状态无处安放，用户也不知道操作到底有没有成功。 |
| <Badge variant="error">避免</Badge> | 把确认对话框套在另一个对话框里。多步流程请拆成同一个对话框里的步骤，或改用整页。 |

## 示例

<DemoExample
  :demo="alertDialogLoading"
  description="Revoke 会进入两秒的加载状态。对话框以内联方式直接展示，不用先点开就能看到等待中的操作。"
  locale="zh"
  title="加载中"
/>

## 无障碍

对话框通过原生 `<dialog>` 的 `showModal()` 打开，因此模态行为、页面其余部分的不可交互状态、以及关闭后的焦点归还都由浏览器提供。标题与描述分别通过 `aria-labelledby` 与 `aria-describedby` 关联，屏幕阅读器在进入对话框时会读出「标题 + 后果描述 + 可用操作」这一整段信息，用户不必先摸索一圈才知道发生了什么。

初始焦点固定在「取消」上，并通过 `data-autofocus` 标记，所以即使窄屏下按钮的排列发生变化，获得焦点的仍然是最不具破坏性的那个选择。Escape 与按下「取消」走的是同一条路径：只发出 `openChange(false)`，是否关闭由父组件决定。点击遮罩不会关闭对话框——破坏性操作的确认不应该因为一次误触而消失。

确认按钮加载期间会带上 `aria-busy`，「取消」仍然可以按，用户可以取消一个还没结束的操作。

## 主题

```css
.my-alert-dialog {
  --astryx-alert-dialog-title-foreground: #171717;
  --astryx-alert-dialog-description-foreground: #525252;
  --astryx-alert-dialog-content-gap: 16px;
}
```

表面、遮罩、圆角与阴影全部来自对话框本身，可通过 `--astryx-dialog-*` 调整；上面这些令牌只影响标题、描述与操作区之间的间距。Neutral 主题会随明暗模式自动切换。
