'use server';

import { BACKEND_BASE_URL } from '../lib/definitions';

export default async function acceptBreederCertificate(
    certificateId: number,
    email: string
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        const response = await fetch(
            `${BACKEND_BASE_URL}/acceptBreederCertificate?id=${certificateId}&breeder_email=${encodeURIComponent(
                email
            )}`
        );

        if (!response.ok) {
            return { ok: false, error: 'Failed to accept breeder certificate' };
        }

        return { ok: true };
    } catch (error) {
        return { ok: false, error: 'Failed to accept breeder certificate' };
    }
}
