module.exports = {
    printWidth: 80,
    tabWidth: 4,
    trailingComma: 'es5',
    semi: false,
    singleQuote: true,
    jsxSingleQuote: true,
    importOrder: [
        '^(react|next?/?([a-zA-Z/]*))$',
        '<THIRD_PARTY_MODULES>',
        '^@/components/ui/(.*)$',
        '^@/components/(.*)$',
        '^@/(.*)$',
        '^[./]',
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    plugins: [
        'prettier-plugin-tailwindcss',
        '@trivago/prettier-plugin-sort-imports',
    ],
}
