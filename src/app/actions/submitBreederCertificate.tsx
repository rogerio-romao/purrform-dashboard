'use server';

import {
    SubmitBreederCertificateSchema,
    SubmitBreederCertificateState,
} from '@/app/lib/definitions';

export default async function submitBreederCertificate(
    state: SubmitBreederCertificateState,
    formData: FormData
) {
    // Validate form fields
    const validatedFields = SubmitBreederCertificateSchema.safeParse({
        email: formData.get('email'),
        certificate: formData.get('certificate'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // TODO: change the URL to the correct endpoint
        const response = await fetch(
            'https://4268-2a01-4b00-805d-b800-adf5-37f9-a9f5-e235.ngrok-free.app/uploadBreederCertificate',
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return { success: true, message: 'Certificate uploaded successfully' };
    } catch (error) {
        console.error('Error:', error);
        return {
            success: false,
            message: 'An error occurred while submitting the form',
        };
    }
}
