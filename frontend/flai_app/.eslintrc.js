module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  globals: {
    module: false,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    indent: ["error", 2],
    "no-multiple-empty-lines": "warn",
    properties: "always", // Checks for lowerCamelCase
    quotes: ["error", "single"],
    "no-var": "error",
    "prefer-const": [
      "error",
      {
        destructuring: "all", //Checks for destructured variables, where all should be const. Can be changed to "any"
        ignoreReadBeforeAssign: false,
      },
    ],
    "no-use-before-define": "error",
    eqeqeq: [
      "error",
      "always",
      {
        null: "ignore",
      },
    ],
  },
};
