---
layout: component-docs
title: 代码块
outline: false
footer: false
---

`CodeBlock` 和 `SyntaxTheme` 从 `@astryx-vue/core/Code` 导出。行内 `Code`、分词器和复制辅助函数写在 Code 页面。

## CodeBlock 属性

<div class="component-api-table" role="region" aria-label="CodeBlock 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>code</code></td><td><code>string</code></td><td>—</td><td>只读代码。复制按钮写下的就是这个字符串。</td></tr>
<tr><td><code>language</code></td><td><code>string</code></td><td><code>'plaintext'</code></td><td>分词用的语言。<code>plaintext</code> 不显示语言名。</td></tr>
<tr><td><code>syntaxTheme</code></td><td><code>SyntaxThemeDefinition</code></td><td>—</td><td>这一块的语法颜色。相当于在外面套一层 <code>SyntaxTheme</code>。</td></tr>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>顶栏里的文件名或标签。</td></tr>
<tr><td><code>hasLanguageLabel</code></td><td><code>boolean</code></td><td><code>true</code></td><td>顶栏是否显示语言名。</td></tr>
<tr><td><code>hasLineNumbers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否画行号槽。</td></tr>
<tr><td><code>highlightLines</code></td><td><code>number[]</code></td><td>—</td><td>要强调的行，从 1 开始。</td></tr>
<tr><td><code>hasCopyButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示复制按钮。</td></tr>
<tr><td><code>isWrapped</code></td><td><code>boolean</code></td><td><code>false</code></td><td>长行是换行，还是横向滚动。</td></tr>
<tr><td><code>maxHeight</code></td><td><code>number | string</code></td><td>—</td><td>正文开始滚动前的最大高度。数字按像素计。</td></tr>
<tr><td><code>isCollapsible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>行数达到阈值后，顶栏是否可以收起正文。</td></tr>
<tr><td><code>collapsibleThreshold</code></td><td><code>number</code></td><td><code>10</code></td><td>出现收起控件所需的行数。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>字号。</td></tr>
<tr><td><code>width</code></td><td><code>string</code></td><td><code>'fit-content'</code></td><td>CSS 宽度。<code>100%</code> 铺满父级。</td></tr>
<tr><td><code>container</code></td><td><code>'card' | 'section'</code></td><td><code>'card'</code></td><td><code>section</code> 去掉边框、圆角和背景。</td></tr>
<tr><td><code>tokenizer</code></td><td><code>(code, language) =&gt; SyntaxToken[]</code></td><td>—</td><td>自定义分词器。token 用绝对偏移，不替换被复制的文本。</td></tr>
<tr><td><code>highlightMode</code></td><td><code>'auto' | 'ranges' | 'spans'</code></td><td><code>'auto'</code></td><td>token 的绘制方式。</td></tr>
<tr><td><code>copyLabel</code></td><td><code>string</code></td><td><code>'Copy code'</code></td><td>复制前，复制控件的无障碍名称。</td></tr>
<tr><td><code>copiedLabel</code></td><td><code>string</code></td><td><code>'Copied'</code></td><td>复制成功后的名称和播报。</td></tr>
<tr><td><code>codeLabel</code></td><td><code>string</code></td><td><code>'Code'</code></td><td>代码视口的无障碍名称。</td></tr>
</tbody></table>
</div>

## CodeBlock 事件

- `copy`：代码字符串写入剪贴板之后发出。

## SyntaxTheme

<div class="component-api-table" role="region" aria-label="SyntaxTheme 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>theme</code></td><td><code>SyntaxThemeDefinition</code></td><td>内置预设，或 <code>defineSyntaxTheme()</code> 的结果。<code>[浅色, 深色]</code> 会存成 <code>light-dark()</code>。组件页见 <a href="/components/syntax-theme">语法主题</a>。</td></tr>
</tbody></table>
</div>

默认插槽是要吃到这些颜色的内容，通常是一个或多个 `CodeBlock`。

`githubDark` 写入 `--astryx-code-syntax-*` 和 `--astryx-code-block-background`。背景偏暗时，还会把 `--astryx-code-block-border` 设为 12% 不透明度的白色。
