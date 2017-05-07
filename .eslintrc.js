module.exports = {
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            destructuring: true
        }
    },
    env: {
        node: true
    },
    extends: ['airbnb-base'],
    rules: {
        indent: ['error', 4],
        'no-console': 0,
        'comma-dangle': ['error', 'never'],
        extensions: 0,
        'arrow-body-style': ['error', 'as-needed'],
        'consistent-return': [0],
        'no-param-reassign': [2, {
            'props': false
        }],
        'space-before-function-paren': ['error', 'always'],
        'class-methods-use-this': 0,
        'no-underscore-dangle': 0,
        'no-useless-constructor': 2,
        'no-class-assign': [0],
        'array-callback-return': [0],
        'no-case-declarations': 0,
        'global-require': [0],
        'func-names': ['warn', 'as-needed'],
        'import/no-extraneous-dependencies': 0,
        'no-unused-vars': [2, { 'varsIgnorePattern': '^_|^id' }],
    },
    settings: {
        'import/ignore': ['js']
    }
};
