import type { Config } from 'jest'

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s?$': '@swc/jest'
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/../src/$1',
    '^@shared/(.*)$': '<rootDir>/../src/modules/shared/$1',
    '^@auth/(.*)$': '<rootDir>/../src/modules/auth/$1',
    '^@user/(.*)$': '<rootDir>/../src/modules/user/$1',
    '^@todo/(.*)$': '<rootDir>/../src/modules/todo/$1'
  }
}

export default config
