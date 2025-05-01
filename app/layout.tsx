import type { Metadata } from 'next'
import { Bebas_Neue, Outfit } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'

import { siteConfig } from '@/constant/config'

import '../styles/globals.css'

const bebasNeue = Bebas_Neue({
    variable: '--font-bebas-neue',
    weight: '400',
    subsets: ['latin'],
})

const outfit = Outfit({
    variable: '--font-outfit',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.title}`,
    },
    description: siteConfig.description,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en' suppressHydrationWarning={true}>
            <body
                className={`${bebasNeue.variable} ${outfit.variable} antialiased`}
            >
                <ThemeProvider
                    attribute='class'
                    defaultTheme='light'
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
