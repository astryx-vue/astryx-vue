---
layout: component-docs
title: createSwipe
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="createSwipe 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options.leading</code></td>
        <td><code>ReadonlyArray&lt;SwipeAction&lt;Id&gt;&gt;</code></td>
        <td>—</td>
        <td>往行内末尾拖（从左往右书写时是往右）露出的操作，最外侧的写在最后。每项是 <code>{ id, label, icon?, onActivate, isDisabled?, variant?, hasRemoval? }</code>。<code>id</code> 是操作的名字，横滑的类型里带着这些 id，写错的 id 编译不过。<code>label</code> 是按钮的无障碍名称。<code>onActivate({ id, itemKey })</code> 在点停开的操作、全滑、或 <code>commit</code> 松手时触发；行要滑出去的话，等行离开原来的位置才触发。<code>itemKey</code> 是 <code>ListItem</code> 的，普通 <code>Item</code> 上是 <code>undefined</code>。<code>variant</code> 可选 <code>'accent'</code>（默认）、<code>'neutral'</code>、<code>'destructive'</code>。<code>hasRemoval</code> 让行在操作触发后停在外面，不弹回来。</td>
      </tr>
      <tr>
        <td><code>options.trailing</code></td>
        <td><code>ReadonlyArray&lt;SwipeAction&lt;Id&gt;&gt;</code></td>
        <td>—</td>
        <td>往行内开头拖（从左往右书写时是往左）露出的操作，最外侧的写在最后，格式和 <code>leading</code> 一样。</td>
      </tr>
      <tr>
        <td><code>options.swipeBehavior</code></td>
        <td><code>'reveal' | 'commit'</code></td>
        <td><code>'reveal'</code></td>
        <td>横滑怎么收场，两侧一样。<code>reveal</code> 让行停开，露出的每项都是真按钮：松手时动得快就顺着方向走，慢的过了面板一半就停开，一甩永远不触发。全滑触发最外侧的操作；往回退就合上，禁用的最外侧操作永远不会确认。一侧有两个及以上操作时，只有从停开的行开始的拖动才会触发。<code>commit</code> 全滑时触发这一侧唯一的操作，不停开，面板只是展示；一侧有两个及以上操作时一个都不触发，开发环境下会警告。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="createSwipe 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>（返回值）</td>
        <td><code>Swipe&lt;Id&gt;</code></td>
        <td>行的横滑操作，冻结、里面没有可读的东西；它的类型带着操作的 id。把它作为 <code>swipe</code> 传给 <code>Item</code> 或 <code>ListItem</code>；不是它造出的值什么都不会滑。换成 id 相同的新值，开着的行保持原样；id 变了行就合上。</td>
      </tr>
    </tbody>
  </table>
</div>
