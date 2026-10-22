import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['dist/**', '.ssr/**', 'public/**', 'server/**', 'scripts/**'] },
  js.configs.recommended,
  { files: ['src/**/*.{js,jsx}', 'vite.config.js'], languageOptions: { globals: { ...globals.browser, ...globals.node }, parserOptions: { ecmaFeatures: { jsx: true } } }, plugins: { 'react-hooks': reactHooks, react }, rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }], 'react/jsx-uses-vars': 'error', ...reactHooks.configs.recommended.rules } }
];
