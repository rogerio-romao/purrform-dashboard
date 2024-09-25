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
    password: z.enum(['5$=~E)7P~r@1'], { message: 'Invalid password' }),
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
