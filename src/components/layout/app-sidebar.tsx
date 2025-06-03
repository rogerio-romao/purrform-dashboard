import {
    ArrowLeftFromLine,
    BarChart,
    Beef,
    CreditCard,
    ShieldCheck,
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
import Link from 'next/link';

// Menu items.
const items = [
    {
        title: 'Sales & Loyalty Stats',
        to: 'orders-loyalty-stats',
        icon: BarChart,
    },
    {
        title: 'Traceability Ingredients',
        to: 'traceability-ingredients',
        icon: Beef,
    },
    {
        title: 'Breeder Certificates',
        to: 'breeder-certificates',
        icon: ShieldCheck,
    },
    {
        title: 'Recall Products',
        to: 'recall-products',
        icon: ArrowLeftFromLine,
    },
    {
        title: 'Trader Credit',
        to: 'trader-credit',
        icon: CreditCard,
    },
];

export default function AppSidebar() {
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
                            {items.map((item) => (
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
