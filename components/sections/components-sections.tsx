'use client'

import Link from 'next/link'

import { AnimatedModalDemo } from '@/components/ui/modal/animated-modal-demo'

const ComponentsSection = () => {
    return (
        <div className='space-y-6'>
            {/* First row: 3 columns */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-card rounded-lg shadow-md p-6 border border-border text-center flex flex-col items-center justify-center'>
                    <h3>Sample Animated Modal</h3>
                    <AnimatedModalDemo />
                    <Link
                        href='https://ui.aceternity.com/components/animated-modal'
                        passHref
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-primary'
                    >
                        From Aceternity UI
                    </Link>
                </div>
                <div className='bg-card rounded-lg shadow-md p-6 border border-border text-center flex flex-col items-center justify-center'>
                    <div className='text-center'>
                        <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center'>
                            <span className='text-2xl'>📦</span>
                        </div>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Component Placeholder
                        </p>
                    </div>
                </div>
                <div className='bg-card rounded-lg shadow-md p-6 border border-border text-center flex flex-col items-center justify-center'>
                    <div className='text-center'>
                        <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center'>
                            <span className='text-2xl'>🧩</span>
                        </div>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Component Placeholder
                        </p>
                    </div>
                </div>
            </div>

            {/* Second row: 2 columns */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-card rounded-lg shadow-md p-6 border border-border text-center flex flex-col items-center justify-center'>
                    <div className='text-center'>
                        <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center'>
                            <span className='text-2xl'>🎨</span>
                        </div>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Component Placeholder
                        </p>
                    </div>
                </div>
                <div className='bg-card rounded-lg shadow-md p-6 border border-border text-center flex flex-col items-center justify-center'>
                    <div className='text-center py-10'>
                        <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center'>
                            <span className='text-2xl'>🔍</span>
                        </div>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Component Placeholder
                        </p>
                    </div>
                </div>
            </div>

            {/* Third row: asymmetric layout */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Left column with 2 rows */}
                <div className='md:col-span-1 space-y-6'>
                    <div className='bg-card rounded-lg shadow-md p-6 border border-border text-center flex flex-col items-center justify-center'>
                        <div className='text-center py-6'>
                            <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center'>
                                <span className='text-2xl'>⚙️</span>
                            </div>
                            <p className='text-gray-500 dark:text-gray-400'>
                                Component Placeholder
                            </p>
                        </div>
                    </div>
                    <div className='bg-card rounded-lg shadow-md p-6 border border-border text-center flex flex-col items-center justify-center'>
                        <div className='text-center py-6'>
                            <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center'>
                                <span className='text-2xl'>🔔</span>
                            </div>
                            <p className='text-gray-500 dark:text-gray-400'>
                                Component Placeholder
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column spanning 2 rows */}
                <div className='md:col-span-2 bg-card rounded-lg shadow-md p-6 border border-border text-center flex flex-col items-center justify-center'>
                    <div className='text-center'>
                        <div className='w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center'>
                            <span className='text-3xl'>🚀</span>
                        </div>
                        <p className='text-gray-500 dark:text-gray-400'>
                            Large Component Placeholder
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComponentsSection
