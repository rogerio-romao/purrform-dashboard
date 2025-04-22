import { useState } from 'react';

import type {
    CreditSystemOrder,
    CreditSystemTrader,
    SupabaseError,
} from '@/app/lib/types';
import { useToast } from '@/hooks/use-toast';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import PendingOrdersForTrader from './pending-orders-for-trader';
import TraderCreditTraderDataActions from './trader-credit-trader-data-actions';
import TraderCreditTraderDataHeader from './trader-credit-trader-data-header';

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

    async function handleViewPendingPayments() {
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

    return (
        <Card className='sm:col-span-3'>
            <TraderCreditTraderDataHeader
                companyName={companyName}
                trader={trader}
            />

            <Separator className='my-6' />

            <TraderCreditTraderDataActions
                trader={trader}
                handleViewPendingPayments={handleViewPendingPayments}
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
        </Card>
    );
}
