---
layout: component-docs
title: useKeyboardHint
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useKeyboardHint 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseKeyboardHintOptions</code></td>
        <td><code>{}</code></td>
        <td>提示的配置对象，可以不传。</td>
      </tr>
      <tr>
        <td><code>options.orientation</code></td>
        <td><code>'horizontal' | 'vertical' | 'both'</code></td>
        <td><code>'horizontal'</code></td>
        <td>这一组控件用哪个方向键导航，决定提示里画哪几个箭头（横向 ← →，纵向 ↑ ↓，双向四个都画）。</td>
      </tr>
      <tr>
        <td><code>options.dismissAfterMs</code></td>
        <td><code>number</code></td>
        <td><code>3000</code></td>
        <td>出现之后过多少毫秒自己消失。</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否启用提示。某处不想提示时（例如控件被禁用或只读）设为 false。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useKeyboardHint 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>Hint</code></td>
        <td><code>Component</code></td>
        <td>提示元素本身，渲染在这一组容器的最后，例如 <code>&lt;component :is="hint.Hint" /&gt;</code>。它自己用 <code>fixed</code> 定位、用 <code>Kbd</code> 画方向键、自己管显示与隐藏。无条件渲染即可。</td>
      </tr>
      <tr>
        <td><code>visible</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>提示当前是否显示。<code>Hint</code> 读的就是它；自己画提示时也可以用。</td>
      </tr>
      <tr>
        <td><code>anchor</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>提示跟在哪个元素旁边，也就是当前聚焦的那一项。第一次出现之前是 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>orientation</code></td>
        <td><code>ComputedRef&lt;KeyboardHintOrientation&gt;</code></td>
        <td>补过默认值的方向。</td>
      </tr>
      <tr>
        <td><code>onFocus</code></td>
        <td><code>(event: FocusEvent) =&gt; void</code></td>
        <td>绑在容器的 <code>focusin</code> 上（<code>@focusin</code>），因为 focus 不冒泡。第一次从组外靠键盘（<code>:focus-visible</code>）进入时显示提示。</td>
      </tr>
      <tr>
        <td><code>onBlur</code></td>
        <td><code>(event: FocusEvent) =&gt; void</code></td>
        <td>绑在容器的 <code>focusout</code> 上（<code>@focusout</code>）。焦点彻底离开这一组时藏起提示；在组内移动时把提示挪到新的当前项。</td>
      </tr>
      <tr>
        <td><code>onKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>绑在容器的 <code>keydown</code> 上。第一次按方向键时收起提示（用户已经发现这个交互了）。它不会 preventDefault，也不会停止传播。</td>
      </tr>
    </tbody>
  </table>
</div>
