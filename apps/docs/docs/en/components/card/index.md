---
layout: component-docs
title: Card
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { cardCallout, cardElevation, cardLayout, cardSimple, cardVariants } from '../../../../components/demos/card'
</script>

## Usage

`Card` is a bordered surface with a background and rounded corners, and it turns a group of content into one thing you can treat on its own. Its job is appearance and space only: the background, the border, the corner radius, the padding, and passing that padding on to children that need to bleed past it.

A card is not the default layout tool. Most content groups on a page need no container at all; spacing and alignment already read as grouping. Reach for a card when an item needs a clear interaction boundary, or when it has to be compared side by side with its siblings in a row or a grid. A useful test is to ask: "could I reorder, remove, or take this away on its own?" If yes, it is a card. If no, it is just a region of the page, and a heading plus a `Stack` is the right answer.

```vue
<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card>
    <VStack :gap="2">
      <Heading :level="3">
        Weekly report
      </Heading>
      <Text color="secondary">
        Your team closed 24 issues this week.
      </Text>
    </VStack>
  </Card>
</template>
```

`padding` takes a step from the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10) and applies it to all four sides. Leave it out and the card keeps the theme's card padding rather than one fixed step, so passing a step is a decision to override the theme instead of a way to restate its default.

`variant` picks the background. `default` is the standard card surface with a visible border, `transparent` has neither a background nor a border and only groups content, and `muted` uses the muted surface. The other ten names are the categorisation hues: `blue`, `cyan`, `gray`, `green`, `orange`, `pink`, `purple`, `red`, `teal`, and `yellow`. Only `default` draws a border, and it draws it inside the padding: the border width is subtracted from each side, so the total inset (border plus padding) still equals the padding step and content sits at the same coordinates in a bordered card as in a borderless one.

`elevation` is the shadow the card rests at, and it can be `none`, `low`, `med`, or `high`. Raise a card only when it has to float above the content around it; a list where every card carries a shadow has no depth left to show.

`width`, `height`, `maxWidth`, and `minHeight` size the card, with numbers read as pixels and strings used as they are. In a flex row or a grid track the card yields to the track: it has a minimum width of zero, so a long value inside cannot widen a row or a `1fr` track. The card also clips content it cannot fit rather than turning into a scroll container, which would capture sticky descendants and make an overflowing card an unnamed keyboard tab stop. Truncate long values that cannot wrap — an ID, a hash, a URL — with `Text`'s `maxLines`, and give wide content such as a table or code its own scroll region. A fixed `height` changes that: the card becomes a viewport for its content, and the content scrolls inside it.

The card also publishes `--container-padding-inline-start`, `--container-padding-inline-end`, `--container-padding-block-start`, and `--container-padding-block-end` on its root. Children that need to extend to the card's edge — a `Divider` with `isFullBleed`, for example — read those variables to cancel the padding, so they never need to know how much padding the card used.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Ask first: "could I reorder or remove this on its own?" If yes, it is a card; if no, it is a page region, so use a heading plus a `Stack` or a `Section`. |
| <Badge variant="success">Do</Badge> | Use cards for discrete items: one user, one notification, one metric, one product in a grid. Each card is one thing. |
| <Badge variant="success">Do</Badge> | Keep `padding` the same across sibling cards so they line up in a grid or a list. |
| <Badge variant="success">Do</Badge> | Truncate long IDs, hashes, and URLs with `Text`'s `maxLines="1"`, and put wide content such as tables and code in its own scroll region. |
| <Badge variant="success">Do</Badge> | Set `elevation` only when the card has to float above the content around it. |
| <Badge variant="error">Don't</Badge> | Default to cards for visual grouping. A heading plus a `Stack` with proper spacing builds hierarchy without covering the page in borders. |
| <Badge variant="error">Don't</Badge> | Wrap page regions in cards. Form groups such as "General settings" or "Notification preferences" are page regions, not cards. |
| <Badge variant="error">Don't</Badge> | Nest cards inside other cards. Flatten the hierarchy with spacing and dividers instead. |
| <Badge variant="error">Don't</Badge> | Use the colour variants to carry status. Use `Banner` or `Badge` for that; a coloured card is for categorisation. |

## Examples

<DemoExample
  :demo="cardCallout"
  description="Muted-variant cards for tips, notes, or supplementary information. Use when content should be visually distinct but not prominent."
  locale="en"
  title="Callout"
/>

<DemoExample
  :demo="cardElevation"
  description="The four elevation levels side by side. Cards are flat by default; raise a card with elevation only when it needs to float above surrounding content."
  locale="en"
  title="Elevations"
/>

<DemoExample
  :demo="cardLayout"
  description="A card with a structured header, content area, and footer with action buttons. Use for forms, dialogs, or settings panels that need clear sections."
  locale="en"
  title="Layout"
/>

<DemoExample
  :demo="cardSimple"
  description="A card with a heading and body text. Use for summaries, descriptions, or any grouped content that needs visual separation from the page."
  locale="en"
  title="Simple"
/>

<DemoExample
  :demo="cardVariants"
  description="Default, muted, and color variants side by side. Use color variants to categorize cards visually, like team colors, project tags, or content types."
  locale="en"
  title="Variants"
/>
