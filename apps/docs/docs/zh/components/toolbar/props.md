---
layout: component-docs
title: 工具栏
outline: false
footer: false
---

## Toolbar Props

<div class="component-api-table" role="region" aria-label="Toolbar Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>工具栏的无障碍名称。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>高度档。</td></tr>
      <tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td><code>1</code></td><td>每一组里各项的间距，使用间距刻度。</td></tr>
      <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>方向键沿哪一根轴移动焦点。</td></tr>
    </tbody>
  </table>
</div>

## Toolbar Slots

<div class="component-api-table" role="region" aria-label="Toolbar Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>start</code></td><td>起始一侧的操作。</td></tr>
      <tr><td><code>center</code></td><td>中间的操作。存在时三组按网格排列。</td></tr>
      <tr><td><code>end</code></td><td>结束一侧的操作。</td></tr>
    </tbody>
  </table>
</div>
