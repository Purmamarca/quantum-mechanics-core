/**
 * @fileoverview Quantum state vector operations
 * @module core/quantum/state-vector
 */

import type { StateVector, MeasurementResult, MeasurementBasis } from '../types/quantum.types.js';
import type { ComplexNumber } from '../types/math.types.js';
import * as Complex from '../math/complex.js';
import { EPSILON } from '../types/math.types.js';

/**
 * Creates a quantum state vector
 * 
 * **Complexity:** O(N) where N is the dimension (if checkNormalization is true)
 *
 * @param amplitudes - Complex amplitudes for each basis state
 * @param checkNormalization - Whether to verify normalization (default: true)
 * @returns State vector
 * @throws {Error} If state is not normalized and checkNormalization is true
 */
export function createStateVector(
    amplitudes: ReadonlyArray<ComplexNumber>,
    checkNormalization: boolean = true
): StateVector {
    const dimension = amplitudes.length;

    if (dimension === 0) {
        throw new Error('State vector must have at least one amplitude');
    }

    const isNormalized = checkNormalization ? isStateNormalized(amplitudes) : false;

    if (checkNormalization && !isNormalized) {
        throw new Error(
            'State vector is not normalized. Use normalize() first or set checkNormalization=false'
        );
    }

    return {
        amplitudes,
        dimension,
        isNormalized
    };
}

/**
 * Checks if a state vector is normalized
 * 
 * **Physics Explanation:**
 * A quantum state must satisfy Σᵢ |αᵢ|² = 1 (total probability = 1)
 * 
 * **Complexity:** O(N) where N is the dimension
 *
 * @param amplitudes - State amplitudes
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns true if normalized
 */
export function isStateNormalized(
    amplitudes: ReadonlyArray<ComplexNumber>,
    epsilon: number = EPSILON
): boolean {
    const totalProbability = getTotalProbability(amplitudes);
    return Math.abs(totalProbability - 1.0) < epsilon;
}

/**
 * Computes the total probability (sum of |αᵢ|²)
 * 
 * **Complexity:** O(N) where N is the dimension
 *
 * @param amplitudes - State amplitudes
 * @returns Total probability
 */
export function getTotalProbability(amplitudes: ReadonlyArray<ComplexNumber>): number {
    return amplitudes.reduce(
        (sum, amplitude) => sum + Complex.magnitudeSquared(amplitude),
        0
    );
}

/**
 * Normalizes a quantum state vector
 * 
 * **Physics Explanation:**
 * Normalization ensures the total probability equals 1.
 * Each amplitude is divided by √(Σᵢ |αᵢ|²)
 * 
 * **Mathematical Definition:**
 * |ψ_normalized⟩ = |ψ⟩ / √⟨ψ|ψ⟩
 * 
 * **Complexity:** O(N) where N is the dimension
 *
 * @param state - Unnormalized state vector
 * @returns Normalized state vector
 * @throws {Error} If state is a zero vector
 */
export function normalize(state: StateVector): StateVector {
    const totalProb = getTotalProbability(state.amplitudes);

    if (totalProb < EPSILON) {
        throw new Error('Cannot normalize zero vector');
    }

    const norm = Math.sqrt(totalProb);
    const normalizedAmplitudes = state.amplitudes.map(amplitude =>
        Complex.scale(1 / norm, amplitude)
    );

    return {
        amplitudes: normalizedAmplitudes,
        dimension: state.dimension,
        isNormalized: true
    };
}

/**
 * Computes the inner product of two state vectors
 * 
 * **Mathematical Definition:**
 * ⟨φ|ψ⟩ = Σᵢ φᵢ* · ψᵢ
 * 
 * **Physics Application:**
 * - Probability amplitude: ⟨φ|ψ⟩
 * - Orthogonality: ⟨φ|ψ⟩ = 0
 * - Normalization: ⟨ψ|ψ⟩ = 1
 * 
 * **Complexity:** O(N) where N is the dimension
 *
 * @param bra - Left state vector ⟨φ|
 * @param ket - Right state vector |ψ⟩
 * @returns Inner product
 * @throws {Error} If dimensions don't match
 */
