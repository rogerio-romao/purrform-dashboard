import { cn } from '@/app/lib/utils';
import LogoutButton from '@/components/logout-button';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/ui/mode-toggle';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
                    <main className='px-6 py-2 min-h-screen'>
                        <header className='flex justify-between items-center py-4 border-b border-green-900'>
                            <h1 className='text-3xl font-semibold tracking-tight'>
                                Purrform Apps Dashboard
                            </h1>
                            <div className='flex items-center gap-2'>
                                <LogoutButton />
                                <ModeToggle />
                            </div>
                        </header>
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
