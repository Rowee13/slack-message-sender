export default function Home() {
    return (
        <section>
            <div className='relative isolate px-6 pt-14 lg:px-8'>
                <div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
                    <div className='text-center'>
                        <h1 className='text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-7xl'>
                            <span className='bg-gradient-to-r from-primary to-cyan-500 bg-clip-text font-extrabold text-transparent'>
                                PHS
                            </span>{' '}
                            NextJS Starter
                        </h1>
                        <p className='mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8'>
                            A starter project for PHS using NextJS, TailwindCSS,
                            and TypeScript.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
