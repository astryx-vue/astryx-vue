import type { GeneratedFamily, NormalizedFamily, PaletteGenerationResult } from './generatorBase'
import type { TonalPaletteNormalizedRequest as NormalizedRequest, TonalPaletteCandidate, TonalPaletteGenerationInput } from './types'
import { hexToOklch, normalizeColor } from './color'
import { DARK_CHROMA_TAPER_KEYS, DEFAULT_21_STOPS, modesForStrategy, NEUTRAL_PROFILES, PALETTE_BLACK, PALETTE_RECIPE, PALETTE_RECIPES, PALETTE_WHITE, RESERVED_FAMILY_IDS, validateStops, vibrancyMultiplier } from './generatorBase'
import { generateRamp, perceptualDelta } from './generatorRamp'

export function nearestStop(stops: number[], target: number) {
  return stops.reduce((best, stop) =>
    Math.abs(stop - target) < Math.abs(best - target) ? stop : best,
  )
}

export function buildCoordinationDiagnostics(
  request: NormalizedRequest,
  families: GeneratedFamily[],
) {
  const stop = nearestStop(request.stops, 50)
  const chromaticIds = new Set(
    request.families
      .filter(family => family.kind !== 'neutral')
      .map(family => family.id),
  )
  return modesForStrategy(request.modeStrategy).map((mode) => {
    const samples = families
      .filter(family => chromaticIds.has(family.id) && family[mode])
      .map((family) => {
        const ramp = family[mode]
        if (!ramp) {
          throw new Error(`Missing ${mode} ramp for ${family.id}.`)
        }
        const color = ramp.colors[stop]
        return {
          id: family.id,
          name: family.name,
          color,
          chroma: hexToOklch(color).C,
        }
      })
    let closestFamilies: [string, string] | null = null
    let minimumFamilyDeltaE = Number.POSITIVE_INFINITY
    for (let index = 0; index < samples.length; index++) {
      for (let next = index + 1; next < samples.length; next++) {
        const delta = perceptualDelta(
          samples[index].color,
          samples[next].color,
        )
        if (delta < minimumFamilyDeltaE) {
          minimumFamilyDeltaE = delta
          closestFamilies = [samples[index].name, samples[next].name]
        }
      }
    }
    const byChroma = [...samples].sort((a, b) => a.chroma - b.chroma)
    const weakest = byChroma[0]
    const strongest = byChroma[byChroma.length - 1]
    return {
      mode,
      stop,
      closestFamilies,
      minimumFamilyDeltaE:
        minimumFamilyDeltaE === Number.POSITIVE_INFINITY
          ? null
          : minimumFamilyDeltaE,
      strongestFamily: strongest?.name ?? null,
      weakestFamily: weakest?.name ?? null,
      chromaRatio:
        weakest && strongest && weakest.chroma > 0.0001
          ? strongest.chroma / weakest.chroma
          : null,
    }
  })
}

export function assertMultiplier(value: unknown, label: string) {
  if (
    typeof value !== 'number'
    || !Number.isFinite(value)
    || value < 0
    || value > 1
  ) {
    throw new Error(`${label} must be a number from 0 to 1.`)
  }
  return value
}

/**
 * The request's dark chroma taper, checked against its stops and families,
 * or undefined when the request has none. The receipt records the taper, so
 * a field the taper does not read fails instead of changing nothing.
 */
