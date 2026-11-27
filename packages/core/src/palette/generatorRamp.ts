import type { AnchorResult, ColorTriple, GeneratedRamp, NormalizedFamily, PaletteMode, PaletteRecipe, PolarColor } from './generatorBase'
import type { TonalPaletteNormalizedRequest as NormalizedRequest, TonalPaletteAnchor, TonalPaletteRampDiagnostics } from './types'
import { hexToOklch, luminance, maxOklchChroma, normalizeColor, oklabCoordinates, oklabCoordinatesToHex, oklchClampedHex, toneToOklabLightness } from './color'
import { anchorPolarAtStop, clamp, colorToPolar, coordinatedChroma, DARK_CHROMA_FACTOR, grayFade, highToneChromaFactor, hueBalanceFactor, hueDistance, interpolateHue, MOST_VIVID_CHROMA, neutralPolar, PALETTE_BLACK, PALETTE_RECIPE, PALETTE_RECIPE_V2, PALETTE_WHITE, signedHueDelta, toneAdjustedHue, toneChromaEnvelope, V2_SHARED_ABOVE, V2_SHARED_FROM, V2_SHARED_FULL, vibrancyMultiplier } from './generatorBase'

/**
 * @param [chromaMultiplier] Share of its in-gamut chroma the stop
 * keeps (see darkChromaMultiplier).
 */
export function generateCandidate(
  source: PolarColor,
  tone: number,
  mode: PaletteMode,
  vibrancy: number,
  coordinateWithOtherFamilies: boolean,
  chromaMultiplier: number = 1,
  recipe: PaletteRecipe = PALETTE_RECIPE,
) {
  const adjustedTone = tone
  const adjustedHue = toneAdjustedHue(source.hue, adjustedTone)
  // Every recipe starts from v1's chroma, so a stop v2 does not share is
  // drawn exactly as v1 draws it.
  const baseChroma = coordinateWithOtherFamilies
    ? coordinatedChroma(source.chroma)
    : source.chroma
  let chroma
    = baseChroma
      * vibrancyMultiplier(vibrancy)
      * hueBalanceFactor(adjustedHue)
      * highToneChromaFactor(adjustedHue, adjustedTone)
      * toneChromaEnvelope(adjustedTone)
      * (mode === 'dark' ? DARK_CHROMA_FACTOR : 1)
  const lightness = toneToOklabLightness(adjustedTone)
  const maxChroma = maxOklchChroma(adjustedHue, lightness)
  // v2: a gray family's color fades toward white the way a gray scale's
  // does, so its pale stops (a page, a card on it) carry only a faint tint
  // of its hue; its darker stops keep their color.
  if (recipe === PALETTE_RECIPE_V2 && !coordinateWithOtherFamilies) {
    chroma *= grayFade(lightness)
  }
  // v2, on the pale side of a ramp (above its middle): the narrower a
  // stop's gamut is for the most vivid seed at the default vibrancy (a pale
  // tint), the more every request shares that gamut in proportion (the most
  // vivid seed at vibrancy 100 takes all of it), so such a stop follows the
  // seed's chroma, never raised above the seed's own, and the vibrancy,
  // instead of every request landing on the gamut's edge. A stop whose
  // gamut holds the most vivid seed at the default vibrancy shares nothing,
  // and the dark side never shares (role text and dark fills keep their
  // strength): those stops are drawn exactly as v1 draws them, for every
  // seed at every vibrancy.
  if (
    recipe === PALETTE_RECIPE_V2
    && coordinateWithOtherFamilies
    && adjustedTone > V2_SHARED_ABOVE
  ) {
    const shape
      = hueBalanceFactor(adjustedHue)
        * highToneChromaFactor(adjustedHue, adjustedTone)
        * toneChromaEnvelope(adjustedTone)
        * (mode === 'dark' ? DARK_CHROMA_FACTOR : 1)
    const narrow
      = (MOST_VIVID_CHROMA * vibrancyMultiplier(50) * shape)
        / Math.max(maxChroma, 1e-6)
    const share = smoothstep(
      (narrow - V2_SHARED_FROM) / (V2_SHARED_FULL - V2_SHARED_FROM),
    )
    if (share > 0) {
      const most = MOST_VIVID_CHROMA * vibrancyMultiplier(100) * shape
      const own
        = coordinatedChroma(source.chroma, recipe)
          * vibrancyMultiplier(vibrancy)
          * shape
      const shared = (own / most) * maxChroma
      chroma = (1 - share) * Math.min(chroma, maxChroma) + share * shared
    }
  }
  // A taper scales the chroma the stop shows after gamut mapping, so a stop
  // the gamut already limits loses the same share as any other stop.
  const shownChroma
    = chromaMultiplier === 1
      ? chroma
      : Math.min(chroma, maxChroma) * chromaMultiplier
  return {
    hex: oklchClampedHex(lightness, shownChroma, adjustedHue),
    gamutMapped: chroma > maxChroma + 0.000001,
  }
}

