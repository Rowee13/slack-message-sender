import SendSlackMessageForm from '@/components/ui/forms/send-slack-message'

export default function Home() {
    return (
        <section className='py-8 min-h-[calc(100vh-12rem)]'>
            <div className='relative px-6 pt-8 lg:px-8'>
                <div className='max-w-4xl mx-auto'>
                    <div className='text-center'>
                        <h1 className='text-4xl md:text-5xl bg-gradient-to-r from-primary to-cyan-500 bg-clip-text font-extrabold text-transparent h-14'>
                            Delay Sending Your Message to Slack
                        </h1>
                        <p className='mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8'>
                            Whatever reason you have, this web app helps you
                            delay sending your message to Slack.
                        </p>
                    </div>

                    <div className='flex flex-col items-center justify-center mt-10'>
                        <h3 className='text-xl font-medium text-center'>
                            Use the form below to setup your message
                        </h3>

                        <div className='mt-6 w-full max-w-md px-4 md:px-0'>
                            <SendSlackMessageForm />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
