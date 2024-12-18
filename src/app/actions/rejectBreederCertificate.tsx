'use server';

export default async function rejectBreederCertificate(
    certificateId: number
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        const response = await fetch(
            `https://4268-2a01-4b00-805d-b800-adf5-37f9-a9f5-e235.ngrok-free.app/rejectBreederCertificate?id=${certificateId}`
        );

        if (!response.ok) {
            return { ok: false, error: 'Failed to reject breeder certificate' };
        }

        return { ok: true };
    } catch (error) {
        return { ok: false, error: 'Failed to reject breeder certificate' };
    }
}