export function normalizeDarkChromaTaper(
  taper: unknown,
  stops: number[],
  families: NormalizedFamily[],
): NormalizedRequest['darkChromaTaper'] {
  if (taper == null) {
    return undefined
  }
  if (typeof taper !== 'object' || Array.isArray(taper)) {
    throw new TypeError('darkChromaTaper must be an object.')
  }
  const fields = taper as Record<string, unknown>
  const unread = Object.keys(fields).filter(
    key => !DARK_CHROMA_TAPER_KEYS.includes(key),
  )
  if (unread.length > 0) {
    throw new Error(
      `darkChromaTaper does not read ${unread.join(', ')}; it reads ${DARK_CHROMA_TAPER_KEYS.join(', ')}.`,
    )
  }
  const { edgeMultiplier, throughStop, recoverAtStop, familyMultipliers }
    = fields
  const edge = assertMultiplier(
    edgeMultiplier,
    'darkChromaTaper.edgeMultiplier',
  )
  if (typeof throughStop !== 'number' || !stops.includes(throughStop)) {
    throw new Error(
      'darkChromaTaper.throughStop must be a stop in the requested stop layout.',
    )
  }
  if (
    typeof recoverAtStop !== 'number'
    || !stops.includes(recoverAtStop)
    || recoverAtStop <= throughStop
  ) {
    throw new Error(
      'darkChromaTaper.recoverAtStop must be a stop in the requested stop layout after throughStop.',
    )
  }
  if (
    familyMultipliers != null
    && (typeof familyMultipliers !== 'object' || Array.isArray(familyMultipliers))
  ) {
    throw new Error('darkChromaTaper.familyMultipliers must be an object.')
  }
  const multipliers: Record<string, number> = {}
  for (const [id, value] of Object.entries(familyMultipliers ?? {})) {
    const family = families.find(candidate => candidate.id === id)
    if (!family) {
      throw new Error(
        `darkChromaTaper.familyMultipliers names unknown family ${id}.`,
      )
    }
    if (family.kind === 'neutral') {
      throw new Error(
        `darkChromaTaper.familyMultipliers names neutral family ${id}; the taper changes only chromatic families.`,
      )
    }
    multipliers[id] = assertMultiplier(
      value,
      `darkChromaTaper.familyMultipliers.${id}`,
    )
  }
  return {
    edgeMultiplier: edge,
    throughStop,
    recoverAtStop,
    familyMultipliers: multipliers,
  }
}

export function normalizeGenerationRequest(
  input: TonalPaletteGenerationInput,
): NormalizedRequest {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Palette generation config must be an object.')
  }
  const families = input.families
  if (!Array.isArray(families) || families.length === 0) {
    throw new Error('Palette generation requires at least one family.')
  }
  // A request that names no recipe runs the first one, so a config written
  // before v2 regenerates the same colors.
  const recipe = input.recipe ?? PALETTE_RECIPE
  if (!PALETTE_RECIPES.includes(recipe)) {
    throw new Error(
      `Unknown palette recipe: ${input.recipe} (known: ${PALETTE_RECIPES.join(', ')}).`,
    )
  }
  const modeStrategy = input.modeStrategy ?? 'light-and-dark'
  const modes = modesForStrategy(modeStrategy)
  const stops = validateStops(input.stops ?? DEFAULT_21_STOPS)
  const ids = new Set()
  const normalizedFamilies = families.map((family, index) => {
    if (!family || typeof family !== 'object' || Array.isArray(family)) {
      throw new Error(`Family ${index} must be an object.`)
    }
    const id = `${family.id ?? ''}`.trim()
    if (!/^[a-z][a-z0-9-]*$/.test(id)) {
      throw new Error(
        `Family ${index} id must use lower-kebab-case characters.`,
      )
    }
    if (RESERVED_FAMILY_IDS.includes(id)) {
      throw new Error(
        `Family id ${id} is reserved for the standalone ${id} palette value.`,
      )
    }
    if (ids.has(id)) {
      throw new Error(`Duplicate family id: ${id}.`)
    }
    ids.add(id)
    const kind = family.kind ?? 'chromatic'
    if (!['chromatic', 'neutral'].includes(kind)) {
      throw new Error(`Unknown family kind: ${kind}`)
    }
    if (family.anchors != null && !Array.isArray(family.anchors)) {
      throw new Error(`Family ${id} anchors must be an array.`)
    }
    const anchors = (family.anchors ?? []).map((anchor, anchorIndex) => {
      if (!anchor || typeof anchor !== 'object' || Array.isArray(anchor)) {
        throw new Error(
          `Family ${id} anchor ${anchorIndex} must be an object.`,
        )
      }
      if (!['light', 'dark'].includes(anchor.mode)) {
        throw new Error(`Unknown anchor mode: ${anchor.mode}`)
      }
      if (!modes.includes(anchor.mode)) {
        throw new Error(
          `Anchor mode ${anchor.mode} is not generated by mode strategy ${modeStrategy}.`,
        )
      }
      if (!Number.isFinite(anchor.stop) || !stops.includes(anchor.stop)) {
        throw new Error(
          `Anchor stop ${anchor.stop} is not present in the requested stop layout.`,
        )
      }
      if (!['exact', 'bounded', 'flexible'].includes(anchor.policy)) {
        throw new Error(`Unknown anchor policy: ${anchor.policy}`)
      }
      const maxDeltaE = anchor.maxDeltaE
      if (
        anchor.policy === 'bounded'
        && (typeof maxDeltaE !== 'number'
          || !Number.isFinite(maxDeltaE)
          || maxDeltaE < 0)
      ) {
        throw new Error(
          `Bounded anchor at stop ${anchor.stop} requires a non-negative maxDeltaE.`,
        )
      }
      if (anchor.policy !== 'bounded' && maxDeltaE != null) {
        throw new Error(
          `Anchor policy ${anchor.policy} does not accept maxDeltaE.`,
        )
      }
      const color = normalizeColor(anchor.color)
      if (
        (anchor.stop === 0 && color !== PALETTE_BLACK)
        || (anchor.stop === 100 && color !== PALETTE_WHITE)
      ) {
        throw new Error(
          `Anchor stop ${anchor.stop} is reserved for exact ${anchor.stop === 0 ? 'black' : 'white'}; use an interior stop for a tinted endpoint.`,
        )
      }
      return {
        mode: anchor.mode,
        stop: anchor.stop,
        color,
        policy: anchor.policy,
        ...(anchor.policy === 'bounded' ? { maxDeltaE } : {}),
      }
    })
    return {
      id,
      name: `${family.name ?? id}`,
      seed: normalizeColor(family.seed),
      kind,
      anchors,
    }
  })
  const neutralProfile = input.neutralProfile ?? 'neutral-v1'
  // The receipt records this request, so an unknown profile fails even when no
  // neutral family reads it.
  if (!NEUTRAL_PROFILES.includes(neutralProfile)) {
    throw new Error(`Unknown neutral profile: ${neutralProfile}`)
  }
  const darkChromaTaper = normalizeDarkChromaTaper(
    input.darkChromaTaper,
    stops,
    normalizedFamilies,
  )
  const request: NormalizedRequest = {
    recipe,
    vibrancy: input.vibrancy ?? 50,
    neutralProfile,
    modeStrategy,
    ...(darkChromaTaper ? { darkChromaTaper } : {}),
    stops,
    families: normalizedFamilies,
  }
  vibrancyMultiplier(request.vibrancy)
  return request
}

