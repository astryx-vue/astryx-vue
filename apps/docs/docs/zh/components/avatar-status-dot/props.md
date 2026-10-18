---
layout: component-docs
title: 头像状态点
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="AvatarStatusDot 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>variant</code></td><td><code>'success' | 'neutral' | 'error'</code></td><td><code>'success'</code></td><td>状态的语义，颜色自带形状，状态不用只靠颜色分辨：<code>success</code> 是实心圆点，<code>neutral</code> 是空心环，<code>error</code> 是圆点上横一道减号。旧名字 <code>info</code> 和 <code>warning</code> 仍然可以用，分别按 <code>success</code> 和 <code>error</code> 画。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>状态的读屏名称，例如 <code>Online</code>。放进头像里时会并进头像自己的无障碍名称（<code>Jane Doe, Online</code>）；单独使用时圆点自己带 <code>role="img"</code> 和这个名字。不传时圆点带 <code>aria-hidden</code>，对辅助技术完全不可见。</td></tr>
</tbody></table>
</div>

## 尺寸

圆点会读外层头像的尺寸，按三档取大小。分档而不是等比缩小，是为了每一档都还看得清；放在头像外面时用默认的 <code>md</code>（36px）。

| 头像尺寸 | 圆点 | 边框 | 图标 |
| --- | --- | --- | --- |
| 36px 及以下 | 10px | 1px | 不显示 |
| 37px 到 72px | 20px | 2px | 12px |
| 73px 及以上 | 32px | 4px | 18px |

## 插槽

- `icon`：画在圆点中间的图标。给了图标就顶掉自带的形状（实心 / 空心环 / 减号），所以不同状态配不同图标。最小一档不画图标，那里放不下，画了也看不清。

## 主题

```css
.my-avatar-status-dot {
  --astryx-avatar-status-dot-size: 12px;
  --astryx-avatar-status-dot-border-width: 2px;
  --astryx-avatar-status-dot-border-color: #ffffff;
  --astryx-avatar-status-dot-success-background: #198100;
  --astryx-avatar-status-dot-success-foreground: #ffffff;
  --astryx-avatar-status-dot-neutral-background: #ffffff;
  --astryx-avatar-status-dot-neutral-foreground: #525252;
  --astryx-avatar-status-dot-error-background: #e33f4a;
  --astryx-avatar-status-dot-error-foreground: #ffffff;
}
```

`size` 会盖掉圆点从头像算出来的大小，里面画的形状仍然按算出来的档位画。
