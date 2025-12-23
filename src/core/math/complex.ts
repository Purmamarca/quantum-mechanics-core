/**
 * @fileoverview Complex number operations
 * @module core/math/complex
 */

import type { ComplexNumber, PolarComplex } from '../types/math.types.js';
import { EPSILON, isEffectivelyZero, areEffectivelyEqual } from '../types/math.types.js';

/**
 * Creates a complex number
 * 
 * @param real - Real component
 * @param imaginary - Imaginary component (default: 0)
 * @returns Complex number
 */
export function complex(real: number, imaginary: number = 0): ComplexNumber {
    return { real, imaginary };
}

/**
 * Adds two complex numbers
 * 
 * **Mathematical Definition:**
 * (a + bi) + (c + di) = (a + c) + (b + d)i
 * 
 * @param a - First complex number
 * @param b - Second complex number
 * @returns Sum of a and b
 */
export function add(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return {
        real: a.real + b.real,
        imaginary: a.imaginary + b.imaginary
    };
}

/**
 * Subtracts two complex numbers
 * 
 * **Mathematical Definition:**
 * (a + bi) - (c + di) = (a - c) + (b - d)i
 * 
 * @param a - First complex number
 * @param b - Second complex number
 * @returns Difference a - b
 */
export function subtract(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return {
        real: a.real - b.real,
        imaginary: a.imaginary - b.imaginary
    };
}

/**
 * Multiplies two complex numbers
 * 
 * **Mathematical Definition:**
 * (a + bi)(c + di) = (ac - bd) + (ad + bc)i
 * 
 * @param a - First complex number
 * @param b - Second complex number
 * @returns Product of a and b
 */
export function multiply(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return {
        real: a.real * b.real - a.imaginary * b.imaginary,
        imaginary: a.real * b.imaginary + a.imaginary * b.real
    };
}

/**
 * Divides two complex numbers
 * 
 * **Mathematical Definition:**
 * (a + bi)/(c + di) = [(a + bi)(c - di)] / (c² + d²)
 * 
 * @param a - Numerator
 * @param b - Denominator
 * @returns Quotient a / b
 * @throws {Error} If denominator is zero
 */
export function divide(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    const denominator = b.real * b.real + b.imaginary * b.imaginary;

    if (isEffectivelyZero(denominator)) {
        throw new Error('Division by zero: denominator has zero magnitude');
    }

    return {
        real: (a.real * b.real + a.imaginary * b.imaginary) / denominator,
        imaginary: (a.imaginary * b.real - a.real * b.imaginary) / denominator
    };
}

/**
 * Computes the complex conjugate
 * 
 * **Mathematical Definition:**
 * (a + bi)* = a - bi
 * 
 * **Physics Application:**
 * Used in calculating probability amplitudes: P = |ψ|² = ψ*ψ
 * 
 * @param z - Complex number
 * @returns Complex conjugate of z
 */
export function conjugate(z: ComplexNumber): ComplexNumber {
    return {
        real: z.real,
        imaginary: z.imaginary === 0 ? 0 : -z.imaginary
    };
}

/**
 * Computes the magnitude (absolute value) of a complex number
 * 
 * **Mathematical Definition:**
 * |a + bi| = √(a² + b²)
 * 
 * **Physics Application:**
 * The magnitude squared gives probability: P = |α|²
 * 
 * @param z - Complex number
 * @returns Magnitude of z
 */
export function magnitude(z: ComplexNumber): number {
    return Math.sqrt(z.real * z.real + z.imaginary * z.imaginary);
}

/**
 * Computes the magnitude squared (more efficient than magnitude)
 * 
 * **Mathematical Definition:**
 * |a + bi|² = a² + b²
 * 
 * @param z - Complex number
 * @returns Magnitude squared of z
 */
export function magnitudeSquared(z: ComplexNumber): number {
    return z.real * z.real + z.imaginary * z.imaginary;
}

/**
 * Computes the phase (argument) of a complex number
 * 
 * **Mathematical Definition:**
 * arg(a + bi) = arctan(b/a)
 * 
 * Returns value in range [-π, π]
 * 
 * @param z - Complex number
 * @returns Phase angle in radians
 */
export function phase(z: ComplexNumber): number {
    return Math.atan2(z.imaginary, z.real);
}

/**
 * Converts complex number to polar form
 * 
 * **Mathematical Definition:**
 * a + bi = r·e^(iθ) where r = |z| and θ = arg(z)
 * 
 * @param z - Complex number in rectangular form
 * @returns Polar representation
 */
