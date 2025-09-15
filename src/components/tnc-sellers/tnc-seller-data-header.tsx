import type { CreditSystemTrader } from '@/app/lib/types';

import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface TncSellerDataHeaderProps {
    seller: CreditSystemTrader;
}

export default function TncSellerDataHeader({
    seller,
}: TncSellerDataHeaderProps) {
    console.log('Seller in Header:', seller);
    const { has_overdue, credit_ceiling, current_balance } = seller;

    const remainingBalancePercent = (current_balance / credit_ceiling) * 100;
    const remainingBalanceWarning = remainingBalancePercent < 25;
    const remainingBalanceTextClass = remainingBalanceWarning
        ? 'text-yellow-500'
        : '';

    return (
        <>
            <CardHeader>
                <CardTitle className='text-lg'>Seller Information</CardTitle>
            </CardHeader>
            <CardContent className='mt-3'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    <div className='col-span-1'>
                        <CardDescription>Seller:</CardDescription>
                        <CardTitle className='mt-1'>
                            {seller.bc_customer_first_name}{' '}
                            {seller.bc_customer_last_name}
                        </CardTitle>
                        <p className='text-muted-foreground mt-[0.15rem]'>
                            {seller.bc_customer_email}
                        </p>
                        {seller.has_overdue && (
                            <span className='text-xs text-red-500 font-semibold uppercase tracking-wider'>
                                Overdue orders
                            </span>
                        )}
                    </div>
                    <div className='grid grid-cols-2 col-span-2 gap-4'>
                        <div>
                            <div className='flex items-center'>
                                <CardDescription>
                                    BC Customer ID:
                                </CardDescription>
                                <p className='ml-1'>{seller.bc_customer_id}</p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>First Name:</CardDescription>
                                <p className='pl-1'>
                                    {seller.bc_customer_first_name}
                                </p>
                            </div>
                            <div className='flex items-center'>
                                <CardDescription>Last Name:</CardDescription>
                                <p className='pl-1'>
                                    {seller.bc_customer_last_name}
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div>
                                <CardDescription>Credit Limit:</CardDescription>
                                <p className='ml-1 text-xl font-bold'>
                                    £ {seller.credit_ceiling}
                                </p>
                            </div>
                            <div>
                                <CardDescription>
                                    Current Balance:
                                </CardDescription>
                                <p className='ml-1 inline-flex items-center font-bold'>
                                    <span className='text-xl'>
                                        £ {seller.current_balance}
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
