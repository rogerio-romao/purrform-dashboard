'use client';

import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

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
import { Button } from './ui/button';
import { Separator } from './ui/separator';

import submitBreederCertificate from '@/app/actions/submitBreederCertificate';

export default function BreederCertificateForm() {
    const { toast } = useToast();
    const [state, action] = useFormState(submitBreederCertificate, undefined);
    const { pending } = useFormStatus();
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (state?.success === true) {
            toast({
                title: 'Success!',
                description: state.message,
                variant: 'default',
            });
            setSuccess(true);
        } else if (state?.success === false) {
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <div className='grid w-full max-w-md items-center gap-1.5 mt-32'>
            {success === true ? (
                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl text-balance'>
                            Certificate Uploaded Successfully
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>
                            Your certificate has been uploaded successfully. Our
                            staff will review it and you will receive an email
                            once it has been approved. You can close this window
                            now.
                        </CardDescription>
                    </CardContent>
                </Card>
            ) : (
                <form action={action}>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-xl text-balance'>
                                Enter the email you used to sign up below, and
                                upload your certificate file.
                            </CardTitle>
                            <CardDescription className='pt-2'>
                                Accepted formats: pdf or image
                            </CardDescription>
                        </CardHeader>
                        <Separator className='mb-8' />
                        <CardContent className='grid gap-4'>
                            <div className='grid gap-2 mb-4'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    name='email'
                                    required
                                />
                            </div>
                            {state?.errors?.email && (
                                <p className='text-sm text-red-400'>
                                    {state.errors.email}
                                </p>
                            )}
                            <div className='grid gap-2'>
                                <Label htmlFor='certificate'>
                                    Certificate File
                                </Label>
                                <Input
                                    id='certificate'
                                    type='file'
                                    required
                                    accept='image/*,.pdf'
                                    name='certificate'
                                />
                            </div>
                            {state?.errors?.certificate && (
                                <p className='text-sm text-red-400'>
                                    {state.errors.certificate}
                                </p>
                            )}
                        </CardContent>
                        <CardFooter className='mt-2'>
                            <Button type='submit' disabled={pending}>
                                Submit
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            )}
            <Toaster />
        </div>
    );
}