export function innerProduct(bra: StateVector, ket: StateVector): ComplexNumber {
    if (bra.dimension !== ket.dimension) {
        throw new Error(
            `Dimension mismatch: cannot compute inner product of ${bra.dimension}-dim and ${ket.dimension}-dim states`
        );
    }

    let result = Complex.ZERO;

    for (let i = 0; i < bra.dimension; i++) {
        const braAmplitude = bra.amplitudes[i];
        const ketAmplitude = ket.amplitudes[i];

        if (braAmplitude && ketAmplitude) {
            const conjugated = Complex.conjugate(braAmplitude);
            const product = Complex.multiply(conjugated, ketAmplitude);
            result = Complex.add(result, product);
        }
    }

    return result;
}

/**
 * Computes the probability of measuring a specific basis state
 * 
 * **Physics Explanation (Born Rule):**
 * P(measuring state i) = |αᵢ|²
 * 
 * **Complexity:** O(1)
 *
 * @param state - Quantum state
 * @param basisIndex - Index of the basis state
 * @returns Probability (0 to 1)
 * @throws {Error} If basis index is out of range
 */
export function getProbability(state: StateVector, basisIndex: number): number {
    if (basisIndex < 0 || basisIndex >= state.dimension) {
        throw new Error(`Basis index ${basisIndex} out of range [0, ${state.dimension - 1}]`);
    }

    const amplitude = state.amplitudes[basisIndex];
    if (!amplitude) {
        throw new Error(`Amplitude at index ${basisIndex} is undefined`);
    }

    return Complex.magnitudeSquared(amplitude);
}

/**
 * Performs a quantum measurement in the computational basis
 * 
 * **Physics Explanation:**
 * Measurement causes wave function collapse. The state |ψ⟩ = Σᵢ αᵢ|i⟩
 * collapses to |i⟩ with probability |αᵢ|².
 * 
 * **Complexity:** O(N) to determine outcome + O(N) to create collapsed state
 *
 * @param state - State to measure
 * @param random - Random number generator (default: Math.random)
 * @returns Measurement result with collapsed state
 */
export function measure(
    state: StateVector,
    random: () => number = Math.random
): MeasurementResult {
    if (!state.isNormalized) {
        throw new Error('Cannot measure unnormalized state');
    }

    // Generate random number for measurement outcome
    const randomValue = random();

    // Find which basis state we collapsed to
    let cumulativeProbability = 0;
    let measuredIndex = 0;

    for (let i = 0; i < state.dimension; i++) {
        const probability = getProbability(state, i);
        cumulativeProbability += probability;

        if (randomValue <= cumulativeProbability) {
            measuredIndex = i;
            break;
        }
    }

    // Create collapsed state (basis state |i⟩)
    const collapsedAmplitudes = Array.from({ length: state.dimension }, (_, i) =>
        i === measuredIndex ? Complex.ONE : Complex.ZERO
    );

    const collapsedState = createStateVector(collapsedAmplitudes, false);

    return {
        stateIndex: measuredIndex,
        probability: getProbability(state, measuredIndex),
        collapsedState: { ...collapsedState, isNormalized: true },
        basis: {
            name: 'computational',
            vectors: createComputationalBasis(state.dimension)
        }
    };
}

/**
 * Creates the computational basis {|0⟩, |1⟩, ..., |n-1⟩}
 * 
 * **Complexity:** O(N²) where N is the dimension (creates N vectors of size N)
 *
 * @param dimension - Dimension of the Hilbert space
 * @returns Array of basis vectors
 */
export function createComputationalBasis(dimension: number): ReadonlyArray<StateVector> {
    return Array.from({ length: dimension }, (_, i) => {
        const amplitudes = Array.from({ length: dimension }, (_, j) =>
            i === j ? Complex.ONE : Complex.ZERO
        );
        return createStateVector(amplitudes, false);
    });
}

/**
 * Creates a superposition state from multiple states
 * 
 * **Physics Explanation:**
 * Superposition is a fundamental quantum principle where a system
 * exists in multiple states simultaneously:
 * |ψ⟩ = Σᵢ cᵢ|ψᵢ⟩
 * 
 * **Complexity:** O(K × N) where K is number of states and N is dimension
 *
 * @param states - Array of state vectors
 * @param coefficients - Complex coefficients for each state
 * @param autoNormalize - Whether to normalize the result (default: true)
 * @returns Superposition state
 * @throws {Error} If dimensions don't match or arrays have different lengths
 */