export function perceptualDelta(colorA: string, colorB: string) {
  const [lightnessA, aA, bA] = oklabCoordinates(colorA)
  const [lightnessB, aB, bB] = oklabCoordinates(colorB)
  return (
    Math.sqrt(
      (lightnessA - lightnessB) ** 2 + (aA - aB) ** 2 + (bA - bB) ** 2,
    ) * 100
  )
}

export function interpolateColor(colorA: string, colorB: string, amount: number) {
  const start = hexToOklch(colorA)
  const end = hexToOklch(colorB)
  return oklchClampedHex(
    start.L + (end.L - start.L) * amount,
    start.C + (end.C - start.C) * amount,
    interpolateHue(start.H, end.H, amount),
  )
}

export function applyAnchor(
  candidate: string,
  anchor: TonalPaletteAnchor,
): AnchorResult {
  const target = normalizeColor(anchor.color)
  let generatedColor = candidate
  if (anchor.policy === 'exact') {
    generatedColor = target
  }
  else if (anchor.policy === 'bounded') {
    const tolerance = Number(anchor.maxDeltaE)
    if (!Number.isFinite(tolerance) || tolerance < 0) {
      throw new Error(
        `Bounded anchor at stop ${anchor.stop} requires a non-negative maxDeltaE.`,
      )
    }
    if (perceptualDelta(candidate, target) > tolerance) {
      let low = 0
      let high = 1
      for (let index = 0; index < 18; index++) {
        const amount = (low + high) / 2
        const mixed = interpolateColor(target, candidate, amount)
        if (perceptualDelta(mixed, target) <= tolerance) {
          low = amount
        }
        else {
          high = amount
        }
      }
      generatedColor = interpolateColor(target, candidate, low)
    }
  }
  else if (anchor.policy === 'flexible') {
    generatedColor = interpolateColor(candidate, target, 0.35)
  }
  else {
    throw new Error(`Unknown anchor policy: ${anchor.policy as string}`)
  }
  return {
    ...anchor,
    color: target,
    generatedColor,
    deltaE: perceptualDelta(generatedColor, target),
  }
}

export function smoothstep(amount: number) {
  const value = clamp(amount, 0, 1)
  return value * value * (3 - 2 * value)
}

export function interpolateDelta(
  start: ColorTriple,
  end: ColorTriple,
  amount: number,
): ColorTriple {
  return [
    start[0] + (end[0] - start[0]) * amount,
    start[1] + (end[1] - start[1]) * amount,
    start[2] + (end[2] - start[2]) * amount,
  ]
}

