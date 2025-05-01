import Link from 'next/link'

import { FaGithub } from 'react-icons/fa'

const MainFooter = () => {
    return (
        <footer>
            <div className='max-w-7xl mx-auto px-4 py-8 border-t border-foreground/25'>
                <div className='flex flex-row justify-between items-center'>
                    <p>Parrow Horrizon Studio - {new Date().getFullYear()}</p>
                    <div>
                        <Link
                            href='https://github.com/Rowee13/phs-nextjs-starter/tree/master'
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
