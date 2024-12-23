'use client';

import AppSidebar from '@/components/app-siderbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useState } from 'react';
import BreederCertificates from './breeder-certificates';
import OrdersLoyaltyStats from './orders-loyalty-stats';
import TraceabilityIngredients from './traceability-ingredients';

export default function Page() {
    const [activeWidget, setActiveWidget] = useState('orders');
    return (
        <SidebarProvider>
            <AppSidebar setActiveWidget={setActiveWidget} />
            {activeWidget === 'orders' && <OrdersLoyaltyStats />}
            {activeWidget === 'traceability' && <TraceabilityIngredients />}
            {activeWidget === 'certificates' && <BreederCertificates />}
        </SidebarProvider>
    );
}
