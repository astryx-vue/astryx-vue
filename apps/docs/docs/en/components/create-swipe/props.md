---
layout: component-docs
title: createSwipe
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="createSwipe parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options.leading</code></td>
        <td><code>ReadonlyArray&lt;SwipeAction&lt;Id&gt;&gt;</code></td>
        <td>—</td>
        <td>The actions a drag toward the inline end uncovers (rightward in left-to-right text), outermost last. Each is <code>{ id, label, icon?, onActivate, isDisabled?, variant?, hasRemoval? }</code>. <code>id</code> names the action, and the swipe's type carries the ids, so an id it does not have fails to compile. <code>label</code> is the button's accessible name. <code>onActivate({ id, itemKey })</code> fires on a tap on a resting entry, on a full swipe, or on a <code>commit</code> release, once the row has left its box when the row slides out; <code>itemKey</code> is the <code>ListItem</code>'s, <code>undefined</code> on a plain <code>Item</code>. <code>variant</code> is <code>'accent'</code> (default), <code>'neutral'</code> or <code>'destructive'</code>. <code>hasRemoval</code> keeps the row out after the action fires instead of springing back.</td>
      </tr>
      <tr>
        <td><code>options.trailing</code></td>
        <td><code>ReadonlyArray&lt;SwipeAction&lt;Id&gt;&gt;</code></td>
        <td>—</td>
        <td>The actions a drag toward the inline start uncovers (leftward in left-to-right text), outermost last, in the same shape as <code>leading</code>.</td>
      </tr>
      <tr>
        <td><code>options.swipeBehavior</code></td>
        <td><code>'reveal' | 'commit'</code></td>
        <td><code>'reveal'</code></td>
        <td>What a swipe does, on both sides. <code>reveal</code> rests the row open with every entry a real button: a fast release goes the way it moves, a slow one past half the panel opens the row, and a fling never fires. A full swipe fires the outermost entry; backing out closes the row, and a disabled outermost entry never confirms. On a side with two or more entries, only a drag that starts on the open row fires. <code>commit</code> fires a side's one entry on a full swipe, with nothing resting and a presentational panel; on a side with two or more entries it fires none and warns in development.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="createSwipe returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>(return value)</td>
        <td><code>Swipe&lt;Id&gt;</code></td>
        <td>The row's swipe actions, frozen, with nothing in them to read; its type carries the actions' ids. Pass it as <code>swipe</code> on <code>Item</code> or <code>ListItem</code>; a value made any other way swipes nothing. A new value with the same ids keeps an open row as it is, and one with other ids closes it.</td>
      </tr>
    </tbody>
  </table>
</div>
