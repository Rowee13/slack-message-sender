import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.config({
        extends: [
            'next',
            'next/core-web-vitals',
            'next/typescript',
            'prettier',
        ],
        plugins: ['check-file'],
        rules: {
            'prefer-template': ['error'],
            'check-file/filename-naming-convention': [
                'error',
                {
                    // all files should be named in kebab-case except for file inside hooks folder
                    'app/**/*': 'KEBAB_CASE',
                    'components/**/*': 'KEBAB_CASE',
                    'lib/**/*': 'KEBAB_CASE',
                    'utils/**/*': 'KEBAB_CASE',
                    'store/**/*': 'KEBAB_CASE',
                    'types/**/*': 'KEBAB_CASE',
                },
                {
                    // ignore the middle extensions of the filename to support filename like bable.config.js or smoke.spec.ts
                    ignoreMiddleExtensions: true,
                },
            ],
            'check-file/folder-naming-convention': [
                'error',
                {
                    // all folders (except __tests__)should be named in kebab-case
                    '**/!(__tests__)': 'KEBAB_CASE',
                },
            ],
        },
    }),
]

export default eslintConfig
