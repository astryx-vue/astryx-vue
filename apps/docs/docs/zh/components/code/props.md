---
layout: component-docs
title: 代码
outline: false
footer: false
---

## Props

### Code

<div class="component-api-table" role="region" aria-label="Code Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>color</code></td>
        <td><code>CodeColor</code></td>
        <td><code>'primary'</code></td>
        <td>行内代码的文字颜色：<code>primary</code>、<code>secondary</code>，或者 <code>inherit</code>（跟随周围文字）。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'inherit'</code></td>
        <td>-</td>
        <td>字号。不传时使用代码字阶，传 <code>inherit</code> 则跟随周围的字号和行高。</td>
      </tr>
    </tbody>
  </table>
</div>

### CodeBlock

<div class="component-api-table" role="region" aria-label="CodeBlock Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>code</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>要展示的只读代码。无论代码块怎样着色，复制按钮写入的都是这个原字符串。</td>
      </tr>
      <tr>
        <td><code>language</code></td>
        <td><code>string</code></td>
        <td><code>'plaintext'</code></td>
        <td>着色使用的语言。不认识的语言不做着色，<code>plaintext</code> 还会隐藏语言标签。</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>显示在头部栏的文件名或标签。只给标题也会生成头部。</td>
      </tr>
      <tr>
        <td><code>hasLanguageLabel</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否在头部显示语言名。语言为 <code>plaintext</code> 时始终不显示。</td>
      </tr>
      <tr>
        <td><code>hasLineNumbers</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否显示行号栏。行号栏宽度按最大行号计算。</td>
      </tr>
      <tr>
        <td><code>highlightLines</code></td>
        <td><code>number[]</code></td>
        <td>-</td>
        <td>要从 1 开始高亮的行号，这些行会加上底色。超出范围的行号没有效果。</td>
      </tr>
      <tr>
        <td><code>hasCopyButton</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否显示复制按钮。有头部时放在头部，没有头部时浮在右上角。</td>
      </tr>
      <tr>
        <td><code>isWrapped</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>长行是否折行，而不是横向滚动。</td>
      </tr>
      <tr>
        <td><code>maxHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>超过这个高度后代码正文纵向滚动。数字按像素处理，所以 <code>0</code> 是合法的零像素高度。</td>
      </tr>
      <tr>
        <td><code>isCollapsible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否可以从头部折叠正文。只有头部可见并且行数达到 <code>collapsibleThreshold</code> 时才会出现折叠控件。</td>
      </tr>
      <tr>
        <td><code>collapsibleThreshold</code></td>
        <td><code>number</code></td>
        <td><code>10</code></td>
        <td>出现折叠控件所需的行数。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md'</code></td>
        <td><code>'md'</code></td>
        <td>文字大小。<code>md</code> 使用代码字阶，<code>sm</code> 使用辅助文字字号。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>string</code></td>
        <td><code>'fit-content'</code></td>
        <td>任意 CSS 宽度取值。<code>fit-content</code> 贴着最长一行（带一个最小宽度下限，短代码也仍然像一块代码），<code>100%</code> 撑满父容器。</td>
      </tr>
      <tr>
        <td><code>container</code></td>
        <td><code>'card' | 'section'</code></td>
        <td><code>'card'</code></td>
        <td>容器样式。<code>card</code> 带边框、圆角和背景；<code>section</code> 三者都去掉，让代码块融入所在的表面。</td>
      </tr>
      <tr>
        <td><code>tokenizer</code></td>
        <td><code>(code: string, language: string) =&gt; SyntaxToken[]</code></td>
        <td>-</td>
        <td>内置分词器不覆盖的语言可以用它自定义。token 使用绝对偏移。它只影响着色，不会改变显示或复制的文本。</td>
      </tr>
      <tr>
        <td><code>highlightMode</code></td>
        <td><code>'auto' | 'ranges' | 'spans'</code></td>
        <td><code>'auto'</code></td>
        <td>语法着色的实现方式。<code>auto</code> 优先使用 CSS Custom Highlight API，不支持时回退到 span 元素。</td>
      </tr>
      <tr>
        <td><code>copyLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Copy code'</code></td>
        <td>复制前复制按钮的无障碍名称和悬停提示。</td>
      </tr>
      <tr>
        <td><code>copiedLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Copied'</code></td>
        <td>复制成功后复制按钮的名称，以及礼貌播报的文本。</td>
      </tr>
      <tr>
        <td><code>codeLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Code'</code></td>
        <td>代码视口的无障碍名称；当可折叠的头部没有可见标题和语言标签时，也用它作为头部的名称。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="CodeBlock Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>载荷</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>copy</code></td>
        <td>-</td>
        <td>代码字符串写入剪贴板之后触发。写入失败时不触发。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Code Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td><code>Code</code> 的行内代码内容。<code>CodeBlock</code> 的内容来自 <code>code</code> 属性，不渲染插槽。</td>
      </tr>
    </tbody>
  </table>
