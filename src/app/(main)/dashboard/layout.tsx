import SidebarRoleLoader from '@/components/layout/sidebar-role-loader';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <div className='flex flex-1'>
                <SidebarRoleLoader />
                <main className='flex-1 w-full'>{children}</main>
            </div>
        </SidebarProvider>
    );
}
