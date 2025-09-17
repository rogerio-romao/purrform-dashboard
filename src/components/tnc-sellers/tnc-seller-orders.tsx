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
        const fetchSellerOrders = async () => {
            if (!seller) return;

            try {
                const response = await fetch(
                    `https://7eaf77623caf.ngrok-free.app/getOrderHistoryForTrader?traderId=${seller.id}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch seller orders');
                }

                const data = (await response.json()) as CreditSystemOrder[];
                setSellerOrders(data);
            } catch (error) {
                setError(
                    'Error fetching seller orders, please try again later.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSellerOrders();
    }, []);

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
                    Order History for {seller?.bc_customer_first_name}{' '}
                    {seller?.bc_customer_last_name}
                </CardTitle>
                {sellerOrders.length === 0 ? (
                    <CardDescription>No orders available.</CardDescription>
                ) : (
                    <CardDescription className='flex gap-6'>
                        <div className='font-semibold uppercase'>Summary:</div>
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
                                        (acc, order) => acc + order.order_total,
                                        0
                                    )
                                )}
                            </span>
                        </div>
                    </CardDescription>
                )}
            </CardHeader>
            {sellerOrders.length > 0 && (
                <OrdersTable orders={sellerOrders} isSellersTable={true} />
            )}
        </Card>
    );
}
