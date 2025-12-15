/**
 * @fileoverview Quantum operators and gates
 * @module core/quantum/operators
 */

import type { QuantumOperator, StateVector, StandardGate } from '../types/quantum.types.js';
import type { ComplexMatrix } from '../types/math.types.js';
import * as Complex from '../math/complex.js';
import * as Matrix from '../math/matrix.js';
import * as StateVectorOps from './state-vector.js';

/**
 * Creates a quantum operator from a matrix
 * 
 * @param matrix - Matrix representation
 * @param name - Operator name
 * @param checkUnitary - Whether to verify unitarity (default: true)
 * @returns Quantum operator
 * @throws {Error} If matrix is not unitary and checkUnitary is true
 */
export function createOperator(
    matrix: ComplexMatrix,
    name: string,
    checkUnitary: boolean = true
): QuantumOperator {
    const dimension = matrix.length;
    const isUnitary = checkUnitary ? Matrix.isUnitary(matrix) : false;
    const isHermitian = Matrix.isHermitian(matrix);

    if (checkUnitary && !isUnitary) {
        throw new Error(`Operator "${name}" is not unitary`);
    }

    return {
        matrix,
        name,
        dimension,
        isUnitary: checkUnitary ? true : isUnitary,
        isHermitian
    };
}

/**
 * Applies a quantum operator to a state vector
 * 
 * **Physics Explanation:**
 * Quantum evolution is described by unitary operators:
 * |ψ'⟩ = U|ψ⟩
 * 
 * @param operator - Quantum operator
 * @param state - Input state
 * @returns Transformed state
 * @throws {Error} If dimensions don't match
 */
export function applyOperator(operator: QuantumOperator, state: StateVector): StateVector {
    if (operator.dimension !== state.dimension) {
        throw new Error(
            `Operator dimension (${operator.dimension}) doesn't match state dimension (${state.dimension})`
        );
    }

    const resultAmplitudes = Matrix.multiplyVector(operator.matrix, state.amplitudes);

    return StateVectorOps.createStateVector(resultAmplitudes, state.isNormalized);
}

// ============================================================================
// SINGLE-QUBIT GATES
// ============================================================================

/**
 * Pauli-X gate (NOT gate, bit flip)
 * 
 * **Matrix:**
 * X = [[0, 1],
 *      [1, 0]]
 * 
 * **Action:**
 * X|0⟩ = |1⟩
 * X|1⟩ = |0⟩
 */
export const PauliX: QuantumOperator = createOperator(
    [
        [Complex.ZERO, Complex.ONE],
        [Complex.ONE, Complex.ZERO]
    ],
    'Pauli-X',
    false
);

/**
 * Pauli-Y gate
 * 
 * **Matrix:**
 * Y = [[0, -i],
 *      [i,  0]]
 * 
 * **Action:**
 * Y|0⟩ = i|1⟩
 * Y|1⟩ = -i|0⟩
 */
export const PauliY: QuantumOperator = createOperator(
    [
        [Complex.ZERO, Complex.MINUS_I],
        [Complex.I, Complex.ZERO]
    ],
    'Pauli-Y',
    false
);

/**
 * Pauli-Z gate (phase flip)
 * 
 * **Matrix:**
 * Z = [[1,  0],
 *      [0, -1]]
 * 
 * **Action:**
 * Z|0⟩ = |0⟩
 * Z|1⟩ = -|1⟩
 */
export const PauliZ: QuantumOperator = createOperator(
    [
        [Complex.ONE, Complex.ZERO],
        [Complex.ZERO, Complex.complex(-1, 0)]
    ],
    'Pauli-Z',
    false
);

/**
 * Hadamard gate (creates superposition)
 * 
 * **Matrix:**
 * H = (1/√2) [[1,  1],
 *             [1, -1]]
 * 
 * **Action:**
 * H|0⟩ = (|0⟩ + |1⟩)/√2
 * H|1⟩ = (|0⟩ - |1⟩)/√2
 * 
 * **Physics Application:**
 * The Hadamard gate creates equal superposition from basis states.
 */
