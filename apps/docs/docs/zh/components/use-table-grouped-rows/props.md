---
layout: component-docs
title: useTableGroupedRows
outline: false
footer: false
---

## 参数

`useTableGroupedRows()` 只有一个配置对象。用 getter 或 `ref` 包一层，分组才能跟着当前的行和当前的折叠集合走：`useTableGroupedRows(() => ({ ... }))`。

<div class="component-api-table" role="region" aria-label="useTableGroupedRows 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>readonly T[]</code></td>
        <td>—</td>
        <td>必填。要分组的扁平数据。</td>
      </tr>
      <tr>
        <td><code>groupBy</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>必填。算出这一行的分组 key。key 相同的行在同一组。</td>
      </tr>
      <tr>
        <td><code>collapsedGroups</code></td>
        <td><code>ReadonlySet&lt;string&gt;</code></td>
        <td>—</td>
        <td>必填。当前折叠了的分组 key 集合。</td>
      </tr>
      <tr>
        <td><code>onToggleGroup</code></td>
        <td><code>(groupKey: string) =&gt; void</code></td>
        <td>—</td>
        <td>必填。点分组表头时调用，传入这组的 key。</td>
      </tr>
      <tr>
        <td><code>renderGroupHeader</code></td>
        <td><code>(groupKey: string, count: number, collapsed: boolean) =&gt; VNodeChild</code></td>
        <td>—</td>
        <td>自定义分组表头的内容，画在折叠按钮右边。默认是 <code>groupKey (count)</code>。</td>
      </tr>
      <tr>
        <td><code>getRowKey</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>真实行的稳定 key。不传时按位置生成。</td>
      </tr>
      <tr>
        <td><code>groupOrder</code></td>
        <td><code>readonly string[]</code></td>
        <td>—</td>
        <td>指定分组顺序。没列出来的组按第一次出现的顺序排在这些后面。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableGroupedRows 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>ComputedRef&lt;T[]&gt;</code></td>
        <td>你的行加上每组一个表头，按显示顺序排好。折叠的组留下表头，藏起自己的行。</td>
      </tr>
      <tr>
        <td><code>plugin</code></td>
        <td><code>TablePlugin&lt;T&gt;</code></td>
        <td>让分组表头占满整行，选择列和行编号跳过它，点一下就切换折叠。</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>两种行都能算出的行身份：分组表头给分组 key，数据行给 <code>getRowKey</code> 的结果或它的位置。</td>
      </tr>
    </tbody>
  </table>
</div>

### isTableGroupHeader

`isTableGroupHeader(item)` 把 `data` 里的一项收窄成分组表头，可以直接读 `groupKey` 和 `count`，不用强转。插件用的就是这个判断。

## 分组表头的字段

<div class="component-api-table" role="region" aria-label="分组表头字段" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>groupKey</code></td>
        <td><code>string</code></td>
        <td>这一组的分组 key。</td>
      </tr>
      <tr>
        <td><code>count</code></td>
        <td><code>number</code></td>
        <td>这一组有多少行。折叠着也是这个数。</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>分组表头的稳定 id，由分组 key 拼出来。</td>
      </tr>
    </tbody>
  </table>
</div>
