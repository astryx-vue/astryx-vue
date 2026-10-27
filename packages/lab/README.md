# @astryx-vue/lab

Vue 3 ports of the Astryx lab components (`@astryxdesign/lab`). This is an unofficial port, not affiliated with Meta.

**This package is canary-only.** Its `package.json` carries `private: true` plus `"astryxVue": { "canaryOnly": true }`, so it publishes to the npm `canary` dist-tag only — there is no stable release. Lab components are experiments: their props and markup can change or disappear in any canary build.

## Install

```bash
pnpm add @astryx-vue/lab@canary @astryx-vue/core vue
```

Each component imports its own stylesheet, so a bundler that understands `import './x.css'` is enough. If you prefer loading everything at once, import the package stylesheet once:

```js
import '@astryx-vue/lab/lab.css'
```

Or pick single files: `@astryx-vue/lab/styles/stat.css`, `.../log-stream.css`, and so on.

## Components

| Component | What it is |
| --- | --- |
| `Stat` | KPI/metric display: label, big tabular value, optional sentiment-aware delta, description, trend slot. |
| `CircularProgress` | Ring-shaped progress indicator, determinate or indeterminate. |
| `InfoTip` | Small "i" button that reveals a tooltip on hover, keyboard focus, and tap. |
| `SVGIcon` | CSS-variable-driven SVG icon with variations (linear, bold, twotone, bulk, broken), path roles, and mask-based gaps. |
| `LogStream` | Streaming log viewer with level accents, expandable detail rows, follow-scroll tailing, and a terminal variant. |

## Documentation

The prop tables live in the upstream docs; behaviour matches Astryx v0.7.1. Component pages for this port are not published yet.
