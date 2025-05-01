import React from 'react'

import { cn } from '@/lib/utils'

// import { IconType } from 'react-icons';

// import { LucideIcon } from 'lucide-react';

type ButtonVariant =
    | 'primary'
    | 'outline'
    | 'ghost'
    | 'light'
    | 'destructive'
    | 'link'
type ButtonSize = 'sm' | 'base'

type ButtonProps = {
    variant?: ButtonVariant
    size?: ButtonSize
    classNames?: {
        leftIcon?: string
        rightIcon?: string
    }
} & React.ComponentPropsWithRef<'button'>

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant, size, classNames, children, ...rest }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'flex items-center justify-center rounded-md transition-colors duration-200',
                    [
                        variant === 'primary' && [
                            'bg-blue-500 text-white',
                            'border border-blue-600',
                            'hover:bg-blue-600 hover:text-white',
                            'active:bg-blue-700',
                            'disabled:bg-blue-400 disabled:cursor-not-allowed',
                        ],
                        variant === 'outline' && [
                            'text-blue-500',
                            'border border-blue-500',
                            'hover:bg-blue-50 active:bg-blue-100 disabled:bg-blue-100 disabled:cursor-not-allowed',
                        ],
                        variant === 'ghost' && [
                            'text-blue-500',
                            'shadow-none',
                            'hover:bg-blue-50 active:bg-blue-100 disabled:bg-blue-100 disabled:cursor-not-allowed',
                        ],
                        variant === 'light' && [
                            'bg-white text-gray-700',
                            'border border-gray-300',
                            'hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed',
                        ],
                        variant === 'destructive' && [
                            'bg-red-500 text-white',
                            'border border-red-600',
                            'hover:bg-red-600 active:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed',
                        ],
                        variant === 'link' && [
                            'text-blue-500',
                            'hover:underline active:text-blue-700 disabled:text-blue-300 disabled:cursor-not-allowed',
                        ],
                    ],
                    size === 'sm' && 'text-sm px-3 py-1.5',
                    size === 'base' && 'text-base px-4 py-2',
                    classNames?.leftIcon,
                    classNames?.rightIcon
                )}
                {...rest}
            >
                {children}
            </button>
        )
    }
)

CustomButton.displayName = 'Button'

export default CustomButton
