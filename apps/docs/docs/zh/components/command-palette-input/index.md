---
layout: component-docs
title: 命令面板输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { commandPaletteInputBasic } from '../../../../components/demos/command-palette-input'
</script>

## 使用方法

把它放进 `CommandPalette` 里，就是那个带结果弹层的搜索框；不在弹层里时，它也能单独当一个搜索框用。

```ts
import { CommandPaletteInput } from '@astryx-vue/core/CommandPalette'
```

<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 「Search commands」说不清能搜什么时，自己写一句简短的 `label` 补上。占位文字永远不能代替这个字段的名字。 |
| <Badge variant="success">推荐</Badge> | 尾部只放短小的辅助控件或快捷键提示，用 `endContent`。 |
| <Badge variant="error">避免</Badge> | 自己改 combobox 的角色或弹层状态。接了 `CommandPalette` 之后，这些语义归 `CommandPaletteInput` 管。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="commandPaletteInputBasic" title="带尾部内容" description="自定义占位文字，并用 endContent 在尾部放一枚快捷键徽章。" locale="zh" />
