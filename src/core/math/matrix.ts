/**
 * @fileoverview Matrix operations for quantum mechanics
 * @module core/math/matrix
 */

import type { ComplexNumber, ComplexMatrix } from '../types/math.types.js';
import * as Complex from './complex.js';
import { EPSILON, areEffectivelyEqual } from '../types/math.types.js';

/**
 * Creates a zero matrix of given dimensions
 * 
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @returns Zero matrix
 */
export function zeros(rows: number, cols: number): ComplexMatrix {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => Complex.ZERO)
    );
}

/**
 * Creates an identity matrix of given dimension
 * 
 * **Mathematical Definition:**
 * I[i][j] = 1 if i === j, else 0
 * 
 * @param dimension - Size of the square matrix
 * @returns Identity matrix
 */
export function identity(dimension: number): ComplexMatrix {
    const matrix = zeros(dimension, dimension);
    return matrix.map((row, i) =>
        row.map((_, j) => (i === j ? Complex.ONE : Complex.ZERO))
    );
}

/**
 * Multiplies two complex matrices
 * 
 * **Mathematical Definition:**
 * (AB)[i][j] = Σₖ A[i][k] · B[k][j]
 * 
 * **Complexity:** O(n³) for n×n matrices
 * 
 * @param A - First matrix (m×n)
 * @param B - Second matrix (n×p)
 * @returns Product matrix (m×p)
 * @throws {Error} If matrix dimensions are incompatible
 */
export function multiply(A: ComplexMatrix, B: ComplexMatrix): ComplexMatrix {
    const rowsA = A.length;
    const colsA = A[0]?.length ?? 0;
    const rowsB = B.length;
    const colsB = B[0]?.length ?? 0;

    if (colsA !== rowsB) {
        throw new Error(
            `Matrix dimension mismatch: cannot multiply ${rowsA}×${colsA} by ${rowsB}×${colsB}`
        );
    }

    const result = zeros(rowsA, colsB);

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            let sum = Complex.ZERO;
            for (let k = 0; k < colsA; k++) {
                const aElement = A[i]?.[k];
                const bElement = B[k]?.[j];
                if (aElement && bElement) {
                    sum = Complex.add(sum, Complex.multiply(aElement, bElement));
                }
            }
            // Create new row array to maintain immutability
            const newRow = [...result[i]!];
            newRow[j] = sum;
            (result as ComplexNumber[][])[i] = newRow;
        }
    }

    return result;
}

/**
 * Multiplies a matrix by a vector
 * 
 * **Mathematical Definition:**
 * (Av)[i] = Σⱼ A[i][j] · v[j]
 * 
 * **Physics Application:**
 * Applying a quantum operator to a state: |ψ'⟩ = U|ψ⟩
 * 
 * @param matrix - Matrix (m×n)
 * @param vector - Column vector (n×1)
 * @returns Result vector (m×1)
 * @throws {Error} If dimensions are incompatible
 */
export function multiplyVector(
    matrix: ComplexMatrix,
    vector: ReadonlyArray<ComplexNumber>
): ReadonlyArray<ComplexNumber> {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;

    if (cols !== vector.length) {
        throw new Error(
            `Matrix-vector dimension mismatch: ${rows}×${cols} matrix, ${vector.length}-vector`
        );
    }

    const result: ComplexNumber[] = [];

    for (let i = 0; i < rows; i++) {
        let sum = Complex.ZERO;
        for (let j = 0; j < cols; j++) {
            const matrixElement = matrix[i]?.[j];
            const vectorElement = vector[j];
            if (matrixElement && vectorElement) {
                sum = Complex.add(sum, Complex.multiply(matrixElement, vectorElement));
            }
        }
        result.push(sum);
    }

    return result;
}

/**
 * Computes the Hermitian conjugate (conjugate transpose) of a matrix
 * 
 * **Mathematical Definition:**
 * A†[i][j] = (A[j][i])*
 * 
 * **Physics Application:**
 * - Hermitian operators represent observables: A† = A
 * - Unitary operators preserve norm: U†U = I
 * 
 * @param matrix - Input matrix
 * @returns Hermitian conjugate
 */
export function hermitianConjugate(matrix: ComplexMatrix): ComplexMatrix {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;

    const result = zeros(cols, rows);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const element = matrix[i]?.[j];
            if (element) {
                const newRow = [...result[j]!];
                newRow[i] = Complex.conjugate(element);
                (result as ComplexNumber[][])[j] = newRow;
            }
        }
    }

    return result;
}

/**
 * Computes the tensor product (Kronecker product) of two matrices
 * 
 * **Mathematical Definition:**
 * (A ⊗ B)[i·n+k][j·m+l] = A[i][j] · B[k][l]
 * where A is m×n and B is p×q
 * 
 * **Physics Application:**
 * Combining quantum systems: |ψ⟩⊗|φ⟩ represents the composite state
 * 
 * @param A - First matrix
 * @param B - Second matrix
 * @returns Tensor product A ⊗ B
 */
