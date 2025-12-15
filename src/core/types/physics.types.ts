/**
 * @fileoverview Physics engine type definitions
 * @module core/types/physics
 */

import type { Vector2D } from './math.types.js';

/**
 * Configuration for a physics body
 */
export interface PhysicsBodyConfig {
    /** Initial position */
    readonly position: Vector2D;
    /** Initial velocity */
    readonly velocity: Vector2D;
    /** Mass of the body (kg) */
    readonly mass: number;
    /** Coefficient of restitution (0 = no bounce, 1 = perfect bounce) */
    readonly restitution: number;
    /** Friction coefficient */
    readonly friction: number;
    /** Density (mass per unit area) */
    readonly density: number;
    /** Initial rotation angle (radians) */
    readonly angle: number;
    /** Angular velocity (radians/second) */
    readonly angularVelocity: number;
}

/**
 * Gravity configuration
 */
export interface GravityConfig {
    /** Horizontal gravity component */
    readonly x: number;
    /** Vertical gravity component (positive = down, negative = up) */
    readonly y: number;
    /** Gravity scale factor */
    readonly scale: number;
    /** Whether antigravity mode is active */
    readonly isAntigravity: boolean;
}

/**
 * Quantum effects configuration for physics simulation
 * 
 * **Physics Explanation:**
 * These parameters control how quantum uncertainty and probability
 * affect the classical physics simulation, creating a hybrid
 * quantum-classical system.
 */
export interface QuantumEffectsConfig {
    /** 
     * Quantum probability (0-1)
     * 
     * Controls the likelihood of quantum jitter being applied.
     * Higher values = more chaotic, uncertain behavior.
     */
    readonly quantumProbability: number;

    /** 
     * Time dilation factor (0.5-5.0)
     * 
     * Simulates relativistic time dilation effects.
     * <1 = slow motion, >1 = fast forward
     */
    readonly timeDilation: number;

    /** 
     * Dispersal force magnitude
     * 
     * Strength of the explosive radial force applied during dispersal.
     */
    readonly dispersalForce: number;

    /**
     * Rotation intensity (degrees)
     * 
     * Maximum random rotation applied to bodies.
     */
    readonly rotationIntensity: number;

    /**
     * Scale factor (0.5-1.5)
     * 
     * Size multiplier for physics bodies.
     */
    readonly scaleFactor: number;
}

/**
 * Physics body with visual data
 * 
 * Extends Matter.js body with rendering information
 * to preserve the appearance of original DOM elements.
 */
export interface PhysicsBodyWithData {
    /** Matter.js body reference */
    readonly body: Matter.Body;
    /** Visual rendering data */
    readonly elementData: ElementRenderData;
}

/**
 * Rendering data for physics bodies
 */
export type ElementRenderData = TextElementData | ImageElementData | ContainerElementData;

/**
 * Text element rendering data
 */
export interface TextElementData {
    readonly type: 'text';
    readonly text: string;
    readonly color: string;
    readonly fontSize: string;
    readonly fontFamily: string;
    readonly fontWeight: string;
    readonly textAlign: CanvasTextAlign;
}

/**
 * Image element rendering data
 */
export interface ImageElementData {
    readonly type: 'image';
    readonly imageSrc: string;
    readonly image: HTMLImageElement;
}

/**
 * Container element rendering data
 */
export interface ContainerElementData {
    readonly type: 'container';
    readonly backgroundColor: string;
    readonly borderColor: string;
    readonly borderWidth: number;
    readonly borderRadius: number;
}

/**
 * Force vector
 */
export interface Force {
    readonly x: number;
    readonly y: number;
}

/**
 * Collision event data
 */
export interface CollisionEvent {
    readonly bodyA: Matter.Body;
    readonly bodyB: Matter.Body;
    readonly timestamp: number;
}

/**
 * Physics engine state
 */
export interface PhysicsEngineState {
    readonly isActive: boolean;
    readonly gravity: GravityConfig;
    readonly quantumEffects: QuantumEffectsConfig;
    readonly bodies: ReadonlyArray<PhysicsBodyWithData>;
    readonly elapsedTime: number;
}

/**
 * Boundary configuration
 */
export interface BoundaryConfig {
    readonly width: number;
    readonly height: number;
    readonly thickness: number;
    readonly isStatic: boolean;
}
