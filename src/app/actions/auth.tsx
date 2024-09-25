'use server';
import { FormState, LoginFormSchema } from '@/app/lib/definitions';
import { createSession, deleteSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export async function login(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // If access needed, we can access the validated fields
    // const { email, password } = validatedFields.data;

    // Create session for user
    await createSession('admin');

    // redirect to dashboard
    redirect('/dashboard');
}

export async function logout() {
    deleteSession();
    redirect('/');
}