</div>

## 导出

除 `Code`、`CodeBlock` 和 `SyntaxTheme` 外，这些也从 `@astryx-vue/core/Code` 导出：

<div class="component-api-table" role="region" aria-label="Code Exports" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>签名</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>tokenize</code></td>
        <td><code>(code, language) =&gt; TokenLine[]</code></td>
        <td>把字符串分词成每行一组 token，偏移相对行首。语言不认识时返回空数组。</td>
      </tr>
      <tr>
        <td><code>tokenizeAsync</code></td>
        <td><code>(code, language, signal?) =&gt; Promise&lt;TokenLine[]&gt;</code></td>
        <td>结果相同，但会在分块之间让出主线程。signal 被中止时返回已经处理完的行。</td>
      </tr>
      <tr>
        <td><code>flatTokensToLines</code></td>
        <td><code>(tokens, code) =&gt; TokenLine[]</code></td>
        <td>把自定义分词器返回的绝对偏移 token 转换成相对行首的 token。</td>
      </tr>
      <tr>
        <td><code>applyHighlightRanges</code></td>
        <td><code>(element, tokenLines) =&gt; () =&gt; void</code></td>
        <td>用 CSS Custom Highlight API 着色，返回清理函数。</td>
      </tr>
      <tr>
        <td><code>useCopyToClipboard</code></td>
        <td><code>(options?) =&gt; { copy, isCopied }</code></td>
        <td>复制到剪贴板的行为，附带一个短暂的“已复制”状态。重复复制会重新开始计时，默认两秒。</td>
      </tr>
      <tr>
        <td><code>SYNC_TOKENIZE_THRESHOLD</code></td>
        <td><code>number</code></td>
        <td>低于这个长度的代码同步分词，更长的代码分块处理。</td>
      </tr>
      <tr>
        <td><code>HIGHLIGHTED_TOKEN_TYPES</code></td>
        <td><code>readonly string[]</code></td>
        <td>样式表已经着色的 token 类型，自定义分词器可以直接复用。</td>
      </tr>
      <tr>
        <td><code>SyntaxTheme</code></td>
        <td><code>component</code></td>
        <td>按 <code>theme</code> 写入 <code>--astryx-code-syntax-*</code>。包内深色预设是 <code>githubDark</code>。<code>defineSyntaxTheme</code> 原样返回定义。</td>
      </tr>
    </tbody>
  </table>
</div>

## 主题变量

代码块读取以下 token，neutral 主题已经给出默认值：

<div class="component-api-table" role="region" aria-label="Code CSS variables" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>--astryx-font-family-code</code></td><td>行内代码、代码块和头部的等宽字体栈。</td></tr>
      <tr><td><code>--astryx-text-code-size</code></td><td>行内代码和 <code>md</code> 代码块的字号。</td></tr>
      <tr><td><code>--astryx-code-background</code></td><td>行内代码的背景色。</td></tr>
      <tr><td><code>--astryx-code-block-background</code></td><td>代码块和吸顶头部的背景色。<code>section</code> 容器会把它设成透明。</td></tr>
      <tr><td><code>--astryx-code-block-border</code></td><td><code>card</code> 容器的边框、头部下边框和行号分界线的颜色。</td></tr>
      <tr><td><code>--astryx-code-block-focus</code></td><td>可折叠头部控件的焦点环颜色。</td></tr>
      <tr><td><code>--astryx-code-block-highlight-background</code></td><td><code>highlightLines</code> 中列出的行的背景色。</td></tr>
      <tr><td><code>--astryx-code-syntax-*</code></td><td>语法着色：keyword、string、comment、number、function、type、variable、operator、constant、tag、attribute、property、punctuation。</td></tr>
    </tbody>
  </table>
</div>

## 原生属性

`Code` 的根元素是 `<code>`，`CodeBlock` 的根元素是 `<pre>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

`class` 和 `style` 会与组件自身的合并，`style` 里的 `width` 优先于 `width` 属性。复制按钮、代码视口和折叠区域是内部元素，各自有自己的无障碍名称，不通过根元素设置。
