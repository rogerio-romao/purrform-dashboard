'use client';

import { useEffect, useState } from 'react';

import Loading from '@/components/common/loading';
import OrdersTable from '@/components/common/orders-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { CreditSystemOrder, CreditSystemTrader } from '@/app/lib/types';
import { gbpFormatter } from '@/app/lib/utils';

interface TncSellerOrdersProps {
    seller: CreditSystemTrader | null;
}

export default function TncSellerOrders({ seller }: TncSellerOrdersProps) {
    const [loading, setLoading] = useState(true);
    const [sellerOrders, setSellerOrders] = useState<CreditSystemOrder[]>([]);
    const [error, setError] = useState<string | null>(null);

    const uniqueCustomers = new Set(
        sellerOrders.map((order) => order.ordered_for ?? 'N/A')
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
                                    {sellerOrders.length}
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
                                        sellerOrders.reduce(
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
                        </CardContent>
                    </>
                )}
            </CardHeader>
            {sellerOrders.length > 0 && (
                <OrdersTable orders={sellerOrders} isSellersTable={true} />
            )}
        </Card>
    );
}
