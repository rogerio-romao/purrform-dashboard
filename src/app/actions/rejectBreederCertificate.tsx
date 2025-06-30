'use server';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

export default async function rejectBreederCertificate(
    certificateId: number
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/rejectBreederCertificate?id=${certificateId}`
        );

        if (!response.ok) {
            return { ok: false, error: 'Failed to reject breeder certificate' };
        }

        return { ok: true };
    } catch (error) {
        return { ok: false, error: 'Failed to reject breeder certificate' };
    }
}
