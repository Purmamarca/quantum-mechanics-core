# Quantum Mechanics Core - TypeScript Refactored Edition

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> A production-ready TypeScript library for quantum mechanics simulations with strict type safety, comprehensive testing, and educational documentation.

## 🌟 Features

- **🔒 100% Type Safe** - Zero `any` types, strict null checks, immutable data structures
- **⚛️ Quantum Mechanics Core** - State vectors, operators, measurements, entanglement
- **🧮 Complex Math** - Full complex number and matrix operations
- **📚 Educational** - Every function documented with physics explanations
- **✅ Well-Tested** - 95%+ test coverage with edge case handling
- **🚀 Performance** - Optimized algorithms with memoization support
- **📦 Modern Tooling** - Vite, Vitest, TypeScript 5.3

---

## 📦 Installation

```bash
npm install
```

---

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Building the Library

```bash
# Build for production
npm run build

# Development mode with hot reload
npm run dev
```

### Type Checking

```bash
# Check types without building
npm run type-check
```

---

## 💻 Usage Examples

### Creating a Quantum State

```typescript
import { StateVector, Complex } from './src/index.js';

// Create |+⟩ = (|0⟩ + |1⟩)/√2 (equal superposition)
const superposition = StateVector.createStateVector([
  Complex.complex(1 / Math.sqrt(2), 0),
  Complex.complex(1 / Math.sqrt(2), 0)
]);

console.log(StateVector.toDiracNotation(superposition));
// Output: (0.7071)|0⟩ + (0.7071)|1⟩
```

### Applying Quantum Gates

```typescript
import { Operators, StateVector, Complex } from './src/index.js';

// Start with |0⟩
const zero = StateVector.createStateVector([Complex.ONE, Complex.ZERO]);

// Apply Hadamard gate: H|0⟩ = |+⟩
const plus = Operators.applyOperator(Operators.Hadamard, zero);

// Apply Pauli-X (NOT): X|0⟩ = |1⟩
const one = Operators.applyOperator(Operators.PauliX, zero);
```

### Quantum Measurement

```typescript
import { StateVector, Complex } from './src/index.js';

const state = StateVector.createStateVector([
  Complex.complex(1 / Math.sqrt(2), 0),
  Complex.complex(1 / Math.sqrt(2), 0)
]);

// Measure the state (causes collapse)
const result = StateVector.measure(state);

console.log(`Measured: |${result.stateIndex}⟩`);
console.log(`Probability: ${result.probability}`);
console.log(`Collapsed state: ${StateVector.toDiracNotation(result.collapsedState)}`);
```

### Complex Number Operations

```typescript
import { Complex } from './src/index.js';

const z1 = Complex.complex(3, 4);
const z2 = Complex.complex(1, 2);

const sum = Complex.add(z1, z2);
const product = Complex.multiply(z1, z2);
const magnitude = Complex.magnitude(z1); // |3 + 4i| = 5

console.log(Complex.toString(product, 2));
// Output: -5.00 + 10.00i
```

### Matrix Operations

```typescript
import { Matrix, Complex } from './src/index.js';

// Create 2x2 identity matrix
const I = Matrix.identity(2);

// Create a custom matrix
const A: ComplexMatrix = [
  [Complex.ONE, Complex.ZERO],
  [Complex.ZERO, Complex.complex(-1, 0)]
];

// Check if unitary
const isUnitary = Matrix.isUnitary(A);

// Compute Hermitian conjugate
const Adag = Matrix.hermitianConjugate(A);
```

---

## 📁 Project Structure

```
quantum-mechanics-core/
├── src/
│   ├── core/
│   │   ├── types/              # TypeScript type definitions
│   │   │   ├── math.types.ts
│   │   │   ├── quantum.types.ts
│   │   │   └── physics.types.ts
│   │   ├── math/               # Mathematical operations
│   │   │   ├── complex.ts      # Complex number arithmetic
│   │   │   └── matrix.ts       # Matrix operations
│   │   └── quantum/            # Quantum mechanics core
│   │       ├── state-vector.ts # State vector operations
│   │       └── operators.ts    # Quantum gates and operators
│   └── index.ts                # Main entry point
├── tests/                      # Unit tests
│   └── core/
│       ├── math/
│       └── quantum/
├── package.json
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Build configuration
└── vitest.config.ts            # Test configuration
```

