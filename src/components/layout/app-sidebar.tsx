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

// Menu items.
const items = [
    {
        title: 'Sales & Loyalty Stats',
        stateLabel: 'orders',
        icon: BarChart,
    },
    {
        title: 'Traceability Ingredients',
        stateLabel: 'traceability',
        icon: Beef,
    },
    {
        title: 'Breeder Certificates',
        stateLabel: 'certificates',
        icon: ShieldCheck,
    },
    {
        title: 'Recall Products',
        stateLabel: 'recall',
        icon: ArrowLeftFromLine,
    },
    {
        title: 'Trader Credit',
        stateLabel: 'credit',
        icon: CreditCard,
    },
];

interface AppSidebarProps {
    setActiveWidget: (widget: string) => void;
}

export default function AppSidebar({ setActiveWidget }: AppSidebarProps) {
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
                                                <SidebarMenuButton
                                                    onClick={() =>
                                                        setActiveWidget(
                                                            item.stateLabel
                                                        )
                                                    }
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
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