export function correctionAtStop(
  corrections: { stop: number, delta: ColorTriple }[],
  stop: number,
): ColorTriple {
  const zero: ColorTriple = [0, 0, 0]
  if (corrections.length === 0) {
    return zero
  }
  const first = corrections[0]
  if (stop <= first.stop) {
    const boundary = Math.max(0, first.stop - 25)
    if (stop <= boundary && boundary !== first.stop) {
      return zero
    }
    const amount
      = boundary === first.stop
        ? 1
        : smoothstep((stop - boundary) / (first.stop - boundary))
    return interpolateDelta(zero, first.delta, amount)
  }
  const last = corrections[corrections.length - 1]
  if (stop >= last.stop) {
    const boundary = Math.min(100, last.stop + 25)
    if (stop >= boundary && boundary !== last.stop) {
      return zero
    }
    const amount
      = boundary === last.stop
        ? 1
        : smoothstep((stop - last.stop) / (boundary - last.stop))
    return interpolateDelta(last.delta, zero, amount)
  }
  const upperIndex = corrections.findIndex(item => item.stop > stop)
  const lower = corrections[upperIndex - 1]
  const upper = corrections[upperIndex]
  return interpolateDelta(
    lower.delta,
    upper.delta,
    smoothstep((stop - lower.stop) / (upper.stop - lower.stop)),
  )
}

export function applyAnchorCorrections(
  colors: Record<number, string>,
  stops: number[],
  anchors: TonalPaletteAnchor[],
) {
  if (anchors.length === 0) {
    return { colors, anchors: [] }
  }
  const corrections = anchors
    .map((anchor) => {
      const candidate = colors[anchor.stop]
      const result = applyAnchor(candidate, anchor)
      const base = oklabCoordinates(candidate)
      const target = oklabCoordinates(result.generatedColor)
      const delta: ColorTriple = [
        target[0] - base[0],
        target[1] - base[1],
        target[2] - base[2],
      ]
      return {
        stop: anchor.stop,
        delta,
        result,
      }
    })
    .sort((a, b) => a.stop - b.stop)
  const corrected: Record<number, string> = {}
  for (const stop of stops) {
    const base = oklabCoordinates(colors[stop])
    const delta = correctionAtStop(corrections, stop)
    corrected[stop] = oklabCoordinatesToHex([
      base[0] + delta[0],
      base[1] + delta[1],
      base[2] + delta[2],
    ])
  }
  for (const correction of corrections) {
    corrected[correction.stop] = correction.result.generatedColor
  }
  return {
    colors: corrected,
    anchors: corrections.map(correction => correction.result),
  }
}

export function assertAnchorSet(anchors: TonalPaletteAnchor[], stops: number[]) {
  const seen = new Set()
  for (const anchor of anchors) {
    const color = normalizeColor(anchor.color)
    if (!['light', 'dark'].includes(anchor.mode)) {
      throw new Error(`Unknown anchor mode: ${anchor.mode}`)
    }
    if (!stops.includes(anchor.stop)) {
      throw new Error(
        `Anchor stop ${anchor.stop} is not present in the requested stop layout.`,
      )
    }
    if (
      (anchor.stop === 0 && color !== PALETTE_BLACK)
      || (anchor.stop === 100 && color !== PALETTE_WHITE)
    ) {
      throw new Error(
        `Anchor stop ${anchor.stop} is reserved for exact ${anchor.stop === 0 ? 'black' : 'white'}; use an interior stop for a tinted endpoint.`,
      )
    }
    const key = `${anchor.mode}:${anchor.stop}`
    if (seen.has(key)) {
      throw new Error(
        `Duplicate anchor for ${anchor.mode} stop ${anchor.stop}.`,
      )
    }
    seen.add(key)
  }
}

