/**
 * @fileoverview Mathematical type definitions for quantum mechanics
 * @module core/types/math
 */

/**
 * Represents a complex number in the form a + bi
 * 
 * **Mathematical Definition:**
 * z = a + bi, where a, b ∈ ℝ and i² = -1
 * 
 * Used extensively in quantum mechanics for:
 * - Wave function amplitudes
 * - Quantum state coefficients
 * - Operator matrix elements
 */
export interface ComplexNumber {
    /** Real component (a in a + bi) */
    readonly real: number;
    /** Imaginary component (b in a + bi) */
    readonly imaginary: number;
}

/**
 * 2D Vector representation for classical physics
 */
export interface Vector2D {
    readonly x: number;
    readonly y: number;
}

/**
 * 3D Vector representation
 * 
 * Used for:
 * - Bloch sphere coordinates
 * - 3D force calculations
 * - Spatial representations
 */
export interface Vector3D {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}

/**
 * Matrix representation using complex numbers
 * 
 * **Structure:**
 * - Rows: outer array
 * - Columns: inner array
 * - Element [i][j]: row i, column j
 * 
 * @example
 * ```typescript
 * // 2x2 Identity matrix
 * const identity: ComplexMatrix = [
 *   [{ real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }],
 *   [{ real: 0, imaginary: 0 }, { real: 1, imaginary: 0 }]
 * ];
 * ```
 */
export type ComplexMatrix = ReadonlyArray<ReadonlyArray<ComplexNumber>>;

/**
 * Real-valued matrix (special case of ComplexMatrix)
 */
export type RealMatrix = ReadonlyArray<ReadonlyArray<number>>;

/**
 * Polar form of a complex number
 * z = r·e^(iθ) = r(cos θ + i sin θ)
 */
export interface PolarComplex {
    /** Magnitude (r) */
    readonly magnitude: number;
    /** Phase angle in radians (θ) */
    readonly phase: number;
}

/**
 * Numerical tolerance for floating-point comparisons
 */
export const EPSILON = 1e-10;

/**
 * Type guard to check if a number is effectively zero
 */
export function isEffectivelyZero(value: number, epsilon: number = EPSILON): boolean {
    return Math.abs(value) < epsilon;
}

/**
 * Type guard to check if two numbers are effectively equal
 */
export function areEffectivelyEqual(
    a: number,
    b: number,
    epsilon: number = EPSILON
): boolean {
    return Math.abs(a - b) < epsilon;
}
