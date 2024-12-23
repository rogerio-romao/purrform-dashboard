'use server';

export default async function rejectBreederCertificate(
    certificateId: number
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        const response = await fetch(
            `https://purrform-apps-027e.onrender.com/rejectBreederCertificate?id=${certificateId}`
        );

        if (!response.ok) {
            return { ok: false, error: 'Failed to reject breeder certificate' };
        }

        return { ok: true };
    } catch (error) {
        return { ok: false, error: 'Failed to reject breeder certificate' };
    }
}
