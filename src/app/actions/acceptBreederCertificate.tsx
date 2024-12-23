'use server';

export default async function acceptBreederCertificate(
    certificateId: number,
    email: string
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        const response = await fetch(
            `https://purrform-apps-027e.onrender.com/acceptBreederCertificate?id=${certificateId}&breeder_email=${email}`
        );

        if (!response.ok) {
            return { ok: false, error: 'Failed to accept breeder certificate' };
        }

        return { ok: true };
    } catch (error) {
        return { ok: false, error: 'Failed to accept breeder certificate' };
    }
}
