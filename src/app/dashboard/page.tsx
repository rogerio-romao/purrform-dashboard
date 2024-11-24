import AppSidebar from '@/components/app-siderbar';
import { SidebarProvider } from '@/components/ui/sidebar';

import OrdersLoyaltyStats from './orders-loyalty-stats';

export default async function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <OrdersLoyaltyStats />
        </SidebarProvider>
    );
}
