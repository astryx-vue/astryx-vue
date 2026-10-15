---
layout: component-docs
title: Code Block
outline: false
footer: false
---

`CodeBlock` and `SyntaxTheme` are exported from `@astryx-vue/core/Code`. Inline `Code`, the tokenizer, and the copy helper are documented on the Code page.

## CodeBlock props

<div class="component-api-table" role="region" aria-label="CodeBlock props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>code</code></td><td><code>string</code></td><td>—</td><td>The read-only code. The copy button writes this string.</td></tr>
<tr><td><code>language</code></td><td><code>string</code></td><td><code>'plaintext'</code></td><td>Tokenizer language. <code>plaintext</code> hides the language label.</td></tr>
<tr><td><code>syntaxTheme</code></td><td><code>SyntaxThemeDefinition</code></td><td>—</td><td>Syntax colors for this block. Shorthand for wrapping it in <code>SyntaxTheme</code>.</td></tr>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Filename or label in the header.</td></tr>
<tr><td><code>hasLanguageLabel</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether the language name appears in the header.</td></tr>
<tr><td><code>hasLineNumbers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether to draw a line number gutter.</td></tr>
<tr><td><code>highlightLines</code></td><td><code>number[]</code></td><td>—</td><td>One-indexed lines to emphasize. On a diff row, the highlight replaces the diff tint.</td></tr>
<tr><td><code>isDiff</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Paint the snippet as a unified diff. Text after the glyph keeps the <code>language</code> syntax colors. Copy still writes the original string.</td></tr>
<tr><td><code>hasCopyButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether to show the copy button.</td></tr>
<tr><td><code>isWrapped</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether long lines wrap instead of scrolling sideways.</td></tr>
<tr><td><code>maxHeight</code></td><td><code>number | string</code></td><td>—</td><td>Maximum height before the body scrolls. Numbers are pixels.</td></tr>
<tr><td><code>isCollapsible</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether the header can collapse the body once the line count reaches the threshold.</td></tr>
<tr><td><code>collapsibleThreshold</code></td><td><code>number</code></td><td><code>10</code></td><td>Lines required before the collapse control appears.</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>Text size.</td></tr>
<tr><td><code>width</code></td><td><code>string</code></td><td><code>'fit-content'</code></td><td>CSS width. <code>100%</code> fills the parent.</td></tr>
<tr><td><code>container</code></td><td><code>'card' | 'section'</code></td><td><code>'card'</code></td><td><code>section</code> drops the border, radius, and background.</td></tr>
<tr><td><code>tokenizer</code></td><td><code>(code, language) =&gt; SyntaxToken[]</code></td><td>—</td><td>Custom tokenizer. Tokens use absolute offsets and do not replace the copied text.</td></tr>
<tr><td><code>highlightMode</code></td><td><code>'auto' | 'ranges' | 'spans'</code></td><td><code>'auto'</code></td><td>How tokens are painted.</td></tr>
<tr><td><code>copyLabel</code></td><td><code>string</code></td><td><code>'Copy code'</code></td><td>Accessible name of the copy control before a copy.</td></tr>
<tr><td><code>copiedLabel</code></td><td><code>string</code></td><td><code>'Copied'</code></td><td>Name and announcement after a successful copy.</td></tr>
<tr><td><code>codeLabel</code></td><td><code>string</code></td><td><code>'Code'</code></td><td>Accessible name of the code viewport.</td></tr>
</tbody></table>
</div>

## CodeBlock events

- `copy`: emitted after the code string was written to the clipboard.

## SyntaxTheme

<div class="component-api-table" role="region" aria-label="SyntaxTheme props" tabindex="0">
<table><thead><tr><th>Name</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>theme</code></td><td><code>SyntaxThemeDefinition</code></td><td>A preset or a <code>defineSyntaxTheme()</code> result. A <code>[light, dark]</code> tuple is stored as <code>light-dark()</code>. The component page is <a href="/en/components/syntax-theme">Syntax Theme</a>.</td></tr>
</tbody></table>
</div>

The default slot is the content that should pick up those colors, usually one or more `CodeBlock`s.

`githubDark` sets `--astryx-code-syntax-*` and `--astryx-code-block-background`. A dark background also sets `--astryx-code-block-border` to white at 12% opacity. Diff colors are optional slots in that same list: `added`, `removed`, `diff-header`, `added-marker`, and `removed-marker`. When a syntax theme leaves them out, markers follow its punctuation color, the header row gets no extra paint, and the added and removed tints stay on the page theme's slots.
