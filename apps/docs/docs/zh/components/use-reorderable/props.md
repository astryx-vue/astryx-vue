---
layout: component-docs
title: useReorderable
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useReorderable 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;ReorderableOptions&gt;</code></td>
        <td>—</td>
        <td>配置对象。每次移动都读它的最新值。<code>createReorderable</code> 接受同样的字段，只是传普通对象。</td>
      </tr>
      <tr>
        <td><code>options.onReorder</code></td>
        <td><code>(move: { key: TKey, to: number }) =&gt; void</code></td>
        <td>—</td>
        <td>每完成一次移动（一次松手，或重排模式里的每一步）调用一次，带上被挪那一项的键，和它挪完后在整个列表里的下标。按新顺序渲染数据就算应用了。被取消的移动不会调用。</td>
      </tr>
      <tr>
        <td><code>options.isReorderable</code></td>
        <td><code>(key: TKey) =&gt; boolean</code></td>
        <td>—</td>
        <td>这个键对应的项能不能动。不能动的项没有手柄，也拿不起来；它在列表两头时还会框住别的项，谁也不能越过它落下，键盘往它那里挪会被拒绝。不传时每一项都能动。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useReorderable 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>（返回值）</td>
        <td><code>Reorderable&lt;TKey&gt;</code></td>
        <td>列表的重排能力：传给 <code>List</code> 的 <code>reorderable</code>，每个 <code>ListItem</code> 带上 <code>itemKey</code>。它唯一的方法 <code>start(key)</code> 从你自己的界面进入那一项的重排模式，焦点移到它的手柄上。一个对象可以同时给几个列表用，各排各的；这时 <code>start</code> 用最后挂载的那个。</td>
      </tr>
    </tbody>
  </table>
</div>
