/**
 * @fileoverview Quantum mechanics type definitions
 * @module core/types/quantum
 */

import type { ComplexNumber, ComplexMatrix, Vector3D } from './math.types.js';

/**
 * Represents a quantum state vector in a Hilbert space
 * 
 * **Physics Explanation:**
 * A quantum state |ψ⟩ is represented as a vector of complex amplitudes:
 * |ψ⟩ = Σᵢ αᵢ|i⟩
 * 
 * **Normalization Condition:**
 * Σᵢ |αᵢ|² = 1 (total probability must equal 1)
 * 
 * @example
 * ```typescript
 * // Qubit in equal superposition: |ψ⟩ = (|0⟩ + |1⟩)/√2
 * const superposition: StateVector = {
 *   amplitudes: [
 *     { real: 1/Math.sqrt(2), imaginary: 0 },
 *     { real: 1/Math.sqrt(2), imaginary: 0 }
 *   ],
 *   dimension: 2,
 *   isNormalized: true
 * };
 * ```
 */
export interface StateVector {
    /** Complex amplitudes for each basis state */
    readonly amplitudes: ReadonlyArray<ComplexNumber>;
    /** Dimension of the Hilbert space (number of basis states) */
    readonly dimension: number;
    /** Whether the state satisfies the normalization condition */
    readonly isNormalized: boolean;
}

/**
 * Represents a single qubit state
 * 
 * **Physics Explanation:**
 * A qubit is the fundamental unit of quantum information:
 * |ψ⟩ = α|0⟩ + β|1⟩
 * 
 * where |α|² + |β|² = 1
 * 
 * **Bloch Sphere Representation:**
 * Any qubit state can be represented as a point on the Bloch sphere:
 * |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
 */
export interface QubitState {
    /** Amplitude for |0⟩ state */
    readonly alpha: ComplexNumber;
    /** Amplitude for |1⟩ state */
    readonly beta: ComplexNumber;
    /** Bloch sphere representation (unit vector) */
    readonly blochVector: Vector3D;
    /** Probability of measuring |0⟩ */
    readonly prob0: number;
    /** Probability of measuring |1⟩ */
    readonly prob1: number;
}

/**
 * Quantum operator (linear transformation on state vectors)
 * 
 * **Physics Explanation:**
 * Quantum operators represent physical observables and time evolution.
 * They must be represented by unitary matrices (U†U = I) to preserve
 * probability normalization.
 * 
 * **Common Operators:**
 * - Pauli-X (NOT gate): σₓ = [[0, 1], [1, 0]]
 * - Pauli-Y: σᵧ = [[0, -i], [i, 0]]
 * - Pauli-Z: σᵤ = [[1, 0], [0, -1]]
 * - Hadamard: H = (1/√2)[[1, 1], [1, -1]]
 */
export interface QuantumOperator {
    /** Matrix representation of the operator */
    readonly matrix: ComplexMatrix;
    /** Human-readable name (e.g., "Hadamard", "CNOT") */
    readonly name: string;
    /** Dimension of the operator (n×n matrix acts on n-dimensional space) */
    readonly dimension: number;
    /** Whether the operator is unitary (U†U = I) */
    readonly isUnitary: boolean;
    /** Whether the operator is Hermitian (U† = U, represents observable) */
    readonly isHermitian: boolean;
}

/**
 * Result of a quantum measurement
 * 
 * **Physics Explanation:**
 * Measurement causes wave function collapse. The state |ψ⟩ collapses
 * to one of the basis states |i⟩ with probability |⟨i|ψ⟩|².
 * 
 * **Born Rule:**
 * P(measuring state i) = |αᵢ|²
 */
export interface MeasurementResult {
    /** Index of the measured basis state */
    readonly stateIndex: number;
    /** Probability of this outcome (|αᵢ|²) */
    readonly probability: number;
    /** Post-measurement state (collapsed to basis state) */
    readonly collapsedState: StateVector;
    /** Measurement basis used */
    readonly basis: MeasurementBasis;
}

/**
 * Measurement basis specification
 */
export interface MeasurementBasis {
    /** Name of the basis (e.g., "computational", "Hadamard") */
    readonly name: string;
    /** Basis vectors */
    readonly vectors: ReadonlyArray<StateVector>;
}

/**
 * Entangled state of multiple qubits
 * 
 * **Physics Explanation:**
 * Entanglement is a uniquely quantum correlation where the state
 * of a composite system cannot be factored into individual subsystems.
 * 
 * **Example - Bell State:**
 * |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
 * This state cannot be written as |ψ₁⟩⊗|ψ₂⟩ for any single-qubit states.
 */
export interface EntangledState {
    /** Full state vector of the composite system */
    readonly state: StateVector;
    /** Number of qubits in the system */
    readonly numQubits: number;
    /** Whether the state is separable (not entangled) */
    readonly isSeparable: boolean;
    /** Entanglement entropy (measure of entanglement) */
    readonly entanglementEntropy: number;
}

/**
 * Density matrix representation (for mixed states)
 * 
 * **Physics Explanation:**
 * While pure states are vectors, mixed states (statistical mixtures)
 * are represented by density matrices: ρ = Σᵢ pᵢ|ψᵢ⟩⟨ψᵢ|
 * 
 * Properties:
 * - Hermitian: ρ† = ρ
 * - Positive semi-definite
 * - Trace = 1: Tr(ρ) = 1
 */
export interface DensityMatrix {
    /** Matrix representation */
    readonly matrix: ComplexMatrix;
    /** Dimension of the system */
    readonly dimension: number;
    /** Purity: Tr(ρ²) (1 for pure states, <1 for mixed) */
    readonly purity: number;
    /** Whether this represents a pure state */
    readonly isPure: boolean;
}

/**
 * Quantum gate (single or multi-qubit operator)
 */
export type QuantumGate = QuantumOperator;

/**
 * Standard quantum gate names
 */
export enum StandardGate {
    /** Pauli-X (NOT gate) */
    X = 'X',
    /** Pauli-Y */
    Y = 'Y',
    /** Pauli-Z */
    Z = 'Z',
    /** Hadamard gate */
    H = 'H',
    /** Phase gate (S gate) */
    S = 'S',
    /** T gate (π/8 gate) */
    T = 'T',
    /** Controlled-NOT */
    CNOT = 'CNOT',
    /** Controlled-Z */
    CZ = 'CZ',
    /** SWAP gate */
    SWAP = 'SWAP',
    /** Toffoli (CCNOT) */
    TOFFOLI = 'TOFFOLI'
}

/**
 * Quantum circuit representation
 */
export interface QuantumCircuit {
    /** Number of qubits */
    readonly numQubits: number;
    /** Sequence of gates to apply */
    readonly gates: ReadonlyArray<CircuitGate>;
    /** Initial state (defaults to |0⟩⊗ⁿ) */
    readonly initialState?: StateVector;
}

/**
 * Gate in a quantum circuit
 */
export interface CircuitGate {
    /** The quantum gate to apply */
    readonly gate: QuantumGate;
    /** Target qubit indices */
    readonly targets: ReadonlyArray<number>;
    /** Control qubit indices (for controlled gates) */
    readonly controls?: ReadonlyArray<number>;
}
