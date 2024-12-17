'use server';

import {
    SubmitBreederCertificateSchema,
    SubmitBreederCertificateState,
} from '@/app/lib/definitions';

export default async function submitBreederCertificate(
    state: SubmitBreederCertificateState,
    formData: FormData
) {
    console.log('submitBreederCertificate', state, formData);
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

    // Submit form data to the server
    fetch(
        'https://4268-2a01-4b00-805d-b800-adf5-37f9-a9f5-e235.ngrok-free.app/uploadBreederCertificate',
        {
            method: 'POST',
            body: formData,
        }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
