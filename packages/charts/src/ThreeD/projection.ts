import type { Camera, NumericDomain3D, ProjectedPoint, ThreeDContext } from './types.js'
import { roundForMarkup } from '../utils.js'

export function computeDomain3D(data: Record<string, unknown>[], key: string): NumericDomain3D {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const row of data) {
    const value = row[key]
    if (typeof value !== 'number' || !Number.isFinite(value))
      continue
    min = Math.min(min, value)
    max = Math.max(max, value)
  }
  return [min === Number.POSITIVE_INFINITY ? 0 : min, max === Number.NEGATIVE_INFINITY ? 1 : max]
}

export function resolveDomain3D(
  data: Record<string, unknown>[],
  key: string,
  domain?: NumericDomain3D,
): NumericDomain3D {
  return domain && domain.every(Number.isFinite) ? domain : computeDomain3D(data, key)
}

export function normalize3D(value: number, domain: NumericDomain3D): number {
  const range = domain[1] - domain[0]
  return range === 0 ? 0.5 : (value - domain[0]) / range
}

export function clampElevation(value: number): number {
  return Math.max(-89, Math.min(89, value))
}

export function createProjection3D(
  width: number,
  height: number,
  camera: Camera,
): (x: number, y: number, z: number) => ProjectedPoint {
  const azimuth = camera.azimuth * Math.PI / 180
  const elevation = camera.elevation * Math.PI / 180
  const cosAz = Math.cos(azimuth)
  const sinAz = Math.sin(azimuth)
  const cosEl = Math.cos(elevation)
  const sinEl = Math.sin(elevation)
  const scale = Math.min(width, height) * 0.35
  const centerX = width / 2
  const centerY = height / 2

  return (nx, ny, nz) => {
    const x = nx - 0.5
    const y = ny - 0.5
    const z = nz - 0.5
    const rotatedX = x * cosAz + z * sinAz
    const rotatedZ = -x * sinAz + z * cosAz
    const rotatedY = y * cosEl - rotatedZ * sinEl
    // 坐标写进 SVG 属性，深度决定点的大小和透明度，都要舍掉引擎间最后一位的差异，
    // 服务端渲染和 hydration 才算得一样。深度多留几位，排序时少出并列。
    return {
      px: roundForMarkup(centerX + rotatedX * scale),
      py: roundForMarkup(centerY - rotatedY * scale),
      depth: roundForMarkup(y * sinEl + rotatedZ * cosEl, 6),
    }
  }
}

export function projectDatum3D(
  context: ThreeDContext,
  row: Record<string, unknown>,
): (ProjectedPoint & { nx: number, ny: number, nz: number }) | null {
  const x = row[context.xKey]
  const y = row[context.yKey]
  const z = row[context.zKey]
  if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number'
    || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
    return null
  }
  const nx = context.normalize(x, context.xDomain)
  const ny = context.normalize(y, context.yDomain)
  const nz = context.normalize(z, context.zDomain)
  return { nx, ny, nz, ...context.project(nx, ny, nz) }
}
