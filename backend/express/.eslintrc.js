module.exports = {
  root: true,
  extends: [
    "eslint:recommended"
  ],
  rules: {
    "indent": ["error", 2],
    "no-multiple-empty-lines": "warn",
    "camelcase": "error", // Checks for lowerCamelCase
    "quotes": ["error", "single"],
    "no-var": "error",
    "prefer-const": [
      "error", {
        destructuring: "all", //Checks for destructured variables, where all should be const. Can be changed to "any"
        ignoreReadBeforeAssign: false,
      },
    ],
    "no-use-before-define": "error",
    "eqeqeq": [ "error", "always", {
      null: "ignore" 
    }],
  }
}