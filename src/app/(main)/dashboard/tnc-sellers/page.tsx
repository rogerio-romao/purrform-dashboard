'use client';

import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

import TncSellerData from '@/components/tnc-sellers/tnc-seller-data';
import TncSellerForm from '@/components/tnc-sellers/tnc-seller-form';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

import type { CreditSystemTrader, TNCSeller } from '@/app/lib/types';

export default function TncSellersPage() {
    const { toast } = useToast();

    const [traders, setTraders] = useState<CreditSystemTrader[]>([]);
    const [mappedSellers, setMappedSellers] = useState<TNCSeller[]>([]);
    const [selectedSellerId, setSelectedSellerId] = useState<number | null>(
        null
    );

    useEffect(() => {
        const fetchCreditTraders = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getCreditSystemTraders`
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = (await response.json()) as CreditSystemTrader[];

                const mapped = data
                    .filter((trader) => Boolean(trader.is_tnc_seller))
                    .map((trader) => ({
                        bc_id: trader.id,
                        first_name: trader.bc_customer_first_name,
                        last_name: trader.bc_customer_last_name,
                        email: trader.bc_customer_email,
                    }));

                setMappedSellers(mapped);
                setTraders(data);
            } catch (error) {
                console.error('Error fetching traders:', error);
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description:
                        'An error occurred while fetching the sellers data.',
                });
            }
        };

        fetchCreditTraders();
    }, [toast]);

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
                        <Card className='sm:col-span-3'>
                            <CardHeader className='pb-3'>
                                <CardTitle>TNC Sellers</CardTitle>
                                <CardDescription className='leading-relaxed'>
                                    Check the sales from the TNC sellers team.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <TncSellerForm
                            mappedSellers={mappedSellers}
                            setSelectedSellerId={setSelectedSellerId}
                        />

                        <TncSellerData
                            selectedSellerId={selectedSellerId}
                            setSelectedSellerId={setSelectedSellerId}
                            seller={
                                traders.find(
                                    (trader) => trader.id === selectedSellerId
                                ) || null
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
