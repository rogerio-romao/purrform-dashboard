'use client';

import { useEffect, useState } from 'react';

import supabase from '@/app/lib/supabase';
import type { BcCustomer, CreditSystemTrader } from '@/app/lib/types';
import { useToast } from '@/hooks/use-toast';

import TraderCreditAddTrader from '@/components/trader-credit/trader-credit-add-trader';
import TraderCreditForm from '@/components/trader-credit/trader-credit-form';
import TraderCreditTraderData from '@/components/trader-credit/trader-credit-trader-data';
import ViewAllPendingOrders from '@/components/trader-credit/view-all-pending-orders';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { BACKEND_BASE_URL } from '@/app/lib/definitions';

export default function TraderCredit() {
    const { toast } = useToast();
    const [creditTraders, setCreditTraders] = useState<CreditSystemTrader[]>(
        []
    );
    const [selectedTraderId, setSelectedTraderId] = useState<number | null>(
        null
    );
    const [allTraders, setAllTraders] = useState<BcCustomer[]>([]);

    const selectedTrader = creditTraders.find(
        (trader) => trader.bc_customer_id === selectedTraderId
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
                setCreditTraders(data);
            } catch (error) {
                console.error('Error fetching traders:', error);
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description:
                        'An error occurred while fetching the traders data.',
                });
            }
        };

        const fetchAllTraders = async () => {
            try {
                const response = await fetch(
                    `${BACKEND_BASE_URL}/getAllBcTradeCustomers`
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = (await response.json()) as BcCustomer[];
                setAllTraders(data);
            } catch (error) {
                console.error('Error fetching traders:', error);
                toast({
                    variant: 'destructive',
                    title: 'ERROR',
                    description:
                        'An error occurred while fetching the traders data.',
                });
            }
        };

        fetchCreditTraders().then(() => fetchAllTraders());
    }, [toast]);

    const mappedCreditTraders = creditTraders
        .map((trader) => ({
            id: trader.id,
            bc_id: trader.bc_customer_id,
            email: trader.bc_customer_email,
            company: trader.bc_customer_company
                ? trader.bc_customer_company
                : `${trader.bc_customer_first_name} ${trader.bc_customer_last_name}`,
        }))
        .sort((a, b) => a.company.localeCompare(b.company));

    const mappedAllTraders = allTraders
        .filter(
            (trader) =>
                !mappedCreditTraders.some(
                    (creditTrader) => creditTrader.bc_id === trader.id
                )
        )
        .map((trader) => ({
            id: trader.id,
            email: trader.email,
            first_name: trader.first_name,
            last_name: trader.last_name,
            company: trader.company
                ? trader.company
                : `${trader.first_name} ${trader.last_name}`,
        }))
        .sort((a, b) => a.company.localeCompare(b.company));

    useEffect(() => {
        const changes = supabase
            .channel('credit-trader-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'credit_system_traders',
                },
                (payload) => {
                    if (payload.eventType === 'DELETE') {
                        setCreditTraders((prevTraders) =>
                            prevTraders.filter(
                                (trader) => trader.id !== payload.old.id
                            )
                        );
                    } else if (payload.eventType === 'INSERT') {
                        setCreditTraders((prevTraders) => [
                            ...prevTraders,
                            payload.new as CreditSystemTrader,
                        ]);
                    } else if (payload.eventType === 'UPDATE') {
                        setCreditTraders((prevTraders) =>
                            prevTraders.map((trader) =>
                                trader.id === payload.new.id
                                    ? (payload.new as CreditSystemTrader)
                                    : trader
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            changes.unsubscribe();
        };
    }, []);

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
                    <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3'>
                        <Card className='sm:col-span-3'>
                            <CardHeader className='pb-3'>
                                <CardTitle>Trader Credit System</CardTitle>
                                <CardDescription className='leading-relaxed'>
                                    Manage Trade group customers. See and adjust
                                    their credit limits, view current balance
                                    and view their order history and pending
                                    payments.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <ViewAllPendingOrders traders={mappedCreditTraders} />

                        <TraderCreditForm
                            mappedTraders={mappedCreditTraders}
                            setSelectedTraderId={setSelectedTraderId}
                        />

                        <TraderCreditTraderData
                            trader={selectedTrader}
                            selectedTraderId={selectedTraderId}
                            setSelectedTraderId={setSelectedTraderId}
                            setCreditTraders={setCreditTraders}
                        />

                        <TraderCreditAddTrader
                            mappedTraders={mappedAllTraders}
                            setCreditTraders={setCreditTraders}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
