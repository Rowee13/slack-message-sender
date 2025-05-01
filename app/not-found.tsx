import Link from 'next/link'

import { BiSolidError } from 'react-icons/bi'

export default function NotFound() {
    return (
        <main className='flex h-screen flex-col items-center justify-center gap-2'>
            <BiSolidError className='w-10 h-10 text-gray-400' />
            <h2 className='text-xl font-semibold'>404 Not Found</h2>
            <p>Could not find the requested invoice.</p>
            <Link
                href='/'
                className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400'
            >
                Go Back
            </Link>
        </main>
    )
}