export function toPolar(z: ComplexNumber): PolarComplex {
    return {
        magnitude: magnitude(z),
        phase: phase(z)
    };
}

/**
 * Converts polar form to rectangular complex number
 * 
 * **Mathematical Definition:**
 * r·e^(iθ) = r·cos(θ) + i·r·sin(θ)
 * 
 * @param polar - Polar representation
 * @returns Complex number in rectangular form
 */
export function fromPolar(polar: PolarComplex): ComplexNumber {
    return {
        real: polar.magnitude * Math.cos(polar.phase),
        imaginary: polar.magnitude * Math.sin(polar.phase)
    };
}

/**
 * Raises a complex number to a power
 * 
 * **Mathematical Definition:**
 * z^n = r^n · e^(inθ) where z = r·e^(iθ)
 * 
 * @param z - Base complex number
 * @param n - Exponent (real number)
 * @returns z raised to the power n
 */
export function pow(z: ComplexNumber, n: number): ComplexNumber {
    const polar = toPolar(z);
    return fromPolar({
        magnitude: Math.pow(polar.magnitude, n),
        phase: polar.phase * n
    });
}

/**
 * Computes e^(iz) for complex z
 * 
 * **Mathematical Definition:**
 * e^(i(a+bi)) = e^(-b) · [cos(a) + i·sin(a)]
 * 
 * **Physics Application:**
 * Used in quantum time evolution: |ψ(t)⟩ = e^(-iHt/ℏ)|ψ(0)⟩
 * 
 * @param z - Complex exponent
 * @returns e^(iz)
 */
export function expI(z: ComplexNumber): ComplexNumber {
    const expReal = Math.exp(-z.imaginary);
    return {
        real: expReal * Math.cos(z.real),
        imaginary: expReal * Math.sin(z.real)
    };
}

/**
 * Multiplies a complex number by a real scalar
 * 
 * @param scalar - Real number
 * @param z - Complex number
 * @returns scalar * z
 */
export function scale(scalar: number, z: ComplexNumber): ComplexNumber {
    return {
        real: scalar * z.real,
        imaginary: scalar * z.imaginary
    };
}

/**
 * Checks if two complex numbers are equal (within tolerance)
 * 
 * @param a - First complex number
 * @param b - Second complex number
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns true if a ≈ b
 */
export function equals(
    a: ComplexNumber,
    b: ComplexNumber,
    epsilon: number = EPSILON
): boolean {
    return (
        areEffectivelyEqual(a.real, b.real, epsilon) &&
        areEffectivelyEqual(a.imaginary, b.imaginary, epsilon)
    );
}

/**
 * Checks if a complex number is effectively zero
 * 
 * @param z - Complex number
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns true if |z| < epsilon
 */
export function isZero(z: ComplexNumber, epsilon: number = EPSILON): boolean {
    return magnitude(z) < epsilon;
}

/**
 * Checks if a complex number is real (imaginary part ≈ 0)
 * 
 * @param z - Complex number
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns true if Im(z) ≈ 0
 */
export function isReal(z: ComplexNumber, epsilon: number = EPSILON): boolean {
    return isEffectivelyZero(z.imaginary, epsilon);
}

/**
 * Checks if a complex number is purely imaginary (real part ≈ 0)
 * 
 * @param z - Complex number
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns true if Re(z) ≈ 0
 */
export function isImaginary(z: ComplexNumber, epsilon: number = EPSILON): boolean {
    return isEffectivelyZero(z.real, epsilon);
}

/**
 * Formats a complex number as a string
 * 
 * @param z - Complex number
 * @param precision - Number of decimal places (default: 4)
 * @returns String representation (e.g., "3.14 + 2.71i")
 */
export function toString(z: ComplexNumber, precision: number = 4): string {
    const realStr = z.real.toFixed(precision);
    const imagStr = Math.abs(z.imaginary).toFixed(precision);
    const sign = z.imaginary >= 0 ? '+' : '-';

    if (isEffectivelyZero(z.imaginary)) {
        return realStr;
    }
    if (isEffectivelyZero(z.real)) {
        return `${z.imaginary.toFixed(precision)}i`;
    }

    return `${realStr} ${sign} ${imagStr}i`;
}

// Common complex constants
export const ZERO: ComplexNumber = { real: 0, imaginary: 0 };
export const ONE: ComplexNumber = { real: 1, imaginary: 0 };
export const I: ComplexNumber = { real: 0, imaginary: 1 };
export const MINUS_I: ComplexNumber = { real: 0, imaginary: -1 };
