'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import Loading from '@/components/common/loading';
import TescoOrdersList from '@/components/tesco-orders/tesco-orders-list';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { TescoOrder, TescoOrdersResponse } from '@/app/lib/types';
import { cn, filterTescoOrdersByDateFormSchema } from '@/app/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

export default function TescoOrders() {
    const [tescoOrders, setTescoOrders] = useState<TescoOrder[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof filterTescoOrdersByDateFormSchema>>({
        resolver: zodResolver(filterTescoOrdersByDateFormSchema),
        defaultValues: {
            startDate: '',
            endDate: '',
        },
    });

    function onSubmit(
        values: z.infer<typeof filterTescoOrdersByDateFormSchema>
    ) {
        console.log('Form submitted:', values);
    }

    useEffect(() => {
        setLoading(true);
        setFetchError(null);

        const fetchData = async () => {
            const response = await fetch(`${BACKEND_BASE_URL}/getTescoOrders`);
            const json = (await response.json()) as TescoOrdersResponse;

            if (json.error) {
                setFetchError(json.error);
                setLoading(false);
                return;
            }

            setTescoOrders(json.data);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <Card className='sm:col-span-2'>
                            <CardHeader className='pb-3'>
                                <CardTitle>Tesco Orders</CardTitle>
                                <CardDescription className='text-balance leading-relaxed'>
                                    Check the list of Tesco orders, with the
                                    BigCommerce order ID and the Tesco invoice
                                    ID. Search for orders within specific date
                                    ranges.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className='sm:col-span-2'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>
                                    Filter Orders by Date Range
                                </CardTitle>
                                <CardContent>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(
                                                onSubmit
                                            )}
                                            className='space-y-8'
                                        >
                                            <div className='flex gap-8'>
                                                <FormField
                                                    control={form.control}
                                                    name='startDate'
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col mt-4'>
                                                            <FormLabel>
                                                                Start Date
                                                            </FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger
                                                                    asChild
                                                                >
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={
                                                                                'outline'
                                                                            }
                                                                            className={cn(
                                                                                'w-[240px] pl-3 text-left font-normal',
                                                                                !field.value &&
                                                                                    'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                field.value
                                                                            ) : (
                                                                                <span>
                                                                                    Pick
                                                                                    a
                                                                                    date
                                                                                </span>
                                                                            )}
                                                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className='w-auto p-0'
                                                                    align='start'
                                                                >
                                                                    <Calendar
                                                                        mode='single'
                                                                        selected={
                                                                            new Date(
                                                                                field.value
                                                                            )
                                                                        }
                                                                        onSelect={(
                                                                            date
                                                                        ) => {
                                                                            if (
                                                                                date
                                                                            ) {
                                                                                // this is to avoid timezone issues
                                                                                date.setHours(
                                                                                    5
                                                                                );
                                                                                field.onChange(
                                                                                    date
                                                                                        .toISOString()
                                                                                        .split(
                                                                                            'T'
                                                                                        )[0]
                                                                                );
                                                                            }
                                                                        }}
                                                                        autoFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name='endDate'
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col mt-4'>
                                                            <FormLabel>
                                                                End Date
                                                            </FormLabel>
                                                            <Popover>
                                                                <PopoverTrigger
                                                                    asChild
                                                                    disabled={
                                                                        !form.watch(
                                                                            'startDate'
                                                                        )
                                                                    }
                                                                >
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={
                                                                                'outline'
                                                                            }
                                                                            className={cn(
                                                                                'w-[240px] pl-3 text-left font-normal',
                                                                                !field.value &&
                                                                                    'text-muted-foreground'
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                field.value
                                                                            ) : (
                                                                                <span>
                                                                                    Pick
                                                                                    a
                                                                                    date
                                                                                </span>
                                                                            )}
                                                                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent
                                                                    className='w-auto p-0'
                                                                    align='start'
                                                                >
                                                                    <Calendar
                                                                        mode='single'
                                                                        selected={
                                                                            new Date(
                                                                                field.value
                                                                            )
                                                                        }
                                                                        onSelect={(
                                                                            date
                                                                        ) => {
                                                                            if (
                                                                                date
                                                                            ) {
                                                                                // this is to avoid timezone issues
                                                                                date.setHours(
                                                                                    5
                                                                                );
                                                                                field.onChange(
                                                                                    date
                                                                                        .toISOString()
                                                                                        .split(
                                                                                            'T'
                                                                                        )[0]
                                                                                );
                                                                            }
                                                                        }}
                                                                        autoFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className='flex gap-2'>
                                                <Button type='submit'>
                                                    Submit
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </CardHeader>
                        </Card>

                        {tescoOrders.length === 0 ? (
                            <p>No orders found.</p>
                        ) : (
                            <TescoOrdersList orders={tescoOrders} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
