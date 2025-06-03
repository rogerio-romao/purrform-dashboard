'use client';
import { logout } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function LogoutButton() {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    return isDashboard ? (
        <Button variant='outline' size='sm' onClick={() => logout()}>
            Log out
        </Button>
    ) : null;
}
