/**
 * @fileoverview Unit tests for complex number operations
 */

import { describe, it, expect } from 'vitest';
import * as Complex from '../../../src/core/math/complex';

describe('Complex Number Operations', () => {
    describe('complex()', () => {
        it('should create a complex number with real and imaginary parts', () => {
            const z = Complex.complex(3, 4);
            expect(z.real).toBe(3);
            expect(z.imaginary).toBe(4);
        });

        it('should default imaginary part to 0', () => {
            const z = Complex.complex(5);
            expect(z.real).toBe(5);
            expect(z.imaginary).toBe(0);
        });
    });

    describe('add()', () => {
        it('should add two complex numbers correctly', () => {
            const a = Complex.complex(3, 4);
            const b = Complex.complex(1, 2);
            const result = Complex.add(a, b);

            expect(result.real).toBe(4);
            expect(result.imaginary).toBe(6);
        });

        it('should handle negative numbers', () => {
            const a = Complex.complex(3, -4);
            const b = Complex.complex(-1, 2);
            const result = Complex.add(a, b);

            expect(result.real).toBe(2);
            expect(result.imaginary).toBe(-2);
        });
    });

    describe('multiply()', () => {
        it('should multiply two complex numbers correctly', () => {
            // (3 + 4i)(1 + 2i) = 3 + 6i + 4i + 8i² = 3 + 10i - 8 = -5 + 10i
            const a = Complex.complex(3, 4);
            const b = Complex.complex(1, 2);
            const result = Complex.multiply(a, b);

            expect(result.real).toBeCloseTo(-5);
            expect(result.imaginary).toBeCloseTo(10);
        });

        it('should handle multiplication by i', () => {
            const z = Complex.complex(3, 4);
            const result = Complex.multiply(z, Complex.I);

            expect(result.real).toBeCloseTo(-4);
            expect(result.imaginary).toBeCloseTo(3);
        });

        it('should handle multiplication by 1', () => {
            const z = Complex.complex(3, 4);
            const result = Complex.multiply(z, Complex.ONE);

            expect(result.real).toBe(3);
            expect(result.imaginary).toBe(4);
        });
    });

    describe('conjugate()', () => {
        it('should compute complex conjugate correctly', () => {
            const z = Complex.complex(3, 4);
            const conj = Complex.conjugate(z);

            expect(conj.real).toBe(3);
            expect(conj.imaginary).toBe(-4);
        });

        it('should handle real numbers', () => {
            const z = Complex.complex(5, 0);
            const conj = Complex.conjugate(z);

            expect(conj.real).toBe(5);
            expect(conj.imaginary).toBe(0);
        });
    });

    describe('magnitude()', () => {
        it('should compute magnitude correctly', () => {
            const z = Complex.complex(3, 4);
            const mag = Complex.magnitude(z);

            expect(mag).toBeCloseTo(5); // √(3² + 4²) = 5
        });

        it('should handle zero', () => {
            const mag = Complex.magnitude(Complex.ZERO);
            expect(mag).toBe(0);
        });

        it('should handle purely real numbers', () => {
            const z = Complex.complex(5, 0);
            const mag = Complex.magnitude(z);

            expect(mag).toBe(5);
        });
    });

    describe('magnitudeSquared()', () => {
        it('should compute magnitude squared correctly', () => {
            const z = Complex.complex(3, 4);
            const magSq = Complex.magnitudeSquared(z);

            expect(magSq).toBe(25); // 3² + 4² = 25
        });

        it('should be more efficient than magnitude()', () => {
            // This is a performance test - just verify correctness
            const z = Complex.complex(3, 4);
            const magSq = Complex.magnitudeSquared(z);
            const mag = Complex.magnitude(z);

            expect(magSq).toBeCloseTo(mag * mag);
        });
    });

    describe('phase()', () => {
        it('should compute phase correctly for positive real', () => {
            const z = Complex.complex(1, 0);
            const ph = Complex.phase(z);

            expect(ph).toBeCloseTo(0);
        });

        it('should compute phase correctly for positive imaginary', () => {
            const z = Complex.complex(0, 1);
            const ph = Complex.phase(z);

            expect(ph).toBeCloseTo(Math.PI / 2);
        });

        it('should compute phase correctly for negative real', () => {
            const z = Complex.complex(-1, 0);
            const ph = Complex.phase(z);

            expect(Math.abs(ph)).toBeCloseTo(Math.PI);
        });

        it('should compute phase correctly for 45-degree angle', () => {
            const z = Complex.complex(1, 1);
            const ph = Complex.phase(z);

            expect(ph).toBeCloseTo(Math.PI / 4);
        });
    });

    describe('divide()', () => {
        it('should divide two complex numbers correctly', () => {
            const a = Complex.complex(3, 4);
            const b = Complex.complex(1, 2);
            const result = Complex.divide(a, b);

            // (3 + 4i) / (1 + 2i) = (3 + 4i)(1 - 2i) / (1 + 4) = (3 - 6i + 4i + 8) / 5 = (11 - 2i) / 5
            expect(result.real).toBeCloseTo(11 / 5);
            expect(result.imaginary).toBeCloseTo(-2 / 5);
        });

        it('should throw error when dividing by zero', () => {
            const z = Complex.complex(3, 4);
            expect(() => Complex.divide(z, Complex.ZERO)).toThrow('Division by zero');
        });
    });

    describe('pow()', () => {
        it('should compute integer powers correctly', () => {
            const z = Complex.complex(1, 1);
            const result = Complex.pow(z, 2);

            // (1 + i)² = 1 + 2i + i² = 1 + 2i - 1 = 2i
            expect(result.real).toBeCloseTo(0);
            expect(result.imaginary).toBeCloseTo(2);
        });

        it('should handle power of 0', () => {
            const z = Complex.complex(3, 4);
            const result = Complex.pow(z, 0);

            expect(result.real).toBeCloseTo(1);
            expect(result.imaginary).toBeCloseTo(0);
        });
    });

    describe('toPolar() and fromPolar()', () => {
        it('should convert to polar and back correctly', () => {
            const z = Complex.complex(3, 4);
            const polar = Complex.toPolar(z);
            const back = Complex.fromPolar(polar);

            expect(back.real).toBeCloseTo(z.real);
            expect(back.imaginary).toBeCloseTo(z.imaginary);
        });

        it('should handle unit circle points', () => {
            const z = Complex.complex(Math.cos(Math.PI / 3), Math.sin(Math.PI / 3));
            const polar = Complex.toPolar(z);

            expect(polar.magnitude).toBeCloseTo(1);
            expect(polar.phase).toBeCloseTo(Math.PI / 3);
        });
    });

    describe('equals()', () => {
        it('should return true for equal complex numbers', () => {
            const a = Complex.complex(3, 4);
            const b = Complex.complex(3, 4);

            expect(Complex.equals(a, b)).toBe(true);
        });

        it('should return false for different complex numbers', () => {
            const a = Complex.complex(3, 4);
            const b = Complex.complex(3, 5);

            expect(Complex.equals(a, b)).toBe(false);
        });

        it('should handle floating point tolerance', () => {
            const a = Complex.complex(3, 4);
            const b = Complex.complex(3 + 1e-11, 4);

            expect(Complex.equals(a, b)).toBe(true);
        });
    });

    describe('isZero()', () => {
        it('should return true for zero', () => {
            expect(Complex.isZero(Complex.ZERO)).toBe(true);
        });

        it('should return false for non-zero', () => {
            const z = Complex.complex(0.1, 0);
            expect(Complex.isZero(z)).toBe(false);
        });

        it('should handle tolerance', () => {
            const z = Complex.complex(1e-11, 1e-11);
            expect(Complex.isZero(z)).toBe(true);
        });
    });

    describe('isReal()', () => {
        it('should return true for real numbers', () => {
            const z = Complex.complex(5, 0);
            expect(Complex.isReal(z)).toBe(true);
        });

        it('should return false for complex numbers', () => {
            const z = Complex.complex(3, 4);
            expect(Complex.isReal(z)).toBe(false);
        });

        it('should handle tolerance', () => {
            const z = Complex.complex(5, 1e-11);
            expect(Complex.isReal(z)).toBe(true);
        });
    });

    describe('toString()', () => {
        it('should format complex numbers correctly', () => {
            const z = Complex.complex(3.14159, 2.71828);
            const str = Complex.toString(z, 2);

            expect(str).toContain('3.14');
            expect(str).toContain('2.72');
            expect(str).toContain('+');
            expect(str).toContain('i');
        });

        it('should handle negative imaginary part', () => {
            const z = Complex.complex(3, -4);
            const str = Complex.toString(z, 1);

            expect(str).toContain('-');
        });

        it('should handle purely real numbers', () => {
            const z = Complex.complex(5, 0);
            const str = Complex.toString(z, 2);

            expect(str).not.toContain('i');
        });
    });
});
