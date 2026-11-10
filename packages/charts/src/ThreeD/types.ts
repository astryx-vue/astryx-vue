export interface Point3D {
  x: number
  y: number
  z: number
}

export interface ProjectedPoint {
  px: number
  py: number
  depth: number
}

export interface Camera {
  azimuth: number
  elevation: number
}

export type NumericDomain3D = [number, number]

export interface ThreeDChartProps {
  data: Record<string, unknown>[]
  xKey: string
  yKey: string
  zKey: string
  xDomain?: NumericDomain3D
  yDomain?: NumericDomain3D
  zDomain?: NumericDomain3D
  /** SSR 和首次测量的显式宽度；0 表示等待容器测量。 */
  width?: number
  height?: number
  azimuth?: number
  elevation?: number
  interactive?: boolean
  /** 每帧旋转度数；0 关闭。减少动态效果偏好下始终停用。 */
  autoRotate?: number
  label?: string
}

export interface ThreeDContext {
  readonly width: number
  readonly height: number
  readonly data: Record<string, unknown>[]
  readonly xKey: string
  readonly yKey: string
  readonly zKey: string
  readonly project: (x: number, y: number, z: number) => ProjectedPoint
  readonly xDomain: NumericDomain3D
  readonly yDomain: NumericDomain3D
  readonly zDomain: NumericDomain3D
  readonly normalize: (value: number, domain: NumericDomain3D) => number
  readonly camera: Camera
}

export interface ThreeDScatterProps {
  color: string
  radius?: number
  opacity?: number
}

export interface ThreeDBarProps {
  color: string
  barWidth?: number
  barDepth?: number
}

export interface ThreeDGridProps {
  divisions?: number
}

export interface ThreeDAxisProps {
  labels?: boolean
}

export interface ThreeDSurfaceProps {
  colorRange: string[]
  opacity?: number
  wireframe?: boolean
}
