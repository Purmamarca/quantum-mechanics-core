import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@core': path.resolve(__dirname, './src/core'),
            '@ui': path.resolve(__dirname, './src/ui'),
            '@config': path.resolve(__dirname, './src/config'),
            '@utils': path.resolve(__dirname, './src/core/utils')
        }
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'QuantumMechanicsCore',
            formats: ['es', 'umd'],
            fileName: (format) => `quantum-mechanics-core.${format}.js`
        },
        rollupOptions: {
            external: ['matter-js'],
            output: {
                globals: {
                    'matter-js': 'Matter'
                }
            }
        },
        sourcemap: true,
        minify: 'terser',
        target: 'es2022'
    },
    server: {
        port: 3000,
        open: true
    }
});
