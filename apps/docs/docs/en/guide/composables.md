---
title: Composables
---

# Composables

Import composables from the package root:

```ts
import { useClipboard, useControllableState } from '@astryx-vue/core'
```

There is no `@astryx-vue/core/composables` subpath. The functions exported from `packages/core/src/composables/index.ts` are below. Parameters are the TypeScript types.

| Function | What it does |
| --- | --- |
| `useControllableState` | A `v-model` that is controlled or internal. If the value is missing at setup, it stays internal. |
| `useAnnounce` | Announces to screen readers. Matches upstream `useAnnounce`. |
| `useClipboard` | Writes to the clipboard and keeps `isCopied` true for a short time. |
| `useHotkeys` | Global shortcuts. `mod+k` uses ⌘ on Apple platforms. |
| `useMediaQuery` | A media query as a ref, read once during setup. |
| `useDismiss` | Outside press and Escape for popups. Escape uses a stack; the innermost layer handles it. |
| `useFocusTrap` | Cycles Tab inside a container. |
| `useRestoreFocus` | Remembers focus when a popup opens and returns it on close. |
| `useScrollLock` | Locks `body` scroll with a reference count. |
| `useListFocus` | Arrow keys for a one-dimensional list. The default selector is `[role="menuitem"]`. |
| `useClickableContainer` | Makes a region activate on click, and leaves nested buttons, links, and inputs alone. |
| `useGridRovingFocus` | Arrow keys for a grid. |
| `useTypeahead` | Cycles matches as the same letter is pressed. It does not move focus; `onMatch` does. |
| `useCombobox` | A searchable option list and the current value. |
| `useNumberField` | A number with min, max, and step. |
| `useAsyncSource`, `createStaticSource` | A cancellable search source, and a local static source. |
| `useOverflow`, `computeOverflow` | Folds items that do not fit into an indicator. `computeOverflow` is pure. |
| `useLongPress` | Fires after a hold. Moving too far cancels it. |
| `useStreamingText` | Reveals text that has already arrived, at `natural`, `fast`, or `instant`. |
| `snapToGraphemeBoundary` | Snaps an offset to a grapheme boundary for streaming text. |
| `useChatStreamScroll` | Pins a transcript to the bottom, or lets it go. Reduced motion jumps instead of springing. |
| `useChatNewMessages` | Marks rows that arrived while the reader was not pinned to the bottom. |

`useClipboard` is also exported as `useCopyToClipboard` from `@astryx-vue/core` and from `@astryx-vue/core/Code`. The types are the same.

Some functions belong to one component and are not in the table above. Import them from that component's subpath. The package root re-exports them too:

| Function | Entry |
| --- | --- |
| `useToast` | `@astryx-vue/core/Toast` |
| `useImperativeDialog` | `@astryx-vue/core/Dialog` |
| `useImperativeAlertDialog` | `@astryx-vue/core/AlertDialog` |
| `useOverlay` | `@astryx-vue/core/Overlay` |
| `useContextMenu`, `useContextMenuSize` | `@astryx-vue/core/ContextMenu` |
| `useDropdownMenuContext` | `@astryx-vue/core/DropdownMenu` |
| `useSideNavCollapse` | `@astryx-vue/core/SideNav` |
| `useListContext`, `useItemDescriptionId` | `@astryx-vue/core/List` |
| `useTheme`, `useMediaTheme` | `@astryx-vue/core/Theme` |
| `useSyntaxTheme` | `@astryx-vue/core/Code` |
| `useChatComposerContext`, `useChatComposerTokens`, `useChatPasteAsToken`, `useChatDictation`, `useSpeechRecognition` | `@astryx-vue/core/Chat` |

`provideAstryxLocale` and `useAstryxMessages` are in [Internationalization](/en/guide/i18n).
