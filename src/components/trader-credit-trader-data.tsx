import type { CreditSystemTrader } from '@/app/lib/types';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';

interface TraderCreditTraderDataProps {
    trader: CreditSystemTrader | undefined;
}

export default function TraderCreditTraderData({
    trader,
}: TraderCreditTraderDataProps) {
    if (!trader) {
        return null;
    }

    const companyName = trader.bc_customer_company
        ? trader.bc_customer_company
        : `${trader.bc_customer_first_name} ${trader.bc_customer_last_name}`;

    return (
        <Card className='sm:col-span-3'>
            <CardHeader>
                <CardTitle className='text-lg'>
                    Trader Credit Information
                </CardTitle>
            </CardHeader>
            <CardContent className='mt-3'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <CardDescription>Trader:</CardDescription>
                        <CardTitle className='mt-1'>{companyName}</CardTitle>
                        <p className='text-muted-foreground mt-[0.15rem]'>
                            {trader.bc_customer_email}
                        </p>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <div className='flex items-center'>
                                <CardDescription>Customer ID:</CardDescription>
                                <p className='ml-1'>{trader.bc_customer_id}</p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>First Name:</CardDescription>
                                <p className='pl-1'>
                                    {trader.bc_customer_first_name}
                                </p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>Last Name:</CardDescription>
                                <p className='pl-1'>
                                    {trader.bc_customer_last_name}
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center'>
                                <CardDescription>Company:</CardDescription>
                                <p className='ml-1'>
                                    {trader.bc_customer_company || 'N/A'}
                                </p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>Credit Limit:</CardDescription>
                                <p className='ml-1'>
                                    £ {trader.credit_ceiling}
                                </p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>
                                    Current Balance:
                                </CardDescription>
                                <p className='ml-1'>
                                    £ {trader.current_balance}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
