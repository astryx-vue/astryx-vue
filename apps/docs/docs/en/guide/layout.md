---
title: Layout
---

# Page layout

Build a page from the outside in. Settle the frame and how much room each region gets before you write any content. Doing it the other way round, content first, ends with every section inventing its own container, and the page turns into a column of nested cards.

Four steps, working inward.

1. Pick the frame: `AppShell` for a whole page, `Layout` for one block inside it.
2. Divide the regions: what goes in the header, body, footer, and sides.
3. Align: every region shares one content line.
4. Tune spacing: set gaps first, then decide whether the content needs a denser component.

## Step 1: pick the frame

The outer frame of a whole page is `AppShell`. It owns the top bar, side navigation, banner, and body, and it folds the side navigation into a drawer on narrow screens.

```vue
<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import Nav from './Nav.vue'
import PageBody from './PageBody.vue'
// Replace TopBar, Nav, and PageBody with your own components.
import TopBar from './TopBar.vue'
</script>

<template>
  <AppShell :content-padding="0" :mobile-nav="{ breakpoint: 'md' }">
    <template #topNav>
      <TopBar />
    </template>
    <template #sideNav>
      <Nav />
    </template>
    <PageBody />
  </AppShell>
</template>
```

`AppShell` slots are `topNav`, `sideNav`, `banner`, the default body, and `mobileNav` for a custom drawer.

`contentPadding` is the body region's padding, written on the spacing scale. Leave it out and the body sits flush, so the `Layout` inside owns the edges. Do not pad both the shell and the inner layout, or the two paddings add up.

A block inside a page — one card, one dialog, one tab panel — uses `Layout`. `Layout` does not frame a whole page; it divides its own area.

## Step 2: divide the regions

`Layout` has up to five regions. The default slot is the body; the rest are named slots.

| Slot | What goes there |
| --- | --- |
| `header` | The block's title and primary action |
| `start` | A sidebar or panel on the start edge |
| default slot | The main content, usually wrapped in `LayoutContent` |
| `end` | A sidebar or panel on the end edge |
| `footer` | Buttons that must stay reachable, such as Save and Cancel |

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
</script>

<template>
  <Layout :padding="4" default-has-dividers>
    <template #header>
      <LayoutHeader>Order details</LayoutHeader>
    </template>
    <LayoutContent>
      The body. When it overflows, only this region scrolls.
    </LayoutContent>
    <template #footer>
      <LayoutFooter>
        <Button label="Save" />
      </LayoutFooter>
    </template>
  </Layout>
</template>
```

With `height` on its default `fill`, `Layout` fills its container and only the body scrolls, so the header and footer stay put. With `auto` it grows with the content and the whole page scrolls.

Once the header, body, and footer are in place, turn their dividers on with one `defaultHasDividers` instead of passing `hasDivider` to each region.

## Step 3: align on one content line

Write `Layout`'s `padding` once. It lands on every region: the header, body, footer, and both side panels all take their inline padding from the same value, so their text lines up on one vertical line.

Two habits break that line, and both are easy to avoid.

- Wrapping the body in another `div` with `padding` pushes the body inward, away from the header.
- Writing `padding` inside the header pushes the header outward, away from the body.

To inset one region, use that region component's own `padding`, or reach for `HStack` with a `gap`. Don't add another box around the region.

When body text runs too wide to read, cap it with `contentWidth`: a number is pixels, and you can also write `'100%'` or `'40rem'`. The narrowed body centers itself, and the dividers above and below still run the full width.

## Step 4: arrange the inside, then tune spacing

Below the regions, `HStack`, `VStack`, and `Grid` do the arranging. They only place things; they draw no border and add no background.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { HStack, VStack } from '@astryx-vue/core/Stack'
// Replace OrderCard with your own component.
import OrderCard from './OrderCard.vue'
</script>

<template>
  <!-- One row: the title on the left, the button on the right. -->
  <HStack justify="between" align="center" :gap="3">
    <span>Recent orders</span>
    <Button label="Refresh" variant="secondary" />
  </HStack>

  <!-- One column: 16px between each pair. -->
  <VStack :gap="4">
    <OrderCard />
    <OrderCard />
  </VStack>

  <!-- Responsive columns: at least 240px each, at most 4. -->
  <Grid :columns="{ minWidth: 240, max: 4 }" :gap="3">
    <Card v-for="item in items" :key="item.id" />
  </Grid>
</template>
```

`gap` and `padding` take a spacing step: `2` means `--astryx-spacing-2`, which is 8px. Writing a step rather than `16px` means the gap follows the theme and the root font size.

`Grid`'s `columns` as a number means exactly that many columns, which suits a seven-day calendar. As `{ minWidth, max }` it adds and drops columns with the container width.

With the gaps settled, look at density. Spacing is not the only dial on a block of content.

- Dense, one-row-per-item data such as tables and lists uses rows and dividers, not a card per row.
- `Card` is for self-contained widgets, galleries, and groups of settings.
- Where a sidebar, drawer, or card has no room for the full layout, switch to the compact form of a component, such as `EmptyState`'s `isCompact`.

## Do and don't

| Guidance | Practice |
| --- | --- |
| Do | Settle the frame and the regions before writing content. |
| Do | Write padding once, on `Layout` or `AppShell`. |
| Do | Separate regions with a divider, not with a wall of whitespace. |
| Don't | Give every region its own `padding`; the text lines stop matching. |
| Don't | Wrap every block in a `Card`; the page becomes a column of boxes. |
| Don't | Use a `div` with an inline `margin` where `HStack`, `VStack`, or `Grid` fits. |

## Next

- How each region changes as the screen narrows: [Responsive layout](/en/guide/responsive).
- Pinned headers and footers, and side detail panels: [Patterns](/en/guide/patterns).
- Every prop of `Layout`, `AppShell`, `Stack`, and `Grid`: [Layout](/en/components/layout), [AppShell](/en/components/app-shell), [Stack](/en/components/stack), [Grid](/en/components/grid).
