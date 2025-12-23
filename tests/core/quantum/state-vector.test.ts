/**
 * @fileoverview Unit tests for state vector operations
 */

import { describe, it, expect } from 'vitest';
import * as StateVector from '../../../src/core/quantum/state-vector';
import * as Complex from '../../../src/core/math/complex';

describe('State Vector Operations', () => {
    describe('createStateVector()', () => {
        it('should create a normalized state vector', () => {
            const amplitudes = [
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ];

            const state = StateVector.createStateVector(amplitudes);

            expect(state.dimension).toBe(2);
            expect(state.isNormalized).toBe(true);
        });

        it('should throw error for unnormalized state', () => {
            const amplitudes = [Complex.complex(1, 0), Complex.complex(1, 0)];

            expect(() => StateVector.createStateVector(amplitudes)).toThrow('not normalized');
        });

        it('should allow creating unnormalized state with flag', () => {
            const amplitudes = [Complex.complex(1, 0), Complex.complex(1, 0)];

            const state = StateVector.createStateVector(amplitudes, false);

            expect(state.isNormalized).toBe(false);
        });
    });

    describe('normalize()', () => {
        it('should normalize an unnormalized state', () => {
            const unnormalized = StateVector.createStateVector(
                [Complex.complex(1, 0), Complex.complex(1, 0)],
                false
            );

            const normalized = StateVector.normalize(unnormalized);

            expect(normalized.isNormalized).toBe(true);
            expect(StateVector.getTotalProbability(normalized.amplitudes)).toBeCloseTo(1.0);
        });

        it('should preserve already normalized states', () => {
            const state = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ]);

            const normalized = StateVector.normalize(state);

            expect(StateVector.statesEqual(state, normalized)).toBe(true);
        });

        it('should throw error for zero vector', () => {
            const zeroState = StateVector.createStateVector(
                [Complex.ZERO, Complex.ZERO],
                false
            );

            expect(() => StateVector.normalize(zeroState)).toThrow('Cannot normalize zero vector');
        });
    });

    describe('innerProduct()', () => {
        it('should compute inner product of orthogonal states', () => {
            const state0 = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const state1 = StateVector.createStateVector([Complex.ZERO, Complex.ONE]);

            const product = StateVector.innerProduct(state0, state1);

            expect(Complex.isZero(product)).toBe(true);
        });

        it('should compute inner product of identical states', () => {
            const state = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ]);

            const product = StateVector.innerProduct(state, state);

            expect(product.real).toBeCloseTo(1.0);
            expect(product.imaginary).toBeCloseTo(0);
        });

        it('should handle complex amplitudes correctly', () => {
            const state1 = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(0, 1 / Math.sqrt(2))
            ]);

            const state2 = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(0, 1 / Math.sqrt(2))
            ]);

            const product = StateVector.innerProduct(state1, state2);

            expect(product.real).toBeCloseTo(1.0);
            expect(product.imaginary).toBeCloseTo(0);
        });
    });

    describe('measure()', () => {
        it('should always measure |0⟩ state as 0', () => {
            const state = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);

            const result = StateVector.measure(state);

            expect(result.stateIndex).toBe(0);
            expect(result.probability).toBe(1.0);
        });

        it('should always measure |1⟩ state as 1', () => {
            const state = StateVector.createStateVector([Complex.ZERO, Complex.ONE]);

            const result = StateVector.measure(state);

            expect(result.stateIndex).toBe(1);
            expect(result.probability).toBe(1.0);
        });

        it('should collapse superposition to basis state', () => {
            const state = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ]);

            const result = StateVector.measure(state);

            expect([0, 1]).toContain(result.stateIndex);
            expect(result.probability).toBeCloseTo(0.5);
            expect(result.collapsedState.isNormalized).toBe(true);
        });

        it('should use provided random number generator', () => {
            const state = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ]);

            // Force measurement to first outcome
            const result = StateVector.measure(state, () => 0.1);

            expect(result.stateIndex).toBe(0);
        });
    });

    describe('createSuperposition()', () => {
        it('should create equal superposition', () => {
            const state0 = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const state1 = StateVector.createStateVector([Complex.ZERO, Complex.ONE]);

            const superposition = StateVector.createSuperposition(
                [state0, state1],
                [Complex.ONE, Complex.ONE]
            );

            expect(superposition.isNormalized).toBe(true);
            expect(StateVector.getProbability(superposition, 0)).toBeCloseTo(0.5);
            expect(StateVector.getProbability(superposition, 1)).toBeCloseTo(0.5);
        });

        it('should handle complex coefficients', () => {
            const state0 = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const state1 = StateVector.createStateVector([Complex.ZERO, Complex.ONE]);

            const superposition = StateVector.createSuperposition(
                [state0, state1],
                [Complex.ONE, Complex.I]
            );

            expect(superposition.isNormalized).toBe(true);
        });

        it('should throw error for mismatched array lengths', () => {
            const state0 = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);

            expect(() =>
                StateVector.createSuperposition([state0], [Complex.ONE, Complex.ONE])
            ).toThrow('must match');
        });
    });

    describe('fidelity()', () => {
        it('should return 1 for identical states', () => {
            const state = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ]);

            const f = StateVector.fidelity(state, state);

            expect(f).toBeCloseTo(1.0);
        });

        it('should return 0 for orthogonal states', () => {
            const state0 = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const state1 = StateVector.createStateVector([Complex.ZERO, Complex.ONE]);

            const f = StateVector.fidelity(state0, state1);

            expect(f).toBeCloseTo(0);
        });

        it('should return 0.5 for maximally mixed states', () => {
            const state1 = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ]);

            const state2 = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);

            const f = StateVector.fidelity(state1, state2);

            expect(f).toBeCloseTo(0.5);
        });
    });

    describe('areOrthogonal()', () => {
        it('should return true for orthogonal basis states', () => {
            const state0 = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const state1 = StateVector.createStateVector([Complex.ZERO, Complex.ONE]);

            expect(StateVector.areOrthogonal(state0, state1)).toBe(true);
        });

        it('should return false for non-orthogonal states', () => {
            const state1 = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ]);

            const state2 = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);

            expect(StateVector.areOrthogonal(state1, state2)).toBe(false);
        });
    });

    describe('toDiracNotation()', () => {
        it('should format |0⟩ correctly', () => {
            const state = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
            const notation = StateVector.toDiracNotation(state);

            expect(notation).toContain('|0⟩');
        });

        it('should format superposition correctly', () => {
            const state = StateVector.createStateVector([
                Complex.complex(1 / Math.sqrt(2), 0),
                Complex.complex(1 / Math.sqrt(2), 0)
            ]);

            const notation = StateVector.toDiracNotation(state);

            expect(notation).toContain('|0⟩');
            expect(notation).toContain('|1⟩');
            expect(notation).toContain('+');
        });
    });

    describe('Edge Cases', () => {
        it('should handle single-dimensional state', () => {
            const state = StateVector.createStateVector([Complex.ONE]);

            expect(state.dimension).toBe(1);
            expect(state.isNormalized).toBe(true);
        });

        it('should handle high-dimensional states', () => {
            const dimension = 16;
            const amplitudes = Array.from({ length: dimension }, () =>
                Complex.complex(1 / Math.sqrt(dimension), 0)
            );

            const state = StateVector.createStateVector(amplitudes);

            expect(state.dimension).toBe(dimension);
            expect(state.isNormalized).toBe(true);
        });
    });
});
