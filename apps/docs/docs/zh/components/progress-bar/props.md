---
layout: component-docs
title: 进度条
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ProgressBar 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>必需。当前值。</td></tr>
<tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>最小值。</td></tr>
<tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>最大值。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>轨道高度。</td></tr>
<tr><td><code>variant</code></td><td><code>'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info'</code></td><td><code>'accent'</code></td><td>填充条颜色。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>进度条标签。同时作为无障碍名称。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>补充说明。</td></tr>
<tr><td><code>isIndeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>不确定状态。显示循环动画，并且不报 aria-valuenow、aria-valuemin、aria-valuemax、aria-valuetext。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用外观：填充、标签、数值和刻度都降为次要色。用于已取消或不再进行的任务。</td></tr>
<tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在标签旁显示百分比。</td></tr>
<tr><td><code>valueText</code></td><td><code>string</code></td><td>—</td><td>自定义 aria-valuetext 与显示文本。优先于默认百分比。</td></tr>
<tr><td><code>marks</code></td><td><code>{ value: number, label: string }[]</code></td><td>—</td><td>轨道上的目标刻度。不确定进度时不画。 <code>label</code> 是无障碍名，也是悬停和聚焦时的提示。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>组件宽度。数字按 px 处理。</td></tr>
</tbody></table>
</div>

## 主题

```css
.my-progress-bar {
  --astryx-progress-bar-track-background: #e5e5e5;
  --astryx-progress-bar-fill-background: #171717;
}
```

- `--astryx-progress-bar-track-background`：轨道背景。
- `--astryx-progress-bar-fill-background`：默认填充颜色。
- `--astryx-progress-bar-track-height`：默认轨道高度。
- `--astryx-progress-bar-track-height-sm`：sm 轨道高度。
- `--astryx-progress-bar-track-height-lg`：lg 轨道高度。
