module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.ts?(x)', // Matches any .ts/.tsx files in __tests__ folders
    '**/?(*.)+(spec|test).ts?(x)', // Matches any .test.ts, .spec.ts, .test.tsx, .spec.tsx
  ],
  rootDir: './',

};