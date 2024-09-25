import { z } from 'zod';

export const LoginFormSchema = z.object({
    email: z.enum(
        [
            'veronique@purrform.co.uk',
            'enquiry@purrform.co.uk',
            'support@purrform.co.uk',
            'djgroovy@gmail.com',
            'rogerio.romao@hotmail.com',
        ],
        { message: 'Invalid email' }
    ),
    password: z.enum(['password'], { message: 'Invalid password' }),
});

export type FormState =
    | {
          errors?: {
              email?: string[];
              password?: string[];
          };
          message?: string;
      }
    | undefined;

export type SessionPayload = {
    role: 'admin' | 'user';
    expiresAt: Date;
};
