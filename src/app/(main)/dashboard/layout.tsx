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
                <div className='w-full'>{children}</div>
            </div>
        </SidebarProvider>
    );
}
