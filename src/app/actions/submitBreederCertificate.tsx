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

    const { email, certificate } = validatedFields.data;

    console.log('email', email);
    console.log('certificate', certificate);
}
