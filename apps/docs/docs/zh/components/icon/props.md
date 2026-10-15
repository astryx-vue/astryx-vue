---
layout: component-docs
title: 图标
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="图标属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Iconify 的 id，格式是 <code>集合:图标</code>。carbon 集合注册之后，<code>carbon-settings</code> 与 <code>carbon:settings</code> 相同。集合名里带连字符时请保留冒号。</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>语义名、CSS 图标类，或你自己的组件。语义名由最近的主题换成 Iconify id；该图标尚未注册时用内置字形。设置了 <code>name</code> 时忽略它。</td></tr>
<tr><td><code>color</code></td><td><code>'inherit' | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'success' | 'error' | 'warning' | 'blue' | 'cyan' | 'green' | 'gray' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'</code></td><td><code>'inherit'</code></td><td>决定图标里 <code>currentColor</code> 解析成哪种颜色。<code>inherit</code> 保持周围文字的颜色。</td></tr>
<tr><td><code>size</code></td><td><code>'xsm' | 'sm' | 'md' | 'lg'</code></td><td>—</td><td>根字号 16px 时分别是 12px、16px、20px、24px。不传时，<code>name</code> 图标是 <code>1em</code>。其他图标在没有父级尺寸时回退到 <code>md</code>。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>有含义的图标的无障碍名称。会设置 <code>role="img"</code> 和 <code>aria-label</code>。装饰性图标省略它，保持 <code>aria-hidden="true"</code>。空字符串仍按装饰处理。</td></tr>
</tbody></table>
</div>

## 插槽

- 默认插槽：内联 SVG。在既没有 <code>name</code> 也没有 <code>icon</code> 时使用。

## 注册

<div class="component-api-table" role="region" aria-label="图标注册" tabindex="0">
<table><thead><tr><th>名称</th><th>来自</th><th>说明</th></tr></thead><tbody>
<tr><td><code>astryxIcons()</code></td><td><code>@astryx-vue/core/icons</code></td><td>Vite 插件。扫描静态名字，只从已安装的 <code>@iconify-json/*</code> 打包这些图标。用 <code>collections</code> 限制读取哪些前缀。</td></tr>
<tr><td><code>addIcon(name, data)</code></td><td><code>@astryx-vue/core/Icon</code></td><td>注册一枚图标。<code>name</code> 是 <code>集合:图标</code>。<code>data.body</code> 是 SVG 内部标记。</td></tr>
<tr><td><code>addCollection(collection)</code></td><td><code>@astryx-vue/core/Icon</code></td><td>注册一份 <code>@iconify-json</code> 文档。整套集合都会进入包。</td></tr>
</tbody></table>
</div>

## 语义名

`defineTheme({ icons })` 按名字覆盖。和被扩展的主题浅合并，当前这份优先。没写到的名字保持默认 id。集合要已经注册，否则仍画内置字形。

<div class="component-api-table" role="region" aria-label="语义图标" tabindex="0">
<table><thead><tr><th>名字</th><th>默认 Iconify id</th></tr></thead><tbody>
<tr><td><code>close</code></td><td><code>lucide:x</code></td></tr>
<tr><td><code>chevronDown</code></td><td><code>lucide:chevron-down</code></td></tr>
<tr><td><code>chevronLeft</code></td><td><code>lucide:chevron-left</code></td></tr>
<tr><td><code>chevronRight</code></td><td><code>lucide:chevron-right</code></td></tr>
<tr><td><code>chevronsLeft</code></td><td><code>lucide:chevrons-left</code></td></tr>
<tr><td><code>chevronsRight</code></td><td><code>lucide:chevrons-right</code></td></tr>
<tr><td><code>check</code></td><td><code>lucide:check</code></td></tr>
<tr><td><code>success</code></td><td><code>lucide:circle-check</code></td></tr>
<tr><td><code>error</code></td><td><code>lucide:circle-x</code></td></tr>
<tr><td><code>warning</code></td><td><code>lucide:triangle-alert</code></td></tr>
<tr><td><code>info</code></td><td><code>lucide:info</code></td></tr>
<tr><td><code>calendar</code></td><td><code>lucide:calendar</code></td></tr>
<tr><td><code>clock</code></td><td><code>lucide:clock</code></td></tr>
<tr><td><code>externalLink</code></td><td><code>lucide:external-link</code></td></tr>
<tr><td><code>menu</code></td><td><code>lucide:menu</code></td></tr>
<tr><td><code>moreHorizontal</code></td><td><code>lucide:ellipsis</code></td></tr>
<tr><td><code>search</code></td><td><code>lucide:search</code></td></tr>
<tr><td><code>upload</code></td><td><code>lucide:upload</code></td></tr>
<tr><td><code>arrowUp</code></td><td><code>lucide:arrow-up</code></td></tr>
<tr><td><code>arrowDown</code></td><td><code>lucide:arrow-down</code></td></tr>
<tr><td><code>arrowsUpDown</code></td><td><code>lucide:arrow-up-down</code></td></tr>
<tr><td><code>funnel</code></td><td><code>lucide:funnel</code></td></tr>
<tr><td><code>eyeSlash</code></td><td><code>lucide:eye-off</code></td></tr>
<tr><td><code>viewColumns</code></td><td><code>lucide:columns-3</code></td></tr>
<tr><td><code>copy</code></td><td><code>lucide:copy</code></td></tr>
<tr><td><code>checkDouble</code></td><td><code>lucide:check-check</code></td></tr>
<tr><td><code>wrench</code></td><td><code>lucide:wrench</code></td></tr>
<tr><td><code>stop</code></td><td><code>lucide:square</code></td></tr>
<tr><td><code>microphone</code></td><td><code>lucide:mic</code></td></tr>
<tr><td><code>image</code></td><td><code>lucide:image</code></td></tr>
</tbody></table>
</div>

`useSemanticIcon(name)` 从 `@astryx-vue/core/Icon` 引入，也从包根导出。未知字符串、主题也没有覆盖时，返回空，调用方可以继续把它当 CSS 类。

## 主题

颜色走图标令牌。主题在根上覆盖对应变量即可。

```css
.my-theme {
  --astryx-icon-accent-foreground: #0074e2;
}
```

- `--astryx-icon-primary-foreground`
- `--astryx-icon-secondary-foreground`
- `--astryx-icon-disabled-foreground`
- `--astryx-icon-accent-foreground`
- `--astryx-icon-success-foreground`
- `--astryx-icon-error-foreground`
- `--astryx-icon-warning-foreground`
- `--astryx-icon-blue-foreground`，cyan、green、gray、orange、pink、purple、red、teal、yellow 同样是这个形式。

## 无障碍

根元素是 `<span>`。没有 `label` 时为 `aria-hidden="true"`。`label` 非空时为 `role="img"`，这段文字就是无障碍名称。内部 SVG 始终 `aria-hidden`。

`class` 和 `style` 会落到根元素上。`name` 不会：它用来选择图标。
