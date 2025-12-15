# Quantum Mechanics Core - Quick Reference Guide

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build library
npm run build

# Type check
npm run type-check
```

---

## 📦 Import Examples

```typescript
// Import everything
import * as QM from './src/index.js';

// Import specific modules
import { Complex, Matrix, StateVector, Operators } from './src/index.js';

// Import specific gates
import { PauliX, Hadamard, CNOT } from './src/index.js';
```

---

## 💻 Common Operations

### Complex Numbers

```typescript
import { Complex } from './src/index.js';

// Create complex numbers
const z1 = Complex.complex(3, 4);        // 3 + 4i
const z2 = Complex.complex(1, 2);        // 1 + 2i

// Arithmetic
const sum = Complex.add(z1, z2);         // (3+4i) + (1+2i)
const product = Complex.multiply(z1, z2); // (3+4i) * (1+2i)
const conj = Complex.conjugate(z1);      // 3 - 4i

// Properties
const mag = Complex.magnitude(z1);       // |3+4i| = 5
const phase = Complex.phase(z1);         // arg(3+4i)

// Display
console.log(Complex.toString(z1, 2));    // "3.00 + 4.00i"
```

### State Vectors

```typescript
import { StateVector, Complex } from './src/index.js';

// Create |0⟩
const zero = StateVector.createStateVector([
  Complex.ONE,
  Complex.ZERO
]);

// Create |+⟩ = (|0⟩ + |1⟩)/√2
const plus = StateVector.createStateVector([
  Complex.complex(1 / Math.sqrt(2), 0),
  Complex.complex(1 / Math.sqrt(2), 0)
]);

// Normalize an unnormalized state
const unnormalized = StateVector.createStateVector(
  [Complex.ONE, Complex.ONE],
  false  // Don't check normalization
);
const normalized = StateVector.normalize(unnormalized);

// Measure
const result = StateVector.measure(plus);
console.log(`Measured |${result.stateIndex}⟩ with probability ${result.probability}`);

// Display
console.log(StateVector.toDiracNotation(plus));
// Output: (0.7071)|0⟩ + (0.7071)|1⟩
```

### Quantum Gates

```typescript
import { Operators, StateVector, Complex } from './src/index.js';

const zero = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);

// Apply Hadamard: H|0⟩ = |+⟩
const plus = Operators.applyOperator(Operators.Hadamard, zero);

// Apply Pauli-X: X|0⟩ = |1⟩
const one = Operators.applyOperator(Operators.PauliX, zero);

// Apply Pauli-Z: Z|+⟩ = |-⟩
const minus = Operators.applyOperator(Operators.PauliZ, plus);

// Rotation gates
const rotated = Operators.applyOperator(
  Operators.rotationX(Math.PI / 4),
  zero
);

// Compose operators: (H ∘ X)|0⟩ = H(X|0⟩) = H|1⟩
const composed = Operators.compose(Operators.Hadamard, Operators.PauliX);
const result = Operators.applyOperator(composed, zero);
```

### Matrix Operations

```typescript
import { Matrix, Complex } from './src/index.js';

// Create matrices
const I = Matrix.identity(2);
const zeros = Matrix.zeros(2, 2);

// Matrix multiplication
const A: ComplexMatrix = [[Complex.ONE, Complex.ZERO], [Complex.ZERO, Complex.I]];
const B: ComplexMatrix = [[Complex.I, Complex.ZERO], [Complex.ZERO, Complex.ONE]];
const product = Matrix.multiply(A, B);

// Hermitian conjugate
const Adag = Matrix.hermitianConjugate(A);

// Check properties
const isUnitary = Matrix.isUnitary(A);
const isHermitian = Matrix.isHermitian(A);

// Tensor product
const AB = Matrix.tensorProduct(A, B);
```

---

## 🎓 Physics Concepts

### Normalization
```typescript
// A quantum state must satisfy: Σ|αᵢ|² = 1
const isNormalized = StateVector.isStateNormalized(amplitudes);
const totalProb = StateVector.getTotalProbability(amplitudes);
```

### Superposition
```typescript
// Create superposition: |ψ⟩ = c₁|ψ₁⟩ + c₂|ψ₂⟩
const superposition = StateVector.createSuperposition(
  [state1, state2],
  [coeff1, coeff2]
);
```

### Measurement (Born Rule)
```typescript
// P(measuring state i) = |αᵢ|²
const probability = StateVector.getProbability(state, basisIndex);
```

### Inner Product
```typescript
// ⟨φ|ψ⟩
const innerProd = StateVector.innerProduct(phi, psi);
```

### Fidelity
```typescript
// F(ψ, φ) = |⟨ψ|φ⟩|²
const f = StateVector.fidelity(psi, phi);
```

### Orthogonality
```typescript
// Check if ⟨φ|ψ⟩ = 0
const orthogonal = StateVector.areOrthogonal(phi, psi);
```

---

## 🔬 Available Quantum Gates

### Single-Qubit Gates

| Gate | Symbol | Matrix | Action |
|------|--------|--------|--------|
| Pauli-X | X | [[0,1],[1,0]] | Bit flip: X\|0⟩=\|1⟩ |
| Pauli-Y | Y | [[0,-i],[i,0]] | Y rotation |
| Pauli-Z | Z | [[1,0],[0,-1]] | Phase flip |
| Hadamard | H | (1/√2)[[1,1],[1,-1]] | Superposition |
| Phase | S | [[1,0],[0,i]] | π/2 phase |
| T | T | [[1,0],[0,e^(iπ/4)]] | π/8 phase |

### Two-Qubit Gates

| Gate | Description |
|------|-------------|
| CNOT | Controlled-NOT (creates entanglement) |
| CZ | Controlled-Z |
| SWAP | Swaps two qubits |

### Parametric Gates

```typescript
Operators.rotationX(theta)  // Rx(θ)
Operators.rotationY(theta)  // Ry(θ)
Operators.rotationZ(theta)  // Rz(θ)
```

---

## 📊 Type System

### Core Types

```typescript
// Complex number
interface ComplexNumber {
  readonly real: number;
  readonly imaginary: number;
}

