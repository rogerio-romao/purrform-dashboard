import { z } from 'zod';
import type { UserRole } from './types';

const PASSWORD = process.env.PASSWORD;

export const BACKEND_BASE_URL = 'https://purrform-apps-027e.onrender.com';

export const BOOKKEEPER_EMAILS = [
    'wendy@carterbookkeepingservices.co.uk',
    'george@carterbookkeepingservices.co.uk',
];

export const LoginFormSchema = z.object({
    email: z.enum(
        [
            'veronique@purrform.co.uk',
            'enquiry@purrform.co.uk',
            'support@purrform.co.uk',
            'djgroovy@gmail.com',
            'rogerio.romao@hotmail.com',
            'frank.stormfield@nutriment.com',
            'fredrik.bergstrom@nutriment.com',
            'sofia.benmessaoud@nutriment.com',
            'ryan.winwright@nutriment.com',
            ...BOOKKEEPER_EMAILS,
        ],
        { message: 'Invalid email' },
    ),
    password: z.enum([PASSWORD!], { message: 'Invalid password' }),
});

export type LoginFormState =
    | {
          errors?: {
              email?: string[];
              password?: string[];
          };
          message?: string;
      }
    | undefined;

export type SessionPayload = {
    role: UserRole;
    expiresAt: Date;
};

export const SubmitBreederCertificateSchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Expected to receive a string',
        })
        .email({ message: 'Invalid email' }),
    certificate: z.instanceof(File, {
        message: 'Expected to receive a file',
    }),
});

export type SubmitBreederCertificateState =
    | {
          errors?: {
              email?: string[];
              certificate?: string[];
          };
          message?: string;
      }
    | undefined;
