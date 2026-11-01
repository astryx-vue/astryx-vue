---
layout: lab-docs
title: LogStream
---

# LogStream

按时间顺序展示日志，支持级别颜色、可展开详情和跟随最新条目。

<script setup lang="ts">
import { labLogStream } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labLogStream" description="带详情的日志行可以展开；列表高度受限时内部滚动。" locale="zh" title="日志列表" /></ClientOnly>

## 导入

```ts
import { LogStream } from '@astryx-vue/lab'
```

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `entries` | `LogEntry[]` | 必填 | 从旧到新排列的日志。 |
| `variant` | `'default' \| 'terminal'` | `'default'` | 普通或终端外观。 |
| `isFollowing` | `boolean` | 非受控 | 是否跟随最新条目，可用 `v-model:isFollowing`。 |
| `maxHeight` | `number \| string` | `undefined` | 日志区域最大高度。 |
| `hasTimestamps` | `boolean` | `true` | 是否显示时间列。 |
| `label` | `string` | `'Log stream'` | 日志区域的无障碍名称。 |

每条日志需要唯一的 `id`、`timestamp`、`level` 和 `message`，可补充 `source` 与 `detail`。`level` 可取 `'info' | 'warn' | 'error' | 'debug'`。

## 事件与插槽

`followChange` 在用户要求改变跟随状态时发出。`#detail="{ entry }"` 可自定义展开内容；只有日志带 `detail` 时才可展开。
