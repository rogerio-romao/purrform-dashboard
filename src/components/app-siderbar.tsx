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
import { BarChart, Beef } from 'lucide-react';

// Menu items.
const items = [
    {
        title: 'Sales & Loyalty Stats',
        url: '#',
        icon: BarChart,
    },
    {
        title: 'Traceability Ingredients',
        url: '#',
        icon: Beef,
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
                                    <SidebarMenuButton>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
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
