'use client'

import Link from 'next/link'

import DarkModeButton from '@/components/ui/buttons/dark-mode-btn'

const MainHeader = () => {
    return (
        <header>
            <div className='max-w-7xl mx-auto flex flex-row justify-between items-center px-4 py-8 z-50'>
                <div>
                    <Link
                        href='/'
                        className='text-3xl font-[family-name:var(--font-bebas-neue)] font-bold'
                    >
                        Slack Message Sender
                    </Link>
                </div>

                <DarkModeButton />
            </div>
        </header>
    )
}

export default MainHeader
