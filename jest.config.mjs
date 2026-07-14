/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!@faker-js)' // <- permite transformar faker
    ],
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testPathIgnorePatterns: ['/.postgres-data/'],
    watchPathIgnorePatterns: ['/.postgres-data/'],
    modulePathIgnorePatterns: ['<rootDir>/.postgres-data']
}

export default config
