'use client';

import AppSidebar from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className='flex flex-1'>
                <AppSidebar />
                <main className='flex-1 w-full'>{children}</main>
            </div>
        </SidebarProvider>
    );
}
