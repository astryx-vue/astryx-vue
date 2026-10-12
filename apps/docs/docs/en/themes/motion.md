---
title: Motion
---

# Motion

Durations come from the Neutral motion scale. The bases are fast 125, medium 300, and slow 700. Neighbors use a 0.75 ratio, and the results are rounded to 5 milliseconds. There is one easing token, `--astryx-ease-standard`: `cubic-bezier(0.24, 1, 0.4, 1)`.

Shared enter and exit keyframes live in `@astryx-vue/core` at `styles/motion.css`. They are available when you import `@astryx-vue/core/styles.css`, or any component sheet that pulls that file in. Existing components still use their own animation names. These shared names are for later components and for this page:

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
