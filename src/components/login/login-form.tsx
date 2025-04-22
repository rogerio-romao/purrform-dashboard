'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { login } from '@/app/actions/auth';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
    const [state, action] = useFormState(login, undefined);
    const { pending } = useFormStatus();

    return (
        <form action={action}>
            <Card className='w-full max-w-sm mt-32'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='email'>Email</Label>
                        <Input
                            id='email'
                            type='email'
                            name='email'
                            placeholder='email@example.com'
                            required
                        />
                    </div>
                    {state?.errors?.email && (
                        <p className='text-sm text-red-400'>
                            {state.errors.email}
                        </p>
                    )}
                    <div className='grid gap-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input
                            id='password'
                            type='password'
                            name='password'
                            required
                        />
                    </div>
                    {state?.errors?.password && (
                        <p className='text-sm text-red-400'>
                            {state.errors.password}
                        </p>
                    )}
                </CardContent>
                <CardFooter>
                    <Button className='w-full' type='submit' disabled={pending}>
                        Sign in
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
