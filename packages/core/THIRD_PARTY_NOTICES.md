# Third-party notices

## Astryx

This project is an unofficial community Vue port based on the public Astryx project:

- Repository: <https://github.com/facebook/astryx>
- Version used for the first round: `v0.4.1`
- Commit: `96f9917fe013a7062a403c58e54dfd47f482d89f`
- License: MIT
- Copyright: (c) 2026 Meta Platforms, Inc.

The TextInput, CheckboxInput, CheckboxIndicator, Slider, Banner and Field family added in October 2026 also references the upstream implementation at commit `92779d3fbd0f12e659203c7d719d5bb00935060c`, including TextInput, CheckboxInput, CheckboxIndicator, Slider, Banner, Field, FieldLabel, FieldStatus and the shared input styles. Their public behavior and visual structure are adapted into native Vue components under the same MIT license. The Vue model/events, scoped slots and async-state implementation are local adaptations.

The indicator family and semantic icon names added in October 2026 also reference the upstream implementation at commit `fdb53f3` (0.7.1), including CheckIndicator, RadioIndicator, the indicator registry, and the semantic icon name list. Their public behavior is adapted into Vue components and a name-to-Iconify map under the same MIT license. The Vue slots, composables, and built-in glyph fallback are local adaptations.

The locale JSON files in `locales/` are copied from `packages/core/locales` at commit `df75749470029f0b34680e13deac635f2d72c89d`. They stay in the upstream React Intl shape. `loadAstryxCatalog` maps their keys onto this package's message tree. The files are not hand-translated here.

When files or substantial portions are copied or adapted, their original copyright and license notices must be kept here or alongside the adapted files.

No Meta trademarks, logos, or endorsement are granted by the Astryx software license.

## Astryx license text

MIT License

Copyright (c) 2026 Meta Platforms, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## OverlayScrollbars

`ScrollbarsProvider` uses OverlayScrollbars as a runtime dependency. It is installed from npm and is not copied into this package. `styles/scrollbars.css` imports its stylesheet into the `astryx.base` layer and defines the `os-theme-astryx` theme.

- Repository: <https://github.com/KingSora/OverlayScrollbars>
- Version: `2.16.0`
- License: MIT
- Copyright: (c) Rene Haas | KingSora
