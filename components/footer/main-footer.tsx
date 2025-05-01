import Link from 'next/link'

import { FaGithub } from 'react-icons/fa'

const MainFooter = () => {
    return (
        <footer className='mt-auto'>
            <div className='max-w-7xl mx-auto px-4 py-4 border-t border-foreground/10'>
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-sm text-muted-foreground'>
                        Coding Challenge from First Mate Technologies - May 2025
                    </p>
                    <div>
                        <Link
                            href='https://github.com/Rowee13/slack-message-sender'
                            passHref
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <FaGithub className='w-5 h-5 hover:text-cyan-500' />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default MainFooter
