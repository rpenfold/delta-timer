module.exports = {
    "collectCoverage": true,
    "collectCoverageFrom": [
        "src/**/*.{ts|js}",
        "!**/node_modules/**",
        "!**/dist/**"
      ],
        "coverageThreshold": {
        "global": {
          "branches": 100,
          "functions": 100,
          "lines": 100,
          "statements": 100
        }
    }
};
