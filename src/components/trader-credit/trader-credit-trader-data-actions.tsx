import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { CreditSystemTrader, OkOrErrorResponse } from '@/app/lib/types';
import { toast } from '@/hooks/use-toast';

import { CardContent } from '@/components//ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

interface TraderCreditTraderDataActionsProps {
    trader: CreditSystemTrader;
    handleViewPendingPayments: () => void;
    handleViewOrderHistory: () => void;
    handleRemoveTrader: () => void;
    companyName: string;
}

const ChangeCreditFormSchema = z.object({
    companyName: z
        .string()
        .min(2, {
            message: 'Company name must be at least 2 characters long',
        })
        .optional(),
    creditLimit: z
        .number()
        .min(0, {
            message: 'Credit limit must be a positive number',
        })
        .max(10_000, {
            message: 'Credit limit must be less than £10,000',
        }),
    invoiceEmail: z
        .union([z.string().email('Invalid email address'), z.literal('')])
        .optional(),
});

export default function TraderCreditTraderDataActions({
    trader,
    handleViewPendingPayments,
    handleViewOrderHistory,
    handleRemoveTrader,
    companyName,
}: TraderCreditTraderDataActionsProps) {
    const [changeCompanyInfoDialogOpen, setChangeCompanyInfoDialogOpen] =
        useState(false);
    const form = useForm<z.infer<typeof ChangeCreditFormSchema>>({
        resolver: zodResolver(ChangeCreditFormSchema),
        defaultValues: {
            companyName: trader.bc_customer_company,
            creditLimit: trader.credit_ceiling,
            invoiceEmail: trader.invoice_email ?? '',
        },
    });

    // Reset form values when trader changes
    useEffect(() => {
        form.reset({
            companyName: trader.bc_customer_company,
            creditLimit: trader.credit_ceiling,
            invoiceEmail: trader.invoice_email ?? '',
        });
    }, [trader, form]);

    async function onSubmit(data: z.infer<typeof ChangeCreditFormSchema>) {
        if (!trader) {
            return;
        }

        const previousCompanyName = trader.bc_customer_company;
        const newCompanyName = data.companyName;
        const companyNameChanged = previousCompanyName !== newCompanyName;
        const previousCreditLimit = trader.credit_ceiling;
        const newCreditLimit = data.creditLimit;
        const creditDifference = newCreditLimit - previousCreditLimit;
        const creditLimitChanged = previousCreditLimit !== newCreditLimit;
        const newInvoiceEmail = data.invoiceEmail;
        const invoiceEmailChanged =
            (trader.invoice_email !== null &&
                newInvoiceEmail !== trader.invoice_email) ||
            (trader.invoice_email === null && newInvoiceEmail !== '');

        if (
            !companyNameChanged &&
            !creditLimitChanged &&
            !invoiceEmailChanged
        ) {
            toast({
                title: 'No changes made',
                description: 'Please change at least one field.',
            });
            return;
        }

        const previousBalance = trader.current_balance;
        const newBalance = Number(
            Math.max(
                0,
                Math.min(previousBalance + creditDifference, newCreditLimit)
            ).toFixed(2)
        );
        const updateInfo = {
            ...(companyNameChanged && {
                'Previous Company Name': previousCompanyName,
                'New Company Name': newCompanyName,
            }),
            ...(creditLimitChanged && {
                'Previous Credit Limit': previousCreditLimit,
                'New Credit Limit': newCreditLimit,
            }),
            ...(creditLimitChanged && {
                'Previous Balance': previousBalance,
                'New Balance': newBalance,
            }),
            ...(invoiceEmailChanged && {
                'Previous Invoice Email': trader.invoice_email || 'N/A',
                'New Invoice Email': newInvoiceEmail || 'N/A',
            }),
        };

        try {
            const response = await fetch(
                `${BACKEND_BASE_URL}/changeCreditTraderInfo?traderId=${
                    trader.id
                }&companyName=${encodeURIComponent(
                    newCompanyName ?? trader.bc_customer_company
                )}&creditCeiling=${newCreditLimit}&newBalance=${newBalance}&invoiceEmail=${encodeURIComponent(
                    newInvoiceEmail ?? trader.invoice_email ?? ''
                )}`
            );

            if (!response.ok) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description:
                        'Failed to update trader info, please try again.',
                });
                return;
            }

            const data = (await response.json()) as OkOrErrorResponse;
            if (!data.ok) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: data.error,
                });
                return;
            }
        } catch (error) {
            console.error('Error updating trader info:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update trader info, please try again.',
            });
            return;
        }

        toast({
            title: 'Trader updated! You submitted the following changes:',
            description: Object.entries(updateInfo).map(([key, value]) => {
                return <p key={key}>{`${key}: ${value}`}</p>;
            }),
        });

        // close the alert dialog
        setChangeCompanyInfoDialogOpen(false);
    }

    return (
        <CardContent>
            <div className='flex space-x-4'>
                <Button variant='outline' onClick={handleViewPendingPayments}>
                    View Pending Payments
                </Button>
                <Button variant='outline' onClick={handleViewOrderHistory}>
                    View Order History
                </Button>
                <AlertDialog open={changeCompanyInfoDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant='outline'
                            onClick={() => setChangeCompanyInfoDialogOpen(true)}
                        >
                            Edit Company Info
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Change credit limit or company name
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                For: <strong>{companyName}</strong> (
                                {trader.bc_customer_email}).
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name='companyName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Company Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Company Name'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='creditLimit'
                                    render={({ field }) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>Credit Limit</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    placeholder='Credit Limit'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='invoiceEmail'
                                    render={({ field }) => (
                                        <FormItem className='mt-4'>
                                            <FormLabel>Invoice Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='email'
                                                    placeholder='Invoice Email'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <AlertDialogFooter className='mt-6'>
                                    <AlertDialogCancel
                                        onClick={() =>
                                            setChangeCompanyInfoDialogOpen(
                                                false
                                            )
                                        }
                                    >
                                        Cancel Changes
                                    </AlertDialogCancel>
                                    <Button type='submit'>
                                        Confirm Changes
                                    </Button>
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='outline'>Remove Trader</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove <strong>{companyName}</strong>{' '}
                                ({trader.bc_customer_email}) from the credit
                                system.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel Removal
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemoveTrader}>
                                Confirm Removal
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
    );
}
