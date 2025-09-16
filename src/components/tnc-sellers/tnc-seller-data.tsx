import { useEffect, useState } from 'react';

import supabase from '@/app/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import ClosePanel from '@/components/common/close-panel';
import TncSellerDataActions from './tnc-seller-data-actions';
import TncSellerDataHeader from './tnc-seller-data-header';
import TncSellerOrders from './tnc-seller-orders';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

import type {
    CreditSystemOrder,
    CreditSystemTrader,
    SupabaseError,
    TNCSeller,
} from '@/app/lib/types';

interface TraderCreditTraderDataProps {
    seller: CreditSystemTrader | null;
    selectedSellerId: number | null;
    setSelectedSellerId: (id: number | null) => void;
}

export default function TncSellerData({
    seller,
    selectedSellerId,
    setSelectedSellerId,
}: TraderCreditTraderDataProps) {
    const { toast } = useToast();
    const [pendingOrdersForSeller, setPendingOrdersForSeller] = useState<
        CreditSystemOrder[]
    >([]);
    const [showPendingOrdersForSeller, setShowPendingOrdersForSeller] =
        useState<boolean>(false);
    const [orderHistoryForSeller, setOrderHistoryForSeller] = useState<
        CreditSystemOrder[]
    >([]);
    const [showOrderHistoryForSeller, setShowOrderHistoryForSeller] =
        useState<boolean>(false);

    useEffect(() => {
        setShowOrderHistoryForSeller(false);
        setShowPendingOrdersForSeller(false);
    }, [selectedSellerId]);

    if (!seller) {
        return null;
    }

    async function handleViewPendingPaymentsForTrader() {
        if (!seller) {
            return;
        }

        const response = await fetch(
            `${BACKEND_BASE_URL}/getPendingOrdersForTrader?traderId=${seller.id}`
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

            setPendingOrdersForSeller(data);
            setShowPendingOrdersForSeller(true);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: `Failed to fetch pending orders, please try again.`,
            });
        }
    }

    async function handleViewOrderHistoryForSeller() {
        if (!seller) {
            return;
        }

        const response = await fetch(
            `${BACKEND_BASE_URL}/getOrderHistoryForTrader?traderId=${seller.id}`
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

            setOrderHistoryForSeller(data);
            setShowOrderHistoryForSeller(true);
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
            <ClosePanel setClosePanel={() => setSelectedSellerId(null)} />
            <TncSellerDataHeader seller={seller} />

            <Separator className='my-6' />

            {/* <TncSellerDataActions
                seller={seller}
                handleViewPendingPayments={handleViewPendingPaymentsForTrader}
                handleViewOrderHistory={handleViewOrderHistoryForSeller}
            /> */}

            <CardContent>
                <TncSellerOrders seller={seller} />
            </CardContent>
        </Card>
    );
}
