/**
 * @fileoverview Main entry point for quantum-mechanics-core library
 * @module quantum-mechanics-core
 */

// Type exports
export * from './core/types/index.js';

// Math operations
export * as Complex from './core/math/complex.js';
export * as Matrix from './core/math/matrix.js';

// Quantum operations
export * as StateVector from './core/quantum/state-vector.js';
export * as Operators from './core/quantum/operators.js';

// Re-export commonly used items
export {
    // Complex number constants
    ZERO as COMPLEX_ZERO,
    ONE as COMPLEX_ONE,
    I as COMPLEX_I
} from './core/math/complex.js';

export {
    // Common quantum gates
    PauliX,
    PauliY,
    PauliZ,
    Hadamard,
    CNOT,
    PhaseGate,
    TGate
} from './core/quantum/operators.js';
