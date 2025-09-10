/**
 * Vitest Configuration
 * Professional testing setup following industry standards
 * @author NeomSense Development Team
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./client/src/test-setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: [
        'client/src/**/*.{ts,tsx}',
      ],
      exclude: [
        'client/src/**/*.test.{ts,tsx}',
        'client/src/**/*.spec.{ts,tsx}',
        'client/src/test-setup.ts',
        'client/src/vite-env.d.ts',
        'node_modules/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@assets': resolve(__dirname, './attached_assets'),
    },
  },
});