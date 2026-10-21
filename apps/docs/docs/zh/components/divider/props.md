---
layout: component-docs
title: 分隔线
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Divider 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>分隔线的方向，垂直分隔线适合放在固定高度的行内。</td></tr>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>显示在分隔线中间的文字，同时作为分隔线的无障碍名称。数字 0 会显示出来，空字符串不显示。</td></tr>
<tr><td><code>variant</code></td><td><code>'subtle' | 'strong'</code></td><td><code>'subtle'</code></td><td>线条的视觉强弱，strong 使用强调边框色，适合需要明显边界的场景。</td></tr>
<tr><td><code>isFullBleed</code></td><td><code>boolean</code></td><td><code>false</code></td><td>为 true 时，分隔线会越过容器内边距，延伸到容器边缘。</td></tr>
</tbody></table>
</div>

## 插槽

- `label`：分隔线中间的富文本内容，会替代 `label` 属性的纯文字。

## 主题

```css
.my-divider {
  --astryx-divider-color-subtle: #00000014;
}
```

- `--astryx-divider-color-subtle`：`subtle` 线条颜色。
- `--astryx-divider-color-strong`：`strong` 线条颜色。
- `--astryx-divider-label-color`：文字颜色。
- `--astryx-border-width`：线条粗细。
