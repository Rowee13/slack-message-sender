import MainFooter from '@/components/footer/main-footer'
import MainHeader from '@/components/header/main-header'

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='flex flex-col min-h-screen font-[family-name:var(--font-outfit)]'>
            <MainHeader />
            <main className='flex-grow overflow-y-auto'>{children}</main>
            <MainFooter />
        </div>
    )
}
