---
layout: component-docs
title: useTableInfiniteScroll
outline: false
footer: false
---

The config is a `MaybeRefOrGetter`, so pass a getter or a ref to keep the plugin on the current values.

## Parameters

<div class="component-api-table" role="region" aria-label="useTableInfiniteScroll parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hasMore</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>Whether the data source can return another batch. When false, the Load more button and the automatic loading go away.</td>
      </tr>
      <tr>
        <td><code>isLoading</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>Your own loading state. No new request starts while it is true.</td>
      </tr>
      <tr>
        <td><code>onLoadMore</code></td>
        <td><code>() =&gt; Promise&lt;void&gt;</code></td>
        <td>—</td>
        <td>Fetches the next batch and appends it to your rows. Return a Promise that settles when the batch is done. A rejected Promise pauses automatic loading; returning anything other than a Promise also pauses it and warns in development.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useTableInfiniteScroll returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>loadingState</code></td>
        <td><code>() =&gt; TableLoadingState</code></td>
        <td>Reports <code>{ hasMore, isLoading }</code>. While it is loading, the table does not show its default empty state.</td>
      </tr>
      <tr>
        <td><code>below</code></td>
        <td><code>() =&gt; VNodeChild</code></td>
        <td>Renders the Load more button inside the table scroll region, plus an invisible marker that an <code>IntersectionObserver</code> watches against the viewport. When the last batch removes the button while it has focus, focus moves to the scroll region without scrolling the page.</td>
      </tr>
    </tbody>
  </table>
</div>
