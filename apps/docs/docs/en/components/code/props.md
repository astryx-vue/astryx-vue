---
layout: component-docs
title: Code
outline: false
footer: false
---

## Props

### Code

<div class="component-api-table" role="region" aria-label="Code Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>color</code></td>
        <td><code>CodeColor</code></td>
        <td><code>'primary'</code></td>
        <td>Text color of the inline code: <code>primary</code>, <code>secondary</code>, or <code>inherit</code> for the surrounding text color.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'inherit'</code></td>
        <td>-</td>
        <td>Font size. Omit it to use the code type scale, or set <code>inherit</code> to adopt the surrounding font size and line height.</td>
      </tr>
    </tbody>
  </table>
</div>

### CodeBlock

<div class="component-api-table" role="region" aria-label="CodeBlock Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>code</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The read-only code to display. This exact string is what the copy button writes, whatever the block paints.</td>
      </tr>
      <tr>
        <td><code>language</code></td>
        <td><code>string</code></td>
        <td><code>'plaintext'</code></td>
        <td>Language used for syntax highlighting. An unknown language renders without tokens, and <code>plaintext</code> also hides the language label.</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Filename or label shown in the header bar. A title alone creates the header.</td>
      </tr>
      <tr>
        <td><code>hasLanguageLabel</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether the language name appears in the header. It is never shown for <code>plaintext</code>.</td>
      </tr>
      <tr>
        <td><code>hasLineNumbers</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether to draw a line number gutter. The gutter is sized to the widest number.</td>
      </tr>
      <tr>
        <td><code>highlightLines</code></td>
        <td><code>number[]</code></td>
        <td>-</td>
        <td>One-indexed line numbers to emphasize with an accent background. Out-of-range numbers have no effect.</td>
      </tr>
      <tr>
        <td><code>hasCopyButton</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether to show the copy button, in the header when there is one and floating at the top end otherwise.</td>
      </tr>
      <tr>
        <td><code>isWrapped</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether long lines wrap instead of scrolling horizontally.</td>
      </tr>
      <tr>
        <td><code>maxHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>Maximum height before the code body scrolls vertically. Numbers are pixels, so <code>0</code> is a valid zero-pixel bound.</td>
      </tr>
      <tr>
        <td><code>isCollapsible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the header collapses the body. The control only appears when the header is visible and the code reaches <code>collapsibleThreshold</code> lines.</td>
      </tr>
      <tr>
        <td><code>collapsibleThreshold</code></td>
        <td><code>number</code></td>
        <td><code>10</code></td>
        <td>Number of lines a block needs before the collapse control appears.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md'</code></td>
        <td><code>'md'</code></td>
        <td>Text size variant. <code>md</code> uses the code type scale and <code>sm</code> the supporting size.</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>string</code></td>
        <td><code>'fit-content'</code></td>
        <td>Any CSS width value. <code>fit-content</code> shrinks to the longest line with a floor so a short snippet still reads as a block; <code>100%</code> fills the parent.</td>
      </tr>
      <tr>
        <td><code>container</code></td>
        <td><code>'card' | 'section'</code></td>
        <td><code>'card'</code></td>
        <td>Container presentation. <code>card</code> paints a border, radius, and background; <code>section</code> drops all three so the block blends into the surface it sits in.</td>
      </tr>
      <tr>
        <td><code>tokenizer</code></td>
        <td><code>(code: string, language: string) =&gt; SyntaxToken[]</code></td>
        <td>-</td>
        <td>Custom tokenizer for a language the built-in one does not cover. Tokens use absolute offsets. It changes paint only, never the displayed or copied text.</td>
      </tr>
      <tr>
        <td><code>highlightMode</code></td>
        <td><code>'auto' | 'ranges' | 'spans'</code></td>
        <td><code>'auto'</code></td>
        <td>How syntax tokens are painted. <code>auto</code> prefers the CSS Custom Highlight API and falls back to span elements.</td>
      </tr>
      <tr>
        <td><code>copyLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Copy code'</code></td>
        <td>Accessible name and hover hint of the copy button before a copy.</td>
      </tr>
      <tr>
        <td><code>copiedLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Copied'</code></td>
        <td>Name of the copy button and text of the polite announcement after a successful copy.</td>
      </tr>
      <tr>
        <td><code>codeLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Code'</code></td>
        <td>Accessible name of the code viewport, and of a collapsible header that has no visible title or language label.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="CodeBlock Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>copy</code></td>
        <td>-</td>
        <td>Emitted after the code string was written to the clipboard. A rejected write emits nothing.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Code Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Inline code content for <code>Code</code>. <code>CodeBlock</code> takes its content from the <code>code</code> prop and renders no slot.</td>
      </tr>
    </tbody>
  </table>
