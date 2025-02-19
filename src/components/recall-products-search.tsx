import { zodResolver } from '@hookform/resolvers/zod';
import { use, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { recallProductsFormSchema } from '@/app/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import RecallProductsSearchbox from './recall-products-searchbox';

export default function RecallProductsSearch() {
    const form = useForm<z.infer<typeof recallProductsFormSchema>>({
        resolver: zodResolver(recallProductsFormSchema),
        defaultValues: {
            selectedProduct: '',
            startDate: '',
            endDate: '',
        },
    });

    const [startInput, endInput] = form.watch(['startDate', 'endDate']);

    useEffect(() => {
        if (startInput && endInput) {
            const startDate = new Date(startInput);
            const endDate = new Date(endInput);

            if (startDate > endDate) {
                form.setError('startDate', {
                    type: 'manual',
                    message: 'Start date must be before end date',
                });
            } else {
                form.clearErrors('startDate');
            }
        }
    }, [startInput, endInput, form]);

    const onSubmit = (data: z.infer<typeof recallProductsFormSchema>) => {
        if (form.formState.errors) {
            return;
        }
        console.log(data);
    };

    return (
        <Card className='sm:col-span-3 w-full'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>
                    Search for product to recall
                </CardTitle>
                <CardContent>
                    <RecallProductsSearchbox />
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-8'
                        >
                            <div className='flex flex-col justify-center gap-4'>
                                <FormField
                                    control={form.control}
                                    name='selectedProduct'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Ox Heart Treats'
                                                    {...field}
                                                    required
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='flex gap-4'>
                                    <FormField
                                        control={form.control}
                                        name='startDate'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Start Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='date'
                                                        {...field}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='endDate'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='date'
                                                        {...field}
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className='flex gap-2'>
                                <Button type='submit'>Search</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </CardHeader>
        </Card>
    );
}
