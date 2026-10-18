---
layout: component-docs
title: 头像状态点
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="AvatarStatusDot 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>variant</code></td><td><code>'neutral' | 'info' | 'success' | 'warning' | 'error'</code></td><td><code>'neutral'</code></td><td>圆点的颜色。neutral 灰、info 蓝、success 绿、warning 黄、error 红。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>状态的读屏名称，例如 <code>Online</code>。写了之后圆点带 <code>role="img"</code>，读屏会念出这个名字。不传时圆点带 <code>aria-hidden</code>，对辅助技术完全不可见。</td></tr>
</tbody></table>
</div>

## 插槽

没有。圆点自己绘制。

## 主题

```css
.my-avatar-status-dot {
  --astryx-avatar-status-dot-size: 12px;
  --astryx-avatar-status-dot-border-color: #ffffff;
  --astryx-avatar-status-dot-neutral-background: #a3a3a3;
  --astryx-avatar-status-dot-info-background: #0074e2;
  --astryx-avatar-status-dot-success-background: #198100;
  --astryx-avatar-status-dot-warning-background: #ffce2f;
  --astryx-avatar-status-dot-error-background: #e33f4a;
}
```