export function buildDiagnostics(
  colors: Record<number, string>,
  stops: number[],
  sourceHue: number,
  gamutMappedStops: number[],
  anchors: AnchorResult[],
) {
  let monotonic = true
  let minimumAdjacentDeltaE = Number.POSITIVE_INFINITY
  let maximumAdjacentDeltaE = 0
  let maximumHueDrift = 0
  let hueIdentityRisk: TonalPaletteRampDiagnostics['hueIdentityRisk'] = null
  for (let index = 0; index < stops.length; index++) {
    const stop = stops[index]
    const color = colors[stop]
    const oklch = hexToOklch(color)
    if (oklch.C >= 0.015) {
      const drift = signedHueDelta(sourceHue, oklch.H)
      maximumHueDrift = Math.max(
        maximumHueDrift,
        hueDistance(sourceHue, oklch.H),
      )
      if (sourceHue >= 230 && sourceHue < 285 && drift > 12) {
        hueIdentityRisk = 'blue-to-purple'
      }
      if (sourceHue >= 70 && sourceHue < 115 && drift < -12) {
        hueIdentityRisk = 'yellow-to-brown'
      }
    }
    if (index === 0) {
      continue
    }
    const previous = colors[stops[index - 1]]
    if (luminance(color) + 0.000001 < luminance(previous)) {
      monotonic = false
    }
    const adjacentDelta = perceptualDelta(previous, color)
    minimumAdjacentDeltaE = Math.min(minimumAdjacentDeltaE, adjacentDelta)
    maximumAdjacentDeltaE = Math.max(maximumAdjacentDeltaE, adjacentDelta)
  }
  return {
    monotonic,
    minimumAdjacentDeltaE:
      minimumAdjacentDeltaE === Number.POSITIVE_INFINITY
        ? 0
        : minimumAdjacentDeltaE,
    maximumAdjacentDeltaE,
    maximumHueDrift,
    hueIdentityRisk,
    gamutMappedStops,
    anchors,
  }
}

/**
 * The share of its chroma a stop keeps under the request's
 * `darkChromaTaper`: the edge multiplier through `throughStop`, a smoothstep
 * back to 1 at `recoverAtStop`, and 1 from there on. Light ramps, neutral
 * families, and the black and white endpoints keep all of it.
 */
export function darkChromaMultiplier(
  taper: NormalizedRequest['darkChromaTaper'],
  family: NormalizedFamily,
  mode: PaletteMode,
  stop: number,
) {
  if (!taper || mode !== 'dark' || family.kind === 'neutral') {
    return 1
  }
  if (stop <= 0 || stop >= 100 || stop >= taper.recoverAtStop) {
    return 1
  }
  // Read own keys only. A family id such as `constructor` must not get a
  // multiplier from the object prototype.
  const edge = Object.hasOwn(taper.familyMultipliers, family.id)
    ? taper.familyMultipliers[family.id]
    : taper.edgeMultiplier
  if (stop <= taper.throughStop) {
    return edge
  }
  const recovery = smoothstep(
    (stop - taper.throughStop) / (taper.recoverAtStop - taper.throughStop),
  )
  return edge + (1 - edge) * recovery
}

export function generateRamp(
  request: NormalizedRequest,
  family: NormalizedFamily,
  mode: PaletteMode,
): GeneratedRamp {
  const seedHex = normalizeColor(family.seed)
  const anchors = (family.anchors ?? []).filter(anchor => anchor.mode === mode)
  assertAnchorSet(family.anchors ?? [], request.stops)
  const seed
    = family.kind === 'neutral'
      ? neutralPolar(request.neutralProfile, seedHex)
      : colorToPolar(seedHex)
  const colors: Record<number, string> = {}
  const gamutMappedStops = []
  const diagnosticReference = generateCandidate(
    seed,
    50,
    mode,
    request.vibrancy,
    family.kind !== 'neutral',
    darkChromaMultiplier(request.darkChromaTaper, family, mode, 50),
    request.recipe,
  ).hex
  for (const stop of request.stops) {
    const source = anchorPolarAtStop(seed, anchors, stop)
    const generated = generateCandidate(
      source,
      stop,
      mode,
      request.vibrancy,
      family.kind !== 'neutral',
      darkChromaMultiplier(request.darkChromaTaper, family, mode, stop),
      request.recipe,
    )
    colors[stop] = generated.hex
    if (generated.gamutMapped) {
      gamutMappedStops.push(stop)
    }
  }
  const corrected = applyAnchorCorrections(colors, request.stops, anchors)
  const diagnostics = buildDiagnostics(
    corrected.colors,
    request.stops,
    hexToOklch(diagnosticReference).H,
    gamutMappedStops,
    corrected.anchors,
  )
  if (!diagnostics.monotonic) {
    throw new Error(
      `${family.name} ${mode} ramp is not luminance-monotonic with the requested anchors.`,
    )
  }
  return { colors: corrected.colors, diagnostics }
}
