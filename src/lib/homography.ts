export interface Point {
  x: number
  y: number
}

export interface HomographyMatrix {
  h00: number
  h01: number
  h02: number
  h10: number
  h11: number
  h12: number
  h20: number
  h21: number
}

/**
 * Computes the 3x3 projective transformation matrix (homography)
 * that maps 4 source points to 4 destination points using Gaussian elimination.
 */
export function solveHomography(src: Point[], dst: Point[]): HomographyMatrix {
  const A: number[][] = []
  const b: number[] = []

  for (let i = 0; i < 4; i++) {
    const { x: u, y: v } = src[i]
    const { x, y } = dst[i]
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x])
    b.push(x)
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y])
    b.push(y)
  }

  const n = 8
  for (let i = 0; i < n; i++) {
    let maxRow = i
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k
    }
    ;[A[i], A[maxRow]] = [A[maxRow], A[i]]
    ;[b[i], b[maxRow]] = [b[maxRow], b[i]]

    const pivot = A[i][i]
    if (Math.abs(pivot) < 1e-12) continue
    for (let j = i; j < n; j++) A[i][j] /= pivot
    b[i] /= pivot

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = A[k][i]
        for (let j = i; j < n; j++) A[k][j] -= factor * A[i][j]
        b[k] -= factor * b[i]
      }
    }
  }

  const [h00, h01, h02, h10, h11, h12, h20, h21] = b
  return { h00, h01, h02, h10, h11, h12, h20, h21 }
}

/**
 * Converts a homography matrix to a CSS 3D matrix string `matrix3d(...)`
 * compatible with CSS transform and transform-origin: 0 0.
 */
export function getMatrix3d(hom: HomographyMatrix): string {
  const { h00, h01, h02, h10, h11, h12, h20, h21 } = hom
  return `matrix3d(${h00.toFixed(8)}, ${h10.toFixed(8)}, 0, ${h20.toFixed(8)}, ${h01.toFixed(8)}, ${h11.toFixed(8)}, 0, ${h21.toFixed(8)}, 0, 0, 1, 0, ${h02.toFixed(8)}, ${h12.toFixed(8)}, 0, 1)`
}

/**
 * Linearly interpolates between two sets of 4 corner points.
 * t = 0 -> current quad, t = 1 -> target rectangle
 */
export function interpolateQuad(q0: Point[], q1: Point[], t: number): Point[] {
  return q0.map((p, i) => ({
    x: p.x + (q1[i].x - p.x) * t,
    y: p.y + (q1[i].y - p.y) * t,
  }))
}