export function generatePaletteSet(
  input: TonalPaletteGenerationInput,
): PaletteGenerationResult {
  const request = normalizeGenerationRequest(input)
  const families: GeneratedFamily[] = []
  const errors: { familyId: string, message: string }[] = []
  for (const family of request.families) {
    try {
      const generated: GeneratedFamily = {
        id: family.id,
        name: family.name,
        seed: family.seed,
      }
      for (const mode of modesForStrategy(request.modeStrategy)) {
        generated[mode] = generateRamp(request, family, mode)
      }
      families.push(generated)
    }
    catch (error) {
      errors.push({
        familyId: family.id,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }
  return {
    recipe: request.recipe,
    status: 'candidate',
    request,
    families,
    coordination: buildCoordinationDiagnostics(request, families),
    errors,
  }
}

/**
 * Generate candidate palette data without reading or writing files.
 */
export function generateTonalPalette(
  input: TonalPaletteGenerationInput,
): TonalPaletteCandidate {
  const result = generatePaletteSet(input)
  if (result.errors.length > 0) {
    throw new Error(
      result.errors
        .map(error => `${error.familyId}: ${error.message}`)
        .join('\n'),
    )
  }
  return {
    schemaVersion: 1,
    status: 'candidate',
    recipe: result.recipe,
    black: PALETTE_BLACK,
    white: PALETTE_WHITE,
    stops: [...result.request.stops],
    palette: Object.fromEntries(
      result.families.map(family => [
        family.id,
        {
          name: family.name,
          ...(family.light ? { light: family.light.colors } : {}),
          ...(family.dark ? { dark: family.dark.colors } : {}),
        },
      ]),
    ),
  }
}

export function serializeGenerationResult(result: unknown) {
  return `${JSON.stringify(result, null, 2)}\n`
}
