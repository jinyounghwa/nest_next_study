module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.e2e-spec.ts',
    '!**/main.ts',
    '!**/index.ts',
  ],
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testEnvironment: 'node',

  setupFilesAfterEnv: ['<rootDir>/../test/setup.ts'],
}; 