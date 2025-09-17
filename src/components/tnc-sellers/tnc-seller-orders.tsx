'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Loading from '@/components/common/loading';
import OrdersTable from '@/components/common/orders-table';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { CreditSystemOrder, CreditSystemTrader } from '@/app/lib/types';
import {
    cn,
    filterOrdersByDateFormSchema,
    gbpFormatter,
} from '@/app/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';

interface TncSellerOrdersProps {
    seller: CreditSystemTrader | null;
}

export default function TncSellerOrders({ seller }: TncSellerOrdersProps) {
    const [loading, setLoading] = useState(true);
    const [sellerOrders, setSellerOrders] = useState<CreditSystemOrder[]>([]);
    const [filteredSellerOrders, setFilteredSellerOrders] = useState<
        CreditSystemOrder[]
    >([]);
    const [error, setError] = useState<string | null>(null);

    const uniqueCustomers = new Set(
        filteredSellerOrders.map((order) => order.ordered_for ?? 'N/A')
    ).size;

    useEffect(() => {
        // When seller changes, reset state and refetch
        if (!seller) {
            setSellerOrders([]);
            setLoading(false);
            return;
        }
        const sellerId = seller.id; // capture to avoid TS complaining in async context
        let isCancelled = false;
        const controller = new AbortController();

        async function fetchSellerOrders() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://7eaf77623caf.ngrok-free.app/getOrderHistoryForTrader?traderId=${sellerId}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch seller orders');
                }

                const data = (await response.json()) as CreditSystemOrder[];
                if (!isCancelled) {
                    setSellerOrders(data);
                    setFilteredSellerOrders(data);
                }
            } catch (err) {
                if (!isCancelled && (err as any)?.name !== 'AbortError') {
                    setError(
                        'Error fetching seller orders, please try again later.'
                    );
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        fetchSellerOrders();

        return () => {
            isCancelled = true;
            controller.abort();
        };
    }, [seller?.id]);

    const form = useForm<z.infer<typeof filterOrdersByDateFormSchema>>({
        resolver: zodResolver(filterOrdersByDateFormSchema),
        defaultValues: {
            startDate: '',
            endDate: '',
        },
    });

    function onSubmit(values: z.infer<typeof filterOrdersByDateFormSchema>) {
        if (!sellerOrders || sellerOrders.length === 0) {
            setFilteredSellerOrders([]);
            return;
        }

        const validated = filterOrdersByDateFormSchema.safeParse(values);

        if (!validated.success) {
            return;
        }

        const { startDate, endDate } = values;
        const [startYear, startMonth, startDay] = startDate.split('-');
        const [endYear, endMonth, endDay] = endDate.split('-');

        const startDateObj = new Date(
            Number(startYear),
            Number(startMonth) - 1,
            Number(startDay),
            5,
            0,
            0,
            0
        );
        const endDateObj = new Date(
            Number(endYear),
            Number(endMonth) - 1,
            Number(endDay),
            5,
            0,
            0,
            0
        );

        const filtered = sellerOrders.filter((order) => {
            const [year, month, day] = order.order_date.split('-');
            const orderDate = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                5,
                0,
                0,
                0
            );

            return (
                orderDate.getTime() >= startDateObj.getTime() &&
                orderDate.getTime() <= endDateObj.getTime()
            );
        });

        setFilteredSellerOrders(filtered);
    }

    if (loading) {
        return (
            <div className='flex flex-col gap-4 items-center justify-center'>
                <div>Loading seller orders...</div>
                <Loading />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Card className='mt-6 relative'>
            <CardHeader>
                <CardTitle className='text-lg'>
                    Orders made by {seller?.bc_customer_first_name}{' '}
                    {seller?.bc_customer_last_name}
                </CardTitle>
                {sellerOrders.length === 0 ? (
                    <CardDescription>No orders available.</CardDescription>
                ) : (
                    <>
                        <CardDescription className='flex flex-wrap gap-6'>
                            <div className='font-semibold uppercase'>
                                Summary:
                            </div>
                            <div>
                                Total Orders:{' '}
                                <span className='font-semibold'>
                                    {filteredSellerOrders.length}
                                </span>
                            </div>
                            <div>
                                Unique Customers:{' '}
                                <span className='font-semibold'>
                                    {uniqueCustomers}
                                </span>
                            </div>
                            <div>
                                Total Amount:{' '}
                                <span className='font-semibold'>
                                    {gbpFormatter.format(
                                        filteredSellerOrders.reduce(
                                            (acc, order) =>
                                                acc + order.order_total,
                                            0
                                        )
                                    )}
                                </span>
                            </div>
                        </CardDescription>
                        <CardContent>
                            <div className='mt-6'>Filter by date range:</div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className='space-y-8 flex items-center gap-8'
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
                                                        <PopoverTrigger asChild>
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
                                                                    if (date) {
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
                                                                disabled={{
                                                                    after: new Date(),
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
                                                                    if (date) {
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
                                                                disabled={
                                                                    form.watch(
                                                                        'startDate'
                                                                    )
                                                                        ? {
                                                                              before: new Date(
                                                                                  form.watch(
                                                                                      'startDate'
                                                                                  )
                                                                              ),
                                                                              after: new Date(),
                                                                          }
                                                                        : {
                                                                              after: new Date(),
                                                                          }
                                                                }
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='flex gap-4 items-center'>
                                        <Button
                                            type='submit'
                                            disabled={
                                                !form.watch('startDate') ||
                                                !form.watch('endDate')
                                            }
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </>
                )}
            </CardHeader>
            {sellerOrders.length > 0 && (
                <OrdersTable
                    orders={filteredSellerOrders ?? sellerOrders}
                    isSellersTable={true}
                />
            )}
        </Card>
    );
}
