---
title: Responsive layout
---

# Responsive layout

Decide what each region does as the width drops, then wire the components. A region can stay and get narrower, move into a layer that opens on demand, or leave the page. When three regions are sharing a row and none of them has room, drop one. Do not shrink all of them by the same amount.

## The shell breakpoint

`mobileNav.breakpoint` on `AppShell` is the width where the side navigation moves into the drawer. The default is `md`.

| Value | Width |
| --- | --- |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |
| `none` | stays inline |

Below that width the side navigation leaves the page and the drawer takes over. A top navigation inside the same shell uses that drawer instead of opening a second one. Set `mobileNav` to `false` to turn this off. Inside the shell, `useAppShellMobile()` reports whether the viewport is narrow and whether the drawer is open. Import it from `@astryx-vue/core`.

## Content

`Layout` splits the page into header, start, content, end, and footer slots. `contentWidth` caps the content column. Dividers still run the full width. A number is pixels. Body text is easiest to read at about 40 to 60 characters a line, so hold the column with this prop instead of wrapping every section in its own container.

A `LayoutPanel` in the end slot takes a fixed column with `width`. When the row gets too narrow for that column, do not keep it on the page next to the side navigation.

```vue
<script setup lang="ts">
import { useMediaQuery } from '@astryx-vue/core'
import { AppShell } from '@astryx-vue/core/AppShell'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'

const isNarrow = useMediaQuery('(max-width: 1024px)')
</script>

<template>
  <AppShell :mobile-nav="{ breakpoint: 'md' }">
    <template #sideNav>
      <SideNav>
        <SideNavItem href="/orders" label="Orders" />
      </SideNav>
    </template>
    <Layout :content-width="720">
      <LayoutContent>
        <p>Orders</p>
      </LayoutContent>
      <template v-if="!isNarrow" #end>
        <LayoutPanel :width="380" has-divider>
          <p>Details</p>
        </LayoutPanel>
      </template>
    </Layout>
  </AppShell>
</template>
```

Above 1024px the page has three regions: the side navigation, the content, and a 380px side panel. At 1024px the side panel leaves the row. Open it in a [Dialog](/en/components/dialog) or a [BottomSheet](/en/components/bottom-sheet) when it is needed. At `md` (768px) the side navigation moves into the shell drawer. `useMediaQuery` reads the match during setup, then follows changes.

## Columns that reflow

A numeric `columns` on `Grid` is that many columns at every width. It does not drop a column on its own. `:columns="7"` is still seven columns on a phone. To drop columns as the width drops, pass `{ minWidth, max }`. `minWidth` is the minimum pixel width of a column, and `max` is the most columns the grid will create. When another column would fall short of `minWidth`, the grid uses fewer columns. The last remaining column can shrink to the container. `gap` takes space between columns and counts toward whether another column fits.

```vue
<Grid :columns="{ minWidth: 240, max: 4 }" :gap="3">
  <!-- Four columns when there is room, fewer when there is not -->
</Grid>

<Grid :columns="7" :gap="1">
  <!-- Seven days, seven columns at every width -->
</Grid>
```

On that same columns object, `repeat: 'fit'` collapses empty tracks so the columns that are present stretch across the row. The default, `fill`, keeps the empty tracks so every column stays the same width.
