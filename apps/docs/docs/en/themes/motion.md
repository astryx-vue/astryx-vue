---
title: Motion
---

# Motion

Durations come from the Neutral motion scale. The bases are fast 125, medium 300, and slow 700. Neighbors use a 0.75 ratio, and the results are rounded to 5 milliseconds. The standard easing, `--astryx-ease-standard`, is `cubic-bezier(0.24, 1, 0.4, 1)`: quick out of the gate, settling at the end. `--astryx-ease-entrance` and `--astryx-ease-move` time entrances and moves on screen, and equal the standard curve by default. `--astryx-ease-exit` is `cubic-bezier(0.3, 0, 0.6, 0.6)` for things leaving, and `--astryx-duration-exit` follows `--astryx-duration-fast`.

## Tempo and character

A theme's `motion` has two knobs that change the feel without listing durations:

- **`tempo`** scales every duration, from 0.75 to 1.5 (default 1), to the millisecond. Higher is slower. A value outside the range is clamped. Springs such as `useAnimator`'s follow it too.
- **`character`** picks the entrance and move curves: `'crisp'`, `'expressive'` (a little overshoot), or `'standard'` (the default), which keeps them on the standard curve. Exits are unchanged.

```ts
const calm = defineTheme({
  name: 'calm',
  motion: { tempo: 1.2, character: 'expressive' },
})
```

A duration scale (`fast`, `medium`, `ratio`) wins over `tempo` for the durations it sets, and must supply all three. Explicit `tokens` win over both. A child theme keeps each knob it leaves out, and an adaptation rule can set them. A theme with no `motion` writes no motion token.

## Shared keyframes

Shared enter and exit keyframes live in `@astryx-vue/core` at `styles/motion.css`. They are available when you import `@astryx-vue/core/styles.css`, or any component sheet that pulls that file in. Existing components still use their own animation names, and these shared utility classes provide reusable motion primitives:

| Class | Keyframes |
| --- | --- |
| `astryx-motion-fade-in` / `fade-out` | `astryx-fade-in` / `astryx-fade-out` |
| `astryx-motion-scale-in` / `scale-out` | `astryx-scale-in` / `astryx-scale-out` |
| `astryx-motion-slide-in-above` / `out` | from above |
| `astryx-motion-slide-in-below` / `out` | from below |
| `astryx-motion-slide-in-start` / `out` | from the start side |
| `astryx-motion-slide-in-end` / `out` | from the end side |

Distance and scale read `--astryx-motion-offset`, `--astryx-motion-scale-from`, and the opacity variables. When the system asks for reduced motion, those distances and the scale collapse to zero, opacity jumps to the end state, and the shared classes use a duration of `0.01ms`. Component duration tokens are left alone.

Replay the samples below. With reduced motion on, they sit at the end state.

<TokenReference locale="en" motion :sections="['duration', 'ease']" />
