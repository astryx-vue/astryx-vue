import type { ColorTriple, PaletteDial, PaletteMode, StopRef } from './mappingTables'
import type { MapState } from './mapState'
import { perceptualDelta } from './generatorRamp'
import { ACCENT_MUTED, BORDER, DARK_FILL, NON_TEXT, ON_MUTED, STATUS_MUTED, STATUS_TOKEN, TEXT, TEXT_STOP } from './mappingTables'
import { compositeOver, hex, round, shade, textName } from './mappingTools'

export function mapFamily(s: MapState, f: PaletteDial) {
  const { fills, context, t, stops, at, ref, rawOf, settingOf, side, solid, surfaces, contrast, over, parseColor, alphaOf, has, modes, checks, exact, unread, reports, put, each, pick } = s
  const word = f.id === 'accent' ? null : STATUS_TOKEN[f.id]
  const names = word
    ? {
        fill: `--color-${word}`,
        on: `--color-on-${word}`,
        text: `--color-text-${word}`,
        icon: `--color-icon-${word}`,
        muted: `--color-${word}-muted`,
        onMuted: `--color-on-${word}-muted` as string | null,
        border: `--color-border-${word}` as string | null,
        focus: null as string | null,
      }
    : {
        fill: '--color-accent',
        on: '--color-on-accent',
        text: '--color-text-accent',
        icon: '--color-icon-accent',
        muted: '--color-accent-muted',
        onMuted: null as string | null,
        border: null as string | null,
        focus: '--focus-outline-color' as string | null,
      }
  const plain = fills[f.id]
  const S = plain.stop
  const fillWord = f.id
  const exactFill: Partial<Record<PaletteMode, string>> = {}
  for (const m of modes) {
    const v = rawOf(names.fill, m)
    if (v) {
      exactFill[m] = v
    }
    else if (settingOf(names.fill, m) != null) {
      unread[names.fill] = String(settingOf(names.fill, m)).trim()
    }
  }
  if (Object.keys(exactFill).length) {
    exact[names.fill] = Object.fromEntries(
      Object.entries(exactFill).map(([m, v]) => {
        // A var() is named with the color it reads, so the note says
        // which color the text was picked for.
        const written = (
          settingOf(names.fill, m as PaletteMode) ?? ''
        ).trim()
        const rgb = parseColor(v)
        const color = rgb && alphaOf(v) >= 1 ? hex(rgb) : v
        return [m, /var\(/i.test(written) ? `${written} = ${color}` : v]
      }),
    )
  }

  const fill: Partial<Record<PaletteMode, StopRef>> = {}
  for (const m of modes) {
    if (m === 'light' || plain.dark) {
      fill[m] = { ...ref(f.id, m, S), exact: true }
      continue
    }
    // The dark fill when the exact color does not read there: shade 70,
    // else the shade nearest 70 that passes, else 70.
    const start = at(DARK_FILL)
    const order = [...stops]
      .filter(s => s > 0 && s < 100)
      .sort((a, b) => Math.abs(a - start) - Math.abs(b - start) || b - a)
    const found
      = order.find((s) => {
        const c = ref(f.id, m, s).color
        return (
          t.page(c, m, f.id) >= NON_TEXT && t.onFor(f.id, m, c).r >= TEXT
        )
      }) ?? start
    fill[m] = ref(f.id, m, found)
    // The shade nearest your color that passes, offered as the theme's
    // own dark fill when it is closer to your color than the one used.
    const near = [...stops]
      .filter(s => s > 0 && s < 100)
      .sort((a, b) => Math.abs(a - S) - Math.abs(b - S) || b - a)
      .find((s) => {
        const c = ref(f.id, m, s).color
        return (
          t.page(c, m, f.id) >= NON_TEXT && t.onFor(f.id, m, c).r >= TEXT
        )
      })
    const closer
      = near != null
        && Math.abs(near - S) < Math.abs(found - S)
        && context.setLine
        ? (() => {
            const c = ref(f.id, m, near).color
            const o = t.onFor(f.id, m, c)
            return `; for a fill closer to your color in dark: ${context.setLine(names.fill, c, 'dark')} (shade ${shade(near)}, the nearest that passes, with ${textName(o.on)} text at ${round(o.r)}:1)`
          })()
        : ''
    if (reports(names.fill)) {
      checks.push({
        token: names.fill,
        mode: m,
        stop: found,
        preferred: S,
        against: 'the dark page and the text on it',
        ratio: plain.ratio,
        needs: TEXT,
        pass: true,
        note: `in dark, ${names.fill} is shade ${shade(found)}, not your exact color: ${plain.why}${found === start ? '' : `; shade ${shade(start)} does not pass either, so it is the nearest shade that does`}${closer}`,
      })
    }
  }
  put(names.fill, f.id, fill)

  // Text on the fill reads on the fill the theme really uses: the exact
  // token setting when there is one. The exact color never moves; the
  // text changes instead.
  const on = each((m) => {
    const used = exactFill[m] ?? (fill[m] as StopRef).color
    // A see-through exact fill is measured as it shows on the surface.
    const o = t.onFor(fillWord, m, solid(used, m, f.id))
    const what = exactFill[m]
      ? `your exact ${names.fill} (${used}${alphaOf(used) < 1 ? `, as it shows: ${solid(used, m, f.id)}` : ''})`
      : `${names.fill} (shade ${shade(Number(fill[m]?.stop))})`
    const moved = o.on !== o.first
    if (reports(names.on)) {
      checks.push({
        token: names.on,
        mode: m,
        stop: o.on.stop,
        preferred: o.first.stop,
        against: what,
        ratio: round(o.r),
        needs: TEXT,
        pass: o.r >= TEXT,
        ...(o.r < TEXT
          ? {
              note: `text on ${what} reads at only ${round(o.r)}:1 in ${m} with white or near-black text (needs ${TEXT}:1); the fill keeps your color: pick a lighter or darker ${f.id}, or set ${names.on} exactly`,
            }
          : moved
            ? {
                note: `${names.on} uses ${textName(o.on)} text in ${m}, not ${textName(o.first)}, so it reads at ${round(o.r)}:1 on ${what}, where ${textName(o.other)} text reads at only ${round(o.otherR)}:1 (button and badge labels are normal-size text, which needs ${TEXT}:1); to keep ${textName(o.other)} text anyway, set ${names.on} exactly`,
              }
            : {}),
      })
    }
    return o.on
  })
  put(names.on, f.id, on)

  // A pale fill in light can disappear into the page: say so, and keep
  // the exact color, the setting's or the token's.
  if (modes.includes('light') && has(names.fill)) {
    const used = exactFill.light ?? (fill.light as StopRef).color
    const p = t.page(solid(used, 'light', f.id), 'light', f.id)
    // The nearest darker color that stands out from the light page.
    let darker: string | null = null
    const from = parseColor(solid(used, 'light', f.id))
    for (let i = 1; from && i <= 100 && !darker; i++) {
      const c = hex(from.map(v => Math.round(v * (1 - i / 100))))
      if (t.page(c, 'light', f.id) >= NON_TEXT) {
        darker = c
      }
    }
    if (p < NON_TEXT) {
      checks.push({
        token: names.fill,
        mode: 'light',
        stop: S,
        preferred: S,
        against: 'the light page',
        ratio: round(p),
        needs: NON_TEXT,
        pass: false,
        note: exactFill.light
          ? `in light, your exact ${names.fill} (${used}) stands out from the page at only ${round(p)}:1, and a fill needs ${NON_TEXT}:1, so its buttons and badges may not show: give it a darker color`
          : `in light, your exact ${f.id} stands out from the page at only ${round(p)}:1, and a fill needs ${NON_TEXT}:1, so ${names.fill} buttons and badges may not show: pick a darker ${f.id}`,
        ...(darker
          ? {
              fix: exactFill.light
                ? { thing: names.fill, value: darker, mode: 'light' as const }
                : { thing: f.id, value: darker },
            }
          : {}),
      })
    }
  }

  // The tint: the official stop, never the fill's own shade, see-through
  // or not.
  const muted = each((m) => {
    const i = side(m)
    const spec = word ? STATUS_MUTED[i] : ACCENT_MUTED[i]
    const [s, alpha] = Array.isArray(spec) ? spec : [spec, undefined]
    // Nearest the official stop first, both ways; on a tie (a layout
    // without that stop) lighter first in light, darker in dark.
    const usual = i === 0 ? 1 : -1
    const order = [...stops].sort(
      (a, b) =>
        Math.abs(a - s) - Math.abs(b - s)
        || (Math.sign(b - a) === usual ? 1 : -1),
    )
    const away = order.filter(x => x !== fill[m]?.stop)
    return ref(f.id, m, away[0] ?? order[0], alpha)
  })
  put(names.muted, f.id, muted)
  /** The tint the theme really shows: an exact setting wins. */
  const mutedSeen = (m: PaletteMode): [string, string][] => {
    const own = rawOf(names.muted, m)
    return own
      ? surfaces(m, f.id).map(([n, bg]) => [
          `your exact ${names.muted} over ${n}`,
          hex(
            compositeOver(
              parseColor(own) as ColorTriple,
              alphaOf(own),
              parseColor(bg) as ColorTriple,
            ),
          ),
        ])
      : over(names.muted, muted[m] as StopRef, surfaces(m, f.id))
  }

  // Accent text and icons are the color given where it reads on what
  // they sit on (the surfaces and the tint), in each mode its fill is
  // the exact color; only where it does not do they move, to the nearest
  // shade that reads, and the check says so.
  const text = each((m) => {
    const grounds = [...surfaces(m, f.id), ...mutedSeen(m)]
    // The fill the theme really shows in this mode: an exact token
    // setting of it, else the setting's own color at its shade. The text
    // starts from that color's nearest shade.
    const shown = exactFill[m] ? solid(exactFill[m], m, f.id) : null
    const start = shown
      ? stops.reduce((x, y) =>
          perceptualDelta(ref(f.id, m, y).color, shown)
          < perceptualDelta(ref(f.id, m, x).color, shown)
            ? y
            : x,
        )
      : S
    const own = shown
      ? { ...ref(f.id, m, start), color: shown }
      : fill[m]?.exact
        ? ref(f.id, m, S)
        : null
    if (own) {
      const r = Math.min(...grounds.map(([, bg]) => contrast(own.color, bg)))
      if (r >= TEXT && !shown) {
        if (reports(names.text)) {
          checks.push({
            token: names.text,
            mode: m,
            stop: S,
            preferred: S,
            against: grounds.map(([n]) => n).join(', '),
            ratio: round(r),
            needs: TEXT,
            pass: true,
          })
        }
        return own
      }
      const before = checks.length
      const moved = pick(names.text, f.id, m, start, grounds, TEXT)
      if (r >= TEXT) {
        return moved
      }
      const last = checks.length > before ? checks[checks.length - 1] : null
      if (last && (moved.stop !== start || shown)) {
        last.note = `${names.text} ${m}: your exact color (${own.color}) reads at only ${grounds
          .map(([n, bg]): [string, number] => [n, contrast(own.color, bg)])
          .filter(([, x]) => x < TEXT)
          .map(([n, x]) => `${round(x)}:1 on ${n}`)
          .join(
            ', ',
          )} (text needs ${TEXT}:1), so ${f.id === 'accent' ? 'links and accent text' : `${f.id} text and icons`} use shade ${shade(moved.stop)} (${moved.color}), the nearest that reads; the fill keeps your color, and an exact ${names.text} keeps any color you give it`
      }
      return moved
    }
    return pick(names.text, f.id, m, at(TEXT_STOP[side(m)]), grounds, TEXT)
  })
  put(names.text, f.id, text)
  put(names.icon, f.id, text)
  if (names.onMuted) {
    const onMuted = names.onMuted
    put(
      onMuted,
      f.id,
      each(m =>
        pick(onMuted, f.id, m, at(ON_MUTED[side(m)]), mutedSeen(m), TEXT),
      ),
    )
  }
  if (names.border) {
    put(
      names.border,
      f.id,
      each(m => ref(f.id, m, at(BORDER[side(m)]))),
    )
  }
  // The focus ring follows the fill; with an exact fill it keeps
  // following that (Core's ring reads --color-accent).
  if (names.focus && !Object.keys(exactFill).length) {
    const focus = names.focus
    put(
      focus,
      f.id,
      each(m =>
        pick(
          focus,
          f.id,
          m,
          (fill[m] as StopRef).stop,
          surfaces(m, f.id),
          NON_TEXT,
        ),
      ),
    )
  }
}
