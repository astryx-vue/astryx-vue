---
layout: component-docs
title: useOverflow
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useOverflow 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>itemCount</code></td>
        <td><code>MaybeRefOrGetter&lt;number&gt;</code></td>
        <td>—</td>
        <td>要测量的项数。</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>UseOverflowOptions</code></td>
        <td>—</td>
        <td>溢出行为的配置。</td>
      </tr>
      <tr>
        <td><code>options.gap</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>项与项的间距，单位像素，参与宽度计算。</td>
      </tr>
      <tr>
        <td><code>options.minVisibleItems</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>哪怕挤不下也至少显示的项数。</td>
      </tr>
      <tr>
        <td><code>options.maxVisibleItems</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>哪怕都挤得下也不能超过的项数。下限比它大时，下限胜出。</td>
      </tr>
      <tr>
        <td><code>options.maxRows</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>最多排几行，剩下的收进指示器。不传或传 <code>1</code> 只排一行。</td>
      </tr>
      <tr>
        <td><code>options.collapseFrom</code></td>
        <td><code>'start' | 'end'</code></td>
        <td><code>'end'</code></td>
        <td>从哪一头开始收起。</td>
      </tr>
      <tr>
        <td><code>options.behavior</code></td>
        <td><code>'observeParent' | 'observeSelf'</code></td>
        <td><code>'observeSelf'</code></td>
        <td>量哪一个元素的宽度。<code>observeParent</code> 量父元素的内容宽度，看得见的容器本身可以继续跟着内容收缩。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useOverflow 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>绑到看得见的容器上。</td>
      </tr>
      <tr>
        <td><code>measureRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>绑到屏幕外的测量容器上，里面放全部项。</td>
      </tr>
      <tr>
        <td><code>visibleCount</code></td>
        <td><code>Ref&lt;number&gt;</code></td>
        <td>看得见的容器里能放下几项。</td>
      </tr>
      <tr>
        <td><code>hasOverflow</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>是不是有项被收起来了（<code>visibleCount &lt; itemCount</code>）。</td>
      </tr>
      <tr>
        <td><code>rows</code></td>
        <td><code>Ref&lt;number&gt;</code></td>
        <td>看得见的项占几行。单行模式是 <code>1</code>，什么都没显示时是 <code>0</code>。</td>
      </tr>
      <tr>
        <td><code>rowHeight</code></td>
        <td><code>Ref&lt;number&gt;</code></td>
        <td>量到的最大项高，多行容器用它定高度。</td>
      </tr>
      <tr>
        <td><code>remeasure</code></td>
        <td><code>() =&gt; void</code></td>
        <td>再量一次。测试里改过宽度、或者折叠状态变了之后用得上。</td>
      </tr>
    </tbody>
  </table>
</div>

## 元素版

`useOverflow(element, isActive)` 是另一个签名。它不量一排项，只量一个盒子：判断这个元素里的内容是不是比它自己的可视区域高，返回一个 `Ref<boolean>`。`isActive` 为 false 时它不做测量。

<div class="component-api-table" role="region" aria-label="useOverflow 元素版" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>element</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>要量的那个盒子的模板 ref。</td>
      </tr>
      <tr>
        <td><code>isActive</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>要不要量。为 false 时结果一直是 <code>false</code>。</td>
      </tr>
      <tr>
        <td><code>返回值</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>内容是不是比盒子高。</td>
      </tr>
    </tbody>
  </table>
</div>
