---
layout: component-docs
title: 国际化 Provider
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="InternationalizationProvider 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>locale</code></td><td><code>string</code></td><td>—</td><td>当前语言，用 BCP 47 标签，例如 <code>"en"</code>、<code>"pt"</code>、<code>"pt-BR"</code>、<code>"zh-Hans"</code>。带地区的标签会先退回它的基础语言，最后退回内置英文。必填。</td></tr>
<tr><td><code>messages</code></td><td><code>ProviderMessagesByLocale</code></td><td>—</td><td>「语言标签 → 目录」的映射，目录的键就是原版那套 <code>@astryx.*</code>。给了就替换这门语言的内置文案。内置的 <code>"en"</code> 和 <code>"zh-CN"</code> 一直都在，不用列进来。</td></tr>
<tr><td><code>overrides</code></td><td><code>ProviderOverrides</code></td><td>—</td><td>按语言存的稀疏覆盖，盖在 <code>messages</code> 那份目录上；没有目录时就盖在内置文案上。按语言分开存，运行时换语言会自动用上对的那一份。</td></tr>
<tr><td><code>dir</code></td><td><code>'ltr' | 'rtl'</code></td><td>按 <code>locale</code> 推导</td><td>显式指定书写方向。不传就按语言标签推导。它只决定 Astryx 组件读到的方向，不会去设 DOM 的 <code>dir</code> 属性；<code>&lt;html&gt;</code> 或外层元素的 <code>dir</code> 要自己设，并且和这里保持一致。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="InternationalizationProvider 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>使用这份语言、目录和方向的子树。</td></tr>
</tbody></table>
</div>

## 其它导出

<div class="component-api-table" role="region" aria-label="InternationalizationProvider 导出" tabindex="0">
<table><thead><tr><th>导出</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>getLocaleDirection</code></td><td><code>(locale: string) =&gt; 'ltr' | 'rtl'</code></td><td>按语言标签算书写方向。运行时支持 <code>Intl.Locale#getTextInfo</code> 就用它，否则查一张从右往左的语言表。解析不了的标签按 <code>'ltr'</code> 处理。</td></tr>
<tr><td><code>useLocaleDirection</code></td><td><code>() =&gt; ComputedRef&lt;'ltr' | 'rtl'&gt;</code></td><td>读最近一层 provider 的方向；没有 provider 时按最近的 locale 推导。</td></tr>
<tr><td><code>ProviderMessagesByLocale</code></td><td><code>Record&lt;string, AstryxUpstreamCatalog&gt;</code></td><td><code>messages</code> 的类型。目录本身是 <code>Record&lt;string, string | { defaultMessage: string }&gt;</code>，键是 <code>@astryx.*</code>。</td></tr>
<tr><td><code>ProviderOverrides</code></td><td><code>ProviderMessagesByLocale</code></td><td><code>overrides</code> 的类型。</td></tr>
</tbody></table>
</div>

## 原生属性

组件本身不渲染元素，<code>class</code> 和 <code>style</code> 不会传下去。
