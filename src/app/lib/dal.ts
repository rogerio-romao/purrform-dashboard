import 'server-only';

import { decrypt, updateSession } from '@/app/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value;
    const session = await decrypt(cookie);

    if (!session?.role) {
        redirect('/login');
    }

    await updateSession();

    return { isAuthorized: true, role: session.role };
});
