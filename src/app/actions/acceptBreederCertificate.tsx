'use server';

export default async function acceptBreederCertificate(
    certificateId: number,
    email: string
): Promise<{ ok: false; error: string } | { ok: true }> {
    try {
        const response = await fetch(
            `https://4268-2a01-4b00-805d-b800-adf5-37f9-a9f5-e235.ngrok-free.app/acceptBreederCertificate?id=${certificateId}&breeder_email=${email}`
        );

        if (!response.ok) {
            return { ok: false, error: 'Failed to accept breeder certificate' };
        }

        return { ok: true };
    } catch (error) {
        return { ok: false, error: 'Failed to accept breeder certificate' };
    }
}
