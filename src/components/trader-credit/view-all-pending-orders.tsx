import { useState } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components//ui/card';
import { Button } from '@/components/ui/button';
import ClosePanel from '../common/close-panel';
import OrdersTable from './orders-table';

import type { CreditSystemOrder } from '@/app/lib/types';

interface ViewAllPendingOrdersProps {
    traders: { id: number; email: string; company: string }[];
}

export default function ViewAllPendingOrders({
    traders,
}: ViewAllPendingOrdersProps) {
    const [allPendingOrders, setAllPendingOrders] = useState<
        CreditSystemOrder[]
    >([]);
    const [showAllPendingOrders, setShowAllPendingOrders] =
        useState<boolean>(false);

    const handleFetchAllPendingOrders = async () => {
        try {
            const response = await fetch(
                'http://localhost:5555/getAllTraderPendingOrders'
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = (await response.json()) as CreditSystemOrder[];
            setAllPendingOrders(data);
            setShowAllPendingOrders(true);
        } catch (error) {
            console.error('Error fetching pending orders:', error);
        }
    };

    const ordersGroupedByCompany = Object.groupBy(allPendingOrders, (order) => {
        const companyName =
            traders.find((trader) => trader.id === order.trader_id)?.company ??
            'Unknown Company';

        return companyName;
    }) as Record<string, CreditSystemOrder[]>;
    const groupedOrdersArray = Object.entries(ordersGroupedByCompany);

    return (
        <Card className='sm:col-span-3 w-full'>
            <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>
                    View All Pending Orders
                </CardTitle>
                <CardDescription className='leading-relaxed'>
                    Quickly view and manage all overdue and pending orders for
                    all traders.
                </CardDescription>
            </CardHeader>
            <CardContent className='mt-3'>
                <Button onClick={handleFetchAllPendingOrders}>
                    Fetch All Pending Orders
                </Button>
                {showAllPendingOrders &&
                    (!allPendingOrders || allPendingOrders.length === 0) && (
                        <div className='mt-6 py-2 relative border'>
                            <div className='text-gray-500 dark:text-gray-300 text-sm py-2'>
                                No pending orders available.
                            </div>
                            <ClosePanel
                                setClosePanel={setShowAllPendingOrders}
                            />
                        </div>
                    )}
                {showAllPendingOrders && allPendingOrders.length > 0 && (
                    <div className='mt-6 p-2 relative border rounded'>
                        <div className='text-center text-gray-500 dark:text-gray-300 text-sm py-2'>
                            Showing all pending and overdue orders for all
                            traders
                        </div>
                        <ClosePanel setClosePanel={setShowAllPendingOrders} />
                        {groupedOrdersArray.map(([companyName, orders]) => (
                            <div
                                key={companyName}
                                className='my-3 border border-gray-200 rounded'
                            >
                                <div className='font-semibold text-center bg-gray-200 dark:bg-gray-300 p-3 text-gray-800'>
                                    Orders from company: {companyName}
                                </div>
                                {orders.length === 0 && (
                                    <p>No pending orders.</p>
                                )}
                                {orders.length > 0 && (
                                    <OrdersTable orders={orders!} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