export function tensorProduct(A: ComplexMatrix, B: ComplexMatrix): ComplexMatrix {
    const rowsA = A.length;
    const colsA = A[0]?.length ?? 0;
    const rowsB = B.length;
    const colsB = B[0]?.length ?? 0;

    const resultRows = rowsA * rowsB;
    const resultCols = colsA * colsB;

    const result = zeros(resultRows, resultCols);

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            const aElement = A[i]?.[j];
            if (!aElement) continue;

            for (let k = 0; k < rowsB; k++) {
                for (let l = 0; l < colsB; l++) {
                    const bElement = B[k]?.[l];
                    if (!bElement) continue;

                    const rowIndex = i * rowsB + k;
                    const colIndex = j * colsB + l;

                    const newRow = [...result[rowIndex]!];
                    newRow[colIndex] = Complex.multiply(aElement, bElement);
                    (result as ComplexNumber[][])[rowIndex] = newRow;
                }
            }
        }
    }

    return result;
}

/**
 * Checks if a matrix is Hermitian (A† = A)
 * 
 * **Physics Application:**
 * Hermitian operators represent physical observables (energy, momentum, etc.)
 * 
 * @param matrix - Matrix to check
 * @param epsilon - Tolerance for comparison
 * @returns true if matrix is Hermitian
 */
export function isHermitian(matrix: ComplexMatrix, epsilon: number = EPSILON): boolean {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;

    if (rows !== cols) {
        return false; // Must be square
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const element = matrix[i]?.[j];
            const conjugateTranspose = matrix[j]?.[i];

            if (!element || !conjugateTranspose) continue;

            const conjugated = Complex.conjugate(conjugateTranspose);
            if (!Complex.equals(element, conjugated, epsilon)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Checks if a matrix is unitary (U†U = I)
 * 
 * **Physics Application:**
 * Unitary operators represent valid quantum gates and time evolution.
 * They preserve the normalization of quantum states.
 * 
 * @param matrix - Matrix to check
 * @param epsilon - Tolerance for comparison
 * @returns true if matrix is unitary
 */
export function isUnitary(matrix: ComplexMatrix, epsilon: number = EPSILON): boolean {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;

    if (rows !== cols) {
        return false; // Must be square
    }

    const conjugate = hermitianConjugate(matrix);
    const product = multiply(conjugate, matrix);
    const identityMatrix = identity(rows);

    return matricesEqual(product, identityMatrix, epsilon);
}

/**
 * Computes the trace of a matrix (sum of diagonal elements)
 * 
 * **Mathematical Definition:**
 * Tr(A) = Σᵢ A[i][i]
 * 
 * **Physics Application:**
 * - Tr(ρ) = 1 for density matrices (normalization)
 * - Tr(ρ²) gives purity of a quantum state
 * 
 * @param matrix - Square matrix
 * @returns Trace of the matrix
 * @throws {Error} If matrix is not square
 */
export function trace(matrix: ComplexMatrix): ComplexNumber {
    const rows = matrix.length;
    const cols = matrix[0]?.length ?? 0;

    if (rows !== cols) {
        throw new Error(`Cannot compute trace of non-square matrix (${rows}×${cols})`);
    }

    let sum = Complex.ZERO;
    for (let i = 0; i < rows; i++) {
        const element = matrix[i]?.[i];
        if (element) {
            sum = Complex.add(sum, element);
        }
    }

    return sum;
}

/**
 * Checks if two matrices are equal (within tolerance)
 * 
 * @param A - First matrix
 * @param B - Second matrix
 * @param epsilon - Tolerance for comparison
 * @returns true if matrices are equal
 */
export function matricesEqual(
    A: ComplexMatrix,
    B: ComplexMatrix,
    epsilon: number = EPSILON
): boolean {
    if (A.length !== B.length) return false;
    if ((A[0]?.length ?? 0) !== (B[0]?.length ?? 0)) return false;

    for (let i = 0; i < A.length; i++) {
        const rowA = A[i];
        const rowB = B[i];
        if (!rowA || !rowB) return false;

        for (let j = 0; j < rowA.length; j++) {
            const elementA = rowA[j];
            const elementB = rowB[j];
            if (!elementA || !elementB) return false;

            if (!Complex.equals(elementA, elementB, epsilon)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Scales a matrix by a complex scalar
 * 
 * @param scalar - Complex scalar
 * @param matrix - Matrix to scale
 * @returns Scaled matrix
 */
export function scaleMatrix(scalar: ComplexNumber, matrix: ComplexMatrix): ComplexMatrix {
    return matrix.map(row =>
        row.map(element => Complex.multiply(scalar, element))
    );
}

/**
 * Adds two matrices
 * 
 * @param A - First matrix
 * @param B - Second matrix
 * @returns Sum A + B
 * @throws {Error} If dimensions don't match
 */
export function add(A: ComplexMatrix, B: ComplexMatrix): ComplexMatrix {
    if (A.length !== B.length || (A[0]?.length ?? 0) !== (B[0]?.length ?? 0)) {
        throw new Error('Matrix dimensions must match for addition');
    }

    return A.map((row, i) =>
        row.map((element, j) => {
            const bElement = B[i]?.[j];
            return bElement ? Complex.add(element, bElement) : element;
        })
    );
}

/**
 * Formats a matrix as a string for display
 * 
 * @param matrix - Matrix to format
 * @param precision - Decimal places
 * @returns String representation
 */
export function toString(matrix: ComplexMatrix, precision: number = 4): string {
    return matrix.map(row =>
        '[' + row.map(element => Complex.toString(element, precision)).join(', ') + ']'
    ).join('\n');
}
