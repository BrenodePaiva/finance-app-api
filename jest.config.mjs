/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    setupFiles: ['./jest.setup.js'],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: ['/node_modules/(?!(@faker-js|@prisma))'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.js'],
    testPathIgnorePatterns: ['/.postgres-data/'],
    watchPathIgnorePatterns: ['/.postgres-data/'],
    modulePathIgnorePatterns: ['<rootDir>/.postgres-data']
}

export default config
