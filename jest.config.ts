import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s?$': '@swc/jest'
  },
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '<rootDir>/../coverage',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/$1',
    '^@shared/(.*)$': '<rootDir>/modules/shared/$1',
    '^@auth/(.*)$': '<rootDir>/modules/auth/$1',
    '^@user/(.*)$': '<rootDir>/modules/user/$1',
    '^@todo/(.*)$': '<rootDir>/modules/todo/$1'
  }
}

export default config
