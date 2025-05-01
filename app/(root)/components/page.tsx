import type { Metadata } from 'next'

import ComponentsSection from '@/components/sections/components-sections'

export const metadata: Metadata = {
    title: 'Components',
    description: 'Components Collections',
}

const ComponentsPage = () => {
    return (
        <section className='min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 py-12'>
                <h1 className='text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white'>
                    Components
                </h1>

                <ComponentsSection />
            </div>
        </section>
    )
}

export default ComponentsPage
