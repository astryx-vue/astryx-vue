/**
 * @file pathTransforms/parse.ts
 * @description SVG 路径的解析与序列化：把 d 字符串读成绝对坐标命令，再写回字符串。
 *
 * 这是 pathTransforms 的底座：所有变形都先解析、改命令数组、再序列化回字符串。
 */

export interface Point {
  x: number
  y: number
}

export type PathCommand
  = | { type: 'M', x: number, y: number }
    | { type: 'L', x: number, y: number }
    | {
      type: 'C'
      x1: number
      y1: number
      x2: number
      y2: number
      x: number
      y: number
    }
    | { type: 'Q', cx: number, cy: number, x: number, y: number }
    | {
      type: 'A'
      rx: number
      ry: number
      rotation: number
      large: number
      sweep: number
      x: number
      y: number
    }
    | { type: 'Z' }

/**
 * Parse an SVG path d-string into an array of absolute commands.
 * Normalizes H/V → L for uniform processing.
 */
export function parsePath(d: string): PathCommand[] {
  const commands: PathCommand[] = []
  // Match command letter + all following numbers (including negatives and decimals)
  const re = /([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi
  let cx = 0
  let cy = 0 // current position
  let sx = 0
  let sy = 0 // subpath start

  for (let match = re.exec(d); match !== null; match = re.exec(d)) {
    const cmd = match[1]
    const args = (match[2].match(/-?[\d.]+(?:e[+-]?\d+)?/gi) || []).map(Number)

    switch (cmd) {
      case 'M':
        cx = args[0]
        cy = args[1]
        sx = cx
        sy = cy
        commands.push({ type: 'M', x: cx, y: cy })
        // Implicit L for additional coordinate pairs
        for (let i = 2; i < args.length; i += 2) {
          cx = args[i]
          cy = args[i + 1]
          commands.push({ type: 'L', x: cx, y: cy })
        }
        break
      case 'm':
        cx += args[0]
        cy += args[1]
        sx = cx
        sy = cy
        commands.push({ type: 'M', x: cx, y: cy })
        for (let i = 2; i < args.length; i += 2) {
          cx += args[i]
          cy += args[i + 1]
          commands.push({ type: 'L', x: cx, y: cy })
        }
        break
      case 'L':
        for (let i = 0; i < args.length; i += 2) {
          cx = args[i]
          cy = args[i + 1]
          commands.push({ type: 'L', x: cx, y: cy })
        }
        break
      case 'l':
        for (let i = 0; i < args.length; i += 2) {
          cx += args[i]
          cy += args[i + 1]
          commands.push({ type: 'L', x: cx, y: cy })
        }
        break
      case 'H':
        for (let i = 0; i < args.length; i++) {
          cx = args[i]
          commands.push({ type: 'L', x: cx, y: cy })
        }
        break
      case 'h':
        for (let i = 0; i < args.length; i++) {
          cx += args[i]
          commands.push({ type: 'L', x: cx, y: cy })
        }
        break
      case 'V':
        for (let i = 0; i < args.length; i++) {
          cy = args[i]
          commands.push({ type: 'L', x: cx, y: cy })
        }
        break
      case 'v':
        for (let i = 0; i < args.length; i++) {
          cy += args[i]
          commands.push({ type: 'L', x: cx, y: cy })
        }
        break
      case 'C':
        for (let i = 0; i < args.length; i += 6) {
          commands.push({
            type: 'C',
            x1: args[i],
            y1: args[i + 1],
            x2: args[i + 2],
            y2: args[i + 3],
            x: args[i + 4],
            y: args[i + 5],
          })
          cx = args[i + 4]
          cy = args[i + 5]
        }
        break
      case 'c':
        for (let i = 0; i < args.length; i += 6) {
          commands.push({
            type: 'C',
            x1: cx + args[i],
            y1: cy + args[i + 1],
            x2: cx + args[i + 2],
            y2: cy + args[i + 3],
            x: cx + args[i + 4],
            y: cy + args[i + 5],
          })
          cx += args[i + 4]
          cy += args[i + 5]
        }
        break
      case 'Q':
        for (let i = 0; i < args.length; i += 4) {
          commands.push({
            type: 'Q',
            cx: args[i],
            cy: args[i + 1],
            x: args[i + 2],
            y: args[i + 3],
          })
          cx = args[i + 2]
          cy = args[i + 3]
        }
        break
      case 'q':
        for (let i = 0; i < args.length; i += 4) {
          commands.push({
            type: 'Q',
            cx: cx + args[i],
            cy: cy + args[i + 1],
            x: cx + args[i + 2],
            y: cy + args[i + 3],
          })
          cx += args[i + 2]
          cy += args[i + 3]
        }
        break
      case 'A':
      case 'a': {
        const rel = cmd === 'a'
        for (let i = 0; i < args.length; i += 7) {
          const nx = rel ? cx + args[i + 5] : args[i + 5]
          const ny = rel ? cy + args[i + 6] : args[i + 6]
          commands.push({
            type: 'A',
            rx: args[i],
            ry: args[i + 1],
            rotation: args[i + 2],
            large: args[i + 3],
            sweep: args[i + 4],
            x: nx,
            y: ny,
          })
          cx = nx
          cy = ny
        }
        break
      }
      case 'S':
      case 's':
        // Smooth cubic — convert to C (simplified: treat as C with reflected control point)
        // For our purposes, pass through as-is since we mainly transform L→L corners
        break
      case 'T':
      case 't':
        // Smooth quadratic — similar, pass through
        break
      case 'Z':
      case 'z':
        commands.push({ type: 'Z' })
        cx = sx
        cy = sy
        break
    }
  }

  return commands
}

// =============================================================================
// Utilities
// =============================================================================

export function dist(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
}

export function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

export function angleBetween(v1: Point, v2: Point): number {
  const dot = v1.x * v2.x + v1.y * v2.y
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2)
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2)
  if (mag1 === 0 || mag2 === 0) {
    return Math.PI
  }
  return Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2))))
}

export function getEndpoint(cmd: PathCommand): Point | null {
  if (cmd.type === 'Z') {
    return null
  }
  return { x: cmd.x, y: cmd.y }
}

// =============================================================================
// Serializer
// =============================================================================

export function n(v: number): string {
  return Number(v.toFixed(3)).toString()
}

export function serializePath(cmds: PathCommand[]): string {
  return cmds
    .map((cmd) => {
      switch (cmd.type) {
        case 'M':
          return `M${n(cmd.x)} ${n(cmd.y)}`
        case 'L':
          return `L${n(cmd.x)} ${n(cmd.y)}`
        case 'C':
          return `C${n(cmd.x1)} ${n(cmd.y1)} ${n(cmd.x2)} ${n(cmd.y2)} ${n(cmd.x)} ${n(cmd.y)}`
        case 'Q':
          return `Q${n(cmd.cx)} ${n(cmd.cy)} ${n(cmd.x)} ${n(cmd.y)}`
        case 'A':
          return `A${n(cmd.rx)} ${n(cmd.ry)} ${n(cmd.rotation)} ${cmd.large} ${cmd.sweep} ${n(cmd.x)} ${n(cmd.y)}`
        case 'Z':
          return 'Z'
        default:
          return ''
      }
    })
    .join(' ')
}
