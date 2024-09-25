import { cn } from '@/app/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ModeToggle } from '@/components/ui/mode-toggle';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'Purrform Apps Dashboard',
    description: 'Purrform Apps Dashboard',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    inter.variable
                )}
            >
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className='px-6 py-4 min-h-screen'>
                        <header className='flex justify-between'>
                            <h1 className='text-4xl'>
                                Purrform Apps Dashboard
                            </h1>
                            <ModeToggle />
                        </header>

                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
