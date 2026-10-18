---
layout: component-docs
title: 顶部导航大菜单特色卡片
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TopNavMegaMenuFeaturedCard 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>卡片标题。必填。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标题下面的说明文字。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>让整张卡片变成一个链接。同时写了 <code>linkLabel</code> 时，链接改到卡片底部的行动文字上。</td></tr>
<tr><td><code>image</code></td><td><code>string</code></td><td>—</td><td>正文上方的图片地址，可以不传。</td></tr>
<tr><td><code>imageAlt</code></td><td><code>string</code></td><td>—</td><td>图片的替代文本。不传时图片被明确当成装饰（<code>alt=""</code>、<code>role="presentation"</code>、<code>aria-hidden</code>）。因为卡片上已经有可见标题，这通常是正确的做法。只有当图片本身带了标题和说明以外的信息时，才需要写它。</td></tr>
<tr><td><code>linkLabel</code></td><td><code>string</code></td><td>—</td><td>底部行动链接的文字。要和 <code>linkHref</code> 或 <code>href</code> 一起用。</td></tr>
<tr><td><code>linkHref</code></td><td><code>string</code></td><td>—</td><td>行动链接的地址。不传则用 <code>href</code>。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>卡片和行动文字共用的链接根组件。只有存在地址时才使用。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：显示在标准正文下方的自定义内容。
