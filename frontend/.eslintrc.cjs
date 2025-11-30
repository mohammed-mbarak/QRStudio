module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,   // fixes 'process' and 'global'
    jest: true,   // fixes 'jest is not defined'
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react-refresh', 'react-hooks'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    'no-undef': 'error',
    'no-unused-vars': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  globals: {
    process: 'readonly',
    global: 'readonly',
    jest: 'readonly'   // fixes jest.fn() errors
  }
}
