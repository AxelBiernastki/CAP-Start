/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.ts"],
  clearMocks: true,
  globalSetup: './test/setup.ts'
};