module.exports = {
  semi: false,
  trailingComma: "es5",
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  bracketSpacing: true,
  overrides: [
    {
      files: ".js",
      options: {
        parser: "javascript"
      }
    },
    {
      files: ".ts",
      options: {
        parser: "typescript"
      }
    }
  ]
}