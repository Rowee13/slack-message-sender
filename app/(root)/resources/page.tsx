import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Resources',
    description: 'Resources Collections',
}

const BlocksPage = () => {
    return (
        <section>
            <div className='max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white'>
                    Resources
                </h1>
            </div>
        </section>
    )
}

export default BlocksPage