</div>

## Exports

These are exported from `@astryx-vue/core/Code` beside the two components:

<div class="component-api-table" role="region" aria-label="Code Exports" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Signature</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>tokenize</code></td>
        <td><code>(code, language) =&gt; TokenLine[]</code></td>
        <td>Tokenize a string into one token array per line, with offsets relative to the line start. Returns nothing for an unknown language.</td>
      </tr>
      <tr>
        <td><code>tokenizeAsync</code></td>
        <td><code>(code, language, signal?) =&gt; Promise&lt;TokenLine[]&gt;</code></td>
        <td>The same result, yielding to the main thread between chunks. An aborted signal returns the lines finished so far.</td>
      </tr>
      <tr>
        <td><code>flatTokensToLines</code></td>
        <td><code>(tokens, code) =&gt; TokenLine[]</code></td>
        <td>Convert tokens with absolute offsets, as a custom tokenizer returns them, into line-relative tokens.</td>
      </tr>
      <tr>
        <td><code>applyHighlightRanges</code></td>
        <td><code>(element, tokenLines) =&gt; () =&gt; void</code></td>
        <td>Paint tokens through the CSS Custom Highlight API and return the cleanup function.</td>
      </tr>
      <tr>
        <td><code>useCopyToClipboard</code></td>
        <td><code>(options?) =&gt; { copy, isCopied }</code></td>
        <td>Copy-to-clipboard behavior with a transient copied flag. Re-copying restarts the reset timer, which is two seconds by default.</td>
      </tr>
      <tr>
        <td><code>SYNC_TOKENIZE_THRESHOLD</code></td>
        <td><code>number</code></td>
        <td>Code length below which tokenization runs synchronously; longer code is tokenized in chunks.</td>
      </tr>
      <tr>
        <td><code>HIGHLIGHTED_TOKEN_TYPES</code></td>
        <td><code>readonly string[]</code></td>
        <td>Token types the stylesheet already paints, so a custom tokenizer can reuse them.</td>
      </tr>
    </tbody>
  </table>
</div>

## CSS variables

The block reads these tokens, which the neutral theme defines:

<div class="component-api-table" role="region" aria-label="Code CSS variables" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>--astryx-font-family-code</code></td><td>Monospace font stack for inline code, the block, and the header.</td></tr>
      <tr><td><code>--astryx-text-code-size</code></td><td>Font size of inline code and of an <code>md</code> block.</td></tr>
      <tr><td><code>--astryx-code-background</code></td><td>Background of inline code.</td></tr>
      <tr><td><code>--astryx-code-block-background</code></td><td>Background of the block and its sticky header. A <code>section</code> container sets it to transparent.</td></tr>
      <tr><td><code>--astryx-code-block-border</code></td><td>Border of a <code>card</code> container, the header divider, and the line number rule.</td></tr>
      <tr><td><code>--astryx-code-block-focus</code></td><td>Focus ring of the collapsible header control.</td></tr>
      <tr><td><code>--astryx-code-block-highlight-background</code></td><td>Background of a line listed in <code>highlightLines</code>.</td></tr>
      <tr><td><code>--astryx-code-syntax-*</code></td><td>Token colors: keyword, string, comment, number, function, type, variable, operator, constant, tag, attribute, property, and punctuation.</td></tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element of `Code` is a `<code>`, and the root element of `CodeBlock` is a `<pre>`.

The following go to that root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

`class` and `style` are composed with the component's own, and a `width` in `style` wins over the `width` prop. The copy button, the code viewport, and the collapse region are internal elements with their own accessible names, so they are not addressed through the root.
