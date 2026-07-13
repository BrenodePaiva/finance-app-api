import js from '@eslint/js'
import globals from 'globals'
import json from '@eslint/json'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'

const { jest } = globals

export default defineConfig([
    {
        ignores: ['node_modules/, dist/, env.d.ts']
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js, jest },
        extends: ['js/recommended'],
        languageOptions: { globals: globals.node }
    },
    {
        files: ['**/*.json'],
        plugins: { json },
        language: 'json/json',
        extends: ['json/recommended']
    },
    {
        files: ['**/*.jsonc'],
        plugins: { json },
        language: 'json/jsonc',
        extends: ['json/recommended']
    },
    {
        files: ['**/*.json5'],
        plugins: { json },
        language: 'json/json5',
        extends: ['json/recommended']
    },
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        extends: ['css/recommended']
    }
])
