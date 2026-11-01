---
layout: lab-docs
title: InfoTip
---

# InfoTip

在术语或指标旁放置一个信息按钮，通过悬停、键盘聚焦或点击显示解释。

<script setup lang="ts">
import { labInfoTip } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labInfoTip" description="信息按钮与文字基线对齐，可通过鼠标或键盘查看提示。" locale="zh" title="基本用法" /></ClientOnly>

## 导入

```ts
import { InfoTip } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `content` | `string` | `undefined` | 纯文本提示内容。 |
| `label` | `string` | `'More information'` | 信息按钮的无障碍名称。 |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | 信息图标尺寸。 |

需要富文本时，使用 `content` 插槽替代 `content` 属性。
