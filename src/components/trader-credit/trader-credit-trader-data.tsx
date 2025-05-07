import { useEffect, useState } from 'react';

import supabase from '@/app/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import ClosePanel from '../common/close-panel';
import OrderHistoryForTrader from './order-history-for-trader';
import PendingOrdersForTrader from './pending-orders-for-trader';
import TraderCreditTraderDataActions from './trader-credit-trader-data-actions';
import TraderCreditTraderDataHeader from './trader-credit-trader-data-header';

import type {
    CreditSystemOrder,
    CreditSystemTrader,
    SupabaseError,
} from '@/app/lib/types';

interface TraderCreditTraderDataProps {
    trader: CreditSystemTrader | undefined;
    setSelectedTraderId: React.Dispatch<React.SetStateAction<number | null>>;
    setCreditTraders: React.Dispatch<
        React.SetStateAction<CreditSystemTrader[]>
    >;
}

export default function TraderCreditTraderData({
    trader,
    setSelectedTraderId,
    setCreditTraders,
}: TraderCreditTraderDataProps) {
    const { toast } = useToast();
    const [pendingOrdersForTrader, setPendingOrdersForTrader] = useState<
        CreditSystemOrder[]
    >([]);
    const [showPendingOrdersForTrader, setShowPendingOrdersForTrader] =
        useState<boolean>(false);
    const [orderHistoryForTrader, setOrderHistoryForTrader] = useState<
        CreditSystemOrder[]
    >([]);
    const [showOrderHistoryForTrader, setShowOrderHistoryForTrader] =
        useState<boolean>(false);

    useEffect(() => {
        if (!trader) {
            return;
        }
        const changes = supabase
            .channel('credit-order-changes-single-trader')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'credit_system_orders',
                    filter: `trader_id=eq.${trader.id}`,
                },
                (payload) => {
                    console.log('Change received!', payload);
                    if (payload.eventType === 'INSERT') {
                        if (
                            payload.new.order_status === 'pending' ||
                            payload.new.order_status === 'overdue'
                        ) {
                            setPendingOrdersForTrader((prevOrders) => [
                                ...prevOrders,
                                payload.new as CreditSystemOrder,
                            ]);
                        }
                        setOrderHistoryForTrader((prevOrders) => [
                            ...prevOrders,
                            payload.new as CreditSystemOrder,
                        ]);
                    } else if (payload.eventType === 'UPDATE') {
                        setPendingOrdersForTrader((prevOrders) =>
                            prevOrders.map((order) =>
                                order.id === payload.new.id
                                    ? (payload.new as CreditSystemOrder)
                                    : order
                            )
                        );
                        setOrderHistoryForTrader((prevOrders) =>
                            prevOrders.map((order) =>
                                order.id === payload.new.id
                                    ? (payload.new as CreditSystemOrder)
                                    : order
                            )
                        );
                    }
                }
            )
            .on(
                // postgres_changes event for DELETE is not filterable, so we need to handle it separately
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'credit_system_orders',
                },
                (payload) => {
                    console.log('Change received!', payload);
                    setPendingOrdersForTrader((prevOrders) =>
                        prevOrders.filter(
                            (order) => order.id !== payload.old.id
                        )
                    );
                    setOrderHistoryForTrader((prevOrders) =>
                        prevOrders.filter(
                            (order) => order.id !== payload.old.id
                        )
                    );
                }
            )
            .subscribe();

        return () => {
            changes.unsubscribe();
        };
    }, [trader]);

    if (!trader) {
        return null;
    }

    const companyName = trader.bc_customer_company
        ? trader.bc_customer_company
        : `${trader.bc_customer_first_name} ${trader.bc_customer_last_name}`;

    async function handleRemoveTrader() {
        if (!trader) {
            return;
        }

        const response = await fetch(
            `http://localhost:5555/removeTraderFromCreditSystem?traderId=${trader.id}`
        );

        if (response.ok) {
            toast({
                variant: 'default',
                title: 'Trader Removed',
                description: `${companyName} has been removed from the credit system.`,
            });

            setCreditTraders((prevTraders) =>
                prevTraders.filter((t) => t.id !== trader.id)
            );
            setSelectedTraderId(null);
        } else {
            const message = await response.text();
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Failed to remove trader: ${message}`,
            });
        }
    }

    async function handleViewPendingPaymentsForTrader() {
        if (!trader) {
            return;
        }

        const response = await fetch(
            `http://localhost:5555/getPendingOrdersForTrader?traderId=${trader.id}`
        );

        if (response.ok) {
            const data = (await response.json()) as
                | CreditSystemOrder[]
                | SupabaseError;

            if ('error' in data) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: `Failed to fetch pending orders: ${data.error}`,
                });
                return;
            }

            setPendingOrdersForTrader(data);
            setShowPendingOrdersForTrader(true);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Failed to fetch pending orders, please try again.`,
            });
        }
    }

    async function handleViewOrderHistoryForTrader() {
        if (!trader) {
            return;
        }

        const response = await fetch(
            `http://localhost:5555/getOrderHistoryForTrader?traderId=${trader.id}`
        );

        if (response.ok) {
            const data = (await response.json()) as
                | CreditSystemOrder[]
                | SupabaseError;

            if ('error' in data) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: `Failed to fetch order history: ${data.error}`,
                });
                return;
            }

            setOrderHistoryForTrader(data);
            setShowOrderHistoryForTrader(true);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Failed to fetch order history, please try again.`,
            });
        }
    }

    return (
        <Card className='sm:col-span-3 relative'>
            <ClosePanel setClosePanel={() => setSelectedTraderId(null)} />
            <TraderCreditTraderDataHeader
                companyName={companyName}
                trader={trader}
            />

            <Separator className='my-6' />

            <TraderCreditTraderDataActions
                trader={trader}
                handleViewPendingPayments={handleViewPendingPaymentsForTrader}
                handleViewOrderHistory={handleViewOrderHistoryForTrader}
                handleRemoveTrader={handleRemoveTrader}
                companyName={companyName}
            />

            <CardContent>
                <PendingOrdersForTrader
                    companyName={companyName}
                    pendingOrdersForTrader={pendingOrdersForTrader}
                    showPendingOrdersForTrader={showPendingOrdersForTrader}
                    setShowPendingOrdersForTrader={
                        setShowPendingOrdersForTrader
                    }
                />
            </CardContent>

            <CardContent>
                <OrderHistoryForTrader
                    companyName={companyName}
                    orderHistoryForTrader={orderHistoryForTrader}
                    showOrderHistoryForTrader={showOrderHistoryForTrader}
                    setShowOrderHistoryForTrader={setShowOrderHistoryForTrader}
                />
            </CardContent>
        </Card>
    );
}
