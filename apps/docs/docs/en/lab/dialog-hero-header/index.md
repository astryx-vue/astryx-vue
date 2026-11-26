---
title: DialogHeroHeader
---

# DialogHeroHeader

A hero-style header for `Dialog`: full-bleed media sits above the title, and the close button floats over the media's top-trailing corner. It is the high-emphasis sibling of `DialogHeader`, for featured, marketing, or onboarding dialogs. Put it in a `Layout`'s header slot inside a `Dialog`, as you would `DialogHeader`. The media bleeds to the dialog's edges by cancelling the header padding, and the title names the dialog. The visible title is the default initial focus target; inline dialogs and hidden titles do not move focus. It is a Lab component and ships only under the `canary` tag.

<script setup lang="ts">
import { labDialogHeroHeader } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labDialogHeroHeader" description="An onboarding dialog with dark media above the title and the close button over the media." locale="en" title="Onboarding dialog" /></ClientOnly>

## Import

```ts
import { DialogHeroHeader } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | Dialog title, wrapped in a level 2 Heading. It names the parent Dialog unless the Dialog has its own label. For a custom heading, use the `title` slot. |
| `mediaMode` | `'light' \| 'dark'` | `undefined` | Luminance of the media. It wraps the close button in `MediaTheme`, so dark media gets a light button and light media a dark one. Omit it to keep the surrounding theme's colors. |
| `isTitleHidden` | `boolean` | `false` | Hides the title row visually while screen readers still read it, so the dialog stays named. |
| `maxLines` | `number` | `undefined` | Lines a string title shows before it truncates with an ellipsis. |
| `hasDivider` | `boolean` | `undefined` | Adds a border at the bottom edge. Defaults to the parent Layout's divider setting. |

## Events

| Name | Payload | Description |
| --- | --- | --- |
| `openChange` | `false` | Emitted when the close button is pressed. Without a listener, no close button renders, as with `DialogHeader`. |

## Slots

| Name | Description |
| --- | --- |
| `media` | Full-bleed visual above the title: an image, illustration, or icon. Size it yourself, for example `width: 100%`. |
| `startContent` | Content before the title, such as an icon. It is not part of the dialog's name. |
| `title` | A custom heading. The dialog's title id and default focus land on the rendered heading element itself; an `id` you set stays, so then name the Dialog with `aria-labelledby`. |

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Set `mediaMode` to match the media's luminance so the close button stays legible: dark imagery needs `mediaMode="dark"`. |
| <Badge variant="success">Recommended</Badge> | Keep actions in `LayoutFooter`; the hero header takes no actions. |
| <Badge variant="success">Recommended</Badge> | Use `isTitleHidden` when the media already says the message; the title still names the dialog for screen readers. |
| <Badge variant="error">Avoid</Badge> | Using it for routine confirmations or forms; use the compact `DialogHeader`. |
| <Badge variant="error">Avoid</Badge> | Decorative images without an empty `alt`; give purely decorative images `alt=""` so screen readers skip them. |
