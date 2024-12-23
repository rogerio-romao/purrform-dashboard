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
        const response = await fetch(
            'https://purrform-apps-027e.onrender.com/uploadBreederCertificate',
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
