'use client';

import { useState } from 'react';

import AppSidebar from '@/components/app-siderbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import BreederCertificates from './breeder-certificates';
import OrdersLoyaltyStats from './orders-loyalty-stats';
import RecallProducts from './recall-products';
import TraceabilityIngredients from './traceability-ingredients';
import TraderCredit from './trader-credit';

export default function Page() {
    const [activeWidget, setActiveWidget] = useState('orders');
    return (
        <SidebarProvider>
            <AppSidebar setActiveWidget={setActiveWidget} />
            {activeWidget === 'orders' && <OrdersLoyaltyStats />}
            {activeWidget === 'traceability' && <TraceabilityIngredients />}
            {activeWidget === 'certificates' && <BreederCertificates />}
            {activeWidget === 'recall' && <RecallProducts />}
            {activeWidget === 'credit' && <TraderCredit />}
        </SidebarProvider>
    );
}
