'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    ArrowLeftFromLine,
    BarChart,
    Beef,
    CirclePercent,
    CreditCard,
    ShieldCheck,
    ShoppingCart,
    Store,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import type { NavItem, UserRole } from '@/app/lib/types';

// Menu items.
const items: NavItem[] = [
    {
        title: 'Sales Statistics',
        to: 'sales-statistics',
        icon: BarChart,
        allowedRoles: ['admin'],
    },
    {
        title: 'Traceability Ingredients',
        to: 'traceability-ingredients',
        icon: Beef,
        allowedRoles: ['admin'],
    },
    {
        title: 'Breeder Certificates',
        to: 'breeder-certificates',
        icon: ShieldCheck,
        allowedRoles: ['admin'],
    },
    {
        title: 'Recall Products',
        to: 'recall-products',
        icon: ArrowLeftFromLine,
        allowedRoles: ['admin'],
    },
    {
        title: 'Trader Credit',
        to: 'trader-credit',
        icon: CreditCard,
        allowedRoles: ['admin', 'bookkeeper'],
    },
    {
        title: 'Coupon Code Types',
        to: 'coupon-code-types',
        icon: CirclePercent,
        allowedRoles: ['admin'],
    },
    {
        title: 'Tesco Orders',
        to: 'tesco-orders',
        icon: Store,
        allowedRoles: ['admin', 'bookkeeper'],
    },
    {
        title: 'TNC Sellers',
        to: 'tnc-sellers',
        icon: ShoppingCart,
        allowedRoles: ['admin'],
    },
];

interface AppSidebarProps {
    currentRole: UserRole | null;
}

export default function AppSidebar({ currentRole }: AppSidebarProps) {
    const pathname = usePathname();
    // Filter items based on the current role
    const filteredItems = items.filter(
        (item) => currentRole && item.allowedRoles.includes(currentRole)
    );

    return (
        <Sidebar collapsible='icon' className='mt-24 rounded'>
            {' '}
            {/* Adjust the marginTop value as needed */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <SidebarTrigger />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarSeparator />
                            {filteredItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton asChild>
                                                    <Link
                                                        href={`/dashboard/${item.to}`}
                                                    >
                                                        <item.icon />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side='right'
                                                align='center'
                                            >
                                                {item.title}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
