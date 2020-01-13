module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        // "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        // "prettier/@typescript-eslint",
        "plugin:jest/recommended",
        // "plugin:prettier/recommended",
    ],
    env: {
      "es6": true,
      "node": true
    },
    parserOptions: {
      "ecmaVersion": 2019,
      "sourceType": "module"
    },
    "rules": {
      "@typescript-eslint/interface-name-prefix": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "import/no-cycle": 0,
    }
    // "extends": [
    //   "airbnb-typescript/base",
    //   "plugin:@typescript-eslint/recommended",
    //   "prettier/@typescript-eslint",
    //   "plugin:prettier/recommended",
    //   "plugin:jest/recommended"
    // ],
    // "globals": {
    //   "Atomics": "readonly",
    //   "SharedArrayBuffer": "readonly"
    // },
    // "parser": "@typescript-eslint/parser",
    // "parserOptions": {
    //   "ecmaVersion": 2019,
    //   "sourceType": "module"
    // },
    // "rules": {
    //   "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
    // }
}