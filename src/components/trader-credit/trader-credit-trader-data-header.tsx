import type { CreditSystemTrader } from '@/app/lib/types';

import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface TraderCreditTraderDataHeaderProps {
    companyName: string;
    trader: CreditSystemTrader;
}

export default function TraderCreditTraderDataHeader({
    companyName,
    trader,
}: TraderCreditTraderDataHeaderProps) {
    const { has_overdue, credit_ceiling, current_balance } = trader;

    const remainingBalancePercent = (current_balance / credit_ceiling) * 100;
    const remainingBalanceWarning = remainingBalancePercent < 25;
    const remainingBalanceTextClass = remainingBalanceWarning
        ? 'text-yellow-500'
        : '';

    return (
        <>
            <CardHeader>
                <CardTitle className='text-lg'>
                    Trader Credit Information
                </CardTitle>
            </CardHeader>
            <CardContent className='mt-3'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    <div className='col-span-1'>
                        <CardDescription>Trader:</CardDescription>
                        <CardTitle className='mt-1'>{companyName}</CardTitle>
                        <p className='text-muted-foreground mt-[0.15rem]'>
                            {trader.bc_customer_email}
                        </p>
                        {trader.invoice_email && (
                            <p className='text-muted-foreground mt-[0.15rem]'>
                                <span className='dark:text-white text-gray-800'>
                                    Invoices:
                                </span>{' '}
                                {trader.invoice_email}
                            </p>
                        )}
                        {trader.has_overdue && (
                            <span className='text-xs text-red-500 font-semibold uppercase tracking-wider'>
                                Overdue orders
                            </span>
                        )}
                    </div>
                    <div className='grid grid-cols-2 col-span-2 gap-4'>
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
                            <div className='flex items-center'>
                                <CardDescription>Company:</CardDescription>
                                <p className='ml-1'>
                                    {trader.bc_customer_company || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div>
                                <CardDescription>Credit Limit:</CardDescription>
                                <p className='ml-1 text-xl font-bold'>
                                    £ {trader.credit_ceiling}
                                </p>
                            </div>
                            <div>
                                <CardDescription>
                                    Current Balance:
                                </CardDescription>
                                <p className='ml-1 inline-flex items-center font-bold'>
                                    <span className='text-xl'>
                                        £ {trader.current_balance}
                                    </span>
                                    {remainingBalanceWarning && (
                                        <span
                                            className={`text-xs ml-2 ${remainingBalanceTextClass} border border-yellow-500 px-1 rounded`}
                                        >
                                            &lt; 25%
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    );
}
