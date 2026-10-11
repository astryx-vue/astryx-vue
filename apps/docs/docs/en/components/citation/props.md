---
layout: component-docs
title: Citation
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Citation Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>source</code></td>
        <td><code>CitationSource</code></td>
        <td>-</td>
        <td><code>title</code> is the visible label and falls back to the number. <code>url</code> renders a link. <code>src</code> is a favicon. <code>icon</code> is an image URL or a CSS icon class and wins over <code>src</code>.</td>
      </tr>
      <tr>
        <td><code>number</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>1-based index. Spoken in the accessible name and shown by the number variant.</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'label' | 'number'</code></td>
        <td><code>'label'</code></td>
        <td><code>label</code> is a chip with the title. <code>number</code> is a compact superscript.</td>
      </tr>
    </tbody>
  </table>
</div>

A template ref exposes <code>element</code>, the link or the span.

## Theming

Citation uses the shared tokens. There is no citation-only theme file.

- `--astryx-color-text-secondary` / `--astryx-color-text-primary`: resting and hover text.
- `--astryx-color-border` / `--astryx-color-overlay-hover`: chip border and hover fill.
- `--astryx-color-accent-muted`: superscript fill.
- `--astryx-color-background-surface`: the circle behind a label icon.
- `--astryx-focus-outline-color`: keyboard outline.
- `--astryx-duration-fast-max` / `--astryx-ease-standard`: hover transition.

## Native attributes

Attributes fall through to the root, which is an `<a>` when `source.url` is set and a `<span>` otherwise. `target`, `rel`, `role`, `aria-label`, and `title` are set by the component.
