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

    if (!seller) {
        return null;
    }

    return (
        <Card className='sm:col-span-3 relative'>
            <ClosePanel setClosePanel={() => setSelectedSellerId(null)} />
            <TncSellerDataHeader seller={seller} />

            <Separator className='my-6' />

            <CardContent>
                <TncSellerOrders seller={seller} />
            </CardContent>
        </Card>
    );
}
