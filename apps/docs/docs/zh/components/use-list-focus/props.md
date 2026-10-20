---
layout: component-docs
title: useListFocus
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useListFocus 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseListFocusOptions</code></td>
        <td><code>{}</code></td>
        <td>列表焦点行为的配置对象，所有字段都可以不填。</td>
      </tr>
      <tr>
        <td><code>options.itemSelector</code></td>
        <td><code>string</code></td>
        <td><code>'[role="menuitem"]'</code></td>
        <td>列表里可聚焦项的选择器。</td>
      </tr>
      <tr>
        <td><code>options.boundarySelector</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>列表边界的标志。列表里还嵌着同类列表时用（例如带子菜单弹出层的菜单）。设了之后，取项和按键处理都只在这一层自己的容器里。一般传 <code>'[role="menu"]'</code>。</td>
      </tr>
      <tr>
        <td><code>options.wrap</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>方向键到头之后是否绕回另一头。</td>
      </tr>
      <tr>
        <td><code>options.onEscape</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>按下 Escape 时调用（例如关闭菜单）。传了就会吃掉这个键（<code>preventDefault</code>）；不传则 Escape 交给外层处理。</td>
      </tr>
      <tr>
        <td><code>options.orientation</code></td>
        <td><code>'horizontal' | 'vertical' | 'both'</code></td>
        <td><code>'vertical'</code></td>
        <td>导航方向。<code>'horizontal'</code> 用左右方向键，<code>'vertical'</code> 用上下方向键，<code>'both'</code> 四个都收。横向时会看容器的书写方向，RTL 里左右对调。</td>
      </tr>
      <tr>
        <td><code>options.hasHomeEnd</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Home/End 是否跳到第一个/最后一个可用项。</td>
      </tr>
      <tr>
        <td><code>options.hasPaging</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>PageDown/PageUp 是否按视口翻页：PageDown 跳到容器里最后一个完整可见的可用项，在那儿再按一次就往后再翻一屏；PageUp 反过来。两者都不绕回；列表不滚动时它们等于 End/Home。</td>
      </tr>
      <tr>
        <td><code>options.hasRovingTabIndex</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>交给它管 roving tabindex：只有一个项是 <code>tabindex="0"</code>，其余是 <code>-1</code>；项挂载、卸载、切换禁用时它会修好，方向键移动焦点时它跟着挪。为 false 时只移动焦点，不碰 <code>tabindex</code>。</td>
      </tr>
      <tr>
        <td><code>options.hasCaretGuard</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>为 true 时，嵌在列表里的文本框如果光标不在移动方向的边界上（或者有选中内容），方向键就不抢走；嵌进来的 contenteditable 也永远不抢。列表里的行内编辑因此还能正常用。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useListFocus 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>listRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>绑到列表容器元素上。</td>
      </tr>
      <tr>
        <td><code>handleKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>按键处理，绑在列表容器上。</td>
      </tr>
      <tr>
        <td><code>handleFocus</code></td>
        <td><code>(event: FocusEvent) =&gt; void</code></td>
        <td>聚焦处理，绑在容器上。<code>hasRovingTabIndex</code> 打开时用来对齐 tab 停靠点；没打开时什么都不做，所以绑上总是安全的。</td>
      </tr>
      <tr>
        <td><code>focusItem</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>按序号聚焦某一项，超出范围会被夹到最近的合法值。</td>
      </tr>
      <tr>
        <td><code>focusFirst</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>聚焦第一个可用项。真的聚焦到了返回 true。</td>
      </tr>
      <tr>
        <td><code>focusLast</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>聚焦最后一个可用项。真的聚焦到了返回 true。</td>
      </tr>
      <tr>
        <td><code>ownsEvent</code></td>
        <td><code>(event: KeyboardEvent) =&gt; boolean</code></td>
        <td>这个按键是不是属于当前这一层，而不是共用同一个 <code>boundarySelector</code> 的嵌套列表。没配 <code>boundarySelector</code> 时恒为 true。调用方自己加按键处理（Enter/Space、typeahead）时用它挡一下。</td>
      </tr>
      <tr>
        <td><code>getItems</code></td>
        <td><code>() =&gt; HTMLElement[]</code></td>
        <td>当前这一层、DOM 顺序上的项，已经按 <code>boundarySelector</code> 限定过，并去掉了藏起来的项。要算 typeahead 目标就用它，别自己再查一遍。</td>
      </tr>
    </tbody>
  </table>
</div>
