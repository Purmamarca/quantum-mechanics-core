import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            include: ['src/core/**/*.ts'],
            exclude: [
                'src/**/*.test.ts',
                'src/**/*.spec.ts',
                'src/**/index.ts',
                'src/**/types/**'
            ],
            thresholds: {
                lines: 90,
                functions: 90,
                branches: 85,
                statements: 90
            }
        },
        setupFiles: ['./tests/test-utils/setup.ts']
    },
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './src/core'),
            '@ui': path.resolve(__dirname, './src/ui'),
            '@config': path.resolve(__dirname, './src/config'),
            '@utils': path.resolve(__dirname, './src/core/utils')
        }
    }
});
