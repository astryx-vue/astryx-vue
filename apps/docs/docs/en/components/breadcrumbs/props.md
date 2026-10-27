---
layout: component-docs
title: Breadcrumbs
outline: false
footer: false
---

## Breadcrumbs Props

<div class="component-api-table" role="region" aria-label="Breadcrumbs Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>separator</code></td>
        <td><code>string</code></td>
        <td><code>'/'</code></td>
        <td>Decorative separator between items.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>BreadcrumbsVariant</code></td>
        <td><code>'default'</code></td>
        <td>Visual variant. Optional: default, supporting.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>'Breadcrumb'</code></td>
        <td>Accessible label for the nav landmark.</td>
      </tr>
    </tbody>
  </table>
</div>

## Breadcrumbs Slots

<div class="component-api-table" role="region" aria-label="Breadcrumbs Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>List of <code>BreadcrumbItem</code> elements.</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem Props

<div class="component-api-table" role="region" aria-label="BreadcrumbItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Link URL. Renders as a button when omitted.</td>
      </tr>
      <tr>
        <td><code>as</code></td>
        <td><code>string | Component</code></td>
        <td><code>'a'</code></td>
        <td>Link root component, such as a router link. Used instead of <code>a</code> for items that have an <code>href</code> and are not current.</td>
      </tr>
      <tr>
        <td><code>isCurrent</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>Whether this is the current page. <code>true</code> renders a <code>&lt;span&gt;</code> with <code>aria-current="page"</code>; a current crumb can still open a menu. When omitted and no item is <code>true</code>, the last item on the page becomes current: it stays a link and gains <code>aria-current="page"</code> and the current style. <code>false</code> opts the item out of that detection.</td>
      </tr>
      <tr>
        <td><code>menu</code></td>
        <td><code>BreadcrumbMenuOption[]</code></td>
        <td>-</td>
        <td>Turns the crumb into a menu trigger. The array matches the dropdown menu's data entries, including checkbox rows and radio groups. Mutually exclusive with a link, which is ignored when a menu is set. Ignored when the menu slot is used.</td>
      </tr>
      <tr>
        <td><code>menuSize</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>sm</code> on the supporting variant, otherwise <code>md</code></td>
        <td>Size of the menu rows.</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem Slots

<div class="component-api-table" role="region" aria-label="BreadcrumbItem Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Breadcrumb label text.</td>
      </tr>
      <tr>
        <td><code>startIcon</code></td>
        <td>Icon rendered before the label. The built-in icon component can go here.</td>
      </tr>
      <tr>
        <td><code>menu</code></td>
        <td>Menu content written by hand, including checkbox and radio rows. The components are <code>BreadcrumbMenuCheckboxItem</code>, <code>BreadcrumbMenuRadioGroup</code>, and <code>BreadcrumbMenuRadioItem</code>. When this slot is set, the <code>menu</code> array is not used.</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem Events

<div class="component-api-table" role="region" aria-label="BreadcrumbItem Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>click</code></td>
        <td>Emitted when clicked. Not emitted for the current page.</td>
      </tr>
    </tbody>
  </table>
</div>
