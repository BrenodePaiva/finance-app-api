/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testPathIgnorePatterns: ['/node_modules/', '/.postgres-data/'],
    watchPathIgnorePatterns: ['/.postgres-data/'],
    modulePathIgnorePatterns: ['<rootDir>/.postgres-data']
}

export default config
