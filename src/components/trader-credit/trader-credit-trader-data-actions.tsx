import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { CreditSystemTrader } from '@/app/lib/types';
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface TraderCreditTraderDataActionsProps {
    trader: CreditSystemTrader;
    handleViewPendingPayments: () => void;
    handleViewOrderHistory: () => void;
    handleRemoveTrader: () => void;
    handleChangeCompanyCredit: () => void;
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
});

export default function TraderCreditTraderDataActions({
    trader,
    handleViewPendingPayments,
    handleViewOrderHistory,
    handleRemoveTrader,
    handleChangeCompanyCredit,
    companyName,
}: TraderCreditTraderDataActionsProps) {
    const form = useForm<z.infer<typeof ChangeCreditFormSchema>>({
        resolver: zodResolver(ChangeCreditFormSchema),
        defaultValues: {
            companyName: trader.bc_customer_company,
            creditLimit: trader.credit_ceiling,
        },
    });

    // Reset form values when trader changes
    useEffect(() => {
        form.reset({
            companyName: trader.bc_customer_company,
            creditLimit: trader.credit_ceiling,
        });
    }, [trader, form]);

    function onSubmit(data: z.infer<typeof ChangeCreditFormSchema>) {
        if (!trader) {
            return;
        }

        console.log('Form submitted:', data);

        // reset the form after submission
        form.reset();

        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='outline'>Change Company Credit</Button>
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
                                <AlertDialogDescription></AlertDialogDescription>
                                <AlertDialogFooter className='mt-6'>
                                    <AlertDialogCancel>
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
