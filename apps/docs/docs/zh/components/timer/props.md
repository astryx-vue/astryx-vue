---
layout: component-docs
title: 计时
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Timer 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>startTime</code></td><td><code>number</code></td><td>—</td><td>操作开始时的 unix 时间，单位毫秒。不传则从挂载时开始。</td></tr>
<tr><td><code>format</code></td><td><code>'elapsed' | 'clock'</code></td><td><code>'elapsed'</code></td><td><code>elapsed</code> 用紧凑单位，满一小时后去掉秒。<code>clock</code> 始终精确到秒。</td></tr>
<tr><td><code>type</code></td><td><code>TextType | 'inherit'</code></td><td><code>'supporting'</code></td><td>语义字号，和 Timestamp 一致。<code>inherit</code> 不再包一层 Text。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg' | 'xl'</code></td><td>—</td><td>显式字号，覆盖 <code>type</code> 带出的尺寸。</td></tr>
<tr><td><code>color</code></td><td><code>'primary' | 'secondary' | 'accent' | 'inherit' | 'disabled'</code></td><td><code>'secondary'</code></td><td>文字颜色。<code>disabled</code> 使用禁用文字色。</td></tr>
<tr><td><code>weight</code></td><td><code>'regular' | 'medium' | 'semibold' | 'bold'</code></td><td>—</td><td>字重覆盖。</td></tr>
</tbody></table>
</div>

## 主题

根类名是 `astryx-timer`。数字用等宽数字。`data-color` 选择 `primary`、`secondary`、`accent` 或 `disabled`。
