---
title: Upgrade guide
---

# Upgrade guide

This version matches Astryx v0.7.1. The previous version matched 0.4.1.

Every section below is a change you can hit while upgrading. Each one says four things: what changed, how you wrote it before, how you write it now, and what to do.

Most projects only need three steps:

1. Rename `labelHidden` to `isLabelHidden`.
2. Replace `enableEscape` in `useDismiss` with `dismissOnEscape`.
3. Rename the old target names in your own theme.

## Styles and themes

### `reset.css` is now a full global reset

**What changed:** `@astryx-vue/core/reset.css` used to be a single line that declared the CSS layer order. It is now a full global reset, the same kind of thing as Tailwind Preflight (upstream #7355).

**Before:** you imported it to get the layer order.

```ts
import '@astryx-vue/core/reset.css'
import '@astryx-vue/core/styles.css'
```

**Now:** every stylesheet declares the layer order on its first line, so `reset.css` is no longer needed for that. Importing it changes the default look of plain HTML: headings, paragraphs and lists lose their default margins, lists lose their bullets, images and `svg` become block level, form controls inherit the font and color, buttons lose the browser chrome, and placeholder text is no longer faded.

**What to do:**

- Only wanted the layer order: delete the line. Components do not depend on it.
- Want one consistent starting point across browsers: keep it. Its rules sit in the lowest `astryx.reset` layer with zero specificity, so your own styles always win.
- Want one block of the page cleaned up: do not import the file, write styles for that block yourself.

More detail in [Installation](/en/guide/installation).

### Spacing tokens moved from px to rem

**What changed:** `--astryx-spacing-*` is now written in `rem` instead of `px`, and the numbers were converted. Every theme changed, Matcha and Y2K included (upstream #7359 #7374).

**Before:**

```css
--astryx-spacing-1: 4px;
--astryx-spacing-4: 16px;
```

**Now:**

```css
--astryx-spacing-1: 0.25rem;
--astryx-spacing-4: 1rem;
```

**What to do:** the browser default root size is 16px, so nothing looks different and most projects need no change. Only two cases move:

- The page sets `html { font-size: ... }`: spacing and padding now scale with it. That is the point of the change.
- Your own theme writes spacing in px: those steps stay fixed. Write them in rem if you want them to follow the root size.

More detail in [Space, radius, shadow](/en/themes/scale).

### Theme target names were renamed

**What changed:** a batch of old target names is gone and the hyphenated names replace them. A camelCase name such as `buttonIcon`, or a name that starts with a capital such as `Card`, now throws (upstream #7302).

**Before:**

```ts
defineTheme({
  name: 'brand',
  components: {
    progressbar: { base: { color: 'var(--brand-ink)' } },
    textarea: { base: { borderRadius: '8px' } },
  },
})
```

**Now:**

```ts
defineTheme({
  name: 'brand',
  components: {
    'progress-bar': { base: { color: 'var(--brand-ink)' } },
    'text-area': { base: { borderRadius: '8px' } },
  },
})
```

**What to do:** search the keys under `components:` and rename them with this table.

| Removed | Use instead |
| --- | --- |
| `base-table` | `table` |
| `checkbox` | `checkbox-indicator` |
| `codeblock`, `codeblock-copy-button`, `codeblock-header`, `codeblock-title` | `code-block`, `code-block-copy-button`, `code-block-header`, `code-block-title` |
| `date-input-clear-icon`, `date-range-input-clear-icon`, `multi-selector-clear-icon`, `selector-clear-icon` | `input-clear-icon` |
| `hovercard` | `hover-card` |
| `navicon` | `nav-icon` |
| `popover-surface` | `popover` |
| `progressbar`, `progressbar-fill`, `progressbar-mark`, `progressbar-track` | `progress-bar`, `progress-bar-fill`, `progress-bar-mark`, `progress-bar-track` |
| `radio`, `radio-dot` | `radio-indicator`, `radio-indicator-dot` |
| `statusdot` | `status-dot` |
| `textarea` | `text-area` |

An old name does not throw. It also does not match anything. Full detail in [Extend a theme](/en/themes/extending).

### Components no longer emit bare `primary` or `sm` classes

**What changed:** components such as Button no longer put `.primary`, `.secondary`, `.ghost`, `.destructive`, `.sm`, `.md` or `.lg` on their element. That information now lives in `[data-variant]` and `[data-size]`, plus prefixed modifier classes (upstream #6121).

**Before:**

```css
.my-toolbar .astryx-button.primary {
  border-radius: 999px;
}
```

**Now:**

```css
.my-toolbar .astryx-button[data-variant='primary'] {
  border-radius: 999px;
}
```

**What to do:** look for "component class plus variant word" in your stylesheets and switch to the attribute selector. The modifier class `.astryx-button--variant-primary` works the same way.

## Component APIs

### `labelHidden` is now `isLabelHidden`

**What changed:** the property that hides a field label is `isLabelHidden`. The old `labelHidden` still works and goes away in a later version.

**Before:**

```vue
<TextInput v-model="name" label="Name" labelHidden />
```

**Now:**

```vue
<TextInput v-model="name" label="Name" is-label-hidden />
```

**What to do:** replace `label-hidden` with `is-label-hidden` on Typeahead, Tokenizer, MultiSelector, Token and PowerSearch.

PowerSearch hides its label by default, and its rule is slightly different: when both names are passed the new one wins, when only the old one is passed the old one wins, and when neither is passed the label stays hidden. Every other component hides the label when either name is true.

### Selector `variant="default"` is now `variant="input"`

**What changed:** the bordered input step is called `input`. `default` is the old name and still works.

**Before:**

```vue
<Selector v-model="fruit" :options="options" variant="default" />
```

**Now:**

```vue
<Selector v-model="fruit" :options="options" variant="input" />
```

**What to do:** replace `variant="default"` with `variant="input"`. Leaving `variant` out behaves as before, still a bordered input. `default` keeps working for now and goes away in a later version.

MultiSelector and ComplexSelector only have `input`, `secondary` and `ghost`, so they need no change.

### Four new styling properties

**What changed:** input components gained `containerClass`, `containerStyle`, `controlClass` and `controlStyle` (upstream #7336 #7339 #7337 #7341).

An input has two places you can style:

- The shell: the layer that holds the label, the control and the status message. Use `container*`.
- The control box: the box that draws the border and background and holds icons and the clear button. Use `control*`.

Components with them: TextInput, TextArea, NumberInput, FileInput, DateInput, DateRangeInput, DateTimeInput, TimeInput, Typeahead, Tokenizer, Selector, MultiSelector, ComplexSelector, CheckboxList, RadioGroup, RadioList, Slider, PowerSearch.

**Before:** you could only write `class` on the component root, and where it landed depended on the component.

```vue
<TextInput v-model="name" label="Name" class="mt-4" />
```

**Now:** use the new properties to target the shell or the control box.

```vue
<TextInput
  v-model="name"
  label="Name"
  container-class="mt-4"
  control-class="font-mono"
/>
```

**What to do:** nothing is required. A `class` or `style` written on the root keeps today's landing spot; it is not dropped and you get no warning. This differs from upstream, which drops it and points you at `control*`. Switch to `container*` or `control*` only when a style lands somewhere you did not want.

Two things to know:

- `container*` only applies when there is a shell. Inside `InputGroup`, or inside a `FormLayout` with a sideways label, there is no shell, so it does nothing and a development warning appears once.
- `control*` never lands on the native `input`.

### `useDismiss` takes `dismissOnEscape` instead of `enableEscape`

**What changed:** the option used to ask "should Escape be handled". It now asks "what should Escape do when it reaches this layer" (upstream #4881).

**Before:**

```ts
useDismiss({
  container,
  isEnabled,
  enableEscape: true,
  onDismiss: close,
})
```

**Now:**

```ts
useDismiss({
  container,
  isEnabled,
  dismissOnEscape: 'close',
  onDismiss: close,
})
```

Three values:

- `'close'`: close this layer. This is the default.
- `'block'`: swallow the key and stay open.
- `'ignore'`: leave the key alone, for an input that handles Escape itself.

**What to do:** `true` becomes nothing or `'close'`. `false` needs a choice: `'block'` stops Escape at this layer, `'ignore'` lets the key travel on.

## Behavior

### Tab and TabMenu must sit inside TabList, Step must sit inside Stepper

**What changed:** a `Tab` outside a `TabList` used to degrade silently. It now throws. The same happens when an overlay boundary resets the membership (upstream #6457).

**Before:** a `Tab` rendered without a `TabList` still appeared, only keyboard handling was wrong.

**Now:** you get `useTabListContext must be used within TabList`. A `Step` outside a `Stepper` gets `useStepperContext must be used within Stepper`.

**What to do:** wrap each member in its container. If you use one inside overlay content, put another local `TabList` or `Stepper` inside the overlay. The overlay is a new membership boundary, so the outer container does not count.

### `useAstryxLocale()` can return a tag with a region

**What changed:** locale tags keep their region now. `en-gb` becomes `en-GB`, `ja-jp` becomes `ja-JP`, and dates and numbers follow that region.

`zh`, `zh-CN` and `zh-Hans` still become `zh-CN`. A tag that cannot be parsed falls back to `en`.

**Before:** `useAstryxLocale()` always returned a short tag such as `en` or `zh-CN`.

**Now:**

```ts
const locale = useAstryxLocale()
locale.value === 'en' // false when the tag is en-GB
```

**What to do:** do not compare the whole tag. Check the start of it.

```ts
const locale = useAstryxLocale()
locale.value.startsWith('zh') // Chinese
```

### Navigation menus forward their attributes

**What changed:** `NavHeadingMenu` and `NavHeadingMenuItem` used to ignore `id`, `aria-*`, `data-*` and event listeners written on the root. These now land on the menu element (upstream #7331).

**What to do:** nothing. But if you worked around the old behavior with an extra wrapper or a DOM query, that workaround may now run twice. Check it and remove it.

## Text and language

### Default names follow the current language

**What changed:** default accessible names that you never passed as props now follow the current language. This covers dropdown menus, context menus, the more-options button, the dialog close button, banner expand and collapse, and the switch loading label (upstream #6125 #7289).

**Before:** screen readers always heard English: `Menu`, `Context menu`, `More options`, `Close`, `Expand details`, `Collapse details`, `Loading`.

**Now:** a Chinese page gets 菜单, 快捷菜单, 更多选项, 关闭, 展开详情, 收起详情, 加载中. An English page still gets the English sentences.

**What to do:** if a test or script depends on those exact English strings, pass them yourself: `label`, `closeButtonLabel`, `loadingLabel`, `expandLabel`, `collapseLabel`.

### Built-in English text now matches upstream word for word

**What changed:** the built-in English text now matches upstream exactly. The Chinese text was adjusted to match as well.

These are the visible changes:

| Component | Before | Now |
| --- | --- | --- |
| SideNav | Sidebar | Side navigation |
| AppShell mobile nav and mobile drawer | Navigation | Mobile navigation |
| MobileNav close button | Close | Close navigation |
| Selector and MultiSelector with no options | No matches | No options |
| Selector and MultiSelector read-only | Read-only | Read only |
| PowerSearch number equals / not equals | equals / does not equal | is / is not |
| Typeahead clear button | Clear | Clear selection |
| Typeahead and Tokenizer loading | Loading results | Loading |
| DateInput unavailable date | That date is not available | Invalid date |
| Pagination first and last buttons | First page / Last page | Go to first page / Go to last page |
| Stepper status words | Completed / Warning / Error | completed / warning / error |

FileInput's three error messages and Calendar's three range announcements changed too, both to the upstream sentences.

**What to do:** update your own assertions. If your product supplies this text, nothing moves.

### Numbers at a thousand and above get a separator

**What changed:** numbers inside built-in text use the separator of the current language, so `1234` becomes `1,234`.

This covers Pagination page numbers and totals, Selector and MultiSelector result counts, Carousel slide numbers, CommandPalette result counts, Lightbox positions, AvatarGroup overflow, table selection counts and Stepper step numbers.

**What to do:** update the places that assert this text.

## Nothing to change

These upstream breaking changes have no counterpart in the Vue version.

- The `astryx layout` command group: we have no such command.
- `astryx doctor` no longer reads the agent environment variables: we have no such behavior.
- `emptySearchResultsText`, `minSizePx` / `maxSizePx` on `useResizable`, `isRtl` on `useGridFocus` / `useListFocus`, and `isImeKeyEvent` from the hooks entry: none of these names exist in the Vue version, so writing them does nothing. Use `emptySearchText`, `minSize` / `maxSize` instead.