// State vector
interface StateVector {
  readonly amplitudes: ReadonlyArray<ComplexNumber>;
  readonly dimension: number;
  readonly isNormalized: boolean;
}

// Quantum operator
interface QuantumOperator {
  readonly matrix: ComplexMatrix;
  readonly name: string;
  readonly dimension: number;
  readonly isUnitary: boolean;
  readonly isHermitian: boolean;
}

// Measurement result
interface MeasurementResult {
  readonly stateIndex: number;
  readonly probability: number;
  readonly collapsedState: StateVector;
  readonly basis: MeasurementBasis;
}
```

---

## 🧪 Testing

### Run Tests

```bash
npm test                # Run all tests
npm run test:ui         # Interactive UI
npm run test:coverage   # Coverage report
```

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import * as Complex from '../src/core/math/complex.js';

describe('Complex Numbers', () => {
  it('should add correctly', () => {
    const result = Complex.add(
      Complex.complex(3, 4),
      Complex.complex(1, 2)
    );
    expect(result.real).toBe(4);
    expect(result.imaginary).toBe(6);
  });
});
```

---

## 📁 File Structure

```
src/
├── core/
│   ├── types/              # Type definitions
│   │   ├── math.types.ts
│   │   ├── quantum.types.ts
│   │   └── physics.types.ts
│   ├── math/               # Math operations
│   │   ├── complex.ts
│   │   └── matrix.ts
│   └── quantum/            # Quantum mechanics
│       ├── state-vector.ts
│       └── operators.ts
└── index.ts                # Main entry

tests/
├── core/
│   ├── math/
│   │   └── complex.test.ts
│   └── quantum/
│       └── state-vector.test.ts
└── test-utils/
    └── setup.ts
```

---

## 🎯 Common Patterns

### Creating Bell States

```typescript
// |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
const bellState = StateVector.createStateVector([
  Complex.complex(1 / Math.sqrt(2), 0),  // |00⟩
  Complex.ZERO,                          // |01⟩
  Complex.ZERO,                          // |10⟩
  Complex.complex(1 / Math.sqrt(2), 0)   // |11⟩
]);
```

### Applying Multiple Gates

```typescript
// Apply H, then X, then H
let state = zero;
state = Operators.applyOperator(Operators.Hadamard, state);
state = Operators.applyOperator(Operators.PauliX, state);
state = Operators.applyOperator(Operators.Hadamard, state);
```

### Checking Unitarity

```typescript
const isValid = Matrix.isUnitary(operator.matrix);
if (!isValid) {
  throw new Error('Operator is not unitary!');
}
```

---

## 🔍 Debugging Tips

### Display State

```typescript
console.log(StateVector.toDiracNotation(state, 4));
```

### Check Normalization

```typescript
const totalProb = StateVector.getTotalProbability(state.amplitudes);
console.log(`Total probability: ${totalProb}`);
```

### Display Matrix

```typescript
console.log(Matrix.toString(operator.matrix, 3));
```

---

## 📚 Documentation

- **`REFACTORING_PLAN.md`** - Architecture and design
- **`IMPLEMENTATION_SUMMARY_REFACTOR.md`** - Implementation details
- **`README_REFACTORED.md`** - Full usage guide
- **`REFACTORING_COMPLETE.md`** - Summary of completed work

---

## 🎓 Learning Resources

### Quantum Mechanics Concepts
- State vectors represent quantum states
- Operators represent physical transformations
- Measurement causes wave function collapse
- Superposition: system in multiple states simultaneously
- Entanglement: correlated quantum systems

### Mathematical Foundations
- Complex numbers: a + bi
- Linear algebra: vectors and matrices
- Unitary matrices: U†U = I
- Hermitian matrices: A† = A
- Tensor products: A ⊗ B

---

**Quick Start:** Import the library, create a state, apply gates, and measure!

```typescript
import { StateVector, Operators, Complex } from './src/index.js';

const zero = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);
const plus = Operators.applyOperator(Operators.Hadamard, zero);
const result = StateVector.measure(plus);

console.log(`Measured |${result.stateIndex}⟩`);
```
