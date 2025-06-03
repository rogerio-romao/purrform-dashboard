import { getSessionRole } from '@/app/lib/session';
import AppSidebar from './app-sidebar'; // Your existing AppSidebar component

export default async function SidebarRoleLoader() {
    const role = await getSessionRole();
    return <AppSidebar currentRole={role} />;
}