export const Hadamard: QuantumOperator = createOperator(
    [
        [Complex.complex(1 / Math.sqrt(2), 0), Complex.complex(1 / Math.sqrt(2), 0)],
        [Complex.complex(1 / Math.sqrt(2), 0), Complex.complex(-1 / Math.sqrt(2), 0)]
    ],
    'Hadamard',
    false
);

/**
 * Phase gate (S gate)
 * 
 * **Matrix:**
 * S = [[1, 0],
 *      [0, i]]
 * 
 * **Action:**
 * S|0⟩ = |0⟩
 * S|1⟩ = i|1⟩
 */
export const PhaseGate: QuantumOperator = createOperator(
    [
        [Complex.ONE, Complex.ZERO],
        [Complex.ZERO, Complex.I]
    ],
    'Phase (S)',
    false
);

/**
 * T gate (π/8 gate)
 * 
 * **Matrix:**
 * T = [[1, 0],
 *      [0, e^(iπ/4)]]
 * 
 * **Action:**
 * T|0⟩ = |0⟩
 * T|1⟩ = e^(iπ/4)|1⟩
 */
export const TGate: QuantumOperator = createOperator(
    [
        [Complex.ONE, Complex.ZERO],
        [Complex.ZERO, Complex.expI(Complex.complex(Math.PI / 4, 0))]
    ],
    'T',
    false
);

/**
 * Identity gate (no operation)
 * 
 * **Matrix:**
 * I = [[1, 0],
 *      [0, 1]]
 */
export const Identity: QuantumOperator = createOperator(
    Matrix.identity(2),
    'Identity',
    false
);

// ============================================================================
// TWO-QUBIT GATES
// ============================================================================

/**
 * CNOT gate (Controlled-NOT)
 * 
 * **Matrix (4×4):**
 * CNOT = [[1, 0, 0, 0],
 *         [0, 1, 0, 0],
 *         [0, 0, 0, 1],
 *         [0, 0, 1, 0]]
 * 
 * **Action:**
 * Flips target qubit if control qubit is |1⟩
 * 
 * **Basis states:**
 * |00⟩ → |00⟩
 * |01⟩ → |01⟩
 * |10⟩ → |11⟩
 * |11⟩ → |10⟩
 * 
 * **Physics Application:**
 * CNOT creates entanglement and is universal for quantum computation.
 */
export const CNOT: QuantumOperator = createOperator(
    [
        [Complex.ONE, Complex.ZERO, Complex.ZERO, Complex.ZERO],
        [Complex.ZERO, Complex.ONE, Complex.ZERO, Complex.ZERO],
        [Complex.ZERO, Complex.ZERO, Complex.ZERO, Complex.ONE],
        [Complex.ZERO, Complex.ZERO, Complex.ONE, Complex.ZERO]
    ],
    'CNOT',
    false
);

/**
 * SWAP gate
 * 
 * **Matrix (4×4):**
 * SWAP = [[1, 0, 0, 0],
 *         [0, 0, 1, 0],
 *         [0, 1, 0, 0],
 *         [0, 0, 0, 1]]
 * 
 * **Action:**
 * Swaps two qubits
 * |ab⟩ → |ba⟩
 */
export const SWAP: QuantumOperator = createOperator(
    [
        [Complex.ONE, Complex.ZERO, Complex.ZERO, Complex.ZERO],
        [Complex.ZERO, Complex.ZERO, Complex.ONE, Complex.ZERO],
        [Complex.ZERO, Complex.ONE, Complex.ZERO, Complex.ZERO],
        [Complex.ZERO, Complex.ZERO, Complex.ZERO, Complex.ONE]
    ],
    'SWAP',
    false
);

/**
 * Controlled-Z gate
 * 
 * **Matrix (4×4):**
 * CZ = [[1, 0, 0,  0],
 *       [0, 1, 0,  0],
 *       [0, 0, 1,  0],
 *       [0, 0, 0, -1]]
 * 
 * **Action:**
 * Applies Z to target if control is |1⟩
 */
