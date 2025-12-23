/**
 * @fileoverview Unit tests for quantum operators and gates
 */

import { describe, it, expect } from 'vitest';
import * as Operators from '../../../src/core/quantum/operators';
import * as StateVector from '../../../src/core/quantum/state-vector';
import * as Complex from '../../../src/core/math/complex';
import { StandardGate } from '../../../src/core/types/quantum.types.js';

describe('Quantum Operators', () => {
    describe('createOperator()', () => {
        it('should create an operator from a matrix', () => {
            const matrix = [
                [Complex.ONE, Complex.ZERO],
                [Complex.ZERO, Complex.ONE]
            ];
            const op = Operators.createOperator(matrix, 'Identity');
            expect(op.name).toBe('Identity');
            expect(op.dimension).toBe(2);
            expect(op.isUnitary).toBe(true);
            expect(op.isHermitian).toBe(true);
        });

        it('should throw if unitary check fails', () => {
            const matrix = [
                [Complex.complex(2, 0), Complex.ZERO],
                [Complex.ZERO, Complex.ONE]
            ];
            expect(() => Operators.createOperator(matrix, 'Bad', true)).toThrow('not unitary');
        });
    });

    describe('applyOperator()', () => {
        it('should apply Pauli-X to |0⟩', () => {
            const state = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const result = Operators.applyOperator(Operators.PauliX, state);

            expect(result.amplitudes[0].real).toBe(0);
            expect(result.amplitudes[1].real).toBe(1);
        });

        it('should apply Hadamard to |0⟩', () => {
            const state = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const result = Operators.applyOperator(Operators.Hadamard, state);

            expect(result.amplitudes[0].real).toBeCloseTo(1 / Math.sqrt(2));
            expect(result.amplitudes[1].real).toBeCloseTo(1 / Math.sqrt(2));
        });
    });

    describe('Standard Gates', () => {
        it('should have correct matrix for Pauli-Z', () => {
            const Z = Operators.PauliZ;
            expect(Z.matrix[0][0].real).toBe(1);
            expect(Z.matrix[1][1].real).toBe(-1);
        });

        it('should have correct matrix for Pauli-Y', () => {
            const Y = Operators.PauliY;
            expect(Y.matrix[0][1].imaginary).toBe(-1); // -i
            expect(Y.matrix[1][0].imaginary).toBe(1);  // i
        });

        it('should have correct matrix for CNOT', () => {
            const CNOT = Operators.CNOT;
            expect(CNOT.dimension).toBe(4);
            expect(CNOT.matrix[3][2].real).toBe(1); // Flips target when control is 1
            expect(CNOT.matrix[2][3].real).toBe(1);
        });
    });

    describe('Rotation Gates', () => {
        it('should create Rx rotation', () => {
            const theta = Math.PI;
            const Rx = Operators.rotationX(theta);
            // Rx(π) = -iX (up to global phase)
            // [[0, -i], [-i, 0]]

            expect(Rx.matrix[0][1].imaginary).toBeCloseTo(-1);
            expect(Rx.matrix[1][0].imaginary).toBeCloseTo(-1);
        });
    });

    describe('getStandardGate()', () => {
        it('should return correct gate by name', () => {
            expect(Operators.getStandardGate(StandardGate.X)).toEqual(Operators.PauliX);
            expect(Operators.getStandardGate(StandardGate.H)).toEqual(Operators.Hadamard);
        });

        it('should throw for unknown gate', () => {
            // @ts-ignore
            expect(() => Operators.getStandardGate('UNKNOWN' as StandardGate)).toThrow('Unknown gate');
        });
    });

    describe('compose()', () => {
        it('should compose two operators (HX)', () => {
            // (H ∘ X)|0⟩ = H(X|0⟩) = H|1⟩ = |-⟩
            const HX = Operators.compose(Operators.Hadamard, Operators.PauliX);
            const state = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const result = Operators.applyOperator(HX, state);

            expect(result.amplitudes[0].real).toBeCloseTo(1 / Math.sqrt(2));
            expect(result.amplitudes[1].real).toBeCloseTo(-1 / Math.sqrt(2));
        });
    });
});
