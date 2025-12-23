/**
 * @fileoverview Unit tests for matrix operations
 */

import { describe, it, expect } from 'vitest';
import * as Matrix from '../../../src/core/math/matrix';
import * as Complex from '../../../src/core/math/complex';

describe('Matrix Operations', () => {
    describe('zeros()', () => {
        it('should create a matrix of zeros', () => {
            const m = Matrix.zeros(2, 3);
            expect(m.length).toBe(2);
            expect(m[0].length).toBe(3);
            expect(Complex.isZero(m[0][0])).toBe(true);
            expect(Complex.isZero(m[1][2])).toBe(true);
        });
    });

    describe('identity()', () => {
        it('should create an identity matrix', () => {
            const m = Matrix.identity(2);
            expect(m.length).toBe(2);
            expect(m[0].length).toBe(2);

            expect(Complex.equals(m[0][0], Complex.ONE)).toBe(true);
            expect(Complex.isZero(m[0][1])).toBe(true);
            expect(Complex.isZero(m[1][0])).toBe(true);
            expect(Complex.equals(m[1][1], Complex.ONE)).toBe(true);
        });
    });

    describe('multiply()', () => {
        it('should multiply two matrices correctly', () => {
            const A = [
                [Complex.complex(1), Complex.complex(2)],
                [Complex.complex(3), Complex.complex(4)]
            ];
            const B = [
                [Complex.complex(2), Complex.complex(0)],
                [Complex.complex(1), Complex.complex(2)]
            ];
            // AB = [[1*2+2*1, 1*0+2*2], [3*2+4*1, 3*0+4*2]]
            //    = [[4, 4], [10, 8]]

            const result = Matrix.multiply(A, B);

            expect(result[0][0].real).toBe(4);
            expect(result[0][1].real).toBe(4);
            expect(result[1][0].real).toBe(10);
            expect(result[1][1].real).toBe(8);
        });

        it('should throw error for incompatible dimensions', () => {
            const A = Matrix.zeros(2, 2);
            const B = Matrix.zeros(3, 2);
            expect(() => Matrix.multiply(A, B)).toThrow('dimension mismatch');
        });
    });

    describe('hermitianConjugate()', () => {
        it('should compute conjugate transpose', () => {
            const A = [
                [Complex.complex(1, 1), Complex.complex(2, 0)],
                [Complex.complex(0, 2), Complex.complex(3, -1)]
            ];
            // A† = [[1-i, 0-2i], [2, 3+i]]

            const result = Matrix.hermitianConjugate(A);

            expect(result[0][0].imaginary).toBe(-1);
            expect(result[0][1].imaginary).toBe(-2);
            expect(result[1][0].real).toBe(2);
            expect(result[1][1].imaginary).toBe(1);
        });
    });

    describe('tensorProduct()', () => {
        it('should compute tensor product correctly', () => {
            const A = [[Complex.complex(1), Complex.complex(2)]];
            const B = [[Complex.complex(3)], [Complex.complex(4)]];
            // A (1x2) ⊗ B (2x1) = 2x2 matrix
            // [[1*3, 2*3], [1*4, 2*4]] = [[3, 6], [4, 8]]

            const result = Matrix.tensorProduct(A, B);

            expect(result.length).toBe(2);
            expect(result[0].length).toBe(2);
            expect(result[0][0].real).toBe(3);
            expect(result[0][1].real).toBe(6);
            expect(result[1][0].real).toBe(4);
            expect(result[1][1].real).toBe(8);
        });
    });

    describe('trace()', () => {
        it('should compute trace correctly', () => {
            const m = [
                [Complex.complex(1), Complex.complex(2)],
                [Complex.complex(3), Complex.complex(4)]
            ];
            const tr = Matrix.trace(m);
            expect(tr.real).toBe(5);
        });

        it('should throw error for non-square matrix', () => {
            const m = Matrix.zeros(2, 3);
            expect(() => Matrix.trace(m)).toThrow('non-square');
        });
    });

    describe('isHermitian()', () => {
        it('should return true for Hermitian matrix', () => {
            const m = [
                [Complex.complex(2), Complex.complex(0, 1)],
                [Complex.complex(0, -1), Complex.complex(3)]
            ];
            expect(Matrix.isHermitian(m)).toBe(true);
        });

        it('should return false for non-Hermitian matrix', () => {
            const m = [
                [Complex.complex(2), Complex.complex(0, 1)],
                [Complex.complex(0, 1), Complex.complex(3)]
            ];
            expect(Matrix.isHermitian(m)).toBe(false);
        });
    });

    describe('isUnitary()', () => {
        it('should return true for unitary matrix', () => {
            const m = [
                [Complex.complex(0), Complex.complex(1)],
                [Complex.complex(1), Complex.complex(0)]
            ]; // Pauli-X is unitary
            expect(Matrix.isUnitary(m)).toBe(true);
        });

        it('should return false for non-unitary matrix', () => {
            const m = [
                [Complex.complex(2), Complex.complex(0)],
                [Complex.complex(0), Complex.complex(2)]
            ];
            expect(Matrix.isUnitary(m)).toBe(false);
        });
    });
});