export const CZ: QuantumOperator = createOperator(
    [
        [Complex.ONE, Complex.ZERO, Complex.ZERO, Complex.ZERO],
        [Complex.ZERO, Complex.ONE, Complex.ZERO, Complex.ZERO],
        [Complex.ZERO, Complex.ZERO, Complex.ONE, Complex.ZERO],
        [Complex.ZERO, Complex.ZERO, Complex.ZERO, Complex.complex(-1, 0)]
    ],
    'CZ',
    false
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a rotation gate around the X axis
 * 
 * **Matrix:**
 * Rx(θ) = [[cos(θ/2), -i·sin(θ/2)],
 *          [-i·sin(θ/2), cos(θ/2)]]
 * 
 * @param theta - Rotation angle in radians
 * @returns Rotation operator
 */
export function rotationX(theta: number): QuantumOperator {
    const halfTheta = theta / 2;
    const cos = Math.cos(halfTheta);
    const sin = Math.sin(halfTheta);

    return createOperator(
        [
            [Complex.complex(cos, 0), Complex.complex(0, -sin)],
            [Complex.complex(0, -sin), Complex.complex(cos, 0)]
        ],
        `Rx(${theta.toFixed(4)})`,
        false
    );
}

/**
 * Creates a rotation gate around the Y axis
 * 
 * **Matrix:**
 * Ry(θ) = [[cos(θ/2), -sin(θ/2)],
 *          [sin(θ/2),  cos(θ/2)]]
 * 
 * @param theta - Rotation angle in radians
 * @returns Rotation operator
 */
export function rotationY(theta: number): QuantumOperator {
    const halfTheta = theta / 2;
    const cos = Math.cos(halfTheta);
    const sin = Math.sin(halfTheta);

    return createOperator(
        [
            [Complex.complex(cos, 0), Complex.complex(-sin, 0)],
            [Complex.complex(sin, 0), Complex.complex(cos, 0)]
        ],
        `Ry(${theta.toFixed(4)})`,
        false
    );
}

/**
 * Creates a rotation gate around the Z axis
 * 
 * **Matrix:**
 * Rz(θ) = [[e^(-iθ/2), 0],
 *          [0, e^(iθ/2)]]
 * 
 * @param theta - Rotation angle in radians
 * @returns Rotation operator
 */
export function rotationZ(theta: number): QuantumOperator {
    const halfTheta = theta / 2;

    return createOperator(
        [
            [Complex.expI(Complex.complex(-halfTheta, 0)), Complex.ZERO],
            [Complex.ZERO, Complex.expI(Complex.complex(halfTheta, 0))]
        ],
        `Rz(${theta.toFixed(4)})`,
        false
    );
}

/**
 * Gets a standard gate by name
 * 
 * @param gateName - Standard gate name
 * @returns Quantum operator
 * @throws {Error} If gate name is not recognized
 */
export function getStandardGate(gateName: StandardGate): QuantumOperator {
    switch (gateName) {
        case StandardGate.X:
            return PauliX;
        case StandardGate.Y:
            return PauliY;
        case StandardGate.Z:
            return PauliZ;
        case StandardGate.H:
            return Hadamard;
        case StandardGate.S:
            return PhaseGate;
        case StandardGate.T:
            return TGate;
        case StandardGate.CNOT:
            return CNOT;
        case StandardGate.CZ:
            return CZ;
        case StandardGate.SWAP:
            return SWAP;
        default:
            throw new Error(`Unknown gate: ${gateName}`);
    }
}

/**
 * Composes two operators (applies them in sequence)
 * 
 * **Mathematical Definition:**
 * (U₂ ∘ U₁)|ψ⟩ = U₂(U₁|ψ⟩)
 * Matrix form: U₂U₁
 * 
 * @param second - Second operator to apply
 * @param first - First operator to apply
 * @returns Composed operator
 */
export function compose(second: QuantumOperator, first: QuantumOperator): QuantumOperator {
    if (second.dimension !== first.dimension) {
        throw new Error('Operators must have the same dimension');
    }

    const composedMatrix = Matrix.multiply(second.matrix, first.matrix);

    return createOperator(
        composedMatrix,
        `(${second.name} ∘ ${first.name})`,
        false
    );
}
