---
layout: component-docs
title: 侧边导航分组
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="SideNavSection 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>分组名。侧栏收起后视觉上藏起来，读屏仍然读得到。必填。</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>标题下面第二行小字。</td></tr>
<tr><td><code>isHeaderHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>任何宽度下都藏起标题。读屏仍然读得到。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：这个分组里的导航项。
- `end`：标题这一行末尾的内容，例如一个新增按钮。
