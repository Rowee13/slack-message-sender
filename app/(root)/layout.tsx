import MainFooter from '@/components/footer/main-footer'
import MainHeader from '@/components/header/main-header'

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='min-h-screen h-screen overflow-auto flex flex-col font-[family-name:var(--font-outfit)]'>
            <MainHeader />
            <main className='flex-grow'>{children}</main>
            <MainFooter />
        </div>
    )
}
