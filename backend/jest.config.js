const config = {
  verbose: true,
  testEnvironment: "node",
  testMatch: ["**/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/bootstrap.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
};

module.exports = config;
