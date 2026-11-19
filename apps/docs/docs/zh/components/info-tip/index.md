---
layout: component-docs
title: 信息提示
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { infoTipFieldLabel, infoTipSizes } from '../../../../components/demos/info-tip'
</script>

## 使用方法

`InfoTip` 是一个会展开帮助文字的小「i」按钮。悬停和键盘聚焦预览帮助，点击、轻点、回车或空格把它钉住，直到按下 Escape、再按一次、点到外面或焦点离开。适合放在标签、数值和指标旁边，用来写权限说明、指标定义和字段帮助。

```vue
<script setup lang="ts">
import { InfoTip } from '@astryx-vue/core/InfoTip'
</script>

<template>
  <InfoTip content="编辑者可以修改这个字段，查看者不能。" />
  <InfoTip content="近 30 天滚动平均值。" label="关于这个指标" />
</template>
```

按钮是 `useTooltip` 的开关：它调用 hook 的 `show()` 和 `hide()`，由 hook 负责预览、保持、播报和关闭。信息图标是内置的 `info` 图形，主题可以替换。宿主上的 `data-*` 属性和 `class` 会落到按钮上，名称和展开状态相关的属性由组件自己管。

## 最佳实践

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 内容保持简短、纯文字、不含交互；要放链接或按钮，改用 Popover 或 HoverCard。 |
| <Badge variant="success">推荐</Badge> | “More information” 太笼统时覆盖 `label`，例如“关于这个指标”。 |
| <Badge variant="success">推荐</Badge> | 触屏上用 InfoTip，别手写信息按钮：它在按下时钉住帮助，轻点即可钉住，点外面再关闭。 |
| <Badge variant="error">不推荐</Badge> | 在 `Tooltip` 里手写一个 `Icon` 当信息入口；裸图标是 `aria-hidden` 且不可聚焦，键盘和读屏用户永远到不了。 |
| <Badge variant="error">不推荐</Badge> | 用 InfoTip 放用户完成任务必须看到的信息；这类文字应该直接写在页面上。 |

## 示例

<DemoExample :demo="infoTipSizes" title="尺寸" description="xsm、sm（默认）、md、lg 与 Icon 的 12、16、20、24px 一一对应。" locale="zh" />

<DemoExample :demo="infoTipFieldLabel" title="字段标签" description="任何字段的 `labelTooltip` 都会在标签旁画一个 InfoTip，名称是“About Workspace name”。" locale="zh" />

## 无障碍

- 触发器是一个真实的 `<button type="button">`，可以用 Tab 到达，名称来自 `label`（默认 “More information”）。
- 遵循 toggletip 模式：帮助被钉住时 `aria-expanded="true"`，气泡显示时 `aria-controls` 指向它，`aria-describedby` 始终把气泡作为按钮的描述。
- 帮助被钉住时读屏会念一次。悬停或聚焦的预览本来就是按钮的描述，不会再播报。
- Escape 通过共用的关闭栈处理：一次按键不会同时关掉帮助和外层 Dialog。
- 按下的事件停在按钮上，外面可点击的行、卡片或标签不会响应。
- 触屏上按钮周围有一圈看不见的点击带，放大点按目标。
