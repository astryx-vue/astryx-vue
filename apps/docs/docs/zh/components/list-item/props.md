---
layout: component-docs
title: 列表项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ListItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>这一行的主文字。写字符串或数字时只显示一行，超出用省略号；要放别的内容就用 <code>label</code> 插槽。</td></tr>
<tr><td><code>description</code></td><td><code>string | number</code></td><td>—</td><td>主文字下面那行小字，同样只显示一行。要多行或者放别的内容就用 <code>description</code> 插槽。</td></tr>
<tr><td><code>density</code></td><td><code>ItemDensity</code>（<code>'compact' | 'balanced' | 'spacious'</code>）</td><td>继承外面列表的值</td><td>盖掉外层 <code>List</code> 的疏密。不在列表里时默认是 <code>'balanced'</code>。</td></tr>
<tr><td><code>onClick</code></td><td><code>(event: MouseEvent) =&gt; void</code></td><td>—</td><td>点了之后做什么。给了它就渲染一个铺满行内容区的按钮，悬停和按下的样式也跟着有。模板里写 <code>@click</code>。</td></tr>
<tr><td><code>interactiveRef</code></td><td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td><td>—</td><td>指向行里那个本来就能操作的控件，比如 <code>startContent</code> 里的复选框。这时整行变成更大的点击区域，点行面就转给那个控件，行自己不再渲染按钮，也就不会多一个 Tab 停留点。它和 <code>onClick</code>、<code>href</code> 只能用一个，写了它那两个会被忽略。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>链接地址。行里会渲染一个链接元素。</td></tr>
<tr><td><code>target</code></td><td><code>'_blank' | '_self'</code></td><td>—</td><td>链接在哪打开，只有写了 <code>href</code> 才有用。<code>_blank</code> 会自动补上 <code>noopener</code> 和 <code>noreferrer</code>。</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>链接的 rel 值，会和自动补的那些合在一起。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用。这一行不动了，内容变淡，同时写上 <code>aria-disabled="true"</code>。</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>选中状态。行的角色支持时写成 <code>aria-selected="true"</code>，不支持时写成 <code>aria-current="true"</code>。你自己传的 <code>aria-current</code> 优先。</td></tr>
<tr><td><code>swipeActions</code></td><td><code>ItemSwipeActions</code></td><td>—</td><td>手指横滑能露出哪些操作，左右各一组，每项是 <code>{ label, icon?, onActivate, isDisabled?, variant?, hasRemoval? }</code>。鼠标不会触发这次拖动。每个操作都要在行里再有个入口，否则键盘和鼠标用户够不着。</td></tr>
<tr><td><code>swipeBehavior</code></td><td><code>'reveal' | 'commit'</code></td><td><code>'reveal'</code></td><td><code>reveal</code> 松手后行停在滑开的位置，拖得够远就触发最外面那个操作；<code>commit</code> 直接把行滑出去，松手就触发，什么都不留在屏幕上。</td></tr>
</tbody></table>
</div>

## 插槽

- `startContent`：名字前面，比如图标或头像。
- `label`：自己画主文字，替掉 `label` 属性。
- `description`：自己画说明，替掉 `description` 属性。
- `endContent`：名字后面，比如徽章、数量、时间。

## 暴露

`element`（根元素）、`focus()` 和 `blur()`。聚焦会落到行里那个真正能接焦点的控件上。
