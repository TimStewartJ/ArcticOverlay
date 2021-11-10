module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        semi: ['error', 'always'],
        indent: ['error', 4],
        'no-var': 'error',
        'prefer-const': 'warn',
        'no-const-assign': 'error',
        'quote-props': ['warn', 'as-needed'],
        quotes: ['error', 'single'],
        'prefer-template': 'warn',
    },
};
