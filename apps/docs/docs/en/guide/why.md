---
title: Introduction
---

# Introduction

astryx-vue is an open-source Vue 3 reimplementation of Meta's [Astryx](https://github.com/facebook/astryx) design language. The upstream documentation is located at <https://astryx.atmeta.com>, built on React 19 and StyleX. astryx-vue is an independent community project bringing the aesthetics and engineering precision of Astryx to the Vue ecosystem.

## Core Focus

Rather than wrapping React components or introducing runtime adapters, astryx-vue reimagines Astryx natively for Vue. The implementation strictly mirrors four foundations:

1. **Design Tokens**: Structured design tokens across color, spacing, radius, and elevation.
2. **CSS Variables**: Unified light/dark theme variables leveraging native `light-dark()`.
3. **Motion System**: Calibrated durations and easing curves with built-in reduced-motion support.
4. **Component Grain**: Faithful component divisions matching the original design system.

All APIs embrace standard Vue 3 idioms: typed props, events, slots, `v-model`, and composables without unnecessary runtime abstractions.

## Architecture and Packages

The project separates component structure from visual theming:

- `@astryx-vue/core`: Component implementations, composables, and structural CSS.
- `@astryx-vue/themes`: Theme tokens, typography, and color definitions (currently providing Neutral).

The styles use standard CSS layers (`@layer astryx.*`), requiring no specialized CSS-in-JS toolchains.

## Icons and Patterns

To keep bundle footprints minimal, the library does not package a proprietary icon font or heavy component suite. Controls such as `IconButton` and `NavItem` accept CSS icon classes, seamlessly integrating with solutions like UnoCSS `presetIcons`, Iconify, or Lucide.

For specialized workflows, the library provides cohesive component patterns including `Chat` layouts, `Citation` elements, and `Markdown` presentations.

---

The public API strictly reflects current repository exports. Core styles and components follow native Web standards and modern Vue 3 patterns.
