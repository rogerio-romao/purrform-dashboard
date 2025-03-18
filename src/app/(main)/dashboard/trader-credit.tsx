import { useEffect, useState } from 'react';

import type { BcCustomer, CreditSystemTrader } from '@/app/lib/types';
import { useToast } from '@/hooks/use-toast';

import TraderCreditAddTrader from '@/components/trader-credit-add-trader';
import TraderCreditForm from '@/components/trader-credit-form';
import TraderCreditTraderData from '@/components/trader-credit-trader-data';

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

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
                    'http://localhost:5555/getCreditSystemTraders'
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
                    'http://localhost:5555/getAllBcTradeCustomers'
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
            id: trader.bc_customer_id,
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
                    (creditTrader) => creditTrader.id === trader.id
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

    return (
        <div className='flex min-h-screen w-full flex-col bg-muted/40 mt-4'>
            <div className='flex flex-col sm:gap-4 sm:py-4 '>
                <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
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

                        <TraderCreditForm
                            mappedTraders={mappedCreditTraders}
                            setSelectedTraderId={setSelectedTraderId}
                        />

                        <TraderCreditTraderData
                            trader={selectedTrader}
                            setSelectedTraderId={setSelectedTraderId}
                            setCreditTraders={setCreditTraders}
                        />

                        <TraderCreditAddTrader
                            mappedTraders={mappedAllTraders}
                            setCreditTraders={setCreditTraders}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
