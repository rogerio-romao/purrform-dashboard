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
import { BarChart, Beef } from 'lucide-react';

// Menu items.
const items = [
    {
        title: 'Sales & Loyalty Stats',
        stateLabel: 'orders',
        url: '#',
        icon: BarChart,
    },
    {
        title: 'Traceability Ingredients',
        stateLabel: 'traceability',
        url: '#',
        icon: Beef,
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
