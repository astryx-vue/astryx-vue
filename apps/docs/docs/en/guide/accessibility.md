---
title: Accessibility
---

# Accessibility

Components are built around accessible names, the keyboard, and screen readers. Docs and examples do not drop the focus ring or the contrast to get a look.

Keyboard focus uses `--astryx-focus-outline-*`: 2px, `solid`, the color `--astryx-color-accent`, and a 3px offset. Do not zero `outline` globally. The docs site removes the extra outline only on controls that already draw their own focus, such as inputs with a rounded focus treatment.

An icon-only button needs a name. `IconButton`'s `label` is that name. `NavItem`'s `label` is required too. Decorative graphics use `aria-hidden`. An icon class is not text.

When content has to stay in the accessibility tree and disappear visually, use `VisuallyHidden` from `@astryx-vue/core/VisuallyHidden`.

Announcements go through `useAnnounce`. Changing a button's text after a copy often is not spoken, so `useClipboard` accepts `announce` and speaks that string after a successful write. Popup dismissal uses the Escape stack in `useDismiss`. Dialogs trap Tab with `useFocusTrap` and return focus with `useRestoreFocus`. `useScrollLock` locks background scroll while a popup is open.

Arrow keys for lists and menus live in `useListFocus`, `useGridRovingFocus`, and `useTypeahead`. `ChatMessageList` is `role="log"`. Keep `isStreaming` true while an assistant reply is still growing so a screen reader waits for the finished message instead of speaking every token.

Motion follows `prefers-reduced-motion`. The shared motion classes collapse distance and scale to zero. See [Motion](/en/themes/motion).

There is no separate third-party audit to cite. Keyboard and screen reader behavior for a component is what that component's docs and the repository tests say.
