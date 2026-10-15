---
layout: component-docs
title: Kbd
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { kbdInline, kbdMenu, kbdModifiers } from '../../../../components/demos/kbd'
</script>

## Usage

`Kbd` presents a keyboard shortcut as a small group of painted key badges, such as `⌘K` or `⇧↵`. It belongs next to the action it triggers — on the right of a menu item, inside a tooltip, or at the end of a line of help text — so you can mention the shortcut without writing out "hold Command and press K".

Pass the shortcut as one string and separate the keys with `+`:

```vue
<script setup lang="ts">
import { Kbd } from '@astryx-vue/core/Kbd'
</script>

<template>
  <Kbd keys="mod+k" />
</template>
```

Every segment becomes its own badge, so `mod+k` paints two keys. Whitespace around a segment is ignored and the case does not matter, which makes `mod + K` and `mod+k` the same shortcut. Anything the component does not recognize is uppercased as written, so `f1` shows as `F1`.

`mod` is the one key that follows the platform: it reads as `⌘` on Apple platforms and as `Ctrl` everywhere else. Reach for `mod` when you describe a shortcut that works across platforms, and use `ctrl` only when the shortcut really is bound to the Control key. The other named keys have a fixed glyph:

| Written as | Painted as |
| --- | --- |
| `mod` | `⌘` on Apple platforms, `Ctrl` elsewhere |
| `ctrl` | `⌃` |
| `alt` | `⌥` |
| `shift` | `⇧` |
| `enter` | `↵` |
| `backspace` | `⌫` |
| `tab` | `⇥` |
| `escape` | `Esc` |
| `up` / `down` / `left` / `right` | `↑` `↓` `←` `→` |
| `plus` | `+` |

`esc` is an alias for `escape`, and `return` is an alias for `enter`; an alias paints and is announced exactly like the key it names. Because `+` separates the keys, write `plus` for the plus key itself, as in `shift+plus`.

To a screen reader the whole group is one image named "Command + K"; the glyphs inside the badges are hidden because `⌘` and `⇧` are announced as nothing useful. The keys are spoken as words instead. Note that `Kbd` only presents a shortcut: it does not listen for keystrokes, and the shortcut still has to be implemented by the product.


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Place the shortcut next to the action it triggers: on the right of a menu item, in a tooltip, or straight after the wording it belongs to. |
| <Badge variant="success">Do</Badge> | Describe a cross-platform shortcut with `mod` rather than `ctrl` or `cmd`, so macOS users read `⌘` and everyone else reads `Ctrl`. |
| <Badge variant="success">Do</Badge> | Only mention shortcuts that exist and can actually be pressed in the current context. A wrong hint is worse than no hint. |
| <Badge variant="success">Do</Badge> | Spell shortcuts the same way as the rest of the product, so documentation and settings never disagree. |
| <Badge variant="error">Don't</Badge> | Treat `Kbd` as the only way to discover an action. Shortcuts supplement visible controls, they do not replace them. |
| <Badge variant="error">Don't</Badge> | Scatter shortcut hints across a screen. They are supporting information; in bulk they drown out the content. |
| <Badge variant="error">Don't</Badge> | Hand-write `⌘` or `⇧` characters instead of using the component. Hand-written glyphs do not follow the platform, and screen readers cannot announce what they mean. |

## Examples

<DemoExample
  :demo="kbdInline"
  description="Keyboard shortcuts rendered inline within instructional text."
  locale="en"
  title="Inline instructions"
/>

<DemoExample
  :demo="kbdMenu"
  description="Menu-style list pairing action labels with their keyboard shortcuts."
  locale="en"
  title="Menu shortcuts"
/>

<DemoExample
  :demo="kbdModifiers"
  description="Modifier combinations and special keys rendered as shortcut badges."
  locale="en"
  title="Modifier combinations"
/>