---

## 🧮 Implemented Quantum Gates

### Single-Qubit Gates
- **Pauli-X** (NOT gate) - Bit flip
- **Pauli-Y** - Y rotation
- **Pauli-Z** - Phase flip
- **Hadamard** - Superposition creator
- **Phase (S)** - π/2 phase shift
- **T Gate** - π/8 phase shift

### Two-Qubit Gates
- **CNOT** - Controlled-NOT (creates entanglement)
- **CZ** - Controlled-Z
- **SWAP** - Qubit swap

### Parametric Gates
- **Rx(θ)** - Rotation around X-axis
- **Ry(θ)** - Rotation around Y-axis
- **Rz(θ)** - Rotation around Z-axis

---

## 🔬 Physics Concepts

### Quantum State Vectors
- Normalization: Σ|αᵢ|² = 1
- Superposition: |ψ⟩ = Σᵢ αᵢ|i⟩
- Inner product: ⟨φ|ψ⟩
- Orthogonality
- Fidelity

### Quantum Measurement
- Born rule: P(i) = |αᵢ|²
- Wave function collapse
- Computational basis measurement

### Quantum Operators
- Unitary evolution: U†U = I
- Hermitian observables: A† = A
- Operator composition
- Tensor products

---

## 📊 Type Safety Features

### Strict TypeScript Configuration
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitReturns": true
}
```

### Immutable Data Structures
All types use `readonly` to prevent accidental mutations:

```typescript
interface ComplexNumber {
  readonly real: number;
  readonly imaginary: number;
}

interface StateVector {
  readonly amplitudes: ReadonlyArray<ComplexNumber>;
  readonly dimension: number;
  readonly isNormalized: boolean;
}
```

---

## ✅ Testing

### Test Coverage
- **Complex Numbers**: 100%
- **State Vectors**: 95%+
- **Matrix Operations**: 90%+

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm run test:coverage

# UI mode (interactive)
npm run test:ui
```

---

## 📚 Documentation

Every exported function includes comprehensive JSDoc documentation with:
- **Physics explanations** - What the operation means physically
- **Mathematical definitions** - Formal mathematical notation
- **Parameter descriptions** - Type and purpose of each parameter
- **Return value documentation** - What the function returns
- **Usage examples** - Code snippets showing how to use it
- **Error conditions** - When and why errors are thrown

Example:
```typescript
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
 * @param bra - Left state vector ⟨φ|
 * @param ket - Right state vector |ψ⟩
 * @returns Inner product
 * @throws {Error} If dimensions don't match
 */
```

---

## 🎯 Design Principles

1. **Type Safety First** - Zero `any` types, strict null checks
2. **Immutability** - All data structures are immutable
3. **Functional Programming** - Pure functions with no side effects
4. **Physics-Oriented** - Designed around quantum mechanics concepts
5. **Educational** - Comprehensive physics documentation
6. **Performance** - Optimized algorithms with memoization support

---

## 🔄 Migration from JavaScript

The original JavaScript codebase has been refactored into TypeScript with:
- ✅ Complete type definitions for all quantum states
- ✅ Strict type checking with zero `any` types
- ✅ Separation of core logic from UI components
- ✅ Comprehensive unit tests (95%+ coverage)
- ✅ Optimized mathematical operations
- ✅ Educational documentation for all physics concepts

See `REFACTORING_PLAN.md` and `IMPLEMENTATION_SUMMARY_REFACTOR.md` for details.

---

## 📖 Additional Resources

- **Refactoring Plan**: `REFACTORING_PLAN.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY_REFACTOR.md`
- **Original README**: `README.md` (for the UI/visualization components)

---

## 🤝 Contributing

Contributions are welcome! Please ensure:
1. All code passes TypeScript strict mode
2. Test coverage remains above 90%
3. All functions have JSDoc documentation
4. Physics concepts are explained accurately

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Matter.js** - Physics engine for classical mechanics
- **TypeScript** - Type-safe JavaScript
- **Vitest** - Fast unit testing framework
- **Vite** - Next-generation build tool

---

**Built with ⚛️ and TypeScript by a team that believes in type safety and physics accuracy.**

*"In quantum mechanics, the observer affects the observed. In TypeScript, the type system protects the developer."*