export function createSuperposition(
    states: ReadonlyArray<StateVector>,
    coefficients: ReadonlyArray<ComplexNumber>,
    autoNormalize: boolean = true
): StateVector {
    if (states.length === 0) {
        throw new Error('Cannot create superposition from empty state array');
    }

    if (states.length !== coefficients.length) {
        throw new Error('Number of states must match number of coefficients');
    }

    const dimension = states[0]!.dimension;

    // Verify all states have the same dimension
    for (const state of states) {
        if (state.dimension !== dimension) {
            throw new Error('All states must have the same dimension');
        }
    }

    // Compute superposition: Σᵢ cᵢ|ψᵢ⟩
    const resultAmplitudes: ComplexNumber[] = Array.from(
        { length: dimension },
        () => Complex.ZERO
    );

    for (let stateIdx = 0; stateIdx < states.length; stateIdx++) {
        const state = states[stateIdx];
        const coefficient = coefficients[stateIdx];

        if (!state || !coefficient) continue;

        for (let i = 0; i < dimension; i++) {
            const amplitude = state.amplitudes[i];
            if (amplitude) {
                const scaled = Complex.multiply(coefficient, amplitude);
                resultAmplitudes[i] = Complex.add(resultAmplitudes[i]!, scaled);
            }
        }
    }

    const superpositionState = createStateVector(resultAmplitudes, false);

    return autoNormalize ? normalize(superpositionState) : superpositionState;
}

/**
 * Checks if two states are orthogonal (⟨φ|ψ⟩ = 0)
 * 
 * **Physics Application:**
 * Orthogonal states are distinguishable by measurement.
 * 
 * **Complexity:** O(N) where N is the dimension
 *
 * @param state1 - First state
 * @param state2 - Second state
 * @param epsilon - Tolerance
 * @returns true if states are orthogonal
 */
export function areOrthogonal(
    state1: StateVector,
    state2: StateVector,
    epsilon: number = EPSILON
): boolean {
    const product = innerProduct(state1, state2);
    return Complex.isZero(product, epsilon);
}

/**
 * Computes the fidelity between two quantum states
 * 
 * **Mathematical Definition:**
 * F(ψ, φ) = |⟨ψ|φ⟩|²
 * 
 * **Physics Application:**
 * Fidelity measures how "close" two quantum states are.
 * F = 1: identical states
 * F = 0: orthogonal states
 * 
 * **Complexity:** O(N) where N is the dimension
 *
 * @param state1 - First state
 * @param state2 - Second state
 * @returns Fidelity (0 to 1)
 */
export function fidelity(state1: StateVector, state2: StateVector): number {
    const product = innerProduct(state1, state2);
    return Complex.magnitudeSquared(product);
}

/**
 * Checks if two states are equal (within tolerance)
 * 
 * **Complexity:** O(N) where N is the dimension
 *
 * @param state1 - First state
 * @param state2 - Second state
 * @param epsilon - Tolerance
 * @returns true if states are equal
 */
export function statesEqual(
    state1: StateVector,
    state2: StateVector,
    epsilon: number = EPSILON
): boolean {
    if (state1.dimension !== state2.dimension) {
        return false;
    }

    for (let i = 0; i < state1.dimension; i++) {
        const amp1 = state1.amplitudes[i];
        const amp2 = state2.amplitudes[i];

        if (!amp1 || !amp2) return false;

        if (!Complex.equals(amp1, amp2, epsilon)) {
            return false;
        }
    }

    return true;
}

/**
 * Formats a state vector as Dirac notation
 * 
 * @param state - State to format
 * @param precision - Decimal places
 * @returns String in format "|ψ⟩ = α₀|0⟩ + α₁|1⟩ + ..."
 */
export function toDiracNotation(state: StateVector, precision: number = 4): string {
    const terms: string[] = [];

    for (let i = 0; i < state.dimension; i++) {
        const amplitude = state.amplitudes[i];
        if (!amplitude || Complex.isZero(amplitude)) continue;

        const ampStr = Complex.toString(amplitude, precision);
        terms.push(`(${ampStr})|${i}⟩`);
    }

    return terms.length > 0 ? terms.join(' + ') : '|0⟩';
}
